sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator) {

    return Formatter.extend("com.asint.ais.library.utils.EnumValueHelp", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        _fnEventForNotificationStatus: null,
        _defaultFilterForNotificationStatus: [],
        _fnEventForMOStatus: null,
        _defaultFilterForMOStatus: [],
        _fnEventForGenericEnum : null,
        _defaultFilterForGenericEnum: [],

        /**
         * Constructor
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;
            this._i18n = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

            if(this._baseURI && this._baseURI.includes(".asintais.")) {
                this._appNamespace = this._baseURI.substring(this._baseURI.indexOf(".asintais.") + 10);
            }

        },

        /**
         * Function to handle Notification status value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter
         * @param {Array} aEnumValue
         */
        handleNotificationStatusValueHelp: function (_fnEvent, bTableMode, aFilter,aEnumValue) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForNotificationStatus = _fnEvent;
            this._defaultFilterForNotificationStatus = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            if (!this._oNotificationStatusValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.DialogNotificationStatusValueHelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oNotificationStatusModel = new JSONModel({
                        "data":aEnumValue,
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                        }
                    });

                    that._oNotificationStatusValueHelpDialog = oValueHelpDialog;
                    that._oNotificationStatusValueHelpDialog.setModel(oNotificationStatusModel, "mNotificationStatusModel");
                    that._oNotificationStatusValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oNotificationStatusValueHelpDialog.open();

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idNotificationStatusTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idNotificationStatusTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                
                if(sSearchFieldVal){
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oNotificationStatusValueHelpDialog.getModel("mNotificationStatusModel").setProperty("/metadata/selectedItem", []);
                that._oNotificationStatusValueHelpDialog.getModel("mNotificationStatusModel").setProperty("/metadata/aSelectedId", []);
                that._oNotificationStatusValueHelpDialog.open();
            }

        },

        /**
         * Function to handle MO status value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter
         * @param {Array} aEnumValue
         */
        handleMOStatusValueHelp: function (_fnEvent, bTableMode, aFilter,aEnumValue) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForMOStatus = _fnEvent;
            this._defaultFilterForMOStatus = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            if (!this._oMOStatusValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.DialogMOStatusValueHelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oMOStatusModel = new JSONModel({
                        "data":aEnumValue,
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                        }
                    });

                    that._oMOStatusValueHelpDialog = oValueHelpDialog;
                    that._oMOStatusValueHelpDialog.setModel(oMOStatusModel, "mMOStatusModel");
                    that._oMOStatusValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oMOStatusValueHelpDialog.open();

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idMOStatusTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idMOStatusTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                
                if(sSearchFieldVal){
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oMOStatusValueHelpDialog.getModel("mMOStatusModel").setProperty("/metadata/selectedItem", []);
                that._oMOStatusValueHelpDialog.getModel("mMOStatusModel").setProperty("/metadata/aSelectedId", []);
                that._oMOStatusValueHelpDialog.open();
            }

        },

        /**
         * Function to handle user and system status value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter
         * @param {Array} aEnumValue
         * @param {String} sTableTitle
         */
        handleGenericEnumValueHelp: function (_fnEvent, bTableMode, aFilter,aEnumValue,sTableTitle) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForGenericEnum = _fnEvent;
            this._defaultFilterGenericEnum = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            if (!this._oGenericEnumValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.DialogGenericEnumValueHelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oGenericEnumModel = new JSONModel({
                        "data":aEnumValue,
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                            "tableTitle":sTableTitle
                        }
                    });

                    that._oGenericEnumValueHelpDialog = oValueHelpDialog;
                    that._oGenericEnumValueHelpDialog.setModel(oGenericEnumModel, "mGenericEnumModel");
                    that._oGenericEnumValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oGenericEnumValueHelpDialog.open();

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idGenericEnumTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idGenericEnumTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                var oMetadata = {
                    "selectionMode": sMode,
                    "selectedCount": 0,
                    "selectedItem": [],
                    "aSelectedId": [],
                    "tableTitle": sTableTitle
                }                
                if(sSearchFieldVal){
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oGenericEnumValueHelpDialog.getModel("mGenericEnumModel").setProperty("/metadata",oMetadata);
                that._oGenericEnumValueHelpDialog.getModel("mGenericEnumModel").setProperty("/data", aEnumValue);
                that._oGenericEnumValueHelpDialog.open();
            }

        },

        /**
         * Function to return data using call back function
         */
        fnReturnData: function (sType) {
            var aSelectedItem, oReturn = {};
            if (sType === "NOTIFICATION_STATUS") {
                
                var mNotificationStatusModel = this._oNotificationStatusValueHelpDialog.getModel("mNotificationStatusModel");
                var oNotificationStatusTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idNotificationStatusTable"));
                aSelectedItem = mNotificationStatusModel.getProperty("/metadata/selectedItem");
                oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    oReturn.selected.push(Object.assign({
                        "name": oItem.code,
                    }, oItem));
                });

                this._oNotificationStatusValueHelpDialog.close();
                this._fnEventForNotificationStatus(oReturn);
                oNotificationStatusTable.removeSelections();
            }else if (sType === "MO_STATUS"){
                var mMOStatusModel = this._oMOStatusValueHelpDialog.getModel("mMOStatusModel");
                var oMOStatusTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idMOStatusTable"));
                aSelectedItem = mMOStatusModel.getProperty("/metadata/selectedItem");
                oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    oReturn.selected.push(Object.assign({
                        "name": oItem.code,
                    }, oItem));
                });

                this._oMOStatusValueHelpDialog.close();
                this._fnEventForMOStatus(oReturn);
                oMOStatusTable.removeSelections();
            }else if(sType === "GENERIC_ENUM"){
                var mGenericEnumModel = this._oGenericEnumValueHelpDialog.getModel("mGenericEnumModel");
                var oGenericEnumTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idGenericEnumTable"));
                aSelectedItem = mGenericEnumModel.getProperty("/metadata/selectedItem");
                oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    oReturn.selected.push(Object.assign({
                        "name": oItem.code,
                    }, oItem));
                });

                this._oGenericEnumValueHelpDialog.close();
                this._fnEventForGenericEnum(oReturn);
                oGenericEnumTable.removeSelections();
            }

        },

        /**
         * Function to handle Notification status selection
         * @param {Object} oEvent 
         */
        onSelectNotificationStatus: function (oEvent) {

            var mNotificationStatusModel = this._oNotificationStatusValueHelpDialog.getModel("mNotificationStatusModel");
            var sSelectionMode = mNotificationStatusModel.getProperty("/metadata/selectionMode");
            var aSelectedItem = mNotificationStatusModel.getProperty("/metadata/selectedItem");
            var aSelectedId = mNotificationStatusModel.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mNotificationStatusModel").getObject();
                    if (!aSelectedId.includes(oContext.code)) {
                        aSelectedId.push(oContext.code);
                        aSelectedItem.push(oItem.getBindingContext("mNotificationStatusModel").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mNotificationStatusModel").getObject();
                    var index = aSelectedId.indexOf(oContext.code);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.code !== oContext.code;
                        });
                    }
                });
            }

            mNotificationStatusModel.setProperty("/metadata/selectedItem", aSelectedItem);
            mNotificationStatusModel.setProperty("/metadata/aSelectedId", aSelectedId);

            mNotificationStatusModel.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("NOTIFICATION_STATUS");
            }

        },

        /**
         * Function to handle MO status selection
         * @param {Object} oEvent 
         */
        onSelectMOStatus: function (oEvent) {

            var mMOStatusModel = this._oMOStatusValueHelpDialog.getModel("mMOStatusModel");
            var sSelectionMode = mMOStatusModel.getProperty("/metadata/selectionMode");
            var aSelectedItem = mMOStatusModel.getProperty("/metadata/selectedItem");
            var aSelectedId = mMOStatusModel.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mMOStatusModel").getObject();
                    if (!aSelectedId.includes(oContext.code)) {
                        aSelectedId.push(oContext.code);
                        aSelectedItem.push(oItem.getBindingContext("mMOStatusModel").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mMOStatusModel").getObject();
                    var index = aSelectedId.indexOf(oContext.code);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.code !== oContext.code;
                        });
                    }
                });
            }

            mMOStatusModel.setProperty("/metadata/selectedItem", aSelectedItem);
            mMOStatusModel.setProperty("/metadata/aSelectedId", aSelectedId);

            mMOStatusModel.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("NOTIFICATION_STATUS");
            }

        },

        /**
         * Function to handle Generic enum selection
         * @param {Object} oEvent 
         */
        onSelectGenericEnum: function (oEvent) {

            var mGenericEnumModel = this._oGenericEnumValueHelpDialog.getModel("mGenericEnumModel");
            var sSelectionMode = mGenericEnumModel.getProperty("/metadata/selectionMode");
            var aSelectedItem = mGenericEnumModel.getProperty("/metadata/selectedItem");
            var aSelectedId = mGenericEnumModel.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mGenericEnumModel").getObject();
                    if (!aSelectedId.includes(oContext.name)) {
                        aSelectedId.push(oContext.name);
                        aSelectedItem.push(oItem.getBindingContext("mGenericEnumModel").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mGenericEnumModel").getObject();
                    var index = aSelectedId.indexOf(oContext.name);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.name !== oContext.name;
                        });
                    }
                });
            }

            mGenericEnumModel.setProperty("/metadata/selectedItem", aSelectedItem);
            mGenericEnumModel.setProperty("/metadata/aSelectedId", aSelectedId);

            mGenericEnumModel.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("GENERIC_ENUM");
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
            if(oTable.getId().includes("idNotificationStatusTable")) {
                aDefaultFilter = this._defaultFilterForNotificationStatus;
            }else if(oTable.getId().includes("idMOStatusTable")){
                aDefaultFilter = this._defaultFilterForMOStatus;
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

                if(oTable.getId().includes("idNotificationStatusTable")) {
                    aDefaultFilter = this._defaultFilterForNotificationStatus;

                    aFilter.push(new Filter({
                        path: "code",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "description",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));
                }else if(oTable.getId().includes("idMOStatusTable")) {
                    aDefaultFilter = this._defaultFilterForMOStatus;

                    aFilter.push(new Filter({
                        path: "code",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "description",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));
                }else if(oTable.getId().includes("idGenericEnumTable")) {
                    aDefaultFilter = this._defaultFilterGenericEnum;

                    aFilter.push(new Filter({
                        path: "name",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "description",
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
        * Function to handle Notification Status dialog confirm
        */
        onNotificationStatusValueHelpDialogConfirm: function () {

            this.fnReturnData("NOTIFICATION_STATUS");

        },

        /**
        * Function to handle Notification Status dialog close
        */
        onNotificationStatusValueHelpDialogClose: function () {
            var oNotificationStatusTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idNotificationStatusTable"));
            this._oNotificationStatusValueHelpDialog.close();
            this._fnEventForNotificationStatus({
                status: "closed",
                selected: []
            });
            oNotificationStatusTable.removeSelections();
        },

        /**
        * Function to handle MO Status dialog confirm
        */
        onMOStatusValueHelpDialogConfirm: function () {

            this.fnReturnData("MO_STATUS");

        },

        /**
        * Function to handle MO Status dialog close
        */
        onMOStatusValueHelpDialogClose: function () {
            var oNotificationStatusTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idMOStatusTable"));
            this._oMOStatusValueHelpDialog.close();
            this._fnEventForMOStatus({
                status: "closed",
                selected: []
            });
            oNotificationStatusTable.removeSelections();
        },

        /**
        * Function to handle Generic enum dialog confirm
        */
        onGenericEnumValueHelpDialogConfirm: function () {

            this.fnReturnData("GENERIC_ENUM");

        },

        /**
        * Function to handle MO Status dialog close
        */
        onGenericEnumValueHelpDialogClose: function () {
            var oGenericTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idGenericEnumTable"));
            this._oGenericEnumValueHelpDialog.close();
            this._fnEventForGenericEnum({
                status: "closed",
                selected: []
            });
            oGenericTable.removeSelections();
        }

    });

});