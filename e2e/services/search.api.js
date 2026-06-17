const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'https://automationexercise.com/api';

module.exports = {
  /**
   * Search for products
   * POST /searchProduct
   */
  async searchProduct(searchTerm) {
    const formData = new FormData();
    formData.append('search_product', searchTerm);

    try {
      const response = await axios.post(`${API_BASE_URL}/searchProduct`, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Search product error:', error.message);
      throw error;
    }
  },

  /**
   * Search without search parameter (should return 400)
   * POST /searchProduct
   */
  async searchProductWithoutParam() {
    try {
      const response = await axios.post(`${API_BASE_URL}/searchProduct`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  /**
   * Validate search response
   */
  validateSearchResponse(response) {
    if (response.responseCode !== 200) {
      throw new Error(`Expected response code 200 but got ${response.responseCode}`);
    }
    if (!response.products || !Array.isArray(response.products)) {
      throw new Error('Products array not found in search response');
    }
    return true;
  },

  /**
   * Search and filter by price range
   */
  async searchWithPriceRange(searchTerm, minPrice, maxPrice) {
    const searchResults = await this.searchProduct(searchTerm);
    if (searchResults.products) {
      return searchResults.products.filter(p => {
        const price = parseFloat(p.price.replace('Rs. ', ''));
        return price >= minPrice && price <= maxPrice;
      });
    }
    return [];
  },

  /**
   * Search and filter by brand
   */
  async searchWithBrand(searchTerm, brandName) {
    const searchResults = await this.searchProduct(searchTerm);
    if (searchResults.products) {
      return searchResults.products.filter(
        p => p.brand.toLowerCase() === brandName.toLowerCase()
      );
    }
    return [];
  },

  /**
   * Get search result count
   */
  async getSearchResultCount(searchTerm) {
    const searchResults = await this.searchProduct(searchTerm);
    return searchResults.products ? searchResults.products.length : 0;
  },
};
