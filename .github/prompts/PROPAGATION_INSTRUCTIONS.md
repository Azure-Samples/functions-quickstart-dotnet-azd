# Azure Functions AZD Templates Batch Propagation System

**Complete instructions for dynamic discovery, change propagation, and interactive reporting across Azure Functions AZD templates.**

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

### Phase 3: Infrastructure Changes
```bash
# Apply changes using the local git workflow script
# Process each repository with status 'ready-for-pr'
```

### Phase 4: PR Creation
```bash
# Use GitHub MCP tools to create pull requests
# Update JSON with PR numbers and URLs
# Target status: 'pr-open' for all repositories
```

### Phase 5: Reporting & Verification
```bash
# Generate interactive HTML report
npm run report

# Open in browser for verification
open propagation-status-report.html

# Quality check: No repositories should remain with status 'discovered' or 'ready-for-pr'
```

## 📊 Package.json Scripts

```json
{
  "scripts": {
    "report": "node generate-report.js",
    "integrate-discovery": "node integrate-discovery.js"
  }
}
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

### 2. **PR-First Approach**
- Prioritize pull request creation over issue creation
- Only create issues if PR creation fails after multiple attempts
- Target status should be 'pr-open' not 'issue-open'

### 3. **Single Source of Truth**
- propagation.targets.json is the authoritative tracking file
- All status updates must be persisted to JSON
- Report generation reads exclusively from JSON

### 4. **Quality Verification**
- No repositories should remain with status 'discovered'
- Interactive HTML report must show complete propagation scope
- All PRs must have valid numbers and URLs

## 🔧 Troubleshooting

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
