sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.AssetStratergy", {

        /**
         * Initializes the component
         * This function is called when the component is initialized
         * It attaches the 'fnInitialize' function to the "nEquipmentDetail" route pattern matched event
         */
        onInit: function () {

            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);

        },

        /**
         * This function is called after the component has been rendered
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },

        /**
         * 
         */
        fnInitialize: function () {

            var that = this;
            this.oI18n = this.getView().getModel("i18n").getResourceBundle();
            that.fngetAssessmentList();
            that.fnGetRCMFleetAssessmentList();
        },

        /**
         * Function that fetch assessment details
         */
        fngetAssessmentList: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            that.dataSource.getAssessmentDetails(sEquipmentId, function (oDataRec) {
                if (oDataRec) {
                    var attachAssessment = [], assessmentsIds = [];
                    if (oDataRec.to_attached_assessment && oDataRec.to_attached_assessment.length > 0) {
                        oDataRec.to_attached_assessment.forEach(function (attachedAssmt) {
                            var obj = {
                                assessmentID: attachedAssmt.ID,
                                assessmentDisplayId: attachedAssmt.displayId,
                                assessmentDesc: attachedAssmt.to_description ? attachedAssmt.to_description.shortDescription : "",
                                assessmentTempDesc: attachedAssmt.to_assessmentTemplate && attachedAssmt.to_assessmentTemplate.to_description ? attachedAssmt.to_assessmentTemplate.to_description.shortDescription : "",
                                assessmentTempDisplayId: attachedAssmt.to_assessmentTemplate ? attachedAssmt.to_assessmentTemplate.displayId : "",
                                assessmentTempID: attachedAssmt.to_assessmentTemplate ? attachedAssmt.to_assessmentTemplate.ID : "",
                                equiID: oDataRec.ID,
                                equiName: oDataRec.name,
                                equiDesc: oDataRec.to_description && oDataRec.to_description.length > 0 ? oDataRec.to_description[0].shortDescription : "",
                                category: attachedAssmt.category,
                                createdOn: that.formatter.formatDate(attachedAssmt.createdAt, ""),
                                createdBy: attachedAssmt.createdBy,
                                status: attachedAssmt.status,
                                publishedOn: that.formatter.formatDate(attachedAssmt.publishedOn, ""),
                                publishedBy: attachedAssmt.publishedBy
                            }
                            if (obj.category === "ASD" && !attachedAssmt.deleted) {
                                attachAssessment[attachedAssmt.ID] = obj;
                                assessmentsIds.push(attachedAssmt.ID);
                            }
                        })
                    }
                    if (oDataRec.child_equipments && oDataRec.child_equipments.length > 0) {
                        oDataRec.child_equipments.forEach(function (childEqui) {
                            if (childEqui.to_attached_assessment && childEqui.to_attached_assessment.length > 0) {
                                childEqui.to_attached_assessment.forEach(function (attachedAssmt) {
                                    var obj = {
                                        assessmentID: attachedAssmt.ID,
                                        assessmentDisplayId: attachedAssmt.displayId,
                                        assessmentDesc: attachedAssmt.to_description ? attachedAssmt.to_description.shortDescription : "",
                                        assessmentTempDesc: attachedAssmt.to_assessmentTemplate && attachedAssmt.to_assessmentTemplate.to_description ? attachedAssmt.to_assessmentTemplate.to_description.shortDescription : "",
                                        assessmentTempDisplayId: attachedAssmt.to_assessmentTemplate ? attachedAssmt.to_assessmentTemplate.displayId : "",
                                        assessmentTempID: attachedAssmt.to_assessmentTemplate ? attachedAssmt.to_assessmentTemplate.ID : "",
                                        equiID: childEqui.ID,
                                        equiName: childEqui.name,
                                        equiDesc: childEqui.to_description[0].shortDescription,
                                        category: attachedAssmt.category,
                                        createdOn: that.formatter.formatDate(attachedAssmt.createdAt, ""),
                                        createdBy: attachedAssmt.createdBy,
                                        status: attachedAssmt.status,
                                        publishedOn: that.formatter.formatDate(attachedAssmt.publishedOn, ""),
                                        publishedBy: attachedAssmt.publishedBy
                                    }
                                    if (obj.category === "ASD" && !attachedAssmt.deleted) {
                                        attachAssessment[attachedAssmt.ID] = obj;
                                        assessmentsIds.push(attachedAssmt.ID);
                                    }
                                })
                            }
                        })
                    }
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/data/map", attachAssessment);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/data/list", Object.values(attachAssessment));
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.header.text1", [Object.values(attachAssessment).length]));
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/assessmentId", assessmentsIds);
                    that.fnGetCharacData(0, 5);
                }
            }, function () {
                that.fnMessageShow("E", that.oI18n.getText("asint.equipment.assetIntelligence.message001"));
            })
        },

        /**
         * Function that fetches the characterstic value of assessment
         * @param {Number} skip 
         * @param {Number} top 
         */
        fnGetCharacData: function (skip, top) {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var assessmentIds = mEquipmentDetail.getProperty("/data/assetIntelligence/assessment/assessmentId");
            var aIdsToFetchChar = assessmentIds.slice(skip, top);
            /**
             * Callback function
             * @param {String} index 
             */
            var fnComplete = function (index) {
                if (index < aIdsToFetchChar.length) {
                    // that.dataSource.getCharacterstics(aIdsToFetchChar[index], function(oDataRec){
                    //     //need to code after discussing it with ashweyth
                    // }, function(){
                    //     that.fnMessageShow("E", that.oI18n.getText("asint.equipment.assetIntelligence.message003"));
                    // })
                }
            };
            fnComplete(0);

        },

        /**
         * Function to search in asset strategy
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                var oAssessmentDisplayId = new Filter({
                    path: "assessmentDisplayId",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var oAssesmentDesc = new Filter({
                    path: "assessmentDesc",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var oNameFilter = new Filter({
                    path: "equiName",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var oDescriptionFilter = new Filter({
                    path: "equiDesc",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var createdBy = new Filter({
                    path: "createdBy",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var publishedBy = new Filter({
                    path: "publishedBy",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var status = new Filter({
                    path: "status",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });

                aFilters.push(new Filter({
                    filters: [oNameFilter, oDescriptionFilter, oAssesmentDesc, oAssessmentDisplayId, createdBy, publishedBy, status],
                    and: false
                }));
            }

            var oTable = this.byId("idAsintassemt");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        /**
         * Function to handle navigation to ASD
         */
        onPressAssetStrategyTitle: function (oEvent) {
            var that = this;
            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sAssessmentId = oSelected.assessmentID
            var sHashWithKeyword = this.NAVIGATION.ASSET_STRATEGY_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{assetStrategyId}", sAssessmentId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        },

        /**
         * Function to display the assessment based on Segmented button selection change
         * @param {Object} oEvent 
         */
        onSegmentChange: function (oEvent) {

            var that = this;
            var oSelected = oEvent.getSource().getSelectedKey();
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");

            if (oSelected === "rbi") {
                mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rbi/isVisible", true);
                mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rcm_fleet/isVisible", false);
            } else if (oSelected === "rcm_fleet") {
                mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rbi/isVisible", false);
                mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rcm_fleet/isVisible", true);
            }

        },

        /**
         * Function to get the RCM/Fleet Assessment List
         */
        fnGetRCMFleetAssessmentList: function () {

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");

            var oData = {
                "childs": []
            };

            if (sEquipmentId) {
                /**
                 * Function to set data to the model
                 */
                var fnCallBackCount = function () {
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rcm_fleet/list", oData);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rcm_fleet/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.header.text2", [oData.childs.length]));
                }
                that.dataSource.getRCMAssessmentDetails(sEquipmentId, function (oDataResRCM) {
                    if (oDataResRCM) {
                        var aDataRCM = [];
                        aDataRCM = aDataRCM.concat(oDataResRCM);
                    }

                    if (aDataRCM.length > 0) {
                        aDataRCM.forEach(function (oItem) {
                            var oTempObj = {
                                "assessmentName": oItem.SHORTDESCRIPTION,
                                "assessmentDisplayId": oItem.NAME,
                                "assessmentId": oItem.ID,
                                "assessmentStatus": oItem.STATUS,
                                "createdOn": that.formatter.formatDate(oItem.createdAt, ""),
                                "createdBy": oItem.createdBy,
                                "type": "ASSESSMENT",
                                "childs": oItem.childs
                            }
                            oData.childs.push(oTempObj);
                        });
                    }
                    fnCallBackCount();
                }, function () {
                    fnCallBackCount();
                });

                that.dataSource.getFleetAssessmentDetails(sEquipmentId, function (oDataResFleet) {
                    /**
                     * Function to formate the data
                     * @param {Object} obj 
                     * @returns 
                     */
                    function keysToLowerCase(obj) {
                        if (Array.isArray(obj)) {
                            return obj.map(keysToLowerCase);
                        } else if (obj !== null && typeof obj === "object") {
                            return Object.entries(obj).reduce((acc, [key, value]) => {
                                let lowerKey = key.toLowerCase();

                                if (lowerKey === "code_id") {
                                    lowerKey = "code";
                                }
                                if (lowerKey === "failurescenario") {
                                    lowerKey = "failureScenario";
                                }

                                acc[lowerKey] = keysToLowerCase(value);
                                return acc;
                            }, {});
                        }
                        return obj;
                    }

                    var aDataList = keysToLowerCase(oDataResFleet.fleetAssessments);

                    if (aDataList) {
                        var aData = [];
                        aData = aData.concat(aDataList);
                    }

                    if (aData.length > 0) {
                        aData.forEach(function (oItem) {
                            var oTempObj = {
                                "assessmentName": oItem.assessmentdescription,
                                "assessmentDisplayId": oItem.assessmentname,
                                "assessmentId": oItem.assessmentid,
                                "assessmentStatus": oItem.assessmentstatus,
                                "createdOn": that.formatter.formatDate(oItem.createdat, ""),
                                "createdBy": oItem.createdby,
                                "type": "ASSESSMENT",
                                "childs": oItem.childs
                            }
                            oData.childs.push(oTempObj);
                        });
                    }
                    fnCallBackCount();
                }, function () {
                    fnCallBackCount();
                });
            }
            mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rcm_fleet/list", oData);
            mEquipmentDetail.setProperty("/data/assetIntelligence/assessment/segmentedBtn/rcm_fleet/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.header.text2", [oData.childs.length]));


        },

        /**
         * Function to navigate to assessment
         */
        onPressAssessmentLink: function (oEvent) {

            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sId = oSelected.assessmentId;

            if (sId) {
                this.fnNavigateToRCMDetail(sId);
            } else {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message03"));
            }

        },


    });
});