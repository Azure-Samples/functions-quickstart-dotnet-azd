using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using FromBodyAttribute = Microsoft.Azure.Functions.Worker.Http.FromBodyAttribute;

namespace Company.Function
{
    public class HttpPostBody
    {
        private readonly ILogger _logger;

        public HttpPostBody(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<HttpPostBody>();
        }

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
    }
    public record Person([property: JsonPropertyName("name")] string Name, [property: JsonPropertyName("age")] int Age);
}
