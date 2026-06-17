# Email Testing with Mailgun

This document explains how to set up and use email testing capabilities in the E2E framework using Mailgun.

---

## Overview

Email testing is essential for validating user flows that involve email communication:
- **Registration confirmation emails**
- **Password reset emails**
- **Order confirmation emails**
- **Notification emails**

This framework uses **Mailgun** as the email service provider, with a **mock mode** for testing without credentials.

---

## Mailgun Setup Guide

### Step 1: Create a Mailgun Account

1. Go to [signup.mailgun.com](https://signup.mailgun.com/new/signup)
2. Sign up with your email address
3. Verify your email address (check inbox)
4. Complete phone verification (required for free tier)

### Step 2: Access Your Sandbox Domain

After signup, Mailgun provides a **free sandbox domain** for testing:

1. Log into [Mailgun Dashboard](https://app.mailgun.com/mg/dashboard)
2. Navigate to **Sending** → **Domains**
3. You'll see a sandbox domain like: `sandbox1234567890abcdef.mailgun.org`

> **Note:** Sandbox domains can only send to **authorized recipients** (max 5 on free tier).

### Step 3: Add Authorized Recipients

For sandbox testing, you must authorize recipient emails:

1. Go to **Sending** → **Domains** → Select your sandbox domain
2. Click **Authorized Recipients**
3. Add your test email addresses
4. Verify each email by clicking the link sent to them

### Step 4: Get Your API Key

1. Go to **API Keys** in the Mailgun dashboard
2. Copy your **Private API Key** (starts with `key-...`)
3. Keep this secure - never commit to version control!

### Step 5: Configure Environment Variables

Create or update your `.env` file in the `e2e/` directory:

```bash
# Mailgun Configuration
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=sandbox1234567890abcdef.mailgun.org
MAILGUN_FROM_EMAIL=test@sandbox1234567890abcdef.mailgun.org

# Set to 'false' to use real Mailgun (default: true for safety)
MAILGUN_MOCK_MODE=false
```

---

## Running Email Tests

### With Mock Mode (No Credentials Required)

```bash
# Run email tests in mock mode (default)
pnpm e2e local:@email:apiOnly

# Run specific demo scenarios
pnpm e2e local:@mock:apiOnly
```

### With Real Mailgun Credentials

```bash
# Ensure MAILGUN_MOCK_MODE=false in .env
pnpm e2e local:@email:apiOnly

# Run standalone email tests
pnpm e2e local:@standalone:apiOnly

# Run simulated user journey tests
pnpm e2e local:@userJourney:apiOnly
```

---

## Test Scenarios

### Option A: Standalone Email Service Tests

These tests validate the email service independently:

```gherkin
@email @standalone
Scenario: Send and Verify Basic Email
  When the system sends an email to "test@example.com" with subject "Test Email"
  Then the email should be delivered successfully

Scenario: Password Reset Email
  When the system sends a password reset email to "user@example.com"
  Then the email should be delivered successfully
  And the email subject should contain "Password Reset"
```

### Option B: Simulated User Journey Tests

These demonstrate how email testing integrates with typical user flows:

```gherkin
@email @userJourney
Scenario: User Registration Welcome Email
  Given the user generates a new test user
  # Simulates: registration triggers welcome email
  When the system sends a welcome email to the user
  Then the email should be delivered successfully
  And the user should receive an email with subject "Welcome"
  And the email should contain the user name

Scenario: Order Confirmation Email
  Given the user generates a new test user
  # Simulates: checkout completion triggers order email
  When the system sends an order confirmation email to the user
  Then the email should be delivered successfully
  And the email subject should contain "Order Confirmation"
```

### Integration Pattern

Combining API tests with email verification:

```gherkin
@email @integration
Scenario: API Registration + Email Verification
  Given the user generates a new test user
  When the user creates an account via API
  Then the API response code should be 201
  # In real app, registration would trigger this
  When the system sends a welcome email to the user
  Then the email should be delivered successfully
  And the email should contain the user email address
  When the user deletes the account via API
  Then the API response code should be 200
```

---

## Available Step Definitions

### Send Email Steps

| Step | Description |
|------|-------------|
| `When the system sends an email to {string} with subject {string}` | Send basic email |
| `When the system sends a welcome email to the user` | Send welcome email to current user |
| `When the system sends an order confirmation email to the user` | Send order confirmation |
| `When the system sends a password reset email to {string}` | Send password reset |
| `When the system sends a custom email with:` | Send with custom data table |

### Verify Email Steps

| Step | Description |
|------|-------------|
| `Then the email should be delivered successfully` | Verify send success |
| `Then the user should receive an email with subject {string}` | Wait for email arrival |
| `Then the user should receive an email within {int} seconds` | Wait with timeout |
| `Then the email body should contain {string}` | Check body content |
| `Then the email subject should contain {string}` | Check subject content |
| `Then the email should contain the user name` | Verify user name in body |
| `Then the email should contain the user email address` | Verify email in body |

### Utility Steps

| Step | Description |
|------|-------------|
| `Given the email service is configured` | Check service status |
| `Given the email service is in mock mode` | Enable mock mode |
| `When the user clears the email inbox` | Clear mock inbox |
| `Then the email service status should be logged` | Log service info |

---

## Email Service API

The `emailService` provides these methods:

```javascript
const emailService = require('./services/email.api');

// Send emails
await emailService.sendEmail(to, subject, body, options);
await emailService.sendWelcomeEmail(user);
await emailService.sendOrderConfirmationEmail(user, order);
await emailService.sendPasswordResetEmail(email, resetToken);

// Receive/verify emails
await emailService.getMessages(recipient, limit);
await emailService.waitForEmail(recipient, subjectContains, timeout);
await emailService.verifyDelivery(recipient, messageId);
await emailService.getEmailContent(storageUrl);

// Utility
emailService.getStatus();
emailService.isConfigured();
emailService.clearMockInbox();
```

---

## Mock Mode

Mock mode allows testing email flows without Mailgun credentials:

### Benefits
- ✅ No external dependencies
- ✅ Works in CI/CD without secrets
- ✅ Instant "delivery" (no network latency)
- ✅ Demonstrates email testing patterns

### How It Works
- Emails are stored in an in-memory array
- All send operations succeed immediately
- Verification checks the mock inbox
- Perfect for demos and pattern validation

### Enable Mock Mode

```bash
# In .env
MAILGUN_MOCK_MODE=true

# Or programmatically in tests
Given the email service is in mock mode
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL TESTING FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Feature   │────▶│    Step     │────▶│   Email     │       │
│  │    File     │     │ Definition  │     │   Service   │       │
│  │ (.feature)  │     │ (.steps.js) │     │  (.api.js)  │       │
│  └─────────────┘     └─────────────┘     └──────┬──────┘       │
│                                                  │               │
│                           ┌──────────────────────┼───────────┐  │
│                           │                      │           │  │
│                           ▼                      ▼           │  │
│                    ┌─────────────┐        ┌─────────────┐    │  │
│                    │  Mock Mode  │        │   Mailgun   │    │  │
│                    │  (In-Memory)│        │     API     │    │  │
│                    └─────────────┘        └─────────────┘    │  │
│                                                              │  │
└──────────────────────────────────────────────────────────────┘  │
                                                                   │
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` | Check API key is correct |
| `400 Bad Request` | Verify domain is correct |
| `Recipient not authorized` | Add recipient to sandbox authorized list |
| `Email not received` | Check spam folder, verify recipient authorization |

### Debug Steps

1. **Check service status:**
   ```gherkin
   Then the email service status should be logged
   ```

2. **Verify credentials:**
   ```bash
   # Test Mailgun API directly
   curl -s --user 'api:YOUR_API_KEY' \
     https://api.mailgun.net/v3/YOUR_DOMAIN/messages \
     -F from='test@YOUR_DOMAIN' \
     -F to='authorized@email.com' \
     -F subject='Test' \
     -F text='Hello'
   ```

3. **Enable mock mode for debugging:**
   ```bash
   MAILGUN_MOCK_MODE=true pnpm e2e local:@email:apiOnly
   ```

---

## Best Practices

1. **Use mock mode in CI/CD** - Avoid external dependencies in pipelines
2. **Authorize test emails** - Add your test emails to sandbox recipients
3. **Clean up inbox** - Clear mock inbox between tests
4. **Use meaningful subjects** - Makes `waitForEmail` more reliable
5. **Set reasonable timeouts** - Email delivery can take seconds

---

## Tags Reference

| Tag | Description |
|-----|-------------|
| `@email` | All email tests |
| `@standalone` | Email service tests only |
| `@userJourney` | Simulated user flow tests |
| `@mock` | Tests that use mock mode |
| `@demo` | Demonstration scenarios |
| `@integration` | Combined API + email tests |

---

## Future Enhancements

- [ ] Email template validation with snapshots
- [ ] Attachment testing support
- [ ] HTML email rendering validation
- [ ] Multiple recipient support
- [ ] Email queue monitoring

---

*Document Version: 1.0*
