module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['public/scripts/**/*.js'],
};
