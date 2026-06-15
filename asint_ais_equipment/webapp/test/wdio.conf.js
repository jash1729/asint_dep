exports.config = {
    // ====================
    // Runner Configuration
    // ====================
    runner: "local",
    // ==================
    // Specify Test Files
    // ==================
    specs: [],
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    capabilities: [{
        browserName: "chrome",
        browserVersion: "stable",
        "goog:chromeOptions": {
            args: [
                // "headless",
                "disable-gpu",
                "window-size=1920,1080",
                "no-sandbox",
                "disable-dev-shm-usage",
                "log-level=3"
            ]
        }
    }],
    // ===================
    // Test Configurations
    // ===================
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8080",
    waitforTimeout: 200000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    // ========
    // Services
    // ========
    services: [
        ["qunit", {
            paths: [
                "test/unit/unitTests.qunit.html?coverage"
            ]
        }]
    ],
    // Framework - required even when using qunit service
    framework: "mocha",
    // Mocha options
    mochaOpts: {
        ui: "bdd",
        timeout: 300000
    },
    // Test reporter for stdout.
    reporters: ["spec"],
    // =======================
    // Hooks
    // =======================
    /**
     * Runs before test execution
     */
    before: function () {
        // Inject TEST_MODULES from environment variable into browser context
        const modulesString = process.env.TEST_MODULES_LIST;
        if (modulesString) {
            const modules = modulesString.split(",").map(m => m.trim());
            // Inject into browser's window object
            browser.execute((mods) => {
                window.TEST_MODULES = mods;
            }, modules);
            // eslint-disable-next-line no-console
            console.log(`\u2713 Injected ${modules.length} test module(s)`);
        }
        // No modules to inject
    }
};