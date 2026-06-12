sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
    "com/asint/ais/library/datasource/URL",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "com/asint/ais/library/datasource/asint/DataConduitLite",

], function (Utility, JSONModel, Fragment, MessageBox, Filter, Sorter, FilterOperator, ResourceModel, MessageToast, URL, Spreadsheet, ExportLibrary, DataConduitLite) {
    /* eslint-disable no-warning-comments */

    var Helper =Utility.extend("com.asint.ais.library.dataconduitlite.utils.DCLHelper", {

        _fnEvent: null,

        _i18nModel: null,

        URL: URL,

        dataSource: new DataConduitLite(),

        /**
         * Handles the opening of a dialog or modal window.
         *
         * @param {HTMLElement} _oControl 
         */
        handleOpenDCLDialog: function (_oControl) {
            var oControl = _oControl;
            var that = this;
            this._oControl = _oControl;
            if (!oControl._oDataConduitDialog) {
                Fragment.load({
                    id: "idAsintNavCotainer",
                    name: "com.asint.ais.library.dataconduitlite.fragment.OptionListDialog",
                    controller: oControl
                }).then(function (oValueHelpDialog) {
                    oControl._oDataConduitDialog = oValueHelpDialog;
                    //this.getView().addDependent(this._oDataConduitDialog);
                    var oData = {
                        "data": {
                            "header": {
                                "icon": "sap-icon://home-share",
                                "isFullScreen": true,
                                "option": {
                                    "title": ""
                                },
                                "detail": {
                                    "title": ""
                                }
                            },
                            "tiles": {
                                "home": [
                                    {
                                        "title": "Equipment",
                                        "icon": "sap-icon://machine"
                                    },
                                    {
                                        "title": "Functional Location",
                                        "icon": "sap-icon://functional-location"
                                    },
                                    {
                                        "title": "Instructions",
                                        "icon": "sap-icon://course-book"
                                    },
                                    {
                                        "title": "Inspection",
                                        "icon": "sap-icon://activity-2"
                                    },
                                    {
                                        "title": "CML",
                                        "icon": "sap-icon://measurement-document"
                                    },
                                    {
                                        "title": "RCM",
                                        "icon": "sap-icon://legend"
                                    },
                                    {
                                        "title": "Risk and Criticality",
                                        "icon": "sap-icon://customer-order-entry"
                                    },
                                    {
                                        "title": "Recommendations",
                                        "icon": "sap-icon://workflow-tasks"
                                    },
                                    {
                                        "title": "Characteristics",
                                        "icon": "sap-icon://clinical-task-tracker"
                                    },
                                    {
                                        "title": "Classifications",
                                        "icon": "sap-icon://activity-items"
                                    }
                                ],
                                "option": {
                                    "home": {},
                                    "list": {},
                                    "pageList": {
                                        "characteristics": {
                                            "list": [
                                                {
                                                    "title": "Create Characteristics",
                                                    "icon": "sap-icon://create-form"
                                                },
                                                {
                                                    "title": "Attach Code Lists",
                                                    "icon": "sap-icon://activity-items"
                                                },
                                                {
                                                    "title": "Update",
                                                    "icon": "sap-icon://edit"
                                                },
                                                {
                                                    "title": "Delete",
                                                    "icon": "sap-icon://delete"
                                                }
                                            ],
                                            "create characteristics": [],
                                            // "create characteristics": [
                                            //     {
                                            //         "title": "Download Template",
                                            //         "icon": "sap-icon://download"
                                            //     },
                                            //     {
                                            //         "title": "Upload Template",
                                            //         "icon": "sap-icon://upload"
                                            //     }
                                            // ],
                                            "update": [
                                                {
                                                    "title": "Look up",
                                                    "icon": "sap-icon://sys-find"
                                                },
                                                {
                                                    "title": "Upload Template",
                                                    "icon": "sap-icon://upload"
                                                }
                                            ],
                                            "delete": []
                                        },
                                        "classifications": {
                                            "list": [
                                                {
                                                    "title": "Create Classifications",
                                                    "icon": "sap-icon://create-form"
                                                },
                                                {
                                                    "title": "Update",
                                                    "icon": "sap-icon://edit"
                                                },
                                                {
                                                    "title": "Delete",
                                                    "icon": "sap-icon://delete"
                                                }
                                            ],
                                            "detail": [
                                                {
                                                    "title": "Download Template",
                                                    "icon": "sap-icon://download"
                                                },
                                                {
                                                    "title": "Upload Template",
                                                    "icon": "sap-icon://upload"
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            "detail": {
                                "classification": {
                                    "create": {
                                        "tableData": []
                                    }
                                }
                            }
                        },
                        "metadata": {
                            "activePage": "",
                            "nav": {
                                "visible": false
                            }
                        }
                    };
                    var oDataModel = new JSONModel(oData);
                    oControl._oDataConduitDialog.setModel(oDataModel, "mDCData");
                    oControl._oDataConduitDialog.setModel(that.getI18nModel(), "i18n");
                    oControl._oDataConduitDialog.open();
                }.bind(oControl));
            } else {
                oControl._oDataConduitDialog.open();
            }

        },

        /**
        * Handles the closing of a dialog or modal window.
        * @param {HTMLElement} _oControl 
        */
        handleCloseDCLDialog: function (_oControl) {
            var oControl = _oControl;
            if (oControl._oDataConduitDialog) {
                oControl._oDataConduitDialog.close();
            }
        },

        /**
         * Retrieves the internationalization (i18n) model object.
         *
         * @returns {Object} The i18n model object, containing language-specific translations.
         */
        getI18nModel: function () {
            if (!this._i18nModel) {
                this._i18nModel = new ResourceModel({
                    bundleName: "com.asint.ais.library.messagebundle"
                });
            }
            return this._i18nModel;
        },

        /**
        * Handles navigation to the option list associated with a control.
        * @param {Event} oEvent 
        * @param {HTMLElement} _oControl 
        */
        handleNavToOptionList: function (oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var oNavCon = Fragment.byId("idAsintNavCotainer", "idasintDCNavContainer");
            var oDetailPage = Fragment.byId("idAsintNavCotainer", "idasintDCOption");
            var oData = oModel.getProperty(oEvent.getSource().getBindingContext("mDCData").sPath);
            var aList = oModel.getProperty("/data/tiles/option/pageList/" + oData.title.toLowerCase() + "/list");
            oModel.setProperty("/data/tiles/option/home", aList);
            oModel.setProperty("/data/header/option/title", oData.title)
            if (oData.title === "Characteristics" || oData.title === "Classifications") {
                oModel.setProperty("/metadata/nav/visible", true);
                oNavCon.to(oDetailPage);
            } else {
                MessageToast.show("Under Development");
            }
        },

        /**
        * Handles navigation to the detail page .
        * @param {Event} oEvent 
        * @param {HTMLElement} _oControl 
        */
        handleNavToOptionDetail: function (oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var oNavCon = Fragment.byId("idAsintNavCotainer", "idasintDCNavContainer");
            var oDetailPage = Fragment.byId("idAsintNavCotainer", "idasintDCDetail");
            var oData = oModel.getProperty(oEvent.getSource().getBindingContext("mDCData").sPath);
            var sParentName = oModel.getProperty("/data/header/option/title");
            // var sTitle = oData.title;
            var aList = oModel.getProperty("/data/tiles/option/pageList/" + sParentName.toLowerCase() + "/" + oData.title.toLowerCase());
            var sActivePage = sParentName.replaceAll(" ","_").toLowerCase() + "_" + oData.title.replaceAll(" ","_").toLowerCase();

            oModel.setProperty("/data/tiles/option/list", aList);
            oModel.setProperty("/data/header/detail/title", oData.title);
            oModel.setProperty("/metadata/activePage", sActivePage);

            switch(sActivePage) {
            case "characteristics_create_characteristics": 
                oDetailPage = Fragment.byId("idAsintNavCotainer", "idDCDetailCreateCharacteristics");
                break;
            case "classifications_create": 
                oDetailPage = Fragment.byId("idAsintNavCotainer", "idDCDetailCreateClassifications");
                break;
            }
            
            
            oNavCon.to(oDetailPage);

        },

        /**
         * Handles navigation back to a list page.
         * @param {Event} oEvent 
         * @param {string} sPage 
         * @param {string} sNavType 
         * @param {HTMLElement} _oControl 
         */
        handleBacktoList: function (oEvent, sPage, sNavType) {
            var oNavCon = Fragment.byId("idAsintNavCotainer", "idasintDCNavContainer");
            var oNavConPage0 = Fragment.byId("idAsintNavCotainer", "idasintDCHome");
            var oNavConPage1 = Fragment.byId("idAsintNavCotainer", "idasintDCOption");

            if(sNavType === "pageNav"){
                if (sPage === "page1") {
                    oNavCon.to(oNavConPage0);
                } else if (sPage === "page2") {
                    oNavCon.to(oNavConPage1);
                } else {
                    oNavCon.to(oNavConPage0);
                }
            } else {
                if (sPage === "page0") {
                    oNavCon.to(oNavConPage0);
                } else if (sPage === "page1") {
                    oNavCon.to(oNavConPage1);
                } else {
                    oNavCon.to(oNavConPage0);
                }
            }
        },

        /**
         * Handles the interaction with a detail tile.
         * @param {Event} oEvent 
         * @param {string} sPage 
         * @param {HTMLElement} _oControl 
         */
        handleDetailTile: function (oEvent, sPage, _oControl) {
            var that = this;
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var oData = oModel.getProperty(oEvent.getSource().getBindingContext("mDCData").sPath);
            var sParentName1 = oModel.getProperty("/data/header/option/title");
            var sParentName2 = oModel.getProperty("/data/header/detail/title");

            if (sPage === "page2") {
                if (sParentName1.toLowerCase() === "characteristics") {
                    if (sParentName2.toLowerCase() === "create characteristics") {
                        if (oData.title === "Download Template") {
                            var sUrl = "";
                            if (window.location.href.includes("localhost")) {
                                sUrl = this.URL["characteristics"];
                            } else {
                                var sBaseURI = window.com.asint.ais.flp.plugin.baseURI.replace("comasintaisflpplugin", "");
                                // eslint-disable-next-line no-unused-vars
                                sUrl = sBaseURI + "comasintaismiasset_strategy_development" + this.URL["characteristics"];
                            }
                            // that.getData(sUrl, {}, function(oResult){
                                
                            // }, function(oError){
                            //     that.fnMessageShow("E", "Someting went wrong, Please try again later")
                            // });

                            var aColumnHeaders = that.fnTemplateData().characteristics.create;

                            that.handleExportAsExcel(sParentName1, sParentName2, aColumnHeaders);

                        } else {
                            that.handleLoadFragment(_oControl);
                        }
                    }
                }

            }
        },

        /**
         * Handles exporting data as an Excel file.
         * @param {string} sParentName1 
         * @param {string} sParentName2 .
         * @param {Array} aColumnHeaders 
         */
        handleExportAsExcel: function (sParentName1, sParentName2, aColumnHeaders) {
            var aCols, sFileName, oSettings, oSheet;
            aCols = this.createColumnConfig(aColumnHeaders);
            sFileName = sParentName1 + " - " + sParentName2 + " - " + new Date().toLocaleDateString().replaceAll("/", "_") + " - " + 
                new Date().toLocaleTimeString().split(" ")[0].replace(/:\d{2}$/, "").replace(/:/g, ":");
            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: "Level"
                },
                dataSource: [{}],
                fileName: sFileName,
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };
            oSheet = new Spreadsheet(oSettings);

            oSheet.build().finally(function () {
                oSheet.destroy();
            });

        },

        /**
         * Creates a column configuration object based on an array of column headers.
         * @param {Array} aColumnHeaders 
         * @returns {Object} A column configuration object.
         */
        createColumnConfig: function (aColumnHeaders) {
            var aCols = [], sDataType, EdmType = sap.ui.export.EdmType;
            for (let i = 0; i < aColumnHeaders.length; i++) {
                if (aColumnHeaders[i].dataType === "Integer") {
                    sDataType = EdmType.Number
                } else if (aColumnHeaders[i].dataType === "Boolean") {
                    sDataType = EdmType.Boolean
                } else {
                    sDataType = EdmType.String
                }
                aCols.push({
                    label: aColumnHeaders[i].header,
                    property: "",
                    type: sDataType
                });
            }
            return aCols;
        },

        /**
         * Shows a message to the user.
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
                    /**
                     * Function to close the fragment
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
         * Retrieves template data.
         * @returns {Object} The template data object.
         */
        fnTemplateData: function () {
            var oData = {
                "characteristics": {
                    "create": [
                        {
                            "header": "Status",
                            "dataType": "String"
                        },
                        {
                            "header": "Id",
                            "dataType": "String"
                        },
                        {
                            "header": "UOM",
                            "dataType": "String"
                        },
                        {
                            "header": "Required",
                            "dataType": "Boolean"
                        },
                        {
                            "header": "Indicator",
                            "dataType": "String"
                        },
                        {
                            "header": "Characteristics Group",
                            "dataType": "String"
                        },
                        {
                            "header": "length",
                            "dataType": "Integer"
                        }
                    ]
                }
            }

            return oData;
        },

        /**
         * Handles screen size changes.
         * @param {Event} oEvent 
         * @param {string} sFunctionName 
         * @param {HTMLElement} _oControl 
         */
        handleScreenSize: function (oEvent, sFunctionName, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            if (sFunctionName === "fullScreen") {
                sap.ui.getCore().byId(_oControl._oDataConduitDialog.sId).setContentWidth("50%");
                oModel.setProperty("/data/header/isFullScreen", false);
            } else {
                sap.ui.getCore().byId(_oControl._oDataConduitDialog.sId).setContentWidth("30%");
                oModel.setProperty("/data/header/isFullScreen", true);
            }
        },

        /**
         * Handles table import functionality.
         * @param {HTMLElement} _oControl 
         */
        handleTableImport: function () {
            var that = this;
            if (!that._oDataConduitUploadDialog) {
                Fragment.load({
                    name: "com.asint.ais.library.dataconduitlite.fragment.DocumentUploadDialog",
                    controller: that
                }).then(function (oValueHelpDialog) {
                    that._oDataConduitUploadDialog = oValueHelpDialog;
                    that._oDataConduitUploadDialog.setModel(that.getI18nModel(), "i18n");
                    that._oDataConduitUploadDialog.open();
                }.bind(that));
            } else {
                that._oDataConduitUploadDialog.open();
            }
        },

        /**
         * Validates characteristics table data.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         */
        fnCreateCharacteristicsTableValidate: function (oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var aCharacteristics = oModel.getProperty("/data/tiles/option/pageList/characteristics/create characteristics");
            aCharacteristics.forEach(function(oCharacteristic) {
                if(!oCharacteristic.ID) {
                    oCharacteristic.status = "Ready";
                } else {
                    oCharacteristic.status = "Created";
                }
            });
            oModel.setProperty("/data/tiles/option/pageList/characteristics/create characteristics", aCharacteristics);
        },

        /**
         * Handles table validation.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         * @returns {boolean} 
         */
        handleTableValidation: function (oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var sActivePage = oModel.getProperty("/metadata/activePage");
            switch(sActivePage) {
            case "characteristics_create_characteristics": 
                this.fnCreateCharacteristicsTableValidate(oEvent, _oControl);
                break;
            case "classifications_create": 
                this.fnCreateClassificationsTableValidate(oEvent, _oControl);
                break;
            }
        },

        /**
         * Handles table export functionality.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         */
        handleTableExport: function (oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var sActivePage = oModel.getProperty("/metadata/activePage");
            var oDataStore = {
                "characteristics_create_characteristics": "idDCCreateCharacteristicsTable",
                "classifications_create": "idDCCreateClassificationsTable"                
            };
            var oTable = Fragment.byId("idAsintNavCotainer", oDataStore[sActivePage]);
            this.fnExportTableDatatoExcel(oTable);
        },

        /**
         * Handles adding a new row to a table.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         */
        handleTableAddRow: function (oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var sActivePage = oModel.getProperty("/metadata/activePage");
            var oDataStore = {
                "characteristics_create_characteristics" : {
                    "path": "/data/tiles/option/pageList/characteristics/create characteristics",
                    "template": {
                        "status": "New",
                        "ID": "",
                        "displayId": "",
                        "dataType": "",
                        "required": false,
                        "multiValue": false,
                        "uom": "",
                        "dimension": "",
                        "length": null,
                        "decimals": null,
                        "defaultValue": "",
                        "response": "",
                        "to_description": [
                            {
                                "shortDescription": "",
                                "longDescription": "",
                                "language": "en",
                            }
                        ]
                    }
                }
                //TODO
            };

            if(oDataStore[sActivePage]) {
                var aTableData = oModel.getProperty(oDataStore[sActivePage].path);
                aTableData.push(oDataStore[sActivePage].template);
                oModel.setProperty(oDataStore[sActivePage].path, aTableData);
            }
            
        },

        /**
         * Handles the creation of characteristics.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         */
        fnCharacteristicsCreate: function(oEvent, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var aCharacteristics = oModel.getProperty("/data/tiles/option/pageList/characteristics/create characteristics");
            this.fnCreateCharacteristics(aCharacteristics, function (aCharacteristics) {
                oModel.setProperty("/data/tiles/option/pageList/characteristics/create characteristics", aCharacteristics);
            });
        },

        /**
         * Handles the creation of classifications.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         */
        fnClassificationsCreate: function(oEvent, _oControl) {
            //TODO
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var aCharacteristics = oModel.getProperty("/data/tiles/option/pageList/characteristics/create characteristics");
            this.fnCreateClassifications(aCharacteristics, function (aCharacteristics) {
                oModel.setProperty("/data/tiles/option/pageList/characteristics/create characteristics", aCharacteristics);
            });
        },

        /**
         * Handles button clicks within a table.
         * @param {Event} oEvent 
         * @param {string} sAction 
         * @param {HTMLElement} _oControl 
         */
        handleTableButtonClick: function(oEvent, sAction, _oControl) {
            var oModel = _oControl._oDataConduitDialog.getModel("mDCData");
            var sActivePage = oModel.getProperty("/metadata/activePage");
            switch(sActivePage) {
            case "characteristics_create_characteristics": 
                if(sAction === "create") {
                    this.fnCharacteristicsCreate(oEvent, _oControl);
                }
                break;
            case "classifications_create": 
                if(sAction === "create") {
                    this.fnClassificationsCreate(oEvent, _oControl);
                }
                break;
            }
        },

        /**
         * Performs a data source operation.
         * @param {Array} aTableData 
         * @param {string} sDataSourceFunction 
         * @param {function} fnGeneratePayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {function} fnCallback 
         */
        fnPerformDatasourceOperation: function (aTableData, sDataSourceFunction, fnGeneratePayload, fnSuccess, fnError, fnCallback) {
            var that = this;
            var iProcessed = 0;
            var iTotal = aTableData.length;
            /**
             * Complete operation
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    if (fnCallback) {
                        fnCallback(aTableData);
                    }
                }
            };
            /**
             * Processes table data in chunks.
            * @param {Array} aTableData 
            * @param {number} iCurrent 
            * @param {number} iChunkSize 
            */
            var fnProcess = function (aTableData, iCurrent, iChunkSize) {
                var aChunk = aTableData.slice(iCurrent, iCurrent + iChunkSize);
                var iChunkProcessed = 0;
                /**
                 * Complete process in chunk
                 */
                var fnChunkComplete = function () {
                    fnComplete();
                    iChunkProcessed++;
                    if (iChunkProcessed === iChunkSize) {
                        iCurrent = iCurrent + iChunkSize;
                        fnProcess(aTableData, iCurrent, iChunkSize);
                    }
                };

                aChunk.forEach(function (oChunk) {
                    if (oChunk.status === "Ready") {
                        var oPayload = fnGeneratePayload(oChunk);
                        that.dataSource[sDataSourceFunction](oPayload, function (oResponse) {
                            fnSuccess(oChunk, oResponse);
                            fnChunkComplete();
                        }, function (oError) {
                            fnError(oChunk, oError);
                            fnChunkComplete();
                        });
                    } else {
                        fnChunkComplete();
                    }
                });

            };
            fnProcess(aTableData, 0, 5);
        },

        /**
         * Creates classifications based on characteristics data.
         * @param {Array} aCharacteristics
         * @param {function} fnCallBack 
         */
        fnCreateClassifications: function (aCharacteristics, fnCallBack) {
            //TODO
            var sDataSourceFunction = "createCharacteristic";
            /**
             * Function to generate payload
             * @param {object} oChunk 
             * @returns {object}
             */
            var fnGeneratePayload = function(oChunk) {
                return {
                    "displayId": oChunk.displayId,
                    "dataType": oChunk.dataType,
                    "required": oChunk.required,
                    "multiValue": oChunk.multiValue,
                    "uom": oChunk.uom,
                    "dimension": oChunk.dimension,
                    "length": oChunk.length && oChunk.length.toString().length > 0 ? Number(oChunk.length) : 100,
                    "decimals": oChunk.decimals && oChunk.decimals.toString().length > 0 ? Number(oChunk.decimals) : 0,
                    "defaultValue": oChunk.defaultValue
                };
            };
            /**
             * Success function
             */
            var fnSuccess = function(oChunk, oResponse) {
                oChunk.status = "Created";
                oChunk.ID = oResponse.ID;
                oChunk.response = ""
            }; 
            /**
             * Error function
             */
            var fnError = function(oChunk, oError) {
                oChunk.status = "Failed";
                oChunk.response = oError.responseText;
            };

            this.fnPerformDatasourceOperation(aCharacteristics, sDataSourceFunction, fnGeneratePayload, fnSuccess, fnError, fnCallBack);
        },

        /**
         * Creates characteristics based on the provided data.
         * @param {Array} aCharacteristics 
         * @param {function} fnCallBack 
         */
        fnCreateCharacteristics: function (aCharacteristics, fnCallBack) {
            var sDataSourceFunction = "createCharacteristic";
            /**
             * Function to generate payload
             * @param {object} oChunk 
             * @returns {object}
             */
            var fnGeneratePayload = function(oChunk) {
                return {
                    "displayId": oChunk.displayId,
                    "dataType": oChunk.dataType,
                    "required": oChunk.required,
                    "multiValue": oChunk.multiValue,
                    "uom": oChunk.uom,
                    "dimension": oChunk.dimension,
                    "length": oChunk.length && oChunk.length.toString().length > 0 ? Number(oChunk.length) : 100,
                    "decimals": oChunk.decimals && oChunk.decimals.toString().length > 0 ? Number(oChunk.decimals) : 0,
                    "defaultValue": oChunk.defaultValue,
                    "to_description": [
                        {
                            "shortDescription": oChunk.shortDescription,
                            "longDescription": oChunk.longDescription,
                            "language": oChunk.language,
                        }
                    ],
                    "deleted": false
                };
            };
            /**
             * Success function
             */
            var fnSuccess = function(oChunk, oResponse) {
                oChunk.status = "Created";
                oChunk.displayId = oResponse.displayId;
                oChunk.response = ""
            }; 
            /**
             * Error function
             */
            var fnError = function(oChunk, oError) {
                oChunk.status = "Failed";
                oChunk.response = oError.responseText;
            };
            this.fnPerformDatasourceOperation(aCharacteristics, sDataSourceFunction, fnGeneratePayload, fnSuccess, fnError, fnCallBack);
        },

        /**
         * Handles file upload cancellation.
         * @param {HTMLElement} _oControl 
         * @returns {void}
         */
        fnFileUploadCancel: function () {
            this._oDataConduitUploadDialog.close();
        },

        /**
         * Creates a characteristics table based on imported data.
         * @param {Array} aData -
         */
        fnCreateCharacteristicsTableImport: function(aData) {
            var oModel = this._oControl._oDataConduitDialog.getModel("mDCData");
            var aCharacteristics = [];
            for (let i = 1; i < aData.length; i++) {
                aCharacteristics.push({
                    "status": "New",
                    "ID": "",
                    "displayId": "",
                    "dataType": aData[i][4],
                    "required": aData[i][5] === "Yes" ? true : false,
                    "multiValue": aData[i][6] === "Yes" ? true : false,
                    "uom": aData[i][7],
                    "dimension": aData[i][8],
                    "length": aData[i][9],
                    "decimals": aData[i][10],
                    "defaultValue": aData[i][11],
                    "response": "",
                    "shortDescription": aData[i][2],
                    "longDescription": aData[i][3],
                    "language": "en-us",
                });
            }
            oModel.setProperty("/data/tiles/option/pageList/characteristics/create characteristics", aCharacteristics);

        },

        /**
         * Creates a classifications table based on characteristics data.
         * @param {Array} aCharacteristics 
         */
        fnCreateClassificationsTableImport: function(aCharacteristics) {
            //TODO
            var oModel = this._oControl._oDataConduitDialog.getModel("mDCData");
            for (let i = 1; i < aData.length; i++) {
                aCharacteristics.push({
                    "status": aData[i][0],
                    "ID": "",
                    "displayId": aData[i][2],
                    "dataType": aData[i][3],
                    "required": aData[1][4] === "Yes" ? true : false,
                    "multiValue": aData[1][4] === "Yes" ? true : false,
                    "uom": aData[i][6],
                    "dimension": aData[i][7],
                    "length": aData[i][8],
                    "decimals": aData[i][9],
                    "defaultValue": aData[i][10],
                    "response": ""
                });
            }
            oModel.setProperty("/data/tiles/option/pageList/characteristics/create characteristics", aCharacteristics);
        },

        /**
         * Confirms table import data.
         * @param {Array} aData 
         * @returns {boolean} 
         */
        fnConfirmTableImport: function(aData) {
            var oModel = this._oControl._oDataConduitDialog.getModel("mDCData");
            var sActivePage = oModel.getProperty("/metadata/activePage");
            switch(sActivePage) {
            case "characteristics_create_characteristics": 
                this.fnCreateCharacteristicsTableImport(aData);
                break;
            case "classifications_create": 
                this.fnCreateClassificationsTableImport(aData);
                break;
            }
        },

        /**
         * Confirms file upload.
         * @returns {boolean} 
         */
        fnFileUploadConfrim: function () {
            var that = this;
            this.oFileUploader = sap.ui.getCore().byId("idDocumentUpload");
            var oFile = this.oFileUploader.oFileUpload.files[0];          
            // Create a File Reader object
            var oReader = new FileReader();
            oReader.onload = function (e) {
                that.busyDialog = new sap.m.BusyDialog();
                that.busyDialog.open();                
                var sXLSX = e.target.result;
                var workbook = XLSX.read(sXLSX, { type: "binary" });
                var sheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[sheetName];
                var data = XLSX.utils.sheet_to_row_object_array(worksheet, { header: 1 });
                //console.log(data);
                that.busyDialog.close();
                that.oFileUploader.clear();
                that._oDataConduitUploadDialog.close();
                that.fnConfirmTableImport(data);
            };
            oReader.readAsBinaryString(oFile);
        },

        /**
         * Handles table row deletion.
         * @param {Event} oEvent 
         * @param {HTMLElement} _oControl 
         */
        handleTableDelete: function () {
            var oModel = this._oControl._oDataConduitDialog.getModel("mDCData");
            var sActivePage = oModel.getProperty("/metadata/activePage");
            var oDataStore = {
                "characteristics_create_characteristics": "idDCCreateCharacteristicsTable",
                "classifications_create": "idDCCreateClassificationsTable"                
            };
            var oTable = Fragment.byId("idAsintNavCotainer", oDataStore[sActivePage]);
            var sPath = oTable.getBinding().sPath;
            var aRows = oModel.getProperty(sPath);
            var aSelectedRows = oTable.getSelectedIndices().reverse();
            var iTableLength = oTable.getBinding().getLength();
            if(iTableLength > 0) {
                // Create a confirmation dialog
                var oDialog = new sap.m.Dialog({
                    title: "Confirmation",
                    type: sap.m.DialogType.Message,
                    content: new sap.m.Text({
                        text: "Are you sure you want to proceed?"
                    }),
                    beginButton: new sap.m.Button({
                        text: "Yes",
                        /**
                         * Execute confirm function
                         */
                        press: function () {
                            // Handle the "Yes" button press                        
                            if(aSelectedRows.length > 0) {
                                for (let i = 0; i < aSelectedRows.length; i++) {
                                    aRows.splice(aSelectedRows[i],1);
                                }
                            } else {
                                aRows = [];
                            }              
                            oModel.setProperty(sPath, aRows);
                            oDialog.close();
                        }
                    }),                   
                    endButton: new sap.m.Button({
                        text: "No",
                        /**
                         * Handle the "No" button press
                         */
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    /**
                     *  Clean up the dialog after it's closed
                     */
                    afterClose: function () {
                        oDialog.destroy(); 
                    }
                });

                // Attach the dialog to the view or control
                oDialog.open();
            }

        },


    });

    return new Helper();

});