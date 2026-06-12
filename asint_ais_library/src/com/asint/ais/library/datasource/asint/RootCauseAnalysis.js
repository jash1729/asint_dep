sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.RootCauseAnalysis", {

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
        * function to fetch rca template details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRootCauseAnalysisDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRootCauseAnalysisDetail");
            var oParam = {
                "sRootCauseAnalysisId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
        /**
         * Fetch Object details
         * @param {String} sAssessmentId 
         * @param {String} sObjectType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTechnicalObjectDetails: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getTechnicalObjectDetails");

            var oParam = {
                "assessmentId": sAssessmentId,
                
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },


        /**
         * function to update root cause analysis details
         * @param {String} sId  
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        updateRootCauseAnalysisDetail: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRootCauseAnalysisDetail");
            var oParam = {
                "sRootCauseAnalysisId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },
 

        /**
         * Function to create rootCuase
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createRootCauseAnalysis: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createRootCauseAnalysis");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },


        
        /**
         * Function to get Application Roles
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getApplicationRoles: function (sApplicationName, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getApplicationRoles");

            var oParam = {
                "sAppName": sApplicationName,
            };
            
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to create a new or update a role
         * @param {String} sRoleId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createOrUpdateRole: function(sRoleId, oPayload, fnSuccess, fnError) {
            var sUrl = "";

            if(sRoleId) {
                sUrl = this.getUrl(this._baseURI, "updateApplicationRole");

                var oParam = {
                    "roleId": sRoleId,
                };

                this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);

            } else {
                sUrl = this.getUrl(this._baseURI, "createApplicationRole");
            
                this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
            }
        },



        /**
        * Function to get TaskType
        * @param {String} sEquipmentId 
        */
        getFailureTypePicklist: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getFailureTypePicklist"];

            this.getData(sUrl,"", fnSuccess, fnError, true);

        },

        /**
         * Function to get picklist info
         * @param {String} pickListId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getPicklistInfo:function(pickListId,fnSuccess, fnError){

            var sUrl = this._baseURI + this.URL["getPicklistInfo"];

            var oParam={
                "pickListId":pickListId
            }

            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },

        /**
         * 
         * Function to fetch maintenance plans 
         */
        getRCAMaintenancePlansFromEquiOrFLoc: function (assessmentId, objectType, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRCAMaintenancePlansFromEquiOrFLoc");
            var oParam = {
                "assessmentId": assessmentId,
                "objectType": objectType
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
        /**
         * 
         * Function to get notification details 
         */
        getNotificationDetails: function(sAssessmentId, sObjectType, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getNotificationDetails");

            var oParam = {
                "assessmentId": sAssessmentId,
                "objectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Fetch notification details
         * @param {String} sAssessmentId 
         * @param {String} sObjectType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssignNotificationDetails: function (sAssessmentId, sObjectType, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAssignNotificationDetails");

            var oParam = {
                "assessmentId": sAssessmentId,
                "objectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
      
        /**
         * Fetch notification details
         * @param {String} sAssessmentId 
         * @param {String} sObjectType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateNotification: function(sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateNotificationsforRCA");

            var oParam = {
                "sRootCauseAnalysisId": sAssessmentId,
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         *function to get maintenance order details
         */
        getMaintenanceOrderDetails: function(sAssessmentId, sObjectType, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMaintenanceOrderDetails");

            var oParam = {
                "assessmentId": sAssessmentId,
                "objectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
        /**
         * Fetch notification details
         * @param {String} sAssessmentId 
         * @param {String} sObjectType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssignMaintenanceOrderDetails: function (sAssessmentId, sObjectType, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAssignMaintenanceOrderDetails");

            var oParam = {
                "assessmentId": sAssessmentId,
                "objectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },


        /**
         * function to update maintenance order details
         */
        updateMaintenanceOrder: function(sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateMaintenanceOrdersforRCA");

            var oParam = {
                "sRootCauseAnalysisId": sAssessmentId,
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },
        
        /**
         * Function to create event
         * @param {String} ID 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        createEvent:function(ID,oPayload, fnSuccess, fnError,eTag){
            var sUrl = this.getUrl(this._baseURI, "getRootCauseAnalysisDetail");
            var oParam = {
                "sRootCauseAnalysisId": ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },
        /**
         * 
         * @param {String} sAssessmentId 
         */
        whyWhyAnalysisHirerachy:function(sAssessmentId,fnSuccess,fnError){

            var sUrl = this._baseURI + this.URL["whyWhyAnalysisHirerachy"];

            var oParam={
                "assessmentId":sAssessmentId
            }

            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },
        
        /**
         * Function to add why to event
         * @param {String} sEventID 
         * @param {object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addWhyToEvent:function(sEventID,oPayload,fnSuccess,fnError){
            var sUrl = this._baseURI + this.URL["addWhyToEvent"];
            var oParam={
                "sEventId":sEventID
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, "");

        },

        /**
         * Function to add childs to why
         * @param {String} sWhyId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addChildsToWhy:function(sWhyId,oPayload,fnSuccess,fnError){
            var sUrl = this._baseURI + this.URL["addChildsToWhy"];
            var oParam={
                "sWhyId":sWhyId
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, "");
        },

        /**
		 * Create Ais recommendation
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAisRec: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "genRecommendationsInInsp");
            this.postData(sUrl, {},oPayload, fnSuccess, fnError, true);
        },

        /**
          * 
          * @param {*} sAssessmentId 
          * @param {*} fnSuccess 
          * @param {*} fnError 
          */
        fnFetchTOsForRCA:function(sAssessmentId,fnSuccess,fnError){
            var sUrl = this._baseURI + this.URL["fnFetchTOsForRCA"];

            var oParam={
                "assessmentId":sAssessmentId
            }

            this.getData(sUrl,oParam, fnSuccess, fnError, true);
            
        },
         
        /**
         * 
         * @param {Object} oPayload
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        addTaskToWhy: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["addTaskToAnalysisNode"];
            var oParam = {}
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, "");
        },
         
        /**
         * 
         * @param {Object} oPayload
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        addRecoToWhy: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["addStrategyToAssignNode"];
            var oParam = {}
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, "")
        },

        /**
         * Function to fetch Event Detail
         * @param {String} sRootCauseAnalysis 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFishboneEventDetails: function(sRootCauseAnalysis, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getFishboneEventDetails");
            var oParam = {
                "rootCauseAnalysisId": sRootCauseAnalysis,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to add or update event details
         * @param {Object} oPayload 
         * @param {String} sEventId 
         * @param {String} sAction 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addEditFishboneEvent: function(oPayload, sEventId, sAction, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, sAction === "create" ? "addFishboneEvent" : "editFishboneEvent");

            var oParam = {};
            if(sAction === "edit") {
                oParam = {
                    "sEventId": sEventId,
                }
            }

            if(sAction === "create") {
                this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
            } else {
                this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
            }
        },

        /**
         * Function to add causes in Fishbone
         * @param {Object} oPayload 
         * @param {String} sAction 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addEditFishboneCauseOrSubCause: function(oPayload, sNodeId, sAction, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "addFishboneCauseOrSubCause");
            var oParam = {};
            
            if(sAction === "edit" && sNodeId) {
                oParam.sNodeId = sNodeId;

                sUrl = this.getUrl(this._baseURI, "editFishboneCauseOrSubCause");
                
                this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);

            } else {
                this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
            }


        },

        /**
         * Function to get hierarch in Fishbone for specific cause category
         * @param {String} sRootCauseAnalysisId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFishboneHierarchy: function(sRootCauseAnalysisId, sParentId, fnSuccess, fnError) {
            // var sUrl = "";
            var sUrl = this.getUrl(this._baseURI, "getFishboneHierarchy");

            var oParam = {
                "assessmentId": sRootCauseAnalysisId,
                // "parentId": sParentId,
            };

            if(sParentId) {
                oParam["parentId"] = sParentId
                sUrl = this.getUrl(this._baseURI, "getFishboneHierarchyByCategory");
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to add data in recmmandation and tab data
         * @param {String} sRootCauseAnalysisId 
         * @param {String} sParentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTaskAndRecoTabData : function (sRootCauseAnalysisId,fnSuccess,fnError) {

            var sUrl = this.getUrl(this._baseURI, "getTaskAndRecoTabData");

            var oParam = {
                "assessmentId": sRootCauseAnalysisId
            }

            this.getData(sUrl,oParam,fnSuccess,fnError,true);
        },

        /**
         * Function to add Fishbone task
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addFishboneTask: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "addFishboneTask");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to edit Fishbone Task
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        editFishboneTask: function(aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "editFishboneTask");
            var oParam = {};

            this.patchData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to add Fishbone recommendatioe
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        addFishboneReco: function(aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "addFishboneReco");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to edit Fishbone recommendation
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        editFishboneReco: function(aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "editFishboneReco");
            var oParam = {};

            this.patchData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to update Technical Object for Recommendation
         * @param {Object} oPayload 
         * @param {String} ID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        editFishboneRecoTO: function(oPayload, ID, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "editFishboneRecoTO");
            var oParam = {
                "sID": ID,
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        // fault tree analysis services        
        /**
         * funcition to create event in fault tree
         */
        faultTreeCreateEvent: function (sRootCauseAnalysisId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this._baseURI + this.URL["faultTree_createEvent"];
            sUrl = sUrl.replace("{sRootCauseAnalysisId}", sRootCauseAnalysisId);
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
        * Function to add or update failure mode to event
         */
        faultTreeAddFailureModeToEvent: function (sEventId, oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_addFailureModeToEvent"];
            sUrl = sUrl.replace("{sEventId}", sEventId);
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, "");
        },

        /**
        * Function to add children to node in fault tree
         */
        faultTreeAddChildToNode: function (sNodeId, oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_addChildToNode"];
            sUrl = sUrl.replace("{sNodeId}", sNodeId);
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, "");
        },

        /**
         * Function to create a new AnalysisNode (Failure Mode or Root Cause)
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        faultTreeCreateAnalysisNode: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_createAnalysisNode"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to update an existing AnalysisNode (Failure Mode or Root Cause)
         * @param {String} sNodeId
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        faultTreeUpdateAnalysisNode: function (sNodeId, oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_addChildToNode"];
            sUrl = sUrl.replace("{sNodeId}", sNodeId);
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, "");
        },

        /**
        * Fault Tree — Update logic gate on EVENT entity
        */
        faultTreeUpdateLogicGateOnEvent: function (sEventId, oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_updateLogicGateOnEvent"];
            sUrl = sUrl.replace("{sEventId}", sEventId);
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, "");
        },

        /**
         * Fault Tree — Update logic gate on ANALYSISNODE entity
         */
        faultTreeUpdateLogicGateOnNode: function (sNodeId, oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_updateLogicGateOnNode"];
            sUrl = sUrl.replace("{sNodeId}", sNodeId);
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, "");
        },

        /**
         * Add task to a fault tree analysis node
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        faultTreeAddTaskToNode: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_addTaskToNode"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Add recommendation/strategy to a fault tree analysis node
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        faultTreeAddRecoToNode: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["faultTree_addRecoToNode"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
    

        /**
         * Function to publish RCA
         * @param {String} sAssessmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        publishRca: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "rootCauseAnalysisPublish");
            var oPayload = {
                assessmentId: sAssessmentId
            };
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.postData(sUrl, oParam,oPayload, fnSuccess, fnError);
        },

        /**
         * Function to bulk create recommendations
         * @param {Object} oPayload 
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        bulkCreateRecommendation: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recommendationBulkCreateV2");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Get all strategies for RCA
         * @param {String} sAssessmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getRcaStrategies: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcaStrategies");

            var oParam = {
                assessmentId: sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to generate report
         * @param {String} sFleetId
         */
        generateReport: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generateReport");
            
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },


        /**
         * Function to validate TO before removing them from assessment
         * @param {Array} aPayload 
         * @param {String} sAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        validateTOBeforeRemoving: function(aPayload, sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "validateTOBeforeRemoving");

            var oParam = {
                assessmentId: sAssessmentId,
            };

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function is used to provide the Description Using AI
         * @param {Object} oPayload
         * @param {Function} fnSuccess 
         * @param {Function} fnError
         */
        getAIDescription: function (oPayload, fnSuccess, fnError) {

            // 1. URL
            var sUrl = this.getUrl(this._baseURI, "getAIDescription");

            
            //Api calling
            this.postData(sUrl, {},oPayload, fnSuccess, fnError, true);
      
        }


    });
});