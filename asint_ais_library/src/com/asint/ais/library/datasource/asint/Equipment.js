/* eslint-disable no-unused-vars */
sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.Equipment", {

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
		 * Retrieves the equipment details.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentDetail: function (sEquipmentId, fnSuccess, fnError) {

            // var that = this;
            var sUrl = this._baseURI + this.URL["equipmentDetailExpanded"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, function (oEquipmentDetail) {

                // oEquipmentDetail.to_description = that.fnSortDescByPrefAndPriority(oEquipmentDetail.to_description);

                // if (oEquipmentDetail.to_class) {
                // 	oEquipmentDetail.to_class.forEach(function (oClass) {

                // 		if (oClass.classes) {
                // 			oClass.classes.to_description = that.fnSortDescByPrefAndPriority(oClass.classes.to_description);

                // 			if (oClass.classes.to_characteristic) {
                // 				oClass.classes.to_characteristic.forEach(function (oCharacteristics) {

                // 					if (oCharacteristics.characteristic) {
                // 						oCharacteristics.characteristic.to_description = that.fnSortDescByPrefAndPriority(oCharacteristics.characteristic.to_description);

                // 						if (oCharacteristics.characteristic.to_codeList) {

                // 							if (oCodeList.codeList) {
                // 								oCodeList.codeList.to_description = that.fnSortDescByPrefAndPriority(oCodeList.codeList.to_description);

                // 								if (oCodeList.codeList.to_codeListItem) {
                // 									oCodeList.codeList.to_codeListItem.forEach(function (oCodeListItem) {
                // 										oCodeListItem.to_description = that.fnSortDescByPrefAndPriority(oCodeListItem.to_description);
                // 									});
                // 								}
                // 							}

                // 						}
                // 					}
                // 				});
                // 			}
                // 		}
                // 	});
                // }

                fnSuccess(oEquipmentDetail);
            }, fnError);

        },

        /**
		 * Creates equipment.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createEquipment: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipment"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update equipment detail.
		 * @param {string} sEquipmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateEquipmentDetail: function (sEquipmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["equipmentDetailExpanded"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Unassign Child Components from an equipment
         * @param {string} sComponentId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        unAssignComponent: function (sComponentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["unAssignComponent"];
            var oParam = {
                "sComponentId": sComponentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Update equipment object template.
		 * @param {string} sEquipmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateEquipmentObjectTemplates: function (sEquipmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["equipmentObjectTemplateOnly"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Update equipment object template.
		 * @param {string} sEquipmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateEquipmentObjectTemplatesAndAssignClass: function ( oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["equipmentObjectTemplateWithClass"];
            var oParam = {
                // "equipmentId": sEquipmentId
            };

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Delete the equipment.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        deleteEquipment: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentDetail"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.deleteData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the Characteristic values.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacteristicsValue: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentValue"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update equipment Characteristics value.
		 * @param {string} sEquipmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateEquipmentCharacteristicsValue: function (sEquipmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["equipmentValue"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

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
		 * Retrieves the equipment list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "equipmentList");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the assigned work orders.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssignedWorkorders: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentDetailExpandWorkorder"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Function fetch the hierarchy for list in equipments
         * @param {String} sEmail  contains email of user 
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError     return error callback
         */
        getEquipmentHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "equipmentHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Get Object Template List based on Equipment Id
         * 
         * @param {String} sEquipmentId - Equipment Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getObjectTemplateByEquipmentId: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentObjectTemplateOnly"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * get failure_data_profile
         * @param {String} sEquipmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getEquipmentFailurDataLibrary:function (sEquipmentId,fnSuccess,fnError) {
            var sUrl = this._baseURI + this.URL["equipmentFailurDataList"];
            var oParam = {
                "equipmentId": sEquipmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Get assigned classes based on Equipment Id
         * 
         * @param {String} sEquipmentId - Equipment Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getEquipmentAssignedClasses: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentAssignedClass"];
            var oParam = {
                "equipmentId": sEquipmentId
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
         * Get child equipments based on Equipment Id
         * 
         * @param {String} sEquipmentId - Equipment Id
         * @param {Function} fnSuccess - Return Success callback
         * @param {Function} fnError - Return Error callback
         */
        getChildEquipmentsByEquipmentId: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentChildEquipments"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Fetch the Risk Summary based on EQUI Name and it's component
         * 
         * @param {Array} aPayload - Current EQUI Name and it's component
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        fnGetRiskSummary: function (aPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["riskSummary"];

            this.postData(sUrl, {}, aPayload, fnSuccess, fnError);

        },

        /**
         * Function to 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFirstEquipmentForMetadata: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["equipment"];

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the assessment details.
         * @param {string} ID 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessmentDetails: function (ID, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["attachedAssessment"];
            var oParam = {
                "equiID": ID
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the Characterstics.
         * @param {string} assessmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacterstics: function (assessmentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["assessmentChar"];
            var oParam = {
                "ID": assessmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Fetches equipment Category 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquipmentCategory: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentCategory"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
         * Fetches equipment type
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquipmentType: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentTechnicalObjectType"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
         * Fetches equipment abc indicator 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquipmentAbcIndicator: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentABCINDICATOR"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
		 * Retrieves the equipment details.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentDetailExp: function (sEquipmentId, fnSuccess, fnError) {

            // var that = this;
            var sUrl = this._baseURI + this.URL["equipmentDetailForExport"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the equipment component.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentComponentsExp: function (sEquipmentId, fnSuccess, fnError) {

            // var that = this;
            var sUrl = this._baseURI + this.URL["equipmentComponentsForExport"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the equipment assignment config.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentsAssignmentConfigExpL1: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentObjectTemplatesAndClasses"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the equipment assignment char value EXP.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentsAssignmentCharcValueExp: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentValueForExport"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
        * Fetches  plant list
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getplantList: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equiPlantlist"];
            this.getData(sUrl, "", fnSuccess, fnError);
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
         * Fetch Parent Equipment Info
         * @param {string} sParentAssetId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnGetParentEquipmentInfo: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equipmentDetail"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Fetch Parent Floc Info
         * @param {string} sParentAssetId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnGetParentFlocInfo: function (sParentAssetId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["functionalLocationDetail"];
            var oParam = {
                "functionalLocationId": sParentAssetId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Removes a parent association from an equipment object.
         * @param {string} sEquipmentId 
         * @param {string} parentKey 
         * @param {string} sObjectType 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        removeParent:function(sEquipmentId,parentKey, sObjectType,fnSuccess,fnError){
            
            var sUrl = this._baseURI + this.URL["assinUnassignParent"];
            var oParam = {
                "equipmentId": sEquipmentId
            };

            sUrl = sUrl.replace("{sObjectType}",sObjectType);
            sUrl = sUrl.replace("{sKey}",parentKey);

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
           
        },

        /**
		 * Creates notification.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createNotification: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["convertNotification"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the BTP recommendation.
         * @param {string} equiID 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getBtpRecommendation:function(equiID, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getEquiReco"];
            var oParam = {
                "equiId" : equiID
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
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
		 * Retrieves the equipment task list with child.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentTaskListWithChildEquipments : function(sEquipmentId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentTaskLists");
            var oParam = {
                "equipmentId": sEquipmentId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },


        /**
		 * Retrieves the equipment user status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentUserStatusEnum : function(fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentUserStatusEnum");
            this.getData(sUrl, {}, fnSuccess, fnError);

        },

        /**
		 * Retrieves the equipment system status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentSystemStatusEnum : function(fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentSystemStatusEnum");
            this.getData(sUrl, {}, fnSuccess, fnError);

        },

        /**
        * Retrieves unit locations enum
        * @param {function} fnSuccess
        * @param {function} fnError
        */
        getUnitLocations: function(fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getUnitLocations");
            this.getData(sUrl, {}, fnSuccess, fnError);
            
        },

        /**
		 * Function that gets the recommendation data 
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAPMRecommendations : function(sEquipmentId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquiAPMReco");
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Function that gets the recommendation data 
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAISRecommendations : function(sEquipmentId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquiAISReco");
            var oParam = {
                "equipmentId": sEquipmentId
            }
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
         * Function to get recommendations attached to equipment
         * @param {String} sEquipmentId 
         */
        getEquipmentRecommendations : function(sEquipmentId,fnSuccess,fnError){

            var sUrl = this._baseURI + this.URL["getEquipmentRecommendations"];
            var oParam = {
                "equipmentId" : sEquipmentId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
        * Function to get recommendations attached to child equipments 
        * @param {String} sEquipmentId 
        */
        getChildEquipmentRecommendations: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getChildEquipmentRecommendations"];
            var oParam = {
                "equipmentId": sEquipmentId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },
        
        /**
        * Function to get ComponenetType
        * @param {String} sEquipmentId 
        */
        getComponentTypePicklist: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getComponentTypePicklist"];

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
         * Get risk matrix id
         * @param {String} sMspId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnFetchRiskMatrixId : function(sFilterText, fnSuccess, fnError){

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
        getMatrixDetail :function(sMatrixId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixDetailExpanded"];
            var oParam = {
                "matrixId": sMatrixId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to fetch equipment risk values count
         */
        getEquiRiskValuesCount : function(sFilters, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquiRiskMatrixCounts"];
            if(sFilters){
                sUrl = sUrl + "?" + sFilters;
            }

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to fetch equipment risk values count
         */
        getHighConsequenceRiskValuesCount : function(sFilters, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquiRiskMatrixCounts"];
            sUrl = sUrl + "?matrixType=HC";
            if(sFilters){
                sUrl = sUrl + "&" + sFilters;
            }

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to fetch equipment risk values count
         */
        getEquiAnalyticsItemList : function(sFilters, iStart, iSize, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquiAnalyticsItemsList"];
            if(sFilters){
                sUrl = sUrl + "?" + sFilters;
                sUrl = sUrl + "&page=" + iStart + "&size=" + iSize;
            }else{
                sUrl = sUrl + "?page=" + iStart + "&size=" + iSize;
            }

            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to get picklist info
         * @param {String} pickListId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquipmentandComponentsInspections:function(sEquipmentId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquipmentandComponentInspections"];
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get picklist info
         * @param {String} pickListId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquipmentandComponentFindings:function(sEquipmentId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquipmentandComponentFindings"];
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get RCM details info
         * @param {String} sEquipmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRCMAssessmentDetails: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getRCMAssessment"];
            var oParam = {
                "equipmentId": sEquipmentId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },


        /**
         * Function to get Fleet details info
         * @param {String} sEquipmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFleetAssessmentDetails: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getFleetAssessment"];
            var oParam = {
                "equipmentId": sEquipmentId
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
         * Function to get AI ASD data for equipment
         * @param {String} sEquipmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAIAsdDataForEquipment: function(sEquipmentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getEquipmentAIAsdData"];
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get AI Inspection data for equipment
         * @param {String} sEquipmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAIInspectionDataForEquipment: function(sEquipmentId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquipmentAIInspectionData"];
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get AI CML data for equipment
         * @param {String} sEquipmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAICmlDataForEquipment: function(sEquipmentId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEquipmentAICmlData"];
            var oParam = {
                "equipmentId": sEquipmentId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * Function to get ai recommendation
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAISumaryDetails: function(oPayload, sApp, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["AISummaryDetails"];
            var oParam = {
                "type": sApp
            }
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },
        
        /**
         * Fetch nearest S4 parent fields for copy dialog
         * @param {String} sEquipmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnGetNearestS4ParentFields: function (sEquipmentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getNearestS4Parent"];
            var oParam = {
                "equipmentId": sEquipmentId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to get equipment component type 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnGetComponentEquiTypeXOMPicklist: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getComponentEquiTypeXOMPicklist");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to get floc component type
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnGetComponentFlocTypeXOMPicklist: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getComponentFlocTypeXOMPicklist");
            this.getData(sUrl, {}, fnSuccess, fnError);
        }



    });

});
