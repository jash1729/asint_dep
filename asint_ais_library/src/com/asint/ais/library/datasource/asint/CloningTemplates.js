sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.CloningTemplates", {
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
         * Function to create Task
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnCreateTask: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["createCloningTask"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },
        
        /**
		 * Retrieves all the assessment template.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssesmentTemplate:function(fnSuccess,fnError)
        {
            var sUrl = this._baseURI + this.URL["getAssesmentTemplate_Replicator"];
            var oParam = {};
            this.getData(sUrl,oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the inspection template.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssetInspectionTemplates:function(fnSuccess,fnError)
        {
            var sUrl = this._baseURI + this.URL["getAssetInspection_Replicator"];
            var oParam = {};
            this.getData(sUrl,oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the CML template.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCmlTemplates:function(fnSuccess,fnError)
        {
            var sUrl = this._baseURI + this.URL["getCmlTemplates_Replicator"];
            var oParam = {};
            this.getData(sUrl,oParam, fnSuccess, fnError);
        },
       
        /**
		 * Retrieves all the risk matrix.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRiskMatrixes:function(fnSuccess,fnError)
        {
            var sUrl = this._baseURI + this.URL["getRiskMatrixes_Replicator"];
            var oParam = {};
            this.getData(sUrl,oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the general picklist.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getGeneralPickLists:function(fnSuccess,fnError)
        {
            var sUrl = this._baseURI + this.URL["getGeneralPickList_Replicator"];
            this.getData(sUrl,"", fnSuccess, fnError);
        },

        /**
		 * Retrieves all the status count replicator list.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getStatusCountCloningTemplateslist:function(fnSuccess,fnError)
        { 
            var sUrl = this._baseURI + this.URL["StatusCountReplicatorlist"];
            this.getData(sUrl,"", fnSuccess, fnError);
        },

        /**
		 * Function that fethces the replicator details
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCloningTemplatesHeaderDetails:function(sId, fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["getReplicatoDetails"];
            var oParam = {
                ID: sId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError,true);
        },

        /**
		 * Function that fethces the replicator details
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getReplicatorTaskSteps:function(sId, fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["getReplicatoSteps"];
            var oParam = {
                ID: sId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError,true);
        },

        /**
		 * Function that fethces the replicator logs
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCloningTemplatesTasklogs:function(sId, fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["getReplicatorLogs"];
            var oParam = {
                ID: sId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError,true);
        },

        /**
         * Fetch cloning templates based on object type
         * @param {string} sObjectType
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getSelectedObjectTypeData: function (sObjectType, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getObjectDataForCloningTemplates"];

            var oParam = {
                type: sObjectType 
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Function that fethces the replicator logs
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAdditionalDetails:function(aObjectId, fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["getProgressList"];
            var oParam = {
                aIds: aObjectId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError,true);
        },

        /**
		 * Function that fethces the replicator details
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateCloningTemplatesHeaderDetails:function(sId,oPayload,fnSuccess,fnError, etag) {
            var sUrl = this._baseURI + this.URL["getReplicatoDetails"];
            var oParam = {
                ID: sId
            }
            this.patchData(sUrl,oParam,oPayload, fnSuccess, fnError,true, etag);
        },

        
        /**
		 * Function that fethces the replicator logs
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getSourceSystem:function(sId, fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["getSourceSystem"];
            var oParam = {
                sId: sId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError,true);
        },

        /**
         * Function that fethces object types
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getObjectTypesEnum:function(fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["getObjectTypes_CloningTemplates"];
            this.getData(sUrl,{}, fnSuccess, fnError,true);
        },

        /**
         * Function to create Task
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnCreateOutboundTask: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["createOutboundTaskReplicator"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },
		
    });

});