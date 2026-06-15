sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (EquipmentDetailController) {
    "use strict";

    return EquipmentDetailController.extend("com.asint.ais.mi.equipment.controller.detail.MaintenancePlan", {

        /**
         * Initialization Hook to set up route matching
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);
        },

        /**
         * After Rendering Hook to initialize the Maintenance Plan data
         */
        onAfterRendering: function () {
            this.fnInitialize();
        },

        /**
         * Function to initialize and fetch Maintenance Plans for the Equipment
         */
        fnInitialize: function () {
            var mModel = this.getView().getModel("mEquipmentDetail");
            if (!mModel) { return; }
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var isDataLoaded = mModel.getProperty("/data/tab/maintenancePlan/isDataLoaded");

            if (!isDataLoaded) {
                this.fnInitTable();
                
            }
            var sSrcId = mModel.getProperty("/data/detail/srcId");
            var sId = mModel.getProperty("/data/detail/ID"); 

            if (sSrcId === "BTP") {
                this.commonDataSource.getNearestS4Asset(sId, function (oDataRec) {
                    var sS4Name = oDataRec && oDataRec.data && oDataRec.data.NAME; 
                    var sS4Type = (oDataRec && (oDataRec.OBJECTTYPE || (oDataRec.data && oDataRec.data.OBJECTTYPE))) || "EQUI";
                    
                    if (sS4Name) {
                        this.fnFetchAssignedMPlans(sS4Name, sS4Type.toUpperCase());
                    }
                }.bind(this));
            } else {
                var sEquiName = mModel.getProperty("/data/detail/name"); 
                var sAppType = mModel.getProperty("/data/app") || "EQUI";
                this.fnFetchAssignedMPlans(sEquiName, sAppType);
            }
        },
        /**
         *  Function to initialize the Maintenance Plan table and set up event handlers
         * */
        fnInitTable: function () {
            var that = this;

            setTimeout(function () {
                var oTable = that.getView().byId("idMaintenancePlanTable");

                oTable.attachUpdateFinished(function (oEvent) {
                    var sReason = oEvent.getParameter("reason");

                    if (["Filter", "Sort", "Growing"].includes(sReason)) {
                        if (["Filter", "Sort"].includes(sReason)) {
                            that.fnFetchAssignedMPlans(true);
                        } else {
                            that.fnFetchAssignedMPlans(false);
                        }
                    }
                });
                oTable.fireUpdateFinished({
                    reason: "Growing",
                    actual: oTable.getGrowingThreshold(),
                    total: 0
                });
            }, 100);

        },
        
        /**
         * Function to fetch Maintenance Plans assigned to the Equipment
         */
        fnFetchAssignedMPlans:function (bClearData) {
            var that = this;
            var oTable = this.getView().byId("idMaintenancePlanTable");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            var sEquiName = mEquipmentDetail.getProperty("/data/detail/name");
            var aTechnicalObjectPayload = [];

            if (sEquiName) {
                aTechnicalObjectPayload.push({
                    objectName: sEquiName,
                    type: "EQUI"
                });
            }

            if (bClearData) {
                mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/list", []);
                mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/totalCount", 0);
                mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/tableBusy", true);
            }


            var sRunning = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/maintenancePlan/running");
            var aList = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/maintenancePlan/list") || [];
            var iListCount = aList.length || 0;
            var iTotalCount = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/maintenancePlan/totalCount");

            var iSkip = iListCount;
            var iTop = oTable.getGrowingThreshold() + (iSkip > 0 ? 0 : 1);
            var sIncomingProcess = iSkip + "_" + iTop;

            var sSearchQuery = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/maintenancePlan/searchQuery");

            if (sRunning !== sIncomingProcess && (iTotalCount === 0 || iListCount < iTotalCount)) {
                mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/running", sIncomingProcess);

                var oParam = {
                    skip: iSkip,
                    top: iTop,
                    searchQuery: sSearchQuery
                };

                this.dataSource.getMaintenancePlanDetailsByToV2(aTechnicalObjectPayload, oParam, function (oResponse) {
                    var aNewList = that.fnFormatHistMPlanResponse(oResponse);
                    var sListHeader = oI18n.getText("asint.equipment.detail.tab.mPlan.table.header", [oResponse.totalCount]);

                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/listHeader", sListHeader);
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/list", aList.concat(aNewList));
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/totalCount", oResponse.totalCount);
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/running", "");
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/tableBusy", false);
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/isDataLoaded", true);
                }, function () {
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/running", "");
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/tableBusy", false);
                    mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/maintenancePlan/isDataLoaded", false);
                });
            }
        },
        /**
         * Function to format  Maintenance Plan data
         * 
         * @param {Object} oResponse
         * @returns {Array} 
         */
        fnFormatHistMPlanResponse: function (oResponse) {
            var aFormattedResp = [];
            var aData = oResponse.data ? oResponse.data : [];

            aData.forEach(function (oItem) {
                var sMaintCycle = "", sMaintCycleCount = "", sMaintCycleUnit = "";
                var sMaintItem = "", sTaskListName = "", sTaskListShortDescription = "", sMaintDesc = "";

                if (oItem.maintenanceItems) {
                    try {
                        oItem.maintenanceItems = JSON.parse(oItem.maintenanceItems);
                    } catch (oExce) {
                        oItem.maintenanceItems = [];
                    }

                    var aMaintItems = oItem.maintenanceItems;

                    if (aMaintItems && aMaintItems.length > 0) {
                        sMaintItem = aMaintItems[0].itemName;
                        if (sMaintItem) {
                            if (aMaintItems[0].description) {
                                sMaintItem = aMaintItems[0].itemName;
                                sMaintDesc = aMaintItems[0].itemShortDesc;
                            }
                        }
                    }
                } else {
                    oItem.maintenanceItems = [];
                }

                if (oItem.planCycles) {
                    try {
                        oItem.planCycles = JSON.parse(oItem.planCycles);
                    } catch (oExec) {
                        oItem.planCycles = [];
                    }

                    var aCycle = oItem.planCycles;

                    if (aCycle && aCycle.length > 0 && aCycle[0].cycleCount && aCycle[0].cycleUnit) {
                        sMaintCycle = aCycle[0].cycleCount + " / " + aCycle[0].cycleUnit;
                        sMaintCycleCount = aCycle[0].cycleCount;
                        sMaintCycleUnit = aCycle[0].cycleUnit;
                    }
                } else {
                    oItem.planCycles = [];
                }

                if (oItem.taskLists) {
                    try {
                        oItem.taskLists = JSON.parse(oItem.taskLists);
                    } catch (oExec) {
                        oItem.taskLists = [];
                    }

                    var aTaskList = oItem.taskLists;

                    if (aTaskList && aTaskList.length > 0 && aTaskList[0].taskType && aTaskList[0].taskGroupCounter && aTaskList[0].taskGroups) {
                        sTaskListName = aTaskList[0].taskType + "/" + aTaskList[0].taskGroupCounter + "/" + aTaskList[0].taskGroups;
                        sTaskListShortDescription = aTaskList[0].taskShortDesc;
                    }
                } else {
                    oItem.taskLists = [];
                }

                aFormattedResp.push({
                    "ID": oItem.planID,
                    "maintPlanDesc": oItem.planShortDesc ? oItem.planShortDesc + " (" + oItem.planName + ")" : oItem.planName,
                    "maintPlanName": oItem.planName,
                    "maintPlanDisplayId": oItem.planDisplayID,
                    "maintenanceStrategy": oItem.maintenanceStrategy,
                    "maintPlanShortDescription": oItem.planShortDesc,
                    "toName": oItem.techObjName || "",
                    "toDesc": oItem.techObjDesc || "",
                    "toType": oItem.techObjName || "",
                    "toId": oItem.techObjId || "",
                    "maintPlanCycle": sMaintCycle,
                    "cycleCount": sMaintCycleCount,
                    "cycleUnit": sMaintCycleUnit,
                    "planCycle": oItem.planCycles || [],
                    "maintItemDesc": sMaintDesc,
                    "maintItemName": sMaintItem,
                    "planCycleLength": oItem.planCycles.length,
                    "maintenanceItemLength": oItem.maintenanceItems.length,
                    "maintenanceItem": oItem.maintenanceItems || [],
                    "taskList": oItem.taskLists || [],
                    "taskListLength": oItem.taskLists.length,
                    "taskListName": sTaskListName,
                    "taskListShortDescription": sTaskListShortDescription,
                    "status": oItem.planSystemStatus,
                    "raw": oItem,
                    "id": oItem.planID,
                    "recoID": oItem.recoId || "",
                    "recoDisplayId": oItem.recoDisplayId || "",
                    "recoSource": oItem.recoSource || "",
                    "recoApmId": oItem.recoApmRecommendationId || "",
                    "recoShortDescription": oItem.recoShortDesc || ""
                });
            });

            return aFormattedResp;
        },        

        /**
 * Function to search assigned maintenace plans
 */
        onSearchMaintenancePlans: function () {
            this.fnFetchAssignedMPlans(true);
        },


        /**
         * Function that opens the maintenance plan details popover (Cycle or Items)
         * @param {Object} oEvent 
         * @param {String} sType 
         */
        onMPlantDetailsPress: function (oEvent, sType) {
            var sHeader = "", sPath = "";
            var oButton = oEvent.getSource();
            var oItemTemplate;

            if (sType === "maintenanceCycle") {
                sHeader = this._oi18n.getText("asint.equipment.detail.tab.maintenancePlans.popup.cycle.text");
                sPath = "planCycle";
                oItemTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.ObjectIdentifier({
                            title: "{mEquipmentDetail>cycleCount}",
                            text: "{mEquipmentDetail>cycleUnit}"
                        })
                    ]
                });
            } else if (sType === "maintenanceItem") {
                sHeader = this._oi18n.getText("asint.equipment.detail.tab.maintenancePlans.popup.maintenanceItem.text");
                sPath = "maintenanceItem";
                oItemTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.ObjectIdentifier({
                            title: "{mEquipmentDetail>itemName}",
                            text: "{mEquipmentDetail>itemShortDesc}"
                        })
                    ]
                });
            } else if (sType === "taskList") {
                sHeader = this._oi18n.getText("asint.equipment.detail.tab.maintenancePlans.popup.tasklist.text");
                sPath = "taskList";
                oItemTemplate = new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.ObjectIdentifier({
                            title: "{mEquipmentDetail>taskType}/{mEquipmentDetail>taskGroupCounter}/{mEquipmentDetail>taskGroups}",
                            text: "{mEquipmentDetail>taskShortDesc}"
                        })
                    ]
                });
            }

            oEvent.preventDefault();

            var oPopover = new sap.m.Popover({
                contentWidth: "25%",
                showHeader: false,
                placement: sap.m.PlacementType.Left,
                content: new sap.m.Table({
                    columns: [new sap.m.Column({ header: new sap.m.Text({ text: sHeader }) })],
                    items: {
                        path: "mEquipmentDetail>" + sPath,
                        template: oItemTemplate
                    }
                })
            });

            this.getView().addDependent(oPopover);

            oPopover.bindElement({
                path: oButton.getBindingContext("mEquipmentDetail").getPath(),
                model: "mEquipmentDetail"
            });
            oPopover.openBy(oButton);
        },
        /**
         * Function to navigate to Maintenance Plan detail page
         */
        onClickMPlan: function (oEvent) {
            var oObj = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sPlanId = oObj.ID;
            var sHashWithKeyword = this.NAVIGATION.MAINTENANCEPLAN_DETAIL;
            sHashWithKeyword=sHashWithKeyword.replace("{maintPlanId}",sPlanId)
            var sNewUrl=this.setNavUrl(window,sHashWithKeyword);
            window.open(sNewUrl,"_blank");
        },

        /**
         * Function to navigate to Recommendation Workbench detail page
         */
        onClickReco: function(oEvent){
            var oObj = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            if(!oObj.recommendationDetails || !oObj.recommendationDetails.id) return;
            var sHash = this.NAVIGATION.RECOMMENDATION_WORKBENCH_DETAIL
                .replace("{recommendationId}", oObj.recommendationDetails.id)
                .replace("{recoType}", oObj.source || "APM")
                .replace("{recoGuid}", oObj.recommendationDetails.apmRecommendationId || oObj.recommendationDetails.id);
            window.open(this.setNavUrl(window, sHash), "_blank");
        }
    });
});