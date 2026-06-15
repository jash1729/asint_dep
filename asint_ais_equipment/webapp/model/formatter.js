jQuery.sap.declare("com.asint.ais.mi.equipment.model.localFormatter");

var Formatter = {
        
    /**
     * Function to return icon based on object type
     * @param {String} objType 
     * @returns 
     */
    fnGetSrcForEQorFL: function (objType) {
        if (objType == "FL") {
            return "sap-icon://map";
        } else if (objType == "EQU") {
            return "sap-icon://BusinessSuiteInAppSymbols/icon-equipment";
        }
    },

    /**
     * Function to format status text
     * @param {*} sStatus 
     * @returns 
     */
    formatStatusText: function (sStatus) {
        const mStatusMap = {
            CREATED: "Created",
            FOR_REVIEW: "For Review",
            IN_PROCESS: "In Process",
            ON_HOLD: "On Hold",
            READY_FOR_RELEASE: "Ready For Release",
            REJECTED: "Rejected",
            RELEASED: "Released",
            IMPL_IN_PROCESS: "Implementation in Process",
            IMPLEMENTED: "Implemented",
            OSNO: "Outstanding",
            CLOSED:"Closed"
        };

        return mStatusMap[sStatus] || sStatus;
    },

    /**
     * Function to format cycle
     * @param {*} sCycle 
     * @param {*} sUnit 
     * @returns 
     */
    formatCycle: function (sCycle, sUnit) {
        if (!sCycle && !sUnit) {
            return "";
        }
        if (sCycle && sUnit) {
            return sCycle + " / " + sUnit;
        }
        return sCycle || sUnit;
    },

    /**
     * Return Status based on sText
     * @param {String} sText 
     * @returns  Status
     */
    fnGetStatusTextByCode: function (sText) {
        if (sText == "OSNO") {
            return "Outstanding";
        } else if (sText == "REL") {
            return "Released";
        } else if (sText == "NOCO") {
            return "Completed";
        } else if (sText == "DLFL NOCO") {
            return "Deleted"
        }
        return sText;
    },
    
    /**
     * Function to set format text
     * @param {String} name 
     * @param {String} shortTitle 
     * @returns 
     */
    fnGetTextforHierarchy: function (name, shortTitle) {
        if (shortTitle) {
            return name + "(" + shortTitle + ")";
        } else {
            return name;
        }
    },
    
    /**
     * Function to get image Url
     * @param {String} imageId 
     * @returns 
     */
    fnGetImageUrl: function (imageId) {
        return imageId;
    },
     
    /**
     * FuNCTION TO SEND ICON BASED ON PRIORITY
     * @param {string} sType 
     * @returns 
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
     * F
     * @param {String} aDescription 
     * @returns 
     */
    fnGetDescriptionLanguageCode: function (aDescription) {

        var aLanguageCode = [];

        if (aDescription) {
            for (var i = 0; i < aDescription.length; i++) {
                if (aDescription[i].language) {
                    aLanguageCode.push(aDescription[i].language.toUpperCase());
                }
            }
        }

        return aLanguageCode.join(",");

    },

    /**
     * 
     * @param {String} sType - Object Type
     * @returns {String} code value
     */
    fnGetTemplateType: function (sType) {
        if (sType === "EQUI") {
            return "Equipment Template";
        } else if (sType === "Equipment") {
            return "Equipment Template";
        } else if (sType === "FL") {
            return "Functional Location Template";
        } else {
            return sType;
        }
    },

    /**
     * Format date
     * @param {object} oDate 
     * @param {string} sPattern 
     * @returns 
     */
    formatDate: function (oDate, sPattern) {

        var sDate = null;
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: sPattern || "MMM dd, yyyy"
        });

        if (oDate) {
            try {
                var oDateObj = null;

                if (typeof oDate === "string") {
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
     * To format object template type
     * 
     * @param {string} sType 
     * @returns string
     */
    fnFormatTemplateType:function(sType){
        if(sType == "EQUI"){
            return "Equipment Template"
        }else if(sType == "FLOC"){
            return "Functional Location Template";
        }
        return sType;
    },
    
    /**
     * Function handles color code for abc  indicator in list page
     * @param {String} abcIndicator 
     * @returns color code for abc indicator column in list
     */
    formatStatus: function(abcIndicator) {
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
     * Format tooltip for ABC Indicator
    * @param {string} abcIndicator - The ABC indicator value (A, B, C, etc.)
    * @param {array} aAbcIndicatorArray - Array of ABC indicators from API
    * @returns {string} - Description or key
    */
    formatTooltip: function(abcIndicator, aAbcIndicatorArray) {

    if (!abcIndicator) {
        return "";
    }

    if (!Array.isArray(aAbcIndicatorArray) || aAbcIndicatorArray.length === 0) {
        return abcIndicator;
    }

    var oIndicator = aAbcIndicatorArray.find(function(item) {
        return item.name === abcIndicator;
    });

    return oIndicator?.description || abcIndicator;
    },

    /**
     * Function to format uom
     * @param {String} sUom 
     * @param {Object} allUom 
     */
    fnFormatUom : function(sUom, allUom){
        var oFound = allUom[sUom];
        if(oFound){
            return oFound.description;
        }
        return sUom;
    },

    /**
     * Function to format uom
     * @param {String} sUom 
     * @param {Object} allUom 
     */
    fnFormatCharValueandUom : function(sValue, sUom, allUom){
        var oFound = allUom[sUom];
        var sUomDesc = sUom;
        if(oFound){
            sUomDesc =  oFound.description;
        }
        var sReturn = "-";
        if(sValue){
            sReturn = sValue + " " + sUomDesc;
        }
        return sReturn;
    },

    /**
     * Handles abc indicator  list tag 
     * for empty tag it returns false
     * and for non empty tag it return true 
     * @param {Object} value 
     * @returns 
     */
    formatVisible:function(value){
        if(value){
            return true;
        }
        else{
            return false;
        }
    },
     
    /**
     * Return category based on val 
     * @param {String} val 
     * @returns 
     */
    formatCategory:function(val,aCategory)
    {
        
        if(aCategory) {
            for (var i = 0; i < aCategory.length; i++) {
                if (val === aCategory[i].category) {
                    return aCategory[i].categoryDesc + " (" + aCategory[i].category + ")";
                }
            }
            return val;

        }
        return val;

    },
    
    /**
     * Return type based on val 
     * @param {String} val 
     * @returns 
     */
    formatTechnicalType: function(val,aTypes) {
        if(aTypes)
        {for (var i = 0; i < aTypes.length; i++) {
            if (val === aTypes[i].objectType) {
                return aTypes[i].objectTypeDesc + " (" + aTypes[i].objectType + ")";
            }
        }
        return val; 
        }
        return val;
    
    }, 

     
    /**
     * Function return priroty based on code
     * @param {String} sPriorityCode 
     * @returns 
     */
    fnGetPriorityByCode: function (sPriorityCode, sOrderType) {

        var sReturn = sPriorityCode;
        var oCommonModel = this.getView().getModel("mEquipment");
        var oTypes = oCommonModel.getProperty("/metadata/maintenanceOrderPriority");

        if (sPriorityCode && sPriorityCode.length > 0 && sOrderType) {
            
            // switch (sPriorityCode.toLowerCase()) {
            // case "1":
            //     sReturn = "Very High";
            //     break;
            // case "2":
            //     sReturn = "High";
            //     break;
            // case "3":
            //     sReturn = "Medium";
            //     break;
            // case "4":
            //     sReturn = "Low";
            //     break;
            // default:
            //     sReturn = sPriorityCode;
            // }
            var aPriority = [];
            if(oTypes[sOrderType]){
                aPriority = oTypes[sOrderType];
            }
            if(aPriority && aPriority.length > 0){
                for(var i=0;i<aPriority.length;i++){
                    if(aPriority[i].name == sPriorityCode){
                        sReturn = aPriority[i].desc;
                    }
                }
            }

        }

        return sReturn;

    },


    /**
     * Return Type based on sNotificationTypeCode
     * @param {String} sNotificationTypeCode 
     * @returns Notification Type
     */
    fnGetEquipmentTypeByCode: function (sNotificationTypeCode) {

        var sReturn = "";
        var oCommonModel = this.getView().getModel("mEquipment");
        var aTypes = oCommonModel.getProperty("/metadata/maintenanceOrderType");

        if (sNotificationTypeCode && sNotificationTypeCode.length > 0) {
            sReturn = sNotificationTypeCode;
            // switch (sNotificationTypeCode.toLowerCase()) {
            // case "y1":
            //     sReturn = "Reactive Work";
            //     break;
            // case "y2":
            //     sReturn = "Proactive Work";
            //     break;
            // case "m1":
            //     sReturn = "Maintenance Request";
            //     break;
            // case "m2":
            //     sReturn = "Malfunction Report";
            //     break;
            // case "m3":
            //     sReturn = "Activity Report";
            //     break;
            // default:
            //     sReturn = "";
            // }
            if(aTypes && aTypes.length > 0){
                for(var i=0;i<aTypes.length;i++){
                    if(aTypes[i].name == sNotificationTypeCode){
                        sReturn = aTypes[i].desc + " (" + sNotificationTypeCode + ")";
                    }
                }
            }
        }

        return sReturn;

    },


    /**
     * Return priority Icon bases on  sPriorityCode
     * @param {String} sPriorityCode 
     * @returns priority Icon
     */
    fnGetPriorityIconByCode: function (sPriorityCode) {

        var sReturn = "";

        if (sPriorityCode && sPriorityCode.length > 0) {
            switch (sPriorityCode.toLowerCase()) {
            case "1":
                sReturn = "sap-icon://BusinessSuiteInAppSymbols/icon-priority-2";
                break;
            case "2":
                sReturn = "sap-icon://BusinessSuiteInAppSymbols/icon-priority-1";
                break;
            case "3":
                sReturn = "sap-icon://arrow-right";
                break;
            case "4":
                sReturn = "sap-icon://arrow-bottom";
                break;
            default:
                sReturn = "";
            }
        }

        return sReturn;

    },

    /**
    * Return priority State based on  sPriorityCode
    * @param {String} sPriorityCode 
    * @returns priority State
    */
    fnGetPriorityStateByCode: function (sPriorityCode) {

        var sReturn = "None";

        if (sPriorityCode && sPriorityCode.length > 0) {
            switch (sPriorityCode.toLowerCase()) {
            case "1":
                sReturn = "Error";
                break;
            case "2":
                sReturn = "Error";
                break;
            case "3":
                sReturn = "Warning";
                break;
            case "4":
                sReturn = "Success";
                break;
            default:
                sReturn = "None";
            }
        }

        return sReturn;

    },

    /**
     * Function to get notification type by code.
     * 
     * @param {string} sNotificationTypeCode Notification type code.
     * 
     * @returns {string} Notification type.
     */
    fnGetNotificationTypeByCode: function (sNotificationTypeCode) {

        var sReturn = "";

        if (sNotificationTypeCode && sNotificationTypeCode.length > 0) {
            switch (sNotificationTypeCode.toLowerCase()) {
            case "y1":
                sReturn = "Reactive Work";
                break;
            case "y2":
                sReturn = "Proactive Work";
                break;
            case "m1":
                sReturn = "Maintenance Request";
                break;
            case "m2":
                sReturn = "Malfunction Report";
                break;
            case "m3":
                sReturn = "Activity Report";
                break;
            default:
                sReturn = sNotificationTypeCode;
            }
        }

        if(!sReturn){
            sReturn = sNotificationTypeCode;
        }
        return sReturn;

    },

    /**
     * Function to format code list text based on selected code
     * @param {String} code 
     * @param {Array} aCodeList 
     */
    fnFormatCodeListText : function(sCode, sFieldType, aCodeList){
        if(sFieldType === "ComboBox" && aCodeList){
            var sCodeText = "";
            aCodeList.forEach(function(oCode){
                if(oCode.code == sCode){
                    if(oCode.to_description && oCode.to_description.length > 0){
                        sCodeText = oCode.to_description[0].shortDescription;
                    }
                }
            });
            return sCodeText;
        }
        return sCode;
    },

    /**
    * Return Status  based on sStatusCode
    * @param {String} sStatusCode 
    * @returns Status State
    */
    fnGetTaskStatusByCode: function (sStatusCode) {

        if (sStatusCode == "NEW") {
            return "New";
        } else if (sStatusCode == "COMP" || sStatusCode == "Completed") {
            return "Completed";
        } else if (sStatusCode == "REJ") {
            return "Rejected";
        } else if (sStatusCode == "INPROG" || sStatusCode == "In Progress") {
            return "In Progress";
        }

        return sStatusCode;
    },

    /**
    * Return Status  State based on sStatusCode
    * @param {String} sStatusCode 
    * @returns Status State
    */
    fnGetTaskStatusStateByCode: function (sStatusCode) {

        if (sStatusCode == "NEW") {
            return "Warning";
        } else if (sStatusCode == "COMP" || sStatusCode == "Completed") {
            return "Success";
        } else if (sStatusCode == "REJ") {
            return "Error";
        } else if (sStatusCode == "INPROG" || sStatusCode == "In Progress") {
            return "Information";
        }

        return sStatusCode;
    },

    /**
     * Handles abc indicator  list tag 
     * for empty tag it returns false
     * and for non empty tag it return true 
     * @param {Object} value 
     * @returns 
     */
    fnFormatGenericTagVisible:function(value){
        if(value && value != "NA"){
            return true;
        }
        else{
            return false;
        }
    },

    /**
     * Handles abc indicator  list tag 
     * for empty tag it returns false
     * and for non empty tag it return true 
     * @param {Object} value 
     * @returns 
     */
    formatRiskGenericTagColor:function(sValue){
        var oCommonModel = this.getModel("mEquipment");
        var aRiskColor = oCommonModel.getProperty("/metadata/MitigatedRiskDropDown");
        // var sValState = "None";
        // var oValueStateMap = {
        //     "Red":"Error",
        //     "Orange":"Success",
        //     "Yellow":"Warning",
        //     "Green":"None"
        // };

        this.removeStyleClass("GenericTagCustomRed");
        this.removeStyleClass("GenericTagCustomOrange");
        this.removeStyleClass("GenericTagCustomYellow");
        this.removeStyleClass("GenericTagCustomGreen");
        this.removeStyleClass("GenericTagCustomDarkGrey");
        this.removeStyleClass("GenericTagCustomLightGrey");


        if(sValue){
            if(aRiskColor && aRiskColor.length > 0){
                var sColor = "";
                for(var i=0;i<aRiskColor.length;i++){
                    if(aRiskColor[i].risk == sValue){
                        sColor = aRiskColor[i].color;
                    }
                }
                if(sColor){
                    switch(sColor){
                    case "Red":
                        // sValState = oValueStateMap[sColor];
                        this.addStyleClass("GenericTagCustomRed");
                        break;
                    case "Orange":
                        // sValState = oValueStateMap[sColor];
                        this.addStyleClass("GenericTagCustomOrange");
                        break;
                    case "Yellow":
                        // sValState = oValueStateMap[sColor];
                        this.addStyleClass("GenericTagCustomYellow");
                        break;
                    case "Green":
                        // sValState = oValueStateMap[sColor];
                        this.addStyleClass("GenericTagCustomGreen");
                        break;
                    case "lightGrey":
                        this.addStyleClass("GenericTagCustomLightGrey");
                        break;
                    case "darkGrey":
                        this.addStyleClass("GenericTagCustomDarkGrey");
                        break;
                    }
                }
            }
        }
        return "None";
    },

    /**
     * Handles abc indicator  list tag 
     * for empty tag it returns false
     * and for non empty tag it return true 
     * @param {Object} value 
     * @returns 
     */
    fnCheckandReturnColor:function(sValue){
        var oCommonModel = this.getView().getModel("mEquipment");
        var aRiskColor = oCommonModel.getProperty("/metadata/MitigatedRiskDropDown");
        var sColor = "";
        if(sValue){
            if(aRiskColor && aRiskColor.length > 0){
                for(var i=0;i<aRiskColor.length;i++){
                    if(aRiskColor[i].risk == sValue){
                        sColor = aRiskColor[i].color;
                    }
                }
                if(sColor){
                    return sColor;
                }
            }
        }
        return sColor;
    },

    /**
     * Status Formatter
     * @param {String} sStatus 
     * @returns {String}
     */
    fnRecoStatusFormatter: function (sStatus) {
        var sFormattedStatus = sStatus;
        switch (sStatus) {
        case "CREATED":
            sFormattedStatus = "Created"
            break;
        case "IN_PROCESS":
            sFormattedStatus = "In Process"
            break;
        case "FOR_REVIEW":
            sFormattedStatus = "For Review"
            break;
        case "REJECTED":
            sFormattedStatus = "Rejected"
            break;
        case "ON_HOLD":
            sFormattedStatus = "On Hold"
            break;
        case "IMPL_IN_PROCESS":
            sFormattedStatus = "Implementation in Process"
            break;
        case "IMPLEMENTED":
            sFormattedStatus = "Implemented"
            break;
        case "READY_FOR_RELEASE":
            sFormattedStatus = "Ready For Release"
            break;
        case "CLOSED":
            sFormattedStatus = "Closed"
        case "RELEASED":
            sFormattedStatus = "Released"
        }

        return sFormattedStatus;

    },

    /**
     * Status color Formatter
     * @param {String} sStatus 
     * @returns {String}
     */
    fnRecoStatusColorFormatter: function (sStatus) {
        var sFormattedStatusColor = "None";
        switch (sStatus) {
        case "FOR_REVIEW":
        case "READY_FOR_RELEASE":
            sFormattedStatusColor = "Warning"
            break;
        case "REJECTED":
            sFormattedStatusColor = "Error"
            break;
        case "IMPLEMENTED":
        case "RELEASED":
            sFormattedStatusColor = "Success"
        }
        return sFormattedStatusColor;
    },

    /**
     * Function to format visibility
     */
    formatFlagComponentVisibility : function(sRepairText){
        if(sRepairText){
            return true;
        }
        return false;
    },

    /**
     * Function to get status finding  in detail pagw
     * @param {String} sStatusCode 
     * @returns 
     */
    fnGetStatusStateByCodeFindinginFindingsDetail: function (sStatusCode) {

        this.removeStyleClass("asintStyleFindingClassRed");
        this.removeStyleClass("asintStyleFindingClassGreen");
        this.removeStyleClass("asintStyleFindingClassOrange");
        this.removeStyleClass("asintStyleFindingClassBlue");
        this.removeStyleClass("asintStyleFindingClassIndigo");


        if (sStatusCode == "NEW") {
            this.addStyleClass("asintStyleFindingClassOrange");
            return "New";
        } else if (sStatusCode == "CLOSED") {
            this.addStyleClass("asintStyleFindingClassGreen");
            return "Closed";
        } else if (sStatusCode == "INP") {
            this.addStyleClass("asintStyleFindingClassBlue");
            return "In Progress";
        } else if (sStatusCode == "REW") {
            this.addStyleClass("asintStyleFindingClassIndigo");
            return "Rework Required";
        } else if (sStatusCode == "REJ") {
            this.addStyleClass("asintStyleFindingClassRed");
            return "Rejected";
        } else if(sStatusCode == "APP"){
            this.addStyleClass("asintStyleFindingClassOrange");
            return "Approved";
        }
    },

    /**
     * Function to format total actual cost
     */
    formatTotalActualCost : function(sCost, sCurrency){
        if(sCost && sCurrency){
            return sCost + " " + sCurrency;
        }
        return "";
    },

    /**
     * Function to format date string fields in an object
     * @param {Object} obj
     */
    formatDates: function (obj) {
        var fmt = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "dd-MM-yyyy HH:mm:ss"
        });
        Object.keys(obj).forEach(function (k) {
            var v = obj[k];
            if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
                var d = new Date(v);
                if (!isNaN(d.getTime())) {
                    obj[k] = fmt.format(d);
                }
            }
        });
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
                        sReturn = sReturn + ", " + item.classDescription;
                    }else{
                        sReturn = item.classDescription;
                    }
                })
            }
        }
        return sReturn
    },

    /**
     * Function to set the formatter for RCA Assessment Status
     * @param {String} sStatus 
     * @returns SType - Return the Object status state
     */
    fnGetStatusTypeLocalFormatter: function (sStatus) {
        
        var oStatus = {
            "success": ["Created", "Released"],
            "warning": ["In Process"],
            "error": ["Obsolete"]
        };
        if (oStatus.success.includes(sStatus)) {
            return "Success";
        } else if (oStatus.warning.includes(sStatus)) {
            return "Warning";
        } else if (oStatus.error.includes(sStatus)) {
            return "Error";
        } else {
            return "None";
        }
        
    },

    /**
     * Function to format multi combobox value
     * @param {String|Array} sValue - Value to be formatted
     */
    fnFormatMultiComboBoxValue: function (sValue) {
        if(Array.isArray(sValue)) {
            return sValue;
        }
        if(typeof sValue === "string") {
            try {
                if(sValue.trim().startsWith("[")) {
                    return JSON.parse(sValue);
                } else {
                    return [sValue];
                }
            } catch (oException) {
                return [];
            }
        }
    },

    /**
     * Function to format data
     */
    formatCommaSeparated: function(aItems) {
        if (!Array.isArray(aItems)) {
            return "";
        }
        return aItems.map(item => typeof item === "string" ? item : item.text || "").join(", ");
    },

    /**
     * Function to format component names
     */
    componentNameFormatter: function (aEquipComp, aFlocComp) {

        var aComponentNames = [];

        if (aEquipComp && aEquipComp.length > 0) {
            for (var i = 0; i < aEquipComp.length; i++) {
                if (aEquipComp[i].equipment && aEquipComp[i].equipment.name) {
                    aComponentNames.push(aEquipComp[i].equipment.name);
                }
            }
        }

        if (aFlocComp && aFlocComp.length > 0) {
            for (var j = 0; j < aFlocComp.length; j++) {
                if (aFlocComp[j].floc && aFlocComp[j].floc.name) {
                    aComponentNames.push(aFlocComp[j].floc.name);
                }
            }
        }

        return aComponentNames.join(", ");
    },


    /**
     * Function that formats the category desc and category key
     * @param {String} desc 
     * @param {string} key 
     * @returns 
     */
    fnFormatCriticalityText: function(code, text) {
        if (code && text) {
            return code + " (" + text + ")";
        } else if (code) {
            return code;
        } else if (text) {
            return text;
        } else {
            return "";
        }
    },
};

com.asint.ais.mi.equipment.model.localFormatter = Formatter;

sap.ui.define([
    "com/asint/ais/library/model/formatter"
], function (formatter) {
    "use strict";

    return formatter.extend("com.asint.ais.mi.equipment.model.formatter",Formatter);

});
