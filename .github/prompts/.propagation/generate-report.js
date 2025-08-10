#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the JSON data
const jsonPath = path.join(__dirname, 'propagation.targets.json');
const outputPath = path.join(__dirname, 'propagation-status-report.html');

try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Generate the HTML report
    const html = generateReport(data);
    
    // Write the HTML file
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`✅ Report generated successfully: ${outputPath}`);
    console.log(`📊 Processed ${data.targets.length} repositories`);
    
} catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
}

function generateReport(data) {
    const stats = calculateStats(data.targets);
    const groupedRepos = groupRepositoriesByType(data.targets);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Azure Functions AZD Templates - Propagation Status Report</title>
    <style>
        ${getCSS()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Azure Functions AZD Templates</h1>
            <h2>Propagation Status Report</h2>
            <p class="timestamp">Generated: ${new Date().toLocaleString()} | Source: <a href="https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/pull/18" target="_blank">${data.sourcePr}</a></p>
        </header>

        <section class="summary">
            <h3>📊 Summary</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Repositories</div>
                </div>
                <div class="stat-card open">
                    <div class="stat-number">${stats.open}</div>
                    <div class="stat-label">Open PRs</div>
                </div>
                <div class="stat-card merged">
                    <div class="stat-number">${stats.merged}</div>
                    <div class="stat-label">Merged PRs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.completionRate}%</div>
                    <div class="stat-label">Complete</div>
                </div>
            </div>
        </section>

        <section class="progress">
            <h3>📈 Overall Progress</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${stats.completionRate}%"></div>
            </div>
            <p>${stats.merged} of ${stats.total} repositories updated</p>
        </section>

        ${generateGroupSections(groupedRepos)}

        <section class="actions">
            <h3>🔍 Quick Actions</h3>
            <div class="action-grid">
                <div class="action-card">
                    <h4>For Maintainers</h4>
                    <ul>
                        <li><a href="https://github.com/pulls?q=is%3Apr+is%3Aopen+involves%3AAzure-Samples" target="_blank">Review All Open PRs</a></li>
                        <li>Verify deployments work with <code>azd up</code></li>
                    </ul>
                </div>
                <div class="action-card">
                    <h4>For Contributors</h4>
                    <ul>
                        <li>Test changes in your environment</li>
                        <li><a href="https://github.com/Azure-Samples/functions-quickstart-dotnet-azd" target="_blank">View source repository</a></li>
                    </ul>
                </div>
            </div>
        </section>

        <footer>
            <p>🔗 <strong>Source Change:</strong> Remove ApplicationInsights outputs from main.bicep</p>
            <p><em>This report is dynamically generated from propagation.targets.json</em></p>
        </footer>
    </div>
</body>
</html>`;
}

function calculateStats(repositories) {
    const total = repositories.length;
    const merged = repositories.filter(repo => repo.status === 'merged').length;
    const prOpen = repositories.filter(repo => repo.status === 'pr-open').length;
    const issueOpen = repositories.filter(repo => repo.status === 'issue-open').length;
    const readyForPr = repositories.filter(repo => repo.status === 'ready-for-pr').length;
    const discovered = repositories.filter(repo => repo.status === 'discovered').length;
    const completionRate = Math.round((merged / total) * 100);
    
    return { 
        total, 
        merged, 
        open: prOpen + issueOpen, // Combined for display
        prOpen,
        issueOpen,
        readyForPr,
        discovered,
        completionRate 
    };
}

function groupRepositoriesByType(repositories) {
    const groups = {
        '.NET Templates': [],
        'JavaScript/TypeScript Templates': [],
        'Python Templates': [],
        'PowerShell Templates': [],
        'Java Templates': [],
        'Sample Applications': []
    };
    
    repositories.forEach(repo => {
        const repoName = repo.repo.toLowerCase();
        
        if (repoName.includes('dotnet')) {
            groups['.NET Templates'].push(repo);
        } else if (repoName.includes('javascript') || repoName.includes('typescript')) {
            groups['JavaScript/TypeScript Templates'].push(repo);
        } else if (repoName.includes('python')) {
            groups['Python Templates'].push(repo);
        } else if (repoName.includes('powershell')) {
            groups['PowerShell Templates'].push(repo);
        } else if (repoName.includes('java')) {
            groups['Java Templates'].push(repo);
        } else {
            groups['Sample Applications'].push(repo);
        }
    });
    
    return groups;
}

function generateGroupSections(groupedRepos) {
    return Object.entries(groupedRepos)
        .filter(([_, repos]) => repos.length > 0)
        .map(([groupName, repos]) => `
        <section class="repo-group">
            <h3>${getGroupIcon(groupName)} ${groupName}</h3>
            <div class="repo-table">
                <table>
                    <thead>
                        <tr>
                            <th>Repository</th>
                            <th>Status</th>
                            <th>PR</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${repos.map(repo => generateRepoRow(repo)).join('')}
                    </tbody>
                </table>
            </div>
        </section>`).join('');
}

function generateRepoRow(repo) {
    const statusBadge = getStatusBadge(repo.status);
    const repoDisplayName = repo.repo.replace('Azure-Samples/', '');
    
    // Handle different link types (PR, issue, or none)
    let linkCell = 'N/A';
    if (repo.prNumber) {
        linkCell = `<a href="${repo.lastChangeUrl}" target="_blank" class="pr-link">#${repo.prNumber}</a>`;
    } else if (repo.issueNumber) {
        linkCell = `<a href="${repo.lastChangeUrl}" target="_blank" class="issue-link">#${repo.issueNumber}</a>`;
    }
    
    return `
        <tr class="repo-row ${repo.status}">
            <td>
                <a href="${repo.repoUrl}" target="_blank" class="repo-link">
                    🔗 ${repoDisplayName}
                </a>
            </td>
            <td>${statusBadge}</td>
            <td>${linkCell}</td>
            <td class="notes">${repo.notes || 'No notes'}</td>
        </tr>`;
}

function getStatusBadge(status) {
    const badges = {
        'merged': '<span class="badge merged">✅ MERGED</span>',
        'pr-open': '<span class="badge open">🟡 PR OPEN</span>',
        'issue-open': '<span class="badge issue">🔵 ISSUE OPEN</span>',
        'ready-for-pr': '<span class="badge ready">🚀 READY FOR PR</span>',
        'discovered': '<span class="badge discovered">🔍 DISCOVERED</span>',
        'failed': '<span class="badge failed">🔴 FAILED</span>',
        'pending': '<span class="badge pending">⏳ PENDING</span>'
    };
    
    return badges[status] || `<span class="badge unknown">❓ ${status.toUpperCase()}</span>`;
}

function getGroupIcon(groupName) {
    const icons = {
        '.NET Templates': '🔷',
        'JavaScript/TypeScript Templates': '🟨',
        'Python Templates': '🐍',
        'PowerShell Templates': '💙',
        'Java Templates': '☕',
        'Sample Applications': '📦'
    };
    
    return icons[groupName] || '📁';
}

function getCSS() {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            margin-top: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        
        header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        
        header h2 {
            color: #7f8c8d;
            font-weight: 300;
            margin-bottom: 10px;
        }
        
        .timestamp {
            color: #95a5a6;
            font-size: 0.9em;
        }
        
        .timestamp a {
            color: #3498db;
            text-decoration: none;
        }
        
        .timestamp a:hover {
            text-decoration: underline;
        }
        
        section {
            margin-bottom: 30px;
        }
        
        h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #3498db;
        }
        
        .stat-card.open {
            border-left-color: #f39c12;
        }
        
        .stat-card.merged {
            border-left-color: #27ae60;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .stat-label {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 5px;
        }
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #27ae60, #2ecc71);
            transition: width 0.3s ease;
        }
        
        .repo-table {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        thead {
            background: #34495e;
            color: white;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
        }
        
        tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        tbody tr:hover {
            background: #e3f2fd;
        }
        
        .repo-link {
            color: #2980b9;
            text-decoration: none;
            font-weight: 500;
        }
        
        .repo-link:hover {
            text-decoration: underline;
        }
        
        .pr-link {
            color: #8e44ad;
            text-decoration: none;
            font-weight: bold;
        }
        
        .pr-link:hover {
            text-decoration: underline;
        }
        
        .issue-link {
            color: #2980b9;
            text-decoration: none;
            font-weight: bold;
        }
        
        .issue-link:hover {
            text-decoration: underline;
        }
        
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .badge.merged {
            background: #d4edda;
            color: #155724;
        }
        
        .badge.open {
            background: #fff3cd;
            color: #856404;
        }
        
        .badge.issue {
            background: #cce5ff;
            color: #004085;
        }
        
        .badge.discovered {
            background: #e2e3e5;
            color: #383d41;
        }
        
        .badge.ready {
            background: #d1f2eb;
            color: #00503c;
        }
        
        .badge.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .badge.pending {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .notes {
            font-size: 0.9em;
            color: #6c757d;
        }
        
        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .action-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #17a2b8;
        }
        
        .action-card h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .action-card ul {
            list-style: none;
            padding-left: 0;
        }
        
        .action-card li {
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .action-card li::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #17a2b8;
            font-weight: bold;
        }
        
        .action-card a {
            color: #17a2b8;
            text-decoration: none;
        }
        
        .action-card a:hover {
            text-decoration: underline;
        }
        
        code {
            background: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
        }
        
        footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        footer p {
            margin-bottom: 5px;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                padding: 15px;
            }
            
            header h1 {
                font-size: 2em;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .action-grid {
                grid-template-columns: 1fr;
            }
            
            table {
                font-size: 0.9em;
            }
            
            th, td {
                padding: 8px 10px;
            }
        }
    `;
}
