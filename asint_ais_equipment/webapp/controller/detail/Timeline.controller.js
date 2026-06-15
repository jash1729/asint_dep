sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/helper/Timeline",
], function (Controller, JSONModel, Sorter, MessageBox, Filter, FilterOperator, TimelineHelper) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.Timeline", {

        TimeLineHelper: new TimelineHelper(window.com.asint.ais.mi.equipment.baseURI),

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);
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
            this.busyDialog = new sap.m.BusyDialog();
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var oModel = this.getView().getModel("mEquipmentDetail");
            var sId = oModel.getProperty("/router/arguments/equipmentId");
            var sName = oModel.getProperty("/data/detail/name");
            this.TimeLineHelper.fnGenerateTimelineView(this, "idTimeLineContainer", "EQUI", sId, sName);
        }

    });

});
