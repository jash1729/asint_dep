/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/asint/ais/mi/equipment/model/models",
    "sap/ui/model/json/JSONModel"
],
function (UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("com.asint.ais.mi.equipment.Component", {
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

                window.com.asint.ais.mi.equipment.baseURI = sBaseURI;

                // this.getManifest().asint = {
                //     runtime: {
                //         isManagedApprouter: true,
                //         baseURI: sBaseURI
                //     }
                // }

            } else {
                // Standalone Approuter
                if (!sBaseURI.includes("webapp")) {
                    // Standalone Approuter
                    sap.ui.getCore().loadLibrary("com.asint.ais.library", "/comasintaislibrary/");
                } else {
                    // Local Approuter
                    sap.ui.getCore().loadLibrary("com.asint.ais.library", "/resources/com/asint/ais/library/");
                }

                window.com.asint.ais.mi.equipment.baseURI = "";

            }
                
            // Component Model
            var oData = {
                "data": {
                    "isValueDataLoaded":false,
                    "isHierarchyAvailable":false,
                    "currentAssetHierarchy": {},
                    "oResponse": {},
                    "aAllComponentType":[],
                    "aUniqueComponentType":[],
                    "aAllComponentTypeForFloc":[],
                    "aUniqueComponentTypeForFloc":[],
                    "aCombineUniqueComponentType":[]
                },
                "metadata": {
                    "ValueHelps":{
                        "isEnumsLoaded":false
                    },
                    "featureFlag": {
                        "isLoaded": false,
                        "equiRiskSummaryRiskProfile": "1",
                        "equiRiskSummaryComponent": "1",
                        "hideSortField": "false",
                        "hideTechnicalIdField": "true",
                        "allowComponentAssign":"1",
                        "legacyEquiTag":"0",
                        "equipmentEnableAIRecommendationButton":"0",
                        "hideFindingType": "0",
                        "equipmentEnableFailureDataProfile": "0",
                        "catalogBasedCTinXom":"0",
                        "showAssetIntelligenceHighlight":"0",
                        "genEnableMultiDocumentUpload": "0",
                        "equipmentExcelExportEnhancements": "0",
                        "equiRestrictDateOfInspectionCol": "0",
                        
                    },
                    "unitLocations": []
                }
            };
            var oModel = new JSONModel(oData);
            oModel.setSizeLimit(100000);
            this.setModel(oModel, "mEquipment");

            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
        }
    });
}
);