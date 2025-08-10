# Azure Functions AZD Templates - Batch Propagation Prompt

**Use this prompt to trigger a complete batch propagation across Azure Functions AZD templates.**

## 🚨 CRITICAL CONTEXT ANCHORS - PRESERVE ACROSS CONVERSATION SUMMARIES

### MANDATORY Tool Requirements (NEVER FORGET):
- ✅ **ALWAYS USE**: `mcp_github_*` functions for ALL GitHub operations
- ❌ **NEVER USE**: `gh` CLI, `git` commands, or terminal GitHub operations
- 🔄 **AUTH FALLBACK**: Fork-first workflow when authorization fails

### GitHub MCP Tools Priority List:
```
Primary: mcp_github_create_pull_request_with_copilot
Validation: mcp_github_list_pull_requests, mcp_github_get_pull_request_*
Fallback: mcp_github_fork_repository (for auth failures)
Search: mcp_github_search_repositories
```

### Workflow Pattern (CRITICAL SEQUENCE):
1. **Validate** repository state with GitHub MCP tools
2. **Fork** to user profile if auth fails (`mcp_github_fork_repository`)
3. **Create PR** with Copilot (`mcp_github_create_pull_request_with_copilot`)
4. **Update** tracking JSON immediately after PR creation
5. **Generate** HTML report for validation

### Data Format Standard (ENFORCE CONSISTENCY):
```json
{
  "repo": "Azure-Samples/repo-name",
  "repoUrl": "https://github.com/Azure-Samples/repo-name",
  "status": "pr-open|merged|issue-open",
  "prNumber": 123,
  "attempts": 1,
  "lastChangeType": "pr",
  "lastChangeUrl": "https://github.com/...",
  "notes": "Description"
}
```

---

## 🚀 Ready-to-Use Prompt

Copy and paste this prompt, then fill in your source PR and change description:

```
Execute a complete batch propagation across Azure Functions AZD templates following the workflow in PROPAGATION_INSTRUCTIONS.md:

1. **Dynamically discover** target repositories using GitHub search (`functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`)
2. **Integrate ALL discoveries** into propagation.targets.json using the integration script: `npm run integrate-discovery -- [discovered repos]`
3. **Check for existing PRs** to prevent duplicates: `node check-existing-prs.js`
4. **Apply infrastructure changes** using the local git workflow script (only for repos without PRs)
5. **Create pull requests** using GitHub MCP tools exclusively (NOT CLI scripts)
   - **Use GitHub MCP tools**: mcp_github_create_pull_request_with_copilot, mcp_github_get_pull_request, mcp_github_update_pull_request
   - **NO DRAFT PRS**: Ensure all PRs are ready for review (draft=false)
   - **Check and convert**: If any PRs are created as drafts, immediately convert them using mcp_github_update_pull_request
   - **Primary**: Direct PR creation using GitHub MCP tools
   - **Fallback**: Fork repository to personal profile, create branch with changes, then PR from fork
6. **Update tracking** with PR information (target status: 'pr-open' for ready PRs)
7. **Generate report using correct path**: `node .github/prompts/.propagation/generate-report.js`
8. **View report**: Use open_simple_browser tool with file:// URL for immediate viewing
9. **Verify quality**: Ensure all PRs are ready for review (draft=false) and no repositories remain with 'discovered' status

Source PR: [PASTE_YOUR_SOURCE_PR_URL_HERE]
Change description: [DESCRIBE_THE_CHANGE_TO_PROPAGATE]

Success criteria: All discovered repositories should have status 'pr-open' with valid PR numbers and be included in the interactive HTML report.
```

---

## 📝 Example Usage

```
Execute a complete batch propagation across Azure Functions AZD templates following the workflow in PROPAGATION_INSTRUCTIONS.md:

1. **Dynamically discover** target repositories using GitHub search (`functions-quickstart azd org:Azure-Samples` and `durable-functions azd org:Azure-Samples`)
2. **Integrate ALL discoveries** into propagation.targets.json using the integration script: `npm run integrate-discovery -- [discovered repos]`
3. **Check for existing PRs** to prevent duplicates: `node check-existing-prs.js`
4. **Apply infrastructure changes** using the local git workflow script (only for repos without PRs)
5. **Create pull requests** using GitHub MCP tools exclusively (NOT CLI scripts)
   - **Use GitHub MCP tools**: mcp_github_create_pull_request_with_copilot, mcp_github_get_pull_request, mcp_github_update_pull_request
   - **NO DRAFT PRS**: Ensure all PRs are ready for review (draft=false)
   - **Check and convert**: If any PRs are created as drafts, immediately convert them using mcp_github_update_pull_request
   - **Primary**: Direct PR creation using GitHub MCP tools
   - **Fallback**: Fork repository to personal profile, create branch with changes, then PR from fork
6. **Update tracking** with PR information (target status: 'pr-open' for ready PRs)
7. **Generate report using correct path**: `node .github/prompts/.propagation/generate-report.js`
8. **View report**: Use open_simple_browser tool with file:// URL for immediate viewing
9. **Verify quality**: Ensure all PRs are ready for review (draft=false) and no repositories remain with 'discovered' status

Source PR: https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/pull/25
Change description: Remove deprecated AZURE_CLIENT_ID environment variable from all templates

Success criteria: All discovered repositories should have status 'pr-open' with valid PR numbers and be included in the interactive HTML report.
```

---

## 🎯 What This Triggers

The assistant will automatically:

1. **Dynamic Discovery** using GitHub search API to find ALL Azure Functions AZD templates
2. **JSON Integration** with `integrate-discovery.js` to ensure all findings are captured
3. **Infrastructure Changes** via the automated script across all repositories  
4. **PR Creation** using GitHub MCP tools exclusively for reliable pull request generation
5. **Draft PR Conversion** to ensure all PRs are ready for review (draft=false)
6. **Complete Tracking** with PR URLs, numbers, and status updates
7. **Correct Report Generation** using proper file paths: `node .github/prompts/.propagation/generate-report.js`
8. **Quality Verification** to ensure no repositories are missed or have draft PRs

## ✅ Expected Results

You'll receive:
- **Complete discovery** of 15-20 Azure Functions AZD templates
- **Pull requests created** for ALL discovered repositories
- **JSON tracking file** updated with all discoveries and PR information
- **Interactive HTML report** showing progress, links, and statistics
- **Quality confirmation** that no repositories were left behind

## 📊 Success Metrics

- **All discovered repositories** tracked in propagation.targets.json
- **GitHub MCP tools used exclusively** for all GitHub operations (not CLI scripts)
- **No draft PRs allowed** - all PRs must be ready for review (draft=false)
- **Complete status updates** with 'pr-open' for ready PRs (not 'pr-created')
- **Correct report generation** using `node .github/prompts/.propagation/generate-report.js`
- **Quality verification** via interactive HTML dashboard viewed in VS Code Simple Browser

---

*This prompt leverages the proven August 2025 workflow that successfully discovered 19 templates and created comprehensive propagation tracking.*
