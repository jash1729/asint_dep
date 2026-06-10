/* global QUnit */
QUnit.config.autostart = false;

// Took from Qunit 2.3.2
// Based on Java's String.hashCode, a simple but not rigorously collision resistant hashing function
/**
 * Generates a hash for a module and test name
 * @param {string} module - Module name
 * @param {string} testName - Test name
 * @returns {string} Hash string
 */
function generateHash(module, testName) {
    var str = module + "\x1C" + testName;
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
    // strictly necessary but increases user understanding that the id is a SHA-like hash
    var hex = (0x100000000 + hash).toString(16);
    if (hex.length < 8) {
        hex = "0000000" + hex;
    }
    return hex.slice(-8);
}

var internalModuleIds = [];
// Function to get URL parameter
/**
 * Gets URL parameter by name
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value
 */
function getUrlParameter(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Read module names from:
// 1. URL parameter (?modules=App Controller,View1 Controller)
// 2. window.TEST_MODULES (injected by CI)
// 3. Fallback to hardcoded defaults for local development

var modulesParam = getUrlParameter("modules");
var moduleNames = [];

if (modulesParam) {
    // From URL parameter (comma-separated)
    moduleNames = modulesParam.split(",").map(function(name) {
        return name.trim();
    });
} else if (window.TEST_MODULES) {
    // From window variable (injected by CI)
    moduleNames = window.TEST_MODULES;
}

// Convert module names to internal IDs using hash function
moduleNames.forEach(function(module) {
    var moduleId = generateHash(module);
    internalModuleIds.push(moduleId);
});

if (internalModuleIds && internalModuleIds.length > 0) {
    QUnit.config.moduleId = internalModuleIds;
    // eslint-disable-next-line no-console
    console.log("Running test modules: " + moduleNames.join(", "));
} else {
    // eslint-disable-next-line no-console
    console.log("Running ALL test modules");
}

sap.ui.getCore().attachInit(function () {
    "use strict";
    sap.ui.loader.config({
        paths: {
            "com/asint/ais/library": "/asint_ais_library/com/asint/ais/library"
        }
    });
    sap.ui.require(
        ["comasintaismicml/cml/test/unit/AllTests"],
        function () {
            QUnit.start();
        },
    );
});
