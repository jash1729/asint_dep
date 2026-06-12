sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Formatter, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator) {

    return Formatter.extend("com.asint.ais.library.utils.ExternalIdHelper", {

        _baseURI: "",
        _i18n: {},        

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {
            this._baseURI = sBaseURI;
            this._i18n = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

        },

        /**
         * Retrives external id data
         * @param {array} externalIdData 
         */
        getExternalId: function(externalIdData) {
            var that =this;
            var externalSysData = [];
            if(Object.keys(externalIdData).length > 0){
                externalSysData.push(externalIdData)
            }
            if (!this._oExternalIdFragment) {
                Fragment.load({
                    name: "com.asint.ais.library.fragment.DialogExternalId",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var oExternalId = new JSONModel({
                        "data": {
                            externalIdData: externalSysData,
                        }
                    });
                    that._oExternalIdFragment = oValueHelpDialog;
                    that._oExternalIdFragment.setModel(oExternalId, "mExternalId");
                    that._oExternalIdFragment.setModel(that._i18n, "i18n");
                    that._oExternalIdFragment.open();
                });
            } else {
                var oExternalId = new JSONModel({
                    "data": {
                        externalIdData: externalSysData,
                    }
                });
                that._oExternalIdFragment.setModel(oExternalId, "mExternalId");
                that._oExternalIdFragment.setModel(that._i18n, "i18n");
                that._oExternalIdFragment.open();
            }
        },

        /**
         * close fragment
         */
        onExternalFragmentClose: function() {
            var that = this;
            that._oExternalIdFragment.close();
        },

        /**
         * Search functionality
         * @param {object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var aFilter = [], aFilters = [];
            var oTable = oEvent.getSource().getParent().getParent();
            if (sQuery) {
                if(oTable.getId().includes("idExternalId")) {
                    aFilter.push(new Filter({
                        path: "systemName",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                    }));

                    aFilter.push(new Filter({
                        path: "externalId",
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                    }));
                }
                aFilters.push(new Filter({
                    and: false,
                    filters: aFilter
                }));
            }
            oTable.getBinding("items").filter(aFilters);
        }

    });

});