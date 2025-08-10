const fs = require('fs');
const { execSync } = require('child_process');

const data = JSON.parse(fs.readFileSync('propagation.targets.json'));

// Get repositories that need PR checking
const readyRepos = data.targets.filter(t => t.status === 'ready-for-pr');

console.log(`Checking ${readyRepos.length} repositories for existing PRs...`);

for (const repo of readyRepos) {
  console.log(`\nChecking ${repo.repo}...`);
  
  try {
    // Check for existing PRs related to App Insights
    const prList = execSync(`gh pr list --repo ${repo.repo} --state all`, { encoding: 'utf8' });
    
    // Look for PRs with App Insights related titles
    const lines = prList.split('\n');
    const appInsightsPR = lines.find(line => 
      line.includes('App Insights') || 
      line.includes('APPLICATIONINSIGHTS') ||
      line.includes('propagation from #18')
    );
    
    if (appInsightsPR) {
      // Extract PR number (first column)
      const prNumber = parseInt(appInsightsPR.split('\t')[0]);
      const prState = appInsightsPR.includes('OPEN') ? 'pr-open' : 'pr-merged';
      
      // Update repository status
      repo.status = prState;
      repo.prNumber = prNumber;
      repo.lastChangeUrl = `https://github.com/${repo.repo}/pull/${prNumber}`;
      repo.lastChangeType = 'pr';
      repo.notes = 'PR already exists';
      
      console.log(`  ✅ Found existing PR #${prNumber} (${prState})`);
    } else {
      console.log(`  ❌ No existing PR found - needs creation`);
    }
    
  } catch (error) {
    console.log(`  ⚠️  Error checking ${repo.repo}: ${error.message}`);
  }
}

// Save updated data
fs.writeFileSync('propagation.targets.json', JSON.stringify(data, null, 2));

const updatedCount = data.targets.filter(t => t.status.startsWith('pr-')).length;
const stillNeeded = data.targets.filter(t => t.status === 'ready-for-pr').length;

console.log(`\n📊 Summary:`);
console.log(`  - Repositories with PRs: ${updatedCount}`);
console.log(`  - Still need PRs: ${stillNeeded}`);
