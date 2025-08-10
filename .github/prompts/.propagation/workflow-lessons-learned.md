# Propagation Workflow - Lessons Learned
*Generated: August 10, 2025*

## 🎯 Key Issues Identified

### 1. **Context Loss After Conversation Summarization**
**Problem**: When VS Code Copilot agent summarizes conversation history, critical context from original prompts and instructions gets lost, leading to repeated mistakes.

**Evidence**: 
- Repeatedly defaulted to CLI tools instead of GitHub MCP tools
- Lost track of fork-first workflow requirements
- Forgot Azure-specific instruction patterns

**Impact**: Workflow inefficiency, repeated corrections needed

### 2. **GitHub MCP Tools Not Default**
**Problem**: Despite explicit instructions to use GitHub MCP tools, the agent frequently defaults to CLI-based approaches.

**Evidence**:
- Initial attempts used `gh` CLI commands
- Had to be corrected multiple times to use `mcp_github_*` functions
- Only after explicit correction did the workflow succeed

**Impact**: Authentication failures, workflow interruptions

### 3. **Tracking Data Inconsistencies**
**Problem**: Mixed data formats in tracking JSON caused report generation failures.

**Evidence**:
- Some entries used `name`/`url`, others used `repo`/`repoUrl`
- Generated "Cannot read properties of undefined" errors
- Required manual format standardization

**Impact**: Broken reporting, workflow completion delays

## 🔧 Proposed Solutions

### 1. **Enhanced Context Preservation**
```markdown
**CRITICAL WORKFLOW CONTEXT - PRESERVE ACROSS SUMMARIES**

@azure Rule - ALWAYS use GitHub MCP tools for GitHub operations
@azure Rule - NEVER use CLI tools unless explicitly requested
@azure Rule - Fork-first workflow: fork to user profile → branch → PR back
@azure Rule - Update tracking status immediately after PR creation
@azure Rule - Use consistent JSON schema in all tracking files

**GitHub MCP Tools Priority List:**
- mcp_github_create_pull_request_with_copilot (preferred)
- mcp_github_fork_repository
- mcp_github_list_pull_requests
- mcp_github_get_pull_request_*
```

### 2. **Workflow Automation Improvements**
- Create validation script to check tracking data format consistency
- Add automatic status update hooks after PR operations
- Implement pre-flight checks for GitHub MCP tool availability

### 3. **Documentation Standards**
- Standardize all tracking JSON to single schema
- Include schema validation in report generation
- Add error handling for mixed format detection

## 📝 Specific Instruction Enhancements

### For Conversation Context Preservation:
```markdown
WORKFLOW MEMORY ANCHORS:
- Primary Goal: Propagate changes across Azure Functions AZD templates
- Tool Requirement: GitHub MCP tools ONLY (never CLI)
- Authentication: Fork-first workflow for permission issues
- Tracking: Immediate status updates after operations
- Reporting: Generate HTML reports for validation
```

### For GitHub Operations:
```markdown
GITHUB OPERATION PROTOCOL:
1. Check mcp_github_* tool availability FIRST
2. If auth fails, use fork-first workflow (mcp_github_fork_repository)
3. Create PR with mcp_github_create_pull_request_with_copilot
4. Update tracking JSON immediately
5. Validate with report generation
```

## 🎯 Recommendations for Implementation

### 1. **Prompt Engineering**
- Add "PERSISTENT CONTEXT" section to all Azure workflows
- Include tool preference hierarchy in system prompts
- Create workflow validation checkpoints

### 2. **Tool Configuration**
- Set GitHub MCP tools as default for all GitHub operations
- Add fallback patterns for authentication failures
- Implement consistent error handling

### 3. **Quality Assurance**
- Add automated validation for tracking data format
- Include real-time GitHub state verification
- Implement progress checkpoints with validation

## 🔄 Next Steps

1. **Update propagation workflow templates** with these lessons
2. **Enhance system prompts** with persistent context anchors
3. **Create validation scripts** for tracking data consistency
4. **Document fork-first workflow** as standard authentication fallback
5. **Add automated status updates** to all PR creation operations

## 💡 Innovation Opportunities

1. **Context Persistence Layer**: Develop mechanism to preserve critical workflow context across conversation summaries
2. **Tool Preference Engine**: Automatically select appropriate tools based on operation type and authentication status
3. **Real-time Validation**: Continuous verification of tracking data against actual GitHub state
4. **Workflow State Machine**: Formal state tracking with automatic recovery from interruptions

---
*This document should be referenced for all future propagation workflows to prevent regression of these hard-learned lessons.*
