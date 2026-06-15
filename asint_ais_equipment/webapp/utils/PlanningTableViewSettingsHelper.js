sap.ui.define(
    [
      "sap/ui/base/Object",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/Fragment",
      "sap/m/MessageBox",
      "sap/ui/model/Filter",
      "sap/ui/model/Sorter",
      "sap/ui/model/FilterOperator",
    ],
    function (
      BaseObject,
      JSONModel,
      Fragment,
      MessageBox,
      Filter,
      Sorter,
      FilterOperator
    ) {
      /* eslint-disable no-warning-comments */
      var Helper = BaseObject.extend("com.asint.ais.mi.equipment.utils.PlanningTableViewSettingsHelper",
        {
          _fnEvent: null,
          controller: null,
          tableId: null,
  
          handleTableSettingsDialogOpen: function (controllerThis, tableId, sDialogName) {
            var that = this;
            this.controller = controllerThis;
            this.tableId = tableId;
            if (!this[sDialogName]) {
              Fragment.load({
                name: "com.asint.ais.library.fragment.MTableViewSettings",
                controller: this
              }).then(
                function (oValueHelpDialog) {
                  this[sDialogName] = oValueHelpDialog;
                  that._setInitialDialogData(tableId, oValueHelpDialog);
                  this[sDialogName].open();
                }.bind(this)
              );
            } else {
              this[sDialogName].open();
            }
          },
  
          _setInitialDialogData: function (tableId, oValueHelpDialog) {
            var initialData = {
              filters: [],
            };
            var oTable = this.controller.byId(tableId);
            var aColumns = oTable.getColumns();
            var oViewSettingsDialog = oValueHelpDialog;
            aColumns.forEach(function (colObj) {
              if (!colObj.getAggregation("header").data("tableSettingsEnable")) {
                var tempObj = {};
                tempObj.columnName = colObj
                  .getAggregation("header")
                  .getProperty("text");
                tempObj.colProperty = colObj
                  .getAggregation("header")
                  .data("tableSettings");
                initialData.filters.push(tempObj);
              }
            });
  
            initialData.filters.forEach(function (filterObj, index) {
              if (index == 0) {
                var sortItem = new sap.m.ViewSettingsItem({
                  text: filterObj.columnName,
                  key: filterObj.colProperty,
                  selected: true,
                });
              } else {
                var sortItem = new sap.m.ViewSettingsItem({
                  text: filterObj.columnName,
                  key: filterObj.colProperty,
                });
              }
              oViewSettingsDialog.addSortItem(sortItem);
            });
            initialData.filters.forEach(function (filterObj) {
              var groupItem = new sap.m.ViewSettingsItem({
                text: filterObj.columnName,
                key: filterObj.colProperty,
              });
              oViewSettingsDialog.addGroupItem(groupItem);
            });
  
          },
  
          onMTableViewSettingsConfirm: function (oEvent) {
            var that = this.controller;
  
            var oTable = that.byId(this.tableId),
              oBinding = oTable.getBinding("items"),
              oParams = oEvent.getParameters(),
              aFilters = [],
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
              vGroup = function (oContext) {
                var oprtr = oContext.getProperty(sPath);
                if (oprtr) {
                  return {
                    key: oprtr,
                    text: colText + ": " + oprtr,
                  };
                }
                return null;
              };
  
              aGroups.push(new Sorter(sPath, bDescending, vGroup));
              oBinding.sort(aGroups);
            }
          }
        }
      );
      return new Helper();
    }
  );
  