@email @apiOnly
Feature: Email Testing with Mailgun
  As a QA engineer
  I want to test email functionality
  So that I can verify email-related features work correctly

  Background:
    Given the email service is configured

  # ============================================
  # Option A: Standalone Email Service Tests
  # ============================================

  @standalone
  Scenario: Email Service - Send and Verify Basic Email
    When the system sends an email to "akhilsrinivas1501@gmail.com" with subject "Test Email"
    Then the email should be delivered successfully
    And the last sent email details should be logged

  @standalone
  Scenario: Email Service - Send Email with Custom Content
    When the system sends an email to "akhilsrinivas1501@gmail.com" with subject "Custom Test Email"
    Then the email should be delivered successfully

  @standalone @password
  Scenario: Email Service - Password Reset Email
    When the system sends a password reset email to "akhilsrinivas1501@gmail.com"
    Then the email should be delivered successfully
    And the email subject should contain "Password Reset"

  # ============================================
  # Option B: Simulated User Journey Tests
  # ============================================

  @userJourney @registration
  Scenario: Simulated - User Registration Welcome Email
    Given the user generates a test user
    # In a real app, registration would trigger this email
    When the system sends a welcome email to the user
    Then the email should be delivered successfully
    And the user should receive an email with subject "Welcome"
    And the email should contain the user name
    And the email should contain the user email address

  @userJourney @checkout
  Scenario: Simulated - Order Confirmation Email
    Given the user generates a test user
    # In a real app, checkout completion would trigger this email
    When the system sends an order confirmation email to the user
    Then the email should be delivered successfully
    And the email body should contain "Order ID"

  @userJourney @forgotPassword
  Scenario: Simulated - Forgot Password Flow
    Given the user generates a test user
    # In a real app, forgot password form would trigger this
    When the system sends a password reset email to the user
    Then the email should be delivered successfully
    And the email body should contain "reset"

  # ============================================
  # Email Validation Tests
  # ============================================

  @validation
  Scenario: Email Content - Verify Welcome Email Structure
    Given the user generates a test user
    When the system sends a welcome email to the user
    Then the email should be delivered successfully
    And the email subject should contain "Welcome"
    And the email body should contain "AutomationExercise"
    And the email should contain the user name

  @validation
  Scenario: Email Content - Verify Order Email Contains Order Details
    Given the user generates a test user
    When the system sends an order confirmation email to the user
    Then the email should be delivered successfully
    And the email body should contain "Order ID"
    And the email body should contain "Total"

  # ============================================
  # Mock Mode Tests (Always Pass - For Demo)
  # ============================================

  @mock @demo
  Scenario: Mock Mode - Demonstrate Email Testing Pattern
    Given the email service is in mock mode
    And the user generates a test user
    When the system sends a welcome email to the user
    Then the email should be delivered successfully
    And the user should receive an email with subject "Welcome"
    And the email service status should be logged

  @mock @demo
  Scenario: Mock Mode - Full Registration Email Flow
    Given the email service is in mock mode
    And the user generates a test user
    When the system sends a welcome email to the user
    Then the email should be delivered successfully
    When the user clears the email inbox
    And the system sends a password reset email to the user
    Then the email should be delivered successfully
    And the email subject should contain "Password Reset"

  # ============================================
  # Integration Pattern Demo
  # ============================================

  @integration @demo
  Scenario: Integration Pattern - API Registration + Email Verification
    # This demonstrates how email testing would integrate with the existing API tests
    Given the user generates a test user
    # Step 1: Create user via API (existing functionality)
    When the user creates user account via API
    Then the API response code should be 201
    # Step 2: Simulate welcome email (in real app, triggered by registration)
    When the system sends a welcome email to the user
    Then the email should be delivered successfully
    And the email should contain the user email address
    # Step 3: Cleanup
    When the user deletes user account via API
    Then the API response code should be 200
