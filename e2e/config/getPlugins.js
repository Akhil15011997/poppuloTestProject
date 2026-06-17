function getPlugins(profile) {
  const plugins = {
    // Allure reporting - rich HTML reports with screenshots, steps, and attachments
    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
      resultsDir: './output/allure-results',
    },
    // Capture full page screenshots on test failure
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
      uniqueScreenshotNames: true,
    },
    // Retry failed steps to handle transient failures
    retryFailedStep: {
      enabled: true,
      retries: 2,
      minTimeout: 1000,
      maxTimeout: 5000,
    },
    // Enable tryTo for soft assertions
    tryTo: {
      enabled: true,
    },
    // Pause on failure for debugging (disabled in CI)
    pauseOnFail: {
      enabled: process.env.DEBUG === 'true',
    },
    // Auto delay between actions (disabled by default for speed)
    autoDelay: {
      enabled: false,
      delayBefore: 100,
    },
    // Custom reporter for console output
    customLocator: {
      enabled: true,
      attribute: 'data-testid',
    },
  };

  // Add self-healing if enabled
  if (profile.withHeal) {
    plugins.heal = {
      enabled: true,
    };
  }

  return plugins;
}

module.exports = { getPlugins };
