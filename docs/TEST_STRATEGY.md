# Test Strategy & Architecture Document

## Executive Summary

This document outlines the comprehensive test strategy for the AutomationExercise e-commerce platform, covering test design principles, architecture decisions, CI/CD integration, and scaling considerations for multi-team adoption.

The target website is tested as a **black-box system**. Internal implementation details (for example, whether the backend is monolithic or microservices-based) are not assumed unless verified.

---

## 1. Overall Test Strategy

### 1.1 Testing Philosophy

Our testing approach follows the **Testing Pyramid** principle with emphasis on:

- **Fast feedback loops** - API tests run without browser overhead
- **Shift-left testing** - Early defect detection through unit and integration tests
- **Risk-based testing** - Critical user journeys prioritized
- **Continuous testing** - Automated execution in CI/CD pipelines

### 1.2 Test Categories

| Category | Purpose | Execution Time | Frequency |
|----------|---------|----------------|-----------|
| **Regression** | Full feature coverage | 5-8 min | Daily/PR merge |
| **Smoke API** | Backend service validation | < 2 min | Every commit |
| **Performance** | Response time baselines | 2-3 min | Nightly |
| **Accessibility** | WCAG compliance | 2-3 min | Local runs |
| **MCP** | AI-assisted browser testing | 1-2 min | Local runs |

### 1.3 Test Scope

**In Scope:**

- User authentication (login, registration, logout)
- Product browsing and search
- Cart operations
- Checkout flow
- API endpoint validation
- Cross-browser compatibility
- Mobile responsiveness

**Out of Scope (for initial phase):**

- Payment gateway integration (third-party)
- Email verification flows
- Load/stress testing at scale

---

## 2. Test Architecture Layers

### 2.1 Testing Pyramid Implementation

```
                    ┌─────────────┐
                    │   E2E/UI    │  ~10% - Critical user journeys
                    │   Tests     │  Slow, expensive, high confidence
                    ├─────────────┤
                    │ Integration │  ~20% - API contracts, service
                    │   Tests     │  interactions, data flows
                    ├─────────────┤
                    │    API      │  ~30% - Endpoint validation,
                    │   Tests     │  business logic, data integrity
                    ├─────────────┤
                    │    Unit     │  ~40% - Component logic,
                    │   Tests     │  utilities, helpers
                    └─────────────┘
```

### 2.2 Layer Responsibilities

#### UI Layer (E2E Tests)

- **Purpose:** Validate complete user journeys through the browser
- **Tools:** CodeceptJS + Playwright
- **Location:** `e2e/tests/features/`
- **Characteristics:**
  - Browser-based execution
  - Page Object Model pattern
  - Visual regression capable
  - Slowest but highest confidence

#### API Layer

- **Purpose:** Validate backend services without UI overhead
- **Tools:** Axios + CodeceptJS REST helper
- **Location:** `e2e/services/`, `e2e/tests/features/api/`
- **Characteristics:**
  - No browser launch (fast execution)
  - Contract validation
  - Data integrity checks
  - Response time monitoring

#### Integration Layer

- **Purpose:** Validate interactions between components
- **Approach:** API-driven setup + UI verification
- **Example:** Create user via API → Verify login via UI

### 2.3 Test Data Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    Test Data Layers                      │
├─────────────────────────────────────────────────────────┤
│  Static Data    │ Predefined users, products (testData.js)
│  Dynamic Data   │ Generated at runtime (userGenerator.js)
│  Environment    │ Config per env (local, staging, prod)
│  Fixtures       │ API-seeded data for specific scenarios
└─────────────────────────────────────────────────────────┘
```

---

## 3. Tooling & Framework Rationale

### 3.1 Framework Selection: CodeceptJS + Playwright

| Criteria | CodeceptJS + Playwright | Alternative (Cypress) | Decision Factor |
|----------|------------------------|----------------------|-----------------|
| **Multi-browser** | ✅ Chromium, Firefox, WebKit | ⚠️ Limited WebKit | Cross-browser critical |
| **BDD Support** | ✅ Native Gherkin | ⚠️ Plugin required | Stakeholder readability |
| **API Testing** | ✅ Built-in REST helper | ⚠️ cy.request only | Unified framework |
| **Parallel Execution** | ✅ Native support | ✅ Native support | Both capable |
| **Mobile Emulation** | ✅ Device profiles | ⚠️ Viewport only | Mobile testing needs |
| **Learning Curve** | Moderate | Low | Team familiarity |

### 3.2 Supporting Tools

| Tool | Purpose | Justification |
|------|---------|---------------|
| **Playwright** | Browser automation | Speed, reliability, modern API |
| **Axios** | HTTP client | Lightweight, promise-based |
| **Chai** | Assertions | Expressive, BDD-style |
| **Allure** | Reporting | Rich reports, CI integration |
| **axe-core** | Accessibility | Industry standard, WCAG coverage |
| **pnpm** | Package manager | Fast, disk-efficient |

### 3.3 Design Patterns

- **Page Object Model (POM):** Encapsulate page interactions
- **Component Objects:** Reusable UI components (navbar, modal)
- **Service Objects:** API endpoint abstractions
- **Step Definitions:** BDD Gherkin step implementations
- **Test State Management:** Shared state across steps

---

## 4. CI/CD Integration

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │  Lint   │───▶│  Unit   │───▶│   API   │───▶│   E2E   │      │
│  │  Check  │    │  Tests  │    │  Tests  │    │  Tests  │      │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘      │
│       │              │              │              │             │
│       ▼              ▼              ▼              ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Test Reports                          │   │
│  │         (JUnit XML, Allure, Screenshots)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │     Deploy      │                          │
│                    │   (if passed)   │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 GitHub Actions Workflows

| Workflow | Trigger | Tests Run | Duration |
|----------|---------|-----------|----------|
| `pr-checks.yml` | PR, Push | Lint + Syntax + API smoke (no browser) | ~3 min |
| `e2e-suite.yml` | Manual | Single suite by tag | ~5 min |
| `e2e-all.yml` | Push to main, Manual | Full E2E parallel suites | ~5-10 min |
| `e2e-scheduled.yml` | Cron (nightly) | All + Performance | ~45 min |

### 4.3 Test Execution Profiles

```bash
# Smoke tests - every commit
PROFILE=local:@smoke:chromeHeadless:playwright

# API-only tests - fast, no browser
PROFILE=local:@api:apiOnly:playwright

# Full regression - PR merge
PROFILE=staging:@regression:chromeHeadless:playwright

# Cross-browser - release
PROFILE=staging:@smoke:firefox:playwright
```

### 4.4 Failure Handling

- **Screenshots:** Captured on failure
- **Traces:** Playwright traces for debugging
- **Retry Logic:** Configurable retry for flaky tests
- **Quarantine:** Tag flaky tests with `@flaky` for separate runs

---

## 5. Scaling Across Teams

### 5.1 Multi-Team Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Test Infrastructure                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Team A    │  │   Team B    │  │   Team C    │             │
│  │  (Auth)     │  │  (Products) │  │  (Checkout) │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                      │
│         ▼                ▼                ▼                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Shared Framework Layer                      │   │
│  │  • Page Objects  • Helpers  • Config  • CI Templates    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Shared Services & Utilities                 │   │
│  │  • API Services  • Test Data  • Reporting  • Docker     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Team Ownership Model

| Component | Owner | Consumers |
|-----------|-------|-----------|
| Core Framework | QE Platform Team | All teams |
| Auth Tests | Team A | Shared |
| Product Tests | Team B | Team B |
| Checkout Tests | Team C | Team C |
| API Services | QE Platform Team | All teams |

### 5.3 Contribution Guidelines

1. **Feature branches** for new tests
2. **PR reviews** required from framework owners
3. **Documentation** for new page objects/helpers
4. **Backward compatibility** for shared components
5. **Semantic versioning** for framework releases

### 5.4 Shared vs Team-Specific

**Shared (Framework Package):**

- Core helpers and utilities
- Base page objects
- CI/CD templates
- Docker configurations
- Reporting setup

**Team-Specific:**

- Feature-specific tests
- Domain page objects
- Test data for their services
- Custom step definitions

---

## 6. Test Data & Environment Management

### 6.1 Test Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    Test Data Hierarchy                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Level 1: Static Reference Data                                  │
│  ├── testData.js (base configuration)                           │
│  ├── testData.local.js (local overrides)                        │
│  ├── testData.staging.js (staging overrides)                    │
│  └── testData.prod.js (production - read-only)                  │
│                                                                  │
│  Level 2: Dynamic Generated Data                                 │
│  ├── userGenerator.js (unique users per test)                   │
│  └── Timestamps/UUIDs for uniqueness                            │
│                                                                  │
│  Level 3: API-Seeded Data                                        │
│  ├── Before hooks create required state                         │
│  └── After hooks cleanup test data                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Environment Configuration

| Environment | Purpose | Data Policy | Access |
|-------------|---------|-------------|--------|
| **Local** | Development | | Developers + QE |
| **Staging** | Integration | | Developers + QE + Product Owners + Delivery Managers |
| **Production** | Smoke only | Read-only | All |

### 6.3 Data Isolation Patterns

```javascript
// Pattern 1: Generate unique data per test
const user = userGenerator.generateUser(); // Unique email/name

// Pattern 2: API setup/teardown
Before(async () => {
  testState.user = await userService.createAccount(userData);
});
After(async () => {
  await userService.deleteAccount(testState.user.email);
});

// Pattern 3: Database snapshots (for complex scenarios)
// Restore DB to known state before test suite
```

---

## 7. Test Reliability & Flaky Test Management

### 7.1 Flaky Test Prevention

**Design Principles:**

1. **Explicit waits** over implicit/sleep
2. **Stable locators** (data-testid > CSS > XPath)
3. **Independent tests** - no shared state between tests
4. **Retry mechanisms** for network-dependent operations
5. **Deterministic data** - avoid time-based assertions

### 7.2 Flaky Test Detection

```javascript
// codecept.conf.js - Retry configuration
{
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
      minTimeout: 1000,
    },
    autoDelay: {
      enabled: true,
      delayBefore: 100,
    },
  }
}
```

### 7.3 Flaky Test Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                 Flaky Test Management Process                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Detection                                                    │
│     └── Test fails intermittently in CI                         │
│                                                                  │
│  2. Quarantine                                                   │
│     └── Tag with @flaky, move to separate suite                 │
│                                                                  │
│  3. Investigation                                                │
│     ├── Review traces/screenshots                               │
│     ├── Check for race conditions                               │
│     └── Verify test isolation                                   │
│                                                                  │
│  4. Fix                                                          │
│     ├── Add explicit waits                                      │
│     ├── Improve locators                                        │
│     └── Refactor test logic                                     │
│                                                                  │
│  5. Validation                                                   │
│     └── Run 10x in CI before removing @flaky tag                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Reliability Metrics

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Pass Rate | > 98% | Investigate failures |
| Flaky Rate | < 2% | Quarantine + fix |
| Avg Duration | < 30s/test | Optimize waits |
| False Positives | < 1% | Review assertions |

---

## 8. Blended Performance Testing

### 8.1 Performance Testing Approach

Rather than separate performance testing tools, we implement **blended performance checks** within functional tests:

```
┌─────────────────────────────────────────────────────────────────┐
│              Blended Performance Testing Model                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Functional Test Execution                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. Start timer                                          │   │
│  │  2. Execute API call / Page load                         │   │
│  │  3. Stop timer                                           │   │
│  │  4. Assert response time < threshold                     │   │
│  │  5. Log metrics for trending                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Benefits:                                                       │
│  • No separate performance test infrastructure                  │
│  • Performance regression caught early                          │
│  • Metrics collected with every test run                        │
│  • Baselines established over time                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Implementation Example

```gherkin
@performance @api
Scenario: API - Products List Response Time
  When the user starts API timer
  And the user gets all products via API
  Then the API response code should be 200
  And the API response time should be less than 3000 ms
```

```javascript
// Step implementation
When('the user starts API timer', async () => {
  apiStartTime = Date.now();
});

Then('the API response time should be less than {int} ms', async (maxMs) => {
  const responseTime = Date.now() - apiStartTime;
  console.log(`[PERF] Response Time: ${responseTime}ms`);
  I.assertTrue(responseTime < maxMs, 
    `Expected < ${maxMs}ms, got ${responseTime}ms`);
});
```

### 8.3 Performance Thresholds

| Operation | Threshold | Severity |
|-----------|-----------|----------|
| API - GET Products | < 3000ms | Warning |
| API - Search | < 3000ms | Warning |
| API - User Auth | < 2000ms | Critical |
| Page Load - Home | < 5000ms | Warning |
| Page Load - Products | < 6000ms | Warning |

### 8.4 When to Use Dedicated Performance Tools

Blended testing is suitable for:

- ✅ Response time baselines
- ✅ Performance regression detection
- ✅ Single-user scenarios

Use dedicated tools (k6, JMeter, Gatling) for:

- ❌ Load testing (concurrent users)
- ❌ Stress testing (breaking point)
- ❌ Soak testing (extended duration)
- ❌ Spike testing (sudden load)

---

## 9. Trade-offs & Assumptions

### 9.1 Key Trade-offs

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| CodeceptJS over Cypress | Steeper learning curve | Multi-browser + BDD support |
| Gherkin syntax | More verbose | Stakeholder readability |
| Session persistence | Potential state leakage | Faster execution |
| API-only mode | Less realistic | 10x faster feedback |
| Blended perf tests | Not load testing | Simpler infrastructure |

### 9.2 Assumptions

1. **Target application** remains relatively stable (no major rewrites)
2. **API contracts** are documented and versioned
3. **Test environments** are available and representative
4. **Teams** have basic JavaScript/TypeScript knowledge
5. **CI/CD infrastructure** supports parallel execution

### 9.3 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flaky tests erode trust | High | Quarantine process, reliability metrics |
| Slow test suite | Medium | Parallel execution, API-first approach |
| Environment instability | High | Docker containers, environment monitoring |
| Framework lock-in | Medium | Abstraction layers, standard patterns |

---

## 10. Future Improvements

- [ ] Visual regression testing integration
- [ ] Enhanced Allure reporting with trends
- [ ] Test coverage mapping to requirements
- [ ] Slack/Teams notifications for failures
- [ ] Contract testing for API versioning
- [ ] AI-assisted test generation expansion
- [ ] Performance trending dashboard
- [ ] Self-healing locators
- [ ] Chaos engineering integration
- [ ] Production monitoring correlation
- [ ] Test impact analysis for PRs

---

## 11. Appendix

### 11.1 Quick Reference Commands

```bash
# Run smoke tests
pnpm e2e local:@smoke:chromeHeadless:playwright

# Run API tests only (no browser)
pnpm e2e local:@api:apiOnly:playwright

# Run with visible browser
pnpm e2e local:@smoke:chrome:playwright

# Run in parallel
pnpm e2e:parallel local:@regression:chromeHeadless:playwright 4

# Run in Docker
docker-compose up --build
```

### 11.2 Tag Reference

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical path tests |
| `@regression` | Full test suite |
| `@api` | API-only tests |
| `@apiOnly` | No browser needed |
| `@performance` | Response time checks |
| `@accessibility` | WCAG compliance |
| `@flaky` | Quarantined tests |
| `@wip` | Work in progress |

### 11.3 Contact & Support

- **Framework Issues:** Create GitHub issue with `framework` label
- **Test Failures:** Check Allure report, review traces
- **New Feature Requests:** Contact owner

---

### 11.4 Current Test Results

| Metric | Value |
|--------|-------|
| **Total Tests** | 41 |
| **Passed** | 40 |
| **Failed** | 1 (Accessibility - website issue) |
| **Pass Rate** | 97.6% |
| **Execution Time** | ~2 minutes |

> **Note:** The single failing test is an accessibility test that correctly identifies real WCAG violations on the target website (buttons without discernible text).

---

*Document Version: 1.3*  
*Last Updated: June 2026*  
*Owner: Akhil Srinivas :p*
