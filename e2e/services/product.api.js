const axios = require('axios');

const API_BASE_URL = 'https://automationexercise.com/api';

module.exports = {
  /**
   * Get all products list
   * GET /productsList
   */
  async getAllProducts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/productsList`);
      return response.data;
    } catch (error) {
      console.error('Get all products error:', error.message);
      throw error;
    }
  },

  /**
   * POST to products list (should return 405 - method not supported)
   * POST /productsList
   */
  async postToProductsList() {
    try {
      const response = await axios.post(`${API_BASE_URL}/productsList`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  /**
   * Get product by ID from products list
   */
  async getProductById(productId) {
    const allProducts = await this.getAllProducts();
    if (allProducts.products) {
      return allProducts.products.find(p => p.id === productId);
    }
    return null;
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryName) {
    const allProducts = await this.getAllProducts();
    if (allProducts.products) {
      return allProducts.products.filter(
        p => p.category && p.category.category === categoryName
      );
    }
    return [];
  },

  /**
   * Get products by brand
   */
  async getProductsByBrand(brandName) {
    const allProducts = await this.getAllProducts();
    if (allProducts.products) {
      return allProducts.products.filter(p => p.brand === brandName);
    }
    return [];
  },

  /**
   * Validate products response structure
   */
  validateProductsResponse(response) {
    if (response.responseCode !== 200) {
      throw new Error(`Expected response code 200 but got ${response.responseCode}`);
    }
    if (!response.products || !Array.isArray(response.products)) {
      throw new Error('Products array not found in response');
    }
    return true;
  },

  /**
   * Validate single product structure
   */
  validateProductStructure(product) {
    const requiredFields = ['id', 'name', 'price', 'brand', 'category'];
    for (const field of requiredFields) {
      if (!(field in product)) {
        throw new Error(`Product missing required field: ${field}`);
      }
    }
    return true;
  },

  /**
   * Get product count
   */
  async getProductCount() {
    const allProducts = await this.getAllProducts();
    return allProducts.products ? allProducts.products.length : 0;
  },

  /**
   * Get unique brands from products
   */
  async getUniqueBrands() {
    const allProducts = await this.getAllProducts();
    if (allProducts.products) {
      const brands = allProducts.products.map(p => p.brand);
      return [...new Set(brands)];
    }
    return [];
  },

  /**
   * Get unique categories from products
   */
  async getUniqueCategories() {
    const allProducts = await this.getAllProducts();
    if (allProducts.products) {
      const categories = allProducts.products
        .filter(p => p.category)
        .map(p => p.category.category);
      return [...new Set(categories)];
    }
    return [];
  },
};
