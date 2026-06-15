sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.TaskList", {

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {
        },

        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {
            this.fnInitialize();
        },

        /**
         * This function will be called everytime when the view got initialized as we are attaching this to pattern matched
         */
        fnInitialize: function () {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this.fnGetTaskLists();
        },

        /**
         * Function that handles the search in tasklists table
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var oFilterArr = [];
            if (sQuery) {
                oFilterArr = new Filter([
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_description/0/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery),
                    new Filter("priority", FilterOperator.Contains, sQuery),
                    new Filter("equipmentName", FilterOperator.Contains, sQuery),
                    new Filter("equipmentDesc", FilterOperator.Contains, sQuery),
                    new Filter("assignedTo", FilterOperator.Contains, sQuery),
                ], false);
            }
            this.getView().byId("tasklists").getBinding("items").filter(oFilterArr);
        },

        /**
         * Fetches task list data
         */
        fnGetTaskLists: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            var aTasks = [];
            that.dataSource.getEquipmentTaskListWithChildEquipments(sEquipmentId, function (oResponse) {
                if (oResponse) {
                    // eslint-disable-next-line camelcase
                    oResponse.to_generalTask.forEach(function (oTask) {
                        oTask.equipmentName = oResponse.name;
                        // eslint-disable-next-line camelcase
                        oTask.equipmentDesc = oResponse.to_description[0].shortDescription;
                        aTasks.push(oTask);
                    });
                    oResponse.child_equipments.forEach(function (oEquipment) {
                        if (oEquipment.to_generalTask.length) {
                            // eslint-disable-next-line camelcase
                            oEquipment.to_generalTask.forEach(function (oTask) {
                                oTask.equipmentName = oEquipment.name;
                                // eslint-disable-next-line camelcase
                                oTask.equipmentDesc = oEquipment.to_description[0].shortDescription;
                                aTasks.push(oTask);
                            });
                        }
                    });
                    oModel.setProperty("/data/tabs/maintenanceservice/tasksList", aTasks);
                    oModel.setProperty("/data/tabs/maintenanceservice/tasksList/tableHeader", that._oi18n.getText("asint.equipment.detail.tab.maintenance.tasklist.table.header.text", [aTasks.length]));
                }
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }

                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.message024"), errorDetail)
            });
        },

        /**
         * Function that handles the segmented buttons
         */
        onSwitchTaskListSegmentButton:function() {
            var oTable = this.getView().byId("tasklists"),
                oSegmentButton = this.getView().byId("idSegmentedButton").getSelectedKey(),
                oFilter;
            if (oSegmentButton !== "all") {
                oFilter = new sap.ui.model.Filter({
                    path: "status",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: oSegmentButton,
                    caseSensitive: false
                });
            }
            oTable.getBinding("items").filter(oFilter);
        },

        /**
         * Function for Task title press
         * @param {*} oEvent 
         */
        onTaskTitlePress: function(oEvent) {
            var that = this;
            var oTask = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sId = oTask.ID;
            var sHashWithKeyword = this.NAVIGATION.TASK_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{taskId}", sId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        }
    });

});
