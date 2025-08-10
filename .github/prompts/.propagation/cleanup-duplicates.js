#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TARGETS_FILE = path.join(__dirname, 'propagation.targets.json');

console.log('🧹 Cleaning up duplicate repositories...');

// Read the current data
const data = JSON.parse(fs.readFileSync(TARGETS_FILE, 'utf8'));

// Function to normalize repository identifier
function normalizeRepo(repo) {
    // Remove any "https://github.com/" prefix and clean up
    return repo.replace(/^https:\/\/github\.com\//, '').replace(/^Azure-Samples\/https:\/\/github\.com\//, '');
}

// Group targets by normalized repo name to find duplicates
const repoGroups = {};
const duplicates = [];
const cleaned = [];

data.targets.forEach((target, index) => {
    const normalizedRepo = normalizeRepo(target.repo);
    
    if (!repoGroups[normalizedRepo]) {
        repoGroups[normalizedRepo] = [];
    }
    repoGroups[normalizedRepo].push({ ...target, originalIndex: index });
});

// Process each group
Object.entries(repoGroups).forEach(([normalizedRepo, targets]) => {
    if (targets.length > 1) {
        console.log(`🔍 Found ${targets.length} duplicates for: ${normalizedRepo}`);
        
        // Keep the best target (prefer those with actual status over "ready-for-pr")
        const statusPriority = {
            'merged': 1,
            'pr-open': 2,
            'issue-open': 3,
            'discovered': 4,
            'ready-for-pr': 5
        };
        
        const bestTarget = targets.reduce((best, current) => {
            const bestPriority = statusPriority[best.status] || 999;
            const currentPriority = statusPriority[current.status] || 999;
            
            if (currentPriority < bestPriority) {
                return current;
            }
            if (currentPriority === bestPriority && current.prNumber && !best.prNumber) {
                return current;
            }
            if (currentPriority === bestPriority && current.issueNumber && !best.issueNumber) {
                return current;
            }
            return best;
        });
        
        // Clean up the repo name and URL
        bestTarget.repo = normalizedRepo;
        bestTarget.repoUrl = `https://github.com/${normalizedRepo}`;
        
        cleaned.push(bestTarget);
        duplicates.push(...targets.filter(t => t !== bestTarget));
        
        console.log(`  ✅ Kept: ${bestTarget.repo} (${bestTarget.status})`);
        targets.filter(t => t !== bestTarget).forEach(dup => {
            console.log(`  🗑️  Removed: ${dup.repo} (${dup.status})`);
        });
    } else {
        // Single target, just clean up the repo name
        const target = targets[0];
        target.repo = normalizedRepo;
        target.repoUrl = `https://github.com/${normalizedRepo}`;
        cleaned.push(target);
    }
});

// Sort by repo name for consistency
cleaned.sort((a, b) => a.repo.localeCompare(b.repo));

// Update the data
data.targets = cleaned;
data.lastCleanup = new Date().toISOString();

// Write back to file
fs.writeFileSync(TARGETS_FILE, JSON.stringify(data, null, 2));

console.log(`\n✅ Cleanup completed!`);
console.log(`📊 Summary:`);
console.log(`   - Original count: ${data.targets.length + duplicates.length}`);
console.log(`   - Duplicates removed: ${duplicates.length}`);
console.log(`   - Final count: ${data.targets.length}`);
console.log(`   - Cleanup timestamp added: ${data.lastCleanup}`);
