sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Controller, JSONModel, Sorter, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.Notification", {

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);
        },

        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {
            this.fnInitialize();
        },

        /**
         * This function will be called everytime when the view got initialized as we are attaching this to pattern matched
         */
        fnInitialize: function () {
            var that = this;
            var oView = that.getView();
            var mEquipmentDetail = oView.getModel("mEquipmentDetail");
            var sSrcId = mEquipmentDetail.getProperty("/data/detail/srcId");
            var sId = mEquipmentDetail.getProperty("/data/detail/ID");
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();


            if (sSrcId === "BTP") {

                that.commonDataSource.getNearestS4Asset(sId, function (oDataRec) {
                    var oDataRecdataID = oDataRec && oDataRec.data && oDataRec.data.ID;

                    var aPrioritylist = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/priorityList");
                    var aTypelist = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/notificationTypeList");
                    var sFlocName = mEquipmentDetail.getProperty("/data/detail/parent_functional_location/name");
                    var sFlocDesc = mEquipmentDetail.getProperty("/data/detail/parent_functional_location/to_description/0/shortDescription");
                    var notificationList = [];
                    var oDataRecObjType = (oDataRec && (oDataRec.OBJECTTYPE || (oDataRec.data && oDataRec.data.OBJECTTYPE)));
                    oDataRecObjType = (oDataRecObjType || "").toUpperCase();
                    that.commonDataSource.fetchAssignedNotifications(oDataRecdataID, oDataRecObjType, function (oNotifRec) {
                        if (oNotifRec && oNotifRec.notifications && oNotifRec.notifications.length > 0) {
                            oNotifRec.notifications.forEach(function (item) {
                                if (item.notification) {
                                    var priorityMatch = aPrioritylist.find(function (priority) {
                                        return priority && priority.name === item.notification.priority;
                                    });

                                    var typeMatch = aTypelist.find(function (type) {
                                        return type && type.name === item.notification.type;
                                    });

                                    item.notification.description = priorityMatch ? (priorityMatch.description || "") : "";
                                    item.notification.notificationType = typeMatch ? (typeMatch.description || "") : "";
                                    item.notification.functionalLocationName = item.notification.functionalLocationName || sFlocName;
                                    item.notification.functionalLocationDesc = item.notification.functionalLocationDesc || sFlocDesc;
                                    item.notification.breakdown = !!item.notification.breakdown;

                                    if (item.notification.to_component) {
                                        item.notification.componentName = item.notification.to_component.name || "";

                                        if (item.notification.to_component.ID === sId) {
                                            item.notification.componentID = item.notification.to_component.ID;
                                            notificationList.push(item.notification);
                                        } else {
                                            item.notification.componentID = "";
                                        }

                                        item.notification.componentType = "EQUI";

                                    } else {
                                        item.notification.componentName = "";
                                        item.notification.componentID = "";
                                        item.notification.componentType = "";
                                    }
                                }
                            });

                            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList", notificationList);
                            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList/tableHeader", that._oi18n.getText("asint.equipment.detail.tab.notification.header.text", [notificationList.length]));
                        } else {
                            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList", []);
                            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/notiificationList/tableHeader", that._oi18n.getText("asint.equipment.detail.tab.notification.header.text", [0]));
                        }
                    // eslint-disable-next-line no-unused-vars
                    }, function (oError) {
                        that.fnMessageShow("E", that._oi18n.getText("asint.equipment.notification.create.message003"), "");
                    });
                });

            } else {
                that.fnGetNotiifcation();
            }
        },
        
        /**
         * Function that handles the segmented buttons
         */
        onSwitchWorkorderSegmentButton:function() {
            var oTable = this.getView().byId("notification"),
                oSegmentButton = this.getView().byId("idReccoSegment1").getSelectedKey(),
                oFilter;
            if (oSegmentButton !== "all") {
                oFilter = new sap.ui.model.Filter({
                    path: "status",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: oSegmentButton,
                    caseSensitive: false
                });
            }
            oTable.getBinding("items").filter(oFilter);
        },

        /**
         * Function that handles the search in notification table
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var aSelectedKeys = this.getView().byId("idNotiBreakdownFilter").getSelectedKeys();
            this.fnImplementCombinedFilters(sQuery, aSelectedKeys);
        },

        /**
         * Function to handle breakdown filter
         */
        onSelectBreakDownFilter : function(oEvent){
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var sQuery = this.getView().byId("idNotificationsSearch").getValue();
            sQuery = sQuery ? sQuery.trim() : "";
            this.fnImplementCombinedFilters(sQuery, aSelectedKeys);
        },

        /**
         * Function to implement combined filter
         */
        fnImplementCombinedFilters : function(sQuery, aSelectedKeys){
            var oTable = this.getView().byId("notification");
            var oFilterArr;
            if (sQuery) {
                oFilterArr = new Filter([
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("to_description[0].shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery),
                    new Filter("type", FilterOperator.EQ, sQuery),
                    new Filter("notificationType", FilterOperator.Contains, sQuery),
                    new Filter("priority", FilterOperator.EQ, sQuery),
                    new Filter("description", FilterOperator.Contains, sQuery),
                    // new Filter("equipmentDesc", FilterOperator.Contains, sQuery),
                    // new Filter("equipmentName", FilterOperator.Contains, sQuery),
                    new Filter("functionalLocationDesc", FilterOperator.Contains, sQuery),
                    new Filter("functionalLocationName", FilterOperator.Contains, sQuery),
                ], false);
            }
            var oBreakDownFilter;
            if(aSelectedKeys && aSelectedKeys.length > 0){
                if (aSelectedKeys && aSelectedKeys.length > 0) {
                    var aFilters = [];
                    aSelectedKeys.forEach(function(sKey){
                        var bKey = sKey === "Yes" ? true : false;
                        aFilters.push(new Filter("breakdown", FilterOperator.EQ, bKey))
                    })
                    oBreakDownFilter = new Filter(aFilters, false);
                }
            }
            var oFinalFilter = [];
            if(oFilterArr && oBreakDownFilter){
                oFinalFilter = new Filter([oFilterArr, oBreakDownFilter], true);
            }else if(oFilterArr){
                oFinalFilter = oFilterArr;
            }else if(oBreakDownFilter){
                oFinalFilter = oBreakDownFilter;
            }
            oTable.getBinding("items").filter(oFinalFilter);
        },

        /**
         * FUnction to handle notification navigation
         * @param {Object} oEvent 
         */
        onClickNotificationTitle: function(oEvent) {
            var that = this;
            var oSelectedRec = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sHashWithKeyword = this.NAVIGATION.NOTIFICATION_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{notificationId}", oSelectedRec.ID);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        },

        
        /**
         * FUnction to handle component navigation
         * @param {Object} oEvent 
         */
        onTechnicalObjPopover: function (oEvent) {
            var that = this;
            var oSelectedRec = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();

            var sHashWithKeyword = "";
            
            if (oSelectedRec.componentType === "EQUI") {
                sHashWithKeyword = this.NAVIGATION.EQUIPMENT_DETAILS;
                sHashWithKeyword = sHashWithKeyword.replace("{equipmentId}", oSelectedRec.componentID);
            } else if (oSelectedRec.componentType === "FLOC") {
                sHashWithKeyword = this.NAVIGATION.LOCATION_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{functionallocationId}", oSelectedRec.componentID);
            }

            var sNewUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(sNewUrl, "_blank");
        },

        /**
         * function to handle navigation for equipment 
         * @param {object} oEvent 
         */
        onClickequipNotification : function(oEvent){
            var oSelectedContext = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sHashWithKeyword = this.NAVIGATION.EQUIPMENT_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{equipmentID}",oSelectedContext.ID);
            var newUrl=this.setNavUrl(window,sHashWithKeyword);
            window.open(newUrl,"_blank");
        },


        /**
         * function to handle navigation for functional location 
         * @param {object} oEvent 
         */
        onClickequipFuncLoc : function(oEvent){
            var oSelectedContext = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sHashWithKeyword = this.NAVIGATION.LOCATION_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{functionalLocationId}",oSelectedContext.ID);
            var newUrl = this.setNavUrl(window,sHashWithKeyword);
            window.open(newUrl,"_blank");
        }


    });

});
