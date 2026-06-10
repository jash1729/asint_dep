sap.ui.define([
    "comasintaismicml/cml/controller/detail/CMLDetailTabs",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (CMLDetailTabsController, sinon) {
    "use strict";

    QUnit.module("fnReturnProperDataSourceValue", {
        /**
         * 
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();
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
    QUnit.test("Should format numericflexible field using fnToHandlePrecisionScale", function (assert) {

        var done = assert.async();

        var oPrecisionStub = sinon.stub(this.oController, "fnToHandlePrecisionScale")
            .returns("formattedValue");

        sinon.stub(this.oController, "fnUoMConvertImperialToMetric")
            .callsArgWith(2, { TEST_FIELD: "123.45" });

        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                selectedCML: { cmlId: "1" },
                UOM: "metric"
            }
        });

        var aDataSourceList = [{
            name: "TEST_FIELD",
            dataType: "numericflexible"
        }];

        var aDataSourceValues = [{
            dataSourcename: "TEST_FIELD",
            dataSourceValue: JSON.stringify({ value: "123.45" }),
            // eslint-disable-next-line camelcase
            cml_ID: "1",
            referenceType: "EQUI"
        }];

        this.oController.fnReturnProperDataSourceValue(
            aDataSourceValues,
            aDataSourceList,
            oModel,
            function (oResult) {

                assert.ok(oPrecisionStub.calledOnce, "fnToHandlePrecisionScale called");
                assert.strictEqual(
                    oResult.TEST_FIELD,
                    "formattedValue",
                    "Formatted value returned"
                );

                done();
            },
            /**
             * 
             */
            function () {
                assert.ok(false, "Error callback should not be called");
                done();
            }
        );
    });

    QUnit.module("fnGetData - objectType change", {
        /**
         * 
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();

            this.oController._oControl = {};
            this.oController._oControl._mModel = new sap.ui.model.json.JSONModel({
                data: {
                    detailPage: {
                        aCMLs: []
                    }
                }
            });

            this.oController._oControl.getView = function () {
                return {
                    /**
                     * 
                     */
                    getModel: function () {
                        return {
                            /**
                             * 
                             */
                            getResourceBundle: function () {
                                return {
                                    /**
                                     * 
                                     */
                                    getText: function () {
                                        return "Error";
                                    }
                                };
                            }
                        };
                    }
                };
            };

            this.oController._oControl.CMLDataSource = {
                /**
                 * 
                 */
                getCMLTemplateDetailById: function (id, fnSuccess) {
                    fnSuccess({
                        name: "Template",
                        // eslint-disable-next-line camelcase
                        to_persona_master: [],
                        // eslint-disable-next-line camelcase
                        to_data_source_config: []
                    });
                }
            };
            this.oController._oControl.fnMessageShow = function () {};
            /**
             * 
             */
            this.oController.fnGetSelectedCMLData = function () {};
        }
    });
    /**
     * 
     */
    QUnit.test("objectType should be Equipment when CMLDetail.objectType is EQUI", function (assert) {
        var oModel = this.oController._oControl._mModel;

        oModel.setProperty("/data/detailPage/aCMLs", [{
            ID: "100",
            name: "CML1",
            displayId: "D100",
            // eslint-disable-next-line camelcase
            to_description: [],
            modifiedAt: "2024",
            objectType: "EQUI",
            cmlTemplateId: "T1",
            "@etag": "111",
            objectId: "OBJ1",
            // eslint-disable-next-line camelcase
            to_values: []
        }]);

        this.oController.fnGetData({ locationId: "100" });

        var sType = oModel.getProperty("/data/selectedCML/objectType");
        assert.strictEqual(sType, "Equipment");
    });

    /**
     *
     */
    QUnit.test("objectType should be Functional Location when CMLDetail.objectType is FLOC", function (assert) {
        var oModel = this.oController._oControl._mModel;

        oModel.setProperty("/data/detailPage/aCMLs", [{
            ID: "200",
            name: "CML2",
            displayId: "D200",
            // eslint-disable-next-line camelcase
            to_description: [],
            modifiedAt: "2024",
            objectType: "FLOC",
            cmlTemplateId: "T2",
            "@etag": "222",
            objectId: "OBJ2",
            // eslint-disable-next-line camelcase
            to_values: []
        }]);

        this.oController.fnGetData({ locationId: "200" });

        var sType = oModel.getProperty("/data/selectedCML/objectType");
        assert.strictEqual(sType, "Functional Location");
    });

    /**
     *
     */
    QUnit.test("should not proceed when objectType is missing", function (assert) {
        var oModel = this.oController._oControl._mModel;
        var bMessageShown = false;

        this.oController._oControl.fnMessageShow = function (sType) {
            if (sType === "E") {
                bMessageShown = true;
            }
        };

        oModel.setProperty("/data/detailPage/aCMLs", [{
            ID: "300",
            name: "CML3",
            displayId: "D300",
            // eslint-disable-next-line camelcase
            to_description: [],
            modifiedAt: "2024",
            objectType: "",       
            cmlTemplateId: "T3",
            "@etag": "333",
            objectId: "OBJ3",
            // eslint-disable-next-line camelcase
            to_values: []
        }]);

        this.oController.fnGetData({ locationId: "300" });

        assert.ok(bMessageShown, "Error message should be shown for missing objectType");
        assert.notOk(oModel.getProperty("/data/selectedCML/objectType"), "selectedCML should not be set");
    });

    /**
     *
     */
    QUnit.test("should not proceed when objectType is invalid", function (assert) {
        var oModel = this.oController._oControl._mModel;
        var bMessageShown = false;

        this.oController._oControl.fnMessageShow = function (sType) {
            if (sType === "E") {
                bMessageShown = true;
            }
        };

        oModel.setProperty("/data/detailPage/aCMLs", [{
            ID: "400",
            name: "CML4",
            displayId: "D400",
            // eslint-disable-next-line camelcase
            to_description: [],
            modifiedAt: "2024",
            objectType: "INVALID",
            cmlTemplateId: "T4",
            "@etag": "444",
            objectId: "OBJ4",
            // eslint-disable-next-line camelcase
            to_values: []
        }]);

        this.oController.fnGetData({ locationId: "400" });

        assert.ok(bMessageShown, "Error message should be shown for invalid objectType");
        assert.notOk(oModel.getProperty("/data/selectedCML/objectType"), "selectedCML should not be set");
    });

    /**
     *
     */
    QUnit.test("should not proceed when CML detail is not found", function (assert) {
        var oModel = this.oController._oControl._mModel;
        var bMessageShown = false;

        this.oController._oControl.fnMessageShow = function (sType) {
            if (sType === "E") {
                bMessageShown = true;
            }
        };
        oModel.setProperty("/data/detailPage/aCMLs", []);

        this.oController.fnGetData({ locationId: "999" });

        assert.ok(bMessageShown, "Error message should be shown when CML detail is not found");
        assert.notOk(oModel.getProperty("/data/selectedCML/objectType"), "selectedCML should not be set");
    });

    /**
    * fnAssignOutPutValues: when value is already a Date object, should use it directly and NOT call normalizeDate
    */
    QUnit.module("CMLDetailTabs - fnAssignOutPutValues", {
        /**
         * setup
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();
        },
        /**
         * cleanup
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     * when value is already a Date object, it should be used directly without calling normalizeDate
     */
    QUnit.test("Should use Date object directly and NOT call normalizeDate when value is instanceof Date", function (assert) {

        var oDateValue = new Date(2026, 2, 1);
        var oNormalizeSpy = sinon.spy(this.oController, "normalizeDate");

        var tempValue = (oDateValue instanceof Date) ? oDateValue : this.oController.normalizeDate(oDateValue);

        assert.ok(oNormalizeSpy.notCalled, "normalizeDate should not be called when value is already a Date");
        assert.strictEqual(tempValue, oDateValue, "Should return the same Date object");
    });

    /**
     * when value is an ISO string, should call normalizeDate to convert it to Date object and return correct local date without timezone shift
     */
    QUnit.test("Should call normalizeDate for ISO string and return correct local date without timezone shift", function (assert) {

        var sISOValue = "2026-03-01T18:30:00.000Z";
        var oNormalizeSpy = sinon.spy(this.oController, "normalizeDate");

        var tempValue = (sISOValue instanceof Date) ? sISOValue : this.oController.normalizeDate(sISOValue);

        assert.ok(oNormalizeSpy.calledOnce, "normalizeDate should be called for string input");
        assert.strictEqual(tempValue.getDate(), 1, "Day should be 1 - no timezone shift");
        assert.strictEqual(tempValue.getMonth(), 2, "Month should be March");
        assert.strictEqual(tempValue.getFullYear(), 2026, "Year should be 2026");
    });

    /**
     * when value is a simple YYYY-MM-DD string, should call normalizeDate to convert it to Date object and return correct local date
     */
    QUnit.test("Should call normalizeDate for YYYY-MM-DD string and return correct Date", function (assert) {

        var sDateValue = "2026-03-01";
        var oNormalizeSpy = sinon.spy(this.oController, "normalizeDate");

        var tempValue = (sDateValue instanceof Date) ? sDateValue : this.oController.normalizeDate(sDateValue);

        assert.ok(oNormalizeSpy.calledOnce, "normalizeDate should be called");
        assert.ok(tempValue instanceof Date, "Result should be a Date object");
        assert.strictEqual(tempValue.getDate(), 1, "Day should be 1");
        assert.strictEqual(tempValue.getFullYear(), 2026, "Year should be 2026");
    });

    /**
     * null value should not crash and should return empty string
     */
    QUnit.test("Should not crash when value is null", function (assert) {

        var tempValue = (null instanceof Date) ? null : this.oController.normalizeDate(null);

        assert.strictEqual(tempValue, "", "null should return empty string and not throw an error");
    });

    /**
     * undefined value should also not crash
     */
    QUnit.test("Should not crash when value is undefined", function (assert) {

        var oValue = undefined;

        var tempValue = (oValue instanceof Date) ? oValue : this.oController.normalizeDate(oValue);

        assert.strictEqual(tempValue, "", "undefined should return empty string and not throw an error");
    });

    /**
     * undefined value should also not crash
     */
    QUnit.test("Should not crash when value is undefined", function (assert) {

        var oValue = undefined;

        var tempValue = (oValue instanceof Date) ? oValue : this.oController.normalizeDate(oValue);

        assert.strictEqual(tempValue, "", "undefined should return empty string and not throw an error");
    });

    /**
     * when value is a number, it should not be treated as a Date and should return empty string from normalizeDate without crashing
     */
    QUnit.test("Should not treat a number as a Date and return empty string for it", function (assert) {

        var nValue = 12345;

        var tempValue = (nValue instanceof Date) ? nValue : this.oController.normalizeDate(nValue);

        assert.strictEqual(tempValue, "", "Number should not pass instanceof Date and normalizeDate returns empty string");
    });

    QUnit.module("CMLDetailTabs - fnCalculate", {
        /**
         *
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();

            this.oCommonCMLModel = {
                /**
                 * 
                 */
                getProperty: function () {
                    return [{ publishSequence: "1" }];
                },
                /**
                 * 
                 */
                setProperty: function () {}
            };

            this.oMessageBundle = {
                /**
                 * 
                 */
                getText: function (sKey) {
                    var oMessages = {
                        "CML.MESSAGE038": "Calculation already in progress for the selected CMLs",
                        "CML.MESSAGE004": "Error Message"
                    };
                    return oMessages[sKey];
                }
            };

            this.oController._oControl = {
                /**
                 * 
                 */
                fnMessageShow: function () {}
            };

            /**
             * 
             */
            this.oController.fnReturnObjectForApi = function () {
                return { api: "testApi", payload: {} };
            };

            /**
             * 
             */
            this.oController.fnCallSequenceOfAPI = function (oData, fnSuccess) {
                fnSuccess(null);
            };
            /**
             * 
             */
            this.oController.fnAssignOutPutValues = function () {};
            /**
             * 
             */
            this.oController.formatHistoryReadingsforVisualization = function () {};
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
    QUnit.test("Should show MESSAGE038 with type 'I' when response is 'CML Calculation already in progress'", function (assert) {
        var aMessageShowCalls = [];

        this.oController._oControl.fnMessageShow = function (sType, sMessage) {
            aMessageShowCalls.push({ type: sType, message: sMessage });
        };

        this.oController.fnCallSequenceOfAPI = function (oData, fnSuccess) {
            fnSuccess("CML Calculation already in progress");
        };

        this.oController.fnCalculate(0, this.oCommonCMLModel, this.oMessageBundle, "level1");

        assert.ok(
            aMessageShowCalls.some(function (oCall) {
                return oCall.type === "I" && oCall.message === "Calculation already in progress for the selected CMLs";
            }),
            "Should show MESSAGE038 with type 'I'"
        );
    });

    /**
     * 
     */
    QUnit.test("Should NOT call fnAssignOutPutValues when response is 'CML Calculation already in progress'", function (assert) {
        var bAssignOutputCalled = false;

        this.oController.fnCallSequenceOfAPI = function (oData, fnSuccess) {
            fnSuccess("CML Calculation already in progress");
        };

        this.oController.fnAssignOutPutValues = function () {
            bAssignOutputCalled = true;
        };

        this.oController.fnCalculate(0, this.oCommonCMLModel, this.oMessageBundle, "level1");

        assert.notOk(bAssignOutputCalled, "Should NOT call fnAssignOutPutValues due to early return");
    });

    /**
     * 
     */
    QUnit.test("Should NOT show MESSAGE038 when response is partial match 'CML Calculation'", function (assert) {
        var aMessageShowCalls = [];

        this.oController._oControl.fnMessageShow = function (sType, sMessage) {
            aMessageShowCalls.push({ type: sType, message: sMessage });
        };

        this.oController.fnCallSequenceOfAPI = function (oData, fnSuccess) {
            fnSuccess("CML Calculation");
        };

        this.oController.fnAssignOutPutValues = function (oDataRet, iCounter, oModel, fnCallback) {
            fnCallback();
        };

        this.oController.fnCalculate(0, this.oCommonCMLModel, this.oMessageBundle, "level1");

        assert.notOk(
            aMessageShowCalls.some(function (oCall) {
                return oCall.message === "Calculation already in progress for the selected CMLs";
            }),
            "Should NOT show MESSAGE038 for partial match"
        );
    });

    /**
     * 
     */
    QUnit.test("Should NOT show MESSAGE038 when response is null", function (assert) {
        var aMessageShowCalls = [];

        this.oController._oControl.fnMessageShow = function (sType, sMessage) {
            aMessageShowCalls.push({ type: sType, message: sMessage });
        };

        /**
         * 
         */
        this.oController.fnCallSequenceOfAPI = function (oData, fnSuccess) {
            fnSuccess(null);
        };

        /**
         * 
         */
        this.oController.fnAssignOutPutValues = function (oDataRet, iCounter, oModel, fnCallback) {
            fnCallback();
        };

        this.oController.fnCalculate(0, this.oCommonCMLModel, this.oMessageBundle, "level1");

        assert.notOk(
            /**
             * 
             */
            aMessageShowCalls.some(function (oCall) {
                return oCall.message === "Calculation already in progress for the selected CMLs";
            }),
            "Should NOT show MESSAGE038 when response is null"
        );
    });

    QUnit.module("fnUoMConvertMetricToImperial - dataType condition", {
        /**
         * before each
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();

            this.aDataSourceList = [
                {
                    name: "TMIN_OVERRIDE",
                    active: true,
                    dataType: "numericflexible",
                    decimalPlacesAllowed: "4",
                    description: "Tmin Override",
                    dimension: "Length",
                    totalLengthOfNum: "10",
                    uomImperial: "IN",
                    uomMetric: "MM"
                },
                {
                    name: "TMAX_OVERRIDE",
                    active: true,
                    dataType: "numeric",
                    decimalPlacesAllowed: "4",
                    description: "Tmax Override",
                    dimension: "Length",
                    totalLengthOfNum: "10",
                    uomImperial: "IN",
                    uomMetric: "MM"
                },
                {
                    name: "DESCRIPTION",
                    active: true,
                    dataType: "text",
                    description: "Description",
                    uomImperial: "",
                    uomMetric: ""
                }
            ];

            this.oCommonCMLModel = {
                getProperty: sinon.stub().returns(this.aDataSourceList)
            };

            /**
             *
             */
            this.fnUoMConvertStub = sinon.stub(this.oController, "fnUoMConvert", function (aConversionData, fnSuccess) {
                /**
                 *
                 */
                var aResult = aConversionData.map(function (oItem) {
                    return {
                        key: oItem.key,
                        srcValue: oItem.srcValue,
                        tgtValue: "converted_" + oItem.srcValue
                    };
                });
                fnSuccess(aResult);
            });
        },
        /**
         * after each
         */
        afterEach: function () {
            this.fnUoMConvertStub.restore();
        }
    });

    /**
     * Test 1: string value with dataType "numericflexible" should be included in conversion
     */
    QUnit.test("Should include field in conversion when value is string and dataType is numericflexible", function (assert) {
        var done = assert.async();

        var oMetricData = {
            TMIN_OVERRIDE: "8"
        };

        this.oController.fnUoMConvertMetricToImperial(
            this.oCommonCMLModel,
            oMetricData,
            /**
             *
             */
            function (oResult) {
                assert.ok(true, "fnSuccess was called");
                assert.strictEqual(oResult.TMIN_OVERRIDE, "converted_8", "String value with numericflexible dataType should be converted");
                done();
            },
            /**
             *
             */
            function () {
                assert.ok(false, "fnError should not be called");
                done();
            }
        );
    });

    /**
     * Test 2: string value with dataType "numeric" should be included in conversion
     */
    QUnit.test("Should include field in conversion when value is string and dataType is numeric", function (assert) {
        var done = assert.async();

        var oMetricData = {
            TMAX_OVERRIDE: "10"
        };

        this.oController.fnUoMConvertMetricToImperial(
            this.oCommonCMLModel,
            oMetricData,
            /**
             *
             */
            function (oResult) {
                assert.ok(true, "fnSuccess was called");
                assert.strictEqual(oResult.TMAX_OVERRIDE, "converted_10", "String value with numeric dataType should be converted");
                done();
            },
            /**
             *
             */
            function () {
                assert.ok(false, "fnError should not be called");
                done();
            }
        );
    });

    /**
     * Test 3: string value with dataType "text" should NOT be included in conversion
     */
    QUnit.test("Should NOT include field in conversion when value is string and dataType is text", function (assert) {
        var done = assert.async();

        var oMetricData = {
            DESCRIPTION: "some text"
        };

        this.oController.fnUoMConvertMetricToImperial(
            this.oCommonCMLModel,
            oMetricData,
            /**
             *
             */
            function (oResult) {
                assert.ok(true, "fnSuccess was called");
                assert.strictEqual(oResult.DESCRIPTION, "some text", "Text dataType field should NOT be converted");
                done();
            },
            /**
             *
             */
            function () {
                assert.ok(false, "fnError should not be called");
                done();
            }
        );
    });

    /**
     * Test 4: number value should still work as before (original condition)
     */
    QUnit.test("Should include field in conversion when value is a number type", function (assert) {
        var done = assert.async();

        var oMetricData = {
            TMIN_OVERRIDE: 8
        };

        this.oController.fnUoMConvertMetricToImperial(
            this.oCommonCMLModel,
            oMetricData,
            /**
             *
             */
            function () {
                assert.ok(true, "fnSuccess was called");
                assert.ok(this.fnUoMConvertStub.calledOnce, "fnUoMConvert was called with number type value");
                assert.strictEqual(this.fnUoMConvertStub.args[0][0][0].srcValue, "8", "srcValue should be stringified number");
                done();
            }.bind(this),
            /**
             *
             */
            function () {
                assert.ok(false, "fnError should not be called");
                done();
            }
        );
    });

    /**
     * Test 5: Should NOT convert empty string value even if dataType is numericflexible
     */
    QUnit.test("Should NOT convert empty string value even if dataType is numericflexible", function (assert) {
        var done = assert.async();

        var oMetricData = {
            TMIN_OVERRIDE: ""
        };

        this.oController.fnUoMConvertMetricToImperial(
            this.oCommonCMLModel,
            oMetricData,
            /**
             *
             */
            function (oResult) {
                assert.ok(true, "fnSuccess was called");
                assert.strictEqual(this.fnUoMConvertStub.args[0][0].length, 0, "fnUoMConvert should be called with empty conversion array for empty string value");
                assert.strictEqual(oResult.TMIN_OVERRIDE, "", "Empty string value should NOT be converted");
                done();
            }.bind(this),
            /**
             *
             */
            function () {
                assert.ok(false, "fnError should not be called");
                done();
            }
        );
    });

    QUnit.module("fnReturnProperDataSourceValue - numericflexible UOM tests added condition for imperial", {
        /**
         * Before Each
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();
            this.oController.fnToHandlePrecisionScale = sinon.stub().returns(0.313);
            this.oController.normalizeDate = sinon.stub().returns("2024-01-01");

            this.oController.fnToReturnValueOfType = sinon.stub().returns(null);
            this.oController.fnUoMConvertImperialToMetric = function (oModel, oData, fnSuccess) {
                fnSuccess(oData);
            };

            this.aDataSourceList = [
                {
                    name: "Measurements",
                    dataType: "table",
                    tableCols: [
                        { name: "thickness", dataType: "numericflexible", precision: 5, scale: 3 },
                        { name: "length", dataType: "numeric" }
                    ]
                },
                {
                    name: "WallThickness",
                    dataType: "numericflexible",
                    precision: 5,
                    scale: 3
                }
            ];

            this.oImperialCMLModel = {
                /**
                 * 
                 */
                getProperty: function (sPath) {
                    if (sPath === "/data/selectedCML") return { cmlId: "CML_001" };
                    if (sPath === "/data/UOM") return "imperial";
                },
                /**
                 *
                 */
                setProperty: function () {}
            };

            this.oMetricCMLModel = {
                /**
                 *
                 */
                getProperty: function (sPath) {
                    if (sPath === "/data/selectedCML") return { cmlId: "CML_001" };
                    if (sPath === "/data/UOM") return "metric";
                },
                /**
                 * 
                 */
                setProperty: function () {}
            };
        },

        /**
         * 
         */
        afterEach: function () {
            sinon.restore();
        }
    });


    QUnit.test("Table field - Imperial: fnToHandlePrecisionScale SHOULD be called for numericflexible", function (assert) {
        var done = assert.async();

        var aDataSourceValues = [{
            dataSourcename: "Measurements",
            dataSourceValue: JSON.stringify({ value: { thickness: "0.3125272", length: "10" } }),
            referenceType: "EQUI",
            // eslint-disable-next-line camelcase
            cml_ID: "CML_001",
            ID: "1"
        }];

        this.oController.fnReturnProperDataSourceValue(
            aDataSourceValues,
            this.aDataSourceList,
            this.oImperialCMLModel,
            function (oResult) {
                assert.ok(
                    this.oController.fnToHandlePrecisionScale.called,
                    "fnToHandlePrecisionScale should be called for imperial table field"
                );
                assert.strictEqual(
                    oResult.Measurements[0].thickness,
                    0.313,
                    "Thickness should be truncated to 3 decimal places in imperial"
                );
                done();
            }.bind(this),
            function () { assert.ok(false, "Should not reach error"); done(); }
        );
    });

    QUnit.test("Table field - Metric: fnToHandlePrecisionScale should NOT be called inside doThisOperation", function (assert) {
        var done = assert.async();

        var aDataSourceValues = [{
            dataSourcename: "Measurements",
            dataSourceValue: JSON.stringify({ value: { thickness: "0.3125272", length: "10" } }),
            referenceType: "EQUI",
            // eslint-disable-next-line camelcase
            cml_ID: "CML_001",
            ID: "1"
        }];

        var callCountAfterDoThis = 0;
        var oController = this.oController;

        oController.fnUoMConvertImperialToMetric = function (oModel, oData, fnSuccess) {
            callCountAfterDoThis = oController.fnToHandlePrecisionScale.callCount;
            fnSuccess(oData);
        };

        oController.fnReturnProperDataSourceValue(
            aDataSourceValues,
            this.aDataSourceList,
            this.oMetricCMLModel,
            function () {
                assert.strictEqual(
                    callCountAfterDoThis,
                    0,
                    "fnToHandlePrecisionScale should NOT be called inside doThisOperation for metric"
                );
                done();
            },
            function () { assert.ok(false, "Should not reach error"); done(); }
        );
    });


    QUnit.test("Scalar field - Imperial: fnToHandlePrecisionScale SHOULD be called for numericflexible", function (assert) {
        var done = assert.async();

        var aDataSourceValues = [{
            dataSourcename: "WallThickness",
            dataSourceValue: JSON.stringify({ value: "0.3125272" }),
            referenceType: "EQUI",
            // eslint-disable-next-line camelcase
            cml_ID: "CML_001",
            ID: "2"
        }];

        this.oController.fnReturnProperDataSourceValue(
            aDataSourceValues,
            this.aDataSourceList,
            this.oImperialCMLModel,
            function (oResult) {
                assert.ok(
                    this.oController.fnToHandlePrecisionScale.called,
                    "fnToHandlePrecisionScale should be called for imperial scalar field"
                );
                assert.strictEqual(
                    oResult.WallThickness,
                    0.313,
                    "WallThickness should be truncated in imperial"
                );
                done();
            }.bind(this),
            function () { assert.ok(false, "Should not reach error"); done(); }
        );
    });

    QUnit.test("Scalar field - Metric: raw full precision value should be passed to conversion", function (assert) {
        var done = assert.async();

        var aDataSourceValues = [{
            dataSourcename: "WallThickness",
            dataSourceValue: JSON.stringify({ value: "0.3125272" }),
            referenceType: "EQUI",
            // eslint-disable-next-line camelcase
            cml_ID: "CML_001",
            ID: "2"
        }];

        var rawValuePassedToConvert;

        this.oController.fnUoMConvertImperialToMetric = function (oModel, oData, fnSuccess) {
            rawValuePassedToConvert = oData.WallThickness;
            fnSuccess(oData);
        };

        this.oController.fnReturnProperDataSourceValue(
            aDataSourceValues,
            this.aDataSourceList,
            this.oMetricCMLModel,
            function () {
                assert.strictEqual(
                    rawValuePassedToConvert,
                    "0.3125272",
                    "Full precision raw value should be passed to conversion function in metric"
                );
                done();
            },
            function () { assert.ok(false, "Should not reach error"); done(); }
        );
    });

    QUnit.module("fnUoMConvertImperialToMetric", {
        /**
         * beforeeach
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();

            this.oCommonCMLModel = {
                /**
                 *
                 */
                getProperty: function () {
                    return [
                        {
                            name: "THICKNESS",
                            dataType: "numeric",
                            uomImperial: "IN",
                            uomMetric: "MM"
                        },
                        {
                            name: "CORROSION_RATE",
                            dataType: "numericflexible",
                            uomImperial: "IN",
                            uomMetric: "MM"
                        },
                        {
                            name: "LOCATION_DESC",
                            dataType: "text",
                            uomImperial: "IN",
                            uomMetric: "MM"
                        },
                        {
                            name: "REMAINING_LIFE",
                            dataType: "numeric",
                            uomImperial: "IN",
                            uomMetric: "MM"
                        },
                        {
                            name: "READINGS",
                            dataType: "table",
                            tableCols: [
                                { name: "WALL_THICKNESS", dataType: "numeric", uomImperial: "IN", uomMetric: "MM" },
                                { name: "CORROSION",      dataType: "numericflexible", uomImperial: "IN", uomMetric: "MM" },
                                { name: "NOTES",          dataType: "text", uomImperial: "IN", uomMetric: "MM" },
                                { name: "DATE",           dataType: "numeric", uomImperial: "IN", uomMetric: "MM" },
                                { name: "HALF_LIFE",      dataType: "numeric", uomImperial: "IN", uomMetric: "MM" }
                            ]
                        }
                    ];
                }
            };

            this.oController.fnUoMConvert = sinon.stub();
        },
        /**
         * after each
         */
        afterEach: function () {
            sinon.restore();
        }
    });


    QUnit.test("should add numeric field with valid number value to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { THICKNESS: 0.5 },
            function () {
                assert.equal(aCaptured.length, 1, "One item pushed to payload");
                assert.equal(aCaptured[0].key, "THICKNESS", "Key is correct");
                assert.equal(aCaptured[0].srcValue, "0.5", "srcValue is stringified");
                assert.equal(aCaptured[0].src, "IN", "src UOM correct");
                assert.equal(aCaptured[0].tgt, "MM", "tgt UOM correct");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should add numeric string value to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { THICKNESS: "12.2343" },
            function () {
                assert.equal(aCaptured.length, 1, "Numeric string included in payload");
                assert.equal(aCaptured[0].srcValue, "12.2343", "srcValue matches string value");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should add READINGS numeric field to payload with correct key", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { READINGS: [{ WALL_THICKNESS: 0.3 }] },
            function () {
                assert.equal(aCaptured.length, 1, "One reading item in payload");
                assert.equal(aCaptured[0].key, "WALL_THICKNESS%0", "Key has correct idx suffix");
                assert.equal(aCaptured[0].srcValue, "0.3", "srcValue correct");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should add READINGS numeric string value to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { READINGS: [{ CORROSION: "5.678" }] },
            function () {
                assert.equal(aCaptured.length, 1, "Numeric string in READINGS included");
                assert.equal(aCaptured[0].srcValue, "5.678", "srcValue matches");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should write back tgtValue to oImperialData after conversion", function (assert) {
        var done = assert.async();

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            fnSuccess([{ key: "THICKNESS", srcValue: "0.5", tgtValue: 12.7 }]);
        };

        var oData = { THICKNESS: 0.5 };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            oData,
            function (oResult) {
                assert.equal(oResult.THICKNESS, 12.7, "tgtValue written back correctly");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should write back tgtValue to READINGS after conversion", function (assert) {
        var done = assert.async();

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            fnSuccess([{ key: "WALL_THICKNESS%0", srcValue: "0.3", tgtValue: 7.62 }]);
        };

        var oData = { READINGS: [{ WALL_THICKNESS: 0.3 }] };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            oData,
            function (oResult) {
                assert.equal(oResult.READINGS[0].WALL_THICKNESS, 7.62, "READINGS tgtValue written back");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should NOT add field with non-numeric dataType to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { LOCATION_DESC: 100 },
            function () {
                assert.equal(aCaptured.length, 0, "Text dataType field excluded from payload");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should NOT add non-numeric string value to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { THICKNESS: "abc" },
            function () {
                assert.equal(aCaptured.length, 0, "Non-numeric string excluded");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });


    QUnit.test("should NOT add Infinity value to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { THICKNESS: Infinity },
            function () {
                assert.equal(aCaptured.length, 0, "Infinity excluded from payload");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should NOT add -Infinity value to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { THICKNESS: -Infinity },
            function () {
                assert.equal(aCaptured.length, 0, "-Infinity excluded from payload");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });

    QUnit.test("should NOT add string '-Infinity' to payload", function (assert) {
        var done = assert.async();
        var aCaptured = [];

        this.oController.fnUoMConvert = function (aConversionData, fnSuccess) {
            aCaptured = aConversionData;
            fnSuccess([]);
        };

        this.oController.fnUoMConvertImperialToMetric(
            this.oCommonCMLModel,
            { THICKNESS: "-Infinity" },
            function () {
                assert.equal(aCaptured.length, 0, "String '-Infinity' excluded from payload");
                done();
            },
            function () { assert.ok(false, "Should not call error"); done(); }
        );
    });
    /**
     *
     */
    QUnit.module("fnShowTableData", {
        /**
         *
         */
        beforeEach: function () {
            this.oController = new CMLDetailTabsController();

            var oUoMStub = sinon.stub(this.oController, "fnUoMConvert");
            oUoMStub.callsArgWith(1, []);
            this.fnUoMConvertStub = oUoMStub;

            this.fnPrecisionStub = sinon.stub(this.oController, "fnToHandlePrecisionScale").returns(0.500);

            sinon.stub(this.oController, "fnReturnProperValueForTableData").returns("0.5");

            this.oController._oControl = {
                fnMessageShow: sinon.stub()
            };
        },

        /**
         *
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    var aRefListForShowTable = [
        {
            name: "REF1",
            tableCols: [
                {
                    name: "thickness",
                    dataType: "numericflexible",
                    dimension: true,
                    uomImperial: "in",
                    uomMetric: "mm",
                    precision: 5,
                    scale: 3
                },
                {
                    name: "readDate",
                    dataType: "date",
                    dimension: false
                }
            ]
        }
    ];

    var oParameterForShowTable = {
        dataSourceReferenceType: "R",
        dataSourceReferenceName: "REF1",
        tableCols: [
            { dataSourceReferenceColName: "thickness", apiParameter: "thickness" },
            { dataSourceReferenceColName: "readDate", apiParameter: "readDate" }
        ]
    };
    
    /**
     *
     */
    function buildShowTableModel(sUom, aReadings) {
        var oProps = {
            "/data/UOM": sUom,
            "/data/CMLTabSection/Detail/LocationPersonaData/referenceList": aRefListForShowTable,
            "/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList": [],
            "/data/CMLTabSection/LocationData/DataSource/READINGS": aReadings || []
        };

        return {
            /**
             *
             */
            getProperty: function (sPath) {
                return oProps[sPath];
            },

            /** 
             * 
            */
            setProperty: function (sPath, oVal) {
                oProps[sPath] = oVal;
            },

            /**
             *
             */
            _getAll: function () {
                return oProps;
            }
        };
    }

    /**
     * Imperial: setProperty is called with calculated dataset
     */
    QUnit.test("Imperial: setProperty is called with calculated dataset", function (assert) {
        var oModel = buildShowTableModel("imperial");

        this.oController.fnShowTableData(
            [{ dataId: "d1", thickness: "0.5", readDate: "2024-01-01" }],
            oParameterForShowTable,
            {},
            oModel
        );

        var aResult = oModel.getProperty("/data/CMLTabSection/LocationData/Reference/REF1");

        assert.ok(Array.isArray(aResult), "setProperty was called and stored an array");
        assert.strictEqual(aResult.length, 1, "One row saved for imperial");
    });

    /**
     * Metric: setProperty is called in metric path
     */
    QUnit.test("Metric: setProperty IS called (was skipped in old code)", function (assert) {
        var oModel = buildShowTableModel("metric");
        var bSetPropertyCalled = false;

        var fnOrigSet = oModel.setProperty.bind(oModel);

        oModel.setProperty = function (sPath, oVal) {
            if (sPath.indexOf("LocationData") !== -1) {
                bSetPropertyCalled = true;
            }

            fnOrigSet(sPath, oVal);
        };

        var oNoDimParam = {
            dataSourceReferenceType: "R",
            dataSourceReferenceName: "REF1",
            tableCols: [
                {
                    dataSourceReferenceColName: "readDate",
                    apiParameter: "readDate"
                }
            ]
        };

        this.oController.fnShowTableData(
            [{ dataId: "d1", readDate: "2024-01-01" }],
            oNoDimParam,
            {},
            oModel
        );

        assert.ok(bSetPropertyCalled, "setProperty must be called for metric UOM");
    });

    /**
     * Metric: fnUoMConvert is called for dimension columns
     */
    QUnit.test("Metric: fnUoMConvert is called for dimension columns", function (assert) {
        var oModel = buildShowTableModel("metric");

        this.oController.fnUoMConvert.restore();

        sinon.stub(this.oController, "fnUoMConvert").callsArgWith(1, []);

        var oNewStub = this.oController.fnUoMConvert;

        this.oController.fnShowTableData(
            [{ dataId: "d1", thickness: "0.5", readDate: "2024-01-01" }],
            oParameterForShowTable,
            {},
            oModel
        );

        assert.ok(oNewStub.calledOnce, "fnUoMConvert should be called in metric path");

        var aCapturedPayload = oNewStub.args[0][0];

        assert.ok(
            aCapturedPayload.some(function (o) {
                return o.src === "in" && o.tgt === "mm";
            }),
            "Conversion payload should contain imperial→metric direction"
        );
    });

    /**
     * Metric: fnToHandlePrecisionScale is called after UOM conversion
     */
    QUnit.test("Metric: fnToHandlePrecisionScale is called after UOM conversion (new fnFormatDataSet)", function (assert) {
        var oModel = buildShowTableModel("metric");

        this.oController.fnUoMConvert.restore();

        sinon.stub(this.oController, "fnUoMConvert").callsArgWith(1, [
            { key: "thickness%0", tgtValue: 12.7 }
        ]);

        this.oController.fnShowTableData(
            [{ dataId: "d1", thickness: "0.5", readDate: "2024-01-01" }],
            oParameterForShowTable,
            {},
            oModel
        );

        assert.ok(
            this.fnPrecisionStub.called,
            "fnToHandlePrecisionScale should be called for numericflexible columns in metric path"
        );
    });

    /**
     * Imperial: fnToHandlePrecisionScale is not called
     */
    QUnit.test("Imperial: fnToHandlePrecisionScale is NOT called (imperial skips fnFormatDataSet)", function (assert) {
        var oModel = buildShowTableModel("imperial");

        this.oController.fnShowTableData(
            [{ dataId: "d1", thickness: "0.5", readDate: "2024-01-01" }],
            oParameterForShowTable,
            {},
            oModel
        );

        assert.notOk(
            this.fnPrecisionStub.called,
            "fnToHandlePrecisionScale should NOT be called in the imperial path"
        );
    });

    /**
     * READINGS are merged into dataset by dataId
     */
    QUnit.test("READINGS are merged into dataset by dataId; calculated values win", function (assert) {
        var aReadings = [
            {
                dataId: "d1",
                inspectorNote: "checked",
                thickness: "OLD_VALUE"
            }
        ];

        var oModel = buildShowTableModel("imperial", aReadings);

        this.oController.fnShowTableData(
            [{ dataId: "d1", thickness: "0.5" }],
            oParameterForShowTable,
            {},
            oModel
        );

        var aResult = oModel.getProperty("/data/CMLTabSection/LocationData/Reference/REF1");

        assert.strictEqual(
            aResult[0].inspectorNote,
            "checked",
            "Extra keys from READINGS should be carried onto the merged row"
        );

        assert.strictEqual(
            aResult[0].thickness,
            "0.5",
            "Calculated dataset value must overwrite the READINGS value for the same key"
        );
    });

    /**
     * Metric with no dimension columns skips fnUoMConvert
     */
    QUnit.test("Metric with no dimension columns: skips fnUoMConvert but still saves to model", function (assert) {
        var oModel = buildShowTableModel("metric");

        var oNoDimParam = {
            dataSourceReferenceType: "R",
            dataSourceReferenceName: "REF1",
            tableCols: [
                {
                    dataSourceReferenceColName: "readDate",
                    apiParameter: "readDate"
                }
            ]
        };

        this.oController.fnShowTableData(
            [{ dataId: "d1", readDate: "2024-01-01" }],
            oNoDimParam,
            {},
            oModel
        );

        assert.notOk(
            this.fnUoMConvertStub.called,
            "fnUoMConvert should NOT be called when no dimension columns exist"
        );

        var aResult = oModel.getProperty("/data/CMLTabSection/LocationData/Reference/REF1");

        assert.ok(
            Array.isArray(aResult) && aResult.length === 1,
            "setProperty still called with the dataset on the metric else-branch"
        );
    });

    /**
     * DataSource type D saves data to DataSource path
     */
    QUnit.test("DataSource type D: setProperty targets the DataSource path", function (assert) {
        var oModel = buildShowTableModel("imperial");

        oModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList").push({
            name: "DS1",
            tableCols: []
        });

        var oDsParam = {
            dataSourceReferenceType: "D",
            dataSourceReferenceName: "DS1",
            tableCols: [
                {
                    dataSourceReferenceColName: "thickness",
                    apiParameter: "thickness"
                }
            ]
        };

        this.oController.fnShowTableData(
            [{ dataId: "d2", thickness: "1.0" }],
            oDsParam,
            {},
            oModel
        );

        var aResult = oModel.getProperty("/data/CMLTabSection/LocationData/DataSource/DS1");

        assert.ok(
            Array.isArray(aResult),
            "setProperty should target the DataSource path for type D parameter"
        );
    });

    /**
     * fnFormatBaselineValue
     */
    QUnit.module("CMLDetailTabs - fnFormatBaselineValue", {

        /**
         * setup
         */
        beforeEach: function () {

            this.oController = new CMLDetailTabsController();

        },

        /**
         * cleanup
         */
        afterEach: function () {

            sinon.restore();

        }

    });

    /**
     * Should return dash for baseline reading zero value
     */
    QUnit.test("Should return dash for baseline reading zero value", function (assert) {

        var sResult =
            this.oController.fnFormatBaselineValue(0, true);

        assert.strictEqual(
            sResult,
            "-",
            "Baseline reading zero value should return dash"
        );

    });

    /**
     * Should return original value for non baseline reading zero
     */
    QUnit.test("Should return original value for non baseline reading zero", function (assert) {

        var sResult =
            this.oController.fnFormatBaselineValue(0, false);

        assert.strictEqual(
            sResult,
            0,
            "Non baseline reading should remain unchanged"
        );

    });

    /**
     * Should return original non zero value
     */
    QUnit.test("Should return original non zero value", function (assert) {

        var sResult =
            this.oController.fnFormatBaselineValue(10, true);

        assert.strictEqual(
            sResult,
            10,
            "Non zero baseline reading should remain unchanged"
        );

    });


    /**
     * fnApplyBaselineReadingDash
     */
    QUnit.module("CMLDetailTabs - fnApplyBaselineReadingDash", {

        /**
         * setup
         */
        beforeEach: function () {

            this.oController = new CMLDetailTabsController();

            /**
             * Mock fnApplyBaselineReadingDash
             *
             * @param {Object} oResult result object
             * @returns {Object} updated result
             */
            this.oController.fnApplyBaselineReadingDash = function (oResult) {

                var aBaselineFields = [
                    "SHORT_TERM_CORROSION_RATE",
                    "LONG_TERM_CORROSION_RATE",
                    "REMAINING_LIFE",
                    "HALF_LIFE"
                ];

                if (
                    oResult["READINGS"] &&
                    Array.isArray(oResult["READINGS"]) &&
                    oResult["READINGS"].length > 1
                ) {

                    var oOldestReading = null;

                    $.each(oResult["READINGS"], function (iIndex, oReading) {

                        if (
                            !oOldestReading ||
                            new Date(oReading.DATE) < new Date(oOldestReading.DATE)
                        ) {
                            oOldestReading = oReading;
                        }

                    });

                    if (oOldestReading) {

                        $.each(aBaselineFields, function (iIndex, sField) {

                            var fValue = Number(oOldestReading[sField]);

                            if (
                                !isNaN(fValue) &&
                                fValue === 0
                            ) {

                                oOldestReading[sField] = "-";
                                oOldestReading["IS_BASELINE_" + sField] = true;

                            }

                        });

                    }

                }

                return oResult;

            };

        },

        /**
         * cleanup
         */
        afterEach: function () {

            sinon.restore();

        }

    });

    /**
     * Should replace baseline reading zero values with dash
     */
    QUnit.test("Should replace baseline reading zero values with dash", function (assert) {

        var oResult = {
            READINGS: [
                {
                    DATE: "2025-04-29",
                    SHORT_TERM_CORROSION_RATE: 1,
                    LONG_TERM_CORROSION_RATE: 1,
                    REMAINING_LIFE: 5,
                    HALF_LIFE: 5
                },
                {
                    DATE: "2025-02-13",
                    SHORT_TERM_CORROSION_RATE: 0,
                    LONG_TERM_CORROSION_RATE: 0,
                    REMAINING_LIFE: 0,
                    HALF_LIFE: 0
                }
            ]
        };

        var oResponse =
            this.oController.fnApplyBaselineReadingDash(oResult);

        assert.strictEqual(
            oResponse.READINGS[1].SHORT_TERM_CORROSION_RATE,
            "-",
            "Should replace short term corrosion rate with dash"
        );

        assert.strictEqual(
            oResponse.READINGS[1].LONG_TERM_CORROSION_RATE,
            "-",
            "Should replace long term corrosion rate with dash"
        );

        assert.strictEqual(
            oResponse.READINGS[1].REMAINING_LIFE,
            "-",
            "Should replace remaining life with dash"
        );

        assert.strictEqual(
            oResponse.READINGS[1].HALF_LIFE,
            "-",
            "Should replace half life with dash"
        );

    });

    /**
     * Should not replace latest reading values
     */
    QUnit.test("Should not replace latest reading values", function (assert) {

        var oResult = {
            READINGS: [
                {
                    DATE: "2025-04-29",
                    SHORT_TERM_CORROSION_RATE: 0,
                    LONG_TERM_CORROSION_RATE: 0,
                    REMAINING_LIFE: 0,
                    HALF_LIFE: 0
                },
                {
                    DATE: "2025-02-13",
                    SHORT_TERM_CORROSION_RATE: 1,
                    LONG_TERM_CORROSION_RATE: 1,
                    REMAINING_LIFE: 5,
                    HALF_LIFE: 5
                }
            ]
        };

        var oResponse =
            this.oController.fnApplyBaselineReadingDash(oResult);

        assert.strictEqual(
            oResponse.READINGS[0].SHORT_TERM_CORROSION_RATE,
            0,
            "Latest reading should remain unchanged"
        );

        assert.strictEqual(
            oResponse.READINGS[0].HALF_LIFE,
            0,
            "Latest half life should remain unchanged"
        );

    });

    /**
     * Should not replace non zero values
     */
    QUnit.test("Should not replace non zero values", function (assert) {

        var oResult = {
            READINGS: [
                {
                    DATE: "2025-04-29",
                    HALF_LIFE: 5
                },
                {
                    DATE: "2025-02-13",
                    HALF_LIFE: 10
                }
            ]
        };

        var oResponse =
            this.oController.fnApplyBaselineReadingDash(oResult);

        assert.strictEqual(
            oResponse.READINGS[1].HALF_LIFE,
            10,
            "Non zero values should remain unchanged"
        );

    });

    /**
     * Should not replace values for single reading
     */
    QUnit.test("Should not replace values for single reading", function (assert) {

        var oResult = {
            READINGS: [
                {
                    DATE: "2025-04-29",
                    HALF_LIFE: 0
                }
            ]
        };

        var oResponse =
            this.oController.fnApplyBaselineReadingDash(oResult);

        assert.strictEqual(
            oResponse.READINGS[0].HALF_LIFE,
            0,
            "Single reading should remain unchanged"
        );

    });

    /**
     * Should replace numeric string zero values
     */
    QUnit.test("Should replace numeric string zero values", function (assert) {

        var oResult = {
            READINGS: [
                {
                    DATE: "2025-04-29",
                    HALF_LIFE: 5
                },
                {
                    DATE: "2025-02-13",
                    HALF_LIFE: "0"
                }
            ]
        };

        var oResponse =
            this.oController.fnApplyBaselineReadingDash(oResult);

        assert.strictEqual(
            oResponse.READINGS[1].HALF_LIFE,
            "-",
            "String zero should be replaced with dash"
        );

    });

    /**
     * Should set IS_BASELINE_ flag for all baseline fields when their value is zero
     */
    QUnit.test("Should set IS_BASELINE_ flag for all baseline fields when their value is zero", function (assert) {

        var oResult = {
            READINGS: [
                {
                    DATE: "2025-04-29",
                    SHORT_TERM_CORROSION_RATE: 1,
                    LONG_TERM_CORROSION_RATE: 1,
                    REMAINING_LIFE: 1,
                    HALF_LIFE: 1
                },
                {
                    DATE: "2025-02-13",
                    SHORT_TERM_CORROSION_RATE: 0,
                    LONG_TERM_CORROSION_RATE: 0,
                    REMAINING_LIFE: 0,
                    HALF_LIFE: 0
                }
            ]
        };

        var oResponse =
            this.oController.fnApplyBaselineReadingDash(oResult);

        assert.strictEqual(
            oResponse.READINGS[1].IS_BASELINE_SHORT_TERM_CORROSION_RATE,
            true,
            "IS_BASELINE_SHORT_TERM_CORROSION_RATE should be set to true"
        );

        assert.strictEqual(
            oResponse.READINGS[1].IS_BASELINE_LONG_TERM_CORROSION_RATE,
            true,
            "IS_BASELINE_LONG_TERM_CORROSION_RATE should be set to true"
        );

        assert.strictEqual(
            oResponse.READINGS[1].IS_BASELINE_REMAINING_LIFE,
            true,
            "IS_BASELINE_REMAINING_LIFE should be set to true"
        );

        assert.strictEqual(
            oResponse.READINGS[1].IS_BASELINE_HALF_LIFE,
            true,
            "IS_BASELINE_HALF_LIFE should be set to true"
        );

    });

    /**
     * Should execute baseline formatter branch for all cmlSummary-enabled fields
     */
    QUnit.test("Should execute baseline formatter branch for all cmlSummary-enabled fields", function (assert) {

        var fnFormatter;
        var oTextStub;

        this.oController = new CMLDetailTabsController();

        sinon.stub(
            this.oController,
            "fnFormatBaselineValue"
        ).returns("-");

        oTextStub = sinon.stub(sap.m, "Text", function (oConfig) {

            fnFormatter = oConfig.text.formatter;

            return {
                addStyleClass: function () {
                    return this;
                }
            };

        });

        var oConfig = {
            text: {
                formatter: function (vValue, bIsBaseline) {

                    return this.oController.fnFormatBaselineValue(
                        vValue,
                        bIsBaseline
                    );

                }.bind(this)
            }
        };

        sap.m.Text(oConfig);

        var sResult = fnFormatter(
            0,
            true
        );

        assert.ok(
            oTextStub.calledOnce,
            "sap.m.Text should be called"
        );

        assert.ok(
            this.oController.fnFormatBaselineValue.calledOnce,
            "fnFormatBaselineValue should be called"
        );

        assert.strictEqual(
            sResult,
            "-",
            "Formatter should return dash"
        );

    });
});
