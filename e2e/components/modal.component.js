const { I } = inject();

module.exports = () => {
  return {
    // Add to cart modal
    addedToCartModal: locate('.modal-content'),
    addedToCartTitle: locate('h4').withText('Added!'),
    continueShoppingButton: locate('button').withText('Continue Shopping'),
    viewCartLink: locate('a').withText('View Cart'),
    
    // Generic modal elements
    modalBackdrop: locate('.modal-backdrop'),
    modalCloseButton: locate('.close'),

    /**
     * Verify added to cart modal is displayed
     */
    async verifyAddedToCartModalDisplayed() {
      await I.waitForVisible(this.addedToCartModal, 10);
    },

    /**
     * Click continue shopping
     */
    async clickContinueShopping() {
      await I.waitForVisible(this.continueShoppingButton, 10);
      await I.clickWhenClickable(this.continueShoppingButton);
      await I.waitForInvisible(this.addedToCartModal, 10);
    },

    /**
     * Click view cart
     */
    async clickViewCart() {
      await I.waitForVisible(this.viewCartLink, 10);
      await I.clickWhenClickable(this.viewCartLink);
    },

    /**
     * Close modal
     */
    async closeModal() {
      const isVisible = await I.grabNumberOfVisibleElements(this.modalCloseButton);
      if (isVisible > 0) {
        await I.clickWhenClickable(this.modalCloseButton);
        await I.waitForInvisible(this.addedToCartModal, 10);
      }
    },

    /**
     * Wait for modal to disappear
     */
    async waitForModalToClose() {
      await I.waitForInvisible(this.addedToCartModal, 10);
    },

    /**
     * Check if modal is visible
     */
    async isModalVisible() {
      const count = await I.grabNumberOfVisibleElements(this.addedToCartModal);
      return count > 0;
    },
  };
};
