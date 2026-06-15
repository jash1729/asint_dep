sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/base/Log"
], function (Controller,
    Fragment,
    MessageBox,
    Filter, FilterOperator, Sorter,Logger) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.Classes", {

        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () {
            this._oLogger =  Logger.getLogger("EquipmentClassesController");
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
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this.isClassDescending = true;
            this.byId("idEquChatFilterInfo").setText("");
            this.byId("idEquCharInfoBar").setVisible(false);
            // this.fnFetchAssignedClasses();
            this.mGroupFunctions = {
                /**
                 * Function to group based on classname
                 * @param {Object} oContext 
                 * @returns Object
                 */
                "className": function (oContext) {
                    var className = oContext.getProperty("className");

                    return {
                        key: className,
                        text: that._oi18n.getText("asint.equipment.tab.chars.filterDialog.class.text") + " : " + className
                    };
                },
                /**
                 * Function to group based on classname
                 * @param {Object} oContext 
                 * @returns Object
                 */
                "srcId": function (oContext) {
                    var srcId = oContext.getProperty("srcId");

                    return {
                        key: srcId,
                        text: that._oi18n.getText("asint.equipment.tab.chars.sourceSystme.label")+" : " + srcId
                    };
                }
            }
        },

        /**
         * Function to unassign classes
         * @param {Object} oEvent 
         */
        onUnassignClasses: function () {
            var that = this;
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var aSelected = mEquipmentDetail.getProperty("/data/assignments/Classes/selectedForRemove");

            if(aSelected.length > 0){
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
                            var aSelectedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/selectedForRemove");
                            var oTable = that.getView().byId("idAssignmentsClasses");
                            var isS4ClassPresent = false;
                            var aS4ClassId = [];
                            aSelectedClasses.forEach(function (oItem) {
                                if(oItem.srcId && oItem.srcId != "BTP"){
                                    isS4ClassPresent = true;
                                    aS4ClassId.push(oItem.displayId);
                                }
                            });
                            if(isS4ClassPresent){
                                return that.fnMessageShow("E",that._oi18n.getText("asint.equipment.detail.class.message08") + "\n" + aS4ClassId.join(", "));
                            }else{
                                // var aSelectedClassKey = aSelectedClasses.map(function (oClass) {
                                //     return oClass.ID ;
                                // });
                                var aClassesFinal = [];
                                if(aAssignedClasses.length > 0){
                                    aAssignedClasses.forEach(function(oAssigned){
                                        /*eslint-disable camelcase*/
                                        // if(!aSelectedClassKey.includes(oAssigned.ID)){
                                        //     aClassesFinal.push({
                                        //         classes_ID: oAssigned.ID,
                                        //         equipment_ID: sEquipmentId,
                                        //         objectTemplate_ID : oAssigned.objectTemplateId ? oAssigned.objectTemplateId  : null
                                        //     });
                                        // }
                                        var isPresent = false;
                                        aSelectedClasses.forEach(function(oClass){
                                            if(oAssigned.ID == oClass.ID && oAssigned.objectTemplateId == oClass.objectTemplateId){
                                                isPresent = true;
                                            }
                                        })
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
                                    oTable.removeSelections();
                                    that.fnMessageShow("S",that._oi18n.getText("asint.equipment.detail.class.message02"),"", function(){
                                        that.fnRefreshClassCharsData(aClassesFinal);
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
         * Function to refresh class and chars data after unassign
         * @param {Array} aClasses 
         */
        fnRefreshClassCharsData : function(aClasses){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aAssignedClasses = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassList");
            var aAssignedChars = mEquipmentDetail.getProperty("/data/assignments/Chars/allChars");
            var aSelectedClassKey = aClasses.map(function (oClass) {
                return oClass.classes_ID + "_" + oClass.objectTemplate_ID;
            });
            var aFinal = [];
            var aAssignedClassIds = [];
            if(aAssignedClasses.length > 0){
                aAssignedClasses.forEach(function(oClass){
                    var sId = oClass.ID + "_" + oClass.objectTemplateId;
                    if(aSelectedClassKey.includes(sId)){
                        aFinal.push(oClass);
                        aAssignedClassIds.push(oClass.displayId);
                    }
                })
            }
            var aCharsFinal = [];
            if(aAssignedChars && aAssignedChars.length > 0){
                aAssignedChars.forEach(function(oChar){
                    var sId = oChar.classId + "_" + oChar.objectTemplateId;
                    if(aSelectedClassKey.includes(sId)){
                        aCharsFinal.push(oChar);
                    }
                });
            }
            mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassList", aFinal);
            mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassIds", aAssignedClassIds);
            mEquipmentDetail.setProperty("/data/assignments/Chars/allChars", aCharsFinal);

            var aBTPClass = [];
            aFinal.sort(function(a, b) {
                var aDesc = a.to_description && a.to_description.length > 0 ? a.to_description[0].shortDescription : "";
                var bDesc = b.to_description && b.to_description.length > 0 ? b.to_description[0].shortDescription : "";
                if(aDesc && bDesc){
                    return aDesc.localeCompare(bDesc);
                }
            });
            aFinal.forEach(function (oClass) {
                if (oClass.srcId && oClass.srcId === "BTP") {
                    aBTPClass.push(oClass)
                }
            });
            mEquipmentDetail.setProperty("/data/assignments/Classes/assignedClassListBTP", aBTPClass);
            mEquipmentDetail.setProperty("/data/assignments/Classes/classTableHeader", this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader", [aBTPClass.length]));

            var aBTPChars = [];
            aCharsFinal.forEach(function (oChar) {
                if (oChar.srcId && oChar.srcId === "BTP") {
                    aBTPChars.push(oChar)
                }
            });
            mEquipmentDetail.setProperty("/data/assignments/Chars/allCharsBTP", aBTPChars);
            mEquipmentDetail.setProperty("/data/assignments/Chars/charTableHeader", this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader", [aBTPChars.length]));
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
         * Function to handle classes search
         * @param {Object} oEvent 
         */
        onSearchClasses : function (oEvent) {
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idAssignmentsClasses");
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
            mEquipmentDetail.setProperty("/data/assignments/Classes/classTableHeader",this._oi18n.getText("asint.equipment.tab.assignments.classes.tableHeader",[filteredItemsLength]));
        },

        /**
         * Function to handle classes sorting
         */
        onSortEquipmentClasses : function(){
            var oTable = this.getView().byId("idAssignmentsClasses"),
                oBinding = oTable.getBinding("items"),
                aSorters = [],
                bDescending;

            bDescending = !this.isClassDescending;
            aSorters.push(new Sorter("displayId", bDescending));
            oBinding.sort(aSorters);

            this.isClassDescending = !this.isClassDescending;
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
                                that.fnFetchAssignedClasses();
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
                if (!isPresent && oClass.srcId === "BTP") {
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
         * Function to hanlde selection change for classes assign table
         * @param {Object} oEvent 
         */
        onSelectionChangeUnassign : function(){
            var oModel = this.getView().getModel("mEquipmentDetail"),
                oTable = this.getView().byId("idAssignmentsClasses");

            var aSelected = oTable.getSelectedItems();
            if (aSelected.length > 0) {
                oModel.setProperty("/data/assignments/Classes/isUnassignEnabled", true);
            } else {
                oModel.setProperty("/data/assignments/Classes/isUnassignEnabled", false);
            }
            var aSelectedClasses = [];
            aSelected.forEach(function (temp) {
                var selObj = temp.getBindingContext("mEquipmentDetail").getObject();
                aSelectedClasses.push(selObj);
            });
            oModel.setProperty("/data/assignments/Classes/selectedForRemove", aSelectedClasses);
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
         * Function to search characteristics
         * @param {Object} oEvent 
         */
        onSearchCharacteristics : function(oEvent){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idAssignmentsChracteristics");
            var sQuery = oEvent.getSource().getValue();
            if(sQuery){
                var aFilters = [
                    new Filter("displayId",FilterOperator.Contains,sQuery), 
                    new Filter("name",FilterOperator.Contains,sQuery), 
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
            mEquipmentDetail.setProperty("/data/assignments/Chars/charTableHeader", this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader",[filteredItemsLength]));
        },

        /**
         * Custom grouping function for characteristics table
         * @param {Object} oGroup 
         * @returns Object
         */
        fnCustomGroupCharTable : function(oGroup){
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sClass = oGroup.getProperty("className");
            return {
                key: sClass,
                text: oI18n.getText("asint.equipment.tab.chars.filterDialog.class.text") +" : " + sClass
            };
        },

        /**
         * Custom grouping function for characteristics table
         * @param {Object} oGroup 
         * @returns Object
         */
        fnCustomGroupClassTable : function(oGroup){
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var sClass = oGroup.getProperty("objectTemplate");
            return {
                key: sClass,
                text: oI18n.getText("asint.equipment.tab.chars.filterDialog.objectTemplate.text")+" : " + sClass
            };
        },

        /**
         * Function to open dialog for characteristic filters
         */
        onCharsFilterBtnPress : function(){
            if (!this._oCharFilterDialog) {
                this._oCharFilterDialog = sap.ui.xmlfragment("idCharFilterDialog", "com.asint.ais.mi.equipment.view.fragment.CharacteristicsFilterSettingsDialog", this);
            }
            this.getView().addDependent(this._oCharFilterDialog);
            this._oCharFilterDialog.open();
        },

        /**
         * Function to handle filter confirm
         * @param {Object} oEvent 
         */
        handleSettingsDialogConfirm: function (oEvent) {
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idAssignmentsChracteristics"),
                oParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aFilters = [],
                aSorters = [],
                aGroups = [],
                vGroup,
                bDescending;

            // Handle our filters
            oParams.filterItems.forEach(function (oItem) {

                var aSplit = oItem.getKey().split("___"),
                    sPath = aSplit[0],
                    sOperator = aSplit[1],
                    sVal1 = aSplit[2],
                    oFilter = new Filter(sPath, sOperator, sVal1);

                aFilters.push(oFilter);
            });

            oBinding.filter(aFilters);
            var filteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/assignments/Chars/charTableHeader", this._oi18n.getText("asint.equipment.tab.assignments.Characteristic.tableHeader",[filteredItemsLength]));

            var sFilterString = oParams.filterString;
            // var sFinalRegex = /\(([^)]+)\)/g;
            // var highlightedString = sFilterString.replace(sFinalRegex, "<b>$1</b>");
            // highlightedString = "<p style='font-size: 14px;'>" + highlightedString + "</p>";
            if(aFilters.length > 0){
                this.byId("idEquCharInfoBar").setVisible(true);
                this.byId("idEquChatFilterInfo").setText(sFilterString);
            }else{
                this.byId("idEquCharInfoBar").setVisible(false);
                this.byId("idEquChatFilterInfo").setText("");
            }

            // Now Handle Sorting
            var sPath = oParams.sortItem.getKey();
            bDescending = oParams.sortDescending;

            aSorters.push(new Sorter(sPath, bDescending));

            oBinding.sort(aSorters);

            // Handle Grouping
            if (oParams.groupItem) {
                sPath = oParams.groupItem.getKey();
                bDescending = oParams.groupDescending;
                vGroup = this.mGroupFunctions[sPath];

                aGroups.push(new Sorter(sPath, bDescending, vGroup));
                oBinding.sort(aGroups);
            }
        },

    });
});