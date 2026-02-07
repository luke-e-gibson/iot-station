# GitHub Workflows — Detailed Guide

This directory contains CI and release workflows plus a versioning helper script.

## Files

- [ci.yml](ci.yml): Pull request CI (Docker builds + PlatformIO matrix builds).
- [release.yml](release.yml): Release pipeline for `server` and `dashboard`.
- [determine-versions.sh](determine-versions.sh): Computes next semver tags based on commit message flags.

---

## CI Workflow (`ci.yml`)

### CI - Trigger

- `pull_request` targeting `master`
- Paths: `server/**`, `dashboard/**`, `client/**`

### CI - Flags

- `#no-docker` and `#no-pio` can appear in:
  Latest commit message
  PR title/body

### CI - Jobs

1. **CheckTriggers**
  Reads latest commit message for flags.
  Detects changed files in the *last commit* (not entire PR).
1. **BuildDockerServer**
  Runs when `server/**` changed **and** no `#no-docker`.
1. **BuildDockerDashboard**
  Runs when `dashboard/**` changed **and** no `#no-docker`.
1. **PreparePlatformIO**
  Runs when `client/**` changed **and** no `#no-pio`.
  Builds a matrix of environments from `platformio.ini`.
  Primes cache (platform installs).
1. **PlatformIoBuild**
  Uses the matrix produced above.
  Builds each PlatformIO environment.

### CI - Notes

- Change detection is only for the last commit (`HEAD~1..HEAD`).
- Docker builds are local (no push).

---

## Release Workflow (`release.yml`)

### Release - Trigger

- `push` to `master`
- Paths: `server/**`, `dashboard/**`
- Only runs if commit message includes `#release`

### Release - Jobs

1. **CheckTriggers**
  Scans all changed files in the push range.
  Releases only components that changed *and* have a Dockerfile.
1. **Versioning**
  Builds a release message for the range.
  Runs `determine-versions.sh` to compute next tags.
1. **release**
  Tags the repo (`server@vX.Y.Z`, `dashboard@vX.Y.Z`).
  Builds and pushes multi-arch images to GHCR.

### Release - Flags

- `#server-major`, `#server-minor`, `#dashboard-major`, `#dashboard-minor`
  Control version bumps for that component.
- `#server@vX.Y.Z` / `#dashboard@vX.Y.Z`
  Override the exact version.

---

## determine-versions.sh (local usage)

### Purpose

- Compute component tags and short versions.

### Required Environment Variables

- `GITHUB_OUTPUT` (required)
- `RELEASE_COMPONENTS` (space-separated list: `server dashboard`)
- `RELEASE_MSG` (commit message text to parse)
- Optional:
  `COMPONENT_SEMVER_SERVER`
  `COMPONENT_SEMVER_DASHBOARD`
  `COMPONENT_EXISTING_TAGS_SERVER`
  `COMPONENT_EXISTING_TAGS_DASHBOARD`

### Example: simple patch bump for both components

```bash
export GITHUB_OUTPUT=/tmp/gh-out
export RELEASE_COMPONENTS="server dashboard"
export RELEASE_MSG="feat: update metrics #release"
./.github/workflows/determine-versions.sh
cat /tmp/gh-out
```

### Example: stream a release message without exports

```bash
printf '#release\n' | \
  xargs -I{} sh -c \
    'GITHUB_OUTPUT=/tmp/gh-out \
     RELEASE_COMPONENTS="server dashboard" \
     RELEASE_MSG="feat: metrics refresh {}" \
     ./.github/workflows/determine-versions.sh'
cat /tmp/gh-out
```
