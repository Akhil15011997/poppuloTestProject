# 📋 AI Prompts for E2E Testing

These prompts work with **any AI assistant** - GitHub Copilot, Cursor, Claude, ChatGPT, Gemini, or any other LLM.

---

## Available Prompts

| Prompt | Use Case | File |
|--------|----------|------|
| **Add Test** | Create new UI, API, or combined tests | [ADD_TEST.md](./ADD_TEST.md) |
| **AI Analysis** | Run tests with AI-powered analysis | [AI_ANALYSIS.md](./AI_ANALYSIS.md) |

---

## How to Use

### Option 1: Copy-Paste to Any AI

1. Open the prompt file (e.g., `ADD_TEST.md`)
2. Copy the relevant prompt section
3. Paste into your AI assistant (ChatGPT, Claude, etc.)
4. Add your specific requirements

### Option 2: Reference in IDE AI (Copilot, Cursor, etc.)

```
@workspace Use the prompt from docs/prompts/ADD_TEST.md to create a test for [your feature]
```

Or simply:
```
Following the patterns in this codebase, create a test for [your feature]
```

### Option 3: Include as Context

When chatting with an AI, you can say:
```
I'm working with this E2E framework. Here are the conventions:
[paste relevant section from ADD_TEST.md]

Now help me create: [your request]
```

---

## Quick Reference

### Test Types & Tags

| Type | Tags | Example |
|------|------|---------|
| UI Test | `@ui` | Browser interactions |
| API Test | `@api @apiOnly` | REST API calls |
| Combined | `@api-ui` | API setup + UI verify |
| Accessibility | `@accessibility` | WCAG compliance |
| MCP + AI | `@playwrightMCP @ai` | AI-assisted testing |
| Network Analysis | `@network-analysis` | Network traffic with AI |

### Key Directories

```
e2e/
├── pages/           → Page Objects
├── services/        → API Services  
├── tests/features/  → Gherkin files
├── tests/steps/     → Step definitions
├── data/testState.js → Shared state
└── config/pageIncludes.js → Register components
```

### Common Commands

```bash
cd e2e

# Run tests
pnpm e2e local:@ui:chromeHeadless
pnpm e2e local:@api:chromeHeadless
pnpm e2e local:@playwrightMCP:chromeHeadless
pnpm e2e local:@network-analysis:chrome

# Reports
pnpm run allure:serve
```

---

## Example Conversations

### With ChatGPT/Claude

> **You:** I'm working with a CodeceptJS + Playwright + Gherkin framework. Create a UI test for user registration with these fields: name, email, password. Follow Page Object Model pattern.

### With GitHub Copilot

> **You:** @workspace Create a new feature file for testing the checkout flow, following the patterns in e2e/tests/features/

### With Cursor

> **You:** Look at e2e/pages/auth/login.page.js and create a similar page object for the registration page

---

## Tips for Best Results

1. **Be specific** - "Test login with invalid email format" beats "Test login"
2. **Reference existing files** - "Similar to login.page.js"
3. **Specify test type** - "UI test" or "API test"
4. **Mention the framework** - "CodeceptJS with Playwright and Gherkin"
5. **Include context** - Paste relevant code snippets when needed
