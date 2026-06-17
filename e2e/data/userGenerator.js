module.exports = {
  /**
   * Generate a unique test user
   */
  generateUser(prefix = 'testuser') {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    
    return {
      name: `${prefix}_${timestamp}`,
      email: `${prefix}_${timestamp}_${randomStr}@test.com`,
      password: 'TestPassword123!',
      title: 'Mr',
      firstName: 'Test',
      lastName: 'User',
      birthDate: '15',
      birthMonth: 'June',
      birthYear: '1990',
      company: 'Test Company',
      address1: '123 Test Street',
      address2: 'Apt 456',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobileNumber: '5551234567',
      newsletter: true,
      offers: true,
    };
  },

  /**
   * Generate unique email
   */
  generateEmail(prefix = 'test') {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    return `${prefix}_${timestamp}_${randomStr}@test.com`;
  },

  /**
   * Generate unique username
   */
  generateUsername(prefix = 'user') {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  },

  /**
   * Generate random string
   */
  generateRandomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Generate test payment info
   */
  generatePaymentInfo(name = 'Test User') {
    return {
      nameOnCard: name,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2025',
    };
  },

  /**
   * Generate contact form data
   */
  generateContactInfo(prefix = 'contact') {
    const timestamp = Date.now();
    return {
      name: `${prefix}_${timestamp}`,
      email: `${prefix}_${timestamp}@test.com`,
      subject: `Test Subject ${timestamp}`,
      message: `This is an automated test message generated at ${new Date().toISOString()}`,
    };
  },

  /**
   * Generate review data
   */
  generateReview(prefix = 'reviewer') {
    const timestamp = Date.now();
    return {
      name: `${prefix}_${timestamp}`,
      email: `${prefix}_${timestamp}@test.com`,
      text: `This is an automated review generated at ${new Date().toISOString()}. Great product!`,
    };
  },
};
