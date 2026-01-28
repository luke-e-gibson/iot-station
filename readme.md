# IOT station

[![CI](https://github.com/luke-e-gibson/iot-station/actions/workflows/ci.yml/badge.svg)](https://github.com/luke-e-gibson/iot-station/actions/workflows/ci.yml) [![Release](https://github.com/luke-e-gibson/iot-station/actions/workflows/release.yml/badge.svg)](https://github.com/luke-e-gibson/iot-station/actions/workflows/release.yml)

## TODO

- [x] Server init
- [x] Client init
- [ ] Server
- [ ] client - add sensors

## CI & Release workflow flags

- CI workflow: see [.github/workflows/ci.yml](.github/workflows/ci.yml)
  - Add `#docker` to the latest commit message in a PR to enable the `BuildDocker` job (checked via `has_docker`).
  - Add `#pio` to the latest commit message in a PR to enable the PlatformIO build matrix (checked via `has_pio`).
  - You can opt-out per-PR by adding `#no-docker` or `#no-pio` to the PR title or body.

- Release workflow: see [.github/workflows/release.yml](.github/workflows/release.yml)
  - Pushes to `master` run the `CheckTriggers` job which looks for `#release` in the commit message (sets `has_release`).
  - Control the version bump via commit message:
    - `#version@vX.Y.Z` — set exact tag.
    - `#major`, `#minor` — bump major/minor (patch resets).
    - default — bump patch.
  - Suppress a release by including `#no-release` in the commit message.

Examples:

- To run CI Docker build: include `#docker` in your PR commit message.
- To trigger a release and set a specific version: push to master with `#release #version@v1.2.0`.

(Workflows referenced: [.github/workflows/ci.yml](.github/workflows/ci.yml), [.github/workflows/release.yml](.github/workflows/release.yml))
