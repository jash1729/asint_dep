sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.AssetInspection", {

        _baseURI: "",

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {
            this._baseURI = sBaseURI;
        },


        /**
         * Functionn to attach finding to recommendation
         * @param {String} findingsId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        getNotificationOfFindings:function (findingsId,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getNotificationOfFindings");
            var oParam = {
                "sFindingId": findingsId
            };

            this.getData(sUrl,oParam, fnSuccess, fnError);

        },


        /**
         * 
         * @param {*} sRecommendationId 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateRecommendation: function (sRecommendationId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateAPMRecoDatainAIS");
            var oParam = {
                "apmRecoId": sRecommendationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },


        /**
         * 
         * @param {*} notificaionId 
         * @param {*} oPayload         
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateNotification: function (notificaionId, oPayload, fnSuccess, fnError,eTag) {

            var sUrl = this.getUrl(this._baseURI, "updatenotificationInFindings");
            var oParam = {
                "notificationID": notificaionId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,eTag);
        },

        /**
         * Function to create task
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createTaskMg:function(oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "createTaskMg");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        
        /**
         * Function to fetch task
         * @param {String} findingsId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTaskOfFindings:function (findingsId,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getTasks");
            var oParam = {
                "sFindingId": findingsId
            };

            this.getData(sUrl,oParam, fnSuccess, fnError);

        },

        /**
		 * Update task.
		 * @param {string} sTaskId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		*/
        modifyTask:function(sTaskId, oPayload, fnSuccess, fnError, eTag)
        { 
            var sUrl = this.getUrl(this._baseURI, "updateTask");
            var oParam = {
                "sTaskId": sTaskId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag)
        },


        /**
         * Functionn to attach finding to recommendation
         * @param {String} findingsId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        attachFindingsToReco:function (findingsId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateFinding");
            var oParam = {
                "sFindingId": findingsId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

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
         * Functio to fetch Micro Environment
         * @param {String} findingsId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchEnumMicroEnvironment:function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "fnFetchEnumMicroEnvironment");
            this.getData(sUrl,"", fnSuccess, fnError);

        },
        
        /**
         * Function to fetch damage Type
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchEnumDamageType:function(fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "fnFetchEnumDamageType");
            this.getData(sUrl,"", fnSuccess, fnError);
        },


        /**
         * Functionn to attach finding to findingsTemplate
         * @param {String} findingsId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        attachFindingsToFindingsTemplate:function (findingsId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateFinding");
            var oParam = {
                "sFindingId": findingsId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Function to fetch task
         * @param {String} findingsId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFindingsTemplateValues:function (findingsId,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getFindingInfo");
            var oParam = {
                "sFindingId": findingsId
            };

            this.getData(sUrl,oParam, fnSuccess, fnError);

        },

        /**
         * Function to fetch finding Typess
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
        */
        fetchFindingTypes:function(fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "fetchFindingTypes");
            this.getData(sUrl,"", fnSuccess, fnError);
        },
    });

});