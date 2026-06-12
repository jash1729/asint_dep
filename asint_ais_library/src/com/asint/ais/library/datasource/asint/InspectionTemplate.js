sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.IDMS", {

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
		 * Create a new template.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createTemplate: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplate");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the publish inspection template.
		 * @param {string} sId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        publishInspectionTemplate : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["idmsTemplatePublish"];
            var oParam = {
                "inspectionTemplateId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the template header.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTemplateHeader: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateDetail");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the template detail.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTemplateDetailL1: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateDetailExpandSectionClassCharacteristicL1");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update template detail.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateTemplateDetail: function (sTemplateId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateDetail");
            var oParam = {
                "templateId": sTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },
        /**
		 * Retrieves the inspection template by equipment.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */   
        getInspectionTemplatesByEquipment: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByEquipment");
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection template by FLOC.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */   
        getInspectionTemplatesByFunctionalLocation: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByFunctionalLocation");
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the created inspection count.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCreatedInspectionCount: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentByAssessmentTemplateIdCount");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves all the object templates.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getObjectTemplates: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateAttachedObjectTemplates");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update object templates.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateObjectTemplates: function (sTemplateId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateAttachedObjectTemplates");
            var oParam = {
                "templateId": sTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },

        /**
		 * Retrieves all the object templates expand.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getObjectTemplatesExpanded: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateObjectTemplateExpand");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the templates section.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTemplatesSection: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateSectionsExpand");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Creates section.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createSection: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCreateSection");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update section.
		 * @param {string} sSectionId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateSection: function (sSectionId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateUpdateSection");
            var oParam = {
                "sectionId": sSectionId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },


        // IDMS New

        /**
		 * Retrieves all the object template list.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getObjectTemplateList: function (fnSuccess, fnError) {

            var that = this;
            var sCountUrl = this.getUrl(this._baseURI, "idmsTemplateAllObjectTemplatesCount");
			
            this.getData(sCountUrl, {}, function (iCount) {
                var sUrl = that.getUrl(that._baseURI, "idmsTemplateAllObjectTemplates");
                var oParam = {
                    "top": iCount
                }
                that.getData(sUrl, oParam, fnSuccess, fnError);
            }, fnError);

        },

        /**
		 * Retrieves all the object template classes characteristics.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getObjectTemplatesClassesCharacteristics: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateDetailObjectTemplatesExpandL3");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the object template with classes.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} tab
		 */
        getObjectTemplatesWithClasses: function (sTemplateId, fnSuccess, fnError, tab) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateObjectTemplatesExpandL1");
            var oParam = {
                "templateId": sTemplateId
            }
            if(tab === "COMPTEMPLATE") {
                this.getData(sUrl, oParam, fnSuccess, fnError, false);
            } else {
                this.getData(sUrl, oParam, fnSuccess, fnError);
            }

        },

        /**
		 * Retrieves all the classe characteristics codelists.
		 * @param {string} sClassId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getClassCharacteristicsCodeLists: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateClassExpandL2");
            var oParam = {
                "classId": sClassId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the classe characteristics.
		 * @param {string} sClassId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getClassCharacteristics: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateClassExpandL1");
            var oParam = {
                "classId": sClassId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the codelist items.
		 * @param {string} sCodelistId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCodeListItems: function (sCodelistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCodelistExpandL1");
            var oParam = {
                "codelistId": sCodelistId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the sections.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateSectionsExpand");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the subsections.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getSubSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateSubSections");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create a new subsections.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createSubSection: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCreateSubSection");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update subsections.
		 * @param {string} sSubSectionId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} sETag 
		 */
        updateSubSection: function (sSubSectionId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateUpdateSubSection");
            var oParam = {
                "subSectionId": sSubSectionId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },

        /**
		 * Retrieves the component mappping.
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 * @param {boolean} isBusyShow 
		 */ 
        getComponentMapping: function (sTemplateId, fnSuccess, fnError, isBusyShow) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateComponentMapping");
            var oParam = {
                "templateId": sTemplateId
            }
            isBusyShow = isBusyShow == undefined ? true : isBusyShow
            this.getData(sUrl, oParam, fnSuccess, fnError, isBusyShow);
        },

        /**
		 * Update component mappping.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateComponentMapping: function (sTemplateId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplate") + "({templateId})";
            var oParam = {
                "templateId": sTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },

        /**
		 * Retrieves the inspection header mappping.
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getInspectionHeaderMapping: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateInspectionHeaderMapping");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update inspection header mappping.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateInspectionHeaderMapping: function (sTemplateId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateInspectionHeaderMapping");
            var oParam = {
                "templateId": sTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },

        /**
		 * Retrieves the checklist mapping.
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        getChecklistMapping: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateChecklistMapping");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },
        /**
		 * Update checklist mappping.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateChecklistMapping: function (sTemplateId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateChecklistMapping");
            var oParam = {
                "templateId": sTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },

        /**
		 * Retrieves the inspection characteristic sequence
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getInspectionCharacteristicSequence: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCharacteristicSequence");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update inspection characteristic sequence.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateInspectionCharacteristicSequence: function (sTemplateId, oPayload, fnSuccess, fnError, sETag) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCharacteristicSequence");
            var oParam = {
                "templateId": sTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);

        },

        /**
		 * Create a new role.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createRole: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateRoleCreate");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the role data.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRoleData: function (sTemplateId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "idmsGetTemplateRole");
            var oParam = {
                "assessmentTemplateId": sTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update role.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateRole: function (oPayload, fnSuccess, fnError, sETag) {
            var sUrl = this.getUrl(this._baseURI, "idmsUpdateTemplateRole");
            var oParam = {
                "roleID": oPayload.ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sETag);
        },

        /**
		 * Retrieves all the new revision.
		 * @param {string} sAssessmentTemplateId 
		 * @param {string} sAssessmentTemplateVersion 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        newRevision: function(sAssessmentTemplateId, sAssessmentTemplateVersion, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateNewRevision");
            var oParam = {
                "assessmentTemplateId": sAssessmentTemplateId,
                "assessmentTemplateVersion": sAssessmentTemplateVersion
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },
        /**
		 * Retrieves all the subsection.
		 * @param {string} sTemplateId 
		 * @param {boolean} isBusy 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getSubSectionData: function (sTemplateId, fnSuccess, fnError, isBusy) {
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCompMapSubSection");
            var oParam = {
                "assessmentTemplateId": sTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, isBusy);
        },

        /**
		 * Update comp char assign data.
		 * @param {string} sTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCompCharcAssignData: function(sTemplateId, oPayload, fnSuccess, fnError, etag) {
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCompCharcAssign");
            var oParam = {
                "templateId": sTemplateId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        }

    });

});