sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.RcaTemplate", {

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
		 * Create RcaTemplate.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRcaTemplate: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createRcaTemplate");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
        * function to fetch rca template details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRcaTemplateDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaTemplateDetails");
            var oParam = {
                "sRcaTemplateId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * function to fetch rca template details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        updateRcaTemplateDetails: function (sRcaId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcaTemplateDetails");
            var oParam = {
                "sRcaTemplateId": sRcaId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
        * function to fetch rca template details for impacts tab
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRcaTemplateImpactDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaTemplateImpactDetails");
            var oParam = {
                "sRcaTemplateId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Create RcaTemplate Impact
         * 
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRcaTemplateImpact: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createRcaTemplateImpact");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Update RcaTemplate Impact
         * 
         * @param {String} sImpactId  
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateRcaTemplateImpact: function (sImpactId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaTemplateImpact");
            var oParam = {
                "impactId": sImpactId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Update RcaTemplate Impact detail
         * 
         * @param {String} sImpactId  
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateRcaTemplateImpactWithDetail: function (sImpactId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaTemplateImpactWithDetail");
            var oParam = {
                "impactId": sImpactId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Update RcaTemplate Impact Dimension
         * 
         * @param {String} sDimensionId  
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateRcaTemplateDimension: function (sDimensionId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaTemplateDimension");
            var oParam = {
                "dimensionId": sDimensionId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Get Rca Template Impact dimensions
         * @param {String} sImpactId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcaTemplateImpactDimensionsThresholds: function (sImpactId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaTemplateImpactDimensionsThresholds");
            var oParam = {
                "impactId": sImpactId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
        
        /**
         * 
         * @param {} thresholdId 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateRcaThresholdsInTemplate: function (thresholdId, oPayload, fnSuccess, fnError,eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcaTemplateDetails");
            var oParam = {
                "sRcaTemplateId": thresholdId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true,eTag);
        },

        /**
         * 
         * @param {*} sImpactId 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateRcaThresholdsInImpact:function (sImpactId, oPayload, fnSuccess, fnError,etag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaTemplateImpact");
            var oParam = {
                "impactId": sImpactId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true,etag);
        },

        /**
         * Function to clone an existing RCA Template
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        copyRcaTemplate: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "copyRcaTemplate");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
       
        /**
         * Functon to fetch count
         * @param {String} sTemplateId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchCount:function(sTemplateId,fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "rcaAssessmentCount");
            var oParam = {
                "templateId": sTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        }
    });

});