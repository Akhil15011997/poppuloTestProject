const { I } = inject();

module.exports = () => {
  return {
    // Locators
    navbarContainer: locate('.navbar-nav'),
    homeLink: locate('a').withText('Home'),
    productsLink: locate('a').withText('Products'),
    cartLink: locate('a').withText('Cart'),
    signupLoginLink: locate('a').withText('Signup / Login'),
    logoutLink: locate('a').withText('Logout'),
    deleteAccountLink: locate('a').withText('Delete Account'),
    testCasesLink: locate('a').withText('Test Cases'),
    apiTestingLink: locate('a').withText('API Testing'),
    videoTutorialsLink: locate('a').withText('Video Tutorials'),
    contactUsLink: locate('a').withText('Contact us'),
    loggedInAsText: locate('li').withChild('a').withChild('i.fa-user'),
    
    // Logo
    logo: locate('.logo'),

    /**
     * Navigate to home page
     */
    async clickHome() {
      await I.clickWhenClickable(this.homeLink);
    },

    /**
     * Navigate to products page
     */
    async clickProducts() {
      await I.clickWhenClickable(this.productsLink);
    },

    /**
     * Navigate to cart page
     */
    async clickCart() {
      await I.clickWhenClickable(this.cartLink);
    },

    /**
     * Navigate to signup/login page
     */
    async clickSignupLogin() {
      await I.clickWhenClickable(this.signupLoginLink);
    },

    /**
     * Click logout
     */
    async clickLogout() {
      await I.clickWhenClickable(this.logoutLink);
    },

    /**
     * Click delete account
     */
    async clickDeleteAccount() {
      await I.clickWhenClickable(this.deleteAccountLink);
    },

    /**
     * Navigate to test cases page
     */
    async clickTestCases() {
      await I.clickWhenClickable(this.testCasesLink);
    },

    /**
     * Navigate to API testing page
     */
    async clickApiTesting() {
      await I.clickWhenClickable(this.apiTestingLink);
    },

    /**
     * Navigate to contact us page
     */
    async clickContactUs() {
      await I.clickWhenClickable(this.contactUsLink);
    },

    /**
     * Verify user is logged in
     */
    async verifyLoggedIn(username) {
      // Wait for logout link to appear (indicates logged in state)
      await I.waitForVisible(this.logoutLink, 10);
      if (username) {
        await I.see(`Logged in as ${username}`);
      }
    },

    /**
     * Verify user is not logged in
     */
    async verifyNotLoggedIn() {
      await I.waitForVisible(this.signupLoginLink, 10);
    },

    /**
     * Verify navbar is visible
     */
    async verifyNavbarVisible() {
      await I.waitForVisible(this.navbarContainer, 10);
    },

    /**
     * Get logged in username from navbar
     */
    async getLoggedInUsername() {
      const text = await I.grabTextFrom(this.loggedInAsText);
      return text.replace('Logged in as ', '');
    },

    /**
     * Verify specific nav link is visible
     */
    async verifyNavLinkVisible(linkText) {
      const link = locate('a').withText(linkText);
      await I.waitForVisible(link, 10);
    },

    /**
     * Click nav link by text
     */
    async clickNavLink(linkText) {
      const link = locate('a').withText(linkText);
      await I.clickWhenClickable(link);
    },
  };
};
