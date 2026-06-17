const localConfig = require('./testData.local');
const stagingConfig = require('./testData.staging');
const prodConfig = require('./testData.prod');

const getConfig = env => {
  switch (env) {
    case 'local':
      return localConfig;
    case 'staging':
      return stagingConfig;
    case 'prod':
      return prodConfig;
    default:
      return localConfig;
  }
};

module.exports = getConfig(process.env.ENVIRONMENT);
