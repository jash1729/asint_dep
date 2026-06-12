sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
], function (BaseObject, Fragment, MessageBox, Sorter) {

    /* eslint-disable no-warning-comments */
    var Helper = BaseObject.extend("com.asint.ais.library.utils.MTableViewSettingsHelper", {

        _fnEvent: null,
        controller: null,
        tableId: null,
        /**
         * Function to handle table settings dialog open
         * @param {object} controllerThis 
         * @param {string} tableId 
         */
        handleMTableSettingsDialogOpen: function (controllerThis, tableId) {
            var that = this;
            this.controller = controllerThis;
            this.tableId = tableId;
            if (!this._oTableSettingsDialog) {
                Fragment.load({
                    name: "com.asint.ais.library.fragment.MTableViewSettings",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    this._oTableSettingsDialog = oValueHelpDialog;
                    that._setInitialDialogData(tableId,oValueHelpDialog);
                    this._oTableSettingsDialog.open();
                }.bind(this));
            } else {
                this._oTableSettingsDialog.open();
            }
        },

        /**
         * Initilize dialog
         * @param {string} tableId 
         * @param {object} oValueHelpDialog 
         */
        _setInitialDialogData: function (tableId,oValueHelpDialog) {
            var initialData = {
                filters: []
            };
            var oTable = this.controller.byId(tableId);
            var aColumns = oTable.getColumns();
            var oViewSettingsDialog = oValueHelpDialog;
            var sortItem = {};
            aColumns.forEach(function (colObj) {
                var tempObj = {};
                tempObj.columnName = colObj.getAggregation("header").getProperty("text");
                tempObj.colProperty = colObj.getAggregation("header").data("tableSettings");
                initialData.filters.push(tempObj);
            });

            initialData.filters.forEach(function (filterObj, index) {
                if (index == 0) {
                    sortItem = new sap.m.ViewSettingsItem({
                        text: filterObj.columnName,
                        key: filterObj.colProperty,
                        selected: true
                    });
                } else {
                    sortItem = new sap.m.ViewSettingsItem({
                        text: filterObj.columnName,
                        key: filterObj.colProperty
                    });
                }
                oViewSettingsDialog.addSortItem(sortItem);
            });
            initialData.filters.forEach(function (filterObj) {
                var groupItem = new sap.m.ViewSettingsItem({
                    text: filterObj.columnName,
                    key: filterObj.colProperty
                });
                oViewSettingsDialog.addGroupItem(groupItem);
            });
        
        },
       
        /**
         * Function to handle table settings for dialog confirm
         * @param {object} oEvent 
         */
        onMTableViewSettingsConfirm: function (oEvent) {
            var that = this.controller;

            var oTable = that.byId(this.tableId),
                oBinding = oTable.getBinding("items"),
                oParams = oEvent.getParameters(),
                aSorters = [],
                aGroups = [],
                vGroup,
                bDescending;

            if (oParams.sortItem) {
                var sPath = oParams.sortItem.getKey();
                bDescending = oParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            }

            if (oParams.groupItem) {
                sPath = oParams.groupItem.getKey();
                bDescending = oParams.groupDescending;
                var colText = oParams.groupItem.getText();
                // vGroup = that.mGroupFunctions[sPath];
                vGroup = function (oContext) {
                    var oprtr = oContext.getProperty(sPath);
                    if (oprtr) {
                        return {
                            key: oprtr,
                            text: colText + ": " + oprtr
                        };
                    }
                    return null;
                };

                aGroups.push(new Sorter(sPath, bDescending, vGroup));
                oBinding.sort(aGroups);
            }
        }

    });

    return new Helper();

});