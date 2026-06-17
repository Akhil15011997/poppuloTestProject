@products @smoke @products
Feature: Products
  As a user
  the user wants to browse and search products
  So that they can find items to purchase

  @ui
  Scenario: View all products page
    Given the user is on the home page
    When the user navigates to products page
    Then the user should see products page
    And the user should see 1 or more products

  @ui
  Scenario: Search for products
    Given the user is on the home page
    When the user navigates to products page
    And the user searches for "top"
    Then the user should see search results

  @ui
  Scenario: View product details
    Given the user is on the home page
    When the user navigates to products page
    And the user views product at index 1
    Then the user should see product detail page
    And the product should be available

  @ui
  Scenario: Filter products by category
    Given the user is on the home page
    When the user navigates to products page
    And the user selects category "Women"
    And the user selects subcategory "Dress"
    Then the user should see products page

  @ui
  Scenario: Filter products by brand
    Given the user is on the home page
    When the user navigates to products page
    And the user selects brand "Polo"
    Then the user should see products page

  @api
  Scenario: Get all products via API
    When the user gets all products via API
    Then the API response code should be 200
    And the products list should not be empty
    And the API product count should be greater than 0

  @api
  Scenario: Get all brands via API
    When the user gets all brands via API
    Then the API response code should be 200
    And the brands list should not be empty
    And the API brand count should be greater than 0

  @api
  Scenario: Search products via API
    When the user searches products via API for "top"
    Then the API response code should be 200
    And the search results should not be empty

  @api @negative
  Scenario: Search products without parameter returns error
    When the user searches products via API without parameter
    Then the API response code should be 400

  @api @negative
  Scenario: POST to products list returns method not supported
    When the user posts to products list via API
    Then the API response code should be 405
    And the API response message should be "This request method is not supported."

  @api-ui @combination
  Scenario: Verify products count matches between API and UI
    Given the user gets all products via API
    Then the API response code should be 200
    When the user navigates to products page
    Then the product count should match between API and UI

  @api-ui @combination
  Scenario: Search via API and verify results in UI
    When the user searches products via API for "dress"
    Then the API response code should be 200
    And the search results should not be empty
    When the user navigates to products page
    And the user searches for "dress"
    Then the user should see search results
