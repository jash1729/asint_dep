/* eslint-disable no-prototype-builtins */
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/util/Storage",
    "com/asint/ais/library/model/constants",
    "sap/m/MessageBox",
], function (Object, Storage, Constants, MessageBox) {
    "use strict";

    return Object.extend("com.asint.ais.library.model.formatter", {

        /**
		 * Function to get selected UOM system
		 * @param {function} fnCallback 
		 */
        getSelectedUoMSystem: function (fnCallback) {

            var sUoMSystem = Storage.get("UOMSystem");

            if (fnCallback) {

                if (sUoMSystem) {
                    fnCallback(sUoMSystem);
                } else {
                    /**
					 * Function fot timeout loop
					 * @param {function} fnCallback 
					 */
                    var fnTimeoutLoop = function (fnCallback) {
                        setTimeout(function () {
                            sUoMSystem = Storage.get("UOMSystem");
							
                            if (sUoMSystem) {
                                fnCallback(sUoMSystem);
                            } else {
                                fnTimeoutLoop(fnCallback);
                            }
                        }, 1000);
                    };

                    fnTimeoutLoop(fnCallback);
                }

            }

            return sUoMSystem;

        },

        /**
		 * function to format s4 date object
		 * @param {object} oParam1 
		 */
        fnFormatToS4DateObject: function (oParam1) {

            if (oParam1) {
                if (!(oParam1 instanceof Date)) {
                    oParam1 = new Date(oParam1);
                }
                return oParam1.getTime() + Math.abs(oParam1.getTimezoneOffset() * 60 * 1000);
            }

            return null;

        },

        /**
		 * Format date
		 * @param {object} oDate 
		 * @param {string} sPattern 
		 * @param {boolean} bExcludeTimestamp 
		 * @returns 
		 */
        formatDate: function (oDate, sPattern, bExcludeTimestamp) {

            var sDate = null;
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: sPattern || "MMM dd, yyyy"
            });

            if (oDate) {
                try {
                    var oDateObj = null;

                    if (typeof oDate === "string") {
                        if(bExcludeTimestamp && oDate.includes("T00:00:00.000+00:00")) {
                            oDate = oDate.replace("T00:00:00.000+00:00", "");
                        }
                        if (/^\d{4}-\d{2}-\d{2}$/.test(oDate)) {
                            oDateObj = new Date(oDate + "T00:00:00");           // yyyy-MM-dd // 2023-05-15
                        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{1,3})?Z?$/.test(oDate)) {
                            oDateObj = new Date(oDate);                         // ISO datetime format // 2023-05-15T14:30:00(z)
                        } else if (/^\d+$/.test(oDate)) {
                            oDateObj = new Date(Number(oDate));                 // Numeric timestamp // 1620000000000 
                        } else {
                            oDateObj = new Date(oDate);
                        }
                    } else if (oDate instanceof Date) {
                        oDateObj = oDate;
                    } else if (typeof oDate === "number") {
                        oDateObj = new Date(oDate);
                    } else {
                        oDateObj = new Date(oDate);
                    }

                    if (oDateObj instanceof Date && !isNaN(oDateObj.getTime())) {
                        sDate = oDateFormat.format(oDateObj);
                    } else {
                        if (typeof oDate === "string" && /\d+/.test(oDate)) {    // Numerix string with non numeric characters
                            try {
                                var iDateInNumber = parseInt(oDate.match(/\d+/)[0], 10);
                                sDate = oDateFormat.format(new Date(iDateInNumber));
                            } catch (error) {
                                sDate = oDate;
                            }
                        } else {
                            sDate = oDate;
                        }
                    }
                } catch (error) {
                    sDate = oDate;
                }
            }

            return sDate;
        },   

        /**
		 * Function to get description
		 * @param {array} aDescription 
		 * @param {string} sProperty 
		 */
        fnGetDescription: function (aDescription, sProperty) {

            if (aDescription) {

                if (!["shortDescription", "longDescription"].includes(sProperty)) {
                    sProperty = "shortDescription";
                }
                return this.fnGetDescriptionByPref(aDescription)[sProperty];

            } else {
                return "";
            }

        },

        /**
		 * Function to get description by reference
		 * @param {array} aDescription 
		 */
        fnGetDescriptionByPref: function (aDescription) {

            if (aDescription) {
                var oLangDict = {};
                for (var i = 0; i < aDescription.length; i++) {
                    oLangDict[aDescription[i].language] = aDescription[i];
                }

                return oLangDict[this.USER_LANG] || oLangDict["en"] || aDescription.length > 0 ? aDescription[0] : { "shortDescription": "", "longDescription": "", "language": "" };
            } else {
                return { "shortDescription": "", "longDescription": "", "language": "" };
            }

        },

        /**
		 * Retrives the loggedin user email
		 */
        getLoggedInUserMail: function () {

            var sEmail = "";

            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
                sEmail = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
            }

            return sEmail;

        },

        /**
		 * Retrieves the logged-in user's full name.
		 * 
		 * @returns {string} The full name of the logged-in user.
		 */
        getLoggedInUserFullname: function () {
            var sName = "";
            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
                sName = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
            }
            return sName;
        },
		
        /**
		 * Function to format icon based on file type
		 * @param {string} sAttachmentFileTypeGroup 
		 */
        fnFormatAttachmentIconBasedOnFileTypeGroup: function (sAttachmentFileTypeGroup) {
            var documentMimeGroup=com.asint.ais.library.model.constants.documentMimeGroup;
            if (documentMimeGroup.hasOwnProperty(sAttachmentFileTypeGroup)) {
                return documentMimeGroup[sAttachmentFileTypeGroup];}
            else{
                return "sap-icon://attachment";
            }
        },
        /**
		 * Function to format attachment
		 * @param {string} mimeType 
		 */
        fnFormatAttachmentIconBasedOnFileType:function(mimeType)
        { 
            var  documentMimeTypes=com.asint.ais.library.model.constants.documentMimeTypes;
            if (documentMimeTypes.hasOwnProperty(mimeType)) {
                return documentMimeTypes[mimeType];
            } else {
                return "sap-icon://attachment"; 
            }
        },
		
        /**
		 * Function to get status type
		 * @param {string} sStatus 
		 */
        fnGetStatusType: function (sStatus) {

            var sType = "None";
            sStatus = sStatus ? sStatus.toLowerCase() : "";

            if (["published", "active", "completed", "low", "running", "complete", "pbd", "released", "closed", "app"].includes(sStatus)) {
                sType = "Success";
            } else if (["unpublished", "inactive", "queue", "in progress", "in_progress", "medium", "canceled", "suspended", "upbd", "in process", "rew", "inp"].includes(sStatus)) {
                sType = "Warning";
            } else if (["error", "high", "erroneous", "failed", "inac", "rej"].includes(sStatus)) {
                sType = "Error";
            }

            return sType;

        },

        /**
		 * Function to get status text
		 * @param {string} sStatus 
		 */
        fnGetStatusText: function(sStatus){
            var sText = sStatus;
            sStatus = sStatus ? sStatus.toLowerCase() : "";
            if(sStatus === "pbd") {
                sText = "Published";
            } else if(sStatus === "upbd"){
                sText = "Unpublished";
            }else if(sStatus == "inac"){
                sText = "Inactive"
            }
            return sText;
        },

        /**
		 * Function convert byte to size
		 * @param {integer} iFileSizeInBytes 
		 */
        fnConverbytestoSize: function (iFileSizeInBytes) {
            var iDecimal = 2;
            if (!+iFileSizeInBytes || iFileSizeInBytes === 0) {
                return ""; 
            }
            var iK = 1024;
            var iDc = iDecimal < 0 ? 0 : iDecimal;
            var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
            var i = Math.floor(Math.log(iFileSizeInBytes) / Math.log(iK));
            return parseFloat((iFileSizeInBytes / Math.pow(iK, i)).toFixed(iDc))+" "+sizes[i];
        },

        /**
		 * Function phase to string
		 * @param {array} phase 
		 */
        fnPhaseToString: function (phase) {
            if (!phase || !Array.isArray(phase)) {
                return ""; // Return an empty string if phase is not present or not an array
            }  
            let sPhase = "";
            for (var i = 0; i < phase.length; i++) {
                if (sPhase.length > 0) {
                    sPhase += ",";
                }
                sPhase += phase[i];
            }
            return sPhase;
        },

        /**
		 * Navigate URL
		 * @param {string} sHashWithKeyword 
		 */
        getNavUrl: function(sHashWithKeyword) {
            var siteIdIndex = window.location.search.indexOf("siteId");
            var sSite = "";
            var sUrl = "";

            if(siteIdIndex > -1) {
                sSite = window.location.search.substring(siteIdIndex, window.location.search.indexOf("&", siteIdIndex));
                sUrl = window.location.origin + "/site?" + sSite + "#" + sHashWithKeyword;
            }else {
                sUrl = window.location.origin + "/#" + sHashWithKeyword;
            }
            return sUrl;
        },

        /**
		 * Function that formats the category desc and category key
		 * @param {String} desc 
		 * @param {string} key 
		 * @returns 
		 */
        formatCategorylibrary: function(desc, key) {
            if (desc && key) {
                return desc + " (" + key + ")";
            } else if (desc) {
                return desc;
            } else if (key) {
                return key;
            } else {
                return "";
            }
        },

        /**
         * Function to extract description from the response.
         * 
         * @param {Object} oParam1 
         * @returns OIbject
         */
        fnGetDescriptionFromResponse: function (oParam1) {

            var oReturn = {
                "shortDescription": "",
                "longDescription": "",
                "descriptionLanguage": ""
            };

            if (Array.isArray(oParam1)) {
                if (oParam1.length > 0) {
                    oReturn.shortDescription = oParam1[0].shortDescription;
                    oReturn.longDescription = oParam1[0].longDescription;
                    oReturn.descriptionLanguage = oParam1[0].language;
                }
            } else if (oParam1) {
                oReturn.shortDescription = oParam1.shortDescription;
                oReturn.longDescription = oParam1.longDescription;
                oReturn.descriptionLanguage = oParam1.language;
            }
            return oReturn;

        },
        
        /**
         * Function to open message box 
         * @param {String} sMsgType 
         * @param {String} sMessageText 
         * @param {String} sMessageDetail 
         * @param {Function} fnCallback 
         * @returns null
         */
        fnMessageShow: function (sMsgType, sMessageText, sMessageDetail, fnCallback) {
            var sMessageBoxMethod;
            var aMessageBoxAction = [];
            if (sMessageText.trim().length === 0) {
                return;
            }
            if ($(".asintRbiMessage").length > 0) {
                return;
            }

            if (!sMessageDetail) {
                sMessageDetail = null;
            }

            if (sMsgType === "S") {
                sMessageBoxMethod = "success";
                aMessageBoxAction = [MessageBox.Action.OK];
            } else if (sMsgType === "E") {
                sMessageBoxMethod = "error";
                aMessageBoxAction = [MessageBox.Action.OK, MessageBox.Action.CLOSE];
            } else if (sMsgType === "W") {
                sMessageBoxMethod = "warning";
                aMessageBoxAction = [MessageBox.Action.OK, MessageBox.Action.CLOSE];
            } else if (sMsgType === "I") {
                sMessageBoxMethod = "information";
                aMessageBoxAction = [MessageBox.Action.OK];
            } else if (sMsgType === "C") {
                sMessageBoxMethod = "confirm";
                aMessageBoxAction = [MessageBox.Action.YES, MessageBox.Action.NO];
            }

            if (sMessageBoxMethod) {
                sap.m.MessageBox[sMessageBoxMethod](sMessageText, {
                    actions: aMessageBoxAction,
                    details: sMessageDetail,
                    initialFocus: null,
                    styleClass: "asintRbiMessage",
                    /**
                     * Callback function on user action
                     *
                     * @param {String} sAction
                     */
                    onClose: function (sAction) { //Possible Actions: OK/CLOSE/YES/NO
                        if (fnCallback && {}.toString.call(fnCallback) === "[object Function]") {
                            fnCallback(sAction);
                        }
                    }
                });
            } else {
                sap.m.MessageToast.show(sMessageText);
            }
        },

        /**
        * Return Status  State based on sStatusCode
        * @param {String} sStatus 
        * @returns Status State
        */
        fnFormatEvergreeningText : function(sStatus){
            return sStatus;
        },
        
        /**
        * Return Status  State based on sStatusCode
        * @param {String} sStatus 
        * @returns Status State
        */
        fnFormatEvergreeningStatus : function(sStatus){
            if(sStatus){
                if(sStatus == "Complete"){
                    return "Success";
                }else{
                    return "Error";
                }
            }
            return "None";
        },

        /**
         * Type Formatter
         * @param {String} sType 
         * @returns {String}
         */
        fnTypeFormatter: function (sType) {
            var sFormattedType = sType;
            switch (sType) {
            case "PROACTIVE":
                sFormattedType = "Proactive"
                break;
            case "REACTIVE":
                sFormattedType = "Reactive"
                break;
            case "IMPROVEMENT":
                sFormattedType = "Improvement"
            }

            return sFormattedType;
        },

        /**
         * Subtype Formatter
         * @param {String} sType 
         * @returns {String}
         */
        fnSubTypeFormatter: function (sType) {
            var sFormattedSubType = sType;
            switch (sType) {
            case "CALENDAR":
                sFormattedSubType = "Calendar"
                break;
            case "CONDITION":
                sFormattedSubType = "Condition"
                break;
            case "PERFORMANCE":
                sFormattedSubType = "Performance"
                break;
            case "RISK_BASED":
                sFormattedSubType = "Risk-based"
                break;
            }

            return sFormattedSubType;
        },

        /**
         * Function to format decimal number
         * 
         * @param {Number} sValue 
         * @param {Number} iDecimal 
         * @returns sValue
         */
        fnFormatDecimalValue: function (sValue, iDecimal) {

            if (iDecimal === null || iDecimal === undefined || isNaN(Number(iDecimal))) {
                iDecimal = 3;
            } else {
                iDecimal = Number(iDecimal);
            }

            if (sValue === "" || isNaN(Number(sValue))) {
                return null;
            }

            var iValue = parseFloat(sValue);
            return Number(iValue.toFixed(iDecimal));

        },

        /**
         * Functhat that formats the technicla object
         * @param {Number} count 
         */
        formatTechCount: function(count){

            if(!count || isNaN(count)){
                return "";
            }else if(count === "0") {
                return ""
            }else if(count === "1"){
                return count + " " + "Object"
            } else {
                return count + " " + "Objects"
            }
        },

        /**
         * Format On / By
         * 
         * @param {object} oDate 
         * @param {string} sPattern
         * @param {string} sBy
         * @returns 
         */
        formatOnBy: function (oDate, sPattern, sBy) {
            return this.formatter.formatDate(oDate, sPattern) + " / " + sBy;
        },

        /**
         * Function to format class and failure data profile name
         * @param {String} sContext 
         * @returns String
         */
        fnFormatName: function(sContext) {
            if(sContext) {
                return "(" + sContext +")";
            }

            return sContext;
        },

        /**
         * Handles abc indicator  list tag 
         * for empty tag it returns false
         * and for non empty tag it return true 
         * @param {Object} value 
         * @returns 
         */
        formatVisible: function (value, show) {
            // if(show) {
            //     if (value) {
            //         return true;
            //     }
            //     else {
            //         return false;
            //     }
            // }

            // return false;
            if(show && value) {
                return true;
            }
            return false;
        },

        /**
         * Function handles color code for abc  indicator in list page
         * @param {String} abcIndicator 
         * @returns color code for abc indicator column in list
         */
        formatStatus: function (abcIndicator) {
            switch (abcIndicator) {
            case "A":
                return "Error";
            case "B":
                return "Warning";
            case "C":
                return "Success";
            default:
                return "None";
            }
        },

        /**
         * Function handles tooltip for abc  indicator in list page
         * @param {String} abcIndicator 
         * @returns abcindicator desc for abc indicator column in list
         */
        formatTooltip: function (abcIndicator) {
            switch (abcIndicator) {
            case "A":
                return "Very Critical";
            case "B":
                return "Critical";
            case "C":
                return "Less Critical";
            default:
                return "";
            }
        },

        /**
        * Function to format equipment class
        * @param {String} sClass 
        */
        fnFormatEquipmentClass:function(sClass){
            var sReturn = "";
            if(sClass){
                var aFormatted = JSON.parse(sClass);
                if(aFormatted && aFormatted.length > 0){
                    aFormatted.forEach(function(item){
                        if(sReturn){
                            if(item.className){
                                sReturn = sReturn + ", " + item.classDescription + " ( " + item.className + " ) ";  
                            }else{
                                sReturn = sReturn + ", " + item.classDescription;  
                            }
                        }else{
                            if (item.className) {
                                sReturn = item.classDescription + " ( " + item.className + " ) ";
                            } else {
                                sReturn = item.classDescription;
                            }
                        }
                    })
                }
            }
            return sReturn
        },

        /**
         * Combined Filter
         * @param {Boolean} bIsEditable 
         * @param {String} sAbcIndicator 
         * @returns 
         */
        combinedVisibilityFormatter: function (bIsEditable, sAbcIndicator) {
            if (!bIsEditable && sAbcIndicator && sAbcIndicator.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        
        /**
         * Function to format tech objects
         */
        formatTechObjects: function (aEqui, aFloc) {
            var iCount = 0;

            if(aEqui && Array.isArray(aEqui)) {
                iCount = aEqui.length;
            }
            if(aFloc && Array.isArray(aFloc)) {
                iCount += aFloc.length;
            }

            if (iCount === 1) {
                return iCount + " Object";
            } else if (iCount > 1) {
                return iCount + " Objects";
            } else {
                return "";
            }
        },

        /**
         * 
         * @param {Array} aData 
         * @param {String} string 
         */
        formatCharData:function(aData, sRisk){
            var sString = "";
            if(aData){
                aData.forEach(function(obj){
                    if(obj.characteristicName === sRisk){
                        sString = obj.value
                    }
                })
                return sString
            }
        },

        /**
         * FUnciton that formates the failure mode
         */
        failureModeFormatter:function(text, name){
            if(name){
                return text + " (" + name + ")"
            }else if(text){
                return text
            }else {
                return ""
            }
        },

        /**
        * Function to format characteristic
        * @param {String} sClass 
        */
        fnFormatCharacteristicValue:function(sClass){
            var sReturn = "";
            if(sClass){
                var aFormatted = JSON.parse(sClass);
                if(aFormatted && aFormatted.length > 0){
                    aFormatted.forEach(function(item){
                        if(sReturn){
                            sReturn = sReturn + ", " + item.charName;  
                        }else{
                            sReturn = item.charName;
                        }
                    })
                }
            }
            return sReturn
        },

        /**
         * Visibility Filter
         * @param {String} sAbcIndicator 
         * @returns 
         */
        fnVisibilityFormatter: function (sAbcIndicator) {
            if (sAbcIndicator && sAbcIndicator.length > 0) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 
         */
        fnSkippedReasonState: function (sReason) {
            if (!sReason) {
                return "None";
            }

            switch (sReason) {
            case "Already Published":
                return "Success";

            case "Workflow In Progress":
                return "Warning";

            case "Incomplete Assessment (No Strategies)":
            case "Incomplete Assessment (No Technical Objects Assigned)":
            case "Incomplete Assessment (Risk Score/Criticality Missing)":
            case "Baseline Assessment":
                return "Information";

            default:
                return "None";
            }
        }

    });

});

