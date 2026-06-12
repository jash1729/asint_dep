sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    return Control.extend("com.asint.ais.library.control.GeneralRiskMatrix.RiskMatrixLabel", {
        metadata: {
            properties: {
                labelX : { type: "string", defaultValue: null },
                colorX : { type: "string", defaultValue: null },
                labelY : { type: "string", defaultValue: null },
                colorY : { type: "string", defaultValue: null }
            }
        },
		
        /**
		 *  @description The Custom Control's init method, called first before the control is rendered
		 *               onto the DOM
		 * 
		 *  @since       1920
		 *  @author      Ashweyth Sunil <ashweyth@maventic.com>
		 */
        init: function () {
			
        },
		
        /**
		 * 
		 * @returns Renders the Custom Control's HTML onto the DOM
		 */
        fnBuildPointLabels: function () {	
            var sHtml = "<text x=\"5\" y=\"5\" fill=\"" + this.getColorX() +"\">" + this.getLabelX() + "</text>";
            sHtml += "<text x=\"5\" y=\"150\" fill=\"" + this.getColorY() + "\">" + this.getLabelY() + "</text>";
				
            return sHtml;
        },
		
        /**
		 *  @description Renders the Custom Control's HTML onto the DOM, we define the
		 *               structure of the Control here along with the SVG code
		 *	
		 *	@param       oRm      {sap.ui.core.RenderManager} Renders data onto the DOM
		 *  @param       oControl {sap.ui.core.Control}       Object referring to the custom control's data
		 * 
		 *  @since       1920
		 *  @author      Ashweyth Sunil <ashweyth@maventic.com>
		 */
        renderer: function (oRm, oControl) {
			
            var sLabels = oControl.fnBuildPointLabels();
			
            var sLabelHtml = "<svg version=\"1.2\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"" +
									" viewbox=\"0 0 300 200\" role=\"img\">" +
									"<g class=\"asintRbiRiskLabels\">" +
										sLabels +
									"</g>" +
								"</svg>";
			
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addCalss("asintRbiCustomRiskMatrixLabel");
            oRm.write(">");
            oRm.write(sLabelHtml);
            oRm.write("</div>");
        }
    });
});