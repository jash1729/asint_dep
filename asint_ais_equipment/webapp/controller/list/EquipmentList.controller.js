sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/asint/ais/library/utils/UITableViewSettingsHelper",
    "com/asint/ais/library/utils/VariantManagementHelper",
    "com/asint/ais/library/utils/MTableViewSettingsHelper",
    "sap/ui/core/IconPool",
    "sap/ui/core/Fragment",
    "com/asint/ais/library/utils/TableP13nEngineHelper",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/base/Log",
    "com/asint/ais/library/utils/ObjectHierarchy"
], function (BaseController, JSONModel, UITableViewSettingsHelper, VariantManagementHelper, MTableViewSettingsHelper, IconPool, Fragment, TableP13nEngineHelper, Token, Filter, FilterOperator, MessageBox, Logger, ObjectHierarchyNG) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.list.EquipmentList", {
        /**
         * This function will be called once the view got initialized for the first time
         * Here we are initiaizing variant management from library and attaching event for route
         * pattern matched
         */
        onInit: function () {
            this._oLogger = Logger.getLogger("EquipmentListController");
            this.oVariantManagementHelper = new VariantManagementHelper(this, {
                "ControlId": {
                    "SmartVariantManagement": "idSmartVariantManagement",
                    "Filterbar": "idDynamicPagefilterbar",
                    "Table": ["idEquipmentListMTable"],
                    "SnappedContent": "idDynamicPageSnappedContent",
                    "ExpandedContent": "idDynamicPageExpandedContent"
                },
                "FilterBarSettings": {
                    "EnableBasicSearch": true,
                    "BasicSearchKeys": ["name", "equipmentDescription", "parentFunctionalLocationName", "category", "objectType", "abcIndicator", "categoryDescription",
                        "srcId", "assetManufacturerName", "planningPlant", "createdBy", "modifiedBy", "displayId", "parentEquipmentName", "objectTypeDescription",
                        "parentEquipmentDescription", "parentFunctionalLocationDescription", "maintenancePlant", "isActive", "flagComponent","activationState", "sortField","componentType","classDetails","masterDataAttribution","technicalObjectSortCode"]
                },
                "Settings": {
                    "LoadOnlyVisibleTable": false
                }
            });

            this.oVariantManagementHelper.initialise();
            this.fnLoadBussinessSuiteIcons();
            // this._fnInitSplitterLayout();
            //    this._fnInitTableFactorySettings();
            var oEQUMultiInput = this.getView().byId("idEquipmentInputFilter");
            oEQUMultiInput.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });

            var oFLOCMultiInput = this.getView().byId("idFunctionalInputFilter");
            oFLOCMultiInput.addValidator(function (args) {
                var text = args.text;
                return new sap.m.Token({ key: text, text: text });
            });
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("mEquipment");
            var isValueDataLoaded = oModel.getProperty("/data/isValueDataLoaded");
            if (!isValueDataLoaded) {
                this.fnLoadValueHelp();

            }

            // TODO: ObjHieLib - add
            this.fnInitObjectHierarchy();
            this.getRouter().getRoute("nEquipmentList").attachPatternMatched(this.fnInitialize, this);

            this.PARENT_COPY_FIELDS = [
                { key: "technicalObjectSortCode", label: "Tech ID" },
                { key: "objectType",              label: "Object Type" },
                { key: "startUpDate",             label: "Start Up Date" },
                { key: "assetManufacturerName",   label: "Asset Manufacturer Name" },
                { key: "manufacturerCountry",     label: "Country" },
                { key: "constructionYear",        label: "Construction Year" },
                { key: "constructionMonth",       label: "Construction Month" },
                { key: "maintenancePlant",        label: "Maintenance Plant" },
                { key: "plantSection",            label: "Plant Section" },
                { key: "maintenanceWorkCenter",   label: "Work Center" },
                { key: "abcIndicator",            label: "Criticality" },
                { key: "functionalLocation",      label: "Functional Location" },
                { key: "functionalLocationName",  label: "Functional Location Description" },
                { key: "sortField",               label: "Sort Field" },
                { key: "companyCode",             label: "Company Code" },
                { key: "costCenter",              label: "Cost Center" },
                { key: "businessArea",            label: "Business Area" },
                { key: "planningPlant",           label: "Planning Plant" },
                { key: "plannerGroup",            label: "Planner Group" },
                { key: "catalogProfile",          label: "Catalog Profile" }
            ];
        },

        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {
            // this.fnInitTable();
        },

        /**
         * This function will be called after exit the view
         */
        onExit: function () {
            // if (this.getView().byId("idEquiAnalyticsVizFramePopover1")) {
            //     this.getView().byId("idEquiAnalyticsVizFramePopover1").destroy();
            // }
            if (this.getView().byId("idEquiAnalyticsVizFramePopover2")) {
                this.getView().byId("idEquiAnalyticsVizFramePopover2").destroy();
            }
            if (this.getView().byId("idEquiAnalyticsVizFramePopover3")) {
                this.getView().byId("idEquiAnalyticsVizFramePopover3").destroy();
            }
        },

        /**
         * This function will be called everytime when the view got initialized as we are attaching this to pattern matched
         */
        fnInitialize: function () {

            var that = this;
            this.sTableVisibleId = "idEquipmentListMTable";
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this._isEditOpen = false;
            var oData = {
                "data": {
                    "backupVals":[],
                    "listHeader": "",
                    "tableTitleBusy": "",
                    "componentTypes":[],
                    "hierarchyData": {
                        "nodes": [
                            {
                                "id": "AVL",
                                "name": "AVL",
                                "type": "FL",
                                "desc": "ABC VENTURES LIMITED",
                                "status": "Success",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "ABC PETROCHEMICAL LIMITED"
                                    }
                                ]
                            },
                            {
                                "id": "ARP",
                                "name": "ARP",
                                "type": "FL",
                                "desc": "ABC PETROCHEMICAL LIMITED",
                                "status": "Standard",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "ABC PETROCHEMICAL LIMITED"
                                    }
                                ]
                            },
                            {
                                "id": "ARP-PTA",
                                "name": "ARP-PTA",
                                "type": "FL",
                                "desc": "PURE ACID",
                                "status": "Success",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "PURE ACID"
                                    }
                                ]
                            },
                            {
                                "id": "ARP-PTA-ELE",
                                "name": "ARP-PTA-ELE",
                                "type": "FL",
                                "desc": "ELECTRICAL SYSTEMS",
                                "status": "Standard",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "ELECTRICAL SYSTEMS"
                                    }
                                ]
                            },
                            {
                                "id": "ARP-PTA-ETP",
                                "name": "ARP-PTA-ETP",
                                "type": "FL",
                                "desc": "EFFLUENT TREATMENT PLANT",
                                "status": "Standard",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "EFFLUENT TREATMENT PLANT"
                                    }
                                ]
                            },
                            {
                                "id": "ARP-PTA-FAC",
                                "name": "ARP-PTA-FAC",
                                "type": "FL",
                                "desc": "FACILITIES",
                                "status": "Success",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "FACILITIES"
                                    }
                                ]
                            },
                            {
                                "id": "ARP-PTA-HSE",
                                "name": "ARP-PTA-HSE",
                                "type": "FL",
                                "desc": "SAFETY SYSTEMS",
                                "status": "Standard",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "SAFETY SYSTEMS"
                                    }
                                ]
                            }
                        ],
                        "lines": [
                            {
                                "from": "AVL",
                                "to": "ARP"
                            }, {
                                "from": "ARP",
                                "to": "ARP-PTA"
                            }, {
                                "from": "ARP-PTA",
                                "to": "ARP-PTA-ELE"
                            }, {
                                "from": "ARP-PTA",
                                "to": "ARP-PTA-ETP"
                            }, {
                                "from": "ARP-PTA-ETP",
                                "to": "ARP-PTA-FAC"
                            }, {
                                "from": "ARP-PTA-FAC",
                                "to": "ARP-PTA-HSE"
                            }
                        ]
                    },
                    "createNewEquipment": {
                        "name": "",
                        "description": "",
                        "category": "",
                        "oDialogData": {},
                        "selectedEquTemp": [],
                        "sParentAssetKey": "",
                        "oParentAsset": {},
                        "isConfirmEnabled": false
                    },
                    "filterData": {
                        "equipmentName": "",
                        "functionalLocationName": ""
                    },
                    "AdvancedFilters": {
                        "characteristicIsS4":false,
                        "characteristicIsS4Toggle":true,
                        "filtersList": [],
                        "S4Classes":{
                            "tableHeader":""
                        },
                        "isCreateBtnVisible": false,
                        "tableHeader": this._oi18n.getText("asint.equipment.advancedFilters.table.title.text", [0]),
                        "isEditEnabled": false,
                        "isDeleteEnabled": false,
                        "isApplyEnabled": false,
                        "selectedFilters": [],
                        "selectedObjectTemplates": [],
                        "Classes": {
                            "classList": [],
                            "tableHeader": this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [0]),
                            "isOkEnabled": false,
                            "selectedClasses": []
                        },
                        "Chars": {
                            "charsList": [],
                            "tableHeader": this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [0]),
                            "isOkEnabled": false,
                            "selectedChars": []
                        },
                        "ObjectTemplatesData": [],
                        "ClassesData": [],
                        "CharsData": [],
                        "CalcBuilder": {
                            "metaDataVariables": [],
                            "Variable": [],
                            "TreeData": [],
                            "EquipmentProps": [],
                            "ClassProps": [],
                            "CharacteristicProps": [],
                            "FilterName": "",
                            "Expression": ""
                        },
                        "showExpression": {
                            "currentId": "",
                            "FilterName": "",
                            "Expression": ""
                        },
                        "dialogHeader":""
                    },
                    "list": {
                        "advanceFilter": {
                            "class": {
                                "selected": []
                            }
                        }
                    },
                    "userRoles": {
                        "edit": true
                    },
                    "assetHierarchy": {},
                    "heatMap": {},
                    "riskSummary": {},
                    "donutMap": {},
                    "analytics": {
                        "applyFilter": false,
                        "popupData": [],
                        "popupDataHeader": this._oi18n.getText("asint.equipment.list.analytics.popup.table.title.text", [0]),
                        "mainPlant": [],
                        "planningPlant": []
                    },
                    "backupriskSummaryData": {}
                },
                "metadata": {
                    "showHierarchy": false,
                    "dropDown":{
                        "componentFlag":[
                            {"key":"Temporary Repair Component","text":"Temporary Repair Component"},
                            {"key":"Out of Service","text":"Out of Service"}
                        ]
                    }
                }
            };
            var oModel = new JSONModel(oData);
            oModel.setSizeLimit(100000);
            this.getView().setModel(oModel, "mEquipmentList");
            // TODO: ObjHieLib - delete
            // this.fnInitNetworkGraph();
            // this.fnFetchAssetHierarchy();
            this.fnFetchAdvancedFiltersBasedonUser();
            this.fnFetchEquipmentMetadata();
            this.getUserRoles();
            this.getRiskDetailData();
            this.oVariantManagementHelper.refreshBinding();

            var oCommonModel = this.getView().getModel("mEquipment");
            var isEnumLoaded = oCommonModel.getProperty("/metadata/ValueHelps/isEnumsLoaded");
            if(!isEnumLoaded){
                this.fnFetchEquipmentEnums();
            }

            var isFeatureFlagLoaded = oCommonModel.getProperty("/metadata/featureFlag/isLoaded");
            if (isFeatureFlagLoaded) {
                this.fnFetchComponentTypeList();
                this.fnInitTable();
            } else {
                this.fnLoadFeatureFlagConfig(function () {
                    that.fnFetchComponentTypeList();
                    that.fnInitTable();
                });
            }
            
        },

        // TODO: ObjHieLib - add
        /**
         * Function to init object hierarchy
         */
        fnInitObjectHierarchy: function () {

            this._objectHierarchyNG = new ObjectHierarchyNG(window.com.asint.ais.mi.equipment.baseURI, {
                "type": "LIST",
                "nodePress": this.onNodePress.bind(this),
                "declinePress": this.onDeclinePress.bind(this),
                "flexColumnLayoutId": "idFlexiColLayout",
                "busyControlId": "idObjectHierarchyPage"
            }, this);

            var oObjectHierarchyPage = this.getView().byId("idObjectHierarchyPage");

            if (oObjectHierarchyPage) {
                oObjectHierarchyPage.removeAllContent();
                oObjectHierarchyPage.addContent(this._objectHierarchyNG.getNetworkGraph());
                this._objectHierarchyNG.fetchHierarchy("LIST");
            }

        },

        // TODO: ObjHieLib - add
        /**
         * Function to handle hierarchy node press
         * 
         * @param {Object} oSelectedNode
         */
        onNodePress: function (oSelectedNode) {

            var oEquipmentInputFilterItem = this.getView().byId("idEquipmentInputFilterItem");
            var oEquipmentInputFilter = this.getView().byId("idEquipmentInputFilter");
            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");

            var oFunctionalInputFilterItem = this.getView().byId("idFunctionalInputFilterItem");
            var oFunctionalInputFilter = this.getView().byId("idFunctionalInputFilter");
            if (oSelectedNode.type === "EQUI") {
                oEquipmentInputFilterItem.setVisibleInFilterBar(true);
                oEquipmentInputFilter.removeAllTokens();
                oEquipmentInputFilter.addToken(new sap.m.Token({
                    key: oSelectedNode.name,
                    text: oSelectedNode.name
                }));
            } else {
                oFunctionalInputFilterItem.setVisibleInFilterBar(true);
                oFunctionalInputFilter.removeAllTokens();
                oFunctionalInputFilter.addToken(new sap.m.Token({
                    key: oSelectedNode.name,
                    text: oSelectedNode.name
                }));
            }
            oFilterBar.fireSearch();

        },

        // TODO: ObjHieLib - add
        /**
         * Function to handle decline press
         */
        onDeclinePress: function (oEvent) {

            this.onToggleBeginPage(oEvent, "idObjectHierarchyPage");
        
        },

        /**
         * Function that fetches the RCA data for graphs
         */
        getRiskDetailData: function () {
            var that = this;
            var mEquipmentList = that.getView().getModel("mEquipmentList");
            var oCriticalityMap = {};
            var oRiskScoreMap   = {};
            var iCompleted = 0;    

            /**
             *
             */
            function getVal(primary, fallback) {
                return (primary !== undefined && primary !== null) ? primary : (fallback !== undefined && fallback !== null) ? fallback : "";
            }

            /**
             *
             */
            function fnTryMerge() {
                iCompleted++;
                if (iCompleted < 2) {
                    return;
                }

                var normalized = Object.keys(oCriticalityMap).map(function (sObjectId) {
                    var oCrit = oCriticalityMap[sObjectId];
                    var oRisk = oRiskScoreMap[sObjectId] || {};
                    return {
                        criticalityCode: getVal(oCrit.CRITICALITY_CODE, null),
                        criticalityText: getVal(oCrit.CRITICALITY_TEXT, null),
                        riskScore: getVal(oRisk.RISK_SCORE, null),
                        alphanumericRiskScore: getVal(oRisk.alphaNumericRiskScore, null),
                        sheMr: getVal(oRisk.SHE_MR, null),
                        sheUmr: getVal(oRisk.SHE_UMR, null),
                        ecomMr: getVal(oRisk.ECOM_MR, null),
                        ecomUmr: getVal(oRisk.ECOM_UMR, null),
                        objectId: getVal(oCrit.OBJECT_ID, null),
                        objectName: getVal(oCrit.OBJECT_NAME, null),
                        objectDescription: getVal(oCrit.OBJECT_DESCRIPTION, null)
                    };
                });

                mEquipmentList.setProperty("/data/backupriskSummaryData", JSON.parse(JSON.stringify(normalized)));
                that.setRCAChartData(normalized);
            }

            that.commonDataSource.getCriticalityData("EQUI", function (oResponse) {
                (oResponse.response || []).forEach(function (item) {
                    if (item.OBJECT_ID) {
                        oCriticalityMap[item.OBJECT_ID] = item;
                    }
                });
                fnTryMerge();
            }, function () {
                that._oLogger.error("Failed to load Criticality");
                fnTryMerge();
            });

            that.commonDataSource.getRiskScoreData(function (oResponse) {
                (oResponse.response || []).forEach(function (item) {
                    if (item.OBJECT_ID) {
                        oRiskScoreMap[item.OBJECT_ID] = item;
                    }
                });
                fnTryMerge();
            }, function () {
                that._oLogger.error("Failed to load Risk Score");
                fnTryMerge();
            });
        },

        /**
         * Function that sets the data for donut and heatmap graph
         * @param {Object} assessmentData 
         */
        setRCAChartData: function (assessmentData) {
            var that = this;
            var result = [], modifiedResult = [], criticality = [], assessmentDataArr = [], criticalityData = [];
            var mEquipmentList = that.getView().getModel("mEquipmentList");
            if (Object.values(assessmentData).length > 0) {
                assessmentData = Object.values(assessmentData);
                assessmentData.sort(function (a, b) {
                    if(a && a.criticalityCode && b && b.criticalityCode){
                        return a.criticalityCode.localeCompare(b.criticalityCode);
                    }
                });
                assessmentData.forEach(function (item) {
                    var completeString = item.criticalityCode + " - " + item.criticalityText;
                    if (criticality[completeString]) {
                        criticality[completeString].criticalitycount++;
                        criticality[completeString].objectId.push(item.objectId);
                    } else {
                        criticality[completeString] = {
                            code: completeString,
                            objectId: [item.objectId],
                            criticalitycount: 1
                        };
                        var criticalityObj = {
                            "code": item.criticalityCode,
                            "completeText": completeString
                        }
                        criticalityData[item.criticalityCode] = criticalityObj;
                    }
                    assessmentDataArr[item.objectId] = item;
                });
                criticality = Object.values(criticality).map(item => ({
                    code: item.code,
                    objectId: item.objectId,
                    criticalitycount: item.criticalitycount
                }));
                criticality.sort(function (a, b) {
                    return a.code.localeCompare(b.code)
                });
                mEquipmentList.setProperty("/data/donut", criticality);
                mEquipmentList.setProperty("/data/riskSummaryData", assessmentDataArr);
                var xAxisLabels = ["sheMr", "sheUmr", "ecomMr", "ecomUmr"];
                /* eslint-disable no-inner-declarations */
                /**
                 * Functionnto check it it's valid value
                 * @param {String} value 
                 * @returns 
                 */
                function isValidValue(value) {
                    if (value === null || value === "") return false;
                    if (!isNaN(value) && typeof value === "string") return false;
                    return true;
                }
                assessmentData.forEach(entry => {
                    xAxisLabels.forEach(label => {
                        var value = entry[label];
                        if (isValidValue(value)) {
                            result.push({
                                category: label,
                                riskValue: value,
                                objectId: entry.objectId
                            });
                        }
                    });
                });
                result.sort(function (a, b) {
                    if(a && a.riskValue && b && b.riskValue){
                        return a.riskValue.localeCompare(b.riskValue)
                    }
                });
                result.forEach(entry => {
                    var key = `${entry.category}-${entry.riskValue}`;
                    if (modifiedResult[key]) {
                        modifiedResult[key].objectId.push(entry.objectId);
                        modifiedResult[key].equicount++;
                    } else {
                        modifiedResult[key] = {
                            category: entry.category,
                            riskValue: entry.riskValue,
                            objectId: [entry.objectId],
                            equicount: 1
                        };
                    }
                });
                var finalResult = Object.values(modifiedResult).map(item => ({
                    category: item.category,
                    riskValue: item.riskValue,
                    objectId: item.objectId,
                    equicount: item.equicount
                }));
                var categoryMap = {
                    "sheUmr": "SHE Unmitigated risk",
                    "sheMr": "SHE Mitigated risk",
                    "ecomUmr": "Financial unmitigated risk",
                    "ecomMr": "Financial mitigated risk"
                };
                finalResult.forEach(function (item) {
                    item.expandedCategory = categoryMap[item.category] || "Unknown category";
                });
                mEquipmentList.setProperty("/data/heatMap", finalResult);
                mEquipmentList.setProperty("/data/criticalityData", criticalityData);
                that.fnRenderChart(assessmentData);
            } else {
                mEquipmentList.setProperty("/data/heatMap", {});
                mEquipmentList.setProperty("/data/donut", {});
                mEquipmentList.setProperty("/data/stacked", {});
            }
            that.fnInitializeChart();
        },

        /**
         * Function to open dialog / fragment for advance Filters
         * @param {String} sFragmentId 
         * @param {String} sFragmentName 
         * @param {String} sFragmentInstanceVarName 
         */
        onOpenAdvancedFilterDialog: function (
            sFragmentId,
            sFragmentName,
            sFragmentInstanceVarName,
            sInputName
        ) {
            var oInput = this.getView().byId(sInputName);
            var oModel = this.getView().getModel("mEquipmentList");
            this.valueHelpFilter.onOpenValuHelpFilterDialog(
                null,
                sFragmentId,
                sFragmentName,
                sFragmentInstanceVarName,
                oModel,
                oInput
            );
        },

        /**
         * This function will be called everytime when the for analytics view 
         */
        fnInitializeChart: function () {
            var that = this;
            // var mEquipmentList = that.getView().getModel("mEquipmentList");
            // var chartData = mEquipmentList.getProperty("/data/donut");
            // var oAnalyticsVizFrame1 = this.getView().byId("idEquiAnalyticsVizFrame1");
            // var oAnalyticsVizFramePopover1 = this.getView().byId("idEquiAnalyticsVizFramePopover1");
            // oAnalyticsVizFrame1.setVizProperties({
            //     plotArea: {
            //         plotArea: {
            //             dataPointStyle: {
            //                 "rules": [

            //                 ],
            //                 "others": {
            //                     "properties": {
            //                         "color": "#dddddd"
            //                     }
            //                 }
            //             }
            //         },
            //         background: {
            //             border: {
            //                 top: {
            //                     visible: false
            //                 },
            //                 bottom: {
            //                     visible: false
            //                 },
            //                 left: {
            //                     visible: false
            //                 },
            //                 right: {
            //                     visible: false
            //                 }
            //             }
            //         },
            //         dataLabel: {
            //             formatString: [[0]],
            //             visible: true
            //         }
            //     },
            //     categoryAxis: {
            //         title: {
            //             visible: false
            //         }
            //     },
            //     legend: {
            //         visible: true,
            //         title: {
            //             visible: false
            //         }
            //     },
            //     title: {
            //         visible: false,
            //     }
            // });
            // oAnalyticsVizFramePopover1.connect(oAnalyticsVizFrame1.getVizUid());
            // oAnalyticsVizFramePopover1.setActionItems([{
            //     type: "action",
            //     text: that._oi18n.getText("asint.equipment.analytics.vizpopover.showDetails.text"),
            //     /**
            //      * Function to handle press event
            //      */
            //     press: function () {
            //         that.onActionPress();
            //     }
            // }]);
            var oAnalyticsVizFrame2 = this.getView().byId("idEquiAnalyticsVizFrame2");
            var oAnalyticsVizFramePopover2 = this.getView().byId("idEquiAnalyticsVizFramePopover2");
            // var colorMapping = {
            //     "A": '#B81B0E',
            //     "B": '#F7B500',
            //     "C": '#549C30'
            // };
            // var colors = ["#B81B0E", "#F7B500", "#549C30"];
            // var colorPalette = [];
            // if (chartData.length > 0) {
            //     colorPalette = chartData.map(function (item) {
            //         return colorMapping[item.code] || that.getRandomColor(colors);
            //     });
            //     colorPalette = [...new Set(colorPalette)];
            // };
            oAnalyticsVizFrame2.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true
                    },
                    // colorPalette: colorPalette
                },
                title: {
                    visible: false
                }
            });
            oAnalyticsVizFramePopover2.connect(oAnalyticsVizFrame2.getVizUid());
            oAnalyticsVizFramePopover2.setActionItems([{
                type: "action",
                text: that._oi18n.getText("asint.equipment.analytics.vizpopover.showDetails.text"),
                /**
                 * Function to handle press event
                 */
                press: function () {
                    that.onActionPress();
                }
            }]);
            var oVizFrame = this.getView().byId("idEquiVizFrame");
            var oAnalyticsVizFramePopover3 = this.getView().byId("idEquiAnalyticsVizFramePopover3");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,
                        showTotal: true
                    },
                    // colorPalette: colorPalette
                },
                valueAxis: {
                    label: {
                    },
                    title: {
                        visible: true,
                        text: "No of Equipments"
                    }
                },
                valueAxis2: {
                    label: {
                    },
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true,
                        text: "Risk Score"
                    }
                },
                title: {
                    visible: false
                }
            });
            oAnalyticsVizFramePopover3.connect(oVizFrame.getVizUid());
            oAnalyticsVizFramePopover3.setActionItems([{
                type: "action",
                text: that._oi18n.getText("asint.equipment.analytics.vizpopover.showDetails.text"),
                /**
                 * Function to handle press event
                 */
                press: function () {
                    that.onActionPress();
                }
            }]);
        },

        // /**
        //  * Function that generates random color
        //  * @returns String
        //  */
        // getRandomColor: function (colors) {
        //     var randomNumber = Math.floor(Math.random() * 16777215);
        //     var randomColor = `#${randomNumber.toString(16).padStart(6, "0")}`;
        //     if (!colors.includes(randomColor)) {
        //         return randomColor;
        //     } else {
        //         that.getRandomColor(colors);
        //     }
        // },

        /**
         * Function that gets the risk score list
         * @param {Object} aResponse 
         * @returns 
         */
        fnGetRiskScoreList: function (aResponse) {
            var aRiskScore = [];
            for (var i in aResponse) {
                if (aResponse[i]["criticalityCode"] && (!aRiskScore.includes(aResponse[i]["criticalityCode"]))) {
                    aRiskScore.push(aResponse[i]["criticalityCode"]);
                }
            }
            return aRiskScore;
        },

        /**
         * Function that prepare the data for stacked graph
         * @param {Object} aResponse 
         * @returns Object
         */
        fnPrepareDataset: function (aResponse) {
            var oDataset = {};
            var aRiskScore = this.fnGetRiskScoreList(aResponse);
            /**
             * Function to format row data
             */
            var fnGetRow = function () {
                var oRow = {};
                for (var j in aRiskScore) {
                    oRow[aRiskScore[j]] = 0;
                    oRow[aRiskScore[j] + "_objectId"] = [];
                }
                return oRow;
            };
            aRiskScore.push("RiskScore");
            for (var i in aResponse) {
                var sRiskScore = "";
                if (aResponse[i].riskScore && aResponse[i].alphanumericRiskScore) {
                    sRiskScore = aResponse[i].riskScore + " - " + aResponse[i].alphanumericRiskScore
                } else if (aResponse[i].riskScore) {
                    sRiskScore = aResponse[i].riskScore
                } else {
                    sRiskScore = aResponse[i].alphanumericRiskScore
                }
                var scriticalityCode = aResponse[i]["criticalityCode"];
                if (sRiskScore && scriticalityCode) {
                    if (sRiskScore && (!oDataset[sRiskScore])) {
                        var oRow = fnGetRow();
                        oRow["RiskScore"] = sRiskScore;
                        oDataset[sRiskScore] = oRow;
                    }
                    if (scriticalityCode) {
                        oDataset[sRiskScore][scriticalityCode] += 1;
                        oDataset[sRiskScore][scriticalityCode + "_objectId"].push(aResponse[i].objectId);
                    }
                }
            }
            return Object.values(oDataset);
        },

        /**
         * Function that renders the stacked column chart
         * @param {Object} aResponse 
         */
        fnRenderChart: function (aResponse) {
            var that = this;
            var oVizFrame = this.getView().byId("idEquiVizFrame");
            var aRiskScore = this.fnGetRiskScoreList(aResponse);
            var aDataset = this.fnPrepareDataset(aResponse);
            var criticalityData = that.getView().getModel("mEquipmentList").getProperty("/data/criticalityData");
            var oDatasetMetadata = {
                dimensions: [],
                measures: [],
                data: {
                    path: "mEquipmentList>/data/stacked"
                }
            };
            var sData = [];
            oVizFrame.removeAllFeeds();
            aRiskScore.forEach(function (item) {
                sData.push(criticalityData[item].completeText)
            })
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: sData
            }));
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["RiskScore"]
            }));
            oDatasetMetadata.dimensions.push({
                name: "RiskScore",
                value: "{mEquipmentList>RiskScore}"
            });
            for (var i in aRiskScore) {
                var criticalityObj = criticalityData[aRiskScore[i]];
                var sName = criticalityObj.completeText;
                oDatasetMetadata.measures.push({
                    name: sName,
                    value: "{mEquipmentList>" + aRiskScore[i] + "}"
                });
            }
            oDatasetMetadata.measures.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
            var oDataset = new sap.viz.ui5.data.FlattenedDataset(oDatasetMetadata);
            oVizFrame.setDataset(oDataset);
            this.getView().getModel("mEquipmentList").setProperty("/data/stacked", aDataset);
        },

        /**
         * Function to handle expand and collapse of the analytics panel.
         */
        onAnalyticsPanelToggleExpand: function (bExpand) {
            var that = this;
            var aPanelId = ["idEquiAnalyticsPanel2", "idEquiAnalyticsPanel3"];
            aPanelId.forEach(function (sPanelId) {
                that.getView().byId(sPanelId).setExpanded(bExpand);
            });

        },
        /**
        * Function to initialize the list view table.
        */
        fnInitTable: function () {

            if (!this.oTableP13nEngineHelper) {
                this.oTableP13nEngineHelper = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idEquipmentListMTable", // Mandatory
                        "settingButton": "idTableP13nSettings"
                    },
                    "event": {
                        "columnListItemPress": this.onNavToDetail, // Mandatory
                        "onDataReceived": this.fnOnDataReceived // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": true
                    }
                }, this);
            }

        },

        /**
         * Function to load business icons
         */
        fnLoadBussinessSuiteIcons: function () {

            var b = [],
                c = {},
                B = {
                    fontFamily: "BusinessSuiteInAppSymbols",
                    fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/")
                };

            IconPool.registerFont(B);
            b.push(IconPool.fontLoaded("BusinessSuiteInAppSymbols"));
            c.BusinessSuiteInAppSymbols = B;

        },

        /**
         * Function to handle export to excel
         */
        onPressExportExcel: function () {
            var sFileName = this._oi18n.getText("title");
            sFileName += "_" + this.formatter.formatDate(new Date(), "dd_MM_yyyy_HH_mm_ss");
            var sShowExcelExport = this.getView().getModel("mEquipment").getProperty("/metadata/featureFlag/equipmentExcelExportEnhancements");
            
            if (sShowExcelExport === "1") {
                var that = this;
                var sTableId = this.sTableVisibleId;
                var oTable = this.byId(sTableId);
                var oBind = oTable.getBinding("items");
                var sUrl = oBind.getDownloadUrl();

                // build count URL
                var sCntUrl;
                if (sUrl.indexOf("?") !== -1) {
                    var aParts = sUrl.split("?");
                    var aAllowed = aParts[1].split("&").filter(function (p) {
                        return p.startsWith("$filter") || p.startsWith("$search");
                    });
                    sCntUrl = aParts[0] + "/$count" + (aAllowed.length ? "?" + aAllowed.join("&") : "");
                } else {
                    sCntUrl = sUrl + "/$count";
                }

                this.commonDataSource.fnMakeGetRequest(sCntUrl, {}, function (cnt) {
                    var total   = parseInt(cnt, 10),
                        chunk   = 100,
                        pages   = Math.ceil(total / chunk),
                        dataMap = {},
                        done    = 0;

                        if (pages === 0) {
                            buildExport();
                            return;
                        }

                    for (var i = 0; i < pages; i++) {
                        (function (idx) {
                            var urlPage = sUrl +
                                (sUrl.includes("?") ? "&" : "?") +
                                "$skip=" + (idx * chunk) + "&$top=" + chunk;

                            that.commonDataSource.fnMakeGetRequest(
                                urlPage, {},
                                function (res) {
                                    dataMap[idx] = res.value;
                                    if (++done === pages) { buildExport(); }
                                },
                                function () {
                                    dataMap[idx] = [];
                                    if (++done === pages) { buildExport(); }
                                }
                            );
                        })(i);
                    }

                    function buildExport() {
                        var oTable = that.getView().byId(sTableId);

                        var aCols = [];

                        if (oTable) {
                            oTable.getColumns().filter(function (c) {
                                return c.getVisible();
                            }).forEach(function (col) {
                                var hdr = col.getAggregation("header");
                                var exp = hdr && hdr.data("exportSettings");
                                if (!exp) {
                                    return;
                                }
                                var oI18n = that.getView().getModel("i18n").getResourceBundle();

                                if (exp.fields) {
                                    exp.fields.forEach(function (f) {
                                        var lbl = f.i18n && f.i18n.includes(".")
                                            ? oI18n.getText(f.i18n)
                                            : f.i18n || f.value;
                                        aCols.push({ property: f.value, label: lbl });
                                    });
                                } else if (exp.value) {
                                    var lbl = exp.i18n && exp.i18n.includes(".")
                                        ? oI18n.getText(exp.i18n)
                                        : exp.i18n || exp.value;
                                    aCols.push({ property: exp.value, label: lbl });
                                }
                            });
                        }

                        var aRows = Object.keys(dataMap)
                            .sort()
                            .reduce(function (acc, k) { return acc.concat(dataMap[k]); }, [])
                            .map(function (oItem) {
                                var oClone = Object.assign({}, oItem);
                                oClone.classDetails_classDescription = that.formatter.fnFormatEquipmentClass(oClone.classDetails);
                                that.formatter.formatDates(oClone);
                                return oClone;
                            });

                        that.fnExportTableDataToExcel(sTableId, sFileName, function (callback) {
                            callback(aRows, aCols);
                        });
                    }
                });
            } else{
                this.fnExportTableDatatoExcel(this.sTableVisibleId, sFileName);
            }
        },

        /**
         * Function to load Value help
         */
        fnLoadValueHelp: function () {
            var that = this;
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("mEquipment");
            var isValueDataLoaded = oModel.getProperty("/data/isValueDataLoaded");

            if (!isValueDataLoaded) {
                var completedCount = 0;
                var totalFunctions = 4;
                var allFunctionsCompleted = false; // Flag to track if all functions are completed

                /**
                 * Function is acting as calback function which vaue set 
                 * the property true when certain condition will be completed
                 */
                var onComplete = function () {
                    completedCount++;
                    if (completedCount === totalFunctions) {
                        // All data fetching functions have completed
                        oModel.setProperty("/data/isValueDataLoaded", true);
                        allFunctionsCompleted = true; // Set flag to true
                    }
                };

                // Call each data fetching function with a completion callback
                that.fnGetEquipmentCategory(onComplete);
                that.fnEquipmentTechnicalObjectType(onComplete);
                that.fnEquipmentAbcIndicator(onComplete);
                that.fnFlocPlantList(onComplete);

                // Wait for all functions to complete before returning
                var waitInterval = setInterval(function () {
                    if (allFunctionsCompleted) {
                        clearInterval(waitInterval); // Stop waiting
                    }
                }, 100);
            }
        },

        /**
         * Function to handle Ui table settings
         */
        onPressSettingsUITable: function () {

            UITableViewSettingsHelper.handleUITableSettingsDialogOpen(this, "idEquipmentListUiTable");

        },

        /**
         * Function to hanlde sap.m.Table settings
         */
        onPressSettingsMTable: function () {

            MTableViewSettingsHelper.handleMTableSettingsDialogOpen(this, "idEquipmentListMTable");

        },

        /**
         * Function to swicth between tables
         */
        onPressChangeTable: function () {

            if (this.sTableVisibleId === "idEquipmentListMTable") {
                this.getView().byId("idEquipmentListMTable").setVisible(false);
                this.getView().byId("idEquipmentListUiTable").setVisible(true);
                this.sTableVisibleId = "idEquipmentListUiTable";
            } else {
                this.getView().byId("idEquipmentListMTable").setVisible(true);
                this.getView().byId("idEquipmentListUiTable").setVisible(false);
                this.sTableVisibleId = "idEquipmentListMTable";
            }

        },

        /**
         * Function to hanlde navigation to detail
         * @param {Object} oEvent 
         */
        onNavToDetail: function (oEvent) {

            var oRouter = this.getOwnerComponent().getRouter();
            var oContext = oEvent.getSource().getBindingContext("masterService");
            var sEquipmentId = oContext.getProperty("equipmentId");
            if (sEquipmentId) {
                oRouter.navTo("nEquipmentDetail", {
                    "equipmentId": sEquipmentId
                });
            }

        },

        /**
         * Function to hanlde navigation to detail
         * @param {Object} oEvent 
         */
        onPressAnalyticsMode: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("nEquipmentAnalytics");
        },

        /**
        * Function to handle the change in the hierarchy graph.
        * 
        * @param {object} oEvent - Event object
        */
        onHiearchyObjectSelectionChange: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentList");
            var source = oEvent.getSource();
            var path = source.getBindingContext("mEquipmentList").getPath();
            var oSelectedNode = oModel.getProperty(path);

            var oEquipmentInputFilterItem = this.getView().byId("idEquipmentInputFilterItem");
            var oEquipmentInputFilter = this.getView().byId("idEquipmentInputFilter");
            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");

            var oFunctionalInputFilterItem = this.getView().byId("idFunctionalInputFilterItem");
            var oFunctionalInputFilter = this.getView().byId("idFunctionalInputFilter");
            if (oSelectedNode.type === "EQUI") {
                oEquipmentInputFilterItem.setVisibleInFilterBar(true);
                oEquipmentInputFilter.removeAllTokens();
                oEquipmentInputFilter.addToken(new sap.m.Token({
                    key: oSelectedNode.name,
                    text: oSelectedNode.name
                }));
            } else {
                oFunctionalInputFilterItem.setVisibleInFilterBar(true);
                oFunctionalInputFilter.removeAllTokens();
                oFunctionalInputFilter.addToken(new sap.m.Token({
                    key: oSelectedNode.name,
                    text: oSelectedNode.name
                }));
            }
            oFilterBar.fireSearch();

        },

        /**
         * Function to open dialog to create new equipment 
         */
        onCreateNewEquipment: function () {

            this._fnCreateEquipmentHandler("open");

        },

        /**
         * Function to close create dialog
         */
        onCreateNewEquipmentClose: function () {

            this._fnCreateEquipmentHandler("close");

        },

        /**
         * Function on confirem create new equipment
         */
        onCreateNewEquipmentConfirm: function () {

            this._fnCreateEquipmentHandler("confirm");

        },

        /**
         * Function to set hierachy to new View
         */
        onPressToggleHierarchy: function () {

            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var isHierarchyShown = mEquipmentList.getProperty("/metadata/showHierarchy");
            var cont1 = this.getView().byId("idContainer1");

            if (isHierarchyShown) {
                cont1.setSize("0%");
            } else {
                cont1.setSize("30%");
            }

            mEquipmentList.setProperty("/metadata/showHierarchy", !isHierarchyShown);

        },

        /**
         * Function to create Equipment handler
         * @param {Object} sAction 
         */
        _fnCreateEquipmentHandler: function (sAction) {

            switch (sAction) {

            case "open":
                if (!this._createEquipmentDialog) {
                    Fragment.load({
                        name: "com.asint.ais.mi.equipment.view.fragment.CreateEquipment",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        this._createEquipmentDialog = oDialog;
                        this._createEquipmentDialog.open();
                    }.bind(this));
                } else {
                    this._createEquipmentDialog.open();
                }
                break;

            case "close":
                if (this._createEquipmentDialog) {
                    var mEquipment = this.getView().getModel("mEquipmentList");
                    mEquipment.setProperty("/data/createNewEquipment", {});
                    mEquipment.setProperty("/data/componentTypes",[]);
                    mEquipment.setProperty("/data/createNewEquipment/selectedEquTemp", []);

                    var oParentInput = sap.ui.getCore().byId("parentInput");
                    oParentInput.setValue("");
                    var oMultiInput = sap.ui.getCore().byId("objectTemplateMultiInput");
                    oMultiInput.removeAllTokens();
                    this._createEquipmentDialog.close();
                }
                break;

            case "confirm":
                var that = this;
                var mEquipmentList = this.getView().getModel("mEquipmentList");
                var oEquipmentCreateObj = mEquipmentList.getProperty("/data/createNewEquipment");
                if(oEquipmentCreateObj.description.length > 500) {
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.description.message001"));
                    return;
                }
                var bMandatoryCheck = that.fnCheckMandatoryFields(oEquipmentCreateObj);
                if (oEquipmentCreateObj && Object.values(oEquipmentCreateObj).length > 0) {
                    if (bMandatoryCheck) {
                        var oPayload = {};
                        oPayload.name = oEquipmentCreateObj.name;
                        // eslint-disable-next-line camelcase
                        oPayload.to_description = [{
                            shortDescription: oEquipmentCreateObj.description,
                            language: "en"
                        }];
                        var aEquipmentTemplates = [];
                        if (oEquipmentCreateObj.selectedEquTemp && oEquipmentCreateObj.selectedEquTemp.length) {
                            oEquipmentCreateObj.selectedEquTemp.forEach(function (oEquTemp) {
                                aEquipmentTemplates.push({ "objectTemplate_ID": oEquTemp.ID })
                            });
                        }
                        // eslint-disable-next-line camelcase
                        oPayload.to_object_template = aEquipmentTemplates;
                        oPayload.componentType=oEquipmentCreateObj.componentType;

                        var oParentAssetData = oEquipmentCreateObj.oParentAsset || {};
                        var aIdentityKeys = ["ID", "name", "to_description"];
                        Object.keys(oParentAssetData).forEach(function (sKey) {
                            if (aIdentityKeys.indexOf(sKey) !== -1) return;
                            var v = oParentAssetData[sKey];
                            if (v !== null && v !== undefined && v !== "") {
                                oPayload[sKey] = v;
                            }
                        });

                        if (Object.prototype.hasOwnProperty.call(oParentAssetData, "sortField")) {
                            oPayload.sortField = oEquipmentCreateObj.sortField;
                        } else {
                            delete oPayload.sortField;
                        }

                        if (Object.values(oEquipmentCreateObj.oParentAsset).length > 0) {
                            if (oEquipmentCreateObj.sParentAssetKey === "equipment") {
                                var sParentEquipmentId = oEquipmentCreateObj.oParentAsset.ID
                                // eslint-disable-next-line camelcase
                                oPayload.parent_equipment_ID = sParentEquipmentId;
                                that.fnGetParentEquipmentInfo(sParentEquipmentId, oPayload);
                            } else {
                                var sParentFlocId = oEquipmentCreateObj.oParentAsset.ID;
                                // eslint-disable-next-line camelcase
                                oPayload.parent_functional_location_ID = sParentFlocId
                                that.fnGetParentFlocInfo(sParentFlocId, oPayload);
                            }
                        } else {
                            that.fnCreateEquipment(oPayload);
                        }
                    } else {
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message02"));
                    }
                } else {
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message02"));
                }
                break;
            }


        },

        /**
         * Creates Equipment
         * @param {Object} oPayload 
         */
        fnCreateEquipment: function (oPayload) {
            var that = this;
            var mEquipmentListModel = this.getView().getModel("mEquipmentList");
            var oMTable = this.getView().byId("idEquipmentListMTable");
            oPayload = that.setCreatedModified(oPayload, "POST");
            this.dataSource.createEquipment(oPayload, function (oResponse) {
                /**
                 * Local call back function
                 */
                var fnLocalCallBack = function(){
                    mEquipmentListModel.setProperty("/data/createNewEquipment", {});
                    that._fnCreateEquipmentHandler("close");
                    that.fnMessageShow("S", that._oi18n.getText("asint.equipment.create.message01"));
                    oMTable.getBinding("items").refresh();
                };
                if(oPayload.to_object_template && oPayload.to_object_template.length > 0){
                    that.fnFetchAsmtTemplateUpdateRepairFlag(oResponse.ID, oResponse["@etag"], fnLocalCallBack);
                }else{
                    fnLocalCallBack();
                }
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.code === "409006") {
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message05"));
                } else {
                    if (err.error.message) {
                        errorDetail = err.error.message;
                    }
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message03"), errorDetail);
                    that._oLogger.error("An Error Occurred In createEquipment :", JSON.stringify(oError));
                }
            });
        },

        /**
         * Function to fetch assessment templates and update repair component text
         */
        fnFetchAsmtTemplateUpdateRepairFlag : function(sEquipmentId, eTag, fnCallBack){
            var that = this;
            var oI18n = that.getView().getModel("i18n").getResourceBundle();
            var isRepairAsmtTemplateAssigned = false;

            this.ASDdataSource.getAssessmentTemplatesByEquipment(sEquipmentId, function (oResponse) {
                var data = oResponse.to_object_template;
                for (let currentObjectTemplate of data) {
                    if (currentObjectTemplate.objectTemplate && currentObjectTemplate.objectTemplate.to_assessment_templates) {
                        for (let assessmentObj of currentObjectTemplate.objectTemplate.to_assessment_templates) {
                            var oAsmtTemplate = assessmentObj.assessmentTemplate;
                            if (oAsmtTemplate && oAsmtTemplate.repairComponentTemplate) {
                                isRepairAsmtTemplateAssigned = true;
                            }
                        }
                    }
                }
                if(isRepairAsmtTemplateAssigned){
                    var oPayload = {
                        "ID": sEquipmentId,
                        "flagComponent": "Temporary Repair Component"
                    };
                    that.dataSource.updateEquipmentObjectTemplates(sEquipmentId, oPayload, function () {
                        fnCallBack();
                    }, function () {
                        that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.assignment.message01"));
                        fnCallBack();
                    }, eTag);
                }else{
                    fnCallBack();
                }
            }, function () {
                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.assignment.message01"));
                fnCallBack();
            });
        },

        // TODO: ObjHieLib - delete
        /**
         * Function to open graph in full screen
         */
        fnPressGraphFullScreenButton: function () {

            var oNetworkGraph = this.getView().byId("idNetworkGraph");
            var isFullScreen = oNetworkGraph.isFullScreen();
            var aToolbarItems = oNetworkGraph.getToolbar().getContent();
            var aCloseBtn = aToolbarItems.filter(function (oItem) {
                return oItem.getMetadata().getName() === "sap.m.Button" && oItem.getIcon() === "sap-icon://decline";
            });

            if (aCloseBtn.length > 0) {
                if (isFullScreen) {
                    aCloseBtn[0].setVisible(false);
                } else {
                    aCloseBtn[0].setVisible(true);
                }
            }

        },

        /**
        * Function to initialize the splitter layout to vertical or horizontal based on the device.
        */
        _fnInitSplitterLayout: function () {

            var splitCont = this.getView().byId("idSplitter");
            var cont1 = this.getView().byId("idContainer1");

            if (sap.ui.Device.system.desktop) {
                splitCont.setOrientation("Horizontal");
                splitCont.triggerResize();
            } else {
                splitCont.setOrientation("Vertical");
            }

            cont1.setSize("0%");

        },

        /**
        * Function to handle the change in the filter bar.
        * 
        * @param {object} oEvent - Event object
        */
        fnOnDataReceived: function (oEvent) {
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oModel = this.getView().getModel("mEquipmentList");

            var oParameters = oEvent.getSource().getQueryOptionsFromParameters();
            if (oParameters["$count"] && oEvent.getSource().getCount && oEvent.getSource().getCount()) {
                var sCount = oEvent.getSource().getCount();
                var sHeader = oI18n.getText("asint.equipment.list.toolbar.table.title", [sCount]);
                oModel.setProperty("/data/listHeader", sHeader);
                oModel.setProperty("/data/tableTiltleBusy", false);
            } else {
                oModel.setProperty("/data/tableTiltleBusy", true);
                this.fnFetchInlineCount(this, "idEquipmentListMTable", function (sCount) {
                    var sHeader = oI18n.getText("asint.equipment.list.toolbar.table.title", [sCount]);
                    oModel.setProperty("/data/listHeader", sHeader);
                    oModel.setProperty("/data/tableTiltleBusy", false);
                });
            }
        },

        // TODO: ObjHieLib - modify
        /* eslint-disable no-unused-vars */
        /**
         * Function to handle the change in the create new mass run form.
         * 
         * @param {object} oEvent - Event object
         * @param {string} sPageId - Page id
         */
        onToggleBeginPage: function (oEvent, sPageId) {

            var that = this;
            var oNavContainer = this.getView().byId("idNavContFlexiColBeginPage");
            var oFlexiColLayout = this.getView().byId("idFlexiColLayout");
            var sActivePageId = this.sBeginPageId;
            var oPage = this.getView().byId(sPageId);

            // TODO: ObjHieLib - delete
            // if (sPageId === "idObjectHierarchyPage") {
            //     that.getView().byId("idNetworkGraph").setVisible(true);
            // } else {
            //     this.getView().byId("idNetworkGraph").setVisible(false);
            // };
            // if (that.getView().byId("idNetworkGraph").isFullScreen()) {
            //     var oNetworkGraph = this.getView().byId("idNetworkGraph");
            //     oNetworkGraph.toggleFullScreen(false);
            // }

            if (sActivePageId === sPageId) {
                oFlexiColLayout.setLayout("MidColumnFullScreen");
                this.sBeginPageId = "";
                
                // TODO: ObjHieLib - delete
                // this.getView().byId("idNetworkGraph").setVisible(false);
                // this.getView().byId("idNetworkGraph").setHeight("90%");
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
            // TODO: ObjHieLib - add
            oFlexiColLayout.fireStateChange({
                "isResize": true
            });

        },


        // TODO: ObjHieLib - delete
        /**
        * Fucntion to initialize the network graph.
        */
        fnInitNetworkGraph: function () {
            var that = this;
            var oNetworkGraph = this.getView().byId("idNetworkGraph");
            oNetworkGraph.getToolbar().insertContent(new sap.m.Button({
                icon: "sap-icon://decline",
                tooltip: that._oi18n.getText("asint.reusable.close.button"),
                /**
                 * Function to handle the change in the hierarchy graph.
                 * 
                 * @param {object} oEvent - Event object
                 */
                press: function (oEvent) {
                    that.onToggleBeginPage(oEvent, "idObjectHierarchyPage");
                }
            }), 8);

        },

        /**
         * Function that check all input fields of create equipment dialog
         * @param {Object} createObj 
         * @returns 
         */
        fnCheckMandatoryFields: function (createObj) {

            if (Object.keys(createObj).length === 0) {
                return false;
            }
            var result = false;
            if (createObj.name && createObj.name.length > 0 && createObj.description && createObj.description.length > 0 && createObj.oParentAsset && Object.keys(createObj.oParentAsset).length > 0) {
                result = true;
            }
            return result;
        },

        /**
         * Function To Open Object Template Value Help
         */
        handleObjectTemplateValueHelp: function () {
            var that = this;
            /**
             * function to open dialog
             */
            var fnOpenObjectTemplateDialog = function () {
                if (!that._oDialogObjectTemplates) {
                    Fragment.load({
                        id: that.oView.getId(),
                        name: "com.asint.ais.mi.equipment.view.fragment.ObjectTemplateValueHelpDialog",
                        controller: that
                    }).then(function (oDialog) {
                        that.getView().addDependent(oDialog);
                        that._oDialogObjectTemplates = oDialog;
                        that._oDialogObjectTemplates.open();
                        that.fnFilterTableWithEquipmentTemplate();
                    });
                } else {
                    that._oDialogObjectTemplates.open();
                    that.fnResetSearch(that.oView.getId(), "idAsintObjectTemplatesTable");
                    that.fnFilterTableWithEquipmentTemplate();
                }
            };
            fnOpenObjectTemplateDialog();
        },

        /**
         * Function To Filter Equipment Object Templates
         */
        fnFilterTableWithEquipmentTemplate: function () {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var oTable = this.byId("idAsintObjectTemplatesTable");
            oTable.removeSelections();
            var oBinding = oTable.getBinding("items");
            var equTemplates = [];
            var templatesList = [];
            oBinding.aFilters = [];
            oBinding.filter([]);
            templatesList = equTemplates;
            var type = "EQUI";
            var oNewFilter = new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "EQUI");
            oBinding.filter([oNewFilter]);
            var oDialogData = {
                Title: that._oi18n.getText("asint.equipment.create.objectTemplate.dialog.title"),
                Type: type,
                TableHeader: that._oi18n.getText("asint.equipment.create.objectTemplate.dialog.tableHeader", [templatesList.length]),
                TemplatesList: templatesList,
                IsOkEnabled: false,
                SelectedObjects: []
            };
            mEquipmentList.setProperty("/data/createNewEquipment/oDialogData", oDialogData);
        },

        /**
         * Function to fetch the inline count once data received from oData api
         */
        onDataReceived: function () {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var oDialogData = mEquipmentList.getProperty("/data/createNewEquipment/oDialogData");
            mEquipmentList.setProperty("/data/showCountBusy", true);
            this.fnFetchInlineCount(this, "idAsintObjectTemplatesTable", function (sCount) {
                var sHeader = that._oi18n.getText("asint.equipment.create.objectTemplate.dialog.tableHeader", [sCount]);
                oDialogData.TableHeader = sHeader;
                mEquipmentList.setProperty("/data/createNewEquipment/oDialogData", oDialogData);
                that.getView().byId("idAsintObjectTemplatesTable").removeSelections();
            });
        },

        /**
         * Function to search object templates list
         * @param {Object} oEvent 
         */
        fnSearchDialogTemplatesList: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var oModel = this.getView().getModel("mEquipmentList");
            var oDialogData = oModel.getProperty("/data/createNewEquipment/oDialogData");
            var sType = oDialogData.Type;
            sQuery = sQuery.trim();
            var oFilterArr;
            if (sQuery === "") {
                oFilterArr = new Filter([
                    new Filter("type", FilterOperator.EQ, sType),
                ], false);
                this.byId("idAsintObjectTemplatesTable").getBinding("items").filter(oFilterArr);
            } else {
                oFilterArr = new Filter([
                    new Filter({
                        path: "name",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sQuery,
                        caseSensitive: false
                    }),
                    new Filter({ path: "displayId", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false })
                ], false);

                var oTypeFilter = new Filter("type", FilterOperator.EQ, sType);
                var oFinalFilter = new Filter([oFilterArr, oTypeFilter], true);
            }
            this.byId("idAsintObjectTemplatesTable").getBinding("items").filter(oFinalFilter);
        },

        /**
         * Function to handle select event of the table to select templates
         */
        onDialogTemplateSelect: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentList"),
                oTable = this.getView().byId("idAsintObjectTemplatesTable");

            var aSelected = oTable.getSelectedItems();
            var oUserData = oModel.getProperty("/data/createNewEquipment/oDialogData");
            if (aSelected.length > 0) {
                oUserData.IsOkEnabled = true;
            } else {
                oUserData.IsOkEnabled = false;
            }
            var aSelectedTemplates = [];
            if (oEvent.getParameters().selected) {
                aSelected.forEach(function (temp) {
                    // var sPath = temp.getBindingContextPath();
                    var selObj = temp.getBindingContext("masterService").getObject();
                    aSelectedTemplates.push(selObj);
                });

                var aAlreadySelectedList = oModel.getProperty("/data/createNewEquipment/selectedEquTemp");
                var oSelectedTemp = [];
                if(aAlreadySelectedList) {
                    oSelectedTemp = aAlreadySelectedList.find(function(oList){
                        return oList.ID === aSelectedTemplates[0].ID;
                    });
                }

                if (oSelectedTemp) {
                    this.fnMessageShow("I", this._oi18n.getText("asint.equipment.detail.message09"), aSelectedTemplates[0].displayId);
                    oEvent.getParameters().listItem.setSelected(false);
                    return;
                } else {
                    if (oUserData.SelectedObjects.length > 0) {
                        aSelectedTemplates.forEach(function (oSelectedItem) {
                            var oFind = oUserData.SelectedObjects.find(function (oFindItem) {
                                return oFindItem.ID === oSelectedItem.ID;
                            });
                            if (!oFind) {
                                oUserData.SelectedObjects.push(oSelectedItem);
                            }
                        });
                        // oUserData.SelectedObjects.push(aSelectedTemplates);
                    } else {
                        oUserData.SelectedObjects = aSelectedTemplates;
                    }
                }
            } else {
                var aDeselectedItems = oEvent.getParameter("listItems");
                aDeselectedItems.forEach(function (oItem) {
                    var oContext = oItem.getBindingContext("masterService").getObject();

                    var iIndex = oUserData.SelectedObjects.findIndex(function (oTemplate) {
                        return oTemplate.ID === oContext.ID;
                    });

                    oUserData.SelectedObjects.splice(iIndex, 1);
                });
            }
            oModel.setProperty("/data/createNewEquipment/oDialogData", oUserData);
        },

        /**
         * Function to close the select object template dialog
         */
        onCloseSelectObjectTemplateDialog: function () {
            var that = this;
            if (that._oDialogObjectTemplates) {
                that._oDialogObjectTemplates.close();
            }
        },

        /**
         * Function to save the templates assignment and make an api call
         */
        onSelectObjectTemplateOkPress: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentList");
            var oMultiInput = sap.ui.getCore().byId("objectTemplateMultiInput");
            // var oTable = this.getView().byId("idAsintObjectTemplatesTable");
            // var aSelected = oTable.getSelectedItems();
            var aSelectedTemplates = oModel.getProperty("/data/createNewEquipment/oDialogData/SelectedObjects");
            var aExistingSelectedTemplates = oModel.getProperty("/data/createNewEquipment/selectedEquTemp") || [];

            // aSelected.forEach(function (temp) {
            //     var selObj = temp.getBindingContext("masterService").getObject();
            //     aSelectedTemplates.push(selObj);
            // });

            for (var i = 0; i < aSelectedTemplates.length; i++) {
                var template = aSelectedTemplates[i];
                var exists = false;
                for (var j = 0; j < aExistingSelectedTemplates.length; j++) {
                    if (template.ID === aExistingSelectedTemplates[j].ID) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    aExistingSelectedTemplates.push(template);
                }
            }

            oMultiInput.removeAllTokens();

            aExistingSelectedTemplates.forEach(function (item) {
                oMultiInput.addToken(new sap.m.Token({
                    key: item.displayId,
                    text: item.displayId
                }));
            });

            oModel.setProperty("/data/createNewEquipment/selectedEquTemp", aExistingSelectedTemplates);

            that.onCloseSelectObjectTemplateDialog();
        },

        

        /**
         * Function To Open Parent Asset Value Help
         */
        onParentAssetHelpRequest: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentList");
            var sKey = oModel.getProperty("/data/createNewEquipment/sParentAssetKey");
            /**
             *  function to open dialog
             */
            var fnOpenAssignParentDialog = function () {
                if (!that._oDialogAssignParent) {
                    Fragment.load({
                        id: that.oView.getId(),
                        name: "com.asint.ais.mi.equipment.view.fragment.AssignParentAssetValueHelpDialog",
                        controller: that
                    }).then(function (oDialog) {
                        that.getView().addDependent(oDialog);
                        that._oDialogAssignParent = oDialog;
                        that._oDialogAssignParent.open();

                        if (sKey === "equipment") {
                            that.fnResetSearch(that.oView.getId(), "idParentEquipmentTable");
                        } else {
                            that.fnResetSearch(that.oView.getId(), "idParentFunctionalLocationTable");
                        }

                    });
                } else {
                    that._oDialogAssignParent.open();

                    if (sKey === "equipment") {
                        that.fnResetSearch(that.oView.getId(), "idParentEquipmentTable");
                    } else {
                        that.fnResetSearch(that.oView.getId(), "idParentFunctionalLocationTable");
                    }
                }

                oModel.setProperty("/data/createNewEquipment/sParentAssetKey", "equipment");
            };
            fnOpenAssignParentDialog();
        },

        /**
         * Function to Show/hide tables based on selected segmented button
         * @param {Objecct} oEvent 
         */
        onSegmentSelect: function (oEvent) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var sKey = "";
            if (oEvent.getParameter("item")) {
                sKey = oEvent.getParameter("item").getKey();
            } else {
                sKey = oEvent.getParameters().key;
            }
            var oEquipmentTable = this.byId("idParentEquipmentTable");
            var oFunctionalLocationTable = this.byId("idParentFunctionalLocationTable");
            if (sKey === "equipment") {
                oEquipmentTable.setVisible(true);
                oFunctionalLocationTable.setVisible(false);
                that.fnResetSearch(that.oView.getId(), "idParentEquipmentTable");
                oModel.setProperty("/data/componentTypes",[]);
            } else if (sKey === "functionalLocation") {
                oEquipmentTable.setVisible(false);
                oFunctionalLocationTable.setVisible(true);
                that.fnResetSearch(that.oView.getId(), "idParentFunctionalLocationTable");
                oModel.setProperty("/data/componentTypes",[]);
            }
            oModel.setProperty("/data/createNewEquipment/sParentAssetKey", sKey);
            that.onSearch(oEvent);
        },

        /**
         * Function to search the data in search field
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var aFilters = [];

            var oTable = oEvent.getSource().getParent().getParent();

            if (sQuery) {
                if (oTable.getId().includes("idParentEquipmentTable")) {
                    var equipmentFilter = new Filter({
                        filters: [
                            new Filter({
                                path: "name",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "equipmentDescription",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "sortField",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "technicalObjectSortCode",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            })
                        ],
                        and: false
                    });
                    aFilters.push(equipmentFilter);
                }

                if (oTable.getId().includes("idParentFunctionalLocationTable")) {
                    var functionalLocationFilter = new Filter({
                        filters: [
                            new Filter({
                                path: "name",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "functionalLocationDescription",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "sortField",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "technicalObjectSortCode",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                                caseSensitive: false
                            })
                        ],

                        and: false
                    });
                    aFilters.push(functionalLocationFilter);

                }

            }
            var srcIDFilter = new Filter({
                filters: [
                    new Filter({
                        path: "srcId",
                        operator: FilterOperator.NE,
                        value1: "BTP" 
                    }),
                    new Filter({
                        path: "srcId",
                        operator: FilterOperator.NE,
                        value1: null 
                    }),
                    new Filter({
                        path: "srcId",
                        operator: FilterOperator.NE,
                        value1: "" 
                    })
                ],
                and: true 
            });
            aFilters.push(srcIDFilter);

            // var srcIDFilter = new Filter({
            //     path: "srcId",
            //     operator: FilterOperator.NE,
            //     value1: "BTP"
            // })
            // aFilters.push(srcIDFilter);

            oTable.getBinding("items").filter(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        /**
         * Function that triggers on parent asset selection and setting the data in the model
         */
        onSelectParentAsset: function () {
            var that=this;
            var oModel = this.getView().getModel("mEquipmentList");
            var mEquipment=this.getView().getModel("mEquipment");
            var catalogBasedCTinXom=mEquipment.getProperty("/metadata/featureFlag/catalogBasedCTinXom");    
            var sType = oModel.getProperty("/data/createNewEquipment/sParentAssetKey");
            var aSelectedItem = [];
            var oReturn = {};
            if (sType === "equipment") {
                var oEquipmentTable = this.byId("idParentEquipmentTable");
                aSelectedItem = oEquipmentTable.getSelectedItems();
                aSelectedItem.forEach(function (oItem) {
                    var oEquipmentData = oItem.getBindingContext("masterService").getObject();
                    oReturn = {
                        "ID": oEquipmentData.equipmentId,
                        "name": oEquipmentData.name,
                        "to_description": oEquipmentData.equipmentDescription,
                        "objectType":oEquipmentData.objectType,
                        "sortField": oEquipmentData.sortField,
                        "parentAssetType":"EQUI"
                        
                    };
                });
            } else if (sType === "functionalLocation") {
                var oFunctionalLocationTable = this.byId("idParentFunctionalLocationTable");
                aSelectedItem = oFunctionalLocationTable.getSelectedItems();
                oReturn = {};
                aSelectedItem.forEach(function (oItem) {
                    var oFunctionalLocationData = oItem.getBindingContext("masterService").getObject();

                    oReturn = {
                        "ID": oFunctionalLocationData.functionalLocationId,
                        "name": oFunctionalLocationData.name,
                        "to_description": oFunctionalLocationData.functionalLocationDescription,
                        "objectType":oFunctionalLocationData.objectType,
                        "sortField": oFunctionalLocationData.sortField,
                        "parentAssetType":"FLOC"
                    };
                });
            }

            if (aSelectedItem.length === 0) {
                oModel.setProperty("/data/createNewEquipment/isConfirmEnabled", false);
                return;
            }

            oModel.setProperty("/data/createNewEquipment/oParentAsset", oReturn);
            oModel.setProperty("/data/createNewEquipment/sortField", oReturn.sortField);

            var oParentInput = sap.ui.getCore().byId("parentInput");
            oParentInput.setValue(oReturn.name);
            if (catalogBasedCTinXom == "0") {
                that.fnSelectComponentTypeDropdown(oReturn);
            }
            
            this._fnFetchParentFieldsAndOpenDialog(oReturn.ID, function () {
                if(catalogBasedCTinXom=="1"){
                    that.fnSelectComponentTypeDropdown(oReturn);
                }
                
            });

            
        },

        /**
         * Fetch parent field values via dataSource then open copy fields dialog
         */
        _fnFetchParentFieldsAndOpenDialog: function (sParentId,fnCallBack) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");

            that.dataSource.fnGetNearestS4ParentFields(
                sParentId,
                function (oData) {

                    oData = oData.data || oData;

                    var oResponseFieldMap = {
                        technicalObjectSortCode: "techId",
                        manufacturerCountry: "country",
                        maintenanceWorkCenter: "workCentre",
                        abcIndicator: "criticality",
                        functionalLocationName: "functionalLocationDescription"
                    };

                    var aCopyFields = that.PARENT_COPY_FIELDS.map(function (oField) {

                        var sResponseKey = oResponseFieldMap[oField.key] || oField.key;

                        var vValue = oData[sResponseKey];

                        var sDisplayValue =
                        (vValue !== null &&
                        vValue !== undefined &&
                        vValue !== "")
                            ? vValue
                            : "";

                        return {
                            key: oField.key,
                            label: oField.label,
                            value: sDisplayValue,
                            selected: !!sDisplayValue,
                            enabled: true
                        };
                    });

                    oModel.setProperty("/data/parentCopyFields", aCopyFields);
                    oModel.setProperty("/data/parentAllFields",oData)
                    if(fnCallBack){
                        fnCallBack()
                    }
                    that._fnLoadCopyFieldsDialog();

                },
                function () {
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.list.parentasset.message01"));
                },

            );
        },

        /**
         * Lazy load and open CopyParentFieldsDialog
         */
        _fnLoadCopyFieldsDialog: function () {
            var that = this;
            if (!that._oCopyParentFieldsDialog) {
                Fragment.load({
                    name: "com.asint.ais.mi.equipment.view.fragment.CopyParentFieldsDialog",
                    controller: that
                }).then(function (oDialog) {
                    that.getView().addDependent(oDialog);
                    that._oCopyParentFieldsDialog = oDialog;
                    that._oCopyParentFieldsDialog.open();
                });
            } else {
                that._oCopyParentFieldsDialog.open();
            }
        },

        /**
         * User confirms field selection — merge into oParentAsset and close both dialogs
         */
        onCopyFieldsConfirm: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            var aCopyFields = oModel.getProperty("/data/parentCopyFields");
            var oParentAsset = oModel.getProperty("/data/createNewEquipment/oParentAsset");

            aCopyFields.forEach(function (oField) { delete oParentAsset[oField.key]; });
            aCopyFields.forEach(function (oField) {
                if (oField.selected && oField.value) {
                    oParentAsset[oField.key] = oField.value;
                }
            });

            oModel.setProperty("/data/createNewEquipment/sortField",oParentAsset.sortField || "");
            oModel.setProperty("/data/createNewEquipment/oParentAsset", oParentAsset);
            oModel.setProperty("/data/createNewEquipment/isConfirmEnabled", true);

            if (this._oCopyParentFieldsDialog) this._oCopyParentFieldsDialog.close();
            this.onParentAssetValueHelpDialogClose();
        },

        /**
        * User cancels — clear selection and close copy dialog only
        */
        onCopyFieldsCancel: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            oModel.setProperty("/data/createNewEquipment/oParentAsset", {});
            oModel.setProperty("/data/createNewEquipment/sortField", "");
            oModel.setProperty("/data/componentTypes", []);
            sap.ui.getCore().byId("parentInput").setValue("");
            var oEquipmentTable = this.byId("idParentEquipmentTable");
            if (oEquipmentTable) {
                oEquipmentTable.removeSelections(true);
            }

            var oFlocTable = this.byId("idParentFunctionalLocationTable");
            if (oFlocTable) {
                oFlocTable.removeSelections(true);
            }
            if (this._oCopyParentFieldsDialog) {
                this._oCopyParentFieldsDialog.close();
            }
        },
        /**
         * Function to select component type dropdown
         * @param {Object} oReturn 
         */
        fnSelectComponentTypeDropdown:function(oReturn){

            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var aAllComponentType=[]
            var mEquipment=this.getView().getModel("mEquipment");
            var catalogBasedCTinXom=mEquipment.getProperty("/metadata/featureFlag/catalogBasedCTinXom");       
            var oParentInfo  = mEquipmentList.getProperty("/data/parentAllFields")
            if (catalogBasedCTinXom == "1") {
                if (oReturn.parentAssetType === "EQUI") {
                    aAllComponentType = mEquipment.getProperty("/data/aAllComponentType")
                } else {
                    aAllComponentType = mEquipment.getProperty("/data/aAllComponentTypeForFloc")
                }
            }else{
                aAllComponentType=mEquipment.getProperty("/data/aAllComponentType")
            }
            
           
            var selectedComponentType=[];
            mEquipmentList.setProperty("/data/componentTypes",[]);
            mEquipmentList.setProperty("/data/createNewEquipment/componentType","")
            if ( catalogBasedCTinXom === "0" || (catalogBasedCTinXom == "1" && oReturn.parentAssetType !== "FLOC")) {
                if (aAllComponentType && aAllComponentType.length) {
                    aAllComponentType.forEach(function (oItem) {
                        if (catalogBasedCTinXom === "0") {
                            if (oItem["Parent Asset Object Type"] === oReturn.objectType) {
                                selectedComponentType.push(oItem);
                            }
                        } else {
                            if (oItem["Catalog Profile"] === oParentInfo.catalogProfile) {
                                selectedComponentType.push(oItem);
                            }
                        }

                    })
                    mEquipmentList.setProperty("/data/componentTypes", selectedComponentType);
                } else {
                    mEquipmentList.setProperty("/data/componentTypes", []);
                }

            } else {
                selectedComponentType = aAllComponentType || []
                mEquipmentList.setProperty("/data/componentTypes", selectedComponentType);
            }
            delete oReturn.parentAssetType

        },

        /**
         * Function that triggers on click of confirm of parent asset details and it sets parent asset input value
         */
        onParentAssetValueHelpDialogConfirm: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            var oSelectedParentAsset = oModel.getProperty("/data/createNewEquipment/oParentAsset");
            var oParentInput = sap.ui.getCore().byId("parentInput");
            oParentInput.setValue(oSelectedParentAsset.name);
            this.onParentAssetValueHelpDialogClose();
        },

        /**
         * Function to close parent asset dialog
         */
        onParentAssetValueHelpDialogClose: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            oModel.setProperty("/data/createNewEquipment/isConfirmEnabled", false);
            if (this._oDialogAssignParent) {
                var oEquipmentTable = this.byId("idParentEquipmentTable");
                var oFunctionalLocationTable = this.byId("idParentFunctionalLocationTable");
                var sParentAssetEquiSearch =this.byId("sParentAssetEquiSearch");
                if (sParentAssetEquiSearch) {
                    sParentAssetEquiSearch.setValue("");
                    sParentAssetEquiSearch.fireSearch();
                }
                var sParentAssetFlocSearch = this.byId("sParentAssetFlocSearch");
                if (sParentAssetFlocSearch) {
                    sParentAssetFlocSearch.setValue("");
                    sParentAssetFlocSearch.fireSearch();
                }
                oEquipmentTable.removeSelections();
                oFunctionalLocationTable.removeSelections();
                oEquipmentTable.setVisible(true);
                oFunctionalLocationTable.setVisible(false);
                this._oDialogAssignParent.close();
            }
        },

        /**
         * Adaptive Filter Equipment Name ValueHelp dialog Open and Set Value
         */
        handleEquipmentValueHelp: function (controlID) {
            var that = this;
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
                    var aNewTokens = [];
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
                        aNewTokens.push(token);
                    });
                    that.fnFireMultiInputTokenUpdateManually(controlID, [], [], aNewTokens);
                }
            };

            this.technicalObjectValueHelp.handleEquipmentValueHelp(fnComplete, true);

        },

        /**
         * Adaptive Filter Equipment Name ValueHelp dialog Open and Set Value
         */
        handleSupeordianteEquipmentValueHelp: function () {
            var that = this;
            var oInput = this.getView().byId("idSuperOrdinateEquipmentInputFilter");

            /**
             * 
             * @param {Array} oReturn - Return the Selected value
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    var aData = [];
                    var aNewTokens= [];
                    oReturn.selected.forEach(function (oItem) {
                        aData.push(oItem.name);
                    });

                    aData.forEach(function (value) {
                        var token = new sap.m.Token({
                            text: value
                        });
                        oInput.addToken(token);
                        aNewTokens.push(token);
                    });
                    that.fnFireMultiInputTokenUpdateManually("idSuperOrdinateEquipmentInputFilter", [], [], aNewTokens);
                }
            };

            this.technicalObjectValueHelp.handleEquipmentValueHelp(fnComplete, true);

        },

        /**
         * Adaptive Filter Functional Location Name ValueHelp dialog Open and Set Value
         */
        handleFunctionalLocationValueHelp: function (controlID) {
            var that = this;
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
                    var aNewTokens = [];
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
                        aNewTokens.push(token);
                    });
                    that.fnFireMultiInputTokenUpdateManually(controlID, [], [], aNewTokens);
                }
            };

            this.technicalObjectValueHelp.handleFunctionalLocationValueHelp(fnComplete, true);

        },



        /**
         * Function to open dialog to create advanced filter
         */
        onPressAdvancedFilters: function () {
            if (!this.oAdvancedFilter) {
                this.oAdvancedFilter = sap.ui.xmlfragment("idAdvancedFilter", "com.asint.ais.mi.equipment.view.fragment.AdvancedFiltersList", this);
            }
            this.getView().addDependent(this.oAdvancedFilter);
            this.oAdvancedFilter.open();
        },

        /**
         * Function to fetch advanced filters
         */
        fnFetchAdvancedFiltersBasedonUser: function (isOpenDialog) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var sEmail = this.getLoggedInUserMail();
            if (!sEmail) {
                sEmail = "sarath.merangi@asint.net";
            }
            this.dataSource.getAdvancedFilters(sEmail, "EQUI", function (oData) {
                var aFilters = oData.value;
                oModel.setProperty("/data/AdvancedFilters/tableHeader", that._oi18n.getText("asint.equipment.advancedFilters.table.title.text", [aFilters.length]));
                if (aFilters.length > 0) {
                    aFilters.push({
                        "ID": null,
                        "name": null
                    });
                    oModel.setProperty("/data/AdvancedFilters/isCreateBtnVisible", false);
                    oModel.setProperty("/data/AdvancedFilters/filtersList", aFilters);
                    if (isOpenDialog === true) {
                        that.onPressAdvancedFilters();
                    }
                } else {
                    oModel.setProperty("/data/AdvancedFilters/isCreateBtnVisible", true);
                }
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message04"), errorDetail);
                that._oLogger.error("An Error Occurred In getAdvancedFilters :", JSON.stringify(oError));
            });
        },

        /**
         * Function to handle advanced filters search
         * @param {Object} oEvent 
         */
        fnSearchAdvancedFiltersList: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentList");
            var oTable = sap.ui.core.Fragment.byId("idAdvancedFilter", "idAdvancedFiltersList");
            var sQuery = oEvent.getSource().getValue();

            if (sQuery) {
                var aFilters = [
                    new Filter("name", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }

            var iFilteredItemsLength = oTable.getBinding("items").getLength();
            oModel.setProperty("/data/AdvancedFilters/tableHeader", this._oi18n.getText("asint.equipment.advancedFilters.table.title.text", [iFilteredItemsLength]));
        },

        /**
         * Function to close advanced filter dialog
         */
        onCloseAdvancedFilter: function () {
            var oModel = this.getView().getModel("mEquipmentList"),
                oTable = sap.ui.core.Fragment.byId("idAdvancedFilter", "idAdvancedFiltersList");

            if (this.oAdvancedFilter) {
                oModel.setProperty("/data/AdvancedFilters/selectedFilters", []);
                oTable.removeSelections();
                this.oAdvancedFilter.close();
            }
        },

        /**
         * Function to open dialog to create advanced filter
         */
        onPressCreateAdvancedFilter: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            if (!this.oCreateAdvancedFilter) {
                this.oCreateAdvancedFilter = sap.ui.xmlfragment("idCreateAdvancedFilter", "com.asint.ais.mi.equipment.view.fragment.CreateAdvancedFilter", this);
            }
            this.getView().addDependent(this.oCreateAdvancedFilter);
            oModel.setProperty("/data/AdvancedFilters/dialogHeader", that._oi18n.getText("asint.equipment.advancedFilters.createFilter.text"));
            oModel.setProperty("/data/AdvancedFilters/CalcBuilder/Expression", "");
            oModel.setProperty("/data/AdvancedFilters/CalcBuilder/FilterName", "");
            oModel.setProperty("/data/AdvancedFilters/showExpression/currentId", "");
            oModel.setProperty("/data/AdvancedFilters/ObjectTemplatesData",[]);
            oModel.setProperty("/data/AdvancedFilters/ClassesData",[]);
            oModel.setProperty("/data/AdvancedFilters/Chars/selectedChars",[]);
            oModel.setProperty("/data/AdvancedFilters/selectedObjectTemplates", []);
            oModel.setProperty("/data/AdvancedFilters/Classes/selectedClasses", []);
            oModel.setProperty("/data/AdvancedFilters/Classes/classList", []);
            oModel.setProperty("/data/AdvancedFilters/Classes/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [0]));
            oModel.setProperty("/data/AdvancedFilters/Chars/charsList", []);
            oModel.setProperty("/data/AdvancedFilters/Chars/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [0]));
            oModel.setProperty("/data/AdvancedFilters/characteristicIsS4Toggle", true);
            var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterObjTemp");
            var oClsMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterClass");
            var oCharMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterCharacteristic");
            oMultiInput.removeAllTokens();
            oClsMultiInput.removeAllTokens();
            oCharMultiInput.removeAllTokens();

            var oClsMultiInputS4 = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterClassS4");
            var oCharMultiInputS4 = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterCharacteristicS4");
            oClsMultiInputS4.removeAllTokens();
            oCharMultiInputS4.removeAllTokens();
            this.oCreateAdvancedFilter.open();
        },

        /**
         * Function to fetch equipment model metadata to use in Advanced filters
         */
        fnFetchEquipmentMetadata: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aVariables = oModel.getProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables");
            var keyToFormat={"abcIndicator":"Criticality","masterDataAttribution":"Equipment MDA"}
            this.dataSource.getFirstEquipmentForMetadata(function (oData) {
                var oSelEqu = oData.value[0];
                var aFinalProperties = [];
                var aKeys = Object.keys(oSelEqu);
                var aKeysExclude = ["@etag", "ID", "eTag", "createdAt", "createdBy", "modifiedAt", "modifiedBy", "deleted",
                    "parent_equipment_ID", "parent_functional_location_ID", "srcId", "to_external_system_ID"];
                /**
                 * Function to convert camelcase into normal word
                 * @param {String} sText 
                 */
                var fnRetrunFormatted = function (sText) {

                    if (Object.prototype.hasOwnProperty.call(keyToFormat, sText)) {
                        return keyToFormat[sText];
                    }

                    var words = sText.split(/(?=[A-Z])/);
                    words = words.map(function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    });
                    return words.join(" ");
                };
                aKeys.forEach(function (sKey) {
                    if (!aKeysExclude.includes(sKey)) {
                        var sKeyText = fnRetrunFormatted(sKey);
                        var oProp = {
                            "key": "EQ:" + sKey,
                            "text": sKeyText
                        };
                        var aKeysToUpdated = ["Display Id", "Currency", "Name"];
                        if (aKeysToUpdated.includes(sKeyText)) {
                            var sModifiedKeyText = sKeyText + " - Equipment";
                            var oModifiedObject = {
                                "key": "EQ:" + sKey,
                                "text": sModifiedKeyText
                            };
                            aVariables.push(oModifiedObject);
                            aFinalProperties.push(oModifiedObject);
                        }else{
                            aVariables.push(oProp);
                            aFinalProperties.push(oProp);
                        }
                    }
                });
                aFinalProperties.push({
                    "key": "EQ:shortDescription",
                    "text": "Short Description"
                });
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/EquipmentProps", aFinalProperties);
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables", aVariables);
                that.fnFetchClassMetadata();
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getFirstEquipmentForMetadata :", JSON.stringify(oError));
            });
        },

        /**
         * Function to fetch class model metadata to use in Advanced filters
         */
        fnFetchClassMetadata: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aVariables = oModel.getProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables");
            this.dataSource.getFirstClassForMetadata(function (oData) {
                var oSelClass = oData.value[0];
                var aFinalProperties = [];
                var aKeys = Object.keys(oSelClass);
                var aKeysExclude = ["@etag", "ID", "eTag", "createdAt", "createdBy", "modifiedAt", "modifiedBy", "deleted",
                    "objectTemplateId", "section_ID", "srcId", "to_external_system_ID"];
                /**
                 * Function to convert camelcase into normal word
                 * @param {String} sText 
                 */
                var fnRetrunFormatted = function (sText) {
                    var words = sText.split(/(?=[A-Z])/);
                    words = words.map(function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    });
                    return words.join(" ");
                };
                aKeys.forEach(function (sKey) {
                    if (!aKeysExclude.includes(sKey)) {
                        var sKeyText = fnRetrunFormatted(sKey);
                        var oProp = {
                            "key": "CL:" + sKey,
                            "text": sKeyText
                        };
                        var aKeysToUpdated = ["Display Id", "Currency", "Name"];
                        if (aKeysToUpdated.includes(sKeyText)) {
                            var sModifiedKeyText = sKeyText + " - Class";
                            var oModifiedObject = {
                                "key": "CL:" + sKey,
                                "text": sModifiedKeyText
                            };
                            aVariables.push(oModifiedObject);
                            aFinalProperties.push(oModifiedObject);
                        } else{
                            aVariables.push(oProp);
                            aFinalProperties.push(oProp);
                        }
                    }
                });
                aFinalProperties.push({
                    "key": "CL:shortDescription",
                    "text": "Short Description"
                });
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/ClassProps", aFinalProperties);
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables", aVariables);
                that.fnFetchCharacteristicMetadata();
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getFirstClassForMetadata :", JSON.stringify(oError));
            });
        },

        /**
         * Function to fetch characteristic model metadata to use in Advanced filters
         */
        fnFetchCharacteristicMetadata: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aVariables = oModel.getProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables");
            this.dataSource.getFirstCharacteristicForMetadata(function (oData) {
                var oSelChar = oData.value[0];
                var aFinalProperties = [];
                var aKeys = Object.keys(oSelChar);
                var aKeysExclude = ["@etag", "ID", "eTag", "createdAt", "createdBy", "modifiedAt", "modifiedBy", "deleted",
                    "codelist_ID", "srcId", "to_external_system_ID"];
                /**
                 * Function to convert camelcase into normal word
                 * @param {String} sText 
                 */
                var fnRetrunFormatted = function (sText) {
                    var words = sText.split(/(?=[A-Z])/);
                    words = words.map(function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    });
                    return words.join(" ");
                };
                aKeys.forEach(function (sKey) {
                    if (!aKeysExclude.includes(sKey)) {
                        var sKeyText = fnRetrunFormatted(sKey);
                        var oProp = {
                            "key": "CH:" + sKey,
                            "text": sKeyText
                        };
                        var aKeysToUpdated = ["Display Id", "Currency", "Name"];
                        if (aKeysToUpdated.includes(sKeyText)) {
                            var sModifiedText = sKeyText + " - Characteristic";
                            var oModifiedObject = {
                                "key": "CH:" + sKey,
                                "text": sModifiedText
                            };
                            aVariables.push(oModifiedObject);
                            aFinalProperties.push(oModifiedObject);
                        }else{
                            aVariables.push(oProp);
                            aFinalProperties.push(oProp);
                        }
                    }
                });
                aFinalProperties.push({
                    "key": "CH:shortDescription",
                    "text": "Short Description"
                });
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/CharacteristicProps", aFinalProperties);
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/Variable", aVariables);
                oModel.setProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables", aVariables);
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getFirstCharacteristicForMetadata :", JSON.stringify(oError));
            });
        },

        /**
         * Function to close create advanced filter dialog
         */
        onCloseCreateAdvancedFilter: function () {
            if (this.oCreateAdvancedFilter) {
                this.oCreateAdvancedFilter.close();
            }
        },

        /**
         * 
         */
        fnHandleAdvFilterObjTempValueHelp: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/selectedObjectTemplates");
            window._objectType = "EQUI";
            this.objectTemplateValueHelp.handleObjectTemplateValueHelp(function (oReturn) {
                if (oReturn.status === "finished") {
                    if (oReturn.selected.length > 0) {
                        oModel.setProperty("/data/AdvancedFilters/selectedObjectTemplates", oReturn.selected);
                        that.fnFetchSelectedObjectTemplatesData();
                    }
                }
            }, true, aSelected);
        },

        /**
         * Function to fetch selected object templates data
         */
        fnFetchSelectedObjectTemplatesData: function (fnCallBack) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/selectedObjectTemplates");
            var iProgress = 0;
            var aTemplateData = [];
            var aClasses = [];
            var aClassesFinal = [];
            var aUniqueTemps = [];
            /**
             * Local success call back function
             */
            var fnLocalCallback = function () {
                aClasses.forEach(function (oClass) {
                    if (oClass.classes) {
                        aClassesFinal.push(oClass.classes);
                    }
                })
                oModel.setProperty("/data/AdvancedFilters/ObjectTemplatesData", aTemplateData);
                oModel.setProperty("/data/AdvancedFilters/Classes/classList", aClassesFinal);
                oModel.setProperty("/data/AdvancedFilters/Classes/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [aClassesFinal.length]));
                var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterObjTemp");
                if (oMultiInput) {
                    oMultiInput.removeAllTokens();
                    aTemplateData.forEach(function (oTemp) {
                        oMultiInput.addToken(new Token({
                            key: oTemp.ID,
                            text: oTemp.displayId
                        }));
                    });
                }
                if (fnCallBack) {
                    fnCallBack();
                }
            };
            aSelected.forEach(function (oTemp) {
                var isFound = false;
                aUniqueTemps.forEach(function (oUniq) {
                    if (oUniq.ID === oTemp.ID) {
                        isFound = true;
                    }
                });
                if (!isFound) {
                    aUniqueTemps.push(oTemp);
                }
            });
            if(aUniqueTemps.length > 0) {
                aUniqueTemps.forEach(function (oTemplate) {
                    that.dataSource.getObjectTemplatesExpandToClass(oTemplate.ID, function (oData) {
                        aTemplateData.push(oData);
                        if (oData.to_class.length > 0) {
                            aClasses = aClasses.concat(oData.to_class);
                        }
                        iProgress = iProgress + 1;
                        if (iProgress == aUniqueTemps.length) {
                            fnLocalCallback();
                        }
                    }, function (oError) {
                        iProgress = iProgress + 1;
                        if (iProgress == aUniqueTemps.length) {
                            fnLocalCallback();
                        }
                        that._oLogger.error("An Error Occurred In getObjectTemplatesExpandToClass :", JSON.stringify(oError));
                    });
                });
            }else {
                if (fnCallBack) {
                    fnCallBack();
                }
            }
        },

        // /**
        //  * Function to handle class valuehelp
        //  */
        // fnHandleAdvFilterClassValueHelp: function () {
        //     if (!this.oClassValueHelp) {
        //         this.oClassValueHelp = sap.ui.xmlfragment("idClassValueHelpDialog", "com.asint.ais.mi.equipment.view.fragment.AdvFilterClassValueHelp", this);
        //     }
        //     this.getView().addDependent(this.oClassValueHelp);
        //     this.oClassValueHelp.open();
        //     var oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idClassValueHelp");
        //     oTable.removeSelections();
        //     var aItems = oTable.getItems();
        //     var oModel = this.getView().getModel("mEquipmentList");
        //     var aSelected = oModel.getProperty("/data/AdvancedFilters/Classes/selectedClasses");
        //     aItems.forEach(function (oItem) {
        //         var oRowObj = oItem.getBindingContext("mEquipmentList").getObject();
        //         aSelected.forEach(function (oSel) {
        //             if (oSel.ID === oRowObj.ID) {
        //                 oItem.setSelected(true);
        //             }
        //         })
        //     });
        // },

        /**
         * Function to close class value help
         */
        onCloseClassValueHelp: function () {
            var oSearch = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idFilterClassValueHelpSearchField");
            var oSearchClassValuhelpS4 = sap.ui.core.Fragment.byId("idClassValueHelpDialogS4", "idAdvFilters4ValueHelpSearchField");
            var oTableS4 = sap.ui.core.Fragment.byId("idClassValueHelpDialogS4", "idClassValueHelp");
            var oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idClassValueHelp");
            if (this.oClassValueHelp) {
                if(oSearch) {
                    oSearch.setValue("");
                    oTable.getBinding("items").filter([]);
                }
                this.oClassValueHelp.close();
            }
            if(this.oClassValueHelps4){
                if(oSearchClassValuhelpS4) {
                    oSearchClassValuhelpS4.setValue("");
                    oTableS4.getBinding("items").filter([]);
                }
                this.oClassValueHelps4.close();
            }
        },

        /**
         * Function to hanlde selection change for classes assign table
         * @param {Object} oEvent 
         */
        onSelectClassesForAssign: function () {
            var oModel = this.getView().getModel("mEquipmentList")
            var sCharType = oModel.getProperty("/data/AdvancedFilters/characteristicIsS4");
            var oTable="";
            var oBindedModel=""
            if(sCharType===false){
                oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idClassValueHelp");
                oBindedModel= "mEquipmentList"
            }else if(sCharType===true){
                oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialogS4", "idClassValueHelp");
                oBindedModel="masterService"
            }

            var aSelected = oTable.getSelectedItems();
            if (aSelected.length > 0) {
                oModel.setProperty("/data/AdvancedFilters/Classes/isOkEnabled", true);
            } else {
                oModel.setProperty("/data/AdvancedFilters/Classes/isOkEnabled", false);
            }
            var aSelectedClasses = [];
            aSelected.forEach(function (temp) {
                var selObj = temp.getBindingContext(oBindedModel).getObject();
                aSelectedClasses.push(selObj);
            });
            oModel.setProperty("/data/AdvancedFilters/Classes/selectedClasses", aSelectedClasses);
        },

        /**
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchClassesAssignDialog: function (oEvent) {
            var mEquipmentDetail = this.getView().getModel("mEquipmentList");
            var oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idClassValueHelp");
            var sQuery = oEvent.getSource().getValue();
            if (sQuery) {
                var aFilters = [
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("classNumber", FilterOperator.Contains, sQuery),
                    new Filter("to_description/0/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("srcId", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }
            var filteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/AdvancedFilters/Classes/tableHeader", this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [filteredItemsLength]));
        },

        /**
         * Function to fetch select classes data
         */
        // onConfirmClassSelection: function (_oEvent, fnCallBack) {
        //     var that = this;
        //     var oModel = this.getView().getModel("mEquipmentList");
        //     var sCharType = oModel.getProperty("/data/AdvancedFilters/characteristicIsS4");
        //     var aTotalChars = [];
        //     var aClassWithChars = [];
        //     var iProgress = 0;

        //     var aSelected = [];
        //     if(sCharType===false){
        //         var oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idClassValueHelp");
        //     }else if(sCharType===true){
        //         var oTable = sap.ui.core.Fragment.byId("idClassValueHelps4", "idClassValueHelps4");
        //     }
        //     if(oTable){
        //         var aSelectedItems = oTable.getSelectedItems();
        //         aSelectedItems.forEach(function (temp) {
        //             var selObj = temp.getBindingContext("mEquipmentList").getObject();
        //             aSelected.push(selObj);
        //         });
        //     }else{
        //         aSelected = oModel.getProperty("/data/AdvancedFilters/Classes/selectedClasses");
        //     }
        //     /**
        //      * Local success callback function
        //      */
        //     var fnLocalSuccess = function () {
        //         var aFinalChars = [];
        //         aTotalChars.forEach(function (oChar) {
        //             if (oChar.characteristic) {
        //                 aFinalChars.push(oChar.characteristic);
        //             }
        //         });
        //         var aObjTemplateData = oModel.getProperty("/data/AdvancedFilters/ObjectTemplatesData");
        //         aClassWithChars.forEach(function (oClass) {
        //             var aChars = oClass.to_characteristic;
        //             aObjTemplateData.forEach(function (oTemp) {
        //                 if (oTemp.to_class.length > 0) {
        //                     oTemp.to_class.forEach(function (objClass) {
        //                         if (objClass.classes_ID == oClass.ID) {
        //                             // eslint-disable-next-line camelcase
        //                             objClass.classes.to_characteristic = aChars;
        //                         }
        //                     })
        //                 }
        //             });
        //         });
        //         oModel.setProperty("/data/AdvancedFilters/ClassesData", aClassWithChars);
        //         oModel.setProperty("/data/AdvancedFilters/Chars/charsList", aFinalChars);
        //         oModel.setProperty("/data/AdvancedFilters/Chars/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [aFinalChars.length]));
        //         oModel.setProperty("/data/AdvancedFilters/ObjectTemplatesData", aObjTemplateData);
        //         var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterClass");
        //         if (oMultiInput) {
        //             oMultiInput.removeAllTokens();
        //             aClassWithChars.forEach(function (oTemp) {
        //                 oMultiInput.addToken(new Token({
        //                     key: oTemp.ID,
        //                     text: oTemp.displayId
        //                 }));
        //             });
        //         }
        //         if (fnCallBack) {
        //             var aSelChars = oModel.getProperty("/data/AdvancedFilters/Chars/selectedChars");
        //             var aCharsNewData = [];
        //             aFinalChars.forEach(function (oChar) {
        //                 aSelChars.forEach(function (oSel) {
        //                     if (oChar.ID == oSel.ID) {
        //                         aCharsNewData.push(oChar);
        //                     }
        //                 })
        //             });
        //             oModel.setProperty("/data/AdvancedFilters/Chars/selectedChars", aCharsNewData);
        //             fnCallBack();
        //         } else {
        //             that.onCloseClassValueHelp();
        //         }
        //     }
        //     if(aSelected.length > 0) {
        //         aSelected.forEach(function (oClass) {
        //             that.dataSource.getCharacteristicsByClassId(oClass.ID, function (oData) {
        //                 var aChars = oData.to_characteristic;
        //                 aTotalChars = aTotalChars.concat(aChars);
        //                 aClassWithChars.push(oData);
        //                 iProgress = iProgress + 1;
        //                 if (iProgress == aSelected.length) {
        //                     fnLocalSuccess();
        //                 }
        //             }, function (oError) {
        //                 iProgress = iProgress + 1;
        //                 if (iProgress == aSelected.length) {
        //                     fnLocalSuccess();
        //                 }
        //                 that._oLogger.error("An Error Occurred In getCharacteristicsByClassId :", JSON.stringify(oError));
        //             })
        //         });
        //     }else {
        //         if (fnCallBack) {
        //             fnCallBack();
        //         }
        //     }
        // },

        /**
         * Function to handle characteristic valuehelp
         */
        fnHandleAdvFilterCharValueHelp: function () {
            if (!this.oCharValueHelp) {
                this.oCharValueHelp = sap.ui.xmlfragment("idCharValueHelpDialog", "com.asint.ais.mi.equipment.view.fragment.AdvFilterCharValueHelp", this);
            }
            this.getView().addDependent(this.oCharValueHelp);
            this.oCharValueHelp.open();
            var oTable = sap.ui.core.Fragment.byId("idCharValueHelpDialog", "idCharValueHelp");
            oTable.removeSelections();
            var aItems = oTable.getItems();
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/Chars/selectedChars");
            aItems.forEach(function (oItem) {
                var oRowObj = oItem.getBindingContext("mEquipmentList").getObject();
                aSelected.forEach(function (oSel) {
                    if (oSel.ID === oRowObj.ID) {
                        oItem.setSelected(true);
                    }
                })
            });
        },

        /**
         * Function to close class value help
         */
        onCloseCharValueHelp: function () {
            var that=this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            if (this.oCharValueHelp) {
                var oSearch = sap.ui.core.Fragment.byId("idCharValueHelpDialog", "charSearchField");
                var oTable = sap.ui.core.Fragment.byId("idCharValueHelpDialog", "idCharValueHelp");
                if (oSearch) {
                    oSearch.setValue("");
                    oTable.getBinding("items").filter([]);
                    var filteredItemsLength = oTable.getBinding("items").getLength();
                    mEquipmentList.setProperty("/data/AdvancedFilters/Chars/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [filteredItemsLength]));

                }
                this.oCharValueHelp.close();
            }
        },

        /**
         * Function to hanlde selection change for classes assign table
         * @param {Object} oEvent 
         */
        onSelectCharacteristics: function () {
            var oModel = this.getView().getModel("mEquipmentList"),
                oTable = sap.ui.core.Fragment.byId("idCharValueHelpDialog", "idCharValueHelp");

            var aSelected = oTable.getSelectedItems();
            if (aSelected.length > 0) {
                oModel.setProperty("/data/AdvancedFilters/Chars/isOkEnabled", true);
            } else {
                oModel.setProperty("/data/AdvancedFilters/Chars/isOkEnabled", false);
            }
            var aSelectedClasses = [];
            aSelected.forEach(function (temp) {
                var selObj = temp.getBindingContext("mEquipmentList").getObject();
                aSelectedClasses.push(selObj);
            });
            oModel.setProperty("/data/AdvancedFilters/Chars/selectedChars", aSelectedClasses);
        },

        /**
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchCharsValueHelp: function (oEvent) {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var oTable = sap.ui.core.Fragment.byId("idCharValueHelpDialog", "idCharValueHelp");
            var sQuery = oEvent.getSource().getValue();
            if (sQuery) {
                var aFilters = [
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("to_description/0/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("srcId", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }
            var filteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentList.setProperty("/data/AdvancedFilters/Chars/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [filteredItemsLength]));
        },

        /**
         * Function to handle characteristic valuehelp confirm
         */
        onConfirmCharacetristicSelection: function (_oEvent, fnCallBack) {
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var sCharType = mEquipmentList.getProperty("/data/AdvancedFilters/characteristicIsS4");
            // var aSelectedChars = mEquipmentList.getProperty("/data/AdvancedFilters/Chars/selectedChars");
            var aSelectedChars = [];
            var characteristicMultinputID= sCharType ? "idAdvFilterCharacteristicS4" : "idAdvFilterCharacteristic";
            var oTable = sap.ui.core.Fragment.byId("idCharValueHelpDialog", "idCharValueHelp");
            if(oTable){
                var aSelected = oTable.getSelectedItems();
                aSelected.forEach(function (temp) {
                    var selObj = temp.getBindingContext("mEquipmentList").getObject();
                    aSelectedChars.push(selObj);
                });
            }else{
                aSelectedChars = mEquipmentList.getProperty("/data/AdvancedFilters/Chars/selectedChars");
            }

            var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", characteristicMultinputID);
            if (oMultiInput) {
                oMultiInput.removeAllTokens();
                aSelectedChars.forEach(function (oTemp) {
                    oMultiInput.addToken(new Token({
                        key: oTemp.ID,
                        text: oTemp.displayId
                    }));
                });
            }
            this.fnBuildDataForExpressionBuilder();
            if (fnCallBack) {
                fnCallBack();
            } else {
                this.onCloseCharValueHelp();
            }
        },

        /**
         * Function to handle characteristic valuehelp confirm
         */
        fnBuildDataForExpressionBuilder: function () {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var aSelectedChars = mEquipmentList.getProperty("/data/AdvancedFilters/Chars/selectedChars");
            var aObjTemplateData = mEquipmentList.getProperty("/data/AdvancedFilters/ObjectTemplatesData");
            var aClassesData = mEquipmentList.getProperty("/data/AdvancedFilters/ClassesData") || [];
            var isCharS4=mEquipmentList.getProperty("/data/AdvancedFilters/characteristicIsS4");

            var aCharsIds = [];
            var treeTableData = [];
            var variableData = [];
            var aMetaDataVariables = mEquipmentList.getProperty("/data/AdvancedFilters/CalcBuilder/metaDataVariables");
            aSelectedChars.forEach(function (oChar) {
                aCharsIds.push(oChar.ID);
            });
            if(isCharS4===false){
                aObjTemplateData.forEach(function (oTemp) {
                    var sTempDesc = "";
                    sTempDesc = oTemp.name;
                    var oObjTemp = {
                        "key": oTemp.ID,
                        "text": sTempDesc,
                        "nodes": []
                    };
                    var aClass = oTemp.to_class;
                    if (aClass && aClass.length > 0) {
                        aClass.forEach(function (oClass) {
                            var objClass = oClass.classes;
                            if (objClass) {
                                var sClassDesc = "";
                                if (objClass.to_description && objClass.to_description.length > 0) {
                                    sClassDesc = objClass.to_description[0].shortDescription;
                                }
                                var sClassId = "CL:" + oTemp.ID + "_" + objClass.ID;
                                var oClassParent = {
                                    "key": sClassId,
                                    "text": sClassDesc,
                                    "nodes": []
                                };
                                var aClassChars = objClass.to_characteristic;
                                if (aClassChars && aClassChars.length > 0) {
                                    aClassChars.forEach(function (oClassChar) {
                                        var oChar = oClassChar.characteristic;
                                        if (oChar && aCharsIds.includes(oChar.ID)) {
                                            var sCharDesc = "";
                                            if (oChar.to_description && oChar.to_description.length > 0) {
                                                sCharDesc = oChar.to_description[0].shortDescription;
                                            }
                                            var sId = "EX:" + oTemp.ID + "_" + objClass.ID + "_" + oChar.ID;
                                            var oCharObj = {
                                                "key": sId,
                                                "text": sCharDesc,
                                            };
                                            oClassParent.nodes.push(oCharObj);
                                            variableData.push(oCharObj);
                                        }
                                    })
                                }
                                oObjTemp.nodes.push(oClassParent);
                            }
                        });
                    }
                    treeTableData.push(oObjTemp);
                });
            }else if(isCharS4===true){
                aClassesData.forEach(function (oClassData) {
                    var sClassDesc = "";
                    if (oClassData.to_description && oClassData.to_description.length > 0) {
                        sClassDesc = oClassData.to_description[0].shortDescription;
                    }

                    var oClassNode = {
                        key: "CL:" + oClassData.ID,
                        text: oClassData.displayId + " - " + sClassDesc,
                        nodes: []
                    };

                    var aChars = oClassData.to_characteristic || [];
                    aChars.forEach(function (oClassChar) {
                        var oChar = oClassChar.characteristic;
                        if (oChar && aCharsIds.includes(oChar.ID)) {
                            var sCharDesc = "";
                            if (oChar.to_description && oChar.to_description.length > 0) {
                                sCharDesc = oChar.to_description[0].shortDescription;
                            }

                            var oCharNode = {
                                key: "EX:" + oClassData.ID + "_" + oChar.ID,
                                text: sCharDesc
                            };

                            oClassNode.nodes.push(oCharNode);
                            variableData.push(oCharNode);
                        }
                    });

                    treeTableData.push(oClassNode);
                });
            }
            aMetaDataVariables = aMetaDataVariables.concat(variableData);
            mEquipmentList.setProperty("/data/AdvancedFilters/CalcBuilder/TreeData", treeTableData);
            mEquipmentList.setProperty("/data/AdvancedFilters/CalcBuilder/Variable", aMetaDataVariables);
        },

        /**
         * Function to hanlde object template token update
         * @param {Object} oEvent 
         */
        onObjectTempTokenUpdate: function (oEvent) {
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var aSelected = mEquipmentList.getProperty("/data/AdvancedFilters/selectedObjectTemplates");
            var sType = oEvent.getParameter("type");
            var aRemovedIds = [];
            var aFinalSelected = [];
            if (sType == "removed") {
                var aRemoved = oEvent.getParameter("removedTokens");
                if (aRemoved.length > 0) {
                    aRemoved.forEach(function (oToken) {
                        var sId = oToken.getProperty("key");
                        aRemovedIds.push(sId);
                    });
                }
                aSelected.forEach(function (oTemp) {
                    if (!aRemovedIds.includes(oTemp.ID)) {
                        aFinalSelected.push(oTemp);
                    }
                });
                mEquipmentList.setProperty("/data/AdvancedFilters/selectedObjectTemplates", aFinalSelected);
                this.fnFetchSelectedObjectTemplatesData();
            }
        },

        /**
         * Function to handle class multiinput token update
         * @param {Object} oEvent 
         */
        onClassTokenUpdate: function (oEvent) {
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var aSelected = mEquipmentList.getProperty("/data/AdvancedFilters/Classes/selectedClasses");
            var sType = oEvent.getParameter("type");
            var aRemovedIds = [];
            var aFinalSelected = [];
            if (sType == "removed") {
                var aRemoved = oEvent.getParameter("removedTokens");
                if (aRemoved.length > 0) {
                    aRemoved.forEach(function (oToken) {
                        var sId = oToken.getProperty("key");
                        aRemovedIds.push(sId);
                    });
                }
                aSelected.forEach(function (oTemp) {
                    if (!aRemovedIds.includes(oTemp.ID)) {
                        aFinalSelected.push(oTemp);
                    }
                });
                mEquipmentList.setProperty("/data/AdvancedFilters/Classes/selectedClasses", aFinalSelected);
                this.onConfirmClassSelection();
            }
        },

        /**
         * Function to hanlde object template token update
         * @param {Object} oEvent 
         */
        onCharacteristicTokenUpdate: function (oEvent) {
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var aSelected = mEquipmentList.getProperty("/data/AdvancedFilters/Chars/selectedChars");
            var sType = oEvent.getParameter("type");
            var aRemovedIds = [];
            var aFinalSelected = [];
            if (sType == "removed") {
                var aRemoved = oEvent.getParameter("removedTokens");
                if (aRemoved.length > 0) {
                    aRemoved.forEach(function (oToken) {
                        var sId = oToken.getProperty("key");
                        aRemovedIds.push(sId);
                    });
                }
                aSelected.forEach(function (oTemp) {
                    if (!aRemovedIds.includes(oTemp.ID)) {
                        aFinalSelected.push(oTemp);
                    }
                });
                mEquipmentList.setProperty("/data/AdvancedFilters/Chars/selectedChars", aFinalSelected);
                this.fnBuildDataForExpressionBuilder();
            }
        },

        /**
         * Function on og characteristic in tree
         * @param {Object} oEvent 
         */
        onSelectTreeNode: function (oEvent) {
            var oModel=this.getView().getModel("mEquipmentList")
            var sCharType = oModel.getProperty("/data/AdvancedFilters/characteristicIsS4");
            var oItem = oEvent.getSource().getSelectedItem();
            var oCustomData,oCalcBuilder;
            if(sCharType===false){
                if (oItem.getLevel() === 2) {
                    oCustomData = oItem.getCustomData();
                    oCalcBuilder = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idCalculationBuilder");
                    oCalcBuilder.updateOrCreateItem(oCustomData[0].getValue());
                }
            }else if(sCharType===true){
                if (oItem.getLevel() === 1) {
                    oCustomData = oItem.getCustomData();
                    oCalcBuilder = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idCalculationBuilderS4");
                    oCalcBuilder.updateOrCreateItem(oCustomData[0].getValue());
                }
            }
            oEvent.getSource().removeSelections();
        },

        /**
         * Function to handle equipment property selection in expressiob builder
         * @param {Object} oEvent 
         */
        onSelectEquProp: function (oEvent) {
            var oItem = oEvent.getSource().getSelectedItem();
            var oCustomData = oItem.getCustomData();
            var oCalcBuilder = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idCalculationBuilder");
            oCalcBuilder.updateOrCreateItem(oCustomData[0].getValue());
            oEvent.getSource().removeSelections();
        },

        /**
         * Function to create new advanced filter
         */
        onCreateAdvancedFilterConfirm: function () {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var sExpression = mEquipmentList.getProperty("/data/AdvancedFilters/CalcBuilder/Expression");
            var sFilterName = mEquipmentList.getProperty("/data/AdvancedFilters/CalcBuilder/FilterName");
            var aFiltersList = mEquipmentList.getProperty("/data/AdvancedFilters/filtersList");
            var sCharType = mEquipmentList.getProperty("/data/AdvancedFilters/characteristicIsS4");
            var charBuildID=sCharType? "idCalculationBuilderS4" : "idCalculationBuilder";
            var oCalcBuilder = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", charBuildID);
            if (sFilterName && sExpression) {
                var aExpErros = oCalcBuilder.validateParts();
                if (aExpErros.length > 0) {
                    var sErrMsg = that._oi18n.getText("asint.equipment.advFilter.message12");
                    aExpErros.forEach(function (oErr) {
                        sErrMsg = sErrMsg + "\n• " + oErr.title;
                    });
                    return that.fnMessageShow("E", sErrMsg);
                }
                if (that._isEditOpen) {
                    var aSelectedForEdit = mEquipmentList.getProperty("/data/AdvancedFilters/selectedFilters");
                    var oSelObj = aSelectedForEdit[0];
                    var oEditPayload = {
                        "ID": oSelObj.ID,
                        "name": sFilterName,
                        "objectType": "EQUI",
                        "expression": sExpression,
                        "deleted": false
                    }
                    oEditPayload.createdBy = oSelObj.createdBy;
                    oEditPayload.modifiedBy = that.getLoggedInUserMail();
                    that.dataSource.updateAdvancedFilter(oSelObj.ID, oEditPayload, function () {
                        that.onCloseCreateAdvancedFilter();
                        var oTable = sap.ui.core.Fragment.byId("idAdvancedFilter", "idAdvancedFiltersList");
                        oTable.removeSelections();
                        that._isEditOpen = false;
                        that.fnMessageShow("S", that._oi18n.getText("asint.equipment.advFilter.message10"), "", function () {
                            that.fnFetchAdvancedFiltersBasedonUser();
                        });
                    }, function (oError) {
                        var err = JSON.parse(oError.responseText);
                        var errorDetail = "";
                        if (err.error.message) {
                            errorDetail = err.error.message;
                        }
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message11"), errorDetail);
                        that._oLogger.error("An Error Occurred In updateAdvancedFilter :", JSON.stringify(oError));
                    });
                } else {
                    var isDuplicate = false;
                    aFiltersList.forEach(function (oItem) {
                        if (oItem.name === sFilterName) {
                            isDuplicate = true;
                        }
                    });

                    if (isDuplicate) {
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message13"));
                        return; 
                    }
                    var oPayload = {
                        "name": sFilterName,
                        "objectType": "EQUI",
                        "expression": sExpression,
                        "deleted": false
                    };
                    oPayload.createdBy = that.getLoggedInUserMail();
                    oPayload.modifiedBy = that.getLoggedInUserMail();
                    that.dataSource.createAdvancedFilter(oPayload, function () {
                        that.onCloseCreateAdvancedFilter();
                        var isOpenDialog = false;
                        if (aFiltersList.length == 0) {
                            isOpenDialog = true
                        }
                        that.fnMessageShow("S", that._oi18n.getText("asint.equipment.advFilter.message02"), "", function () {
                            that.fnFetchAdvancedFiltersBasedonUser(isOpenDialog);
                        });
                    }, function (oError) {
                        var err = JSON.parse(oError.responseText);
                        var errorDetail = "";
                        if (err.error.message) {
                            errorDetail = err.error.message;
                        }
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message03"), errorDetail);
                        that._oLogger.error("An Error Occurred In createAdvancedFilter :", JSON.stringify(oError));
                    });
                }
            } else {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message01"));
            }
        },

        /**
         * Function to hanlde selection change for classes assign table
         */
        onSelectAdvancedFiltersforAction: function () {
            var oModel = this.getView().getModel("mEquipmentList"),
                oTable = sap.ui.core.Fragment.byId("idAdvancedFilter", "idAdvancedFiltersList");

            var aSelected = oTable.getSelectedItems();
            if (aSelected.length > 0) {
                oModel.setProperty("/data/AdvancedFilters/isDeleteEnabled", true);
                if (aSelected.length == 1) {
                    oModel.setProperty("/data/AdvancedFilters/isEditEnabled", true);
                    oModel.setProperty("/data/AdvancedFilters/isApplyEnabled", true);
                } else {
                    oModel.setProperty("/data/AdvancedFilters/isEditEnabled", false);
                    oModel.setProperty("/data/AdvancedFilters/isApplyEnabled", false);
                }
            } else {
                oModel.setProperty("/data/AdvancedFilters/isApplyEnabled", false);
                oModel.setProperty("/data/AdvancedFilters/isEditEnabled", false);
                oModel.setProperty("/data/AdvancedFilters/isDeleteEnabled", false);
            }
            var aSelectedFilters = [];
            aSelected.forEach(function (temp) {
                var selObj = temp.getBindingContext("mEquipmentList").getObject();
                aSelectedFilters.push(selObj);
            });
            oModel.setProperty("/data/AdvancedFilters/selectedFilters", aSelectedFilters);
        },

        /**
         * Function to edit advanced filters
         */
        onEditAdvancedFilters: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/selectedFilters");
            var oSelected = aSelected[0];
            var sCurrentId = oModel.getProperty("/data/AdvancedFilters/showExpression/currentId");
            var oReturn = this.fnDoSplitandReturnIds(oSelected);
            oModel.setProperty("/data/AdvancedFilters/CalcBuilder/Expression", oSelected.expression);
            oModel.setProperty("/data/AdvancedFilters/CalcBuilder/FilterName", oSelected.name);
            oModel.setProperty("/data/AdvancedFilters/dialogHeader", that._oi18n.getText("asint.equipment.advancedFilters.editFilter.text"));
            this._isEditOpen = true;
            if (sCurrentId && sCurrentId == oSelected.ID) {
                if (!that.oCreateAdvancedFilter) {
                    that.oCreateAdvancedFilter = sap.ui.xmlfragment("idCreateAdvancedFilter", "com.asint.ais.mi.equipment.view.fragment.CreateAdvancedFilter", that);
                }
                this.fnFecthExpressionDetailsForEditorApply(oReturn, function () {
                    that.getView().addDependent(that.oCreateAdvancedFilter);
                    that.oCreateAdvancedFilter.open();
                    that.fnSetTokensForTemplateClassChar();
                });
                that.getView().addDependent(that.oCreateAdvancedFilter);
                that.oCreateAdvancedFilter.open();
            } else {
                if (!that.oCreateAdvancedFilter) {
                    that.oCreateAdvancedFilter = sap.ui.xmlfragment("idCreateAdvancedFilter", "com.asint.ais.mi.equipment.view.fragment.CreateAdvancedFilter", that);
                }
                that.getView().addDependent(that.oCreateAdvancedFilter);
                oModel.setProperty("/data/AdvancedFilters/showExpression/currentId", oSelected.ID);
                if(oReturn.objectTemplateIds.length === 0 && oReturn.classIds.length && oReturn.charIds.length){
                    oModel.setProperty("/data/AdvancedFilters/characteristicIsS4", true);
                    oModel.setProperty("/data/AdvancedFilters/characteristicIsS4Toggle", false);
                }else{
                    oModel.setProperty("/data/AdvancedFilters/characteristicIsS4", false);
                    oModel.setProperty("/data/AdvancedFilters/characteristicIsS4Toggle", false);
                }
                this.fnFecthExpressionDetailsForEditorApply(oReturn, function () {
                    // if (!that.oCreateAdvancedFilter) {
                    //     that.oCreateAdvancedFilter = sap.ui.xmlfragment("idCreateAdvancedFilter", "com.asint.ais.mi.equipment.view.fragment.CreateAdvancedFilter", that);
                    // }
                    that.getView().addDependent(that.oCreateAdvancedFilter);
                    that.oCreateAdvancedFilter.open();
                    that.fnSetTokensForTemplateClassChar();
                });
            }
        },

        /**
         * Function to set tokens for object template value help, class value help and characteristic value help
         */
        fnSetTokensForTemplateClassChar: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterObjTemp");
            var aTemplateData = oModel.getProperty("/data/AdvancedFilters/ObjectTemplatesData");
            if (oMultiInput) {
                oMultiInput.removeAllTokens();
                aTemplateData.forEach(function (oTemp) {
                    oMultiInput.addToken(new Token({
                        key: oTemp.ID,
                        text: oTemp.displayId
                    }));
                });
            }
            var oClsMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterClass");
            var aClassWithChars = oModel.getProperty("/data/AdvancedFilters/ClassesData")
            if (oClsMultiInput) {
                oClsMultiInput.removeAllTokens();
                aClassWithChars.forEach(function (oTemp) {
                    oClsMultiInput.addToken(new Token({
                        key: oTemp.ID,
                        text: oTemp.displayId
                    }));
                });
            }
            var oCharMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterCharacteristic");
            var aSelectedChars = oModel.getProperty("/data/AdvancedFilters/Chars/selectedChars");
            if (oCharMultiInput) {
                oCharMultiInput.removeAllTokens();
                aSelectedChars.forEach(function (oTemp) {
                    oCharMultiInput.addToken(new Token({
                        key: oTemp.ID,
                        text: oTemp.displayId
                    }));
                });
            }
        },

        /**
         * Function to split the expression and extract ids for further use
         * @param {Object} oSelected 
         */
        fnDoSplitandReturnIds: function (oSelected) {
            var sExpression = oSelected.expression;
            var aObjectTemplateIds = [];
            var aClassIds = [];
            var aCharsIds = [];

            var aSplitL1 = sExpression.split(" ");
            if (aSplitL1 && aSplitL1.length > 0) {
                aSplitL1.forEach(function (sSplit1) {
                    if (sSplit1.includes(":")) {
                        var aSplitL2 = sSplit1.split(":");
                        if ((aSplitL2[0] === "EX") ||(aSplitL2[0] == "(EX")) {
                            var sAllId = aSplitL2[1];
                            var aFinalSplit = sAllId.split("_");

                            if (aFinalSplit.length === 3) {
                                aObjectTemplateIds.push(aFinalSplit[0]);
                                aClassIds.push(aFinalSplit[1]);
                                aCharsIds.push(aFinalSplit[2]);
                            } else if (aFinalSplit.length === 2) {
                                aClassIds.push(aFinalSplit[0]);
                                aCharsIds.push(aFinalSplit[1]);
                            }
                        }
                    }
                });
            }

            return {
                "objectTemplateIds": aObjectTemplateIds,
                "classIds": aClassIds,
                "charIds": aCharsIds
            };
        },

        /**
         * Function to open dialog and show expression on click of show expression
         * @param {Object} oEvent 
         */
        onPressShowExpression: function (oEvent) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var oSelected = oEvent.getSource().getBindingContext("mEquipmentList").getObject();
            if (oSelected) {
                oModel.setProperty("/data/AdvancedFilters/showExpression/FilterName", oSelected.name);
                oModel.setProperty("/data/AdvancedFilters/showExpression/Expression", oSelected.expression);
                var sCurrentId = oModel.getProperty("/data/AdvancedFilters/showExpression/currentId");
                if (sCurrentId && sCurrentId == oSelected.ID) {
                    if (!that.oExpressionDetailDialog) {
                        that.oExpressionDetailDialog = sap.ui.xmlfragment("idExpDetailDialog", "com.asint.ais.mi.equipment.view.fragment.DialogExpressionDetail", that);
                    }
                    that.getView().addDependent(that.oExpressionDetailDialog);
                    that.oExpressionDetailDialog.open();
                } else {
                    oModel.setProperty("/data/AdvancedFilters/showExpression/currentId", oSelected.ID);
                    var oReturn = this.fnDoSplitandReturnIds(oSelected);
                    if(oReturn.objectTemplateIds.length === 0 && oReturn.classIds.length && oReturn.charIds.length){
                        oModel.setProperty("/data/AdvancedFilters/characteristicIsS4", true);
                        oModel.setProperty("/data/AdvancedFilters/characteristicIsS4Toggle", false);
                    }else{
                        oModel.setProperty("/data/AdvancedFilters/characteristicIsS4", false);
                        oModel.setProperty("/data/AdvancedFilters/characteristicIsS4Toggle", false);
                    }
                    this.fnFecthExpressionDetailsForEditorApply(oReturn, function () {
                        if (!that.oExpressionDetailDialog) {
                            that.oExpressionDetailDialog = sap.ui.xmlfragment("idExpDetailDialog", "com.asint.ais.mi.equipment.view.fragment.DialogExpressionDetail", that);
                        }
                        that.getView().addDependent(that.oExpressionDetailDialog);
                        that.oExpressionDetailDialog.open();    
                    });
                }
            }
        },

        /**
         * Function to close expression detail dialog
         */
        onCloseShowExpressionDialog: function () {
            if (this.oExpressionDetailDialog) {
                this.oExpressionDetailDialog.close();
            }
        },

        /**
         * Function to fetch expression details
         * @param {Object} oReturn 
         * @param {Function} fnCallback 
         */
        fnFecthExpressionDetailsForEditorApply: function (oReturn, fnCallback) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var isCharS4 =oModel.getProperty("/data/AdvancedFilters/characteristicIsS4");

            var aSelTemps = [];
            var aSelClass = [];
            var aSelChars = [];
            var aTempIds = oReturn.objectTemplateIds;
            var aClassIds = oReturn.classIds;
            var aCharIds = oReturn.charIds;
            if (aTempIds && aTempIds.length > 0) {
                aTempIds.forEach(function (sId) {
                    aSelTemps.push({
                        "ID": sId
                    });
                })
            }
            if (aClassIds && aClassIds.length > 0) {
                aClassIds.forEach(function (sId) {
                    aSelClass.push({
                        "ID": sId
                    });
                })
            }
            if (aCharIds && aCharIds.length > 0) {
                aCharIds.forEach(function (sId) {
                    aSelChars.push({
                        "ID": sId
                    });
                })
            }
            oModel.setProperty("/data/AdvancedFilters/selectedObjectTemplates", aSelTemps);
            oModel.setProperty("/data/AdvancedFilters/Classes/selectedClasses", aSelClass);
            oModel.setProperty("/data/AdvancedFilters/Chars/selectedChars", aSelChars);
            that.fnFetchSelectedObjectTemplatesData(function () {
                that.onConfirmClassSelection({}, function () {
                    that.onConfirmCharacetristicSelection({}, function () {
                        if (fnCallback) {
                            fnCallback();
                        }
                    });
                })
            });
        },

        /**
         * Function to apply advanced filters
         */
        onPressApllyAdvancedFilters: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/selectedFilters");
            var oSelObj = aSelected[0];
            var oAdvFilterItem = this.getView().byId("idAdvancedFilterItem");
            var oComobBox = this.getView().byId("idAdvancedFilterControl");
            var oFilterBar = this.getView().byId("idDynamicPagefilterbar");
            this.onCloseAdvancedFilter();
            oAdvFilterItem.setVisibleInFilterBar(true);
            oComobBox.setSelectedKey(oSelObj.ID);
            // oFilterBar.fireSearch();
        },

        /**
         * Function to delete selected filters
         */
        onDeleteAdvancedFilters: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/selectedFilters");
            if (aSelected.length > 0) {
                MessageBox.confirm(that._oi18n.getText("asint.equipment.advFilter.message05"), {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.NO,
                    /**
                     * Function to close the dialog
                     * @param {String} sAction 
                     */
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.YES) {
                            that.fnImplementDeleteFilters();
                        }
                    }
                });
            } else {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message06"));
            }
        },

        /**
         * Function to prepare payload and make api call to delete
         */
        fnImplementDeleteFilters: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var aSelected = oModel.getProperty("/data/AdvancedFilters/selectedFilters");
            var iProgress = 0;
            var iError = 0;
            var oTable = sap.ui.core.Fragment.byId("idAdvancedFilter", "idAdvancedFiltersList");
            /**
             * Local success call back
             */
            var fnSuccessCallBack = function () {
                if (iError > 0) {
                    if (iError == iProgress) {
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message08"));
                    } else {
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.advFilter.message09"));
                        oTable.removeSelections();
                        oModel.setProperty("/data/AdvancedFilters/isApplyEnabled", false);
                        oModel.setProperty("/data/AdvancedFilters/isEditEnabled", false);
                        oModel.setProperty("/data/AdvancedFilters/isDeleteEnabled", false);
                        that.fnFetchAdvancedFiltersBasedonUser();
                    }
                } else {
                    that.fnMessageShow("S", that._oi18n.getText("asint.equipment.advFilter.message07"));
                    oTable.removeSelections();
                    oModel.setProperty("/data/AdvancedFilters/isApplyEnabled", false);
                    oModel.setProperty("/data/AdvancedFilters/isEditEnabled", false);
                    oModel.setProperty("/data/AdvancedFilters/isDeleteEnabled", false);
                    that.fnFetchAdvancedFiltersBasedonUser();
                }
            };

            aSelected.forEach(function (oFilter) {
                var oPayload = {
                    ID: oFilter.ID,
                    deleted: true
                };
                that.dataSource.updateAdvancedFilter(oFilter.ID, oPayload, function () {
                    iProgress = iProgress + 1;
                    if (iProgress == aSelected.length) {
                        fnSuccessCallBack();
                    }
                }, function (oError) {
                    iError = iError = 1;
                    iProgress = iProgress + 1;
                    if (iProgress == aSelected.length) {
                        fnSuccessCallBack();
                    }
                    that._oLogger.error("An Error Occurred In updateAdvancedFilter :", JSON.stringify(oError));
                });
            });
        },

        /**
         * Function to navigate to object detail page
         * @param {Object} oEvent 
         */
        onNodeNavigate: function (oEvent) {
            var that = this;
            var sId = oEvent.getSource().getParent().getProperty("key");
            var sIcon = oEvent.getSource().getParent().getProperty("icon");
            if (sIcon.includes("machine")) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("nEquipmentDetail", {
                    "equipmentId": sId
                });
            } else {
                var sHashWithKeyword = this.NAVIGATION.LOCATION_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{functionallocationId}", sId);
                var newUrl = that.setNavUrl(window, sHashWithKeyword);
                window.open(newUrl, "_blank");
                // that.navigate(that.NAVIGATION.LOCATION_DETAIL, {
                //     "functionallocationId": sId
                // });
            }
        },

        /**
         * Function to open value help
         * @param {Object} oEvent 
         * @param {String} sObjectType 
         */
        openValueHelp: function (oEvent, sObjectType, sMode) {
            this.openValueHelpDialog(oEvent, sObjectType, sMode);
        },

        /**
         * To fetch Parent Equipment Information
         * @param {string} sParentEquipmentId 
         * @param {Object} oPayload 
         */
        fnGetParentEquipmentInfo: function (sParentEquipmentId, oPayload) {
            var that = this;
            this.dataSource.fnGetParentEquipmentInfo(sParentEquipmentId, function (oData) {
                // eslint-disable-next-line camelcase
                oPayload.parent_functional_location_ID = oData.parent_functional_location_ID;
                oPayload.systemStatus = oData.systemStatus;
                oPayload.userStatus = oData.userStatus;
                that.fnCreateEquipment(oPayload);
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message04"), errorDetail);
            })
        },

        /**
         * To fetch Parent Floc Information
         * @param {string} sParentFlocId 
         * @param {Object} oPayload 
         */
        fnGetParentFlocInfo: function (sParentFlocId, oPayload) {
            var that = this;
            this.dataSource.fnGetParentFlocInfo(sParentFlocId, function () {
                that.fnCreateEquipment(oPayload);
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message04"), errorDetail);
            })
        },



        /**
         * Function that opens the analytics filter dialg
         */
        onAnalyticsFilterPress: function () {
            if (!this._analyticsApplyFiltersDialog) {
                Fragment.load({
                    name: "com.asint.ais.mi.equipment.view.fragment.AnalyticFilters",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._analyticsApplyFiltersDialog = oDialog;
                    this._analyticsApplyFiltersDialog.open();

                }.bind(this));
            } else {
                this._analyticsApplyFiltersDialog.open();
            }
        },

        /**
         * Function to close filter dialog
         */
        onAnalyticsFilterClose: function () {
            if (this._analyticsApplyFiltersDialog) {
                this._analyticsApplyFiltersDialog.close();
            }
            this.getView().getModel("mEquipmentList").setProperty("/data/analytics/applyFilter", false);
        },

        /**
         * Function to hanlde object template token update
         * @param {Object} oEvent 
         */
        onAnalyticsFilterTokenUpdate: function (oEvent, filterName) {
            var sType = oEvent.getParameter("type");
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var aTokens = [];
            if (filterName !== "equipment" && filterName !== "functionalLoc") {
                aTokens = mEquipmentList.getProperty("/data/analytics/" + filterName);
            } else {
                var tokens = oEvent.getSource().getTokens();
                tokens.forEach(function (item) {
                    aTokens.push({
                        key: item.getKey(),
                        text: item.getText()
                    })
                })
            }
            var aRemovedTokens = [];
            var aFinalSelected = [];
            if (sType == "removed") {
                var aRemoved = oEvent.getParameter("removedTokens");
                if (aRemoved.length > 0) {
                    aRemoved.forEach(function (oToken) {
                        var sId = oToken.getProperty("text");
                        aRemovedTokens.push(sId);
                    });
                }
                aTokens.forEach(function (oTemp) {
                    if (!aRemovedTokens.includes(oTemp.text)) {
                        aFinalSelected.push(oTemp);
                    }
                });
                mEquipmentList.setProperty("/data/analytics/" + filterName, aFinalSelected);
            }
        },

        /**
         * Function that trigress on heat map selection change
         * @param {Object} oEvent 
         */
        onHeatMapSelectionChange: function (oEvent) {
            var that = this;
            var mEquipmentList = that.getView().getModel("mEquipmentList");
            var assessmentData = mEquipmentList.getProperty("/data/riskSummaryData");
            var heatMapData = mEquipmentList.getProperty("/data/heatMap");
            var aVizSelection = oEvent.getSource().vizSelection();
            var aVizSelectionData = [], popData = [];
            heatMapData.forEach(function (heatMapObj) {
                aVizSelection.forEach(function (oGraph) {
                    if (oGraph.data.Category === heatMapObj.expandedCategory && oGraph.data.Riskvalue === heatMapObj.riskValue) {
                        aVizSelectionData.push(...heatMapObj.objectId);
                    }
                })
            });
            aVizSelectionData.forEach(function (item) {
                popData.push(assessmentData[item])
            });
            mEquipmentList.setProperty("/data/analytics/popupData", popData);
            mEquipmentList.setProperty("/data/analytics/popupDataHeader", this._oi18n.getText("asint.equipment.list.analytics.popup.table.title.text", [popData.length]));
        },

        /**
         * Function that trigress on donut map selection change
         * @param {Object} oEvent 
         */
        onDonutSelectionChange: function (oEvent) {
            var that = this;
            var mEquipmentList = that.getView().getModel("mEquipmentList");
            var assessmentData = mEquipmentList.getProperty("/data/riskSummaryData");
            var donutMap = mEquipmentList.getProperty("/data/donut");
            var aVizSelection = oEvent.getSource().vizSelection();
            var aVizSelectionData = [], popData = [];
            donutMap.forEach(function (donutMapObj) {
                aVizSelection.forEach(function (oGraph) {
                    if (oGraph.data.code === donutMapObj.code) {
                        aVizSelectionData.push(...donutMapObj.objectId);
                    }
                })
            });
            aVizSelectionData.forEach(function (item) {
                popData.push(assessmentData[item])
            });
            mEquipmentList.setProperty("/data/analytics/popupData", popData);
            mEquipmentList.setProperty("/data/analytics/popupDataHeader", this._oi18n.getText("asint.equipment.list.analytics.popup.table.title.text", [popData.length]));
        },

        /**
         * Function that trigress on stacked map selection change
         * @param {Object} oEvent 
         */
        onStackedColumnSelectionChange: function (oEvent) {
            var that = this;
            var mEquipmentList = that.getView().getModel("mEquipmentList");
            var assessmentData = mEquipmentList.getProperty("/data/riskSummaryData");
            var criticalityData = Object.values(mEquipmentList.getProperty("/data/criticalityData"));
            var stackedColumn = mEquipmentList.getProperty("/data/stacked");
            var aVizSelection = oEvent.getSource().vizSelection();
            var aVizSelectionData = [], popData = [];
            stackedColumn.forEach(function (stackedColumnObj) {
                aVizSelection.forEach(function (oGraph) {
                    if (oGraph.data.RiskScore === stackedColumnObj.RiskScore) {
                        var stackedArr = Object.keys(oGraph.data);
                        stackedArr.forEach(function (str) {
                            criticalityData.forEach(function(item){
                                if(item.completeText === str){
                                    aVizSelectionData.push(...stackedColumnObj[item.code + "_objectId"]);
                                }
                            })
                        })
                    }
                })
            });
            aVizSelectionData.forEach(function (item) {
                popData.push(assessmentData[item])
            });
            mEquipmentList.setProperty("/data/analytics/popupData", popData);
            mEquipmentList.setProperty("/data/analytics/popupDataHeader", this._oi18n.getText("asint.equipment.list.analytics.popup.table.title.text", [popData.length]));
        },

        /**-
         * Function that open the show more details dialog
         */
        onActionPress: function () {
            if (!this._oGraphActionDialog) {
                Fragment.load({
                    name: "com.asint.ais.mi.equipment.view.fragment.AnalyticsPopUp",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oGraphActionDialog = oDialog;
                    this._oGraphActionDialog.open();
                }.bind(this));
            } else {
                this._oGraphActionDialog.open();
            }
        },

        /**
         * Functionn to close analytics popup
         */
        onAnalyticsPopupClose: function () {
            if (this._oGraphActionDialog) {
                this._oGraphActionDialog.close();
            }
        },

        /**
         * Function that applies the selected filters for RCA data in analytics
         */
        onAnalyticsFilterConfirm: function () {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var assessmentData = mEquipmentList.getProperty("/data/backupriskSummaryData");
            var equiFilter = sap.ui.getCore().byId("idAnalyticEquipmentInputFilter").getTokens();
            var flocFilter = sap.ui.getCore().byId("idAnalyticFlocInputFilter").getTokens();
            var planningPlant = mEquipmentList.getProperty("/data/analytics/planningPlant");
            var maintenacePlant = mEquipmentList.getProperty("/data/analytics/mainPlant");
            var aFilters = [], filteredObjects;
            if (equiFilter.length > 0) {
                var selectedEquiText = [];
                equiFilter.forEach(function (item) {
                    selectedEquiText.push(item.getText())
                    aFilters.push(new Filter("objectName", FilterOperator.Contains, item.getText()))
                })
            }
            if (flocFilter.length > 0) {
                var selectedFlocText = [];
                flocFilter.forEach(function (item) {
                    selectedFlocText.push(item.getText());
                    aFilters.push(new Filter("parentLocationName", FilterOperator.Contains, item.getText()))
                })
            }
            if (planningPlant.length > 0) {
                planningPlant.forEach(function (item) {
                    aFilters.push(new Filter("planningPlant", FilterOperator.EQ, item.text))
                })
            }
            if (maintenacePlant.length > 0) {
                maintenacePlant.forEach(function (item) {
                    aFilters.push(new Filter("maintenancePlant", FilterOperator.EQ, item.text))
                })
            }

            if (aFilters.length > 0 && assessmentData.length > 0) {
                filteredObjects = Object.values(assessmentData).filter(object => {
                    return aFilters.some(filter => {
                        switch (filter.sOperator) {
                        case "Contains":
                            return object[filter.sPath].toString().includes(filter.oValue1);
                        case "EQ":
                            return object[filter.sPath] === filter.oValue1;
                        default:
                            return true;
                        }
                    });
                });
                that.setRCAChartData(filteredObjects);
            } else {
                that.setRCAChartData(assessmentData);
            }
            that.onAnalyticsFilterClose();
        },

        /**
         * Function will trigger on removal and addition of taken in multinput
         * fields
         * @param {Object} oEvent 
         */
        onTokenChange: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentList");
            var aExistingSelectedTemplates = oModel.getProperty("/data/createNewEquipment/selectedEquTemp");

            if (oEvent.getParameter("type") === "removed") {
                var aRemovedToken = oEvent.getParameter("removedTokens");
                var removeToken = aRemovedToken[0].getText();
                for (var i = 0; i < aExistingSelectedTemplates.length; i++) {
                    if (aExistingSelectedTemplates[i].displayId === removeToken) {
                        aExistingSelectedTemplates.splice(i, 1);
                        break;
                    }
                }
            }

        },

        /**
       * Adaptive Filter Generic Enum ValueHelp dialog Open and Set Value
       */
        handleGenericEnumValueHelp: function (controlID,sType) {

            var oModel = this.getView().getModel("mEquipment");
            var oInput = this.getView().byId(controlID) || sap.ui.getCore().byId(controlID);
            var aTokens = oInput.getTokens();
            var aEnum = []
            var sTableTitle = "";
            var aExistingKeys = aTokens.map(function (oToken) {
                return oToken.getKey();
            });


            if(sType === "userStatus"){
                aEnum = oModel.getProperty("/metadata/userStatus");
                sTableTitle = this._oi18n.getText("asint.equipment.field.selectUserStatus.text");
            }else if(sType === "systemStatus"){
                aEnum = oModel.getProperty("/metadata/systemStatus");
                sTableTitle = this._oi18n.getText("asint.equipment.field.selectSystemStatus.text");
            }

            /**
             * Function to return selected values in the dialog
             * @param {Array} oReturn - Return the Selected value
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    var aData = [];
                    oReturn.selected.forEach(function (oItem) {
                        aData.push(oItem.name);
                    });

                    aData.forEach(function (value) {
                        if (!aExistingKeys.includes(value)) {
                            var token = new sap.m.Token({
                                key: value,
                                text: value
                            });
                            oInput.addToken(token);
                        }
                    });
                }
            };

            this.enumValueHelp.handleGenericEnumValueHelp(fnComplete, true, [], aEnum,sTableTitle);
        },



        /**
         * Function to handle class valuehelp
         */
        fnHandleAdvFilterClassValueHelp: function () {
            var oModel = this.getView().getModel("mEquipmentList");
            var sCharType = oModel.getProperty("/data/AdvancedFilters/characteristicIsS4");
            var oTable = "";
            var oBindedModel = ""

            if (sCharType === false) {
                if (!this.oClassValueHelp) {
                    this.oClassValueHelp = sap.ui.xmlfragment("idClassValueHelpDialog", "com.asint.ais.mi.equipment.view.fragment.AdvFilterClassValueHelp", this);
                    this.getView().addDependent(this.oClassValueHelp);
                }
                oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialog", "idClassValueHelp");
                oTable.removeSelections();
                this.oClassValueHelp.open();
                oBindedModel = "mEquipmentList";
            } else {
                if (!this.oClassValueHelps4) {
                    this.oClassValueHelps4 = sap.ui.xmlfragment("idClassValueHelpDialogS4", "com.asint.ais.mi.equipment.view.fragment.AdvFilterClassS4ValueHelp", this);
                    this.getView().addDependent(this.oClassValueHelps4);
                }
                oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialogS4", "idClassValueHelp");
                oTable.removeSelections();
                this.oClassValueHelps4.open();
                oBindedModel = "masterService";
            }

            // Preselect already selected items
            var aItems = oTable.getItems();
            var aSelected = oModel.getProperty("/data/AdvancedFilters/Classes/selectedClasses") || [];

            aItems.forEach(function (oItem) {
                var oRowObj = oItem.getBindingContext(oBindedModel).getObject();
                aSelected.forEach(function (oSel) {
                    if (oSel.ID === oRowObj.ID) {
                        oItem.setSelected(true);
                    }
                });
            });
        },


        /**
        * Function to fetch selected classes data (supports both Equipment and RCM modes)
        */
        onConfirmClassSelection: function (_oEvent, fnCallBack) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var isS4BTP = oModel.getProperty("/data/AdvancedFilters/characteristicIsS4");

            var sFragmentId = isS4BTP ? "idClassValueHelpDialogS4" : "idClassValueHelpDialog";
            var sClassMultiInputId = isS4BTP ? "idAdvFilterClassS4" : "idAdvFilterClass";
            var sModelContextPath = isS4BTP ? "masterService" : "mEquipmentList";
            var sTableHeaderTextKey = "asint.equipment.tab.assignments.Characteristic.tableHeader";
               

            var aSelected = [];
            var aTotalChars = [];
            var aClassWithChars = [];
            var iProgress = 0;

            var oTable = sap.ui.core.Fragment.byId(sFragmentId, "idClassValueHelp");
            if (oTable) {
                var aSelectedItems = oTable.getSelectedItems();
                aSelectedItems.forEach(function (oItem) {
                    var selObj = oItem.getBindingContext(sModelContextPath).getObject();
                    aSelected.push(selObj);
                });
            } else {
                aSelected = oModel.getProperty("/data/AdvancedFilters/Classes/selectedClasses") || [];
            }
            
            /**
             * Function to handle the success callback after fetching characteristics
             */
            var fnLocalSuccess = function () {
                var aFinalChars = aTotalChars
                    .filter(function (oChar) {
                        return oChar.characteristic;
                    })
                    .map(function (oChar) {
                        return oChar.characteristic;
                    });

                oModel.setProperty("/data/AdvancedFilters/ClassesData", aClassWithChars);
                oModel.setProperty("/data/AdvancedFilters/Chars/charsList", aFinalChars);
                oModel.setProperty("/data/AdvancedFilters/Chars/tableHeader", that._oi18n.getText(sTableHeaderTextKey, [aFinalChars.length]));

                if (!isS4BTP) {
                    var aObjTemplateData = oModel.getProperty("/data/AdvancedFilters/ObjectTemplatesData");
                    aClassWithChars.forEach(function (oClass) {
                        /*eslint-disable camelcase*/
                        var aChars = oClass.to_characteristic;
                        aObjTemplateData.forEach(function (oTemp) {
                            if (oTemp.to_class && oTemp.to_class.length > 0) {
                                oTemp.to_class.forEach(function (objClass) {
                                    if (objClass.classes_ID === oClass.ID) {
                                        objClass.classes.to_characteristic = aChars;
                                    }
                                });
                            }
                        });
                    });
                    oModel.setProperty("/data/AdvancedFilters/ObjectTemplatesData", aObjTemplateData);
                }

                var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", sClassMultiInputId);
                if (oMultiInput) {
                    oMultiInput.removeAllTokens();
                    aClassWithChars.forEach(function (oTemp) {
                        oMultiInput.addToken(new sap.m.Token({
                            key: oTemp.ID,
                            text: oTemp.displayId
                        }));
                    });
                }

                if (fnCallBack) {
                    var aSelChars = oModel.getProperty("/data/AdvancedFilters/Chars/selectedChars") || [];
                    var aCharsNewData = aFinalChars.filter(function (oChar) {
                        return aSelChars.some(function (oSel) {
                            return oChar.ID === oSel.ID;
                        });
                    });
                    oModel.setProperty("/data/AdvancedFilters/Chars/selectedChars", aCharsNewData);
                    fnCallBack();
                } else {
                    that.onCloseClassValueHelp();
                }
            };

            if (aSelected.length > 0) {
                aSelected.forEach(function (oClass) {
                    that.dataSource.getCharacteristicsByClassId(oClass.ID, function (oData) {
                        var aChars = oData.to_characteristic || [];
                        aTotalChars = aTotalChars.concat(aChars);
                        aClassWithChars.push(oData);
                        iProgress++;
                        if (iProgress === aSelected.length) {
                            fnLocalSuccess();
                        }
                    }, function (oError) {
                        iProgress++;
                        if (iProgress === aSelected.length) {
                            fnLocalSuccess();
                        }
                        that._oLogger.error("Error in getCharacteristicsByClassId:", JSON.stringify(oError));
                    });
                });
            } else if (fnCallBack) {
                fnCallBack();
            }
        },


        /**
         * Fetche Fleet Assessment
         * 
         * @param {object} oEvent - Event object
         */
        onDataClassessAdvancedFilterReceived: function (oEvent) {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            var oParameters = oEvent.getSource().getQueryOptionsFromParameters();
            var oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialogS4", "idClassValueHelp");
            if (oParameters["$count"] && oEvent.getSource().getCount && oEvent.getSource().getCount()) {
                var sCount = oEvent.getSource().getCount();
                var sHeader = that._oi18n.getText("asint.equipment.advancedFiltersS4.tab.assignments.classes.tableHeader", [sCount]);
                oModel.setProperty("/data/AdvancedFilters/S4Classes/tableHeader", sHeader);
            } else {
                that.fnFetchInlineCountFragmentTable(that,oTable, function (sCount) {
                    var sHeader = that._oi18n.getText("asint.equipment.advancedFiltersS4.tab.assignments.classes.tableHeader", [sCount]);
                    oModel.setProperty("/data/AdvancedFilters/S4Classes/tableHeader", sHeader);
                });
            }
        },

        
        /**
         * To reset data of advance filter if user toggle between s4 and btp char 
         */
        onCharTypeSwitchChange:function (){
            var that = this;
            var oModel = this.getView().getModel("mEquipmentList");
            oModel.setProperty("/data/AdvancedFilters/dialogHeader", that._oi18n.getText("asint.equipment.advancedFilters.createFilter.text"));
            oModel.setProperty("/data/AdvancedFilters/CalcBuilder/Expression", "");
            oModel.setProperty("/data/AdvancedFilters/CalcBuilder/FilterName", "");
            oModel.setProperty("/data/AdvancedFilters/showExpression/currentId", "");
            oModel.setProperty("/data/AdvancedFilters/ObjectTemplatesData",[]);
            oModel.setProperty("/data/AdvancedFilters/ClassesData",[]);
            oModel.setProperty("/data/AdvancedFilters/Chars/selectedChars",[]);
            oModel.setProperty("/data/AdvancedFilters/selectedObjectTemplates", []);
            oModel.setProperty("/data/AdvancedFilters/Classes/selectedClasses", []);
            oModel.setProperty("/data/AdvancedFilters/Classes/classList", []);
            oModel.setProperty("/data/AdvancedFilters/Classes/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [0]));
            oModel.setProperty("/data/AdvancedFilters/Chars/charsList", []);
            oModel.setProperty("/data/AdvancedFilters/Chars/tableHeader", that._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [0]));
            var oMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterObjTemp");
            var oClsMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterClass");
            var oCharMultiInput = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterCharacteristic");
            oMultiInput.removeAllTokens();
            oClsMultiInput.removeAllTokens();
            oCharMultiInput.removeAllTokens();
            var oClsMultiInputS4 = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterClassS4");
            var oCharMultiInputS4 = sap.ui.core.Fragment.byId("idCreateAdvancedFilter", "idAdvFilterCharacteristicS4");
            oClsMultiInputS4.removeAllTokens();
            oCharMultiInputS4.removeAllTokens();
        },


        /**
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchClassesAssignDialogForS4: function (oEvent) {
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var oTable = sap.ui.core.Fragment.byId("idClassValueHelpDialogS4", "idClassValueHelp");
            var sQuery = oEvent.getSource().getValue();
            if (sQuery) {
                var aFilters = [
                    new sap.ui.model.Filter({path:"displayId",  operator: sap.ui.model.FilterOperator.Contains,value1: sQuery, caseSensitive: false}),
                    new sap.ui.model.Filter({path:"shortDescription",  operator: sap.ui.model.FilterOperator.Contains,value1: sQuery, caseSensitive: false}),
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }
            var filteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentList.setProperty("/data/AdvancedFilters/S4Classes/tableHeader", this._oi18n.getText("asint.equipment.advancedFiltersS4.tab.assignments.classes.tableHeader", [filteredItemsLength]));
        }


    });
}
);
