sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/utils/TableP13nEngineHelper"
], function (Controller, Spreadsheet, Filter, FilterOperator, TableP13nEngineHelper) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.RiskSummary", {

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
            this.fnInitTable();

        },

        /**
         * Ui5 lifecycle method triggered on every exiting of the view.
         */
        onExit: function () { },

        /**
         * Method to initialize the content of the view.
         */
        fnInitialize: function () {
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this._oRiskCharMap = {
                "sheAtBaseG":"SHE at Base G",
                "sheAtBaseF":"SHE at Base F",
                "sheAtBaseE":"SHE at Base E",
                "sheAtBaseD":"SHE at Base D",
                "sheAtBaseC":"SHE at Base C",
                "sheAtBaseB":"SHE at Base B",
                "sheAtBaseA":"SHE at Base A",
                "finAtBaseE":"FIN at Base E",
                "finAtBaseD":"FIN at Base D",
                "finAtBaseC":"FIN at Base C",
                "finAtBaseB":"FIN at Base B",
                "finAtBaseA":"FIN at Base A",
                "baseG":"G Through",
                "baseF":"F Through",
                "baseED":"E Through",
                "baseDC":"D Through",
                "baseCB":"C Through",
                "baseBA":"B Through",
                "Athereafter":"A Thereafter",
                "nextReviewDate":"Next Review Date",
                "sheAtDueDate":"SHE at Target Date",
                "finAtDueDate":"FIN at Target Date",
                "sheAtToday":"SHERiskToday'sDate",
                "finAtToday":"FINRiskToday'sDate",
                "finConsequenceBaseA": "FIN Consequence ($K) at Base A",
                "finPOFBaseA": "FIN POF at Base A",
                "finConsequenceBaseB": "FIN Consequence ($K) at Base B",
                "finPOFBaseB": "FIN POF at Base B",
                "finConsequenceBaseC": "FIN Consequence ($K) at Base C",
                "finPOFBaseC": "FIN POF at Base C",
                "finConsequenceBaseD": "FIN Consequence ($K) at Base D",
                "finPOFBaseD": "FIN POF at Base D",
                "finConsequenceBaseE": "FIN Consequence ($K) at Base E",
                "finPOFBaseE": "FIN POF at Base E"

            };
            this.fnFetchEquRiskSummary();
        },

        /**
        * Function to initialize the list view table.
        */
        fnInitTable: function () {

            if (!this.oTableP13nEngineHelperTable1) {
                this.oTableP13nEngineHelperTable1 = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idEqipmentRiskProfile", // Mandatory
                        "settingButton": "idFinalProfileTableP13nSettings"
                    },
                    "event": {
                        "columnListItemPress": this.fnDummyNav, // Mandatory
                        "onDataReceived": this.fnDummyOnDataRecived // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": false,
                        "hideSort":true,
                        "hideGroup":true
                    }
                }, this, ["idEqipmentRiskProfile", "idComponentRiskTable"]);
            }

            if (!this.oTableP13nEngineHelper) {
                this.oTableP13nEngineHelper = new TableP13nEngineHelper({
                    "controlId": {
                        "table": "idComponentRiskTable", // Mandatory
                        "settingButton": "idRiskProfileTableP13nSettings"
                    },
                    "event": {
                        "columnListItemPress": this.fnDummyNav, // Mandatory
                        "onDataReceived": this.fnDummyOnDataRecived // Mandatory
                    },
                    "settings": {
                        "enableVariantManagement": false,
                        "hideSort":true,
                        "hideGroup":true
                    }
                }, this, ["idEqipmentRiskProfile", "idComponentRiskTable"]);
            }

        },

        /**
         * Dummy nav function
         */
        fnDummyNav : function(){},

        /**
         * Dummy nav function
         */
        fnDummyOnDataRecived : function(){},

        /**
         * Function to fetch equipment risk summary data
         */
        fnFetchEquRiskSummary : function(){
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            this.dataSource.getEquipmentRiskProfile(sEquipmentId, function(oData){
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/rawData", oData);
                that.fnFormatRiskSummaryData(oData);
            }, function(){
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/rawData", {});
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.tab.riskSummary.message01"));
            });
        },

        /**
         * Function to format risk data
         */
        fnFormatRiskSummaryData : function(oData){
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aComponentData = mEquipmentDetail.getProperty("/data/tabs/riskSummary/componentRiskData");
            var aFinalRisk = [];
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oRiskMap = this._oRiskCharMap;
            var aTreeData = [];
            var aDataForExport = [];
            var aSelectedIds = [];
            var aDateFields = ["baseG","baseF","baseED","baseDC","baseCB","baseBA","Athereafter"];

            if(oData){
                var aComps = [];
                var aParentAssessments = [];
                aSelectedIds.push(oData.equipmentId);
                if(oData.currentAttachedAssessments && oData.currentAttachedAssessments.length > 0){
                    var oNextReviewDateMap2 = {};
                    oData.currentAttachedAssessments.forEach(function(oAsmt){
                        for (var sKey in oAsmt) {
                            var isNRD = false;
                            var isNonEdd = false;
                            if (oAsmt["assessmentStatus"] === "PBD" && typeof oAsmt[sKey] === "object" && oAsmt[sKey] !== null && !Array.isArray(oAsmt[sKey])) {
                                var oEdd = oAsmt[sKey];
                                var oAssessmentObj = {};
                                oAssessmentObj.parentId = oData.equipmentId;
                                oAssessmentObj.parentEquipmentName = oData.equipmentName;
                                oAssessmentObj.parentEquipmentDesc = oData.equipmentDescription;
                                oAssessmentObj.assessmentId = oAsmt.assessmentId;
                                oAssessmentObj.assessment = oAsmt.assessmentDisplayId;
                                oAssessmentObj.assessmentDesc = oAsmt.assessmentDescription;
                                oAssessmentObj.objectType = oAsmt.assessmentObjectType;
                                oAssessmentObj.section = sKey;

                                for(var sRiskKey in oRiskMap){
                                    if(oEdd[oRiskMap[sRiskKey]]){
                                        if(aDateFields.includes(sRiskKey)){
                                            oAssessmentObj[sRiskKey] = that.formatter.formatDate(oEdd[oRiskMap[sRiskKey]], "");
                                        }else{
                                            oAssessmentObj[sRiskKey] = oEdd[oRiskMap[sRiskKey]];
                                        }
                                    }else{
                                        oAssessmentObj[sRiskKey] = "";
                                    }
                                    if(sRiskKey === "nextReviewDate"){
                                        oAssessmentObj[sRiskKey] = "";
                                    }
                                }

                                if(sKey === "Equipment Data"){
                                    var sNRD = oEdd[oRiskMap["nextReviewDate"]];
                                    if(sNRD){
                                        sNRD = that.formatter.formatDate(sNRD, "");
                                        oNextReviewDateMap2[oAsmt.assessmentId] = sNRD;
                                    }
                                    isNRD = true;
                                }

                                if(!sKey.includes("EDD")){
                                    isNonEdd = true;
                                }

                                if(!isNRD && !isNonEdd){
                                    oAssessmentObj.componentsData = [];
                                    aParentAssessments.push(oAssessmentObj);
                                    aDataForExport.push(oAssessmentObj);
                                }
                            }
                        }
                    });

                    aParentAssessments.forEach(function(oRow){
                        if(Object.keys(oNextReviewDateMap2).length > 0){
                            for(var sAsmtKey in oNextReviewDateMap2){
                                if(oRow.assessmentId === sAsmtKey){
                                    oRow.nextReviewDate = oNextReviewDateMap2[sAsmtKey];
                                }
                            }
                        }
                        aTreeData.push(oRow);
                    });
                    aDataForExport.forEach(function(oRow){
                        if(Object.keys(oNextReviewDateMap2).length > 0){
                            for(var sAsmtKey in oNextReviewDateMap2){
                                if(oRow.assessmentId === sAsmtKey){
                                    oRow.nextReviewDate = oNextReviewDateMap2[sAsmtKey];
                                }
                            }
                        }
                    });
                }
                if(oData.componenAssessments && oData.componenAssessments.length > 0){
                    aComponentData = oData.componenAssessments;
                    var oNextReviewDateMap = {};
                    aComponentData.forEach(function(oComponent){
                        if(oComponent.componentAttachedAssessments && oComponent.componentAttachedAssessments.length > 0){
                            oComponent.componentAttachedAssessments.forEach(function(oAsmt){
                                for (var sKey in oAsmt) {
                                    var isNRD = false;
                                    var isNonEdd = false;
                                    if (oAsmt["assessmentStatus"] === "PBD" && typeof oAsmt[sKey] === "object" && oAsmt[sKey] !== null && !Array.isArray(oAsmt[sKey])) {
                                        var oEdd = oAsmt[sKey];
                                        var oAssessmentObj = {};
                                        oAssessmentObj.equipmentId = oComponent.componentId;
                                        oAssessmentObj.equipmentName = oComponent.componentName;
                                        oAssessmentObj.equipmentDesc = oComponent.ComponentDescription;
                                        oAssessmentObj.assessmentId = oAsmt.assessmentId;
                                        oAssessmentObj.assessment = oAsmt.assessmentDisplayId;
                                        oAssessmentObj.assessmentDesc = oAsmt.assessmentDescription;
                                        oAssessmentObj.objectType = oAsmt.assessmentObjectType;
                                        oAssessmentObj.section = sKey;

                                        for(var sRiskKey in oRiskMap){
                                            if(oEdd[oRiskMap[sRiskKey]]){
                                                if(aDateFields.includes(sRiskKey)){
                                                    oAssessmentObj[sRiskKey] = that.formatter.formatDate(oEdd[oRiskMap[sRiskKey]], "");
                                                }else{
                                                    oAssessmentObj[sRiskKey] = oEdd[oRiskMap[sRiskKey]];
                                                }
                                            }else{
                                                oAssessmentObj[sRiskKey] = "";
                                            }
                                            if(sRiskKey === "nextReviewDate"){
                                                oAssessmentObj[sRiskKey] = "";
                                            }
                                        }

                                        if(sKey === "Equipment Data"){
                                            var sNRD = oEdd[oRiskMap["nextReviewDate"]];
                                            if(sNRD){
                                                sNRD = that.formatter.formatDate(sNRD, "");
                                                oNextReviewDateMap[oAsmt.assessmentId] = sNRD;
                                            }
                                            isNRD = true;
                                        }

                                        if(!sKey.includes("EDD")){
                                            isNonEdd = true;
                                        }

                                        if(!isNRD && !isNonEdd){
                                            oAssessmentObj.componentsData = [];
                                            if(oComponent.ParentEquipmentId === sEquipmentId){
                                                if(!aSelectedIds.includes(oComponent.componentId)){
                                                    aSelectedIds.push(oComponent.componentId);
                                                }
                                                aComps.push(oAssessmentObj);
                                                aDataForExport.push(Object.assign({"parentEquipmentName": oData.equipmentName},oAssessmentObj));
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });

                    aComps.forEach(function(oRow){
                        if(Object.keys(oNextReviewDateMap).length > 0){
                            for(var sAsmtKey in oNextReviewDateMap){
                                if(oRow.assessmentId === sAsmtKey){
                                    oRow.nextReviewDate = oNextReviewDateMap[sAsmtKey];
                                }
                            }
                        }
                    });
                    aDataForExport.forEach(function(oRow){
                        if(Object.keys(oNextReviewDateMap).length > 0){
                            for(var sAsmtKey in oNextReviewDateMap){
                                if(oRow.assessmentId === sAsmtKey){
                                    oRow.nextReviewDate = oNextReviewDateMap[sAsmtKey];
                                }
                            }
                        }
                    });

                    var oTreeObj = {
                        "parentEquipmentName": oData.equipmentName,
                        "parentEquipmentDesc": oData.equipmentDescription,
                        "parentId": oData.equipmentId,
                        "equipmentId": oData.equipmentId,
                        "objectType":"EQUI",
                        "componentsData": aComps
                    };
                    aTreeData.push(oTreeObj);
                    aDataForExport.unshift(oTreeObj);
                    if(!aSelectedIds.includes(oData.equipmentId)){
                        aSelectedIds.push(oData.equipmentId);
                    }
                    // mEquipmentDetail.setProperty("/data/tabs/riskSummary/componentsTreeTableData", oTreeObj);
                }
                
                if(oData.equipmentRiskProfile){
                    var oFinalProfile = oData.equipmentRiskProfile;
                    var oRiskProfileobj = {};
                    for(var sRiskKey in oRiskMap){
                        if(oFinalProfile[oRiskMap[sRiskKey]]){
                            if(aDateFields.includes(sRiskKey)){
                                oRiskProfileobj[sRiskKey] = that.formatter.formatDate(oFinalProfile[oRiskMap[sRiskKey]], "");
                            }else{
                                oRiskProfileobj[sRiskKey] = oFinalProfile[oRiskMap[sRiskKey]];
                            }
                        }else{
                            oRiskProfileobj[sRiskKey] = "";
                        }
                    }
                    aFinalRisk.push(oRiskProfileobj);
                    mEquipmentDetail.setProperty("/data/tabs/riskSummary/equipmentRiskTableHeader", this._oi18n.getText("asint.equipment.tab.riskSummary.tableHeader.equipmentProfile.text",[aFinalRisk.length]));
                    mEquipmentDetail.setProperty("/data/tabs/riskSummary/finalRiskData", aFinalRisk);
                    mEquipmentDetail.setProperty("/data/tabs/riskSummary/sheAtToday", oFinalProfile[oRiskMap["sheAtToday"]]);
                    mEquipmentDetail.setProperty("/data/tabs/riskSummary/finAtToday", oFinalProfile[oRiskMap["finAtToday"]]);

                }

                if (oData.rcmAssessmentFailureModeData && oData.rcmAssessmentFailureModeData.length > 0) {
                    var oEquipNode = {
                        parentEquipmentName: oData.equipmentName,
                        parentEquipmentDesc: oData.equipmentDescription,
                        parentId: oData.equipmentId,
                        objectType: "EQUI",
                        componentsData: [] // Level 2: Maintainable Items
                    };
                
                    var oMaintainableMap = {}; // key = equipmentId::maintainableItemCode
                
                    oData.rcmAssessmentFailureModeData.forEach(function (oAsmt) {

                        if(oAsmt.rcmAssessmentStatus === "PBD") {

                            var sMIKey = oAsmt.equipmentId + "::" + oAsmt.maintainableItemCode;
                
                            if (!oMaintainableMap[sMIKey]) {
                                oMaintainableMap[sMIKey] = {
                                    parentId: oData.equipmentId,
                                    equipmentId: oData.maintainableItemId,
                                    equipmentName: oAsmt.maintainableItemCode,
                                    componentsData: []
                                };
                            }
                
                            var oChild = {
                                parentId: sMIKey,
                                assessmentId: oAsmt.rcmAssessmentId,
                                assessment: oAsmt.rcmAssessmentName,
                                assessmentDesc: oAsmt.rcmAssessmentName,
                                section: oAsmt.failureModeCode,
                                nextReviewDate: that.formatter.formatDate(oAsmt.nextReviewDate, "")
                            };
                
                            for (var sRiskKey in oRiskMap) {
                                if(sRiskKey !== "nextReviewDate"){
                                    if (oAsmt[oRiskMap[sRiskKey]]) {
                                        if (aDateFields.indexOf(sRiskKey) > -1) {
                                            oChild[sRiskKey] = that.formatter.formatDate(oAsmt[oRiskMap[sRiskKey]], "");
                                        } else {
                                            oChild[sRiskKey] = oAsmt[oRiskMap[sRiskKey]];
                                        }
                                    } else {
                                        oChild[sRiskKey] = "";
                                    }
                                }
                            }
                
                            oMaintainableMap[sMIKey].componentsData.push(oChild);
                            aDataForExport.push(oChild);
                        }
                    });
                
                    for (var sMIKey in oMaintainableMap) {
                        oEquipNode.componentsData.push(oMaintainableMap[sMIKey]);
                    }
                
                    aTreeData.push(oEquipNode);
                    aParentAssessments.push(oEquipNode);
                    aDataForExport.unshift(oEquipNode);
                }
                
                // var sTotalLength = aParentAssessments.length + aComps.length + 1;

                var sTotalLength = aDataForExport.length + 2;
                
                if(sTotalLength > 10){
                    mEquipmentDetail.setProperty("/data/tabs/riskSummary/visibleRowCount", 10);
                }else{
                    mEquipmentDetail.setProperty("/data/tabs/riskSummary/visibleRowCount", sTotalLength);
                }
                var iCount = (aParentAssessments.length === 0 && aComps.length === 0) ? 0 : aParentAssessments.length + aComps.length + 1;
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/componentRiskTableHeader", this._oi18n.getText("asint.equipment.tab.riskSummary.tableHeader.equipment.text",[iCount]));
            }

            var oFinalTree = {
                "componentsData": aTreeData
            };
            mEquipmentDetail.setProperty("/data/tabs/riskSummary/componentsTreeTableData", oFinalTree);
            mEquipmentDetail.setProperty("/data/tabs/riskSummary/componentsTableDataExport", aDataForExport);
            if (aSelectedIds.length > 0) {
                this.fnFetchRecommendations(aSelectedIds);
            } else {
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/recommendationsList", []);
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/recommendationTableHeader", that._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[0]));
            }
        },

        /**
         * Function to export risk profile data to excel
         */
        onRiskProfileExcelExport : function(){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquName = mEquipmentDetail.getProperty("/data/detail/name");
            var sFileName = sEquName + "_RiskSummary";
            this.fnExportTableDatatoExcel("idEqipmentRiskProfile", sFileName);
        },

        /**
         * Function to export risk profile data to excel
         */
        onPressComponentsExport : function(){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquName = mEquipmentDetail.getProperty("/data/detail/name");
            var sFileName = sEquName + "_ComponentsSummary";
            var oTable = this.getView().byId("idComponentRiskTable");
            var aCols = oTable.getColumns();
            var aColConfig = this.fnExportTableGetColumnConfig(aCols, "sap.ui.table.Table");
            var oSetting = {
                workbook: {
                    columns: aColConfig,
                    context: {
                        sheetName: "Export"
                    }
                },
                fileName: sFileName,
                dataSource : mEquipmentDetail.getProperty("/data/tabs/riskSummary/componentsTableDataExport")
            };
            var oSheet = new Spreadsheet(oSetting);
				
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        },

        /**
         * Function to search components risk table
         */
        onSearchComponentsRisk : function(oEvent){
            var sQuery = oEvent.getSource().getValue();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            sQuery = sQuery.trim();
            var oFilterArr = [];
            if (sQuery === "") {
                oFilterArr = [];
            } else {
                oFilterArr = new Filter([
                    new Filter("equipmentName", FilterOperator.Contains, sQuery),
                    new Filter("section", FilterOperator.Contains, sQuery),
                    new Filter("assessment", FilterOperator.Contains, sQuery),
                ], false);
            }
            this.byId("idComponentRiskTable").getBinding("rows").filter(oFilterArr);
            var iLength = this.byId("idComponentRiskTable").getBinding("rows").getLength();
            mEquipmentDetail.setProperty("/data/tabs/riskSummary/componentRiskTableHeader", this._oi18n.getText("asint.equipment.tab.riskSummary.tableHeader.equipment.text",[iLength]));
            if(iLength > 10){
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/visibleRowCount", 10);
            }else{
                mEquipmentDetail.setProperty("/data/tabs/riskSummary/visibleRowCount", iLength + 1);
            }
        },

        /**
         * This function processes the selected rows in the table.
         * 
         * and will fetch the recommendations for the selected rows.
         */
        onRowSelection: function () {

            // var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var aTable = this.getView().byId("idComponentRiskTable");
            var aSelectedItems = [];
            var aSelectedIds = [];
            var aSelectedIndex = aTable.getSelectedIndices();

            aSelectedIndex.forEach(function (oIndex) {
                var oContext = aTable.getContextByIndex(oIndex);
                var oData = oContext.getObject();
                if (oData) {
                    if(!aSelectedIds.includes(oData.equipmentId)){
                        aSelectedItems.push(oData);
                        aSelectedIds.push(oData.equipmentId);
                    }
                }
            });

            if (aSelectedIds.length > 0) {
                oModel.setProperty("/data/tabs/riskSummary/selectedRows", aSelectedItems);
                // oModel.setProperty("/data/tabs/riskSummary/isRecoTableVisible", true);
                this.fnFetchRecommendations(aSelectedIds);
            } else {
                oModel.setProperty("/data/tabs/riskSummary/selectedRows", []);
                oModel.setProperty("/data/tabs/riskSummary/isRecoTableVisible", false);
            }
        },

        /**
         * Function to fetch recommendations for selected components
         * @param {Array} aSelectedId 
         */
        fnFetchRecommendations : function(aSelectedId){
            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            var sType = "EQUI";
            that.workBench.getRecommendationsForComponents(sType, aSelectedId, function(oData){
                var aRecos = [];
                if(oData && oData.length > 0){
                    oData.forEach(function(oReco){
                        oReco.recoStatusDesc = that.formatter.fnRecoStatusFormatter(oReco.recommendationStatus);
                        oReco.dueDate = that.formatter.formatDate(oReco.dueDate,"");
                        if(oReco.assessmentEquipmentName && oReco.assessmentEquipmentId != oReco.equipmentId){
                            oReco.componentMaintainableItem = oReco.assessmentEquipmentName;
                            oReco.componentMaintainableItemDesc = oReco.assessmentEquipmentDescription;
                        }
                        if(oReco.failureDataCodeName || oReco.failureDataCodeText){
                            if(!oReco.parentObjectName){
                                oReco.parentObjectName = oReco.equipmentName;
                                oReco.parentObjectDesc = oReco.equipmentDescription;
                            }
                            oReco.equipmentName = oReco.failureDataCodeName;
                            oReco.equipmentDescription = oReco.failureDataCodeText;
                        }
                        if(oReco.recommendationRiskFields && oReco.recommendationRiskFields.length > 0){
                            var sSectionName = "";
                            oReco.recommendationRiskFields.forEach(function(oRisk){
                                if(oRisk.sectionName && !sSectionName.includes(oRisk.sectionName)){
                                    if(sSectionName){
                                        sSectionName = sSectionName + ", " + oRisk.sectionName;
                                    }else{
                                        sSectionName = oRisk.sectionName;
                                    }
                                }
                                if(oRisk.sheRiskAtDueDate){
                                    oReco.sheRiskAtDueDate = oRisk.sheRiskAtDueDate;
                                }
                                if(oRisk.finRiskAtDueDate){
                                    oReco.finRiskAtDueDate = oRisk.finRiskAtDueDate;
                                }
                            });
                            oReco.sectionName = sSectionName;
                        }
                    });
                    aRecos = oData;
                }
                oModel.setProperty("/data/tabs/riskSummary/recommendationsList", aRecos);
                oModel.setProperty("/data/tabs/riskSummary/recommendationTableHeader", that._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[aRecos.length]));
                oModel.setProperty("/data/tabs/riskSummary/isRecoTableVisible", true);
                that.fnFetchRCMRecommendations(aSelectedId);
            }, function(){
                oModel.setProperty("/data/tabs/riskSummary/recommendationsList", []);
                oModel.setProperty("/data/tabs/riskSummary/recommendationTableHeader", that._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[0]));
                oModel.setProperty("/data/tabs/riskSummary/isRecoTableVisible", false);
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.tab.riskSummary.message02"));
                that.fnFetchRCMRecommendations(aSelectedId);
            });
        },

        /**
         * Function to handle reco link press
         */
        onRecommendationLinkPress : function(oEvent){
            var that = this;
            var oSelectedRec = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sHashWithKeyword = this.NAVIGATION.RECOMMENDATION_WORKBENCH_DETAIL;
            // sHashWithKeyword = sHashWithKeyword.replace(/{recommId}/g, oSelectedRec.recoId);
            sHashWithKeyword = sHashWithKeyword.replace("{recoGuid}", oSelectedRec.recoId);
            var sRecoType = "AIS";
            var sRecoGuid = oSelectedRec.recoId;
            if(oSelectedRec.apmRecommendationId){
                sRecoType = "APM";
                sRecoGuid = oSelectedRec.apmRecommendationId;
            }
            sHashWithKeyword = sHashWithKeyword.replace("{recoType}", sRecoType);
            sHashWithKeyword = sHashWithKeyword.replace("{recommendationId}", sRecoGuid);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        },

        /**
         * Function to navigate to assessment
         */
        onPressAssessmentLinkRiskSummary : function(oEvent){
            var oSelected = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sId = oSelected.assessmentId;
            if(sId){
                if (oSelected.assessment.includes("RCM")) {
                    this.fnNavigateToRCMDetail(sId);
                } else {
                    this.fnNavigateToAssetStrategyDetail(sId);
                }
            }else{
                this.fnMessageShow("E", this._oi18n.getText("asint.equipment.advFilter.message03"));
            }
        },

        /**
         * Function to search components risk table
         */
        onSearchRecommendation : function(oEvent){
            var sQuery = oEvent.getSource().getValue();
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            sQuery = sQuery.trim();
            var oFilterArr = [];
            if (sQuery === "") {
                oFilterArr = [];
            } else {
                oFilterArr = new Filter([
                    new Filter("parentObjectName", FilterOperator.Contains, sQuery),
                    new Filter("parentObjectDesc", FilterOperator.Contains, sQuery),
                    new Filter("equipmentName", FilterOperator.Contains, sQuery),
                    new Filter("equipmentDescription", FilterOperator.Contains, sQuery),
                    new Filter("sectionName", FilterOperator.Contains, sQuery),
                    new Filter("recoDisplayId", FilterOperator.Contains, sQuery),
                    new Filter("recoDesc", FilterOperator.Contains, sQuery),
                    new Filter("recoStatusDesc", FilterOperator.Contains, sQuery)
                ], false);
            }
            this.byId("idComponentRecommendations").getBinding("items").filter(oFilterArr);
            var iLength = this.byId("idComponentRecommendations").getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/tabs/riskSummary/recommendationTableHeader", this._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[iLength]));
        },

        /**
         * Function to export risk profile data to excel
         */
        onPressComponentsRecommendationExport : function(){
            var sFileName = "Recommendations";
            this.fnExportTableDatatoExcel("idComponentRecommendations", sFileName);
        },

        /**
         * Function to fetch RCM Assessment
         * 
         * @param {Array} aSelectedId - Array of Equipment Ids
         */
        fnFetchRCMRecommendations: function (aSelectedId) {

            var that = this;
            var oModel = that.getView().getModel("mEquipmentDetail");
            var aReco = oModel.getProperty("/data/tabs/riskSummary/recommendationsList");
            var oPayload = {
                "equipmentIds": aSelectedId,
                "functionalLocationIds": []
            };

            that.commonDataSource.getRecommendation("RCM", oPayload, function (oDataRec) {
                var aFinalData = [];
                oDataRec.forEach(function(oItem){
                    var sMaintinableItem = "";
                    var sFailureMode = "";
                    if (oItem.rcmAssessmentData.length > 0) {
                        if (oItem.rcmAssessmentData[0].rcmMaintainableItemName && oItem.rcmAssessmentData[0].rcmMaintainableItemText) {
                            sMaintinableItem = oItem.rcmAssessmentData[0].rcmMaintainableItemText + " ("+ oItem.rcmAssessmentData[0].rcmMaintainableItemName +")";
                        } else {
                            sMaintinableItem = "";
                        }
                    }

                    if (oItem.rcmAssessmentData.length > 0) {
                        if (oItem.rcmAssessmentData[0].rcmfailureModeText && oItem.rcmAssessmentData[0].rcmfailureModeName) {
                            sFailureMode = oItem.rcmAssessmentData[0].rcmfailureModeText + " ("+ oItem.rcmAssessmentData[0].rcmfailureModeName +")";
                        } else {
                            sFailureMode = "";
                        }
                    }

                    var oTemp = {
                        "equipmentName": oItem.to_equipment[0].equiName,
                        "equipmentDescription": oItem.to_equipment[0].equiDesc,
                        "componentMaintainableItem": sMaintinableItem,
                        "sectionName": sFailureMode,
                        "recoDisplayId": oItem.displayId,
                        "recoDesc": oItem.recommendationDescription,
                        "dueDate": that.formatter.formatDate(oItem.validTo),
                        "sheRiskAtDueDate": oItem.sheRiskAtDueDate,
                        "finRiskAtDueDate": oItem.finRiskAtDueDate,
                        "sheMRAtDueDate": oItem.sheMRAtDueDate,
                        "finMRAtDueDate": oItem.finMRAtDueDate,
                        "recommendationStatus": oItem.recommendationstatus,
                        "recoId":oItem.recommendation_ID
                    };

                    aFinalData.push(oTemp);

                    aReco = aReco.filter(function(orec){
                        return orec.recoId !== oTemp.recoId
                    });
                });

                aReco = aReco.concat(aFinalData);
                oModel.setProperty("/data/tabs/riskSummary/recommendationsList", aReco);
                oModel.setProperty("/data/tabs/riskSummary/recommendationTableHeader", that._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[aReco.length]));
            }, function () {
                oModel.setProperty("/data/tabs/riskSummary/recommendationsList", aReco);
                oModel.setProperty("/data/tabs/riskSummary/recommendationTableHeader", that._oi18n.getText("asint.equipment.detail.tab.assetIntelligence.recommendation.table.header",[0]));
                that.fnMessageShow("E", that._oi18n.getText("asint.equipment.detail.tab.riskSummary.message02"));
            });
        }
    });

})
