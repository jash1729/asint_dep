sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "com/asint/ais/mi/equipment/utils/PlanningTableViewSettingsHelper",
], function (BaseController, PlanningTableViewSettingsHelper) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Planning", {

        /**
        * This function will be called once the view got initialized for the first time
        */
        onInit: function () {
        },

        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {

            this.fnGetData();

        },

        /**
         * Function to set dummy data in equipment detail model
         */
        fnGetData: function () {

            var that = this,
                oEquipmentDatail = that.getView().getModel("mEquipmentDetail");

            var aNotificationData = [
                {
                    "notificationName": "NO.RBI.556",
                    "notificationDescp": "RBI:Reassessment",
                    "notificationType": "Maintenance Request",
                    "notificationPriority": "High",
                    "notificationStatus": "New",
                    "notificationBreakdown": "NO",
                    "notificationReqStartDate": "Jan 16, 2031",
                    "notificationReqEndDate": "Feb 16, 2031",
                    "notificationMalfunStartDate": "",
                    "notificationMalfunEndDate": "",
                    "notificationFailureMode": "",
                },
                {
                    "notificationName": "NO.RBI.753",
                    "notificationDescp": "RBI:VI / Thickness for External Thinning",
                    "notificationType": "Maintenance Request",
                    "notificationPriority": "Medium",
                    "notificationStatus": "Pending",
                    "notificationBreakdown": "NO",
                    "notificationReqStartDate": "Nov 30, 2025",
                    "notificationReqEndDate": "Nov 30, 2025",
                    "notificationMalfunStartDate": "",
                    "notificationMalfunEndDate": "",
                    "notificationFailureMode": "Corrosion",
                },
                {
                    "notificationName": "NO.RBI.756",
                    "notificationDescp": "RBI:Reassessment",
                    "notificationType": "Maintenance Request",
                    "notificationPriority": "Low",
                    "notificationStatus": "New",
                    "notificationBreakdown": "NO",
                    "notificationReqStartDate": "Jan 16, 2031",
                    "notificationReqEndDate": "Feb 16, 2031",
                    "notificationMalfunStartDate": "",
                    "notificationMalfunEndDate": "",
                    "notificationFailureMode": "",
                },
                {
                    "notificationName": "NO.RBI.856",
                    "notificationDescp": "RBI:Reassessment",
                    "notificationType": "Maintenance Request",
                    "notificationPriority": "Low",
                    "notificationStatus": "Planned",
                    "notificationBreakdown": "NO",
                    "notificationReqStartDate": "Jan 16, 2031",
                    "notificationReqEndDate": "Feb 16, 2031",
                    "notificationMalfunStartDate": "",
                    "notificationMalfunEndDate": "",
                    "notificationFailureMode": "",
                },
                {
                    "notificationName": "NO.RBI.753",
                    "notificationDescp": "RBI:VI / Thickness for External Thinning",
                    "notificationType": "Maintenance Request",
                    "notificationPriority": "Very High",
                    "notificationStatus": "Completed",
                    "notificationBreakdown": "NO",
                    "notificationReqStartDate": "Nov 30, 2025",
                    "notificationReqEndDate": "Nov 30, 2025",
                    "notificationMalfunStartDate": "",
                    "notificationMalfunEndDate": "",
                    "notificationFailureMode": "Corrosion",
                },
                {
                    "notificationName": "NO.RBI.953",
                    "notificationDescp": "RBI:VI / Thickness for External Thinning",
                    "notificationType": "Maintenance Request",
                    "notificationPriority": "Emergency",
                    "notificationStatus": "Completed",
                    "notificationBreakdown": "NO",
                    "notificationReqStartDate": "Nov 30, 2025",
                    "notificationReqEndDate": "Nov 30, 2025",
                    "notificationMalfunStartDate": "",
                    "notificationMalfunEndDate": "",
                    "notificationFailureMode": "Corrosion",
                }
            ]

            var aWorkOrderData = [
                {
                    "workOrderName": "NO.RBI.195",
                    "workOrderDescp": "WO1",
                    "workOrderType": "Inspection",
                    "workOrderPriority": "High",
                    "workOrderProgress": "Pending",
                    "workOrderStatus": "New",
                    "workOrderStartDate": "Jul 7, 2022",
                    "workOrderEndDate": ""
                },
                {
                    "workOrderName": "NO.RBI.190",
                    "workOrderDescp": "WO1",
                    "workOrderType": "Inspection",
                    "workOrderPriority": "High",
                    "workOrderProgress": "Pending",
                    "workOrderStatus": "New",
                    "workOrderStartDate": "Jul 7, 2022",
                    "workOrderEndDate": ""
                },
                {
                    "workOrderName": "NO.RBI.120",
                    "workOrderDescp": "WO1",
                    "workOrderType": "Inspection",
                    "workOrderPriority": "High",
                    "workOrderProgress": "Completed",
                    "workOrderStatus": "Completed",
                    "workOrderStartDate": "Jul 7, 2022",
                    "workOrderEndDate": ""
                },
                {
                    "workOrderName": "NO.RBI.490",
                    "workOrderDescp": "WO1",
                    "workOrderType": "Inspection",
                    "workOrderPriority": "High",
                    "workOrderProgress": "",
                    "workOrderStatus": "Published",
                    "workOrderStartDate": "Jul 7, 2022",
                    "workOrderEndDate": ""
                },
                {
                    "workOrderName": "NO.RBI.490",
                    "workOrderDescp": "WO1",
                    "workOrderType": "Inspection",
                    "workOrderPriority": "High",
                    "workOrderProgress": "",
                    "workOrderStatus": "New",
                    "workOrderStartDate": "Jul 7, 2022",
                    "workOrderEndDate": ""
                }
            ]

            oEquipmentDatail.setProperty("/data/tabs/planning/notifications", aNotificationData);
            oEquipmentDatail.setProperty("/data/tabs/planning/workOrder", aWorkOrderData);

        },

        /**
         * Function to handle woSegment
         *  
         */
        onSelectWOSegment: function () {

            this.onHandlePlanningWOsearch();

        },

        /**
         * Function to handle notification segment
         */
        onSelectNotificationSegment: function () {

            this.onHandlePlanningNotifiSearch();

        },

        /**
         * Function to handlle notification table settings
         */
        onPressNotificationTableSettings: function () {

            PlanningTableViewSettingsHelper.handleTableSettingsDialogOpen(this, "idTableNotificationSegment", "_DialogNotificationTable");

        },

        /**
         * Function to handle wo table setting
         */
        onPressWOTableSettings: function () {

            PlanningTableViewSettingsHelper.handleTableSettingsDialogOpen(this, "idTableWOSegment", "_DialogWOTable");

        },

        /**
         * Function to handle planning notification search
         */
        onHandlePlanningNotifiSearch: function () {

            var oTable = this.getView().byId("idTableNotificationSegment"),
                sSearchText = this.getView().byId("idNotificationSearch").getValue(),
                oSegmentButton = this.getView().byId("idNotificationSegment").getSelectedKey(),
                oDefaultFilter;

            if (oSegmentButton !== "all") {
                oDefaultFilter = new sap.ui.model.Filter({
                    path: "notificationStatus",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: oSegmentButton,
                    caseSensitive: false
                });
            }

            this.handlTableSettingsSearch(oTable, sSearchText, oDefaultFilter);

        },

        /**
         * Function to handle planning woSearch
         */
        onHandlePlanningWOsearch: function () {

            var oTable = this.getView().byId("idTableWOSegment"),
                sSearchText = this.getView().byId("idWOSearch").getValue(),
                oSegmentButton = this.getView().byId("idWOSegment").getSelectedKey(),
                oDefaultFilter;

            if (oSegmentButton !== "all") {
                oDefaultFilter = new sap.ui.model.Filter({
                    path: "workOrderProgress",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: oSegmentButton,
                    caseSensitive: false
                });
            }

            this.handlTableSettingsSearch(oTable, sSearchText, oDefaultFilter);

        },

        /**
         * Function to handle table settings search
         * @param {Object} oTable 
         * @param {String} sSearchText 
         * @param {Object} oDefaultFilter 
         */
        handlTableSettingsSearch: function (oTable, sSearchText, oDefaultFilter) {

            var aColumns = oTable.getColumns(),
                aColumnName = [], aFilterColumn = [];

            aColumns.forEach(function (colObj) {
                aColumnName.push(colObj.getAggregation("header").data("tableSettings"));
            });

            aColumnName.forEach(function (sColumnName) {
                if (sColumnName !== null) {
                    aFilterColumn.push(sColumnName);
                }
            });

            this.fnHandleTableSearch({
                attributeArray: aFilterColumn,
                bindingItems: oTable.getBinding("items"),
                languageRelevant: false,
                aFilters: oTable.getBinding("items").aFilters,
                queryString: sSearchText,
                defaultFilter: oDefaultFilter
            });

        },

        /**
         * Function to hande table search
         * @param {Object} oConfigObject 
         */
        fnHandleTableSearch: function (oConfigObject) {

            var aSetAllFilters = [];

            if (oConfigObject && oConfigObject.queryString) {
                oConfigObject.queryString = oConfigObject.queryString.replace(/'/g, "''");
            }

            if (oConfigObject.queryString) {
                var aFilters = this.fnConstructFilters(oConfigObject.attributeArray, oConfigObject.queryString);
                aSetAllFilters.push(new sap.ui.model.Filter(aFilters, false));
            }

            if (oConfigObject.defaultFilter) {
                aSetAllFilters.push(new sap.ui.model.Filter([oConfigObject.defaultFilter], true));
            }

            if (aSetAllFilters && aSetAllFilters.length > 0) {
                oConfigObject.bindingItems.filter(new sap.ui.model.Filter(aSetAllFilters, true));
            } else {
                oConfigObject.bindingItems.filter();
            }

            if (oConfigObject.control) {
                oConfigObject.control.focus();
            }

        },

        /**
         * Function to construct value filters
         * @param {Array} aColums 
         * @param {String} sValue 
         * @returns 
         */
        fnConstructFilters: function (aColums, sValue) {

            var aFilters = [];
            var filter;

            for (var i = 0; i < aColums.length; i++) {
                (function (i) {
                    filter = new sap.ui.model.Filter(aColums[i], sap.ui.model.FilterOperator.Contains, sValue.toLowerCase());
                    aFilters.push(filter);
                })(i);
            }

            return aFilters;

        },

    });
});