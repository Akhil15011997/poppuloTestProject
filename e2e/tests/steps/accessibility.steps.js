const { I } = inject();
const { container } = require('codeceptjs');

let accessibilityResults = null;
let accessibilityReport = null;
let currentPageName = 'Page';
let currentScanType = 'WCAG 2.2 AA';
let reportInitialized = false;

// Helper function to get AccessibilityHelper from container
function getAccessibilityHelper() {
  return container.helpers('AccessibilityHelper');
}

// Initialize report at start of accessibility test run
function initializeReportIfNeeded() {
  if (!reportInitialized) {
    const helper = getAccessibilityHelper();
    helper.initializeMarkdownReport();
    reportInitialized = true;
  }
}

// Navigation steps for accessibility testing
Given('the user is on the home page for accessibility testing', async () => {
  initializeReportIfNeeded();
  currentPageName = 'Home Page';
  await I.amOnPage('/');
  await I.waitForElement('body', 10);
});

Given('the user is on the {string} page for accessibility testing', async (pageName) => {
  initializeReportIfNeeded();
  currentPageName = pageName;
  const pageUrls = {
    'home': '/',
    'login': '/login',
    'signup': '/login',
    'products': '/products',
    'cart': '/view_cart',
    'contact': '/contact_us',
    'test cases': '/test_cases',
    'api testing': '/api_list',
  };
  
  const url = pageUrls[pageName.toLowerCase()] || `/${pageName.toLowerCase().replace(' ', '_')}`;
  await I.amOnPage(url);
  await I.waitForElement('body', 10);
});

// Full page accessibility scans
When('the user runs a full accessibility scan', async () => {
  const helper = getAccessibilityHelper();
  currentScanType = 'Full Scan';
  accessibilityResults = await helper.runAccessibilityScan();
  helper.appendToMarkdownReport(accessibilityResults, currentPageName, currentScanType);
});

When('the user runs a WCAG 2.2 AA compliance scan', async () => {
  const helper = getAccessibilityHelper();
  currentScanType = 'WCAG 2.2 AA';
  accessibilityResults = await helper.runWCAG22AAScan();
  helper.appendToMarkdownReport(accessibilityResults, currentPageName, currentScanType);
});

When('the user runs an EAA compliance scan', async () => {
  const helper = getAccessibilityHelper();
  currentScanType = 'EAA (European Accessibility Act)';
  accessibilityResults = await helper.runEAAScan();
  helper.appendToMarkdownReport(accessibilityResults, currentPageName, currentScanType);
});

When('the user runs an ADA compliance scan', async () => {
  const helper = getAccessibilityHelper();
  currentScanType = 'ADA (Americans with Disabilities Act)';
  accessibilityResults = await helper.runADAScan();
  helper.appendToMarkdownReport(accessibilityResults, currentPageName, currentScanType);
});

// Specific accessibility checks
When('the user checks color contrast', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkColorContrast();
});

When('the user checks keyboard accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkKeyboardAccessibility();
});

When('the user checks image accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkImageAccessibility();
});

When('the user checks form accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkFormAccessibility();
});

When('the user checks heading structure', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkHeadingStructure();
});

When('the user checks ARIA compliance', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkARIACompliance();
});

When('the user checks link accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.checkLinkAccessibility();
});

// Element-specific scans
When('the user scans the {string} element for accessibility', async (selector) => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.scanElement(selector);
});

When('the user scans the navigation for accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.scanElement('nav, .navbar, header');
});

When('the user scans the footer for accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.scanElement('footer');
});

When('the user scans the main content for accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.scanElement('main, .main-content, #main');
});

When('the user scans forms for accessibility', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.scanElement('form');
});

// Assertion steps
Then('there should be no accessibility violations', async () => {
  const helper = getAccessibilityHelper();
  helper.assertNoViolations(accessibilityResults);
});

Then('there should be no critical accessibility violations', async () => {
  const helper = getAccessibilityHelper();
  helper.assertNoCriticalViolations(accessibilityResults);
});

Then('there should be no serious accessibility violations', async () => {
  const seriousViolations = accessibilityResults.violations.filter(
    v => v.impact === 'serious' || v.impact === 'critical'
  );
  
  if (seriousViolations.length > 0) {
    throw new Error(
      `Found ${seriousViolations.length} serious/critical accessibility violations`
    );
  }
});

Then('there should be fewer than {int} accessibility violations', async (maxViolations) => {
  const violationCount = accessibilityResults.violations.length;
  
  if (violationCount >= maxViolations) {
    throw new Error(
      `Expected fewer than ${maxViolations} violations, but found ${violationCount}`
    );
  }
});

Then('the page should pass WCAG 2.2 AA requirements', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.runWCAG22AAScan();
  helper.assertNoViolations(accessibilityResults);
});

Then('the page should pass EAA requirements', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.runEAAScan();
  helper.assertNoViolations(accessibilityResults);
});

Then('the page should pass ADA requirements', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.runADAScan();
  helper.assertNoViolations(accessibilityResults);
});

// Report generation steps
Then('the user generates an accessibility report', async () => {
  const helper = getAccessibilityHelper();
  accessibilityReport = helper.generateReport(accessibilityResults);
  console.log('Accessibility Report Summary:');
  console.log(JSON.stringify(accessibilityReport.summary, null, 2));
});

Then('the user saves the accessibility report as {string}', async (filename) => {
  const helper = getAccessibilityHelper();
  await helper.saveReport(accessibilityResults, filename);
});

Then('the user logs the accessibility summary', async () => {
  const helper = getAccessibilityHelper();
  const summary = helper.getViolationSummary(accessibilityResults);
  
  console.log('\n=== Accessibility Scan Summary ===');
  console.log(`Total Violations: ${summary.total}`);
  console.log(`  - Critical: ${summary.critical}`);
  console.log(`  - Serious: ${summary.serious}`);
  console.log(`  - Moderate: ${summary.moderate}`);
  console.log(`  - Minor: ${summary.minor}`);
  console.log(`Passes: ${summary.passes}`);
  console.log(`Incomplete: ${summary.incomplete}`);
  console.log('==================================\n');
});

// Violation detail steps
Then('the user should see {int} critical violations', async (expectedCount) => {
  const criticalCount = accessibilityResults.violations.filter(
    v => v.impact === 'critical'
  ).length;
  
  if (criticalCount !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} critical violations, but found ${criticalCount}`
    );
  }
});

Then('the user should see {int} serious violations', async (expectedCount) => {
  const seriousCount = accessibilityResults.violations.filter(
    v => v.impact === 'serious'
  ).length;
  
  if (seriousCount !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} serious violations, but found ${seriousCount}`
    );
  }
});

Then('the user logs all violations', async () => {
  if (accessibilityResults.violations.length === 0) {
    console.log('No accessibility violations found!');
    return;
  }
  
  console.log('\n=== Accessibility Violations ===');
  accessibilityResults.violations.forEach((v, index) => {
    console.log(`\n${index + 1}. [${v.impact.toUpperCase()}] ${v.id}`);
    console.log(`   Description: ${v.help}`);
    console.log(`   WCAG: ${v.tags.filter(t => t.startsWith('wcag')).join(', ')}`);
    console.log(`   Affected elements: ${v.nodes.length}`);
    console.log(`   Help: ${v.helpUrl}`);
  });
  console.log('\n================================\n');
});

// Combined compliance check
When('the user runs a combined WCAG, EAA, and ADA compliance scan', async () => {
  const helper = getAccessibilityHelper();
  currentScanType = 'Combined (WCAG + EAA + ADA)';
  accessibilityResults = await helper.runAccessibilityScan({
    tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
  });
  helper.appendToMarkdownReport(accessibilityResults, currentPageName, currentScanType);
});

Then('the page should meet all accessibility standards', async () => {
  const helper = getAccessibilityHelper();
  
  // Run comprehensive scan
  accessibilityResults = await helper.runAccessibilityScan({
    tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  });
  
  // Allow minor violations but fail on critical/serious
  helper.assertNoCriticalViolations(accessibilityResults);
  
  // Log summary
  const summary = helper.getViolationSummary(accessibilityResults);
  console.log(`Accessibility check complete: ${summary.total} total violations`);
  console.log(`  Critical: ${summary.critical}, Serious: ${summary.serious}`);
});

// Exclude elements from scan
When('the user runs accessibility scan excluding {string}', async (excludeSelector) => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.runAccessibilityScan({
    exclude: [excludeSelector],
  });
});

When('the user runs accessibility scan excluding ads and third-party content', async () => {
  const helper = getAccessibilityHelper();
  accessibilityResults = await helper.runAccessibilityScan({
    exclude: [
      'iframe',
      '[class*="ad"]',
      '[id*="ad"]',
      '.advertisement',
      '.third-party',
      '#google_ads',
    ],
  });
});
