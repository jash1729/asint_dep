/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
], function (Common,Equipment,FunctionalLocation) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.FleetAssessment", {

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

        /**
         * Function to fetch MSP details
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getFleetDetails: function (sId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getFleetDetails");
            var oParam = {
                "sFleetId":sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * create rcm assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createFleetAssessment: function (oPayload,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createFleetAssessment");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * function to update fleet note details
         * @param {String} sId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {String} etag 
        */
        updateFleetDetails: function (sId, oPayload, fnSuccess, fnError, etag) {
            var sUrl = this.getUrl(this._baseURI, "getFleetDetails");
            var oParam = {
                "sFleetId": sId
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
         * Function to fetch MSP details
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getCharactersticData: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getCharData");
            var oParam = {
                "sClassId":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch MSP details
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getHierarchyDetails: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getHierarchyDataFleet");
            var oParam = {
                "assessmentId":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Update inspection.
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateOperatingContext: function (sAssessmentId, oPayload, stype, fnSuccess, fnError, eTag,selectedObjType) {
            var sUrl = "";
            if((stype === "M_I" || stype=="F_M") && selectedObjType=="LOCAL"){
                sUrl = this.getUrl(this._baseURI, "updateOperatingContext");
            }else if(stype === "M_I"){
                sUrl = this.getUrl(this._baseURI, "updateOperatingContext");
            }else if(stype=="F_M"){
                sUrl = this.getUrl(this._baseURI, "updateobjectItem");
            }else {
                sUrl = this.getUrl(this._baseURI, "updateobjectItem");              
            }
            var oParam = {
                "contextId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Update inspection.
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateAssessment: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateFleetAssessment");
            var oParam = {
                "sFleetId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Update Rcm Roles Details
         * @param {String} sAssessmentId 
         * @param {Objecr} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
        */
        updateFleetRolesDetails: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getFleetRoles");
            var oParam = {
                "sFleetId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * function to update fleet assessment details
         * @param {String} sFleetId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateFleetAssessmentDetails: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "fleetAssessmentDetails");
            var oParam = {
                "sFleetId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * 
         * @param {*} sAssessmentId 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getFleetRolesDetails: function(sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getFleetRoles");
            var oParam = {
                "sFleetId": sAssessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * @param {string} sAssessmentId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        createRecommendation: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateFleetAssessment");
            var oParam = {
                "sFleetId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Get FLEET Assessment Details
         * @param {String} sFleetId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFltAssessmentHeaderWithStrategies: function (sFleetId, fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "fleetAssessmentWorkflow");
            var oParam = {
                "sFleetId": sFleetId
            };

            this.getData(sUrl, oParam, function (oResponse) {
                var sFltAsmtStrategyUrl = that.getUrl(that._baseURI, "getStrategiesData");
                var oFltAsmtStragegyParam = {
                    "sId": sFleetId,
                    "type": "FLEET"
                };

                that.getData(sFltAsmtStrategyUrl, oFltAsmtStragegyParam, function (oResponse1) {
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
         * Clone fleet assessment
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        cloneFleetAssessment: function (oPayload,fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "cloneFleet");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
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
         * Fetch Baseline Fleet Assessments
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchBaselineRecommendations: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fleetRecommendBaselineAssessments");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Update Baseline with Fleet Assessments
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateAssessmentDetailsWithBaseline: function (oPayload, fnSuccess, fnError,isShowBusy) {
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }
            var sUrl = this.getUrl(this._baseURI, "fleetUpdateAssessmentWithBaseline");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bBusy);
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
         * Retrieves the operating context.
         * @param {string} sId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        fnFetchOperatingContextFromAssessments:function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "fnFetchOperatingContext");
            var oParam = {
                "sAssessmentId": sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
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
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateStrategy: function (oPayload,fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkupdatetechobjstrategy");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Get failure data profile details
         * 
         * @param {String} sClassId - Class Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
        */
        getFailureDataProfile: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getFailureDataProfile");
            var oParam = {
                "classId": sClassId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError,true);
        },

        /**
         * Function to generate report
         * @param {String} sFleetId
         */
        generateReport: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generateReport");
            
            // console.log(oPayload, sUrl);
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves a list of templates.
         * @param { function} fnSuccess - A callback function to be called on successful retrieval.
         * @param { function} fnError - A callback function to be called on retrieval failure.
         */
        getTemplateList: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this._baseURI + this.URL["getFleetTemplateList"]
            that.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValues: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "getFleetAssessmentValues");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };

            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);

        },

        /**
         * function to update fleet assessment values
         * @param {String} sAssessmentId  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        updateAssessmentValues: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "getFleetAssessmentValues");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
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
         * Bulk create recommendation
         * 
         * @param {Object} oPayload  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        bulkAssignTehniclObjectToFM: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "bulkAssignTehniclObjectToFM");
            var oParam = {
                "sAssessmentId": sAssessmentId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to get bulk RCM details for workflow
         * @param {Array} aAssessmentId 
         * @param {Function} fnSuccess 
         * @param {*Function fnError 
         */
        getBulkFLTDetailsForWorkflow: function (aAssessmentId, fnSuccess) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getBulkFLTDetailsForWorkflow");
            var iProcessed = 0, iTotal = 0; 
            // var iError = 0;
            var aFLTPayload = [];

            /**
             * Function to check completion
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    if (fnSuccess) {
                        fnSuccess(aFLTPayload);
                    }
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
                    var sFLTUrl = sUrl.replace("{assessmentId}", sAssessmentId);

                    that.fnMakeGetRequest(sFLTUrl, {}, function (oResponse) {
                        aFLTPayload.push(oResponse);
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
        bulkPublishFleetWithStrategyConversion: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkPublishFleetWithStrategyConversion");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to bulk fetch assessments strategies
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        bulkFetchFleetAssessmentStrategies: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkFetchFleetAssessmentStrategies");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, true);
        },
    })

});

