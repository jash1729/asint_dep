
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.HAZOP", {

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
         * Function to create rootCuase
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createHazopAssessment: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createHazopAssessment");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to delete HAZOP study
         * @param {string} sHazopId 
         * @param {Object} oPayload
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        deleteHazopAssessment: function(sHazopId, oPayload, fnSuccess, fnError, etag){  
            var sUrl = this.getUrl(this._baseURI, "deleteHazopAssessment");
            var oId = { sHazopId: sHazopId };
            this.patchData(sUrl, oId, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
         * Function to create a HAZOP node
         *
         * @param {Object} nPayload
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        confirmCreateNode: function (nPayload, fnSuccess, fnError) {
            var nUrl = this.getUrl(this._baseURI, "createNodeDialog");
            this.postData(nUrl, {}, nPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to update HAZOP assessment details
         *
         * @param {string} sId
         * @param {Object} oPayload
         * @param {string} etag
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        updateHazopAssessment: function (sId, oPayload,etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateHazopAssessment");
            var oId = { sGenHazopAssessmentId: sId };
            this.patchData(sUrl, oId, oPayload, fnSuccess, fnError,true,etag);
        },

        /**
         * Function to update HAZOP study details
         *
         * @param {string} sId
         * @param {Object} oPayload
         * @param {string} etag
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        updateHazopStudy: function (sId, oPayload, etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateHazopStudy");
            var oId = { sHazopId: sId };
            this.patchData(sUrl, oId, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
         * Get HAZOP Studies Details
         *
         * @param {String} sHazopId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getHazopStudiesDetails: function (sHazopId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "hazopstudiesDetails");

            var oParam = {
                "sHazopId": sHazopId
            };

       
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },


        /**
         * Get HAZOP Studies Details
         *
         * @param {String} sHazopId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getHazopAssessmentDetails: function (assessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "hazopAssessmentDetail");

            var oParam = {
                "assessmentId": assessmentId
            };

       
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },



        /**
        * Function to get TaskType
        * @param {String} sEquipmentId 
        */
        getGuideWordTypePicklist: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getGuideWordTypePicklist"];

            this.getData(sUrl,"", fnSuccess, fnError, true);

        },

        /** */
        getParameterPicklist: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getParameterPicklist"];

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
         * Get HAZOP Studies Details
         *
         * @param {String} sHazopId
         * @param {Function} fnSuccess
         * @param {Function} fnError
        */
        getNodesDeviationList: function (assessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getNodesDeviationList");

            var oParam = {
                "assessmentId": assessmentId
            };

       
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to create rootCuase
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
        */
        createDeviation: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createDeviation");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
		 * Update column data.
		 * @param {string} deviationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		*/
        deleteDeviation : function(deviationId, oPayload, fnSuccess, fnError,eTag){
            var sUrl = this._baseURI + this.URL["deleteDeviation"];
            var oParam = {
                "deviationId": deviationId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,eTag);
        },


        /**
         * function to update root cause analysis details
         * @param {String} deviationId  
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
        */
        updateDeviation: function (deviationId, oPayload, fnSuccess, fnError,eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateDeviation");
            var oParam = {
                "deviationId": deviationId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true,eTag);
        },

       
        /**
         * Function to create cause
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
        */
        createCause: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createCause");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Get all causes
         *
         * @param {String} sHazopId
         * @param {Function} fnSuccess
         * @param {Function} fnError
        */
        getAllCause: function (ID, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getAllCause");

            var oParam = {
                "ID": ID
            };


            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /** 
         *  function to update cause
         * @param {String} causeId 
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
        */
        updateCause: function (causeId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateCause");
            var oParam = {
                "causeId": causeId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to create consequences
         * 
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
        */
        createConsequence: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createConsequence");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },


        /**
         *  function to update consequence
         * @param {String} consequenceId
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
        */
        updateConsequence: function (consequenceId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateConsequence");
            var oParam = {
                "consequenceId": consequenceId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * function to fetch Hazop roles details
         * @param {String} assessmentId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
        */
        getHazopRolesDetails: function (assessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getHazopRoles");
            var oParam = {
                "assessmentId": assessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch HAZOP study team members details
         * @param {string} studyId - The study ID to fetch team members for
         * @param {function} fnSuccess - Success callback function
         * @param {function} fnError - Error callback function
         */
        getHazopStudyTeamMember: function (sHazopId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getHazopStudyTeamMembers");
            var oParam = {
                "studyId": sHazopId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Load technical objects (equipment) for HAZOP assessment
         * @param {String} assessmentId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getHazopTechnicalObjects: function (assessmentId, oParam, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getHazopTechnicalObjectList");

            var oRequestParam = {
                hazopAssessmentId: assessmentId,
                skip: oParam.skip,
                top: oParam.top
            };

            this.getData(sUrl, oRequestParam, fnSuccess, fnError, true);
        },


        /**
         * Update (assign/unassign) technical object equipments for a HAZOP assessment.
         * @param {String} assessmentId
         * @param {String[]} aEquipmentIds
         * @param {Boolean} bAssign
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        updateHazopTechnicalObjectEquips: function (assessmentId, aEquipmentIds, bAssign, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateTechnicalObjectEquips");
            var oParam = {
                "hazopAssessmentId": assessmentId,
                "assignFlag": bAssign
            };
            this.postData(sUrl, oParam, aEquipmentIds || [], fnSuccess, fnError, true);
        },

        /**
         * Update Hazop Roles Details
         * @param {String} assessmentId
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
        */
        updateHazopRolesDetails: function (assessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getHazopRoles");
            var oParam = {
                "assessmentId": assessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * function to update root cause analysis details
         * @param {String} studyId  
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        publishHazopStudy: function (studyId,fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "publishHazopStudy");
            var oParam = {
                "studyId": studyId
            };
            this.getData(sUrl, oParam,fnSuccess, fnError, true, eTag);
        },

        /** 
         * Get HAZOP Studies Details
         * @param {String} consequencesId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getConsequencesDetails: function (consequencesId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "hazopConsequencesDetail");

            var oParam = {
                "hazopConsequences_Id": consequencesId
            };

       
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Update Inspection effectiveness values of the inspection
		 * @param {string} consequencesId
         * @param {Object} oPayload
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        updateConsequencesDetails: function (consequencesId, oPayload, fnSuccess, fnError,etag) {

            var sUrl = this.getUrl(this._baseURI, "hazopConsequencesDetail");
            var oParam = {
                "hazopConsequences_Id": consequencesId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,etag);
        },
        /**
         * Function to update HAZOP assessment details
         *
         * @param {string} sRiskId
         * @param {Object} oPayload
         * @param {string} etag
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        updateRisk: function (sRiskId, oPayload,etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRisk");
            var oId = { ID: sRiskId };
            this.patchData(sUrl, oId, oPayload, fnSuccess, fnError,true,etag);
        },
        
        /**
         * Function to Create Recommendation
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createDraftRecommendation: function(oPayload, fnSuccess, fnError){
            var nUrl = this.getUrl(this._baseURI, "createRecommendations");
            this.postData(nUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Get Meeting Notes Details
         * @param {String} consequencesId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getMeetingNotesDetails: function (consequencesId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "meetingNotesDetail");

            var oParam = {
                "hazopConsequences_Id": consequencesId
            };

       
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to create MeetingNote
         * @param {Object[]} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createMeetingNotes: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createMeetingNotes");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },


        /**
		 * Update Meeting Note
		 * @param {string} noteId
         * @param {Object} oPayload
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        updateHazopNotesDetails: function (noteId, oPayload, fnSuccess, fnError,etag) {

            var sUrl = this.getUrl(this._baseURI, "meetingNotesActions");
            var oParam = {
                "note_Id": noteId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,etag);
        },
        

        /**
         * 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getDraftRecommendation: function (sConsequenceId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getDraftRecommendation");
            var oId = {
                // eslint-disable-next-line camelcase
                consequence_ID: sConsequenceId
            };
            this.getData(sUrl, oId, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {string} sConsequenceId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getRWBRecommendation: function (sConsequenceId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRWBRecommendation");
            var oId = {
                // eslint-disable-next-line camelcase
                consequence_ID: sConsequenceId
            };
            this.getData(sUrl, oId, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {string} sId 
         * @param {Object} oPayload 
         * @param {string} etag 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateDraftRecommendation: function (sId, oPayload, etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateDraftRecommendation");
            var oId = {
                // eslint-disable-next-line camelcase
                recommendation_ID: sId
            };
            this.patchData(sUrl,oId,oPayload,fnSuccess,fnError,true,etag);
        },

        /**
         * 
         * @param {string} assessmentId 
         * @param {Object} oParam 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getHazopTechnicalObjectListOnRecommendation: function (assessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getHazopTechnicalObjectListOnRecommendation");

            var oRequestParam = {
                hazopAssessmentId: assessmentId
            };

            this.getData(sUrl, oRequestParam, fnSuccess, fnError, true);
        },

        /**
         * Function to toggle mark as ready for a consequence
         * @param {string} consequenceId 
         * @param {string} etag 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        changeMarkAsReadyToggle: function (consequenceId,etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "markAsReadyToggle");

            var oRequestParam = {
                // eslint-disable-next-line camelcase
                consequence_ID: consequenceId
            }

            this.patchData(sUrl, oRequestParam, "",fnSuccess, fnError, true, etag);
        },
        
        /**
         * Retrieves all the matrices having category HAZOP.
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAllMatrices: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["hazopMatrixDropDown"];

            sUrl = sUrl + 
                "?$filter=category eq 'HAZOP' and rowSize eq 5 and colSize eq 5";

            this.getData(sUrl, {}, fnSuccess, fnError);
        },


        /**
         * Retrieves all the matrix details.
         * @param {string} sMatrixId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getMatrixDetail: function (sMatrixId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["matrixDetailExpanded"];
            var oParam = {
                "matrixId": sMatrixId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        
        /**
         * Function to toggle Mark as Unready for a consequence
         * @param {string} consequenceId 
         * @param {string} etag 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        changeMarkAsUnReadyToggle: function (consequenceId,etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "markAsUnReadyToggle");

            var oRequestParam = {
                // eslint-disable-next-line camelcase
                consequence_ID: consequenceId
            }

            this.patchData(sUrl, oRequestParam, "",fnSuccess, fnError, true, etag);
        },

        /**
         * Function to Create Barrier
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError
         */
        createBarrier: function (oPayload, fnSuccess, fnError) {
            var nUrl = this.getUrl(this._baseURI, "createBarrier");
            this.postData(nUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to Update Barrier
         * @param {string} sId
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError
         */
        updateBarrier: function (sId, oPayload, etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateBarrier");

            var oParam = {
                barrierId: sId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
         * Function to get barrier and risk comment Detail
         * @param {string} consequenceId
         * @param {function} fnSuccess 
         * @param {function} fnError
         */
        getBarriersAndRiskComments: function (consequenceId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getBarriersAndRiskComments");
            var oParam = {
                // eslint-disable-next-line camelcase
                hazopConsequence_ID: consequenceId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        
        /**
         * Function to Create Risk Comment
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError
         */
        createRiskComment(oPayload, fnSuccess, fnError) {
            var nUrl = this.getUrl(this._baseURI, "createRiskComment");
            this.postData(nUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to Update Risk Comment
         * @param {string} sId
         * @param {Object} oUpdatePayload 
         * @param {string} etag 
         * @param {function} fnSuccess 
         * @param {function} fnError
         */
        updateRiskComment: function (sId, oUpdatePayload, etag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRiskComment");

            var oParam = {
                sCommentId: sId
            }

            this.patchData(sUrl, oParam, oUpdatePayload, fnSuccess, fnError, true, etag);
        },

        /** 
         * Function to get recommendation
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getRecommendation: function (studyId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getStudyRecommendation");
            var oId = {
                // eslint-disable-next-line camelcase
                study_ID: studyId
            };
            this.getData(sUrl, oId, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        convertToAPMRecommendation:function(oPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "convertToAPMRecommendation");
            this.postData(sUrl, {},oPayload, fnSuccess, fnError, true);
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
         * 
         * @param {oResponse} fnSuccess 
         * @param {oError} fnError 
         */
        approvalAndRequestWorkflow:function(sId,oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "approvalAndRequestWorkflow");
            this.postData(sUrl,{}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch wfApproval History
         * @param {String} objectId 
         * @param {String} stepID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
        */
        fetchWorkFlowApprovalHistory: function (objectId, stepID, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "fetchWorkFlowApprovalHistory");
            var oParam={
                objectId:objectId,
                builderStepId:stepID
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to update approval action
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnUpdateApprovalAction:function(oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "fnUpdateApprovalAction");
            this.postData(sUrl,{}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * 
         * @param {object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnReassignApprover:function(oPayload,fnSuccess,fnError){  
            var sUrl = this.getUrl(this._baseURI, "fnReassignApprover");
            this.postData(sUrl,{}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to generate assessment report
         * @param {object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError 
         */
        generateReport: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generateReport");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /** 
         * To Get highest risk level for a HAZOP study 
         */
        getRiskMatrixData: function (studyId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getRiskMatrixData"];
            var oParam = {
                "studyId": studyId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
        * Function to get Mitigated Unmitigated Risk Impact Picklist
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getMitigatedUnmitigatedRiskImpactPicklist: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getMitigatedUnmitigatedRiskImpact"];

            this.getData(sUrl,"", fnSuccess, fnError, true);

        },


        

    });

});
