const { I } = inject();

module.exports = () => {
  return {
    // Locators
    cartTable: locate('table#cart_info_table'),
    cartItem: locate('tr[id^="product-"]'),
    cartItemName: locate('.cart_description h4 a'),
    cartItemPrice: locate('.cart_price p'),
    cartItemQuantity: locate('.cart_quantity button'),
    cartItemTotal: locate('.cart_total p'),
    deleteItemButton: locate('.cart_quantity_delete'),
    emptyCartMessage: locate('p').withText('Cart is empty!'),
    
    // Checkout
    proceedToCheckoutButton: locate('a').withText('Proceed To Checkout'),
    registerLoginLink: locate('a').withText('Register / Login'),
    
    // Page URL
    pageUrl: '/view_cart',

    /**
     * Navigate to cart page
     */
    async navigateToCartPage() {
      await I.amOnPage(this.pageUrl);
      // Cart table may not be visible if cart is empty
      await I.waitForElement('body', 5);
    },

    /**
     * Verify cart page is loaded
     */
    async verifyCartPageLoaded() {
      // Cart table is only visible when cart has items
      await I.waitForElement('body', 5);
      await I.seeInCurrentUrl('/view_cart');
    },

    /**
     * Get cart item count
     */
    async getCartItemCount() {
      return await I.grabNumberOfVisibleElements(this.cartItem);
    },

    /**
     * Verify cart is empty
     */
    async verifyCartIsEmpty() {
      await I.waitForVisible(this.emptyCartMessage, 10);
      await I.see('Cart is empty!');
    },

    /**
     * Verify cart is not empty
     */
    async verifyCartIsNotEmpty() {
      const count = await this.getCartItemCount();
      I.assertTrue(count > 0, 'Cart should not be empty');
    },

    /**
     * Get all cart item names
     */
    async getCartItemNames() {
      return await I.grabTextFromAll(this.cartItemName);
    },

    /**
     * Get all cart item prices
     */
    async getCartItemPrices() {
      return await I.grabTextFromAll(this.cartItemPrice);
    },

    /**
     * Get all cart item quantities
     */
    async getCartItemQuantities() {
      return await I.grabTextFromAll(this.cartItemQuantity);
    },

    /**
     * Get all cart item totals
     */
    async getCartItemTotals() {
      return await I.grabTextFromAll(this.cartItemTotal);
    },

    /**
     * Verify product in cart
     */
    async verifyProductInCart(productName) {
      const names = await this.getCartItemNames();
      const found = names.some(n => n.toLowerCase().includes(productName.toLowerCase()));
      I.assertTrue(found, `Product "${productName}" not found in cart`);
    },

    /**
     * Verify product quantity in cart
     */
    async verifyProductQuantity(productName, expectedQuantity) {
      const names = await this.getCartItemNames();
      const quantities = await this.getCartItemQuantities();
      const index = names.findIndex(n => n.toLowerCase().includes(productName.toLowerCase()));
      
      if (index === -1) {
        throw new Error(`Product "${productName}" not found in cart`);
      }
      
      I.assertEqual(quantities[index], expectedQuantity.toString(), 
        `Expected quantity ${expectedQuantity} but got ${quantities[index]}`);
    },

    /**
     * Delete item from cart by index (1-based)
     */
    async deleteItemByIndex(index) {
      const initialCount = await this.getCartItemCount();
      const deleteButton = locate('.cart_quantity_delete').at(index);
      await I.clickWhenClickable(deleteButton);
      // Wait for item count to decrease or cart to become empty
      await I.waitForFunction(
        (prevCount) => {
          const rows = document.querySelectorAll('tr[id^="product-"]');
          return rows.length < prevCount || document.querySelector('p')?.textContent?.includes('Cart is empty');
        },
        [initialCount],
        10
      );
    },

    /**
     * Delete item from cart by name
     */
    async deleteItemByName(productName) {
      const names = await this.getCartItemNames();
      const index = names.findIndex(n => n.toLowerCase().includes(productName.toLowerCase()));
      
      if (index === -1) {
        throw new Error(`Product "${productName}" not found in cart`);
      }
      
      await this.deleteItemByIndex(index + 1);
    },

    /**
     * Clear all items from cart
     */
    async clearCart() {
      let count = await this.getCartItemCount();
      while (count > 0) {
        await this.deleteItemByIndex(1);
        count = await this.getCartItemCount();
      }
    },

    /**
     * Click proceed to checkout
     */
    async clickProceedToCheckout() {
      await I.clickWhenClickable(this.proceedToCheckoutButton);
    },

    /**
     * Click register/login link (when not logged in)
     */
    async clickRegisterLogin() {
      await I.clickWhenClickable(this.registerLoginLink);
    },

    /**
     * Calculate expected total for item
     */
    calculateItemTotal(price, quantity) {
      const numericPrice = parseFloat(price.replace('Rs. ', ''));
      return `Rs. ${numericPrice * quantity}`;
    },

    /**
     * Verify cart totals are correct
     */
    async verifyCartTotalsCorrect() {
      const prices = await this.getCartItemPrices();
      const quantities = await this.getCartItemQuantities();
      const totals = await this.getCartItemTotals();
      
      for (let i = 0; i < prices.length; i++) {
        const expectedTotal = this.calculateItemTotal(prices[i], parseInt(quantities[i]));
        I.assertEqual(totals[i], expectedTotal, 
          `Total mismatch for item ${i + 1}: expected ${expectedTotal}, got ${totals[i]}`);
      }
    },
  };
};
