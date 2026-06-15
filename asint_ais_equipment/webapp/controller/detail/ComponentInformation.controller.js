sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/base/Log"
], function (BaseController, Filter, FilterOperator, Sorter,Logger) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.ComponentInformation", {

        /**
         * Ui5 lifecycle method triggered on first load of the view.
         */
        onInit: function () {
            this._oLogger =  Logger.getLogger("EquipmentComponentInformationController");
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);

        },

        /**
         * Ui5 lifecycle method triggered before this view is rendered.
         */
        onBeforeRendering: function () { },

        /**
         * Ui5 lifecycle method triggered after this view is rendered.
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },

        /**
         * Function on attachPatternMatched
         */
        fnInitialize: function () {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this.isComponetNameDescending = true;
            this.fnFetchComponents();
            var isAssignAllowed = true;
            var mEquipment = this.getView().getModel("mEquipment");
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sFeatureFlag = mEquipment.getProperty("/metadata/featureFlag/allowComponentAssign");
            var srcId = mEquipmentDetail.getProperty("/data/detail/srcId");
            if(srcId === "BTP" && sFeatureFlag == "0"){
                isAssignAllowed = false;
            }
            mEquipmentDetail.setProperty("/metadata/isAssignAllowed",isAssignAllowed);
        },

        /**
         * Fetch Components by Equipment ID
         * 
         */
        fnFetchComponents: function () {

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();

            that.dataSource.getChildEquipmentsByEquipmentId(sEquipmentId, function (oResponse) {
                var aChildEquipments = [];

                if (oResponse.child_equipments) {
                    aChildEquipments = oResponse.child_equipments;
                }
                mEquipmentDetail.setProperty("/data/tabs/components/componentInformation/components", aChildEquipments);
                mEquipmentDetail.setProperty("/data/tabs/components/componentInformation/componentsLength", aChildEquipments.length);
            }, function (oError) {
                mEquipmentDetail.setProperty("/data/tabs/components/componentInformation/components", []);
                mEquipmentDetail.setProperty("/data/tabs/components/componentInformation/componentsLength", 0);
                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message011"));
                that._oLogger.error("An Error Occurred In getChildEquipmentsByEquipmentId :",JSON.stringify(oError));
            });

        },

        /**
         * Ui5 lifecycle method triggered on exiting of this view.
         */
        onExit: function () { },

        /**
         * Function to open equipment value help 
         */
        onPressAssignEquipmentComponents: function () {
            var that = this;
            var oModel = this.getView().getModel("mLocationDetail");

            this.technicalObjectValueHelp.handleEquipmentValueHelp(function (oReturn) {
                if (oReturn.status === "finished") {
                    oModel.setProperty("/data/tabs/components/componentInformation/selectedForAssign", oReturn.selected);
                    that.fnConfirmAssignComponents("EQUI");
                }
            }, true);
        },
        /**
         * Event handler on Assign Equipment press
         */
        onAssignComponents: function () {

            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sCurParentEquipmentId = mEquipmentDetail.getProperty("/data/detail/parent_equipment_ID");
            // This is an example
            var aFilter = [
                new Filter({
                    and: false,
                    filters: [
                        new Filter({
                            path: "srcId",
                            operator: FilterOperator.EQ,
                            value1: null
                        }),
                        new Filter({
                            path: "srcId",
                            operator: FilterOperator.EQ,
                            value1: ""
                        }),
                        new Filter({
                            path: "srcId",
                            operator: FilterOperator.EQ,
                            value1: "BTP"
                        })
                    ]
                })
            ];

            this.technicalObjectValueHelp.handleEquipmentValueHelp(function (oReturn) {
                if (oReturn.status === "finished") {
                    var aSelectedEquipment = oReturn.selected;

                    if (aSelectedEquipment && aSelectedEquipment.length > 0) {
                        var isComponentParent = false;
                        aSelectedEquipment.forEach(function(oEqu){
                            if(oEqu.ID === sCurParentEquipmentId){
                                isComponentParent = true;
                            }
                        });
                        if(isComponentParent){
                            that.fnMessageShow("E",oI18n.getText("asint.equipment.detail.tab.structure.assign.message003"));
                            return;
                        }
                        that.fnPerformAssignUnassign(aSelectedEquipment, "ASSIGN", function () {
                            that.fnMessageShow("S", oI18n.getText("asint.equipment.detail.message014"), "", function () {
                                that.fnFetchComponents();
                            });
                        }, function (aErroredEquipmentName) {
                            // var sDetailedError = that.fnConvertArrayToHtmlList(aErroredEquipmentName);

                            that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message015",[aSelectedEquipment.length, aErroredEquipmentName.length]), "", function () {
                                that.fnFetchComponents();
                            });
                        });
                    } else {
                        this.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message018"));
                    }
                }
            }, true, aFilter);

        },

        /**
         * Event handler on Component Table selection change
         * 
         * @param {Object} oEvent 
         */
        onComponentInformationSelectionChange: function (oEvent) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aSelectedItems = oEvent.getSource().getSelectedItems();
            var aSelectedComponents = [];

            aSelectedItems.forEach(function (oItem) {
                aSelectedComponents.push(oItem.getBindingContext("mEquipmentDetail").getObject());
            });

            mEquipmentDetail.setProperty("/data/tabs/components/componentInformation/selectedComponents", aSelectedComponents);

        },

        /**
         * Event handler for Unassign button press
         */
        onUnassignComponents: function () {

            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aSelectedEquipment = mEquipmentDetail.getProperty("/data/tabs/components/componentInformation/selectedComponents");
            var oTable = this.getView().byId("idTableComponentInformation");

            if (aSelectedEquipment && aSelectedEquipment.length > 0) {
                that.fnMessageShow("C", oI18n.getText("asint.equipment.detail.message012"), "", function (sAction) {
                    if (sAction === "YES") {
                        that.fnPerformAssignUnassign(aSelectedEquipment, "UNASSIGN", function () {
                            oTable.removeSelections();
                            that.fnMessageShow("S", oI18n.getText("asint.equipment.detail.message016"), "", function () {
                                that.fnFetchComponents();
                            });
                        }, function (aErroredEquipmentName) {
                            // var sDetailedError = that.fnConvertArrayToHtmlList(aErroredEquipmentName);
                            oTable.removeSelections();

                            that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message017",[aSelectedEquipment.length, aErroredEquipmentName.length]), "", function () {
                                that.fnFetchComponents();
                            });
                        });
                    }
                });
            } else {
                this.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message013"));
            }

        },

        /**
         * Function to perform assign and unassign parent operations on Equipments 
         * 
         * @param {Array} aSelectedEquipment 
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnPerformAssignUnassign: function (aSelectedEquipment, sType, fnSuccess, fnError) {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            // eslint-disable-next-line no-unused-vars
            var iProgress = 0, iError = 0, aError = [];

            /**
             * Complete callback function for async process
             */
            var fnComplete = function () {
                iProgress++;
                if (iProgress === aSelectedEquipment.length) {
                    if (aError.length > 0) {
                        //TODO: Handle Error
                        if (fnError) {
                            fnError(aError);
                        }
                    } else {
                        if (fnSuccess) {
                            fnSuccess();
                        }
                    }
                }
            };

            aSelectedEquipment.forEach(function (oEquipmentData) {
                var sETag = oEquipmentData["modifiedAt"];
                var sEquipmentId = oEquipmentData.ID || oEquipmentData.equipmentId;
                if(sEquipmentId === oEquipmentDetail.ID) {
                    that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.tab.structure.assign.message001"), 
                        that._oi18n.getText("asint.equipment.detail.tab.structure.assign.message002"));
                }else {
                    var oPayload = {
                        "ID": sEquipmentId,
                        "parent_equipment_ID": null,
                        // "superordinateEquipment": "",
                        // "superordinateEquipmentDescription": ""
                    };
                    if (sType === "ASSIGN") {
                        // eslint-disable-next-line camelcase
                        oPayload.parent_equipment_ID = oEquipmentDetail.ID;
                        // oPayload.superordinateEquipment = oEquipmentDetail.name;
                        // oPayload.superordinateEquipmentDescription = oEquipmentDetail.to_description && oEquipmentDetail.to_description.length > 0 ? oEquipmentDetail.to_description[0].shortDescription : "";
                        that.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function () {
                            fnComplete();
                        }, function (oError) {
                            iError++;
                            aError.push(oEquipmentDetail.name);
                            fnComplete();
                            that._oLogger.error("An Error Occurred In updateEquipmentDetail :",JSON.stringify(oError));
                        }, sETag);
                    } else if (sType === "UNASSIGN") {
                        that.dataSource.unAssignComponent(sEquipmentId, function(){
                            fnComplete();
                        }, function (oError) {
                            iError++;
                            aError.push(oEquipmentDetail.name);
                            fnComplete();
                            that._oLogger.error("An Error Occurred In unAssignComponent :",JSON.stringify(oError));
                        });
                    }
                }
            });

        },

        /**
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchComponentsTable: function (oEvent) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idTableComponentInformation");
            var sQuery = oEvent.getSource().getValue();

            if (sQuery) {
                var aFilters = [
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("to_description/0/shortDescription", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }

            var iFilteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/tabs/components/componentInformation/componentsLength", iFilteredItemsLength);

        },

        /**
         * Function to sort components table based component name
         */
        onSortComponentsTable: function () {

            var oTable = this.getView().byId("idTableComponentInformation");
            var aSorters = [];
            var bDescending = !this.isComponetNameDescending;

            aSorters.push(new Sorter("name", bDescending));
            oTable.getBinding("items").sort(aSorters);

            this.isComponetNameDescending = !this.isComponetNameDescending;

        },

        /**
          * Function to handle navigation to child components
          * @param {Object} oEvent 
          */
        onPressComponents: function (oEvent) {
            var that=this;
            var oSelectedEquipment = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            
            var sHashWithKeyword = this.NAVIGATION.EQUIPMENT_DETAILS;
            sHashWithKeyword = sHashWithKeyword.replace("{equipmentId}", oSelectedEquipment.ID);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
            // this.navigate(this.NAVIGATION.EQUIPMENT_DETAILS, {
            //     "equipmentId": oSelectedEquipment.ID
            // });

        },

    });

});