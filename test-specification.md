# Unit Test Specification for Azure Functions HTTP Triggers

## Overview
This document specifies the unit testing approach for the Azure Functions HTTP triggers in this quickstart project. The tests will follow ASP.NET Core unit testing best practices and use XUnit as the testing framework.

## Testing Methodology

### Principles
Following ASP.NET Core unit testing guidance:

1. **Test in Isolation**: Functions should be tested independently without dependencies on Azure Functions runtime
2. **Mock External Dependencies**: Logger and other services should be mocked using Moq
3. **Arrange-Act-Assert Pattern**: All tests follow the AAA pattern for clarity
4. **Test Public API Surface**: Focus on testing the public `Run` methods
5. **Test Behavior, Not Implementation**: Verify outcomes and side effects, not internal details
6. **Minimal Setup**: Keep test setup minimal and focused on what's being tested

### Test Framework Stack
- **Test Framework**: XUnit (as specified)
- **Mocking Framework**: Moq (standard for .NET unit testing)
- **Assertion Library**: XUnit built-in assertions
- **Additional Packages**: 
  - Microsoft.AspNetCore.Mvc.Core (for IActionResult)
  - Microsoft.Extensions.Logging.Abstractions (for ILogger)

### Test Organization
- Test project name: `http.Tests`
- Test class naming: `{ClassName}Tests` (e.g., `httpGetFunctionTests`, `HttpPostBodyTests`)
- Test method naming: `{MethodName}_{Scenario}_{ExpectedBehavior}` (e.g., `Run_WithName_ReturnsPersonalizedGreeting`)

## Test Cases

### httpGetFunction Tests

#### Primary Functionality Tests

1. **Test: `Run_WithValidName_ReturnsOkResultWithPersonalizedGreeting`**
   - **Arrange**: Create mock logger, HttpRequest with name parameter "John"
   - **Act**: Call Run method with name="John"
   - **Assert**: 
     - Returns OkObjectResult
     - Result value is "Hello, John."
     - Logger was called with appropriate message

2. **Test: `Run_WithEmptyName_ReturnsOkResultWithDefaultGreeting`**
   - **Arrange**: Create mock logger, HttpRequest with empty name parameter
   - **Act**: Call Run method with name=""
   - **Assert**: 
     - Returns OkObjectResult
     - Result value is "Hello, World."
     - Logger was called with appropriate message

3. **Test: `Run_WithNullName_ReturnsOkResultWithDefaultGreeting`**
   - **Arrange**: Create mock logger, HttpRequest with null name parameter
   - **Act**: Call Run method with name=null
   - **Assert**: 
     - Returns OkObjectResult
     - Result value is "Hello, World."
     - Logger was called with appropriate message

#### Error Handling Tests

4. **Test: `Run_LogsInformationMessage`**
   - **Arrange**: Create mock logger, HttpRequest with name parameter
   - **Act**: Call Run method
   - **Assert**: 
     - Verify logger.LogInformation was called exactly once
     - Verify log message contains expected text

### httpPostBodyFunction Tests

#### Primary Functionality Tests

5. **Test: `Run_WithValidPerson_ReturnsOkResultWithPersonalizedMessage`**
   - **Arrange**: Create mock logger, HttpRequest, Person object with Name="Jane" and Age=30
   - **Act**: Call Run method with valid Person
   - **Assert**: 
     - Returns OkObjectResult
     - Result value is "Hello, Jane! You are 30 years old."
     - Logger was called with appropriate messages

6. **Test: `Run_WithEmptyName_ReturnsBadRequest`**
   - **Arrange**: Create mock logger, HttpRequest, Person object with Name="" and Age=25
   - **Act**: Call Run method with Person having empty name
   - **Assert**: 
     - Returns BadRequestObjectResult
     - Result value contains error message "Please provide both name and age in the request body."
     - Logger was called with appropriate message

7. **Test: `Run_WithNullName_ReturnsBadRequest`**
   - **Arrange**: Create mock logger, HttpRequest, Person object with Name=null and Age=25
   - **Act**: Call Run method with Person having null name
   - **Assert**: 
     - Returns BadRequestObjectResult
     - Result value contains error message
     - Logger was called with appropriate message

8. **Test: `Run_WithZeroAge_ReturnsBadRequest`**
   - **Arrange**: Create mock logger, HttpRequest, Person object with Name="John" and Age=0
   - **Act**: Call Run method with Person having Age=0
   - **Assert**: 
     - Returns BadRequestObjectResult
     - Result value contains error message
     - Logger was called with appropriate message

#### Error Handling Tests

9. **Test: `Run_WithValidPerson_LogsMultipleInformationMessages`**
   - **Arrange**: Create mock logger, HttpRequest, valid Person object
   - **Act**: Call Run method with valid Person
   - **Assert**: 
     - Verify logger.LogInformation was called multiple times
     - Verify log messages contain expected information

10. **Test: `Run_WithInvalidPerson_LogsInformationMessage`**
    - **Arrange**: Create mock logger, HttpRequest, Person with missing data
    - **Act**: Call Run method with invalid Person
    - **Assert**: 
      - Verify logger.LogInformation was called
      - Verify log message indicates missing data

## Suggested Additional Unit Tests

### Boundary and Edge Cases
1. **httpGetFunction**:
   - Test with very long name (e.g., 1000+ characters)
   - Test with special characters in name (Unicode, emojis, HTML entities)
   - Test with whitespace-only name
   - Test thread safety (concurrent calls)

2. **httpPostBodyFunction**:
   - Test with negative age value
   - Test with extremely large age value (e.g., Int32.MaxValue)
   - Test with Person object having both null name and zero age
   - Test with whitespace-only name
   - Test with special characters in name
   - Test thread safety (concurrent calls)

### Integration-Style Tests (Future Enhancement)
3. **End-to-End Scenarios**:
   - Test with actual HttpContext and request body parsing
   - Test with actual dependency injection container
   - Test with real logging provider to verify log output format
   - Test authorization level behavior (requires integration testing)

### Performance Tests (Future Enhancement)
4. **Performance Characteristics**:
   - Benchmark response time for typical inputs
   - Memory allocation tests
   - Stress test with rapid repeated calls

### Security Tests (Future Enhancement)
5. **Security Validation**:
   - Test for injection vulnerabilities (SQL, XSS in logging)
   - Test for DoS resistance (large payloads)
   - Validate no sensitive data leaks in error messages or logs

## ASP.NET Unit Testing Best Practices Applied

Based on ASP.NET Core unit testing guidance:

1. **Controller Testing Patterns**: Although these are Azure Functions, the testing approach mirrors controller testing:
   - Test the action method directly
   - Mock dependencies (ILogger)
   - Assert on ActionResult types and values

2. **Dependency Injection**: Functions use constructor injection (ILoggerFactory), which makes them testable

3. **Avoid Testing Framework Code**: Tests don't verify Azure Functions runtime behavior, only business logic

4. **Test One Thing at a Time**: Each test has a single responsibility and tests one scenario

5. **Keep Tests Fast**: No I/O operations, no database calls, no external dependencies

6. **Make Tests Deterministic**: No random data, no time-dependent behavior, predictable outcomes

7. **Test Naming Convention**: Clear, descriptive names that indicate what's being tested and expected outcome

8. **Arrange-Act-Assert**: Clear separation of test phases

## Test Execution

### Build Commands
```bash
dotnet build http.Tests/http.Tests.csproj
```

### Test Execution Commands
```bash
# Run all tests
dotnet test http.Tests/http.Tests.csproj

# Run with verbose output
dotnet test http.Tests/http.Tests.csproj --logger "console;verbosity=detailed"

# Run with code coverage
dotnet test http.Tests/http.Tests.csproj --collect:"XPlat Code Coverage"
```

### Expected Outcomes
- All tests should pass
- Code coverage should be > 90% for both function classes
- No warnings or errors during build
- Tests should execute in < 5 seconds total

## Maintenance Guidelines

1. **Keep Tests Updated**: When function code changes, update corresponding tests
2. **Add Tests for New Features**: Any new functionality requires corresponding tests
3. **Refactor Tests**: When tests become complex, refactor to improve readability
4. **Review Coverage**: Regularly check code coverage and add tests for uncovered paths
5. **Document Complex Tests**: Add comments for non-obvious test scenarios

## Notes

- The current implementation uses bitwise OR (`|`) instead of logical OR (`||`) in the validation condition. While this works, it's not idiomatic. Tests will verify current behavior, but this could be noted as a code quality improvement.
- The Person record is defined in the same file as HttpPostBody class. This is acceptable for the quickstart but might be extracted to a separate file in larger projects.
- Error messages are hardcoded strings. Consider extracting to constants for better maintainability and testing.
