sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "com/asint/ais/library/utils/SimpleFormBuilder",
    "sap/m/Panel"
], function (Controller,
    SimpleFormBuilder,
    Panel) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.CharacteristicValues", {
        
        /**
         * This function will be called once the view got initialized for the first time
         * Here we are initiaizing variant management from library and attaching event for route
         * pattern matched
         */
        onInit: function () {

            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);

        },
        
        /**
         * This function will be called before rendering the view
         */
        onBeforeRendering: function () { },
        
        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },
        
        /**
         * this function will be called once the view got changed from view port
         */
        onExit: function () { },
        
        /**
         * This function will be called everytime when the view got initialized as we are attaching this to pattern matched
         */
        fnInitialize: function () {

            this.fnRenderFields();
            this.fnLoadCharacteristicsValue();

        },
        
        /**
         * Function to render fields
         */
        fnRenderFields: function () {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aFieldConfig = mEquipmentDetail.getProperty("/data/tabs/characteristicValue/fieldConfig");

            that.getView().byId("idEquipmentCharacteristicFields").removeAllItems();

            aFieldConfig.forEach(function (oFieldConfig) {
                var oSimpleForm = new SimpleFormBuilder(that, oFieldConfig);
                var oPanel = new Panel({
                    headerText: oFieldConfig.title,
                    content: oSimpleForm,
                    expandable: true,
                    expanded: "{mEquipmentDetail>/metadata/detail/tabs/characteristicValue/panel/" + oFieldConfig.metadata.classId + "/isExpanded}"
                });
                that.getView().byId("idEquipmentCharacteristicFields").addItem(oPanel);
            });

        },
        
        /**
         * Function to set panel
         * @param {String} bExpanded 
         */
        onPanelExpand: function (bExpanded) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oPanelMetadata = mEquipmentDetail.getProperty("/metadata/detail/tabs/characteristicValue/panel");
            var aClassKeys = Object.keys(oPanelMetadata);

            for (var i = 0; i < aClassKeys.length; i++) {
                oPanelMetadata[aClassKeys[i]].isExpanded = bExpanded;
            }

            mEquipmentDetail.setProperty("/metadata/detail/tabs/characteristicValue/panel", oPanelMetadata);

        },
        
        /**
         * Function to set test data
         */
        fnTest: function () {

            this.getView().byId("test").removeAllItems();

            var oConfig1 = {
                "modelName": "mTest",
                "basePath": "/data/c1",
                "title": "RBI+ Fixed Equipment",
                "formSettings": {},
                "fields": [
                    {
                        "label": "Equipment Type",
                        "group": "",
                        "type": "ComboBox",
                        "path": "/field1",
                        "mandatory": true,
                        "multiInput": false,
                        "uom": "",
                        "valueHelp": {
                            "enable": true,
                            "path": "/data/valueHelp/field1",
                            "sortBy": "text",
                            "key": "key",
                            "text": "text",
                            "additionalText": ""
                        }
                    }, {
                        "label": "Component Type",
                        "group": "",
                        "type": "Input",
                        "path": "/field2",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Component Geometry",
                        "group": "",
                        "type": "ComboBox",
                        "path": "/field3",
                        "mandatory": true,
                        "multiInput": false,
                        "uom": "",
                        "valueHelp": {
                            "enable": true,
                            "path": "/data/valueHelp/field3",
                            "sortBy": "text",
                            "key": "key",
                            "text": "text",
                            "additionalText": ""
                        }
                    }, {
                        "label": "Design Pressure",
                        "group": "",
                        "type": "Number",
                        "path": "/field4",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "psi",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Design Temperature",
                        "group": "",
                        "type": "Number",
                        "path": "/field5",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "°F",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Operating Pressure",
                        "group": "",
                        "type": "Number",
                        "path": "/field6",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "psi",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Operating Temperature",
                        "group": "",
                        "type": "Number",
                        "path": "/field7",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "°F",
                        "valueHelp": {
                            "enable": false
                        }
                    }
                ]
            };
            var oConfig2 = {
                "modelName": "mTest",
                "basePath": "/data/c2",
                "title": "RBI+ Tank Bottom",
                "formSettings": {},
                "fields": [
                    {
                        "label": "Equipment Type",
                        "group": "",
                        "type": "ComboBox",
                        "path": "/field1",
                        "mandatory": true,
                        "multiInput": false,
                        "uom": "",
                        "valueHelp": {
                            "enable": true,
                            "path": "/data/valueHelp/field1",
                            "sortBy": "text",
                            "key": "key",
                            "text": "text",
                            "additionalText": ""
                        }
                    }, {
                        "label": "Component Type",
                        "group": "",
                        "type": "Input",
                        "path": "/field2",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Component Geometry",
                        "group": "",
                        "type": "ComboBox",
                        "path": "/field3",
                        "mandatory": true,
                        "multiInput": false,
                        "uom": "",
                        "valueHelp": {
                            "enable": true,
                            "path": "/data/valueHelp/field3",
                            "sortBy": "text",
                            "key": "key",
                            "text": "text",
                            "additionalText": ""
                        }
                    }, {
                        "label": "Design Pressure",
                        "group": "",
                        "type": "Number",
                        "path": "/field4",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "psi",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Design Temperature",
                        "group": "",
                        "type": "Number",
                        "path": "/field5",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "°F",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Operating Pressure",
                        "group": "",
                        "type": "Number",
                        "path": "/field6",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "psi",
                        "valueHelp": {
                            "enable": false
                        }
                    }, {
                        "label": "Operating Temperature",
                        "group": "",
                        "type": "Number",
                        "path": "/field7",
                        "mandatory": false,
                        "multiInput": false,
                        "uom": "°F",
                        "valueHelp": {
                            "enable": false
                        }
                    }
                ]
            };

            var oSimpleForm1 = new SimpleFormBuilder(this, oConfig1);
            var oSimpleForm2 = new SimpleFormBuilder(this, oConfig2);
            this.getView().byId("test").addItem(oSimpleForm1);
            this.getView().byId("test").addItem(oSimpleForm2);

        }

    });

});
