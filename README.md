# upkeep
Personal OSS maintenance steward: policies, skills, and automation for CI triage, dependency bumps, and Stackage/Nixpkgs upkeep — human-in-the-loop by design.

## Configure trusted maintenance auto-merge

The workflow at `.github/workflows/auto-merge-trusted.yml` enables GitHub auto-merge only for non-draft pull requests from this repository that match its allow-list: Dependabot PRs and the configured flake-lock updater branch names. Dependabot PRs are eligible for **major, minor, and patch** updates. Fork PRs and other authors or branch names are not eligible.

Set up the repository in this order:

1. **Configure updates.** For Dependabot, add the ecosystems and directories you want to `.github/dependabot.yml` and set a schedule. For example, a single npm entry looks like:

   ```yaml
   version: 2
   updates:
     - package-ecosystem: npm
       directory: /
       schedule:
         interval: weekly
   ```

   Adapt the ecosystem and directory to your project; add entries rather than replacing other update rules. Do not exclude major updates if you want them to be eligible. For flake locks, configure your chosen lock-update action to create branches matching one of the patterns in the workflow (`update_flake_lock_action`, `update-flake-lock`, or `update-flake-lock-action`, optionally followed by a hyphen and suffix).

2. **Require CI before merging.** In repository **Settings → Rules → Rulesets** (or **Settings → Branches** for a classic branch protection rule), protect the default branch and enable required pull requests and the CI status checks that must pass. Select the actual check names reported by your workflows. Without required checks, auto-merge has no check gate to wait for.

3. **Allow auto-merge.** In **Settings → General → Pull Requests**, enable **Allow auto-merge**. The workflow requests squash auto-merge; GitHub waits for the branch protection requirements before merging.

4. **Allow the workflow permissions.** The workflow declares `contents: write` and `pull-requests: write` for its token. Check that repository or organization Actions policy permits those permissions; no broader repository-wide token permission is needed for this workflow.

5. **Verify the setup.** Review the workflow run and the pull request's checks and auto-merge status. A manual **Actions → Auto-merge trusted maintenance → Run workflow** dispatch takes a PR number, but it uses the same allow-list and can enable auto-merge, so only dispatch it for a PR you intend to make eligible.
