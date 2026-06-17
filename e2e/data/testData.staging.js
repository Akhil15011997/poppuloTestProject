const localConfig = require('./testData.local');

module.exports = {
  ...localConfig,

  // Override staging-specific values here
  users: {
    ...localConfig.users,
    validUser: {
      ...localConfig.users.validUser,
      email: 'staging-testuser@example.com',
    },
  },

  // Subscription data
  subscription: {
    validEmail: 'staging-subscriber@example.com',
    invalidEmail: 'invalid-email',
  },
};
