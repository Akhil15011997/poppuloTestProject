const fs = require('fs');
const path = require('path');

// Report directories
const outputDir = path.join(__dirname, '..', 'output');
const allureResultsDir = path.join(outputDir, 'allure-results');
const allureReportDir = path.join(__dirname, '..', 'allure-report');

/**
 * Bootstrap function - runs before test execution starts
 * Cleans up previous report directories for a fresh run
 * 
 * @param {string} profile - The test profile being used
 */
async function bootstrap(profile) {
  console.log('Bootstrap: Starting test execution...');
  console.log(`Profile: ${profile}`);
  
  // Clean up previous report directories for fresh run
  try {
    if (fs.existsSync(allureResultsDir)) {
      fs.rmSync(allureResultsDir, { recursive: true, force: true });
      console.log('Bootstrap: Cleaned previous allure-results directory');
    }
    if (fs.existsSync(allureReportDir)) {
      fs.rmSync(allureReportDir, { recursive: true, force: true });
      console.log('Bootstrap: Cleaned previous allure-report directory');
    }
  } catch (error) {
    console.warn('Bootstrap: Could not clean report directories:', error.message);
  }
}

module.exports = { bootstrap, allureResultsDir, allureReportDir };
