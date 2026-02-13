# GitHub Copilot Agent Instructions for Azure Functions .NET Template

## Overview
This repository contains an Azure Functions HTTP trigger template written in C# using the isolated worker model and deployed using Azure Developer CLI (azd). The template is designed for Flex Consumption hosting with managed identity and optional VNet integration for secure deployments.

## Key Guidelines

### 1. .NET Version Management
- **Current Target Framework**: .NET 10 (`net10.0`)
- **Always verify supported .NET versions** by checking the official Azure Functions documentation at: https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages
- When updating .NET versions, update ALL of the following files:
  - `http/http.csproj` - TargetFramework property
  - `infra/main.bicep` - runtimeVersion parameter (line ~113)
  - `README.md` - Prerequisites section SDK link
  - `.vscode/tasks.json` - cwd path references
  - `.vscode/settings.json` - deploySubpath
  - `azure.yaml` - name field

### 2. NuGet Package Management
Always use the latest **stable** (non-preview) versions of packages:

**Core Packages:**
- `Microsoft.Azure.Functions.Worker` - Core isolated worker functionality
- `Microsoft.Azure.Functions.Worker.Sdk` - Build-time SDK
- `Microsoft.Azure.Functions.Worker.Extensions.Http` - HTTP trigger support
- `Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore` - ASP.NET Core integration

**Monitoring Packages:**
- `Microsoft.ApplicationInsights.WorkerService` - Application Insights base (use 2.22.0, not 3.x due to breaking changes)
- `Microsoft.Azure.Functions.Worker.ApplicationInsights` - Functions-specific telemetry

**Version Checking:**
- Check NuGet.org for latest stable versions before updating
- Avoid preview/rc packages unless explicitly required
- **Important**: Use ApplicationInsights.WorkerService 2.22.0, not 3.x (3.0+ has breaking changes incompatible with current Functions Worker)
- Test locally after any package updates

### 3. Infrastructure as Code (Bicep)
- Runtime configuration is in `infra/main.bicep` and `infra/app/api.bicep`
- The template uses:
  - `runtimeName: 'dotnet-isolated'` (always isolated worker model)
  - `runtimeVersion: '10.0'` (matches .NET version)
- Azure Functions v4 runtime (`AzureFunctionsVersion: v4`)
- Flex Consumption SKU (`FC1`)

### 4. Security Best Practices
- Use managed identity for Azure resource authentication (already configured)
- Storage accounts use managed identity credentials (no keys)
- VNet integration is optional but recommended (controlled via `VNET_ENABLED` parameter)
- TLS 1.2 minimum for storage accounts

### 5. Local Development
- Requires `local.settings.json` with `FUNCTIONS_WORKER_RUNTIME: "dotnet-isolated"`
- Use Azurite for local storage emulation
- Azure Functions Core Tools required for `func start`

### 6. Testing Changes
When making changes:
1. Build locally: `dotnet build http/http.csproj`
2. Run functions: `cd http && func start`
3. Test endpoints: `httpget` and `httppost`
4. Verify deployment: `azd up`

### 7. Template Propagation
This is a source template - changes may need to be propagated to other Azure Functions templates in the family. See `.github/prompts/.propagation/` for automation workflows.

## Common Tasks

### Upgrade .NET Version
1. Check official support: https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages
2. Update csproj TargetFramework
3. Update NuGet packages to compatible versions
4. Update infra/main.bicep runtimeVersion
5. Update README.md prerequisites
6. Update VS Code configuration files
7. Test build and deployment

### Update NuGet Packages
1. Check for latest stable versions on NuGet.org
2. Update all related packages together for compatibility
3. Test build locally
4. Verify Application Insights integration still works

### Modify Infrastructure
1. Changes to Bicep files should maintain security defaults
2. Test with `azd up` in a dev environment
3. Document any new parameters or configuration options

## Important Notes
- Always test changes locally before committing
- Maintain backwards compatibility where possible
- Document breaking changes clearly
- Keep README.md synchronized with code changes
