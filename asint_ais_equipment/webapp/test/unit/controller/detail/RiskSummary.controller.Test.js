/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/RiskSummary.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel, sinon) {
    "use strict";

    /**
     * 
     */
    QUnit.module("RiskSummary - fnFormatRiskSummaryData", {
        /**
         * 
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oModel = new JSONModel();

            this.oController.getView = sinon.stub().returns({getModel: sinon.stub().withArgs("mEquipmentDetail").returns(this.oModel)});
            this.oController._oi18n = {getText: sinon.stub().returns("HeaderText")};
            this.oController._oRiskCharMap = {};
            this.oController.formatter = {
                formatDate: sinon.stub().returns("01/01/2024")
            };

            this.oController.fnFetchRecommendations = sinon.stub();
        },

        /**
         * 
         */
        afterEach: function () {
            sinon.restore();
        }

    });

    /**
     * 
     */
    QUnit.test("Should set header count 0 when no assessments and no components", function () {

        var oData = {
            equipmentId: "EQ1",
            equipmentName: "Pump",
            equipmentDescription: "Test Equipment",
            currentAttachedAssessments: [],
            componenAssessments: []
        };

        this.oController.fnFormatRiskSummaryData(oData);
        sinon.assert.calledWith(this.oController._oi18n.getText,"asint.equipment.tab.riskSummary.tableHeader.equipment.text",[0] );

    });

    /**
     * 
     */
    QUnit.test("Should calculate header count when assessments exist", function (assert) {

        var oData = {
            equipmentId: "EQ1",
            equipmentName: "Pump",
            equipmentDescription: "Test Equipment",
            currentAttachedAssessments: [
                {
                    assessmentStatus: "PBD",
                    assessmentId: "A1",
                    assessmentDisplayId: "AS1",
                    assessmentDescription: "Assessment",
                    assessmentObjectType: "EQUI",
                    "Failure Mode EDD": {}
                }
            ]
        };

        this.oController.fnFormatRiskSummaryData(oData);
        assert.ok(this.oController._oi18n.getText.called,"Header text calculated when data exists");

    });

});