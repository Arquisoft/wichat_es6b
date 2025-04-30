module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    'questions.js',
    'all_questions.js'
  ],
  testMatch: ['**/*.test.js'],
  verbose: true
}; 