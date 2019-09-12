module.exports = {
  verbose: true,
  collectCoverageFrom: ['src/**/*.{js}', '!**/node_modules/**'],
  testMatch: ['<rootDir>/tests/**/?(*.)test.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
};
