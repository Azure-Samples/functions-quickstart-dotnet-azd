#!/usr/bin/env zsh
set -euo pipefail

# Batch Propagation Script for Azure Functions AZD Templates
# This script applies infrastructure changes across multiple repositories
# 
# Key practices learned from successful August 2025 propagation:
# 1. Use local git operations (more reliable than GitHub Contents API)
# 2. Use force-with-lease for safe pushes
# 3. Always exclude propagation metadata from commits
# 4. Follow up with GitHub MCP tools for PR creation (not this script)

# Config
FORK_USER="paulyuk"
BRANCH="chore/propagate-from-functions-quickstart-dotnet-azd-pr-18"
SRC_PR_URL="https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/pull/18"
TRACK=".github/prompts/.propagation/propagation.targets.json"
WORKDIR="${TMPDIR:-/tmp}/azd-propagation-$(date +%s)"
mkdir -p "$WORKDIR"
echo "Workdir: $WORKDIR"

# Require tools
if ! command -v gh >/dev/null 2>&1; then echo "ERROR: Install GitHub CLI (gh)."; exit 1; fi
if ! command -v jq >/dev/null 2>&1; then echo "ERROR: Install jq."; exit 1; fi

echo "Checking GitHub auth (if your org requires JIT, you may need: gh auth refresh -h github.com -s repo)"
if ! gh auth status; then
  echo "ERROR: gh is not authenticated. Run 'gh auth login' and retry."; exit 1
fi

# Built-in fallback list (if TRACK missing or invalid)
builtin_targets() {
  cat <<'EOF'
Azure-Samples/functions-quickstart-javascript-azd
Azure-Samples/functions-quickstart-typescript-azd
Azure-Samples/functions-quickstart-python-http-azd
Azure-Samples/functions-quickstart-powershell-azd
Azure-Samples/azure-functions-java-flex-consumption-azd
Azure-Samples/functions-quickstart-typescript-azd-cosmosdb
Azure-Samples/functions-quickstart-python-azd-cosmosdb
Azure-Samples/functions-quickstart-dotnet-azd-cosmosdb
Azure-Samples/functions-quickstart-typescript-azd-sql
Azure-Samples/functions-quickstart-dotnet-azd-sql
Azure-Samples/functions-quickstart-python-azd-sql
Azure-Samples/Durable-Functions-Order-Processing
Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob
EOF
}

# Get targets from TRACK if valid JSON, else fallback
TARGETS_FILE="$WORKDIR/targets.txt"
if [ -f "$TRACK" ] && jq -e '.targets and (.targets|type=="array")' "$TRACK" >/dev/null 2>&1; then
  jq -r '.targets[].repo' "$TRACK" > "$TARGETS_FILE"
else
  echo "Using builtin target list (tracking file missing or invalid)"
  builtin_targets > "$TARGETS_FILE"
fi

# Helpers
ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

update_track() {
  local repo="$1" st="$2" ltype="$3" url="$4" note="$5"
  [ -f "$TRACK" ] || return 0
  local tmp="$WORKDIR/track.$$.json"
  if jq -e '.' "$TRACK" >/dev/null 2>&1; then
    jq --arg repo "$repo" --arg status "$st" --arg ltype "$ltype" --arg url "$url" --arg note "$note" '
      .targets = (.targets | map(
        if .repo==$repo then
          .status=$status |
          .lastChangeType=$ltype |
          .lastChangeUrl=$url |
          .notes=$note
        else . end
      ))' "$TRACK" > "$tmp" && mv "$tmp" "$TRACK"
  fi
}

find_infra_file() {
  local dir="$1"
  if [ -f "$dir/infra/main.bicep" ]; then echo "infra/main.bicep"; return; fi
  local f; f="$(cd "$dir" && /usr/bin/find infra -type f -name 'main.bicep' 2>/dev/null | head -n1 || true)"
  echo "$f"
}

PATTERN='^[[:space:]]*output[[:space:]]+APPLICATIONINSIGHTS_CONNECTION_STRING([[:space:]]|=)'

# Push helper that falls back to force-with-lease on non-fast-forward
safe_push() {
  git push -u origin "$BRANCH" --quiet 2>/dev/null || git push -u origin "$BRANCH" --force-with-lease --quiet 2>/dev/null || true
}

# Process each repo
while IFS=/ read -r OWNER NAME; do
  [ -n "${OWNER:-}" ] || continue
  REPO="$OWNER/$NAME"
  echo "=== Processing $REPO ==="

  # Ensure fork exists (fork into the authenticated user account)
  gh repo fork "$REPO" --remote=false --clone=false >/dev/null 2>&1 || true

  # Clone fork and set upstream
  REPO_DIR="$WORKDIR/$NAME"
  if [ ! -d "$REPO_DIR/.git" ]; then
    if ! gh repo clone "$FORK_USER/$NAME" "$REPO_DIR" -- --quiet; then
      echo "Clone failed $FORK_USER/$NAME; attempting to fork then retry clone"
      gh repo fork "$REPO" --remote=false --clone=false >/dev/null 2>&1 || true
      if ! gh repo clone "$FORK_USER/$NAME" "$REPO_DIR" -- --quiet; then
        echo "Clone failed again for $FORK_USER/$NAME"; continue
      fi
    fi
    (cd "$REPO_DIR" && git remote add upstream "https://github.com/$REPO.git" 2>/dev/null || true)
  fi

  # Sync and branch: prefer existing origin branch, merge upstream/main; else start from upstream/main
  if ! (cd "$REPO_DIR" && git fetch upstream --quiet && git fetch origin --quiet); then
    echo "Fetch failed $REPO"; continue
  fi
  if git -C "$REPO_DIR" rev-parse --verify --quiet "origin/$BRANCH" >/dev/null; then
    (cd "$REPO_DIR" && git checkout -B "$BRANCH" "origin/$BRANCH" --quiet && git merge --no-edit upstream/main --quiet || true)
  else
    (cd "$REPO_DIR" && git checkout -B "$BRANCH" upstream/main --quiet)
  fi

  FILE_REL="$(find_infra_file "$REPO_DIR")"
  cd "$REPO_DIR" || continue

  if [ -z "$FILE_REL" ] || [ ! -f "$FILE_REL" ]; then
    # Do not commit any propagation artifacts; just record status locally
    update_track "$REPO" "infra-missing" "none" "" "infra file missing"
    cd - >/dev/null; continue
  fi

  BEFORE=$(grep -Ec "$PATTERN" "$FILE_REL" || true)
  if [ "$BEFORE" -gt 0 ]; then
    # macOS sed -i ''
    sed -E -i '' '/^[[:space:]]*output[[:space:]]+APPLICATIONINSIGHTS_CONNECTION_STRING([[:space:]]|=)/d' "$FILE_REL"
    AFTER=$(grep -Ec "$PATTERN" "$FILE_REL" || true)
    if [ "$AFTER" -ne 0 ]; then
      echo "Removal check failed; reverting $FILE_REL"
      git checkout -- "$FILE_REL"
      cd - >/dev/null; continue
    fi

  # Only stage the infra file change
  git add -- "$FILE_REL"
  git commit -m "chore: remove deprecated App Insights output (propagation from source PR #18)" --quiet || true
  safe_push

    PR_URL=$(gh pr create --repo "$REPO" --head "$FORK_USER:$BRANCH" --base "main" \
      --title "Remove deprecated App Insights output (propagation from #18)" \
      --body "Removes APPLICATIONINSIGHTS_CONNECTION_STRING per $SRC_PR_URL" 2>/dev/null | tail -n1) || true

    LAST_COMMIT=$(git rev-parse HEAD)
    COMMIT_URL="https://github.com/$FORK_USER/$NAME/commit/$LAST_COMMIT"
    if [ -n "${PR_URL:-}" ]; then
  update_track "$REPO" "pr-open" "pr" "$PR_URL" "removed AppInsights output"
    else
  update_track "$REPO" "infra-updated" "commit" "$COMMIT_URL" "removed AppInsights output"
    fi
  else
    # No-op: do not commit any files; update local tracking only
    update_track "$REPO" "infra-evaluated" "none" "" "no-op (no AppInsights output)"
  fi

  cd - >/dev/null

done < "$TARGETS_FILE"

# Audit (upstream vs fork branch)
AUDIT="$WORKDIR/infra-audit.json"
: > "$WORKDIR/audit.ndjson"
while IFS=/ read -r OWNER NAME; do
  REPO="$OWNER/$NAME"; DIR="$WORKDIR/$NAME"; FILE="infra/main.bicep"
  [ -d "$DIR/.git" ] || continue
  (cd "$DIR" && git fetch origin --quiet && git fetch upstream --quiet) || true
  UP=false; FK=false
  if git -C "$DIR" ls-tree -r --name-only upstream/main | grep -Fx "$FILE" >/dev/null 2>&1; then
    CONTENT=$(cd "$DIR" && git show "upstream/main:$FILE" 2>/dev/null || true)
    if echo "$CONTENT" | grep -Eq "$PATTERN"; then UP=true; fi
  fi
  if git -C "$DIR" rev-parse "origin/$BRANCH" >/dev/null 2>&1 && git -C "$DIR" ls-tree -r --name-only "origin/$BRANCH" | grep -Fx "$FILE" >/dev/null 2>&1; then
    CONTENT=$(cd "$DIR" && git show "origin/$BRANCH:$FILE" 2>/dev/null || true)
    if echo "$CONTENT" | grep -Eq "$PATTERN"; then FK=true; fi
  fi
  jq -n --arg repo "$REPO" --argjson upstreamHas "$UP" --argjson forkHas "$FK" \
    '{repo:$repo, upstreamHasOutput:$upstreamHas, forkBranchHasOutput:$forkHas}' >> "$WORKDIR/audit.ndjson"
done < "$TARGETS_FILE"
jq -s '.' "$WORKDIR/audit.ndjson" > "$AUDIT"
echo "Audit report: $AUDIT"
jq -r '["repo","upstreamHas","forkBranchHas"], (.[] | [ .repo, (.upstreamHasOutput|tostring), (.forkBranchHasOutput|tostring) ]) | @tsv' "$AUDIT" | column -t -s $'\t'
