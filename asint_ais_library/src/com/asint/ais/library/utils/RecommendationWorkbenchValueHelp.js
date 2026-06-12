sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator) {

    return Formatter.extend("com.asint.ais.library.utils.RecommendationWorkbenchValueHelp", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        recoService:{},
        _fnEventForReco: null,
        _defaultFilterForReco: [],

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
            this.recoService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/RecommendationsService/",
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
        handleRecommendationValueHelp: function (_fnEvent, bTableMode, aFilter) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForReco = _fnEvent;
            this._defaultFilterForReco = aFilter;

            if(!aFilter) {
                aFilter = [];
            }

            if (!this._oRecommendationValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.DialogRecommendationValueHelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oRecoModel = new JSONModel({
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "selectedItem": [],
                            "aSelectedId": [],
                        }
                    });

                    that._oRecommendationValueHelpDialog = oValueHelpDialog;
                    that._oRecommendationValueHelpDialog.setModel(oRecoModel, "mRecoValueHelp");
                    that._oRecommendationValueHelpDialog.setModel(that.recoService, "mRecoService");
                    that._oRecommendationValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oRecommendationValueHelpDialog.open();

                    var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idRecommendationTable");
                    oTable.getBinding("items").filter(aFilter);
                });

            } else {
                var oTable = sap.ui.core.Fragment.byId(that._appNamespace, "idRecommendationTable");
                var sSearchFieldVal = oTable.getHeaderToolbar().getContent()[0].getValue();
                
                if(sSearchFieldVal){
                    oTable.getHeaderToolbar().getContent()[0].setValue("");
                }

                oTable.getBinding("items").filter([]);
                oTable.getBinding("items").filter(aFilter);
                oTable.removeSelections();
                that._oRecommendationValueHelpDialog.getModel("mRecoValueHelp").setProperty("/metadata/selectedItem", []);
                that._oRecommendationValueHelpDialog.getModel("mRecoValueHelp").setProperty("/metadata/aSelectedId", []);
                that._oRecommendationValueHelpDialog.getModel("mRecoValueHelp").setProperty("/metadata/selectionMode", sMode);
                that._oRecommendationValueHelpDialog.open();
            }

        },

        /**
         * Function to return data using call back function
         */
        fnReturnData: function () {
            var aSelectedItem, oReturn = {};
                
            var mRecoValueHelp = this._oRecommendationValueHelpDialog.getModel("mRecoValueHelp");
            var oTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idRecommendationTable"));
            aSelectedItem = mRecoValueHelp.getProperty("/metadata/selectedItem");
            oReturn = {
                status: "finished",
                selected: []
            };

            aSelectedItem.forEach(function (oItem) {
                //var oFunctionalLocationData = oItem.getBindingContext("mV4MasterService").getObject();

                oReturn.selected.push(Object.assign({
                    "ID": oItem.id
                }, oItem));
            });

            this._oRecommendationValueHelpDialog.close();
            this._fnEventForReco(oReturn);
            oTable.removeSelections();

        },

        /**
         * Function to handle notification selection
         * @param {Object} oEvent 
         */
        onSelectRecommendation: function (oEvent) {

            var mRecoValueHelp = this._oRecommendationValueHelpDialog.getModel("mRecoValueHelp");
            var sSelectionMode = mRecoValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItem = mRecoValueHelp.getProperty("/metadata/selectedItem");
            var aSelectedId = mRecoValueHelp.getProperty("/metadata/aSelectedId");
            var aSelectedAsset = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");
            
            if (isSelected) {
                aSelectedAsset.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mRecoService").getObject();
                    if (!aSelectedId.includes(oContext.displayId)) {
                        aSelectedId.push(oContext.displayId);
                        aSelectedItem.push(oItem.getBindingContext("mRecoService").getObject());
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mRecoService").getObject();
                    var index = aSelectedId.indexOf(oContext.displayId);
                    if (index !== -1) {
                        aSelectedId.splice(index, 1);
                        aSelectedItem = aSelectedItem.filter(function(item) {
                            return item.displayId !== oContext.displayId;
                        });
                    }
                });
            }

            mRecoValueHelp.setProperty("/metadata/selectedItem", aSelectedItem);
            mRecoValueHelp.setProperty("/metadata/aSelectedId", aSelectedId);

            mRecoValueHelp.setProperty("/metadata/selectedCount", aSelectedItem.length);
            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData();
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
            if(oTable.getId().includes("idRecommendationTable")) {
                aDefaultFilter = this._defaultFilterForReco;
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

                if(oTable.getId().includes("idRecommendationTable")) {
                    aDefaultFilter = this._defaultFilterForReco;

                    aFilter.push(new Filter({
                        path: "displayId",
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
        onRecoValueHelpDialogConfirm: function () {

            this.fnReturnData();

        },

        /**
        * Function to handle location dialog close
        */
        onRecoValueHelpDialogClose: function () {
            var oTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idRecommendationTable"));
            this._oRecommendationValueHelpDialog.close();
            this._fnEventForReco({
                status: "closed",
                selected: []
            });
            oTable.removeSelections();
        }

    });

});