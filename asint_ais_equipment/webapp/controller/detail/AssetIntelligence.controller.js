sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/base/Log"
], function (BaseController, Sorter, Filter, FilterOperator, Logger) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.AssetIntelligence", {

        /**
         * Initializes the component
         * This function is called when the component is initialized
         * It attaches the 'fnInitialize' function to the "nEquipmentDetail" route pattern matched event
         */
        onInit: function () {
            this._oLogger = Logger.getLogger("EquipmentAssetIntelligenceController");
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

            this.oI18n = this.getView().getModel("i18n").getResourceBundle();

            this.isRecommendationTargetDescending = true;
            this.fnGetRecommendations();
            // this.fnGetRACData();
            // this.fnGetAssessmentListForEquipment();

        },

        /**
         * Function to get Risk and criticality data
         */
        // fnGetRACData: function () {
        //     var that = this;
        //     var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
        //     var equiDeatil = mEquipmentDetail.getProperty("/data/detail");
        //     if (equiDeatil.srcId != "BTP") {
        //         var equiList = [];
        //         equiList.push(equiDeatil.name);
        //         if (equiDeatil.child_equipments && equiDeatil.child_equipments.length > 0) {
        //             var childEquipmentsData = equiDeatil.child_equipments;
        //             childEquipmentsData.forEach(function (childEqui) {
        //                 if (childEqui.srcId != "BTP") {
        //                     equiList.push(childEqui.name);
        //                 }
        //             })
        //         }
        //         mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/equiNameList", equiList);
        //         that.fnGetRCAAssessmentList();
        //     }
        // },

        /**
         * Function that fetch risk and criticality from sap
         */
        fnGetRCAAssessmentList: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var equiList = mEquipmentDetail.getProperty("/data/assetIntelligence/RiskCriticality/equiNameList");
            that.APMDataSource.getAssessmentList(equiList, function (oDataRec) {
                if (oDataRec.data && oDataRec.data.assessments && oDataRec.data.assessments.edges && oDataRec.data.assessments.edges.length > 0) {
                    var oData = oDataRec.data.assessments.edges, assesmentsData = {}, assessmentsIDs = [];
                    oData.forEach(function (item) {
                        assesmentsData[item.node.id] = item.node;
                        assessmentsIDs.push(item.node.id);
                    });
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assesmentsData", assesmentsData);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assesmentsIds", assessmentsIDs);
                    if (Object.keys(assesmentsData).length > 0) {
                        that.fnGetAssessmentDetails(0, 5);
                    }
                }
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getAssessmentList :", JSON.stringify(oError));
                // that.fnMessageShow("E", that.oI18n.getText("asint.equipment.assetIntelligence.message001"));
            })
        },

        /**
         * Function that fetches assessment details from
         */
        fnGetAssessmentDetails: function () {
            // var that = this;
            // var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            // var assessmentList = mEquipmentDetail.getProperty("/data/assetIntelligence/RiskCriticality/assesmentsData");
            // var assessmentsIds = mEquipmentDetail.getProperty("/data/assetIntelligence/RiskCriticality/assesmentsIds");
            // var aToFetchAssessmentId = assessmentsIds.slice(skip, top);
            // var oTechnicalObject = mEquipmentDetail.getProperty("/data/detail");
            // var sTechnicalObjectId = oTechnicalObject.ID;
            // var statusMapping = {
            //     "IN_PROCESS": "In Process",
            //     "RELEASED": "Released",
            //     "CREATED": "Created",
            //     "OBSOLETE": "Obsolete"
            // };
            /**
             * Complete callback
             * 
             * @param {Number} index 
             */
            // var fnComplete = function (index) {
            //     if (index < aToFetchAssessmentId.length) {
            //         that.APMDataSource.getAssessmentDetail(aToFetchAssessmentId[index], function (oDataRec) {
            //             if (oDataRec.data && oDataRec.data.assessment && oDataRec.data.assessment.assignedObject && oDataRec.data.assessment.assignedObject.length > 0) {
            //                 var oData = oDataRec.data.assessment.assignedObject;
            //                 oData.forEach(function (item) {
            //                     assessmentList[oDataRec.data.assessment.id].assessmentTemplateDisplayValue = item.assessmentTemplateDisplayValue;
            //                     assessmentList[oDataRec.data.assessment.id].assessmentTemplateDescriptions = item.assessmentTemplateDescriptions;
            //                     assessmentList[oDataRec.data.assessment.id].technicalObjectNumber = item.technicalObjectNumber;
            //                     assessmentList[oDataRec.data.assessment.id].technicalObjectDescription = item.technicalObjectDescription;
            //                     assessmentList[oDataRec.data.assessment.id].criticality = item.criticality;
            //                     assessmentList[oDataRec.data.assessment.id].createdOn = that.formatter.formatDate(assessmentList[oDataRec.data.assessment.id].createdOn, "MMM dd, yyyy");
            //                     assessmentList[oDataRec.data.assessment.id].color = item.color
            //                     var currentStatus = assessmentList[oDataRec.data.assessment.id].status;
            //                     if (statusMapping.hasOwnProperty(currentStatus)) {
            //                         assessmentList[oDataRec.data.assessment.id].status = statusMapping[currentStatus];
            //                     };
            //                     if (item.riskScore && item.alphanumericRiskScore) {
            //                         assessmentList[oDataRec.data.assessment.id].alphanumericRiskScore = item.riskScore + " - " + item.alphanumericRiskScore
            //                     } else if (item.riskScore) {
            //                         assessmentList[oDataRec.data.assessment.id].alphanumericRiskScore = item.riskScore
            //                     } else {
            //                         assessmentList[oDataRec.data.assessment.id].alphanumericRiskScore = item.alphanumericRiskScore
            //                     }
            //                 });
            //                 mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assesmentsData", assessmentList);
            //                 if (index == aToFetchAssessmentId.length - 1) {
            //                     mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", assessmentList);
            //                     mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [Object.values(assessmentList).length]));
            //                 }
            //             }
            //             fnComplete(index + 1);
            //         }, function (oError) {
            //             // that.fnMessageShow("E", that.oI18n.getText("asint.equipment.assetIntelligence.message002"));
            //             that._oLogger.error("An Error Occurred In getAssessmentDetail :", JSON.stringify(oError));
            //         })
            //     }
            // };
            // fnComplete(0);

            // that.dataSource.fnGetRnCAssessment(sTechnicalObjectId, function (aResponse) {
            //     aResponse.forEach(function (oItem) {
            //         oItem.rcaassesmentstatus = statusMapping[oItem.rcaassesmentstatus];
            //         oItem.rcaassesmentcreatedat = that.formatter.formatDate(oItem.rcaassesmentcreatedat);
            //         oItem.technicalObjectNumber = oTechnicalObject.name;
            //         oItem.technicalObjectDescription = oTechnicalObject.to_description.length > 0 ? oTechnicalObject.to_description[0].shortDescription : "";
            //     })
            //     mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", aResponse);
            //     mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [aResponse.length]));
            // }, function () {
            //     mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", []);
            //     mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [0]));
            // });

        },

        /**
         * Fetches the Risk and Criticality Assessments for a given Technical Object ID
         *
         * @param {string} sTechnicalObjectId - The ID of the technical object
         * @param {object} oTechnicalObject - The technical object containing metadata like name and description
        */
        fnGetAssessmentListForEquipment: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var oTechnicalObject = mEquipmentDetail.getProperty("/data/detail");
            var sTechnicalObjectId = oTechnicalObject.ID;
            if (sTechnicalObjectId) {
                that.dataSource.fnGetRnCAssessment(sTechnicalObjectId, function (aResponse) {
                    aResponse.forEach(function (oItem) {
                        // oItem.rcaassesmentstatus = statusMapping[oItem.rcaassesmentstatus];
                        oItem.rcaassesmentcreatedat = that.formatter.formatDate(oItem.rcaassesmentcreatedat);
                        oItem.technicalObjectNumber = oTechnicalObject.name;
                        oItem.technicalObjectDescription = oTechnicalObject.to_description.length > 0 ? oTechnicalObject.to_description[0].shortDescription : "";
                    })
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", aResponse);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [aResponse.length]));
                }, function () {
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", []);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [0]));
                });

            }
        },
            

        /**
         * Function that set the skip and top
         * @param {Object} oEvent 
         */
        onLoadMorePress: function (oEvent) {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var rcaData = mEquipmentDetail.getProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData");
            var oDetails = oEvent.getParameters();
            var skip = mEquipmentDetail.getProperty("/data/assetIntelligence/RiskCriticality/skip");
            var stop = mEquipmentDetail.getProperty("/data/assetIntelligence/RiskCriticality/stop");
            if (oDetails.actual > 5) {
                skip += stop;
                if (rcaData && skip < rcaData.length) {
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/skip", skip);
                    that.fnGetAssessmentDetails(skip, skip + stop);
                }
            }
        },

        /**
         * Get Recommendation list based on Equipment Id and then Binding into Table
         */
        fnGetRecommendations: function () {

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            that.dataSource.fnGetRecommendationsByObject(sEquipmentId, "EQUI", function (aRecommendation) {
                mEquipmentDetail.setProperty("/data/assetIntelligence/recommendation/data/list", aRecommendation);
                var header = oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header", [aRecommendation.length]);
                mEquipmentDetail.setProperty("/data/assetIntelligence/recommendation/header", header);
            }, function () {

            });
        },

        /**
         * Live search based on Recommendation table columns
         * 
         * @param {Object} oEvent
         */
        onSearchRecommendation: function (oEvent) {

            var sQuery = oEvent.getSource().getValue();
            var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            sQuery = sQuery.trim();

            if (sQuery === "") {
                this.byId("idAsintAIRecommendation").getBinding("items").filter([]);
            } else {
                var oFilterArr = new Filter([
                    new Filter("ShortDescription", FilterOperator.Contains, sQuery),
                    new Filter("LongDescription", FilterOperator.Contains, sQuery),
                    new Filter("AssessmentDescription", FilterOperator.Contains, sQuery),
                    new Filter("AssessmentDisplayId", FilterOperator.Contains, sQuery)
                ], false);
            }

            this.byId("idAsintAIRecommendation").getBinding("items").filter(oFilterArr);

            var filteredItemsLength = this.byId("idAsintAIRecommendation").getBinding("items").getLength();
            var sNewHeader = oI18nBundle.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header", [filteredItemsLength]);

            mEquipmentDetail.setProperty("/data/assetIntelligence/recommendation/header", sNewHeader);

        },

        /**
         * Function to sort recommendation table based Target Date
         */
        onSortRecommendationTable: function () {

            var oTable = this.getView().byId("idAsintAIRecommendation");
            var aSorters = [];
            var bDescending = !this.isRecommendationTargetDescending;

            aSorters.push(new Sorter("TargetDate", bDescending));
            oTable.getBinding("items").sort(aSorters);

            this.isRecommendationTargetDescending = !this.isRecommendationTargetDescending;

        },

        /**
         * Get the Selected Assessment and Navigate to Asset Strategy Detail page
         * 
         * @param {Object} oEvent 
         */
        onAssessmentTitlePress: function (oEvent) {

            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();

            this.fnNavigateToAssetStrategyDetail(oSelected.AssessmentId);

        },

        /**
         * Function to navigate to RCA Assessment detail page
         * @param {Object} oEvent 
         */
        onRCAAssessmentTitlePress : function(oEvent){
            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sAssessmentId = oSelected.rcaassesmentid;
            var sHashWithKeyword = this.NAVIGATION.RCA_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{assessmentId}", sAssessmentId);
            var newUrl = this.setNavUrl(window, sHashWithKeyword);
            if(sAssessmentId){
                window.open(newUrl, "_blank");
            }
        }

    });
});