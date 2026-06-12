sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.OrganizationSettings", {
        URL: URL,

        _baseURI: "",

        /**
         * Constructor function to store base uri
         * @param {string} sBaseURI 
         */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;

        },

        /**
         * To fetch S4 destinations list
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getDestinationsList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getDestinationsList");
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * To fetch assigned s4 destination
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getOrgSettings: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getOrgSettings");
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * To add the s4 destination if it is not present  
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        assignS4Destination: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getOrgSettings");
            var oParam = {};
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
         * To update the assigned S4 destination with the selected destination
         * @param {String} sOrgSettingsId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateS4Destination: function (sOrgSettingsId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateOrgSettings");
            var oParam = {
                "sOrgSettingsId": sOrgSettingsId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * To add the filters  
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        assignFilters: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assignFilters");
            var oParam = {};
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * To add the filters  
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFiltersList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assignFilters");
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Update Filtersate filters
         * @param {String} sOrgSettingsId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateFilters: function (sOrgSettingsId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateFilters");
            var oParam = {
                "sOrgSettingsId": sOrgSettingsId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },
    });

});