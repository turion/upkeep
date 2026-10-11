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
- Follow [`policies/escalation-contract.md`](../policies/escalation-contract.md) for allowed outcomes, attempt limits, and required reporting.
- The `upkeep:run` label is a human trigger, not permission to bypass validation or safety rules. The issue validator checks the triage report and does not launch a skill.

## Issue tracking

- Every issue that tracks a CI failure carries the `spoke-ci-failure` label and lives in `upkeep`, never in the failing repository.
- Before opening an issue, read all open `spoke-ci-failure` issues (title, body, comments). If one describes the same root cause, comment on it with the new occurrence (repo, run link, date, evidence); otherwise open a new issue. One issue per root cause.
- Find the root cause, not the symptom. For Nix builds, take the first `Cannot build '<package>.drv'` whose reason is not `N dependency failed`; ignore downstream derivations and the `alls-green` gate job.
- Failures hitting every matrix job and operating system identically point at a deterministic (usually upstream) cause. Do not retry them.
- Retry only on transient evidence (truncated tarball, network reset, runner loss), at most twice per root cause, and record it in the attempt count. `.github/workflows/ci-triage.yml` polls all of the owner's repositories (opt-outs in `.github/ci-triage-repos.json`) with a read-only token: it flags retry candidates and lists failures needing triage, but a human re-runs jobs.
- When many comments accumulate on the same issue, propose a deterministic rule for that cause.

## Required triage report

Include these sections in the issue body:

- Classification: `Flaky`, `Simple mechanical`, `Complex or policy-sensitive`, or `External upstream breakage`.
- Evidence: relevant CI log excerpts or links.
- Attempt count: an integer from 0 to 2.
- What was tried.
- Uncertainty.
- Recommended human action.
- Classical alternative considered.

## Escalation

- For repos owned by the human maintainer, open an issue or PR draft in that repo. Do not impersonate the maintainer.
- For third-party or upstream repos, open an issue in `upkeep` describing the findings and proposed next step.
- Never comment on third-party issues or PRs without explicit human approval.
- Escalate complex failures and upstream coordination to a human review task.
