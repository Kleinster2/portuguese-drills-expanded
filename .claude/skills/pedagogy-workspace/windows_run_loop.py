"""Windows-compatible wrapper for skill-creator's run_loop.

The upstream run_eval.py uses select.select() on subprocess pipes,
which Win32 doesn't support (pipes aren't sockets on Windows). This
wrapper:
  1. Monkey-patches scripts.run_eval.run_single_query with a
     threading-based reader (background thread reads the subprocess
     pipe, main thread polls a queue with timeout).
  2. Monkey-patches scripts.run_eval.ProcessPoolExecutor to
     ThreadPoolExecutor so the patch reaches the workers
     (process workers re-import scripts.run_eval fresh and would
     lose the patch).

Then it just calls scripts.run_loop.main() with the original CLI args.
"""

import os
import sys
import json
import time
import uuid
import queue
import threading
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SKILL_CREATOR = Path(r"C:\Users\klein\.claude\plugins\cache\claude-plugins-official\skill-creator\b3efe4cdc5e3\skills\skill-creator")
sys.path.insert(0, str(SKILL_CREATOR))

import scripts.run_eval as run_eval_mod


def run_single_query_windows(
    query: str,
    skill_name: str,
    skill_description: str,
    timeout: int,
    project_root: str,
    model=None,
) -> bool:
    """Windows-compatible drop-in for run_eval.run_single_query."""
    unique_id = uuid.uuid4().hex[:8]
    clean_name = f"{skill_name}-skill-{unique_id}"
    project_commands_dir = Path(project_root) / ".claude" / "commands"
    command_file = project_commands_dir / f"{clean_name}.md"

    try:
        project_commands_dir.mkdir(parents=True, exist_ok=True)
        indented_desc = "\n  ".join(skill_description.split("\n"))
        command_content = (
            f"---\n"
            f"description: |\n"
            f"  {indented_desc}\n"
            f"---\n\n"
            f"# {skill_name}\n\n"
            f"This skill handles: {skill_description}\n"
        )
        command_file.write_text(command_content, encoding="utf-8")

        cmd = [
            "claude",
            "-p", query,
            "--output-format", "stream-json",
            "--verbose",
            "--include-partial-messages",
        ]
        if model:
            cmd.extend(["--model", model])

        env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}

        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            cwd=project_root,
            env=env,
            text=True,
            encoding="utf-8",
            errors="replace",
            bufsize=1,
        )

        line_queue: "queue.Queue[str | None]" = queue.Queue()

        def reader():
            try:
                for line in process.stdout:
                    line_queue.put(line)
            finally:
                line_queue.put(None)

        t = threading.Thread(target=reader, daemon=True)
        t.start()

        triggered = False
        start_time = time.time()
        pending_tool_name = None
        accumulated_json = ""

        try:
            while time.time() - start_time < timeout:
                try:
                    line = line_queue.get(timeout=1.0)
                except queue.Empty:
                    continue

                if line is None:
                    return triggered

                line = line.strip()
                if not line:
                    continue

                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue

                if event.get("type") == "stream_event":
                    se = event.get("event", {})
                    se_type = se.get("type", "")

                    if se_type == "content_block_start":
                        cb = se.get("content_block", {})
                        if cb.get("type") == "tool_use":
                            tool_name = cb.get("name", "")
                            if tool_name in ("Skill", "Read"):
                                pending_tool_name = tool_name
                                accumulated_json = ""
                            else:
                                return False

                    elif se_type == "content_block_delta" and pending_tool_name:
                        delta = se.get("delta", {})
                        if delta.get("type") == "input_json_delta":
                            accumulated_json += delta.get("partial_json", "")
                            if clean_name in accumulated_json:
                                return True

                    elif se_type in ("content_block_stop", "message_stop"):
                        if pending_tool_name:
                            return clean_name in accumulated_json
                        if se_type == "message_stop":
                            return False

                elif event.get("type") == "assistant":
                    message = event.get("message", {})
                    for content_item in message.get("content", []):
                        if content_item.get("type") != "tool_use":
                            continue
                        tool_name = content_item.get("name", "")
                        tool_input = content_item.get("input", {})
                        if tool_name == "Skill" and clean_name in tool_input.get("skill", ""):
                            triggered = True
                        elif tool_name == "Read" and clean_name in tool_input.get("file_path", ""):
                            triggered = True
                        return triggered

                elif event.get("type") == "result":
                    return triggered
        finally:
            if process.poll() is None:
                process.kill()
                process.wait()

        return triggered
    finally:
        if command_file.exists():
            command_file.unlink()


run_eval_mod.run_single_query = run_single_query_windows
run_eval_mod.ProcessPoolExecutor = ThreadPoolExecutor


from scripts.run_loop import main

if __name__ == "__main__":
    main()
