const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Report directories
const outputDir = path.join(__dirname, '..', 'output');
const allureResultsDir = path.join(outputDir, 'allure-results');
const e2eDir = path.join(__dirname, '..');
const accessibilityReportPath = path.join(e2eDir, 'ACCESSIBILITY_REPORT.md');

/**
 * Check if accessibility tests were run based on PROFILE environment variable
 * @returns {boolean} True if accessibility tests were run
 */
function wasAccessibilityTestRun() {
  const profile = process.env.PROFILE || '';
  return profile.includes('@accessibility');
}

/**
 * Teardown function - runs after test execution completes
 * Generates Allure report automatically and displays view command
 */
async function teardown() {
  console.log('Teardown: Test execution completed.');
  
  // Generate Allure report automatically after test run
  try {
    if (fs.existsSync(allureResultsDir)) {
      console.log('Teardown: Generating Allure report...');
      execSync('npx allure generate ./output/allure-results -o ./allure-report --clean', {
        cwd: e2eDir,
        stdio: 'inherit',
      });
      console.log('Teardown: Allure report generated successfully!');
      console.log('');
      console.log('='.repeat(60));
      console.log('📊 VIEW TEST REPORT:');
      console.log('   pnpm run allure:open');
      console.log('');
      console.log('📊 REGENERATE & VIEW REPORT:');
      console.log('   pnpm run allure:report');
      
      // Show accessibility report info if accessibility tests were run
      if (wasAccessibilityTestRun() && fs.existsSync(accessibilityReportPath)) {
        console.log('');
        console.log('♿ ACCESSIBILITY REPORT:');
        console.log(`   📄 ${accessibilityReportPath}`);
        console.log('   Open with: open ACCESSIBILITY_REPORT.md');
      }
      
      console.log('='.repeat(60));
    } else {
      console.log('Teardown: No allure-results found, skipping report generation');
    }
  } catch (error) {
    console.error('Teardown: Failed to generate Allure report:', error.message);
    console.log('Teardown: You can manually generate the report with: pnpm run allure:generate');
  }
}

module.exports = { teardown };
