sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.MaintenancePlan", {
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
         * 
         * @param {string} sPlanId contains Id
         * @param {Function} fnSuccess holds success callback for function
         * @param {Function} fnError holds error callback for function
         */
        getPlanDetail: function (sPlanId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getPlan");
            sUrl = sUrl.replace("{planId}", sPlanId);

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to get Scheduling Data
         * 
         * @param {string} sPlanId contains Id
         * @param {Function} fnSuccess holds success callback for function
         * @param {Function} fnError holds error callback for function
         */
        getSchedulingDetail: function(sPLanId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getPlan") + ",to_maintenance_planCallSchedule($expand=to_maintenance_calls)";
            var oParam = {
                "planId" : sPLanId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to get Items Data
         * @param {string} sPlanId contains Id
         * @param {Function} fnSuccess holds success callback for function
         * @param {Function} fnError holds error callback for function
         */
        getMaintenaceItems: function (sPlanId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMaintenaceItems");
            sUrl = sUrl.replace("{planId}", sPlanId);

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to get the Status for adapt Filter
         * 
         * @param {Function} fnSuccess holds success callback for function
         * @param {Function} fnError holds error callback for function
         */
        getStatusForAdaptFilter: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getStatusForAdaptFilter");
            this.getData(sUrl, {}, fnSuccess, fnError);
        }


    });

});