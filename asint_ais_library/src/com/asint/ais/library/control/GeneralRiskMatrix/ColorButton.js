sap.ui.define(["sap/m/Button"], function(Button) {
    return Button.extend("com.asint.ais.library.control.GeneralRiskMatrix.ColorButton", {
        metadata: {
            properties: {
                color: {
                    type: "string"
                }
            }
        },

        /**
		 * We define the color of the button here.
		 * 
		 * @param {sap.ui.core.RenderManager} oRm      Renders data onto the DOM 
		 * @param {sap.ui.core.Control}       oControl Object referring to the custom control's data  
		 */
        renderer: function(oRm,oControl) { 
            var sColor = oControl.getColor() ? oControl.getColor() : "#ababab";
            oRm.openStart("div");
            oRm.writeControlData(oControl);
            oRm.addClass("asintRbiColorBtn");
            oRm.writeClasses();
            oRm.openEnd();
            oRm.openStart("span");
            oRm.addClass("asintRbiColorBtnInner");
            oRm.writeClasses();
            oRm.write("style=\"background-color:" + sColor + "\"");
            oRm.openEnd();
            oRm.close("span");
            oRm.close("div");
        }
    });
});