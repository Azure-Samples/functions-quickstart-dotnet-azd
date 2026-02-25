using Company.Function;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace http.Tests
{
    public class httpGetFunctionTests
    {
        private readonly Mock<ILogger<httpGetFunction>> _mockLogger;
        private readonly Mock<ILoggerFactory> _mockLoggerFactory;
        private readonly httpGetFunction _function;
        private readonly Mock<HttpRequest> _mockRequest;

        public httpGetFunctionTests()
        {
            _mockLogger = new Mock<ILogger<httpGetFunction>>();
            _mockLoggerFactory = new Mock<ILoggerFactory>();
            _mockLoggerFactory.Setup(x => x.CreateLogger(It.IsAny<string>()))
                .Returns(_mockLogger.Object);
            _function = new httpGetFunction(_mockLoggerFactory.Object);
            _mockRequest = new Mock<HttpRequest>();
        }

        [Fact]
        public void Run_WithValidName_ReturnsOkResultWithPersonalizedGreeting()
        {
            // Arrange
            string name = "John";
            string expectedMessage = "Hello, John.";

            // Act
            var result = _function.Run(_mockRequest.Object, name);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.Equal(expectedMessage, okResult?.Value);
            
            // Verify logging
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(expectedMessage)),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Run_WithEmptyName_ReturnsOkResultWithDefaultGreeting()
        {
            // Arrange
            string name = "";
            string expectedMessage = "Hello, World.";

            // Act
            var result = _function.Run(_mockRequest.Object, name);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.Equal(expectedMessage, okResult?.Value);
            
            // Verify logging
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(expectedMessage)),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Run_WithNullName_ReturnsOkResultWithDefaultGreeting()
        {
            // Arrange
            string? name = null;
            string expectedMessage = "Hello, World.";

            // Act
            var result = _function.Run(_mockRequest.Object, name!);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.Equal(expectedMessage, okResult?.Value);
            
            // Verify logging
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains(expectedMessage)),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Run_LogsInformationMessage()
        {
            // Arrange
            string name = "TestUser";

            // Act
            _function.Run(_mockRequest.Object, name);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("C# HTTP trigger function processed a request")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }
    }
}
