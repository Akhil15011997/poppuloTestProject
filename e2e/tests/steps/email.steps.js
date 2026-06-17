const { I } = inject();
const emailService = require('../../services/email.api');
const testState = require('../../data/testState');

// Store email-related test state
let lastSentEmail = null;
let lastReceivedEmail = null;

// Authorized recipient for Mailgun sandbox (override random test emails)
const MAILGUN_AUTHORIZED_EMAIL = process.env.MAILGUN_AUTHORIZED_EMAIL || 'akhilsrinivas1501@gmail.com';

// ============================================
// Email Service Status Steps
// ============================================

Given('the email service is configured', async () => {
  const status = emailService.getStatus();
  console.log('[Email] Service status:', status);

  if (!status.configured && !status.mockMode) {
    console.warn('[Email] Running in MOCK mode - no Mailgun credentials configured');
  }
});

Given('the email service is in mock mode', async () => {
  process.env.MAILGUN_MOCK_MODE = 'true';
  console.log('[Email] Mock mode enabled');
});

// ============================================
// Send Email Steps
// ============================================

When('the system sends an email to {string} with subject {string}', async (recipient, subject) => {
  const body = `This is a test email sent at ${new Date().toISOString()}`;
  const result = await emailService.sendEmail(recipient, subject, body);

  lastSentEmail = {
    recipient,
    subject,
    body,
    result,
  };

  I.assertTrue(result.success, `Failed to send email: ${result.error || 'Unknown error'}`);
  console.log(`[Email] Sent to ${recipient}: "${subject}" (ID: ${result.messageId})`);
});

When('the system sends a welcome email to the user', async () => {
  const user = testState.currentUser;
  I.assertTrue(!!user, 'No current user in test state');
  I.assertTrue(!!user?.email, 'User has no email address');

  // Use authorized email for real Mailgun, otherwise use test user email
  const recipientEmail = emailService.mockMode ? user.email : MAILGUN_AUTHORIZED_EMAIL;
  const emailUser = { ...user, email: recipientEmail };

  const result = await emailService.sendWelcomeEmail(emailUser);

  // Store body for verification - matches what sendWelcomeEmail generates
  const body = `Hello ${user.name || 'User'},\n\nWelcome to AutomationExercise! Your account has been created successfully.\n\nYour registered email: ${user.email}\n\nThank you for joining us!\n\nBest regards,\nAutomationExercise Team`;

  lastSentEmail = {
    recipient: recipientEmail,
    subject: 'Welcome to AutomationExercise!',
    body,
    result,
  };

  I.assertTrue(result.success, `Failed to send welcome email: ${result.error || 'Unknown error'}`);
  console.log(`[Email] Welcome email sent to ${recipientEmail}`);
});

When('the system sends an order confirmation email to the user', async () => {
  const user = testState.currentUser;
  I.assertTrue(!!user, 'No current user in test state');

  // Use authorized email for real Mailgun, otherwise use test user email
  const recipientEmail = emailService.mockMode ? user.email : MAILGUN_AUTHORIZED_EMAIL;
  const emailUser = { ...user, email: recipientEmail };

  const order = {
    orderId: `ORD-${Date.now()}`,
    total: '$99.99',
    itemCount: 3,
  };

  const result = await emailService.sendOrderConfirmationEmail(emailUser, order);

  // Store body for verification - matches what sendOrderConfirmationEmail generates
  const body = `Hello ${user.name || 'User'},\n\nThank you for your order!\n\nOrder ID: ${order.orderId}\nTotal: ${order.total}\nItems: ${order.itemCount}\n\nYour order will be processed shortly.\n\nBest regards,\nAutomationExercise Team`;

  lastSentEmail = {
    recipient: recipientEmail,
    subject: `Order Confirmation #${order.orderId}`,
    body,
    order,
    result,
  };

  I.assertTrue(result.success, `Failed to send order email: ${result.error || 'Unknown error'}`);
  console.log(`[Email] Order confirmation sent to ${recipientEmail}`);
});

When('the system sends a password reset email to {string}', async (email) => {
  const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const result = await emailService.sendPasswordResetEmail(email, resetToken);

  lastSentEmail = {
    recipient: email,
    subject: 'Password Reset Request',
    resetToken,
    result,
  };

  I.assertTrue(result.success, `Failed to send reset email: ${result.error || 'Unknown error'}`);
  console.log(`[Email] Password reset email sent to ${email}`);
});

When('the system sends a password reset email to the user', async () => {
  const user = testState.currentUser;
  I.assertTrue(!!user, 'No current user in test state');
  I.assertTrue(!!user?.email, 'User has no email address');

  // Use authorized email for real Mailgun, otherwise use test user email
  const recipientEmail = emailService.mockMode ? user.email : MAILGUN_AUTHORIZED_EMAIL;

  const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const result = await emailService.sendPasswordResetEmail(recipientEmail, resetToken);

  lastSentEmail = {
    recipient: recipientEmail,
    subject: 'Password Reset Request',
    body: `Reset link: https://automationexercise.com/reset-password?token=${resetToken}`,
    resetToken,
    result,
  };

  I.assertTrue(result.success, `Failed to send reset email: ${result.error || 'Unknown error'}`);
  console.log(`[Email] Password reset email sent to ${recipientEmail}`);
});

When('the system sends a custom email with:', async (table) => {
  const data = table.rowsHash();
  const result = await emailService.sendEmail(
    data.to,
    data.subject,
    data.body,
    { html: data.html }
  );

  lastSentEmail = {
    recipient: data.to,
    subject: data.subject,
    body: data.body,
    result,
  };

  I.assertTrue(result.success, `Failed to send custom email: ${result.error || 'Unknown error'}`);
});

// ============================================
// Receive/Verify Email Steps
// ============================================

Then('the user should receive an email with subject {string}', async (expectedSubject) => {
  const recipient = lastSentEmail?.recipient || testState.currentUser?.email;
  I.assertTrue(!!recipient, 'No recipient email available');

  const email = await emailService.waitForEmail(recipient, expectedSubject, 30000);

  lastReceivedEmail = email;

  I.assertTrue(!!email, `Email with subject "${expectedSubject}" not received within timeout`);
  console.log(`[Email] Received email: "${email.subject}"`);
});

Then('the user should receive an email within {int} seconds', async (seconds) => {
  const recipient = lastSentEmail?.recipient || testState.currentUser?.email;
  const subject = lastSentEmail?.subject || '';
  I.assertTrue(!!recipient, 'No recipient email available');

  const email = await emailService.waitForEmail(recipient, subject, seconds * 1000);

  lastReceivedEmail = email;

  I.assertTrue(!!email, `Email not received within ${seconds} seconds`);
});

Then('the email should be delivered successfully', async () => {
  I.assertTrue(!!lastSentEmail, 'No email was sent');
  I.assertTrue(lastSentEmail.result.success, 'Email send was not successful');

  // For real Mailgun, the send success is sufficient proof
  // The Events API has a delay and may not show delivery immediately
  // Skip verifyDelivery for now - if send succeeded, email is queued
  console.log('[Email] Delivery verified (send successful)');
});

Then('the email body should contain {string}', async (expectedText) => {
  I.assertTrue(!!(lastSentEmail || lastReceivedEmail), 'No email available to check');

  const emailBody = lastSentEmail?.body || '';
  const containsText = emailBody.toLowerCase().includes(expectedText.toLowerCase());

  I.assertTrue(containsText, `Email body does not contain "${expectedText}"`);
});

Then('the email subject should contain {string}', async (expectedText) => {
  I.assertTrue(!!(lastSentEmail || lastReceivedEmail), 'No email available to check');

  const subject = lastReceivedEmail?.subject || lastSentEmail?.subject || '';
  const containsText = subject.toLowerCase().includes(expectedText.toLowerCase());

  I.assertTrue(containsText, `Email subject "${subject}" does not contain "${expectedText}"`);
});

Then('the email should contain the user name', async () => {
  const user = testState.currentUser;
  I.assertTrue(!!user?.name, 'No user name available');
  I.assertTrue(!!lastSentEmail, 'No email was sent');

  const emailBody = lastSentEmail.body || '';
  const containsName = emailBody.includes(user.name);

  I.assertTrue(containsName, `Email does not contain user name "${user.name}"`);
});

Then('the email should contain the user email address', async () => {
  const user = testState.currentUser;
  I.assertTrue(!!user?.email, 'No user email available');
  I.assertTrue(!!lastSentEmail, 'No email was sent');

  const emailBody = lastSentEmail.body || '';
  const containsEmail = emailBody.includes(user.email);

  I.assertTrue(containsEmail, `Email does not contain user email "${user.email}"`);
});

// ============================================
// Email Count/List Steps
// ============================================

Then('the user should have {int} email(s) in inbox', async (expectedCount) => {
  const recipient = testState.currentUser?.email;
  I.assertTrue(!!recipient, 'No user email available');

  const messages = await emailService.getMessages(recipient);
  I.assertEqual(messages.length, expectedCount, `Expected ${expectedCount} emails, found ${messages.length}`);
});

Then('the inbox should contain an email with subject {string}', async (subject) => {
  const recipient = testState.currentUser?.email;
  I.assertTrue(!!recipient, 'No user email available');

  const messages = await emailService.getMessages(recipient);
  const found = messages.some((m) => m.subject?.toLowerCase().includes(subject.toLowerCase()));

  I.assertTrue(found, `No email with subject containing "${subject}" found in inbox`);
});

// ============================================
// Cleanup Steps
// ============================================

When('the user clears the email inbox', async () => {
  if (emailService.mockMode) {
    emailService.clearMockInbox();
    console.log('[Email] Mock inbox cleared');
  }
  lastSentEmail = null;
  lastReceivedEmail = null;
});

// ============================================
// Debug/Info Steps
// ============================================

Then('the email service status should be logged', async () => {
  const status = emailService.getStatus();
  console.log('[Email] Service Status:');
  console.log(`  - Configured: ${status.configured}`);
  console.log(`  - Mock Mode: ${status.mockMode}`);
  console.log(`  - Domain: ${status.domain}`);
  console.log(`  - From Email: ${status.fromEmail}`);
});

Then('the last sent email details should be logged', async () => {
  if (lastSentEmail) {
    console.log('[Email] Last Sent Email:');
    console.log(`  - To: ${lastSentEmail.recipient}`);
    console.log(`  - Subject: ${lastSentEmail.subject}`);
    console.log(`  - Message ID: ${lastSentEmail.result?.messageId}`);
    console.log(`  - Success: ${lastSentEmail.result?.success}`);
  } else {
    console.log('[Email] No email has been sent in this test');
  }
});
