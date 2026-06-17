module.exports = {
  // Test users
  users: {
    validUser: {
      name: 'Test User',
      email: 'testuser@example.com',
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
    },
    invalidUser: {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    },
  },

  // Payment information
  payment: {
    validCard: {
      nameOnCard: 'Test User',
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2028',
    },
    invalidCard: {
      nameOnCard: 'Test User',
      cardNumber: '1234567890123456',
      cvc: '000',
      expiryMonth: '01',
      expiryYear: '2020',
    },
  },

  // Contact form data
  contact: {
    validContact: {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message for automation testing purposes.',
    },
  },

  // Search terms
  search: {
    validTerms: ['top', 'dress', 'jeans', 'tshirt', 'saree'],
    invalidTerms: ['xyznonexistent123'],
  },

  // Product data
  products: {
    categories: ['Women', 'Men', 'Kids'],
    brands: ['Polo', 'H&M', 'Madame', 'Mast & Harbour', 'Babyhug', 'Allen Solly Junior', 'Kookie Kids', 'Biba'],
  },

  // Review data
  review: {
    validReview: {
      name: 'Test Reviewer',
      email: 'reviewer@example.com',
      text: 'This is an excellent product! Highly recommended for testing purposes.',
    },
  },

  // Subscription data
  subscription: {
    validEmail: 'subscriber@example.com',
    invalidEmail: 'invalid-email',
  },
};
