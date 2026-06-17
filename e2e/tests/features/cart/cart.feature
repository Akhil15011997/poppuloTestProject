@cart @smoke
Feature: Shopping Cart
  As a user
  the user wants to add products to cart
  So that they can purchase them

  @ui
  Scenario: Add single product to cart
    Given the user is on the home page
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks view cart
    Then the user should see cart page
    And the cart should not be empty
    And the cart should have 1 items

  @ui
  Scenario: Add multiple products to cart
    Given the user is on the home page
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks continue shopping
    And the user adds product at index 2 to cart
    And the user clicks view cart
    Then the user should see cart page
    And the cart should have 2 items

  @ui
  Scenario: Add product with specific quantity
    Given the user is on the home page
    When the user navigates to products page
    And the user views product at index 1
    And the user sets quantity to 4
    And the user adds to cart from product detail
    And the user clicks view cart
    Then the user should see cart page
    And the cart should not be empty

  @ui
  Scenario: Remove product from cart
    Given a new browser session is started
    And the user is on the home page
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks view cart
    Then the cart should have 1 items
    When the user removes item at index 1 from cart
    Then the cart should be empty

  @ui
  Scenario: View empty cart
    Given a new browser session is started
    And the user is on the home page
    When the user navigates to cart page
    Then the cart should be empty

  @ui
  Scenario: Verify cart totals are calculated correctly
    Given the user is on the home page
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks view cart
    Then the cart totals should be correct

  @api-ui @combination
  Scenario: Search product via API and add to cart via UI
    When the user searches products via API for "Blue Top"
    Then the API response code should be 200
    And the search results should not be empty
    When the user navigates to products page
    And the user searches for "Blue Top"
    Then the user should see search results
    When the user adds product at index 1 to cart
    And the user clicks view cart
    Then the cart should not be empty
