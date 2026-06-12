sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/MultiInput",
    "sap/m/Token"
], function (Control, MultiInput, Token) {
    "use strict";

    return MultiInput.extend("com.asint.ais.library.control.CustomControl.CustomMultiInput", {

        metadata: {
            properties: {
                stringValues: {
                    type: "string",
                    defaultValue: ""
                }
            }
        },

        /**
         * Function to set string values
         * @param {String} sValue 
         */
        setStringValues: function (sValue) {
            this.setProperty("stringValues", sValue, true);
            this._updateTokens();
        },

        /**
         * Function to update tokens
         */
        _updateTokens: function () {
            var curString = this.getStringValues();
            var arrayVal;
            if(curString){
                arrayVal = this.getStringValues().split(",");
            }else{
                arrayVal = [];
            }
            this.removeAllTokens();
            this.destroyTokens();
            var aTokens = [];
            if (arrayVal.length > 0 && arrayVal[0].length > 0) {
                for (var j in arrayVal) {
                    if (arrayVal[j] === "EQUI") {
                        aTokens.push(new Token({
                            key: arrayVal[j],
                            text: "Equipment"
                        }));
                    } else if (arrayVal[j] === "FLOC") {
                        aTokens.push(new Token({
                            key: arrayVal[j],
                            text: "Functional Location"
                        }));
                    } else {
                        aTokens.push(new Token({
                            key: arrayVal[j],
                            text: arrayVal[j].trim()
                        }));
                    }
                }
                this.addStyleClass("asintNoTokenBorderCls");
                this.setEditable(false);
                this.setTokens(aTokens);
                this.setVisible(true);
            } else {
                this.removeStyleClass("asintNoTokenBorderCls");
                this.setEditable(false);
                this.setVisible(false);
                this.removeAllTokens(); // Clear existing tokens
            }
        },

        /**
         * Ensure the tokens are updated whenever the binding context changes
         */
        setBindingContext: function() {
            sap.ui.core.Control.prototype.setBindingContext.apply(this, arguments);
            this._updateTokens();
        },

        renderer: "sap.m.MultiInputRenderer"

    });
}
);