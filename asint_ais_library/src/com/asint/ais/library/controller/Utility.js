sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/asint/ais/library/utils/Cache",
    "com/asint/ais/library/model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/util/Storage",
    "sap/m/Token",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/core/BusyIndicator",
], function (Controller, Cache, formatter, Spreadsheet, JSONModel, MessageBox, Storage, Token, Fragment, Filter, BusyIndicator) {
    "use strict";

    return Controller.extend("com.asint.ais.library.controller.Utility", {
        formatter: new formatter(),

        Cache: Cache,

        /**
		 * Constructor function for initializing the object.
		 * 
		 * @constructor
		 */
        constructor: function () {
            this.fnGetLanguageList();
        },

        LANG_LIST: [],

        LANG_LIST_MAP: {},

        USER_LANG: sap.ui.getCore().getConfiguration().getLanguage() || "en",

        DFLT_LANG: "en",
  
        /**
		 * 
		 * @returns new formatter()
		 */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
		 * Navigates to a different application or view.
		 * 
		 * @param {string} sHashWithKeyword - Hash string 
		 * @param {Object} oParam 
		 */
        fnNavigate: function (sHashWithKeyword, oParam) {	
            var sHash = sHashWithKeyword;
            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            var aKeys = Object.keys(oParam);
            aKeys.forEach(function(sKey) {
                sHash = sHash.replace("{" + sKey + "}", oParam[sKey]);
            });
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: sHash
                }
            });

        },
        /**
		 * Retrieves the logged-in user's email address.
		 * 
		 * @returns {string} The email address of the logged-in user, or an empty string if not available.
		 */
        getLoggedInUserMail: function () {
            var sEmail = "";
            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
                sEmail = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
            }
            return sEmail;

        },

        /**
         * Function to return loggedin user email placeholder
         */
        getLoggedInUserMailForBeWfProxy: function () {
            return "$#LOGGEDINUSEREMAIL#$";
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
         * Navigate URL
         * @param {string} sHashWithKeyword 
         */
        getNavUrlForBeWfProxy: function(sHashWithKeyword) {
            var siteIdIndex = window.location.search.indexOf("siteId");
            var sSite = "";
            var sUrl = "";

            if(siteIdIndex > -1) {
                sSite = window.location.search.substring(siteIdIndex, window.location.search.indexOf("&", siteIdIndex));
                sUrl = "$#BASEURL#$/site?" + sSite + "#" + sHashWithKeyword;
            }else {
                sUrl = "$#BASEURL#$/#" + sHashWithKeyword;
            }
            return sUrl;
        },

        /**
		 * Retrieves the list of languages.
		 */
        fnGetLanguageList: function () {
            /**
			 * Retrives the language list
			 * @param {Array} aLanguages 
			 */
            var fnCallback = function (aLanguages) {
                var oModel = new JSONModel(aLanguages);
                this.LANG_LIST = [];
                for (var i = 0; i < aLanguages.length; i++) {
                    if (aLanguages[i].key !== "default") {
                        this.LANG_LIST.push(aLanguages[i]);
                        this.LANG_LIST_MAP[aLanguages[i].key] = aLanguages[i];
                    }
                }
                sap.ui.getCore().setModel(oModel, "mLanguages");
            };
            if (sap.ushell && sap.ushell.Container) {
                sap.ushell.Container.getService("UserInfo").getLanguageList().then(fnCallback.bind(this));
            } else {
                fnCallback.apply(this, [[
                    {
                        "key": "cs",
                        "text": "Czech"
                    },
                    {
                        "key": "da",
                        "text": "Danish"
                    },
                    {
                        "key": "en",
                        "text": "English"
                    },
                    {
                        "key": "fr",
                        "text": "French"
                    },
                    {
                        "key": "de",
                        "text": "German"
                    },
                    {
                        "key": "hu",
                        "text": "Hungarian"
                    },
                    {
                        "key": "it",
                        "text": "Italian"
                    },
                    {
                        "key": "ja",
                        "text": "Japanese"
                    },
                    {
                        "key": "ko",
                        "text": "Korean"
                    },
                    {
                        "key": "pl",
                        "text": "Polish"
                    },
                    {
                        "key": "pt",
                        "text": "Portuguese"
                    },
                    {
                        "key": "ro",
                        "text": "Romanian"
                    },
                    {
                        "key": "ru",
                        "text": "Russian"
                    },
                    {
                        "key": "zh-CN",
                        "text": "Simplified Chinese"
                    },
                    {
                        "key": "es",
                        "text": "Spanish"
                    }
                ]]);
            }
        },

        /**
		 * Retrieves UoM system from storage.
		 * @param {function} fnCallback Callback function to be executed with the UoM system as an argument
		 * @returns {string} The UoM system if available.
		 */
        getSelectedUoMSystem: function (fnCallback) {
            var sUoMSystem = Storage.get("UOMSystem");
            if (fnCallback) {
                if (sUoMSystem) {
                    fnCallback(sUoMSystem);
                } else {
                    /**
					 * Check UoM system at interval of 1 sec
					 * @param {function} fnCallback Callback function 
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
		 * This function handles exporting the provided table data to an Excel file. 
		 * @param {Object} oParam1 
		 * @param {string} sFileName 
		 * @param {function} fnCustomExport - A callback function that is used to customize the export process.
		 */
        fnExportTableDataToExcel: function (oParam1, sFileName, fnCustomExport) {
            var oTable;
            var that = this;
            /**
			 * Exports data to a spreadsheet using the provided settings.
			 * @param {object} oSetting 
			 */
            var fnExport = function(oSetting) {
                var oSheet = new Spreadsheet(oSetting);
				
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            }
            if (oParam1.getMetadata && oParam1.getMetadata() && ["sap.m.Table", "sap.ui.table.Table"].includes(oParam1.getMetadata().getName())) {
                oTable = oParam1;
            } else {
                if (this.getView && this.getView()) {
                    oTable = this.getView().byId(oParam1);
                }
                if (!oTable) {
                    oTable = sap.ui.getCore().byId(oParam1)
                }
            }

            if (oTable) {
                var sTableType = oTable.getMetadata().getName();
                var oItems = sTableType === "sap.m.Table" ? oTable.getBinding("items") : oTable.getBinding("rows");
                var oTableModel = oItems.getModel();
                var aTableColumns = oTable.getColumns();
                var aColumns = this.fnExportTableGetColumnConfig(aTableColumns, sTableType);
                var oSetting = {
                    workbook: {
                        columns: aColumns,
                        context: {
                            sheetName: "Export"
                        }
                    },
                    fileName: sFileName || "Excel export"
                };

                if(fnCustomExport) {
                    fnCustomExport(function(aDataSource, aCustomCols) {
                        var aExistCols = oSetting.workbook.columns;
                        if(aCustomCols && aCustomCols.length > 0){

                            aExistCols = aCustomCols;
                        }
                        aExistCols.forEach(function(oCol){
                            if(!oCol.property){
                                oCol.property = oCol.label.replace(/[^a-zA-Z0-9]/g, "_");
                            }
                        });
                        oSetting.workbook.columns = aExistCols;
                        if(aDataSource && aDataSource.length > 0) {
                            oSetting.dataSource = aDataSource;
                        } else {
                            oSetting.dataSource = [{}];
                        }
                        fnExport(oSetting);
                    });
                } else {
                    if (oItems.getDownloadUrl) {
                        // var oParameters = oItems.getQueryOptionsFromParameters();
                        if(oItems.getCount && oItems.getCount()) {
                            oSetting.dataSource = {
                                type: "odata",
                                dataUrl: oItems.getDownloadUrl ? oItems.getDownloadUrl() : null,
                                /*serviceUrl: this._sServiceUrl,*/
                                headers: oTableModel.getHeaders ? oTableModel.getHeaders() : null,
                                count: oItems.getCount ? oItems.getCount() : null,
                                useBatch: true
                            }
                            fnExport(oSetting);
                        } else {
                            that.fnFetchInlineCount(that, oTable.getId(), function (sCount) {
                                if(sCount && Number(sCount) > 0) {
                                    oSetting.dataSource = {
                                        type: "odata",
                                        dataUrl: oItems.getDownloadUrl ? oItems.getDownloadUrl() : null,
                                        /*serviceUrl: that._sServiceUrl,*/
                                        headers: oTableModel.getHeaders ? oTableModel.getHeaders() : null,
                                        count: sCount ? Number(sCount) : null,
                                        useBatch: true
                                    }
                                } else {
                                    oSetting.dataSource = [{}];
                                }
                                fnExport(oSetting);
                            });
                        }
						
                    } else {
                        // oSetting.dataSource = oItems;
                        if(oItems.getLength() > 0) {
                            oSetting.dataSource = oItems;
                        } else{
                            oSetting.dataSource = [{}];
                        }
                        fnExport(oSetting);
                    }
                }

            }

        },

        /**
		 * Wrapper function to export table data to an Excel file.
		 * @param {object} oParam1 
		 * @param {string} sFileName 
		 * @param {function} fnCustomExport 
		 */
        fnExportTableDatatoExcel: function (oParam1, sFileName, fnCustomExport) {
            this.fnExportTableDataToExcel(oParam1, sFileName, fnCustomExport);
        },

        /**
		 * Retrieves column configuration information for a table.
		 * @param {object} aTableColumns 
		 * @param {string} sTableType 
		 * @returns {Object} An object containing column configuration information.
		 */
        fnExportTableGetColumnConfig: function (aTableColumns, sTableType) {
            var aCols = [];
            var oI18nBundle = this.getView && this.getView() ? this.getView().getModel("i18n").getResourceBundle() : null;
            switch (sTableType) {
            case "sap.m.Table":
                aTableColumns.forEach(function (oColumn) {
                    if (oColumn.getVisible()) {
                        var oSettings = oColumn.getAggregation("header").data("exportSettings");
                        var sLabel = oColumn.getAggregation("header").getProperty("text");
                        var oValueMaps = oColumn.getAggregation("header").data("valueMaps");
                        var sDataType = oColumn.getAggregation("header").data("dataTypeExport");
                        if (oSettings) {
                            for (var i = 0; i < oSettings.fields.length; i++) {
                                var oCol = {};
                                oCol.label = oI18nBundle && oI18nBundle.getText(oSettings.fields[i].i18n) ? oI18nBundle.getText(oSettings.fields[i].i18n) : sLabel;
                                oCol.property = oSettings.fields[i].value;
                                if(oValueMaps){
                                    oCol.type = "Enumeration";
                                    oCol.valueMap = oValueMaps;
                                }
                                if(sDataType && i == 0){
                                    oCol.type = sDataType;
                                }
                                aCols.push(oCol);
                            }
                        } else {
                            var Col = {};
                            Col.label = oColumn.getAggregation("header").getProperty("text");
                            Col.property = oColumn.getAggregation("header").data("tableSettings");
                            if(oValueMaps){
                                Col.type = "Enumeration";
                                Col.valueMap = oValueMaps;
                            }
                            if(sDataType){
                                Col.type = sDataType;
                            }
                            aCols.push(Col);
                        }
                    }
                });
                break;
            case "sap.ui.table.Table":
                aTableColumns.forEach(function (oColumn) {
                    if (oColumn.getVisible() && oColumn.data("exportProperty")) {
                        var oSettings = oColumn.data("exportProperty");
                        var sLabel = oColumn.getAggregation("label").getProperty("text");
                        if (oSettings && oSettings.fields) {
                            for (var i = 0; i < oSettings.fields.length; i++) {
                                var oCol = {};
                                oCol.label = oI18nBundle && oI18nBundle.getText(oSettings.fields[i].i18n) ? oI18nBundle.getText(oSettings.fields[i].i18n) : sLabel;
                                oCol.property = oSettings.fields[i].value;
                                aCols.push(oCol);
                            }
                        } else {
                            var Col = {};
                            Col.label = oColumn.getAggregation("label").getProperty("text");
                            Col.property = oColumn.data("exportProperty");
                            aCols.push(Col);
                        }
                    }
                });
                break;
            default:
                aTableColumns.forEach(function (oColumn) {
                    if (oColumn.getVisible() && oColumn.data("exportProperty")) {
                        var oCol = {};
                        oCol.label = oColumn.getAggregation("label").getProperty("text");
                        oCol.property = oColumn.data("exportProperty");
                        aCols.push(oCol);
                    }
                });
                break;
            }

            return aCols;

        },

        /**
		 * Exports the data from a specified table to an Excel file.
		 *
		 * @param {string} sTableId 
		 * @param {string} sFileName 
		 */
        fnExportTableDatatoExcelforTableConstruct: function (sTableId, sFileName) {
            // var oTable = this.getView().byId(sTableId);          
            var oTable;
            if (sTableId.getMetadata() && (sTableId.getMetadata().getName() === "sap.m.Table" || sTableId.getMetadata().getName() === "sap.ui.table.Table")) {
                oTable = sTableId;
            } else {
                oTable = sap.ui.getCore().byId(sTableId) || this.getView().byId(sTableId);
            }
            var oColumns = oTable.getColumns();
            var sTableType = oTable.getMetadata().getName();
            var oItems = sTableType === "sap.m.Table" ? oTable.getBinding("items") :oTable.getBinding("items").getPath();
            var oTableModel = oItems.getModel();
            var aColumns = this.fnGetColumnConfig(oColumns, sTableType);
            var oSetting = {
                workbook: {
                    columns: aColumns,
                    context: {
                        sheetName: "Export"
                    }
                },
                fileName: sFileName || "Excel export"
            };

            if (oItems.getDownloadUrl) {
                oSetting.dataSource = {
                    type: "odata",
                    dataUrl: oItems.getDownloadUrl ? oItems.getDownloadUrl() : null,
                    /*serviceUrl: this._sServiceUrl,*/
                    headers: oTableModel.getHeaders ? oTableModel.getHeaders() : null,
                    count: oItems.getLength ? oItems.getLength() : null,
                    useBatch: true
                }
            } else {
                // oSetting.dataSource = oItems;
                if(oItems.getLength() > 0) {
                    oSetting.dataSource = oItems;
                } else{
                    oSetting.dataSource = [{}];
                }
            }

            var oSheet = new Spreadsheet(oSetting);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });

        },

        /**
		 * Retrieves column configuration information.
		 *
		 * @param {Object>} oColumns 
		 * @param {string} type 
		 * @returns {Object} 
		 */
        fnGetColumnConfig: function (oColumns, type) {
            var aCols = [];
            var oI18nBundle = this.getView() ? this.getView().getModel("i18n").getResourceBundle() : "";
            switch (type) {
            case "sap.m.Table":
                oColumns.forEach(function (colObj) {
                    if (colObj.getVisible()) {
                        var oSettings = colObj.getAggregation("header").data("exportSettings");
                        if (oSettings) {
                            for (var i = 0; i < oSettings.fields.length; i++) {
                                var tempObj = {};
                                tempObj.label = ( oI18nBundle ? oI18nBundle.getText(oSettings.fields[i].i18n) : false ) || colObj.getAggregation("header").getProperty("text");
                                tempObj.property = oSettings.fields[i].value;
                                aCols.push(tempObj);
                            }
                        } else {
                            var Obj = {};
                            Obj.label = colObj.getAggregation("header").getProperty("text");
                            Obj.property = colObj.getAggregation("header").data("tableSettings");
                            aCols.push(Obj);
                        }
                    }
                });
                break;
            default:
                oColumns.forEach(function (colObj) {
                    if (colObj.getVisible() && colObj.data("exportProperty")) {
                        var tempObj = {};
                        tempObj.label = colObj.getAggregation("label").getProperty("text");
                        tempObj.property = colObj.data("exportProperty");
                        aCols.push(tempObj);
                    }
                });
                break;
            }
            return aCols; 

        },

        /**
		 * Formats a number value 
		 *
		 * @param {string|number} sValue 
		 * @param {number} iPercision 
		 * @param {number} iScale 
		 * @param {boolean} bReturnNullForInvalid 
		 * @returns {string} 
		 */
        fnFormatNumber: function (sValue, iPercision, iScale, bReturnNullForInvalid) {
            var bNegative = false;
            if (isNaN(sValue) || sValue === "" || isNaN(iPercision) || sValue === null) {
                return bReturnNullForInvalid ? null : sValue;
            }

            sValue = Number(sValue).toString();
            iPercision = Number(iPercision);
            if (!iScale) {
                iScale = 0;
            }

            if (iPercision < 0 || iScale < 0) {
                return bReturnNullForInvalid ? null : sValue;
            }

            if (sValue.charAt(0) === "-") {
                bNegative = true;
                sValue = sValue.substring(1);
            }

            if(sValue.includes("e") || sValue.includes("E")) {
                sValue = parseFloat(sValue).toFixed(iScale).toString();
            }

            if (sValue.includes(".")) {
                var aUnPack = [];
                sValue = parseFloat(sValue).toFixed(iScale).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
                aUnPack = sValue.split(".");

                if (aUnPack[0].length > (iPercision - iScale)) {
                    if ((iPercision - iScale) > 0) {
                        aUnPack = ["9".repeat(iPercision - iScale)];
                    } else {
                        aUnPack = [];
                    }
                }

                sValue = aUnPack.join(".");
            } else if (sValue.length > (iPercision - iScale)) {
                sValue = "9".repeat(iPercision - iScale);
            }

            return bNegative && sValue !== "0" ? "-" + sValue : sValue;

        },

        /**
		 * Formats an attachment icon based on its file type.
		 *
		 * @param {string} sAttachmentFileType 
		 * @returns {string} The URL 
		 */
        fnFormatAttachmentIconBasedOnfileType: function (sAttachmentFileType ) {
            var sAttachmentIcon = "sap-icon://document";   
            var attachmentMimeTypeDataDictionary = com.asint.ais.mi.idms.model.constants.documentMimeTypes;
            if (sAttachmentFileType !== "Link") {
                if (attachmentMimeTypeDataDictionary) {
                    if (Object.prototype.hasOwnProperty.call(attachmentMimeTypeDataDictionary, sAttachmentFileType)) {
                        return attachmentMimeTypeDataDictionary[sAttachmentFileType];
                    }
                }
            } else {
                return "sap-icon://chain-link";
            }
            return sAttachmentIcon;  
        },

        /**
		 * Retrieves the precision and scale of a number value.
		 *
		 * @param {number} sValue 
		 * @returns {Object} An object containing the precision and scale properties.
		 */
        fnGetPrecisionAndScale: function (sValue) {
            var oReturn = {
                precision: null,
                scale: null
            };
            var sTypeOfValue = typeof sValue;

            if (sTypeOfValue === "number" || sTypeOfValue === "string") {
                if (sTypeOfValue === "string" && sValue.toLowerCase().indexOf("e") > -1) {
                    sValue = Number(sValue);
                }
                sValue = sValue.toString();

                var iDecimalIdx = sValue.indexOf(".");
                if (iDecimalIdx > -1) {
                    oReturn.scale = sValue.length - iDecimalIdx - 1;
                } else {
                    oReturn.scale = 0;
                }
                oReturn.precision = sValue.replace(/[^0-9]/g, "").length;
            }

            return oReturn;

        },

        /**
		 * Sorts an array of descriptions in descending order based on preferences and priorities.
		 *
		 * @param {array} aDescription 
		 * @returns {array} The sorted array of descriptions.
		 */
        fnSortDescByPrefAndPriority: function (aDescription) {
            var oLanguageIndex = {};
            for (var i = 0; i < aDescription.length; i++) {
                oLanguageIndex[aDescription[i].language] = i;
            }
            var iIndexToUnShift = oLanguageIndex[this.USER_LANG] || oLanguageIndex[this.DFLT_LANG] || -1;
            if (iIndexToUnShift > 0) {
                aDescription.unshift(aDescription.splice(iIndexToUnShift, 1)[0]);
            }
            return aDescription;
        },

        /**
		 * Retrieves the description with the preference from an array of descriptions.
		 *
		 * @param {Array} aDescription 
		 * @returns {Object} The description with the preference.
		 */
        fnGetDescriptionByPref: function (aDescription) {
            if (aDescription) {
                var oLangDict = {};
                for (var i = 0; i < aDescription.length; i++) {
                    oLangDict[aDescription[i].language] = aDescription[i];
                }
                return oLangDict[this.USER_LANG] || oLangDict["en"] || (aDescription.length > 0 ? aDescription[0] : { "shortDescription": "", "longDescription": "", "language": "" });
            } else {
                return { "shortDescription": "", "longDescription": "", "language": "" };
            }
        },

        /**
		 * Fetches the inline count for a specified table.
		 *
		 * @param {Object} localThis 
		 * @param {string} sTableId 
		 * @param {function} fnCallBack 
		 */
        fnFetchInlineCount: function(localThis, sTableId, fnCallBack){
            var that = localThis;
            var oTable = that.getView().byId(sTableId);

            if(!oTable) {
                oTable = sap.ui.getCore().byId(sTableId);
            }
            if(oTable) {
                var sTableType = oTable.getMetadata().getName();
                var sDownloadUrl = sTableType === "sap.m.Table" ? oTable.getBinding("items").getDownloadUrl() : oTable.getBinding("rows").getDownloadUrl();
                var aSplit = sDownloadUrl.split("$");
                var sFilters = "";
                var sAdvancedFilter = "";
                var sPart1 = aSplit[0];
                var sUrlPart1 = sPart1.split("?")[0];
                aSplit.forEach(function(sSubUrl){
                    if(sSubUrl.startsWith("filter")){
                        sFilters = sSubUrl;
                    }
                    if(sSubUrl.includes("advancedFilter")){
                        var aAdvSplit = sSubUrl.split("&");
                        if(aAdvSplit && aAdvSplit.length > 0){
                            aAdvSplit.forEach(function(sAdv){
                                if(sAdv.includes("advancedFilter")){
                                    sAdvancedFilter = sAdv;
                                }
                            })
                        }

                    }
                });
                var sTotalUrl = "";
                if(sFilters){
                    sTotalUrl = sUrlPart1 + "/$count?$" + sFilters;
                    if(sAdvancedFilter){
                        sTotalUrl = sTotalUrl + "&" + sAdvancedFilter;
                    }
                }else{
                    sTotalUrl = sUrlPart1 + "/$count";
                    if(sAdvancedFilter){
                        sTotalUrl = sTotalUrl + "?" + sAdvancedFilter;
                    }
                }
                $.ajax(sTotalUrl, {
                    /**
                     * Success function
                     */
                    success: function (iCount) {
                        fnCallBack(iCount);
                    },
                    /**
                     * Error function
                     */
                    error: function () {
                        fnCallBack(0);
                    }
                });
            }
        },

        /**
		 * Fetches the inline count for a specified UI table.
		 *
		 * @param {Object} localThis 
		 * @param {string} sTableId 
		 * @param {function} fnCallBack 
		 */
        fnFetchInlineCountUiTable : function(localThis, sTableId, fnCallBack){
            var that = localThis;
            var oTable = that.getView().byId(sTableId);
            var sDownloadUrl = oTable.getBinding("rows").getDownloadUrl();
            var aSplit = sDownloadUrl.split("$");
            var sFilters = "";
            var sPart1 = aSplit[0];
            var sUrlPart1 = sPart1.split("?")[0];
            aSplit.forEach(function(sSubUrl){
                if(sSubUrl.startsWith("filter")){
                    sFilters = sSubUrl;
                }
            });
            var sTotalUrl = "";
            if(sFilters){
                sTotalUrl = sUrlPart1 + "/$count?$" + sFilters;
            }else{
                sTotalUrl = sUrlPart1 + "/$count";
            }

            $.ajax(sTotalUrl, {
                /**
				 * Success function
				 */
                success: function (iCount) {
                    fnCallBack(iCount);
                },
                /**
				 * Error function
				 */
                error: function () {
                    fnCallBack(0);
                }
            });
        },

        /**
		 * Fetches the inline count for a specified fragment table.
		 *
		 * @param {Object} localThis 
		 * @param {Object} oTable 
		 * @param {function} fnCallBack 
		 */
        fnFetchInlineCountFragmentTable : function(localThis, oTable, fnCallBack){
            // var that = localThis;
            // var oTable = that.getView().byId(sTableId);
            var sDownloadUrl = oTable.getBinding("items").getDownloadUrl();
            var aSplit = sDownloadUrl.split("$");
            var sFilters = "";
            var sPart1 = aSplit[0];
            var sUrlPart1 = sPart1.split("?")[0];
            aSplit.forEach(function(sSubUrl){
                if(sSubUrl.startsWith("filter")){
                    sFilters = sSubUrl;
                }
            });
            var sTotalUrl = "";
            if(sFilters){
                sTotalUrl = sUrlPart1 + "/$count?$" + sFilters;
            }else{
                sTotalUrl = sUrlPart1 + "/$count";
            }

            $.ajax(sTotalUrl, {
                /**
				 * Success function
				 */
                success: function (iCount) {
                    fnCallBack(iCount);
                },
                /**
				 * Error function
				 */
                error: function () {
                    fnCallBack(0);
                }
            });
        },

        /**
		 * Initializes a rich text editor.
		 *
		 * @param {Object} controllerRef 
		 * @param {string} rteIframeId 
		 * @param {Object} rteRef 
		 * @param {Object} textRef 
		 */
        fnRichTextEditorReady:function(controllerRef, rteIframeId, rteRef, textRef){
            var that = controllerRef;
            this.textEditor  = rteRef;
            this.textRef = textRef;
            var iframe = document.getElementById(rteIframeId);
            iframe.contentDocument.body.addEventListener("focus", function (e) {
                that.handleSetInterval(e);
            });
            iframe.contentDocument.body.addEventListener("blur", function () {
                that.handleClearInterval();
            });
            iframe.contentDocument.body.addEventListener("keydown", function (e) {
                that.handleRTEMaxLngth(e);
            });
        },

        /**
		 * Handles the maximum length of the rich text editor.
		 *
		 * @param {Event} e 
		 */
        handleRTEMaxLngth: function (e) {
            var oStrLngth;
            oStrLngth = (new DOMParser().parseFromString((this.textEditor)._oEditor.getContent(), "text/html").documentElement.textContent)
                .length;
            if (oStrLngth >= 5000) {
                e.preventDefault();
            }
        },

        /**
		 * Handles the setInterval function.
		 *
		 * @param {Event} e 
		 */
        handleSetInterval: function () {
            var that = this;
            this.oIntervalHndl = setInterval(function () {
                if ((that.textEditor)._oEditor) {
                    var sValue = new DOMParser().parseFromString((that.textEditor)._oEditor.getContent(), "text/html").documentElement.textContent;
                    var iLength = sValue.length;
                    var sText = "";
                    if (iLength > 5000) {
                        sText = "0/5000";
                    } else {
                        sText = iLength + "/5000";
                    }

                    that.textRef.setText(sText);
                }
            }, 500);
        },

        /**
		 * Clears the interval handle if it exists.
		 */
        handleClearInterval: function () {
            if (this.oIntervalHndl) {
                clearInterval(this.oIntervalHndl);
            }
        },

        /**
		 * Shows a message with the specified type, text, detail, and callback function.
		 *
		 * @param {string} sMsgType 
		 * @param {string} sMessageText 
		 * @param {string} sMessageDetail 
		 * @param {function} fnCallback 
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
					 * Handles the close event.
					 * @param {string} sAction 
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
		 * Fetches user roles for a specific application.
		 *
		 * @param {string} appName 
		 * @param {function} fnCallBack 
		 */
        fetchUserRoles: function (appName, fnCallBack) {
            var sUrl = "/asint/rest/v1/api/v2/user/roles";
            $.ajax({
                url: sUrl,
                method: "GET",
                dataType: "json",
                /**
				 * Success function
				 */
                success: function (oRolesRec) {
                    var filteredKeys = Object.keys(oRolesRec).filter(function (key) {
                        return key.startsWith(appName);
                    });
                    var filteredObject = {};
                    filteredKeys.forEach(function (key) {
                        var lastWord = key.split("_").pop().toLowerCase();
                        filteredObject[lastWord] = oRolesRec[key];
                    });
                    if(fnCallBack) {
                        fnCallBack(filteredObject);
                    }
                }, 
                /**
				 * Success function
				 */
                error: function () {
                    this.fnMessageShow("E", "Failed to fetch roles");
                    if(fnCallBack) {
                        fnCallBack("");
                    }
                }
            });
        },

        /**
		 * Sets the navigation URL 
		 *
		 * @param {Window} window 
		 * @param {string} sHashWithKeyword 
		 */
        setNavUrl: function(window, sHashWithKeyword) {
            var siteIdIndex = window.location.search.indexOf("siteId");
            var sSite = "";
            var url = "";
            if(siteIdIndex > -1) {
                var oParams = new URLSearchParams(window.location.search);
                sSite = oParams.get("siteId");
                url = window.location.origin + "/site?siteId=" + sSite + "#" + sHashWithKeyword;
            }else {
                url = window.location.origin + "/#" + sHashWithKeyword;
            }
            return url;
        },

        /**
         * Function to fire token update for multi input manually
         */
        fnFireMultiInputTokenUpdateManually : function(sControlId, aNewSel, aPrevSel, aNewTokens){
            var oMultiInput = this.getView().byId(sControlId);
            if(!aPrevSel){
                aPrevSel = [];
            }
            if(!aNewSel){
                aNewSel = [];
            }
            var aCurSel = aNewSel.filter(function(oVal){
                var isFound = false;
                aPrevSel.forEach(function(oPrev){
                    if(oPrev.key == oVal.key){
                        isFound = true;
                    }
                });
                if(!isFound){
                    return oVal;
                }
            });
            var aTokens = [];
            if(aCurSel && aCurSel.length > 0){
                aCurSel.forEach(function(oCur){
                    aTokens.push(new Token({ key: oCur.key, text: oCur.text }));
                })
            }
            if(aNewTokens && aNewTokens.length > 0){
                aTokens = aNewTokens;
            }
            if(oMultiInput){
                oMultiInput.fireTokenUpdate({
                    type: "sap.m.Tokenizer.TokenUpdateType.Added",
                    addedTokens: aTokens,
                    removedTokens: []
                });
            }
        },
        
        /**
         * Function to make bulk requests in chunks
         * 
         */
        fnProcessBulkGetRequest: function(aObject, fnRequest, fnComplete, iChunkSize) {

            var iCurrent = 0;
            iChunkSize = iChunkSize || 10;

            /**
             * Function to make bulk requests in chunks
             */
            var fnProcess = function () {
                var aChunk = aObject.slice(iCurrent, iCurrent + iChunkSize);
                var iChunkProcessed = 0;

                if (aChunk.length === 0) {
                    fnComplete();
                    return;
                }
                /**
                 * Function to check for batch completion
                 */
                var fnChunkComplete = function () {
                    iChunkProcessed++;
                    if (iChunkProcessed === aChunk.length) {
                        iCurrent += iChunkSize;
                        fnProcess();
                    }
                };

                aChunk.forEach(function (oChunk) {
                    fnRequest(oChunk, fnChunkComplete);
                });

            };

            fnProcess();

        },

        /**
         * Function to format all inputs in the form.
         * 
         * @param {Object} oSimpleForm 
         * @param {Boolean} bClearValueState 
         * @returns Boolean
         */
        fnValidateForm: function (oSimpleForm, bClearValueState) {

            var that = this;
            var bError = false;

            /**
             * Function to validate the control data.
             * 
             * @param {Object} oControl 
             * @param {Object} oFormElement 
             */
            var fnValidator = function (oControl, oFormElement) {
                if (oControl) {
                    if (bClearValueState) {
                        if (oControl.setValueState) {
                            oControl.setValueState("None");
                        }
                    } else {
                        if (oControl.getVisible() && oFormElement.getLabel().getRequired() && (oControl.getEditable ? oControl.getEditable() : true)) {
                            if (that.fnValidateField(oControl, oFormElement.getLabel().getRequired())) {
                                bError = true;
                            }
                        } else if (oControl.setValueState) {
                            oControl.setValueState("None");
                        }
                    }
                }
            }

            if (oSimpleForm) {
                oSimpleForm.getAggregation("form").getFormContainers().forEach(function (oFormContainer) {
                    oFormContainer.getFormElements().forEach(function (oFormElement) {
                        oFormElement.getFields().forEach(function (oField) {
                            var sControlName = oField.getMetadata().getName();

                            if (["sap.m.FlexBox", "sap.m.VBox", "sap.m.HBox"].includes(sControlName)) {
                                if (oField.getItems) {
                                    oField.getItems().find(function (oControl) {
                                        fnValidator(oControl, oFormElement);
                                    });
                                }
                            } else {
                                fnValidator(oField, oFormElement);
                            }
                        })
                    })
                })
            }

            return !bError;
        },

        /**
         * Function to validate the field.
         * 
         * @param {Object} oControl 
         * @param {Boolean} bLabelRequired 
         * @returns Boolean
         */
        fnValidateField: function (oControl, bLabelRequired) {

            var bError = false;
            var sValue = "";
            var sControlName = oControl.getMetadata().getName();
            var aSupportedControl = ["sap.m.ComboBox", "sap.m.Input", "sap.m.TextArea", "sap.m.DatePicker", "sap.m.MultiInput", "sap.m.MultiComboBox"];

            if (aSupportedControl.includes(sControlName)) {
                var bRequired = (oControl.getRequired ? oControl.getRequired() : false) || bLabelRequired;

                if (["sap.m.ComboBox"].includes(sControlName)) {
                    sValue = oControl.getSelectedKey();
                } else if (["sap.m.Input", "sap.m.TextArea"].includes(sControlName)) {
                    sValue = oControl.getValue();
                } else if (["sap.m.DatePicker"].includes(sControlName)) {
                    sValue = oControl.getValue();
                } else if (["sap.m.MultiInput"].includes(sControlName)) {
                    sValue = oControl.getTokens();
                } else if (["sap.m.MultiComboBox"].includes(sControlName)) {

                    if(Array.isArray(oControl.getSelectedKeys())) {
                        sValue = oControl.getSelectedKeys().filter(function(sKey) {
                            return sKey !== null || sKey !== undefined;
                        });
                        
                    } else {
                        sValue = [];
                    }

                }

                if (sValue.length > 0 || !bRequired) {
                    oControl.setValueState("None");
                } else {
                    oControl.setValueState("Error");
                    bError = true;
                }
            }

            return bError;
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
         * Function to handle odata error
         * 
         * @param {Object} oError 
         * @param {String} sErrorMessage 
         * @param {Function} fnCallback 
         */
        fnHandleOdataError: function (oError, sErrorMessage, fnCallback) {
            var sErrorDetail = "";
            try {
                var oErrorJSON = JSON.parse(oError.responseText);
                if (oErrorJSON && oErrorJSON.error && oErrorJSON.error.message) {
                    sErrorDetail = oErrorJSON.error.message;
                }
            } catch (error) {
                sErrorDetail = oError.responseText;
            }
            // var sErrorDetail = "";
            
            // if (oErrorJSON && oErrorJSON.error && oErrorJSON.error.message) {
            //     sErrorDetail = oErrorJSON.error.message;
            // }

            this.fnMessageShow("E", sErrorMessage, sErrorDetail, "", function () {
                if (fnCallback) {
                    fnCallback();
                }
            });
        },



        // List of Functions to work in for the 

        /**
         * Function to open dialog / fragment for advance Filters
         * @param {String} sFragmentId - id for the Fragment
         * @param {String} sFragmentName - name / location of the Fragment
         * @param {String} sFragmentInstanceVarName - variable name 
         * @param {Boolean} bIsDirect - fragment is being triggered directly or via library
         * @param {Object} oListServiceData - required only when bIsDirect is false
         * @param {Object} i18n - required only when bIsDirect is false
         */
        onOpenAnyFragment: function (
            sFragmentId,
            sFragmentName,
            sFragmentInstanceVarName,
            bIsDirect,
            aModelList,
            i18n,
            fragmentInfo = { type: "dialog"},
            oPreFilterInfo = { sTableId: null, aFilters: [] },
            callback = null,
        ) {
            if(!this[sFragmentInstanceVarName]) {
                Fragment.load({
                    id: sFragmentId,
                    name: sFragmentName,
                    controller: this
                }).then(function (oDialog) {
                    if(bIsDirect) {
                        this.getView().addDependent(oDialog);
                    }

                    this[sFragmentInstanceVarName] = oDialog;



                    if(!bIsDirect) {
                        var that = this;

                        aModelList.forEach(function(oModelObj) {
                            that[sFragmentInstanceVarName].setModel(
                                oModelObj.modelData,
                                oModelObj.modelName
                            );
                        })
                        
                        // this[sFragmentInstanceVarName].setModel(extraModelData, extraModelDataName);

                        this[sFragmentInstanceVarName].setModel(i18n, "i18n");
                    }

                    if(fragmentInfo.type === "dialog") {
                        this[sFragmentInstanceVarName].open();
                        
                    } else if(fragmentInfo.type === "popover") {
                        this[sFragmentInstanceVarName].openBy(fragmentInfo.oSource);
                    }

                    if(oPreFilterInfo.sTableId && oPreFilterInfo.aFilters) {
                        var oTable = sap.ui.core.Fragment.byId(sFragmentId, oPreFilterInfo.sTableId);
                        oTable.getBinding("items").filter(oPreFilterInfo.aFilters || [])
                    }

                    if(callback) {
                        callback();
                    }

                }.bind(this))
                
            } else {
                if(fragmentInfo.type === "dialog") {
                    this[sFragmentInstanceVarName].open();
                    
                } else if(fragmentInfo.type === "popover") {
                    this[sFragmentInstanceVarName].openBy(fragmentInfo.oSource);
                }

                if(oPreFilterInfo.sTableId && oPreFilterInfo.aFilters) {
                    var oTable = sap.ui.core.Fragment.byId(sFragmentId, oPreFilterInfo.sTableId);
                    oTable.getBinding("items").filter(oPreFilterInfo.aFilters || [])
                }
            }
        },

        /**
         * Function to search in Tables in fragments
         * @param {String} sQuery 
         * @param {String} sFragmentId 
         * @param {String} sTableId 
         * @param {Array} aFiltersList 
         */
        fnSearchInTableInFragment: function (
            sQuery,
            sFragmentId,
            sTableId,
            aFiltersList,
            aPreFilter,
        ) {
            var aFilterArr = [];
            
            if(sQuery && aFiltersList && Array.isArray(aFiltersList)) {
                aFilterArr = new Filter(aFiltersList, false);
            }

            if(aPreFilter) {
                if(Array.isArray(aFilterArr)) {
                    aFilterArr = aPreFilter;
                } else {
                    aFilterArr = new Filter([aPreFilter, aFilterArr ], true);
                }
            }
            
            
            var oTable = Fragment.byId(sFragmentId, sTableId);
            
            oTable.getBinding("items").filter(aFilterArr);
        },

        /**
         * Function to get and set all the selected rows in Table
         * @param {Object} oEvent 
         * @param {Object} oModel 
         * @param {String} sModelDataProperty 
         * @param {String} sListService 
         */
        onTableSelectionData: function(oEvent, oModel, sModelDataProperty, sListService, sSelectionMode, sFragmentName) {
            var aSelectedItems = oEvent.getSource().getSelectedItems();
            
            var aSelectedData = sSelectionMode === "SingleSelectMaster" ? [] : (oModel.getProperty(sModelDataProperty) || []);

            var oUniqueId = {
                "operatingContext": "operatingContextID",
                "globalOperatingContext":"operatingContextID",
                "class": "ID",
                "failureDataProfile": "ID",
                "sourceAssessment": "name",
            };

            aSelectedItems.forEach(function(oSelectedItem) {
                var oSelectedObject = oSelectedItem.getBindingContext(sListService).getObject();
                
                var isItemPresent = aSelectedData.some(function(oItem) {
                    return oItem[sFragmentName ? oUniqueId[sFragmentName] : "ID"] === oSelectedObject[sFragmentName ? oUniqueId[sFragmentName] : "ID"];
                });                

                if(!isItemPresent) {
                    aSelectedData.push(oSelectedObject);
                }
            });

            oModel.setProperty(sModelDataProperty, aSelectedData);
        },

        /**
         * Function to add token to Value Help Input Filters and
         * returns true or false
         * @param {Object} oInput 
         * @param {Array} aSelectedItems 
         * @param {String} sTokenKey 
         * @param {String} sTokenText 
         * @returns {Boolean}
         */
        fnAddTokenToValueHelpInputFilter: function(
            oInput,
            aSelectedItems,
            sTokenKey,
            sTokenText,
        ) {
            // Collect existing token keys for the input field
            var existingKeys = [];
            oInput.getTokens().forEach(function (token) {
                existingKeys.push(token.getKey());
            });
            

            if(aSelectedItems.length) {
                aSelectedItems.forEach(function (oItem) {
                    if (!existingKeys.includes(oItem[sTokenKey])) {
                        var tokenText = "";
                        if(Array.isArray(sTokenText)) {
                            var sAdditionalText = null;

                            if(sTokenText.length > 1) {
                                sAdditionalText = sTokenText.slice(1).map(function(sText) {
                                    return oItem[sText]
                                }).join("-");
                            }

                            tokenText = oItem[sTokenText[0]] + (sAdditionalText ? "(" + sAdditionalText + ")" : "");
                        } else {
                            tokenText = oItem[sTokenText]
                        }
                        var token = new sap.m.Token({
                            key: oItem[sTokenKey],
                            // text: oItem[sTokenText]
                            text: tokenText,
                        });

                        oInput.addToken(token);
                    }
                });

                return true;
            }

            return false;
        },

        /**
         * Function to download document
         * @param {Object} oDocInfo 
         */
        fnDownloadDocument: function(oDocInfo) {
            var oFile = oDocInfo.to_file;
            var sAttachmentName = oFile.name;
            var sContent = oFile.content;
            var sType = oFile.type;
            var dataUrl = "data:" + sType + ";base64," + sContent;
            var a = document.createElement("a");
            a.href = dataUrl;
            a.target = "_blank";
            a.download = sAttachmentName;
            a.click();
            BusyIndicator.hide();
        },

        /**
         * Function to convert string array into html list
         * 
         * @param {Array} aArray 
         * @returns {String} 
         */
        fnConvertArrayToHtmlList(aArray) {

            var sHtmlList = "";

            if (aArray && Array.isArray(aArray) && aArray.length > 0) {
                sHtmlList = "<ul>";
                for (var i = 0; i < aArray.length; i++) {
                    sHtmlList += "<li>" + aArray[i] + "</li>";
                }
                sHtmlList += "</ul>";
            }

            return sHtmlList;

        },

        /**
         * Function to format any string to camel case.
         * 
         * @param {String} sString
         * 
         * @returns {String} sCamelCase
         */
        fnFormatToCamelCase: function (sString) {

            var sCamelCase = "";

            if (sString) {
                var aString = sString.toString().toLowerCase().split(" ");

                for (var i = 0; i < aString.length; i++) {
                    if (aString[i] && aString[i].length > 0 && i > 0) {
                        aString[i] = aString[i].charAt(0).toUpperCase() + aString[i].substring(1);
                    }
                    sCamelCase += aString[i];
                }
            }

            return sCamelCase;

        },

        /**
         * Function to show metadata popover
         * @param {sap.ui.base.Event} oEvent - The press event from the button
         * @param {Object} oData - Metadata values to display
         * @param {string} oData.createdAt - Created date (raw value, will be formatted)
         * @param {string} oData.createdBy - Created by user
         * @param {string} oData.modifiedAt - Modified date (raw value, will be formatted)
         * @param {string} oData.modifiedBy - Modified by user
         */
        fnShowMetadataPopover: function (oEvent, oData) {
            var oView = this.getView();

            var fnOpen = function () {
                if (this._oMetadataInfoPopover.isOpen()) {
                    this._oMetadataInfoPopover.close();
                    return;
                }

                var oMetadataModel = new JSONModel({
                    createdAt: oData.createdAt || "",
                    createdBy: oData.createdBy || "",
                    modifiedAt: oData.modifiedAt || "",
                    modifiedBy: oData.modifiedBy || ""
                });

                this._oMetadataInfoPopover.setModel(oMetadataModel, "mMetadataInfo");
                this._oMetadataInfoPopover.setPlacement("Left");
                this._oMetadataInfoPopover.openBy(oEvent.getSource());
            }.bind(this);

            if (this._oMetadataInfoPopover) {
                fnOpen();
            } else if (!this._bLoadingMetadataFragment) {
                this._bLoadingMetadataFragment = true;

                Fragment.load({
                    id: oView.getId(),
                    name: "com.asint.ais.library.fragment.MetadataInfoPopover",
                    controller: this
                }).then(function (oPopover) {
                    this._bLoadingMetadataFragment = false;
                    this._oMetadataInfoPopover = oPopover;
                    oView.addDependent(this._oMetadataInfoPopover);
                    fnOpen();
                }.bind(this));
            }
        },

        /**
         * Function to show selected items when data is received in Table
         * @param {Object} oTable 
         * @param {Array} aSelectedItems 
         */
        onDataReceived: function (oTable, aSelectedItems, sListService) {
            var aTableItems = [];
            
            if(oTable) {
                aTableItems = oTable.getItems();
                oTable.removeSelections();
            }

            if(aTableItems.length && aSelectedItems.length) {
                aSelectedItems.forEach(function (oItem) {

                    var oAvailableSelectedItem = aTableItems.find(function(oRow) {
                        var oData = oRow.getBindingContext(sListService).getObject();
                        
                        if(oData) {
                            return oData.operatingContextID === oItem.operatingContextID;
                        }
                        return false;
                    });
                    

                    if(oAvailableSelectedItem) {
                        oTable.setSelectedItem(oAvailableSelectedItem, true, true);
                    }
                })
            }
        },

        /**
         * Function for cross app navigation
         * @param {String} sHashWithKeyword 
         * @param {String} sReplacingKey 
         * @param {String} sID 
         */
        fnForCrossAppNavigation: function(sHashWithKeyword, sReplacingKey, sID) {
            // var sHashWithKeyword = this.NAVIGATION.EQUIPMENT_DETAIL;
            // sHashWithKeyword = sHashWithKeyword.replace("{equipmentId}", oTODetail.ID);
            sHashWithKeyword = sHashWithKeyword.replace(sReplacingKey, sID);

            var newUrl = this.setNavUrl(window, sHashWithKeyword);

            window.open(newUrl, "_blank");
        },

    });

});