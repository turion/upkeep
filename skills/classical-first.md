# Classical automation first

This skill is the default guardrail for every maintenance task.

## Purpose

Before allowing an agent to touch a task, check whether a classical non-LLM solution exists and would be safer / cheaper / easier to maintain.

## Standard checklist

- Is there a repo-native automation tool already in use or recommended?
- Is a GitHub Action sufficient?
- Can Dependabot or Renovate do this without any LLM?
- Can a simple scheduled script, lockfile update action, or matrix-based CI gate solve the problem?
- Is the issue primarily rule-based and deterministic, rather than judgment-heavy?

## Decision rule

- If a classical tool can do the job, prefer it.
- If classical automation only covers part of the job, use it for the deterministic portion and use the agent only for the remainder.
- If the task is purely policy-sensitive or fragile, do not let the agent do it without direct human oversight.

## Examples

- flake lock updates: prefer `DeterminateSystems/update-flake-lock` or a similar action
- dependency bumps: prefer Dependabot or Renovate
- required status gate: prefer `re-actors/alls-green` plus branch protection
- version bounds: prefer Renovate where possible; use agentic help only for the small exceptional cases
- Stackage or nixpkgs policy tasks: manual or human-triggered only

## Output format for tasks

When a task is handed to upkeep, include a small section like:

```markdown
## Classical alternative considered
- Tool: <name>
- Verdict: adopt / partial / not applicable
- Reasoning: <short explanation>
```

This creates a durable record for future tasks and helps the system get more conservative over time.
