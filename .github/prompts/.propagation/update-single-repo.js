const fs = require('fs');
const data = JSON.parse(fs.readFileSync('propagation.targets.json'));

// Update repository with existing PR
const repo = data.targets.find(t => t.repo === 'Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob');
if (repo) {
  repo.status = 'pr-open';
  repo.prNumber = 8;
  repo.lastChangeUrl = 'https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob/pull/8';
  repo.lastChangeType = 'pr';
  repo.notes = 'PR already exists';
}

fs.writeFileSync('propagation.targets.json', JSON.stringify(data, null, 2));
console.log('Updated Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob with existing PR #8');
