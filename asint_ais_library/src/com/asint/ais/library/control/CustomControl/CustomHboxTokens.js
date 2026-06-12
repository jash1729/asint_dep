sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/HBox",
    "sap/m/Token"
], function(Control, HBox, Token) {
    "use strict";

    return Control.extend("com.asint.ais.library.control.CustomControl.CustomHboxTokens", {
        metadata: {
            properties: {
                value: { type: "string", defaultValue: "" }
            },
            aggregations: {
                _hbox: { type: "sap.m.HBox", multiple: false, visibility: "hidden" }
            }
        },

        /**
         * Init function
         */
        init: function() {
            this.setAggregation("_hbox", new HBox());
        },

        /**
         * Function to split the string and create tokens   
         */
        _createTokensFromValue: function() {
            var sValue = this.getProperty("value");
            var arrayVal;
            if(sValue){
                arrayVal = sValue.split(",");
            }else{
                arrayVal = [];
            }
            var aTokens = [];
            if (arrayVal.length > 0 && arrayVal[0].length > 0) {
                for (var j in arrayVal) {
                    var oToken;
                    if (arrayVal[j] === "EQUI") {
                        oToken = new Token({
                            key: arrayVal[j],
                            text: "Equipment",
                            editable : false
                        });
                    } else if (arrayVal[j] === "FLOC") {
                        oToken = new Token({
                            key: arrayVal[j],
                            text: "Functional Location",
                            editable : false
                        });
                    } else {
                        oToken = new Token({
                            key: arrayVal[j],
                            text: arrayVal[j].trim(),
                            editable : false
                        });
                    }
                    if(j == 0){
                        oToken.addStyleClass("sapUiTinyMarginBegin")
                    }else{
                        oToken.addStyleClass("veryTinyMarginCls");
                    }
                    aTokens.push(oToken);
                }
            } 

            var oHBox = this.getAggregation("_hbox");
            oHBox.removeAllItems();
            aTokens.forEach(function(oToken) {
                oHBox.addItem(oToken);
            });
        },

        /**
         * Function to set the value
         * @param sValue String
         */
        setValue: function(sValue) {
            this.setProperty("value", sValue, true);
            this._createTokensFromValue();
        },

        /**
         * Function to return hbox
         */
        getHBox: function() {
            return this.getAggregation("_hbox");
        },

        /**
         * Function to render teh control
         * @param oRM Object
         * @param oControl Object
         */
        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_hbox"));
            oRM.write("</div>");
        }
    });
});
