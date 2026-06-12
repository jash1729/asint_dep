/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/KPI",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
    "com/asint/ais/library/datasource/asint/AssessmentTemplate"
], function (Common, KPI, Equipment, FunctionalLocation, AssessmentTemplate) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.AssetStrategy", {

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

            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
            this.kpiDataSource = new KPI(sBaseURI);
            this.equipmentDataSource = new Equipment(sBaseURI);
            this.functionLocationDataSource = new FunctionalLocation(sBaseURI);
            this.assessmentTemplateDataSource = new AssessmentTemplate(sBaseURI);

        },

        /**
         * Retrieves all the object list.
         * @param {Object} sObjectType 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getObjectList: function (sObjectType, fnSuccess, fnError) {

            var sUrl = "";
            var oParam = {};

            if (sObjectType === "EQU") {
                sUrl = this._baseURI + this.URL["equipmentExpand"];
            } else {
                sUrl = this._baseURI + this.URL["functionalLocationsExpand"];
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the assessment list.
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentList: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["assessment"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Create a new assessment.
         * @param {Object} oPayload 
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        createAssessment: function (oPayload, fnSuccess, fnError, isShowBusy) {

            var sUrl = this._baseURI + this.URL["assessment"];
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bBusy);

        },

        /**
         * Create a new bulk publish assessment.
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        bulkPublishAssessments: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["bulkPublishASD"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Retrieves the mass run list.
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getMassRunList: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getMassRunList"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Retrieves all the mass run details.
         * @param {Object} massRunId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getMassRunDetail: function (massRunId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getMassRunDetail"];
            var oParam = {
                massRunId: massRunId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Creates a new mass run.
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        createMassRun: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createMassRun");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves all the mass run details.
         * @param {Object} sUrl 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getDataForMassrunAddAll: function (sUrl, fnSuccess, fnError) {
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Retrieves all the filtered ASD templates by object.
         * @param {Object} sUrl 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        filterASDTemplatesByObjects: function (sUrl, fnSuccess, fnError) {
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Retrieves the assessment templates count.
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentTemplateWiseCount: function (fnSuccess, fnError) {

            this.kpiDataSource.getAssessmentTemplateWiseCount(fnSuccess, fnError);

        },

        /**
         * Retrieves the assessment count with user.
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentCountWithUser: function (fnSuccess, fnError) {

            this.kpiDataSource.getAssessmentCountWithUser(fnSuccess, fnError);

        },

        /**
         * Retrieves the inspection assessment count.
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getInspectionAssessmentCount: function (fnSuccess, fnError) {

            this.kpiDataSource.getInspectionAssessmentCount(fnSuccess, fnError);

        },

        /**
         * Retrieves all the assessment details.
         * @param {Object} sId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssessmentDetail: function (sId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["assessmentDetailExpandedforASD"];
            var oParam = {
                assessmentId: sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Retrieves all the assessment hierarchy.
         * @param {Object} sEmail 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssetHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function to add section comment
         */
        addSectionRemovalComment : function(oPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "assessmentSectionRemovalComments");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves all the assessment templates by equipment.
         * @param {string} sEquipmentId 
         * @param {boolean} isShowBusy
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnGetSectionCommentsBasedOnEquId: function (sTechObjId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getSectionCommentsByEquiId");
            var oParam = {
                "techObjId": sTechObjId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * update comments on general selection save 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        deleteCommentsFromSameAsmt: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "deleteCommentsFromSameAsmt");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * update comments on general selection save 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateCommentsOnAsmtPublish: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateCommentsAfterPublish");
            var oParam = {
                "assessmentId": sId
            };
            this.postData(sUrl, oParam, {}, fnSuccess, fnError);
        },

        /**
         * Retrieves all the assessment templates by equipment.
         * @param {string} sEquipmentId 
         * @param {boolean} isShowBusy
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssessmentTemplatesByEquipment: function (sEquipmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "asdAssessmentTemplateByEquipment");
            var oParam = {
                "equipmentId": sEquipmentId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * Retrieves all the assessment templates by FLOC.
         * @param {string} sFunctionalLocationId 
         * @param {boolean} isShowBusy
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssessmentTemplatesByFunctionalLocation: function (sFunctionalLocationId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "asdAssessmentTemplateByFunctionalLocation");
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * Retrieves the ASD assessment count.
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getASDaAssessmentCount: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "kpiASDassesmentAssessmentCount");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Retrieves the assessment notifications.
         * @param {string} sAssessmentId 
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
         * Retrieves the equipment notifications.
         * @param {string} sEquipmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getEquipmentNotifications: function (sEquipmentId, fnSuccess, fnError) {

            this.equipmentDataSource.getAssignedNotifications(sEquipmentId, fnSuccess, fnError);

        },

        /**
         * Retrieves the FLOC notifications.
         * @param {string} sFunctionalLocationId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getFunctionalLocationNotifications: function (sFunctionalLocationId, fnSuccess, fnError) {

            this.functionLocationDataSource.getAssignedNotifications(sFunctionalLocationId, fnSuccess, fnError);

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
         * Creates and assign notification v2.
         * @param {Object} oPayload   
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        createAndAssignNotificationV2: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentPublishWithNotification");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Update inspection.
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateInspection: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "idmsHeader");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Retrieves the FLOC work orders.
         * @param {string} sFunctionalLocationId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getFunctionalLocationWorkorders: function (sFunctionalLocationId, fnSuccess, fnError) {

            this.functionLocationDataSource.getAssignedWorkorders(sFunctionalLocationId, fnSuccess, fnError);

        },

        /**
         * Retrieves the assessment work orders.
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentWorkorders: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentDetailExpandWorkorders");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the equipment work orders.
         * @param {string} sEquipmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getEquipmentWorkorders: function (sEquipmentId, fnSuccess, fnError) {

            this.equipmentDataSource.getAssignedWorkorders(sEquipmentId, fnSuccess, fnError);

        },

        /**
         * Retrieves the assessment header.
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         * @param {boolean} isShowBusy
         */
        getAssessmentHeader: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var bBusy = true;
            var sUrl = this.getUrl(this._baseURI, "assessmentHeaderExpanded");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            if (isShowBusy == false) {
                bBusy = false;
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * Retrieves the assessment header with strategies
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         * @param {boolean} isShowBusy
         */
        getAssessmentHeaderWithStrategies: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var bBusy = true;
            var sUrl = this.getUrl(this._baseURI, "assessmentHeaderWithStrategiesExpanded");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            if (isShowBusy == false) {
                bBusy = false;
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * Retrieves the section data.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateSectionsExpand");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentTemplateSectionsExpand"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the subsection data.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getSubSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateSubSectionsV1");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentTemplateSubSections"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the object template with classes.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getObjectTemplates: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateObjectTemplates");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentTemplateObjectTemplates"
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
                enable: true,
                key: sObjectTemplateId
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the object template with classes.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getObjectTemplatesWithClasses: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateObjectTemplatesExpandL1");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the class characteristic code list.
         * @param {string} sClassId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getClassCharacteristicsCodeLists: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateClassExpandL1");
            var oParam = {
                "classId": sClassId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the code list items.
         * @param {string} sCodelistId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getCodeListItems: function (sCodelistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateCodelistExpandL1");
            var oParam = {
                "codelistId": sCodelistId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        
        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValuesWithRecoStg: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "assessmentValuesWithRecoStg");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
		 * Retrieves the characteristics by class id.
         * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */        
        getArithmeticExpLookup : function(sTempId, fnSuccess, fnError){
			
            var sUrl = this.getUrl(this._baseURI, "getArithmeticExpLookup");
            var oParam = {
                "sTemplateId": sTempId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getArithmeticExpLookup"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
		 * Retrieves the characteristics by class id.
         * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */        
        getConditionLookupData : function(sTempId, fnSuccess, fnError){
			
            var sUrl = this.getUrl(this._baseURI, "getConditionLookup");
            var oParam = {
                "sTemplateId": sTempId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getConditionLookup"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);
    
        },

        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValues: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "assessmentValues");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        
        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValuesV2: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "assessmentValuesV2");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, function (aResponse) {
                fnSuccess({
                    //eslint-disable-next-line camelcase
                    to_genAssessmentValues: aResponse || []
                });
            }, fnError, bBusy);

        },

        /**
         * Update assessment vlaues.
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         * @param {boolean} isShowBusy
         */
        updateAssessmentValues: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "assessmentValues");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, bBusy, eTag);

        },

        /**
         * Update assessment vlaues v2
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         * @param {boolean} isShowBusy
         */
        updateAssessmentValuesV2: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "assessmentValuesV2");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, bBusy, eTag);

        },

        /**
         * Update assessment .
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateAssessment: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assessmentHeader");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Update assessment
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag
         * @param {boolean} isShowBusy
         */
        updateAssessmentV2: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag, isShowBusy) {

            var bBusy = true;
            var sUrl = this.getUrl(this._baseURI, "assessmentHeader");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            if (isShowBusy == false) {
                bBusy = false;
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, bBusy, eTag);

        },

        /**
         * Retrieves the template algorithm.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getTemplateAlgorithm: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentAlgorithm");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentAlgorithm"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the template algorithm.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getTemplateAlgorithmV2: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentAlgorithmV2");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentAlgorithmv2"
            });

            this.getData(sUrl, oParam, function(oResponse) {
                fnSuccess([oResponse]);
            }, fnError, true, oCacheConfig);

        },

        /**
         * Calculates values based on the provided payload, algorithm name, template ID, template version, UoM system, and trace flag.
         * @param {Object} oPayload 
         * @param {string} sAlgorithmName 
         * @param {string} sTemplateId 
         * @param {string} sTemplateVersion 
         * @param {string} sUoMSystem 
         * @param {boolean} bTrace 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {function} sObjectId 
         * @param {function} sObjectType 
         * @param {Object} oQueryParam
         */
        calculate: function (oPayload, sAlgorithmName, sTemplateId, sTemplateVersion, sUoMSystem, bTrace, sObjectType, sObjectId, bObjectProperty, oQueryParam, fnSuccess, fnError) {

            var sUrl = "";

            if (bObjectProperty === true) {
                sUrl = this.getUrl(this._baseURI, "assessmentCalculate");
            } else {
                sUrl = this.getUrl(this._baseURI, "assessmentCalculateWithoutObjectParams");
            }
            var oParam = {
                "algorithmName": sAlgorithmName,
                "templateId": sTemplateId,
                "templateVersion": sTemplateVersion,
                "trace": bTrace,
                "uomSystem": sUoMSystem,
                "objectId": sObjectId,
                "objectType": sObjectType
            };

            if(oQueryParam) {
                for(var sQueryParam in oQueryParam) {
                    sUrl += "&" + sQueryParam + "=" + oQueryParam[sQueryParam];
                }
            }

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Retrieves the risk matrix mapping.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getRiskMatrixMapping: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentRiskMatrixPlotMaster");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentRiskMatrixPlotMaster"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the risk matrix.
         * @param {string} sRiskMatrixId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getRiskMatrix: function (sRiskMatrixId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentRiskMatrix");
            var oParam = {
                "riskMatrixId": sRiskMatrixId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: sRiskMatrixId
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the selection data.
         * @param {string} assessmentTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         * @param {boolean} isShowBusy
         */
        getSelectionData: function (assessmentTemplateId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "assessmentSelection");
            var oParam = {
                "assessmentId": assessmentTemplateId
            }

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * Retrieves the previous publish data.
         * @param {string} tempdispID 
         * @param {string} equiID
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getPreviousPublishData: function (tempdispID, equiID, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "prevPublishSelection");
            var oParam = {
                "assessmentTemplateDisplayId": tempdispID,
                "objectID": equiID
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: tempdispID + "_" + equiID + "_" + "prevPublishSelection"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
         * Creates general selection.
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} isShowBusy
         */
        createGeneralSelection: function (oPayload, fnSuccess, fnError, isShowBusy) {
            var sUrl = this.getUrl(this._baseURI, "createAssessmentSel");
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bBusy);
        },

        /**
         * Updates general selection.
         * @param {string} selID 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateGeneralSelection: function (selID, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateAssessmentSel");
            var oParam = {
                "selectionId": selID
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Retrieves the picklist mapping.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getPicklistMapping: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentPicklistMapping");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "assessmentPicklistMapping"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the picklist.
         * @param {string} sPicklistId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getPicklist: function (sPicklistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentPicklistExpand");
            var oParam = {
                "picklistId": sPicklistId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: sPicklistId
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, false, oCacheConfig);

        },
        
        /**
		 * Retrieves the object map header lists .
		 * @param {string} templateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getObjectMapHeaderList:function(templateId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getObjectMapHeader");
            var oParam = {
                "templateId": templateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getObjectMapHeader"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);
        },
        
        /**
         * Retrieves the publish assessment.
         * @param {string} sAssessmetId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        publishAssmt: function (sAssessmetId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "publishAssmt");
            var oParam = {
                "assessmetId": sAssessmetId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * 
         * @param {*} sAssessmetId 
         * @param {*}  
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateRiskRollUp: function (sAssessmetId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "riskRollupOnPublish");
            var oParam = {
                "assessmetId": sAssessmetId
            };

            this.patchData(sUrl, oParam, {}, fnSuccess, fnError);
        },

        /**
         * Retrieves the recomedation.
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        recommendation: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "calculateRecc");
            var oParam = {
                "assessmetId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Retrieves the recomedation desc.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getCalcRecomDesc: function (sTemplateId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "calculateReccDesc");
            var oParam = {
                "templateId": sTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Creates and assign notification.
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getMassrunRecommendations: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["massRunRecommendations"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves the inspection template by equipment.
         * @param {string} sObjectId
         * @param {string} sObjectType 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getInspectionTemplatesByEquipment: function (sObjectId, sObjectType, fnSuccess, fnError) {
            var sUrl = "";
            var oParam;
            if (sObjectType == "EQUI") {
                sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByEquipment");
                oParam = {
                    "equipmentId": sObjectId
                };
            } else {
                sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByFunctionalLocation");
                oParam = {
                    "functionalLocationId": sObjectId
                };
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Retrieves inspection to equipment assignments for a given object.
         * @param {string} sObjectId 
         * @param {string} sObjectType 
         * @param {string} sTemplateId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getInspToEqu: function (sObjectId, sObjectType, sTemplateId, fnSuccess, fnError) {
            var sUrl = "";
            var oParam;
            if (sObjectType == "EQUI") {
                sUrl = this.getUrl(this._baseURI, "equipmentInspectionHistory");
                oParam = {
                    "equiId": sObjectId,
                    "templateId": sTemplateId
                };
            } else {
                sUrl = this.getUrl(this._baseURI, "locationInspectionHistory");
                oParam = {
                    "functionalLocationId": sObjectId,
                    "templateId": sTemplateId
                };
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Retrieves all the inspection values.
         * @param {Object} sAssessmentId 
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
         * Retrieves the last published assessment values for a given object.
         * @param {string} sObjectType 
         * @param {string} sEquipmentId
         * @param {string} sFunctionalLocationId 
         * @param {string} sAssessmentTemplateDisplayId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getLastPublishedAssessmentValues: function (sObjectType, sEquipmentId, sFunctionalLocationId, sAssessmentTemplateDisplayId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, sObjectType === "EQUI" ? "lastPublishedAssessmentValuesByEqui" : "lastPublishedAssessmentValuesByFloc");
            var oParam = {
                "equipmentId": sEquipmentId,
                "functionalLocationId": sFunctionalLocationId,
                "assessmentTemplateDisplayId": sAssessmentTemplateDisplayId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves equipment or functional location values based on the object type.
         * @param {string} sObjectType 
         * @param {string} sEquipmentId 
         * @param {string} sFunctionalLocationId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getEquipmentOrFunctionalLocationValues: function (sObjectType, sEquipmentId, sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, sObjectType === "EQUI" ? "equipmentValue" : "functionalLocationValue");
            var oParam = {
                "equipmentId": sEquipmentId,
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves all template section.
         * @param {Object} sAssessmentTemplateId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getTemplateSectionAndExpands: function (sAssessmentTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentSectionSubsectionByTemplate");
            var oParam = {
                "assessmentTemplateId": sAssessmentTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves all the technical objects.
         * @param {string} sType 
         * @param {object} oPayload
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        attachRecToTechnicalObjects: function (oPayload, sType, fnSuccess, fnError) {
            var sUrl = "";
            if (sType == "EQUI") {
                sUrl = this.getUrl(this._baseURI, "equipmentRecommendation");
            } else if (sType == "FLOC") {
                sUrl = this.getUrl(this._baseURI, "functionalLocationRecommendations");
            }
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to get Recommendation risk field.
         * @param {String} sRecommendationId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getRecommendationRiskFields: function (sRecommendationId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "recommendationRiskFields");
            sUrl = sUrl.replace("sRecommendationId", sRecommendationId);
            this.getData(sUrl, {}, fnSuccess, fnError);

        },

        /**
         * Function to sync data based on apm recommendation id
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRecoIdFromAIS: function (sRecommendationId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRecoIdFromAIS");
            var oParam = {
                "apmRecoId": sRecommendationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
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
         * Function to sync data based on apm recommendation id
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssignedReco: function (sRecommendationId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRecoIdFromAIS");
            var oParam = {
                "apmRecoId": sRecommendationId
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
        getASDRecommendation: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getASDReco");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateRecommendationAssign: function (oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "assessmentHeader");
            var oParam = {
                "assessmentId": oPayload.ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Create Ais recommendation
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAisRec: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createNewRecommendation");
            this.postData(sUrl, {},oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the component template details.
         * @param {string} id 
         * @param {string} objType 
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
         * 
         * @param {*} sRecommendationId 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateAPMRecoInAIS: function (sRecommendationId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "attachAPMRecommendationDocument");
            var oParam = {
                "ID": sRecommendationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the component template details.
         * @param {string} id 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentStrategies: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getASDStrategy");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Function that get the equipment risk profile 
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentRiskProfile : function(sEquipmentId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "equipmentRiskProfile");
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * function to fetch APM recommendation details with workflow
         * 
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRecommendationsForComponents: function (sType, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRecommendationsBasedOnComponents");
            var oParam = {
                "sObjectType": sType
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the component template details.
         * @param {string} id 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getStrategies: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getStrategies");
            var oParam = {
                "sId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Update assessment .
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateStratergies: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkUpdateStratergies");
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function that creates the payload
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createStratergy: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createAssessmentStrategry");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the component template details.
         * @param {Object} object 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMaintenancePlanDetails: function (oTechObj, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMaintenancePlan");
            var oParam = {
                "objectName": oTechObj.name,
                "type": oTechObj.type,
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Retrieves the idms integration configuration
         * @param {string} sAssessmentTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         * @param {boolean} isShowBusy
         */
        getIdmsConfiguration: function (sAssessmentTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getInspectionTemplateWithColumnsMapping");
            var oParam = {
                "assessmentTemplateId": sAssessmentTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getInspectionTemplateWithColumnsMapping"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the idms integration value
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         * @param {boolean} isShowBusy
         */
        getInspectionMappinhValue: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentInspectionMappingValue");
            var oParam = {
                "assessmentId": sAssessmentId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateReassignStratergies: function (oPayload, fnSuccess, fnError,etag) {
            var sUrl = this.getUrl(this._baseURI, "stratergyUpdate");
            var oParam = {
                "ID": oPayload.ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true, etag);
        },

        /**
         * 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateReassignRecommendation: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateRecommendation");
            var oParam = {
                "sId": oPayload.ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true);
        },

        /**
         * 
         * @param {*} oPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateReassignMSP: function (oPayload, fnSuccess, fnError,etag) {
            var sUrl = this.getUrl(this._baseURI, "updateMSPDetail");
            var oParam = {
                "sMspId": oPayload.ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true, etag);
        },

        /**
         * Function to save strategies
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateStratergy: function(oPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "updateStrategy");
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError,true);
        },

        /**
         * Retrieves the section data
         * @param {string} sSectionId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getSubSectionBySectionId: function (sSectionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateSubSectionBySectionId");
            var oParam = {
                "sectionId": sSectionId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the class data
         * @param {string} sClassId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getCharacteristicByClassId: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentCharacteristicByClassId");
            var oParam = {
                "classId": sClassId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the class data
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getShortlongDesc: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getlongshort");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * 
         * @param {*} sAssessmentId 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getASDRolesDetails: function(sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getASDRoles");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {*} sAssessmentId 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateASDRolesDetails: function(sAssessmentId, oPayload, fnSuccess, fnError, etag) {
            var sUrl = this.getUrl(this._baseURI, "getASDRoles");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
         * Function to get bulk ASD details for workflow
         * @param {Array} aAssessmentId 
         * @param {Function} fnSuccess 
         * @param {*Function fnError 
         */
        getBulkASDDetailsForWorkflow: function (aAssessmentId, fnSuccess) {
        // getBulkASDDetailsForWorkflow: function (aAssessmentId, fnSuccess, fnError) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getBulkASDDetailsForWorkflow");
            var iProcessed = 0, iTotal = 0; 
            // var iError = 0;
            var aASDPayload = []

            /**
             * Function to check completion
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    // if (iError === 0) {
                    if (fnSuccess) {
                        fnSuccess(aASDPayload);
                    }
                    // } else {
                    //     if(fnError) {
                    //         fnError();
                    //     }
                    // }
                }
            };

            /**
             * Function to process
             * 
             * @param {Array} aAssessmentId 
             * @param {Number} iCurrent 
             * @param {Number} iChunkSize 
             */
            var fnProcess = function (aAssessmentId, iCurrent, iChunkSize) {
                var aChunk = aAssessmentId.slice(iCurrent, iCurrent + iChunkSize);
                var iChunkProcessed = 0;
                /**
                 * Function to check chunk completion
                 */
                var fnChunkComplete = function () {
                    fnComplete();
                    iChunkProcessed++;
                    if (iChunkProcessed === iChunkSize) {
                        iCurrent = iCurrent + iChunkSize;
                        fnProcess(aAssessmentId, iCurrent, iChunkSize);
                    }
                };

                aChunk.forEach(function (sAssessmentId) {
                    var sASDUrl = sUrl.replace("{assessmentId}", sAssessmentId);

                    that.fnMakeGetRequest(sASDUrl, {}, function (oResponse) {
                        aASDPayload.push(oResponse);
                        fnChunkComplete();
                    }, function () {
                        iError++;
                        fnChunkComplete();
                    }, false);
                });

            };

            iTotal = aAssessmentId.length;
            fnProcess(aAssessmentId, 0, 5);

        },

        /**
         * Function to bulk publish assessments with strategy to reco/noti creation
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkPublishAsdWithStrategyConversion: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkPublishAsdWithStrategyConversion");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves the class data
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getDescriptionPicklist: function (picklistName, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getPicklistData");
            var oParam = {
                name: picklistName
            }
            this.getData(sUrl, oParam, fnSuccess, fnError,false);
        },

        /**
		 * Retrieves the stream templates
         * @param {string} sObjectId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getStreamsByObjectId: function (sObjectId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getStreamsByObjectId");
            var oParam = {
                "objectId": sObjectId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + sObjectId + "getStreamsByObjectId"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, false, oCacheConfig);
        },

        /**
         * Retrieves the stream values
         * @param {string} sStreamId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getStreamValues: function (sStreamId, fnSuccess, fnError, isShowBusy) {
            var sUrl = this.getUrl(this._baseURI, "streamValues");
            var oParam = {
                "streamId": sStreamId
            };
            var bBusy = true;

            if (isShowBusy == false) {
                bBusy = false;
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);
        },

        /**
		 * Function to set area cof values
         * 
		 */
        fnUpdateCofData: function (oPayload,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateCofData");
            var oParam = {
                "templateId": oPayload.assessmentTemplateId,
                "templateVersion" : oPayload.assessmentTemplateVersion,
                "objectId" : oPayload.objectId,
                "objectType" : oPayload.objectType,
                "objectTemplateId":oPayload.objectTemplateId,
                "uomSystem" : oPayload.uomSystem
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to bulk fetch assessments strategies
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkFetchAssessmentStrategies: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkFetchAssessmentStrategies");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to bulk fetch assessments strategies
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        loadAssessmentStrategies: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAssessmentStrategies");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },
        /** 
         * Function to save assessments strategies
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        saveAssessmentStrategies: function (sAssessmentId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "saveAssessmentStrategies");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },
        /**
         * Function to assign WorkOrder to asd
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        AssignWorkOrder: function (sassessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "AssignWorkOrderAsd");
            var oParam = {
                assessmentId: sassessmentId,   
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },
        
        
        /**
         * Function to unassign WorkOrder to asd
         * @param {String} sCharId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */     
        UnAssignWorkOrder: function (sassessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "unAssignWorkOrderAsd");
            var oParam = {
                assessmentId: sassessmentId,  
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves a list of risk transitions.
         * @param {String} sTemplateId
		 * @param {function} fnSuccess - A callback function to be called on successful retrieval.
		 * @param {function} fnError - A callback function to be called on retrieval failure.
		 */
        fnGetRiskTransistionData : function(sTemplateId,fnSuccess, fnError){
            var that = this;
            var sUrl = this._baseURI + this.URL["fnGetRiskTransistionData"];
            var oParam = {
                "templateId": sTemplateId
            };

            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "riskTransitionData"
            });

            that.getData(sUrl, oParam, fnSuccess, fnError,true,oCacheConfig); 
        },
        /**
         * Retrieves the object details.
         * @param {string} sObjectType
         * @param {string} sObjectId
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getObjectDetailsV2: function (sObjectType, sObjectId, fnSuccess, fnError) {
 
            var sUrl = this.getUrl(this._baseURI, "AsdTechnicalObjectList");
 
            sUrl = sUrl
                .replace("{techObjectType}", sObjectType)
                .replace("{techObjectId}", sObjectId);
 
            this.getData(sUrl, {}, fnSuccess, fnError,false);
        },
        /**
         * Retrieves CMLs for the provided CML IDs.
         * @param {Array} aCmlIds - Array payload containing the CML IDs to retrieve.
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getCMLsByObjectIdV2: function (aCmlIds, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getCMLsByObjectIdV2");
            this.postData(sUrl, {}, aCmlIds,fnSuccess, fnError,false);
        },
        /**
         * Retrieves the CMLs for the provided technical object IDs.
         * @param {string[]} aTechnicalobjectIds Technical object IDs to post as the request body.
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getCMLsByTechnicalObjectIdV2: function (aTechnicalobjectIds, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getCMLByTechnicalObjectIdV2");
            
            
            this.postData(sUrl, {}, aTechnicalobjectIds, fnSuccess, fnError,false);
        },
        /**
         * Retrieves the config data for the provided technical object IDs.
         * @param {string[]} aTechnicalobjectIds Technical object IDs to post as the request body.
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getAsdDataSourceConfig : function (aTechnicalobjectIds, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAsdDataSourceConfig");
            
            
            this.postData(sUrl, {}, aTechnicalobjectIds, fnSuccess, fnError,false);
        },
        /**
		 * Create UOM conversion.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        fnUoMConversion: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "uomConversion");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

    });

});