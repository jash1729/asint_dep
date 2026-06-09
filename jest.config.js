module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: ["srv/**/*.js"],
  coverageThreshold: {
    global: {
      lines: 0
    }
  }
};
