sap.ui.define([
    "com/asint/ais/mi/cml/controller/BaseController",
    "com/asint/ais/mi/cml/utility/Formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/viz/ui5/controls/Popover",
    "sap/ui/core/HTML",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/utils/MTableViewSettingsHelper",
    "com/asint/ais/library/utils/VariantManagementHelper",
    "sap/ui/export/library",
    "com/asint/ais/library/utils/TableP13nEngineHelper"
], function (BaseController, Formatter, Fragment, Filter, Popover, HTML, FilterOperator, MTableViewSettingsHelper, VariantManagementHelper, ExportLibrary, TableP13nEngineHelper) {
    "use strict";

    var EdmType = ExportLibrary.EdmType;

    return BaseController.extend("com.asint.ais.mi.cml.controller.list.CMLList", {

        formatter: Formatter,

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {

            this.oVariantManagementHelper = new VariantManagementHelper(this, {
                "ControlId": {
                    "SmartVariantManagement": "idSmartVariantManagement",
                    "Filterbar": "idDynamicPagefilterbar",
                    "Table": ["idCMLMTable_"],
                    "SnappedContent": "idDynamicPageSnappedContent",
                    "ExpandedContent": "idDynamicPageExpandedContent"
                },
                "FilterBarSettings": {
                    "EnableBasicSearch": true,
                    "BasicSearchKeys": ["equipmentName", "equipmentDescription", "functionalLocationName", "functionalLocationDescription","equipmentComponentType", "technicalObjectSortCode","functionalLocationSortField","equipmentSortField"]
                },
                "Settings": {
                    "LoadOnlyVisibleTable": false
                }
            });

            this.oVariantManagementHelperForCmlOv = new VariantManagementHelper(this, {
                "ControlId": {
                    "SmartVariantManagement": "idSmartVariantManagementForCmlOv",
                    "Filterbar": "idDynamicPagefilterbarForCmlOv",
                    "Table": ["idCMLMTableForCmlOv"],
                    "SnappedContent": "idDynamicPageSnappedContentForCmlOv",
                    "ExpandedContent": "idDynamicPageExpandedContentForCmlOv"
                },
                "FilterBarSettings": {
                    "EnableBasicSearch": true,
                    "BasicSearchKeys": ["cmlDescription","cmlName","equipmentName", "equipmentDescription", "functionalLocationName", "flocDescription","parentEquipment","parentEquipmentDescription","cmlGroupName","maintenancePlant","planningPlant","technicalObjectSortCode","functionalLocationSortField","sortField","plantSection","location"]
                },
                "Settings": {
                    "LoadOnlyVisibleTable": false
                }
            });

            this.oVariantManagementHelper.initialise();
            this.oVariantManagementHelperForCmlOv.initialise();

            this._aClipboardData = [];
            this._attachMenuRowIdx = "";
            this.getRouter().getRoute("nCMLList").attachPatternMatched(this.fnInitialize, this);

            var oEQUMultiInput = this.getView().byId("idCMLEquipmentInputFilter");
            oEQUMultiInput.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });

            var oFLOCMultiInput = this.getView().byId("idCMLFunctionalInputFilter");
            oFLOCMultiInput.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });

            var oEQUMultiInputForCmlOv = this.getView().byId("idCMLEquipmentInputFilterForCmlOv");
            oEQUMultiInputForCmlOv.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });

            var oSuperOrdEQUMultiInputForCmlOv = this.getView().byId("idCMLSuperOrdEquipmentInputFilterForCmlOv");
            oSuperOrdEQUMultiInputForCmlOv.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });

            var oFLOCMultiInputForCmlOv = this.getView().byId("idCMLFunctionalInputFilterForCmlOv");
            oFLOCMultiInputForCmlOv.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });

        },

        /**
         * Function triggered before rendering.
         */
        onBeforeRendering: function () { },

        /**
         * Function triggered after rendering.
         */
        onAfterRendering: function () {

            //this.fnInitialize();
            // this.fnInitTable();

        },

        /**
         * Function to initialize the list view table.
         */
        fnInitTable: function () {

            if (!this.oTableP13nEngineHelper) {
                this.oTableP13nEngineHelper = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idCMLMTable_", // Mandatory
                        "settingButton": "idTableP13nSettings"
                    },
                    "event": {
                        "columnListItemPress": this.onRowPress, // Mandatory
                        "onDataReceived": this.onDataReceived // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": true
                    }
                }, this,["idCMLMTable_", "idCMLMTableForCmlOv"]);
            }

            if (!this.oTableP13nEngineHelperForCmlOv) {
                this.oTableP13nEngineHelperForCmlOv = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idCMLMTableForCmlOv", // Mandatory
                        "settingButton": "idTableP13nSettingsForCmlOv"
                    },
                    "event": {
                        "columnListItemPress": this.onRowPress, // Mandatory
                        "onDataReceived": this.onDataReceivedForCmlOv // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": true
                    }
                }, this,["idCMLMTable_", "idCMLMTableForCmlOv"]);
            }

        },

        /**
         * Event handler for when the settings button in the MTable is pressed
         */
        onPressSettingsMTable: function () {

            MTableViewSettingsHelper.handleMTableSettingsDialogOpen(this, "idCMLMTable_");

        },

        /**
         * Function to destroy the controller.
         */
        onExit: function () {

            var oPopOver = this.getView().byId("idCMLPopoverViz");
            var oPopOverForRemainingLifeCount = this.getView().byId("idCMLPopoverViz2");
            var oPopOverForStcr = this.getView().byId("idCMLPopoverVizStcr");
            var oPopOverForLtcr = this.getView().byId("idCMLPopoverVizLtcr");
            oPopOver.destroy();
            oPopOverForRemainingLifeCount.destroy();
            oPopOverForStcr.destroy();
            oPopOverForLtcr.destroy();

        },

        /**
         * Function to initialize the controller.
         */
        fnInitialize: function () {

            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var mCMLList = this.getView().getModel("mCMLList");
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this._oMessage = that.getView().getModel("mMessage").getResourceBundle();

            // Persisting the data after nav back to list page from detail
            if (!mCMLList) {

                var oCMLList = {
                    "data": {
                        "KPIData": {
                            "HalfLifeBEData": [],
                            "HalfLifeAnalyticsData": [],
                            "RemainingLifeCountData" : [],
                            "RemainingLifeTechCountGroupedData" : {},
                            "StcrTechCountData" : [],
                            "StcrTechCountGroupedData" : {},
                            "LtcrTechCountData" : [],
                            "LtcrTechCountGroupedData" : {},
                        },
                        "CMLsList": []
                    },
                    "metadata": {
                        "flexColLayout": {
                            "layout": "MidColumnFullScreen",
                            "activeBeginPage": "",
                            "activeMidPage": "idMTablePage"
                        },
                        "flexColLayoutForCmlOv": {
                            "layout": "MidColumnFullScreen",
                            "activeBeginPage": "",
                            "activeMidPage": "idMTablePage"
                        },
                        "enableInspObjTemp": false,
                        "selectedTab" : "ASSET_OVERVIEW",
                    }
                }
                var oCMLListModel = new sap.ui.model.json.JSONModel(oCMLList);

                this.getView().setModel(oCMLListModel, "mCMLList");

                var oListModel = {
                    "create": {
                        "cml": {
                            "selectedObjectData": "",
                            "selectedEqpFloc": "",
                            "oSelectedObject": {},
                            "objectTemplateList": [],
                            "selectedObjectTemplate": "",
                            "selectedObjectTemplateName": "",
                            "objectType": "EQUI",
                            "sObjectType": "",
                            "sObjectName": "",
                            "sObjectDecp": "",
                            "selectedLocation": "",
                            "selectedLocationName": "",
                            "selectedSegment": "Equipment",
                            "customTableData": {
                                "rowData": {},
                                "columnData": {},
                                "customTableDataDeleteActions": {
                                    "isDeleteCustomColumnEnabled": true
                                }
                            },
                            "customDataset": [
                                {
                                    "name": "",
                                    "description": "",
                                    "cmlTemplate": "",
                                    "nameValueState": "None",
                                    "nameValueStateText": "",
                                    "descpValueState": "None"
                                },
                                {
                                    "name": "",
                                    "description": "",
                                    "cmlTemplate": "",
                                    "nameValueState": "None",
                                    "nameValueStateText": "",
                                    "descpValueState": "None"
                                },
                            ],
                            "selectedCMLRadio": true,
                            "selectedGridCMLRadio": false,
                            "customGridDataset": {
                                "gridCMLName": "",
                                "rowSize": 2,
                                "colSize": 2,
                                "cmlTemplate": ""
                            },
                            "customRowColumDataSet": [
                                {
                                    "name": "",
                                    "description": "",
                                    "nameValueState": "None",
                                    "nameValueStateText": "",
                                    "descpValueState": "None"
                                }
                            ],
                            "isDeleteEnabled": true,
                            "deletedDataRows": [],
                            "aNewCMLList": [],
                            "aNewCMLTemp": [],
                            "saveData": [],
                            "aCMLReadings": [],
                            "aSummaryData": [],
                            "cmlList": {}
                        },
                        "inspection": {}
                    },
                    "locationList": {
                        "locationTemplateList": []
                    },
                    "equipmentLocationListCount": 0,
                    "graphFilterData": [],
                    "hierarchyData": {
                        "nodes": [],
                        "lines": []
                    },
                    "componentList": []
                };

                oListModel = Object.assign({}, oCommonModel.getProperty("/data/listPage/"), oListModel);
                oCommonModel.setProperty("/data/listPage/", oListModel);

                var sUom = this.getSelectedUoMSystem() || "imperial";
                // sUom = "metric";
                oCommonModel.setProperty("/data/UOM", sUom);
                oCommonModel.setProperty("/data/listPage/table/header", this._oi18n.getText("asint.cml.list.table.title.text", [0]));
                oCommonModel.setProperty("/data/listPageForCmlOv/table/header", this._oi18n.getText("asint.cml.list.cmlOv.table.title.text", [0]));
                oCommonModel.setProperty("/data/listPageForCmlOv/filters/PLMT", []);
                oCommonModel.setProperty("/data/listPageForCmlOv/filters/PLPT", []);
                oCommonModel.setProperty("/data/listPageForCmlOv/filters/PLSC", []);
                oCommonModel.setProperty("/data/listPageForCmlOv/filters/LOC", []);
                // oCommonModel.setProperty("/data/listPageForCmlOv/filters/WCTR", []);
                // oCommonModel.setProperty("/data/listPageForCmlOv/filters/PRGP", []);

                var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrameHalfLife");

                oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: true
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: true,
                            text: "Remaining Life & Half Life"
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: true,
                            text: "Equipment & Functional Location IDs"
                        }
                    },
                    title: {
                        visible: true,
                        text: "Asset Life Spread"
                    },
                    interaction: {
                        selectability: {
                            mode: "SINGLE"
                        }
                    }
                });

                var popoverProps = {
                    /**
                     * 
                     * @param {Object} data - Graph data
                     * @returns 
                     */
                    "customDataControl": function (data) {
                        if (data.data.val) {
                            var values = data.data.val, divStr = "";
                            var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='" + data.data.color + "' transform='translate(5,5)'></path></svg>";
                            divStr = divStr + "<div style = 'margin: 15px 30px 0 10px'>" + svg + "<b style='margin-left:10px'>" + values[0].value + "</b></div>";
                            divStr = divStr + "<div style = 'margin: 5px 30px 15px 30px'>" + values[2].name + "<span style = 'float: right'>" + values[2].value + " Years" + "</span></div>";
                            return new HTML({ content: divStr });
                        }
                    }
                };
                var oPopOver = that.getView().byId("idCMLPopoverViz");
                oPopOver = new Popover(popoverProps);
                oPopOver.connect(that.oVizFrame.getVizUid());
                
                this.setRemainingLifeVizProperties();
                this.setStcrVizProperties();
                this.setLtcrVizProperties();
            }

            this.getUserRoles();
            this.fnFetchCMLKPIData();
            this.fnFetchAssetHierarchy();
            this.fnFetchComponentTypeList();
            // this.getCMLsListbyComponent();
            this.fnLoadFeatureFlagConfig(function() {
                that.fnInitTable();
            });
            this.fnFetchCMLRemainingLifeKPIData();
            this.fnFetchCMLSTCRKPIData();
            this.fnFetchCMLLTCRKPIData();

        },

        /**
         * Asset Life Spread -Analytics graph data preparation
         */
        fnFetchCMLKPIData: function () {

            var that = this;
            var mInspectionList = this.getView().getModel("mCMLList");

            this.CMLDataSource.getHalfLifeDataforAnalytics(function (oData) {
                var aResults = [];
                var aFinal = [];
                if (oData.value) {
                    aResults = oData.value;
                }
                if (aResults.length > 0) {
                    for (var i = 0; i < aResults.length; i++) {
                        var oTemp = Object.assign({}, aResults[i]);
                        oTemp.objectName = oTemp.functionalLocationName ? oTemp.functionalLocationName : oTemp.equipmentName;
                        aFinal.push(oTemp);
                    }
                    mInspectionList.setProperty("/data/KPIData/HalfLifeBEData", aResults);
                    mInspectionList.setProperty("/data/KPIData/HalfLifeAnalyticsData", aFinal);
                    that.getView().byId("idAnalyticsRemainingLifeSelect").setSelectedKey("0-5 years");
                    that.getView().byId("idAnalyticsObjectSelector").setSelectedKey("EQUI");
                    that.onApplyHalfLifeChartFilter();
                }
            }, function (oError) {
                that.fnMessageShow("E", that._oi18n.getText("asint.inspection.KPI.message03"), oError);
            });

        },

        /**
         * Fetch the CML by Object ID
         * 
         * @param {Array} aObjectList - List of Object ID
         */
        fnFetchCMLsByObjectId: function (aObjectList) {

            var that = this;
            var mInspectionList = this.getView().getModel("mCMLList");
            var oCommonModel = that.getView().getModel("mCMLModel");
            var aCMLs = [];

            // Get CMLs and values by ObjectId (EQUI ID or FLOC ID)

            /**
             * Push the response to the Array
             * @param {Object} oResult - Response from the API
             */
            var fnSuccess = function (oResult) {
                if (oResult.value.length > 0) {
                    aCMLs.push(oResult.value);
                }
            };

            /**
             * 
             * @param {Object} oError - Error Object
             */
            var fnError = function (oError) {
                sap.m.MessageToast.show(oError.responseText);
                that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE016"));
                fnSuccessCallBack(true);
            };

            /**
             * Set the response to the model
             */
            var fnCallBack = function () {
                if (aCMLs.length > 0) {
                    mInspectionList.setProperty("/data/CMLsList", aCMLs[0]);
                    oCommonModel.setProperty("/data/listPage/create/cml/cmlList", aCMLs[0]);
                }
            };

            /**
             * 
             * @param {Array} aChunk - Object of the list
             * @param {Function} fnChunkComplete - Callback function
             */
            var fnRequest = function (aChunk, fnChunkComplete) {
                that.CMLDataSource.getCMLsByObjectId(aChunk.id, function (aCMlsList) {
                    fnSuccess(aCMlsList);
                    fnChunkComplete();
                }, function (oError) {
                    fnError(oError);
                    fnChunkComplete();
                });
            };

            if (typeof aObjectList === "object") {
                that.fnPerformDatasourceOperation(aObjectList, fnRequest, fnCallBack);
            }

        },

        /**
         * Open Create CML Dialog and Clear values to the model bindings
         */
        onCMLDialogOpen: function () {

            var that = this,
                oCommonModel = that.getView().getModel("mCMLModel");

            oCommonModel.setProperty("/metaData/view", "CML");

            if (!this._oDailogCreateCML) {
                Fragment.load({
                    id: "idCreateCMLFragment",
                    name: "com.asint.ais.mi.cml.view.fragment.DialogCreateCML",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDailogCreateCML = oDialog;
                    this._oDailogCreateCML.open();
                }.bind(this));
            } else {
                this._oDailogCreateCML.open();
            }
            oCommonModel.setProperty("/data/listPage/create/cml/objectType", "EQUI");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectName", "");
            oCommonModel.setProperty("/data/listPage/create/cml/selectedEqpFloc", "");
            oCommonModel.setProperty("/data/listPage/create/cml/oSelectedObject", "");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectId", "");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectName", "");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectDescp", "");
            oCommonModel.setProperty("/data/selectedObjectId", "");
            oCommonModel.setProperty("/data/listPage/create/cml/selectedLocation", "");
            oCommonModel.setProperty("/metaData/listPage/create/cml/valueState/EqpFloc", "None");
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/cmlTemplate", false);

        },

        /**
         * Close Create CML Dialog and Clear values to the model bindings
         */
        onCMLDialogClose: function () {

            var that = this;
            var oCommonModel = this.getView().getModel("mCMLModel");

            if (that._oDailogCreateCML) {
                that._oDailogCreateCML.close();

                var oCustomDataset = [
                    {
                        "name": "",
                        "description": "",
                        "cmlTemplate": "",
                        "nameValueState": "None",
                        "nameValueStateText": "",
                        "descpValueState": "None"
                    },
                    {
                        "name": "",
                        "description": "",
                        "cmlTemplate": "",
                        "nameValueState": "None",
                        "nameValueStateText": "",
                        "descpValueState": "None"
                    }
                ];
                oCommonModel.setProperty("/data/listPage/create/cml", {
                    "selectedEqpFloc": "",
                    "objectTemplateList": "",
                    "selectedObjectTemplate": "",
                    "selectedLocation": "",
                    "customDataset": oCustomDataset
                });
                oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/objectTemplate", false);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedCMLRadio", true);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedGridCMLRadio", false);
                oCommonModel.setProperty("/data/listPage/create/cml/customGridDataset", {
                    "gridCMLName": "",
                    "rowSize": 2,
                    "colSize": 2,
                    "cmlTemplate": ""
                });
                var aCustomRowColumDataSet = [
                    {
                        "name": "",
                        "description": "",
                        "nameValueState": "None",
                        "nameValueStateText": "",
                        "descpValueState": "None"
                    }
                ];

                oCommonModel.setProperty("/data/listPage/create/cml/customRowColumDataSet", aCustomRowColumDataSet);
            }

        },

        /**
         * Create CML and CML Asset Overview
         */
        onCMLCreate: function () {

            var that = this;
            var oCommonModel = this.getView().getModel("mCMLModel");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var aNewCMLList = oCommonModel.getProperty("/data/listPage/create/cml/aNewCMLList");
            var bGridCml = oCommonModel.getProperty("/data/listPage/create/cml/selectedGridCMLRadio");
            var aResultFinal = [];

            /**
             * Function to save the CML and Grid CML
             */
            // var fnSaveCML = function (aNewCMLList,isSiblingPresent) {
            //     var sMessage=  isSiblingPresent && isSiblingPresent.length>0 ? that.fnMessageShow("I", oMessageBundle.getText("CML.MESSAGE037"),isSiblingPresent) : oMessageBundle.getText("CML.MESSAGE003");
            //     aNewCMLList.forEach(function (oPayLoadData) {
            //         oPayLoadData = that.setCreatedModified(oPayLoadData, "POST");
            //         that.CMLDataSource.createCML(oPayLoadData, function (oResult) {
            //             aResultFinal.push(oResult);
            //             if (aResultFinal.length === aNewCMLList.length) {
            //                 sap.ui.core.BusyIndicator.hide();
            //                 that._oDailogCreateCML.close();
            //                 that.fnMessageShow("S", oMessageBundle.getText("CML.MESSAGE003"), null, function (sAction) {
            //                     if (sAction === "OK") {
            //                         var oRouter = that.getOwnerComponent().getRouter(),
            //                             sObjectType = oCommonModel.getProperty("/data/listPage/create/cml/objectType"),
            //                             sObjectId = oCommonModel.getProperty("/data/listPage/create/cml/sObjectId");
            //                         // To Check if the Asset is already present or not
            //                         that.CMLDataSource.getCMLAsset(sObjectId, function (isAssetPresent) {
            //                             if (isAssetPresent.value.length > 0) { // If present, It Will go to detail page
            //                                 oRouter.navTo("nCMLDetail", {
            //                                     objectType: sObjectType,
            //                                     objectId: sObjectId
            //                                 });

            //                             } else { // It will create Asset, If not present
            //                                 var oPayload = {
            //                                     "halfLife": null,
            //                                     "remainingLife": null,
            //                                     "tMin": null,
            //                                     "retirementDate": null,
            //                                     "isGrowth": null,
            //                                     "isBelowTmin": null,
            //                                     "deleted": false
            //                                 }

            //                                 if (sObjectType === "Equipment" || sObjectType === "EQUI") {
            //                                     oPayload.objectId = sObjectId;
            //                                     oPayload.objectType = "EQUI";
            //                                     oPayload["to_equipment_ID"] = sObjectId;
            //                                 } else {
            //                                     oPayload.objectId = sObjectId;
            //                                     oPayload.objectType = "FLOC";
            //                                     oPayload["to_functionalLocation_ID"] = sObjectId;
            //                                 }

            //                                 oPayload = that.setCreatedModified(oPayload, "POST");

            //                                 that.CMLDataSource.createCMLAsset(oPayload, function () {
            //                                     that.getView().byId("idCMLMTable_").getBinding("items").refresh();
            //                                     oRouter.navTo("nCMLDetail", {
            //                                         objectType: sObjectType,
            //                                         objectId: sObjectId
            //                                     });
            //                                 }, function (oError) {
            //                                     that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE027"), oError);
            //                                 });
            //                             }
            //                         }, function (oError) {
            //                             that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE016"), oError);
            //                         });
            //                     }
            //                 });

            //                 oCommonModel.setProperty("/data/listPage/create/cml/selectedEqpFloc", "");
            //                 oCommonModel.setProperty("/data/listPage/create/cml/selectedLocation", "");
            //                 var oCustomDataset = [
            //                     {
            //                         "name": "",
            //                         "description": "",
            //                         "cmlTemplate": "",
            //                         "nameValueState": "None",
            //                         "nameValueStateText": "",
            //                         "descpValueState": "None"
            //                     },
            //                     {
            //                         "name": "",
            //                         "description": "",
            //                         "cmlTemplate": "",
            //                         "nameValueState": "None",
            //                         "nameValueStateText": "",
            //                         "descpValueState": "None"
            //                     }
            //                 ];
            //                 oCommonModel.setProperty("/data/listPage/create/cml/customDataset", oCustomDataset);
            //                 oCommonModel.setProperty("/data/listPage/create/cml/selectedCMLRadio", true);
            //                 oCommonModel.setProperty("/data/listPage/create/cml/selectedGridCMLRadio", false);
            //                 oCommonModel.setProperty("/data/listPage/create/cml/customGridDataset", {
            //                     "gridCMLName": "",
            //                     "rowSize": 2,
            //                     "colSize": 2,
            //                     "cmlTemplate": ""
            //                 });
            //                 var aCustomRowColumDataSet = [
            //                     {
            //                         "name": "",
            //                         "description": "",
            //                         "nameValueState": "None",
            //                         "nameValueStateText": "",
            //                         "descpValueState": "None"
            //                     }
            //                 ];

            //                 oCommonModel.setProperty("/data/listPage/create/cml/customRowColumDataSet", aCustomRowColumDataSet);
            //             }
            //         }, function (oError) {
            //             that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE026"), oError);
            //         });
            //     });
            // }
            
            /**
             * Function to save the CML and Grid CML
             */
            var fnSaveCML = function (aNewCMLList, isSiblingPresent) {
                var sMessage;
                var sSiblingContainCml=null;
                if (isSiblingPresent && isSiblingPresent.length > 0) {
                    sMessage=oMessageBundle.getText("CML.MESSAGE037")
                    sSiblingContainCml=isSiblingPresent;
                } else {
                    sMessage = oMessageBundle.getText("CML.MESSAGE003");
                    sSiblingContainCml=null
                }
                aNewCMLList.forEach(function (oPayLoadData) {
                    oPayLoadData = that.setCreatedModified(oPayLoadData, "POST");
                    that.CMLDataSource.createCML(oPayLoadData, function (oResult) {
                        aResultFinal.push(oResult);
                        if (aResultFinal.length === aNewCMLList.length) {
                            sap.ui.core.BusyIndicator.hide();
                            that._oDailogCreateCML.close();
                            that.fnMessageShow("S",sMessage,sSiblingContainCml, function (sAction) {
                                if (sAction === "OK") {
                                    var oRouter = that.getOwnerComponent().getRouter(),
                                        sObjectType = oCommonModel.getProperty("/data/listPage/create/cml/objectType"),
                                        sObjectId = oCommonModel.getProperty("/data/listPage/create/cml/sObjectId");

                                    // Check if the Asset is already present or not
                                    that.CMLDataSource.getCMLAsset(sObjectId, function (isAssetPresent) {
                                        if (isAssetPresent.value.length > 0) {
                                            // Go to detail page
                                            oRouter.navTo("nCMLDetail", {
                                                objectType: sObjectType,
                                                objectId: sObjectId
                                            });
                                        } else {
                                            // Create Asset if not present
                                            var oPayload = {
                                                "halfLife": null,
                                                "remainingLife": null,
                                                "tMin": null,
                                                "retirementDate": null,
                                                "isGrowth": null,
                                                "isBelowTmin": null,
                                                "deleted": false
                                            };

                                            if (sObjectType === "Equipment" || sObjectType === "EQUI") {
                                                oPayload.objectId = sObjectId;
                                                oPayload.objectType = "EQUI";
                                                oPayload["to_equipment_ID"] = sObjectId;
                                            } else {
                                                oPayload.objectId = sObjectId;
                                                oPayload.objectType = "FLOC";
                                                oPayload["to_functionalLocation_ID"] = sObjectId;
                                            }

                                            oPayload = that.setCreatedModified(oPayload, "POST");

                                            that.CMLDataSource.createCMLAsset(oPayload, function () {
                                                that.getView().byId("idCMLMTable_").getBinding("items").refresh();
                                                oRouter.navTo("nCMLDetail", {
                                                    objectType: sObjectType,
                                                    objectId: sObjectId
                                                });
                                            }, function (oError) {
                                                that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE027"), oError);
                                            });
                                        }
                                    }, function (oError) {
                                        that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE016"), oError);
                                    });
                                }
                            });

                            // Reset create form
                            oCommonModel.setProperty("/data/listPage/create/cml/selectedEqpFloc", "");
                            oCommonModel.setProperty("/data/listPage/create/cml/selectedLocation", "");
                            var oCustomDataset = [
                                {
                                    "name": "",
                                    "description": "",
                                    "cmlTemplate": "",
                                    "nameValueState": "None",
                                    "nameValueStateText": "",
                                    "descpValueState": "None"
                                },
                                {
                                    "name": "",
                                    "description": "",
                                    "cmlTemplate": "",
                                    "nameValueState": "None",
                                    "nameValueStateText": "",
                                    "descpValueState": "None"
                                }
                            ];
                            oCommonModel.setProperty("/data/listPage/create/cml/customDataset", oCustomDataset);
                            oCommonModel.setProperty("/data/listPage/create/cml/selectedCMLRadio", true);
                            oCommonModel.setProperty("/data/listPage/create/cml/selectedGridCMLRadio", false);
                            oCommonModel.setProperty("/data/listPage/create/cml/customGridDataset", {
                                "gridCMLName": "",
                                "rowSize": 2,
                                "colSize": 2,
                                "cmlTemplate": ""
                            });
                            var aCustomRowColumDataSet = [
                                {
                                    "name": "",
                                    "description": "",
                                    "nameValueState": "None",
                                    "nameValueStateText": "",
                                    "descpValueState": "None"
                                }
                            ];
                            oCommonModel.setProperty("/data/listPage/create/cml/customRowColumDataSet", aCustomRowColumDataSet);
                        }
                    }, function (oError) {
                        that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE026"), oError);
                    });
                });
            };


            if (bGridCml) {
                fnSaveCML(aNewCMLList);
            } else {
                that.fnValidateCMLName(function (isValid,forDuplicate,isSiblingPresent) {
                    if (isValid) {
                        if(isSiblingPresent && isSiblingPresent.length > 0){
                            sap.ui.core.BusyIndicator.hide();
                            fnSaveCML(aNewCMLList,isSiblingPresent);
                        }
                        else{
                            sap.ui.core.BusyIndicator.hide();
                            fnSaveCML(aNewCMLList);
                        }
                    } else {
                        if(forDuplicate){
                            sap.ui.core.BusyIndicator.hide();
                            that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE036"));
                        }else{
                            sap.ui.core.BusyIndicator.hide();
                            that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE022"));
                        }
                        // oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", false);
                    }
                });
            }

        },

        /**
         * Function will trigger on CML Template change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         * @param {String} sCMLType - CML Creation type
         */
        onCMLTemplateChange: function (oEvent, sCMLType) {

            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var oSelectedItem = {}
            var oCreateInspectionWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");
            if (sCMLType === "addCML") {
                oSelectedItem = oCommonModel.getProperty(oEvent.getSource().getBindingContext("mCMLModel").sPath).cmlTemplate;              

                if (oSelectedItem) {
                    oCommonModel.setProperty("/data/listPage/create/cml/selectedLocationName", oSelectedItem);
                    that.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());
                } else {
                    that.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());
                    mCMLModel.setProperty("/metaData/listPage/create/cml/valueState/cmlTemplate", "Error");
                    mCMLModel.setProperty("/metaData/listPage/create/cml/valueStateText/cmlTemplate", "Please select CML Template");
                }
            } else {
                oSelectedItem = oEvent.getSource().getSelectedKey("mCMLModel");

                if (oSelectedItem) {
                    oCommonModel.setProperty("/data/listPage/create/cml/selectedLocationName", oSelectedItem);
                    that.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());
                } else {
                    that.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());
                    mCMLModel.setProperty("/metaData/listPage/create/cml/valueState/cmlTemplate", "Error");
                    mCMLModel.setProperty("/metaData/listPage/create/cml/valueStateText/cmlTemplate", "Please select CML Template");
                }
            }

        },

        /**
         * After open create CML dialog set values to binding and Process the validation
         */
        onAfterCreateCMLDialogOpen: function () {

            var oCreateCMLWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");
            var oCommonModel = this.getView().getModel("mCMLModel");
            var oCreateCMLWizard = {
                "prevStep": false,
                "nextStep": true,
                "currStep": 1,
                "cmlTree": [],
                "nextStepEnabled": false,
                "createEnabled": false
            };
            var oCustomDataset = [
                {
                    "name": "",
                    "description": "",
                    "cmlTemplate": "",
                    "nameValueState": "None",
                    "nameValueStateText": "",
                    "descpValueState": "None"
                },
                {
                    "name": "",
                    "description": "",
                    "cmlTemplate": "",
                    "nameValueState": "None",
                    "nameValueStateText": "",
                    "descpValueState": "None"
                }
            ];
            oCommonModel.setProperty("/data/listPage/create/cml/selectedCMLRadio", true);
            oCommonModel.setProperty("/data/listPage/create/cml/selectedGridCMLRadio", false);
            oCommonModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
            oCommonModel.setProperty("/data/listPage/create/cml/customGridDataset", {
                "gridCMLName": "",
                "rowSize": 2,
                "colSize": 2,
                "cmlTemplate": ""
            });
            var aCustomRowColumDataSet = [
                {
                    "name": "",
                    "description": "",
                    "nameValueState": "None",
                    "nameValueStateText": "",
                    "descpValueState": "None"
                }
            ];

            oCommonModel.setProperty("/data/listPage/create/cml/customRowColumDataSet", aCustomRowColumDataSet);

            oCommonModel.setProperty("/data/listPage/create/cml/customDataset", oCustomDataset);
            oCommonModel.setProperty("/metaData/listPage/create/cml/wizard", oCreateCMLWizard);
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/cmlTemplate", false);
            oCreateCMLWiz.discardProgress(oCreateCMLWiz.getSteps()[0]);

            this.onValidateCreateCMLWiz("step" + oCreateCMLWiz.getProgress());

        },

        /**
         * 
         * @param {Object} oEvent - The event object that triggered this function
         * @param {String} sNavMode - Create CML Navigation Mode
         */
        onCreateCMLWizNav: function (oEvent, sNavMode) {

            var oCreateInspectionWiz = sap.ui.getCore().byId("idCreateCMLFragment--idCreateCMLWizard");
            var mCMLModel = this.getView().getModel("mCMLModel");

            if (sNavMode === "next") {
                oCreateInspectionWiz.nextStep();
            } else {
                oCreateInspectionWiz.previousStep();
            }

            mCMLModel.setProperty("/metaData/listPage/create/cml/wizard/currStep", oCreateInspectionWiz.getProgress());
            this.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());
        },

        /**
         * Validate the Create CML steps
         * 
         * @param {String} sStep - Create CML Navigation Step
         */
        onValidateCreateCMLWiz: function (sStep) {

            var oCommonModel = this.getView().getModel("mCMLModel");
            var oCMLCreate = oCommonModel.getProperty("/data/listPage/create/cml");
            var aLocationTemplate = oCommonModel.getProperty("/data/listPage/locationList/locationTemplateList");
            var bEnabled = false;
            var sPath = "";
            var iCount = 0;

            if (sStep === "step1") {
                if (oCMLCreate.selectedEqpFloc) {
                    iCount = iCount + 1;
                }

                if (oCMLCreate.selectedObjectTemplate) {
                    iCount = iCount + 1;
                }

                if (iCount === 2) {
                    bEnabled = true;
                }

                oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/nextStepEnabled", bEnabled);
            } else if (sStep === "step2") {
                var bGridCml = oCommonModel.getProperty("/data/listPage/create/cml/selectedGridCMLRadio");
                if (bGridCml) {
                    var oGridData = oCommonModel.getProperty("/data/listPage/create/cml/customGridDataset");
                    if(oGridData.gridCMLName) {
                        iCount = iCount + 1;
                    }
                    
                    if (oGridData.rowSize) {
                        iCount = iCount + 1;
                    }
                    
                    if(oGridData.colSize) {
                        iCount = iCount + 1;
                    }
                    
                    if(oGridData.cmlTemplate) {
                        iCount = iCount + 1;
                    } 

                    if(iCount === 4) {
                        oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/nextStepEnabled", true);
                        oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", false);

                        var iRows = oCommonModel.getProperty("/data/listPage/create/cml/customGridDataset/rowSize");
                        var iColumns = oCommonModel.getProperty("/data/listPage/create/cml/customGridDataset/colSize");

                        var iTotalGrid = iRows * iColumns;
                        var oTempGrid = oCommonModel.getProperty("/data/listPage/create/cml/customRowColumDataSet/0/");
                        var aGridCML = [];
                        for (var i = 0; i < iTotalGrid; i++) {
                            aGridCML.push(Object.assign({}, oTempGrid));
                        }

                        oCommonModel.setProperty("/data/listPage/create/cml/customRowColumDataSet", aGridCML);
                    }
                } else {
                    sPath = Fragment.byId("idCreateCMLFragment", "idCustomDataSourceTable").getBinding("items").sPath;
                
                    var oNewCMLList = oCommonModel.getProperty(sPath);
                    var aNewCMLList = [];
                    var aSameName = [];
                    var aTempNoName = [], aTempNoDescp = [], aTempNoCMLTemplate = [];

                    if (oNewCMLList.length >= 1) {
                        oNewCMLList.forEach(function (oItem) {
                            if (aLocationTemplate.length > 0) {
                                var oPersonaData = aLocationTemplate.find(function (oPersona) {
                                    if (Object.keys(oPersona).length > 0) {
                                        return oPersona.id === oItem.cmlTemplate;
                                    }
                                });
                            }
                            var sPersonaId = null;
                            if (oPersonaData && oPersonaData.to_persona_master.length > 0) {
                                var oPersonaMaster = oPersonaData.to_persona_master.find(function (oMasterData) {
                                    return oMasterData.type === "DEFN";
                                });
                                sPersonaId = oPersonaMaster.id;
                            }

                            if (oItem.isSameName) {
                                aSameName.push(oItem);
                            } else {
                                if (oItem.name !== "" && oItem.description !== "" && oItem.cmlTemplate !== "") {
                                    var oCreateCMLFinal = {
                                        "objectId": oCMLCreate.sObjectId,
                                        "objectType": oCMLCreate.objectType,
                                        "cmlTemplateId": oItem.cmlTemplate,
                                        "active": true,
                                        "name": oItem.name,
                                        "persona_id": sPersonaId,
                                        "deleted": false,
                                        "to_description": [{ "shortDescription": oItem.description }],
                                        "to_values": [{
                                            "dataSourcename": "ACTIVE",
                                            "dataSourceValue": btoa(JSON.stringify({ value: true })),
                                            "referenceId": oCMLCreate.sObjectId,
                                            "referenceType": oCMLCreate.objectType
                                        }, {
                                            "dataSourcename": "DESCRIPTION",
                                            "dataSourceValue": btoa(JSON.stringify({ value: oItem.description })),
                                            "referenceId": oCMLCreate.sObjectId,
                                            "referenceType": oCMLCreate.objectType
                                        }]
                                    }

                                    if (oCMLCreate.objectType === "FLOC") {
                                        oCreateCMLFinal["to_location"] = [{ "functionalLocation_ID": oCMLCreate.sObjectId }];
                                    } else {
                                        oCreateCMLFinal["to_equipment"] = [{ "equipment_ID": oCMLCreate.sObjectId }];
                                    }

                                    aNewCMLList.push(oCreateCMLFinal);
                                } else if (oItem.name !== "") {
                                    aTempNoName.push(oItem);
                                } else if (oItem.description !== "") {
                                    aTempNoDescp.push(oItem);
                                } else if (oItem.cmlTemplate !== "") {
                                    aTempNoCMLTemplate.push(oItem);
                                }
                            }
                        });
                    }
                    if (aNewCMLList.length > 0) {
                        if (aSameName.length > 0 || aTempNoName.length > 0 || aTempNoDescp.length > 0 || aTempNoCMLTemplate.length > 0) {
                            bEnabled = false;
                        } else {
                            bEnabled = true;
                        }
                        oCommonModel.setProperty("/data/listPage/create/cml/aNewCMLList", aNewCMLList);
                    }

                    oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", bEnabled);
                    oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/nextStepEnabled", false);
                }
            } else if (sStep === "step3") {
                sPath = Fragment.byId("idCreateCMLFragment", "idCustomGridCMLDataSourceTable").getBinding("items").sPath;
                var aGridCMLList = oCommonModel.getProperty(sPath);

                var aEmptyList = aGridCMLList.filter(function (oGridItem) {
                    return oGridItem.name === "" || oGridItem.description === "";
                });

                if (aEmptyList.length > 0) {
                    oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/nextStepEnabled", false);
                    oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", false);
                } else {

                    var oGridCMLList = oCommonModel.getProperty("/data/listPage/create/cml/customGridDataset");
                    var oGridRowColumDataSet = oCommonModel.getProperty("/data/listPage/create/cml/customRowColumDataSet");

                    if (aLocationTemplate.length > 0) {
                        var oGridPersonaData = aLocationTemplate.find(function (oPersona) {
                            if (Object.keys(oPersona).length > 0) {
                                return oPersona.id === oGridCMLList.cmlTemplate;
                            }
                        });
                    }
                    
                    var sGridPersonaId = null;
                    if (oGridPersonaData && oGridPersonaData.to_persona_master.length > 0) {
                        var oGridPersonaMaster = oGridPersonaData.to_persona_master.find(function (oMasterData) {
                            return oMasterData.type === "DEFN";
                        });
                        sGridPersonaId = oGridPersonaMaster.id;
                    }

                    var oGridCML = {
                        "gridCML": oGridCMLList,
                        "gridCMLDataSet": oGridRowColumDataSet
                    }
                    var sGridCML = JSON.stringify(oGridCML);

                    var oGridPayload = [
                        {
                            "objectId": oCMLCreate.sObjectId,
                            "objectType": oCMLCreate.objectType,
                            "cmlTemplateId": oGridCMLList.cmlTemplate,
                            "active": true,
                            "name": oGridCMLList.gridCMLName,
                            "persona_id": sGridPersonaId,
                            "gridCML": sGridCML,
                            "deleted": false,
                            "to_description": [
                                {
                                    "shortDescription": "",
                                    "language": "en"
                                }
                            ],
                            "to_values": [
                                {
                                    "dataSourcename": "ACTIVE",
                                    "dataSourceValue": btoa(JSON.stringify({ value: true })),
                                    "referenceId": oCMLCreate.sObjectId,
                                    "referenceType": oCMLCreate.objectType
                                }
                            ],
                            "to_equipment": [
                                {
                                    "equipment_ID": oCMLCreate.sObjectId
                                }
                            ],
                            "createdBy": "",
                            "modifiedBy": ""
                        }
                    ];

                    oCommonModel.setProperty("/data/listPage/create/cml/aNewCMLList", oGridPayload);
                    oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/nextStepEnabled", false);
                    oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", true);
                }
            }

        },

        /**
         * Change the Create CML Wiz
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onCreateCMLWizNavChange: function (oEvent) {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var iStep = oEvent.getSource().getSteps().indexOf(oEvent.getParameter("step")) + 1;

            mCMLModel.setProperty("/metaData/listPage/create/cml/wizard/currStep", iStep);

            oEvent.getSource().setCurrentStep(oEvent.getParameter("step"));

            this.onValidateCreateInspectionWiz("step" + iStep);
        },

        /**
         * Function to Enable the field in Create CML Dialog
         */
        fnHandleEnable: function () {

            var oCommonModel = this.getView().getModel("mCMLModel");

            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/cmlTemplate", false);
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/name", false);
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/description", false);
            oCommonModel.setProperty("/data/listPage/create/cml/isDeleteEnabled", false);
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/addIcon", false);
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/save", false);

        },

        /**
         * Function to sort the List based on Coumn name
         * 
         * @param {Array} aList - Sorting List
         * @param {String} sColumnName - Sorting Column name
         * @returns 
         */
        fnSortArrayOfObject: function (aList, sColumnName) {

            /**
             * Compare one by one
             * @param {Object} a 
             * @param {Object} b 
             * @returns  Boolean
             */
            function fnCompare(a, b) {
                if (a[sColumnName] < b[sColumnName])
                    return -1;
                if (a[sColumnName] > b[sColumnName])
                    return 1;
                return 0;
            }

            var aRetList = aList.sort(fnCompare);

            return aRetList;

        },

        /**
         * Asset overview Row click to Navigate to detail page
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onPressAssetOverview: function (oEvent) {

            var that = this;
            var oRouter = that.getOwnerComponent().getRouter();
            var oContext = oEvent.getSource().getBindingContext("masterService").getObject();
            var sObjectId = oEvent.getSource().getBindingContext("masterService").getProperty("objectId");
            var sObjectTypeCode = oEvent.getSource().getBindingContext("masterService").getProperty("objectType");
            var sObjectType = "";

            if (sObjectTypeCode === "EQUI") {
                sObjectType = "equipment";
            } else {
                sObjectType = "functionalLocation";
            }

            if (oContext) {
                oRouter.navTo("nCMLDetail", {
                    objectType: sObjectType,
                    objectId: sObjectId
                });
            }

        },

        /**
         * Handle On click of Table Tmin, Growth color filter.
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onFilterbyColor: function (oEvent) {

            this.onSearchLiveChange(oEvent);

        },

        /**
         * Asset overview list Table - General Search
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onSearchLiveChange: function (oEvent) {

            var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
            this._sSegment = "";
            var oSegmentButton = "";

            if (oEvent.getParameters().selectedItem.sId.includes("idErrorColor")) {
                oEvent.getSource().removeStyleClass(oEvent.getSource().aCustomStyleClasses[0]);
                oEvent.getSource().addStyleClass("errorColor");
                oSegmentButton = "Danger";
                this._sSegment = oSegmentButton;
                this.getView().byId("idStatusFilter").setSelectedKey(sSelectedKey);
            } else if (oEvent.getParameters().selectedItem.sId.includes("idGrowthColor")) {
                oEvent.getSource().removeStyleClass(oEvent.getSource().aCustomStyleClasses[0]);
                oEvent.getSource().addStyleClass("growthColor");
                oSegmentButton = "Warning";
                this._sSegment = oSegmentButton;
                this.getView().byId("idStatusFilter").setSelectedKey(sSelectedKey);
            } else {
                oEvent.getSource().removeStyleClass(oEvent.getSource().aCustomStyleClasses[0]);
                oSegmentButton = "";
                this._sSegment = oSegmentButton;
                this.getView().byId("idStatusFilter").setSelectedKey(sSelectedKey);
            }

            this.onStatusChange();
            this._isCreateSearch = false;

        },

        /**
         * Handle user selection Tmin, Growth color filter
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onSelectSegment: function (oEvent) {

            var oCommonModel = this.getView().getModel("mCMLModel");
            var sKey = oEvent.getParameters().item.getProperty("key");
            var aObjectList = oCommonModel.getProperty("/data/listPage/equipmentLocationList/valueHelpDataMaster");

            var aFilteredData = aObjectList.filter(function (oItem) {
                return oItem.objectType === sKey;
            });

            oCommonModel.setProperty("/data/listpage/equipmentLocationList/valueHelpData", aFilteredData);

            this.onSearchLiveChangeCreate();

        },

        /**
         * Apply Filter for List page Analytics
         * 
         * @param {Array} aSetAllFilters 
         */
        fnApplyDatasetFilter: function (aSetAllFilters) {

            var oVizFrame = this.getView().byId("idVizFrameHalfLife");
            var oDataset = oVizFrame.getDataset();

            oDataset.getBinding("data").filter(aSetAllFilters);

        },

        /**
         * Function to create a new row for Create CML dialog
         */
        handleAddNewRow: function () {
            var oCommonModel = this.getView().getModel("mCMLModel");
            var tableRows = oCommonModel.getProperty("/data/listPage/create/cml/customDataset");
            var oRowInputs = Fragment.byId("idCreateCMLFragment", "idCreateCMLRows");
            var iDynamicCount = Number(oRowInputs.getValue());
            var newObj = {
                "name": "",
                "description": "",
                "cmlTemplate": "",
                "nameValueState": "None",
                "nameValueStateText": "",
                "descpValueState": "None"
            };

            if (iDynamicCount) {
                for (let i = 0; i < iDynamicCount; i++) {
                    tableRows.push(Object.assign({}, newObj));
                }
            } else {
                tableRows.push(Object.assign({}, newObj));
            }

            oCommonModel.setProperty("/data/listPage/create/cml/customDataset", tableRows);
            oRowInputs.setValue("");
            if (tableRows.length > 1) {
                oCommonModel.setProperty("/data/listPage/create/cml/isDeleteEnabled", true);
            }
        },

        /**
         * Function to delete the row in Create CML Dialog
         * @param {Object} oEvent - The event object that triggered this function
         */
        handleDeleteTableRow: function (oEvent) {
            var oCommonModel = this.getView().getModel("mCMLModel");
            var sPath = oEvent.getSource().getBindingContext("mCMLModel").sPath;
            var tableRows = oCommonModel.getProperty("/data/listPage/create/cml/customDataset");
            var index = sPath.split("/")[6];
            tableRows.splice(index, 1);
            oCommonModel.setProperty("/data/listPage/create/cml/customDataset", tableRows);

            if (tableRows.length > 1) {
                oCommonModel.setProperty("/data/listPage/create/cml/isDeleteEnabled", true);
            } else {
                oCommonModel.setProperty("/data/listPage/create/cml/isDeleteEnabled", false);
            }
        },

        /**
         * Function to handle the validation for CML already present in component Object for Create CML Dialog
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onTableNameValChange: function (oEvent) {

            var that = this;
            var sNameValue = oEvent.getParameters().value;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var oCreateInspectionWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");
            var oCurrentAggegation = oEvent.getSource().getParent().getAggregation("cells");
            var oDescpValue = oCurrentAggegation[1];
            var sPath = oCurrentAggegation[0].getBindingContext("mCMLModel").sPath;
            var oCurrentInputData = oCommonModel.getProperty(sPath);

            if (sNameValue !== "" && sNameValue.trim() !== "") {

                // No live change validate instead Create button validation

                // if (aCMLLsit && Object.keys(aCMLLsit).length > 0) {
                //     var isOldCMLSameName = aCMLLsit.find(function (oItem) {
                //         if (oItem.name === sNameValue) {
                //             return true;
                //         }
                //     });
                // }
                // var isCurrentCMLSameName = false;

                // for (let i = 0; i < aTableList.length; i++) {
                //     if (i !== iCurrentIndex && aTableList[i].name === sNameValue) {
                //         isCurrentCMLSameName = true;
                //     }
                // }

                // if (isOldCMLSameName) {
                //     oCurrentInputData.isSameName = true;
                //     oEvent.getSource().setValueState("Error");
                //     oEvent.getSource().setValueStateText("This name is already exist, please enter new name");
                //     oDescpValue.setValueState("None");
                //     oDescpValue.setValueStateText("");
                // } else if (isCurrentCMLSameName) {
                //     oCurrentInputData.isSameName = true;
                //     oEvent.getSource().setValueState("Error");
                //     oEvent.getSource().setValueStateText("You entered this name already, Please enter new name");
                //     oDescpValue.setValueState("None");
                //     oDescpValue.setValueStateText("");
                // } else {
                //     oCurrentInputData.isSameName = false;
                //     oEvent.getSource().setValueState("None");
                //     oEvent.getSource().setValueStateText("");
                //     if (oDescpValue.getValue() === "" && oDescpValue.getValue().trim() === "") {
                //         oDescpValue.setValueState("Information");
                //         oDescpValue.setValueStateText("Please enter the CML Description");
                //     }
                // }

                oCurrentInputData.isSameName = false;
                oEvent.getSource().setValueState("None");
                oEvent.getSource().setValueStateText("");
                if (oDescpValue.getValue() === "" && oDescpValue.getValue().trim() === "") {
                    oDescpValue.setValueState("Information");
                    oDescpValue.setValueStateText("Please enter the CML Description");
                }
            } else {
                if (oDescpValue.getValue() === "" && oDescpValue.getValue().trim() === "") {
                    oDescpValue.setValueState("None");
                    oDescpValue.setValueStateText("");
                    oEvent.getSource().setValueState("None");
                    oEvent.getSource().setValueStateText("");
                } else {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Please enter the CML Name");
                }
            }

            that.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());

        },

        /**
         * Function triggger when user made any change in CML Description field in Create CML Dialog
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onTableDescpValChange: function (oEvent) {

            var that = this;
            var oCreateInspectionWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");
            var oNameValue = oEvent.getSource().getParent().getAggregation("cells")[0];

            if (oEvent.getParameters().value !== "" && oEvent.getParameters().value.trim() !== "") {
                oEvent.getSource().setValueState("None");
                oEvent.getSource().setValueStateText("");
                if (oNameValue.getValue() === "" && oNameValue.getValue().trim() === "") {
                    oNameValue.setValueState("Information");
                    oNameValue.setValueStateText("Please enter the CML Name");
                }
            } else {
                if (oNameValue.getValue() === "" && oNameValue.getValue().trim() === "") {
                    oNameValue.setValueState("None");
                    oNameValue.setValueStateText("");
                    oEvent.getSource().setValueState("None");
                    oEvent.getSource().setValueStateText("");
                } else {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("Please enter the CML Description");
                }
            }

            that.onValidateCreateCMLWiz("step" + oCreateInspectionWiz.getProgress());

        },

        /**
         * Open Create Inspection Dialog
         */
        onAddNewInspection: function () {
            var that = this,
                oCommonModel = this.getView().getModel("mCMLModel");
            oCommonModel.setProperty("/metaData/view", "INSP");
            if (!this._oDialogCreateInspection) {
                Fragment.load({
                    id: "idCreateInspectionFragment",
                    name: "com.asint.ais.mi.cml.view.fragment.DialogCreateInspection",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDialogCreateInspection = oDialog;
                    this._oDialogCreateInspection.open();
                }.bind(this));
            } else {
                this._oDialogCreateInspection.open();
            }
            that.fnResetValuesforCreateInspection();

        },

        /**
         * Function trigger after the Create Inspection dialog open
         */
        onAfterCreateInspectionDialogOpen: function () {

            var oCreateInspectionWiz = sap.ui.getCore().byId("idCreateInspectionFragment--idCreateInspectionWizard");
            var mCMLModel = this.getView().getModel("mCMLModel");
            var oDefaultCML = JSON.parse(mCMLModel.getProperty("/data/cmlList"));
            var aCreatedCML = mCMLModel.getProperty("/data/listPage/create/cml/saveData");
            var oCreateInspectionWizard = {
                "prevStep": false,
                "nextStep": true,
                "currStep": 1,
                "cmlTree": [],
                "nextStepEnabled": false,
                "createEnabled": false,
                "objectType": "EQUI",
                "objectSearchQuery": ""
            };
            var oCreateInspection = {
                "inspectionDesctiption": "",
                "inspectionDate": null,
                "selectedObject": {
                    "id": "",
                    "name": "",
                    "type": ""
                },
                "selectedCml": [],
                "selectedCmlMap": {},
                "readings": []
            };
            // var oCreateInspectionObjectTable = sap.ui.getCore().byId("idCreateInspectionFragment--idObjectTable");

            if (aCreatedCML) {
                aCreatedCML.forEach(function (oItem) {
                    if (!oDefaultCML[oItem.locationTemplateName]) {
                        oDefaultCML[oItem.locationTemplateName] = {
                            "id": oItem.locationTemplateId,
                            "name": oItem.locationTemplateName,
                            "desc": "",
                            "type": "CMLTemplate",
                            "selected": false,
                            "nodes": []
                        }
                    }
                    oDefaultCML[oItem.locationTemplateName].nodes.push({
                        "id": oItem.locationId,
                        "name": oItem.name,
                        "desc": oItem.description,
                        "type": "CML",
                        "selected": false
                    });
                });
                oCreateInspectionWizard.cmlTree = Object.values(oDefaultCML);

                mCMLModel.setProperty("/data/createInspectionWizard", oCreateInspectionWizard);
                mCMLModel.setProperty("/data/createInspection", oCreateInspection);
                oCreateInspectionWiz.discardProgress(oCreateInspectionWiz.getSteps()[0]);
                this.onValidateCreateInspectionWiz("step" + oCreateInspectionWiz.getProgress());
            }
            // oCreateInspectionObjectTable.removeSelections();

        },

        /**
         * Handle the navigation for Create Insepction Dialog Wiz
         * 
         * @param {Object} oEvent - The event object that triggered this function
         * @param {String} sNavMode - Wiz navigation mode (Next, Previous)
         */
        onCreateInspectionWizNav: function (oEvent, sNavMode) {

            var oCreateInspectionWiz = sap.ui.getCore().byId("idCreateInspectionFragment--idCreateInspectionWizard");
            var mCMLModel = this.getView().getModel("mCMLModel");

            if (sNavMode === "next") {
                oCreateInspectionWiz.nextStep();
            } else {
                oCreateInspectionWiz.previousStep();
            }

            mCMLModel.setProperty("/data/createInspectionWizard/currStep", oCreateInspectionWiz.getProgress());
            this.onValidateCreateInspectionWiz("step" + oCreateInspectionWiz.getProgress());

        },

        /**
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onCreateInspectionWizNavChange: function (oEvent) {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var iStep = oEvent.getSource().getSteps().indexOf(oEvent.getParameter("step")) + 1;
            // var inspDate=mCMLModel.getProperty("/data/createInspection/inspectionDate");

            mCMLModel.setProperty("/data/createInspectionWizard/currStep", iStep);
            // mCMLModel.setProperty("/data/createInspection/selectedCml/readingDate",inspDate);
            oEvent.getSource().setCurrentStep(oEvent.getParameter("step"));
            this.onValidateCreateInspectionWiz("step" + iStep);

        },

        /**
         * Close the Create Inspection Dialog
         */
        onCreateInspectionDialogCancel: function () {

            if (this._oDialogCreateInspection) {
                this._oDialogCreateInspection.close();
            }

        },

        /**
         * Create Inspection CML Selection change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onCMLSelectionChange: function (oEvent) {

            var oListItem = oEvent.getParameter("listItem");
            var mCMLModel = this.getView().getModel("mCMLModel");
            var oSelectedCml = mCMLModel.getProperty("/data/createInspection/selectedCmlMap");
            var sPath = oListItem.getBindingContextPath();
            var bSelected = oEvent.getParameter("selected");

            /**
             * 
             * @param {Object} oCML - Selected CML
             * @param {Object} oCMLTemplate - Selected CML Template
             */
            var fnUpdateSelectedCml = function (oCML, oCMLTemplate) {
                if (bSelected) {
                    if (!oSelectedCml[oCML.name + " - " + oCML.desc]) {
                        oSelectedCml[oCML.name + " - " + oCML.desc] = Object.assign(oCML, {
                            reading: "",
                            cmlTemplate: oCMLTemplate.name
                        });
                    }
                } else {
                    // eslint-disable-next-line no-prototype-builtins
                    if (oSelectedCml.hasOwnProperty(oCML.name + " - " + oCML.desc)) {
                        delete oSelectedCml[oCML.name + " - " + oCML.desc];
                    }
                }
            };

            var oCMLTemplate = "";
            if (oListItem.data("type") === "CML") {
                var oCML = mCMLModel.getProperty(sPath);
                sPath = sPath.substring(0, sPath.lastIndexOf("/nodes"));
                oCMLTemplate = mCMLModel.getProperty(sPath);
                oCMLTemplate.selected = true;
                fnUpdateSelectedCml(oCML, oCMLTemplate);
                oCMLTemplate.nodes.forEach(function (oCML) {
                    if (!oCML.selected) {
                        oCMLTemplate.selected = false;
                    }
                });
                mCMLModel.setProperty(sPath, oCMLTemplate);
            } else if (oListItem.data("type") === "Parent") {
                oCMLTemplate = mCMLModel.getProperty(sPath);
                oCMLTemplate.nodes.forEach(function (oCML) {
                    oCML.selected = bSelected;
                    if (oCML.nodes && oCML.nodes.length > 0) {
                        oCML.nodes.forEach(function (oNode) {
                            oNode.selected = bSelected;
                            fnUpdateSelectedCml(oNode, oCML);
                        });
                    }
                });
                mCMLModel.setProperty(sPath, oCMLTemplate);
            } else {
                oCMLTemplate = mCMLModel.getProperty(sPath);
                oCMLTemplate.nodes.forEach(function (oCML) {
                    oCML.selected = bSelected;
                    fnUpdateSelectedCml(oCML, oCMLTemplate);
                });
                mCMLModel.setProperty(sPath, oCMLTemplate);
            }

            var aFinalValues = Object.values(oSelectedCml);
            aFinalValues.sort(function (a, b) {
                var title1 = a.name ? a.name.toUpperCase() : "";
                var title2 = b.name ? b.name.toUpperCase() : "";
                if (title1 < title2) {
                    return -1;
                } else if (title1 > title2) {
                    return 1;
                } else {
                    return 0;
                }
            });

            var aItems = Fragment.byId("idCreateInspectionFragment", "idStep3TreeTable").getItems();
            var iTableLength = aItems.length;
            var iSelected = 0;
            var isHeaderSelected = false;

            aItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext("mCMLModel").getObject();
                var iParent = oItem.getBindingContext("mCMLModel").sPath.split("nodes").length;

                if (iParent === 1) {
                    if (oContext.selected) {
                        iSelected++;
                        isHeaderSelected = true;
                    }
                } else {
                    if (oContext.selected) {
                        iSelected++;
                    }
                }

            });

            if (iTableLength - 1 === iSelected && !isHeaderSelected) {
                aItems[0].setSelected(true);
            } else if (iTableLength === iSelected) {
                aItems[0].setSelected(true);
            } else {
                aItems[0].setSelected(false);
            }
            mCMLModel.setProperty("/data/createInspection/selectedCml", aFinalValues);

            this.onValidateCreateInspectionWiz("step3");

        },

        /**
         * Create Inspection Object Type Change, clear value for model binding
         */
        onCreateInspectionObjectTypeChange: function () {

            var mCMLModel = this.getView().getModel("mCMLModel");

            mCMLModel.setProperty("/data/createInspection/selectedObject", {
                name: "",
                id: "",
                type: ""
            });
            mCMLModel.setProperty("/data/listPage/create/cml/selectedInspectionTemplate", []);
            mCMLModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", []);

            this.fnCreateInspectionWizObjectTableApplyFilter();

        },

        /**
         * Apply filter based on user selection for EQUI / FLOC List
         */
        fnCreateInspectionWizObjectTableApplyFilter: function () {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var oCreateInspectionWiz = mCMLModel.getProperty("/data/createInspectionWizard");
            // var oCreateInspectionObjectTable = sap.ui.getCore().byId("idCreateInspectionFragment--idObjectTable");
            var aFilter = [];

            if (oCreateInspectionWiz.objectType) {
                aFilter.push(new sap.ui.model.Filter({
                    path: "objectType",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oCreateInspectionWiz.objectType,
                    caseSensitive: false
                }));
            }
            if (oCreateInspectionWiz.objectSearchQuery) {
                aFilter.push(new sap.ui.model.Filter({
                    filters: [new sap.ui.model.Filter({
                        path: "objectName",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: oCreateInspectionWiz.objectSearchQuery,
                        caseSensitive: false
                    }),
                    new sap.ui.model.Filter({
                        path: "objectDesc",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: oCreateInspectionWiz.objectSearchQuery,
                        caseSensitive: false
                    })],
                    and: false
                }));
            }

            // oCreateInspectionObjectTable.getBinding("items").filter(new sap.ui.model.Filter({
            //     filters: aFilter,
            //     and: true
            // }));
            mCMLModel.setProperty("/data/createInspection/selectedObject", {
                name: "",
                id: "",
                type: ""
            });

            // oCreateInspectionObjectTable.removeSelections();
            this.onValidateCreateInspectionWiz("step2");

        },

        /**
         * Function will call the search function 
         */
        onCreateInspectionObjectSearch: function () {

            this.fnCreateInspectionWizObjectTableApplyFilter();

        },

        /**
         * Create Inspection dialog - Object field valuehelp change
         * 
         * @param {Object} oEvent -  The event object that triggered this function
         */
        onCreateInspectionObjectSelection: function (oEvent) {

            var oSelectedObject = oEvent.getSource().getSelectedItem().getBindingContext("mCMLModel").getObject();
            var mCMLModel = this.getView().getModel("mCMLModel");

            if (oSelectedObject) {
                mCMLModel.setProperty("/data/createInspection/selectedObject", {
                    name: oSelectedObject.objectName,
                    id: oSelectedObject.objectId,
                    type: oSelectedObject.ObjectType
                });
                mCMLModel.setProperty("/data/selectedObjectId", oSelectedObject.objectId);
            } else {
                mCMLModel.setProperty("/data/createInspection/selectedObject", {
                    name: "",
                    id: "",
                    type: ""
                });
            }

            this.onValidateCreateInspectionWiz("step2");

        },

        /**
         * Validate the Field based on steps
         * 
         * @param {String} sStep - Step of Create Inspection Wiz
         * @param {String} sSkipInspDate - Inspection Date
         */
        onValidateCreateInspectionWiz: function (sStep, sSkipInspDate) {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var oCreateInspection = mCMLModel.getProperty("/data/createInspection");
            var bEnabled = false;

            if (sStep === "step1") {
                if (oCreateInspection.selectedObjectTemplateName && oCreateInspection.selectedObjectTemplateName.length > 0 && oCreateInspection.selectedInspTemplateName && oCreateInspection.selectedInspTemplateName.length > 0) {
                    bEnabled = true;
                }
                mCMLModel.setProperty("/data/createInspectionWizard/nextStepEnabled", bEnabled);
            } else if (sStep === "step2") {
                if (oCreateInspection.inspectionDescription && oCreateInspection.inspectionDate) {
                    bEnabled = true;
                }
                mCMLModel.setProperty("/data/createInspectionWizard/nextStepEnabled", bEnabled);
            } else if (sStep === "step3") {
                if (oCreateInspection.selectedCml.length > 0) {
                    bEnabled = true;
                }
                mCMLModel.setProperty("/data/createInspectionWizard/nextStepEnabled", bEnabled);
            } else if (sStep === "step4") {
                bEnabled = true;
                for (var iIdx in oCreateInspection.selectedCml) {
                    if (!oCreateInspection.selectedCml[iIdx].reading.toString().length > 0) {
                        bEnabled = false;
                    }
                }
                if (sSkipInspDate != "Skip") {
                    var selectedCmlArray = mCMLModel.getProperty("/data/createInspection/selectedCml");
                    var inspDate = mCMLModel.getProperty("/data/createInspection/inspectionDate");

                    selectedCmlArray.forEach(function (item) {
                        item.readingDate = inspDate;
                    })

                    mCMLModel.setProperty("/data/createInspection/selectedCml", selectedCmlArray);
                }
                mCMLModel.setProperty("/data/createInspectionWizard/createEnabled", bEnabled);
            }

        },

        /**
         * Function to create inspection
         */
        onCreateInspectionDialogCreate: function () {

            var that = this;
            var mCMLModel = this.getView().getModel("mCMLModel");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var oCreateInspection = mCMLModel.getProperty("/data/createInspection");
            var oInspectionData = mCMLModel.getProperty("/data/listPage/create/inspection");
            var oTemplateData = mCMLModel.getProperty("/data/listPage/create/cml");
            var sObjectType = mCMLModel.getProperty("/data/createInspectionWizard/objectType");
            var inspTempHeaderMapData = mCMLModel.getProperty("/data/createInspection/inspTemplateHeaderMap");
            var cmls = [];
            that.busyDialog = new sap.m.BusyDialog();
            oCreateInspection.selectedCml.forEach(function (cml) {
                var obj = {
                    "cml_ID": cml.ID,
                    "deleted": false
                };
                cmls.push(obj);
            });
            var sNewObjType = "";
            var sNewObjectId = "";
            var oInspPayload = {
                "status": "UPBD",
                "objectType": "",
                "assessmentTemplateId": oTemplateData.selectedInspectionTemplate,
                "assessmentTemplateVersion": oCreateInspection.selectedInspTemplateVersion,
                "category": "IDMS",
                "deleted": false,
                "attachedEquipment_ID": null,
                "attachedLocation_ID": null,
                "to_description": {
                    "shortDescription": oCreateInspection.inspectionDescription,
                    "longDescription": "",
                    "language": "en"
                },
                "to_cmls": cmls,
                "to_genAssessmentValues": [],
                "to_genAssessmentUserRoles": []
            };
            if (sObjectType == "EQUI" || sObjectType == "EQP") {
                sNewObjType = "EQUI";
                sNewObjectId = oCreateInspection.selectedObject.id;
                oInspPayload.objectType = "EQUI";
                oInspPayload["attachedEquipment_ID"] = oCreateInspection.selectedObject.id;
            } else {
                sNewObjType = "FLOC";
                sNewObjectId = oCreateInspection.selectedObject.id;
                oInspPayload.objectType = "FLOC";
                oInspPayload["attachedLocation_ID"] = oCreateInspection.selectedObject.id;
            }
            if (inspTempHeaderMapData) {
                var oHeaderMap = inspTempHeaderMapData.to_inspectionHeaderMapping;
                if (oHeaderMap) {
                    var oInspectionDatePayload = {
                        sectionId: oHeaderMap.inspDateSectionId,
                        subSectionId: oHeaderMap.inspDateSubSectionId,
                        characteristicId: oHeaderMap.inspDateCharacteristicId,
                        characteristicValue: oCreateInspection.inspectionDate,
                        uom: "",
                        deleted: false
                    };
                    oInspPayload.to_genAssessmentValues.push(oInspectionDatePayload);
                }
                var aRoles = inspTempHeaderMapData.to_roles;
                var aRolesPayload = [];
                if (aRoles && aRoles.length > 0) {
                    aRoles.forEach(function (roleObject) {
                        if (roleObject && roleObject.role !== null) {
                            var payload = {
                                roleName: roleObject.role,
                                deleted: false,
                                assignedTo: roleObject.assignedTo ? roleObject.assignedTo : "",
                            };
                            aRolesPayload.push(payload);
                        }
                    });
                }
                oInspPayload["to_genAssessmentUserRoles"] = aRolesPayload;
            }

            that.CMLDataSource.createInspection(oInspPayload, function (oData) {
                oData = that.setCreatedModified(oData, "POST");
                that.updateValues(oData.ID, function () {
                    that.fnMessageShow("S", oMessageBundle.getText("CML.MESSAGE003"), null, function (sAction) {
                        if (sAction === "OK") {
                            mCMLModel.setProperty("/data/listPage/create/inspection", oInspectionData);
                            that.onCreateInspectionDialogCancel();
                            that.fnResetValuesforCreateInspection();
                            var oRouter = that.getOwnerComponent().getRouter();
                            oRouter.navTo("nCMLDetail", {
                                objectType: sNewObjType,
                                objectId: sNewObjectId
                            });
                        }
                    });
                });
            }, function (oError) {
                that.fnMessageShow("E", oI18n.getText("CML.MESSAGE0001"), oError);
            });
        },

        /**
         * Function to update reading values
         * @param {String} InspId 
         * @param {Function} fnCallBack 
         */
        updateValues: function (InspId, fnCallBack) {
            var that = this;
            var mCMLModel = this.getView().getModel("mCMLModel");
            var selectedCml = mCMLModel.getProperty("/data/createInspection/selectedCml");
            var selectedUOM = mCMLModel.getProperty("/data/UOM");
            var sInspectionDate = mCMLModel.getProperty("/data/createInspection/inspectionDate");
            var date = sInspectionDate ? new Date(sInspectionDate) : new Date();
            /**
             * Local success call back function
             */
            var fnSuccessLoop = function () {
                if (fnCallBack) {
                    fnCallBack();
                }
            };
            /**
             * Local function to loop cml values
             * @param {Number} index 
             */
            var fnLopUpadteCMLValue = function (index) {
                if (index < selectedCml.length) {
                    var sDate;
                    if (selectedCml[index].readingDate) {
                        sDate = new Date(selectedCml[index].readingDate);
                    } else {
                        sDate = date;
                    }
                    var value = {
                        DATE: sDate.toISOString(),
                        READING: selectedCml[index].reading
                    };
                    var valuesObj = {
                        "cml_ID": selectedCml[index].ID,
                        "dataSourcename": "READINGS",
                        "dataSourceValue": btoa(JSON.stringify({ value: value })),
                        "isIgnored": false,
                        "isValidated": true,
                        "referenceId": InspId,
                        "referenceType": "IDMS",
                        "deleted": false
                    };
                    var cmlValues = selectedCml[index].to_values;
                    if (cmlValues) {
                        cmlValues.push(valuesObj);
                    } else {
                        cmlValues = [];
                        cmlValues.push(valuesObj);
                    }
                    var oPayload = {
                        "ID": selectedCml[index].ID,
                        "deleted": false,
                        // eslint-disable-next-line camelcase
                        to_values: cmlValues
                    };
                    oPayload = that.setCreatedModified(oPayload, "POST");
                    that.CMLDataSource.updateCMLReading(oPayload, function () {
                        index = index + 1;
                        if (index == selectedCml.length) {
                            fnSuccessLoop();
                        }
                        fnLopUpadteCMLValue(index);
                    }, function (oError) {
                        index = index + 1;
                        if (index == selectedCml.length) {
                            fnSuccessLoop();
                        }
                        fnLopUpadteCMLValue(index);
                        that.fnMessageShow("E", oI18n.getText("asint.inspection.cml.message006"), oError)
                    }, selectedCml[index]["@etag"]);
                }
            };

            if (selectedUOM == "metric") {
                that.convertUOM(selectedCml, function (data) {
                    selectedCml = data;
                    fnLopUpadteCMLValue(0);
                });
            } else {
                fnLopUpadteCMLValue(0);
            }

        },

        /**
         * Uom Conversion for selected CML List
         * 
         * @param {Array} selectedCml - Selected CML List
         * @param {Function} fnCallBack - Callback function
         */
        convertUOM: function (selectedCml, fnCallBack) {

            var that = this;
            var oPayload = [];
            selectedCml.forEach(function (cml) {
                cml.key = cml.name + that.getSecureRandomString();
                var obj = {
                    "key": cml.key,
                    "src": "MM",
                    "tgt": "IN",
                    "srcValue": cml.reading.toString()
                }
                oPayload.push(obj);
            })
            that.CMLDataSource.fnUoMConvert(oPayload, function (aConvValue) {
                selectedCml.forEach(function (cmlValue) {
                    aConvValue.forEach(function (oRespItem) {
                        if (cmlValue.key === oRespItem.key) {
                            cmlValue.input = oRespItem.srcValue;
                            cmlValue.imperial = oRespItem.tgt;
                            cmlValue.metric = oRespItem.src;
                            cmlValue.reading = oRespItem.tgtValue;
                        }
                    })
                })
                if (fnCallBack) {
                    fnCallBack(selectedCml);
                }
            }, function (oError) {
                that.fnMessageShow("E", "Failed to convert Values", oError);
            });
        },

        /**
         * Function that generates the random string
         * @returns 
         */
        getSecureRandomString: function() {
            var array = new Uint8Array(3);
            window.crypto.getRandomValues(array);
            var randomString = "";
            for (var i = 0; i < array.length; i++) {
                randomString += array[i].toString(36).padStart(2, "0");
            }
            return randomString.substring(0, length);
        },

        /**
         * Open File upload dialog for CML Readings
         */
        OnImportFromFilePress: function () {
            var that = this;
            if (!that._oDailogImportFile) {
                that._oDailogImportFile = sap.ui.xmlfragment(
                    "_dialogImportFile",
                    "com.asint.ais.mi.cml.view.fragment.DialogImportFromFile",
                    this
                );
            }
            that.getView().addDependent(that._oDailogImportFile);
            var mCMLModel = that.getView().getModel("mCMLModel");
            mCMLModel.setProperty("/data/createInspection/enableImportbtn", false);
            that._oDailogImportFile.open();
        },

        /**
         * Function to handle file browse
         * @returns Object
         */
        onFileBrowse: function () {
            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            if (that._oDailogImportFile) {
                this.oFileUploader = Fragment.byId("_dialogImportFile", "idfileUploader");
                var oFile = this.oFileUploader.oFileUpload.files[0];
                var sFileName = oFile.name;
                if (!sFileName.endsWith(".xlsx") && !sFileName.endsWith(".xls")) {
                    that.fnMessageShow("E", "Please upload an Excel file.");
                    return;
                }
                var oReader = new FileReader();
                oReader.onload = function (e) {
                    that.busyDialog = new sap.m.BusyDialog();
                    that.busyDialog.open();
                    var aImportedFileData = [];
                    var aUoMConversionPayload = [];
                    var selectedUOM = that.getSelectedUoMSystem();
                    var sUnitOfMeasure = selectedUOM == "metric" ? "MM" : "IN";
                    var sXLSX = e.target.result;
                    var workbook = XLSX.read(sXLSX, { type: "binary" });
                    var sheetName = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[sheetName];
                    var aData = XLSX.utils.sheet_to_row_object_array(worksheet, { header: 1 });
                    var aColumns = aData[0];
                    var aMustHaveColumns = ["CML Template", "CML Name", "CML Description", "Reading", "Reading Date", "Uom"];
                    var bValidFile = true;

                    for (var i in bValidFile) {
                        if (!aColumns.includes(aMustHaveColumns[i])) {
                            bValidTemplate = false;
                        }
                    }

                    if (bValidFile) {
                        // eslint-disable-next-line no-redeclare
                        for (var i = 1; i < aData.length; i++) {
                            var oRowData = {
                                "CML Template": aData[i][0],
                                "CML Name": aData[i][1],
                                "CML Description": aData[i][2],
                                "Reading": aData[i][3],
                                "Reading Date": aData[i][4],
                                "Uom": aData[i][5]
                            };
                            oRowData["Status"] = "Failure";
                            oRowData["Reason"] = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column5.cmlNotFound.text");
                            oRowData["recentReading"] = "";
                            var sUom = oRowData["Uom"];
                            if (sUom) {
                                sUom = sUom.toUpperCase();
                            } else {
                                sUom = "IN";
                            }
                            if (!(isNaN(oRowData["Reading"])) && sUom != sUnitOfMeasure) {
                                aUoMConversionPayload.push(
                                    {
                                        "key": (i - 1).toString(),
                                        "src": sUom,
                                        "tgt": sUnitOfMeasure,
                                        "srcValue": oRowData["Reading"]
                                    }
                                )
                            }
                            aImportedFileData.push(oRowData);
                        }
                        that.uomCoversion(aUoMConversionPayload, aImportedFileData);
                    } else {
                        that.fnMessageShow("E", "The columns in the imported excel file didn't match the template. Please download the template again and import");
                    }
                    that.busyDialog.close();
                };
                oReader.readAsBinaryString(oFile);
            }
        },

        /**
         * UOM conversion for Imported file
         * 
         * @param {Array} aUoMConversionPayload - List of payload for uom conversion
         * @param {Array} aImportedFileData - List of Imported Data
         */
        uomCoversion: function (aUoMConversionPayload, aImportedFileData) {
            var that = this;
            if (aUoMConversionPayload.length > 0) {
                that.CMLDataSource.fnUoMConvert(aUoMConversionPayload, function (aConvValue) {
                    that.mapConvertedCmlReadings(aConvValue, aImportedFileData, function (aData) {
                        that.setImportedSelectedCml(aData);
                    });
                    // that.setImportedSelectedCml(aImportedFileData);
                }, function () {
                    // fnSuccess(aImportedFileData);
                });
            } else {
                that.setImportedSelectedCml(aImportedFileData);
            }
        },

        /**
         * Set Imported CML values to the selected CML
         * 
         * @param {Array} aImportedFileData 
         */
        setImportedSelectedCml: function (aImportedFileData) {
            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var aSelected = mCMLModel.getProperty("/data/createInspection/selectedCml");
            var aSelectedCmlValues = JSON.parse(JSON.stringify(aSelected));
            var samplePreviousReading = that.fetchPreviousCmlReadings();
            that.generateStatusAndReason(aSelectedCmlValues, aImportedFileData, samplePreviousReading);
        },

        /**
         * Function with dummy CML Reading values
         * 
         * @returns {Array} - Return the Dummy CML Reading Value
         */
        fetchPreviousCmlReadings: function () {
            //api response
            var dummyPreviousReading = [{
                "cmlTemplate": "Test 94",
                "name": "35762",
                "desc": "Bottom Head",
                "reading": "0.8",
                "uom": "mm"
            },
            {
                "cmlTemplate": "Test 54",
                "name": "239863",
                "desc": "Bottom Head N",
                "reading": "0.4",
                "uom": "mm"
            }
            ];
            return dummyPreviousReading;
        },

        /**
         * Function to generate status and reason
         * 
         * @param {Array} aSelectedCmlValues - Selected CML values
         * @param {Array} aImportedFileData - Imported CML File data
         */
        generateStatusAndReason: function (aSelectedCmlValues, aImportedFileData) {
            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var growthDetectedText = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column5.growthDetected.text");
            var numericalsRequriedText = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column5.numericalRequried.text");
            var cmlTemplateNotFoundText = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column5.cmlTemplateNotFound.text");
            var cmlNameNotFoundText = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column5.cmlNameNotFound.text");
            var cmlDescriptionNotFoundText = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column5.cmlDescriptionNotFound.text");
            var checkDateFormat = oI18n.getText("asint.cml.list.newInspection.dialog.wizard.object.table.column6.cmlDate.text");

            /**
             * Function to validate the date field
             * @param {String} dateString - Date
             * @returns 
             */
            var isValidDate = function (dateString) {
                var regexYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;
                // var regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                if (dateString.match(regexYYYYMMDD) === null) {
                    return false;
                }
                var date = Date.parse(dateString);
                return !isNaN(date);
            };

            for (var i = 0; i < aSelectedCmlValues.length; i++) {
                var oSelectedCmlValue = aSelectedCmlValues[i];
                var sKey = oSelectedCmlValue["cmlTemplate"] + oSelectedCmlValue["name"] + oSelectedCmlValue["desc"];
                var sNameDesc = oSelectedCmlValue["name"] + oSelectedCmlValue["desc"];
                var sNameTemplate = oSelectedCmlValue["name"] + oSelectedCmlValue["cmlTemplate"];
                var sDescTemplate = oSelectedCmlValue["desc"] + oSelectedCmlValue["cmlTemplate"];
                var oPreviousCmlReading;
                var iDifference;
                var todayTime = new Date().getTime();
                var aValues = aSelectedCmlValues[i].to_values;

                /**
                 * Function to decode the encrypted data
                 */
                var fnDecode = function (oValue) {
                    var parsed = "";
                    try {
                        parsed = JSON.parse(oValue);
                    } catch (error) {
                        that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE028"), error);
                    }
                    if (typeof parsed === "object") {
                        return parsed;
                    }
                    var oDecoded = "";
                    if (typeof oValue === "string") {
                        oDecoded = atob(oValue);
                    }
                    return fnDecode(oDecoded);
                };

                aValues.forEach(function (oValue) {
                    var parsedObj = fnDecode(atob(oValue.dataSourceValue));
                    if (typeof (parsedObj) == "object" && parsedObj.value) {
                        var inspDate = parsedObj.value.DATE;
                        var parsedDate = new Date(inspDate);
                        var curTime = parsedDate.getTime();
                        var curDiff = todayTime - curTime;
                        if (iDifference) {
                            if (curDiff < iDifference) {
                                oPreviousCmlReading = parsedObj.value.READING;
                            }
                        } else {
                            iDifference = curDiff;
                            oPreviousCmlReading = parsedObj.value.READING;
                        }
                    }
                });

                for (var j = 0; j < aImportedFileData.length; j++) {
                    var oImportedFileData = aImportedFileData[j];

                    if (oImportedFileData["Status"] !== "Success") {
                        if (sKey === (oImportedFileData["CML Template"] + oImportedFileData["CML Name"] + oImportedFileData["CML Description"])) {
                            oImportedFileData["Status"] = "Success";
                            oImportedFileData["Reason"] = "";

                            if (oPreviousCmlReading) {
                                oImportedFileData["recentReading"] = oPreviousCmlReading["reading"];
                                if (oImportedFileData["Reading"] > oPreviousCmlReading["reading"]) {
                                    oImportedFileData["Status"] = "Warning";
                                    oImportedFileData["Reason"] = growthDetectedText;
                                }
                            }
                            if (isNaN(oImportedFileData["Reading"]) || (oImportedFileData["Reading"].trim().length == 0) || JSON.parse(oImportedFileData["Reading"]) < 0 || oImportedFileData["Reading"] == 0) {
                                oImportedFileData["Status"] = "Failure";
                                oImportedFileData["Reason"] = numericalsRequriedText;
                            }

                            if (oImportedFileData["Reading Date"] && !isValidDate(oImportedFileData["Reading Date"])) {
                                oImportedFileData["Status"] = "Failure";
                                oImportedFileData["Reason"] = checkDateFormat;
                            }
                        } else if (isNaN(oImportedFileData["Reading"]) || (oImportedFileData["Reading"].trim().length == 0) || JSON.parse(oImportedFileData["Reading"]) < 0 || oImportedFileData["Reading"] == 0) {
                            oImportedFileData["Status"] = "Failure";
                            oImportedFileData["Reason"] = numericalsRequriedText;
                        } else if (oImportedFileData["CML Name"] + oImportedFileData["CML Description"] == sNameDesc && oSelectedCmlValue["cmlTemplate"] != oImportedFileData["CML Template"]) {
                            oImportedFileData["Status"] = "Failure";
                            oImportedFileData["Reason"] = cmlTemplateNotFoundText;
                        } else if (oImportedFileData["CML Description"] + oImportedFileData["CML Template"] == sDescTemplate && oSelectedCmlValue["name"] != oImportedFileData["CML Name"]) {
                            oImportedFileData["Status"] = "Failure";
                            oImportedFileData["Reason"] = cmlNameNotFoundText;
                        } else if (oImportedFileData["CML Name"] + oImportedFileData["CML Template"] == sNameTemplate && oSelectedCmlValue["desc"] != oImportedFileData["CML Description"]) {
                            oImportedFileData["Status"] = "Failure";
                            oImportedFileData["Reason"] = cmlDescriptionNotFoundText;
                        }
                    }
                }
            }
            mCMLModel.setProperty("/data/createInspection/importedSelectedCml", aImportedFileData);
        },

        /**
         * Function to handle the Search event for Import CML Reading table
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        handleSearchField: function (oEvent) {
            // build filter array
            var sQuery = oEvent.getParameter("query");
            var oList = sap.ui.getCore().byId(Fragment.createId("_dialogImportFile", "idFileUploaderTable"));
            if (sQuery === "") {
                oList.getBinding("items").filter([]);
            } else {
                var oFilterArr = new Filter([
                    new Filter("CML Template", FilterOperator.Contains, sQuery),
                    new Filter("CML Name", FilterOperator.Contains, sQuery),
                    new Filter("CML Description", FilterOperator.Contains, sQuery),
                    new Filter("Reading", FilterOperator.Contains, sQuery),
                    new Filter("Status", FilterOperator.Contains, sQuery),
                    new Filter("Reason", FilterOperator.Contains, sQuery),
                    new Filter("recentReading", FilterOperator.Contains, sQuery)
                ], false);
            }
            // filter binding
            var oBinding = oList.getBinding("items");
            oBinding.filter(oFilterArr);
        },

        /**
         * Function trigge the Import table row gets selected
         */
        onTableSelectionChange: function () {
            var that = this;
            var oModel = that.getView().getModel("mCMLModel");
            var enableImportbtn = oModel.getProperty("/data/createInspection/enableImportbtn");
            var oTable = sap.ui.core.Fragment.byId("_dialogImportFile", "idFileUploaderTable")
            var aSelected = oTable.getSelectedItems();
            if (aSelected.length > 0) {
                enableImportbtn = true;
            } else {
                enableImportbtn = false;
            }
            var aSelectedTemplates = [];
            aSelected.forEach(function (temp) {
                var sPath = temp.getBindingContextPath();
                aSelectedTemplates.push(oModel.getProperty(sPath));
            });
            oModel.setProperty("/data/createInspection/checkedImportSelectedCml", aSelectedTemplates);
            oModel.setProperty("/data/createInspection/enableImportbtn", enableImportbtn);
        },

        /**
         * Function to import data
         * @returns Object
         */
        onImportButtonPress: function () {
            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var aCheckedImportedFileData = mCMLModel.getProperty("/data/createInspection/checkedImportSelectedCml");
            var aUoMConversionPayload = [];
            var aFailureOnes = [];
            var sUnitOfMeasure = "IN";
            that.busyDialog = new sap.m.BusyDialog();
            that.busyDialog.open();
            aCheckedImportedFileData.forEach(function (obj, index) {
                if (!(isNaN(obj["Reading"])) && obj["Uom"] != sUnitOfMeasure) {
                    aUoMConversionPayload.push(
                        {
                            "key": index.toString(),
                            "src": obj["Uom"],
                            "tgt": sUnitOfMeasure,
                            "srcValue": obj["Reading"],
                        }
                    )
                }
                if (obj["Status"] == "Failure") {
                    aFailureOnes.push(obj);
                }
            })
            if (aFailureOnes.length > 0) {
                that.busyDialog.close();
                that.fnMessageShow("E", "Failed to import as few failure entries are selected");
                return;
            }
            if (aUoMConversionPayload.length > 0) {
                that.CMLDataSource.fnUoMConvert(aUoMConversionPayload, function (aConvValue) {
                    that.mapConvertedCmlReadings(aConvValue, aCheckedImportedFileData, function (aData) {
                        that.mappingSelectedCmlValues(aData);
                    })
                }, function () {
                    // fnSuccess(aImportedFileData);
                });
            } else {
                that.mappingSelectedCmlValues(aCheckedImportedFileData);
            }
            that.onValidateCreateInspectionWiz("step4", "Skip");
            that.busyDialog.close();
            that.onFileUploadClose();
        },

        /**
         * 
         * @param {Array} aConvValue 
         * @param {Array} aCmlData 
         * @param {Function} fnCallBack - 
         */
        mapConvertedCmlReadings: function (aConvValue, aCmlData, fnCallBack) {
            for (var i = 0; i < aConvValue.length; i++) {
                if (aCmlData[aConvValue[i].key]) {
                    aCmlData[aConvValue[i].key].Reading = aConvValue[i].tgtValue.toFixed(2);
                    aCmlData[aConvValue[i].key].Uom = aConvValue[i].tgt;
                }
            }
            if (fnCallBack) {
                fnCallBack(aCmlData);
            }
        },

        /**
         * Mapping the selected CML from Importer list
         * 
         * @param {Array} acheckedImportedFileData - Selected CML
         */
        mappingSelectedCmlValues: function (acheckedImportedFileData) {
            var that = this;
            var mappingObject = {};
            var aUpdatedSelectedCml = [];
            var mCMLModel = that.getView().getModel("mCMLModel");
            var aSelected = mCMLModel.getProperty("/data/createInspection/selectedCml");
            var aSelectedCmlValues = JSON.parse(JSON.stringify(aSelected));
            //changing keys as per selectedCml and padding the name with zeros
            acheckedImportedFileData.map(function (obj) {
                aUpdatedSelectedCml.push({
                    "cmlTemplate": obj["CML Template"],
                    "name": obj["CML Name"],
                    "desc": obj["CML Description"],
                    "reading": parseFloat(obj["Reading"]).toFixed(2).toString(),
                    "readingDate": obj["Reading Date"]
                });
            });

            aUpdatedSelectedCml.forEach(function (oUpdatedSelectedCml) {
                // oUpdatedSelectedCml["status"] = "Failure";
                const key = oUpdatedSelectedCml["cmlTemplate"] + oUpdatedSelectedCml["name"] + oUpdatedSelectedCml["desc"];
                var oTemp = {
                    "reading": oUpdatedSelectedCml["reading"],
                    "readingDate": oUpdatedSelectedCml["readingDate"]
                };
                // mappingObject[key] = oUpdatedSelectedCml["reading"];
                mappingObject[key] = oTemp;
            });

            aSelectedCmlValues.forEach(function (oSelectedCml) {
                const sKey = oSelectedCml["cmlTemplate"] + oSelectedCml["name"] + oSelectedCml["desc"];
                if (mappingObject[sKey]) {
                    var oMapObj = mappingObject[sKey];
                    oSelectedCml["reading"] = oMapObj.reading;
                    if (oMapObj.readingDate) {
                        oSelectedCml["readingDate"] = "";
                        oSelectedCml["readingDate"] = oMapObj.readingDate;
                    }
                }
            });
            mCMLModel.setProperty("/data/createInspection/selectedCml", aSelectedCmlValues);
        },

        /**
         * Close dialog for file upload
         */
        onFileUploadClose: function () {
            var that = this;
            that.getView().removeDependent(that._oDailogImportFile);
            if (that.oFileUploader) {
                that.oFileUploader.clear();
            }
            that._oDailogImportFile.close();
            var mCMLModel = that.getView().getModel("mCMLModel");
            mCMLModel.setProperty("/data/createInspection/importedSelectedCml", []);
            mCMLModel.setProperty("/data/createInspection/checkedImportedSelectedCml", []);
        },

        /**
         * Flexible column layout to split screen for Analytics display
         * 
         * @param {Object} oEvent - The event object that triggered this function
         * @param {String} sPageId - Page ID
         */
        onToggleBeginPage: function (oEvent, sPageId) {

            var that = this;
            var oNavContainer = this.getView().byId("idNavContFlexiColBeginPage");
            var oFlexiColLayout = this.getView().byId("idFlexiColLayout");
            var sActivePageId = this.sBeginPageId;
            var oPage = this.getView().byId(sPageId);

            if (sPageId === "idObjectHierarchyPage") {
                that.getView().byId("idNetworkGraph").setVisible(true);
            } else {
                this.getView().byId("idNetworkGraph").setVisible(false);
            }

            if (sActivePageId === sPageId) {
                oFlexiColLayout.setLayout("MidColumnFullScreen");
                this.sBeginPageId = "";
                this.getView().byId("idNetworkGraph").setVisible(false);
                this.getView().byId("idNetworkGraph").setHeight("90%");
            } else {
                sActivePageId = sPageId;
                oPage = this.getView().byId(sActivePageId);
                if (oPage) {
                    oNavContainer.to(oPage);
                    if (sap.ui.Device.system.desktop) {
                        oFlexiColLayout.setLayout(sPageId === "idObjectHierarchyPage" ? "TwoColumnsMidExpanded" : "TwoColumnsBeginExpanded");
                    } else {
                        oFlexiColLayout.setLayout("OneColumn");
                    }
                    this.sBeginPageId = sActivePageId;
                }
            }

        },

        /**
         * Expand the Analytics view based on user selection
         * 
         * @param {Boolean} bExpand - True or False if user selected Expand
         */
        onAnalyticsPanelToggleExpand: function (bExpand) {

            var that = this;
            var aPanelId = ["idAnalyticsPanel1","idAnalyticsPanel2"];

            aPanelId.forEach(function (sPanelId) {
                that.getView().byId(sPanelId).setExpanded(bExpand);
            });

        },

        /**
         * Analytics - Asset Life Spread - Halflife data dropdown change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        oHalfLifeChartSelectionChange: function (oEvent) {
            var oEQUIultiInputFilterItem = this.getView().byId("idEQUINameMultiInputFilterItem");
            var oEQUIMultiInputFilter = this.getView().byId("idEQUINameMultiInputFilter");
            var aVizSelection = oEvent.getSource().vizSelection();
            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");
            var oObjectTypeSelectorVal = this.getView().byId("idAnalyticsObjectSelector").getSelectedKey();
            var oFLNameMultiInputFilterItem = this.getView().byId("idFLNameMultiInputFilterItem");
            var oFLNameMultiInputFilter = this.getView().byId("idFLNameMultiInputFilter");

            oEQUIultiInputFilterItem.setVisibleInFilterBar(false);
            // oEQUIMultiInputFilter.removeAllTokens();
            oFLNameMultiInputFilterItem.setVisibleInFilterBar(false);
            // oFLNameMultiInputFilter.removeAllTokens();

            if (oObjectTypeSelectorVal === "EQUI" && oEQUIMultiInputFilter) {
                oEQUIultiInputFilterItem.setVisibleInFilterBar(true);
                if (oEQUIMultiInputFilter) {
                    oEQUIMultiInputFilter.removeAllTokens();
                }
                if (oEQUIMultiInputFilter && aVizSelection.length > 0) {
                    oEQUIMultiInputFilter.addToken(new sap.m.Token({
                        key: aVizSelection[0].data["Object Name"],
                        text: aVizSelection[0].data["Object Name"]
                    }));
                }
            } else {
                oFLNameMultiInputFilterItem.setVisibleInFilterBar(true);
                if (oFLNameMultiInputFilter) {
                    oFLNameMultiInputFilter.removeAllTokens();
                }
                if (oFLNameMultiInputFilter && aVizSelection.length > 0) {
                    oFLNameMultiInputFilter.addToken(new sap.m.Token({
                        key: aVizSelection[0].data["Object Name"],
                        text: aVizSelection[0].data["Object Name"]
                    }));
                }
            }


            oFilterBar.fireSearch();

        },

        /**
         * Function will trigger the user select the Object
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onEquipmentSelectionChange: function (oEvent) {
            var oModel = this.getView().getModel("mCMLModel");
            var source = oEvent.getSource();
            var path = source.getBindingContext("mCMLModel").getPath();
            var oSelectedNode = oModel.getProperty(path);

            var oEQUINameMultiInputFilterItem = this.getView().byId("idEQUINameMultiInputFilterItem");
            var oEQUINameMultiInputFilter = this.getView().byId("idEQUINameMultiInputFilter");
            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");

            var oFLNameMultiInputFilterItem = this.getView().byId("idFLNameMultiInputFilterItem");
            var oFLNameMultiInputFilter = this.getView().byId("idFLNameMultiInputFilter");
            if (oSelectedNode.type === "EQUI") {
                oEQUINameMultiInputFilterItem.setVisibleInFilterBar(true);
                oEQUINameMultiInputFilter.removeAllTokens();
                oEQUINameMultiInputFilter.addToken(new sap.m.Token({
                    key: oSelectedNode.name,
                    text: oSelectedNode.name
                }));
            } else {
                oFLNameMultiInputFilterItem.setVisibleInFilterBar(true);
                oFLNameMultiInputFilter.removeAllTokens();
                oFLNameMultiInputFilter.addToken(new sap.m.Token({
                    key: oSelectedNode.name,
                    text: oSelectedNode.name
                }));
            }
            oFilterBar.fireSearch();

        },

        /**
         * Function trigger the Search
         */
        onStatusChange: function () {
            var oStatusFilterItem = this.getView().byId("idStatusFilterItem");
            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");
            oStatusFilterItem.setVisibleInFilterBar(true);
            oFilterBar.fireSearch();
        },

        /**
         * Function will trigger once the Hierarchy view is ready
         */
        onHierarchyGraphReady: function () {
            this.getView().byId("idNetworkGraph").setVisible(true);
            this.getView().byId("idNetworkGraph").setHeight("100%");
        },

        /**
         * Function will assign the header once the table data is rendered
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onTableUpdateFinished: function (oEvent) {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            mCMLModel.setProperty("/data/listPage/equipmentLocationListCount", oI18n.getText("asint.cml.list.table.title.text", [oEvent.getParameter("total")]));

        },

        /**
         * Fetch Techinical Object based on Object Type
         * 
         * @param {String} sObjectType - Selected Object Type
         * @param {String} fnCallback - Callback function
         */
        fnHandleTechnicalObjectValueHelp: function (sObjectType, fnCallback) {

            /**
             * Reapose of User selected Data
             * 
             * @param {Object} oReturn 
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    var oSelectedTechnicalObjectData = {
                        "id": oReturn.selected[0].ID,
                        "objectId": oReturn.selected[0].ID,
                        // "objectType": sObjectType,
                        "objectName": oReturn.selected[0].name,
                        "objectDesc": oReturn.selected[0].to_description,
                        "name": oReturn.selected[0].name,
                        "desc": oReturn.selected[0].to_description,
                        // "_objectType": oReturn.selected[0]._objectType
                    }
                    fnCallback(oSelectedTechnicalObjectData);
                }
            };

            if (sObjectType === "EQUI") {
                this.technicalObjectValueHelp.handleEquipmentValueHelp(fnComplete);
            } else {
                this.technicalObjectValueHelp.handleFunctionalLocationValueHelp(fnComplete);
            }

        },

        /**
         * Function to handle the Equipment ValuHelp for Create Inspection
         */
        fnHandleEquipmentValueHelpForInspection: function () {

            var that = this;
            var mCMLModel = this.getView().getModel("mCMLModel");

            this.fnHandleTechnicalObjectValueHelp("EQUI", function (oSelectedTechnicalObjectData) {
                mCMLModel.setProperty("/data/createInspection/selectedObject", oSelectedTechnicalObjectData);
                that.getObjectTemplateWithEquipment(oSelectedTechnicalObjectData.objectId, "EQUI", "INSP");
                mCMLModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
                mCMLModel.setProperty("/data/createInspection/selectedObjectTemplateName", "");
                that.fnFetchObjectAndCMLsList(oSelectedTechnicalObjectData.objectId, "EQUI", "");
                that.onValidateCreateInspectionWiz("step2");
            });

        },

        /**
         * Function to handle the Functional Location ValuHelp for Create Inspection
         */
        fnHandleFunctionalLocationValueHelpForInspection: function () {

            var that = this;
            var mCMLModel = this.getView().getModel("mCMLModel");

            this.fnHandleTechnicalObjectValueHelp("FLOC", function (oSelectedTechnicalObjectData) {
                mCMLModel.setProperty("/data/createInspection/selectedObject", oSelectedTechnicalObjectData);
                that.getObjectTemplateWithEquipment(oSelectedTechnicalObjectData.objectId, "FLOC", "INSP");
                mCMLModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
                mCMLModel.setProperty("/data/createInspection/selectedObjectTemplateName", "");
                that.fnFetchObjectAndCMLsList(oSelectedTechnicalObjectData.objectId, "FLOC", "");
                that.onValidateCreateInspectionWiz("step2");
            });

        },

        /**
         * Function to handle the Equipment ValuHelp for Create CML
         */
        fnHandleEquipmentValueHelpForCML: function () {

            var that = this;
            var oCommonModel = this.getView().getModel("mCMLModel");

            this.fnHandleTechnicalObjectValueHelp("EQUI", function (oSelectedTechnicalObjectData) {
                oCommonModel.setProperty("/data/listPage/create/cml/selectedEqpFloc", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/listPage/create/cml/oSelectedObject", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectName", oSelectedTechnicalObjectData.name);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectDescp", oSelectedTechnicalObjectData.desc);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectType", "EQUI");
                oCommonModel.setProperty("/data/listPage/create/cml/objectType", "EQUI");
                oCommonModel.setProperty("/data/selectedObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/metaData/listPage/create/cml/valueState/EqpFloc", "None");
                oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/cmlTemplate", true);
                oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/objectTemplate", true);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedObjectData", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
                that.getObjectTemplateWithEquipment(oSelectedTechnicalObjectData.objectId, "EQUI");
                that.fnFetchObjectAndCMLsList(oSelectedTechnicalObjectData.objectId, "EQUI", "CMLCreate");
            });

        },

        /**
         * Function to handle the Functional Location ValuHelp for Create CML
         */
        fnHandleFunctionalLocationValueHelpForCML: function () {

            var that = this;
            var oCommonModel = this.getView().getModel("mCMLModel");

            this.fnHandleTechnicalObjectValueHelp("FLOC", function (oSelectedTechnicalObjectData) {
                oCommonModel.setProperty("/data/listPage/create/cml/selectedEqpFloc", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/listPage/create/cml/oSelectedObject", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectName", oSelectedTechnicalObjectData.name);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectDescp", oSelectedTechnicalObjectData.desc);
                oCommonModel.setProperty("/data/listPage/create/cml/sObjectType", "FLOC");
                oCommonModel.setProperty("/data/listPage/create/cml/objectType", "FLOC");
                oCommonModel.setProperty("/data/selectedObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/metaData/listPage/create/cml/valueState/EqpFloc", "None");
                oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/cmlTemplate", true);
                oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/objectTemplate", true);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedObjectData", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
                that.getObjectTemplateWithEquipment(oSelectedTechnicalObjectData.objectId, "FLOC");
                that.fnFetchObjectAndCMLsList(oSelectedTechnicalObjectData.objectId, "FLOC", "CMLCreate");
            });

        },

        /**
         * Function to handle the Object Type change for Create Inspection
         */
        onCreateCMLObjectTypeChange: function () {

            var oCommonModel = this.getView().getModel("mCMLModel");

            oCommonModel.setProperty("/data/listPage/create/cml/selectedEqpFloc", "");
            oCommonModel.setProperty("/data/listPage/create/cml/oSelectedObject", "");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectId", "");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectName", "");
            oCommonModel.setProperty("/data/listPage/create/cml/sObjectDescp", "");
            oCommonModel.setProperty("/data/selectedObjectId", "");
            oCommonModel.setProperty("/data/listPage/create/cml/selectedLocation", "");
            oCommonModel.setProperty("/metaData/listPage/create/cml/valueState/EqpFloc", "None");
            oCommonModel.setProperty("/metaData/listPage/create/cml/enabled/cmlTemplate", false);
            oCommonModel.setProperty("/data/listPage/create/cml/selectedObjectData", "");

        },

        /**
         * 
         * @param {String} sObjectID - Selected Object ID
         * @param {String} sObjType - Selected Object Type
         * @param {String} sText - Dialog Type (Inspection or CML)
         */
        getObjectTemplateWithEquipment: function (sObjectID, sObjType, sText) {

            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var aObjectTemplateList = [];

            that.CMLDataSource.getObjectTemplatesNew(sObjectID, sObjType, function (aResponse) {

                aObjectTemplateList = aResponse && aResponse.length ? aResponse : [];
                // if (aTemplates.length > 0) {
                //     aTemplates.forEach(function (oTemp) {
                //         if (oTemp.cmlCollection) {
                //             if (oTemp.cmlCollection.status === "PBD") {
                //                 aObjectTemplateList.push(oTemp.cmlCollection);
                //             }
                //         }
                //     })
                // }
                
                if (mCMLModel.getProperty("/metaData/view") === "CML") {
                    aObjectTemplateList.unshift({});
                    mCMLModel.setProperty("/data/listPage/create/cml/objectTemplateList", aObjectTemplateList);
                    that.fnFetchCMLsByObjectId(sObjectID, sObjType);
                } else if (mCMLModel.getProperty("/metaData/view") === "INSP") {
                    mCMLModel.setProperty("/data/createInspection/objectTemplateList", aObjectTemplateList);
                    mCMLModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
                    mCMLModel.setProperty("/data/listPage/create/cml/selectedInspectionTemplate", "");
                    that.fnFetchCMLsByObjectId(sObjectID, sObjType);
                }
            }, function (oError) {
                that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE017"), oError);
            });

            if (sText == "INSP") {
                var oUniqueList = {};
                var aUniqueList = [];
                if (sObjType == "EQUI") {
                    that.CMLDataSource.getInspectionTemplatesByEquipment(sObjectID, function (oData) {
                        var aData = oData.to_object_template;
                        var inspectionArr = [];
                        if (aData && aData.length > 0) {
                            for (let currentObjectTemplate of aData) {
                                if (currentObjectTemplate.objectTemplate && currentObjectTemplate.objectTemplate.to_assessment_templates) {
                                    for (let assessmentObj of currentObjectTemplate.objectTemplate.to_assessment_templates) {
                                        if (assessmentObj.assessmentTemplate) {
                                            inspectionArr.push(assessmentObj.assessmentTemplate);
                                        }
                                    }
                                }
                            }
                        }
                        oUniqueList = {};
                        aUniqueList = [];
                        inspectionArr.forEach(function(oInsp){
                            if(!oUniqueList[oInsp.ID]) {
                                oUniqueList[oInsp.ID] = oInsp;
                                aUniqueList.push(oInsp);
                            }
                        });
                        mCMLModel.setProperty("/data/createInspection/inspectionTemplateList", aUniqueList);
                    }, function () {
                        mCMLModel.setProperty("/data/createInspection/inspectionTemplateList", []);
                    });
                } else {
                    that.CMLDataSource.getInspectionTemplatesByFunctionalLocation(sObjectID, function (oData) {
                        var aData = oData.to_object_template;
                        var inspectionArr = [];
                        if (aData && aData.length > 0) {
                            for (let currentObjectTemplate of aData) {
                                if (currentObjectTemplate.objectTemplate && currentObjectTemplate.objectTemplate.to_assessment_templates) {
                                    for (let assessmentObj of currentObjectTemplate.objectTemplate.to_assessment_templates) {
                                        if (assessmentObj.assessmentTemplate) {
                                            inspectionArr.push(assessmentObj.assessmentTemplate);
                                        }
                                    }
                                }
                            }
                        }
                        oUniqueList = {};
                        aUniqueList = [];
                        inspectionArr.forEach(function(oInsp){
                            if(!oUniqueList[oInsp.ID]) {
                                oUniqueList[oInsp.ID] = oInsp;
                                aUniqueList.push(oInsp);
                            }
                        });
                        mCMLModel.setProperty("/data/createInspection/inspectionTemplateList", aUniqueList);
                    }, function () {
                        mCMLModel.setProperty("/data/createInspection/inspectionTemplateList", []);
                    });
                }
            }

        },

        /**
         * Get CML Template by Object ID
         * @param {Object} oEvent - The event object that triggered this function
         */
        onObjectTemplateChange: function (oEvent) {

            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var sObjectTemplateID = mCMLModel.getProperty("/data/listPage/create/cml/selectedObjectTemplate");
            var aCMLTemplateList = [];
            var oCreateCMLWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");
            var oCreateINSPWiz = Fragment.byId("idCreateInspectionFragment", "idCreateInspectionWizard");
            var sPath = oEvent.getSource().getSelectedItem().getBindingContext("mCMLModel").sPath;
            var oObjectTemplate = mCMLModel.getProperty(sPath);
            var sTempName = "";
            if (oObjectTemplate && oObjectTemplate.to_description && oObjectTemplate.to_description.length > 0) {
                sTempName = oObjectTemplate.to_description[0].shortDescription;
            }

            if (sObjectTemplateID) {
                that.CMLDataSource.getCMLTemplateByObjetTemplatID(sObjectTemplateID, function (oCMLTemplateList) {
                    var aList = oCMLTemplateList.to_cml_template;
                    // oCMLTemplateList.value.forEach(function(oItem){
                    //     if(oItem.objectTemplate_ID === sObjectTemplateID){
                    //         aCMLTemplateList.push(oItem);
                    //     }
                    // });
                    if (aList && aList.length > 0) {
                        aList.forEach(function (oCML) {
                            if (oCML.cmlLocationTemplate && !oCML.cmlLocationTemplate.deleted) {
                                aCMLTemplateList.push(oCML.cmlLocationTemplate);
                            }
                        });
                    }
                    aCMLTemplateList.unshift({});
                    if (mCMLModel.getProperty("/metaData/view") === "CML") {
                        mCMLModel.setProperty("/data/listPage/create/cml/selectedObjectTemplateName", sTempName);
                        mCMLModel.setProperty("/data/listPage/locationList/locationTemplateList", aCMLTemplateList);
                        that.onValidateCreateCMLWiz("step" + oCreateCMLWiz.getProgress());
                    } else if (mCMLModel.getProperty("/metaData/view") === "INSP") {
                        mCMLModel.setProperty("/data/createInspection/selectedObjectTemplateName", sTempName);
                        mCMLModel.setProperty("/data/createInspection/cmlTemplate", aCMLTemplateList);
                        that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
                        that.getInspCMLs();
                    }
                }, function (oError) {
                    that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE017"), oError);
                });
            } else {
                mCMLModel.setProperty("/metaData/listPage/create/cml/valueState/objectTemplate", "Error");
                mCMLModel.setProperty("/metaData/listPage/create/cml/valueStateText/objectTemplate", "Please select Object Template");
                if (mCMLModel.getProperty("/metaData/view") === "CML") {
                    that.onValidateCreateCMLWiz("step" + oCreateCMLWiz.getProgress());
                } else if (mCMLModel.getProperty("/metaData/view") === "INSP") {
                    that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
                }
            }
        },

        /**
         * Handle Create Inspection Object Template Change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onCreateInspectionObjectTemplateChange: function (oEvent) {

            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var aSelectedKeys = mCMLModel.getProperty("/data/listPage/create/cml/selectedObjectTemplate");
            var aCMLTemplateList = [];
            var oCreateCMLWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");
            var oCreateINSPWiz = Fragment.byId("idCreateInspectionFragment", "idCreateInspectionWizard");

            var aSelectedItems = oEvent.getParameter("selectedItems");
            var oObjectTemplate = aSelectedItems[0].getBindingContext("mCMLModel").getObject();
            var sTempName = "";
            if (oObjectTemplate && oObjectTemplate.to_description && oObjectTemplate.to_description.length > 0) {
                sTempName = oObjectTemplate.to_description[0].shortDescription;
            }

            var curIndex = 0;
            /**
             * Get CML Template by Object Id
             * @param {Integer} iIndex 
             */
            var fnLoopSelectedIds = function (iIndex) {
                if (iIndex < aSelectedKeys.length) {
                    var sObjectTemplateID = aSelectedKeys[iIndex];
                    if (sObjectTemplateID) {
                        that.CMLDataSource.getCMLTemplateByObjetTemplatID(sObjectTemplateID, function (oCMLTemplateList) {
                            var aList = oCMLTemplateList.to_cml_template;
                            if (aList && aList.length > 0) {
                                aList.forEach(function (oCML) {
                                    if (oCML.cmlLocationTemplate) {
                                        aCMLTemplateList.push(oCML.cmlLocationTemplate);
                                    }
                                });
                            }
                            curIndex = curIndex + 1;
                            if (curIndex == aSelectedKeys.length) {
                                fnSucessCallBack();
                            } else {
                                fnLoopSelectedIds(curIndex);
                            }
                        }, function () {
                            curIndex = curIndex + 1;
                            if (curIndex == aSelectedKeys.length) {
                                fnSucessCallBack();
                            } else {
                                fnLoopSelectedIds(curIndex);
                            }
                        });
                    } else {
                        curIndex = curIndex + 1;
                        if (curIndex == aSelectedKeys.length) {
                            fnSucessCallBack();
                        } else {
                            fnLoopSelectedIds(curIndex);
                        }
                    }
                }
            };

            /**
             * Validate the Data and get the CML for Inspection
             */
            var fnSucessCallBack = function () {
                mCMLModel.setProperty("/data/createInspection/selectedObjectTemplateName", sTempName);
                mCMLModel.setProperty("/data/createInspection/cmlTemplate", aCMLTemplateList);
                that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
                that.getInspCMLs();
            };

            if (aSelectedKeys.length > 0) {
                fnLoopSelectedIds(0);
            } else {
                mCMLModel.setProperty("/metaData/listPage/create/cml/valueState/objectTemplate", "Error");
                mCMLModel.setProperty("/metaData/listPage/create/cml/valueStateText/objectTemplate", "Please select Object Template");
                if (mCMLModel.getProperty("/metaData/view") === "CML") {
                    that.onValidateCreateCMLWiz("step" + oCreateCMLWiz.getProgress());
                } else if (mCMLModel.getProperty("/metaData/view") === "INSP") {
                    that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
                }
            }
        },

        /**
         * Function handle the Inspection Template change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onInspTemplateChange: function (oEvent) {
            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var sInspTemplateID = mCMLModel.getProperty("/data/listPage/create/cml/selectedInspectionTemplate");
            var oCreateINSPWiz = Fragment.byId("idCreateInspectionFragment", "idCreateInspectionWizard");
            var sPath = oEvent.getSource().getSelectedItem().getBindingContext("mCMLModel").sPath;
            var oInspTemplate = mCMLModel.getProperty(sPath);
            var sTempName = "";
            if (oInspTemplate && oInspTemplate.to_description) {
                sTempName = oInspTemplate.to_description.shortDescription;
            }
            if (sInspTemplateID) {
                mCMLModel.setProperty("/data/createInspection/selectedInspTemplateName", sTempName);
                mCMLModel.setProperty("/data/createInspection/selectedInspTemplateVersion", oInspTemplate.version);
                that.CMLDataSource.getInspectionHeaderMapping(sInspTemplateID, function (oData) {
                    mCMLModel.setProperty("/data/createInspection/inspTemplateHeaderMap", oData);
                    that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
                }, function (oError) {
                    mCMLModel.setProperty("/data/createInspection/inspTemplateHeaderMap", "");
                    mCMLModel.setProperty("/data/createInspection/selectedInspTemplateName", "");
                    mCMLModel.setProperty("/data/createInspection/selectedInspTemplateVersion", "");
                    that.fnMessageShow("E", "Failed to fetch selected inspection template details", oError);
                    that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
                });
            } else {
                mCMLModel.setProperty("/metaData/listPage/create/cml/valueState/inspectionTemplate", "Error");
                mCMLModel.setProperty("/metaData/listPage/create/cml/valueStateText/inspectionTemplate", "Please select Inspection Template");
                that.onValidateCreateInspectionWiz("step" + oCreateINSPWiz.getProgress());
            }
        },

        /**
         * Function to get CMLs for Create Inspection
         */
        getInspCMLs: function () {
            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var mInspectionList = this.getView().getModel("mCMLList");
            var sCMLTemplateList = mCMLModel.getProperty("/data/createInspection/cmlTemplate");
            var aCMLTemplateList = JSON.parse(JSON.stringify(sCMLTemplateList));
            var oCMLValues = mInspectionList.getProperty("/data/CMLsList");
            if (aCMLTemplateList) {
                aCMLTemplateList.forEach(function (cmlTemplate, i) {
                    if (Object.keys(cmlTemplate).length > 0) {
                        var matchingObjs = oCMLValues.filter(function (valuObj) {
                            return valuObj.cmlTemplateId === cmlTemplate.id;
                        });
                        cmlTemplate.nodes = [];
                        if (matchingObjs.length > 0) {
                            cmlTemplate.nodes = matchingObjs;
                            sCMLTemplateList[i].nodes = JSON.parse(JSON.stringify(matchingObjs));
                        }
                        cmlTemplate.nodes.forEach(function (node) {
                            node.type = "CML";
                            if (node["to_description"].length > 0) {
                                node.desc = node["to_description"][0].shortDescription;
                                node["to_description"] = [];
                                // node.to_values = [];
                            }
                        });
                        cmlTemplate.nodes.sort(function (a, b) { return a.name - b.name });
                        cmlTemplate.nodes.sort(function (a, b) {
                            var title1 = a.name ? a.name.toUpperCase() : "";
                            var title2 = b.name ? b.name.toUpperCase() : "";
                            if (title1 < title2) {
                                return -1;
                            } else if (title1 > title2) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                });
                aCMLTemplateList.sort(function (a, b) {
                    var title1 = a.name ? a.name.toUpperCase() : "";
                    var title2 = b.name ? b.name.toUpperCase() : "";
                    if (title1 < title2) {
                        return -1;
                    } else if (title1 > title2) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                var aFinalNodes = [{ type: "Parent", nodes: aCMLTemplateList }];
                mCMLModel.setProperty("/data/createInspection/alteredcmlTemplate", aFinalNodes);
                mCMLModel.setProperty("/data/createInspection/cmlTemplate", sCMLTemplateList);
                var oTable = sap.ui.core.Fragment.byId("idCreateInspectionFragment", "idStep3TreeTable");
                if (oTable) {
                    oTable.expandToLevel(1);
                }
                // that.CMLDataSource.getCMLs(function (oCMLValues) {
                //     aCMLTemplateList.forEach(function (cmlTemplate, i) {
                //         if(Object.keys(cmlTemplate).length > 0){
                //             var matchingObjs = oCMLValues.value.filter(function (valuObj) {
                //                 return valuObj.cmlTemplateId === cmlTemplate.id;
                //             });
                //             cmlTemplate.nodes = [];
                //             if (matchingObjs.length > 0) {
                //                 cmlTemplate.nodes = matchingObjs;
                //                 sCMLTemplateList[i].nodes = JSON.parse(JSON.stringify(matchingObjs));
                //             };
                //             cmlTemplate.nodes.forEach(function (node) {
                //                 node.type = "CML";
                //                 if(node.to_description.length > 0) {
                //                     node.desc = node.to_description[0].shortDescription;
                //                     node.to_description = [];
                //                     // node.to_values = [];
                //                 }
                //             });
                //             cmlTemplate.nodes.sort(function(a, b){return a.name - b.name});
                //             cmlTemplate.nodes.sort(function (a, b) {
                //                 var title1 = a.name ? a.name.toUpperCase() : "";
                //                 var title2 = b.name ? b.name.toUpperCase() : "";
                //                 if (title1 < title2) {
                //                     return -1; 
                //                 } else if (title1 > title2) {
                //                     return 1; 
                //                 } else {
                //                     return 0; 
                //                 }
                //             });
                //         }
                //     });
                //     aCMLTemplateList.sort(function (a, b) {
                //         var title1 = a.name ? a.name.toUpperCase() : "";
                //         var title2 = b.name ? b.name.toUpperCase() : "";
                //         if (title1 < title2) {
                //             return -1; 
                //         } else if (title1 > title2) {
                //             return 1; 
                //         } else {
                //             return 0; 
                //         }
                //     });
                //     var aFinalNodes = [{type:"Parent", nodes : aCMLTemplateList}];
                //     mCMLModel.setProperty("/data/createInspection/alteredcmlTemplate", aFinalNodes);
                //     mCMLModel.setProperty("/data/createInspection/cmlTemplate", sCMLTemplateList);
                //     var oTable = sap.ui.core.Fragment.byId("idCreateInspectionFragment", "idStep3TreeTable");
                //     if(oTable){
                //         oTable.expandToLevel(1);
                //     }
                // }, function (oError) {

                // });
            }
        },

        /**
         * Function to get the CML List by Object
         */
        getCMLsListbyComponent: function () {

            var that = this;
            var mInspectionList = this.getView().getModel("mCMLList");

            that.CMLDataSource.getCMLs(function (cmlList) {
                mInspectionList.setProperty("/data/CMLsList", cmlList.value);
            }, function () {

            });

        },

        /**
         * Function to Export the Asset overview table list
         */
        onExcelExport: function () {

            this.fnExportTableDatatoExcel("idCMLMTable_");

        },

        /**
         * Create a column for Excel export
         * 
         * @param {String} sUom - Selected UOM
         * @returns {Array} - Array of column
         */
        createColumnConfig: function (sUom) {
            var aCols = [];

            aCols.push({
                label: "Equipment Name",
                property: "equipmentName",
                type: EdmType.String
            });

            aCols.push({
                label: "Equipment Description",
                property: "equipmentDesc",
                type: EdmType.String
            });

            aCols.push({
                label: "Functional Location Name",
                property: "functionalLocationName",
                type: EdmType.String
            });

            aCols.push({
                label: "Functional Location Description",
                property: "functionalLocationDesc",
                type: EdmType.String
            });

            aCols.push({
                label: "Remaining Life (years)",
                property: "remainingLife",
                type: EdmType.String
            });

            aCols.push({
                label: "Half Life (years)",
                property: "halfLife",
                type: EdmType.String
            });

            aCols.push({
                label: "Tmin (" + sUom + ")",
                property: "tMin",
                type: EdmType.Number
            });

            aCols.push({
                label: "Retirement Date",
                property: "retirementDateTime",
                type: EdmType.Date
            });

            aCols.push({
                label: "Created On",
                property: "createdOnTime",
                type: EdmType.Date
            });

            aCols.push({
                label: "Modified On",
                property: "changedOnTime",
                type: EdmType.Date
            });
            return aCols;
        },

        /**
         * Format Today date
         * 
         * @returns {String} - Formatted Date
         */
        getTodayFormatDate: function () {

            var currentDate = new Date();
            var year = currentDate.getFullYear();
            var month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
            var day = currentDate.getDate().toString().padStart(2, "0");
            var formattedDate = `${year}-${month}-${day}`;

            return formattedDate;

        },

        /**
         * Create Inspection - Add Readings with Template & UOM
         */
        onDownloadCML: function () {

            var selectedUOM = this.getSelectedUoMSystem();
            var uomKey = (selectedUOM === "metric") ? "MM" : "IN";
            var oTable = sap.ui.core.Fragment.byId("idCreateInspectionFragment", "idCMLReadingTable");
            var oDate = new Date();
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "MMM_dd_yyyy_HH_mm_ss"
            });
            var sDate = oDateFormat.format(oDate);
            var sFileName = "CML_Readings_" + sDate;
            var aCols = [];
            aCols.push({
                header: "CML Template",
                key: "cmlTemplate"
            });
            aCols.push({
                header: "CML Name",
                key: "name"
            });
            aCols.push({
                header: "CML Description",
                key: "desc"
            });
            aCols.push({
                header: "Reading",
                key: ""
            });
            aCols.push({
                header: "Reading Date",
                key: "readingDate",
                type: "Date"
            })
            aCols.push({
                header: "Uom",
                key: "uomKey"
            });
            var aItems = oTable.getItems();
            var aExportData = [];
            aItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext("mCMLModel");
                if (oContext) {
                    var item = oContext.getObject();
                    item.reading = "Please enter value here";
                    item.uomKey = uomKey;
                    aExportData.push(item);
                }
            });
            // oSelectedCml.forEach(function(item) {
            //     var cmlData = {};
            //     cmlData["CML Template"] = item.cmlTemplate;
            //     cmlData["CML Name"] = item.name;
            //     cmlData["CML Description"] = item.desc ? item.desc : "";
            //     cmlData["Reading"] = "Please enter value here",
            //     cmlData["Uom"] = uomKey,
            //     aData.push(cmlData);
            // });
            // var oSettings = {
            //     workbook: {
            //         columns: aCols
            //     },
            //     dataSource: aExportData,
            //     fileName: sFileName,
            // };

            // var oSheet = new Spreadsheet(oSettings);
            // oSheet.build()
            //     .then(function () {
            //         MessageToast.show('Spreadsheet export has finished');
            //     })
            //     .finally(oSheet.destroy);

            var oWorkbook = new window.ExcelJS.Workbook();
            var oWorkSheet = oWorkbook.addWorksheet("SAP UI5 Export");
            oWorkSheet.columns = aCols;
            oWorkSheet.getColumn("readingDate").numFmt = "yyyy-MM-dd"
            oWorkSheet.addRows(aExportData);

            oWorkbook.xlsx.writeBuffer().then(function (buffer) {
                var blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                var url = URL.createObjectURL(blob);
                var link = document.createElement("a");

                link.href = url;
                link.download = sFileName + ".xlsx";
                link.click();
            });

        },

        /**
         * Fucntion to handle the change in the filter bar.
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onDataReceived: function (oEvent) {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oParameters = oEvent.getSource().getQueryOptionsFromParameters();

            if (oParameters["$count"] && oEvent.getSource().getCount && oEvent.getSource().getCount()) {
                var iCount = oEvent.getSource().getCount();
                var sHeader = oI18n.getText("asint.cml.list.table.title.text", [iCount]);

                mCMLModel.setProperty("/data/listPage/table/header", sHeader);
            } else {
                mCMLModel.setProperty("/data/listPage/table/isBusy", true);
                this.fnFetchInlineCount(this, "idCMLMTable_", function (sCount) {
                    var sHeader = oI18n.getText("asint.cml.list.table.title.text", [sCount]);

                    mCMLModel.setProperty("/data/listPage/table/header", sHeader);
                    mCMLModel.setProperty("/data/listPage/table/isBusy", false);
                });
            }

        },

        /**
         * Fucntion to handle the change in the filter bar.
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onDataReceivedForCmlOv: function (oEvent) {

            var mCMLModel = this.getView().getModel("mCMLModel");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oParameters = oEvent.getSource().getQueryOptionsFromParameters();

            if (oParameters["$count"] && oEvent.getSource().getCount && oEvent.getSource().getCount()) {
                var iCount = oEvent.getSource().getCount();
                var sHeader = oI18n.getText("asint.cml.list.cmlOv.table.title.text", [iCount]);

                mCMLModel.setProperty("/data/listPageForCmlOv/table/header", sHeader);
            } else {
                mCMLModel.setProperty("/data/listPageForCmlOv/table/isBusy", true);
                this.fnFetchInlineCount(this, "idCMLMTableForCmlOv", function (sCount) {
                    var sHeader = oI18n.getText("asint.cml.list.cmlOv.table.title.text", [sCount]);

                    mCMLModel.setProperty("/data/listPageForCmlOv/table/header", sHeader);
                    mCMLModel.setProperty("/data/listPageForCmlOv/table/isBusy", false);
                });
            }

        },

        /**
         * Asset Life Spread - Apply filter for Half Life Chart Filter
         */
        onApplyHalfLifeChartFilter: function () {

            var oDataset = this.getView().byId("idVizFrameDataset1");
            var oRemainingLifeSelector = this.getView().byId("idAnalyticsRemainingLifeSelect");
            var oObjectTypeSelector = this.getView().byId("idAnalyticsObjectSelector");
            var sRemLifeSeletedKey = oRemainingLifeSelector.getSelectedKey();
            var sObjectTypeSelectedKey = oObjectTypeSelector.getSelectedKey();
            var iRemainingLifeStart = 0;
            var iRemainingLifeEnd = 5;
            if (sRemLifeSeletedKey) {
                switch (sRemLifeSeletedKey) {
                case "0-5 years":
                    iRemainingLifeStart = 0;
                    iRemainingLifeEnd = 5;
                    break;
                case "5-10 years":
                    iRemainingLifeStart = 5;
                    iRemainingLifeEnd = 10;
                    break;
                case "10-15 years":
                    iRemainingLifeStart = 10;
                    iRemainingLifeEnd = 15;
                    break;
                case "15-20 years":
                    iRemainingLifeStart = 15;
                    iRemainingLifeEnd = 20;
                    break;
                case "Above 20 years":
                    iRemainingLifeStart = 20;
                    iRemainingLifeEnd = 500;
                    break;
                }
            }

            var aFilter = [];
            aFilter.push(new sap.ui.model.Filter({
                path: "remainingLife",
                operator: sap.ui.model.FilterOperator.BT,
                value1: iRemainingLifeStart,
                value2: iRemainingLifeEnd
            }));
            if (sObjectTypeSelectedKey) {
                aFilter.push(new sap.ui.model.Filter({
                    path: "objectType",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sObjectTypeSelectedKey,
                    caseSensitive: false
                }));
            }

            if (aFilter.length > 0) {
                oDataset.getBinding("data").filter(new sap.ui.model.Filter({
                    filters: aFilter,
                    and: true
                }));
            }

        },

        /**
         * Function to clear value to the model bindings
         */
        fnResetValuesforCreateInspection: function () {

            var mCMLModel = this.getView().getModel("mCMLModel");
            mCMLModel.setProperty("/data/createInspectionWizard/objectType", "EQUI");
            mCMLModel.setProperty("/data/createInspection/selectedObject/name", "");
            mCMLModel.setProperty("/data/listPage/create/cml/selectedObjectTemplate", "");
            mCMLModel.setProperty("/data/listPage/create/cml/selectedInspectionTemplate", "");
            mCMLModel.setProperty("/metaData/listPage/create/cml/valueState/inspectionTemplate", "None");
            mCMLModel.setProperty("/metaData/listPage/create/cml/valueStateText/inspectionTemplate", "");
            mCMLModel.setProperty("/data/createInspection/inspectionDescription", "");
            mCMLModel.setProperty("/data/createInspection/inspectionDate", "");
            mCMLModel.setProperty("/data/createInspection/selectedCml", []);

        },

        /**
         * Function to Get CML and Object with Parent list
         * 
         * @param {String} sObjectId - Selected Object ID
         * @param {String} sObjectType - Selected Object Type
         * @param {String} sDialogName - Selected Dialog Name that function trigger
         */
        fnFetchObjectAndCMLsList: function (sObjectId, sObjectType, sDialogName) {

            var oCommonModel = this.getView().getModel("mCMLModel");
            var mInspectionList = this.getView().getModel("mCMLList");
            var sUom = oCommonModel.getProperty("/data/UOM");

            this.CMLHelper.fnGetObjectAndCMLsList(this, sObjectId, sObjectType, sUom, sDialogName, "", "", function (oResponse) {
                if (sDialogName === "CMLCreate") {
                    oCommonModel.setProperty("/data/listPage/componentList", oResponse.componentList);
                    oCommonModel.setProperty("/data/listPage/create/cml/cmlList", oResponse.aCMLs);
                } else {
                    mInspectionList.setProperty("/data/CMLsList", oResponse.aCMLs);
                }

            });
        },

        /**
         * Function to validate the CML Name while user create a CML
         * 
         * @param {Function} fnSuccess 
         */
        fnValidateCMLName: function (fnSuccess) {

            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var oTable = Fragment.byId("idCreateCMLFragment", "idCustomDataSourceTable");

            that.CMLHelper.fnValidateCMLName(oTable, oCommonModel, "listPage", function (bValidate,forDuplicate,isSiblingPresent) {
                fnSuccess(bValidate,forDuplicate,isSiblingPresent);
            });

        },

        /**
        * Adaptive Filter Equipment Name ValueHelp dialog Open and Set Value
        */
        handleEquipmentValueHelp: function (controlID) {
            var oInput = this.getView().byId(controlID) || sap.ui.getCore().byId(controlID);
            var aPreviousSelections = oInput.getTokens().map(function(token) {
                return token.getText();
            });

            /**
             * 
             * @param {Array} oReturn - Return the Selected value
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    var aNewSelections = oReturn.selected.map(function(oItem) {
                        return oItem.name;
                    });

                    // Combine previous selections and new selections
                    var aCombinedSelections = aPreviousSelections.concat(aNewSelections);

                    // Filter out duplicates
                    var aUniqueSelections = aCombinedSelections.filter(function(value, index, self) {
                        return self.indexOf(value) === index;
                    });

                    // Clear previous tokens and add unique tokens
                    oInput.removeAllTokens();
                    aUniqueSelections.forEach(function (value) {
                        var token = new sap.m.Token({
                            text: value
                        });
                        oInput.addToken(token);
                    });
                }
            };

            this.technicalObjectValueHelp.handleEquipmentValueHelp(fnComplete, true);
        },

        /**
         * Adaptive Filter Equipment Name ValueHelp dialog Open and Set Value
         */
        handleFunctionalLocationValueHelp: function (sControlId) {
            var oInput = this.getView().byId(sControlId) || sap.ui.getCore().byId(sControlId);
            var aPreviousSelections = oInput.getTokens().map(function(token) {
                return token.getText();
            });
        
            /**
             * 
             * @param {Array} oReturn - Return the Selected value
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    var aNewSelections = oReturn.selected.map(function(oItem) {
                        return oItem.name;
                    });
        
                    var aCombinedSelections = aPreviousSelections.concat(aNewSelections);
        
                    var aUniqueSelections = aCombinedSelections.filter(function(value, index, self) {
                        return self.indexOf(value) === index;
                    });
        
                    oInput.removeAllTokens();
                    aUniqueSelections.forEach(function (value) {
                        var token = new sap.m.Token({
                            text: value
                        });
                        oInput.addToken(token);
                    });
                }
            };
        
            this.technicalObjectValueHelp.handleFunctionalLocationValueHelp(fnComplete, true);
        },

        /**
         * Function to Set visibility of the Create CML and Grid CML content
         */
        onChangeSelectCMLRadio: function (oEvent) {

            var oCommonModel = this.getView().getModel("mCMLModel");
            var iSelectedIndex = oEvent.getParameters().selectedIndex;

            if (iSelectedIndex === 0) {
                oCommonModel.setProperty("/data/listPage/create/cml/selectedCMLRadio", true);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedGridCMLRadio", false);
                var ocustomGridDataset = [
                    {
                        "gridCMLName": "",
                        "rowSize": 2,
                        "colSize": 2,
                        "cmlTemplate": ""
                    },
                ];

                oCommonModel.setProperty("/data/listPage/create/cml/customGridDataset", ocustomGridDataset);
                oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", false);
            } else {
                oCommonModel.setProperty("/data/listPage/create/cml/selectedCMLRadio", false);
                oCommonModel.setProperty("/data/listPage/create/cml/selectedGridCMLRadio", true);
                var oCustomDataset = [
                    {
                        "name": "",
                        "description": "",
                        "cmlTemplate": "",
                        "nameValueState": "None",
                        "nameValueStateText": "",
                        "descpValueState": "None"
                    },
                    {
                        "name": "",
                        "description": "",
                        "cmlTemplate": "",
                        "nameValueState": "None",
                        "nameValueStateText": "",
                        "descpValueState": "None"
                    }
                ];
                oCommonModel.setProperty("/data/listPage/create/cml/customDataset", oCustomDataset);
                oCommonModel.setProperty("/metaData/listPage/create/cml/wizard/createEnabled", false);
            }
        },

        /**
         * Function on Input change
         */
        onChangeStepInput: function () {

            var oCreateCMLWiz = Fragment.byId("idCreateCMLFragment", "idCreateCMLWizard");

            this.onValidateCreateCMLWiz("step" + oCreateCMLWiz.getProgress());

        },

        /**
         * 
         */
        onSegmentedButtonChange : function(oEvent){
            var sKey = oEvent.getSource().getSelectedKey();
            var oNavContainer = this.getView().byId("idNavContFlexiColMidPage");
            var oFlexiColLayout = this.getView().byId("idFlexiColLayout");

            if(sKey === "ASSET_OVERVIEW"){
                this.getView().byId("idCMLMTable_").setVisible(true);
                this.getView().byId("idCMLMTableForCmlOv").setVisible(false);
                oNavContainer.to(this.getView().byId("idCMLMTablePage"),"slide");
            }else if(sKey === "CML_OVERVIEW"){
                this.getView().byId("idCMLMTable_").setVisible(false);
                this.getView().byId("idCMLMTableForCmlOv").setVisible(true);
                oNavContainer.to(this.getView().byId("idCMLMTablePageForCmlOv"),"slide"); 
            }

            oFlexiColLayout.setLayout("MidColumnFullScreen");
        },

        /**
         * Excel Export CML overview list page
         */
        onExcelExportForCmlOv : function(){

            var that = this;
            var sFileName = this._oi18n.getText("asint.cml.list.cmlOv.table.title.onlytext");
            sFileName += "_" + this.fnFormatter.formatDate(new Date(), "dd_MM_yyyy_HH_mm_ss");
            var oTable = this.byId("idCMLMTableForCmlOv");
            var oBinding = oTable.getBinding("items");
            var sDownloadUrl = oBinding.getDownloadUrl();
            
            var sCountUrl = sDownloadUrl;
            if (sDownloadUrl.indexOf("?") !== -1) {
                var aParts = sDownloadUrl.split("?");
                var sBasePath = aParts[0];
                var sQueryString = aParts[1];
                var aParams = sQueryString.split("&");
                var aAllowedParams = aParams.filter(function(sParam) {
                    return sParam.startsWith("$filter") || sParam.startsWith("$search");
                });
                sCountUrl = sBasePath + "/$count" + (aAllowedParams.length > 0 ? "?" + aAllowedParams.join("&") : "");
            } else {
                sCountUrl = sDownloadUrl + "/$count";
            }

            this.commonDataSource.fnMakeGetRequest(sCountUrl, {}, function (sCount) {

                var iTotal = parseInt(sCount, 10);
                var iChunkSize = 100;
                var iTotalChunks = Math.ceil(iTotal / iChunkSize);
                var mBatchData = {};
                var iProcessed = 0;

                for (var i = 0; i < iTotalChunks; i++) {

                    (function (iIndex) {

                        var iSkip = iIndex * iChunkSize;
                        var sPagedUrl = sDownloadUrl + (sDownloadUrl.indexOf("?") !== -1 ? "&" : "?") + "$skip=" + iSkip + "&$top=" + iChunkSize;

                        that.commonDataSource.fnMakeGetRequest(sPagedUrl, {}, function (oRes) {
                            mBatchData[iIndex] = oRes.value;
                            iProcessed++;
                            if (iProcessed === iTotalChunks) {
                                buildExport();
                            }
                        }, function () {
                            mBatchData[iIndex] = [];
                            iProcessed++;
                            if (iProcessed === iTotalChunks) {
                                buildExport();
                            }
                        });
                    })(i);

                    
                }

                /**
                 * Function to build export  
                */
                function buildExport() {

                    var aFinalResponse = [];
                    var aResponse = [];
                    var aReadingKeys = ["inspectionDate","tmin","reading","halfLife","retirementDate","stcr","ltcr"];
                    var oReadingMapping = {
                        "inspectionDate" : "DATE",
                        "tmin" : "TMIN",
                        "halfLife" : "HALF_LIFE",
                        "retirementDate" :"RETIREMENT_DATE",
                        "stcr" :"SHORT_TERM_CORROSION_RATE",
                        "ltcr": "LONG_TERM_CORROSION_RATE",
                        "reading" : "READING"
                    }
                    var aChunkResponse = Object.values(mBatchData);

                    if(aChunkResponse && aChunkResponse.length) {

                        aResponse = [].concat.apply([], aChunkResponse);
                    }

                    for(var iResponse = 0 ; iResponse < aResponse.length ; iResponse++) {

                        var oItem = Object.assign({},aResponse[iResponse]);
                        var sReading = oItem.readings;
                        
                       
                        for(var iReadingKeys = 0 ; iReadingKeys < aReadingKeys.length ; iReadingKeys++) {

                            var sKey = aReadingKeys[iReadingKeys];
                            oItem[sKey] = that.fnFormatter.fnGetReadingsForCmlOverview(sReading,oReadingMapping[sKey]);

                        }

                        aFinalResponse.push(oItem);
                       
                    }

                    that.fnExportTableDataToExcel("idCMLMTableForCmlOv", sFileName, function (fnCallback) {
                        fnCallback(aFinalResponse);
                    });
                }
            });

        },

        /**
         * Asset cml overview Row click to Navigate to detail page
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onPressCmlOverview: function (oEvent) {

            var that = this;
            var oRouter = that.getOwnerComponent().getRouter();
            var oContext = oEvent.getSource().getBindingContext("masterServiceCmlList").getObject();
            var sObjectId = oEvent.getSource().getBindingContext("masterServiceCmlList").getProperty("objectId");
            var sObjectTypeCode = oEvent.getSource().getBindingContext("masterServiceCmlList").getProperty("objectType");
            var sCmlId = oEvent.getSource().getBindingContext("masterServiceCmlList").getProperty("cmlID");
            
            var sObjectType = "";

            if (sObjectTypeCode === "EQUI") {
                sObjectType = "equipment";
            } else {
                sObjectType = "functionalLocation";
            }

            if (oContext) {

                oRouter.navTo("nCMLDetail", {
                    objectType: sObjectType,
                    objectId: sObjectId,
                    locationId : sCmlId //"090f0204-2aae-4e2c-b651-20f579be42fb"  DC_001 EQUI.527
                });
            }

        },

        /**
         * Set Remaining Life Tech Count Viz properties
         */
        setRemainingLifeVizProperties : function(){
            
            var oVizFrameForRemainingLifeCount = this.getView().byId("idVizFrameForRemainingLife");
            oVizFrameForRemainingLifeCount.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true
                    }
                },
                valueAxis: {
                    title: {
                        visible: true,
                        text: this._oi18n.getText("asint.cml.list.analytics.chart.technicalObjectCount.text")
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true,
                        text: this._oi18n.getText("asint.cml.list.analytics.chart.remainingLife.text")
                    }
                },
                title: {
                    visible: true,
                    text: this._oi18n.getText("asint.cml.list.analytics.chart.remainingLifeTitle.text")
                },
                interaction: {
                    selectability: {
                        mode: "SINGLE"
                    }
                }
            });

            var popoverPropsForRemainingLifeCount = {
                /**
                 * 
                 * @param {Object} data - Graph data
                 * @returns 
                 */
                "customDataControl": function (data) {
                    if (data.data.val) {
                        var values = data.data.val, divStr = "";
                        var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='" + data.data.color + "' transform='translate(5,5)'></path></svg>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 15px 15px'>" + svg + "</b>" + "<b style='margin-left:10px'>" + values[2].value + "</b></div>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 15px 30px'>" + values[0].name + "<span style = 'float: right'>" + values[0].value + " Years"  + "</span></div>";
                        return new HTML({ content: divStr });
                    }
                }
            };

            var oPopOverForRemainingLifeCount = new Popover(popoverPropsForRemainingLifeCount);
            oPopOverForRemainingLifeCount.connect(oVizFrameForRemainingLifeCount.getVizUid());
        },

        /**
         * Remaining Life Tech Count -Analytics graph data preparation
         */
        fnFetchCMLRemainingLifeKPIData: function () {

            var that = this;
            var mCMLList = this.getView().getModel("mCMLList");

            this.CMLDataSource.getRemainingLifeTechCountforAnalytics(function (oData) {
                var aResults = [];
                var oRemainingLife = {};
                var iFirst = 0;
                var iLast = 0;
                var aFinalArray = [];

                if (oData.value && oData.value.length) {
                    aResults = oData.value;
                    iLast = aResults[aResults.length - 1].remainingLife;
                }
                if (aResults.length > 0) {

                    for(var j=iFirst; j<=iLast; j++) {

                        if(!oRemainingLife[j]) {
                            oRemainingLife[j] = {
                                remainingLife: j,
                                equipmentCount: 0,
                                objectNames: "",
                                objectIds: "",
                                objectTypes: ""
                            };
                        }
                    }
                    for (var i = 0; i < aResults.length; i++) {
                        var oTemp = Object.assign({}, aResults[i]);
                        oRemainingLife[oTemp.remainingLife] = oTemp;
                    }

                    aFinalArray = Object.values(oRemainingLife);
                    mCMLList.setProperty("/data/KPIData/RemainingLifeTechCountGroupedData", oRemainingLife);
                    mCMLList.setProperty("/data/KPIData/RemainingLifeCountData", aFinalArray);

                }else{
                    mCMLList.setProperty("/data/KPIData/RemainingLifeTechCountGroupedData", {});
                    mCMLList.setProperty("/data/KPIData/RemainingLifeCountData", []);
                }
            }, function (oError) {
                that.fnMessageShow("E", that._oi18n.getText("asint.cml.KPI.message01"), oError);
            });

        },

        /**
         * Analytics - Remaining Life Spread Chart Selection Change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onRemainingLifeCountChartSelectionChange: function (oEvent) {

            var mCMLList = this.getView().getModel("mCMLList");
            var oRemainingLifeCountGroupedData = mCMLList.getProperty("/data/KPIData/RemainingLifeTechCountGroupedData");
            var sDimensionLabel = "Remaining Life";
            this.onAnalyticsChartSelectionChange(oEvent, oRemainingLifeCountGroupedData, sDimensionLabel);
        },

        /**
         * Set STCR Viz properties
         */
        setStcrVizProperties : function(){
            
            var oVizFrameForStcr = this.getView().byId("idVizStcr");

            oVizFrameForStcr.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true
                    }
                },
                valueAxis: {
                    title: {
                        visible: true,
                        text: this._oi18n.getText("asint.cml.list.analytics.chart.technicalObjectCount.text")
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true,
                        text: this._oi18n.getText("asint.cml.list.analytics.chart.stcr.text")
                    }
                },
                title: {
                    visible: true,
                    text: this._oi18n.getText("asint.cml.list.analytics.chart.stcrTitle.text")
                },
                interaction: {
                    selectability: {
                        mode: "SINGLE"
                    }
                }
            });

            var popoverPropsForStcr = {
                /**
                 * 
                 * @param {Object} data - Graph data
                 * @returns 
                 */
                "customDataControl": function (data) {
                    if (data.data.val) {
                        var values = data.data.val, divStr = "";
                        var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='" + data.data.color + "' transform='translate(5,5)'></path></svg>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 15px 15px'>" + svg + "</b>" + "<b style='margin-left:10px'>" + values[2].value + "</b></div>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 15px 30px'>" + values[0].name + "<span style = 'float: right'>" + values[0].value + "</span></div>";
                        return new HTML({ content: divStr });
                    }
                }
            };

            var oPopOverForStcr = new Popover(popoverPropsForStcr);
            oPopOverForStcr.connect(oVizFrameForStcr.getVizUid());
        },

        /**
         * STCR Vs Technical Object Count - Analytics graph data preparation
        */
        fnFetchCMLSTCRKPIData: function () {

            var that = this;
            var mCMLList = this.getView().getModel("mCMLList");

            this.CMLDataSource.getStcrTechCountforAnalytics(function (oData) {

                var aResults = [];
                var oStcr = {};
                // var iFirst = 0.001;
                // var iLast = 0.001;
                var aFinalArray = [];

                if (oData.value && oData.value.length) {
                    aResults = oData.value;
                    // iLast = aResults[aResults.length - 1].shortTermCorrosionRate;
                }
                if (aResults.length > 0) {

                    // for(var j=iFirst; j<=iLast; j = Math.round((j + iFirst) * 1000) / 1000 ) {

                    //     if(!oStcr[j]) {
                    //         oStcr[j] = {
                    //             shortTermCorrosionRate: j,
                    //             equipmentCount: 0,
                    //             objectNames: "",
                    //             objectIds: "",
                    //             objectTypes: ""
                    //         };
                    //     }
                    // }
                    for (var i = 0; i < aResults.length; i++) {
                        var oTemp = Object.assign({}, aResults[i]);
                        oStcr[oTemp.shortTermCorrosionRate] = oTemp;
                    }

                    aFinalArray = Object.values(oStcr);
                    mCMLList.setProperty("/data/KPIData/StcrTechCountGroupedData", oStcr);
                    mCMLList.setProperty("/data/KPIData/StcrTechCountData", aFinalArray);

                }else{
                    mCMLList.setProperty("/data/KPIData/StcrTechCountGroupedData", {});
                    mCMLList.setProperty("/data/KPIData/StcrTechCountData", []);
                }
            }, function (oError) {
                that.fnMessageShow("E", that._oi18n.getText("asint.cml.KPI.message02"), oError);
            });

        },

        /**
         * Stcr vs Technical Object Count Chart Selection Change
         * @param {*} oEvent 
         */
        onStcrChartSelectionChange : function(oEvent){

            var mCMLList = this.getView().getModel("mCMLList");
            var oStcrTechCountGroupedData = mCMLList.getProperty("/data/KPIData/StcrTechCountGroupedData");
            var sDimensionLabel = "Short Term Corrosion Rate";
            this.onAnalyticsChartSelectionChange(oEvent, oStcrTechCountGroupedData, sDimensionLabel);
        },

        /**
         * Set STCR Viz properties
         */
        setLtcrVizProperties : function(){
            
            var oVizFrameForLtcr = this.getView().byId("idVizLtcr");

            oVizFrameForLtcr.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true
                    }
                },
                valueAxis: {
                    title: {
                        visible: true,
                        text: this._oi18n.getText("asint.cml.list.analytics.chart.technicalObjectCount.text")
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true,
                        text: this._oi18n.getText("asint.cml.list.analytics.chart.ltcr.text")
                    }
                },
                title: {
                    visible: true,
                    width : "100%",
                    text: this._oi18n.getText("asint.cml.list.analytics.chart.ltcrTitle.text")
                },
                interaction: {
                    selectability: {
                        mode: "SINGLE"
                    }
                }
            });

            var popoverPropsForLtcr = {
                /**
                 * 
                 * @param {Object} data - Graph data
                 * @returns 
                 */
                "customDataControl": function (data) {
                    if (data.data.val) {
                        var values = data.data.val, divStr = "";
                        var svg = "<svg width='10px' height='10px'><path d='M-5,-5L5,-5L5,5L-5,5Z' fill='" + data.data.color + "' transform='translate(5,5)'></path></svg>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 15px 15px'>" + svg + "</b>" + "<b style='margin-left:10px'>" + values[2].value + "</b></div>";
                        divStr = divStr + "<div style = 'margin: 5px 30px 15px 30px'>" + values[0].name + "<span style = 'float: right'>" + values[0].value + "</span></div>";
                        return new HTML({ content: divStr });
                    }
                }
            };

            var oPopOverForLtcr = new Popover(popoverPropsForLtcr);
            oPopOverForLtcr.connect(oVizFrameForLtcr.getVizUid());
        },

        /**
         * LTCR Vs Technical Object Count - Analytics graph data preparation
        */
        fnFetchCMLLTCRKPIData: function () {

            var that = this;
            var mCMLList = this.getView().getModel("mCMLList");

            this.CMLDataSource.getLtcrTechCountforAnalytics(function (oData) {

                var aResults = [];
                var oStcr = {};
                // var iFirst = 0.001;
                // var iLast = 0.001;
                var aFinalArray = [];

                if (oData.value && oData.value.length) {
                    aResults = oData.value;
                    // iLast = aResults[aResults.length - 1].longTermCorrosionRate;
                }
                if (aResults.length > 0) {

                    // for(var j=iFirst; j<=iLast; j = Math.round((j + iFirst) * 1000) / 1000) {

                    //     if(!oStcr[j]) {
                    //         oStcr[j] = {
                    //             longTermCorrosionRate: j,
                    //             equipmentCount: 0,
                    //             objectNames: "",
                    //             objectIds: "",
                    //             objectTypes: ""
                    //         };
                    //     }
                    // }
                    for (var i = 0; i < aResults.length; i++) {
                        var oTemp = Object.assign({}, aResults[i]);
                        oStcr[oTemp.longTermCorrosionRate] = oTemp;
                    }

                    aFinalArray = Object.values(oStcr);
                    mCMLList.setProperty("/data/KPIData/LtcrTechCountGroupedData", oStcr);
                    mCMLList.setProperty("/data/KPIData/LtcrTechCountData", aFinalArray);

                }else{
                    mCMLList.setProperty("/data/KPIData/LtcrTechCountGroupedData", {});
                    mCMLList.setProperty("/data/KPIData/LtcrTechCountData", []);
                }
            }, function (oError) {
                that.fnMessageShow("E", that._oi18n.getText("asint.cml.KPI.message03"), oError);
            });

        },

        /**
         * Ltcr vs Technical Object Count Chart Selection Change
         * @param {*} oEvent 
         */
        onLtcrChartSelectionChange : function(oEvent){

            var mCMLList = this.getView().getModel("mCMLList");
            var oLtcrTechCountGroupedData = mCMLList.getProperty("/data/KPIData/LtcrTechCountGroupedData");
            var sDimensionLabel = "Long Term Corrosion Rate";
            this.onAnalyticsChartSelectionChange(oEvent, oLtcrTechCountGroupedData, sDimensionLabel);
        },

        /**
         * Analytics - Remaining Life Spread Chart Selection Change
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onAnalyticsChartSelectionChange: function (oEvent,oGroupedData,sDimensionLabel) {

            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");
            var oEQUIultiInputFilterItem = this.getView().byId("idEQUINameMultiInputFilterItem");
            var oEQUIMultiInputFilter = this.getView().byId("idCMLEquipmentInputFilter");
            var oFLNameMultiInputFilterItem = this.getView().byId("idFLNameMultiInputFilterItem");
            var oFLNameMultiInputFilter = this.getView().byId("idCMLFunctionalInputFilter");
            var aVizSelection = oEvent.getSource().vizSelection();
            var bEquipmentFilter = false;
            var bFlocFilter = false

            oFLNameMultiInputFilter.removeAllTokens();
            oEQUIMultiInputFilter.removeAllTokens();

            if(aVizSelection.length > 0) {

                var iValue = aVizSelection[0].data[sDimensionLabel];

                if (oGroupedData[iValue]) {

                    var oData = oGroupedData[iValue];
                    var iCount = oData.equipmentCount;
                    var aObjectNames = oData["objectNames"] && oData["objectNames"].length ? oData["objectNames"].split(",") : [];
                    var aObjectIds = oData["objectIds"] && oData["objectIds"].length ? oData["objectIds"].split(",") : [];
                    var aObjectType = oData["objectTypes"] && oData["objectTypes"].length ? oData["objectTypes"].split(",") : [];
                    
                    for(var i = 0 ; i < iCount ; i++) {

                        if (aObjectType[i] === "EQUI" && oEQUIMultiInputFilter) {
                            bEquipmentFilter = true;
                            if (oEQUIMultiInputFilter) {
                                oEQUIMultiInputFilter.addToken(new sap.m.Token({
                                    key: aObjectIds[i],
                                    text: aObjectNames[i]
                                }));
                            }
                        } else if (aObjectType[i] == "FLOC" && oFLNameMultiInputFilter) {
                            bFlocFilter = true;
                            oFLNameMultiInputFilter.addToken(new sap.m.Token({
                                key: aObjectIds[i],
                                text: aObjectNames[i]
                            }));
                        }
                    }

                }
            }

            oEQUIultiInputFilterItem.setVisibleInFilterBar(bEquipmentFilter);
            oFLNameMultiInputFilterItem.setVisibleInFilterBar(bFlocFilter);
            oFilterBar.fireSearch();
        },

    });
});