sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.Rca", {

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
		 * Create Rca.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRca: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createRca");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
        * function to fetch rca details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRcaDetails: function (sId, fnSuccess, fnError) { // TODO: RCA > RNC name change
            var sUrl = this.getUrl(this._baseURI, "getRcaDetails");
            var oParam = {
                "sRcaId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * function to fetch rnc details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRncDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaDetails");
            var oParam = {
                "sRcaId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * function to fetch rca roles details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRcaRolesDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaRoles");
            var oParam = {
                "sRcaId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Update Rca Details
         * @param {String} sRcaId 
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRcaDetails: function (sRcaId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcaDetails");
            var oParam = {
                "sRcaId": sRcaId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Update Rnc Details
         * @param {String} sRcaId 
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRncDetails: function (sRcaId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcaDetails");
            var oParam = {
                "sRcaId": sRcaId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Update Rca Details
         * @param {String} sRcaId 
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRcaDetail: function (sRcaId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaDetails");
            var oParam = {
                "sRcaId": sRcaId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to get additional fields for RCA Template
         * @param {String} sId  
         * @param {function} fnSuccess
         * @param {function} fnError
         */    
        getaddionalfieldsforRcaTemplate: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getaddionalfieldsforRcaTemplate");
            var oParam = {
                sRcaTemplateId: sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Update Rca Roles Details
         * @param {String} sRcaId 
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRcaRolesDetails: function (sRcaId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcaRoles");
            var oParam = {
                "sRcaId": sRcaId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to get Technical Objects list for a specific RC Assessment
         * @param {String} sRcaId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcAssessmentSpecificTechObj: function (sRcaId, fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "getRcaTechnicalObjectsList");
            var oParam = {
                "sRcaId": sRcaId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to update Technical Objects for a specific RC Assessment
         * @param {String} sTOId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRcaSpecificTechObj: function (sTOId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcaTechObj");
            var oParam = {
                "sTOId": sTOId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to get RCA Impacts
         * @param {String} sRcaTempId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcaImpacts: function(sRcaTempId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaImpacts");
            var oParam = {
                "sRcaTempId": sRcaTempId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch RCA Impact Data with respect to Technical Object
         * @param {String} sTOId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcaImpactData: function(sTOId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaImpactData");
            var oParam = {
                "sTOId": sTOId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch dimensions for specific RCA Impact
         * @param {String} sImpactId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcaImpactDimensions: function (sImpactId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaImpactDimensions");
            var oParam = {
                "sImpactId": sImpactId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch dimensions for specific RCA Impact
         * @param {String} sRcAssessmentTemplateID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcaImpactDimensionsAlphaNum: function (sRcAssessmentTemplateID, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaImpactDimensionsAlphaNum");
            var oParam = {
                "sRcAssessmentTemplateID": sRcAssessmentTemplateID,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Failure Modes for a specific RCA Profile
         * @param {String} sProfileName 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFailureModes: function (sProfileName, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getFailureModes");

            var oParam = {
                "sProfileName": sProfileName,
                "sCatalogeType": "FAILURE_MODE"
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch RC Templates
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcTemplates: function(fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getPublishedRCTemplates");

            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * function to fetch Maintenance Revision
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getTechnicalObjectDetails: function (sRcaId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getTechObjDetail");
            var oParam = {
                "sRcaId":sRcaId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Bulk Update MDA
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
        */
        bulkUpdateMDA : function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkUpdateMDA");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Update MDA & Criticality
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
        */
        UpdateCriticalityMDA : function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "UpdateCriticalityMDA");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to validate Technical Objects getting assigned to Assessments
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        validateAssignTechinaclObject: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "validateAssignTechinaclObject");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
        
        /**
		 * Function to bulk publish RCA
         * @param {Array} aPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        bulkPublishRCA: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkPublishRCA");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
		 * Function to bulk publish RNC
         * @param {Array} aPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        bulkPublishRNC: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkPublishRCA");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to apply same assessment results to another TO
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        applyTo: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "applyTo");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to bulk update assessment results
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkUpdateRcaSpecificTechObj: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkUpdateRcaSpecificTO");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Technical Objects specific to RCM Assessment
         * @param {String} sRncID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchTechObjsForRncAssessment: function(sRncID, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getTechnicalObjectForRncAssessment");

            var oParam = {
                "sRncID": sRncID
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to generate report
         * @param {String} sRncId 
         */
        generateReport: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generateReport");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {*} aAssessmentId 
         * @param {*} fnSuccess 
         */
        getBulkRNCDetailsForWorkflow: function (aAssessmentId, fnSuccess) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getBulkRNCDetailsForWorkflow");
            var iProcessed = 0, iTotal = 0; 
            // var iError = 0;
            var aRNCPayload = [];

            /**
             * Function to check completion
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    if (fnSuccess) {
                        fnSuccess(aRNCPayload);
                    }
                }
            };

            /**
             * Function to process
             * 
             * @param {Array} aAssessmentId 
             * @param {Number} iCurrent 
             * @param {Number} iChunkSize 
             */
            var fnProcess = function (aAssessmentId, iCurrent, iChunkSize) {
                var aChunk = aAssessmentId.slice(iCurrent, iCurrent + iChunkSize);
                var iChunkProcessed = 0;
                /**
                 * Function to check chunk completion
                 */
                var fnChunkComplete = function () {
                    fnComplete();
                    iChunkProcessed++;
                    if (iChunkProcessed === iChunkSize) {
                        iCurrent = iCurrent + iChunkSize;
                        fnProcess(aAssessmentId, iCurrent, iChunkSize);
                    }
                };

                aChunk.forEach(function (sAssessmentId) {
                    var sRNCUrl = sUrl.replace("{assessmentId}", sAssessmentId);

                    that.fnMakeGetRequest(sRNCUrl, {}, function (oResponse) {
                        aRNCPayload.push(oResponse);
                        fnChunkComplete();
                    }, function () {
                        iError++;
                        fnChunkComplete();
                    }, false);
                });

            };

            iTotal = aAssessmentId.length;
            fnProcess(aAssessmentId, 0, 5);

        },

        /**
         * Function to bulk fetch assessments strategies
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkfetchRncTechObj: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkfetchRncTechObj");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },
    });

});