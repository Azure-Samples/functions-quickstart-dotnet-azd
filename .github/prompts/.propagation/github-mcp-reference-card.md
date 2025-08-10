# GitHub MCP Workflow Reference Card
*Quick reference for maintaining context across conversation summaries*

## 🚨 CRITICAL CONTEXT ANCHORS

### Tool Requirements (NEVER FORGET):
- ✅ **USE**: `mcp_github_*` functions for ALL GitHub operations
- ❌ **NEVER**: `gh` CLI, `git` commands, or terminal GitHub operations
- 🔄 **FALLBACK**: Fork-first workflow when authentication fails

### GitHub MCP Tools Checklist:
```
□ mcp_github_create_pull_request_with_copilot (primary PR creation)
□ mcp_github_fork_repository (for auth failures)
□ mcp_github_list_pull_requests (status validation)
□ mcp_github_get_pull_request_* (detailed inspection)
□ mcp_github_search_* (repository discovery)
```

### Workflow Pattern:
1. **Validate** repository state with GitHub MCP tools
2. **Fork** to user profile if auth fails (`mcp_github_fork_repository`)
3. **Create PR** with Copilot (`mcp_github_create_pull_request_with_copilot`)
4. **Update** tracking JSON immediately
5. **Generate** HTML report for validation

### Data Format Standard:
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

### Quality Gates:
- ✅ All PRs tracked with GitHub MCP validation
- ✅ Consistent JSON schema across all entries
- ✅ Immediate status updates after operations
- ✅ HTML report generation for final validation

---
**PASTE THIS REFERENCE INTO CONVERSATION WHEN CONTEXT IS LOST**
