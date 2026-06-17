const { I } = inject();

module.exports = () => {
  return {
    // Locators
    footerContainer: locate('footer'),
    subscriptionSection: locate('.single-widget'),
    subscriptionHeader: locate('h2').withText('Subscription'),
    subscriptionEmailInput: locate('input').withAttr({ id: 'susbscribe_email' }),
    subscriptionButton: locate('button').withAttr({ id: 'subscribe' }),
    subscriptionSuccessMessage: locate('.alert-success'),
    
    // Scroll up button
    scrollUpButton: locate('#scrollUp'),
    scrollUpArrow: locate('.fa-angle-up'),

    /**
     * Verify footer is visible
     */
    async verifyFooterVisible() {
      await I.scrollTo(this.footerContainer);
      await I.waitForVisible(this.footerContainer, 10);
    },

    /**
     * Verify subscription section
     */
    async verifySubscriptionSection() {
      await I.scrollTo(this.subscriptionSection);
      await I.waitForVisible(this.subscriptionHeader, 10);
      await I.see('Subscription');
    },

    /**
     * Subscribe to newsletter
     */
    async subscribeToNewsletter(email) {
      await I.scrollTo(this.subscriptionSection);
      await I.waitForVisible(this.subscriptionEmailInput, 10);
      await I.fillField(this.subscriptionEmailInput, email);
      await I.clickWhenClickable(this.subscriptionButton);
    },

    /**
     * Verify subscription success
     */
    async verifySubscriptionSuccess() {
      await I.waitForVisible(this.subscriptionSuccessMessage, 10);
      await I.see('You have been successfully subscribed!');
    },

    /**
     * Subscribe and verify success
     */
    async subscribeAndVerify(email) {
      await this.subscribeToNewsletter(email);
      await this.verifySubscriptionSuccess();
    },

    /**
     * Click scroll up button
     */
    async clickScrollUp() {
      await I.scrollTo(this.footerContainer);
      await I.waitForVisible(this.scrollUpButton, 10);
      await I.clickWhenClickable(this.scrollUpButton);
    },

    /**
     * Verify scroll up button visible
     */
    async verifyScrollUpButtonVisible() {
      await I.scrollTo(this.footerContainer);
      await I.waitForVisible(this.scrollUpButton, 10);
    },

    /**
     * Scroll to footer
     */
    async scrollToFooter() {
      await I.scrollTo(this.footerContainer);
    },
  };
};
