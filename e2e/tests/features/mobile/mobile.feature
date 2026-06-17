@mobile @responsive
Feature: Mobile Responsive Tests
  As a mobile user
  the user wants to browse the website on mobile devices
  So that they can shop on the go

  @smoke
  Scenario: View home page on mobile
    Given the user is on the home page
    Then the user should see the mobile navigation menu

  @smoke
  Scenario: Navigate to products on mobile
    Given the user is on the home page
    When the user opens mobile menu
    And the user clicks on Products link
    Then the user should see products page

  @smoke
  Scenario: Search products on mobile
    Given the user is on the home page
    When the user navigates to products page
    And the user searches for "top"
    Then the user should see search results

  @cart
  Scenario: Add product to cart on mobile
    Given the user is on the home page
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks view cart
    Then the user should see cart page

  @api-ui
  Scenario: Login on mobile device
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    When the user deletes the user via API
    Then the API response code should be 200
