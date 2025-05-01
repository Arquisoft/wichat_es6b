module.exports = {
  testMatch: ["**/steps/*.steps.js"],
  testTimeout: 60000,
  setupFilesAfterEnv: ["expect-puppeteer"],
  testEnvironment: "node"
};