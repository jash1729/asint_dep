sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    return Control.extend("com.asint.ais.library.control.GeneralRiskMatrix.RiskXAxis", {
        metadata: {
            properties: {
                axisKey       : { type: "string",  defaultValue: "" },
                axisDesc      : { type: "string",  defaultValue: "" },
                showRange     : { type: "boolean", defaultValue: false },
                showTextOnly  : { type: "boolean", defaultValue: false },
                showValueOnly : { type: "boolean", defaultValue: false },
                showCustomText: { type: "boolean", defaultValue: false },
                doNotShow     : { type: "boolean", defaultValue: false }
            },
			
            aggregations: {
                axisValues: { type: "com.asint.ais.library.control.GeneralRiskMatrix.RiskAxisValues", multiple: true, singularName: "axisValue" }
            },
			
            defaultAggregation: "axisValues"
        },
		
        /**
		 * @description The Custom Control's init method, called first before the control is rendered
		 *              onto the DOM
		 * 
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 */
        init: function () {},
		
        /**
		 * @description Renders the Custom Control's HTML onto the DOM, we define the
		 *              structure of the Control here along with the SVG code
		 *
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 * 
		 * @param       {sap.ui.core.RenderManager} oRm      Renders data onto the DOM
		 * @param       {sap.ui.core.Control}       oControl Object referring to the custom control's data
		 */
        renderer: function () {}
    });
});