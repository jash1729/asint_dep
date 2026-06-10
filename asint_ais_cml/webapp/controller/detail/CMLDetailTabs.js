sap.ui.define([
    "sap/ui/base/Object",
    "com/asint/ais/mi/cml/utility/Formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/MessageType",
    "sap/ui/core/BusyIndicator",
    "sap/viz/ui5/controls/VizFrame",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/suite/ui/commons/ChartContainer",
    "sap/suite/ui/commons/ChartContainerContent"
], function (Objects, Formatter, Fragment, Filter, SimpleForm, FilterOperator, MessageType, BusyIndicator, VizFrame, FlattenedDataset, FeedItem, ChartContainer, ChartContainerContent) {
    "use strict";

    return Objects.extend("com.asint.ais.mi.cml.controller.detail.CMLDetailTabs", {

        formatter: Formatter,

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () { },

        /**
         * Initialize the all the function to set Model
         * 
         * @param {Object} oControl - Detail page controller
         * @param {Object} oModel - Detail page Model
         * @param {Object} oSelectedCML - Selected CML
         */
        fnInitialize: function (oControl, oModel, oSelectedCML) {

            this._oControl = oControl;
            this._oControl._mModel = oModel;

            var oCommonCMLModel = oModel;
            var oSelectedPersonaData = oSelectedCML;
            var oDetailModel = {
                "LocationData": {
                    "oTempDataSource": {},
                    "DataSource": {},
                    "Reference": {},
                    "Environment": {
                        "EQUIPMENT_ID": "",
                        "LOCATION_ID": ""
                    },
                    "ValueState": {},
                    "ValueStateText": {},
                    "CodeList": {},
                    "Name": "",
                    "Description": "",
                    "Id": "",
                    "PersonaDetails": {},
                    "DataSourceBEFormat": {},
                    "SELECTED_TMIN": [
                        {
                            "code": 1,
                            "description": "Calculated (Pressure)"
                        },
                        {
                            "code": 2,
                            "description": "Structural"
                        },
                        {
                            "code": 3,
                            "description": "User Defined"
                        }
                    ]
                },
                "Detail": {
                    "Location": [],
                    "ValueState": {},
                    "ValueStateText": {},
                    "LocationsCount": "",
                    "DailogLocationList": [],
                    "DialogLocationPersonaList": [],
                    "LocationPersonaData": {
                        "sectionList": [],
                        "dataSourceList": [],
                        "referenceList": [],
                        "MinifiedDSObject": {}
                    },
                    "EquipmentTempDetails": [],
                    "IconTabBarData": {}, // All Sections Data
                    "CodeList": {},
                    "ApiList": [],
                    "dataSource": {},
                    "ReadingState": true,
                    "PredcThicknessState": false,
                    "iDefaultSelection": 0,
                    "isInitialLoad": true,
                    "vizId": "",
                    "selectedPredictedValue": "default"
                },
                "Picklist": {
                    "MetaData": {
                        "CodeList": {},
                        "FieldConfig": {},   // DataStore Id based Mapped values
                        "TotalPicklist": {}, //Generic Id based Mapped Picklist
                        "Picklist": {},     // Picklist Id based picklist
                        "PicklistSource": {},
                        "MappedPicklistDetail": [],
                        "TotalUIPicklist": []
                    }
                },
                "temp": {
                    "visualizationDataArr": [],
                    "ignoredReadingsDataArr": [],
                    "DisplayUoms": [],
                    "Action": "",
                    "convertedRefValues": {},
                    "ConvertedDsvalues": {}
                },
                "LargeCodeList": {
                    "filters": [],
                    "LargeData": {
                        "key": []
                    },
                },
                "Errors": {},
                "AttributeIndicaorValues": [],
                "CML": {
                    "HistoryTable": {
                        "InfoToolbar": {
                            "Message1": "Selected rows will be ignored. Press save to persist your selection",
                            "Message2": "Highlighted rows are ignored"
                        }
                    },
                    "predictedY": []
                },
                "codeList": {
                    "codeListItem": []
                }
            };

            oCommonCMLModel.setProperty("/data/CMLTabSection", oDetailModel);
            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Environment", {
                EQUIPMENT_ID: oSelectedCML.objectId,
                LOCATION_ID: oSelectedCML.locationId
            });

            this.fnGetData(oSelectedPersonaData);
            this._oControl.fnLoadFeatureFlagConfig();
        },

        /**
         * Get CML Template detail by CML Tempate ID of Selected CML
         * 
         * @param {Object} oSelectedPersonaData - Selected CML
         */
        fnGetData: function (oSelectedPersonaData) {

            var that = this;
            var oController = that._oControl;
            var iCount = 0;
            var oCommonCMLModel = oController._mModel;
            var oModelUom = {};
            var aCmlList = oCommonCMLModel.getProperty("/data/detailPage/aCMLs");
            var oMessageBundle = oController.getView().getModel("mMessage").getResourceBundle();
            var oSelectedCMLDetail = {};

            oSelectedCMLDetail = aCmlList.find(function (oCML) {
                return oCML.ID === oSelectedPersonaData.locationId || oCML.ID === oSelectedPersonaData.location_ID;
            });

            if (!oSelectedCMLDetail) {
                oController.fnMessageShow("E", oMessageBundle.getText("asint.cml.detail.selectCMl.error.message002"));
                return;
            }

            if (!oSelectedCMLDetail.objectType || (oSelectedCMLDetail.objectType !== "EQUI" && oSelectedCMLDetail.objectType !== "FLOC")) {
                oController.fnMessageShow("E", oMessageBundle.getText("asint.cml.detail.selectCMl.error.message001"));
                return;
            }

            oController.CMLDataSource.getCMLTemplateDetailById(oSelectedCMLDetail.cmlTemplateId, function (oSelectedCMLDataSource) {

                oCommonCMLModel.setProperty("/data/selectedCML/", {
                    "name": oSelectedCMLDetail.name,
                    "displayId": oSelectedCMLDetail.displayId,
                    "locDesc": oSelectedCMLDetail.to_description.length > 0 ? oSelectedCMLDetail.to_description[0].shortDescription : "",
                    "cmlTemplate": oSelectedCMLDataSource.name,
                    "modifiedAt": oSelectedCMLDetail.modifiedAt,
                    "objectType": oSelectedCMLDetail.objectType === "EQUI" ? "Equipment" : "Functional Location",
                    "cmlId": oSelectedPersonaData.locationId || oSelectedPersonaData.location_ID,
                    "eTag": oSelectedCMLDetail["@etag"],
                    "objectId": oSelectedCMLDetail.objectId
                });

                var oPersonaData;
                var aDataSourceList = [];
                var oDataSourceValues = [];
                /**
                 * Function to decode Object
                 * 
                 * @param {Object} oValue 
                 * @returns decode Object
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

                if (oSelectedCMLDataSource && oSelectedCMLDataSource.to_persona_master.length > 0) {
                    // oPersonaData = JSON.parse(atob(oSelectedCMLDataSource.to_persona_master[0].to_persona_detail.personaDetail));
                    oPersonaData = {};
                    oSelectedCMLDataSource.to_persona_master.forEach(function(oItem){
                        if(oItem.type === "DEFN" && oItem.to_persona_detail.personaDetail){
                            oPersonaData = JSON.parse(atob(oItem.to_persona_detail.personaDetail));
                        }
                    });

                    oSelectedCMLDataSource.to_data_source_config.forEach(function (oItem) {
                        if (oItem.deleted === false) {
                            aDataSourceList.push(JSON.parse(atob(oItem.dataSourceDetail)));
                        }
                    });

                    oSelectedCMLDetail.to_values.forEach(function (oItem) {
                        if (!oItem.deleted && oItem.dataSourcename !== "ATTACHMENT" && oItem.dataSourceValue !== "") {
                            oItem.dataSourceValue = JSON.stringify(fnDecode(oItem.dataSourceValue));
                            oDataSourceValues.push(oItem);
                        }
                    });
                    oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/PersonaDetails", oPersonaData);

                    that.fnGetSelectedCMLData(oCommonCMLModel, oPersonaData, aDataSourceList, oDataSourceValues, oModelUom, oSelectedPersonaData);
                } else {
                    that.fnGetSelectedCMLData(oCommonCMLModel, {}, [], {}, oModelUom, iCount, oSelectedPersonaData);
                }

            }, function (oError) {

                that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE017"), oError);

            });

        },

        /**
         * Function to Get Selected CML Data
         * 
         * @param {Object} oCommonCMLModel - Detail page Model
         * @param {Object} oPersonaData - Selected CML Persona Data
         * @param {Array} aDataSourceList - Selected CML DataSource as Array
         * @param {Object} oDataSourceValues - Selected CML DataSource as Object
         * @param {Object} oModelUom - Selected UOM
         * @param {Object} oSelectedPersonaData - Selected CML Data
         */
        fnGetSelectedCMLData: function (oCommonCMLModel, oPersonaData, aDataSourceList, oDataSourceValues, oModelUom, oSelectedPersonaData) {

            var that = this;
            var oController = that._oControl;
            var sType = oSelectedPersonaData;
            var oInspectionReading = oCommonCMLModel.getProperty("/data/listPage/create/inspection");
            var oReadings = oInspectionReading && oInspectionReading[oSelectedPersonaData.locationId];
            var CMLReadings = oCommonCMLModel.getProperty("/data/listPage/create/cml/aCMLReadings");
            var oMessageBundle = oController.getView().getModel("mMessage").getResourceBundle();

            if (sType.type === "new") {
                that._isNewData = true;
                oDataSourceValues = [];
            } else {
                that._isNewData = false;
            }

            if (oReadings) {
                oDataSourceValues = oDataSourceValues.concat(oReadings);
            } else {
                //Added by Sarath to render History for newly added CML
                if (CMLReadings) {
                    if (Object.keys(oDataSourceValues).length > 0) {
                        oDataSourceValues = oDataSourceValues.concat(CMLReadings);
                    }
                }
            }
            // Added UI Picklist Mapping by vignesh.ks@asint.net
            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/FieldConfig", {});
            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/MappedPicklistDetail", []);
            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/PicklistSource", {});
            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/CodeList", {});

            if (oSelectedPersonaData) {
                var sCMLTemplateId = oSelectedPersonaData.locationTemplateId || oSelectedPersonaData.cmlLocationTemplate_ID;

                oController.CMLDataSource.fnGetTemplateMappedPicklist(sCMLTemplateId , function (aMappedPicklist) {
                    var aTempMapPicklist = aMappedPicklist.value;
                    if (aTempMapPicklist.length > 0) {
                        var oTempMapPicklist = {},
                            oAssignedPicklistDataFormat = {},
                            oPicklistDataPrepare = {};

                        /**
                         * Function to prepare the Data for Picklist
                         * 
                         * @param {Array} aArguments - Detail page Arguments
                         * @param {String} sSelectedPersonaID - Selected CML Persona ID
                         * @param {Object} oDataSource - DataSource of CML Template
                         * @returns 
                         */
                        var fnPicklistDataPrepare = function (aArguments, sSelectedPersonaID, oDataSource) {

                            var aDataPicklist = [];
                            var oDataPicklistSourceField = {};

                            $.each(aArguments, function (i, oPicklist) {
                                if (oPicklist.objectTemplateId === sSelectedPersonaID) {
                                    //Picklist Mapping
                                    oDataPicklistSourceField[oDataSource[oPicklist.datasourceId]] = oPicklist.picklist_ID;


                                    //Temp Code----------------------------
                                    if (oPicklist.sequence === undefined) {
                                        oPicklist.sequence = (i + 1);
                                    }
                                    //Temp Code----------------------------

                                    oPicklist.sequence = (!isNaN(oPicklist.sequence)) ? parseInt(oPicklist.sequence) : null;
                                    aDataPicklist.push(oPicklist);
                                }
                            });

                            aDataPicklist = fnSortArrayOfObject(aDataPicklist, "sequence");

                            var oData = {
                                "DataPicklist": aDataPicklist,
                                "DataPicklistSourceField": oDataPicklistSourceField
                            };

                            return oData;
                        };

                        /**
                         * Function to sort the list based on column name
                         * 
                         * @param {Array} aList - Sort list
                         * @param {String} sColumnName - Sort Order coloumn
                         * @returns 
                         */
                        var fnSortArrayOfObject = function (aList, sColumnName) {
                            /**
                             * Function to compare one by one
                             * 
                             * @param {Object} a - Index
                             * @param {Object} b - Index
                             * @returns 
                             */
                            function fnCompare(a, b) {
                                if (a[sColumnName] < b[sColumnName]) {
                                    return -1;
                                }
                                if (a[sColumnName] > b[sColumnName]) {
                                    return 1;
                                }
                                return 0;
                            }

                            var aRetList = aList.sort(fnCompare);

                            return aRetList;
                        };

                        oController.CMLDataSource.getTemplateExpandDataSourceConfig(sCMLTemplateId, function (oData) {
                            var oDataSource = [];
                            oData.to_data_source_config.forEach(function (oItem) {
                                oDataSource[oItem.id] = JSON.parse(atob(oItem.dataSourceDetail)).name;
                            });
                            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/dataSource", oDataSource);
                            oController.CMLDataSource.getPicklistAllUiParams(sCMLTemplateId, function (aPicklistParam) {
                                var count = 0;
                                var oPicklist = [];
                                aTempMapPicklist.forEach(function (oMappedData) {
                                    oController.CMLDataSource.fnGetUIPickList(oMappedData.picklistId, function (uiPicklist) {
                                        count = count + 1;
                                        oPicklist[uiPicklist.ID] = JSON.parse(uiPicklist.jsonData);
                                        if (aTempMapPicklist.length === count) {
                                            aPicklistParam.value.forEach(function (oItem) {
                                                if (!oTempMapPicklist[oItem.generic_ID]) {
                                                    oTempMapPicklist[oItem.generic_ID] = [];
                                                    oTempMapPicklist[oItem.generic_ID].push(oItem);
                                                } else {
                                                    oTempMapPicklist[oItem.generic_ID].push(oItem);
                                                }
                                            });
                                            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/TotalPicklist", oTempMapPicklist);

                                            oPicklistDataPrepare = fnPicklistDataPrepare(aPicklistParam.value, sCMLTemplateId, oDataSource);
                                            oAssignedPicklistDataFormat = that.fnReturnArrayOfObj(oPicklistDataPrepare.DataPicklist, oDataSource);

                                            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/FieldConfig", oAssignedPicklistDataFormat);
                                            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/MappedPicklistDetail", oPicklistDataPrepare.DataPicklist);
                                            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/PicklistSource", oPicklistDataPrepare.DataPicklistSourceField);
                                            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/Picklist", oPicklist);

                                            if (oPicklistDataPrepare.DataPicklist.length === Object.keys(oAssignedPicklistDataFormat).length) {
                                                that.fnPrepareCodelist(oCommonCMLModel);
                                            }
                                            that.fnHandleRenderFields(that, oPersonaData, aDataSourceList, oDataSourceValues, oCommonCMLModel, oModelUom);
                                        }
                                    }, function (oError) {
                                        oController.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE005"), oError);
                                        that.fnHandleRenderFields(that, oPersonaData, aDataSourceList, oDataSourceValues, oCommonCMLModel, oModelUom);
                                    });
                                });
                            }, function () {
                                that.fnHandleRenderFields(that, oPersonaData, aDataSourceList, oDataSourceValues, oCommonCMLModel, oModelUom);
                            });
                        }, function (oError) {
                            oController.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE030"), oError);
                        });
                    } else {
                        that.fnHandleRenderFields(that, oPersonaData, aDataSourceList, oDataSourceValues, oCommonCMLModel, oModelUom);
                    }
                }, function (oDataError) {
                    oController.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE006"), oDataError);
                    that.fnHandleRenderFields(that, oPersonaData, aDataSourceList, oDataSourceValues, oCommonCMLModel, oModelUom);
                });
            } else {
                oController.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE033"));
            }

        },

        /**
         * Function to handle the Detail page fileds
         * 
         * @param {Object} oControl - Detail page controller
         * @param {Object} oPersonaData - Selected Persona Data
         * @param {Array} aDataSourceList - Datasource list as Array
         * @param {Object} oDataSourceValues - DataSource list as Object
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oModelUom - UOM Model
         */
        fnHandleRenderFields: function (oControl, oPersonaData, aDataSourceList, oDataSourceValues, oCommonCMLModel, oModelUom) {

            var that = oControl;

            if (typeof (oPersonaData) === "string") {
                var oDataRet = JSON.parse(oPersonaData);
            } else {
                oDataRet = oPersonaData;
            }

            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/LocationPersonaData/sectionList", oDataRet.sectionList);
            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/LocationPersonaData/DataSourceApiList", oDataRet.apiList);
            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList", aDataSourceList);
            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/LocationPersonaData/referenceList", oDataRet.refList);
            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat", oDataSourceValues);

            that.fnReturnProperDataSourceValue(oDataSourceValues, aDataSourceList, oCommonCMLModel, function (oConversionData) {
                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource", oConversionData);

                that.fnGetDisplayUoms(aDataSourceList, oDataRet.refList, oCommonCMLModel, oModelUom);
                that.fnRenderHeaderTabswithData(oPersonaData, aDataSourceList, oDataRet.refList, oCommonCMLModel);

                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/oTempDataSource", Object.assign(JSON.stringify(oConversionData)));
            }, function (oConversionData) {
                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource", oConversionData);

                that.fnGetDisplayUoms(aDataSourceList, oDataRet.refList, oCommonCMLModel, oModelUom);
                that.fnRenderHeaderTabswithData(oPersonaData, aDataSourceList, oDataRet.refList, oCommonCMLModel);

                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/oTempDataSource", Object.assign(JSON.stringify(oConversionData)));
            });

        },

        /**
         * Function to convert the Array to Object based on ID
         * 
         * @param {Array} aData - Array List
         * @param {Object} oDataSource - DataSource list as Object
         * @returns {Object} - oData - Object data based on DataSource ID
         */
        fnReturnArrayOfObj: function (aData, oDataSource) {

            var oData = {};

            aData.forEach(function (oItem) {
                oData[oDataSource[oItem.datasourceId]] = {
                    "pickListId": oItem.picklist_ID,
                    "columnId": oItem.pickListColumn.columnName,
                    "sequence": oItem.sequence
                };
            });

            aData.forEach(function (oItem) {
                oData[oDataSource[oItem.datasourceId]].dependency = aData.filter(function (item) { return (oDataSource[item.datasourceId] !== oDataSource[oItem.datasourceId] && item.generic_ID === oItem.generic_ID); });
            });

            return oData;

        },

        /**
         * Function to prepare the codelist data
         * 
         * @param {Object} oCommonCMLModel - Detail page model
         */
        fnPrepareCodelist: function (oCommonCMLModel) {

            var oCodelist = {};
            var oCodelistData = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/CodeList");
            var oFieldConfig = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/FieldConfig");
            var oPicklist = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/Picklist");
            var aDataSource = Object.keys(oFieldConfig);

            aDataSource.forEach(function (sDatasourceId) {

                var oCodelistItem = {};
                var sPropertyName = oFieldConfig[sDatasourceId].columnId;
                var sPickListId = oFieldConfig[sDatasourceId].pickListId;

                if (oPicklist[sPickListId]) {
                    oPicklist[sPickListId].forEach(function (oPicklistData) {
                        var aColumns = Object.keys(oPicklistData);
                        if (!oCodelistItem[oPicklistData[sPropertyName]]) {
                            oCodelistItem[oPicklistData[sPropertyName]] = {
                                code: (oPicklistData[sPropertyName]).toString(),
                                description: {
                                    short: (oPicklistData[sPropertyName]).toString()
                                },
                                filterKeys: {}
                            };
                            aColumns.forEach(function (sColumn) {
                                oCodelistItem[oPicklistData[sPropertyName]].filterKeys[sColumn] = "__";
                            });
                        }
                        aColumns.forEach(function (sColumn) {
                            if (!oCodelistItem[oPicklistData[sPropertyName]].filterKeys[sColumn].includes(oPicklistData[sColumn] + "__")) {
                                oCodelistItem[oPicklistData[sPropertyName]].filterKeys[sColumn] += oPicklistData[sColumn] + "__";
                            }
                        });
                    });
                }
                oCodelist[sDatasourceId] = Object.values(oCodelistItem);

            });

            if (Object.keys(oCodelistData).length > 0) {
                oCodelistData = Object.assign(oCodelistData, oCodelist);
            } else {
                oCodelistData = oCodelist;
            }

            oCommonCMLModel.setProperty("/data/CMLTabSection/Picklist/MetaData/CodeList", oCodelistData);

        },

        /**
         * @param {string} val 
         * @returns formatted date for ui
         */
        normalizeDate: function (val) {
            if (!val) return "";
            var sDate, oDate;
            if (typeof val === "string") {
                // If "2025-10-31T00:00:00.000Z"
                if (val.includes("T")) {
                    sDate = val.split("T")[0];
                    var [year, month, day] = sDate.split("-").map(Number);
                    oDate = new Date(year, month - 1, day);
                    return oDate;
                }
                // if date format is "MM-DD-YYYY"
                if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
                    var [mons, days, yyyy] = val.split("-");
                    sDate = `${yyyy}-${mons}-${days}`;
                    var [yy, mm, dd] = sDate.split("-").map(Number);
                    oDate = new Date(yy, mm - 1, dd);
                    return oDate;
                }
                // Case 2: "YYYY-MM-DD"
                if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                    sDate = val;
                    var [yr, mon, dy] = sDate.split("-").map(Number);
                    oDate = new Date(yr, mon - 1, dy);
                    return oDate;
                }
                return val;
            }
            // If value is a Date object
            if (val instanceof Date) {
                sDate = val.toISOString().split("T")[0]; 
                var [sYear, sMonth, sDay] = sDate.split("-").map(Number);
                oDate = new Date(sYear, sMonth - 1, sDay);
                return oDate; 
            }
            return "";
        },

        /**
         * Function to prepare the Datasourcevalue
         * 
         * @param {Array} aDataSourceValues - DataSource value list as Array
         * @param {Array} aDataSourceList - DataSource list as Array
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Function} fnSuccess - Success callback Function
         * @param {Function} fnError - Error callback Function
         */
        fnReturnProperDataSourceValue: function (aDataSourceValues, aDataSourceList, oCommonCMLModel, fnSuccess, fnError) {

            var that = this;
            var oData = {};
            var aDataSource = aDataSourceValues;
            var oDataSourceList = {};
            var oSelectedCML = oCommonCMLModel.getProperty("/data/selectedCML");
            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            $.each(aDataSourceList, function (i, oDS) {
                if (oDS.dataType === "table") {
                    $.each(oDS.tableCols, function (j, oTC) {
                        if (!oDataSourceList[oDS.name]) {
                            oDataSourceList[oDS.name] = {};
                        }
                        oDataSourceList[oDS.name][oTC.name] = oTC;
                    });
                } else {
                    oDataSourceList[oDS.name] = oDS;
                }
            });

            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/LocationPersonaData/MinifiedDSObject", oDataSourceList);

            /**
             * Function to check the dataSource value for fields render
             * 
             * @param {Array} aSelectedDataSourceValues 
             */
            var doThisOperation = function (aSelectedDataSourceValues) {
                $.each(aSelectedDataSourceValues, function (i, oVal) {
                    if (oVal.dataSourceValue && JSON.parse(oVal.dataSourceValue).value !== null && typeof (JSON.parse(oVal.dataSourceValue).value) === "object") {
                        var oPropertyValue = JSON.parse(oVal.dataSourceValue).value;
                        if (!oData[oVal.dataSourcename]) {
                            oData[oVal.dataSourcename] = [];
                        }
                        if (Object.keys(oPropertyValue).length > 0) {
                            var oTempDsValues = {};
                            $.each(Object.keys(oPropertyValue), function (k, oDsTc) {
                                if (oDataSourceList[oVal.dataSourcename][oDsTc] && oDataSourceList[oVal.dataSourcename][oDsTc].dataType === "date") {
                                    oTempDsValues[oDsTc] = that.normalizeDate(oPropertyValue[oDsTc]);
                                    // oTempDsValues[oDsTc] = oPropertyValue[oDsTc] ? new Date(oPropertyValue[oDsTc] + "T00:00:00Z") : oPropertyValue[oDsTc];
                                } else if (oDataSourceList[oVal.dataSourcename][oDsTc] && oDataSourceList[oVal.dataSourcename][oDsTc].dataType === "numeric") {
                                    oTempDsValues[oDsTc] = oPropertyValue[oDsTc] ? parseInt(oPropertyValue[oDsTc], 0) : oPropertyValue[oDsTc];
                                } else if (oDataSourceList[oVal.dataSourcename][oDsTc] && oDataSourceList[oVal.dataSourcename][oDsTc].dataType === "numericflexible" && sUom === "imperial") {
                                    oTempDsValues[oDsTc] = oPropertyValue[oDsTc] ? that.fnToHandlePrecisionScale(oPropertyValue[oDsTc], oDataSourceList[oVal.dataSourcename][oDsTc]) : oPropertyValue[oDsTc];
                                } else {
                                    oTempDsValues[oDsTc] = oPropertyValue[oDsTc];
                                }
                            });
                            oTempDsValues.dataId = oVal.ID;
                            if (oSelectedCML.cmlId === oVal.cml_ID) {
                                oData[oVal.dataSourcename].push(oTempDsValues);
                            }
                        }

                    } else if (oVal.dataSourceValue && JSON.parse(oVal.dataSourceValue).value !== null) {
                        if (oDataSourceList[oVal.dataSourcename] && oDataSourceList[oVal.dataSourcename].dataType === "date") {
                            // oData[oVal.dataSourcename] = new Date(JSON.parse(oVal.dataSourceValue).value);
                            if (oSelectedCML.cmlId === oVal.cml_ID) {
                                //Add "T00:00:00" to avoid timezone issue
                                oData[oVal.dataSourcename] = that.normalizeDate(JSON.parse(oVal.dataSourceValue).value);
                            }
                        }else if (oDataSourceList[oVal.dataSourcename] && oDataSourceList[oVal.dataSourcename].dataType === "numericflexible" && sUom === "imperial") {
                            oData[oVal.dataSourcename] = that.fnToHandlePrecisionScale(JSON.parse(oVal.dataSourceValue).value, oDataSourceList[oVal.dataSourcename]);
                        }else {
                            if (oSelectedCML.cmlId === oVal.cml_ID) {
                                oData[oVal.dataSourcename] = JSON.parse(oVal.dataSourceValue).value;
                            }
                        }
                    } else if (oVal.dataSourceValue && JSON.parse(oVal.dataSourceValue) && JSON.parse(oVal.dataSourceValue).value === null) {
                        if (oSelectedCML.cmlId === oVal.cml_ID) {
                            oData[oVal.dataSourcename] = that.fnToReturnValueOfType(JSON.parse(oVal.dataSourceValue).value, oDataSourceList[oVal.dataSourcename].dataType);
                        }
                    }
                });
            };

            /**
             * Function to format numericflexible fields based on metadata
             * 
             * @param {Object} oData - The conversion result data (output from doThisOperation)
             * @param {Object} oDataSourceList - The metadata object containing field definitions
             */
            var fnFormatNumericFlexibleFields = function (oData, oDataSourceList) {
                var oFormattedData = {};
                $.each(Object.keys(oData), function (index, sFieldName) {
                    var fieldValue = oData[sFieldName];
                    var fieldMetadata = oDataSourceList[sFieldName];
                    if (Array.isArray(fieldValue) && fieldMetadata && typeof fieldMetadata === "object") {
                        oFormattedData[sFieldName] = [];
                        $.each(fieldValue, function (i, oRow) {

                            var oFormattedRow = {};
                            $.each(Object.keys(oRow), function (j, sColumnName) {
                                var columnValue = oRow[sColumnName];
                                var columnMetadata = fieldMetadata[sColumnName];

                                if (columnMetadata && columnMetadata.dataType === "numericflexible" && columnValue !== null && columnValue !== undefined) {
                                    oFormattedRow[sColumnName] = that.fnToHandlePrecisionScale(columnValue, columnMetadata);
                                } else {
                                    oFormattedRow[sColumnName] = columnValue;
                                }
                            });
                            
                            oFormattedData[sFieldName].push(oFormattedRow);
                        });
                    } 

                    else if (fieldMetadata && fieldMetadata.dataType === "numericflexible" && fieldValue !== null && fieldValue !== undefined) {
                        oFormattedData[sFieldName] = that.fnToHandlePrecisionScale(fieldValue, fieldMetadata);
                    } 
                    
                    else {
                        oFormattedData[sFieldName] = fieldValue;
                    }
                });
                
                return oFormattedData;
            };

            if (aDataSource.length >= 1) {
                aDataSource = aDataSourceValues.filter(function (oDs) {
                    return oDs.referenceType === "EQUI" || oDs.referenceType === "FLOC";
                });
                if (aDataSource.length > 0) {
                    doThisOperation(aDataSource);
                }

                aDataSource = [];

                aDataSource = aDataSourceValues.filter(function (oDs) {
                    return oDs.referenceType === "CL";
                });

                if (aDataSource.length > 0) {
                    doThisOperation(aDataSource);
                }

                aDataSource = [];

                aDataSource = aDataSourceValues.filter(function (oDs) {
                    return oDs.referenceType === "IDMS";
                });

                if (aDataSource.length > 0) {
                    doThisOperation(aDataSource);
                }

            }

            var fnApplyBaselineReadingDash = function (oResult) {
                var bIsCmlSummaryEnabled = oCommonCMLModel.getProperty("/metaData/featureFlag/cmlSummaryValidations") === "1";
                if (!bIsCmlSummaryEnabled) {
                    return oResult;
                }

                var aBaselineFields = ["SHORT_TERM_CORROSION_RATE", "LONG_TERM_CORROSION_RATE", "REMAINING_LIFE", "HALF_LIFE"];

                if (oResult["READINGS"] && Array.isArray(oResult["READINGS"]) && oResult["READINGS"].length > 1) {
                    var oOldestReading = null;
                    $.each(oResult["READINGS"], function (iIndex, oReading) {
                        if (
                            !oOldestReading ||
                            new Date(oReading.DATE) < new Date(oOldestReading.DATE)
                        ) {
                            oOldestReading = oReading;
                        }
                    });

                    if (oOldestReading) {

                        $.each(aBaselineFields, function (iIndex, sField) {
                            var fValue = Number(oOldestReading[sField]);
                            if (
                                !isNaN(fValue) &&
                                fValue === 0
                            ) {

                                oOldestReading["IS_BASELINE_" + sField] = true;

                            }

                        });

                    }

                }

                return oResult;
            };

            if (sUom === "metric") {
                that.fnUoMConvertImperialToMetric(oCommonCMLModel, oData, function (oConversionResult) {
                    var result = fnFormatNumericFlexibleFields(oConversionResult, oDataSourceList);
                    fnSuccess(fnApplyBaselineReadingDash(result));
                }, function () {
                    fnError(oData);
                });
            } else {
                fnSuccess(fnApplyBaselineReadingDash(oData));
            }

        },

        /**
         * Function to render the detail page header tabs based on Configuration
         * 
         * @param {Object} oPersona - Persona list
         * @param {Array} aDataSourceList - DataSource list
         * @param {Array} aReferenceList - Reference List
         * @param {Object} oCommonCMLModel - Detail page Model
         */
        fnRenderHeaderTabswithData: function (oPersona, aDataSourceList, aReferenceList, oCommonCMLModel) {

            var that = this;
            var oController = that._oControl;
            var oIconTabBar = oController.getView().byId("iconTabBar");
            var selectIconTab = false;
            var oMessageBundle = oController.getView().getModel("mMessage").getResourceBundle();

            oIconTabBar.removeAllItems();

            /**
             * Function to handle the Form content render
             */
            function fnHandleFormContentData() {
                if (Object.keys(oPersona).length) {
                    oPersona.sectionList.forEach(function (aItem) {
                        oIconTabBar.addItem(new sap.m.IconTabFilter({
                            text: aItem.description.short,
                            content: [
                                that.fnCreateContainer(aItem, aDataSourceList, aReferenceList, oCommonCMLModel, function (oRenderSuccess) {
                                    selectIconTab = true;
                                    return oRenderSuccess;
                                }, function () {
                                    selectIconTab = false;
                                })
                            ]
                        }))
                    });
                }

                if (selectIconTab) {
                    if (that._currentIconTab) {
                        var oSelectedData = oIconTabBar.getItems().find(function (item) {
                            return item.getProperty("text") === that._currentIconTab;
                        });
                        if (oSelectedData) {
                            oIconTabBar.setSelectedItem(oSelectedData);
                        } else {
                            oIconTabBar.setSelectedItem(oIconTabBar.getItems()[0]);
                        }
                    } else {
                        oIconTabBar.setSelectedItem(oIconTabBar.getItems()[0]);
                    }
                }
            }

            var aCodeListDisplayId = [];
            aDataSourceList.forEach(function (oItem) {
                if (oItem.codeListDisplayId) {
                    aCodeListDisplayId.push(oItem.codeListDisplayId);
                }
            });

            if (aCodeListDisplayId.length > 0) {
                that._oControl.CMLDataSource.getCodeListByDisplayId(aCodeListDisplayId, function (aCodeListItem) {
                    if (aCodeListItem.value.length > 0) {
                        var oCodeListObject = {};
                        aCodeListItem.value.forEach(function (oCodelist) {
                            var aTemp = [];
                            oCodelist.to_codeListItem.forEach(function(oCodelistItem) {
                                var oTemp = {
                                    "code": oCodelistItem.code,
                                    "description": oCodelistItem.to_description && oCodelistItem.to_description.length > 0 ? oCodelistItem.to_description[0].shortDescription : ""
                                };
                                aTemp.push(oTemp);
                            });
                            oCodeListObject[oCodelist.ID] = aTemp;
                        });
                        oCommonCMLModel.setProperty("/data/CMLTabSection/codeList/codeListItem", oCodeListObject);
                    }
                    fnHandleFormContentData();
                }, function (oError) {
                    that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE034"), oError);
                });
            } else {
                fnHandleFormContentData();
            }

        },

        /**
         * Capture Current selected tab
         * 
         * @param {Object} oEvent - The event object for the press action
         */
        fnOnSelectIconFilter: function (oEvent) {

            this._currentIconTab = oEvent.getParameters().item.getProperty("text");

        },

        /**
         * Function to create a container for CML Detail page
         * 
         * @param {Array} aItem - CML Template configuration data
         * @param {Array} aDataSourceList - DataSource list
         * @param {Array} aReferenceList - Reference list
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Function} fnSuccess - Success Callback function
         * @param {Function} fnError - Error Callback function
         * @returns 
         */
        fnCreateContainer: function (aItem, aDataSourceList, aReferenceList, oCommonCMLModel, fnSuccess, fnError) {

            var that = this;
            var oModelUom = {};
            var aSectionContainer = [];

            if (aItem.vizList) {
                aItem.vizList.forEach(function (oVizList) {
                    if (oVizList.type === "Form") {
                        aSectionContainer.push(that.fnGetFormContent(oVizList, aDataSourceList, aReferenceList, oCommonCMLModel));
                    } else {
                        var aHistory = ["CML History Graph", "CML Data"],
                            oPanel = {},
                            aPanel = [];
                        aHistory.forEach(function (aPanelName) {
                            oPanel = new sap.m.Panel({
                                headerText: aPanelName,
                                expandable: true,
                                expanded: true,
                                content: [
                                    that.fnBindHistoryPanelData(that, aPanelName, oVizList, aDataSourceList, aReferenceList, oCommonCMLModel, oModelUom)
                                ]
                            });
                            aPanel.push(oPanel);
                        });
                        aSectionContainer.push(aPanel);
                    }
                });

                oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/IconTabBarData", aSectionContainer);

                if (aSectionContainer) {
                    return fnSuccess(aSectionContainer);
                } else {
                    return fnError(aSectionContainer);
                }
            }

        },

        /**
         * Function to render the Form content in detail page
         * 
         * @param {Object} oVizList - CML Template Viz configuration list
         * @param {Array} aDataSourceList - DataSource list
         * @param {Array} aReferenceList - Reference list
         * @param {Object} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnGetFormContent: function (oVizList, aDataSourceList, aReferenceList, oCommonCMLModel) {

            var that = this;
            var aData = [];
            var aSelectedRef = [];
            var aSelectedDataSource = [];
            var aSectionContent = [];
            var oPicklistSource = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/PicklistSource");
            var oConfigPicklistField = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/FieldConfig");
            var bPicklist = false;
            var aSeqArr = [];
            var aNonSeqArr = [];
            var aFormSeqArrFinal = [];

            //Added by vignesh.ks@asint.net for UI Picklist
            oVizList.vizConfigFormList.forEach(function (oItem) {
                if (oConfigPicklistField[oItem.dataSourceRefName]) {
                    oItem.sequence = oConfigPicklistField[oItem.dataSourceRefName].sequence
                }
            });

            // Splitting Sequence/Non-Sequence array
            oVizList.vizConfigFormList.forEach(function (oItem) {
                if (oConfigPicklistField[oItem.dataSourceRefName]) {
                    aSeqArr.push(oItem);
                } else {
                    aNonSeqArr.push(oItem);
                }
            });

            // Sort the Sequence Array
            aSeqArr.sort(function (a, b) {
                return a.sequence - b.sequence;
            });

            // Getting Middle Number to add Sequence array
            var aMiddleIdxNonSeqArray = (Math.round(aNonSeqArr.length / 2)) - 1;

            // Adding Sequence Array to middle of non sequence array
            aNonSeqArr.forEach(function (oItem, idx) {
                if (idx + 1 === aMiddleIdxNonSeqArray) {
                    aFormSeqArrFinal.push(oItem);
                    Array.prototype.push.apply(aFormSeqArrFinal, aSeqArr);
                } else {
                    aFormSeqArrFinal.push(oItem);
                }
            });

            // Commented the below code to displayed the Background section fields 
            // to display based on CML Template Viz table Config
            // oVizList.vizConfigFormList = aNonSeqArr;

            $.each(oVizList.vizConfigFormList, function (ilist, oList) { // ilist is index and oList is object
                if (oList.dataSourceRefType === "R") {
                    aSelectedRef = aReferenceList.filter(function (refList) {
                        return refList.name === oList.dataSourceRefName;
                    });

                    if (aSelectedRef && aSelectedRef.length >= 1) {
                        aData.push(that.fnCreateFieldLabel(oList));
                        aData.push(that.fnCreateField(aSelectedRef[0], oList, oCommonCMLModel));

                        aData.push(that.fnCreateUomField(aSelectedRef[0], oCommonCMLModel));
                    }
                } else if (oList.dataSourceRefType === "D") {
                    aSelectedDataSource = aDataSourceList.filter(function (dsList) {
                        return dsList.name.toUpperCase() === oList.dataSourceRefName.toUpperCase();
                    });
                    // Changed by Gururaj ----------------------------------------------//
                    if (aSelectedDataSource && aSelectedDataSource.length >= 1) {

                        //Changes by vignesh.ks@asint.net for UI picklist
                        if (oPicklistSource && oPicklistSource[aSelectedDataSource[0].name]) {
                            bPicklist = true;
                        } else {
                            bPicklist = false;
                        }

                        if (oList.columnName) {
                            var aSelectedColumnDS = aSelectedDataSource[0].tableCols.filter(function (oVal) {
                                return oVal.name === oList.columnName;
                            });
                            if (aSelectedColumnDS && aSelectedColumnDS.length >= 1) {
                                aData.push(that.fnCreateFieldLabel(oList));
                                aData.push(that.fnCreateField(aSelectedColumnDS[0], oList, oCommonCMLModel, bPicklist));

                                aData.push(that.fnCreateUomField(aSelectedColumnDS[0], oCommonCMLModel));
                            }
                        } else {
                            aData.push(that.fnCreateFieldLabel(oList));
                            aData.push(that.fnCreateField(aSelectedDataSource[0], oList, oCommonCMLModel, bPicklist));

                            aData.push(that.fnCreateUomField(aSelectedDataSource[0], oCommonCMLModel));
                        }
                    }
                    //-------------------------------------------------------------------//
                }
            });

            if (aData.length > 0) {
                aSectionContent.push(that.fnCreateForm(oVizList.description, aData));
            }

            return aSectionContent;

        },

        /**
         * Function to create a label for header tab
         * 
         * @param {Object} oList - Datasource fields
         * @returns Label of the Header tab
         */
        fnCreateFieldLabel: function (oList) {

            if (oList.dataSourceRefName === "SELECTED_TMIN") {
                return new sap.m.Label({
                    required: oList.optionCode ? (oList.optionCode === "2" ? true : false) : false,
                    text: "Selected Tmin"
                });
            } else {
                return new sap.m.Label({
                    required: oList.optionCode ? (oList.optionCode === "2" ? true : false) : false,
                    text: oList.label
                });
            }

        },

        /**
         * 
         * @param {Object} oReference 
         * @param {Object} oList 
         * @param {Object} oCommonCMLModel 
         * @param {Boleean} bPicklist 
         * @returns 
         */
        fnCreateField: function (oReference, oList, oCommonCMLModel, bPicklist) {

            var that = this;
            var editFlag = oList.editFlag === (true || false) ? oList.editFlag : false;
            var sDataType = oReference.dataType;
            var oDataSourceValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var sLabel = oReference.name;
            var oField = {};
            var sPath = "";
            var sValueState = "";
            var sValueStateText = "";
            var dsValue = "";
            var sTempVal = "";
            var bEditFlag = {
                parts: ["mCMLModel>/data/isPublished"],
                formatter: function (isPublished) {
                    return !isPublished && editFlag;
                }.bind(this)
            };

            if (oList.dataSourceRefType === "D") {
                sValueState = "{mCMLModel>/data/CMLTabSection/LocationData/ValueState/" + oList.dataSourceRefType + "_" + sLabel + "}";
                sValueStateText = "{mCMLModel>/data/CMLTabSection/LocationData/ValueStateText/" + oList.dataSourceRefType + "_" + sLabel + "}";
                if (oList.columnName) {
                    sPath = "{mCMLModel>/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0/" + sLabel + "}";

                    if (!oDataSourceValues[oList.dataSourceRefName]) {
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName, []);
                    }

                    if (oDataSourceValues[oList.dataSourceRefName] && !oDataSourceValues[oList.dataSourceRefName][0] || !oDataSourceValues[oList.dataSourceRefName][0][sLabel]) {
                        if (!oDataSourceValues[oList.dataSourceRefName][0]) {
                            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0", {});
                        }
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0/" + sLabel, null);
                    } else if (oDataSourceValues[oList.dataSourceRefName][0][sLabel] && oReference.dataType === "numericflexible") {
                        dsValue = that.fnToHandlePrecisionScale(oDataSourceValues[oList.dataSourceRefName][0][sLabel], oReference);
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0/" + sLabel, dsValue);
                    } else if (oDataSourceValues[oList.dataSourceRefName][0][sLabel] && oReference.dataType === "date") {
                        if (editFlag) {
                            dsValue = oDataSourceValues[oList.dataSourceRefName][0][sLabel];
                        } else {
                            // dsValue = that.fnGetUIDate(new Date(oDataSourceValues[oList.dataSourceRefName][0][sLabel]));
                            //Changed bcoz UI time issue (time zone isssue)
                            dsValue = oDataSourceValues[oList.dataSourceRefName][0][sLabel];
                        }
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0/" + sLabel, dsValue);
                    } else if (oDataSourceValues[oList.dataSourceRefName][0][sLabel] && oReference.dataType === "boolean") {
                        sTempVal = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0" + sLabel);
                        if (!sTempVal || sTempVal === "") {
                            dsValue = false;
                        }
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oList.dataSourceRefName + "/0/" + sLabel, dsValue);
                    }

                } else {
                    sPath = "{mCMLModel>/data/CMLTabSection/LocationData/DataSource/" + sLabel + "}";
                    if (oReference.dataType !== "boolean" && !oDataSourceValues[sLabel] && oDataSourceValues[sLabel] !== 0) {
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel, "");
                    } else if (oDataSourceValues[sLabel] && oReference.dataType === "numericflexible") {
                        dsValue = that.fnToHandlePrecisionScale(oDataSourceValues[sLabel], oReference);
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel, dsValue);
                    } else if (oDataSourceValues[sLabel] && oReference.dataType === "date") {
                        if (editFlag) {
                            // dsValue = new Date(oDataSourceValues[sLabel]);
                            //Changed bcoz UI time issue (time zone isssue)
                            // dsValue = new Date(oDataSourceValues[sLabel]);
                            dsValue = oDataSourceValues[sLabel];
                        } else {
                            // dsValue = that.fnGetUIDate(new Date(oDataSourceValues[sLabel]));
                            dsValue = oDataSourceValues[sLabel];
                        }
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel, dsValue);
                    } else if (oDataSourceValues[sLabel] && oReference.dataType === "boolean") {
                        sTempVal = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel);
                        if (!sTempVal || sTempVal === "") {
                            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel, false);
                        }
                    }
                    //bug fix by chandini 03/08/2020
                    else if (!oDataSourceValues[sLabel] && oReference.dataType === "boolean") {
                        sTempVal = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel);
                        if (!sTempVal || sTempVal === "") {
                            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + sLabel, false);
                        }
                    }

                }
            } else if (oList.dataSourceRefType === "R") {
                sPath = "{mCMLModel>/data/CMLTabSection/LocationData/Reference/" + sLabel + "}";
                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + sLabel, null);
                sValueState = "{mCMLModel>/data/CMLTabSection/LocationData/ValueState/" + oList.dataSourceRefType + "_" + sLabel + "}";
                sValueStateText = "{mCMLModel>/data/CMLTabSection/LocationData/ValueStateText/" + oList.dataSourceRefType + "_" + sLabel + "}";
            }

            //Changed by vignesh.ks@asint.net For UI picklist
            var aCode = [];
            var valueHelpFun = {};
            if (oReference && oReference.codeListId && (sDataType === "string")) {

                aCode = oCommonCMLModel.getProperty("/data/CMLTabSection/codeList/codeListItem/" + oReference.codeListId);

                /**
                 * Function to trigger the valueHelp
                 * 
                 * @param {Object} oEvent - The event object for the press action
                 */
                valueHelpFun = function (oEvent) { that.onCodelistValueHelpReq(that, oEvent, oCommonCMLModel); };

                if (aCode) {
                    if (aCode.length < 50) {
                        oField = new sap.m.ComboBox({
                            editable: bEditFlag,
                            showSecondaryValues: true,
                            items: {
                                path: "mCMLModel>/data/CMLTabSection/codeList/codeListItem/" + oReference.codeListId,
                                sorter: {
                                    path: "mCMLModel>description"
                                },
                                template: new sap.ui.core.ListItem({
                                    key: "{mCMLModel>code}",
                                    text: "{mCMLModel>description}",
                                    additionalText: "{mCMLModel>code}"
                                })
                            },
                            selectedKey: sPath,
                            width: "100%",
                            /**
                             * Function to trigger the comboBox changed
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                var sVal = oEvent.getParameter("newValue");
                                var sKey = oEvent.getSource().getSelectedItem();
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");
                                if (sVal !== "" && sKey === null) {
                                    oEvent.getSource().setValueState("Error");
                                    oEvent.getSource().setValue("");
                                }

                                that.fnHandlePicklist(oEvent.getSource().getBinding("selectedKey").getPath(), oCommonCMLModel, false);
                            },
                            valueState: sValueState,
                            valueStateText: sValueStateText
                        });
                    } else {
                        oField = new sap.m.Input({
                            width: "100%",
                            editable: bEditFlag,
                            showValueHelp: true,
                            valueHelpRequest: valueHelpFun,
                            /**
                             * Function when user type, will suggest the data
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            suggest: function (oEvent) { that.onLargeCLSuggest(oEvent, oCommonCMLModel); },
                            showSuggestion: true,
                            suggestionItems: {
                                path: "mCMLModel>/data/CMLTabSection/codeList/codeListItem/" + oReference.codeListId,
                                sorter: {
                                    path: "mCMLModel>description"
                                },
                                template: new sap.ui.core.ListItem({
                                    key: "{mCMLModel>code}",
                                    text: "{mCMLModel>description}",
                                    additionalText: "{mCMLModel>code}"
                                })
                            },
                            value: sPath,
                            /**
                             * Function when user change the Input field
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                var sVal = oEvent.getParameter("newValue");
                                var sKey = oEvent.getSource().getSelectedItem();
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");

                                if (sVal !== "" && sKey === null) {
                                    oEvent.getSource().setValueState("Error");
                                    oEvent.getSource().setValue("");
                                }
                            },
                            valueState: sValueState,
                            valueStateText: sValueStateText
                        });
                    }
                    oField.addStyleClass("idmsSectionFieldComboBox" + " idmsField" + sLabel);
                }
            } else if (bPicklist && (sDataType === "string" || sDataType.toUpperCase() === "NUMERIC" || sDataType.toUpperCase() === "NUMERICFLEXIBLE" || sDataType.toUpperCase() === "CURRENCY" || sDataType.toUpperCase() === "DATE")) {

                aCode = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/CodeList/" + sLabel);

                /**
                 * Function to trigger the valueHelp
                 * 
                 * @param {Object} oEvent - The event object for the press action
                 */
                valueHelpFun = function (oEvent) { that.onCodelistValueHelpReq(that, oEvent, oCommonCMLModel); };

                if (aCode) {
                    if (aCode.length < 50) {
                        oField = new sap.m.ComboBox({
                            editable: bEditFlag,
                            showSecondaryValues: true,
                            items: {
                                path: "mCMLModel>/data/CMLTabSection/Picklist/MetaData/CodeList/" + sLabel,
                                sorter: {
                                    path: "mCMLModel>description/short"
                                },
                                template: new sap.ui.core.ListItem({
                                    key: "{mCMLModel>code}",
                                    text: "{mCMLModel>description/short}",
                                    additionalText: "{mCMLModel>code}"
                                })
                            },
                            selectedKey: sPath,
                            width: "100%",
                            /**
                             * Function to trigger the comboBox changed
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                var sVal = oEvent.getParameter("newValue");
                                var sKey = oEvent.getSource().getSelectedItem();
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");
                                if (sVal !== "" && sKey === null) {
                                    oEvent.getSource().setValueState("Error");
                                    oEvent.getSource().setValue("");
                                }

                                that.fnHandlePicklist(oEvent.getSource().getBinding("selectedKey").getPath(), oCommonCMLModel, false);
                            },
                            valueState: sValueState,
                            valueStateText: sValueStateText
                        });
                    } else {
                        oField = new sap.m.Input({
                            width: "100%",
                            editable: bEditFlag,
                            showValueHelp: true,
                            valueHelpRequest: valueHelpFun,
                            /**
                             * Function when user type, will suggest the data
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            suggest: function (oEvent) { that.onLargeCLSuggest(oEvent, oCommonCMLModel); },
                            showSuggestion: true,
                            suggestionItems: {
                                path: "mCMLModel>/data/CMLTabSection/Picklist/MetaData/CodeList/" + sLabel,
                                sorter: {
                                    path: "mCMLModel>description/short"
                                },
                                template: new sap.ui.core.ListItem({
                                    key: "{mCMLModel>code}",
                                    text: "{mCMLModel>description/short}",
                                    additionalText: "{mCMLModel>code}"
                                })
                            },
                            value: sPath,
                            /**
                             * Function when user change the Input field
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                var sVal = oEvent.getParameter("newValue");
                                var sKey = oEvent.getSource().getSelectedItem();
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");

                                if (sVal !== "" && sKey === null) {
                                    oEvent.getSource().setValueState("Error");
                                    oEvent.getSource().setValue("");
                                }
                            },
                            valueState: sValueState,
                            valueStateText: sValueStateText
                        });
                    }
                    oField.addStyleClass("idmsSectionFieldComboBox" + " idmsField" + sLabel);
                }
            } else {
                if (sLabel === "SELECTED_TMIN") {
                    oField = new sap.m.ComboBox({
                        editable: bEditFlag,
                        showSecondaryValues: true,
                        items: {
                            path: "mCMLModel>/data/CMLTabSection/LocationData/" + sLabel,
                            template: new sap.ui.core.ListItem({
                                key: "{mCMLModel>code}",
                                text: "{mCMLModel>code}",
                                additionalText: "{mCMLModel>description}"
                            })
                        },
                        selectedKey: sPath,
                        width: "100%",
                        /**
                         * Function to trigger the comboBox changed
                         * 
                         * @param {Object} oEvent - The event object for the press action
                         */
                        change: function (oEvent) {
                            var sVal = oEvent.getParameter("newValue");
                            var sKey = oEvent.getSource().getSelectedItem();
                            oEvent.getSource().setValueState("None");
                            oEvent.getSource().setValueStateText("");
                            if (sVal !== "" && sKey === null) {
                                oEvent.getSource().setValueState("Error");
                                oEvent.getSource().setValue("");
                            }

                            that.fnHandlePicklist(oEvent.getSource().getBinding("selectedKey").getPath(), oCommonCMLModel, false);
                        },
                        valueState: sValueState,
                        valueStateText: sValueStateText
                    });
                } else {
                    if (sDataType && sDataType === "string") {
                        oField = new sap.m.Input({
                            value: sPath,
                            editable: bEditFlag,
                            valueLiveUpdate: true,
                            valueState: sValueState,
                            valueStateText: sValueStateText,
                            /**
                             * Function to trigger the Input changed
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");
                            }
                        });
                    } else if (sDataType && sDataType === "boolean") {
                        sTempVal = oCommonCMLModel.getProperty(sPath.slice(7, sPath.length - 1));
                        if (!sTempVal || sTempVal === "") {
                            oCommonCMLModel.setProperty(sPath.slice(7, sPath.length - 1), false);
                        }
                        oField = new sap.m.Switch({
                            customTextOff: "NO",
                            customTextOn: "Yes",
                            enabled: bEditFlag,
                            state: sPath,
                            /**
                             * Function to trigger the Switch changed
                             * 
                             */
                            change: function () { }
                        });
                    } else if (sDataType && sDataType.toUpperCase() === "NUMERIC") {
                        oField = new sap.m.Input({
                            type: "Number",
                            value: sPath,
                            editable: bEditFlag,
                            valueLiveUpdate: true,
                            valueState: sValueState,
                            valueStateText: sValueStateText,
                            /**
                             * Function to trigger the Input changed
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");
                            }
                        });
                    } else if (sDataType && (sDataType.toUpperCase() === "NUMERICFLEXIBLE" || sDataType.toUpperCase() === "CURRENCY")) {
                        oField = new sap.m.Input({
                            type: "Text",
                            valueLiveUpdate: true,
                            value: sPath,
                            valueState: sValueState,
                            valueStateText: sValueStateText,
                            editable: bEditFlag,
                            /**
                             * Function to trigger the Input changed
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function () {
                                // oEvent.getSource().setValueState("None");
                            }
                        });

                        // Setting previous value on focus-in
                        oField.attachBrowserEvent("focusin", function (oRef) {
                            oRef.target.setAttribute("previousvalue", oRef.target.value);
                        });

                        oField.attachLiveChange(function (oEvent) {
                            var iTotalLength = parseInt(oReference.totalLengthOfNum, 0),
                                iScale = parseInt(oReference.decimalPlacesAllowed, 0);
                            var vCurValue = oEvent.getSource().getValue().toString().trim();
                            var oInputDOM = oEvent.getSource().getFocusDomRef();

                            if (vCurValue === "" || vCurValue === ".") {
                                oEvent.getSource().setValue(vCurValue);
                                // Updating previous value
                                return oInputDOM.setAttribute("previousvalue", vCurValue);
                            }

                            // Changing back to previous value incase of Invalid input
                            if (isNaN(Number(vCurValue))) {
                                return oEvent.getSource().setValue(oInputDOM.getAttribute("previousvalue"));
                            }

                            if (vCurValue !== undefined && vCurValue !== null && vCurValue.toString().indexOf(".") === -1) {
                                vCurValue = parseFloat(vCurValue, 0);
                            }
                            var sZero = /^[0.]+$/;
                            if (sZero.test(vCurValue)) {
                                var sCurValue = vCurValue.toString();
                                if (sCurValue.indexOf(".") > -1) {
                                    vCurValue = sCurValue.substring(0, (sCurValue.indexOf(".") + Number(oReference.totalLengthOfNum) + 1));
                                }
                            } else {

                                if (oReference && (vCurValue.length > (iTotalLength + 1) || (vCurValue.toString().indexOf(".") >= 0 && vCurValue.toString().split(
                                    ".")[1].length > iScale))) {
                                    vCurValue = vCurValue ? parseFloat(vCurValue, 0) : 0;
                                    vCurValue = parseFloat(vCurValue.toFixed(iScale));
                                }
                                // vCurValue = vCurValue ? parseFloat(vCurValue, 0) : 0;
                                // vCurValue = parseFloat(vCurValue.toFixed(oReference.decimalPlacesAllowed));
                            }
                            oEvent.getSource().setValue(vCurValue);

                            // Updating previous value
                            oInputDOM.setAttribute("previousvalue", vCurValue);

                            vCurValue = vCurValue ? parseFloat(vCurValue, 0) : 0;
                            if (that.fnCountDecimals(vCurValue, false) > (iTotalLength -
                                iScale)) {
                                // oEvent.getSource().setValueState("Error");
                                // oEvent.getSource().setValueStateText("Precision value is exceeded Please Follow (Precision : " + oReference.totalLengthOfNum +
                                // 	" Scale : " + oReference.decimalPlacesAllowed + ")");
                                oCommonCMLModel.setProperty(sValueState.slice(7, sValueState.length - 1), "Error");
                                oCommonCMLModel.setProperty(sValueStateText.slice(7, sValueStateText.length - 1),
                                    "Precision value is exceeded Please Follow (Precision : " + iTotalLength +
                                    " Scale : " + iScale + ")");

                            } else {
                                // oEvent.getSource().setValueState("None");
                                // oEvent.getSource().setValueStateText("");
                                oCommonCMLModel.setProperty(sValueState.slice(7, sValueState.length - 1), "None");
                                oCommonCMLModel.setProperty(sValueStateText.slice(7, sValueStateText.length - 1), "");
                            }
                        });
                    } else if (sDataType && (sDataType.toUpperCase() === "DATE")) {
                        if (editFlag) {
                            oField = new sap.m.DatePicker({
                                value: {
                                    path: sPath.substring(1, sPath.length - 1),
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        style: "long"
                                    }
                                },
                                editable: bEditFlag,
                                valueState: sValueState,
                                valueStateText: sValueStateText,
                                /**
                                 * Function to trigger the DatePicker changed
                                 * 
                                 * @param {Object} oEvent - The event object for the press action
                                 */
                                change: function (oEvent) {
                                    oEvent.getSource().setValueState("None");
                                    oEvent.getSource().setValueStateText("");
                                }
                            });
                        } else {
                            oField = new sap.m.Text({
                                text: {
                                    path: sPath.substring(1, sPath.length - 1),
                                    type: "sap.ui.model.type.Date",
                                    formatOptions: {
                                        style: "long"
                                    }
                                }
                            });
                        }

                    } else {
                        oField = new sap.m.Input({
                            value: sPath,
                            editable: bEditFlag,
                            valueLiveUpdate: true,
                            /**
                             * Function to trigger the Input changed
                             * 
                             * @param {Object} oEvent - The event object for the press action
                             */
                            change: function (oEvent) {
                                oEvent.getSource().setValueState("None");
                                oEvent.getSource().setValueStateText("");
                            }
                        });
                    }
                }
            }

            return oField;

        },

        /**
         * Function to create UOM field
         * 
         * @param {Object} oReference - Reference list
         * @param {Object} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnCreateUomField: function (oReference, oCommonCMLModel) {

            var sUom = "";
            var aDisplayUoms = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/DisplayUoms");

            for (var iDx in aDisplayUoms) {
                if (aDisplayUoms[iDx].id === oReference.name && aDisplayUoms[iDx].uomDisplay) {
                    sUom = aDisplayUoms[iDx].uomDesc;
                }
            }

            return new sap.m.Text({
                text: sUom
            }).addStyleClass("asintIDMSFieldUoM");

        },

        /**
         * Function to create a form
         * 
         * @param {String} sTitle - Form Title
         * @param {Array} aContent - Content to render as Form
         * @returns 
         */
        fnCreateForm: function (sTitle, aContent) {

            if (sTitle) {
                return new SimpleForm({
                    title: sTitle,
                    editable: true,
                    width: "100%",
                    singleContainerFullSize: false,
                    content: aContent,
                    layout: "ResponsiveLayout"
                });
            } else {
                return new SimpleForm({
                    editable: true,
                    width: "100%",
                    singleContainerFullSize: false,
                    content: aContent,
                    layout: "ResponsiveLayout"
                });
            }

        },

        /**
         * Function to open the valueHelp Dailog
         * 
         * @param {Object} oControl - Detail page controller
         * @param {Object} oEvent - The event object for the press action
         * @param {Object} oCommonCMLModel - Detail page model
         */
        onCodelistValueHelpReq: function (oControl, oEvent, oCommonCMLModel) {

            var that = oControl;
            var sFragmentPath = "com.asint.ais.mi.cml.view.fragment.DialogLargeCodelist";
            var sKey = oEvent.getSource().aCustomStyleClasses[1].split("idmsField")[1];
            var aFilters = oCommonCMLModel.getProperty("/data/CMLTabSection/LargeCodeList/filters/" + oEvent.getSource().aCustomStyleClasses[1]);

            oCommonCMLModel.setProperty("/data/CMLTabSection/LargeCodeList/LargeData", oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/CodeList/" + sKey));
            oCommonCMLModel.setProperty("/data/CMLTabSection/LargeCodeList/LargeData/key", oEvent.getSource());

            if (!that._oValueHelpDialoglargeCodelist) {
                Fragment.load({
                    name: sFragmentPath,
                    controller: that
                }).then(function (oFragment) {
                    that._oValueHelpDialoglargeCodelist = oFragment;
                    that._oControl.getView().addDependent(that._oValueHelpDialoglargeCodelist);

                    if (aFilters && aFilters.length > 0) {
                        that._oValueHelpDialoglargeCodelist.getBinding("items").filter(aFilters);
                    }

                    // Open ValueHelpDialog filtered by the input's value	
                    that._oValueHelpDialoglargeCodelist.open();
                });
            } else {
                if (aFilters && aFilters.length > 0) {
                    that._oValueHelpDialoglargeCodelist.getBinding("items").filter(aFilters);
                }

                // Open ValueHelpDialog filtered by the input's value	
                that._oValueHelpDialoglargeCodelist.open();
            }

        },

        /**
         * Function to filter the ValueHelp data
         * 
         * @param {Object} oEvent - The event object for the press action
         */
        onLargeCLValueHelpSearch: function (oEvent) {

            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("code", FilterOperator.Contains, sValue);

            oEvent.getSource().getBinding("items").filter([oFilter]);

        },

        /**
         * Function to Close the ValueHelp Dialog
         * 
         * @param {Object} oEvent - The event object for the press action
         */
        onLargeCLValueHelpClose: function (oEvent) {

            var that = this;
            var oCommonCMLModel = that._oControl._mModel;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sKey = oCommonCMLModel.getProperty("/data/CMLTabSection/LargeCodeList/LargeData/key");

            if (!oSelectedItem) {
                return;
            }
            sKey.setValue(oSelectedItem.getTitle());

            that.fnHandlePicklist(sKey.aCustomStyleClasses[1].split("idmsField")[1], oCommonCMLModel, false);

            that._oControl.getView().removeDependent(that._oValueHelpDialoglargeCodelist);
            that._oValueHelpDialoglargeCodelist.destroy();
            that._oValueHelpDialoglargeCodelist = null;

        },

        /**
         * 
         * @param {*} sSourceFieldModelPath 
         * @param {*} oCommonCMLModel 
         * @param {*} bInitialRender 
         * @returns 
         */
        fnHandlePicklist: function (sSourceFieldModelPath, oCommonCMLModel, bInitialRender) {

            var that = this;
            var oDataIDMS = oCommonCMLModel.getProperty("/data");
            var oDataSource = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/dataSource");
            var oPicklist = oDataIDMS.CMLTabSection.Picklist;
            var oMappedFields = oCommonCMLModel.getProperty("/data/CMLTabSection/Picklist/MetaData/MappedPicklistDetail");

            if (!sSourceFieldModelPath) {
                that.fnMessageShow("E", "Field Binding Missing");
                return;
            }

            var sAttributeId = sSourceFieldModelPath.substring(sSourceFieldModelPath.lastIndexOf("/") + 1);
            var sPicklistId = oPicklist.MetaData.PicklistSource[sAttributeId];

            // Only if Picklist is exist for current field
            if (sPicklistId) {
                var aPicklistAttributeMap = oPicklist.MetaData.FieldConfig[sAttributeId];
                that.fnSetFilter(oMappedFields, aPicklistAttributeMap, oCommonCMLModel, oPicklist, bInitialRender, oDataSource);
            }

        },

        /**
         * Function to Apply the filter in ValeHelp based on codelist selection sequence
         * 
         * @param {String} sFieldId - Filter ID
         * @param {Array} aFilter - Filter list
         * @param {Object} oCommonCMLModel - Detail page model
         */
        fnApplyFilter: function (sFieldId, aFilter, oCommonCMLModel) {

            var oField = sap.ui.getCore().byId(sFieldId);
            var oBinding = oField.getBinding("items");

            var oModelFilter = new sap.ui.model.Filter({
                filters: aFilter
            });

            if (typeof oBinding === "undefined") {
                oCommonCMLModel.setProperty("/data/CMLTabSection/LargeCodeList/filters/" + oField.aCustomStyleClasses[1], aFilter);
            } else {
                oBinding.filter(oModelFilter);
            }

        },

        /**
         * Function will display the Suggestion list based on user type in search field
         * 
         * @param {Object} oEvent - The event object for the press action
         * @param {*} oCommonCMLModel - Detail page model
         */
        onLargeCLSuggest: function (oEvent, oCommonCMLModel) {

            var aFilters = oCommonCMLModel.getProperty("/data/CMLTabSection/LargeCodeList/filters" + oEvent.getSource().aCustomStyleClasses[1]);

            if (aFilters && aFilters.length > 0) {
                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            }

        },

        /**
         * Function to set the filter based on user selection
         * 
         * @param {Object} oMappedFields - Mapped Filed list
         * @param {Array} aPicklistAttributeMap - Picklist (codelist) mapping
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oPicklist - Picklist data
         * @param {Boolean} bInitialRender - Initial load Boolean
         * @param {Object} oDataSource - DataSource list
         */
        fnSetFilter: function (oMappedFields, aPicklistAttributeMap, oCommonCMLModel, oPicklist, bInitialRender, oDataSource) {

            var that = this;
            var aFilters = []
            var aParentDependency = [];
            var aCurrentField = [];
            var aChildDependency = [];

            oMappedFields.forEach(function (oItem) {
                if (oItem.picklist_ID === aPicklistAttributeMap.pickListId) {
                    if (oItem.sequence < aPicklistAttributeMap.sequence) {
                        aParentDependency.push(oItem);
                    } else if (oItem.sequence === aPicklistAttributeMap.sequence) {
                        aCurrentField.push(oItem);
                    } else {
                        aChildDependency.push(oItem);
                    }
                }
            });

            if (!bInitialRender && aCurrentField.length > 0) {
                aCurrentField.forEach(function (oItem) {
                    var sFieldValue = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/" + oDataSource[oItem.datasourceId]);
                    var aFilterField = new sap.ui.model.Filter(("filterKeys/" + oItem.pickListColumn.columnName), sap.ui.model.FilterOperator.Contains, "__" + sFieldValue + "__");
                    aFilters.push(aFilterField);
                });
            }

            if (aParentDependency.length > 0) {
                aParentDependency.forEach(function (oItem) {
                    var sFieldValue = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/" + oDataSource[oItem.datasourceId]);
                    var aFilterField = new sap.ui.model.Filter(("filterKeys/" + oItem.pickListColumn.columnName), sap.ui.model.FilterOperator.Contains, "__" + sFieldValue + "__");
                    aFilters.push(aFilterField);
                });
            }
            if (bInitialRender) {
                aCurrentField.forEach(function (oItem) {
                    if (oPicklist.MetaData.PicklistSource[oDataSource[oItem.datasourceId]]) {
                        if ($(".idmsField" + oDataSource[oItem.datasourceId])[0]) {
                            var sFieldId = $(".idmsField" + oDataSource[oItem.datasourceId])[0].getAttribute("id");
                            if (sFieldId) {
                                that.fnApplyFilter(sFieldId, aFilters, oCommonCMLModel);
                            }
                        }
                    }
                });
            } else if (aChildDependency.length > 0) {
                aChildDependency.forEach(function (oItem) {
                    if (oPicklist.MetaData.PicklistSource[oDataSource[oItem.datasourceId]]) {
                        if ($(".idmsField" + oDataSource[oItem.datasourceId])[0]) {
                            var sFieldId = $(".idmsField" + oDataSource[oItem.datasourceId])[0].getAttribute("id");
                            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oDataSource[oItem.datasourceId], "");
                            if (sFieldId) {
                                that.fnApplyFilter(sFieldId, aFilters, oCommonCMLModel);
                            }
                        }
                    }
                });
            }

        },

        /**
         * Function to Display the UOM after the Input fields
         * 
         * @param {Array} aDataSourceList - DataSource list
         * @param {Array} aReferenceList - Referecnce list
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oModelUom - UOM Model
         */
        fnGetDisplayUoms: function (aDataSourceList, aReferenceList, oCommonCMLModel, oModelUom) {

            var that = this;
            var sUom = "";
            var oAttrInd = {};
            var sUomSystem = oCommonCMLModel.getProperty("/data/UOM");
            var aDimension = oCommonCMLModel.getProperty("/data/detailPage/master/response/uom");
            var aUoms = [];
            var aSlectedUomDescription = [];
            var aSlectedDiminsion = [];
            var sUomDesc = "";

            for (var iDx in aDataSourceList) {
                sUom = "";
                if (aDataSourceList[iDx] && aDataSourceList[iDx].tableCols && aDataSourceList[iDx].tableCols.length >= 1) {
                    for (var iTx in aDataSourceList[iDx].tableCols) {
                        aUoms.push(that.fnReturnUomForDataSource(aDataSourceList[iDx].tableCols[iTx], oCommonCMLModel));
                    }
                } else {
                    aUoms.push(that.fnReturnUomForDataSource(aDataSourceList[iDx], oCommonCMLModel));
                }
            }

            for (iDx in aReferenceList) {
                sUom = "";
                sUomDesc = "";
                if (aReferenceList[iDx].source === "I") {
                    if (aReferenceList[iDx].dimension) {
                        sUom = (sUomSystem === "imperial") ? aReferenceList[iDx].uomImperial : aReferenceList[iDx].uomMetric;

                        aSlectedDiminsion = aDimension.filter(function (oDim) {
                            return oDim.id === aReferenceList[iDx].dimension;
                        });
                        if (aSlectedDiminsion[0] && aSlectedDiminsion[0].units) {
                            aSlectedUomDescription = aSlectedDiminsion[0].units.filter(function (oUom) {
                                return oUom.id === sUom;
                            });
                            if (aSlectedUomDescription[0] && aSlectedUomDescription[0].longDescription) {
                                sUomDesc = aSlectedUomDescription[0].longDescription;
                            }
                        }
                        if (sUomSystem === "imperial") {
                            if (aReferenceList[iDx].uomImperial) {
                                sUom = aReferenceList[iDx].uomImperial;
                            }
                        } else if (sUomSystem === "metric") {
                            if (aReferenceList[iDx].uomMetric) {
                                sUom = aReferenceList[iDx].uomMetric;
                            }
                        }

                        if (sUom === "") {
                            // Pick from our file
                            sUom = oModelUom.getProperty("/" + oAttrInd.dimension1 + "/" + sUomSystem);
                        }

                        aUoms.push({
                            "id": aReferenceList[iDx].name,
                            "uomDisplay": sUom,
                            "uomDesc": sUomDesc
                        });
                    }
                } else if (aReferenceList[iDx].source === "E") {
                    var oEquipmentAttIndObject = oCommonCMLModel.getProperty("/data/Detail/EquipmentAttIndObject"); //Added by Gururaj 
                    var sKey = aReferenceList[iDx].EquipmentTemplateID + "_" + aReferenceList[iDx].groupId + "_" + aReferenceList[iDx].attrIndId;
                    oAttrInd = oEquipmentAttIndObject[sKey];

                    if (oAttrInd && oAttrInd.dimension1) {
                        sUom = (sUomSystem === "imperial") ? aReferenceList[iDx].uomImperial : aReferenceList[iDx].uomMetric;
                        if (!sUom) {
                            // Pick from our file
                            sUom = oModelUom.getProperty("/" + oAttrInd.dimension1 + "/" + sUomSystem);
                        }
                        aSlectedDiminsion = aDimension.filter(function (oDim) {
                            return oDim.id === oAttrInd.dimension1;
                        });
                        if (aSlectedDiminsion[0] && aSlectedDiminsion[0].units) {
                            aSlectedUomDescription = aSlectedDiminsion[0].units.filter(function (oUom) {
                                return oUom.id === sUom;
                            });
                            if (aSlectedUomDescription[0] && aSlectedUomDescription[0].longDescription) {
                                sUomDesc = aSlectedUomDescription[0].longDescription;
                            }
                        }
                        if (sUomSystem === "imperial") {
                            if (aReferenceList[iDx].uomImperial) {
                                sUom = aReferenceList[iDx].uomImperial;
                            }
                        } else if (sUomSystem === "metric") {
                            if (aReferenceList[iDx].uomMetric) {
                                sUom = aReferenceList[iDx].uomMetric;
                            }
                        }

                        if (!sUom) {
                            // Pick from our file
                            sUom = oModelUom.getProperty("/" + oAttrInd.dimension1 + "/" + sUomSystem);
                        }

                        aUoms.push({
                            "attIndId": sKey,
                            "id": aReferenceList[iDx].name,
                            "uomDisplay": sUom,
                            "uomDesc": sUomDesc
                        });
                    }
                }
            }

            oCommonCMLModel.setProperty("/data/CMLTabSection/temp/DisplayUoms", aUoms);

        },

        /**
         * Function to return the UOM for DataSource fields
         * 
         * @param {Array} aDataSourceList - DataSource list
         * @param {Object} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnReturnUomForDataSource: function (aDataSourceList, oCommonCMLModel) {

            var sUomSystem = oCommonCMLModel.getProperty("/data/UOM");
            var aDimension = oCommonCMLModel.getProperty("/data/detailPage/metadata/uom/desc");
            var sUomDesc = "";
            var sUom = (sUomSystem === "imperial") ? aDataSourceList.uomImperial : aDataSourceList.uomMetric;

            if (sUomSystem && sUomSystem === "imperial") {
                sUomDesc = aDimension[aDataSourceList.uomImperial];
            } else {
                sUomDesc = aDimension[aDataSourceList.uomMetric];
            }

            return {
                "id": aDataSourceList.name,
                "uomDisplay": sUom,
                "uomDesc": sUomDesc
            };

        },

        /**
         * Function to Bind the data in History tab panel
         * 
         * @param {*} oController - Detail page Control
         * @param {*} sPanelName - Panel Name
         * @param {*} oVizList - Vizframe list as Object
         * @param {*} aDataSourceList - DataSource list
         * @param {*} aReferenceList - Reference list
         * @param {*} oCommonCMLModel - Detail page model
         * @param {*} oModelUom - UOM Model
         * @returns 
         */
        fnBindHistoryPanelData: function (oController, sPanelName, oVizList, aDataSourceList, aReferenceList, oCommonCMLModel, oModelUom) {

            var aFields = [];
            var that = oController;
            this._oVBOX = {};

            if (sPanelName === "CML Data") {
                aFields.push(oController.fnCreateForm("", oController.fnGenerateTable(oVizList, aDataSourceList, aReferenceList, oCommonCMLModel, oModelUom)));
            } else {
                // var aTableCellsData = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/READINGS");

                // Viz Graph toggle button section
                aFields.push(that.fnCreateToggleSwitchSection(oCommonCMLModel));

                var oVBox = new sap.m.HBox({
                    items: [],
                    alignItems: "Center",
                    justifyContent: "Center",
                    renderType: "Bare"
                });

                this._oVBOX = oVBox;

                var oChart = that.fnStoreIgnoredReadingsonGetSave(oCommonCMLModel);
                if (oChart) {
                    oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/vizId", oVBox);
                    this._oVBOX.removeAllItems();
                    this._oVBOX.addItem(oChart);
                }

                // Viz Graph section
                // var oChart = that.fnStoreIgnoredReadingsonGetSave(oCommonCMLModel);

                aFields.push(oVBox);
            }

            return aFields;

        },

        /**
         * Function to initiate Create Switch button 
         * @param {Object} oCommonCMLModel - CML Model
         * @returns - Switch model
         */
        fnCreateToggleSwitchSection: function (oCommonCMLModel) {

            var that = this;

            return new sap.m.HBox({
                items: [
                    that.fnCreateSwitch("Reading vs Tmin:", true, "/data/CMLTabSection/Detail/ReadingState", oCommonCMLModel),
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
                    // that.fnCreateSwitch("Predicted Thickness(CR)", false, "/data/CMLTabSection/Detail/PredcThicknessState", oCommonCMLModel)
                ],
                alignItems: "Center",
                justifyContent: "End"
            });

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

            var sReadingState = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/ReadingState");
            var sPredcThicknessState = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/PredcThicknessState");
            var iDefaultSelected = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/iDefaultSelection");

            if (sType && sType === "Predicted") {
                if (sSelectedKey === "default") {
                    sPredcThicknessState = false;
                } else {
                    sPredcThicknessState = true;
                }
                oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/PredcThicknessState", sPredcThicknessState);
                oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/selectedPredictedValue", sSelectedKey);
            }

            if (sReadingState && sPredcThicknessState) {
                iDefaultSelected = 2;
            } else if (sReadingState) {
                iDefaultSelected = 0;
            } else if (sPredcThicknessState) {
                iDefaultSelected = 1;
            }

            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/iDefaultSelection", iDefaultSelected);
            oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/isInitialLoad", false);
            this.fnStoreIgnoredReadingsonGetSave(oCommonCMLModel);

        },

        /**
         * Function to Add feed to the Graph
         * 
         * @param {Object} oVizFrame - CML Template viz Frame
         * @param {Object} oSettings
         */
        fnGraphAddFeed: function (oVizFrame, oSettings) {

            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem(oSettings));

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
            var aTableCellsData = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/READINGS");
            var sReadingState = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/ReadingState");
            var sPredcThicknessState = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/PredcThicknessState");
            var iDefaultSelected = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/iDefaultSelection");
            var sPredictedValue = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/selectedPredictedValue");
            var aPredictedThickness = [];

            if (sPredictedValue !== "default") {
                aPredictedThickness = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/PREDICTED_THICKNESS_"+sPredictedValue);
                if (aPredictedThickness && aPredictedThickness.length > 0) {
                    var aTemp = [];
                    var iPredictedLength = Object.keys(aPredictedThickness[0]).length - 1;

                    for (let index = 0; index < iPredictedLength; index++) {
                        aTemp.push(aPredictedThickness[0][index]);
                    }

                    aPredictedThickness = aTemp;
                }
            }

            // Process and format data
            if (aTableCellsData && aTableCellsData.length > 0) {
                for (var j in aTableCellsData) {
                    var tempObj = {};
                    var iUTCDate = aTableCellsData[j].DATE || aTableCellsData[j].date;
                    var date = Formatter.fnGetUIDate(
                        `${iUTCDate.getFullYear()}-${String(iUTCDate.getMonth() + 1).padStart(2, "0")}-${String(
                            iUTCDate.getDate()
                        ).padStart(2, "0")}`
                    );

                    tempObj.DATE = date;
                    tempObj.timeValue = iUTCDate.getTime();

                    if (sPredcThicknessState && sReadingState) {
                        tempObj.READING = aTableCellsData[j].READING || aTableCellsData[j].reading;
                        tempObj.TMIN = aTableCellsData[j].TMIN || aTableCellsData[j].tmin;
                        tempObj.PREDICTEDTHICKNESS = aPredictedThickness ? aPredictedThickness[j] : "";
                    } else if (sPredcThicknessState) {
                        tempObj.PREDICTEDTHICKNESS = aPredictedThickness ? aPredictedThickness[j] : "";
                    } else if (sReadingState) {
                        tempObj.READING = aTableCellsData[j].READING || aTableCellsData[j].reading;
                        tempObj.TMIN = aTableCellsData[j].TMIN || aTableCellsData[j].tmin;
                    }

                    if(aTableCellsData[j].APPLY_TEMPERATURE_COMPENSATION === true && aTableCellsData[j].TEMPERATURE_CORRECTED_AVG){
                        tempObj.READING = aTableCellsData[j].TEMPERATURE_CORRECTED_AVG
                    }

                    tempObj.dataId = aTableCellsData[j].dataId;
                    vizDataArr.push(tempObj);
                }
            }

            // Filter ignored data
            var ignoredData = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/ignoredReadingsDataArr");
            if (vizDataArr.length > 0 && ignoredData && ignoredData.length > 0) {
                vizDataArr = vizDataArr.filter(
                    (item) => !ignoredData.some((reading) => reading.dataId === item.dataId && reading.isIgnored)
                );
            }

            if (sPredictedValue !== "default") {
                aPredictedThickness = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/RETIREMENT_DATE_"+sPredictedValue);
                var iPUTCDate = new Date(aPredictedThickness);
                var dateP = Formatter.fnGetUIDate(
                    `${iPUTCDate.getFullYear()}-${String(iPUTCDate.getMonth() + 1).padStart(2, "0")}-${String(
                        iPUTCDate.getDate()
                    ).padStart(2, "0")}`
                );
                var tempObjP = {};
                tempObjP.DATE = dateP;
                tempObjP.timeValue = iPUTCDate.getTime();
                tempObjP.RETIREMENT = aTableCellsData[0].TMIN;
                tempObjP.TMIN = aTableCellsData[0].TMIN;

                vizDataArr[0].RETIREMENT = vizDataArr[0].READING;
                var aDateRange = that._oControl.fnGetDateDifferentiation(tempObjP.DATE, vizDataArr[0].DATE);
                aDateRange.splice(0,1);
                aDateRange.splice(aDateRange.length-1,1);

                // Calculating slope point based on first and last retirement date
                var x1 = vizDataArr[0].timeValue, y1 = vizDataArr[0].RETIREMENT;
                var x2 = tempObjP.timeValue, y2 = tempObjP.RETIREMENT;
                var slope = (y2 - y1) / (x2 - x1);

                aDateRange.forEach(function (oRange) {

                    var itimevalue = (new Date(oRange)).getTime();
                    var iRetirement = slope *  (itimevalue - x1) + y1;

                    var oTRange = {
                        "DATE": oRange,
                        "timeValue": itimevalue,
                        "dataId": "",
                        "RETIREMENT": iRetirement,
                        "TMIN": tempObjP.TMIN                        
                    }

                    vizDataArr.push(oTRange);
                });

                vizDataArr.push(tempObjP);
            }
            
            // Sort by date
            vizDataArr.sort((a, b) => a.timeValue - b.timeValue);

            oCommonCMLModel.setProperty("/data/CMLTabSection/temp/visualizationDataArr", vizDataArr);


            if (sReadingState && sPredcThicknessState) {
                iDefaultSelected = 2;
            } else if (sReadingState) {
                if (sPredcThicknessState) {
                    iDefaultSelected = 2;
                } else {
                    iDefaultSelected = 0;
                }
            } else if (sPredcThicknessState) {
                if (sReadingState) {
                    iDefaultSelected = 2;
                } else {
                    iDefaultSelected = 1
                }
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
                                    value: "{DATE}",
                                    dataType: "date"
                                }],
                                measures: [{
                                    name: "Reading",
                                    value: "{READING}"
                                }, {
                                    name: "Tmin",
                                    value: "{TMIN}"
                                }],
                                data: {
                                    path: "/data/CMLTabSection/temp/visualizationDataArr"
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
                                    value: "{DATE}",
                                    dataType: "date"
                                }],
                                measures: [{
                                    name: "Predicted Thickness(CR)",
                                    value: "{PREDICTEDTHICKNESS}"
                                }],
                                data: {
                                    path: "/data/CMLTabSection/temp/visualizationDataArr"
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
                                                    "dataContext": {"Predicted Thickness(CR)": "*"},
                                                    "properties": {
                                                        "lineType":"dash"
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
                                    value: "{DATE}",
                                    dataType: "date"
                                }],
                                measures: [{
                                    name: "Reading",
                                    value: "{READING}"
                                }, {
                                    name: "Tmin",
                                    value: "{TMIN}"
                                }, {
                                    name: "Predicted Thickness(CR)",
                                    value: "{PREDICTEDTHICKNESS}"
                                }, {
                                    name: "Retirement Date(CR)",
                                    value: "{RETIREMENT}"
                                }],
                                data: {
                                    path: "/data/CMLTabSection/temp/visualizationDataArr"
                                }
                            },
                            vizProperties: {
                                plotArea: {
                                    dataLabel: {
                                        visible: true
                                    },
                                    dataPointStyle: {
                                        "rules":
                                            [
                                                {
                                                    "dataContext": {"Retirement Date(CR)": "*"},
                                                    "properties": {
                                                        "lineType":"dash"
                                                    },
                                                    "displayName":"Retirement Date(CR)",
                                                    "dataName" : {
                                                        "Retirement Date(CR)" : "Retirement Date(CR)"
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

            var isInitialLoad = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/isInitialLoad");
            var oVizData = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/vizId");
            oChartData = oChartData.charType.values[iDefaultSelected];
            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            if (sap.viz) {
                // Create VizFrame
                var oVizFrame = new VizFrame({
                    vizType: oChartData.vizType
                });

                // Create ChartContainerContent
                var oChartContainerContent = new ChartContainerContent({
                    content: [oVizFrame]
                });

                // Create ChartContainer
                var oChartContainer = new ChartContainer({
                    showFullScreen: true,
                    showPersonalization: false,
                    showZoom: true,
                    content: [oChartContainerContent]
                });

                // Add FeedItems
                oChartData.dataset.measures.forEach(function (measure) {
                    oVizFrame.addFeed(new FeedItem({
                        uid: "valueAxis",
                        type: "Measure",
                        values: [measure.name]
                    }));
                });
                oVizFrame.addFeed(new FeedItem({
                    uid: "categoryAxis",
                    type: "Dimension",
                    values: [oChartData.dataset.dimensions[0].name]
                }));


                // Create and set FlattenedDataset
                var oDataset = new FlattenedDataset({
                    dimensions: oChartData.dataset.dimensions,
                    measures: oChartData.dataset.measures,
                    data: oChartData.dataset.data
                });
                oVizFrame.setDataset(oDataset);

                // Set VizFrame properties
                oVizFrame.setVizProperties(oChartData.vizProperties);

                if (sUom === "imperial") {
                    // Convert mm to inches and format labels
                    oVizFrame.setVizProperties({
                        valueAxis: {
                            label: {
                                formatString: null,
                                /**
                                 * Formatter function
                                 */
                                formatter: function (value) {
                                    return (value / 25.4).toFixed(2) + " in"; 
                                }
                            },
                        }
                    });
                } else {
                    // Keep labels in mm
                    oVizFrame.setVizProperties({
                        valueAxis: {
                            label: {
                                formatString: null,
                                /**
                                 * formatter function
                                 */
                                formatter: function (value) {
                                    return value.toFixed(0) + " mm";
                                }
                            },
                        }
                    });
                }

                oCommonCMLModel.refresh();
                oVizFrame.setModel(oCommonCMLModel);


                if (isInitialLoad) {
                    return oChartContainer;
                } else {
                    // Bind to the container in the view
                    var oChartContainerBox = sap.ui.getCore().byId(oVizData.sId);
                    oChartContainerBox.removeAllItems();
                    oChartContainerBox.addItem(oChartContainer);
                }
            }
        },

        /**
         * Function to render the reading if it's ignored
         * 
         * @param {Object} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnStoreIgnoredReadingsonGetSave: function (oCommonCMLModel) {

            var that = this;
            var allParameters = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat");
            var ignoredReadingsData = [];

            if (allParameters && allParameters.length > 0) {
                for (var b in allParameters) {
                    var tempObj = {};
                    if (allParameters[b].dataSourcename == "READINGS") {
                        tempObj.dataId = allParameters[b].ID;
                        tempObj.isIgnored = allParameters[b].isIgnored;
                        ignoredReadingsData.push(tempObj);
                    }
                }
            }

            oCommonCMLModel.setProperty("/data/CMLTabSection/temp/ignoredReadingsDataArr", ignoredReadingsData);

            if (ignoredReadingsData.length > 0) {
                return that.formatHistoryReadingsforVisualization(oCommonCMLModel);
            }

        },

        /**
         * Function to Generate the Table in History Tab
         * 
         * @param {Object} oVisual - CML Template Viz list
         * @param {Array} aDataSourceList - Datasource list
         * @param {Array} aReferenceList - Reference list
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oModelUom - UOM Model
         * @returns 
         */
        fnGenerateTable: function (oVisual, aDataSourceList, aReferenceList, oCommonCMLModel, oModelUom) {

            var that = this;
            var aSelectedDataSource = [];
            var aSelectedRef = [];
            var aSelectedRefTable = [];
            var oTableCell = {};
            var oDsValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var oRefValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Reference");
            var aTableCells = [];
            var sTableTitle = oVisual.description;
            var aTableColumnList = oVisual.vizConfigTableList;
            var oUserUom = oCommonCMLModel.getProperty("/data/UOM");
            var oUomNode = oUserUom === "metric" ? "uomMetric" : "uomImperial";
            var aDimension = oCommonCMLModel.getProperty("/data/detailPage/master/response/uom");

            //Creating the 'm' Table control dynamically
            var oTable = new sap.m.Table({
                headerToolbar: new sap.m.Toolbar({
                    content: [
                        new sap.m.Title({
                            text: sTableTitle,
                            level: "H2"
                        })
                    ]
                }),
                infoToolbar: new sap.m.OverflowToolbar({
                    visible: false,
                    content: [
                        new sap.m.Label({
                            visible: {
                                parts: ["mCMLModel>/data/CMLTabSection/isPublished"],
                                /**
                                 * 
                                 * @param {Booelan} isPublished - True / False 
                                 * @returns 
                                 */
                                formatter: function (isPublished) {
                                    that.fnOnHistoryTableUpdate(this.getParent().getParent(), oCommonCMLModel);
                                    return !isPublished;
                                }
                            },
                            text: oCommonCMLModel.getProperty("/data/CMLTabSection/CML/HistoryTable/InfoToolbar/Message1")
                        }),
                        new sap.m.Label({
                            visible: {
                                parts: ["mCMLModel>/data/CMLTabSection/isPublished"],
                                /**
                                 * 
                                 * @param {Booelan} isPublished - True / False 
                                 * @returns 
                                 */
                                formatter: function (isPublished) {
                                    return isPublished;
                                }
                            },
                            text: oCommonCMLModel.getProperty("/data/CMLTabSection/CML/HistoryTable/InfoToolbar/Message2")
                        })
                    ]
                }),
                backgroundDesign: "Transparent",
                columns: [],
                alternateRowColors: true,
                mode: {
                    parts: ["mCMLModel>/data/isPublished"],
                    /**
                     * Formatter fuction
                     */
                    formatter: function (isPublished) {
                        return isPublished ? "None" : "MultiSelect";
                    }.bind(this)
                },
                /**
                 * Function to trigger Table gets updated
                 * 
                 * @param {Object} OEvent - The event object for the press action 
                 */
                updateFinished: function (oEvent) {
                    that.fnOnHistoryTableUpdate(oEvent, oCommonCMLModel);
                },
                /**
                 * Function to trigger the Table row gets selected
                 * 
                 * @param {Object} oEvent - The event object for the press action
                 */
                selectionChange: function (oEvent) {
                    that.fnOnSelectedRowRecord(oEvent, oCommonCMLModel);
                },
                sticky: ["HeaderToolbar"]
            });

            var sUom = "";
            var aSelectedDimensionUnit = [];
            var sUomDesc = "";

            $.each(aTableColumnList, function (i, oList) {
                if (oList.dataSourceRefType === "D") { // Condidtion is to Compare the data with Datasource
                    aSelectedDataSource = aDataSourceList.filter(function (dsList) {
                        return dsList.name === oList.dataSourceRefName;
                    });

                    if (aSelectedDataSource && aSelectedDataSource.length >= 1) {
                        if (aSelectedDataSource[0].dimension && aSelectedDataSource[0].dataType != "date") {
                            if (aSelectedDataSource[0][oUomNode]) {
                                aSelectedDimensionUnit = aDimension.filter(function (oUnit) {
                                    return oUnit.key === aSelectedDataSource[0][oUomNode];
                                });
                                if (aSelectedDimensionUnit[0] && aSelectedDimensionUnit[0].description) {
                                    sUomDesc = aSelectedDimensionUnit[0].description;
                                }
                                sUom = " (" + sUomDesc + ")";
                            } else {
                                sUom = " (" + oModelUom.getProperty("/" + aSelectedDataSource[0].dimension + "/" + oUserUom) + ")";
                            }
                        }

                        if (oList.label === "Date" || oList.label === "Retirement Date") {
                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label
                                }),
                            }));
                        } else if (oList.label === "Reading" || oList.label === "Tmin" || oList.label === "Thickness Minimum" || oList.label === "Short Term Corrosion Rate") {

                            if (oList.label === "Short Term Corrosion Rate") {
                                sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                            } else {
                                if (sUom !== "") {
                                    if (sUom === " (Years)") {
                                        sUom = " (years)";
                                    } else {
                                        sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                    }
                                }

                            }

                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label + sUom
                                }),
                                hAlign: "Begin",
                                demandPopin: true,
                                popinDisplay: "Inline",
                                minScreenWidth: "Tablet"
                            }));
                        } else if (oList.label === "Remaining Life" || oList.label === "Half Life") {
                            sUom = " (years)";

                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label + sUom
                                }),
                                hAlign: "Begin",
                                demandPopin: true,
                                popinDisplay: "Inline",
                                minScreenWidth: "Desktop"
                            }));

                        } else {
                            if (oList.label === "Long Term Corrosion Rate") {
                                sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                            } else {
                                if (sUom !== "") {
                                    if (sUom === " (Years)") {
                                        sUom = " (years)";
                                    } else {
                                        sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                    }
                                }
                            }

                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label + sUom
                                }),
                                hAlign: "Begin",
                                demandPopin: true,
                                popinDisplay: "Inline",
                                minScreenWidth: "Desktop"
                            }));
                        }

                        oTableCell = that.fnReturnTableCell(oList, aSelectedDataSource[0], oCommonCMLModel);
                        aTableCells.push(oTableCell);
                    }
                } else if (oList.dataSourceRefType === "R") { // Condidtion is to Compare the data with Reference
                    aSelectedRef = aReferenceList.filter(function (refList) {
                        return refList.name === oList.dataSourceRefName;
                    });
                    if (aSelectedRef && aSelectedRef.length >= 1) {
                        sUom = "";
                        if (aSelectedRef[0].dimension && aSelectedRef[0].dataType != "date") {
                            if (aSelectedRef[0][oUomNode]) {
                                aSelectedDimensionUnit = aDimension.filter(function (oUnit) {
                                    return oUnit.key === aSelectedRef[0][oUomNode];
                                });
                                if (aSelectedDimensionUnit[0] && aSelectedDimensionUnit[0].description) {
                                    sUomDesc = aSelectedDimensionUnit[0].description;
                                }
                                sUom = " (" + sUomDesc + ")";
                                // sUom = "(" + aSelectedRef[0][oUomNode] + ")";
                            } else {
                                sUom = " (" + oModelUom.getProperty("/" + aSelectedRef[0].dimension + "/" + oUserUom) + ")";
                            }
                        }

                        if (oList.label === "Date" || oList.label === "Retirement Date") {
                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label
                                }),
                            }));
                        } else if (oList.label === "Reading" || oList.label === "Tmin" || oList.label === "Thickness Minimum" || oList.label === "Short Term Corrosion Rate") {

                            if (oList.label === "Short Term Corrosion Rate") {
                                sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                            } else {
                                if (sUom !== "") {
                                    if (sUom === " (Years)") {
                                        sUom = " (years)";
                                    } else {
                                        sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                    }
                                }

                            }

                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label + sUom
                                }),
                                hAlign: "Begin",
                                demandPopin: true,
                                popinDisplay: "Inline",
                                minScreenWidth: "Tablet"
                            }));
                        } else if (oList.label === "Remaining Life" || oList.label === "Half Life") {
                            sUom = " (years)";

                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label + sUom
                                }),
                                hAlign: "Begin",
                                demandPopin: true,
                                popinDisplay: "Inline",
                                minScreenWidth: "Desktop"
                            }));

                        } else {
                            if (oList.label === "Long Term Corrosion Rate") {
                                sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                            } else {
                                if (sUom !== "") {
                                    if (sUom === " (Years)") {
                                        sUom = " (years)";
                                    } else {
                                        sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                    }
                                }
                            }

                            oTable.addColumn(new sap.m.Column({
                                header: new sap.m.Text({
                                    text: oList.label + sUom
                                }),
                                hAlign: "Begin",
                                demandPopin: true,
                                popinDisplay: "Inline",
                                minScreenWidth: "Desktop"
                            }));
                        }

                        oTableCell = that.fnReturnTableCell(oList, aSelectedRef[0], oCommonCMLModel);
                        aTableCells.push(oTableCell);
                    }
                } else if (oList.dataSourceRefType === "RT") { // Condidtion is to Compare the data with Reference 
                    aSelectedRefTable = aReferenceList.filter(function (refList) {
                        return refList.name.toUpperCase() === oVisual.tableDataSourceRefName.toUpperCase();
                    });

                    if (aSelectedRefTable && aSelectedRefTable.length >= 1) {
                        var aSelectedColumn = aSelectedRefTable[0].tableCols.filter(function (oVal) {
                            return oVal.name === oList.dataSourceRefName;
                        });

                        if (aSelectedColumn && aSelectedColumn.length >= 1) {
                            sUom = "";
                            if (aSelectedColumn[0].dimension && aSelectedColumn[0].dataType != "date") {
                                if (aSelectedColumn[0][oUomNode]) {
                                    aSelectedDimensionUnit = aDimension.filter(function (oUnit) {
                                        return oUnit.key === aSelectedColumn[0][oUomNode];
                                    });
                                    if (aSelectedDimensionUnit[0] && aSelectedDimensionUnit[0].description) {
                                        sUomDesc = aSelectedDimensionUnit[0].description;
                                    }
                                    sUom = " (" + sUomDesc + ")";
                                    // sUom = "(" + aSelectedColumn[0][oUomNode] + ")";
                                } else {
                                    sUom = " (" + oModelUom.getProperty("/" + aSelectedColumn[0].dimension + "/" + oUserUom) + ")";
                                }
                            }

                            if (oList.label === "Date" || oList.label === "Retirement Date") {
                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label
                                    }),
                                }));
                            } else if (oList.label === "Reading" || oList.label === "Tmin" || oList.label === "Thickness Minimum" || oList.label === "Short Term Corrosion Rate") {

                                if (oList.label === "Short Term Corrosion Rate") {
                                    sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                                } else {
                                    if (sUom !== "") {
                                        if (sUom === " (Years)") {
                                            sUom = " (years)";
                                        } else {
                                            sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                        }
                                    }

                                }

                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label + sUom
                                    }),
                                    hAlign: "Begin",
                                    demandPopin: true,
                                    popinDisplay: "Inline",
                                    minScreenWidth: "Tablet"
                                }));
                            } else if (oList.label === "Remaining Life" || oList.label === "Half Life") {
                                sUom = " (years)";

                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label + sUom
                                    }),
                                    hAlign: "Begin",
                                    demandPopin: true,
                                    popinDisplay: "Inline",
                                    minScreenWidth: "Desktop"
                                }));

                            } else {
                                if (oList.label === "Long Term Corrosion Rate") {
                                    sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                                } else {
                                    if (sUom !== "") {
                                        if (sUom === " (Years)") {
                                            sUom = " (years)";
                                        } else {
                                            sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                        }
                                    }
                                }

                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label + sUom
                                    }),
                                    hAlign: "Begin",
                                    demandPopin: true,
                                    popinDisplay: "Inline",
                                    minScreenWidth: "Desktop"
                                }));
                            }

                            oTableCell = that.fnReturnTableCell(oList, aSelectedColumn[0], oCommonCMLModel);
                            aTableCells.push(oTableCell);
                        }
                    }
                } else if (oList.dataSourceRefType === "DT") { // Condidtion is to Compare the data with Data source
                    aSelectedDataSource = aDataSourceList.filter(function (dsList) {
                        return dsList.name === oVisual.tableDataSourceRefName.toUpperCase();
                    });
                    if (aSelectedDataSource && aSelectedDataSource.length >= 1) {
                        var aSelectedColumnDS = aSelectedDataSource[0].tableCols.filter(function (oVal) {
                            return oVal.name === oList.dataSourceRefName;
                        });

                        if (aSelectedColumnDS && aSelectedColumnDS.length >= 1) {
                            sUom = "";
                            if (aSelectedColumnDS[0].dimension && aSelectedColumnDS[0].dataType != "date") {
                                if (aSelectedColumnDS[0][oUomNode]) {
                                    aSelectedDimensionUnit = aDimension.filter(function (oUnit) {
                                        return oUnit.key === aSelectedColumnDS[0][oUomNode];
                                    });
                                    if (aSelectedDimensionUnit[0] && aSelectedDimensionUnit[0].description) {
                                        sUomDesc = aSelectedDimensionUnit[0].description;
                                    }
                                    sUom = " (" + sUomDesc + ")";
                                    // sUom = "(" + aSelectedColumnDS[0][oUomNode] + ")";
                                } else {
                                    sUom = " (" + oModelUom.getProperty("/" + aSelectedColumnDS[0].dimension + "/" + oUserUom) + ")";
                                }
                            }

                            if (oList.label === "Date" || oList.label === "Retirement Date") {
                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label
                                    }),
                                }));
                            } else if (oList.label === "Reading" || oList.label === "Tmin" || oList.label === "Thickness Minimum" || oList.label === "Short Term Corrosion Rate") {

                                if (oList.label === "Short Term Corrosion Rate") {
                                    sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                                } else {
                                    if (sUom !== "") {
                                        if (sUom === " (Years)") {
                                            sUom = " (years)";
                                        } else {
                                            sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                        }
                                    }

                                }

                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label + sUom
                                    }),
                                    hAlign: "Begin",
                                    demandPopin: true,
                                    popinDisplay: "Inline",
                                    minScreenWidth: "Tablet"
                                }));
                            } else if (oList.label === "Remaining Life" || oList.label === "Half Life") {
                                sUom = " (years)";

                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label + sUom
                                    }),
                                    hAlign: "Begin",
                                    demandPopin: true,
                                    popinDisplay: "Inline",
                                    minScreenWidth: "Desktop"
                                }));

                            } else {
                                if (oList.label === "Long Term Corrosion Rate") {
                                    sUom = sUom === " (Inch)" ? " (in/year)" : " (mm/year)";
                                } else {
                                    if (sUom !== "") {
                                        if (sUom === " (Years)") {
                                            sUom = " (years)";
                                        } else {
                                            sUom = sUom === " (Inch)" ? " (in)" : " (mm)";
                                        }
                                    }
                                }

                                oTable.addColumn(new sap.m.Column({
                                    header: new sap.m.Text({
                                        text: oList.label + sUom
                                    }),
                                    hAlign: "Begin",
                                    demandPopin: true,
                                    popinDisplay: "Inline",
                                    minScreenWidth: "Desktop"
                                }));
                            }
                            oTableCell = that.fnReturnTableCell(oList, aSelectedColumnDS[0], oCommonCMLModel);
                            aTableCells.push(oTableCell);
                        }
                    }
                }
            });

            if (aTableCells.length >= 1) {
                var oColoumnListItem = new sap.m.ColumnListItem({
                    cells: [aTableCells]
                });
                var TableSortInfo = that.fnGetTableSortInfo(aTableColumnList);
                var aSorter = [];

                if (oVisual) {
                    if (oVisual.tableDataSourceRefType === "R") {
                        oTable.bindItems("mCMLModel>/data/CMLTabSection/LocationData/Reference/" + oVisual.tableDataSourceRefName, oColoumnListItem);
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + oVisual.tableDataSourceRefName, oRefValues[oVisual.tableDataSourceRefName]);
                    } else if (oVisual.tableDataSourceRefType === "D") {
                        oTable.bindItems("mCMLModel>/data/CMLTabSection/LocationData/DataSource/" + oVisual.tableDataSourceRefName, oColoumnListItem);
                        oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oVisual.tableDataSourceRefName, oDsValues[oVisual.tableDataSourceRefName]);
                    }

                    if (TableSortInfo.length > 0 || Object.keys(TableSortInfo) > 1) {
                        var oBinding = oTable.getBindingInfo("items");
                        if (!TableSortInfo.length > 0) {
                            TableSortInfo = [TableSortInfo];
                        }
                        $.each(TableSortInfo, function (j, oData) {
                            aSorter.push(new sap.ui.model.Sorter(oData));
                        });
                        oBinding.sorter = aSorter;
                    }
                }
            }

            return oTable;

        },

        /**
         * Function to Display the Table list as Sort order
         * 
         * @param {Array} aTableColumnList - Reading Table List
         * @returns 
         */
        fnGetTableSortInfo: function (aTableColumnList) {

            var oSorter = {};
            var aSorter = [];
            var sPath = "";

            //Filter which colums has configured with sort sequence
            aTableColumnList = aTableColumnList.filter(function (oTab) {
                return oTab.SequenceNo && oTab.SequenceType;
            });
            //sort which colums has configured with column sequence
            aTableColumnList = aTableColumnList.sort(function (a, b) {
                return a.SequenceNo - b.SequenceNo;
            });
            $.each(aTableColumnList, function (i, oTableList) {
                if (oTableList.dataSourceRefType === "R") {
                    sPath = "mCMLModel>/data/CMLTabSection/LocationData/Reference/" + oTableList.dataSourceRefName;
                } else if (oTableList.dataSourceRefType === "D") {
                    sPath = "mCMLModel>/data/CMLTabSection/LocationData/DataSource/" + oTableList.dataSourceRefName;
                } else if (oTableList.dataSourceRefType === "RT") {
                    sPath = "mCMLModel>" + oTableList.dataSourceRefName;
                } else if (oTableList.dataSourceRefType === "DT") {
                    sPath = "mCMLModel>" + oTableList.dataSourceRefName;
                }

                oSorter = {};

                if (oTableList.SequenceNo && oTableList.SequenceType) {
                    oSorter.path = sPath;
                    oSorter[oTableList.SequenceType] = oTableList.SequenceType === "ascending" ? true : oTableList.SequenceType === "descending" ?
                        true : false;
                    aSorter.push(oSorter);
                }
            });

            if (aSorter.length >= 1) {
                return aSorter;
            } else {
                return oSorter;
            }

        },

        /**
         * Function to Update the History table
         * 
         * @param {Object} oEvent - The event object for the press action
         * @param {*} oModelIdms - Detail page model
         */
        fnOnHistoryTableUpdate: function (oEvent, oModelIdms) {

            var oTable;

            if (oEvent.getMetadata().getName() === "sap.m.Table") {
                oTable = oEvent;
            } else {
                oTable = oEvent.getSource();
            }

            var oData = {};
            var sDataID = "";
            var bIsPublished = oModelIdms.getProperty("/data/isPublished");
            var bHasSelected = false;

            oTable.removeSelections();

            var oDataSource = oModelIdms.getProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat");

            $.each(oTable.getItems(), function (i, oItem) {

                oData = {};
                sDataID = oItem.getBindingContext("mCMLModel").getObject().dataId;
                oData = oDataSource.find(function (oDItem) {
                    return oDItem.ID === sDataID;
                });

                if (oData && oData.isIgnored) {
                    bHasSelected = true;
                    oTable.setSelectedItem(oItem);
                    if (bIsPublished) {
                        oItem.setHighlight("Warning");
                    } else {
                        oItem.setHighlight("None");
                    }
                }
            });

            oTable.getInfoToolbar().setVisible(bHasSelected);

        },

        /**
         * Function to bind the Selected row
         * 
         * @param {Object} oEvent - The event object for the press action
         * @param {*} oModelIdms - Detail page model
         */
        fnOnSelectedRowRecord: function (oEvent, oModelIdms) {

            var oData = {};
            var sDataID = "";
            var oParameters = oEvent.getParameters();
            var oIgnoredReading = oModelIdms.getProperty("/data/ignoredReading") || {};
            var oDataSource = oModelIdms.getProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat");

            if(!Object.keys(oIgnoredReading).length) {

                oDataSource.forEach(function(oDataValue){
                    if(oDataValue.dataSourcename === "READINGS"){
                        oIgnoredReading[oDataValue.ID] = oDataValue.isIgnored;
                    }
                });

            }
            $.each(oParameters.listItems, function (i, oItem) {
                sDataID = oItem.getBindingContext("mCMLModel").getObject().dataId;
                oData = oDataSource.find(function (oDItem) {
                    return oDItem.ID === sDataID;
                });
                if (oData) {
                    oData.isIgnored = oParameters.selected;
                    oIgnoredReading[oData.ID] = oData.isIgnored;
                }
            });

            oModelIdms.setProperty("/data/ignoredReading", oIgnoredReading);
            oEvent.getSource().getInfoToolbar().setVisible(oEvent.getSource().getSelectedItems("items").length > 0);

        },

        /**
         * Function to prepare the Dimension as units
         * 
         * @param {Array} aDimension - Dimension list
         * @returns Dimension with unit
         */
        fnPrepareDimensionData: function (aDimension) {

            var aDimUnits = [];

            $.each(aDimension, function (iDx, oDim) {
                aDimUnits = aDimUnits.concat(oDim.units);
            });

            return aDimUnits;

        },

        /**
         * Function to return the Table cell data
         * 
         * @param {*} oTableList - Table List data
         * @param {*} oDataSourceRef - Datasource Reference list
         * @param {*} oCommonCMLModel - Detail page model
         * @returns {Object} oField - Return the Fields
         */
        fnReturnTableCell: function (oTableList, oDataSourceRef, oCommonCMLModel) {

            var sPath = "";
            var oField = "";
            var _bEditFlag = false;
            var bEditFlag = {
                parts: ["mCMLModel>/data/isPublished"],
                formatter: function (isPublished) {
                    return !isPublished && _bEditFlag;
                }.bind(this)
            };

            if (oTableList.dataSourceRefType === "R") {
                sPath = "{mCMLModel>/data/CMLTabSection/LocationData/Reference/" + oTableList.dataSourceRefName + "}";
            } else if (oTableList.dataSourceRefType === "D") {
                sPath = "{mCMLModel>/data/CMLTabSection/LocationData/DataSource/" + oTableList.dataSourceRefName + "}";
            } else if (oTableList.dataSourceRefType === "RT") {
                sPath = "{mCMLModel>" + oTableList.dataSourceRefName + "}";
            } else if (oTableList.dataSourceRefType === "DT") {
                sPath = "{mCMLModel>" + oTableList.dataSourceRefName + "}";
            }

            if (oDataSourceRef.dataType.toUpperCase() === "DATE") {
                if (_bEditFlag) {
                    oField = new sap.m.DatePicker({
                        value: {
                            path: sPath.substring(1, sPath.length - 1),
                            type: "sap.ui.model.type.Date",
                            formatOptions: {
                                style: "long"
                            }
                        },
                        editable: bEditFlag,
                        /**
                         * Function to trigger the Datepicker change
                         * 
                         * @param {Object} oEvent - The event object for the press action
                         */
                        change: function (oEvent) {
                            oEvent.getSource().setValueState("None");
                            oEvent.getSource().setValueStateText("");
                        }
                    });
                } else {
                    oField = new sap.m.Text({
                        text: {
                            path: sPath.substring(1, sPath.length - 1),
                            type: "sap.ui.model.type.Date",
                            formatOptions: {
                                style: "long"
                            }
                        }
                    });
                }
            } else if (oDataSourceRef.dataType.toUpperCase() === "NUMERIC" || oDataSourceRef.dataType.toUpperCase() === "NUMERICFLEXIBLE" ||
                oDataSourceRef.dataType.toUpperCase() === "CURRENCY") {
                if (_bEditFlag) {
                    oField = new sap.m.Input({
                        value: sPath,
                        type: "Number",
                        editable: bEditFlag,
                        valueLiveUpdate: true,
                        /**
                         * Function to trigger the Input change
                         * 
                         * @param {Object} oEvent - The event object for the press action
                         */
                        change: function (oEvent) {
                            oEvent.getSource().setValueState("None");
                        }
                    });
                } else {

                    var bIsCmlSummaryEnabled = oCommonCMLModel.getProperty("/metaData/featureFlag/cmlSummaryValidations") === "1";

                    if (["SHORT_TERM_CORROSION_RATE", "LONG_TERM_CORROSION_RATE", "REMAINING_LIFE", "HALF_LIFE"].includes(oDataSourceRef.name) && bIsCmlSummaryEnabled) {
                        oField = new sap.m.Text({
                            text: {
                                parts: [
                                    {
                                        path: sPath.substring(1, sPath.length - 1)
                                    },
                                    {
                                        path: "mCMLModel>IS_BASELINE_" + oDataSourceRef.name
                                    }
                                ],
                                formatter: function (vValue, bIsBaseline) {
                                    return this.fnFormatBaselineValue(vValue, bIsBaseline);
                                }.bind(this)

                        }
                        });
                    } else {
                        oField = new sap.m.Text({
                            text: sPath
                        });
                    }
                }

            } else if (oDataSourceRef.dataType.toUpperCase() === "STRING") {
                if (_bEditFlag) {
                    oField = new sap.m.Input({
                        value: sPath,
                        type: "string",
                        editable: bEditFlag,
                        valueLiveUpdate: true,
                        /**
                         * Function to trigger the Input change
                         * 
                         * @param {Object} oEvent - The event object for the press action
                         */
                        change: function (oEvent) {
                            oEvent.getSource().setValueState("None");
                        }
                    });
                } else {
                    oField = new sap.m.Text({
                        text: sPath
                    });
                }
            } else if (oDataSourceRef.dataType.toUpperCase() === "BOOLEAN") {
                var sTempVal = oCommonCMLModel.getProperty(sPath.slice(7, sPath.length - 1));
                if (!sTempVal || sTempVal === "") {
                    oCommonCMLModel.setProperty(sPath.slice(7, sPath.length - 1), false);
                }
                oField = new sap.m.Switch({
                    customTextOff: "NO",
                    customTextOn: "Yes",
                    enabled: bEditFlag,
                    state: sPath,
                    /**
                     * Function to trigger the Datepicker change
                     * 
                     */
                    change: function () { }
                });
            } else {
                oField = new sap.m.Text({
                    text: sPath
                });
            }

            return oField;

        },

        /**
         * Function to format baseline reading values with dash
         *
         * @param {*} vValue - Reading value
         * @param {Boolean} bIsBaselineHalfLife - Flag to identify baseline reading
         * @returns {*} Formatted reading value
         */
        fnFormatBaselineValue: function (vValue , bIsBaselineHalfLife) {
            var fValue = Number(vValue || 0);
            if (bIsBaselineHalfLife && !isNaN(fValue) && fValue === 0) {
                return "-";
            }
            return vValue;
        },

        /**
         * Function to Return the Value of Types
         * 
         * @param {Integer} value 
         * @param {String} type
         */
        fnToReturnValueOfType: function (value, type) {

            var that = this;

            if (type.toUpperCase() === "FLOAT" || type.toUpperCase() === "NUMERICFLEXIBLE") {
                if ((value || value === 0) && !isNaN(parseFloat(value))) {
                    return parseFloat(value);
                } else {
                    return;
                }
            } else if (type.toUpperCase() === "INT" || type.toUpperCase() === "NUMERIC" || type.toUpperCase() === "CURRENCY") {
                if ((value || value === 0) && !isNaN(Number(value))) {
                    return Number(value);
                } else {
                    return;
                }
            } else if (type.toUpperCase() === "STRING") {
                if (!value) {
                    return;
                }
                return value.toString();
            } else if (type.toUpperCase() === "DATE") {
                if (!value) {
                    return;
                }
                if (value instanceof Date) {
                    return that.fnGetBEDate(that.normalizeDate(value));
                } 
                // else {
                //     return that.normalizeDate(value);
                // }
            } else if (type.toUpperCase() === "BOOLEAN") {
                if (!value || value === "") {
                    return false;
                } else {
                    return value;
                }
            }

        },

        /**
         * Function to set the value should show after the decimal point
         * 
         * @param {Integer} value 
         * @param {*} oRefDataSourceDetail - DataSource detail
         * @returns 
         */
        fnToHandlePrecisionScale: function (value, oRefDataSourceDetail) {

            var that = this;
            var vCurValue = value;
            var vTemp = "";
            var sPrecision = oRefDataSourceDetail.totalLengthOfNum ? oRefDataSourceDetail.totalLengthOfNum : oRefDataSourceDetail.precision;
            var sScale = oRefDataSourceDetail.decimalPlacesAllowed ? oRefDataSourceDetail.decimalPlacesAllowed : oRefDataSourceDetail.scale;

            //User can provide blank values also
            if ((vCurValue !== null || vCurValue !== undefined) && $.trim(vCurValue) === "") {
                return;
            }
            if (vCurValue !== undefined && vCurValue !== null && vCurValue.toString().indexOf(".") === -1) {
                vCurValue = parseFloat(vCurValue, 0);
            }

            var sZero = /^[0.]+$/;

            if (sZero.test(vCurValue)) {
                var sCurValue = vCurValue.toString();
                if (sCurValue.indexOf(".") > -1) {
                    vCurValue = sCurValue.substring(0, (sCurValue.indexOf(".") + Number(sPrecision) + 1));
                }
            } else {
                if ((vCurValue.length > (Number(sPrecision) + 1) || (vCurValue.toString().indexOf(".") >= 0 && vCurValue.toString()
                    .split(".")[1].length > Number(sScale)))) {
                    vCurValue = vCurValue ? parseFloat(vCurValue, 0) : 0;
                    vCurValue = parseFloat(vCurValue.toFixed(sScale));
                }

            }

            vCurValue = vCurValue ? parseFloat(vCurValue, 0) : 0;

            if (that.fnCountDecimals(vCurValue, false) > (sPrecision - sScale)) {
                if (sPrecision && sScale) {
                    for (var iPx = 0; iPx < sPrecision - sScale; iPx++) {
                        vTemp += "9";
                    }
                    vTemp += ".";
                    for (var iSx = 0; iSx < sScale; iSx++) {
                        vTemp += "9";
                    }
                    return vTemp;
                }
            } else {
                return vCurValue;
            }

        },

        /**
         * Function to Count the Decimal places in values
         * 
         * @param {Integer} value - Reading value
         * @param {Boolean} isDecimalPlaces True / False
         * @returns 
         */
        fnCountDecimals: function (value, isDecimalPlaces) {

            if ((value % 1) !== 0) {
                if (isDecimalPlaces) {
                    return value.toString().split(".")[1].length;
                } else {
                    return value.toString().split(".")[0].length;
                }
            } else {
                return value.toString().length;
            }

        },

        /**
         * Function to validate the Mandatory field
         * 
         * @param {Array} aSectionList - Section list
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oMessageBundle - Message bundle object
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error Callback function
         * @returns 
         */
        fnCheckMandatoryFields: function (aSectionList, oCommonCMLModel, oMessageBundle, fnSuccess, fnError) {

            var oValueState = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/ValueState");
            var oRefValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Reference");
            var oDataSourceValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var oMandateFields = {};
            var aError = [];

            // Below Code is to test mandatory fields 
            $.each(aSectionList, function (iSx, oSection) {
                if (oSection.vizList && oSection.vizList.length >= 1) {
                    $.each(oSection.vizList, function (iVx, oViz) {
                        if (oViz.type === "Form") {
                            $.each(oViz.vizConfigFormList, function (iFx, oFormList) {
                                if (oFormList.editFlag === true && oFormList.optionCode === "2") {
                                    oMandateFields[oFormList.dataSourceRefType + "_" + oFormList.dataSourceRefName] = "";
                                    if (oFormList.dataSourceRefType === "D") {
                                        if (oFormList.columnName) {
                                            if (!oDataSourceValues[oFormList.dataSourceRefName][0][oFormList.columnName]) {
                                                if (oDataSourceValues[oFormList.dataSourceRefName][0][oFormList.columnName] === false) {
                                                    return;
                                                }
                                                aError.push({
                                                    message: oFormList.label,
                                                    type: MessageType.Error,
                                                    description: oMessageBundle.getText("Please Provide Value"),
                                                    target: "message"
                                                });
                                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/ValueState/" + oFormList.dataSourceRefType + "_" + oFormList.columnName,
                                                    "Error");
                                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/ValueStateText/" + oFormList.dataSourceRefType + "_" + oFormList.columnName,
                                                    oMessageBundle.getText("Please Provide Value"));
                                            }
                                        } else {
                                            if (!oDataSourceValues[oFormList.dataSourceRefName]) {
                                                if (oDataSourceValues[oFormList.dataSourceRefName] === false) {
                                                    return;
                                                }
                                                aError.push({
                                                    message: oFormList.label,
                                                    type: MessageType.Error,
                                                    additionalText: oMessageBundle.getText("Please Provide Value"),
                                                    description: oMessageBundle.getText("Please Provide Value"),
                                                    target: "message"
                                                });
                                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/ValueState/" + oFormList.dataSourceRefType + "_" + oFormList.dataSourceRefName,
                                                    "Error");
                                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/ValueStateText/" + oFormList.dataSourceRefType + "_" + oFormList.dataSourceRefName,
                                                    oMessageBundle.getText("Please Provide Value"));
                                            }
                                        }
                                    } else if (oFormList.dataSourceRefType === "R") {
                                        if (!oRefValues[oFormList.dataSourceRefName]) {
                                            if (oRefValues[oFormList.dataSourceRefName] === false) {
                                                return;
                                            }
                                            aError.push({
                                                message: oFormList.label,
                                                type: MessageType.Error,
                                                additionalText: oMessageBundle.getText("Please Provide Value"),
                                                description: oMessageBundle.getText("Please Provide Value"),
                                                target: "message"
                                            });
                                            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/ValueState/" + oFormList.dataSourceRefType + "_" + oFormList.dataSourceRefName,
                                                "Error");
                                            oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/ValueStateText/" + oFormList.dataSourceRefType + "_" + oFormList.dataSourceRefName,
                                                oMessageBundle.getText("Please Provide Value"));
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });

            if (aError.length >= 1) {
                fnError(aError);
                return;
            }

            // Below code is to test Presicion and scale
            if (Object.keys(oValueState).length >= 1) {
                $.each(Object.keys(oValueState), function (ikey, oState) {
                    if (oValueState[oState] === "Error") {
                        aError.push({
                            message: oState.substring(2, oState.length),
                            type: MessageType.Error,
                            additionalText: oMessageBundle.getText("Precision Value Exceeded"),
                            description: oMessageBundle.getText("Entered Precision Value is more than the Configured Reference/DataSource Precision Value,Please Increase the Precision and scale value in Reference/DataSource or change the entered value"),
                            target: "message"
                        });
                    }
                });
            }
            if (aError.length >= 1) {
                fnError(aError);
            } else {
                fnSuccess();
            }

        },

        /**
         * Function to count the Values
         * 
         * @param {Object} oCommonCMLModel - Detail page Model
         * @param {*} oModelUom - UOM Model
         * @param {*} fnSuccess - Success callback function
         * @param {*} fnError - Error callback function
         * @returns 
         */
        fnConvertRefValues: function (oCommonCMLModel, oModelUom, fnSuccess, fnError) {

            var that = this;
            var oRefValues = $.extend(true, {}, oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Reference"));
            var oReferenceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/referenceList");
            var uomsToConvert = [];
            var sUomSystem = oCommonCMLModel.getProperty("/data/UOM");
            var oEqTemplateData = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/EquipmentTempDetails");
            var oEqPrecValues = that.fnPreparePrecisionFromEquipmentValues(oCommonCMLModel, oEqTemplateData);

            Object.keys(oRefValues).forEach(function (oRef) {
                // If value is there
                if (oRefValues[oRef] && oRefValues[oRef] !== "" && oRefValues[oRef] !== null) {

                    var oRefData = oReferenceList.filter(function (oElem) {
                        return oElem.name === oRef;
                    });

                    if (oRefData[0] && oRefData[0].dimension) {
                        uomsToConvert.push({
                            "key": oRefData[0].name,
                            "src": sUomSystem === "metric" ? oRefData[0].uomMetric : oRefData[0].uomImperial,
                            "tgt": sUomSystem === "metric" ? oRefData[0].uomImperial : oRefData[0].uomMetric,
                            "srcValue": oRefValues[oRef]
                        });
                    }
                }
            });

            if (uomsToConvert.length >= 1) {
                that.fnUoMConvert(uomsToConvert, function (oDataRet) {
                    if (oDataRet.length >= 1) {
                        $.each(oDataRet, function (ix, oNewUom) {
                            var oRefData = oReferenceList.filter(function (oRef) {
                                return oRef.name === oNewUom.key;
                            });
                            if (oRefData && oRefData.length >= 1 && oRefData[0].attrIndId) {
                                var oPrecData = oEqPrecValues.filter(function (oPrec) {
                                    return oPrec.id === oRefData[0].EquipmentTemplateID + "_" + oRefData[0].groupId + "_" + oRefData[0].attrIndId;
                                });
                                var oConvertedValue = oNewUom.tgtValue;
                                if (oPrecData[0] && oPrecData[0].scale) {
                                    oConvertedValue = that.fnToHandlePrecisionScale(oNewUom.tgtValue, oPrecData[0]);
                                }

                                if (oRefData[0]) {
                                    oRefValues[oRefData[0].name] = oConvertedValue;
                                }
                            }
                        });
                        oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues", oRefValues);
                        return fnSuccess();
                    }
                }, function (oError) {
                    return fnError(oError);
                });
            } else {
                oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues", oRefValues);
                return fnSuccess();
            }

        },

        /**
         * Function to prepare the Data for Templates
         * 
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oAttributes 
         * @param {Object} oIndicators 
         * @returns 
         */
        fnPrepareDataFromEquipmentTemplate: function (oCommonCMLModel, oAttributes, oIndicators) {

            var oValues = [];
            var sKey = "";

            if (oAttributes.templates.length > 0) {
                for (var iTx in oAttributes.templates) {
                    var oAttrGrps = oAttributes.templates[iTx].attributeGroups;
                    for (var idx in oAttrGrps) {
                        if (oAttrGrps[idx]) {
                            var oAttrs = oAttrGrps[idx].attributes;

                            for (var ydx in oAttrs) {
                                sKey = oAttributes.templates[iTx].templateId + "_" + oAttrGrps[idx].attributeGroupId + "_" + oAttrs[ydx].attributeId;
                                if (oAttrs[ydx]) {
                                    oValues.push({
                                        "id": sKey,
                                        "val": oAttrs[ydx].value1,
                                        "uom": oAttrs[ydx].uom1,
                                        "dataType": oAttrs[ydx].dataType
                                    });
                                }
                            }
                        }
                    }
                }
            }

            if (oIndicators && oIndicators.length > 0) {
                oIndicators.forEach(function (oInd) {
                    sKey = oInd.categoryID + "_" + (oInd.pstid || oInd.pstID) + "_" + oInd.propertyId;
                    oValues.push({
                        "id": sKey,
                        "val": oInd.convertedAggregatedValue ? oInd.convertedAggregatedValue : oInd.baseValue,
                        "uom": oInd.uom,
                        "dataType": oInd.dataType
                    });
                });
            }

            return oValues;

        },

        /**
         * Function to check the decimal place values
         * 
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {*} oEqTemplateData - Template Data
         * @returns 
         */
        fnPreparePrecisionFromEquipmentValues: function (oCommonCMLModel, oEqTemplateData) {

            var oValues = [];
            var sKey = "";

            if (oEqTemplateData.length > 0) {
                oEqTemplateData.forEach(function (oTemp) {
                    var oAttrGroups = oTemp.attributeGroups;
                    if (oAttrGroups.length > 0) {
                        oAttrGroups.forEach(function (oGrp) {
                            var oAttr = oGrp.attributes;

                            if (oAttr.length > 0) {
                                oAttr.forEach(function (oAtt) {
                                    sKey = oTemp.id + "_" + oGrp.id + "_" + oAtt.id;
                                    var oVal = {
                                        "id": sKey,
                                        "dataType": oAtt.dataType
                                    };

                                    if (oAtt.precision) {
                                        oVal.precision = oAtt.precision;
                                    }

                                    if (oAtt.scale) {
                                        oVal.scale = oAtt.scale;
                                    }

                                    oValues.push(oVal);
                                });
                            }
                        });
                    }

                    var oIndGroups = oTemp.indicatorGroups;
                    if (oIndGroups.length > 0) {

                        oIndGroups.forEach(function (oGrp) {
                            var oInds = oGrp.indicators;

                            if (oInds.length > 0) {
                                oInds.forEach(function (oInd) {
                                    sKey = oTemp.id + "_" + oGrp.id + "_" + oInd.id;
                                    var oVal = {
                                        "id": sKey,
                                        "dataType": oInd.dataType
                                    };

                                    if (oInd.precision) {
                                        oVal.precision = oInd.precision;
                                    }

                                    if (oInd.scale) {
                                        oVal.scale = oInd.scale;
                                    }

                                    oValues.push(oVal);
                                });
                            }
                        });
                    }
                });

            }

            return oValues;

        },

        /**
         * Function to Convert the DataSource value for UOM
         * 
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {*} fnSuccess - Success callback function
         * @returns 
         */
        fnConvertDsValues: function (oCommonCMLModel, fnSuccess) {

            var that = this;
            var oDataSrcValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var oDataSrcList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList");
            var oDisplayUoms = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/DisplayUoms");
            var oTgtUom;
            var sSystemUom = oCommonCMLModel.getProperty("/data/UOM");
            var uomsToConvert = [];
            var oDataSrcConvertedValues = $.extend(true, {}, oDataSrcValues);

            if (Object.keys(oDataSrcValues).length >= 1) {
                Object.keys(oDataSrcValues).forEach(function (oDSval) {
                    if (oDataSrcValues[oDSval] && oDataSrcValues[oDSval] !== "" && oDataSrcValues[oDSval] !== null) {
                        var oDsData = oDataSrcList.filter(function (oElem) {
                            return oElem.name === oDSval;
                        });

                        if (oDsData && oDsData.length >= 1 && oDsData[0].dimension && oDsData[0].uomMetric && oDsData[0].uomImperial && oDsData[0].dataType !==
                            "date") {
                            //Now check if conversion required
                            oTgtUom = oDisplayUoms.filter(function (oUom) {
                                return oUom.id === oDsData[0].name;
                            });

                            if (oTgtUom[0] && oTgtUom[0].uomDisplay) {
                                uomsToConvert.push({
                                    "key": oDsData[0].name,
                                    "src": sSystemUom === "metric" ? oDsData[0].uomMetric : oDsData[0].uomImperial,
                                    "tgt": sSystemUom === "metric" ? oDsData[0].uomImperial : oDsData[0].uomMetric,
                                    "srcValue": (oDataSrcValues[oDSval]).toString()
                                });
                            }
                        }
                        if (oDsData && oDsData.length >= 1 && oDsData[0].tableCols && oDsData[0].tableCols.length >= 0) {
                            var oData = oDataSrcValues[oDsData[0].name];
                            if (oData && oData.length > 0) {
                                var aVals = [];
                                oDsData[0].tableCols.forEach(function (oCol) {
                                    if (oCol.dimension && oCol.dataType !== "date") {
                                        aVals = [];
                                        oData.forEach(function (oRowVals, iDx) {
                                            if (oRowVals[oCol.name] && oRowVals[oCol.name] !== ("Infinity" || "-Infinity" || "NaN")) {
                                                aVals.push({
                                                    "val": oRowVals[oCol.name],
                                                    "id": oDsData[0].name + "%" + oCol.name + "%" + iDx
                                                });
                                            }
                                        });

                                        if (aVals.length > 0) {
                                            aVals.forEach(function (oVal) {
                                                if (oCol.uomImperial !== oCol.uomMetric) {
                                                    uomsToConvert.push({
                                                        "key": oVal.id,
                                                        "src": sSystemUom === "metric" ? oCol.uomMetric : oCol.uomImperial,
                                                        "tgt": sSystemUom === "metric" ? oCol.uomImperial : oCol.uomMetric,
                                                        "srcValue": (oVal.val).toString()
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }

            if (uomsToConvert.length >= 1) {
                that.fnUoMConvert(uomsToConvert, function (oData) {
                    if (oData.length > 0) {
                        oData.forEach(function (oNewUom) {
                            var aKeyForTable = oNewUom.key.split("%");
                            var oDsData = [];
                            if (aKeyForTable[0] && aKeyForTable[1]) {
                                oDsData = oDataSrcList.filter(function (oDs) {
                                    return oDs.name === aKeyForTable[0];
                                });
                                if (oDsData && oDsData.length >= 1 && oDsData[0].dataType === "table" && oDsData[0].tableCols.length >= 1) {
                                    var aSelectedTableCol = oDsData[0].tableCols.filter(function (oTab) {
                                        return oTab.name === aKeyForTable[1];
                                    });
                                    if (aSelectedTableCol && aSelectedTableCol.length >= 1) {
                                        if (aSelectedTableCol[0].dataType === "numericflexible") {
                                            oDataSrcConvertedValues[aKeyForTable[0]][aKeyForTable[2]][aKeyForTable[1]] = oNewUom.tgtValue;
                                        } else {
                                            oDataSrcConvertedValues[aKeyForTable[0]][aKeyForTable[2]][aKeyForTable[1]] = oNewUom.tgtValue;
                                        }
                                    }
                                }
                            } else {
                                oDsData = oDataSrcList.filter(function (oDs) {
                                    return oDs.name === oNewUom.key;
                                });
                                if (oDsData && oDsData.length >= 1) {
                                    if (oDsData[0].dataType === "numericflexible") {
                                        oDataSrcConvertedValues[oDsData[0].name] = oNewUom.tgtValue;
                                    } else {
                                        oDataSrcConvertedValues[oDsData[0].name] = oNewUom.tgtValue;
                                    }
                                }
                            }
                        });
                        oCommonCMLModel.setProperty("/data/CMLTabSection/temp/ConvertedDsvalues", oDataSrcConvertedValues);
                        return fnSuccess();
                    }
                }, function (oError) {
                    that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE031"), oError);
                });
            } else {
                oCommonCMLModel.setProperty("/data/CMLTabSection/temp/ConvertedDsvalues", oDataSrcConvertedValues);
                return fnSuccess();
            }

        },

        /**
         * Function to trigger the Background calculation
         * 
         * @param {Integer} iCounter - Loop count
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Object} oMessageBundle - Message List
         * @param {String} sLevel
         */
        fnCalculate: function (iCounter, oCommonCMLModel, oMessageBundle, sLevel) {

            var that = this;
            var aSections = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/sectionList");
            var oData = {};

            //Sort Publish Sequencing 
            aSections.sort(function (oFirst, oSecond) {

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

            if (aSections && aSections.length >= 1) {

                oData = that.fnReturnObjectForApi(aSections[iCounter], "Calculate", oCommonCMLModel, sLevel);

                if (!oData.api || !oData.payload) {
                    if ((aSections.length) - 1 > iCounter) {
                        var count = iCounter + 1;
                        that.fnCalculate(count, oCommonCMLModel, oMessageBundle, sLevel);
                    } else {
                        setTimeout(function () {
                            BusyIndicator.hide();
                            that._oControl.fnMessageShow("S", oMessageBundle.getText("CML.MESSAGE008"));
                            // Graph update
                            that.formatHistoryReadingsforVisualization(oCommonCMLModel);
                            return;
                        }, 2000);
                    }
                } else {
                    that.fnCallSequenceOfAPI(oData, function (oDataRet) {
                        // *** Based on Template Configuration Decimal place will display ***
                        // if (oDataRet.historyExportTable) {
                        //     oDataRet.historyExportTable.forEach(function (oItem) {
                        //         if (typeof oItem.longTerm !== "string") {
                        //             oItem.longTerm = oItem.longTerm.toFixed(6);
                        //         } else {
                        //             // eslint-disable-next-line no-self-assign
                        //             oItem.longTerm = oItem.longTerm;
                        //         }
                        //         if (typeof oItem.shortTerm !== "string") {
                        //             oItem.shortTerm = oItem.shortTerm.toFixed(6);
                        //         } else {
                        //             // eslint-disable-next-line no-self-assign
                        //             oItem.shortTerm = oItem.shortTerm;
                        //         }
                        //     });
                        // }
                        if(oDataRet === "CML Calculation already in progress") {
                            that._oControl.fnMessageShow("I", oMessageBundle.getText("CML.MESSAGE038"));
                            return;
                        }
                        oCommonCMLModel.setProperty("/data/CMLTabSection/Detail/CalculatedOutput", oDataRet);
                        that.fnAssignOutPutValues(oDataRet, iCounter, oCommonCMLModel, function () {
                            if ((aSections.length) - 1 > iCounter) {
                                var count = iCounter + 1;
                                that.fnCalculate(count, oCommonCMLModel, oMessageBundle, sLevel);
                            } else {
                                //that.busyHide();
                                return;
                            }
                        });

                    }, function (oError) {
                        //that.busyHide();
                        that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE004"), oError);
                    });
                }
            }

        },

        /**
         * Function will call the API  based on the oData URL with payload
         * 
         * @param {Object} oData - Sequence API Data with Payload
         * @param {Function} fnSuccess - Success Callback function
         * @param {Function} fnError - Error Callback function
         */
        fnCallSequenceOfAPI: function (oData, fnSuccess, fnError) {

            var sAPI = window.com.asint.ais.mi.cml.baseURI + "/asint/rest/v1/idms/" + oData.api.split("/idms/")[1];

            this._oControl.CMLDataSource.fnCallSequenceOfAPI(sAPI, oData.payload, function (oDataRet) {
                return fnSuccess(oDataRet);
            }, function (oError) {
                return fnError(oError);
            });

        },

        /**
         * Function to convert the UOM based on User selection
         * 
         * @param {Object} oData - Payload for UOM conversion
         * @param {*} fnSuccess - Success Callback function
         * @param {*} fnError - Error Callback function
         */
        fnUoMConvert: function (oData, fnSuccess, fnError) {

            this._oControl.CMLDataSource.fnUoMConversion(oData, function (oDataRet) {
                return fnSuccess(oDataRet);
            }, function (oError) {
                return fnError(oError);
            });

        },

        /**
         * Function to convert the UOM from Imperial to Metric
         * 
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {*} oImperialData - Imperial data as object
         * @param {*} fnSuccess - Success callback function
         * @param {*} fnError - Error callback function
         */
        fnUoMConvertImperialToMetric: function (oCommonCMLModel, oImperialData, fnSuccess, fnError) {

            var aConversionData = [];
            var oTarget = {};
            var oDSList = {};
            var aDataSourceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList");

            var aSkipKeys = ["REMAINING_LIFE", "HALF_LIFE", "DATE", "RETIREMENT_DATE", "dataId", "VALIDATED", "INSP_COMMENTS"];

            aDataSourceList.forEach(function (oItem) {
                if (oItem.name === "READINGS") {
                    oItem.tableCols.forEach(function (oCol) {
                        oDSList[oCol.name] = oCol;
                    });
                } else {
                    oDSList[oItem.name] = oItem;
                }
            });

            /**
             * Function to check if the value is numeric or not
             */
            function isNumericValue(val) {
                if (typeof val === "number") return !isNaN(val) && isFinite(val);
                if (typeof val === "string" && val.trim() !== "") {
                    return !isNaN(Number(val)) && isFinite(Number(val));
                }
                return false;
            }

            /**
             * Function to check the datatype
             */
            function isNumericDataType(sKey) {
                var oDSEntry = oDSList[sKey];
                if (!oDSEntry) return false;
                var sType = (oDSEntry.dataType || "").toLowerCase().replace(/\s+/g, "");
                var aValidTypes = ["numeric", "numericflexible"];
                return aValidTypes.includes(sType);
            }

            Object.keys(oImperialData).forEach(function (oItem) {
                if (oItem === "READINGS") {
                    oImperialData[oItem].forEach(function (oReading, idx) {
                        Object.keys(oReading).forEach(function (oReadingItem) {
                            if (aSkipKeys.indexOf(oReadingItem) !== -1) return;

                            var val = oReading[oReadingItem];

                            if (isNumericValue(val) && isNumericDataType(oReadingItem)) {
                                oTarget = {
                                    "key": oReadingItem + "%" + idx,
                                    "src": oDSList[oReadingItem].uomImperial || "IN",
                                    "tgt": oDSList[oReadingItem].uomMetric || "MM",
                                    "srcValue": val.toString()
                                };
                                aConversionData.push(oTarget);
                            }
                        });
                    });
                } else {
                    if (aSkipKeys.indexOf(oItem) !== -1) return;

                    var val = oImperialData[oItem];
                    if (isNumericValue(val) && isNumericDataType(oItem)) {
                        oTarget = {
                            "key": oItem,
                            "src": oDSList[oItem].uomImperial || "IN",
                            "tgt": oDSList[oItem].uomMetric || "MM",
                            "srcValue": val.toString()
                        };
                        aConversionData.push(oTarget);
                    }
                }
            });

            this.fnUoMConvert(aConversionData, function (oResult) {
                oResult.forEach(function (oItem) {
                    if (oImperialData[oItem.key] !== undefined && oImperialData[oItem.key] == oItem.srcValue) {
                        oImperialData[oItem.key] = oItem.tgtValue;
                    }
                    if (oImperialData.READINGS && Array.isArray(oImperialData.READINGS)) {
                        oImperialData.READINGS.forEach(function (oReading, idx) {
                            Object.keys(oReading).forEach(function (oReadingItem) {
                                if (oItem.key === oReadingItem + "%" + idx) {
                                    if (oImperialData.READINGS[idx][oReadingItem] == oItem.srcValue) {
                                        oImperialData.READINGS[idx][oReadingItem] = oItem.tgtValue;
                                    }
                                }
                            });
                        });
                    }
                });
                fnSuccess(oImperialData);
            }, function () {
                fnError(oImperialData);
            });

        },

        /**
         * Function to convert UOM from Metric to Imperial
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {*} oMetricData - Metric data as object
         * @param {*} fnSuccess - Success callback function
         * @param {*} fnError - Error callback function
         */
        fnUoMConvertMetricToImperial: function (oCommonCMLModel, oMetricData, fnSuccess, fnError) {

            var aConversionData = [];
            var oTarget = {};
            var oDSList = {};
            var aDataSourceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList");

            aDataSourceList.forEach(function (oItem) {
                if (oItem.name === "READINGS") {
                    oItem.tableCols.forEach(function (oCol) {
                        oDSList[oCol.name] = oCol;
                    });
                } else {
                    oDSList[oItem.name] = oItem;
                }
            });

            Object.keys(oMetricData).forEach(function (oItem) {
                if (oItem === "READINGS") {
                    if (oMetricData[oItem] && Array.isArray(oMetricData[oItem])) {
                        oMetricData[oItem].forEach(function (oReading, idx) {
                            Object.keys(oReading).forEach(function (oReadingItem) {
                                if (typeof oReading[oReadingItem] === "number") {
                                    oTarget = {
                                        "key": oReadingItem + "%" + idx,
                                        "src": oDSList[oReadingItem].uomMetric === "" ? "MM" : oDSList[oReadingItem].uomMetric,
                                        "tgt": oDSList[oReadingItem].uomImperial === "" ? "IN" : oDSList[oReadingItem].uomImperial,
                                        "srcValue": (oReading[oReadingItem]).toString()
                                    }
                                    aConversionData.push(oTarget);
                                }
                            });
                        });
                    }
                } else {
                    if (typeof oMetricData[oItem] === "number" || oDSList[oItem] && (oDSList[oItem].dataType === "numeric" || oDSList[oItem].dataType === "numericflexible")) {
                        if (oMetricData[oItem] != null && oMetricData[oItem] !== "" && !isNaN(oMetricData[oItem])) {
                            oTarget = {
                                "key": oItem,
                                "src": oDSList[oItem].uomMetric === "" ? "MM" : oDSList[oItem].uomMetric,
                                "tgt": oDSList[oItem].uomImperial === "" ? "IN" : oDSList[oItem].uomImperial,
                                "srcValue": (oMetricData[oItem]).toString()
                            }
                            aConversionData.push(oTarget);
                        }
                    }
                }
            });

            this.fnUoMConvert(aConversionData, function (oResult) {
                oResult.forEach(function (oItem) {
                    if (oMetricData[oItem.key] == oItem.srcValue) {
                        oMetricData[oItem.key] = oItem.tgtValue;
                    }
                    if (oMetricData.READINGS && Array.isArray(oMetricData.READINGS)) {
                        oMetricData.READINGS.forEach(function (oReading, idx) {
                            Object.keys(oReading).forEach(function (oReadingItem) {
                                if (oItem.key === oReadingItem + "%" + idx) {
                                    if (oMetricData.READINGS[idx][oReadingItem] === oItem.srcValue) {
                                        oMetricData.READINGS[idx][oReadingItem] = oItem.tgtValue;
                                    }
                                }
                            });
                        });
                    }
                });
                fnSuccess(oMetricData);
            }, function () {
                fnError(oMetricData);
            });

        },

        /**
         * Function to return the Object to API
         * 
         * @param {Array} aSections - Section list
         * @param {String} Action - Action text
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {String} sLevel - EQUI / FLOC
         * @param {Object} oModel - JSON Model
         */
        fnReturnObjectForApi: function (aSections, Action, oCommonCMLModel, sLevel, oModel) {

            var that = this;
            var oEnvironmentValue = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Environment");
            var oRefValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Reference");
            var oDSValues = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource");
            var oDataSourceValuesBEFormat = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat");
            var DataSourceApiList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/DataSourceApiList");
            var sObjectType = oCommonCMLModel.getData().data.selectedCML.objectType;
            var oSelectedApiList = [];
            var oData = {};
            var oDataSourceData = {};
            var aData = [];
            var payload = {};
            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            if (Action === "Save" && sUom === "metric") {
                oDSValues = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/ConvertedDsvalues");
            }

            if (Action === "Calculate" && sUom === "metric") {
                oDSValues = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/ConvertedDsvalues");
                oRefValues = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/convertedRefValues");
            }

            if (Action === "Calculate") {
                oSelectedApiList = aSections.apiList.filter(function (oVal) {
                    return oVal.action === "C";
                });
                if (oSelectedApiList && oSelectedApiList.length >= 1) {
                    oSelectedApiList = oSelectedApiList[0];
                    oData.api = oSelectedApiList.destination + oSelectedApiList.api.slice(1);
                } else {
                    return {
                        "api": "",
                        "payload": {}
                    };
                }
            } else if (Action === "Save") {
                if (DataSourceApiList && DataSourceApiList.length >= 1 && DataSourceApiList[0].apiList && DataSourceApiList[0].apiList[0]) {
                    oSelectedApiList = $.extend(true, {}, DataSourceApiList[0].apiList[0]);
                    oData.api = oSelectedApiList.destination + oSelectedApiList.api.slice(1);
                } else {
                    return {
                        "api": "",
                        "payload": {}
                    };
                }
            }

            if (Object.keys(oSelectedApiList).length >= 1) {

                oData.algorithmId = oSelectedApiList.algorithmId;

                $.each(oSelectedApiList.paramMappingList, function (j, param) {
                    if (param.direction === "export") {
                        return;
                    }

                    if (param.dataSourceReferenceType === "R") {
                        payload[param.apiParameter] = that.fnToReturnValueOfType(oRefValues[param.dataSourceReferenceName], param.type);
                    } else if (param.dataSourceReferenceType === "D") {
                        if (param.type === "table") {
                            payload[param.apiParameter] = that.fnReturnArrayForPayload(param, oDSValues, oCommonCMLModel);
                        } else {
                            payload[param.apiParameter] = that.fnToReturnValueOfType(oDSValues[param.dataSourceReferenceName], param.type);
                        }

                    } else if (param.dataSourceReferenceType === "E") {
                        payload[param.apiParameter] = oEnvironmentValue[param.dataSourceReferenceName];
                    }
                    oData.payload = payload;
                });

                $.each(oSelectedApiList.dataSourceMappingList, function (k, oValue) {

                    oDataSourceData = {};

                    if (sLevel === "EQUIPMENT") {
                        oDataSourceData = {
                            "equipmentId": oModel.getData().id,
                            "locationId": oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Id"),
                            "referenceType": sObjectType,
                            "referenceId": oModel.getData().id,
                            "objectType": sObjectType
                        };
                    } else {
                        oDataSourceData = {
                            "equipmentId": oModel.equipmentId ? oModel.equipmentId : oModel.locationId,
                            "locationId": oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/Id"),
                            "referenceType": "CL",
                            "referenceId": oModel.checklistId,
                            "objectType": sObjectType
                        };
                    }

                    var aPreparedData = aData.filter(function (oPrepareddata) {
                        return oPrepareddata.propertyName === oValue.dataSource;
                    });

                    //Ignoring we get the same Data source (we can expect get for table data save)
                    if (aPreparedData && aPreparedData.length >= 1) {
                        // calling fnExcludeNoValueDataSource method while last iteration 
                        if (oSelectedApiList.dataSourceMappingList.length === k + 1) {
                            aData = that.fnExcludeNoValueDataSource(aData);
                        }
                        return;
                    }

                    var aSelectedDataSource = oSelectedApiList.dataSourceMappingList.filter(function (oDs) {
                        return oDs.dataSource === oValue.dataSource;
                    });


                    if (aSelectedDataSource && aSelectedDataSource.length >= 1) {
                        var oDsOtherValues = that.fnReturnSingleSetDataSource(aSelectedDataSource, oDSValues, oDataSourceValuesBEFormat, oCommonCMLModel);
                        if (oDsOtherValues.length > 0) {
                            aData = aData.concat(oDsOtherValues);
                        } else {
                            oDataSourceData.referenceId = oDsOtherValues.referenceId ? oDsOtherValues.referenceId : oDataSourceData.referenceId;
                            oDataSourceData.referenceType = oDsOtherValues.referenceType ? oDsOtherValues.referenceType : oDataSourceData.referenceType;
                            oDataSourceData.propertyName = oDsOtherValues.propertyName;
                            oDataSourceData.propertyValue = oDsOtherValues.propertyValue;
                            oDataSourceData.posted = oDsOtherValues.posted;
                            if (oDsOtherValues.dataId) {
                                oDataSourceData.dataId = oDsOtherValues.dataId;
                            }
                            aData.push(oDataSourceData);
                        }
                    }

                    // calling fnExcludeNoValueDataSource method while last iteration 
                    if (oSelectedApiList.dataSourceMappingList.length === k + 1) {
                        aData = that.fnExcludeNoValueDataSource(aData);
                    }

                });

                if (aData.length >= 1) {
                    payload = aData;
                }

                oData.payload = payload;

                return oData;
            } else {
                return {
                    "api": "",
                    "payload": {}
                };
            }

        },

        /**
         * Function to Assign the Values to the Fields
         * 
         * @param {Object} oData - List of data as object
         * @param {Integer} iCounter - Counter value
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Function} fnSuccess - Success callback function
         */
        fnAssignOutPutValues: function (oData, iCounter, oCommonCMLModel, fnSuccess) {

            var that = this;
            var aSections = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/sectionList");
            var action = oCommonCMLModel.getProperty("/data/CMLTabSection/temp/Action");
            var aReferenceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/referenceList");
            var aDataSourceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList");
            var tempValue = "";
            var sUom = oCommonCMLModel.getProperty("/data/UOM");
            var oSelectedApiList;

            if (action === "Calculate") {
                oSelectedApiList = aSections[iCounter].apiList.filter(function (oVal) {
                    return oVal.action === "C";
                });
                if (oSelectedApiList && oSelectedApiList.length >= 1) {
                    oSelectedApiList = oSelectedApiList[0];
                }
            }

            var aSelectedRefDs = [];
            /**
             * Function to Assign the values to the DataSource fields
             * 
             * @param {Object} oData 
             * @returns 
             */
            var doThisOperation = function (oData) {
                $.each(Object.keys(oData), function (i, key) {
                    var aSelectedParameter = oSelectedApiList.paramMappingList.filter(function (param) {
                        return param.apiParameter === key && param.direction === "export";
                    });
                    if (aSelectedParameter && aSelectedParameter.length >= 1) {
                        if (aSelectedParameter[0].dataSourceReferenceType === "R") {
                            aSelectedRefDs = aReferenceList.filter(function (oRef) {
                                return oRef.name === aSelectedParameter[0].dataSourceReferenceName;
                            });
                        } else if (aSelectedParameter[0].dataSourceReferenceType === "D") {
                            aSelectedRefDs = aDataSourceList.filter(function (oRef) {
                                return oRef.name === aSelectedParameter[0].dataSourceReferenceName;
                            });
                        }
                        if (aSelectedRefDs[0] && aSelectedRefDs[0].attrIndId) {
                            aSelectedRefDs = aSelectedRefDs[0];
                            var aSelectedEqPrecValue = oEqPrecValues.filter(function (oPrecRef) {
                                return oPrecRef.id === aSelectedRefDs.EquipmentTemplateID + "_" + aSelectedRefDs.groupId + "_" + aSelectedRefDs.attrIndId;
                            });

                            if (aSelectedEqPrecValue[0] && aSelectedEqPrecValue[0].dataType === "numericflexible") {
                                aSelectedEqPrecValue = aSelectedEqPrecValue[0];
                                tempValue = that.fnToHandlePrecisionScale(oData[key], aSelectedEqPrecValue);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + aSelectedParameter[0].dataSourceReferenceName, tempValue);
                            } else if (aSelectedEqPrecValue[0] && aSelectedEqPrecValue[0].dataType === "date") {
                                aSelectedEqPrecValue = aSelectedEqPrecValue[0];
                                tempValue = (oData[key] instanceof Date) ? oData[key] : that.normalizeDate(oData[key]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + aSelectedParameter[0].dataSourceReferenceName, tempValue);
                            } else {
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + aSelectedParameter[0].dataSourceReferenceName, oData[key]);
                            }
                        }
                        if (aSelectedParameter[0].dataSourceReferenceType === "R") {
                            if (aSelectedRefDs[0] && aSelectedRefDs[0].dataType === "numericflexible" && !aSelectedRefDs[0].attrIndId) {
                                tempValue = that.fnToHandlePrecisionScale(oData[key], aSelectedRefDs[0]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + aSelectedParameter[0].dataSourceReferenceName, tempValue);
                            } else if (aSelectedRefDs[0] && aSelectedRefDs[0].dataType === "date" && !aSelectedRefDs[0].attrIndId) {
                                tempValue = (oData[key] instanceof Date) ? oData[key] : that.normalizeDate(oData[key]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + aSelectedParameter[0].dataSourceReferenceName, tempValue);
                            } else if (aSelectedRefDs[0] && aSelectedRefDs[0].dataType === "table" && !aSelectedRefDs[0].attrIndId) {
                                that.fnShowTableData(oData[key], aSelectedParameter[0], aSections[iCounter], oCommonCMLModel);
                            } else if (aSelectedRefDs[0] && !aSelectedRefDs[0].attrIndId) {
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + aSelectedParameter[0].dataSourceReferenceName, oData[key]);
                            }
                        } else if (aSelectedParameter[0].dataSourceReferenceType === "D") {
                            if (aSelectedRefDs[0] && aSelectedRefDs[0].dataType === "numericflexible") {
                                tempValue = that.fnToHandlePrecisionScale(oData[key], aSelectedRefDs[0]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + aSelectedParameter[0].dataSourceReferenceName, tempValue);
                            } else if (aSelectedRefDs[0] && aSelectedRefDs[0].dataType === "date") {
                                tempValue = (oData[key] instanceof Date) ? oData[key] : that.normalizeDate(oData[key]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + aSelectedParameter[0].dataSourceReferenceName, tempValue);
                            } else if (aSelectedRefDs[0] && aSelectedRefDs[0].dataType === "table") {
                                that.fnShowTableData(oData[key], aSelectedParameter[0], aSections[iCounter], oCommonCMLModel);
                            } else {
                                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + aSelectedParameter[0].dataSourceReferenceName, oData[key]);
                            }
                        }
                    }
                });

                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/PREDICTED_THICKNESS_LSCR", oData.predictedY);
                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/PREDICTED_THICKNESS_LTCR", oData.predictedYLTCR);
                oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/PREDICTED_THICKNESS_STCR", oData.predictedYSTCR);
                if(oData.historyExportTable){
                    oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/RETIREMENT_DATE_LSCR", oData.historyExportTable ? (oData.historyExportTable.length > 0 ? oData.historyExportTable[0].retirementDateLSCR : "") : "");
                    oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/RETIREMENT_DATE_LTCR", oData.historyExportTable ? (oData.historyExportTable.length > 0 ? oData.historyExportTable[0].retirementDateLTCR : "") : "");
                    oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/RETIREMENT_DATE_STCR", oData.historyExportTable ? (oData.historyExportTable.length > 0 ? oData.historyExportTable[0].retirementDateSTCR : "") : "");
                }
                return fnSuccess();
            };
            var uomsToConvert = [];
            var sUomSystem = sUom

            $.each(Object.keys(oData), function (iDx, sVal) {

                aSelectedRefDs = [];
                var sTemp = "";
                var aSelectedParameter = oSelectedApiList.paramMappingList.filter(function (param) {
                    return param.apiParameter === sVal && param.direction === "export";
                });

                if (aSelectedParameter && aSelectedParameter.length >= 1) {
                    if (aSelectedParameter[0].dataSourceReferenceType === "R") {
                        aSelectedRefDs = aReferenceList.filter(function (oRef) {
                            return oRef.name === aSelectedParameter[0].dataSourceReferenceName;
                        });
                        //Setting it for Imperial DataProperties for Reference
                        if (oData[sVal] && oData[sVal] !== "NaN" && oData[sVal] !== null) {
                            if (aSelectedRefDs[0] && aSelectedRefDs[0].attrIndId && sUom === "metric") {
                                aSelectedRefDs = aSelectedRefDs[0];
                                var sTempSelectedRef = oEqPrecValues.filter(function (sData) {
                                    return sData.id === aSelectedRefDs.EquipmentTemplateID + "_" + aSelectedRefDs.groupId + "_" + aSelectedRefDs.attrIndId;
                                });
                                if (sTempSelectedRef[0] && sTempSelectedRef[0].dataType === "numericflexible") {
                                    sTemp = that.fnToHandlePrecisionScale(oData[sVal], aSelectedRefDs);
                                    oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues/" + aSelectedRefDs.name, sTemp);
                                } else if (sTempSelectedRef[0] && sTempSelectedRef[0].dataType === "date") {
                                    sTemp = (oData[sVal] instanceof Date) ? oData[sVal] : that.normalizeDate(oData[sVal]);
                                    oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues/" + aSelectedRefDs.name, sTemp);
                                } else if (sTempSelectedRef[0] && sTempSelectedRef[0].dataType === "numeric") {
                                    oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues/" + aSelectedRefDs.name, oData[sVal]);
                                }
                            } else if (aSelectedRefDs[0].dataType === "numericflexible" && sUom === "metric") {
                                sTemp = that.fnToHandlePrecisionScale(oData[sVal], aSelectedRefDs[0]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues/" + aSelectedRefDs[0].name, sTemp);
                            } else if (aSelectedRefDs[0].dataType === "date" && sUom === "metric") {
                                sTemp = (oData[sVal] instanceof Date) ? oData[sVal] : that.normalizeDate(oData[sVal]);
                                oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues/" + aSelectedRefDs[0].name, sTemp);
                            } else if (aSelectedRefDs[0].dataType === "numeric" && sUom === "metric") {
                                oCommonCMLModel.setProperty("/data/CMLTabSection/temp/convertedRefValues/" + aSelectedRefDs[0].name, oData[sVal]);
                            }
                        }

                    } else if (aSelectedParameter[0].dataSourceReferenceType === "D") {
                        aSelectedRefDs = aDataSourceList.filter(function (oRef) {
                            return oRef.name === aSelectedParameter[0].dataSourceReferenceName;
                        });
                    }
                }

                if (aSelectedRefDs[0] && aSelectedRefDs[0].dimension && aSelectedRefDs[0].dataType !== "table") {
                    if (oData[sVal] && oData[sVal] !== "NaN" && oData[sVal] !== null) {
                        uomsToConvert.push({
                            "key": sVal,
                            "src": sUomSystem === "metric" ? aSelectedRefDs[0].uomImperial : aSelectedRefDs[0].uomMetric,
                            "tgt": sUomSystem === "metric" ? aSelectedRefDs[0].uomMetric : aSelectedRefDs[0].uomImperial,
                            "srcValue": oData[sVal]
                        });
                    }
                }
            });

            if (uomsToConvert.length >= 1 && sUom === "metric") {
                that.fnUoMConvert(uomsToConvert, function (oSuccessData) {
                    if (oSuccessData.length > 0) {
                        oSuccessData.forEach(function (oNewUom) {
                            oData[oNewUom.key] = oNewUom.tgtValue;
                        });
                    }
                    doThisOperation(oData);
                }, function (oError) {
                    that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE031"), oError);
                });
            } else {
                doThisOperation(oData);
            }

        },

        /**
         * Function to assign the values and return for payload
         * 
         * @param {Object} oParameter - Payload param
         * @param {*} oValues - Values for payload
         * @param {*} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnReturnArrayForPayload: function (oParameter, oValues, oCommonCMLModel) {

            var that = this;
            var aTableCols = oParameter.tableCols;
            var oDataSourceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/MinifiedDSObject");
            var aData = [];
            var oData = {};
            var oDataSource = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSourceBEFormat");
            var aSelectedDataSource = oValues[oParameter.dataSourceReferenceName];

            if (aSelectedDataSource && aSelectedDataSource.length >= 1) {
                var oDSFound = {};
                aSelectedDataSource = aSelectedDataSource.filter(function (oReading) {
                    oDSFound = oDataSource.find(function (oDsItem) {
                        oReading.isIgnored = oDsItem.isIgnored;
                        return oDsItem.ID === oReading.dataId;
                    });

                    if (oDSFound) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }

            if (aSelectedDataSource && aSelectedDataSource.length >= 1) {
                if (oParameter.dataSourceReferenceType === "D") {
                    $.each(aSelectedDataSource, function (i, oVal) {
                        oData = {};
                        var oDsValues = oVal;
                        $.each(aTableCols, function (iT, oTable) {
                            if (oDsValues[oTable.dataSourceReferenceColName]) {
                                if (oDataSourceList && oDataSourceList[oParameter.dataSourceReferenceName][oTable.dataSourceReferenceColName].dataType ===
                                    "date") {
                                    oData[oTable.apiParameter] = that.fnGetBEDate(oDsValues[oTable.dataSourceReferenceColName]);
                                } else {
                                    oData[oTable.apiParameter] = oDsValues[oTable.dataSourceReferenceColName];
                                }
                            }
                        });
                        if(oDsValues["APPLY_TEMPERATURE_COMPENSATION"] && oDsValues["TEMPERATURE_CORRECTED_AVG"] != null && oDsValues["TEMPERATURE_CORRECTED_AVG"] != undefined){
                            oData.tca = oDsValues["TEMPERATURE_CORRECTED_AVG"];
                        }else{
                            oData.tca = null;
                        }
                        oData.dataId = oDsValues.dataId;
                        oData.ignored = oDsValues.isIgnored;
                        if (Object.keys(oData).length > 0) {
                            aData.push(oData);
                        }
                    });
                }
            }
            if (aData && aData.length >= 1) {
                return aData;
            } else {
                return [];
            }

        },

        /**
         * Function to convert the Json Date format to String data
         * 
         * @param {Object} oDate 
         * @returns 
         */
        fnGetBEDate: function (oDate) {

            if (!oDate || (!(oDate instanceof Date))) {
                return null;
            }
            var sRet = "";
            sRet = sRet + oDate.getFullYear();
            sRet = sRet + "-";
            sRet = sRet + (((oDate.getMonth() + 1) < 10) ? ("0" + (oDate.getMonth() + 1)) : (oDate.getMonth() + 1));
            sRet = sRet + "-";
            sRet = sRet + ((oDate.getDate() < 10) ? ("0" + (oDate.getDate())) : oDate.getDate());

            return sRet;

        },

        /**
         * Function to Exclude the values to the dataSource
         * @param {Array} aData - Datasource value
         * @returns 
         */
        fnExcludeNoValueDataSource: function (aData) {

            var aCopyData = $.extend(true, [], aData);

            $.each(aCopyData, function (i, oVal) {
                // Check DataId, if no check for empty
                if (!oVal.dataId) {
                    if (oVal.propertyValue && (oVal.propertyValue === "{}" || oVal.propertyValue === "null" || oVal.propertyValue === null)) {
                        // Just added to identify empty or nor (true is empty)
                        aCopyData[i].isEmpty = true;

                    } else if (oVal.propertyValue && JSON.parse(oVal.dataSourceValue) && (JSON.parse(oVal.dataSourceValue).value === "" || JSON.parse(
                        oVal.propertyValue).value === "{}")) {

                        // Just added to identify empty or nor	(true is empty)	
                        aCopyData[i].isEmpty = true;
                    } else {
                        aCopyData[i].isEmpty = false;
                    }
                } else {
                    // Just added to identify empty or not (false is not empty)
                    aCopyData[i].isEmpty = false;
                }
            });

            // Filtring the data by isEmpty by false (not empty entries)
            aCopyData = aCopyData.filter(function (oData) {
                return oData.isEmpty === false;
            });

            //loop to remove isEmprty property
            $.each(aCopyData, function (j, oVal) {
                delete oVal.isEmpty;
            });

            return aCopyData;

        },

        /**
         * Function to Return the DataSource as single object
         * 
         * @param {Array} aDataSource - DataSource list
         * @param {Array} aDataSourceValues - DataSource value
         * @param {Array} aDataSourceValuesBEFormat - DataSource Backend format
         * @param {Object} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnReturnSingleSetDataSource: function (aDataSource, aDataSourceValues, aDataSourceValuesBEFormat, oCommonCMLModel) {

            var that = this;
            var aReferenceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/referenceList");
            var oDataSourceSet = {};
            var oDSValues = {};
            var oDataSourceValuesBEFormatByDataId = {};

            var aSelectedDs = aDataSourceValuesBEFormat.filter(function (oVal) {
                return oVal.propertyName === aDataSource[0].dataSource;
            });

            if (aSelectedDs && aSelectedDs.length <= 1) {
                aSelectedDs = aSelectedDs[0];
                oDataSourceSet.propertyName = aDataSource[0].dataSource;
                if (aSelectedDs && aSelectedDs.dataId) {
                    oDataSourceSet.dataId = aSelectedDs.dataId;
                    oDataSourceSet.referenceType = aSelectedDs.referenceType;
                    oDataSourceSet.referenceId = aSelectedDs.referenceId;
                    oDataSourceSet.posted = aSelectedDs.posted;
                }
                $.each(aDataSource, function (i, oValue) {
                    if (oValue.refNameReferValue) {
                        if (aDataSourceValues[oValue.dataSource]) {
                            if (aDataSourceValues[oValue.dataSource][0][oValue.columnName]) {
                                oDSValues[oValue.columnName] = that.fnToReturnValueOfType(aDataSourceValues[oValue.dataSource][0][oValue.columnName], oValue
                                    .columnType);
                            } else {
                                oDSValues[oValue.dataSource] = that.fnToReturnValueOfType(aDataSourceValues[oValue.dataSource], oValue.type);
                            }
                        } {
                            var aSelectedReferenceList = aReferenceList.filter(function (oVal) {
                                return oValue.refNameReferValue === oVal.name;
                            });
                            if (aSelectedReferenceList && aSelectedReferenceList.length >= 1) {
                                var oRefAttIndVAlue = that.fnReturnAttributeIndicatorValue(aSelectedReferenceList[0], oCommonCMLModel);
                                if (!oRefAttIndVAlue.attIndData) {
                                    return;
                                }
                                var oRefAttIndValue = oRefAttIndVAlue.attIndData.value1;

                                if (oValue.columnName) {
                                    oDSValues[oValue.columnName] = that.fnToReturnValueOfType(oRefAttIndValue, oValue.columnType);
                                } else {
                                    oDSValues[oValue.dataSource] = that.fnToReturnValueOfType(oRefAttIndValue, oValue.type);
                                }
                            }
                        }
                    } else if (oValue.columnName && aDataSourceValues[oValue.dataSource] && aDataSourceValues[oValue.dataSource][0]) {
                        oDSValues[oValue.columnName] = that.fnToReturnValueOfType(aDataSourceValues[oValue.dataSource][0][oValue.columnName], oValue.columnType);
                    } else {
                        oDSValues = that.fnToReturnValueOfType(aDataSourceValues[oValue.dataSource], oValue.type);
                    }
                });
                oDataSourceSet.propertyValue = JSON.stringify({
                    "value": oDSValues
                });

            } else if (aSelectedDs && aSelectedDs.length > 1) {
                var aDataSet = [];
                $.each(aDataSourceValuesBEFormat, function (i, oDsBE) {
                    oDataSourceValuesBEFormatByDataId[oDsBE.dataId] = oDsBE;
                });
                if (typeof aDataSourceValues[aDataSource[0].dataSource] === "object") {
                    $.each(aDataSourceValues[aDataSource[0].dataSource], function (j, oDsVal) {
                        oDSValues = {};
                        $.each(aDataSource, function (i, oValue) {
                            if (oValue.refNameReferValue) {
                                if (oDsVal && oDsVal[oValue.columnName]) {
                                    oDSValues[oValue.columnName] = that.fnToReturnValueOfType(oDsVal[oValue.columnName], oValue.columnType);
                                } else {
                                    oDSValues[oValue.dataSource] = that.fnToReturnValueOfType(aDataSourceValues[oValue.dataSource], oValue.type);
                                }
                            } else if (oValue.columnName && oDsVal && (oDsVal[oValue.columnName] || oDsVal[oValue.columnName] == "0")) {
                                oDSValues[oValue.columnName] = that.fnToReturnValueOfType(oDsVal[oValue.columnName], oValue.columnType);
                            }
                        });
                        if (oDataSourceValuesBEFormatByDataId[oDsVal.dataId]) {
                            oDataSourceSet = oDataSourceValuesBEFormatByDataId[oDsVal.dataId];
                            oDataSourceSet.propertyValue = JSON.stringify({
                                "value": oDSValues
                            });
                            aDataSet.push(oDataSourceSet);
                        }
                    });
                }
            }

            if (aDataSet) {
                return aDataSet;
            } else {
                return oDataSourceSet;
            }

        },

        /**
         * Function  to Return the Characteristic values
         * 
         * @param {Array} oReference - Reference List
         * @param {*} oModelIdms - Detail page model
         * @returns 
         */
        fnReturnAttributeIndicatorValue: function (oReference, oModelIdms) {

            var oData = {
                "attIndMetaData": {},
                "attIndData": {}
            };

            var oAttIndValues = oModelIdms.getProperty("/data/CMLTabSection/AttributeIndicaorValues");
            var aEquipmentTempAttIndMetaData = oModelIdms.getProperty("/data/CMLTabSection/Detail/EquipmentAttIndObject");

            oData.attIndMetaData = aEquipmentTempAttIndMetaData[oReference.EquipmentTemplateID + "_" + oReference.groupId + "_" + oReference.attrIndId];
            oData.attIndData = oAttIndValues[oReference.EquipmentTemplateID + "_" + oReference.groupId + "_" + oReference.attrIndId];

            return oData;

        },

        /**
         * Function to display the Readings table data
         * 
         * @param {Object} oData - Table data as object
         * @param {*} oParameter - Table data parameter
         * @param {*} oSection - Section list
         * @param {*} oCommonCMLModel - Detail page model
         */
        fnShowTableData: function (oData, oParameter, oSection, oCommonCMLModel) {

            var that = this;
            var oDataSet = {};
            var aRefList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/referenceList");
            var aDataSourceList = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData/dataSourceList");
            var aReadingsList = oCommonCMLModel.getProperty("/data/CMLTabSection/LocationData/DataSource/READINGS")
            var aSelectedReferenceDaTaSource = [];
            var aCalculatedDataSet = [];
            var sUom = oCommonCMLModel.getProperty("/data/UOM");
            var oReadingsByDataId = {};

            if (oParameter.dataSourceReferenceType === "R") {
                aSelectedReferenceDaTaSource = aRefList.filter(function (oVal) {
                    return oVal.name === oParameter.dataSourceReferenceName;
                });
                if (aSelectedReferenceDaTaSource && aSelectedReferenceDaTaSource.length >= 1) {
                    aSelectedReferenceDaTaSource = aSelectedReferenceDaTaSource[0];
                }
            } else if (oParameter.dataSourceReferenceType === "D") {
                aSelectedReferenceDaTaSource = aDataSourceList.filter(function (oVal) {
                    return oVal.name === oParameter.dataSourceReferenceName;
                });
                if (aSelectedReferenceDaTaSource && aSelectedReferenceDaTaSource.length >= 1) {
                    aSelectedReferenceDaTaSource = aSelectedReferenceDaTaSource[0];
                }
            }

            $.each(oData, function (i, oVal) {
                oDataSet = {};
                $.each(oParameter.tableCols, function (j, oTableCol) {
                    oDataSet[oTableCol.dataSourceReferenceColName] = that.fnReturnProperValueForTableData(oVal, oTableCol, aSelectedReferenceDaTaSource, oCommonCMLModel);
                    oDataSet.dataId = oVal.dataId;
                });
                aCalculatedDataSet.push(oDataSet);
            });

            // Persisting value for other keys 
            if(aReadingsList && aReadingsList.length){
                aReadingsList.forEach(function(oReading){
                    oReadingsByDataId[oReading.dataId] = oReading;
                });
            }
            
            if(aCalculatedDataSet && aCalculatedDataSet.length){
                aCalculatedDataSet.forEach(function(oCalcDataSet, iIndex) {
                    aCalculatedDataSet[iIndex] = Object.assign({}, oReadingsByDataId[oCalcDataSet.dataId], oCalcDataSet);
                });
            }
        
            /**
             *
             */
            var fnSetModelProperty = function (aDataSet) {
                if (oParameter.dataSourceReferenceType === "R") {
                    oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/Reference/" + oParameter.dataSourceReferenceName, aDataSet);
                } else if (oParameter.dataSourceReferenceType === "D") {
                    oCommonCMLModel.setProperty("/data/CMLTabSection/LocationData/DataSource/" + oParameter.dataSourceReferenceName, aDataSet);
                }
            };
        
            /**
             * Helper to format all numericflexible fields in a dataset row
             */
            var fnFormatDataSet = function (aDataSet) {
                return aDataSet.map(function (oRow) {
                    var oFormattedRow = Object.assign({}, oRow);
                    Object.keys(oFormattedRow).forEach(function (sKey) {
                        if (oFormattedRow[sKey] !== null && oFormattedRow[sKey] !== undefined) {
                            var aMatchedCol = aSelectedReferenceDaTaSource.tableCols ? aSelectedReferenceDaTaSource.tableCols.filter(function (oCol) {
                                return oCol.name === sKey;
                            }) : [];
                            if (aMatchedCol[0] && aMatchedCol[0].dataType === "numericflexible") {
                                oFormattedRow[sKey] = that.fnToHandlePrecisionScale(oFormattedRow[sKey], aMatchedCol[0]);
                            }
                        }
                    });
                    return oFormattedRow;
                });
            };
        
            if (sUom === "metric") {
                var uomsToConvert = [];
                aCalculatedDataSet.forEach(function (oRow, iRowIndex) {
                    Object.keys(oRow).forEach(function (sKey) {
                        var aMatchedCol = aSelectedReferenceDaTaSource.tableCols ? aSelectedReferenceDaTaSource.tableCols.filter(function (oCol) {
                            return oCol.name === sKey;
                        }) : [];
                        if (aMatchedCol[0] && aMatchedCol[0].dimension &&
                            aMatchedCol[0].dataType !== "date" &&
                            oRow[sKey] !== null && oRow[sKey] !== undefined && oRow[sKey] !== "NaN") {
                            uomsToConvert.push({
                                key: sKey + "%" + iRowIndex,
                                src: aMatchedCol[0].uomImperial,
                                tgt: aMatchedCol[0].uomMetric,
                                srcValue: oRow[sKey]
                            });
                        }
                    });
                });
        
                if (uomsToConvert.length > 0) {
                    that.fnUoMConvert(uomsToConvert, function (oSuccessData) {
                        if (oSuccessData && oSuccessData.length > 0) {
                            oSuccessData.forEach(function (oNewUom) {
                                var aParts = oNewUom.key.split("%");
                                var sColKey = aParts[0];
                                var iRowIdx = parseInt(aParts[1]);
                                if (aCalculatedDataSet[iRowIdx]) {
                                    aCalculatedDataSet[iRowIdx][sColKey] = oNewUom.tgtValue;
                                }
                            });
                        }
                        aCalculatedDataSet = fnFormatDataSet(aCalculatedDataSet);
                        fnSetModelProperty(aCalculatedDataSet);
        
                    }, function (oError) {
                        that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE031"), oError);
                    });
                } else {
                    aCalculatedDataSet = fnFormatDataSet(aCalculatedDataSet);
                    fnSetModelProperty(aCalculatedDataSet);
                }
            } else {
                fnSetModelProperty(aCalculatedDataSet);
            }
        },

        /**
         * Function to Prepare the table data for UOM conversion
         * 
         * @param {Object} oData - Table data
         * @param {Object} oParameter - Table data values
         * @param {Object} oSelecredDsRef - DataSource reference list
         * @param {Object} oCommonCMLModel - Detail page model
         * @param {Function} fnSuccess - Success callback function
         * @returns 
         */
        fnPrepareTableDataToConvert: function (oData, oParameter, oSelecredDsRef, oCommonCMLModel, fnSuccess) {

            var that = this;
            var uomsToConvert = [];

            if (oSelecredDsRef.tableCols && oSelecredDsRef.tableCols.length > 0) {
                if (oData && oData.length > 0) {
                    var aVals = [];
                    oSelecredDsRef.tableCols.forEach(function (oCol) {
                        if (oCol.dimension && oCol.dataType != "date") {
                            aVals = [];
                            oData.forEach(function (oRowVals, iDx) {
                                if (oRowVals[oCol.name] && oRowVals[oCol.name] !== ("Infinity" || "-Infinity" || "NaN")) {
                                    aVals.push({
                                        "val": oRowVals[oCol.name],
                                        "id": oCol.name + "%" + iDx
                                    });
                                }
                            });

                            if (aVals.length > 0) {
                                aVals.forEach(function (oVal) {
                                    if (oCol.uomImperial !== oCol.uomMetric) {
                                        uomsToConvert.push({
                                            "key": oVal.id,
                                            "src": oCol.uomImperial,
                                            "tgt": oCol.uomMetric,
                                            "srcValue": oVal.val
                                        });
                                    }

                                });
                            }
                        }
                    });
                }
            }

            if (uomsToConvert.length > 0) {
                var aKeyForTable = [];
                that.fnUoMConvert(uomsToConvert, function (oRetValues) {
                    if (oRetValues && oRetValues.length >= 0) {
                        $.each(oRetValues, function (iRx, oNewUom) {
                            aKeyForTable = oNewUom.key.split("%");
                            if (aKeyForTable[0] && aKeyForTable[1]) {
                                oData[aKeyForTable[1]][aKeyForTable[0]] = oNewUom.tgtValue;
                            }
                        });
                        return fnSuccess(oData);
                    }
                }, function (oError) {
                    that._oControl.fnMessageShow("E", oMessageBundle.getText("CML.MESSAGE031"), oError);
                });
            } else {
                return fnSuccess(oData);
            }

        },

        /**
         * Function to format the table data
         * 
         * @param {Object} oVal - Table value
         * @param {Object} oTableCol - Table columns
         * @param {Object} oReference - Reference list
         * @param {Object} oCommonCMLModel - Detail page model
         * @returns 
         */
        fnReturnProperValueForTableData: function (oVal, oTableCol, oReference, oCommonCMLModel) {

            var retValue;
            var aTableref = oReference.tableCols;
            var sUom = oCommonCMLModel.getProperty("/data/UOM");

            if (!aTableref) {
                return;
            }

            var aSelectedTableCol = aTableref.filter(function (oTable) {
                return oTable.name === oTableCol.dataSourceReferenceColName;
            });

            if (aSelectedTableCol && aSelectedTableCol.length >= 1) {
                aSelectedTableCol = aSelectedTableCol[0];
            }

            if (((!isNaN(oVal[oTableCol.apiParameter])) || oVal[oTableCol.apiParameter] === 0 || oVal[oTableCol.apiParameter] < 0.9) && (oVal[
                oTableCol.apiParameter] !== "Infinity" && oVal[oTableCol.apiParameter] !== "-Infinity" &&
                oVal[oTableCol.apiParameter] !== "NaN")) {
                if (aSelectedTableCol.dataType === "numericflexible") {
                    retValue = sUom === "metric" ? oVal[oTableCol.apiParameter] : this.fnToHandlePrecisionScale(oVal[oTableCol.apiParameter], aSelectedTableCol);
                } else if (aSelectedTableCol.dataType === "numeric") {
                    retValue = parseInt(oVal[oTableCol.apiParameter]);
                } else {
                    retValue = oVal[oTableCol.apiParameter];
                }
            } else if (isNaN(oVal[oTableCol.apiParameter]) && oVal[oTableCol.apiParameter] !== "Infinity" && oVal[oTableCol.apiParameter] !==
                "-Infinity" && oVal[oTableCol.apiParameter] !== "NaN" && aSelectedTableCol.dataType === "date") {
                retValue = new Date(oVal[oTableCol.apiParameter]);
            } else if (oVal[oTableCol.apiParameter] === "Infinity" || oVal[oTableCol.apiParameter] === "-Infinity" ||
                oVal[oTableCol.apiParameter] === "NaN") {
                if (aSelectedTableCol && aSelectedTableCol.dataType === "numeric" || aSelectedTableCol.dataType === "numericflexible" ||
                    aSelectedTableCol.dataType === "currency") {
                    retValue = 0;
                } else {
                    retValue = oVal[oTableCol.apiParameter];
                }
            } else if (oVal[oTableCol.apiParameter]) {
                retValue = oVal[oTableCol.apiParameter];
            } else {
                retValue = oVal[oTableCol.apiParameter];
            }

            return retValue;

        },

        /**
         * Function to save the Characteristic values
         * 
         * @param {Object} oRefValues - Reference list values
         * @param {*} oCommonCMLModel - Detail page model
         * @param {*} oModelUom - UOM Model
         * @param {*} fnSuccess - Success Callback function
         * @returns 
         */
        fnAttributeIndicatorToSave: function (oRefValues, oCommonCMLModel, oModelUom, fnSuccess) {

            var that = this;
            var oSection = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/LocationPersonaData");
            var oAttributeRet = {};
            var oInidicatorRet = {};
            var oDataRet = {};
            var aUomsToConvert = [];
            var sUomSystem = oCommonCMLModel.getProperty("/data/UOM");
            var sUomNode = sUomSystem === "metric" ? "uomMetric" : "uomImperial";
            var oEquipmentAttIndObject = oCommonCMLModel.getProperty("/data/CMLTabSection/Detail/EquipmentAttIndObject");

            $.each(oSection.referenceList, function (i, oRef) {
                var sKey = oRef.EquipmentTemplateID + "_" + oRef.groupId + "_" + oRef.attrIndId;
                if (oRef.updateMasterData === true && oRef.refType === "ATT") {
                    if (oRefValues[oRef.name]) {
                        if (oEquipmentAttIndObject[sKey] && oEquipmentAttIndObject[sKey].dataType === "date") {
                            oAttributeRet[sKey] = that.fnGetBEDate(new Date(oRefValues[oRef.name]));
                        } else {
                            oAttributeRet[sKey] = oRefValues[oRef.name].toString();
                        }
                    }
                } else if (oRef.updateMasterData === true && oRef.refType === "IND") {
                    if (oEquipmentAttIndObject[sKey] && oEquipmentAttIndObject[sKey].dimension1) {
                        var sSrcUom = oRef[sUomNode];
                        if (!sSrcUom) {
                            sSrcUom = oModelUom.getProperty("/" + oRef.attrIndId.dimension1 + "/" + sUomSystem);
                        }

                        if (sSrcUom && oRefValues[oRef.name] && oEquipmentAttIndObject[sKey].indicatorUom !== sSrcUom) {
                            aUomsToConvert.push({
                                "key": sKey,
                                "src": oRef[sUomNode],
                                "tgt": oEquipmentAttIndObject[sKey].indicatorUom,
                                "srcValue": oRefValues[oRef.name]
                            });
                        }
                    }
                    if (oEquipmentAttIndObject[sKey] && oEquipmentAttIndObject[sKey].dataType === "date") {
                        oInidicatorRet[sKey] = that.fnGetBEDate(new Date(oRefValues[oRef.name]));
                    } else if (oRefValues[oRef.name]) {
                        oInidicatorRet[sKey] = oRefValues[oRef.name].toString();
                    }
                }
            });

            oDataRet.oAttributeRet = oAttributeRet;
            oDataRet.oInidicatorRet = oInidicatorRet;

            if (aUomsToConvert.length > 0) {
                that.fnUoMConvert(aUomsToConvert, function (aSuccess) {
                    if (aSuccess && aSuccess.length > 0) {
                        $.each(aSuccess, function (i, oNewUom) {
                            if (oEquipmentAttIndObject[oNewUom.key].dataType === "numericflexible") {
                                oDataRet.oInidicatorRet[oNewUom.key] = that.fnToHandlePrecisionScale(oNewUom.tgtValue, oEquipmentAttIndObject[oNewUom.key]);
                            } else {
                                oDataRet.oInidicatorRet[oNewUom.key] = oNewUom.tgtValue;
                            }

                        });
                    }
                    return fnSuccess(oDataRet);
                }, function () { });
            } else {
                return fnSuccess(oDataRet);
            }

        }

    });
}, true);