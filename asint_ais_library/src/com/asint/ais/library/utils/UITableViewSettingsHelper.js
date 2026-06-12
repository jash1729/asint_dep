sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/Fragment"
], function (BaseObject, Fragment) {

    /* eslint-disable no-warning-comments */
    var Helper = BaseObject.extend("com.asint.ais.library.utils.MTableViewSettingsHelper", {

        _fnEvent: null,
        controller: null,
        oTable: null,

        /**
         * Function to handle dialog open
         * @param {object} oController 
         * @param {string} param1 
         * @param {boolean} bForceInit 
         */
        handleUITableSettingsDialogOpen: function (oController, param1, bForceInit) {
            this.controller = oController;
            var oViewSource = "";

            if (param1.getMetadata && param1.getMetadata() && param1.getMetadata().getName() === "sap.ui.table.Table") {
                this.oTable = param1;
            } else {
                if (this.controller.getView && this.controller.getView()) {
                    this.oTable = this.controller.getView().byId(param1);
                    oViewSource = this.controller.getView();
                }
                if (!this.oTable) {
                    this.oTable = sap.ui.getCore().byId(param1);
                }
            }

            if (this.oTable) {
                if (!this._oTableSettingsDialog) {
                    Fragment.load({
                        name: "com.asint.ais.library.fragment.UITableViewSettings",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        this._oTableSettingsDialog = oValueHelpDialog;
                        this._setInitialDialogData(this.oTable);
                        if(oViewSource){
                            this._oTableSettingsDialog.open(oViewSource);
                        }else{
                            this._oTableSettingsDialog.open();
                        }
                    }.bind(this));
                } else {
                    if(bForceInit) {
                        this._setInitialDialogData(this.oTable);
                    }
                    if(oViewSource){
                        this._oTableSettingsDialog.open(oViewSource);
                    }else{
                        this._oTableSettingsDialog.open();
                    }
                }
            }

        },

        /**
         *Initialize data
         * @param {object} oTable 
         */
        _setInitialDialogData: function (oTable) {

            var oInitialData = {
                columns: []
            };
            var aColumns = oTable.getColumns();
            var oSelectionPanel = sap.ui.getCore().byId("columnsPanel");

            for (var i in aColumns) {
                var oColumn = {};
                oColumn.label = aColumns[i].getAggregation("label").getProperty("text");
                oColumn.name = aColumns[i].getProperty("sortProperty");
                oColumn.visible = aColumns[i].getProperty("visible");
                oInitialData.columns.push(oColumn);
            }
            
            oSelectionPanel.setP13nData(oInitialData.columns);

        },

        /**
         * Function to parse state
         */
        parseP13nState: function () {

            // var that = this.controller;
            var aColumnData = sap.ui.getCore().byId("columnsPanel").getP13nData();

            var oTable = this.oTable
            // oBinding = oTable.getBinding("rows"),
            // aFilters = [],
            // aSorters = [],
            // aGroups = [];
            var aColumns = oTable.getColumns();
            var aNewColumnOrder = [];

            aColumnData.forEach(function (oColumn) {
                for (var i = 0; i < aColumns.length; i++) {
                    if (aColumns[i].getAggregation("label").getProperty("text")) {
                        if (aColumns[i].getAggregation("label").getProperty("text") === oColumn.label) {
                            aColumns[i].setVisible(oColumn.visible);
                            aNewColumnOrder.push(aColumns[i]);
                        }
                    }
                }
            });
            oTable.removeAllColumns();
            aNewColumnOrder.forEach(function (oColumn) {
                oTable.addColumn(oColumn);
            });

        }

    });

    return new Helper();

});