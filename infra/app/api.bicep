param name string
@description('Primary location for all resources & Flex Consumption Function App')
// @allowed(['australiaeast', 'centralindia', 'centralus', 'eastasia', 'eastus', 'eastus2', 'francecentral', 'germanywestcentral', 'northcentralus', 'northeurope', 'southcentralus', 'southeastasia', 'swedencentral', 'uksouth', 'westcentralus', 'westeurope', 'westus2', 'eastus2euap'])
param location string = resourceGroup().location
param tags object = {}
param applicationInsightsName string = ''
param appServicePlanId string
param appSettings object = {}
param runtimeName string 
param runtimeVersion string 
param serviceName string = 'api'
param storageAccountName string
param deploymentStorageContainerName string
param virtualNetworkSubnetId string = ''
param instanceMemoryMB int = 2048
param maximumInstanceCount int = 100
param identityId string = ''
param identityClientId string = ''

@allowed(['SystemAssigned', 'UserAssigned'])
param identityType string = 'UserAssigned'

var applicationInsightsIdentity = 'ClientId=${identityClientId};Authorization=AAD'
var kind = 'functionapp,linux'

resource stg 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = if (!empty(applicationInsightsName)) {
  name: applicationInsightsName
}

// Create a Flex Consumption Function App to host the API
module api 'br/public:avm/res/web/site:0.15.1' = {
  name: '${serviceName}-flex-consumption'
  params: {
    kind: kind
    name: name
    tags: union(tags, { 'azd-service-name': serviceName })
    serverFarmResourceId: appServicePlanId
    managedIdentities: {
      systemAssigned: identityType == 'SystemAssigned'
      userAssignedResourceIds: [
        '${identityId}'
      ]
    }
    functionAppConfig: {
      location: location
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${stg.properties.primaryEndpoints.blob}${deploymentStorageContainerName}'
          authentication: {
            type: identityType == 'SystemAssigned' ? 'SystemAssignedIdentity' : 'UserAssignedIdentity'
            userAssignedIdentityResourceId: identityType == 'UserAssigned' ? identityId : '' 
          }
        }
      }
      scaleAndConcurrency: {
        instanceMemoryMB: instanceMemoryMB
        maximumInstanceCount: maximumInstanceCount
      }
      runtime: {
        name: runtimeName
        version: runtimeVersion
      }
    }
    siteConfig: {
      alwaysOn: false
    }
    virtualNetworkSubnetId: !empty(virtualNetworkSubnetId) ? virtualNetworkSubnetId : null
    appSettingsKeyValuePairs: union(appSettings,
      {
        AzureWebJobsStorage__blobEndpoint: stg.properties.primaryEndpoints.blob
        AzureWebJobsStorage__queueEndpoint: stg.properties.primaryEndpoints.queue
        AzureWebJobsStorage__tableEndpoint: stg.properties.primaryEndpoints.table
        AzureWebJobsStorage__fileEndpoint: stg.properties.primaryEndpoints.file
        AzureWebJobsStorage__credential : 'managedidentity'
        AzureWebJobsStorage__clientId : identityClientId
        APPLICATIONINSIGHTS_AUTHENTICATION_STRING: applicationInsightsIdentity
        APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsights.properties.ConnectionString
      })
  }
}


output SERVICE_API_NAME string = api.outputs.name
output SERVICE_API_IDENTITY_PRINCIPAL_ID string = identityType == 'SystemAssigned' ? api.outputs.systemAssignedMIPrincipalId : ''
