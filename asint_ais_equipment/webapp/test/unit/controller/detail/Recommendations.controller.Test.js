/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/Recommendations.controller",
    "sap/ui/core/Fragment",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, Fragment, sinon) {
    "use strict";

    QUnit.module("Recommendations Controller - onCreateNotificcationPress", {

        /**
         * beforeEach sets up controller
         */
        beforeEach: function () {
            this.oAppController = new Controller();

            this.oView = {
                getModel: sinon.stub(),
                addDependent: sinon.spy(),
                byId: sinon.stub()
            };

            this.oAppController.getView = sinon.stub().returns(this.oView);
            this.oAppController._oi18n = { getText: sinon.stub().returns("dummy text") };
            this.oAppController.fnMessageShow = sinon.spy();
        },

        /**
         * afterEach restores sinon
         */
        afterEach: function () {
            sinon.restore();
        }

    });

    /**
     * No item selected - should show error
     */
    QUnit.test("Should show error when no item is selected", function (assert) {

        var oTable1 = { getVisible: sinon.stub().returns(true), getSelectedItems: sinon.stub().returns([]) };
        var oTable2 = { getVisible: sinon.stub().returns(false) };
        var oTable3 = { getVisible: sinon.stub().returns(false) };

        this.oView.byId.withArgs("idRecommendationTable1").returns(oTable1);
        this.oView.byId.withArgs("idRecommendationTable2").returns(oTable2);
        this.oView.byId.withArgs("idRecommendationTable3").returns(oTable3);

        this.oAppController.onCreateNotificcationPress();

        assert.ok(this.oAppController.fnMessageShow.calledWith("E", "dummy text"), "Error message shown when nothing selected");
    });

    /**
     * Status is disabled - should show warning
     */
    QUnit.test("Should show warning when status is CREATED", function (assert) {

        var oSelectedItem = {
            getBindingContext: sinon.stub().returns({
                getObject: sinon.stub().returns({ status: "CREATED" })
            })
        };

        var oTable1 = { getVisible: sinon.stub().returns(true), getSelectedItems: sinon.stub().returns([oSelectedItem]) };
        var oTable2 = { getVisible: sinon.stub().returns(false) };
        var oTable3 = { getVisible: sinon.stub().returns(false) };

        this.oView.byId.withArgs("idRecommendationTable1").returns(oTable1);
        this.oView.byId.withArgs("idRecommendationTable2").returns(oTable2);
        this.oView.byId.withArgs("idRecommendationTable3").returns(oTable3);

        this.oAppController.onCreateNotificcationPress();

        assert.ok(this.oAppController.fnMessageShow.calledWith("W", "dummy text"), "Warning shown for disabled status");
    });

    /**
     * Valid status, dialog already exists - should open directly
     */
    QUnit.test("Should open existing dialog when status is valid", function (assert) {

        var oSelectedItem = {
            getBindingContext: sinon.stub().returns({
                getObject: sinon.stub().returns({ status: "FOR_REVIEW" })
            })
        };

        var oTable1 = { getVisible: sinon.stub().returns(true), getSelectedItems: sinon.stub().returns([oSelectedItem]) };
        var oTable2 = { getVisible: sinon.stub().returns(false) };
        var oTable3 = { getVisible: sinon.stub().returns(false) };

        this.oView.byId.withArgs("idRecommendationTable1").returns(oTable1);
        this.oView.byId.withArgs("idRecommendationTable2").returns(oTable2);
        this.oView.byId.withArgs("idRecommendationTable3").returns(oTable3);

        this.oAppController._oDialogCreateNotification = { open: sinon.spy() };

        this.oAppController.onCreateNotificcationPress();

        assert.ok(this.oAppController._oDialogCreateNotification.open.calledOnce, "Dialog opened directly");
    });

    /**
     * Valid status, dialog not yet created - should call Fragment.load
     */
    QUnit.test("Should load fragment when dialog is not yet created", function (assert) {
        var done = assert.async();
        var oSelectedItem = {
            getBindingContext: sinon.stub().returns({
                getObject: sinon.stub().returns({ status: "FOR_REVIEW" })
            })
        };
        var oTable1 = { getVisible: sinon.stub().returns(true), getSelectedItems: sinon.stub().returns([oSelectedItem]) };
        var oTable2 = { getVisible: sinon.stub().returns(false) };
        var oTable3 = { getVisible: sinon.stub().returns(false) };
        this.oView.byId.withArgs("idRecommendationTable1").returns(oTable1);
        this.oView.byId.withArgs("idRecommendationTable2").returns(oTable2);
        this.oView.byId.withArgs("idRecommendationTable3").returns(oTable3);
        this.oAppController._oDialogCreateNotification = null;
        var oFakeDialog = { open: sinon.spy() };
        if (Fragment.load.restore) {
            Fragment.load.restore();
        }
        var oFragmentLoadStub = sinon.stub(Fragment, "load").returns(Promise.resolve(oFakeDialog));
        this.oAppController.onCreateNotificcationPress();
        oFragmentLoadStub.returnValues[0].then(function () {
            assert.ok(oFragmentLoadStub.calledOnce, "Fragment.load was called");
            assert.ok(oFakeDialog.open.calledOnce, "Dialog was opened after load");
            oFragmentLoadStub.restore();
            done();
        });
    });

});