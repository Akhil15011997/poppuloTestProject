@playwrightMCP @mcp
Feature: Playwright MCP Browser Testing
  As a tester
  the user wants to run tests via Playwright MCP
  So that they can leverage AI-assisted browser automation with Allure reporting

  Background:
    Given the MCP browser navigates to the home page

   @mcp-navigation
  Scenario: Verify home page loads correctly via MCP
    When the MCP browser takes a snapshot
    Then the snapshot should contain "AutomationExercise"
    And the MCP browser should see "Full-Fledged practice website for Automation Engineers"

   @mcp-navigation
  Scenario: Navigate to products page via MCP
    When the MCP browser navigates to the products page
    And the MCP browser waits 3 seconds
    Then the MCP browser URL should contain "/products"
    And the MCP browser should see "Products"

  @ui @mcp-interaction
  Scenario: Fill login form via MCP
    Given the MCP browser navigates to the login page
    When the MCP browser fills the login form with email "test@example.com" and password "TestPass123"
    And the MCP browser clicks the login button
    Then the MCP browser should see login result

  @ui @mcp-visual
  Scenario: Capture screenshots for visual verification
    When the MCP browser takes a screenshot named "home-page"
    Then the screenshot should be saved to allure results
    When the MCP browser navigates to the products page
    And the MCP browser waits 3 seconds
    And the MCP browser takes a screenshot named "products-page"
    Then the screenshot should be saved to allure results

  @ai @mcp-analysis
  Scenario: Analyze page content with Perplexity AI
    When the MCP browser takes a snapshot
    And the user analyzes page content with Perplexity
    Then the AI analysis should be attached to Allure report

   @mcp-state
  Scenario: Store and verify page state
    When the MCP browser stores current state
    Then the page title should be "Automation Exercise"
    And the MCP browser URL should contain "automationexercise.com"

  @ui @mcp-interaction
  Scenario: Navigate through multiple pages via MCP
    When the MCP browser navigates to the products page
    And the MCP browser waits 3 seconds
    And the MCP browser takes a screenshot named "products-list"
    Then the MCP browser should see "Products"
    When the MCP browser navigates to "/view_cart"
    And the MCP browser waits 3 seconds
    And the MCP browser takes a screenshot named "cart-page"
    Then the MCP browser URL should contain "/view_cart"

  @api-ui @mcp-combo
  Scenario: API setup with MCP UI verification
    # Create user via API
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    # Verify via MCP UI
    When the MCP browser navigates to the login page
    And the MCP browser takes a snapshot
    Then the snapshot should contain "Login to your account"
    # Cleanup
    When the user deletes user account via API
    Then the API response code should be 200

  @ai @mcp-analysis @regression
  Scenario: Full page analysis with AI insights
    When the MCP browser navigates to the products page
    And the MCP browser takes a full page screenshot named "products-full"
    And the MCP browser takes a snapshot
    And the user analyzes test results with Perplexity
    Then the AI analysis should be attached to Allure report

  @ai @mcp-network @network-analysis
  Scenario: Analyze network traffic with AI
    When the MCP browser starts network capture
    And the MCP browser navigates to the products page
    And the MCP browser waits 3 seconds
    And the MCP browser captures network requests
    And the user analyzes network traffic with AI
    Then the network analysis should be attached to Allure report
    And there should be no network errors

  @mcp-network
  Scenario: Verify no network errors during navigation
    When the MCP browser starts network capture
    And the MCP browser navigates to the products page
    And the MCP browser waits 2 seconds
    And the MCP browser navigates to "/view_cart"
    And the MCP browser waits 2 seconds
    And the MCP browser captures network requests
    Then there should be no network errors
