/* eslint-disable no-redeclare */
/* eslint-disable no-fallthrough */
sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/m/MultiComboBox",
    "sap/m/DatePicker",
    "sap/m/Switch",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/m/DateTimePicker",
    "sap/ui/core/ListItem",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/FlexBox",
    "sap/m/StandardListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/FlexItemData"
], function (Utility,
    Input,
    ComboBox,
    MultiComboBox,
    DatePicker,
    Switch,
    Text,
    TextArea,
    DateTimePicker,
    ListItem,
    SimpleForm,
    FlexBox,
    StandardListItem,
    Filter,
    FilterOperator,
    FlexItemData) {
    "use strict";

    return Utility.extend("com.asint.ais.library.utils.SimpleFormBuilder", {

        _oConfigTemplate: {
            "modelName": "",
            "basePath": "",
            "title": "",
            "formSettings": {},
            "fields": []
        },

        _oConfig: {
            "modelName": "",
            "basePath": "",
            "title": "",
            "formSettings": {},
            "fields": []
        },

        /**
         * Set controller and config
         * @param {object} oController 
         * @param {object} oConfig 
         */
        constructor: function (oController, oConfig) {

            this._oConfig = oConfig;
            this._oController = oController;

            var oReturn = {};

            if (this._fnValidateParam(oConfig)) {
                oReturn = this._fnBuilder(oConfig);
            }

            return oReturn;

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
         * Fucntion to build form with provided configuration
         * @param {Object} oConfig 
         * @returns 
         */
        _fnBuilder: function (oConfig) {

            var oFormSettings = oConfig.formSettings;
            var oSimpleForm = this._fnCreateForm(oFormSettings.showTitle ? oConfig.title : "", oFormSettings);
            var iFieldPerColumn = Math.ceil(oConfig.fields.length / 3);
            var iFieldIndex = 0;
            var bUseGroup = oFormSettings.useGroup ? oFormSettings.useGroup : false;
            var sGroupLabel = "";

            if (bUseGroup) {
                var aGroup = [];
                
                for(var i = 0; i < oConfig.fields.length; i++) {
                    if(oConfig.fields.group) {
                        if(!aGroup.includes(oConfig.fields.group.toUpperCase())) {
                            aGroup.push(oConfig.fields.group.toUpperCase());
                        }
                    }
                }
                oConfig.fields.sort(function(a, b) {
                    var iIndexA = aGroup.indexOf(a.group.toUpperCase());
                    var iIndexB = aGroup.indexOf(b.group.toUpperCase());
                    return iIndexA - iIndexB;
                });
            }

            // eslint-disable-next-line no-redeclare
            for (var i = 0; i < oConfig.fields.length; i++) {
                if (bUseGroup) {
                    if (sGroupLabel !== oConfig.fields[i].group) {
                        oSimpleForm.addContent(new sap.ui.core.Title({
                            text: oConfig.fields[i].group,
                            tooltip : oConfig.fields[i].group
                        }));
                        sGroupLabel = oConfig.fields[i].group;
                    }
                } else {
                    if (iFieldIndex === 0) {
                        oSimpleForm.addContent(new sap.ui.core.Title({
                            text: ""
                        }));
                    }
                    iFieldIndex++;
                    if (iFieldIndex === iFieldPerColumn) {
                        iFieldIndex = 0;
                    }
                }

                // if (oConfig.fields[i].label) {
                var oLabel = this._fnCreateLabel(oConfig.fields[i].label, oConfig.fields[i].mandatory);
                oSimpleForm.addContent(oLabel);
                // }
                var oField = this._fnCreateField(
                    oConfig.fields[i].type,
                    oConfig.fields[i].path,
                    oConfig.fields[i].mandatory,
                    oConfig.fields[i].editable,
                    oConfig.fields[i].multiInput,
                    oConfig.fields[i].uom,
                    oConfig.fields[i].valueHelp,
                    oConfig.fields[i].length,
                    oConfig.fields[i].decimals,
                    oConfig.fields[i].metadata,
                    oConfig.fields[i].growing
                );
                oSimpleForm.addContent(oField);
            }
            return oSimpleForm;

        },

        /**
         * Create Form
         * @param {string} sFormTitle 
         * @param {object} oFormSettings 
         */
        _fnCreateForm: function (sFormTitle, oFormSettings) {

            var oSettings = {
                title: sFormTitle,
                editable: true,
                layout: "ResponsiveGridLayout",
                labelSpanXL: 4,
                labelSpanL: 4,
                labelSpanM: 4,
                labelSpanS: 12,
                adjustLabelSpan: false,
                emptySpanXL: 0,
                emptySpanL: 0,
                emptySpanM: 0,
                emptySpanS: 0,
                columnsXL: 3,
                columnsL: 3,
                columnsM: 3,
                singleContainerFullSize: false
            };

            var aProp = Object.keys(oSettings);

            for (var i = 0; i < aProp.length; i++) {
                if (oFormSettings[aProp[i]]) {
                    oSettings[aProp[i]] = oFormSettings[aProp[i]];
                }
            }

            return new SimpleForm(oSettings);

        },

        /**
         * Function to create label
         * @param {string} sLabel 
         * @param {boolean} bMandatory 
         */
        _fnCreateLabel: function (sLabel, bMandatory) {
            return new sap.m.Label({
                required: bMandatory,
                text: sLabel
            });
        },

        /**
         * Function to create field
         * @param {string} sType 
         * @param {string} sPath 
         * @param {boolean} bMandatory 
         * @param {object} oEditable 
         * @param {boolean} bMultiInput 
         * @param {string} sUoM 
         * @param {object} oValueHelpConfig 
         * @param {integer} iLength 
         * @param {integer} iDecimal 
         * @param {object} oMetadata 
         * @param {boolean} bGrowing
         */
        _fnCreateField: function (sType, sPath, bMandatory, oEditable, bMultiInput, sUoM, oValueHelpConfig, iLength, iDecimal, oMetadata, bGrowing) {

            var that = this;
            var oContainer, oField, bLiveChangeAttached = false;

            switch (sType) {

            case "ComboBox":
                var oListItemConfig = {
                    key: "{" + this._oConfig.modelName + ">" + oValueHelpConfig.key + "}",
                    text: "{" + this._oConfig.modelName + ">" + oValueHelpConfig.text + "}"
                };
                if (oValueHelpConfig.additionalText) {
                    oListItemConfig["additionalText"] = "{" + this._oConfig.modelName + ">" + oValueHelpConfig.additionalText + "}"
                }
                if (bMultiInput) {
                    oField = new MultiComboBox({
                        required: bMandatory,
                        selectedKeys: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}",
                        editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                        /**
                         * 
                         * @param {*} oEvent 
                         */
                        selectionChange: function (oEvent) {
                            if (that._oController.fnFieldLiveChange) {
                                that._oController.fnFieldLiveChange(oEvent);
                            }
                        },
                        /**
                         * 
                         * @param {*} oEvent 
                         */
                        selectionFinish: function (oEvent) {
                            if (that._oController.fnHandleFieldChangeComplete) {
                                that._oController.fnHandleFieldChangeComplete(oEvent);
                            }
                        }
                    });
                } else {
                    oField = new ComboBox({
                        required: bMandatory,
                        selectedKey: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}",
                        editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                        /**
                         * live change event
                         * @param {object} oEvent 
                         */
                        change: function (oEvent) {
                            if (that._oController.fnFieldLiveChange) {
                                that._oController.fnFieldLiveChange(oEvent);
                            }
                        }
                    });
                }
                if (oValueHelpConfig.enable) {
                    oField.setShowSecondaryValues(true);
                    oField.bindItems({
                        path: this._oConfig.modelName + ">" + oValueHelpConfig.path,
                        sortBy: {
                            path: this._oConfig.modelName + ">" + oValueHelpConfig.sortBy || oValueHelpConfig.text
                        },
                        template: new ListItem(oListItemConfig)
                    });
                }
                break;

            case "TextArea":
                oField = new TextArea({
                    required: bMandatory,
                    rows : 5,
                    growing: !!bGrowing,
                    value: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}",
                    editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                    /**
                     * live change event
                     * @param {object} oEvent 
                     */
                    liveChange: function (oEvent) {
                        if (that._oController.fnFieldLiveChange) {
                            that._oController.fnFieldLiveChange(oEvent);
                            bLiveChangeAttached = true;
                        }
                    },
                    /**
                     * 
                     * @param {*} oEvent 
                     */
                    change: function (oEvent) {
                        if (that._oController.fnHandleFieldChangeComplete) {
                            that._oController.fnHandleFieldChangeComplete(oEvent);
                        }
                    }
                });
                break;

            case "Text":
                if (oValueHelpConfig && oValueHelpConfig.enable) {
                    oField = new Text({
                        text: {
                            parts: [{
                                path: this._oConfig.modelName + ">" + this._oConfig.basePath + sPath
                            }, {
                                value: this._oConfig.modelName
                            }, {
                                value: oValueHelpConfig
                            }],
                            /**
                                 * Function to format
                                 * @param {string} sValue 
                                 * @param {string} sModelName 
                                 * @param {string} oValueHelpConfig
                                 */
                            formatter: function (sValue, sModelName, oValueHelpConfig) {
                                var sReturn = sValue;

                                if (sValue !== null && sValue !== undefined && sValue.toString().length > 0) {
                                    var oModel = that._oController.getView().getModel(sModelName);
                                    var aCodelistItem = oModel.getProperty(oValueHelpConfig.path);

                                    if (Array.isArray(aCodelistItem)) {
                                        var oItem = aCodelistItem.find(function (oItem) {
                                            return oItem[oValueHelpConfig.key].toString() === sValue.toString();
                                        });

                                        if (oItem) {
                                            sReturn = oItem[oValueHelpConfig.text];
                                        }
                                    }
                                }

                                return sReturn;
                            }
                        }
                    });
                } else {
                    oField = new Text({
                        text: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}"
                    });
                }
                break;

            case "Number":
                oField = new Input({
                    required: bMandatory,
                    type: "Number",
                    value: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}",
                    editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                    /**
                     * live change event
                     * @param {object} oEvent 
                     */
                    liveChange: function (oEvent) {
                        if (that._oController.fnFieldLiveChange) {
                            that._oController.fnFieldLiveChange(oEvent);
                            bLiveChangeAttached = true;
                        }
                    },
                    /**
                     * 
                     * @param {*} oEvent 
                     */
                    change: function (oEvent) {
                        if (that._oController.fnHandleFieldChangeComplete) {
                            that._oController.fnHandleFieldChangeComplete(oEvent);
                        }
                    }
                });
                break;

            case "Date":
                oField = new DatePicker({
                    required: bMandatory,
                    value: {
                        type: "sap.ui.model.type.Date",
                        path: this._oConfig.modelName + ">" + this._oConfig.basePath + sPath,
                        formatOptions: {
                            source: {
                                pattern: "yyyy-MM-dd"
                            },
                            pattern: "MMM dd, yyyy"
                        }
                    },
                    editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                    /**
                     * live change event
                     * @param {object} oEvent 
                     */
                    change: function (oEvent) {
                        if (that._oController.fnFieldLiveChange) {
                            that._oController.fnFieldLiveChange(oEvent);
                        }
                    }
                });
                break;

            case "DateTime":
                oField = new DateTimePicker({
                    required: bMandatory,
                    type: "sap.ui.model.type.DateTime",
                    displayFormat: "medium",
                    valueFormat: "yyyy-MM-ddTHH:mm:ssZ",
                    value: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}",
                    editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                    /**
                     * live change event
                     * @param {object} oEvent 
                     */
                    change: function (oEvent) {
                        if (that._oController.fnFieldLiveChange) {
                            that._oController.fnFieldLiveChange(oEvent);
                        }
                    }
                });
                break;

            case "Boolean":
                oField = new Switch({
                    state: "{" + this._oConfig.modelName + ">" + this._oConfig.basePath + sPath + "}",
                    editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                    /**
                     * live change event
                     * @param {object} oEvent 
                     */
                    change: function (oEvent) {
                        if (that._oController.fnFieldLiveChange) {
                            that._oController.fnFieldLiveChange(oEvent);
                        }
                    }
                });
                break;

            case "Input":

            default:
                var oValue = {
                    path: this._oConfig.modelName + ">" + this._oConfig.basePath + sPath,
                };
                if (oValueHelpConfig.enable) {
                    var oListItemConfig = {
                        key: "{" + this._oConfig.modelName + ">" + oValueHelpConfig.key + "}",
                        text: "{" + this._oConfig.modelName + ">" + oValueHelpConfig.text + "}"
                    };
                    if (oValueHelpConfig.additionalText) {
                        oListItemConfig.additionalText = "{" + this._oConfig.modelName + ">" + oValueHelpConfig.additionalText + "}"
                    }
                    oField = new Input({
                        required: bMandatory,
                        showValueHelp: true,
                        showSuggestion: true,
                        autocomplete: false,
                        suggestionItems: {
                            path: this._oConfig.modelName + ">" + oValueHelpConfig.path,
                            sorter: {
                                path: this._oConfig.modelName + ">" + oValueHelpConfig.sortBy || oValueHelpConfig.text
                            },
                            template: new ListItem(oListItemConfig)
                        },
                        value: oValue,
                        editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                        /**
                         * change event
                         * @param {object} oEvent 
                         */
                        change: function (oEvent) {
                            if (that._oController.fnFieldLiveChange) {
                                that._oController.fnFieldLiveChange(oEvent);
                                bLiveChangeAttached = true;
                            }
                            if (that._oController.fnHandleFieldChangeComplete) {
                                that._oController.fnHandleFieldChangeComplete(oEvent);
                            }
                        },
                        /**
                         * change event
                         * @param {object} oEvent 
                         */
                        liveChange: function (oEvent) {
                            if (that._oController.fnCustomFieldLiveChange) {
                                that._oController.fnCustomFieldLiveChange(oEvent);
                                bLiveChangeAttached = true;
                            }
                        }
                    });
                    if(oValueHelpConfig.isShowCustomSrc){
                        oField.setValueHelpIconSrc(oValueHelpConfig.srcPath)
                    }
                    if (oValueHelpConfig.needDedicatedValueHelp) {
                        if(oValueHelpConfig.fnHandleRequest){
                            oField.setShowValueHelp(true);
                            oField.attachValueHelpRequest(function () {
                                oValueHelpConfig.fnHandleRequest(oField, this._oConfig, oValueHelpConfig, bMultiInput)
                            }.bind(this));
                        }else{
                            oField.setShowValueHelp(true);
                            oField.attachValueHelpRequest(function () {
                                this._fnHandleValueHelp(oField, this._oConfig, oValueHelpConfig, bMultiInput)
                            }.bind(this));
                        }
                    }
                } else if (oValueHelpConfig.showSuggestion) {
                    var oListItemConfig = {
                        key: "{" + this._oConfig.modelName + ">" + oValueHelpConfig.key + "}",
                        text: "{" + this._oConfig.modelName + ">" + oValueHelpConfig.text + "}"
                    };
                    if (oValueHelpConfig.additionalText) {
                        oListItemConfig.additionalText = "{" + this._oConfig.modelName + ">" + oValueHelpConfig.additionalText + "}"
                    }
                    oField = new Input({
                        required: bMandatory,
                        showValueHelp: false,
                        showSuggestion: true,
                        autocomplete: false,
                        suggestionItems: {
                            path: this._oConfig.modelName + ">" + oValueHelpConfig.path,
                            sorter: {
                                path: this._oConfig.modelName + ">" + oValueHelpConfig.sortBy || oValueHelpConfig.text
                            },
                            template: new ListItem(oListItemConfig)
                        },
                        // selectedKey: oValue,
                        value: oValue,
                        editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                        /**
                         * Function to get suggestion
                         * @param {object} oEvent 
                         */
                        suggestionItemSelected: function(oEvent) {
                            that._oController.fnGetSuggesttionSelect(oEvent);
                        },
                        /**
                         * change event
                         * @param {object} oEvent 
                         */
                        change: function (oEvent) {
                            if (that._oController.fnFieldLiveChange) {
                                that._oController.fnFieldLiveChange(oEvent);
                                bLiveChangeAttached = true;
                            }
                            if (that._oController.fnHandleFieldChangeComplete) {
                                that._oController.fnHandleFieldChangeComplete(oEvent);
                            }
                        }
                    });
                } else {
                    oField = new Input({
                        required: bMandatory,
                        value: oValue,
                        editable: "{" + this._oConfig.modelName + ">" + oEditable.path + "}",
                        /**
                         * live change event
                         * @param {object} oEvent 
                         */
                        liveChange: function (oEvent) {
                            if (that._oController.fnFieldLiveChange) {
                                that._oController.fnFieldLiveChange(oEvent);
                                bLiveChangeAttached = true;
                            }
                        },

                        /**
                         * 
                         * @param {*} oEvent 
                         */
                        change: function (oEvent) {
                            if (that._oController.fnHandleFieldChangeComplete) {
                                that._oController.fnHandleFieldChangeComplete(oEvent);
                            }
                        }
                    });
                }

            }

            if (oMetadata && (["numeric", "numericFlexible", "numeric flexible"].includes(oMetadata.dataType) || oMetadata.dataType === "currency")) {
                if (oField.setType) {
                    oField.setType("Number");
                }
                if (oField.attachLiveChange) {
                    oField.attachLiveChange(function (oEvent) {
                        try {
                            var oControl = oEvent.getSource();
                            var sValue = oControl.getValue();
                            var oPrecScl = that.fnGetPrecisionAndScale(sValue);
                            var sValueStateText = "";
                            var bEndsWithDot = sValue.endsWith(".");
                            var bEndsWithZeroAfterDot = /^-?\d+\.\d*0$/.test(sValue);
                    
                            if (!bEndsWithDot && !bEndsWithZeroAfterDot) {
                                if (oPrecScl.scale > iDecimal) {
                                    sValue = parseFloat(sValue).toFixed(iDecimal).toString();
                                    oControl.setValue(sValue);
                                    oPrecScl = that.fnGetPrecisionAndScale(sValue);
                                }
                            }
                            if (oPrecScl.precision > iLength) {
                                sValueStateText = "Precision value is exceeded";
                            }
                            if (sValueStateText.length > 0) {
                                oControl.setValueState("Error");
                                oControl.setValueStateText(sValueStateText);
                            } else {
                                oControl.setValueState("None");
                                oControl.setValueStateText(sValueStateText);
                            }
                        } catch (oError) { /* empty */ }
                    
                        if (that._oController.fnFieldLiveChange && bLiveChangeAttached !== true) {
                            that._oController.fnFieldLiveChange(oEvent);
                        }
                    });                    
                }
            }

            if (iLength && iLength > 0 && oField.setMaxLength) {
                oField.setMaxLength(iLength);
            }

            if (sUoM && oField.setWidth) {
                var oUoM = new Text({
                    visible: {
                        parts: [{ 
                            path: this._oConfig.modelName + ">" + this._oConfig.basePath + sPath
                        },{
                            value: sType
                        }],
                        /**
                         * Function to format
                         * @param {string} sValue 
                         * @param {string} sType 
                         */
                        formatter: function(sValue, sType) {
                            if(sType === "Text") {
                                if(sValue) {
                                    return sValue.toString().length > 0;
                                } else { 
                                    return false;
                                }
                            } else {
                                return true;
                            }
                        }
                    },
                    text: sUoM,
                    wrapping: true,
                    maxLines: 2,
                    width: "5rem"
                });
                // oUoM.setWidth("30%");
                // oField.setWidth("70%");
                oUoM.addStyleClass("sapUiTinyMarginBegin");

                // Adjusting field to grow in flexbox
                oField.setLayoutData(new FlexItemData({
                    growFactor: 1
                }));

                oContainer = new FlexBox({
                    direction: "Row",
                    // renderType: "Div",
                    renderType: "Bare",
                    items: [
                        oField,
                        oUoM
                    ]
                });
            } else {
                oContainer = oField;
            }

            return oContainer;

        },

        /**
         * Function to handle valueHelps
         * @param {object} oField 
         * @param {object} oConfig 
         * @param {object} oValueHelpConfig 
         * @param {boolean} bMultiInput 
         */
        _fnHandleValueHelp: function (oField, oConfig, oValueHelpConfig, bMultiInput) {


            if (!this.oValueHelpDialog) {
                this.oValueHelpDialog = new sap.m.SelectDialog({
                    title: "Value Help",
                    multiSelect: bMultiInput,
                    /**
                     * Search functionality
                     * @param {object} oEvent 
                     */
                    search: function (oEvent) {
                        var sQuery = oEvent.getParameter("value");
                        var aFilters = [
                            new Filter({
                                path: oValueHelpConfig.key,
                                operator: FilterOperator.Contains,
                                value1: sQuery
                            }),
                            new Filter({
                                path: oValueHelpConfig.text,
                                operator: FilterOperator.Contains,
                                value1: sQuery
                            })
                        ];
                        oEvent.getParameter("itemsBinding").filter(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    },
                    /**
                     * confirm functionality
                     * @param {object} oEvent 
                     */
                    confirm: function (oEvent) {
                        var sValue = oEvent.getParameter("selectedItem").getTitle();
                        oField.setValue(sValue);
                    }
                });
                this._oController.getView().addDependent(this.oValueHelpDialog);
            }
            this.oValueHelpDialog.removeAllAggregation("items");
            this.oValueHelpDialog.bindAggregation("items", {
                path: oConfig.modelName + ">" + oValueHelpConfig.path,
                sorter: {
                    path: oConfig.modelName + ">" + oValueHelpConfig.sortBy || oValueHelpConfig.text
                },
                template: new StandardListItem({
                    title: "{" + oConfig.modelName + ">" + oValueHelpConfig.key + "}",
                    description: "{" + oConfig.modelName + ">" + oValueHelpConfig.text + "}"
                })
            })
            this.oValueHelpDialog.open();

        }

    });

});

