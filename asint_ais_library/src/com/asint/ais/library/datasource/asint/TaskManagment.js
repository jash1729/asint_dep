sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.TaskManagment", {
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
		 * Create task mg.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createTaskMg:function(oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "createTaskMg");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the task info.
         * @param {string} sTaskId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        fetchTaskInfo:function(sTaskId,fnSuccess,fnError)
        {
            var sUrl = this.getUrl(this._baseURI, "fetchTaskInfo");
            sUrl = sUrl.replace("{sTaskId}",sTaskId);

            this.getData(sUrl,{},fnSuccess,fnError)
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
		 * Retrieves all the userlist.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getUserList:function(fnSuccess,fnError)
        {
            var sUrl=this.getUrl(this._baseURI,"userList");
            var oParam = {};
            this.getData(sUrl,oParam,fnSuccess,fnError)
        },
    
        /**
		 * Retrieves all the analytics data.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAnalyticsData: function (fnSuccess, fnError) {

            var sUrl=this.getUrl(this._baseURI,"analyticsList");
            var oParam = {};

            this.getData(sUrl,oParam,fnSuccess,fnError);

        },

        /**
		 * 
		 * @param {String} sTaskId 
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        triggerTaskCompletion : function(sTaskId, fnSuccess, fnError){
            var sUrl=this.getUrl(this._baseURI,"triggerTaskCompletion");
            var oParam = {
                "taskId":sTaskId
            };

            this.getData(sUrl,oParam,fnSuccess,fnError);
        },
        
        /**
         * function to fetch Discipline Enums
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getDisciplineForTask: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "disciplineForTask");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the task info.
         * @param {string} sTaskId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getRecommendationDetails:function(sTaskId,recoSource,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "getRecoData");
            var oParam = {
                "sTaskId" : sTaskId,
                "source": recoSource
            }
            this.getData(sUrl,oParam,fnSuccess,fnError)
        },
		
    });

});