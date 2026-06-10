sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/asint/ais/mi/cml/model/models",
    "sap/ui/model/json/JSONModel",
    "com/asint/ais/mi/cml/utility/Formatter"
],
function (UIComponent, Device, models, JSONModel, Formatter) {
    "use strict";

    return UIComponent.extend("com.asint.ais.mi.cml.Component", {

        formatter: Formatter,

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
                
            var sBaseURI = this.getManifestObject()._oBaseUri._parts.path;
            var sComponentName = this.getManifestObject().getComponentName().replaceAll(".", "");

            sBaseURI = sBaseURI.substring(0, sBaseURI.indexOf(sComponentName) + sComponentName.length);

            if (((sBaseURI.length) - sComponentName.length) > 1) {
                // Managed Approuter
                var sLibraryPath = sBaseURI.replace(sComponentName, "comasintaislibrary-1.0.0/");
                sap.ui.getCore().loadLibrary("com.asint.ais.library", sLibraryPath);

                window.com.asint.ais.mi.cml.baseURI = sBaseURI;

                // this.getManifest().asint = {
                //     runtime: {
                //         isManagedApprouter: true,
                //         baseURI: sBaseURI
                //     }
                // }

            } else {
                if (!sBaseURI.includes("webapp")) {
                    // Standalone Approuter
                    sap.ui.getCore().loadLibrary("com.asint.ais.library", "/comasintaislibrary/");
                } else {
                    // Local Approuter
                    sap.ui.getCore().loadLibrary("com.asint.ais.library", "/resources/com/asint/ais/library/");
                }

                window.com.asint.ais.mi.cml.baseURI = "";

            }

            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var oModel = new JSONModel();
            this.setModel(oModel);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            this.fnInitialize();
        },

        /**
         * Function to initialize the model
         */
        fnInitialize: function () {
            var that = this;
            var oCMLModel = {
                "data": {
                    "aAllComponentType":[],
                    "aUniqueComponentType":[],
                    "assetHierarchy": {
                        "fetched": false,
                        "nodes": [],
                        "lines": []
                    },
                    "listPage": {
                        "table": {
                            "header": "",
                            "isBusy": false
                        },
                        "equipmentLocationList": {
                            "masterList": "",
                            "tableList": "",
                            "graphList": "",
                            "valueHelpDataMaster": "",
                            "valueHelpData": "",
                            "dummyAnalytics": []
                        }
                    },
                    "listPageForCmlOv": {
                        "table": {
                            "header": "",
                            "isBusy": false
                        },
                        "filters" : {}
                    },
                    "genericValueHelp":{},
                    "detailPage": {
                        "create": {
                            "cml": {
                                "addRowCount": "",
                                "selectedEqpFloc": "",
                                "selectedObjectTemplate": "",
                                "selectedObjectTemplateName": "",
                                "objectTemplateList": [],
                                "locationTemplateList": [],
                                "oSelectedObject": {},
                                "customDataset": [],
                                "wizard": {
                                    "prevStep": false,
                                    "nextStep": false,
                                    "currStep": 0,
                                    "nextStepEnabled": false,
                                    "createEnabled": false
                                }
                            }
                        }
                    },

                    "CMLTabSection": {

                    },
                    "selectedObjectId": "",
                    "selectedEqpFLoc": {},
                    "selectedCML": {},
                    "UomDescriptions": [],
                    "Dimensions": {},
                    "UOM": "",
                    "isPublished": false,
                    "copySameEquip":{},
                    "copyDiffEquip":{},
                    "copySameEquipReadings":{},
                    "copyDiffEquipReadings":{},
                    "temp": {
                        "Attributes": [],
                        "Indicators": [],
                        "AttributesIndicators": [],
                    },
                    "createInspectionWizard": {
                        "prevStep": false,
                        "nextStep": true,
                        "currStep": 0,
                        "cmlTree": [],
                        "nextStepEnabled": false,
                        "createEnabled": false,
                        "objectType" : "EQP",
                        "objectSearchQuery": ""
                    },
                    "createInspection": {
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
                    },
                    "cmlList": "{\"UT Cylindrical Shell ID Div 1\":{\"id\":\"1\",\"name\":\"UT Cylindrical Shell ID Div 1\",\"desc\":\"\",\"type\":\"CMLTemplate\",\"selected\":false,\"nodes\":[{\"id\":\"d0967179-a1d3-4888-853c-5294260f9ab3\",\"name\":\"001\",\"desc\":\"Bottom Head\",\"type\":\"CML\",\"selected\":false},{\"id\":\"5c45490b-b8b5-497f-aab3-1f8921a4ebcf\",\"name\":\"002\",\"desc\":\"Bottom Head N\",\"type\":\"CML\",\"selected\":false},{\"id\":\"b444f919-4a47-407a-aeea-10cfc6fcee91\",\"name\":\"007\",\"desc\":\"Shell W\",\"type\":\"CML\",\"selected\":false}]},\"UT Cylindrical Shell OD Div 1\":{\"id\":\"5\",\"name\":\"UT Cylindrical Shell OD Div 1\",\"desc\":\"\",\"type\":\"CMLTemplate\",\"selected\":false,\"nodes\":[{\"id\":\"e2720c5a-f526-4281-a5c3-7c880985f3ac\",\"name\":\"009\",\"desc\":\"Top Head W\",\"type\":\"CML\",\"selected\":false},{\"id\":\"6b015fe5-9d85-4bf4-acf7-91983637a491\",\"name\":\"008\",\"desc\":\"Top Head S\",\"type\":\"CML\",\"selected\":false}]},\"RT Cylindrical Shell ID Div 1\":{\"id\":\"8\",\"name\":\"RT Cylindrical Shell ID Div 1\",\"desc\":\"\",\"type\":\"CMLTemplate\",\"selected\":false,\"nodes\":[{\"id\":\"0ac7fc1c-c6f2-43ea-a1dc-de1957bcdc74\",\"name\":\"014\",\"desc\":\"Nozzle S\",\"type\":\"CML\",\"selected\":false},{\"id\":\"27f6dc7d-fd6e-4704-bcb6-ad724ff25dff\",\"name\":\"005\",\"desc\":\"Shell SW\",\"type\":\"CML\",\"selected\":false}]}}",
                    "editHeader": {},
                    "ignoredReading": {},
                    "userRoles": {}
                },
                "metaData": {
                    "listPage": {
                        "create": {
                            "cml": {
                                "isPublished": true,
                                "valueState": {
                                    "EqpFloc": "None",
                                    "cmlTemplate": "None",
                                    "objectTemplate": "None"
                                },
                                "valueStateText": {
                                    "EqpFloc": "",
                                    "cmlTemplate": "",
                                    "objectTemplate":""
                                },
                                "enabled": {
                                    "cmlTemplate": false,
                                    "name": true,
                                    "description": true,
                                    "addIcon": true,
                                    "save": false,
                                    "objectTemplate": false
                                },
                                "wizard":{
                                    "prevStep": false,
                                    "nextStep": true,
                                    "currStep": 0,
                                    "cmlTree": [],
                                    "nextStepEnabled": false,
                                    "createEnabled": false,
                                }
                            },
                            "inspection": {

                            }
                        }
                    },
                    "detailPage": {
                        "create": {
                            "cml": {
                                "valueState": {
                                    "EqpFloc": "None",
                                    "objectTemplate": "None"
                                },
                                "valueStateText": {
                                    "EqpFloc": "",
                                    "objectTemplate": ""
                                },
                                "enabled": {
                                    "objectTemplate": false,
                                    "name": true,
                                    "description": true,
                                    "addIcon": true,
                                    "save": false
                                },
                                "wizard": {
                                    "prevStep": false,
                                    "nextStep": true,
                                    "currStep": 0,
                                    "nextStepEnabled": false,
                                    "createEnabled": false
                                }
                            }
                        },
                        "isCalculationInProgress":false,
                    },
                    "summaryReadingSection": {

                    },
                    "CMLTabSection": {
                        "exitFullScreen": false,
                        "viewFullScreen": true,
                        "closeScreen": true
                    },
                    "featureFlag": {
                        "isLoaded": false,
                        "hideSortField": "false",
                        "hideTechnicalIdField": "true",
                        "cmlBulkCalculate": "0",
                        "cmlFetchAllWithoutRestricting1000":"0",
                        "cmlEnableCopyAssetWithBgInfo": "0",
                        "cmlSummary": "0",
                        "CmlAiInsight":"0",
                        "cmlSummaryValidations": "0"
                    }
                }
            }
            var oModelCML = new sap.ui.model.json.JSONModel(oCMLModel);
            oModelCML.setSizeLimit(100000);
            that.setModel(oModelCML, "mCMLModel");
        },

        /**
         * Function to return sorted array of objects
         * @param {Array} aList 
         * @param {String} sColumnName
         * @returns 
         */
        fnSortArrayOfObject: function (aList, sColumnName) {
            /**
             * Local compare function
             * @param {Object} a 
             * @param {Object} b 
             * @returns 
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
    });
}
);