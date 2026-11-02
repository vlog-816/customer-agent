# QA process (sample — replace with your team's)

## Bug report must include
Title, severity, environment/build, numbered steps to reproduce, expected result, actual result, and a screenshot or video when visual.

## Test case format
ID, title, preconditions, steps, expected result, type (positive/negative/boundary).

## Before a release
1. All critical and major bugs fixed or explicitly accepted by the product owner.
2. Smoke test on staging: login, core purchase flow, settings.
3. Regression pass on areas touched by the release.
4. Tester signs off in the release ticket.

## Environments
Dev (unstable), Staging (release candidates), Production (never test destructive actions here).
