// Parameters
@description('Specifies the name of the virtual network.')
param virtualNetworkName string

@description('Specifies the name of the subnet which contains the virtual machine.')
param subnetName string

@description('Specifies the resource name of the Storage resource with an endpoint.')
param resourceName string

@description('Specifies the location.')
param location string = resourceGroup().location

param tags object = {}

@description('Enable private endpoint for Blob storage.')
param enableBlob bool = true

@description('Enable private endpoint for Queue storage.')
param enableQueue bool = false

@description('Enable private endpoint for Table storage.')
param enableTable bool = false

// Virtual Network
resource vnet 'Microsoft.Network/virtualNetworks@2021-08-01' existing = {
  name: virtualNetworkName
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' existing = {
  name: resourceName
}

var blobPrivateDNSZoneName = format('privatelink.blob.{0}', environment().suffixes.storage)
var blobPrivateDnsZoneVirtualNetworkLinkName = format('{0}-blob-link-{1}', resourceName, take(toLower(uniqueString(resourceName, virtualNetworkName)), 4))

var queuePrivateDNSZoneName = format('privatelink.queue.{0}', environment().suffixes.storage)
var queuePrivateDnsZoneVirtualNetworkLinkName = format('{0}-queue-link-{1}', resourceName, take(toLower(uniqueString(resourceName, virtualNetworkName)), 4))

var tablePrivateDNSZoneName = format('privatelink.table.{0}', environment().suffixes.storage)
var tablePrivateDnsZoneVirtualNetworkLinkName = format('{0}-table-link-{1}', resourceName, take(toLower(uniqueString(resourceName, virtualNetworkName)), 4))

// Private DNS Zones
resource blobPrivateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = if (enableBlob) {
  name: blobPrivateDNSZoneName
  location: 'global'
  tags: tags
  properties: {}
  dependsOn: [
    vnet
  ]
}

resource queuePrivateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = if (enableQueue) {
  name: queuePrivateDNSZoneName
  location: 'global'
  tags: tags
  properties: {}
  dependsOn: [
    vnet
  ]
}

resource tablePrivateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = if (enableTable) {
  name: tablePrivateDNSZoneName
  location: 'global'
  tags: tags
  properties: {}
  dependsOn: [
    vnet
  ]
}

// Virtual Network Links
resource blobPrivateDnsZoneVirtualNetworkLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (enableBlob) {
  parent: blobPrivateDnsZone
  name: blobPrivateDnsZoneVirtualNetworkLinkName
  location: 'global'
  tags: tags
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

resource queuePrivateDnsZoneVirtualNetworkLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (enableQueue) {
  parent: queuePrivateDnsZone
  name: queuePrivateDnsZoneVirtualNetworkLinkName
  location: 'global'
  tags: tags
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

resource tablePrivateDnsZoneVirtualNetworkLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (enableTable) {
  parent: tablePrivateDnsZone
  name: tablePrivateDnsZoneVirtualNetworkLinkName
  location: 'global'
  tags: tags
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

// Private Endpoints
resource blobPrivateEndpoint 'Microsoft.Network/privateEndpoints@2021-08-01' = if (enableBlob) {
  name: 'blob-private-endpoint'
  location: location
  tags: tags
  properties: {
    privateLinkServiceConnections: [
      {
        name: 'blobPrivateLinkConnection'
        properties: {
          privateLinkServiceId: storageAccount.id
          groupIds: [
            'blob'
          ]
        }
      }
    ]
    subnet: {
      id: '${vnet.id}/subnets/${subnetName}'
    }
  }
}

resource blobPrivateDnsZoneGroupName 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2022-01-01' = if (enableBlob) {
  parent: blobPrivateEndpoint
  name: 'blobPrivateDnsZoneGroup'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'storageBlobARecord'
        properties: {
          privateDnsZoneId: blobPrivateDnsZone.id
        }
      }
    ]
  }
}

resource queuePrivateEndpoint 'Microsoft.Network/privateEndpoints@2021-08-01' = if (enableQueue) {
  name: 'queue-private-endpoint'
  location: location
  tags: tags
  properties: {
    privateLinkServiceConnections: [
      {
        name: 'queuePrivateLinkConnection'
        properties: {
          privateLinkServiceId: storageAccount.id
          groupIds: [
            'queue'
          ]
        }
      }
    ]
    subnet: {
      id: '${vnet.id}/subnets/${subnetName}'
    }
  }
}

resource queuePrivateDnsZoneGroupName 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2022-01-01' = if (enableQueue) {
  parent: queuePrivateEndpoint
  name: 'queuePrivateDnsZoneGroup'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'storageQueueARecord'
        properties: {
          privateDnsZoneId: queuePrivateDnsZone.id
        }
      }
    ]
  }
}

resource tablePrivateEndpoint 'Microsoft.Network/privateEndpoints@2021-08-01' = if (enableTable) {
  name: 'table-private-endpoint'
  location: location
  tags: tags
  properties: {
    privateLinkServiceConnections: [
      {
        name: 'tablePrivateLinkConnection'
        properties: {
          privateLinkServiceId: storageAccount.id
          groupIds: [
            'table'
          ]
        }
      }
    ]
    subnet: {
      id: '${vnet.id}/subnets/${subnetName}'
    }
  }
}

resource tablePrivateDnsZoneGroupName 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2022-01-01' = if (enableTable) {
  parent: tablePrivateEndpoint
  name: 'tablePrivateDnsZoneGroup'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'storageTableARecord'
        properties: {
          privateDnsZoneId: tablePrivateDnsZone.id
        }
      }
    ]
  }
}
