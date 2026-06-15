/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/ComponentInformation.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel, sinon) {
    "use strict";

    QUnit.module("Component Information", {
        /**
         * beforeEach function executes before each test
        */
        beforeEach: function () {
            this.oAppController = new Controller();

            this.oView = {
                getModel: sinon.stub(),
                setModel: sinon.spy(),
                addDependent: sinon.spy(),
                byId: sinon.spy()
            };
            this.oAppController.getView = sinon.stub().returns(this.oView);

            var oBundle = {
                getText: sinon.stub().returns("dummy")
            };
            var oI18nModel = {
                getResourceBundle: sinon.stub().returns(oBundle)
            };

            this.oMEquipment = new JSONModel({
                metadata: {
                    featureFlag: {
                        allowComponentAssign: "1"
                    }
                }
            });

            this.oMEquipmentDetail = new JSONModel({
                data: {
                    detail: {
                        srcId: "my401925"
                    }
                },
                metadata: {
                    isAssignAllowed: true
                }
            });

            this.oView.getModel.withArgs("i18n").returns(oI18nModel);
            this.oView.getModel.withArgs("mEquipment").returns(this.oMEquipment);
            this.oView.getModel.withArgs("mEquipmentDetail").returns(this.oMEquipmentDetail);

            this.fetchSpy = sinon.stub(this.oAppController, "fnFetchComponents");

        },

        /**
         * afterEach Function
         */
        afterEach: function () {
            this.fetchSpy.restore();
            if (sinon.restore) {
                try { sinon.restore(); } catch (e) { /* ignore */ }
            }
        }

    });

    QUnit.test("fnInitialize - Allows component assignment", function (assert) {
        this.oAppController.fnInitialize();

        assert.ok(this.fetchSpy.calledOnce, "fnFetchComponents should be called once");
        var bAssignAllowed = this.oMEquipmentDetail.getProperty("/metadata/isAssignAllowed");
        assert.strictEqual(bAssignAllowed, true, "isAssignAllowed should be true for non-BTP Equipments or when featureFlag != '0'");
    });

    QUnit.test("fnInitialize - isAssignAllowed = false when srcId === 'BTP' and featureFlag == '0'", function (assert) {
        this.oMEquipment.setProperty("/metadata/featureFlag/allowComponentAssign", "0");
        this.oMEquipmentDetail.setProperty("/data/detail/srcId", "BTP");

        this.oAppController.fnInitialize();

        var bAssignAllowed = this.oMEquipmentDetail.getProperty("/metadata/isAssignAllowed");
        assert.strictEqual(bAssignAllowed, false, "isAssignAllowed should be false for BTP Equipments with featureFlag '0'");
    });
});