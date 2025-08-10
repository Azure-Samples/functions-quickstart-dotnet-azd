# Azure Functions AZD Templates - Batch Propagation System

This directory contains a comprehensive system for dynamic discovery, change propagation, and interactive reporting across Azure Functions AZD template repositories.

## � CONTEXT RECOVERY TOOL

**If conversation context is lost after summarization**, use this recovery command:
```
Please read the GitHub MCP context anchors from .github/prompts/.propagation/github-mcp-reference-card.md and apply them to this conversation.
```

## �📁 Current File Structure (Simplified August 2025)

### 🎯 Essential Files (Enhanced with Context Preservation)
- **`PROPAGATION_PROMPT.md`** - Single ready-to-use prompt with GitHub MCP tool enforcement
- **`PROPAGATION_INSTRUCTIONS.md`** - Complete technical documentation with context anchors
- **`.propagation/github-mcp-reference-card.md`** - Context recovery tool for lost conversations

### 📐 System Blueprint  
- **`PR-Propagation-Batch-Spec.md`** - Authoritative specification that can regenerate the entire system

### 🛠️ Implementation
- **`.propagation/`** - Working directory with scripts, tracking, and reports

## ⚡ Quick Start (30 Seconds)

### 🚀 Use the Ready-Made Prompt (Recommended)

1. **Open** `PROPAGATION_PROMPT.md`
2. **Copy the prompt template** and replace `[PASTE_YOUR_SOURCE_PR_URL_HERE]` with your PR
3. **Paste into VS Code chat** - complete automation handles everything!

**Example:**
```
Execute a complete batch propagation across Azure Functions AZD templates using the workflow in .github/prompts/.propagation/:

1. **Dynamically discover** target repositories using GitHub search (`functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`)
2. **Integrate ALL discoveries** into propagation.targets.json using the integration script: `npm run integrate-discovery -- [discovered repos]`
3. **Apply infrastructure changes** using the local git workflow script
4. **Create pull requests** for ALL repositories using GitHub MCP tools (prioritize PRs over issues)
5. **Update tracking** with PR information (target status: 'pr-open')
6. **Generate dynamic HTML report** and open in browser: `npm run report && open propagation-status-report.html`
7. **Verify quality**: Ensure no repositories remain with 'discovered' or 'ready-for-pr' status

Source PR: https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/pull/25
Change description: Remove deprecated AZURE_CLIENT_ID environment variable from all templates

Success criteria: All discovered repositories should have status 'pr-open' with valid PR numbers and be included in the interactive HTML report.
```

The assistant automatically handles:
- ✅ **Dynamic discovery** of 15-20 Azure Functions AZD templates
- ✅ **JSON integration** ensuring all discoveries are tracked  
- ✅ **Infrastructure changes** across all repositories
- ✅ **PR creation** with GitHub MCP tools
- ✅ **Status tracking** with complete metadata
- ✅ **Interactive HTML report** opened in browser
- ✅ **Quality verification** ensuring complete coverage

## 🏆 Proven Success (August 2025)

### 📊 Discovery Breakthrough
- **Dynamic GitHub search**: Found **19 Azure Functions AZD templates**  
- **Static list comparison**: Previous lists only had **12 repositories**
- **Coverage improvement**: **7 additional templates** discovered and processed
- **Quality outcome**: All 19 repositories successfully tracked and reported

### 🎯 Key Achievements
- ✅ **Complete automation** from discovery to PR creation to reporting
- ✅ **Zero data loss** with mandatory integration steps
- ✅ **PR-first approach** achieving 'pr-open' status for all targets
- ✅ **Interactive HTML reports** providing visual confirmation
- ✅ **Quality verification** ensuring no repositories left behind

## 🔧 System Architecture

### Core Components

#### 1. **Dynamic Discovery Engine**
- Real-time GitHub search using proven query patterns
- Finds 15-20 repositories (not limited to static lists)
- Multiple search strategies for comprehensive coverage

#### 2. **JSON Tracking System** 
- `propagation.targets.json` as single source of truth
- Status tracking from 'discovered' → 'ready-for-pr' → 'pr-open'
- Complete metadata including PR numbers and URLs

#### 3. **Interactive HTML Reporting**
- Beautiful dashboards with progress tracking
- Technology grouping (TypeScript, .NET, Python, Java)
- Clickable navigation to repositories and PRs
- Generated via: `npm run report && open propagation-status-report.html`

#### 4. **Discovery Integration Protection**
- `integrate-discovery.js` script prevents data loss
- Ensures ALL findings are saved to JSON immediately
- Critical step: `npm run integrate-discovery -- [discovered repos]`

## 📋 Critical Success Requirements

### 1. **Mandatory Discovery Integration**
- ALL discovered repositories MUST be saved to `propagation.targets.json`
- Use integration script immediately after discovery phase
- Never proceed without JSON integration

### 2. **PR-First Approach**
- Prioritize pull request creation over issue creation  
- Target status: 'pr-open' not 'issue-open' or 'discovered'
- Only create issues if PR creation fails after multiple attempts

### 3. **Complete Coverage Verification**
- No repositories should remain with status 'discovered'
- Interactive HTML report must show complete propagation scope
- All PRs must have valid numbers and URLs

## � Working Directory (.propagation/)

### Current Contents
```
.propagation/
├── propagation.targets.json          # Central tracking file (single source of truth)
├── generate-report.js                # Interactive HTML report generator  
├── integrate-discovery.js            # Discovery integration script
├── package.json                      # NPM scripts configuration
├── propagation-status-report.html    # Generated HTML report (auto-created)
└── [other implementation files]
```

### Quick Scripts
```bash
# Navigate to working directory
cd .github/prompts/.propagation

# Generate interactive HTML report
npm run report

# Open report in browser
open propagation-status-report.html

# Integrate new discoveries (prevent data loss)
npm run integrate-discovery -- repo1,repo2,repo3
```

## 🔍 Troubleshooting

### Missing Repositories in Report
**Problem**: HTML report shows fewer repositories than discovered  
**Solution**: Check if `integrate-discovery.js` was executed with all findings

### Status Stuck on 'discovered'
**Problem**: Repositories not progressing through workflow  
**Solution**: Run PR creation phase and update JSON with results

### Incomplete PR Information  
**Problem**: Status shows 'pr-open' but missing pr_number or pr_url  
**Solution**: Re-run PR creation with proper JSON updates

## 📚 Documentation Deep Dive

### For Complete Instructions
- **Read**: `PROPAGATION_INSTRUCTIONS.md` for comprehensive technical documentation
- **Includes**: Workflow details, troubleshooting, quality verification procedures
- **Coverage**: All components, scripts, and success criteria

### For System Blueprint
- **Read**: `PR-Propagation-Batch-Spec.md` for authoritative specification  
- **Purpose**: Can regenerate entire system including prompts and instructions
- **Usage**: Template library for recreating or enhancing the system

## 🎯 Success Metrics

### Discovery Metrics
- **Coverage**: 15-20 repositories discovered (not 12 static)
- **Accuracy**: All Azure Functions AZD templates found
- **Integration**: 100% of discoveries saved to JSON

### Propagation Metrics
- **PR Creation**: > 95% success rate for pull requests
- **Status Completion**: 0% repositories with 'discovered' status  
- **Quality**: All 'pr-open' status has valid PR numbers/URLs

### Reporting Metrics
- **Accuracy**: HTML report reflects complete propagation scope
- **Usability**: Interactive navigation and progress dashboards
- **Verification**: Visual confirmation of successful propagation

---

## 🚀 Next Steps

1. **Use the prompt**: Copy from `PROPAGATION_PROMPT.md` and paste into VS Code chat
2. **Review instructions**: Read `PROPAGATION_INSTRUCTIONS.md` for technical details
3. **Monitor progress**: Watch the interactive HTML report for real-time status
4. **Verify completion**: Ensure all repositories reach 'pr-open' status

*This system provides complete automation for Azure Functions AZD template propagation with comprehensive discovery, tracking, and reporting capabilities.*
