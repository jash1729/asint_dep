sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator) {

    return Formatter.extend("com.asint.ais.library.utils.NotificationValueHelp", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        notificationService:{},
        _fnEventForNotification: null,
        _defaultFilterForNotification: [],

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
            this.notificationService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/NotificationsList/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });

        },

        /**
         * Function to handle Notification value help
         * @param {Function} _fnEvent 
         * @param {Boolean} bTableMode 
         * @param {Array} aFilter 
         */
        handleNotificationValueHelp: function (_fnEvent, bTableMode, aFilter) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForNotification = _fnEvent;
            this._defaultFilterForNotification = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            if (!this._oNotificationValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.DialogNotificationValueHelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oNotificationModel = new JSONModel({
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                        }
                    });

                    that._oNotificationValueHelpDialog = oValueHelpDialog;
                    that._oNotificationValueHelpDialog.setModel(oNotificationModel, "mNotificationValueHelp");
                    that._oNotificationValueHelpDialog.setModel(that.notificationService, "mNotificationService");
                    that._oNotificationValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oNotificationValueHelpDialog.open();

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idNotificationTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idNotificationTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                
                if(sSearchFieldVal){
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oNotificationValueHelpDialog.getModel("mNotificationValueHelp").setProperty("/metadata/selectedItem", []);
                that._oNotificationValueHelpDialog.getModel("mNotificationValueHelp").setProperty("/metadata/aSelectedId", []);
                that._oNotificationValueHelpDialog.open();
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
            }else if (sType === "NOTIFICATION") {
                
                var mNotificationValueHelpValueHelp = this._oNotificationValueHelpDialog.getModel("mNotificationValueHelp");
                var oNotificationTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idNotificationTable"));
                aSelectedItem = mNotificationValueHelpValueHelp.getProperty("/metadata/selectedItem");
                oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    //var oFunctionalLocationData = oItem.getBindingContext("mV4MasterService").getObject();

                    oReturn.selected.push(Object.assign({
                        "ID": oItem.ID,
                        // "srcId": oItem.srcId,
                        "name": oItem.displayId,
                        "to_description": oItem.shortDescription,
                        // "_objectType": oItem._objectType
                    }, oItem));
                });

                this._oNotificationValueHelpDialog.close();
                this._fnEventForNotification(oReturn);
                oNotificationTable.removeSelections();
            }

        },

        /**
         * Function to handle notification selection
         * @param {Object} oEvent 
         */
        onSelectNotification: function (oEvent) {

            var mNotificationValueHelp = this._oNotificationValueHelpDialog.getModel("mNotificationValueHelp");
            var sSelectionMode = mNotificationValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItem = mNotificationValueHelp.getProperty("/metadata/selectedItem");
            var aSelectedId = mNotificationValueHelp.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mNotificationService").getObject();
                    if (!aSelectedId.includes(oContext.displayId)) {
                        aSelectedId.push(oContext.displayId);
                        aSelectedItem.push(oItem.getBindingContext("mNotificationService").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mNotificationService").getObject();
                    var index = aSelectedId.indexOf(oContext.displayId);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.displayId !== oContext.displayId;
                        });
                    }
                });
            }

            mNotificationValueHelp.setProperty("/metadata/selectedItem", aSelectedItem);
            mNotificationValueHelp.setProperty("/metadata/aSelectedId", aSelectedId);

            mNotificationValueHelp.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("NOTIFICATION");
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
            if(oTable.getId().includes("idNotificationTable")) {
                aDefaultFilter = this._defaultFilterForNotification;
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

                if(oTable.getId().includes("idNotificationTable")) {
                    aDefaultFilter = this._defaultFilterForNotification;

                    aFilter.push(new Filter({
                        path: "displayId",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));
                    aFilter.push(new Filter({
                        path: "name",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }));

                    aFilter.push(new Filter({
                        path: "shortDescription",
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
        * Function to handle location dialog confirm
        */
        onNotificationValueHelpDialogConfirm: function () {

            this.fnReturnData("NOTIFICATION");

        },

        /**
        * Function to handle location dialog close
        */
        onNotificationValueHelpDialogClose: function () {
            var oNotificationTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idNotificationTable"));
            this._oNotificationValueHelpDialog.close();
            this._fnEventForNotification({
                status: "closed",
                selected: []
            });
            oNotificationTable.removeSelections();
        }

    });

});