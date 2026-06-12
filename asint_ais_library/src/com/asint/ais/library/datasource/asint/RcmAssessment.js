/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
], function (Common, URL, Equipment, FunctionalLocation) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.RcmAssessment", {

        _baseURI: "",

        /**
         * Creates a new instance of the object.
         * @param {string} sBaseURI 
         */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
            this.equipmentDataSource = new Equipment(sBaseURI);
            this.functionLocationDataSource = new FunctionalLocation(sBaseURI);
        },

        URL: URL,

        /**
         * Get RCM Assessment Details
         * @param {String} sRcmAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcmAssessmentDetails: function (sRcmAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "rcmAssessmentDetails");
            var oParam = {
                "sRcmAssessmentId": sRcmAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * function to update rcm assessment details
         * @param {String} sRcmAssessmentId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateRcmAssessmentDetails: function (sRcmAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "rcmAssessmentDetails");
            var oParam = {
                "sRcmAssessmentId": sRcmAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Get RCM Assessment Details
         * @param {String} sRcmAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRCMAssessmentHierarchy: function (sRcmAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "rcmAssessmentHierarchy");
            var oParam = {
                "sRcmAssessmentId": sRcmAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createSystem: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createSystem");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateSystem: function (sSystemId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateSystem");
            var oParam = {
                "systemId": sSystemId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        removeEquipmentFromRCM: function (sEquipmentId, sRcmAssessmentId, oPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "removeEquipmentFromRCM");
            var oParam = {
                "equipmentId": sEquipmentId,
                "rcmAssessmentId": sRcmAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload,fnSuccess, fnError, true);
        },


        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        removeFunctionalLocationFromRCM: function (sFlocID, sRcmAssessmentId, oPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "removeFunctionalLocationFromRCM");
            var oParam = {
                "flocId": sFlocID,
                "rcmAssessmentId": sRcmAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload,fnSuccess, fnError, true);
        },
        

        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getSystemTechnicalObjects: function (sSytemId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getSystemTechnicalObjects");
            var oParam = {
                "systemId": sSytemId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createRcmAssessment: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createRcmAssessment");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
        * function to fetch rcm roles details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getRcmRolesDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getRcmRoles");
            var oParam = {
                "sRcmAssessmentId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Update Rcm Roles Details
         * @param {String} sRcmAssessmentId 
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
        */
        updateRcmRolesDetails: function (sRcmAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcmRoles");
            var oParam = {
                "sRcmAssessmentId": sRcmAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
        * create rcm assessment
        * @param {Object} oPayload 
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getSubSystemTechnicalObjects: function (sSytemId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getSubSytemTehcnicalObjects");
            var oParam = {
                "subSystemId": sSytemId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * function to fetch Failure node details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        fetchFailureNodeDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fetchFailureNodeDetails");
            var oParam = {
                "sFailureNodeId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * function to update Failure node details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        updateFailureNode: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "fetchFailureNodeDetails");
            var oParam = {
                "sFailureNodeId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
        * function to fetch Equipment details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getEquipmentDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentClassDetails");
            var oParam = {
                "equipmentId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * function to fetch floc details
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        getFunctionalLocationDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getFunctionalLocationClassDetails");
            var oParam = {
                "flocId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Get risk matrix id
         * @param {String} sMspId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchMSpRiskMatrixId: function (sFilterText, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getMSPRiskMatrixId");
            sUrl = sUrl + "?$filter=shortDescription eq '" + sFilterText + "'";
            this.getData(sUrl, {}, fnSuccess, fnError, true);
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
         * Get RCM Assessment Details
         * @param {String} sRcmAssessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRcmAssessmentHeaderWithStrategies: function (sRcmAssessmentId, fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "rcmAssessmentWorkflow");
            var oParam = {
                "sRcmAssessmentId": sRcmAssessmentId
            };

            this.getData(sUrl, oParam, function (oResponse) {
                var sRcmAsmtStrategyUrl = that.getUrl(that._baseURI, "getStrategiesData");
                var oRcmAsmtStragegyParam = {
                    "sId": sRcmAssessmentId,
                    "type": "RCM"
                };

                that.getData(sRcmAsmtStrategyUrl, oRcmAsmtStragegyParam, function (oResponse1) {
                    // var aAssessmentStrategies = [];

                    // for (var i = 0; i < oResponse1.value.length; i++) {
                    //     aAssessmentStrategies.push(oResponse1.value[i].strategy);
                    // }
                    // eslint-disable-next-line camelcase
                    oResponse.to_assessment_strategies = Array.isArray(oResponse1) ? oResponse1 : [];
                    fnSuccess(oResponse);
                }, fnError, true);
            }, fnError, true);
        },

        /**
         * Function to fetch consequence evaluation data
         * @param {String} ID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getConsequenceEvaluationData: function (ID, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getConsequenceEvaluation"];
            var oParam = {
                "failureModeId": ID,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to get the list of questions for consequence evaluation
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getConsequenceEvaluationQuestions: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getConsequenceEvaluationQuestions"];

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to fetch measurement units
         * @param {String} sObjectType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getConsequenceEvaluationUnit: function (sObjectType, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getEquiFLocValueHelpDataBasedonType"];
            var oParam = {
                "objectType": sObjectType,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to perform or update consequence evaluation
         * @param {Boolean} isOldConsequenceEval 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createorUpdateConsequenceEvaluation: function (isOldConsequenceEval, oPayload, fnSuccess, fnError,) {
            var sUrl = this._baseURI + this.URL[isOldConsequenceEval ? "updateConsequenceEvaluation" : "createConsequenceEvaluation"];

            if (isOldConsequenceEval) {
                var oParam = {
                    "consequenceEvalId": oPayload.ID,
                }
                delete oPayload.ID;

                this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
            } else {
                this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
            }
        },

        /**
         * Fetch Baseline RCM Assessments
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchBaselineRecommendations: function (oPayload, fnSuccess, fnError,) {
            var sUrl = this.getUrl(this._baseURI, "rcmRecommendBaselineAssessments");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves a list of templates.
         * @param { function} fnSuccess - A callback function to be called on successful retrieval.
         * @param { function} fnError - A callback function to be called on retrieval failure.
         */
        getTemplateList: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this._baseURI + this.URL["getRcmTemplateList"];
            that.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Get Assessment Risk Profile Data
         * @param {String} sId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssessmentRiskProfileData: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getAssessmentRiskProfileData");
            var oParam = {
                "rcmAssessmentId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * create rcm risk profile
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         */
        createRiskProfile: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createRcmRiskProfile");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
        * function to update risk profile
        * @param {String} sId  
        * @param {function} fnSuccess 
        * @param {function} fnError 
        */
        updateRiskProfile: function (sId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateRcmRiskProfile");
            var oParam = {
                "ID": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
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
         * Retrieves the assigned notifications.
         * @param {string} sEquipmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssignedNotifications: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentDetailExpandNotification"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

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
         * Retrieves the component template details.
         * @param {Object} object 
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
         * Retrieves the equipment work orders.
         * @param {string} sEquipmentId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getEquipmentWorkorders: function (sEquipmentId, fnSuccess, fnError) {

            this.equipmentDataSource.getAssignedWorkorders(sEquipmentId, fnSuccess, fnError);

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
         * Clone rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        cloneRcmAssessment: function (oPayload,fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "cloneRcm");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Bulk create recommendation
         * 
         * @param {Object} oPayload  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        bulkCreateRecommendation: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "recommendationBulkCreateV2");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Update RCM Assessment with Baseline Assessments
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateRcmAssessmentDetailsWithBaseline: function(oPayload,fnSuccess,fnError,isShowBusy){
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }
            var sUrl = this.getUrl(this._baseURI, "rcmUpdateAssessmentWithBaseline");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bBusy);
        },

        /**
        * create failure Node
        * @param {Object} oPayload 
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        createFailureNode: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createFailureNode");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },


        
        /**
         * Get assigned classes based on Equipment Id
         * 
         * @param {String} sClassId - Class Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getCharacteristicsByClassId: function (sClassId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["characteristicsByClassId"];
            var oParam = {
                "classificationId": sClassId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * create code group
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createCodeGroup: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createCodeGroup");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch Technical Objects specific to RCM Assessment
         * @param {String} sRcmID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchTechObjsForAssessment: function(sRcmID, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getTechnicalObjectForAssessment");

            var oParam = {
                "sRcmID": sRcmID
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to generate report
         * @param {String} sRcmId 
         */
        generateReport: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generateReport");
            
            // console.log(oPayload, sUrl);
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },
        
        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValues: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "getRcmAssessmentValues");
            var oParam = {
                "sRcmAssessmentId": sAssessmentId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * function to update rcm assessment values
         * @param {String} sRcmAssessmentId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateAssessmentValues: function (sRcmAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getRcmAssessmentValues");
            var oParam = {
                "sRcmAssessmentId": sRcmAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * create code
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createCode: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createCode");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * function to update code
         * @param {String} sCodeId  
         * @param {object} oPayload  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        editCode: function (sCodeId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "editCode");
            var oParam = {
                "sCodeId": sCodeId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to get bulk RCM details for workflow
         * @param {Array} aAssessmentId 
         * @param {Function} fnSuccess 
         * @param {*Function fnError 
         */
        getBulkRCMDetailsForWorkflow: function (aAssessmentId, fnSuccess) {
        // getBulkRCMDetailsForWorkflow: function (aAssessmentId, fnSuccess, fnError) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getBulkRCMDetailsForWorkflow");
            var iProcessed = 0, iTotal = 0; 
            // var iError = 0;
            var aRCMPayload = []

            /**
             * Function to check completion
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    // if (iError === 0) {
                    if (fnSuccess) {
                        fnSuccess(aRCMPayload);
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
                    var sRCMUrl = sUrl.replace("{assessmentId}", sAssessmentId);

                    that.fnMakeGetRequest(sRCMUrl, {}, function (oResponse) {
                        aRCMPayload.push(oResponse);
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

        // /**
        //  * Function to get bulk RCM details for workflow
        //  * @param {Array} aAssessmentId 
        //  * @param {Function} fnSuccess 
        //  * @param {*Function fnError 
        //  */
        // getBulkRCMDetailsForWorkflow: function (aAssessmentId, fnSuccess, fnError) {
        //     var sUrl = this.getUrl(this._baseURI, "getBulkRCMDetailsForWorkflow");

        //     this.postData(sUrl, {}, aAssessmentId, fnSuccess, fnError, true);
        // },

        /**
         * Function to bulk publish assessments with strategy to reco/noti creation
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkPublishRcmWithStrategyConversion: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkPublishRcmWithStrategyConversion");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },
         
         
        /**
         * Function to trigger evergreening
         * @param {String} sEquId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnTriggerEvergreening:function(sEquId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "triggerEvergreening");
            var oParam = {
                "sEquId": sEquId
            };
            this.postData(sUrl, oParam, {}, fnSuccess, fnError, true);
        },

        /**
         * Function to validate assigned Technical Objects
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        validateAssignedTO: function(aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "validateRCMAssignedTO");

            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to bulk fetch assessments strategies
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkFetchRCMAssessmentStrategies: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkFetchRCMAssessmentStrategies");
            var oParam = {};
            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

    });

});