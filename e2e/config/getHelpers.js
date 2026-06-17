const path = require('path');

/**
 * Determines if the current test suite is API-only based on profile
 * API-only tests don't need browser launch
 */
function isApiOnlyMode(browser) {
  return browser === 'apiOnly' || browser === 'api';
}

function getHelpers(browser, helper, envConfig) {
  // API-only mode - no browser needed
  if (isApiOnlyMode(browser)) {
    return {
      REST: {
        endpoint: envConfig.apiBaseUrl,
        timeout: 5000,
        defaultHeaders: {
          'Content-Type': 'application/json',
        },
      },
      ChaiWrapper: {
        require: 'codeceptjs-chai',
      },
    };
  }

  const browserConfigs = {
    // Desktop browsers
    chromeHeadless: {
      browser: 'chromium',
      show: false,
      windowSize: '1920x1080',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    chrome: {
      browser: 'chromium',
      show: true,
      windowSize: '1920x1080',
    },
    firefox: {
      browser: 'firefox',
      show: true,
      windowSize: '1920x1080',
    },
    firefoxHeadless: {
      browser: 'firefox',
      show: false,
      windowSize: '1920x1080',
    },
    webkit: {
      browser: 'webkit',
      show: true,
      windowSize: '1920x1080',
    },
    webkitHeadless: {
      browser: 'webkit',
      show: false,
      windowSize: '1920x1080',
    },
    // Mobile browsers (emulate sets viewport, windowSize sets browser window)
    mobileChrome: {
      browser: 'chromium',
      show: true,
      windowSize: '500x900',
      emulate: { deviceName: 'Pixel 5' },
    },
    mobileChromeHeadless: {
      browser: 'chromium',
      show: false,
      emulate: { deviceName: 'Pixel 5' },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    mobileSafari: {
      browser: 'webkit',
      show: true,
      windowSize: '500x900',
      emulate: { deviceName: 'iPhone 12' },
    },
    mobileSafariHeadless: {
      browser: 'webkit',
      show: false,
      emulate: { deviceName: 'iPhone 12' },
    },
    tablet: {
      browser: 'chromium',
      show: true,
      windowSize: '1100x900',
      emulate: { deviceName: 'iPad Pro 11' },
    },
    tabletHeadless: {
      browser: 'chromium',
      show: false,
      emulate: { deviceName: 'iPad Pro 11' },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  };

  const browserConfig = browserConfigs[browser] || browserConfigs.chromeHeadless;

  const helpers = {
    Playwright: {
      url: envConfig.baseUrl,
      ...browserConfig,
      timeout: 10000,
      waitForTimeout: 10000,
      waitForNavigation: 'domcontentloaded',
      // Keep browser session open across tests - only restart context, not browser
      // Use 'session' to keep same browser instance, 'context' for new context per scenario
      restart: 'session',
      keepBrowserState: true,
      keepCookies: false,
      manualStart: false,
      trace: true,
      video: false,
      fullPageScreenshots: true,
    },
    PlaywrightHelper: {
      require: path.join(__dirname, '../helpers/playwrightHelper.js'),
    },
    REST: {
      endpoint: envConfig.apiBaseUrl,
      timeout: 30000,
    },
    ChaiWrapper: {
      require: 'codeceptjs-chai',
    },
    AccessibilityHelper: {
      require: path.join(__dirname, '../helpers/accessibilityHelper.js'),
    },
  };

  return helpers;
}

module.exports = { getHelpers };
