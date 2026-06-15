sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/AssetInspection.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel, sinon) {
    "use strict";

    QUnit.module("fnGetInspectionsList", {
        /**
         * beforeEach function executes before each test
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oModel = new JSONModel({
                router: {
                    arguments: {
                        equipmentId: "EQ1"
                    }
                },
                data: {
                    assetIntelligence: {
                        assetInspection: {
                            list: [],
                            header: ""
                        }
                    }
                }
            });

            this.oController.getView = function () {
                return {
                    getModel: function () {
                        return this.oModel;
                    }.bind(this)
                };
            }.bind(this);

            this.oController.oI18n = {
                getText: sinon.stub().returns("Inspection Header")
            };

            this.oController.formatter = {
                formatDate: sinon.stub().returnsArg(0)
            };

            this.oController.fnMessageShow = sinon.stub();
        },
        /**
         * afterEach Function
         */
        afterEach: function () {
            this.oModel.destroy();
        }
    });


    QUnit.test("Should set parent and child inspections with newly added fields", function (assert) {

        this.oController.dataSource = {
            /**
             *
             */
            getEquipmentandComponentsInspections: function (sEquipmentId, fnSuccess) {

                fnSuccess({
                    equipmentId: "EQ1",
                    equipmentName: "Equipment 1",
                    shortDescription: "Main Equipment",
                    inspection: [{
                        ID: "INSP1",
                        displayId: "D1",
                        shortDescription: "Inspection 1",
                        templateName: "Template 1",
                        assessmentTemplateDisplayId: "TMP1",
                        createdOn: "2026-05-01",
                        createdBy: "USER1",
                        status: "PUBLISHED",
                        publishedOn: "2026-05-02",
                        publishedBy: "USER2",
                        dateOfInspection: "2026-05-03"
                    }], 
                    // eslint-disable-next-line camelcase
                    child_Equipments: [{
                        equipmentId: "CH1",
                        equipmentName: "Child Equipment",
                        shortDescription: "Child Desc",
                        inspection: [{
                            ID: "INSP2",
                            displayId: "D2",
                            shortDescription: "Inspection 2",
                            templateName: "Template 2",
                            assessmentTemplateDisplayId: "TMP2",
                            createdOn: "2026-05-04",
                            createdBy: "USER3",
                            status: "DRAFT",
                            publishedOn: "2026-05-05",
                            publishedBy: "USER4",
                            dateOfInspection: "2026-05-06"
                        }]
                    }]
                });
            }
        };

        this.oController.fnGetInspectionsList();

        var aResult = this.oModel.getProperty("/data/assetIntelligence/assetInspection/list");

        assert.equal(aResult.length, 2, "Both inspections added");

        assert.equal(aResult[0].assessmentID, "INSP2", "Latest inspection first");

        assert.equal(aResult[0].createdBy, "USER3", "createdBy mapped");
        assert.equal(aResult[0].status, "DRAFT", "status mapped");
        assert.equal(aResult[0].publishedOn, "2026-05-05", "publishedOn mapped");
        assert.equal(aResult[0].publishedBy, "USER4", "publishedBy mapped");
        assert.equal(aResult[0].dateOfInspection, "2026-05-06", "dateOfInspection mapped");

        assert.equal(
            this.oModel.getProperty("/data/assetIntelligence/assetInspection/header"),
            "Inspection Header",
            "Header set correctly"
        );
    });


    QUnit.test("Should handle empty inspection data", function (assert) {

        this.oController.dataSource = {
            /**
             *
             */
            getEquipmentandComponentsInspections: function (sEquipmentId, fnSuccess) {

                fnSuccess({
                    equipmentId: "EQ1",
                    inspection: [],
                    // eslint-disable-next-line camelcase
                    child_Equipments: []
                });
            }
        };

        this.oController.fnGetInspectionsList();

        var aResult = this.oModel.getProperty("/data/assetIntelligence/assetInspection/list");

        assert.equal(aResult.length, 0, "No inspections added");

        assert.equal(
            this.oModel.getProperty("/data/assetIntelligence/assetInspection/header"),
            "Inspection Header",
            "Header still set"
        );
    });


    QUnit.test("Should show error message on service failure", function (assert) {

        this.oController.dataSource = {
            /**
             *
             */
            getEquipmentandComponentsInspections: function (sEquipmentId, fnSuccess, fnError) {
                fnError();
            }
        };

        this.oController.fnGetInspectionsList();

        assert.ok(
            this.oController.fnMessageShow.calledOnce,
            "Error message function called"
        );

        assert.equal(
            this.oController.fnMessageShow.getCall(0).args[0],
            "E",
            "Error type passed correctly"
        );
    });

});