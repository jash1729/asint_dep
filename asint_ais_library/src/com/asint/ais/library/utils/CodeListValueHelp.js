sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator) {

    return Formatter.extend("com.asint.ais.library.utils.CodeListValueHelp", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        _mV4MasterService: {},
        _fnEventForCodeList: null,
        _aPreselectData : [],

        /**
         * Initialize the Master service for Object Template List
         * 
         * @param {String} sBaseURI - Base URL of the Application
         */
        constructor: function (sBaseURI) {

            var that = this;
            this._baseURI = sBaseURI;
            this._i18n = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

            if (this._baseURI && this._baseURI.includes(".asintais.")) {
                this._appNamespace = this._baseURI.substring(this._baseURI.indexOf(".asintais.") + 10);
            }
            this._mV4MasterService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/MasterDataService/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });

        },

        /**
         * Open the Object template Dialog and attach the event
         * 
         * @param {Function} _fnEvent - Initialize and call the Event Function
         * @param {Boolean} bTableMode - Table mode true or false
         */
        handleCodeListValueHelp: function (_fnEvent, bTableMode, aPreSelectDataArray) {

            var that = this;
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            this._fnEventForCodeList = _fnEvent;
            if(aPreSelectDataArray && aPreSelectDataArray.length > 0){
                this._aPreselectData = aPreSelectDataArray;
            }

            var sName = "com.asint.ais.library.fragment.DialogCodeListValueHelp";

            /**
             * Function to reset value help search and previous selections
             */
            var fnResetSearchandSelection = function () {
                var oTable = sap.ui.getCore().byId(Fragment.createId(that._appNamespace, "idCodeListTable"));
                var oToolbar = oTable.getAggregation("headerToolbar").getContent();
                var oSearch;
                if (oToolbar && oToolbar.length > 0) {
                    oSearch = oToolbar[2];
                }
                if (oSearch && oSearch.getProperty("placeholder") && oSearch.getProperty("placeholder") == "Search") {
                    oSearch.setValue("");
                    oTable.getBinding("items").filter([]);
                    oTable.removeSelections();
                    oTable.getBinding("items").refresh();
                }
            };

            if (!this._oCodeListValueHelpDialog) {

                Fragment.load({
                    id: this._appNamespace,
                    name: sName,
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oCodeListModel = new JSONModel({
                        "data": {
                        },
                        "metadata": {
                            "selectionMode": sMode,
                            "selectedCount": 0,
                            "tableHeader": "",
                            "selectedID": [],
                            "selectedItems": []
                        }
                    });

                    that._oCodeListValueHelpDialog = oValueHelpDialog;

                    that._oCodeListValueHelpDialog.setModel(oCodeListModel, "mCodeListValueHelp");
                    that._oCodeListValueHelpDialog.setModel(that._mV4MasterService, "mV4MasterService");
                    that._oCodeListValueHelpDialog.setModel(that._i18n, "i18n");
                    that._oCodeListValueHelpDialog.open();
                    fnResetSearchandSelection();
                });

            } else {
                that._oCodeListValueHelpDialog.open();
                that._oCodeListValueHelpDialog.getModel("mCodeListValueHelp").setProperty("/metadata/selectedItems", []);
                that._oCodeListValueHelpDialog.getModel("mCodeListValueHelp").setProperty("/metadata/selectedID", []);
                fnResetSearchandSelection();
            }

        },

        /**
         * Select the Object Template table
         * 
         * @param {Object} oEvent 
         */
        onSelectCodeList: function (oEvent) {

            var mCodeListValueHelp = this._oCodeListValueHelpDialog.getModel("mCodeListValueHelp");
            var sSelectionMode = mCodeListValueHelp.getProperty("/metadata/selectionMode");
            var aSelectedItems = mCodeListValueHelp.getProperty("/metadata/selectedItems");
            var aSelectedID = mCodeListValueHelp.getProperty("/metadata/selectedID");
            var aSelectedTemplate = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");

            if (isSelected) {
                aSelectedTemplate.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    if (!aSelectedID.includes(oContext.ID)) {
                        aSelectedID.push(oContext.ID);
                        aSelectedItems.push(oContext);
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("mV4MasterService").getObject();
                    var indexToRemove = aSelectedID.indexOf(oContext.ID);
                    if (indexToRemove !== -1) {
                        aSelectedID.splice(indexToRemove, 1);
                        aSelectedItems = aSelectedItems.filter(function(item) {
                            return item.ID !== oContext.ID;
                        });
                    }
                });
            }

            mCodeListValueHelp.setProperty("/metadata/selectedItems", aSelectedItems);
            mCodeListValueHelp.setProperty("/metadata/selectedID", aSelectedID);
            mCodeListValueHelp.setProperty("/metadata/selectedCount", aSelectedID.length);

            if (sSelectionMode === sap.m.ListMode.SingleSelectMaster) {
                this.fnReturnData("CODL");
            }

        },

        /**
         * Once Confirmation It will return the data to the controller and close the Object Template dialog
         * 
         * @param {Strinf} sType - Object Template code
         */
        fnReturnData: function (sType) {

            if (sType === "CODL") {
                var mCodeListValueHelp = this._oCodeListValueHelpDialog.getModel("mCodeListValueHelp");
                var CodeListTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idCodeListTable"));
                var aSelectedItem = mCodeListValueHelp.getProperty("/metadata/selectedItems");
                var oReturn = {
                    status: "finished",
                    selected: []
                };

                aSelectedItem.forEach(function (oItem) {
                    //var oObjectTemplaetData = oItem.getBindingContext("mV4MasterService").getObject();

                    oReturn.selected.push({
                        "ID": oItem.ID,
                        "displayId": oItem.displayId,
                        "shortDescription": oItem.to_description[0] && oItem.to_description[0].shortDescription ? oItem.to_description[0].shortDescription : ""
                    });
                });

                this._fnEventForCodeList(oReturn);
                this._oCodeListValueHelpDialog.close();
                CodeListTable.removeSelections();
            }

        },

        /**
         * On Search Table data
         * 
         * @param {Object} oEvent
         */
        onSearch: function (oEvent) {

            var sQuery = oEvent.getParameter("query");
            var aFilter = [];
            var oTable = oEvent.getSource().getParent().getParent();

            if (sQuery) {

                if (oTable.getId().includes("idCodeListTable")) {
                    aFilter = new Filter([
                        new Filter({ path: "displayId", operator: FilterOperator.EQ, value1: sQuery, caseSensitive: false })
                    ], false);
                }

                var oFinalFilter = {};
                oFinalFilter = new Filter([aFilter], true);
                
                oTable.getBinding("items").filter(oFinalFilter);

            } else {

                oTable.getBinding("items").filter([]);

            }

        },

        /**
         * Pass the value to the return data on Confirm button press
         */
        onCodeListValueHelpDialogConfirm: function () {

            this.fnReturnData("CODL");

        },

        /**
         * Close the Object Template Dialog
         */
        onCodeListValueHelpDialogClose: function () {
            var objtTempTable = sap.ui.getCore().byId(Fragment.createId(this._appNamespace, "idCodeListTable"));
            objtTempTable.removeSelections();
            this._oCodeListValueHelpDialog.close();
            this._fnEventForCodeList({
                status: "closed",
                selected: []
            });

        },

        /**
         * Fetch inline count of the Object Template
         */
        onDataReceived: function () {
            var that = this;
            this.fnFetchInlineCount(this, "idCodeListTable", function (sCount) {
                var sTitle = "codeList.valueHelp.table.title";
                var sHeader = that._i18n.getResourceBundle().getText(sTitle, [sCount]);
                that._oCodeListValueHelpDialog.getModel("mCodeListValueHelp").setProperty("/metadata/tableHeader", sHeader);
            });

            if(this._aPreselectData && this._aPreselectData.length > 0){
                var aSelected = this._aPreselectData;
                var aSelIds = [];
                aSelected.forEach(function(oTemp){
                    aSelIds.push(oTemp.ID);
                });
                var oTable = sap.ui.getCore().byId(Fragment.createId(that._appNamespace, "idCodeListTable"));
                var aItems = oTable.getItems();
                aItems.forEach(function(oItem){
                    oItem.setSelected(false);
                    var oItemsObj = oItem.getBindingContext("mV4MasterService").getObject();
                    if(oItemsObj){
                        var sId = oItemsObj.ID;
                        if(aSelIds.includes(sId)){
                            oItem.setSelected(true);
                        }
                    }
                })
            }
        },

        /**
         * Fetch the Total Count of the Object Template
         * 
         * @param {Object} localThis - This control
         * @param {String} sTableId - Object Template Table Id
         * @param {Function} fnCallBack - Success Call back function
         */
        fnFetchInlineCount: function (localThis, sTableId, fnCallBack) {
            var that = localThis;
            var oTable = sap.ui.getCore().byId(Fragment.createId(that._appNamespace, "idCodeListTable"));
            var sDownloadUrl = oTable.getBinding("items").getDownloadUrl();
            var aSplit = sDownloadUrl.split("$");
            var sFilters = "";
            var sPart1 = aSplit[0];
            var sUrlPart1 = sPart1.split("?")[0];
            aSplit.forEach(function (sSubUrl) {
                if (sSubUrl.startsWith("filter")) {
                    sFilters = sSubUrl;
                }
            });
            var sTotalUrl = "";
            if (sFilters) {
                sTotalUrl = sUrlPart1 + "/$count?$" + sFilters;
            } else {
                sTotalUrl = sUrlPart1 + "/$count";
            }

            $.ajax(sTotalUrl, {
                /**
                 * Success Callback function
                 * 
                 * @param {Number} iCount - Count of the Object Template
                 */
                success: function (iCount) {
                    fnCallBack(iCount);
                },
                /**
                 * Error Callback function
                 */
                error: function () {
                    fnCallBack(0);
                }
            });
        },

    });

});