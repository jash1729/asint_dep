/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library com.asint.ais.library.
 */
sap.ui.define(["sap/ui/core/library"], // library dependency
    function () {

        "use strict";

        /**
		 * AsInt AIS Library
		 *
		 * @namespace
		 * @name com.asint.ais.library
		 * @author SAP SE
		 * @version 1.0.0
		 * @public
		 */

        // delegate further initialization of this library to the Core
        sap.ui.getCore().initLibrary({
            name: "com.asint.ais.library",
            version: "1.0.0",
            dependencies: ["sap.ui.core"],
            noLibraryCSS: true,
            types: [],
            interfaces: [],
            controls: [
                "com.asint.ais.library.controls.Example"
            ],
            elements: [],
            datasource: [
                "com.asint.ais.library.datasource.BaseSource"
            ],
            controller: [
                "com.asint.ais.library.controller.Utility"
            ],
            model: [
                "com.asint.ais.library.model.formatter"
            ]
        });

        window.com.asint.ais.utils = {
            p13n: {
                view: "",
                registeredFor: []
            } 
        };

        /* eslint-disable */
		return com.asint.ais.library;
		/* eslint-enable */

    }, /* bExport= */ false);