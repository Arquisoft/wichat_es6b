module.exports = {
  testMatch: ["**/steps/*.steps.js"],
  testTimeout: 150000,
  setupFilesAfterEnv: ["expect-puppeteer"],
  testEnvironment: "node"
};