const axios = require('axios');
const FormData = require('form-data');

const API_BASE_URL = 'https://automationexercise.com/api';

module.exports = {
  /**
   * Create/Register a new user account
   * POST /createAccount
   */
  async createAccount(userData) {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('title', userData.title || 'Mr');
    formData.append('birth_date', userData.birthDate || '1');
    formData.append('birth_month', userData.birthMonth || 'January');
    formData.append('birth_year', userData.birthYear || '1990');
    formData.append('firstname', userData.firstName || userData.name);
    formData.append('lastname', userData.lastName || 'Test');
    formData.append('company', userData.company || 'Test Company');
    formData.append('address1', userData.address1 || '123 Test Street');
    formData.append('address2', userData.address2 || 'Apt 1');
    formData.append('country', userData.country || 'United States');
    formData.append('zipcode', userData.zipcode || '12345');
    formData.append('state', userData.state || 'California');
    formData.append('city', userData.city || 'Los Angeles');
    formData.append('mobile_number', userData.mobileNumber || '1234567890');

    try {
      const response = await axios.post(`${API_BASE_URL}/createAccount`, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Create account error:', error.message);
      throw error;
    }
  },

  /**
   * Delete user account
   * DELETE /deleteAccount
   */
  async deleteAccount(email, password) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await axios.delete(`${API_BASE_URL}/deleteAccount`, {
        data: formData,
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error.message);
      throw error;
    }
  },

  /**
   * Update user account
   * PUT /updateAccount
   */
  async updateAccount(userData) {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('title', userData.title || 'Mr');
    formData.append('birth_date', userData.birthDate || '1');
    formData.append('birth_month', userData.birthMonth || 'January');
    formData.append('birth_year', userData.birthYear || '1990');
    formData.append('firstname', userData.firstName || userData.name);
    formData.append('lastname', userData.lastName || 'Test');
    formData.append('company', userData.company || 'Test Company');
    formData.append('address1', userData.address1 || '123 Test Street');
    formData.append('address2', userData.address2 || 'Apt 1');
    formData.append('country', userData.country || 'United States');
    formData.append('zipcode', userData.zipcode || '12345');
    formData.append('state', userData.state || 'California');
    formData.append('city', userData.city || 'Los Angeles');
    formData.append('mobile_number', userData.mobileNumber || '1234567890');

    try {
      const response = await axios.put(`${API_BASE_URL}/updateAccount`, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Update account error:', error.message);
      throw error;
    }
  },

  /**
   * Get user account detail by email
   * GET /getUserDetailByEmail
   */
  async getUserDetailByEmail(email) {
    try {
      const response = await axios.get(`${API_BASE_URL}/getUserDetailByEmail`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      console.error('Get user detail error:', error.message);
      throw error;
    }
  },

  /**
   * Verify user login credentials
   * POST /verifyLogin
   */
  async verifyLogin(email, password) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await axios.post(`${API_BASE_URL}/verifyLogin`, formData, {
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Verify login error:', error.message);
      throw error;
    }
  },

  /**
   * Generate unique test user data
   */
  generateTestUser(prefix = 'testuser') {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    return {
      name: `${prefix}_${timestamp}`,
      email: `${prefix}_${timestamp}_${randomStr}@test.com`,
      password: 'TestPassword123!',
      title: 'Mr',
      firstName: 'Test',
      lastName: 'User',
      birthDate: '15',
      birthMonth: 'June',
      birthYear: '1990',
      company: 'Test Corp',
      address1: '123 Test Lane',
      address2: 'Suite 100',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      zipcode: '94102',
      mobileNumber: '5551234567',
    };
  },

  /**
   * Validate API response
   */
  validateResponse(response, expectedCode = 200) {
    if (response.responseCode !== expectedCode) {
      throw new Error(
        `Expected response code ${expectedCode} but got ${response.responseCode}: ${response.message}`
      );
    }
    return true;
  },
};
