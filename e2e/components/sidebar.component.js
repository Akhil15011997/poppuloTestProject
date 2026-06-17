const { I } = inject();

module.exports = () => {
  return {
    // Category sidebar
    categorySidebar: locate('.left-sidebar'),
    categoryHeader: locate('h2').withText('Category'),
    
    // Categories
    womenCategory: locate('a').withAttr({ href: '#Women' }),
    menCategory: locate('a').withAttr({ href: '#Men' }),
    kidsCategory: locate('a').withAttr({ href: '#Kids' }),
    
    // Subcategories (dynamic)
    subcategoryLink: (name) => locate('a').withText(name),
    
    // Brands sidebar
    brandsSidebar: locate('.brands_products'),
    brandsHeader: locate('h2').withText('Brands'),
    brandLink: (brandName) => locate('a').withText(brandName),
    
    // Brand list items
    brandListItem: locate('.brands-name li'),

    /**
     * Verify category sidebar is visible
     */
    async verifyCategorySidebarVisible() {
      await I.waitForVisible(this.categorySidebar, 10);
      await I.waitForVisible(this.categoryHeader, 10);
    },

    /**
     * Click on Women category
     */
    async clickWomenCategory() {
      await I.clickWhenClickable(this.womenCategory);
    },

    /**
     * Click on Men category
     */
    async clickMenCategory() {
      await I.clickWhenClickable(this.menCategory);
    },

    /**
     * Click on Kids category
     */
    async clickKidsCategory() {
      await I.clickWhenClickable(this.kidsCategory);
    },

    /**
     * Select category by name
     */
    async selectCategory(categoryName) {
      const categoryLink = locate('a').withAttr({ href: `#${categoryName}` });
      await I.waitForVisible(categoryLink, 10);
      await I.clickWhenClickable(categoryLink);
      // Wait for subcategory panel to expand (no page navigation)
      const subcategoryPanel = locate(`#${categoryName}`);
      await I.waitForVisible(subcategoryPanel, 10);
    },

    /**
     * Select subcategory
     */
    async selectSubcategory(subcategoryName) {
      const link = this.subcategoryLink(subcategoryName);
      await I.waitForVisible(link, 10);
      await I.clickWhenClickable(link);
      // Wait for URL to change or products to load
      await I.waitInUrl('category_products', 15);
    },

    /**
     * Verify brands sidebar is visible
     */
    async verifyBrandsSidebarVisible() {
      await I.scrollTo(this.brandsSidebar);
      await I.waitForVisible(this.brandsSidebar, 10);
      await I.waitForVisible(this.brandsHeader, 10);
    },

    /**
     * Select brand
     */
    async selectBrand(brandName) {
      await I.scrollTo(this.brandsSidebar);
      await I.waitForVisible(this.brandLink(brandName), 10);
      await I.clickWhenClickable(this.brandLink(brandName));
      // Wait for URL to change to brand products
      await I.waitInUrl('brand_products', 15);
    },

    /**
     * Get all brand names
     */
    async getAllBrandNames() {
      await I.scrollTo(this.brandsSidebar);
      return await I.grabTextFromAll(this.brandListItem);
    },

    /**
     * Verify brand exists in sidebar
     */
    async verifyBrandExists(brandName) {
      await I.scrollTo(this.brandsSidebar);
      await I.see(brandName, this.brandsSidebar);
    },

    /**
     * Expand category (click to show subcategories)
     */
    async expandCategory(categoryName) {
      const categoryLink = locate('a').withAttr({ href: `#${categoryName}` });
      await I.waitForVisible(categoryLink, 10);
      await I.clickWhenClickable(categoryLink);
      // Wait for subcategory panel to expand
      const subcategoryPanel = locate(`#${categoryName}`);
      await I.waitForVisible(subcategoryPanel, 5);
    },

    /**
     * Navigate to category and subcategory
     */
    async navigateToSubcategory(category, subcategory) {
      await this.expandCategory(category);
      await this.selectSubcategory(subcategory);
    },
  };
};
