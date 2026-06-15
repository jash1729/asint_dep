sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.Recommendations", {
         
        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () { },
         
        /**
         * This function will be called before rendering the view
         */
        onBeforeRendering: function () { },
        
        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {
            this.fnInitialize();
        },
         
        /**
         * this function will be called once the view got changed from view port
         */
        onExit: function () { },

        /**
         * Method to initialize the content of the view.
         */
        fnInitialize: function () {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail")
            this.sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var segmentedBtn = this.getView().byId("idSegmented");

            if(segmentedBtn){
                segmentedBtn.setSelectedKey("s4");
            }
            mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isComponent", false);
            mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isStandalone", false);
            mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isS4", true);

            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/list",[]);
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/btpList",[]);
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/standalonelist",[]);
            
            this.fnGetCurrentEquipmentRecos();
            this.fnGetChildEquipmentRecos();
        },

        /**
         * Function handles the recommendation table switch
         */
        onSwitchWorkordertable: function(oEvent){

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sSelectedKey = oEvent.getSource().getSelectedKey();

            if(sSelectedKey === "s4") {
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isS4", true);
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isComponent", false);
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isStandalone", false)
            } else if(sSelectedKey === "comp") {
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isS4", false);
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isComponent", true);
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isStandalone", false)
            } else if(sSelectedKey === "standalone") {
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isS4", false);
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isComponent", false);
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/isStandalone", true)
            }

            mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/selection", false);

            that.getView().byId("idRecommendationTable1").removeSelections();
            that.getView().byId("idRecommendationTable2").removeSelections();
            that.getView().byId("idRecommendationTable3").removeSelections();
            that.getView().byId("idRecommendationTable1").getBinding("items").filter([]);
            that.getView().byId("idRecommendationTable2").getBinding("items").filter([]);
            that.getView().byId("idRecommendationTable3").getBinding("items").filter([]);

            var oSearchField = this.getView().byId("searchField");
            var oSearchField1 = this.getView().byId("searchField1");
            var oSearchField2 = this.getView().byId("searchField2");
            oSearchField ? oSearchField.setValue("") : "";
            oSearchField1 ? oSearchField1.setValue("") : "";
            oSearchField2 ? oSearchField2.setValue("") : "";
            
        },
        
        /**
         * Function that handle the selection of reccommendations
         * @param {Object} oEvent 
         */
        onRecomendationSelect: function (oEvent) {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var selectedItem = oEvent.getSource().getSelectedItem().getBindingContext("mEquipmentDetail").getObject();
            var oselected = JSON.parse(JSON.stringify(selectedItem));
            var obj = {
                long: oselected.to_description.longDescription,
                short: oselected.to_description.shortDescription
            };
            oselected.description = obj;
            oselected.id = oselected.ID;
            var isS4Asset = mEquipmentDetail.getProperty("/data/detail/srcId") !== "BTP" && mEquipmentDetail.getProperty("/data/detail/srcId") !== "AIS" ? true : false;
            if(isS4Asset){
                oselected.technicalObject = mEquipmentDetail.getProperty("/data/detail/name");
                var toDescription = mEquipmentDetail.getProperty("/data/detail/to_description");
                if (toDescription && toDescription.length > 0) {
                    oselected.technicalObjectDesc = toDescription[0].shortDescription;
                } else {
                    oselected.technicalObjectDesc = "";  // handle case where there is no data
                } 
            } else {
                var nearestS4equiObj = that.fnGetNearestS4ParentObject();
                oselected.technicalObject = nearestS4equiObj.name;
                oselected.technicalObjectDesc = nearestS4equiObj.desc;
            }

            if(oselected.source === "APM"){
                oselected.startDate = that.formatter.formatDate(oselected.validFrom,"yyyy-MM-dd");
                oselected.targetDate = that.formatter.formatDate(oselected.validTo,"yyyy-MM-dd");
            }else if(oselected.source === "AIS"){
                oselected.startDate = that.formatter.formatDate(oselected.startDate,"yyyy-MM-dd");
                oselected.targetDate = that.formatter.formatDate(oselected.targetDate,"yyyy-MM-dd");
            }

            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/selectedObj", oselected);
            if (Object.values(oselected).length > 0) {
                mEquipmentDetail.setProperty("/metadata/detail/tabs/recommendations/selection", true);
            }
        },
    
        /**
         * Function that search in recommendation table
         * @param {Object} oEvent 
         */
        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var oFilterArr = [];
            if (sQuery) {
                oFilterArr = new Filter([
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_description/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("type", FilterOperator.Contains, sQuery),
                    new Filter("subType", FilterOperator.Contains, sQuery),
                    new Filter("equipment", FilterOperator.Contains, sQuery),
                    new Filter("equipmentDesc", FilterOperator.Contains, sQuery),
                    new Filter("maintenanceActivityDescription", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ], false);
            }
            this.getView().byId("idRecommendationTable1").getBinding("items").filter(oFilterArr);
        },

        /**
         * Function that search in recommendation table
         * @param {Object} oEvent 
         */
        onSearchBtp: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var oFilterArr = [];
            if (sQuery) {
                oFilterArr = new Filter([
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_description/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("to_assessment/displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_assessment/to_description/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("equipment", FilterOperator.Contains, sQuery),
                    new Filter("equipmentDesc", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ], false);
            }
            this.getView().byId("idRecommendationTable2").getBinding("items").filter(oFilterArr);
        },

        /**
         * Function that search in standalone recommendation table
         * @param {Object} oEvent 
         */
        onSearchStandalone: function (oEvent) {

            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var oFilterArr = [];
            if (sQuery) {
                oFilterArr = new Filter([
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_description/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("type", FilterOperator.Contains, sQuery),
                    new Filter("subType", FilterOperator.Contains, sQuery),
                    new Filter("source", FilterOperator.Contains, sQuery),
                    new Filter("to_assessment/displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_assessment/to_description/shortDescription", FilterOperator.Contains, sQuery),
                    new Filter("equipment", FilterOperator.Contains, sQuery),
                    new Filter("equipmentDesc", FilterOperator.Contains, sQuery),
                    new Filter("maintenanceActivityDescription", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ], false);
            }
            this.getView().byId("idRecommendationTable3").getBinding("items").filter(oFilterArr);
        },

        /**
         * Function to handle recommendation title click.
         */
        onClickRecommendationTitle:function(oEvent) {

            // var that = this;
            var oSelectedRec = oSelectedRec = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sHashWithKeyword = this.NAVIGATION.RECOMMENDATION_WORKBENCH_DETAIL;

            // if(oSelectedRec.source === "APM"){
            //     sHashWithKeyword = sHashWithKeyword.replace("{recommId}", oSelectedRec.apmRecommendationId); 
            // }else if(oSelectedRec.source === "AIS"){
            //     sHashWithKeyword = sHashWithKeyword.replace("{recommId}", oSelectedRec.ID);  
            // }
            // sHashWithKeyword = sHashWithKeyword.replace("{recoType}", oSelectedRec.source);
            // sHashWithKeyword = sHashWithKeyword.replace("{recommendationGuid}", oSelectedRec.ID);
            // var newUrl = that.setNavUrl(window, sHashWithKeyword);
            // window.open(newUrl, "_blank");

            sHashWithKeyword = sHashWithKeyword.replace("{recoGuid}", oSelectedRec.ID);
            var sRecoType = oSelectedRec.source;
            var sRecoGuid = oSelectedRec.ID;
            var source = oSelectedRec.source;
            if(source === "APM"){
                sRecoType = "APM";
                sRecoGuid = oSelectedRec.apmRecommendationId;
            }
            sHashWithKeyword = sHashWithKeyword.replace("{recoType}", sRecoType);
            sHashWithKeyword = sHashWithKeyword.replace("{recommendationId}", sRecoGuid);
            var newUrl = this.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");

        },

        /**
         * Function to handle assessment title click.
         */
        onClickASDTitle:function(oEvent) {

            var that = this;
            var sHashWithKeyword = "";
            var oSelectedRec = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            if(oSelectedRec["to_assessment"].category === "ASD"){
                sHashWithKeyword = this.NAVIGATION.ASSET_STRATEGY_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{assetStrategyId}", oSelectedRec["to_assessment_ID"]);
            }else{
                sHashWithKeyword = this.NAVIGATION.INSPECTION_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{inspectionId}", oSelectedRec["to_assessment_ID"]);
            }
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");

        },

        /**
         * Function to get Current Equipment recommendations
         */
        fnGetCurrentEquipmentRecos : function(){

            var that = this;
            
            that.dataSource.getEquipmentRecommendations(this.sEquipmentId,function(oCurrentFlocResponse){

                if(oCurrentFlocResponse && oCurrentFlocResponse["to_recommendation"]){

                    var aCurrentFlocRecos = oCurrentFlocResponse["to_recommendation"];
                    var sFlocName = oCurrentFlocResponse.name;
                    var sFlocDesc = oCurrentFlocResponse["to_description"] ? oCurrentFlocResponse["to_description"][0].shortDescription : "";
                    that.fnSplitRecoBasedonType(sFlocName,sFlocDesc,aCurrentFlocRecos);
                }

            },function(oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.tab.maintenanceAndService.reco.message001"), errorDetail);
            });



        },

        /**
        * Function to get child equipment recommendations
        */
        fnGetChildEquipmentRecos: function () {

            var that = this;

            that.dataSource.getChildEquipmentRecommendations(this.sEquipmentId, function (oChildEqResponse) {

                if (oChildEqResponse && oChildEqResponse["child_equipments"]) {

                    var aChildEquipments = oChildEqResponse["child_equipments"];

                    aChildEquipments.forEach(function(oChildEquipment){

                        var aChidlEquipmentRecos = oChildEquipment["to_recommendation"];
                        var sEqName = oChildEquipment.name;
                        var sEqDesc = oChildEquipment["to_description"] ? oChildEquipment["to_description"][0].shortDescription : "";
                        that.fnSplitRecoBasedonType(sEqName, sEqDesc, aChidlEquipmentRecos);

                    });
                }

            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.tab.maintenanceAndService.reco.message001"), errorDetail);
            });



        },

        /**
         * Function to split Recommendations by type
         * @param {String} sTechnicalObjectName 
         * @param {String} sTechnicalObjectDesc 
         * @param {Array} aRecos 
         */
        fnSplitRecoBasedonType : function(sTechnicalObjectName, sTechnicalObjectDesc, aRecos) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aList = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/recommendations/list") || [];
            var aBtpList = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/recommendations/btpList") || [];
            var aStandaloneList = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/recommendations/standaloneList") || [];

            aRecos.forEach(function(oReco) {
                if (oReco && oReco.recommendation) {

                    var oRecommendation = oReco.recommendation;

                    oRecommendation.equipment = sTechnicalObjectName;
                    oRecommendation.equipmentDesc = sTechnicalObjectDesc;

                    aList.push(oRecommendation);

                    if (oRecommendation.assessmentType === "Standalone" || oRecommendation.assessmentType === "SME" || oRecommendation.assessmentType === "LEGAL") {
                        aStandaloneList.push(oRecommendation);
                    } else if(oRecommendation.to_assessment) {
                        aBtpList.push(oRecommendation);
                    }
                }
            });

            /**
             * Function to sort array by property 
             */
            var sortByProperty = function(aReco, sProperty) {
                return aReco.sort(function(a, b) {
                    if (a[sProperty] < b[sProperty]) return -1;
                    if (a[sProperty] > b[sProperty]) return 1;
                    return 0;
                });
            };

            aList = sortByProperty(aList, "displayId");
            aBtpList = sortByProperty(aBtpList, "displayId");
            aStandaloneList = sortByProperty(aStandaloneList, "displayId");

            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/list", aList);
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/list/tableHeader", this._oi18n.getText("asint.equipment.detail.tab.maintenance.recommendation.table.header.text", [aList.length]));
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/btpList", aBtpList);
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/btpList/tableHeader", this._oi18n.getText("asint.equipment.detail.tab.maintenance.recommendation.table.header.text", [aBtpList.length]));
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/standaloneList", aStandaloneList);
            mEquipmentDetail.setProperty("/data/tabs/maintenanceservice/recommendations/standaloneList/tableHeader", this._oi18n.getText("asint.equipment.detail.tab.maintenance.recommendation.table.header.text", [aStandaloneList.length]));
        },

        /**
        * Function that opnes the create notiification fragment
        */
        onCreateNotificcationPress: function () {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            var oTable1 = this.getView().byId("idRecommendationTable1");
            var oTable2 = this.getView().byId("idRecommendationTable2");
            var oTable3 = this.getView().byId("idRecommendationTable3");

            var aSelectedItems = [];
            if (oTable1 && oTable1.getVisible()) {
                aSelectedItems = oTable1.getSelectedItems();
            } else if (oTable2 && oTable2.getVisible()) {
                aSelectedItems = oTable2.getSelectedItems();
            } else if (oTable3 && oTable3.getVisible()) {
                aSelectedItems = oTable3.getSelectedItems();
            }

            if (!aSelectedItems || aSelectedItems.length === 0) {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.convert.to.notification.001"));
                return;
            }

            var oSelectedObj = aSelectedItems[0].getBindingContext("mEquipmentDetail").getObject();
            var sStatus = oSelectedObj.status;

            var aDisabledStatuses = ["CREATED", "IN_PROCESS", "ON_HOLD", "REJECTED"];

            if (aDisabledStatuses.includes(sStatus)) {
                that.fnMessageShow("W", that._oi18n.getText("asint.equipment.convert.to.notification.002"));
                return;
            }

            if (!this._oDialogCreateNotification) {
                Fragment.load({
                    id: "_idDialogCreateNotification",
                    name: "com.asint.ais.mi.equipment.view.fragment.CreateNotification",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    this._oDialogCreateNotification = oDialog;
                    this._oDialogCreateNotification.open();
                }.bind(this));
            } else {
                this._oDialogCreateNotification.open();
            }
        },

        /**
        * Function that create the notification
        */
        onConvertNotification: function () {
            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var oForm = mEquipmentDetail.getProperty("/data/tabs/maintenanceservice/recommendations/selectedObj");
            var isS4Asset = mEquipmentDetail.getProperty("/data/detail/srcId") !== "BTP" && mEquipmentDetail.getProperty("/data/detail/srcId") !== "AIS" ? true : false;

            var oPayload = {
                "to_description": [{
                    "shortDescription": oForm.description.short,
                    "longDescription": oForm.description.long,
                    "language": "en"
                }],
                "status": "OSNO",
                "type": oForm.notitype,
                "priority": oForm.notiPriority,
                "startDateTime": oForm.startDate,
                "endDateTime": oForm.targetDate,
                "deleted": false,
                "breakdown": oForm.breakdown ? oForm.breakdown : false,
                // "recommendationId": oForm.id
            };
            var toEquipment = {};
            if (isS4Asset) {
                toEquipment = {
                    "equipment_ID": mEquipmentDetail.getProperty("/data/detail/ID"),
                };
            } else {
                var nearestS4equiObj = that.fnGetNearestS4ParentObject();
                toEquipment = {
                    "equipment_ID": nearestS4equiObj.id,
                };
            }
            oPayload = that.setCreatedModified(oPayload, "POST");
            /* eslint-disable camelcase */
            oPayload.to_equipment = toEquipment;
            if (oPayload.to_description[0].shortDescription.length > 0 && oPayload.to_description[0].longDescription.length > 0 && oPayload.startDateTime &&
                oPayload.endDateTime && oPayload.type && oPayload.priority) {
                that.dataSource.createNotification(oPayload, function () {
                    that.fnGetNotiifcation();
                    that.onCloseNotificationDialog();
                    that.fnMessageShow("S", that._oi18n.getText("asint.equipment.notification.create.message001"));
                    that.getView().byId("idRecommendationTable1").removeSelections();
                    that.getView().byId("idRecommendationTable2").removeSelections();
                    that.getView().byId("idRecommendationTable3").removeSelections();
                }, function () {
                    that.fnMessageShow("E", that._oi18n.getText("asint.equipment.notification.create.message002"));
                    // var err = JSON.parse(oError.responseText);
                    // var errorDetail = "";
                    // if (err.error.message) {
                    //     errorDetail = err.error.message;
                    // }
                    // that._oLogger.error("An Error Occurred In onConvertNotification :", JSON.stringify(oError));
                })
            } else {
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.create.message02"));
            }
        },

        /**
        * Function that close the create notification dialog
        */
        onCloseNotificationDialog: function () {
            var that = this;
            if (that._oDialogCreateNotification) {
                that._oDialogCreateNotification.close();
            }
        },


    });
});