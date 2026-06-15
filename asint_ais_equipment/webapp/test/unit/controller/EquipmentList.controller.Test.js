/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/list/EquipmentList.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel, sinon) {
    "use strict";

    QUnit.module("Equipment List", {
        /**
         * beforeEach function
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

            this.oView.getModel.withArgs("i18n").returns(oI18nModel);
            this.oView.getModel.withArgs("mEquipment").returns(this.oMEquipment);
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

    QUnit.test("fnInitialize", function (assert) {
        this.oAppController.fnInitialize();

        assert.ok(this.fetchSpy.calledOnce, "fnInitialize should be called once");
    });
});