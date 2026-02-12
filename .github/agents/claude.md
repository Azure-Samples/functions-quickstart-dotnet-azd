# Claude Agent Instructions for Azure Functions .NET Template

## Repository Context
This repository contains an Azure Functions HTTP trigger quickstart template written in C# (.NET isolated worker model) and deployed to Azure Functions Flex Consumption using Azure Developer CLI (azd). The template emphasizes security with managed identity and optional VNet integration.

## Critical Guidelines

### 1. .NET Version Management

**Current Configuration: .NET 10**

Before making any .NET version changes, you MUST:
1. Fetch and verify current support from: https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages
2. Confirm the version is GA (Generally Available), not preview

**Files requiring updates for .NET version changes:**
```
http/http.csproj                    - <TargetFramework>net10.0</TargetFramework>
infra/main.bicep                    - runtimeVersion: '10.0' (around line 113)
README.md                           - Prerequisites: .NET SDK link
.vscode/tasks.json                  - Path: bin/Debug/net10.0
.vscode/settings.json               - deploySubpath: bin/Release/net10.0/publish
azure.yaml                          - name: starter-dotnet10-flex-func
```

### 2. NuGet Package Dependencies

**Current Package Versions (as of .NET 10 upgrade):**
```xml
<PackageReference Include="Microsoft.Azure.Functions.Worker" Version="2.51.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.3.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="2.1.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="2.0.7" />
<PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="3.0.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="2.50.0" />
```

**Package Update Protocol:**
- Only use stable/GA versions (no preview, beta, or rc)
- Verify compatibility between packages before updating
- Check release notes for breaking changes
- Always test locally after updates

**Where to check versions:**
- NuGet.org package pages
- GitHub releases for azure-functions-dotnet-worker
- Azure Functions documentation

### 3. Infrastructure Configuration (Bicep)

**Key Settings in infra/main.bicep:**
```bicep
runtimeName: 'dotnet-isolated'      // Always isolated worker model
runtimeVersion: '10.0'              // Must match .NET version
```

**Infrastructure Architecture:**
- Hosting: Flex Consumption (SKU: FC1)
- Runtime: Functions v4
- Model: Isolated worker process
- Authentication: Managed Identity (UserAssigned)
- Storage: Keyless access via managed identity
- Networking: Optional VNet (parameter: vnetEnabled)

### 4. Security Requirements

**Non-negotiable security practices:**
- Use managed identity for all Azure resource access
- Storage accounts must use `allowSharedKeyAccess: false`
- Minimum TLS 1.2 for all connections
- VNet integration available via VNET_ENABLED parameter
- No storage account keys in configuration

**Authentication Configuration:**
```json
{
  "AzureWebJobsStorage__credential": "managedidentity",
  "AzureWebJobsStorage__clientId": "<identity-client-id>"
}
```

### 5. Local Development Setup

**Required local.settings.json (http/ directory):**
```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
    }
}
```

**Prerequisites:**
- .NET 10 SDK
- Azure Functions Core Tools (v4)
- Azure Developer CLI (azd)
- Azurite for local storage emulation (optional but recommended)

### 6. Testing Workflow

**For any code changes:**
```bash
# 1. Build the project
cd http
dotnet build

# 2. Run locally
func start

# 3. Test endpoints
curl http://localhost:7071/api/httpget
curl -X POST http://localhost:7071/api/httppost \
  -H "Content-Type: application/json" \
  -d @testdata.json

# 4. Deploy to Azure
cd ..
azd up
```

### 7. Code Structure

**Function Definitions:**
- `http/httpGetFunction.cs` - HTTP GET endpoint
- `http/httpPostBodyFunction.cs` - HTTP POST with JSON body
- `http/Program.cs` - Host configuration with Application Insights

**Key Patterns:**
- Use `[Function("name")]` attribute for endpoint naming
- Use `[HttpTrigger(AuthorizationLevel.Function, "method")]` for triggers
- Use `[FromBody]` for request body deserialization
- Inject `ILogger<T>` for structured logging

### 8. Common Maintenance Tasks

**Upgrading .NET Version:**
1. Verify Azure Functions support (check Microsoft Learn docs)
2. Update all 6 files listed in section 1
3. Update NuGet packages to compatible versions
4. Test build: `dotnet build http/http.csproj`
5. Test run: `cd http && func start`
6. Test deployment: `azd up` (in test environment)
7. Verify endpoints work post-deployment

**Updating Dependencies:**
1. Check latest stable versions on NuGet.org
2. Review release notes for breaking changes
3. Update related packages together (e.g., all Worker packages)
4. Update Application Insights packages together
5. Test locally before committing

**Modifying Infrastructure:**
1. Edit Bicep files in `infra/` directory
2. Maintain security best practices (managed identity, no keys)
3. Test with `azd up` in development environment
4. Verify no regression in VNet support

### 9. Template Propagation Context

This repository serves as a **source template** for the Azure Functions AZD template family. Changes made here may need to be propagated to related templates:
- Other language variants (Python, JavaScript, TypeScript, Java)
- Other hosting models (Consumption, Premium, Dedicated)

**Propagation workflow:** See `.github/prompts/.propagation/` directory

### 10. Documentation Standards

**When updating code:**
- Update README.md if prerequisites or setup steps change
- Update inline code comments if business logic changes
- Keep CHANGELOG.md updated (if applicable)
- Ensure sample code in README.md stays synchronized

**README.md sections to maintain:**
- Prerequisites (SDK versions)
- Local setup instructions
- Deployment instructions
- Source code examples

### 11. Important Constraints

**Do NOT:**
- Use preview/beta NuGet packages without explicit requirement
- Remove security features (managed identity, TLS requirements)
- Change to in-process model (must stay isolated worker)
- Add storage account keys to configuration
- Disable VNet support (keep optional)

**Always DO:**
- Ground version decisions in official Azure Functions documentation
- Test locally before pushing changes
- Update all related configuration files together
- Maintain backward compatibility where possible
- Document breaking changes clearly

### 12. Verification Checklist

Before completing any task:
- [ ] All files updated consistently
- [ ] Build succeeds locally (`dotnet build`)
- [ ] Functions run locally (`func start`)
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] Security practices maintained
- [ ] Azure Functions support verified from official docs

## Support Resources

- **Official Docs**: https://learn.microsoft.com/en-us/azure/azure-functions/
- **Supported Languages**: https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages
- **Isolated Worker Guide**: https://learn.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide
- **NuGet Packages**: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker
- **GitHub Repo**: https://github.com/Azure/azure-functions-dotnet-worker

## Response Protocol

When asked to update .NET versions or packages:
1. Acknowledge the request
2. State that you will verify current support from official documentation
3. Fetch the support information
4. Propose changes based on verified information
5. List all files that need updates
6. Execute changes systematically
7. Test the changes
8. Report results

This ensures all guidance is grounded in current, authoritative information.
