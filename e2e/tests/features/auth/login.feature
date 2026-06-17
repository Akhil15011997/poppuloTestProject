@auth @login @smoke
Feature: User Login
  As a registered user
  the user wants to login to their account
  So that they can access their profile and shop

  @ui @api-ui
  Scenario: Login with valid credentials via UI
    # Create user via API first
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    # Login via UI
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    # Cleanup - API returns 200 for successful delete
    When the user deletes the user via API

  @ui @negative
  Scenario: Login with invalid credentials shows error
    Given the user is on the login page
    When the user logs in with invalid credentials
    Then the user should see login error message

  @ui @api-ui
  Scenario: Logout user
    # Create and login user
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    # Logout
    When the user logs out
    Then the user should be logged out
    # Cleanup
    When the user deletes the user via API

  @api
  Scenario: Verify login with valid credentials via API
    # Create user first (delete if exists from previous run)
    Given the user generates a test user
    When the user deletes user if exists via API
    And the user creates user account via API
    Then the API response code should be 201
    # Verify login - API returns 200 for valid credentials
    When the user verifies login via API
    Then the API response message should be "User exists!"
    # Cleanup
    When the user deletes user account via API

  @api @negative
  Scenario: Verify login with invalid credentials via API
    When the user verifies login via API with email "invalid@test.com" and password "wrongpass"
    Then the API response code should be 404
    And the API response message should be "User not found!"

  @api-ui @combination 
  Scenario: Create user via API, login via UI, verify via API, delete via API
    Given the user generates a test user
    # Create user via API (delete if exists from previous run)
    When the user deletes user if exists via API
    And the user creates user account via API
    Then the API response code should be 201
    # Verify user exists via API
    When the user verifies login via API
    Then the API response message should be "User exists!"
    # Login via UI
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    # Cleanup - delete via API
    When the user deletes the user via API
