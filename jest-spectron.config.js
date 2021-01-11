const jestConfig = require('./jest.config')

module.exports = {
  ...jestConfig,
  testMatch: ['**/tests/spectron/**/*.spec.[jt]s?(x)'],
}
