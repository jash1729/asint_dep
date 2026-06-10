sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "com/asint/ais/library/datasource/asint/CML",
    "com/asint/ais/library/datasource/BaseSource",
    "sap/ui/core/routing/History",
    "com/asint/ais/mi/cml/utility/Formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "com/asint/ais/library/utils/TechnicalObjectValueHelp",
    "com/asint/ais/library/utils/CMLTreeTableHelper",
    "com/asint/ais/library/datasource/asint/Common",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "com/asint/ais/mi/cml/model/formatter",
], function (Utility, CMLDataSource, BaseSource, History, Formatter, MessageBox, MessageToast, TechnicalObjectValueHelp, CMLTreeTableHelper, Common,Filter,FilterOperator,Fragment,formatter) {
    "use strict";

    return Utility.extend("com.asint.ais.mi.cml.controller.BaseController", {

        formatter: Formatter,
        fnFormatter: new formatter(),

        dataSource: new BaseSource(),

        CMLDataSource: new CMLDataSource(window.com.asint.ais.mi.cml.baseURI),

        technicalObjectValueHelp: new TechnicalObjectValueHelp(window.com.asint.ais.mi.cml.baseURI),

        commonDataSource: new Common(window.com.asint.ais.mi.cml.baseURI),

        CMLHelper: new CMLTreeTableHelper(window.com.asint.ais.mi.cml.baseURI),

        NAVIGATION: {},

        URL: {
            "equipment": "/asint/odata/v4/MasterDataService/Equipments",
            "functionalLocation": "/asint/odata/v4/MasterDataService/FunctionalLocations",
            "equipmentDetail": "/asint/odata/v4/MasterDataService/Equipments({variable1})?$expand=to_description($select=shortDescription,longDescription),to_class($expand=classes($expand=to_description($select=shortDescription,longDescription),to_characteristic($expand=characteristic($expand=to_description($select=shortDescription,longDescription),to_codeList($expand=codeList($expand=to_description($select=shortDescription,longDescription),to_codeListItem($expand=to_description($select=shortDescription,longDescription))))))))",
            "equipmentValue": "/asint/odata/v4/MasterDataService/Equipments({variable1})/to_value",
            "classesWithDesc": "/asint/odata/v4/MasterDataService/Classes?$expand=to_description($select=shortDescription)"
        },

        /**
         * Function to navigate across the application.
         * 
         * @param {String} sHashWithKeyword 
         * @param {Object} oParam 
         */
        navigate: function (sHashWithKeyword, oParam) {
            var sHash = sHashWithKeyword;
            $.each(oParam, function (sKey, sValue) {
                sHash = sHash.replace("{" + sKey + "}", sValue);
            });
            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: sHash
                }
            });
        },

        /**
         * Function to get the logged in user's roles.
         */
        getUserRoles: function () {
            var mCMLModel = this.getView().getModel("mCMLModel");

            this.commonDataSource.getRoles("CML", function (oRolesRec) {
                if (mCMLModel !== undefined) {
                    mCMLModel.setProperty("/data/userRoles", oRolesRec);
                }
                if (mCMLModel !== undefined) {
                    mCMLModel.setProperty("/data/userRoles", oRolesRec);
                }
            });
        },

        /**
         * Function to render the standard message box.
         * 
         * @param {String} sMsgType 
         * @param {String} sMessageText 
         * @param {String} sMessageDetail 
         * @param {Function} fnCallback 
         * @returns empty
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
                    styleClass: "asintCMLMessage",
                    /**
                     * Function to Handle Action button
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
         * Validator for Multi input fields
         * 
         * @param {Object} oControl - Controller
         */
        fnMultiInputAddValidator: function (oControl) {

            if (oControl && oControl.getMetadata().getName() === "sap.m.MultiInput") {
                oControl.addValidator(function (oArguments) {
                    var sId = oArguments.text;
                    return new sap.m.Token({ key: sId, text: sId });
                });
            }

        },

        /**
         * Function to call Hierarchy List
         */
        fnFetchAssetHierarchy: function () {

            var sEmail = this.getLoggedInUserMail();
            var mCMLModel = this.getView().getModel("mCMLModel");
            var bFetched = mCMLModel.getProperty("/data/assetHierarchy/fetched");
            var aProcessedNodes = [];

            if (!bFetched) {
                this.CMLDataSource.getAssetHierarchy(sEmail, function (oResponse) {
                    var oResponse1 = {
                        childLocations: oResponse.functionalLocations
                    };
                    /**
                     * Function to prepare the Hierarchy Data
                     * 
                     * @param {Object} oTechnicalObject - Technical Object List
                     * @param {String} sTechnicalObjectType - Technical Object Type
                     * @param {Array} aNodes - List of Node
                     * @param {Array} aLines - List of Line
                     * @returns 
                     */
                    var fnExpandHierarchy = function (oTechnicalObject, sTechnicalObjectType, aNodes, aLines) {
                        var sIcon = "sap-icon://product";

                        if (sTechnicalObjectType === "EQUI") {
                            sIcon = "sap-icon://machine";
                        } else if (sTechnicalObjectType === "FLOC") {
                            sIcon = "sap-icon://functional-location";
                        }
                        var sDescription = "";

                        if (oTechnicalObject.descriptions && oTechnicalObject.descriptions.length > 0) {
                            sDescription = oTechnicalObject.descriptions[0].shortDescription;
                        }
                        if (oTechnicalObject.id) {
                            if (!aProcessedNodes.includes(oTechnicalObject.id)) {
                                aProcessedNodes.push(oTechnicalObject.id);
                                aNodes.push({
                                    "id": oTechnicalObject.id,
                                    "name": oTechnicalObject.name || sDescription,
                                    "type": sTechnicalObjectType,
                                    "desc": sDescription,
                                    "status": "Information", // TODO: We will keep it in blue color for now
                                    "icon": sIcon,
                                    "shape": "Box",
                                    "attributes": [
                                        {
                                            "label": "Description",
                                            "value": sDescription
                                        }
                                    ]
                                });
                            }
                        }

                        if (oTechnicalObject.childLocations) {
                            oTechnicalObject.childLocations.forEach(function (oFunctionalLocation) {
                                if (oTechnicalObject.id) {
                                    aLines.push({
                                        from: oTechnicalObject.id,
                                        to: oFunctionalLocation.id
                                    });
                                }
                                return fnExpandHierarchy(oFunctionalLocation, "FLOC", aNodes, aLines);
                            });
                        }
                        if (oTechnicalObject.childEquipments) {
                            oTechnicalObject.childEquipments.forEach(function (oEquipment) {
                                if (oTechnicalObject.id) {
                                    aLines.push({
                                        from: oTechnicalObject.id,
                                        to: oEquipment.id
                                    });
                                }
                                return fnExpandHierarchy(oEquipment, "EQUI", aNodes, aLines);
                            });
                        }

                        return {
                            fetched: true,
                            nodes: aNodes,
                            lines: aLines
                        };
                    };

                    mCMLModel.setProperty("/data/assetHierarchy", fnExpandHierarchy(oResponse1, "FLOC", [], []));

                }, function () {
                    // TODO: Handle error
                    mCMLModel.setProperty("/data/assetHierarchy", {
                        fetched: false,
                        lines: [],
                        nodes: []
                    });
                });
            }

        },

        /**
         * Function for Detail page copy paste - Description text limitation
         * @param {Object} oTextArea - Text Area controller
         */
        fnSetTextAreaRemainingText: function (oTextArea) {
            var sMax = oTextArea.getMaxLength();
            var sLength = oTextArea.getValue().length;
            var sCountText = sLength + "/" + sMax;
            oTextArea.getAggregation("_counter").setText(sCountText);
        },

        /**
         * Function that adds created by and modified by to payload
         * @param {Object} payload 
         * @param {String} type 
         * @param {Object} obj 
         * @returns 
         */
        setCreatedModified: function (payload, type, obj) {
            if (type === "POST") {
                payload.createdBy = this.getLoggedInUserMail();
            } else if (type === "PUT") {
                payload.createdBy = Array.isArray(obj) ? obj[0].createdBy : obj.createdBy;
            }
            payload.modifiedBy = this.getLoggedInUserMail();
            return payload;
        },

        /**
         * Function to perform chunk and return response
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
         * Function to get the difference between two date based on Rage
         * 
         * @param {String} sRetirementDate - RetirementDate based on LTCR, STCR, LSCR
         * @param {String} sLatestReadingDate - Latest Inspection Reading
         */
        fnGetDateDifferentiation: function (sRetirementDate, sLatestReadingDate) {
            
            var iRange = 5;
            var aDates = [];
            var oStartDate = new Date(sLatestReadingDate);
            var oEndDate = new Date(sRetirementDate);

            while (oStartDate <= oEndDate) {
                var formattedDate = oStartDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
                aDates.push(formattedDate);
                oStartDate.setFullYear(oStartDate.getFullYear() + iRange);
            }

            return aDates;

        },

        /**
         * Function to fetch to componenet type list
         */
        fnFetchComponentTypeList:function(){
            var that=this;
            var oModel=this.getView().getModel("mCMLModel");
            var _oi18n = this.getView().getModel("i18n").getResourceBundle();

            this.commonDataSource.getComponentTypePicklist(function(oResponse){
                if(oResponse && oResponse.value && oResponse.value.length>0) {
                    var picklistId=oResponse.value[0].ID;
                    if(picklistId) {
                        that.commonDataSource.getPicklistInfo(picklistId,function(oResponse){
                            try {
                                var aCompType = JSON.parse(oResponse.jsonData);

                                var aUniqueComponentType = [];
                                var oSeenComponentTypes = {};

                                aCompType.forEach(function (obj) {
                                    if (obj.componentType && !oSeenComponentTypes[obj.componentType]) {
                                        oSeenComponentTypes[obj.componentType] = true;
                                        aUniqueComponentType.push(obj);
                                    }
                                });
                                
                                aUniqueComponentType.sort(function (a, b) {
                                    if (a.componentType > b.componentType) {
                                        return 1;
                                    } else if (a.componentType < b.componentType) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                });
                                oModel.setProperty("/data/aAllComponentType",aCompType);
                                oModel.setProperty("/data/aUniqueComponentType",aUniqueComponentType);

                            } catch (oError) {
                                oModel.setProperty("/data/aAllComponentType", []);
                            }
                        },function(){
                            that.fnMessageShow("E",_oi18n.getText("asint.cml.message.001"))
                        })
                    }
                }
            },function(){
                that.fnMessageShow("E",_oi18n.getText("asint.cml.message.001"))
            })
        },

        /**
         * Function to load feature flag config
         * @param {Function} fnCallback
         */
        fnLoadFeatureFlagConfig: function (fnCallback) {
            var mCMLModel = this.getView().getModel("mCMLModel");
            var isFeatureFlagLoaded = mCMLModel.getProperty("/metaData/featureFlag/isLoaded");
            var oFeatureFlag = mCMLModel.getProperty("/metaData/featureFlag");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            if(!isFeatureFlagLoaded) {
                this.commonDataSource.fetchFeatureFlag(function(oConfig) {
                    Object.keys(oFeatureFlag).forEach(function(sKey) {
                        if(Object.prototype.hasOwnProperty.call(oConfig, sKey)) {
                            oFeatureFlag[sKey] = oConfig[sKey].objectValue;
                        }
                    });
                    mCMLModel.setProperty("/metaData/featureFlag", oFeatureFlag);
                    mCMLModel.setProperty("/metaData/featureFlag/isLoaded", true);
                    if(fnCallback) {
                        fnCallback();
                    }
                }, function () {
                    sap.m.MessageToast.show(oI18n.getText("asint.cml.message.002"));
                });
            }
        },

        /**
         * Function to handle value helps
         * @param {Object} oEvent 
         * @param {String} sObjectType 
         */
        fnHandleGenericValueHelp : function(oEvent, sObjectType, sMode, sHeaderText) {

            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var oModel = this.getView().getModel("mCMLModel");

            var oDialogData = {
                "dialogHeader" : oI18n.getText(sHeaderText),
                "objectType":sObjectType,
                "mode":sMode,
                "path":"/data/listPageForCmlOv/filters/" + sObjectType,
            };

            oModel.setProperty("/data/genericValueHelp", oDialogData);
            that.fnOpenGenericValueHelpFilters(sObjectType, sMode);
        },

        /**
         * Function to open generic value help dialog
         * @param {String} sObjectType 
         */
        fnOpenGenericValueHelpFilters: function (sObjectType, sMode) {
            if (!this._oCMLGenValueHelpDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.asint.ais.mi.cml.view.fragment.GenericValuehelpdialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oCMLGenValueHelpDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    this.fnGenValueHelpApplyFilter(sObjectType, sMode);
                    oDialog.open();
                    this.onUpdateFinish();
                }.bind(this));
            } else {
                this.fnGenValueHelpApplyFilter(sObjectType, sMode);
                this._oCMLGenValueHelpDialog.open();
                this.onUpdateFinish();
            }
        },

        /**
         * Function to apply filter
         * @param {String} sObjectType 
         */
        fnGenValueHelpApplyFilter: function (sObjectType, sMode) {
            var oTable = "";
            var oBinding = "";
            var oFilter = [];
            oTable = this.byId("CmlvalueHelpTable");
            oTable.setMode(sMode);
            oBinding = oTable.getBinding("items");
            oFilter = new Filter([
                new Filter("objectType", FilterOperator.EQ, sObjectType),
                new Filter("language", FilterOperator.EQ, "EN")
            ], true);
            oBinding.filter(oFilter);
        },

        /**
         * Function to search in generic value help dialog
         * @param {Object} oEvent 
         */
        onValueHelpSearch: function (oEvent) {
            var oModel = this.getView().getModel("mCMLModel");
            var sQuery = oEvent.getSource().getValue();
            
            if(sQuery){
                sQuery = sQuery.trim();
            }
            var objectType = oModel.getProperty("/data/genericValueHelp/objectType");
            var aFilters = [];
            var oObjectTypeFilter;
            oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, objectType);
            if (sQuery && sQuery.length > 0) {
                var aSearchFilters = [
                    new Filter({path:"name", operator:FilterOperator.Contains,value1:sQuery,caseSensitive: false}),
                    new Filter({path:"description", operator:FilterOperator.Contains,value1:sQuery,caseSensitive: false}),
                ];
                var oSearchFilter = new sap.ui.model.Filter({
                    filters: aSearchFilters,
                    and: false
                });
                aFilters.push(new sap.ui.model.Filter({
                    filters: [oObjectTypeFilter, oSearchFilter],
                    and: true
                }));
            } else {
                aFilters.push(oObjectTypeFilter);
            }
            aFilters.push(new sap.ui.model.Filter("language", sap.ui.model.FilterOperator.EQ, "EN"));
            var oTable = this.byId("CmlvalueHelpTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        /**
         * Function to confirm convert notification
         */
        onSaveValueHelpDialog: function () {
            
            var that = this;
            var oModel = that.getView().getModel("mCMLModel");
            var oDialogData = oModel.getProperty("/data/genericValueHelp");
            var sPath = oDialogData.path;
            var oTable = that.byId("CmlvalueHelpTable");
            var selectedItems = [];

            if (oTable) {
                var aSelected  = oTable.getSelectedItems();
                aSelected.forEach(function(oItem){
                    var oRow = oItem.getBindingContext("valueHelpService").getObject();
                    var oTokenObj = {
                        "key":oRow.name,
                        "text":oRow.name
                    }
                    if(oDialogData.isKeySave){
                        oTokenObj.key = oRow.name;
                    }
                    selectedItems.push(oTokenObj);
                })
            }
            if(oModel){
                oModel.setProperty(sPath, selectedItems);
            }
            var oSearchField = this.byId("idGenericSearchFieldCml");
            if (oSearchField) {
                oSearchField.setValue("");
            }
            this._oCMLGenValueHelpDialog.close();
        },

        /**
         * Function to close valueHelp Dialog
         */
        onCloseGenericDialog: function () {
            if (this._oCMLGenValueHelpDialog) {
                var oTable = this.byId("CmlvalueHelpTable");
                oTable.removeSelections();
                var oSearchField = this.byId("idGenericSearchFieldCml");
                if (oSearchField) {
                    oSearchField.setValue("");
                }
                this._oCMLGenValueHelpDialog.close();
            }
        },

        /**
         * Function that trigers when an toekn is removed
         * @param {Object} oEvent 
         */
        onRemoveMultiInputToken: function (oEvent) {
            var that = this;
            var mCMLModel = that.getView().getModel("mCMLModel");
            var removedItems = oEvent.getParameter("removedTokens");
            if (removedItems.length > 0) {
                removedItems.forEach(function (removedItem) {
                    var oBindingContext = removedItem.getBindingContext("mCMLModel");
                    if (oBindingContext) {
                        var sPath = removedItem.getBindingContext("mCMLModel").getPath();
                        var modelPath = sPath.split("/");
                        modelPath.pop();
                        modelPath = modelPath.join("/");
                        var modelList = mCMLModel.getProperty(modelPath);
                        var iIndex = modelList.findIndex(function (item) {
                            return item === oBindingContext.getObject();
                        });
                        if (iIndex !== -1) {
                            modelList.splice(iIndex, 1);
                            mCMLModel.setProperty(modelPath, modelList);
                        }
                    }
                })
            }
        },

        /**
         * Function that updates the table selection
         * @param {Object} oEvent 
         */
        onUpdateFinish: function () {
            var that = this;
            var oTable = that.byId("CmlvalueHelpTable")
            if(oTable){
                var selectionMode = oTable.getMode();
                var valueHelpSelectedItems = oTable.getItems();
                var selectedItems = [];
                var oModel = that.getView().getModel("mCMLModel");
                var sPath = oModel.getProperty("/data/genericValueHelp/path");
                if (selectionMode === "MultiSelect") {
                    if (valueHelpSelectedItems.length > 0) {
                        selectedItems = oModel.getProperty(sPath);
                        if (selectedItems && selectedItems.length > 0) {
                            var aSelected = selectedItems.map(function (oItem) {
                                return oItem.key.trim();
                            });
                            valueHelpSelectedItems.forEach(function (item) {
                                var oContext = item.getBindingContext("valueHelpService").getProperty("name");
                                if (aSelected.includes(oContext)) {
                                    item.setSelected(true);
                                } else {
                                    item.setSelected(false);
                                }
                            });
                        } else {
                            valueHelpSelectedItems.forEach(function (item) {
                                item.setSelected(false);
                            });
                        }
                    }
                }
            }
        },

    });
}
);
