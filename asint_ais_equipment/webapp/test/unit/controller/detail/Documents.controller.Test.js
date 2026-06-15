sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/Documents.controller",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller) {
    "use strict";

    QUnit.module("Documents.controller - fnInitialize", {
        /** */
        beforeEach: function () {
            this.oController = new Controller();

            this.oView = {
                getModel: sinon.stub(),
                byId: sinon.stub()
            };

            this.oContainer = {
                removeAllItems: sinon.spy(),
                addItem: sinon.spy()
            };

            this.oTable = {};

            this.oController.tableHelper = {
                createTable: sinon.stub().returns(this.oTable)
            };

            sinon.stub(this.oController, "getView").returns(this.oView);
            this.oController.baseURI = "http://test.base.uri";

            this.oBusyDialogStub = sinon.stub(sap.m, "BusyDialog").returns({
                id: "oFakeBusyDialog"
            });
        },
        /** */
        afterEach: function () {
            if (this.oBusyDialogStub && this.oBusyDialogStub.restore) {
                this.oBusyDialogStub.restore();
            }
            sinon.restore();
            if (this.oController.destroy) {
                this.oController.destroy();
            }
        }
    });
    /** */
    var createModels = function (isUnpublished, edit, genEnableMultiDocumentUpload) {
        var oDetailModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };
        oDetailModel.getProperty.withArgs("/metadata/status/isUnpublished").returns(isUnpublished);
        oDetailModel.getProperty.withArgs("/data/userRoles/edit").returns(edit);

        var oEquipmentModel = {
            getProperty: sinon.stub()
        };
        oEquipmentModel.getProperty.withArgs("/metadata/featureFlag/genEnableMultiDocumentUpload").returns(genEnableMultiDocumentUpload || "0");

        return {
            detail: oDetailModel,
            equipment: oEquipmentModel
        };
    };
    /** */
    var setupModels = function (models, that) {
        that.oView.getModel
            .withArgs("mEquipmentDetail")
            .returns(models.detail);

        that.oView.getModel
            .withArgs("mEquipment")
            .returns(models.equipment);

        that.oView.byId
            .withArgs("tableContainer")
            .returns(that.oContainer);
    };

    QUnit.test("fnInitialize enables edit when isUnpublished is true and user has edit permissions", function (assert) {
        var models = createModels(true, true, "0");
        setupModels(models, this);
        this.oController.fnInitialize();
        assert.strictEqual(
            this.oController.tableHelper.createTable.getCall(0).args[4],
            true,
            "Edit enabled"
        );
    });

    QUnit.test("fnInitialize disables edit when isUnpublished is true but user has no edit permissions", function (assert) {
        var models = createModels(true, false, "0");
        setupModels(models, this);
        this.oController.fnInitialize();
        assert.strictEqual(
            this.oController.tableHelper.createTable.getCall(0).args[4],
            false,
            "Edit disabled"
        );
    });

    QUnit.test("fnInitialize disables edit when isUnpublished is false regardless of edit permissions", function (assert) {
        var models = createModels(false, true, "0");
        setupModels(models, this);
        this.oController.fnInitialize();
        assert.strictEqual(
            this.oController.tableHelper.createTable.getCall(0).args[4],
            false,
            "Edit disabled"
        );
    });

    QUnit.test("fnInitialize passes genEnableMultiDocumentUpload flag correctly", function (assert) {
        var models = createModels(true, true, "1");
        setupModels(models, this);
        this.oController.fnInitialize();
        assert.strictEqual(
            this.oController.tableHelper.createTable.getCall(0).args[6],
            true,
            "genEnableMultiDocumentUpload is true"
        );
    });

    QUnit.module("Documents.controller - Lifecycle methods", {
        /** */
        beforeEach: function () {
            this.oController = new Controller();
            this.oRouter = {
                getRoute: sinon.stub()
            };
            this.oRoute = {
                attachPatternMatched: sinon.spy()
            };
            this.oRouter.getRoute.withArgs("nEquipmentDetail").returns(this.oRoute);
            
            // Mock getRouter since BaseController provides it
            this.oController.getRouter = sinon.stub().returns(this.oRouter);
            
            sinon.stub(this.oController, "fnInitialize");
        },
        /** */
        afterEach: function () {
            sinon.restore();
            if (this.oController.destroy) {
                this.oController.destroy();
            }
        }
    });

    QUnit.test("onInit attaches pattern matched event to fnInitialize", function (assert) {
        this.oController.onInit();
        assert.ok(this.oRoute.attachPatternMatched.calledOnce, "attachPatternMatched called");
        assert.strictEqual(this.oRoute.attachPatternMatched.firstCall.args[0], this.oController.fnInitialize, "Bound to fnInitialize");
        assert.strictEqual(this.oRoute.attachPatternMatched.firstCall.args[1], this.oController, "Context is controller");
    });

    QUnit.test("onBeforeRendering does not throw errors", function (assert) {
        try {
            this.oController.onBeforeRendering();
            assert.ok(true, "onBeforeRendering executed without errors");
        } catch (e) {
            assert.ok(false, "onBeforeRendering threw an error: " + e.message);
        }
    });

    QUnit.test("onAfterRendering calls fnInitialize", function (assert) {
        this.oController.onAfterRendering();
        assert.ok(this.oController.fnInitialize.calledOnce, "fnInitialize was called");
    });
});
