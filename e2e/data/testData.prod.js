const localConfig = require('./testData.local');

module.exports = {
  ...localConfig,

  // Override production-specific values here
  users: {
    ...localConfig.users,
    validUser: {
      ...localConfig.users.validUser,
      email: 'prod-testuser@example.com',
    },
  },

  // Subscription data
  subscription: {
    validEmail: 'prod-subscriber@example.com',
    invalidEmail: 'invalid-email',
  },
};
