sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.workOrder", {
        URL: URL,

        _baseURI: "",

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;

        },
        
        /**
		 * Retrieves all the workorder details.
		 * @param {Object} sWorkOrderId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getWorkOrderDetail: function(sWorkOrderId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getWorkOrder");
            sUrl = sUrl.replace("{sWorkOrderId}",sWorkOrderId);

            this.getData(sUrl, {},  fnSuccess, fnError);
        },

        /**
		 * Retrieves all the CML details.
		 * @param {Object} objectType
		 * @param {Object} sId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCmlList: function (objectType, sId, fnSuccess, fnError) {
            var sUrl = "";
            if (objectType === "equi") {
                sUrl = this.getUrl(this._baseURI, "getCml");
            } else if (objectType === "floc") {
                sUrl = this.getUrl(this._baseURI, "getFlocCml");
            }
            var oParam = {
                "sId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the CML template.
		 * @param {Object} objectType 
		 * @param {Object} sId
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCmlTemplate:function(objectType, sId,fnSuccess,fnError) {
            var sUrl = "";
            if (objectType === "equi") {
                sUrl = this.getUrl(this._baseURI, "getCmlTemplate");
            } else if (objectType === "floc") {
                sUrl = this.getUrl(this._baseURI, "getFlocCmlTemplate");
            }
            var oParam = {
                "sId": sId
            };

            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
		 * Updates maintenance order inspection.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateMaintenanceOrderInspection : function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this._baseURI + this.URL["updateMaintenanceOrder"];
            var oParam = {
                "workOrderId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the maintenance order assigned inspection.
		 * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMaintOrderAssignedInspections : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getMaintOrderAssignedInspections"];
            var oParam = {
                "workOrderId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the assessment assigned to objects.
		 * @param {string} sId 
		 * @param {string} sType
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentsAssignedToTechObjects : function(sId, sType, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getAssessmentAttachedToTechObjects"];
            var oParam = {
                "workOrderId": sId,
                "type": sType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the operaton list.
		 * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getOperationList: function (sId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getOperationsList");
            sUrl = sUrl.replace("{sWorkOrderId}",sId);

            this.getData(sUrl, {},  fnSuccess, fnError);

        },

        /**
		 * Updates operation list.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        createOperationList: function (sId, eTag, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getOperationsList");
            var oParam = {
                "sWorkOrderId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Creates maintenance order.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createMaintenanceOrder: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createMaintenanceOrder");
		
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
		
        },

        /**
		 * Retrieves the assigned CML data.
         * @param {string} sId 
		 * @param {object} oPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 * @param {string} eTag
		 */  
        onAssignUnAssignCML: function (sId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assignUnassignCMLs");
            var oParam = {
                "sWorkOrderId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the assigned CML.
         * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        getAssignedCML: function (sId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assignUnassignCMLs");
            sUrl = sUrl.replace("{sWorkOrderId}",sId);

            this.getData(sUrl, {},  fnSuccess, fnError);

        },

        /**
		 * Retrieves the assigned CML for export.
         * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        getAssignedCMLsForExoprt: function (sId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getassignedCMLs");
            sUrl = sUrl.replace("{sWorkOrderId}",sId);

            this.getData(sUrl, {},  fnSuccess, fnError);

        },

        /**
		 * Update maintenance order asset strategy.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateMaintenanceOrderAssetStrategy : function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this._baseURI + this.URL["updateMaintenanceOrder"];
            var oParam = {
                "workOrderId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the maintenance order asset strategy.
         * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMaintOrderAssignedAssetStrategy : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getMaintOrderAssignedAssetStrategy"];
            var oParam = {
                "workOrderId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update deferral.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateDeferral: function(oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this._baseURI + this.URL["updateMaintenanceOrder"];
            var oParam = {
                "workOrderId": oPayload.ID
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the inspection template assigned to tech objects.
         * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionTemplateAssignedToTechObjects : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getInspectionTemplateAttachedToTechObjects"];
            var oParam = {
                "workOrderId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update maintenance order inspection template.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateMaintenanceOrderInspectionTemplate : function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this._baseURI + this.URL["updateMaintenanceOrder"];
            var oParam = {
                "workOrderId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the maintenance order assigned inspection template.
         * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMaintOrderAssignedInspectionTemplate : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getMaintOrderAssignedInspectionTemplate"];
            var oParam = {
                "workOrderId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the inspection template by objectid.
         * @param {string} sObjectId 
		 * @param {string} sObjectType
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionTemplatesByObjectId : function (sObjectId, sObjectType, fnSuccess, fnError) {
			
            var sUrl = "";
            var oParam = {};

            if(sObjectType === "EQUI") {
                sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByEquipmentforWO");
                oParam = {
                    "equipmentId": sObjectId
                };
            } else {
                sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByFunctionalLocationforWO");
                oParam = {
                    "functionalLocationId": sObjectId
                };
            }			

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection template by assetid.
         * @param {string} sAssessmentId 
		 * @param {string} sObjectType
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionTemplatesByAssessmentId : function (sAssessmentId, sObjectType, fnSuccess, fnError) {
			
            var sUrl = "";
            var oParam = {};

            if(sObjectType === "EQUI") {
                sUrl = this.getUrl(this._baseURI, "getEquipmentByInspectionTemplateId");
            } else {
                sUrl = this.getUrl(this._baseURI, "getFunctionalLocationByInspectionTemplateId");
            }	
			
            oParam = {
                "sAssessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Creates a new inspection.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createInspection: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsCreateInspection");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the object list.
         * @param {string} sEmail 
		 * @param {string} objectType
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getObjectList: function(sId, objectType, fnSuccess, fnError) {
            var sUrl = "";
            if(objectType === "equi") {
                sUrl = this._baseURI + this.URL["getObjectList"] + "?$expand=to_equipment($expand=equipment($expand=to_description,notifications($expand=notification)))";
            }else {
                sUrl = this._baseURI + this.URL["getObjectList"] + "?$expand=to_functional_location($expand=functionalLocation($expand=to_description,notifications($expand=notification)))";
            }
            var oParam = {
                "workOrderId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the analytics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAnalytics:function(fnSuccess,fnError)
        { 
            var sUrl="";
            sUrl = this.getUrl(this._baseURI, "workOrderAnalytics");
			
            this.getData(sUrl,"",fnSuccess, fnError);
        },

        /**
         * Function to filter data based on type for value helps or formatters
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getStatusDesc : function(sType, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getStatusDesc");
            var oParam = {
                "objectType": sType
            };
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
         * Retrieves the maintenance order assigned recommendations
         * @param {string} sMaintenanceOrderId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getMaintOrderAssignedRecommendations: function (sMaintenanceOrderId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMaintOrderAssignedRecommendations");
            var oParam = {
                "workOrderId": sMaintenanceOrderId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Update maintenance order recommendation
         * @param {string} sMaintenanceOrderId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateMaintenanceOrderRecommendation : function (sMaintenanceOrderId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateMaintenanceOrder");
            var oParam = {
                "workOrderId": sMaintenanceOrderId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
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
           
        }

    });

});