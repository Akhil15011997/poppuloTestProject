const { I, userService, productService, brandService, searchService, cartService, userGenerator } = inject();
const testState = require('../../data/testState');

// Performance tracking
let apiStartTime = 0;

// User API steps
Given('the user generates a test user', async () => {
  testState.currentUser = userGenerator.generateUser();
});

When('the user creates user account via API', async () => {
  testState.apiResponse = await userService.createAccount(testState.currentUser);
});

When('the user deletes user if exists via API', async () => {
  // Try to delete user - ignore errors if user doesn't exist
  try {
    await userService.deleteAccount(testState.currentUser.email, testState.currentUser.password);
  } catch {
    // User doesn't exist, ignore
  }
});

When('the user deletes user account via API', async () => {
  testState.apiResponse = await userService.deleteAccount(testState.currentUser.email, testState.currentUser.password);
});

When('the user deletes the user via API', async () => {
  testState.apiResponse = await userService.deleteAccount(testState.currentUser.email, testState.currentUser.password);
});

When('the user updates user account via API', async () => {
  testState.currentUser.firstName = 'Updated';
  testState.currentUser.lastName = 'Name';
  testState.apiResponse = await userService.updateAccount(testState.currentUser);
});

When('the user gets user details via API for email {string}', async (email) => {
  testState.apiResponse = await userService.getUserDetailByEmail(email);
});

When('the user gets user details via API', async () => {
  testState.apiResponse = await userService.getUserDetailByEmail(testState.currentUser.email);
});

When('the user verifies login via API with email {string} and password {string}', async (email, password) => {
  testState.apiResponse = await userService.verifyLogin(email, password);
});

When('the user verifies login via API', async () => {
  const response = await userService.verifyLogin(testState.currentUser.email, testState.currentUser.password);
  console.log('Verify login response:', JSON.stringify(response));
  testState.apiResponse = response;
});

// Product API steps
When('the user gets all products via API', async () => {
  testState.apiResponse = await productService.getAllProducts();
});

When('the user posts to products list via API', async () => {
  testState.apiResponse = await productService.postToProductsList();
});

// Brand API steps
When('the user gets all brands via API', async () => {
  testState.apiResponse = await brandService.getAllBrands();
});

When('the user puts to brands list via API', async () => {
  testState.apiResponse = await brandService.putToBrandsList();
});

// Search API steps
When('the user searches products via API for {string}', async (searchTerm) => {
  testState.apiResponse = await searchService.searchProduct(searchTerm);
});

When('the user searches products via API without parameter', async () => {
  testState.apiResponse = await searchService.searchProductWithoutParam();
});

// Response validation steps
Then('the API response code should be {int}', async (expectedCode) => {
  I.assertEqual(testState.apiResponse.responseCode, expectedCode, 
    `Expected response code ${expectedCode} but got ${testState.apiResponse.responseCode}`);
});

Then('the API response should contain {string}', async (text) => {
  const responseStr = JSON.stringify(testState.apiResponse);
  I.assertContain(responseStr, text, `Response should contain "${text}"`);
});

Then('the API response message should be {string}', async (message) => {
  I.assertEqual(testState.apiResponse.message, message, 
    `Expected message "${message}" but got "${testState.apiResponse.message}"`);
});

Then('the products list should not be empty', async () => {
  I.assertTrue(testState.apiResponse.products && testState.apiResponse.products.length > 0, 
    'Products list should not be empty');
});

Then('the brands list should not be empty', async () => {
  I.assertTrue(testState.apiResponse.brands && testState.apiResponse.brands.length > 0, 
    'Brands list should not be empty');
});

Then('the search results should not be empty', async () => {
  I.assertTrue(testState.apiResponse.products && testState.apiResponse.products.length > 0, 
    'Search results should not be empty');
});

Then('the user details should match', async () => {
  I.assertEqual(testState.apiResponse.user.email, testState.currentUser.email, 'Email should match');
});

// Store response for later use
When('the user stores the API response', async () => {
  console.log('API Response:', JSON.stringify(testState.apiResponse, null, 2));
});

// Combined API + UI validation
Then('the API product count should be greater than {int}', async (count) => {
  const productCount = testState.apiResponse.products ? testState.apiResponse.products.length : 0;
  I.assertTrue(productCount > count, 
    `Expected more than ${count} products, got ${productCount}`);
});

Then('the API brand count should be greater than {int}', async (count) => {
  const brandCount = testState.apiResponse.brands ? testState.apiResponse.brands.length : 0;
  I.assertTrue(brandCount > count, 
    `Expected more than ${count} brands, got ${brandCount}`);
});

// ============================================
// Performance / Response Time Steps
// ============================================

When('the user starts API timer', async () => {
  apiStartTime = Date.now();
});

Then('the API response time should be less than {int} ms', async (maxMs) => {
  const responseTime = Date.now() - apiStartTime;
  console.log(`API Response Time: ${responseTime}ms`);
  I.assertTrue(responseTime < maxMs, 
    `Expected response time < ${maxMs}ms but got ${responseTime}ms`);
});

Then('the API response time should be logged', async () => {
  const responseTime = Date.now() - apiStartTime;
  console.log(`[PERF] API Response Time: ${responseTime}ms`);
  testState.lastResponseTime = responseTime;
});

// ============================================
// Cart API Steps
// ============================================

When('the user gets product {int} for cart via API', async (productId) => {
  testState.apiResponse = await cartService.getProductForCart(productId);
});

When('the user calculates cart total for products {string} via API', async (productIdsStr) => {
  const productIds = productIdsStr.split(',').map(id => parseInt(id.trim(), 10));
  testState.cartTotal = await cartService.calculateCartTotal(productIds);
});

When('the user validates products {string} are available via API', async (productIdsStr) => {
  const productIds = productIdsStr.split(',').map(id => parseInt(id.trim(), 10));
  testState.apiResponse = await cartService.validateProductsAvailable(productIds);
});

Then('the cart total should be greater than {int}', async (minTotal) => {
  I.assertTrue(testState.cartTotal > minTotal, 
    `Expected cart total > ${minTotal} but got ${testState.cartTotal}`);
});

Then('all products should be available', async () => {
  I.assertTrue(testState.apiResponse.available, 
    `Some products are not available: ${testState.apiResponse.missing}`);
});

// ============================================
// Data Integrity Steps
// ============================================

Then('each product should have required fields', async () => {
  const products = testState.apiResponse.products || [];
  const requiredFields = ['id', 'name', 'price', 'brand', 'category'];
  
  for (const product of products.slice(0, 10)) { // Check first 10 products
    for (const field of requiredFields) {
      I.assertTrue(field in product, 
        `Product ${product.id || 'unknown'} missing field: ${field}`);
    }
  }
});

Then('each brand should have required fields', async () => {
  const brands = testState.apiResponse.brands || [];
  const requiredFields = ['id', 'brand'];
  
  for (const brand of brands) {
    for (const field of requiredFields) {
      I.assertTrue(field in brand, 
        `Brand entry missing field: ${field}`);
    }
  }
});

Then('product prices should be valid format', async () => {
  const products = testState.apiResponse.products || [];
  const priceRegex = /^Rs\.\s*\d+$/;
  
  for (const product of products.slice(0, 10)) {
    I.assertTrue(priceRegex.test(product.price), 
      `Product ${product.id} has invalid price format: ${product.price}`);
  }
});

Then('the search results should contain {string}', async (searchTerm) => {
  const products = testState.apiResponse.products || [];
  const lowerSearch = searchTerm.toLowerCase();
  
  const hasMatch = products.some(p => 
    p.name.toLowerCase().includes(lowerSearch) ||
    (p.category && p.category.category && p.category.category.toLowerCase().includes(lowerSearch))
  );
  
  I.assertTrue(hasMatch, `Search results should contain products matching "${searchTerm}"`);
});

// ============================================
// Negative Testing Steps
// ============================================

When('the user attempts to get user details for non-existent email {string}', async (email) => {
  testState.apiResponse = await userService.getUserDetailByEmail(email);
});

Then('the API should return user not found', async () => {
  I.assertEqual(testState.apiResponse.responseCode, 404, 'Should return 404 for non-existent user');
});
