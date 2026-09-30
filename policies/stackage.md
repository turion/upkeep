# Stackage policy

Stackage package and bound updates are historically a manual, review-heavy workflow. Unlike generic dependency automation, there is usually no one-size-fits-all bot that can safely update all bounds in a project.

## Rule

Treat Stackage maintenance as a manual or human-triggered task by default.

- Do not open a Stackage PR automatically on a broad schedule.
- Do not silently comment on upstream Stackage issues or PRs without approval.
- Prefer a human-triggered skill that prepares a draft patch and summary, then waits for review.

## Safe workflow

1. Check whether the package or bounds are already known to be out of date.
2. Prepare the patch and test it locally.
3. Summarize the exact change and why it is needed.
4. Open a draft PR or issue for the human maintainer to review.
5. Only submit live PRs after explicit approval.

## Why

The Stackage ecosystem is not as automation-friendly as ordinary dependency update systems. Bound bumps often need contextual understanding and review, especially when families of packages or GHC compatibility are involved.

This repo treats Stackage maintenance as a human-in-the-loop task, not a background autonomous one.
