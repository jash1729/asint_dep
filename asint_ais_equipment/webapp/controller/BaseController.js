sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/helper/Equipment",
    "sap/ui/core/routing/History",
    "com/asint/ais/mi/equipment/model/formatter",
    "sap/m/MessageBox",
    "com/asint/ais/library/utils/ExternalIdHelper",
    "com/asint/ais/library/utils/ObjectTemplateValueHelp",
    "com/asint/ais/library/utils/Tableconstructor",
    "com/asint/ais/library/utils/TechnicalObjectValueHelp",
    "com/asint/ais/library/datasource/asint/APM",
    "com/asint/ais/library/utils/ValueHelpFilter",
    "sap/base/Log",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/utils/EnumValueHelp",
    "com/asint/ais/library/datasource/asint/WorkBench",
    "com/asint/ais/library/datasource/asint/AssetStrategy"
],
function (Utility, EquipmentDatasource, EquipmentHelper, History, formatter, MessageBox, ExternalIdHelper, ObjectTemplateValueHelp, Helper, TechnicalObjectValueHelp, APMDataSource, ValueHelpFilter, Logger, Fragment, Filter, FilterOperator, Common,EnumValueHelp, WorkBench, AssetStrategyDatasource) {
    "use strict";

    return Utility.extend("com.asint.ais.mi.equipment.controller.BaseController", {

        formatter: new formatter(),

        dataSource: new EquipmentDatasource(window.com.asint.ais.mi.equipment.baseURI),

        ExternalIdHelper: new ExternalIdHelper(window.com.asint.ais.mi.equipment.baseURI),

        objectTemplateValueHelp: new ObjectTemplateValueHelp(window.com.asint.ais.mi.equipment.baseURI),

        technicalObjectValueHelp: new TechnicalObjectValueHelp(window.com.asint.ais.mi.equipment.baseURI),

        helper: new EquipmentHelper(),

        tableHelper: new Helper(window.com.asint.ais.mi.equipment.baseURI),

        APMDataSource: new APMDataSource(window.com.asint.ais.mi.equipment.baseURI),

        commonDataSource: new Common(window.com.asint.ais.mi.equipment.baseURI),

        workBench: new WorkBench(window.com.asint.ais.mi.equipment.baseURI),

        valueHelpFilter: new ValueHelpFilter(window.com.asint.ais.mi.equipment.baseURI),

        enumValueHelp: new EnumValueHelp(window.com.asint.ais.mi.equipment.baseURI),

        ASDdataSource: new AssetStrategyDatasource(window.com.asint.ais.mi.equipment.baseURI),

        _oLogger: Logger.getLogger("EquipmentBaseController"),

        NAVIGATION: {
            "LOCATION_DETAIL": "functionallocation-manage&/location/{functionalLocationId}/detail",
            "EQUIPMENT_DETAILS": "equipment-manage&/equipment/{equipmentId}/detail",
            "INSPECTION_DETAIL": "idms-manage&/detail/{inspectionId}",
            "INSPECTION_FINDINGS_DETAIL":"idms-manage&/findingDetail/{findingId}",
            "EQUIPMENT_DETAIL": "TechnicalObject-Display&/TechnicalObjectsList(number='{number}',SSID='{SSID}',type='{type}')",
            "ASSET_STRATEGY_DETAIL": "assetstrategydevelopment-manage&/detail/{assetStrategyId}",
            "INSPECTION_TEMPLATE_DETAIL": "idmstemp-manage&/detail/{inspectionTemplateId}",
            "RECOMMENDATION_DETAIL": "recommendation-display&/{recommId}/{recoType}/{recommendationGuid}",
            "RWB_DETAIL_AIS":"recommendationworkbenchplus-manage&/detail/{recommId}/AIS/{recommId}",
            "MAINTENANCE_ORDER_DETAIL": "workorders-manage&/detail/{maintenanceId}",
            "NOTIFICATION_DETAIL": "notifications-manage&/detail/{notificationId}",
            "TASK_DETAIL": "taskmanagement-manage&/detail/{taskId}",
            "RECOMMENDATION_WORKBENCH_DETAIL": "recommendationworkbenchplus-manage&/detail/{recommendationId}/{recoType}/{recoGuid}",
            "CML_DETAIL":"cml-manage&/detail/equipment/{equipmentId}/cml",
            "RCM_DETAIL": "rcm-manage&/detail/{sRCMId}",
            "RCA_DETAIL": "rca-manage&/detail/{assessmentId}",
            "PROCESS_GROUPS_DETAIL" : "functionallocation-manage&/stream/{streamId}/detail",
            "ASSESSMENT_TEMPLATE_DETAIL" : "assessmenttemp-manage&/detail/{assessmentTemplateId}",
            "MAINTENANCEPLAN_DETAIL": "maintplan-manage&/detail/{maintPlanId}",
            
        },

        /**
        * Function to get router object
        * 
        * @returns {Object} router
        */
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * Function to do navigation inside FLP shell
         *  
         * @returns {Object} router
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
         * Function to fetch user roles
         */
        getUserRoles: function () {
            var that = this;
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            this.commonDataSource.getRoles("EQUI", function (oRolesRec) {
                if (mEquipmentList !== undefined) {
                    mEquipmentList.setProperty("/data/userRoles", oRolesRec);
                }
                if (mEquipmentDetail !== undefined) {
                    mEquipmentDetail.setProperty("/data/userRoles", oRolesRec);
                }
            }, function () {
                that.fnMessageShow("E", "Failed to fetch user roles");
            })
        },

        /**
        * @description Function to Display Message
        * @params	sMsgType		{String}	Message type any 1 from ["S", "E", "W", "I", "C", "T"]
        *			sMessageText	{String}	Message to be displayed
        *			sMessageDetail	{String}	Message Detail if required
        *			fnCallback		{Function}	Callback, that will be called after closing Messagebox
        * @since 1902
        * @author sarath.merangi@asint.net
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
                                 * Callback function on close
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
        * Function to set the asset hirarchy view.
        */
        fnFetchAssetHierarchy: function () {
            var that = this;
            var sEmail = this.getLoggedInUserMail();
            var mEquipmentList = this.getView().getModel("mEquipmentList");
            var bFetched = mEquipmentList.getProperty("/data/assetHierarchy/fetched");
            var aProcessedNodes = [];

            if (!bFetched) {
                this.dataSource.getEquipmentHierarchy(sEmail, function (oResponse) {
                    var oResponse1 = {
                        childLocations: oResponse.functionalLocations
                    };

                    /**
                     * Fucntion to set heirarchy data to a renderable format.
                     * 
                     * @param {Object} oTechnicalObject 
                     * @param {String} sTechnicalObjectType 
                     * @param {Array} aNodes 
                     * @param {Array} aLines 
                     * @returns Object
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
                            var oTemp = {
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
                            };

                            if (oTechnicalObject.srcId === "BTP") { // BTP Asset - Blue
                                oTemp["status"] = "Information";
                            } else { // S4 Asset - Grey
                                oTemp["status"] = "Neutral";
                            }

                            if (!aProcessedNodes.includes(oTemp.id)) {
                                aProcessedNodes.push(oTemp.id);
                                aNodes.push(oTemp);
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

                    mEquipmentList.setProperty("/data/assetHierarchy", fnExpandHierarchy(oResponse1, "FLOC", [], []));

                }, function (oError) {
                    that._oLogger.error("An Error Occurred In getEquipmentHierarchy :", JSON.stringify(oError));
                    mEquipmentList.setProperty("/data/assetHierarchy", {
                        fetched: false,
                        lines: [],
                        nodes: []
                    });
                });
            }
        },

        /**
         * Simple ajax
         * Will remove this soon
         * 
         * @param {String} sUrl 
         * @param {String} sMethod 
         * @param {Object} oData 
         * @param {Function} rSuccess 
         * @param {Function} rError 
         */
        doAjax: function (sUrl, sMethod, oData, rSuccess, rError) {
            if (oData) {
                oData = JSON.stringify(oData);
            }
            var tempJsonModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(tempJsonModel, "tempJsonModel");
            tempJsonModel.loadData(sUrl, oData, true, sMethod, false, false, {
                "Content-Type": "application/json;charset=utf-8"
            });
            tempJsonModel.attachRequestCompleted(function (oEvent) {
                rSuccess(oEvent.getSource().getData());
            }.bind(rSuccess));
            tempJsonModel.attachRequestFailed(function (oEvent) {
                rError(oEvent);
            }.bind(rError));
        },

        // TODO: ObjHieLib - delete
        /**
         * Fetch Object Hierarchy based on user email
         */
        fnFetchAssetHierarchyDetail: function () {
            var that = this;
            var sEmail = this.getLoggedInUserMail();
            var mEquipment = this.getView().getModel("mEquipment");
            var bFetched = mEquipment.getProperty("/data/assetHierarchy/fetched");
            var mEquipmentDetailModel = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = "";

            if (mEquipmentDetailModel) {
                sEquipmentId = mEquipmentDetailModel.getProperty("/data/detail/ID");
            }

            if (!bFetched) {
                this.dataSource.getEquipmentHierarchy(sEmail, function (oResponse) {
                    var oResponse1 = {
                        childLocations: oResponse.functionalLocations
                    };

                    mEquipment.setProperty("/data/oResponse", oResponse1);
                    that.fnFormatHierarchyData(oResponse1, mEquipment, mEquipmentDetailModel, sEquipmentId);

                }, function (oError) {
                    that._oLogger.error("An Error Occurred In getEquipmentHierarchy :", JSON.stringify(oError));
                    mEquipment.setProperty("/data/isHierarchyAvailable", false);
                    mEquipment.setProperty("/data/currentAssetHierarchy", {});
                });
            } else {
                var oResponse1 = mEquipment.getProperty("/data/oResponse");
                that.fnFormatHierarchyData(oResponse1, mEquipment, mEquipmentDetailModel, sEquipmentId);
            }
        },

        //TODO: delete
        /**
         * 
         * @param {Object} oResponse1 - Hierarchy response
         * @param {Object} mEquipment - Hierarchy model
         * @param {Object} mEquipmentDetailModel - Detail page Model
         * @param {String} sEquipmentId - Current Asset of Equipment
         */
        fnFormatHierarchyData: function (oResponse1, mEquipment, mEquipmentDetailModel, sEquipmentId) {

            var that = this;
            var aCurrentAssetHierarchyNodes = [];
            var aCurrentAssetHierarchyLines = [];
            var aProcessedNodes = [];

            /**
                 * Fucntion to set heirarchy data to a renderable format.
                 * 
                 * @param {Object} oTechnicalObject 
                 * @param {String} sTechnicalObjectType 
                 * @param {Array} aNodes 
                 * @param {Array} aLines 
                 * @returns Object
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
                    var oTemp = {
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
                        ],
                        "isSelected": false,
                        "collapse": true
                    }

                    if (mEquipmentDetailModel) {
                        if (oTechnicalObject.srcId === "BTP") { // BTP Asset - Blue
                            oTemp["status"] = "Information";
                            if (sEquipmentId === oTechnicalObject.id) {
                                oTemp["isSelected"] = true;
                                oTemp["status"] = "Warning";
                            }
                        } else { // S4 Asset - Grey
                            oTemp["status"] = "Neutral";
                            if (sEquipmentId === oTechnicalObject.id) {
                                oTemp["isSelected"] = true;
                                oTemp["status"] = "Warning";
                            }
                        }
                    }

                    if (!aProcessedNodes.includes(oTemp.id)) {
                        aProcessedNodes.push(oTemp.id);
                        aNodes.push(oTemp);
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

            var oHierarchyData = fnExpandHierarchy(oResponse1, "EQUI", [], []);

            var oRoots = that.fnFormateParetChild(oHierarchyData.lines, sEquipmentId);

            oHierarchyData.lines.forEach(function (oLineItem) {
                if (oRoots.includes(oLineItem.to)) {
                    aCurrentAssetHierarchyLines.push(oLineItem);
                }
            });

            var aFilterTemp = oHierarchyData.lines.filter(function (oItem) {
                return oItem.from === sEquipmentId;
            });

            aCurrentAssetHierarchyLines = aCurrentAssetHierarchyLines.concat(aFilterTemp);

            var aTempId = [];

            aFilterTemp.forEach(function (oItem) {
                if (!aTempId.includes(oItem.to)) {
                    aTempId.push(oItem.to);
                }
            });

            oRoots = oRoots.concat(aTempId);

            oHierarchyData.nodes.forEach(function (oNodeItem) {
                if (oRoots.includes(oNodeItem.id)) {
                    aCurrentAssetHierarchyNodes.push(oNodeItem);
                }
            });

            if (aCurrentAssetHierarchyLines.length === 0 || aCurrentAssetHierarchyNodes.length === 0) {
                mEquipment.setProperty("/data/isHierarchyAvailable", false);
            } else {
                var oFinalCurrentAssetHierarchy = {
                    fetched: true,
                    lines: aCurrentAssetHierarchyLines,
                    nodes: aCurrentAssetHierarchyNodes
                }

                mEquipment.setProperty("/data/isHierarchyAvailable", true);
                mEquipment.setProperty("/data/currentAssetHierarchy", oFinalCurrentAssetHierarchy);
            }
            mEquipment.setProperty("/data/assetHierarchy", oHierarchyData);
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
         *  Function fetches equipment Category
         */
        fnGetEquipmentCategory: function (callback) {
            var that = this;
            this.dataSource.getEquipmentCategory(function (fnSuccess) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/equipmentCategoryArray", fnSuccess.value);
                if (callback) callback();
            }, function (oError) {
                if (callback) callback(callback);
                that._oLogger.error("An Error Occurred In getEquipmentCategory :", JSON.stringify(oError));
            });

        },

        /**
         * Function fetches equipment type
         */
        fnEquipmentTechnicalObjectType: function (callback) {
            var that = this;
            this.commonDataSource.getEquipmentFLOCConfigurationValueHelpBasedOnType("OBTP", function (oData) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/equipmentTypeArray", oData.value);
                if (callback) callback();
            }, function (oError) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/equipmentTypeArray", []);
                if (callback) callback();
                that._oLogger.error("An Error Occurred In getEquipmentType :", JSON.stringify(oError));
            });
        },

        /**
         * Function fetches equipment type
         */
        fnEquipmentAbcIndicator: function (callback) {
            var that = this;
            this.commonDataSource.getEquipmentFLOCConfigurationValueHelpBasedOnType("ABCIndicator", function (oData) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/abcIndicatorArray", oData.value);
                if (callback) callback();
            }, function (oError) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/abcIndicatorArray", []);
                if (callback) callback();
                that._oLogger.error("An Error Occurred In getEquipmentAbcIndicator :", JSON.stringify(oError));
            });
        },

        /**
        * Function fetches plant List
        */
        fnFlocPlantList: function (callback) {
            var that = this;
            this.commonDataSource.getEquipmentFLOCConfigurationValueHelpBasedOnType("PLMT", function (oData) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/plantList", oData.value);
                if (callback) callback();
            }, function (oError) {
                var oModel = that.getView().getModel("mEquipment");
                oModel.setProperty("/data/plantList", []);
                if (callback) callback();
                that._oLogger.error("An Error Occurred In getplantList :", JSON.stringify(oError));
            });
        },

        /**
         * Navigate to ASD Detail page
         * 
         * @param {String} sAssetStrategyId - Asset Strategy - Assessment ID
         */
        fnNavigateToAssetStrategyDetail: function (sAssetStrategyId) {
            var that = this;
            var sHashWithKeyword = this.NAVIGATION.ASSET_STRATEGY_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{assetStrategyId}", sAssetStrategyId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
            // this.navigate(this.NAVIGATION.ASSET_STRATEGY_DETAIL, {
            //     assetStrategyId: sAssetStrategyId
            // });
        },

        /**
         * Navigate to RCM Detail page
         * 
         * @param {String} sRCMId - RCM - Assessment ID
         */
        fnNavigateToRCMDetail: function (sRCMId) {
            
            var that = this;
            var sHashWithKeyword = this.NAVIGATION.RCM_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{sRCMId}", sRCMId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");

        },

        /**
         * Function to format PDFMake table
         * 
         * @param {Object} oPDFTable 
         * @returns {Object} oPDFTable
         */
        fnPDFTableFormatRow: function (oPDFTable) {

            /**
             * Function to generate blank array
             * 
             * @param {Number} iLength 
             * @return {Array} aBlank
             */
            var fnGenerateBlankArray = function (iLength) {
                var aBlank = [];
                for (var i = 0; i < iLength; i++) {
                    aBlank.push("\n");
                }
                return aBlank;
            }

            if (oPDFTable && oPDFTable.table && oPDFTable.table.body) {
                if (oPDFTable.table.body.length === 1) {
                    var iTableColumn = 0;

                    if (oPDFTable.table.widths) {
                        iTableColumn = oPDFTable.table.widths.length;
                    } else if (iTableColumn === 0) {
                        iTableColumn = oPDFTable.table.body[0].length;
                    }
                    if (iTableColumn > 0) {
                        oPDFTable.table.body.push(fnGenerateBlankArray(iTableColumn));
                    }
                }
            }

            return oPDFTable;

        },

        /**
         * 
         * @param {Array} aHierarchyData - Array of Hierarchy node line
         * @param {String} sEquipmentId - Selected Asset ID
         * @returns Current Asset with corresponding parent ID
         */
        fnFormateParetChild: function (aHierarchyData, sEquipmentId) {

            var aFinalId = [];
            /**
                 * Function to loop hierarchy data
                 * @param {String} sId 
                 * @param {String} sType 
                 * @returns 
                 */
            var aHierarchyDataLoop = function (sId, sType) {
                var oContext = aHierarchyData.find(function (oData) {
                    return oData[sType] === sId;
                });

                if (oContext) {
                    var sNodeId = "";
                    if (aFinalId.includes(oContext.to) === false) {
                        sNodeId = oContext.to;
                    } else {
                        sNodeId = oContext.from;
                    }
                    aFinalId.push(sNodeId);
                    return aHierarchyDataLoop(sNodeId, "to");
                } else {
                    return aFinalId;
                }
            }

            if (aFinalId.length === 0) {
                aFinalId.push(sEquipmentId);
                return aHierarchyDataLoop(sEquipmentId, "to");
            }

        },


        /**
         * Function to open generic value help dialog
         * @param {Object} oEvent 
         * @param {String} sObjectType 
         */
        openValueHelpDialog: function (oEvent, sObjectType, sMode, analyticsFilter) {
            var oModel = this.getView().getModel("mEquipmentList");
            if (oModel && analyticsFilter) {
                oModel.setProperty("/data/analytics/applyFilter", analyticsFilter);
            }
            if (!this._oValueHelpDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.asint.ais.mi.equipment.view.fragment.GenericValuehelpdialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oValueHelpDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    this._applyFilter(sObjectType, sMode);
                    oDialog.open();
                }.bind(this));
            } else {
                this._applyFilter(sObjectType, sMode);
                this._oValueHelpDialog.open();
            }
        },

        /**
         * Function to select value from dialog
         */
        selectVal: function () {
            var oModelList = this.getView().getModel("mEquipmentList");
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oTable = this.byId("valueHelpTable");
            var selectMode = oTable.getMode();
            var aSelectedItems = oTable.getSelectedItems();
            var allItem = [];
            var detailValuehelpVar = "";
            if(oModel){
                var checkSelectionVar=oModel.getProperty("/data/genericValueHelpVarBool");}

            if (oModel) {
                oModel.setProperty("/data/backUpVals", detailValuehelpVar);
            }
            if (aSelectedItems.length > 0 ) {
                aSelectedItems.forEach(function (item) {
                    var name = item.getBindingContext("valueHelpService").getProperty("name");
                    if (selectMode === "MultiSelect") {
                        allItem.push({
                            key: name,
                            text: name
                        })
                    } else {
                        detailValuehelpVar = name;
                    }

                })
                if (oModelList) {
                    oModelList.setProperty("/data/backupVals", allItem);
                }
                if (oModel) {
                    oModel.setProperty("/data/backUpVals", detailValuehelpVar);
                }
            }
            if(oModel){
                if(aSelectedItems.length==0 && checkSelectionVar){
                    oModel.setProperty("/data/backUpVals",oModel.getProperty("/data/genericValuehelpSelect"));
                }}

        },

        /**
         * Function to apply filter
         * @param {String} sObjectType 
         */
        _applyFilter: function (sObjectType, sMode) {
            var oTable = "";
            var oBinding = "";
            var oFilter = [];

            if (sObjectType != "PLPT") {
                this.fnGenericDialogTitle(sObjectType);
                oTable = this.byId("valueHelpTable");
                oTable.setMode(sMode);
                oBinding = oTable.getBinding("items");
                oFilter = new Filter([
                    new Filter("objectType", FilterOperator.EQ, sObjectType),
                    new Filter("language", FilterOperator.EQ, "EN")
                ], true);
                oBinding.filter(oFilter);
            }
            else if(sObjectType === "PLPT"){
                this.fnGenericDialogTitle(sObjectType);
                oTable = this.byId("valueHelpTable");
                oTable.setMode(sMode);
                oBinding = oTable.getBinding("items");
                oFilter = new Filter([
                    new Filter("objectType", FilterOperator.EQ, "PLPT"),
                    new Filter("language", FilterOperator.EQ, "EN")
                ], true);
                oBinding.filter(oFilter);
            }
        },

        /**
         * Function to add generic value add title
         * @param {Object} sObjectType 
         */
        fnGenericDialogTitle: function (sObjectType) {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oModelList = this.getView().getModel("mEquipmentList");
            var prevDialogTitle="";
            if (oModel) {
                oModel.setProperty("/data/genreicValueHelpType", sObjectType);
                prevDialogTitle = oModel.getProperty("/data/prevDialogTitle") ? oModel.getProperty("/data/prevDialogTitle") : "";
            }
            if (oModelList) {
                oModelList.setProperty("/data/genreicValueHelpType", sObjectType);
                prevDialogTitle = oModelList.getProperty("/data/prevDialogTitle") ? oModelList.getProperty("/data/prevDialogTitle") : "";
            }
                
            var sDialogTitleKey = "Select ";
            switch (sObjectType) {
            case "ABCIndicator":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.ABCIndicator.label");
                break;
            case "currencyCode":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.currency.label");
                break;
            case "CNCD":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.companyCode.label");
                break;
            case "PRGP":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.plannerGroup.label");
                break;
            case "CTPL":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.catalogProfile.label");
                break;
            case "PLMT":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.maintPlant.label");
                break;
            case "PLSC":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.plantSection.label");
                break;
            case "COST":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.costCenter.label");
                break;
            case "CNTR":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.country.label");
                break;
            case "BUSA":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.businessArea.label");
                break;
            case "WCTR":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.workCenter.label");
                break;
            case "EQUI":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.category.label");
                break;
            case "PLPT":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.planningPlant.label");
                break;
            case "OBTP":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.objectType.label");
                break;
            case "NTTP":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.detail.notification.form.type.text");
                break;
            case "NTPR":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.detail.notification.form.priority.text");
                break;
            case "MDA":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.mda.label");
                break;
            case "LOC":
                sDialogTitleKey += this._oi18n.getText("asint.equipment.field.location.label");
                break;
            default:
                sDialogTitleKey = "Valuehelp";
            }

            if (oModelList) {
                if (sDialogTitleKey != prevDialogTitle) {
                    oModelList.setProperty("/data/backupVals", []);
                    oModelList.setProperty("/data/prevDialogTitle", sDialogTitleKey);
                }
            }


            if (oModel) {
                if (sDialogTitleKey != prevDialogTitle) {
                    oModel.setProperty("/data/backUpVals", "");
                    oModel.setProperty("/data/genericValueHelpVarBool",false);
                    oModel.setProperty("/data/genericValuehelpSelect","");
                    oModel.setProperty("/data/prevDialogTitle", sDialogTitleKey);
                }
            }



            if (this._oValueHelpDialog) {
                this._oValueHelpDialog.setTitle(sDialogTitleKey);
            }
        },

        /**
         * Function to close generic valuehelp dialog
         */
        onCloseValueHelpDialog: function () {
            var oTable = this.byId("valueHelpTable");
            var oBinding = oTable.getBinding("items");
            var oFilter = new Filter("objectType", FilterOperator.EQ, "AsintAsint");
            oBinding.filter([oFilter]);

            var oSearchField = this.byId("idGenericSearchField");
            if (oSearchField) {
                oSearchField.setValue("");
            }

            this._oValueHelpDialog.close();

        },

        /**
         * Function to select value to set in input fields from generic value help dilog
         * @param {Object} oEvent 
         */
        onSelectValue: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oModelList = this.getView().getModel("mEquipmentList");
            var selectedItems = [];
            var oTable = oEvent.getSource();
            var selectMode = oTable.getMode();
            var oSelectedItem = oTable.getSelectedItems();
            if (oSelectedItem.length > 0) {
                oSelectedItem.forEach(function (item) {
                    var name = item.getBindingContext("valueHelpService").getProperty("name");
                    var sDescription = item.getBindingContext("valueHelpService").getProperty("description");
                    // var description = item.getBindingContext("valueHelpService").getProperty("description");
                    if (selectMode === "MultiSelect") {
                        selectedItems.push({
                            key: name,
                            text: name
                        })
                    }else if(oModel && oModel.getProperty("/data/genreicValueHelpType") == "NTTP"){
                        oModel.setProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/notitypeDesc",sDescription)
                        selectedItems = name;
                    }else if(oModel && oModel.getProperty("/data/genreicValueHelpType") == "NTPR"){
                        oModel.setProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/notiPriorityDesc",sDescription)
                        selectedItems = name;
                    }else if(oModel && oModel.getProperty("/data/genreicValueHelpType") == "MDA"){
                        oModel.setProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/mda",sDescription)
                        selectedItems = description;
                    }else {
                        selectedItems = name;
                    }

                })
            }
            // var oContext = oSelectedItem.getBindingContext("valueHelpService");
            // var name = oContext.getProperty("name"); 
            var genreicValueHelpType = "";

            if (oModel) {
                genreicValueHelpType = oModel.getProperty("/data/genreicValueHelpType");

                switch (genreicValueHelpType) {
                case "ABCIndicator":
                    oModel.setProperty("/data/detail/abcIndicator", selectedItems);
                    break;
                case "currencyCode":
                    oModel.setProperty("/data/detail/acquisitionCurrency", selectedItems);
                    break;
                case "CNCD":
                    oModel.setProperty("/data/detail/companyCode", selectedItems);
                    break;
                case "PRGP":
                    oModel.setProperty("/data/detail/plannerGroup", selectedItems);
                    break;
                case "CTPL":
                    oModel.setProperty("/data/detail/catalogProfile", selectedItems);
                    break;
                case "PLMT":
                    oModel.setProperty("/data/detail/maintenancePlant", selectedItems);
                    break;
                case "PLSC":
                    oModel.setProperty("/data/detail/plantSection", selectedItems);
                    break;
                case "COST":
                    oModel.setProperty("/data/detail/costCenter", selectedItems);
                    break;
                case "CNTR":
                    oModel.setProperty("/data/detail/manufacturerCountry", selectedItems);
                    break;
                case "BUSA":
                    oModel.setProperty("/data/detail/businessArea", selectedItems);
                    break;
                case "WCTR":
                    oModel.setProperty("/data/detail/maintenanceWorkCenter", selectedItems);
                    break;
                case "OBTP":
                    oModel.setProperty("/data/detail/objectType", selectedItems);
                    break;
                case "EQUI":
                    oModel.setProperty("/data/dialog/editHeader/category", selectedItems);
                    break;
                case "PLPT":
                    oModel.setProperty("/data/detail/planningPlant", selectedItems);
                    break;
                case "NTTP":
                    oModel.setProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/notitype", selectedItems);
                    break;
                case "NTPR":
                    oModel.setProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/notiPriority", selectedItems);
                    break;
                case "MDA":
                    oModel.setProperty("/data/tabs/maintenanceAndService/recommendations/selectedObj/mda", selectedItems);
                    break;
                default:
                    sDialogTitleKey = "Valuehelp";
                }
                oModel.setProperty("/data/genericValueHelpVarBool",false);
                oModel.setProperty("/data/genericValuehelpSelect","");

            }
            if (oModelList) {
                genreicValueHelpType = oModelList.getProperty("/data/genreicValueHelpType");
                var analyticsFilter = oModelList.getProperty("/data/analytics/applyFilter");
                switch (genreicValueHelpType) {
                case "ABCIndicator":
                    oModelList.setProperty("/data/abcIndicator", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiABCIndicator", selectedItems);
                    break;
                case "currencyCode":
                    oModelList.setProperty("/data/acquisitionCurrency", selectedItems);
                    break;
                case "CNCD":
                    oModelList.setProperty("/data/companyCode", selectedItems);
                    break;
                case "PRGP":
                    oModelList.setProperty("/data/plannerGroup", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiPlannerGroup", selectedItems);
                    break;
                case "CTPL":
                    oModelList.setProperty("/data/catalogProfile", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiCatalogProfile", selectedItems);
                    break;
                case "PLMT":
                    if (analyticsFilter) {
                        oModelList.setProperty("/data/analytics/mainPlant", selectedItems);
                    }else{
                        oModelList.setProperty("/data/maintenancePlant", selectedItems);
                        this.fnFireMultiInputTokenUpdateManually("idEQUIMultiMaintPlant", selectedItems);
                    }
                    break;
                case "PLSC":
                    oModelList.setProperty("/data/plantSection", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiPlantSection", selectedItems);
                    break;
                case "COST":
                    oModelList.setProperty("/data/costCenter", selectedItems);
                    break;
                case "CNTR":
                    oModelList.setProperty("/data/manufacturerCountry", selectedItems);
                    break;
                case "BUSA":
                    oModelList.setProperty("/data/businessArea", selectedItems);
                    break;
                case "WCTR":
                    oModelList.setProperty("/data/maintenanceWorkCenter", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiMaintenanceWorkCenter", selectedItems);
                    break;
                case "OBTP":
                    oModelList.setProperty("/data/objectType", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiObjectType", selectedItems);
                    break;
                case "EQUI":
                    oModelList.setProperty("/data/category", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiCategory", selectedItems);
                    break;
                case "PLPT":
                    if (analyticsFilter) {
                        oModelList.setProperty("/data/analytics/planningPlant", selectedItems);
                    }else{
                        oModelList.setProperty("/data/planningPlant", selectedItems);
                        this.fnFireMultiInputTokenUpdateManually("idEQUIMultiPlanningPlant", selectedItems);
                    }
                    break;
                case "MDA":
                    if (analyticsFilter) {
                        oModelList.setProperty("/data/analytics/mda", selectedItems);
                    }else{
                        oModelList.setProperty("/data/mda", selectedItems);
                        this.fnFireMultiInputTokenUpdateManually("idEQUIMultiMda", selectedItems);
                    }
                    break;
                case "LOC":
                    oModelList.setProperty("/data/location", selectedItems);
                    this.fnFireMultiInputTokenUpdateManually("idEQUIMultiLocation", selectedItems);
                    break;
                default:
                    sDialogTitleKey = "Valuehelp";
                }
            }

            // oTable.removeSelections();
            // this.onCloseValueHelpDialog();


        },

        /**
         * Function that trigers when an toekn is removed
         * @param {Object} oEvent 
         */
        onRemoveToken: function (oEvent) {
            var that = this;
            var mEquipmentList = that.getView().getModel("mEquipmentList");
            var removedItems = oEvent.getParameter("removedTokens");
            if (removedItems.length > 0) {
                removedItems.forEach(function (removedItem) {
                    var oBindingContext = removedItem.getBindingContext("mEquipmentList");
                    if (oBindingContext) {
                        var sPath = removedItem.getBindingContext("mEquipmentList").getPath();
                        var modelPath = sPath.split("/");
                        modelPath.pop();
                        modelPath = modelPath.join("/");
                        var modelList = mEquipmentList.getProperty(modelPath);
                        var iIndex = modelList.findIndex(function (item) {
                            return item === oBindingContext.getObject();
                        });
                        if (iIndex !== -1) {
                            modelList.splice(iIndex, 1);
                            mEquipmentList.setProperty(modelPath, modelList);
                        }
                    }
                })
            }
        },

        /**
         * Function that updates the table selection
         * @param {Object} oEvent 
         */
        onUpdateFinish: function (oEvent) {
            var that = this;
            var selectionMode = oEvent.getSource().getMode();
            var valueHelpSelectedItems="";
            var selectedItems = [];
            var genreicValueHelpType=""
            if (selectionMode === "MultiSelect") {
                valueHelpSelectedItems = oEvent.getSource().getItems();
                var mEquipmentList = that.getView().getModel("mEquipmentList");
                selectedItems = [];
                if (valueHelpSelectedItems.length > 0) {
                    genreicValueHelpType = mEquipmentList.getProperty("/data/genreicValueHelpType");
                    var analyticsFilter = mEquipmentList.getProperty("/data/analytics/applyFilter");
                    switch (genreicValueHelpType) {
                    case "ABCIndicator":
                        selectedItems = mEquipmentList.getProperty("/data/abcIndicator");
                        break;
                    case "currencyCode":
                        selectedItems = mEquipmentList.getProperty("/data/acquisitionCurrency");
                        break;
                    case "CNCD":
                        selectedItems = mEquipmentList.getProperty("/data/companyCode");
                        break;
                    case "PRGP":
                        selectedItems = mEquipmentList.getProperty("/data/plannerGroup");
                        break;
                    case "CTPL":
                        selectedItems = mEquipmentList.getProperty("/data/catalogProfile");
                        break;
                    case "PLMT":
                        selectedItems = mEquipmentList.getProperty("/data/maintenancePlant");
                        if (analyticsFilter) {
                            selectedItems = mEquipmentList.getProperty("/data/analytics/mainPlant");
                        }
                        break;
                    case "PLSC":
                        selectedItems = mEquipmentList.getProperty("/data/plantSection");
                        break;
                    case "COST":
                        selectedItems = mEquipmentList.getProperty("/data/costCenter");
                        break;
                    case "CNTR":
                        selectedItems = mEquipmentList.getProperty("/data/manufacturerCountry");
                        break;
                    case "BUSA":
                        selectedItems = mEquipmentList.getProperty("/data/businessArea");
                        break;
                    case "WCTR":
                        selectedItems = mEquipmentList.getProperty("/data/maintenanceWorkCenter");
                        break;
                    case "OBTP":
                        selectedItems = mEquipmentList.getProperty("/data/objectType");
                        break;
                    case "EQUI":
                        selectedItems = mEquipmentList.getProperty("/data/category");
                        break;
                    case "PLPT":
                        selectedItems = mEquipmentList.getProperty("/data/planningPlant");
                        if (analyticsFilter) {
                            selectedItems = mEquipmentList.getProperty("/data/analytics/planningPlant");
                        }
                        break;
                    case "LOC":
                        selectedItems = mEquipmentList.getProperty("/data/location");
                        break;
                    default:
                        selectedItems = [];
                    }
                    if (selectedItems && selectedItems.length > 0) {
                        var aSelected = selectedItems.map(function (oItem) {
                            return oItem.key;
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
                that.selectVal();
            }
            else {
                valueHelpSelectedItems = oEvent.getSource().getItems();
                var oModel = that.getView().getModel("mEquipmentDetail");
                selectedItems = [];
                if (valueHelpSelectedItems.length > 0) {
                    genreicValueHelpType = oModel.getProperty("/data/genreicValueHelpType");
                    switch (genreicValueHelpType) {
                    case "ABCIndicator":
                        selectedItems = oModel.getProperty("/data/detail/abcIndicator");
                        break;
                    case "currencyCode":
                        selectedItems = oModel.getProperty("/data/detail/acquisitionCurrency");
                        break;
                    case "CNCD":
                        selectedItems = oModel.getProperty("/data/detail/companyCode");
                        break;
                    case "PRGP":
                        selectedItems = oModel.getProperty("/data/detail/plannerGroup");
                        break;
                    case "CTPL":
                        selectedItems = oModel.getProperty("/data/detail/catalogProfile");
                        break;
                    case "PLMT":
                        selectedItems = oModel.getProperty("/data/detail/maintenancePlant");
                        break;
                    case "PLSC":
                        selectedItems = oModel.getProperty("/data/detail/plantSection");
                        break;
                    case "COST":
                        selectedItems = oModel.getProperty("/data/detail/costCenter");
                        break;
                    case "CNTR":
                        selectedItems = oModel.getProperty("/data/detail/manufacturerCountry");
                        break;
                    case "BUSA":
                        selectedItems = oModel.getProperty("/data/detail/businessArea");
                        break;
                    case "WCTR":
                        selectedItems = oModel.getProperty("/data/detail/maintenanceWorkCenter");
                        break;
                    case "OBTP":
                        selectedItems = oModel.getProperty("/data/detail/objectType");
                        break;
                    case "EQUI":
                        selectedItems = oModel.getProperty("/data/detail/category");
                        break;
                    case "PLPT":
                        selectedItems = oModel.getProperty("/data/detail/planningPlant");
                        break;
                    case "NTTP":
                        selectedItems = oModel.getProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/notitype");
                        break;
                    case "NTPR":
                        selectedItems = oModel.getProperty("/data/tabs/maintenanceservice/recommendations/selectedObj/notiPriority");
                        break;
                    default:
                        selectedItems = [];
                    }
                    if (selectedItems && selectedItems.length > 0) {
                        var itemFound=false;
                        valueHelpSelectedItems.forEach(function (item) {
                            var oContext = item.getBindingContext("valueHelpService").getProperty("name");
                            if (oContext === selectedItems) {
                                item.setSelected(true);
                                itemFound = true; // Set flag to true if the selected item is found
                            } else {
                                item.setSelected(false);
                            }
                        });
                        
                        // If the selected item is not found, update the model properties
                        if (!itemFound) {
                            oModel.setProperty("/data/genericValuehelpSelect", selectedItems);
                            oModel.setProperty("/data/genericValueHelpVarBool", true);
                        }
                    } else {
                        valueHelpSelectedItems.forEach(function (item) {
                            item.setSelected(false);
                        });
                    }
                }
                that.selectVal();
            }
        },

        /**
         * Function to search in generic value help dialog
         * @param {Object} oEvent 
         */
        onValueHelpSearch: function (oEvent) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oModelList = this.getView().getModel("mEquipmentList");
            var genreicValueHelpType = "";
            if (oModel) {
                genreicValueHelpType = oModel.getProperty("/data/genreicValueHelpType");
            }
            if (oModelList) {
                genreicValueHelpType = oModelList.getProperty("/data/genreicValueHelpType");
            }

            var sQuery = oEvent.getParameter("query");


            var aFilters = [];

            // Add the object type filter
            var oObjectTypeFilter;
            switch (genreicValueHelpType) {
            case "currencyCode":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "currencyCode");
                break;
            case "ABCIndicator":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "ABCIndicator");
                break;
            case "PRGP":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "PRGP");
                break;
            case "CTPL":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "CTPL");
                break;
            case "PLMT":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "PLMT");
                break;
            case "PLSC":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "PLSC");
                break;
            case "COST":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "COST");
                break;
            case "CNTR":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "CNTR");
                break;
            case "BUSA":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "BUSA");
                break;
            case "WCTR":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "WCTR");
                break;
            case "EQUI":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "EQUI");
                break;
            case "PLPT":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "PLPT");
                break;
            case "OBTP":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "OBTP");
                break;
            case "NTTP":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "NTTP");
                break;
            case "NTPR":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "NTPR");
                break;
            case "LOC":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.EQ, "LOC");
                break;
            case "MDA":
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "MDA");
                break;
            default:
                oObjectTypeFilter = new sap.ui.model.Filter("objectType", sap.ui.model.FilterOperator.Contains, "CNCD");
            }

            // Construct search filters
            if (sQuery && sQuery.length > 0) {
                var aSearchFilters = [
                    new Filter({ path: "name", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
                    new Filter({ path: "description", operator: FilterOperator.Contains, value1: sQuery, caseSensitive: false }),
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

            var oTable = this.byId("valueHelpTable");
            var oBinding = oTable.getBinding("items");

            oBinding.filter(aFilters);
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
         * Function to close generic dialog
         */
        onCloseGenericDialog: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oModelList = this.getView().getModel("mEquipmentList");
            if (oModelList) {
                var oBackup = oModelList.getProperty("/data/backupVals");
            }
            if (oModel) {
                var oBackupDetailVal = oModel.getProperty("/data/backUpVals");
            }
            var genreicValueHelpType = "";
            var oTable = this.byId("valueHelpTable");
            var oBinding = oTable.getBinding("items");

            if (that._oValueHelpDialog) {
                if (oModel) {
                    genreicValueHelpType = oModel.getProperty("/data/genreicValueHelpType");
                    switch (genreicValueHelpType) {
                    case "ABCIndicator":
                        oModel.setProperty("/data/detail/abcIndicator", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "currencyCode":
                        oModel.setProperty("/data/detail/acquisitionCurrency", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "CNCD":
                        oModel.setProperty("/data/detail/companyCode", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "PRGP":
                        oModel.setProperty("/data/detail/plannerGroup", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "CTPL":
                        oModel.setProperty("/data/detail/catalogProfile", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "PLMT":
                        oModel.setProperty("/data/detail/maintenancePlant", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "PLSC":
                        oModel.setProperty("/data/detail/plantSection", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "COST":
                        oModel.setProperty("/data/detail/costCenter", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "CNTR":
                        oModel.setProperty("/data/detail/manufacturerCountry", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "BUSA":
                        oModel.setProperty("/data/detail/businessArea", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "WCTR":
                        oModel.setProperty("/data/detail/maintenanceWorkCenter", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "OBTP":
                        oModel.setProperty("/data/detail/objectType", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "EQUI":
                        oModel.setProperty("/data/dialog/editHeader/category", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    case "PLPT":
                        oModel.setProperty("/data/detail/planningPlant", JSON.parse(JSON.stringify(oBackupDetailVal)));
                        break;
                    default:
                    }
                }

                if (oModelList) {
                    genreicValueHelpType = oModelList.getProperty("/data/genreicValueHelpType");
                    var analyticsFilter = oModelList.getProperty("/data/analytics/applyFilter");
                    switch (genreicValueHelpType) {
                    case "ABCIndicator":
                        oModelList.setProperty("/data/abcIndicator", JSON.parse(JSON.stringify(oBackup)));
                        that.fnFireMultiInputTokenUpdateManually("idEQUIMultiABCIndicator", oModelList.getProperty("/data/abcIndicator"));
                        break;
                    case "currencyCode":
                        oModelList.setProperty("/data/acquisitionCurrency", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "CNCD":
                        oModelList.setProperty("/data/companyCode", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "PRGP":
                        oModelList.setProperty("/data/plannerGroup", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "CTPL":
                        oModelList.setProperty("/data/catalogProfile", JSON.parse(JSON.stringify(oBackup)));
                        that.fnFireMultiInputTokenUpdateManually("idEQUIMultiCatalogProfile", oModelList.getProperty("/data/catalogProfile"));
                        break;
                    case "PLMT":
                        if (analyticsFilter) {
                            oModelList.setProperty("/data/analytics/mainPlant", JSON.parse(JSON.stringify(oBackup)));
                        }else{
                            oModelList.setProperty("/data/maintenancePlant", JSON.parse(JSON.stringify(oBackup)));
                            that.fnFireMultiInputTokenUpdateManually("idEQUIMultiMaintPlant", oModelList.getProperty("/data/maintenancePlant"));
                        }
                        break;
                    case "PLSC":
                        oModelList.setProperty("/data/plantSection", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "COST":
                        oModelList.setProperty("/data/costCenter", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "CNTR":
                        oModelList.setProperty("/data/manufacturerCountry", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "BUSA":
                        oModelList.setProperty("/data/businessArea", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "WCTR":
                        oModelList.setProperty("/data/maintenanceWorkCenter", JSON.parse(JSON.stringify(oBackup)));
                        break;
                    case "OBTP":
                        oModelList.setProperty("/data/objectType", JSON.parse(JSON.stringify(oBackup)));
                        that.fnFireMultiInputTokenUpdateManually("idEQUIMultiObjectType", oModelList.getProperty("/data/objectType"));
                        break;
                    case "EQUI":
                        oModelList.setProperty("/data/category", JSON.parse(JSON.stringify(oBackup)));
                        that.fnFireMultiInputTokenUpdateManually("idEQUIMultiCategory", oModelList.getProperty("/data/category"));
                        break;
                    case "PLPT":
                        if (analyticsFilter) {
                            oModelList.setProperty("/data/analytics/planningPlant", JSON.parse(JSON.stringify(oBackup)));
                        }else{
                            oModelList.setProperty("/data/planningPlant", JSON.parse(JSON.stringify(oBackup)));
                            that.fnFireMultiInputTokenUpdateManually("idEQUIMultiPlanningPlant", oModelList.getProperty("/data/planningPlant"));
                        }
                        break;
                    case "MDA":
                        if (analyticsFilter) {
                            oModelList.setProperty("/data/analytics/mda", JSON.parse(JSON.stringify(oBackup)));
                        }else{
                            oModelList.setProperty("/data/mda", JSON.parse(JSON.stringify(oBackup)));
                            that.fnFireMultiInputTokenUpdateManually("idEQUIMultiMda", oModelList.getProperty("/data/mda"));
                        }
                        break;
                    default:
                    }
                }
                var oFilter = new Filter("objectType", FilterOperator.EQ, "AsintAsint");
                oBinding.filter([oFilter]);

                var oSearchField = this.byId("idGenericSearchField");
                if (oSearchField) {
                    oSearchField.setValue("");
                }

                that._oValueHelpDialog.close();
            }
        },


        /**
         * 
         * @param {String} sFragmentId - Fragment Id
         * @param {String} sControlId - Controller Id
         */
        fnResetSearch: function (sFragmentId, sControlId) {
            var oTable = Fragment.byId(sFragmentId, sControlId);
            if (oTable) {
                var oToolbar = oTable.getAggregation("headerToolbar").getContent();
                var oSearch;
                if (oToolbar && oToolbar.length > 0) {
                    oSearch = oToolbar[2];
                }
                if (oSearch) {
                    oSearch.setValue("");
                    var oBinding = oTable.getBinding("items");
                    if (oBinding) {
                        oBinding.filter([]);
                    }
                }
            }
        },

        /**
         * Function to fetch equipment enums
         */
        fnFetchEquipmentEnums : function(fnCallBack){
            var that = this;
            var oModel = this.getView().getModel("mEquipment");
            var iProgress = 0;
            var iTotal = 4;
            
            /**
             * Local callback function
             */
            var fnLocalCallBack = function(){
                oModel.setProperty("/metadata/ValueHelps/isEnumsLoaded", true);
                if(fnCallBack){
                    fnCallBack();
                }
            };

            that.dataSource.getEquipmentUserStatusEnum(function(oData){
                oModel.setProperty("/metadata/userStatus", oData.details);
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }
            }, function(){
                oModel.setProperty("/metadata/userStatus", []);
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }
            });

            that.dataSource.getEquipmentSystemStatusEnum(function(oData){
                oModel.setProperty("/metadata/systemStatus", oData.details);
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }
            }, function(){
                oModel.setProperty("/metadata/systemStatus", []);
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }
            });

            that.workBench.getMitigatedRiskEnum(function(oData){
                oModel.setProperty("/metadata/MitigatedRiskDropDown", oData.MitigateRiskBrpEvent);
                var aHCFilters = [];
                oData.MitigateRiskBrpEvent.forEach(function(oRisk){
                    if(oRisk && oRisk.risk && oRisk.risk.includes("HC")){
                        aHCFilters.push(oRisk);
                    }
                });
                oModel.setProperty("/metadata/MitigatedRiskDropDownHC", aHCFilters);
                // Filter  (Non-HC1 Risks)
                var aNonHCFilters = [];
                oData.MitigateRiskBrpEvent.forEach(function(oRisk){
                    if (oRisk && oRisk.risk && !oRisk.risk.includes("HC")) {
                        aNonHCFilters.push(oRisk);
                    }
                });
                oModel.setProperty("/metadata/MitigatedRiskDropDownNonHC", aNonHCFilters);
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }
            }, function(){
                oModel.setProperty("/metadata/MitigatedRiskDropDown", []);
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }
            });

            that.dataSource.getWorOrderPriorityByOrderType(function (oResponse) {
                var aTypeData = [];
                var oPriorityMap = {}; 
                var oActivityMap = {}; 
                oResponse.value.forEach(function (item) {
                    aTypeData.push({
                        name: item.name,
                        desc: item.description 
                    });
                    var aPriorities = item.to_maintenanceorderPriority.map(function (priorityItem) {
                        return {
                            name: priorityItem.MaintenanceOrderPriority.name,
                            desc: priorityItem.MaintenanceOrderPriority.description
                        };
                    });
                    var aActivities = item.to_maintenanceActivityType.map(function (activityItem) {
                        return {
                            name: activityItem.S4Master.name,
                            desc: activityItem.S4Master.description
                        };
                    });
                    oPriorityMap[item.name] = aPriorities;
                    oActivityMap[item.name] = aActivities;
                });       
                oModel.setProperty("/metadata/maintenanceOrderType", aTypeData);
                oModel.setProperty("/metadata/maintenanceOrderPriority", oPriorityMap);
                oModel.setProperty("/metadata/maintenanceOrderActivityType", oActivityMap);   
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }                                        
            }, function () {
                oModel.setProperty("/metadata/maintenanceOrderType", []);
                oModel.setProperty("/metadata/maintenanceOrderPriority", {});
                oModel.setProperty("/metadata/maintenanceOrderActivityType", {});   
                iProgress ++;
                if(iProgress == iTotal){
                    fnLocalCallBack();
                }          
            });

            
        },

        /**
        * Function that returns nearest s4 parent asset 
        * 
        * @returns {Object} S4Asset
        */
        fnGetNearestS4ParentObject: function () {
            var mEquipment = this.getView().getModel("mEquipment");
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTechnicalObject = mEquipmentDetail.getProperty("/data/detail");
            var oHierarchy = mEquipment.getProperty("/data/oResponse");
            var oAsset;
            /**
             * Function to parse hierarchy
             * 
             * @param {Object} oNode 
             * @param {Object} oS4Asset 
             * @param {String} sType 
            */
            var fnParseHierarchy = function (oNode, oS4Asset, sType) {
                if (oNode.srcId === "my401925") {
                    oS4Asset = oNode;
                }
                if (oNode.id === oTechnicalObject.ID) {
                    oAsset = {
                        id: oS4Asset.id,
                        name: oS4Asset.name,
                        desc: oS4Asset.to_description[0].shortDescription,
                        type: sType
                    };
                }
                if (oNode.childLocations && oNode.childLocations.length > 0) {
                    for (var i in oNode.childLocations) {
                        fnParseHierarchy(oNode.childLocations[i], oS4Asset, "FLOC");
                    }
                }
                if (oNode.childEquipments && oNode.childEquipments.length > 0) {
                    for (var j in oNode.childEquipments) {
                        fnParseHierarchy(oNode.childEquipments[j], oS4Asset, "EQUI");
                    }
                }
            }
            oAsset = {
                id: oTechnicalObject.ID,
                name: oTechnicalObject.name,
                desc: oTechnicalObject.to_description[0].shortDescription,
                type: oTechnicalObject.objectType
            };
            oTechnicalObject.id = oTechnicalObject.ID;
            fnParseHierarchy(oHierarchy, oTechnicalObject);
            return oAsset;
        },

        /**
         * Function to fetch component type list
         */
        fnFetchComponentTypeList:function(){
            var that=this;
            var oModel=this.getView().getModel("mEquipment");
            var catalogBasedCTinXom=oModel.getProperty("/metadata/featureFlag/catalogBasedCTinXom");    
            if (catalogBasedCTinXom != 1) {
                this.dataSource.getComponentTypePicklist(function (oResponse) {
                    if (oResponse && oResponse.value && oResponse.value.length > 0) {
                        var picklistIdCt = oResponse.value[0].ID
                        if (picklistIdCt) {
                            that.dataSource.getPicklistInfo(picklistIdCt, function (oResponse) {
                                try {
                                    var aCompTypeCt = JSON.parse(oResponse.jsonData);

                                    var aUniqueComponentTypeCt = [];
                                    var oSeenComponentTypesCt = {};

                                    aCompTypeCt.forEach(function (obj) {
                                        if (obj.componentType && !oSeenComponentTypesCt[obj.componentType]) {
                                            oSeenComponentTypesCt[obj.componentType] = true;
                                            aUniqueComponentTypeCt.push(obj);
                                        }
                                    });

                                    aUniqueComponentTypeCt.sort(function (a, b) {
                                        if (a.componentType > b.componentType) {
                                            return 1;
                                        } else if (a.componentType < b.componentType) {
                                            return -1;
                                        } else {
                                            return 0;
                                        }
                                    });
                                    oModel.setProperty("/data/aAllComponentType", aCompTypeCt);
                                    oModel.setProperty("/data/aUniqueComponentType", aUniqueComponentTypeCt);
                                    oModel.setProperty("/data/aCombineUniqueComponentType", aUniqueComponentTypeCt);

                                } catch (oError) {
                                    oModel.setProperty("/data/aAllComponentType", []);
                                }
                            }, function () {

                            })
                        }
                    }
                }, function () {

                })
            } else {
                this.dataSource.fnGetComponentEquiTypeXOMPicklist(function (oResponse) {

                    if (oResponse && oResponse.value && oResponse.value.length > 0) {
                        var picklistIdEqui = oResponse.value[0].ID
                        if (picklistIdEqui) {
                            that.dataSource.getPicklistInfo(picklistIdEqui, function (oResponse) {
                                try {
                                    var aCompTypeEqui = JSON.parse(oResponse.jsonData);

                                    var aUniqueComponentTypeEqui = [];
                                    var oSeenComponentTypesEqui = {};

                                    aCompTypeEqui.forEach(function (obj) {
                                        if (obj.componentType && !oSeenComponentTypesEqui[obj.componentType]) {
                                            oSeenComponentTypesEqui[obj.componentType] = true;
                                            aUniqueComponentTypeEqui.push(obj);
                                        }
                                    });

                                    aUniqueComponentTypeEqui.sort(function (a, b) {
                                        if (a.componentType > b.componentType) {
                                            return 1;
                                        } else if (a.componentType < b.componentType) {
                                            return -1;
                                        } else {
                                            return 0;
                                        }
                                    });
                                    oModel.setProperty("/data/aAllComponentType", aCompTypeEqui);
                                    oModel.setProperty("/data/aUniqueComponentType", aUniqueComponentTypeEqui);
                                    var aCombinedAll =
                                        (oModel.getProperty("/data/aUniqueComponentType") || [])
                                            .concat(
                                                oModel.getProperty("/data/aUniqueComponentTypeForFloc") || []
                                            );

                                    oModel.setProperty("/data/aCombineUniqueComponentType", aCombinedAll);

                                } catch (oError) {
                                    oModel.setProperty("/data/aAllComponentType", []);
                                }
                            }, function () {

                            })
                        }
                    }

                },function(){

                })

                this.dataSource.fnGetComponentFlocTypeXOMPicklist(function (oResponse) {

                    if (oResponse && oResponse.value && oResponse.value.length > 0) {
                        var picklistIdFloc = oResponse.value[0].ID
                        if (picklistIdFloc) {
                            that.dataSource.getPicklistInfo(picklistIdFloc, function (oResponse) {
                                try {
                                    var aCompTypeForFloc = JSON.parse(oResponse.jsonData);

                                    var aUniqueComponentTypeForFloc = [];
                                    var oSeenComponentTypesForFloc = {};

                                    aCompTypeForFloc.forEach(function (obj) {
                                        if (obj.componentType && !oSeenComponentTypesForFloc[obj.componentType]) {
                                            oSeenComponentTypesForFloc[obj.componentType] = true;
                                            aUniqueComponentTypeForFloc.push(obj);
                                        }
                                    });

                                    aUniqueComponentTypeForFloc.sort(function (a, b) {
                                        if (a.componentType > b.componentType) {
                                            return 1;
                                        } else if (a.componentType < b.componentType) {
                                            return -1;
                                        } else {
                                            return 0;
                                        }
                                    });
                                    oModel.setProperty("/data/aAllComponentTypeForFloc", aCompTypeForFloc);
                                    oModel.setProperty("/data/aUniqueComponentTypeForFloc", aUniqueComponentTypeForFloc);
                                    var aCombined =
                                        (oModel.getProperty("/data/aUniqueComponentTypeEqui") || [])
                                            .concat(
                                                oModel.getProperty("/data/aUniqueComponentTypeForFloc") || []
                                            );

                                    oModel.setProperty("/data/aCombineUniqueComponentType", aCombined);

                                } catch (oError) {
                                    oModel.setProperty("/data/aAllComponentTypeForFloc", []);
                                }
                            }, function () {

                            })
                        }
                    }

                },function(){
                    
                })              
            }
            
        },

        /**
         * Function to load feature flag config
         */
        fnLoadFeatureFlagConfig: function (fnCallback) {
            var mEquipment = this.getView().getModel("mEquipment");
            var isFeatureFlagLoaded = mEquipment.getProperty("/metadata/featureFlag/isLoaded");
            var oFeatureFlag = mEquipment.getProperty("/metadata/featureFlag");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();

            if(!isFeatureFlagLoaded) {
                this.commonDataSource.fetchFeatureFlag(function(oConfig) {
                    Object.keys(oFeatureFlag).forEach(function(sKey) {
                        if(Object.prototype.hasOwnProperty.call(oConfig, sKey)) {
                            oFeatureFlag[sKey] = oConfig[sKey].objectValue;
                        }
                    });
                    mEquipment.setProperty("/metadata/featureFlag", oFeatureFlag);
                    mEquipment.setProperty("/metadata/featureFlag/isLoaded", true);
                    if(fnCallback) {
                        fnCallback();
                    }
                }, function () {
                    sap.m.MessageToast.show(oI18n.getText("asint.equipment.message005"));
                });
            }
        },

        /**
         *  Get unit location when legacyEquitag is true 
         */
        fnGetUnitLocation: function (){

            var that = this;
            var oModel = this.getView().getModel("mEquipment");
            var bLegacyEquiTagEnabled = oModel.getProperty("/metadata/featureFlag/legacyEquiTag") === "1";

            if(bLegacyEquiTagEnabled){
                that.dataSource.getUnitLocations(function(oData){
                    oModel.setProperty("/metadata/unitLocations", oData.details);
                }, function(){
                    oModel.setProperty("/metadata/unitLocations", []);   
                });
            } else {
                oModel.setProperty("/metadata/unitLocations", []);
            }
        }

    });
}
);
