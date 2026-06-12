sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.ApiExplorer", {

        _baseURI: "",
        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
        },

        URL: URL,


        /**
		 * Function to trigger a test run
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        fnTriggerTestRun: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "triggerTestRun");
            this.postData(sUrl, {}, {}, fnSuccess, fnError, true);
        }
    });

});