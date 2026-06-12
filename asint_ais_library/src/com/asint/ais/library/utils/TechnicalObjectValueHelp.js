sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/datasource/asint/Common"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator, CommonDatasource) {

    return Formatter.extend("com.asint.ais.library.utils.TechnicalObjectValueHelp", {

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
            if (sType === "EQUI" && this._oEquipmentValueHelpDialog) {
                var oModel = this._oEquipmentValueHelpDialog.getModel("mEquipmentValueHelp");
                oModel.setProperty("/metadata/featureFlag", this._featureFlagConfig);
            } else if (sType === "FLOC" && this._oFunctionalLocationValueHelpDialog) {
                var oFlocModel = this._oFunctionalLocationValueHelpDialog.getModel("mFunctionalLocationValueHelp");
                oFlocModel.setProperty("/metadata/featureFlag", this._featureFlagConfig);
            }
        },

        /**
         * Function to handle equipment value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter 
         */
        handleEquipmentValueHelp: function (_fnEvent, bTableMode, aFilter) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForEquipment = _fnEvent;
            this._defaultFilterForEquipment = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            if (!this._oEquipmentValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.DialogEquipmentValueHelp",
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
                            "equi":[]
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

                    that._oEquipmentValueHelpDialog = oValueHelpDialog;

                    that._oEquipmentValueHelpDialog.setModel(oEquipmentModel, "mEquipmentValueHelp");
                    that._oEquipmentValueHelpDialog.setModel(that._mV4MasterService, "mV4MasterService");
                    that._oEquipmentValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oEquipmentValueHelpDialog.open();
                    
                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace,"idEqpuipmentTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace,"idEqpuipmentTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                
                if(sSearchFieldVal) {
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oEquipmentValueHelpDialog.getModel("mEquipmentValueHelp").setProperty("/metadata/selectedItem", []);
                that._oEquipmentValueHelpDialog.getModel("mEquipmentValueHelp").setProperty("/metadata/aSelectedId", []);
                that._oEquipmentValueHelpDialog.getModel("mEquipmentValueHelp").setProperty("/metadata/selectionMode", sMode);
                that._oEquipmentValueHelpDialog.open();
            }

        },

        /**
         * Function to handle Functional Location value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter 
         */
        handleFunctionalLocationValueHelp: function (_fnEvent, bTableMode, aFilter, isApp) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForFunctionalLocation = _fnEvent;
            this._defaultFilterForFunctionalLocation = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            var sFragmentName = isApp === "UA" ? "com.asint.ais.library.fragment.DialogUserAdminFunctionalLocationValueHelp" : "com.asint.ais.library.fragment.DialogFunctionalLocationValueHelp";

            if (!this._oFunctionalLocationValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: sFragmentName,
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oFunctionalLocationModel = new JSONModel({
                        "data":{
                            "fLoc":[
                                {
                                    "ID": "0df56ebb-8fa2-6e3c6f1d1c0c",
                                    "name": "BT01-ACDU-8IPC",
                                    "to_description": [{                         
                                        "shortDescription": "8\" Piping Circuit"
                                    }],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "bb-cf10-49c3-8fa2-6e3c6f1d1c0c",
                                    "name": "BT01-ACDU-COL1",
                                    "to_description": [{                         
                                        "shortDescription": "Corrosion Loop 1"
                                    }],
                                    "_objectType": "Pipes (1002)"
                                },
                                {
                                    "ID": "0df56ebb-cf10-49c3-6e3c6f1d1c0c",
                                    "name": "BT01-ACDU-VES1",
                                    "to_description": [{                         
                                        "shortDescription": "Vessel-1"
                                    }],
                                    "_objectType": "Pressure Vessel (1001)"
                                },
                            ],
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

                    that._oFunctionalLocationValueHelpDialog = oValueHelpDialog;
                    that._oFunctionalLocationValueHelpDialog.setModel(oFunctionalLocationModel, "mFunctionalLocationValueHelp");
                    that._oFunctionalLocationValueHelpDialog.setModel(that._mV4MasterService, "mV4MasterService");
                    that._oFunctionalLocationValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oFunctionalLocationValueHelpDialog.open();

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idFunctionalLocationTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idFunctionalLocationTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                
                if(sSearchFieldVal){
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oFunctionalLocationValueHelpDialog.getModel("mFunctionalLocationValueHelp").setProperty("/metadata/selectedItem", []);
                that._oFunctionalLocationValueHelpDialog.getModel("mFunctionalLocationValueHelp").setProperty("/metadata/aSelectedId", []);
                that._oFunctionalLocationValueHelpDialog.open();
            }

        },

        /**
         * Function to handle equipment selection
         * @param {Object} oEvent 
         */
        onSelectEquipment: function (oEvent) {

            var mEquipmentValueHelp = this._oEquipmentValueHelpDialog.getModel("mEquipmentValueHelp");
            var sSelectionMode = mEquipmentValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItem = mEquipmentValueHelp.getProperty("/metadata/selectedItem");
            var aSelectedId = mEquipmentValueHelp.getProperty("/metadata/aSelectedId");
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

            mEquipmentValueHelp.setProperty("/metadata/selectedItem", aSelectedItem);
            mEquipmentValueHelp.setProperty("/metadata/aSelectedId", aSelectedId);

            mEquipmentValueHelp.setProperty("/metadata/selectedCount", aSelectedItem.length);
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
                var mEquipmentValueHelp = this._oEquipmentValueHelpDialog.getModel("mEquipmentValueHelp");
                var oEquipmentTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idEqpuipmentTable"));
                aSelectedItem = mEquipmentValueHelp.getProperty("/metadata/selectedItem");
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
                this._oEquipmentValueHelpDialog.close();
                oEquipmentTable.removeSelections();
            } else if (sType === "FLOC") {
                
                var mFunctionalLocationValueHelp = this._oFunctionalLocationValueHelpDialog.getModel("mFunctionalLocationValueHelp");
                var oFunctionalLocationTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idFunctionalLocationTable"));
                aSelectedItem = mFunctionalLocationValueHelp.getProperty("/metadata/selectedItem");
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

                this._oFunctionalLocationValueHelpDialog.close();
                this._fnEventForFunctionalLocation(oReturn);
                oFunctionalLocationTable.removeSelections();
            }

        },

        /**
         * Function to handle location selection
         */
        onSelectFunctionalLocation: function (oEvent) {

            var mFunctionalLocationValueHelp = this._oFunctionalLocationValueHelpDialog.getModel("mFunctionalLocationValueHelp");
            var sSelectionMode = mFunctionalLocationValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItem = mFunctionalLocationValueHelp.getProperty("/metadata/selectedItem");
            var aSelectedId = mFunctionalLocationValueHelp.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    if (!aSelectedId.includes(oContext.functionalLocationId)) {
                        aSelectedId.push(oContext.functionalLocationId);
                        aSelectedItem.push(oItem.getBindingContext("mV4MasterService").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
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

            mFunctionalLocationValueHelp.setProperty("/metadata/selectedItem", aSelectedItem);
            mFunctionalLocationValueHelp.setProperty("/metadata/aSelectedId", aSelectedId);

            mFunctionalLocationValueHelp.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("FLOC");
            }

        },

        /**
         * Function to handle search
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {

            var sQuery = oEvent.getParameter("query");
            var aFilter = [], aFilters = [];
            var oTable = oEvent.getSource().getParent().getParent();
            var aDefaultFilter = [];
            if(oTable.getId().includes("idEqpuipmentTable")) {
                aDefaultFilter = this._defaultFilterForEquipment;
            }
            if(oTable.getId().includes("idFunctionalLocationTable")) {
                aDefaultFilter = this._defaultFilterForFunctionalLocation;
            }
            /**
             * Function to merge filters
             * @param {Array} aFilter 
             * @param {Boolean} isAnd 
             * @returns 
             */
            var fnMergeFilter = function(aFilter, isAnd) {
                return new Filter({
                    and: isAnd || false,
                    filters: aFilter
                })
            };

            if (sQuery) {

                aFilter.push(new Filter({
                    path: "sortField",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                }));

                if(oTable.getId().includes("idEqpuipmentTable")) {
                    aDefaultFilter = this._defaultFilterForEquipment;

                    aFilter.push(new Filter({
                        path: "name",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "equipmentDescription",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "technicalObjectSortCode",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));
                }

                if(oTable.getId().includes("idFunctionalLocationTable")) {
                    aDefaultFilter = this._defaultFilterForFunctionalLocation;

                    aFilter.push(new Filter({
                        path: "name",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "functionalLocationDescription",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));
                }

                if(aDefaultFilter && aDefaultFilter.length > 0) {
                    aFilters.push(fnMergeFilter(aFilter));
                    aFilters = aFilters.concat(aDefaultFilter);
                    
                    oTable.getBinding("items").filter(new Filter({
                        and: true,
                        filters: aFilters
                    }));
                } else {
                    aFilters.push(fnMergeFilter(aFilter));
                    oTable.getBinding("items").filter(aFilters);
                }

            }else{
                if(aDefaultFilter && aDefaultFilter.length > 0) {
                    oTable.getBinding("items").filter(aDefaultFilter);
                } else {
                    oTable.getBinding("items").filter([]);
                }
            }
        },

        /**
         * Function to handle equipment dialog confirm
         */
        onEquipmentValueHelpDialogConfirm: function () {

            this.fnReturnData("EQUI");

        },

        /**
         * Function to handle location dialog confirm
         */
        onFunctionalLocationValueHelpDialogConfirm: function () {

            this.fnReturnData("FLOC");

        },

        /**
         * Function to handle equipment dialog close
         */
        onEquipmentValueHelpDialogClose: function () {
            var oEquipmentTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idEqpuipmentTable"));
            this._oEquipmentValueHelpDialog.close();
            this._fnEventForEquipment({
                status: "closed",
                selected: []
            });
            oEquipmentTable.removeSelections();

        },

        /**
         * Function to handle location dialog close
         */
        onFunctionalLocationValueHelpDialogClose: function () {
            var oFunctionalLocationTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idFunctionalLocationTable"));
            this._oFunctionalLocationValueHelpDialog.close();
            this._fnEventForFunctionalLocation({
                status: "closed",
                selected: []
            });
            oFunctionalLocationTable.removeSelections();
        }

    });

});