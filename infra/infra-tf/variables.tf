# Input variables for the module

variable "location" {
  description = "The supported Azure location where the resource deployed"
  type        = string
}

variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "principal_id" {
  description = "Id of the user identity for testing/debugging. Leave empty if not needed."
  type        = string
  default     = ""
}

variable "vnet_enabled" {
  description = "Whether to enable virtual network integration"
  type        = bool
  default     = false
}
