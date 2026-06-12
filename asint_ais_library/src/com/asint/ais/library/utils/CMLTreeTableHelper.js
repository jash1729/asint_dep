/* eslint-disable no-inner-declarations */
sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "com/asint/ais/library/datasource/asint/CML",
    "com/asint/ais/library/model/formatter",
    "com/asint/ais/library/utils/TableP13nEngineHelper",
    "sap/m/ObjectStatus",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Title",
    "sap/m/SearchField",
    "sap/m/MenuButton",
    "sap/m/Menu",
    "sap/m/MenuItem",
    "sap/m/Button",
    "sap/ui/table/TreeTable",
    "sap/ui/table/Column",
    "sap/m/OverflowToolbar",
    "sap/m/ToolbarSpacer",
    "sap/m/VBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
], function (Utility, CMLDataSource, Formatter, TableP13nEngineHelper, ObjectStatus, ObjectIdentifier, Text, Label, Title, SearchField, MenuButton, Menu, MenuItem, Button, TreeTable, Column, OverflowToolbar, ToolbarSpacer, VBox, Fragment, JSONModel) {

    return Utility.extend("com.asint.ais.library.utils.CMLTreeTableHelper", {

        _fnEvent: null,
        controller: null,
        tableId: null,

        _oI18n: sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library"),

        _oTempCMLData: {
            "aCMLs": [],
            "aCMLTemplate": [],
            "selectedObjectId": "",
            "selectedObjectType": "",
            "componentObject": [],
            "aFinalCMLResult": [],
            "aHeaderData": [],
            "sUom": "",
            "iCount": 0,
            "exportData": [],
            "dialogName": "",
            "parentEquipmentId": "",
            "parentLocationId": "",
            "tempComponentObject": [],
            "templateDataSource": {},
            "oTemplateDataSource": {},
            "rwbSelectedCML": [],
            "rwbCML": []
        },

        /**
         * Construtor function
         * 
         * @param {String} sBaseURI
         */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;
            if (sBaseURI) {
                this.CMLDataSource = new CMLDataSource(sBaseURI);
                this.Formatter = new Formatter(sBaseURI);
            } else {
                this.CMLDataSource = new CMLDataSource();
                this.Formatter = new Formatter();
            }

            if (this._baseURI && this._baseURI.includes(".asintais.")) {
                this._appNamespace = this._baseURI.substring(this._baseURI.indexOf(".asintais.") + 10);
            }

        },

        /**
         * Function will get the Current and Component Object IDs then based on sType(Page / Dialog),
         * it will fetch CMLs with values for CML App / ASD App - Detail page CMLs Table, and 
         * CML App - List page Create CMLs / Create Inspections
         * 
         * @param {Object} oController - Current page Controller
         * @param {String} sObjectID - Selected Object ID
         * @param {String} sObjType - Selected Object Type
         * @param {String} sUom - Unit of Measurement
         * @param {String} sType - Page / Dialog Type to differentiate the Functionality
         * @param {Function} fnSuccess - Callback function that return the _oTempCMLData
         */
        fnGetObjectAndCMLsList: function (oController, sObjectID, sObjType, sUom, sType, sAppName, sModelName, fnSuccess) {

            var that = this;
            that._oTempCMLData = {
                aCMLs: [],
                aCMLTemplate: [],
                selectedObjectId: "",
                selectedObjectType: "",
                componentObject: [],
                aFinalCMLResult: [],
                aHeaderData: [],
                sUom: "",
                iCount: 0,
                exportData: [],
                dialogName: "",
                parentEquipmentId: "",
                parentLocationId: "",
                tempComponentObject: [],
                templateDataSource: {},
                oTemplateDataSource: {},
                rwbSelectedCML: [],
                rwbCML: []
            };
            that.oController = oController;
            that._oTempCMLData.sUom = sUom;
            that.sApp = sAppName;
            that.sModel = sModelName;

            /**
             * Callback function
             * @param {Boolean} bIsCreated 
             */
            var fnCallback = function (bIsCreated, oResponse) {
                if (bIsCreated) {
                    if (sType === "detailPage" || sType === "rwbDetail") {
                        that.fnGetSiblingsData(that, sType, sObjectID, function (oResponseCML) {
                            fnSuccess(oResponseCML);
                        });
                    } else {
                        that.fnFetchCMLsByObjectId(oResponse.componentObject, sType, sObjectID, function (oResponseCML) {
                            fnSuccess(oResponseCML);
                        });
                    }
                }
            };

            this.fnFetchParentChildObject(sObjectID, sObjType, sType, function (oResponse) {
                if (oResponse.componentObject.length > 0) {
                    if (sType === "CMLCreate" || sType === "" ) {
                        that.fnGetSiblingsData(that, sType, sObjectID, function (oResponseCML){
                            fnSuccess(oResponseCML);
                        });
                    } else {
                        var oExistingTable = that.oController.getView().byId(that.oController.getView().sId + "--idAsintCMLOverallReading");
                        
                        if (oExistingTable) {
                            fnCallback(true, oResponse);
                        } else {
                            that.fnRenderCMLTreeTable(oController, sAppName, sModelName, fnCallback);
                        }
                    }
                }
            });
        },

        /**
         * Function to Get Siblings data based on Object ID
         * 
         * @param {Object} that - this Object
         * @param {String} sType - Dialog Name
         * @param {String} sObjectID - Technical object ID
         * @param {Function} fnSuccess - Success callback function
         */
        fnGetSiblingsData: function (that, sType, sObjectID, fnSuccess) {
            if (sType === "detailPage") {
                that.fnFetchCMLsByObjectId(that._oTempCMLData.componentObject, sType, sObjectID, function (oResponseCML) {
                    fnSuccess(oResponseCML);
                });
            }else{
                if (that._oTempCMLData.parentEquipmentId) {
                    that.fnGetObjectSiblings(that._oTempCMLData.parentEquipmentId, "EQUI", function (oResponse) {
                        that.fnFetchCMLsByObjectId(oResponse.componentObject, sType, sObjectID, function (oResponseCML) {
                            fnSuccess(oResponseCML);
                        });
                    });
                } else if (that._oTempCMLData.parentLocationId) {
                    that.fnGetObjectSiblings(that._oTempCMLData.parentLocationId, "FLOC", function (oResponse) {
                        that.fnFetchCMLsByObjectId(oResponse.componentObject, sType, sObjectID, function (oResponseCML) {
                            fnSuccess(oResponseCML);
                        });
                    });
                } else if (that._oTempCMLData["parentEquipmentId"] && that._oTempCMLData["parentLocationId"]) {
                    that.fnGetObjectSiblings(that._oTempCMLData.parentLocationId, "FLOC", function () {
                        that.fnGetObjectSiblings(that._oTempCMLData.parentEquipmentId, "EQUI", function (oResponse) {
                            that.fnFetchCMLsByObjectId(oResponse.componentObject, sType, sObjectID, function (oResponseCML) {
                                fnSuccess(oResponseCML);
                            });
                        });
                    });
                } else {
                    that.fnFetchCMLsByObjectId(that._oTempCMLData.componentObject, sType, sObjectID, function (oResponseCML) {
                        fnSuccess(oResponseCML);
                    });
                    //fnSuccess(that._oTempCMLData);
                }
            }

        },

        /**
         * Fuction will fetch CMLs based on Component Object List
         * 
         * @param {Array} aComponentlist - Current and Component Object List
         * @param {String} sType - Page / Dialog Type to differentiate the Functionality
         * @param {String} sObjectID - Selected Object ID
         * @param {Function} fnSuccess - Callback function that return the _oTempCMLData
         */
        fnFetchCMLsByObjectId: function (aComponentlist, sType, sObjectID, fnSuccess) {

            var that = this;
            var aCMLs = [], aFinalList = [];
            var iResponseCount = 0;
            var uniqueIds = [];
            aComponentlist.forEach(function (oData) {
                if (uniqueIds.length === 0) {
                    uniqueIds.push(oData.id);
                    aFinalList.push(oData);
                } else if (!uniqueIds.includes(oData.id)) {
                    uniqueIds.push(oData.id);
                    aFinalList.push(oData);
                }
            });

            aComponentlist = aFinalList;
            that._oTempCMLData.componentObject = aFinalList;

            /**
             * Function to push the response in Array
             * 
             * @param {Object} oResult - Success response
             */
            var fnSuccessCallBack = function (oResult) {
                iResponseCount++;
                if (oResult && oResult.value && oResult.value.length > 0) {
                    aCMLs.push(oResult.value);
                }

                if (that._oTempCMLData.componentObject.length === iResponseCount) {
                    if (aCMLs.length > 0) {
                        /**
                         * Function to concat two array into single array
                         * 
                         * @param {*} arr 
                         * @returns  Concat Array
                         */
                        function flattenArray(arr) {
                            let result = [];
                            for (let i = 0; i < arr.length; i++) {
                                if (Array.isArray(arr[i])) {
                                    result = result.concat(flattenArray(arr[i]));
                                } else {
                                    result.push(arr[i]);
                                }
                            }
                            return result;
                        }
                        that._oTempCMLData.aCMLs = flattenArray(aCMLs);
                        aCMLs = that._oTempCMLData.aCMLs;
                    }
                }
            };

            /**
             * Function will trow error
             * 
             * @param {Object} oError - Error response
             */
            var fnError = function (oError) {
                sap.m.MessageToast.show(oError.responseText);
                that.oController.fnMessageShow("E", that.oController._oMessageBundle.getText("CML.MESSAGE016"));
                fnSuccess(that._oTempCMLData);
            };

            /**
             * Function to reset the table p13n
             */
            var fnResetTable = function () {
                if(that._p13nLoadedFor !== sObjectID) {
                    that.fnResetP13n();
                    that._p13nLoadedFor = sObjectID;
                }
            }

            /**
             * Function after completed the API and return data
             */
            var fnCallBack = function () {
                if (aCMLs.length > 0) {
                    if (sType === "detailPage" || sType === "asdDetailPage") {
                        // To Render the CMLs table
                        that.onTableConversion("", [], "", function (aCMLFilterData) {
                            if (aCMLFilterData && aCMLFilterData.aCMLs.length > 0) {
                                // that.fnInitTable();
                                fnResetTable();
                                fnSuccess(that._oTempCMLData);
                            } else {
                                fnSuccess(that._oTempCMLData);
                            }
                        });
                    } else if (sType === "rwbDetail") {
                        var sRecommendatioId = that.oController.getView().getModel("mRecoDetail").getProperty("/data/recoId");
                        that.CMLDataSource.getCMLstoRecommendation(sRecommendatioId, function (oCMLResponse) {
                            that._oTempCMLData.rwbSelectedCML = oCMLResponse.to_cmls;
                            that.fnFilterCMLs("get", oCMLResponse, function () {
                                that.onTableConversion("", [], "", function (aCMLFilterData) {
                                    if (aCMLFilterData && aCMLFilterData.aCMLs.length > 0) {
                                        // that.fnInitTable();
                                        fnResetTable();
                                        fnSuccess(that._oTempCMLData);
                                    } else {
                                        fnSuccess(that._oTempCMLData);
                                    }
                                });
                            });
                        }, function (oError) {
                            that.oController.fnMessageShow("E", that.oController._oMessageBundle.getText("CML.MESSAGE016"), oError);
                        });
                    } else {
                        that._oTempCMLData.aCMLs = aCMLs.filter(function (oCML) {
                            return oCML.objectId === sObjectID;
                        });
                        fnSuccess(that._oTempCMLData);
                    }
                }else{
                    fnSuccess(that._oTempCMLData);
                }
            };
            var bEnabled = false
            var oModel = that.oController.getView().getModel(that.sModel);
            if(oModel){
                bEnabled = oModel.getProperty("/metaData/featureFlag/cmlFetchAllWithoutRestricting1000") === "1";
            }
            /**
             * Function to make all the list as Chunk
             * 
             * @param {Array} aChunk - List to perform Chunk
             * @param {Function} fnChunkComplete - Callback function of Chunk Complete
             */
            var fnRequest = function (aChunk, fnChunkComplete) {
                that.CMLDataSource.getCMLsByObjectId(aChunk.id, function (aCMlsList) {
                    fnSuccessCallBack(aCMlsList);
                    fnChunkComplete();
                }, function (oError) {
                    fnError(oError);
                    fnChunkComplete();
                });
            };
            if(bEnabled){
                fnRequest = function (aChunk, fnChunkComplete) {
                    var aAllResults = [];
                    var iTop = 1000;
                    
                    /**
                     * Recursive function to handle pagination with @nextLink
                     * @param {Number} iSkip
                     */
                    var fnFetchWithPagination = function (iSkip) {
                        /**
                         * Common response handler for both initial and paginated calls
                         * @param {Object} oResponse
                         */
                        var fnHandleResponse = function (oResponse) {
                            if (oResponse && oResponse.value && oResponse.value.length > 0) {
                                aAllResults = aAllResults.concat(oResponse.value);
                            }
                            
                            var sNext = oResponse["@odata.nextLink"] || oResponse["@nextLink"];
                            
                            if (sNext) {
                                var iNextSkip = null;
                                var skipTokenMatch = sNext.match(/[\?&](?:\$)?skiptoken=([^&]+)/i);
                                if (skipTokenMatch && skipTokenMatch[1]) {
                                    iNextSkip = parseInt(skipTokenMatch[1], 10);
                                }
                                
                                if (iNextSkip !== null && !isNaN(iNextSkip)) {
                                    fnFetchWithPagination(iNextSkip);
                                } else {
                                    var oCombinedResult = {
                                        value: aAllResults
                                    };
                                    fnSuccessCallBack(oCombinedResult);
                                    fnChunkComplete();
                                }
                            } else {
                                var oCombinedResult = {
                                    value: aAllResults
                                };
                                fnSuccessCallBack(oCombinedResult);
                                fnChunkComplete();
                            }
                        };
                        
                        /**
                         * Common error handler
                         * @param {Object} oError - Error response
                         */
                        var fnHandleError = function (oError) {
                            fnError(oError);
                            fnChunkComplete();
                        };
                        
                        that.CMLDataSource.getCMLsByObjectId(aChunk.id, fnHandleResponse, fnHandleError, iSkip, iTop);
                    };
                    
                    fnFetchWithPagination(null);
                };
            }

            that.fnPerformDatasourceOperation(aComponentlist, fnRequest, fnCallBack);

        },

        /**
         * Function to get Parent and Child Object list based on Current Selected Object
         * 
         * @param {String} sObjectID - Selected Object ID
         * @param {String} sObjType - Selected Object Type
         * @param {String} sType - Page / Dialog Type to differentiate the Functionality
         * @param {Function} fnSuccess - Callback function that return the _oTempCMLData
         */
        fnFetchParentChildObject: function (sObjectID, sObjType, sType, fnSuccess) {

            var that = this;

            that.CMLDataSource.getObjectDetails(sObjType, sObjectID, function (oCMLForSelectedObject) {
                if (oCMLForSelectedObject) {
                    var aData = [];
                    if (oCMLForSelectedObject.parent_functional_location) {
                        aData.push(
                            {
                                "id": oCMLForSelectedObject.parent_functional_location.ID,
                                "name": oCMLForSelectedObject.parent_functional_location.name,
                                "displayId": oCMLForSelectedObject.parent_functional_location.displayId,
                                "srcId": oCMLForSelectedObject.parent_functional_location.srcId,
                                "type": "FLOC",
                                "componentType":"",

                            }
                        );

                        that._oTempCMLData.parentLocationId = oCMLForSelectedObject.parent_functional_location.ID;

                        // if (sType === "CMLCreate") {
                        //     that.fnGetObjectSiblings(oCMLForSelectedObject.parent_functional_location.ID, "FLOC", function (oResponse) {
                        //         fnSuccess(oResponse);
                        //     });
                        // }
                    }
                    if (oCMLForSelectedObject.parent_equipment) {
                        aData.push(
                            {
                                "id": oCMLForSelectedObject.parent_equipment.ID,
                                "name": oCMLForSelectedObject.parent_equipment.name,
                                "displayId": oCMLForSelectedObject.parent_equipment.displayId,
                                "srcId": oCMLForSelectedObject.parent_equipment.srcId,
                                "type": "EQUI",
                                "componentType":oCMLForSelectedObject.parent_equipment.componentType,
                            }
                        );

                        that._oTempCMLData.parentEquipmentId = oCMLForSelectedObject.parent_equipment.ID;

                        // if (sType === "CMLCreate") {
                        //     that.fnGetObjectSiblings(oCMLForSelectedObject.parent_equipment.ID, "EQUI", function (oResponse) {
                        //         fnSuccess(oResponse);
                        //     });
                        // }
                    }

                    aData.push(
                        {
                            "id": oCMLForSelectedObject.ID,
                            "name": oCMLForSelectedObject.name,
                            "displayId": oCMLForSelectedObject.displayId,
                            "srcId": oCMLForSelectedObject.srcId,
                            "type": sObjType,
                            "componentType":oCMLForSelectedObject.componentType?oCMLForSelectedObject.componentType:"",
                            "mainTechnicalObject": true,

                        }
                    );

                    if (oCMLForSelectedObject.child_equipments && oCMLForSelectedObject.child_equipments.length > 0) {
                        oCMLForSelectedObject.child_equipments.forEach(function (oChildEquipment) {
                            aData.push(
                                {
                                    "id": oChildEquipment.ID,
                                    "name": oChildEquipment.name,
                                    "displayId": oChildEquipment.displayId,
                                    "srcId": oChildEquipment.srcId,
                                    "type": "EQUI",
                                    "componentType":oChildEquipment.componentType,
                                }
                            );
                        });
                    }

                    if (oCMLForSelectedObject.child_locations && oCMLForSelectedObject.child_locations.length > 0) {
                        oCMLForSelectedObject.child_locations.forEach(function (oChildlocation) {
                            aData.push(
                                {
                                    "id": oChildlocation.ID,
                                    "name": oChildlocation.name,
                                    "displayId": oChildlocation.displayId,
                                    "srcId": oChildlocation.srcId,
                                    "type": "FLOC",
                                    "componentType":"",

                                }
                            );
                        });
                    }

                    that._oTempCMLData.componentObject = aData;
                    that._oTempCMLData.tempComponentObject = Object.assign([], aData);

                    // if (sType !== "CMLCreate") {
                    //     fnSuccess(that._oTempCMLData);
                    // }

                    var aHeaderData = {};

                    if (sObjType === "FLOC" || sObjType === "Functional Location") {
                        aHeaderData = {
                            "objectName": oCMLForSelectedObject.name,
                            "objectDesc": oCMLForSelectedObject.to_description.length > 0 ? oCMLForSelectedObject.to_description[0].shortDescription : "",
                            "objectType": sObjType,
                            "displayId": oCMLForSelectedObject.displayId,
                            "modifiedAt": oCMLForSelectedObject.modifiedAt
                        }
                    } else if (sObjType === "EQUI") {
                        aHeaderData = {
                            "objectName": oCMLForSelectedObject.name,
                            "objectDesc": oCMLForSelectedObject.to_description.length > 0 ? oCMLForSelectedObject.to_description[0].shortDescription : "",
                            "objectType": sObjType,
                            "displayId": oCMLForSelectedObject.displayId,
                            "modifiedAt": oCMLForSelectedObject.modifiedAt

                        }
                    }
                    that._oTempCMLData.aHeaderData = aHeaderData;
                    var aCMLTemplate = [];
                    oCMLForSelectedObject.to_cml_template_collection.forEach(function (oCMLCollection) {
                        if (oCMLCollection.cmlCollection && oCMLCollection.cmlCollection.to_cml_template && oCMLCollection.cmlCollection.to_cml_template.length > 0) {
                            oCMLCollection.cmlCollection.to_cml_template.forEach(function (oCMLData) {
                                aCMLTemplate.push(oCMLData.cmlLocationTemplate)
                            });
                        }
                    })
                    that._oTempCMLData.aCMLTemplate = aCMLTemplate;
                    that._oTempCMLData.templateDataSource = that.fnFormateDataSource(aCMLTemplate);

                    fnSuccess(that._oTempCMLData);

                }
            }, function (oError) {
                that.oController.fnMessageShow("E", that.oController._oMessageBundle.getText("CML.MESSAGE015"), oError);
            });

        },

        /**
         * Function to get Component Object list based on Current Selected Object
         * 
         * @param {String} sParentObjectId - Selected Object ID
         * @param {String} sParentObjectType - Selected Object Type
         * @param {Function} fnSuccess - Callback function that return the _oTempCMLData
         */
        fnGetObjectSiblings: function (sParentObjectId, sParentObjectType, fnSuccess) {

            var that = this;
            var aData = that._oTempCMLData.tempComponentObject

            that.CMLDataSource.getObjectDetails(sParentObjectType, sParentObjectId, function (oCMLForSelectedObject) {
                /**
                 * Function to check the compoenet object is present or not
                 * 
                 * @param {Array} aArray - List of components
                 * @param {String} sObjectId - Selected Object Type
                 * @returns 
                 */
                function isExist(aArray, sObjectId) {
                    var aTemp = [];
                    aArray.forEach(function (oObj) {
                        if (!aTemp.includes(oObj.ID) || !aTemp.includes(oObj.id)) {
                            aTemp.push(oObj.ID || oObj.id);
                        }
                    });

                    if (aTemp.includes(sObjectId)) {
                        return true;
                    }
                }

                if (oCMLForSelectedObject.child_equipments) {
                    oCMLForSelectedObject.child_equipments.forEach(function (oChildEquipment) {
                        if (oChildEquipment.ID !== sParentObjectId) {
                            if (!isExist(aData, oChildEquipment.ID)) {
                                aData.push({
                                    "id": oChildEquipment.ID,
                                    "name": oChildEquipment.name,
                                    "displayId": oChildEquipment.displayId,
                                    "srcId": oChildEquipment.srcId,
                                    "type": "EQUI",
                                    "componentType":oChildEquipment.componentType
                                });
                            }
                        }
                    });
                }

                if (oCMLForSelectedObject.child_locations) {
                    oCMLForSelectedObject.child_locations.forEach(function (oChildlocation) {
                        if (oChildlocation.ID !== sParentObjectId) {
                            if (!isExist(aData, oChildlocation.ID)) {
                                aData.push({
                                    "id": oChildlocation.ID,
                                    "name": oChildlocation.name,
                                    "displayId": oChildlocation.displayId,
                                    "srcId": oChildlocation.srcId,
                                    "type": "FLOC",
                                    "componentType":""

                                });
                            }
                        }
                    });
                }


                that._oTempCMLData.tempComponentObject = aData;
                that._oTempCMLData.componentObject = aData;

                fnSuccess(that._oTempCMLData);
            });

        },

        /**
         * Function will pass the list payload to the API by chunk split
         * 
         * @param {Array} aData - Array for Payload
         * @param {Function} fnRequest - Callback function for API
         * @param {Function} fnCallback - Callback function
         * @param {Array} aStatusArray - Array
         * @param {Integer} recordsToProcess - Count to process
         */
        fnPerformDatasourceOperation: function (aData, fnRequest, fnCallback, aStatusArray, recordsToProcess) {
            var iProcessed = 0;
            var iTotal = aData.length;
            var chunkSize = recordsToProcess ? recordsToProcess : 5;

            /**
             * Callback function to  call after complete all chunks
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    if (fnCallback) {
                        fnCallback(aData);
                    }
                }
            };

            /**
             * Function to perform the chunk
             * 
             * @param {Array} aData - List of data for Chunk
             * @param {Integer} iCurrent - Current Itetration count
             * @param {Integer} iChunkSize - Chunk Size
             */
            var fnProcess = function (aData, iCurrent, iChunkSize) {
                var aChunk = aData.slice(iCurrent, iCurrent + iChunkSize);
                var iChunkProcessed = 0;
                /**
                 * Function will call after the All chunk completed
                 */
                var fnChunkComplete = function () {
                    fnComplete();
                    iChunkProcessed++;
                    if (iChunkProcessed === iChunkSize) {
                        iCurrent = iCurrent + iChunkSize;
                        fnProcess(aData, iCurrent, iChunkSize);
                    }
                };

                aChunk.forEach(function (aChunkValue, i) {
                    if (aChunkValue) {
                        var aDataIndex = iCurrent + i;
                        fnRequest(aChunkValue, fnChunkComplete, aStatusArray, aDataIndex);
                    } else {
                        fnChunkComplete();
                    }
                });

            };

            fnProcess(aData, 0, chunkSize);

        },
        /**
         * @param {string} val 
         * @returns formatted date for ui
         */
        normalizeDate: function (val) {
            if (!val) return "";
            if (typeof val === "string") {
                // If "2025-10-31T00:00:00.000Z"
                if (val.includes("T")) {
                    var dateValue = val.split("T")[0];
                    if (typeof dateValue === "string" && dateValue.includes("-")) {
                        var [y, m, d] = dateValue.split("-");
                        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        return `${months[m - 1]} ${d}, ${y}`;
                    }
                }
                // If it’s just a plain date string like "2025-10-31"
                if (val.includes("-")) {
                    var parts = val.split("-");
                    var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    // yyyy-mm-dd
                    if (parts[0].length === 4) {
                        var [yy, mm, dd] = parts;
                        return `${month[mm - 1]} ${dd}, ${yy}`;
                    }

                    // mm-dd-yyyy
                    if (parts[2].length === 4) {
                        var [mm1, dd1, yy1] = parts;
                        return `${month[mm1 - 1]} ${dd1}, ${yy1}`;
                    }
                }
                return val;
            }
            // If value is a Date object
            if (val instanceof Date) {
                var day = String(val.getDate()).padStart(2, "0");
                var mon = val.toLocaleString("default", { mon: "short" });
                var year = val.getFullYear();
                return `${mon} ${day}, ${year}`;
            }
            return "";
        },

        /**
         * Function to Format the CMLs data as Tree Table Structure
         * 
         * @param {String} sFilterBy - Color Filter Value
         * @param {Array} aGroupFilter - Group Filter value
         * @param {String} sSearchText - Search text value
         * @param {Function} fnSuccessConversion - Callback function that return formated Data
         */
        onTableConversion: function (sFilterBy, aGroupFilter, sSearchText, fnSuccessConversion,aSelectedComponentType) {

            var that = this;
            var aExportData = [];
            var sUom = that._oTempCMLData.sUom;
            var aComponentlist = that._oTempCMLData.componentObject;
            var aCmlList = [];
            if (that.sApp === "rwb") {
                aCmlList = that._oTempCMLData.rwbCML;
            } else {
                aCmlList = that._oTempCMLData.aCMLs;
            }
            var aCMLTemplate = that._oTempCMLData.aCMLTemplate;
            var oTemplateDataSource = that._oTempCMLData.templateDataSource;

            /**
             * Function to decode Object
             * 
             * @param {Object} oValue 
             * @returns decode Object
             */
            var fnDecode = function (oValue) {
                var parsed = "";

                try {
                    parsed = JSON.parse(oValue);
                    // eslint-disable-next-line no-empty
                } catch (error) {

                }

                if (typeof parsed === "object") {
                    return parsed;
                }

                var oDecoded = "";
                if (typeof oValue === "string") {
                    oDecoded = atob(oValue);
                }

                return fnDecode(oDecoded);
            };
            var aCMLFinalList = {
                "categories": []
            };

            aComponentlist.forEach(function (oComp) {
                var oTemp = {
                    "objectName": oComp.name,
                    "objectType": oComp.type,
                    "objectId": oComp.id,
                    "displayId": oComp.displayId,
                    "srcId": oComp.srcId,
                    "categories": [],
                    "componentType":oComp.componentType
                };
                aCMLFinalList.categories.push(oTemp);
            });

            var oCMLValue = {};
            var aTempFinal = [];
            var aTempCMLData = [];
            aCmlList.forEach(function (oCML) {
                if (oCML.deleted === false) {
                    var oTempValue = [];
                    oCML.to_values.forEach(function (oValues) {
                        if ((!oValues.deleted) && (oTemplateDataSource[oCML.cmlTemplateId]) && (oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename])) {
                            oTempValue[oValues.ID] = {
                                "dataSourcename": oValues.dataSourcename,
                                "dataSourceValue": oValues.dataSourceValue ? fnDecode(atob(oValues.dataSourceValue)) : oValues.dataSourceValue,
                                "cmlID": oValues.cml_ID,
                                "ID": oValues.ID,
                                "dataSourceDescription": oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].description,
                                "dataType": oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].dataType,
                                "active": oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].active,
                                "totalLength": oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].totalLengthOfNum ? oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].totalLengthOfNum : null,
                                "decimalPlaceAllowed": oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].decimalPlacesAllowed ? oTemplateDataSource[oCML.cmlTemplateId][oValues.dataSourcename].decimalPlacesAllowed : null
                            };
                        }
                    });

                    oCMLValue[oCML.ID] = oTempValue;
                }
            });

            this.fnConvertUOMDataSource(sUom, oCMLValue, function (oCMLValue) {
                aCmlList.forEach(function (oCMLD) {
                    if (oCMLD.deleted === false) {
                        var aDataSource = Object.keys(oCMLValue[oCMLD.ID]);
                        if (aDataSource.length > 0) {
                            Object.keys(oCMLValue[oCMLD.ID]).forEach(function (oDSValue) {
                                var oTemp = oCMLValue[oCMLD.ID][oDSValue];
                                oTemp[oTemp.dataSourcename] = oTemp.dataSourceValue ? oTemp.dataSourceValue.value : oTemp.dataSourceValue;
                                if (aTempCMLData[oCMLD.ID]) {
                                    aTempCMLData[oCMLD.ID].push(oTemp);
                                } else {
                                    aTempCMLData[oCMLD.ID] = [];
                                    aTempCMLData[oCMLD.ID].push(oTemp);
                                }

                            });
                        } else {
                            aTempCMLData[oCMLD.ID] = [];
                        }
                    }
                });

                aCmlList.forEach(function (oCML) {
                    if (oCML.deleted === false) {

                        var oCMLTemplate = aCMLTemplate.find(function (oTemplateItem) {
                            return oTemplateItem.id === oCML.cmlTemplateId;
                        });


                        var oObjectData = that._oTempCMLData.componentObject.find(function (oObjectContext) {
                            return oObjectContext.id === oCML.objectId;
                        });

                        // var sTodayDate = new Date();
                        // var sTodayDateFormate = that.Formatter.formatDate(sTodayDate);

                        var oTempData = {
                            cmlName: oCML.name,
                            cmlDescription: oCML.to_description[0] ? oCML.to_description[0].shortDescription : "",
                            cmlPosition: "",
                            rowType: "parentRow",
                            isSelected: false,
                            locationId: oCML.ID,
                            locationTemplateId: oCML.cmlTemplateId,
                            cmlTemplateName: oCMLTemplate ? oCMLTemplate.name : "",
                            objectId: oCML.objectId,
                            exportObjectName: oObjectData.name,
                            exportObjectType: oObjectData.type,
                            categories: [],
                            // eslint-disable-next-line camelcase
                            persona_id: oCML.persona_id,
                            dataSourceId: "",
                            groupName: oCML.groupName,
                            eTag: oCML["@etag"]
                        };

                        var oExportData = Object.assign({}, oTempData);

                        if (aTempCMLData[oCML.ID].length > 0) {
                            var aReading = [];
                            oCML.to_values.forEach(function (oValue) {
                                if(oValue.deleted === false && oCMLValue && oCMLValue[oCML.ID] && oCMLValue[oCML.ID][oValue.ID] && oCMLValue[oCML.ID][oValue.ID].dataSourcename){
                                    var sDataSourceName = oCMLValue[oCML.ID][oValue.ID].dataSourcename;
                                    var sValue = oCMLValue[oCML.ID][oValue.ID][sDataSourceName];
                                    if (sValue) {
                                        if (sDataSourceName === "READINGS") {
                                            Object.keys(sValue).forEach(function (oItem) {
                                                if (oItem === "DATE" || oItem === "RETIREMENT_DATE") {
                                                    sValue[oItem] = that.normalizeDate(sValue[oItem]);
                                                } else {
                                                    if(oCMLValue[oCML.ID][oValue.ID].decimalPlaceAllowed) {
                                                        // console.log(sValue[oItem]);
                                                        sValue[oItem] = isNaN(Number(sValue[oItem])) ? Number(sValue[oItem]).toFixed(oCMLValue[oCML.ID][oValue.ID].decimalPlaceAllowed) : Number(sValue[oItem]) === 0 ? Number("0") : Number(sValue[oItem]).toFixed(oCMLValue[oCML.ID][oValue.ID].decimalPlaceAllowed);
                                                    } else {
                                                        sValue[oItem] = isNaN(Number(sValue[oItem])) ? sValue[oItem] : Number(sValue[oItem]) === 0 ? Number("0") : Number(sValue[oItem]).toFixed(4);
                                                    }
                                                }

                                            });

                                            // Tree Table Color Filter
                                            if (sValue["TMIN"] && sValue["READING"]) {
                                                var iTmin = Number(sValue["TMIN"]);
                                                var iReading = Number(sValue["READING"]);
                                                // Below TMin Filter
                                                if (iReading < iTmin) {
                                                    sValue["activeColColorReading"] = "Danger";
                                                    sValue["activeIconReading"] = "sap-icon://arrow-bottom";
                                                }

                                                // 10% TMin Filter
                                                if ((iReading > 0.9 * iTmin) && (iReading < iTmin)) {
                                                    sValue["activeColColorReading"] = "Information";
                                                    sValue["activeIconReading"] = "sap-icon://arrow-bottom";
                                                }

                                                // Growth Filter
                                                if (sValue["LONG_TERM_CORROSION_RATE"] < 0) {
                                                    sValue["activeColColorLongTerm"] = "Warning";
                                                    sValue["activeIconLongTerm"] = "sap-icon://arrow-top";
                                                }

                                                // Growth Filter
                                                if (sValue["SHORT_TERM_CORROSION_RATE"] < 0) {
                                                    sValue["activeColColorSortTerm"] = "Warning";
                                                    sValue["activeIconSortTerm"] = "sap-icon://arrow-top";
                                                }
                                            }
                                            // console.log(oCMLValue[oCML.ID][oValue.ID].decimalPlaceAllowed);
                                            // console.log(sValue);
                                            aReading.push(sValue);
                                        } else if (oCMLValue[oCML.ID][oValue.ID].dataType === "date") {
                                            oTempData[sDataSourceName] = that.normalizeDate(sValue);
                                        } else {
                                            if (oCMLValue[oCML.ID][oValue.ID].decimalPlaceAllowed) {
                                                var iDecimal = oCMLValue[oCML.ID][oValue.ID].decimalPlaceAllowed;

                                                // if (typeof (sValue) === "string") {
                                                // oTempData[sDataSourceName] = Number(sValue).toFixed(Number(iDecimal));
                                                // } else {
                                                oTempData[sDataSourceName] = isNaN(Number(sValue)) ? sValue : Number(sValue).toFixed(Number(iDecimal));
                                                // }
                                                oTempData["dataType"] = oCMLValue[oCML.ID][oValue.ID].dataType;
                                            } else if(oCMLValue[oCML.ID][oValue.ID].dataType === "boolean"){
                                                oTempData[sDataSourceName] = sValue ? "Yes" : "No";
                                                oTempData["dataType"] = oCMLValue[oCML.ID][oValue.ID].dataType;
                                            } else {
                                                oTempData[sDataSourceName] = isNaN(Number(sValue)) ? sValue : Number(sValue).toFixed(4);
                                                oTempData["dataType"] = oCMLValue[oCML.ID][oValue.ID].dataType;
                                            }                                        
                                        }
                                    }
                                }
                            });

                            // Check the Readings Data and Format it for Tree Table categories structure
                            if (aReading && aReading.length > 0) {
                                aReading.sort(function (a, b) { return new Date(b.DATE) - new Date(a.DATE); });
                                // aReading.sort(function (a, b) {
                                //     return b.DATE.localeCompare(a.DATE);
                                // });

                                if (aReading.length > 1) {
                                    Object.keys(aReading[0]).forEach(function (oItem) {
                                        oTempData[oItem] = aReading[0][oItem];
                                    });
                                    aReading.shift();

                                    var oModel = that.oController.getView().getModel(that.sModel);
                                    var bIsCmlSummaryEnabled = oModel && oModel.getProperty("/metaData/featureFlag/cmlSummaryValidations") === "1";
                                    var aBaselineFields = ["SHORT_TERM_CORROSION_RATE", "LONG_TERM_CORROSION_RATE", "REMAINING_LIFE", "HALF_LIFE"];
                                    var oOldestReading = aReading[aReading.length - 1];

                                    if (bIsCmlSummaryEnabled && oOldestReading) {
                                        aBaselineFields.forEach(function (sField) {
                                            var vRaw = oOldestReading[sField];
                                            var fValue = Number(vRaw);
                                            if (vRaw !== undefined && vRaw !== null && vRaw !== "" && !isNaN(fValue) && fValue === 0) {
                                                oOldestReading[sField] = "-";
                                                oOldestReading["IS_BASELINE_" + sField] = true;
                                            }
                                        });
                                    }

                                    aReading.forEach(function (oReading) {
                                        var aTemp = [];
                                        var oTemp = {};
                                        Object.keys(oReading).forEach(function (oItem) {
                                            oTemp[oItem] = oReading[oItem];
                                        });
                                        aTemp.push(oTemp);
                                        oTempData.categories.push(aTemp[0]);
                                    });

                                } else {
                                    Object.keys(aReading[0]).forEach(function (oItem) {
                                        oTempData[oItem] = aReading[0][oItem];
                                    });
                                }
                            }
                        }

                        // Check the Latest reading for Baseline Filter
                        if (!oTempData.categories.length) {
                            if (!oTempData.activeIconReading) {
                                oTempData.activeColColorReading = "Indication08";
                            }
                            if (!oTempData.activeIconSortTerm) {
                                oTempData.activeColColorSortTerm = "Indication08";
                            }
                            if (!oTempData.activeIconLongTerm) {
                                oTempData.activeColColorLongTerm = "Indication08";
                            }
                        }

                        var oNewExport = Object.assign({}, oExportData, oTempData);

                        /**
                         * 
                         * @param {*} condition 
                         */
                        var addToLists = function (condition) {
                            if (condition) {
                                aTempFinal.push(oTempData);
                                aExportData.push(oNewExport);
                            }
                        };

                        addToLists(sFilterBy === "Danger" && oTempData.activeColColorReading === "Danger");
                        addToLists(sFilterBy === "Information" && oTempData.activeColColorReading === "Information");
                        addToLists(sFilterBy === "Warning" && (oTempData.activeColColorSortTerm === "Warning" || oTempData.activeColColorLongTerm === "Warning"));
                        addToLists(sFilterBy === "Success" && oNewExport.isNew);
                        addToLists(sFilterBy === "Baseline" && (oTempData.activeColColorReading === "Indication08" || oTempData.activeColColorSortTerm === "Indication08" || oTempData.activeColColorLongTerm === "Indication08"));
                        addToLists(sFilterBy === "");
                    }
                });

                if (sSearchText) {
                    aTempFinal = aTempFinal.filter(function (oCML) {
                        if ((oCML.cmlName && ((oCML.cmlName).toLowerCase()).includes(sSearchText)) || 
                            (oCML.cmlDescription && ((oCML.cmlDescription).toLowerCase()).includes(sSearchText)) ||
                            (oCML.groupName && ((oCML.groupName).toLowerCase()).includes(sSearchText)) || 
                            (oCML.cmlTemplateName && ((oCML.cmlTemplateName).toLowerCase()).includes(sSearchText)) ||
                            (oCML.exportObjectName && ((oCML.exportObjectName).toLowerCase()).includes(sSearchText))
                        ) {
                            return oCML;
                        }
                    });
                }

                if (aGroupFilter && aGroupFilter.length > 0) {
                    var aFilteredGroup = Object.assign([], aTempFinal);
                    aTempFinal = [];

                    aFilteredGroup.forEach(function (oCML) {
                        aGroupFilter.forEach(function (oGroup) {
                            if (oCML.groupName === oGroup) {
                                aTempFinal.push(oCML);
                            }
                        });
                    });
                }

                oTemp = that.fnSetCategoryforObject(aCMLFinalList, aTempFinal);

                if (sSearchText) {
                    oTemp.categories = oTemp.categories.filter(function (oTO) {
                        var bTONameMatch = oTO.objectName && oTO.objectName.toLowerCase().includes(sSearchText);
                        var bHasMatchingCMLs = oTO.categories && oTO.categories.length > 0;
                        return bTONameMatch || bHasMatchingCMLs;
                    });
                }

                if(aSelectedComponentType && aSelectedComponentType.length>0){
                    var aFinalTempCml=[]
                    oTemp.categories.forEach(function(oItem){
                        var sComponentType=oItem.componentType;
                        if(aSelectedComponentType.includes(sComponentType)){
                            aFinalTempCml.push(oItem);  
                        }
                    })
                    oTemp.categories=aFinalTempCml;
                    that._oTempCMLData.aFinalCMLResult = oTemp;
                    that._oTempCMLData.iCount = aFinalTempCml.length > 0 ? aFinalTempCml.length : 0;
                }else{
                    that._oTempCMLData.aFinalCMLResult = oTemp;
                    that._oTempCMLData.iCount = aTempFinal.length > 0 ? aTempFinal.length : 0;
                }
                that._oTempCMLData.exportData = aExportData;

                return fnSuccessConversion(that._oTempCMLData);
            });

            // aCmlList.forEach(function (oCML) {
            //     aTempReading = [];
            //     if (oCML.deleted === false) {

            //         var oCMLTemplate = aCMLTemplate.find(function (oTemplateItem) {
            //             return oTemplateItem.id === oCML.cmlTemplateId;
            //         });


            //         var oObjectData = that._oTempCMLData.componentObject.find(function (oObjectContext) {
            //             return oObjectContext.id === oCML.objectId;
            //         });

            //         var sTodayDate = new Date();
            //         var sTodayDateFormate = that.Formatter.formatDate(sTodayDate);
            //         var date = new Date(oCML.createdAt);
            //         var sCMLDateFormate = that.Formatter.formatDate(date);

            //         var oTempData = {
            //             cmlName: oCML.name,
            //             cmlDescription: oCML.to_description[0] ? oCML.to_description[0].shortDescription : "",
            //             cmlPosition: "",
            //             rowType: "parentRow",
            //             isSelected: false,
            //             date: sTodayDateFormate,
            //             dateTimeValue: sTodayDate.getTime(),
            //             reading: null,
            //             tmin: null,
            //             shortTermCorrisionRate: null,
            //             longTermCorrisionRate: null,
            //             halfLife: null,
            //             retirementDate: null,
            //             retirementDateTimeValue: null,
            //             locationId: oCML.ID,
            //             locationTemplateId: oCML.cmlTemplateId,
            //             cmlTemplateName: oCMLTemplate ? oCMLTemplate.name : "",
            //             objectId: oCML.objectId,
            //             exportObjectName: oObjectData.name,
            //             exportObjectType: oObjectData.type,
            //             categories: [],
            //             activeColColorReading: "None",
            //             activeIconReading: "",
            //             activeColColorSortTerm: "None",
            //             activeIconSortTerm: "",
            //             activeColColorLongTerm: "None",
            //             activeIconLongTerm: "",
            //             // eslint-disable-next-line camelcase
            //             persona_id: oCML.persona_id,
            //             dataSourceId: "",
            //             groupName: oCML.groupName,
            //             eTag: oCML["@etag"]
            //         };

            //         var oExportData = Object.assign({}, oTempData);

            //         if (oCML.to_values.length > 0) {
            //             var isReading = oCML.to_values.some(function (oCheckReading) {
            //                 return oCheckReading.dataSourcename === "READINGS";
            //             });

            //             var oCMLPosition = oCML.to_values.find(function (oCheckReading) {
            //                 return oCheckReading.dataSourcename === "POSITION";
            //             });

            //             if (oCMLPosition) {
            //                 var sCMLPosition = fnDecode(atob(oCMLPosition.dataSourceValue)).value;
            //                 oTempData.cmlPosition = sCMLPosition;
            //                 oExportData.cmlPosition = sCMLPosition;
            //             }

            //             if (isReading) {
            //                 oCML.to_values.forEach(function (oValues) {
            //                     if (oValues.dataSourcename !== "READINGS") return;

            //                     var oDataSourceValue = oValues.dataSourceValue ? fnDecode(atob(oValues.dataSourceValue)) : null;
            //                     var oDSValue = oDataSourceValue ? (oDataSourceValue.value || oDataSourceValue) : {};
            //                     var iST = oDSValue.SHORT_TERM_CORROSION_RATE ? parseFloat(oDSValue.SHORT_TERM_CORROSION_RATE).toFixed(that.fnGetDecimelValue(oCML.cmlTemplateId, "SHORT_TERM_CORROSION_RATE")) : null;
            //                     var iLT = oDSValue.LONG_TERM_CORROSION_RATE ? parseFloat(oDSValue.LONG_TERM_CORROSION_RATE).toFixed(that.fnGetDecimelValue(oCML.cmlTemplateId, "LONG_TERM_CORROSION_RATE")) : null;
            //                     var iHL = oDSValue.HALF_LIFE;
            //                     var iTmin = oDSValue.TMIN ? parseFloat(oDSValue.TMIN).toFixed(that.fnGetDecimelValue(oCML.cmlTemplateId, "TMIN")) : null;
            //                     var iReading = oDSValue.READING ? parseFloat(oDSValue.READING).toFixed(that.fnGetDecimelValue(oCML.cmlTemplateId, "READING")) : null;
            //                     var rDate = oDSValue.RETIREMENT_DATE ? new Date(oDSValue.RETIREMENT_DATE) : null;
            //                     var rDateFormat = rDate ? that.Formatter.formatDate(rDate) : rDate;
            //                     var inspDate = oDSValue.DATE ? new Date(oDSValue.DATE) : null;
            //                     var inspDateFormat = inspDate ? that.Formatter.formatDate(inspDate) : inspDate;

            //                     var oTableData = {
            //                         date: inspDateFormat || sCMLDateFormate,
            //                         dateTimeValue: inspDateFormat ? inspDate.getTime() : date.getTime(),
            //                         reading: iReading,
            //                         shortTermCorrisionRate: iST,
            //                         longTermCorrisionRate: iLT,
            //                         halfLife: iHL,
            //                         retirementDate: rDateFormat,
            //                         retirementDateTimeValue: rDate ? rDate.getTime() : rDate,
            //                         tmin: iTmin,
            //                         locationId: oCML.ID,
            //                         locationTemplateId: oCML.cmlTemplateId,
            //                         objectId: oCML.objectId,
            //                         dataSourceId: oValues.ID
            //                     };

            //                     var oNewExport = Object.assign({}, oExportData, oTableData);

            //                     if (iReading > 0.9 * iTmin && iReading < iTmin) {
            //                         oTableData.activeColColorReading = "Information";
            //                         oTableData.activeIconReading = "sap-icon://arrow-bottom";
            //                     } else if (iReading < iTmin) {
            //                         oTableData.activeColColorReading = "Danger";
            //                         oTableData.activeIconReading = "sap-icon://arrow-bottom";
            //                     } else if (iST < 0) {
            //                         oTableData.activeColColorSortTerm = "Warning";
            //                         oTableData.activeIconSortTerm = "sap-icon://arrow-top";
            //                         if (iLT < 0) {
            //                             oTableData.activeColColorLongTerm = "Warning";
            //                             oTableData.activeIconLongTerm = "sap-icon://arrow-top";
            //                         }
            //                     } else if (iLT < 0) {
            //                         oTableData.activeColColorLongTerm = "Warning";
            //                         oTableData.activeIconLongTerm = "sap-icon://arrow-top";
            //                         if (iST < 0) {
            //                             oTableData.activeColColorSortTerm = "Warning";
            //                             oTableData.activeIconSortTerm = "sap-icon://arrow-top";
            //                         }
            //                     } else if (sTodayDateFormate === sCMLDateFormate) {
            //                         oNewExport.isNew = true;
            //                     }

            //                     /**
            //                      * 
            //                      * @param {*} condition 
            //                      */
            //                     var addToLists = function (condition) {
            //                         if (condition) {
            //                             aTempReading.push(oTableData);
            //                             aExportData.push(oNewExport);
            //                         }
            //                     };

            //                     addToLists(sFilterBy === "Danger" && oTableData.activeColColorReading === "Danger");
            //                     addToLists(sFilterBy === "Information" && oTableData.activeColColorReading === "Information");
            //                     addToLists(sFilterBy === "Warning" && (oTableData.activeColColorSortTerm === "Warning" || oTableData.activeColColorLongTerm === "Warning"));
            //                     addToLists(sFilterBy === "Success" && oNewExport.isNew);
            //                     addToLists(sFilterBy === "Baseline");
            //                     addToLists(sFilterBy === "");

            //                 });
            //             } else {
            //                 sCMLDateFormate = that.Formatter.formatDate(new Date(oCML.createdAt));
            //                 aTempReading.push(oTempData);

            //                 var isFiltered = (oExportData.reading > 0.9 * oExportData.tmin && oExportData.reading < oExportData.tmin) ||
            //                     (oExportData.reading < oExportData.tmin) ||
            //                     (oExportData.shortTermCorrisionRate < 0) ||
            //                     (oExportData.longTermCorrisionRate < 0) ||
            //                     (sTodayDateFormate === sCMLDateFormate && sFilterBy === "Success") ||
            //                     sFilterBy === "Baseline" || sFilterBy === "";

            //                 if (isFiltered) {
            //                     aExportData.push(oExportData);
            //                 }
            //             }

            //             if (aTempReading.length > 0) {
            //                 aTempReading.sort(function (a, b) { return b.dateTimeValue - a.dateTimeValue; });
            //                 var temp = aTempReading.shift();

            //                 Object.assign(oTempData, temp);
            //                 oTempData.categories = aTempReading;

            //                 if (!oTempData.categories.length) {
            //                     if (!oTempData.activeIconReading) {
            //                         oTempData.activeColColorReading = "Indication08";
            //                     }
            //                     if (!oTempData.activeIconSortTerm) {
            //                         oTempData.activeColColorSortTerm = "Indication08";
            //                     }
            //                     if (!oTempData.activeIconLongTerm) {
            //                         oTempData.activeColColorLongTerm = "Indication08";
            //                     }
            //                 }
            //             }

            //             if (sFilterBy === "Baseline" && !oTempData.categories.length) {
            //                 aCMLBaselineData.push(oTempData);
            //                 aCMLBaselineExportData.push(aExportData[0]);
            //             } else {
            //                 var isFilteredAll = [oTempData.activeColColorReading, oTempData.activeColColorLongTerm, oTempData.activeColColorSortTerm].includes(sFilterBy) || sFilterBy === "" || (sFilterBy === "Success" && sTodayDateFormate === sCMLDateFormate);
            //                 if (isFilteredAll) {
            //                     aCMLFilterData.push(oTempData);
            //                 }
            //             }
            //         } else {
            //             if (sFilterBy === "Baseline" && !oTempData.categories.length) {
            //                 aCMLBaselineData.push(oTempData);
            //                 aCMLBaselineExportData.push(oExportData);
            //             } else {
            //                 var isFilteredEmpty = [oTempData.activeColColorReading, oTempData.activeColColorLongTerm, oTempData.activeColColorSortTerm].includes(sFilterBy) || sFilterBy === "" || (sFilterBy === "Success" && sTodayDateFormate === sCMLDateFormate);
            //                 if (isFilteredEmpty) {
            //                     aCMLFilterData.push(oTempData);
            //                 }
            //             }
            //             // aExportData.push(oExportData);
            //         }
            //     }
            // });

            // if (sSearchText) {
            //     aCMLFilterData = aCMLFilterData.filter(function (oCML) {
            //         if ((oCML.cmlName && ((oCML.cmlName).toLowerCase()).includes(sSearchText)) || (oCML.cmlDescription && ((oCML.cmlDescription).toLowerCase()).includes(sSearchText)) ||
            //             (oCML.groupName && ((oCML.groupName).toLowerCase()).includes(sSearchText)) || (oCML.cmlTemplateName && ((oCML.cmlTemplateName).toLowerCase()).includes(sSearchText))
            //         ) {
            //             return oCML;
            //         }
            //     });
            // }

            // if (aGroupFilter && aGroupFilter.length > 0) {
            //     var aFilteredGroup = [];

            //     aCMLFilterData.forEach(function (oCML) {
            //         aGroupFilter.forEach(function (oGroup) {
            //             if (oCML.groupName === oGroup) {
            //                 aFilteredGroup.push(oCML);
            //             }
            //         });
            //     });

            //     aCMLFilterData = aFilteredGroup.sort(function (a, b) {
            //         return parseFloat(b.dateTimeValue) - parseFloat(a.dateTimeValue);
            //     });

            // } else {
            //     aCMLFilterData = aCMLFilterData.sort(function (a, b) {
            //         return parseFloat(b.dateTimeValue) - parseFloat(a.dateTimeValue);
            //     });
            // }

            // var count = 0;
            // if (sFilterBy === "Baseline") {
            //     count = aCMLBaselineData.length;
            // } else {
            //     count = aCMLFilterData.length;
            // }

            // that._oTempCMLData.iCount = count;

            // if (sFilterBy === "Baseline") {
            //     that._oTempCMLData.exportData = aCMLBaselineExportData;
            // } else {
            //     that._oTempCMLData.exportData = aExportData;
            // }

            // if (isInitLoad) {
            //     if (sUom === "metric") {
            //         this.fnHandleUomConversion(sFilterBy, aCMLBaselineData, aCMLFilterData, aCMLFinalList, aExportData, aCMLBaselineExportData, function (oTempCMLData) {
            //             if (oTempCMLData) {
            //                 fnSuccessConversion(oTempCMLData);
            //                 if (sFilterBy === "Baseline") {
            //                     that._oTempCMLData.exportData = aCMLBaselineExportData;
            //                 } else {
            //                     that._oTempCMLData.exportData = aExportData;
            //                 }
            //             }
            //         });
            //     } else {
            //         var oTemp = "";
            //         if (sFilterBy && sFilterBy === "Baseline") {
            //             oTemp = that.fnSetCategoryforObject(aCMLFinalList, aCMLBaselineData);
            //             that._oTempCMLData.aFinalCMLResult = oTemp;
            //             fnSuccessConversion(that._oTempCMLData);
            //         } else {
            //             oTemp = that.fnSetCategoryforObject(aCMLFinalList, aCMLFilterData);
            //             that._oTempCMLData.aFinalCMLResult = oTemp;
            //             fnSuccessConversion(that._oTempCMLData);
            //         }
            //     }
            // } else {
            //     if (sFilterBy && sFilterBy === "Baseline") {
            //         oTemp = that.fnSetCategoryforObject(aCMLFinalList, aCMLBaselineData);
            //         that._oTempCMLData.aFinalCMLResult = oTemp;
            //         fnSuccessConversion(that._oTempCMLData);
            //     } else {
            //         oTemp = that.fnSetCategoryforObject(aCMLFinalList, aCMLFilterData);
            //         that._oTempCMLData.aFinalCMLResult = oTemp;
            //         fnSuccessConversion(that._oTempCMLData);
            //     }

            //     //return sFilterBy === "Baseline" ? that.fnSetCategoryforObject(aCMLFinalList, aCMLBaselineData) : that.fnSetCategoryforObject(aCMLFinalList, aCMLFilterData);
            // }
        },

        /**
         * Function to merge all the CML Template DataSource values with unique in single array
         * 
         * @param {Object} oDataSourceList - DataSource list as Object
         * @returns {Array} aUniqueTableColumnList - Array of Table Column list
         */
        fnGetUniqueTableColumnList: function (oDataSourceList) {

            var aUniqueTableColumnList = new Set();
            var oUniqueTableColumnList = {};
            for (var key in oDataSourceList) {
                var obj = oDataSourceList[key];
                for (var k in obj) {
                    aUniqueTableColumnList.add(k);
                    oUniqueTableColumnList[k] = obj[k];
                }
            }

            this._oTempCMLData.oTemplateDataSource = oUniqueTableColumnList;

            return Array.from(aUniqueTableColumnList);

        },

        /**
         * Function will formate the data in single object structure by mergin below two param
         * 
         * @param {Array} aCMLFinalList - Formated data of Parent categories
         * @param {Array} aFilteredData - Formated data of Child categories
         * @returns {Array} aCMLFinalList - Return Formated data to bind View Table
         */
        fnSetCategoryforObject: function (aCMLFinalList, aFilteredData) {

            aCMLFinalList.categories.forEach(function (oList) {
                aFilteredData.forEach(function (oFilterData) {
                    if (oList.objectId === oFilterData.objectId) {
                        oList.categories.push(oFilterData);
                    }
                });
            });

            return aCMLFinalList;

        },

        /**
         * Function to validate the new CML is already exist in Component / Current Object
         * 
         * @param {Object} oTable - Detail page CMLs Table data
         * @param {Object} oCommonModel - Detail page model
         * @param {String} sPage - Page / Dialog Type to differentiate the Functionality
         * @param {Function} fnSuccess - Callback function that return the _oTempCMLData
         * @returns {Boolean} If exist "True" else "False"
         */
        fnValidateCMLName: function (oTable, oCommonModel, sPage, fnSuccess) {

            var that = this;
            var aEditedCMLName = [];
            var aFinalTableItem = [];
            var sFilterData = "";

            if (sPage === "listPage") {
                var sPath = oTable.getBinding("items").sPath;
                var aTableList = oCommonModel.getProperty(sPath);
                var oNameMap = {};
                aTableList.forEach(function (oItem) {
                    var sName = oItem.name;
                    if (sName && sName.trim() !== "") {
                        sName = sName.trim();
                        if (!oNameMap[sName]) {
                            oNameMap[sName] = 0;
                        }
                        oNameMap[sName]++;
                    }
                });
                
                var bHasDuplicates=false
                aTableList.forEach(function (oItem) {
                    var sName = oItem.name;
                    if (sName && sName.trim() !== "" && oNameMap[sName.trim()] > 1) {
                        oItem.nameValueState = "Error";
                        oItem.nameValueStateText = "Duplicate names not allowed";
                        bHasDuplicates=true;
                    } 
                });

                if (bHasDuplicates) {
                    oCommonModel.setProperty(sPath, aTableList);
                    fnSuccess(false,true);  
                    return; 
                }              

                aTableList.forEach(function (oList) {
                    var sName = oList.name;
                    if (sName && sName.trim() !== "") {
                        aEditedCMLName.push("(name eq '" + sName.trim().replace(/'/g, "''") + "')");
                    }
                });
            } else if (sPage === "detailPage") {
                oTable.forEach(function (sName) {
                    if (sName && sName.trim() !== "") {
                        aEditedCMLName.push("(name eq '" + sName.trim().replace(/'/g, "''") + "')");
                    }
                });
            }            
            if (aEditedCMLName.length > 0) {
                sFilterData = aEditedCMLName.join(" or ");
                that.CMLDataSource.getObjectByCMLName(sFilterData, function (oObjectList) {
                    var aFinalList = [];
                    var uniqueIds = new Set();
                    var isCmlInSiblings=[];
                    var aUniqueCmlIds = new Set();

                    that._oTempCMLData.tempComponentObject.forEach(function (oComp) {
                        if(sPage==="listPage"){
                            if (oComp.mainTechnicalObject) {
                                var aFoundMain = oObjectList.value.filter(function (oList) {
                                    return oComp.id === oList.objectId;
                                });
                                aFoundMain.forEach(function (oItem) {
                                    if (!uniqueIds.has(oItem.ID)) {
                                        uniqueIds.add(oItem.ID);
                                        aFinalList.push(oItem);
                                    }
                                });
                            }else{
                                var aFoundCml = oObjectList.value.filter(function (oList) {
                                    return oComp.id === oList.objectId;
                                });
                                aFoundCml.forEach(function (oItem) {
                                    if (!aUniqueCmlIds.has(oItem.name)) {
                                        aUniqueCmlIds.add(oItem.name);
                                        isCmlInSiblings.push(oItem.name);
                                    }
                                });
                            }
                        } else{
                            var aFound = oObjectList.value.filter(function (oList) {
                                return oComp.id === oList.objectId;
                            });
                            aFound.forEach(function (oItem) {
                                if (!uniqueIds.has(oItem.ID)) {
                                    uniqueIds.add(oItem.ID);
                                    aFinalList.push(oItem);
                                }
                            });

                        }
                    });

                    if (aFinalList.length > 0) {
                        if (sPage === "listPage") {
                            aTableList.forEach(function (oTableList) {
                                var oContext = aFinalList.find(function (oObjList) {
                                    return oObjList.name === oTableList.name;
                                });

                                if (oContext) {
                                    oTableList.nameValueState = "Error";
                                    oTableList.nameValueStateText = "This name is already exist, please enter new name";

                                    aFinalTableItem.push(oTableList);
                                } else {
                                    aFinalTableItem.push(oTableList);
                                }
                            });

                            oCommonModel.setProperty(sPath, aFinalTableItem);
                            fnSuccess(false);
                        } else if (sPage === "detailPage") {
                            var aFound = [];
                            if (aFinalList.length > 0) {
                                aFound = aFinalList.filter(function (oCML) {
                                    var isDataFound = oTable.find(function (oTabelData) {
                                        return oCML.name === oTabelData;
                                    });

                                    if (isDataFound) {
                                        return oCML;
                                    }
                                });

                                if (aFound.length > 0) {
                                    fnSuccess(true, aFound);
                                } else {
                                    fnSuccess(false, aFound);
                                }
                            } else {
                                fnSuccess(false, aFound);
                            }
                        }
                    } else {
                        if (sPage === "listPage") {
                            var sUsedNames="";
                            if (isCmlInSiblings.length > 0) {
                                if(isCmlInSiblings.length === 1){
                                    sUsedNames = isCmlInSiblings[0];
                                }else{
                                    sUsedNames = isCmlInSiblings.join(",");
                                }
                                // var sMessage =  "The following name(s) are already being used:" + sUsedNames;
                                // that.oController.fnMessageShow("I",sMessage);
                            }
                            fnSuccess(true,"",sUsedNames);
                        } else if (sPage === "detailPage") {
                            fnSuccess(false, []);
                        }
                    }

                });
            }
        },

        /**
         * Function to format the CML Template DataSource as Object
         * 
         * @param {Array} aCMLTemplate - All CML Template List
         * @param {String} sCMLTemplateId - Current CML Template ID
         * @returns {Object} - Object based dataSource
         */
        fnFormateDataSource: function (aCMLTemplate) {

            var oCMLTemplateDataSource = [];
            var oTemp1 = [];
            /**
             * Function to decode Object
             * 
             * @param {Object} oValue 
             * @returns decode Object
             */
            var fnDecode = function (oValue) {
                var parsed = "";

                try {
                    parsed = JSON.parse(oValue);
                    // eslint-disable-next-line no-empty
                } catch (error) {

                }

                if (typeof parsed === "object") {
                    return parsed;
                }

                var oDecoded = "";
                if (typeof oValue === "string") {
                    oDecoded = atob(oValue);
                }

                return fnDecode(oDecoded);
            };


            aCMLTemplate.forEach(function (oCMLTemplate) {
                if (oCMLTemplate.to_data_source_config && oCMLTemplate.to_data_source_config.length > 0) {
                    oCMLTemplate.to_data_source_config.forEach(function (oItem) {
                        var oTemp = fnDecode(oItem.dataSourceDetail);
                        oTemp1[oTemp.name] = oTemp;
                        oCMLTemplateDataSource[oItem.cmlTemplate_id] = oTemp1;
                    });
                }
            });


            return oCMLTemplateDataSource;
        },

        /**
         * Function to get the decimal value
         * 
         * @param {Object} oCMLTemplateDataSource - Object DataSource List
         * @returns {Integer} iFloatValue - Decimal value
         */
        fnGetDecimelValue: function (sCMLTemplateId, sDataSource) {

            var iFloatValue = 4;
            var oCMLTemplate = this._oTempCMLData.templateDataSource;

            if (Object.keys(oCMLTemplate).length > 0) {
                if (oCMLTemplate[sCMLTemplateId]) {
                    oCMLTemplate[sCMLTemplateId]["READINGS"].tableCols.forEach(function (oItem) {
                        if (oItem.name === sDataSource) {
                            iFloatValue = oItem.decimalPlacesAllowed;
                            return iFloatValue;
                        }
                    });
                }
            }

            return iFloatValue;

        },

        /**
         * Function to Render the CML Tree Table with column and Toolbars
         * 
         * @param {Object} oController - Detail page controller
         * @param {String} sApp - Application Name
         * @param {String} sModel - Detail page Model Name
         * @param {Function} fnSuccess - Success Callback function
         */
        fnRenderCMLTreeTable: function (oController, sApp, sModel, fnSuccess) {

            var that = this;
            var oModel = oController.getView().getModel(sModel);
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var bVisible = false;
            var sCountDefaultPath = "/data/detailPage/overallReadingCount";
            var sSearchTextPath = "/data/detailPage/sSearchText";
            var bEditable = false;
            var bAddCML = false;
            var bVisibleCML = true;
            var bVisibleInspCreate = false;
            var bBulkCalculateButtonVisible = false;

            if (sApp === "cml") {
                bEditable = oModel.getProperty("/data/userRoles/edit");
                var bFeatureBulkCalculate = oModel.getProperty("/metaData/featureFlag/cmlBulkCalculate") === "1";
                bVisible = bEditable ? true : false;
                bBulkCalculateButtonVisible = bVisible && bFeatureBulkCalculate;
            } else if (sApp === "asd") {
                sCountDefaultPath = "/data/tab/cml/overallReadingCount";
                sSearchTextPath = "/data/tab/cml/sSearchText";
            } else if (sApp === "rwb") {
                var oRecommendationModel,sCMLTableSortingFlag;
                bEditable = oModel.getProperty("/data/userRoles/edit");
                bAddCML = bEditable ? true : false;
                oRecommendationModel = oController.getView().getModel("mRecommendations");
                sCMLTableSortingFlag = oRecommendationModel && oRecommendationModel.getProperty("/Metadata/featureFlag/cmlTableSorting");
                bVisibleCML = sCMLTableSortingFlag === "1";
                bVisibleInspCreate = true
                // bAddCML = true;
            }

            var oExistingButton = this.oController.getView().byId(this.oController.getView().sId + "--idTreeTableP13nSettings");
            if (oExistingButton) {
                oExistingButton.destroy();
            }
            var oVBox = this.oController.getView().byId("idCMLTreeTable");
            oVBox.removeAllItems();
            var oOverflowToolbar = new OverflowToolbar({
                style: "Clear",
                content: [
                    new Title({
                        text: oI18n.getText("asint.cml.overallReading.table.title") + " ({" + sModel + ">" + sCountDefaultPath + "})",
                        level: "H2"
                    }),
                    new SearchField({
                        class: "sapUiMediumMarginBegin",
                        placeholder: "Search",
                        value: "{" + sModel + ">" + sSearchTextPath + "}",
                        /**
                         * Function to call the CML search
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        search: function (oEvent) {
                            that.oController.onSearchCML(oEvent);
                        },
                        width: "15rem",
                        visible: true
                    }),
                    new ToolbarSpacer(),
                    new Button({
                        icon: "sap-icon://add",
                        text: oI18n.getText("asint.cml.overallReading.table..button.addCML"),
                        visible: bVisible,
                        type: "Transparent",
                        /**
                         * Press function
                         * @param {*} oEvent 
                         */
                        press: function (oEvent) {
                            if (that.oController && typeof that.oController.onCMLDialogOpen === "function") {
                                that.oController.onCMLDialogOpen(oEvent);
                            }
                        }
                    }),
                    new Button({
                        text: oI18n.getText("asint.cml.overallReading.table.button.bulkCalculate"),
                        type: "Transparent",
                        tooltip: "Calculate",
                        visible: bBulkCalculateButtonVisible,
                        /**
                         * Function to trigger the cml bulk calculate button pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.oController.fnBulkCalculate(oEvent);
                        }
                    }),
                    new Button({
                        icon: "sap-icon://refresh",
                        visible: bVisible,
                        enabled: "{" + sModel + ">/data/detailPage/isGroupVisible}",
                        type: "Transparent",
                        tooltip: "Renew CML",
                        /**
                         * Function to trigger renew cml btn pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.oController.onPressRenewCml(oEvent);
                        }
                    }),
                    new MenuButton({
                        icon: "sap-icon://group-2",
                        visible: bVisible,
                        enabled: "{" + sModel + ">/data/detailPage/isGroupVisible}",
                        type: "Transparent",
                        tooltip: "CML Group",
                        menu: new Menu({
                            items: [
                                new MenuItem({
                                    text: oI18n.getText("asint.cml.overallReading.table.group.assign"),
                                    key: "Assign",
                                    /**
                                     * Function to trigger the CML Assign group icon pressed
                                     * 
                                     * @param {Object} oEvent - The event object that triggered this function
                                     */
                                    press: function (oEvent) {
                                        that.oController.onPressGroup(oEvent);
                                    }
                                }),
                                new MenuItem({
                                    text: oI18n.getText("asint.cml.overallReading.table.group.unassign"),
                                    key: "UnAssign",
                                    /**
                                     * Function to trigger the CML UnAssign group icon pressed
                                     * 
                                     * @param {Object} oEvent - The event object that triggered this function
                                     */
                                    press: function (oEvent) {
                                        that.oController.onPressGroup(oEvent);
                                    }
                                })
                            ]
                        })
                    }),
                    new MenuButton({
                        icon: "sap-icon://duplicate",
                        visible: bVisible,
                        type: "Transparent",
                        tooltip: "CML Clone",
                        menu: new Menu({
                            items: [
                                new MenuItem({
                                    text: "Copy to This Asset",
                                    key: "Same Object",
                                    /**
                                     * Function to trigger the Same Object CML duplicate button pressed
                                     * 
                                     * @param {Object} oEvent - The event object that triggered this function
                                     */
                                    press: function (oEvent) {
                                        that.oController.onPressDuplicateCML(oEvent);
                                    }
                                }),
                                new MenuItem({
                                    text: "Copy to New Asset",
                                    key: "Different Object",
                                    /**
                                     * Function to trigger the Different Object CML duplicate button pressed
                                     * 
                                     * @param {Object} oEvent - The event object that triggered this function
                                     */
                                    press: function (oEvent) {
                                        that.oController.onPressDuplicateCML(oEvent);
                                    }
                                }),
                                new MenuItem({
                                    text: "Paste",
                                    key: "Paste",
                                    visible: "{" + sModel + ">/data/detailPage/copyPaste/visible/pasteButton}",
                                    /**
                                     * Function to trigger the Paste button pressed
                                     * 
                                     * @param {Object} oEvent - The event object that triggered this function
                                     */
                                    press: function (oEvent) {
                                        that.oController.onPressDuplicateCML(oEvent);
                                    }
                                })
                            ]
                        })
                    }),
                    new MenuButton({
                        icon: "sap-icon://copy",
                        visible: bVisible,
                        type: "Transparent",
                        tooltip: "CML Move",
                        menu: new Menu({
                            items: [
                                new MenuItem({
                                    text: "Move to New Asset",
                                    key: "Different Object",
                                    /**
                                     * Function to trigger the Different Object CML duplicate button pressed
                                     * 
                                     * @param {Object} oEvent - The event object that triggered this function
                                     */
                                    press: function (oEvent) {
                                        that.oController.onPressMoveCML(oEvent);
                                    }
                                }),
                            ]
                        })
                    }),
                    new Button({
                        icon: "sap-icon://business-objects-experience",
                        type: "Transparent",
                        tooltip: "Analytics",
                        visible: bVisible,
                        enabled: "{" + sModel + ">/data/detailPage/cmlTable/analytics/enable/button}",
                        /**
                         * Function to trigger the Excel Export button pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.oController.onPressAnalyticsView(oEvent);
                        }
                    }),
                    new Button({
                        text: "Create Inspection",
                        // icon: "sap-icon://add",
                        type: "Transparent",
                        tooltip: "Add Inspection",
                        visible: bVisibleInspCreate,
                        /**
                         * Function to trigger the Excel Export button pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.oController.onPressCreateInspection(oEvent);
                        }
                    }),
                    new Button({
                        icon: "sap-icon://add",
                        type: "Transparent",
                        tooltip: "Add CMLs",
                        visible: bAddCML,
                        /**
                         * Function to trigger the Excel Export button pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.onAddCMLs(oEvent);
                        }
                    }),
                    new Button({
                        icon: "sap-icon://excel-attachment",
                        type: "Transparent",
                        tooltip: "Export to Excel",
                        visible: bVisibleCML,
                        /**
                         * Function to trigger the Excel Export button pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.oController.onExcelExport(oEvent);
                        }
                    }),
                    new Button({
                        icon: "sap-icon://filter",
                        type: "Transparent",
                        tooltip: "Open filter settings",
                        visible: bVisibleCML,
                        /**
                         * Function to trigger the Filter button pressed
                         * 
                         * @param {Object} oEvent - The event object that triggered this function
                         */
                        press: function (oEvent) {
                            that.oController.handleOpenSettingDialog(oEvent);
                        }
                    }),
                    new Button({
                        icon: "sap-icon://action-settings",
                        tooltip: oI18n.getText("asint.cml.toolbar.table.settings.button.text"),
                        visible: bVisibleCML,
                        id: this.oController.getView().sId + "--idTreeTableP13nSettings"
                    })
                ]
            });

            var oTreeTable = this.fnCreateTreeTable(sModel, sApp);

            this.oController.getView().addDependent(oTreeTable);
            this.oController.oTableP13nEngineHelper = null;
            this.fnInitTable();

            var oVBoxTemp = new VBox({
                items: [oOverflowToolbar, oTreeTable]
            });
            oVBox.addItem(oVBoxTemp);

            fnSuccess(true, that._oTempCMLData);

        },

        /**
         * Function to create a TreeTable
         * 
         * @param {String} sModel - Detail page Model name
         * @param {String} sApp - Application name
         * @returns 
         */
        fnCreateTreeTable: function (sModel, sApp) {

            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var sDefaultPath = "/data/detailPage/CMLs";

            if (sApp === "asd") {
                sDefaultPath = "/data/tab/cml/CMLs";
            }
            var oExistingTable = this.oController.getView().byId(this.oController.getView().sId + "--idAsintCMLOverallReading");
            if (oExistingTable) {
                oExistingTable.destroy();
            }

            var oTreeTable = new TreeTable({
                id: this.oController.getView().sId + "--idAsintCMLOverallReading",
                rows: "{path: '" + sModel + ">" + sDefaultPath + "', parameters: {arrayNames: ['categories'], numberOfExpandedLevels: 1}}",
                selectionMode: "MultiToggle",
                enableSelectAll: false,
                ariaLabelledBy: "title",
                /**
                 * Function to trigger the CML row checkbox pressed
                 * 
                 * @param {Object} oEvent - The event object that triggered this function
                 */
                rowSelectionChange: function (oEvent) {
                    that.oController.onRowSelection(oEvent);
                },
                visibleRowCount: 10,
                threshold: 10,
                fixedColumnCount: 1,
                rowActionCount: 1,
                visibleRowCountMode: "Fixed",
                minAutoRowCount: 30,
                columnFreeze: 1
            });

            // Default visible Columns
            var aDefaultColumns = [
                new Column({
                    width: "13rem",
                    id: oTreeTable.sId + "--idObjectName",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "objectName",
                                    control: "sap.m.ObjectStatus",
                                    value1: "objectName",
                                    value2: "objectType"
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.objectName"),
                        wrapping: true
                    }),
                    template: new ObjectStatus({
                        text: "{" + sModel + ">objectName}",
                        icon: {
                            path: "" + sModel + ">objectType",
                            /**
                             * Function to formate the icon based on objectType
                             * 
                             * @param {String} sType - SAP's Object Status color
                             * @returns {String} Bind Icon to the Text field
                             */
                            formatter: function (sType) {
                                return sType === "EQUI" ? "sap-icon://machine" : sType === "FLOC" ? "sap-icon://functional-location" : "";
                            }
                        },
                        state: "None"
                    })
                }),
                new Column({
                    width: "13rem",
                    id: oTreeTable.sId + "--idCMLName",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "cmlName",
                                    control: "sap.m.ObjectIdentifier",
                                    value1: "cmlName",
                                    value2: "cmlDescription"
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.cmlName"),
                        wrapping: true
                    }),
                    template: new ObjectIdentifier({
                        title: "{" + sModel + ">cmlName}",
                        text: "{" + sModel + ">cmlDescription}"
                    })
                }),
                new Column({
                    width: "13rem",
                    id: oTreeTable.sId + "--idCMLTemplateName",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "cmlTemplateName",
                                    control: "sap.m.Text",
                                    value1: "cmlTemplateName",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.cmlTemplateName"),
                        wrapping: true
                    }),
                    template: new Text({
                        text: "{" + sModel + ">cmlTemplateName}"
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idDate",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "DATE",
                                    control: "sap.m.Text",
                                    value1: "DATE",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.date"),
                        wrapping: true
                    }),
                    template: new Text({
                        text: "{" + sModel + ">DATE}"
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idTmin",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "TMIN",
                                    control: "sap.m.Text",
                                    value1: "TMIN",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.tMin") + " ({= ${" + sModel + ">/data/UOM} === 'imperial' ? 'in' : 'mm'})",
                        wrapping: true
                    }),
                    template: new Text({
                        text: "{" + sModel + ">TMIN}"
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idReading",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "READING",
                                    control: "sap.m.ObjectStatus",
                                    value1: "READING",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.readings") + " ({= ${" + sModel + ">/data/UOM} === 'imperial' ? 'in' : 'mm'})",
                        wrapping: true
                    }),
                    template: new ObjectStatus({
                        text: "{" + sModel + ">READING}",
                        icon: "{" + sModel + ">activeIconReading}",
                        state: {
                            path: "" + sModel + ">activeColColorReading",
                            /**
                             * Function to display the text with icon and Color
                             * 
                             * @param {String} sColor - SAP's Object Status color
                             * @returns {String} Bind color to the text with icon
                             */
                            formatter: function (sColor) {
                                switch (sColor) {
                                case "Danger":
                                    return "Error";
                                case "Warning":
                                    return "Warning";
                                case "Information":
                                    return "Information";
                                case "Indication08":
                                    return "Indication08";
                                default:
                                    return "None";
                                }
                            }
                        }
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idShortTermCorrisionRate",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "SHORT_TERM_CORROSION_RATE",
                                    control: "sap.m.Text",
                                    value1: "SHORT_TERM_CORROSION_RATE",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.shortCorrosion") + " ({= ${" + sModel + ">/data/UOM} === 'imperial' ? 'in/year' : 'mm/year'})",
                        wrapping: true
                    }),
                    template: new ObjectStatus({
                        text: "{" + sModel + ">SHORT_TERM_CORROSION_RATE}",
                        icon: "{" + sModel + ">activeIconSortTerm}",
                        state: {
                            path: "" + sModel + ">activeColColorSortTerm",
                            /**
                             * Function to display the text with icon and Color
                             * 
                             * @param {String} sColor - SAP's Object Status color
                             * @returns {String} Bind color to the text with icon
                             */
                            formatter: function (sColor) {
                                switch (sColor) {
                                case "Danger":
                                    return "Error";
                                case "Warning":
                                    return "Warning";
                                case "Information":
                                    return "Information";
                                case "Indication08":
                                    return "Indication08";
                                default:
                                    return "None";
                                }
                            }
                        }
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idLongTermCorrosionRate",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "LONG_TERM_CORROSION_RATE",
                                    control: "sap.m.ObjectStatus",
                                    value1: "LONG_TERM_CORROSION_RATE",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.longCorrosion") + " ({= ${" + sModel + ">/data/UOM} === 'imperial' ? 'in/year' : 'mm/year'})",
                        wrapping: true
                    }),
                    template: new ObjectStatus({
                        text: "{" + sModel + ">LONG_TERM_CORROSION_RATE}",
                        icon: "{" + sModel + ">activeIconLongTerm}",
                        state: {
                            path: "" + sModel + ">activeColColorLongTerm",
                            /**
                             * Function to display the text with icon and Color
                             * 
                             * @param {String} sColor - SAP's Object Status color
                             * @returns {String} Bind color to the text with icon
                             */
                            formatter: function (sColor) {
                                switch (sColor) {
                                case "Danger":
                                    return "Error";
                                case "Warning":
                                    return "Warning";
                                case "Information":
                                    return "Information";
                                case "Indication08":
                                    return "Indication08";
                                default:
                                    return "None";
                                }
                            }
                        }
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idHalfLife",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "HALF_LIFE",
                                    control: "sap.m.Text",
                                    value1: "HALF_LIFE",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.halfLife"),
                        wrapping: true
                    }),
                    template: new Text({
                        text: "{" + sModel + ">HALF_LIFE}"
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idRetirementDate",
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "RETIREMENT_DATE",
                                    control: "sap.m.Text",
                                    value1: "RETIREMENT_DATE",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.retirementDate"),
                        wrapping: true
                    }),
                    template: new Text({
                        text: "{" + sModel + ">RETIREMENT_DATE}"
                    })
                }),
                new Column({
                    width: "7rem",
                    id: oTreeTable.sId + "--idCMLGroupName",
                    visible: false,
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "p13nSettings",
                            value: {
                                metadata: {
                                    path: "groupName",
                                    control: "sap.m.Text",
                                    value1: "groupName",
                                    value2: ""
                                }
                            }
                        })
                    ],
                    label: new Label({
                        text: oI18n.getText("asint.cml.overallReading.table.label.CMLGroup"),
                        wrapping: true
                    }),
                    template: new Text({
                        text: "{" + sModel + ">groupName}"
                    })
                })
            ];

            // Detail page Navigation only for CML End user app
            if (sApp === "cml") {
                var oRowActionTemplate = new sap.ui.table.RowAction({
                    items: [
                        new sap.ui.table.RowActionItem({
                            type: sap.ui.table.RowActionType.Navigation,
                            visible: "{= ${mCMLModel>rowType} === 'parentRow'}",
                            /**
                             * Function to trigger the Detail page Arrow button pressed
                             * 
                             * @param {Object} oEvent - The event object that triggered this function
                             */
                            press: function (oEvent) {
                                that.oController.onPressCML(oEvent)
                            }
                        })
                    ]
                });
                oTreeTable.setRowActionTemplate(oRowActionTemplate);
            }

            this.fnGetUniqueTableColumnList(this._oTempCMLData.templateDataSource);

            var oTemplateDataSource = this._oTempCMLData.oTemplateDataSource;
            if (oTemplateDataSource) {
                Object.keys(oTemplateDataSource).forEach(function (oItem) {

                    var oDataSource = oTemplateDataSource[oItem];
                    var sUom = "";
                    if (oDataSource.decimalPlacesAllowed) {
                        sUom = " ({= ${" + sModel + ">/data/UOM} === 'imperial' ? 'in' : 'mm'})";
                    }

                    var oColumn = new Column({
                        width: "7rem",
                        id: oTreeTable.sId + "--id" + oDataSource.name,
                        visible: false,
                        customData: [
                            new sap.ui.core.CustomData({
                                key: "p13nSettings",
                                value: {
                                    metadata: {
                                        path: oItem,
                                        control: "sap.m.Text",
                                        value1: oItem,
                                        value2: ""
                                    }
                                }
                            })
                        ],
                        label: new Label({
                            text: oDataSource.description + sUom,
                            wrapping: true
                        }),
                        template: new Text({
                            text: "{" + sModel + ">" + oItem + "}"
                        })
                    });

                    aDefaultColumns.push(oColumn);
                });
            }

            aDefaultColumns.forEach(function (oColumn) {
                oTreeTable.addColumn(oColumn);
            });

            return oTreeTable;

        },

        /**
         * Function to initialize the list view table.
         */
        fnInitTable: function () {

            if (!this.oController.oTableP13nEngineHelper) {
                this.oController.oTableP13nEngineHelper = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idAsintCMLOverallReading", // Mandatory
                        "settingButton": "idTreeTableP13nSettings"
                    },
                    "event": {
                        "columnListItemPress": "", // Mandatory
                        "onDataReceived": "" // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": false
                    }
                }, this.oController);
            }

        },

        /**
         * Function to reset the table p13n
         */
        fnResetP13n: function () {
            if (this.oController.oTableP13nEngineHelper) {
                this.oController.oTableP13nEngineHelper.reset();
            }
        },

        /**
         * Function will call only if Unit Of Mwaseure is set to "metric"
         * 
         * @param {String} sUom - Unit of Measurement
         * @param {Object} oDataSourceValue - DataSource as Array of Object 
         * @param {Function} fnUoMConversionSuccess - Callback function that return formated data with UOM Conversion
         */
        fnConvertUOMDataSource: function (sUom, oDataSourceValue, fnUoMConversionSuccess) {

            if (sUom === "metric") {
                var aConversionData = [];
                var aSkipKeys = ["REMAINING_LIFE", "HALF_LIFE", "DATE", "RETIREMENT_DATE", "dataId", "VALIDATED", "INSP_COMMENTS"];

                Object.keys(oDataSourceValue).forEach(function (oCMLId) {
                    Object.keys(oDataSourceValue[oCMLId]).forEach(function (oDataSourceId) {
                        var sKey = oCMLId + "##" + oDataSourceId;
                        var sDataType = oDataSourceValue[oCMLId][oDataSourceId].dataType;
                        var oDataSourceObj = oDataSourceValue[oCMLId][oDataSourceId];
                        var sDataSourceValue = oDataSourceObj && oDataSourceObj.dataSourceValue && oDataSourceObj.dataSourceValue.value;
                        var isDataStringOrNumber = typeof sDataSourceValue === "string" || typeof sDataSourceValue === "number";
                        if (aSkipKeys.indexOf(oDataSourceObj.dataSourceName) !== -1) {
                            return;
                        }

                        if (isDataStringOrNumber && !isNaN(Number(sDataSourceValue)) && isFinite(Number(sDataSourceValue)) && (sDataType === "numericflexible" || sDataType === "numericvalue")) {
                            var oTemp = {
                                "key": sKey,
                                "src": "IN",
                                "tgt": "MM",
                                "srcValue": sDataSourceValue.toString()
                            };
                            aConversionData.push(oTemp);
                        }

                        if (sDataType === "table" && sDataSourceValue) {
                            Object.keys(sDataSourceValue).forEach(function (oReading) {
                                if (aSkipKeys.indexOf(oReading) === -1) {
                                    sKey = sKey + "##" + oReading;
                                    var isStringOrNumber = typeof sDataSourceValue[oReading] === "string" || typeof sDataSourceValue[oReading] === "number";

                                    if (isStringOrNumber && sDataSourceValue[oReading] && !isNaN(Number(sDataSourceValue[oReading])) && isFinite(Number(sDataSourceValue[oReading])) && sDataSourceValue[oReading] !== "") {
                                        var oTemp = {
                                            "key": sKey,
                                            "src": "IN",
                                            "tgt": "MM",
                                            "srcValue": sDataSourceValue[oReading].toString()
                                        };
                                        aConversionData.push(oTemp);
                                    }
                                }
                                sKey = oCMLId + "##" + oDataSourceId;
                            });
                        }
                        sKey = "";
                    });
                });
                aConversionData = aConversionData.filter(function (item) {
                    return item.srcValue !== null &&
                        item.srcValue !== "" ;
                });
 
                this.CMLDataSource.fnUoMConversion(aConversionData, function (aConversionResult) {
                    aConversionResult.forEach(function (oDataSourceItem) {
                        var aKey = oDataSourceItem.key.split("##");
                        var sCMLId = aKey[0];
                        var sDataSourceID = aKey[1];
                        var sReadingText = aKey[2] ? aKey[2] : "";
                        var iDecimal = oDataSourceValue[sCMLId][sDataSourceID].decimalPlaceAllowed;
                        var sValue = oDataSourceValue[sCMLId][sDataSourceID].dataSourceValue.value;

                        if (sReadingText === "") {
                            if (iDecimal) {
                                sValue = oDataSourceItem.tgtValue.toFixed(Number(iDecimal));
                            } else {
                                sValue = oDataSourceItem.tgtValue.toFixed(4);
                            }
                        } else {
                            if (oDataSourceValue[sCMLId][sDataSourceID].decimalPlaceAllowed) {
                                sValue[sReadingText] = oDataSourceItem.tgtValue.toFixed(Number(iDecimal));
                            } else {
                                sValue[sReadingText] = oDataSourceItem.tgtValue.toFixed(4);
                            }
                        }

                        // this below line is updating the converted value for the primitive data type, 
                        // for table data type it was working because sValue will have the refrence of the object and updated value is reflecting in the table but for primitive data type we need to update the value explicitly in the main object
                        oDataSourceValue[sCMLId][sDataSourceID].dataSourceValue.value = sValue;
                    });
                    fnUoMConversionSuccess(oDataSourceValue);
                });
            } else {
                fnUoMConversionSuccess(oDataSourceValue);
            }

        },

        /**
         * Function to Add CMLs to the Recommendation
         */
        onAddCMLs: function () {

            var that = this;

            if (!this.oAddCMLDialog) {
                Fragment.load({
                    name: "com.asint.ais.library.fragment.DialogAddCML",
                    controller: that
                }).then(function (oDialog) {
                    var oCMLData = new JSONModel({
                        "data": {
                            "cml": {
                                "attachedequiCmls": []
                            }
                        },
                        "metadata": {
                            "selectedCount": 0,
                            "tableHeader": "",
                            "selectedID": [],
                            "selectedItems": []
                        }
                    });
                    that.oController.getView().addDependent(oDialog);
                    that.oAddCMLDialog = oDialog;
                    that.oAddCMLDialog.setModel(oCMLData, "mCMLData");
                    that.fnPrepareAddCMLData();
                    that.oAddCMLDialog.open();
                }.bind(that));
            } else {
                that.fnPrepareAddCMLData();
                that.oAddCMLDialog.open();

            }
        },  

        /**
         * Function to close the Add CML Dialog
         */
        onAddCMLCancel: function () {

            this.oAddCMLDialog.close();

        },

        /**
         * Function to prepare the CMLs data for Add CMLs Dialog
         */
        fnPrepareAddCMLData: function () {

            var that = this;
            var oObject = that._oTempCMLData.componentObject;
            var aCMLs = that._oTempCMLData.aCMLs;
            var aTreeNode = [];
            var oModel = this.oAddCMLDialog.getModel("mCMLData");

            oObject.forEach(function (oObj) {
                var oTemp = {
                    "objectId": oObj.id,
                    "name": oObj.name,
                    "selected": false,
                    "nodes": []
                };

                aTreeNode.push(oTemp);
            });

            aCMLs.forEach(function (oItem) {
                var oNode = aTreeNode.find(function (oObj) {
                    return oObj.objectId === oItem.objectId;
                });

                if (oNode) {
                    var oTemp = {
                        "name": oItem.name,
                        "cmlId": oItem.ID,
                        "type": "CML",
                        "templateId": oItem.cmlTemplateId,
                        "selected": false
                    };

                    oNode.nodes.push(oTemp);
                }
            });

            oModel.setProperty("/data/cml/attachedequiCmls", aTreeNode);

        },

        /**
         * Function that handles the cml selection change
         * @param {Object} oEvent 
         */
        onCMLSelectionChange: function (oEvent) {

            var oListItem = oEvent.getParameter("listItem");
            var mCMLData = this.oAddCMLDialog.getModel("mCMLData");
            var sPath = oListItem.getBindingContextPath();
            var bSelected = oEvent.getParameter("selected");
            var oCMLTemplate;
            if (oListItem.data("type") === "CML") {
                sPath = sPath.substring(0, sPath.lastIndexOf("/nodes"));
                oCMLTemplate = mCMLData.getProperty(sPath);
                oCMLTemplate.selected = true;
                oCMLTemplate.nodes.forEach(function (oCML) {
                    if (!oCML.selected) {
                        oCMLTemplate.selected = false;
                    }
                });
                mCMLData.setProperty(sPath, oCMLTemplate);
            } else {
                oCMLTemplate = mCMLData.getProperty(sPath);
                oCMLTemplate.nodes.forEach(function (oCML) {
                    oCML.selected = bSelected;
                });
                mCMLData.setProperty(sPath, oCMLTemplate);
            }

        },

        /**
         * Function that handles the cml toggle event
         * @param {Object} oEvent 
         * @param {Boolean} bExpand 
         */
        onAddCMLTreeToggleExpand: function (oEvent, bExpand) {

            var oCMLTree = oEvent.getSource().getParent().getParent().getContent()[0];

            if (bExpand) {
                oCMLTree.expandToLevel(1);
            } else {
                oCMLTree.collapseAll();
            }

        },

        /**
         * Function to Save the CMLs to Recommendations
         */
        onAddCMLConfirm: function () {

            var that = this;
            var mCMLData = this.oAddCMLDialog.getModel("mCMLData");
            var aTreeCML = mCMLData.getProperty("/data/cml/attachedequiCmls");
            mRecoDetail = this.oController.getView().getModel("mRecoDetail");
            var sRecommendatioId = mRecoDetail.getProperty("/data/recoId");
            // var oPayload = {
            //     "ID": sRecommendatioId,
            //     "deleted": false,
            //     "to_cmls": []
            // };
            // var eTag = mRecoDetail.getProperty("/data/eTag");

            // aTreeCML.forEach(function (oObj) {
            //     oObj.nodes.forEach(function (oCML) {
            //         if (oCML.selected) {
            //             oTemp = {
            //                 "recommendation_ID": sRecommendatioId,
            //                 "cml_ID": oCML.cmlId,
            //                 "deleted": false
            //             }
            //             oPayload.to_cmls.push(oTemp);
            //         }
            //     });
            // });

            // if (that._oTempCMLData.rwbSelectedCML.length > 0) {
            //     that._oTempCMLData.rwbSelectedCML.forEach(function (oSelectedCML) {
            //         oPayload.to_cmls.push({
            //             "recommendation_ID": sRecommendatioId,
            //             "cml_ID": oSelectedCML.cml_ID,
            //             "deleted": false
            //         });
            //     });
            // }

            var aPayload = [];
            aTreeCML.forEach(function (oObj) {
                oObj.nodes.forEach(function (oCML) {
                    if (oCML.selected) {
                        oTemp = {
                            "recommendation_ID": sRecommendatioId,
                            "ID": oCML.cmlId,
                            "deleted": false
                        }
                        aPayload.push(oTemp);
                    }
                });
            });

            if (that._oTempCMLData.rwbSelectedCML.length > 0) {
                that._oTempCMLData.rwbSelectedCML.forEach(function (oSelectedCML) {
                    aPayload.push({
                        "recommendation_ID": sRecommendatioId,
                        "ID": oSelectedCML.ID,
                        "deleted": false
                    });
                });
            }

            this.CMLDataSource.assignCMLtoRecommendations(aPayload, function (oResponse) {
                that.fnFilterCMLs("save", oResponse, function () {
                    that.onTableConversion("", [], "", function (aCMLFilterData) {
                        if (aCMLFilterData && aCMLFilterData.aCMLs.length > 0) {
                            mRecoDetail.setProperty("/data/detailPage/CMLs", aCMLFilterData.aFinalCMLResult);
                            mRecoDetail.setProperty("/data/detailPage/aCMLs", aCMLFilterData.aCMLs);
                            mRecoDetail.setProperty("/data/detailPage/aTempCMLs", aCMLFilterData.aFinalCMLResult);
                            mRecoDetail.setProperty("/data/detailPage/exportData", aCMLFilterData.exportData);
                            mRecoDetail.setProperty("/data/detailPage/aFormattedData", aCMLFilterData);
                            mRecoDetail.setProperty("/data/detailPage/overallReadingCount", aCMLFilterData.iCount);
                            mRecoDetail.setProperty("/data/detailPage/iTempTotalCount", aCMLFilterData.iCount);
                            mRecoDetail.setProperty("/data/detailPage/headerData", aCMLFilterData.aHeaderData);
                            mRecoDetail.setProperty("/data/detailPage/cmlGroups", that.oController.fnGetUniqueCMLGroupName(aCMLFilterData.aCMLs, "groupName"));
                            sap.ui.core.BusyIndicator.hide();
                            that.oAddCMLDialog.close();
                            that.oController.fnMessageShow("S", "CMLs Assigned Successfully");
                        }
                    });
                });

            }, function () {

            });
        },

        /**
         * Function to filter the CMLs based on Response
         * 
         * @param {Object} oResponse - Recommendations CMLs Result
         * @param {*} fnCallBackCMLs - Callback function
         */
        fnFilterCMLs: function (sType, oResponse, fnCallBackCMLs) {

            var oCMLID = {};
            var that = this;

            if (sType === "save") {
                oResponse.forEach(function (oCML) {
                    oCMLID[oCML.ID] = oCML;
                });
            } else if (sType === "get") {
                oResponse.to_cmls.forEach(function (oCML) {
                    oCMLID[oCML.ID] = oCML;
                });
            }

            var aCML = that._oTempCMLData.aCMLs;
            var aCMLIds = Object.keys(oCMLID);
            var aSelectCMLfromMaster = [];

            aCMLIds.forEach(function (sId) {
                var oContent = aCML.find(function (oCMLData) {
                    return sId === oCMLData.ID;
                });
                aSelectCMLfromMaster.push(oContent);
            });

            that._oTempCMLData.rwbCML = aSelectCMLfromMaster;

            fnCallBackCMLs(that._oTempCMLData);

        }

    });

});