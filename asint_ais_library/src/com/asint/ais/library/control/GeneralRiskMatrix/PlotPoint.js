sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
	
    return Control.extend("com.asint.ais.library.control.GeneralRiskMatrix.PlotPoint", {
		
        metadata: {
            properties: {
                pointX       : { type: "float", defaultalue: 0.0 },
                pointY       : { type: "float", defaultalue: 0.0 },
                xTooltip     : { type: "string", defaultValue: ""},
                yTooltip     : { type: "string", defaultValue: ""},
                axisX        : { type: "string", defaultValue: "" },
                axisY        : { type: "string", defaultValue: "" },
                color        : { type: "string", defaultValue: "" },
                pointDesc    : { type: "string", defaultValue: "" },
                useAxisLabels: { type: "boolean", defaultValue: false },
                xAxisPointText: { type: "string", defaultValue: "" },
                yAxisPointText: {  type: "string", defaultValue: "" }
            }
        }
		
    });
}, true);