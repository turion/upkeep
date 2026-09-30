# Flake lock updates

## Preferred path

Prefer a standard `update-flake-lock` GitHub Action over agentic work, such as [DeterminateSystems/nix-update-action](https://github.com/DeterminateSystems/nix-update-action) or [maralorn/update-flake-lock](https://github.com/maralorn/update-flake-lock).

## Safety rules

- Auto-merge only explicitly trusted maintenance PR classes: all same-repository Dependabot PRs, including major-version updates, and PRs from the configured flake-lock update branches or workflow.
- Require all required checks to be green before merging; configure branch protection and auto-merge accordingly.
- For repos with governance constraints, do not publish human-facing PR text or comments without review.
- Follow the target repository's contribution and AI policies.

## Setup walkthrough

1. Add [`auto-merge-trusted.yml`](../.github/workflows/auto-merge-trusted.yml) to the target repository at `.github/workflows/auto-merge-trusted.yml`. Its allow-list accepts same-repository Dependabot PRs and flake-lock update branches matching the listed patterns; update those patterns only to match the updater you configured.
2. In the target repository, go to **Settings → General → Pull Requests** and enable **Allow auto-merge**. The workflow requests squash merging, so ensure squash merging is enabled.
3. Protect the default branch under **Settings → Rules → Rulesets** (or **Settings → Branches**). Require pull requests and the status checks that must pass before merging. Auto-merge queues the PR until those required checks pass.
4. Keep the workflow's `contents: write` and `pull-requests: write` permissions scoped to that workflow. Dependabot-triggered workflows normally receive a read-only token, but this workflow requests the write scopes it needs. Confirm that organization or repository Actions policies do not restrict those permissions; avoid granting broader workflow permissions than necessary.
5. Configure Dependabot updates for the ecosystems you want in `.github/dependabot.yml`. Do not exclude `version-update:semver-major` if you want major updates included. This workflow does not filter Dependabot by update type, so major updates are eligible too; they still must pass every required check before merging.

Major-version eligibility is a deliberate trust choice, not a claim that those updates are low risk. Use checks that exercise the affected package or application before enabling auto-merge.
