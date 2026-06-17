@api @apiOnly
Feature: API Tests
  As a developer
  the user wants to test the API endpoints
  So that they can ensure they work correctly

  # ============================================
  # Products API Tests
  # ============================================

  @products @smoke
  Scenario: API 1 - Get All Products List
    When the user gets all products via API
    Then the API response code should be 200
    And the products list should not be empty

  @products @negative
  Scenario: API 2 - POST To All Products List
    When the user posts to products list via API
    Then the API response code should be 405
    And the API response message should be "This request method is not supported."

  @products @dataIntegrity
  Scenario: API - Validate Product Data Structure
    When the user gets all products via API
    Then the API response code should be 200
    And each product should have required fields
    And product prices should be valid format

  # ============================================
  # Brands API Tests
  # ============================================

  @brands @smoke
  Scenario: API 3 - Get All Brands List
    When the user gets all brands via API
    Then the API response code should be 200
    And the brands list should not be empty

  @brands @negative
  Scenario: API 4 - PUT To All Brands List
    When the user puts to brands list via API
    Then the API response code should be 405
    And the API response message should be "This request method is not supported."

  @brands @dataIntegrity
  Scenario: API - Validate Brand Data Structure
    When the user gets all brands via API
    Then the API response code should be 200
    And each brand should have required fields

  # ============================================
  # Search API Tests
  # ============================================

  @search @smoke
  Scenario: API 5 - POST To Search Product
    When the user searches products via API for "top"
    Then the API response code should be 200
    And the search results should not be empty

  @search @negative
  Scenario: API 6 - POST To Search Product without search_product parameter
    When the user searches products via API without parameter
    Then the API response code should be 400
    And the API response message should be "Bad request, search_product parameter is missing in POST request."

  @search @dataIntegrity
  Scenario: API - Search Results Relevance
    When the user searches products via API for "dress"
    Then the API response code should be 200
    And the search results should not be empty
    And the search results should contain "dress"

  @search
  Scenario: API - Search with Multiple Terms
    When the user searches products via API for "blue top"
    Then the API response code should be 200

  # ============================================
  # User Authentication API Tests
  # ============================================

  @user @smoke
  Scenario: API 7 - POST To Verify Login with valid details
    # Create user first, then verify login works
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user verifies login via API
    Then the API response code should be 200
    And the API response message should be "User exists!"
    # Cleanup
    When the user deletes user account via API

  @user @negative
  Scenario: API 8 - POST To Verify Login without email parameter
    When the user verifies login via API with email "" and password "test"
    # API returns 404 "User not found!" for empty/invalid email
    Then the API response code should be 404

  @user @negative
  Scenario: API 10 - POST To Verify Login with invalid details
    When the user verifies login via API with email "nonexistent@test.com" and password "wrongpass"
    Then the API response code should be 404
    And the API response message should be "User not found!"

  # ============================================
  # User Account Management API Tests
  # ============================================

  @user @crud
  Scenario: API 11 - POST To Create/Register User Account
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    And the API response message should be "User created!"
    # Cleanup
    When the user deletes user account via API
    Then the API response code should be 200

  @user @crud
  Scenario: API 12 - DELETE METHOD To Delete User Account
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user deletes user account via API
    Then the API response code should be 200
    And the API response message should be "Account deleted!"

  @user @crud
  Scenario: API 13 - PUT METHOD To Update User Account
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user updates user account via API
    Then the API response code should be 200
    And the API response message should be "User updated!"
    # Cleanup
    When the user deletes user account via API
    Then the API response code should be 200

  @user @crud
  Scenario: API 14 - GET user account detail by email
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user gets user details via API
    Then the API response code should be 200
    And the user details should match
    # Cleanup
    When the user deletes user account via API
    Then the API response code should be 200

  @user @negative
  Scenario: API - Get Non-Existent User Details
    When the user attempts to get user details for non-existent email "nonexistent_user_12345@fake.com"
    Then the API should return user not found

  # ============================================
  # Performance / Response Time Tests
  # ============================================

  @performance @products
  Scenario: API - Products List Response Time
    When the user starts API timer
    And the user gets all products via API
    Then the API response code should be 200
    And the API response time should be less than 3000 ms

  @performance @brands
  Scenario: API - Brands List Response Time
    When the user starts API timer
    And the user gets all brands via API
    Then the API response code should be 200
    And the API response time should be less than 2000 ms

  @performance @search
  Scenario: API - Search Response Time
    When the user starts API timer
    And the user searches products via API for "shirt"
    Then the API response code should be 200
    And the API response time should be less than 3000 ms

  # ============================================
  # Cart Validation API Tests
  # ============================================

  @cart @dataIntegrity
  Scenario: API - Validate Products Available for Cart
    When the user validates products "1, 2, 3" are available via API
    Then all products should be available

  @cart
  Scenario: API - Calculate Cart Total
    When the user calculates cart total for products "1, 2, 3" via API
    Then the cart total should be greater than 0

  # ============================================
  # Data Volume Tests
  # ============================================

  @dataVolume @products
  Scenario: API - Products List Contains Sufficient Data
    When the user gets all products via API
    Then the API response code should be 200
    And the API product count should be greater than 10

  @dataVolume @brands
  Scenario: API - Brands List Contains Sufficient Data
    When the user gets all brands via API
    Then the API response code should be 200
    And the API brand count should be greater than 5
