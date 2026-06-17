const { I } = inject();

module.exports = () => {
  return {
    // Locators
    productsHeader: locate('h2').withText('All Products'),
    productsList: locate('.features_items'),
    productCard: locate('.productinfo'),
    searchInput: locate('input').withAttr({ id: 'search_product' }),
    searchButton: locate('button').withAttr({ id: 'submit_search' }),
    searchedProductsHeader: locate('h2').withText('Searched Products'),
    
    // Product card elements
    productName: locate('.productinfo p'),
    productPrice: locate('.productinfo h2'),
    addToCartButton: locate('.add-to-cart'),
    viewProductLink: locate('a').withText('View Product'),
    
    // Category sidebar
    categorySidebar: locate('.left-sidebar'),
    categoryWomen: locate('a').withAttr({ href: '#Women' }),
    categoryMen: locate('a').withAttr({ href: '#Men' }),
    categoryKids: locate('a').withAttr({ href: '#Kids' }),
    
    // Brand sidebar
    brandSidebar: locate('.brands_products'),
    brandLink: (brandName) => locate('a').withText(brandName),
    
    // Modal
    addedToCartModal: locate('.modal-content'),
    continueShoppingButton: locate('button').withText('Continue Shopping'),
    viewCartLink: locate('a[href="/view_cart"]').inside('.modal-content'),
    
    // Page URL
    pageUrl: '/products',

    /**
     * Navigate to products page
     */
    async navigateToProductsPage() {
      await I.amOnPage(this.pageUrl);
      await I.waitForVisible(this.productsHeader, 10);
    },

    /**
     * Verify products page is loaded
     */
    async verifyProductsPageLoaded() {
      await I.waitForVisible(this.productsHeader, 10);
      await I.waitForVisible(this.productsList, 10);
    },

    /**
     * Search for product
     */
    async searchProduct(searchTerm) {
      await I.waitForVisible(this.searchInput, 10);
      await I.fillField(this.searchInput, searchTerm);
      await I.clickWhenClickable(this.searchButton);
    },

    /**
     * Verify search results displayed
     */
    async verifySearchResultsDisplayed() {
      await I.waitForVisible(this.searchedProductsHeader, 10);
    },

    /**
     * Get product count
     */
    async getProductCount() {
      return await I.grabNumberOfVisibleElements(this.productCard);
    },

    /**
     * Add product to cart by index (1-based)
     */
    async addProductToCartByIndex(index) {
      const productContainer = locate('.product-image-wrapper').at(index);
      await I.scrollTo(productContainer);
      await I.moveCursorTo(productContainer);
      await I.wait(0.5); // Wait for overlay to appear
      // Try overlay button first, fallback to direct add-to-cart
      try {
        const overlayButton = locate('.product-overlay .add-to-cart').at(index);
        await I.waitForVisible(overlayButton, 3);
        await I.forceClick(overlayButton);
      } catch (e) {
        // Fallback: click the visible add-to-cart button
        const addButton = locate('.add-to-cart').at(index);
        await I.forceClick(addButton);
      }
    },

    /**
     * Click continue shopping in modal
     */
    async clickContinueShopping() {
      await I.waitForVisible(this.addedToCartModal, 10);
      await I.clickWhenClickable(this.continueShoppingButton);
      await I.waitForInvisible(this.addedToCartModal, 10);
    },

    /**
     * Click view cart in modal
     */
    async clickViewCart() {
      await I.waitForVisible(this.addedToCartModal, 10);
      await I.clickWhenClickable(this.viewCartLink);
    },

    /**
     * View product details by index
     */
    async viewProductByIndex(index) {
      const viewLink = locate('a').withText('View Product').at(index);
      await I.scrollTo(viewLink);
      await I.clickWhenClickable(viewLink);
    },

    /**
     * Select category
     */
    async selectCategory(categoryName) {
      const categoryLink = locate('a').withAttr({ href: `#${categoryName}` });
      await I.waitForVisible(categoryLink, 10);
      await I.clickWhenClickable(categoryLink);
      // Wait for subcategory panel to expand
      const subcategoryPanel = locate(`#${categoryName}`);
      await I.waitForVisible(subcategoryPanel, 5);
    },

    /**
     * Select subcategory
     */
    async selectSubcategory(subcategoryName) {
      const subcategoryLink = locate('a').withText(subcategoryName);
      await I.waitForVisible(subcategoryLink, 10);
      await I.clickWhenClickable(subcategoryLink);
      // Wait for URL to change
      await I.waitInUrl('category_products', 15);
    },

    /**
     * Select brand
     */
    async selectBrand(brandName) {
      await I.scrollTo(this.brandSidebar);
      await I.waitForVisible(this.brandLink(brandName), 10);
      await I.clickWhenClickable(this.brandLink(brandName));
      // Wait for URL to change
      await I.waitInUrl('brand_products', 15);
    },

    /**
     * Get all product names
     */
    async getAllProductNames() {
      return await I.grabTextFromAll(this.productName);
    },

    /**
     * Get all product prices
     */
    async getAllProductPrices() {
      return await I.grabTextFromAll(this.productPrice);
    },

    /**
     * Verify product exists in list
     */
    async verifyProductInList(productName) {
      const products = await this.getAllProductNames();
      const found = products.some(p => p.toLowerCase().includes(productName.toLowerCase()));
      I.assertTrue(found, `Product "${productName}" not found in list`);
    },

    /**
     * Add multiple products to cart
     */
    async addMultipleProductsToCart(indices) {
      for (const index of indices) {
        await this.addProductToCartByIndex(index);
        await this.clickContinueShopping();
      }
    },
  };
};
