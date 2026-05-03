"""Repair benchmark.json: fix UTF-8 encoding, add eval_name fields, append analyst notes."""
import json
from pathlib import Path

iter_dir = Path(r"C:\Users\klein\portuguese\.claude\skills\pedagogy-workspace\iteration-1")

with open(iter_dir / "benchmark.json", "r", encoding="utf-8") as f:
    benchmark = json.load(f)

eval_dir_map = {
    1: ("eval-1-morar-vs-viver-drill", "morar-vs-viver-drill"),
    2: ("eval-2-open-closed-e-primer", "open-closed-e-primer"),
    3: ("eval-3-ep-cafe-worksheet", "ep-cafe-worksheet"),
}

for run in benchmark["runs"]:
    eval_id = run["eval_id"]
    dir_name, name = eval_dir_map[eval_id]
    config = run["configuration"]
    grading_path = iter_dir / dir_name / config / f"run-{run['run_number']}" / "grading.json"
    with open(grading_path, "r", encoding="utf-8") as f:
        grading = json.load(f)
    run["expectations"] = grading["expectations"]
    run["eval_name"] = name

benchmark["notes"] = [
    "Pass-rate delta is +29 pp (with-skill 100% vs without-skill 71%). The skill helped most where pedagogy details are non-obvious from general knowledge.",
    "Eval 2 (open/closed E primer) shows the largest gap (+50 pp). Without the skill, the model invented forms (*éste*, fake circumflex on *ser*, *gelo* split into two pronunciations) and used carioca-style Y-glides (vo-SÊY) instead of paulista. With the skill, all forms were real and respellings were paulista.",
    "Eval 3 (EP café worksheet) gap (+25 pp) was driven by project-specific worksheet conventions (Estudante/Data headers) and line-by-line dialogue glossing — both PEDAGOGY rules that general EP knowledge alone doesn't cover.",
    "Eval 1 (morar vs viver drill) gap (+11 pp) was small. Both runs knew the verb distinction; the difference was that the baseline put plural conjugations (Nós moramos, Eles vivem) in the A1 fixed opener, violating singular-before-plural.",
    "Non-discriminating assertions (passed in both configurations): 'valid JSON', 'Lisbon vocabulary present', 'no fake accents' for non-phonetic evals, 'generic audience'. These check baseline competence, not pedagogy depth.",
    "Cost: with-skill adds ~7s average runtime and ~24k tokens (reading PEDAGOGY.md). Material but not prohibitive for content-creation tasks.",
    "Caveat: only 1 run per configuration per eval, so variance is unmeasured. The directional finding is clear but exact deltas would tighten with 3 runs.",
]

with open(iter_dir / "benchmark.json", "w", encoding="utf-8") as f:
    json.dump(benchmark, f, indent=2, ensure_ascii=False)

print("benchmark.json repaired")
