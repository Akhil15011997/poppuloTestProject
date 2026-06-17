const fs = require('fs');
const path = require('path');
const { include } = require('./pageIncludes');
const { getHelpers } = require('./getHelpers');
const { getPlugins } = require('./getPlugins');

const testsPath = path.join(__dirname, '../tests');
const stepFileMatch = /\.steps\.js$/;

const defaultProfile = 'local:@smoke:chromeHeadless:playwright';

function parseProfile(profileString) {
  const parts = profileString.split(':');
  return {
    environment: parts[0] || 'local',
    suite: parts[1] || '@smoke',
    browser: parts[2] || 'chromeHeadless',
    helper: parts[3] || 'playwright',
    withHeal: parts[4] === 'true',
  };
}

function scanStepFiles(directory, pattern) {
  const stepFiles = [];
  
  function scan(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        scan(fullPath);
      } else if (pattern.test(item.name)) {
        stepFiles.push(fullPath);
      }
    }
  }
  
  scan(directory);
  return stepFiles;
}

function getEnvironmentConfig(environment) {
  const envConfigs = {
    local: {
      baseUrl: 'https://automationexercise.com',
      apiBaseUrl: 'https://automationexercise.com/api',
    },
    staging: {
      baseUrl: 'https://automationexercise.com',
      apiBaseUrl: 'https://automationexercise.com/api',
    },
    production: {
      baseUrl: 'https://automationexercise.com',
      apiBaseUrl: 'https://automationexercise.com/api',
    },
  };
  
  return envConfigs[environment] || envConfigs.local;
}

function aggregate(profileString) {
  const profile = parseProfile(profileString || defaultProfile);
  const envConfig = getEnvironmentConfig(profile.environment);
  
  console.log('=== E2E Configuration ===');
  console.log(`Environment: ${profile.environment}`);
  console.log(`Suite: ${profile.suite}`);
  console.log(`Browser: ${profile.browser}`);
  console.log(`Helper: ${profile.helper}`);
  console.log(`Base URL: ${envConfig.baseUrl}`);
  console.log('========================');
  
  const stepsFiles = scanStepFiles(testsPath, stepFileMatch);
  console.log(`Found ${stepsFiles.length} step file(s)`);
  
  const helpersConfig = getHelpers(profile.browser, profile.helper, envConfig);
  const pluginsConfig = getPlugins(profile);
  
  // Add environment data to includes
  const includeWithEnv = {
    ...include,
    envConfig: () => envConfig,
    testProfile: () => profile,
  };
  
  return {
    include: includeWithEnv,
    grep: profile.suite,
    steps: stepsFiles,
    helpers: helpersConfig,
    plugins: pluginsConfig,
    environment: profile.environment,
    envConfig,
  };
}

module.exports = {
  aggregate,
  parseProfile,
  getEnvironmentConfig,
};
