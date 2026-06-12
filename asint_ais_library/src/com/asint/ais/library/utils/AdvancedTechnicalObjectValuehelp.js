sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/utils/VariantManagementHelper",
    "com/asint/ais/library/utils/ValueHelpFilter",
    "com/asint/ais/library/datasource/asint/Common"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator,VariantManagementHelper,ValueHelpFilter, CommonDatasource) {

    return Formatter.extend("com.asint.ais.library.utils.AdvancedTechnicalObjectValuehelp", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        _mV4MasterService: {},
        _fnEventForEquipment: null,
        _defaultFilterForEquipment: [],
        _fnEventForFunctionalLocation: null,
        _defaultFilterForFunctionalLocation: [],
        datasource: null,

        /**
         * Constructor
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {

            var that = this;
            this._baseURI = sBaseURI;
            this._i18n = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

            if(this._baseURI && this._baseURI.includes(".asintais.")) {
                this._appNamespace = this._baseURI.substring(this._baseURI.indexOf(".asintais.") + 10);
            }
            this._mV4MasterService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/MasterDataService/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });

            this._mV4ValueHelpService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/S4DataService/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });

            this.valueHelpFilter =  new ValueHelpFilter(this._baseURI);

            if (sBaseURI) {
                this.datasource = new CommonDatasource(sBaseURI);
            } else {
                this.datasource = new CommonDatasource();
            }

            this._featureFlagConfig = {
                "isLoaded": false,
                "hideSortField": "false",
                "hideTechnicalIdField": "true"
            };
            this.fnLoadFeatureFlagConfig();

        },

        /**
         * Function to load feature flag config
         */
        fnLoadFeatureFlagConfig: function () {
            var that = this;

            if(!this._featureFlagConfig.isLoaded) {
                this.datasource.fetchFeatureFlag(function(oConfig) {
                    Object.keys(that._featureFlagConfig).forEach(function(sKey) {
                        if(Object.prototype.hasOwnProperty.call(oConfig, sKey)) {
                            that._featureFlagConfig[sKey] = oConfig[sKey].objectValue;
                        }
                    });
                    that._featureFlagConfig.isLoaded = true;
                }, function () {
                    sap.m.MessageToast.show(that._i18n.getResourceBundle().getText("TableConstructor.featureFlag.failed.message.text"));
                });
            }
        },

        /**
         * Fucntion to handle before open event of technical object value help dialog
         * @param {Object} oEvent
         */
        beforeOpenTechnicalObjectValueHelpDialog: function (sType) {
            if (sType === "EQUI" && this._oAdvEquipmentValueHelpDialog) {
                var oModel = this._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp");
                oModel.setProperty("/metadata/featureFlag", this._featureFlagConfig);
            } else if (sType === "FLOC" && this._oAdvFlocValueHelpDialog) {
                var oFlocModel = this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp");
                oFlocModel.setProperty("/metadata/featureFlag", this._featureFlagConfig);
            }
        },

        /**
         * Function to handle equipment value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter 
         * @param {Object} oColumnFilter
         * @param {Array} aLockControlIds 
         * @param {Array} aDefaultFilters
         */
        handleEquipmentValueHelp: function (_fnEvent, bTableMode, aFilter, oColumnFilter, aLockControlIds, aDefaultFilters, sAppName) {
            this._aLockedControlIds = Array.isArray(aLockControlIds) ? aLockControlIds.slice() : [];

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            if(sAppName) {
                window._currentTOApp = sAppName;
            } else {
                delete window._currentTOApp;
            }

            this._fnEventForEquipment = _fnEvent;
            this._defaultFilterForEquipment = aFilter;

            var oMultiInputId = {
                "charValue": "idAdEqClassCharMultiInputFilter",
                "class": "idAdEqClassMultiInputFilter",
                "catalogProfile": "idAdEqCatalogProfileInputFilter",
                "planningPlant": "idAdEqPlanningPlantMultiInputFilter",
                "maintenancePlant": "idAdEqMaintenancePlantInputFilter",
                "category": "idAdEqCategoryInputFilter",
                "plannerGroup": "idAdEqPlannerGroupInputFilter",
                "mainWorkCenter": "idAdEqMainWorkCenterInputFilter",
                "sortField": "idEquipmentSortField",
                "technicalObjectSortCode": "idEquipmentTechnicalObjectSortCode",
                "abcIndicator": "idEQUIMultiABCIndicator",
                "objectType": "idEQUIMultiObjectType",
                "mda": "idEQUIMultiMasterDataAttribution",
                "parentFloc": "idAdEqParentFlocMultiInputFilters",
                "plantSection": "idAdEqPlantSectionInputFilter",
                "location": "idAdEqLocationInputFilter"             
            };

            /**
             * Remove all input tokens if any present
             * @param {String} sFragmentId 
             */
            var fnRemoveInputTokens = function(sFragmentId) {
                Object.values(oMultiInputId).forEach(function(sInputId) {
                    var oInput = sap.ui.core.Fragment.byId(sFragmentId, sInputId);

                    if(oInput instanceof sap.m.MultiInput) {
                        oInput.removeAllTokens();

                    } else if (oInput instanceof sap.m.Input) {
                        oInput.setValue("");
                    }
        
                })
            }

            if(!aFilter) {
                aFilter = [];
            }

            var aApplyFilter = [];

            var fnApplyFilters = function(sFragmentId) {
                // var oMultiInputId = {
                //     "charValue": "idAdEqClassCharMultiInputFilter",
                //     "class": "idAdEqClassMultiInputFilter",
                //     "catalogProfile": "idAdEqCatalogProfileInputFilter",
                // }

                aFilter.forEach(function(oItem) {
                    if(oItem.inputElementId && oItem.inputToken) {
                        var oInput = sap.ui.core.Fragment.byId(sFragmentId, oMultiInputId[oItem.inputElementId]);
    
                        oInput.removeAllTokens();
                        oItem.inputToken.forEach(function(oInp) {
                            var token = new sap.m.Token({
                                key: oInp.key,
                                text: oInp.text
                            });
    
                            oInput.addToken(token);
                        })
                    }

                    aApplyFilter.push(oItem.inputFilter);
                });
                if (Array.isArray(this._aLockedControlIds) && this._aLockedControlIds.length > 0) {
                    this._aLockedControlIds.forEach(function (controlId) {
                        var oInput = sap.ui.core.Fragment.byId(sFragmentId, controlId);
                        if (!oInput) return;
                        if (oInput.setEnabled)
                            oInput.setEnabled(false);
                    });
                }
            }.bind(this);



            /**
             * Function that sets the filter management
            */
            var fnSetFilters = function () {
                if (!this.oVariantManagementAdvEquipment) {
                    this.oVariantManagementAdvEquipment = new VariantManagementHelper(this, {
                        "ControlId": {
                            "SmartVariantManagement": "idAdvEquipmentSmartVariantManagement",
                            "Filterbar": "idAdvEquipmentFilterBar",
                            "Table": ["idAdvEqpuipmentTable"],
                            "SnappedContent": "idAdvEquipmentDynamicPageExpandedContent",
                            "ExpandedContent": "idAdvEquipmentDynamicPageSnappedContent"
                        },
                        "FilterBarSettings": {
                            "EnableBasicSearch": true,
                            "BasicSearchKeys": ["name", "equipmentDescription", "parentFunctionalLocationName", "category", "objectType", "abcIndicator", "categoryDescription",
                                "srcId", "assetManufacturerName", "planningPlant", "createdBy", "modifiedBy", "displayId", "parentEquipmentName", "objectTypeDescription",
                                "parentEquipmentDescription", "parentFunctionalLocationDescription", "maintenancePlant", "isActive", "flagComponent", "activationState", "sortField", "componentType", "technicalObjectSortCode","plantSection", "location"]
                        },
                        "Settings": {
                            "LoadOnlyVisibleTable": false
                        }
                    });
                    this.oVariantManagementAdvEquipment.initialise();
                }
            }.bind(this);

            var fnClearFilters = function () {

                var oFilterBar = sap.ui.core.Fragment.byId(that._appNamespace, "idAdvEquipmentFilterBar");
                var oEquipmentSortField = sap.ui.core.Fragment.byId(that._appNamespace, "idEquipmentSortField");


                if (oFilterBar) {

                    this._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp").setProperty("/data/filters",{});
                    var sBasicSearchId = oFilterBar.getBasicSearch();
                    var oBasicSearch = sap.ui.getCore().byId(sBasicSearchId);
                    oBasicSearch.setValue("");
                    oFilterBar.clear();
                }

                if (oEquipmentSortField) {
                    oEquipmentSortField.setValue("");
                }
                if (Array.isArray(this._aLockedControlIds) && this._aLockedControlIds.length > 0) {
                    this._aLockedControlIds.forEach(function (controlId) {
                        var oInput = sap.ui.core.Fragment.byId(that._appNamespace, controlId);
                        if (!oInput) return;
                        if (oInput.setEnabled) oInput.setEnabled(true);
                    });
                }
            }.bind(this);



            if (!this._oAdvEquipmentValueHelpDialog) {
                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.AdvancedEquipmentValuehelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oEquipmentModel = new JSONModel({
                        "data":{
                            "equi2": [
                                {
                                    "ID": "10000342",
                                    "name": "10000342",
                                    "to_description": [{"shortDescription": "8\" Piping Circuit"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000343",
                                    "name": "10000343",
                                    "to_description": [{"shortDescription": "3/4\"Piping Circuit"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000344",
                                    "name": "10000344",
                                    "to_description": [{"shortDescription": "2\"Piping Circuit"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000345",
                                    "name": "10000345",
                                    "to_description": [{"shortDescription": "8\" Piping Circuit Mix Point"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000346",
                                    "name": "10000346",
                                    "to_description": [{"shortDescription": "2\" Piping Circuit Mix Point"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000347",
                                    "name": "10000347",
                                    "to_description": [{"shortDescription": "Deadleg-1"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000348",
                                    "name": "10000348",
                                    "to_description": [{"shortDescription": "Deadleg-2"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000349",
                                    "name": "10000349",
                                    "to_description": [{"shortDescription": "Deadleg-3"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000350",
                                    "name": "10000350",
                                    "to_description": [{"shortDescription": "8\" Circuit Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000351",
                                    "name": "10000351",
                                    "to_description": [{"shortDescription": "3/4\"Piping Circuit Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000352",
                                    "name": "10000352",
                                    "to_description": [{"shortDescription": "2\"Piping Circuit Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000353",
                                    "name": "10000353",
                                    "to_description": [{"shortDescription": "8\" Piping Circuit Mix Point Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000354",
                                    "name": "10000354",
                                    "to_description": [{"shortDescription": "2\" Piping Circuit Mix Point Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000355",
                                    "name": "10000355",
                                    "to_description": [{"shortDescription": "Deadleg-1 Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000356",
                                    "name": "10000356",
                                    "to_description": [{"shortDescription": "Deadleg-2 Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000357",
                                    "name": "10000357",
                                    "to_description": [{"shortDescription": "Deadleg-3 Insulated"}],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "10000358",
                                    "name": "10000358",
                                    "to_description": [{"shortDescription": "Circuit-1"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000359",
                                    "name": "10000359",
                                    "to_description": [{"shortDescription": "Circuit-2"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000360",
                                    "name": "10000360",
                                    "to_description": [{"shortDescription": "Circuit-3"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000361",
                                    "name": "10000361",
                                    "to_description": [{"shortDescription": "Circuit-4"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000362",
                                    "name": "10000362",
                                    "to_description": [{"shortDescription": "Circuit-5"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000363",
                                    "name": "10000363",
                                    "to_description": [{"shortDescription": "Circuit-6"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000364",
                                    "name": "10000364",
                                    "to_description": [{"shortDescription": "Corrosion Zone 1 TOP"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                                {
                                    "ID": "10000365",
                                    "name": "10000365",
                                    "to_description": [{"shortDescription": "Corrosion Zone 2 BOTTOM"}],
                                    "_objectType": "Pressure Vessel (1001)"
                                }
                            ],
                            "equi":[],
                            "filters":{},
                            "list":{
                                "equipmentDialogTitle": that._i18n.getResourceBundle().getText("asint.equipment.valuehelp.dialog.title", [0]),
                                "advanceFilter" :{
                                    "class" : {
                                        "selected" : []
                                    },
                                    "classChar":{
                                        "selected":[]
                                    }
                                }
                            },
                            // criticallity and ABC Indicator are same thing
                            "columnFilter": {
                                "selectedColumns": {
                                    "equipment": true,
                                    "category": true,
                                    "objectType": true,
                                    "sortField": true,
                                    "class": true,
                                    "abcIndicator": true,
                                    "catalog": true,
                                    "planningPlant": true,
                                    "maintenancePlant": true,
                                    "assetManufacturer": true,
                                    "mda": true,

                                    "name": false,
                                    "description": false,
                                    "parentFloc": false,
                                    "plannerGroup": false,
                                    "maintenanceWorkCenter": false,
                                    "plantSection": false,
                                    "location": false       
                                },
                                "selectedFilters": {
                                    "planningPlant": true,
                                    "category": true,
                                    "maintenancePlant": true,
                                    "plannerGroup": true,
                                    "mainworkcenter": true,
                                    "sortField": true,
                                    "catalog": true,
                                    "class": true,
                                    "characteristicValue": true,
                                    "criticality": true,
                                    "objectType": true,
                                    "mda": true,
                                    "technicalObjectSortCode": true,

                                    "parentFloc": false,
                                    "plantSection": false,
                                    "location": false
                                },
                            },
                        },
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                            "featureFlag": {
                                "hideSortField": "false",
                                "hideTechnicalIdField": "true"
                            }
                        }
                    });

                    that._oAdvEquipmentValueHelpDialog = oValueHelpDialog;

                    that._oAdvEquipmentValueHelpDialog.setModel(oEquipmentModel, "mAdvancedEquipmentValueHelp");
                    that._oAdvEquipmentValueHelpDialog.setModel(that._mV4MasterService, "mV4MasterService");
                    that._oAdvEquipmentValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oAdvEquipmentValueHelpDialog.open();

                    fnRemoveInputTokens(that._appNamespace);

                    
                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace,"idAdvEqpuipmentTable");
                    if (oTable) {
                        var oBinding = oTable.getBinding("items");
                        if (oBinding) {
                            oBinding.attachDataReceived(function () {
                                var iCount = oBinding.getCount();
                                var oModel = oTable.getModel("mAdvancedEquipmentValueHelp");
                                if (oModel) {
                                    var sTitle = that._i18n.getResourceBundle().getText("asint.equipment.valuehelp.dialog.title", [iCount]);
                                    oModel.setProperty("/data/list/equipmentDialogTitle", sTitle);
                                }
                            });
                        }
                    }


                    
                    if(aFilter && aFilter.length>0) {
                        fnApplyFilters(that._appNamespace);
                    }

                    if(oColumnFilter) {

                        var oPrevColumnFilter = that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp").getProperty("/data/columnFilter");

                        // for columns
                        Object.keys(oPrevColumnFilter.selectedColumns).forEach(function(sColumnKey) {
                            oPrevColumnFilter.selectedColumns[sColumnKey] = false;
                        });
                        oColumnFilter.columns.forEach(function(sColumnKey) {
                            oPrevColumnFilter.selectedColumns[sColumnKey] = true;
                        });

                        // for filters
                        Object.keys(oPrevColumnFilter.selectedFilters).forEach(function(sFilterKey) {
                            oPrevColumnFilter.selectedFilters[sFilterKey] = false;
                        });
                        oColumnFilter.filters.forEach(function(sFilterKey) {
                            oPrevColumnFilter.selectedFilters[sFilterKey] = true;
                        });

                        that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp").setProperty("/data/columnFilter", oPrevColumnFilter);
                    }

                    // oTable.getBinding("items").filter(aFilter);
                    // var aFinalFilters = new Filter(aApplyFilter, true);
                    if(aDefaultFilters) {
                        window._technicalObjcectDefaultFilters = aDefaultFilters;
                        // oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));

                        if(aApplyFilter.length > 0) {
                            oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));
                        } else {
                            oTable.getBinding("items").filter(aDefaultFilters);
                        }

                    } else {
                        window._technicalObjcectDefaultFilters = null;
                        oTable.getBinding("items").filter(new Filter(aApplyFilter, true));
                    }

                    fnSetFilters();
                }.bind(this));
            } else {
                fnRemoveInputTokens(that._appNamespace);

                var oTable = sap.ui.core.Fragment.byId(that._appNamespace,"idAdvEqpuipmentTable");                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                oTable.getBinding("items").filter([]);

                fnClearFilters();
                if(aFilter && aFilter.length>0) {
                    fnApplyFilters(that._appNamespace);
                }

                // oTable.getBinding("items").filter(aFilter);
                // oTable.getBinding("items").filter(new Filter(aApplyFilter, true));
                if(aDefaultFilters) {
                    window._technicalObjcectDefaultFilters = aDefaultFilters;
                    // oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));

                    if(aApplyFilter.length > 0) {
                        oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));
                    } else {
                        oTable.getBinding("items").filter(aDefaultFilters);
                    }

                } else {
                    window._technicalObjcectDefaultFilters = null;
                    oTable.getBinding("items").filter(new Filter(aApplyFilter, true));
                }

                oTable.removeSelections();
                that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp").setProperty("/metadata/selectedItem", []);
                that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp").setProperty("/metadata/aSelectedId", []);
                that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp").setProperty("/metadata/selectionMode", sMode);
                that._oAdvEquipmentValueHelpDialog.open();
            }
        },

        /**
         * Function to handle Functional Location value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter 
         * @param {Object} oColumnFilter
         * @param {Array} aLockControlIds 
         * @param {Array} aDefaultFilters 
         */
        handleFunctionalLocationValueHelp: function (_fnEvent, bTableMode, aFilter, oColumnFilter, aLockControlIds, aDefaultFilters, sAppName) {            
            this._aLockedControlIds = Array.isArray(aLockControlIds) ? aLockControlIds.slice() : [];
            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            if(sAppName) {
                window._currentTOApp = sAppName;
            } else {
                delete window._currentTOApp;
            }

            this._fnEventForFunctionalLocation = _fnEvent;
            this._defaultFilterForFunctionalLocation = aFilter;

            if (!aFilter) {
                aFilter = [];
            }

            var oMultiInputId = {
                "charValue": "idAdFlocClassCharMultiInputFilter",
                "class": "idAdFlocClassMultiInputFilter",
                "catalogProfile": "idAdFlocCatalogProfileInputFilter",
                "planningPlant": "idAdFlocPlanningPlantInputFilter",
                "maintenancePlant": "idAdFlocMaintenancePlantInputFilter",
                "category": "idAdFlocCategoryInputFilter",
                "plannerGroup": "idAdFlocPlannerGroupInputFilter",
                "mainWorkCenter": "idAdFlocMainWorkCenterInputFilter",
                "sortField": "idFunctionallocationSortField",
                "technicalObjectSortCode": "idFunctionallocationTechnicalObjectSortCode",
                "abcIndicator": "idFlocMultiABCIndicator",
                "objectType": "idFlocMultiObjectType",
                "plantSection": "idAdFlocPlantSectionInputFilter",
                "location": "idAdFlocLocationInputFilter",
            };

            /**
             * Remove all input tokens if any present
             * @param {String} sFragmentId 
             */
            var fnRemoveInputTokens = function(sFragmentId) {
                Object.values(oMultiInputId).forEach(function(sInputId) {
                    var oInput = sap.ui.core.Fragment.byId(sFragmentId, sInputId);
        
                    if(oInput instanceof sap.m.MultiInput) {
                        oInput.removeAllTokens();
                        
                    } else if (oInput instanceof sap.m.Input) {
                        oInput.setValue("");
                    }
                })
            }

            var aApplyFilter = [];
            var fnApplyFilters = function(sFragmentId) {
                // var oMultiInputId = {
                //     "charValue": "idAdFlocClassCharMultiInputFilter",
                //     "class": "idAdFlocClassMultiInputFilter",
                //     "catalogProfile": "idAdFlocCatalogProfileInputFilter",
                // };

                aFilter.forEach(function(oItem) {
                    if(oItem.inputElementId && oItem.inputToken) {
                        var oInput = sap.ui.core.Fragment.byId(sFragmentId, oMultiInputId[oItem.inputElementId]);
    
                        oInput.removeAllTokens();
                        oItem.inputToken.forEach(function(oInp) {
                            var token = new sap.m.Token({
                                key: oInp.key,
                                text: oInp.text
                            });
    
                            oInput.addToken(token);
                        })
                    }

                    aApplyFilter.push(oItem.inputFilter);
                });
                if (Array.isArray(this._aLockedControlIds) && this._aLockedControlIds.length > 0) {
                    this._aLockedControlIds.forEach(function (controlId) {
                        var oInput = sap.ui.core.Fragment.byId(sFragmentId, controlId);
                        if (!oInput) return;
                        if (oInput.setEnabled) oInput.setEnabled(false);
                    });
                }
            }.bind(this);

            /**
             * Function that sets the filter management
            */
            var fnSetFilters = function () {
                if (!this.oVariantManagementAdvFloc) {
                    this.oVariantManagementAdvFloc = new VariantManagementHelper(this, {
                        "ControlId": {
                            "SmartVariantManagement": "idAdvFlocSmartVariantManagement",
                            "Filterbar": "idAdvFlocFilterBar",
                            "Table": ["idAdvFlocTable"],
                            "SnappedContent": "idAdvFlocDynamicPageExpandedContent",
                            "ExpandedContent": "idAdvFlocDynamicPageSnappedContent"
                        },
                        "FilterBarSettings": {
                            "EnableBasicSearch": true,
                            "BasicSearchKeys": ["name", "functionalLocationDescription", "displayId", "category", "objectType", "assetManufacturerName", "abcIndicator", "objectTypeDescription", "everGreening",
                                "srcId", "modifiedBy", "createdBy", "planningPlant", "catalogProfile", "parentFunctionalLocationName", "parentFunctionalLocationDescription", "categoryDescription", "isActive", "sortField","plantSection", "location"]
                        },
                        "Settings": {
                            "LoadOnlyVisibleTable": false
                        }
                    });
                    this.oVariantManagementAdvFloc.initialise();
                }
            }.bind(this);

            var fnClearFilters = function () {

                var oFilterBar = sap.ui.core.Fragment.byId(that._appNamespace, "idAdvFlocFilterBar");
                var oFlocSortField = sap.ui.core.Fragment.byId(that._appNamespace, "idFunctionallocationSortField");


                if (oFilterBar) {

                    that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp").setProperty("/data/filters", {}); var sBasicSearchId = oFilterBar.getBasicSearch();
                    var oBasicSearch = sap.ui.getCore().byId(sBasicSearchId);
                    oBasicSearch.setValue("");
                    oFilterBar.clear();
                }

                if (oFlocSortField) {
                    oFlocSortField.setValue("");
                }
                if (Array.isArray(this._aLockedControlIds) && this._aLockedControlIds.length > 0) {
                    this._aLockedControlIds.forEach(function (controlId) {
                        var oInput = sap.ui.core.Fragment.byId(that._appNamespace, controlId);
                        if (!oInput) return;
                        if (oInput.setEnabled) oInput.setEnabled(true);
                    });
                }
            }.bind(this);

            if (!this._oAdvFlocValueHelpDialog) {
                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.AdvancedFunctionalLocationValuehelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oEquipmentModel = new JSONModel({
                        "data": {
                            "floc": [],
                            "filters": {},
                            "list": {
                                "functionalLocationDialogTitle": that._i18n.getResourceBundle().getText("asint.functionalLocation.valuehelp.dialog.title", [0]),
                                "advanceFilter": {
                                    "class": {
                                        "selected": []
                                    }
                                }
                            },
                            // criticallity and ABC Indicator are same thing
                            "columnFilter": {
                                "selectedColumns": {
                                    "floc": true,
                                    "category": true,
                                    "objectType": true,
                                    "sortField": true,
                                    "class": true,
                                    "abcIndicator": true,
                                    "catalog": true,
                                    "parentFloc": true,
                                    "planningPlant": true,
                                    "maintenancePlant": true,
                                    "assetManufacturer": true,

                                    "name": false,
                                    "description": false,
                                    "plannerGroup": false,
                                    "maintenanceWorkCenter": false,
                                    "plantSection": false,
                                    "location": false,
                                },
                                "selectedFilters": {
                                    "planningPlant": true,
                                    "category": true,
                                    "maintenancePlant": true,
                                    "plannerGroup": true,
                                    "mainworkcenter": true,
                                    "sortField": true,
                                    "catalog": true,
                                    "class": true,
                                    "characteristicValue": true,
                                    "criticality": true,
                                    "objectType": true,
                                    "technicalObjectSortCode": true,

                                    "plantSection": false,
                                    "location": false,
                                },
                            },
                        },
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                            "featureFlag": {
                                "hideSortField": "false",
                                "hideTechnicalIdField": "true"
                            }
                        }
                    });

                    that._oAdvFlocValueHelpDialog = oValueHelpDialog;

                    that._oAdvFlocValueHelpDialog.setModel(oEquipmentModel, "mAdvancedFlocValueHelp");
                    that._oAdvFlocValueHelpDialog.setModel(that._mV4MasterService, "mV4MasterService");
                    that._oAdvFlocValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oAdvFlocValueHelpDialog.open();

                    fnRemoveInputTokens(that._appNamespace);

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idAdvFlocTable");
                    if (oTable) {
                        var oBinding = oTable.getBinding("items");
                        if (oBinding) {
                            oBinding.attachDataReceived(function () {
                                var iCount = oBinding.getCount();

                                var oModel = oTable.getModel("mAdvancedFlocValueHelp");
                                if (oModel) {
                                    var sTitle = that._i18n.getResourceBundle().getText("asint.functionalLocation.valuehelp.dialog.title", [iCount]);
                                    oModel.setProperty("/data/list/functionalLocationDialogTitle", sTitle);
                                }
                            });
                        }
                    }



                    if(aFilter && aFilter.length>0) {
                        fnApplyFilters(that._appNamespace);
                    }

                    if(oColumnFilter) {
                        var oPrevColumnFilter = that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp").getProperty("/data/columnFilter");

                        
                        // for columns
                        Object.keys(oPrevColumnFilter.selectedColumns).forEach(function(sColumnKey) {
                            oPrevColumnFilter.selectedColumns[sColumnKey] = false;
                        });
                        oColumnFilter.columns.forEach(function(sColumnKey) {
                            oPrevColumnFilter.selectedColumns[sColumnKey] = true;
                        });

                        // for filters
                        Object.keys(oPrevColumnFilter.selectedFilters).forEach(function(sFilterKey) {
                            oPrevColumnFilter.selectedFilters[sFilterKey] = false;
                        });
                        oColumnFilter.filters.forEach(function(sFilterKey) {
                            oPrevColumnFilter.selectedFilters[sFilterKey] = true;
                        });

                        that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp").setProperty("/data/columnFilter", oPrevColumnFilter);
                    }

                    if(aDefaultFilters) {
                        window._technicalObjcectDefaultFilters = aDefaultFilters;

                        // oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));

                        if(aApplyFilter.length > 0) {
                            oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));
                        } else {
                            oTable.getBinding("items").filter(aDefaultFilters);
                        }

                    } else {
                        window._technicalObjcectDefaultFilters = null;

                        oTable.getBinding("items").filter(new Filter(aApplyFilter, true));
                    }


                    fnSetFilters();
                }.bind(this));
            } else {
                fnRemoveInputTokens(that._appNamespace);

                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idAdvFlocTable");
                oTable.getBinding("items").filter([]);
                // oTable.getBinding("items").filter(aFilter);
                fnClearFilters();

                if(aFilter && aFilter.length>0) {
                    fnApplyFilters(that._appNamespace);
                }

                // oTable.getBinding("items").filter(new Filter(aApplyFilter, true));

                if(aDefaultFilters) {
                    window._technicalObjcectDefaultFilters = aDefaultFilters;
                    // oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));

                    if(aApplyFilter.length > 0) {
                        oTable.getBinding("items").filter(new Filter([new Filter(aApplyFilter, true), aDefaultFilters], true));
                    } else {
                        oTable.getBinding("items").filter(aDefaultFilters);
                    }

                } else {
                    window._technicalObjcectDefaultFilters = null;
                    oTable.getBinding("items").filter(new Filter(aApplyFilter, true));
                }

                oTable.removeSelections();
                that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp").setProperty("/metadata/selectedItem", []);
                that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp").setProperty("/metadata/aSelectedId", []);
                that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp").setProperty("/metadata/selectionMode", sMode);
                that._oAdvFlocValueHelpDialog.open();
            }
        },
        
        /**
         * Function to handle functional location value help for equipment
         */
        fnHandleFlocValueHelpForEquipment: function() {
            var that = this;
            
            var aFilter = [
                {
                    inputElementId: null,
                    inputFilter: new Filter({
                        and: true,
                        filters: [
                            new Filter({ path: "srcId", operator: FilterOperator.NE, value1: null }),
                            new Filter({ path: "srcId", operator: FilterOperator.NE, value1: "" })
                        ]
                    }),
                    inputToken: null
                }
            ];

            var oColumnFilter = {
                columns: ["floc", "description", "sortField", "abcIndicator", "category", "objectType", "parentFloc", "class"],
                filters: ["criticality", "category", "objectType", "planningPlant", "maintenancePlant", "sortField", "class"]
            };

            /**
             * 
             * @param {*} oReturn 
             */
            var fnComplete = function(oReturn) {

                if (oReturn.status === "finished" && oReturn.selected) {
                    var aTokens = oReturn.selected.map(function(oFloc) {
                        return {
                            key: oFloc.ID,
                            text: oFloc.name
                        };
                    });
                    
                    if (that._oAdvEquipmentValueHelpDialog) {
                        that._oAdvEquipmentValueHelpDialog
                            .getModel("mAdvancedEquipmentValueHelp")
                            .setProperty("/data/filters/parentFloc", aTokens);
                    }
                }
            };

            this.handleFunctionalLocationValueHelp(fnComplete, true, aFilter, oColumnFilter);
        },

        /**
         * Function to show selected items when data is received in Table
         * @param {Object} oTable 
         * @param {Array} aSelectedItems 
         */
        onDataReceived: function (oTable, aSelectedItems) {
            var aTableItems = [];
            
            if(oTable) {
                aTableItems = oTable.getItems();
                oTable.removeSelections();
            }

            if(aTableItems.length && aSelectedItems.length) {
                aSelectedItems.forEach(function (oItem) {

                    var oAvailableSelectedItem = aTableItems.find(function(oRow) {
                        var oData = oRow.getBindingContext("mV4MasterService").getObject();
                        
                        if(oData) {
                            return oData.equipmentId === oItem.equipmentId;
                        }
                        return false;
                    });
                    

                    if(oAvailableSelectedItem) {
                        oTable.setSelectedItem(oAvailableSelectedItem, true, true);
                    }
                })
            }
        },

        /**
         * Function to show selected FLOC items when data is received in Table
         * @param {Object} oTable 
         * @param {Array} aSelectedItems 
         */
        onDataReceivedFloc: function (oTable, aSelectedItems) {
            var aTableItems = [];

            if (oTable) {
                aTableItems = oTable.getItems();
                oTable.removeSelections();
            }

            if (aTableItems.length && aSelectedItems.length) {
                aSelectedItems.forEach(function (oItem) {
                    var oAvailableSelectedItem = aTableItems.find(function (oRow) {
                        var oData = oRow.getBindingContext("mV4MasterService").getObject();
                        if (oData) {
                            return oData.functionalLocationId === oItem.functionalLocationId;
                        }
                        return false;
                    });

                    if (oAvailableSelectedItem) {
                        oTable.setSelectedItem(oAvailableSelectedItem, true, true);
                    }
                });
            }
        },

        /**
         * Function to handle when equipment data received table
         */
        onEquipmentDataReceived: function () {
            var mAdvancedEquipmentValueHelp = this._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp");
            var aSelectedItems = mAdvancedEquipmentValueHelp.getProperty("/metadata/selectedItem");

            var oTable = sap.ui.core.Fragment.byId(this._appNamespace,"idAdvEqpuipmentTable");

            this.onDataReceived(oTable, aSelectedItems);
        },

        /**
         * Function to handle when floc data received table
         */
        onFlocDataReceived: function () {
            var mAdvancedFlocValueHelp = this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp");
            var aSelectedItems = mAdvancedFlocValueHelp.getProperty("/metadata/selectedItem");

            var oTable = sap.ui.core.Fragment.byId(this._appNamespace, "idAdvFlocTable");
            
            this.onDataReceivedFloc(oTable, aSelectedItems);
        },

        /**
         * Function to handle equipment selection
         * @param {Object} oEvent 
         */
        onSelectEquipment: function (oEvent) {

            var mAdvancedEquipmentValueHelp = this._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp");
            var sSelectionMode = mAdvancedEquipmentValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItem = mAdvancedEquipmentValueHelp.getProperty("/metadata/selectedItem");
            var aSelectedId = mAdvancedEquipmentValueHelp.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    if (!aSelectedId.includes(oContext.equipmentId)) {
                        aSelectedId.push(oContext.equipmentId);
                        aSelectedItem.push(oItem.getBindingContext("mV4MasterService").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    var index = aSelectedId.indexOf(oContext.equipmentId);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.equipmentId !== oContext.equipmentId;
                        });
                    }
                });
            }

            mAdvancedEquipmentValueHelp.setProperty("/metadata/selectedItem", aSelectedItem);
            mAdvancedEquipmentValueHelp.setProperty("/metadata/aSelectedId", aSelectedId);

            mAdvancedEquipmentValueHelp.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("EQUI");
            }

        },

        /**
         * Function to return data using call back function
         */
        fnReturnData: function (sType) {
            var aSelectedItem, oReturn = {};
            if (sType === "EQUI") {
                var mAdvancedEquipmentValueHelp = this._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp");
                aSelectedItem = mAdvancedEquipmentValueHelp.getProperty("/metadata/selectedItem");
                oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    //var oEquipmentData = oItem.getBindingContext("mV4MasterService").getObject();
                    oReturn.selected.push(Object.assign({
                        "ID": oItem.equipmentId,
                        // "srcId": oItem.srcId,
                        "name": oItem.name,
                        "to_description": oItem.equipmentDescription
                        // "parentlocationId":oItem.parent_functional_location_ID,
                        // "_objectType": oItem._objectType
                    }, oItem));
                });

                this._fnEventForEquipment(oReturn);
                this.onAdvEquipmentValueHelpDialogClose();
            } else if (sType === "FLOC") {
                
                var mAdvancedFlocValueHelp = this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp");
                aSelectedItem = mAdvancedFlocValueHelp.getProperty("/metadata/selectedItem");
                oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    //var oFunctionalLocationData = oItem.getBindingContext("mV4MasterService").getObject();

                    oReturn.selected.push(Object.assign({
                        "ID": oItem.functionalLocationId,
                        // "srcId": oItem.srcId,
                        "name": oItem.name,
                        "to_description": oItem.functionalLocationDescription,
                        // "_objectType": oItem._objectType
                    }, oItem));
                });

                this.onAdvFlocValueHelpDialogClose();
                this._fnEventForFunctionalLocation(oReturn);
            }

        },

        /**
         * Function to handle location selection
         */
        onSelectFunctionalLocation: function (oEvent) {

            var mAdvancedFlocValueHelp = this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp");
            var sSelectionMode = mAdvancedFlocValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItem = mAdvancedFlocValueHelp.getProperty("/metadata/selectedItem");
            var aSelectedId = mAdvancedFlocValueHelp.getProperty("/metadata/aSelectedId");
            var aChangedItems = oEvent.getParameter("listItems");
            if (!aChangedItems) {
                var oListItem = oEvent.getParameter("listItem");
                aChangedItems = oListItem ? [oListItem] : [];
            }
            var isSelected = oEvent.getParameter("selected");
            
            if (isSelected) {
                aChangedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    if (!aSelectedId.includes(oContext.functionalLocationId)) {
                        aSelectedId.push(oContext.functionalLocationId);
                        aSelectedItem.push(oContext);
                    }
                });
            } else {
                aChangedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    var index = aSelectedId.indexOf(oContext.functionalLocationId);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.functionalLocationId !== oContext.functionalLocationId;
                        });
                    }
                });
            }

            mAdvancedFlocValueHelp.setProperty("/metadata/selectedItem", aSelectedItem);
            mAdvancedFlocValueHelp.setProperty("/metadata/aSelectedId", aSelectedId);

            mAdvancedFlocValueHelp.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("FLOC");
            }

        },

        /**
         * Function to handle equipment dialog confirm
         */
        onAdvEquipmentValueHelpDialogConfirm: function () {

            this.fnReturnData("EQUI");

        },

        /**
         * Function to handle location dialog confirm
         */
        onAdvFlocValueHelpDialogConfirm: function () {

            this.fnReturnData("FLOC");

        },

        /**
         * Function to handle equipment dialog close
         */
        onAdvEquipmentValueHelpDialogClose: function () {
            var oEquipmentTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idAdvEqpuipmentTable"));

            oEquipmentTable.removeSelections();

            this._oAdvEquipmentValueHelpDialog.destroy();
            this.oVariantManagementAdvEquipment=null;
            this._oAdvEquipmentValueHelpDialog = null;
            
            // this._oAdvEquipmentValueHelpDialog.close();
            
            this._fnEventForEquipment({
                status: "closed",
                selected: []
            });
        },

        /**
         * Function to handle location dialog close
         */
        onAdvFlocValueHelpDialogClose: function () {
            var oFunctionalLocationTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idAdvFlocTable"));

            oFunctionalLocationTable.removeSelections();

            this._oAdvFlocValueHelpDialog.destroy();
            this.oVariantManagementAdvFloc = null;
            this._oAdvFlocValueHelpDialog = null;

            // this._oAdvFlocValueHelpDialog.close();
            
            this._fnEventForFunctionalLocation({
                status: "closed",
                selected: []
            });
        },

        /**
         * Function to handle value helps
         * @param {String} sObjectType 
         * @param {String} sMode 
         */
        fnHandleValueHelp : function(sObjectType, sMode){
            var oModel = this._oGenericValueHelpDialog.getModel("mGenericValuehelp");
            var i18n = this._oGenericValueHelpDialog.getModel("i18n").getResourceBundle();

            var oDialogData;
            switch(sObjectType){
            case "Location":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.assessment.field.selectLocation.text"),
                    "objectType":"LOC",
                    "mode":sMode,
                    "path":"/data/filters/location"
                };
                break;
            case "PlanningPlant":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectPlanningPlant"),
                    "objectType":"PLPT",
                    "mode":sMode,
                    "path":"/data/filters/planningPlant"
                };
                break;
            case "MaintPlant":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectMaintenancePlant"),
                    "objectType":"PLMT",
                    "mode":sMode,
                    "path":"/data/filters/maintPlant"
                };
                break;
            case "Category":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectCategory"),
                    "objectType":"EQUI",
                    "mode":sMode,
                    "path":"/data/filters/category"
                };
                break;
            case "PlannerGroup":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectPlannerGroup"),
                    "objectType":"PRGP",
                    "mode":sMode,
                    "path":"/data/filters/plannerGroup"
                };
                break;
            case "MainWorkCenter":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectMainworkcenter"),
                    "objectType":"WCTR",
                    "mode":sMode,
                    "path":"/data/filters/mainWorkCenter"
                };
                break;
            case "CatalogProfile":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectCatalogProfile"),
                    "objectType":"CTPL",
                    "mode":sMode,
                    "path":"/data/filters/catalogProfile"
                };
                break;
            case "ABCIndicator":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectCriticality"),
                    "objectType":"ABCIndicator",
                    "mode":sMode,
                    "path":"/data/filters/abcIndicator"
                };
                break;
            case "ObjectType":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectObjectType"),
                    "objectType":"OBTP",
                    "mode":sMode,
                    "path":"/data/filters/objectType"
                };
                break;
            case "MDA":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectMda"),
                    "objectType":"MDA",
                    "mode":sMode,
                    "path":"/data/filters/mda"
                };
                break;
            case "PlantSection":
                oDialogData = {
                    "dialogHeader" : i18n.getText("asint.advEquipment.list.table.selectPlantSection"),
                    "objectType": "PLSC",
                    "mode": sMode,
                    "path": "/data/filters/plantSection"
                };
                break;
            }
            oModel.setProperty("/data/genericValueHelp", oDialogData);
            this.fnGenValueHelpApplyFilter(oDialogData.objectType);
        },

        /**
         * Function to open generic value help dialog
         * @param {Object} oEvent 
         * @param {String} sObjectType 
         * @param {String} sMode 
         */
        fnOpenGenericValueHelpFilters: function (oEvent, sObjectType, sMode) {

            var that = this;
            if (!this._oGenericValueHelpDialog) {
                Fragment.load({
                    id: "idGenericValueHelpFragment",
                    name: "com.asint.ais.library.fragment.GenericValuehelp",
                    controller: this
                }).then(function (oDialog) {
                    
                    var oGenericValuehelpModel = new JSONModel({
                        "data" : {
                            "genericValueHelp" : {}
                        }
                    })
                    that._oGenericValueHelpDialog = oDialog;

                    that._oGenericValueHelpDialog.setModel(oGenericValuehelpModel, "mGenericValuehelp");
                    that._oGenericValueHelpDialog.setModel(that._mV4ValueHelpService, "mV4ValueHelpService");
                    that._oGenericValueHelpDialog.setModel(that._i18n, "i18n");
                    that.fnHandleValueHelp(sObjectType,sMode);
                    that._oGenericValueHelpDialog.open();
                }.bind(this));
            } else {
                that.fnHandleValueHelp(sObjectType,sMode);
                this._oGenericValueHelpDialog.open();
            }
        },

        /**
        * Function to apply filter
        * @param {String} sObjectType 
        */
        fnGenValueHelpApplyFilter: function (sObjectType) {
            var oTable = "";
            var oBinding = "";
            var oFilter = [];
            oTable =  sap.ui.core.Fragment.byId("idGenericValueHelpFragment","idDetailGenericvalueHelpTable");
            oBinding = oTable.getBinding("items");

            oFilter = new Filter([
                new Filter("objectType", FilterOperator.EQ, sObjectType),
                new Filter("language", FilterOperator.EQ, "EN")
            ], true);
            oBinding.filter(oFilter);
        },

        /**
         * Function to search in generic value help dialog fOR IDMS FILTER
         * @param {Object} oEvent 
         */
        onDetailGenValueHelpSearch: function (oEvent) {
            var oModel = this._oGenericValueHelpDialog.getModel("mGenericValuehelp");
            var sQuery = oEvent.getParameter("query");
            
            if(sQuery){
                sQuery = sQuery.trim();
            }
            var objectType = oModel.getProperty("/data/genericValueHelp/objectType");
            var aFilters = [];
            var oObjectTypeFilter;
            oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, objectType);
            if (sQuery && sQuery.length > 0) {
                var aSearchFilters = [
                    new Filter({path:"name", operator:FilterOperator.Contains,value1:sQuery,caseSensitive: false}),
                    new Filter({path:"description", operator:FilterOperator.Contains,value1:sQuery,caseSensitive: false}),
                ];
                var oSearchFilter = new sap.ui.model.Filter({
                    filters: aSearchFilters,
                    and: false
                });
                aFilters.push(new sap.ui.model.Filter({
                    filters: [oObjectTypeFilter, oSearchFilter],
                    and: true
                }));
            } else {
                aFilters.push(oObjectTypeFilter);
            }
            aFilters.push(new sap.ui.model.Filter("language", sap.ui.model.FilterOperator.EQ, "EN"));
            var oTable =  sap.ui.core.Fragment.byId("idGenericValueHelpFragment","idDetailGenericvalueHelpTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        /**
         * Function to confirm convert notification  fOR IDMS FILTER
        */
        onConfrimDetailGenValueHelpDialog: function () {
            var that = this;
            var oModel = this._oGenericValueHelpDialog.getModel("mGenericValuehelp");
            var mAdvancedEquipmentValueHelp = that._oAdvEquipmentValueHelpDialog ? that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp") : null;
            var mAdvancedFlocValueHelp = this._oAdvFlocValueHelpDialog ? this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp") : null;
            var oDialogData = oModel.getProperty("/data/genericValueHelp");

            // console.log("oDialogData", oDialogData)
            var sPath = oDialogData.path;
            var oTable = sap.ui.core.Fragment.byId("idGenericValueHelpFragment","idDetailGenericvalueHelpTable");
            var selectedItems = [];
            if (oTable) {
                var aSelected  = oTable.getSelectedItems();
                aSelected.forEach(function(oItem){
                    var oRow = oItem.getBindingContext("mV4ValueHelpService").getObject();
                    var oTokenObj = {
                        "key": oDialogData.objectType === "MDA" ? oRow.description : oRow.name,
                        "text": oDialogData.objectType === "MDA" ? oRow.description :oRow.name
                    }
                    selectedItems.push(oTokenObj);
                })
            }
            if(mAdvancedEquipmentValueHelp){
                mAdvancedEquipmentValueHelp.setProperty(sPath, selectedItems);
            }
            if(mAdvancedFlocValueHelp){
                mAdvancedFlocValueHelp.setProperty(sPath, selectedItems);
            }
            this.onCloseDetailGenValueHelpDialog();
        },

        /**
         * Function to close valueHelp Dialog 
         */
        onCloseDetailGenValueHelpDialog: function () {
            if (this._oGenericValueHelpDialog) {
                var oTable = sap.ui.core.Fragment.byId("idGenericValueHelpFragment","idDetailGenericvalueHelpTable");
                oTable.removeSelections();
                var oBinding = oTable.getBinding("items");
                var oFilter = new Filter("objectType", FilterOperator.EQ, "AsintAsint");
                oBinding.filter([oFilter]);

                var oSearchField = sap.ui.core.Fragment.byId("idGenericValueHelpFragment","idDetailGenericValueHelpSearchField");
                if (oSearchField) {
                    oSearchField.setValue("");
                }

                // this._oGenericValueHelpDialog.close();
                this._oGenericValueHelpDialog.destroy();
                this._oGenericValueHelpDialog = null;
            }
        },

        /**
        * Function that trigers when an token is removed 
        * @param {Object} oEvent 
        */
        onRemoveMultiInputToken: function (oEvent) {
            var that = this;
            var mAdvancedEquipmentValueHelp = that._oAdvEquipmentValueHelpDialog ? that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp") : null;
            var mAdvancedFlocValueHelp = this._oAdvFlocValueHelpDialog ? this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp") : null;
            var removedItems = oEvent.getParameter("removedTokens");

            if(mAdvancedEquipmentValueHelp){
                if (removedItems.length > 0) {
                    removedItems.forEach(function (removedItem) {
                        var oBindingContext = removedItem.getBindingContext("mAdvancedEquipmentValueHelp");
                        if (oBindingContext) {
                            var sPath = removedItem.getBindingContext("mAdvancedEquipmentValueHelp").getPath();
                            var modelPath = sPath.split("/");
                            modelPath.pop();
                            modelPath = modelPath.join("/");
                            var modelList = mAdvancedEquipmentValueHelp.getProperty(modelPath);
                            var iIndex = modelList.findIndex(function (item) {
                                return item === oBindingContext.getObject();
                            });
                            if (iIndex !== -1) {
                                modelList.splice(iIndex, 1);
                                mAdvancedEquipmentValueHelp.setProperty(modelPath, modelList);
                            }
                        }
                    })
                }
            }else if(mAdvancedFlocValueHelp){
                if (removedItems.length > 0) {
                    removedItems.forEach(function (removedItem) {
                        var oBindingContext = removedItem.getBindingContext("mAdvancedFlocValueHelp");
                        if (oBindingContext) {
                            var sPath = removedItem.getBindingContext("mAdvancedFlocValueHelp").getPath();
                            var modelPath = sPath.split("/");
                            modelPath.pop();
                            modelPath = modelPath.join("/");
                            var modelList = mAdvancedFlocValueHelp.getProperty(modelPath);
                            var iIndex = modelList.findIndex(function (item) {
                                return item === oBindingContext.getObject();
                            });
                            if (iIndex !== -1) {
                                modelList.splice(iIndex, 1);
                                mAdvancedFlocValueHelp.setProperty(modelPath, modelList);
                            }
                        }
                    })
                }
            }
            
        },

        /**
        * Function that updates the table selection
        * @param {Object} oEvent 
        */
        onValueHelpUpdateFinish: function (oEvent) {
            var that = this;
            var selectionMode = oEvent.getSource().getMode();
            var valueHelpSelectedItems = oEvent.getSource().getItems();
            var selectedItems = [];
            var mAdvancedEquipmentValueHelp = that._oAdvEquipmentValueHelpDialog ? that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp") : null;
            var mAdvancedFlocValueHelp = this._oAdvFlocValueHelpDialog ? this._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp") : null;
            var oModel = this._oGenericValueHelpDialog.getModel("mGenericValuehelp");
            var sPath = oModel.getProperty("/data/genericValueHelp/path");
            if (selectionMode === "MultiSelect") {
                if (valueHelpSelectedItems.length > 0) {
                    if (mAdvancedFlocValueHelp) {
                        selectedItems = mAdvancedFlocValueHelp.getProperty(sPath);
                    }else if(mAdvancedEquipmentValueHelp){
                        selectedItems = mAdvancedEquipmentValueHelp.getProperty(sPath);
                    }
                    if (selectedItems && selectedItems.length > 0) {
                        var aSelected = selectedItems.map(function (oItem) {
                            return oItem.key;
                        });
                        valueHelpSelectedItems.forEach(function (item) {
                            var oContext = item.getBindingContext("mV4ValueHelpService").getProperty("name");
                            if (aSelected.includes(oContext)) {
                                item.setSelected(true);
                            } else {
                                item.setSelected(false);
                            }
                        });
                    } else {
                        valueHelpSelectedItems.forEach(function (item) {
                            item.setSelected(false);
                        });
                    }
                }
            }
        },

        /**
         * Function to open dialog / fragment for advance Filters
         * @param {String} sFragmentId 
         * @param {String} sFragmentName 
         * @param {String} sFragmentInstanceVarName 
        */
        onOpenAdvancedEqFilterDialog: function (sFragmentId, sFragmentName, sFragmentInstanceVarName, sInputId, sTableId, sType) {
            var that = this;
            var oInput = sap.ui.core.Fragment.byId(that._appNamespace,sInputId);
            var oModel = that._oAdvEquipmentValueHelpDialog.getModel("mAdvancedEquipmentValueHelp");

            var aFilters = null;
            // var oTable = sap.ui.core.Fragment.byId(sFragmentId, sTableId);
            // console.log("oTable", oTable);

            if(sFragmentName === "class") {
                aFilters = new Filter({
                    path: "classType",
                    operator: FilterOperator.EQ,
                    value1: sType === "EQUI" ? "002" : "003",
                    caseSensitive: false,
                });
            }

            this.valueHelpFilter.onOpenValuHelpFilterDialog(
                null,
                sFragmentId,
                sFragmentName,
                sFragmentInstanceVarName,
                oModel,
                oInput,
                true,
                { sTableId, aFilters },
            );
        },

        /**
         * Function to open dialog / fragment for advance Filters
         * @param {String} sFragmentId 
         * @param {String} sFragmentName 
         * @param {String} sFragmentInstanceVarName 
         */
        onOpenAdvancedFlocFilterDialog: function (sFragmentId, sFragmentName, sFragmentInstanceVarName, sInputId, sTableId, sType) {
            var that = this;
            var oInput = sap.ui.core.Fragment.byId(that._appNamespace,sInputId);
            var oModel = that._oAdvFlocValueHelpDialog.getModel("mAdvancedFlocValueHelp");

            var aFilters = null;

            if(sFragmentName === "class") {
                aFilters = new Filter({
                    path: "classType",
                    operator: FilterOperator.EQ,
                    value1: sType === "FLOC" ? "003" : "002",
                    caseSensitive: false,
                });
            }

            this.valueHelpFilter.onOpenValuHelpFilterDialog(
                null,
                sFragmentId,
                sFragmentName,
                sFragmentInstanceVarName,
                oModel,
                oInput,
                true,
                { sTableId, aFilters },
            );
        },

    });

});