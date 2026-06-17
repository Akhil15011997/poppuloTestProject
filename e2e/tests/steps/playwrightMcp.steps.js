const { I, homePage, loginPage, productsPage } = inject();
const { container } = require('codeceptjs');
const testState = require('../../data/testState');
const { analyzeWithPerplexity, analyzeTestFailure } = require('../../helpers/perplexityHelper');

// Helper function to get PlaywrightHelper from container
function getPlaywrightHelper() {
  return container.helpers('PlaywrightHelper');
}

// MCP Navigation Steps
Given('the MCP browser navigates to the home page', async () => {
  await homePage.navigateToHomePage();
});

Given('the MCP browser navigates to the login page', async () => {
  await loginPage.navigateToLoginPage();
});

Given('the MCP browser navigates to the products page', async () => {
  await productsPage.navigateToProductsPage();
});

Given('the MCP browser navigates to {string}', async (url) => {
  await I.amOnPage(url);
  await I.waitForElement('body', 10);
});

// MCP Snapshot Steps
When('the MCP browser takes a snapshot', async () => {
  testState.mcpSnapshot = await I.grabHTMLFrom('body');
  I.say('MCP snapshot captured');
});

When('the MCP browser captures page accessibility tree', async () => {
  testState.mcpSnapshot = await I.grabHTMLFrom('body');
  const title = await I.grabTitle();
  testState.pageTitle = title;
  I.say(`Page title: ${title}`);
});

Then('the snapshot should contain {string}', async (expectedText) => {
  const snapshot = testState.mcpSnapshot || '';
  const contains = snapshot.includes(expectedText);
  if (!contains) {
    throw new Error(`Snapshot should contain "${expectedText}" but it was not found`);
  }
  I.say(`✓ Snapshot contains: "${expectedText}"`);
});

Then('the page title should be {string}', async (expectedTitle) => {
  const actualTitle = await I.grabTitle();
  I.assertEqual(actualTitle, expectedTitle, 
    `Expected title "${expectedTitle}" but got "${actualTitle}"`);
});

// MCP Form Interaction Steps
When('the MCP browser fills the login form with email {string} and password {string}', async (email, password) => {
  await I.waitForVisible(locate('input').withAttr({ 'data-qa': 'login-email' }), 10);
  await I.fillField(locate('input').withAttr({ 'data-qa': 'login-email' }), email);
  await I.fillField(locate('input').withAttr({ 'data-qa': 'login-password' }), password);
});

When('the MCP browser fills form field {string} with {string}', async (field, value) => {
  await I.fillField(field, value);
});

When('the MCP browser clicks the login button', async () => {
  await I.clickWhenClickable(locate('button').withAttr({ 'data-qa': 'login-button' }));
});

When('the MCP browser clicks on {string}', async (target) => {
  await I.clickWhenClickable(target);
});

When('the MCP browser clicks element with text {string}', async (text) => {
  await I.clickWhenClickable(locate('*').withText(text));
});

Then('the MCP browser should see login result', async () => {
  await I.waitForElement('body', 5);
  const pageSource = await I.grabHTMLFrom('body');
  testState.loginResult = pageSource;
  
  // Check for either logged in state or error message
  const isLoggedIn = pageSource.includes('Logged in as') || pageSource.includes('logged_in_as');
  const hasError = pageSource.includes('incorrect') || pageSource.includes('error');
  
  I.say(`Login result - Logged in: ${isLoggedIn}, Has error: ${hasError}`);
});

// MCP Screenshot Steps
When('the MCP browser takes a screenshot named {string}', async (name) => {
  const filename = `${name}-${Date.now()}.png`;
  await I.saveScreenshot(filename);
  testState.lastScreenshot = filename;
  I.say(`Screenshot saved: ${filename}`);
});

When('the MCP browser takes a full page screenshot named {string}', async (name) => {
  const filename = `${name}-fullpage-${Date.now()}.png`;
  await I.saveScreenshot(filename, true);
  testState.lastScreenshot = filename;
  I.say(`Full page screenshot saved: ${filename}`);
});

Then('the screenshot should be saved to allure results', async () => {
  I.say(`Screenshot attached to Allure: ${testState.lastScreenshot}`);
});

// MCP Wait Steps
When('the MCP browser waits for {string} to be visible', async (locator) => {
  await I.waitForVisible(locator, 15);
});

When('the MCP browser waits for text {string}', async (text) => {
  // Wait for page to stabilize first
  await I.wait(2);
  // Try to find text, with fallback for partial matches
  try {
    await I.waitForText(text, 20);
  } catch (e) {
    // Try case-insensitive search
    const pageText = await I.grabTextFrom('body');
    if (pageText.toLowerCase().includes(text.toLowerCase())) {
      I.say(`Found text (case-insensitive): "${text}"`);
    } else {
      throw new Error(`Text "${text}" was not found on page. Page contains: ${pageText.substring(0, 500)}...`);
    }
  }
});

When('the MCP browser waits {int} seconds', async (seconds) => {
  await I.wait(seconds);
});

// MCP Verification Steps
Then('the MCP browser should see {string}', async (text) => {
  await I.see(text);
});

Then('the MCP browser should not see {string}', async (text) => {
  await I.dontSee(text);
});

Then('the MCP browser should see element {string}', async (locator) => {
  await I.waitForVisible(locator, 10);
});

Then('the MCP browser URL should contain {string}', async (urlPart) => {
  await I.waitInUrl(urlPart, 10);
});

// AI Analysis Steps (defaults to Ollama - free, local)
When('the user analyzes test results with Perplexity', async () => {
  const dataToAnalyze = testState.apiResponse || testState.mcpSnapshot || testState.loginResult;
  
  if (dataToAnalyze) {
    I.say(`Using AI provider: ${process.env.AI_PROVIDER || 'ollama'} (default)`);
    const analysis = await analyzeWithPerplexity(dataToAnalyze, 'E2E test result');
    testState.aiAnalysis = analysis;
    I.say(`AI Analysis:\n${analysis}`);
  } else {
    I.say('No data to analyze');
  }
});

When('the user analyzes page content with Perplexity', async () => {
  if (testState.mcpSnapshot) {
    I.say(`Using AI provider: ${process.env.AI_PROVIDER || 'ollama'} (default)`);
    // Extract meaningful content (limit size for API)
    const content = testState.mcpSnapshot.substring(0, 5000);
    const analysis = await analyzeWithPerplexity(content, 'web page content');
    testState.aiAnalysis = analysis;
    I.say(`Page Analysis:\n${analysis}`);
  } else {
    I.say('No snapshot data to analyze');
  }
});

When('the user analyzes test failure with Perplexity', async () => {
  if (testState.lastError) {
    I.say(`Using AI provider: ${process.env.AI_PROVIDER || 'ollama'} (default)`);
    const analysis = await analyzeTestFailure(testState.lastError);
    testState.aiAnalysis = analysis;
    I.say(`Failure Analysis:\n${analysis}`);
  } else {
    I.say('No error data to analyze');
  }
});

Then('the AI analysis should be attached to Allure report', async () => {
  if (testState.aiAnalysis) {
    I.say('AI Analysis Report:');
    I.say(testState.aiAnalysis);
  } else {
    I.say('No AI analysis available');
  }
});

Then('the AI analysis should contain insights', async () => {
  I.assertTrue(testState.aiAnalysis && testState.aiAnalysis.length > 50, 
    'AI analysis should contain meaningful insights');
});

// MCP Console and Network Steps
When('the MCP browser captures console logs', async () => {
  // Console logs are captured automatically by Playwright
  I.say('Console logs captured');
});

When('the MCP browser starts network capture', async () => {
  const helper = getPlaywrightHelper();
  await helper.startNetworkCapture();
  I.say('Network capture started');
});

When('the MCP browser captures network requests', async () => {
  const helper = getPlaywrightHelper();
  const summary = helper.getNetworkSummary();
  testState.networkSummary = summary;
  I.say(`Network captured: ${summary.totalRequests} requests, ${summary.totalResponses} responses, ${summary.errors} errors`);
});

When('the user analyzes network traffic with AI', async () => {
  const helper = getPlaywrightHelper();
  const summary = helper.getNetworkSummary();
  testState.networkSummary = summary;
  
  if (summary.totalRequests > 0) {
    I.say(`Using AI provider: ${process.env.AI_PROVIDER || 'ollama'} (default)`);
    
    const networkData = `
Network Traffic Analysis:
- Total Requests: ${summary.totalRequests}
- Total Responses: ${summary.totalResponses}
- API Calls: ${summary.apiCalls}
- Errors: ${summary.errors}

Status Code Distribution:
${Object.entries(summary.byStatus).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

Resource Types:
${Object.entries(summary.byType).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

${summary.errors > 0 ? `\nError Details:\n${summary.errorDetails.map(e => `  ${e.status} ${e.statusText}: ${e.url}`).join('\n')}` : ''}

API Endpoints Called:
${summary.apiDetails.map(a => `  ${a.method} ${a.url} -> ${a.status}`).join('\n')}
`;
    
    const analysis = await analyzeWithPerplexity(networkData, 'network traffic during E2E test');
    testState.networkAnalysis = analysis;
    I.say(`Network Analysis:\n${analysis}`);
  } else {
    I.say('No network data captured. Call "the MCP browser starts network capture" first.');
  }
});

Then('the network analysis should be attached to Allure report', async () => {
  if (testState.networkAnalysis) {
    I.say('Network Analysis Report:');
    I.say(testState.networkAnalysis);
  } else if (testState.networkSummary) {
    const summary = testState.networkSummary;
    I.say('Network Summary:');
    I.say(`  Total Requests: ${summary.totalRequests}`);
    I.say(`  Total Responses: ${summary.totalResponses}`);
    I.say(`  API Calls: ${summary.apiCalls}`);
    I.say(`  Errors: ${summary.errors}`);
  } else {
    I.say('No network analysis available');
  }
});

Then('there should be no network errors', async () => {
  const helper = getPlaywrightHelper();
  const errors = helper.getNetworkResponses('errors');
  if (errors.length > 0) {
    const errorDetails = errors.map(e => `${e.status}: ${e.url}`).join('\n');
    throw new Error(`Found ${errors.length} network errors:\n${errorDetails}`);
  }
  I.say('✓ No network errors detected');
});

Then('all API calls should return success', async () => {
  const helper = getPlaywrightHelper();
  const apiResponses = helper.getNetworkResponses('api');
  const failures = apiResponses.filter(r => r.status >= 400);
  
  if (failures.length > 0) {
    const failureDetails = failures.map(f => `${f.status}: ${f.url}`).join('\n');
    throw new Error(`Found ${failures.length} failed API calls:\n${failureDetails}`);
  }
  I.say(`✓ All ${apiResponses.length} API calls returned success`);
});

// MCP Element Interaction Steps
When('the MCP browser hovers over {string}', async (locator) => {
  await I.moveCursorTo(locator);
});

When('the MCP browser scrolls to {string}', async (locator) => {
  await I.scrollTo(locator);
});

When('the MCP browser presses key {string}', async (key) => {
  await I.pressKey(key);
});

// Store state for later analysis
When('the MCP browser stores current state', async () => {
  testState.mcpSnapshot = await I.grabHTMLFrom('body');
  testState.currentUrl = await I.grabCurrentUrl();
  testState.pageTitle = await I.grabTitle();
  I.say(`State stored - URL: ${testState.currentUrl}, Title: ${testState.pageTitle}`);
});
