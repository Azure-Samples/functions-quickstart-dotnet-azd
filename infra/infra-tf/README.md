# Terraform Infrastructure for Azure Functions

This directory contains Terraform configuration files for deploying an Azure Functions Flex Consumption application with managed identity and optional virtual network integration.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.1.7
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for authentication)
- An Azure subscription

## Infrastructure Components

The Terraform configuration creates the following Azure resources:

- **Resource Group**: Container for all resources
- **User Assigned Managed Identity**: Used by the Function App for secure authentication
- **Storage Account**: For Function App deployment packages (with Entra ID authentication)
- **Storage Container**: For storing deployment packages
- **Log Analytics Workspace**: For logging and monitoring
- **Application Insights**: For application monitoring and telemetrics
- **App Service Plan**: Flex Consumption plan (FC1)
- **Function App**: Flex Consumption Function App with .NET 8 runtime
- **RBAC Role Assignments**: Necessary permissions for the managed identity and user identity

## Security Features

- **No shared keys**: Storage Account uses Entra ID authentication only
- **Managed Identity**: Function App uses managed identity for all Azure service access
- **TLS 1.2 minimum**: Enforced on the Storage Account
- **Optional VNet**: Can deploy with private networking when enabled

## Configuration

The infrastructure is configured using these files:

- `provider.tf`: Terraform and provider configuration
- `variables.tf`: Input variable definitions
- `main.tf`: Main infrastructure resources
- `output.tf`: Output values
- `main.tfvars.json`: Variable values (uses azd environment variables)

## Usage with Azure Developer CLI (azd)

The easiest way to deploy this infrastructure is using the Azure Developer CLI:

1. Update `azure.yaml` in the repository root to use Terraform:
   ```yaml
   infra:
     provider: terraform
     path: infra/infra-tf
   ```

2. Deploy:
   ```bash
   azd up
   ```

## Manual Deployment (without azd)

If you prefer to deploy without azd:

1. Set environment variables:
   ```bash
   export AZURE_LOCATION="eastus2"
   export AZURE_ENV_NAME="myenv"
   export AZURE_PRINCIPAL_ID=$(az ad signed-in-user show --query id -o tsv)
   export VNET_ENABLED="false"
   ```

2. Initialize Terraform:
   ```bash
   terraform init
   ```

3. Plan the deployment:
   ```bash
   terraform plan -var-file=main.tfvars.json
   ```

4. Apply the configuration:
   ```bash
   terraform apply -var-file=main.tfvars.json
   ```

## Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `environment_name` | Name of the azd environment | (required) |
| `location` | Azure region for resources | (required) |
| `principal_id` | User identity for debugging access | "" |
| `vnet_enabled` | Enable virtual network integration | false |

## Outputs

After deployment, Terraform outputs these values:

- `AZURE_LOCATION`: The Azure region
- `AZURE_TENANT_ID`: The Azure AD tenant ID
- `AZURE_FUNCTION_NAME`: The Function App name
- `SERVICE_API_NAME`: The Function App name (alias)
- `SERVICE_API_IDENTITY_PRINCIPAL_ID`: The managed identity principal ID
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: Application Insights connection string (sensitive)

## Comparison with Bicep

This Terraform configuration is functionally equivalent to the Bicep templates in `/infra`. Both provision the same resources with the same security configuration. Choose the IaC tool that best fits your organization's preferences and workflows.

## Important Notes

- The `.terraform/` directory and `.terraform.lock.hcl` are excluded from git via `.gitignore`
- Terraform state is stored locally by default; consider using remote state for team environments
- The Function App requires deployment via `azd deploy` or manual zip deployment after infrastructure provisioning
