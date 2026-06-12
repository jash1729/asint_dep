sap.ui.define([
    "com/asint/ais/library/controller/Utility"
], function (Utility) {
    "use strict";

    return Utility.extend("com.asint.ais.library.utils.DescriptionTranslator", {

        _oI18n : sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library"),

        _oConfigTemplate: {
            "modelName": "",
            "path": "",
            "control": {
                "link": ""
            }
        },

        _oConfig: {
            "modelName": "",
            "path": "",
            "control": {
                "link": ""
            }
        },

        _oLink: {},

        /**
         * Set controller and config
         * @param {object} oController 
         * @param {object} oConfig 
         */
        constructor: function (oController, oConfig) {

            this._oConfig = oConfig;
            this._oController = oController;
            var bValid = this._fnValidateParam(oConfig);

            if (bValid) {
                this._fnInitialize(oConfig);
            }

            return bValid;

        },

        /**
         * Function to validate param
         * @param {object} oConfig 
         */
        _fnValidateParam: function (oConfig) {
            /**
             * Check parameters
             * @param {object} oParam1 
             * @param {object} oParam2 
             */
            var fnCheck = function (oParam1, oParam2) {              
                if (typeof oParam1 === "object" && !Array.isArray(oParam1)) {
                    var aParam1Key = Object.keys(oParam1);
                    var aParam2Key = Object.keys(oParam2);
                    var aDiff = aParam1Key.filter(function (sKey) {
                        return !aParam2Key.includes(sKey);
                    });

                    if (aDiff.length === 0) {
                        var bCheck = true;

                        for (var i = 0; i < aParam1Key.length; i++) {
                            if (!fnCheck(oParam1[aParam1Key[i]], oParam2[aParam1Key[i]])) {
                                bCheck = false;
                                break;
                            }
                        }
                        return bCheck;

                    } else {
                        return false;
                    }

                } else {
                    return true;
                }

            };

            return fnCheck(this._oConfigTemplate, oConfig);

        },

        /**
         * Function to initilize
         * @param {object} oConfig 
         */
        _fnInitialize: function (oConfig) {

            this._oLink = this._oController.getView().byId(oConfig.control.link);
            // this._oLink.attachPress(this._fnHandleLinkPress.bind(this));
            this._oLink.attachPress(this._fnOpenTranslationDialog.bind(this));

        },

        /**
         * Retrives description
         */
        _fnGetDescription: function () {

            var oModel = this._oController.getView().getModel(this._oConfig.modelName);

            return oModel.getProperty(this._oConfig.path);

        },

        /**
         * set description
         * @param {array} aDescription 
         */
        _fnSetDescription: function (aDescription) {

            var oModel = this._oController.getView().getModel(this._oConfig.modelName);

            return oModel.setProperty(this._oConfig.path, aDescription || []);

        },

        /**
         * Function to handle link
         */
        _fnHandleLinkPress: function () {

            if (!this._pPopover) {
                this._pPopover = this._fnCreatePopover();
            }

            this._pPopover.openBy(this._oLink);

        },

        /**
         * Function to create popover
         */
        _fnCreatePopover: function () {

            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            var oPopover = new sap.m.Popover({
                title: oI18n.getText("descTranslator.popover.title"),
                content: new sap.m.Table({
                    columns: [
                        new sap.m.Column({
                            header: new sap.m.Text({
                                text: oI18n.getText("descTranslator.popover.table.column1.title")
                            })
                        }),
                        new sap.m.Column({
                            header: new sap.m.Text({
                                text: oI18n.getText("descTranslator.popover.table.column2.title")
                            })
                        })
                    ],
                    items: {
                        path: "",
                        template: new sap.m.ColumnListItem({
                            cells: [
                                new sap.m.Text({
                                    text: "text"
                                }),
                                new sap.m.Text({
                                    text: "text"
                                })
                            ]
                        })
                    }
                }),
                footer: new sap.m.Button({
                    text: oI18n.getText("descTranslator.popover.footer.translate.button.text"),
                    press: this._fnOpenTranslationDialog.bind(this)
                })
            });

            return oPopover;

        },

        /**
         * Function to open translation dialog
         */
        _fnOpenTranslationDialog: function () {

            if (!this._dTranslation) {
                this._dTranslation = this._fnCreateTranslationDialog();
                this._oController.getView().addDependent(this._dTranslation);
            }

            var aLanguageCode = [];
            var aDescription = this._fnGetDescription();
            this._aDesctiptionBackup = JSON.stringify(aDescription);

            for (var i = 0; i < aDescription.length; i++) {
                if (aDescription[i].language) {
                    aLanguageCode.push(aDescription[i].language);
                }
            }

            this._multiComboBox.setSelectedKeys(aLanguageCode);
            this._fnApplyFilter(aLanguageCode);
            this._dTranslation.open();

        },

        /**
         * close the dialog
         * @param {string} sAction 
         */
        _fnCloseTranslationDialog: function (sAction) {

            if (this._dTranslation) {
                if (sAction === "CANCEL") {
                    this._fnSetDescription(JSON.parse(this._aDesctiptionBackup));
                } else if (sAction === "OK") {
                    this._oController.getView().getModel(this._oConfig.modelName).checkUpdate(true);
                }
                this._dTranslation.close();
            }

        },

        /**
         * Create translation dialog
         */
        _fnCreateTranslationDialog: function () {

            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._multiComboBox = new sap.m.MultiComboBox({
                selectionChange: this._fnHandleLanguageSelectionChange.bind(this),
                items: {
                    path: "/",
                    template: new sap.ui.core.ListItem({
                        key: "{key}",
                        text: "{text}"
                    })
                }
            });

            this._multiComboBox.setModel(sap.ui.getCore().getModel("mLanguages"));

            var oSimpleForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                labelSpanXL: 3,
                labelSpanL: 3,
                labelSpanM: 3,
                labelSpanS: 12,
                emptySpanXL: 9,
                emptySpanL: 9,
                emptySpanM: 9,
                emptySpanS: 0,
                columnsXL: 1,
                columnsL: 1,
                columnsM: 1,
                singleContainerFullSize: false,
                content: [
                    new sap.m.Label({
                        text: oI18n.getText("descTranslator.dialog.langSelection.text")
                    }),
                    this._multiComboBox
                ]
            });

            var oTranslationTable = this._fnCreateTranslationTable();

            var oDialog = new sap.m.Dialog({
                title: oI18n.getText("descTranslator.dialog.title"),
                content: [
                    oSimpleForm,
                    oTranslationTable
                ],
                contentWidth: "50%",
                contentHeight: "70%",
                beginButton: new sap.m.Button({
                    text: oI18n.getText("library.reusable.ok.button.text"),
                    /**
                     * OnPress event execution startbtn
                     * @param {object} oEvent 
                     */
                    press: function () {
                        that._fnCloseTranslationDialog("OK");
                    }
                }),
                endButton: new sap.m.Button({
                    text: oI18n.getText("library.reusable.cancel.button.text"),
                    /**
                     * OnPress event execution endbtn
                     * @param {object} oEvent 
                     */
                    press: function () {
                        that._fnCloseTranslationDialog("CANCEL");
                    }
                })
            });

            return oDialog;

        },

        /**
         * Handle language selection change
         * @param {object} oEvent 
         */
        _fnHandleLanguageSelectionChange: function (oEvent) {


            if (oEvent.getParameter("selected")) {
                var sItemKey = oEvent.getParameter("changedItem").getKey();
                var aDescription = this._fnGetDescription();
                var oDescFound = aDescription.find(function (oDescription) {
                    return oDescription.language === sItemKey;
                });

                if (!oDescFound) {
                    aDescription.push({
                        "shortDescription": "",
                        "longDescription": "",
                        "language": sItemKey
                    });
                }

                this._fnSetDescription(aDescription);
            }

            this._fnApplyFilter(oEvent.getSource().getSelectedKeys());

        },

        /**
         * Create translation table
         */
        _fnCreateTranslationTable: function () {

            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._oTranslationTable = new sap.m.Table({
                columns: [
                    new sap.m.Column({
                        header: new sap.m.Text({
                            text: oI18n.getText("descTranslator.translationTable.column.languages.title")
                        })
                    }),
                    new sap.m.Column({
                        minScreenWidth: "Desktop",
                        demandPopin: true,
                        header: new sap.m.Text({
                            text: oI18n.getText("descTranslator.translationTable.column.shortDescription.title")
                        })
                    }),
                    new sap.m.Column({
                        minScreenWidth: "Desktop",
                        demandPopin: true,
                        header: new sap.m.Text({
                            text: oI18n.getText("descTranslator.translationTable.column.longDescription.title")
                        })
                    }),
                    new sap.m.Column({
                        hAlign: "Center",
                        width: "5rem",
                        header: new sap.m.Text({
                            text: oI18n.getText("library.reusable.delete.button.text")
                        })
                    })
                ],
                items: {
                    path: this._oConfig.modelName + ">" + this._oConfig.path,
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: {
                                    path: this._oConfig.modelName + ">language",
                                    /**
                                     * Format the text
                                     * @param {string} sLangCode 
                                     */
                                    formatter: function (sLangCode) {
                                        return that._fnGetLanguageDescription(sLangCode);
                                    }
                                }
                            }),
                            new sap.m.TextArea({
                                width: "100%",
                                value: "{" + this._oConfig.modelName + ">shortDescription}"
                            }),
                            new sap.m.TextArea({
                                width: "100%",
                                value: "{" + this._oConfig.modelName + ">longDescription}"
                            }),
                            new sap.m.Button({
                                enabled: "{= ${" + this._oConfig.modelName + ">language} !== '" + this.DFLT_LANG + "' || ${" + this._oConfig.modelName + ">language} !== '" + this.USER_LANG + "' }",
                                icon: "sap-icon://delete",
                                press: this._fnHandleDescriptionDelete.bind(this)
                            })
                        ]
                    })
                }

            });

            return this._oTranslationTable;

        },

        /**
         * Apply filters
         * @param {array} aLanguageCode 
         */
        _fnApplyFilter: function (aLanguageCode) {

            if (this._oTranslationTable) {
                var aFilters = [];

                for (var i = 0; i < aLanguageCode.length; i++) {
                    aFilters.push(new sap.ui.model.Filter("language", sap.ui.model.FilterOperator.EQ, aLanguageCode[i]));
                }

                this._oTranslationTable.getBinding("items").filter(aFilters);
            }

        },

        /**
         * Function to delete description
         * @param {object} oEvent 
         */
        _fnHandleDescriptionDelete: function (oEvent) {

            var that = this;
            var sPath = oEvent.getSource().getParent().getBindingContextPath();
            var iIndex = Number(sPath.substring(sPath.lastIndexOf("/") + 1));
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            if (iIndex >= 0) {

                sap.m.MessageBox.confirm(oI18n.getText("descTranslator.delete.confirmation.message.text"), {
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    /**
                     * Close function
                     * @param {string} sAction 
                     */
                    onClose: function (sAction) {

                        if (sAction === sap.m.MessageBox.Action.YES) {

                            var aDescription = that._fnGetDescription();
                            var oToBeDeleted = aDescription.splice(iIndex, 1)[0];
                            var aSelectedKeys = that._multiComboBox.getSelectedKeys();
                            var iIndexToDelete = aSelectedKeys.indexOf(oToBeDeleted.language);

                            if (iIndexToDelete > -1) {
                                aSelectedKeys.splice(iIndexToDelete, 1);
                                that._multiComboBox.setSelectedKeys(aSelectedKeys);
                            }

                            that._fnSetDescription(aDescription);
                        }

                    }
                });
            }

        },

        /**
         * Retrives language description
         * @param {string} sLangCode 
         */
        _fnGetLanguageDescription: function (sLangCode) {

            return this.LANG_LIST_MAP[sLangCode] ? this.LANG_LIST_MAP[sLangCode].text : sLangCode;

        }

    });

});

