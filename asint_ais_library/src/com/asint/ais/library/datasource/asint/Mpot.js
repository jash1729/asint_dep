sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/KPI",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
    "com/asint/ais/library/datasource/asint/AssessmentTemplate"
], function (Common, KPI, Equipment, FunctionalLocation, AssessmentTemplate) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.Mpot", {

        _baseURI: "",

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
         * Retrieves all the assessment templates by equipment.
         * @param {string} sEquipmentId 
         * @param {boolean} isShowBusy
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssessmentTemplatesByEquipment: function (sEquipmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "optAssessmentTemplateByEquipment");
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

            var sUrl = this.getUrl(this._baseURI, "optAssessmentTemplateByFunctionalLocation");
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
         * Create a new assessment.
         * @param {Object} oPayload 
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        createAssessment: function (oPayload, fnSuccess, fnError, isShowBusy) {

            var sUrl = this._baseURI + this.URL["optAssessment"];
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bBusy);

        },

        /**
         * Fetch Assessment Details
         */
        getAssessmentDetails: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["optAssessmentDetails"];
            var oParam = {
                "sAssessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, "");

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
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Retrieves the subsection data.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getSubSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateSubSections");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

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
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

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
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

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

            this.getData(sUrl, oParam, fnSuccess, fnError);

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

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
        * Retrieves the object map header lists .
        * @param {string} templateId 
        * @param {function} fnSuccess
        * @param {function} fnError 
        */
        getObjectMapHeaderList: function (templateId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getObjectMapHeader"];
            var oParam = {
                "templateId": templateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },


        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValues: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentMpotValues");
            var oParam = {
                "assessmentId": sAssessmentId
            };


            this.getData(sUrl, oParam, fnSuccess, fnError, "");

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

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

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

            var sUrl = this.getUrl(this._baseURI, "optAssessmentDetails");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, bBusy, eTag);

        },

        /**
         * Retrieves the recomedation.
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        recommendation: function (optimisationId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "recommnendationsApiForMpot");
            var oParam = {
                "optimisationId": optimisationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
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
         */
        calculate: function (oPayload, sAlgorithmName, sTemplateId, sTemplateVersion, sUoMSystem, bTrace, sObjectType, sObjectId, bObjectProperty,assessmentId,fnSuccess, fnError) {

            var sUrl = "";
            if (bObjectProperty === true) {
                sUrl = this.getUrl(this._baseURI, "assessmentOptimizationCalculate");
            } else {
                sUrl = this.getUrl(this._baseURI, "assessmentOptimizationCalculateWithoutObjectParams");
            }
            var oParam = {
                "algorithmName": sAlgorithmName,
                "templateId": sTemplateId,
                "templateVersion": sTemplateVersion,
                "trace": bTrace,
                "uomSystem": sUoMSystem,
                "objectId": sObjectId,
                "objectType": sObjectType,
                "assessmentId":assessmentId
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);

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

            var sUrl = this.getUrl(this._baseURI, "optAssessmentDetails");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Retrieves the publish assessment.
         * @param {string} sAssessmetId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        publishAssmt: function (sAssessmetId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "publishOptiAssmt");
            var oParam = {
                "assessmentId": sAssessmetId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

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
         * Function to fetch maintenance plan and maintenance order.
         * @param {String} sObjectId 
         * @param {String} sObjectType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchMaintenancePlanAndMaintenanceOrder: function(sObjectId,sObjectType, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "fetchMaintenancePlanAndMaintenanceOrder")

            var oParam = {
                "objectId": sObjectId,
                "objectType": sObjectType
            };
        
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
        
        /**
         * Function to fetch the saving summary data.
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchSavingSummary: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getLoadSavingSummaryData");
            this.getData(sUrl, "", fnSuccess, fnError, true);
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
         * Retrieves the assessment notifications.
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentNotifications: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchNotifications");
            var oParam = {
                "assessmentId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Retrieves the assessment notifications.
         * @param {string} sAssessmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentWorkOrders: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchWorkOrders");
            var oParam = {
                "ID": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
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
         * Retrieves dynamic form data.
         * @param {string} sAssessmentTemplateId
         * @param {string} sTechnicalObjectId
         * @param {string} [sSearchText]
         * @param {string} [sFormType]
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getDynamicFormData: function (sAssessmentTemplateId, sTechnicalObjectId, sSearchText, sFormType, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["dynamicFormData"]
                .replace("{assessmentTemplateId}", encodeURIComponent(sAssessmentTemplateId))
                .replace("{technicalObjectId}", encodeURIComponent(sTechnicalObjectId));

            if (sSearchText) { sUrl += "&searchText=" + encodeURIComponent(sSearchText); }
            if (sFormType) {
                sFormType.split(",").forEach(function (sType) {
                    sUrl += "&formType=" + encodeURIComponent(sType.trim());
                });
            }

            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * Exports dynamic form data as an Excel file.
         * @param {string} sAssessmentTemplateId
         * @param {string} sTechnicalObjectId
         * @param {string} [sSearchText]
         * @param {string} [sFormType]
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        exportExcelDynamicForm: function (sAssessmentTemplateId, sTechnicalObjectId, sSearchText, sFormType, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["exportExcelDynamicForm"]
                + "?assessmentTemplateId=" + encodeURIComponent(sAssessmentTemplateId)
                + "&technicalObjectId=" + encodeURIComponent(sTechnicalObjectId);

            if (sSearchText) { sUrl += "&searchText=" + encodeURIComponent(sSearchText); }
            if (sFormType) {
                sFormType.split(",").forEach(function (sType) {
                    sUrl += "&formType=" + encodeURIComponent(sType.trim());
                });
            }
            window.open(sUrl, "_blank");
            // this.getData(sUrl, {}, fnSuccess, fnError, true);
        },


         /**
         * Retrieves the object template with classes.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        fetchObjectTemplatesWithClassAndChar: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplatesWithClassAndCharacteristics");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);
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


    });

});