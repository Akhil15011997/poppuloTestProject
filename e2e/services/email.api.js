const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MAILGUN_API_BASE = 'https://api.mailgun.net/v3';

/**
 * Mailgun Email Service for E2E Testing
 * Provides methods to send and receive emails for test verification
 */
class EmailService {
  constructor() {
    this.apiKey = process.env.MAILGUN_API_KEY;
    this.domain = process.env.MAILGUN_DOMAIN;
    this.fromEmail = process.env.MAILGUN_FROM_EMAIL || `test@${this.domain}`;
    this.mockMode = process.env.MAILGUN_MOCK_MODE === 'true' || !this.apiKey;
    this.mockInbox = []; // For mock mode
  }

  /**
   * Get axios config with authentication
   */
  getAuthConfig() {
    return {
      auth: {
        username: 'api',
        password: this.apiKey,
      },
    };
  }

  /**
   * Send an email via Mailgun API
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} body - Email body (text)
   * @param {object} options - Additional options (html, attachments, etc.)
   * @returns {object} - Send result with messageId
   */
  async sendEmail(to, subject, body, options = {}) {
    if (this.mockMode) {
      return this.mockSendEmail(to, subject, body, options);
    }

    const form = new FormData();
    form.append('from', options.from || this.fromEmail);
    form.append('to', to);
    form.append('subject', subject);
    form.append('text', body);

    if (options.html) {
      form.append('html', options.html);
    }

    if (options.attachment) {
      form.append('attachment', options.attachment);
    }

    try {
      const response = await axios.post(
        `${MAILGUN_API_BASE}/${this.domain}/messages`,
        form,
        {
          ...this.getAuthConfig(),
          headers: form.getHeaders(),
        }
      );

      return {
        success: true,
        messageId: response.data.id,
        message: response.data.message,
      };
    } catch (error) {
      console.error('[EmailService] Send failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get stored/received emails for a recipient
   * Uses Mailgun's Events API to track email delivery
   * @param {string} recipient - Email address to check
   * @param {number} limit - Max number of emails to return
   * @returns {array} - List of email events
   */
  async getMessages(recipient, limit = 10) {
    if (this.mockMode) {
      return this.mockGetMessages(recipient);
    }

    try {
      const response = await axios.get(
        `${MAILGUN_API_BASE}/${this.domain}/events`,
        {
          ...this.getAuthConfig(),
          params: {
            recipient,
            limit,
            event: 'delivered',
          },
        }
      );

      return response.data.items.map((item) => ({
        id: item.id,
        timestamp: item.timestamp,
        recipient: item.recipient,
        subject: item.message?.headers?.subject,
        messageId: item.message?.headers['message-id'],
        event: item.event,
      }));
    } catch (error) {
      console.error('[EmailService] Get messages failed:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Wait for an email to arrive with specific subject
   * @param {string} recipient - Email address to check
   * @param {string} subjectContains - Subject text to match
   * @param {number} timeoutMs - Max wait time in milliseconds
   * @param {number} pollIntervalMs - Polling interval
   * @returns {object|null} - Email object or null if not found
   */
  async waitForEmail(recipient, subjectContains, timeoutMs = 30000, pollIntervalMs = 2000) {
    if (this.mockMode) {
      return this.mockWaitForEmail(recipient, subjectContains);
    }

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const messages = await this.getMessages(recipient);
      const matchingEmail = messages.find(
        (msg) => msg.subject && msg.subject.toLowerCase().includes(subjectContains.toLowerCase())
      );

      if (matchingEmail) {
        return matchingEmail;
      }

      await this.sleep(pollIntervalMs);
    }

    return null;
  }

  /**
   * Get full email content by storage URL
   * @param {string} storageUrl - Mailgun storage URL
   * @returns {object} - Full email content
   */
  async getEmailContent(storageUrl) {
    if (this.mockMode) {
      return this.mockGetEmailContent(storageUrl);
    }

    try {
      const response = await axios.get(storageUrl, this.getAuthConfig());
      return {
        subject: response.data.subject,
        from: response.data.from,
        to: response.data.To,
        body: response.data['body-plain'],
        html: response.data['body-html'],
        attachments: response.data.attachments || [],
      };
    } catch (error) {
      console.error('[EmailService] Get content failed:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Validate email was delivered successfully
   * @param {string} recipient - Email address
   * @param {string} messageId - Message ID from send response
   * @returns {boolean} - True if delivered
   */
  async verifyDelivery(recipient, messageId) {
    if (this.mockMode) {
      return this.mockVerifyDelivery(recipient, messageId);
    }

    const messages = await this.getMessages(recipient);
    return messages.some((msg) => msg.messageId === messageId);
  }

  /**
   * Send a welcome email (simulated registration flow)
   * @param {object} user - User object with email and name
   * @returns {object} - Send result
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to AutomationExercise!';
    const body = `
Hello ${user.name || 'User'},

Welcome to AutomationExercise! Your account has been created successfully.

Your registered email: ${user.email}

Thank you for joining us!

Best regards,
AutomationExercise Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #fe980f; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { text-align: center; padding: 10px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to AutomationExercise!</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${user.name || 'User'}</strong>,</p>
      <p>Your account has been created successfully.</p>
      <p><strong>Registered email:</strong> ${user.email}</p>
      <p>Thank you for joining us!</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>AutomationExercise Team</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return this.sendEmail(user.email, subject, body, { html });
  }

  /**
   * Send order confirmation email (simulated checkout flow)
   * @param {object} user - User object
   * @param {object} order - Order details
   * @returns {object} - Send result
   */
  async sendOrderConfirmationEmail(user, order) {
    const subject = `Order Confirmation #${order.orderId || 'ORD-' + Date.now()}`;
    const body = `
Hello ${user.name || 'User'},

Thank you for your order!

Order ID: ${order.orderId || 'ORD-' + Date.now()}
Total: ${order.total || '$0.00'}
Items: ${order.itemCount || 0}

Your order will be processed shortly.

Best regards,
AutomationExercise Team
    `.trim();

    return this.sendEmail(user.email, subject, body);
  }

  /**
   * Send password reset email (simulated forgot password flow)
   * @param {string} email - User email
   * @param {string} resetToken - Reset token/link
   * @returns {object} - Send result
   */
  async sendPasswordResetEmail(email, resetToken) {
    const subject = 'Password Reset Request';
    const resetLink = `https://automationexercise.com/reset-password?token=${resetToken}`;
    const body = `
Hello,

You requested a password reset for your account.

Click the link below to reset your password:
${resetLink}

If you didn't request this, please ignore this email.

Best regards,
AutomationExercise Team
    `.trim();

    return this.sendEmail(email, subject, body);
  }

  // ============================================
  // Mock Mode Methods (for testing without Mailgun)
  // ============================================

  mockSendEmail(to, subject, body, options = {}) {
    const mockEmail = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      messageId: `<mock-${Date.now()}@sandbox.mailgun.org>`,
      timestamp: new Date().toISOString(),
      from: options.from || this.fromEmail || 'test@mock.mailgun.org',
      to,
      subject,
      body,
      html: options.html || null,
      delivered: true,
    };

    this.mockInbox.push(mockEmail);
    console.log(`[EmailService MOCK] Email sent to ${to}: "${subject}"`);

    return {
      success: true,
      messageId: mockEmail.messageId,
      message: 'Queued. Thank you. (MOCK)',
      mock: true,
    };
  }

  mockGetMessages(recipient) {
    return this.mockInbox
      .filter((email) => email.to === recipient)
      .map((email) => ({
        id: email.id,
        timestamp: email.timestamp,
        recipient: email.to,
        subject: email.subject,
        messageId: email.messageId,
        event: 'delivered',
        mock: true,
      }));
  }

  mockWaitForEmail(recipient, subjectContains) {
    const email = this.mockInbox.find(
      (e) =>
        e.to === recipient &&
        e.subject.toLowerCase().includes(subjectContains.toLowerCase())
    );

    return email
      ? {
          id: email.id,
          subject: email.subject,
          recipient: email.to,
          messageId: email.messageId,
          mock: true,
        }
      : null;
  }

  mockGetEmailContent(storageUrl) {
    const emailId = storageUrl.split('/').pop();
    const email = this.mockInbox.find((e) => e.id === emailId);

    return email
      ? {
          subject: email.subject,
          from: email.from,
          to: email.to,
          body: email.body,
          html: email.html,
          attachments: [],
          mock: true,
        }
      : null;
  }

  mockVerifyDelivery(recipient, messageId) {
    return this.mockInbox.some(
      (e) => e.to === recipient && e.messageId === messageId
    );
  }

  /**
   * Clear mock inbox (for test cleanup)
   */
  clearMockInbox() {
    this.mockInbox = [];
  }

  /**
   * Get mock inbox contents (for debugging)
   */
  getMockInbox() {
    return this.mockInbox;
  }

  // ============================================
  // Utility Methods
  // ============================================

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if service is configured
   */
  isConfigured() {
    return !!(this.apiKey && this.domain);
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      mockMode: this.mockMode,
      domain: this.domain || 'not set',
      fromEmail: this.fromEmail,
    };
  }
}

module.exports = new EmailService();
