sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.AssessmentTemplate", {
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
		 * Retrieves a list of templates.
		 * @param {function} fnSuccess - A callback function to be called on successful retrieval.
		 * @param {function} fnError - A callback function to be called on retrieval failure.
		 */
        getTemplateList : function(fnSuccess, fnError){
            var that = this;
            var sUrl = this._baseURI + this.URL["getTemplateList"];
            that.getData(sUrl, {}, fnSuccess, fnError); 
        },

        /**
		 * Retrieves template details.
		 * @param {string} templateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTemplateDetail: function (templateId, fnSuccess, fnError) {

            var that = this;
            var sUrl = this._baseURI + this.URL["templateDetailExpand"];
            var oParam = {
                "templateId": templateId
            };
            that.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the created inspection count.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCreatedAssessmentsCount: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentByAssessmentTemplateIdCount");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Function to publish the assesment template.
		 * @param {string} sId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        publishAssessmentTemplate : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["assessmentTemplatePublish"];
            var oParam = {
                "assessmentTemplateId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the expanded sections for a given template.
		 * @param {string} templateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getSectionsExpanded: function (templateId, fnSuccess, fnError) {

            var that = this;
            var sUrl = this._baseURI + this.URL["getSectionExpanded"];
            var oParam = {
                "templateId": templateId
            };
            that.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Creates a new template.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createTemplate: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["template"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Updates template details.
		 * @param {string} templateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateTemplateDetail: function (templateId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["templateDetail"];
            var oParam = {
                "templateId": templateId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the assessment template details.
		 * @param {string} sTempId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentTemplateDetail :function(sTempId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["assessmentTemplateDetailforObjTemp"];
            var oParam = {
                "tempId": sTempId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the object templates.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAllObjectTemplates : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["objectTemplates"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Updates template assignments.
         * @param {string} sTempId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateTemplateAssignments:function(sTempId, oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["assessmentTemplateDetail"];
            var oParam = {
                "tempId": sTempId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Updates an object template.
         * @param {string} sTempId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateObjectTemplate : function(sTempId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["objTemplateDetailUpdate"];
            var oParam = {
                "templateId": sTempId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Creates a new section.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createSection : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["sectionCreate"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates section details.
		 * @param {string} sSectionId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateSection : function(sSectionId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["sectionUpdate"];
            var oParam = {
                "sectionID": sSectionId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Creates a new subsection.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createSubSection : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["subSectionCreate"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the sub sections.
		 * @param {Object} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAllSubsections : function(sTemplateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getSubSections"];
            var oParam = {
                "templateId": sTemplateId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Updates sub section details.
		 * @param {string} sSubSectionId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateSubSection : function(sSubSectionId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["subSectionUpdate"];
            var oParam = {
                "subSectionId": sSubSectionId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the class details.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getClasses:function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getClasses"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the characteristic details.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacteristics:function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getCharacteristics"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistList : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getPicklistList"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist detail.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistDetail : function(sPicklistId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getPicklistDetail"];
            var oParam = {
                "picklistId": sPicklistId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist columns.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistColumns : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getPicklistColumns"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Creates a new picklist mapping.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistUiMapping : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createPickListUiMapping"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update picklist mapping details.
		 * @param {string} sMapId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistUiMapping : function(sMapId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updatePickListUiMapping"];
            var oParam = {
                "mapId": sMapId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the picklist UI mapping .
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistUiMapping : function(fnSuccess, fnError, sTemplateId){
            var sUrl = this._baseURI + this.URL["pickListUiMapping"];
            sUrl = sUrl + "&$filter=templateId eq '" + sTemplateId + "'";
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist UI mapping details .
		 * @param {string} sMapId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistUiMappingDetail : function(sMapId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getPicklistUiMappingDetails"];
            var oParam = {
                "mapId": sMapId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new picklist UI parameter.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistUiParam : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["creatUiPicklistParam"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates picklist UI parameter details.
		 * @param {string} sParamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistUiParam : function(sParamId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateUiPicklistParam"];
            var oParam = {
                "sParamId": sParamId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the picklist BE mapping.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistBEMapping : function(fnSuccess, fnError, sTemplateId){
            var sUrl = this._baseURI + this.URL["picklistBEMapping"];
            sUrl = sUrl + "?$filter=templateId eq '" + sTemplateId + "'";
            this.getData(sUrl, {}, fnSuccess, fnError);
        },
		
        /**
		 * Creates a new picklist BE mapping.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistBEMapping : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["picklistBEMapping"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates picklist BE mapping details.
		 * @param {string} sMapId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistBEMapping : function(sMapId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updatePicklistBEMapping"];
            var oParam = {
                "sMapId": sMapId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the picklist BE parameter details .
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistBEParameters : function(fnSuccess, fnError, sTemplateId, sSkipVal){
            var sUrl = this._baseURI + this.URL["creatBEPicklistParam"];
            sUrl = sUrl + "?$filter=templateId eq '" + sTemplateId + "'";
            if(sSkipVal){
                sUrl = sUrl + "&$skip=" + sSkipVal;
            }
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Creates a new picklist BE parameter.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistBEParam : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["creatBEPicklistParam"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates picklist BE parameter details.
		 * @param {string} sParamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistBEParam : function(sParamId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateBEPicklistParam"];
            var oParam = {
                "sParamId": sParamId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the backend picklist .
		 * @param {string} sAlgId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getBackendPicklist : function(sAlgId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getBackendPicklist"];
            var oParam = {
                "algorithmId": sAlgId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the static backend picklist parameter .
		 * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getStaticBackendPicklistParam : function(sPicklistId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["staticBackendParamsList"];
            var oParam = {
                "picklistid": sPicklistId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the look up lists .
		 * @param {string} sAlgorithmId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getLookupsList:function(sAlgorithmId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getLookups"];
            var oParam = {
                "algorithmId": sAlgorithmId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the look up parameter lists .
		 * @param {string} sLookUpId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getLookupParameterList : function(sLookUpId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getLookupStaticParamters"];
            var oParam = {
                "lookupId": sLookUpId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the object map header lists .
		 * @param {string} templateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getObjectMapHeaderList:function(templateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getObjectMapHeader"];
            var oParam = {
                "templateId": templateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new object header map.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createObjectHeaderMap : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createObjectHeader"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates object header map details.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateObjectHeaderMap : function(sId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateObjectHeader"];
            var oParam = {
                "sId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Creates a new object map parameter.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createObjectMapParameter : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createObjectParameter"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates object map parameter details.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateObjectMapParameter : function(sId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateObjectParameter"];
            var oParam = {
                "sId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the recommendation.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getRecommendations : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getRecommendations"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the recommendation.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getTemplateRecommendations : function(sTemplateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getTemplateRecommendations"];
            var oParam = {
                "templateId": sTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
		
        /**
		 * Creates a new recommendation.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRecommendation : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createRecommendation"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update recommendation details.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateRecommendation : function(sId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateRecommendation"];
            var oParam = {
                "sId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the risk matrix plot .
		 * @param {string} templateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getRiskMatrixPlot : function(templateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["riskMatrixPlotMasterGet"];
            var oParam = {
                "templateId": templateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the risk matrix plot details .
		 * @param {string} sPlotId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getRiskMatrixPlotMasterDetail : function(sPlotId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getRiskMatrixPlotMasterDetail"];
            var oParam = {
                "plotId": sPlotId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new risk matrix plot.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRiskMatrixPlot : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["riskMatrixPlotMasterCreate"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update risk matrix plot details.
		 * @param {string} sPlotId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateRiskMatrixPlot : function(sPlotId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["riskMatrixPlotMasterUpdate"];
            var oParam = {
                "plotId": sPlotId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the risk matrix plot point.
         * @param {string} sPlotId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getRiskMatrixPlotPoint : function(sPlotId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["riskMatrixPlotGet"];
            var oParam = {
                "plotId": sPlotId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new risk matrix plot point.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRiskMatrixPlotPoint : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["riskMatrixPlotCreate"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update risk matrix plot point.
		 * @param {string} sPlotId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateRiskMatrixPlotPoint : function(sPlotId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["riskMatrixPlotUpdate"];
            var oParam = {
                "plotId": sPlotId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the algorithm list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAlgorithmList:function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getAlgorithmList"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the parameters by id.
         * @param {string} sAlgorithmId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getParametersById : function(sAlgorithmId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getParametersById"];
            var oParam = {
                "algorithmId": sAlgorithmId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * create the post new parameters.
         * @param {string} oPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        postNewParameters : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["postNewParameters"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the alg parameters.
         * @param {string} templateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAlgParameters : function(templateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getAlgParameters"];
            var oParam = {
                "templateId": templateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update new parameter.
		 * @param {string} sParamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateNewParameter : function(sParamId, oPayload, fnSuccess, fnError,eTag){
            var sUrl = this._baseURI + this.URL["updateNewParameter"];
            var oParam = {
                "paramId": sParamId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Creates a new assigned algorithm.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        postAssignedAlgorithm:function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["postAssignedAlgorithm"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * delete assigned Alg.
		 * @param {string} sAlgId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        deleteAssignedAlg : function(sAlgId, oPayload, fnSuccess, fnError,eTag){
            var sUrl = this._baseURI + this.URL["deleteAssignedAlgorithm"];
            var oParam = {
                "sAlgId": sAlgId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },
        
        /**
		 * Creates a new inspection template mapping.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        postInspectionTemplateMapping:function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["postInspectionTemplateMapping"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Creates a new new column.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        postAddColumn:function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["postAddColumn"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the inspection template mapping columns.
         * @param {string} sAssessmentTemplateId
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionTemplateWithColumnsMapping : function(sAssessmentTemplateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getInspectionTemplateWithColumnsMapping"];
            var oParam = {
                "assessmentTemplateId": sAssessmentTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * delete inspection template mapping.
		 * @param {string} sInspectionTemplateMappingId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        deleteInspectionTemplateMapping : function(sInspectionTemplateMappingId, oPayload, fnSuccess, fnError,eTag){
            var sUrl = this._baseURI + this.URL["deleteInspectionTemplateMapping"];
            var oParam = {
                "sInspectionTemplateMappingId": sInspectionTemplateMappingId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,eTag);
        },

        /**
		 * Update column data.
		 * @param {string} columnId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateColumnData : function(columnId, oPayload, fnSuccess, fnError,eTag){
            var sUrl = this._baseURI + this.URL["updateColumnData"];
            var oParam = {
                "columnId": columnId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,eTag);
        },

        /**
		 * Retrieves the assessment template id
         * @param {string} sAssessmentTemplateId 
         * @param {string} sAssessmentTemplateVersion 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspIntCongfigByAssessmentTemplateId : function(sAssessmentTemplateId, sAssessmentTemplateVersion, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getInspIntConfigByAssessmentTemplateExpanded");
            var oParam = {
                "assessmentTemplateId": sAssessmentTemplateId,
                "assessmentTemplateVersion": sAssessmentTemplateVersion
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the new rivision
         * @param {string} sAssessmentTemplateId 
         * @param {string} sAssessmentTemplateVersion 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        newRevision: function(sAssessmentTemplateId, sAssessmentTemplateVersion, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateNewRevision");
            var oParam = {
                "assessmentTemplateId": sAssessmentTemplateId,
                "assessmentTemplateVersion": sAssessmentTemplateVersion
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection template list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionTemplates : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getInspectionTemplates"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the characteristics by class id.
         * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */        
        getCharacteristicsByClassId : function(sClassId, fnSuccess, fnError){
			
            var sUrl = this._baseURI + this.URL["characteristicsByClassId"];
            var oParam = {
                "classificationId": sClassId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the characteristics by class id.
         * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */        
        getConditionLookupData : function(sTempId, fnSuccess, fnError){
			
            var sUrl = this._baseURI + this.URL["getConditionLookup"];
            var oParam = {
                "sTemplateId": sTempId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new risk matrix plot.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createConditionLookup : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createCondtionLookup"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update risk matrix plot details.
		 * @param {string} sPlotId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateConditionLookup : function(sConditionId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateCondtionLookup"];
            var oParam = {
                "sConditionId": sConditionId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the characteristics by class id.
         * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */        
        getArithmeticExpLookup : function(sTempId, fnSuccess, fnError){
			
            var sUrl = this._baseURI + this.URL["getArithmeticExpLookup"];
            var oParam = {
                "sTemplateId": sTempId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new risk matrix plot.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createArithmeticExpLookup : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createArithmeticExpLookup"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update risk matrix plot details.
		 * @param {string} sPlotId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateArithmeticExpLookup : function(sConditionId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateArithmeticExpLookup"];
            var oParam = {
                "sConditionId": sConditionId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },
        
        /**
         * Function to fetch floc equipment LookUpType
         * @param {String} sParam
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        equiFlocParentClassic:function(sParam,fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["equiFlocParentClassic"];
            var oParam = {
                "sAlgorithmId": sParam
            };
            this.getData(sUrl,oParam, fnSuccess, fnError);
        },

        /**
         * Retrieves all the template section data.
         * @param {string} sTemplateId
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getTemplateSectionDataUrl: function(sTemplateId){
            var sUrl = this._baseURI + this.URL["getTemplateSectionData"];
            return sUrl + "?templateId=" + sTemplateId ;
        },

        /**
		 * fetch the class details.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        fnFetchClass:function(sClassificationId,fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["fetchClass"];
            var oParam = {
                "classificationId": sClassificationId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates Classification.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		*/
        createClassification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "classification");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves template details.
		 * @param {string} templateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRelationMapDetails: function (templateId, fnSuccess, fnError) {

            var that = this;
            var sUrl = this._baseURI + this.URL["getRelationMap"];
            var oParam = {
                "templateId": templateId
            };
            that.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Creates Classification.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		*/
        createRelationMap: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createRelationMap");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to update relation mapping
         * @param {String} sId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRelationMapping : function(sId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateRelationMap"];
            var oParam = {
                "sId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Creates Risk transition data point.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		*/
        createRiskTransitionPlotPoint: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createRiskTransitionDataPoint");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to update risktransition mapping
         * @param {String} sId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateRiskTransitionPlotPoint : function(sId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateRiskTransitionPlotPoint"];
            var oParam = {
                "sId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

    });

});