const { I } = inject();

module.exports = () => {
  return {
    // Locators
    loggedInAsText: locate('a').withText('Logged in as'),
    deleteAccountLink: locate('a').withText('Delete Account'),
    accountDeletedHeader: locate('b').withText('Account Deleted!'),
    continueButton: locate('a').withAttr({ 'data-qa': 'continue-button' }),
    logoutLink: locate('a').withText('Logout'),

    /**
     * Verify user is logged in
     */
    async verifyLoggedIn(username) {
      await I.waitForVisible(this.loggedInAsText, 10);
      await I.see(`Logged in as ${username}`);
    },

    /**
     * Verify user is logged in (without checking username)
     */
    async verifyUserIsLoggedIn() {
      await I.waitForVisible(this.loggedInAsText, 10);
    },

    /**
     * Get logged in username
     */
    async getLoggedInUsername() {
      const text = await I.grabTextFrom(this.loggedInAsText);
      return text.replace('Logged in as ', '');
    },

    /**
     * Click delete account
     */
    async clickDeleteAccount() {
      await I.clickWhenClickable(this.deleteAccountLink);
    },

    /**
     * Verify account deleted
     */
    async verifyAccountDeleted() {
      await I.waitForVisible(this.accountDeletedHeader, 10);
      await I.see('Account Deleted!');
    },

    /**
     * Click continue after account deletion
     */
    async clickContinueAfterDeletion() {
      await I.clickWhenClickable(this.continueButton);
    },

    /**
     * Delete account and verify
     */
    async deleteAccountAndVerify() {
      await this.clickDeleteAccount();
      await this.verifyAccountDeleted();
      await this.clickContinueAfterDeletion();
    },

    /**
     * Logout
     */
    async logout() {
      await I.clickWhenClickable(this.logoutLink);
    },

    /**
     * Verify logged out (login page displayed)
     */
    async verifyLoggedOut() {
      await I.waitForVisible(locate('h2').withText('Login to your account'), 10);
    },

    /**
     * Logout and verify
     */
    async logoutAndVerify() {
      await this.logout();
      await this.verifyLoggedOut();
    },
  };
};
