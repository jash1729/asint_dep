sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController,Filter,FilterOperator) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.AssetInspection", {

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
            that.fnGetInspectionsList();
        },

        /**
         * Function that fetch assessment details
         */
        fnGetInspectionsList: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            that.dataSource.getEquipmentandComponentsInspections(sEquipmentId, function (oDataRec) {
                if (oDataRec) {
                    var aInspections = [];
                    if (oDataRec.inspection && oDataRec.inspection.length > 0) {
                        oDataRec.inspection.forEach(function (oInsp) {
                            var obj = {
                                assessmentID: oInsp.ID,
                                assessmentDisplayId: oInsp.displayId,
                                assessmentDesc: oInsp.shortDescription,
                                assessmentTempDesc: oInsp.templateName,
                                assessmentTempDisplayId: oInsp.assessmentTemplateDisplayId,
                                equiID: oDataRec.equipmentId,
                                equiName: oDataRec.equipmentName,
                                equiDesc: oDataRec.shortDescription,
                                category: "IDMS",
                                createdOn: that.formatter.formatDate(oInsp.createdOn, ""),
                                createdBy : oInsp.createdBy,
                                status : oInsp.status,
                                publishedOn : that.formatter.formatDate(oInsp.publishedOn, ""),
                                publishedBy : oInsp.publishedBy,
                                dateOfInspection: that.formatter.formatDate(oInsp.dateOfInspection, ""),
                            }
                            aInspections.push(obj);
                        })
                    }
                    if (oDataRec.child_Equipments && oDataRec.child_Equipments.length > 0) {
                        oDataRec.child_Equipments.forEach(function (childEqui) {
                            if(childEqui.inspection && childEqui.inspection.length > 0){
                                childEqui.inspection.forEach(function(oInsp){
                                    var obj = {
                                        assessmentID: oInsp.ID,
                                        assessmentDisplayId: oInsp.displayId,
                                        assessmentDesc: oInsp.shortDescription,
                                        assessmentTempDesc: oInsp.templateName,
                                        assessmentTempDisplayId: oInsp.assessmentTemplateDisplayId,
                                        equiID: childEqui.equipmentId,
                                        equiName: childEqui.equipmentName,
                                        equiDesc: childEqui.shortDescription,
                                        category: "IDMS",
                                        createdOn: that.formatter.formatDate(oInsp.createdOn, ""),
                                        createdBy : oInsp.createdBy,
                                        status : oInsp.status,
                                        publishedOn : that.formatter.formatDate(oInsp.publishedOn, ""),
                                        publishedBy : oInsp.publishedBy,
                                        dateOfInspection: that.formatter.formatDate(oInsp.dateOfInspection, ""),
                                    }
                                    aInspections.push(obj);
                                })
                            }
                        })
                    }
                    aInspections.sort(function (a, b) {
                        return new Date(b.createdOn) - new Date(a.createdOn)
                    });
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assetInspection/list", aInspections);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/assetInspection/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.inspection.table.header.text", [aInspections.length])); 
                    mEquipmentDetail.refresh();               
                }
            }, function () {
                that.fnMessageShow("E", that.oI18n.getText("asint.equipment.assetIntelligence.message005"));
            })
        },

        /**
         * Function to search in asset strategy
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
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
                var oAssessmentTempFilter = new Filter({
                    path: "assessmentTempDesc",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                var oTemplateDisplayIdFilter = new Filter({
                    path: "assessmentTempDisplayId",
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
                    filters: [oNameFilter, oDescriptionFilter,oAssesmentDesc,oAssessmentDisplayId,oAssessmentTempFilter,oTemplateDisplayIdFilter, createdBy, publishedBy, status],
                    and: false
                }));
            }

            var oTable = this.byId("idAsintAssetInspections");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
            var iLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/assetIntelligence/assetInspection/header", this.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.inspection.table.header.text", [iLength])); 
        },

        /**
         * Function to handle navigation to inspection
         */
        onPressInspectionTitle : function(oEvent){
            var that = this;
            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sAssessmentId = oSelected.assessmentID;
            var sHashWithKeyword = this.NAVIGATION.INSPECTION_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{inspectionId}", sAssessmentId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        }
    });
});