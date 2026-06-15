sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/IconPool",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/BusyDialog",
    "sap/base/Log",
    "com/asint/ais/library/utils/ObjectHierarchy",
    "com/asint/ais/mi/equipment/utils/pdfmake",
    "com/asint/ais/mi/equipment/utils/vfs_fonts",
], function (BaseController, JSONModel, Fragment, IconPool, MessageToast, MessageBox, Filter, FilterOperator, BusyDialog, Logger, ObjectHierarchyNG,
    PdfMake, VfsFonts
) {

    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.EquipmentDetail", {

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {
            this._oLogger = Logger.getLogger("EquipmentDetailController");
            this.fnLoadBussinessSuiteIcons();

            // new DescriptionTranslator(this, {
            //     "modelName": "mEquipmentDetail",
            //     "path": "/data/detail/to_description",
            //     "control": {
            //         "link": "idLanguageLink"
            //     }
            // });
            var oObjectPageLayout = this.getView().byId("_ID_ObjectPageLayout");
            var aSection = oObjectPageLayout.getSections();
            var oSectionInfo = {};
            for (var i = 0; i < aSection.length; i++) {
                oSectionInfo[aSection[i].data("name")] = aSection[i].getId();
            }
            this._sectionInfo = oSectionInfo;
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("mEquipment");
            var isValueDataLoaded = oModel.getProperty("/data/isValueDataLoaded");
            if (!isValueDataLoaded) {
                this.fnLoadValueHelp();
            }

            // TODO: ObjHieLib - add
            this.fnInitObjectHierarchy();

        },

        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () { },

        /**
         * Function to destroy the controller.
         */
        onExit: function () {},

        /**
         * This function will be called everytime when the view got initialized as we are attaching this to pattern matched
         */
        fnInitialize: function (oEvent) {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var oArguments = oEvent.getParameter("arguments");
            var oData = {
                "router": {
                    "arguments": {}
                },
                "data": {
                    "master":{
                        "objectTemplate":{
                            "map":{}
                        },
                        "classes":{
                            "map":{}
                        }
                    },
                    "app": "EQUI",
                    "etag": "",
                    "hierarchyData": {
                        "nodes": [],
                        "lines": [],
                        "locationResponse": [],
                        "equipmentResponse": []
                    },
                    "maintenanceOrderTitle": "",
                    "settings": {
                        "map": {
                            "from": "",
                            "to": []
                        }
                    },
                    "detail": {},
                    "dialog": {
                        "editHeader": {
                            "name": "",
                            "category": "",
                            "validityEndDateTime": "",
                            "functionalLocationName": ""
                        }
                    },
                    "tabs": {
                        "selectedTab": "",
                        "selectedTabId": "",
                        "generalInformation": {
                            "ReviewChanges": []
                        },
                        "classes": {
                            "selectedIndices": []
                        },
                        "characteristicValue": {
                            "data": [],
                            "fieldConfig": [],
                            "classToCharMap": {},
                            "charValueUoM": {}
                        },
                        "assessments": {
                            "rbi": {
                                "history": [
                                    {
                                        "assesmentName": "CL.RBI.13446",
                                        "assesmentDesc": "RBI Test",
                                        "templateTypeText": "RBI+ Tank Bottom",
                                        "statusText": "Unpublished",
                                        "createdOn": "Jan 3, 2023",
                                    },
                                    {
                                        "assesmentName": "CL.RBI.13445",
                                        "assesmentDesc": "RBI Test",
                                        "templateTypeText": "RBI+ Tank Bottom",
                                        "statusText": "Unpublished",
                                        "createdOn": "Jan 3, 2023",
                                    },
                                    {
                                        "assesmentName": "CL.RBI.13444",
                                        "assesmentDesc": "RBI Test",
                                        "templateTypeText": "RBI+ Tank Bottom",
                                        "statusText": "Unpublished",
                                        "createdOn": "Jan 3, 2023",
                                    }
                                ],
                                "template": [
                                    {
                                        "assesmentName": "CL.RBI.13446",
                                        "assesmentDesc": "RBI Test",
                                        "templateTypeText": "RBI+ Tank Bottom",
                                        "statusText": "Unpublished",
                                        "createdOn": "Jan 3, 2023",
                                    }
                                ]
                            },
                            "idms": {
                                "history": [
                                    {
                                        "assesmentName": "CL.RBI.11018",
                                        "assesmentDesc": "INSP VT DTTank (2)",
                                        "templateTypeText": "Fixed Equipment External",
                                        "statusText": "Unpublished",
                                        "createdOn": "Mar 29, 2022",
                                        "notifications": 0,
                                        "workOrders": 0,
                                    },
                                    {
                                        "assesmentName": "CL.RBI.11017",
                                        "assesmentDesc": "INSP VT DTTank (1)",
                                        "templateTypeText": "Fixed Equipment External",
                                        "statusText": "Unpublished",
                                        "createdOn": "Mar 29, 2022",
                                        "notifications": 0,
                                        "workOrders": 0,
                                    },
                                    {
                                        "assesmentName": "CL.RBI.11017",
                                        "assesmentDesc": "INSP VT DTTank",
                                        "templateTypeText": "Fixed Equipment External",
                                        "statusText": "Unpublished",
                                        "createdOn": "Mar 29, 2022",
                                        "notifications": 0,
                                        "workOrders": 0,
                                    }
                                ],
                                "template": [
                                    {
                                        "assesmentName": "CL.RBI.11018",
                                        "assesmentDesc": "INSP VT DTTank (2)",
                                        "templateTypeText": "Fixed Equipment External",
                                        "statusText": "Unpublished",
                                        "createdOn": "Mar 29, 2022",
                                    }
                                ]
                            }
                        },
                        "planning": {
                            "notifications": {},
                            "workOrder": {}
                        },
                        "components": {
                            "parent": {
                                "superOrdinateEquipment": null,
                                "superiorFunctionalLocation": null
                            },
                            "componentInformation": {
                                "components": [],
                                "selectedComponents": []
                            },
                            "groups" : {
                                "groupsLength" : 0,
                                "groupsList" : []
                            },
                        },
                        "hierarchy": {
                            "isLoadedOnce": false
                        },
                        "maintenanceservice": {
                            "recommendations": {
                                "equipmentsList": [],
                                "list": [],
                                "btpList": [],
                                "selectedObj": {},
                                "standaloneList": []
                            },
                            "notiificationList": [],
                            "maintenancePlan":{
                                "list":[], 
                                "totalCount":0,
                                "searchQuery":"",
                                "running":"",
                                "tableBusy":false,
                                "isDataLoaded":false,
                                "listHeader":this._oi18n.getText("asint.equipment.detail.tab.mPlan.table.header",[0])
                            },
                            "priorityList": [],
                            "notificationTypeList": [],
                            "tasksList": []
                        },
                        "riskSummary":{
                            "rawData":{},
                            "visibleRowCount":0,
                            "equipmentRiskTableHeader":this._oi18n.getText("asint.equipment.tab.riskSummary.tableHeader.equipmentProfile.text",[0]),
                            "componentRiskTableHeader":this._oi18n.getText("asint.equipment.tab.riskSummary.tableHeader.equipment.text",[0]),
                            "sheAtToday":"",
                            "finAtToday":"",
                            "finalRiskData":[],
                            "componentRiskData":[],
                            "componentsTreeTableData":{},
                            "recommendationsList":[],
                            "recommendationTableHeader":this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[0]),
                            "isRecoTableVisible":false,
                            "selectedRows":[]
                        },
                       
                    },
                    "documents": {
                        "phaseDropdown": [
                            {
                                "key": "Acquisition",
                                "text": "Acquisition"
                            },
                            {
                                "key": "Decommissioning",
                                "text": "Decommissioning"
                            },
                            {
                                "key": "Design",
                                "text": "Design"
                            },
                            {
                                "key": "Dismantle",
                                "text": "Dismantle"
                            },
                            {
                                "key": "Disposal",
                                "text": "Disposal"
                            },
                            {
                                "key": "Installation",
                                "text": "Installation"
                            },
                            {
                                "key": "Maintenance",
                                "text": "Maintenance"
                            },
                            {
                                "key": "Operation",
                                "text": "Operation"
                            },
                            {
                                "key": "1",
                                "text": "Acquisition"
                            },
                            {
                                "key": "2",
                                "text": "Decommissioning"
                            },
                            {
                                "key": "3",
                                "text": "Design"
                            },
                            {
                                "key": "4",
                                "text": "Dismantle"
                            },
                            {
                                "key": "5",
                                "text": "Disposal"
                            },
                            {
                                "key": "6",
                                "text": "Installation"
                            },
                            {
                                "key": "7",
                                "text": "Maintenance"
                            },
                            {
                                "key": "8",
                                "text": "Operation"
                            },
                        ],
                        "confidentialityDropdown": [
                            {
                                "key": "0",
                                "text": "No Sensitive Information"
                            },
                            {
                                "key": "1",
                                "text": "Personal Data"
                            },
                            {
                                "key": "2",
                                "text": "Sensitive Data"
                            }
                        ],
                        "documentTypeDropdown": [
                            {
                                "key": "BillsOfMaterials",
                                "text": "Bills of Materials"
                            },
                            {
                                "key": "Certificates",
                                "text": "Certificates"
                            },
                            {
                                "key": "CommercialDocuments",
                                "text": "Commercial Documents"
                            },
                            {
                                "key": "DrawingsSchemes",
                                "text": "Drawings/Schemes"
                            },
                            {
                                "key": "Firmware",
                                "text": "Firmware"
                            },
                            {
                                "key": "Identification",
                                "text": "Identification"
                            },
                            {
                                "key": "InspectionMaintenance",
                                "text": "Inspection, Maintenance"
                            },
                            {
                                "key": "InstallationDismantling",
                                "text": "Installation/Dismantling"
                            },
                            {
                                "key": "Operation",
                                "text": "Operation"
                            },
                            {
                                "key": "Others",
                                "text": "Others"
                            },
                            {
                                "key": "RepairOverhaul",
                                "text": "Repair/Overhaul"
                            },
                            {
                                "key": "Safety",
                                "text": "Safety"
                            },
                            {
                                "key": "SpareParts",
                                "text": "Spare Parts"
                            },
                            {
                                "key": "TechnicalSpecification",
                                "text": "Technical Specification"
                            }
                        ],
                        "languages": [
                            { "key": "af", "name": "Afrikaans" },
                            { "key": "ar", "name": "Arabic" },
                            { "key": "bg", "name": "Bulgarian" },
                            { "key": "ca", "name": "Catalan" },
                            { "key": "zh", "name": "Chinese" },
                            { "key": "hr", "name": "Croatian" },
                            { "key": "cs", "name": "Czech" },
                            { "key": "da", "name": "Danish" },
                            { "key": "nl", "name": "Dutch" },
                            { "key": "en", "name": "English" },
                            { "key": "et", "name": "Estonian" },
                            { "key": "fi", "name": "Finnish" },
                            { "key": "fr", "name": "French" },
                            { "key": "de", "name": "German" },
                            { "key": "el", "name": "Greek" },
                            { "key": "he", "name": "Hebrew" },
                            { "key": "hu", "name": "Hungarian" },
                            { "key": "is", "name": "Icelandic" },
                            { "key": "id", "name": "Indonesian" },
                            { "key": "it", "name": "Italian" },
                            { "key": "ja", "name": "Japanese" },
                            { "key": "ko", "name": "Korean" },
                            { "key": "lv", "name": "Latvian" },
                            { "key": "lt", "name": "Lithuanian" },
                            { "key": "ms", "name": "Malaysian" },
                            { "key": "no", "name": "Norwegian" },
                            { "key": "pl", "name": "Polish" },
                            { "key": "pt", "name": "Portuguese" },
                            { "key": "ro", "name": "Romanian" },
                            { "key": "ru", "name": "Russian" },
                            { "key": "sr", "name": "Serbian" },
                            { "key": "sk", "name": "Slovakian" },
                            { "key": "sl", "name": "Slovenian" },
                            { "key": "es", "name": "Spanish" },
                            { "key": "sv", "name": "Swedish" },
                            { "key": "th", "name": "Thai" },
                            { "key": "zh-Hant", "name": "Traditional Chinese" },
                            { "key": "tr", "name": "Turkish" },
                            { "key": "uk", "name": "Ukrainian" }
                        ],
                        "assessmentInfo": "",
                        "list": [],
                        "isSelected": false,
                        "userInput": {},
                        "selectedFileId": "",
                        "selectedFileName": "",
                        "attachDocumentsList": [],
                        "attachdoucmentIds": []
                    },
                    "hierarchyTableData": [],
                    "templatesData": {
                        "allTemplates": [],
                        "assignedTemplates": [],
                        "unassignedTemplates": [],
                        "tableHeader": "Templates (0)",
                        "templatesLinkText": 0
                    },
                    "assignments": {
                        "isAssignmentsTabLoaded":false,
                        "objectTemplate": {
                            "templateHeaderCount": "Equipment Template (0)",
                            "templateList": [],
                            "selectedTemplate": [],
                            "isShowBusy":false,
                            "IsOkEnabled":false,
                            "assignTableHeader":this._oi18n.getText("asint.equipment.tab.assignments.objectTemplate.title", [0]),
                            "selectedForAssign":[]
                        },
                        "Classes": {
                            "assignedClassList": [],
                            "assignedClassListBTP": [],
                            "assignedClassListS4": [],
                            "assignedClassIds": [],
                            "classTableHeader": this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [0]),
                            "totalClasses": [],
                            "totalUnassignedClasses": [],
                            "totalClassesTableHeader": this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [0]),
                            "selectedForAssign": [],
                            "selectedForRemove": [],
                            "isUnassignEnabled": false,
                            "isOkEnabled": false,
                            "objectTemplateMap": {},
                            "searchField": ""
                        },
                        "Chars": {
                            "isEditable": false,
                            "isClassificationEditable": false,
                            "isClassificationTableVisible":false,
                            "allChars": [],
                            "allCharsBTP": [],
                            "allCharsS4": [],
                            "filteredCharsForClass": [],
                            "selectedClassKey":"",
                            "charTableHeader": this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [0])
                        },
                        "failureDataProfile": {
                            "profileList": [],
                            "profileTableHeader": this._oi18n.getText("asint.equipment.tab.assignments.failureDataProfile.tableHeader",[0])
                        },
                        "equipmentCharValues": []
                    },
                    "userRoles": {
                        "edit": true
                    },
                    "assetIntelligence": {
                        "highlights": {
                            "highestRiskScore": "",
                            "criticalityCode": "",
                            "criticalityText": "",
                            "rcaAssessmentModifiedBy": "",
                            "rcaAssessmentModifiedAt": "",
                            "asdAssessmentModifiedBy": "",
                            "asdAssessmentModifiedAt": "",
                            "rcaAssessmentCreatedBy": "",
                            "rcaAssessmentCreatedAt": "",
                            "asdAssessmentCreatedBy": "",
                            "asdAssessmentCreatedAt": "",
                            "rcaAssessmentName": "",
                            "asdAssessmentName": "",
                            "asdAssessmentShortDesp": "",
                            "rcaAssessmentShortDesp": "",
                            "sRCAFormatedCardSubTitle": "",
                            "sASDFormatedCardSubTitle": "",
                            "alphaNumericRiskScore": "",
                            "state": "None",
                            "assetStrategy": [
                                {
                                    "Risk Score": null,
                                    "Risk Name": "Unmitigated",
                                    "Risk Type": "SHE"
                                },
                                {
                                    "Risk Score": null,
                                    "Risk Name": "Mitigated",
                                    "Risk Type": "SHE"
                                },
                                {
                                    "Risk Score": null,
                                    "Risk Name": "Unmitigated",
                                    "Risk Type": "Financial"
                                },
                                {
                                    "Risk Score": null,
                                    "Risk Name": "Mitigated",
                                    "Risk Type": "Financial"
                                }
                            ],
                        },
                        "RiskCriticality": {
                            "equiNameList": [],
                            "assesmentsData": {},
                            "header": this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [0]),
                            "skip": 0,
                            "stop": 5
                        },
                        "assessment": {
                            "header": this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.header.text1", [0]),
                            "segmentedBtn": {
                                "rbi": {
                                    "isVisible": true
                                },
                                "rcm_fleet": {
                                    "header": this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.header.text2", [0]),
                                    "list": [],
                                    "isVisible": false
                                }
                            },
                            "data": {},
                        },
                        "recommendation": {
                            "data": {
                                "list": []
                            },
                            "header": ""
                        },
                        "assetInspection":{
                            "header": this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.inspection.table.header.text", [0]),
                            "list":[]
                        },
                        "findings":{
                            "header": this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.findings.table.header.text", [0]),
                            "list":[]
                        }
                    },
                    "notificationDialog": {
                        "Notification": {
                            "Type": [
                                {
                                    "Key": "M1",
                                    "Val": "Maintenance Request"
                                },
                                {
                                    "Key": "M2",
                                    "Val": "Malfunction Report"
                                },
                                {
                                    "Key": "M3",
                                    "Val": "Activity Report"
                                },
                                {
                                    "Key": "Y1",
                                    "Val": "Reactive Work"
                                },
                                {
                                    "Key": "Y2",
                                    "Val": "Proactive Work"
                                }
                            ],
                            "Priority": [
                                {
                                    "Key": "1",
                                    "Val": "Very High"
                                },
                                {
                                    "Key": "2",
                                    "Val": "High"
                                },
                                {
                                    "Key": "3",
                                    "Val": "Medium"
                                },
                                {
                                    "Key": "4",
                                    "Val": "Low"
                                }
                            ]
                        },
                        "common": {}
                    },
                },
                "metadata": {
                    "isAssignAllowed":true,
                    "header": {
                        "isEditable": false,
                    },
                    "detail": {
                        "isEditable": false,
                        "tabs": {
                            "characteristicValue": {
                                "panel": {}
                            },
                            "attachments": {
                                "isBusy": false
                            },
                            "recommendations": {
                                "isComponent": false,
                                "isS4": true,
                                "isStandalone":false,
                                "selection": false
                            }
                        },
                        "uomList": {}
                    },
                    "isEditable": true,
                    "isExternal": false,
                    "sectionInfo": this._sectionInfo,
                    "selectedTab": "generalData",
                    "dropDown": {
                        "constructionMonths": [
                            { "key": "01", "text": "January" },
                            { "key": "02", "text": "February" },
                            { "key": "03", "text": "March" },
                            { "key": "04", "text": "April" },
                            { "key": "05", "text": "May" },
                            { "key": "06", "text": "June" },
                            { "key": "07", "text": "July" },
                            { "key": "08", "text": "August" },
                            { "key": "09", "text": "September" },
                            { "key": "10", "text": "October" },
                            { "key": "11", "text": "November" },
                            { "key": "12", "text": "December" }
                        ],
                        "activationState":[
                            { "key": "Activated", "text": "Activated" },
                            { "key": "Deactivated", "text": "Deactivated" }
                        ],
                        "componentFlag":[
                            {"key":"","text":""},
                            {"key":"Out of Service","text":"Out of Service"}
                        ]
                    },
                    "isObjectHierarchy": false,
                    "enabled": {
                        "assign": true,
                        "unassign": false
                    },
                    "status": {
                        "isUnpublished": true
                    },
                    "valueState": {
                        "notificationDialog": {
                            "Priority": "None",
                            "Type": "None",
                            "ShortDesc": "None",
                            "LongDesc": "None",
                            "TargetDate": "None"
                        },
                    },
                    "aiRecommendation":{
                        "isFullScreenActive": false,
                    }
                }
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "mEquipmentDetail");

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            mEquipmentDetail.setProperty("/router/arguments", oArguments);
            mEquipmentDetail.setProperty("/router/arguments/assessmentId", oArguments.equipmentId);
            this.getOwnerComponent().getModel("mEquipment").setProperty("/sEquipmentId", oArguments.equipmentId);


            var oObjectPageLayout = this.getView().byId("_ID_ObjectPageLayout");
            oObjectPageLayout.setSelectedSection(oObjectPageLayout.getSections()[0].getId());

            this.busyDialog = new BusyDialog();
            this.fnFetchComponentTypeList();
            this.fnFetchEquipmentDetail();
            this._fnLoadUoM();
            this.getUserRoles();
            this.fnGetNotiifcationPriority();
            this.fnGetNotiifcationType();
            this.fnSetObjectPageSelectedTab();
            // TODO: ObjHieLib - add
            this.fnLoadObjectHierarchy();
            // this.fnGetTemplatesMappingData(oArguments.equipmentId);

            var oCommonModel = this.getView().getModel("mEquipment");
            var isEnumLoaded = oCommonModel.getProperty("/metadata/ValueHelps/isEnumsLoaded");
            var that = this;
            if(!isEnumLoaded){
                this.fnFetchEquipmentEnums();
            }
            
            var isFeatureFlagLoaded = oCommonModel.getProperty("/metadata/featureFlag/isLoaded");
            if(isFeatureFlagLoaded){
                this.fnGetUnitLocation();
            } else {
                this.fnLoadFeatureFlagConfig(function(){
                    that.fnGetUnitLocation();
                });
            }

        },

        // TODO: ObjHieLib - add
        /**
         * Function to init object hierarchy
         */
        fnInitObjectHierarchy: function () {

            var oObjectHierarchyNG = new ObjectHierarchyNG(window.com.asint.ais.mi.equipment.baseURI, {
                "type": "DETAIL",
                "nodePress": null,
                "declinePress": null,
                "flexColumnLayoutId": null,
                "busyControlId": "idObjectHierarchySubSection"
            }, this);
            var oSubSection = this.getView().byId("idObjectHierarchySubSection");

            if (oSubSection) {
                oSubSection.removeAllBlocks();
                oSubSection.addBlock(oObjectHierarchyNG.getNetworkGraph());
            }
            this._objectHierarchyNG = oObjectHierarchyNG;

        },

        // TODO: ObjHieLib - add
        /**
         * Function to load object hierarchy
         */
        fnLoadObjectHierarchy: function () {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");

            if (this._objectHierarchyNG) {
                this._objectHierarchyNG.fetchHierarchy("DETAIL", sEquipmentId, true);
            }

        },

        /**
         * Function to set the tab
         */
        fnSetObjectPageSelectedTab: function () {
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oObjectPageLayout = this.getView().byId("_ID_ObjectPageLayout");
            var oSectionInfo = mEquipmentDetail.getProperty("/metadata/sectionInfo");
            var sSelectedTab = mEquipmentDetail.getProperty("/metadata/selectedTab");
            oObjectPageLayout.setSelectedSection(oSectionInfo[sSelectedTab]);
        },

        /**
         * Function to load value help
         * 
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
                 * Complete callback function
                 * 
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
         * Function lo load business suite icons
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
         * Function load Uom
         */
        _fnLoadUoM: function () {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            this.dataSource.getUoMList(function (aUoMList) {
                var oUoMList = {};

                for (var i = 0; i < aUoMList.length; i++) {
                    oUoMList[aUoMList[i].key] = aUoMList[i];
                }

                mEquipmentDetail.setProperty("/metadata/detail/uomList", oUoMList);
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getUoMList :", JSON.stringify(oError));
            });

        },

        /**
         * Function to handle header edit
         * 
         * @param {String} sAction 
         */
        _fnEditEquipmentHeaderHandler: function (sAction) {

            var that = this;

            switch (sAction) {
            case "open":
                if (!this._editEquipmentHeaderDialog) {
                    Fragment.load({
                        name: "com.asint.ais.mi.equipment.view.fragment.EquipmentHeaderChange",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        oDialog.attachEvent("beforeOpen", function () {
                            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
                            var oDetailData = mEquipmentDetail.getProperty("/data/detail");

                            var oDialogData = {
                                "name": oDetailData.name,
                                "category": oDetailData.category,
                                "validityEndDateTime": oDetailData.validityEndDate,
                                "validityStartDateTime": oDetailData.validityStartDate,
                                "functionalLocationName": "",
                                "to_description": oDetailData.to_description,
                                "flagComponent":oDetailData.flagComponent
                            };
                            if (oDetailData.parent_functional_location && oDetailData.parent_functional_location.to_description && oDetailData.parent_functional_location.to_description.length > 0) {
                                oDialogData.functionalLocationName = oDetailData.parent_functional_location.to_description[0].shortDescription
                            }

                            mEquipmentDetail.setProperty("/data/dialog/editHeader", Object.assign({}, oDialogData));
                        });
                        this._editEquipmentHeaderDialog = oDialog;
                        this._editEquipmentHeaderDialog.open();
                    }.bind(this));
                } else {
                    this._editEquipmentHeaderDialog.open();
                }
                break;
            case "close":
                if (this._editEquipmentHeaderDialog) {
                    this._editEquipmentHeaderDialog.close();
                }
                break;
            case "confirm":
                var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
                var oDialogData = mEquipmentDetail.getProperty("/data/dialog/editHeader");
                var aFields = Object.keys(oDialogData);
                var oDetailData = mEquipmentDetail.getProperty("/data/detail");
                var isDataChanged = false;

                for (var i = 0; i < aFields.length; i++) {
                    if (!isDataChanged && oDetailData[aFields[i]] === oDialogData[aFields[i]]) {
                        isDataChanged = true;
                    }
                    oDetailData[aFields[i]] = oDialogData[aFields[i]];
                }

                if (isDataChanged) {
                    this._fnSave(function () {
                        that._fnEditEquipmentHeaderHandler("close");
                    }, function () {
                        that._fnEditEquipmentHeaderHandler("close");
                    });
                }
                break
            }
        },

        /**
         * Function to load backup data
         */
        _fnLoadBackupData: function () {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            mEquipmentDetail.setProperty("/data/detail", JSON.parse(mEquipmentDetail.getProperty("/data/detailBackup")));

        },

        /**
         * Function to fetch equipment details
         */
        fnFetchEquipmentDetail: function () {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");

            this.dataSource.getEquipmentDetail(sEquipmentId, function (oEquipmentDetail) {
                if(oEquipmentDetail.objectType==null || oEquipmentDetail.objectType==""){
                    if(oEquipmentDetail.parent_equipment && oEquipmentDetail.parent_equipment.objectType && oEquipmentDetail.parent_equipment.objectType!=""){
                        oEquipmentDetail.objectType=oEquipmentDetail.parent_equipment.objectType;
                    }
                }
                var oBackup = Object.assign({}, oEquipmentDetail);
                var maintenanceOrderTitle = "Maintenance Order" + " " + "(" + oEquipmentDetail.to_maintenanceOrder.length + ")";
                mEquipmentDetail.setProperty("/data/maintenanceOrderTitle", maintenanceOrderTitle)
                mEquipmentDetail.setProperty("/data/maintenanceOrder", oEquipmentDetail.to_maintenanceOrder)
                mEquipmentDetail.setProperty("/data/detailBackup", oBackup);
                mEquipmentDetail.setProperty("/data/detail", oEquipmentDetail);
                var createdObj = {
                    "createdBy": oEquipmentDetail.createdBy,
                    "modifiedBy": oEquipmentDetail.modifiedBy
                };
                mEquipmentDetail.setProperty("/data/createdObj", createdObj);
                mEquipmentDetail.setProperty("/data/etag", oEquipmentDetail["@etag"]);
                mEquipmentDetail.setProperty("/data/tabs/components/parent/superOrdinateEquipment", null);
                mEquipmentDetail.setProperty("/data/tabs/components/parent/superiorFunctionalLocation", null);

                if (oEquipmentDetail.srcId != "BTP") {
                    // mEquipmentDetail.setProperty("/metadata/isEditable", false);
                    mEquipmentDetail.setProperty("/metadata/isExternal", true);
                }
                that.fnGetRiskSummary();
                that.fnSelectComponentTypeDropdown();
                // that.fnGetTemplatesMappingData();

                // that.helper.fnBuildCharacFieldConfig({
                //     "modelName": "mEquipmentDetail",
                //     "basePath": "/data/tabs/characteristicValue/data",
                //     "valueHelpBasePath": "/data/detail/to_class/{i}/classes",
                //     "uomListPath": "/metadata/detail/uomList",
                //     "editablePath": "/metadata/detail/isEditable"
                // }, oEquipmentDetail, function (aFieldConfig, oClassToCharMap, oPanelMetadata) {
                //     mEquipmentDetail.setProperty("/data/tabs/characteristicValue/fieldConfig", aFieldConfig);
                //     mEquipmentDetail.setProperty("/data/tabs/characteristicValue/classToCharMap", oClassToCharMap);
                //     mEquipmentDetail.setProperty("/metadata/detail/tabs/characteristicValue/panel", oPanelMetadata);
                // }, function (oError) { });
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.message01"), errorDetail);
                that._oLogger.error("An Error Occurred In getEquipmentDetail :", JSON.stringify(oError));
            });

        },

        /**
         * Function to perform save
         * 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        _fnSave: function (fnSuccess, fnError) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oPayload = mEquipmentDetail.getProperty("/data/detail");
            var sSectionName = mEquipmentDetail.getProperty("/data/tabs/selectedTab");

            /**
             * Callback function to perform save
             * 
             * @param {Function} fnCallback 
             */
            var fnDoSave = function (fnCallback) {

                sap.ui.core.BusyIndicator.show();

                that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function (oData) {
                    MessageToast.show("Data saved");
                    that.fnFetchEquipmentDetail();
                    sap.ui.core.BusyIndicator.hide();
                    mEquipmentDetail.setProperty("/data/etag", oData["@etag"]);
                    if (fnSuccess) {
                        fnSuccess(oData);
                    }
                    if (fnCallback) {
                        fnCallback();
                    }
                }, function (oError) {
                    MessageToast.show("Failed to save data");
                    that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
                    sap.ui.core.BusyIndicator.hide();
                    if (fnError) {
                        fnError(oError);
                    }
                    if (fnCallback) {
                        fnCallback();
                    }
                }, oPayload["@etag"]);

            };

            if (oPayload.grossWeight) {
                oPayload.grossWeight = Number(oPayload.grossWeight);
            }

            if (oPayload.validityEndDateTime) {
                oPayload.validityEndDateTime = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-ddTHH:mm:ss", UTC: true
                }).format(new Date(oPayload.validityEndDateTime)) + "Z";
            }

            if (oPayload.to_class) {
                oPayload.to_class.forEach(function (oClass) {
                    delete oClass.classes;
                });
            }

            if (sSectionName === "characteristicValue") {
                var oCharacteristicValue = mEquipmentDetail.getProperty("/data/tabs/characteristicValue/data");
                var oClassToCharMap = mEquipmentDetail.getProperty("/data/tabs/characteristicValue/classToCharMap");
                var oCharValueUoM = mEquipmentDetail.getProperty("/data/tabs/characteristicValue/charValueUoM");

                this.helper.fnParseUoMConversion(oCharacteristicValue, oClassToCharMap, oCharValueUoM, function (oCharacteristicValue) {
                    var aCharacteristicValue = Object.values(oCharacteristicValue);
                    aCharacteristicValue = aCharacteristicValue.filter(function (oCharcValue) {
                        return oCharcValue.charValue.toString().length > 0;
                    });
                    delete oPayload.to_class;
                    // eslint-disable-next-line camelcase
                    oPayload.to_value = aCharacteristicValue;
                    fnDoSave(function () {
                        that.fnLoadCharacteristicsValue();
                    });
                }, false);
            } else {
                fnDoSave();
            }

        },

        /**
         * Function to make put call and update equipment information
         */
        fnUpdateEquipmentHeaderInfo: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oEquipmentDetail = oModel.getProperty("/data/detail");
            var oDialogData = oModel.getProperty("/data/dialog/editHeader");
            var eTag = oModel.getProperty("/data/etag");
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            var oPayload = {
                "ID": sEquipmentId,
                "name": oDialogData.name,
                "to_description": oDialogData.to_description,
                "validityEndDate": oDialogData.validityEndDateTime,
                "validityStartDate": oDialogData.validityStartDateTime,
                "category": oDialogData.category,
                "flagComponent":oDialogData.flagComponent
            };
            oPayload = that.setCreatedModified(oPayload, "PUT", oEquipmentDetail);
            // Convert the date strings to Date objects
            var oStartDate = new Date(oDialogData.validityStartDateTime);
            var oEndDate = new Date(oDialogData.validityEndDateTime);
            if (oEndDate < oStartDate) {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.message025"));
            } else {
                that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function () {
                    that._fnEditEquipmentHeaderHandler("close");
                    that.fnMessageShow("S", that._oi18n.getText("asint.equipment.detail.message03"), "", function () {
                        that.fnFetchEquipmentDetail();
                    });
                }, function (oError) {
                    var err = JSON.parse(oError.responseText);
                    var errorDetail = "";
                    if (err.error.code === "409006") {
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message05"));
                    } else {
                        if (err.error.message) {
                            errorDetail = err.error.message;
                        }
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.message02"), errorDetail);
                        that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
                    }
                }, eTag);
            }},

        /**
         * Function to load characteristics value
         */
        fnLoadCharacteristicsValue: function () {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oClassToCharMap = mEquipmentDetail.getProperty("/data/tabs/characteristicValue/classToCharMap");

            this.helper.fnLoadCharacteristicsValue(sEquipmentId, oClassToCharMap, function (oCharValueUoM, oCharacteristicValue) {
                mEquipmentDetail.setProperty("/data/tabs/characteristicValue/charValueUoM", oCharValueUoM);
                mEquipmentDetail.setProperty("/data/tabs/characteristicValue/data", oCharacteristicValue);
            });

        },

        /**
         * Event handler on section change
         * 
         * @param {Object} oEvent 
         */
        onSectionChange: function (oEvent) {

            var objectPageLayout = this.getView().byId("_ID_ObjectPageLayout");
            var sSectionName = oEvent.getParameter("section").data("name");
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var bEditable = mEquipmentDetail.getProperty("/metadata/detail/isEditable");
            mEquipmentDetail.setProperty("/data/tabs/selectedTab", sSectionName);
            if (sSectionName === "characteristicValue" && bEditable) {
                MessageBox.information("Please save before navigate");
                var sPrevSelectedTabId = mEquipmentDetail.getProperty("/data/tabs/selectedTabId");
                oEvent.getSource().setSelectedSection(sPrevSelectedTabId);
            } else {
                objectPageLayout.setShowFooter(sSectionName !== "taxonomy");
                mEquipmentDetail.setProperty("/data/tabs/selectedTab", sSectionName);
                mEquipmentDetail.setProperty("/data/tabs/selectedTabId", oEvent.getParameter("section").getId());
            }

        },

        /**
         * Event handler on save press
         * 
         * @param {Object} oEvent 
         * @param {String} sScope 
         */
        onSave: function (oEvent, sScope) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            switch (sScope) {
            case "header":
                // this._fnEditEquipmentHeaderHandler("confirm");
                this.fnUpdateEquipmentHeaderInfo();
                break;
            case "detail":
                this._fnSave(function () {
                    mEquipmentDetail.setProperty("/metadata/detail/isEditable", false);
                }, function () {
                    mEquipmentDetail.setProperty("/metadata/detail/isEditable", false);
                });
                break;
            }

        },

        /**
         * Event handler on edit press
         * 
         * @param {Object} oEvent 
         * @param {String} sScope 
         */
        onEdit: function (oEvent, sScope) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            switch (sScope) {
            case "header":
                this._fnEditEquipmentHeaderHandler("open");
                break;
            case "headerCancel":
                this._fnEditEquipmentHeaderHandler("close");
                break;
            case "detail":
                mEquipmentDetail.setProperty("/metadata/detail/isEditable", true);
                break;
            case "detailCancel":
                mEquipmentDetail.setProperty("/metadata/detail/isEditable", false);
                this._fnLoadBackupData();
                break;
            }

        },

        /**
         * Event handler on delete press
         */
        onDelete: function () {

            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            MessageBox.confirm(oI18n.getText("asint.equipment.message002"), {
                /**
                 * Callback function on dialog close
                 * 
                 * @param {String} sAction 
                 */
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
                        var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
                        var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
                        var eTag = mEquipmentDetail.getProperty("/data/etag");
                        var oPayload = {
                            "ID": sEquipmentId,
                            "deleted": true
                        }
                        oPayload = that.setCreatedModified(oPayload, "PUT", oEquipmentDetail);
                        that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function () {
                            MessageToast.show(oI18n.getText("asint.equipment.message003"));
                            that.getRouter().navTo("nEquipmentList");
                        }, function (oError) {
                            that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
                            MessageToast.show(oI18n.getText("asint.equipment.message004"));
                        }, eTag);
                    }
                }
            });

        },

        /**
         * 
         */
        fnGetTemplatesMappingData: function () {

            var that = this;
            sap.ui.core.BusyIndicator.show();
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var oI18nBundle = that.getView().getModel("i18n").getResourceBundle();
            var aEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var aAssignedObjectTemplateList = [];

            aEquipmentDetail.to_object_template.forEach(function (oObjectTemplate) {
                aAssignedObjectTemplateList.push(oObjectTemplate.objectTemplate);
            });

            mEquipmentDetail.setProperty("/data/templatesData/assignedTemplates", aAssignedObjectTemplateList);
            mEquipmentDetail.setProperty("/data/templatesData/templatesLinkText", aAssignedObjectTemplateList.length);
            mEquipmentDetail.setProperty("/data/templatesData/tableHeader", oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [aAssignedObjectTemplateList.length]));

        },

        /**
         * Function to fetch detail for all object templates assign to this equipment
         * 
         * @param {Array} mappedTemplates 
         */
        fnFetchAllObjectTemplates: function (mappedTemplates) {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18nBundle = that.getView().getModel("i18n").getResourceBundle();
            var sUrl = "/asint/odata/v4/api/v1/mi/cml/ObjectTemplate?$expand=to_description";
            this.doAjax(sUrl, "GET", null, function (oDataRet) {
                var assignedTemplates = [];
                var unassignedTemplates = [];
                var totalTemplates = [];
                if (Object.keys(oDataRet).length > 0) {
                    var allTemplates = oDataRet.value;
                    if (allTemplates.length > 0) {
                        allTemplates.forEach(function (tempItem) {
                            if (tempItem.type === "EQU") {
                                var tempObj = {
                                    id: tempItem.id,
                                    name: tempItem.name,
                                    type: tempItem.type,
                                    description: ""
                                }
                                if (tempItem.to_description.length > 0) {
                                    tempObj.description = tempItem.to_description[0].shortDescription;
                                }
                                totalTemplates.push(tempObj);
                                var isMapped = false;
                                mappedTemplates.forEach(function (mapped) {
                                    if (mapped.objectTemplate_id === tempItem.id) {
                                        isMapped = true;
                                    }
                                });
                                if (isMapped) {
                                    assignedTemplates.push(tempObj);
                                } else {
                                    unassignedTemplates.push(tempObj);
                                }
                            }
                        });
                    }
                }
                sap.ui.core.BusyIndicator.hide();
                var tempLength = assignedTemplates.length;
                mEquipmentDetail.setProperty("/data/templatesData/allTemplates", totalTemplates);
                mEquipmentDetail.setProperty("/data/templatesData/assignedTemplates", assignedTemplates);
                mEquipmentDetail.setProperty("/data/templatesData/unassignedTemplates", unassignedTemplates);
                mEquipmentDetail.setProperty("/data/templatesData/templatesLinkText", tempLength.toString());
                mEquipmentDetail.setProperty("/data/templatesData/tableHeader", oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [assignedTemplates.length]));
            }.bind(that), function (oError) {
                var err = oError.getParameter("responseText");
                err = JSON.parse(err);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                sap.ui.core.BusyIndicator.hide();
                that.fnMessageShow("E", "Something went wrong", errorDetail);
            }.bind(that))
        },

        /**
         * @description function to open dialog for templates
         * @since 1911
         * @author MM0289 Abhijith | sarath.merangi@asint.net
         */
        onPressObjectTemplatesLink: function () {
            var that = this;
            if (!that._oDialogTemplateList) {
                that._oDialogTemplateList = sap.ui.xmlfragment(
                    this.oView.getId(),
                    "com.asint.ais.mi.equipment.view.fragment.ObjectTemplateListDialog",
                    that
                );
            }
            that.getView().addDependent(that._oDialogTemplateList);
            that._oDialogTemplateList.open();
        },

        /**
         * Event handler for object template dialog close
         */
        onCloseObjectTemplateDialog: function () {
            var that = this;
            if (that._oDialogTemplateList) {
                that._oDialogTemplateList.close();
            }
        },

        /**
         * 
         */
        onAddObjectTemplatePress: function () {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aAssignedTemplate = mEquipmentDetail.getProperty("/data/templatesData/assignedTemplates");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = oEquipmentDetail["@etag"];
            var oI18nBundle = that.getView().getModel("i18n").getResourceBundle();
            // var sHeader = oI18nBundle.getText("asint.equipment.detail.templates.dialog.addTemplate.title.text");
            // var templatesList = mEquipmentDetail.getProperty("/data/templatesData/unassignedTemplates");
            // var oTemplateDialogData = {
            // 	Title: sHeader,
            //     Action:"Add",
            //     TableHeader:oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text",[templatesList.length]),
            //     TemplatesList:templatesList,
            //     IsOkEnabled:false,
            //     SelectedTemplates:[]
            // };
            // mEquipmentDetail.setProperty("/data/TemplateTableData",oTemplateDialogData);
            // that.openAddRemoveTemplateDialog();
            /**
             * 
             * @param {*} oReturn 
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    if (oReturn.selected.length > 0) {
                        oReturn.selected.forEach(function (oItem) {
                            aAssignedTemplate.unshift(oItem);
                        });

                        var aObjectTemplateId = [];

                        aAssignedTemplate.forEach(function (oItem) {
                            aObjectTemplateId.push({
                                "objectTemplate_ID": oItem.ID
                            })
                        });

                        var oPayload = {
                            "to_object_template": aObjectTemplateId,
                            "deleted": false
                        };

                        that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function () {
                            mEquipmentDetail.setProperty("/data/templatesData/assignedTemplates", aAssignedTemplate);
                            mEquipmentDetail.setProperty("/data/templatesData/templatesLinkText", aAssignedTemplate.length);
                            mEquipmentDetail.setProperty("/data/templatesData/tableHeader", oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [aAssignedTemplate.length]));
                        }, function (oError) {
                            that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
                        }, eTag);
                    }
                }
            };

            window._objectType = "EQUI";
            this.objectTemplateValueHelp.handleObjectTemplateValueHelp(fnComplete, true);

        },

        /**
         * Event hander on remove button press for object template 
         */
        onRemoveObjectTemplatePress: function () {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18nBundle = that.getView().getModel("i18n").getResourceBundle();
            var sHeader = oI18nBundle.getText("asint.equipment.detail.templates.dialog.removeTemplate.title.text");
            var templatesList = mEquipmentDetail.getProperty("/data/templatesData/assignedTemplates");
            var oTemplateDialogData = {
                Title: sHeader,
                Action: "Remove",
                TableHeader: oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [templatesList.length]),
                TemplatesList: templatesList,
                IsOkEnabled: false,
                SelectedTemplates: []
            };
            mEquipmentDetail.setProperty("/data/TemplateTableData", oTemplateDialogData);
            that.openAddRemoveTemplateDialog();
        },

        /**
         * Function to open object template dialog
         */
        openAddRemoveTemplateDialog: function () {
            var that = this;
            if (!that._oDialogAddRemoveTemp) {
                that._oDialogAddRemoveTemp = sap.ui.xmlfragment(
                    this.oView.getId(),
                    "com.asint.ais.mi.equipment.view.fragment.AddRemoveTemplateDialog",
                    that
                );
            }
            that.getView().addDependent(that._oDialogAddRemoveTemp);
            var oTable = this.byId("idAsintAddRemoveTemplatesTable");
            if (oTable) {
                oTable.removeSelections();
            }
            that._oDialogAddRemoveTemp.open();
        },

        /**
         * Event handler on object template assignment dialog close
         */
        onCloseAddRemoveTemplateDialog: function () {
            var that = this;
            if (that._oDialogAddRemoveTemp) {
                that._oDialogAddRemoveTemp.close();
            }
        },

        /**
         * Event handler on confirmation of template assignment dialog
         */
        onAddRemoveTemplateOkPress: function () {
            var that = this,
                mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var curTableObjData = mEquipmentDetail.getProperty("/data/TemplateTableData");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = oEquipmentDetail["@etag"];
            var oPayload = {};
            var aSelected = curTableObjData.SelectedTemplates;
            var oI18nBundle = that.getView().getModel("i18n").getResourceBundle();
            var aCurMappedTemplates = mEquipmentDetail.getProperty("/data/templatesData/assignedTemplates");
            // sap.ui.core.BusyIndicator.show();
            var aCurMappedTemplatesFinal = [];
            for (var i = 0; i < aCurMappedTemplates.length; i++) {
                var templateObj = {
                    // eslint-disable-next-line camelcase
                    objectTemplate_ID: aCurMappedTemplates[i].ID
                };
                aCurMappedTemplatesFinal.push(templateObj);
            }
            if (curTableObjData.Action === "Add") {
                aSelected.forEach(function (selItem) {
                    var templateObj = {
                        // eslint-disable-next-line camelcase
                        objectTemplate_ID: selItem.ID
                    };
                    aCurMappedTemplatesFinal.push(templateObj);
                });
            } else {
                // var filteredArr = aSelected.forEach(function (selItem) {
                //     var iIndex;
                //     for (var k = 0; k < aCurMappedTemplatesFinal.length; k++) {
                //         if (selItem.ID === aCurMappedTemplatesFinal[k].objectTemplate_ID) {
                //             iIndex = k;
                //         }
                //     }
                //     if (iIndex == 0 || iIndex > 0) {
                //         aCurMappedTemplatesFinal.splice(iIndex, 1);
                //     }
                // });
            }

            oPayload = {
                "to_object_template": aCurMappedTemplatesFinal,
                "deleted": false
            };

            that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function (oAssignedTemplate) {
                var aAssignedObjectTemplateList = [];

                oAssignedTemplate.to_object_template.forEach(function (oObjectTemplate) {
                    aAssignedObjectTemplateList.push(oObjectTemplate.objectTemplate);
                });

                mEquipmentDetail.setProperty("/data/templatesData/assignedTemplates", aAssignedObjectTemplateList);
                mEquipmentDetail.setProperty("/data/templatesData/templatesLinkText", aAssignedObjectTemplateList.length);
                mEquipmentDetail.setProperty("/data/templatesData/tableHeader", oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [aAssignedObjectTemplateList.length]));
                that._oDialogAddRemoveTemp.close();

            }, function (oError) {
                that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
            }, eTag);

        },

        /**
         * @description Function to search templates
         * @author      sarath.merangi@asint.net
         */
        fnSearchObjectTemplates: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
            sQuery = sQuery.trim();
            if (sQuery === "") {
                this.byId("idAsintTemplatesTable").getBinding("items").filter([]);
            } else {
                var oFilterArr = new Filter([
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("description", FilterOperator.Contains, sQuery),
                ], false);
            }
            this.byId("idAsintTemplatesTable").getBinding("items").filter(oFilterArr);
            var filteredItemsLength = this.byId("idAsintTemplatesTable").getBinding("items").getLength();
            var sNewHeader = oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [filteredItemsLength]);
            this.getView().getModel("mEquipmentDetail").setProperty("/data/templatesData/tableHeader", sNewHeader);
        },

        /**
         * @description Function to search templates
         * @author      sarath.merangi@asint.net
         */
        fnSearchAddRemoveTemplates: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
            sQuery = sQuery.trim();
            if (sQuery === "") {
                this.byId("idAsintAddRemoveTemplatesTable").getBinding("items").filter([]);
            } else {
                var oFilterArr = new Filter([
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("description", FilterOperator.Contains, sQuery),
                ], false);
            }
            this.byId("idAsintAddRemoveTemplatesTable").getBinding("items").filter(oFilterArr);
            var filteredItemsLength = this.byId("idAsintAddRemoveTemplatesTable").getBinding("items").getLength();
            var sNewHeader = oI18nBundle.getText("asint.equipment.detail.templates.dialog.table.tableHeader.text", [filteredItemsLength]);
            this.getView().getModel("mEquipmentDetail").setProperty("/data/TemplateTableData/TableHeader", sNewHeader);
        },

        /**
         * Event handler on template select
         * @param {Object} oEvent 
         */
        onTemplateSelect: function () {
            var oModel = this.getView().getModel("mEquipmentDetail"),
                oTable = this.getView().byId("idAsintAddRemoveTemplatesTable");

            var aSelected = oTable.getSelectedItems();
            var curTableObjData = oModel.getProperty("/data/TemplateTableData");
            if (aSelected.length > 0) {
                curTableObjData.IsOkEnabled = true;
            } else {
                curTableObjData.IsOkEnabled = false;
            }
            var aSelectedTemplates = [];
            aSelected.forEach(function (temp) {
                var sPath = temp.getBindingContextPath();
                aSelectedTemplates.push(oModel.getProperty(sPath));
            });
            curTableObjData.SelectedTemplates = aSelectedTemplates;
            oModel.setProperty("/data/TemplateTableData", curTableObjData);
        },

        /**
         * Function to update editable flags
         */
        onEditDetailFields: function () {
            var oModel = this.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/metadata/detail/isEditable", true);
        },

        /**
         * Function to cancel edit
         */
        onCancelEditFields: function () {
            var oModel = this.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/metadata/detail/isEditable", false);
            oModel.setProperty("/data/detail", oModel.getProperty("/data/detailBackup"));
        },

        /**
         * Function to save the fields data
         */
        onPressSaveFieldsData: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oDetailObj = oModel.getProperty("/data/detail");
            var oPayload = that.fnReturnPayloadForUpdate(oDetailObj);
            if (oPayload && oPayload.to_description && oPayload.to_description.length > 0) {
                if (!oPayload.to_description[0].language) {
                    oPayload.to_description[0].language = "EN";
                }
            }
            var eTag = oModel.getProperty("/data/etag");
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            oPayload = that.setCreatedModified(oPayload, "PUT", oModel.getProperty("/data/createdObj"));
            that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function () {
                oModel.setProperty("/metadata/detail/isEditable", false);
                that.fnMessageShow("S", that._oi18n.getText("asint.equipment.detail.message03"), "", function () {
                    that.fnFetchEquipmentDetail();
                });
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.message02"), errorDetail);
                that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
            }, eTag);
        },

        /**
         * Function to return paylaod for update
         */
        fnReturnPayloadForUpdate: function (oDetailObj) {
            var aKeysToRemove = ["@context", "@etag", "@metadataEtag", "ID", "createdAt", "createdBy", "modifiedAt", "modifiedBy", "to_external_system", "to_external_system_ID", "to_object_template", "parent_equipment", "parent_functional_location", "child_equipments"];
            Object.keys(oDetailObj).forEach(function (sKey) {
                if (aKeysToRemove.includes(sKey)) {
                    delete oDetailObj[sKey]
                }
            });
            return oDetailObj;
        },

        /**
         * 
         */
        onPressShowHierarchy: function () {

            var oModel = this.getView().getModel("mEquipmentDetail");
            var bObjectHierarchy = oModel.getProperty("/metadata/isObjectHierarchy");

            if (bObjectHierarchy) {
                oModel.setProperty("/metadata/isObjectHierarchy", false);
            } else {
                oModel.setProperty("/metadata/isObjectHierarchy", true);
            }

            bObjectHierarchy = oModel.getProperty("/metadata/isObjectHierarchy");

            var oObjectPage = this.getView().byId("_ID_ObjectPageLayout");
            var sObjectHierarchyId = this.getView().byId("idObjectHierarchy").getId();

            if (bObjectHierarchy) {
                oObjectPage.setSelectedSection(sObjectHierarchyId);
            }

        },

        /**
         * To load external system table 
         */
        onExternalIdPress: function () {
            var that = this;
            var oExternalIdData = that.getView().getModel("mEquipmentDetail").getProperty("/data/detail");
            if (oExternalIdData.to_external_system !== null && Object.keys(oExternalIdData.to_external_system).length > 0) {
                var obj = {
                    "systemName": oExternalIdData.to_external_system.description,
                    "externalId": oExternalIdData.srcId
                }
            }
            that.ExternalIdHelper.getExternalId(obj);
        },

        /**
         * Function to fetch assigned classes and characteristics
         */
        fnFetchAssignedClasses: function (fnFinalCallBack) {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oMap = mEquipmentDetail.getProperty("/data/assignments/Classes/objectTemplateMap");
            var iProgress = 0;
            var aAssignedClasses = [];
            var aAssignedClassIds = [];
            /**
             * Local call back function
             */
            var fnComplete = function () {
                iProgress++;
                if (iProgress == 2) {
                    if (aAssignedClasses.length > 0) {
                        that.fnFetchCharacteristicsforClasses(aAssignedClasses, fnFinalCallBack);
                    }else{
                        if(fnFinalCallBack){
                            fnFinalCallBack();
                        }
                    }
                }
            };
            that.dataSource.getEquipmentAssignedClasses(sEquipmentId, function (oData) {
                var aClasses = oData.to_class;
                if (aClasses && aClasses.length > 0) {
                    aClasses.forEach(function (oClass) {
                        var sMappedObjTempId = oClass.objectTemplate_ID;
                        var objClass = oClass.classes;
                        if (objClass) {
                            var sObjMap;
                            if(sMappedObjTempId){
                                sObjMap = oMap[objClass.ID + "_" + sMappedObjTempId];
                            }else{
                                sObjMap = oMap[objClass.ID];
                            }
                            if(!sObjMap){
                                sObjMap = oMap[objClass.ID];
                            }
                            var sObjTempName = "";
                            var sObjTempId = "";
                            if (sObjMap) {
                                sObjTempName = sObjMap.name;
                                sObjTempId = sObjMap.ID;
                            }
                            objClass.objectTemplate = sObjTempName;
                            objClass.objectTemplateId = sObjTempId;
                            aAssignedClasses.push(objClass);
                            aAssignedClassIds.push(objClass.displayId);
                        }
                    });
                }

                var aS4Class = [];
                var aBTPClass = [];
                aAssignedClasses.sort(function(a, b) {
                    var aDesc = a.to_description && a.to_description.length > 0 ? a.to_description[0].shortDescription : "";
                    var bDesc = b.to_description && b.to_description.length > 0 ? b.to_description[0].shortDescription : "";
                    if(aDesc && bDesc){
                        return aDesc.localeCompare(bDesc);
                    }
                });
                aAssignedClasses.forEach(function (oClass) {
                    if (oClass.srcId && oClass.srcId != "BTP") {
                        aS4Class.push(oClass)
                    }else{
                        aBTPClass.push(oClass);
                    }
                });
                mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassList", aAssignedClasses);
                mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassIds", aAssignedClassIds);
                mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassListBTP", aBTPClass);
                mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassListS4", aS4Class);
                mEquipmentDetail.setProperty("/data/assignments/Classes/classTableHeader", that._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [aBTPClass.length]));
                fnComplete();
            }, function (oError) {
                fnComplete();
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.class.message04"), errorDetail);
                that._oLogger.error("An Error Occurred In getEquipmentAssignedClasses :", JSON.stringify(oError));
            });
            that.dataSource.getCharacteristicsValue(sEquipmentId, function (oData) {
                if (oData.to_value && oData.to_value.length > 0) {
                    mEquipmentDetail.setProperty("/data/assignments/equipmentCharValues", oData.to_value);
                }
                fnComplete();
            }, function () {
                mEquipmentDetail.setProperty("/data/assignments/equipmentCharValues", []);
                fnComplete();
            });
        },

        /**
         * Function to fetch characteristics based on classes
         * @param {Array} aClassses 
         */
        fnFetchCharacteristicsforClasses: function (aClassses, fnFinalCallBack) {
            var that = this;
            var aAllChars = [];
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            // var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oMap = mEquipmentDetail.getProperty("/data/assignments/Classes/objectTemplateMap");
            var oClassDict = mEquipmentDetail.getProperty("/data/master/classes/map");
            var aNumberInputs = ["numeric", "Numeric", "currency", "Currency", "Numeric Flexible", "numericFlexible"];
            var aEquVals = mEquipmentDetail.getProperty("/data/assignments/equipmentCharValues");
            var aSrcSystems = [];

            if(!aClassses) {
                aClassses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassList");
            }

            aClassses.forEach(function (oClass) {
                if (oClass && oClass.ID) {
                    var oClassData = oClassDict[oClass.ID];
                    var aChars = oClassData && oClassData.to_characteristic && oClassData.to_characteristic.length > 0 ? oClassData.to_characteristic : [];
                    if (aChars && aChars.length > 0) {
                        aChars.forEach(function (oChar) {
                            var objChar = oChar.characteristic;
                            if (objChar) {
                                if (objChar.codeList_ID) {
                                    var oCodeList = Object.assign({}, objChar.codelist);
                                    if(oCodeList && oCodeList.to_codeListItem){
                                        oCodeList.to_codeListItem.unshift({"code":""});
                                    }
                                    objChar.codeList = oCodeList;
                                }
                                var oFinal = Object.assign({}, objChar);
                                oFinal.classId = oClass.ID;
                                if(oFinal.srcId && !aSrcSystems.includes(oFinal.srcId)){
                                    aSrcSystems.push(oFinal.srcId);
                                }
                                var sClassName = "";
                                if (oClass.to_description && oClass.to_description.length > 0) {
                                    sClassName = oClass.to_description[0].shortDescription;
                                }
                                oFinal.className = sClassName;
                                var sCharValue = "";
                                var sCharUom = "";
                                var sObjMap = oMap[oClass.ID + "_" + oClass.objectTemplateId];
                                var sObjTempId = "";
                                if (sObjMap) {
                                    sObjTempId = sObjMap.ID;
                                }

                                if (aEquVals && aEquVals.length > 0) {
                                    aEquVals.forEach(function (oValue) {
                                        if (oValue.objectTemplate_ID == sObjTempId && oValue.classes_ID == oFinal.classId && oValue.characteristic_ID == oFinal.ID) {
                                            sCharValue = oValue.charValue;
                                            sCharUom = oValue.uom;

                                            if(objChar.multiValue) {
                                                if (typeof sCharValue === "string") {
                                                    try {
                                                        var aCharactericticValue = JSON.parse(sCharValue);

                                                        sCharValue = Array.isArray(aCharactericticValue) ? aCharactericticValue : [];
                                                    } catch (oException) {
                                                        sCharValue = [sCharValue];
                                                    }
                                                } else {
                                                    sCharValue = [];
                                                }
                                            }
                                        }
                                    });
                                }
                                oFinal.charValue = sCharValue;
                                oFinal.charUom = sCharUom;
                                if (!oFinal.charUom) {
                                    oFinal.charUom = oFinal.uom;
                                }
                                oFinal.objectTemplateId = sObjTempId;
                                if (oFinal.dataType == "Date") {
                                    oFinal.renderField = "Date";
                                } else {
                                    oFinal.renderField = "Input";
                                }
                                if (aNumberInputs.includes(oFinal.dataType)) {
                                    oFinal.inputType = "Number";
                                } else {
                                    oFinal.inputType = "Text";
                                }
                                if(oFinal.codeList){
                                    oFinal.renderField = "ComboBox";
                                    if(objChar.multiValue) {
                                        oFinal.renderField = "MultiComboBox";
                                    }
                                }
                                aAllChars.push(oFinal);
                            }
                        })
                    }
                }
            });

            aAllChars.sort(function (a, b) {
                var num1 = a.displayId ? parseInt(a.displayId.split(".")[1], 10) : 0;
                var num2 = b.displayId ? parseInt(b.displayId.split(".")[1], 10) : 0;
                
                return num1 - num2;
            });

            var aS4Chars = [];
            var aBTPChars = [];
            aAllChars.forEach(function (oChar) {
                if (oChar.srcId && oChar.srcId != "BTP") {
                    aS4Chars.push(oChar)
                }else{
                    aBTPChars.push(oChar);
                }
            });
            mEquipmentDetail.setProperty("/data/assignments/Chars/allChars", aAllChars);
            mEquipmentDetail.setProperty("/data/assignments/Chars/allCharsBTP", aBTPChars);
            mEquipmentDetail.setProperty("/data/assignments/Chars/allCharsS4", aS4Chars);
            mEquipmentDetail.setProperty("/data/assignments/Chars/charTableHeader", that._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [aBTPChars.length]));
            var aSrcDropDown = [];
            if(aSrcSystems && aSrcSystems.length > 0){
                aSrcSystems.forEach(function(sSrc){
                    var oTemp = {
                        "key":sSrc,
                        "text":sSrc
                    };
                    aSrcDropDown.push(oTemp);
                })
            }
            mEquipmentDetail.setProperty("/data/assignments/Chars/sourceSystems", aSrcDropDown);
            if(fnFinalCallBack){
                fnFinalCallBack();
            }
        },


        /**
         * Function to update editable flags
         */
        onEditParentInformation: function () {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oEquipmentDetail = oModel.getProperty("/data/detail");

            var oBackup = JSON.parse(JSON.stringify(oEquipmentDetail));

            oModel.setProperty("/data/detailBackup", oBackup);
            oModel.setProperty("/metadata/detail/isEditable", true);
        },

        /**
         * Function to cancel edit
         */
        onCancelParentInformation: function () {
            var oModel = this.getView().getModel("mEquipmentDetail");

            oModel.setProperty("/metadata/detail/isEditable", false);

            // Restore the backup data
            var oBackup = oModel.getProperty("/data/detailBackup");
            oModel.setProperty("/data/detail", JSON.parse(JSON.stringify(oBackup)));
        },

        /**
         * Function to save the fields data
         */
        onSaveParentInformation: function () {

            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            // var oDetailData = oModel.getProperty("/data/detail");
            var eTag = oModel.getProperty("/data/etag");
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            var oSuperOrdinateEquipment = oModel.getProperty("/data/tabs/components/parent/superOrdinateEquipment");
            var oSuperiorFunctionalLocation = oModel.getProperty("/data/tabs/components/parent/superiorFunctionalLocation");
            var aChildEqs = oModel.getProperty("/data/tabs/components/componentInformation/components");
            var isAtleastOneFilled = false;
            var isComponent = false;

            var oPayload = {
                ID: sEquipmentId
            };
            if (oSuperOrdinateEquipment && oSuperOrdinateEquipment.equipmentId) {
                // eslint-disable-next-line camelcase
                oPayload.parent_equipment_ID = oSuperOrdinateEquipment.equipmentId;
                // oPayload.superordinateEquipment = oSuperOrdinateEquipment.equipmentName;
                // oPayload.superordinateEquipmentDescription = oSuperOrdinateEquipment.equipmentDesc;
                isAtleastOneFilled = true;
                aChildEqs.forEach(function(oChild){
                    if(oChild.ID == oSuperOrdinateEquipment.equipmentId){
                        isComponent = true;
                    }
                });

                if(sEquipmentId == oSuperOrdinateEquipment.equipmentId){
                    that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.tab.structure.assign.message006"));
                    return;
                }
            }

            if (oSuperiorFunctionalLocation && oSuperiorFunctionalLocation.functionalLocationId) {
                // eslint-disable-next-line camelcase
                oPayload.parent_functional_location_ID = oSuperiorFunctionalLocation.functionalLocationId;
                // oPayload.functionalLocation = oSuperiorFunctionalLocation.functionalLocationName;
                // oPayload.functionalLocationName = oSuperiorFunctionalLocation.functionalLocationDesc;
                isAtleastOneFilled = true;
            }

            if(!isAtleastOneFilled){
                that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.tab.structure.assign.message004"));
                return;
            }

            if(isComponent){
                that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.tab.structure.assign.message005"));
                return;
            }

            oPayload = that.setCreatedModified(oPayload, "PUT", oModel.getProperty("/data/createdObj"));
            that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function () {
                oModel.setProperty("/metadata/detail/isEditable", false);
                that.fnMessageShow("S", that._oi18n.getText("asint.equipment.detail.message03"), "", function () {
                    that.fnFetchEquipmentDetail();
                });
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.message02"), errorDetail);
                that._oLogger.error("An Error Occurred In updateEquipmentDetail :", JSON.stringify(oError));
            }, eTag);

        },

        /**
         * This function will open valuehelp dialog that will show list of equipments that didn't have any parent
         */
        fnHandleSuperOrdinateEquipmentValueHelp: function (oEvent) {
            var that = this;
            var bClear = oEvent.getSource()._bClearButtonPressed;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();
            if (bClear) {
                that.fnMessageShow("W", oI18n.getText("asint.equipment.detail.message021"), "", function (sAction) {
                    if (sAction == "OK") {
                        var oSuperOrdinateflData = oModel.getProperty("/data/detail/parent_functional_location");
                        var oSuperOrdinateEqData = oModel.getProperty("/data/detail/parent_equipment");
                        that.UnassignTechnicalObject(oSuperOrdinateEqData, oSuperOrdinateflData);
                    } else {
                        that.onCancelParentInformation();
                    }
                });
            } else {
                var aFilter = [
                    new Filter({
                        and: true,
                        filters: [
                            new Filter({
                                path: "srcId",
                                operator: FilterOperator.NE,
                                value1: null
                            }),
                            new Filter({
                                path: "srcId",
                                operator: FilterOperator.NE,
                                value1: ""
                            }),
                            new Filter({
                                path: "srcId",
                                operator: FilterOperator.NE,
                                value1: "BTP"
                            })
                        ]
                    })
                ];
                this.technicalObjectValueHelp.handleEquipmentValueHelp(function (oReturn) {
                    if (oReturn.status === "finished" && oReturn.selected.length > 0) {
                        var oSelectedTechnicalObjectData = {
                            "equipmentId": oReturn.selected[0].ID,
                            "equipmentName": oReturn.selected[0].name,
                            "equipmentDesc": oReturn.selected[0].equipmentDescription,
                            "parentFunctionalLocationId": oReturn.selected[0].parentFunctionalLocationId,
                            "parentFunctionalLocationName": oReturn.selected[0].parentFunctionalLocationName,
                            "parentFunctionalLocationDesc": oReturn.selected[0].parentFunctionalLocationDescription
                        }

                        oModel.setProperty("/data/tabs/components/parent/superOrdinateEquipment", oSelectedTechnicalObjectData);
                        oModel.setProperty("/data/detail/parent_equipment", {
                            "ID": oSelectedTechnicalObjectData.equipmentId,
                            "name": oSelectedTechnicalObjectData.equipmentName,
                            "to_description": [{
                                "shortDescription": oSelectedTechnicalObjectData.equipmentDesc
                            }]
                        });
                        if (oSelectedTechnicalObjectData.parentFunctionalLocationId) {
                            oModel.setProperty("/data/detail/parent_functional_location", {
                                "ID": oSelectedTechnicalObjectData.parentFunctionalLocationId,
                                "name": oSelectedTechnicalObjectData.parentFunctionalLocationName,
                                "to_description": [{
                                    "shortDescription": oSelectedTechnicalObjectData.parentFunctionalLocationDesc
                                }]
                            });

                            oModel.setProperty("/data/tabs/components/parent/superiorFunctionalLocation", {
                                "functionalLocationId": oSelectedTechnicalObjectData.parentFunctionalLocationId,
                                "functionalLocationName": oSelectedTechnicalObjectData.parentFunctionalLocationName,
                                "functionalLocationDesc": [{
                                    "shortDescription": oSelectedTechnicalObjectData.parentFunctionalLocationDesc
                                }]
                            })
                        } else {
                            var oSuperOrdinatefl = oModel.getProperty("/data/detail/parent_functional_location");
                            that.UnassignTechnicalObject(null, oSuperOrdinatefl);
                        }
                    }
                }, false, aFilter);

            }
        },

        /**
         * This function will open valuehelp dialog that will show list of functional location that didn't have any parent
         */
        fnHandleSuperiorfunctionalLocationValueHelp: function (oEvent) {
            var that = this;
            var bClear = oEvent.getSource()._bClearButtonPressed;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();
            if (bClear) {
                that.fnMessageShow("W", oI18n.getText("asint.equipment.detail.message021"), "", function (sAction) {
                    if (sAction == "OK") {
                        var oSuperOrdinateflData = oModel.getProperty("/data/detail/parent_functional_location");
                        var oSuperOrdinateEqData = oModel.getProperty("/data/detail/parent_equipment");
                        that.UnassignTechnicalObject(oSuperOrdinateEqData, oSuperOrdinateflData);
                    } else {
                        that.onCancelParentInformation();
                    }
                });
            } else {
                this.technicalObjectValueHelp.handleFunctionalLocationValueHelp(function (oReturn) {
                    if (oReturn.status === "finished" && oReturn.selected.length > 0) {
                        var oSelectedTechnicalObjectData = {
                            "functionalLocationId": oReturn.selected[0].ID,
                            "functionalLocationName": oReturn.selected[0].name,
                            "functionalLocationDesc": oReturn.selected[0].functionalLocationDescription
                        }

                        oModel.setProperty("/data/tabs/components/parent/superiorFunctionalLocation", oSelectedTechnicalObjectData);
                        oModel.setProperty("/data/detail/parent_functional_location", {
                            "ID": oSelectedTechnicalObjectData.functionalLocationId,
                            "name": oSelectedTechnicalObjectData.functionalLocationName,
                            "to_description": [{
                                "shortDescription": oSelectedTechnicalObjectData.functionalLocationDesc
                            }]
                        });

                        var oSuperOrdinateEq = oModel.getProperty("/data/detail/parent_equipment");

                        that.UnassignTechnicalObject(oSuperOrdinateEq);
                    }
                });
            }

        },

        /**
         * Function handles Object Type Value help Dialog
         */
        onValueHelpRequest: function () {
            if (!this._oEquipmentObjectTypeValueHelpDialog) {
                this._oEquipmentObjectTypeValueHelpDialog = sap.ui.xmlfragment("idObjectTypeHelp",
                    "com.asint.ais.mi.equipment.view.fragment.DialogObjectTypeValueHelp", this);
                this.getView().addDependent(this._oEquipmentObjectTypeValueHelpDialog);
            }

            this._oEquipmentObjectTypeValueHelpDialog.open();
        },

        /**
        * Function handles Currency Value help Dialog
        */
        onValueHelpRequestForCurrency: function () {
            if (!this._oEquipmentObjectCurrencyValueHelpDialog) {
                this._oEquipmentObjectCurrencyValueHelpDialog = sap.ui.xmlfragment("idObjectCurrencyHelp",
                    "com.asint.ais.mi.equipment.view.fragment.CurrencyCodeValueHelp", this);
                this.getView().addDependent(this._oEquipmentObjectCurrencyValueHelpDialog);
            }

            this._oEquipmentObjectCurrencyValueHelpDialog.open();
        },

        /**
        * Function handles Company Code Value help Dialog
        */
        onValueHelpRequestForCompanyCode: function () {
            if (!this._oEquipmentObjectCompanyCode) {
                this._oEquipmentObjectCompanyCode = sap.ui.xmlfragment("idObjectCompanyCodeHelp",
                    "com.asint.ais.mi.equipment.view.fragment.DialogCompanyCodeValueHelp", this);
                this.getView().addDependent(this._oEquipmentObjectCompanyCode);
            }

            this._oEquipmentObjectCompanyCode.open();
        },

        /**
        * Function handles Plant Value help Dialog
        */
        onValueHelpRequestForPlant: function () {

            if (!this._oEquipmentPlantValueHelp) {
                this._oEquipmentPlantValueHelp = sap.ui.xmlfragment("idObjectPlantHelp",
                    "com.asint.ais.mi.equipment.view.fragment.PlantValuehelp", this);
                this.getView().addDependent(this._oEquipmentPlantValueHelp);
            }

            this._oEquipmentPlantValueHelp.open();
        },

        /**
         * Function handles ABC Indicator Value  help Dialog
         */
        onValueHelpRequestForABCindicator: function () {

            if (!this._oEquipmentABCIndicatorValueHelpDialog) {
                this._oEquipmentABCIndicatorValueHelpDialog = sap.ui.xmlfragment("idObjectAbcIndicatorHelp",
                    "com.asint.ais.mi.equipment.view.fragment.ABCIndicator", this);
                this.getView().addDependent(this._oEquipmentABCIndicatorValueHelpDialog);
            }

            this._oEquipmentABCIndicatorValueHelpDialog.open();
        },

        /**
         * Function to select object type
         * @param {Object} oEvent 
         */
        onSelectObjectType: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("masterS4Service");
                var sObjectType = oContext.getProperty("objectType");
                oModel.setProperty("/data/detail/objectType", sObjectType);

                oTable.getParent().close();
            }
        },

        /**
         * Function to close plant value help
         */
        onClosePlant: function () {
            if (this._oEquipmentPlantValueHelp) {
                this._oEquipmentPlantValueHelp.close();
            }
        },

        /**
         * Function to close indicator value help
         */
        onCloseIndicator: function () {
            if (this._oEquipmentABCIndicatorValueHelpDialog) {
                this._oEquipmentABCIndicatorValueHelpDialog.close();
            }
        },

        /**
         * Function to close object type value help
         */
        onCloseType: function () {
            if (this._oEquipmentObjectTypeValueHelpDialog) {
                this._oEquipmentObjectTypeValueHelpDialog.close();
            }
        },

        /**
         * Function to close currency code value help
         */
        onCloseCurrency: function () {
            if (this._oEquipmentObjectCurrencyValueHelpDialog) {
                this._oEquipmentObjectCurrencyValueHelpDialog.close();
            }
        },

        /**
         * Function to close company code value help
         */
        onCloseCompany: function () {
            if (this._oEquipmentObjectCompanyCode) {
                this._oEquipmentObjectCompanyCode.close();
            }
        },

        /**
         * Function to generate description from navigation property
         * 
         * @param {Object} oObject
         */
        fnGenerateDescription: function (oObject) {
             
            if (!oObject) {
                return {
                    shortDescription: "",
                    longDescription: ""
                };
            }
            var oDescription = {
                shortDescription: "",
                longDescription: ""
            };

            if (oObject.to_description && Array.isArray(oObject.to_description)) {
                if (oObject.to_description.length > 0) {
                    oDescription.shortDescription = oObject.to_description[0].shortDescription || "";
                    oDescription.longDescription = oObject.to_description[0].longDescription || "";
                }
            } else if (oObject.to_description) {
                oDescription.shortDescription = oObject.to_description.shortDescription || "";
                oDescription.longDescription = oObject.to_description.longDescription || "";
            }

            oObject.shortDescription = oDescription.shortDescription || "";
            oObject.longDescription = oDescription.longDescription || "";

            return oDescription;
        },
        /**
         * Event handler for Download Report button press
         * 
         */
        onDownloadReport: function () {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oEquipmentDetailData = mEquipmentDetail.getProperty("/data/detail");
            var sTitle = oEquipmentDetailData.name;
            var oEquipmentDetail = {
                "generalInformation": {
                    "objectType": "",
                    "authorizationGroup": "",
                    "inventoryNumber": "",
                    "startUpDate": ""
                },
                "referenceData": {
                    "acquisitionValueOrCurrency": "",
                    "acquisitionValueOrCurrencyUnit": ""
                },
                "manufacturerData": {
                    "assetManufacturerName": "",
                    "modelNumber": "",
                    "partNumber": "",
                    "manufacturerSerialNumber": "",
                    "country": "",
                    "constructionYearOrMonth": "",
                    "constructionYearOrMonthUnit": ""
                },
                "locationData": {
                    "maintenancePlant": "",
                    "functionalLocation": "",
                    "plantSection": "",
                    "functionalLocationDescription": "",
                    "workCenter": "",
                    "sortField": "",
                    "abcIndicator": ""
                },
                "organisation": {
                    "companyCode": "",
                    "businessArea": "",
                    "costCenter": ""
                },
                "responsibilities": {
                    "planningPlant": "",
                    "catalogProfile": "",
                    "plannerGroup": ""
                },
                "structuring": {
                    "superOrdinateEquipmentName": "",
                    "superOrdinateEquipmentDescription": "",
                    "superiorFunctionalLocationName": "",
                    "superiorFunctionalLocationDescription": ""
                },
                "components": [],
                "assignments": {
                    "equipmentTemplates": [],
                    "classes": [],
                    "characteristics": []
                },
                "assetIntelligence": {
                    "highlights": {
                        "riskAndCriticality": {
                            "highestRiskScore": "",
                            "criticality": "",
                            "name": "",
                            "modifiedAt": "",
                            "modifiedBy": ""
                        },
                        "assetStrategy": {
                            "sheMitigated": "",
                            "sheUnmitigated": "",
                            "ecomMitigated": "",
                            "ecomUnmitigated": "",
                            "name": "",
                            "modifiedAt": "",
                            "modifiedBy": ""
                        }
                    },
                    "riskAndCriticality": [],
                    "assetStrategy": [],
                    "recommendation": []
                },
                "error": []
            };

            /**
             * Function to display error and download PDF
             * 
             */
            var fnHandleError = function (oEquipmentDetail, fnCallBack) {
                that.busyDialog.close();
                if (oEquipmentDetail.error && oEquipmentDetail.error.length > 0) {
                    var sMessage = that.fnConvertArrayToHtmlList(oEquipmentDetail.error);
                    that.fnMessageShow("I", oI18n.getText("asint.equipment.export.message004"), sMessage, function (sAction) {
                        if (sAction) {
                            fnCallBack();
                        }
                    });
                } else {
                    fnCallBack();
                }
            };

            /**
             * Function to generate and download PDF from PDFMake
             * 
             */
            var fnDownloadPDF = function (oPDFJson) {
                if (oPDFJson && oPDFJson.content) {
                    oPDFJson.content.unshift({
                        toc: {
                            // id: 'mainToc'  // optional
                            title: {
                                text: oI18n.getText("asint.reusable.tableOfContent.text"),
                                style: "header"
                            }
                        }
                    });
                    oPDFJson.content.unshift({
                        text: sTitle,
                        style: "header",
                        margin: [0, 10, 0, 0],
                        tocItem: false
                    });
                }
                PdfMake.vfs = VfsFonts.pdfMake.vfs;
                PdfMake.createPdf(oPDFJson).download(sTitle.concat(".pdf"));            
                // window.pdfMake.createPdf(oPDFJson).download(sTitle.concat(".pdf"));
            }

            var oPDFJson = {
                content: [],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 30, 0, 0]
                    },
                    label: {
                        //  fontSize: 13,
                        bold: true
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: "black"
                    }
                }
            };

            that.busyDialog.open(oI18n.getText("asint.equipment.export.message002", [sTitle]));
            that.fnPDFGetFooter(function (fnFooterContent) {
                oPDFJson.footer = fnFooterContent;
                that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.tab.generalInfo.title")));
                that.fnPDFGetGeneralInformation(oEquipmentDetail, function (aContent) {
                    oPDFJson.content = oPDFJson.content.concat(aContent);
                    that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.tab.components.title")));
                    that.fnPDFGetComponents(oEquipmentDetail, function (aContent) {
                        oPDFJson.content = oPDFJson.content.concat(aContent);
                        that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title")));
                        that.fnPDFGetAssetIntelligenceHighlight(oEquipmentDetail, function (aContent) {
                            oPDFJson.content = oPDFJson.content.concat(aContent);
                            that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.detail.tab.assetIntelligence.RCA.title")));
                            that.fnPDFGetRiskAndCriticality(oEquipmentDetail, function (aContent) {
                                oPDFJson.content = oPDFJson.content.concat(aContent);
                                that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.detail.tab.assetIntelligence.ASD.title")));
                                that.fnPDFGetAssetStrategy(oEquipmentDetail, function (aContent) {
                                    oPDFJson.content = oPDFJson.content.concat(aContent);
                                    that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendations.title")));
                                    that.fnPDFGetRecommendations(oEquipmentDetail, function (aContent) {
                                        oPDFJson.content = oPDFJson.content.concat(aContent);
                                        that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.tab.assignment.title")));
                                        that.fnPDFGetAssignments(oEquipmentDetail, function (aContent) {
                                            oPDFJson.content = oPDFJson.content.concat(aContent);
                                            that.busyDialog.setText(oI18n.getText("asint.equipment.export.message003", oI18n.getText("asint.equipment.detail.tab.documents.title")));
                                            that.fnPDFGetAttachments(oEquipmentDetail, function (aContent) {
                                                oPDFJson.content = oPDFJson.content.concat(aContent);
                                                that.busyDialog.close();
                                                fnHandleError(oEquipmentDetail, function () {
                                                    fnDownloadPDF(oPDFJson);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

        },

        /**
         * Function to get footer content for PDF
         * 
         * @param {Function} fnSuccess
         */
        fnPDFGetFooter: function (fnSuccess) {

            fnSuccess(function (currentPage, pageCount) {
                return {
                    columns: [
                        {
                            text: (new Date()).toString().split(" GMT")[0],
                            alignment: "center"
                        }, {
                            text: "Copyright © AsInt Inc.",
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
         * Function to get general information content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetGeneralInformation: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var aContent = [];
            var sConstructionYearOrMonth = "";


            that.dataSource.getEquipmentDetailExp(sEquipmentId, function (oResponse) {
                if (oResponse) {

                    if (oResponse.constructionYear && oResponse.constructionMonth) {
                        sConstructionYearOrMonth = oResponse.constructionYear + "/" + oResponse.constructionMonth;
                    } else if (oResponse.constructionYear) {
                        sConstructionYearOrMonth = oResponse.constructionYear;
                    } else if (oResponse.constructionMonth) {
                        sConstructionYearOrMonth = oResponse.constructionMonth;
                    } else {
                        sConstructionYearOrMonth = "";
                    }

                    // var startUpDate = oResponse.operationStartDate ? that.formatter.formatDate(oResponse.operationStartDate) : "";

                    oEquipmentDetail.generalInformation = {
                        "objectType": oResponse.objectType || "",
                        "authorizationGroup": oResponse.authorizationGroup || "",
                        "inventoryNumber": oResponse.inventoryNumber || "",
                        "startUpDate": oResponse.startUpDate || ""
                    };
                    oEquipmentDetail.referenceData = {
                        "acquisitionValueOrCurrency": oResponse.acquisitionValue || "",
                        "acquisitionValueOrCurrencyUnit": oResponse.acquisitionCurrency || ""
                    };
                    oEquipmentDetail.manufacturerData = {
                        "assetManufacturerName": oResponse.assetManufacturerName || "",
                        "modelNumber": oResponse.modelNumber || "",
                        "partNumber": oResponse.manufacturerPartNmbr || "",
                        "manufacturerSerialNumber": oResponse.manufacturerSerialNumber || "",
                        "country": oResponse.manufacturerCountry || "",
                        "constructionYearOrMonth": oResponse.constructionMonth || "",
                        "constructionYearOrMonthUnit": sConstructionYearOrMonth,
                    };
                    oEquipmentDetail.locationData = {
                        "maintenancePlant": oResponse.maintenancePlant || "",
                        "functionalLocation": "",
                        "plantSection": oResponse.plantSection || "",
                        "functionalLocationDescription": "",
                        "workCenter": oResponse.maintenanceWorkCenter || "",
                        "sortField": oResponse.sortField || "",
                        "abcIndicator": oResponse.abcIndicator || ""
                    };
                    if (oResponse.parent_functional_location && oResponse.parent_functional_location.name) {
                        oEquipmentDetail.locationData.functionalLocation = oResponse.parent_functional_location.name
                    }
                    if (oResponse.parent_functional_location && oResponse.parent_functional_location.to_description && oResponse.parent_functional_location.to_description.length > 0) {
                        oEquipmentDetail.locationData.functionalLocationDescription = oResponse.parent_functional_location.to_description[0].shortDescription
                    }
                    oEquipmentDetail.organisation = {
                        "companyCode": oResponse.companyCode || "",
                        "businessArea": oResponse.businessArea || "",
                        "costCenter": oResponse.costCenter || ""
                    };
                    oEquipmentDetail.responsibilities = {
                        "planningPlant": oResponse.planningPlant || "",
                        "catalogProfile": oResponse.catalogProfile || "",
                        "plannerGroup": oResponse.plannerGroup || ""
                    };

                    var oGeneralInformationHeaderMain = {
                        "text": oI18n.getText("asint.equipment.tab.generalInfo.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true
                    };
                    var oGeneralInformationHeader = {
                        "text": oI18n.getText("asint.equipment.tab.generalInfo.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oGeneralInformationHeaderContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oGeneralInformationHeaderContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.field.objectType.label"),
                            oEquipmentDetail.generalInformation.objectType
                        ],
                        [
                            oI18n.getText("asint.equipment.field.inventoryNumber.label"),
                            oEquipmentDetail.generalInformation.inventoryNumber
                        ],
                        [
                            oI18n.getText("asint.equipment.field.authorizationGroup.label"),
                            oEquipmentDetail.generalInformation.authorizationGroup
                        ],
                        [
                            oI18n.getText("asint.equipment.field.startUpDate.label"),
                            oEquipmentDetail.generalInformation.startUpDate
                        ]
                    ];
                    aContent.push([oGeneralInformationHeaderMain, oGeneralInformationHeader, oGeneralInformationHeaderContent]);

                    var oReferenceDataHeader = {
                        "text": oI18n.getText("asint.equipment.tab.referenceData.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oReferenceDataContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oReferenceDataContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.field.acquisitionValCurrency.label"),
                            oEquipmentDetail.referenceData.acquisitionValueOrCurrency + " " + oEquipmentDetail.referenceData.acquisitionValueOrCurrencyUnit
                        ]
                    ];
                    aContent.push([oReferenceDataHeader, oReferenceDataContent]);

                    var oManufacturerDataHeader = {
                        "text": oI18n.getText("asint.equipment.tab.manufacturerData.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oManufacturerDataContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oManufacturerDataContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.field.assetManufacturerName.label"),
                            oEquipmentDetail.manufacturerData.assetManufacturerName
                        ],
                        [
                            oI18n.getText("asint.equipment.field.partNmbr.label"),
                            oEquipmentDetail.manufacturerData.partNumber
                        ],
                        [
                            oI18n.getText("asint.equipment.field.country.label"),
                            oEquipmentDetail.manufacturerData.country
                        ],
                        [
                            oI18n.getText("asint.equipment.field.modelNmbr.label"),
                            oEquipmentDetail.manufacturerData.modelNumber
                        ],
                        [
                            oI18n.getText("asint.equipment.field.manufacturerSerialNumber.label"),
                            oEquipmentDetail.manufacturerData.manufacturerSerialNumber
                        ],
                        [
                            oI18n.getText("asint.equipment.field.constructionYear.label"),
                            oEquipmentDetail.manufacturerData.constructionYearOrMonthUnit
                        ]
                    ];
                    aContent.push([oManufacturerDataHeader, oManufacturerDataContent]);

                    var oLocationDataHeader = {
                        "text": oI18n.getText("asint.equipment.tab.locationData.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oLocationDataContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oLocationDataContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.field.maintPlant.label"),
                            oEquipmentDetail.locationData.maintenancePlant
                        ],
                        [
                            oI18n.getText("asint.equipment.field.plantSection.label"),
                            oEquipmentDetail.locationData.plantSection
                        ],
                        [
                            oI18n.getText("asint.equipment.field.workCenter.label"),
                            oEquipmentDetail.locationData.workCenter
                        ],
                        [
                            oI18n.getText("asint.equipment.field.ABCIndicator.label"),
                            oEquipmentDetail.locationData.abcIndicator
                        ],
                        [
                            oI18n.getText("asint.equipment.field.functionalLocationName.label"),
                            oEquipmentDetail.locationData.functionalLocation
                        ],
                        [
                            oI18n.getText("asint.equipment.field.functionalLocationDesc.label"),
                            oEquipmentDetail.locationData.functionalLocationDescription
                        ],
                        [
                            oI18n.getText("asint.equipment.field.sortField.label"),
                            oEquipmentDetail.locationData.sortField
                        ]
                    ];
                    aContent.push([oLocationDataHeader, oLocationDataContent]);

                    var oOrganisationHeader = {
                        "text": oI18n.getText("asint.equipment.tab.organisation.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oOrganisationContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oOrganisationContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.field.companyCode.label"),
                            oEquipmentDetail.organisation.companyCode
                        ],
                        [
                            oI18n.getText("asint.equipment.field.costCenter.label"),
                            oEquipmentDetail.organisation.costCenter
                        ],
                        [
                            oI18n.getText("asint.equipment.field.businessArea.label"),
                            oEquipmentDetail.organisation.businessArea
                        ]
                    ];
                    aContent.push([oOrganisationHeader, oOrganisationContent]);

                    var oResponsibilitiesHeader = {
                        "text": oI18n.getText("asint.equipment.tab.responsibilities.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oResponsibilitiesContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oResponsibilitiesContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.field.planningPlant.label"),
                            oEquipmentDetail.responsibilities.planningPlant
                        ],
                        [
                            oI18n.getText("asint.equipment.field.plannerGroup.label"),
                            oEquipmentDetail.responsibilities.plannerGroup
                        ],
                        [
                            oI18n.getText("asint.equipment.field.catalogProfile.label"),
                            oEquipmentDetail.responsibilities.catalogProfile
                        ]
                    ];
                    aContent.push([oResponsibilitiesHeader, oResponsibilitiesContent]);

                    if (fnSuccess) {
                        fnSuccess(aContent);
                    }
                } else {
                    oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.generalInfo.title"));
                    fnSuccess([]);
                }
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getEquipmentDetailExp :", JSON.stringify(oError));
                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.generalInfo.title"));
                fnSuccess([]);
            });

        },
        /**
         * Function to get components content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetComponents: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var aContent = [];

            that.dataSource.getEquipmentComponentsExp(sEquipmentId, function (oResponse) {
                if (oResponse) {
                    if (oResponse.parent_functional_location) {
                        that.fnGenerateDescription(oResponse.parent_functional_location);
                        oEquipmentDetail.structuring.superiorFunctionalLocationName = oResponse.parent_functional_location.name || "";
                        oEquipmentDetail.structuring.superiorFunctionalLocationDescription = oResponse.parent_functional_location?.to_description?.[0]?.shortDescription || "";
                    }
                    if (oResponse.parent_equipment) {
                        that.fnGenerateDescription(oResponse.parent_equipment);
                        oEquipmentDetail.structuring.superOrdinateEquipmentName = oResponse.parent_equipment.name || "";
                        oEquipmentDetail.structuring.superOrdinateEquipmentDescription = oResponse.parent_equipment.to_description[0].shortDescription || "";
                    }

                    oEquipmentDetail.components = [];

                    if (oResponse.child_equipments) {
                        oResponse.child_equipments.forEach(function (oChildEquipment) {
                            that.fnGenerateDescription(oChildEquipment);
                            var oComponent = {
                                "name": (oChildEquipment.name + "\n" + oChildEquipment.displayId) || "",
                                "description": oChildEquipment.shortDescription,
                                "category": oChildEquipment.category || "",
                                "objectType": oChildEquipment.objectType || ""
                            };
                            oEquipmentDetail.components.push(oComponent);
                        });
                    }

                    var oComponentHeader = {
                        "text": oI18n.getText("asint.equipment.tab.components.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true
                    };
                    var oParentHeader = {
                        "text": oI18n.getText("asint.equipment.tab.parentInformation.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oParentContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "*"
                            ],
                            "body": []
                        }
                    };

                    oParentContent.table.body = [
                        [
                            oI18n.getText("asint.equipment.tab.parentInformation.form.superOrdinateEquipmentName.text"),
                            oEquipmentDetail.structuring.superOrdinateEquipmentName
                        ],
                        [
                            oI18n.getText("asint.equipment.tab.parentInformation.form.superOrdinateEquipmentDesc.text"),
                            oEquipmentDetail.structuring.superOrdinateEquipmentDescription
                        ],
                        [
                            oI18n.getText("asint.equipment.tab.parentInformation.form.functionalLocationName.text"),
                            oEquipmentDetail.structuring.superiorFunctionalLocationName
                        ],
                        [
                            oI18n.getText("asint.equipment.tab.parentInformation.form.functionalLocationDesc.text"),
                            oEquipmentDetail.structuring.superiorFunctionalLocationDescription
                        ]
                    ];
                    aContent.push([oComponentHeader, oParentHeader, oParentContent]);

                    var oComponentsHeader = {
                        "text": oI18n.getText("asint.equipment.tab.components.title"),
                        "style": "header",
                        "pageOrientation": "portrait",
                        "tocItem": true,
                        "tocMargin": [20, 0, 0, 0]
                    };
                    var oComponentsContent = {
                        "margin": [
                            0,
                            20
                        ],
                        "fontSize": 9,
                        "table": {
                            "headerRows": 1,
                            "widths": [
                                "auto",
                                "auto",
                                "*",
                                "*"
                            ],
                            "body": [
                                [
                                    {
                                        "text": oI18n.getText("asint.equipment.tab.componentInformation.table.column.name.text"),
                                        "style": "tableHeader"
                                    },
                                    {
                                        "text": oI18n.getText("asint.equipment.tab.componentInformation.table.column.description.text"),
                                        "style": "tableHeader"
                                    },
                                    {
                                        "text": oI18n.getText("asint.equipment.tab.componentInformation.table.column.category.text"),
                                        "style": "tableHeader"
                                    },
                                    {
                                        "text": oI18n.getText("asint.equipment.tab.componentInformation.table.column.objectType.text"),
                                        "style": "tableHeader"
                                    }
                                ]
                            ]
                        }
                    };

                    oEquipmentDetail.components.forEach(function (oComponent) {
                        oComponentsContent.table.body.push([
                            (oComponent.name || ""),
                            (oComponent.description || ""),
                            (oComponent.category || ""),
                            (oComponent.objectType || ""),
                        ]);
                    });

                    oComponentsContent = that.fnPDFTableFormatRow(oComponentsContent);
                    aContent.push([oComponentsHeader, oComponentsContent]);

                    if (fnSuccess) {
                        fnSuccess(aContent);
                    }
                } else {
                    oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.components.title"));
                    fnSuccess([]);
                }
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getEquipmentComponentsExp :", JSON.stringify(oError));
                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.components.title"));
                fnSuccess([]);
            });

        },

        /**
         * Function to get assignment data for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetAssignmentsData: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var aObjectTemplateData = [], oClassesData = {}, oCharactersticsData = {};
            var oMasterData = {}, oCharacteristicData = {}, aCharacteristicValue = [], oCharacteristicValue = {};

            /**
             * A callback function
             *
             * @param {Object} aAssignedObjectTemplate
             * @param {Object} oAssignedClasses
             * @param {Object} aCharacteristicValue
             */
            var fnComplete = function (aAssignedObjectTemplate, oAssignedClasses, aCharacteristicValue) {

                aCharacteristicValue.forEach(function (oValue) {
                    var sCharaceristicKey = oValue.objectTemplate_ID + "_" + oValue.classes_ID + "_" + oValue.characteristic_ID;
                    oCharacteristicValue[sCharaceristicKey] = oValue;
                });
                aAssignedObjectTemplate.forEach(function (oObjectTemplateLink) {
                    var oObjectTemplate = oObjectTemplateLink.objectTemplate;

                    if (!oObjectTemplate) {
                        return;
                    }

                    that.fnGenerateDescription(oObjectTemplate);
                    oMasterData[oObjectTemplate.ID] = {
                        "ID": oObjectTemplate.ID,
                        "displayId": oObjectTemplate.displayId,
                        "name": oObjectTemplate.name,
                        "shortDescription": oObjectTemplate.shortDescription,
                        "type": oObjectTemplate.type,
                        "to_class_at_template": [],
                        "to_class": []
                    };

                    oObjectTemplate.to_class.forEach(function (oClassLink) {
                        if (oAssignedClasses[oClassLink.classes_ID]) {
                            oMasterData[oObjectTemplate.ID].to_class.push(oAssignedClasses[oClassLink.classes_ID]);
                        }
                        oMasterData[oObjectTemplate.ID].to_class_at_template.push({
                            "ID": oClassLink.classes_ID
                        });
                    });
                });

                var aMasterData = Object.values(oMasterData);

                aMasterData.forEach(function (oObjectTemplateData) {
                    aObjectTemplateData.push(oObjectTemplateData);
                    oObjectTemplateData.to_class.forEach(function (oClassData) {
                        var sGroupKey = oObjectTemplateData.ID;
                        var oClassRow = Object.assign({
                            objectTemplateId: oObjectTemplateData.ID,
                            objectTemplateDescription: oObjectTemplateData.shortDescription,
                            classId: oClassData.ID
                        }, oClassData);

                        if (!oClassesData[sGroupKey]) {
                            oClassesData[sGroupKey] = {
                                objectTemplateDescription: oObjectTemplateData.shortDescription,
                                list: []
                            }
                        }

                        oClassesData[sGroupKey].list.push(oClassRow);
                        oClassData.to_characteristic.forEach(function (oCharacteristicData) {
                            var sCharaceristicKey = oObjectTemplateData.ID + "_" + oClassData.ID + "_" + oCharacteristicData.ID;
                            var sValue = "", sUoM = "";
                            var sGroupKey = oObjectTemplateData.ID + "_" + oClassData.ID;
                            var oCharacteristicRow = Object.assign({
                                objectTemplateId: oObjectTemplateData.ID,
                                objectTemplateDescription: oObjectTemplateData.shortDescription,
                                classId: oClassData.ID,
                                classDescription: oClassData.shortDescription,
                                characteristicId: oCharacteristicData.ID,
                                value: sValue,
                                valueUom: sUoM
                            }, oCharacteristicData);

                            if (!oCharactersticsData[sGroupKey]) {
                                oCharactersticsData[sGroupKey] = {
                                    objectTemplateDescription: oObjectTemplateData.shortDescription,
                                    classDescription: oClassData.shortDescription,
                                    list: []
                                }
                            }
                            if (oCharacteristicValue[sCharaceristicKey]) {
                                sValue = oCharacteristicValue[sCharaceristicKey].charValue || "";
                                sUoM = oCharacteristicValue[sCharaceristicKey].uom || "";
                            }
                            oCharactersticsData[sGroupKey].list.push(oCharacteristicRow);
                        });
                    });
                });

                fnSuccess(aObjectTemplateData, oClassesData, oCharactersticsData);
            };

            that.dataSource.getEquipmentsAssignmentConfigExpL1(sEquipmentId, function (oResponse) {
                if (oResponse) {
                    var oClassMaster = {}, iClassProgress = 0, iClassError = 0;
                    /**
                     * Class characteristics complete function
                     */
                    var fnFetchClassCharacteristicComplete = function () {
                        iClassProgress++;
                        if (iClassProgress === oResponse.to_class.length) {
                            if (iClassError > 0) {
                                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.assignment.title"));
                                fnSuccess(aObjectTemplateData, oClassesData, oCharactersticsData);
                            } else {
                                that.dataSource.getEquipmentsAssignmentCharcValueExp(sEquipmentId, function (oCharacteristicValue) {
                                    aCharacteristicValue = oCharacteristicValue.to_value;
                                    fnComplete(oResponse.to_object_template, oClassMaster, aCharacteristicValue);
                                }, function (oError) {
                                    that._oLogger.error("An Error Occurred In getEquipmentsAssignmentCharcValueExp :", JSON.stringify(oError));
                                    oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.assignment.title"));
                                    fnSuccess(aObjectTemplateData, oClassesData, oCharactersticsData);
                                });
                            }
                        }
                    };

                    if (oResponse.to_class.length > 0) {
                        oResponse.to_class.forEach(function (oClassLink) {
                            var oClass = oClassLink.classes;
                            if (!oClass) {
                                iClassError++;
                                fnFetchClassCharacteristicComplete();
                                return;
                            }
                            if (oClass) {
                                that.fnGenerateDescription(oClass);
                                oClassMaster[oClass.ID] = {
                                    "ID": oClass.ID,
                                    "displayId": oClass.displayId,
                                    "classNumber": oClass.classNumber,
                                    "shortDescription": oClass.shortDescription,
                                    "type": oClass.classType,
                                    "status": oClass.status,
                                    "srcId": oClass.srcId,
                                    "to_characteristic": []
                                };
                                that.dataSource.getCharacteristicsByClassId(oClass.ID, function (oResponse) {
                                    oResponse.to_characteristic.forEach(function (oCharacteristicLink) {
                                        var oCharacteristic = oCharacteristicLink.characteristic;

                                        that.fnGenerateDescription(oCharacteristic);
                                        oCharacteristicData[oCharacteristic.ID] = {
                                            "ID": oCharacteristic.ID,
                                            "displayId": oCharacteristic.displayId,
                                            "shortDescription": oCharacteristic.shortDescription,
                                            "dataType": oCharacteristic.dataType,
                                            "dimension": oCharacteristic.dimension,
                                            "defaultValue": oCharacteristic.defaultValue,
                                            "srcId": oCharacteristic.srcId
                                        };
                                        oClassMaster[oResponse.ID].to_characteristic.push(oCharacteristicData[oCharacteristic.ID]);
                                    });

                                    fnFetchClassCharacteristicComplete();
                                }, function (oError) {
                                    that._oLogger.error("An Error Occurred In getCharacteristicsByClassId :", JSON.stringify(oError));
                                    iClassError++;
                                    fnFetchClassCharacteristicComplete();
                                });
                            }
                        });
                    } else {
                        fnComplete(oResponse.to_object_template, oClassMaster, aCharacteristicValue);
                    }
                } else {
                    oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.assignment.title"));
                    fnSuccess(aObjectTemplateData, oClassesData, oCharactersticsData);
                }
            }, function (oError) {
                that._oLogger.error("An Error Occurred In getEquipmentsAssignmentConfigExpL1 :", JSON.stringify(oError));
                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.tab.assignment.title"));
                fnSuccess(aObjectTemplateData, oClassesData, oCharactersticsData);
            });

        },

        /**
         * Function to get assignments content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetAssignments: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var aContent = [];
            var oAssignmentsHeader = {
                "text": oI18n.getText("asint.equipment.tab.assignment.title"),
                "style": "header",
                "pageOrientation": "portrait",
                "tocItem": true
            };
            var oEquipmentHeader = {
                "text": oI18n.getText("asint.equipment.tab.objTemp.title"),
                "style": "header",
                "pageOrientation": "portrait",
                "tocItem": true,
                "tocMargin": [20, 0, 0, 0]
            };
            var oEquipmentContent = {
                "margin": [
                    0,
                    20
                ],
                "fontSize": 9,
                "table": {
                    "headerRows": 1,
                    "widths": [
                        "auto",
                        "*"
                    ],
                    "body": [
                        [
                            {
                                "text": oI18n.getText("asint.equipment.tab.objectTemplate.resuable.table.template"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.objectTemplate.resuable.table.type"),
                                "style": "tableHeader"
                            }
                        ]
                    ]
                }
            };
            var oClassHeader = {
                "text": oI18n.getText("asint.equipment.tab.classes.title"),
                "style": "header",
                "pageOrientation": "portrait",
                "tocItem": true,
                "tocMargin": [20, 0, 0, 0]
            };
            var oClassContent = {
                "margin": [
                    0,
                    20
                ],
                "fontSize": 9,
                "table": {
                    "headerRows": 1,
                    "widths": [
                        "auto",
                        "auto",
                        "*",
                        "*"
                    ],
                    "body": [
                        [
                            {
                                "text": oI18n.getText("asint.equipment.tab.classes.class.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.classes.classDesc.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.classes.status.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.classes.srcSys.label"),
                                "style": "tableHeader"
                            }
                        ]
                    ]
                }
            };
            var oCharacteristicHeader = {
                "text": oI18n.getText("asint.equipment.tab.assessments.sharacteristic.title"),
                "style": "header",
                "pageOrientation": "portrait",
                "tocItem": true,
                "tocMargin": [20, 0, 0, 0]
            };
            var oCharacteristicContent = {
                "margin": [
                    0,
                    20
                ],
                "fontSize": 9,
                "table": {
                    "headerRows": 1,
                    "widths": [
                        "auto",
                        "auto",
                        "*",
                        "*",
                        "*",
                        "*",
                        "*"
                    ],
                    "body": [
                        [
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.charName.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.charDesc.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.dataType.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.value.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.dimension.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.uom.label"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.chars.sourceSystme.label"),
                                "style": "tableHeader"
                            }
                        ]
                    ]
                }
            };
            this.fnPDFGetAssignmentsData(oEquipmentDetail, function (aObjectTemplateData, oClassesData, oCharactersticsData) {
                var aClassesDataKey = Object.keys(oClassesData), aCharactersticsDataKey = Object.keys(oCharactersticsData);

                aObjectTemplateData.forEach(function (oObjectTemplate) {
                    oEquipmentContent.table.body.push([
                        (oObjectTemplate.shortDescription + "\n" + oObjectTemplate.displayId),
                        (oObjectTemplate.type || "")
                    ]);
                });
                aClassesDataKey.forEach(function (sClassesDataKey) {
                    if (oClassesData[sClassesDataKey].list.length > 0) {
                        oClassContent.table.body.push([
                            { text: oClassesData[sClassesDataKey].objectTemplateDescription, style: "tableHeader", colSpan: 4 }
                        ]);
                    }
                    oClassesData[sClassesDataKey].list.forEach(function (oClass) {
                        oClassContent.table.body.push([
                            (oClass.classNumber + "\n" + oClass.displayId),
                            (oClass.shortDescription || ""),
                            (oClass.classStatus || ""),
                            (oClass.srcId || "")
                        ]);
                    });
                });
                aCharactersticsDataKey.forEach(function (sCharactersticsDataKey) {
                    if (oCharactersticsData[sCharactersticsDataKey].list.length > 0) {
                        oCharacteristicContent.table.body.push([
                            { text: oCharactersticsData[sCharactersticsDataKey].objectTemplateDescription + " - " + oCharactersticsData[sCharactersticsDataKey].classDescription, style: "tableHeader", colSpan: 7 }
                        ]);
                    }
                    oCharactersticsData[sCharactersticsDataKey].list.forEach(function (oCharacteristic) {
                        oCharacteristicContent.table.body.push([
                            (oCharacteristic.displayId),
                            (oCharacteristic.shortDescription || ""),
                            (oCharacteristic.dataType || ""),
                            ((oCharacteristic.value + " " + oCharacteristic.valueUom) || ""),
                            (oCharacteristic.dimension || ""),
                            (oCharacteristic.uom || ""),
                            (oCharacteristic.srcId || "")
                        ]);
                    });
                });

                oEquipmentContent = that.fnPDFTableFormatRow(oEquipmentContent);
                oClassContent = that.fnPDFTableFormatRow(oClassContent);
                oCharacteristicContent = that.fnPDFTableFormatRow(oCharacteristicContent);
                aContent = [oAssignmentsHeader, oEquipmentHeader, oEquipmentContent, oClassHeader, oClassContent, oCharacteristicHeader, oCharacteristicContent];
                fnSuccess(aContent);
            });

        },


        /**
         * Function to get attachment content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetAttachments: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oAttachmentHeader = {
                "text": oI18n.getText("asint.equipment.detail.tab.documents.title"),
                "style": "header",
                "pageOrientation": "portrait",
                "tocItem": true
            };
            var oHeader = {
                "text": oI18n.getText("asint.equipment.detail.tab.documents.title"),
                "style": "header",
                "pageOrientation": "portrait",
                "tocItem": true,
                "tocMargin": [20, 0, 0, 0]
            };
            var oAttachmentTableContent = {
                "margin": [
                    0,
                    20
                ],
                "fontSize": 9,
                "table": {
                    "headerRows": 1,
                    "widths": [
                        "*",
                        "auto",
                        "auto",
                        "auto",
                        "auto",
                        "auto",
                        "auto"
                    ],
                    "body": [
                        [
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.fileName.text"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.displayId.text"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.confidentiality.text"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.phase.text"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.category.text"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.language.text"),
                                "style": "tableHeader"
                            },
                            {
                                "text": oI18n.getText("asint.equipment.tab.attachments.table.column.fileSize.text"),
                                "style": "tableHeader"
                            }
                        ]
                    ]
                }
            };
            var aContent = [oAttachmentHeader, oHeader];
            /**
             * Complete callback
             *
             * @param {Array} aDocumentData
             * @param {Array} aPictures
             */
            var fnComplete = function (aDocumentData, aPictures) {
                aDocumentData.forEach(function (oDocumentData) {
                    var aDocumentRow = [
                        (oDocumentData.fileName || ""),
                        (oDocumentData.displayId || ""),
                        (oDocumentData.confidentiality || ""),
                        (oDocumentData.phase || ""),
                        (oDocumentData.category || ""),
                        (oDocumentData.language || ""),
                        (oDocumentData.size || ""),
                    ];
                    oAttachmentTableContent.table.body.push(aDocumentRow);
                });
                oAttachmentTableContent = that.fnPDFTableFormatRow(oAttachmentTableContent);
                aContent.push(oAttachmentTableContent);
                for (var i in aPictures) {
                    aContent.push({
                        margin: [0, 20, 0, 0],
                        text: aPictures[i].description
                    }, {
                        image: aPictures[i].photo,
                        width: 500
                    });
                }
                fnSuccess(aContent);
            };

            that.dataSource.getDocumentsId(sEquipmentId, "EQUI", function (oResponse) {
                var aDocumentMetadata = oResponse.to_documents.filter(function (oDocumentMetadata) {
                    return !oDocumentMetadata.deleted;
                });
                var iProgress = 0, iError = 0;
                var aDocumentData = [];
                /**
                 * Complete callback
                 */
                var fnDocumentFetchComplete = function () {
                    iProgress++;
                    if (iProgress === aDocumentMetadata.length) {
                        if (iError > 0) {
                            oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.documents.title"));
                            fnSuccess([]);
                        } else {
                            var aPictures = [];
                            aDocumentData.forEach(function (oDocumentData) {
                                if (oDocumentData.type.startsWith("image/")) {
                                    var sDataUrl = "data:" + oDocumentData.type + ";base64," + oDocumentData.fileContent;
                                    var oPictureObj = {
                                        description: oDocumentData.documentName,
                                        photo: sDataUrl,
                                        modifiedAt: oDocumentData.modifiedAt
                                    }
                                    aPictures.push(oPictureObj);
                                }
                            });
                            fnComplete(aDocumentData, aPictures);
                        }
                    }
                };

                if (aDocumentMetadata.length > 0) {
                    for (var i in aDocumentMetadata) {
                        that.dataSource.getDocumentsByIds(aDocumentMetadata[i].document_ID, function (oDocumentResponse) {
                            oDocumentResponse.documentNameWithoutExtension = oDocumentResponse.to_file.type === "LINK" ? oDocumentResponse.to_file.name : oDocumentResponse.to_file.name.split(".")[0];
                            var oDocumentData = {
                                "fileName": oDocumentResponse.to_file ? oDocumentResponse.to_file.name : "",
                                "displayId": oDocumentResponse.displayId,
                                "confidentiality": oDocumentResponse.confidentiality,
                                "phase": oDocumentResponse.phase,
                                "category": oDocumentResponse.category,
                                "language": oDocumentResponse.language,
                                "size": oDocumentResponse.to_file ? that.formatter.fnConverbytestoSize(oDocumentResponse.to_file.size) : "",
                                "docId": oDocumentResponse.ID,
                                "type": oDocumentResponse.to_file.type,
                                "documentName": oDocumentResponse.to_file.type === "LINK" ? oDocumentResponse.to_file.name : oDocumentResponse.to_file.name.split(".")[0],
                                "modifiedAt": oDocumentResponse.to_file.modifiedAt,
                                "fileContent": oDocumentResponse.to_file.content
                            };
                            aDocumentData.push(oDocumentData);
                            fnDocumentFetchComplete();
                        }, function (oError) {
                            iError++;
                            fnDocumentFetchComplete();
                            that._oLogger.error("An Error Occurred In getDocumentsByIds :", JSON.stringify(oError));
                        });
                    }
                } else {
                    fnComplete([], []);
                }
            }, function () {
                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.documents.title"));
                fnSuccess([]);
            });

        },

        /**
         * Function to get asset intelligence content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetAssetIntelligenceHighlight: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var aContent = [];

            var oSelectedEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var aEquipmentList = [];

            aEquipmentList.push({
                "objectId": oSelectedEquipmentDetail.ID,
                "objectName": oSelectedEquipmentDetail.name,
                "objectType": "EQUI"
            });

            if (oSelectedEquipmentDetail.srcId != "BTP") {
                if (oSelectedEquipmentDetail.child_equipments && oSelectedEquipmentDetail.child_equipments.length > 0) {
                    var oChildEquipmentsData = oSelectedEquipmentDetail.child_equipments;
                    oChildEquipmentsData.forEach(function (oChildEqui) {
                        if (oChildEqui.srcId != "BTP") {
                            aEquipmentList.push({
                                "objectId": oChildEqui.ID,
                                "objectName": oChildEqui.name,
                                "objectType": "EQUI"
                            });
                        }
                    })
                }
            }
            if(that.getView().getModel("mEquipment").getProperty("/metadata/featureFlag/downloadReportEqui") === "1"){
                var oTechnicalObject = mEquipmentDetail.getProperty("/data/detail");
                var sTechnicalObjectId = oTechnicalObject.ID;
                that.dataSource.fnGetRnCAssessment(sTechnicalObjectId, function (oResponse) {
                    if (oResponse && Array.isArray(oResponse) && oResponse.length > 0) {

                        oResponse.sort(function (a, b) {
                            return new Date(b.modifiedat) - new Date(a.modifiedat);
                        });

                        oResponse = oResponse.filter(function (oItem) {
                            return oItem.rcaassesmentstatus === "PBD" && oItem.riskscore;
                        });

                        oResponse.sort(function (a, b) {
                            return new Date(b.modifiedat) - new Date(a.modifiedat);
                        });

                        var oLatest = oResponse[0];

                        var aHighestRiskScore = [], aCriticality = [];

                        if (oLatest) {

                            if (oLatest.riskscore) {
                                aHighestRiskScore.push(oLatest.riskscore);
                            }
                            if (oLatest.criticalitycode) {
                                aCriticality.push(oLatest.criticalitycode);
                            }
                            if (oLatest.criticalitytext) {
                                aCriticality.push(oLatest.criticalitytext);
                            }
                        }

                        oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.highestRiskScore = aHighestRiskScore.join(" - ");
                        oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.criticality = aCriticality.join(" - ");

                        var oAssetIntelligenceHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": true
                        };
                        var oHighlightsHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": true,
                            "tocMargin": [20, 0, 0, 0]
                        };
                        var oRCAHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": false
                        };
                        var oRCAContent = {
                            "margin": [
                                0,
                                20
                            ],
                            "table": {
                                "headerRows": 1,
                                "widths": ["auto", "auto", "auto", "auto", "auto"],
                                "body": []
                            }
                        };

                        oRCAContent.table.body.push([
                            oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.assessment.column.text"),
                            oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.highRiskScore"),
                            oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.criticality"),
                            oI18n.getText("asint.equipment.field.updatedBy.label"),
                            oI18n.getText("asint.equipment.field.updatedOn.label")
                        ]);

                        if (oLatest) {
                            oRCAContent.table.body.push([
                                oLatest.rcaassesmentname || "",
                                oLatest.riskscore || "",
                                (oLatest.criticalitycode && oLatest.criticalitytext)
                                    ? oLatest.criticalitycode + " - " + oLatest.criticalitytext
                                    : (oLatest.criticalitycode || oLatest.criticalitytext || ""),
                                oLatest.modifiedby || "",
                                oLatest.modifiedat ? that.formatter.formatDate(oLatest.modifiedat) : ""
                            ]);
                        }


                        aContent.push([oAssetIntelligenceHeader, oHighlightsHeader, oRCAHeader, oRCAContent]);

                        if (fnSuccess) {
                            fnSuccess(aContent);
                        }
                    } else {
                        oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title"));
                        fnSuccess([]);
                    }
                }, function () {
                    // oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title"));
                    fnSuccess([]);
                });
            } else {
                that.dataSource.fnGetRiskSummary(aEquipmentList, function (oResponse) {
                    if (oResponse && oResponse.response) {
                        oResponse = oResponse.response;
                        var aHighestRiskScore = [], aCriticality = [];

                        if (oResponse["riskScore"]) {
                            aHighestRiskScore.push(oResponse["riskScore"]);
                        }
                        if (oResponse["alphaNumericRiskScore"]) {
                            aHighestRiskScore.push(oResponse["alphaNumericRiskScore"]);
                        }

                        if (oResponse["criticalityCode"]) {
                            aCriticality.push(oResponse["criticalityCode"]);
                        }
                        if (oResponse["criticalityText"]) {
                            aCriticality.push(oResponse["criticalityText"]);
                        }

                        oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.highestRiskScore = aHighestRiskScore.join(" - ") || "";
                        oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.criticality = aCriticality.join(" - ") || "";

                        oEquipmentDetail.assetIntelligence.highlights.assetStrategy.sheMitigated = oResponse["sheMr"] || "";
                        oEquipmentDetail.assetIntelligence.highlights.assetStrategy.sheUnmitigated = oResponse["sheUmr"] || "";
                        oEquipmentDetail.assetIntelligence.highlights.assetStrategy.ecomMitigated = oResponse["ecomMr"] || "";
                        oEquipmentDetail.assetIntelligence.highlights.assetStrategy.ecomUnmitigated = oResponse["ecomUmr"] || "";

                        if (oResponse.rncAssessmentId) {
                            oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.name = oResponse["rcaAssessmentName"] || "";
                            oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.modifiedAt = that.formatter.formatDate(oResponse.rcaAssessmentModifiedAt) || "";
                            oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.modifiedBy = oResponse["rcaAssessmentModifiedBy"] || "";
                        }

                        if (oResponse.asdAssessmentId) {
                            oEquipmentDetail.assetIntelligence.highlights.assetStrategy.name = oResponse["asdAssessmentName"] || "";
                            oEquipmentDetail.assetIntelligence.highlights.assetStrategy.modifiedAt = that.formatter.formatDate(oResponse.asdAssessmentModifiedAt) || "";
                            oEquipmentDetail.assetIntelligence.highlights.assetStrategy.modifiedBy = oResponse["asdAssessmentModifiedBy"] || "";
                        }

                        var oAssetIntelligenceHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": true
                        };
                        var oHighlightsHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": true,
                            "tocMargin": [20, 0, 0, 0]
                        };
                        var oRCAHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": false
                        };
                        var oASDHeader = {
                            "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rbi.title"),
                            "style": "header",
                            "pageOrientation": "portrait",
                            "tocItem": false
                        };
                        var oRCAContent = {
                            "margin": [
                                0,
                                20
                            ],
                            "table": {
                                "headerRows": 1,
                                "widths": [
                                    "auto",
                                    "*"
                                ],
                                "body": []
                            }
                        };

                        oRCAContent.table.body = [
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.assessment.column.text"),
                                oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.name
                            ],
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.highRiskScore"),
                                oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.highestRiskScore
                            ],
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.criticality"),
                                oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.criticality
                            ],
                            [
                                oI18n.getText("asint.equipment.field.updatedBy.label"),
                                oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.modifiedBy
                            ],
                            [
                                oI18n.getText("asint.equipment.field.updatedOn.label"),
                                oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.modifiedAt
                            ]
                        ];

                        var oASDContent = {
                            "margin": [
                                0,
                                20
                            ],
                            "table": {
                                "headerRows": 1,
                                "widths": [
                                    "auto",
                                    "*"
                                ],
                                "body": []
                            }
                        };
                        oASDContent.table.body = [
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.column.text"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.name
                            ],
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.export.sheMitigated"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.sheMitigated
                            ],
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.export.sheUnmitigated"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.sheUnmitigated
                            ],
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.export.ecomMitigated"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.ecomMitigated
                            ],
                            [
                                oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.export.ecomUnmitigated"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.ecomUnmitigated
                            ],
                            [
                                oI18n.getText("asint.equipment.field.updatedBy.label"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.modifiedBy
                            ],
                            [
                                oI18n.getText("asint.equipment.field.updatedOn.label"),
                                oEquipmentDetail.assetIntelligence.highlights.assetStrategy.modifiedAt
                            ]
                        ];

                        aContent.push([oAssetIntelligenceHeader, oHighlightsHeader, oRCAHeader, oRCAContent, oASDHeader, oASDContent]);

                        if (fnSuccess) {
                            fnSuccess(aContent);
                        }
                    } else {
                        oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title"));
                        fnSuccess([]);
                    }
                }, function () {
                    // oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.title"));
                    fnSuccess([]);
                });
            }

        },

        /**
         * Function to get rca content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetRiskAndCriticality: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oEquipmentDetailData = mEquipmentDetail.getProperty("/data/detail");
            var aContent = [];
            var aEquipmentName = [];
            var oAssesmentsData = {}, aAssessmentId = [];
            var iProgress = 0, iError = 0;
            var oStatusMapping = {
                "IN_PROCESS": "In Process",
                "RELEASED": "Released",
                "CREATED": "Created",
                "OBSOLETE": "Obsolete"
            };

            /**
             * Complete callback
             */
            var fnCompleteDetailCall = function () {
                iProgress++;
                if (iProgress === aAssessmentId.length) {
                    if (iError > 0) {
                        oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.RCA.title"));
                        fnSuccess([]);
                    } else {
                        fnRenderPDFContent();
                    }
                }
            };
            /**
             * Function to render PDF content
             */
            var fnRenderPDFContent = function () {
                var oRCAHeader = {
                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.title"),
                    "style": "header",
                    "pageOrientation": "portrait",
                    "tocItem": true,
                    "tocMargin": [20, 0, 0, 0]
                };
                var oRCAContent = {
                    "margin": [
                        0,
                        20
                    ],
                    "fontSize": 9,
                    "table": {
                        "headerRows": 1,
                        "widths": [
                            100,
                            100,
                            "auto",
                            "auto",
                            "auto",
                            "auto",
                            "auto"
                        ],
                        "body": [
                            [
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.assessment.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.assessmentTemp.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.techObj.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.status.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.riskScore.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.criticality.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.rca.table.created.column.text"),
                                    "style": "tableHeader"
                                }
                            ]
                        ]
                    }
                };

                for (var i in aAssessmentId) {
                    var oRCAData = oAssesmentsData[aAssessmentId[i]];
                    var aHighestRiskScore = [], aCriticality = [];

                    if (oRCAData.riskScore) {
                        aHighestRiskScore.push(oRCAData.riskScore);
                    }
                    if (oRCAData.alphanumericRiskScore) {
                        aHighestRiskScore.push(oRCAData.alphanumericRiskScore);
                    }
                    if (oRCAData.criticality.code) {
                        aCriticality.push(oRCAData.criticality.code);
                    }
                    if (oRCAData.criticality.text) {
                        aCriticality.push(oRCAData.criticality.text);
                    }
                    oRCAContent.table.body.push([
                        (oRCAData.displayValue + "\n" + oRCAData.description.short),
                        (oRCAData.assessmentTemplateDisplayValue + "\n" + oRCAData.assessmentTemplateDescription),
                        (oRCAData.technicalObjectNumber + "\n" + oRCAData.technicalObjectDescription),
                        (oStatusMapping[oRCAData.status] || oRCAData.status),
                        (aHighestRiskScore.join(" - ")),
                        (aCriticality.join(" - ")),
                        (oRCAData.createdOn || "")
                    ]);
                }
                oEquipmentDetail.riskAndCriticality = Object.values(oAssesmentsData);

                oRCAContent = that.fnPDFTableFormatRow(oRCAContent);
                aContent.push([oRCAHeader, oRCAContent]);

                if (fnSuccess) {
                    fnSuccess(aContent);
                }
            };

            if (oEquipmentDetailData.srcId != "BTP") {
                aEquipmentName.push(oEquipmentDetailData.name);
                if (oEquipmentDetailData.child_equipments && oEquipmentDetailData.child_equipments.length > 0) {
                    var aChildEquipmentsData = oEquipmentDetailData.child_equipments;
                    for (var i in aChildEquipmentsData) {
                        if (aChildEquipmentsData[i].srcId != "BTP") {
                            aEquipmentName.push(aChildEquipmentsData[i].name);
                        }
                    }
                }
            }
            if(that.getView().getModel("mEquipment").getProperty("/metadata/featureFlag/downloadReportEqui") === "1"){
                var oTechnicalObject = mEquipmentDetail.getProperty("/data/detail") || {};
                that.fnGenerateDescription(oTechnicalObject);
                var sTechnicalObjectId = oTechnicalObject.ID;
                that.dataSource.fnGetRnCAssessment(sTechnicalObjectId, function (oResponse) {
                    if (oResponse && Array.isArray(oResponse) && oResponse.length > 0) {
                        oResponse.forEach(function (oResp) {
                            oAssesmentsData[oResp.rcaassesmentid] = {
                                "displayValue": oResp.rcaassesmentname || "",
                                "description": { "short": oResp.rcaassesmentshortdesc || "" },
                                "assessmentTemplateDisplayValue": oResp.rcatemplatename || "",
                                "assessmentTemplateDescription": oResp.rcatemplateshortdesc || "",
                                "technicalObjectNumber": oTechnicalObject.name || "",
                                "technicalObjectDescription": oTechnicalObject.shortDescription || "",
                                "status": oResp.rcaassesmentstatus ? that.formatter.fnGetStatusText(oResp.rcaassesmentstatus) : "",
                                "riskScore": oResp.riskscore || "",
                                "alphanumericRiskScore": "",
                                "criticality": {
                                    "code": oResp.criticalitycode || "",
                                    "text": oResp.criticalitytext || ""
                                },
                                "createdOn": oResp.rcaassesmentcreatedat ? that.formatter.formatDate(oResp.rcaassesmentcreatedat) : ""
                            };
                            aAssessmentId.push(oResp.rcaassesmentid);
                        });
                    }
                    fnRenderPDFContent();
                }, function () {
                    fnRenderPDFContent();
                });
            } else {
                if (aEquipmentName.length > 0) {
                    that.APMDataSource.getAssessmentList(aEquipmentName, function (oResponse) {
                        if (oResponse && oResponse.data && oResponse.data.assessments && oResponse.data.assessments.edges && oResponse.data.assessments.edges.length > 0) {
                            var aRCAssessment = oResponse.data.assessments.edges;

                            for (var i in aRCAssessment) {
                                var oRCAssessment = aRCAssessment[i];

                                if (oRCAssessment.node.description) {
                                    oRCAssessment.node.description = oRCAssessment.node.description || "";
                                }
                                oAssesmentsData[oRCAssessment.node.id] = Object.assign(oRCAssessment.node, {
                                    "alphanumericRiskScore": "",
                                    "riskScore": "",
                                    "assessmentTemplateDisplayValue": "",
                                    "assessmentTemplateDescriptions": [],
                                    "assessmentTemplateDescription": "",
                                    "technicalObjectNumber": "",
                                    "technicalObjectDescription": "",
                                    "criticality": {
                                        "text": "",
                                        "code": ""
                                    },
                                    "color": ""
                                });
                                aAssessmentId.push(oRCAssessment.node.id);
                            }

                            if (aAssessmentId.length > 0) {
                                for (var j in aAssessmentId) {
                                    that.APMDataSource.getAssessmentDetail(aAssessmentId[j], function (oAssessmentDetail) {
                                        if (oAssessmentDetail.data && oAssessmentDetail.data.assessment && oAssessmentDetail.data.assessment.assignedObject && oAssessmentDetail.data.assessment.assignedObject.length > 0) {
                                            var aAssignedObject = oAssessmentDetail.data.assessment.assignedObject;

                                            for (var k in aAssignedObject) {
                                                var oAssignedObject = aAssignedObject[k];

                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].alphanumericRiskScore = oAssignedObject.alphanumericRiskScore || "";
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].assessmentTemplateDisplayValue = oAssignedObject.assessmentTemplateDisplayValue || "";
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].assessmentTemplateDescriptions = oAssignedObject.assessmentTemplateDescriptions;
                                                if (oAssignedObject.assessmentTemplateDescriptions && oAssignedObject.assessmentTemplateDescriptions.length > 0) {
                                                    oAssesmentsData[oAssessmentDetail.data.assessment.id].assessmentTemplateDescription = oAssignedObject.assessmentTemplateDescriptions[0].short || "";
                                                } else {
                                                    oAssesmentsData[oAssessmentDetail.data.assessment.id].assessmentTemplateDescription = "";
                                                }
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].technicalObjectNumber = oAssignedObject.technicalObjectNumber || "";
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].technicalObjectDescription = oAssignedObject.technicalObjectDescription || "";
                                                if (oAssignedObject.criticality) {
                                                    oAssignedObject.criticality.code = oAssignedObject.criticality.code || "";
                                                    oAssignedObject.criticality.text = oAssignedObject.criticality.text || "";
                                                }
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].riskScore = oAssignedObject.riskScore;
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].criticality = oAssignedObject.criticality;
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].createdOn = that.formatter.formatDate(oAssesmentsData[oAssessmentDetail.data.assessment.id].createdOn, "MMM dd, yyyy");
                                                oAssesmentsData[oAssessmentDetail.data.assessment.id].color = oAssignedObject.color
                                            }
                                            fnCompleteDetailCall();
                                        }
                                    }, function () {
                                        iError++;
                                        fnCompleteDetailCall();
                                    });
                                }
                            } else {
                                fnRenderPDFContent();
                            }
                        } else {
                            fnRenderPDFContent();
                        }
                    }, function () {
                        oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.RCA.title"));
                        fnSuccess([]);
                    });
                } else {
                    fnRenderPDFContent();
                }
            }

        },

        /**
         * Function to get asset strategy content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetAssetStrategy: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var aContent = [];
            var aAssessment = [];

            /**
             * Function to add assessments to final array
             *
             * @param {Object} oAssesment
             * @param {Object} oEquipment
             */
            var fnAddAssessment = function (oAssesment, oEquipment) {
                that.fnGenerateDescription(oEquipment);

                if (oAssesment.category === "ASD") {
                    aAssessment.push({
                        assessmentID: oAssesment.ID || "",
                        assessmentDisplayId: oAssesment.displayId || "",
                        assessmentDesc: oAssesment.to_description?.shortDescription || "",
                        assessmentTempDesc: oAssesment.to_assessmentTemplate?.to_description?.shortDescription || "",
                        assessmentTempDisplayId: oAssesment.to_assessmentTemplate?.displayId || "",
                        assessmentTempID: oAssesment.to_assessmentTemplate?.ID || "",
                        equiID: oEquipment.ID || "",
                        equiName: oEquipment.name || "",
                        equiDesc: oEquipment.shortDescription || "",
                        category: oAssesment.category,
                        createdOn: that.formatter.formatDate(oAssesment.createdAt) || "",
                        failureMode: "",
                        validThrough: "",
                        basePof: "",
                        finalPof: "",
                        economicConsequenceCost: ""
                    });
                }
            };
            /**
             * Function to render PDF content
             */
            var fnRenderPDFContent = function () {
                var oAssetStrategyHeader = {
                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.ASD.title"),
                    "style": "header",
                    "pageOrientation": "portrait",
                    "tocItem": true,
                    "tocMargin": [20, 0, 0, 0]
                };
                var oAssetStrategyContent = {
                    "margin": [
                        0,
                        20
                    ],
                    "fontSize": 9,
                    "table": {
                        "headerRows": 1,
                        "widths": [
                            "*",
                            "auto",
                            "auto",
                            // "auto",
                            // "auto",
                            // "auto",
                            // "auto",
                            // "auto",
                            "auto"
                        ],
                        "body": [
                            [
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessment.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.equi.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.assessmentTemp.column.text"),
                                    "style": "tableHeader"
                                },
                                // {
                                //     "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.failureMode.column.text"),
                                //     "style": "tableHeader"
                                // },
                                // {
                                //     "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.valid.column.text"),
                                //     "style": "tableHeader"
                                // },
                                // {
                                //     "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.base.column.text"),
                                //     "style": "tableHeader"
                                // },
                                // {
                                //     "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.final.column.text"),
                                //     "style": "tableHeader"
                                // },
                                // {
                                //     "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.economic.column.text"),
                                //     "style": "tableHeader"
                                // },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.assessment.table.created.column.text"),
                                    "style": "tableHeader"
                                }
                            ]
                        ]
                    }
                };

                aAssessment.forEach(function (oAssesment) {
                    oAssetStrategyContent.table.body.push([
                        (oAssesment.assessmentDisplayId + "\n" + oAssesment.assessmentDesc),
                        (oAssesment.equiName + "\n" + oAssesment.equiDesc),
                        (oAssesment.assessmentTempDisplayId + "\n" + oAssesment.assessmentTempDesc),
                        // (oAssesment.failureMode || ""),
                        // (oAssesment.validThrough || ""),
                        // (oAssesment.basePof || ""),
                        // (oAssesment.finalPof || ""),
                        // (oAssesment.finalPof || ""),
                        // (oAssesment.economicConsequenceCost || ""),
                        (oAssesment.createdOn || "")
                    ]);
                });
                oEquipmentDetail.assetStrategy = aAssessment;

                oAssetStrategyContent = that.fnPDFTableFormatRow(oAssetStrategyContent);
                aContent.push([oAssetStrategyHeader, oAssetStrategyContent]);

                if (fnSuccess) {
                    fnSuccess(aContent);
                }
            };

            that.dataSource.getAssessmentDetails(sEquipmentId, function (oResponse) {
                if (oResponse) {
                    if (oResponse.to_attached_assessment && oResponse.to_attached_assessment.length > 0) {
                        oResponse.to_attached_assessment.forEach(function (oAssesment) {
                            fnAddAssessment(oAssesment, oResponse);
                        });
                    }
                    if (oResponse.child_equipments && oResponse.child_equipments.length > 0) {
                        oResponse.child_equipments.forEach(function (oEquipment) {
                            if (oEquipment.to_attached_assessment && oEquipment.to_attached_assessment.length > 0) {
                                oEquipment.to_attached_assessment.forEach(function (oAssesment) {
                                    fnAddAssessment(oAssesment, oEquipment);
                                });
                            }
                        });
                    }

                    fnRenderPDFContent();
                } else {
                    oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.ASD.title"));
                    fnSuccess([]);
                }
            }, function () {
                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.ASD.title"));
                fnSuccess([]);
            });

        },

        /**
         * Function to get recommendations content for PDF
         *
         * @param {Object} oEquipmentDetail
         * @param {Function} fnSuccess
         */
        fnPDFGetRecommendations: function (oEquipmentDetail, fnSuccess) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var aContent = [], aRecommendations = [];

            /**
             * Function to render PDF content
             */
            var fnRenderPDFContent = function () {
                var oRecommendationHeader = {
                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendations.title"),
                    "style": "header",
                    "pageOrientation": "portrait",
                    "tocItem": true,
                    "tocMargin": [20, 0, 0, 0]
                };
                var oRecommendationContent = {
                    "margin": [
                        0,
                        20
                    ],
                    "fontSize": 9,
                    "table": {
                        "headerRows": 1,
                        "widths": [
                            "*",
                            "auto",
                            "auto",
                            "auto",
                            "auto"
                        ],
                        "body": [
                            [
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.recommendation.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.longDescription.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.assessment.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.objectType.column.text"),
                                    "style": "tableHeader"
                                },
                                {
                                    "text": oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.targetDate.column.text"),
                                    "style": "tableHeader"
                                }
                            ]
                        ]
                    }
                };

                aRecommendations.forEach(function (oRecommendation) {
                    oRecommendationContent.table.body.push([
                        (oRecommendation.DisplayId + "\n" + oRecommendation.ShortDescription),
                        (oRecommendation.LongDescription || ""),
                        (oRecommendation.AssessmentDisplayId + "\n" + oRecommendation.AssessmentDescription),
                        oI18n.getText("asint.equipment.field.equipmentName.label"),
                        (oRecommendation.TargetDate)
                    ]);
                });
                oEquipmentDetail.recommendation = aRecommendations;
                oRecommendationContent = that.fnPDFTableFormatRow(oRecommendationContent);
                aContent.push([oRecommendationHeader, oRecommendationContent]);

                if (fnSuccess) {
                    fnSuccess(aContent);
                }
            };

            that.dataSource.fnGetRecommendationsByObject(sEquipmentId, "EQUI", function (oResponse) {
                if (oResponse) {
                    oResponse.forEach(function (oRecommendation) {
                        oRecommendation.TargetDate = oRecommendation.TargetDate ? that.formatter.formatDate(oRecommendation.TargetDate) : "";
                        aRecommendations.push(oRecommendation);
                    });
                    fnRenderPDFContent();
                } else {
                    oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendations.title"));
                    fnSuccess([]);
                }
            }, function () {
                oEquipmentDetail.error.push(oI18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendations.title"));
                fnSuccess([]);
            });

        },


        /**
         * Function to check input paramter in construction combobox
         * @param {Object} oEvent 
         */
        onComboBoxChange: function (oEvent) {
            var sNewValue = oEvent.getParameter("newValue");
            var oComboBox = oEvent.getSource();
            var aItems = oComboBox.getItems();
            var bMatchFound = false;
            for (var i = 0; i < aItems.length; i++) {
                if (aItems[i].getText() === sNewValue) {
                    bMatchFound = true;
                    break;
                }
            }

            if (!bMatchFound) {
                oComboBox.setSelectedKey("");
            }
        },


        /**
         * Function select currency from valuehelp
         * @param {Object} oEvent 
         */
        onSelectCurrency: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("masterService");
                var sCurrency = oContext.getProperty("currencyCode");
                oModel.setProperty("/data/detail/acquisitionCurrency", sCurrency);
                oTable.removeSelections();
                oTable.getParent().close();

            }


        },

        /**
         * Function select company from valuehelpg4970
         * @param {Object} oEvent 
         */
        onSelectCompany: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("masterS4Service");
                var sCode = oContext.getProperty("companyCode");
                oModel.setProperty("/data/detail/companyCode", sCode);
                oTable.removeSelections();
                oTable.getParent().close();

            }

        },


        /**
         * Function select planningPlant from valuehelp
         * @param {Object} oEvent 
         */
        onSelectPlant: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("masterS4Service");
                var plant = oContext.getProperty("plant");
                oModel.setProperty("/data/detail/planningPlant", plant);
                oTable.removeSelections();
                oTable.getParent().close();

            }
        },

        /**
         * Function select ABCIndicator from valuehelp
         * @param {Object} oEvent 
         */
        onSelectABC: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();

            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("masterS4Service");
                var indicator = oContext.getProperty("indicator");
                oModel.setProperty("/data/detail/abcIndicator", indicator);
                oTable.removeSelections();
                oTable.getParent().close();

            }
        },


        /**
         * Function to disable the valuehelp temporily while clearing
         * input help field
         * @param {Object} oEvent 
         */
        // onParentEquipmentChange: function (oEvent) {
        //     var oInput = oEvent.mParameters.value;

        //     var oInputForSuperOrdinate = oEvent.getSource();
        //     var sNewValue = oEvent.getParameter("value");

        //     // Check if the clear icon was clicked (sNewValue should be empty)
        //     if (!sNewValue) {
        //         // Temporarily disable the value help
        //         oInputForSuperOrdinate.detachValueHelpRequest(this.fnHandleSuperOrdinateEquipmentValueHelp, this);

        //         // Re-enable the value help after a brief delay
        //         setTimeout(function () {
        //             oInputForSuperOrdinate.attachValueHelpRequest(this.fnHandleSuperOrdinateEquipmentValueHelp, this);
        //         }.bind(this), 100);
        //     }

        //     if (!oInput) {
        //         var oModel = this.getView().getModel("mEquipmentDetail");
        //         oModel.setProperty("/data/detail/parent_equipment/to_description/0/shortDescription", "");
        //     }
        // },

        // /**
        // * Function to disable the valuehelp temporily while clearing
        // * input help field
        // * @param {Object} oEvent 
        // */
        // onParentflocChange: function (oEvent) {
        //     var oInput = oEvent.mParameters.value;

        //     var oInputForSuperOrdinate = oEvent.getSource();
        //     var sNewValue = oEvent.getParameter("value");

        //     // Check if the clear icon was clicked (sNewValue should be empty)
        //     if (!sNewValue) {
        //         // Temporarily disable the value help
        //         oInputForSuperOrdinate.detachValueHelpRequest(this.fnHandleSuperiorfunctionalLocationValueHelp, this);

        //         // Re-enable the value help after a brief delay
        //         setTimeout(function () {
        //             oInputForSuperOrdinate.attachValueHelpRequest(this.fnHandleSuperiorfunctionalLocationValueHelp, this);
        //         }.bind(this), 100);
        //     }


        //     if (!oInput) {
        //         var oModel = this.getView().getModel("mEquipmentDetail");
        //         oModel.setProperty("/data/detail/parent_functional_location/to_description/0/shortDescription", "");
        //     }
        // },

        /**
         * Function to open valuehelp
         * @param {Object} oEvent 
         * @param {String} sObjectType 
         * @param {String} sMode 
         */
        openValueHelp: function (oEvent, sObjectType, sMode) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var bClear = oEvent.getSource()._bClearButtonPressed;
            if (bClear) {
                switch (genreicValueHelpType) {
                case "ABCIndicator":
                    oModel.setProperty("/data/detail/abcIndicator", "");
                    break;
                case "currencyCode":
                    oModel.setProperty("/data/detail/acquisitionCurrency", "");
                    break;
                case "CNCD":
                    oModel.setProperty("/data/detail/companyCode", "");
                    break;
                case "PRGP":
                    oModel.setProperty("/data/detail/plannerGroup", "");
                    break;
                case "CTPL":
                    oModel.setProperty("/data/detail/catalogProfile", "");
                    break;
                case "PLMT":
                    oModel.setProperty("/data/detail/maintenancePlant", "");
                    break;
                case "PLSC":
                    oModel.setProperty("/data/detail/plantSection", "");
                    break;
                case "COST":
                    oModel.setProperty("/data/detail/costCenter", "");
                    break;
                case "CNTR":
                    oModel.setProperty("/data/detail/manufacturerCountry", "");
                    break;
                case "BUSA":
                    oModel.setProperty("/data/detail/businessArea", "");
                    break;
                case "WCTR":
                    oModel.setProperty("/data/detail/maintenanceWorkCenter", "");
                    break;
                case "OBTP":
                    oModel.setProperty("/data/detail/objectType", "");
                    break;
                case "EQUI":
                    oModel.setProperty("/data/dialog/editHeader/category", "");
                    break;
                case "PLPT":
                    oModel.setProperty("/data/detail/planningPlant", "");
                    break;
                default:
                    sDialogTitleKey = "Valuehelp";
                }
            }
            else {
                this.openValueHelpDialog(oEvent, sObjectType, sMode);
            }
        },
        // openValueHelpDialog: function(oEvent,sObjectType) {
        //     if (!this._oValueHelpDialog) {
        //         Fragment.load({
        //             id: this.getView().getId(),
        //             name: "com.asint.ais.mi.equipment.view.fragment.GenericValueHelpdialog",
        //             controller: this
        //         }).then(function(oDialog) {
        //             this._oValueHelpDialog = oDialog;
        //             this.getView().addDependent(oDialog);
        //             this._applyFilter(sObjectType);
        //             oDialog.open();
        //         }.bind(this));
        //     } else {
        //         this._applyFilter(sObjectType);
        //         this._oValueHelpDialog.open();
        //     }
        // },

        // _applyFilter: function(sObjectType) {
        //     this.fnGenericDialogTitle(sObjectType);
        //     var oTable = this.byId("valueHelpTable");
        //     var oBinding = oTable.getBinding("items");
        //     var oFilter = new Filter("objectType", FilterOperator.EQ, sObjectType);
        //     oBinding.filter([oFilter]);
        // },

        // fnGenericDialogTitle:function(sObjectType)
        // {    
        //     this._oi18n = this.getView().getModel("i18n").getResourceBundle();
        //     var oModel=this.getView().getModel("mEquipmentDetail");
        //     oModel.setProperty("/data/genreicValueHelpType",sObjectType);
        //     var sDialogTitleKey="Select ";
        //     switch (sObjectType) {
        //         case "ABCIndicator":
        //             sDialogTitleKey+= this._oi18n.getText("asint.equipment.field.ABCIndicator.label");
        //             break;
        //         case "currencyCode":
        //             sDialogTitleKey+= this._oi18n.getText("asint.equipment.field.currency.label");
        //             break;
        //         default:
        //             sDialogTitleKey = "Valuehelp"; 
        //     }


        //     this._oValueHelpDialog.setTitle(sDialogTitleKey);
        // },

        // onCloseValueHelpDialog: function() {
        //     var oTable = this.byId("valueHelpTable");
        //     var oBinding = oTable.getBinding("items");
        //     var oFilter = new Filter("objectType", FilterOperator.EQ, "AsintAsint");
        //     oBinding.filter([oFilter]);
        //     this._oValueHelpDialog.close();
        // },

        // onSelectValue:function(oEvent){
        //     var oModel=this.getView().getModel("mEquipmentDetail");
        //     var  genreicValueHelpType = oModel.getProperty("/data/genreicValueHelpType");

        //     var oTable = oEvent.getSource();
        //     var oSelectedItem = oTable.getSelectedItem();
        //     var oContext = oSelectedItem.getBindingContext("valueHelpService");
        //     var name = oContext.getProperty("name");

        //     switch (genreicValueHelpType) {
        //     case "ABCIndicator":
        //         oModel.setProperty("/data/detail/abcIndicator", name);
        //         break;
        //     case "currencyCode":
        //         oModel.setProperty("/data/detail/acquisitionCurrency", name);
        //         break;
        //     default:
        //         sDialogTitleKey = "Valuehelp"; 
        //     }
        //     oTable.removeSelections();
        //     this.onCloseValueHelpDialog();


        // }

        /**
         * Function to search in maintenance order table
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {

            var oI18nBundle = this.getView().getModel("i18n").getResourceBundle();
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: "maintenanceOrderMaster/name", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "maintenanceOrderMaster/displayId", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "maintenanceOrderMaster/to_description/0/shortDescription", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "maintenanceOrderMaster/status", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                        new Filter({ path: "maintenanceOrderMaster/orderType", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false })
                    ],
                    and: false
                }));
            }

            this.byId("idAsintMaintenance").getBinding("items").filter(aFilters);
            var filteredItemsLength = this.byId("idAsintMaintenance").getBinding("items").getLength();
            var sNewHeader = oI18nBundle.getText("asint.equipment.detail.dialog.table.maintenanceOrders.tableHeader.text", [filteredItemsLength]);
            this.getView().getModel("mEquipmentDetail").setProperty("/data/maintenanceOrderTitle", sNewHeader);
        },

        /**
         * Function to get the workorders for the technical object.
         */
        onSwitchWorkorderSegmentButton: function () {

            var oTable = this.getView().byId("idAsintMaintenance"),
                oSegmentButton = this.getView().byId("idWorkorderSegment").getSelectedKey(),
                oFilter;

            if (oSegmentButton !== "all") {
                oFilter = new sap.ui.model.Filter({
                    path: "maintenanceOrderMaster/status",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: oSegmentButton,
                    caseSensitive: false
                });
            }

            oTable.getBinding("items").filter(oFilter);

        },

        /**
         * Get Risk Summary based on Equipment Name and It's components
         * 
         */
        fnGetRiskSummary: function () {

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            // this.dataSource.fnGetRiskSummary(aPayload, function (oRiskSummaryList) {

            //     var oRiskSummary = oRiskSummaryList.response;
            //     var sState = "None";

            //     if (oRiskSummary) {
            //         var sRCAModifiedDate = oRiskSummary.modifiedat ? that.formatter.formatDate(oRiskSummary.modifiedat) : "";
            //         // var sASDModifiedDate = oRiskSummary.modifiedat ? that.formatter.formatDate(oRiskSummary.modifiedat) : "";
            //         var sRCACreatedDate = oRiskSummary.rcaAssessmentCreatedAt ? that.formatter.formatDate(oRiskSummary.rcaAssessmentCreatedAt) : "";
            //         // var sASDCreatedDate = oRiskSummary.rcaAssessmentCreatedAt ? that.formatter.formatDate(oRiskSummary.rcaAssessmentCreatedAt) : "";

            //         if (oRiskSummary.criticalityCode) {
            //             var sCode = oRiskSummary.criticalityCode;

            //             if (sCode === "A") {
            //                 sState = "Indication01";
            //             } else if (sCode === "B") {
            //                 sState = "Warning";
            //             } else if (sCode === "C") {
            //                 sState = "Indication02";
            //             } else if (sCode === "D") {
            //                 sState = "Indication03";
            //             } else if (sCode === "E") {
            //                 sState = "Indication04";
            //             } else if (sCode === "M") {
            //                 sState = "Information";
            //             } else if (sCode === "N") {
            //                 sState = "Information";
            //             } else {
            //                 sState = "Indication20";
            //             }
            //         }

            //         var sheMr = "", sheUmr = "", ecoMr = "", ecoUmr = "";
            //         /**
            //          * 
            //          * @param {String} sString 
            //          * @returns 
            //          */
            //         var iGetNumber = function (sString) {
            //             switch (sString) {
            //             case "I":
            //                 return 1;

            //             case "II":
            //                 return 2;

            //             case "III":
            //                 return 3;

            //             case "IV":
            //                 return 4;

            //             case "V":
            //                 return 5;

            //             default:
            //                 break;
            //             }
            //         };

            //         if (oRiskSummary.sheMr) {
            //             var aTemp = oRiskSummary.sheMr.split("-");
            //             if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
            //                 sheMr = iGetNumber(aTemp[0]);
            //             } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
            //                 // eslint-disable-next-line no-unused-vars
            //                 sheMr = iGetNumber(aTemp[1]);
            //             }
            //         }

            //         if (oRiskSummary.sheUmr) {
            //             // eslint-disable-next-line no-redeclare
            //             var aTemp = oRiskSummary.sheUmr.split("-");
            //             if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
            //                 sheUmr = iGetNumber(aTemp[0]);
            //             } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
            //                 // eslint-disable-next-line no-unused-vars
            //                 sheUmr = iGetNumber(aTemp[1]);
            //             }
            //         }

            //         if (oRiskSummary.ecomUmr) {
            //             // eslint-disable-next-line no-redeclare
            //             var aTemp = oRiskSummary.ecomUmr.split("-");
            //             if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
            //                 ecoUmr = iGetNumber(aTemp[0]);
            //             } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
            //                 // eslint-disable-next-line no-unused-vars
            //                 ecoUmr = iGetNumber(aTemp[1]);
            //             }
            //         }

            //         if (oRiskSummary.ecomMr) {
            //             // eslint-disable-next-line no-redeclare
            //             var aTemp = oRiskSummary.ecomMr.split("-");
            //             if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
            //                 ecoMr = iGetNumber(aTemp[0]);
            //             } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
            //                 // eslint-disable-next-line no-unused-vars
            //                 ecoMr = iGetNumber(aTemp[1]);
            //             }
            //         }

            //         var sRCAFormatedCardSubTitle = "";

            //         if (sRCAModifiedDate) {
            //             sRCAFormatedCardSubTitle = (oRiskSummary.rcaAssessmentName ? oRiskSummary.rcaAssessmentName : "") + " " + oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.updatedBy") + " " + oRiskSummary.modifiedat + " (" + sRCAModifiedDate + ")";
            //         } else {
            //             sRCAFormatedCardSubTitle = "";
            //         }

            //         var sASDFormatedCardSubTitle = "";

            //         var sHighestRiskScore = " -";

            //         if (oRiskSummary.riskScore) {
            //             if (oRiskSummary.alphaNumericRiskScore) {
            //                 sHighestRiskScore = oRiskSummary.riskScore + " - " + oRiskSummary.alphaNumericRiskScore;
            //             } else {
            //                 sHighestRiskScore = oRiskSummary.riskScore;
            //             }
            //         } else {
            //             if (oRiskSummary.alphaNumericRiskScore) {
            //                 sHighestRiskScore = oRiskSummary.alphaNumericRiskScore;
            //             }
            //         }
            //         mEquipmentDetail.setProperty("/data/assetIntelligence/highlights", {
            //             "highestRiskScore": sHighestRiskScore,
            //             "criticalityCode": oRiskSummary.criticalityCode,
            //             "criticalityText": oRiskSummary.criticalityText,
            //             "rcaAssessmentModifiedBy": oRiskSummary.rcaAssessmentModifiedBy,
            //             "rcaAssessmentModifiedAt": sRCAModifiedDate ? "(" + sRCAModifiedDate + ")" : "",
            //             "asdAssessmentModifiedBy": oRiskSummary.asdAssessmentModifiedBy,
            //             "asdAssessmentModifiedAt": sASDModifiedDate ? "(" + sASDModifiedDate + ")" : "",
            //             "rcaAssessmentCreatedBy": oRiskSummary.rcaAssessmentCreatedBy,
            //             "rcaAssessmentCreatedAt": sRCACreatedDate ? "(" + sRCACreatedDate + ")" : "",
            //             "asdAssessmentCreatedBy": oRiskSummary.asdAssessmentCreatedBy,
            //             "asdAssessmentCreatedAt": sASDCreatedDate ? "(" + sASDCreatedDate + ")" : "",
            //             "sRCAFormatedCardSubTitle": sRCAFormatedCardSubTitle,
            //             "sASDFormatedCardSubTitle": sASDFormatedCardSubTitle,
            //             "rcaAssessmentName": oRiskSummary.rcaAssessmentName,
            //             "asdAssessmentName": oRiskSummary.asdAssessmentName,
            //             "asdAssessmentShortDesp": oRiskSummary.asdAssessmentShortDesp,
            //             "rcaAssessmentShortDesp": oRiskSummary.rcaAssessmentShortDesp,
            //             "alphaNumericRiskScore": oRiskSummary.alphaNumericRiskScore ? oRiskSummary.alphaNumericRiskScore : "",
            //             "state": sState,
            //             "assetStrategy": [
            //                 {
            //                     "Risk Score": sheUmr,
            //                     "Risk Name": "Unmitigated",
            //                     "Risk Type": "SHE"
            //                 },
            //                 {
            //                     "Risk Score": sheMr,
            //                     "Risk Name": "Mitigated",
            //                     "Risk Type": "SHE"
            //                 },
            //                 {
            //                     "Risk Score": ecoUmr,
            //                     "Risk Name": "Unmitigated",
            //                     "Risk Type": "Financial"
            //                 },
            //                 {
            //                     "Risk Score": ecoMr,
            //                     "Risk Name": "Mitigated",
            //                     "Risk Type": "Financial"
            //                 }
            //             ]
            //         });

            //     } else {
            //         mEquipmentDetail.setProperty("/data/assetIntelligence/highlights", {
            //             "highestRiskScore": "",
            //             "criticalityCode": "",
            //             "criticalityText": "",
            //             "rcaAssessmentModifiedBy": "",
            //             "rcaAssessmentModifiedAt": "",
            //             "asdAssessmentModifiedBy": "",
            //             "asdAssessmentModifiedAt": "",
            //             "rcaAssessmentCreatedBy": "",
            //             "rcaAssessmentCreatedAt": "",
            //             "asdAssessmentCreatedBy": "",
            //             "asdAssessmentCreatedAt": "",
            //             "rcaAssessmentName": "",
            //             "asdAssessmentName": "",
            //             "sRCAFormatedCardSubTitle": "",
            //             "sASDFormatedCardSubTitle": "",
            //             "asdAssessmentShortDesp": "",
            //             "rcaAssessmentShortDesp": "",
            //             "alphaNumericRiskScore": "",
            //             "state": "None",
            //             "assetStrategy": [
            //                 {
            //                     "Risk Score": null,
            //                     "Risk Name": "Unmitigated",
            //                     "Risk Type": "SHE"
            //                 },
            //                 {
            //                     "Risk Score": null,
            //                     "Risk Name": "Mitigated",
            //                     "Risk Type": "SHE"
            //                 },
            //                 {
            //                     "Risk Score": null,
            //                     "Risk Name": "Unmitigated",
            //                     "Risk Type": "Financial"
            //                 },
            //                 {
            //                     "Risk Score": null,
            //                     "Risk Name": "Mitigated",
            //                     "Risk Type": "Financial"
            //                 }
            //             ]
            //         });
            //     }
            // }, function (oError) {
            //     //that.fnMessageShow("E", oI18n.getText("asint.equipment.assetIntelligence.message004"), oError);
                
            // });

            var oTechnicalObject = mEquipmentDetail.getProperty("/data/detail");
            var sTechnicalObjectId = oTechnicalObject.ID;
            if (sTechnicalObjectId) {
                that.dataSource.fnGetRnCAssessment(sTechnicalObjectId, function (aResponse) {
                    aResponse.forEach(function (oItem) {
                        // oItem.rcaassesmentstatus = statusMapping[oItem.rcaassesmentstatus];
                        oItem.rcaassesmentcreatedat = that.formatter.formatDate(oItem.rcaassesmentcreatedat);
                        oItem.technicalObjectNumber = oTechnicalObject.name;
                        oItem.technicalObjectDescription = oTechnicalObject.to_description.length > 0 ? oTechnicalObject.to_description[0].shortDescription : "";
                    })
                    aResponse.sort(function (a, b) {
                        return new Date(b.modifiedat) - new Date(a.modifiedat);
                    });
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", aResponse);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [aResponse.length]));

                    aResponse = aResponse.filter(function (oItem) {
                        return oItem.rcaassesmentstatus === "PBD" && oItem.riskscore;
                    });
                    aResponse.sort(function (a, b) {
                        return new Date(b.modifiedat) - new Date(a.modifiedat);
                    });
                    var oRiskSummary = aResponse[0];
                    var sState = "None";
                    if (oRiskSummary) {
                        var sRCAModifiedDate = oRiskSummary.modifiedat ? that.formatter.formatDate(oRiskSummary.modifiedat) : "";
                        // var sASDModifiedDate = oRiskSummary.asdAssessmentModifiedAt ? that.formatter.formatDate(oRiskSummary.asdAssessmentModifiedAt) : "";
                        var sRCACreatedDate = oRiskSummary.rcaassesmentcreatedat ? that.formatter.formatDate(oRiskSummary.rcaassesmentcreatedat) : "";
                        // var sASDCreatedDate = oRiskSummary.asdAssessmentCreatedAt ? that.formatter.formatDate(oRiskSummary.asdAssessmentCreatedAt) : "";

                        if (oRiskSummary.criticalitycode) {
                            var sCode = oRiskSummary.criticalitycode;

                            if (sCode === "A") {
                                sState = "Indication01";
                            } else if (sCode === "B") {
                                sState = "Warning";
                            } else if (sCode === "C") {
                                sState = "Indication02";
                            } else if (sCode === "D") {
                                sState = "Indication03";
                            } else if (sCode === "E") {
                                sState = "Indication04";
                            } else if (sCode === "M") {
                                sState = "Information";
                            } else if (sCode === "N") {
                                sState = "Information";
                            } else {
                                sState = "Indication20";
                            }
                        }

                        var sheMr = "", sheUmr = "", ecoMr = "", ecoUmr = "";
                        /**
                         * 
                         * @param {String} sString 
                         * @returns 
                         */
                        var iGetNumber = function (sString) {
                            switch (sString) {
                            case "I":
                                return 1;

                            case "II":
                                return 2;

                            case "III":
                                return 3;

                            case "IV":
                                return 4;

                            case "V":
                                return 5;

                            default:
                                break;
                            }
                        };

                        if (oRiskSummary.sheMr) {
                            var aTemp = oRiskSummary.sheMr.split("-");
                            if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
                                sheMr = iGetNumber(aTemp[0]);
                            } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
                                // eslint-disable-next-line no-unused-vars
                                sheMr = iGetNumber(aTemp[1]);
                            }
                        }

                        if (oRiskSummary.sheUmr) {
                            // eslint-disable-next-line no-redeclare
                            var aTemp = oRiskSummary.sheUmr.split("-");
                            if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
                                sheUmr = iGetNumber(aTemp[0]);
                            } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
                                // eslint-disable-next-line no-unused-vars
                                sheUmr = iGetNumber(aTemp[1]);
                            }
                        }

                        if (oRiskSummary.ecomUmr) {
                            // eslint-disable-next-line no-redeclare
                            var aTemp = oRiskSummary.ecomUmr.split("-");
                            if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
                                ecoUmr = iGetNumber(aTemp[0]);
                            } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
                                // eslint-disable-next-line no-unused-vars
                                ecoUmr = iGetNumber(aTemp[1]);
                            }
                        }

                        if (oRiskSummary.ecomMr) {
                            // eslint-disable-next-line no-redeclare
                            var aTemp = oRiskSummary.ecomMr.split("-");
                            if (aTemp[0] === "I" || aTemp[0] === "II" || aTemp[0] === "III" || aTemp[0] === "IV" || aTemp[0] === "V") {
                                ecoMr = iGetNumber(aTemp[0]);
                            } else if (aTemp[1] === "I" || aTemp[1] === "II" || aTemp[1] === "III" || aTemp[1] === "IV" || aTemp[1] === "V") {
                                // eslint-disable-next-line no-unused-vars
                                ecoMr = iGetNumber(aTemp[1]);
                            }
                        }

                        var sRCAFormatedCardSubTitle = "";

                        if (sRCACreatedDate) {
                            sRCAFormatedCardSubTitle = (oRiskSummary.rcaassesmentshortdesc ? oRiskSummary.rcaassesmentshortdesc + "(" + oRiskSummary.rcaassesmentname + ")" : "") + " " + oI18n.getText("asint.equipment.detail.tab.assetIntelligence.highLight.card.rca.updatedBy") + " " + oRiskSummary.modifiedby + " (" + sRCAModifiedDate + ")";
                        } else {
                            sRCAFormatedCardSubTitle = "";
                        }

                        var sHighestRiskScore = " -";

                        if (oRiskSummary.riskscore) {
                            if (oRiskSummary.alphaNumericRiskScore) {
                                sHighestRiskScore = oRiskSummary.riskscore + " - " + oRiskSummary.alphaNumericRiskScore;
                            } else {
                                sHighestRiskScore = oRiskSummary.riskscore;
                            }
                        } else {
                            if (oRiskSummary.alphaNumericRiskScore) {
                                sHighestRiskScore = oRiskSummary.alphaNumericRiskScore;
                            }
                        }
                        mEquipmentDetail.setProperty("/data/assetIntelligence/highlights", {
                            "highestRiskScore": sHighestRiskScore,
                            "criticalityCode": oRiskSummary.criticalitycode,
                            "criticalityText": oRiskSummary.criticalitytext,
                            "rcaAssessmentModifiedBy": oRiskSummary.modifiedBy,
                            "rcaAssessmentModifiedAt": sRCAModifiedDate ? "(" + sRCAModifiedDate + ")" : "",
                            "asdAssessmentModifiedBy": "",
                            "asdAssessmentModifiedAt": "",
                            "rcaAssessmentCreatedBy": oRiskSummary.createdby,
                            "rcaAssessmentCreatedAt": sRCACreatedDate ? "(" + sRCACreatedDate + ")" : "",
                            "asdAssessmentCreatedBy": "",
                            "asdAssessmentCreatedAt": "",
                            "sRCAFormatedCardSubTitle": sRCAFormatedCardSubTitle,
                            "sASDFormatedCardSubTitle": "",
                            "rcaAssessmentName": oRiskSummary.rcaassesmentname,
                            "asdAssessmentName": "",
                            "asdAssessmentShortDesp": "",
                            "rcaAssessmentShortDesp": oRiskSummary.rcaassesmentshortdesc,
                            "alphaNumericRiskScore": oRiskSummary.alphaNumericRiskScore ? oRiskSummary.alphaNumericRiskScore : "",
                            "state": sState,
                            "assetStrategy": [
                                {
                                    "Risk Score": sheUmr,
                                    "Risk Name": "Unmitigated",
                                    "Risk Type": "SHE"
                                },
                                {
                                    "Risk Score": sheMr,
                                    "Risk Name": "Mitigated",
                                    "Risk Type": "SHE"
                                },
                                {
                                    "Risk Score": ecoUmr,
                                    "Risk Name": "Unmitigated",
                                    "Risk Type": "Financial"
                                },
                                {
                                    "Risk Score": ecoMr,
                                    "Risk Name": "Mitigated",
                                    "Risk Type": "Financial"
                                }
                            ]
                        });

                    }
                }, function () {
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData", []);
                    mEquipmentDetail.setProperty("/data/assetIntelligence/RiskCriticality/header", that.oI18n.getText("asint.equipment.detail.tab.assetIntelligence.subSection.RCA.title", [0]));
                    that._oLogger.error("An Error Occurred In fnGetRiskSummary :", JSON.stringify(oError));
                    mEquipmentDetail.setProperty("/data/assetIntelligence/highlights", {
                        "highestRiskScore": "",
                        "criticalityCode": "",
                        "criticalityText": "",
                        "rcaAssessmentModifiedBy": "",
                        "rcaAssessmentModifiedAt": "",
                        "asdAssessmentModifiedBy": "",
                        "asdAssessmentModifiedAt": "",
                        "rcaAssessmentCreatedBy": "",
                        "rcaAssessmentCreatedAt": "",
                        "asdAssessmentCreatedBy": "",
                        "asdAssessmentCreatedAt": "",
                        "rcaAssessmentName": "",
                        "asdAssessmentName": "",
                        "sRCAFormatedCardSubTitle": "",
                        "sASDFormatedCardSubTitle": "",
                        "asdAssessmentShortDesp": "",
                        "rcaAssessmentShortDesp": "",
                        "alphaNumericRiskScore": "",
                        "state": "None",
                        "assetStrategy": [
                            {
                                "Risk Score": null,
                                "Risk Name": "Unmitigated",
                                "Risk Type": "SHE"
                            },
                            {
                                "Risk Score": null,
                                "Risk Name": "Mitigated",
                                "Risk Type": "SHE"
                            },
                            {
                                "Risk Score": null,
                                "Risk Name": "Unmitigated",
                                "Risk Type": "Financial"
                            },
                            {
                                "Risk Score": null,
                                "Risk Name": "Mitigated",
                                "Risk Type": "Financial"
                            }
                        ]
                    });
                });

            }
        },

        /**
         * Function to fetch the notifications priority
         */
        fnGetNotiifcationPriority: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            // var equiId = mEquipmentDetail.getProperty("/data/detail/ID");
            var priorityList = [];
            that.commonDataSource.getNotificationsPriority(function (oDataRec) {                
                if (oDataRec && oDataRec.value && oDataRec.value.length > 0) {
                    oDataRec.value.forEach(function (item) {                
                        if (item.description) {
                            priorityList.push(item);
                        }
                    });
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/priorityList", priorityList);
                }
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.notification.create.message007"), errorDetail);
                that._oLogger.error("An Error Occurred In fnGetNotiifcationPriority :", JSON.stringify(oError));
            })
        },

        /**
         * Function to fetch the notifications type
         */
        fnGetNotiifcationType: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            // var equiId = mEquipmentDetail.getProperty("/data/detail/ID");
            var notificationTypeList = [];
            that.commonDataSource.getNotificationsType(function (oDataRec) {                
                if (oDataRec && oDataRec.value && oDataRec.value.length > 0) {
                    oDataRec.value.forEach(function (item) {                
                        if (item.description) {
                            notificationTypeList.push(item);
                        }
                    });
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notificationTypeList", notificationTypeList);
                }
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.notification.create.message008"), errorDetail);
                that._oLogger.error("An Error Occurred In fnGetNotiifcationType :", JSON.stringify(oError));
            })
        },

        /**
         * Function to fetch the notifications
         */
        fnGetNotiifcation: function () {
            var that = this;
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var equiId = mEquipmentDetail.getProperty("/data/detail/ID");
            var aPrioritylist = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/priorityList");  
            var aTypelist = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/notificationTypeList");                      
            var notificationList = [];
            var sFlocName = mEquipmentDetail.getProperty("/data/detail/parent_functional_location/name");
            var sFlocDesc = mEquipmentDetail.getProperty("/data/detail/parent_functional_location/to_description/0/shortDescription");
            that.dataSource.getAssignedNotifications(equiId, function (oDataRec) {                
                if (oDataRec && oDataRec.notifications && oDataRec.notifications.length > 0) {
                    oDataRec.notifications.forEach(function (item) {
                        if(item.notification){
                            var priorityMatch = aPrioritylist.find(function(priority) {
                                return priority.name === item.notification.priority;
                            });
                        
                            var typeMatch = aTypelist.find(function(type) {
                                return type.name === item.notification.type;
                            });
                            // if (priorityMatch || typeMatch) {
                            item.notification.description = priorityMatch? priorityMatch.description : "";
                            // if (typeMatch !== undefined) {
                            item.notification.notificationType = typeMatch ? typeMatch.description : "";
                            // } else {
                            //     item.notification.notificationType = item.notification.type; 
                            // }
                            item.notification.functionalLocationName = item.notification.functionalLocationName ? item.notification.functionalLocationName : sFlocName;
                            item.notification.functionalLocationDesc = item.notification.functionalLocationDesc ? item.notification.functionalLocationDesc : sFlocDesc;
                            item.notification.breakdown = item.notification.breakdown ? item.notification.breakdown : false;

                            if (item.notification.to_component) {
                                item.notification.componentName = item.notification.to_component.name || "";
                                item.notification.componentID   = item.notification.to_component.ID || "";
                                item.notification.componentType = "EQUI";
                            } else if (item.notification.to_floc_component) {
                                item.notification.componentName = item.notification.to_floc_component.name || "";
                                item.notification.componentID   = item.notification.to_floc_component.ID || "";
                                item.notification.componentType = "FLOC";
                            } else {
                                item.notification.componentName = "";
                                item.notification.componentID   = "";
                                item.notification.componentType = "";
                            }

                            notificationList.push(item.notification)
                        }
                        // }
                        // else {
                        // item.notification.description = item.notification.priority; 
                        // notificationList.push(item.notification)
                        // }
                        
                    });
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList", notificationList);
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList/tableHeader",that._oi18n.getText("asint.equipment.detail.tab.notification.header.text", [notificationList.length]));
                } else {
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList", []);
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList/tableHeader",that._oi18n.getText("asint.equipment.detail.tab.notification.header.text", [0]));
                }
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.notification.create.message003"), errorDetail);
                that._oLogger.error("An Error Occurred In fnGetNotiifcation :", JSON.stringify(oError));
            })
        },

        /**
         * Unassigns technical objecct with the specified unassign key
         */
        UnassignTechnicalObject: function (oEquipment, oFunctionalLocation) {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();

            if (oEquipment && oEquipment.ID) {
                this.dataSource.unAssignComponent(sEquipmentId, function () {
                    oModel.setProperty("/data/detail/parent_equipment/ID", null);
                    oModel.setProperty("/data/detail/parent_equipment/name", "");
                    oModel.setProperty("/data/detail/parent_equipment/to_description/0/shortDescription", "");
                    oModel.setProperty("/data/tabs/components/parent/superOrdinateEquipment", null);
                    oModel.setProperty("/data/detailBackup/parent_equipment/ID", null);
                    oModel.setProperty("/data/detailBackup/parent_equipment/name", "");
                    oModel.setProperty("/data/detailBackup/parent_equipment/to_description/0/shortDescription", "");
                }, function (oError) {
                    var err = JSON.parse(oError.responseText);
                    var errorDetail = "";
                    if (err.error.message) {
                        errorDetail = err.error.message;
                    }
                    that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message022"), errorDetail);
                });
            }

            if (oFunctionalLocation && oFunctionalLocation.ID) {
                this.dataSource.unAssignParentComponent(sEquipmentId, "EQUI", "parent_functional_location_ID", function () {
                    oModel.setProperty("/data/detail/parent_functional_location/ID", null);
                    oModel.setProperty("/data/detail/parent_functional_location/name", "");
                    oModel.setProperty("/data/detail/parent_functional_location/to_description/0/shortDescription", "");
                    oModel.setProperty("/data/tabs/components/parent/superiorFunctionalLocation", null);
                    oModel.setProperty("/data/detailBackup/parent_functional_location/ID", null);
                    oModel.setProperty("/data/detailBackup/parent_functional_location/name", "");
                    oModel.setProperty("/data/detailBackup/parent_functional_location/to_description/0/shortDescription", "");
                }, function (oError) {
                    var err = JSON.parse(oError.responseText);
                    var errorDetail = "";
                    if (err.error.message) {
                        errorDetail = err.error.message;
                    }
                    that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message023"), errorDetail);
                });
            }
        },

        /**
         * Restrict date for future
         * @param {Object} oEvent 
         */
        onDateChange: function(oEvent) {
            var oDatePicker = oEvent.getSource();
            var sSelectedDate = oDatePicker.getValue(); 
            var oSelectedDate = new Date(sSelectedDate);
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            
            var oToday = new Date();
            oToday.setHours(0, 0, 0, 0); 

            var oEndOfYear = new Date(oToday.getFullYear(), 11, 31);
        
            if (oSelectedDate > oToday) {
                sap.m.MessageToast.show(oBundle.getText("asint.equipment.detail.message026"));
                oDatePicker.setValue(null); 
            } else if (oSelectedDate > oEndOfYear) {
                sap.m.MessageToast.show(oBundle.getText("asint.equipment.detail.message027"));
                oDatePicker.setValue(null); 
            }
        },
        

        /**
         * Function to enable edit for characteristic values
         */
        onCharValuesEditBtnPress: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/data/assignments/Chars/isEditable", true);
        },

        /**
         * Function to enable edit for characteristic values
         */
        onCanceCharValuesEdit: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/data/assignments/Chars/isEditable", false);
        },

        /**
         * Function to handle char values save
         */
        onPressCharValuesSave: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            var aEquVals = oModel.getProperty("/data/assignments/equipmentCharValues");
            var currentTab = oModel.getProperty("/data/tabs/selectedTab");
            var aCurCharsList = oModel.getProperty("/data/assignments/Chars/allCharsBTP");
            if(currentTab === "classificationmda"){
                aCurCharsList = oModel.getProperty("/data/assignments/Chars/allCharsS4");
            }
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            var eTag = oModel.getProperty("/data/etag");
            aCurCharsList.forEach(function (oChar) {
                // if (oChar.charValue) {
                var isFound = false;

                if (oChar.multiValue) {
                    oChar.charValue = Array.isArray(oChar.charValue) ? JSON.stringify(oChar.charValue) : null;
                } else if (Array.isArray(oChar.charValue)) {
                    oChar.charValue = null;
                }

                aEquVals.forEach(function (oValue) {
                    if (oValue.characteristic_ID == oChar.ID && oValue.classes_ID == oChar.classId && oValue.objectTemplate_ID == oChar.objectTemplateId) {
                        oValue.charValue = oChar.charValue;
                        oValue.uom = oChar.charUom;
                        isFound = true;
                    }
                });

                if (!isFound) {
                    var oValObj = {
                        "charValue": oChar.charValue,
                        "deleted": false,
                        "uom": oChar.charUom,
                        "objectTemplate_ID": oChar.objectTemplateId,
                        "equipment_ID": sEquipmentId,
                        "classes_ID": oChar.classId,
                        "characteristic_ID": oChar.ID
                    }
                    aEquVals.push(oValObj);
                }
                // }
            })
            var oPayload = {
                "ID": sEquipmentId,
                "to_value": aEquVals
            };
            that.dataSource.updateEquipmentCharacteristicsValue(sEquipmentId, oPayload, function (oData) {
                oModel.setProperty("/data/etag", oData["@etag"]);
                if(currentTab === "classificationmda"){
                    oModel.setProperty("/data/assignments/Chars/isClassificationEditable", false);
                }else{
                    oModel.setProperty("/data/assignments/Chars/isEditable", false);
                }
                that.dataSource.getCharacteristicsValue(sEquipmentId, function (oData) {
                    if (oData.to_value && oData.to_value.length > 0) {
                        oModel.setProperty("/data/assignments/equipmentCharValues", oData.to_value);
                    }
                    that.fnFetchCharacteristicsforClasses();
                    that.fnMessageShow("S", that._oi18n.getText("asint.equipment.values.message01"));
                }, function () { });
            }, function () {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.values.message02"));
            }, eTag)
        },
        /**
         * Function to select componenet type dropdown
         */
        fnSelectComponentTypeDropdown:function(){
            var oModel = this.getView().getModel("mEquipmentDetail");
            var mEquipment=this.getView().getModel("mEquipment");
            var oDetail=oModel.getProperty("/data/detail");
            var aAllComponentType=mEquipment.getProperty("/data/aAllComponentType");
            var selectedComponentType=[];
            var objectType=oDetail.objectType;
            
            if(aAllComponentType && aAllComponentType.length){
                aAllComponentType.forEach(function(oItem){
                    if (oItem["Parent Asset Object Type"] === objectType) {
                        selectedComponentType.push(oItem);
                    }
                })
                oModel.setProperty("/data/componentTypes",selectedComponentType);
            }else{
                oModel.setProperty("/data/componentTypes",[]);
            }
        },

        /**
         * Function to navigate to CML detail page
         */
        onPressNavigateToCML : function(){
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var sHashWithKeyword = this.NAVIGATION.CML_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{equipmentId}", sEquipmentId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        },
        
        /**
         * Function to handle MultiComboBox selection finish event
         */
        onMultiComboBoxSelectionFinish: function (oEvent) {
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sPath = oEvent.getSource().getBinding("selectedKeys").getResolvedPath();

            mEquipmentDetail.setProperty(sPath, oEvent.getSource().getSelectedKeys());
        },

        /**
         * 
         */
        onPressAIRecommendation: function () {
            var oFlexiColLayout = this.getView().byId("idFlexiColLayoutDetail");
            oFlexiColLayout.setLayout("TwoColumnsBeginExpanded")
            this.fnGetDataForAIRecommendationQuery();
        },

        /**
         * function to call the api to fetch the data for ai recommendation and then call the ai recommendation api
         */
        fnGetDataForAIRecommendationQuery: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var iCount = 0;
            var iTotal = 3;
            var oResults = { asd: null, inspection: null, cml: null };
            var oErrors  = { asd: null, inspection: null, cml: null };

            /**
             * function to check if all the api are completed and then procced and call the ai recommendation api
             */
            function fnCheckAllDone() {
                iCount++;
                if (iCount < iTotal) {
                    return;
                }

                var aFailed = [];
                if (oErrors.asd){ 
                    aFailed.push("ASD"); 
                }
                if (oErrors.cml){ 
                    aFailed.push("CML"); 
                }
                if (oErrors.inspection){ 
                    aFailed.push("Inspection"); 
                }

                if (aFailed.length > 0) {
                    that.fnMessageShow("E", "Error occurred while fetching " + aFailed.join(", ").toLowerCase() + " data.");
                    return;
                }
                var oDetail = mEquipmentDetail.getProperty("/data/detail") || {};
                var aDescriptions = oDetail.to_description || [];
                var sShortDesc = aDescriptions.length > 0 ? aDescriptions[0].shortDescription : "";

                var oEquipmentData = {
                    "equipment":           oDetail.name || "",
                    "description":         sShortDesc,
                    "equipment_category":  oDetail.category || "",
                    "functional_location": oDetail.functionalLocation || "",
                    "model":               oDetail.modelNumber || "",   
                    "plant":               oDetail.planningPlant || "",
                    "work_center":         oDetail.maintenanceWorkCenter || "",
                    "maintenance_plant":   oDetail.maintenancePlant || "",
                    "cost_center":         oDetail.costCenter || "",
                    "construction_year":   oDetail.constructionYear || "",
                    "serial_number":       oDetail.serialNumber || "",
                    "catalog_profile":     oDetail.catalogProfile || ""
                };
                var oPayload = {
                    "query": {
                        "equipment_data": oEquipmentData,
                        "asset_strategy_development": oResults.asd,
                        "inspection_history": oResults.inspection,
                        "cmls": oResults.cml
                    }
                };

                that.dataSource.getAISumaryDetails(oPayload, "EQUI", function (oData) {
                    if (!oData || Object.keys(oData).length === 0) {
                        that.fnMessageShow("I", that._oi18n.getText("asint.equipment.detail.aiRecommendation.message002"));
                        return;
                    }

                    /**
                     * Function to convert string to title case
                     */
                    function toTitleCase(str) {
                        return str.replace(/\w\S*/g, function(txt) {
                            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                        });
                    }

                    /**
                     * Function to capitalize specific acronyms (asd, rbi, cml, pm, sap, msp, ffs, sme, ai, btp)
                     */
                    function capitalizeAcronyms(str) {
                        return str.replace(/\b(asd|rbi|cml|pm|sap|msp|ffs|sme|ai|btp|iso)\b/gi, function(match) {
                            return match.toUpperCase();
                        });
                    }

                    /**
                     * Recursive function to transform the entire JSON object
                     */
                    function transformObject(obj) {
                        if (typeof obj === "string") {
                            return capitalizeAcronyms(obj);
                        } else if (Array.isArray(obj)) {
                            return obj.map(transformObject);
                        } else if (obj !== null && typeof obj === "object") {
                            var newObj = {};
                            for (var key in obj) {
                                var newKey = key.replace(/_/g, " ");
                                newKey = toTitleCase(newKey);
                                newKey = capitalizeAcronyms(newKey);
                                newObj[newKey] = transformObject(obj[key]);
                            }
                            return newObj;
                        } else {
                            return obj;
                        }
                    }

                    // Transform the entire oData object
                    oData = transformObject(oData);

                    /**
                     * 
                     */
                    function formatHeading(k) {
                        return k.replace(/_/g, " ").toUpperCase();
                    }

                    /**
                     * 
                     */
                    function formatInnerKey(k) {
                        return k.replace(/_/g, " ");
                    }

                    /**
                     * 
                     */
                    function renderPrimitive(val) {
                        return new sap.m.Text({ text: String(val), wrapping: true }).addStyleClass("rbiValue");
                    }

                    /**
                     * 
                     */
                    function renderArray(arr) {
                        var vbox = new sap.m.VBox({ renderType: sap.m.FlexRendertype.Bare });
                        var i;
                        if (arr.length === 0) {
                            vbox.addItem(new sap.m.Text({ text: "—" }));
                            return vbox;
                        }
                        for (i = 0; i < arr.length; i++) {
                            vbox.addItem(
                                new sap.m.HBox({
                                    renderType: sap.m.FlexRendertype.Bare,
                                    items: [
                                        new sap.m.Text({ text: "\u2022" }).addStyleClass("rbiBullet"),
                                        renderValue(arr[i])
                                    ]
                                })
                            );
                        }
                        return vbox;
                    }

                    /**
                     * 
                     */
                    function renderObject(obj) {
                        var vbox = new sap.m.VBox({ renderType: sap.m.FlexRendertype.Bare });
                        var keys = Object.keys(obj);
                        var i, k, v;
                        for (i = 0; i < keys.length; i++) {
                            k = keys[i];
                            v = obj[k];
                            vbox.addItem(
                                new sap.m.HBox({
                                    renderType: sap.m.FlexRendertype.Bare,
                                    alignItems: sap.m.FlexAlignItems.Start,
                                    items: [
                                        new sap.m.Label({
                                            text: formatInnerKey(k) + ":",
                                            wrapping: true
                                        }).addStyleClass("rbiNestedKey"),
                                        renderValue(v)
                                    ]
                                }).addStyleClass("rbiNestedKVRow")
                            );
                        }
                        return vbox;
                    }

                    /**
                     *
                     */
                    function renderValue(val) {
                        if (Array.isArray(val)){ 
                            return renderArray(val); 
                        }
                        if (val !== null && typeof val === "object") { 
                            return renderObject(val);
                        }
                        return renderPrimitive(val);
                    }

                    /**
                     *
                     */
                    function buildSectionPanel(key, val, index) {
                        var titleHBox = new sap.m.HBox({
                            alignItems: sap.m.FlexAlignItems.Center,
                            items: [
                                new sap.m.Text({ text: (key) }).addStyleClass("rbiSectionTitle")
                            ]
                        });

                        var contentVBox = new sap.m.VBox({ renderType: sap.m.FlexRendertype.Bare });
                        var keys, i, k, v;

                        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
                            keys = Object.keys(val);
                            for (i = 0; i < keys.length; i++) {
                                k = keys[i];
                                v = val[k];
                                contentVBox.addItem(
                                    new sap.m.HBox({
                                        renderType: sap.m.FlexRendertype.Bare,
                                        alignItems: sap.m.FlexAlignItems.Start,
                                        items: [
                                            new sap.m.Label({ text: formatInnerKey(k), wrapping: true, design: sap.m.LabelDesign.Bold }).addStyleClass("rbiKey"),
                                            renderValue(v)
                                        ]
                                    }).addStyleClass("rbiKVRow")
                                );
                            }
                        } else {
                            contentVBox.addItem(renderValue(val));
                        }

                        return new sap.m.Panel({
                            expandable: false,
                            headerToolbar: new sap.m.Toolbar({ content: [titleHBox] }).addStyleClass("rbiPanelHeader"),
                            content: [contentVBox]
                        }).addStyleClass("rbiPanel");
                    }


                    var keys = Object.keys(oData);
                    var i; 
                    var vbox = new sap.m.VBox({ renderType: sap.m.FlexRendertype.Bare });

                    for (i = 0; i < keys.length; i++) {
                        vbox.addItem(buildSectionPanel(keys[i], oData[keys[i]], i));
                    }

                    var oScrollContainer = new sap.m.ScrollContainer({
                        vertical: true,
                        horizontal: false,
                        height: "100%",
                        width: "100%",
                        content: [vbox]
                    });

                    var oContainer = that.getView().byId("idAiSuggestions");
                    oContainer.removeAllItems();
                    oContainer.addItem(oScrollContainer);

                }, function () {
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.aiRecommendation.message001"));
                });

            }

            that.dataSource.getAIAsdDataForEquipment(sEquipmentId, function (oData) {
                oResults.asd = oData;
                fnCheckAllDone();
            }, function (oError) {
                oErrors.asd  = oError || true;
                fnCheckAllDone();
            });

            that.dataSource.getAICmlDataForEquipment(sEquipmentId, function (oData) {
                oResults.cml = oData;
                fnCheckAllDone();
            }, function (oError) {
                oErrors.cml  = oError || true;
                fnCheckAllDone();
            });

            that.dataSource.getAIInspectionDataForEquipment(sEquipmentId, function (oData) {
                oResults.inspection = oData;
                fnCheckAllDone();
            }, function (oError) {
                oErrors.inspection  = oError || true;
                fnCheckAllDone();
            });

        },


        /**
         * Function that closes the AI dialog
         */
        handleCloseAi: function () {
            var oFlexiColLayout = this.getView().byId("idFlexiColLayoutDetail");
            oFlexiColLayout.setLayout("OneColumn");
            var oContainer = this.getView().byId("idAiSuggestions");
            oContainer.removeAllItems();
        },

        /**
         * Function to handle full screen for AI recommendation
         */
        handleFullScreenDetail: function() {
            var oFlexiColLayout = this.getView().byId("idFlexiColLayoutDetail");
            oFlexiColLayout.setLayout("MidColumnFullScreen");
            this.getView().getModel("mEquipmentDetail").setProperty("/metadata/aiRecommendation/isFullScreenActive", true); 
        },

        /**
         * Function to handle exit full screen for AI recommendation
         */
        handleExitFullScreenDetail: function() {
            var oFlexiColLayout = this.getView().byId("idFlexiColLayoutDetail");
            oFlexiColLayout.setLayout("TwoColumnsBeginExpanded");
            this.getView().getModel("mEquipmentDetail").setProperty("/metadata/aiRecommendation/isFullScreenActive", false); 
        },

    });
});
