const { aggregate } = require('./config/aggregate');
const { bootstrap } = require('./config/bootstrap');
const { teardown } = require('./config/teardown');

const profile = process.env.PROFILE || 'local:@smoke:chromeHeadless:playwright';
const aggregatedData = aggregate(profile);

exports.config = {
  tests: './tests/features/**/*.feature',
  output: './output',
  timeout: 60, // Global timeout in seconds (CodeceptJS uses seconds, not milliseconds)
  helpers: aggregatedData.helpers,
  include: aggregatedData.include,
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          verbose: true,
          steps: true,
        },
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: {
          mochaFile: './output/result-[hash].xml',
          attachments: true,
        },
      },
    },
  },
  bootstrap: () => bootstrap(profile),
  teardown,
  hooks: [],
  gherkin: {
    features: './tests/features/**/*.feature',
    steps: aggregatedData.steps,
  },
  plugins: aggregatedData.plugins,
  multiple: {
    parallel: {
      chunks: 4,
      browsers: ['chromium'],
    },
  },
  name: 'automation-exercise-e2e',
};
