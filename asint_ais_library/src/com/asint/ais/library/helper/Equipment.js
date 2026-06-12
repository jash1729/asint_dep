sap.ui.define([
    "com/asint/ais/library/helper/TechnicalObject"
], function (Object) {
    "use strict";

    return Object.extend("com.asint.ais.library.helper.Equipment", {

        /**
         * Function to load characteristic value
         * @param {string} sEquipmentId 
         * @param {object} oClassToCharMap 
         * @param {function} fnCallback 
         */
        fnLoadCharacteristicsValue: function (sEquipmentId, oClassToCharMap, fnCallback) {

            this.fnLoadCharacteristicsValue_(sEquipmentId, "EQU", oClassToCharMap, fnCallback);

        }

    });

});