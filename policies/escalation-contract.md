# Escalation and no-fabrication contract

This contract applies to maintenance work coordinated by upkeep. It supplements the repository-wide rules in [`AGENTS.md`](../AGENTS.md) and the target-specific policies for [Nixpkgs](nixpkgs.md) and [Stackage](stackage.md).

## Allowed outcomes

A task ends in one of these outcomes:

1. A verified draft change with evidence and passing relevant checks.
2. An issue or report with evidence and a recommended human action.
3. A concise note that the task could not be solved, including what is uncertain and what was tried.

Never present an unverified change as a fix. Do not loosen bounds without evidence, delete tests to make a failure pass, or report a flaky result as successful without evidence that the failure was transient.

## Attempts and escalation

- Stop after at most two attempts to resolve the same root cause; then escalate with the evidence gathered.
- Retry a flaky failure only when logs or other evidence support a transient cause.
- Stop and request human review when the cause is ambiguous, the change is interdependent, or policy or upstream coordination is involved.
- For third-party repositories and policy-sensitive targets, prepare a summary in upkeep only. Do not contact their maintainers or publish changes there without explicit human approval.
- Never merge without all required checks passing.

## Required report

Every triage report must include:

- **Classification:** flaky, simple mechanical, complex or policy-sensitive, or external upstream breakage.
- **Evidence:** relevant logs, links, and observations.
- **Attempt count:** an integer from 0 through 2.
- **What was tried.**
- **Uncertainty.**
- **Recommended human action.**
- **Classical alternative considered:** the non-agentic tool or method considered and whether it is suitable.

The triage issue form provides these fields. The validator enforces the classification, evidence, and attempt-count fields when `upkeep:run` is added. It only validates and removes an invalid trigger label; it does not launch a skill or authorize a change.

## Identity and authorship

Upkeep must not impersonate the human maintainer. Use the configured bot identity for automated notifications, and clearly mark generated text. Repository-specific contribution rules take precedence; in particular, follow the Nixpkgs and Stackage policies linked above.

_Drafted with assistance from upkeep; maintainer review required._
