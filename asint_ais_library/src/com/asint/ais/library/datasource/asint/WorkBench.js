/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.WorkBench", {

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
		 * Retrieves the publish picklist.
         * @param {string} sEmail 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getAssetHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "workBenchHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Create notification.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createNotification: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "convertNotification");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Create adoc rec.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAdhocRec: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "genRecommendations");
            this.postData(sUrl, {},oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationDetailbyId: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recommendationDetail");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateRecommendationDetails: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updatedRecommendationDetail");
            var oParam = {
                "recommendationId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * function to fetch old APM Reco id
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getOldApmRecoId: function (sDisplayId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "oldApmRecoId");
            var oParam = {
                "displayId": sDisplayId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch assessment types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentTypesEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "assessmentTypes");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch assessment sub types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentSubTypesEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "assessmentSubTypes");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch assessment types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationTypesEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recoTypes");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "recoTypes"
            });

            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
		 * function to fetch assessment types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationSubtypesEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recoSubTypes");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "recoSubTypes"
            });

            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
         * function to fetch MDA
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getRecommendationMdaEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recoMda");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },
 
        /**
        * function to fetch Business Impact Enums
        * @param {function} fnSuccess
        * @param {function} fnError
        */
        getRecommendationBusinessImpactEnum: function (fnSuccess, fnError, isBusyShow) {
            var sUrl = this.getUrl(this._baseURI, "recoBusinessImpact");

            var bBusy = isBusyShow ? isBusyShow : false
            this.getData(sUrl, {}, fnSuccess, fnError, bBusy);
        },
 
        /**
         * function to fetch Discipline Enums
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getRecommendationDisciplineEnum: function (fnSuccess, fnError, isBusyShow) {
            var sUrl = this.getUrl(this._baseURI, "recoDiscipline");

            var bBusy = isBusyShow ? isBusyShow : false
            this.getData(sUrl, {}, fnSuccess, fnError, bBusy);
        },

        /**
		 * function to fetch assessment types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getMitigatedRiskEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "mitigatedRiskEnum");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "mitigatedRiskEnum"
            });

            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getGUIDBasedonAPMRecoId: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getGuidBasedonAPMRecoId");
            var oParam = {
                "apmRecoId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateAPMRecoDetailsinAIS: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateAPMRecoDatainAIS");
            var oParam = {
                "apmRecoId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoDetailsinAIS: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAPMRecoDatainAIS");
            var oParam = {
                "apmRecoId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch maintenance order list
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getMaintenanceOrder: function (techObjName, type, fnSuccess, fnError, tennat) {
            var sUrl = "", oParam = {};
            if(tennat === "AIS") {
                if(type === "EQUI") {
                    oParam = {
                        equipmentId : techObjName
                    }
                    sUrl = this.getUrl(this._baseURI, "equipmentDetailExpandWorkorder");
                }else {
                    oParam = {
                        functionalLocationId : techObjName
                    }
                    sUrl = this.getUrl(this._baseURI, "functionalLocationExpandWorkorder");
                }
            }else {
                if(type === "EQUI") {
                    oParam.type = "Equipments"
                }else {
                    oParam.type = "FunctionalLocations"
                }
                oParam.name = techObjName;
                sUrl = this.getUrl(this._baseURI, "maintenanceorderList");
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getNotiMainPlantDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintenaceOrderNotifMPlant");
            var oParam = {
                "maintenanceOrderId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Create MSP item.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        setMainPlanTaskListData: function (RecoId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "syncMPlan&Tasklist");
            var oParam = {
                "recoId": RecoId
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecommendationEquipmnetMap: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAPMrecoDetailsWithEquipmentMap");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRiskDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRecoRiskDetails");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISRiskDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAISRecoRiskDetails");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoRiskDetailsWithCharInfo: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAPMRecoRiskDetailsWithChar");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISReoRiskDetailsWithCharInfo: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAISRecoRiskDetailsWithChar");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateRiskDetils: function (sId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRecoRiskDetails");
            var oParam = {
                "recommendationId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAMP: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createMSP");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
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
        * function to fetch Notification Statuses
        * @param {function} fnSuccess
        * @param {function} fnError
        */
        getNotificationStatus: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "notificationStatus");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
        * function to fetch Maintenance order statuses
        * @param {function} fnSuccess
        * @param {function} fnError
        */
        getMaintenanceOrderStatus: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintenanceOrderStatus");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISRecoNotifications: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "aisRecoNotifications");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoNotifications: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "apmRecoNotifications");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISRecoMaintenanceOrders: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "aisMaintenanceOrders");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoMaintenancePlansandOrders: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "apmManintenanceOrder");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch maintenance plans (REST)
         * @param {String} sId
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getMaintenancePlansREST: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMaintenancePlans");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoMaintenancePlans: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRecoMaintenancePlans");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoTaskLists: function (sId, fnSuccess, fnError,isFeatureFlagEnabled) {

            var sExpand;
            var sUrl = this.getUrl(this._baseURI, "getRecoTaskLists");
            var oParam = { "recommendationId": sId };
            if (isFeatureFlagEnabled) {
                sExpand = "?$expand=to_recommendation_TaskList($expand=taskList($expand=to_description))";
            } else {
                sExpand = "?$expand=to_recommendation_TaskList($expand=taskList)";
            }

            sUrl =sUrl + sExpand;

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISRecoConsolidatedRecos: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAISConsolidatedRecos");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecoConsolidatedRecos: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAPMConsolidatedRecos");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationLinkedInspections: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recoLinkedInspections");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
 
        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationLinkedFindings: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recoLinkedFindings");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateRecoInAIS: function (action, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRecommendationInDB");
            var oParam = {
                "action": action
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch AIS recommendation details with workflow
         * 
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISRecommendationWithWorkflow: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "aisRecommendationWorkflowNew");
            var oParam = {
                "recommendationId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },


        /**
		 * function to fetch AIS recommendation details with workflow and Risk Data
         * 
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAISRecommendationWithWorkflowAndRiskData: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "aisRecommendationWorkflowRiskData");
            var oParam = {
                "recommendationId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to update AIS recommendation details with workflow
         * 
         * @param {String} sId
		 * @param {function} fnSuccess
		 * @param {function} fnError
		 */
        updateAISRecommendationWithWorkflow: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "aisRecommendationWorkflowNew");
            var oParam = {
                "recommendationId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * function to update AIS recommendation details with workflow
         * 
         * @param {String} sId
		 * @param {function} fnSuccess
		 * @param {function} fnError
		 */
        updateAISRecommendationWithWorkflowStatus: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "aisRecommendationWorkflowDeferral");
            var oParam = {
                "recommendationId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * function to fetch APM recommendation details with workflow
         * 
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAPMRecommendationWithWorkflow: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "apmRecommendationWorkflowNew");
            var oParam = {
                "recommendationId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch APM recommendation details with workflow
         * 
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationsForComponents: function (sType, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRecommendationsBasedOnComponents");
            var oParam = {
                "sObjectType": sType
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to update APM recommendation details with workflow
         * 
         * @param {String} sId
		 * @param {function} fnSuccess
		 * @param {function} fnError
		 */
        updateAPMRecommendationWithWorkflow: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "apmRecommendationWorkflowNew");
            var oParam = {
                "recommendationId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Function to fetch tasklist details
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getTaskListMainPlanData: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "apmManintenancePlans");
            var oParam = {
                "recommendationId":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Function to fetch tasklist details
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getTechnicalDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "technicalObject");
            var oParam = {
                "recommendationId":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Get More detials
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAdditionalDetails: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAdditionalDetails");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to create recommendation
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRecommendation: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createGenRecommendation");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Function to fetch tasklist details
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getNearestS4Asset: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "nearests4Details");
            var oParam = {
                "id":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to bulk update
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateRecoCycle: function (aPayload, sAction, fnSuccess, fnError) {
		
            var sUrl = this.getUrl(this._baseURI, "updateRecoCycle");
            var oParam = {
                "action":sAction
            };
            this.patchData(sUrl,oParam, aPayload, fnSuccess, fnError, true);

        },

        /**
        * Function to fetch recommendation details for workflow
        * 
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getBulkRECODetailsForWorkflow: function (oPayload, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "getBulkRECODetailsForWorkflow");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
        * Function to update recommendation details for workflow
        * 
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        updateBulkRECODetailsForWorkflow: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateBulkRECODetailsForWorkflow");

            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },

        /**
        * Function to create workflow
        * 
        * @param {Object} oPayload  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        createWorkflow: function (oPayload, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "workflowBulkCreate");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
        * Function to update workflow
        * 
        * @param {Object} oPayload
        * @param {function} fnSuccess
        * @param {function} fnError
        */
        updateWorkflow: function (oPayload, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "workflowBulkUpdate");

            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /** 
		 * Retrieves the object details.
         * @param {string} sObjectType 
         * @param {string} sObjectId
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectDetails: function (sObjectType, sObjectId, fnSuccess, fnError) {

            var sUrl = "";

            if (sObjectType === "FLOC") {
                sUrl = this.getUrl(this._baseURI, "getCMLsByFunctionalLocationId");
            } else {
                sUrl = this.getUrl(this._baseURI, "getCMLsByEquipmentId");
            }

            var oParam = {
                "sObjectId": sObjectId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },
        /**
         * Function to fetch inspection stage enums
         */
        getInspectionStageEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "inspectionStageEnum");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "inspectionStageEnum",
                ttl: 30
            });
            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
		 * function to fetch recommendation maintenance plan details 
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationMaintenancePlan: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recommendationDetailMaintenancePlan");
            var oParam = {
                "recommendationId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
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

        /**
         * function to fetch Planning
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getRecommendationPlannings: function ( sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getPlanningDetails");
            var oParam = {
                "recoId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * function to create Planning
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPlanning: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createPlanning");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * function to create Planning
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updatePlanning: function (oPayload, sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updatePlanning");
            var oParam = {
                "recoId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch technical object children (Equipments / Functional Locations)
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getTechnicalObjectChildren: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "technicalObjectChildren");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Maintainable Item children
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getMaintainableItemChildren: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintainableItemsChildren");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to trigger evergreening
         * @param {String} sEquId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnTriggerEvergreeningForRcm:function(aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "triggerEvergreeningForRcm");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },
        
        /**
         * Function to trigger evergreening
         * @param {String} aPayload
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnTriggerEvergreeningForFleet:function(aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "triggerEvergreeningForfleet");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Maintainable Item (Equipments / Functional Locations)
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getMaintainableItemChildrens: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintainableItemsChildrens");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to create task list
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createTaskList: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createTaskList");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to sync latest data for task list
         */
        getLatestDataForSyncList : function(sTaskListId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "syncTaskList");
            var oParam = {
                "taskListId": sTaskListId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get maintenance plan list to assign
         */
        getMaintenancePlanListForAssign : function(sId, fnSuccess, fnError,isFeatureFlagEnabled){
            var sUrl = "";
            var oParam = {
                "recoId": sId
            };


            if (isFeatureFlagEnabled==="1") {
                var sUrlAssignPlan=this.getUrl(this._baseURI, "getRecoPlanLists")
                sUrl = sUrlAssignPlan+"?$expand=to_recommendation_maintenancePlan($expand=MaintenancePlan($expand=to_maintenance_item))";
            } else {
                    sUrl = this.getUrl(this._baseURI, "getAssignMaintenancePlansList");
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
        
        /**
         * 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getStatusFromS4:function(fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "getStatusFromS4");
            this.getData(sUrl, {}, fnSuccess, fnError, true);

        },

        /**
         * Function to fetch wo priority from s4
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchWOPrioriyFromS4:function(fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "fnFetchWOPrioriyFromS4");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
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
         * 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {fnError} fnError 
         */
        createMultipleWorkOrder:function(oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "maintenanceOrderForMultipleTechObjects");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to create maintenance order for multiple tech objects using new API
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createMOForMultipleTechObjects: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createMOForMultipleTechObjects");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
        /**
         * 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {fnError} fnError 
         */
        createBulkInspection:function(oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "createBulkInspection");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to create mplan
         * @param {String} sRecoID 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnCreateMPlan:function(sRecoID,oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "createMplan");
            var oParam = {
                "recoId": sRecoID
            };

            this.postData(sUrl,oParam, oPayload, fnSuccess, fnError, true);
        },
        /**
         * Function to get Recommendation details for
         * @param {String} sEquipmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getRecommendationDetails: function(sRecoId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getRecommendationDetails"];
            sUrl = sUrl.replace("{reco_Id}", sRecoId);
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },
        /**
         * Function to get ai recommendation
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAISumaryDetails: function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["AISummaryDetails"];
            var oParam = {
                "type": "RECO"
            }
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },


        /**
         * Function to to update recommendation status
         * @param {String} recommendationId 
         * @param {String} statusValue 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        recoStatusUpdate: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["recoStatusUpdate"];
            this.postData(sUrl,{},oPayload, fnSuccess, fnError, true);
        }
    });

});