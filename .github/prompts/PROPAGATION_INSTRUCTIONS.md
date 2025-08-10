# Azure Functions AZD Templates Batch Propagation System

**Complete instructions for dynamic discovery, change propagation, and interactive reporting across Azure Functions AZD templates.**

## 🚨 WORKFLOW MEMORY ANCHORS - PRESERVE ACROSS SUMMARIES

### CRITICAL Tool Requirements:
- **GitHub Operations**: ONLY use `mcp_github_*` tools (NEVER CLI)
- **Authentication Failures**: Fork-first workflow (`mcp_github_fork_repository`)
- **Status Tracking**: Update JSON immediately after operations
- **Validation**: Generate HTML reports for verification

### GitHub MCP Tools Enforcement:
```
✅ REQUIRED: mcp_github_create_pull_request_with_copilot
✅ REQUIRED: mcp_github_list_pull_requests  
✅ REQUIRED: mcp_github_get_pull_request_*
✅ FALLBACK: mcp_github_fork_repository
❌ FORBIDDEN: gh CLI, git commands, terminal GitHub ops
```

### Quality Gates:
- All PRs tracked with GitHub MCP validation
- Consistent JSON schema across all entries  
- Immediate status updates after operations
- HTML report generation for final validation

---

## 📁 System Overview

This system automates the propagation of infrastructure changes across multiple Azure Functions AZD template repositories. It provides:

- **Dynamic discovery** of all Azure Functions AZD templates via GitHub search
- **JSON-based tracking** with `propagation.targets.json` as the single source of truth
- **Automated change application** using git workflows and GitHub MCP tools
- **Interactive HTML reports** with progress dashboards and clickable navigation
- **Quality verification** to ensure complete propagation coverage

## 🛠️ Core Components

### 1. propagation.targets.json
**Central tracking file for all discovered repositories and their status**

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

**Status Values:**
- `discovered` - Found via search but not yet processed
- `ready-for-pr` - Prepared for PR creation
- `pr-open` - Pull request successfully created
- `issue-open` - Fallback issue created (avoid when possible)
- `complete` - Changes merged and propagation finished

### 2. generate-report.js
**Dynamic HTML report generator**

```bash
# Generate and view report
npm run report
open propagation-status-report.html
```

**Report Features:**
- Progress dashboard with completion percentages
- Interactive badges showing repository status
- Technology grouping (TypeScript, .NET, Python, etc.)
- Direct links to PRs, issues, and repositories
- Responsive design with modern CSS styling

### 3. integrate-discovery.js
**Discovery integration script to prevent data loss**

```bash
# Integrate discovered repositories
npm run integrate-discovery -- repo1,repo2,repo3

# Script functionality:
# - Loads existing propagation.targets.json
# - Adds new discoveries with status 'ready-for-pr'
# - Preserves existing repository data
# - Saves updated JSON file
```

### 4. GitHub Search Queries
**Dynamic discovery patterns for comprehensive coverage**

```javascript
// Primary searches for maximum discovery
const searchQueries = [
  'functions-quickstart azd org:Azure-Samples',
  'durable-functions azd org:Azure-Samples',
  'azure-functions azd in:name org:Azure-Samples',
  'functions azd template org:Azure-Samples'
];
```

## 🔄 Complete Workflow

### Phase 1: Dynamic Discovery
```bash
# Execute GitHub searches to find ALL Azure Functions AZD templates
# Expected: 15-20 repositories across different languages/technologies
```

### Phase 2: Discovery Integration
```bash
# CRITICAL: Save all discoveries to JSON immediately
npm run integrate-discovery -- [discovered-repo-list]

# Verify JSON contains all discoveries
node -e "console.log(JSON.parse(require('fs').readFileSync('propagation.targets.json')).targets.length)"
```

### Phase 3: Check for Existing PRs
```bash
# CRITICAL: Before creating new PRs, check if they already exist
# This prevents duplicate PRs and updates tracking with existing ones

# Use automated script to check all repositories
node check-existing-prs.js

# Manual verification for specific repository:
gh pr list --repo Azure-Samples/target-repo --state all | grep -i "app insights\|applicationinsights\|propagation from"

# Update JSON tracking with found PRs to avoid duplication
```

### Phase 4: Infrastructure Changes
```bash
# Apply changes using the local git workflow script
# Process each repository with status 'ready-for-pr'
```

### Phase 5: PR Creation & Status Management

**🚨 CRITICAL: GitHub MCP Tools ONLY - Context Preservation**

```bash
# MANDATORY: Use GitHub MCP tools exclusively for ALL GitHub operations
# These tools provide reliable GitHub API interactions and maintain auth context
# NEVER use gh CLI, git commands, or terminal GitHub operations

# PRIMARY APPROACH: GitHub MCP Tools (REQUIRED)
✅ mcp_github_create_pull_request_with_copilot  # Main PR creation
✅ mcp_github_list_pull_requests                # Status validation  
✅ mcp_github_get_pull_request                  # PR inspection
✅ mcp_github_update_pull_request              # Status updates
✅ mcp_github_fork_repository                  # Auth fallback

# WORKFLOW ENFORCEMENT:
1. VALIDATE repository state with mcp_github_list_pull_requests
2. CREATE PR with mcp_github_create_pull_request_with_copilot
3. UPDATE tracking JSON immediately after PR creation
4. VERIFY PR status with mcp_github_get_pull_request
5. GENERATE HTML report for validation

# AUTHENTICATION FAILURE PROTOCOL (Fork-First):
When mcp_github_create_pull_request_with_copilot fails with 401/403:
1. Fork: mcp_github_fork_repository (owner="Azure-Samples", repo="target-repo")
2. Create PR: mcp_github_create_pull_request_with_copilot (owner="user-profile")
3. Update JSON: Add fork-based PR info immediately
4. Status: Set to 'pr-open' with notes about fork workflow

# IMMEDIATE STATUS UPDATE REQUIREMENT:
After EVERY PR creation operation:
✅ Update propagation.targets.json with PR number and URL
✅ Set status to 'pr-open' 
✅ Include lastChangeType: "pr"
✅ Add attempts counter increment

# FORBIDDEN OPERATIONS:
❌ gh pr create
❌ git commands in terminal  
❌ CLI-based GitHub operations
❌ Manual shell scripts for PR creation
```

### Phase 6: Report Generation & Verification
```bash
# Generate interactive HTML report using correct path
node .github/prompts/.propagation/generate-report.js

# Alternative if npm script exists:
npm run report

# Open report in VS Code Simple Browser for immediate viewing
# Use open_simple_browser tool with file:// URL

# Quality check: All PRs should be in 'pr-open' status (ready for review)
# No repositories should have 'pr-created' or draft PR status
```

## 📊 Package.json Scripts

```json
{
  "scripts": {
    "report": "node generate-report.js",
    "integrate-discovery": "node integrate-discovery.js",
    "check-existing-prs": "node check-existing-prs.js",
    "update-targets": "node update-targets.js",
    "full-refresh": "npm run update-targets && npm run report"
  }
}
```

## 🔧 Scripts Reference

```bash
# Discovery integration
npm run integrate-discovery -- repo1 repo2 repo3

# Check for existing PRs before creating new ones
node check-existing-prs.js

# Generate/update report
npm run report

# Full refresh (update + report)
npm run full-refresh

# Manual JSON update (for corrections)
npm run update-targets
```

## 🎯 Quality Verification

### Success Criteria
- **Complete Discovery**: All Azure Functions AZD templates found and tracked
- **Full Integration**: Every discovered repository saved to propagation.targets.json
- **Maximum PR Creation**: Status 'pr-open' not 'issue-open' or 'discovered'
- **Accurate Tracking**: Valid PR numbers and URLs for all repositories
- **Quality Reporting**: Interactive HTML showing true propagation scope

### Quality Checks
```bash
# Check for incomplete statuses
grep -E "(discovered|ready-for-pr)" propagation.targets.json

# Verify all repositories have PR numbers
node -e "
const data = JSON.parse(require('fs').readFileSync('propagation.targets.json'));
const noPR = data.targets.filter(t => t.status === 'pr-open' && !t.pr_number);
console.log('Missing PR numbers:', noPR.length);
"

# Validate JSON structure
node -e "JSON.parse(require('fs').readFileSync('propagation.targets.json'))"
```

## 🚨 Critical Requirements

### 1. **Mandatory Discovery Integration**
- ALL discovered repositories MUST be saved to propagation.targets.json
- Use `integrate-discovery.js` immediately after search
- Never proceed without JSON integration

### 2. **GitHub MCP Tools & No Draft PRs**
- **Use GitHub MCP tools exclusively** for all GitHub operations (not CLI scripts)
- **mcp_github_get_pull_request** - Check PR status including draft flag
- **mcp_github_update_pull_request** - Convert draft PRs to ready state
- **mcp_github_create_pull_request_with_copilot** - Create PRs via Copilot agent
- **NO DRAFT PRS ALLOWED** - All PRs must be ready for review immediately
- Convert any draft PRs to ready status using draft=false parameter
- Target status should be 'pr-open' (ready) not 'pr-created' (ambiguous)

### 3. **Report Generation & Quality Standards**
- **Use correct path**: `node .github/prompts/.propagation/generate-report.js`
- **View in VS Code**: Use open_simple_browser tool with file:// URL  
- **No draft PRs**: All PRs must show draft=false in API responses
- **Consistent status**: Use 'pr-open' for ready PRs, not 'pr-created'
- All repositories must progress beyond 'discovered' or 'ready-for-pr'

### 4. **Single Source of Truth**
- propagation.targets.json is the authoritative tracking file
- All status updates must be persisted to JSON
- Report generation reads exclusively from JSON

### 5. **Quality Verification**
- No repositories should remain with status 'discovered'
- Interactive HTML report must show complete propagation scope
- All PRs must have valid numbers and URLs
- **All PRs must be ready for review (draft=false)**

## 🔧 Troubleshooting

### GitHub MCP Tools: Mandatory for GitHub Operations
**Requirement**: Use GitHub MCP tools exclusively instead of CLI scripts
**Tools Available**:
```bash
# Check PR status and draft flag
mcp_github_get_pull_request - Returns draft=true/false in response

# Convert draft PRs to ready for review
mcp_github_update_pull_request - Use draft=false parameter

# Create PRs via Copilot agent (preferred method)
mcp_github_create_pull_request_with_copilot

# Create PRs directly when needed
mcp_github_create_pull_request

# List and search PRs
mcp_github_list_pull_requests
mcp_github_search_pull_requests
```

### Draft PR Conversion: Critical Quality Step
**Problem**: PRs created as drafts (draft=true) are not ready for review
**Solution**: Immediate conversion to ready status
```bash
# 1. Check PR status
mcp_github_get_pull_request -> Look for "draft":true

# 2. Convert to ready
mcp_github_update_pull_request with draft=false parameter

# 3. Update tracking JSON
# Change status from 'pr-created' to 'pr-open'
# Add note: "converted from draft to ready"

# 4. Verify conversion
mcp_github_get_pull_request -> Confirm "draft":false
```

### Report Generation: Correct Execution Path
**Problem**: Report generation fails due to incorrect command path
**Solution**: Use proper file paths and tools
```bash
# Correct command path
node .github/prompts/.propagation/generate-report.js

# View in VS Code Simple Browser
open_simple_browser tool with file:///absolute/path/to/report.html

# Common error: npm run report without package.json
# Solution: Use direct node command with correct path
```

### Duplicate PR Prevention: Check Before Creating
**Problem**: Risk of creating duplicate PRs for the same change
**Solution**: Always check for existing PRs first
```bash
# Automated check for all repositories
node check-existing-prs.js

# Manual check for specific repository
gh pr list --repo Azure-Samples/target-repo --state all | grep -i "app insights\|applicationinsights\|propagation from"

# Update tracking JSON with found PRs:
# - status: 'pr-open' (if open) or 'pr-merged' (if merged)
# - prNumber: extracted from PR list
# - lastChangeUrl: PR URL
# - notes: 'PR already exists'
```

### Permission Issues: Fork-Based PR Creation
**Problem**: Cannot create PRs directly on target repositories (401 Unauthorized)
**Solution**: Use fork-based workflow
```bash
# 1. Fork the repository to your profile
gh repo fork Azure-Samples/target-repo --clone

# 2. Navigate to forked repository
cd target-repo

# 3. Create feature branch
git checkout -b chore/propagate-changes

# 4. Apply infrastructure changes
# (Remove APPLICATIONINSIGHTS_CONNECTION_STRING from infra/main.bicep)

# 5. Commit and push to fork
git add infra/main.bicep
git commit -m "Remove deprecated App Insights output (propagation from #18)"
git push origin chore/propagate-changes

# 6. Create PR from fork to upstream
gh pr create --title "Remove deprecated App Insights output (propagation from #18)" \
  --body "Remove deprecated APPLICATIONINSIGHTS_CONNECTION_STRING output from Bicep template" \
  --repo Azure-Samples/target-repo

# 7. Update JSON with fork-based PR information
```

### Missing Repositories in Report
**Problem**: HTML report shows fewer repositories than discovered
**Solution**: Check if `integrate-discovery.js` was executed with all findings

### Status Stuck on 'discovered'
**Problem**: Repositories not progressing through workflow
**Solution**: Run PR creation phase and update JSON with results

### Incomplete PR Information
**Problem**: Status shows 'pr-open' but missing pr_number or pr_url
**Solution**: Re-run PR creation with proper JSON updates

### Quality Check Failures
**Problem**: Repositories remain with incomplete statuses
**Solution**: Execute complete workflow ensuring each phase updates JSON

## 📈 Historical Context

This system was developed in August 2025 to address critical gaps in the original batch propagation workflow:

- **Discovery Gap**: Only 12 repositories tracked when 19 existed
- **Data Loss**: Discovered repositories not saved to tracking file
- **Issue Priority**: Issues created instead of preferred pull requests
- **Reporting Accuracy**: Static reports not reflecting true scope

The enhanced system ensures complete discovery, mandatory integration, PR-first approach, and accurate reporting through proven workflows and quality verification steps.

## 🎨 Report Features

The generated HTML report includes:

- **Progress Dashboard**: Visual completion percentage and statistics
- **Status Badges**: Color-coded repository states with modern styling
- **Technology Grouping**: Organized by programming language (.NET, TypeScript, Python)
- **Interactive Navigation**: Direct links to PRs, issues, and repositories
- **Responsive Design**: Clean, professional appearance across devices
- **Quality Indicators**: Clear visibility into incomplete propagations

## 🔗 Integration Points

- **GitHub MCP Tools**: For automated PR/issue creation
- **GitHub Search API**: For dynamic repository discovery
- **Node.js Scripts**: For JSON processing and HTML generation
- **VS Code Workspace**: For file management and terminal execution
- **Git Workflows**: For local change application and testing

---

*This system provides complete automation for Azure Functions AZD template propagation with comprehensive discovery, tracking, and reporting capabilities.*
