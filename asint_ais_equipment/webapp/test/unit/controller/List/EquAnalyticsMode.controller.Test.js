sap.ui.define([
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit",
    "com/asint/ais/mi/equipment/controller/list/EquAnalyticsMode.controller"
], function (sinon, sinonQunit, EquAnalyticsModeController) {
    "use strict";

    /**
     * Tests for onClearAllFilters
     */
    QUnit.module("Analytics Mode Controller", {
        /**
         * Setup before each test
         */
        beforeEach: function () {
            this.oController = new EquAnalyticsModeController();
            this.oView = {
                getModel: sinon.stub(),
                byId: sinon.stub()
            };
            this.oController.getView = sinon.stub().returns(this.oView);
            
            this.oModel = new sap.ui.model.json.JSONModel({
                data: {
                    isCorporateMatrixVisible: true,
                    matrixLevelFilters: "someFilter=value",
                    HCMatirxLevelFilters: "someHCFilter=value",
                    prevSelections: { key1: true },
                    page: {
                        start: 0,
                        size: 20
                    }
                }
            });
            this.oView.getModel.withArgs("mEquAnalytics").returns(this.oModel);

            this.oFilterBar = {
                getFilterGroupItems: sinon.stub().returns([
                    {
                        getControl: sinon.stub().returns({
                            getMetadata: sinon.stub().returns({
                                getName: sinon.stub().returns("sap.m.ComboBox")
                            }),
                            setSelectedKey: sinon.spy()
                        })
                    },
                    {
                        getControl: sinon.stub().returns({
                            getMetadata: sinon.stub().returns({
                                getName: sinon.stub().returns("sap.m.MultiComboBox")
                            }),
                            setSelectedKeys: sinon.spy()
                        })
                    },
                    {
                        getControl: sinon.stub().returns({
                            getMetadata: sinon.stub().returns({
                                getName: sinon.stub().returns("sap.m.MultiInput")
                            }),
                            setTokens: sinon.spy()
                        })
                    }
                ])
            };

            this.oPanel = {
                getContent: sinon.stub().returns([
                    {
                        getItems: sinon.stub().returns([])
                    },
                    {
                        getItems: sinon.stub().returns([{
                            getContent: sinon.stub().returns([{
                                getItems: sinon.stub().returns([{
                                    getItems: sinon.stub().returns([{
                                        getItems: sinon.stub().returns([
                                            {},
                                            {
                                                setSelectedKeys: sinon.spy()
                                            }
                                        ])
                                    }])
                                }])
                            }])
                        }])
                    }
                ])
            };

            this.oTable = {
                setGrowingThreshold: sinon.spy()
            };

            this.oView.byId.withArgs("idAnalytcisPagefilterbar").returns(this.oFilterBar);
            this.oView.byId.withArgs("idAnalyticsModeMainPanel").returns(this.oPanel);
            this.oView.byId.withArgs("idEquAnalyticsListTable").returns(this.oTable);

            this.oController.fnLoadItems = sinon.stub().callsArgWith(3, 20);
            this.oController.fnFetchRiskMatrixDetails = sinon.spy();
        },
        /**
         * Cleanup after each test
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     * Test onClearAllFilters when corporate matrix is visible
     */
    QUnit.test("Should clear matrixLevelFilters when corporate matrix is visible", function (assert) {
        this.oModel.setProperty("/data/isCorporateMatrixVisible", true);
        this.oModel.setProperty("/data/matrixLevelFilters", "someFilter=value");

        this.oController.onClearAllFilters();

        var sMatrixLevelFilters = this.oModel.getProperty("/data/matrixLevelFilters");
        assert.strictEqual(sMatrixLevelFilters, "", "matrixLevelFilters should be cleared when corporate matrix is visible");
        assert.ok(this.oController.fnLoadItems.calledOnce, "fnLoadItems should be called");
        assert.ok(this.oController.fnFetchRiskMatrixDetails.calledOnce, "fnFetchRiskMatrixDetails should be called");
    });

    /**
     * Test onClearAllFilters when HC matrix is visible
     */
    QUnit.test("Should clear HCMatirxLevelFilters when HC matrix is visible", function (assert) {
        this.oModel.setProperty("/data/isCorporateMatrixVisible", false);
        this.oModel.setProperty("/data/HCMatirxLevelFilters", "someHCFilter=value");

        this.oController.onClearAllFilters();

        var sHCMatrixLevelFilters = this.oModel.getProperty("/data/HCMatirxLevelFilters");
        assert.strictEqual(sHCMatrixLevelFilters, "", "HCMatirxLevelFilters should be cleared when HC matrix is visible");
        assert.ok(this.oController.fnLoadItems.calledOnce, "fnLoadItems should be called");
        assert.ok(this.oController.fnFetchRiskMatrixDetails.calledOnce, "fnFetchRiskMatrixDetails should be called");
    });

});
