# PreToolUse hook for the Skill tool.
# Blocks content-creation skills unless `pedagogy` was invoked in the last
# 60 minutes (sentinel file written by pedagogy-set.ps1). Pass-through for
# any other Skill call.

$ErrorActionPreference = 'SilentlyContinue'

$gated = @(
    'worksheet-create',
    'drill-create',
    'pronunciation-lesson',
    'diagnostic-test-manager',
    'exercise-scaffold',
    'exercise-draft',
    'exercise-verify',
    'dialogue-generate'
)

$json = [Console]::In.ReadToEnd()
try { $data = $json | ConvertFrom-Json } catch { exit 0 }

if ($data.tool_name -ne 'Skill') { exit 0 }
$skill = $data.tool_input.skill
if ($gated -notcontains $skill) { exit 0 }

$sentinel = Join-Path $PSScriptRoot '..\.pedagogy-loaded'
$ttlMinutes = 60

if (-not (Test-Path $sentinel)) {
    [Console]::Error.WriteLine("Pedagogy not loaded this session. Invoke the 'pedagogy' skill via the Skill tool before running '$skill' — this is a hard precondition. The hard rules (no fake accents, BP/EP separation, paulista pronunciation, native usage filter) must be in context before any content creation.")
    exit 2
}

$age = ((Get-Date) - (Get-Item $sentinel).LastWriteTime).TotalMinutes
if ($age -gt $ttlMinutes) {
    $rounded = [math]::Round($age, 1)
    [Console]::Error.WriteLine("Pedagogy load is stale ($rounded min old, max $ttlMinutes). Re-invoke the 'pedagogy' skill via the Skill tool before running '$skill'.")
    exit 2
}

exit 0
