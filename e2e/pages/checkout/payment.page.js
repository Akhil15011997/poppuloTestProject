const { I } = inject();

module.exports = () => {
  return {
    // Payment form locators
    paymentHeader: locate('h2').withText('Payment'),
    nameOnCardInput: locate('input').withAttr({ 'data-qa': 'name-on-card' }),
    cardNumberInput: locate('input').withAttr({ 'data-qa': 'card-number' }),
    cvcInput: locate('input').withAttr({ 'data-qa': 'cvc' }),
    expiryMonthInput: locate('input').withAttr({ 'data-qa': 'expiry-month' }),
    expiryYearInput: locate('input').withAttr({ 'data-qa': 'expiry-year' }),
    payAndConfirmButton: locate('button').withAttr({ 'data-qa': 'pay-button' }),
    
    // Success page
    orderPlacedHeader: locate('b').withText('Order Placed!'),
    orderConfirmationMessage: locate('p').withText('Congratulations! Your order has been confirmed!'),
    downloadInvoiceLink: locate('a').withText('Download Invoice'),
    continueButton: locate('a').withAttr({ 'data-qa': 'continue-button' }),
    
    // Page URL
    pageUrl: '/payment',

    /**
     * Verify payment page is loaded
     */
    async verifyPaymentPageLoaded() {
      await I.seeInCurrentUrl('payment');
      await I.waitForVisible(this.nameOnCardInput, 10);
    },

    /**
     * Fill payment details
     */
    async fillPaymentDetails(paymentInfo) {
      await I.fillField(this.nameOnCardInput, paymentInfo.nameOnCard);
      await I.fillField(this.cardNumberInput, paymentInfo.cardNumber);
      await I.fillField(this.cvcInput, paymentInfo.cvc);
      await I.fillField(this.expiryMonthInput, paymentInfo.expiryMonth);
      await I.fillField(this.expiryYearInput, paymentInfo.expiryYear);
    },

    /**
     * Click pay and confirm
     */
    async clickPayAndConfirm() {
      await I.clickWhenClickable(this.payAndConfirmButton);
    },

    /**
     * Complete payment
     */
    async completePayment(paymentInfo) {
      await this.fillPaymentDetails(paymentInfo);
      await this.clickPayAndConfirm();
    },

    /**
     * Verify order placed successfully
     */
    async verifyOrderPlaced() {
      await I.waitForVisible(this.orderPlacedHeader, 15);
      await I.see('ORDER PLACED!');
    },

    /**
     * Verify order confirmation message
     */
    async verifyOrderConfirmation() {
      await I.waitForVisible(this.orderConfirmationMessage, 10);
      await I.see('Congratulations! Your order has been confirmed!');
    },

    /**
     * Download invoice
     */
    async downloadInvoice() {
      await I.clickWhenClickable(this.downloadInvoiceLink);
    },

    /**
     * Click continue after order
     */
    async clickContinue() {
      await I.clickWhenClickable(this.continueButton);
    },

    /**
     * Complete payment and verify success
     */
    async completePaymentAndVerify(paymentInfo) {
      await this.completePayment(paymentInfo);
      await this.verifyOrderPlaced();
      await this.verifyOrderConfirmation();
    },

    /**
     * Get default test payment info
     */
    getTestPaymentInfo() {
      return {
        nameOnCard: 'Test User',
        cardNumber: '4111111111111111',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: '2025',
      };
    },
  };
};
