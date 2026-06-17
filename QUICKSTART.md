# 🚀 Quickstart Guide

Get up and running with the E2E test framework in under 5 minutes.

---

## Prerequisites

```
Node.js >= 22  |  pnpm >= 9.1.0
```

---

## ⚡ Setup (2 minutes)

```bash
# 1. Navigate to e2e directory
cd e2e

# 2. Install dependencies
pnpm install

# 3. Install browsers
pnpm exec playwright install --with-deps
```

---

## 🎯 Run Your First Test

```bash
# Run smoke tests (headless)
pnpm e2e local:@smoke:chromeHeadless

# Run with visible browser
pnpm e2e local:@smoke:chrome
```

---

## 📋 Command Format

```
pnpm e2e <environment>:<tag>:<browser>
         └─────┬─────┘ └─┬─┘ └───┬───┘
               │         │       │
               │         │       └── Browser profile
               │         └────────── Test suite tag
               └──────────────────── Target environment
```

### Examples

| Command | What it does |
|---------|--------------|
| `pnpm e2e local:@smoke:chromeHeadless` | Smoke tests, headless |
| `pnpm e2e local:@auth:chrome` | Auth tests, visible browser |
| `pnpm e2e local:@api:chromeHeadless` | API tests |
| `pnpm e2e local:@mobile:mobileChromeHeadless` | Mobile tests on Pixel 5 |
| `pnpm e2e:parallel local:@smoke:chromeHeadless 4` | Parallel with 4 workers |

---

## 🏷️ Available Test Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Quick validation tests |
| `@auth` | Login & registration |
| `@products` | Product browsing & search |
| `@cart` | Shopping cart |
| `@checkout` | Checkout flow |
| `@api` | API tests |
| `@apiOnly` | **API-only tests (no browser)** |
| `@performance` | **Response time validation** |
| `@api-ui` | Combined API + UI tests |
| `@email` | **Email testing (Mailgun)** |
| `@mobile` | Mobile-specific tests |
| `@accessibility` | WCAG/EAA/ADA compliance |
| `@playwrightMCP` | **AI-powered MCP tests** |
| `@network-analysis` | **Network traffic analysis with AI** |

---

## 🌐 Browser Profiles

### Desktop
| Profile | Description |
|---------|-------------|
| `chrome` / `chromeHeadless` | Chrome (visible / headless) |
| `firefox` / `firefoxHeadless` | Firefox (visible / headless) |
| `webkit` / `webkitHeadless` | Safari (visible / headless) |

### Mobile & Tablet
| Profile | Device |
|---------|--------|
| `mobileChrome` / `mobileChromeHeadless` | Pixel 5 |
| `mobileSafari` / `mobileSafariHeadless` | iPhone 12 |
| `tablet` / `tabletHeadless` | iPad Pro 11 |

### API-Only (No Browser)
| Profile | Description |
|---------|-------------|
| `apiOnly` / `api` | **No browser launched - 10x faster** |

> ⚡ **How it works:** When using `apiOnly` or `api` profile, the framework only loads REST helpers and **completely skips browser initialization**. Configured in `e2e/config/getHelpers.js`.

---

## 📊 View Test Reports

Reports are **automatically generated** after each test run!

After tests complete, you'll see:
```
============================================================
📊 VIEW TEST REPORT:
   pnpm run allure:open
   OR
   npx allure open ./allure-report
============================================================
```

```bash
# Open the auto-generated report
pnpm run allure:open

# Or serve with auto-refresh
pnpm run allure:serve
```

> 💡 **Note:** `e2e/config/bootstrap.js` cleans old reports, `e2e/config/teardown.js` generates new ones automatically. No manual step needed!

---

## 🐳 Docker (Alternative)

```bash
# Build and run tests (auto-generates Allure report)
docker-compose build
docker-compose up e2e-tests

# Custom profile
PROFILE=local:@auth:chromeHeadless docker-compose up e2e-tests
```
# View Allure report after tests complete
docker-compose up allure-report && open http://localhost:5050
---

## 📁 Key Files

```
e2e/
├── tests/features/     # Gherkin feature files (.feature)
├── tests/steps/        # Step definitions (.steps.js)
├── pages/              # Page objects
├── services/           # API services
├── config/aggregate.js # Environment configuration
└── data/testData.js    # Test data
```

---

## ✅ What's Covered

This framework provides comprehensive E2E testing for [automationexercise.com](https://automationexercise.com):

### Functional Testing
- ✅ **Authentication** - Login, registration, logout
- ✅ **Products** - Browse, search, filter, view details
- ✅ **Cart** - Add/remove items, update quantities
- ✅ **Checkout** - Complete purchase flow
- ✅ **Contact** - Contact form submission

### API Testing
- ✅ **User API** - Create, verify, delete users
- ✅ **Product API** - Get products, search
- ✅ **Brand API** - Get brands list
- ✅ **Cart API** - Product availability, cart calculations
- ✅ **API + UI Combo** - Fast setup via API, validate via UI
- ✅ **Performance Tests** - Response time validation

### Cross-Platform
- ✅ **Desktop** - Chrome, Firefox, Safari/WebKit
- ✅ **Mobile** - Android (Pixel 5), iOS (iPhone 12)
- ✅ **Tablet** - iPad Pro 11

### Accessibility Compliance
- ✅ **WCAG 2.2 AA** - Web Content Accessibility Guidelines
- ✅ **EAA** - European Accessibility Act
- ✅ **ADA** - Americans with Disabilities Act
- ✅ **Auto-generated Markdown Report** - `e2e/ACCESSIBILITY_REPORT.md`

### AI-Powered Testing
- ✅ **Ollama Integration** - Free, local AI analysis
- ✅ **Network Traffic Analysis** - Capture & analyze requests/responses
- ✅ **AI Insights** - Performance and error detection

### CI/CD
- ✅ **GitHub Actions** - Automated workflows
  - `pr-checks.yml` - Lint + API smoke tests on PRs (fast, no browser)
  - `e2e-all.yml` - Full E2E suite on merge to main
- ✅ **Docker** - Containerized execution
- ✅ **Allure Reports** - Rich test reporting

---

## 🧹 Browser Session Management

The framework **keeps the browser open** across tests for faster execution:

| Setting | Behavior |
|---------|----------|
| `timeout: 10000` | 10 second action timeout |
| `restart: 'session'` | Browser stays open, only context resets |
| `keepBrowserState: true` | Preserves localStorage/sessionStorage |
| `keepCookies: false` | Clears cookies between scenarios |

> ⚡ **Result:** Browser launches **once per test run**, not per scenario.

### Fresh Session for Isolated Tests

For tests requiring clean state (no logged-in user, empty cart):

```gherkin
Given a new browser session is started
And the user is on the home page
```

This clears all cookies, localStorage, and sessionStorage.

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Browser not found | Run `pnpm exec playwright install --with-deps` |
| Tests timeout | Increase timeout in `codecept.conf.js` |
| Step not found | Check step definitions in `tests/steps/` |

---

## 📚 Next Steps

1. **Explore features** - Browse `e2e/tests/features/` for test scenarios
2. **Add new tests** - Create `.feature` files with Gherkin syntax
3. **Customize data** - Edit `e2e/data/testData.*.js` for your environment
4. **Run in CI** - Use GitHub Actions workflows in `.github/workflows/`
5. **Read strategy docs** - See [docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md) for architecture decisions

---

## 📖 Additional Documentation

| Document | Description |
|----------|-------------|
| [docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md) | Test strategy & scaling approach |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Framework architecture diagrams |
| [docs/EMAIL_TESTING.md](docs/EMAIL_TESTING.md) | Email testing with Mailgun |
| [docs/AI_TESTING.md](docs/AI_TESTING.md) | AI-powered testing integration |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | Accessibility compliance testing |

---

*For detailed documentation, see [README.md](README.md)*
