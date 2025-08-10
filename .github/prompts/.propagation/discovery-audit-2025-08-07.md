# Azure Functions AZD Templates Discovery Audit

**Date:** August 7, 2025  
**Purpose:** Compare dynamic discovery results against tracked propagation targets

## Discovery Summary

**Found Templates:** 19 Azure Functions AZD templates in Azure-Samples organization  
**Previously Tracked:** 12 repositories in propagation.targets.json  
**Missing from Tracking:** 7 templates  

## Results Comparison

### ✅ Tracked Templates (12) - All Have PRs

The following repositories were successfully tracked and have open PRs:

1. `functions-quickstart-dotnet-azd` - (current workspace)
2. `functions-quickstart-python-http-azd` - PR #10
3. `functions-quickstart-typescript-azd` - PR #17
4. `functions-quickstart-powershell-azd` - PR #16
5. `functions-quickstart-javascript-azd` - PR #2
6. `functions-quickstart-dotnet-azd-eventgrid-blob` - PR #8
7. `functions-quickstart-dotnet-azd-cosmosdb` - (not in discovered list - may be private/archived)
8. `functions-quickstart-dotnet-azd-sql` - PR #10
9. `functions-quickstart-python-azd-sql` - PR #4
10. `functions-quickstart-typescript-azd-sql` - PR #2
11. `functions-quickstart-python-azd-cosmosdb` - PR #14
12. `functions-quickstart-typescript-azd-cosmosdb` - PR #1

### ⚠️ Newly Discovered Templates (7) - Need Investigation

The following templates were found but NOT included in the original propagation:

1. `durable-functions-quickstart-dotnet-azd` ⭐ **NEW** - May need same fix
2. `functions-quickstart-dotnet-azd-timer` ⭐ **NEW** - ✅ **CONFIRMED** needs fix (has APPLICATIONINSIGHTS_CONNECTION_STRING)
3. `functions-quickstart-typescript-azd-eventgrid-blob` ⭐ **NEW** - May need same fix
4. `functions-quickstart-javascript-azd-eventgrid-blob` ⭐ **NEW** - May need same fix
5. `functions-quickstart-java-azd-eventgrid-blob` ⭐ **NEW** - May need same fix
6. `functions-quickstart-python-azd-eventgrid-blob` ⭐ **NEW** - May need same fix
7. `functions-quickstart-powershell-azd-eventgrid-blob` ⭐ **NEW** - May need same fix

### 🔍 Missing from Discovery (1)

The following tracked repository was not found in the search:
- `Azure-Samples/Durable-Functions-Order-Processing` - Has PR #3 (may have different naming pattern)

## Recommendations

1. **Validate New Templates:** Check the 7 newly discovered templates for the deprecated `APPLICATIONINSIGHTS_CONNECTION_STRING` output
2. **Expand Search:** Use additional search terms to find templates with different naming patterns
3. **Update Tracking:** Consider adding successful discoveries to the propagation system
4. **Search Patterns:** The query `functions-quickstart azd org:Azure-Samples` was effective but may miss:
   - Templates with "durable-functions" prefix
   - Templates in other organizations
   - Templates with different naming conventions

## Dynamic Discovery Validation: ✅ SUCCESS

The dynamic discovery capability successfully found **7 additional templates** that were missed in the original static list, demonstrating the value of this approach for future propagations.
