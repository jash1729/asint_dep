/* eslint-disable camelcase */
sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "sap/ui/util/Storage",
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation"
], function (Utility, Storage, CommonDatasource, EquipmentDatasource, FunctionalLocationDatasource) {
    "use strict";

    return Utility.extend("com.asint.ais.library.helper.TechnicalObject", {

        datasource: new CommonDatasource(),
        equ_datasource: new EquipmentDatasource(),
        fl_datasource: new FunctionalLocationDatasource(),
        /**
		 * 
		 * @param {object} oProp 
		 * @param {object} oTechnicalObject 
		 * @param {function} fnCallback 
		 * @param {function} fnError 
		 */
        fnBuildCharacFieldConfig: function (oProp, oTechnicalObject, fnCallback, fnError) {

            // oProp example

            // oProp = {
            // 	modelName: "mEquipmentDetail",
            // 	basePath: "/data/tabs/characteristicValue/data",
            // 	valueHelpBasePath: "/data/detail/to_class/{i}/classes",
            // 	uomListPath: "/metadata/detail/uomList",
            // 	editablePath: "/metadata/detail/isEditable"
            // };

            try {

                var that = this;

                var oClassToCharMap = {};
                var oPanelMetadata = {};
                var aFieldConfig = [];
                var sSelectedUoM = Storage.get("UOMSystem") === "metric" ? "uomMetric" : "uomImperial";
                /**
				 * Function to choose type
				 * @param {object} oCharcMetadata 
				 * @returns 
				 */
                var fnChooseType = function (oCharcMetadata) {
                    var sType = "Input";

                    if (oCharcMetadata.to_codeList) {
                        if (oCharcMetadata.to_codeList.codeList.to_codeListItem.length < 50) {
                            sType = "ComboBox";
                        } else {
                            sType = "Input";
                        }
                    } else {
                        if (oCharcMetadata.dataType === "date") {
                            sType = "Date"
                        }
                        if (oCharcMetadata.dataType === "character" && oCharcMetadata.length > 300) {
                            sType = "TextArea";
                        }
                    }

                    return sType;
                };

                oTechnicalObject.to_description = that.fnSortDescByPrefAndPriority(oTechnicalObject.to_description);

                if (oTechnicalObject.to_class) {
                    oTechnicalObject.to_class.forEach(function (oClass, iClassIndex) {

                        if (oClass.classes) {
                            oClass.classes.to_description = that.fnSortDescByPrefAndPriority(oClass.classes.to_description);

                            var aClassDescription = oClass.classes.to_description || [];
                            var sClassDescription = aClassDescription.length > 0 ? aClassDescription[0].shortDescription : oClass.classes.internalId;
                            var sBasePathValueHelp = oProp.valueHelpBasePath.replace("{i}", iClassIndex);
                            var sUoMListPath = oProp.uomListPath;
                            var sEditablePath = oProp.editablePath;
                            var oConfig = {
                                "modelName": oProp.modelName,
                                "basePath": oProp.basePath,
                                "title": sClassDescription,
                                "formSettings": {
                                    "showTitle": false
                                },
                                "fields": [],
                                "metadata": {
                                    "classId": oClass.classes.id
                                }
                            };
                            /**
							 * Function to get UOM
							 * @param {object} oMetadata 
							 */
                            var fnGetUoM = function (oMetadata) {
                                var sCharcUoM = oMetadata[sSelectedUoM] || oMetadata.uomImperial;
                                var sUoM = "";
                                if (oMetadata.dataType === "currency") {
                                    sUoM = oMetadata.currency;
                                } else if (sCharcUoM) {
                                    sUoM = "{= ${" + oConfig.modelName + ">" + sUoMListPath + "/" + sCharcUoM + "} ? ${" + oConfig.modelName + ">" + sUoMListPath + "/" + sCharcUoM + "/description} : '" + sCharcUoM + "' }";
                                }
                                return sUoM;
                            }

                            if (oClass.classes.to_characteristic) {
                                oClass.classes.to_characteristic.forEach(function (oCharacteristic, iCharacteristicIndex) {

                                    if (oCharacteristic.characteristic) {
                                        oCharacteristic.characteristic.to_description = that.fnSortDescByPrefAndPriority(oCharacteristic.characteristic.to_description);

                                        var oMetadata = oCharacteristic.characteristic;
                                        var aCharcDescription = oMetadata.to_description || [];
                                        var sCharcDescription = aCharcDescription.length > 0 ? aCharcDescription[0].shortDescription : oMetadata.internalId;
                                        var sCharClassKey = oClass.classes.id + "_" + oCharacteristic.characteristic.id;
                                        var oField = {
                                            "label": sCharcDescription,
                                            "group": "",
                                            "type": fnChooseType(oMetadata),
                                            "path": "/" + oClass.classes.id + "_" + oMetadata.id + "/charValue",
                                            "mandatory": oMetadata.required,
                                            "multiInput": oMetadata.multiValue,
                                            "editable": {
                                                "path": sEditablePath
                                            },
                                            "length": oMetadata.length,
                                            "decimals": oMetadata.decimals,
                                            "uom": fnGetUoM(oMetadata),
                                            "valueHelp": {
                                                "enable": false,
                                                "needDedicatedValueHelp": false,
                                                "path": "",
                                                "sortBy": "",
                                                "key": "",
                                                "text": "",
                                                "additionalText": ""
                                            },
                                            "metadata": {
                                                "key": sCharClassKey,
                                                "dataType": oMetadata.dataType,
                                                "currency": oMetadata.currency,
                                                "uom": oMetadata.dataType === "currency" ? oMetadata.currency : oMetadata[sSelectedUoM] || oMetadata.uomImperial,
                                                "uomImperial": oMetadata.uomImperial,
                                                "uomMetric": oMetadata.uomMetric,
                                                "length": oMetadata.length,
                                                "decimals": oMetadata.decimals
                                            }
                                        };

                                        if (oMetadata.to_codeList) {

                                            var iCodeListItemLength = 0;

                                            if (oMetadata.to_codeList.codeList) {
                                                oMetadata.to_codeList.codeList.to_description = that.fnSortDescByPrefAndPriority(oMetadata.to_codeList.codeList.to_description);

                                                if (oMetadata.to_codeList.codeList.to_codeListItem) {

                                                    iCodeListItemLength = oMetadata.to_codeList.codeList.to_codeListItem.length;
                                                    oMetadata.to_codeList.codeList.to_codeListItem.forEach(function (oCodeListItem) {

                                                        if (oCodeListItem.to_description) {
                                                            oCodeListItem.to_description = that.fnSortDescByPrefAndPriority(oCodeListItem.to_description);
                                                        }
                                                    });
                                                }
                                            }

                                            oField.valueHelp = {
                                                "enable": iCodeListItemLength > 0 ? true : false,
                                                "needDedicatedValueHelp": iCodeListItemLength > 50 ? true : false,
                                                "path": sBasePathValueHelp + "/to_characteristic/" + iCharacteristicIndex + "/characteristic/to_codeList/codeList/to_codeListItem",
                                                "sortBy": "code",
                                                "key": "code",
                                                "text": "code",
                                                "additionalText": "to_description/0/shortDescription"
                                            };
                                        }
                                        oClassToCharMap[sCharClassKey] = oField.metadata;
                                        oConfig.fields.push(oField);
                                    }
                                });
                            }

                            if (!oPanelMetadata[oClass.classes.id]) {
                                oPanelMetadata[oClass.classes.id] = {
                                    "isExpanded": true
                                };
                            }
                            aFieldConfig.push(oConfig);
                        }
                    });

                }

                fnCallback(aFieldConfig, oClassToCharMap, oPanelMetadata);

            } catch (oError) {

                fnError(oError.message);

            }

        },

        /**
         * Function to load characteristic value
         * @param {string} sTechnicalObjectId 
		 * @param {string} sTechnicalObjectType
         * @param {object} oClassToCharMap 
         * @param {function} fnCallback 
         */
        fnLoadCharacteristicsValue_: function (sTechnicalObjectId, sTechnicalObjectType, oClassToCharMap, fnCallback) {
            var that = this;
            var oCharValueUoM = {};
            var aClassToCharMapKey = Object.keys(oClassToCharMap);
            /**
			 * Success function
			 * @param {object} oResponse 
			 */
            var fnSuccess = function (oResponse) {
                var oCharacteristicValue = {};
                oResponse.value.forEach(function (oValue) {
                    if (oValue.classes_id && oValue.characteristic_id) {
                        oCharacteristicValue[oValue.classes_id + "_" + oValue.characteristic_id] = oValue;
                        oCharValueUoM[oValue.classes_id + "_" + oValue.characteristic_id] = oValue.uom;
                    }
                });
                aClassToCharMapKey.forEach(function (sClassCharKey) {
                    if (!oCharacteristicValue[sClassCharKey]) {
                        oCharacteristicValue[sClassCharKey] = {
                            "uom": oClassToCharMap[sClassCharKey].uom,
                            "charValue": "",
                            "deleted": false,
                            "classes_id": sClassCharKey.split("_")[0],
                            "characteristic_id": sClassCharKey.split("_")[1]
                        };
                        if (sTechnicalObjectType === "EQU") {
                            oCharacteristicValue[sClassCharKey]["equipment_id"] = sTechnicalObjectId;
                        } else if (sTechnicalObjectType === "FL") {
                            oCharacteristicValue[sClassCharKey]["functionalLocation_id"] = sTechnicalObjectId;
                        }
                        oCharValueUoM[sClassCharKey] = oClassToCharMap[sClassCharKey].uom;
                    }
                });
                that.fnParseUoMConversion(oCharacteristicValue, oClassToCharMap, oCharValueUoM, function (oCharacteristicValue) {
                    that.fnCheckAndFormatData(oCharacteristicValue, oClassToCharMap, function (oCharacteristicValue) {
                        fnCallback(oCharValueUoM, oCharacteristicValue);
                    });
                }, true);
            };
            /**
			 * Error function
			 * @param {object} oError 
			 */
            var fnError = function () { };

            if (sTechnicalObjectType === "EQU") {
                this.equ_datasource.getCharacteristicsValue(sTechnicalObjectId, fnSuccess, fnError);
            } else if (sTechnicalObjectType === "FL") {
                this.fl_datasource.getCharacteristicsValue(sTechnicalObjectId, fnSuccess, fnError);
            }

        },

        /**
		 * Parses and converts a characteristic value based on its unit of measure (UoM) and associated class-to-characteristic map.
		 * @param {Object} oCharacteristicValue 
		 * @param {Object} oClassToCharMap 
		 * @param {Object} oCharValueUoM 
		 * @param {Function} fnSuccess 
		 * @param {boolean} bConvertForUI 
		 */
        fnParseUoMConversion: function (oCharacteristicValue, oClassToCharMap, oCharValueUoM, fnSuccess, bConvertForUI) {
            var aCharcValueKey = Object.keys(oCharacteristicValue);
            var aUoMConversionPayload = [];

            oCharacteristicValue = JSON.parse(JSON.stringify(oCharacteristicValue));

            for (var i = 0; i < aCharcValueKey.length; i++) {
                var sCharcKey = aCharcValueKey[i];
                if (oClassToCharMap[sCharcKey] && oClassToCharMap[sCharcKey].dataType === "numeric") {
                    var sUoMToCompare = bConvertForUI ? oClassToCharMap[sCharcKey].uom : oCharValueUoM[sCharcKey];
                    if (oCharacteristicValue[sCharcKey].uom !== sUoMToCompare && oCharacteristicValue[sCharcKey].charValue) {
                        aUoMConversionPayload.push({
                            "key": sCharcKey,
                            "src": oCharacteristicValue[sCharcKey].uom,
                            "tgt": sUoMToCompare,
                            "srcValue": oCharacteristicValue[sCharcKey].charValue
                        });
                    }
                }
            }

            if (aUoMConversionPayload.length > 0) {
                this.datasource.fnUoMConvert(aUoMConversionPayload, function (aConvValue) {
                    for (var i = 0; i < aConvValue.length; i++) {
                        if (oCharacteristicValue[aConvValue[i].key]) {
                            oCharacteristicValue[aConvValue[i].key].charValue = aConvValue[i].tgtValue.toString();
                            oCharacteristicValue[aConvValue[i].key].uom = aConvValue[i].tgt;
                        }
                    }
                    fnSuccess(oCharacteristicValue);
                }, function () {
                    fnSuccess(oCharacteristicValue);
                });
            } else {
                fnSuccess(oCharacteristicValue);
            }

        },

        /**
		 * Checks and formats the characteristic value.
		 * @param {Object} oCharacteristicValue 
		 * @param {Object} oClassToCharMap 
		 * @param {Function} fnCallback 
		 */
        fnCheckAndFormatData: function (oCharacteristicValue, oClassToCharMap, fnCallback) {
            var that = this;
            var aCharcValueKey = Object.keys(oCharacteristicValue);

            for (var i = 0; i < aCharcValueKey.length; i++) {
                var sCharcKey = aCharcValueKey[i];
                if (oClassToCharMap[sCharcKey] && oClassToCharMap[sCharcKey].dataType === "numeric") {
                    oCharacteristicValue[sCharcKey].charValue = that.fnFormatNumber(oCharacteristicValue[sCharcKey].charValue, oClassToCharMap[sCharcKey].length, oClassToCharMap[sCharcKey].decimals);
                }
            }

            fnCallback(oCharacteristicValue);

        },

    });

});