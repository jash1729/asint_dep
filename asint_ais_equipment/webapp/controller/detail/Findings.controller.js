sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (BaseController,Filter,FilterOperator) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Findings", {

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
            that.fnGetEquipmentandComponentFindings();
        },

        /**
         * Function that fetch assessment details
         */
        fnGetEquipmentandComponentFindings: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            that.dataSource.getEquipmentandComponentFindings(sEquipmentId, function (oDataRec) {
                if (oDataRec) {
                    mEquipmentDetail.setProperty("/data/assetIntelligence/findings/list", oDataRec);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/findings/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.findings.table.header.text", [oDataRec.length]));
                }
            }, function () {
                that.fnMessageShow("E", that.oI18n.getText("asint.equipment.assetIntelligence.message006"));
            })
        },

        /**
         * Function to search in asset strategy
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oFilterArr = [];
            if (sQuery) {
                oFilterArr = new Filter({
                    filters: [
                        new Filter({ path: "equipmentName", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "equiShortDescription", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "finding", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "assignedTo", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "number", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({path: "findingName",operator: FilterOperator.Contains,value1: sQuery,caseSensitive: false }),
                        new Filter({path: "status",operator: FilterOperator.Contains,value1: sQuery,caseSensitive: false}),
                        new Filter({path: "displayId",operator: FilterOperator.Contains,value1: sQuery,caseSensitive: false})
                    ],
                    and: false
                });
            }
            this.getView().byId("idAsintEquipmentFindings").getBinding("items").filter(oFilterArr);
            var iLength = this.getView().byId("idAsintEquipmentFindings").getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/assetIntelligence/findings/header", this.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.findings.table.header.text", [iLength]));
        },

        /**
         * Function to navigate to findings details 
         */
        onClickFindingsTitle : function(oEvent){
            var that = this;
            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sFindingId = oSelected.findingId;
            var sHashWithKeyword = this.NAVIGATION.INSPECTION_FINDINGS_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{findingId}", sFindingId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        }
    });
});