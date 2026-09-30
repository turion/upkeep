# CI triage

## Goal

Classify CI failures and route maintenance work without acting as the human maintainer.

## Classification

- **Flaky:** intermittent infrastructure or test failure. Retry only when useful evidence supports a transient failure; never treat a flaky result as success without evidence.
- **Simple mechanical:** a lockfile refresh, stale CI configuration, trivial version-bound widening, or trivial metadata correction.
- **Complex or policy-sensitive:** ambiguous root cause, broad or interdependent changes, or repo-specific governance concerns.
- **External upstream breakage:** a dependency, service, or upstream change outside the target repository caused the failure.

## Preferred path

- Use existing CI logs and classical automation to establish the cause before changing anything.
- Prepare simple mechanical fixes as draft PRs.
- Do not auto-fix complex, ambiguous, or policy-sensitive failures.
- Never merge without all required checks green.

## Escalation

- For repos owned by the human maintainer, open an issue or PR draft in that repo. Do not impersonate the maintainer.
- For third-party or upstream repos, open an issue in `upkeep` describing the findings and proposed next step.
- Never comment on third-party issues or PRs without explicit human approval.
- Escalate complex failures and upstream coordination to a human review task.
