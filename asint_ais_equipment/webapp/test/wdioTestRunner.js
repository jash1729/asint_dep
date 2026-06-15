const { spawn } = require("child_process");
const http = require("http");
const kill = require("tree-kill");
const path = require("path");
let serverProcess;
const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

// Get project root directory (2 levels up from this file: project1/)
const projectRoot = path.resolve(__dirname, "../..");
const configPath = path.relative(projectRoot, path.join(__dirname, "wdio.conf.js"));

// Check if server is running
/**
 * Checks if the server is running
 * @returns {Promise<boolean>} True if server is running
 */
function isServerRunning() {
    return new Promise((resolve) => {
        http.get("http://localhost:8080", () => {
            resolve(true);
        }).on("error", () => {
            resolve(false);
        });
    });
}
// Wait for server to be ready
/**
 * Waits for the server to be ready
 * @returns {Promise<boolean>} True if server becomes ready
 */
async function waitForServer() {
    for (let i = 0; i < 60; i++) {  // Increased timeout for CI
        if (await isServerRunning()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
}
// Start server
/**
 * Starts the UI5 server
 * @returns {Promise<boolean>} True if server started successfully
 */
async function startServer() {
    // eslint-disable-next-line no-console
    console.log("Starting UI5 server on port 8080...");
    serverProcess = spawn("npx", ["fiori", "run", "--port", "8080"], {
        shell: true,
        stdio: "ignore",
        detached: false
    });

    const ready = await waitForServer();
    if (ready) {
        // eslint-disable-next-line no-console
        console.log("\u2713 Server is ready\n");
    }
    return ready;
}
// Run tests
/**
 * Runs the WebDriver tests
 * @returns {Promise<boolean>} True if tests passed
 */
function runTests() {
    // eslint-disable-next-line no-console
    console.log("Running tests...\n");
    return new Promise((resolve) => {
        const wdio = spawn("npx", ["wdio", "run", configPath], {
            shell: true,
            stdio: "inherit",
            cwd: projectRoot
        });
        wdio.on("close", (code) => {
            resolve(code === 0);
        });
    });
}
// Cleanup
/**
 * Cleans up the server process
 * @returns {Promise<void>} Promise that resolves when cleanup is complete
 */
async function cleanup() {
    if (serverProcess) {
        await new Promise((resolve) => {
            kill(serverProcess.pid, () => {
                resolve();
            });
        });
    }
}
// Main
/**
 * Main function to run tests
 * @returns {Promise<void>} Promise that resolves when tests are complete
 */
async function main() {
    try {
        // In CI, always start fresh. Locally, check if already running
        if (!isCI && await isServerRunning()) {
            // eslint-disable-next-line no-console
            console.log("\u2713 Server already running\n");
        } else {
            if (!(await startServer())) {
                throw new Error("Server failed to start");
            }
        }
        const success = await runTests();
        await cleanup();
        process.exit(success ? 0 : 1);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error:", error.message);
        await cleanup();
        process.exit(1);
    }
}
process.on("SIGINT", async () => {
    await cleanup();
    process.exit(130);
});
main();