# Configure desired versions of terraform, azurerm provider
# Updated for AzureRM 4.x: https://learn.microsoft.com/en-us/azure/developer/terraform/provider-version-history-azurerm-4-0-0-to-current
terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4.21"
    }
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "~>1.2.24"
    }
  }
}

# Enable features for azurerm
# AzureRM 4.x: skip_provider_registration replaced by resource_provider_registrations
# Options: "none", "core", "extended", "all" - use "none" if you lack RP registration permissions
provider "azurerm" {
  resource_provider_registrations = "none"
  storage_use_azuread             = true # Use Entra ID for storage data plane operations
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# Access client_id, tenant_id, subscription_id and object_id configuration values
data "azurerm_client_config" "current" {}
