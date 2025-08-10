# Azure Functions AZD Templates - Batch Propagation Prompt

**Use this prompt to trigger a complete batch propagation across Azure Functions AZD templates.**

---

## 🚀 Ready-to-Use Prompt

Copy and paste this prompt, then fill in your source PR and change description:

```
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
```

---

## 📝 Example Usage

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

---

## 🎯 What This Triggers

The assistant will automatically:

1. **Dynamic Discovery** using GitHub search API to find ALL Azure Functions AZD templates
2. **JSON Integration** with `integrate-discovery.js` to ensure all findings are captured
3. **Infrastructure Changes** via the automated script across all repositories  
4. **PR Creation** using GitHub MCP tools for reliable pull request generation
5. **Complete Tracking** with PR URLs, numbers, and status updates
6. **Interactive Reporting** with beautiful HTML dashboard opened in browser
7. **Quality Verification** to ensure no repositories are missed or incomplete

## ✅ Expected Results

You'll receive:
- **Complete discovery** of 15-20 Azure Functions AZD templates
- **Pull requests created** for ALL discovered repositories
- **JSON tracking file** updated with all discoveries and PR information
- **Interactive HTML report** showing progress, links, and statistics
- **Quality confirmation** that no repositories were left behind

## 📊 Success Metrics

- **All discovered repositories** tracked in propagation.targets.json
- **Maximum PR creation** (status 'pr-open' not 'issue-open' or 'discovered')
- **Complete status updates** with valid PR numbers and URLs
- **Accurate reporting** reflecting true propagation scope
- **Quality verification** via the interactive HTML dashboard

---

*This prompt leverages the proven August 2025 workflow that successfully discovered 19 templates and created comprehensive propagation tracking.*
