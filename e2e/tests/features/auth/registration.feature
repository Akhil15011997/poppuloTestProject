@auth @registration @smoke
Feature: User Registration
  As a new user
  the user wants to register an account
  So that they can shop on the website

  @ui @testAk
  Scenario: Register user with valid data via UI
    Given the user is on the home page
    When the user clicks on Signup Login link
    And the user has a new user to register
    And the user fills in signup form with generated user
    And the user clicks signup button
    Then the user should see element "[data-qa='password']"
    When the user fills in account information
    And the user fills in address information
    And the user clicks create account button
    Then the user should see account created message

  @ui @negative @api-ui
  Scenario: Register with existing email shows error
    # Ensure fresh session
    Given a new browser session is started
    # First create a user via API
    And the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    # Try to register with same email via UI
    When the user navigates to login page
    And the user fills in signup form with generated user
    And the user clicks signup button
    Then the user should see email already exists error
    # Cleanup
    When the user deletes user account via API

  @api
  Scenario: Create user account via API
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    And the API response message should be "User created!"
    # Cleanup
    When the user deletes user account via API

  @api @negative
  Scenario: Create user with existing email via API returns error
    Given the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user creates user account via API
    Then the API response code should be 400
    And the API response message should be "Email already exists!"
    # Cleanup
    When the user deletes user account via API

  @api-ui @combination
  Scenario: Create user via API and login via UI
    Given a new browser session is started
    And the user generates a test user
    When the user creates user account via API
    Then the API response code should be 201
    When the user navigates to login page
    And the user logs in with generated user credentials
    Then the user should be logged in as the generated user
    When the user deletes the user via API
