sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.Workflow", {

        URL: URL,

        /**
		 * Retrieves the task count.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getTaskCount: function (fnSuccess, fnError) {

            var sUrl = this.URL["workflow_taskCount"];
            this.getData(sUrl, {}, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves all the task count by defination id.
		 * @param {Object} aTaskDefinitionId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTaskCountByDefinitionId: function (aTaskDefinitionId, fnSuccess, fnError) {

            var sUrl = this.URL["workflow_taskCountWithFilters"];
            var aFilter = [];

            for (var i = 0; i < aTaskDefinitionId.length; i++) {
                aFilter.push("TaskDefinitionID eq '" + aTaskDefinitionId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" and ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the tasks.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAllTasks: function (fnSuccess, fnError) {

            var sUrl = this.URL["workflow_tasks"];
            this.getData(sUrl, {}, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves all the task by defination id.
		 * @param {Object} aTaskDefinitionId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTasksByDefinitionId: function (aTaskDefinitionId, fnSuccess, fnError) {

            var sUrl = this.URL["workflow_tasksWithFilters"];
            var aFilter = [];

            for (var i = 0; i < aTaskDefinitionId.length; i++) {
                aFilter.push("TaskDefinitionID eq '" + aTaskDefinitionId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" and ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves all the context.
		 * @param {string} sTaskInatanceId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getContext: function (sTaskInatanceId, fnSuccess, fnError) {

            var sUrl = this.URL["workflow_context"];
            var oParam = {
                taskInstanceId: sTaskInatanceId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves all the model.
		 * @param {string} sTaskInatanceId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getModel: function (sTaskInatanceId, fnSuccess, fnError) {

            var sUrl = this.URL["workflow_model"];
            var oParam = {
                taskInstanceId: sTaskInatanceId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Update task.
		 * @param {string} sTaskInstanceId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateTask: function (sTaskInstanceId, oPayload, fnSuccess, fnError) {

            var sUrl = this.URL["workflow_updateTask"];
            var oParam = {
                taskInstanceId: sTaskInstanceId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false);

        },
        
        /**
         * Function to create workflow
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnCreateworkFlow:function(oPayload,fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "createWorkFlow");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch application templates
         * @param {String} sAppType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchApplicationTemplates:function(sAppType,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "fnFetchTemplateByType");
            var oParam = {
                templateType:sAppType
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, false);
        },
        
        /**
         * Function to fetch revision count
         * @param {String} sAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchRevisionCount:function(sAssessmentId,fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "fnFetchRevisionCount");
            var oParam = {
                sAssessmentId:sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function to create a new revision of the workflow
         * @param {String} sAssessmentId 
         * @param {Integer} iVersion 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createNewRevision: function (sAssessmentId, iVersion, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fnCreateRevisionWf");
            var oParam = {
                sAssessmentId: sAssessmentId,
                version: iVersion
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, false);
        },
         
        /**
         * Function to fetch detail
         * @param {String} sAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchDetail:function(sAssessmentId,fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "fnFetchWfDetail");
            var oParam = {
                sAssessmentId:sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, false)

        },

        /**
         * Function to create step
         * @param {*} sAssessmentId 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         * @param {*} etag 
         */
        fnCreateSteps:function(sAssessmentId,oPayload,fnSuccess,fnError,etag){

            var sUrl = this.getUrl(this._baseURI, "fnCreateSteps");
            var oParam={
                sAssessmentId:sAssessmentId
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);

        },


        /**
         * 
         */
        fnFetchAssignedTemplates:function(sAssessmentId,fnSuccess,fnError){

            var sUrl = this.getUrl(this._baseURI, "fnFetchAssignedTemplates");
            var oParam = {
                sAssessmentId:sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, false)
        },

        /**
         * Function to fetch hirerachy
         */
        fnFetchWorkFlowHirerachy:function(sAssessmentId, fnSuccess, fnError){

            
            var sUrl = this.getUrl(this._baseURI, "fnFetchFlowHirerachy");
            var oParam = {
                sAssessmentId:sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, false)

        },

        /**
         * Function to fetch workflow type
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        fnFetchWorkflowType:function(fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "fnFetchwfType");
            this.getData(sUrl,{}, fnSuccess, fnError, false)
        },
        
        /**
         * Function to update workflow details
         * @param {String} sAssessmentId 
         * @param {Object} oPayload
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag
         */
        updateWorkflowDetails: function(sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "fnUpdateWfDetail");
            var oParam = {
                sAssessmentId: sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to delete workflow steps
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnDeleteWorkflowSteps: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fnDeleteWorkflowSteps");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        }

    });

});