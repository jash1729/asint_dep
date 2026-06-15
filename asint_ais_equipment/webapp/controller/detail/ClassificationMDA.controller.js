sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/Assignments.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Sorter, MessageBox, Filter, FilterOperator, Fragment) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.ClassificationMDA", {

        /**
         * Ui5 lifecycle method triggered on first load of the view.
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);
        },

        /**
         * Ui5 lifecycle method triggered on every rendering of the view.
         */
        onBeforeRendering: function () { },

        /**
         * Ui5 lifecycle method triggered on every rendering of the view.
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },

        /**
         * Ui5 lifecycle method triggered on every exiting of the view.
         */
        onExit: function () { },

        /**
         * Method to initialize the content of the view.
         */
        fnInitialize: function () {
            var that = this;
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var isFirstTabLoaded = mEquipmentDetail.getProperty("/data/assignments/isAssignmentsTabLoaded");
            if(!isFirstTabLoaded){
                var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
                that.fnGetAssignedObjectTemplateList(sEquipmentId, function(){
                    mEquipmentDetail.setProperty("/data/assignments/isAssignmentsTabLoaded", true);
                    that.fnSelectFirstClass();
                });
            }else{
                this.fnSelectFirstClass();
            }
        },

        /**
         * Function to select first class as default
         */
        fnSelectFirstClass : function(sSelectedKey){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aClassses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassListS4");
            var s4Chars = mEquipmentDetail.getProperty("/data/assignments/Chars/allCharsS4");
            var oFirstClass = aClassses[0];
            mEquipmentDetail.setProperty("/data/assignments/Chars/filteredCharsForClass", []);
            mEquipmentDetail.setProperty("/data/assignments/Chars/filteredCharsHeader", this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [0]));
            mEquipmentDetail.setProperty("/data/assignments/Chars/selectedClassKey", "");
            if(oFirstClass || sSelectedKey){
                var sClassId = "";
                if(sSelectedKey){
                    sClassId = sSelectedKey
                }else{
                    sClassId = oFirstClass.ID;
                }
                mEquipmentDetail.setProperty("/data/assignments/Chars/selectedClassKey", sClassId);
                var aChars = [];
                aChars = s4Chars.filter(function(oChar){
                    return oChar.classId === sClassId;
                });
                mEquipmentDetail.setProperty("/data/assignments/Chars/filteredCharsForClass", aChars);
                mEquipmentDetail.setProperty("/data/assignments/Chars/filteredCharsHeader", this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [aChars.length]));
            }
        },

        /**
         * Function to handle change view
         */
        onSwitchView : function(oEvent){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sSelectedTab = oEvent.getSource().getSelectedKey();

            if(sSelectedTab == "grid"){
                mEquipmentDetail.setProperty("/data/assignments/Chars/isClassificationTableVisible", false);
            }else{
                mEquipmentDetail.setProperty("/data/assignments/Chars/isClassificationTableVisible", true);
            }
        },

        /**
         * Function to filter data based on selected class
         */
        onClassChange : function(){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sSelectedKey = mEquipmentDetail.getProperty("/data/assignments/Chars/selectedClassKey");
            this.fnSelectFirstClass(sSelectedKey);
        },

        /**
         * Function to search chacarteristics
         */
        onSearchClassificationChars : function(oEvent){
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            var oGrid = this.byId("idCharsGrid");
            var oTable = this.byId("idClassificationChars");

            if (sQuery) {
                aFilters = [
                    new Filter("displayId",FilterOperator.Contains,sQuery), 
                    new Filter("name",FilterOperator.Contains,sQuery), 
                    new Filter("to_description/0/shortDescription",FilterOperator.Contains,sQuery)
                ];

                oGrid.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            }else{
                oGrid.getBinding("items").filter([]);
                oTable.getBinding("items").filter([]);
            }
			
        },

        /**
         * Function to open assign dialog
         * @param {Object} oEvent 
         */
        onOpenAssignClassDialog: function (oEvent) {

            this._fnAssignClassesDialogHandler("open", oEvent);

        },

        /**
         * Function to handle assign confirm
         * @param {Object} oEvent 
         */
        onConfirmAssignClassDialog: function (oEvent) {

            this._fnAssignClassesDialogHandler("confirm", oEvent);

        },

        /**
         * Function to close asssign class dialog
         */
        onCloseAssignDialog : function(){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            mEquipmentDetail.setProperty("/data/assignments/Classes/selectedForAssign",[]);
            mEquipmentDetail.setProperty("/data/assignments/Classes/isOkEnabled", false)
            this._assignClassesDialog.close();
            this._assignClassesDialog.destroy();
            this._assignClassesDialog = null;
        },

        /**
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchClassesAssignDialog: function (oEvent) {
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = sap.ui.getCore().byId("idAssignClasses");
            var sQuery = oEvent.getSource().getValue();
            if(sQuery){
                var aFilters = [
                    new Filter("displayId",FilterOperator.Contains,sQuery), 
                    new Filter("classNumber",FilterOperator.Contains,sQuery), 
                    new Filter("to_description/0/shortDescription",FilterOperator.Contains,sQuery),
                    new Filter("srcId",FilterOperator.Contains,sQuery)
                ];
    
                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            }else{
                oTable.getBinding("items").filter([]);
            }
            var filteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/assignments/Classes/totalClassesTableHeader",this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader",[filteredItemsLength]));
        },

        /**
         * 
         * @param {String} sAction 
         * @param {Object} oEvent 
         */
        _fnAssignClassesDialogHandler: function (sAction) {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            switch (sAction) {
            case "open":
                var oTable;
                if (!this._assignClassesDialog) {
                    Fragment.load({
                        name: "com.asint.ais.mi.equipment.view.fragment.AssignClassDialog",
                        controller: this
                    }).then(function (oDialog) {
                        this.getView().addDependent(oDialog);
                        this._assignClassesDialog = oDialog;
                        this._assignClassesDialog.open();
                        oTable = sap.ui.getCore().byId("idAssignClasses");
                        oTable.removeSelections();
                    }.bind(this));
                } else {
                    this._assignClassesDialog.open();
                    oTable = sap.ui.getCore().byId("idAssignClasses");
                    oTable.removeSelections();
                }
                mEquipmentDetail.setProperty("/data/assignments/Classes/searchField", "");
                this._fnLoadUnassignedClasses();
                break;
            case "confirm":
                // var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
                var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
                var aAssignedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassList");
                var aSelectedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/selectedForAssign");
                var equiSrcID=mEquipmentDetail.getProperty("/data/detail/srcId")
                var aClassesFinal = [];
                var isS4ClassPresent = false;
                var aS4ClassId = [];
                if(aSelectedClasses.length > 0){
                    if(aAssignedClasses.length > 0){
                        aAssignedClasses.forEach(function(oAssigned){
                            /*eslint-disable camelcase*/
                            aClassesFinal.push({
                                classes_ID: oAssigned.ID,
                                equipment_ID: sEquipmentId,
                                objectTemplate_ID : oAssigned.objectTemplateId ? oAssigned.objectTemplateId  : null
                            });
                        })
                    }
                    aSelectedClasses.forEach(function (oItem) {
                        if(equiSrcID!="BTP"){
                            if(oItem.srcId && oItem.srcId != "BTP"){
                                isS4ClassPresent = true;
                                aS4ClassId.push(oItem.displayId);
                            }
                        }
                        aClassesFinal.push({
                            classes_ID: oItem.ID,
                            equipment_ID: sEquipmentId,
                            objectTemplate_ID : oItem.objectTempId ? oItem.objectTempId  : null
                        });
                    });
                    if(isS4ClassPresent){
                        return that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message08") + "\n" + aS4ClassId.join(", "));
                    }else{
                        that.fnMakeApiToCallToUpdateClasses(aClassesFinal, function(sText, oDetail){
                            if(sText == "Error"){
                                return that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message03"), oDetail);
                            }
                            that.onCloseAssignDialog();
                            mEquipmentDetail.setProperty("/data/etag", oDetail["@etag"]);
                            that.fnMessageShow("S",that._oi18n.getText("asint.equipment.detail.class.message01"),"", function(){
                                that.fnFetchAssignedClasses(function(){
                                    that.fnSelectFirstClass();
                                });
                            });
                        });
                    }
                }else{
                    that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message05"));
                }
                break;
            }

        },

        /**
         * Function to make api call to update classes
         * @param {Array} aClasses 
         */
        fnMakeApiToCallToUpdateClasses : function(aClasses, fnCallback){
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var detail=oModel.getProperty("/data/detail");
            var sEquipmentId = oModel.getProperty("/router/arguments/equipmentId");
            var eTag = oModel.getProperty("/data/etag");
            var oPayload = {
                ID : sEquipmentId,
                to_class : aClasses
            };
            oPayload=this.setCreatedModified(oPayload,"PUT",detail) 
            this.dataSource.updateEquipmentDetail(sEquipmentId, oPayload, function (oData) {
                fnCallback("", oData);
            }, function (oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                fnCallback("Error", errorDetail);
                that._oLogger.error("An Error Occurred In updateEquipmentDetail :",JSON.stringify(oError));
            }, eTag);
        },

        /**
         * Function to filter assigned classes from the list
         */
        _fnLoadUnassignedClasses: function () {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aAssignedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassList");
            var aAllClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/totalClasses");
            // var aAssignedClassKey = aAssignedClasses.map(function (oClass) {
            //     return oClass.ID;
            // });
            var aUnassignedClasses = [];
            aAllClasses.forEach(function (oClass) {
                var isPresent = false;
                aAssignedClasses.forEach(function(oAssigned){
                    if(oAssigned.ID == oClass.ID && oAssigned.objectTemplateId == oClass.objectTempId){
                        isPresent = true;
                    }
                })
                if (!isPresent && oClass.srcId !== "BTP") {
                    aUnassignedClasses.push(oClass);
                }
            });
            mEquipmentDetail.setProperty("/data/assignments/Classes/totalUnassignedClasses", aUnassignedClasses);
            mEquipmentDetail.setProperty("/data/assignments/Classes/totalClassesTableHeader",that._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader",[aUnassignedClasses.length]));
        },

        /**
         * Function to hanlde selection change for classes assign table
         * @param {Object} oEvent 
         */
        onSelectClassesForAssign: function (oEvent) {
            
            var oModel = this.getView().getModel("mEquipmentDetail");
            // var oTable = sap.ui.getCore().byId("idAssignClasses");
            var aSelectedClass = oModel.getProperty("/data/assignments/Classes/selectedForAssign");
            var isSelected = oEvent.getParameter("selected");
            var aChangedItems = oEvent.getParameter("listItems");

            /**
             * 
             * @param {Array} array 
             * @param {*} item 
             * @param {*} key 
             * @returns 
             */
            function isItemInArray(array, item, key) {
                return array.some(function(arrayItem) {
                    return arrayItem[key] === item[key];
                });
            }

            if (isSelected) {
                aChangedItems.forEach(function (oItem) {
                    var oSelObj = oItem.getBindingContext("mEquipmentDetail").getObject();
                    if (!isItemInArray(aSelectedClass, oSelObj, "ID")) {
                        aSelectedClass.push(oSelObj);
                    }
                });
            } else {
                aChangedItems.forEach(function (oItem) {
                    var oSelObj = oItem.getBindingContext("mEquipmentDetail").getObject();
                    aSelectedClass = aSelectedClass.filter(function (item) {
                        return item.ID !== oSelObj.ID;
                    });
                });
            }

            if (aSelectedClass.length > 0) {
                oModel.setProperty("/data/assignments/Classes/isOkEnabled", true);
            } else {
                oModel.setProperty("/data/assignments/Classes/isOkEnabled", false);
            }

            oModel.setProperty("/data/assignments/Classes/selectedForAssign", aSelectedClass);
        },

        /**
         * Function to refresh class and chars data after unassign
         * @param {Array} aClasses 
         */
        fnRefreshClassCharsData : function(sClassId){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aAssignedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassList");
            var aAssignedChars = mEquipmentDetail.getProperty("/data/assignments/Chars/allChars");
            var aFinal = [];
            var aAssignedClassIds = [];
            if(aAssignedClasses.length > 0){
                aAssignedClasses.forEach(function(oClass){
                    if(oClass.ID != sClassId){
                        aFinal.push(oClass);
                        aAssignedClassIds.push(oClass.displayId);
                    }
                })
            }
            var aCharsFinal = [];
            if(aAssignedChars && aAssignedChars.length > 0){
                aAssignedChars.forEach(function(oChar){
                    if(oChar.classId != sClassId){
                        aCharsFinal.push(oChar);
                    }
                });
            }
            mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassList", aFinal);
            mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassIds", aAssignedClassIds);
            mEquipmentDetail.setProperty("/data/assignments/Chars/allChars", aCharsFinal);

            var aS4Class = [];
            aFinal.sort(function(a, b) {
                var aDesc = a.to_description && a.to_description.length > 0 ? a.to_description[0].shortDescription : "";
                var bDesc = b.to_description && b.to_description.length > 0 ? b.to_description[0].shortDescription : "";
                if(aDesc && bDesc){
                    return aDesc.localeCompare(bDesc);
                }
            });
            aFinal.forEach(function (oClass) {
                if (oClass.srcId && oClass.srcId != "BTP") {
                    aS4Class.push(oClass)
                }
            });
            mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassListS4", aS4Class);

            var aS4Chars = [];
            aCharsFinal.forEach(function (oChar) {
                if (oChar.srcId && oChar.srcId != "BTP") {
                    aS4Chars.push(oChar)
                }
            });
            mEquipmentDetail.setProperty("/data/assignments/Chars/allCharsS4", aS4Chars);
            this.fnSelectFirstClass();
        },

        /**
         * Function to unassign classes
         * @param {Object} oEvent 
         */
        onUnassignClasses: function () {
            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sSelectedKey = mEquipmentDetail.getProperty("/data/assignments/Chars/selectedClassKey");

            if(sSelectedKey){
                MessageBox.confirm(oI18n.getText("asint.equipment.message001"), {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    /**
                     * Function to close the dialog
                     * @param {String} sAction 
                     */
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.YES) {
                            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
                            var aAssignedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassList");
                            // var aSelectedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/selectedForRemove");
                            // var oTable = that.getView().byId("idAssignmentsClasses");
                            var isS4ClassPresent = false;
                            var aS4ClassId = [];
                            if(isS4ClassPresent){
                                return that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message08") + "\n" + aS4ClassId.join(", "));
                            }else{
                                var aClassesFinal = [];
                                if(aAssignedClasses.length > 0){
                                    aAssignedClasses.forEach(function(oAssigned){
                                        var isPresent = false;
                                        if(oAssigned.ID === sSelectedKey){
                                            isPresent = true;
                                        }
                                        if (!isPresent) {
                                            aClassesFinal.push({
                                                classes_ID: oAssigned.ID,
                                                equipment_ID: sEquipmentId,
                                                objectTemplate_ID : oAssigned.objectTemplateId ? oAssigned.objectTemplateId  : null
                                            });
                                        }
                                    })
                                }
                                that.fnMakeApiToCallToUpdateClasses(aClassesFinal, function(sText, oDetail){
                                    if(sText == "Error"){
                                        return that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message07"), oDetail);
                                    }
                                    mEquipmentDetail.setProperty("/data/etag", oDetail["@etag"]);
                                    // oTable.removeSelections();
                                    that.fnMessageShow("S",that._oi18n.getText("asint.equipment.detail.class.message02"),"", function(){
                                        that.fnRefreshClassCharsData(sSelectedKey);
                                    });
                                });
                            }
                        }
                    }
                });
            }else{
                that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message06"));
            }

        },

        /**
         * Function to enable edit for characteristic values
         */
        onCharValuesEditBtnPress: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/data/assignments/Chars/isClassificationEditable", true);
        },

        /**
         * Function to enable edit for characteristic values
         */
        onCanceCharValuesEdit: function () {
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/data/assignments/Chars/isClassificationEditable", false);
        },

    });

})
