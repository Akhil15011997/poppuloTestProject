const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'https://automationexercise.com/api';

module.exports = {
  /**
   * Add product to cart (simulated via API)
   * Note: automationexercise.com doesn't have a direct cart API,
   * but we can validate cart-related data through product APIs
   */
  
  /**
   * Get product details for cart validation
   */
  async getProductForCart(productId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/productsList`);
      if (response.data.products) {
        return response.data.products.find(p => p.id === productId);
      }
      return null;
    } catch (error) {
      console.error('Get product for cart error:', error.message);
      throw error;
    }
  },

  /**
   * Calculate cart total from product IDs
   */
  async calculateCartTotal(productIds) {
    try {
      const response = await axios.get(`${API_BASE_URL}/productsList`);
      if (!response.data.products) return 0;

      let total = 0;
      for (const id of productIds) {
        const product = response.data.products.find(p => p.id === id);
        if (product) {
          // Parse price like "Rs. 500" to number
          const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
          total += price;
        }
      }
      return total;
    } catch (error) {
      console.error('Calculate cart total error:', error.message);
      throw error;
    }
  },

  /**
   * Validate product availability for cart
   */
  async validateProductsAvailable(productIds) {
    try {
      const response = await axios.get(`${API_BASE_URL}/productsList`);
      if (!response.data.products) return { available: false, missing: productIds };

      const availableIds = response.data.products.map(p => p.id);
      const missing = productIds.filter(id => !availableIds.includes(id));
      
      return {
        available: missing.length === 0,
        missing,
        found: productIds.filter(id => availableIds.includes(id)),
      };
    } catch (error) {
      console.error('Validate products error:', error.message);
      throw error;
    }
  },

  /**
   * Get multiple products by IDs (for cart display)
   */
  async getProductsByIds(productIds) {
    try {
      const response = await axios.get(`${API_BASE_URL}/productsList`);
      if (!response.data.products) return [];

      return response.data.products.filter(p => productIds.includes(p.id));
    } catch (error) {
      console.error('Get products by IDs error:', error.message);
      throw error;
    }
  },

  /**
   * Validate cart item structure
   */
  validateCartItem(item) {
    const requiredFields = ['id', 'name', 'price', 'brand'];
    const missing = requiredFields.filter(field => !(field in item));
    return {
      valid: missing.length === 0,
      missingFields: missing,
    };
  },

  /**
   * Format cart summary
   */
  formatCartSummary(products, quantities = {}) {
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: quantities[p.id] || 1,
      subtotal: parseFloat(p.price.replace(/[^0-9.]/g, '')) * (quantities[p.id] || 1),
    }));
  },
};
