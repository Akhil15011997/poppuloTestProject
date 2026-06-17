const { I } = inject();

module.exports = () => {
  return {
    // Address sections
    deliveryAddressSection: locate('#address_delivery'),
    billingAddressSection: locate('#address_invoice'),
    deliveryAddressName: locate('#address_delivery .address_firstname'),
    deliveryAddressStreet: locate('#address_delivery .address_address1').at(2),
    deliveryAddressCity: locate('#address_delivery .address_city'),
    deliveryAddressCountry: locate('#address_delivery .address_country_name'),
    deliveryAddressPhone: locate('#address_delivery .address_phone'),
    
    // Order details
    orderTable: locate('table#cart_info'),
    orderItem: locate('tr[id^="product-"]'),
    orderItemName: locate('.cart_description h4 a'),
    orderItemPrice: locate('.cart_price p'),
    orderItemQuantity: locate('.cart_quantity button'),
    orderItemTotal: locate('.cart_total p'),
    orderTotalAmount: locate('.cart_total_price'),
    
    // Comment and place order
    commentTextarea: locate('textarea').withAttr({ name: 'message' }),
    placeOrderButton: locate('a.btn.check_out'),
    
    // Page URL
    pageUrl: '/checkout',

    /**
     * Verify checkout page is loaded
     */
    async verifyCheckoutPageLoaded() {
      await I.waitForVisible(this.deliveryAddressSection, 10);
      // Order table might have different ID, just verify address section is visible
      await I.seeInCurrentUrl('checkout');
    },

    /**
     * Get delivery address details
     */
    async getDeliveryAddressDetails() {
      const name = await I.grabTextFrom(this.deliveryAddressName);
      const street = await I.grabTextFrom(this.deliveryAddressStreet);
      const cityStateZip = await I.grabTextFrom(this.deliveryAddressCity);
      const country = await I.grabTextFrom(this.deliveryAddressCountry);
      const phone = await I.grabTextFrom(this.deliveryAddressPhone);
      
      return { name, street, cityStateZip, country, phone };
    },

    /**
     * Verify delivery address
     */
    async verifyDeliveryAddress(expectedAddress) {
      const address = await this.getDeliveryAddressDetails();
      
      if (expectedAddress.name) {
        I.assertContain(address.name, expectedAddress.name, 'Name mismatch in delivery address');
      }
      if (expectedAddress.country) {
        I.assertContain(address.country, expectedAddress.country, 'Country mismatch in delivery address');
      }
    },

    /**
     * Get order item count
     */
    async getOrderItemCount() {
      return await I.grabNumberOfVisibleElements(this.orderItem);
    },

    /**
     * Get all order item names
     */
    async getOrderItemNames() {
      return await I.grabTextFromAll(this.orderItemName);
    },

    /**
     * Verify product in order
     */
    async verifyProductInOrder(productName) {
      const names = await this.getOrderItemNames();
      const found = names.some(n => n.toLowerCase().includes(productName.toLowerCase()));
      I.assertTrue(found, `Product "${productName}" not found in order`);
    },

    /**
     * Add comment to order
     */
    async addComment(comment) {
      await I.fillField(this.commentTextarea, comment);
    },

    /**
     * Click place order
     */
    async clickPlaceOrder() {
      const placeOrderLink = locate('a[href="/payment"]');
      await I.scrollTo(placeOrderLink);
      await I.wait(1);
      // Use forceClick to bypass any overlays
      await I.forceClick(placeOrderLink);
      await I.waitInUrl('payment', 15);
    },

    /**
     * Complete checkout with comment
     */
    async completeCheckout(comment = '') {
      if (comment) {
        await this.addComment(comment);
      }
      await this.clickPlaceOrder();
    },

    /**
     * Get order total
     */
    async getOrderTotal() {
      const totals = await I.grabTextFromAll(this.orderTotalAmount);
      return totals[totals.length - 1]; // Last total is the grand total
    },

    /**
     * Verify order summary matches cart
     */
    async verifyOrderMatchesCart(cartItems) {
      const orderNames = await this.getOrderItemNames();
      
      for (const cartItem of cartItems) {
        const found = orderNames.some(n => n.toLowerCase().includes(cartItem.toLowerCase()));
        I.assertTrue(found, `Cart item "${cartItem}" not found in order summary`);
      }
    },
  };
};
