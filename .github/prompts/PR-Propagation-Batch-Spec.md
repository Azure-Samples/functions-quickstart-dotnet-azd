# Azure Functions AZD Templates - Batch Propagation System Specification

## Purpose & Vision
## Enhanced Workflow (Proven August 2025)

### Phase 1: Dynamic Discovery & Integration
```bash
# 1. Execute comprehensive GitHub searches
# Expected: 15-20 repositories across different languages/technologies

# 2. CRITICAL: Save ALL discoveries to JSON immediately
npm run integrate-discovery -- [discovered-repo-list]

# 3. Verify JSON contains all discoveries
node -e "console.log(JSON.parse(require('fs').readFileSync('propagation.targets.json')).targets.length)"
```

### Phase 2: Infrastructure Changes
```bash
# Apply changes using local git workflow script
# Process each repository with status 'ready-for-pr'
# Use proven local file modification approach
```

### Phase 3: PR Creation & Draft Management (GitHub MCP Tools Only)
```bash
# CRITICAL: Use GitHub MCP tools exclusively (NOT CLI scripts)
# Primary tools: mcp_github_create_pull_request_with_copilot, mcp_github_get_pull_request

# 1. Create PRs using GitHub MCP tools
# 2. Check for draft status: mcp_github_get_pull_request -> Look for "draft":true
# 3. Convert any draft PRs: mcp_github_update_pull_request with draft=false
# 4. Update JSON status to 'pr-open' (ready for review)
# 5. Target: ALL repositories with 'pr-open' status and draft=false

# NO DRAFT PRS ALLOWED - Immediate conversion required
# Fallback: Fork-based PR creation if direct access fails
```

### Phase 4: Report Generation & Quality Verification
```bash
# Generate interactive HTML report using correct path
node .github/prompts/.propagation/generate-report.js

# Alternative if npm script exists:
npm run report

# View report in VS Code Simple Browser
# Use open_simple_browser tool with file:// URL

# Quality checks:
# - All PRs must be draft=false (ready for review)
# - Status should be 'pr-open' not 'pr-created'
# - No repositories with 'discovered' or 'ready-for-pr' status
grep -E "(discovered|ready-for-pr)" propagation.targets.json
```

## Critical Success Requirements

### 1. Mandatory Discovery Integration
- **Requirement**: ALL discovered repositories MUST be saved to propagation.targets.json
- **Script**: Use `integrate-discovery.js` immediately after search
- **Validation**: Never proceed without JSON integration
- **Historical Issue**: Discovery found 19 repos but only 12 tracked → data loss

### 2. GitHub MCP Tools & Draft PR Management
- **Mandatory Tool Usage**: GitHub MCP tools exclusively for all GitHub operations
- **Prohibited**: CLI scripts (gh, git) for GitHub API interactions
- **Required Tools**: mcp_github_get_pull_request, mcp_github_update_pull_request, mcp_github_create_pull_request_with_copilot
- **NO DRAFT PRS**: All PRs must be ready for review (draft=false) immediately
- **Draft Conversion**: Check "draft":true in API responses and convert using draft=false parameter
- **Status Accuracy**: Use 'pr-open' for ready PRs, not ambiguous 'pr-created'

### 3. PR-First Approach  
- **Priority**: Pull request creation over issue creation
- **Target Status**: 'pr-open' not 'issue-open' or 'discovered'
- **Fallback**: Only create issues if PR creation fails after multiple attempts
- **Rationale**: PRs provide better automation and tracking

### 4. Single Source of Truth
- **File**: propagation.targets.json is authoritative tracking file
- **Updates**: All status changes must be persisted to JSON
- **Reporting**: HTML report reads exclusively from JSON
- **Consistency**: No data exists outside the tracking file

### 5. Complete Coverage Verification
- **Check**: No repositories should remain with status 'discovered'
- **Validation**: Interactive HTML report shows complete propagation scope
- **Requirements**: All PRs must have valid numbers and URLs
- **Quality Gate**: Workflow incomplete until all targets processedsive specification for dynamic discovery, change propagation, and interactive reporting across Azure Functions AZD templates. This spec serves as the **authoritative blueprint** that can regenerate the complete system including instructions, prompts, and implementation scripts.

## System Overview
- **Dynamic Discovery**: Real-time GitHub search to find ALL Azure Functions AZD templates (not static lists)
- **JSON-Based Tracking**: `propagation.targets.json` as single source of truth for all repositories and their status
- **Interactive Reporting**: Beautiful HTML dashboards with progress tracking and clickable navigation
- **PR-First Approach**: Prioritize pull request creation over issue creation for reliable automation
- **Quality Verification**: Comprehensive safeguards to ensure complete propagation coverage

## Scope & Proven Results
- **Source PR**: User-provided URL triggering propagation workflow
- **Target Discovery**: Dynamic GitHub search finding 15-20 repositories (not static 12-repo lists)
- **Coverage**: All Azure Functions AZD templates across languages (TypeScript, .NET, Python, Java)
- **Operations**: Discover → Track → Apply → Create PRs → Report → Verify
- **Proven Success**: August 2025 implementation discovered 19 templates vs 12 in static lists

## Core System Components

### 1. Dynamic Discovery Engine
**Purpose**: Real-time discovery of Azure Functions AZD templates via GitHub search

**Search Patterns** (Proven August 2025):
```javascript
const searchQueries = [
  'functions-quickstart azd org:Azure-Samples',
  'durable-functions azd org:Azure-Samples', 
  'azure-functions azd in:name org:Azure-Samples',
  'functions azd template org:Azure-Samples'
];
```

**Discovery Results**: Expect 15-20 repositories (not 12 from static lists)
**Critical Requirement**: ALL discoveries MUST be saved to propagation.targets.json immediately

### 2. JSON Tracking System
**File**: `propagation.targets.json` - Single source of truth for all repository status

**Schema**:
```json
{
  "targets": [
    {
      "repo": "functions-quickstart-typescript-azd",
      "url": "https://github.com/Azure-Samples/functions-quickstart-typescript-azd",
      "status": "pr-open",
      "pr_number": 28,
      "pr_url": "https://github.com/Azure-Samples/functions-quickstart-typescript-azd/pull/28",
      "last_updated": "2025-01-11T18:05:00Z",
      "discovered_via": "search:functions-quickstart azd org:Azure-Samples"
    }
  ]
}
```

**Status Values** (Priority Order):
- `discovered` - Found via search but not yet processed
- `ready-for-pr` - Prepared for PR creation  
- `pr-open` - Pull request successfully created ✅ TARGET STATE
- `issue-open` - Fallback issue created (avoid when possible)
- `complete` - Changes merged and propagation finished

**Critical Rule**: Target status should be 'pr-open' not 'issue-open' or 'discovered'

### 3. Interactive HTML Reporting
**Purpose**: Transform JSON tracking data into beautiful, interactive dashboards

**Report Features**:
- Progress dashboard with completion percentages
- Interactive status badges with modern CSS styling
- Technology grouping (TypeScript, .NET, Python, Java)
- Direct links to PRs, issues, and repositories
- Responsive design for professional appearance
- Quality indicators showing incomplete propagations

**Generation**: `npm run report` → `propagation-status-report.html`
**Viewing**: `open propagation-status-report.html` for immediate browser preview

### 4. Discovery Integration Script
**Purpose**: Prevent discovery data loss by ensuring ALL findings are saved to JSON

**Script**: `integrate-discovery.js`
**Usage**: `npm run integrate-discovery -- repo1,repo2,repo3`

**Functionality**:
- Loads existing propagation.targets.json
- Adds new discoveries with status 'ready-for-pr'
- Preserves existing repository data and status
- Saves updated JSON file with all discoveries

**Critical Requirement**: Must be executed immediately after discovery phase

Inputs (at runtime)
- SOURCE_PR_URL: The source PR to propagate.
- FILTERS:
  - serviceType = "Functions"
  - authors = ["Microsoft", "paulyuk"] (match by owner or author metadata)
  - optional: languages (e.g., dotnet, node, python, java), triggers (http, queue, timer, blob, service bus, event grid, etc.)
- EXECUTION_MODE:
  - discover-only | dry-run | create-prs
- BATCH_LIMIT: Maximum PRs to create in a single run (default 10).

High-level Workflow
1) Read and analyze SOURCE_PR_URL
   - Fetch PR metadata: title, body, state, commits, changed files, labels, linked issues.
   - Retrieve patch/diff for changed files.
   - Summarize the intent of change and categorize file types (code, infra, docs, CI, azd metadata).
2) Discover candidate target templates
   - Query AZD Gallery templates with filters: serviceType=Functions and author in {Microsoft, paulyuk}.
   - Collect repository metadata (name, owner, default branch, languages, triggers/tags).
   - Present the list to the user for validation before proceeding.
3) User validation checkpoint (REQUIRED)
   - Show a paginated list with repo name, owner, template description, language, trigger(s).
   - Allow the user to:
     - Approve all, or
     - Deselect specific repos, or
     - Edit filters and re-run discovery.
4) Prepare change mapping
   - Infer change type per file from source PR (e.g., csproj flag, host.json setting, infra main.bicep tweak, README section, CI matrix changes).
   - Define cross-language/trigger mapping rules if applicable. Examples:
     - host.json or local.settings.json: similar location across languages; adjust syntax if needed.
     - infra/ (Bicep/Terraform): mirror property names; verify API versions.
     - README: propagate wording consistently; keep language-specific code blocks.
     - CI/CD: adapt job names, paths, and language tooling versions.
   - If exact mapping is ambiguous, mark repo as “manual review needed” and skip for auto PR.
5) Dry-run (optional but recommended)
   - For each approved target repo up to BATCH_LIMIT:
     - Clone or fetch a shallow copy of the default branch.
     - Create a working branch: chore/propagate-from-<source-repo>-pr-<number>.
     - Apply mapped changes to corresponding files.
     - Produce a diff summary and file list; do not push.
   - Present consolidated dry-run results to user for final approval.
6) Create PRs
   - For each target in scope (after approval):
     - Ensure repository permissions and branch protection rules are respected.
     - (Fork Mode) If you lack direct push permission to Azure-Samples/<repo>:
       - Ensure a fork exists under the user account (e.g., paulyuk/<repo>); create one if absent.
       - Sync fork default branch with upstream (fast-forward) before creating the feature branch.
       - Create / update feature branch in the fork and push changes there.
       - Open a pull request with base: Azure-Samples/<repo>@main and head: paulyuk:<branch>.
     - (Direct Mode) If you have push permission, create/update the feature branch in the upstream and open the PR normally.
     - Commit with a standardized message.
     - Open a pull request targeting the upstream default branch (always Azure-Samples main as base for consistency).
   - Respect rate limits and backoff; stop at BATCH_LIMIT in a single run.
7) Reporting
   - Summarize successes (PR URLs) and failures with reasons.
   - Provide a CSV/JSON artifact of results for tracking.

## Implementation Components

### Package.json Scripts
```json
{
  "scripts": {
    "report": "node generate-report.js",
    "integrate-discovery": "node integrate-discovery.js"
  }
}
```

### File Structure
```
.github/prompts/
├── PROPAGATION_PROMPT.md          # Single ready-to-use prompt
├── PROPAGATION_INSTRUCTIONS.md    # Complete technical documentation  
├── PR-Propagation-Batch-Spec.md   # This specification (blueprint)
└── .propagation/
    ├── propagation.targets.json    # JSON tracking file (single source of truth)
    ├── generate-report.js          # HTML report generator
    ├── integrate-discovery.js      # Discovery integration script
    ├── package.json               # NPM scripts configuration
    └── propagation-status-report.html  # Generated HTML report
```

## Regeneration Templates

### PROPAGATION_PROMPT.md Template
```markdown
# Azure Functions AZD Templates - Batch Propagation Prompt

**Use this prompt to trigger a complete batch propagation across Azure Functions AZD templates.**

## 🚀 Ready-to-Use Prompt

Execute a complete batch propagation across Azure Functions AZD templates using the workflow in .github/prompts/.propagation/:

1. **Dynamically discover** target repositories using GitHub search (`functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`)
2. **Integrate ALL discoveries** into propagation.targets.json using the integration script: `npm run integrate-discovery -- [discovered repos]`
3. **Apply infrastructure changes** using the local git workflow script
4. **Create pull requests** for ALL repositories using GitHub MCP tools (prioritize PRs over issues)
5. **Update tracking** with PR information (target status: 'pr-open')
6. **Generate dynamic HTML report** and open in browser: `npm run report && open propagation-status-report.html`
7. **Verify quality**: Ensure no repositories remain with 'discovered' or 'ready-for-pr' status

Source PR: [PASTE_YOUR_SOURCE_PR_URL_HERE]
Change description: [DESCRIBE_THE_CHANGE_TO_PROPAGATE]

Success criteria: All discovered repositories should have status 'pr-open' with valid PR numbers and be included in the interactive HTML report.

## Expected Results
- **Complete discovery** of 15-20 Azure Functions AZD templates
- **Pull requests created** for ALL discovered repositories  
- **JSON tracking file** updated with all discoveries and PR information
- **Interactive HTML report** showing progress, links, and statistics
- **Quality confirmation** that no repositories were left behind
```

### PROPAGATION_INSTRUCTIONS.md Template
```markdown
# Azure Functions AZD Templates Batch Propagation System

**Complete instructions for dynamic discovery, change propagation, and interactive reporting across Azure Functions AZD templates.**

## Core Components

### 1. propagation.targets.json
Central tracking file for all discovered repositories and their status

### 2. generate-report.js  
Dynamic HTML report generator with interactive dashboards

### 3. integrate-discovery.js
Discovery integration script to prevent data loss

### 4. GitHub Search Queries
Dynamic discovery patterns for comprehensive coverage

## Complete Workflow

### Phase 1: Dynamic Discovery
Execute GitHub searches to find ALL Azure Functions AZD templates

### Phase 2: Discovery Integration  
Save all discoveries to JSON immediately using integrate-discovery.js

### Phase 3: Infrastructure Changes
Apply changes using the local git workflow script

### Phase 4: PR Creation
Use GitHub MCP tools to create pull requests with proper JSON updates

### Phase 5: Reporting & Verification
Generate interactive HTML report and verify complete coverage

## Quality Verification

### Success Criteria
- Complete Discovery: All Azure Functions AZD templates found and tracked
- Full Integration: Every discovered repository saved to propagation.targets.json
- Maximum PR Creation: Status 'pr-open' not 'issue-open' or 'discovered'
- Accurate Tracking: Valid PR numbers and URLs for all repositories
- Quality Reporting: Interactive HTML showing true propagation scope

## Critical Requirements

1. **Mandatory Discovery Integration**: ALL discovered repositories MUST be saved to propagation.targets.json
2. **PR-First Approach**: Prioritize pull request creation over issue creation
3. **Single Source of Truth**: propagation.targets.json is the authoritative tracking file
4. **Quality Verification**: No repositories should remain with status 'discovered'

## Troubleshooting

### Missing Repositories in Report
Check if integrate-discovery.js was executed with all findings

### Status Stuck on 'discovered'  
Run PR creation phase and update JSON with results

### Incomplete PR Information
Re-run PR creation with proper JSON updates
```
## Script Templates

### generate-report.js Template
```javascript
// Dynamic HTML report generator for propagation tracking
const fs = require('fs');
const path = require('path');

function generateReport() {
  // Load propagation.targets.json
  const jsonPath = path.join(__dirname, 'propagation.targets.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Generate interactive HTML with progress dashboards
  // Include status badges, technology grouping, clickable links
  // Save as propagation-status-report.html
}

generateReport();
```

### integrate-discovery.js Template  
```javascript
// Discovery integration script to prevent data loss
const fs = require('fs');
const path = require('path');

function integrateDiscovery(newRepos) {
  // Load existing propagation.targets.json
  // Add new discoveries with status 'ready-for-pr'
  // Preserve existing repository data
  // Save updated JSON file
}

// Usage: node integrate-discovery.js repo1,repo2,repo3
const newRepos = process.argv[2]?.split(',') || [];
integrateDiscovery(newRepos);
```

## Quality Assurance Framework

### Pre-Deployment Checks
1. **Discovery Coverage**: Verify search queries find 15-20 repositories
2. **JSON Integration**: Confirm integrate-discovery.js saves all findings
3. **PR Creation**: Test GitHub MCP tools create valid pull requests
4. **Status Tracking**: Validate all status updates persist to JSON
5. **Report Generation**: Ensure HTML report reflects complete data

### Post-Deployment Verification
1. **No Missing Repositories**: Compare discovery results with final tracking
2. **Complete Status Updates**: No 'discovered' or 'ready-for-pr' remain
3. **Valid PR Information**: All 'pr-open' status has valid numbers/URLs
4. **Report Accuracy**: HTML dashboard shows true propagation scope
5. **Quality Metrics**: Success rate > 95% for PR creation

### Failure Recovery Procedures
1. **Discovery Data Loss**: Re-run discovery and integrate missing repositories
2. **PR Creation Failures**: Retry with GitHub MCP tools, fallback to issues if needed
3. **Status Inconsistencies**: Rebuild JSON tracking from GitHub API data
4. **Report Generation Issues**: Validate JSON structure and regenerate HTML

## Historical Context & Lessons Learned

### August 2025 Implementation Success
- **Discovery Breakthrough**: Found 19 repositories vs 12 in static lists
- **Data Loss Prevention**: Implemented mandatory integration step
- **PR-First Success**: Achieved 'pr-open' status for all targets
- **Quality Reporting**: Interactive HTML provided complete visibility

### Critical Issues Resolved
1. **Missing Discovery Integration**: Static lists missed 7 repositories
2. **Issue Creation Over PRs**: Issues created instead of preferred pull requests  
3. **Data Loss During Discovery**: Discoveries not saved to tracking file
4. **Incomplete Status Updates**: Repositories stuck in intermediate states

### System Hardening
1. **Mandatory Integration Gates**: Cannot proceed without JSON updates
2. **PR-First Enforcement**: Clear priority for pull request creation
3. **Complete Coverage Verification**: Quality checks ensure no missing repositories
4. **Interactive Reporting**: Visual confirmation of propagation scope

## Automation Requirements

### GitHub MCP Tools (Mandatory - No CLI Scripts)
**Critical Requirement**: Use GitHub MCP tools exclusively for all GitHub operations

**Primary Tools**:
- **mcp_github_get_pull_request** - Check PR status and draft flag
- **mcp_github_update_pull_request** - Convert draft PRs to ready (draft=false)
- **mcp_github_create_pull_request_with_copilot** - Create PRs via Copilot agent
- **mcp_github_create_pull_request** - Direct PR creation when needed
- **mcp_github_list_pull_requests** - List existing PRs
- **mcp_github_search_pull_requests** - Search for PRs by criteria

**Draft PR Management**:
- **NO DRAFT PRS ALLOWED** - All PRs must be ready for review immediately
- Check API response for "draft":true flag
- Convert any draft PRs using draft=false parameter
- Update JSON status from 'pr-created' to 'pr-open' after conversion

**Quality Standards**:
- All GitHub operations via MCP tools (not CLI scripts)
- Target status: 'pr-open' (ready for review) not 'pr-created' (ambiguous)
- Immediate draft conversion for any PRs created as drafts

### Local Environment  
- Node.js for script execution
- Git for local file operations
- Browser for HTML report viewing
- VS Code workspace for file management

### Authentication & Permissions
- GitHub token with repo scope
- Access to Azure-Samples organization
- Fork creation permissions for fallback workflows

## Success Metrics & KPIs

### Discovery Metrics
- **Coverage**: 15-20 repositories discovered (not 12 static)
- **Accuracy**: All Azure Functions AZD templates found
- **Integration**: 100% of discoveries saved to JSON

### Propagation Metrics  
- **PR Creation**: > 95% success rate for pull requests
- **Draft PR Management**: 0% draft PRs (all must be draft=false)
- **Tool Compliance**: 100% GitHub MCP tool usage (no CLI scripts)
- **Status Accuracy**: 'pr-open' for ready PRs (not 'pr-created')
- **Status Completion**: 0% repositories with 'discovered' status
- **Quality**: All 'pr-open' status has valid PR numbers/URLs

### Reporting Metrics
- **Accuracy**: HTML report reflects complete propagation scope
- **Command Path**: Use `node .github/prompts/.propagation/generate-report.js`
- **Viewing**: VS Code Simple Browser with file:// URL
- **Usability**: Interactive navigation and progress dashboards
- **Verification**: Visual confirmation of successful propagation

## Future Enhancements

### Advanced Discovery
- Multi-organization search patterns
- Template validation against AZD standards
- Automatic dependency detection

### Enhanced Reporting
- Progress tracking across multiple propagation runs
- Trend analysis and success rate monitoring
- Integration with CI/CD pipeline status

### Automation Improvements
- Automatic retry mechanisms for transient failures
- Smart conflict resolution for merge issues
- Integration with Azure DevOps for enterprise workflows

---

## Regeneration Instructions

This specification serves as the complete blueprint for recreating the Azure Functions AZD Templates Batch Propagation System. Use the templates above to generate:

1. **PROPAGATION_PROMPT.md** - Copy/paste ready prompt for triggering workflows
2. **PROPAGATION_INSTRUCTIONS.md** - Complete technical documentation
3. **Implementation scripts** - generate-report.js, integrate-discovery.js
4. **Package.json configuration** - NPM scripts for automation
5. **Quality verification procedures** - Ensure complete propagation coverage

The system prioritizes **dynamic discovery**, **complete tracking**, **PR-first approach**, and **interactive reporting** based on proven August 2025 implementation success.
  - LABELS: ["propagation", "automation"] (if allowed)
  - LIMIT: <int>
  - FORK_USER: paulyuk (the user account to host forks when direct push is unavailable)
- Instruction:
  """
  Using SOURCE_PR_URL metadata and previously computed mappings:
  - For each TARGET (up to LIMIT):
    - Check if write permission to upstream (Azure-Samples/<repo>) exists.
      - If not: ensure fork FORK_USER/<repo> exists (create if missing) and is synchronized with upstream default branch.
      - Create or update branch {BRANCH_NAME} in the fork (or upstream if direct write allowed).
    - Commit changes with message:
      "chore: propagate changes from <sourceRepo>#<prNumber>\n\nSource PR: <SOURCE_PR_URL>\nSummary: <auto-summarized change intent>\nNotes: Applied equivalent updates across AZD Functions templates."
    - Open a PR with:
        base: Azure-Samples/<repo>@defaultBranch
        head: (FORK_USER or upstream owner):{BRANCH_NAME}
      using PR_TITLE_TEMPLATE and PR_BODY_TEMPLATE.
    - Apply LABELS if permissions allow.
    - If conflicts arise, open as draft and note manual intervention.
  - Return JSON results:
    [ { "repo": "owner/repo", "prUrl": string, "branch": string, "status": "created"|"skipped"|"failed", "reason"?: string } ]
  """

Fork Workflow Variant (Summary)
- Purpose: Operate safely without upstream write access by using user forks (paulyuk) as the PR head source.
- Steps per repo:
  1. Fork existence check / creation.
  2. Upstream default branch fetch & fork sync (fast-forward only; if diverged, create a sync commit in fork).
  3. Feature branch creation in fork: {BRANCH_NAME}.
  4. Apply mapped changes & commit.
  5. Open PR: base=Azure-Samples/<repo>:main head=paulyuk:{BRANCH_NAME}.
  6. Apply labels (best-effort) and add propagation run ID comment.
  7. Record result.

Git CLI Reference (optional manual fallback)
```
upstream=Azure-Samples/functions-quickstart-javascript-azd
fork_user=paulyuk
branch=chore/propagate-from-functions-quickstart-dotnet-azd-pr-18
git clone https://github.com/$fork_user/${upstream##*/}.git || git clone https://github.com/$upstream.git
cd ${upstream##*/}
git remote add upstream https://github.com/$upstream.git 2>/dev/null || true
git fetch upstream main
git checkout -B main upstream/main
git push origin main
git checkout -B $branch
# (apply edits)
git commit -am "chore: propagate changes from functions-quickstart-dotnet-azd#18"
git push -u origin $branch
gh pr create --base main --head $fork_user:$branch --title "Propagate: <title> (from functions-quickstart-dotnet-azd#18)" --body-file pr_body.md
```

Output Contracts
- discovery.results.json
  [ { name, owner, repo, description, defaultBranch, languages, triggers, tags, url } ]
- dryrun.results.json
  [ { repo, manual_review_required, files: [ { path, changeSummary } ], diff } ]
- createprs.results.json
  [ { repo, prUrl, branch, status, reason? } ]

Consent Gates
- Gate 1: After discovery.results.json, require explicit user approval and allow deselection.
- Gate 2: After dryrun.results.json, require explicit user approval before PR creation.
- Gate 3: After createprs.results.json, present summary and next steps.

Configuration Parameters
- filters.serviceType: "Functions"
- filters.authors: ["Microsoft", "paulyuk"]
- filters.languages: [optional]
- filters.triggers: [optional]
- batch.limit: default 10
- branchPrefix: chore/propagate-from
- labels: ["propagation", "automation"] (if allowed)

Minimal Pseudo-Flow
- getSourcePr(SOURCE_PR_URL) -> {title, body, files[], patch[]}
- discoverTemplates({serviceType:"Functions", authors:["Microsoft","paulyuk"], languages?, triggers?}) -> repos[]
- promptUserApprove(repos)
- if dry-run:
  - for repo in approved[:BATCH_LIMIT]:
    - planChanges = mapChanges(sourcePatch, repo)
    - diffPreview = applyInMemory(planChanges)
  - promptUserApprove(diffPreviews)
- if create-prs:
  - for repo in approved[:BATCH_LIMIT]:
    - branch = createBranch(repo, branchName)
    - applyChanges(repo, plan)
    - commitAndPush(repo, branch)
    - openPR(repo, branch, title, body)
  - reportSummary()

Acceptance Criteria
- Shows a filtered list of AZD Functions templates by Microsoft or paulyuk for user confirmation.
- Supports a dry-run with clear diff previews before creating PRs.
- Creates PRs with standardized naming and links back to the source PR.
- Produces a success/failure summary.

Appendix A: Mapping Guidance Examples
- host.json changes: replicate equivalent settings across languages; ensure schema correctness.
- Bicep (infra): verify apiVersion compatibility; update outputs/params consistently; run a linter if available.
- README: keep language-specific commands/tools accurate (dotnet/npm/pip/gradle).
- CI workflows: align tooling versions; matrix may differ per language.

Appendix B: Rate Limiting & Idempotency
- Include a unique propagation run ID in PR body comments.
- Detect and update existing PRs from the same run.

Appendix C: Consent Gates
- The workflow must pause and await user confirmation at discovery and dry-run stages before proceeding to PR creation.

### New Validation Step (Added After Observed csproj Corruption)

Before attempting PR creation for each target repository, add an integrity check step after committing changes:

1. Re-fetch the modified `.csproj` from the fork/branch.
2. Confirm the file begins with a normal XML prolog `<?xml` (or `<Project` if no prolog) and does NOT contain long base64-encoded blobs (high entropy, characters A–Z/a–z/0–9+/ ending with `=` padding) replacing the XML.
3. If corruption is detected (file contents appear base64 or a single encoded line):
   - Reconstruct the file from the upstream `main` version plus intended diff (package version bumps, removal of `UserSecretsId`, etc.).
   - Force-update the file with a clean XML version.
   - Re-run the integrity check.
4. Only proceed to PR creation after a clean pass.

Rationale: A prior automated update produced a base64-encoded payload in place of the XML `<Project>` contents, which would break builds; this guard prevents propagating a corrupt project file.

Automation Hint: Implement a simple heuristic — treat as corrupt if (a) file length > 1.5x original and (b) fewer than 5 angle brackets `<` in first 500 characters.

### CSProj Corruption Incident – Root Cause & Hardened Safeguards

Observed Problem:
Earlier attempts produced a one-line base64 blob instead of readable XML inside `*.csproj` (e.g., prefix `PD94bWwg...` which is base64 for `<?xml`). Builds would fail because MSBuild expects raw XML, not an encoded payload.

Root Cause:
The automation path supplied the file content already base64-encoded to the GitHub file API wrapper that itself base64-encodes payloads. Double-encoding meant GitHub stored the encoded text literally. Final (good) commit used plain text XML (no prior base64) and preserved original ordering / formatting with only minimal semantic edits.

Key Differences in Successful Attempt (commit 46c7abb):
- Plain XML literal body posted (starts with `<Project` / XML prolog) – NOT a base64 string.
- Only minimal diff applied: removed `<UserSecretsId>`, added `<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.3.0" />`, bumped two versions, retained all other structure and indentation.
- Immediate post-commit fetch confirmed presence of angle brackets and absence of long contiguous base64 alphabet sequences.

Preventative Safeguards (Enforced Going Forward):
1. Content Submission Rule: Always submit raw XML text to the file update mechanism; never pre-encode.
2. Heuristic Pre-Commit Check (in memory): Reject content if it (a) lacks `<Project` within first 256 characters OR (b) matches regex `^[A-Za-z0-9+/]{40,}={0,2}$` (single-line high-entropy block).
3. Post-Commit Verification: Re-fetch raw file from branch; assert:
   - Contains at least 5 `<` characters in first 300 chars.
   - First non-whitespace char is `<`.
   - Does not start with `PD94` (base64 of `<?xml`).
4. Auto-Recovery: If corruption detected, pull upstream main version, re-apply intended minimal diff programmatically (idempotent), force update with correct XML, re-verify.
5. Minimal Diff Discipline: Only touch lines strictly required (package versions, additions, removals). Do not reorder unrelated `PackageReference`s or collapse whitespace.
6. Logging: Record a JSON entry per target: `{ "csprojIntegrity": "ok|recovered", "attempts": n, "sha": "..." }` for traceability.
7. Gate Before PR: Abort PR creation if `csprojIntegrity != ok`.

Manual Recovery Procedure (If Automation Fails):
- Get upstream main `*.csproj`.
- Apply required edits manually.
- Overwrite branch file with plain XML.
- Re-run post-commit verification heuristics.

Detection Snippets (pseudo):
```
if (content.StartsWith("PD94") && !content.Contains("<Project")) => treat as base64 corruption
if (AngleBracketCount(first300) < 5) => suspect corruption
```

Rationale:
Ensures we cannot silently propagate a broken project file, and root cause (double encoding) is permanently mitigated by explicit guard rails.

### Target Tracking File

A canonical machine- and human-readable tracking file `propagation.targets.json` is maintained at the root. It records each intended target template with:
- repo (string)
- status (enum): pending | in-progress | csproj-updated | staged-pr-attempt-failed | pr-open | pr-merged | skipped | error
- prNumber (nullable int)
- attempts (int) – count of modification / PR attempt cycles
- csprojIntegrity (if applicable): ok | recovered | n/a
- notes (string)

In addition, each target entry may include quick links:
- lastChangeType: "commit" | "pr"
- lastChangeUrl: direct URL to the most recent meaningful change (commit on fork branch or opened PR)

Maintenance rules:
- After committing changes to a fork branch, set lastChangeType=commit and lastChangeUrl to the commit permalink.
- After opening a PR, update to lastChangeType=pr and lastChangeUrl to the PR URL; keep prNumber in sync.
- Do not clear these fields; they serve as a breadcrumb trail for follow-up.

Workflow Requirements:
1. Initialize file before bulk operations with all targets (status=pending).
2. Immediately update status to in-progress when starting edits on a repo.
3. After successful local change + integrity pass: set csproj-updated (for .NET) or in-progress (non-.NET) before PR attempt.
4. After PR creation success: status=pr-open and record prNumber.
5. If PR creation blocked (e.g., 403): status=staged-pr-attempt-failed with notes including error text.
6. After merge (out-of-band): update to pr-merged.
7. On skip (policy / duplication): status=skipped with rationale in notes.
8. On corruption auto-recovery: increment attempts, annotate csprojIntegrity=recovered.
9. Always commit the tracking file change in the same branch as the target modifications (for audit provenance).

This file becomes the single source of truth for historical progress; downstream reporting (e.g., createprs.results.json) can be derived from it.

## 13. Infra / Output Evaluation Recording Pattern

Scope: Non-.NET target templates where only infrastructure outputs (e.g., removal of deprecated Application Insights connection string output) might require alignment.

Decision Points:
1. Inspect infra `main.bicep` (or equivalent) for deprecated outputs (e.g., `APPLICATIONINSIGHTS_CONNECTION_STRING`).
2. If absent: record a no-op evaluation.
3. If present: remove only that output block (minimal diff); commit.

Artifacts:
- Always produce a metadata file: `.propagation/infra-eval-<YYYYMMDDHHMMSS>.json` containing:
  {
    "sourcePr": "Azure-Samples/functions-quickstart-dotnet-azd#18",
    "targetRepo": "<repo>",
    "evaluatedFiles": ["infra/main.bicep"],
    "action": "no-op" | "removed-output",
    "removedOutputs": [ "APPLICATIONINSIGHTS_CONNECTION_STRING" ],
    "reason": "Already absent" | "Removed deprecated output",
    "timestampUtc": "<ISO8601>"
  }

Commit Messages:
- No-op: `chore: record infra evaluation (no-op) for propagation from source PR #18`
- Change: `chore: remove deprecated App Insights output (propagation from source PR #18)`

Tracking File Changes:
- `pending` → `infra-evaluated` (no-op)
- `pending` → `infra-updated` (output removed)
- Fields set: `lastChangeType=commit`, `lastChangeUrl=<commit permalink>`
- Notes examples: `infra evaluation no-op (AppInsights output already absent)` OR `removed AppInsights connection string output`

Safety Gates:
1. Diff must isolate only the targeted output block removal.
2. Reject if more unrelated lines (beyond whitespace) differ.

Future Automation:
- Parse Bicep AST to list outputs; if target output not found, emit metadata and commit automatically.

Rationale:
- Ensures traceability even when no modification is required; eliminates ambiguity later.

Status Vocabulary Additions:
- `infra-evaluated` | `infra-updated` | `csproj-recovered`

Example No-Op Metadata File:
{
  "sourcePr": "Azure-Samples/functions-quickstart-dotnet-azd#18",
  "targetRepo": "Azure-Samples/functions-quickstart-javascript-azd",
  "evaluatedFiles": ["infra/main.bicep"],
  "action": "no-op",
  "removedOutputs": [],
  "reason": "AppInsights connection string output already absent",
  "timestampUtc": "2025-08-08T00:40:00Z"
}

Log Checklist Snippet:
```
[infra-eval] validatedOutputs=ok changedOutputs=0 action=no-op fileCount=1
```
