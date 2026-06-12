sap.ui.define([
    "com/asint/ais/library/helper/TechnicalObject"
], function (Object) {
    "use strict";

    return Object.extend("com.asint.ais.library.helper.FunctionalLocation", {

        /**
         * Function to load characteristic value
         * @param {string} sFunctionalLocationId 
         * @param {object} oClassToCharMap 
         * @param {function} fnCallback 
         */
        fnLoadCharacteristicsValue: function (sFunctionalLocationId, oClassToCharMap, fnCallback) {

            this.fnLoadCharacteristicsValue_(sFunctionalLocationId, "FL", oClassToCharMap, fnCallback);

        }

    });

});