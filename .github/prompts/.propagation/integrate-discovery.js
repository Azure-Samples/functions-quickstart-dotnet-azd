#!/usr/bin/env node

/**
 * Discovery Integration Script
 * 
 * This script should be called during the propagation workflow to:
 * 1. Accept a list of discovered repositories from dynamic discovery
 * 2. Update the propagation.targets.json file with new discoveries
 * 3. Preserve existing tracking data
 * 4. Prepare repositories for PR creation
 */

const fs = require('fs');
const path = require('path');

// Get discovered repositories from command line arguments
const discoveredRepos = process.argv.slice(2);

if (discoveredRepos.length === 0) {
    console.log(`❌ Usage: node integrate-discovery.js repo1 repo2 repo3...`);
    console.log(`📖 Example: node integrate-discovery.js Azure-Samples/functions-quickstart-dotnet-azd-timer Azure-Samples/functions-quickstart-python-azd`);
    process.exit(1);
}

// Read the current JSON data
const jsonPath = path.join(__dirname, 'propagation.targets.json');
let data;

try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (error) {
    console.log(`⚠️  Could not read existing JSON file, creating new one...`);
    data = {
        generated: new Date().toISOString(),
        sourcePr: 'TBD',
        targets: []
    };
}

// Create map of existing repositories
const existingRepos = new Map();
data.targets.forEach(repo => {
    existingRepos.set(repo.repo, repo);
});

let newReposAdded = 0;
let existingReposPreserved = 0;

// Process discovered repositories
discoveredRepos.forEach(repoName => {
    if (!repoName.startsWith('Azure-Samples/')) {
        repoName = `Azure-Samples/${repoName}`;
    }
    
    const repoUrl = `https://github.com/${repoName}`;
    
    if (existingRepos.has(repoName)) {
        // Repository already exists - preserve its data
        existingReposPreserved++;
        console.log(`✅ Preserved existing: ${repoName}`);
    } else {
        // New repository - add with 'ready-for-pr' status
        const newRepo = {
            repo: repoName,
            repoUrl: repoUrl,
            status: 'ready-for-pr',
            attempts: 0,
            lastChangeType: 'discovery',
            lastChangeUrl: null,
            notes: 'Discovered via dynamic discovery - ready for PR creation'
        };
        
        data.targets.push(newRepo);
        existingRepos.set(repoName, newRepo);
        newReposAdded++;
        console.log(`🆕 Added new discovery: ${repoName}`);
    }
});

// Update metadata
data.generated = new Date().toISOString();
data.totalRepositories = data.targets.length;
data.lastDiscovery = new Date().toISOString();
data.discoveryMethod = 'Dynamic discovery integration';

// Write updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n✅ Discovery integration completed successfully!`);
console.log(`📊 Summary:`);
console.log(`   - New repositories added: ${newReposAdded}`);
console.log(`   - Existing repositories preserved: ${existingReposPreserved}`);
console.log(`   - Total repositories: ${data.targets.length}`);
console.log(`\n🎯 Next steps:`);
console.log(`   1. Run infrastructure changes script`);
console.log(`   2. Create PRs for repositories with status 'ready-for-pr'`);
console.log(`   3. Update tracking with PR information`);
console.log(`   4. Generate status report`);

// Show repositories ready for PR creation
const readyForPr = data.targets.filter(repo => repo.status === 'ready-for-pr');
if (readyForPr.length > 0) {
    console.log(`\n📋 Repositories ready for PR creation (${readyForPr.length}):`);
    readyForPr.forEach(repo => {
        console.log(`   - ${repo.repo}`);
    });
}
