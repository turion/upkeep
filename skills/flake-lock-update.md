# Flake lock updates

## Preferred path

Prefer a standard `update-flake-lock` GitHub Action over agentic work, such as [DeterminateSystems/nix-update-action](https://github.com/DeterminateSystems/nix-update-action) or [maralorn/update-flake-lock](https://github.com/maralorn/update-flake-lock).

## Safety rules

- Auto-merge eligibility is defined by [`auto-merge-trusted.yml`](../.github/workflows/auto-merge-trusted.yml):
  - The PR must be non-draft and from this repository.
  - It must be authored by the repository owner, include a GitHub-recognized commit authored or co-authored by the owner, or include the designated `Assisted-by: upkeep-bot` commit footer.
  - Bot identity and branch names alone are not trusted.
- The `Assisted-by: upkeep-bot` footer is a separate, self-asserted auto-merge allow-list marker, not the standard AI disclosure. Only actual upkeep-generated commits intended to qualify should use it. Ordinary AI-assisted commits should use the `Assisted-by: upkeep; <tool>` disclosure convention in [`AGENTS.md`](../AGENTS.md); that disclosure alone does not satisfy the workflow's trust check.
- Require all required checks to be green before merging; configure branch protection and auto-merge accordingly.
- For repos with governance constraints, do not publish human-facing PR text or comments without review.
- Follow the target repository's contribution and AI policies.

## Setup walkthrough

1. Add [`auto-merge-trusted.yml`](../.github/workflows/auto-merge-trusted.yml) to the target repository at `.github/workflows/auto-merge-trusted.yml`. Review its authorship checks and use only commits that satisfy them; do not treat an updater's branch name or bot identity as proof of trust.
2. In the target repository, go to **Settings → General → Pull Requests** and enable **Allow auto-merge**. The workflow requests squash merging, so ensure squash merging is enabled.
3. Protect the default branch under **Settings → Rules → Rulesets** (or **Settings → Branches**). Require pull requests and the status checks that must pass before merging. Auto-merge queues the PR until those required checks pass.
4. Keep the workflow's `contents: write` and `pull-requests: write` permissions scoped to that workflow. Dependabot-triggered workflows normally receive a read-only token, but this workflow requests the write scopes it needs. Confirm that organization or repository Actions policies do not restrict those permissions; avoid granting broader workflow permissions than necessary.
5. Configure the lock-update automation you want. Its PRs are not eligible solely because they were created by Dependabot or a lock-update action; they must satisfy the workflow's authorship checks and pass every required check before merging.

Use checks that exercise the affected package or application before enabling auto-merge.
