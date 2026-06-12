sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.ProcessAutomation", {

        URL: URL,

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
		 * Retrieves all the task count.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTaskCount: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpa_taskCount");
            this.getData(sUrl, {}, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves all the tasks.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAllTasks: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpa_tasks");
            this.getData(sUrl, {}, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the task definationid.
         * @param {string} sTaskDefinitionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getTasksTaskDefinitionId: function (sTaskDefinitionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpa_tasksByTaskDefId");
            var oParam = {
                taskDefinitionId: sTaskDefinitionId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * update the task.
         * @param {string} sTaskInstanceId 
		 * @param {object} oPayload
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        updateTask: function (sTaskInstanceId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpa_updateTask");
            var oParam = {
                taskInstanceId: sTaskInstanceId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 task by defination id. #DEPRECATED
         * @param {string} sWorkflowDefinitionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getV1TasksByDefinitionId: function (sWorkflowDefinitionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByRecipientAndFilters");
            var sLoggedInUserEmail = this.getLoggedInUserMail();
            var oParam = {
                containsText: sWorkflowDefinitionId
            };

            if (sLoggedInUserEmail) {
                oParam["recipientUsers"] = sLoggedInUserEmail;
            } else {
                // sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByFilters");
                oParam["recipientUsers"] = this.getLoggedInUserFullname() || "blank_user";
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 task by relevant For id.
         * @param {string} sRelevantFor 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getV1TasksByRelevantFor: function (sRelevantFor, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByRecipientAndRelevantFor");
            var sLoggedInUserEmail = this.getLoggedInUserMail();
            var oParam = {
                relevantFor: sRelevantFor
            };

            if (sLoggedInUserEmail) {
                oParam["recipientUsers"] = sLoggedInUserEmail;
            } else {
                // sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByFilters");
                oParam["recipientUsers"] = this.getLoggedInUserFullname() || "blank_user";
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 task by relevant For id.
         * @param {string} sRelevantFor
         * @param {string} sObjectId
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getV1TasksByRelevantForAndObjectId: function (sRelevantFor, sObjectId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByRecipientRelevantForAndObjectId");
            var sLoggedInUserEmail = this.getLoggedInUserMail();
            var oParam = {
                objectId: sObjectId,
                relevantFor: sRelevantFor
            };

            if (sLoggedInUserEmail) {
                oParam["recipientUsers"] = sLoggedInUserEmail;
            } else {
                // sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByFilters");
                oParam["recipientUsers"] = this.getLoggedInUserFullname() || "blank_user";
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 task.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getV1Tasks: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpaV1_tasksByRecipient");
            var sLoggedInUserEmail = this.getLoggedInUserMail();
            var oParam = {};

            if (sLoggedInUserEmail) {
                oParam["recipientUsers"] = sLoggedInUserEmail;
            } else {
                // sUrl = this.getUrl(this._baseURI, "bpaV1_tasks");
                oParam["recipientUsers"] = this.getLoggedInUserFullname() || "blank_user";
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 context.
         * @param {string} sTaskInstanceId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getV1Context: function (sTaskInstanceId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_context");
            var oParam = {
                taskInstanceId: sTaskInstanceId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 work flow context.
         * @param {string} sWorkflowInstanceId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getV1WorkflowContext: function (sWorkflowInstanceId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_workflow_context");
            var oParam = {
                workflowInstanceId: sWorkflowInstanceId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Update v1 task.
		 * @param {string} sTaskInstanceId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateV1Task: function (sTaskInstanceId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_updateTask");
            var oParam = {
                taskInstanceId: sTaskInstanceId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 work flow defination.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getV1WorkflowDefinitions: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_workflow_definitions");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 workflow instances.
		 * @param {string} sDefinitionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getV1WorkflowInstances: function (sDefinitionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_workflow_instances");
            var oParam = {
                definitionId: sDefinitionId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 workflow instance context.
		 * @param {string} sInstanceId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getV1WorkflowInstanceContext: function(sInstanceId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_workflow_instance_context");
            var oParam = {
                instanceId: sInstanceId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the v1 workflow instance execution logs.
		 * @param {string} sInstanceId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getV1WorkflowInstanceExecutionLogs: function(sInstanceId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_workflow_instance_exe_log");
            var oParam = {
                instanceId: sInstanceId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Create workflow.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createWorkflowOld: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_create_workflow");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },

        
        /**
		 * Create workflow
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createWorkflow: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_backend_proxy");
            var oProxyPayload = {
                path: "/public/workflow/rest/v1/workflow-instances",
                body: oPayload
            };

            this.postData(sUrl, {}, oProxyPayload, fnSuccess, fnError, false);

        },

        /**
         * Function to calculate proposed risk
         * @param {String} sObjectType 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        calcRwbMspProposedRisk: function (sObjectType, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "calcRwbMspProposedRisk");
            var oParam = {
                objectType: sObjectType
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, false);

        },

        /**
         * Function to send workflow notification
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        sendNotification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bpav1_backend_proxy");
            var oProxyPayload = {
                path: "/public/workflow/rest/v1/workflow-instances",
                body: {
                    "definitionId": "eu10.asint-payg-development.usernotification1.userNotification",
                    "context": {
                        "subject": oPayload.subject,
                        "recipient": oPayload.recipient,
                        "information": oPayload.information,
                        "application": oPayload.application,
                        "objectID": oPayload.objectID,
                        "linkText": oPayload.linkText,
                        "link": oPayload.link,
                        "model": {
                            "notification": { "i18n": {}, "name": "Notification", "fields": [ { "id": "information", "label": "Information", "value": { "type": "TEXT", "maxLength": 1700, "minLength": 0, "isMultiline": true, "defaultValue": "" }, "isReadOnly": true, "isRequired": false, "description": "", "translationKey": "h.textArea.information" }, { "id": "link", "type": "LINK", "label": "Link", "showLabel": true, "description": "", "translationKey": "h.link.link" } ], "layouts": { "webLayout": { "sections": [ { "groups": [ { "sequence": 1, "orientation": "horizontal", "layoutFormItems": [ { "size": { "widthUnits": 3 }, "isHidden": false, "sequence": 1, "formFieldId": "information" } ] }, { "sequence": 2, "orientation": "horizontal", "layoutFormItems": [ { "size": { "widthUnits": 10 }, "isHidden": false, "sequence": 1, "formFieldId": "link" } ] } ], "sequence": 1 } ] } }, "outcomes": [ { "id": "submit", "label": "Ok", "reaction": "neutral" } ], "schemaVersion": "3.7.0" }
                        }
                    }
                }
            };

            this.postData(sUrl, {}, oProxyPayload, fnSuccess, fnError, false);

        },

    });

});