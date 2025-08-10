# Batch Propagation Prompt Template

Use this prompt to trigger a complete batch propagation across Azure Functions AZD templates:

---

## 🎯 Propagation Request Prompt

```
Propagate a change from a source PR across Azure Functions AZD templates. Use the existing workflow in .github/prompts/.propagation/ to:

1. Dynamically discover target repositories using MULTIPLE discovery methods:
   - GitHub search: `functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`
   - AZD Template Gallery MCP server: https://github.com/spboyer/mcp-azd-template (if available)
   - Cross-reference both methods to ensure comprehensive coverage
2. **Update propagation.targets.json** with ALL discovered targets (append new discoveries, don't replace existing)
3. Apply infrastructure changes using the local git workflow script
4. **Validate against AZD best practices**: Use the AZD Template Gallery MCP server (https://github.com/spboyer/mcp-azd-template) to check if any important best practices are missed and propose additional changes to include in the PRs
5. **Create pull requests** using GitHub MCP tools for ALL repositories (include both the original changes AND any best practice improvements) - avoid creating issues unless PR creation fails
6. **Update tracking** with PR information (status should be 'pr-open', not 'issue-open' or 'discovered')
7. **Generate dynamic status report**: Use the Node.js script to create an interactive HTML report from the JSON data
8. **Open the report**: Display the generated HTML report in the browser for immediate review
9. Never commit the propagate* files or the .propagation*/* files

Source PR: [PASTE_YOUR_SOURCE_PR_URL_HERE]
Change description: [DESCRIBE_THE_CHANGE_TO_PROPAGATE]
Target discovery: Use multiple methods (GitHub search + AZD gallery MCP) for comprehensive template discovery
```

---

## 📝 Example Usage

```
Propagate a change from a source PR across Azure Functions AZD templates. Use the existing workflow in .github/prompts/.propagation/ to:

1. Dynamically discover target repositories using MULTIPLE discovery methods:
   - GitHub search: `functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`
   - AZD Template Gallery MCP server: https://github.com/spboyer/mcp-azd-template (if available)
   - Cross-reference both methods to ensure comprehensive coverage
2. **Update propagation.targets.json** with ALL discovered targets (append new discoveries, don't replace existing)
3. Apply infrastructure changes using the local git workflow script
4. **Validate against AZD best practices**: Use the AZD Template Gallery MCP server (https://github.com/spboyer/mcp-azd-template) to check if any important best practices are missed and propose additional changes to include in the PRs
5. **Create pull requests** using GitHub MCP tools for ALL repositories (include both the original changes AND any best practice improvements) - avoid creating issues unless PR creation fails
6. **Update tracking** with PR information (status should be 'pr-open', not 'issue-open' or 'discovered')
7. **Generate dynamic status report**: Use the Node.js script to create an interactive HTML report from the JSON data
8. **Open the report**: Display the generated HTML report in the browser for immediate review
9. Never commit the propagate* files or the .propagation*/* files

Source PR: https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/pull/25
Change description: Remove deprecated AZURE_CLIENT_ID environment variable from all templates
Target discovery: Use multiple methods (GitHub search + AZD gallery MCP) for comprehensive template discovery
```

## 🔧 What This Prompt Triggers

The assistant will automatically:

1. **Discover target repositories** using multiple discovery methods:
   - **GitHub Search**: Query patterns like `functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`
   - **AZD Template Gallery MCP**: Use https://github.com/spboyer/mcp-azd-template if available
   - **Cross-reference results**: Ensure comprehensive coverage by combining both methods
2. **Update propagation.targets.json with ALL discoveries** - append newly found repositories to existing targets (never lose existing tracking data)
3. **Load existing workflow** from `.github/prompts/.propagation/`
4. **Run infrastructure script** (`.github/prompts/.propagation/fix_infra_and_audit.sh`)
5. **Validate against AZD best practices** using the AZD Template Gallery MCP server to identify missed improvements
6. **Activate GitHub MCP tools** for reliable PR creation
7. **Create PRs for ALL target repositories** (including original changes + best practice improvements) - avoid issues, focus on PRs
8. **Update tracking file** with PR URLs and status (target status: 'pr-open', not 'issue-open' or 'discovered')
9. **Generate dynamic status report** using Node.js script to transform JSON into interactive HTML
10. **Open status report** in browser for immediate visual review of propagation results
11. **Provide summary** of all created PRs and best practice enhancements

## ✅ Prerequisites

Ensure these exist before using the prompt:
- `.github/prompts/.propagation/propagation.targets.json` (will be updated with discovered targets)
- `.github/prompts/.propagation/fix_infra_and_audit.sh` script
- `.github/prompts/.propagation/integrate-discovery.js` script (for updating JSON with discoveries)
- `.github/prompts/.propagation/WORKFLOW_INSTRUCTIONS.md` (detailed end-to-end instructions)
- GitHub MCP server activated in VS Code
- AZD Template Gallery MCP server (optional): https://github.com/spboyer/mcp-azd-template
- Clean working directory in the source repository
- Access to GitHub search API for template discovery

## 🎯 Success Factors

The workflow uses proven practices:
- **Mandatory JSON updates** for all discovered repositories using `integrate-discovery.js`
- **PR-first approach** - create pull requests for all targets, avoid issues unless PR creation fails
- **Complete tracking** - ensure no discovered repositories remain with `discovered` or `ready-for-pr` status
- **Multiple discovery methods** for comprehensive template coverage (GitHub search + AZD gallery)
- **AZD best practice validation** using the official template gallery as reference
- **GitHub MCP tools** for PR creation (more reliable than CLI)
- **Local git operations** for file changes (more reliable than API)
- **Automatic metadata exclusion** from commits
- **Enhanced PR content** combining original fixes with best practice improvements
- **Dynamic reporting** with immediate browser preview

## 📊 Expected Output

You'll receive:
- **Discovery summary**: List of Azure Functions templates found using multiple discovery methods
- **JSON integration**: Confirmation that ALL discovered targets were added to propagation.targets.json
- **Infrastructure changes**: Summary of changes applied across repositories
- **Best practice validation**: Analysis of templates against AZD gallery standards with improvement recommendations
- **Pull request creation**: PRs created for ALL discovered repositories (not issues)
- **Complete tracking**: All repositories with status 'pr-open' and valid PR URLs
- **Interactive HTML report**: Beautiful, dynamic status report opened in browser with clickable links and progress tracking
- **Quality verification**: No repositories left with 'discovered' or 'ready-for-pr' status
- **Clean commits**: Confirmation that no propagation metadata was committed

## 🔍 Dynamic Target Discovery

The workflow will use **multiple discovery methods** for comprehensive coverage:

### Method 1: GitHub Search API
- **Primary queries**: 
  - `functions-quickstart azd org:Azure-Samples`
  - `durable-functions azd org:Azure-Samples`
  - Additional patterns as needed (e.g., `azure-functions azd`, `functions azd template`)
- **Filter results**: Focus on Azure Functions templates with `azd` integration
- **Validate candidates**: Use code search to confirm templates have infrastructure files

### Method 2: AZD Template Gallery MCP (Optional)
- **MCP Server**: https://github.com/spboyer/mcp-azd-template
- **Gallery access**: Query official AZD template gallery
- **Filter criteria**: Azure Functions templates from microsoft* and paulyuk* organizations
- **Cross-reference**: Compare with GitHub search results

### Discovery Process
1. **Run both methods** (if AZD MCP is available)
2. **Merge and deduplicate** results from both sources
3. **Validate templates**: Confirm they have Bicep infrastructure files
4. **Check for target issue**: Search for deprecated patterns (e.g., APPLICATIONINSIGHTS_CONNECTION_STRING)
5. **Update tracking**: Add new discoveries to propagation.targets.json
6. **Report gaps**: Identify any templates missed by static lists

### Proven Results
- **August 2025 audit**: GitHub search found 19 templates vs 12 in static list
- **7 new templates discovered**: Including confirmed candidates needing fixes
- **Validation success**: Confirmed at least 1 new template had the target issue

---

*This prompt leverages the successful August 2025 propagation workflow that created 12 PRs across Azure Functions AZD templates.*
