const { I } = inject();

module.exports = () => {
  return {
    // Locators - Update these with actual locators from the site
    loginEmailInput: locate('input').withAttr({ 'data-qa': 'login-email' }),
    loginPasswordInput: locate('input').withAttr({ 'data-qa': 'login-password' }),
    loginButton: locate('button').withAttr({ 'data-qa': 'login-button' }),
    loginFormHeader: locate('h2').withText('Login to your account'),
    
    // Error messages
    loginErrorMessage: locate('p').withText('Your email or password is incorrect!'),
    
    // Page URL
    pageUrl: '/login',

    /**
     * Navigate to login page
     * Handles case where user might already be logged in
     */
    async navigateToLoginPage() {
      await I.amOnPage(this.pageUrl);
      await I.wait(1); // Wait for page to stabilize
      // Check if we're on login page or redirected (already logged in)
      try {
        await I.waitForVisible(this.loginFormHeader, 10);
      } catch (e) {
        // If login header not visible, user might be logged in - logout first
        const logoutLink = locate('a').withText('Logout');
        const isLoggedIn = await I.grabNumberOfVisibleElements(logoutLink);
        if (isLoggedIn > 0) {
          await I.click(logoutLink);
          await I.wait(1);
          await I.waitForVisible(this.loginFormHeader, 10);
        } else {
          // Retry navigation with refresh
          await I.refreshPage();
          await I.wait(1);
          await I.waitForVisible(this.loginFormHeader, 10);
        }
      }
    },

    /**
     * Verify login page is loaded
     */
    async verifyLoginPageLoaded() {
      await I.waitForVisible(this.loginFormHeader, 10);
      await I.waitForVisible(this.loginEmailInput, 10);
      await I.waitForVisible(this.loginPasswordInput, 10);
      await I.waitForVisible(this.loginButton, 10);
    },

    /**
     * Fill login credentials
     */
    async fillLoginCredentials(email, password) {
      await I.waitForVisible(this.loginEmailInput, 10);
      await I.fillField(this.loginEmailInput, email);
      await I.fillField(this.loginPasswordInput, password);
    },

    /**
     * Click login button
     */
    async clickLoginButton() {
      await I.clickWhenClickable(this.loginButton);
    },

    /**
     * Perform complete login
     */
    async login(email, password) {
      await this.fillLoginCredentials(email, password);
      await this.clickLoginButton();
    },

    /**
     * Login from any page (navigates first)
     */
    async loginFromAnyPage(email, password) {
      await this.navigateToLoginPage();
      await this.login(email, password);
    },

    /**
     * Verify login error message
     */
    async verifyLoginError() {
      await I.waitForVisible(this.loginErrorMessage, 10);
      await I.see('Your email or password is incorrect!');
    },

    /**
     * Verify successful login (redirected away from login page)
     */
    async verifySuccessfulLogin() {
      await I.waitForInvisible(this.loginFormHeader, 10);
    },

    /**
     * Clear login form
     */
    async clearLoginForm() {
      await I.clearField(this.loginEmailInput);
      await I.clearField(this.loginPasswordInput);
    },
  };
};
