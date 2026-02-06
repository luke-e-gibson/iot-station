# IOT station

[![CI](https://github.com/luke-e-gibson/iot-station/actions/workflows/ci.yml/badge.svg)](https://github.com/luke-e-gibson/iot-station/actions/workflows/ci.yml) [![Release](https://github.com/luke-e-gibson/iot-station/actions/workflows/release.yml/badge.svg)](https://github.com/luke-e-gibson/iot-station/actions/workflows/release.yml)

## TODO

- [x] Establish server scaffolding and basic routes
- [x] Set up the client project structure and build config
- [ ] Implement the server core (API, database hooks, etc.)
- [ ] Extend the client with the planned sensor modules

## CI & Release workflow flags

- CI workflow: see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
  - Note: The CI workflow is triggered only for pull requests targeting the `master` branch.
  - The CI first detects which files changed in the latest commit of the PR.
  - Docker build (`BuildDocker`) runs only if server files changed and the commit/PR does not contain `#no-docker`.
  - PlatformIO preparation and builds (`PreparePlatformIO` / `PlatformIoBuild`) run only if client files changed and the commit/PR does not contain `#no-pio`.
  - Use `#no-docker` or `#no-pio` in the commit message, PR title, or PR body to opt out of the respective job.

- Release workflow: see [`.github/workflows/release.yml`](.github/workflows/release.yml)
  - Runs on pushes to `master` that include `#release` in the commit message plus touch `server/**` or `dashboard/**` files; the first job (`CheckTriggers`) scans the push range `github.event.before..github.sha` and emits only the service names that changed and still have their Dockerfile.
  - The next job (`Versioning`) reads that list, computes each component's next `<service>@vX.Y.Z` tag (or respects `#server@vx.y.z`/`#dashboard@vX.Y.Z`), and exposes `server_*`/`dashboard_*` metadata plus a `has_releasable` flag.
  - The final `release` job runs only when `Versioning` published `has_releasable=true`; it tags the repository and builds/pushes the service images with `latest`, `vX.Y` (short), and the full semver tags.

Examples:

- To skip Docker build in a PR include `#no-docker` in the commit message or PR title/body.
- To skip PlatformIO tests include `#no-pio`.
- To suppress a release on master exclude `#release`.

## Conventions

This organisation follows a set of development conventions to keep the codebase consistent, predictable, and easy to maintain.

### Commit Message Format - Conventional Commits

All commits should follow the **Conventional Commits** specification.  
This helps maintain readable history, enables automated tooling, and clarifies intent.

Common prefixes include:

- `feat:` - new features  
- `fix:` - bug fixes
- `refactor:` - code restructuring without behavior changes  
- `chore:` - maintenance tasks  
- `test:` - adding or updating tests  

More details: [https://www.conventionalcommits.org/](https://www.conventionalcommits.org/en/v1.0.0/#summary)

### Branching & Commit Discipline

To keep the repository clean and reviewable:

- Each **branch** should focus on a single feature, fix, or task.  
- Each **commit** should represent one logical change.  
- Avoid mixing unrelated changes in the same commit or branch.  
- Use descriptive branch names such as:
  - `main` - stable, production-ready
  - `develop` - integration branch  
  - `feature/<short-description>` - new work  
  - `fix/<short-description>` - bug fixes  
  - `chore/<short-description>` - maintenance tasks
  - `refactor/<short-description>` - large code changes
