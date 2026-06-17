const axios = require('axios');

const API_BASE_URL = 'https://automationexercise.com/api';

module.exports = {
  /**
   * Get all brands list
   * GET /brandsList
   */
  async getAllBrands() {
    try {
      const response = await axios.get(`${API_BASE_URL}/brandsList`);
      return response.data;
    } catch (error) {
      console.error('Get all brands error:', error.message);
      throw error;
    }
  },

  /**
   * PUT to brands list (should return 405 - method not supported)
   * PUT /brandsList
   */
  async putToBrandsList() {
    try {
      const response = await axios.put(`${API_BASE_URL}/brandsList`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  },

  /**
   * Get brand by name
   */
  async getBrandByName(brandName) {
    const allBrands = await this.getAllBrands();
    if (allBrands.brands) {
      return allBrands.brands.find(
        b => b.brand.toLowerCase() === brandName.toLowerCase()
      );
    }
    return null;
  },

  /**
   * Validate brands response structure
   */
  validateBrandsResponse(response) {
    if (response.responseCode !== 200) {
      throw new Error(`Expected response code 200 but got ${response.responseCode}`);
    }
    if (!response.brands || !Array.isArray(response.brands)) {
      throw new Error('Brands array not found in response');
    }
    return true;
  },

  /**
   * Get brand count
   */
  async getBrandCount() {
    const allBrands = await this.getAllBrands();
    return allBrands.brands ? allBrands.brands.length : 0;
  },

  /**
   * Get all brand names
   */
  async getAllBrandNames() {
    const allBrands = await this.getAllBrands();
    if (allBrands.brands) {
      return allBrands.brands.map(b => b.brand);
    }
    return [];
  },
};
