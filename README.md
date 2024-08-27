---
description: This repository contains a Azure Functions HTTP trigger quickstart written in C# and deployed to Azure Functions Flex Consumption using the Azure Developer CLI (AZD). This sample uses managed identity and a virtual network to insure it is secure by default.
page_type: sample
products:
- azure-functions
- azure
- entra-id
urlFragment: starter-http-trigger-csharp
languages:
- csharp
- bicep
- azdeveloper
---

# Azure Functions C# HTTP Trigger using AZD

This sample template provides a set of basic HTTP trigger functions in C# (isolated process mode) that are ready to run locally and can be easily deployed to a function app in Azure Functions.  

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=836901178)

## Run in your local environment

The project is designed to run on your local computer, provided you have met the [required prerequisites](#prerequisites). You can run the project locally in these environments:

+ [Using Azure Functions Core Tools (CLI)](#using-azure-functions-core-tools-cli)
+ [Using Visual Studio Code](#using-visual-studio-code)
+ [Using Visual Studio](#using-visual-studio)

### Prerequisites

+ [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 
+ [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)
+ Start Azurite storage emulator. See [this page](https://learn.microsoft.com/azure/storage/common/storage-use-azurite) for how to configure and start the Azurite emulator for Local Storage.

### Get repo on your local machine
Run the following GIT command to clone this repository to your local machine.
```bash
git clone https://github.com/Azure-Samples/functions-quickstart-dotnet-azd.git
```

### Prepare your local environment
Create a file named `local.settings.json` in `http` folder and add the following:
```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
    }
}
```

### Using Functions (CLI)

1) Open a new terminal and do the following:

```bash
cd http
func start
```

2) Test the HTTP GET trigger using the browser to open http://localhost:7071/api/httpget

3) Test the HTTP POST trigger using your favorite REST client (e.g. [RestClient in VS Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)). `test.http` has been provided to run this quickly.
Or in a new terminal run the following:

```bash
curl -i -X POST http://localhost:7071/api/httppost -H "Content-Type: text/json" -d "{\"name\": \"Developer\"}"
```

### Using Visual Studio Code

1) Open this folder in a new terminal
2) Open VS Code by entering `code .` in the terminal
3) Make sure the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) is installed
4) Press Run/Debug (F5) to run in the debugger (select "Debug anyway" if prompted about local emulater not running) 
5) Use same approach above to test using an HTTP REST client

### Using Visual Studio

1) Open `http.sln` using Visual Studio 2022 or later.
3) Press Run/F5 to run in the debugger
4) Use same approach above to test using an HTTP REST client (note the port may be different than 7071)

## Source Code

The key code that makes this work is as follows in `./http/httpGetFunction.cs` and `./http/httpPostBodyFunction.cs`.  The async Run function is marked as an Azure Function using the Function attribute.  This code shows how to handle an ordinary Web hook GET or a POST that sends a `person` object in the request body as JSON.  

```csharp
[Function("httpget")]
public IActionResult Run(
    [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
{
    var name = req.Query["name"];

    var returnValue = string.IsNullOrEmpty(name)
        ? "Hello, World."
        : $"Hello, {name}.";

    return new OkObjectResult(returnValue);
}
```

```csharp
[Function("httppost")]
public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    [FromBody] Person person)
{   
    if (string.IsNullOrEmpty(person.Name))
    {
        _logger.LogInformation("C# HTTP trigger function processed a request with no name provided.");
        return new BadRequestObjectResult("Please pass a name in the request body.");
    }
    
    _logger.LogInformation($"C# HTTP trigger function processed a request for {person.Name}!");
    return new OkObjectResult(person);
}
```

## Deploy to Azure

The easiest way to deploy this app is using the [Azure Dev CLI aka AZD](https://aka.ms/azd).  If you open this repo in GitHub CodeSpaces the AZD tooling is already preinstalled.

To provision:

```bash
azd up
```

Note that Visual Studio does not yet work to publish Flex Consumption apps. Please use Azure Functions Core Tools, Az CLI or VS Code alternatives instead to deploy your app zip to these Flex resources.
