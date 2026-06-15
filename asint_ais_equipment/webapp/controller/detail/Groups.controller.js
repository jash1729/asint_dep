sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Groups", {

        /**
         * Ui5 lifecycle method triggered on first load of the view.
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);

        },

        /**
         * Ui5 lifecycle method triggered before this view is rendered.
         */
        onBeforeRendering: function () { },

        /**
         * Ui5 lifecycle method triggered after this view is rendered.
         */
        onAfterRendering: function () {
            this.fnInitialize()
        },

        /**
         * Function on attachPatternMatched
         */
        fnInitialize: function () {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var oSearchField = this.byId("idEquipmentGroupsSearchField");
            if(oSearchField) {
                oSearchField.setValue("");
                oSearchField.fireSearch({query: ""});
            }
            this.fnFetchGroups();
        },

        /**
         * Fetch fnFetchGroups by Equipment ID
         * 
         */
        fnFetchGroups: function () {

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();

            that.commonDataSource.getGroupsByTechnicalObjectId(sEquipmentId,"EQUI", function (aResponse) {
                
                if(aResponse && aResponse.length){
                    mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsList", aResponse);
                    mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsLength", aResponse.length);
                }else{
                    mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsList", []);
                    mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsLength", 0);
                }
                
            }, function () {
                mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsList", []);
                mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsLength", 0);
                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.components.groups.message001"));
            });

        },

        /**
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchGroupsTable: function (oEvent) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idTableGroups");
            var sQuery = oEvent.getSource().getValue();

            if (sQuery) {
                var aFilters = [
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("streamName", FilterOperator.Contains, sQuery),
                    new Filter("shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("templateDisplayId", FilterOperator.Contains, sQuery),
                    new Filter("templateShortDescription", FilterOperator.Contains, sQuery),
                    new Filter("categoryType", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }

            var iFilteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/tabs/components/groups/groupsLength", iFilteredItemsLength);
        },

        /**
          * Function to handle navigation to child components
          * @param {Object} oEvent 
          */
        onPressLink: function (oEvent,sType) {
            var that=this;
            var oSelectedGroup = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sHashWithKeyword = "";

            if(sType === "GROUPS") {
                sHashWithKeyword = this.NAVIGATION.PROCESS_GROUPS_DETAIL.replace("{streamId}", oSelectedGroup.streamId);
            } else if(sType === "ASSESSMENT_TEMPLATE") {
                sHashWithKeyword = this.NAVIGATION.ASSESSMENT_TEMPLATE_DETAIL.replace("{assessmentTemplateId}", oSelectedGroup.templateId);
            }
            
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        },

    });

});