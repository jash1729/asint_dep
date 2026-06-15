/* global QUnit */
QUnit.config.autostart = false;
sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.loader.config({
        paths: {
            "com/asint/ais/library": "/asint_ais_library/com/asint/ais/library"
        }
    });

    sap.ui.require([
        "com/asint/ais/mi/equipment/test/integration/AllJourneys",
    ], function () {
        QUnit.start();
    });
});