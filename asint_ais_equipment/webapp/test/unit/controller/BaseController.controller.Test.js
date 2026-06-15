sap.ui.define([
    "comasintaismiequipment/equipment/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";


    /**
     * Creates a mock controller with given model.
     * @param {object} oModelList model for testing
     * @returns {object} controller instance
     */
    function buildController(oModelList) {
        var oCtrl = Object.create(BaseController.prototype);

        /**
         * 
         */
        oCtrl.getView = function () {
            return {
                /**
                 * 
                 */
                getModel: function (sName) {
                    if (sName === "mEquipmentList") { return oModelList; }
                    return null;
                }
            };
        };

        oCtrl.fnFireMultiInputTokenUpdateManually = sinon.spy();
        oCtrl.selectVal = sinon.spy();
        return oCtrl;
    }

    /**
     * Creates a mock single select event.
     * @param {string} name selected item name
     * @returns {object} event object
     */
    function singleEvent(name) {
        return {
            /**
             * Returns event source.
             * @returns {object}
             */
            getSource: function () {
                return {
                    /**
                     * Returns selection mode.
                     * @returns {string} selection mode
                     */
                    getMode: function () { return "SingleSelect"; },
                    /**
                     * Returns selected items.
                     * @returns {array} selected items
                     */
                    getSelectedItems: function () {
                        return [{
                            /**
                             * Returns binding context.
                             * @returns {object} context object
                             */
                            getBindingContext: function () {
                                return {
                                    getProperty: function (prop) {
                                        if (prop === "name")        { return name; }
                                        if (prop === "description") { return "desc_" + name; }
                                    }
                                };
                            }
                        }];
                    }
                };
            }
        };
    }

    /**
     * Creates a list model with type.
     * @param {string} type value help type
     * @returns {JSONModel} model instance
     */
    function listModel(type) {
        return new JSONModel({
            data: {
                genreicValueHelpType: type,
                analytics: { applyFilter: false }
            }
        });
    }

    /**
     * Creates a list model with location data.
     * @param {string} type value help type
     * @param {array} locationValue location list
     * @returns {JSONModel} model instance
     */
    function listModelWithLocation(type, locationValue) {
        return new JSONModel({
            data: {
                genreicValueHelpType: type,
                analytics: { applyFilter: false },
                location: locationValue || []
            }
        });
    }

    /**
     * Creates a mock list item.
     * @param {string} name item name
     * @returns {object} item object
     */
    function buildItem(name) {
        return {
            setSelected: sinon.spy(),
            /**
             * 
             */
            getBindingContext: function () {
                return {
                    getProperty: function (prop) {if (prop === "name") { return name; }}
                };
            }
        };
    }

    /**
     * Creates a mock multi select event.
     * @param {array} items list items
     * @returns {object} event object
     */
    function multiSelectEvent(items) {
        return {
            /**
             * Returns event source.
             * @returns {object} source object
             */
            getSource: function () {
                return {
                    /**
                     * Returns selection mode.
                     * @returns {string} selection mode
                     */
                    getMode: function () { return "MultiSelect"; },
                    /**
                     * Returns list items.
                     * @returns {array} items list
                     */
                    getItems: function () { return items; }
                };
            }
        };
    }

    /** Tests onSelectValue behavior in BaseController */
    QUnit.module("BaseController: onSelectValue - Value Help Selection Handling", {
        /**
         * Setup before each test.
         */
        beforeEach: function () {}
    });

    /**
     * 
     */
    QUnit.test("should set plannerGroup when value help type is PRGP", function (assert) {
        var oModelList = listModel("PRGP");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("PG1"));

        assert.strictEqual(oModelList.getProperty("/data/plannerGroup"),"PG1","plannerGroup set correctly");
    });

    /**
     * 
     */
    QUnit.test("PRGP fires MultiInput with correct id and value", function (assert) {
        var oModelList = listModel("PRGP");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("PG1"));

        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledOnce,"fnFireMultiInputTokenUpdateManually called exactly once");
        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledWith("idEQUIMultiPlannerGroup", "PG1"),"called with correct id and value");
    });

    /**
     * 
     */
    QUnit.test("should set plantSection when value help type is PLSC", function (assert) {
        var oModelList = listModel("PLSC");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("PS1"));

        assert.strictEqual(oModelList.getProperty("/data/plantSection"),"PS1","plantSection set correctly");
    });

    /**
     * 
     */
    QUnit.test("PLSC fires MultiInput with correct id and value", function (assert) {
        var oModelList = listModel("PLSC");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("PS1"));

        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledOnce,"fnFireMultiInputTokenUpdateManually called exactly once");
        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledWith("idEQUIMultiPlantSection", "PS1"),"called with correct id and value");
    });

    /**
     * 
     */
    QUnit.test("should set maintenanceWorkCenter when value help type is WCTR", function (assert) {
        var oModelList = listModel("WCTR");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("WC1"));

        assert.strictEqual(oModelList.getProperty("/data/maintenanceWorkCenter"),"WC1","maintenanceWorkCenter set correctly");
    });

    /**
     * 
     */
    QUnit.test("WCTR fires MultiInput with correct id and value", function (assert) {
        var oModelList = listModel("WCTR");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("WC1"));

        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledOnce,"fnFireMultiInputTokenUpdateManually called exactly once");
        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledWith("idEQUIMultiMaintenanceWorkCenter", "WC1"),"called with correct id and value");
    });

    /**
     * 
     */
    QUnit.test("should set location when value help type is LOC", function (assert) {
        var oModelList = listModel("LOC");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("LOC1"));

        assert.strictEqual(oModelList.getProperty("/data/location"),"LOC1","location set correctly");
    });

    /**
     * 
     */
    QUnit.test("LOC fires MultiInput with correct id and value", function (assert) {
        var oModelList = listModel("LOC");
        var oCtrl = buildController(oModelList);
        oCtrl.onSelectValue(singleEvent("LOC1"));

        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledOnce,"fnFireMultiInputTokenUpdateManually called exactly once");
        assert.ok(oCtrl.fnFireMultiInputTokenUpdateManually.calledWith("idEQUIMultiLocation", "LOC1"),"called with correct id and value");
    });

    /** Tests onUpdateFinish selection handling in BaseController */
    QUnit.module("BaseController: onUpdateFinish - MultiSelect Synchronization", {});

    /**
     * 
     */
    QUnit.test("should select item when it matches saved location key", function (assert) {
        var oModelList = listModelWithLocation("LOC", [{ key: "LOC1", text: "LOC1" }]);
        var oCtrl = buildController(oModelList);
        var oMatchItem    = buildItem("LOC1");
        var oNonMatchItem = buildItem("LOC2");
        oCtrl.onUpdateFinish(multiSelectEvent([oMatchItem, oNonMatchItem]));

        assert.ok(oMatchItem.setSelected.calledWith(true),"matching item (LOC1) is selected");
    });

    /**
     * 
     */
    QUnit.test("should deselect items not present in saved location", function (assert) {
        var oModelList = listModelWithLocation("LOC", [{ key: "LOC1", text: "LOC1" }]);
        var oCtrl = buildController(oModelList);
        var oMatchItem    = buildItem("LOC1");
        var oNonMatchItem = buildItem("LOC2");
        oCtrl.onUpdateFinish(multiSelectEvent([oMatchItem, oNonMatchItem]));

        assert.ok(oNonMatchItem.setSelected.calledWith(false),"non-matching item (LOC2) is deselected");
    });

    /**
     * 
     */
    QUnit.test("LOC: multiple saved location keys are all marked selected", function (assert) {
        var oModelList = listModelWithLocation("LOC", [
            { key: "LOC1", text: "LOC1" },
            { key: "LOC3", text: "LOC3" }
        ]);
        var oCtrl = buildController(oModelList);
        var oItem1 = buildItem("LOC1");
        var oItem2 = buildItem("LOC2");
        var oItem3 = buildItem("LOC3");

        oCtrl.onUpdateFinish(multiSelectEvent([oItem1, oItem2, oItem3]));

        assert.ok(oItem1.setSelected.calledWith(true),  "LOC1 selected");
        assert.ok(oItem2.setSelected.calledWith(false), "LOC2 deselected");
        assert.ok(oItem3.setSelected.calledWith(true),  "LOC3 selected");
    });

    /**
     * 
     */
    QUnit.test("LOC: empty saved location deselects all items", function (assert) {
        var oModelList = listModelWithLocation("LOC", []);
        var oCtrl = buildController(oModelList);

        var oItem1 = buildItem("LOC1");
        var oItem2 = buildItem("LOC2");

        oCtrl.onUpdateFinish(multiSelectEvent([oItem1, oItem2]));

        assert.ok(oItem1.setSelected.calledWith(false), "LOC1 deselected");
        assert.ok(oItem2.setSelected.calledWith(false), "LOC2 deselected");
    });

    /**
     * 
     */
    QUnit.test("LOC: selectVal is called after update", function (assert) {
        var oModelList = listModelWithLocation("LOC", [{ key: "LOC1", text: "LOC1" }]);
        var oCtrl = buildController(oModelList);

        oCtrl.onUpdateFinish(multiSelectEvent([buildItem("LOC1")]));

        assert.ok(oCtrl.selectVal.calledOnce, "selectVal called once");
    });

    /** Tests fnLoadFeatureFlagConfig behavior in BaseController */
    QUnit.module("BaseController: fnLoadFeatureFlagConfig - Feature Flag Loading", {});

    /** Verifies feature flag values are set correctly on successful API response */
    QUnit.test("sets legacyEquiTag value and isLoaded flag on success", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);

        var oModel = new JSONModel({
            metadata: {
                featureFlag: {
                    legacyEquiTag: "",
                    isLoaded: false
                }
            }
        });

        /**
         * Returns mocked view.
         * @returns {object} view instance
         */
        oCtrl.getView = function () {
            return {
                /**
                 * Returns model by name.
                 * @param {string} sName model name
                 * @returns {object|null} model instance
                 */
                getModel: function (sName) {
                    if (sName === "mEquipment") { return oModel; }
                    if (sName === "i18n") {
                        return { getResourceBundle: function () { return { getText: function () { return "Error"; } }; } };
                    }
                    return null;
                }
            };
        };
        oCtrl.commonDataSource = {
            fetchFeatureFlag: function (fnSuccess) {
                fnSuccess({ legacyEquiTag: { objectValue: "1" } });
            }
        };

        oCtrl.fnLoadFeatureFlagConfig();

        assert.strictEqual(oModel.getProperty("/metadata/featureFlag/legacyEquiTag"), "1", "legacyEquiTag set correctly");
        assert.strictEqual(oModel.getProperty("/metadata/featureFlag/isLoaded"), true, "isLoaded set to true");
    });

    /** Ensures callback is executed after successful feature flag load */
    QUnit.test("executes callback after successful load", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);
        var oSpy = sinon.spy();

        var oModel = new JSONModel({
            metadata: {
                featureFlag: {
                    legacyEquiTag: "",
                    isLoaded: false
                }
            }
        });

        oCtrl.getView = function () {
            return {
                getModel: function (sName) {
                    if (sName === "mEquipment") { return oModel; }
                    if (sName === "i18n") {
                        return { getResourceBundle: function () { return { getText: function () { return "Error"; } }; } };
                    }
                    return null;
                }
            };
        };
        oCtrl.commonDataSource = {
            fetchFeatureFlag: function (fnSuccess) {
                fnSuccess({ legacyEquiTag: { objectValue: "1" } });
            }
        };

        oCtrl.fnLoadFeatureFlagConfig(oSpy);

        assert.ok(oSpy.calledOnce, "callback executed once after success");
    });

    /** Checks MessageToast is shown when API call fails */
    QUnit.test("shows MessageToast on API error", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);
        var oToastStub = sinon.stub(sap.m.MessageToast, "show");

        oCtrl._i18n = { getText: function () { return "dummy text"; } };
        var oModel = new JSONModel({
            metadata: {
                featureFlag: {
                    legacyEquiTag: "1",
                    isLoaded: false
                }
            }
        });
        try {
            oCtrl.getView = function () {
                return {
                    getModel: function (sName) {
                        if (sName === "mEquipment") { return oModel; }
                        if (sName === "i18n") {
                            return { getResourceBundle: function () { return { getText: function () { return "Error"; } }; } };
                        }
                        return null;
                    }
                };
            };
            oCtrl.commonDataSource = {
                fetchFeatureFlag: function (fnSuccess, fnError) { fnError(); }
            };

            oCtrl.fnLoadFeatureFlagConfig();

            assert.ok(oToastStub.calledOnce, "MessageToast shown on API error");
        } finally {
            oToastStub.restore();
        }
    });

    /** Ensures API is not called when feature flag is already loaded */
    QUnit.test("skips API call when feature flag already loaded", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);
        var oModel = new JSONModel({ metadata: { featureFlag: { legacyEquiTag: "1", isLoaded: true } } });

        oCtrl.getView = function () {
            return {
                getModel: function (sName) {
                    if (sName === "mEquipment") { return oModel; }
                    if (sName === "i18n") return { getResourceBundle: function () { return { getText: function () { return "dummy text"; } }; } };
                    return null;
                }
            };
        };
        oCtrl.commonDataSource = { fetchFeatureFlag: sinon.stub() };

        oCtrl.fnLoadFeatureFlagConfig();

        assert.ok(oCtrl.commonDataSource.fetchFeatureFlag.notCalled, "API not called when already loaded");
    });

    /** Tests fnGetUnitLocation behavior in BaseController */
    QUnit.module("BaseController: fnGetUnitLocation - Unit Location Fetching", {});

    /** Verifies unitLocations are set correctly on successful API response */
    QUnit.test("sets unitLocations on success", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);
        var oModel = new JSONModel({
            metadata: {
                featureFlag: {
                    legacyEquiTag: "1",
                    isLoaded: true
                }
            }
        });

        oCtrl._i18n = { getText: function () { return "dummy text"; } };
        

        oCtrl.getView = function () {
            return {
                getModel: function (sName) {
                    if (sName === "mEquipment") { return oModel; }
                    return null;
                }
            };
        };
        oCtrl.dataSource = {
            getUnitLocations: function (fnSuccess) {
                fnSuccess({
                    details: [
                        { name: "L", description: "L" }
                    ]
                });
            }
        };

        oCtrl.fnGetUnitLocation();

        assert.deepEqual(oModel.getProperty("/metadata/unitLocations"),[{ name: "L", description: "L" }],"unitLocations set correctly");
    });

    /** Ensures unitLocations is empty when API call fails */
    QUnit.test("sets unitLocations to empty array on error", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);
        var oModel = new JSONModel({
            metadata: {
                featureFlag: {
                    legacyEquiTag: "1",
                    isLoaded: true
                }
            }
        });

        oCtrl._i18n = { getText: function () { return "dummy text"; } };

        oCtrl.getView = function () {
            return {
                getModel: function (sName) {
                    if (sName === "mEquipment") { return oModel; }
                    return null;
                }
            };
        };
        oCtrl.dataSource = {
            getUnitLocations: function (fnSuccess, fnError) { fnError(); }
        };

        oCtrl.fnGetUnitLocation();

        assert.deepEqual(oModel.getProperty("/metadata/unitLocations"), [], "unitLocations empty on error");
    });

    /** Ensures API is not called when feature flag is disabled */
    QUnit.test("skips API call when feature flag is false", function (assert) {
        var oCtrl = Object.create(BaseController.prototype);
        var oModel = new JSONModel({ metadata: { featureFlag: { legacyEquiTag: "0" } } });

        oCtrl._i18n = { getText: function () { return "dummy text"; } };

        oCtrl.getView = function () {
            return {
                getModel: function (sName) {
                    if (sName === "mEquipment") { return oModel; }
                    return null;
                }
            };
        };
        oCtrl.dataSource = { getUnitLocations: sinon.stub() };

        oCtrl.fnGetUnitLocation();

        assert.ok(oCtrl.dataSource.getUnitLocations.notCalled, "API not called when feature flag disabled");
        assert.deepEqual(oModel.getProperty("/metadata/unitLocations"), [], "unitLocations remains empty");
    });

    /** Tests onValueHelpSearch LOC objectType filter uses EQ operator */
    QUnit.module("BaseController: onValueHelpSearch - LOC Filter", {
        /**
         * Setup controller with mEquipmentList model.
         */
        beforeEach: function () {
            var oModelList = listModel("LOC");
            this.oCtrl = buildController(oModelList);
            this.oMockBinding = { filter: sinon.spy() };
            this.oCtrl.byId = sinon.stub().returns({
                getBinding: sinon.stub().withArgs("items").returns(this.oMockBinding)
            });
        }
    });

    /** LOC case applies EQ operator unlike other types which use Contains */
    QUnit.test("LOC objectType filter uses EQ not Contains", function (assert) {
        var oEvent = { getParameter: sinon.stub().returns("") };

        this.oCtrl.onValueHelpSearch(oEvent);

        var aFilters = this.oMockBinding.filter.firstCall.args[0];
        var oLocFilter = aFilters[0];
        assert.strictEqual(oLocFilter.sOperator, "EQ", "LOC filter uses EQ operator");
        assert.strictEqual(oLocFilter.oValue1, "LOC", "LOC filter value is LOC");
    });

});