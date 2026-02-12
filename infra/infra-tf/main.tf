# Flex Consumption Function App Infrastructure
# Migrated from: https://github.com/Azure-Samples/functions-quickstart-dotnet-azd/tree/main/infra

locals {
  tags           = { azd-env-name : var.environment_name }
  sha            = base64encode(sha256("${var.environment_name}${var.location}${data.azurerm_client_config.current.subscription_id}"))
  resource_token = substr(replace(lower(local.sha), "[^A-Za-z0-9_]", ""), 0, 13)

  # Naming with abbreviations (matching Bicep abbreviations.json)
  function_app_name            = "func-api-${local.resource_token}"
  deployment_storage_container = "app-package-${substr(local.function_app_name, 0, 32)}-${substr(lower(local.resource_token), 0, 7)}"
}

resource "azurecaf_name" "rg_name" {
  name          = var.environment_name
  resource_type = "azurerm_resource_group"
  random_length = 0
  clean_input   = true
}

# Deploy resource group
resource "azurerm_resource_group" "rg" {
  name     = azurecaf_name.rg_name.result
  location = var.location
  tags     = local.tags
}

# User Assigned Managed Identity for the Function App
resource "azurecaf_name" "identity_name" {
  name          = "api-${local.resource_token}"
  resource_type = "azurerm_user_assigned_identity"
  random_length = 0
  clean_input   = true
}

resource "azurerm_user_assigned_identity" "api_identity" {
  name                = azurecaf_name.identity_name.result
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  tags                = local.tags
}

# Storage Account for Function App deployment packages
resource "azurecaf_name" "storage_name" {
  name          = local.resource_token
  resource_type = "azurerm_storage_account"
  random_length = 0
  clean_input   = true
}

resource "azurerm_storage_account" "function_storage" {
  name                            = azurecaf_name.storage_name.result
  resource_group_name             = azurerm_resource_group.rg.name
  location                        = var.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false # Disable local auth, use managed identity
  default_to_oauth_authentication = true  # Use Entra ID by default
  min_tls_version                 = "TLS1_2"
  public_network_access_enabled   = var.vnet_enabled ? false : true

  dynamic "network_rules" {
    for_each = var.vnet_enabled ? [1] : []
    content {
      default_action = "Deny"
      bypass         = []
    }
  }

  tags = local.tags
}

# RBAC for deploying user - MUST be created before container when using Entra ID auth
resource "azurerm_role_assignment" "storage_blob_data_owner_deployer" {
  scope                = azurerm_storage_account.function_storage.id
  role_definition_name = "Storage Blob Data Owner"
  principal_id         = data.azurerm_client_config.current.object_id
  principal_type       = "User"
}

resource "azurerm_storage_container" "deployment_package" {
  name                  = local.deployment_storage_container
  storage_account_id    = azurerm_storage_account.function_storage.id
  container_access_type = "private"

  depends_on = [azurerm_role_assignment.storage_blob_data_owner_deployer]
}

# Log Analytics Workspace
resource "azurecaf_name" "log_analytics_name" {
  name          = local.resource_token
  resource_type = "azurerm_log_analytics_workspace"
  random_length = 0
  clean_input   = true
}

resource "azurerm_log_analytics_workspace" "workspace" {
  name                = azurecaf_name.log_analytics_name.result
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

# Application Insights (with local auth disabled)
resource "azurecaf_name" "appinsights_name" {
  name          = local.resource_token
  resource_type = "azurerm_application_insights"
  random_length = 0
  clean_input   = true
}

resource "azurerm_application_insights" "appinsights" {
  name                          = azurecaf_name.appinsights_name.result
  location                      = var.location
  resource_group_name           = azurerm_resource_group.rg.name
  workspace_id                  = azurerm_log_analytics_workspace.workspace.id
  application_type              = "web"
  local_authentication_disabled = true
  tags                          = local.tags
}

# App Service Plan (Flex Consumption - FC1)
resource "azurecaf_name" "plan_name" {
  name          = local.resource_token
  resource_type = "azurerm_app_service_plan"
  random_length = 0
  clean_input   = true
}

resource "azurerm_service_plan" "flex_plan" {
  name                = azurecaf_name.plan_name.result
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "FC1"
  tags                = local.tags
}

# Flex Consumption Function App
resource "azurerm_function_app_flex_consumption" "api" {
  name                = local.function_app_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.flex_plan.id

  # Storage configuration for deployment package
  storage_container_type            = "blobContainer"
  storage_container_endpoint        = "${azurerm_storage_account.function_storage.primary_blob_endpoint}${azurerm_storage_container.deployment_package.name}"
  storage_authentication_type       = "UserAssignedIdentity"
  storage_user_assigned_identity_id = azurerm_user_assigned_identity.api_identity.id

  # Runtime configuration
  runtime_name    = "dotnet-isolated"
  runtime_version = "8.0"

  # Scaling configuration
  maximum_instance_count = 100
  instance_memory_in_mb  = 2048

  # Identity
  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.api_identity.id]
  }

  site_config {
    # Required: empty but needed
  }

  # App Settings
  app_settings = {
    # Storage credential settings (managed identity)
    "AzureWebJobsStorage__credential"      = "managedidentity"
    "AzureWebJobsStorage__clientId"        = azurerm_user_assigned_identity.api_identity.client_id
    "AzureWebJobsStorage__blobServiceUri"  = azurerm_storage_account.function_storage.primary_blob_endpoint
    "AzureWebJobsStorage__queueServiceUri" = azurerm_storage_account.function_storage.primary_queue_endpoint

    # Application Insights (AAD auth)
    "APPLICATIONINSIGHTS_AUTHENTICATION_STRING" = "ClientId=${azurerm_user_assigned_identity.api_identity.client_id};Authorization=AAD"
    "APPLICATIONINSIGHTS_CONNECTION_STRING"     = azurerm_application_insights.appinsights.connection_string
  }

  tags = merge(local.tags, { "azd-service-name" = "api" })

  depends_on = [
    azurerm_role_assignment.storage_blob_data_owner,
    azurerm_role_assignment.monitoring_metrics_publisher
  ]
}

# RBAC Role Assignments

# Storage Blob Data Owner - for Managed Identity
resource "azurerm_role_assignment" "storage_blob_data_owner" {
  scope                = azurerm_storage_account.function_storage.id
  role_definition_name = "Storage Blob Data Owner"
  principal_id         = azurerm_user_assigned_identity.api_identity.principal_id
  principal_type       = "ServicePrincipal"
}

# Storage Blob Data Owner - for current user (debugging)
resource "azurerm_role_assignment" "storage_blob_data_owner_user" {
  count                = var.principal_id != "" ? 1 : 0
  scope                = azurerm_storage_account.function_storage.id
  role_definition_name = "Storage Blob Data Owner"
  principal_id         = var.principal_id
  principal_type       = "User"
}

# Monitoring Metrics Publisher - for Managed Identity (App Insights)
resource "azurerm_role_assignment" "monitoring_metrics_publisher" {
  scope                = azurerm_application_insights.appinsights.id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = azurerm_user_assigned_identity.api_identity.principal_id
  principal_type       = "ServicePrincipal"
}

# Monitoring Metrics Publisher - for current user (debugging)
resource "azurerm_role_assignment" "monitoring_metrics_publisher_user" {
  count                = var.principal_id != "" ? 1 : 0
  scope                = azurerm_application_insights.appinsights.id
  role_definition_name = "Monitoring Metrics Publisher"
  principal_id         = var.principal_id
  principal_type       = "User"
}
