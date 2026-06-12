/* eslint-disable require-jsdoc */
/* eslint-disable no-redeclare */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-empty */
sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/p13n/Engine",
    "sap/m/p13n/SelectionController",
    "sap/m/p13n/SortController",
    "sap/m/p13n/GroupController",
    "sap/m/p13n/MetadataHelper",
    "sap/ui/core/CustomData",
    // "sap/m/table/ColumnWidthController",
    // "sap/m/ColumnListItem",
    // "sap/m/Text",
    // "sap/ui/core/library",
    "sap/ui/fl/variants/VariantManagement",
    "sap/ui/model/Sorter",
    // "sap/m/ObjectIdentifier",
    // "sap/m/ObjectStatus",
    "sap/m/ToolbarSeparator",
    // "sap/ui/core/dnd/DragDropInfo",
    // "sap/m/plugins/ColumnResizer",
    // "sap/m/table/columnmenu/Menu",
    // "sap/m/table/columnmenu/QuickSort",
    // "sap/m/table/columnmenu/QuickGroup",
    // "sap/m/table/columnmenu/ActionItem",
    // "sap/m/table/columnmenu/QuickSortItem",
    // "sap/m/table/columnmenu/QuickGroupItem",
    // "sap/m/p13n/FilterController",
    // "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter"
], function (BaseObject, Engine, SelectionController, SortController, GroupController, MetadataHelper, CustomData,
    // ColumnWidthController, ColumnListItem, Text, CoreLibrary, 
    VariantManagement, Sorter,
    // ObjectIdentifier, ObjectStatus, 
    ToolbarSeparator
    // DragDropInfo, ColumnResizer, ColumnMenu, ColumnQuickSort, ColumnQuickGroup, ColumnActionItem, ColumnQuickSortItem, ColumnQuickGroupItem, FilterController
) {

    // Note: While upgrading version change do getInstance for Engine
    // Eg) Engine.getInstance()

    var Helper = BaseObject.extend("com.asint.ais.library.utils.TableP13nEngineHelper", {

        config: {},
        controller: null,
        metadataHelper: {},

        table: null,
        settingButton: null,

        isHideSort : false,
        isHideGroup : false,

        registerFor: [],
        columnListItemPress: function () { },
        onDataReceived: function () { },

        /**
         * Set controller and config
         * @param {object} oController 
         * @param {object} oConfig 
         * @param {array} aTable 
         */
        constructor: function (oConfig, oController, aTable) {

            this.config = oConfig;

            if (aTable && aTable.length) {
                this.registerFor = aTable;
            }
            //Sample oConfig
            //
            // {
            //     "controlId": {
            //         "table": "idInspectionListMTable", // Mandatory
            //         "settingButton": "idTableP13nSettings"
            //     },
            //     "event": {
            //         "columnListItemPress": this.onNavToDetail,  // Mandatory
            //         "onDataReceived": this.onDataReceived // Mandatory
            //     },
            //     "settings": {}
            // }

            if (oConfig && oConfig.event) {
                if (oConfig.event.columnListItemPress) {
                    this.columnListItemPress = oConfig.event.columnListItemPress;
                }
                if (oConfig.event.onDataReceived) {
                    this.onDataReceived = oConfig.event.onDataReceived;
                }
            }
            if (oController) {
                this.controller = oController;
            }
            if(oConfig && oConfig.settings){
                if(oConfig.settings.hideSort){
                    this.isHideSort = true;
                }
                if(oConfig.settings.hideGroup){
                    this.isHideGroup = true;
                }
            }
            this._fnCreateControlsAndRegisterEvents();
            this._fnRegisterEngine();

        },
        /**
         * open settings dialog
         * @param {object} oEvent 
         */
        open: function (oEvent) {

            this.onSettingsPress(oEvent);

        },
        /**
         * Function to get control id.
         * @param {string} sControlId 
         */
        _fnGetControlById: function (sControlId) {

            var oControl;

            if (sControlId) {
                try {
                    oControl = this.controller.getView().byId(sControlId);
                } catch (error) {

                }
            }

            return oControl;

        },
        /**
         * Function to get localid.
         * @param {object} oControl 
         */
        _fnGetLocalId: function (oControl) {

            return this.controller.getView().getLocalId(oControl.getId());

        },

        /**
         * create control
         */
        _fnCreateControlsAndRegisterEvents: function () {

            var that = this.controller;
            var oConfig = this.config;
            var oControlId = oConfig.controlId;

            if (oControlId.table && this._fnGetControlById(oControlId.table)) {

                this.table = this._fnGetControlById(oControlId.table);
                this.table.addCustomData(new CustomData({
                    key: "sap-ui-custom-settings",
                    value: {
                        "sap.ui.fl": {
                            "flexibility": "sap/m/flexibility/EngineFlex"
                        }
                    }
                }));
                // this.dragDropInfo = new DragDropInfo({
                //     id: that.createId("idTableP13nDragDropInfo"),
                //     sourceAggregation: "columns",
                //     targetAggregation: "columns",
                //     dropPosition: "Between",
                //     drop: this.onColumnMove.bind(this)
                // });
                // this.columnResizer = new ColumnResizer({
                //     id: that.createId("idTableP13nColumnResizer"),
                //     columnResize: this.onColumnResize.bind(this)
                // });
                // this.columnMenuQuickSort = new ColumnQuickSort({
                //     id: that.createId("idTableP13nColumnMenuQuickSort"),
                //     items: [
                //         new ColumnQuickSortItem()
                //     ],
                //     change: this.onSort.bind(this)
                // });
                // this.columnMenuQuickGroup = new ColumnQuickGroup({
                //     id: that.createId("idTableP13nColumnMenuQuickGroup"),
                //     items: [
                //         new ColumnQuickGroupItem()
                //     ],
                //     change: this.onGroup.bind(this)
                // });
                // this.columnMenu = new ColumnMenu({
                //     id: that.createId("idTableP13nColumnMenu"),
                //     beforeOpen: this.onBeforeOpenColumnMenu.bind(this)
                // });
                // this.columnMenu.addQuickAction(this.columnMenuQuickSort);
                // this.columnMenu.addQuickAction(this.columnMenuQuickGroup);
                // this.columnMenuActionItem1 = new ColumnActionItem({
                //     id: that.createId("idTableP13nColumnMenuActionItem1"),
                //     icon: "sap-icon://sort",
                //     label: "Sort",
                //     press: this.onColumnHeaderItemPress.bind(this)
                // });
                // this.columnMenuActionItem2 = new ColumnActionItem({
                //     id: that.createId("idTableP13nColumnMenuActionItem2"),
                //     icon: "sap-icon://group-2",
                //     label: "Group",
                //     press: this.onColumnHeaderItemPress.bind(this)
                // });
                // this.columnMenuActionItem3 = new ColumnActionItem({
                //     id: that.createId("idTableP13nColumnMenuActionItem3"),
                //     icon: "sap-icon://table-column",
                //     label: "Columns",
                //     press: this.onColumnHeaderItemPress.bind(this)
                // });
                // this.columnMenu.addItem(this.columnMenuActionItem1);
                // this.columnMenu.addItem(this.columnMenuActionItem2);
                // this.columnMenu.addItem(this.columnMenuActionItem3);

                // this.table.addDragDropConfig(this.dragDropInfo);
                // this.table.addDependent(this.columnResizer);
                // this.table.addDependent(this.columnMenu);

                if (oConfig.settings && oConfig.settings.enableVariantManagement) {
                    this.variantManagement = new VariantManagement({
                        id: that.createId(this.table.getId() + "--idTableVariantMgmt"),
                        for: this.table.getId()
                    });
                    this.table.getHeaderToolbar().insertContent(new ToolbarSeparator(), 1);
                    this.table.getHeaderToolbar().insertContent(this.variantManagement, 2);
                }

            }
            if (oControlId.settingButton && this._fnGetControlById(oControlId.settingButton)) {
                this.settingButton = this._fnGetControlById(oControlId.settingButton);
                this.settingButton.attachPress(this.onSettingsPress.bind(this));
            }

        },

        /**
         * Validate window 
         */
        _fnValidateP13nWinVar: function () {

            return window.com.asint.ais && window.com.asint.ais.utils && window.com.asint.ais.utils.p13n;

        },
        /**
         * Return view
         */
        _fnGetP13nView: function () {

            return this._fnValidateP13nWinVar() ? window.com.asint.ais.utils.p13n.view : "";

        },

        /**
         * 
         * @param {string} sView 
         */
        _fnSetP13nView: function (sView) {

            if (this._fnValidateP13nWinVar()) {
                window.com.asint.ais.utils.p13n.view = sView;
            }

        },
        /**
         * Retrives register window
         */
        _fnGetP13nRegisterFor: function () {

            return this._fnValidateP13nWinVar() ? window.com.asint.ais.utils.p13n.registeredFor : "";

        },

        /**
         * Set register window
         * @param {array} aRegisteredFor 
         */
        _fnSetP13nRegisterFor: function (aRegisteredFor) {

            if (this._fnValidateP13nWinVar()) {
                window.com.asint.ais.utils.p13n.registeredFor = aRegisteredFor;
            }

        },

        /**
         * 
         * @param {string} sTableId 
         */
        _fnAddP13nRegisterFor: function (sTableId) {

            if (this._fnValidateP13nWinVar() && !window.com.asint.ais.utils.p13n.registeredFor.includes(sTableId)) {
                window.com.asint.ais.utils.p13n.registeredFor.push(sTableId);
            }

        },

        /**
         * Register function
         */
        _fnRegisterEngine: function () {

            var that = this.controller;
            var oTable = this.table;
            var sViewId = that.getView().getId();
            var sTableId = this.config.controlId.table;
            var aColumnMetadata = [];

            var aColumn = oTable.getColumns();
            var aSorter = [];

            var oI18n = that.getView().getModel("i18n").getResourceBundle();

            for (var i in aColumn) {
                var oColumn = aColumn[i];
                var oP13nSettings = oColumn.data("p13nSettings");
                var sForceHide = oColumn.data("forceHide");

                if (oP13nSettings) {
                    var oMetadata = oP13nSettings.metadata || {};
                    var bCustomField = oMetadata.fields && oMetadata.fields.length > 0;
                    var oTemp = {
                        key: this._fnGetLocalId(oColumn),
                        // key: oColumn.getId(),
                        path: oMetadata.path,
                        control: oMetadata.control,
                        value1: oMetadata.value1,
                        value2: oMetadata.value2,
                        sortable: !bCustomField,
                        groupable: !bCustomField
                    };

                    if (oTable.getMetadata().getName().includes("TreeTable")) {
                        if (oColumn.getLabel().getText() === "") {
                            oTemp["label"] = oI18n.getText(oColumn.getLabel().getBindingInfo("text").parts[0].path);
                        } else {
                            oTemp["label"] = oColumn.getLabel().getText();
                        }
                    } else {
                        oTemp["label"] = oColumn.getHeader().getText();
                    }

                    if (!sForceHide || sForceHide === "false" || sForceHide === "0") {
                        aColumnMetadata.push(oTemp);
                    }

                    if (bCustomField) {
                        for (var j in oMetadata.fields) {
                            aColumnMetadata.push({
                                key: this._fnGetLocalId(oColumn) + "_" + oMetadata.fields[j].path,
                                // key: oColumn.getId(),
                                label: oI18n.getText(oMetadata.fields[j].i18n),
                                path: oMetadata.fields[j].path,
                                control: oMetadata.control,
                                value1: oMetadata.fields[j].path,
                                value2: "",
                                visible: false,
                                sortable: oMetadata.fields[j].sortable,
                                groupable: oMetadata.fields[j].groupable
                            });
                        }
                    }
                    // oColumn.setHeaderMenu(this.columnMenu.getId());
                    if (oMetadata.sort) {
                        var sSorterKey = this._fnGetLocalId(oColumn);
                        aSorter.push({
                            "index": aSorter.length,
                            "key": bCustomField ? sSorterKey + "_" + oMetadata.fields[j].path : sSorterKey,
                            // "key": oColumn.getId(),
                            "descending": oMetadata.sort === "desc" ? true : false
                        });
                    }
                }
            }
            this.metadataHelper = new MetadataHelper(aColumnMetadata);

            if (this._fnGetP13nView() !== sViewId) {
                this._fnCustomDestroy();
            } else {
                var aRegisteredFor = this._fnGetP13nRegisterFor();
                if (this.registerFor.length === 0 || this.registerFor.length <= aRegisteredFor.length) {
                    this._fnCustomDestroy();
                }
            }
            this._fnSetP13nView(sViewId);
            this._fnAddP13nRegisterFor(sTableId);

            Engine.getInstance().register(oTable, {
                helper: this.metadataHelper,
                controller: {
                    Columns: new SelectionController({
                        targetAggregation: "columns",
                        control: oTable
                    }),
                    Sorter: new SortController({
                        control: oTable
                    }),
                    Groups: new GroupController({
                        control: oTable
                    })
                    // ,
                    // Filter: new FilterController({
                    //     control: oTable
                    // })
                    // ,ColumnWidth: new ColumnWidthController({
                    //     control: oTable
                    // })
                }
            });

            Engine.getInstance().attachStateChange(this.onStateChange.bind(this));
            setTimeout(function () {
                if (aSorter.length) {
                    Engine.getInstance().retrieveState(oTable).then(function (oState) {
                        oState.Sorter = aSorter;
                        Engine.getInstance().applyState(oTable, oState);
                    });
                }
            }, 5000);

        },

        /**
         * custom destroy function
         */
        _fnCustomDestroy: function () {

            var oP13n = Engine.getInstance();

            if (oP13n) {
                if (oP13n.hasOwnProperty("_aStateHandlers")) {
                    oP13n._aStateHandlers = [];
                }
                if (oP13n.hasOwnProperty("stateHandlerRegistry") && oP13n.stateHandlerRegistry.hasOwnProperty("mEventRegistry")) {
                    oP13n.stateHandlerRegistry.mEventRegistry = {};
                }
                if (oP13n.hasOwnProperty("_aRegistry")) {
                    oP13n._aRegistry = [];
                }
            }

            this._fnSetP13nRegisterFor([]);
        },

        /**
         * Format date
         * @param {object} oDate 
         * @param {string} sPattern 
         * @returns 
         */
        formatDate: function (oDate, sPattern) {

            var sDate = null;
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: sPattern || "MMM dd, yyyy"
            });

            if (oDate) {
                try {
                    var oDateObj = null;

                    if (typeof oDate === "string") {
                        if (/^\d{4}-\d{2}-\d{2}$/.test(oDate)) {
                            oDateObj = new Date(oDate + "T00:00:00");           // yyyy-MM-dd // 2023-05-15
                        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{1,3})?Z?$/.test(oDate)) {
                            oDateObj = new Date(oDate);                         // ISO datetime format // 2023-05-15T14:30:00(z)
                        } else if (/^\d+$/.test(oDate)) {
                            oDateObj = new Date(Number(oDate));                 // Numeric timestamp // 1620000000000 
                        } else {
                            oDateObj = new Date(oDate);
                        }
                    } else if (oDate instanceof Date) {
                        oDateObj = oDate;
                    } else if (typeof oDate === "number") {
                        oDateObj = new Date(oDate);
                    } else {
                        oDateObj = new Date(oDate);
                    }

                    if (oDateObj instanceof Date && !isNaN(oDateObj.getTime())) {
                        sDate = oDateFormat.format(oDateObj);
                    } else {
                        if (typeof oDate === "string" && /\d+/.test(oDate)) {    // Numerix string with non numeric characters
                            try {
                                var iDateInNumber = parseInt(oDate.match(/\d+/)[0], 10);
                                sDate = oDateFormat.format(new Date(iDateInNumber));
                            } catch (error) {
                                sDate = oDate;
                            }
                        } else {
                            sDate = oDate;
                        }
                    }
                } catch (error) {
                    sDate = oDate;
                }
            }

            return sDate;
        },

        /**
         * Function for state change
         * @param {object} oEvent 
         */
        onStateChange: function (oEvent) {

            var that = this.controller;
            var oTable = this.table;
            var oState = oEvent.getParameter("state");
            var oControl = oEvent.getParameter("control");
            var oSelf = this;

            if (oTable.getMetadata().getName().includes("TreeTable")) {
                var oBindingItem = oTable.getBinding("rows");
                var sModelName = oTable.getBindingInfo("rows").model;
                var sBindingPath = oTable.getBinding("rows").getPath();

                if (oState && oState.Columns && oTable.getId() === oControl.getId()) {
                    oTable.getColumns().forEach(function (oColumn) {
                        if (!oColumn.getId().includes("idParentRow")) {
                            oColumn.setVisible(false);
                        }
                    });

                    oState.Columns.forEach(function (oProp, iIndex) {
                        var oCol = that.byId(oProp.key);
                        if (oCol) {
                            oCol.setVisible(true);
                            oTable.removeColumn(oCol);
                            oTable.insertColumn(oCol, iIndex);
                        }
                    });

                    var aSorters = [];
                    oState.Sorter.forEach(function (oSorter) {
                        var sPath = this.metadataHelper.getPath(oSorter.key);
                        aSorters.push(new sap.ui.model.Sorter(sPath, oSorter.descending));
                    }.bind(this));

                    oTable.bindRows({
                        path: sModelName + ">" + sBindingPath,
                        parameters: oBindingItem.mParameters,
                        sorter: aSorters,
                    });

                    if (oTable.getBinding("rows")) {
                        oTable.getBinding("rows").sort(aSorters);
                    }
                }

            } else {

                /**
                 * Function to check input string is date
                 * 
                 * @param {String} sDateString
                 * @return {Boolean} 
                 */
                var fnIsDateString = function (sDateString) {
                    var datePattern = /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{4}$|^\d{1,2}\/\d{1,2}\/\d{2}$|^\d{2}-\d{2}-\d{4}$|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;
                    
                    if (!datePattern.test(sDateString)) {
                        return false; 
                    }
                    
                    var oDate = new Date(sDateString);
                    return !isNaN(oDate.getTime());
                };

                if (oState && oTable.getId() === oControl.getId()) {
                    var oBindingItem = oTable.getBinding("items");
                    var sModelName = oTable.getBindingInfo("items").model;
                    var sBindingPath = oTable.getBinding("items").getPath();
                    var oTemplate = oTable.getBindingInfo("items").template;
                    var isTemplateSharable = oTable.getBindingInfo("items").templateShareable ? true : false;
                    var oEvent = {};

                    oTable.getColumns().forEach(function (oColumn) {
                        oColumn.setVisible(false);
                    });

                    oState.Columns.forEach(function (oProp, iIndex) {
                        var oCol = that.byId(oProp.key);
                        oCol.setVisible(true);

                        var iOldIndex = oTable.getColumns().indexOf(oCol);

                        oTable.removeColumn(oCol);
                        oTable.insertColumn(oCol, iIndex);

                        var oCell = oTemplate.getCells()[iOldIndex];
                        oTemplate.removeCell(oCell);
                        oTemplate.insertCell(oCell, iIndex);
                    }.bind(this));

                    if (this.onDataReceived) {
                        oEvent = {
                            dataReceived: this.onDataReceived.bind(that)
                        };
                    }
                    oTable.bindItems({
                        path: sModelName + ">" + sBindingPath,
                        template: oTemplate,
                        templateShareable: isTemplateSharable,
                        parameters: oBindingItem.mParameters,
                        sorter: oBindingItem.aSorters,
                        filters: Object.assign(oBindingItem.aFilters, oBindingItem.aApplicationFilters),
                        events: oEvent
                    });

                    var aSorter = [];
                    oState.Groups.forEach(function (oGroup) {
                        var oMetadata = this.metadataHelper.getProperty(oGroup.key);

                        aSorter.push(new Sorter({
                            path: oMetadata.path,
                            descending: oGroup.descending,
                            /**
                             * Grouping function
                             * @param {object} oContext 
                             */
                            group: function (oContext) {
                                var sGroupHeader = oContext.getProperty(oMetadata.path);
                                if (fnIsDateString(sGroupHeader)) {
                                    sGroupHeader = oSelf.formatDate(sGroupHeader, "MMM dd, yyyy, hh:mm:ss aa");
                                }
                                if(oMetadata.path=="fileType" && oMetadata.label=="File Type"){
                                    sGroupHeader=oSelf.fnFormatAttachmentIconBasedOnFileTypeGroup(sGroupHeader);
                                }
                                if(oMetadata.path=="fileSize" && oMetadata.label=="File Size"){
                                    sGroupHeader=oSelf.fnConverbytestoSize(sGroupHeader);
                                }
                                if(oMetadata.path=="confidentiality" && oMetadata.label=="Confidentiality"){
                                    if (sGroupHeader == null || sGroupHeader == "") {
                                        sGroupHeader = "Null";
                                    }
                                    else if (sGroupHeader == "0") {
                                        sGroupHeader = "No Sensitive Information";
                                    } else {
                                        sGroupHeader = "Personal Data";
                                    }
                                }
                                return oMetadata.label + ": " + sGroupHeader;
                            }
                        }));
                    }.bind(this));

                    oState.Sorter.forEach(function (oSorter) {
                        var sPath = this.metadataHelper.getPath(oSorter.key);
                        var oExistingSorter = aSorter.find(function (oItem) {
                            return oItem.sPath === sPath;
                        });

                        if (oExistingSorter) {
                            oExistingSorter.bDescending = oSorter.descending;
                        } else {
                            aSorter.push(new Sorter({
                                path: this.metadataHelper.getPath(oSorter.key),
                                descending: oSorter.descending
                            }
                            ));
                        }
                    }.bind(this));

                    if (oTable.getBinding("items")) {
                        oTable.getBinding("items").sort(aSorter);
                    }
                }
            }

        },
        
        /**
		 * Function to format icon based on file type
		 * @param {string} sAttachmentFileTypeGroup 
		 */
        fnFormatAttachmentIconBasedOnFileTypeGroup: function (sAttachmentFileTypeGroup) {
            var documentMimeGroup=com.asint.ais.library.model.constants.documentMimeGroup;
            if (documentMimeGroup.hasOwnProperty(sAttachmentFileTypeGroup)) {
                return documentMimeGroup[sAttachmentFileTypeGroup];}
            else{
                return sAttachmentFileTypeGroup;
            }
        },

        /**
		 * Function convert byte to size
		 * @param {integer} iFileSizeInBytes 
		 */
        fnConverbytestoSize: function (iFileSizeInBytes) {
            var iDecimal = 2;
            if (!+iFileSizeInBytes || iFileSizeInBytes === 0) {
                return ""; 
            }
            var iK = 1024;
            var iDc = iDecimal < 0 ? 0 : iDecimal;
            var sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
            var i = Math.floor(Math.log(iFileSizeInBytes) / Math.log(iK));
            return parseFloat((iFileSizeInBytes / Math.pow(iK, i)).toFixed(iDc))+" "+sizes[i];
        },
        // onStateChange: function (oEvent) {

        //     var that = this.controller;
        //     var oTable = this.table;
        //     var oState = oEvent.getParameter("state");
        //     var sModelName = oTable.getBindingInfo("items").model;
        //     var sPath = oTable.getBindingInfo("items").path;

        //     if (!oState) {
        //         return;
        //     }

        //     var aSorter = [];

        //     oState.Groups.forEach(function (oGroup) {
        //         aSorter.push(new Sorter(this.metadataHelper.getProperty(oGroup.key).path, false, true));
        //     }.bind(this));

        //     oState.Sorter.forEach(function (oSorter) {
        //         var oExistingSorter = aSorter.find(function (oSort) {
        //             return oSort.sPath === this.metadataHelper.getProperty(oSorter.key).path;
        //         }.bind(this));

        //         if (oExistingSorter) {
        //             oExistingSorter.bDescending = !!oSorter.descending;
        //         } else {
        //             aSorter.push(new Sorter(this.metadataHelper.getProperty(oSorter.key).path, oSorter.descending));
        //         }
        //     }.bind(this));

        //     oTable.getColumns().forEach(function (oColumn, iIndex) {
        //         oColumn.setVisible(false);
        //         // oColumn.setWidth(oState.ColumnWidth[this._fnGetLocalId(oColumn)]);
        //         oColumn.setSortIndicator(CoreLibrary.SortOrder.None);
        //         oColumn.data("grouped", false);
        //     }.bind(this));

        //     oState.Sorter.forEach(function (oSorter) {
        //         var oCol = that.byId(oSorter.key);
        //         if (oSorter.sorted !== false) {
        //             oCol.setSortIndicator(oSorter.descending ? CoreLibrary.SortOrder.Descending : CoreLibrary.SortOrder.Ascending);
        //         }
        //     }.bind(this));

        //     oState.Groups.forEach(function (oSorter) {
        //         var oCol = that.byId(oSorter.key);
        //         oCol.data("grouped", true);
        //     }.bind(this));

        //     oState.Columns.forEach(function (oProp, iIndex) {
        //         var oCol = that.byId(oProp.key);
        //         oCol.setVisible(true);

        //         oTable.removeColumn(oCol);
        //         oTable.insertColumn(oCol, iIndex);
        //     }.bind(this));

        //     var aCells = oState.Columns.map(function (oColumnState) {
        //         var sKey = oColumnState.key;
        //         var sControl = this.metadataHelper.getProperty(sKey).control;
        //         switch (sControl) {
        //             case "sap.m.ObjectIdentifier":
        //                 return new ObjectIdentifier({
        //                     title: "{" + sModelName + ">" + this.metadataHelper.getProperty(sKey).value1 + "}",
        //                     text: "{" + sModelName + ">" + this.metadataHelper.getProperty(sKey).value2 + "}"
        //                 });
        //                 break;
        //             case "sap.m.ObjectStatus":
        //                 return new ObjectStatus({
        //                     text: {
        //                         path: sModelName + ">" + this.metadataHelper.getProperty(sKey).value1,
        //                         formatter: that.formatter.fnGetStatusText
        //                     },
        //                     state: {
        //                         path: sModelName + ">" + this.metadataHelper.getProperty(sKey).value1,
        //                         formatter: that.formatter.fnGetStatusType
        //                     }
        //                 });
        //                 break;
        //             default:
        //                 return new Text({
        //                     text: "{" + sModelName + ">" + this.metadataHelper.getProperty(sKey).value1 + "}"
        //                 });
        //                 break;
        //         }

        //     }.bind(this));

        //     oTable.bindItems({
        //         templateShareable: false,
        //         path: sModelName + ">" + sPath,
        //         parameters: {
        //             $select: "ID",
        //             countMode: "Inline"
        //         },
        //         events: {
        //             dataReceived: this.onDataReceived.bind(that)
        //         },
        //         sorter: aSorter,
        //         template: new ColumnListItem({
        //             type: "Navigation",
        //             cells: aCells,
        //             press: this.columnListItemPress.bind(that)
        //         })
        //     });

        // },


        // Commenting Column Resizer for now ( available only >= 1.120.0 )

        // onColumnResize: function (oEvent) {

        //     var oColumn = oEvent.getParameter("column");
        //     var sWidth = oEvent.getParameter("width");
        //     var oTable = this.table;
        //     var oColumnState = {};

        //     oColumnState[this._fnGetLocalId(oColumn)] = sWidth;
        //     Engine.getInstance().applyState(oTable, {
        //         ColumnWidth: oColumnState
        //     });

        // },
        /**
         * settings button functionality
         * @param {object} oEvent 
         */
        onSettingsPress: function (oEvent) {

            var oTable = this.table;
            var aFilterHeaderColumn = [];

            if (oTable.getMetadata().getName().includes("TreeTable")) {
                aFilterHeaderColumn = ["Columns", "Sorter"];
            } else {
                aFilterHeaderColumn = ["Columns", "Sorter", "Groups"];
            }

            if(this.isHideSort){
                aFilterHeaderColumn = aFilterHeaderColumn.filter(function (sItem) {
                    return sItem !== "Sorter";
                });
            }

            if(this.isHideGroup){
                aFilterHeaderColumn = aFilterHeaderColumn.filter(function (sItem) {
                    return sItem !== "Groups";
                });
            }

            Engine.getInstance().show(oTable, aFilterHeaderColumn, {
                contentHeight: "35rem",
                contentWidth: "32rem",
                source: oEvent.getSource()
            });

        },

        /**
         * Function to reset the table
         * @param {Object} oTable 
         */
        reset: function (oTable) {
            if (!oTable) {
                oTable = this.table;
            }
            if (oTable) {
                Engine.getInstance().reset(oTable);
            }
        }

        // Commenting Column Resizer for now

        // onBeforeOpenColumnMenu: function (oEvent) {

        //     var oMenu = this.columnMenu;
        //     var oColumn = oEvent.getParameter("openBy");
        //     var oSortItem = oMenu.getQuickActions()[0].getItems()[0];
        //     var oGroupItem = oMenu.getQuickActions()[1].getItems()[0];

        //     oSortItem.setKey(this._fnGetLocalId(oColumn));
        //     oSortItem.setLabel(oColumn.getHeader().getText());
        //     oSortItem.setSortOrder(oColumn.getSortIndicator());

        //     oGroupItem.setKey(this._fnGetLocalId(oColumn));
        //     oGroupItem.setLabel(oColumn.getHeader().getText());
        //     oGroupItem.setGrouped(oColumn.data("grouped"));

        // },

        // onSort: function (oEvent) {

        //     var oSortItem = oEvent.getParameter("item");
        //     var oTable = this.table;
        //     var sAffectedProperty = oSortItem.getKey();
        //     var sSortOrder = oSortItem.getSortOrder();

        //     Engine.retrieveState(oTable).then(function (oState) {
        //         oState.Sorter.forEach(function (oSorter) {
        //             oSorter.sorted = false;
        //         });
        //         if (sSortOrder !== CoreLibrary.SortOrder.None) {
        //             oState.Sorter.push({
        //                 key: sAffectedProperty,
        //                 descending: sSortOrder === CoreLibrary.SortOrder.Descending
        //             });
        //         }
        //         Engine.applyState(oTable, oState);
        //     });

        // },

        // onGroup: function (oEvent) {

        //     var oGroupItem = oEvent.getParameter("item");
        //     var oTable = this.table;
        //     var sAffectedProperty = oGroupItem.getKey();

        //     Engine.retrieveState(oTable).then(function (oState) {
        //         oState.Groups.forEach(function (oSorter) {
        //             oSorter.grouped = false;
        //         });
        //         if (oGroupItem.getGrouped()) {
        //             oState.Groups.push({
        //                 key: sAffectedProperty
        //             });
        //         }
        //         Engine.applyState(oTable, oState);
        //     });

        // },

        // onColumnMove: function (oEvent) {

        //     var oDraggedColumn = oEvent.getParameter("draggedControl");
        //     var oDroppedColumn = oEvent.getParameter("droppedControl");

        //     if (oDraggedColumn === oDroppedColumn) {
        //         return;
        //     }

        //     var oTable = this.table;
        //     var sDropPosition = oEvent.getParameter("dropPosition");
        //     var iDraggedIndex = oTable.indexOfColumn(oDraggedColumn);
        //     var iDroppedIndex = oTable.indexOfColumn(oDroppedColumn);
        //     var iNewPos = iDroppedIndex + (sDropPosition == "Before" ? 0 : 1) + (iDraggedIndex < iDroppedIndex ? -1 : 0);
        //     // var sKey = this._fnGetLocalId(oDraggedColumn);
        //     var sKey = oDraggedColumn.getId();

        //     Engine.retrieveState(oTable).then(function (oState) {

        //         var oCol = oState.Columns.find(function (oColumn) {
        //             return oColumn.key === sKey;
        //         }) || { key: sKey };
        //         oCol.position = iNewPos;

        //         Engine.applyState(oTable, { Columns: [oCol] });
        //     });

        // },

        // onColumnHeaderItemPress: function (oEvent) {

        //     var oTable = this.table;
        //     var oColumnHeaderItem = oEvent.getSource();
        //     var sPanel = "Columns";

        //     if (oColumnHeaderItem.getIcon().indexOf("group") >= 0) {
        //         sPanel = "Groups";
        //     } else if (oColumnHeaderItem.getIcon().indexOf("sort") >= 0) {
        //         sPanel = "Sorter";
        //     }

        //     Engine.show(oTable, [sPanel], {
        //         contentHeight: "35rem",
        //         contentWidth: "32rem",
        //         source: oTable
        //     });

        // },

    });

    return Helper;

});