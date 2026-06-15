sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format"
], function (BaseController, ChartFormatter, Format) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.AssetIntelligenceHighlight", {

        /**
         * Initializes the component
         * This function is called when the component is initialized
         * It attaches the 'fnInitialize' function to the "nEquipmentDetail" route pattern matched event
         */
        onInit: function () {

            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);

        },

        /**
         * This function is called after the component has been rendered
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },

        /**
         * 
         */
        fnInitialize: function () {
            
            // this.fnInitializeChart();

        },

        
        /**
         * This function will be called everytime when Asset Intelligence view
         */
        fnInitializeChart: function () {

            var oAssetStrategyCardVizFrame = this.getView().byId("idVizFrame");
            var oAssetStrategyCardVizFramePopover = this.getView().byId("idPopOver");
            var chartFormatter = ChartFormatter.getInstance();
            Format.numericFormatter(chartFormatter);
            var UI5_FLOAT_FORMAT = "CustomFloatFormat_F2";
            chartFormatter.registerCustomFormatter(UI5_FLOAT_FORMAT, function (value) {
                var sRomanFormater = "";
                switch (value) {
                case 1:
                    sRomanFormater = "I";
                    break;
                case 2:
                    sRomanFormater = "II";
                    break;
                case 3:
                    sRomanFormater = "III";
                    break;
                case 4:
                    sRomanFormater = "IV";
                    break;
                case 5:
                    sRomanFormater = "V";
                    break;
                default:
                    sRomanFormater = "No Value";
                    break;
                }

                return sRomanFormater;

            });

            if (oAssetStrategyCardVizFrame) {
                oAssetStrategyCardVizFrame.setVizProperties({
                    plotArea: {
                        dataPointStyle: {
                            rules: [
                                {
                                    dataContext: { "Risk Score": 1 },
                                    properties: { color: "sapUiChartPaletteSemanticBad" },
                                    displayName: "I"
                                },
                                {
                                    dataContext: { "Risk Score": 2 },
                                    properties: { color: "sapUiChartPaletteSemanticCritical" },
                                    displayName: "II"
                                },
                                {
                                    dataContext: { "Risk Score": 3 },
                                    properties: { color: "sapUiChartPaletteSemanticCriticalLight2" },
                                    displayName: "III"
                                },
                                {
                                    dataContext: { "Risk Score": 4 },
                                    properties: { color: "sapUiChartPaletteSemanticGood" },
                                    displayName: "IV"
                                },
                                {
                                    dataContext: { "Risk Score": 5 },
                                    properties: { color: "sapUiChartPaletteSequentialHue1" },
                                    displayName: "V"
                                }
                            ],
                            others: {
                                properties: {
                                    color: "#dddddd"
                                },
                                displayName: "No value"
                            }
                        },
                        dataLabel: {
                            visible: true,
                            formatString: "CustomFloatFormat_F2"
                        }
                    },
                    background: {
                        border: {
                            top: {
                                visible: false
                            },
                            bottom: {
                                visible: false
                            },
                            left: {
                                visible: false
                            },
                            right: {
                                visible: false
                            }
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis2: {
                        title: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: true
                        }
                    },
                    legend: {
                        visible: false,
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false,
                        text: "Asset Strategy"
                    }
                });

                oAssetStrategyCardVizFramePopover.connect(oAssetStrategyCardVizFrame.getVizUid());
            }

        },


    });
});