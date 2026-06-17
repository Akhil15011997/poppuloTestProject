# 🤖 Prompt: AI-Powered Test Analysis

Use this prompt with any AI assistant to run tests with AI analysis using Ollama (free, local) or other providers.

---

## Quick Start

```
I have an E2E test framework with AI-powered analysis using Ollama (local, free).

Help me:
1. Run tests tagged with @playwrightMCP
2. Analyze test results with AI
3. Generate Allure reports

The framework supports these AI providers:
- Ollama (default, free, local) - no API key needed
- Groq (free tier) - needs GROQ_API_KEY
- Perplexity (paid) - needs PERPLEXITY_API_KEY

Commands:
- Run tests: cd e2e && pnpm e2e local:@playwrightMCP:chromeHeadless
- Start Ollama: ollama serve
- Pull model: ollama pull llama3.2
```

---

## Setup Prompts

### Ollama Setup (FREE - Recommended)

```
Help me set up Ollama for AI test analysis:

1. Install Ollama:
   - macOS: brew install ollama
   - Or download from: https://ollama.ai/download

2. Start the server:
   ollama serve

3. Pull a model:
   ollama pull llama3.2

4. Verify it's working:
   curl http://localhost:11434/api/generate -d '{"model":"llama3.2","prompt":"Hello"}'

The framework will automatically use Ollama when running @playwrightMCP tests.
No configuration needed - it's the default!
```

### Switch AI Provider

```
To switch AI providers, set in e2e/.env:

# Use Ollama (default - free, local)
AI_PROVIDER=ollama

# Use Groq (free tier)
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxxxx

# Use Perplexity (paid)
AI_PROVIDER=perplexity
PERPLEXITY_API_KEY=pplx-xxxxx
```

---

## Test Analysis Prompts

### Analyze Test Results

```
I ran E2E tests and got these results:
[PASTE TEST OUTPUT HERE]

Please analyze:
1. What tests passed/failed?
2. Root cause of failures?
3. Suggested fixes?
4. Any patterns in the failures?
```

### Generate Test Scenarios

```
Using this framework's Gherkin format, generate test scenarios for:
[DESCRIBE FEATURE]

Follow this pattern:
@ui @[domain]
Feature: [Feature Name]
  As a user
  I want to [action]
  So that [benefit]

  Scenario: [Scenario name]
    Given [precondition]
    When [action]
    Then [expected result]
```

### Debug Failed Test

```
This test is failing:
[PASTE FEATURE FILE]

Error:
[PASTE ERROR MESSAGE]

Step definitions are in: e2e/tests/steps/
Page objects are in: e2e/pages/

Help me debug:
1. What's the likely cause?
2. How can I fix it?
3. What additional logging would help?
```

---

## Running MCP Tests

### Basic Commands

```bash
# Navigate to e2e folder first
cd e2e

# Run all MCP tests
pnpm e2e local:@playwrightMCP:chromeHeadless

# Run with visible browser (for debugging)
pnpm e2e local:@playwrightMCP:chrome

# Run specific scenario tag
pnpm e2e local:@mcp-navigation:chromeHeadless

# Run with AI analysis (Ollama must be running)
ollama serve  # In separate terminal
pnpm e2e local:@ai:chromeHeadless

# Run network traffic analysis
pnpm e2e local:@network-analysis:chrome
```

### Generate Reports

```bash
# Generate Allure report
pnpm run allure:generate

# Open report in browser
pnpm run allure:open

# Serve with auto-refresh
pnpm run allure:serve
```

---

## Feature File with AI Analysis

```gherkin
@playwrightMCP @ai
Feature: AI-Powered Testing

  Scenario: Analyze page with AI
    Given the MCP browser navigates to the home page
    When the MCP browser takes a snapshot
    And the user analyzes page content with Perplexity
    Then the AI analysis should be attached to Allure report

  Scenario: Analyze test failure with AI
    Given the MCP browser navigates to the login page
    When the MCP browser fills the login form with email "invalid" and password "test"
    And the MCP browser clicks the login button
    And the user analyzes test failure with Perplexity
    Then the AI analysis should contain insights

  @network-analysis
  Scenario: Analyze network traffic with AI
    Given the MCP browser navigates to the home page
    When the MCP browser starts network capture
    And the MCP browser navigates to the products page
    And the MCP browser waits 3 seconds
    And the MCP browser captures network requests
    And the user analyzes network traffic with AI
    Then the network analysis should be attached to Allure report
    And there should be no network errors
```

---

## AI Helper Functions

The framework provides these AI functions in `e2e/helpers/perplexityHelper.js`:

```javascript
// Analyze any data
const { analyzeWithPerplexity } = require('./helpers/perplexityHelper');
const analysis = await analyzeWithPerplexity(data, 'context description');

// Generate test suggestions
const { generateTestSuggestions } = require('./helpers/perplexityHelper');
const scenarios = await generateTestSuggestions('user login feature');

// Analyze test failure
const { analyzeTestFailure } = require('./helpers/perplexityHelper');
const rootCause = await analyzeTestFailure({ testName, error, stack });
```

---

## Troubleshooting

### Ollama Not Running

```
Error: AI analysis skipped - Ollama not running

Fix:
1. Open a new terminal
2. Run: ollama serve
3. Keep it running while tests execute
```

### Model Not Found

```
Error: model 'llama3.2' not found

Fix:
ollama pull llama3.2
```

### Slow Analysis

```
Ollama running slow?

Options:
1. Use smaller model: OLLAMA_MODEL=llama3.2:1b
2. Use cloud provider: AI_PROVIDER=groq (free tier)
3. Skip AI for faster tests: run without @ai tag
```

---

## Environment Variables

```bash
# e2e/.env

# AI Provider (default: ollama)
AI_PROVIDER=ollama

# Ollama settings (optional - these are defaults)
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama3.2

# Alternative: Groq (free tier)
# AI_PROVIDER=groq
# GROQ_API_KEY=gsk_xxxxx

# Alternative: Perplexity (paid)
# AI_PROVIDER=perplexity  
# PERPLEXITY_API_KEY=pplx-xxxxx
```
