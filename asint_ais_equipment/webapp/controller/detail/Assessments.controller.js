sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Planning", {

        /**
         * Function to select RBI segment
         * @param {Object} oEvent 
         */
        onSelectRBISegment: function (oEvent) {
            var sSeletedSegment = oEvent.getSource().getSelectedKey();
            var oSegmentTemplate = this.getView().byId("idRBISegment");
            var oSegmentHistory = this.getView().byId("idRBISegment1");

            var oTemplateTable = this.getView().byId("idTableRBITemplateSegment");
            var oHistoryTable = this.getView().byId("idTableRBIHistorySegment");
            if (sSeletedSegment === "template") {
                oTemplateTable.setVisible(true);
                oHistoryTable.setVisible(false);
                oSegmentTemplate.setSelectedKey("template");
            } else if (sSeletedSegment === "history") {
                oTemplateTable.setVisible(false);
                oHistoryTable.setVisible(true);
                oSegmentHistory.setSelectedKey("history");
            }
        },

        /**
         * Function to select idms segment
         * @param {Object} oEvent 
         */
        onSelectIDMSSegment: function (oEvent) {

            var sSeletedSegment = oEvent.getSource().getSelectedKey(),
                oSegmentTemplate = this.getView().byId("idIDMSSegment"),
                oSegmentHistory = this.getView().byId("idIDMSSegment1");

            var oTemplateTable = this.getView().byId("idTableIDMSTemplateSegment"),
                oHistoryTable = this.getView().byId("idTableIDMSHistorySegment");
            if (sSeletedSegment === "template") {
                oTemplateTable.setVisible(true);
                oHistoryTable.setVisible(false);
                oSegmentTemplate.setSelectedKey("template");
            } else if (sSeletedSegment === "history") {
                oTemplateTable.setVisible(false);
                oHistoryTable.setVisible(true);
                oSegmentHistory.setSelectedKey("history");
            }
        }

    });
});