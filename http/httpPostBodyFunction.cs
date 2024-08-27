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
            var returnValue = string.IsNullOrEmpty(person.Name)
                ? "Hello, World."
                : $"Hello, {person.Name}.";
            
            _logger.LogInformation($"C# HTTP trigger function processed a request for {person.Name}!");
            return new OkObjectResult(returnValue);
        }
    }
    public record Person([property: JsonPropertyName("name")] string Name);
}
