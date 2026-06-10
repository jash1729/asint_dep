/*global QUnit*/

sap.ui.define([
    "comasintaismicml/cml/controller/BaseController",
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/json/JSONModel"
], function (BaseController, sinon, JSONModel) {
    "use strict";

    QUnit.module("BaseController - fnLoadFeatureFlagConfig", {

        /**
         * Before each function
         */
        beforeEach: function () {
            this.oController = new BaseController();

            // Mock the view
            this.oViewStub = {
                getModel: sinon.stub()
            };
            sinon.stub(this.oController, "getView").returns(this.oViewStub);

            // Mock the mCMLModel
            this.oCMLModel = new JSONModel({
                metaData: {
                    featureFlag: {
                        isLoaded: false,
                        cmlEnableCopyAssetWithBgInfo: "0",
                        flag2: "0"
                    }
                }
            });
            this.oViewStub.getModel.withArgs("mCMLModel").returns(this.oCMLModel);

            // Mock the i18n model
            this.oI18nStub = {
                getText: sinon.stub().returns("Error message")
            };
            this.oI18nModelStub = {
                getResourceBundle: sinon.stub().returns(this.oI18nStub)
            };
            this.oViewStub.getModel.withArgs("i18n").returns(this.oI18nModelStub);

            // Mock commonDataSource
            this.oController.commonDataSource = {
                fetchFeatureFlag: sinon.stub()
            };

            // Note: MessageToast is stubbed in the specific test that needs it
        },

        /**
         * After each function
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should not fetch feature flag if already loaded", function (assert) {

        this.oCMLModel.setProperty("/metaData/featureFlag/isLoaded", true);
        var fnCallback = sinon.spy();

        this.oController.fnLoadFeatureFlagConfig(fnCallback);

        assert.ok(this.oController.commonDataSource.fetchFeatureFlag.notCalled, "fetchFeatureFlag should not be called");
        assert.ok(fnCallback.notCalled, "Callback should not be called");
    });

    QUnit.test("Should fetch feature flag and update model on success", function (assert) {

        var fnCallback = sinon.spy();
        var oConfig = {
            cmlEnableCopyAssetWithBgInfo: { objectValue: "1" },
            flag2: { objectValue: "0" },
            flag3: { objectValue: "1" }
        };
        this.oController.commonDataSource.fetchFeatureFlag.callsArgWith(0, oConfig);

        this.oController.fnLoadFeatureFlagConfig(fnCallback);

        assert.ok(this.oController.commonDataSource.fetchFeatureFlag.calledOnce, "fetchFeatureFlag should be called once");
        assert.strictEqual(this.oCMLModel.getProperty("/metaData/featureFlag/cmlEnableCopyAssetWithBgInfo"), "1", "cmlEnableCopyAssetWithBgInfo should be updated");
        assert.strictEqual(this.oCMLModel.getProperty("/metaData/featureFlag/flag2"), "0", "flag2 should be updated");
        assert.strictEqual(this.oCMLModel.getProperty("/metaData/featureFlag/flag3"), undefined, "flag3 should not be added if not in original");
        assert.strictEqual(this.oCMLModel.getProperty("/metaData/featureFlag/isLoaded"), true, "isLoaded should be set to true");
        assert.ok(fnCallback.calledOnce, "Callback should be called once");
    });

    QUnit.test("Should show error message on fetch failure", function (assert) {
        // Arrange
        var fnCallback = sinon.spy();
        this.oController.commonDataSource.fetchFeatureFlag.callsArg(1); // Call error callback
        var oMessageToastStub = sinon.stub(sap.m.MessageToast, "show");

        // Act
        this.oController.fnLoadFeatureFlagConfig(fnCallback);

        // Assert
        assert.ok(this.oController.commonDataSource.fetchFeatureFlag.calledOnce, "fetchFeatureFlag should be called once");
        assert.ok(oMessageToastStub.calledOnce, "MessageToast.show should be called once");
        assert.ok(oMessageToastStub.calledWith("Error message"), "MessageToast.show should be called with correct message");
        assert.ok(fnCallback.notCalled, "Callback should not be called on error");
        assert.strictEqual(this.oCMLModel.getProperty("/metaData/featureFlag/isLoaded"), false, "isLoaded should remain false on error");

        oMessageToastStub.restore();
    });

    QUnit.test("Should call callback without arguments", function (assert) {

        var oConfig = {
            cmlEnableCopyAssetWithBgInfo: { objectValue: "1" }
        };
        this.oController.commonDataSource.fetchFeatureFlag.callsArgWith(0, oConfig);

        this.oController.fnLoadFeatureFlagConfig();

        assert.ok(this.oController.commonDataSource.fetchFeatureFlag.calledOnce, "fetchFeatureFlag should be called once");
    });

});
