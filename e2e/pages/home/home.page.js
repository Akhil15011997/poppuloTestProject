const { I } = inject();

module.exports = () => {
  return {
    // Locators
    homePageSlider: locate('.carousel-inner'),
    featuredItemsSection: locate('.features_items'),
    featuredItemsHeader: locate('h2').withText('Features Items'),
    categorySection: locate('.left-sidebar'),
    brandSection: locate('.brands_products'),
    subscriptionSection: locate('.single-widget'),
    subscriptionEmailInput: locate('input').withAttr({ id: 'susbscribe_email' }),
    subscriptionButton: locate('button').withAttr({ id: 'subscribe' }),
    subscriptionSuccessMessage: locate('.alert-success'),
    
    // Product cards
    productCard: locate('.productinfo'),
    addToCartButton: locate('.add-to-cart'),
    viewProductButton: locate('a').withText('View Product'),
    
    // Page URL
    pageUrl: '/',

    /**
     * Navigate to home page
     */
    async navigateToHomePage() {
      await I.amOnPage(this.pageUrl);
      await I.waitForVisible(this.featuredItemsSection, 10);
    },

    /**
     * Verify home page is loaded
     */
    async verifyHomePageLoaded() {
      await I.waitForVisible(this.featuredItemsSection, 10);
      await I.see('Features Items');
    },

    /**
     * Verify slider is displayed
     */
    async verifySliderDisplayed() {
      await I.waitForVisible(this.homePageSlider, 10);
    },

    /**
     * Verify featured items section
     */
    async verifyFeaturedItemsSection() {
      await I.waitForVisible(this.featuredItemsSection, 10);
      await I.waitForVisible(this.featuredItemsHeader, 10);
    },

    /**
     * Verify category sidebar
     */
    async verifyCategorySidebar() {
      await I.waitForVisible(this.categorySection, 10);
    },

    /**
     * Verify brands section
     */
    async verifyBrandsSection() {
      await I.waitForVisible(this.brandSection, 10);
    },

    /**
     * Get product count on home page
     */
    async getProductCount() {
      const count = await I.grabNumberOfVisibleElements(this.productCard);
      return count;
    },

    /**
     * Click on product by index (1-based)
     */
    async clickProductByIndex(index) {
      const products = locate('.productinfo').at(index);
      await I.scrollTo(products);
      await I.clickWhenClickable(products);
    },

    /**
     * Add product to cart by index
     */
    async addProductToCartByIndex(index) {
      const addButton = locate('.add-to-cart').at(index);
      await I.scrollTo(addButton);
      await I.clickWhenClickable(addButton);
    },

    /**
     * View product details by index
     */
    async viewProductByIndex(index) {
      const viewButton = locate('a').withText('View Product').at(index);
      await I.scrollTo(viewButton);
      await I.clickWhenClickable(viewButton);
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
     * Scroll to bottom of page
     */
    async scrollToBottom() {
      await I.executeScript(() => window.scrollTo(0, document.body.scrollHeight));
    },

    /**
     * Scroll to top of page
     */
    async scrollToTop() {
      await I.executeScript(() => window.scrollTo(0, 0));
    },

    /**
     * Click scroll up button if visible
     */
    async clickScrollUpButton() {
      const scrollUpButton = locate('#scrollUp');
      const isVisible = await I.grabNumberOfVisibleElements(scrollUpButton);
      if (isVisible > 0) {
        await I.clickWhenClickable(scrollUpButton);
      }
    },
  };
};
