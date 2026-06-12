sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";
    return Common.extend("com.asint.ais.library.datasource.asint.Lopa", {

        baseURI: "",

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
         * Function to create LOPA analysis
         * @param {Object} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createLopaAnalysis: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createLopaAnalysis");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },
    });
});