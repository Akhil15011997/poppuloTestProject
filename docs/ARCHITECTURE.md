# Test Framework Architecture

## Overview

This document provides visual representations of the test automation framework architecture, component relationships, and execution flows.

The architecture shown here describes the **test framework**, not the verified internal architecture of the target system. The target website (`automationexercise.com`) is treated as a black-box dependency.

---

## 1. High-Level Architecture

### 1.1 Scope Note: External System Topology

- Internal implementation details of the target system are unknown (for example, monolith vs microservices).
- The framework interacts through public UI and API surfaces only.
- Any monolith/microservices references in planning are capability guidance, not assertions about AutomationExercise internals.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TEST AUTOMATION FRAMEWORK                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         TEST EXECUTION LAYER                         │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │  Gherkin  │  │   Step    │  │   Test    │  │  Hooks &  │        │   │
│  │  │ Features  │──│Definitions│──│   State   │──│  Plugins  │        │   │
│  │  │ (.feature)│  │ (.steps)  │  │  Manager  │  │           │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         ABSTRACTION LAYER                            │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │   Page    │  │ Component │  │    API    │  │  Helper   │        │   │
│  │  │  Objects  │  │  Objects  │  │ Services  │  │  Classes  │        │   │
│  │  │ (pages/)  │  │(components│  │(services/)│  │(helpers/) │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRAMEWORK LAYER                              │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │ CodeceptJS│  │ Playwright│  │   Axios   │  │   Chai    │        │   │
│  │  │  (BDD)    │  │ (Browser) │  │  (HTTP)   │  │(Assertions│        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         TARGET SYSTEMS                               │   │
│  │  ┌─────────────────────────┐  ┌─────────────────────────┐          │   │
│  │  │      Web Application    │  │       REST APIs         │          │   │
│  │  │  (automationexercise)   │  │    (/api/endpoints)     │          │   │
│  │  └─────────────────────────┘  └─────────────────────────┘          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
e2e/
├── tests/
│   ├── features/           # Gherkin feature files
│   │   ├── api/           # API test scenarios
│   │   ├── auth/          # Authentication tests
│   │   ├── cart/          # Shopping cart tests
│   │   ├── checkout/      # Checkout flow tests
│   │   ├── products/      # Product browsing tests
│   │   ├── accessibility/ # A11y tests
│   │   ├── mobile/        # Mobile-specific tests
│   │   └── mcp/           # MCP integration tests
│   │
│   └── steps/             # Step definitions
│       ├── common.steps.js
│       ├── api.steps.js
│       ├── auth.steps.js
│       ├── cart.steps.js
│       ├── product.steps.js
│       └── accessibility.steps.js
│
├── pages/                  # Page Object Models
│   ├── auth/
│   │   ├── login.page.js
│   │   └── register.page.js
│   ├── products/
│   │   ├── products.page.js
│   │   └── productDetail.page.js
│   ├── cart/
│   │   └── cart.page.js
│   ├── checkout/
│   │   ├── checkout.page.js
│   │   └── payment.page.js
│   └── home/
│       └── home.page.js
│
├── components/             # Reusable UI components
│   ├── navbar.component.js
│   ├── footer.component.js
│   ├── modal.component.js
│   └── sidebar.component.js
│
├── services/               # API service abstractions
│   ├── user.api.js
│   ├── product.api.js
│   ├── brand.api.js
│   ├── search.api.js
│   ├── cart.api.js
│   └── email.api.js        # Mailgun email service
│
├── helpers/                # Custom helper classes
│   ├── playwrightHelper.js     # Ad blocking, force click, network capture
│   ├── accessibilityHelper.js  # WCAG/EAA/ADA compliance testing
│   ├── actorCapabilities.js    # Click helpers, ad dismissal
│   └── perplexityHelper.js     # AI-powered test analysis
│
├── data/                   # Test data management
│   ├── testData.js
│   ├── testData.local.js
│   ├── testData.staging.js
│   ├── testData.prod.js
│   ├── testState.js
│   └── userGenerator.js
│
├── config/                 # Configuration files
│   ├── aggregate.js
│   ├── getHelpers.js
│   ├── getPlugins.js
│   ├── pageIncludes.js
│   ├── bootstrap.js      # Pre-test: cleans old reports
│   └── teardown.js       # Post-test: generates reports
│
├── output/                 # Test outputs (gitignored)
│   ├── allure-results/
│   ├── screenshots/
│   └── traces/
│
├── ACCESSIBILITY_REPORT.md # Auto-generated accessibility report (@accessibility tests)
├── codecept.conf.js        # Main configuration
├── Dockerfile              # Container definition
├── docker-compose.yml      # Container orchestration
└── package.json            # Dependencies
```

---

## 3. Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TEST EXECUTION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐                                                                │
│  │  START  │                                                                │
│  └────┬────┘                                                                │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────────┐                                                    │
│  │  Parse PROFILE      │  PROFILE=local:@smoke:chromeHeadless:playwright   │
│  │  Environment        │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────┐     ┌─────────────────────┐                       │
│  │  Load Configuration │──── │  aggregate.js       │                       │
│  │  (codecept.conf.js) │     │  - getHelpers()     │                       │
│  └──────────┬──────────┘     │  - getPlugins()     │                       │
│             │                 │  - pageIncludes     │                       │
│             │                 └─────────────────────┘                       │
│             ▼                                                                │
│  ┌─────────────────────┐                                                    │
│  │  Bootstrap Hook     │  Initialize test environment                       │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────┐     ┌─────────────────────┐                       │
│  │  Filter Features    │──── │  Match @tags        │                       │
│  │  by Tags            │     │  (e.g., @smoke)     │                       │
│  └──────────┬──────────┘     └─────────────────────┘                       │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     FOR EACH SCENARIO                                │   │
│  │  ┌─────────────────┐                                                 │   │
│  │  │  Before Hook    │  Reset state, setup data                        │   │
│  │  └────────┬────────┘                                                 │   │
│  │           │                                                           │   │
│  │           ▼                                                           │   │
│  │  ┌─────────────────┐     ┌─────────────────┐                         │   │
│  │  │  Execute Steps  │──── │  Step Definition│                         │   │
│  │  │  (Given/When/   │     │  ────────────── │                         │   │
│  │  │   Then)         │     │  Page Objects   │                         │   │
│  │  └────────┬────────┘     │  API Services   │                         │   │
│  │           │               │  Helpers        │                         │   │
│  │           │               └─────────────────┘                         │   │
│  │           ▼                                                           │   │
│  │  ┌─────────────────┐                                                 │   │
│  │  │  After Hook     │  Cleanup, screenshots on fail                   │   │
│  │  └────────┬────────┘                                                 │   │
│  │           │                                                           │   │
│  └───────────┼──────────────────────────────────────────────────────────┘   │
│              │                                                               │
│              ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  Teardown Hook      │  Close browsers, generate reports                  │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────────────────┐     ┌─────────────────────┐                       │
│  │  Generate Reports   │──── │  - Allure HTML      │                       │
│  │                     │     │  - JUnit XML        │                       │
│  │                     │     │  - Screenshots      │                       │
│  └──────────┬──────────┘     └─────────────────────┘                       │
│             │                                                                │
│             ▼                                                                │
│  ┌─────────┐                                                                │
│  │   END   │                                                                │
│  └─────────┘                                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Page Object Model Pattern

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAGE OBJECT MODEL                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Step Definition                               │   │
│  │                                                                       │   │
│  │  When('the user logs in with {string} and {string}', (email, pwd) => │   │
│  │    loginPage.login(email, pwd);                                      │   │
│  │  });                                                                  │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 │ calls                                      │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Page Object                                  │   │
│  │                                                                       │   │
│  │  // login.page.js                                                    │   │
│  │  module.exports = {                                                  │   │
│  │    // Locators (private)                                             │   │
│  │    locators: {                                                       │   │
│  │      emailInput: '[data-qa="login-email"]',                         │   │
│  │      passwordInput: '[data-qa="login-password"]',                   │   │
│  │      loginButton: '[data-qa="login-button"]',                       │   │
│  │    },                                                                │   │
│  │                                                                       │   │
│  │    // Actions (public)                                               │   │
│  │    async login(email, password) {                                    │   │
│  │      await I.fillField(this.locators.emailInput, email);            │   │
│  │      await I.fillField(this.locators.passwordInput, password);      │   │
│  │      await I.click(this.locators.loginButton);                      │   │
│  │    },                                                                │   │
│  │                                                                       │   │
│  │    // Verifications (public)                                         │   │
│  │    async verifyLoginError() {                                        │   │
│  │      await I.see('Your email or password is incorrect!');           │   │
│  │    }                                                                 │   │
│  │  };                                                                  │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 │ uses                                       │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CodeceptJS Actor (I)                            │   │
│  │                                                                       │   │
│  │  I.fillField()  I.click()  I.see()  I.waitForElement()              │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 │ delegates to                               │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Playwright Helper                               │   │
│  │                                                                       │   │
│  │  page.fill()  page.click()  page.locator()  page.waitFor()          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Testing Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API TESTING ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Feature File (Gherkin)                           │   │
│  │                                                                       │   │
│  │  @api @apiOnly                                                       │   │
│  │  Scenario: Get All Products                                          │   │
│  │    When the user gets all products via API                           │   │
│  │    Then the API response code should be 200                          │   │
│  │    And the products list should not be empty                         │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Step Definition                                  │   │
│  │                                                                       │   │
│  │  When('the user gets all products via API', async () => {           │   │
│  │    testState.apiResponse = await productService.getAllProducts();    │   │
│  │  });                                                                  │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     API Service                                      │   │
│  │                                                                       │   │
│  │  // product.api.js                                                   │   │
│  │  async getAllProducts() {                                            │   │
│  │    const response = await axios.get(`${API_BASE_URL}/productsList`); │   │
│  │    return response.data;                                             │   │
│  │  }                                                                   │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     HTTP Client (Axios)                              │   │
│  │                                                                       │   │
│  │  GET https://automationexercise.com/api/productsList                 │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Target API                                       │   │
│  │                                                                       │   │
│  │  Response: { responseCode: 200, products: [...] }                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  KEY BENEFIT: API-only mode (apiOnly browser config)                        │
│  • No browser launched                                                       │
│  • ~10x faster execution                                                     │
│  • Ideal for backend validation                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                REPOSITORY-ACCURATE CI/CD WORKFLOW TOPOLOGY                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Triggers                                                                   │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────────┐  │
│  │ pull_request/push  │  │ push main/develop  │  │ schedule/workflow    │  │
│  │ (main/master/dev)  │  │ + Dockerfile/pnpm  │  │ dispatch             │  │
│  └─────────┬──────────┘  └─────────┬──────────┘  └─────────┬────────────┘  │
│            │                       │                        │               │
│            ▼                       ▼                        ▼               │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────────┐  │
│  │ pr-checks.yml      │  │ docker-build.yml   │  │ e2e-scheduled.yml    │  │
│  │ lint + syntax      │  │ build/push GHCR    │  │ smoke/reg/full/api   │  │
│  │ + API smoke        │  │ e2e image          │  │ via matrix suites    │  │
│  └────────────────────┘  └────────────────────┘  └──────────────────────┘  │
│                                                                             │
│  Push to main (e2e/workflow paths) or manual dispatch                       │
│            │                                                                 │
│            ▼                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ e2e-all.yml                                                           │  │
│  │ - determine suites: @auth @products @cart @api                       │  │
│  │ - run matrix suites via .github/actions/run-e2e-tests                │  │
│  │ - default mode: Docker (uses GHCR image)                             │  │
│  │ - aggregate artifacts + publish Allure                                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Manual/sync reusable run path                                              │
│            │                                                                 │
│            ▼                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ e2e-suite.yml                                                         │  │
│  │ - single suite with env/suite/browser inputs                          │  │
│  │ - workflow_call entry for orchestration                               │  │
│  │ - uploads artifacts + attempts Allure publish                         │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Shared outputs                                                             │
│  ┌───────────────────────────────┐  ┌───────────────────────────────────┐  │
│  │ GitHub Artifacts              │  │ GitHub Pages (Allure report)      │  │
│  │ e2e/output, allure-results    │  │ gh-pages publish path             │  │
│  └───────────────────────────────┘  └───────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Test Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TEST DATA FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     STATIC DATA SOURCES                              │   │
│  │                                                                       │   │
│  │  testData.js ──────────────┐                                         │   │
│  │  (base config)             │                                         │   │
│  │                            ▼                                         │   │
│  │  testData.local.js ─── ┌─────────────────┐                         │   │
│  │  testData.staging.js ── │  Merged Config  │                         │   │
│  │  testData.prod.js ───── │  (per env)      │                         │   │
│  │                          └────────┬────────┘                         │   │
│  └───────────────────────────────────┼─────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     DYNAMIC DATA GENERATION                          │   │
│  │                                                                       │   │
│  │  userGenerator.js                                                    │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  generateUser() {                                            │    │   │
│  │  │    return {                                                  │    │   │
│  │  │      email: `user_${timestamp}_${random}@test.com`,         │    │   │
│  │  │      name: `TestUser_${timestamp}`,                         │    │   │
│  │  │      password: 'SecurePass123!'                             │    │   │
│  │  │    };                                                        │    │   │
│  │  │  }                                                           │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────┬─────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     TEST STATE MANAGEMENT                            │   │
│  │                                                                       │   │
│  │  testState.js (Singleton)                                            │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  state = {                                                   │    │   │
│  │  │    currentUser: null,      // Active test user              │    │   │
│  │  │    apiResponse: null,      // Last API response             │    │   │
│  │  │    cartTotal: null,        // Calculated cart value         │    │   │
│  │  │    lastResponseTime: null  // Performance metric            │    │   │
│  │  │  }                                                           │    │   │
│  │  │                                                              │    │   │
│  │  │  reset() { /* Clear all state */ }                          │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └───────────────────────────────────┬─────────────────────────────────┘   │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     DATA LIFECYCLE                                   │   │
│  │                                                                       │   │
│  │  Before Scenario ── Generate/Load Data ── Execute Test            │   │
│  │                                                   │                   │   │
│  │                                                   ▼                   │   │
│  │                      After Scenario ── Cleanup/Reset State          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. API-Only Mode (No Browser)

When running API tests with `apiOnly` or `api` browser profile, the framework **completely skips browser initialization**.

### Configuration (e2e/config/getHelpers.js)

```javascript
function isApiOnlyMode(browser) {
  return browser === 'apiOnly' || browser === 'api';
}

// When API-only mode is detected:
if (isApiOnlyMode(browser)) {
  return {
    REST: { endpoint: envConfig.apiBaseUrl, timeout: 30000 },
    ChaiWrapper: { require: 'codeceptjs-chai' },
  };
  // Note: Playwright helper is NOT included
}
```

### Usage

```bash
# Run API tests without browser
pnpm e2e local:@api:apiOnly

# Run API-only tagged tests
pnpm e2e local:@apiOnly:apiOnly
```

### Benefits

| Aspect | With Browser | API-Only Mode |
|--------|--------------|---------------|
| **Startup Time** | ~3-5 seconds | ~0.5 seconds |
| **Memory Usage** | ~200-500 MB | ~50 MB |
| **Execution Speed** | Baseline | **~10x faster** |
| **CI Resources** | Higher | Lower |

> **Key Point:** The `@apiOnly` tag on feature files combined with `apiOnly` browser profile ensures **zero browser overhead** for pure API testing.

---

## 10. Browser Session Management

### Configuration (e2e/config/getHelpers.js)

```javascript
Playwright: {
  restart: 'session',      // Keep same browser instance across scenarios
  keepBrowserState: true,  // Preserve browser state between tests
  keepCookies: false,      // Clear cookies between scenarios (for isolation)
  manualStart: false,      // Auto-start browser when needed
}
```

### Behavior Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BROWSER SESSION MANAGEMENT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Configuration: restart: 'session' (getHelpers.js)                          │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     SESSION MODE                                     │   │
│  │                                                                       │   │
│  │  Test Suite Start                                                    │   │
│  │       │                                                               │   │
│  │       ▼                                                               │   │
│  │  ┌─────────────────┐                                                 │   │
│  │  │  Launch Browser │   ── Single browser instance                    │   │
│  │  └────────┬────────┘                                                 │   │
│  │           │                                                           │   │
│  │           ▼                                                           │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Scenario 1                                                  │    │   │
│  │  │  • New browser context                                       │    │   │
│  │  │  • Fresh cookies/storage                                     │    │   │
│  │  │  • Execute test                                              │    │   │
│  │  │  • Context closed                                            │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │           │                                                           │   │
│  │           ▼  (Browser stays open)                                    │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Scenario 2                                                  │    │   │
│  │  │  • New browser context                                       │    │   │
│  │  │  • Fresh cookies/storage                                     │    │   │
│  │  │  • Execute test                                              │    │   │
│  │  │  • Context closed                                            │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │           │                                                           │   │
│  │           ▼                                                           │   │
│  │  ┌─────────────────┐                                                 │   │
│  │  │  Close Browser  │   ── Only at suite end                          │   │
│  │  └─────────────────┘                                                 │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  BENEFITS:                                                                   │
│  • Faster execution (no browser restart per test)                           │
│  • Test isolation via contexts (clean state)                                │
│  • Reduced resource usage                                                    │
│                                                                              │
│  MANUAL CLEANUP STEPS (when needed):                                        │
│  • When('the user clears all cookies')                                      │
│  • When('the user clears session storage')                                  │
│  • When('the user clears local storage')                                    │
│  • When('the user resets browser state')                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Settings Explained

| Setting | Value | Effect |
|---------|-------|--------|
| `timeout` | `10000` | 10 second timeout for actions |
| `waitForTimeout` | `10000` | 10 second wait timeout |
| `restart` | `'session'` | Browser stays open, only context resets between scenarios |
| `keepBrowserState` | `true` | Preserves localStorage/sessionStorage between tests |
| `keepCookies` | `false` | Clears cookies for test isolation |
| `manualStart` | `false` | Browser auto-starts when first needed |

> **Result:** Browser launches **once per test run**, not per scenario → significantly faster execution.

### Fresh Session Step

For tests requiring complete isolation (e.g., testing unauthenticated flows):

```gherkin
Given a new browser session is started
```

This step clears all cookies, localStorage, and sessionStorage.

### Ad Blocking

The framework includes built-in ad blocking to prevent test failures:

- **Network-level blocking** (`playwrightHelper.js`): Intercepts and blocks ad network requests
- **DOM cleanup** (`actorCapabilities.js`): Removes ad iframes and overlay elements
- **Force click fallback**: Uses JavaScript click when normal click is blocked by overlays

### Network Traffic Capture

The `playwrightHelper.js` also provides network traffic analysis:

- **`startNetworkCapture()`**: Begin capturing all requests/responses
- **`getNetworkRequests(filter)`**: Get requests by type (all, api, xhr, fetch, etc.)
- **`getNetworkResponses(filter)`**: Get responses (all, api, errors, slow)
- **`getNetworkSummary()`**: Get summary for AI analysis

Used with AI analysis to detect performance issues, failed API calls, and network errors during test execution.

---

## 11. Reporting Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REPORTING ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     TEST EXECUTION                                   │   │
│  │                                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │   Test 1    │  │   Test 2    │  │   Test N    │                  │   │
│  │  │  (Pass)     │  │  (Fail)     │  │  (Skip)     │                  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │   │
│  │         │                │                │                          │   │
│  │         └────────────────┼────────────────┘                          │   │
│  │                          │                                            │   │
│  └──────────────────────────┼──────────────────────────────────────────┘   │
│                             │                                                │
│                             ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     REPORT GENERATION                                │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Allure Results (./output/allure-results/)                   │    │   │
│  │  │  • Test steps with timing                                    │    │   │
│  │  │  • Screenshots on failure                                    │    │   │
│  │  │  • Environment info                                          │    │   │
│  │  │  • Categories & severity                                     │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  JUnit XML (./output/result-[hash].xml)                      │    │   │
│  │  │  • CI/CD integration                                         │    │   │
│  │  │  • Test counts & durations                                   │    │   │
│  │  │  • Failure messages                                          │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  Screenshots & Traces                                        │    │   │
│  │  │  • Full page screenshots on failure                          │    │   │
│  │  │  • Playwright traces for debugging                           │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  VIEWING REPORTS:                                                            │
│                                                                              │
│  # Generate Allure HTML report                                               │
│  npx allure generate ./output/allure-results --clean -o ./output/allure     │
│                                                                              │
│  # Open report in browser                                                    │
│  npx allure open ./output/allure                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Automatic Report Generation Flow

Reports are **automatically generated** after each test run:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Bootstrap     │──── │   Test Run      │──── │  allure-results │──── │    Teardown     │
│  (clean old)    │     │   (codeceptjs)  │     │  (JSON files)   │     │ (generate HTML) │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                                                       │
        │  Deletes:                                                             │  Creates:
        │  - output/allure-results/                                             │  - allure-report/
        │  - allure-report/                                                     │
        ▼                                                                       ▼
  Fresh start each run                                              Console shows view command
```

### Bootstrap & Teardown (Separate Files)

**`e2e/config/bootstrap.js`** - Runs before test execution:

```javascript
async function bootstrap(profile) {
  console.log(`Profile: ${profile}`);
  
  // Clean up previous report directories for fresh run
  if (fs.existsSync(allureResultsDir)) {
    fs.rmSync(allureResultsDir, { recursive: true, force: true });
  }
  if (fs.existsSync(allureReportDir)) {
    fs.rmSync(allureReportDir, { recursive: true, force: true });
  }
}
```

**`e2e/config/teardown.js`** - Runs after test execution:

```javascript
async function teardown() {
  execSync('npx allure generate ./output/allure-results -o ./allure-report --clean');
  console.log(' VIEW TEST REPORT: pnpm run allure:open');
}
```

**`e2e/codecept.conf.js`** - Configuration:

```javascript
const { bootstrap } = require('./config/bootstrap');
const { teardown } = require('./config/teardown');

exports.config = {
  bootstrap: () => bootstrap(profile),
  teardown,
  // ... other config
};
```

### Console Output After Test Run

```
============================================================
 VIEW TEST REPORT:
   pnpm run allure:open

 REGENERATE & VIEW REPORT:
   pnpm run allure:report

 ACCESSIBILITY REPORT (when running @accessibility tests):
    /path/to/e2e/ACCESSIBILITY_REPORT.md
   Open with: open ACCESSIBILITY_REPORT.md
============================================================
```

### Accessibility Report (ACCESSIBILITY_REPORT.md)

When running tests with the `@accessibility` tag, a detailed Markdown report is automatically generated:

```
e2e/ACCESSIBILITY_REPORT.md
```

**Features:**

- Critical, Serious, Moderate, Minor violation indicators
- WCAG references with Deque University remediation links
- Affected elements with CSS selectors
- Summary tables per page/scan type

### Commands

```bash
# Open the auto-generated report
pnpm run allure:open

# Serve with auto-refresh (for live viewing)
pnpm run allure:serve

# Manually regenerate (if needed)
pnpm run allure:generate
```

### Plugin Configuration (e2e/config/getPlugins.js)

```javascript
allure: {
  enabled: true,
  require: 'allure-codeceptjs',
  outputDir: './output/allure-results',
  enableScreenshotDiffPlugin: true,
}
```

> **Note:** Reports are automatically generated in teardown. No manual step needed after test runs.

---

## 12. Multi-Team Scaling Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MULTI-TEAM SCALING MODEL                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     SHARED FRAMEWORK (NPM Package)                   │   │
│  │                                                                       │   │
│  │  @company/test-framework                                             │   │
│  │  ├── helpers/          # Common helpers                              │   │
│  │  ├── components/       # Shared UI components                        │   │
│  │  ├── config/           # Base configuration                          │   │
│  │  ├── utils/            # Utilities                                   │   │
│  │  └── ci-templates/     # GitHub Actions templates                    │   │
│  │                                                                       │   │
│  └──────────────────────────────┬──────────────────────────────────────┘   │
│                                 │                                            │
│            ┌────────────────────┼────────────────────┐                      │
│            │                    │                    │                      │
│            ▼                    ▼                    ▼                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │    TEAM A       │  │    TEAM B       │  │    TEAM C       │            │
│  │  (Auth Domain)  │  │(Products Domain)│  │(Checkout Domain)│            │
│  │                 │  │                 │  │                 │            │
│  │  tests/         │  │  tests/         │  │  tests/         │            │
│  │  ├── auth/      │  │  ├── products/  │  │  ├── checkout/  │            │
│  │  └── user/      │  │  └── search/    │  │  └── payment/   │            │
│  │                 │  │                 │  │                 │            │
│  │  pages/         │  │  pages/         │  │  pages/         │            │
│  │  └── auth/      │  │  └── products/  │  │  └── checkout/  │            │
│  │                 │  │                 │  │                 │            │
│  │  package.json   │  │  package.json   │  │  package.json   │            │
│  │  (depends on    │  │  (depends on    │  │  (depends on    │            │
│  │   framework)    │  │   framework)    │  │   framework)    │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│            │                    │                    │                      │
│            └────────────────────┼────────────────────┘                      │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     CENTRALIZED CI/CD                                │   │
│  │                                                                       │   │
│  │  • Nightly full regression across all teams                          │   │
│  │  • Per-team PR validation                                            │   │
│  │  • Shared reporting dashboard                                        │   │
│  │  • Cross-team integration tests                                      │   │
│  │                                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*Document Version: 1.1*  
*Last Updated: June 2026*
