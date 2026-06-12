sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.FunctionalLocation", {

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
		 * Retrieves the functional location details.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationDetail: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetailHeader"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Get the FLOC Maintenance Plans
         * @param {*} sFunctionalLocationId 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getFlocMaintenancePlanDetails: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getFlocMaintenancePlanDetails"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates functional location.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createFunctionalLocation: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocation"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update functional location detail.
		 * @param {string} sFunctionalLocationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateFunctionalLocationDetail: function (sFunctionalLocationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetail"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Delete the functional location.
         * @param {string} sFunctionalLocationId 
         * @param {Object} oPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
         * @param {string} eTag
		 */
        deleteFunctionalLocation: function (sFunctionalLocationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetail"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the Characteristic values.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacteristicsValue: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationValue"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update FLOC Characteristics value.
		 * @param {string} sFunctionalLocationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateFLOCCharacteristicsValue: function (sFunctionalLocationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationValue"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the assigned notifications.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssignedNotifications: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetailExpandNotification"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the functional location list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "functionalLocationList");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the assigned work orders.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssignedWorkorders: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationExpandWorkorder"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the functional location template.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getLocTemplate: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["functionalLocationExpandWorkorder"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Get Object Template List based on functional location Id
         * 
         * @param {String} sFunctionalLocationId - functional location Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getObjectTemplateByFunctionalLocationId: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationObjectTemplate"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Update the Object templated attached to functional location
         * @param {String} sFunctionalLocationId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateFunctionalLocationDetailExpanded: function (sFunctionalLocationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetailExpanded"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Update the Object templated attached to functional location
         * @param {String} sFunctionalLocationId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateFunctionalLocationObjectTemplates: function (sFunctionalLocationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationObjectTemplate"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Update the Object templated attached to functional location
         * @param {String} sFunctionalLocationId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateFunctionalLocationObjectTemplatesAndAssignClass: function ( oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationObjectTemplateWithClass"];
            var oParam = {
                // "functionalLocationId": sFunctionalLocationId
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Update functional location Characteristics value.
		 * @param {string} sFunctionalLocationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateFLOCDetail: function (sFunctionalLocationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetailExpanded"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Get assigned classes based on FLOC Id
         * 
         * @param {String} sFLOCId - FLOC Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getFLOCAssignedClasses: function (sFLOCId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["flocAssignedClass"];
            var oParam = {
                "functionalLocationId": sFLOCId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

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
         * Get assigned classes based on FLOC Id
         * 
         * @param {String} sFLOCId - FLOC Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getFLOCChildEqusFlocs: function (sFLOCId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["flocChildEqusFlocs"];
            var oParam = {
                "functionalLocationId": sFLOCId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
        * Fetches  Category 
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getFlocCategory: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["flocCategory"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
         * Fetches  type
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFlocType: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["flocTechnicalObjectType"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
         * Fetches  abc indicator 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFlocAbcIndicator: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["flocABCINDICATOR"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },


        /**
         * Function to 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFirstLocationForMetadata: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["functionalLocation"];

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the functional location details.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationDetailExp: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetailForExport"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the functional location component.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationComponentsExp: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationComponentsForExport"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the functional location assignment config.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationsAssignmentConfigExpL1: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationObjectTemplatesAndClasses"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the functional location assignment char value EXP.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationsAssignmentCharcValueExp: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationValueForExport"];
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Fetches  plant list
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getplantList: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["flocPlantlist"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
         * Fetch the Risk Summary based on FLOC Name and It's components
         * 
         * @param {Array} aPayload - Current Functional Location Name and It's components
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        fnGetRiskSummary: function (aPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["riskSummary"];

            this.postData(sUrl, {}, aPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the assessment details.
         * @param {string} ID 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentDetails: function (ID, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["attachedAssessmentFloc"];
            var oParam = {
                "flocID": ID
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the child floc assessment list.
         * @param {string} ID 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getChildFLocAssessmentList: function (ID, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["attachedchildFLoc"];
            var oParam = {
                "flocID": ID
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Get the List of Recommendation attached to the Asset based on ID and Type
         * 
         * @param {String} sObjectId    - ID of the Asset(EQUI ID / FLOC ID)
         * @param {String} sObjectType  - Object Type of the Asset (EQUI/FLOC)
         * @param {Function} fnSuccess  - Success Callback function
         * @param {Function} fnError    - Error Callback function
         */
        fnGetRecommendationsByObject: function (sObjectId, sObjectType, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["recommendationByObject"];
            var oParam = {
                "sObjectId": sObjectId,
                "sObjectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Unassign Child Components from an equipment
         * @param {string} sComponentId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        unAssignParentComponent: function (sComponentId, sType, sKey, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["unAssignFLOCComponent"];
            var oParam = {
                "sComponentId": sComponentId,
                "sObjectType" : sType,
                "sKey":sKey
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Fetch Parent Info
         * @param {string} sParentAssetId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getParentInfo: function (sParentAssetId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetail"];
            var oParam = {
                "functionalLocationId": sParentAssetId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Removes a parent association from an equipment object.
         * @param {string} sFLOCId 
         * @param {string} parentKey 
         * @param {string} sObjectType 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        removeParent: function (sFLOCId, sObjectType, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["assinUnassignParentFloc"];
            var oParam = {
                "flocId": sFLOCId
            };

            sUrl = sUrl.replace("{sObjectType}", sObjectType);

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function that fetches the maintenance order data
         * @param {String} sFLOCId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getMaintenanceOrderData:function(sFLOCId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["maintenanceOrderFloc"];
            var oParam = {
                "flocId": sFLOCId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to fetch codelists
         * @param {String} sCodelistId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getCodeListItems: function (sCodelistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentTemplateCodelistExpandL1");
            var oParam = {
                "codelistId": sCodelistId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Function that fetches the Task Management data
         * @param {String} sFLOCId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTaskManagementData:function(sFLOCId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["taskManagementFloc"];
            var oParam = {
                "flocId": sFLOCId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function that fetchs the btp recommendations
         * @param {String} equiID 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getBtpRecommendation:function(FlocId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getFlocReco"];
            var oParam = {
                "FlocId" : FlocId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function that fetchs the btp recommendations
         * @param {object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createNotification: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["convertNotification"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to get recommendations attached to functional location
         * @param {String} sFunctionalLocationId 
         */
        getFlocRecommendations : function(sFunctionalLocationId,fnSuccess,fnError){

            var sUrl = this._baseURI + this.URL["getFlocRecommendations"];
            var oParam = {
                "FlocId" : sFunctionalLocationId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
        * Function to get recommendations attached to child equipments 
        * @param {String} sFunctionalLocationId 
        */
        getChildEqRecommendations: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getChildEqRecommendations"];
            var oParam = {
                "FlocId": sFunctionalLocationId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
        * Function to get recommendations attached to child floc 
        * @param {String} sFunctionalLocationId 
        */
        getChildFlocRecommendations: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getChildFlocRecommendations"];
            var oParam = {
                "FlocId": sFunctionalLocationId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
      
        /**
		 * Function that get the equipment risk profile 
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFLOCRiskProfile : function(sFlocId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "flocRiskProfile");
            var oParam = {
                "flocId": sFlocId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to get picklist info
         * @param {String} pickListId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getLocationandComponentsInspections:function(sFlocId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getLocationandComponentInspections"];
            var oParam = {
                "flocId": sFlocId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get picklist info
         * @param {String} pickListId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getLocationandComponentFindings:function(sFlocId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getLocationandComponentFindings"];
            var oParam = {
                "flocId": sFlocId
            };
            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get RCM details info
         * @param {String} sFLOCId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRCMAssessmentDetailsForFloc: function (sFLOCId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getRcmAssessmentForFloc"];
            var oParam = {
                "flocId": sFLOCId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },


        /**
         * Function to get Fleet details info
         * @param {String} sFLOCId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFleetAssessmentDetailsForFloc: function (sFLOCId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getFleetAssessmentForFloc"];
            var oParam = {
                "flocId": sFLOCId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to get Risk and Criticality Assessment
         * 
         * @param {String} sTechnicalObjectId  - EQUI / FLOC
         * @param {Function} fnSuccess - Success callback
         * @param {Function} fnError - Error callback
         */
        fnGetRnCAssessment: function (sTechnicalObjectId, fnSuccess, fnError) {
            
            var sUrl = this._baseURI + this.URL["getRnCAssessment"];
            var oParam = {
                "sTechnicalObjectId": sTechnicalObjectId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Creates Stream
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createStream: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createStream");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to get Stream
         * 
         * @param {String} sStreamId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getStreamHeader: function (sStreamId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getStreamHeader");
            var oParam = {
                "streamId": sStreamId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to get Stream
         * 
         * @param {String} sStreamId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getStream: function (sStreamId, fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getStream");
            var oParam = {
                "streamId": sStreamId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Updates Stream
		 * @param {string} sStreamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateStream: function (sStreamId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateStream");
            var oParam = {
                "streamId": sStreamId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Retrieves the latest stream assessment template (category='STRM', status='PBD')
         * ordered by modifiedAt desc.
         * @param {function} fnSuccess - success callback
         * @param {function} fnError - error callback
         */
        getAssessmentTemplates: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "assessmentTemplatesLatest");

            this.getData(sUrl, {}, fnSuccess, fnError);
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
         * Update the stream values attached to stream
         * @param {String} sStreamId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         * @param {Boolean} isShowBusy 
         */
        updateStreamValues: function (sStreamId, oPayload, fnSuccess, fnError, eTag, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "updateStream");
            var oParam = {
                "streamId": sStreamId
            };
            var bBusy = true;
            if (isShowBusy == false) {
                bBusy = false;
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, bBusy, eTag);

        },
        
        /**
         * Get Technical objects details
         * @param {*} sId 
         * @param {*} sUom 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getTechnicalObjectsDetails : function(sId,sUom,fnSuccess, fnError){

            var sUrl = this._baseURI + this.URL["getTechnicalObjectsDetails"];
            var oParam = {
                "sId" : sId,
                "uomSystem" : sUom
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        }

    });

});