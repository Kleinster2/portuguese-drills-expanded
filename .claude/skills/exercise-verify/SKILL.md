---
name: exercise-verify
description: Verify worksheet exercises against real-world Portuguese usage. Searches each sentence in .com.br/.pt sources, checks grammar/phonetic claims, and audits for truth. Run after /exercise-draft or on any existing exercises.
argument-hint: "[path to worksheet or list of exercise sentences to verify]"
disable-model-invocation: true
---

# Exercise Verify

Check that every exercise sentence reflects how native speakers actually write and speak — not just what grammar rules permit. This skill can run after `/exercise-draft` or independently on any existing exercises.

**This step is not optional.** Grammar rules generate infinite valid sentences, but only a subset are natural. Teaching idiosyncratic constructions builds bad instincts.

---

## 1. Real-world usage search

For each non-trivial exercise sentence:
1. Search for the exact construction (or close variants) in .com.br sources for BP, .pt sources for EP
2. Use quoted searches: "disse-lhe a verdade", "tambem as vi", "sei que o ajudou"
3. If a construction returns few or no natural hits, rewrite it using a pattern that does appear
4. Pay special attention to: pronoun placement in context, verb + preposition combinations, word order choices, register (formal vs spoken)
5. If WebFetch returns 403, immediately switch to Chrome browser tools

Also verify any grammar or phonetic claims in teaching boxes — never put a claim into student-facing material from memory alone. Research it.

---

## 2. Self-audit

Re-read every exercise sentence asking "is this actually true?" — not for flow, but for truth. Stock phrases, common approximations, and model-knowledge assertions are red flags. If a sentence uses a common textbook framing, verify it applies to this specific context.

---

## Lessons learned

- "Tambem as vi" — grammatically perfect EP but no native speaker says it that way. A real-world search would have caught it immediately.
- -ar verbs were incorrectly described as having open/closed O alternation. Research would have caught it — only -er/-ir verbs alternate.
- Four separate errors made it into student-facing material in one session because drafting happened on autopilot without self-audit.
- "Eu sou do Brooklyn" was falsely flagged as wrong by applying prescriptive rules. Brazilian sources universally write "no Brooklyn" / "do Brooklyn." Always search before claiming a form is wrong.
