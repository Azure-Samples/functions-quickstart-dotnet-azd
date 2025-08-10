#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the current JSON data
const jsonPath = path.join(__dirname, 'propagation.targets.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// The complete list of 19 discovered repositories from the execution log
const discoveredRepositories = [
    // Priority 1: .NET/C# Templates (6 total including source)
    'Azure-Samples/functions-quickstart-dotnet-azd', // source - already fixed
    'Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob',
    'Azure-Samples/functions-quickstart-dotnet-azd-cosmosdb',
    'Azure-Samples/functions-quickstart-dotnet-azd-sql',
    'Azure-Samples/functions-quickstart-dotnet-azd-timer',
    'Azure-Samples/durable-functions-quickstart-dotnet-azd',
    
    // Priority 2: Other Languages (13)
    // Python Templates (4)
    'Azure-Samples/functions-quickstart-python-http-azd',
    'Azure-Samples/functions-quickstart-python-azd-sql',
    'Azure-Samples/functions-quickstart-python-azd-cosmosdb',
    'Azure-Samples/functions-quickstart-python-azd-eventgrid-blob',
    
    // TypeScript Templates (4)
    'Azure-Samples/functions-quickstart-typescript-azd',
    'Azure-Samples/functions-quickstart-typescript-azd-sql',
    'Azure-Samples/functions-quickstart-typescript-azd-cosmosdb',
    'Azure-Samples/functions-quickstart-typescript-azd-eventgrid-blob',
    
    // JavaScript Templates (2)
    'Azure-Samples/functions-quickstart-javascript-azd',
    'Azure-Samples/functions-quickstart-javascript-azd-eventgrid-blob',
    
    // PowerShell Templates (2)
    'Azure-Samples/functions-quickstart-powershell-azd',
    'Azure-Samples/functions-quickstart-powershell-azd-eventgrid-blob',
    
    // Java Templates (1)
    'Azure-Samples/functions-quickstart-java-azd-eventgrid-blob'
];

// Issues created per the execution log
const issueTracker = {
    'Azure-Samples/functions-quickstart-dotnet-azd-timer': { issue: 7, status: 'issue-open' },
    'Azure-Samples/functions-quickstart-dotnet-azd-cosmosdb': { issue: 4, status: 'issue-open' },
    'Azure-Samples/functions-quickstart-dotnet-azd-sql': { issue: 11, status: 'issue-open' },
    'Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob': { issue: 9, status: 'issue-open' },
    'Azure-Samples/durable-functions-quickstart-dotnet-azd': { issue: 5, status: 'issue-open' },
    'Azure-Samples/functions-quickstart-python-http-azd': { issue: 18, status: 'issue-open' },
    'Azure-Samples/functions-quickstart-typescript-azd': { issue: 13, status: 'issue-open' }
};

// Create the current existing repos map for reference
const existingRepos = new Map();
data.targets.forEach(repo => {
    existingRepos.set(repo.repo, repo);
});

// Build the new complete targets list
const newTargets = [];

discoveredRepositories.forEach(repoName => {
    const repoUrl = `https://github.com/${repoName}`;
    
    if (repoName === 'Azure-Samples/functions-quickstart-dotnet-azd') {
        // Source repository - already merged
        newTargets.push({
            repo: repoName,
            repoUrl: repoUrl,
            status: 'merged',
            prNumber: 18,
            attempts: 0,
            lastChangeType: 'pr',
            lastChangeUrl: `${repoUrl}/pull/18`,
            notes: 'Source repository - changes merged'
        });
    } else if (issueTracker[repoName]) {
        // Repository with created issue
        const issueInfo = issueTracker[repoName];
        newTargets.push({
            repo: repoName,
            repoUrl: repoUrl,
            status: issueInfo.status,
            issueNumber: issueInfo.issue,
            attempts: 0,
            lastChangeType: 'issue',
            lastChangeUrl: `${repoUrl}/issues/${issueInfo.issue}`,
            notes: 'GitHub issue created for propagation tracking'
        });
    } else if (existingRepos.has(repoName)) {
        // Existing repository from the old JSON - preserve its data
        newTargets.push(existingRepos.get(repoName));
    } else {
        // Newly discovered repository without action yet
        newTargets.push({
            repo: repoName,
            repoUrl: repoUrl,
            status: 'discovered',
            attempts: 0,
            lastChangeType: 'discovery',
            lastChangeUrl: null,
            notes: 'Newly discovered repository - no action taken yet'
        });
    }
});

// Update the JSON data
data.targets = newTargets;
data.generated = new Date().toISOString();
data.totalRepositories = newTargets.length;
data.discoveryMethod = 'GitHub search: functions-quickstart azd org:Azure-Samples';
data.lastUpdate = 'Updated with complete 19-repository discovery results';

// Write the updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Updated propagation.targets.json with complete discovery results`);
console.log(`📊 Total repositories: ${newTargets.length}`);
console.log(`🔍 Issues created: ${Object.keys(issueTracker).length}`);
console.log(`📝 Status breakdown:`);

const statusCounts = {};
newTargets.forEach(repo => {
    statusCounts[repo.status] = (statusCounts[repo.status] || 0) + 1;
});

Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
});
