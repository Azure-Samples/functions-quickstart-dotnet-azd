# Batch Propagation Guide for Azure Functions AZD Templates

## 🚨 CRITICAL CONTEXT PRESERVATION - READ FIRST

### WORKFLOW MEMORY ANCHORS (Preserve Across Conversation Summaries):
- **GitHub Operations**: ONLY use `mcp_github_*` tools (NEVER CLI)
- **Authentication Failures**: Fork-first workflow (`mcp_github_fork_repository`)  
- **Status Tracking**: Update JSON immediately after operations
- **Validation**: Generate HTML reports for verification

### GitHub MCP Tools Enforcement:
```
✅ MANDATORY: mcp_github_create_pull_request_with_copilot
✅ MANDATORY: mcp_github_list_pull_requests
✅ MANDATORY: mcp_github_get_pull_request_*
✅ FALLBACK: mcp_github_fork_repository
❌ FORBIDDEN: gh CLI, git commands, terminal GitHub ops
```

### Quality Gates (ENFORCE ALWAYS):
- All PRs tracked with GitHub MCP validation
- Consistent JSON schema across all entries
- Immediate status updates after operations  
- HTML report generation for final validation

---

## Overview
This guide documents the successful workflow for propagating changes across multiple Azure Functions AZD template repositories using GitHub MCP tools and local git operations.

## Key Learnings from August 2025 Propagation

### What Worked Well

#### 1. GitHub MCP Tools for PR Creation
**✅ USE: GitHub MCP Server (`mcp_github_create_pull_request`)**
- **Why it worked**: Direct GitHub API access with proper authentication
- **Advantages**: 
  - No authentication issues
  - Reliable PR creation
  - Consistent formatting
  - Better error handling
- **Result**: Successfully created 12 PRs without failures

**❌ AVOID: Script-based PR creation via GitHub CLI**
- **Why it failed**: Authentication and permissions complexity
- **Issues encountered**: Token scope problems, inconsistent CLI behavior

#### 2. Local Git Workflow for File Changes
**✅ USE: Local repository cloning and git operations**
- **Why it worked**: Full git history and context available
- **Advantages**:
  - Reliable file modifications
  - Proper git workflow with safety checks
  - Force-with-lease for safe pushes
  - Better conflict resolution

**❌ AVOID: GitHub Contents API for file modifications**
- **Why it failed**: Base64 encoding corruption, limited git context
- **Issues encountered**: File corruption, non-fast-forward push problems

#### 3. Propagation Metadata Management
**✅ CRITICAL: Always exclude propagation artifacts from commits**
- **Implementation**: Use `.gitignore` patterns and explicit exclusions
- **Files to exclude**:
  - `propagate*` files
  - `.propagation/*` directories
  - `propagation.targets.json` (tracking only, not for target repos)

### Proven Workflow Steps

#### Phase 1: Setup and Planning
1. **Discover target repositories** using multiple methods:
   - **GitHub Search**: Query `functions-quickstart azd org:Azure-Samples` and similar patterns
   - **AZD Template Gallery MCP**: Use https://github.com/spboyer/mcp-azd-template if available
   - **Cross-reference results**: Ensure comprehensive coverage
   - **Validate discoveries**: Confirm templates have relevant infrastructure and issues
2. **Create/update tracking file** (`propagation.targets.json`) with all discovered repositories
3. **Prepare scripts** with proper git safety measures
4. **Activate GitHub MCP tools** for PR management

#### Discovery Success Story (August 2025)
- **Static list**: Started with 12 manually identified templates
- **Dynamic discovery**: Found 19 templates via GitHub search (`functions-quickstart azd org:Azure-Samples`)
- **Gap analysis**: Discovered 7 additional templates that needed the same fix
- **Validation**: Confirmed at least 1 new template had the target issue
- **Recommendation**: Always use dynamic discovery to avoid missing templates

## Template Discovery Methodology

### Multiple Discovery Methods (Recommended)

#### Method 1: GitHub Search API
**Primary Discovery Tool**: Use GitHub's search capabilities to find Azure Functions AZD templates
```bash
# Effective search patterns
mcp_github_search_repositories --query "functions-quickstart azd org:Azure-Samples"
mcp_github_search_repositories --query "durable-functions azd org:Azure-Samples"
mcp_github_search_repositories --query "azure-functions azd org:Azure-Samples"
```

**Benefits**:
- Comprehensive coverage of GitHub repositories
- Real-time results
- Can search across multiple organizations
- Filter by topics, language, and patterns

#### Method 2: AZD Template Gallery MCP Server (Optional)
**Secondary/Validation Tool**: Use official AZD template gallery
- **MCP Server**: https://github.com/spboyer/mcp-azd-template
- **Purpose**: Query the official Azure Developer CLI template gallery
- **Advantage**: Authoritative source for AZD templates
- **Limitation**: May not include all community/forked templates

#### Hybrid Approach (Best Practice)
1. **Run GitHub search** for comprehensive discovery
2. **Cross-reference with AZD gallery** (if MCP available)
3. **Merge and deduplicate** results
4. **Validate candidates** using code search for infrastructure files
5. **Check for target issue** to confirm relevance

### Discovery Validation Process

#### Step 1: Confirm Template Structure
```bash
# Check for AZD template indicators
mcp_github_search_code --query "azure.yaml repo:ORG/REPO"
mcp_github_search_code --query "infra/main.bicep repo:ORG/REPO"
```

#### Step 2: Validate Target Issue Exists
```bash
# Search for the specific issue to be fixed
mcp_github_search_code --query "APPLICATIONINSIGHTS_CONNECTION_STRING repo:ORG/REPO"
```

#### Step 3: Update Tracking
- Add confirmed templates to `propagation.targets.json`
- Mark discovery method and validation status
- Note any special considerations

### Discovery Results Audit
- **Generate audit report** comparing static vs dynamic discovery
- **Document gaps** and newly found templates  
- **Validate findings** by checking sample templates
- **Update methodology** based on results

4. **Verify source changes** and create propagation template

#### Phase 2: Infrastructure Changes
1. **Clone all target repositories locally** using the hardened script
2. **Apply changes systematically** with regex patterns for consistency
3. **Use force-with-lease** for safe pushes to avoid conflicts
4. **Exclude propagation metadata** from all commits

#### Phase 3: Best Practice Validation
1. **Query AZD Template Gallery** using the MCP server (https://github.com/spboyer/mcp-azd-template)
2. **Analyze current templates** against official AZD standards and best practices
3. **Identify improvement opportunities** beyond the original change scope
4. **Prepare additional changes** to include in PRs (e.g., missing configurations, outdated patterns)
5. **Document rationale** for each additional improvement

#### Phase 4: Enhanced PR Creation and Tracking
1. **Use GitHub MCP tools** (`mcp_github_create_pull_request`) for all PR creation
2. **Include both original changes AND best practice improvements** in PR content
3. **Standardize PR titles and descriptions** with clear sections for original fix + improvements
4. **Update tracking file** with PR URLs and status
5. **Verify all PRs created successfully** before completing

### Script Hardening Practices

#### Git Safety Measures
```bash
# Use force-with-lease for safe pushes
git push --force-with-lease origin $BRANCH_NAME

# Exclude propagation metadata explicitly
git add infra/main.bicep  # Only add intended files
# Never: git add -A or git add .

# Verify commits before pushing
git log --oneline -1
```

#### Error Handling
```bash
# Check for successful operations
if [ $? -ne 0 ]; then
    echo "ERROR: Operation failed"
    exit 1
fi

# Validate expected changes
if ! grep -q "expected_pattern" target_file; then
    echo "ERROR: Expected change not found"
    exit 1
fi
```

### GitHub MCP Integration

#### PR Creation Best Practices
```javascript
// Use standardized PR format
const prTitle = "Remove deprecated APPLICATIONINSIGHTS_CONNECTION_STRING output";
const prBody = `## Description
Removes the deprecated \`APPLICATIONINSIGHTS_CONNECTION_STRING\` output from the Bicep infrastructure template.

## Changes
- Removed deprecated output from \`infra/main.bicep\`
- Aligns with modern Azure Functions deployment practices

## Source
Propagated from Azure-Samples/functions-quickstart-dotnet-azd#18`;
```

#### Error Recovery
- **GitHub MCP tools are more reliable** than CLI-based approaches
- **Retry logic not typically needed** due to better error handling
- **Authentication handled automatically** through VS Code integration

### Tracking and Monitoring

#### JSON Structure for Progress Tracking
```json
{
  "generated": "2025-08-07T20:59:00Z",
  "sourcePr": "Azure-Samples/functions-quickstart-dotnet-azd#18",
  "targets": [
    {
      "repo": "Azure-Samples/target-repo",
      "repoUrl": "https://github.com/Azure-Samples/target-repo",
      "status": "pr-open",
      "prNumber": 123,
      "attempts": 0,
      "lastChangeType": "pr",
      "lastChangeUrl": "https://github.com/Azure-Samples/target-repo/pull/123",
      "notes": "description of changes made"
    }
  ]
}
```

#### Status Values
- `planned`: Repository identified for changes
- `infra-updated`: Changes applied and pushed
- `pr-open`: Pull request created and open
- `pr-merged`: Pull request merged (workflow complete)

### Common Pitfalls and Solutions

#### 1. Non-Fast-Forward Pushes
**Problem**: Local branch behind remote  
**Solution**: Use `--force-with-lease` after ensuring local changes are correct

#### 2. Propagation Metadata in Commits
**Problem**: Accidentally committing tracking files  
**Solution**: Explicit file staging, never use `git add -A`

#### 3. Inconsistent PR Formatting
**Problem**: Manual PR creation leads to variations  
**Solution**: Use standardized templates with GitHub MCP tools

#### 4. Authentication Issues
**Problem**: GitHub CLI token problems  
**Solution**: Use GitHub MCP server for all GitHub operations

### Remaining Scripts and Their Purposes

After the successful August 2025 propagation, the workflow now uses these scripts:

#### ✅ **`.github/prompts/.propagation/fix_infra_and_audit.sh`** - Core Infrastructure Changes
- **Purpose**: Apply infrastructure changes across multiple repositories using local git operations
- **When to use**: For making systematic changes to Bicep files or other infrastructure
- **Key features**: Safe git operations with force-with-lease, proper metadata exclusion
- **Status**: Keep - this is the primary workhorse for file changes

#### ✅ **`.github/prompts/.propagation/cleanup_propagation_artifacts.sh`** - Safety Net
- **Purpose**: Remove accidentally committed propagation metadata from target repositories  
- **When to use**: If propagation files somehow get committed to target repos
- **Key features**: Targeted removal of `.propagation/` directories and metadata files
- **Status**: Keep - valuable safety mechanism

#### ❌ **Deleted Scripts** (replaced by GitHub MCP tools)
- `update_tracking_and_prs.sh` - PR creation via GitHub CLI (unreliable)
- `update_tracking.sh` - Alternative PR creation script (authentication issues)

**Replacement**: Use GitHub MCP tools (`mcp_github_create_pull_request`) for all PR operations

### Current Recommended Workflow

1. **Infrastructure Changes**: Use `.github/prompts/.propagation/fix_infra_and_audit.sh` for local git operations
2. **PR Creation**: Use GitHub MCP tools in VS Code for reliable PR creation  
3. **Cleanup (if needed)**: Use `.github/prompts/.propagation/cleanup_propagation_artifacts.sh` for metadata removal
4. **Tracking**: Manual updates to `.github/prompts/.propagation/propagation.targets.json` using VS Code tools

#### Potential Enhancements
1. **Automated validation**: Check for successful changes before PR creation
2. **Batch operations**: Parallel processing for larger repository sets
3. **Rollback procedures**: Documented steps for undoing propagations
4. **Template validation**: Ensure Bicep templates are valid post-change

#### Monitoring and Alerts
1. **PR status tracking**: Automated checks for merge status
2. **CI/CD integration**: Verify deployments work with changes
3. **Notification system**: Alert when all PRs are merged

## Conclusion

The August 2025 propagation successfully demonstrated that:
- **GitHub MCP tools are superior** for GitHub operations
- **Local git workflows are more reliable** than API-based approaches
- **Proper metadata exclusion is critical** for clean propagations
- **Systematic tracking enables better monitoring** and follow-up

This workflow can be repeated for future batch propagations across Azure Functions AZD templates with confidence in its reliability and effectiveness.
