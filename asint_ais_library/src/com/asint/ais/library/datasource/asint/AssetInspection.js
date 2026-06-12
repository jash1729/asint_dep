/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
    "com/asint/ais/library/datasource/asint/Notification",
    "com/asint/ais/library/datasource/asint/InspectionTemplate"
], function (Common, Equipment, FunctionalLocation, Notification, InspectionTemplate) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.AssetInspection", {

        _baseURI: "",
        _cacheConfig: {
            enable: true,
            type: "local",
            ttl: 1440,
            key: ""
        },

        _cacheAssessmentTemplateKey: "",
        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {
            this._baseURI = sBaseURI;
            this.equipmentDataSource = new Equipment(sBaseURI);
            this.functionLocationDataSource = new FunctionalLocation(sBaseURI);
            this.notificationDataSource = new Notification(sBaseURI);
            this.inspectionTemplateDataSource = new InspectionTemplate(sBaseURI);
        },

        /**
		 * Retrieves the inspection templates.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionTemplates: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateList");
            this.getData(sUrl, {}, fnSuccess, fnError);

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
		 * Updates inspection details.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        bulkUpdateInspection: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bulkUpdateInspection");
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
		 * Retrieves all the assessment details.
		 * @param {Object} sAssessmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getInspectionDetailByIdFromListService: function (sFilter, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "inspDetailByIdFromListService");
            sUrl = sUrl + sFilter;
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the inspection per user.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionsPerUser: function (fnSuccess, fnError) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getInspectionsPerUser");
            that.getData(sUrl, {}, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection per templates.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionsPerTemplate: function (fnSuccess, fnError) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getInspectionsPerTemplate");
            that.getData(sUrl, {}, fnSuccess, fnError);

        },

        /**
		 * Retrieves the half life data for analytics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getHalfLifeDataforAnalytics: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getHalfLifeDataAnalytics");
            that.getData(sUrl, {}, fnSuccess, fnError);
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
         * Get cml details
         * @param {array} aPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getCmlDetails: function (aPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlDetails");
            this.postData(sUrl, {} , aPayload, fnSuccess, fnError);

        },

        /**
		 * Updates cml details.
		 * @param {string} sCmlIds 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCml: function ( oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlBulkUpdate");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Get cml persona details
         * @param {array} aPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getPersonaDetails: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getPersonaDetails");
            this.postData(sUrl, {} , aPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the assessment details.
		 * @param {Object} sAssessmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentDetail: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentDetailExpanded");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the assessment notifications.
		 * @param {Object} sAssessmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentNotifications: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentDetailExpandNotification");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },
      
        /**
		 * Retrieves all the equipment notifications.
		 * @param {Object} sEquipmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getEquipmentNotifications: function (sEquipmentId, fnSuccess, fnError) {

            this.equipmentDataSource.getAssignedNotifications(sEquipmentId, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the functional location notifications.
		 * @param {Object} sFunctionalLocationId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getFunctionalLocationNotifications: function (sFunctionalLocationId, fnSuccess, fnError) {

            this.functionLocationDataSource.getAssignedNotifications(sFunctionalLocationId, fnSuccess, fnError);

        },

        /**
         * Retrieves Maintenance Plan details.
         * @param {Object} oTechObj 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getMaintenancePlanDetails: function (oTechObj, fnSuccess, fnError) {
            // var sUrl = this.getUrl(this._baseURI, "getMaintenancePlan");
            // var oParam = {
            //     "objectName": oTechObj.name,
            //     "type": oTechObj.type,
            // };
            // this.getData(sUrl, oParam, fnSuccess, fnError);
            if(fnSuccess) {
                fnSuccess([]);
            }
        },

        /**
		 * Retrieves all the equipment workorders.
		 * @param {Object} sEquipmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getEquipmentWorkorders: function (sEquipmentId, fnSuccess, fnError) {

            this.equipmentDataSource.getAssignedWorkorders(sEquipmentId, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the functional location workorders.
		 * @param {Object} sFunctionalLocationId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getFunctionalLocationWorkorders: function (sFunctionalLocationId, fnSuccess, fnError) {

            this.functionLocationDataSource.getAssignedWorkorders(sFunctionalLocationId, fnSuccess, fnError);

        },

        /**
		 * Creates and assign notification.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAndAssignNotification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createNotification");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
		 * Updates notification assignment.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateNotificationAssignment: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            this.notificationDataSource.updateNotification(sAssessmentId, oPayload, fnSuccess, fnError, eTag);

        },

        /**
		 * Retrieves the inspection header.
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionHeader: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsHeaderExpanded");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Updates inspection details.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateInspection: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "idmsHeader");
            var oParam = {
                "assessmentId": sAssessmentId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },
        /**
		 * Retrieves the inspection header mapping.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionHeaderMapping: function (sTemplateId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateInspectionHeaderMapping");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateInspectionHeaderMapping"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

            // this.inspectionTemplateDataSource.getInspectionHeaderMapping(sTemplateId, fnSuccess, fnError);

        },

        /**
		 * Retrieves the checklist mapping.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getChecklistMapping: function (sTemplateId, fnSuccess, fnError) {

            // this.inspectionTemplateDataSource.getChecklistMapping(sTemplateId, fnSuccess, fnError);
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateChecklistMapping");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateChecklistMapping"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
		 * Retrieves the inspection characteristic sequence.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionCharacteristicSequence: function (sTemplateId, fnSuccess, fnError) {

            // this.inspectionTemplateDataSource.getInspectionCharacteristicSequence(sTemplateId, fnSuccess, fnError);
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateCharacteristicSequence");
            var oParam = {
                "templateId": sTemplateId
            };

            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateCharacteristicSequence"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);


        },

        /**
		 * Retrieves the componenet mapping.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getComponentMapping: function (sTemplateId, fnSuccess, fnError, isBusyShow) {

            // this.inspectionTemplateDataSource.getComponentMapping(sTemplateId, fnSuccess, fnError);
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateComponentMapping");
            var oParam = {
                "templateId": sTemplateId
            };
            isBusyShow = isBusyShow == undefined ? true : isBusyShow

            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateComponentMapping"
            });
            this.getData(sUrl, oParam, fnSuccess, fnError, isBusyShow, oCacheConfig);

        },

        /**
		 * Retrieves the sub section.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getSubSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateSubSections");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateSubSections"
            });
            // this.inspectionTemplateDataSource.getSubSections(sTemplateId, fnSuccess, fnError);

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
		 * Retrieves the section.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getSections: function (sTemplateId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateSectionsExpand");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateSectionsExpand"
            });


            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);
            // this.inspectionTemplateDataSource.getSections(sTemplateId, fnSuccess, fnError);

        },

        /**
		 * Retrieves the object template with classes.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getObjectTemplatesWithClasses: function (sTemplateId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateSectionsExpand");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateSectionsExpand"
            });


            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

            // this.inspectionTemplateDataSource.getObjectTemplatesWithClasses(sTemplateId, fnSuccess, fnError);

        },
        /**
		 * Retrieves the class characteristic.
		 * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getClassCharacteristics: function (sClassId, fnSuccess, fnError) {

            this.inspectionTemplateDataSource.getClassCharacteristics(sClassId, fnSuccess, fnError);

        },

        /**
		 * Retrieves the class characteristic code list.
		 * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getClassCharacteristicsCodeLists: function (sClassId, fnSuccess, fnError) {

            this.inspectionTemplateDataSource.getClassCharacteristicsCodeLists(sClassId, fnSuccess, fnError);

        },

        /**
		 * Retrieves the codelist items.
		 * @param {string} sCodelistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCodeListItems: function (sCodelistId, fnSuccess, fnError) {

            this.inspectionTemplateDataSource.getCodeListItems(sCodelistId, fnSuccess, fnError);

        },

        /**
		 * Retrieves the object templates.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getObjectTemplates: function (sTemplateId, fnSuccess, fnError) {

            // this.inspectionTemplateDataSource.getObjectTemplates(sTemplateId, fnSuccess, fnError);
            var sUrl = this.getUrl(this._baseURI, "idmsTemplateAttachedObjectTemplates");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "idmsTemplateAttachedObjectTemplates"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);




        },

        /**
         * Retrieves the object template with classes.
         * @param {string} sObjectTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getObjectTemplateExpanded: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplateExpanded");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "objectTemplateExpanded"
            });
            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
		 * Retrieves the inspection user roles.
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionUserRoles: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsUserRoles");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection vlaues.
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionValues: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsValues");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update inspection vlaues.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateInspectionValues: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "idmsValues");
            var oParam = {
                "assessmentId": sAssessmentId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the assessment workorders.
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentWorkorders: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "inspectionDetailExpandWorkorders");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the asset hierarchy.
         * @param {string} sEmail 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssetHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Update user roles.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        UpdateUserRoles: function (oPayload, sAssessmentId, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "idmsPostUserRoles");
            var oParam = {
                "assessmentId": sAssessmentId,
                "isUpdatedFromMobile":false
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag)

        },

        /**
		 * Creates a new user role.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        PostUserRoles: function (oPayload, ASSSESMENTId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRoles");
            // var oParam = { 
            // 	"{assessmentId}": sAssessmentId
            // };
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the assessment user roles.
         * @param {string} InspectionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentUserRoles: function (InspectionId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "assesmentRoles");
            var oParam = {
                "InspectionId": InspectionId

            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the user list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getUserList: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "userList");
            var oParam = {};
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "userList",
                ttl: 30
            });
            this.getData(sUrl, oParam, fnSuccess, fnError, true,oCacheConfig)
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
		 * Retrieves the equipment details.
         * @param {string} id 
         * @param {string} objectType 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquiDetail: function (id, objectType, fnSuccess, fnError) {
            var sUrl = objectType === "EQUI" ?  this.getUrl(this._baseURI, "getEquiCMLTemp") : this.getUrl(this._baseURI, "getFlocCMLTemp");
            var oParam = {
                "ID": id
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CML template.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCMLTemplate: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLTemplates");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CML's details.
         * @param {string} id 
         * @param {string} objectType 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCMLs: function (id, objectType, source, fnSuccess, fnError) {
            var sUrl = "";
            if(source === "IDMS"){
                sUrl = objectType === "EQUI" ?  this.getUrl(this._baseURI, "getAttchedEquiChildCmls") : this.getUrl(this._baseURI, "getAttchedFlocChildCmls");
            }else {
                sUrl = objectType === "EQUI" ?  this.getUrl(this._baseURI, "getAttchedEquiCmls") : this.getUrl(this._baseURI, "getAttchedFlocCmls");
            }
            var oParam = {
                "ID": id
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the assigned CML data.
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */       
        getAssignedCMLData: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAttachedIDMSCmls");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update attached CML.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateAttachedCMLs: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateAttachedIDMSCmls");
            var oParam = {
                "assessmentId": sAssessmentId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the person data.
         * @param {string} ids 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */       
        getPersonaData: function (ids, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "personaData");
            var oParam = {
                "personaId": ids
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "personaData"
            });
            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
		 * Creates a CML reading
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCMLReading: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlDataSourceValue");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update CML reading.
		 * @param {string} cmlID 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCMLReading: function (cmlID, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updatecmlValues");
            var oParam = {
                "cmlID": cmlID
                // "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the published inspection.
         * @param {string} sInspectionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        publishInspection: function (sInspectionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsPublish");
            var oParam = {
                "inspectionId": sInspectionId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Creates a new inspection summary.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        exportInspectionSummary: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsExportSummary");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Creates a new object components.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        fetchObjectComponents: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getObjectComponents");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
		 * Retrieves the inspection components info.
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionComponentsInfo: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsAssessmentComponentsInfo");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the nspection components with header details.
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspectionComponentswithHeaderDetails: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsAssessmentComponentwithHeader");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Get inspection Equipment Detail
         * @param {String} equipmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getInspectionEquipmentDetail: function (equipmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "equipmentDetailForComponent");
            var oParam = {
                "equipmentId": equipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },
        /**
         * Get functional location Detail
         * @param {String} flocId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFlocDetail: function (flocId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "functionalLocationDetailForComponent");
            var oParam = {
                "flocId": flocId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the component template details.
         * @param {string} id 
         * @param {string} objType 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getComponentTemplateDetails: function (id, objType, fnSuccess, fnError) {
            var sUrl = "", oParam = {};
            if (objType === "EQUI") {
                sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateCompByEquipment") + ",to_value";
                oParam = {
                    "equipmentId": id
                };
            } else if (objType === "FLOC") {
                sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateCompByFunctionalLocation") + ",to_value";
                oParam = {
                    "functionalLocationId": id
                };
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update comment.
		 * @param {string} id 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateComment: function (id, oPayload, fnSuccess, fnError, etag) {
            var sUrl = this.getUrl(this._baseURI, "updateComment");
            var oParam = {
                "ID": id,
                "isUpdatedFromMobile":false
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        
        /**
		 * Retrieves the inspection vlaues.
		 * @param {Array} aPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAverageValue: function (aPayload, sUomSystem, fnSuccess, fnError) { 
            var sUrl = this.getUrl(this._baseURI, "cmlCalculateAvgwithFlag");

            if(sUomSystem === "uomMetric") {
                sUomSystem = "metric";
            } else {
                sUomSystem = "imperial";
            }
            
            var oParam = {
                "sUomSystem": sUomSystem
            }
            
            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError);
        },
 
        /**
		 * Update equipment object template.
		 * @param {string} sInspectionId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        assignRecommendations: function (sInspectionId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assignReco");
            var oParam = {
                "assessmentId": sInspectionId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the component template details.
         * @param {string} id 
         * @param {string} objType 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspRecommendation: function (sInspectionId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getInspReco");
            var oParam = {
                "assessmentId": sInspectionId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
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
                key: "recoTypes",
                ttl: 30
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
                key: "recoSubTypes",
                ttl: 30
            });
            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);
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
		 * Create Ais recommendation
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAisRec: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "genRecommendationsInInsp");
            this.postData(sUrl, {},oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to filter data based on apm recommendation id
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRecoIdFromAIS : function(sRecommendationId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getRecoIdFromAIS");
            var oParam = {
                "apmRecoId": sRecommendationId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
         * Function get findings attached to inspection
         * @param {String} ssAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFindingsAttachedToInspection : function(sAssessmentId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getFindingsAttachedToInspection");
            var oParam = {
                "assessmentId": sAssessmentId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
         * Function to get findings specific to inspection
         * @param {String} sAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getInspectionSpecificFindings: function(sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getInspectionSpecificFindings");
            var oParam = {
                "assessmentId": sAssessmentId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },


        /**
         * Function to add findings to checklist
         * @param {String} sAssessmentId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        addFindingsToChecklist: function(sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "addFindingsToChecklist");

            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function get findings attached to inspection
         * @param {String} ssAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTasksAttachedToInspection : function(sAssessmentId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getTasksAttachedToInspection");
            var oParam = {
                "assessmentId": sAssessmentId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
         * Function to create task
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createNewTask:function(oPayload,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "createTask");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * 
         * @param {*} sRecommendationId 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateAPMRecoInAIS: function (sRecommendationId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "attachAPMRecommendationDocument");
            var oParam = {
                "ID": sRecommendationId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to Assign the Document to the CML DataSource value
         * 
         * @param {Object} oPayload - Assignment payload
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        fnAssignCMLAttachement: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assignCMLAttachment");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Soft-delete a CML attachment DataSourceValue record by its ID.
         * This removes the link between the CML and the attached document.
         *
         * @param {String} sId - The DataSourceValue record ID
         * @param {String} sEtag - ETag value
         * @param {Function} fnSuccess  - Success callback
         * @param {Function} fnError - Error callback
         */
        fnDeleteCMLAttachment: function (sId, sEtag, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "deleteCMLAttachment");
            sUrl = sUrl.replace("{sId}", sId);
            var oPayload = { "deleted": true };
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true, sEtag);
        },

        /**
         * Function to Get the assigned document based CML ID
         * 
         * @param {String} sCMLId - Selected CML ID
         * @param {Function} fnSuccess - Success Callback function
         * @param {Function} fnError - Error Callback function
         */
        getAttachmentbyCMLId: function (sCMLId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "attachmentbyCMLID");
            sUrl = sUrl.replace("{sCMLId}", sCMLId);

            this.getData(sUrl, {}, fnSuccess, fnError);

        },

        /**
         * Function to Get the assigned attachment list
         * 
         * @param {String} sInspectionId - Selected Inspection ID
         * @param {Function} fnSuccess - Success Callback function
         * @param {Function} fnError - Error Callback function
         */
        getAttachmentList: function (sInspectionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "attachmentListDetail");
            sUrl = sUrl.replace("{ID}", sInspectionId);

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Fetch equipment components.
		 * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEqFirstLevelComponents: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getEqFirstLevelComponents");
            var oParam = {
                "sEquipmentId": sEquipmentId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getEqFirstLevelComponents"
            });
            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },
        
        /**
         * 
         * @param {String} sEquipmentId 
         * @param {Object} fnSuccess 
         * @param {Object} fnError 
         */
        fetchEquiAssessments:function(sEquipmentId, fnSuccess, fnError){

            var sUrl = this.getUrl(this._baseURI, "fetchEquiAssessments");
            var oParam = {
                "sEquipmentId": sEquipmentId,
            };
             
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * 
         * @param {String} sEquipmentId 
         * @param {Object} fnSuccess 
         * @param {Object} fnError 
         */
        fetchEquiAssessmentsWithFilter:function(sEquipmentId, fnSuccess, fnError,templateid){

            var sUrl = this.getUrl(this._baseURI, "fetchEquiAssessmentsWithFilter");
            var oParam = {
                "sEquipmentId": sEquipmentId,
                "templateid":templateid
            };
             
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },


        /**
		 * Fetch Inspection effectiveness values of the inspection
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getInspEffData: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getInspEffData");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update Inspection effectiveness values of the inspection
		 * @param {string} sAssessmentId 
         * @param {Object} oPayload
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        updateInspEffValues: function (sAssessmentId, oPayload, fnSuccess, fnError,etag) {

            var sUrl = this.getUrl(this._baseURI, "getInspEffData");
            var oParam = {
                "sAssessmentId": sAssessmentId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true,etag);
        },

        /**
		 * Fetch Inspection effectiveness values of the inspection
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getStrategValidationData: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getInspStrategyValidationData");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to Assign the Document to the CML DataSource value
         * @param {Object} oPayload - Assignment payload
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        createStrategyValidation : function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createStrategyValidation");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to Assign the Document to the CML DataSource value
         * @param {Object} oPayload - Assignment payload
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        updateStrategyValidation : function (sId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateStrategyValidation");
            var oParam = {
                "sId": sId,
                "isUpdatedFromMobile":false
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

         
        /**
         * Function to fetch damage class
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchEnumDamageClass:function(fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "damageClassification");
            this.getData(sUrl, "", fnSuccess, fnError);
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
                "sFindingId": findingsId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },


        /**
         * Functionn to attach bulk finding to recommendation
         * @param {String} findingsId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        attachBulkFindingsToReco:function (findingsId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateFinding");
            var oParam = {
                "sFindingId": findingsId
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Function to fetch findings recommendations
         * @param {String} findingsId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFindingsRecommendation:function (findingsId,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getFindingsRecommendation");
            var oParam = {
                "sFindingId": findingsId
            };

            this.getData(sUrl,oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the code list by display id.
         * @param {Array} aCodeListDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCodeListByDisplayId: function (aCodeListDisplayId, fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "codeListByFilter");
            var aFilter = [];

            for (var i = 0; i < aCodeListDisplayId.length; i++) {
                aFilter.push("displayId eq '" + aCodeListDisplayId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" or ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Retrieves the inspection recommendation
         * 
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getRecommendation: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAsdReco");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Function to initiate bulk export
         * 
         * @param {array/object} oPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        bulkExport: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectBulkExport");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * function to fetch recommendation details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationDetailbyId: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recommendationData");
            var oParam = {
                "recommendationId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to change the Recommendation State
         * @param {String} sRecoId - Created Recommendation ID
         * @param {Object} oPayload - Payload
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error Callback function 
         * @param {string} eTag 
         */
        updateRecommendationState: function (sRecoId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "recommendationData");
            var oParam = {
                "recommendationId": sRecoId,
                "isUpdatedFromMobile":false
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the equipment user status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentUserStatusEnum : function(fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentUserStatusEnum");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "getEquipmentUserStatusEnum",
                ttl: 30
            });
            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
		 * Retrieves the equipment system status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentSystemStatusEnum : function(fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentSystemStatusEnum");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "getEquipmentSystemStatusEnum",
                ttl: 30
            });
            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
		 * Fetch Riskdata of recommendation for assessment
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAttachedRecommendationRiskData: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "assessmentRecommendationRiskData");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },


        /**
         * Fetch environment Classification
         * 
         */
        fnFetchEnvironmentClassificationCharacteristic: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fnFetchEnvironmentClassificationCharacteristic");
            this.getData(sUrl,"", fnSuccess, fnError);
        },
        
        /**
         * Function to fetch codelist
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchEnvironmentClassificationCodeList:function(sCharId,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "fnFetchEnvironmentClassificationCodeList");
            var oParam = {
                "sCharId": sCharId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Update cml reading whenever baground information updated.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateCmlReadingDate: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateReading");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Assign cmls before save
         * @param {string} sRecoId 
         * @param {object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        assignCmls: function (sRecoId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assignCmls");
            var oParam = {
                "assessmentId": sRecoId,
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Get info of all assigned cmls
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssinedCmls: function(sAssessmentId,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "getAssinedCmls");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to get backend alerts
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getCMLAlertsFromBE: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getBECMLAlerts");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
         * Functionn to bulk update findings
         * @param {Array} aPayload
         */
        bulkUpdateFindings:function (aPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bulkUpdateFindings");

            this.patchData(sUrl, {}, aPayload, fnSuccess, fnError);

        },
        /**
         * Function to assign notification to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        AssignNotification: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "assignNotification");
            var oParam = {inspectionId: sAssessmentId,  };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);
        },       
        /**
         * Function to unassign notification to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */ 
        UnAssignNotification: function (sInspectionId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "unassignNotification");
            var oParam = {
                inspectionId: sInspectionId
            };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);

        },
        /**
         * Function to assign WorkOrder to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        AssignWorkOrder: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "AssignWorkOrder");
            var oParam = {inspectionId: sAssessmentId,  };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);
        },   
        /**
         * Function to unassign WorkOrder to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */     
        UnAssignWorkOrder: function (sInspectionId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "unAssignWorkOrder");
            var oParam = {
                inspectionId: sInspectionId
            };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);
        },
        /**
         * Function to assign Reco to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        AssignReco: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assignRecommendation");
        
            var oParam = {
                inspectionId: sAssessmentId, 
            };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);

        },   
        /**
         * Function to unassign Reco to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */     
        UnAssignReco: function (sInspectionId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "unassignRecommendation");
            var oParam = {
                inspectionId: sInspectionId
            };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);

        },
        /**
         * Function to assign Task to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        AssignTask: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assignTask");
            var oParam = {
                inspectionId: sAssessmentId,   
            };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);

        },    
        /**
         * Function to unassign Task to inspection
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */    
        UnAssignTask: function (sInspectionId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "unAssignTask");
            var oParam = {
                inspectionId: sInspectionId
            };
            this.postData(sUrl,oParam,oPayload,fnSuccess,fnError,true,eTag);

        },

        /**
         * Function to get checklist findings data
         */
        getChecklistToFindingsData : function(sAssessmentId,fnSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "idmsChecklistToFindingMapping");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the component mappping.
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 * @param {boolean} isBusyShow 
		 */ 
        getInspectionComponentMapping: function (sTemplateId, fnSuccess, fnError, isBusyShow) {
            var sUrl = this.getUrl(this._baseURI, "idmsComponentMapping");
            var oParam = {
                "templateId": sTemplateId
            }
            isBusyShow = isBusyShow == undefined ? true : isBusyShow
            this.getData(sUrl, oParam, fnSuccess, fnError, isBusyShow);
        },
        /**
		 * Retrieves the assigned CML data.
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */       
        getAssignedCMLDataV2: function (sTemplateId,sAssessmentId, skip, top,Sorder, fnSuccess, fnError, isBusyShow) {
            var sUrl = this.getUrl(this._baseURI, "getAttachedIDMSCmlsV2");
            var oParam = {
                "templateId": sTemplateId,
                "inspectionId": sAssessmentId,
                skip: skip,
                top: top,
                orderBy:Sorder   
            };
            isBusyShow = isBusyShow == undefined ? true : isBusyShow

            this.getData(sUrl, oParam, fnSuccess, fnError,false);
        },

        /**
		 * Retrieves the assigned CML data.
         * @param {string} sAssessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */       
        getCMlDetails: function (sTemplateId, fnSuccess, fnError,isBusyShow) {
            isBusyShow = isBusyShow == undefined ? true : isBusyShow
            var sUrl = this.getUrl(this._baseURI, "getCMlDetails");
            var oParam = {
                "templateId": sTemplateId,
            };
            this.getData(sUrl, oParam, fnSuccess, fnError,false);
        },
        /**
		 * Update attached CML.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCmlData: function (sAssessmentId,oPayload,fnSuccess, fnError, isBusyShow,eTag) {
            var sUrl = this.getUrl(this._baseURI, "updatecml");
            var oParam = {
                "inspectionId": sAssessmentId,

            };
            isBusyShow = isBusyShow == undefined ? true : isBusyShow

            this.patchData(sUrl, oParam, oPayload,fnSuccess, fnError,isBusyShow, eTag);
        },
        /**
		 * Delete attached CML.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateAttachedCMLsV2: function (sInspectionId, cmlId, fnSuccess, fnError, isBusyShow, eTag) {
            isBusyShow = isBusyShow === undefined ? true : isBusyShow;

            var sUrl = this.getUrl(this._baseURI, "updateAttachedIDMSCmlsV2");

            var oParam = {
                inspectionId: sInspectionId,
                cmlId: cmlId
            };

            var oPayload = {
                cmlId: cmlId   
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);
        },
        /**
		 * Retrieves the code list by display id.
         * @param {Array} aCodeListDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCodeListByDisplayIdV2: function (aCodeListDisplayId, fnSuccess, fnError,isBusyShow) {
            isBusyShow = isBusyShow == undefined ? true : isBusyShow
            var sUrl = this.getUrl(this._baseURI, "codeListByFilter");
            var aFilter = [];

            for (var i = 0; i < aCodeListDisplayId.length; i++) {
                aFilter.push("displayId eq '" + aCodeListDisplayId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" or ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the published inspection.
         * @param {string} sInspectionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getcmlTemplateV2: function (sInspectionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getcmlTemplateV2");
            var oParam = {
                inspectionId: sInspectionId,

            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);
        },
        /**
         * Assign cmls before save
         * @param {string} sInspectionId
         * @param {object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
         * @param {string} eTag
         */
        assignCmlsV2: function (sInspectionId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assignCmlsV2");
            var oParam = {
                "inspectionId": sInspectionId,
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },
        /**
         * Function to convert UoM
         * 
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fnUoMConvertV2: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "uomConversion");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError,false);

        },
        /**
         * Get info of all assigned CMLs
         * @param {string} objectType
         * @param {string} objectId
         * @param {string} inspectionId
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getInspectionCmls: function (objectType, objectId, inspectionId, fnSuccess, fnError, isBusyShow) {
            isBusyShow = isBusyShow == undefined ? true : isBusyShow;
            var sUrl = this.getUrl(this._baseURI, "getInspectionCmls");

            var oParam = {
                objectType: objectType,
                objectId: objectId,
                inspectionId: inspectionId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError,false);
        },
        /**
         * Function to Get the assigned document based CML ID
         * 
         * @param {String} sCMLId - Selected CML ID
         * @param {Function} fnSuccess - Success Callback function
         * @param {Function} fnError - Error Callback function
         */
        getAttachmentbyCMLIdV2: function (sCMLId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "attachmentbyCMLIDV2");
            sUrl = sUrl.replace("{cmlId}", sCMLId);

            this.getData(sUrl, {}, fnSuccess, fnError);

        },  
        /**
         * Function to get backend alerts
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getCMLAlertsFromBEV2: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getBECMLAlerts");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError,false);
        },

        /**
         * Retrieves IDMS inspection data for AI workflow
         * @param {string} assessmentId - The assessment ID
         * @param {function} fnSuccess - The success callback function
         * @param {function} fnError - The error callback function
         */
        getChecklistData: function (assessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getChecklistdata");
            var oParam = {
                "assessmentId": assessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
        
        /**
         * Retrieves finding items data for AI workflow
         * @param {string} templateId - The assessment template ID
         * @param {function} fnSuccess - The success callback function
         * @param {function} fnError - The error callback function
         */
        getFindingItems: function (templateId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "findingItems");
            var oParam = {
                "templateId": templateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
        

        /**
         * Call AI API for IDMS insights generation
         * @param {Object} oPayload - AI request payload
         * @param {function} fnSuccess - Success callback
         * @param {function} fnError - Error callback
         */
        callIdmsAIAPI: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "AISummaryDetails");
            var oParam = {
                "type": "IDMS"
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

    });

});