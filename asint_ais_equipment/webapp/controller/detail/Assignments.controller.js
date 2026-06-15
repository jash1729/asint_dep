sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/base/Log"
], function (BaseController, Sorter, Filter, FilterOperator,Logger) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Assignments", {

        /**
         * Initializes the component
         * This function is called when the component is initialized
         * It attaches the 'fnInitialize' function to the "nEquipmentDetail" route pattern matched event
         */
        onInit: function () {
            this._oLogger =  Logger.getLogger("EquipmentAssignmentsController");
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);

        },

        /**
         * This function is called after the component has been rendered
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },

        /**
         * Call the Object Template list using Equipment ID
         */
        fnInitialize: function () {

            var that = this;
            this._oi18n = this.getView().getModel("i18n").getResourceBundle();
            this._oDefaultFilter;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            this.isObjectTemplateDescending = false;
            var isFirstTabLoaded = mEquipmentDetail.getProperty("/data/assignments/isAssignmentsTabLoaded");
            var mEquipmentModel = that.getView().getModel("mEquipment");
            var sFlag = mEquipmentModel.getProperty("/metadata/featureFlag/equipmentEnableFailureDataProfile");
            if(!isFirstTabLoaded){
                mEquipmentDetail.setProperty("/data/assignments/isAssignmentsTabLoaded", true);
                that.fnGetAssignedObjectTemplateList(sEquipmentId);
                if(sFlag === "1"){
                    that.fnGetEquipmentFailurDataProfile();
                }
            }

        },

        /**
         * Function to get the FailureDataProfile data 
         */
        fnGetEquipmentFailurDataProfile:function () {

            var that = this;
            var oI18n = this._oi18n;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");

            that.dataSource.getEquipmentFailurDataLibrary(sEquipmentId,function(oResponse) {
                var aToProfiles = oResponse.to_failure_data_profiles || [];
                var aProfiles = aToProfiles.map(function (oItem) {
                    return oItem.failureDataProfile;
                });

                mEquipmentDetail.setProperty("/data/assignments/failureDataProfile/profileList",aProfiles);
                mEquipmentDetail.setProperty("/data/assignments/failureDataProfile/profileTableHeader", that._oi18n.getText("asint.equipment.tab.assignments.failureDataProfile.tableHeader", [aProfiles.length]));

            },function(oError) {
                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.failureDataProfile.message01"), oError);
            });
        },


        /**
         * Fetch Object Template based on Equipment ID
         * 
         * @param {String} sEquipmentId - Equipment ID
         */
        fnGetAssignedObjectTemplateList: function (sEquipmentId, fnFinalCallBack) {

            var that = this;
            var mEquipmentDetail = that.getView().getModel("mEquipmentDetail");
            var objectTemplateMaster = mEquipmentDetail.getProperty("/data/master/objectTemplate/map");
            var oClassDict = mEquipmentDetail.getProperty("/data/master/classes/map");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();

            that.dataSource.getObjectTemplateByEquipmentId(sEquipmentId, function (oEquipmentDetail) {
                /**
                 * Local call back function
                 */
                var fnLocalCallBack = function(){
                    if(oEquipmentDetail.to_object_template && oEquipmentDetail.to_object_template.length > 0){
                        oEquipmentDetail.to_object_template.forEach(function(oTemp){
                            if(objectTemplateMaster[oTemp.objectTemplate_ID]){
                                var oTemplateData = objectTemplateMaster[oTemp.objectTemplate_ID];
                                if(oTemplateData.to_class && oTemplateData.to_class.length > 0){
                                    var aClass = $.extend([],oTemplateData.to_class);
                                    if(oTemp.objectTemplate){
                                        // eslint-disable-next-line camelcase
                                        oTemp.objectTemplate.to_class = aClass;
                                    }
                                }
                            }
                        })
                    }
                    that.fnMapValues(oEquipmentDetail);
                    that.fnFetchAssignedClasses(fnFinalCallBack);
                };

                var aObjectTemplates = [], aObjectTemplateId = [];
                /**
                 * Function to handle complete
                 */
                var fnObjectTemplateComplete = function () {
                    aObjectTemplates.forEach(function (oObjectTemplate) {
                        oObjectTemplate.ID = oObjectTemplate.id;
                        oObjectTemplate.name = oObjectTemplate.templateName;
                        oObjectTemplate.type = oObjectTemplate.templateType;
                        delete oObjectTemplate.id;
                        delete oObjectTemplate.templateName;
                        delete oObjectTemplate.templateType;
                        /* eslint-disable camelcase */
                        oObjectTemplate.to_class = oObjectTemplate.classes || [];
                        delete oObjectTemplate.classes;
                        /* eslint-disable camelcase */
                        oObjectTemplate.to_class = oObjectTemplate.to_class.map(function (oClass) {
                            oClass.ID = oClass.id;
                            oClass.classNumber = oClass.number;
                            oClass.classStatus = oClass.status;
                            oClass.classType = oClass.type;
                            oClass.classGroup = oClass.group;
                            delete oClass.id;
                            delete oClass.number;
                            delete oClass.status;
                            delete oClass.type;
                            delete oClass.group;
                            /* eslint-disable camelcase */
                            oClass.to_characteristic = oClass.characteristics || [];
                            delete oClass.characteristics;
                            /* eslint-disable camelcase */
                            oClass.to_characteristic = oClass.to_characteristic.map(function (oCharacteristic) {
                                oCharacteristic.ID = oCharacteristic.id;
                                /* eslint-disable camelcase */
                                oCharacteristic.codeList_ID = null;
                                oCharacteristic.codelist = oCharacteristic.codeList;
                                delete oCharacteristic.codeList;
                                if (oCharacteristic.codelist) {
                                    /* eslint-disable camelcase */
                                    oCharacteristic.codeList_ID = oCharacteristic.codelist.id;
                                    /* eslint-disable camelcase */
                                    oCharacteristic.codelist.to_codeListItem = oCharacteristic.codelist.codeListItems || [];
                                    delete oCharacteristic.codelist.codeListItems;
                                    oCharacteristic.codelist.to_codeListItem.forEach(function (oCodeListItem) {
                                        oCodeListItem.ID = oCodeListItem.id;
                                        oCodeListItem.to_description = oCodeListItem.descriptions || [];
                                        delete oCodeListItem.descriptions;
                                    });
                                    /* eslint-disable camelcase */
                                    oCharacteristic.codelist.to_description = oCharacteristic.codelist.descriptions || [];
                                    delete oCharacteristic.codelist.descriptions;
                                }
                                /* eslint-disable camelcase */
                                oCharacteristic.to_description = oCharacteristic.descriptions || [];
                                delete oCharacteristic.descriptions;
                                return {
                                    classes_ID: oClass.ID,
                                    characteristicId_ID: oCharacteristic.ID,
                                    deleted: false,
                                    characteristic: oCharacteristic
                                };
                            });

                            /* eslint-disable camelcase */
                            oClass.to_description = oClass.descriptions || [];
                            delete oClass.descriptions;
                            return {
                                "objectTemplate_ID": oObjectTemplate.ID,
                                "classes_ID": oClass.ID,
                                "deleted": false,
                                "classes": oClass
                            };
                        });
                    });
                    
                    aObjectTemplates.forEach(function(oTemp){
                        var aClass = [];
                        objectTemplateMaster[oTemp.ID] = oTemp;
                        if(oTemp.to_class && oTemp.to_class.length > 0){
                            aClass = oTemp.to_class;
                        }
                        if(aClass && aClass.length > 0){
                            aClass.forEach(function(oClass){
                                var oClData = oClass.classes;
                                if(oClData){
                                    oClassDict[oClData.ID] = oClData;
                                }
                            });
                        }
                    });

                    mEquipmentDetail.setProperty("/data/master/objectTemplate", {
                        "map": objectTemplateMaster,
                        "list": Object.values(objectTemplateMaster)
                    });
                    mEquipmentDetail.setProperty("/data/master/classes", {
                        "map": oClassDict,
                        "list": Object.values(oClassDict)
                    });
                    fnLocalCallBack();
                };

                for (var i in oEquipmentDetail.to_object_template) {
                    var sObjTempId = oEquipmentDetail.to_object_template[i].objectTemplate_ID;
                    if(!objectTemplateMaster[sObjTempId]){
                        aObjectTemplateId.push(oEquipmentDetail.to_object_template[i].objectTemplate_ID);
                    }
                }

                if(aObjectTemplateId.length > 0){
                    that.fnProcessBulkGetRequest(aObjectTemplateId, function (sObjectTemplateId, fnCallback) {
                        that.ASDdataSource.getObjectTemplateExpanded(sObjectTemplateId, function (oResponse) {
                            aObjectTemplates.push(oResponse);
                            fnCallback();
                        }, function () {
                            fnCallback();
                        });
                    }, fnObjectTemplateComplete);
                }else{
                    fnLocalCallBack();
                }
            }, function (oError) {
                mEquipmentDetail.setProperty("/data/assignments/objectTemplate/templateHeaderCount", oI18n.getText("asint.equipment.tab.assessments.objectTemplate.title", [0]));
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if (err.error.message) {
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message04"), errorDetail);
                that._oLogger.error("An Error Occurred In getObjectTemplateByEquipmentId :",JSON.stringify(oError));
            });

        },

        /**
         * Assign the Object Template to the table
         */
        onAssignEquipmentTemplateNoUse: function () {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aAssignedTemplate = mEquipmentDetail.getProperty("/data/templatesData/assignedTemplates");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = mEquipmentDetail.getProperty("/data/etag");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();

            /**
             * 
             * @param {*} oReturn 
             */
            var fnComplete = function (oReturn) {
                if (oReturn.status === "finished") {
                    if (oReturn.selected.length > 0) {
                        var aAlreadySelected = [];

                        var sSrcId = oEquipmentDetail.srcId;
                        if(sSrcId !== "BTP"){
                            var isS4Selected = false;
                            oReturn.selected.forEach(function(oData){
                                if(oData.srcId !== "BTP"){
                                    isS4Selected = true;
                                }
                            });
                            if(isS4Selected){
                                return that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.s4Validation.message01"));
                            }
                        }

                        oReturn.selected.forEach(function (oData) {
                            var oSelectedData = aAssignedTemplate.find(function (oItem) {
                                return oItem.ID === oData.ID;
                            });
                            if (oSelectedData) {
                                aAlreadySelected.push(oSelectedData.displayId);
                            }
                        });

                        if (aAlreadySelected.length > 0) {
                            that.fnMessageShow("I", oI18n.getText("asint.equipment.detail.message09"), aAlreadySelected.join(","));
                        } else {
                            oReturn.selected.forEach(function (oItem) {
                                aAssignedTemplate.unshift(oItem);
                            });

                            var aObjectTemplateId = [];

                            aAssignedTemplate.forEach(function (oItem) {
                                aObjectTemplateId.push({
                                    "objectTemplate_ID": oItem.ID
                                })
                            });

                            var oPayload = {
                                "to_object_template": aObjectTemplateId,
                                "ID": sEquipmentId,
                                "deleted": false
                            };
                            oPayload=that.setCreatedModified(oPayload,"PUT",oEquipmentDetail);
                            that.dataSource.updateEquipmentObjectTemplates(sEquipmentId, oPayload, function (oAssignedTemplate) {
                                mEquipmentDetail.setProperty("/data/etag", oAssignedTemplate["@etag"]);
                                // that.fnMapValues(oAssignedTemplate);
                                that.fnFetchAsmtTemplateUpdateRepairFlag(function(){
                                    that.fnMessageShow("S", oI18n.getText("asint.equipment.detail.message06"));
                                    that.fnGetAssignedObjectTemplateList(sEquipmentId);
                                });
                            }, function (oError) {
                                var err = JSON.parse(oError.responseText);
                                var errorDetail = "";
                                if (err.error.message) {
                                    errorDetail = err.error.message;
                                }
                                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message05"), errorDetail);
                                that._oLogger.error("An Error Occurred In updateEquipmentDetail :",JSON.stringify(oError));
                            }, eTag);
                        }
                    }
                }
            };

            window._objectType = "EQUI";
            this.objectTemplateValueHelp.handleObjectTemplateValueHelp(fnComplete, true);

        },

        /**
         * Unassign the selected Object Template
         */
        onRemoveTemplate: function () {

            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aSelectedTemplates = mEquipmentDetail.getProperty("/data/assignments/objectTemplate/selectedTemplate");
            var aAssignedClassIds = mEquipmentDetail.getProperty("/data/assignments/Classes/assignedClassIds");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();
            var oTable = this.getView().byId("idTableObjectTemplate");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = oEquipmentDetail["@etag"];
            var oPayload = {};

            if (aSelectedTemplates.length > 0) {
                var aCurMappedTemplates = mEquipmentDetail.getProperty("/data/templatesData/assignedTemplates");
                var aCurMappedTemplatesFinal = [];
                var i=0;
                for ( i = 0; i < aCurMappedTemplates.length; i++) {
                    var templateObj = {
                        /*eslint-disable camelcase*/
                        objectTemplate_ID: aCurMappedTemplates[i].ID
                    };
                    aCurMappedTemplatesFinal.push(templateObj);
                }

                for ( i = 0; i < aSelectedTemplates.length; i++) {
                    var aSelectedClasses =  aSelectedTemplates[i].to_class ? aSelectedTemplates[i].to_class : [];
                    for(var j = 0;j < aSelectedClasses.length; j++){
                        if(aAssignedClassIds.includes(aSelectedClasses[j].classes.displayId)){
                            that.fnMessageShow("I", oI18n.getText("asint.equipment.detail.message020"));
                            return;
                        }
                    }
                    var iIndex;
                    for (var k = 0; k < aCurMappedTemplatesFinal.length; k++) {
                        if (aSelectedTemplates[i].ID === aCurMappedTemplatesFinal[k].objectTemplate_ID) {
                            iIndex = k;
                        }
                    }
                    if (iIndex == 0 || iIndex > 0) {
                        aCurMappedTemplatesFinal.splice(iIndex, 1);
                    }
                }

                oPayload = {
                    "to_object_template": aCurMappedTemplatesFinal,
                    "ID": sEquipmentId,
                    "deleted": false
                };
                
                that.fnMessageShow("C", oI18n.getText("asint.equipment.detail.message010"), "", function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.YES) {
                        oPayload=that.setCreatedModified(oPayload,"PUT",oEquipmentDetail);
                        that.dataSource.updateEquipmentObjectTemplates(sEquipmentId, oPayload, function (oAssignedTemplate) {
                            that.fnMapValues(oAssignedTemplate);
                            mEquipmentDetail.setProperty("/data/assignments/objectTemplate/selectedTemplate", []);
                            if (oTable) {
                                oTable.removeSelections();
                            }
                            that.fnMessageShow("S", oI18n.getText("asint.equipment.detail.message07"));
                            mEquipmentDetail.setProperty("/metadata/enabled/unassign", false);
                        }, function (oError) {
                            var err = JSON.parse(oError.responseText);
                            var errorDetail = "";
                            if (err.error.message) {
                                errorDetail = err.error.message;
                            }
                            that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message04"), errorDetail);
                            that._oLogger.error("An Error Occurred In updateEquipmentDetail :",JSON.stringify(oError));
                        }, eTag);
                    }
                });
            } else {
                that.fnMessageShow("I", oI18n.getText("asint.equipment.detail.message08"));
            }
        },

        /**
         * Function to search equipment templates in the table.
         * @param {Object} oEvent
         */
        onSearchEquipmentTemplate: function (oEvent) {
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idTableObjectTemplate");
            var sQuery = oEvent.getSource().getValue();
            if (sQuery) {
                var aFilters = [
                    new Filter("displayId", FilterOperator.Contains, sQuery),
                    new Filter("name", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({
                    filters: aFilters,
                    and: false
                }));
            } else {
                oTable.getBinding("items").filter([]);
            }
            var filteredItemsLength = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/assignments/objectTemplate/templateHeaderCount",this._oi18n.getText("asint.equipment.tab.assessments.objectTemplate.title",[filteredItemsLength]));
        },

        /**
         * Maps assignedTemplates,templateList,totalClasses,objectTemplateMap,
         * templateHeaderCount values
         * @param {object} oAssignedTemplate 
         */
        fnMapValues : function(oAssignedTemplate){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oI18n = this.getView().getModel("i18n").getResourceBundle();
            var objectTemplateMaster = mEquipmentDetail.getProperty("/data/master/objectTemplate/map");
            var aAssignedObjectTemplateList = [];
            var aAllClasses = [];
            var oClassObjTmplateMap = {};

            oAssignedTemplate.to_object_template.forEach(function (oObjectTemplate) {
                var oObjectTemplateData = objectTemplateMaster[oObjectTemplate.objectTemplate_ID];
                aAssignedObjectTemplateList.push(oObjectTemplate.objectTemplate);
                var aClass = oObjectTemplateData.to_class;
                if (aClass && aClass.length > 0) {
                    aClass.forEach(function (oClass) {
                        var oObjClass = oClass.classes;
                        oObjClass.objectTemplate = oObjectTemplateData.name;
                        oObjClass.objectTempId = oObjectTemplateData.ID;
                        if (oObjClass) {
                            aAllClasses.push(oObjClass);
                        }
                        var oMapObj = {
                            "name":oObjectTemplateData.name,
                            "ID":oObjectTemplate.objectTemplate_ID
                        }
                        oClassObjTmplateMap[oObjClass.ID + "_" + oObjectTemplate.objectTemplate_ID] = oMapObj;
                        oClassObjTmplateMap[oObjClass.ID] = oMapObj;
                    });
                }
            });

            mEquipmentDetail.setProperty("/data/templatesData/assignedTemplates", aAssignedObjectTemplateList);
            mEquipmentDetail.setProperty("/data/assignments/objectTemplate/templateList", aAssignedObjectTemplateList);
            mEquipmentDetail.setProperty("/data/assignments/Classes/totalClasses", aAllClasses);
            mEquipmentDetail.setProperty("/data/assignments/Classes/objectTemplateMap",oClassObjTmplateMap);
            mEquipmentDetail.setProperty("/data/assignments/objectTemplate/templateHeaderCount", oI18n.getText("asint.equipment.tab.assessments.objectTemplate.title", [aAssignedObjectTemplateList.length]));
        },

        /**
         * Function to fetch assessment templates and update repair component text
         */
        fnFetchAsmtTemplateUpdateRepairFlag : function(fnCallBack){
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = mEquipmentDetail.getProperty("/data/etag");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();
            var isRepairAsmtTemplateAssigned = false;

            this.ASDdataSource.getAssessmentTemplatesByEquipment(sEquipmentId, function (oResponse) {
                var data = oResponse.to_object_template;
                for (let currentObjectTemplate of data) {
                    if (currentObjectTemplate.objectTemplate && currentObjectTemplate.objectTemplate.to_assessment_templates) {
                        for (let assessmentObj of currentObjectTemplate.objectTemplate.to_assessment_templates) {
                            var oAsmtTemplate = assessmentObj.assessmentTemplate;
                            if (oAsmtTemplate && oAsmtTemplate.repairComponentTemplate) {
                                isRepairAsmtTemplateAssigned = true;
                            }
                        }
                    }
                }
                if(isRepairAsmtTemplateAssigned){
                    var oPayload = {
                        "ID": sEquipmentId,
                        "flagComponent": "Temporary Repair Component"
                    };
                    oPayload=that.setCreatedModified(oPayload,"PUT",oEquipmentDetail);
                    that.dataSource.updateEquipmentObjectTemplates(sEquipmentId, oPayload, function (oAssignedTemplate) {
                        mEquipmentDetail.setProperty("/data/etag", oAssignedTemplate["@etag"]);
                        mEquipmentDetail.setProperty("/data/detail/flagComponent", "Temporary Repair Component");
                        mEquipmentDetail.setProperty("/data/detailBackup/flagComponent", "Temporary Repair Component");
                        fnCallBack();
                    }, function () {
                        that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.assignment.message01"));
                    }, eTag);
                }else{
                    fnCallBack();
                }
            }, function () {
                that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.assignment.message01"));
            });
        },

        /**
         * Unassign Object Template row select change
         */
        onObjectTemplateSelect: function () {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oTable = this.getView().byId("idTableObjectTemplate");
            var aSelected = oTable.getSelectedItems();
            var aSelectedTemplates = [];

            aSelected.forEach(function (temp) {
                var sPath = temp.getBindingContextPath();
                aSelectedTemplates.push(mEquipmentDetail.getProperty(sPath));
            });

            if (aSelectedTemplates.length > 0) {
                mEquipmentDetail.setProperty("/metadata/enabled/unassign", true);
            } else {
                mEquipmentDetail.setProperty("/metadata/enabled/unassign", false);
            }

            mEquipmentDetail.setProperty("/data/assignments/objectTemplate/selectedTemplate", aSelectedTemplates);
        },

        /**
         * Sort the table with Ascending and Descending order
         */
        onSortEquipmentTemplate: function () {

            var oTable = this.getView().byId("idTableObjectTemplate"),
                oBinding = oTable.getBinding("items"),
                aSorters = [],
                bDescending;

            bDescending = !this.isObjectTemplateDescending;
            aSorters.push(new Sorter("displayId", bDescending, false, this.fnComparator));
            oBinding.sort(aSorters);

            this.isObjectTemplateDescending = !this.isObjectTemplateDescending;
        },

        /**
         * Custom function to sort the display Id's
         * 
         * @param {string} sDisplayId1 
         * @param {string} sDisplayId2 
         * 
         * @returns {number} The difference between the numeric values of the display IDs.
         */
        fnComparator: function (sDisplayId1, sDisplayId2) {
            const numA = parseInt(sDisplayId1.match(/\d+/)[0], 10);
            const numB = parseInt(sDisplayId2.match(/\d+/)[0], 10);
            return numA - numB;
        },

        /**
         * Function to fetch the inline count once data received from oData api
         */
        onDataReceivedAssignObjectTemplates: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            oModel.setProperty("/data/assignments/objectTemplate/isShowBusy", true);
            this.fnFetchInlineCount(this, "idAsintAssignTemplatesTable", function (sCount) {
                var sHeader = that._oi18n.getText("asint.equipment.tab.assignments.objectTemplate.title", [sCount]);
                oModel.setProperty("/data/assignments/objectTemplate/isShowBusy", false);
                oModel.setProperty("/data/assignments/objectTemplate/assignTableHeader", sHeader);
            });
        },

        /**
         * Function to assign template and it will open dialog showing list of templates
         * @param {Object} oEvent 
         */
        onAssignEquipmentTemplate: function () {
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            var oDetail = oModel.getProperty("/data/detail");
            var sSrcId = oDetail.srcId;
            var oNewFilter;
            if (!that._oDialogAssign) {
                that._oDialogAssign = sap.ui.xmlfragment(
                    this.oView.getId(),
                    "com.asint.ais.mi.equipment.view.fragment.AssignObjectTemplate",
                    that
                );
            }
            that.getView().addDependent(that._oDialogAssign);
            var oSearch = this.byId("idAssignTemplateSearch");
            oSearch.setValue("");
            var oTable = this.byId("idAsintAssignTemplatesTable");
            oTable.removeSelections();
            var oBinding = oTable.getBinding("items");
            oBinding.aFilters = [];
            oBinding.filter([]);

            oNewFilter = new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "EQUI");
            var sSrcFilter = new sap.ui.model.Filter("isS4Template", sap.ui.model.FilterOperator.EQ, false);
            var oCombinedFilter;
            if(sSrcId === "BTP"){
                var oParentEqu = oDetail.parent_equipment;
                if(oParentEqu){
                    var sName = oParentEqu.name;
                    var sTemplateName = "S4-" + sName + "-ObjectTemplate";
                    var oParentFilter = new sap.ui.model.Filter([
                        new sap.ui.model.Filter("isS4Template", sap.ui.model.FilterOperator.EQ, true),
                        new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sTemplateName)
                    ], true);
                    var oTypeFilter = new sap.ui.model.Filter([oNewFilter, sSrcFilter], true);
                    oCombinedFilter = new sap.ui.model.Filter([oTypeFilter, oParentFilter], false);
                }else{
                    oCombinedFilter = oNewFilter;
                }
            }else{
                oCombinedFilter = new sap.ui.model.Filter([oNewFilter, sSrcFilter], true);
            }
            this._oDefaultFilter = oCombinedFilter;
            oBinding.filter(oCombinedFilter);
            that._oDialogAssign.open();
        },

        /**
         * Function to search object templates list
         * @param {Object} oEvent 
         */
        fnSearchDialogTemplatesListForAssignTemplate: function (oEvent) {
            var that = this;
            var sQuery = oEvent.getSource().getValue();
            sQuery = sQuery.trim();
            var oFilterArr;
            // var sSrcFilter = new sap.ui.model.Filter("isS4Template", sap.ui.model.FilterOperator.EQ, false);
            if (sQuery === "") {
                oFilterArr = this._oDefaultFilter;
                this.byId("idAsintAssignTemplatesTable").getBinding("items").filter(oFilterArr);
            } else {
                oFilterArr = new Filter([
                    new Filter({path:"name", operator:FilterOperator.Contains, value1:sQuery, caseSensitive : false}),
                    new Filter({path:"displayId", operator:FilterOperator.Contains, value1:sQuery, caseSensitive : false})
                ], false);
                // var oTypeFilter = new Filter({path:"type", operator:FilterOperator.EQ, value1:sType});
                var oFinalFilter = new Filter([oFilterArr, that._oDefaultFilter ], true);
                this.byId("idAsintAssignTemplatesTable").getBinding("items").filter(oFinalFilter);
            }  
        },

        /**
         * Function to close the assign dialog
         */
        onCloseAssignDialog: function () {
            var that = this;
            if (that._oDialogAssign) {
                that._oDialogAssign.close();
            }
        },

        /**
         * Function to handle select event of the table to assign templates
         */
        onDialogTemplateSelect: function () {
            var oModel = this.getView().getModel("mEquipmentDetail"),
                oTable = this.getView().byId("idAsintAssignTemplatesTable");

            var aSelected = oTable.getSelectedItems();
            var IsOkEnabled = false;
            if (aSelected.length > 0) {
                IsOkEnabled = true;
            } else {
                IsOkEnabled = false;
            }
            var aSelectedTemplates = [];
            aSelected.forEach(function (temp) {
                var selObj = temp.getBindingContext("objectTemplateService").getObject();
                aSelectedTemplates.push(selObj);
            });
            oModel.setProperty("/data/assignments/objectTemplate/selectedForAssign", aSelectedTemplates);
            oModel.setProperty("/data/assignments/objectTemplate/IsOkEnabled", IsOkEnabled);
        },

        /**
         * Function to save the templates assignment and make an api call
         */
        onAssignTemplateOkPress: function () {
            var that = this;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var aAssignedTemplate = mEquipmentDetail.getProperty("/data/templatesData/assignedTemplates");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = mEquipmentDetail.getProperty("/data/etag");
            var oI18n = that.getView().getModel("i18n").getResourceBundle();
            var aSelected = mEquipmentDetail.getProperty("/data/assignments/objectTemplate/selectedForAssign");
            var bIsAssignClass = mEquipmentDetail.getProperty("/data/assignments/objectTemplate/assignClass");
            if (aSelected.length > 0) {
                var aAlreadySelected = [];

                var sSrcId = oEquipmentDetail.srcId;
                if(sSrcId !== "BTP"){
                    var isS4Selected = false;
                    aSelected.forEach(function(oData){
                        if(oData.isS4Template){
                            isS4Selected = true;
                        }
                    });
                    if(isS4Selected){
                        return that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.s4Validation.message01"));
                    }
                }

                aSelected.forEach(function (oData) {
                    var oSelectedData = aAssignedTemplate.find(function (oItem) {
                        return oItem.ID === oData.ID;
                    });
                    if (oSelectedData) {
                        aAlreadySelected.push(oSelectedData.displayId);
                    }
                });

                if (aAlreadySelected.length > 0) {
                    that.fnMessageShow("I", oI18n.getText("asint.equipment.detail.message09"), aAlreadySelected.join(","));
                } else {
                    aSelected.forEach(function (oItem) {
                        aAssignedTemplate.unshift(oItem);
                    });

                    var aObjectTemplateId = [];

                    aAssignedTemplate.forEach(function (oItem) {
                        aObjectTemplateId.push({
                            "objectTemplate_ID": oItem.ID
                        })
                    });

                    var oPayload = {
                        "to_object_template": aObjectTemplateId,
                        "ID": sEquipmentId,
                        "deleted": false,
                        "isAssignClass" : bIsAssignClass
                    };
                    oPayload = that.setCreatedModified(oPayload,"POST",oEquipmentDetail);
                    that.dataSource.updateEquipmentObjectTemplatesAndAssignClass( oPayload, function (oAssignedTemplate) {
                        mEquipmentDetail.setProperty("/data/etag", oAssignedTemplate["@etag"]);
                        mEquipmentDetail.setProperty("/data/assignments/objectTemplate/assignClass", false)
                        that.onCloseAssignDialog();
                        // that.fnMapValues(oAssignedTemplate);
                        that.fnFetchAsmtTemplateUpdateRepairFlag(function(){
                            that.fnMessageShow("S", oI18n.getText("asint.equipment.detail.message06"));
                            that.fnGetAssignedObjectTemplateList(sEquipmentId);
                        });
                    }, function (oError) {
                        var err = JSON.parse(oError.responseText);
                        var errorDetail = "";
                        if (err.error.message) {
                            errorDetail = err.error.message;
                        }
                        that.fnMessageShow("E", oI18n.getText("asint.equipment.detail.message05"), errorDetail);
                        that._oLogger.error("An Error Occurred In updateEquipmentDetail :",JSON.stringify(oError));
                    }, eTag);
                }
            }

        },

        /**
        *Function used to open the fragment when the Assign button is clicked.
        */
        onAssignFailureDataProfile: function () {

            var that = this;

            // If fragment already exists, clear selections before reopening
            if (that.assignFailureDataProfile) {
                var oTable = sap.ui.core.Fragment.byId("idAssignFailureDataProfile", "idAsintAssignFailureDataProfileTable");
                if (oTable) {
                    oTable.removeSelections(true);
                }

                var oSearch = sap.ui.core.Fragment.byId("idAssignFailureDataProfile", "idAssignFailureDataProfileSearch");
                if (oSearch) {
                    oSearch.setValue("");
                }
            }

            that.onOpenAnyFragment(
                "idAssignFailureDataProfile",
                "com.asint.ais.mi.equipment.view.fragment.AssignFailureDataProfile",
                "assignFailureDataProfile",
                true,
            );
            
        },

        /**
         * Function is used when ok button is click 
         */
        onAssignFailureDataProfileOkPress: function () {
            var that = this;
            var oI18n = this._oi18n;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = mEquipmentDetail.getProperty("/data/etag");
           
            var oTable = sap.ui.core.Fragment.byId("idAssignFailureDataProfile", "idAsintAssignFailureDataProfileTable");
            var aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length > 0) {

                var aExistingProfiles = mEquipmentDetail.getProperty("/data/assignments/failureDataProfile/profileList") || [];

                var existingProfileIdSet = new Set();
                var aFailureDataProfileId = aExistingProfiles.map(function (oItem) {
                    existingProfileIdSet.add(oItem.ID);
                    return   {"failureDataProfile_ID":oItem.ID} 
                });

                var iNewProfileCount = 0;

                aSelectedItems.forEach(function(oItem) {
                    var oData = oItem.getBindingContext("failureDataProfileService").getObject();
                    if(!existingProfileIdSet.has(oData.ID)){
                        aFailureDataProfileId.push({"failureDataProfile_ID":oData.ID});
                        iNewProfileCount++;
                    }

                });

                if (iNewProfileCount === 0) {
                    that.fnMessageShow("I", oI18n.getText("asint.equipment.detail.failureDataProfile.message05"));
                    return;
                }

                
                var oPayload = {
                    ID: sEquipmentId,
                    to_failure_data_profiles: aFailureDataProfileId
                };

                that.dataSource.updateEquipmentDetail(sEquipmentId,oPayload,function (oResponse) {
                    mEquipmentDetail.setProperty("/data/etag", oResponse["@etag"]);

                    that.onCloseFailureDataProfileDialog();

                    that.fnMessageShow("S",oI18n.getText("asint.equipment.detail.failureDataProfile.message06"),"",function(sAction){
                        if(sAction === "OK") {
                            that.fnGetEquipmentFailurDataProfile();
                        }
                    });

                }, function (oError) {

                    that.fnMessageShow("E",oI18n.getText("asint.equipment.detail.failureDataProfile.message02",oError));

                },eTag);
                
            }

        },


        /**
         * function to close the fragment 
         */
        onCloseFailureDataProfileDialog: function () {
            if (this.assignFailureDataProfile) {
                this.assignFailureDataProfile.destroy();
                this.assignFailureDataProfile = null;

            }
        },

        /**
         * Funtion to select record
         * @param {object} oEvent 
         */
        onFailureDataProfileSelect: function (oEvent) {

            var oTable = oEvent.getSource();
            var bSelected =oTable.getSelectedItems().length > 0;
            this.getView().getModel("mEquipmentDetail").setProperty("/metadata/enabled/unassign",bSelected);

        },

        /**
         * Function is used to unassign the failurdataProfile
         * @returns
         */
        onUnassignFailureDataProfile: function () {

            var that = this;
            var oI18n = this._oi18n;
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var oEquipmentDetail = mEquipmentDetail.getProperty("/data/detail");
            var sEquipmentId = oEquipmentDetail.ID;
            var eTag = mEquipmentDetail.getProperty("/data/etag");
            var oTable = this.byId("idTableFailureDataProfile");
            var aSelectedItems = oTable.getSelectedItems();
            if (aSelectedItems.length === 0) {

                that.fnMessageShow("E",oI18n.getText("asint.equipment.detail.failureDataProfile.message07"));
                return;
            }

            var aCurrentProfiles = mEquipmentDetail.getProperty("/data/assignments/failureDataProfile/profileList");
            var aSelectedIds = aSelectedItems.map(function (oItem) {

                var oData = oItem.getBindingContext("mEquipmentDetail").getObject();
                return oData.ID;

            });

            var aRemainingProfiles = aCurrentProfiles.filter(function (oProfile) {
                return !aSelectedIds.includes(oProfile.ID);

            });

            var aPayloadProfiles = aRemainingProfiles.map(function (oProfile) {
                return {
                    failureDataProfile_ID: oProfile.ID
                };

            });

            var oPayload = {
                ID: sEquipmentId,
                to_failure_data_profiles: aPayloadProfiles
            };

            that.dataSource.updateEquipmentDetail(sEquipmentId , oPayload, function (oResponse) {

                mEquipmentDetail.setProperty("/data/etag", oResponse["@etag"]);

                that.fnGetEquipmentFailurDataProfile();

                that.fnMessageShow("S",oI18n.getText("asint.equipment.detail.failureDataProfile.message03"));

            },function (oError) {

                that.fnMessageShow("E",oI18n.getText("asint.equipment.detail.failureDataProfile.message04",oError));

            },eTag);

        },

        /**
         * FUnction is used to sort the failuredataProfile
         */
        onSortFailureDataProfile: function () {

            var oTable = this.getView().byId("idTableFailureDataProfile");
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
            var bDescending;

            bDescending = !this.isFailureDataProfileDescending;
            aSorters.push(new Sorter("displayIdNumber", bDescending, false));
            oBinding.sort(aSorters);

            this.isFailureDataProfileDescending = !this.isFailureDataProfileDescending;

        },

        /**
         * Function is used for search filed
         * @param {object} oEvent 
         */
        onSearchFailureDataProfile: function (oEvent) {

            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");

            var oTable = this.getView().byId("idTableFailureDataProfile");

            var sQuery = oEvent.getSource().getValue();

            if (sQuery) {

                var aFilters = [
                    new Filter("displayIdNumber", FilterOperator.Contains, sQuery),
                    new Filter("displayId", FilterOperator.Contains, sQuery)
                ];

                oTable.getBinding("items").filter(new Filter({filters: aFilters,and: false}));

            } else {

                oTable.getBinding("items").filter([]);

            }

            var iFilteredCount = oTable.getBinding("items").getLength();
            mEquipmentDetail.setProperty("/data/assignments/failureDataProfile/profileTableHeader",
                this._oi18n.getText("asint.equipment.tab.assignments.failureDataProfile.tableHeader", [iFilteredCount])
            );

        },


    });

});