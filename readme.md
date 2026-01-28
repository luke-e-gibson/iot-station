# IOT station

[![CI](https://github.com/luke-e-gibson/iot-station/actions/workflows/ci.yml/badge.svg)](https://github.com/luke-e-gibson/iot-station/actions/workflows/ci.yml) [![Release](https://github.com/luke-e-gibson/iot-station/actions/workflows/release.yml/badge.svg)](https://github.com/luke-e-gibson/iot-station/actions/workflows/release.yml)

## TODO

- [x] Server init
- [x] Client init
- [ ] Server
- [ ] client - add sensors

## CI & Release workflow flags

- CI workflow: see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
  - The CI first detects which files changed in the PR.
  - Docker build (`BuildDocker`) runs only if server files changed and the commit/PR does not contain `#no-docker`.
  - PlatformIO preparation and builds (`PreparePlatformIO` / `PlatformIoBuild`) run only if client files changed and the commit/PR does not contain `#no-pio`.
  - Use `#no-docker` or `#no-pio` in the commit message, PR title, or PR body to opt out of the respective job.

- Release workflow: see [`.github/workflows/release.yml`](.github/workflows/release.yml)
  - Runs on pushes to `master`.
  - The release job proceeds only if server files changed and the commit message contains `#release` (default is disabled).
  - Version control via commit message:
    - `#version@vX.Y.Z` — set exact tag.
    - `#major`, `#minor` — bump major/minor (patch resets).
    - default — bump patch.
  - Tags pushed are `vX.Y.Z`, short `vX.Y`, and `latest`.

Examples:

- To skip Docker build in a PR include `#no-docker` in the commit message or PR title/body.
- To skip PlatformIO tests include `#no-pio`.
- To suppress a release on master exclude `#release`.
