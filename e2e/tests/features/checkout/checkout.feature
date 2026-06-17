@checkout @smoke
Feature: Checkout Process
  As a logged in user
  the user wants to complete the checkout process
  So that they can purchase products

  @ui @e2e
  Scenario: Complete checkout flow as logged in user
    # Ensure fresh session
    Given a new browser session is started
    # Create user via API for faster setup
    And the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    # Login via UI
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    # Add product to cart
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks view cart
    Then the cart should not be empty
    # Proceed to checkout
    When the user proceeds to checkout
    Then the user should see checkout page
    And the user should see their delivery address
    # Complete checkout
    When the user adds comment "Please deliver between 9 AM - 5 PM"
    And the user places the order
    Then the user should see payment page
    # Complete payment
    When the user fills payment details
    And the user confirms payment
    Then the user should see order placed message
    And the user should see order confirmation
    # Cleanup
    When the user deletes the user via API

  @ui
  Scenario: Checkout requires login
    # Ensure fresh session - no user logged in
    Given a new browser session is started
    And the user is on the home page
    When the user navigates to products page
    And the user adds product at index 1 to cart
    And the user clicks view cart
    And the user proceeds to checkout
    Then the user should see "Register / Login"

  @api-ui @combination @e2e
  Scenario: Full e-commerce flow with API setup and UI verification
    # Ensure fresh session
    Given a new browser session is started
    # Setup: Create user via API
    And the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    # Verify user via API
    When the user gets user details via API
    Then the API response code should be 200
    # Get products via API to know what's available
    When the user gets all products via API
    Then the API response code should be 200
    And the products list should not be empty
    # Login via UI
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    # Search and add product
    When the user navigates to products page
    And the user searches for "top"
    Then the user should see search results
    When the user adds product at index 1 to cart
    And the user clicks view cart
    Then the cart should not be empty
    # Complete checkout
    When the user proceeds to checkout
    Then the user should see checkout page
    When the user completes checkout with comment "Test order"
    Then the user should see payment page
    When the user completes payment
    Then the user should see order confirmation
    # Cleanup via API
    When the user deletes the user via API
