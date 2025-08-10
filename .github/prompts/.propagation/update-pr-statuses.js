const fs = require('fs');
const { execSync } = require('child_process');

// Create a more comprehensive PR checker using GitHub MCP-style approach
async function updatePRStatuses() {
  const data = JSON.parse(fs.readFileSync('propagation.targets.json'));
  
  // Define repositories that need status updates
  const reposToUpdate = [
    { repo: 'Azure-Samples/functions-quickstart-typescript-azd', prNumber: 14 },
    { repo: 'Azure-Samples/functions-quickstart-javascript-azd', prNumber: 16 },
    { repo: 'Azure-Samples/functions-quickstart-python-http-azd', prNumber: 19 },
    { repo: 'Azure-Samples/functions-quickstart-powershell-azd', prNumber: 10 }
  ];

  for (const { repo, prNumber } of reposToUpdate) {
    try {
      // Get PR details using GitHub CLI
      const prJson = execSync(`gh pr view ${prNumber} --repo ${repo} --json state,isDraft,merged`, { encoding: 'utf8' });
      const prData = JSON.parse(prJson);
      
      // Determine correct status
      let newStatus;
      if (prData.merged) {
        newStatus = 'pr-merged';
      } else if (prData.isDraft) {
        newStatus = 'pr-draft';
      } else if (prData.state === 'OPEN') {
        newStatus = 'pr-open';
      } else {
        newStatus = 'pr-closed';
      }
      
      // Update the repository in tracking
      const repoEntry = data.targets.find(t => t.repo === repo);
      if (repoEntry) {
        const oldStatus = repoEntry.status;
        repoEntry.status = newStatus;
        repoEntry.prNumber = prNumber;
        repoEntry.lastChangeUrl = `https://github.com/${repo}/pull/${prNumber}`;
        repoEntry.lastChangeType = 'pr';
        repoEntry.notes = `Status updated from ${oldStatus} to ${newStatus}`;
        
        console.log(`✅ Updated ${repo}: ${oldStatus} → ${newStatus} (PR #${prNumber})`);
      }
      
    } catch (error) {
      console.log(`❌ Error checking ${repo} PR #${prNumber}: ${error.message}`);
    }
  }
  
  // Save updated data
  fs.writeFileSync('propagation.targets.json', JSON.stringify(data, null, 2));
  
  console.log('\n📊 Status update complete');
}

updatePRStatuses();
