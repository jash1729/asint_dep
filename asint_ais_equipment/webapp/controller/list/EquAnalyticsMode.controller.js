sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/export/Spreadsheet"
], function (BaseController, Filter, FilterOperator, JSONModel, Fragment, Spreadsheet) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.list.EquAnalyticsMode", {

        /**
         * Initializes the component
         * This function is called when the component is initialized
         * It attaches the 'fnInitialize' function to the "nEquipmentDetail" route pattern matched event
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentAnalytics").attachPatternMatched(this.fnInitialize, this);
        },

        /**
         * This function is called after the component has been rendered
         */
        onAfterRendering: function () {
            // this.fnInitialize();
        },

        /**
         * 
         */
        fnInitialize: function () {
            this.oI18n = this.getView().getModel("i18n").getResourceBundle();

            var oData = {
                "router": {},
                "data": {
                    "etag": "",
                    "detail": {},
                    "dialog": {},
                    "riskMatrixConfig":{
                        "ID":"",
                        "detail":null,
                        "riskValues":{},
                        "hcRiskValues":{},
                        "isNoDataVisible":false
                    },
                    "riskAnalysis":[],
                    "SHERiskAnalysis":[],
                    "FINRiskAnalysis":[],
                    "SHEHCRiskAnalysis":{
                        "Row1":[],
                        "Row2":[]
                    },
                    "userRoles": {
                        "edit": true
                    },
                    "genericValueHelp":{},
                    "filters":{
                        "location":[],
                        "maintPlant":[],
                        "plantSection":[],
                        "abcIndicator":[]
                    },
                    "listHeader":this.oI18n.getText("asint.equipment.list.toolbar.table.title",[0]),
                    "tableTiltleBusy":false,
                    "itemsList":[],
                    "page":{
                        "start":0,
                        "size":20
                    },
                    "variantFilters":"",
                    "prevSelections":{},
                    "prevSelectionsHC":{},
                    "isCorporateMatrixVisible":true,
                    "isValuePresentInHC":false,
                    "pageHC":{
                        "start":0,
                        "size":20
                    },
                    "backup":{},
                    "matrixLevelFilters":"",
                    "HCMatirxLevelFilters":""
                },
                "metadata": {
                    "tab": {},
                    "dropDowns":{
                        "assessmentType":[
                            {"key":"All","text":"All"},
                            {"key":"ASD","text":"Asset Strategy Development"},
                            {"key":"RCM","text":"Asset RCM Analysis"}
                        ],
                        "riskValue":[
                            {"key":"All","text":"All"},
                            {"key":"SHE_RC1 - RC2","text":"SHE RC 1-2"},
                            {"key":"FIN_RC1 - RC2","text":"FIN RC 1-2"},
                            {"key":"RC1 - RC2","text":"SHE & FIN RC 1-2"}
                        ],
                        "recommendations":[
                            {"key":"All","text":"All"},
                            {"key":true,"text":"EDDs with Recommendations","assessmentType":"ASD"},
                            {"key":false,"text":"EDDs without Recommendations","assessmentType":"ASD"},
                            {"key":true,"text":"Failure Mode with Recommendations","assessmentType":"RCM"},
                            {"key":false,"text":"Failure Mode without Recommendations","assessmentType":"RCM"}
                        ],
                        "recommendationsDropdown":[
                            {"key":"All","text":"All"},
                            {"key":true,"text":"EDDs with Recommendations","assessmentType":"ASD"},
                            {"key":false,"text":"EDDs without Recommendations","assessmentType":"ASD"},
                            {"key":true,"text":"Failure Mode with Recommendations","assessmentType":"RCM"},
                            {"key":false,"text":"Failure Mode without Recommendations","assessmentType":"RCM"}
                        ],
                        "conseqAssessment":[
                            {"key":"All","text":"All"},
                            {"key":"EDDs_XOM","text":"CAP Assessment"},
                            {"key":"PDCAP","text":"PD-CAP Assessment"},
                        ]
                    }
                }
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "mEquAnalytics");

            var oCommonModel = this.getView().getModel("mEquipment");
            var isEnumLoaded = oCommonModel.getProperty("/metadata/ValueHelps/isEnumsLoaded");
            if(!isEnumLoaded){
                this.fnFetchEquipmentEnums();
            }

            this.fnFetchConfiguredRiskMatrixId();
            this.fnFetchAnalyticsItemsList();
            // this.fnFetchHCAnalyticsItemsList();
            this.fnSetBasicSearchForFilterBar();
        },

        /**
         * Function to set filter bar
         */
        fnSetBasicSearchForFilterBar : function(){
            var that = this;
            var oFilterBar = this.getView().byId("idAnalytcisPagefilterbar");
            oFilterBar.setBasicSearch(new sap.m.SearchField({
                value: "",
                placeHolder : that.oI18n.getText("asint.equipment.analytics.message04"),
                search: function () {
                    oFilterBar.fireSearch();
                }.bind(this),
                change: function () {}.bind(this)
            }));
        },

        /**
         * Function to fetch configured matrix details
         */
        fnFetchConfiguredRiskMatrixId :function(){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oMatrices = {
                "SHE":"Exxon 4x5 SHE Risk Matrix", 
                "FIN":"Exxon 4x5 FIN Risk Matrix",
                "SHE_HCA":"High Consequence Risk Matrix"
            };
            var iProgress = 0;
            var oIdMap = {};

            /**
             * Local call back function
             */
            var fnLocalCallBack = function(){
                if(!oIdMap["SHE"] && !oIdMap["FIN"] && !oIdMap["SHE_HCA"]){
                    mEquAnalytics.setProperty("/data/riskMatrixConfig/isNoDataVisible", true);
                    that.fnMessageShow("E",that.oI18n.getText("asint.equipment.analytics.message01"));
                }else{
                    mEquAnalytics.setProperty("/data/riskMatrixConfig/ID", oIdMap);
                    that.fnFetchRiskMatrixDetails(oIdMap);
                }
            };

            Object.keys(oMatrices).forEach(function(sMatrix){
                var sDesc = oMatrices[sMatrix];
                that.dataSource.fnFetchRiskMatrixId(sDesc, function(oData){
                    var oMatrix = oData.value[0];
                    var sMatrixId = oMatrix ? oMatrix.ID : "";
                    oIdMap[sMatrix] = sMatrixId;
                    iProgress++;
                    if(iProgress == Object.keys(oMatrices).length){
                        fnLocalCallBack();
                    }
                },function(){
                    oIdMap[sMatrix] = "";
                    iProgress++;
                    if(iProgress == Object.keys(oMatrices).length){
                        fnLocalCallBack();
                    }
                });
            });
        },

        /**
         * Function to fetch risk matrix details based on id
         * @param {String} sMatrixId 
         */
        fnFetchRiskMatrixDetails : function(oIdMap, sCall, sFilters){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var iProgress = 0;
            var iTotalProgress = 0;
            var iTotal = 2;
            var oMatrixDetail = {};

            /**
             * final call back function
             */
            var fnFinalCallBack = function(){
                that.fnFormatRiskMatrixData();
                that.fnFetchHighConsequenceRiskValues(sFilters, function(){
                    that.fnFormatHighConsequenceRiskData();
                });
            }

            if(sCall === "values"){
                iTotalProgress++;
                if(iTotalProgress == iTotal){
                    fnFinalCallBack();
                }
            }else{
                /**
                 * Local call back function
                 */
                var fnLocalCallBack = function(){
                    if(!oMatrixDetail["SHE"] && !oMatrixDetail["FIN"] && !oMatrixDetail["SHE_HCA"]){
                        mEquAnalytics.setProperty("/data/riskMatrixConfig/isNoDataVisible", true);
                        that.fnMessageShow("E",that.oI18n.getText("asint.equipment.analytics.message01"));
                    }else{
                        mEquAnalytics.setProperty("/data/riskMatrixConfig/detail", oMatrixDetail);
                    }
                    iTotalProgress++;
                    if(iTotalProgress == iTotal){
                        fnFinalCallBack();
                    }
                };
                Object.keys(oIdMap).forEach(function(sMatrix){
                    var sMatrixId = oIdMap[sMatrix]
                    that.dataSource.getMatrixDetail(sMatrixId, function(oData){
                        oMatrixDetail[sMatrix] = oData;
                        iProgress++;
                        if(iProgress == Object.keys(oIdMap).length){
                            fnLocalCallBack();
                        }
                    },function(){
                        oMatrixDetail[sMatrix] = "";
                        iProgress++;
                        if(iProgress == Object.keys(oIdMap).length){
                            fnLocalCallBack();
                        }
                    });
                });
            }

            that.fnFetchEquiRiskValuesCount(sFilters, function(){
                iTotalProgress++;
                if(iTotalProgress == iTotal){
                    fnFinalCallBack();
                }
            });
        },

        /**
         * Function to format risk matrix data
         */
        fnFormatRiskMatrixData : function(){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oMatrices = mEquAnalytics.getProperty("/data/riskMatrixConfig/detail");
            var oRiskValues = mEquAnalytics.getProperty("/data/riskMatrixConfig/riskValues");
            // oRiskValues = {
            //     "SHE_today_date":{
            //         "A-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-III": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "SHE_target_date":{
            //         "C-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "D-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "SHE_MR_target_date":{
            //         "A-II": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "SHE_NRD":{
            //         "A-III": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "E-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_today_date":{
            //         "A-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-III": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_target_date":{
            //         "C-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "D-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_MR_target_date":{
            //         "A-II": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_NRD":{
            //         "A-III": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "E-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     }
            // };
            var aMatrixList = [
                {
                    "type":"SHE",
                    "path":"SHERiskAnalysis",
                    "matrixList":[
                        {"text":"SHE at Todays Date","matrixHeader":"SHE at Today's Date","key":"sheAtTodaysDate","filterVisible":false},
                        {"text":"SHE at Target Date","matrixHeader":"SHE Risk at Due Date","key":"sheAtTargetDate","filterVisible":true},
                        {"text":"SHE MR at Due Date","matrixHeader":"SHE MR at Due Date","key":"sheMrAtDueDate","filterVisible":true},
                        {"text":"SHE at NRD","matrixHeader":"SHE at NRD", "key":"sheAtNrd","filterVisible":true}
                    ]
                },{
                    "type":"FIN",
                    "path":"FINRiskAnalysis",
                    "matrixList":[
                        {"text":"FIN at Todays Date","matrixHeader":"FIN at Today's Date", "key":"finAtTodaysDate","filterVisible":false},
                        {"text":"FIN at Target Date","matrixHeader":"FIN Risk at Due Date", "key":"finAtTargetDate","filterVisible":true},
                        {"text":"FIN MR at Due Date","matrixHeader":"FIN MR at Due Date", "key":"finMrAtDueDate","filterVisible":true},
                        {"text":"FIN at NRD","matrixHeader":"FIN at NRD", "key":"finAtNrd","filterVisible":true}
                    ]
                }
            ];

            var aSHERiskAnalysis = [];
            var aFINRiskAnalysis = [];
            var iMatrixIndex = 0;
            aMatrixList.forEach(function(oData){
                var oMatrixData = {
                    "panelHeader": "",
                    "MatrixList":[]
                };
                var aList = oData.matrixList;

                aList.forEach(function(oMatrix){
                    var aXAxisLabels = [];
                    var aYAxisLabels = [];
                    var aFinalAixLabels = [];
                    var sMatrix = oMatrix.text;
                    var oValue = null;
                    if(oRiskValues && oRiskValues[sMatrix]){
                        oValue = oRiskValues[sMatrix];
                    }
                    var oRiskMatrix = oMatrices[oData.type];
                    if (oRiskMatrix) {
                        var oCells = {};
                        var iCellCount = oRiskMatrix.rowSize * oRiskMatrix.colSize;
                        iMatrixIndex++;
                        var oFormatted = {
                            "matrixHeader":oMatrix.matrixHeader,
                            "matrixKey":oMatrix.key,
                            "isFilterVisible":oMatrix.filterVisible,
                            "rows": oRiskMatrix.rowSize,
                            "columns": oRiskMatrix.colSize,
                            "index": iMatrixIndex,
                            "title": oRiskMatrix.to_description ? oRiskMatrix.to_description.shortDescription : "",
                            "cells": [],
                            "xAxisData": [],
                            "yAxisData": [],
                            "riskLines": [],
                            "plotPoints": [],
                            "_plotPointMetadata": []
                        };

                        for (var j = 0; j < iCellCount; j++) {
                            oCells[j] = {
                                "index": j,
                                "text": "",
                                "color": "#FFFFFF"
                            }
                        }

                        for (j in oRiskMatrix.to_grid_color) {
                            if (oCells[oRiskMatrix.to_grid_color[j].boxIndex]) {
                                oCells[oRiskMatrix.to_grid_color[j].boxIndex].color = oRiskMatrix.to_grid_color[j].boxColor;
                            } else {
                                oCells[oRiskMatrix.to_grid_color[j].boxIndex] = {
                                    "index": oRiskMatrix.to_grid_color[j].boxIndex,
                                    "text": "",
                                    "color": oRiskMatrix.to_grid_color[j].boxColor
                                }
                            }
                        }

                        for (j in oRiskMatrix.to_axis) {
                            var oAxisData = {
                                "axisDesc": oRiskMatrix.to_axis[j].axisDesc,
                                "showRange": oRiskMatrix.to_axis[j].showRange,
                                "showTextOnly": oRiskMatrix.to_axis[j].showTextOnly,
                                "showValueOnly": oRiskMatrix.to_axis[j].showValueOnly,
                                "showCustomText": oRiskMatrix.to_axis[j].showCustomText,
                                "axisKey": oRiskMatrix.to_axis[j].ID,
                                "doNotShow": oRiskMatrix.to_axis[j].doNotShow,
                                "axisValues": []
                            };
                            for (var k in oRiskMatrix.to_axis[j].to_value) {
                                oAxisData.axisValues.push({
                                    "low": oRiskMatrix.to_axis[j].to_value[k].labelLow,
                                    "high": oRiskMatrix.to_axis[j].to_value[k].labelHigh,
                                    "text1": oRiskMatrix.to_axis[j].to_value[k].labelText,
                                    "text2": ""
                                });
                                if (oRiskMatrix.to_axis[j].axisName === "X") {
                                    var oXobj = {
                                        "text":oRiskMatrix.to_axis[j].to_value[k].labelText,
                                        "sequence":oRiskMatrix.to_axis[j].to_value[k].sequenceNo
                                    };
                                    aXAxisLabels.push(oXobj);
                                } else if (oRiskMatrix.to_axis[j].axisName === "Y") {
                                    var oYobj = {
                                        "text":oRiskMatrix.to_axis[j].to_value[k].labelText,
                                        "sequence":oRiskMatrix.to_axis[j].to_value[k].sequenceNo
                                    };
                                    aYAxisLabels.push(oYobj);
                                }
                            }
                            if (oRiskMatrix.to_axis[j].axisName === "X") {
                                oFormatted.xAxisData.push(oAxisData);
                            } else if (oRiskMatrix.to_axis[j].axisName === "Y") {
                                oFormatted.yAxisData.push(oAxisData);
                            }
                            aYAxisLabels.sort(function(a,b){
                                return Number(b.sequence) - Number(a.sequence)
                            });
                            aXAxisLabels.sort(function(a,b){
                                return Number(a.sequence) - Number(b.sequence)
                            });
                            aFinalAixLabels = [];
                            aYAxisLabels.forEach(function(sY){
                                aXAxisLabels.forEach(function(sX){
                                    aFinalAixLabels.push(sX.text + "-" + sY.text);
                                })
                            });
                            aFinalAixLabels.forEach(function(sLable, m){
                                var sCurrentRisk = oValue ? oValue[sLable] : null;
                                var sCount = sCurrentRisk ? sCurrentRisk.count : 0;
                                var sFormattedCount = that.formatNumberToSceintificNotation(sCount);
                                oCells[m].text = sFormattedCount;
                                oCells[m].IDs = sCurrentRisk ? sCurrentRisk.Ids : null;
                            })
                            oFormatted.cells = Object.values(oCells);
                        }
                    }
                    oMatrixData.MatrixList.push(oFormatted);
                });

                if(oData.type === "SHE"){
                    aSHERiskAnalysis.push(oMatrixData);
                }else{
                    aFINRiskAnalysis.push(oMatrixData);
                }
            })
            mEquAnalytics.setProperty("/data/SHERiskAnalysis", aSHERiskAnalysis);
            mEquAnalytics.setProperty("/data/FINRiskAnalysis", aFINRiskAnalysis);

        },

        /**
         * Function to format risk matrix data
         */
        fnFormatHighConsequenceRiskData : function(){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oMatrices = mEquAnalytics.getProperty("/data/riskMatrixConfig/detail");
            var oRiskValues = mEquAnalytics.getProperty("/data/riskMatrixConfig/hcRiskValues");
            // oRiskValues = {
            //     "SHE_today_date":{
            //         "A-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-III": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "SHE_target_date":{
            //         "C-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "D-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "SHE_MR_target_date":{
            //         "A-II": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "SHE_NRD":{
            //         "A-III": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "E-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_today_date":{
            //         "A-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-III": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_target_date":{
            //         "C-I": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "D-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_MR_target_date":{
            //         "A-II": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "B-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     },
            //     "FIN_NRD":{
            //         "A-III": {
            //             "count": 100000000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "A-II": {
            //             "count": 10000,
            //             "Ids": ["Equ Ids"]
            //         },
            //         "E-I": {
            //             "count": 20000000,
            //             "Ids": ["Equ Ids"]
            //         }
            //     }
            // };
            var aMatrixList = [
                {
                    "type":"Row1",
                    "path":"SHEHCRiskAnalysis",
                    "matrixList":[
                        {"text":"SHE at Todays Date","matrixHeader":"SHE at Today's Date","key":"sheAtTodaysDate","filterVisible":true},
                        {"text":"SHE at Target Date","matrixHeader":"SHE Risk at Due Date","key":"sheAtTargetDate","filterVisible":true},
                    ]
                },
                {
                    "type":"Row2",
                    "path":"SHEHCRiskAnalysis",
                    "matrixList":[
                        {"text":"SHE MR at Due Date","matrixHeader":"SHE MR at Due Date","key":"sheMrAtDueDate","filterVisible":true},
                        {"text":"SHE at NRD","matrixHeader":"SHE at NRD", "key":"sheAtNrd","filterVisible":true}
                    ]
                }
            ];

            var aSHERiskAnalysisRow1 = [];
            var aSHERiskAnalysisRow2 = [];
            var iMatrixIndex = 10;
            var isValuesPresentInHC = false;
            aMatrixList.forEach(function(oData){
                var oMatrixData = {
                    "panelHeader": "",
                    "MatrixList":[]
                };
                var aList = oData.matrixList;

                aList.forEach(function(oMatrix){
                    var aXAxisLabels = [];
                    var aYAxisLabels = [];
                    var aFinalAixLabels = [];
                    var sMatrix = oMatrix.text;
                    var oValue = null;
                    if(oRiskValues && oRiskValues[sMatrix]){
                        oValue = oRiskValues[sMatrix];
                    }
                    var oRiskMatrix = oMatrices["SHE_HCA"];
                    if (oRiskMatrix) {
                        var oCells = {};
                        var iCellCount = oRiskMatrix.rowSize * oRiskMatrix.colSize;
                        iMatrixIndex++;
                        var oFormatted = {
                            "matrixHeader":oMatrix.matrixHeader,
                            "matrixKey":oMatrix.key,
                            "isFilterVisible":oMatrix.filterVisible,
                            "rows": oRiskMatrix.rowSize,
                            "columns": oRiskMatrix.colSize,
                            "index": iMatrixIndex,
                            "title": oRiskMatrix.to_description ? oRiskMatrix.to_description.shortDescription : "",
                            "cells": [],
                            "xAxisData": [],
                            "yAxisData": [],
                            "riskLines": [],
                            "plotPoints": [],
                            "_plotPointMetadata": []
                        };

                        for (var j = 0; j < iCellCount; j++) {
                            oCells[j] = {
                                "index": j,
                                "text": "",
                                "color": "#FFFFFF"
                            }
                        }

                        for (j in oRiskMatrix.to_grid_color) {
                            if (oCells[oRiskMatrix.to_grid_color[j].boxIndex]) {
                                oCells[oRiskMatrix.to_grid_color[j].boxIndex].color = oRiskMatrix.to_grid_color[j].boxColor;
                            } else {
                                oCells[oRiskMatrix.to_grid_color[j].boxIndex] = {
                                    "index": oRiskMatrix.to_grid_color[j].boxIndex,
                                    "text": "",
                                    "color": oRiskMatrix.to_grid_color[j].boxColor
                                }
                            }
                        }

                        for (j in oRiskMatrix.to_axis) {
                            var oAxisData = {
                                "axisDesc": oRiskMatrix.to_axis[j].axisDesc,
                                "showRange": oRiskMatrix.to_axis[j].showRange,
                                "showTextOnly": oRiskMatrix.to_axis[j].showTextOnly,
                                "showValueOnly": oRiskMatrix.to_axis[j].showValueOnly,
                                "showCustomText": oRiskMatrix.to_axis[j].showCustomText,
                                "axisKey": oRiskMatrix.to_axis[j].ID,
                                "doNotShow": oRiskMatrix.to_axis[j].doNotShow,
                                "axisValues": []
                            };
                            for (var k in oRiskMatrix.to_axis[j].to_value) {
                                oAxisData.axisValues.push({
                                    "low": oRiskMatrix.to_axis[j].to_value[k].labelLow,
                                    "high": oRiskMatrix.to_axis[j].to_value[k].labelHigh,
                                    "text1": oRiskMatrix.to_axis[j].to_value[k].labelText,
                                    "text2": ""
                                });
                                if (oRiskMatrix.to_axis[j].axisName === "X") {
                                    var oXobj = {
                                        "text":oRiskMatrix.to_axis[j].to_value[k].labelText,
                                        "sequence":oRiskMatrix.to_axis[j].to_value[k].sequenceNo
                                    };
                                    aXAxisLabels.push(oXobj);
                                } else if (oRiskMatrix.to_axis[j].axisName === "Y") {
                                    var oYobj = {
                                        "text":oRiskMatrix.to_axis[j].to_value[k].labelText,
                                        "sequence":oRiskMatrix.to_axis[j].to_value[k].sequenceNo
                                    };
                                    aYAxisLabels.push(oYobj);
                                }
                            }
                            if (oRiskMatrix.to_axis[j].axisName === "X") {
                                oFormatted.xAxisData.push(oAxisData);
                            } else if (oRiskMatrix.to_axis[j].axisName === "Y") {
                                oFormatted.yAxisData.push(oAxisData);
                            }
                            aYAxisLabels.sort(function(a,b){
                                return Number(b.sequence) - Number(a.sequence)
                            });
                            aXAxisLabels.sort(function(a,b){
                                return Number(a.sequence) - Number(b.sequence)
                            });
                            aFinalAixLabels = [];
                            aYAxisLabels.forEach(function(sY){
                                aXAxisLabels.forEach(function(sX){
                                    aFinalAixLabels.push(sX.text + "-" + sY.text);
                                })
                            });
                            aFinalAixLabels.forEach(function(sLable, m){
                                var sCurrentRisk = oValue ? oValue[sLable] : null;
                                var sCount = sCurrentRisk ? sCurrentRisk.count : 0;
                                if(sCount){
                                    isValuesPresentInHC = true;
                                }
                                var sFormattedCount = that.formatNumberToSceintificNotation(sCount);
                                oCells[m].text = sFormattedCount;
                                oCells[m].IDs = sCurrentRisk ? sCurrentRisk.Ids : null;
                            })
                            oFormatted.cells = Object.values(oCells);
                        }
                    }
                    oMatrixData.MatrixList.push(oFormatted);
                });

                if(oData.type === "Row1"){
                    aSHERiskAnalysisRow1.push(oMatrixData);
                }else{
                    aSHERiskAnalysisRow2.push(oMatrixData);
                }
            })
            mEquAnalytics.setProperty("/data/SHEHCRiskAnalysis/Row1", aSHERiskAnalysisRow1);
            mEquAnalytics.setProperty("/data/SHEHCRiskAnalysis/Row2", aSHERiskAnalysisRow2);
            mEquAnalytics.setProperty("/data/isValuePresentInHC", isValuesPresentInHC);
        },

        /**
         * Fu ction to format number to it's scientific notation
         * @param {Number} value 
         * @returns 
         */
        formatNumberToSceintificNotation : function(value) {
            var num = Number(value);
            if (isNaN(num)) return value;
          
            if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
            if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
          
            return num;
        },

        /**
         * Function to fetch equipment risk values count
         */
        fnFetchEquiRiskValuesCount : function(sFilters, fnCallback){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var sMatrixLevelFilters = mEquAnalytics.getProperty("/data/matrixLevelFilters");
            if(!sFilters){
                sFilters = "";
            }
            if(sMatrixLevelFilters){
                sFilters = sFilters ? sFilters + "&" + sMatrixLevelFilters : sMatrixLevelFilters;
            }
            that.dataSource.getEquiRiskValuesCount(sFilters, function(oData){
                mEquAnalytics.setProperty("/data/riskMatrixConfig/riskValues", oData);
                if(fnCallback){
                    fnCallback();
                }
            },function(){
                mEquAnalytics.setProperty("/data/riskMatrixConfig/riskValues", {});
                if(fnCallback){
                    fnCallback();
                }
            });
        },

        /**
         * Function to fetch equipment risk values count
         */
        fnFetchHighConsequenceRiskValues : function(sFilters, fnCallback){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var sHCMatrixLevlFilters = mEquAnalytics.getProperty("/data/HCMatirxLevelFilters");
            if(!sFilters){
                sFilters = "";
            }
            if(sHCMatrixLevlFilters){
                sFilters = sFilters ? sFilters + "&" + sHCMatrixLevlFilters : sHCMatrixLevlFilters;
            }
            that.dataSource.getHighConsequenceRiskValuesCount(sFilters, function(oData){
                mEquAnalytics.setProperty("/data/riskMatrixConfig/hcRiskValues", oData);
                if(fnCallback){
                    fnCallback();
                }
            },function(){
                mEquAnalytics.setProperty("/data/riskMatrixConfig/hcRiskValues", {});
                if(fnCallback){
                    fnCallback();
                }
            });
        },

        /**
         * Function to fetch equipment risk values count
         */
        fnFetchAnalyticsItemsList : function(sFilters){
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var iStart = mEquAnalytics.getProperty("/data/page/start");
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            if(!sFilters){
                sFilters = "";
            }
            this.fnLoadItems(iStart, iSize, sFilters);
        },

        /**
         * Function to fetch equipment risk values count
         */
        fnFetchHCAnalyticsItemsList : function(sFilters){
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var iStart = mEquAnalytics.getProperty("/data/page/start");
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            if(!sFilters){
                sFilters = "";
            }
            this.fnLoadItems(iStart, iSize, sFilters);
        },

        /**
         * Function to handle load more press
         */
        onPressLoadMore : function(){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var iStart = mEquAnalytics.getProperty("/data/page/start");
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            var iEnd = mEquAnalytics.getProperty("/data/page/end");
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            // var oTable = this.getView().byId("idEquAnalyticsListTable");

            if(iStart <= iEnd){
                if(!sFilters){
                    sFilters = "";
                }
                this.fnLoadItems(iStart, iSize, sFilters,"LoadMore");
            }else{
                that.fnMessageShow("E","No items to load");
            }
        },

        /**
         * Function to make api call to fetch items
         */
        fnLoadItems : function(iPage, iSize, sFilters, sFrom, fnCallBack){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var aCurrentItems = mEquAnalytics.getProperty("/data/itemsList");
            var isCorporateVisible = mEquAnalytics.getProperty("/data/isCorporateMatrixVisible");
            var sMatrixLevelFilters = mEquAnalytics.getProperty("/data/matrixLevelFilters");
            var sHCMatrixLevlFilters = mEquAnalytics.getProperty("/data/HCMatirxLevelFilters");
            mEquAnalytics.setProperty("/data/tableTiltleBusy", true);
            if(!isCorporateVisible){
                if(sFilters){
                    sFilters = sFilters + "&matrixType=HC";
                }else{
                    sFilters = "matrixType=HC";  
                }
            }
            if(isCorporateVisible){
                if(sMatrixLevelFilters){
                    sFilters = sFilters ? sFilters + "&" + sMatrixLevelFilters : sMatrixLevelFilters
                }
            }else{
                if(sHCMatrixLevlFilters){
                    sFilters = sFilters ? sFilters + "&" + sHCMatrixLevlFilters : sHCMatrixLevlFilters;
                }
            }
            that.dataSource.getEquiAnalyticsItemList(sFilters, iPage, iSize, function(oData){
                if(sFrom != "LoadMore"){
                    aCurrentItems = [];
                }
                var aFinalItems = aCurrentItems.concat(oData.content);
                mEquAnalytics.setProperty("/data/itemsList", aFinalItems);
                mEquAnalytics.setProperty("/data/tableTiltleBusy", false);
                mEquAnalytics.setProperty("/data/listHeader", that.oI18n.getText("asint.equipment.list.toolbar.table.title",[oData.totalElements]));
                mEquAnalytics.setProperty("/data/page/start", iPage + 1);
                mEquAnalytics.setProperty("/data/page/end", oData.totalPages);
                mEquAnalytics.setProperty("/data/page/isLastPage", oData.last);
                if(oData.empty){
                    mEquAnalytics.setProperty("/data/page/isLastPage", oData.empty);
                }
                if(fnCallBack){
                    fnCallBack(aFinalItems.length);
                }
            },function(){
                mEquAnalytics.setProperty("/data/itemsList", []);
                mEquAnalytics.setProperty("/data/tableTiltleBusy", false);
                mEquAnalytics.setProperty("/data/listHeader", that.oI18n.getText("asint.equipment.list.toolbar.table.title",[0]));
                mEquAnalytics.setProperty("/data/page/start", iPage);
                mEquAnalytics.setProperty("/data/page/end", iPage);
                mEquAnalytics.setProperty("/data/page/isLastPage", true);
                that.fnMessageShow("E",that.oI18n.getText("asint.equipment.analytics.message02"));
            });
        },

        /**
         * Function to handle table items update finished
         */
        onAnalyticsListItemsUpdateFinished : function(){
            var that = this;
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var iStart = mEquAnalytics.getProperty("/data/page/start");
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            var iEnd = mEquAnalytics.getProperty("/data/page/end");
            var isLastPage = mEquAnalytics.getProperty("/data/page/isLastPage");
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            var oTable = this.getView().byId("idEquAnalyticsListTable");

            if(iStart <= iEnd && !isLastPage){
                if(!sFilters){
                    sFilters = "";
                }
                this.fnLoadItems(iStart, iSize, sFilters, function(sLength){
                    oTable.setGrowingThreshold(sLength);
                });
            }else{
                mEquAnalytics.setProperty("/data/page/isLastPage", true);
                that.fnMessageShow("E", this.oI18n.getText("asint.equipment.analytics.message03"));
            }
        },

        /**
         * Functiom to handle filter bar
         */
        onAnalyticsFilterSearch : function(oEvent){
            var oFilterBar = oEvent.getSource();
            var oPayload = {};
            var sFilters = "";
            var aFilterItems = oFilterBar.getFilterGroupItems();

            var sSearchVal = oEvent.getSource().getBasicSearchValue().trim();
            if(sSearchVal){
                oPayload["searchText"] = sSearchVal;
                sFilters = sFilters ? sFilters + "&searchText=" + sSearchVal : "searchText=" + sSearchVal;
                // sFilters = sFilters ? sFilters + "&assessmentDisplayId=" + sSearchVal : "assessmentDisplayId=" + sSearchVal;
            }

            aFilterItems.forEach(function(oItem) {
                var oControl = oItem.getControl();
                if (!oControl) return;
                var sControlType = oControl.getMetadata().getName();
                var sKey = oItem.getName();

                switch (sControlType) {
                case "sap.m.ComboBox":
                    var sSelectedKey = oControl.getSelectedKey();
                    if (sSelectedKey && sSelectedKey !== "All") {
                        if(sKey === "riskCategory"){
                            oPayload[sKey] = sSelectedKey;
                            var sFilterKey = "";
                            var sFilterValue = "";
                            var aSplit = sSelectedKey.split("_");
                            if(aSplit.includes("SHE")){
                                sFilterKey = "sheRiskCategory";
                                sFilterValue = aSplit[1];
                                sFilters = sFilters ? sFilters + "&" + sFilterKey + "=" + sFilterValue : sFilterKey + "=" + sFilterValue;
                            }else if(aSplit.includes("FIN")){
                                sFilterKey = "finRiskCategory";
                                sFilterValue = aSplit[1];
                                sFilters = sFilters ? sFilters + "&" + sFilterKey + "=" + sFilterValue : sFilterKey + "=" + sFilterValue;
                            }else{
                                sFilterValue = aSplit[0];
                                var riskCatFilter = "sheRiskCategory=" + sFilterValue + "&finRiskCategory=" + sFilterValue;
                                sFilters = sFilters ? sFilters + "&" + riskCatFilter : riskCatFilter;
                            }
                        }else{
                            oPayload[sKey] = sSelectedKey;
                            sFilters = sFilters ? sFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                        }
                    }
                    break;
                case "sap.m.MultiComboBox":
                    var aSelectedKeys = oControl.getSelectedKeys();
                    oPayload[sKey] = aSelectedKeys;
                    if (aSelectedKeys.length > 0) {
                        aSelectedKeys.forEach(function(sSelectedKey) {
                            sFilters = sFilters ? sFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                        })
                    }
                    break;

                case "sap.m.MultiInput":
                    var aTokens = oControl.getTokens();
                    oPayload[sKey] = [];

                    aTokens.forEach(function(oToken) {
                        var sSelectedKey = oToken.getKey();
                        sFilters = sFilters ? sFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                        oPayload[sKey].push(sSelectedKey);
                    });
                    break;
                default:
                    break;
                }
            });

            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            mEquAnalytics.setProperty("/data/variantFilters", sFilters);
            var iStart = 0;
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            // var oTable = this.getView().byId("idEquAnalyticsListTable");

            if(!sFilters){
                sFilters = "";
            }
            this.fnLoadItems(iStart, iSize, sFilters);

            this.fnFetchRiskMatrixDetails("", "values", sFilters);
            
        },

        /**
         * Function to apply filter to SHE values
         */
        oApplySHEMatrixLevelFilters : function(oEvent){
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var sPath = oEvent.getSource().getBindingContext("mEquAnalytics").getPath();
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oSelObj = mEquAnalytics.getProperty(sPath);
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            var oPrevSelections = mEquAnalytics.getProperty("/data/prevSelections");
            var sMatrixLevelFilters = mEquAnalytics.getProperty("/data/matrixLevelFilters");
            if(!sFilters){
                sFilters = "";
            }
            var sKey = oSelObj.matrixKey;
            if(aSelectedKeys.length > 0 || oPrevSelections[sKey]){
                aSelectedKeys.forEach(function(sSelectedKey){
                    sMatrixLevelFilters = sMatrixLevelFilters ? sMatrixLevelFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                });
                if(oPrevSelections[sKey] && aSelectedKeys.length === 0){
                    var params = new URLSearchParams(sMatrixLevelFilters);
                    params.delete(sKey);
                    sMatrixLevelFilters = params.toString();
                }
                mEquAnalytics.setProperty("/data/matrixLevelFilters", sMatrixLevelFilters);

                var iStart = 0;
                var iSize = mEquAnalytics.getProperty("/data/page/size");
                // var oTable = this.getView().byId("idEquAnalyticsListTable");
                this.fnLoadItems(iStart, iSize, sFilters);

                this.fnFetchRiskMatrixDetails("", "values", sFilters);
            }
            if(aSelectedKeys.length > 0){
                oPrevSelections[sKey] = true;
            }else{
                oPrevSelections[sKey] = false;
            }
            mEquAnalytics.setProperty("/data/prevSelections", oPrevSelections);
        },

        /**
         * Function to apply filter to SHE values
         */
        oApplyFINMatrixLevelFilters : function(oEvent){
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var sPath = oEvent.getSource().getBindingContext("mEquAnalytics").getPath();
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oSelObj = mEquAnalytics.getProperty(sPath);
            var oPrevSelections = mEquAnalytics.getProperty("/data/prevSelections");
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            var sMatrixLevelFilters = mEquAnalytics.getProperty("/data/matrixLevelFilters");
            if(!sFilters){
                sFilters = "";
            }
            var sKey = oSelObj.matrixKey;
            if(aSelectedKeys.length > 0 || oPrevSelections[sKey]){
                aSelectedKeys.forEach(function(sSelectedKey){
                    sMatrixLevelFilters = sMatrixLevelFilters ? sMatrixLevelFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                })
                if(oPrevSelections[sKey] && aSelectedKeys.length === 0){
                    var params = new URLSearchParams(sMatrixLevelFilters);
                    params.delete(sKey);
                    sMatrixLevelFilters = params.toString();
                }
                mEquAnalytics.setProperty("/data/matrixLevelFilters", sMatrixLevelFilters);

                var iStart = 0;
                var iSize = mEquAnalytics.getProperty("/data/page/size");
                // var oTable = this.getView().byId("idEquAnalyticsListTable");
                this.fnLoadItems(iStart, iSize, sFilters);

                this.fnFetchRiskMatrixDetails("", "values", sFilters);
            }
            if(aSelectedKeys.length > 0){
                oPrevSelections[sKey] = true;
            }else{
                oPrevSelections[sKey] = false;
            }
            mEquAnalytics.setProperty("/data/prevSelections", oPrevSelections);
        },

        /**
         * Function to apply filter to SHE values
         */
        oApplySHEHCMatrixLevelFilters : function(oEvent){
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var sPath = oEvent.getSource().getBindingContext("mEquAnalytics").getPath();
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oSelObj = mEquAnalytics.getProperty(sPath);
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            var sHCMatrixLevlFilters = mEquAnalytics.getProperty("/data/HCMatirxLevelFilters");
            var oPrevSelections = mEquAnalytics.getProperty("/data/prevSelectionsHC");
            if(!sFilters){
                sFilters = "";
            }
            var sKey = oSelObj.matrixKey;
            if(aSelectedKeys.length > 0 || oPrevSelections[sKey]){
                aSelectedKeys.forEach(function(sSelectedKey){
                    sHCMatrixLevlFilters = sHCMatrixLevlFilters ? sHCMatrixLevlFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                });
                if(oPrevSelections[sKey] && aSelectedKeys.length === 0){
                    var params = new URLSearchParams(sHCMatrixLevlFilters);
                    params.delete(sKey);
                    sHCMatrixLevlFilters = params.toString();
                }
                mEquAnalytics.setProperty("/data/HCMatirxLevelFilters", sHCMatrixLevlFilters);

                var iStart = 0;
                var iSize = mEquAnalytics.getProperty("/data/page/size");
                // var oTable = this.getView().byId("idEquAnalyticsListTable");
                this.fnLoadItems(iStart, iSize, sFilters);

                this.fnFetchRiskMatrixDetails("", "values", sFilters);
            }
            if(aSelectedKeys.length > 0){
                oPrevSelections[sKey] = true;
            }else{
                oPrevSelections[sKey] = false;
            }
            mEquAnalytics.setProperty("/data/prevSelectionsHC", oPrevSelections);
        },

        /**
         * Function to handle filter reset
         */
        onFilterReset : function(){
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var iStart = 0;
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            var oTable = this.getView().byId("idEquAnalyticsListTable");
            var sFilters = "";

            this.fnLoadItems(iStart, iSize, sFilters, function(sLength){
                oTable.setGrowingThreshold(sLength);
            });

            this.fnFetchRiskMatrixDetails("", "values", sFilters);
        },

        /**
         * Function to export data into excel
         */
        onPressExportExcel : function(){
            // var sFileName = "Visualizing_Risks_" + this.formatter.formatDate(new Date(), "dd_MM_yyyy_HH_mm_ss");
            // this.fnExportTableDatatoExcel("idEquAnalyticsListTable", sFileName);
            var mEquipmentDetail = this.getView().getModel("mEquAnalytics");
            var sFileName = "Visualizing_Risks_" + this.formatter.formatDate(new Date(), "dd_MM_yyyy_HH_mm_ss");
            var oTable = this.getView().byId("idEquAnalyticsListTable");
            var aCols = oTable.getColumns();
            var aColConfig = this.fnExportTableGetColumnConfig(aCols, "sap.ui.table.Table");
            var oSetting = {
                workbook: {
                    columns: aColConfig,
                    context: {
                        sheetName: "Export"
                    }
                },
                fileName: sFileName,
                dataSource : mEquipmentDetail.getProperty("/data/itemsList")
            };
            var oSheet = new Spreadsheet(oSetting);
				
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

        /**
         * Function to handle value helps
         * @param {Object} oEvent 
         * @param {String} sObjectType 
         */
        fnHandleValueHelp : function(oEvent, sObjectType, sMode){
            var that = this;
            var oModel = this.getView().getModel("mEquAnalytics");
            var oDialogData;
            switch(sObjectType){
            case "Location":
                oDialogData = {
                    "dialogHeader" :that.oI18n.getText("asint.equipment.analytics.filters.selectLocation.text"),
                    "objectType":"LOC",
                    "mode":sMode,
                    "path":"/data/filters/location"
                };
                break;
            case "MaintPlant":
                oDialogData = {
                    "dialogHeader" :that.oI18n.getText("asint.equipment.analytics.filters.selectMaintplant.text"),
                    "objectType":"PLMT",
                    "mode":sMode,
                    "path":"/data/filters/maintPlant"
                };
                break;
            case "PlantSection":
                oDialogData = {
                    "dialogHeader" :that.oI18n.getText("asint.equipment.analytics.filters.selectPlantSection.text"),
                    "objectType":"PLSC",
                    "mode":sMode,
                    "path":"/data/filters/plantSection"
                };
                break;
            case "ABCIndicator":
                oDialogData = {
                    "dialogHeader" :that.oI18n.getText("asint.equipment.analytics.filters.selectABCIndicator.text"),
                    "objectType":"ABCIndicator",
                    "mode":sMode,
                    "path":"/data/filters/abcIndicator"
                };
                break;
            }
            oModel.setProperty("/data/genericValueHelp", oDialogData);
            that.fnOpenGenericValueHelpFilters(oDialogData.objectType, sMode);
        },

        /**
         * Function to open generic value help dialog
         * @param {String} sObjectType 
         */
        fnOpenGenericValueHelpFilters: function (sObjectType, sMode) {
            if (!this._oAnalyticsGenValueHelpDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.asint.ais.mi.equipment.view.fragment.GenericValuehelpdialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oAnalyticsGenValueHelpDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    this.fnGenValueHelpApplyFilter(sObjectType, sMode);
                    oDialog.open();
                }.bind(this));
            } else {
                this.fnGenValueHelpApplyFilter(sObjectType, sMode);
                this._oAnalyticsGenValueHelpDialog.open();
            }
        },

        /**
         * Function to apply filter
         * @param {String} sObjectType 
         */
        fnGenValueHelpApplyFilter: function (sObjectType, sMode) {
            var oTable = "";
            var oBinding = "";
            var oFilter = [];
            oTable = this.byId("valueHelpTable");
            oTable.setMode(sMode);
            oBinding = oTable.getBinding("items");

            oFilter = new Filter([
                new Filter("objectType", FilterOperator.EQ, sObjectType),
                new Filter("language", FilterOperator.EQ, "EN")
            ], true);
            oBinding.filter(oFilter);
        },

        /**
         * Function to search in generic value help dialog
         * @param {Object} oEvent 
         */
        onValueHelpSearch: function (oEvent) {
            var oModel = this.getView().getModel("mEquAnalytics");
            var sQuery = oEvent.getSource().getValue();
            
            if(sQuery){
                sQuery = sQuery.trim();
            }
            var objectType = oModel.getProperty("/data/genericValueHelp/objectType");
            var aFilters = [];
            var oObjectTypeFilter;
            oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, objectType);
            if (sQuery && sQuery.length > 0) {
                var aSearchFilters = [
                    new Filter({path:"name", operator:FilterOperator.Contains,value1:sQuery,caseSensitive: false}),
                    new Filter({path:"description", operator:FilterOperator.Contains,value1:sQuery,caseSensitive: false}),
                ];
                var oSearchFilter = new sap.ui.model.Filter({
                    filters: aSearchFilters,
                    and: false
                });
                aFilters.push(new sap.ui.model.Filter({
                    filters: [oObjectTypeFilter, oSearchFilter],
                    and: true
                }));
            } else {
                aFilters.push(oObjectTypeFilter);
            }
            aFilters.push(new sap.ui.model.Filter("language", sap.ui.model.FilterOperator.EQ, "EN"));
            var oTable = this.byId("valueHelpTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        /**
         * Function to confirm convert notification
         */
        onCloseValueHelpDialog: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquAnalytics");
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oDialogData = oModel.getProperty("/data/genericValueHelp");
            var sPath = oDialogData.path;
            var oTable = that.byId("valueHelpTable");
            var selectedItems = [];
            if (oTable) {
                var aSelected  = oTable.getSelectedItems();
                aSelected.forEach(function(oItem){
                    var oRow = oItem.getBindingContext("valueHelpService").getObject();
                    var oTokenObj = {
                        "key":oRow.name,
                        "text":oRow.name
                    }
                    selectedItems.push(oTokenObj);
                })
            }
            if(mEquAnalytics){
                mEquAnalytics.setProperty(sPath, selectedItems);
            }
            var oSearchField = this.byId("idGenericSearchField");
            if (oSearchField) {
                oSearchField.setValue("");
            }

            this._oAnalyticsGenValueHelpDialog.close();
        },

        /**
         * Function to close valueHelp Dialog
         */
        onCloseGenericDialog: function () {
            if (this._oAnalyticsGenValueHelpDialog) {
                var oTable = this.byId("valueHelpTable");
                oTable.removeSelections();
                var oBinding = oTable.getBinding("items");
                var oFilter = new Filter("objectType", FilterOperator.EQ, "AsintAsint");
                oBinding.filter([oFilter]);

                var oSearchField = this.byId("idGenericSearchField");
                if (oSearchField) {
                    oSearchField.setValue("");
                }

                this._oAnalyticsGenValueHelpDialog.close();
            }
        },

        /**
         * Function that trigers when an toekn is removed
         * @param {Object} oEvent 
         */
        onRemoveMultiInputToken: function (oEvent) {
            var that = this;
            var mEquAnalytics = that.getView().getModel("mEquAnalytics");
            var removedItems = oEvent.getParameter("removedTokens");
            if (removedItems.length > 0) {
                removedItems.forEach(function (removedItem) {
                    var oBindingContext = removedItem.getBindingContext("mEquAnalytics");
                    if (oBindingContext) {
                        var sPath = removedItem.getBindingContext("mEquAnalytics").getPath();
                        var modelPath = sPath.split("/");
                        modelPath.pop();
                        modelPath = modelPath.join("/");
                        var modelList = mEquAnalytics.getProperty(modelPath);
                        var iIndex = modelList.findIndex(function (item) {
                            return item === oBindingContext.getObject();
                        });
                        if (iIndex !== -1) {
                            modelList.splice(iIndex, 1);
                            mEquAnalytics.setProperty(modelPath, modelList);
                        }
                    }
                })
            }
        },

        /**
         * Function that updates the table selection
         * @param {Object} oEvent 
         */
        onUpdateFinish: function (oEvent) {
            var that = this;
            var selectionMode = oEvent.getSource().getMode();
            var valueHelpSelectedItems = oEvent.getSource().getItems();
            var selectedItems = [];
            var mEquAnalytics = that.getView().getModel("mEquAnalytics");
            var oModel = that.getView().getModel("mEquAnalytics");
            var sPath = oModel.getProperty("/data/genericValueHelp/path");
            if (selectionMode === "MultiSelect") {
                if (valueHelpSelectedItems.length > 0) {
                    selectedItems = mEquAnalytics.getProperty(sPath);
                    if (selectedItems && selectedItems.length > 0) {
                        var aSelected = selectedItems.map(function (oItem) {
                            return oItem.key;
                        });
                        valueHelpSelectedItems.forEach(function (item) {
                            var oContext = item.getBindingContext("valueHelpService").getProperty("name");
                            if (aSelected.includes(oContext)) {
                                item.setSelected(true);
                            } else {
                                item.setSelected(false);
                            }
                        });
                    } else {
                        valueHelpSelectedItems.forEach(function (item) {
                            item.setSelected(false);
                        });
                    }
                }
                // that.selectVal();
            }
        },

        /**
         * Function to navigate to assessment
         */
        onPressAssessmentLinkAnalyticsMode : function(oEvent){
            var oSelected = oEvent.getSource().getBindingContext("mEquAnalytics").getObject();
            var sId = oSelected.assessmentId;
            var sDisplayId = oSelected.assessmentDisplayId;
            if(sId && sDisplayId){
                if(sDisplayId.includes("ASDA")){
                    this.fnNavigateToAssetStrategyDetail(sId);
                }else if(sDisplayId.includes("RCM")){
                    this.fnNavigateToRCMDetail(sId);
                }
            }else{
                this.fnMessageShow("E", this.oI18n.getText("asint.equipment.advFilter.message03"));
            }
        },

        /**
         * Function to clear all filter
         */
        onClearAllFilters : function(){
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");

            var oFilterBar = this.getView().byId("idAnalytcisPagefilterbar");
            var aFilterItems = oFilterBar.getFilterGroupItems();

            aFilterItems.forEach(function(oItem) {
                var oControl = oItem.getControl();
                if (!oControl) return;
                var sControlType = oControl.getMetadata().getName();

                switch (sControlType) {
                case "sap.m.ComboBox":
                    oControl.setSelectedKey("");
                    break;
                case "sap.m.MultiComboBox":
                    oControl.setSelectedKeys([]);
                    break;

                case "sap.m.MultiInput":
                    oControl.setTokens([]);
                    break;
                default:
                    break;
                }
            });

            var oPanel = this.getView().byId("idAnalyticsModeMainPanel");
            var aContent = oPanel.getContent();
            aContent.forEach(function(oItem, i){
                if(i != 0){
                    var oScroll = oItem.getItems()[0];
                    var oHbox = oScroll.getContent()[0];
                    var aVbox = oHbox.getItems();
                    aVbox.forEach(function(oVbox){
                        var oReqHbox = oVbox.getItems()[0];
                        var oMultiComb = oReqHbox.getItems()[1];
                        oMultiComb.setSelectedKeys([]);
                    })
                }
            })
            mEquAnalytics.setProperty("/data/prevSelections", {});
            var isCorporateEnabled = mEquAnalytics.getProperty("/data/isCorporateMatrixVisible");
            if(isCorporateEnabled){
                mEquAnalytics.setProperty("/data/matrixLevelFilters", "");
            }else{
                mEquAnalytics.setProperty("/data/HCMatirxLevelFilters", "");
            }
            var iStart = 0;
            var iSize = mEquAnalytics.getProperty("/data/page/size");
            var oTable = this.getView().byId("idEquAnalyticsListTable");
            var sFilters = "";

            this.fnLoadItems(iStart, iSize, sFilters, function(sLength){
                oTable.setGrowingThreshold(sLength);
            });

            this.fnFetchRiskMatrixDetails("", "values", sFilters);
        },

        /**
         * Function to handle switch to HC risk matrix
         */
        onPressHCRiksMatrix : function(){
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            var oBackup = mEquAnalytics.getProperty("/data/backup");
            if(!sFilters){
                sFilters = "";
            }else{
                var params = new URLSearchParams(sFilters);
                params.delete("sheAtTodaysDate");
                params.delete("finAtTodaysDate");
                params.delete("sheRiskCategory");
                params.delete("finRiskCategory");
                sFilters = params.toString();
            }
            mEquAnalytics.setProperty("/data/isCorporateMatrixVisible", false);
            mEquAnalytics.setProperty("/data/page/start", 0);
            mEquAnalytics.setProperty("/data/page/size", 20);
            // var oPanel = this.getView().byId("idAnalyticsModeMainPanel");
            // var aContent = oPanel.getContent();
            // aContent.forEach(function(oItem, i){
            //     if(i != 0){
            //         var oScroll = oItem.getItems()[0];
            //         var oHbox = oScroll.getContent()[0];
            //         var aVbox = oHbox.getItems();
            //         aVbox.forEach(function(oVbox){
            //             var oReqHbox = oVbox.getItems()[0];
            //             var oMultiComb = oReqHbox.getItems()[1];
            //             oMultiComb.setSelectedKeys([]);
            //         })
            //     }
            // })
            // mEquAnalytics.setProperty("/data/prevSelections", {});

            var oFilterBar = this.getView().byId("idAnalytcisPagefilterbar");
            var aFilterItems = oFilterBar.getFilterGroupItems();
            aFilterItems.forEach(function(oItem) {
                var oControl = oItem.getControl();
                if (!oControl) return;
                var sControlType = oControl.getMetadata().getName();
                var sKey = oItem.getName();

                switch (sControlType) {
                case "sap.m.ComboBox":
                    if(sKey === "riskCategory"){
                        var sSelectedKey = oControl.getSelectedKey();
                        oBackup[sKey] = sSelectedKey;
                        oControl.setSelectedKey("");
                    }
                    break;
                case "sap.m.MultiComboBox":
                    var aSelectedKeys = oControl.getSelectedKeys();
                    if(sKey === "sheAtTodaysDate" || sKey === "finAtTodaysDate"){
                        oBackup[sKey] = aSelectedKeys;
                        oControl.setSelectedKeys([]);
                    }
                    break;
                default:
                    break;
                }
            });
            mEquAnalytics.setProperty("/data/backup", oBackup);
            mEquAnalytics.setProperty("/data/variantFilters", sFilters);

            this.fnFetchHCAnalyticsItemsList(sFilters);
            this.fnFetchRiskMatrixDetails("", "values", sFilters);
        },

        /**
         * Function to handle switch to HC risk matrix
         */
        onPressCorporateRiksMatrix : function(){
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var sFilters = mEquAnalytics.getProperty("/data/variantFilters");
            var oBackup = mEquAnalytics.getProperty("/data/backup");
            if(!sFilters){
                sFilters = "";
            }
            mEquAnalytics.setProperty("/data/isCorporateMatrixVisible", true);
            mEquAnalytics.setProperty("/data/page/start", 0);
            mEquAnalytics.setProperty("/data/page/size", 20);
            // var oPanel = this.getView().byId("idAnalyticsModeMainPanel");
            // var aContent = oPanel.getContent();
            // aContent.forEach(function(oItem, i){
            //     if(i != 0){
            //         var oScroll = oItem.getItems()[0];
            //         var oHbox = oScroll.getContent()[0];
            //         var aVbox = oHbox.getItems();
            //         aVbox.forEach(function(oVbox){
            //             var oReqHbox = oVbox.getItems()[0];
            //             var oMultiComb = oReqHbox.getItems()[1];
            //             oMultiComb.setSelectedKeys([]);
            //         })
            //     }
            // })
            // mEquAnalytics.setProperty("/data/prevSelections", {});

            var oFilterBar = this.getView().byId("idAnalytcisPagefilterbar");
            var aFilterItems = oFilterBar.getFilterGroupItems();
            aFilterItems.forEach(function(oItem) {
                var oControl = oItem.getControl();
                if (!oControl) return;
                var sControlType = oControl.getMetadata().getName();
                var sKey = oItem.getName();

                switch (sControlType) {
                case "sap.m.ComboBox":
                    if(sKey === "riskCategory"){
                        if(oBackup[sKey]){
                            oControl.setSelectedKey(oBackup[sKey]);

                            var sFilterKey = "";
                            var sFilterValue = "";
                            var aSplit = oBackup[sKey].split("_");
                            if(aSplit.includes("SHE")){
                                sFilterKey = "sheRiskCategory";
                                sFilterValue = aSplit[1];
                                sFilters = sFilters ? sFilters + "&" + sFilterKey + "=" + sFilterValue : sFilterKey + "=" + sFilterValue;
                            }else if(aSplit.includes("FIN")){
                                sFilterKey = "finRiskCategory";
                                sFilterValue = aSplit[1];
                                sFilters = sFilters ? sFilters + "&" + sFilterKey + "=" + sFilterValue : sFilterKey + "=" + sFilterValue;
                            }else{
                                sFilterValue = aSplit[0];
                                var riskCatFilter = "sheRiskCategory=" + sFilterValue + "&finRiskCategory=" + sFilterValue;
                                sFilters = sFilters ? sFilters + "&" + riskCatFilter : riskCatFilter;
                            }
                        }
                    }
                    break;
                case "sap.m.MultiComboBox":
                    if(sKey === "sheAtTodaysDate" || sKey === "finAtTodaysDate"){
                        if(oBackup[sKey]){
                            oControl.setSelectedKeys(oBackup[sKey]);
                            var aSelectedKeys = oControl.getSelectedKeys();
                            if (aSelectedKeys.length > 0) {
                                aSelectedKeys.forEach(function(sSelectedKey) {
                                    sFilters = sFilters ? sFilters + "&" + sKey + "=" + sSelectedKey : sKey + "=" + sSelectedKey;
                                })
                            }
                        }
                    }
                    break;
                default:
                    break;
                }
            });
            mEquAnalytics.setProperty("/data/variantFilters", sFilters);

            this.fnFetchAnalyticsItemsList(sFilters);
            this.fnFetchRiskMatrixDetails("", "values", sFilters);

        },

        /**
         * Function to handle assessment type change
         * @param {Object} oEvent 
         */
        onAssessmentTypeChange: function(oEvent) {
            var mEquAnalytics = this.getView().getModel("mEquAnalytics");
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var sSelectedKey = oSelectedItem ? oSelectedItem.getKey() : "";
            var oRecoFilter = this.getView().byId("idEquiAnalyticsRecoFilter");
            var aRecommendationDropDowns = mEquAnalytics.getProperty("/metadata/dropDowns/recommendationsDropdown");
            var aDropdowns = [];
            
            if(!sSelectedKey || sSelectedKey === "All") {
                mEquAnalytics.setProperty("/metadata/dropDowns/recommendations", aRecommendationDropDowns);
            } else {
                aDropdowns.push({"key":"All","text":"All"});
                for(var i = 0; i < aRecommendationDropDowns.length; i++) {
                    if(aRecommendationDropDowns[i].assessmentType === sSelectedKey) {
                        aDropdowns.push(aRecommendationDropDowns[i]);
                    }
                }
                mEquAnalytics.setProperty("/metadata/dropDowns/recommendations", aDropdowns);
            }

            oRecoFilter.clearSelection();
        }

    });
});