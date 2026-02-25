using Company.Function;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace http.Tests
{
    public class HttpPostBodyTests
    {
        private readonly Mock<ILogger<HttpPostBody>> _mockLogger;
        private readonly Mock<ILoggerFactory> _mockLoggerFactory;
        private readonly HttpPostBody _function;
        private readonly Mock<HttpRequest> _mockRequest;

        public HttpPostBodyTests()
        {
            _mockLogger = new Mock<ILogger<HttpPostBody>>();
            _mockLoggerFactory = new Mock<ILoggerFactory>();
            _mockLoggerFactory.Setup(x => x.CreateLogger(It.IsAny<string>()))
                .Returns(_mockLogger.Object);
            _function = new HttpPostBody(_mockLoggerFactory.Object);
            _mockRequest = new Mock<HttpRequest>();
        }

        [Fact]
        public void Run_WithValidPerson_ReturnsOkResultWithPersonalizedMessage()
        {
            // Arrange
            var person = new Person("Jane", 30);
            string expectedMessage = "Hello, Jane! You are 30 years old.";

            // Act
            var result = _function.Run(_mockRequest.Object, person);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.Equal(expectedMessage, okResult?.Value);
            
            // Verify logging - should be called multiple times
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.IsAny<It.IsAnyType>(),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.AtLeast(2));
        }

        [Fact]
        public void Run_WithEmptyName_ReturnsBadRequest()
        {
            // Arrange
            var person = new Person("", 25);
            string expectedErrorMessage = "Please provide both name and age in the request body.";

            // Act
            var result = _function.Run(_mockRequest.Object, person);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(expectedErrorMessage, badRequestResult?.Value);
            
            // Verify logging
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("no name/age provided")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Run_WithNullName_ReturnsBadRequest()
        {
            // Arrange
            var person = new Person(null!, 25);
            string expectedErrorMessage = "Please provide both name and age in the request body.";

            // Act
            var result = _function.Run(_mockRequest.Object, person);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(expectedErrorMessage, badRequestResult?.Value);
        }

        [Fact]
        public void Run_WithZeroAge_ReturnsBadRequest()
        {
            // Arrange
            var person = new Person("John", 0);
            string expectedErrorMessage = "Please provide both name and age in the request body.";

            // Act
            var result = _function.Run(_mockRequest.Object, person);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal(expectedErrorMessage, badRequestResult?.Value);
        }

        [Fact]
        public void Run_WithValidPerson_LogsMultipleInformationMessages()
        {
            // Arrange
            var person = new Person("Alice", 28);

            // Act
            _function.Run(_mockRequest.Object, person);

            // Assert - Verify logger was called multiple times
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.IsAny<It.IsAnyType>(),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Exactly(2));
            
            // Verify first log contains URL info
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("processed a request for url")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
            
            // Verify second log contains person info
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Alice") && v.ToString()!.Contains("28")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Run_WithInvalidPerson_LogsInformationMessage()
        {
            // Arrange
            var person = new Person("", 0);

            // Act
            _function.Run(_mockRequest.Object, person);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("no name/age provided")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }
}
