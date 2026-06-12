sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.Analytics", {

        _baseURI: "",
        URL: URL,

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
         * Function to fetch Analytics Data
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchAnalyticsData: function(sType, fnSuccess, fnError) {
            var sUrl = "", oParam = {};

            if(sType === "all") {
                sUrl = this.getUrl(this._baseURI, "fetchAllAnalyticsData");

            } else {
                sUrl = this.getUrl(this._baseURI, "fetchSpecificAnalyticsData");
                oParam = {
                    "sSearchKey": sType,
                };

            }


            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        
        /**
         *Function to fetch MTTR or MTBF value based on type passed for a specific asset and set it to model
         * @param {string} sType
         * @param {string} sAssetId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fetchMttrOrMtbfValueSpecficToAsset: function (sType, sAssetId, fnSuccess, fnError) {
 
            var sUrl = this.getUrl(this._baseURI, "fetchMttrOrMtbfValue");
 
            var oParam = {
                "sSearchKey": sType,
                "sAssetId": sAssetId
            };
 
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },


        /**
         * Function to fetch Failure Rate
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchFailureRateData: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchFailureRateData");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Weibull Analysis Data
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchWeibullAnalysisData: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchWeibullAnalysisData");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to create reliability analytics entry
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addOrUpdateAnalyticsData: function(sAnalyticsId, oPayload, fnSuccess, fnError) {
            var sUrl = "";

            if(sAnalyticsId) {
                sUrl = this.getUrl(this._baseURI, "updateReliabilityAnalytics");
                var oParam = {
                    "sAnalyticsId": sAnalyticsId,
                };
                
                this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true)
                
            } else {
                sUrl = this.getUrl(this._baseURI, "addReliabilityAnalytics");

                this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
            }

        },


        /**
         * Function to fetch MTBF Data
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchMTBFData: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchMTBFData");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },



        /**
         * Function to fetch MTTR Data
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchMTTRData: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchMTTRData");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Lognormal Analysis Data
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fetchLognormalAndNormalAnalysisData: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchLognormalAndNormalAnalysisData");
 
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },


        /**
         * Function to fetch weibull 2 parameter data with additional fields
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchWeibull2PAdditionalData: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchWeibull2PAdditionalData");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

    });
});