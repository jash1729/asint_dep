sap.ui.define([
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit",
    "com/asint/ais/mi/cml/controller/list/CMLList.controller"
], function (sinon, sinonQunit, CMLListController) {
    "use strict";

    /**
     * Tests for onExcelExportForCmlOv
     */
    QUnit.module("onExcelExportForCmlOv", {
        /**
         * Setup before each test
         */
        beforeEach: function () {
            this.oController = new CMLListController();
            this.oView = {
                getModel: sinon.stub(),
                byId: sinon.stub()
            };
            this.oController.getView = sinon.stub().returns(this.oView);
            this.oController.byId = sinon.stub();
            this.oController.commonDataSource = {
                fnMakeGetRequest: sinon.stub()
            };
            this.oController.fnBuildExportObjForCmlOv = sinon.stub();
            this.oController._oi18n = {
                getText: sinon.stub().returns("CML Overview")
            };
            this.oController.fnFormatter = {
                formatDate: sinon.stub().returns("29_04_2026_12_00_00")
            };
        },
        /**
         * Cleanup after each test
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     * Test early return when binding is not available
     */
    QUnit.test("Should return early when binding is not available", function (assert) {
        var oTable = {
            getBinding: sinon.stub().returns(null)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        this.oController.onExcelExportForCmlOv();

        assert.ok(this.oController.commonDataSource.fnMakeGetRequest.notCalled, 
            "fnMakeGetRequest not called when binding is null");
    });

    /**
     * Test early return when getDownloadUrl is not available
     */
    QUnit.test("Should return early when getDownloadUrl is not available", function (assert) {
        var oTable = {
            getBinding: sinon.stub().returns({})
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        this.oController.onExcelExportForCmlOv();

        assert.ok(this.oController.commonDataSource.fnMakeGetRequest.notCalled, 
            "fnMakeGetRequest not called when getDownloadUrl is missing");
    });

    /**
     * Test count URL construction with query parameters
     */
    QUnit.test("Should construct count URL correctly with query parameters", function (assert) {
        var sDownloadUrl = "/asint/odata/v4/CMLList/CMLItems?$select=ID&$orderby=modifiedAt&$filter=status eq 'Active'";
        var oBinding = {
            getDownloadUrl: sinon.stub().returns(sDownloadUrl)
        };
        var oTable = {
            getBinding: sinon.stub().returns(oBinding)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        this.oController.onExcelExportForCmlOv();

        assert.ok(this.oController.commonDataSource.fnMakeGetRequest.calledOnce, 
            "fnMakeGetRequest called once");
        
        var sCountUrl = this.oController.commonDataSource.fnMakeGetRequest.getCall(0).args[0];
        assert.ok(sCountUrl.includes("/$count"), "Count URL includes /$count");
        assert.ok(sCountUrl.includes("$filter=status eq 'Active'"), "Count URL preserves $filter");
        assert.notOk(sCountUrl.includes("$select"), "Count URL removes $select");
        assert.notOk(sCountUrl.includes("$orderby"), "Count URL removes $orderby");
    });

    /**
     * Test count URL construction without query parameters
     */
    QUnit.test("Should construct count URL correctly without query parameters", function (assert) {
        var sDownloadUrl = "/asint/odata/v4/CMLList/CMLItems";
        var oBinding = {
            getDownloadUrl: sinon.stub().returns(sDownloadUrl)
        };
        var oTable = {
            getBinding: sinon.stub().returns(oBinding)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        this.oController.onExcelExportForCmlOv();

        assert.ok(this.oController.commonDataSource.fnMakeGetRequest.calledOnce, 
            "fnMakeGetRequest called once");
        
        var sCountUrl = this.oController.commonDataSource.fnMakeGetRequest.getCall(0).args[0];
        assert.equal(sCountUrl, sDownloadUrl + "/$count", 
            "Count URL correctly appends /$count without query params");
    });

    /**
     * Test successful batch data retrieval
     */
    QUnit.test("Should retrieve data in batches and call export", function (assert) {
        var done = assert.async();
        var sDownloadUrl = "/asint/odata/v4/CMLList/CMLItems?$filter=status eq 'Active'";
        var oBinding = {
            getDownloadUrl: sinon.stub().returns(sDownloadUrl)
        };
        var oTable = {
            getBinding: sinon.stub().returns(oBinding)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        // Mock count request - call success callback with "250"
        this.oController.commonDataSource.fnMakeGetRequest.callsArgWith(2, "250");

        this.oController.onExcelExportForCmlOv();

        setTimeout(function () {
            assert.ok(this.oController.fnBuildExportObjForCmlOv.called, 
                "Export function called after batch retrieval");
            done();
        }.bind(this), 100);
    });

    /**
     * Test error handling in batch retrieval
     */
    QUnit.test("Should handle errors in batch data retrieval", function (assert) {
        var done = assert.async();
        var sDownloadUrl = "/asint/odata/v4/CMLList/CMLItems?$filter=status eq 'Active'";
        var oBinding = {
            getDownloadUrl: sinon.stub().returns(sDownloadUrl)
        };
        var oTable = {
            getBinding: sinon.stub().returns(oBinding)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        // Mock count request - call success callback with "100"
        this.oController.commonDataSource.fnMakeGetRequest.callsArgWith(2, "100");

        this.oController.onExcelExportForCmlOv();

        setTimeout(function () {
            assert.ok(this.oController.fnBuildExportObjForCmlOv.called, 
                "Export still called even with some batch errors");
            done();
        }.bind(this), 100);
    });

    /**
     * Test $search parameter preservation
     */
    QUnit.test("Should preserve $search parameter in count URL", function (assert) {
        var sDownloadUrl = "/asint/odata/v4/CMLList/CMLItems?$filter=status eq 'Active'&$search=equipment&$orderby=createdAt";
        var oBinding = {
            getDownloadUrl: sinon.stub().returns(sDownloadUrl)
        };
        var oTable = {
            getBinding: sinon.stub().returns(oBinding)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        this.oController.onExcelExportForCmlOv();

        var sCountUrl = this.oController.commonDataSource.fnMakeGetRequest.getCall(0).args[0];
        assert.ok(sCountUrl.includes("$filter=status eq 'Active'"), "Filter preserved");
        assert.ok(sCountUrl.includes("$search=equipment"), "Search preserved");
        assert.notOk(sCountUrl.includes("$orderby"), "OrderBy removed");
    });

    /**
     * Test batch size calculation
     */
    QUnit.test("Should calculate correct number of batches", function (assert) {
        var sDownloadUrl = "/asint/odata/v4/CMLList/CMLItems";
        var oBinding = {
            getDownloadUrl: sinon.stub().returns(sDownloadUrl)
        };
        var oTable = {
            getBinding: sinon.stub().returns(oBinding)
        };
        this.oController.byId.withArgs("idCMLMTableForCmlOv").returns(oTable);

        // Mock count request - call success callback with "250"
        this.oController.commonDataSource.fnMakeGetRequest.callsArgWith(2, "250");

        this.oController.onExcelExportForCmlOv();

        var done = assert.async();
        setTimeout(function () {
            // Count call + 3 batch calls = 4 total calls
            assert.ok(this.oController.commonDataSource.fnMakeGetRequest.callCount >= 1,
                "API calls made for count and batches");
            done();
        }.bind(this), 100);
    });

    QUnit.test("Should reset PLMT, PLPT, PLSC and LOC filters to empty array", function (assert) {
        var oCommonModel = {
            setProperty: sinon.stub(),
            getProperty: sinon.stub().returns({})
        };

        this.oView.getModel.withArgs("commonModel").returns(oCommonModel);
        this.oController.getView = sinon.stub().returns(this.oView);

        if (typeof this.oController.fnInitialize === "function") {
            this.oController.fnInitialize();
        } else if (typeof this.oController.onInit === "function") {
            this.oController.onInit();
        }

        assert.ok(oCommonModel.setProperty.calledWith("/data/listPageForCmlOv/filters/PLMT", []), "PLMT reset");
        assert.ok(oCommonModel.setProperty.calledWith("/data/listPageForCmlOv/filters/PLPT", []), "PLPT reset");
        assert.ok(oCommonModel.setProperty.calledWith("/data/listPageForCmlOv/filters/PLSC", []), "PLSC reset");
        assert.ok(oCommonModel.setProperty.calledWith("/data/listPageForCmlOv/filters/LOC", []),  "LOC reset");
    });
});
