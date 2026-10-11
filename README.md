# upkeep
Personal OSS maintenance steward: policies, skills, and automation for CI triage, dependency bumps, and Stackage/Nixpkgs upkeep — human-in-the-loop by design.

## Configure trusted maintenance auto-merge

The workflow at `.github/workflows/auto-merge-trusted.yml` enables GitHub auto-merge only for non-draft, same-repository pull requests authored by the repository owner, with a GitHub-recognized commit co-authored by the owner, or with an `Assisted-by: upkeep-bot` commit trailer. Branch names and bot identities alone do not establish trust; fork PRs are never eligible.

Set up the repository in this order:

1. **Configure updates.** Add the ecosystems and directories you want to `.github/dependabot.yml` and set a schedule. For example, a single npm entry looks like:

   ```yaml
   version: 2
   updates:
     - package-ecosystem: npm
       directory: /
       schedule:
         interval: weekly
   ```

   Adapt the ecosystem and directory to your project; add entries rather than replacing other update rules. Routine bot updates are not auto-merged based on their identity or branch name; their commits must satisfy the authorship rule above.

2. **Require CI before merging.** In repository **Settings → Rules → Rulesets** (or **Settings → Branches** for a classic branch protection rule), protect the default branch and enable required pull requests and the CI status checks that must pass. Select the actual check names reported by your workflows. Without required checks, auto-merge has no check gate to wait for.

3. **Allow auto-merge.** In **Settings → General → Pull Requests**, enable **Allow auto-merge**. The workflow requests squash auto-merge; GitHub waits for the branch protection requirements before merging.

4. **Allow the workflow permissions.** The workflow declares `contents: write` and `pull-requests: write` for its token. Check that repository or organization Actions policy permits those permissions; no broader repository-wide token permission is needed for this workflow.

5. **Verify the setup.** Review the workflow run and the pull request's checks and auto-merge status. A manual **Actions → Auto-merge trusted maintenance → Run workflow** dispatch takes a PR number, but it uses the same authorship checks and can enable auto-merge, so only dispatch it for a PR you intend to make eligible.
