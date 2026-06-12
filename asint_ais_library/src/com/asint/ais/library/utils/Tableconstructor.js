sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/Link",
    "sap/m/ColumnListItem",
    "sap/ui/base/Object",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/controller/Utility",
    "com/asint/ais/library/utils/MTableViewSettingsHelper",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/CustomData",
    "sap/m/MessageToast",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox",
    "com/asint/ais/library/datasource/asint/Documents",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/ui/core/library",
    "com/asint/ais/library/datasource/asint/FleetAssessment",
    "com/asint/ais/library/datasource/asint/RcmAssessment",
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/AssetInspection",
    "sap/ui/core/dnd/DragInfo",
    "sap/ui/core/dnd/DropInfo"
], function (Controller, Table, Column, Text, Link, ColumnListItem, BaseObject, JSONModel, Filter, FilterOperator, Utility, MTableViewSettingsHelper, ResourceModel, Fragment, CustomData, MessageToast, exportLibrary, Spreadsheet, MessageBox, CommonDatasource, ODataModel,CoreLibrary,FleetAssessment,RcmAssessment,Common, AssetInspection, DragInfo, DropInfo) {
    "use strict";
    return Utility.extend("com.asint.ais.library.utils.Tableconstructor", {
        _i18n: {},
        TableHandler: null,
        oTable: null,
        propPath: null,
        tableId: null,
        oModelD: null,
        datasource: null,
        _baseURI: "",
        _MasterService: {},
        _appNamespace: "comasintais",
        _inspID: null,
        _busyDialog: null,
        _app: "",
        _featureFlagConfig: {
            "isLoaded": false,
            "openTextEnabled": "0",
            "genEnableShortDescFieldForAddDoc": "0",
            "genEnableMultiDocumentUpload": "0"
        },
        _findingMarkups: [],
        _activeMarkup: null,
        _isDraggingMarkup: false,
        _isDraggingPointer: false,
        _dragOffset: { x: 0, y: 0 },

        NAVIGATION: {
            "INSPECTION_FINDINGS_DETAIL":"idms-manage&/findingDetail/{findingId}",
        },

        /**
         * Constructor function
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;
            if (sBaseURI) {
                this.datasource = new CommonDatasource(sBaseURI);
                this.fleet=new FleetAssessment(sBaseURI);
                this.rcmAssessmentDataSource=new  RcmAssessment(sBaseURI);
                this.assetInspectionDataSource=new AssetInspection(sBaseURI);
                this.commonDataSource= new Common(sBaseURI)
            } else {
                this.datasource = new CommonDatasource();
                this.fleet=new FleetAssessment();
                this.rcmAssessmentDataSource=new RcmAssessment();
                this.assetInspectionDataSource=new AssetInspection();
                this.commonDataSource= new Common()
            }

            var that = this;

            if (this._baseURI && this._baseURI.includes(".asintais.")) {
                this._appNamespace = this._baseURI.substring(this._baseURI.indexOf(".asintais.") + 10);
            }

            this._MasterService = new ODataModel({
                serviceUrl: that._baseURI + "/asint/odata/v4/api/v1/document/",
                autoExpandSelect: true,
                synchronizationMode: "None",
                operationMode: "Server",
            });

            this._i18n = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

            this._busyDialog = new sap.m.BusyDialog();

            this._assignAttachmentModel = new sap.ui.model.json.JSONModel({ title: "", aSelectedAttachment: [], aSelectedAttachmentId: [] });
            
            this._featureFlagConfig = {
                "isLoaded": false,
                "openTextEnabled": "0",
                "intelliViewVisible": "0",
                "genEnableShortDescFieldForAddDoc": "0",
                "openTextDelete": "0",
                "hideAttachmentFields": "0",
                "genEnableMultiDocumentUpload": "0"
            };

            this._oIntelliEditDialog = null;
            this._currentSessionFindingsCache = null;
            this._oPDFIntelliEditDialog = null;
            this._oPDFIntelliViewDialog = null;

            this._oIntelliEditState = {
                activeTool: null, // "TEXT" | "CROP" | "BRUSH"
                color: "#F44336",
                size: 12
            };

            var oAttachmentTableModel = {
                "data":{
                    "aAllDC":[],
                    "aAlluniqueGroupsForDC1":[],
                    "aAlluniqueGroupsForDC2":[],    
                    "aAlluniqueGroupsForDC3":[],
                }

            }
            this.oAttachmentModel = new JSONModel(JSON.parse(JSON.stringify(oAttachmentTableModel)));
            this.fnLoadFeatureFlagConfig();
            this.fnFetchDCTypePicklistList();

        },



        /**
         * Function to fetch component type list
         */
        fnFetchDCTypePicklistList:function(){
            var that=this;
            var oModel=this.oAttachmentModel;
            this.datasource.getPicklistID("DCL_Picklists",function(oResponse){
                if(oResponse && oResponse.value && oResponse.value.length>0) {
                    var picklistId=oResponse.value[0].ID
                    if(picklistId){
                        that.datasource.getPicklistInfo(picklistId,function(oResponse){
                            try {
                                var data = JSON.parse(oResponse.jsonData);
                                var uniqueGroupsForDC1 = [];
                                for (let i = 0; i < data.length; i++) {
                                    var group = data[i]["DCL_1-Document_Type_Group_Name"];
                                    var obj = { "DCL_1-Document_Type_Group_Name": group };
                                    var exists = false;
                                    for (let j = 0; j < uniqueGroupsForDC1.length; j++) {
                                        if (uniqueGroupsForDC1[j]["DCL_1-Document_Type_Group_Name"] === group) {
                                            exists = true;
                                            break;
                                        }
                                    }

                                    if (!exists) {
                                        uniqueGroupsForDC1.push(obj);
                                    }
                                }
                                oModel.setProperty("/data/aAllDC", data);
                                oModel.setProperty("/data/aAlluniqueGroupsForDC1", uniqueGroupsForDC1);
                            } catch (oError) {
                                oModel.setProperty("/data/aAllDC", []);
                            }
                        },function(){

                        })
                    }
                }
            },function(){

            })

            
        },
        
        /**
         * Function to handle DC selection change
         * @param {Object} oEvent 
         */
        onDCSelectionChange: function (oEvent) {
            var oSource = oEvent.getSource();
            var sId = oSource.getId();
            var aSelectedKeys = oSource.getSelectedKey();

            //DCL Mandatory field
            if (oSource.getSelectedKey()){
                oSource.setValueState(sap.ui.core.ValueState.None)
            }
            if (sId.indexOf("idDCL1Attachment") !== -1) {
                this.fnFetchUniqueDCdropdown("DC1", aSelectedKeys);
            } else if (sId.indexOf("idDCL2Attachment") !== -1) {
                this.fnFetchUniqueDCdropdown("DC2", aSelectedKeys);
            }
            // else if (sId.indexOf("idDCL3Attachment") !== -1) {
            //     this.fnFetchUniqueDCdropdown("DC2", aSelectedKeys);
            // }
        },

        /**
         * Function to fetch unique DC dropdown
         * @param {String} sDCType 
         * @param {String} aSelectedKeys 
         */
        fnFetchUniqueDCdropdown: function (sDCType, aSelectedKeys) {
            
            var that=this;
            var oModel = this.oAttachmentModel;
            var mTableHandler=that._oAddAttachDialog.getModel("mTableHandler")
            var aAllDC=[];
            var group="";
            var obj={};
            if (sDCType === "DC1") {
                aAllDC = oModel.getProperty("/data/aAllDC");
                var uniqueGroupsForDC2 = [];
                for (let i = 0; i < aAllDC.length; i++) {
                    if (aSelectedKeys.includes(aAllDC[i]["DCL_1-Document_Type_Group_Name"])) {
                        group = aAllDC[i]["DCL_2-Document_Type_Name"];
                        obj = { "DCL_2-Document_Type_Name": group };
                        var existsDC2 = false;
                        for (let j = 0; j < uniqueGroupsForDC2.length; j++) {
                            if (uniqueGroupsForDC2[j]["DCL_2-Document_Type_Name"] === group) {
                                existsDC2 = true;
                                break;
                            }
                        }
                        if (!existsDC2) {
                            uniqueGroupsForDC2.push(obj);
                        }
                    }
                }
                if(mTableHandler){
                    mTableHandler.setProperty("/documents/userInput/DCL2","")
                    mTableHandler.setProperty("/documents/userInput/DCL3","")
                    mTableHandler.refresh();
                }
                oModel.setProperty("/data/aAlluniqueGroupsForDC2", uniqueGroupsForDC2);
            } else if (sDCType === "DC2") {
                aAllDC = oModel.getProperty("/data/aAllDC");
                var uniqueGroupsForDC3 = [];
                for (let i = 0; i < aAllDC.length; i++) {
                    if (aSelectedKeys.includes(aAllDC[i]["DCL_2-Document_Type_Name"])) {
                        group = aAllDC[i]["DCL_3-Document_Sub-type"];
                        obj = { "DCL_3-Document_Sub-type": group };
                        var exists = false;
                        for (let j = 0; j < uniqueGroupsForDC3.length; j++) {
                            if (uniqueGroupsForDC3[j]["DCL_3-Document_Sub-type"] === group) {
                                exists = true;
                                break;
                            }
                        }
                        if (!exists) {
                            uniqueGroupsForDC3.push(obj);
                        }
                    }
                }
                if(mTableHandler){
                    mTableHandler.setProperty("/documents/userInput/DCL3","")
                    mTableHandler.refresh();

                }  
                oModel.setProperty("/data/aAlluniqueGroupsForDC3", uniqueGroupsForDC3);
            }

        },


        /**
         * Function to load feature flag config
         */
        fnLoadFeatureFlagConfig: function () {
            var that = this;

            if(!this._featureFlagConfig.isLoaded) {
                this.datasource.fetchFeatureFlag(function(oConfig) {
                    Object.keys(that._featureFlagConfig).forEach(function(sKey) {
                        if(Object.prototype.hasOwnProperty.call(oConfig, sKey)) {
                            that._featureFlagConfig[sKey] = oConfig[sKey].objectValue;
                        }
                    });
                    that._featureFlagConfig.isLoaded = true;
                    if (that.oDragInfo && that.oDropInfo) {
                        var bEnable = (that._app === "INSP" || that._app === "EQUI") && that._featureFlagConfig.genEnableMultiDocumentUpload === "1";
                        that.oDragInfo.setEnabled(bEnable);
                        that.oDropInfo.setEnabled(bEnable);
                    }
                }, function () {
                    sap.m.MessageToast.show(that._i18n.getResourceBundle().getText("TableConstructor.featureFlag.failed.message.text"));
                });
            }
        },

        /**
         * Function to create documents table
         * @param {Object} oModel 
         * @param {String} spath 
         * @param {String} propPath 
         * @param {String} sBaseURI 
         * @param {String} editableFlag 
         * @param {*} details 
         * @param {Boolean} bgenEnableMultiDocumentUpload 
         * @returns 
         */
        createTable: function (oModel, spath, propPath, sBaseURI, editableFlag, details, bgenEnableMultiDocumentUpload) {
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            this.model = oModel;
            this._baseURI = sBaseURI;
            this.spath = spath;
            var that = this;
            this.details=details;

            if (typeof bgenEnableMultiDocumentUpload !== "undefined") {
                this._featureFlagConfig.genEnableMultiDocumentUpload = bgenEnableMultiDocumentUpload ? "1" : "0";
            }

            this.propPath = propPath;
            this._app = this.model.getProperty("/data/app");
            if (this._app === "TASK_MANAGEMENT") {
                this._inspID = this.model.getProperty("/data/oArguments");
            } else if (this._app === "MSP") {
                this._inspID = this.model.getProperty("/router/mspId");
            } else if(this._app === "FINDINGS"){
                this._inspID = this.model.getProperty("/router/arguments/findingId");
            }else if(this._app === "RCA") {
                this._inspID = this.model.getProperty("/router/arguments/RcaId");
            }else if(this._app === "FLEET") {
                this._inspID = this.model.getProperty("/router/fleetAssessmentId");
            }else if(this._app === "RCM") {
                this._inspID = this.model.getProperty("/router/arguments/rcmAssessmentId");
            }else if(this._app==="RCaA"){
                this._inspID = this.model.getProperty("/router/arguments/taskId");
            }else if(this._app === "HAZOP") {
                this._inspID = this.model.getProperty("/router/arguments/assessmentId");
            }else if(this._app === "SIL") {
                this._inspID = this.model.getProperty("/data/silAssessmentId");
            }
            else {
                this._inspID = this.model.getProperty("/router/arguments/assessmentId");
            }
            this.model.setProperty("/data/documents/removeBtn", false);
            this.model.setProperty("/data/documents/IntelliEditBtn", false);
            this.datasource.getTemplateInfo(this._inspID, this._app, function (fnSuccess) {
                that.model.setProperty("/data/documents/assessmentInfo", fnSuccess);

            }, function () { })


            // const ColumnHeaders = true;
            var bHideAttachmentFields = this._featureFlagConfig.hideAttachmentFields;
            var oColumnName = [
                { "text": oI18n.getText("TableConstructor.table.column.fileName.text"), "property": "documentName" },
                { "text": oI18n.getText("TableConstructor.table.column.document.text"), "property": "document" }
            ];
            if (bHideAttachmentFields !== "1") {
                oColumnName.push({ "text": oI18n.getText("TableConstructor.table.column.confidentiality.text"), "property": "confidentiality" });
                oColumnName.push({ "text": oI18n.getText("TableConstructor.table.column.phase.text"), "property": "phase" });
                oColumnName.push({ "text": oI18n.getText("TableConstructor.table.column.category.text"), "property": "category" });
            }
            oColumnName.push({ "text": oI18n.getText("TableConstructor.table.column.language.text"), "property": "language" });
            oColumnName.push({ "text": oI18n.getText("TableConstructor.table.column.fileSize.text"), "property": "fileSize" });
            if (this._app === "INSP") {
                oColumnName.push({ "text": oI18n.getText("TableConstructor.table.column.actions.text"), "property": "actions" });
            }

            var aColumn = [];
            for (var i = 0; i < oColumnName.length; i++) {
                var oText = new sap.m.Text({ text: oColumnName[i].text });
                var oCustomData1 = new CustomData({
                    key: "tableSettings",
                    value: oColumnName[i].property,
                    writeToDom: true
                });

                var oCustomData2 = new CustomData({
                    key: "tableSettings",
                    value: oColumnName[i].text,
                    writeToDom: true
                });

                oText.addCustomData(oCustomData1);
                oText.addCustomData(oCustomData2);

                var oColumn = new sap.m.Column({
                    demandPopin: true,
                    minScreenWidth: "Tablet",
                    hAlign: "Begin",
                    header: oText,
                    width: oColumnName[i].property === "actions" ? "200px" : undefined
                })
                aColumn.push(oColumn);
            }
            this.oTable = new sap.m.Table(
                {
                    mode: "MultiSelect",
                    growing: true,
                    growingThreshold: 10,
                    growingScrollToLoad: true,
                    columns: aColumn,
                    selectionChange: this.onSelectedDocuments.bind(this)
                });

            this.oDragInfo = new DragInfo({
                sourceAggregation: "items",
                enabled: (this._app === "INSP" || this._app === "EQUI") && this._featureFlagConfig.genEnableMultiDocumentUpload === "1"
            });
            this.oDropInfo = new DropInfo({
                targetAggregation: "items",
                dropPosition: "OnOrBetween",
                drop: this.onTableItemDrop.bind(this),
                enabled: (this._app === "INSP" || this._app === "EQUI") && this._featureFlagConfig.genEnableMultiDocumentUpload === "1"
            });
            this.oTable.addDragDropConfig(this.oDragInfo);
            this.oTable.addDragDropConfig(this.oDropInfo);

            this.oTable.setModel(oModel);
            this.tableId = this.oTable.getId();
            var oLightBoxItem = new sap.m.LightBoxItem({
                imageSrc: "{convertToPreview}",
                alt: "{fileName}",
                title: "{fileName}"
            });

            var oLightBox = new sap.m.LightBox();
            oLightBox.addImageContent(oLightBoxItem);
            var aCells = [
                new sap.m.HBox({
                    items: [
                        new sap.ui.core.Icon({
                            src: "{fileTypeGroup}",
                            visible: {
                                path: "fileType",
                                /**
                                 * Function to format icon
                                 * @param {String} fileType 
                                 * @returns Boolean
                                 */
                                formatter: function (fileType) {
                                    return fileType !== "Image";
                                }
                            }
                        }),
                        new sap.m.Image({
                            width: "48px",
                            height: "48px",
                            visible: {
                                path: "fileType",
                                /**
                                 * Function to format icon
                                 * @param {String} fileType 
                                 * @returns Boolean
                                 */
                                formatter: function (fileType) {
                                    return fileType === "Image";
                                }
                            },
                            mode: sap.m.ImageMode.Image,
                            alt: "{fileName}",
                            tooltip: "{fileName}",
                            src: "{convertToPreview}",
                            detailBox: oLightBox
                        }),

                        new sap.m.Text({
                            text: "{fileName}",
                            visible: {
                                path: "fileType",
                                /**
                                 * Function to format icon
                                 * @param {String} fileType 
                                 * @returns Boolean
                                 */
                                formatter: function (fileType) {
                                    return fileType !== "Link";
                                }
                            }
                        }).addStyleClass("sapUiTinyMarginBeginEnd"),
                        new sap.m.Link({
                            text: "{fileName}",
                            tooltip: "{fileName}",
                            target: "_blank",
                            href: "{fileName}",
                            visible: {
                                path: "fileType",
                                /**
                                 * Function to format icon
                                 * @param {String} fileType 
                                 * @returns Boolean
                                 */
                                formatter: function (fileType) {
                                    return fileType === "Link";
                                }
                            }
                        }).addStyleClass("sapUiTinyMarginBeginEnd")

                    ]
                }),
                new sap.m.ObjectIdentifier({
                    title: "{documentName}",
                    titleActive: true,
                    text: "{document}",
                    /**
                     * Function to handle press event
                     * @param {String} oEvent 
                     */
                    titlePress: function (oEvent) {
                        that.onPressDocumentDownloadLink(oEvent);
                    }
                })
            ];

            if (bHideAttachmentFields !== "1") {
                aCells.push(new sap.ui.core.Icon({
                    src: {
                        path: "confidentiality",
                        /**
                         * Function to format confidentiality
                         * @param {String} confidentiality 
                         * @returns String
                         */
                        formatter: function (confidentiality) {
                            return confidentiality === "1" ? "sap-icon://locked" : "";
                        }
                    },
                    tooltip: "{confidentiality}"
                }));
                aCells.push(new sap.m.Text({
                    text: "{phase}"
                }));
                aCells.push(new sap.m.Text({ text: "{category}" }));
            }

            aCells.push(new sap.m.Text({ text: "{language}" }));
            aCells.push(new sap.m.Text({ text: "{fileSize}" }));

            this.oTable.bindItems({
                path: this.spath,
                template: new ColumnListItem({
                    cells: aCells.concat(that._app === "INSP" ? [
                        new sap.m.HBox({
                            renderType: sap.m.FlexRendertype.Bare,
                            items: [
                                new sap.m.Button({
                                    text: "IntelliEdit",
                                    icon: "sap-icon://edit",
                                    type: sap.m.ButtonType.Transparent,
                                    visible: {
                                        path: "fileType",
                                        /**
                                         * 
                                         */
                                        formatter: function (fileType) {
                                            return editableFlag && (fileType === "Image" || fileType === "PDF");
                                        }
                                    },
                                    /**
                                     * 
                                     */
                                    press: function (oEvent) {
                                        var oObj = oEvent.getSource().getBindingContext().getObject();
                                        that._onRowIntelliAction(oObj, "edit");
                                    }
                                }),
                                new sap.m.Button({
                                    text: "View",
                                    icon: "sap-icon://show",
                                    type: sap.m.ButtonType.Transparent,
                                    visible: {
                                        path: "fileType",
                                        /**
                                         * 
                                         */
                                        formatter: function (fileType) {
                                            return fileType === "Image" || fileType === "PDF";
                                        }
                                    },
                                    /**
                                     * 
                                     */
                                    press: function (oEvent) {
                                        var oObj = oEvent.getSource().getBindingContext().getObject();
                                        that._onRowIntelliAction(oObj, "view");
                                    }
                                })
                            ]
                        })
                    ] : [])
                }),

            });
            this.oTable.setHeaderToolbar(new sap.m.OverflowToolbar({
                content: [
                    new sap.m.Title({
                        text: {
                            path: "/data/documents/docLength",
                            /**
                             * Function to format title
                             * @param {String} docLength 
                             * @returns String
                             */
                            formatter: function (docLength) {
                                return docLength > 0 ? "Attachments (" + docLength + ")" : "Attachments";
                            }
                        }
                    }),
                    new sap.m.ToolbarSpacer(),
                    new sap.m.SearchField({
                        tooltip: "{Search}",
                        placeholder: "Search",
                        width: "20%",
                        /**
                         * Function to handle live change for search field
                         * @param {Object} oEvent 
                         */
                        liveChange: function (oEvent) { that.onFilter(oEvent) },

                    }),
                    new sap.m.MenuButton({
                        text: "Add",
                        enabled: editableFlag,
                        visible: editableFlag,
                        menu: new sap.m.Menu({
                            /**
                             * Function to handle select event
                             * @param {Object} oEvent 
                             */
                            itemSelected: function (oEvent) {
                                that.onPressAddAttachment(oEvent, oModel, propPath);
                            },
                            items: [
                                new sap.m.MenuItem({
                                    key: "attachment",
                                    text: "Add Document"
                                }),
                                new sap.m.MenuItem({
                                    key: "link",
                                    text: "Add Link"
                                })
                            ]
                        })
                    }),
                    new sap.m.Button({
                        text: "Assign",
                        /**
                         * Function to handle press event
                         */
                        press: function () {
                            that.assignDocument()
                        },
                        type: sap.m.ButtonType.Transparent,
                        enabled: editableFlag,
                        visible: editableFlag
                    }),

                    new sap.m.Button({
                        text: "Delete",
                        /**
                         * Function to handle press event
                         */
                        press: function () { that.onremove() },
                        tooltip: "{Delete}",
                        type: sap.m.ButtonType.Transparent,
                        enabled: {
                            path: "/data/documents/removeBtn"
                        },
                        visible: editableFlag

                    }),
                    
                    new sap.m.Button({
                        // enabled: true,
                        /**
                         * Function to handle press event
                         */
                        press: function () { that.onPressDocumentDownloadLink() },
                        icon: "sap-icon://download",
                        type: sap.m.ButtonType.Transparent,
                        enabled: {
                            path: "/data/documents/removeBtn"
                        }
                    }),
                    new sap.m.Button({
                        icon: "sap-icon://excel-attachment",
                        tooltip: "Export",
                        /**
                         * Function to handle press event
                         */
                        press: function () {
                            that.onPressAttachmentsExportExcel();
                        }

                    })
                ]
            }));
            //this.showSuccessDialog();
            this.attachDocumentToTable();

            return this.oTable;
        },

        /**
         * Function to show source details
         * @param {Object} oEvent 
         */
        onPressOpenSourceDetails: function onPressOpenSourceDetails(oEvent) {
            sap.iot.ain.lib.reusable.utilities.Utility.getSourceDetailsAndOpenSourceDetailsPopover(oEvent.getSource().getBindingContext().getObject()
                .SourceId, oEvent.getSource(), this._oComponent);
        },

        /**
         * Function to export data to excel
         */
        onPressAttachmentsExportExcel: function () {
            this.fnExportTableDatatoExcelforTableConstruct(this.oTable);
        },

        /**
         * Function to filter attachments
         * @param {Object} oEvent 
         */
        onFilter: function (oEvent) {
            // var _oTable = this.oTable.getId();
            var oBinding = this.oTable.getBinding("items");
            var aCurrentFilters = oBinding.aFilters.slice(0);
            var aFilter = [];
            var sQuery = oEvent.getSource().getValue();
            var oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter({path:"fileName",operator:FilterOperator.Contains,value1:sQuery,caseSensitive:false}),
                    new sap.ui.model.Filter({path:"category",operator:FilterOperator.Contains,value1:sQuery,caseSensitive:false})
                ],
                and: false
            });
            aFilter = aCurrentFilters.concat(oFilter);
            oBinding.filter(aFilter, sap.ui.model.FilterType.Application);
            var iLength = oBinding.getLength();
            this.model.setProperty("/data/documents/docLength", iLength);
        },

        /**
         * Function to add attachment
         * @param {Object} oEvent 
         */
        onPressAddAttachment: function (oEvent) {
            var that = this;

            var sSelected = oEvent.getParameter("item").getProperty("key");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            var oUserData = {
                dialogHeader: oI18n.getText("TableConstructor.addAttachmentDialog.document.text"),
                fileObj: "",
                description: "",
                linkVisible: false,
                language: "English",
                category :"",
                DCL1:"",
                DCL2:"",
                DCL3:"",
                documentDate:new Date(),
                shortDescription:"",
                fileObjList: []
            }

            if (sSelected === "attachment") {
                oUserData.linkVisible = false;
            } else {
                oUserData.dialogHeader = oI18n.getText("TableConstructor.addAttachmentDialog.link.text");
                oUserData.linkVisible = true;
                oUserData.linkName = "";
                oUserData.linkValue = "";
            }
            var propPath = this.propPath;
            var table = this.oTable;
            var model = table.getModel();
            model.setProperty(propPath + "userInput", oUserData);
            if (!this._oAddAttachDialog) {
                Fragment.load({
                    id: "attachdialog",
                    name: "com.asint.ais.library.fragment.AddAttachment",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    var mData = new sap.ui.model.json.JSONModel(
                        {
                            "documents": {
                                "userInput": {},
                                "phaseDropdown": [
                                    {
                                        "key": "Acquisition",
                                        "text": "Acquisition"
                                    },
                                    {
                                        "key": "Decommissioning",
                                        "text": "Decommissioning"
                                    },
                                    {
                                        "key": "Design",
                                        "text": "Design"
                                    },
                                    {
                                        "key": "Dismantle",
                                        "text": "Dismantle"
                                    },
                                    {
                                        "key": "Disposal",
                                        "text": "Disposal"
                                    },
                                    {
                                        "key": "Installation",
                                        "text": "Installation"
                                    },
                                    {
                                        "key": "Maintenance",
                                        "text": "Maintenance"
                                    },
                                    {
                                        "key": "Operation",
                                        "text": "Operation"
                                    }
                                ],
                                "confidentialityDropdown": [],
                                "documentTypeDropdown": [
                                    {
                                        "key": "BillsOfMaterials",
                                        "text": "Bills of Materials"
                                    },
                                    {
                                        "key": "Certificates",
                                        "text": "Certificates"
                                    },
                                    {
                                        "key": "CommercialDocuments",
                                        "text": "Commercial Documents"
                                    },
                                    {
                                        "key": "DrawingsSchemes",
                                        "text": "Drawings/Schemes"
                                    },
                                    {
                                        "key": "Firmware",
                                        "text": "Firmware"
                                    },
                                    {
                                        "key": "Identification",
                                        "text": "Identification"
                                    },
                                    {
                                        "key": "InspectionMaintenance",
                                        "text": "Inspection, Maintenance"
                                    },
                                    {
                                        "key": "InstallationDismantling",
                                        "text": "Installation/Dismantling"
                                    },
                                    {
                                        "key": "Operation",
                                        "text": "Operation"
                                    },
                                    {
                                        "key": "Others",
                                        "text": "Others"
                                    },
                                    {
                                        "key": "RepairOverhaul",
                                        "text": "Repair/Overhaul"
                                    },
                                    {
                                        "key": "Safety",
                                        "text": "Safety"
                                    },
                                    {
                                        "key": "SpareParts",
                                        "text": "Spare Parts"
                                    },
                                    {
                                        "key": "TechnicalSpecification",
                                        "text": "Technical Specification"
                                    }
                                ],
                                "languages": [
                                    {
                                        "key": "af",
                                        "name": "Afrikaans"
                                    },
                                    {
                                        "key": "ar",
                                        "name": "Arabic"
                                    },
                                    {
                                        "key": "bg",
                                        "name": "Bulgarian"
                                    },
                                    {
                                        "key": "ca",
                                        "name": "Catalan"
                                    },
                                    {
                                        "key": "zh",
                                        "name": "Chinese"
                                    },
                                    {
                                        "key": "hr",
                                        "name": "Croatian"
                                    },
                                    {
                                        "key": "cs",
                                        "name": "Czech"
                                    },
                                    {
                                        "key": "da",
                                        "name": "Danish"
                                    },
                                    {
                                        "key": "nl",
                                        "name": "Dutch"
                                    },
                                    {
                                        "key": "en",
                                        "name": "English"
                                    },
                                    {
                                        "key": "et",
                                        "name": "Estonian"
                                    },
                                    {
                                        "key": "fi",
                                        "name": "Finnish"
                                    },
                                    {
                                        "key": "fr",
                                        "name": "French"
                                    },
                                    {
                                        "key": "de",
                                        "name": "German"
                                    },
                                    {
                                        "key": "el",
                                        "name": "Greek"
                                    },
                                    {
                                        "key": "he",
                                        "name": "Hebrew"
                                    },
                                    {
                                        "key": "hu",
                                        "name": "Hungarian"
                                    },
                                    {
                                        "key": "is",
                                        "name": "Icelandic"
                                    },
                                    {
                                        "key": "id",
                                        "name": "Indonesian"
                                    },
                                    {
                                        "key": "it",
                                        "name": "Italian"
                                    },
                                    {
                                        "key": "ja",
                                        "name": "Japanese"
                                    },
                                    {
                                        "key": "ko",
                                        "name": "Korean"
                                    },
                                    {
                                        "key": "lv",
                                        "name": "Latvian"
                                    },
                                    {
                                        "key": "lt",
                                        "name": "Lithuanian"
                                    },
                                    {
                                        "key": "ms",
                                        "name": "Malaysian"
                                    },
                                    {
                                        "key": "no",
                                        "name": "Norwegian"
                                    },
                                    {
                                        "key": "pl",
                                        "name": "Polish"
                                    },
                                    {
                                        "key": "pt",
                                        "name": "Portuguese"
                                    },
                                    {
                                        "key": "ro",
                                        "name": "Romanian"
                                    },
                                    {
                                        "key": "ru",
                                        "name": "Russian"
                                    },
                                    {
                                        "key": "sr",
                                        "name": "Serbian"
                                    },
                                    {
                                        "key": "sk",
                                        "name": "Slovakian"
                                    },
                                    {
                                        "key": "sl",
                                        "name": "Slovenian"
                                    },
                                    {
                                        "key": "es",
                                        "name": "Spanish"
                                    },
                                    {
                                        "key": "sv",
                                        "name": "Swedish"
                                    },
                                    {
                                        "key": "th",
                                        "name": "Thai"
                                    },
                                    {
                                        "key": "zh-Hant",
                                        "name": "Traditional Chinese"
                                    },
                                    {
                                        "key": "tr",
                                        "name": "Turkish"
                                    },
                                    {
                                        "key": "uk",
                                        "name": "Ukrainian"
                                    }
                                ],
                            },
                            "metadata": {
                                "openTextIntegrationEnabled": that._featureFlagConfig.openTextEnabled === "1" ? true : false,
                                "featureFlag": {
                                    "genEnableShortDescFieldForAddDoc": that._featureFlagConfig.genEnableShortDescFieldForAddDoc,
                                    "hideAttachmentFields": that._featureFlagConfig.hideAttachmentFields,
                                    "genEnableMultiDocumentUpload": (that._app === "INSP" || that._app === "EQUI") ? that._featureFlagConfig.genEnableMultiDocumentUpload : "0"
                                }
                            }
                        });
                    that._oAddAttachDialog = oValueHelpDialog;
                    that._oAddAttachDialog.setModel(mData, "mTableHandler");
                    that._oAddAttachDialog.setModel(that._i18n, "i18n");
                    that._oAddAttachDialog.setModel(that.oAttachmentModel, "mAttachmentTableModel");
                    that.oModelD = that._oAddAttachDialog.getModel("mTableHandler");
                    var bEnableMultiSelect = (that._app && ["INSP", "EQUI"].includes(that._app)) && that._featureFlagConfig.genEnableMultiDocumentUpload === "1";
                    var oFileUploader = sap.ui.core.Fragment.byId("attachdialog", "idFileUploader");
                    var oFileUploaderMulti = sap.ui.core.Fragment.byId("attachdialog", "idFileUploaderMulti");
                    if (oFileUploader) {
                        oFileUploader.setMultiple(bEnableMultiSelect);
                    }
                    if (oFileUploaderMulti) {
                        oFileUploaderMulti.setMultiple(bEnableMultiSelect);
                    }
                    that.oModelD.setProperty("/documents/userInput", oUserData);
                    that._oAddAttachDialog.open();
                    if(that._app==="FLEET" || that._app==="RCM"){
                        var oModel=that._oAddAttachDialog.getModel("mTableHandler")
                        var aDocumentTypeDropDown=oModel.getProperty("/documents/documentTypeDropdown")
                        aDocumentTypeDropDown.push({
                            "key": "Operatingcontext",
                            "text": "Operating context"
                        })
                        oModel.setProperty("/documents/documentTypeDropdown",aDocumentTypeDropDown)
                    }
                });

            } else {
                that.resetField();
                var propID = sap.ui.core.Fragment.byId("attachdialog", "idFileUploader");
                if (propID) {
                    if (propID.oFilePath && propID.oFilePath.oParent && propID.oFilePath.oParent.oFileUpload) {
                        propID.oFilePath.oParent.oFileUpload.value = "";
                    }
                    propID.clear();
                }
                var propIDMulti = sap.ui.core.Fragment.byId("attachdialog", "idFileUploaderMulti");
                if (propIDMulti) {
                    if (propIDMulti.oFileUpload) {
                        propIDMulti.oFileUpload.value = "";
                    }
                    propIDMulti.clear();
                }
                var bEnableMultiSelect = (that._app === "INSP" || that._app === "EQUI") && that._featureFlagConfig.genEnableMultiDocumentUpload === "1";
                if (propID) {
                    propID.setMultiple(bEnableMultiSelect);
                }
                if (propIDMulti) {
                    propIDMulti.setMultiple(bEnableMultiSelect);
                }
                that.oModelD.setProperty("/documents/userInput", oUserData);
                that._oAddAttachDialog.open();
            }
        },

        /**
         * Function to upload attachments
         * @returns Object
         */
        fnFileUploadConfrim: function () {
            var that = this;
            var table = this.oTable;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var model = table.getModel();
            // var propPath = this.propPath;
            var oUserData = this.oModelD.getProperty("/documents/userInput");
            
            if (oUserData.shortDescription && oUserData.shortDescription.length > 500) {
               
                that.fnMessageShow("E", oI18n.getText("asint.detail.tab.documents.shortDescription.lengthExceeded.text"));
                return; // Stop the upload
            }

            var oMetaData = that.oModelD.getProperty("/metadata")||{};
            if(oMetaData.openTextIntegrationEnabled){
                var oDCL1Control = sap.ui.core.Fragment.byId("attachdialog", "idDCL1Attachment");
                var oDCL2Control = sap.ui.core.Fragment.byId("attachdialog", "idDCL2Attachment");
                var bDCL1Missing = !oUserData.DCL1 || oUserData.DCL1.trim() === "";
                var bDCL2Missing = !oUserData.DCL2 || oUserData.DCL2.trim() === "";

                if (oDCL1Control) {
                    oDCL1Control.setValueState(bDCL1Missing ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.None);
                    oDCL1Control.setValueStateText(bDCL1Missing ? oI18n.getText("asint.detail.tab.documents.DCL1Missing.text") : "");
                } 

                if (oDCL2Control) {
                    oDCL2Control.setValueState(bDCL2Missing ? sap.ui.core.ValueState.Error : sap.ui.core.ValueState.None);
                    oDCL2Control.setValueStateText(bDCL2Missing ? oI18n.getText("asint.detail.tab.documents.DCL2Missing.text") : "");
                }

                if (bDCL1Missing || bDCL2Missing) {
                    that.fnMessageShow("E", oI18n.getText("asint.detail.tab.documents.DCLMissing.text"));
                    return;
                }
            }
            var oLang = oUserData.language;
            var oCateg = oUserData.category;
            var lang = this.keyToName(oUserData.language);
            var categ = this.keyToCategory(oUserData.category);
            var sLoggedInUser = this.getLoggedInUserMail();
            oUserData.categ = categ;
            oUserData.lang = lang;
            // oUserData.description = oUserData.fileObj.fileName
            oUserData.description = oUserData.shortDescription || (oUserData.fileObj ? oUserData.fileObj.fileName : "");
            if (oUserData.confidentiality === true) {
                oUserData.confidentiality = "1";
            } else {
                oUserData.confidentiality = "0";
            }
            // var curDocs = model.getProperty(propPath + "list");

            var fileData = oUserData.fileObj;
            if(fileData && fileData!=""){
                var isSupported=that.isSupportedFileExtension(fileData.fileName);
                if(!isSupported){   
                    var sAllowedTypes = [
                        "JPG", "XLSX", "TIFF", "BMP", "RTF", "GIF", "CSV", "PNG", "DOCX", "PPTX",
                        "TXT", "PDF", "PPT", "DOC", "JPEG", "ODP", "ODT", "XLS",
                        "HEIC", "DCM", "ODS", "MP4", "MOV", "ZIP"
                    ].join(", ");

                    that.fnMessageShow("E",oI18n.getText("asint.detail.tab.documents.upload.text")+ sAllowedTypes);
                    return;
                                
                }
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "MMM dd, yyyy, hh:mm:ss aa"
            });
            var newDate = new Date();
            var newId, newfileObj, oPayload, oLinkInfo, inspPayload, inspPay;
            var isOpenTextEnabled = this._featureFlagConfig.openTextEnabled === "1";
            var oObjectInfo = { 
                "objectId": this._inspID, 
                "objectType": this._app, 
                "displayId": "", 
                "createdAt": new Date().toISOString().replace("T", " ").replace("Z", ""), 
                "createdBy": sLoggedInUser,
            };

            if (oUserData.linkVisible) {

                // length cheeck
                if (oUserData.linkName && oUserData.linkName.length > 500) {
                   
                    that.fnMessageShow("E", oI18n.getText("asint.detail.tab.documents.displayName.lengthExceeded.text"));
                    return;
                }
                that.fileId = that.fileId + 1;
                newId = that.fileId;
                if (this.isValidUrl(oUserData.linkValue)) {

                    if (!oUserData.linkName || oUserData.linkName.trim() === "") {
                        sap.m.MessageToast.show(oI18n.getText("asint.detail.tab.link.text"));
                        return;
                    }

                    newfileObj = {
                        "fileId": JSON.stringify(newId),
                        "fileName": oUserData.linkValue,
                        "fileType": "Link",
                        "fileSize": "NA",
                        "description": oUserData.description,
                        "previewUrl": "",
                        "createdBy": "devops@asint.net",
                        "createdOn": oDateFormat.format(newDate),
                        "createdTime": newDate.getTime(),
                        "documentName": oUserData.linkName,
                        "document": "ASINT.DOCS",
                        "fileTypeGroup": "sap-icon://chain-link",
                        "fileSizeNumber": 0,
                        "category": oUserData.categ,
                        "confidentiality": oUserData.confidentiality,
                        "language": oUserData.lang,
                        "source": "AsInt,Inc.",
                        "phase": that.formatter.fnPhaseToString(oUserData.phase)
                    }
                    // curDocs.push(newfileObj);
                    // model.setProperty(propPath+"list", curDocs);
                    oPayload = {
                        tenantId: "AIS",
                        category: oCateg,
                        language: oLang,
                        source: "",
                        phase: that.getKeysFromPhaseString(newfileObj.phase),
                        confidentiality: newfileObj.confidentiality,
                        // eslint-disable-next-line camelcase
                        to_file: "",
                        deleted: false,
                        // eslint-disable-next-line camelcase
                        to_description: [
                            {
                                shortDescription: oUserData.linkName || "",
                                language: "EN"
                            }
                        ]
                    };
                    if(isOpenTextEnabled){
                        oPayload.source="OT"
                    }else{
                        oPayload.source="ASINT";
                    }
                    oLinkInfo = {
                        type: "LINK",
                        name: oUserData.linkName,
                        size: 0,
                        content: btoa(oUserData.linkValue),
                        version: 1,
                        deleted: false
                    };
                    // eslint-disable-next-line camelcase
                    oPayload.to_file = oLinkInfo;
                    oPayload.createdBy = sLoggedInUser;
                    oPayload.modifiedBy = sLoggedInUser;
                    // var inspID = this._inspID;
                    inspPay = model.getProperty("/data/documents/assessmentInfo");

                    inspPayload = {
                        ID: inspPay.ID,
                        category: inspPay.category,
                        createdAt: inspPay.createdAt,
                        createdBy: inspPay.createdBy,
                        deleted: inspPay.deleted,
                        modifiedAt: inspPay.modifiedAt,
                        modifiedBy: sLoggedInUser,
                        status: inspPay.status,
                        objectType: inspPay.objectType,
                        displayId: inspPay.displayId,
                    }
                    inspPayload["@etag"] = inspPay["@etag"]
                    that.datasource.attachDocument(oPayload,
                        function (oResponse) {
                            var docid = oResponse.ID;
                            var inspectionInfo = {};
                            if (that._app === "FLOC") {
                                /* eslint-disable camelcase */
                                inspectionInfo = {
                                    location_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if (that._app === "ASD" || that._app === "INSP") {
                                inspectionInfo = {
                                    assessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if (that._app === "EQUI") {
                                inspectionInfo = {
                                    equipment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                                inspectionInfo = {
                                    recommendation_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if (that._app === "MO") {
                                inspectionInfo = {
                                    maintenanceOrderMaster_ID: inspPay.ID,
                                    attachments_ID: docid,
                                    deleted: false
                                }
                            } else if (that._app === "TASK_MANAGEMENT") {
                                inspectionInfo = {
                                    generalTask_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if (that._app === "MSP") {
                                inspectionInfo = {
                                    maintenanceSpendPlan_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if(that._app==="FINDINGS"){
                                inspectionInfo = {
                                    findings_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }

                            } else if(that._app==="RCA"){
                                inspectionInfo = {
                                    rcAssessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }

                            } else if(that._app==="MPOT"){
                                inspectionInfo = {
                                    optimisationAssessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }

                            } else if(that._app==="RCM"){
                                inspectionInfo = {
                                    rcmAssessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }

                            }else if(that._app==="FLEET"){
                                inspectionInfo = {
                                    classStrategyAssessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }

                            }else if(that._app==="RCaA"){
                                inspectionInfo = {
                                    rootCauseAnalysis_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if(that._app==="HAZOP"){
                                inspectionInfo = {
                                    hazopAssessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            } else if(that._app==="SIL"){
                                inspectionInfo = {
                                    safetyAssessment_ID: inspPay.ID,
                                    document_ID: docid,
                                    deleted: false
                                }
                            }
                            
                            var etag = inspPay["@etag"];
                            var to_documents = [];
                            to_documents.push(inspectionInfo);
                            var docIds = model.getProperty("/data/documents/attachDocumentsList")
                            docIds.forEach(function (doc) {
                                var assessment_ID = doc.assessment_ID;
                                var deleted = doc.deleted;
                                var document_ID = doc.document_ID;
                                var extractedObject = {};
                                if (that._app === "FLOC") {
                                    extractedObject = {
                                        location_ID: doc.location_ID,
                                        deleted: deleted,
                                        document_ID: document_ID,
                                    };
                                } else if (that._app === "ASD" || that._app === "INSP") {
                                    extractedObject = {
                                        assessment_ID: assessment_ID,
                                        deleted: deleted,
                                        document_ID: document_ID,
                                    };
                                } else if (that._app === "EQUI") {
                                    extractedObject = {
                                        equipment_ID: assessment_ID,
                                        deleted: deleted,
                                        document_ID: document_ID,
                                    };
                                } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                                    extractedObject = {
                                        recommendation_ID: assessment_ID,
                                        deleted: deleted,
                                        document_ID: document_ID,
                                    };
                                } else if (that._app === "MO") {
                                    extractedObject = {
                                        maintenanceOrderMaster_ID: assessment_ID,
                                        deleted: deleted,
                                        attachments_ID: document_ID,
                                    };
                                } else if (that._app === "TASK_MANAGEMENT") {
                                    extractedObject = {
                                        generalTask_ID: assessment_ID,
                                        deleted: deleted,
                                        document_ID: document_ID
                                    }
                                } else if (that._app === "MSP") {
                                    extractedObject = {
                                        maintenanceSpendPlan_ID: assessment_ID,
                                        deleted: deleted,
                                        document_ID: document_ID
                                    };
                                } else if(that._app==="FINDINGS"){
                                    extractedObject = {
                                        findings_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }
    
                                }  else if(that._app==="RCA"){
                                    extractedObject = {
                                        findings_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }

                                } else if(that._app==="MPOT"){
                                    extractedObject = {
                                        optimisationAssessment_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }

                                } else if(that._app==="RCM"){
                                    extractedObject = {
                                        rcmAssessment_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }

                                }else if(that._app==="FLEET"){
                                    extractedObject = {
                                        classStrategyAssessment_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }

                                }else if(that._app==="RCaA"){
                                    extractedObject = {
                                        rootCauseAnalysis_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }

                                } else if (that._app === "HAZOP") {
                                    extractedObject = {
                                        hazopAssessment_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }
                                } else if (that._app === "SIL") {
                                    extractedObject = {
                                        safetyAssessment_ID: inspPay.ID,
                                        document_ID: document_ID,
                                        deleted: false
                                    }
                                }
                                to_documents.push(extractedObject);
                            });
                            if (that._app === "MO") {
                                inspPayload.to_attachments = to_documents
                            } else {
                                inspPayload.to_documents = to_documents;
                            }
                            that.datasource.attachTempToDocument(inspPayload, inspPay.ID, etag, that._app,
                                function (oResult) {
                                    inspPay["@etag"] = oResult["@etag"];
                                    model.setProperty("/data/documents/assessmentInfo", inspPay);
                                    if(that._app === "MSP" || that._app === "APM_RECO") {
                                        that.fnAssignMSPDoctoRWB(that, that._app, oResult, "add");
                                    } else {
                                        that.attachDocumentToTable();
                                        that.showSuccessDialog();
                                    }
                                }, function () {
                                })
                        }, function () {
                        });
                    that.fnFileUploadCancel();
                    model.refresh();
                }
                else {
                    sap.m.MessageToast.show("Enter valid link");
                    return;
                }
            } else {
                var aFilesToUpload = [];
                if (oUserData.fileObjList && oUserData.fileObjList.length > 0) {
                    aFilesToUpload = oUserData.fileObjList;
                } else if (oUserData.fileObj) {
                    aFilesToUpload = [oUserData.fileObj];
                }

                if (aFilesToUpload.length === 0) {
                    sap.m.MessageToast.show("Please select file");
                    return;
                }
                
                var bEnableMultiSelect = (that._app === "INSP" || that._app === "EQUI") && that._featureFlagConfig.genEnableMultiDocumentUpload === "1";

                if (bEnableMultiSelect && aFilesToUpload.length > 3) {
                    sap.m.MessageToast.show(that._i18n.getResourceBundle().getText("TableConstructor.maxUploadLimit.message.text"));
                    return;
                } else {
                    var bValidFields = that.validateFields();
                    if (!bValidFields) {
                        return;
                    }
                    that.fileId = that.fileId + 1;
                    newId = that.fileId;
                    var ofileSize = fileData.fileSize;
                    // var olanguage = fileData.language;
                    // var ocategory = fileData.category;
                    var ofileType = fileData.fileType;
                    newfileObj = {
                        "fileId": JSON.stringify(newId),
                        "fileName": fileData.fileName,
                        "fileType": that.formatter.fnFormatAttachmentIconBasedOnFileTypeGroup(fileData.fileType),
                        "description": oUserData.description,
                        "previewUrl": fileData.fileDoc,
                        "createdBy": "devops@asint.net",
                        "createdOn": oDateFormat.format(newDate),
                        "createdTime": newDate.getTime(),
                        "documentName": fileData.fileName.split(".")[0],
                        "document": "ASINT.DOCS",
                        "fileTypeGroup": that.formatter.fnFormatAttachmentIconBasedOnFileType(fileData.fileType),
                        "fileSize": that.formatter.fnConverbytestoSize(fileData.fileSize),
                        "fileSizeNumber": fileData.fileSize,
                        "category": oUserData.categ,
                        "confidentiality": oUserData.confidentiality,
                        "language": oUserData.lang,
                        "source": "AsInt,Inc.",
                        "phase": that.formatter.fnPhaseToString(oUserData.phase)
                    }
                    // curDocs.push(newfileObj);
                    //model.setProperty(propPath+"list", curDocs);
                    oPayload = {
                        tenantId: "AIS",
                        category: oCateg,
                        language: oLang,
                        source: "",
                        phase: that.getKeysFromPhaseString(newfileObj.phase),
                        confidentiality: newfileObj.confidentiality,
                        to_file: "",
                        deleted: false,
                        to_description: [
                            {
                                shortDescription: oUserData.shortDescription || "",
                                language: "EN"
                            }
                        ]
                    };
                    if(isOpenTextEnabled){
                        oPayload.externalData=JSON.stringify({"DCL1": oUserData.DCL1 , "DCL2": oUserData.DCL2 , "DCL3": oUserData.DCL3}),
                        oPayload.documentDate=oUserData.documentDate ? oUserData.documentDate : new Date().toISOString()
                    }else{
                        oPayload.externalData=JSON.stringify({"DCL1":"" ,"DCL2":"" ,"DCL3":""}),
                        oPayload.documentDate=null
                    }

                    //document upload file name append
                    var sOriginalName = newfileObj.fileName;
                    var sTimestamp = newDate.getTime().toString();
                    var iLastDot = sOriginalName.lastIndexOf('.');
                    var sTimestampedName = iLastDot !== -1 ? sOriginalName.slice(0, iLastDot) +"_"+ sTimestamp + sOriginalName.slice(iLastDot) : sOriginalName +"_"+ sTimestamp;

                    oLinkInfo = {
                        type: ofileType,
                        name: sTimestampedName,
                        size: ofileSize,
                        // content: newfileObj.previewUrl,
                        file: fileData.fileBlob,
                        version: 1,
                        deleted: false
                    };
                    oPayload.to_file = oLinkInfo;
                    oPayload.createdBy = sLoggedInUser;
                    oPayload.modifiedBy = sLoggedInUser;

                    if (bEnableMultiSelect) {
                        var associateDocuments = function (aDocIds, aFailedFiles) {
                            var inspPay = model.getProperty("/data/documents/assessmentInfo");
                            var inspPayload = {
                                ID: inspPay.ID,
                                category: inspPay.category,
                                createdAt: inspPay.createdAt,
                                createdBy: inspPay.createdBy,
                                deleted: inspPay.deleted,
                                modifiedAt: inspPay.modifiedAt,
                                modifiedBy: sLoggedInUser,
                                status: inspPay.status,
                                objectType: inspPay.objectType,
                                displayId: inspPay.displayId,
                            };
                            inspPayload["@etag"] = inspPay["@etag"];

                            var etag = inspPay["@etag"];
                            var to_documents = [];

                            aDocIds.forEach(function (docid) {
                                var inspectionInfo = {};
                                if (that._app === "INSP") {
                                    inspectionInfo = {
                                        assessment_ID: inspPay.ID,
                                        document_ID: docid,
                                        deleted: false 
                                    };
                                } else if (that._app === "EQUI") {
                                    inspectionInfo = {
                                        equipment_ID: inspPay.ID,
                                        document_ID: docid,
                                        deleted: false 
                                    };
                                }
                                to_documents.push(inspectionInfo);
                            });

                            var docIds = model.getProperty("/data/documents/attachDocumentsList");
                            if (docIds && docIds.length > 0) {
                                docIds.forEach(function (doc) {
                                    var assessment_ID = doc.assessment_ID;
                                    var deleted = doc.deleted;
                                    var document_ID = doc.document_ID;
                                    var extractedObject = { };
                                    if (that._app === "INSP") {
                                        extractedObject = { 
                                            assessment_ID: assessment_ID,
                                            deleted: deleted,
                                            document_ID: document_ID,
                                        };
                                    } else if (that._app === "EQUI") {
                                        extractedObject = { 
                                            equipment_ID: assessment_ID,
                                            deleted: deleted,
                                            document_ID: document_ID,
                                        };
                                    }
                                    to_documents.push(extractedObject);
                                });
                            }

                            inspPayload.to_documents = to_documents;

                            if (["INSP", "EQUI"].includes(that._app) && isOpenTextEnabled) {
                                that._busyDialog.close();
                                that.attachDocumentToTable();
                                if (aFailedFiles && aFailedFiles.length > 0) {
                                    that.fnMessageShow("W", "Partial success. Failed to upload: " + aFailedFiles.join(", "));
                                } else {
                                    that.showSuccessDialog();
                                }
                                that.fnFileUploadCancel();
                                model.refresh();
                            } else {
                                that.datasource.attachTempToDocument(inspPayload, inspPay.ID, etag, that._app, function (oResult) {
                                    that._busyDialog.close();
                                    inspPay["@etag"] = oResult["@etag"];
                                    model.setProperty("/data/documents/assessmentInfo", inspPay);
                                    that.attachDocumentToTable();
                                    if (aFailedFiles && aFailedFiles.length > 0) {
                                        that.fnMessageShow("W", "Partial success. Failed to upload: " + aFailedFiles.join(", "));
                                    } else {
                                        that.showSuccessDialog();
                                    }
                                    that.fnFileUploadCancel();
                                    model.refresh();
                                }, function () {
                                    that._busyDialog.close();
                                    that.fnFileUploadCancel();
                                    model.refresh();
                                });
                            }
                        };

                        var aNewDocIds = [];
                        var aFailedFiles = [];
                        var iCurrentFileIndex = 0;

                        var uploadNextFile = function () {
                            if (iCurrentFileIndex >= aFilesToUpload.length) {
                                if (aNewDocIds.length > 0) {
                                    associateDocuments(aNewDocIds, aFailedFiles);
                                } else {
                                    that._busyDialog.close();
                                    var errMsg = aFailedFiles.length > 0 ? "Failed to upload: " + aFailedFiles.join(", ") : that._i18n.getResourceBundle().getText("TableConstructor.failed.upload.document.message.text");
                                    that.fnMessageShow("E", errMsg);
                                }
                                return;
                            }

                            var fileData = aFilesToUpload[iCurrentFileIndex];
                            that.fileId = that.fileId + 1;
                            var newId = that.fileId;
                            var ofileSize = fileData.fileSize;
                            var ofileType = fileData.fileType;

                            var newfileObj = {
                                "fileId": JSON.stringify(newId),
                                "fileName": fileData.fileName,
                                "fileType": that.formatter.fnFormatAttachmentIconBasedOnFileTypeGroup(fileData.fileType),
                                "description": oUserData.description,
                                "previewUrl": fileData.fileDoc,
                                "createdBy": "devops@asint.net",
                                "createdOn": oDateFormat.format(newDate),
                                "createdTime": newDate.getTime(),
                                "documentName": fileData.fileName.split(".")[0],
                                "document": "ASINT.DOCS",
                                "fileTypeGroup": that.formatter.fnFormatAttachmentIconBasedOnFileType(fileData.fileType),
                                "fileSize": that.formatter.fnConverbytestoSize(fileData.fileSize),
                                "fileSizeNumber": fileData.fileSize,
                                "category": oUserData.categ,
                                "confidentiality": oUserData.confidentiality,
                                "language": oUserData.lang,
                                "source": "AsInt,Inc.",
                                "phase": that.formatter.fnPhaseToString(oUserData.phase)
                            };

                            var oPayload = {
                                tenantId: "AIS",
                                category: oCateg,
                                language: oLang,
                                source: "",
                                phase: that.getKeysFromPhaseString(newfileObj.phase),
                                confidentiality: newfileObj.confidentiality,
                                to_file: "",
                                deleted: false,
                                to_description: [
                                    {
                                        shortDescription: oUserData.shortDescription || "",
                                        language: "EN"
                                    }
                                ]
                            };

                            if (isOpenTextEnabled) {
                                oPayload.externalData = JSON.stringify({ "DCL1": oUserData.DCL1, "DCL2": oUserData.DCL2, "DCL3": oUserData.DCL3 });
                                oPayload.documentDate = oUserData.documentDate ? oUserData.documentDate : new Date().toISOString();
                            } else {
                                oPayload.externalData = JSON.stringify({ "DCL1": "", "DCL2": "", "DCL3": "" });
                                oPayload.documentDate = null;
                            }

                            //document upload file name append
                            var sOriginalName = newfileObj.fileName;
                            var sTimestamp = newDate.getTime().toString();
                            var iLastDot = sOriginalName.lastIndexOf('.');
                            var sTimestampedName = iLastDot !== -1 ? sOriginalName.slice(0, iLastDot) +"_"+ sTimestamp + sOriginalName.slice(iLastDot) : sOriginalName +"_"+ sTimestamp;

                            var oLinkInfo = {
                                type: ofileType,
                                name: sTimestampedName,
                                size: ofileSize,
                                file: fileData.fileBlob,
                                version: 1,
                                deleted: false 
                            };
                            oPayload.to_file = oLinkInfo;
                            oPayload.createdBy = sLoggedInUser;
                            oPayload.modifiedBy = sLoggedInUser;

                            that.datasource.createNew(oPayload, function (oResponse) {
                                if (oResponse && oResponse.ID) {
                                    aNewDocIds.push(oResponse.ID);
                                } else if (isOpenTextEnabled) {
                                    aNewDocIds.push("OPENTEXT_SUCCESS");
                                }
                                iCurrentFileIndex++;
                                uploadNextFile();
                            }, function (oError) {
                                var errorDetail = "";
                                if (oError && oError.responseText) {
                                    errorDetail = oError.responseText;
                                }
                                aFailedFiles.push(errorDetail ? fileData.fileName + " (" + errorDetail + ")" : fileData.fileName);
                                iCurrentFileIndex++;
                                uploadNextFile();
                            }, isOpenTextEnabled, oObjectInfo);
                        };

                        that._busyDialog.open();
                        uploadNextFile();
                    } else {
                        var fileData = oUserData.fileObj;
                        if (!fileData) {
                            sap.m.MessageToast.show(that._i18n.getResourceBundle().getText("TableConstructor.fileSelection.message.text"));
                            return;
                        }

                        that._busyDialog.open();
                        
                        that.fileId = that.fileId + 1;
                        var newId = that.fileId;
                        var ofileSize = fileData.fileSize;
                        var ofileType = fileData.fileType;

                        var newfileObj = {
                            "fileId": JSON.stringify(newId),
                            "fileName": fileData.fileName,
                            "fileType": that.formatter.fnFormatAttachmentIconBasedOnFileTypeGroup(fileData.fileType),
                            "description": oUserData.description,
                            "previewUrl": fileData.fileDoc,
                            "createdBy": "devops@asint.net",
                            "createdOn": oDateFormat.format(newDate),
                            "createdTime": newDate.getTime(),
                            "documentName": fileData.fileName.split(".")[0],
                            "document": "ASINT.DOCS",
                            "fileTypeGroup": that.formatter.fnFormatAttachmentIconBasedOnFileType(fileData.fileType),
                            "fileSize": that.formatter.fnConverbytestoSize(fileData.fileSize),
                            "fileSizeNumber": fileData.fileSize,
                            "category": oUserData.categ,
                            "confidentiality": oUserData.confidentiality,
                            "language": oUserData.lang,
                            "source": "AsInt,Inc.",
                            "phase": that.formatter.fnPhaseToString(oUserData.phase)
                        };

                        var oPayload = {
                            tenantId: "AIS",
                            category: oCateg,
                            language: oLang,
                            source: "",
                            phase: that.getKeysFromPhaseString(newfileObj.phase),
                            confidentiality: newfileObj.confidentiality,
                            to_file: "",
                            deleted: false,
                            to_description: [
                                {
                                    shortDescription: oUserData.shortDescription || "",
                                    language: "EN"
                                }
                            ]
                        };

                        if (isOpenTextEnabled) {
                            oPayload.externalData = JSON.stringify({ "DCL1": oUserData.DCL1, "DCL2": oUserData.DCL2, "DCL3": oUserData.DCL3 });
                            oPayload.documentDate = oUserData.documentDate ? oUserData.documentDate : new Date().toISOString();
                        } else {
                            oPayload.externalData = JSON.stringify({ "DCL1": "", "DCL2": "", "DCL3": "" });
                            oPayload.documentDate = null;
                        }

                        var oLinkInfo = {
                            type: ofileType,
                            name: newfileObj.fileName,
                            size: ofileSize,
                            file: fileData.fileBlob,
                            version: 1,
                            deleted: false 
                        };
                        oPayload.to_file = oLinkInfo;
                        oPayload.createdBy = sLoggedInUser;
                        oPayload.modifiedBy = sLoggedInUser;

                        inspPay = model.getProperty("/data/documents/assessmentInfo");

                        var inspPayload = {
                            ID: inspPay.ID,
                            category: inspPay.category,
                            createdAt: inspPay.createdAt,
                            createdBy: inspPay.createdBy,
                            deleted: inspPay.deleted,
                            modifiedAt: inspPay.modifiedAt,
                            modifiedBy: sLoggedInUser,
                            status: inspPay.status,
                            objectType: inspPay.objectType,
                            displayId: inspPay.displayId,
                        };
                        inspPayload["@etag"] = inspPay["@etag"];
                        var etag = inspPay["@etag"];

                        that.datasource.createNew(oPayload, function (oResponse) {
                            var docid = oResponse.ID;
                            var inspectionInfo = {};
                            if (that._app === "FLOC") {
                                inspectionInfo = { 
                                    location_ID: inspPay.ID,
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "ASD" || that._app === "INSP") {
                                inspectionInfo = { 
                                    assessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "EQUI") {
                                inspectionInfo = { 
                                    equipment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                                inspectionInfo = { 
                                    recommendation_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "MO") {
                                inspectionInfo = { 
                                    maintenanceOrderMaster_ID: inspPay.ID, 
                                    attachments_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "TASK_MANAGEMENT") {
                                inspectionInfo = { 
                                    generalTask_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "MSP") {
                                inspectionInfo = { 
                                    maintenanceSpendPlan_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "FINDINGS") {
                                inspectionInfo = { 
                                    findings_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "RCA") {
                                inspectionInfo = { 
                                    rcAssessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "MPOT") {
                                inspectionInfo = { 
                                    optimisationAssessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "RCM") {
                                inspectionInfo = { 
                                    rcmAssessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "FLEET") {
                                inspectionInfo = { 
                                    classStrategyAssessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "RCaA") {
                                inspectionInfo = { 
                                    rootCauseAnalysis_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "HAZOP") {
                                inspectionInfo = { 
                                    hazopAssessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            } else if (that._app === "SIL") {
                                inspectionInfo = { 
                                    safetyAssessment_ID: inspPay.ID, 
                                    document_ID: docid, 
                                    deleted: false 
                                };
                            }

                            var to_documents = [];
                            to_documents.push(inspectionInfo);

                            var docIds = model.getProperty("/data/documents/attachDocumentsList");
                            if (docIds && docIds.length > 0) {
                                docIds.forEach(function (doc) {
                                    var assessment_ID = doc.assessment_ID;
                                    var deleted = doc.deleted;
                                    var document_ID = doc.document_ID;
                                    var extractedObject = { };
                                    if (that._app === "FLOC") {
                                        extractedObject = { 
                                            location_ID: assessment_ID, 
                                            deleted: deleted, 
                                            document_ID: document_ID 
                                        };
                                    } else if (that._app === "ASD" || that._app === "INSP") {
                                        extractedObject = { 
                                            assessment_ID: assessment_ID, 
                                            deleted: deleted, 
                                            document_ID: document_ID 
                                        };
                                    } else if (that._app === "EQUI") {
                                        extractedObject = { 
                                            equipment_ID: assessment_ID, 
                                            deleted: deleted, 
                                            document_ID: document_ID 
                                        };
                                    } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                                        extractedObject = { 
                                            recommendation_ID: assessment_ID, 
                                            deleted: deleted, 
                                            document_ID: document_ID 
                                        };
                                    } else if (that._app === "MO") {
                                        extractedObject = { 
                                            maintenanceOrderMaster_ID: assessment_ID, 
                                            attachments_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "TASK_MANAGEMENT") {
                                        extractedObject = { 
                                            generalTask_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "MSP") {
                                        extractedObject = { 
                                            maintenanceSpendPlan_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "FINDINGS") {
                                        extractedObject = { 
                                            findings_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "RCA") {
                                        extractedObject = { 
                                            rcAssessment_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "MPOT") {
                                        extractedObject = { 
                                            optimisationAssessment_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "RCM") {
                                        extractedObject = { 
                                            rcmAssessment_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "FLEET") {
                                        extractedObject = { 
                                            classStrategyAssessment_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "RCaA") {
                                        extractedObject = { 
                                            rootCauseAnalysis_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "HAZOP") {
                                        extractedObject = { 
                                            hazopAssessment_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    } else if (that._app === "SIL") {
                                        extractedObject = { 
                                            safetyAssessment_ID: assessment_ID, 
                                            document_ID: document_ID, 
                                            deleted: deleted 
                                        };
                                    }
                                    to_documents.push(extractedObject);
                                });
                            }

                            if (that._app === "MO") {
                                inspPayload.to_attachments = to_documents;
                            } else {
                                inspPayload.to_documents = to_documents;
                            }

                            if (["INSP", "EQUI", "FLEET", "FLOC", "MSP", "RCM", "RCA", "FINDINGS", "TASK_MANAGEMENT", "ASD", "MPOT", "AIS_RECO", "APM_RECO", "CML"].includes(that._app) && isOpenTextEnabled) {
                                that._busyDialog.close();
                                that.attachDocumentToTable();
                                that.showSuccessDialog();
                                that.fnFileUploadCancel();
                                model.refresh();
                            } else {
                                that.datasource.attachTempToDocument(inspPayload, inspPay.ID, etag, that._app, function (oResult) {
                                    that._busyDialog.close();
                                    inspPay["@etag"] = oResult["@etag"];
                                    model.setProperty("/data/documents/assessmentInfo", inspPay);
                                    if (that._app === "MSP" || that._app === "APM_RECO") {
                                        that.fnAssignMSPDoctoRWB(that, that._app, oResult, "add");
                                    } else {
                                        that.attachDocumentToTable();
                                        that.showSuccessDialog();
                                    }
                                    that.fnFileUploadCancel();
                                    model.refresh();
                                }, function () {
                                    that._busyDialog.close();
                                    that.fnFileUploadCancel();
                                    model.refresh();
                                });
                            }
                        }, function (oError) {
                            that._busyDialog.close();
                            var errorDetail = "";
                            if (oError && oError.responseText) {
                                var err = oError.responseText;
                                if (err) {
                                    errorDetail = err;
                                }
                            }
                            that.fnMessageShow("E", that._i18n.getResourceBundle().getText("TableConstructor.failed.upload.document.message.text"), errorDetail);
                        }, isOpenTextEnabled, oObjectInfo);
                    }
                }
            }

        },
        
        /**
         * FUnction to check file extension is valid or not
         * @param {String} sFileName 
         * @returns 
         */
        isSupportedFileExtension: function (sFileName) {
            var aAllowedExtensions = [
                ".jpg", ".xlsx", ".tiff", ".bmp", ".rtf", ".gif", ".csv", ".png", ".docx", ".pptx",
                ".txt", ".pdf", ".ppt", ".doc", ".jpeg", ".odp", ".odt", ".xls",
                ".heic", ".dcm", ".ods", ".mp4", ".mov", ".zip"
            ];

            if (!sFileName) {
                return false;
            }

            var sLowerFileName = sFileName.toLowerCase();

            for (var i = 0; i < aAllowedExtensions.length; i++) {
                if (sLowerFileName.endsWith(aAllowedExtensions[i])) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Function to check if the url is valid or not
         * @param {String} url 
         * @returns 
         */
        isValidUrl: function (url) {
            var urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            return urlPattern.test(url);
        },

        /**
         * Function to handle file upload change
         * @param {Object} oEvent 
         */
        onFileUploadChange: function (oEvent) {
            var that=this;
            var aFiles = oEvent.getParameter("files");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var table = this.oTable;
            var model = table.getModel();
            var propPath = this.propPath;
            var oUserData = model.getProperty(propPath + "userInput");

            var bEnableMultiSelect = (this._app === "INSP" || this._app === "EQUI") && this._featureFlagConfig.genEnableMultiDocumentUpload === "1";

            if (aFiles && aFiles.length > 0) {
                var aFilesToProcess = bEnableMultiSelect ? aFiles : [aFiles[0]];
                var aAttachmentObjects = new Array(aFilesToProcess.length);
                var iFilesRead = 0;
                var bHasError = false;

                var processComplete = function () {
                    if (bHasError) {
                        that.fnMessageShow("E",oI18n.getText("TableConstructor.failed.read.files.message.text"));
                        return;
                    }

                    var bAllSupported = true;
                    var sAllowedTypes = [
                        "JPG", "XLSX", "TIFF", "BMP", "RTF", "GIF", "CSV", "PNG", "DOCX", "PPTX",
                        "TXT", "PDF", "PPT", "DOC", "JPEG", "ODP", "ODT", "XLS",
                        "HEIC", "DCM", "ODS", "MP4", "MOV", "ZIP"
                    ].join(", ");

                    for (var i = 0; i < aAttachmentObjects.length; i++) {
                        var isSupported = that.isSupportedFileExtension(aAttachmentObjects[i].fileName);
                        if (!isSupported) {
                            bAllSupported = false;
                            break;
                        }
                    }

                    if (!bAllSupported) {
                        that.fnMessageShow("E", oI18n.getText("asint.detail.tab.documents.upload.text") + sAllowedTypes);
                        if (bEnableMultiSelect) {
                            oUserData.fileObj = null;
                            oUserData.fileObjList = [];
                        } else {
                            oUserData.fileObj = null;
                        }
                        model.setProperty(propPath + "userInput", oUserData);
                        return;
                    }

                    if (bEnableMultiSelect) {
                        var aCurrentList = oUserData.fileObjList || [];
                        var aNewList = aCurrentList.concat(aAttachmentObjects);

                        if (aNewList.length > 3) {
                            that.fnMessageShow("E",oI18n.getText("TableConstructor.maxUploadLimit.message.text"));
                        } else {
                            oUserData.fileObjList = aNewList;
                            oUserData.fileObj = aNewList[0];
                        }
                    } else {
                        oUserData.fileObj = aAttachmentObjects[0];
                    }

                    model.setProperty(propPath + "userInput", oUserData);
                    if (that.oModelD) {
                        that.oModelD.setProperty("/documents/userInput", oUserData);
                        that.oModelD.refresh(true);
                    }

                    var oFileUploaderMulti = sap.ui.core.Fragment.byId("attachdialog", "idFileUploaderMulti");
                    if (bEnableMultiSelect && oFileUploaderMulti) {
                        oFileUploaderMulti.clear();
                    }
                };

                for (var i = 0; i < aFilesToProcess.length; i++) {
                    (function (index, file) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvt) {
                            var binaryString;
                            if (!readerEvt) {
                                binaryString = reader.content;
                            } else {
                                binaryString = readerEvt.target.result;
                            }
                            var attachmentObject = {};
                            attachmentObject["fileName"] = file.name;
                            attachmentObject["fileSize"] = file.size;
                            attachmentObject["fileType"] = file.type;
                            attachmentObject["fileDoc"] = btoa(binaryString);
                            attachmentObject["compressedFile"] = attachmentObject["fileDoc"];
                            attachmentObject["fileBlob"] = file;

                            aAttachmentObjects[index] = attachmentObject;
                            iFilesRead++;

                            if (iFilesRead === aFilesToProcess.length) {
                                processComplete();
                            }
                        };
                        reader.onerror = function (err) {
                            bHasError = true;
                            iFilesRead++;
                            if (iFilesRead === aFilesToProcess.length) {
                                processComplete();
                            }
                        };
                        reader.readAsBinaryString(file);
                    })(i, aFilesToProcess[i]);
                }
            }
        },

        /**
         * Handler for token deletion in multiple file upload
         * @param {Object} oEvent 
         */
        onFileTokenDelete: function (oEvent) {
            var oToken = oEvent.getSource(); 
            if (oEvent.getParameter("removedTokens")) {
                var aRemovedTokens = oEvent.getParameter("removedTokens");
                if (aRemovedTokens && aRemovedTokens.length > 0) {
                    oToken = aRemovedTokens[0];
                }
            } else if (!oToken || (oToken.getMetadata && oToken.getMetadata().getName() !== "sap.m.Token")) {
                if (oEvent.getParameter("token")) {
                    oToken = oEvent.getParameter("token");
                }
            }
            if (!oToken || typeof oToken.getKey !== "function") return;
            var sFileName = oToken.getKey() || oToken.getText();
            var oTable = this.oTable;
            var oModel = oTable.getModel();
            var propPath = this.propPath;
            var oUserData = oModel.getProperty(propPath + "userInput");

            if (oUserData && oUserData.fileObjList) {
                var aFilteredList = oUserData.fileObjList.filter(function (fileObj) {
                    return fileObj.fileName !== sFileName;
                });
                oUserData.fileObjList = aFilteredList;
                if (aFilteredList.length > 0) {
                    oUserData.fileObj = aFilteredList[0];
                } else {
                    oUserData.fileObj = null;
                }
                oModel.setProperty(propPath + "userInput", oUserData);
                if (this.oModelD) {
                    this.oModelD.setProperty("/documents/userInput", oUserData);
                    this.oModelD.refresh(true);
                }
            }
        },

        /**
         * Handler for table item drop (drag & drop reordering)
         * @param {Object} oEvent
         */
        onTableItemDrop: function (oEvent) {
            var bEnableMultiSelect = (this._app === "INSP" || this._app === "EQUI") && this._featureFlagConfig.genEnableMultiDocumentUpload === "1";
            if (!bEnableMultiSelect) {
                return;
            }
            var oDragged = oEvent.getParameter("draggedControl");
            var oDropped = oEvent.getParameter("droppedControl");
            var sInsertPosition = oEvent.getParameter("dropPosition");

            var oTable = this.oTable;
            var oModel = oTable.getModel();
            var sPath = this.spath;
            var aList = oModel.getProperty(sPath);

            var iDragIndex = oTable.indexOfItem(oDragged);
            var iDropIndex = oTable.indexOfItem(oDropped);

            if (iDragIndex === -1 || iDropIndex === -1 || iDragIndex === iDropIndex) {
                return;
            }

            var oDraggedItem = aList.splice(iDragIndex, 1)[0];

            if (iDragIndex < iDropIndex) {
                iDropIndex--;
            }
            if (sInsertPosition === "After") {
                iDropIndex++;
            }

            aList.splice(iDropIndex, 0, oDraggedItem);

            oModel.setProperty(sPath, aList.slice());
        },

        /**
         * Function to open documents dialog
         */
        fnDocumentSettingsDialogOpen: function () {

            MTableViewSettingsHelper.handleMTableSettingsDialogOpen(this, this.tableId);

        },

        /**
         * Function to handle file upload cancel
         */
        fnFileUploadCancel: function () {
            if (this._oAddAttachDialog) {
                this._oAddAttachDialog.close();
                this._oAddAttachDialog.destroy();
                this._oAddAttachDialog = null
            }
        },

        /**
         * Function to convert to key to text
         * @param {String} sKey 
         * @returns String
         */
        keyToName: function (sKey) {
            if (!sKey) {
                return "";
            }

            var aLanguages = this.model.getProperty("/data/documents/languages");
            for (var i = 0; i < aLanguages.length; i++) {
                if (aLanguages[i].key === sKey) {
                    return aLanguages[i].name;
                }
            }

            return sKey;
        },

        /**
         * Function to format category
         * @param {String} sKey 
         * @returns String
         */
        keyToCategory: function (sKey) {
            if (!sKey) {
                return "";
            }
            var category = this.model.getProperty("/data/documents/documentTypeDropdown");
            for (var i = 0; i < category.length; i++) {
                if (category[i].key === sKey) {
                    return category[i].text;
                }
            }
            return "";
        },

        /**
         * Function to format file size
         * @param {Number} iFileSizeInBytes 
         * @returns String
         */
        fnConverbytestoSize: function (iFileSizeInBytes) {
            var iDecimal = 2;
            if (!+iFileSizeInBytes) {
                return "0 Bytes";
            }
            var iK = 1024;
            var iDc = iDecimal < 0 ? 0 : iDecimal;
            var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

            var i = Math.floor(Math.log(iFileSizeInBytes) / Math.log(iK));

            return parseFloat((iFileSizeInBytes / Math.pow(iK, i)).toFixed(iDc)) + " " + sizes[i];
        },

        /**
         * Function to handle document download
         * @param {Object} oEvent 
         */
        onPressDocumentDownloadLink: function (oEvent) {
            // var table = this.oTable;
            var that = this;
            var multiDocs = this.oTable.getSelectedItems();
            var selectedItems = oEvent === undefined ? multiDocs : [oEvent.getSource()];
            var isOpenTextEnabled = this._featureFlagConfig.openTextEnabled === "1";

            if (selectedItems.length > 0) {
                selectedItems.forEach(function (selectedItem) {
                    var oSelected = selectedItem.getBindingContext().getObject();
                    var sType = oSelected.type;

                    if (isOpenTextEnabled) {
                        // eslint-disable-next-line no-empty
                        if (sType === "LINK") {
                            var sUrl = oSelected.previewUrl ? atob(oSelected.previewUrl) : "";
                            window.open(sUrl, "_blank");
                        }else{
                            that.datasource.downloadDocumentFromOpenText(oSelected.fileId);
                        }
                    } else {
                        if (sType === "LINK") {
                            sUrl = oSelected.previewUrl ? atob(oSelected.previewUrl) : "";
                            window.open(sUrl, "_blank");
                        } else {
                            var dataUrl = "data:" + sType + ";base64," + oSelected.previewUrl;
                            var a = document.createElement("a");
                            a.href = dataUrl;
                            a.target = "_blank";
                            a.download = oSelected.fileName;
                            a.click();
                        }
                    }
                });
                this.oTable.removeSelections();
                this.model.setProperty("/data/documents/removeBtn", false);
                // this.model.setProperty("/data/documents/IntelliEditBtn", false);

            }
        },

        /**
         * Function to handle document assign
         */
        assignDocument: function () {
            var that = this;
            //  var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._assignAttachmentModel.setProperty("/metadata", {
                featureFlag: {
                    hideAttachmentFields: this._featureFlagConfig.hideAttachmentFields
                }
            });

            if (!that._oAssignDialog) {
                Fragment.load({
                    id: "idAssignAttachmentDialog",
                    name: "com.asint.ais.library.fragment.AssignAttachment",
                    controller: that
                }).then(function (oValueHelpDialog) {
                    that._oAssignDialog = oValueHelpDialog;
                    that._oAssignDialog.setModel(that._i18n, "i18n");
                    that._oAssignDialog.setModel(that._MasterService, "MasterService")
                    that._oAssignDialog.setModel(that._assignAttachmentModel, "assignattachment"); // Set the new model to the dialog
                    that._oAssignDialog.open();
                    var oTable = sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable");
                    var oheader=oTable.getHeaderToolbar().getAggregation("content")[2]; 
                    oTable.getBinding("items").filter([]);
                    oheader.setValue("");
                });
            } else {
                that._oAssignDialog.open();
                var oTable = sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable");
                oTable.getBinding("items").filter([]);
                var oheader=oTable.getHeaderToolbar().getAggregation("content")[2];  
                oheader.setValue("");
            }

        },

        /**
         * Function to handle attachment cancel
         */
        fnAttachmentSelectCancel: function () {
            if (this._oAssignDialog) {

                var oTable = sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable");
                var oheader=oTable.getHeaderToolbar().getAggregation("content")[2];  
                oheader.setValue("");
                var assignTable=sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable");
                assignTable.removeSelections();
                this.oTable.removeSelections();
                this._oAssignDialog.close();
                this._oAssignDialog.destroy();
                this._oAssignDialog = null;
                this._assignAttachmentModel.setProperty("/aSelectedAttachment", []);
                this._assignAttachmentModel.setProperty("/aSelectedAttachmentId", []);
            }
        },

        /**
         * Function to assign documents
         * @param {Object} oEvent 
         * @returns Object
         */
        onAssignPress: function (oEvent) {
            var that = this;
            var model = this.model;
            var oTable = oEvent.getSource().getParent().getAggregation("content")[0];
            // var aSelectedItems = oTable.getSelectedItems();
            var inspID = this._inspID;
            var allDocIds = model.getProperty("/data/documents/list");
            var sLoggedInUser = that.getLoggedInUserMail();
            this._busyDialog.open();
            // var details=this.details;
            var uniqueAssignIds = [];
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var aSelectedItems = this._assignAttachmentModel.getProperty("/aSelectedAttachment");

            if (aSelectedItems.length > 0) {
                // Extract document IDs directly using map
                // var assignIds = allDocIds.map(function (doc) {
                //     return doc.docId;
                // });
                aSelectedItems.forEach(function (oSelectedItem) {
                    // var selectedId = oSelectedItem.getBindingContext("MasterService").getProperty("ID");
                    uniqueAssignIds.push(oSelectedItem.ID);

                });


                var aAlreadyAssigned = [];
                allDocIds.forEach(function(oSelected) {
                    if(uniqueAssignIds.includes(oSelected.docId)){
                        aAlreadyAssigned.push(oSelected.document);
                    }else{
                        uniqueAssignIds.push(oSelected.docId);
                    }
                });

                if (uniqueAssignIds.length > 0) {
                    oTable.removeSelections();
                } else {
                    return; // Exit early if no items are selected
                }

                var inspPay = model.getProperty("/data/documents/assessmentInfo");

                var inspPayload = {
                    ID: inspPay.ID,
                    category: inspPay.category,
                    createdAt: inspPay.createdAt,
                    createdBy: inspPay.createdBy,
                    deleted: inspPay.deleted,
                    modifiedAt: inspPay.modifiedAt,
                    modifiedBy: sLoggedInUser,
                    status: inspPay.status,
                    objectType: inspPay.objectType,
                    displayId: inspPay.displayId,
                    "@etag": inspPay.etag,
                    to_documents: uniqueAssignIds.map(function (docId) {
                        if (that._app === "INSP" || that._app === "ASD") {
                            return {
                                assessment_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            };
                        } else if (that._app === "MO") {
                            return {
                                maintenanceOrderMaster_ID: inspID,
                                deleted: false,
                                attachments_ID: docId
                            };
                        } else if (that._app === "FLOC") {
                            return {
                                location_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            }
                        } else if (that._app === "EQUI") {
                            return {
                                equipment_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            }
                        } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                            return {
                                recommendation_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            }
                        } else if (that._app === "TASK_MANAGEMENT") {
                            return {
                                generalTask_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            }
                        } else if (that._app === "MSP") {
                            return {
                                maintenanceSpendPlan_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            };
                        } else if (that._app === "FINDINGS") {
                            return {
                                findings_ID: inspID,
                                deleted: false,
                                document_ID: docId
                            };
                        }  else if(that._app==="RCA"){
                            return {
                                rcAssessment_ID: inspID,
                                document_ID: docId,
                                deleted: false
                            }

                        } else if(that._app==="MPOT"){
                            return {
                                optimisationAssessment_ID:inspID,
                                document_ID: docId,
                                deleted: false
                            }

                        } else if(that._app==="RCM"){
                            return {
                                rcmAssessment_ID:inspID,
                                document_ID: docId,
                                deleted: false
                            }

                        }else if(that._app==="FLEET"){
                            return {
                                classStrategyAssessment_ID: inspID,
                                document_ID: docId,
                                deleted: false
                            }

                        }else if(that._app==="RCaA"){
                            return {
                                rootCauseAnalysis_ID: inspID,
                                document_ID: docId,
                                deleted: false
                            }

                        } else if (that._app==="HAZOP") {
                            return {
                                hazopAssessment_ID: inspID,
                                document_ID: docId,
                                deleted: false
                            }
                        } else if (that._app==="SIL") {
                            return {
                                safetyAssessment_ID: inspID,
                                document_ID: docId,
                                deleted: false
                            }
                        }
                    })
                };
                if (this._app === "MO") {
                    inspPayload.to_attachments = inspPayload.to_documents;
                    delete inspPayload.to_documents;
                }

                inspPayload["@etag"] = inspPay["@etag"];
                var etag = inspPay["@etag"]
                this.datasource.attachTempToDocument(inspPayload, inspID, etag, that._app, function (oResult) {
                    inspPay["@etag"] = oResult["@etag"];
                    model.setProperty("/data/documents/assessmentInfo", inspPay);
                    if(that._app === "MSP" || that._app === "APM_RECO") {
                        that.fnAssignMSPDoctoRWB(that, that._app, oResult, "assign", aAlreadyAssigned, oI18n);
                    } else {
                        that._busyDialog.close();
                        that.attachDocumentToTable();
                        if (aAlreadyAssigned.length) {
                            that.fnMessageShow("I", oI18n.getText("TableConstructor.detail.tab.documents.alreadyAssigned.message.text"));
                        } else {
                            that.fnMessageShow("S", oI18n.getText("TableConstructor.detail.tab.documents.newAssign.success.message.text"));
                        }
                    }
                }, function () {
                    that._busyDialog.close();
                    that.fnMessageShow("E", "Something went wrong");
                    // Handle error
                });

                this.fnAttachmentSelectCancel();
            }
        },

        /**
         * Function to show document in table
         */
        attachDocumentToTable: function () {
            var table = this.oTable;
            var model = table.getModel();
            var curDocs = [];
            var that = this;

            var inspID = this._inspID;
            var convertToPreview="";

            this.datasource.getDocumentsId(inspID, this._app, function (response) {
                var documentId = [];
                if (["INSP", "ASD", "FLOC", "EQUI", "AIS_RECO", "APM_RECO", "MSP", "TASK_MANAGEMENT","FINDINGS","RCA","MPOT","RCM","FLEET","RCaA","HAZOP","SIL"].includes(that._app)) {
                    documentId = response.to_documents.filter(doc => !doc.deleted);
                } else if (that._app === "MO") {
                    documentId = response.to_attachments.filter(doc => !doc.deleted);
                    documentId.forEach(function (doc) {
                        doc.assessment_ID = doc.maintenanceOrderMaster_ID;
                        doc.document_ID = doc.attachments_ID
                    })
                }
                var docLength = Array.isArray(documentId) ? documentId.length : 0;

                if (Array.isArray(documentId)) {
                    model.setProperty("/data/documents/attachDocumentsList", documentId);
                } else {
                    model.setProperty("/data/documents/attachDocumentsList", []);
                }


                var promises = documentId.map(function (doc) {
                    return new Promise(function (resolve) {
                        that.datasource.getDocumentsByIds(doc.document_ID, function (response) {
                            
                            var description = "";
                            if (response.to_description && response.to_description.length > 0) {
                                description = response.to_description[0].shortDescription;
                            }

                            // //if no desc
                            var displayName = description || (response.to_file.type === "LINK" ? atob(response.to_file.content) : response.to_file.name.split(".")[0]);

                            var newfileObj = {
                                "fileName": response.to_file.name,
                                "docId": response.ID,
                                "fileId": response.to_file ? response.to_file.ID : "",
                                "fileType": that.formatter.fnFormatAttachmentIconBasedOnFileTypeGroup(response.to_file.type),
                                "type": response.to_file.type,
                                "previewUrl": response.to_file.content,
                                "createdBy": response.createdBy,
                                // "documentName": response.to_file.type === "LINK" ? atob(response.to_file.content) : description,
                                "documentName": displayName,
                                "document": response.displayId,
                                "fileTypeGroup": that.formatter.fnFormatAttachmentIconBasedOnFileType(response.to_file.type),
                                "fileSize": that.formatter.fnConverbytestoSize(response.to_file.size),
                                "fileSizeNumber": response.to_file.size,
                                "category": that.keyToCategory(response.category),
                                "confidentiality": response.confidentiality,
                                "language": that.keyToName(response.language),
                                "phase": that.getNamesFromKeys(response.phase),
                                "modifiedAt": response.to_file.modifiedAt,
                                "to_points": response.to_points || [],
                                "externalData": response.externalData || "",
                                "documentData": response.documentData || "",
                                "version": response.to_file.version || 0,
                            };
                            if(response.to_file.type === "image/jpeg" || response.to_file.type === "image/png" || response.to_file.type === "image/pjpeg" || response.to_file.type === "image/bmp" || response.to_file.type==="image/tiff"){
                                convertToPreview=that.convertToPreview(response.to_file.content, response.to_file.type)
                            }else{
                                convertToPreview="";
                            }
                            newfileObj.convertToPreview=convertToPreview;
                            curDocs.push(newfileObj);
                            resolve();
                        }, function () {
                            resolve();
                        });
                    });
                });

                Promise.all(promises)
                    .then(function () {
                        curDocs.sort(function (a, b) {
                            const dateA = new Date(a.modifiedAt);
                            const dateB = new Date(b.modifiedAt);

                            if (dateA > dateB) {
                                return -1;
                            } else if (dateA < dateB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        model.setProperty("/data/documents/list", curDocs);
                        model.setProperty("/data/documents/docLength", docLength);
                        that.fnSetOpenText(curDocs);
                        model.refresh();

                    })
                    .catch(function () {
                    })
                    .finally(function () {
                        model.refresh();
                    });
            });
        },


        /**
         * Function to remove document
         */
        onremove: function () {
            var that = this;

            // Add confirmation dialog
            sap.m.MessageBox.confirm("You are about to delete one or more documents. Do you want to continue?", {
                title: "Confirmation",
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                /**
                 * Function to handle message box close
                 */
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        // User clicked "Yes", proceed with deletion
                        that._busyDialog.open();
                        var oTable = that.oTable;
                        var docs = oTable.getSelectedItems();
                        var model = that.model;
                        var inspID = that._inspID;
                        var allDocIds = model.getProperty("/data/documents/list");
                        oTable.removeSelections();
                        var to_documents = allDocIds.map(function (doc) {
                            if (that._app === "ASD" || that._app === "INSP") {
                                return {
                                    assessment_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId
                                };
                            } else if (that._app === "FLOC") {
                                return {
                                    location_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId
                                };
                            } else if (that._app === "EQUI") {
                                return {
                                    equipment_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId
                                };
                            } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                                return {
                                    recommendation_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId
                                };
                            } else if (that._app === "TASK_MANAGEMENT") {
                                return {
                                    generalTask_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId
                                }
                            }  else if (that._app === "MSP") {
                                return {
                                    maintenanceSpendPlan_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId,
                                };
                            } else if (that._app === "FINDINGS") {
                                return {
                                    findings_ID: inspID,
                                    deleted: false,
                                    document_ID: doc.docId,
                                };
                            }  else if(that._app==="RCA"){
                                return {
                                    rcAssessment_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }

                            } else if(that._app==="MPOT"){
                                return {
                                    optimisationAssessment_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }

                            } else if(that._app==="RCM"){
                                return {
                                    rcmAssessment_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }

                            }else if(that._app==="FLEET"){
                                return {
                                    classStrategyAssessment_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }

                            }
                            else if(that._app==="RCaA"){
                                return {
                                    rootCauseAnalysis_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }

                            } else if (that._app === "HAZOP") {
                                return {
                                    hazopAssessment_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }
                            } else if (that._app === "SIL") {
                                return {
                                    safetyAssessment_ID: inspID,
                                    document_ID: doc.docId,
                                    deleted: false
                                }
                            }

                        });

                        if (docs.length > 0) {
                            var selectedIds = docs.map(function (doc) {
                                return doc.getBindingContext().getProperty("docId");
                            });

                            to_documents.forEach(function (doc) {
                                if (selectedIds.includes(doc.document_ID)) {
                                    doc.deleted = true;
                                }
                            });
                        }

                        to_documents = to_documents.filter(function (oDoc) {
                            return oDoc.deleted === false;
                        })

                        if (!to_documents) {
                            to_documents = [];
                        }

                        var inspPay = model.getProperty("/data/documents/assessmentInfo");

                        var inspPayload = {
                            ID: inspPay.ID,
                            "@etag": inspPay.etag,
                            createdBy : inspPay.createdBy,
                            modifiedBy : that.getLoggedInUserMail(),
                            to_documents: to_documents
                        };

                        if (that._app === "MO") {
                            inspPayload.to_attachments = inspPayload.to_documents;
                            delete inspPayload.to_documents;
                            inspPayload.to_attachments.forEach(function (doc) {
                                doc.maintenanceOrderMaster_ID = doc.assessment_ID;
                                doc.attachments_ID = doc.document_ID;
                                delete doc.assessment_ID;
                                delete doc.document_ID;
                            })
                        }
                        inspPayload["@etag"] = inspPay["@etag"];
                        var etag = inspPay["@etag"];
                        delete inspPayload["@etag"];

                        var isOpenTextDelete =  that._featureFlagConfig.openTextDelete ==="1";
                        var isOpenTextEnabled =  that._featureFlagConfig.openTextEnabled ==="1";

                        var fnAttachTemp = function(){
                            that.datasource.attachTempToDocument(inspPayload, inspID, etag, that._app, function (oResult) {
                                inspPay["@etag"] = oResult["@etag"];
                                model.setProperty("/data/documents/assessmentInfo", inspPay);
                                if(that._app === "MSP" || that._app === "APM_RECO") {
                                    that.fnAssignMSPDoctoRWB(that, that._app, oResult, "unassign");
                                } else {
                                    that._busyDialog.close();
                                    that.attachDocumentToTable();
                                    that.showRemoveDialog();
                                }
                            }, function () {
                                that._busyDialog.close();
                                that.fnMessageShow("E", "Something went wrong");
                                // Handle error
                            });
                        };

                        if(isOpenTextDelete && isOpenTextEnabled && docs.length > 0){
                            var iCompleted = 0;
                            var bError = false
                            docs.forEach(function(oDoc){
                                var oDocObj = oDoc.getBindingContext().getObject();
                                var oOTPayload = {
                                    ID: inspPay.ID,
                                    objectType: that._app,
                                    fileInfoID: oDocObj.fileId
                                };
                                that.datasource.deleteDocumentOpenText(oOTPayload, function(){
                                    iCompleted++;
                                    if(iCompleted === docs.length && !bError){
                                        fnAttachTemp();
                                    }
                                }, function(){
                                    if(!bError){
                                        bError = true;
                                        that._busyDialog.close();
                                        that.fnMessageShow("E", "Failed to delete document")
                                    }
                                });
                            });
                        }else{
                            fnAttachTemp();
                        }
                    }
                    // If "No" is clicked, do nothing
                }
            });
        },

        /**
         * Function to show sucess dialog
         */
        showSuccessDialog: function () {
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var message = oI18n.getText("TableConstructor.detail.tab.documents.newAssign.success.message.text");
            this.fnMessageShow("S", message);
        },

        /**
         * Function to show dialog
         */
        showRemoveDialog: function () {
            var message = "Document(s) deleted successfully."
            // var oDialog = new sap.m.Dialog({
            //   title: "Success",
            //   type: sap.m.DialogType.Message,
            //   content: new sap.m.Text({
            //     text: message
            //   }),
            //   afterClose: function () {
            //     oDialog.destroy();
            //   }
            // });

            // oDialog.open();

            // setTimeout(function () {
            //   oDialog.close();
            // }, 3000);
            this.fnMessageShow("S", message);
            this.model.setProperty("/data/documents/removeBtn", false);
        },

        /**
         * Function to convert to preview
         * @param {String} previewUrl 
         * @param {String} type 
         * @returns String
         */
        convertToPreview: function (previewUrl, type) {
            var dataUrl = "data:" + type + ";base64," + previewUrl;
            return dataUrl;
        },

        /**
         * Function to format phase
         * @param {String} sPhaseNames 
         * @returns 
         */
        getKeysFromPhaseString: function (sPhaseNames) {
            // Split the comma-separated string into an array of phase names
            var aNames = sPhaseNames.split(",");
            var aPhaseDropdown = this.model.getProperty("/data/documents/phaseDropdown");
            // Find the keys for the given phase names
            var aKeys = aNames.map(function (sName) {
                var foundPhase = aPhaseDropdown.find(function (phase) {
                    return phase.text === sName.trim();
                });
                return foundPhase ? foundPhase.key : null;
            });

            // Filter out null values (phase names that were not found)
            aKeys = aKeys.filter(function (key) {
                return key !== null;
            });

            // Join the keys into a comma-separated string
            var sKeys = aKeys.join(",");
            return sKeys;
        },

        /**
         * Function to format phase
         * @param {String} sKeys 
         * @returns String
         */
        getNamesFromKeys: function (sKeys) {
            // Split the comma-separated string into an array of keys
            if (sKeys) {
                var aKeys = sKeys.split(",");
                var aPhaseDropdown = this.model.getProperty("/data/documents/phaseDropdown");

                // Find the names for the given keys
                var aNames = aKeys.map(function (sKey) {
                    var foundPhase = aPhaseDropdown.find(function (phase) {
                        return phase.key === sKey.trim();
                    });
                    return foundPhase ? foundPhase.text : null;
                });

                // Filter out null values (keys that were not found)
                aNames = aNames.filter(function (name) {
                    return name !== null;
                });

                // Join the names into a comma-separated string
                var sNames = aNames.join(",");
                return sNames;
            } else {
                return "";
            }
        },

        /**
         * Function to handle documents search
         * @param {Object} oEvent 
         */
        onSearchDocuments: function (oEvent) {
            // var that = this;
            var oTable = oEvent.getSource().getParent().getParent();
            var sQuery = oEvent.getSource().getValue();
            if (sQuery === "") {
                oTable.getBinding("items").filter([]);
            } else {
                var oFilterArr = new Filter([
                    new Filter({path:"fileName",operator:FilterOperator.Contains,value1:sQuery,caseSensitive:false}),
                    new Filter({path:"displayId",operator:FilterOperator.Contains,value1:sQuery,caseSensitive:false}),
                    new Filter({path:"phase",operator:FilterOperator.Contains,value1:sQuery,caseSensitive:false}),
                    new Filter({path:"documentShortDescription",operator:FilterOperator.Contains,value1:sQuery,caseSensitive:false})
                ], false);
            }
            oTable.getBinding("items").filter(oFilterArr);
        },

        /**
         * Function to handle on data received
         * @param {Object} oEvent 
         */
        onDataReceived: function () {

            var oModel = this._assignAttachmentModel;
            this.fnFetchInlineCountFragmentTable(this, sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable"), function (sCount) {
                var sHeader = "Attachments (" + sCount + ")";
                oModel.setProperty("/title", sHeader);
            });

            var aSelected = oModel.getProperty("/aSelectedAttachmentId");
            var oTabel = sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable");
            var aItems = oTabel.getItems();
            aItems.forEach(function(oItem){
                oItem.setSelected(false);
                var oItemsObj = oItem.getBindingContext("MasterService").getObject();
                if(oItemsObj){
                    var sId = oItemsObj.ID;
                    if(aSelected.includes(sId)){
                        oItem.setSelected(true);
                    }
                }
            })
        },

        /**
         * Fucntion that gives the selected documents data
         * @param {Object} oEvent 
         */
        onSelectedDocuments: function (oEvent) {
            var aSelectedItems = oEvent.getSource().getSelectedItems();
            if (aSelectedItems.length > 0) {
                this.model.setProperty("/data/documents/removeBtn", true);
            } else {
                this.model.setProperty("/data/documents/removeBtn", false);
            }

            var bEnableIntelliEdit = false;

            if (aSelectedItems.length === 1) {
                var oSelectedObj = aSelectedItems[0].getBindingContext().getObject();
                if (oSelectedObj && oSelectedObj.type && (oSelectedObj.type.indexOf("image/") === 0 ||oSelectedObj.type === "application/pdf")){
                    bEnableIntelliEdit = true;
                }
            }
            this.model.setProperty("/data/documents/IntelliEditBtn",bEnableIntelliEdit);
        },

        /**
         * Function to change switch state
         * @param {Object} oEvent 
         */
        onChange: function (oEvent) {
            var sState = oEvent.getParameter("state") ? true : false;
            this.model.setProperty("/documents/userInput/confidentiality", sState);
        },

        /**
         * Handles Combox selection change
         * @param {object} oEvent 
         */
        handleChange: function (oEvent) {
            var oValidatedComboBox = oEvent.getSource(),
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();

            if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(CoreLibrary.ValueState.Error);
            } else {
                oValidatedComboBox.setValueState(CoreLibrary.ValueState.None);
            }
        },

        /**
         * Validates if the fields are valid on create
         * @returns Boolean
         */
        validateFields: function () {
            var oModel = this._oAddAttachDialog.getModel("mTableHandler");
            var isLinkVisible = oModel.getProperty("/documents/userInput/linkVisible");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var bValidFields = true;
            var sCategoryValueState, sLanguageValueState = "";
            if (isLinkVisible) {
                sCategoryValueState = sap.ui.core.Fragment.byId("attachdialog", "categorycomboBox3").getValueState();
                sLanguageValueState = sap.ui.core.Fragment.byId("attachdialog", "languagecomboBox2").getValueState();
            } else {
                sCategoryValueState = sap.ui.core.Fragment.byId("attachdialog", "categorycomboBox").getValueState();
                sLanguageValueState = sap.ui.core.Fragment.byId("attachdialog", "languagecomboBox").getValueState();
            }
            if (sCategoryValueState == "Error" || sLanguageValueState == "Error") {
                bValidFields = false;
                sap.m.MessageToast.show(oI18n.getText("TableConstructor.detail.tab.documents.validation.error"));
            }
            return bValidFields;
        },

        /**
         * Resets Category and language fields
         */
        resetField: function () {
            var oModel = this._oAddAttachDialog.getModel("mTableHandler");
            var isLinkVisible = oModel.getProperty("/documents/userInput/linkVisible");
            var oCategory, oLanguage;
            if (isLinkVisible) {
                oCategory = sap.ui.core.Fragment.byId("attachdialog", "categorycomboBox3");
                oLanguage = sap.ui.core.Fragment.byId("attachdialog", "languagecomboBox2");
            } else {
                oCategory = sap.ui.core.Fragment.byId("attachdialog", "categorycomboBox");
                oLanguage = sap.ui.core.Fragment.byId("attachdialog", "languagecomboBox");
            }

            oCategory.setValueState(CoreLibrary.ValueState.None);
            oCategory.setValue("");
            oLanguage.setValueState(CoreLibrary.ValueState.None);
        },

        /**
         * On attachment selection change
         * @param {Object} oEvent 
         */
        onSelectionChange : function (oEvent) {
            
            var aAttachmentList = this._assignAttachmentModel.getProperty("/aSelectedAttachment");
            var aAttachmentListId = this._assignAttachmentModel.getProperty("/aSelectedAttachmentId");
            var aSelectedAttachmentList = oEvent.getSource().getSelectedItems();
            var isSelected = oEvent.getParameter("selected");
            var aDeselectedItems = oEvent.getParameter("listItems");

            if (isSelected) {
                aSelectedAttachmentList.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("MasterService").getObject();
                    if (!aAttachmentListId.includes(oContext.ID)) {
                        aAttachmentListId.push(oContext.ID);
                        aAttachmentList.push(oContext);
                    }
                });
            } else {
                aDeselectedItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext("MasterService").getObject();
                    var index = aAttachmentListId.indexOf(oContext.ID);
                    if (index !== -1) {
                        aAttachmentListId.splice(index, 1);
                        aAttachmentList = aAttachmentList.filter(function(item) {
                            return item.ID !== oContext.ID;
                        });
                    }
                });
            }

            this._assignAttachmentModel.setProperty("/aSelectedAttachment", aAttachmentList);
            this._assignAttachmentModel.setProperty("/aSelectedAttachmentId", aAttachmentListId);
        },

        // onLiveChangeSearchField:function(oEvent){
        //     var sValue = oEvent.getParameter("newValue");
        //     if (sValue === "") {
        //         var assignTable=sap.ui.core.Fragment.byId("idAssignAttachmentDialog", "Assigntable");
        //         assignTable.removeSelections();
        //     }
        // }

        /**
         * Function to Save the Documents in MSP and RWB+ (APM Recommendation) only after the normal success call completed
         * 
         * @param {Object} that - this control
         * @param {String} sApp - App name
         * @param {Object} oResult - Success result
         * @param {String} sAssignType - Assign Type like Add/Assign/Unassign
         * @param {Array} aAlreadyAssigned - Already assigned document list
         * @param {Object} oI18n - i18n text
         */
        fnAssignMSPDoctoRWB: function (that, sApp, oResult, sAssignType, aAlreadyAssigned, oI18n) {

            if(sApp === "MSP" || sApp === "APM_RECO") {
                var oAPMRecomPayload = {}; var aAPMRecomDocList = []; var oFinalPayload = {};
                var sID = "", sEtag = "", sApptoSave = "";
                if (sApp === "MSP") {
                    oAPMRecomPayload = {
                        recommendation_ID: "",
                        deleted: false,
                        document_ID: ""
                    };
                    aAPMRecomDocList = [];
                    oResult.to_documents.forEach(function(oDoc){
                        oAPMRecomPayload = {
                            recommendation_ID: oResult.apmRecommendation_ID,
                            deleted: false,
                            document_ID: oDoc.document_ID
                        };
                        aAPMRecomDocList.push(oAPMRecomPayload);
                    });

                    oFinalPayload = {
                        ID: oResult.apmRecommendation_ID,
                        to_documents: aAPMRecomDocList
                    }

                    sID = oResult.apmRecommendation_ID;
                    sEtag = oResult["@etag"];
                    sApptoSave = "APM_RECO";

                } else if (sApp === "APM_RECO") {
                    oAPMRecomPayload = {
                        maintenanceSpendPlan_ID: "",
                        deleted: false,
                        document_ID: ""
                    };
                    aAPMRecomDocList = [];
                    oResult.to_documents.forEach(function(oDoc){
                        oAPMRecomPayload = {
                            maintenanceSpendPlan_ID: oResult.maintenanceSpendPlan_ID,
                            deleted: false,
                            document_ID: oDoc.document_ID
                        };
                        aAPMRecomDocList.push(oAPMRecomPayload);
                    });

                    oFinalPayload = {
                        ID: oResult.maintenanceSpendPlan_ID,
                        to_documents: aAPMRecomDocList
                    };

                    sID = oResult.maintenanceSpendPlan_ID;
                    sEtag = oResult.maintenanceSpendPlan.modifiedAt;
                    sApptoSave = "MSP";
                }

                if(sID) {
                    that.datasource.attachTempToDocument(oFinalPayload, sID, sEtag, sApptoSave, function () {
                        that.fnResetDialogGetAttachment(sAssignType, aAlreadyAssigned, oI18n, that);
                    }, function () {
                        
                    });
                } else {
                    that.fnResetDialogGetAttachment(sAssignType, aAlreadyAssigned, oI18n, that);
                }
            } else {
                that.fnResetDialogGetAttachment(sAssignType, aAlreadyAssigned, oI18n, that);
            }
        },

        /**
         * Function to get all the data after success
         * 
         * @param {String} sAssignType - Assign Type like Add/Assign/Unassign
         * @param {Array} aAlreadyAssigned - Already assigned document list 
         * @param {Object} oI18n  - i18n text
         * @param {Object} that - this control
         */
        fnResetDialogGetAttachment: function (sAssignType, aAlreadyAssigned, oI18n, that) {

            if (sAssignType === "assign") {
                that._busyDialog.close();
                that.attachDocumentToTable();
                if(aAlreadyAssigned && aAlreadyAssigned.length){
                    that.fnMessageShow("I", oI18n.getText("TableConstructor.detail.tab.documents.alreadyAssigned.message.text"));
                }else{
                    that.fnMessageShow("S", oI18n.getText("TableConstructor.detail.tab.documents.newAssign.success.message.text"));
                }
            } else if (sAssignType === "unassign") {
                that._busyDialog.close();
                that.attachDocumentToTable();
                that.showRemoveDialog();
            } else if (sAssignType === "add") {
                that.attachDocumentToTable();
                that.showSuccessDialog();
            }

        },


        /**
         *
         */
        fnSetOpenText:function(oResponse){
            var that=this;
            if(this._app === "RCM" || this._app === "FLEET") {
                var isOpentext="No";
                if(oResponse && oResponse.length > 0) {
                    oResponse.forEach(function(oDoc){
                        if(oDoc.category === "Operating context"){
                            isOpentext="Yes";
                        }
                    });
                }
                var oModel = this.model;
                var oAssesmentInfo = oModel.getProperty("/data/documents/assessmentInfo");
                if(this._app === "RCM") {
                    var oPayload={
                        ID: oAssesmentInfo.ID,
                        "@etag": oAssesmentInfo["@etag"],
                        operatingContextLink: isOpentext
                    }
                    that.rcmAssessmentDataSource.updateRcmAssessmentDetails(oAssesmentInfo.ID, oPayload, function(oResult){
                        oModel.setProperty("/data/documents/assessmentInfo", oResult);
                        var oBackupRCM = JSON.parse(JSON.stringify(oResult));
                        oModel.setProperty("/data/detailBackup", oBackupRCM);
                        oModel.setProperty("/data/detail", oResult);
                        oModel.setProperty("/data/etag", oResult["@etag"]);
                        oModel.refresh(true);
                        
                    },function(){

                    },oAssesmentInfo["@etag"])
                    
                }else if(this._app === "FLEET") {
                    var oPayloadForFleet={
                        ID: oAssesmentInfo.ID,
                        "@etag": oAssesmentInfo["@etag"],
                        operatingContextLink: isOpentext
                    }
                    that.fleet.updateFleetAssessmentDetails(oAssesmentInfo.ID, oPayloadForFleet, function(oResult){
                        oModel.setProperty("/data/documents/assessmentInfo", oResult);
                        var oBackup = JSON.parse(JSON.stringify(oResult));
                        oModel.setProperty("/data/detailBackup", oBackup);
                        oModel.setProperty("/data/detail", oResult);
                        oModel.setProperty("/data/etag", oResult["@etag"]);
                        oModel.refresh(true);
                    },function(){

                    },oAssesmentInfo["@etag"])
                }

            }

        }, 

        /* below contains the code for IntelliEdit/View */

        /**
         * Resolves the file source for IntelliEdit/View.
         * For OpenText tenants, builds direct file URL via datasource.
         * For APM/AIS, uses the existing base64 content already loaded.
         * Calls fnProceed(sSrc) once the source is ready.
         */
        _fetchOpenTextContent: function (oSelectedObj, fnProceed) {
            var isOpenTextEnabled = this._featureFlagConfig.openTextEnabled === "1";

            // Non-OpenText: content already loaded as base64, proceed immediately
            var sExistingSrc = oSelectedObj.editedImageUrl || oSelectedObj.convertToPreview || oSelectedObj.previewUrl;
            if (!isOpenTextEnabled) {
                fnProceed(sExistingSrc);
                return;
            }

            // OpenText: get direct file URL via datasource
            var sFileId = oSelectedObj.fileId;
            if (!sFileId) {
                sap.m.MessageToast.show("File ID not found for OpenText document.");
                return;
            }

            var sOpenTextUrl = this.datasource.getOpenTextFileUrl(sFileId);

            // Cache so re-opening same file doesn't rebuild URL
            oSelectedObj.convertToPreview = sOpenTextUrl;
            oSelectedObj.previewUrl = sOpenTextUrl;

            fnProceed(sOpenTextUrl);
        },

        /**
         * 
         */
        _onRowIntelliAction: function (oObj, sMode) {
            var that = this;
            if (!oObj || !oObj.type) { return; }

            var bIsImage = oObj.type.indexOf("image/") === 0;
            var bIsPdf   = oObj.type === "application/pdf";

            if (!bIsImage && !bIsPdf) {
                sap.m.MessageToast.show("IntelliEdit/View is only available for images and PDFs");
                return;
            }

            that._fetchOpenTextContent(oObj, function (sSrc) {
                if (!sSrc) {
                    sap.m.MessageToast.show("Preview not available for this file");
                    return;
                }
                if (sMode === "edit") {
                    if (bIsImage) {
                        that._oIntelliEditState = { activeTool: null, color: "#F44336", size: 12, undoStack: [], redoStack: [], isDrawing: false, zoomLevel: 1.0 };
                        if (!that._oIntelliEditDialog) {
                            Fragment.load({ id: "idIntelliEditDialog", name: "com.asint.ais.library.fragment.IntelliEdit", controller: that }).then(function (oDialog) {
                                that._oIntelliEditDialog = oDialog;
                                that._oIntelliEditDialog.addStyleClass("sapUiSizeCompact");
                                that._oIntelliEditDialog.setModel(that._i18n, "i18n");
                                that._oIntelliEditDialog.setBusyIndicatorDelay(0);
                                that._oIntelliEditDialog.setBusy(true);
                                that._oIntelliEditDialog.open();
                                that._initializeCanvas(sSrc, oObj);
                            });
                        } else {
                            that._oIntelliEditDialog.setBusyIndicatorDelay(0);
                            that._oIntelliEditDialog.setBusy(true);
                            that._oIntelliEditDialog.open();
                            that._initializeCanvas(sSrc, oObj);
                        }
                    } else {
                        that._oPDFIntelliEditState = { activeTool: null, color: "#F44336", size: 12, undoStack: [], redoStack: [], isDrawing: false, zoomLevel: 1.0 };
                        if (!that._oPDFIntelliEditDialog) {
                            Fragment.load({ id: "idIntelliEditPDFDialog", name: "com.asint.ais.library.fragment.IntelliEditPDF", controller: that }).then(function (oDialog) {
                                that._oPDFIntelliEditDialog = oDialog;
                                that._oPDFIntelliEditDialog.addStyleClass("sapUiSizeCompact");
                                that._oPDFIntelliEditDialog.setModel(that._i18n, "i18n");
                                that._oPDFIntelliEditDialog.setBusyIndicatorDelay(0);
                                that._oPDFIntelliEditDialog.setBusy(true);
                                that._oPDFIntelliEditDialog.open();
                                that._initializePDFCanvas(sSrc, oObj);
                            });
                        } else {
                            that._oPDFIntelliEditDialog.setBusyIndicatorDelay(0);
                            that._oPDFIntelliEditDialog.setBusy(true);
                            that._oPDFIntelliEditDialog.open();
                            that._initializePDFCanvas(sSrc, oObj);
                        }
                    }
                } else {
                    if (bIsImage) {
                        if (!that._oIntelliViewDialog) {
                            Fragment.load({ id: "idIntelliViewDialog", name: "com.asint.ais.library.fragment.IntelliView", controller: that }).then(function (oDialog) {
                                that._oIntelliViewDialog = oDialog;
                                that._oIntelliViewDialog.setModel(that._i18n, "i18n");
                                that._oIntelliViewDialog.addStyleClass("sapUiSizeCompact");
                                that._oIntelliViewDialog.setBusyIndicatorDelay(0);
                                that._oIntelliViewDialog.setBusy(true);
                                that._oIntelliViewDialog.open();
                                that._initializeIntelliView(sSrc, oObj);
                            });
                        } else {
                            that._oIntelliViewDialog.setBusyIndicatorDelay(0);
                            that._oIntelliViewDialog.setBusy(true);
                            that._oIntelliViewDialog.open();
                            that._initializeIntelliView(sSrc, oObj);
                        }
                    } else {
                        that._oPDFViewState = { zoomLevel: 1.0 };
                        if (!that._oPDFIntelliViewDialog) {
                            Fragment.load({ id: "idIntelliViewPDFDialog", name: "com.asint.ais.library.fragment.IntelliViewPDF", controller: that }).then(function (oDialog) {
                                that._oPDFIntelliViewDialog = oDialog;
                                that._oPDFIntelliViewDialog.addStyleClass("sapUiSizeCompact");
                                that._oPDFIntelliViewDialog.setModel(that._i18n, "i18n");
                                that._oPDFIntelliViewDialog.setBusyIndicatorDelay(0);
                                that._oPDFIntelliViewDialog.setBusy(true);
                                that._oPDFIntelliViewDialog.open();
                                that._initializePDFView(sSrc, oObj);
                            });
                        } else {
                            that._oPDFIntelliViewDialog.setBusyIndicatorDelay(0);
                            that._oPDFIntelliViewDialog.setBusy(true);
                            that._oPDFIntelliViewDialog.open();
                            that._initializePDFView(sSrc, oObj);
                        }
                    }
                }
            });
        },

        /**
         * Opens the IntelliEdit dialog 
         */
        onPressIntelliEdit: function () {
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var that = this;
            var aSelectedItems = that.oTable.getSelectedItems();
            if (!aSelectedItems.length) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectImageToEdit.text"));
                return;
            }

            var oSelectedObj = aSelectedItems[0].getBindingContext().getObject();
            
            if (!oSelectedObj.type || oSelectedObj.type.indexOf("image/") !== 0) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectImageFile.text"));
                return;
            }

            that._oIntelliEditState = {
                activeTool: null, color: "#F44336", size: 12,
                undoStack: [], redoStack: [], isDrawing: false, zoomLevel: 1.0
            };

            that._busyDialog.open();

            that._fetchOpenTextContent(oSelectedObj, function (sImageSrc) {
                that._busyDialog.close();
                if (!sImageSrc) {
                    sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.imagePreviewNotAvailable.text"));
                    return;
                }
                if (!that._oIntelliEditDialog) {
                    Fragment.load({
                        id: "idIntelliEditDialog",
                        name: "com.asint.ais.library.fragment.IntelliEdit",
                        controller: that
                    }).then(function (oDialog) {
                        that._oIntelliEditDialog = oDialog;
                        that._oIntelliEditDialog.addStyleClass("sapUiSizeCompact");
                        that._oIntelliEditDialog.setModel(that._i18n, "i18n");
                        that._oIntelliEditDialog.open();
                        that._initializeCanvas(sImageSrc, oSelectedObj);
                    });
                } else {
                    that._oIntelliEditDialog.open();
                    that._initializeCanvas(sImageSrc, oSelectedObj);
                }
            });
        },

        /**
         * Save current canvas state for undo/redo
         */
        _saveState: function () {
            if (!this._canvas || !this._ctx) return;
    
            if (!this._oIntelliEditState.undoStack) {
                this._oIntelliEditState.undoStack = [];
            }
            if (!this._oIntelliEditState.redoStack) {
                this._oIntelliEditState.redoStack = [];
            }
            
            var imageData = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
            this._oIntelliEditState.undoStack.push(imageData);
            this._oIntelliEditState.redoStack = [];
            
            if (this._oIntelliEditState.undoStack.length > 50) {
                this._oIntelliEditState.undoStack.shift();
            }
            
            this._updateUndoRedoButtons();
        },

        /**
         * Update undo/redo button states
         */
        _updateUndoRedoButtons: function () {
            var oUndoBtn = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idUndoBtn");
            var oRedoBtn = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idRedoBtn");
            
            if (oUndoBtn) {
                oUndoBtn.setEnabled(this._oIntelliEditState.undoStack.length > 1);
            }
            if (oRedoBtn) {
                oRedoBtn.setEnabled(this._oIntelliEditState.redoStack.length > 0);
            }
        },

        /**
         * Tool selection handlers
         */
        onSelectTextTool: function () {
            this._setActiveTool("TEXT");
        },

        /**
         * 
         */
        onSelectBrushTool: function () {
            this._setActiveTool("BRUSH");
        },

        /**
         * Set active editing tool
         * @param {string} sTool 
         */
        _setActiveTool: function (sTool) {
            var oState = this._oIntelliEditState;

            if (sTool === null) {
                oState.activeTool = null;
                this._detachCanvasHandlers();
                this._updateToolButtons();
                return;
            }
            
            if (oState.activeTool === sTool) {
                oState.activeTool = null;
                this._detachCanvasHandlers();
            } else {
                oState.activeTool = sTool;
                this._attachCanvasHandlers();
                
                // Deselect any active finding markup when switching to a drawing tool
                if (this._activeMarkup) {
                    this._activeMarkup.isSelected = false;
                    this._activeMarkup = null;
                    this._renderAllMarkups();
                }
            }
            
            this._updateToolButtons();
            // this._updateToolDependentControls();
        },

        /**
         * Update tool button pressed states
         */
        _updateToolButtons: function () {
            var sTool = this._oIntelliEditState.activeTool;
            
            var oTextBtn = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idTextToolBtn");
            var oCropBtn = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idCropToolBtn");
            var oBrushBtn = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idBrushToolBtn");
            
            if (oTextBtn) oTextBtn.setPressed(sTool === "TEXT");
            if (oCropBtn) oCropBtn.setPressed(sTool === "CROP");
            if (oBrushBtn) oBrushBtn.setPressed(sTool === "BRUSH");
        },

        /**
         * Attach canvas event handlers based on active tool
         */
        _attachCanvasHandlers: function () {
            var that = this;
            this._detachCanvasHandlers();
            if (!this._canvas) {
                return;
            }
            var sTool = this._oIntelliEditState.activeTool;

            switch (sTool) {
            case "BRUSH":
                this._canvas.addEventListener("mousedown", this._brushMouseDown = function (oEvent) {
                    that._onBrushStart(oEvent);
                });
                this._canvas.addEventListener("mousemove", this._brushMouseMove = function (oEvent) {
                    that._onBrushMove(oEvent);
                });
                this._canvas.addEventListener("mouseup", this._brushMouseUp = function (oEvent) {
                    that._onBrushEnd(oEvent);
                });
                this._canvas.addEventListener("mouseleave", this._brushMouseLeave = function (oEvent) {
                    that._onBrushEnd(oEvent);
                });
                break;

            case "TEXT":
                this._canvas.addEventListener("click", this._textClick = function (oEvent) {
                    that._onTextClick(oEvent);
                });
                break;
            }
        },

        /**
         * Detach all canvas event handlers
         */
        _detachCanvasHandlers: function () {
            if (!this._canvas) return;
            
            if (this._brushMouseDown) this._canvas.removeEventListener("mousedown", this._brushMouseDown);
            if (this._brushMouseMove) this._canvas.removeEventListener("mousemove", this._brushMouseMove);
            if (this._brushMouseUp) this._canvas.removeEventListener("mouseup", this._brushMouseUp);
            if (this._brushMouseLeave) this._canvas.removeEventListener("mouseleave", this._brushMouseLeave);
            if (this._textClick) this._canvas.removeEventListener("click", this._textClick);
        },

        /**
         * Brush tool event handlers
         */
        _onBrushStart: function (oEvent) {
            this._oIntelliEditState.isDrawing = true;
            var pos = this._getCanvasCoordinates(oEvent);
            this._lastPos = pos;
            this._currentBrushStrokes = [];
        },

        /**
         *on brush move
         */
        _onBrushMove: function (oEvent) {
            if (!this._oIntelliEditState.isDrawing) return;

            var pos = this._getCanvasCoordinates(oEvent);

            this._currentBrushStrokes.push({
                from: { x: this._lastPos.x, y: this._lastPos.y },
                to: { x: pos.x, y: pos.y },
                color: this._oIntelliEditState.color,
                lineWidth: this._oIntelliEditState.size
            });

            this._ctx.strokeStyle = this._oIntelliEditState.color;
            this._ctx.lineWidth = this._oIntelliEditState.size;
            this._ctx.lineCap = "round";
            this._ctx.lineJoin = "round";

            this._ctx.beginPath();
            this._ctx.moveTo(this._lastPos.x, this._lastPos.y);
            this._ctx.lineTo(pos.x, pos.y);
            this._ctx.stroke();

            this._lastPos = pos;
        },

        /**
         *on brush move
         */
        _onBrushEnd: function () {
            if (this._oIntelliEditState.isDrawing) {
                this._oIntelliEditState.isDrawing = false;

                if (this._oIntelliEditState.undoStack && 
                    this._oIntelliEditState.undoStack.length > 0) {
                    var lastState = this._oIntelliEditState.undoStack[
                        this._oIntelliEditState.undoStack.length - 1
                    ];
                    this._ctx.putImageData(lastState, 0, 0);
                }

                this._currentBrushStrokes.forEach(function(stroke) {
                    this._ctx.strokeStyle = stroke.color;
                    this._ctx.lineWidth = stroke.lineWidth;
                    this._ctx.lineCap = "round";
                    this._ctx.lineJoin = "round";

                    this._ctx.beginPath();
                    this._ctx.moveTo(stroke.from.x, stroke.from.y);
                    this._ctx.lineTo(stroke.to.x, stroke.to.y);
                    this._ctx.stroke();
                }.bind(this));
                this._saveState();
                this._renderAllMarkups();                
                this._currentBrushStrokes = [];
            }
        },

        /**
         * Text tool click handler
         */
        _onTextClick: function (oEvent) {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            this._currentTextPosition = this._getCanvasCoordinates(oEvent);

            if (!this._oTextDialog) {
                this._oTextInput = new sap.m.Input({
                    placeholder: oI18n.getText("asint.intelli.textTool.input.placeholder.text")
                });

                this._oTextDialog = new sap.m.Dialog({
                    title: oI18n.getText("asint.intelli.textTool.dialog.title.text"),
                    content: [this._oTextInput],
                    beginButton: new sap.m.Button({
                        text: oI18n.getText("asint.intelli.textTool.dialog.button.ok.text"),
                        /**
                         * 
                         */
                        press: function () {
                            var sText = that._oTextInput.getValue();
                            if (sText) {
                                if (that._oIntelliEditState.undoStack && that._oIntelliEditState.undoStack.length > 0) {
                                    var lastState = that._oIntelliEditState.undoStack[that._oIntelliEditState.undoStack.length - 1];
                                    that._ctx.putImageData(lastState, 0, 0);
                                }                                
                                var pos = that._currentTextPosition;
                                var fontSize = that._oIntelliEditState.size * 2;
                                that._ctx.font = fontSize + "px Arial";
                                that._ctx.fillStyle = that._oIntelliEditState.color;
                                that._ctx.fillText(sText, pos.x, pos.y);
                                that._saveState();
                                that._renderAllMarkups();
                            }
                            that._oTextDialog.close();
                            that._oTextInput.setValue("");
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: oI18n.getText("asint.intelli.textTool.dialog.button.cancel.text"),
                        /**
                         * 
                         */
                        press: function () {
                            that._oTextDialog.close();
                        }
                    })
                });

                // this.getView().addDependent(this._oTextDialog);
            }

            this._oTextDialog.open();
        },
        
        /**
         * Get mouse coordinates relative to canvas
         */
        _getCanvasCoordinates: function (oEvent) {
            var rect = this._canvas.getBoundingClientRect();
            var scaleX = this._canvas.width / rect.width;
            var scaleY = this._canvas.height / rect.height;
            
            return {
                x: (oEvent.clientX - rect.left) * scaleX,
                y: (oEvent.clientY - rect.top) * scaleY
            };
        },

        /**
         * Brush size change handler
         */
        onBrushSizeChange: function (oEvent) {
            var newSize = oEvent.getParameter("value");
            this._oIntelliEditState.size = newSize;
        },

        /**
         * Color picker handler
         */
        onOpenColorPicker: function (oEvent) {
            var that = this;
            
            if (!this._oColorPickerPopover) {
                this._oColorPickerPopover = new sap.m.Popover({
                    placement: sap.m.PlacementType.Bottom,
                    showHeader: false,
                    contentWidth: "230px",
                    verticalScrolling: false,
                    horizontalScrolling: false,
                    content: [
                        new sap.ui.layout.Grid({
                            defaultSpan: "L3 M3 S3",
                            hSpacing: 0.5,
                            vSpacing: 0.5,
                            content: [
                                "#F44336", // red
                                "#E91E63", // pink
                                "#9C27B0", // purple
                                "#673AB7", // deepPurple
                                "#3F51B5", // indigo
                                "#2196F3", // blue
                                "#03A9F4", // lightBlue
                                "#00BCD4", // cyan
                                "#009688", // teal
                                "#4CAF50", // green
                                "#8BC34A", // lightGreen
                                "#CDDC39", // lime
                                "#FFEB3B", // yellow
                                "#FFC107", // amber
                                "#FF9800", // orange
                                "#FF5722", // deepOrange
                                "#795548", // brown
                                "#9E9E9E", // grey
                                "#607D8B", // blueGrey
                                "#000000"  // black
                            ].map(function (color) {
                                return that._createColorButton(color);
                            })
                        })
                    ]
                });
            }
            
            this._oColorPickerPopover.openBy(oEvent.getSource());
        },

        /**
         * Create color button
         */
        _createColorButton: function (sColor) {
            var that = this;
            
            var oBtn = new sap.m.Button({
                /**
                 * 
                 */
                press: function () {
                    that._oIntelliEditState.color = sColor;
                    that._oColorPickerPopover.close();
                    
                    var oColorBtn = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idColorPickerBtn");
                    if (oColorBtn) {
                        oColorBtn.addEventDelegate({
                            /**
                             * 
                             */
                            onAfterRendering: function () {
                                oColorBtn.$().find(".sapMBtnIcon").css({
                                    "color": sColor,
                                    "font-size": "1.5rem"
                                });
                            }
                        }, oColorBtn);
                        oColorBtn.invalidate(); 
                    }
                }
            });
            
            oBtn.addEventDelegate({
                /**
                 * 
                 */
                onAfterRendering: function () {
                    oBtn.$().find(".sapMBtnInner").css({
                        "background-color": sColor,
                        "width": "32px",
                        "height": "32px",
                        "border-radius": "50%",
                        "border": "2px solid #ddd"
                    });
                }
            });
            
            return oBtn;
        },

        /**
         * Zoom handlers- onzoomin
         */
        onZoomIn: function () {
            this._oIntelliEditState.zoomLevel = Math.min(5.0, this._oIntelliEditState.zoomLevel + 0.25);
            this._applyZoom();
        },

        /**
         * Zoom handlers - onzoomout
         */
        onZoomOut: function () {
            this._oIntelliEditState.zoomLevel = Math.max(0.25, this._oIntelliEditState.zoomLevel - 0.25);
            this._applyZoom();
        },

        /**
         * Zoom handlers -applies zoom
         */
        _applyZoom: function () {
            if (!this._canvas) return;

            var oCanvas = this._canvas;
            var fZoom   = this._oIntelliEditState.zoomLevel;

            oCanvas.style.transform       = "";
            oCanvas.style.transformOrigin = "";
            oCanvas.style.maxWidth        = "";
            oCanvas.style.height          = "";

            var scaledW = Math.round(this._canvasBaseWidth  * fZoom);
            var scaledH = Math.round(this._canvasBaseHeight * fZoom);

            oCanvas.style.width  = scaledW + "px";
            oCanvas.style.height = scaledH + "px";

            var oScrollEl = oCanvas.closest(".intelliEditCanvasWrapper, .intelliViewCanvasWrapper");
            var oVBoxEl   = oCanvas.closest(".imageContainer");

            if (oScrollEl && oVBoxEl) {
                if (scaledW > oScrollEl.clientWidth) {
                    oVBoxEl.style.alignItems     = "flex-start";
                    oVBoxEl.style.justifyContent = "flex-start";
                } else {
                    oVBoxEl.style.alignItems     = "";
                    oVBoxEl.style.justifyContent = "";
                }
            }
        },

        /**
         * Initialize finding markup state
         */
        _initializeFindingMarkupState: function() {
            this._findingMarkups = [];
            this._activeMarkup = null;
            this._isDraggingMarkup = false;
            this._isDraggingPointer = false;
            this._dragOffset = { x: 0, y: 0 };
        },

        /**
         * Attach Finding button handler
         */
        onAttachFinding: function() {
            var that = this;

            if (that._oIntelliEditState && that._oIntelliEditState.activeTool) {
                that._setActiveTool(null);
            }
            /**
             * 
             */
            var fnOpenDialog = function() {
                var oModel = that._findingSelectionDialog.getModel("findingsModel");

                if (oModel) {
                    oModel.setProperty("/findings", that._currentSessionFindingsCache);
                    oModel.setProperty("/selectedFinding", null);
                    oModel.setProperty("/isEmbedded", false);
                    oModel.setProperty("/addPointer", false);
                } else {
                    oModel = new JSONModel({
                        findings: that._currentSessionFindingsCache,
                        selectedFinding: null,
                        isEmbedded: false,
                        addPointer: false
                    });
                    that._findingSelectionDialog.setModel(oModel, "findingsModel");
                }

                var oEmbeddedCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idEmbeddedCheckbox");
                if (oEmbeddedCheckbox) {
                    oEmbeddedCheckbox.setSelected(false);
                }

                var oAddPointerCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idAddPointerCheckbox");
                if (oAddPointerCheckbox) {
                    oAddPointerCheckbox.setSelected(false);
                }
                that._clearFindingSelection();
                that._findingSelectionDialog.open();
            };

            /**
             * 
             */
            var fnEnsureDialogAndOpen = function() {
                if (!that._findingSelectionDialog) {
                    Fragment.load({
                        id: "idAttachFindingDialog",
                        name: "com.asint.ais.library.fragment.AttachFinding",
                        controller: that
                    }).then(function(oDialog) {
                        that._findingSelectionDialog = oDialog;
                        that._findingSelectionDialog.setModel(that._i18n, "i18n");
                        fnOpenDialog();
                    });
                } else {
                    fnOpenDialog();
                }
            };

            if (that._currentSessionFindingsCache) {
                fnEnsureDialogAndOpen();
            } else {
                that._loadFindingsData(function(aFindings) {
                    that._currentSessionFindingsCache = aFindings;
                    fnEnsureDialogAndOpen();
                });
            }
        },

        /**
         * Clear finding list selection
         */
        _clearFindingSelection: function() {
            var oList = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idFindingsList");
            if (oList) {
                oList.removeSelections(true);
            }
        },

        /**
         * Load findings from API
         */
        _loadFindingsData: function (fnCallback) {
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            this.assetInspectionDataSource.getFindingsAttachedToInspection(this._inspID, function (oResponse) {
                var aFindings = (oResponse && oResponse.to_finding) || [];
                var aMappedFindings = aFindings.map(function (oFinding) {
                    return {
                        id: oFinding.ID,
                        displayId: oFinding.displayId,
                        description: oFinding.findingName,
                        markupReference: String(oFinding.markUpValue)
                    };
                });
                fnCallback(aMappedFindings);
            },
            //eslint-disable-next-line no-unused-vars
            function (oError) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.failedToLoadFindings.text"));
                fnCallback([]);
            }
            );
        },

        /**
         * Search findings handler
         */
        onSearchFindings: function (oEvent) {
            var sQuery = oEvent.getParameter("query");

            var oList = sap.ui.core.Fragment.byId(
                "idAttachFindingDialog",
                "idFindingsList"
            );

            if (!oList) {
                return;
            }

            var oBinding = oList.getBinding("items");
            if (!oBinding) {
                return;
            }

            var aFilters = [];

            if (sQuery) {
                aFilters.push(
                    new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("displayId", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, sQuery),
                            new sap.ui.model.Filter("markupReference", sap.ui.model.FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    })
                );
            }

            oBinding.filter(aFilters);
        },

        /**
         * Embedded checkbox change handler
         */
        onEmbeddedChange: function(oEvent) {
            const isSelected = oEvent.getParameter("selected");
            const model = this._findingSelectionDialog.getModel("findingsModel");
            model.setProperty("/isEmbedded", isSelected);
        },

        /**
         * Add pointer checkbox change handler
         */
        onAddPointerChange: function(oEvent) {
            const isSelected = oEvent.getParameter("selected");
            const model = this._findingSelectionDialog.getModel("findingsModel");
            model.setProperty("/addPointer", isSelected);
        },

        /**
         * Finding selection handler
         */
        onFindingSelect: function(oEvent) {
            const selectedItem = oEvent.getParameter("listItem");
            const bindingContext = selectedItem.getBindingContext("findingsModel");
            const selectedFinding = bindingContext.getObject();
            
            const model = this._findingSelectionDialog.getModel("findingsModel");
            model.setProperty("/selectedFinding", selectedFinding);
        },

        /**
         * Continue with finding selection
         */
        onContinueFindingSelection: function() {
            var that = this;
            const model = this._findingSelectionDialog.getModel("findingsModel");
            const selectedFinding = model.getProperty("/selectedFinding");
            const isEmbedded = model.getProperty("/isEmbedded");
            const addPointer = model.getProperty("/addPointer");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            if (!selectedFinding) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectFinding.text"));
                return;
            }

            // Create markup on canvas
            that._createFindingMarkup(selectedFinding, isEmbedded, addPointer);
            
            // Reset checkboxes before closing
            var oEmbeddedCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idEmbeddedCheckbox");
            var oPointerCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idAddPointerCheckbox");
            if (oEmbeddedCheckbox) oEmbeddedCheckbox.setSelected(false);
            if (oPointerCheckbox) oPointerCheckbox.setSelected(false);
            
            this._clearFindingSelection();
            this._findingSelectionDialog.close();
        },

        /**
         * Cancel finding selection
         */
        onCancelFindingSelection: function() {
            var oEmbeddedCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idEmbeddedCheckbox");
            var oPointerCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idAddPointerCheckbox");
            if (oEmbeddedCheckbox) oEmbeddedCheckbox.setSelected(false);
            if (oPointerCheckbox) oPointerCheckbox.setSelected(false);
            this._clearFindingSelection();
            this._findingSelectionDialog.close();
        },

        // /**
        //  * Create finding markup on canvas
        //  */
        // _createFindingMarkup: function(finding, embedInImage, hasPointer) {
        //     var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
        //     if (!this._canvas) {
        //         sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.canvasNotInitialized.text"));
        //         return;
        //     }

        //     var canvasWidth = this._canvas.width;
        //     var canvasHeight = this._canvas.height;

        //     var iSize = 30;
        //     var maxXRel = Math.max(0, (canvasWidth  - 2 * iSize) / canvasWidth);
        //     var maxYRel = Math.max(0, (canvasHeight - 2 * iSize) / canvasHeight);
        //     var initX = Math.max(0, Math.min(maxXRel, 0.5 - iSize / canvasWidth));
        //     var initY = Math.max(0, Math.min(maxYRel, 0.3 - iSize / canvasHeight));

        //     var markup = {
        //         // id: this._generateAlphanumericId(),
        //         findingId: finding.id,
        //         displayId: finding.displayId,
        //         markupReference: finding.markupReference,
        //         description: finding.description,

        //         xaxis: initX,
        //         yaxis: initY,

        //         // Visual properties
        //         color: this._oIntelliEditState.color || "#F44336",
        //         shape: 2,
        //         size: iSize,
        //         opacity: 1,
                
        //         embedInImage: embedInImage,
        //         hasPointer: hasPointer,
        //         type: "Finding",
                
        //         pointerX: hasPointer ? 0.5 : null,
        //         pointerY: hasPointer ? 0.5 : null,
                
        //         label: finding.markupReference,
        //         additionalData: JSON.stringify({
        //             createdAt: new Date().toISOString(),
        //             createdBy: this.getLoggedInUserMail()
        //         }),
                
        //         isSaved: false,
        //         isSelected: false
        //     };
            
        //     this._findingMarkups.push(markup);
        //     // this._saveState(); 
        //     this._renderAllMarkups();
        // },

        /**
         * 
         */
        _renderAllMarkups: function () {
            if (!this._canvas || !this._ctx) return;
            
            if (this._oIntelliEditState.undoStack && this._oIntelliEditState.undoStack.length > 0) {
                var lastState = this._oIntelliEditState.undoStack[this._oIntelliEditState.undoStack.length - 1];
                this._ctx.putImageData(lastState, 0, 0);
            } else if (this._originalImage) {
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._ctx.drawImage(this._originalImage, 0, 0, this._canvas.width, this._canvas.height);
            }
            
            this._findingMarkups.forEach(function(markup) {
                this._renderMarkup(markup);
            }.bind(this));
        },

        /**
         * Render single markup (rhombus shape)
         */
        _renderMarkup: function(markup, oCanvas, oCtx) {
            var ctx = oCtx || this._ctx;
            var canvas = oCanvas || this._canvas;
            var canvasWidth  = canvas.width;
            var canvasHeight = canvas.height;

            var refWidth = (this._originalImage && this._originalImage.naturalWidth) ? this._originalImage.naturalWidth : canvas.width;
            var size = (markup.size * refWidth / 200);
            var x = markup.xaxis * canvasWidth  + size;
            var y = markup.yaxis * canvasHeight + size;
            
            if (markup.hasPointer && markup.pointerX !== null && markup.pointerY !== null) {
                var pointerX = markup.pointerX * canvasWidth;
                var pointerY = markup.pointerY * canvasHeight;
                
                ctx.save();
                ctx.strokeStyle = markup.color;
                // ctx.lineWidth = 4 / (this._oIntelliEditState.zoomLevel || 1);
                ctx.lineWidth = 4;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(pointerX, pointerY);
                ctx.stroke();

                // var headLength = 12 / (this._oIntelliEditState.zoomLevel || 1);
                var headLength = 12;
                var angle = Math.atan2(pointerY - y, pointerX - x);

                ctx.beginPath();
                ctx.moveTo(pointerX, pointerY);
                ctx.lineTo(
                    pointerX - headLength * Math.cos(angle - Math.PI / 6),
                    pointerY - headLength * Math.sin(angle - Math.PI / 6)
                );
                ctx.moveTo(pointerX, pointerY);
                ctx.lineTo(
                    pointerX - headLength * Math.cos(angle + Math.PI / 6),
                    pointerY - headLength * Math.sin(angle + Math.PI / 6)
                );
                ctx.stroke();

                ctx.restore();
            }
            
            ctx.save();
            ctx.fillStyle = markup.color;
            ctx.globalAlpha = markup.opacity;
            
            ctx.beginPath();
            ctx.moveTo(x, y - size); // Top
            ctx.lineTo(x + size, y); // Right
            ctx.lineTo(x, y + size); // Bottom
            ctx.lineTo(x - size, y); // Left
            ctx.closePath();
            ctx.fill();
            
            if (markup.isSelected) {
                ctx.strokeStyle = "#0000FF";
                ctx.lineWidth = 3;
                ctx.stroke();
            } else {
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#FFFFFF";
            // var fontSize = 26 / (this._oIntelliEditState.zoomLevel || 1);
            var fontSize = size*0.75;
            ctx.font = "bold " + fontSize + "px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(markup.label, x, y);
            
            ctx.restore();
        },

        /**
         * Enhanced canvas initialization with markup support
         */
        _initializeCanvas: function(sImageSrc, oImageObj) {
            var that = this;

            this._currentImageObj = oImageObj;
            this._initializeFindingMarkupState();

            var oCanvasHostEarly = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idCanvasHost");
            if (oCanvasHostEarly) { oCanvasHostEarly.setContent(""); }

            var img = new Image();
            img.onload = function() {
                var imgWidth = img.naturalWidth;
                var imgHeight = img.naturalHeight;
                
                var maxWidth = window.innerWidth * 0.9;
                var maxHeight = window.innerHeight * 0.7;

                var scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
                var canvasWidth = Math.round(imgWidth * scale);
                var canvasHeight = Math.round(imgHeight * scale);

                var sCanvasHTML = "<canvas id=\"intelliEditCanvas\" " +
                                "width=\"" + imgWidth + "\" " +
                                "height=\"" + imgHeight + "\" " +
                                "style=\"max-width: 100%; height: auto; cursor: crosshair; border: 1px solid #ccc;\">" +
                                "</canvas>";

                var oCanvasHost = sap.ui.core.Fragment.byId("idIntelliEditDialog", "idCanvasHost");
                if (!oCanvasHost) return;

                var minDialogWidth = 980;
                var finalWidth = Math.max(canvasWidth + 60, minDialogWidth);
                that._oIntelliEditDialog.setContentWidth(finalWidth + "px");
                that._oIntelliEditDialog.setContentHeight(Math.min(canvasHeight + 200, maxHeight) + "px");
                that._oIntelliEditDialog.invalidate();

                oCanvasHost.addEventDelegate({
                    /**
                     * 
                     */
                    onAfterRendering: function () {
                        oCanvasHost.removeEventDelegate(this);

                        var canvas = document.getElementById("intelliEditCanvas");
                        if (!canvas) return;

                        that._canvasBaseWidth  = canvasWidth;
                        that._canvasBaseHeight = canvasHeight;
                        that._canvas = canvas;
                        that._ctx = canvas.getContext("2d", { willReadFrequently: true });
                        that._ctx.clearRect(0, 0, imgWidth, imgHeight);
                        that._ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                        that._originalImage = img;

                        if (oImageObj.to_points && oImageObj.to_points.length > 0) {
                            that._loadExistingMarkups(oImageObj.to_points);
                        }

                        that._saveState();
                        that._attachMarkupHandlers();
                        that._renderAllMarkups();
                        that._applyZoom();
                        if (that._oIntelliEditDialog) { that._oIntelliEditDialog.setBusy(false); }
                    }
                });

                oCanvasHost.setContent(sCanvasHTML);
            };

            img.onerror = function() {
                if (that._oIntelliEditDialog) { that._oIntelliEditDialog.setBusy(false); }
                sap.m.MessageToast.show("Failed to load image");
            };

            img.src = sImageSrc;
        },

        /**
         * Load existing markups from to_points data
         */
        _loadExistingMarkups: function(aPoints) {
            var that = this;
            
            if (!aPoints || aPoints.length === 0) {
                return;
            }
            
            aPoints.forEach(function(point) {
                var iSize = point.size || 40;
                var maxXRel = Math.max(0, (that._canvas.width  - 2 * iSize) / that._canvas.width);
                var maxYRel = Math.max(0, (that._canvas.height - 2 * iSize) / that._canvas.height);
                var markup = {
                    xaxis: Math.max(0, Math.min(maxXRel, point.xaxis)),
                    yaxis: Math.max(0, Math.min(maxYRel, point.yaxis)),
                    color: that._numberToColor(point.color),
                    shape: point.shape,
                    embedInImage: point.embedInImage || false,
                    size: point.size || 40,
                    opacity: point.opacity !== undefined ? point.opacity : 1,
                    type: point.type || "Finding",
                    hasPointer: point.hasPointer || false,
                    pointerX: point.pointerX || null,
                    pointerY: point.pointerY || null,
                    label: point.label ? point.label.toString() : "1",
                    findingId: point.finding_ID || null,
                    additionalData: point.additionalData || "{}",
                    isSelected: false,
                    isSaved: true
                };
                
                that._findingMarkups.push(markup);
                if (point.finding) {
                    markup.displayId = point.finding.displayId || "";
                    markup.description = point.finding.findingName || point.finding.finding || "";
                    markup.markupReference = point.finding.markUpValue ? point.finding.markUpValue.toString() : (point.label ? point.label.toString() : "");

                    markup.findingDataLoaded = true;
                }
            });
            
        },  

        /**
         * Attach markup interaction handlers
         */
        _attachMarkupHandlers: function() {
            var that = this;
            
            this._canvas.addEventListener("mousedown", this._markupMouseDown = function(e) {
                that._onMarkupMouseDown(e);
            });
            
            this._canvas.addEventListener("mousemove", this._markupMouseMove = function(e) {
                that._onMarkupMouseMove(e);
            });
            
            this._canvas.addEventListener("mouseup", this._markupMouseUp = function(e) {
                that._onMarkupMouseUp(e);
            });
            
            this._canvas.addEventListener("dblclick", this._markupDblClick = function(e) {
                that._onMarkupDblClick(e);
            });
        },

        /**
         * Mouse down handler for markup interaction
         */
        _onMarkupMouseDown: function(e) {
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            if (this._oIntelliEditState.activeTool === "TEXT" || this._oIntelliEditState.activeTool === "BRUSH") {
                return;
            }
            var pos = this._getCanvasCoordinates(e);
            var relX = pos.x / this._canvas.width;
            var relY = pos.y / this._canvas.height;
            
            var clickedMarkup = this._findMarkupAtPosition(relX, relY);
            var clickedPointer = null;
            
            if (!clickedMarkup) {
                clickedPointer = this._findPointerAtPosition(relX, relY);
            }
            
            if (clickedMarkup) {
                if (clickedMarkup.embedInImage && clickedMarkup.isSaved) {
                    setTimeout(function(){
                        sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.embeddedMarkupCannotMove.text"), {
                            duration: 2000
                        });
                    },0);
                    return;
                }
                
                this._activeMarkup = clickedMarkup;
                
                this._findingMarkups.forEach(function(m) {
                    m.isSelected = false;
                });
                clickedMarkup.isSelected = true;
                
                this._isDraggingMarkup = true;
                this._isDraggingPointer = false;
                this._dragOffset = {
                    x: relX - clickedMarkup.xaxis,
                    y: relY - clickedMarkup.yaxis
                };
              
                
                this._renderAllMarkups();
                
            } else if (clickedPointer) {
                if (clickedPointer.embedInImage && clickedPointer.isSaved) {
                    return;
                }
                this._activeMarkup = clickedPointer;
                this._isDraggingPointer = true;
                this._isDraggingMarkup = false;
                this._dragOffset = {
                    x: relX - clickedPointer.pointerX,
                    y: relY - clickedPointer.pointerY
                };
                
                this._renderAllMarkups();                
            } else {
                this._findingMarkups.forEach(function(m) {
                    m.isSelected = false;
                });
                this._activeMarkup = null;
                this._isDraggingMarkup = false;
                this._isDraggingPointer = false;
                this._renderAllMarkups();
            }
        },

        /**
         * Mouse move handler
         */
        _onMarkupMouseMove: function(e) {
            if (!this._activeMarkup) return;
            
            var pos = this._getCanvasCoordinates(e);
            var relX = pos.x / this._canvas.width;
            var relY = pos.y / this._canvas.height;
            
            if (this._isDraggingMarkup) {
                var refWidth = (this._originalImage && this._originalImage.naturalWidth) ? this._originalImage.naturalWidth : this._canvas.width;
                var size = (this._activeMarkup.size * refWidth / 200);
                var maxXRel = Math.max(0, (this._canvas.width  - 2 * size) / this._canvas.width);
                var maxYRel = Math.max(0, (this._canvas.height - 2 * size) / this._canvas.height);
                this._activeMarkup.xaxis = Math.max(0, Math.min(maxXRel, relX - this._dragOffset.x));
                this._activeMarkup.yaxis = Math.max(0, Math.min(maxYRel, relY - this._dragOffset.y));
                this._renderAllMarkups();
                this._renderAllMarkups();
            } else if (this._isDraggingPointer) {
                this._activeMarkup.pointerX = Math.max(0, Math.min(1, relX - this._dragOffset.x));
                this._activeMarkup.pointerY = Math.max(0, Math.min(1, relY - this._dragOffset.y));
                this._renderAllMarkups();
            }
        },

        /**
         * 
         */
        _onMarkupMouseUp: function() {
            this._isDraggingMarkup = false;
            this._isDraggingPointer = false;
        },

        /**
         * Double click handler - opens markup configuration dialog
         */
        _onMarkupDblClick: function(e) {
            var pos = this._getCanvasCoordinates(e);
            var relX = pos.x / this._canvas.width;
            var relY = pos.y / this._canvas.height;
            
            var clickedMarkup = this._findMarkupAtPosition(relX, relY);
            
            if (clickedMarkup) {
                this._openMarkupConfigDialog(clickedMarkup);
            }
        },

        /**
         * Find markup at position
         */
        _findMarkupAtPosition: function(relX, relY) {
            var canvasWidth = this._canvas.width;
            var canvasHeight = this._canvas.height;
            
            for (var i = this._findingMarkups.length - 1; i >= 0; i--) {
                var markup = this._findingMarkups[i];
                var refWidth = (this._originalImage && this._originalImage.naturalWidth) ? this._originalImage.naturalWidth : this._canvas.width;
                var size = (markup.size * refWidth / 200);
                var cx = markup.xaxis * canvasWidth  + size;
                var cy = markup.yaxis * canvasHeight + size;
                
                var absX = relX * canvasWidth;
                var absY = relY * canvasHeight;
                
                if (this._isPointInRhombus(absX, absY, cx, cy, size)) {
                    return markup;
                }
            }
            
            return null;
        },

        /**
         * Find pointer endpoint at position
         */
        _findPointerAtPosition: function(relX, relY) {
            var canvasWidth = this._canvas.width;
            var canvasHeight = this._canvas.height;
            
            for (var i = this._findingMarkups.length - 1; i >= 0; i--) {
                var markup = this._findingMarkups[i];
                
                if (!markup.hasPointer || markup.pointerX === null) continue;
                
                var pointerX = markup.pointerX * canvasWidth;
                var pointerY = markup.pointerY * canvasHeight;
                
                var absX = relX * canvasWidth;
                var absY = relY * canvasHeight;
                
                var distance = Math.sqrt(
                    Math.pow(absX - pointerX, 2) + 
                    Math.pow(absY - pointerY, 2)
                );
                
                if (distance <= 8) { 
                    return markup;
                }
            }
            
            return null;
        },

        /**
         * Check if point is inside rhombus
         */
        _isPointInRhombus: function(px, py, cx, cy, size) {
            var top = { x: cx, y: cy - size };
            var right = { x: cx + size, y: cy };
            var bottom = { x: cx, y: cy + size };
            var left = { x: cx - size, y: cy };
            /**
             * 
             */
            var sign = function(p1, p2, p3) {
                return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
            };
            
            var pt = { x: px, y: py };
            
            var d1 = sign(pt, top, right);
            var d2 = sign(pt, right, bottom);
            var d3 = sign(pt, bottom, left);
            var d4 = sign(pt, left, top);
            
            var hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0) || (d4 < 0);
            var hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0) || (d4 > 0);
            
            return !(hasNeg && hasPos);
        },

        /**
         * Open markup configuration dialog
         */
        _openMarkupConfigDialog: function(markup) {
            var that = this;
            
            this._currentEditingMarkup = markup;
            
            // if (markup.isSaved && markup.findingId && !markup.description) {
            if (markup.isSaved && markup.findingId && !markup.findingDataLoaded) {
                this._fetchAndPopulateFindingData(markup, function() {
                    that._showMarkupConfigDialog(markup);
                });
            } else {
                this._showMarkupConfigDialog(markup);
            }
        },

        /**
         * Fetch finding data from API and populate markup
         */
        _fetchAndPopulateFindingData: function(markup, callback) {
            var that = this;
            
            if (this._busyDialog) {
                this._busyDialog.open();
            }
            
            this._loadFindingsData(function(aFindings) {
                if (that._busyDialog) {
                    that._busyDialog.close();
                }
                
                var oFinding = aFindings.find(function(f) {
                    return f.id === markup.findingId;
                });
                
                if (oFinding) {
                    markup.displayId = oFinding.displayId;
                    markup.description = oFinding.description;
                    markup.markupReference = oFinding.markupReference;
                    markup.inspectionId = that._inspID;
                    
                } else {
                    markup.displayId = "N/A";
                    markup.description = "Finding not found";
                    markup.markupReference = markup.label || "N/A";
                    markup.inspectionId = that._inspID;
                }
                
                callback();
            });
        },

        /**
         * Navigate to inspection detail from Finding ID link in markup config
         */
        onClickFindingIdFromMarkup: function(oEvent) {
            var sFindingId;

            if (oEvent && oEvent.getSource) {
                var oContext = oEvent.getSource().getBindingContext("findingsModel");
                if (oContext) {
                    sFindingId = oContext.getProperty("id");
                }
            }

            if (!sFindingId && this._currentEditingMarkup) {
                sFindingId = this._currentEditingMarkup.findingId;
            }

            if (!sFindingId) { return; }

            var sHashWithKeyword = this.NAVIGATION.INSPECTION_FINDINGS_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{findingId}", sFindingId);
            var sNewUrl = this.setNavUrl(window, sHashWithKeyword);
            window.open(sNewUrl, "_blank");
        },

        /**
         * Show the markup configuration dialog
         */
        _showMarkupConfigDialog: function(markup) {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            if (!this._markupConfigDialog) {
                var aColors = [
                    "#F44336", // red
                    "#4CAF50", // green
                    "#2196F3", // blue
                    "#FFEB3B", // yellow
                    "#9C27B0", // purple
                    "#FFFFFF", // white
                    "#000000", // black
                    "#FF9800", // orange
                    "#009688", // teal
                    "#E91E63", // pink
                    "#795548", // brown
                    "#00BCD4", // cyan
                    "#3F51B5", // indigo
                    "#CDDC39"  // lime
                ];

                var aColorButtons = aColors.map(function(color) {
                    return that._createMarkupColorButton(color);
                });
                var aColorButtonsRow1 = aColorButtons.slice(0, 7);
                var aColorButtonsRow2 = aColorButtons.slice(7);

                this._markupConfigDialog = new sap.m.Dialog({
                    title: oI18n.getText("asint.intelli.markupConfig.dialog.title.text"),
                    draggable: true,
                    contentWidth: "320px",
                    content: [
                        new sap.m.VBox({
                            items: [
                                // Embedded info banner
                                // new sap.m.MessageStrip({
                                //     id: "embeddedMarkupMessage",
                                //     text: "This markup is embedded and cannot be edited.",
                                //     type: "Information",
                                //     showIcon: true,
                                //     visible: false
                                // }).addStyleClass("sapUiSmallMarginBottom"),

                                new sap.m.VBox({
                                    items: [
                                        new sap.m.Label({ text: oI18n.getText("asint.intelli.markupConfig.label.findingId.text") }),
                                        new sap.m.Link({ 
                                            id: "linkFindingId", 
                                            text: "",
                                            press: that.onClickFindingIdFromMarkup.bind(that)
                                        }).addStyleClass("sapUiTinyMarginBottom"),

                                        new sap.m.Label({ text: oI18n.getText("asint.intelli.markupConfig.label.description.text") }),
                                        new sap.m.Text({ id: "txtDescription", text: "" }).addStyleClass("sapUiTinyMarginBottom"),

                                        new sap.m.Label({ text: oI18n.getText("asint.intelli.markupConfig.label.markupReference.text") }),
                                        new sap.m.Text({ id: "txtMarkupRef", text: "" })
                                    ]
                                }).addStyleClass("sapUiSmallMarginBottom"),

                                new sap.m.VBox({
                                    id: "colorSection",
                                    items: [
                                        new sap.m.Label({ 
                                            text: oI18n.getText("asint.intelli.markupConfig.label.findingColor.text")
                                        }).addStyleClass("sapUiTinyMarginBottom"),
                                        new sap.m.VBox({
                                            items: [
                                                new sap.ui.layout.HorizontalLayout({
                                                    content: aColorButtonsRow1
                                                }).addStyleClass("sapUiTinyMarginBottom"),
                                                new sap.ui.layout.HorizontalLayout({
                                                    content: aColorButtonsRow2
                                                })
                                            ]
                                        })
                                    ]
                                }).addStyleClass("sapUiSmallMarginBottom"),

                                new sap.m.VBox({
                                    id: "opacitySection",
                                    items: [
                                        new sap.m.Label({ 
                                            text: oI18n.getText("asint.intelli.markupConfig.label.opacity.text")
                                        }).addStyleClass("sapUiTinyMarginBottom"),
                                        new sap.m.HBox({
                                            alignItems: "Center",
                                            items: [
                                                new sap.m.Slider({
                                                    id: "sliderOpacity",
                                                    width: "240px",
                                                    min: 0,
                                                    max: 100,
                                                    value: 100,
                                                    step: 1,
                                                    enableTickmarks: false,
                                                    inputsAsTooltips: true,
                                                    /**
                                                     * 
                                                     */
                                                    liveChange: function(e) {
                                                        if (!that._currentEditingMarkup) return;
                                                        var opacityPercent = e.getParameter("value");
                                                        that._currentEditingMarkup.opacity = opacityPercent / 100;
                                                        sap.ui.getCore().byId("txtOpacityValue").setText(opacityPercent + "%");
                                                        that._isInPDFMode ? that._pdfRenderAllMarkups() : that._renderAllMarkups();
                                                    }
                                                }),
                                                new sap.m.Text({
                                                    id: "txtOpacityValue",
                                                    text: "100%",
                                                    width: "45px",
                                                    textAlign: "End"
                                                })
                                            ]
                                        })
                                    ]
                                }).addStyleClass("sapUiSmallMarginBottom"),

                                new sap.m.VBox({
                                    id: "sizeSection",
                                    items: [
                                        new sap.m.Label({
                                            text: "Markup Size:"
                                        }).addStyleClass("sapUiTinyMarginBottom"),
                                        new sap.m.HBox({
                                            alignItems: "Center",
                                            items: [
                                                new sap.m.Slider({
                                                    id: "sliderMarkupSize",
                                                    width: "240px",
                                                    min: 5,
                                                    max: 100,
                                                    value: 5,
                                                    step: 1,
                                                    enableTickmarks: false,
                                                    inputsAsTooltips: true,
                                                    /**
                                                     * 
                                                     */
                                                    liveChange: function(e) {
                                                        if (!that._currentEditingMarkup) return;
                                                        var iSize = e.getParameter("value");
                                                        that._currentEditingMarkup.size = iSize;
                                                        // sap.ui.getCore().byId("txtMarkupSizeValue").setText(iSize);
                                                        that._isInPDFMode ? that._pdfRenderAllMarkups() : that._renderAllMarkups();
                                                    }
                                                }),
                                            ]
                                        })
                                    ]
                                }).addStyleClass("sapUiSmallMarginBottom"),

                                new sap.m.HBox({
                                    id: "checkboxSection",
                                    items: [
                                        new sap.m.CheckBox({
                                            id: "cbEmbedConfig",
                                            text: oI18n.getText("asint.intelli.markupConfig.checkbox.embedInImage.text"),
                                            /**
                                             *  
                                             */
                                            select: function(e) {
                                                if (that._currentEditingMarkup) {
                                                    var isSelected = e.getParameter("selected");
                                                    if (that._currentEditingMarkup.isSaved) {
                                                        that._currentEditingMarkup.pendingEmbedInImage = isSelected;
                                                    } else {
                                                        that._currentEditingMarkup.embedInImage = isSelected;
                                                    }
                                                }
                                            }
                                        }).addStyleClass("sapUiTinyMarginEnd"),

                                        new sap.m.CheckBox({
                                            id: "cbPointerConfig",
                                            text: oI18n.getText("asint.intelli.markupConfig.checkbox.showPointer.text"),
                                            /**
                                             * 
                                             */
                                            select: function(e) {
                                                if (!that._currentEditingMarkup) return;

                                                var hasPointer = e.getParameter("selected");
                                                that._currentEditingMarkup.hasPointer = hasPointer;

                                                if (hasPointer && that._currentEditingMarkup.pointerX === null) {
                                                    that._currentEditingMarkup.pointerX = that._currentEditingMarkup.xaxis + 0.1;
                                                    that._currentEditingMarkup.pointerY = that._currentEditingMarkup.yaxis + 0.1;
                                                } else if (!hasPointer) {
                                                    that._currentEditingMarkup.pointerX = null;
                                                    that._currentEditingMarkup.pointerY = null;
                                                }

                                                that._isInPDFMode ? that._pdfRenderAllMarkups() : that._renderAllMarkups();
                                            }
                                        })
                                    ]
                                })
                            ]
                        }).addStyleClass("sapUiSmallMargin")
                    ],
                    beginButton: new sap.m.Button({
                        id: "btnDeleteMarkup",
                        text: oI18n.getText("asint.intelli.markupConfig.button.delete.text"),
                        type: sap.m.ButtonType.Reject,
                        /**
                         * 
                         */
                        press: function() {
                            if (that._currentEditingMarkup) {
                                // that._deleteMarkup(that._currentEditingMarkup);
                                if (that._isInPDFMode) {
                                    that._deletePDFMarkup(that._currentEditingMarkup);
                                } else {
                                    that._deleteMarkup(that._currentEditingMarkup);
                                }
                                that._markupConfigDialog.close();
                            }
                        }
                    }),
                    endButton: new sap.m.Button({
                        id: "btnEndMarkup",
                        text: oI18n.getText("asint.intelli.markupConfig.button.close.text"),
                        type: sap.m.ButtonType.Emphasized,
                        /**
                         * 
                         */
                        press: function() {
                            that._markupConfigDialog.close();
                            that._isInPDFMode ? that._pdfRenderAllMarkups() : that._renderAllMarkups();
                        }
                    })
                });
            }

            var isViewMode = this._isViewMode === true;

            sap.ui.getCore().byId("linkFindingId").setText(markup.displayId);
            sap.ui.getCore().byId("txtDescription").setText(markup.description);
            sap.ui.getCore().byId("txtMarkupRef").setText(markup.markupReference);

            if (isViewMode) {
                sap.ui.getCore().byId("colorSection").setVisible(false);
                sap.ui.getCore().byId("opacitySection").setVisible(false);
                sap.ui.getCore().byId("sizeSection").setVisible(false);
                sap.ui.getCore().byId("checkboxSection").setVisible(false);
                sap.ui.getCore().byId("btnDeleteMarkup").setVisible(false);
                sap.ui.getCore().byId("btnEndMarkup").setText(oI18n.getText("asint.intelli.markupConfig.button.close.text"));
            } else {
                var isEmbeddedAndSaved = markup.isSaved && markup.embedInImage;
                
                sap.ui.getCore().byId("colorSection").setVisible(!isEmbeddedAndSaved);
                sap.ui.getCore().byId("opacitySection").setVisible(!isEmbeddedAndSaved);
                sap.ui.getCore().byId("sizeSection").setVisible(!isEmbeddedAndSaved);
                sap.ui.getCore().byId("checkboxSection").setVisible(true);
                // eslint-disable-next-line no-prototype-builtins
                var embeddedDisplayValue = (markup.isSaved && markup.hasOwnProperty("pendingEmbedInImage"))? markup.pendingEmbedInImage: markup.embedInImage;
                sap.ui.getCore().byId("cbEmbedConfig").setSelected(embeddedDisplayValue);
                sap.ui.getCore().byId("cbPointerConfig").setSelected(markup.hasPointer);
                sap.ui.getCore().byId("cbEmbedConfig").setEnabled(!isEmbeddedAndSaved);
                sap.ui.getCore().byId("cbPointerConfig").setEnabled(!isEmbeddedAndSaved);

                sap.ui.getCore().byId("btnDeleteMarkup").setVisible(!isEmbeddedAndSaved);
                if (isEmbeddedAndSaved) {
                    sap.ui.getCore().byId("btnDeleteMarkup").setVisible(false);
                    sap.ui.getCore().byId("btnEndMarkup").setText(oI18n.getText("asint.intelli.markupConfig.button.close.text"));
                } else {
                    sap.ui.getCore().byId("btnDeleteMarkup").setVisible(true);
                    sap.ui.getCore().byId("btnEndMarkup").setText(oI18n.getText("asint.intelli.markupConfig.button.ok.text"));
                }

                if (!isEmbeddedAndSaved) {
                    var opacityPercent = Math.round((markup.opacity || 1) * 100);
                    sap.ui.getCore().byId("sliderOpacity").setValue(opacityPercent);
                    sap.ui.getCore().byId("txtOpacityValue").setText(opacityPercent + "%");
                    var iSize = markup.size || 5;
                    sap.ui.getCore().byId("sliderMarkupSize").setValue(iSize);
                    // sap.ui.getCore().byId("txtMarkupSizeValue").setText(iSize);
                    this._highlightCurrentColorButton(markup.color);
                }
            }

            this._markupConfigDialog.open();
        },

        /**
         * Create color button for markup configuration dialog
         * @param {String} sColor - The color hex code
         * @returns {sap.m.Button} - The color button
         */
        _createMarkupColorButton: function(sColor) {
            var that = this;
            
            var oBtn = new sap.m.Button({
                /**
                 * 
                 * @returns 
                 */
                press: function() {
                    if (!that._currentEditingMarkup) return;
                    that._currentEditingMarkup.color = sColor;
                    that._isInPDFMode ? that._pdfRenderAllMarkups() : that._renderAllMarkups();
                    that._highlightCurrentColorButton(sColor);
                }
            });
            oBtn.addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginBottom");
            oBtn.addEventDelegate({
                /**
                 * 
                 */
                onAfterRendering: function() {
                    oBtn.$().find(".sapMBtnInner").css({
                        "background-color": sColor,
                        "width": "32px",
                        "height": "32px",
                        "border-radius": "4px",
                        "border": "2px solid #ddd",
                        "min-width": "32px"
                    });
                }
            });
            
            oBtn.data("color", sColor);
            
            return oBtn;
        },

        /**
         * Highlight the currently selected color button
         * @param {String} currentColor - The current color of the markup
         */
        _highlightCurrentColorButton: function(currentColor) {
            var colorContainer = sap.ui.getCore().byId("colorButtonContainer");
            if (!colorContainer) return;
            
            var buttons = colorContainer.getContent();
            buttons.forEach(function(btn) {
                var btnColor = btn.data("color");
                var $btn = btn.$().find(".sapMBtnInner");
                
                if (btnColor === currentColor) {
                    $btn.css({
                        "border": "3px solid #0854A0",
                        "box-shadow": "0 0 5px rgba(8, 84, 160, 0.5)"
                    });
                } else {
                    $btn.css({
                        "border": "2px solid #ddd",
                        "box-shadow": "none"
                    });
                }
            });
        },

        /**
         * Delete markup
         */
        _deleteMarkup: function(markup) {
            var index = this._findingMarkups.indexOf(markup);
            if (index > -1) {
                this._findingMarkups.splice(index, 1);
                this._renderAllMarkups();
                this._saveState();
                sap.m.MessageToast.show("Markup deleted");
            }
        },

        /**
         * save handler 
         */
        onSaveIntelliEdit: function() {
            var that = this;            
            if (!this._canvas) {
                sap.m.MessageToast.show("No image to save");
                return;
            }

            this._findingMarkups.forEach(function(markup) {
                // eslint-disable-next-line no-prototype-builtins
                if (markup.hasOwnProperty("pendingEmbedInImage")) {
                    markup.embedInImage = markup.pendingEmbedInImage;
                    delete markup.pendingEmbedInImage;
                }
            });

            var canvasWithAllMarkups = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
            this._renderEmbeddedMarkups();
            var editedImageData = this._canvas.toDataURL(this._currentImageObj.type || "image/png");
            var base64Data = editedImageData.split(",")[1];
            this._ctx.putImageData(canvasWithAllMarkups, 0, 0);            
            sap.m.MessageBox.confirm("Save edited image with markups?", {
                /**
                 * 
                 * @param {*} oAction 
                 */
                onClose: function(oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        that._saveImageWithMarkups(base64Data);
                    }
                }
            });
        },

        /**
         * Render only embedded markups (for export)
         * This renders markups that should be permanently baked into the image
         */
        _renderEmbeddedMarkups: function() {
            if (!this._canvas || !this._ctx) return;
            if (this._oIntelliEditState.undoStack && this._oIntelliEditState.undoStack.length > 0) {
                var lastState = this._oIntelliEditState.undoStack[this._oIntelliEditState.undoStack.length - 1];
                this._ctx.putImageData(lastState, 0, 0);
            } else if (this._originalImage) {
                this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._ctx.drawImage(this._originalImage, 0, 0, this._canvas.width, this._canvas.height);
            }            
            this._findingMarkups.forEach(function(markup) {
                if (markup.embedInImage === true) {
                    this._renderMarkup(markup);
                }
            }.bind(this));
        },

        /**
         * 
         * @param {*} categoryText 
         * @returns 
         */
        categoryTextToKey: function(categoryText) {
            var that = this;
            if (!categoryText) return "";
            var category = that.model.getProperty("/data/documents/documentTypeDropdown");
            for (var i = 0; i < category.length; i++) {
                if (category[i].text === categoryText) {
                    return category[i].key;
                }
            }
            return "";
        },

        /**
         * Save image with markups to backend
         */
        _saveImageWithMarkups: function(base64ImageData) {
            var that = this;
            if (this._oIntelliEditDialog) {
                this._oIntelliEditDialog.setBusy(true);
                this._oIntelliEditDialog.setBusyIndicatorDelay(0);
            }
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._findingMarkups.forEach(function(markup) {
                markup.isSaved = true;
            });
            
            var oCurrentDoc = this._currentImageObj;
            var sLoggedInUser = this.getLoggedInUserMail();
            var isOpenTextEnabled = this._featureFlagConfig.openTextEnabled === "1";

            var oObjectInfo = {
                "objectId": that._inspID,
                "objectType": that._app,
                "displayId": "",
                "createdAt": new Date().toISOString().replace("T", " ").replace("Z", ""),
                "createdBy": sLoggedInUser
            };
            
            var byteString = atob(base64ImageData);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], { type: oCurrentDoc.type || "image/jpeg" });
            var fileSize = blob.size;
            var oPayload = {
                originalDocId: oCurrentDoc.docId || oCurrentDoc.ID, 
                tenantId: "AIS",
                category: this.categoryTextToKey(oCurrentDoc.category) || "", 
                language: oCurrentDoc.language || "English",
                source: isOpenTextEnabled ? "OT" : "ASINT",
                phase: this.getKeysFromPhaseString(oCurrentDoc.phase) || "",
                confidentiality: oCurrentDoc.confidentiality || "0",
                deleted: false,
                createdBy: oCurrentDoc.createdBy || sLoggedInUser,
                modifiedBy: sLoggedInUser
            };
            
            if (isOpenTextEnabled) {
                var externalData = { DCL1: "", DCL2: "", DCL3: "" };
                
                if (oCurrentDoc.externalData) {
                    try {
                        var parsedData = typeof oCurrentDoc.externalData === "string" 
                            ? JSON.parse(oCurrentDoc.externalData) 
                            : oCurrentDoc.externalData;
                        externalData = {
                            DCL1: parsedData.DCL1 || "",
                            DCL2: parsedData.DCL2 || "",
                            DCL3: parsedData.DCL3 || ""
                        };
                    } catch (e) {
                        //eslint-disable-next-line no-console
                    }
                }
                
                oPayload.externalData = JSON.stringify(externalData);
                oPayload.documentDate = oCurrentDoc.documentDate || new Date().toISOString();
            } else {
                oPayload.externalData = JSON.stringify({ DCL1: "", DCL2: "", DCL3: "" });
                oPayload.documentDate = null;
            }
            
            // Add file information with the blob
            oPayload.to_file = {
                type: oCurrentDoc.type || "image/png",
                name: that.fnGenerateUniqueName(oCurrentDoc.fileName || oCurrentDoc.documentName),
                size: fileSize,
                file: blob, // The actual blob for chunking
                version: (oCurrentDoc.version || 0) + 1,
                deleted: false
            };
            
            oPayload.to_points = this._findingMarkups.map(function(markup) {
                return {
                    xaxis: markup.xaxis,
                    yaxis: markup.yaxis,
                    color: that._colorToNumber(markup.color),
                    shape: markup.shape,
                    embedInImage: markup.embedInImage,
                    size: markup.size,
                    opacity: markup.opacity,
                    type: markup.type,
                    hasPointer: markup.hasPointer,
                    pointerX: markup.pointerX,
                    pointerY: markup.pointerY,
                    label: parseInt(markup.label, 10),
                    additionalData: markup.additionalData,
                    finding_ID: markup.findingId
                };
            });

            
            that.datasource.updateDocData(oPayload, function(oResponse) {
                if (oResponse) {
                    var sNewImageUrl = oResponse.editedImageUrl || oResponse.previewUrl || oResponse.convertToPreview;
                    if (sNewImageUrl) {
                        that._currentImageObj.editedImageUrl = sNewImageUrl;
                        
                        var aSelectedItems = that.oTable.getSelectedItems();
                        if (aSelectedItems && aSelectedItems.length > 0) {
                            var oContext = aSelectedItems[0].getBindingContext();
                            var oModel = oContext.getModel();
                            var sPath = oContext.getPath();
                            oModel.setProperty(sPath + "/editedImageUrl", sNewImageUrl);
                        }
                    }
                }
                
                var table = that.oTable;
                var model = table.getModel();
                var inspPay = model.getProperty("/data/documents/assessmentInfo");
                
                if (!inspPay || !inspPay.ID) {
                    sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.imageSavedNoParent.text"));
                    that.onCloseIntelliEdit();
                    that.attachDocumentToTable();
                    return;
                }
                
                var newEditedImageInfo = {};
                var newDocumentId = oResponse.ID; 
                
                if (that._app === "FLOC") {
                    newEditedImageInfo = {
                        location_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "ASD" || that._app === "INSP") {
                    newEditedImageInfo = {
                        assessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "EQUI") {
                    newEditedImageInfo = {
                        equipment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                    newEditedImageInfo = {
                        recommendation_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "MO") {
                    newEditedImageInfo = {
                        maintenanceOrderMaster_ID: inspPay.ID,
                        attachments_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "TASK_MANAGEMENT") {
                    newEditedImageInfo = {
                        generalTask_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "MSP") {
                    newEditedImageInfo = {
                        maintenanceSpendPlan_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "FINDINGS") {
                    newEditedImageInfo = {
                        findings_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "RCA") {
                    newEditedImageInfo = {
                        rcAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "MPOT") {
                    newEditedImageInfo = {
                        optimisationAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "RCM") {
                    newEditedImageInfo = {
                        rcmAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "FLEET") {
                    newEditedImageInfo = {
                        classStrategyAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if (that._app === "RCaA") {
                    newEditedImageInfo = {
                        rootCauseAnalysis_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false
                    };
                } else if(that._app==="HAZOP"){
                    inspectionInfo = {
                        hazopAssessment_ID: inspPay.ID,
                        document_ID: docid,
                        deleted: false
                    }
                } else if(that._app==="SIL"){
                    inspectionInfo = {
                        safetyAssessment_ID: inspPay.ID,
                        document_ID: docid,
                        deleted: false
                    }
                }
                
                var to_documents = [];
                to_documents.push(newEditedImageInfo); 
                var docIds = model.getProperty("/data/documents/attachDocumentsList");
                if (docIds && docIds.length > 0) {
                    docIds.forEach(function (doc) {
                        var assessment_ID = doc.assessment_ID;
                        var deleted = doc.deleted;
                        var document_ID = doc.document_ID;
                        var extractedObject = {};
                        
                        if (that._app === "FLOC") {
                            extractedObject = {
                                location_ID: doc.location_ID || assessment_ID,
                                deleted: deleted,
                                document_ID: document_ID,
                            };
                        } else if (that._app === "ASD" || that._app === "INSP") {
                            extractedObject = {
                                assessment_ID: assessment_ID,
                                deleted: deleted,
                                document_ID: document_ID,
                            };
                        } else if (that._app === "EQUI") {
                            extractedObject = {
                                equipment_ID: doc.equipment_ID || assessment_ID,
                                deleted: deleted,
                                document_ID: document_ID,
                            };
                        } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                            extractedObject = {
                                recommendation_ID: doc.recommendation_ID || assessment_ID,
                                deleted: deleted,
                                document_ID: document_ID,
                            };
                        } else if (that._app === "MO") {
                            extractedObject = {
                                maintenanceOrderMaster_ID: doc.maintenanceOrderMaster_ID || assessment_ID,
                                deleted: deleted,
                                attachments_ID: doc.attachments_ID || document_ID,
                            };
                        } else if (that._app === "TASK_MANAGEMENT") {
                            extractedObject = {
                                generalTask_ID: doc.generalTask_ID || assessment_ID,
                                deleted: deleted,
                                document_ID: document_ID,
                            };
                        } else if (that._app === "MSP") {
                            extractedObject = {
                                maintenanceSpendPlan_ID: doc.maintenanceSpendPlan_ID || assessment_ID,
                                deleted: deleted,
                                document_ID: document_ID,
                            };
                        } else if (that._app === "FINDINGS") {
                            extractedObject = {
                                findings_ID: doc.findings_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: false
                            };
                        } else if (that._app === "RCA") {
                            extractedObject = {
                                rcAssessment_ID: doc.rcAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: false
                            };
                        } else if (that._app === "MPOT") {
                            extractedObject = {
                                optimisationAssessment_ID: doc.optimisationAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: false
                            };
                        } else if (that._app === "RCM") {
                            extractedObject = {
                                rcmAssessment_ID: doc.rcmAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: false
                            };
                        } else if (that._app === "FLEET") {
                            extractedObject = {
                                classStrategyAssessment_ID: doc.classStrategyAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: false
                            };
                        } else if (that._app === "RCaA") {
                            extractedObject = {
                                rootCauseAnalysis_ID: doc.rootCauseAnalysis_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: false
                            };
                        } else if(that._app==="HAZOP"){
                            inspectionInfo = {
                                hazopAssessment_ID: inspPay.ID,
                                document_ID: docid,
                                deleted: false
                            }
                        } else if(that._app==="SIL"){
                            inspectionInfo = {
                                safetyAssessment_ID: inspPay.ID,
                                document_ID: docid,
                                deleted: false
                            }
                        }             
                        to_documents.push(extractedObject);
                    });
                }
                
                var inspPayload = {
                    ID: inspPay.ID,
                    category: inspPay.category,
                    createdAt: inspPay.createdAt,
                    createdBy: inspPay.createdBy,
                    deleted: inspPay.deleted,
                    modifiedAt: inspPay.modifiedAt,
                    modifiedBy: sLoggedInUser,
                    status: inspPay.status,
                    objectType: inspPay.objectType,
                    displayId: inspPay.displayId,
                    "@etag": inspPay["@etag"]
                };
                
                if (that._app === "MO") {
                    inspPayload.to_attachments = to_documents;
                } else {
                    inspPayload.to_documents = to_documents;
                }
                
                var etag = inspPay["@etag"];
                that.datasource.attachTempToDocument(inspPayload, inspPay.ID, etag, that._app, function (oResult) {
                    inspPay["@etag"] = oResult["@etag"];
                    model.setProperty("/data/documents/assessmentInfo", inspPay);
                    sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.imageSavedSuccess.text"));
                    that.onCloseIntelliEdit();
                    that.attachDocumentToTable();
                    //eslint-disable-next-line no-unused-vars
                }, function (oError) {
                    that.fnMessageShow("E", oI18n.getText("asint.intelli.msg.imageSavedAttachFailed.text"));
                    that.onCloseIntelliEdit();
                    that.attachDocumentToTable();
                }
                );
                
            },
            //eslint-disable-next-line no-unused-vars
            function(oError) {
                that.fnMessageShow("E", oI18n.getText("asint.intelli.msg.failedToSaveImage.text"));
                if (that._oIntelliEditDialog) {
                    that._oIntelliEditDialog.setBusy(false);
                }
            }, isOpenTextEnabled, oObjectInfo);
        },

        /**
         * 
         */
        fnGenerateUniqueName: function(sFileName) {
            var sParts = sFileName.split(".");
            var sExt = sParts.length > 1 ? "." + sParts.pop() : "";
            var sBaseName = sParts.join(".");
            var sTimestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
            var iLastEdited = sBaseName.lastIndexOf("_edited_");
            if (iLastEdited !== -1) {
                var sSuffix = sBaseName.substring(iLastEdited + 8);
                if (/^\d{14}$/.test(sSuffix)) {
                    sBaseName = sBaseName.substring(0, iLastEdited);
                }
            }
            return sBaseName + "_edited_" + sTimestamp + sExt;
        },

        /**
         * Convert color hex to number for persistence
         */
        _colorToNumber: function(colorHex) {
            var hex = colorHex.replace("#", "");
            var rgb = parseInt(hex, 16);
            return ((0xFF << 24) | rgb) >>> 0;
        },

        /**
         * Convert color number to hex
         */
        _numberToColor: function(colorNumber) {
            var rgb = colorNumber & 0xFFFFFF;
            return "#" + rgb.toString(16).padStart(6, "0").toUpperCase();
        },

        /**
         * close handler 
         */
        onCloseIntelliEdit: function() {
            this._detachCanvasHandlers();
            
            if (this._canvas) {
                if (this._markupMouseDown) this._canvas.removeEventListener("mousedown", this._markupMouseDown);
                if (this._markupMouseMove) this._canvas.removeEventListener("mousemove", this._markupMouseMove);
                if (this._markupMouseUp) this._canvas.removeEventListener("mouseup", this._markupMouseUp);
                if (this._markupDblClick) this._canvas.removeEventListener("dblclick", this._markupDblClick);
            }
            this._canvas = null;
            this._canvasBaseWidth  = null;
            this._canvasBaseHeight = null;
            this._ctx = null;
            this._originalImage = null;
            if (this._oIntelliEditDialog) {
                this._oIntelliEditDialog.setBusy(false); 
                this._oIntelliEditDialog.close();
            }
            this._currentSessionFindingsCache = null;
            this._oIntelliEditState = {
                activeTool: null,
                color: "#F44336",
                size: 12,
                undoStack: [],
                redoStack: [],
                isDrawing: false,
                zoomLevel: 1.0
            };
            
            this._initializeFindingMarkupState();
        },

        /**
         * Enhanced undo to support markup changes
         */
        onUndo: function() {
            if (this._oIntelliEditState.undoStack.length > 1) {
                var currentState = this._oIntelliEditState.undoStack.pop();
                this._oIntelliEditState.redoStack.push(currentState);
                
                var previousState = this._oIntelliEditState.undoStack[this._oIntelliEditState.undoStack.length - 1];
                this._ctx.putImageData(previousState, 0, 0);
                
                this._renderAllMarkups();
                
                this._updateUndoRedoButtons();
            }
        },

        /**
         * Enhanced redo to support markup changes
         */
        onRedo: function() {
            if (this._oIntelliEditState.redoStack.length > 0) {
                var state = this._oIntelliEditState.redoStack.pop();
                this._oIntelliEditState.undoStack.push(state);
                this._ctx.putImageData(state, 0, 0);
                
                this._renderAllMarkups();
                
                this._updateUndoRedoButtons();
            }
        },
    
        //INTELLIVIEW RELATED FUNCTIONS BELOW

        /**
         * Open IntelliView
         */
        onOpenIntelliView: function() {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            var aSelectedItems = that.oTable.getSelectedItems();
            if (!aSelectedItems.length) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectImageToView.text"));
                return;
            }

            var oSelectedObj = aSelectedItems[0].getBindingContext().getObject();

            if (!oSelectedObj.type || oSelectedObj.type.indexOf("image/") !== 0) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectImageFile.text"));
                return;
            }

            var sLoadingHTML = "<div style=\"display:flex;align-items:center;justify-content:center;height:300px;\">" +
                            "<div style=\"font-size:1rem;color:#666;\">Loading image...</div>" +
                            "</div>";

            if (!that._oIntelliViewDialog) {
                Fragment.load({
                    id: "idIntelliViewDialog",
                    name: "com.asint.ais.library.fragment.IntelliView",
                    controller: that
                }).then(function(oDialog) {
                    that._oIntelliViewDialog = oDialog;
                    that._oIntelliViewDialog.setModel(that._i18n, "i18n");
                    that._oIntelliViewDialog.addStyleClass("sapUiSizeCompact");
                    that._oIntelliViewDialog.open();
                    var oCanvasHost = sap.ui.core.Fragment.byId("idIntelliViewDialog", "idViewCanvasHost");
                    if (oCanvasHost) { oCanvasHost.setContent(sLoadingHTML); }
                    that._fetchOpenTextContent(oSelectedObj, function (sImageSrc) {
                        if (!sImageSrc) {
                            sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.imagePreviewNotAvailable.text"));
                            return;
                        }
                        that._initializeIntelliView(sImageSrc, oSelectedObj);
                    });
                });
            } else {
                var oCanvasHost = sap.ui.core.Fragment.byId("idIntelliViewDialog", "idViewCanvasHost");
                if (oCanvasHost) { oCanvasHost.setContent(sLoadingHTML); }
                that._oIntelliViewDialog.open();
                that._fetchOpenTextContent(oSelectedObj, function (sImageSrc) {
                    if (!sImageSrc) {
                        sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.imagePreviewNotAvailable.text"));
                        return;
                    }
                    that._initializeIntelliView(sImageSrc, oSelectedObj);
                });
            }
        },

        /**
         *
         */
        _initializeIntelliView: function(sImageSrc, oImageObj) {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._currentImageObj = oImageObj;
            this._initializeFindingMarkupState();

            var oCanvasHostEarly = sap.ui.core.Fragment.byId("idIntelliViewDialog", "idViewCanvasHost");
            if (oCanvasHostEarly) { oCanvasHostEarly.setContent(""); }

            this._oIntelliEditState = {
                activeTool: null,
                color: "#F44336",
                size: 12,
                undoStack: [],
                redoStack: [],
                isDrawing: false,
                zoomLevel: 1.0
            };

            var img = new Image();
            img.onload = function() {
                var imgWidth  = img.naturalWidth;
                var imgHeight = img.naturalHeight;

                var maxWidth  = window.innerWidth  * 0.9;
                var maxHeight = window.innerHeight * 0.7;
                var scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
                var canvasWidth  = Math.round(imgWidth  * scale);
                var canvasHeight = Math.round(imgHeight * scale);

                var sCanvasHTML = "<canvas id=\"intelliViewCanvas\" " +
                  "width=\"" + imgWidth + "\" " +
                  "height=\"" + imgHeight + "\" " +
                  "style=\"max-width: 100%; height: auto; cursor: default; border: 1px solid #ccc;\">" +
                  "</canvas>";

                var oCanvasHost = sap.ui.core.Fragment.byId("idIntelliViewDialog", "idViewCanvasHost");
                if (!oCanvasHost) return;

                var minDialogWidth = 980;
                var finalWidth = Math.max(canvasWidth + 60, minDialogWidth);
                that._oIntelliViewDialog.setContentWidth(finalWidth + "px");
                that._oIntelliViewDialog.setContentHeight(Math.min(canvasHeight + 200, maxHeight) + "px");
                that._oIntelliViewDialog.invalidate();

                oCanvasHost.addEventDelegate({
                    /**
                     * 
                     */
                    onAfterRendering: function () {
                        oCanvasHost.removeEventDelegate(this);

                        var canvas = document.getElementById("intelliViewCanvas");
                        if (!canvas) {
                            sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.failedToInitViewer.text"));
                            return;
                        }

                        that._canvas = canvas;
                        that._ctx = canvas.getContext("2d", { willReadFrequently: true });
                        that._ctx.clearRect(0, 0, imgWidth, imgHeight);
                        that._ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                        that._originalImage = img;
                        that._canvasBaseWidth  = canvasWidth;
                        that._canvasBaseHeight = canvasHeight;

                        if (oImageObj.to_points && oImageObj.to_points.length > 0) {
                            that._loadExistingMarkups(oImageObj.to_points);
                        }

                        that._saveState();
                        that._renderAllMarkups();

                        that._attachViewMarkupHandlers();
                        that.onViewResetZoom();
                        if (that._oIntelliViewDialog) { that._oIntelliViewDialog.setBusy(false); }
                    }
                });

                oCanvasHost.setContent(sCanvasHTML);
            };
            img.onerror = function() {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.failedToLoadImage.text"));
            };
            img.src = sImageSrc;
        },

        /**
         *
         */
        _attachViewMarkupHandlers: function() {
            var that = this;

            this._isViewMode = true;

            if (this._viewDblClickHandler) {
                this._canvas.removeEventListener("dblclick", this._viewDblClickHandler);
            }

            this._viewDblClickHandler = function(e) {
                var pos = that._getCanvasCoordinates(e);
                var relX = pos.x / that._canvas.width;
                var relY = pos.y / that._canvas.height;
                var clickedMarkup = that._findMarkupAtPosition(relX, relY);
                if (clickedMarkup) {
                    that._openMarkupConfigDialog(clickedMarkup);
                }
            };

            this._canvas.addEventListener("dblclick", this._viewDblClickHandler);
        },

        /**
         *
         */
        onViewResetZoom: function() {
            if (!this._oIntelliEditState) return;
            this._oIntelliEditState.zoomLevel = 1.0;
            this._applyZoom();
        },

        /**
         * Close IntelliView
         */
        onCloseIntelliView: function() {
            if (this._viewDblClickHandler && this._canvas) {
                this._canvas.removeEventListener("dblclick", this._viewDblClickHandler);
                this._viewDblClickHandler = null;
            }

            if (this._oIntelliViewDialog) {
                this._oIntelliViewDialog.close();
            }

            this._canvas        = null;
            this._ctx           = null;
            this._originalImage = null;
            this._isViewMode    = false;
            this._initializeFindingMarkupState();
            this._oIntelliEditState = {
                activeTool: null,
                color: "#F44336",
                size: 12,
                undoStack: [],
                redoStack: [],
                isDrawing: false,
                zoomLevel: 1.0
            };
        },

        /**
         * Loads PDF.js from CDN if not already present, then calls fnCallback
         */
        _loadPDFJS: function (fnCallback) {
            if (window["pdfjs-dist/build/pdf"]) {
                fnCallback();
            } else {
                var script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
                script.onload = fnCallback;
                document.head.appendChild(script);
            }
        },

        /**
         * Decodes a base64 PDF string and returns a Uint8Array
         */
        _decodePDFBase64: function (sPdfSrc) {
            var sBase64 = sPdfSrc.indexOf("base64,") !== -1 ? sPdfSrc.split("base64,")[1] : sPdfSrc;
            var sBinary = atob(sBase64);
            var aBytes = new Uint8Array(sBinary.length);
            for (var i = 0; i < sBinary.length; i++) {
                aBytes[i] = sBinary.charCodeAt(i);
            }
            return aBytes;
        },

        /**
         * Parses to_pdfPoints from a doc object into a page-keyed markup map.
         * Used by both IntelliEdit and IntelliView so the parsing logic lives once.
         */
        _parsePDFMarkups: function (oPdfObj) {
            var that = this;
            var oResult = {};
            if (!oPdfObj.to_points || !oPdfObj.to_points.length) return oResult;

            var aPoints = typeof oPdfObj.to_points === "string" ? JSON.parse(oPdfObj.to_points) : oPdfObj.to_points;

            aPoints.filter(function (point) {
                return point.pageId !== null && point.pageId !== undefined;
            }).forEach(function (point) {
                var iPage = parseInt(point.pageId, 10);
                if (!oResult[iPage]) { oResult[iPage] = []; }
                var oFinding = point.finding || null;
                var sDisplayId   = (oFinding && oFinding.displayId) ? oFinding.displayId : "";
                var sDescription = (oFinding && oFinding.findingName) ? oFinding.findingName : (oFinding && oFinding.finding) ? oFinding.finding : "";
                var sMarkupRef   = (oFinding && oFinding.markUpValue) ? oFinding.markUpValue.toString() : point.label ? point.label.toString() : "";
                oResult[iPage].push({
                    xaxis: Math.max(0, point.xaxis), // top-left; upper bound enforced at drag time
                    yaxis: Math.max(0, point.yaxis),
                    color: that._numberToColor(point.color),
                    shape: point.shape,
                    embedInImage: point.embedInImage || false,
                    size: point.size || 30,
                    opacity: point.opacity !== undefined ? point.opacity : 1,
                    type: point.type || "Finding",
                    hasPointer: point.hasPointer || false,
                    pointerX: point.pointerX || null,
                    pointerY: point.pointerY || null,
                    label: point.label ? point.label.toString() : "1",
                    findingId: point.finding_ID || null,
                    displayId: sDisplayId,
                    description: sDescription,
                    markupReference: sMarkupRef,
                    selectedItem: point.selectedItem || null,
                    additionalData: point.additionalData || "{}",
                    pageId: point.pageId,
                    isSelected: false,
                    isSaved: true,
                    findingDataLoaded: !!(sDisplayId || sDescription)
                });
            });
            return oResult;
        },


        /**
         * Updates page indicator text and prev/next button states for any PDF dialog.
         * Used by both IntelliEdit and IntelliView page controls.
         */
        _updatePageControls: function (sFragmentId, sIndicatorId, sPrevId, sNextId, iCurrent, iTotal) {
            var oIndicator = sap.ui.core.Fragment.byId(sFragmentId, sIndicatorId);
            var oPrevBtn   = sap.ui.core.Fragment.byId(sFragmentId, sPrevId);
            var oNextBtn   = sap.ui.core.Fragment.byId(sFragmentId, sNextId);

            if (oIndicator) oIndicator.setText("Page " + iCurrent + " / " + iTotal);
            if (oPrevBtn)   oPrevBtn.setEnabled(iCurrent > 1);
            if (oNextBtn)   oNextBtn.setEnabled(iCurrent < iTotal);
        },

        // PDF INTELLIEDIT

        /**
         * Opens the PDF IntelliEdit dialog
         */
        onPressPDFIntelliEdit: function () {
            var that = this;
            var aSelectedItems = that.oTable.getSelectedItems();
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            if (!aSelectedItems.length) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectPDFToEdit.text"));
                return;
            }

            var oSelectedObj = aSelectedItems[0].getBindingContext().getObject();

            if (!oSelectedObj.type || oSelectedObj.type.indexOf("application/pdf") !== 0) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.selectPDFFile.text"));
                return;
            }

            that._fetchOpenTextContent(oSelectedObj, function (sPdfSrc) {
                if (!sPdfSrc) {
                    sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.pdfPreviewNotAvailable.text"));
                    return;
                }

                that._oPDFIntelliEditState = {
                    activeTool: null,
                    color: "#F44336",
                    size: 12,
                    undoStack: [],
                    redoStack: [],
                    isDrawing: false,
                    zoomLevel: 1.0
                };

                if (!that._oPDFIntelliEditDialog) {
                    Fragment.load({
                        id: "idIntelliEditPDFDialog",
                        name: "com.asint.ais.library.fragment.IntelliEditPDF",
                        controller: that
                    }).then(function (oDialog) {
                        that._oPDFIntelliEditDialog = oDialog;
                        that._oPDFIntelliEditDialog.addStyleClass("sapUiSizeCompact");
                        that._oPDFIntelliEditDialog.setModel(that._i18n, "i18n");
                        that._oPDFIntelliEditDialog.open();
                        that._initializePDFCanvas(sPdfSrc, oSelectedObj);
                    });
                } else {
                    that._oPDFIntelliEditDialog.open();
                    that._initializePDFCanvas(sPdfSrc, oSelectedObj);
                }
            });
        },

        /**
         * Initialize PDF edit state — page-keyed markup map
         */
        _initializePDFMarkupState: function () {
            this._pdfMarkups = {};
            this._pdfDirtyPages = {};
            this._pdfCurrentPage = 1;
            this._pdfTotalPages = 0;
            this._pdfActiveMarkup = null;
            this._pdfIsDraggingMarkup  = false;
            this._pdfIsDraggingPointer = false;
            this._pdfDragOffset = { x: 0, y: 0 };
            this._pdfPageSnapshots = {};  
            this._pdfPageUndoStacks = {};
            this._pdfPageRedoStacks = {};
        },

        /**
         * Get markups array for a given page, initializing if absent
         */
        _getPDFPageMarkups: function (iPage) {
            if (!this._pdfMarkups[iPage]) {
                this._pdfMarkups[iPage] = [];
            }
            return this._pdfMarkups[iPage];
        },

        /**
         * Load and render the PDF for editing
         */
        _initializePDFCanvas: function (sPdfSrc, oPdfObj) {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._currentPDFObj = oPdfObj;
            this._initializePDFMarkupState();
            this._pdfMarkups = this._parsePDFMarkups(oPdfObj);

            var oCanvasHostEarly = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFCanvasHost");
            if (oCanvasHostEarly) { oCanvasHostEarly.setContent(""); }

            this._loadPDFJS(function () {
                var pdfjsLib = window["pdfjs-dist/build/pdf"];
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                try {
                    // pdfjsLib.getDocument({ data: that._decodePDFBase64(sPdfSrc) }).promise
                    pdfjsLib.getDocument(sPdfSrc.startsWith("http") ? { url: sPdfSrc } : { data: that._decodePDFBase64(sPdfSrc) }).promise
                        .then(function (pdfDoc) {
                            that._pdfDoc         = pdfDoc;
                            that._pdfTotalPages  = pdfDoc.numPages;
                            that._pdfCurrentPage = 1;
                            that._updatePDFPageControls();
                            that._renderPDFPage(that._pdfCurrentPage);
                        })
                        //eslint-disable-next-line no-unused-vars
                        .catch(function (err) {
                            if (that._oPDFIntelliEditDialog) { that._oPDFIntelliEditDialog.setBusy(false); }
                            sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.failedToLoadPDF.text"));
                        });
                } catch (e) {
                    if (that._oPDFIntelliEditDialog) { that._oPDFIntelliEditDialog.setBusy(false); } 
                    sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.failedToDecodePDF.text"));
                }
            });
        },

        /**
         * Render a specific PDF page onto the edit canvas
         */
        _renderPDFPage: function (iPage) {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            this._pdfDoc.getPage(iPage).then(function (page) {
                var viewport = page.getViewport({ scale: 1.5 });
                /* eslint-disable quotes */
                var sCanvasHTML = '<canvas id="pdfIntelliEditCanvas"' +
                    ' width="' + viewport.width + '"' +
                    ' height="' + viewport.height + '"' +
                    ' style="display:block; cursor:crosshair; border:1px solid #ccc;">' +
                    '</canvas>';
                /* eslint-disable quotes */
                var oCanvasHost = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFCanvasHost");
                if (!oCanvasHost) return;

                oCanvasHost.setContent(sCanvasHTML);

                var maxHeight = window.innerHeight * 0.7;
                var finalWidth = Math.max(viewport.width + 60, 980);
                that._oPDFIntelliEditDialog.setContentWidth(finalWidth + "px");
                that._oPDFIntelliEditDialog.setContentHeight(Math.min(viewport.height + 220, maxHeight) + "px");

                setTimeout(function () {
                    var canvas = document.getElementById("pdfIntelliEditCanvas");
                    if (!canvas) {
                        sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.failedToInitPDFCanvas.text"));
                        return;
                    }

                    that._canvas = canvas;
                    that._ctx = canvas.getContext("2d", { willReadFrequently: true });

                    page.render({ canvasContext: that._ctx, viewport: viewport }).promise.then(function () {
                        that._oPDFIntelliEditState.isDrawing = false;
                        var savedUndoStack = that._pdfPageUndoStacks[iPage];
                        if (savedUndoStack && savedUndoStack.length > 0) {
                            that._oPDFIntelliEditState.undoStack = savedUndoStack.slice();
                            that._oPDFIntelliEditState.redoStack = (that._pdfPageRedoStacks[iPage] || []).slice();
                            that._ctx.putImageData(savedUndoStack[savedUndoStack.length - 1], 0, 0);
                        } else {
                            that._oPDFIntelliEditState.undoStack = [];
                            that._oPDFIntelliEditState.redoStack = [];
                            that._pdfSaveState();
                        }
                        that._detachPDFCanvasHandlers();
                        that._detachPDFMarkupHandlers();
                        that._attachPDFMarkupHandlers();
                        if (that._oPDFIntelliEditState.activeTool){
                            that._attachPDFCanvasHandlers()
                        }
                        that._pdfRenderAllMarkups();
                        that._applyCanvasZoom(that._canvas, that._oPDFIntelliEditState.zoomLevel);
                        that._updatePDFUndoRedoButtons();
                        if (that._oPDFIntelliEditDialog) { that._oPDFIntelliEditDialog.setBusy(false); }
                    });
                }, 100);
            });
        },

        /**
         * Save canvas state for PDF undo/redo
         */
        _pdfSaveState: function () {
            if (!this._canvas || !this._ctx) return;

            var imageData = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
            this._oPDFIntelliEditState.undoStack.push(imageData);
            this._oPDFIntelliEditState.redoStack = [];

            if (this._oPDFIntelliEditState.undoStack.length > 50) {
                this._oPDFIntelliEditState.undoStack.shift();
            }

            this._updatePDFUndoRedoButtons();
        },

        /**
         * Update PDF undo/redo button enabled states
         */
        _updatePDFUndoRedoButtons: function () {
            var oUndoBtn = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFUndoBtn");
            var oRedoBtn = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFRedoBtn");

            if (oUndoBtn) oUndoBtn.setEnabled(this._oPDFIntelliEditState.undoStack.length > 1);
            if (oRedoBtn) oRedoBtn.setEnabled(this._oPDFIntelliEditState.redoStack.length > 0);
        },

        /**
         * Update edit dialog page indicator and prev/next buttons
         */
        _updatePDFPageControls: function () {
            this._updatePageControls("idIntelliEditPDFDialog", "idPDFPageIndicator", "idPDFPrevPageBtn", "idPDFNextPageBtn", this._pdfCurrentPage, this._pdfTotalPages);
        },

        /**
         * Navigate to previous page (edit mode)
         */
        onPDFPrevPage: function () {
            if (this._pdfCurrentPage <= 1) return;
            this._detachPDFCanvasHandlers();
            this._detachPDFMarkupHandlers();
            this._savePDFPageSnapshot(this._pdfCurrentPage);
            this._pdfCurrentPage--;
            this._updatePDFPageControls();
            this._renderPDFPage(this._pdfCurrentPage);
        },

        /**
         * Navigate to next page (edit mode)
         */
        onPDFNextPage: function () {
            if (this._pdfCurrentPage >= this._pdfTotalPages) return;
            this._detachPDFCanvasHandlers();
            this._detachPDFMarkupHandlers();
            this._savePDFPageSnapshot(this._pdfCurrentPage);
            this._pdfCurrentPage++;
            this._updatePDFPageControls();
            this._renderPDFPage(this._pdfCurrentPage);
        },

        /**
         * Save the current canvas state as a snapshot for the given page
         */
        _savePDFPageSnapshot: function (iPage) {
            if (!this._canvas || !this._ctx) return;
            var undoStack = this._oPDFIntelliEditState.undoStack;
            var redoStack = this._oPDFIntelliEditState.redoStack;
            if (undoStack && undoStack.length > 0) {
                this._pdfPageSnapshots[iPage]  = undoStack[undoStack.length - 1];
                this._pdfPageUndoStacks[iPage] = undoStack.slice();
                this._pdfPageRedoStacks[iPage] = redoStack ? redoStack.slice() : [];
            }
        },
        /**
         * Tool selection
         */
        onPDFSelectTextTool: function () {
            this._setPDFActiveTool("TEXT");
        },

        /**
         * Brush selection for editing
         */
        onPDFSelectBrushTool: function () {
            this._setPDFActiveTool("BRUSH");
        },

        /**
         * Set active PDF tool — toggle off if same tool pressed again
         */
        _setPDFActiveTool: function (sTool) {
            var oState = this._oPDFIntelliEditState;

            if (sTool === null) {
                oState.activeTool = null;
                this._detachPDFCanvasHandlers();
                this._updatePDFToolButtons();
                return;
            }

            if (oState.activeTool === sTool) {
                oState.activeTool = null;
                this._detachPDFCanvasHandlers();
            } else {
                oState.activeTool = sTool;
                this._attachPDFCanvasHandlers();

                if (this._pdfActiveMarkup) {
                    this._pdfActiveMarkup.isSelected = false;
                    this._pdfActiveMarkup = null;
                    this._pdfRenderAllMarkups();
                }
            }

            this._updatePDFToolButtons();
        },

        /**
         * Update PDF tool button pressed states
         */
        _updatePDFToolButtons: function () {
            var sTool = this._oPDFIntelliEditState.activeTool;
            var oTextBtn = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFTextToolBtn");
            var oBrushBtn = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFBrushToolBtn");

            if (oTextBtn) oTextBtn.setPressed(sTool === "TEXT");
            if (oBrushBtn) oBrushBtn.setPressed(sTool === "BRUSH");
        },

        /**
         * Attach canvas drawing event handlers based on active tool
         */
        _attachPDFCanvasHandlers: function () {
            var that = this;
            this._detachPDFCanvasHandlers();

            if (!this._canvas) return;

            switch (this._oPDFIntelliEditState.activeTool) {
            case "BRUSH":
                this._canvas.addEventListener("mousedown", this._pdfBrushMouseDown = function (e) { that._onPDFBrushStart(e); });
                this._canvas.addEventListener("mousemove", this._pdfBrushMouseMove = function (e) { that._onPDFBrushMove(e); });
                this._canvas.addEventListener("mouseup", this._pdfBrushMouseUp = function (e) { that._onPDFBrushEnd(e); });
                this._canvas.addEventListener("mouseleave", this._pdfBrushMouseLeave = function (e) { that._onPDFBrushEnd(e); });
                break;
            case "TEXT":
                this._canvas.addEventListener("click", this._pdfTextClick = function (e) { that._onPDFTextClick(e); });
                break;
            }
        },

        /**
         * Detach canvas drawing event handlers
         */
        _detachPDFCanvasHandlers: function () {
            if (!this._canvas) return;

            if (this._pdfBrushMouseDown) this._canvas.removeEventListener("mousedown", this._pdfBrushMouseDown);
            if (this._pdfBrushMouseMove) this._canvas.removeEventListener("mousemove", this._pdfBrushMouseMove);
            if (this._pdfBrushMouseUp) this._canvas.removeEventListener("mouseup", this._pdfBrushMouseUp);
            if (this._pdfBrushMouseLeave) this._canvas.removeEventListener("mouseleave", this._pdfBrushMouseLeave);
            if (this._pdfTextClick) this._canvas.removeEventListener("click", this._pdfTextClick);
        },

        /**
         * Brush start
         */
        _onPDFBrushStart: function (oEvent) {
            this._oPDFIntelliEditState.isDrawing = true;
            this._lastPos = this._getCanvasCoordinates(oEvent);
            this._pdfCurrentBrushStrokes = [];
            this._pdfDirtyPages[this._pdfCurrentPage] = true;
        },

        /**
         * Brush move
         */
        _onPDFBrushMove: function (oEvent) {
            if (!this._oPDFIntelliEditState.isDrawing) return;

            var pos = this._getCanvasCoordinates(oEvent);

            this._pdfCurrentBrushStrokes.push({
                from: { x: this._lastPos.x, y: this._lastPos.y },
                to: { x: pos.x, y: pos.y },
                color: this._oPDFIntelliEditState.color,
                lineWidth: this._oPDFIntelliEditState.size
            });

            this._ctx.strokeStyle = this._oPDFIntelliEditState.color;
            this._ctx.lineWidth = this._oPDFIntelliEditState.size;
            this._ctx.lineCap = "round";
            this._ctx.lineJoin = "round";
            this._ctx.beginPath();
            this._ctx.moveTo(this._lastPos.x, this._lastPos.y);
            this._ctx.lineTo(pos.x, pos.y);
            this._ctx.stroke();

            this._lastPos = pos;
        },

        /**
         * Brush end — replay strokes on last clean state then save
         */
        _onPDFBrushEnd: function () {
            if (!this._oPDFIntelliEditState.isDrawing) return;

            this._oPDFIntelliEditState.isDrawing = false;

            var undoStack = this._oPDFIntelliEditState.undoStack;
            if (undoStack && undoStack.length > 0) {
                this._ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
            }

            this._pdfCurrentBrushStrokes.forEach(function (stroke) {
                this._ctx.strokeStyle = stroke.color;
                this._ctx.lineWidth = stroke.lineWidth;
                this._ctx.lineCap = "round";
                this._ctx.lineJoin = "round";
                this._ctx.beginPath();
                this._ctx.moveTo(stroke.from.x, stroke.from.y);
                this._ctx.lineTo(stroke.to.x, stroke.to.y);
                this._ctx.stroke();
            }.bind(this));

            this._pdfSaveState();
            this._pdfRenderAllMarkups();
            this._pdfCurrentBrushStrokes = [];
        },

        /**
         * Text click — opens inline dialog, draws text on confirm
         */
        _onPDFTextClick: function (oEvent) {
            var that = this;
            this._pdfCurrentTextPosition = this._getCanvasCoordinates(oEvent);
            this._pdfDirtyPages[this._pdfCurrentPage] = true;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            if (!this._oPDFTextDialog) {
                this._oPDFTextInput = new sap.m.Input({ placeholder: oI18n.getText("asint.intelli.textTool.input.placeholder.text") });

                this._oPDFTextDialog = new sap.m.Dialog({
                    title: oI18n.getText("asint.intelli.textTool.dialog.title.text"),
                    content: [this._oPDFTextInput],
                    beginButton: new sap.m.Button({
                        text: oI18n.getText("asint.intelli.textTool.dialog.button.ok.text"),
                        /**
                         * Function to handle press
                         */
                        press: function () {
                            var sText = that._oPDFTextInput.getValue();
                            if (sText) {
                                var undoStack = that._oPDFIntelliEditState.undoStack;
                                if (undoStack && undoStack.length > 0) {
                                    that._ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
                                }
                                var pos      = that._pdfCurrentTextPosition;
                                var fontSize = that._oPDFIntelliEditState.size * 2;
                                that._ctx.font      = fontSize + "px Arial";
                                that._ctx.fillStyle = that._oPDFIntelliEditState.color;
                                that._ctx.fillText(sText, pos.x, pos.y);
                                that._pdfSaveState();
                                that._pdfRenderAllMarkups();
                            }
                            that._oPDFTextDialog.close();
                            that._oPDFTextInput.setValue("");
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: oI18n.getText("asint.intelli.textTool.dialog.button.cancel.text"),
                        /**
                         * Function to handle press
                         */
                        press: function () { that._oPDFTextDialog.close(); }
                    })
                });
            }

            this._oPDFTextDialog.open();
        },

        /**
         * Brush size change — also updates active markup size if one is selected
         */
        onPDFBrushSizeChange: function (oEvent) {
            var newSize = oEvent.getParameter("value");
            this._oPDFIntelliEditState.size = newSize;

            if (this._pdfActiveMarkup) {
                this._pdfActiveMarkup.size = newSize * 2;
                this._pdfRenderAllMarkups();
            }
        },

        /**
         * Color picker popover
         */
        onPDFOpenColorPicker: function (oEvent) {
            var that = this;

            if (!this._oPDFColorPickerPopover) {
                this._oPDFColorPickerPopover = new sap.m.Popover({
                    placement: sap.m.PlacementType.Bottom,
                    showHeader: false,
                    contentWidth: "230px",
                    verticalScrolling: false,
                    horizontalScrolling: false,
                    content: [
                        new sap.ui.layout.Grid({
                            defaultSpan: "L3 M3 S3",
                            hSpacing: 0.5,
                            vSpacing: 0.5,
                            content: [
                                "#F44336","#E91E63","#9C27B0","#673AB7",
                                "#3F51B5","#2196F3","#03A9F4","#00BCD4",
                                "#009688","#4CAF50","#8BC34A","#CDDC39",
                                "#FFEB3B","#FFC107","#FF9800","#FF5722",
                                "#795548","#9E9E9E","#607D8B","#000000"
                            ].map(function (color) {
                                return that._createPDFColorButton(color);
                            })
                        })
                    ]
                });
            }

            this._oPDFColorPickerPopover.openBy(oEvent.getSource());
        },

        /**
         * Create a color swatch button for the PDF color picker
         */
        _createPDFColorButton: function (sColor) {
            var that = this;

            var oBtn = new sap.m.Button({
                /**
                 * Function to handle press
                 */
                press: function () {
                    that._oPDFIntelliEditState.color = sColor;
                    that._oPDFColorPickerPopover.close();

                    var oColorBtn = sap.ui.core.Fragment.byId("idIntelliEditPDFDialog", "idPDFColorPickerBtn");
                    if (oColorBtn) {
                        oColorBtn.addEventDelegate({
                            /**
                             * Function to handle press
                             */
                            onAfterRendering: function () {
                                oColorBtn.$().find(".sapMBtnIcon").css({ "color": sColor, "font-size": "1.5rem" });
                            }
                        }, oColorBtn);
                        oColorBtn.invalidate();
                    }
                }
            });

            oBtn.addEventDelegate({
                /**
                 * Function to handle press
                 */
                onAfterRendering: function () {
                    oBtn.$().find(".sapMBtnInner").css({
                        "background-color": sColor,
                        "width": "32px",
                        "height": "32px",
                        "border-radius": "50%",
                        "border": "2px solid #ddd"
                    });
                }
            });

            return oBtn;
        },


        /**
         * Attach Finding — reuses AttachFinding fragment, sets _isInPDFMode flag
         */
        onPDFAttachFinding: function () {
            var that = this;

            this._isInPDFMode = true;

            if (that._oPDFIntelliEditState && that._oPDFIntelliEditState.activeTool) {
                that._setPDFActiveTool(null);
            }

            /**
             * Function to handle press
             */
            var fnOpenDialog = function () {
                var oModel = that._findingSelectionDialog.getModel("findingsModel");

                if (oModel) {
                    oModel.setProperty("/findings", that._currentSessionFindingsCache);
                    oModel.setProperty("/selectedFinding", null);
                    oModel.setProperty("/isEmbedded", false);
                    oModel.setProperty("/addPointer", false);
                } else {
                    oModel = new JSONModel({
                        findings: that._currentSessionFindingsCache,
                        selectedFinding: null,
                        isEmbedded: false,
                        addPointer: false
                    });
                    that._findingSelectionDialog.setModel(oModel, "findingsModel");
                }

                var oEmbedCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idEmbeddedCheckbox");
                if (oEmbedCheckbox) { oEmbedCheckbox.setSelected(false); }
                var oPointerCheckbox = sap.ui.core.Fragment.byId("idAttachFindingDialog", "idAddPointerCheckbox");
                if (oPointerCheckbox) { oPointerCheckbox.setSelected(false); }
                that._clearFindingSelection();
                that._findingSelectionDialog.open();
            };

            /**
             * Function to handle press
             */
            var fnEnsureDialogAndOpen = function () {
                if (!that._findingSelectionDialog) {
                    Fragment.load({
                        id: "idAttachFindingDialog",
                        name: "com.asint.ais.library.fragment.AttachFinding",
                        controller: that
                    }).then(function (oDialog) {
                        that._findingSelectionDialog = oDialog;
                        that._findingSelectionDialog.setModel(that._i18n, "i18n");
                        fnOpenDialog();
                    });
                } else {
                    fnOpenDialog();
                }
            };

            if (that._currentSessionFindingsCache) {
                fnEnsureDialogAndOpen();
            } else {
                that._loadFindingsData(function (aFindings) {
                    that._currentSessionFindingsCache = aFindings;
                    fnEnsureDialogAndOpen();
                });
            }
        },

        /**
         * Create a finding markup — branches on _isInPDFMode for PDF vs image
         */
        _createFindingMarkup: function (finding, embedInImage, hasPointer) {
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            if (!this._canvas) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.canvasNotInitialized.text"));
                return;
            }

            var iPDFSize = 15;
            var pdfCanvasW = this._canvas.width;
            var pdfCanvasH = this._canvas.height;
            var pdfMaxXRel = Math.max(0, (pdfCanvasW - 2 * iPDFSize) / pdfCanvasW);
            var pdfMaxYRel = Math.max(0, (pdfCanvasH - 2 * iPDFSize) / pdfCanvasH);
            var pdfInitX = Math.max(0, Math.min(pdfMaxXRel, 0.5 - iPDFSize / pdfCanvasW));
            var pdfInitY = Math.max(0, Math.min(pdfMaxYRel, 0.3 - iPDFSize / pdfCanvasH));

            var markup = {
                findingId: finding.id,
                displayId: finding.displayId,
                markupReference: finding.markupReference,
                description: finding.description,
                xaxis: pdfInitX, // top-left of bounding box (relative)
                yaxis: pdfInitY,
                shape: 2,
                size: iPDFSize,
                opacity: 1,
                embedInImage: embedInImage,
                hasPointer:   hasPointer,
                type: "Finding",
                pointerX: hasPointer ? 0.5 : null,
                pointerY: hasPointer ? 0.5 : null,
                label: finding.markupReference,
                additionalData: JSON.stringify({
                    createdAt: new Date().toISOString(),
                    createdBy: this.getLoggedInUserMail()
                }),
                isSaved:    false,
                isSelected: false
            };

            if (this._isInPDFMode) {
                markup.color = this._oPDFIntelliEditState.color || "#F44336";
                markup.pageId = this._pdfCurrentPage;
                markup.selectedItem = {
                    title: finding.displayId,
                    description: finding.description,
                    data: finding.rawData || { ID: finding.id }
                };
                this._getPDFPageMarkups(this._pdfCurrentPage).push(markup);
                this._pdfDirtyPages[this._pdfCurrentPage] = true;
                this._pdfRenderAllMarkups();
            } else {
                markup.color = this._oIntelliEditState.color || "#F44336";
                this._findingMarkups.push(markup);
                this._renderAllMarkups();
            }
        },

        /**
         * Render all markups for the current PDF page on top of last undo state
         */
        _pdfRenderAllMarkups: function () {
            if (!this._canvas || !this._ctx) return;

            var undoStack = this._oPDFIntelliEditState.undoStack;
            if (undoStack && undoStack.length > 0) {
                this._ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
            }

            this._getPDFPageMarkups(this._pdfCurrentPage).forEach(function (markup) {
                this._renderMarkup(markup);
            }.bind(this));
        },

        /**
         * Attach markup interaction handlers (select, drag, dblclick)
         */
        _attachPDFMarkupHandlers: function () {
            var that = this;

            this._canvas.addEventListener("mousedown", this._pdfMarkupMouseDown = function (e) { that._onPDFMarkupMouseDown(e); });
            this._canvas.addEventListener("mousemove", this._pdfMarkupMouseMove = function (e) { that._onPDFMarkupMouseMove(e); });
            this._canvas.addEventListener("mouseup",   this._pdfMarkupMouseUp   = function (e) { that._onPDFMarkupMouseUp(e); });
            this._canvas.addEventListener("dblclick",  this._pdfMarkupDblClick  = function (e) { that._onPDFMarkupDblClick(e); });
        },

        /**
         * Detach markup interaction handlers
         */
        _detachPDFMarkupHandlers: function () {
            if (!this._canvas) return;
            if (this._pdfMarkupMouseDown) this._canvas.removeEventListener("mousedown", this._pdfMarkupMouseDown);
            if (this._pdfMarkupMouseMove) this._canvas.removeEventListener("mousemove", this._pdfMarkupMouseMove);
            if (this._pdfMarkupMouseUp)   this._canvas.removeEventListener("mouseup",   this._pdfMarkupMouseUp);
            if (this._pdfMarkupDblClick)  this._canvas.removeEventListener("dblclick",  this._pdfMarkupDblClick);
        },

        /**
         * Mousedown — select markup or pointer, begin drag
         */
        _onPDFMarkupMouseDown: function (e) {
            if (this._oPDFIntelliEditState.activeTool === "TEXT" || this._oPDFIntelliEditState.activeTool === "BRUSH") return;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            var pos  = this._getCanvasCoordinates(e);
            var relX = pos.x / this._canvas.width;
            var relY = pos.y / this._canvas.height;

            var aMarkups = this._getPDFPageMarkups(this._pdfCurrentPage);
            var clickedMarkup  = this._findMarkupAtPositionInList(relX, relY, aMarkups);
            var clickedPointer = null;

            if (!clickedMarkup) {
                clickedPointer = this._findPointerAtPositionInList(relX, relY, aMarkups);
            }

            if (clickedMarkup) {
                if (clickedMarkup.embedInImage && clickedMarkup.isSaved) {
                    setTimeout(function(){
                        sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.embeddedMarkupCannotMove.text"), {
                            duration: 2000
                        });
                    },0);
                    return;
                }

                this._pdfActiveMarkup = clickedMarkup;
                aMarkups.forEach(function (m) { m.isSelected = false; });
                clickedMarkup.isSelected   = true;
                this._pdfIsDraggingMarkup  = true;
                this._pdfIsDraggingPointer = false;
                this._pdfDragOffset = {
                    x: relX - clickedMarkup.xaxis,
                    y: relY - clickedMarkup.yaxis
                };
                this._pdfRenderAllMarkups();

            } else if (clickedPointer) {
                if (clickedPointer.embedInImage && clickedPointer.isSaved) return;

                this._pdfActiveMarkup      = clickedPointer;
                this._pdfIsDraggingPointer = true;
                this._pdfIsDraggingMarkup  = false;
                this._pdfDragOffset = {
                    x: relX - clickedPointer.pointerX,
                    y: relY - clickedPointer.pointerY
                };
                this._pdfRenderAllMarkups();

            } else {
                aMarkups.forEach(function (m) { m.isSelected = false; });
                this._pdfActiveMarkup      = null;
                this._pdfIsDraggingMarkup  = false;
                this._pdfIsDraggingPointer = false;
                this._pdfRenderAllMarkups();
            }
        },

        /**
         * Mousemove — drag markup or pointer tip
         */
        _onPDFMarkupMouseMove: function (e) {
            if (!this._pdfActiveMarkup) return;

            var pos  = this._getCanvasCoordinates(e);
            var relX = pos.x / this._canvas.width;
            var relY = pos.y / this._canvas.height;

            if (this._pdfIsDraggingMarkup) {
                var pdfSize = this._pdfActiveMarkup.size * this._canvas.width / 200;
                var pdfMaxXRel = Math.max(0, (this._canvas.width  - 2 * pdfSize) / this._canvas.width);
                var pdfMaxYRel = Math.max(0, (this._canvas.height - 2 * pdfSize) / this._canvas.height);
                this._pdfActiveMarkup.xaxis = Math.max(0, Math.min(pdfMaxXRel, relX - this._pdfDragOffset.x));
                this._pdfActiveMarkup.yaxis = Math.max(0, Math.min(pdfMaxYRel, relY - this._pdfDragOffset.y));
                this._pdfDirtyPages[this._pdfCurrentPage] = true;
                this._pdfRenderAllMarkups();
            } else if (this._pdfIsDraggingPointer) {
                this._pdfActiveMarkup.pointerX = Math.max(0, Math.min(1, relX - this._pdfDragOffset.x));
                this._pdfActiveMarkup.pointerY = Math.max(0, Math.min(1, relY - this._pdfDragOffset.y));
                this._pdfDirtyPages[this._pdfCurrentPage] = true;
                this._pdfRenderAllMarkups();
            }
        },

        /**
         * Mouseup — end drag
         */
        _onPDFMarkupMouseUp: function () {
            this._pdfIsDraggingMarkup  = false;
            this._pdfIsDraggingPointer = false;
        },

        /**
         * Dblclick — open markup config dialog
         */
        _onPDFMarkupDblClick: function (e) {
            var pos  = this._getCanvasCoordinates(e);
            var relX = pos.x / this._canvas.width;
            var relY = pos.y / this._canvas.height;

            var aMarkups = this._getPDFPageMarkups(this._pdfCurrentPage);
            var clickedMarkup = this._findMarkupAtPositionInList(relX, relY, aMarkups);

            if (clickedMarkup) {
                this._isInPDFMode = true;
                this._openMarkupConfigDialog(clickedMarkup);
            }
        },

        /**
         * Hit-test against a given markup list
         */
        _findMarkupAtPositionInList: function (relX, relY, aMarkups) {
            var canvasWidth  = this._canvas.width;
            var canvasHeight = this._canvas.height;

            for (var i = aMarkups.length - 1; i >= 0; i--) {
                var markup = aMarkups[i];
                var absX = relX * canvasWidth;
                var absY = relY * canvasHeight;
                // xaxis/yaxis = top-left; derive center for hit testing
                var size = markup.size * canvasWidth / 200;
                var cx = markup.xaxis * canvasWidth  + size;
                var cy = markup.yaxis * canvasHeight + size;

                if (this._isPointInRhombus(absX, absY, cx, cy, size)) {
                    return markup;
                }
            }
            return null;
        },

        /**
         * Pointer tip hit-test against a given markup list
         */
        _findPointerAtPositionInList: function (relX, relY, aMarkups) {
            var canvasWidth  = this._canvas.width;
            var canvasHeight = this._canvas.height;

            for (var i = aMarkups.length - 1; i >= 0; i--) {
                var markup = aMarkups[i];
                if (!markup.hasPointer || markup.pointerX === null) continue;

                var absX = relX * canvasWidth;
                var absY = relY * canvasHeight;
                var pointerX = markup.pointerX * canvasWidth;
                var pointerY = markup.pointerY * canvasHeight;
                var distance = Math.sqrt(Math.pow(absX - pointerX, 2) + Math.pow(absY - pointerY, 2));

                if (distance <= 8) return markup;
            }
            return null;
        },

        /**
         * PDF undo
         */
        onPDFUndo: function () {
            if (this._oPDFIntelliEditState.undoStack.length > 1) {
                var currentState  = this._oPDFIntelliEditState.undoStack.pop();
                this._oPDFIntelliEditState.redoStack.push(currentState);
                var previousState = this._oPDFIntelliEditState.undoStack[this._oPDFIntelliEditState.undoStack.length - 1];
                this._ctx.putImageData(previousState, 0, 0);
                this._pdfRenderAllMarkups();
                this._updatePDFUndoRedoButtons();
            }
        },

        /**
         * PDF redo
         */
        onPDFRedo: function () {
            if (this._oPDFIntelliEditState.redoStack.length > 0) {
                var state = this._oPDFIntelliEditState.redoStack.pop();
                this._oPDFIntelliEditState.undoStack.push(state);
                this._ctx.putImageData(state, 0, 0);
                this._pdfRenderAllMarkups();
                this._updatePDFUndoRedoButtons();
            }
        },

        /**
         * Save — builds { pageNum: [markups] } payload from dirty pages only
         */
        onSavePDFIntelliEdit: function () {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            if (!this._canvas) {
                sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.noPDFLoaded.text"));
                return;
            }

            sap.m.MessageBox.confirm(oI18n.getText("asint.intelli.msg.savePDFConfirm.text"), {
                /**
                 * Function to handle press
                 */
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        that._bakePDFAndSave();
                    }
                }
            });
        },

        /**
         * save
         */
        _savePDFMarkups: function (oPDFBlob) {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var oCurrentDoc = this._currentPDFObj;
            var sLoggedInUser  = this.getLoggedInUserMail();
            var isOpenTextEnabled = this._featureFlagConfig.openTextEnabled === "1";

            var oObjectInfo = {
                "objectId": that._inspID,
                "objectType": that._app,
                "displayId": "",
                "createdAt": new Date().toISOString().replace("T", " ").replace("Z", ""),
                "createdBy": sLoggedInUser
            };

            Object.keys(this._pdfDirtyPages).forEach(function (sPage) {
                that._getPDFPageMarkups(parseInt(sPage, 10)).forEach(function (m) {
                    m.isSaved = true;
                });
            });

            var toPoints = [];
            Object.keys(this._pdfMarkups).forEach(function (sPage) {
                that._getPDFPageMarkups(parseInt(sPage, 10)).forEach(function (markup) {
                    toPoints.push({
                        xaxis: markup.xaxis,
                        yaxis: markup.yaxis,
                        color: that._colorToNumber(markup.color),
                        shape: markup.shape,
                        embedInImage:   markup.embedInImage,
                        size: markup.size,
                        opacity: markup.opacity,
                        type: markup.type,
                        hasPointer: markup.hasPointer,
                        pointerX: markup.pointerX,
                        pointerY: markup.pointerY,
                        label: parseInt(markup.label, 10),
                        additionalData: markup.additionalData,
                        finding_ID: markup.findingId || null,
                        pageId: markup.pageId !== undefined ? String(markup.pageId) : sPage
                    });
                });
            });

            var externalData = { DCL1: "", DCL2: "", DCL3: "" };
            if (isOpenTextEnabled && oCurrentDoc.externalData) {
                try {
                    var parsedExt = typeof oCurrentDoc.externalData === "string" ? JSON.parse(oCurrentDoc.externalData) : oCurrentDoc.externalData;
                    externalData = { DCL1: parsedExt.DCL1 || "", DCL2: parsedExt.DCL2 || "", DCL3: parsedExt.DCL3 || "" };
                } catch (e) {
                    // eslint-disable-next-line no-empty
                }
            }

            var oPayload = {
                originalDocId: oCurrentDoc.docId || oCurrentDoc.ID,
                tenantId: "AIS",
                category: this.categoryTextToKey(oCurrentDoc.category) || "",
                language: oCurrentDoc.language || "English",
                source: isOpenTextEnabled ? "OT" : "ASINT",
                phase: this.getKeysFromPhaseString(oCurrentDoc.phase) || "",
                confidentiality: oCurrentDoc.confidentiality || "0",
                deleted: false,
                createdBy: oCurrentDoc.createdBy || sLoggedInUser,
                modifiedBy: sLoggedInUser,
                externalData: JSON.stringify(externalData),
                documentDate: isOpenTextEnabled ? (oCurrentDoc.documentDate || new Date().toISOString()) : null,
                to_file: {
                    type: "application/pdf",
                    name: that.fnGenerateUniqueName(oCurrentDoc.fileName || oCurrentDoc.documentName),
                    size: oPDFBlob.size,
                    file: oPDFBlob,
                    version: (oCurrentDoc.version || 0) + 1,
                    deleted: false
                },
                to_points: toPoints
            };

            that.datasource.updateDocData(oPayload, function (oResponse) {
                var table = that.oTable;
                var model = table.getModel();
                var inspPay = model.getProperty("/data/documents/assessmentInfo");

                if (!inspPay || !inspPay.ID) {
                    sap.m.MessageToast.show(oI18n.getText("asint.intelli.msg.pdfSavedNoParent.text"));
                    that.onClosePDFIntelliEdit();
                    that.attachDocumentToTable();
                    return;
                }

                var newDocumentId = oResponse.ID;
                var newDocInfo = {};

                if (that._app === "FLOC") {
                    newDocInfo = { 
                        location_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "ASD" || that._app === "INSP") {
                    newDocInfo = { 
                        assessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "EQUI") {
                    newDocInfo = { 
                        equipment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                    newDocInfo = { 
                        recommendation_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "MO") {
                    newDocInfo = { 
                        maintenanceOrderMaster_ID: inspPay.ID,
                        attachments_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "TASK_MANAGEMENT") {
                    newDocInfo = { 
                        generalTask_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "MSP") {
                    newDocInfo = { 
                        maintenanceSpendPlan_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "FINDINGS") {
                    newDocInfo = { 
                        findings_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "RCA") {
                    newDocInfo = { 
                        rcAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "MPOT") {
                    newDocInfo = { 
                        optimisationAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "RCM") {
                    newDocInfo = { 
                        rcmAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "FLEET") {
                    newDocInfo = { 
                        classStrategyAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "RCaA") {
                    newDocInfo = { 
                        rootCauseAnalysis_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "HAZOP") {
                    newDocInfo = { 
                        hazopAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                } else if (that._app === "SIL") {
                    newDocInfo = { 
                        safetyAssessment_ID: inspPay.ID,
                        document_ID: newDocumentId,
                        deleted: false 
                    };
                }

                var inspPayload = {
                    ID: inspPay.ID,
                    category: inspPay.category,
                    createdAt: inspPay.createdAt,
                    createdBy: inspPay.createdBy,
                    deleted: inspPay.deleted,
                    modifiedAt: inspPay.modifiedAt,
                    modifiedBy: sLoggedInUser,
                    status: inspPay.status,
                    objectType: inspPay.objectType,
                    displayId: inspPay.displayId,
                    "@etag": inspPay["@etag"]
                };
                var to_documents = [newDocInfo];
                var docIds = model.getProperty("/data/documents/attachDocumentsList");
                if (docIds && docIds.length > 0) {
                    docIds.forEach(function (doc) {
                        var extractedObject = {};
                        var assessment_ID = doc.assessment_ID;
                        var document_ID = doc.document_ID;
                        var deleted = doc.deleted;

                        if (that._app === "FLOC") {
                            extractedObject = { 
                                location_ID: doc.location_ID || assessment_ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "ASD" || that._app === "INSP") {
                            extractedObject = { 
                                assessment_ID: assessment_ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "EQUI") {
                            extractedObject = { 
                                equipment_ID: doc.equipment_ID || assessment_ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (["AIS_RECO", "APM_RECO"].includes(that._app)) {
                            extractedObject = { 
                                recommendation_ID: doc.recommendation_ID || assessment_ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "MO") {
                            extractedObject = { 
                                maintenanceOrderMaster_ID: doc.maintenanceOrderMaster_ID || assessment_ID,
                                attachments_ID: doc.attachments_ID || document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "TASK_MANAGEMENT") {
                            extractedObject = { 
                                generalTask_ID: doc.generalTask_ID || assessment_ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "MSP") {
                            extractedObject = { 
                                maintenanceSpendPlan_ID: doc.maintenanceSpendPlan_ID || assessment_ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "FINDINGS") {
                            extractedObject = { 
                                findings_ID: doc.findings_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "RCA") {
                            extractedObject = { 
                                rcAssessment_ID: doc.rcAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "MPOT") {
                            extractedObject = { 
                                optimisationAssessment_ID: doc.optimisationAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "RCM") {
                            extractedObject = { 
                                rcmAssessment_ID: doc.rcmAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "FLEET") {
                            extractedObject = { 
                                classStrategyAssessment_ID: doc.classStrategyAssessment_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "RCaA") {
                            extractedObject = { 
                                rootCauseAnalysis_ID: doc.rootCauseAnalysis_ID || inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "HAZOP") {
                            extractedObject = { 
                                hazopAssessment_ID: inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        } else if (that._app === "SIL") {
                            extractedObject = { 
                                safetyAssessment_ID: inspPay.ID,
                                document_ID: document_ID,
                                deleted: deleted
                            };
                        }
                        to_documents.push(extractedObject);
                    });
                }

                if (that._app === "MO") {
                    inspPayload.to_attachments = to_documents;
                } else {
                    inspPayload.to_documents = to_documents;
                }

                that.datasource.attachTempToDocument(inspPayload, inspPay.ID, inspPay["@etag"], that._app, function (oResult) {
                    inspPay["@etag"] = oResult["@etag"];
                    model.setProperty("/data/documents/assessmentInfo", inspPay);
                    sap.m.MessageToast.show("PDF markups saved successfully");
                    that.onClosePDFIntelliEdit();
                    that.attachDocumentToTable();
                }, function () {
                    that.fnMessageShow("E", "PDF saved but failed to attach to parent record");
                    that.onClosePDFIntelliEdit();
                    that.attachDocumentToTable();
                });

            }, function () {
                that.fnMessageShow("E", "Failed to save PDF markups");
                if (that._oPDFIntelliEditDialog) {
                    that._oPDFIntelliEditDialog.setBusy(false);
                }
            }, isOpenTextEnabled, oObjectInfo);
        },

        /**
         * Entry point for baking — loads pdf-lib then starts page processing
         */
        _bakePDFAndSave: function () {
            var that = this;

            if (this._oPDFIntelliEditDialog) {
                this._oPDFIntelliEditDialog.setBusy(true);
                this._oPDFIntelliEditDialog.setBusyIndicatorDelay(0);
            }

            Object.keys(this._pdfMarkups).forEach(function (sPage) {
                that._getPDFPageMarkups(parseInt(sPage, 10)).forEach(function (markup) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (markup.hasOwnProperty("pendingEmbedInImage")) {
                        markup.embedInImage = markup.pendingEmbedInImage;
                        delete markup.pendingEmbedInImage;
                    }
                });
            });

            if (!window.PDFLib) {
                var script    = document.createElement("script");
                script.src    = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
                script.onload = function () { that._bakeAllPages(); };
                script.onerror = function () {
                    sap.m.MessageToast.show("Failed to load pdf-lib");
                    if (that._oPDFIntelliEditDialog) that._oPDFIntelliEditDialog.setBusy(false);
                };
                document.head.appendChild(script);
            } else {
                this._bakeAllPages();
            }
        },

        /**
         * Renders each page on an offscreen canvas, bakes embedInImage markups + doodles,
         * captures PNG per page
         */
        _bakeAllPages: function () {
            var that = this;
            var iTotalPages = this._pdfTotalPages;
            var aPageImages = [];
            var iPage = 1;

            /**
             * function to process page
             */
            function processPage() {
                if (iPage > iTotalPages) {
                    that._stitchPagesToPDF(aPageImages);
                    return;
                }

                that._pdfDoc.getPage(iPage).then(function (page) {
                    var viewportOriginal = page.getViewport({ scale: 1.0 });
                    var viewport = page.getViewport({ scale: 1.5 });
                    var offCanvas = document.createElement("canvas");
                    offCanvas.width = viewport.width;
                    offCanvas.height = viewport.height;
                    var offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

                    page.render({ canvasContext: offCtx, viewport: viewport }).promise.then(function () {
                        if (iPage === that._pdfCurrentPage && that._oPDFIntelliEditState.undoStack.length > 0) {
                            var liveSnap = that._oPDFIntelliEditState.undoStack[that._oPDFIntelliEditState.undoStack.length - 1];
                            offCtx.putImageData(liveSnap, 0, 0);
                        } else if (iPage !== that._pdfCurrentPage && that._pdfPageSnapshots[iPage]){
                            offCtx.putImageData(that._pdfPageSnapshots[iPage], 0, 0)
                        }

                        var origCanvas = that._canvas;
                        var origCtx = that._ctx;
                        that._canvas = offCanvas;
                        that._ctx = offCtx;

                        that._getPDFPageMarkups(iPage).forEach(function (markup) {
                            if (markup.embedInImage === true) {
                                that._renderMarkup(markup);
                            }
                        });

                        that._canvas = origCanvas;
                        that._ctx = origCtx;

                        aPageImages.push({
                            dataUrl: offCanvas.toDataURL("image/png"),
                            width: viewportOriginal.width,
                            height: viewportOriginal.height
                        });

                        iPage++;
                        processPage();
                    });
                });
            }

            processPage();
        },

        /**
         * Stitches all captured page PNGs into a single PDF blob via pdf-lib
         */
        _stitchPagesToPDF: function (aPageImages) {
            var that = this;

            window.PDFLib.PDFDocument.create().then(function (pdfDoc) {
                var aEmbedPromises = aPageImages.map(function (oPage) {
                    var base64 = oPage.dataUrl.split(",")[1];
                    return pdfDoc.embedPng(base64).then(function (pngImage) {
                        return { image: pngImage, width: oPage.width, height: oPage.height };
                    });
                });

                Promise.all(aEmbedPromises).then(function (aEmbedded) {
                    aEmbedded.forEach(function (oEmbed) {
                        var page = pdfDoc.addPage([oEmbed.width, oEmbed.height]);
                        page.drawImage(oEmbed.image, { x: 0, y: 0, width: oEmbed.width, height: oEmbed.height });
                    });

                    pdfDoc.save().then(function (pdfBytes) {
                        var blob = new Blob([pdfBytes], { type: "application/pdf" });
                        that._savePDFMarkups(blob);
                    });
                });
            //eslint-disable-next-line no-unused-vars
            }).catch(function (err) {
                sap.m.MessageToast.show("Failed to generate PDF");
                if (that._oPDFIntelliEditDialog) that._oPDFIntelliEditDialog.setBusy(false);
            });
        },


        /**
         * Close PDF IntelliEdit — clean up all state
         */
        onClosePDFIntelliEdit: function () {
            this._detachPDFCanvasHandlers();
            this._detachPDFMarkupHandlers();

            if (this._oPDFIntelliEditDialog) {
                this._oPDFIntelliEditDialog.setBusy(false);
                this._oPDFIntelliEditDialog.close();
            }

            this._canvas = null;
            this._canvasBaseWidth  = null;
            this._canvasBaseHeight = null;
            this._ctx = null;
            this._pdfDoc = null;
            this._isInPDFMode = false;
            this._currentSessionFindingsCache = null;

            this._oPDFIntelliEditState = {
                activeTool: null,
                color: "#F44336",
                size: 12,
                undoStack:  [],
                redoStack:  [],
                isDrawing:  false,
                zoomLevel:  1.0
            };

            this._initializePDFMarkupState();
        },

        /**
         * Function to delete markup
         */
        _deletePDFMarkup: function (markup) {
            var aMarkups = this._getPDFPageMarkups(this._pdfCurrentPage);
            var index    = aMarkups.indexOf(markup);
            if (index > -1) {
                aMarkups.splice(index, 1);
                this._pdfDirtyPages[this._pdfCurrentPage] = true;
                this._pdfRenderAllMarkups();
                sap.m.MessageToast.show("Markup deleted");
            }
        },

        // PDF INTELLIVIEW

        /**
         * Opens the PDF IntelliView dialog (read-only)
         */
        onOpenPDFIntelliView: function () {
            var that = this;

            var aSelectedItems = that.oTable.getSelectedItems();
            if (!aSelectedItems.length) {
                sap.m.MessageToast.show("Please select a PDF to view");
                return;
            }

            var oSelectedObj = aSelectedItems[0].getBindingContext().getObject();

            if (!oSelectedObj.type || oSelectedObj.type.indexOf("application/pdf") !== 0) {
                sap.m.MessageToast.show("Please select a PDF file");
                return;
            }

            that._fetchOpenTextContent(oSelectedObj, function (sPdfSrc) {
                if (!sPdfSrc) {
                    sap.m.MessageToast.show("PDF preview not available");
                    return;
                }

                that._oPDFViewState = { zoomLevel: 1.0 };

                if (!that._oPDFIntelliViewDialog) {
                    Fragment.load({
                        id: "idIntelliViewPDFDialog",
                        name: "com.asint.ais.library.fragment.IntelliViewPDF",
                        controller: that
                    }).then(function (oDialog) {
                        that._oPDFIntelliViewDialog = oDialog;
                        that._oPDFIntelliViewDialog.addStyleClass("sapUiSizeCompact");
                        that._oPDFIntelliViewDialog.setModel(that._i18n, "i18n");
                        that._oPDFIntelliViewDialog.open();
                        that._initializePDFView(sPdfSrc, oSelectedObj);
                    });
                } else {
                    that._oPDFIntelliViewDialog.open();
                    that._initializePDFView(sPdfSrc, oSelectedObj);
                }
            });
        },

        /**
         * Load and render the PDF for viewing (read-only)
         */
        _initializePDFView: function (sPdfSrc, oPdfObj) {
            var that = this;

            this._currentPDFViewObj  = oPdfObj;
            this._pdfViewCurrentPage = 1;
            this._pdfViewTotalPages  = 0;
            this._pdfViewDoc = null;
            this._pdfViewMarkups = this._parsePDFMarkups(oPdfObj);
            this._isViewMode = true;

            var oCanvasHostEarly = sap.ui.core.Fragment.byId("idIntelliViewPDFDialog", "idPDFViewCanvasHost");
            if (oCanvasHostEarly) { oCanvasHostEarly.setContent(""); }

            this._loadPDFJS(function () {
                var pdfjsLib = window["pdfjs-dist/build/pdf"];
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                try {
                    // pdfjsLib.getDocument({ data: that._decodePDFBase64(sPdfSrc) }).promise
                    pdfjsLib.getDocument(sPdfSrc.startsWith("http") ? { url: sPdfSrc } : { data: that._decodePDFBase64(sPdfSrc) }).promise
                        .then(function (pdfDoc) {
                            that._pdfViewDoc = pdfDoc;
                            that._pdfViewTotalPages  = pdfDoc.numPages;
                            that._pdfViewCurrentPage = 1;
                            that._updatePDFViewPageControls();
                            that._renderPDFViewPage(that._pdfViewCurrentPage);
                        })
                        .catch(function () {
                            if (that._oPDFIntelliViewDialog) { that._oPDFIntelliViewDialog.setBusy(false); }
                            sap.m.MessageToast.show("Failed to load PDF");
                        });
                } catch (e) {
                    if (that._oPDFIntelliViewDialog) { that._oPDFIntelliViewDialog.setBusy(false); }
                    sap.m.MessageToast.show("Failed to decode PDF");
                }
            });
        },

        /**
         * Render a specific page onto the view canvas, then draw markups on top
         */
        _renderPDFViewPage: function (iPage) {
            var that = this;

            this._pdfViewDoc.getPage(iPage).then(function (page) {
                // var viewportOriginal = page.getViewport({ scale: 1.0 });
                var viewport = page.getViewport({ scale: 1.5 });

                /* eslint-disable quotes */
                var sCanvasHTML = '<canvas id="pdfIntelliViewCanvas"' +
                    ' width="' + viewport.width + '"' +
                    ' height="' + viewport.height + '"' +
                    ' style="max-width:100%; height:auto; cursor:default; border:1px solid #ccc;">' +
                    '</canvas>';
                /* eslint-disable quotes */

                var oCanvasHost = sap.ui.core.Fragment.byId("idIntelliViewPDFDialog", "idPDFViewCanvasHost");
                if (!oCanvasHost) return;

                oCanvasHost.setContent(sCanvasHTML);

                var maxHeight  = window.innerHeight * 0.7;
                var finalWidth = Math.max(viewport.width + 60, 980);
                that._oPDFIntelliViewDialog.setContentWidth(finalWidth + "px");
                that._oPDFIntelliViewDialog.setContentHeight(Math.min(viewport.height + 220, maxHeight) + "px");

                setTimeout(function () {
                    var canvas = document.getElementById("pdfIntelliViewCanvas");
                    if (!canvas) {
                        if (that._oPDFIntelliViewDialog) { that._oPDFIntelliViewDialog.setBusy(false); }
                        sap.m.MessageToast.show("Failed to initialize PDF viewer");
                        return;
                    }

                    that._pdfViewCanvas = canvas;
                    that._pdfViewCtx    = canvas.getContext("2d", { willReadFrequently: true });

                    page.render({ canvasContext: that._pdfViewCtx, viewport: viewport }).promise.then(function () {
                        that._pdfViewCtx.clearRect(0, 0, that._pdfViewCanvas.width, that._pdfViewCanvas.height);
                        page.render({ canvasContext: that._pdfViewCtx, viewport: viewport }).promise.then(function () {
                            var aMarkups = that._pdfViewMarkups[that._pdfViewCurrentPage] || [];

                            aMarkups.forEach(function (markup) {
                                that._renderMarkup(markup, that._pdfViewCanvas, that._pdfViewCtx);
                            });

                            that._applyCanvasZoom(that._pdfViewCanvas, that._oPDFViewState.zoomLevel);
                            that._attachPDFViewDblClickHandler();
                            if (that._oPDFIntelliViewDialog) { that._oPDFIntelliViewDialog.setBusy(false); }
                        });
                    });
                }, 100);
            });
        },

        /**
         * Attach dblclick so user can inspect markup details (read-only, no editing)
         */
        _attachPDFViewDblClickHandler: function () {
            var that = this;

            if (this._pdfViewDblClickHandler) {
                this._pdfViewCanvas.removeEventListener("dblclick", this._pdfViewDblClickHandler);
            }

            this._pdfViewDblClickHandler = function (e) {
                var rect = that._pdfViewCanvas.getBoundingClientRect();
                var scaleX = that._pdfViewCanvas.width  / rect.width;
                var scaleY = that._pdfViewCanvas.height / rect.height;
                var relX = ((e.clientX - rect.left) * scaleX) / that._pdfViewCanvas.width;
                var relY = ((e.clientY - rect.top)  * scaleY) / that._pdfViewCanvas.height;

                var aMarkups = that._pdfViewMarkups[that._pdfViewCurrentPage] || [];

                var oPrevCanvas = that._canvas;
                that._canvas = that._pdfViewCanvas;
                var clickedMarkup = that._findMarkupAtPositionInList(relX, relY, aMarkups);
                that._canvas = oPrevCanvas;

                if (clickedMarkup) {
                    that._openMarkupConfigDialog(clickedMarkup);
                }
            };

            this._pdfViewCanvas.addEventListener("dblclick", this._pdfViewDblClickHandler);
        },

        /**
         * Update view dialog page indicator and prev/next buttons
         */
        _updatePDFViewPageControls: function () {
            this._updatePageControls("idIntelliViewPDFDialog","idPDFViewPageIndicator", "idPDFViewPrevPageBtn", "idPDFViewNextPageBtn",this._pdfViewCurrentPage, this._pdfViewTotalPages);
        },

        /**
         * Navigate to previous page (view mode)
         */
        onPDFViewPrevPage: function () {
            if (this._pdfViewCurrentPage <= 1) return;
            this._pdfViewCurrentPage--;
            this._updatePDFViewPageControls();
            this._renderPDFViewPage(this._pdfViewCurrentPage);
        },

        /**
         * Navigate to next page (view mode)
         */
        onPDFViewNextPage: function () {
            if (this._pdfViewCurrentPage >= this._pdfViewTotalPages) return;
            this._pdfViewCurrentPage++;
            this._updatePDFViewPageControls();
            this._renderPDFViewPage(this._pdfViewCurrentPage);
        },

        /**
         * Close PDF IntelliView — clean up all view state
         */
        onClosePDFIntelliView: function () {
            if (this._pdfViewDblClickHandler && this._pdfViewCanvas) {
                this._pdfViewCanvas.removeEventListener("dblclick", this._pdfViewDblClickHandler);
                this._pdfViewDblClickHandler = null;
            }

            if (this._oPDFIntelliViewDialog) {
                this._oPDFIntelliViewDialog.close();
            }

            this._pdfViewCanvas = null;
            this._pdfViewCtx = null;
            this._pdfViewDoc = null;
            this._pdfViewMarkups = {};
            this._pdfViewCurrentPage = 1;
            this._pdfViewTotalPages = 0;
            this._currentPDFViewObj = null;
            this._oPDFViewState = { zoomLevel: 1.0 };
            this._isViewMode = false; 
        },


        /**
         *
         */
        _applyCanvasZoom: function (oCanvas, fZoom) {
            if (!oCanvas) return;

            oCanvas.style.transform = "";
            oCanvas.style.transformOrigin = "";
            oCanvas.style.marginBottom = "";
            oCanvas.style.maxWidth = "";
            oCanvas.style.height = "";

            var nativeW = oCanvas.width;
            var nativeH = oCanvas.height;

            var scaledW = Math.round(nativeW * fZoom);
            var scaledH = Math.round(nativeH * fZoom);

            oCanvas.style.width  = scaledW + "px";
            oCanvas.style.height = scaledH + "px";

            var oScrollEl = oCanvas.closest(".intelliEditCanvasWrapper, .intelliViewCanvasWrapper");
            var oVBoxEl   = oCanvas.closest(".imageContainer");

            if (oScrollEl && oVBoxEl) {
                var scrollW = oScrollEl.clientWidth;
                if (scaledW > scrollW) {
                    oVBoxEl.style.alignItems  = "flex-start";
                    oVBoxEl.style.justifyContent = "flex-start";
                } else {
                    oVBoxEl.style.alignItems  = "";
                    oVBoxEl.style.justifyContent = "";
                }
            }
        },

        /**
         * Zoom in — IntelliEdit PDF  (press="onPDFZoomIn")
         */
        onPDFZoomIn: function () {
            var oState = this._oPDFIntelliEditState;
            if (!oState) return;
            oState.zoomLevel = parseFloat(Math.min(4.0, oState.zoomLevel + 0.25).toFixed(2));
            this._applyCanvasZoom(this._canvas, oState.zoomLevel);
        },

        /**
         * Zoom out — IntelliEdit PDF  (press="onPDFZoomOut")
         */
        onPDFZoomOut: function () {
            var oState = this._oPDFIntelliEditState;
            if (!oState) return;
            oState.zoomLevel = parseFloat(Math.max(0.25, oState.zoomLevel - 0.25).toFixed(2));
            this._applyCanvasZoom(this._canvas, oState.zoomLevel);
        },

        /**
         * Reset zoom — IntelliEdit PDF  (press="onPDFEditResetZoom")
         */
        onPDFEditResetZoom: function () {
            var oState = this._oPDFIntelliEditState;
            if (!oState) return;
            oState.zoomLevel = 1.0;
            this._applyCanvasZoom(this._canvas, oState.zoomLevel);
        },

        /**
         * Zoom in — IntelliView PDF  (press="onPDFViewZoomIn")
         */
        onPDFViewZoomIn: function () {
            var oState = this._oPDFViewState;
            if (!oState) return;
            oState.zoomLevel = parseFloat(Math.min(4.0, oState.zoomLevel + 0.25).toFixed(2));
            this._applyCanvasZoom(this._pdfViewCanvas, oState.zoomLevel);
        },

        /**
         * Zoom out — IntelliView PDF  (press="onPDFViewZoomOut")
         */
        onPDFViewZoomOut: function () {
            var oState = this._oPDFViewState;
            if (!oState) return;
            oState.zoomLevel = parseFloat(Math.max(0.25, oState.zoomLevel - 0.25).toFixed(2));
            this._applyCanvasZoom(this._pdfViewCanvas, oState.zoomLevel);
        },

        /**
         * Reset zoom — IntelliView PDF  (press="onPDFResetZoom")
         */
        onPDFResetZoom: function () {
            var oState = this._oPDFViewState;
            if (!oState) return;
            oState.zoomLevel = 1.0;
            this._applyCanvasZoom(this._pdfViewCanvas, oState.zoomLevel);
        },
    });
});