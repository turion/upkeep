# Nixpkgs policy

This file is the source of truth for work against `NixOS/nixpkgs`.

## Core requirement

Any contribution that includes LLM or AI assistance must be disclosed and attributable.

The convention required by current nixpkgs contribution guidance is:

```text
Assisted-by: <tool name>; <primary model name and version>
```

For example:

```text
Assisted-by: GitHub Copilot coding agent; Claude Sonnet 4
```

or

```text
Assisted-by: GitHub Copilot coding agent; GPT-4.1
```

If an LLM-assisted commit is produced, the commit trailer must be present in the final commit message.

## Hard rules for upkeep

- Never create a nixpkgs PR or comment as though the agent were the human maintainer.
- Never impersonate you in a PR, commit, or review thread.
- Never directly reply to maintainers, reviewers, or other contributors on nixpkgs without explicit human approval.
- If a nixpkgs task is ambiguous, policy-sensitive, or likely to attract review scrutiny, do not open a public PR directly. Instead:
  - produce a local patch or draft branch,
  - write a concise issue summary in this repo,
  - wait for human review,
  - then decide whether to open a PR under your own account.

## Review-policy caution

The nixpkgs community has discussed stricter limits around AI-generated prose and metadata. Some governance conversations discuss bans or restrictions on AI-generated non-code text (e.g. commit messages / PR descriptions), even when code is otherwise valid.

This means:
- always re-check the most recent CONTRIBUTING.md or project guidance before acting,
- default to conservative behavior,
- prefer a human-authored PR description and human-authored commit message if there is any doubt,
- keep the agent's work limited to code generation, patch preparation, and technical notes, not to public prose that could be interpreted as non-human authored communication.

## Practical workflow

For a nixpkgs maintenance task, the safest pattern is:

1. Prepare the code change locally.
2. Add the required `Assisted-by:` trailer if AI was used.
3. Write a human-readable summary in `upkeep` issue/task form.
4. Ask the human maintainer to review and decide whether to submit it.
5. Only open upstream PRs under the human's account after explicit approval.

This is the policy-preserving path.
