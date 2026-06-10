sap.ui.define([
    "com/asint/ais/mi/cml/controller/BaseController",
    "com/asint/ais/mi/cml/utility/Formatter",
    "com/asint/ais/mi/cml/controller/detail/CMLDetailTabs",
    "sap/ui/core/Fragment",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/format/DateFormat",
    "com/asint/ais/mi/cml/lib/pdfmake",
    "com/asint/ais/mi/cml/lib/vfs_fonts",  
    "sap/m/MessageBox"
], function (BaseController, Formatter, CMLDetailTabs, Fragment, ExportLibrary, Spreadsheet, DateFormat, PdfMake, VfsFonts, MessageBox) {
    "use strict";

    var EdmType = ExportLibrary.EdmType;

    return BaseController.extend("com.asint.ais.mi.cml.controller.detail.CMLSummaryReadings", {

        formatter: Formatter,

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {
            this._bObjectTemplatesLoaded = false;
            this._sLastLoadedObjectId = "";
            this._LocationController = new CMLDetailTabs();
            this.getRouter().getRoute("nCMLDetail").attachPatternMatched(this.fnInitialize, this);
            this.busyDialog = new sap.m.BusyDialog();
        },

        /**
         * Function triggered after rendering.
         */
        onAfterRendering: function () {

            // this.fnInitTable();

        },

        /**
         * Initialize the all the function to get CMLs
         * 
         * @param {Object} oArguments - Selected Item Data
         */
        fnInitialize: function (oArguments) {

            var that = this;
            var oCommonCMLModel = that.getOwnerComponent().getModel("mCMLModel");
            var sObjectId = oArguments.getParameters().arguments.objectId;
            var sObjectType = "";
            var locationId = oArguments.getParameters().arguments.locationId;
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            that._oMessageBundle = oMessageBundle;
            that.oI18n = that.getView().getModel("i18n").getResourceBundle();
            var CMLstoCopy = oStorage.get("selectedCMLData");
            var oSummaryModel = {
                "layout": "OneColumn",
                "cmlTable": {
                    "analytics": {
                        "layout": "MidColumnFullScreen",
                        "enable": {
                            "button": false
                        },
                        "visualizationDataArr": [],
                        "dataSource": {},
                        "ReadingState": true,
                        "PredcThicknessState": false,
                        "iDefaultSelection": 0,
                        "isInitialLoad": true,
                        "vizId": ""
                    }
                },
                "headerData": {
                    "equipmentHeader": []
                },
                "overView": [],
                "summary": [],
                "CMLTemplate": [],
                "CMLTemplateObject": {},
                "cmlTemplates": [],
                "cmlData": [],
                "cmlHeaders": [],
                "CMLAggregators": [],
                "equipmentList": [],
                "UOMFlag": false,
                "Dimensions": {},
                "CMLs": {},
                "aCMLs": [],
                "cmlCollection": [],
                "aTempCMLs": [],
                "iTempTotalCount": 0,
                "aCMLReading": [],
                "exportData": [],
                "DateColumns": [],
                "CMLTemplateId": "",
                "DateColumnsViewDialog": {},
                "overallReadingCount": 0,
                "hasNewCML": false,
                "copyPaste": {
                    "selectedObject": [],
                    "sameAssestEdit": {
                        "name": "",
                        "desc": ""
                    },
                    "diffAssetEdit": {
                        "rowsData": [],
                        "tableHeader": ""
                    },
                    "visible": {
                        "pasteButton": false
                    }
                },
                "master": {
                    "response": {
                        "uom": {}
                    }
                },
                "metadata": {
                    "uom": {}
                },
                "moveAndPaste": {
                    "selectedObject": [],
                    "sameAssestEdit": {
                        "name": "",
                        "desc": ""
                    },
                    "diffAssetEdit": {
                        "rowsData": [],
                        "tableHeader": ""
                    },
                    "visible": {
                        "pasteButton": false
                    }
                },
                "moveAndPasteCmls":[],
                "detailSelectedCML": {},
                "componentList": [],
                "aFormattedData": [],
                "sSearchText": "",
                "cmlGroups": [],
                "selectedGroup": [],
                "sSegmentedButton": "",
                "isGroupVisible": false,
                "cmlGroupName": "",
                "setSelectedKey": "All",
                "selectedItemId": "idClearColor",
                "selectedIndex": [],
                "copyPasteData": [],
                "renewCml": [],
                "isCheckedCml": false,
                "resonForRenew": "",
                "firstRowData": {},
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
                        "sObjectId": "",
                        "selectedLocation": "",
                        "selectedLocationName": "",
                    }
                }
            };

            var sUom = this.getSelectedUoMSystem() || "metric";
            oCommonCMLModel.setProperty("/data/UOM", sUom);

            var oExisting = oCommonCMLModel.getProperty("/data/detailPage") || {};
            oExisting = Object.assign(oExisting, oSummaryModel);
            oCommonCMLModel.setProperty("/data/detailPage", oExisting);
            oCommonCMLModel.setProperty("/data/detailPage/CMLs", []);

            if (oArguments.getParameters().arguments.objectType === "functionalLocation" || oArguments.getParameters().arguments.objectType === "FLOC") {
                sObjectType = "FLOC";
            } else {
                sObjectType = "EQUI";
            }

            this._sObjectId = sObjectId;
            this._sObjectType = sObjectType;
            this._locationId = locationId;

            if (CMLstoCopy && CMLstoCopy.length > 0) {
                oCommonCMLModel.setProperty("/data/detailPage/copyPaste/visible/pasteButton", true);
                if (CMLstoCopy[0].objectId == sObjectId) {
                    oCommonCMLModel.setProperty("/data/detailPage/copyPaste/visible/pasteButton", false);
                }
            } else {
                oCommonCMLModel.setProperty("/data/detailPage/copyPaste/visible/pasteButton", false);
            }

            // Get Roles for Action buttons
            that.getUserRoles();
            // Get Object and CML Details
            that.fnGetData(sObjectType, sObjectId, function () {
                // TODO - Detail page Summary related code
            });
            // Get UOM List
            that.CMLDataSource.getUoMList(function (aResponse) {

                var oUoMMap = {};
                var oUoMDesc = {};

                for (var i in aResponse) {

                    var sDimension = aResponse[i].dimension.toLowerCase();
                    var sSystem = aResponse[i].system.toLowerCase();

                    if (!oUoMMap[sDimension]) {
                        oUoMMap[sDimension] = {};
                    }
                    if (!oUoMMap[sDimension][sSystem]) {
                        oUoMMap[sDimension][sSystem] = [{
                            "key": "",
                            "system": "",
                            "dimension": "",
                            "description": ""
                        }];
                    }
                    oUoMDesc[aResponse[i].key] = aResponse[i].description;
                    oUoMMap[sDimension][sSystem].push(aResponse[i]);
                }

                oCommonCMLModel.setProperty("/data/detailPage/metadata/uom", {
                    "map": oUoMMap,
                    "list": aResponse,
                    "desc": oUoMDesc
                });
                oCommonCMLModel.setProperty("/data/detailPage/master/response/uom", aResponse);

            }, function (oError) {

                that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE014"), oError.responseText);

            });

            that.fnFetchComponentTypeList();
            that.fnLoadFeatureFlagConfig();
        },

        /**
         * Fetch the CML Data based on Object ID and Type
         * 
         * @param {String} sObjectType - Selected Technicial Object Type
         * @param {String} sObjectId - Selected Technicial Object ID
         * @param {Function} fnSuccessCallBack - Callback Function
         */
        fnGetData: function (sObjectType, sObjectId, fnSuccessCallBack) {

            var that = this;
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            // Get Object Details by ObjectId (EQUI ID or FLOC ID)
            // var aTable = this.getView().byId("idAsintCMLOverallReading");
            that.CMLHelper.fnGetObjectAndCMLsList(this, sObjectId, sObjectType, sUom, "detailPage", "cml", "mCMLModel", function (aFormatedData) {
                if (aFormatedData.aCMLs.length > 0) {
                    oCommonCMLModel.setProperty("/data/detailPage/CMLs", aFormatedData.aFinalCMLResult);
                    oCommonCMLModel.setProperty("/data/detailPage/aCMLs", aFormatedData.aCMLs);
                    oCommonCMLModel.setProperty("/data/detailPage/aTempCMLs", aFormatedData.aFinalCMLResult);
                    oCommonCMLModel.setProperty("/data/detailPage/exportData", aFormatedData.exportData);
                    oCommonCMLModel.setProperty("/data/detailPage/aFormattedData", aFormatedData);
                    oCommonCMLModel.setProperty("/data/detailPage/overallReadingCount", aFormatedData.iCount);
                    oCommonCMLModel.setProperty("/data/detailPage/iTempTotalCount", aFormatedData.iCount);
                    oCommonCMLModel.setProperty("/data/detailPage/headerData", aFormatedData.aHeaderData);
                    oCommonCMLModel.setProperty("/data/detailPage/cmlGroups", that.fnGetUniqueCMLGroupName(aFormatedData.aCMLs, "groupName"));
                    // aTable.clearSelection();

                    if(that._locationId){
                        that.fnChangeLayout(aFormatedData.aFinalCMLResult);
                    }

                    that.CMLDataSource.getObjectDetails(sObjectType, sObjectId, function(oRes){
                        var aLocation = [];
                        if(oRes){
                            var cmlTemplateCollectionData = oRes.to_cml_template_collection;
                            cmlTemplateCollectionData.forEach(function(oItem) {
                                if (oItem.cmlCollection && oItem.cmlCollection.status === "PBD" && Array.isArray(oItem.cmlCollection.to_cml_template)) {
                                    oItem.cmlCollection.to_cml_template.forEach(function(oTemplate) {
                                        aLocation.push(oTemplate.cmlTemplateCollection_ID); 
                                    });
                                }
                            });
                            var aUniqueLocation = [];
                            aLocation.forEach(function(sLoc) {
                                if (aUniqueLocation.indexOf(sLoc) === -1) {
                                    aUniqueLocation.push(sLoc);
                                }
                            });
                            aLocation = aUniqueLocation;
                            oCommonCMLModel.setProperty("/data/detailPage/cmlTemplates", aLocation);
                            oCommonCMLModel.setProperty("/data/detailPage/cmlData", cmlTemplateCollectionData);
                            that.fnFetchEquipmentLists(sObjectId);
                            that.fnCmlSummaryData(sObjectId, sObjectType)
                        }
                    
                    },function(){})
                    fnSuccessCallBack();
                } else {
                    oCommonCMLModel.setProperty("/data/detailPage/headerData", aFormatedData.aHeaderData);
                    fnSuccessCallBack();
                }
            });

        },

        /**
         * Remove duplicate based on property name
         * 
         * @param {String} sProperty - Property to check duplicate
         * @param {Array} aGroup - Array with duplicate
         * @returns {Array} aUniqueGroupNameArray - Return Unique Value
         */
        fnGetUniqueCMLGroupName: function (aGroup, sProperty) {
            var oUniqueGroupNamesObj = {};
            var aUniqueGroupNamesArray = [{}];

            for (var i = 0; i < aGroup.length; i++) {
                var groupName = aGroup[i][sProperty];
                if (groupName) {
                    if (!oUniqueGroupNamesObj[groupName]) {
                        oUniqueGroupNamesObj[groupName] = true;
                        aUniqueGroupNamesArray.push(aGroup[i]);
                    }
                }
            }

            return aUniqueGroupNamesArray;
        },

        /**
         * Function to initialize the list view table.
         */
        fnInitTable: function () {

            if (!this.oTableP13nEngineHelper) {
                this.oTableP13nEngineHelper = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idAsintCMLOverallReading", // Mandatory
                        "settingButton": "idTreeTableP13nSettings"
                    },
                    "event": {
                        "columnListItemPress": "", // Mandatory
                        "onDataReceived": "" // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": false
                    }
                }, this);
            }

        },

        /**
         * Fetch equipment lists 
         * @param {String} sObjectId 
         */
        fnFetchEquipmentLists: function(sObjectId){
            var that = this;
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            that.CMLDataSource.getCMLsByObjectId(sObjectId, function(oRes){
                if(oRes && oRes.value){
                    var aList = oRes.value;
                    oCommonCMLModel.setProperty("/data/detailPage/equipmentList", aList)
                }
            },function(){})
        },

        /**
         * Function to get the Data for Summary Table
         */
        fnCmlSummaryData: function (sObjectId, sObjectType) {
            var that = this;
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var oEquipmentTemplate = oCommonCMLModel.getProperty("/data/detailPage/cmlTemplates");

            if (sObjectType === "EQUI" || sObjectType === "Equipment") {
                sObjectType = "EQUI";
            } else if (sObjectType === "FLOC" || sObjectType === "Functional Location") {
                sObjectType = "FLOC";
            } else {
                that.fnMessageShow("E", that.oI18n.getText("asint.cml.detailPage.cmlSummary.error.message001"));
                return;
            }
            that.CMLDataSource.fnGetSummaryDetails(sObjectId, sObjectType, function(oData){ 
                if(oData){
                    that.fnGeAggregatorForEquipTemp(oData, oEquipmentTemplate, 0);
                }
            },function(){})
        },

        /**
         * Function to fetch aggregator details
         * @param {array} aAggregators 
         * @param {Object} oEquipmentTemplateHeader 
         * @param {String} sCount 
         */
        fnGeAggregatorForEquipTemp: function (aAggregators, oEquipmentTemplateHeader) {
            var that = this,
                oModelIdms = that.getView().getModel("mCMLModel"),
                oListOfLocationAggregators = oModelIdms.getProperty("/data/detailPage/CMLAggregators");

            oListOfLocationAggregators = oListOfLocationAggregators ? oListOfLocationAggregators : {};

            if (oEquipmentTemplateHeader.length > 0) {
                that.fnGetAggregatorHeaderList(function (aDataRet) {
                    var aDataRetSort = aDataRet.sort(function (a, b) {
                        return Number(a.sequenceNo) - Number(b.sequenceNo);
                    });
                    $.each(aDataRetSort, function (i, oVal) {
                        oListOfLocationAggregators[oVal.aggregatorName] = oVal;
                    });
                    oModelIdms.setProperty("/data/detailPage/CMLAggregators", oListOfLocationAggregators);
                    if (oEquipmentTemplateHeader) {
                        that.fnArrangeAggregatorCML(aAggregators, oListOfLocationAggregators, function (aAggregatorSorted) {
                            that.fnShowLocationOverView(aAggregatorSorted, oListOfLocationAggregators);
                        });
                    }
                },
                function () {});
            } else {
                that.fnShowLocationOverView(aAggregators, oListOfLocationAggregators);
            }
        },

        /**
         * Function to fetch header list
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnGetAggregatorHeaderList: function(fnSuccess, fnError){
            var that = this;
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var cmlData = oCommonCMLModel.getProperty("/data/detailPage/cmlData");
            var cmlCollennIds = cmlData.map(function(item){
                return item.cmlCollection_ID;
            });
            that.CMLDataSource.getCMLHeaderList(function(oResponse){
                if (oResponse && oResponse.value) {
                    var filteredTemplates = oResponse.value.filter(function(item){
                        return item.active === true && cmlCollennIds.indexOf(item.templateId_ID) !== -1;
                    });

                    oCommonCMLModel.setProperty("/data/detailPage/cmlHeaders", filteredTemplates);
                    fnSuccess(filteredTemplates);
                } else {
                    fnSuccess([]); 
                }
            }, function(oError){
                if (fnError) {
                    fnError(oError);
                }
            });
        },

        /**
         * Function to arrange cml
         * @param {Array} aAggregators 
         * @param {Object} oListOfLocationAggregators 
         * @param {Function} fnCallBack 
         */
        fnArrangeAggregatorCML: function (aAggregators, oListOfLocationAggregators, fnCallBack) {
            var oDataOverView = {};
            var aDataOverview = [];
            $.each(aAggregators, function (ia, oAgg) {
                oDataOverView[oAgg.aggregatorHeaderCml.aggregatorName] = oAgg;
            });
            $.each(Object.keys(oListOfLocationAggregators), function (i, oVal) {
                if (oDataOverView[oVal]) {
                    aDataOverview.push(oDataOverView[oVal]);
                }
            });
            fnCallBack(aDataOverview);
        },

        /**
         * Fetch location overview
         * @param {Array} aAggregators 
         * @param {Object} oListOfLocationAggregators 
         */
        fnShowLocationOverView: function (aAggregators, oListOfLocationAggregators) {
            var that = this
            var oModelIdms = this.getView().getModel("mCMLModel");
            var sSystem = this.getSelectedUoMSystem() || "imperial";
            var aLocations = oModelIdms.getProperty("/data/detailPage/equipmentList");
            var oLocations = {};
            // var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            //     pattern: "MMM d, y, hh:mm a"
            // });
            // var dateFormat = oDateFormat.format(new Date());
            $.each(aLocations, function (i, oLoc) {
                oLocations[oLoc.ID] = oLoc;
            });

            /**
             * Calculate values
             * @param {Array} aProperAggregators 
             */
            var doThis = function (aProperAggregators) {
                $.each(aProperAggregators, function (j, oAgg) {
                    var oAggData = oListOfLocationAggregators[oAgg.aggregatorHeaderCml.aggregatorName];
                    if (oAggData && oAggData.to_description.shortDescription) {
                        oAgg.aggregatorHeaderCml.description = oAggData.to_description.shortDescription;
                        // oAgg.aggregatorHeaderCml.uom = sSystem === "imperial" ? oAggData.aggregatorUomImperial : oAggData.aggregatorUomMetric;
                    } else {
                        oAgg.aggregatorHeaderCml.description = "NA";
                    }
                    if (oAggData && (oAggData.aggregator === "MIN" || oAggData.aggregator === "MAX")) {
                        oAgg.aggregatorHeaderCml.uom = sSystem === "imperial" ? oAggData.aggregatorUomImperial : oAggData.aggregatorUomMetric;
                        if (oAggData && oAggData.dataType === "date") {
                            oAgg.aggregatorHeaderCml.value = oAgg.aggregatorHeaderCml.value1 ? oAgg.aggregatorHeaderCml.value1 : "";
                        }
                        if (oAggData && oAggData.dataType === "number" && oAggData.totalLength && oAggData.decimalAllowed) {
                            oAgg.aggregatorHeaderCml.value = that.fnToHandlePrecisionScale(oAgg.aggregatorHeaderCml.value1, oAggData.totalLength,
                                oAggData.decimalAllowed);
                        }
                    }

                    $.each(oAgg.aggregatorDatasourceCml, function (k, oAggDS) {
                        if (oAggDS && oAggDS.location_ID && oLocations[oAggDS.location_ID] && oLocations[oAggDS.location_ID].to_description[0].shortDescription) {

                            oAggDS.locDesc = oLocations[oAggDS.location_ID].name + " " + oLocations[oAggDS.location_ID].to_description[0].shortDescription;
                            if (oAggData && oAggData.aggregator !== "MIN" && oAggData.aggregator !== "MAX") {
                                if (oAggData && oAggData.dataType === "date") {
                                    oAggDS.value = oAggDS.value ? oAggDS.value : "";
                                    if (oAggDS.value2) {
                                        oAggDS.value2 = oAggDS.value ? oAggDS.value2: "";
                                    }
                                } else if (oAggData && oAggData.dataType === "number" && oAggData.totalLength && oAggData.decimalAllowed) {
                                    oAggDS.value = that.fnToHandlePrecisionScale(oAggDS.value, oAggData.totalLength, oAggData.decimalAllowed);
                                    if (oAggDS.value2) {
                                        oAggDS.value2 = that.fnToHandlePrecisionScale(oAggDS.value2, oAggData.totalLength, oAggData.decimalAllowed);
                                    }
                                }
                                if (oAggDS.value2) {
                                    oAggDS.locValue = oAggDS.value + " x " + oAggDS.value2;
                                } else {
                                    oAggDS.locValue = oAggDS.value;
                                }
                                if (oAggData.showText) {
                                    var sCopyShowText = oAggData.showText;
                                    sCopyShowText = sCopyShowText.replace("{Datasource}", oAggDS.value);
                                    sCopyShowText = sCopyShowText.replace("{Datasource2}", oAggDS.value2);
                                    oAggDS.locValue = sCopyShowText;
                                }
                                oAggDS.uom = sSystem === "imperial" ? oAggData.aggregatorUomImperial : oAggData.aggregatorUomMetric;
                            }
                        }
                    });
                });
                oModelIdms.setProperty("/data/detailPage/summary", aAggregators);
            };
            if (sSystem !== "metric") {
                doThis(aAggregators);
            } else {
                that.fnConvertValues(aAggregators, oListOfLocationAggregators, function (aConAggregators) {
                    doThis(aConAggregators);
                });
            }
        },

        /**
         * Return scale value
         * @param {String} sValue 
         * @param {String} slength 
         * @param {String} sScale 
         */
        fnToHandlePrecisionScale: function (sValue, slength, sScale) {
            var vCurValue = sValue,
                vTemp = "";

            if (vCurValue) {
                vCurValue = vCurValue ? parseFloat(vCurValue, 0) : 0;
                vCurValue = parseFloat(vCurValue.toFixed(sScale));

                if (vCurValue.toString().length > slength) {
                    if (slength && sScale) {
                        for (var iPx = 0; iPx < slength - sScale; iPx++) {
                            vTemp += "9";
                        }
                        vTemp += ".";
                        for (var iSx = 0; iSx < sScale; iSx++) {
                            vTemp += "9";
                        }
                        vCurValue = vTemp;
                    }
                }
            }
            return vCurValue;
        },

        /**
         * Function to convert vlaues to metric
         * @param {Array} aAggregators 
         * @param {Object} oListOfLocationAggregators 
         * @param {Function} fnCallBack 
         */
        fnConvertValues: function (aAggregators, oListOfLocationAggregators, fnCallBack) {
            var that = this,
                aUomsToConvert = [],
                oUomToConvert = {};

            $.each(aAggregators, function (i, oAgg) {
                oUomToConvert = {};
                var sAggKey = i + "/aggregatorHeaderCml";
                var sAggDsKey = "";
                var oAggregatorData = oListOfLocationAggregators[oAgg.aggregatorHeaderCml.aggregatorName];
                if (oAggregatorData && oAggregatorData.dataType === "number" && oAggregatorData.uomType) {
                    if (oAgg.aggregatorHeaderCml.value && (oAggregatorData.aggregator === "MIN" || oAggregatorData.aggregator === "MAX")) {
                        oUomToConvert = {
                            "key": sAggKey,
                            "srcUnit": oAggregatorData.aggregatorUomImperial,
                            "tgtUnit": oAggregatorData.aggregatorUomMetric,
                            "values": [oAgg.aggregatorHeaderCml.value]
                        };
                        aUomsToConvert.push(oUomToConvert);
                    }
                    if (oAggregatorData && oAggregatorData.aggregator !== "MIN" && oAggregatorData.aggregator !== "MAX") {
                        $.each(oAgg.aggregatorDatasourceCml, function (j, oAggDS) {
                            oUomToConvert = {};
                            sAggDsKey = i + "/aggregatorDatasourceCml/" + j;
                            if (oAggDS.value) {
                                oUomToConvert = {
                                    "key": sAggDsKey + "/value",
                                    "srcUnit": oAggregatorData.aggregatorUomImperial,
                                    "tgtUnit": oAggregatorData.aggregatorUomMetric,
                                    "values": [oAggDS.value]
                                };
                                aUomsToConvert.push(oUomToConvert);
                            }
                            if (oAggDS.value2) {
                                oUomToConvert = {
                                    "key": sAggDsKey + "/value2",
                                    "srcUnit": oAggregatorData.aggregatorUomImperial,
                                    "tgtUnit": oAggregatorData.aggregatorUomMetric,
                                    "values": [oAggDS.value2]
                                };
                                aUomsToConvert.push(oUomToConvert);
                            }
                        });
                    }
                }
            });

            if (aUomsToConvert.length > 0) {
                that.fnUoMConvert(aUomsToConvert, function (aConvertedData) {
                    if (aConvertedData.length > 0) {
                        $.each(aConvertedData, function (i, oCon) {
                            var sKey = oCon.key.split("/");
                            if (sKey.length === 2) {
                                aAggregators[sKey[0]].aggregatorHeaderCml.value = oCon.values[0].t;
                            } else if (sKey.length === 4) {
                                aAggregators[sKey[0]].aggregatorDatasourceCml[sKey[2]][sKey[3]] = oCon.values[0].t;
                            }

                        });
                        fnCallBack(aAggregators);
                    } else {
                        fnCallBack(aAggregators);
                    }
                }, function () {});
            } else {
                fnCallBack(aAggregators);
            }
        },

        /**
         * Summary Table Tab on click navigate to CML History datail page
         * 
         */
        onCML: function () {

            // TODO Once the Summary is Done - To render Tabs on Summary section select
        },

        /**
         * function to trigger bulk calculation of CMLs
         */
        fnBulkCalculate: function(){
            var that = this;
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var oCMlData = oCommonCMLModel.getProperty("/data/detailPage/CMLs");
            var aCMLData = oCMlData.categories;
            var sObjectId = that._sObjectId;
            var sObjectType = that._sObjectType;

            if(sObjectType === "EQUI"){
                sObjectType = "equipment";
            } else {
                sObjectType = "functionalLocation";
            }
            var sUrl = "cml-manage&/detail/{techObjectType}/{techObjectId}/cml"
                .replace("{techObjectType}", sObjectType)
                .replace("{techObjectId}", sObjectId);
            var aPayloadData = [];
    
            aCMLData.forEach(function(item) {
                if (item.categories && item.categories.length > 0) {
                    var aLocationIds = item.categories.map(function(category) {
                        return category.locationId;
                    });
                    aPayloadData.push(aLocationIds);
                }
            });
            
            var aPayload = {
                data: aPayloadData,
                url: sUrl
            };

            that.CMLDataSource.fnBulkCalculateCMl(aPayload, function(oResponse) {
                if(oResponse === "CML Calculation already in progress") {
                    that.fnMessageShow("I", that.oI18n.getText("asint.detail.bulkCalculate.message002"));
                }else{
                    that.fnMessageShow("I", that.oI18n.getText("asint.detail.bulkCalculate.message001"));
                }
            }, function() {
                that.fnMessageShow("E", that.oI18n.getText("asint.detail.bulkCalculate.message003"));
            });
        },

        /**
         * Function to handle the CMLs Table Excel Export
         * 
         */
        onExcelExport: function () {
            var that = this;
            var aCols, aDataToExport = [], oSettings, oSheet, sTableName, sFileName;
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var oMessageBundle = this.getView().getModel("mMessage").getResourceBundle();
            // oEqupFlocDetail = oCommonCMLModel.getProperty("/data/detailPage/headerData");
            // var sUom = oCommonCMLModel.getProperty("/data/UOM");
            var oCMLTable = this.getView().byId("idAsintCMLOverallReading");

            sTableName = "CML Overall Readings";
            sFileName = sTableName + " - " + new Date().toLocaleDateString().replaceAll("/", "_") + " - " +
                new Date().toLocaleTimeString().split(" ")[0].replace(/:\d{2}$/, "").replace(/:/g, ":");
            // Date conversion helper function
            // var convertDateFormat = function(dateString) {
            //     if (typeof dateString === "string" && /^[A-Za-z]{3}\s\d{2},\s\d{4}$/.test(dateString)) {
            //         try {
            //             var dateObj = new Date(dateString);
            //             if (!isNaN(dateObj.getTime())) {
            //                 var year = dateObj.getFullYear();
            //                 var month = String(dateObj.getMonth() + 1).padStart(2, '0');
            //                 var day = String(dateObj.getDate()).padStart(2, '0');
            //                 return year + '-' + month + '-' + day;
            //             }
            //         } catch (e) {
            //             console.log("Date conversion failed for:", dateString);
            //         }
            //     }
            //     return dateString; // Return original if conversion fails
            // };

            // if (oEqupFlocDetail.objectType === "EQUI") {
            //     sObjectType = "Equipment";
            // } else {
            //     sObjectType = "Functional Location";
            // }

            var aRawDataToExport = oCommonCMLModel.getProperty("/data/detailPage/exportData");

            for (var i = 0; i < aRawDataToExport.length; i++) {
                var oItem = aRawDataToExport[i];

                aDataToExport.push(oItem);
                if (oItem.categories && oItem.categories.length) {
                    for (var j = 0; j < oItem.categories.length; j++) {
                        var oReading = oItem.categories[j];

                        if(Object.keys(oReading).length > 0) {
                            var oRow = Object.assign({
                                cmlDescription: oItem.cmlDescription,
                                cmlName: oItem.cmlName,
                                cmlPosition: oItem.cmlPosition,
                                cmlTemplateName: oItem.cmlTemplateName,
                                dataId: oItem.dataId,
                                dataSourceId: oItem.dataSourceId,
                                dataType: oItem.dataType,
                                exportObjectName: oItem.exportObjectName,
                                exportObjectType: oItem.exportObjectType,
                                functionalLocationName: oItem.functionalLocationName,
                                groupName: oItem.groupName,
                                isSelected: oItem.isSelected,
                                locationId: oItem.locationId,
                                locationTemplateId: oItem.locationTemplateId,
                                objectId: oItem.objectId,
                                parentName: oItem.parentName,
                                // eslint-disable-next-line camelcase
                                persona_id: oItem.persona_id,
                                rowType: oItem.rowType
                            }, oReading);

                            aDataToExport.push(oRow);
                        }
                    }
                }
            }

            if (aDataToExport.length > 0) {
                // Convert dates in the data before creating columns
                // var dateFieldsToConvert = ["DATE", "RETIREMENT_DATE"];

                // aDataToExport.forEach(function(oRow) {
                //     dateFieldsToConvert.forEach(function(sDateField) {
                //         if (oRow[sDateField]) {
                //             var originalDate = oRow[sDateField];
                //             var convertedDate = convertDateFormat(originalDate);
                //             oRow[sDateField] = convertedDate;
                //         }
                //     });
                // }); // 2024-04-01

                aCols = that.createColumnConfig(oCMLTable);

                /**
                 * Function to export the data to Excel
                 */
                var fnExport = function () {
                    oSettings = {
                        workbook: {
                            columns: aCols,
                            hierarchyLevel: "Level"
                        },
                        dataSource: aDataToExport,
                        fileName: sFileName,
                        worker: false // We need to disable worker because we are using a MockServer as OData Service
                    };

                    oSheet = new Spreadsheet(oSettings);
                    oSheet.build().finally(function () {
                        oSheet.destroy();
                    });
                }

                var aObjectIds = [];

                aDataToExport.forEach(function (oData) {
                    if(!aObjectIds.includes(oData.objectId)) {
                        aObjectIds.push(oData.objectId);
                    }
                });

                that.CMLDataSource.bulkFetchObjectParent(aObjectIds, function (aObjectParent) {
                    var oObjectParent = {};

                    aObjectParent.forEach(function (oItem) {
                        oObjectParent[oItem.objectId] = oItem;
                    });

                    aDataToExport.forEach(function (oData) {
                        var oParent = oObjectParent[oData.objectId];

                        if (oParent) {
                            oData.parentName = oParent.parentName || "";
                            oData.functionalLocationName = oParent.functionalLocationName || "";
                        } else {
                            oData.parentName = "";
                            oData.functionalLocationName = "";
                        }
                    });

                    fnExport();
                }, function () {
                    fnExport();
                });
            } else {
                this.fnMessageShow("I", oMessageBundle.getText("CML.MESSAGE013"));
            }
        },

        /**
         * Function to create a column for Excel Export
         * 
         * @param {Object} oCMLTable - CML Table Control
         * @returns {Array} aCols - Array of Column with UOM
         */
        createColumnConfig: function (oCMLTable) {
            var aTableColumn = oCMLTable.getColumns();
            var aCols = []; 
            var aNumericCols = ["TMIN", "READING", "SHORT_TERM_CORROSION_RATE", "LONG_TERM_CORROSION_RATE", "HALF_LIFE"];

            aTableColumn.forEach(function (oColumn) {
                var oMetadata = oColumn.data("p13nSettings").metadata;

                if(oMetadata && oColumn.getVisible()) {
                    if(oMetadata.path === "objectName") {
                        aCols.push({
                            label: "Functional Location",
                            property: "functionalLocationName",
                            type: EdmType.String
                        });
                        aCols.push({
                            label: "Parent",
                            property: "parentName",
                            type: EdmType.String
                        });
                        aCols.push({
                            label: "Object Name",
                            property: "exportObjectName",
                            type: EdmType.String
                        });
                        aCols.push({
                            label: "Object Type",
                            property: "exportObjectType",
                            type: EdmType.String
                        });
                    } else {
                        aCols.push({
                            label: oColumn.getLabel().getText(),
                            property: oMetadata.path,
                            type: aNumericCols.includes(oMetadata.path) ? EdmType.Number : EdmType.String
                        });
                    }
                }
            });

            // aCols.push({
            //     label: "Object Name",
            //     property: "exportObjectName",
            //     type: EdmType.String
            // });

            // aCols.push({
            //     label: "Object Type",
            //     property: "exportObjectType",
            //     type: EdmType.String
            // });

            // // aCols.push({
            // //     label: sObjectType + " Description",
            // //     property: "objectDesc",
            // //     type: EdmType.String
            // // });

            // aCols.push({
            //     label: "CML Name",
            //     property: "cmlName",
            //     type: EdmType.String
            // });

            // aCols.push({
            //     label: "CML Description",
            //     property: "cmlDescription",
            //     type: EdmType.String
            // });

            // aCols.push({
            //     label: "CML Template",
            //     property: "cmlTemplateName",
            //     type: EdmType.String
            // });

            // aCols.push({
            //     label: "Date",
            //     property: "DATE",
            //     type: EdmType.String
            // });

            // aCols.push({
            //     label: "Tmin " + (sUOM === "metric" ? "(mm)" : "(in)"),
            //     property: "TMIN",
            //     type: EdmType.Number
            // });

            // aCols.push({
            //     label: "Reading " + (sUOM === "metric" ? "(mm)" : "(in)"),
            //     property: "READING",
            //     type: EdmType.Number
            // });

            // aCols.push({
            //     label: "Short Term Corrosion Rate " + (sUOM === "metric" ? "(mm/year)" : "(in/year)"),
            //     property: "SHORT_TERM_CORROSION_RATE",
            //     type: EdmType.Number
            // });

            // aCols.push({
            //     label: "Long Term Corrosion Rate " + (sUOM === "metric" ? "(mm/year)" : "(in/year)"),
            //     property: "LONG_TERM_CORROSION_RATE",
            //     type: EdmType.Number
            // });

            // aCols.push({
            //     label: "Half Life (years)",
            //     property: "HALF_LIFE",
            //     type: EdmType.Number
            // });

            // aCols.push({
            //     label: "Retirement Date",
            //     property: "RETIREMENT_DATE",
            //     type: EdmType.String
            // });

            return aCols;       
        },

        /**
         * Event handler for CML Copy Paste button triggered based on user select
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onPressDuplicateCML: function (oEvent) {
            var that = this;
            var sSelected = oEvent.getSource().getProperty("key");
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var selectedItems = oCommonCMLModel.getProperty("/data/detailPage/copyPaste/selectedObject");
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
            oCommonCMLModel.setProperty("/data/detailPage/copyPasteData", selectedItems);
            switch (sSelected) {
            case "Same Object":
                if (selectedItems.length == 0) {
                    return sap.m.MessageToast.show("Please select atleast one CML");
                }
                if (selectedItems.length > 1) {
                    sap.m.MessageToast.show("Only one CML can be duplicated within the same asset");
                } else {
                    that.fnOpenEditNamedescSameAsset(selectedItems);
                }
                break;
            case "Different Object":
                if (selectedItems.length == 0) {
                    return sap.m.MessageToast.show("Please select atleast one CML");
                }
                if (!oStorage.isSupported()) {
                    return sap.m.MessageToast.show("Cannot clone the CML(s), session storage not supported");
                }
                oStorage.clear();
                oStorage.put("selectedCMLData", selectedItems);
                that.fnMessageShow("S", "Selected CML(s) copied successfully and can be pasted to the current browser tab only");
                oCommonCMLModel.setProperty("/data/detailPage/copyPaste/visible/pasteButton", false);
                // that.fnOpenEditNamedescDiffAsset(selectedItems);

                break;
            case "Paste":
                if (!oStorage.isSupported()) {
                    return sap.m.MessageToast.show("Cannot clone the CML(s), session storage not supported");
                }
                var selectedCMLData = oStorage.get("selectedCMLData");
                if (selectedCMLData && selectedCMLData.length > 0) {
                    that.fnOpenEditNamedescDiffAsset(selectedCMLData);
                    // that.fnPasteCMLinDiffEqu(selectedCMLData);
                } else {
                    sap.m.MessageToast.show("Insufficient data to paste");
                }
                break;
            }
            that.byId("idAsintCMLOverallReading").clearSelection();
            //that.byId('idAsintCopyPasteCheckbox').setSelected(false);
        },

        /**
         * Prepares payload data for duplicating CML
         * 
         * Stores the new CML details and readings in session storage
         * Updates the model and triggers data retrieval to reflect the new CML details.
         * 
         * @param {Object} CMLdetails - The details of the CML to be duplicated.
         */
        fnGetPayloadToDuplicateCML: function (CMLdetails) {
            var that = this;
            var oModel = that.getView().getModel("mCMLModel");
            var CMLdetail = JSON.parse(JSON.stringify(CMLdetails));
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
            var selectedCMLData = oStorage.get("selectedCMLData");
            // var oModel = that.getView().getModel("objectDataModel");
            // var sURL = "/asint/idms/v1/reference/" + oModel.getData().equipmentId + "/location/" + CMLdetails.locationId +
            // 	"/datasource/value?referenceType=EQU";
            // that.getData({
            // 	"url": sURL,
            // 	"isAsync": false,
            // 	"payload": null,
            // 	"showErrorMessage": false,
            // 	"showBusyIndicator": false,
            // 	"success": function (aDataSourceValues) {
            // 		var obj = {
            // 			CMLData: CMLdetails,
            // 			CMLPayloadToSave: aDataSourceValues
            // 		};
            // 		if (selectedCMLData && selectedCMLData.length > 0) {
            // 			selectedCMLData.push(obj);
            // 			oStorage.put("selectedCMLData", selectedCMLData);
            // 		} else {
            // 			selectedCMLData = [];
            // 			selectedCMLData.push(obj);
            // 			oStorage.put("selectedCMLData", selectedCMLData);
            // 		}
            // 	},
            // 	"error": function (oError) {

            // 	}
            // });
            var cDate = new Date(),
                date = new Date(Formatter.fnGetUIDate(cDate)).getTime();
            // var sLocationId = Math.random().toString(36).slice(2).toLowerCase() + Math.floor(Math.random() * 100) + "-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.random().toString(36).slice(2).toLowerCase() + Math.floor(Math.random() * 10);
            var oCMLDetail = {
                // "locationId": sLocationId,
                "equipmentId": CMLdetail.objectId,
                "equipmentVersion": "4",
                "objectType": CMLdetail.objectType,
                "locationTemplateId": CMLdetail.locationTemplateId,
                "name": CMLdetail.name + "(1)",
                "description": CMLdetail.locDesc,
                "personaId": "b04b0de3-abfd-4c78-8b0d-e3abfd5c78c7",
                "deactivated": false,
                "deleted": false,
                "createdBy": "raunak.agarwal@asint.net",
                "createdOn": Formatter.fnGetUIDate(cDate),
                "changedBy": "raunak.agarwal@asint.net",
                "changedOn": Formatter.fnGetUIDate(cDate),
                "type": "new"
            }
            // eslint-disable-next-line no-redeclare
            var date = new Date(),
                format = "yy-mm-dd",
                sMonth = "";
            if ((date.getMonth() + 1) < 10) {
                sMonth = "0" + (date.getMonth() + 1);
            } else {
                sMonth = (date.getMonth() + 1);
            }
            var SFormatedDate = format.replace("mm", sMonth)
                .replace("yy", date.getFullYear())
                .replace("dd", date.getDate());
            var aCMLReading = {
                "dataId": null,
                // "locationId": sLocationId,
                "equipmentId": CMLdetail.objectId,
                "objectType": CMLdetail.objectType,
                "propertyName": "READINGS",
                "propertyValue": "{\"value\":{\"TMIN\":0,\"DATE\":\"" + SFormatedDate + "\",\"READING\":0,\"SHORT_TERM_CORROSION_RATE\":0,\"LONG_TERM_CORROSION_RATE\":0,\"REMAINING_LIFE\":0,\"RETIREMENT_DATE\":\"" + SFormatedDate + "\",\"HALF_LIFE\":0}}",
                "referenceId": "4C6404A090E34105A31BDD28233AC9B2",
                "referenceType": CMLdetail.sObjType,
                "posted": true,
                "validationDone": false,
                "createdBy": "devops@asint.net",
                "createdOn": SFormatedDate,
                "changedBy": "devops@asint.net",
                "changedOn": SFormatedDate,
                "deleted": false,
                "ignored": false,
                "type": "new"
            };

            selectedCMLData.push(oCMLDetail);
            oStorage.put("selectedCMLData", selectedCMLData);
            oStorage.put("selectedCMLDataReadings", [aCMLReading]);
            //oModel.setProperty("/data/copyDiffEquip", selectedCMLData);
            //oModel.setProperty("/data/copyDiffEquipReadings", [aCMLReading]);
            that.fnGetData(that);
            oModel.setProperty("/data/detailPage/hasNewCML", true);
        },

        /**
         * Function to open a dialog with the Copied CML
         * 
         * @param {Array} selectedItems - Selected(Copied) CMLs list
         */
        fnOpenEditNamedescSameAsset: function (selectedItems) {
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var oSelCMLObj;
            if (selectedItems && selectedItems.length > 0) {
                oSelCMLObj = selectedItems[0];
            }
            if (oSelCMLObj) {
                oCommonCMLModel.setProperty("/data/detailPage/copyPaste/sameAssestEdit/name", oSelCMLObj.cmlName);
                // if(oSelCMLObj.to_description && oSelCMLObj.to_description.length > 0){
                // 	var currentDesc = oSelCMLObj.to_description[0].shortDescription ? oSelCMLObj.to_description[0].shortDescription : "";
                // 	oCommonCMLModel.setProperty("/data/detailPage/copyPaste/sameAssestEdit/desc", currentDesc);
                // }
                oCommonCMLModel.setProperty("/data/detailPage/copyPaste/sameAssestEdit/desc", oSelCMLObj.cmlDescription);
            }
            if (!this._oDailogEditNameSameAsset) {
                Fragment.load({
                    id: "idEditNameSameAsset",
                    name: "com.asint.ais.mi.cml.view.fragment.DialogEditNameDescSameAssest",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDailogEditNameSameAsset = oDialog;
                    this._oDailogEditNameSameAsset.open();
                }.bind(this));
            } else {
                this._oDailogEditNameSameAsset.open();
            }
        },

        /**
         * Function to show the Remaining text for Text Area
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onTextAreaLiveChange: function () {
            var oTextArea = sap.ui.core.Fragment.byId("idEditNameSameAsset", "idCMLEditDesc");
            this.fnSetTextAreaRemainingText(oTextArea);
        },

        /**
         * This function retrieves the text area from the fragment by its ID and 
         * then calls another function to set the remaining character count
         */
        fnSetTextAreaCount: function () {
            var oTextArea = sap.ui.core.Fragment.byId("idEditNameSameAsset", "idCMLEditDesc");
            this.fnSetTextAreaRemainingText(oTextArea);
        },

        /**
         * Handles saving changes to the 'Edit Name Same Asset' dialog
         * 
         * This function performs validation on the new name and description, checks for duplicates,
         * and triggers further actions if validation passes.
         */
        onSaveEditNameSameAsset: function () {
            var that = this;
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var selectedItems = oCommonCMLModel.getProperty("/data/detailPage/copyPasteData");
            var newNameDesc = oCommonCMLModel.getProperty("/data/detailPage/copyPaste/sameAssestEdit");
            var aTable = this.getView().byId("idAsintCMLOverallReading");
            if (newNameDesc.name && newNameDesc.desc) {
                if (newNameDesc.desc.length > 500) {
                    that.fnMessageShow("E", "Description length shouldn't exceed 500");
                    return;
                }
                that.fnCheckForDuplicateLocationDescription([newNameDesc.name], function (isDuplicate, aDuplicateList) {
                    if (isDuplicate && aDuplicateList.length > 0) {
                        that.fnMessageShow("E", "CML with same name already exist");
                        return;
                    } else {
                        that.onCancelEditNameSameAsset();
                        that.fnDuplicateinSameEqu(selectedItems);
                    }
                    aTable.clearSelection();
                });
            } else {
                that.fnMessageShow("E", "Please fill all mandatory fields");
            }
        },

        /**
         * Closes the 'Edit Name Same Asset' dialog if it is open.
         */
        onCancelEditNameSameAsset: function () {
            if (this._oDailogEditNameSameAsset) {
                this._oDailogEditNameSameAsset.close();
            }
        },

        /**
         * Duplicates CML entries in the same equipment or location based on the selected items and new name/description values.
         * @param {Array} selectedItems - List of selected items to duplicate.
         */
        fnDuplicateinSameEqu: function (selectedItems) {
            var that = this;
            var oModel = that.getView().getModel("mCMLModel");
            var newNameDesc = oModel.getProperty("/data/detailPage/copyPaste/sameAssestEdit");
            var oSelCMLObj = selectedItems[0];
            var oFeatureFlag = oModel.getProperty("/metaData/featureFlag");
            
            var oNewPayload = {
                "objectId": oSelCMLObj.objectId,
                "objectType": oSelCMLObj.exportObjectType === "Equipment" ? "EQUI" : (oSelCMLObj.exportObjectType === "Functional Location" ? "FLOC" : oSelCMLObj.exportObjectType),
                "cmlTemplateId": oSelCMLObj.locationTemplateId,
                "active": true,
                "name": newNameDesc.name,
                "persona_id": oSelCMLObj.persona_id,
                "deleted": false,
                "to_description": [{ "shortDescription": newNameDesc.desc, "longDescription": "", "language": "en"}]
            };
            if (oNewPayload.objectType == "EQP" || oNewPayload.objectType == "EQUI") {
                var eqArr = [{
                    "equipment_ID": oNewPayload.objectId
                }];
                oNewPayload["to_equipment"] = eqArr;
            } else if (oNewPayload.objectType == "FL" || oNewPayload.objectType == "FLOC") {
                var flArr = [{
                    "functionalLocation_ID": oNewPayload.objectId
                }];
                oNewPayload["to_location"] = flArr;
            }else {
                that.fnMessageShow("E", that.oI18n.getText("asint.cml.detailPage.cloneCml.error.message001"));
                return;
            }

            if (oFeatureFlag.cmlEnableCopyAssetWithBgInfo === "1"){
                
                var aFullCMLs = oModel.getProperty("/data/detailPage/aCMLs") || [];
                var oFullCML = aFullCMLs.find(function (item) {
                    return item.ID === oSelCMLObj.locationId;
                });

                /**
                 * converts to base64 value
                 * @param {Object} oValue 
                 * @returns 
                 */
                var fnEncode = function (oValue) {

                    if (oValue === null || oValue === undefined || oValue === "") {
                        return "";
                    }
                    /**
                     * 
                     */
                    var isBase64 = function (str) {
                        try {
                            return btoa(atob(str)) === str;
                        } catch (e) {
                            return false;
                        }
                    };

                    if (typeof oValue === "string" && isBase64(oValue)) {
                        return oValue;
                    }

                    var parsed = null;

                    try {
                        parsed = JSON.parse(oValue);
                    } catch (error) {}

                    if (parsed && typeof parsed === "object") {
                        return btoa(JSON.stringify(parsed));
                    }

                    if (typeof oValue === "object") {
                        return btoa(JSON.stringify(oValue));
                    }

                    return btoa(String(oValue));
                };
            
                if (oFullCML && oFullCML.to_values && Array.isArray(oFullCML.to_values)) {
                    var aValues = oFullCML.to_values
                        .filter(function (item) {
                            var name = item.dataSourcename || "";
                            return !name.includes("READING") && !name.includes("HALF_LIFE") && !name.includes("CALCULATED_TMIN");
                        })
                        .map(function (item) {
                            var oVal = Object.assign({}, item);

                            delete oVal.ID;
                            delete oVal.cml_ID;
                            delete oVal.createdAt;
                            delete oVal.createdBy;
                            delete oVal.modifiedAt;
                            delete oVal.modifiedBy;
                            
                            oVal.dataSourceValue = fnEncode(oVal.dataSourceValue);
                            return oVal;
                        });

                    oNewPayload["to_values"] = aValues;
                }
            }
            that.fnDoCreateCMLOperation(oNewPayload, "Single");
        },

        /**
         * Checks for duplicate location descriptions by validating CML names.
         * @param {Array} aCMLName - Array of CML names to check for duplicates.
         * @param {Function} fnSuccess - Callback function executed upon successful validation.
         */
        fnCheckForDuplicateLocationDescription: function (aCMLName, fnSuccess) {

            var oModel = this.getView().getModel("mCMLModel");

            this.CMLHelper.fnValidateCMLName(aCMLName, oModel, "detailPage", function (oResponse, aDuplicateList) {
                fnSuccess(oResponse, aDuplicateList);
            });

        },

        /**
         * Creates a CML entry and handles the response.
         * @param {Object} oPayload - Data payload for the CML entry.
         * @param {String} sText - Type of operation (e.g., "Single").
         * @param {Function} [fnCallback] - Optional callback function to execute upon success or failure.
         */
        fnDoCreateCMLOperation: function (oPayload, sText, fnCallback) {
            var that = this;
            var curObjectId = that._sObjectId;
            var curObjType = that._sObjectType;

            oPayload = that.setCreatedModified(oPayload, "POST");

            that.CMLDataSource.createCML(oPayload, function (oData) {
                if (sText == "Single") {
                    that.fnMessageShow("S", "The CML definition was cloned, the readings were not cloned. \nPlease review the new CML definition data for any changes required", "", function () {
                        that.fnGetData(curObjType, curObjectId);
                    });
                } else {
                    if (fnCallback) {
                        fnCallback(oData);
                    }
                }
            }, function (oError) {
                if (sText == "Single") {
                    that.fnMessageShow("E", "Something went wrong, failed to clone", oError);
                } else {
                    if (fnCallback) {
                        fnCallback(oData);
                    }
                }
            });
        },

        /**
         * Opens the dialog for editing names and descriptions of different assets.
         * 
         * This function processes the selected items by copying their data into a new array,
         * updates the model with this data, and sets the table header based on the number of items.
         * If the dialog is not already created, it loads the dialog fragment and opens it.
         * If the dialog already exists, it simply opens the dialog.
         *
         * @param {Array} selectedItems - An array of items to be edited. Each item is expected to be an object with asset details.
         */
        fnOpenEditNamedescDiffAsset: function (selectedItems) {
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var aFinalList = [];
            if (selectedItems && selectedItems.length > 0) {
                selectedItems.forEach(function (oCML) {
                    var oTemp = Object.assign({}, oCML);
                    // oTemp["shortDescription"] = "";
                    // if(oCML.to_description && oCML.to_description.length > 0){
                    // 	var currentDesc = oCML.to_description[0].shortDescription ? oCML.to_description[0].shortDescription : "";
                    // 	oTemp.shortDescription = currentDesc;
                    // }
                    aFinalList.push(oTemp);
                });
            }
            oCommonCMLModel.setProperty("/data/detailPage/copyPaste/diffAssetEdit/rowsData", aFinalList);
            var sHeader = "CML(s) to paste (" + aFinalList.length + ")";
            oCommonCMLModel.setProperty("/data/detailPage/copyPaste/diffAssetEdit/tableHeader", sHeader);
            if (!this._oDailogEditNameDifferentAsset) {
                Fragment.load({
                    id: "idEditNameSameAsset",
                    name: "com.asint.ais.mi.cml.view.fragment.DialogEditNameDifferentAsset",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDailogEditNameDifferentAsset = oDialog;
                    this._oDailogEditNameDifferentAsset.open();
                }.bind(this));
            } else {
                this._oDailogEditNameDifferentAsset.open();
            }
        },

        /**
         * Handles the cancellation of editing a name for a different asset. Closes the dialog if it is open.
         */
        onCancelEditNameDifferentAsset: function () {
            if (this._oDailogEditNameDifferentAsset) {
                this._oDailogEditNameDifferentAsset.close();
            }
        },

        /**
         * This function validates the data in the rows of the edit dialog, checks for duplicates, and provides the validation results. 
         * It updates the model and performs further actions if validation is successful
         */
        onSaveEditNameDifferentAsset: function () {
            var that = this;
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var rowsData = oCommonCMLModel.getProperty("/data/detailPage/copyPaste/diffAssetEdit/rowsData");
            var sDuplicate = "";
            var aCMLName = [];
            var iLengthExceed = 0;
            var iInvalid = 0;
            var iValid = 0;
            var aTable = this.getView().byId("idAsintCMLOverallReading");
            if (rowsData && rowsData.length > 0) {
                rowsData.forEach(function (oCML) {
                    if (oCML.cmlName && oCML.cmlDescription) {
                        if (oCML.cmlDescription.length > 500) {
                            iLengthExceed++;
                        }
                        aCMLName.push(oCML.cmlName);
                        iValid++;
                    } else {
                        isInValid = true;
                        iInvalid++;
                    }
                });

                if ((rowsData.length === iValid) && (iInvalid === 0) && (iLengthExceed === 0)) {
                    that.fnCheckForDuplicateLocationDescription(aCMLName, function (isDuplicate, aDuplicateList) {
                        if (isDuplicate) {
                            var aTemp = [];
                            aDuplicateList.forEach(function (oItem) {
                                var oContext = rowsData.find(function (oList) {
                                    return oList.cmlName === oItem.name;
                                });

                                if (!aTemp.includes(oContext.locationId)) {
                                    aTemp.push(oContext.locationId);
                                    if (sDuplicate) {
                                        sDuplicate += ",";
                                    } else {
                                        sDuplicate = "";
                                    }

                                    sDuplicate += oContext.cmlName + " - " + oContext.cmlDescription;
                                }
                            });
                            that.fnMessageShow("E", "CML with same name and description already exist. Please check below CML(s). \n" + sDuplicate);
                        } else {
                            that.onCancelEditNameDifferentAsset();
                            that.fnPasteCMLinDiffEqu(rowsData);
                        }
                        aTable.clearSelection();
                    });
                } else if (iInvalid > 0) {
                    that.fnMessageShow("E", "Name and description cannot be blank. Please check the table.");
                } else if (iLengthExceed > 0) {
                    that.fnMessageShow("E", "Description length shouldn't exceed 500. Please check the table.");
                }

            } else {
                that.fnMessageShow("E", "Please select CML(s)");
            }
        },

        /**
         * This function removes the CML item at the index determined by the event source's binding context 
         * from the "rowsData" array and updates the model with the modified list. 
         * It also updates the table header to reflect the new number of CML items remaining.
         * 
         * @param {*} oEvent 
         */
        onDeleteCMLfromPaste: function (oEvent) {
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var sPath = oEvent.getSource().getBindingContext("mCMLModel").sPath;
            var sInex = sPath.split("/")[6];
            var iIndex = parseInt(sInex);
            var rowsData = oCommonCMLModel.getProperty("/data/detailPage/copyPaste/diffAssetEdit/rowsData");
            rowsData.splice(iIndex, 1);
            oCommonCMLModel.setProperty("/data/detailPage/copyPaste/diffAssetEdit/rowsData", rowsData);
            var sHeader = "CML(s) to paste (" + rowsData.length + ")";
            oCommonCMLModel.setProperty("/data/detailPage/copyPaste/diffAssetEdit/tableHeader", sHeader);
        },

        /**
         * Validates if the current CML template ID exists within a collection of CML templates for a given object type.
         * 
         * This function retrieves the CML template collection based on the object type and ID, then checks 
         * if the current CML template ID is present in the collection. 
         * @param {String} sObjId - The ID of the object (Equipment or Functional Location) for which to check CML templates.
         * @param {String} sObjType - The type of the object, either "EQUI" for Equipment or another type for Functional Location.
         * @param {String} sCurCMLTemplateId - The CML template ID to be validated.
         * @param {Function} fnCallBack - Callback function to be called with a boolean indicating if the template ID was found.
         */
        fnValidateCmlTemplateIdwithObj: function (sObjId, sObjType, sCurCMLTemplateId, fnCallBack) {
            var that = this;
            /**
             * Validate CML Template of Copied CML
             * @param {Array} aCollection 
             */
            var fnCheckForCMLTemplate = function (aCollection) {
                var isFound = false;
                if (aCollection && aCollection.length > 0) {
                    aCollection.forEach(function (oCML) {
                        var curCML = oCML.cmlCollection;
                        if (curCML) {
                            var aCMLTemplates = curCML.to_cml_template;
                            if (aCMLTemplates && aCMLTemplates.length > 0) {
                                aCMLTemplates.forEach(function (oTemp) {
                                    var oLocTemplate = oTemp.cmlLocationTemplate;
                                    if (oLocTemplate && oLocTemplate.id == sCurCMLTemplateId) {
                                        isFound = true;
                                    }
                                })
                            }
                        }
                    });
                }
                fnCallBack(isFound);
            };
            if (sObjType == "EQUI") {
                that.CMLDataSource.getCMLCollectionExpandTemplatesByEquipment(sObjId, function (oData) {
                    var aCollection = oData.to_cml_template_collection;
                    if (aCollection && aCollection.length > 0) {
                        fnCheckForCMLTemplate(aCollection);
                    } else {
                        fnCallBack(false);
                    }
                }, function () {
                    fnCallBack(false);
                });
            } else {
                that.CMLDataSource.getCMLCollectionExpandTemplatesByFunctionalLocation(sObjId, function (oData) {
                    var aCollection = oData.to_cml_template_collection;
                    if (aCollection && aCollection.length > 0) {
                        fnCheckForCMLTemplate(aCollection);
                    } else {
                        fnCallBack(false);
                    }
                }, function () {
                    fnCallBack(false);
                });
            }
        },

        /**
         * Pastes CML data into a different equipment and handles the cloning process.
         * 
         * @param {Object} CMLData - Array of CML data objects to be pasted.
         */
        fnPasteCMLinDiffEqu: function (CMLData) {
            CMLData = JSON.parse(JSON.stringify(CMLData));
            var that = this;
            var oModel = that.getView().getModel("mCMLModel");
            var curObjectId = that._sObjectId;
            var curObjType = that._sObjectType;
            var aFailedCMLs = [];
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);

            /**
             * Function throw the Success and Error message
             */
            var fnSuccessCallBack = function () {
                if (aFailedCMLs.length > 0) {
                    var sMessage = "";
                    aFailedCMLs.forEach(function (oCML) {
                        if (sMessage) {
                            sMessage = sMessage + "," + oCML.cmlName;
                        } else {
                            sMessage = oCML.cmlName;
                        }
                    });
                    if (aFailedCMLs.length == CMLData.length) {
                        that.fnMessageShow("E", "Failed to clone. Required CML Templates are not present");
                    } else {
                        that.fnMessageShow("E", "Failed to clone few CML(s), Only definitions of few CML(s) were cloned the readings were not cloned.\nPlease review the new CML definition data for any changes required", "Failed to clone below CML(s):\n" + sMessage, function () {
                            that.fnGetData(curObjType, curObjectId);
                        });
                    }
                } else {
                    that.fnMessageShow("S", "The CML definition of the selected CML(s) were cloned, the readings were not cloned. \nPlease review the new CML definition data for any changes required", "", function () {
                        that.fnGetData(curObjType, curObjectId);
                    });
                    oStorage.remove("selectedCMLData");
                    oModel.setProperty("/data/detailPage/copyPaste/visible/pasteButton", false);
                }
            };
            var curIndex = 0;

            /**
             * Loop the Copied CML for Validation and Paste(Create)
             * @param {Integer} iIndex 
             */
            var fnLoopCMLs = function (iIndex) {
                if (iIndex < CMLData.length) {
                    var oSelCMLObj = CMLData[iIndex];
                    that.fnValidateCmlTemplateIdwithObj(curObjectId, curObjType, oSelCMLObj.locationTemplateId, function (isValid) {
                        if (isValid) {
                            var oNewPayload = {
                                "objectId": curObjectId,
                                "objectType": curObjType,
                                "cmlTemplateId": oSelCMLObj.locationTemplateId,
                                "active": true,
                                "name": "",
                                "persona_id": oSelCMLObj.persona_id,
                                "deleted": false,
                                "to_description": [{ "shortDescription": "", "longDescription": "", "language":"en" }]
                            };
                            if (oNewPayload.objectType == "EQP" || oNewPayload.objectType == "EQUI") {
                                var eqArr = [{
                                    "equipment_ID": oNewPayload.objectId
                                }];
                                oNewPayload["to_equipment"] = eqArr;
                            } else {
                                var flArr = [{
                                    "functionalLocation_ID": sObjectId
                                }];
                                oNewPayload["to_location"] = flArr;
                            }
                            oNewPayload.name = oSelCMLObj.cmlName;
                            oNewPayload.to_description[0].shortDescription = oSelCMLObj.cmlDescription;
                            oNewPayload.to_description[0].longDescription = "";
                            that.fnDoCreateCMLOperation(oNewPayload, "", function () {
                                curIndex = curIndex + 1;
                                if (curIndex == CMLData.length) {
                                    fnSuccessCallBack();
                                }
                                fnLoopCMLs(curIndex);
                            });
                        } else {
                            aFailedCMLs.push(oSelCMLObj);
                            curIndex = curIndex + 1;
                            if (curIndex == CMLData.length) {
                                fnSuccessCallBack();
                            }
                            fnLoopCMLs(curIndex);
                        }
                    }, function () {
                        aFailedCMLs.push(oSelCMLObj);
                        curIndex = curIndex + 1;
                        if (curIndex == CMLData.length) {
                            fnSuccessCallBack();
                        }
                        fnLoopCMLs(curIndex);
                    });
                }
            }

            if (CMLData && CMLData.length > 0) {
                fnLoopCMLs(0);
            }
        },

        /**
         * Handles the event when a CML item is pressed
         * 
         * Retrieves the selected CML data from the binding context of the event
         * Initializes the location controller with the selected CML data.
         * Updates the layout to "TwoColumnsMidExpanded"
         * 
         * @param {Object} oEvent - The event object for the press action
         */
        onPressCML: function (oEvent) {
            // var that = this;
            var oTag = oEvent.getSource();
            var oContext = oTag.getBindingContext("mCMLModel");
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var sPath;
            if (!oContext) {
                return;
            }
            if(oContext){
                sPath = oContext.getPath();
            } else {
                sPath = oEvent.getParameters().row.getBindingContext("mCMLModel").sPath;     
            } 
            var oSelectedData = oCommonCMLModel.getProperty(sPath); 
            // Below function helps to render the CML Template Config Tabs
            oCommonCMLModel.setProperty("/data/detailPage/detailSelectedCML", oSelectedData);
            this._LocationController.fnInitialize(this, oCommonCMLModel, oSelectedData);

            oCommonCMLModel.setProperty("/data/detailPage/layout", "TwoColumnsMidExpanded");

            // Navigate to CML Detail Page
            var oNavContainer = this.getView().byId("idMidColumnNavContainer");
            if (oNavContainer) {
                oNavContainer.to(this.getView().byId("idCMLDetailPage"));
            }

        },

        /**
         * Handles the event for filtering by color detail
         * 
         * Removes the previous style class from the source element, Applies a new style class based on the selected item ID.
         * 
         * @param {*} oEvent - The event object for the filter action
         */
        onFilterbyColorDetail: function (oEvent) {

            var that = this;
            var sSegmentButton = "";
            var oCommonCMLModel = that.getOwnerComponent().getModel("mCMLModel");

            oEvent.getSource().removeStyleClass(oEvent.getSource().aCustomStyleClasses[0]);

            if (oEvent.getParameters().id.includes("idClearColor")) {
                that.getView().byId("selectColor").setSelectedKey("All");
                sSegmentButton = "All";
            } else if (oEvent.getParameters().selectedItem.sId.includes("idErrorColor")) {
                oEvent.getSource().addStyleClass("errorColor");
                sSegmentButton = "Danger";
            } else if (oEvent.getParameters().selectedItem.sId.includes("idGrowthColor")) {
                oEvent.getSource().addStyleClass("growthColor");
                sSegmentButton = "Warning";
            } else if (oEvent.getParameters().selectedItem.sId.includes("idNewColor")) {
                oEvent.getSource().addStyleClass("newColor");
                sSegmentButton = "Success";
            } else if (oEvent.getParameters().selectedItem.sId.includes("idtenPercentageTminColor")) {
                oEvent.getSource().addStyleClass("informationColor");
                sSegmentButton = "Information";
            } else if (oEvent.getParameters().selectedItem.sId.includes("idBaselineColor")) {
                oEvent.getSource().addStyleClass("baselineColor");
                sSegmentButton = "Baseline";
            } else {
                sSegmentButton = "All";
            }

            oCommonCMLModel.setProperty("/data/detailPage/sSegmentedButton", sSegmentButton);

        },

        /**
         * This function processes the selected rows in the table, distinguishing between "parentRow" and other types.
         * 
         * It updates the model with the selected items and their indices, and manages the 
         * visibility of a group based on whether any valid rows are selected.
         */
        onRowSelection: function () {

            var that = this;
            var oCommonCMLModel = that.getOwnerComponent().getModel("mCMLModel");
            var aTable = this.getView().byId("idAsintCMLOverallReading");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var aSelectedItems = [];
            var aSelectedIndex = aTable.getSelectedIndices();

            aSelectedIndex.forEach(function (oIndex) {
                var oContext = aTable.getContextByIndex(oIndex);
                var oData = oContext.getObject();
                if (oData && oData.rowType && oData.rowType === "parentRow") {
                    aSelectedItems.push(oData);
                } else {
                    that.fnMessageShow("I", oMessageBundle.getText("CML.MESSAGE021"));
                    aTable.removeSelectionInterval(oIndex, oIndex);
                }
            });

            // aTable.forEach(function (oItem) {
            //     if (oItem.getBindingContext("mCMLModel")) {
            //         var oSelObj = oItem.getBindingContext("mCMLModel").getObject();
            //         if (oSelObj.isSelected) {
            //             aSelectedItems.push(oSelObj);
            //         }
            //     }
            // });

            oCommonCMLModel.setProperty("/data/detailPage/copyPaste/selectedObject", aSelectedItems);
            oCommonCMLModel.setProperty("/data/detailPage/copyPaste/aSelectedIndex", aSelectedIndex);
            oCommonCMLModel.setProperty("/data/detailPage/moveAndPaste/selectedObject", aSelectedItems);

            if (aSelectedItems.length > 0) {
                oCommonCMLModel.setProperty("/data/detailPage/isGroupVisible", true);
                oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/enable/button", true);
            } else {
                oCommonCMLModel.setProperty("/data/detailPage/isGroupVisible", false);
                oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/enable/button", false);
            }

        },

        /**
         * This function updates the "categories" property of each object in "aCMLFinalList" by appending 
         * matching items from "aFilteredData" where the "objectId" matches. It then returns the updated "aCMLFinalList".
         * 
         * @param {Array} aCMLFinalList - The final list of objects containing a "categories" property which is an array of categories.
         * @param {Array} aFilteredData - An array of filtered data objects with "objectId" and category information to be added.
         * @returns {Object} The updated "aCMLFinalList" with categories set based on the filtered data.
         */
        fnSetCategoryforObject: function (aCMLFinalList, aFilteredData) {

            aCMLFinalList.categories.forEach(function (oList) {
                aFilteredData.forEach(function (oFilterData) {
                    if (oList.objectId === oFilterData.objectId) {
                        oList.categories.push(oFilterData);
                    }
                });
            });

            return aCMLFinalList;

        },

        /**
         * This function calls the "fnUoMConversion" method on the "CMLDataSource" object to perform the conversion.
         * It handles success and error scenarios by invoking the provided callback functions.
         * 
         * @param {Object} oData - The data required for the UoM conversion.
         * @param {Function} fnSuccess - Callback function to be called upon successful conversion.
         * @param {Function} fnError - Callback function to be called if an error occurs during conversion.
         */
        fnUoMConvert: function (oData, fnSuccess, fnError) {

            this.CMLDataSource.fnUoMConversion(oData, function (oDataRet) {
                return fnSuccess(oDataRet);
            }, function (oError) {
                return fnError(oError);
            });

        },

        /**
         * Formats a Date object into a string with the format YYYY-MM-DD.
         * @param {Date} sDate - The Date object to format.
         * @returns {String} The formatted date string.
         */
        fnGetUIDate: function (sDate) {

            var sDateFormat = sDate.getFullYear() + "-" + (sDate.getUTCMonth() + 1 < 10 ? "0" + (sDate.getUTCMonth() + 1) : sDate.getUTCMonth() + 1) + "-" + (sDate.getUTCDate() < 10 ? "0" + sDate.getUTCDate() : sDate.getUTCDate());
            return sDateFormat;

        },

        /**
         * Handles switching the view to full screen mode.
         */
        handleFullScreen: function () {

            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");

            oCommonCMLModel.setProperty("/metaData/CMLTabSection/exitFullScreen", true);
            oCommonCMLModel.setProperty("/metaData/CMLTabSection/viewFullScreen", false);
            oCommonCMLModel.setProperty("/data/detailPage/layout", "MidColumnFullScreen");

        },

        /**
         * Handles closing of the view and manages unsaved changes based on user roles.
         */
        handleClose: function () {

            var that = this;
            var oCommonCMLModel = that.getOwnerComponent().getModel("mCMLModel");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var oDataSource = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var oTempDataSource = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/oTempDataSource");
            var isUserEdit = oCommonCMLModel.getProperty("/data/userRoles/edit");

            if ((Object.keys(oTempDataSource).length > 0) && isUserEdit) {
                var oOldDataSource = JSON.parse(oTempDataSource);
                var oOriginalDS = JSON.parse(JSON.stringify(oDataSource));
                var oDSWithTempSourceKeys = {};
                Object.keys(oOldDataSource).forEach(function (sKey) {
                    oDSWithTempSourceKeys[sKey] = oOriginalDS[sKey];
                });
                Object.keys(oOriginalDS).forEach(function (sKey) {
                    if(oOriginalDS[sKey]){
                        oDSWithTempSourceKeys[sKey] = oOriginalDS[sKey];
                    }
                });
                if (JSON.stringify(oDSWithTempSourceKeys) === JSON.stringify(oOldDataSource)) {
                    oCommonCMLModel.setProperty("/metaData/CMLTabSection/exitFullScreen", false);
                    oCommonCMLModel.setProperty("/metaData/CMLTabSection/viewFullScreen", true);
                    oCommonCMLModel.setProperty("/data/detailPage/layout", "OneColumn");
                } else {
                    this.fnMessageShow("C", oMessageBundle.getText("CML.MESSAGE010"), null, function (sAction) {
                        if (sAction === "YES") {
                            oCommonCMLModel.setProperty("/data/detailPage/layout", "OneColumn");
                        }
                    });
                }
            } else {
                oCommonCMLModel.setProperty("/metaData/CMLTabSection/exitFullScreen", false);
                oCommonCMLModel.setProperty("/metaData/CMLTabSection/viewFullScreen", true);
                oCommonCMLModel.setProperty("/data/detailPage/layout", "OneColumn");
            }

        },

        /**
         * Handles the action to exit full-screen mode and revert to the two-column layout.
         * Changes the layout of the detail page to "TwoColumnsMidExpanded" to return to the standard view.
         */
        handleExitFullScreen: function () {

            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");

            oCommonCMLModel.setProperty("/metaData/CMLTabSection/exitFullScreen", false);
            oCommonCMLModel.setProperty("/metaData/CMLTabSection/viewFullScreen", true);
            oCommonCMLModel.setProperty("/data/detailPage/layout", "TwoColumnsMidExpanded");

        },

        /**
         * Handles the click on AI Recommendation icon and expands the third column.
         */
        onPressAIRecommendation: function () {
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var AIinsightvisiable = oCommonCMLModel.getProperty("/metaData/featureFlag/CmlAiInsight") === "1";

            if (AIinsightvisiable) {
                oCommonCMLModel.setProperty("/data/detailPage/layout", "TwoColumnsMidExpanded");
                var oNavContainer = this.getView().byId("idMidColumnNavContainer");
                if (oNavContainer) {
                    oNavContainer.to(this.getView().byId("idAIRecommendationPage"));
                }
                this.fnProcessAIWorkflow();
            }
        },

        /**
        * Refreshes or loads AI Insights
        */
        onRefreshInsights: function () {
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var AIinsightvisiable = oCommonCMLModel.getProperty("/metaData/featureFlag/CmlAiInsight") === "1";
            if (AIinsightvisiable) {
                this.fnProcessAIWorkflow();
            }
        },

        /**
        * Fetch API and make
        */
        fnProcessAIWorkflow: function () {
            var that = this;
            var oModel = this.getOwnerComponent().getModel("mCMLModel");
            var AIinsightvisiable = oModel.getProperty("/metaData/featureFlag/CmlAiInsight") === "1";
            var equipmentId = this._sObjectId;
            var techObjectId = this._sObjectId;
            var objectType = this._sObjectType;
            var iCount = 0;
            var oResults = { cml: null, asd: null };

            if (AIinsightvisiable) {
                sap.ui.core.BusyIndicator.show(0);
                function fnCheckAllDone() {
                    iCount++;
                    if (iCount < 2) {
                        return;
                    }

                    var bCmlHasData = oResults.cml && Array.isArray(oResults.cml.cmls) && oResults.cml.cmls.length > 0;
                    var bAsdHasData = oResults.asd && Object.keys(oResults.asd).length > 0;

                    if (bCmlHasData) {
                        var oPayload = {
                            "query": Object.assign({}, oResults.cml)
                        };
                        if (bAsdHasData) {
                            oPayload.query.asdData = oResults.asd;
                        }
                        oModel.setProperty("/data/combinedPayload", oPayload);
                        that.fnCallAIAPI(oPayload);
                    } else {
                        sap.ui.core.BusyIndicator.hide();
                        var sNoDataMsg = "";
                        if (bAsdHasData) {
                            sNoDataMsg = that.oI18n.getText("asint.cml.message.noProperCMLDataForAISuggestions");
                        } else {
                            sNoDataMsg = that.oI18n.getText("asint.cml.message.noProperDataForAISuggestions");
                        }
                        oModel.setProperty("/data/aiSections", [{
                            title: "AI Insights",
                            type: "text",
                            value: sNoDataMsg
                        }]);
                        oModel.refresh(true);
                    }
                }

                that.CMLDataSource.getAllCMLs(
                    equipmentId,
                    objectType,
                    function (oData) {
                        oResults.cml = oData;
                        fnCheckAllDone();
                    },
                    function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        that.fnMessageShow("E", that.oI18n.getText("asint.cml.message.failedToFetchCMLData"), oError);
                    }
                );

                that.CMLDataSource.getASDLatest(
                    techObjectId,
                    function (oData) {
                        oResults.asd = oData;
                        fnCheckAllDone();
                    },
                    function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        that.fnMessageShow("E", that.oI18n.getText("asint.cml.message.failedToFetchASDData"), oError);
                    }
                );
            }
        },

        /**
         * payload for AI API and fetch response
         */
        fnCallAIAPI: function (oPayload) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel("mCMLModel");
            var AIinsightvisiable = oModel.getProperty("/metaData/featureFlag/CmlAiInsight") === "1";
            if (AIinsightvisiable) {
                that.CMLDataSource.callAIAPI(
                    oPayload,

                    function (oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        var aSections = that.fnPrepareAISections(oResponse);
                        oModel.setProperty("/data/aiResponse", oResponse);
                        oModel.setProperty("/data/aiSections", aSections);
                        oModel.refresh(true);
                        sap.m.MessageToast.show(that.oI18n.getText("asint.cml.message.aiInsightsLoaded"));
                    },

                    function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        that.fnMessageShow("E", that.oI18n.getText("asint.cml.message.failedToFetchAIResponse"), oError);
                    }
                );
            }
        },

        /**
         * Prepares the AI recommendation sections dynamically from response data.
         */
        fnPrepareAISections: function (oResponse) {
            if (oResponse && oResponse.cmlSuggestions) {
                oResponse = oResponse.cmlSuggestions;
            }
            const fnFormatKey = function (sKey) {
                if (!sKey) {
                    return "";
                }
                var formatted = (sKey.charAt(0).toUpperCase() + sKey.slice(1))
                    .replace(/([A-Z])/g, " $1")
                    .replace(/_/g, " ");
                return formatted.replace(/C\s*M\s*L/gi, "CML")
                                .replace(/A\s*R\s*T/gi, "Aᵣ/t")
                                .replace(/\b[Aa]i\b/g, "AI");
            };

            const fnToKeyValueArray = function (oObj) {
                return Object.keys(oObj || {}).map(function (sKey) {
                    const vValue = oObj[sKey];
                    let sFormattedValue = "";

                    if (Array.isArray(vValue)) {
                        sFormattedValue = vValue.join(", ");
                    } else if (typeof vValue === "object" && vValue !== null) {
                        sFormattedValue = JSON.stringify(vValue);
                    } else {
                        sFormattedValue = vValue;
                    }

                    return {
                        key: fnFormatKey(sKey),
                        value: sFormattedValue
                    };
                });
            };

            const aSections = [];
            const oOverview = {};
            const aOrder = ["assetSummary", "optimizationSummary", "immediateActions", "midTermActions", "longTermActions", "cmlAnalysis"];
            const aKeys = Object.keys(oResponse || {});
            const aSortedKeys = aOrder.filter(k => aKeys.includes(k)).concat(aKeys.filter(k => !aOrder.includes(k)));

            aSortedKeys.forEach(function (sKey) {
                const oData = oResponse[sKey];

                if (oData && typeof oData === "object") {
                    const bIsArray = Array.isArray(oData);
                    const sType = bIsArray ? (!oData.length || typeof oData[0] === "string" ? "list" : "dynamicCards") : "object";
                    let aSectionData;

                    if (sType === "dynamicCards") {
                        aSectionData = oData.map(function (oItem) {
                            const { cmlName, name, ...oCopy } = oItem;
                            const sTitle = cmlName || name || "Item";
                            return {
                                title: sTitle,
                                data: fnToKeyValueArray(oCopy)
                            };
                        });
                    } else if (sType === "list") {
                        aSectionData = oData;
                    } else {
                        aSectionData = fnToKeyValueArray(oData);
                    }

                    aSections.push({
                        title: fnFormatKey(sKey),
                        type: sType,
                        data: aSectionData
                    });
                } else if (oData !== null && oData !== undefined) {
                    oOverview[sKey] = oData;
                }
            });

            if (Object.keys(oOverview).length > 0) {
                aSections.unshift({
                    title: this.oI18n.getText("asint.cml.detail.ai.recommendationOverview"),
                    type: "object",
                    data: fnToKeyValueArray(oOverview)
                });
            }
            return aSections;
        },

        /**
         * Factory function to dynamically render section items based on their type.
         */
        fnAISectionFactory: function (sId, oContext) {
            const fnDetermineSectionType = function (oCtx) {
                const aData = oCtx.getProperty("data");
                if (oCtx.getProperty("value") !== null && oCtx.getProperty("value") !== undefined) {
                    return "text";
                }
                if (!Array.isArray(aData)) {
                    return "object";
                }
                const vFirstItem = aData[0];
                if (!aData.length || typeof vFirstItem === "string") {
                    return "list";
                }
                if (typeof vFirstItem === "object" && vFirstItem && (vFirstItem.data || vFirstItem.title)) {
                    return "dynamicCards";
                }
                return "object";
            };

            const fnText = function (sText, sClass, oConfig) {
                return new sap.m.Text({
                    text: sText,
                    wrapping: true,
                    ...oConfig
                }).addStyleClass(sClass);
            };

            const fnCreateList = function (sPath, oTemplate) {
                return new sap.m.List({
                    showSeparators: "Inner",
                    items: {
                        path: sPath || "mCMLModel>data",
                        templateShareable: false,
                        template: oTemplate
                    }
                });
            };
            const fnCreateKeyValueList = sPath => new sap.m.List({
                showSeparators: "Inner",
                items: {
                    path: sPath || "mCMLModel>data",
                    templateShareable: false,
                    factory: function (sId, oCtx) {
                        const bGrid = (oCtx.getProperty("value") || "").length > 35;
                        return new sap.m.CustomListItem(sId, {
                            content: new sap.m.HBox({
                                justifyContent: "SpaceBetween",
                                alignItems: "Start",
                                width: "100%",
                                items: [
                                    fnText("{mCMLModel>key}", "aiKey"),
                                    fnText("{mCMLModel>value}", "aiValue", bGrid ? { textAlign: "Begin", width: "100%" } : { textAlign: "End" })
                                ]
                            }).addStyleClass(bGrid ? "aiRow aiRowGrid" : "aiRow")
                        });
                    }
                }
            });

            const sType = oContext.getProperty("type") || fnDetermineSectionType(oContext);
            let oContent;

            if (sType === "text") {
                oContent = new sap.m.VBox({
                    items: [fnText("{mCMLModel>value}", "aiValue")]
                }).addStyleClass("aiMarginTop");
            } else if (sType === "list") {
                oContent = fnCreateList("mCMLModel>data", new sap.m.CustomListItem({
                    content: fnText("{mCMLModel>}", "aiValue aiRow sapUiTinyMarginVertical", { width: "100%" })
                })).addStyleClass("aiMarginTop");
            } else if (sType === "dynamicCards") {
                oContent = new sap.m.VBox({
                    items: {
                        path: "mCMLModel>data",
                        templateShareable: false,
                        template: new sap.m.VBox({
                            items: [
                                new sap.m.Title({ text: "{mCMLModel>title}", level: "H5" }).addStyleClass("aiSubTitle"),
                                fnCreateKeyValueList("mCMLModel>data")
                            ]
                        }).addStyleClass("aiSection aiMarginBottom")
                    }
                }).addStyleClass("aiMarginTop");
            } else {
                oContent = new sap.m.VBox({
                    items: [fnCreateKeyValueList()]
                }).addStyleClass("aiMarginTop");
            }

            return new sap.m.CustomListItem(sId).addContent(
                new sap.m.VBox().addStyleClass("aiSection")
                    .addItem(new sap.m.Title({ text: "{mCMLModel>title}", level: "H4" }).addStyleClass("aiTitle"))
                    .addItem(oContent)
            );
        },

        /**
        * Function that closes AI recommendation column
        */
        handleCloseAi: function () {
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var AIinsightvisiable = oCommonCMLModel.getProperty("/metaData/featureFlag/CmlAiInsight") === "1";
            if (AIinsightvisiable) {
                oCommonCMLModel.setProperty("/data/detailPage/layout", "OneColumn");
            }
        },

        /**
         * Handles direct PDF generation with all dynamically prepared AI insights.
         */
        onDownloadPDF: function () {
            var that = this;
            var mModel = this.getView().getModel("mCMLModel");
            var oHeaderData = mModel.getProperty("/data/detailPage/headerData") || {};
            var sPdfFileName = oHeaderData.objectName || "CML_AI_Recommendation";
            var MessageBox = sap.m.MessageBox;

            var sConfirmMsg = this.oI18n.getText("asint.reco.export.confirm.message");
            var sSuccessMsg = this.oI18n.getText("asint.reco.export.success.message");
            var sTOCVal = this.oI18n.getText("asint.reusable.tableOfContent.text");
            var sLoadingText = this.oI18n.getText("asint.inspection.pdf.MESSAGE003", [sPdfFileName]);
            var AIinsightvisiable = mModel.getProperty("/metaData/featureFlag/CmlAiInsight") === "1";

            if (AIinsightvisiable) {
                MessageBox.confirm(
                    sConfirmMsg,
                    {
                        actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                        onClose: function (oAction) {
                            if (oAction !== MessageBox.Action.YES) {
                                return;
                            }

                            var buildPDFTable = function (aTableData) {
                                var aBody = [[
                                    { text: "Key", style: "tableHeader" },
                                    { text: "Value", style: "tableHeader" }
                                ]];

                                aTableData.forEach(function (oItem) {
                                    aBody.push([
                                        { text: oItem.key || "", style: "normal" },
                                        { text: oItem.value || "", style: "normal" }
                                    ]);
                                });

                                return {
                                    table: {
                                        headerRows: 1,
                                        widths: ["40%", "60%"],
                                        body: aBody
                                    },
                                    margin: [0, 5, 0, 10]
                                };
                            };

                            var oPdfConfig = {
                                content: [
                                    { text: that.oI18n.getText("asint.cml.detail.ai.reportTitle"), style: "header", margin: [0, 0, 0, 10] },
                                    { text: that.oI18n.getText("asint.cml.detail.ai.reportObject", [oHeaderData.objectName || "N/A"]), style: "normal", margin: [0, 5, 0, 5] },
                                    { text: that.oI18n.getText("asint.cml.detail.ai.reportDisplayId", [oHeaderData.displayId || "N/A"]), style: "normal", margin: [0, 5, 0, 5] },
                                    { text: that.oI18n.getText("asint.cml.detail.ai.reportObjectType", [oHeaderData.objectType || "N/A"]), style: "normal", margin: [0, 5, 0, 10] }
                                ],
                                styles: {
                                    header: { fontSize: 16, bold: true },
                                    subheader: { fontSize: 14, bold: true },
                                    tableHeader: { fontSize: 12, bold: true },
                                    normal: { fontSize: 10 },
                                    small: { fontSize: 8 }
                                }
                            };

                            if (that.busyDialog) {
                                that.busyDialog.open(sLoadingText);
                            } else {
                                sap.ui.core.BusyIndicator.show(0);
                            }

                            var aSections = mModel.getProperty("/data/aiSections") || [];
                            aSections.forEach(function (oSection, iIndex) {
                                var sType = oSection.type || that.AiSectionType(oSection.value, oSection.data);

                                oPdfConfig.content.push({
                                    text: oSection.title || "Section " + (iIndex + 1),
                                    style: "subheader",
                                    margin: [0, 10, 0, 5],
                                    tocItem: true
                                });

                                if (sType === "text" && oSection.value) {
                                    oPdfConfig.content.push({
                                        text: oSection.value,
                                        style: "normal",
                                        margin: [0, 5, 0, 5]
                                    });
                                } else if (sType === "object" && oSection.data) {
                                    oPdfConfig.content.push(buildPDFTable(oSection.data));
                                } else if (sType === "dynamicCards" && oSection.data) {
                                    oSection.data.forEach(function (oCard) {
                                        oPdfConfig.content.push({
                                            text: oCard.title || "",
                                            style: "tableHeader",
                                            margin: [0, 10, 0, 5]
                                        });
                                        if (oCard.data) {
                                            oPdfConfig.content.push(buildPDFTable(oCard.data));
                                        }
                                    });
                                } else if (sType === "list" && oSection.data) {
                                    oSection.data.forEach(function (vItem) {
                                        oPdfConfig.content.push({
                                            text: vItem || "",
                                            style: "normal",
                                            margin: [0, 2, 0, 2]
                                        });
                                    });
                                }
                            });

                            oPdfConfig.content.unshift({
                                toc: {
                                    title: {
                                        text: sTOCVal,
                                        style: "header"
                                    }
                                },
                                pageBreak: "after"
                            });

                            that.fnPDFGetFooter(function (fnFooterContent) {
                                oPdfConfig.footer = fnFooterContent;

                                try {
                                    PdfMake.vfs = VfsFonts.pdfMake.vfs;
                                    PdfMake.createPdf(oPdfConfig).download(sPdfFileName + ".pdf");
                                    sap.m.MessageToast.show(sSuccessMsg);
                                } catch (oError) {
                                    console.error(oError);
                                    sap.m.MessageToast.show(that.oI18n.getText("asint.cml.message.pdfGenerationFailed"));
                                }

                                if (that.busyDialog) {
                                    that.busyDialog.close();
                                } else {
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });
                        }
                    }
                );

            }

        },

        /**
         * Helper to determine AI section type.
         */
        AiSectionType: function (vValue, aData) {
            if (vValue !== undefined && vValue !== null) {
                return "text";
            }
            if (Array.isArray(aData)) {
                if (!aData.length || typeof aData[0] === "string") {
                    return "list";
                }
                if (typeof aData[0] === "object" && aData[0].key !== undefined) {
                    return "object";
                }
                return "dynamicCards";
            }
            return "object";
        },

        /**
         * Function to get footer content for PDF
         */
        fnPDFGetFooter: function (fnSuccess) {
            var that = this;
            fnSuccess(function (currentPage, pageCount) {
                return {
                    columns: [
                        {
                            text: (new Date()).toString().split(" GMT")[0],
                            alignment: "center"
                        }, {
                            text: that.oI18n.getText("asint.cml.detail.ai.reportCopyright"),
                            alignment: "center"
                        }, {
                            text: currentPage.toString().concat("/", pageCount),
                            alignment: "center"
                        }
                    ]
                };
            });
        },


        /**
         * Opens the header edit dialog and populates it with the current header details
         * 
         * Retrieves the currently selected CML details from the model.
         * Prepares the data to be edited by setting it to the "editHeader" property in the model.
         * Checks if the header edit dialog ("_oDialogHeaderBox") exists. If not, it loads the dialog fragment.
         * Adds the dialog as a dependent to the view and opens it.
         */
        onEditHeader: function () {
            var that = this;
            var oSelectedCML = this.getOwnerComponent().getModel("mCMLModel").getProperty("/data/selectedCML");
            var editHeader = {
                "name": oSelectedCML.name,
                "locDesc": oSelectedCML.locDesc
            };
            this.getOwnerComponent().getModel("mCMLModel").setProperty("/data/editHeader", editHeader);
            if (!that._oDialogHeaderBox) {
                that._oDialogHeaderBox = sap.ui.xmlfragment(
                    that.oView.getId(),
                    "com.asint.ais.mi.cml.view.fragment.HeaderDetails",
                    that
                );
            }
            that.getView().addDependent(that._oDialogHeaderBox);
            that._oDialogHeaderBox.open();
        },

        /**
         * Cancels the header update operation
         * 
         * Closes the header update dialog if it is open.
         * Resets the edit header data in the model to an empty object.
         */
        onCancelHeader: function () {
            var that = this;
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            if (that._oDialogHeaderBox) {
                that._oDialogHeaderBox.close();
            }
            oCommonCMLModel.setProperty("/data/editHeader", {});
        },

        /**
         * Updates the header details of the selected CML.
         *
         * This function performs the following steps:
         * 1. Retrieves data from the model and resource bundle.
         * 2. Constructs a payload object with updated header information.
         * 3. Validates that the selected CML entry has non-empty name and description.
         * 4. Sends the update request to the backend using "updateCMLDetail".
         * 5. Updates the relevant parts of the model and UI based on the response from the backend.
         * 6. Closes the header update dialog.
         * 7. Displays error messages if validation fails or the update request fails.
         */
        onUpdateHeader: function () {
            var that = this;
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var oSelectedPersonaData = oCommonCMLModel.getProperty("/data/selectedCML");
            var editHeader = oCommonCMLModel.getProperty("/data/editHeader");
            var aCMLS = oCommonCMLModel.getProperty("/data/detailPage/CMLs");
            var unchangedCMLS = oCommonCMLModel.getProperty("/data/detailPage/aCMLs");
            var oPayload = {
                ID: oSelectedPersonaData.cmlId,
                name: editHeader.name,
                // eslint-disable-next-line camelcase
                to_description: [{
                    shortDescription: editHeader.locDesc,
                    language: "en"
                }]
            };
            if (oCommonCMLModel.getProperty("/data/selectedCML/name").length > 0 && oCommonCMLModel.getProperty("/data/selectedCML/locDesc").length > 0) {
                oPayload = that.setCreatedModified(oPayload, "POST");
                that.CMLDataSource.updateCMLDetail(oPayload, function (oDataRec) {
                    aCMLS.categories.forEach(function (oItem) {
                        var oContext = oItem.categories.find(function (oList) {
                            return oList.locationId === oDataRec.ID
                        });
                        if (oContext) {
                            oContext.cmlName = oDataRec.name;
                        }
                    })
                    unchangedCMLS.forEach(function (item) {
                        if (item.ID === oDataRec.ID) {
                            item.name = oDataRec.name;
                            item.to_description[0].shortDescription = oDataRec.to_description[0].shortDescription
                        }
                    });
                    oSelectedPersonaData.name = oDataRec.name;
                    oSelectedPersonaData.locDesc = oDataRec.to_description[0].shortDescription;
                    oCommonCMLModel.setProperty("/data/selectedCML", oSelectedPersonaData);
                    oCommonCMLModel.setProperty("/data/detailPage/CMLs", aCMLS);
                    oCommonCMLModel.setProperty("/data/detailPage/aTempCMLs", aCMLS);
                    oCommonCMLModel.setProperty("/data/detailPage/aCMLs", unchangedCMLS);
                    oCommonCMLModel.setProperty("/data/detailPage/layout", "TwoColumnsMidExpanded");
                    that._oDialogHeaderBox.close();
                }, function (oError) {
                    that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE011"), oError);
                }, oSelectedPersonaData.eTag)
            } else {
                that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE002"));
            }
        },

        /**
         * Handles the save action for the CML data.
         *
         * This function performs the following steps:
         * 1. Checks for mandatory fields in the section list.
         * 2. Compares the current data source with the old data source to determine if there are any changes.
         * 3. Formats the date in the data source if necessary.
         * 4. Converts the data source based on the unit of measurement (UOM).
         * 5. Processes the data source to prepare it for saving, including handling ignored readings and setting references.
         * 6. Sends the data to be saved using "saveCMLDataSourceValues".
         * 7. Updates the model and UI based on the result of the save operation.
         * 8. Displays appropriate messages to the user and handles errors.
         */
        onPressSave: function () {

            var that = this;
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var oDataSource = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var oOldDataSource = JSON.parse(oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/oTempDataSource"));
            var oSelectedPersonaData = oCommonCMLModel.getProperty("/data/selectedCML");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var aSectionList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/sectionList");
            var oIgnoredReading = oCommonCMLModel.getProperty("/data/ignoredReading");
            var aCmlList = oCommonCMLModel.getProperty("/data/detailPage/aCMLs");
            var oSelectedCML = oCommonCMLModel.getProperty("/data/detailPage/detailSelectedCML");
            var aDataSource = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat");
            var aDataSourceList = [];

            sap.ui.core.BusyIndicator.show();

            that._LocationController.fnCheckMandatoryFields(aSectionList, oCommonCMLModel, oMessageBundle, function () {
                if ((JSON.stringify(oDataSource) === JSON.stringify(oOldDataSource)) && (Object.keys(oIgnoredReading).length === 0)) {
                    sap.ui.core.BusyIndicator.hide();
                    that.fnMessageShow("I", oMessageBundle.getText("CML.MESSAGE009"));
                } else {
                    sap.ui.core.BusyIndicator.hide();
                    if (oDataSource.DATE_IN_SERVICE) {
                        // oDataSource.DATE_IN_SERVICE = new Date(oDataSource.DATE_IN_SERVICE);
                        var oDate = (oDataSource.DATE_IN_SERVICE instanceof Date) ? oDataSource.DATE_IN_SERVICE : that._LocationController.normalizeDate(oDataSource.DATE_IN_SERVICE);
                        var iDate = ((oDate.getDate() < 10) ? ("0" + oDate.getDate()) : oDate.getDate());
                        var iMonth = oDate.getMonth() + 1;
                        var iMonthVal = iMonth < 10 ? "0" + iMonth : iMonth;
                        // changing the date format to yyyy-mm-dd
                        var sDate = oDate.getFullYear() + "-" + iMonthVal + "-" + iDate;
                        oDataSource.DATE_IN_SERVICE = sDate;

                        var aSelectedCML = aCmlList.find(function (oList) {
                            return oList.ID === oSelectedPersonaData.cmlId;
                        });

                        that.getUOMBasedDataSource(oCommonCMLModel, oDataSource, function (oDataSource) {
                            Object.keys(oDataSource).forEach(function (oItem) {
                                if (oDataSource[oItem]) {
                                    var oDataSourceContext = aDataSource.find(function (oDSId) {
                                        return oDSId.dataSourcename === oItem;
                                    });

                                    var sDSId = oDataSourceContext ? oDataSourceContext.ID : null;

                                    var sIgnored = "";

                                    if (Object.keys(oIgnoredReading).length > 0) {

                                        if (oDataSourceContext && oIgnoredReading[oDataSourceContext.ID]) {
                                            sIgnored = true;
                                        }

                                        if (oDataSourceContext && oDataSourceContext.isIgnored) {
                                            sIgnored = true;
                                        }

                                        if (oDataSourceContext && oDataSourceContext.isIgnored === null) {
                                            sIgnored = false;
                                        }
                                    }

                                    var sReferenceId = "";
                                    var sReferenceType = "";

                                    if (aSelectedCML) {
                                        aSelectedCML.to_values.forEach(function (oDataSource) {
                                            if (oDataSource["dataSourcename"] === oItem) {
                                                sReferenceId = oDataSource.referenceId;
                                                sReferenceType = oDataSource.referenceType;
                                            }
                                        });
                                    }

                                    if (oItem === "READINGS") {
                                        oDataSource[oItem].forEach(function (oReading) {

                                            var sReadingIgnored = false;

                                            if(Object.keys(oIgnoredReading).length && oIgnoredReading[oReading.dataId]){
                                                sReadingIgnored = true;
                                            }else if (!Object.keys(oIgnoredReading).length && oReading && oReading.isIgnored) {
                                                sReadingIgnored = true;
                                            }

                                            aSelectedCML.to_values.forEach(function (oDataSource) {
                                                if (oDataSource["dataSourcename"] === oItem && oDataSource["ID"] === oReading.dataId) {
                                                    sReferenceId = oDataSource.referenceId;
                                                    sReferenceType = oDataSource.referenceType;
                                                }
                                            });

                                            var oReadingToSave = {};
                                            Object.keys(oReading).forEach(function (sKey) {
                                                if (oReading[sKey] instanceof Date) {
                                                    oReadingToSave[sKey] = that._LocationController.fnGetBEDate(oReading[sKey]) + "T18:30:00.000Z";
                                                } else {
                                                    oReadingToSave[sKey] = oReading[sKey];
                                                }
                                            });
                                            var oTemp = {
                                                "cml_ID": oSelectedPersonaData.cmlId,
                                                "dataSourcename": oItem,
                                                "dataSourceValue": btoa(JSON.stringify({ value: oReadingToSave })),
                                                "isIgnored": sReadingIgnored,
                                                "referenceId": sReferenceId ? sReferenceId : oSelectedPersonaData.objectId,
                                                "referenceType": sReferenceType ? sReferenceType : oSelectedPersonaData.objectType === "Equipment" ? "EQUI" : "FLOC",
                                                "isValidated": true

                                            };
                                            
                                            if(oReading.dataId) {
                                                oTemp.ID = oReading.dataId;
                                            }
                                            aDataSourceList.push(oTemp);
                                        });
                                    } else {
                                        var oValueToSave = oDataSource[oItem];
                                        if (oValueToSave instanceof Date) {
                                            oValueToSave = that._LocationController.fnGetBEDate(oValueToSave) + "T18:30:00.000Z";
                                        }
                                        var oTemp = {
                                            "cml_ID": oSelectedPersonaData.cmlId,
                                            "dataSourcename": oItem,
                                            "dataSourceValue": btoa(JSON.stringify({ value: oValueToSave })),
                                            "isIgnored": sIgnored === "" ? false : sIgnored === null ? false : sIgnored === "undefined" ? false : sIgnored,
                                            "referenceId": sReferenceId ? sReferenceId : oSelectedPersonaData.objectId,
                                            "referenceType": sReferenceType ? sReferenceType : oSelectedPersonaData.objectType === "Equipment" ? "EQUI" : "FLOC",
                                            "isValidated": true
                                        };
                                        if(sDSId) {
                                            oTemp.ID = sDSId;
                                        }
                                        aDataSourceList.push(oTemp);
                                    }
                                }
                            });

                            var oPayload = {
                                "objectId": aSelectedCML.objectId,
                                "objectType": aSelectedCML.objectType,
                                "name": aSelectedCML.name,
                                "displayId": aSelectedCML.displayId,
                                "deleted": false,
                                "recommendation_ID": aSelectedCML.recommendation_ID,
                                "persona_id": aSelectedCML.persona_id,
                                "active": aSelectedCML.active,
                                "to_values": aDataSourceList
                            };

                            oPayload = that.setCreatedModified(oPayload, "POST");
                            that.CMLDataSource.saveCMLDataSourceValues(oSelectedPersonaData.cmlId, oPayload, oSelectedPersonaData.eTag, function () {
                                sap.ui.core.BusyIndicator.hide();
                                oDataSource.DATE_IN_SERVICE = that._LocationController.normalizeDate(oDataSource.DATE_IN_SERVICE);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/oTempDataSource", Object.assign(JSON.stringify(oDataSource)));
                                var sObjType = aSelectedCML.objectType === "EQUI" ? "EQP" : "FL"
                                that.CMLDataSource.fnGetSummary(aSelectedCML.objectId, sObjType, function (oRes) {
                                    if(oRes){
                                        that.fnCmlSummaryData(aSelectedCML.objectId, aSelectedCML.objectType)
                                    }
                                }, function () {});
                                that.fnGetData(oSelectedPersonaData.objectType, oSelectedPersonaData.objectId, function () {
                                    if(!that._locationId){
                                        that._LocationController.fnInitialize(that, oCommonCMLModel, oSelectedCML);
                                    }
                                    that.fnMessageShow("S", oMessageBundle.getText("CML.MESSAGE007"));
                                });
                            }, function (oError) {

                                that.fnMessageShow("E", "Something went wrong, Please try again later", oError);

                            });
                        });
                    } else {
                        that.fnMessageShow("I", oMessageBundle.getText("CML.MESSAGE035"));
                    }
                }
            }, function (aError) {
                sap.ui.core.BusyIndicator.hide();
                oCommonCMLModel.setProperty("/data/CMLTabSection/Errors", aError);
                if (!that._oDialogErrorBox) {
                    that._oDialogErrorBox = sap.ui.xmlfragment(
                        that.oView.getId(),
                        "com.asint.ais.mi.cml.view.fragment.DialogErrorBox",
                        that
                    );
                }
                that.getView().addDependent(that._oDialogErrorBox);
                that._oDialogErrorBox.open();
            });

        },

        /**
         * Retrieves and converts the data source based on the unit of measurement (UOM)
         * 
         * @param {Object} oCommonCMLModel - The common CML model containing the UOM property.
         * @param {Object} oConversionData - The data to be converted based on the UOM
         * @param {Function} fnSuccess - The callback function to be executed upon successful conversion or when no conversion is needed.
         */
        getUOMBasedDataSource: function (oCommonCMLModel, oConversionData, fnSuccess) {

            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            if (sUom === "metric") {
                this._LocationController.fnUoMConvertMetricToImperial(oCommonCMLModel, oConversionData, function (oConversionResult) {
                    fnSuccess(oConversionResult);
                }, function (oResult) {
                    fnSuccess(oResult);
                });
            } else {
                fnSuccess(oConversionData);
            }

        },

        /**
         * This function hides the "back" button, navigates back in the message view, and closes the error dialog if it is open.
         * It also removes the error dialog from the view's dependencies.
         */
        onMessageBoxCancel: function () {

            var that = this;
            var oControl = that.getView().byId("idAsintMessageView");
            var oBtn = that.getView().byId("idAsintMessageBoxBackBtn");

            if (that._oDialogErrorBox) {
                if (oBtn) {
                    that.getView().byId("idAsintMessageBoxBackBtn").setVisible(false);
                }
                oControl.navigateBack();
                that._oDialogErrorBox.close();
                that.getView().removeDependent(that._oDialogErrorBox);
            }

        },

        /**
         * This function makes the "back" button visible when an item is selected in the message view.
         * 
         */
        onMessageViewItemselect: function () {

            var that = this;
            var oBtn = that.getView().byId("idAsintMessageBoxBackBtn");

            if (oBtn) {
                that.getView().byId("idAsintMessageBoxBackBtn").setVisible(true);
            }

        },

        /**
         * This function navigates back in the message view and hides the source control that triggered this action.
         * 
         * @param {Object} oEvent - The event object triggered by the user action.
         */
        onMessageBoxBack: function (oEvent) {

            var that = this;
            var oControl = that.getView().byId("idAsintMessageView");

            oControl.navigateBack();
            oEvent.getSource().setVisible(false);

        },

        /**
         * Handles the calculation process for the CML data.
         *
         * This function sorts the section list based on the publish sequence, checks mandatory fields, 
         * and performs calculations depending on the selected unit of measurement (UoM). 
         * If any mandatory fields are missing, it displays an error dialog.
         */
        onPressCalculate: function () {

            var that = this;
            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            var fnProceedCalculation = function () {
                that._LocationController.fnCheckMandatoryFields(aSectionList, oCommonCMLModel, oMessageBundle, function () {
                    if (sUom === "metric") {
                        //that._LocationController.fnConvertRefValues(oCommonCMLModel, oModelUom, function (oRet) {
                        that._LocationController.fnConvertDsValues(oCommonCMLModel, function () {
                            that._LocationController.fnCalculate(0, oCommonCMLModel, oMessageBundle, "EQUIPMENT");
                        });
                        //});
                    } else {
                        that._LocationController.fnCalculate(0, oCommonCMLModel, oMessageBundle, "EQUIPMENT");
                    }

                }, function (aError) {
                    oCommonCMLModel.setProperty("/data/CMLTabSection/Errors", aError);
                    if (!that._oDialogErrorBox) {
                        that._oDialogErrorBox = sap.ui.xmlfragment(
                            that.oView.getId(),
                            "com.asint.ais.mi.cml.view.fragment.DialogErrorBox",
                            that
                        );
                    }
                    that.getView().addDependent(that._oDialogErrorBox);
                    that._oDialogErrorBox.open();
                });
            };

            oCommonCMLModel.setProperty("/data/CMLTabSection/temp/Action", "Calculate");

            // this.busyShow();
            var aSectionList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/sectionList");

            //Sort Publish Sequencing 
            aSectionList.sort(function (oFirst, oSecond) {

                var iFirst = 9999;
                var iSecond = 9999;

                iFirst = parseInt(oFirst.publishSequence);

                if (isNaN(iFirst) === true || iFirst === 0) {
                    iFirst = 9999;
                }

                iSecond = parseInt(oSecond.publishSequence);

                if (isNaN(iSecond) === true || iSecond === 0) {
                    iSecond = 9999;
                }

                return iFirst - iSecond;
            });

            var bIsCmlSummaryEnabled = oCommonCMLModel.getProperty("/metaData/featureFlag/cmlSummaryValidations") === "1";
            var oIgnoredReading = oCommonCMLModel.getProperty("/data/ignoredReading") || {};
            var bHasIgnoredReadings = Object.keys(oIgnoredReading).some(function (sKey) {
                return oIgnoredReading[sKey] === true;
            });

            if (bIsCmlSummaryEnabled && bHasIgnoredReadings) {
                var sIgnoredReadingDetails = oMessageBundle.getText("asint.cml.calculate.ignoredReadings") + " : " + "\n\n";
                var aReadings = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/READINGS") || [];

                aReadings.forEach(function (oReading) {
                    if (oIgnoredReading[oReading.dataId] === true) {
                        var sFormattedDate = "-";
                        if (oReading.DATE) {
                            sFormattedDate = DateFormat.getDateInstance({
                                pattern: "dd MMM yyyy"
                            }).format(new Date(oReading.DATE));
                        }
                        var sReadingValue = (oReading.READING !== null && oReading.READING !== undefined && oReading.READING !== "") ? oReading.READING : "-";
                        sIgnoredReadingDetails += " • " + oMessageBundle.getText("asint.cml.calculate.date") + ": " + sFormattedDate + " , " + oMessageBundle.getText("asint.cml.calculate.reading") + ": " + sReadingValue + "\n";
                    }
                });

                that.fnMessageShow("C",oMessageBundle.getText("asint.cml.calculate.ignoreReadingMessage"),sIgnoredReadingDetails,function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        fnProceedCalculation();
                    }
                });
            } else {
                fnProceedCalculation();
            }

        },

        /**
         * This function is triggered when the user performs a search. 
         * 
         * It retrieves the search query, updates the search text in the model,
         * and calls a helper function to filter and update the CML data based on the current segment button, selected groups, and search query.
         * 
         * @param {Object} oEvent - The event object triggered by the search action, containing the search query.
         */
        onSearchCML: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oCommonModel = this.getView().getModel("mCMLModel");
            var sSegmentButton = oCommonModel.getProperty("/data/detailPage/sSegmentedButton");
            var aSelectedGroup = oCommonModel.getProperty("/data/detailPage/selectedGroup");
            var aSelectedComponentType = oCommonModel.getProperty("/data/detailPage/selectedComponentType");



            oCommonModel.setProperty("/data/detailPage/sSearchText", sQuery);

            this.fnCallHelperFunction(sSegmentButton, aSelectedGroup, sQuery,aSelectedComponentType)
        },

        /**
         * Opens the custom settings dialog.
         * 
         * This function checks if the custom settings dialog has already been initialized.
         * If not, it loads the dialog fragment, adds it as a dependent to the current view, and then opens it.
         * If the dialog is already initialized, it simply opens the dialog.
         */
        handleOpenSettingDialog: function () {

            if (!this._oDialogSingleCustomTab) {
                Fragment.load({
                    id: "idDialogCustomSettingTab",
                    name: "com.asint.ais.mi.cml.view.fragment.DialogCustomSettings",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDialogSingleCustomTab = oDialog;
                    this._oDialogSingleCustomTab.open();
                }.bind(this));
            } else {
                this._oDialogSingleCustomTab.open();
            }

        },

        /**
         * This function retrieves the current segment button selection, selected groups, and search text from the model.
         * Then calls the helper function to process and update the CML data based on these parameters.
         */
        handleConfirm: function () {

            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var sSegmentButton = oCommonModel.getProperty("/data/detailPage/sSegmentedButton");
            var aSelectedGroup = oCommonModel.getProperty("/data/detailPage/selectedGroup");
            var sSearchText = oCommonModel.getProperty("/data/detailPage/sSearchText");
            var aSelectedComponentType = oCommonModel.getProperty("/data/detailPage/selectedComponentType");


            sSegmentButton = sSegmentButton === "All" ? "" : sSegmentButton;

            this.fnCallHelperFunction(sSegmentButton, aSelectedGroup, sSearchText,aSelectedComponentType)

        },

        /**
         * This function resets the CML data view to its default state by clearing selected groups, 
         * resetting the segmented button and calling the helper function to reload the data based on the current search text.
         */
        handleReset: function () {

            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var sSearchText = oCommonModel.getProperty("/data/detailPage/sSearchText");

            this.fnCallHelperFunction("", [], sSearchText);
            oCommonModel.setProperty("/data/detailPage/setSelectedKey", "All");
            oCommonModel.setProperty("/data/detailPage/selectedItemId", "idClearColor");
            oCommonModel.setProperty("/data/detailPage/selectedGroup", []);
            oCommonModel.setProperty("/data/detailPage/sSegmentedButton", "");
            oCommonModel.setProperty("/data/detailPage/selectedComponentType",[]);

        },

        /**
         * This function triggers the CMLHelper's "onTableConversion" method to convert and format data for the CML table. 
         * The results are then stored in the model for further use.
         * 
         * @param {String} sSegmentButton - The selected segment button key that indicates the current filter or view state.
         * @param {Array} aSelectedGroup - The array of selected CML groups
         * @param {Arrya} sSearchText - The search text entered by the user, used to filter the data.
         */
        fnCallHelperFunction: function (sSegmentButton, aSelectedGroup, sSearchText,aSelectedComponentType) {

            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");

            that.CMLHelper.onTableConversion(sSegmentButton, aSelectedGroup, sSearchText.toLowerCase(),function (aFormatedData) {
                if (aFormatedData.aCMLs.length > 0) {
                    oCommonModel.setProperty("/data/detailPage/CMLs", aFormatedData.aFinalCMLResult);
                    oCommonModel.setProperty("/data/detailPage/aCMLs", aFormatedData.aCMLs);
                    oCommonModel.setProperty("/data/detailPage/aTempCMLs", aFormatedData.aFinalCMLResult);
                    oCommonModel.setProperty("/data/detailPage/exportData", aFormatedData.exportData);
                    oCommonModel.setProperty("/data/detailPage/aFormattedData", aFormatedData);
                    oCommonModel.setProperty("/data/detailPage/overallReadingCount", aFormatedData.iCount);
                    oCommonModel.setProperty("/data/detailPage/iTempTotalCount", aFormatedData.iCount);
                    oCommonModel.setProperty("/data/detailPage/cmlGroups", that.fnGetUniqueCMLGroupName(aFormatedData.aCMLs, "groupName"));
                }
            },aSelectedComponentType);

        },

        /**
         * Handles the press event for the group operations.
         * 
         * This function triggers different actions based on the selected group operation (Assign or UnAssign).
         * If "Assign" is selected, it opens a dialog for assigning CML groups
         * If "UnAssign" is selected, it directly calls the function to update (unassign) the CML group
         * 
         * @param {Object} oEvent - The event object triggered by the user's selection
         */
        onPressGroup: function (oEvent) {

            var that = this;
            var sSelected = oEvent.getSource().getProperty("key");

            switch (sSelected) {
            case "Assign":
                if (!this._oDialogCMLGroup) {
                    Fragment.load({
                        id: "idDialogGroupField",
                        name: "com.asint.ais.mi.cml.view.fragment.DialogCMLGroup",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        this._oDialogCMLGroup = oDialog;
                        this._oDialogCMLGroup.open();
                    }.bind(this));
                } else {
                    this._oDialogCMLGroup.open();
                }
                break;
            case "UnAssign":
                that.onUpdateCMLGroup(sSelected);
                break;
            }

        },

        /**
         * Handles the update of CML groups based on the selected action
         * 
         * This function performs an update operation for the selected CML.
         * It generates payloads, sends update requests, and handles success or error callbacks.
         * Depending on the selected action ("Assign" or "UnAssign"), it shows confirmation and success messages.
         * 
         * @param {String} sSelected - The action selected by the user, such as "Assign" or "UnAssign".
         */
        onUpdateCMLGroup: function (sSelected) {

            var that = this;
            var oCommonCMLModel = that.getOwnerComponent().getModel("mCMLModel");
            var aSelectedCML = oCommonCMLModel.getProperty("/data/detailPage/copyPaste/selectedObject");
            var sGroupName = oCommonCMLModel.getProperty("/data/detailPage/cmlGroupName");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();
            var aTable = this.getView().byId("idAsintCMLOverallReading");

            var aCMLResult = [];
            var eTag = "";

            /**
             * Generates the payload for the update request.
             *
             * @param {Object} oChunk - The chunk of data to be updated.
             * @returns {Object} The payload for the update request.
             */
            var fnGeneratePayload = function (oChunk) {
                eTag = oChunk.eTag;

                return {
                    groupName: sGroupName ? sGroupName : "",
                    ID: oChunk.locationId
                }
            };

            /**
             * Success callback for the update request.
             *
             * @param {Object} oResult - The result returned from the update request.
             */
            var fnSuccess = function (oResult) {
                if (oResult) {
                    aCMLResult.push(oResult);
                }
            };

            /**
             * Error callback for the update request.
             *
             * @param {Object} oError - The error returned from the update request.
             */
            var fnError = function (oError) {
                // sap.m.MessageToast.show(oError.responseText);
                that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE019"), oError.responseText);
            };

            /**
             * Callback function executed after all requests are completed.
             */
            var fnCallBack = function () {
                if (aCMLResult.length > 0) {
                    var sSuccessText = ""
                    if (sSelected === "UnAssign") {
                        sSuccessText = oMessageBundle.getText("CML.MESSAGE024");
                    } else {
                        sSuccessText = oMessageBundle.getText("CML.MESSAGE018");
                    }
                    that.fnMessageShow("S", sSuccessText, "", function (sAction) {
                        if (sAction === "OK") {
                            that.fnGetData(that._sObjectType, that._sObjectId);
                            if (that._oDialogCMLGroup) {
                                that._oDialogCMLGroup.close();
                            }
                            oCommonCMLModel.setProperty("/data/detailPage/isGroupVisible", false);
                            oCommonCMLModel.setProperty("/data/detailPage/cmlGroupName", "");
                            aTable.clearSelection();
                        }
                    });
                }
            };

            /**
             * Sends the update request for each chunk of selected data.
             *
             * @param {Object} aChunk - The chunk of data to be updated.
             * @param {Function} fnChunkComplete - Callback function executed after the request is complete.
             */
            var fnRequest = function (aChunk, fnChunkComplete) {
                var oPayload = fnGeneratePayload(aChunk);

                that.CMLDataSource.updateCMLReading(oPayload, function (aCMlsList) {
                    fnSuccess(aCMlsList);
                    fnChunkComplete();
                }, function (oError) {
                    fnError(oError);
                    fnChunkComplete();
                }, eTag);
            };

            var sConfirmText = "";
            if (sSelected === "UnAssign") {
                sConfirmText = oMessageBundle.getText("CML.MESSAGE023");
            } else {
                sConfirmText = oMessageBundle.getText("CML.MESSAGE020");
            }
            this.fnMessageShow("C", sConfirmText, "", function (sAction) {
                if (sAction === "YES") {
                    that.fnPerformDatasourceOperation(aSelectedCML, fnRequest, fnCallBack);
                }
            });

        },

        /**
         * Handles the cancellation of the CML group operation
         * 
         * This function closes the CML group dialog if it is open, effectively canceling any ongoing group operation.
         */
        onCancelCMLGroup: function () {

            if (this._oDialogCMLGroup) {
                this._oDialogCMLGroup.close();
            }

        },

        /**
         * Function on Press Analytics view
         */
        onPressAnalyticsView: function () {

            var that = this;
            var oCommonCMLModel = that.getOwnerComponent().getModel("mCMLModel");

            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/layout", "TwoColumnsBeginExpanded");
            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/PredcThicknessState", false);
            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/ReadingState", true);
            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/selectedPredictedValue", "default");

            that.fnCreateToggleSwitchSection(oCommonCMLModel, function () {
                that.fnUpdateGraphData(oCommonCMLModel);
            });
        },

        /**
         * Function to prepare VizData
         * 
         * @param {Object} oCommonCMLModel - CML Model
         */
        fnPreparVizData: function (oCommonCMLModel, fnSuccess) {

            var that = this;
            var sReadingState = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/ReadingState");
            var sPredcThicknessState = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/PredcThicknessState");
            var aSelectedCML = oCommonCMLModel.getProperty("/data/detailPage/copyPaste/selectedObject");
            var aCML = oCommonCMLModel.getProperty("/data/detailPage/aCMLs");
            var sPredictedValue = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/selectedPredictedValue");

            var aGraphData = [];
            /**
             * Function to decode the dataSource value
             * @param {Object} oValue 
             * @returns decoded Json
             */
            var fnDecode = function (oValue) {
                var parsed = "";

                try {
                    parsed = JSON.parse(oValue);
                    // eslint-disable-next-line no-empty
                } catch (error) {

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

            aSelectedCML.forEach(function (oItem) {
                var oGraphData = {
                    "cmlName": "",
                    "reading": [],
                    "predicted": [],
                    "retirement": []
                }

                aCML.forEach(function (oCML) {
                    oGraphData.cmlName = oCML.name;
                    if (oCML.ID === oItem.locationId) {
                        oGraphData.reading = oCML.to_values.filter(function (oDataSource) {
                            if (oDataSource.dataSourcename === "READINGS") {
                                return oDataSource.dataSourceValue;
                            }
                        });

                        oGraphData.predicted = oCML.to_values.filter(function (oDataSource) {
                            if (oDataSource.dataSourcename === "PREDICTED_THICKNESS_" + sPredictedValue) {
                                return oDataSource.dataSourceValue;
                            }
                        });

                        oGraphData.retirement = oCML.to_values.filter(function (oDataSource) {
                            if (oDataSource.dataSourcename === "RETIREMENT_DATE_" + sPredictedValue) {
                                return oDataSource.dataSourceValue;
                            }
                        });

                        aGraphData.push(Object.assign({}, JSON.parse(JSON.stringify(oGraphData))));
                    }
                });
            });

            aGraphData.forEach(function (oData) {
                oData.reading.forEach(function (oReading) {
                    oReading.dataSourceValue = fnDecode(oReading.dataSourceValue);
                });

                oData.predicted.forEach(function (oPredicted) {
                    oPredicted.dataSourceValue = fnDecode(oPredicted.dataSourceValue);
                });

                oData.retirement.forEach(function (oRetirement) {
                    oRetirement.dataSourceValue = fnDecode(oRetirement.dataSourceValue);
                });
            });

            var aVizGraphData = [];

            aGraphData.forEach(function (cmlEntry) {
                var cmlName = cmlEntry.cmlName; // Extract cmlName
                var readings = cmlEntry.reading || []; // Safely get the readings array or an empty array
                var predictedValues =
                    (cmlEntry.predicted && cmlEntry.predicted[0] && cmlEntry.predicted[0].dataSourceValue && cmlEntry.predicted[0].dataSourceValue.value) || [];

                // Determine the maximum length to iterate
                var maxLength = Math.max(readings.length, predictedValues.length);

                // Loop through the maximum length to align both readings and predicted values
                for (var i = 0; i < maxLength; i++) {
                    var readingEntry = readings[i] || {};
                    var readingData = (readingEntry.dataSourceValue && readingEntry.dataSourceValue.value) || {};

                    var predictedValue = predictedValues[i] || null;

                    var readingValue = readingData.READING || null;
                    var tMinValue = readingData.TMIN || null;
                    // var readingDate = readingData.DATE
                    //     ? new Date(readingData.DATE).toISOString().split("T")[0]
                    //     : null;

                    var iUTCDate = new Date(readingData.DATE);
                    var readingDate = Formatter.fnGetUIDate(
                        `${iUTCDate.getFullYear()}-${String(iUTCDate.getMonth() + 1).padStart(2, "0")}-${String(
                            iUTCDate.getDate()
                        ).padStart(2, "0")}`
                    );

                    var oVizGraphData = { cmlName: cmlName };
                    oVizGraphData.timeValue = iUTCDate.getTime();
                    
                    if (sReadingState) {
                        oVizGraphData.reading = readingValue;
                        oVizGraphData.tMin = tMinValue;
                    }

                    if (sPredcThicknessState) {
                        oVizGraphData.predicted = predictedValue;
                    }

                    if (sReadingState || sPredcThicknessState) {
                        oVizGraphData.date = readingDate;
                    }

                    // Add to the output array if at least one of reading or predicted is included
                    if (sReadingState || sPredcThicknessState) {
                        aVizGraphData.push(oVizGraphData);
                    }
                }
            });

            aGraphData.forEach(function (oRetirementCheck) {
                if (oRetirementCheck.retirement.length > 0) {
                    var iPUTCDate = new Date(oRetirementCheck.retirement[0].dataSourceValue.value);
                    var dateP = Formatter.fnGetUIDate(
                        `${iPUTCDate.getFullYear()}-${String(iPUTCDate.getMonth() + 1).padStart(2, "0")}-${String(
                            iPUTCDate.getDate()
                        ).padStart(2, "0")}`
                    );
                    var tempObjP = {};
                    tempObjP.cmlName = oRetirementCheck.cmlName;
                    tempObjP.date = dateP;
                    tempObjP.timeValue = iPUTCDate.getTime();
                    tempObjP.retirement = oRetirementCheck.reading[0].dataSourceValue.value.TMIN;
                    tempObjP.tMin = oRetirementCheck.reading[0].dataSourceValue.value.TMIN;
                    var oFirstData = aVizGraphData.find(function(oName){
                        return oName.cmlName === oRetirementCheck.cmlName;
                    });
                    oFirstData.retirement = oRetirementCheck.reading[0].dataSourceValue.value.READING;
                    aVizGraphData.push(tempObjP);
                }
            });

            var aLatestEntries = {};
            aVizGraphData.forEach(function(oData) {
                if (!aLatestEntries[oData.cmlName]) {
                    aLatestEntries[oData.cmlName] = oData;
                }
            });
            var aStartingDate = [];
            var aEndingDate = [];
            Object.keys(aLatestEntries).forEach(function(oItemData){
                var oFilterItem = aVizGraphData.filter(function(oVizData) {
                    return oItemData === oVizData.cmlName;
                });

                aStartingDate.push(oFilterItem[0].date);
                aEndingDate.push(oFilterItem[oFilterItem.length-1].date);

                var aDateRange = that.fnGetDateDifferentiation(oFilterItem[oFilterItem.length-1].date, oFilterItem[0].date);
                aDateRange.splice(0, 1);
                aDateRange.splice(aDateRange.length-1, 1);

                // Calculating slope point based on first and last retirement date
                var x1 = oFilterItem[0].timeValue, y1 = oFilterItem[0].retirement;
                var x2 = oFilterItem[oFilterItem.length-1].timeValue, y2 = oFilterItem[oFilterItem.length-1].retirement;
                var slope = (y2 - y1) / (x2 - x1);

                aDateRange.forEach(function (oRange) {

                    var oDate = that.fnHasSameMonthYear(aVizGraphData, oRange);
                    var itimevalue = oDate ? (new Date(oDate).getTime()) : (new Date(oRange)).getTime();
                    var iRetirement = slope *  (itimevalue - x1) + y1;
                    var oTRange = {
                        "cmlName": oFilterItem[0].cmlName,
                        "date": oDate ? oDate : oRange,
                        "timeValue": itimevalue,
                        "dataId": "",
                        "retirement": iRetirement,
                        "tMin": oFilterItem[0].tMin                        
                    }

                    aVizGraphData.push(oTRange);
                });
            });

            aVizGraphData.sort((a, b) => a.timeValue - b.timeValue);

            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/visualizationDataArr", aVizGraphData);

            return fnSuccess();

        },

        /**
         * 
         * @param {Array} aVizGraphData 
         * @returns 
         */
        fnHasSameMonthYear: function (aVizGraphData, oCheckDate) {

            var oDateMap = {}
            for (var i = 0; i < aVizGraphData.length; i++) {
                var date = new Date(aVizGraphData[i].date);
                if (isNaN(date)) continue;
                
                var year = date.getFullYear();                
                if (!oDateMap[year]) {
                    oDateMap[year] = aVizGraphData[i];
                }
            }

            var oCheck = new Date(oCheckDate);
            if (isNaN(oCheck)) return null;

            var sCheckKey = oCheck.getFullYear();
            if(oDateMap[sCheckKey]) {
                return oDateMap[sCheckKey].date
            } else {
                return null
            }

        },

        /**
         * Function to initiate Create Switch button 
         * @param {Object} oCommonCMLModel - CML Model
         * @returns - Switch model
         */
        fnCreateToggleSwitchSection: function (oCommonCMLModel, fnSuccess) {

            var that = this;

            var oVBox = this.getView().byId("idVizFrameCMLTableButton");
            oVBox.removeAllItems();

            oVBox.addItem(new sap.m.HBox({
                items: [
                    that.fnCreateSwitch("Reading vs Tmin:", true, "/data/detailPage/cmlTable/analytics/ReadingState", oCommonCMLModel),
                    new sap.m.OverflowToolbar({
                        style: "Clear",
                        content: [
                            new sap.m.Label({
                                text: "Predicted Thickness(CR):",
                            }),
                            new sap.m.Select({
                                width: "200px",
                                items: [
                                    new sap.ui.core.Item({ text: "", key: "default" }),
                                    new sap.ui.core.Item({ text: "Least Square Corrosion Rate", key: "LSCR" }),
                                    new sap.ui.core.Item({ text: "Short Term Corrosion Rate", key: "STCR" }),
                                    new sap.ui.core.Item({ text: "Long Term Corrosion Rate", key: "LTCR" })
                                ],
                                /**
                                 * Function to handle the Predicted Thickness(CR) selection
                                 * @param {Object} oEvent - The event object that triggered this function
                                 */
                                change: function (oEvent) {
                                    var sSelectedKey = oEvent.getParameter("selectedItem").getKey();

                                    that.fnUpdateGraphData(oCommonCMLModel, "Predicted", sSelectedKey);
                                }
                            })
                        ]
                    })
                    //that.fnCreateSwitch("Predicted Thickness(CR)", false, "/data/detailPage/cmlTable/analytics/PredcThicknessState", oCommonCMLModel)
                ],
                alignItems: "Center",
                justifyContent: "End"
            }));

            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/iDefaultSelection", 0);
            return fnSuccess();

        },

        /**
         * Function to create switch button
         * 
         * @param {String} sLabelText - Switch button text
         * @param {Boolean} bDefaultState - Switch button state
         * @param {String} sPath - Switch Button path
         * @param {*} oCommonCMLModel - CML Model
         * @returns - Switch button
         */
        fnCreateSwitch: function (sLabelText, bDefaultState, sPath, oCommonCMLModel) {

            var that = this;

            return new sap.m.HBox({
                items: [
                    new sap.m.Label({ text: sLabelText }),
                    new sap.m.Switch({
                        state: bDefaultState,
                        customTextOn: " ",
                        customTextOff: " ",
                        tooltip: sLabelText,
                        change: function (oEvent) {
                            var bState = oEvent.getParameter("state");
                            oCommonCMLModel.setProperty(sPath, bState);
                            that.fnUpdateGraphData(oCommonCMLModel);
                        }.bind(that)
                    })
                ],
                alignItems: "Center",
                justifyContent: "End"
            });
        },

        /**
         * Function to render the Graph based on Switch button selection
         * 
         * @param {Object} oCommonCMLModel - CML Model
         */
        fnUpdateGraphData: function (oCommonCMLModel, sType, sSelectedKey) {

            var that = this;
            var sReadingState = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/ReadingState");
            var sPredcThicknessState = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/PredcThicknessState");
            var iDefaultSelected = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/iDefaultSelection");

            if (sType && sType === "Predicted") {
                if (sSelectedKey === "default") {
                    sPredcThicknessState = false;
                } else {
                    sPredcThicknessState = true;
                }
                oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/PredcThicknessState", sPredcThicknessState);
                oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/selectedPredictedValue", sSelectedKey);
            }

            if (sReadingState && sPredcThicknessState) {
                iDefaultSelected = 2;
            } else if (sReadingState) {
                iDefaultSelected = 0;
            } else if (sPredcThicknessState) {
                iDefaultSelected = 1;
            }

            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/iDefaultSelection", iDefaultSelected);
            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/isInitialLoad", false);
            return this.fnPreparVizData(oCommonCMLModel, function () {
                that.formatHistoryReadingsforVisualization(oCommonCMLModel);
            });

        },

        /**
         * Function to render the display the History page Reading Table
         * 
         * @param {Object} oCommonCMLModel - Detail page Model
         * @returns 
         */
        formatHistoryReadingsforVisualization: function (oCommonCMLModel) {

            var that = this;
            var vizDataArr = [];
            var sReadingState = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/ReadingState");
            var sPredcThicknessState = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/PredcThicknessState");
            var iDefaultSelected = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/iDefaultSelection");

            if (sReadingState && sPredcThicknessState) {
                iDefaultSelected = 2;
            } else if (sReadingState) {
                iDefaultSelected = 0;
            } else if (sPredcThicknessState) {
                iDefaultSelected = 1;
            }

            // Filter ignored data
            var ignoredData = oCommonCMLModel.getProperty("/data/detailPage/cmlTable/analytics/ignoredReadingsDataArr");
            if (vizDataArr.length > 0 && ignoredData && ignoredData.length > 0) {
                vizDataArr = vizDataArr.filter(
                    (item) => !ignoredData.some((reading) => reading.dataId === item.dataId && reading.isIgnored)
                );
            }

            var oChartData = {
                charType: {
                    defaultSelected: iDefaultSelected,
                    values: [
                        {
                            key: 0,
                            name: "Reading vs Tmin",
                            vizType: "line",
                            dataset: {
                                dimensions: [{
                                    name: "Date",
                                    value: "{date}",
                                    dataType: "date"
                                }, {
                                    name: "CML",
                                    value: "{cmlName}"
                                }],
                                measures: [{
                                    name: "Reading",
                                    value: "{reading}"
                                }, {
                                    name: "Tmin",
                                    value: "{tMin}"
                                }],
                                data: {
                                    path: "/data/detailPage/cmlTable/analytics/visualizationDataArr"
                                }
                            },
                            vizProperties: {
                                plotArea: {
                                    dataLabel: {
                                        visible: true,
                                        showTotal: true
                                    },
                                    gridline: {
                                        visible: true
                                    }
                                },
                                valueAxis: {
                                    title: {
                                        visible: false
                                    },
                                    axisTick: {
                                        visible: true
                                    },
                                    axisLine: {
                                        visible: true
                                    },
                                    label: {
                                        visible: true
                                    }
                                },
                                categoryAxis: {
                                    title: {
                                        visible: false
                                    },
                                    axisTick: {
                                        visible: true
                                    },
                                    axisLine: {
                                        visible: true
                                    },
                                    label: {
                                        visible: true
                                    }
                                },
                                title: {
                                    visible: true,
                                    text: "Reading vs Tmin"
                                }
                            }
                        },
                        {
                            key: 1,
                            name: "Predicted Thickness(CR)",
                            vizType: "line",
                            dataset: {
                                dimensions: [{
                                    name: "Date",
                                    value: "{date}",
                                    dataType: "date"
                                }, {
                                    name: "CML",
                                    value: "{cmlName}"
                                }],
                                measures: [{
                                    name: "Predicted Thickness(CR)",
                                    value: "{predicted}"
                                }],
                                data: {
                                    path: "/data/detailPage/cmlTable/analytics/visualizationDataArr"
                                }
                            },
                            vizProperties: {
                                plotArea: {
                                    dataLabel: {
                                        visible: true,
                                        showTotal: true
                                    },
                                    gridline: {
                                        visible: true
                                    }
                                },
                                valueAxis: {
                                    title: {
                                        visible: false
                                    },
                                    axisTick: {
                                        visible: true
                                    },
                                    axisLine: {
                                        visible: true
                                    },
                                    label: {
                                        visible: true
                                    }
                                },
                                categoryAxis: {
                                    title: {
                                        visible: false
                                    },
                                    axisTick: {
                                        visible: true
                                    },
                                    axisLine: {
                                        visible: true
                                    },
                                    label: {
                                        visible: true
                                    }
                                },
                                title: {
                                    visible: true,
                                    text: "Predicted Thickness(CR)"
                                }
                            }
                        },
                        {
                            key: 2,
                            name: "Reading vs Tmin and Predicted Thickness(CR)",
                            vizType: "line",
                            dataset: {
                                dimensions: [{
                                    name: "Date",
                                    value: "{date}",
                                    dataType: "date"
                                }, {
                                    name: "CML",
                                    value: "{cmlName}"
                                }],
                                measures: [{
                                    name: "Reading",
                                    value: "{reading}"
                                }, {
                                    name: "Tmin",
                                    value: "{tMin}"
                                }, {
                                    name: "Predicted Thickness(CR)",
                                    value: "{predicted}"
                                }, {
                                    name: "Predicted Thickness till Retirement Date",
                                    value: "{retirement}"
                                }],
                                data: {
                                    path: "/data/detailPage/cmlTable/analytics/visualizationDataArr"
                                }
                            },
                            vizProperties: {
                                plotArea: {
                                    dataLabel: {
                                        visible: true,
                                        showTotal: true
                                    },
                                    gridline: {
                                        visible: true
                                    },
                                    dataPointStyle: {
                                        "rules":
                                            [
                                                {
                                                    "dataContext": {"Predicted Thickness till Retirement Date": "*"},
                                                    "properties": {
                                                        "lineType":"dash"
                                                    },
                                                    "displayName":"Predicted Thickness till Retirement Date",
                                                    "dataName" : {
                                                        "Predicted Thickness till Retirement Date" : "Predicted Thickness till Retirement Date"
                                                    }
                                                },
                                                {
                                                    "dataContext": {"Tmin": "*"},
                                                    "properties": {
                                                        "lineType":"line"
                                                    },
                                                    "displayName":"Tmin",
                                                    "dataName" : {
                                                        "Tmin" : "Tmin"
                                                    }
                                                },
                                                {
                                                    "dataContext": {"Reading": "*"},
                                                    "properties": {
                                                        "lineType":"line"
                                                    },
                                                    "displayName":"Reading",
                                                    "dataName" : {
                                                        "Reading" : "Reading"
                                                    }
                                                },
                                                {
                                                    "dataContext": {"Predicted Thickness(CR)": "*"},
                                                    "properties": {
                                                        "lineType":"line"
                                                    },
                                                    "displayName":"Predicted Thickness(CR)",
                                                    "dataName" : {
                                                        "Predicted Thickness(CR)" : "Predicted Thickness(CR)"
                                                    }
                                                }

                                            ]
                                    }
                                },
                                valueAxis: {
                                    title: {
                                        visible: false
                                    },
                                    axisTick: {
                                        visible: true
                                    },
                                    axisLine: {
                                        visible: true
                                    },
                                    label: {
                                        visible: true
                                    }
                                },
                                categoryAxis: {
                                    title: {
                                        visible: false
                                    },
                                    axisTick: {
                                        visible: true
                                    },
                                    axisLine: {
                                        visible: true
                                    },
                                    label: {
                                        visible: true
                                    }
                                },
                                title: {
                                    visible: true,
                                    text: "Reading vs Tmin and Predicted Thickness(CR)"
                                }
                            }
                        },
                    ]
                }
            }

            return that.fnRenderVizGraph(oChartData, iDefaultSelected, oCommonCMLModel);

        },

        /**
         * Function to Render the Viz graph
         * 
         * @param {Object} oChartData - Viz Propert data
         * @param {Integer} iDefaultSelected - Graph value count
         * @param {Object} oCommonCMLModel - Model
         * @returns Viz chart
         */
        fnRenderVizGraph: function (oChartData, iDefaultSelected, oCommonCMLModel) {

            oChartData = oChartData.charType.values[iDefaultSelected];

            if (sap.viz) {
                // Create VizFrame
                var oVizFrame = new sap.viz.ui5.controls.VizFrame({
                    vizType: oChartData.vizType
                });

                // Create ChartContainerContent
                var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
                    content: [oVizFrame]
                });

                // Create ChartContainer
                var oChartContainer = new sap.suite.ui.commons.ChartContainer({
                    showFullScreen: true,
                    showPersonalization: false,
                    showZoom: true,
                    content: [oChartContainerContent]
                });

                // Add FeedItems
                oChartData.dataset.measures.forEach(function (measure) {
                    oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                        uid: "valueAxis",
                        type: "Measure",
                        values: [measure.name]
                    }));
                });

                oChartData.dataset.dimensions.forEach(function (dimensions) {
                    if (dimensions.name === "Date") {
                        oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                            uid: "categoryAxis",
                            type: "Dimension",
                            values: [dimensions.name]
                        }));
                    } else {
                        oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                            uid: "color",
                            type: "Dimension",
                            values: [dimensions.name]
                        }));
                    }
                });


                // Create and set FlattenedDataset
                var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                    dimensions: oChartData.dataset.dimensions,
                    measures: oChartData.dataset.measures,
                    data: oChartData.dataset.data
                });
                oVizFrame.setDataset(oDataset);

                // Set VizFrame properties
                oVizFrame.setVizProperties(oChartData.vizProperties);


                oCommonCMLModel.refresh();
                oVizFrame.setModel(oCommonCMLModel);

                var oChartContainerBox = this.getView().byId("idVizFrameCMLTableData");
                oChartContainerBox.removeAllItems();
                oChartContainerBox.addItem(oChartContainer);
            }
        },

        /**
         * Function to Close the Begin page
         */
        onToggleBeginPage: function () {

            var oCommonCMLModel = this.getOwnerComponent().getModel("mCMLModel");
            oCommonCMLModel.setProperty("/data/detailPage/cmlTable/analytics/layout", "MidColumnFullScreen");

        },

        /**
         * Change layout when navigated from cml overview page
         */
        fnChangeLayout : function(aData) {

            var aCategories = aData.categories && aData.categories.length ? aData.categories : [];
            var oCommonCMLModel = this.getView().getModel("mCMLModel");

            for(var i=0 ;i < aCategories.length ; i++) {

                if(aCategories[i].objectId === this._sObjectId) {

                    var aCmls = aCategories[i].categories;

                    for(var j=0 ; j< aCmls.length ; j++){

                        if(aCmls[j].locationId === this._locationId){

                            oCommonCMLModel.setProperty("/data/detailPage/detailSelectedCML", aCmls[j]);
                            this._LocationController.fnInitialize(this, oCommonCMLModel, aCmls[j]);
                            oCommonCMLModel.setProperty("/data/detailPage/layout", "TwoColumnsMidExpanded"); 
                            break;

                        }
                    }
                    break;
                }
            }
        },

        /**
         * Get checkbox value
         * @param {Object} oEvent 
         */
        onCheckBoxChange: function(oEvent) {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var oCheckBox = oEvent.getSource();
            var bChecked = oCheckBox.getSelected();
            var oTable = sap.ui.core.Fragment.byId("renewCmlFragment", "renewCMLTable");
            oCMLModel.setProperty("/data/detailPage/isCheckedCml", bChecked);

            // Only apply if box is checked
            if (bChecked) {
                var oFirstRowData = oCMLModel.getProperty("/data/detailPage/firstRowData");
                if (!oFirstRowData) {
                    return;
                }

                // Apply first row values to all other rows
                oTable.getItems().forEach(function (oItem, iIndex) {
                    if (iIndex === 0) return;
                    var oContext = oItem.getBindingContext("mCMLModel");
                    var oData = oContext.getObject();

                    oData.renewalDate = oFirstRowData.renewalDate;
                    oData.prevCorrRate = oFirstRowData.prevCorrRate;
                    oData.thickness = oFirstRowData.thickness;  
                    oData.minimumThickness = oFirstRowData.minimumThickness;  
                });
                oCMLModel.refresh(true);
            }
        },

        /**
         * 
         * @returns 
         */
        onCMLDialogOpen: function () {
            var oView = this.getView();
            var that = this;
            var oModel = this.getView().getModel("mCMLModel");
            this._resetCreateCMLDetailData();

            if (this._sObjectId !== this._sLastLoadedObjectId) {
                this._bObjectTemplatesLoaded = false;
                oModel.setProperty("/data/detailPage/create/cml/objectTemplateList", []);
            }
            
            oModel.setProperty("/data/detailPage/create/cml/selectedEqpFloc", {
                objectType: oModel.getProperty("/data/detailPage/headerData/objectType"),
                objectName: oModel.getProperty("/data/detailPage/headerData/objectName")
            });
            
            if (this._oCreateCMLDialog) {
                if (!this._bObjectTemplatesLoaded) {
                    this.fnLoadObjectTemplatesForDetail();
                }
                this._oCreateCMLDialog.open();
                return;
            }
            Fragment.load({
                id: oView.getId(),
                name: "com.asint.ais.mi.cml.view.fragment.DialogDetailCreateCML",
                controller: this
            }).then(function (oDialog) {
                that._oCreateCMLDialog = oDialog;
                oView.addDependent(oDialog);
                that.fnLoadObjectTemplatesForDetail();
                oDialog.open();
            });

        },

        /**
         * 
         */
        _resetCreateCMLDetailData: function () {
            var oModel = this.getView().getModel("mCMLModel");
            oModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplate", "");
            oModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplateName", "");

            oModel.setProperty("/data/detailPage/create/cml/customDataset", []);
            oModel.setProperty("/metaData/detailPage/create/cml/wizard", {
                prevStep: false,
                nextStep: true,
                currStep: 0,
                nextStepEnabled: false,
                createEnabled: false
            });
            oModel.setProperty("/metaData/detailPage/create/cml/valueState/objectTemplate", "None");
            oModel.setProperty("/metaData/detailPage/create/cml/valueStateText/objectTemplate", "");
            
            var aRows = oModel.getProperty("/data/detailPage/create/cml/customDataset") || [];
            oModel.setProperty("/data/detailPage/create/cml/isDeleteEnabled", aRows.length > 1);
        },

        /**
         * 
         */
        onCMLDialogClose: function () {
            this._resetCreateCMLDetailData();
            if (this._oCreateCMLDialog) {
                this._oCreateCMLDialog.close();
            }
        },

        /**
         * 
         */
        fnLoadObjectTemplatesForDetail: function () {
            var oModel = this.getOwnerComponent().getModel("mCMLModel");
            var aExisting = oModel.getProperty("/data/detailPage/create/cml/objectTemplateList");
            if (aExisting && aExisting.length > 0) {
                return;
            }

            var sObjectId = this._sObjectId;
            var sObjectType = this._sObjectType;
            var that = this;

            this.CMLDataSource.getObjectTemplatesNew(
                sObjectId,
                sObjectType,
                function (aTemplates) {

                    var aFormatted = aTemplates.map(function (oT) {
                        return {
                            key: oT.ID,
                            name: oT.to_description && oT.to_description[0] && oT.to_description[0].shortDescription || "",
                            longDescription: (oT.to_description && oT.to_description[0] && oT.to_description[0].longDescription) || "",
                        };
                    });

                    var aFinalList = [{
                        key: "",
                        name: "",
                        description: "",
                    }].concat(aFormatted);

                    oModel.setProperty("/data/detailPage/create/cml/objectTemplateList", aFinalList);
                    that._bObjectTemplatesLoaded = true;
                    that._sLastLoadedObjectId = sObjectId;

                    oModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplate", "");
                    oModel.setProperty("/metaData/detailPage/create/cml/enabled/objectTemplate", true);
                },
                function () {
                    that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.createcml.message001"));
                }
            );
        },

        /**
         * 
         */
        onDetailObjectTemplateChange: function (oEvent) {
            var oModel = this.getView().getModel("mCMLModel");
            var sKey = oEvent.getSource().getSelectedKey();
            var that = this;

            oModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplate", sKey);

            if (!sKey) {
                oModel.setProperty("/metaData/detailPage/create/cml/wizard/nextStepEnabled", false);
                return;
            }

            var oSelectedItem = oEvent.getSource().getSelectedItem();
            var oSelectedData = oSelectedItem.getBindingContext("mCMLModel").getObject();

            oModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplateName", oSelectedData.name);

            this.CMLDataSource.getCMLTemplateByObjetTemplatID(
                sKey,
                function (oResponse) {
                    var aList = [];

                    if (oResponse.to_cml_template) {
                        oResponse.to_cml_template.forEach(function (oCML) {
                            if (oCML.cmlLocationTemplate && !oCML.cmlLocationTemplate.deleted) {
                                aList.push(oCML.cmlLocationTemplate);
                            }
                        });
                    }

                    var aFinal = [{
                        id: "",
                        name: ""
                    }].concat(aList);
                    oModel.setProperty("/data/detailPage/create/cml/locationTemplateList", aFinal);
                    oModel.setProperty("/metaData/detailPage/create/cml/wizard/nextStepEnabled", true);
                },
                function (err) {
                    that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.createcml.message002"), err);
                }
            );
        },

        /**
         * Navigate Create CML Wizard (Detail Page Dialog)
         *
         * @param {Object} oEvent - Event object
         * @param {String} sNavMode - "next" or "prev"
         */
        onCreateCMLWizNav: function (oEvent, sNavMode) {
            var oWizard = sap.ui.core.Fragment.byId(this.getView().getId(),"idDetailCreateCMLWizard");
            var oModel = this.getView().getModel("mCMLModel");

            if (!oWizard) {
                return;
            }
            if (sNavMode === "next") {
                oWizard.nextStep();
            } else {
                oWizard.previousStep();
            }
            var iCurrentStep = oWizard.getProgress();
            oModel.setProperty("/metaData/detailPage/create/cml/wizard/currStep", iCurrentStep);
            this.onValidateDetailCreateCMLWiz("step" + iCurrentStep);
        },

        /**
         * Validate fields for each wizard step inside the Detail Page Create CML Dialog
         */
        onValidateDetailCreateCMLWiz: function (sStep) {

            var oModel = this.getView().getModel("mCMLModel");
            var oCML = oModel.getProperty("/data/detailPage/create/cml");
            if (sStep === "step1") {
                var bTemplateSelected = !!oCML.selectedObjectTemplate;
                oModel.setProperty("/metaData/detailPage/create/cml/wizard/nextStepEnabled", bTemplateSelected);
                oModel.setProperty("/metaData/detailPage/create/cml/wizard/createEnabled", false);
            }
            else if (sStep === "step2") {
                var aRows = oCML.customDataset || [];
                var bAtLeastOneComplete = false;
                var bHasIncomplete = false;
                aRows.forEach(function (oItem) {
                    var bName = !!oItem.name;
                    var bDescp = !!oItem.description;
                    var bTemplate = !!oItem.cmlTemplate;

                    var bComplete = bName && bDescp && bTemplate;
                    var bEmpty = !bName && !bDescp && !bTemplate;

                    if (bComplete) {
                        bAtLeastOneComplete = true;
                    }
                    if (!bComplete && !bEmpty) {
                        bHasIncomplete = true;
                    }
                });

                var bEnableCreate = bAtLeastOneComplete && !bHasIncomplete;
                oModel.setProperty("/metaData/detailPage/create/cml/wizard/createEnabled", bEnableCreate);
                oModel.setProperty("/metaData/detailPage/create/cml/wizard/nextStepEnabled", false);
            }
        },

        /**
         * 
         */
        handleDetailAddNewRow: function () {
            var oModel = this.getView().getModel("mCMLModel");
            var sCount = oModel.getProperty("/data/detailPage/create/cml/addRowCount");
            var iCount = parseInt(sCount, 10);

            if (!iCount || iCount < 1) {
                iCount = 1;
            }

            var aTable = oModel.getProperty("/data/detailPage/create/cml/customDataset") || [];
            if (!Array.isArray(aTable)) {
                aTable = [];
            }

            var oRowTemplate = {
                "name": "",
                "description": "",
                "cmlTemplate": "",
                "nameValueState": "None",
                "nameValueStateText": "",
                "descpValueState": "None"
            };

            for (var i = 0; i < iCount; i++) {
                aTable.push(Object.assign({}, oRowTemplate));
            }

            oModel.setProperty("/data/detailPage/create/cml/customDataset", aTable);
            oModel.setProperty("/data/detailPage/create/cml/addRowCount", "");
            this.fnUpdateDeleteButtonState();
        },

        /**
         * Function to delete the row in Create CML Dialog (Detail Page)
         * @param {Object} oEvent - The event object that triggered this function
         */
        handleDetailDeleteTableRow: function (oEvent) {
            var oModel = this.getView().getModel("mCMLModel");
            var aRows = oModel.getProperty("/data/detailPage/create/cml/customDataset");

            var oBinding = oEvent.getSource().getBindingContext("mCMLModel");
            var index = parseInt(oBinding.getPath().split("/").pop(), 10);

            aRows.splice(index, 1);

            oModel.setProperty("/data/detailPage/create/cml/customDataset", aRows);

            this.fnUpdateDeleteButtonState();
        },


        /**
         * 
         * @param {*} oEvent 
         */
        onDetailTableNumberValChange: function (oEvent) {
            var value = oEvent.getParameter("value");
            var oModel = this.getView().getModel("mCMLModel");

            if (value < 1) {
                oModel.setProperty("/data/detailPage/create/cml/addRowCount", "");
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }
        },

        /**
         * 
         * @param {*} oEvent 
         */
        fnUpdateDeleteButtonState: function () {
            var oModel = this.getView().getModel("mCMLModel");
            var aRows = oModel.getProperty("/data/detailPage/create/cml/customDataset");
            var bEnableDelete = aRows.length > 1;
            oModel.setProperty("/data/detailPage/create/cml/isDeleteEnabled", bEnableDelete);
        },

        /**
         * 
         * @param {*} oEvent 
         */
        onDetailCreateCancel: function () {
            var oModel = this.getView().getModel("mCMLModel");
            var oObjectTemplateList = oModel.getProperty("/data/detailPage/create/cml/objectTemplateList");

            oModel.setProperty("/data/detailPage/create/cml", {
                addRowCount: "",
                selectedObjectTemplate: "",
                selectedObjectTemplateName: "",
                objectTemplateList: oObjectTemplateList,     
                locationTemplateList: [],
                oSelectedObject: {},
                customDataset: [
                    { name: "", description: "", cmlTemplate: "" }
                ],
                isDeleteEnabled: false,                    
                wizard: {
                    prevStep: false,
                    nextStep: false,
                    currStep: 1,
                    nextStepEnabled: false,
                    createEnabled: false
                }
            });

            var oWizard = this.byId("idDetailCreateCMLWizard");
            if (oWizard) {
                oWizard.goToStep(oWizard.getSteps()[0]);
            }

            this._oCreateCMLDialog.close();
        },

        /**
         * 
         * @param {*} oEvent 
         */
        onAfterCreateCMLDialogOpen: function () {
            var oWizard = this.byId("idDetailCreateCMLWizard");

            if (oWizard) {
                oWizard.goToStep(oWizard.getSteps()[0]);
                oWizard.setCurrentStep(oWizard.getSteps()[0]); 
                oWizard.setAllowStepNavigation(false);
            }

            this.onValidateDetailCreateCMLWiz("step1");
            this.fnUpdateDeleteButtonState();
        },

        /**
         * 
         * @param {*} oEvent 
         */
        onDetailTableNameValChange: function (oEvent) {
            var rowContext = oEvent.getSource().getBindingContext("mCMLModel");
            var rowData = rowContext.getObject();
            var value = oEvent.getParameter("value");
            rowData.name = value;

            if (value && value.trim()) {
                oEvent.getSource().setValueState("None");
            } else if (rowData.description) {
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }

            this.onValidateDetailCreateCMLWiz("step2");
        },

        /**
         * 
         * @param {*} oEvent 
         */
        onDetailTableDescpValChange: function (oEvent) {
            var rowContext = oEvent.getSource().getBindingContext("mCMLModel");
            var rowData = rowContext.getObject();
            var value = oEvent.getParameter("value");
            rowData.description = value;

            if (value && value.trim()) {
                oEvent.getSource().setValueState("None");
            } else if (rowData.name) {
                oEvent.getSource().setValueState("Error");
            } else {
                oEvent.getSource().setValueState("None");
            }

            this.onValidateDetailCreateCMLWiz("step2");
        },

        /**
         * 
         * @param {*} oEvent
         */
        onCMLTemplateChange: function (oEvent) {
            var rowContext = oEvent.getSource().getBindingContext("mCMLModel");
            var rowData = rowContext.getObject();
            var key = oEvent.getSource().getSelectedKey();

            rowData.cmlTemplate = key;

            this.onValidateDetailCreateCMLWiz("step2");
        },

        /**
         * Create CML from Detail Page
         */
        onCMLCreate: function () {
            var that = this;
            var oModel = this.getView().getModel("mCMLModel");
            var oMessageBundle = that.getView().getModel("mMessage").getResourceBundle();            
            var sObjectId = this._sObjectId;
            var sObjectType = this._sObjectType;
            
            var aRows = oModel.getProperty("/data/detailPage/create/cml/customDataset") || [];
            var aPayloadList = [];

            var aLocalNames = [];
            var oNameMap = {};
            var i;

            for (i = 0; i < aRows.length; i++) {
                if (aRows[i].name && aRows[i].name.trim() !== "") {
                    var sName = aRows[i].name.trim().toLowerCase();
                    aLocalNames.push(sName);

                    if (!oNameMap[sName]) {
                        oNameMap[sName] = 0;
                    }
                    oNameMap[sName]++;
                }
            }

            for (i in oNameMap) {
                if (oNameMap[i] > 1) {
                    that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE036")); 
                    return;
                }
            }

            var aOriginalNames = [];
            for (i = 0; i < aRows.length; i++) {
                if (aRows[i].name && aRows[i].name.trim() !== "") {
                    aOriginalNames.push(aRows[i].name.trim());
                }
            }

            this.CMLHelper.fnValidateCMLName(aOriginalNames, oModel, "detailPage", function (bBackendFound, aFoundList) {

                if (bBackendFound && aFoundList && aFoundList.length > 0) {
                    that.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE022")); 
                    return;
                }

                var iIndex, row, aLocationTemplates, sPersonaId, oSelectedLocation, x, p;

                for (iIndex = 0; iIndex < aRows.length; iIndex++) {
                    row = aRows[iIndex];
                    if (row.name && row.description && row.cmlTemplate) {

                        aLocationTemplates = oModel.getProperty("/data/detailPage/create/cml/locationTemplateList") || [];
                        sPersonaId = "";
                        oSelectedLocation = null;

                        for (x = 0; x < aLocationTemplates.length; x++) {
                            if (aLocationTemplates[x].id === row.cmlTemplate) {
                                oSelectedLocation = aLocationTemplates[x];
                                break;
                            }
                        }

                        if (oSelectedLocation && oSelectedLocation.to_persona_master) {
                            for (x = 0; x < oSelectedLocation.to_persona_master.length; x++) {
                                p = oSelectedLocation.to_persona_master[x];
                                if (p.type === "DEFN") {
                                    sPersonaId = p.ID;
                                }
                            }
                        }

                        var oPayload = {
                            objectId: sObjectId,
                            objectType: sObjectType,
                            cmlTemplateId: row.cmlTemplate,
                            name: row.name.trim(),
                            active: true,
                            deleted: false,
                            /* eslint-disable-next-line camelcase */
                            persona_id: sPersonaId,
                            /* eslint-disable-next-line camelcase */
                            to_description: [
                                {
                                    shortDescription: row.description.trim(),
                                    language: "en"
                                }
                            ],
                            /* eslint-disable-next-line camelcase */
                            to_values: [
                                {
                                    dataSourcename: "ACTIVE",
                                    dataSourceValue: btoa(JSON.stringify({ value: true })),
                                    referenceId: sObjectId,
                                    referenceType: sObjectType
                                },
                                {
                                    dataSourcename: "DESCRIPTION",
                                    dataSourceValue: btoa(JSON.stringify({ value: row.description.trim() })),
                                    referenceId: sObjectId,
                                    referenceType: sObjectType
                                }
                            ],
                            /* eslint-disable-next-line camelcase */
                            to_equipment: sObjectType === "EQUI" ? [{ equipment_ID: sObjectId }] : [],
                            /* eslint-disable-next-line camelcase */
                            to_location: sObjectType === "FLOC" ? [{ functionalLocation_ID: sObjectId }] : []
                        };

                        aPayloadList.push(oPayload);
                    }
                }

                if (aPayloadList.length === 0) {
                    that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.createcml.message003"));
                    return;
                }

                var iTotal = aPayloadList.length;
                var iCompleted = 0;

                for (var pIndex = 0; pIndex < aPayloadList.length; pIndex++) {
                    var payload = aPayloadList[pIndex];
                    payload = that.setCreatedModified(payload, "POST");

                    that.CMLDataSource.createCML(
                        payload,
                        function () {

                            that.CMLDataSource.getCMLAsset(
                                sObjectId,
                                function (oAsset) {
                                    var bNeedAsset = !oAsset || !oAsset.value || oAsset.value.length === 0;

                                    if (bNeedAsset) {
                                        var oAssetPayload = {
                                            objectId: sObjectId,
                                            objectType: sObjectType,
                                            halfLife: null,
                                            remainingLife: null,
                                            tMin: null,
                                            retirementDate: null,
                                            isGrowth: null,
                                            isBelowTmin: null,
                                            deleted: false
                                        };

                                        oAssetPayload = that.setCreatedModified(oAssetPayload, "POST");
                                        that.CMLDataSource.createCMLAsset(oAssetPayload);
                                    }
                                }
                            );

                            iCompleted++;

                            if (iCompleted === iTotal) {
                                that.onCMLDialogClose();
                                that.fnGetData(that._sObjectType, that._sObjectId);

                                that.fnMessageShow(
                                    "S",
                                    that.oI18n.getText("asint.cml.detail.createcml.message004")
                                );
                            }
                        },
                        function (oError) {
                            that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.createcml.message005"), oError);
                        }
                    );
                }

            });
        },

        /**
         * Get input field value
         * @param {Object} oEvent 
         */
        onReasonRenewChange: function (oEvent) {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var oInput = oEvent.getSource();  
            var sInputValue = oInput.getValue();  
            oCMLModel.setProperty("/data/detailPage/resonForRenew", sInputValue);
        },

        /***
         * Handles the press event on renew cml
         */
        onPressRenewCml : function() {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var sUom = oCMLModel.getProperty("/data/UOM");
            var sUomLabel = sUom === "imperial" ? "in" : "mm";
            var oTable = this.getView().byId("idAsintCMLOverallReading");
            var aSelectedIndices = oTable.getSelectedIndices();
            var aData = aSelectedIndices.map(function (iIndex) {
                var oContext = oTable.getContextByIndex(iIndex);
                return oContext.getObject();  
            });

            // Set data in table
            var aSelectedData = aData.map(function (val) {
                var newVal = Object.assign({}, val);  
                newVal.thickness = val.NOMINAL_THICKNESS;  
                newVal.minimumThickness = val.TMIN;  
                return newVal;             
            })

            //clean data 
            if (aSelectedData) {
                aSelectedData.forEach(function (val) {
                    if (Object.prototype.hasOwnProperty.call(val, "renewalDate")) val.renewalDate = "";
                    if (Object.prototype.hasOwnProperty.call(val, "prevCorrRate")) val.prevCorrRate = "";
                    if (Object.prototype.hasOwnProperty.call(val, "thickness")) val.thickness = val.NOMINAL_THICKNESS;
                    if (Object.prototype.hasOwnProperty.call(val, "minimumThickness")) val.minimumThickness = val.TMIN;
                });
            }
            oCMLModel.setProperty("/data/detailPage/renewCml", aSelectedData);
            oCMLModel.setProperty("/data/detailPage/resonForRenew", "");
            oCMLModel.setProperty("/data/detailPage/isCheckedCml", false);

            if(aSelectedData.length) {
                if (!this._oDailogRenewCml) {
                    Fragment.load({
                        id: "renewCmlFragment",
                        name: "com.asint.ais.mi.cml.view.fragment.DialogCreateRenewCml",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        this._oDailogRenewCml = oDialog;
                        this._oDailogRenewCml.open();

                        // Update column headers after the dialog is rendered
                        setTimeout(function () {
                            var oTable = Fragment.byId("renewCmlFragment", "renewCMLTable");
                            if (oTable) {
                                oTable.getColumns()[4].getHeader().setText("Thickness at Renewal Date (" + sUomLabel + ")");
                                oTable.getColumns()[5].getHeader().setText("Renewed Minimum Thickness (" + sUomLabel + ")");
                            }
                        }, 0);
                    }.bind(this));
                } else {
                    this._oDailogRenewCml.open();
                    setTimeout(function () {
                        var oTable = Fragment.byId("renewCmlFragment", "renewCMLTable");
                        if (oTable) {
                            oTable.getColumns()[4].getHeader().setText("Thickness at Renewal Date (" + sUomLabel + ")");
                            oTable.getColumns()[5].getHeader().setText("Renewed Minimum Thickness (" + sUomLabel + ")");
                        }
                    }, 0);
                }
            }
        },

        /**Applies the same value to all selected cmls */
        onFirstRowChange: function(oEvent) {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var oControl = oEvent.getSource();
            var oTable = sap.ui.core.Fragment.byId("renewCmlFragment","renewCMLTable");

            // Ensure this is the first row
            var oItem = oControl.getParent(); 
            var oIndex = oTable.indexOfItem(oItem);
            if (oIndex !== 0) {
                return; 
            }

            // Get updated first row data
            var oFirstRowContext = oItem.getBindingContext("mCMLModel");
            var oFirstRowData = oFirstRowContext.getObject();

            oCMLModel.setProperty("/data/detailPage/firstRowData", {
                renewalDate: oFirstRowData.renewalDate,
                prevCorrRate: oFirstRowData.prevCorrRate,
                thickness: oFirstRowData.thickness,
                minimumThickness: oFirstRowData.minimumThickness 
            }); 
            
        },

        /**Applies the thickness value to all selected cmls */
        onThicknessChange: function(oEvent) {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var isChecked = oCMLModel.getProperty("/data/detailPage/isCheckedCml");
            var oControl = oEvent.getSource();
            var oTable = sap.ui.core.Fragment.byId("renewCmlFragment", "renewCMLTable");
            var oItem = oControl.getParent(); 
            var oIndex = oTable.indexOfItem(oItem);
            if (oIndex !== 0) {
                return; 
            }
            var oFirstRowContext = oItem.getBindingContext("mCMLModel");
            var oFirstRowData = oFirstRowContext.getObject();
            if (isChecked) {
                oTable.getItems().forEach(function(oOtherItem, iIndex) {
                    if (iIndex === 0) return;  
                    var oContext = oOtherItem.getBindingContext("mCMLModel");
                    var oData = oContext.getObject();
                    oData.thickness = oFirstRowData.thickness;  
                    oContext.getModel().refresh(true);  
                });
            }
        },

        /**Applies the Tmin value to all selected cmls */
        onMinimumThicknessChange: function(oEvent) {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var isChecked = oCMLModel.getProperty("/data/detailPage/isCheckedCml");
            var oControl = oEvent.getSource();
            var oTable = sap.ui.core.Fragment.byId("renewCmlFragment", "renewCMLTable");
            var oItem = oControl.getParent(); 
            var oIndex = oTable.indexOfItem(oItem);
            if (oIndex !== 0) {
                return; 
            }
            var oFirstRowContext = oItem.getBindingContext("mCMLModel");
            var oFirstRowData = oFirstRowContext.getObject();
            if (isChecked) {
                oTable.getItems().forEach(function(oOtherItem, iIndex) {
                    if (iIndex === 0) return;  
                    var oContext = oOtherItem.getBindingContext("mCMLModel");
                    var oData = oContext.getObject();
                    oData.minimumThickness = oFirstRowData.minimumThickness;  
                    oContext.getModel().refresh(true);  
                });
            }
        },

        /**
         * onConfirm renew dialog
         */
        onConfirmRenew: function () {
            var that = this;
            var oCommonModel = that.getView().getModel("mCMLModel");
            var sUom = oCommonModel.getProperty("/data/UOM");
            var oInput = oCommonModel.getProperty("/data/detailPage/resonForRenew");
            var aItems = oCommonModel.getProperty("/data/detailPage/renewCml");
            var aFormattedItem = aItems.map(function (item) {
                return {
                    "cmlId": item.locationId,
                    "reNewalDate": item.renewalDate, 
                    "previousCorrosionRate": item.prevCorrRate,
                    "thicknessAtRenewalDate": +item.thickness,
                    "tMin": +item.minimumThickness,
                    "uom": sUom
                }
            })
            var oPayload = {"selectedCMLs": aFormattedItem} 
            if(oInput){
                that.CMLDataSource.renewCML(oPayload, function (aRes) {
                    if(aRes){
                        that.fnMessageShow("S", that.oI18n.getText("asint.cml.detail.renewCml.message001"));
                        that.onCancelRenew();
                    } else {
                        that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.renewCml.message002"));
                    }
                }, function () {});
            } else {
                that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.renewCml.message003"));
            }     
        },

        /**
         * 
         * Oncancel renew dialog
         */
        onCancelRenew: function () {
            var oCMLModel = this.getView().getModel("mCMLModel");
            var aTable = this.getView().byId("idAsintCMLOverallReading");
            var oRenewTable = sap.ui.core.Fragment.byId("renewCmlFragment","renewCMLTable");
            if (this._oDailogRenewCml) {
                this._oDailogRenewCml.close();
            }
            aTable.clearSelection();
            oCMLModel.setProperty("/data/detailPage/resonForRenew", "");
            oCMLModel.setProperty("/data/detailPage/isCheckedCml", false);
            oCMLModel.setProperty("/data/detailPage/renewCml", []);
            oRenewTable.removeSelections(true);
                                        
        },

        /**
         * Function to handle the Equipment ValuHelp for Create CML
         */
        fnHandleEquipmentValueHelpForCML: function () {

            var that = this;
            var oCommonModel = this.getView().getModel("mCMLModel");

            this.fnHandleTechnicalObjectValueHelp("EQUI", function (oSelectedTechnicalObjectData) {
                if (!oSelectedTechnicalObjectData) {
                    return;
                }
                oCommonModel.setProperty("/data/detailPage/create/cml/selectedEqpFloc", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/detailPage/create/cml/oSelectedObject", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectName", oSelectedTechnicalObjectData.name);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectDescp", oSelectedTechnicalObjectData.desc);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectType", "EQUI");
                oCommonModel.setProperty("/data/detailPage/create/cml/objectType", "EQUI");
                oCommonModel.setProperty("/data/selectedObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/metaData/detailPage/create/cml/valueState/EqpFloc", "None");
                oCommonModel.setProperty("/metaData/detailPage/create/cml/enabled/cmlTemplate", true);
                oCommonModel.setProperty("/metaData/detailPage/create/cml/enabled/objectTemplate", true);
                oCommonModel.setProperty("/data/detailPage/create/cml/selectedObjectData", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplate", "");
                that.getObjectTemplateWithEquipment(oSelectedTechnicalObjectData.objectId, "EQUI");
                // that.fnFetchObjectAndCMLsList(oSelectedTechnicalObjectData.objectId, "EQUI", "CMLCreate");
            });

        },

        /**
         * Function to handle the Functional Location ValuHelp for Create CML
         */
        fnHandleFunctionalLocationValueHelpForCML: function () {

            var that = this;
            var oCommonModel = this.getView().getModel("mCMLModel");

            this.fnHandleTechnicalObjectValueHelp("FLOC", function (oSelectedTechnicalObjectData) {
                oCommonModel.setProperty("/data/detailPage/create/cml/selectedEqpFloc", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/detailPage/create/cml/oSelectedObject", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectName", oSelectedTechnicalObjectData.name);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectDescp", oSelectedTechnicalObjectData.desc);
                oCommonModel.setProperty("/data/detailPage/create/cml/sObjectType", "FLOC");
                oCommonModel.setProperty("/data/detailPage/create/cml/objectType", "FLOC");
                oCommonModel.setProperty("/data/selectedObjectId", oSelectedTechnicalObjectData.objectId);
                oCommonModel.setProperty("/metaData/detailPage/create/cml/valueState/EqpFloc", "None");
                oCommonModel.setProperty("/metaData/detailPage/create/cml/enabled/cmlTemplate", true);
                oCommonModel.setProperty("/metaData/detailPage/create/cml/enabled/objectTemplate", true);
                oCommonModel.setProperty("/data/detailPage/create/cml/selectedObjectData", oSelectedTechnicalObjectData);
                oCommonModel.setProperty("/data/detailPage/create/cml/selectedObjectTemplate", "");
                that.getObjectTemplateWithEquipment(oSelectedTechnicalObjectData.objectId, "FLOC");
                // that.fnFetchObjectAndCMLsList(oSelectedTechnicalObjectData.objectId, "FLOC", "CMLCreate");
            });

        },

        /**
         * @param {String} sObjectID - Selected Object ID
         * @param {String} sObjType - Selected Object Type
         */
        getObjectTemplateWithEquipment: function (sObjectID, sObjType) {

            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var aObjectTemplateList = [];

            that.CMLDataSource.getObjectTemplatesNew(sObjectID, sObjType, function (aResponse) {

                aObjectTemplateList = aResponse && aResponse.length ? aResponse : [];
                
                if (aObjectTemplateList) {
                    // aObjectTemplateList.unshift({});
                    mCMLModel.setProperty("/data/detailPage/create/cml/objectTemplateList", aObjectTemplateList);
                }
            }, function (oError) {
                that.fnMessageShow("E", that._oMessage.getText("CML.MESSAGE017"), oError);
            });

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
                        "objectName": oReturn.selected[0].name,
                        "objectDesc": oReturn.selected[0].to_description,
                        "name": oReturn.selected[0].name,
                        "desc": oReturn.selected[0].to_description,
                        "objectType": sObjectType
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
         * Event handler for CML Copy Paste button triggered based on user select
         * 
         * @param {Object} oEvent - The event object that triggered this function
         */
        onPressMoveCML: function () {
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var selectedItems = oCommonCMLModel.getProperty("/data/detailPage/moveAndPaste/selectedObject");
            var oHeaderDetails = oCommonCMLModel.getProperty("/data/detailPage/headerData");
            if (selectedItems.length === 0) {
                return sap.m.MessageToast.show("Please select at least one CML");
            }

            if (!this._oDialogCmlForSameAsset) {
                Fragment.load({
                    id: "idEditCmlSameAsset",
                    name: "com.asint.ais.mi.cml.view.fragment.DialogMoveCmlForSameAsset",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDialogCmlForSameAsset = oDialog;
                    this._oDialogCmlForSameAsset.open();
                }.bind(this));
            } else {
                this._oDialogCmlForSameAsset.open();
            }
            oCommonCMLModel.setProperty("/data/detailPage/create/cml/objectType", oHeaderDetails.objectType);
        },

        /**
         * Handles saving changes to the 'Move CML To New Asset' dialog
         * 
         * This function performs validation on the new name and description, checks for duplicates,
         * and triggers further actions if validation passes.
         */
        onSaveCmlForNewAsset: function () {
            var that = this; 
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var selectedItems = oCommonCMLModel.getProperty("/data/detailPage/moveAndPaste/selectedObject");
            var selectedTechObj = oCommonCMLModel.getProperty("/data/detailPage/create/cml/oSelectedObject");
            var aTempateDetails = oCommonCMLModel.getProperty("/data/detailPage/create/cml/objectTemplateList");
            if (aTempateDetails.length) {
                if (!aTempateDetails) {
                    that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.moveCml.message001"));
                    return;
                }
                var aPayload = selectedItems.map(function (item){
                    return {
                        "cmlId": item.locationId,
                        "templateId": item.locationTemplateId,
                        "destinedEquipmentId": selectedTechObj.objectId,
                        "referenceType": selectedTechObj.objectType
                    };
                })
                that.CMLDataSource.fnMoveCmlToNewAsset(aPayload, function (oRes) {
                    if (oRes) {
                        that.fnMessageShow("S", that.oI18n.getText("asint.cml.detail.moveCml.message002"));
                        that.onCancelCmlForNewAsset();
                    } else {
                        that.fnMessageShow("E", that.oI18n.getText("asint.cml.detail.moveCml.message003"));
                    }
                }, function () {});
            } 
        },

        /**
         * Closes the 'Edit Name New Asset' dialog if it is open.
         */
        onCancelCmlForNewAsset: function () {
            var oCommonCMLModel = this.getView().getModel("mCMLModel");
            var aTable = this.getView().byId("idAsintCMLOverallReading");
            if (this._oDialogCmlForSameAsset) {
                this._oDialogCmlForSameAsset.close();
                aTable.clearSelection();
                oCommonCMLModel.setProperty("/data/detailPage/create/cml/sObjectName", "");
            }
        },


    });
});
