sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.MaintenanceSpendPlan", {

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
		 * Function to fetch MSP details
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMSPDetails: function (sId, fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "getMSPDetail");
            var oParam = {
                "sMspId":sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * function to fetch linked to program
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getLinkedToProgramEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "linkedToProgram");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * Get the FLOC Maintenance Plans
         * @param {*} sMspId 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getMspMaintenancePlanDetails: function (sMspId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getMspMaintenancePlanDetails"];
            var oParam = {
                "MspId": sMspId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * function to fetch linked to program
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getLinkedToProgramSubTypeEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "linkedToProgramSubType");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch budegt category
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getBudgetCategoryEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "budgetCategory");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch tranche list
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTrancheListEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "trancheList");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * function to fetch funding status enums
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getFundingStatusEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fundingStatus");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * Function to update MSP details
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        updateMSPDetails: function (sId, oPayload, fnSuccess, fnError, eTag) {
			
            var sUrl = this.getUrl(this._baseURI, "getMSPDetail");
            var oParam = {
                "sMspId":sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },
      
         
        /**
         * Function to update planning year
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updatePlanningYear: function (aPayload, fnSuccess, fnError) {
		
            var sUrl = this.getUrl(this._baseURI, "updatePlanningYear");
            this.patchData(sUrl,"", aPayload, fnSuccess, fnError, true);

        },

        /**
         * Function to bulk update
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkUpdate: function (aPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "mspBulkUpdate");
            this.patchData(sUrl,"", aPayload, fnSuccess, fnError, true);

        },

        /**
         * function to fetch Maintenance Revision
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getRecommendationMaintenanceRevisionEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recoMaintenanceEvent");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the sum of  vlaues.
		 * @param {Array} aPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getSumValue: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "calculateAvg");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError);
        },

        /**
         * function to fetch Maintenance Revision
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getTechnicalObjectDetails: function (sMspId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getTechObjDetails");
            var oParam = {
                "sMspId":sMspId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * function to fetch Notification and maintenance plan details
         * @param {String} sId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getMSPRiskDetailsWithCharInfo: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMSPRiskDetailsWithChar");
            var oParam = {
                "sMspId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * function to fetch Notification and maintenance plan details
         * @param {String} sId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateRiskDetils: function (sId, oPayload, fnSuccess, fnError, etag) {
            var sUrl = this.getUrl(this._baseURI, "updateMSPDetail");
            var oParam = {
                "sMspId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
         * Function to get notification that attached to the MSP linked Recommendation
         * 
         * @param {String} sAPMRecommendationId - APM Recommendation ID
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getLinkedNotifications: function (sAPMRecommendationId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getLinkedNotifications");
            var oParam = {
                "sAPMRecommendationId": sAPMRecommendationId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to get maintenance order that attached to the MSP linked Recommendation
         * 
         * @param {String} sGenRecommendationId - APM Recommendation ID
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getLinkedMaintenanceOrder: function (sGenRecommendationId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getLinkedMaintenanceOrder");
            var oParam = {
                "sGenRecommendationId": sGenRecommendationId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to get maintenance plan that attached to the MSP linked Recommendation
         * 
         * @param {String} sGenRecommendationId - APM Recommendation ID
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getLinkedMaintenancePlan: function (sGenRecommendationId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getMSPMaintenancePlan");
            var oParam = {
                "sGenRecommendationId": sGenRecommendationId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to get priority
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getMSPPriorityByOrderType: function (fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getMSPPriorityByOrderType");
            
            this.getData(sUrl, {}, fnSuccess, fnError, true);

        },

        /**
         * Function to get tasklist that attached to the MSP linked Recommendation
         * 
         * @param {String} sGenRecommendationId - APM Recommendation ID
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getLinkedTaskList: function (sGenRecommendationId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getMSPTaskList");
            var oParam = {
                "sGenRecommendationId": sGenRecommendationId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * function to fetch Child technical object data
         * @param {Array} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getChildData: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getChildrenData");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
        
        /**
         * Function to get the Technical object list
         * 
         * @param {String} sType - Technical Object Type
         * @param {String} sName - Technical Object Name
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getTechnicalObjectData: function (sType, sName, fnSuccess, fnError) {

            var sUrl = "", oParam = {};
            if (sType === "EQUI") {
                sUrl = this._baseURI + this.URL["maintenanceItemEquipment"];
                oParam = {
                    "sEquipmentName": sName
                };
            } else if (sType === "FLOC") {
                sUrl = this._baseURI + this.URL["maintenanceItemFLOC"];
                oParam = {
                    "sFlocName": sName
                };
            }           

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Function to fetch MSP details
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMSPAssessmentDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAssessmentMSPDetail");
            var oParam = {
                "sMspId":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * function to fetch Maintenance Cost Estimate Basis Enum
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getMaintenanceCostEstimateBasisEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintenanceCostEstimateBasisEnum");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch picklist for FIN risk
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getPickListEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "pickList");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch probability consequence values for FIN risk
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getProbabilityConsequenceValues: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "probabilityConsequenceValues");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * function to fetch Maintenance Cost Estimate Basis Enum
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getPicklistdata: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "sheRiskPicklist");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * Function to get MSP Details by Recommendation Id
         * 
         * @param {String} sRecommendatioId - Selected Recommendation Id
         * @param {Function} fnSuccess - Success Callback
         * @param {Function} fnError - Error Callback
         */
        getMSPDetailsByRecommendation: function (sRecommendatioId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "recommendationAssignedMSP");
            var oParam = {
                "sRecommendationId": sRecommendatioId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch MSP Workflow Data
         * @param {String} sMspId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getMSPDataWithWorkflow : function(sMspId,fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "mspWorkFlowData");
            var oParam = {
                "sMspId":sMspId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true); 

        },

        /**
         * Function to fetch MSP Workflow Data
         * @param {String} sMspId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {String} sEtag
         */
        updateMSPWorkflowData : function(sMspId,oPayload,fnSuccess,fnError,sEtag){

            var sUrl = this.getUrl(this._baseURI, "mspWorkFlowData");
            var oParam = {
                "sMspId":sMspId
            };
            this.patchData(sUrl,oParam,oPayload,fnSuccess, fnError, true,sEtag); 

        },

        /**
         * Function to fetch Defferal Follow-up Enums
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getDeferralFollowUpEnum : function(fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "getDeferralFollowUpEnum");
            this.getData(sUrl, {}, fnSuccess, fnError, true); 

        },

        /**
         * function to fetch Process stage
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getProcessData: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "processStage");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * Function that fetches the analytics data
         * @param {String} sUrl 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getAnalyticsData: function(url, fnSuccess, fnError) {
            this.getData(url, {}, fnSuccess, fnError, true);
        },

        /**
        * function to create recommendation
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        createRecommendationFromMsp: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createRecommendationFromMsp");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function that fetches the MaintenancePLanCall data
         * @param {String} sUrl 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getMaintenancePLanCall: function(sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getLinkedMaintenancePlanCalls");
            var oParam = {
                "sMspId":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Fetch Assigned MSPs
         * @param {String} sMspId
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssignedMsps: function (sMspId,fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAssignedMsps");
            var oParam = {
                "sMspId":sMspId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * calculateIncrementalCosts
         * @param {String} sMspId
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        calculateIncrementalCosts: function (sMspId,fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "calculateIncrementalCosts");
            var oParam = {
                "sMspId":sMspId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Get Incremental Costs
         * @param {String} sMspId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getIncrementalCosts : function(sMspId,fnSuccess, fnError){

            var sUrl = this.getUrl(this._baseURI, "getIncrementalCosts");
            var oParam = {
                "sMspId":sMspId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * Function to fetch msp details for workflow
        * 
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getBulkMSPDetailsForWorkflow: function (oPayload, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "getBulkMSPDetailsForWorkflow");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
        * Function to update msp details for workflow
        * 
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        updateBulkMSPDetailsForWorkflow: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateBulkMSPDetailsForWorkflow");

            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },

        /**
        * Function to create flp notification
        * 
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        createFlpNotification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "flpPushNotication");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
        * Function to fetch notification type
        * 
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */       
        fetchEnumForNotificationType:function(fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "fetchEnumForNotificationType");
            this.getData(sUrl, "", fnSuccess, fnError, true);
           
        },

        /**
		 * Retrieves the sum of  vlaues.
		 * @param {Array} aPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        createMaintenanceOrder: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintenanceOrder");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError);
        },

        /**
         * Get risk matrix id
         * @param {String} sMspId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchMSpRiskMatrixId : function(sFilter, fnSuccess, fnError){

            var sUrl = this.getUrl(this._baseURI, "getMSPRiskMatrixId");
            sUrl = sUrl + "?$filter=shortDescription eq '" + sFilter +"'"
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves all the matrix details.
		 * @param {string} sMatrixId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getMatrixDetail :function(sMatrixId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixDetailExpanded"];
            var oParam = {
                "matrixId": sMatrixId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to fetch MSP Event details
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getMSPEventSHEFINRiskValues: function (sMspEventId, fnSuccess, fnError) {
    
            var sUrl = this.getUrl(this._baseURI, "getMSPEventSHEFINRiskValues");
            var oParam = {
                "mspEventId": sMspEventId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to fetch MSP Event details
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getMSPEventDetails: function (sMspEventId, fnSuccess, fnError) {
    
            var sUrl = this.getUrl(this._baseURI, "getMSPEvent");
            var oParam = {
                "mspEventId": sMspEventId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to update MSP event details
         * 
         * @param {string} sMspEventId 
         * @param {object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} sEtag 
         */
        updateMSPEventDetails: function(sMspEventId, oPayload, fnSuccess, fnError, sEtag) {

            var sUrl = this.getUrl(this._baseURI, "getMSPEvent");
            var oParam = {
                "mspEventId": sMspEventId
            };
            
            this.patchData(sUrl,oParam,oPayload,fnSuccess, fnError, true, sEtag); 

        },

        /**
         * Function to get MSP curde data
         * 
         * @param {string} sMspEventId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getMSPEventCurveData: function (sMspEventId, fnSuccess, fnError, bShowBusy) {
    
            var sUrl = this.getUrl(this._baseURI, "getMSPEventCurveData");
            var oParam = {
                "mspEventId": sMspEventId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to get MSP curde data
         * 
         * @param {string} sMspEventId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getMSPHostChildDetails: function (sMspEventId, fnSuccess, fnError, bShowBusy) {
            var sUrl = this.getUrl(this._baseURI, "getHostChildItems");
            var oParam = {
                "hostMspId": sMspEventId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, bShowBusy);
        },

        /**
         * Function to update host MSP status
         * @param {String} sMspId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {String} sEtag
         */
        updateHostMspStatus : function(sMspId,fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "updateHostMspStatus");
            var oParam = {
                "hostMspId":sMspId
            };
            this.patchData(sUrl,oParam,{},fnSuccess, fnError, true); 
        },

        /**
         * Function to get MSP curde data
         * 
         * @param {string} aIds 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getChildMSPParentDetails: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getChildMSPParentDetails");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to get MSP curde data
         * 
         * @param {string} aIds 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getMaintenanceCalls: function (aIds, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMPlaCalls");
            this.postData(sUrl, {}, aIds, fnSuccess, fnError);
        },

        /**
         * Function to create MSP ECF details
         * 
         * @param {string} sMSPId 
         * @param {object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} sEtag 
         */
        createECFItem: function(sMSPId, oPayload, fnSuccess, fnError, sEtag) {
            var sUrl = this.getUrl(this._baseURI, "updateMSPDetail");
            var oParam = {
                "sMspId": sMSPId
            };
            this.patchData(sUrl,oParam,oPayload,fnSuccess, fnError, true, sEtag); 
        },

        /**
         * Function to get MSP ECF data
         * 
         * @param {string} sMspEventId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        fetchECFItems: function (sMspEventId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getECFData");
            var oParam = {
                "sMspId": sMspEventId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get MSP ECF data
         * 
         * @param {string} sMspEventId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getEventDetails: function (sMspEventId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEventDetails");
            var oParam = {
                "sMspId": sMspEventId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get MSP ECF data
         * 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getecfData: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getECFANalyticsData");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * Function to get MSP ECF data
         * 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getEcflinked: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEchHeaderDetails");
            var oParam = {
                "sMspId": sId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to create MSP ECF details
         * 
         * @param {string} sMSPId 
         * @param {object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} sEtag 
         */
        updateMaintenanceEventMsp: function(action, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkassignunassign");
            var oParam = {
                "actionType": action
            };
            if(action === "create"){
                this.postData(sUrl,oParam,oPayload,fnSuccess, fnError, true); 
            }else if(action === "delete"){
                this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
            }
            
        },

        /**
         * Function to bulk update BCR
         * 
         * @param {object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        bulkAutoUpdateBcr: function (oPayload, fnSuccess, fnError, bShowBusy) {
            var sUrl = this.getUrl(this._baseURI, "workflowBulkAutoUpdateBcr");
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);
        },
        
    });

});