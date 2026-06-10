sap.ui.define([
    "com/asint/ais/library/model/formatter"
], function (formatter) {
    "use strict";

    return formatter.extend("com.asint.ais.mi.cml.model.formatter", {

        /**
        * Get Icons
        * @param {String} objType 
        * @returns 
        */
        fnGetSrcForEQorFL:function(objType){
            if(objType == "FL"){
                return "sap-icon://map";
            }else if(objType == "EQU"){
                return "sap-icon://BusinessSuiteInAppSymbols/icon-equipment";
            }
        },
        
        /**
         * Get Text For Hierarchy
         * @param {String} name 
         * @param {String} shortTitle 
         * @returns 
         */
        fnGetTextforHierarchy:function(name, shortTitle){
            if(shortTitle){
                return name + "(" + shortTitle + ")";
            }else{
                return name;
            }
        },

        /**
         * Returns the functional location sort field if available, otherwise the equipment sort field.
         * @param {String} sFuncLocSort
         */
        locationOrEquipmentSortField: function (sFuncLocSort, sEquipSort) {
            if (sFuncLocSort && sFuncLocSort.trim()) {
                return sFuncLocSort;
            }
            if (sEquipSort && sEquipSort.trim()) {
                return sEquipSort;
            }
            return ""; 
        },

        /**
         * Get ImageId
         * @param {String} imageId 
         * @returns 
         */
        fnGetImageUrl:function(imageId){
            return imageId;
        },

        /**
         * Get Icon Based On Priority
         * @param {String} sType 
         * @returns String
         */
        fnIconBasedPriority: function (sType) {      
            var sIconUrl;      
            switch (sType) {

            case "Low":
                sIconUrl = "sap-icon://arrow-bottom";
                break;

            case "Medium":
                sIconUrl = "sap-icon://arrow-right";
                break;

            case "High":
                sIconUrl = "sap-icon://BusinessSuiteInAppSymbols/icon-priority-1"
                break;

            case "Very High":
                sIconUrl = "sap-icon://BusinessSuiteInAppSymbols/icon-priority-2"
                break;

            case "Emergency":
                sIconUrl = "sap-icon://alert"
                break;
            }

            return sIconUrl;
        },

        /**
         * Get Readings 
         * @param {String} sReading 
         * @param {String} sType 
         */
        fnGetReadingsForCmlOverview(sReading , sType) {

            var oDataSource = {};
            var sTypeReading = "";
            var aDateStrings = ["DATE","RETIREMENT_DATE"];
            var aNumStrings = ["READING","TMIN","SHORT_TERM_CORROSION_RATE","LONG_TERM_CORROSION_RATE"];
            var aYearStrings = ["HALF_LIFE"];
            /**
             * Function to decode Object
             * 
             * @param {Object} oValue 
             * @returns decode Object
             */
            var fnDecode = function (oValue) {

                if(oValue && typeof oValue === "string"){
                    
                    try {
                        var oDecodedValue = atob(oValue);
                        oDecodedValue = JSON.parse(oDecodedValue);
                    } catch (error) {
                        oDecodedValue = {};
                    }

                    return oDecodedValue;

                }
            };

            /**
             * Format Date
             * @param {*} oDate 
             * @param {*} sPattern 
             * @returns 
             */
            var formatDate = function (oDate, sPattern) {

                var sDate = null;
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: sPattern || "MMM dd, yyyy"
                });

                if (oDate) {
                    oDate = new Date(oDate);
                    if (oDate instanceof Date) {
                        sDate = oDateFormat.format(oDate);
                    } else {
                        var aMatch = oDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
                        if (aMatch) {
                            try {
                                var oSourceDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-ddTHH:mm:ss.SSSZ"
                                });
                                sDate = oDateFormat.format(oSourceDateFormat.parse(oDate));
                            } catch (error) {
                                sDate = oDate;
                            }
                        } else {
                            aMatch = oDate.match(/\d+/);
                            if (aMatch) {
                                try {
                                    var iDateInNumber = parseInt(aMatch[0]);
                                    sDate = oDateFormat.format(new Date(iDateInNumber));
                                } catch (error) {
                                    sDate = oDate;
                                }

                            }
                        }
                    }

                }

                return sDate;

            };

            if(sReading) {
                
                oDataSource = fnDecode(sReading);

                if(oDataSource["value"]){

                    var oDSValue = oDataSource["value"];
                    if(oDSValue[sType] && aDateStrings.includes(sType)){

                        sTypeReading = formatDate(oDSValue[sType]);

                    }else if(oDSValue[sType] && aNumStrings.includes(sType)){

                        sTypeReading = typeof oDSValue[sType] === "number" ? oDSValue[sType].toFixed(4) : oDSValue[sType];

                    } else if (oDSValue[sType] && aYearStrings.includes(sType)) {
                        sTypeReading = typeof oDSValue[sType] === "number" ? oDSValue[sType].toFixed(2) : oDSValue[sType];
                    }
                }

                
            }

            return sTypeReading;
        },

        /**
        * 
        * @param {Number} oDate - Contains date
        * @param {string} sPattern - Required formatting
        * @returns {Number} Returns the formatted Date
        */
        formatDate: function (oDate, sPattern) {

            var sDate = null;
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: sPattern || "MMM dd, yyyy"
            });

            if (oDate) {
                oDate = new Date(oDate);
                if (oDate instanceof Date) {
                    sDate = oDateFormat.format(oDate);
                } else {
                    var aMatch = oDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
                    if (aMatch) {
                        try {
                            var oSourceDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                pattern: "yyyy-MM-ddTHH:mm:ss.SSSZ"
                            });
                            sDate = oDateFormat.format(oSourceDateFormat.parse(oDate));
                        } catch (error) {
                            sDate = oDate;
                        }
                    } else {
                        aMatch = oDate.match(/\d+/);
                        if (aMatch) {
                            try {
                                var iDateInNumber = parseInt(aMatch[0]);
                                sDate = oDateFormat.format(new Date(iDateInNumber));
                            } catch (error) {
                                sDate = oDate;
                            }

                        }
                    }
                }

            }

            return sDate;

        },
    });

});
