const { I } = inject();

module.exports = () => {
  return {
    // Locators
    productInfoSection: locate('.product-information'),
    productName: locate('.product-information h2'),
    productCategory: locate('.product-information p').first(),
    productPrice: locate('.product-information span span'),
    productAvailability: locate('.product-information p').withText('Availability:'),
    productCondition: locate('.product-information p').withText('Condition:'),
    productBrand: locate('.product-information p').withText('Brand:'),
    
    // Quantity and cart
    quantityInput: locate('input').withAttr({ id: 'quantity' }),
    addToCartButton: locate('button').withText('Add to cart'),
    
    // Review section
    writeReviewHeader: locate('a').withText('Write Your Review'),
    reviewNameInput: locate('input').withAttr({ id: 'name' }),
    reviewEmailInput: locate('input').withAttr({ id: 'email' }),
    reviewTextarea: locate('textarea').withAttr({ id: 'review' }),
    submitReviewButton: locate('button').withAttr({ id: 'button-review' }),
    reviewSuccessMessage: locate('.alert-success'),
    
    // Modal
    addedToCartModal: locate('.modal-content'),
    continueShoppingButton: locate('button').withText('Continue Shopping'),
    viewCartLink: locate('a').withText('View Cart'),

    /**
     * Verify product detail page is loaded
     */
    async verifyProductDetailPageLoaded() {
      await I.waitForVisible(this.productInfoSection, 10);
      await I.waitForVisible(this.productName, 10);
    },

    /**
     * Get product name
     */
    async getProductName() {
      return await I.grabTextFrom(this.productName);
    },

    /**
     * Get product price
     */
    async getProductPrice() {
      return await I.grabTextFrom(this.productPrice);
    },

    /**
     * Get product details
     */
    async getProductDetails() {
      const name = await this.getProductName();
      const price = await this.getProductPrice();
      return { name, price };
    },

    /**
     * Set quantity
     */
    async setQuantity(quantity) {
      await I.clearField(this.quantityInput);
      await I.fillField(this.quantityInput, quantity.toString());
    },

    /**
     * Add to cart
     */
    async addToCart() {
      await I.clickWhenClickable(this.addToCartButton);
    },

    /**
     * Add to cart with quantity
     */
    async addToCartWithQuantity(quantity) {
      await this.setQuantity(quantity);
      await this.addToCart();
    },

    /**
     * Click continue shopping
     */
    async clickContinueShopping() {
      await I.waitForVisible(this.addedToCartModal, 10);
      await I.clickWhenClickable(this.continueShoppingButton);
    },

    /**
     * Click view cart
     */
    async clickViewCart() {
      await I.waitForVisible(this.addedToCartModal, 10);
      await I.clickWhenClickable(this.viewCartLink);
    },

    /**
     * Write a review
     */
    async writeReview(name, email, reviewText) {
      await I.scrollTo(this.writeReviewHeader);
      await I.fillField(this.reviewNameInput, name);
      await I.fillField(this.reviewEmailInput, email);
      await I.fillField(this.reviewTextarea, reviewText);
      await I.clickWhenClickable(this.submitReviewButton);
    },

    /**
     * Verify review submitted successfully
     */
    async verifyReviewSubmitted() {
      await I.waitForVisible(this.reviewSuccessMessage, 10);
      await I.see('Thank you for your review.');
    },

    /**
     * Verify product availability
     */
    async verifyProductAvailable() {
      await I.see('In Stock', this.productAvailability);
    },

    /**
     * Verify product condition
     */
    async verifyProductCondition(condition) {
      await I.see(condition, this.productCondition);
    },

    /**
     * Verify product brand
     */
    async verifyProductBrand(brand) {
      await I.see(brand, this.productBrand);
    },

    /**
     * Increase quantity
     */
    async increaseQuantity() {
      const currentQty = await I.grabValueFrom(this.quantityInput);
      await this.setQuantity(parseInt(currentQty) + 1);
    },

    /**
     * Decrease quantity
     */
    async decreaseQuantity() {
      const currentQty = await I.grabValueFrom(this.quantityInput);
      if (parseInt(currentQty) > 1) {
        await this.setQuantity(parseInt(currentQty) - 1);
      }
    },
  };
};
