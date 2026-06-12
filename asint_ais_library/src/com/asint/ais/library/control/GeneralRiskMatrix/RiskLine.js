sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    return Control.extend("com.asint.ais.library.control.GeneralRiskMatrix.RiskLine", {
        metadata: {
            properties: {
                description: { type: "string", defaultValue: "" },
                sequenceNo : { type: "string", defaultValue: "" },
                color      : { type: "string", defaultValue: "" },
                xAxisName  : { type: "string", defaultValue: "" },
                yAxisName  : { type: "string", defaultValue: "" },
                startX     : { type: "float",  defaultValue: false },
                startY     : { type: "float",  defaultValue: false },
                endX       : { type: "float",  defaultValue: false },
                endY       : { type: "float",  defaultValue: false }
            }
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
		 *               structure of the Control here along with the SVG code
		 *	
		 * @param       {sap.ui.core.RenderManager} oRm      Renders data onto the DOM
		 * @param       {sap.ui.core.Control}       oControl Object referring to the custom control's data
		 * 
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 */
        renderer: function () {}
    });
});