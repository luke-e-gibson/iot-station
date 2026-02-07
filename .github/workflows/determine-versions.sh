#!/usr/bin/env bash
set -euo pipefail

: "${GITHUB_OUTPUT:?GITHUB_OUTPUT must be provided}"

msg="${RELEASE_MSG:-}"
components_raw="${RELEASE_COMPONENTS:-}"
components=()

if [[ -n "$components_raw" ]]; then
  read -r -a components <<< "$components_raw"
fi

declare -A component_semver_override=(
  [server]="${COMPONENT_SEMVER_SERVER:-}"
  [dashboard]="${COMPONENT_SEMVER_DASHBOARD:-}"
)
declare -A component_tag_override=(
  [server]="${COMPONENT_EXISTING_TAGS_SERVER:-}"
  [dashboard]="${COMPONENT_EXISTING_TAGS_DASHBOARD:-}"
)

server_new=""
server_semver=""
server_short=""
dashboard_new=""
dashboard_semver=""
dashboard_short=""
has_releasable=false

increment_patch() {
  if [[ "$semver" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    major="${BASH_REMATCH[1]}"
    minor="${BASH_REMATCH[2]}"
    patch="${BASH_REMATCH[3]}"
  else
    major=0; minor=0; patch=0
  fi
  ((patch = patch + 1))
  semver="${major}.${minor}.${patch}"
}

if [[ ${#components[@]} -eq 0 ]]; then
  echo "No valid components detected for release; exiting."
  echo "has_releasable=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

for comp in "${components[@]}"; do
  semver=""
  if [[ "$msg" =~ \#${comp}@v([0-9]+\.[0-9]+\.[0-9]+) ]]; then
    semver="${BASH_REMATCH[1]}"
  else
    base="${component_semver_override[$comp]:-}"
    if [[ -z "$base" ]]; then
      latest_tag=$(git tag --list "${comp}@v*" --sort=-v:refname | head -n1 || true)
      base="${latest_tag#${comp}@v}"
    fi
    if [[ "$base" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
      major="${BASH_REMATCH[1]}"
      minor="${BASH_REMATCH[2]}"
      patch="${BASH_REMATCH[3]}"
    else
      major=0; minor=0; patch=0
    fi
    if [[ "$msg" =~ \#${comp}-major ]]; then
      ((major = major + 1)); minor=0; patch=0
    elif [[ "$msg" =~ \#${comp}-minor ]]; then
      ((minor = minor + 1)); patch=0
    else
      ((patch = patch + 1))
    fi
    semver="${major}.${minor}.${patch}"
  fi

  existing_override="${component_tag_override[$comp]:-}"
  while true; do
    override_hit=false
    if [[ -n "$existing_override" && " $existing_override " == *" ${comp}@v${semver} "* ]]; then
      override_hit=true
    elif git rev-parse --verify --quiet "refs/tags/${comp}@v${semver}" >/dev/null; then
      override_hit=true
    fi
    if ! $override_hit; then
      break
    fi
    increment_patch
  done

  new_tag="${comp}@v${semver}"
  short="v${semver%.*}"

  if [[ "$comp" == "server" ]]; then
    server_new="${new_tag}"
    server_semver="${semver}"
    server_short="${short}"
  elif [[ "$comp" == "dashboard" ]]; then
    dashboard_new="${new_tag}"
    dashboard_semver="${semver}"
    dashboard_short="${short}"
  fi

  echo "Determined ${comp} version: ${new_tag}"
  has_releasable=true
done

echo "server_new=${server_new}" >> "$GITHUB_OUTPUT"
echo "server_semver=${server_semver}" >> "$GITHUB_OUTPUT"
echo "server_short=${server_short}" >> "$GITHUB_OUTPUT"
echo "dashboard_new=${dashboard_new}" >> "$GITHUB_OUTPUT"
echo "dashboard_semver=${dashboard_semver}" >> "$GITHUB_OUTPUT"
echo "dashboard_short=${dashboard_short}" >> "$GITHUB_OUTPUT"
echo "has_releasable=${has_releasable}" >> "$GITHUB_OUTPUT"

# Also emit for local visibility/tests
print_fields=(
  "server_new" "server_semver" "server_short"
  "dashboard_new" "dashboard_semver" "dashboard_short"
  "has_releasable"
)
for field in "${print_fields[@]}"; do
  value="${!field:-}"
  echo "${field}=${value}"
done
