# Version-bound maintenance

## Preferred path

Follow [classical automation first](classical-first.md). Prefer Renovate or Hackage automation before agentic work.

Use agentic help only when the fix requires judgment, such as an ambiguous root cause, multiple interdependent packages, or deciding how widely to widen a bound.

## Safety rules

- Keep the bound change minimal and evidence-based.
- Document the reasoning and test evidence in the PR.
- Follow the target repository's contribution and AI policies.

## Escalation

If the fix requires upstream coordination or discussion, stop and escalate it as a human-review task in `upkeep`. Do not post upstream directly.
