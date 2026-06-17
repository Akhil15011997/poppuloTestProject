# 🧪 Prompt: Add New E2E Test

Use this prompt with any AI assistant (GitHub Copilot, Cursor, Claude, ChatGPT, etc.) to create tests that follow this framework's patterns.

---

## Quick Start

Copy and paste this prompt, then describe what you want to test:

```
I'm working with a CodeceptJS + Playwright + Gherkin E2E test framework.

Please help me create a new test for: [DESCRIBE YOUR TEST HERE]

Follow these framework conventions:
- Page Objects: e2e/pages/<domain>/<name>.page.js
- Step Definitions: e2e/tests/steps/<domain>.steps.js  
- Feature Files: e2e/tests/features/<domain>/<name>.feature
- API Services: e2e/services/<name>.api.js
- Use data-qa attributes for locators when available
- All async functions must use await
- Use testState (e2e/data/testState.js) to share data between steps
- Register new pages/services in e2e/config/pageIncludes.js

Test types and tags:
- UI tests: @ui tag
- API tests: @api @apiOnly tags
- Combined API+UI: @api-ui tag
- Accessibility: @accessibility tag

Please create the necessary files.
```

---

## Detailed Prompts by Test Type

### UI Test Prompt

```
Create a UI test for [YOUR FEATURE] in this CodeceptJS + Playwright framework.

I need:
1. Page Object at e2e/pages/[domain]/[name].page.js with:
   - Locators using locate() with data-qa attributes
   - Navigation method
   - Action methods
   - Verification methods

2. Step definitions at e2e/tests/steps/[domain].steps.js with:
   - Given steps for navigation
   - When steps for actions
   - Then steps for assertions
   - Use testState for sharing data

3. Feature file at e2e/tests/features/[domain]/[name].feature with:
   - @ui tag and domain tag
   - Gherkin scenarios with Given/When/Then

Example page object pattern:
const { I } = inject();
module.exports = () => ({
  myElement: locate('selector').withAttr({ 'data-qa': 'element-name' }),
  async navigateToPage() {
    await I.amOnPage('/path');
    await I.waitForVisible(this.myElement, 10);
  },
});
```

### API Test Prompt

```
Create an API test for [YOUR ENDPOINT] in this CodeceptJS framework.

I need:
1. API Service at e2e/services/[name].api.js with:
   - axios for HTTP requests
   - FormData for POST requests (this API uses form-data)
   - Base URL: https://automationexercise.com/api
   - Error handling with try/catch
   - Response validation method

2. Step definitions with:
   - Steps that call the service methods
   - Store responses in testState.apiResponse

3. Feature file with @api @apiOnly tags

Example API service pattern:
const axios = require('axios');
const FormData = require('form-data');
const API_BASE_URL = 'https://automationexercise.com/api';

module.exports = {
  async getEndpoint() {
    const response = await axios.get(`${API_BASE_URL}/endpoint`);
    return response.data;
  },
};
```

### Combined API+UI Test Prompt

```
Create a combined API+UI test that:
1. Sets up data via API (fast)
2. Validates via UI (user-facing)
3. Cleans up via API

Use @api-ui tag and follow this pattern:
- API setup steps first
- UI validation steps
- API cleanup steps

Example:
Scenario: Create user via API, verify login via UI
  # API Setup
  Given the user generates a test user
  When the user creates user account via API
  Then the API response code should be 201
  
  # UI Validation  
  When the user navigates to login page
  And the user logs in with generated credentials
  Then the user should be logged in
  
  # API Cleanup
  When the user deletes user account via API
```

---

## Framework Reference

### File Structure
```
e2e/
├── pages/           # Page Objects
│   ├── auth/        # login.page.js, register.page.js
│   ├── products/    # products.page.js
│   └── cart/        # cart.page.js
├── services/        # API Services
│   ├── user.api.js
│   └── product.api.js
├── tests/
│   ├── features/    # Gherkin .feature files
│   └── steps/       # Step definitions
├── data/
│   ├── testState.js # Shared state between steps
│   └── testData.js  # Test data config
└── config/
    └── pageIncludes.js  # Register pages/services
```

### Common Step Patterns
```gherkin
# Navigation
Given the user is on the home page
Given the user is on the login page
Given the user navigates to "/path"

# Authentication
When the user logs in with email "x" and password "y"
Then the user should be logged in as "username"

# API
When the user gets all products via API
Then the API response code should be 200
Then the API response should contain "field"

# Visibility
Then the user should see "text"
Then the user should see element "locator"
```

### Tags Reference
| Tag | Purpose |
|-----|---------|
| `@ui` | Browser-based UI tests |
| `@api` | API tests |
| `@apiOnly` | API-only (no browser) |
| `@api-ui` | Combined API+UI |
| `@smoke` | Quick sanity tests |
| `@regression` | Full regression |
| `@accessibility` | A11y tests |
| `@playwrightMCP` | MCP browser tests |

---

## Example: Complete Test Creation

**Request:** "Create a test for adding a product to cart"

**AI should create:**

1. `e2e/tests/features/cart/addToCart.feature`
2. `e2e/tests/steps/cart.steps.js` (or add to existing)
3. Update `e2e/config/pageIncludes.js` if new page needed

---

## Tips for Better Results

1. **Be specific**: "Test adding Blue Top product to cart" > "Test cart"
2. **Mention existing files**: "Similar to login.page.js pattern"
3. **Specify test type**: "UI test" or "API test" or "combined"
4. **Include edge cases**: "Include negative test for empty cart"
