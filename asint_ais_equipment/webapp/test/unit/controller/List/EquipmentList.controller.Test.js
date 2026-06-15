sap.ui.define([
    "comasintaismiequipment/equipment/controller/list/EquipmentList.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel, sinon) {
    "use strict";

    /**
     * 
     */
    QUnit.module("EquipmentList.controller - _fnCreateEquipmentHandler", {

        /**
         * beforeEach function
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oModel = new JSONModel({
                data: {
                    createNewEquipment: {
                        name: "EQ1",
                        description: "Test Equipment",
                        sortField: "001",
                        componentType: "TYPE1",
                        selectedEquTemp: [],
                        oParentAsset: {}
                    }
                }
            });

            this.oView = {
                getModel: sinon.stub().withArgs("mEquipmentList").returns(this.oModel),
                addDependent: sinon.spy()
            };

            sinon.stub(this.oController, "getView").returns(this.oView);

            this.oController.fnMessageShow = sinon.spy();
            this.oController.fnCheckMandatoryFields = sinon.stub().returns(true);
            this.oController.fnCreateEquipment = sinon.spy();
            this.oController.fnGetParentEquipmentInfo = sinon.spy();
            this.oController.fnGetParentFlocInfo = sinon.spy();

            this.oController._oi18n = {
                getText: sinon.stub().returns("Error message")
            };
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
    QUnit.test("Should open dialog on open action", function (assert) {

        var done = assert.async();

        var oDialog = {
            open: sinon.spy()
        };

        sinon.stub(sap.ui.core.Fragment, "load").returns(Promise.resolve(oDialog));

        this.oController._fnCreateEquipmentHandler("open");

        /**
         * 
         */
        setTimeout(function () {

            assert.ok(oDialog.open.calledOnce, "Dialog opened successfully");

            done();

        }, 0);
    });

    /**
     * 
     */
    QUnit.test("Should close dialog and reset fields", function (assert) {

        this.oController._createEquipmentDialog = {
            close: sinon.spy()
        };

        sinon.stub(sap.ui.getCore(), "byId")
            .withArgs("parentInput").returns({ setValue: sinon.spy() })
            .withArgs("objectTemplateMultiInput").returns({ removeAllTokens: sinon.spy() });

        this.oController._fnCreateEquipmentHandler("close");

        assert.ok(this.oController._createEquipmentDialog.close.calledOnce, "Dialog closed");
    });

    /**
     * 
     */
    QUnit.test("Should call fnCreateEquipment when confirm action is executed", function (assert) {

        this.oController._fnCreateEquipmentHandler("confirm");

        assert.ok(this.oController.fnCreateEquipment.calledOnce, "Create equipment called");
    });

    /**
     * 
     */
    QUnit.test("Should show error when description length > 500", function (assert) {

        var sLongDescription = new Array(502).join("A"); 

        this.oModel = new JSONModel({
            data: {
                createNewEquipment: {
                    name: "EQ1",
                    description: sLongDescription,
                    sortField: "001",
                    componentType: "TYPE1",
                    selectedEquTemp: [],
                    oParentAsset: {}
                }
            }
        });

        this.oView.getModel = sinon.stub().withArgs("mEquipmentList").returns(this.oModel);

        this.oController._fnCreateEquipmentHandler("confirm");

        assert.ok(this.oController.fnMessageShow.calledOnce, "Error message shown for long description");
    });
        
    
    QUnit.module("EquipmentList.controller - fnGetParentEquipmentInfo", {
        /**
         * beforeEach function
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oParentEquipmentData = {
                //eslint-disable-next-line camelcase
                parent_functional_location_ID: "FLC01",
                systemStatus: "ACTV",
                userStatus: "USTS"
            };

            this.oPayload = {
                name: "EQ1"
            };

            this.oController.dataSource = {
                fnGetParentEquipmentInfo: sinon.stub()
            };

            this.oController.fnCreateEquipment = sinon.spy();
            this.oController.fnMessageShow = sinon.spy();

            this.oController._oi18n = {
                getText: sinon.stub().returns("Error message")
            };
        },

        /**
         * afterEach function
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     *
     */
    QUnit.test("Should map payload fields from parent equipment data on success", function (assert) {

        var oData = this.oParentEquipmentData;

        this.oController.dataSource.fnGetParentEquipmentInfo.callsArgWith(1, oData);

        this.oController.fnGetParentEquipmentInfo("EQ-001", this.oPayload);

        assert.equal(this.oPayload.parent_functional_location_ID, oData.parent_functional_location_ID, "parent_functional_location_ID mapped correctly");
        assert.equal(this.oPayload.systemStatus, oData.systemStatus, "systemStatus mapped correctly");
        assert.equal(this.oPayload.userStatus, oData.userStatus, "userStatus mapped correctly");
    });

    /**
     *
     */
    QUnit.test("Should call fnCreateEquipment with correct arguments on success", function (assert) {

        var oData = this.oParentEquipmentData;

        this.oController.dataSource.fnGetParentEquipmentInfo.callsArgWith(1, oData);

        this.oController.fnGetParentEquipmentInfo("EQ-001", this.oPayload);

        assert.ok(this.oController.fnCreateEquipment.calledOnce, "fnCreateEquipment called once");
        assert.ok(this.oController.fnCreateEquipment.calledWith(this.oPayload), "fnCreateEquipment called with the updated payload");
    });

    /**
     *
     */
    QUnit.test("Should not call fnCreateEquipment when fetch fails", function (assert) {

        var oError = {
            responseText: JSON.stringify({ error: { message: "Equipment not found" } })
        };

        this.oController.dataSource.fnGetParentEquipmentInfo.callsArgWith(2, oError);

        this.oController.fnGetParentEquipmentInfo("EQ-999", this.oPayload);

        assert.ok(this.oController.fnCreateEquipment.notCalled, "fnCreateEquipment not invoked on error path");
    });

    /**
     *
     */
    QUnit.test("Should call fnMessageShow with error details when error has message", function (assert) {

        var oError = {
            responseText: JSON.stringify({
                error: {
                    message: "Equipment not found"
                }
            })
        };

        this.oController.dataSource.fnGetParentEquipmentInfo.callsArgWith(2, oError);

        this.oController.fnGetParentEquipmentInfo("EQ-999", this.oPayload);

        assert.ok(this.oController.fnMessageShow.calledOnce, "fnMessageShow called once on error");
        assert.ok(
            this.oController.fnMessageShow.calledWith("E", "Error message", "Equipment not found"),
            "fnMessageShow called with correct error type and detail"
        );
    });

    /**
     *
     */
    QUnit.test("Should call fnMessageShow with empty detail when error has no message", function (assert) {

        var oError = {
            responseText: JSON.stringify({ error: {} })
        };

        this.oController.dataSource.fnGetParentEquipmentInfo.callsArgWith(2, oError);

        this.oController.fnGetParentEquipmentInfo("EQ-999", this.oPayload);

        assert.ok(this.oController.fnMessageShow.calledOnce, "fnMessageShow called once");
        assert.ok(
            this.oController.fnMessageShow.calledWith("E", "Error message", ""),
            "fnMessageShow called with empty detail string"
        );
    });


    /**
     *
     */
    QUnit.module("EquipmentList.controller - fnGetParentFlocInfo", {

        /**
         * beforeEach function
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oPayload = {
                name: "EQ1"
            };

            this.oController.dataSource = {
                fnGetParentFlocInfo: sinon.stub()
            };

            this.oController.fnCreateEquipment = sinon.spy();
            this.oController.fnMessageShow = sinon.spy();

            this.oController._oi18n = {
                getText: sinon.stub().returns("Error message")
            };
        },

        /**
         * afterEach function
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     *
     */
    QUnit.test("Should call fnCreateEquipment with the original payload on success", function (assert) {

        this.oController.dataSource.fnGetParentFlocInfo.callsArgWith(1);

        this.oController.fnGetParentFlocInfo("FL-001", this.oPayload);

        assert.ok(this.oController.fnCreateEquipment.calledOnce, "fnCreateEquipment called once");
        assert.ok(this.oController.fnCreateEquipment.calledWith(this.oPayload), "fnCreateEquipment called with original payload — FLOC adds nothing");
    });

    /**
     *
     */
    QUnit.test("Should not call fnMessageShow on success", function (assert) {

        this.oController.dataSource.fnGetParentFlocInfo.callsArgWith(1);

        this.oController.fnGetParentFlocInfo("FL-001", this.oPayload);

        assert.ok(this.oController.fnMessageShow.notCalled, "fnMessageShow not invoked on success path");
    });

    /**
     *
     */
    QUnit.test("Should not call fnCreateEquipment when fetch fails", function (assert) {

        var oError = {
            responseText: JSON.stringify({ error: { message: "FLOC not found" } })
        };

        this.oController.dataSource.fnGetParentFlocInfo.callsArgWith(2, oError);

        this.oController.fnGetParentFlocInfo("FL-999", this.oPayload);

        assert.ok(this.oController.fnCreateEquipment.notCalled, "fnCreateEquipment not invoked on error path");
    });

    /**
     *
     */
    QUnit.test("Should call fnMessageShow with error details when error has message", function (assert) {

        var oError = {
            responseText: JSON.stringify({
                error: {
                    message: "FLOC not found"
                }
            })
        };

        this.oController.dataSource.fnGetParentFlocInfo.callsArgWith(2, oError);

        this.oController.fnGetParentFlocInfo("FL-999", this.oPayload);

        assert.ok(this.oController.fnMessageShow.calledOnce, "fnMessageShow called once on error");
        assert.ok(
            this.oController.fnMessageShow.calledWith("E", "Error message", "FLOC not found"),
            "fnMessageShow called with correct error type and detail"
        );
    });

    /**
     *
     */
    QUnit.test("Should call fnMessageShow with empty detail when error has no message", function (assert) {

        var oError = {
            responseText: JSON.stringify({ error: {} })
        };

        this.oController.dataSource.fnGetParentFlocInfo.callsArgWith(2, oError);

        this.oController.fnGetParentFlocInfo("FL-999", this.oPayload);

        assert.ok(this.oController.fnMessageShow.calledOnce, "fnMessageShow called once");
        assert.ok(
            this.oController.fnMessageShow.calledWith("E", "Error message", ""),
            "fnMessageShow called with empty detail string"
        );
    });

    /**
     * 
     */
    QUnit.module("EquipmentList.controller - Copy Fields Dialog Flow", {

        /**
         * 
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oController.PARENT_COPY_FIELDS = [
                {
                    key: "technicalObjectSortCode",
                    label: "Technical Object Sort Code"
                },
                {
                    key: "manufacturerCountry",
                    label: "Manufacturer Country"
                }
            ];

            this.oModel = new JSONModel({
                data: {
                    parentCopyFields: [],
                    createNewEquipment: {
                        oParentAsset: {}
                    }
                }
            });

            this.oView = {
                getModel: sinon.stub().withArgs("mEquipmentList").returns(this.oModel)
            };

            sinon.stub(this.oController, "getView").returns(this.oView);

            this.oController.dataSource = {
                fnGetNearestS4ParentFields: sinon.stub()
            };

            this.oController._fnLoadCopyFieldsDialog = sinon.spy();

            this.oController.fnMessageShow = sinon.spy();

            this.oController._oi18n = {
                getText: sinon.stub().returns("Error message")
            };
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
    QUnit.test("Should set mapped parent fields in model on success", function (assert) {

        var oResponse = {
            technicalObjectSortCode: "TECH-001",
            manufacturerCountry: "India"
        };

        sinon.spy(this.oModel, "setProperty");

        this.oController.dataSource.fnGetNearestS4ParentFields.callsArgWith(1, oResponse);

        this.oController._fnFetchParentFieldsAndOpenDialog("PARENT001");

        assert.ok(
            this.oModel.setProperty.calledWith("/data/parentCopyFields"),
            "parentCopyFields updated in model"
        );
    });

    /**
     * 
     */
    QUnit.test("Should open copy fields dialog on successful fetch", function (assert) {

        var oResponse = {
            technicalObjectSortCode: "TECH-001",
            manufacturerCountry: "India"
        };

        this.oController.dataSource.fnGetNearestS4ParentFields.callsArgWith(1, oResponse);

        this.oController._fnFetchParentFieldsAndOpenDialog("PARENT001");

        assert.ok(
            this.oController._fnLoadCopyFieldsDialog.calledOnce,
            "Copy fields dialog opened successfully"
        );
    });

    /**
     * 
     */
    QUnit.test("Should call fnMessageShow when fetch fails", function (assert) {

        this.oController.dataSource.fnGetNearestS4ParentFields.callsArgWith(2);

        this.oController._fnFetchParentFieldsAndOpenDialog("PARENT001");

        assert.ok(
            this.oController.fnMessageShow.calledOnce,
            "fnMessageShow called on error"
        );
    });

    /**
     * 
     */
    QUnit.module("EquipmentList.controller - onOpenAdvancedFilterDialog", {

        /**
         * 
         */
        beforeEach: function () {

            this.oController = Object.create(Controller.prototype);
            this.oModel = new JSONModel({ data: {} });
            this.oInput = { id: "testInput" };
            this.oView = {
                byId: sinon.stub().withArgs("testInputId").returns(this.oInput),
                getModel: sinon.stub().withArgs("mEquipmentList").returns(this.oModel)
            };

            this.oController.getView = sinon.stub().returns(this.oView);
            this.oController.valueHelpFilter = {
                onOpenValuHelpFilterDialog: sinon.spy()
            };
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
    QUnit.test("Should call onOpenValuHelpFilterDialog with correct arguments", function (assert) {

        this.oController.onOpenAdvancedFilterDialog("fragId","fragName","fragInstanceVar","testInputId");
        assert.ok(this.oController.valueHelpFilter.onOpenValuHelpFilterDialog.calledOnce,"onOpenValuHelpFilterDialog called once");
        assert.ok(this.oController.valueHelpFilter.onOpenValuHelpFilterDialog.calledWith(null, "fragId", "fragName", "fragInstanceVar", this.oModel, this.oInput), "called with correct arguments: null, fragmentId, fragmentName, instanceVar, model, input");
    });

    /**
     * 
     */
    QUnit.test("Should resolve the input control via view.byId using sInputName", function (assert) {

        this.oController.onOpenAdvancedFilterDialog("fragId","fragName","fragInstanceVar","testInputId");
        assert.ok(this.oView.byId.calledWith("testInputId"),"view.byId called with sInputName");
    });

    /**
     * 
     */
    QUnit.test("Should resolve the model via view.getModel('mEquipmentList')", function (assert) {

        this.oController.onOpenAdvancedFilterDialog("fragId","fragName","fragInstanceVar","testInputId");
        assert.ok(this.oView.getModel.calledWith("mEquipmentList"),"getModel called with 'mEquipmentList'");
    });

    /**
     * 
     */
    QUnit.test("Should always pass null as the first argument to onOpenValuHelpFilterDialog", function (assert) {

        this.oController.onOpenAdvancedFilterDialog("anyFragId","anyFragName","anyInstanceVar","testInputId");
        var firstArg = this.oController.valueHelpFilter.onOpenValuHelpFilterDialog.getCall(0).args[0];
        assert.strictEqual(firstArg, null, "First argument is always null");
    });

    /**
     * 
     */
    QUnit.test("Should pass fragment parameters in correct order", function (assert) {

        this.oController.onOpenAdvancedFilterDialog("myFragId","myFragName","myInstanceVar","testInputId");
        var oCall = this.oController.valueHelpFilter.onOpenValuHelpFilterDialog.getCall(0);

        assert.strictEqual(oCall.args[1], "myFragId",      "2nd arg is sFragmentId");
        assert.strictEqual(oCall.args[2], "myFragName",    "3rd arg is sFragmentName");
        assert.strictEqual(oCall.args[3], "myInstanceVar", "4th arg is sFragmentInstanceVarName");
        assert.strictEqual(oCall.args[4], this.oModel,     "5th arg is the model");
        assert.strictEqual(oCall.args[5], this.oInput,     "6th arg is the input control");
    });

    QUnit.module("EquipmentList.controller - getRiskDetailData", {
        /**
         * 
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oModel = new JSONModel({ data: {} });
            this.oView = {
                getModel: sinon.stub().withArgs("mEquipmentList").returns(this.oModel)
            };
            sinon.stub(this.oController, "getView").returns(this.oView);
            this.oController.commonDataSource = {
                getRiskData: sinon.stub()
            };
            this.oController.setRCAChartData = sinon.spy();
            this.oRawAssessmentData = {
                "item1": {
                    CRITICALITY_CODE: "HIGH",
                    CRITICALITY_TEXT: "High Risk",
                    RISK_SCORE: "85",
                    alphaNumericRiskScore: "A1",
                    SHE_MR: "10",
                    SHE_UMR: "20",
                    ECOM_MR: "30",
                    ECOM_UMR: "40",
                    OBJECT_ID: "OBJ001",
                    OBJECT_NAME: "Pump A",
                    OBJECT_DESCRIPTION: "Main pump unit"
                }
            };
        },
        /**
         * 
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should call getRiskData with 'EQUI' as the first argument", function (assert) {
        this.oController.getRiskDetailData();
        assert.ok(this.oController.commonDataSource.getRiskData.calledOnce, "getRiskData called once");
        assert.equal(this.oController.commonDataSource.getRiskData.getCall(0).args[0], "EQUI", "getRiskData called with 'EQUI'");
    });

    QUnit.test("Should set normalized data on '/data/backupriskSummaryData' model property", function (assert) {
        var oData = this.oRawAssessmentData;
        sinon.spy(this.oModel, "setProperty");
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        assert.ok(this.oModel.setProperty.calledOnce, "setProperty called once");
        assert.equal(this.oModel.setProperty.getCall(0).args[0], "/data/backupriskSummaryData", "setProperty called with correct path");
    });

    QUnit.test("Should call setRCAChartData with the normalized data array", function (assert) {
        var oData = this.oRawAssessmentData;
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        assert.ok(this.oController.setRCAChartData.calledOnce, "setRCAChartData called once");
        var aArg = this.oController.setRCAChartData.getCall(0).args[0];
        assert.ok(Array.isArray(aArg), "setRCAChartData called with an array");
        assert.equal(aArg.length, 1, "Normalized array has correct length");
    });

    QUnit.test("Should map UPPER_CASE fields to camelCase properties in normalized output", function (assert) {
        var oData = this.oRawAssessmentData;
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        var aNormalized = this.oController.setRCAChartData.getCall(0).args[0];
        var oItem = aNormalized[0];
        assert.equal(oItem.criticalityCode, "HIGH", "criticalityCode mapped from CRITICALITY_CODE");
        assert.equal(oItem.criticalityText, "High Risk", "criticalityText mapped from CRITICALITY_TEXT");
        assert.equal(oItem.riskScore, "85", "riskScore mapped from RISK_SCORE");
        assert.equal(oItem.sheMr, "10", "sheMr mapped from SHE_MR");
        assert.equal(oItem.sheUmr, "20", "sheUmr mapped from SHE_UMR");
        assert.equal(oItem.ecomMr, "30", "ecomMr mapped from ECOM_MR");
        assert.equal(oItem.ecomUmr, "40", "ecomUmr mapped from ECOM_UMR");
        assert.equal(oItem.objectId, "OBJ001", "objectId mapped from OBJECT_ID");
        assert.equal(oItem.objectName, "Pump A", "objectName mapped from OBJECT_NAME");
        assert.equal(oItem.objectDescription, "Main pump unit", "objectDescription mapped from OBJECT_DESCRIPTION");
    });

    QUnit.test("Should prefer UPPER_CASE (primary) over camelCase (fallback) in getVal", function (assert) {
        var oData = {
            "item1": {
                CRITICALITY_CODE: "upper-value",
                criticalityCode: "camel-value"
            }
        };
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        var oItem = this.oController.setRCAChartData.getCall(0).args[0][0];
        assert.equal(oItem.criticalityCode, "upper-value", "UPPER_CASE primary value takes precedence over camelCase fallback");
    });

    QUnit.test("Should fall back to camelCase value when UPPER_CASE field is null", function (assert) {
        var oData = {
            "item1": {
                CRITICALITY_CODE: null,
                criticalityCode: "camel-fallback"
            }
        };
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        var oItem = this.oController.setRCAChartData.getCall(0).args[0][0];
        assert.equal(oItem.criticalityCode, "camel-fallback", "Falls back to camelCase when UPPER_CASE is null");
    });

    QUnit.test("Should produce empty string when both primary and fallback fields are absent", function (assert) {
        var oData = { "item1": {} };
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        var oItem = this.oController.setRCAChartData.getCall(0).args[0][0];
        assert.strictEqual(oItem.criticalityCode, "", "Empty string when both field variants are absent");
    });

    QUnit.test("Should pass a deep copy of normalized data to setProperty", function (assert) {
        var oData = this.oRawAssessmentData;
        sinon.spy(this.oModel, "setProperty");
        this.oController.commonDataSource.getRiskData.callsArgWith(1, oData);
        this.oController.getRiskDetailData();
        var aStoredData = this.oModel.setProperty.getCall(0).args[1];
        var aChartData = this.oController.setRCAChartData.getCall(0).args[0];
        assert.notStrictEqual(aStoredData, aChartData, "setProperty receives a separate copy, not the same reference passed to setRCAChartData");
    });


    QUnit.module("fnSelectComponentTypeDropdown", {
        /**
         * 
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.mEquipment = new JSONModel();
            this.mEquipmentList = new JSONModel();

            this.oGetViewStub = sinon.stub(this.oController, "getView").returns({
                getModel: function (sModelName) {
                    if (sModelName === "mEquipment") {
                        return this.mEquipment;
                    }
                    if (sModelName === "mEquipmentList") {
                        return this.mEquipmentList;
                    }
                }.bind(this)
            });

        },
        /**
         * 
         */
        afterEach: function () {
            this.oGetViewStub.restore();
        }

    });
    /**
     * Copy Fields Dialog - Cancel Action Test
     */
    QUnit.test("onCopyFieldsCancel", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel();

        // Restore if already stubbed
        if (this.oController.getView && this.oController.getView.restore) {
            this.oController.getView.restore();
        }

        if (this.oController.byId && this.oController.byId.restore) {
            this.oController.byId.restore();
        }

        if (sap.ui.getCore().byId && sap.ui.getCore().byId.restore) {
            sap.ui.getCore().byId.restore();
        }

        sinon.stub(this.oController, "getView").returns({
            getModel: function () {
                return oModel;
            }
        });

        sinon.stub(this.oController, "byId").returns({
            removeSelections: sinon.spy()
        });

        sinon.stub(sap.ui.getCore(), "byId").returns({
            setValue: sinon.spy()
        });

        this.oController._oCopyParentFieldsDialog = {
            close: sinon.spy()
        };

        this.oController.onCopyFieldsCancel();

        assert.ok(
            this.oController._oCopyParentFieldsDialog.close.calledOnce,
            "Dialog closed"
        );

        sinon.restore();
    });

    QUnit.test("Should filter component types by Parent Asset Object Type when catalogBasedCTinXom = 0", function (assert) {

        this.mEquipment.setData({
            metadata: {
                featureFlag: {
                    catalogBasedCTinXom: "0"
                }
            },
            data: {
                aAllComponentType: [{
                    "Parent Asset Object Type": "EQUI",
                    name: "CT1"
                }, {
                    "Parent Asset Object Type": "FLOC",
                    name: "CT2"
                }]
            }
        });

        this.mEquipmentList.setData({
            data: {
                parentAllFields: {}
            }
        });

        this.oController.fnSelectComponentTypeDropdown({
            objectType: "EQUI"
        });

        var aResult = this.mEquipmentList.getProperty("/data/componentTypes");

        assert.equal(aResult.length, 1);
        assert.equal(aResult[0].name, "CT1");
    });

    QUnit.test("Should filter component types by Catalog Profile when catalogBasedCTinXom = 1 and parentAssetType = EQUI", function (assert) {

        this.mEquipment.setData({
            metadata: {
                featureFlag: {
                    catalogBasedCTinXom: "1"
                }
            },
            data: {
                aAllComponentType: [{
                    "Catalog Profile": "CP1",
                    name: "CT1"
                }, {
                    "Catalog Profile": "CP2",
                    name: "CT2"
                }]
            }
        });

        this.mEquipmentList.setData({
            data: {
                parentAllFields: {
                    catalogProfile: "CP1"
                }
            }
        });

        this.oController.fnSelectComponentTypeDropdown({
            parentAssetType: "EQUI"
        });

        var aResult = this.mEquipmentList.getProperty("/data/componentTypes");

        assert.equal(aResult.length, 1);
        assert.equal(aResult[0].name, "CT1");
    });

    QUnit.test("Should return all component types when catalogBasedCTinXom = 1 and parentAssetType = FLOC", function (assert) {

        this.mEquipment.setData({
            metadata: {
                featureFlag: {
                    catalogBasedCTinXom: "1"
                }
            },
            data: {
                aAllComponentTypeForFloc: [{
                    name: "CT1"
                }, {
                    name: "CT2"
                }]
            }
        });

        this.mEquipmentList.setData({
            data: {
                parentAllFields: {
                    catalogProfile: "CP1"
                }
            }
        });

        this.oController.fnSelectComponentTypeDropdown({
            parentAssetType: "FLOC"
        });

        var aResult = this.mEquipmentList.getProperty("/data/componentTypes");

        assert.equal(aResult.length, 2);
    });

    QUnit.test("Should set empty componentTypes when no component type data exists", function (assert) {

        this.mEquipment.setData({
            metadata: {
                featureFlag: {
                    catalogBasedCTinXom: "0"
                }
            },
            data: {
                aAllComponentType: []
            }
        });

        this.mEquipmentList.setData({
            data: {
                parentAllFields: {}
            }
        });

        this.oController.fnSelectComponentTypeDropdown({
            objectType: "EQUI"
        });

        assert.deepEqual(
            this.mEquipmentList.getProperty("/data/componentTypes"),
            []
        );
    });

    QUnit.test("Should delete parentAssetType from oReturn", function (assert) {

        var oReturn = {
            parentAssetType: "EQUI"
        };

        this.mEquipment.setData({
            metadata: {
                featureFlag: {
                    catalogBasedCTinXom: "1"
                }
            },
            data: {
                aAllComponentType: []
            }
        });

        this.mEquipmentList.setData({
            data: {
                parentAllFields: {}
            }
        });

        this.oController.fnSelectComponentTypeDropdown(oReturn);

        assert.notOk(oReturn.hasOwnProperty("parentAssetType"));
    });

    QUnit.module("EquipmentList.controller - onPressExportExcel", {

        /**
         * beforeEach function
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oController.sTableVisibleId = "idEquipmentListMTable";

            this.oController.formatter = {
                formatDate: sinon.stub().returns("10_06_2026_10_00_00"),
                fnFormatEquipmentClass: sinon.stub().returns("Pump Class")
            };

            this.oController.fnExportTableDataToExcel = sinon.spy();

            this.oBinding = {
                getDownloadUrl: sinon.stub().returns(
                    "/Equipment?$filter=status eq 'ACTIVE'&$orderby=name"
                )
            };

            this.oTable = {
                getBinding: sinon.stub().withArgs("items").returns(this.oBinding)
            };

            this.oController.byId = sinon.stub().returns(this.oTable);

            this.oController._oi18n = {
                getText: sinon.stub().withArgs("title").returns("Equipment")
            };

            this.oController.commonDataSource = {
                fnMakeGetRequest: sinon.stub()
            };

            this.oBundle = {
                getText: sinon.stub().returns("Translated Text")
            };

            this.oController.formatter.formatDates = sinon.spy();

            this.oColumn = {
                getVisible: sinon.stub().returns(true),
                getAggregation: sinon.stub()
            };

            this.oFeatureFlagModel = new JSONModel({
                metadata: {
                    featureFlag: {
                        equipmentExcelExportEnhancements: "1"
                    }
                }
            });

            this.oView = {
                byId: sinon.stub().returns({
                    getColumns: sinon.stub().returns([this.oColumn])
                }),
                getModel: sinon.stub()
            };

            this.oView.getModel.withArgs("i18n").returns({
                getResourceBundle: sinon.stub().returns({
                    getText: sinon.stub().returns("Translated Text")
                })
            });
            this.oView.getModel.withArgs("mEquipment").returns(this.oFeatureFlagModel);

            sinon.stub(this.oController, "getView").returns(this.oView);
        },

        /**
         * Restore all sinon stubs and spies
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     * Should generate count URL and trigger export
     */
    QUnit.test("Should build count URL with filter and export data", function (assert) {

        this.oController.commonDataSource.fnMakeGetRequest.onFirstCall()
            .callsArgWith(2, "2");

        this.oController.commonDataSource.fnMakeGetRequest.onSecondCall()
            .callsArgWith(2, {
                value: [{
                    equipmentId: "EQ1",
                    classDetails: []
                }]
            });

        this.oController.onPressExportExcel();

        assert.equal(this.oController.commonDataSource.fnMakeGetRequest.getCall(0).args[0], "/Equipment/$count?$filter=status eq 'ACTIVE'", "Count URL generated correctly");
        assert.ok(this.oController.fnExportTableDataToExcel.calledOnce,"Export function called");
    });

    /**
     * Should add formatted class description to exported rows
     */
    QUnit.test("Should enrich rows with classDetails_classDescription", function (assert) {

        var aExportRows;

        this.oController.commonDataSource.fnMakeGetRequest.onFirstCall()
            .callsArgWith(2, "1");

        this.oController.commonDataSource.fnMakeGetRequest.onSecondCall()
            .callsArgWith(2, {
                value: [{
                    equipmentId: "EQ1",
                    classDetails: [{ className: "PUMP" }]
                }]
            });

        this.oController.fnExportTableDataToExcel = function (sTableId, sFile, fnCallback) {
            fnCallback(function (aRows) {
                aExportRows = aRows;
            });
        };

        this.oController.onPressExportExcel();

        assert.equal(aExportRows[0].classDetails_classDescription,"Pump Class","Formatted class description added");
    });

    /**
     * Should request all pages when record count exceeds chunk size
     */
    QUnit.test("Should request all pages when count exceeds chunk size", function (assert) {

        this.oController.commonDataSource.fnMakeGetRequest.onFirstCall()
            .callsArgWith(2, "201");

        this.oController.commonDataSource.fnMakeGetRequest.onSecondCall()
            .callsArgWith(2, { value: [] });

        this.oController.commonDataSource.fnMakeGetRequest.onThirdCall()
            .callsArgWith(2, { value: [] });

        this.oController.commonDataSource.fnMakeGetRequest.onCall(3)
            .callsArgWith(2, { value: [] });

        this.oController.onPressExportExcel();

        assert.equal(this.oController.commonDataSource.fnMakeGetRequest.callCount, 4, "1 count request + 3 page requests");
    });

    /**
     * Should continue export when page request fails
     */
    QUnit.test("Should handle page request failure and still export", function (assert) {

        this.oController.commonDataSource.fnMakeGetRequest.onFirstCall()
            .callsArgWith(2, "1");

        this.oController.commonDataSource.fnMakeGetRequest.onSecondCall()
            .callsArgWith(3);

        this.oController.onPressExportExcel();

        assert.ok(this.oController.fnExportTableDataToExcel.calledOnce,"Export still triggered after page failure");
    });

    /**
     * Should build count URL when no query parameters exist
     */
    QUnit.test("Should create count URL without query parameters", function (assert) {

        this.oBinding.getDownloadUrl.returns("/Equipment");

        this.oController.commonDataSource.fnMakeGetRequest.onFirstCall()
            .callsArgWith(2, "0");

        this.oController.onPressExportExcel();

        assert.equal(this.oController.commonDataSource.fnMakeGetRequest.getCall(0).args[0],"/Equipment/$count","Count URL generated correctly without query string");
        assert.ok(this.oController.fnExportTableDataToExcel.calledOnce, "Export function called for empty result set");
    });

    /**
     * Should build export columns from field-based export settings
     */
    QUnit.test("Should build columns from fields array", function (assert) {

        var aCols;

        this.oColumn.getAggregation.returns({
            data: sinon.stub().returns({
                fields: [{
                    value: "equipmentId",
                    i18n: "equipment.id"
                }]
            })
        });

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "0");

        this.oController.fnExportTableDataToExcel = function (sId, sFile, fnCb) {
            fnCb(function (rows, cols) {
                aCols = cols;
            });
        };

        this.oController.onPressExportExcel();

        assert.strictEqual(aCols[0].property, "equipmentId", "Field property mapped correctly");
        assert.strictEqual(aCols[0].label, "Translated Text", "Field label resolved from i18n key");
    });

    /**
     * Should format date fields before export
     */
    QUnit.test("Should call formatDates for exported rows", function (assert) {

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "1");

        this.oController.commonDataSource.fnMakeGetRequest
            .onSecondCall()
            .callsArgWith(2, {
                value: [{
                    equipmentId: "EQ1",
                    classDetails: []
                }]
            });

        this.oController.onPressExportExcel();

        assert.ok(this.oController.formatter.formatDates.calledOnce, "Date formatter called for exported row");
    });

    /**
     * Should export even when no records are returned
     */
    QUnit.test("Should export when count is zero", function (assert) {

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "0");

        this.oController.onPressExportExcel();

        assert.ok(this.oController.fnExportTableDataToExcel.calledOnce, "Export triggered for zero records");
    });

    /**
     * Should build export column from value-based export settings
     */
    QUnit.test("Should build column from value configuration", function (assert) {

        var aCols;

        this.oColumn.getAggregation.returns({
            data: sinon.stub().returns({
                value: "equipmentId",
                i18n: "Equipment ID"
            })
        });

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "0");

        this.oController.fnExportTableDataToExcel = function (sId, sFile, fnCustomExport) {
            fnCustomExport(function (aRows, aExportCols) {
                aCols = aExportCols;
            });
        };

        this.oController.onPressExportExcel();

        assert.strictEqual(aCols[0].label, "Equipment ID", "Column label derived from export configuration");
    });

    /**
     * Should skip columns without export settings
     */
    QUnit.test("Should skip column when exportSettings missing", function (assert) {

        var aCols;

        this.oColumn.getAggregation.returns({
            data: sinon.stub().returns(undefined)
        });

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "0");

        this.oController.fnExportTableDataToExcel = function (sId, sFile, fnCb) {
            fnCb(function (aRows, aExportCols) {
                aCols = aExportCols;
            });
        };

        this.oController.onPressExportExcel();

        assert.strictEqual(aCols.length, 0, "Column without export settings skipped");
    });

    /**
     * Should resolve value-based column label from i18n key
     */
    QUnit.test("Should translate value column label from i18n key", function (assert) {

        var aCols;

        this.oColumn.getAggregation.returns({
            data: sinon.stub().returns({
                value: "equipmentId",
                i18n: "equipment.id"
            })
        });

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "0");

        this.oController.fnExportTableDataToExcel = function (sId, sFile, fnCb) {
            fnCb(function (aRows, aExportCols) {
                aCols = aExportCols;
            });
        };

        this.oController.onPressExportExcel();

        assert.strictEqual(aCols[0].label, "Translated Text", "Value-based column label resolved from i18n key");
    });

    /**
     * Should continue export when table is unavailable
     */
    QUnit.test("Should export when table is unavailable", function (assert) {

        this.oView.byId.returns(null);

        this.oController.commonDataSource.fnMakeGetRequest
            .onFirstCall()
            .callsArgWith(2, "0");

        this.oController.onPressExportExcel();

        assert.ok(this.oController.fnExportTableDataToExcel.calledOnce, "Export executed without table columns");
    });

    /**
     * Should fall back to legacy export when feature flag is not set
     */
    QUnit.test("Should call legacy fnExportTableDatatoExcel when feature flag is off", function (assert) {

        this.oFeatureFlagModel.setProperty("/metadata/featureFlag/equipmentExcelExportEnhancements", "0");
        this.oController.fnExportTableDatatoExcel = sinon.spy();

        this.oController.onPressExportExcel();

        assert.ok(this.oController.fnExportTableDatatoExcel.calledOnce, "Legacy export triggered when feature flag is '0'");
        assert.ok(this.oController.fnExportTableDataToExcel.notCalled, "Enhanced export NOT called when feature flag is '0'");
    });

    /**
     * Should fall back to legacy export when feature flag is absent (undefined)
     */
    QUnit.test("Should call legacy fnExportTableDatatoExcel when feature flag is absent", function (assert) {

        this.oFeatureFlagModel.setProperty("/metadata/featureFlag/equipmentExcelExportEnhancements", undefined);
        this.oController.fnExportTableDatatoExcel = sinon.spy();

        this.oController.onPressExportExcel();

        assert.ok(this.oController.fnExportTableDatatoExcel.calledOnce, "Legacy export triggered when feature flag is absent");
        assert.ok(this.oController.fnExportTableDataToExcel.notCalled, "Enhanced export NOT called when feature flag is absent");
    });

    /**
     * Should use sTableVisibleId as table id when falling back to legacy export
     */
    QUnit.test("Should pass sTableVisibleId to legacy export when feature flag is off", function (assert) {

        this.oFeatureFlagModel.setProperty("/metadata/featureFlag/equipmentExcelExportEnhancements", "0");
        this.oController.fnExportTableDatatoExcel = sinon.spy();

        this.oController.onPressExportExcel();

        var sFirstArg = this.oController.fnExportTableDatatoExcel.getCall(0).args[0];
        assert.strictEqual(sFirstArg, "idEquipmentListMTable", "Legacy export receives the correct table id");
    });


});