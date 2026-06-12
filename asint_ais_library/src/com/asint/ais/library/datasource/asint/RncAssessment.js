/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.RncAssessment", {

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
         * Clone RNC assessment.
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        cloneRncAssessment: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "cloneRnc");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
           
        /**
         * Fetches RNC assessment details for a given RNC ID.
         */
        getRncDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaDetails");
            this.getData(sUrl, { "sRcaId": sId }, fnSuccess, fnError, true);
        },

        /**
         * Updates RNC assessment details
         */
        updateRncDetails: function (sId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaDetails");
            this.patchData(sUrl, { "sRcaId": sId }, oPayload, fnSuccess, fnError, true);
        },

        /**
         * 
         */
        getRncRolesDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaRoles");
            this.getData(sUrl, { "sRcaId": sId }, fnSuccess, fnError, true);
        },

        /**
         * Updates RNC assessment roles details such as role assignments and access levels for different users.
         */
        updateRncRolesDetails: function (sId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaRoles");
            this.patchData(sUrl, { "sRcaId": sId }, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Validates whether the selected technical objects are already assigned to another assessment.
         */
        validateAssignTechinaclObject: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "validateAssignTechinaclObject");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Fetches RNC assessment header details along with associated strategies for a given RNC ID.
         */
        getRncAssessmentHeaderWithStrategies: function (sId, fnSuccess, fnError) {
            var that = this;
            this.getRncDetails(sId, function (oHeaderResponse) {
                if (oHeaderResponse && oHeaderResponse.ID) {
                    that.fnMakeGetRequest(that.getUrl(that._baseURI, "getRncStrategies"), { "sRcaId": sId }, function (oStrategiesResponse) {
                        oHeaderResponse.strategies = oStrategiesResponse;
                        fnSuccess(oHeaderResponse);
                    });
                } else {
                    fnSuccess(oHeaderResponse);
                }
            }, fnError);
        },

        /**
         * Fetches technical objects for RNC assessment details view
         */
        fetchTechObjsForRncAssessment: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchRncTechObj");
            this.getData(sUrl, { "sRcaId": sId }, fnSuccess, fnError, true);
        },

        /**
         * Publishes multiple RNC assessments in bulk for workflow use case.
         */
        bulkPublishRNC: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkPublishRNC");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * fetches workflow details for multiple RNC assessments in bulk 
         */
        getBulkRNCDetailsForWorkflow: function (aAssessmentId, fnSuccess, fnError) {
            var that = this;
            var iProcessed = 0, iTotal = aAssessmentId.length;
            var aRNCPayload = [];

            /**
             * Completes the processing of a single RNC assessment.
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    if (fnSuccess) {
                        fnSuccess(aRNCPayload);
                    }
                }
            };

            aAssessmentId.forEach(function (sAssessmentId) {
                that.getRncDetails(sAssessmentId, function (oData) {
                    aRNCPayload.push(oData);
                    fnComplete();
                }, fnError);
            });
        },

        /**
         * Fetches technical objects for multiple RNC assessments in bulk.
         */
        bulkfetchRncTechObj: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkfetchRncTechObj");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        }

    });

});