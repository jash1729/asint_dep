const { execSync } = require("child_process");

try {
    console.log("Building UI...");
    execSync("ui5 build", { stdio: "inherit" });

    console.log("UI build completed");
} catch (err) {
    console.error("UI build failed");
    process.exit(1);
}