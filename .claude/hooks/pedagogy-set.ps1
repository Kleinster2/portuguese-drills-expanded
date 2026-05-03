# PostToolUse hook for the Skill tool.
# When the `pedagogy` skill is invoked, touch a sentinel file so the
# PreToolUse pedagogy-check can confirm pedagogy was loaded recently.
# No-op for any other Skill call.

$ErrorActionPreference = 'SilentlyContinue'

$json = [Console]::In.ReadToEnd()
try { $data = $json | ConvertFrom-Json } catch { exit 0 }

if ($data.tool_name -ne 'Skill') { exit 0 }
if ($data.tool_input.skill -ne 'pedagogy') { exit 0 }

$sentinel = Join-Path $PSScriptRoot '..\.pedagogy-loaded'
if (Test-Path $sentinel) {
    (Get-Item $sentinel).LastWriteTime = Get-Date
} else {
    New-Item -ItemType File -Path $sentinel -Force | Out-Null
}
exit 0
