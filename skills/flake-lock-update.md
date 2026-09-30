# Flake lock updates

## Preferred path

Prefer a standard `update-flake-lock` GitHub Action over agentic work, such as [DeterminateSystems/nix-update-action](https://github.com/DeterminateSystems/nix-update-action) or [maralorn/update-flake-lock](https://github.com/maralorn/update-flake-lock).

## Safety rules

- Auto-merge only explicitly trusted maintenance PR classes: Dependabot PRs and PRs from the configured flake-lock update branches or workflow.
- Require all required checks to be green before merging; configure branch protection and auto-merge accordingly.
- For repos with governance constraints, do not publish human-facing PR text or comments without review.
- Follow the target repository's contribution and AI policies.
