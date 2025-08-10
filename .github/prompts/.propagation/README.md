# Dynamic Propagation Status Reporter

This directory contains a dynamic reporting system that transforms the JSON tracking data into a beautiful, interactive HTML report.

## 🚀 Quick Start

```bash
# Generate the HTML report
npm run report

# Or run directly with Node.js
node generate-report.js
```

The generated report will be saved as `propagation-status-report.html` and can be opened in any web browser.

## 📁 Files

- **`propagation.targets.json`** - The source of truth for all propagation data
- **`generate-report.js`** - Node.js script that transforms JSON to HTML
- **`propagation-status-report.html`** - Generated HTML report (auto-created)
- **`package.json`** - NPM configuration for easy script running

## 🔄 How It Works

1. **JSON as Source of Truth**: All data lives in `propagation.targets.json`
2. **Dynamic Transformation**: The Node.js script reads the JSON and generates HTML
3. **Always Current**: Every time you run the script, it reflects the latest JSON data
4. **No Manual Updates**: Never need to edit the HTML manually

## 📊 Features

- **Interactive Dashboard** with progress bars and statistics
- **Grouped by Technology** (.NET, Python, JavaScript, etc.)
- **Clickable Links** to repositories and pull requests
- **Responsive Design** works on desktop and mobile
- **Status Indicators** with color-coded badges
- **Auto-Generated Timestamps** showing when report was created

## 🔧 Customization

To modify the report appearance or structure, edit `generate-report.js`:

- **Styling**: Modify the `getCSS()` function
- **Grouping Logic**: Update `groupRepositoriesByType()`
- **Statistics**: Adjust `calculateStats()`
- **Content**: Change the HTML template in `generateReport()`

## 🤖 Automation Ideas

### Auto-regenerate on JSON changes (macOS/Linux):
```bash
# Install fswatch if needed: brew install fswatch
fswatch propagation.targets.json | xargs -I {} npm run report
```

### GitHub Actions Integration:
```yaml
- name: Generate Propagation Report
  run: |
    cd .github/prompts/.propagation
    npm run report
    git add propagation-status-report.html
    git commit -m "Update propagation status report" || exit 0
```

## 🎯 Benefits

✅ **Always Accurate** - JSON is the single source of truth  
✅ **No Drift** - HTML is generated, never manually edited  
✅ **Easy to Share** - Send the HTML file to anyone  
✅ **Version Controlled** - Can commit generated reports for history  
✅ **Customizable** - Modify the script to change appearance  
✅ **Fast** - Generates in milliseconds  

---

*This dynamic reporting system ensures your propagation status is always current and beautifully presented!*
