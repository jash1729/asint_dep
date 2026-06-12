sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Utility, JSONModel, ResourceModel, ODataModel, Fragment, Filter, FilterOperator) {

    return Utility.extend("com.asint.ais.library.utils.ValueHelpFilter", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        _mV4AssetReliabilityService: {},
        _mV4S4DataService: {},

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

            this._mV4AssetReliabilityService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/AssetReliabilityService/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });

            this._mV4S4DataService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/S4DataService/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });

            this._mV4MasterDataService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/MasterDataService/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server"
            });
        },


        /**
         * Function to open dialog / fragment for value help Filters
         * @param {String} sFragmentId 
         * @param {String} sFragmentName 
         * @param {String} sFragmentInstanceVarName 
         */
        onOpenValuHelpFilterDialog: function (
            oFnCallback = null,
            sFragmentId,
            sFragmentName,
            sFragmentInstanceVarName,
            oModel,
            oInput,
            bTableMode=true,
            oPreFilterInfo = { sTableId: null, aFilters: null },
        ) {
            var sMode = bTableMode ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;

            var oCommonFragmentPath = {
                "class": "com.asint.ais.library.fragment.DialogClassFilter",
                "failureData": "com.asint.ais.library.fragment.DialogFailureDataProfileFilter",
                "genericValueHelp": "com.asint.ais.library.fragment.DialogGenericValueHelp",
            };

            var sFragmentNameObj = {
                "class": oCommonFragmentPath["class"],
                "operatingContext": "com.asint.ais.library.fragment.DialogOCFilter",
                "globalOperatingContext": "com.asint.ais.library.fragment.DialogGlobalOCFilter",
                "failureDataProfile": oCommonFragmentPath["failureData"],
                "sourceAssessment": "com.asint.ais.library.fragment.DialogSourceAssessmentFilter",

                "create-class": oCommonFragmentPath["class"],
                "create-failureData": oCommonFragmentPath["failureData"],
                "classChar": "com.asint.ais.library.fragment.DialogClassCharacteristics",

                "failureRateClass": oCommonFragmentPath["class"],
                "mtbfClass": oCommonFragmentPath["class"],
                "weibullAnalysisClass": oCommonFragmentPath["class"],
                "mttrClass": oCommonFragmentPath["class"],
                "failureRatePlanningPlant": oCommonFragmentPath["genericValueHelp"],
                "mtbfPlanningPlant": oCommonFragmentPath["genericValueHelp"],
                "mttrPlanningPlant": oCommonFragmentPath["genericValueHelp"],
            };

            // var oDialogTitle = {
            //     "failureRateFailureCode": ""
            // };

            this._appModelObject = oModel;
            this._appInputObject = oInput;
            this._appCallbackObject = oFnCallback;
            this._preFilter = oPreFilterInfo.aFilters;

            this._fragmentInfo = {
                _FragmentId: sFragmentId,
                _FragmentInstanceName: sFragmentInstanceVarName,
                _FragmentName: sFragmentName,
            };

            var oValueHelpModel = new JSONModel({
                "metadata": {
                    "selectionMode": sMode,
                    "dialogTitle": ""
                }
            });

            var aModelList = [
                {
                    modelData: this._mV4AssetReliabilityService,
                    modelName: "assetReliabilityService",
                },
                {
                    modelData: this._mV4S4DataService,
                    modelName: "s4DataService",
                },
                {
                    modelData: this._mV4MasterDataService,
                    modelName: "masterDataService",
                },
                {
                    modelData: oValueHelpModel,
                    modelName: "mValueHelpFilterModel",
                },
            ];
            

            this.onOpenAnyFragment(
                sFragmentId,
                sFragmentNameObj[sFragmentName],
                sFragmentInstanceVarName,
                false, 
                aModelList,
                this._i18n,
                undefined,
                oPreFilterInfo,
            );
        },

        /**
         * Function to search in Tables of value help filter fragment
         * @param {Object} oEvent 
         * @param {String} sFragmentId 
         * @param {String} sTableId 
         * @param {Array} aFilterKey 
         */
        fnSearchInValueHelpFragmentTable: function (
            oEvent,
            sTableId,
            aFilterKey,
            sSearchFieldId,
        ) {
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            
            this._fragmentInfo._FragmentSearchFieldId = sSearchFieldId;
            this._fragmentInfo._TableId = sTableId;

            var aFiltersList = [];
            if(sQuery && aFilterKey && Array.isArray(aFilterKey)) {
                aFilterKey.forEach(function (key) {
                    aFiltersList.push(new Filter({
                        path: key,
                        operator: FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false,
                    }));
                });
            }

            this.fnSearchInTableInFragment(
                sQuery,
                this._fragmentInfo._FragmentId,
                sTableId,
                aFiltersList,
                this._preFilter,
            );
        },

        /**
         * Function to get all the selected rows in value help Filter
         * @param {Object} oEvent 
         */
        fnChangeInSearchValueHelp: function (oEvent, sSearchFieldId) {
            this._fragmentInfo._FragmentSearchFieldId = sSearchFieldId;
        },

        /**
         * Function to get all the selected rows in value help Filter
         * @param {Object} oEvent 
         * @param {String} sFilterName 
         * @param {String} sListService 
         */
        onValueHelpFilterTableSelection: function(oEvent, sListService) {
            var oFilterProperty = {
                "operatingContext": "/data/list/advanceFilter/operatingContext/selected",
                "globalOperatingContext": "/data/list/advanceFilter/globalOperatingContext/selected",
                "class": "/data/list/advanceFilter/class/selected",
                "failureDataProfile": "/data/list/advanceFilter/failureDataProfile/selected",
                "sourceAssessment": "/data/list/advanceFilter/sourceAssessment/selected",
                "create-class": "/data/createAssessment/formData/class",
                "create-failureData": "/data/createAssessment/formData/failureDataProfile",
                "classChar":"/data/list/advanceFilter/classChar/selected",
                "failureRateClass": "/data/failureRate/filters/active/class",
                "mtbfClass": "/data/mtbf/filters/active/class",
                "weibullAnalysisClass":"/data/weibullAnalysis/filters/active/class",
                "mttrClass": "/data/mttr/filters/active/class",
                "failureRatePlanningPlant": "/data/failureRate/filters/active/planningPlant",
                "mtbfPlanningPlant": "/data/mtbf/filters/active/planningPlant",
                "mttrPlanningPlant": "/data/mttr/filters/active/planningPlant",
            };

            var sInstanceVarName = this._fragmentInfo._FragmentInstanceName;
            var oFragmentModel = this[sInstanceVarName].getModel("mValueHelpFilterModel");
            var sSelectionMode = oFragmentModel.getProperty("/metadata/selectionMode");
            
            this.onTableSelectionData(
                oEvent,
                this._appModelObject,
                oFilterProperty[this._fragmentInfo._FragmentName],
                sListService,
                sSelectionMode,
                this._fragmentInfo._FragmentName,
            );


            if(sSelectionMode === "SingleSelectMaster") {
                if(this._appCallbackObject) {
                    this._appCallbackObject.fnAfterAssignValue();
                }

                this.onCancelValueHelpFilter();
            }
        },

        /**
         * Function to apply value help filters
         * @param {String} sFilterName 
         * @param {String} sTableId 
         * @param {String} sInstanceVarName 
         * @param {String} sFragmentId 
         * @param {String} sTokenKey 
         * @param {String} sTokenText 
         */
        onConfirmValueHelpFilter: function(
            sTableId,
            sTokenKey,
            sTokenText,
        ) {
            var sFilterName = this._fragmentInfo._FragmentName;
            var oFilterProperty = {
                "operatingContext": "/data/list/advanceFilter/operatingContext/selected",
                "globalOperatingContext": "/data/list/advanceFilter/globalOperatingContext/selected",
                "class": "/data/list/advanceFilter/class/selected",
                "failureDataProfile": "/data/list/advanceFilter/failureDataProfile/selected",
                "sourceAssessment": "/data/list/advanceFilter/sourceAssessment/selected",
                "classChar":"/data/list/advanceFilter/classChar/selected",
                "failureRateClass": "/data/failureRate/filters/active/class",
                "weibullAnalysisClass": "/data/weibullAnalysis/filters/active/class",
            };

            var sModelProperty = oFilterProperty[sFilterName];
            var aSelectedItems = this._appModelObject.getProperty(sModelProperty);

            var isTokenAddedToFilterInput = this.fnAddTokenToValueHelpInputFilter(
                this._appInputObject,
                aSelectedItems,
                sTokenKey,
                sTokenText,
            );


            if(isTokenAddedToFilterInput){
                if(this._appCallbackObject) {
                    this._appCallbackObject.fnAfterAssignValue();
                }
                
                this.onCancelValueHelpFilter(sTableId);
            }
        },

        /**
         * Function to close the Advance Filter Dialog
         * @param {String} sTableId 
         * @param {String} sInstanceVarName 
         * @param {String} sFragmentId 
         */
        onCancelValueHelpFilter: function( sTableId ) {
            var sInstanceVarName = this._fragmentInfo._FragmentInstanceName;
            var sFragmentId = this._fragmentInfo._FragmentId;
            var sFragmentName = this._fragmentInfo._FragmentName;
            var sFragmentSearchFieldId = this._fragmentInfo._FragmentSearchFieldId;

            var oModel = this._appModelObject;

            var oFragmentModel = this[sInstanceVarName].getModel("mValueHelpFilterModel");
            var sSelectionMode = oFragmentModel.getProperty("/metadata/selectionMode");
            var oTable = sTableId ? Fragment.byId(sFragmentId, sTableId) : null;

            if(sFragmentSearchFieldId) {
                var oSearchField = Fragment.byId(sFragmentId, sFragmentSearchFieldId);
                oSearchField.setValue("");
            }

            if(oTable) {
                oTable.getBinding("items").filter([]);

                if(sSelectionMode === "MultiSelect") {
                    oTable.removeSelections();
                }
            }

            if(sSelectionMode === "MultiSelect") {
                var oFilterProperty = {
                    "operatingContext": "/data/list/advanceFilter/operatingContext/selected",
                    "globalOperatingContext": "/data/list/advanceFilter/globalOperatingContext/selected",
                    "class": "/data/list/advanceFilter/class/selected",
                    "failureDataProfile": "/data/list/advanceFilter/failureDataProfile/selected",
                    "sourceAssessment": "/data/list/advanceFilter/sourceAssessment/selected",
                    "create-class": "/data/createAssessment/formData/class",
                    "create-failureData": "/data/createAssessment/formData/failureDataProfile",
                    "classChar":"/data/list/advanceFilter/classChar/selected",
                };

                oModel.setProperty(oFilterProperty[sFragmentName], []);
            }


            // this[sInstanceVarName].close();
            this[sInstanceVarName].destroy();
            this[sInstanceVarName] = null;
        },

        /**
         * Function to open the Characteristics Fragment when user clicks the Link
         * @param {Object} oEvent 
         */
        onOpenCharacteristicsDialog: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("assetReliabilityService");
            var sCharacteristics = oContext.getProperty("characteristics");

            if (!sCharacteristics) {
                sap.m.MessageToast.show("No characteristics data available");
                return;
            }

            var aCharacteristics = [];
            try {
                aCharacteristics = JSON.parse(sCharacteristics);
            } catch (err) {
                sap.m.MessageToast.show("Invalid characteristics format");
                return;
            }

            if (this._oCharacteristicsDialog) {
                var oCharModel = this._oCharacteristicsDialog.getModel("mCharacteristicsModel");
                if (oCharModel) {
                    oCharModel.setData({ data: aCharacteristics });
                } else {
                    oCharModel = new JSONModel({ data: aCharacteristics });
                    this._oCharacteristicsDialog.setModel(oCharModel, "mCharacteristicsModel");
                }
                this._oCharacteristicsDialog.open();
                return;
            }

            oCharModel = new JSONModel({ data: aCharacteristics });

            var aModelList = [
                { 
                    modelData: oCharModel,
                    modelName: "mCharacteristicsModel"
                }
            ];
            this.onOpenAnyFragment(
                "idOperatingContextCharacteristics",
                "com.asint.ais.library.fragment.DialogCharacteristics", 
                "_oCharacteristicsDialog",
                false,
                aModelList,
                this._i18n,
                undefined,
                {}
            );
        },


        /**
         * Function to close the Characteristics Dialog
         */
        onCloseCharacteristicsDialog: function () {
            if (this._oCharacteristicsDialog) {
                this._oCharacteristicsDialog.close();
            }
        },

        /**
         * Function for initial data processing
         */
        onOperatingContextDataReceived: function () {
            var sFragmentId = this._fragmentInfo._FragmentId;
            var sTableId = "idOperatingContextFilterTable";

            if(sFragmentId === "idOpeartingContextAdvanceFilterDialog"){
                sTableId = "idOperatingContextFilterTable";
            }else{
                sTableId = "idGlobalOperatingContextFilterTable";
            }

            var oTable = Fragment.byId(sFragmentId, sTableId);
            var sSelectedPath = "/data/list/advanceFilter/operatingContext/selected";
            var aSelectedOCData = this._appModelObject.getProperty(sSelectedPath);
            this.onDataReceived(oTable, aSelectedOCData, "assetReliabilityService");
        },


    })
})