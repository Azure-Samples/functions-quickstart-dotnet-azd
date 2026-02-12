# Declare output values for the main terraform module.
#
# This allows the main terraform module outputs to be referenced by other modules,
# or by the local machine as a way to reference created resources in Azure for local development.
# Secrets should not be added here.
#
# Outputs are automatically saved in the local azd environment .env file.
# To see these outputs, run `azd env get-values`. `azd env get-values --output json` for json output.

output "AZURE_LOCATION" {
  value = var.location
}

output "AZURE_TENANT_ID" {
  value = data.azurerm_client_config.current.tenant_id
}

output "AZURE_FUNCTION_NAME" {
  value = azurerm_function_app_flex_consumption.api.name
}

output "SERVICE_API_NAME" {
  value = azurerm_function_app_flex_consumption.api.name
}

output "SERVICE_API_IDENTITY_PRINCIPAL_ID" {
  value = azurerm_user_assigned_identity.api_identity.principal_id
}

output "APPLICATIONINSIGHTS_CONNECTION_STRING" {
  value     = azurerm_application_insights.appinsights.connection_string
  sensitive = true
}
