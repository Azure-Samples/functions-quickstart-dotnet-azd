# End-to-End Propagation Workflow Instructions

This document provides explicit instructions for the complete propagation workflow that ensures:
1. **Dynamic discovery is always captured** in the JSON tracking file
2. **Pull requests are prioritized** over issues or discovery status
3. **No repositories are left behind** in the propagation process

## 🔄 Complete Workflow Steps

### Step 1: Dynamic Discovery
Use multiple discovery methods to find ALL relevant repositories:
- GitHub search with patterns like `functions-quickstart azd org:Azure-Samples`
- AZD Template Gallery MCP server (if available)
- Cross-reference both methods for comprehensive coverage

**Expected Output**: List of repository names (e.g., `functions-quickstart-dotnet-azd-timer`)

### Step 2: Integrate Discovery Results
**Critical**: Update the JSON tracking file with ALL discovered repositories

```bash
# Navigate to propagation directory
cd .github/prompts/.propagation

# Integrate discovered repositories into JSON (replace with actual discoveries)
node integrate-discovery.js functions-quickstart-dotnet-azd-timer functions-quickstart-python-azd-eventgrid-blob [... all discovered repos]

# Alternative: use npm script
npm run integrate-discovery -- repo1 repo2 repo3
```

**Expected Status**: All new repositories added with status `ready-for-pr`

### Step 3: Apply Infrastructure Changes
Run the infrastructure script to apply changes across repositories:

```bash
# Run the infrastructure changes script
./.github/prompts/.propagation/fix_infra_and_audit.sh
```

### Step 4: Create Pull Requests (Not Issues!)
**Priority**: Create PRs for ALL repositories with status `ready-for-pr`

Use GitHub MCP tools to create pull requests:
- Target ALL repositories in the JSON file
- Include original changes + best practice improvements
- Avoid creating issues unless PR creation explicitly fails

**Expected Status**: Repositories updated to `pr-open` with PR numbers

### Step 5: Update Tracking
Update the JSON file with PR information for each created PR:

```javascript
// Example update for successful PR creation
{
  "repo": "Azure-Samples/functions-quickstart-dotnet-azd-timer",
  "status": "pr-open",
  "prNumber": 15,
  "lastChangeUrl": "https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-timer/pull/15",
  "notes": "PR created with infrastructure fixes and best practices"
}
```

### Step 6: Generate Status Report
Create the interactive HTML report:

```bash
# Generate the dynamic report
npm run report

# Open in browser for immediate review
open propagation-status-report.html
```

## 🎯 Success Criteria

### JSON File Requirements
- ✅ Contains ALL discovered repositories (no missing discoveries)
- ✅ Most repositories have status `pr-open` (not `issue-open` or `discovered`)
- ✅ All PRs have valid PR numbers and URLs
- ✅ Metadata shows current timestamp and discovery method

### Status Distribution Goals
- **Merged**: 1 (source repository)
- **PR Open**: Maximum possible (target for all discovered repos)
- **Issue Open**: Minimum (only when PR creation fails)
- **Ready for PR**: 0 (all should be converted to PRs)
- **Discovered**: 0 (all should be processed)

### Report Quality
- ✅ Shows all discovered repositories
- ✅ Provides clickable links to all PRs
- ✅ Groups repositories by technology for easy review
- ✅ Shows accurate completion statistics

## 🚨 Common Issues & Prevention

### Issue: Discovery Results Not Saved
**Problem**: Dynamic discovery finds repositories but they're not in the JSON
**Solution**: Always run `integrate-discovery.js` with ALL discovered repositories
**Prevention**: Make this step mandatory in the workflow prompt

### Issue: Creating Issues Instead of PRs
**Problem**: Workflow creates GitHub issues instead of pull requests
**Solution**: Explicitly prioritize PR creation, use issues only as fallback
**Prevention**: Update prompt to emphasize "avoid creating issues unless PR creation fails"

### Issue: Incomplete Status Updates
**Problem**: Repositories remain with `discovered` or `ready-for-pr` status
**Solution**: Update JSON file after each PR creation with proper status and PR number
**Prevention**: Include explicit tracking update steps in workflow

## 📋 Quality Checklist

Before considering the propagation complete, verify:

- [ ] All discovered repositories are in `propagation.targets.json`
- [ ] No repositories have status `discovered` or `ready-for-pr`
- [ ] Maximum number of repositories have status `pr-open`
- [ ] All PR links are valid and accessible
- [ ] HTML report shows accurate total count
- [ ] Report groups repositories correctly by technology
- [ ] Statistics reflect the true propagation scope

## 🔧 Scripts Reference

```bash
# Discovery integration
npm run integrate-discovery -- repo1 repo2 repo3

# Generate/update report
npm run report

# Full refresh (update + report)
npm run full-refresh

# Manual JSON update (for corrections)
npm run update-targets
```

---

**Remember**: The goal is to have **pull requests created for ALL discovered repositories**, with the JSON file serving as the single source of truth for tracking progress.
