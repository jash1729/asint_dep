sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.KPI", {

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

        /**
		 * Retrieves the assessment template wise count.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentTemplateWiseCount: function (fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "kpiASDTemplateWiseCount");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the inspection assessment count .
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentCountWithUser: function (fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "kpiASDAssessmentCountWithUser");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the assessment location list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionAssessmentCount: function (fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "kpiInspAssessmentCount");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

    });

});