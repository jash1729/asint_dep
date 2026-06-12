sap.ui.define([
    "sap/ui/table/TreeTable",
    "sap/ui/table/Column",
    "sap/m/Text",
    "sap/m/Link",
    "sap/m/VBox"
], function (TreeTable, Column, Text, Link, VBox) {
    "use strict";

    return TreeTable.extend("com.asint.ais.library.control.CustomControl.WorkflowAsmtStgTable", {

        metadata: {
            properties: {
                excludeColumns: {
                    type: "string[]",
                    defaultValue: ["nodes", "type", "id", "assessmentId", "link", "description", "action", "displayId", "name", "technicalObjects","level"]
                },
                columnOrder: {
                    type: "string[]",
                    defaultValue: []
                }
            }
        },

        /**
         * overriding init function
         */
        init: function () {
            TreeTable.prototype.init.apply(this, arguments);
            this._bProcessingSelection = false;
            this.attachRowSelectionChange(this._onRowSelectionChange, this);
            this.attachEvent("_rowsUpdated", this._disableChildCheckboxes, this);
        },

        /**
         * overriding onafter rendering function
         */
        onAfterRendering: function () {
            TreeTable.prototype.onAfterRendering.apply(this, arguments);
            this._buildDynamicColumns();

            setTimeout(function () {
                this._syncSelectionWithAction();
                this._disableChildCheckboxes();
            }.bind(this), 100);
        },

        /**
         * Function to disable child row checkboxes based on level
         */
        _disableChildCheckboxes: function () {
            var that = this;
            var oBinding = this.getBinding("rows");            
            if (!oBinding) {
                return;
            }            
            this.getRows().forEach(function (oRow) {
                var oCtx = oRow.getBindingContext() || oRow.getBindingContext(that.getBindingInfo("rows").model);                
                if (!oCtx) {
                    return;
                }

                var oRowData = oCtx.getObject();
                var oRowSelector = oRow.getDomRefs().rowSelector;
                
                if (!oRowSelector || !oRowData) {
                    return;
                }

                var iLevel = oRowData.level;
                if (iLevel && iLevel >= 2) {
                    oRowSelector.style.pointerEvents = "none";
                    oRowSelector.style.opacity = "0.4";
                    oRowSelector.setAttribute("aria-disabled", "true");
                    oRowSelector.setAttribute("tabindex", "-1");
                } else {
                    oRowSelector.style.pointerEvents = "";
                    oRowSelector.style.opacity = "";
                    oRowSelector.removeAttribute("aria-disabled");
                    oRowSelector.removeAttribute("tabindex");
                }
            });
        },

        /**
         * function to build columns dynamically
         * @returns 
         */
        _buildDynamicColumns: function () {
            if (this._columnGenerated) {
                return;
            }

            var oRowBinding = this.getBinding("rows");
            if (!oRowBinding) {
                return;
            }

            var oRowBindingInfo = this.getBindingInfo("rows");
            var sModelName = oRowBindingInfo.model;
            var sBindingPath = oRowBinding.getPath();
            var oModel = oRowBinding.getModel();
            var oData = oModel.getProperty(sBindingPath);

            if (!oData) {
                return;
            }

            var aArrayNames = oRowBindingInfo && oRowBindingInfo.parameters && oRowBindingInfo.parameters.arrayNames?oRowBindingInfo.parameters.arrayNames : ["nodes"];
            var sHierarchyProperty = aArrayNames[0];
            var aData = oData[sHierarchyProperty] || oData;

            if (!aData || aData.length === 0) {
                return;
            }

            var aColumnKeys = this._extractColumnKeys(aData, sHierarchyProperty);

            var aColumnOrder = this.getColumnOrder();
            if (aColumnOrder && aColumnOrder.length > 0) {
                aColumnKeys = this._applyColumnOrder(aColumnKeys, aColumnOrder);
            }

            this.removeAllColumns();
            var bRncTechObjMode = this.data("rncTechObjMode") === true;
            this.addColumn(new Column({
                label: new Text({ text: bRncTechObjMode ? "Assessment" : "Assessment/Strategies"}),
                template: this._createFirstColumnTemplate(sModelName),
                width: "300px"
            }));

            aColumnKeys.forEach(function (sKey) {
                var oTemplate;
                if (sKey === "Technical Objects") {
                    oTemplate = this._createTechnicalObjectTemplate(sModelName);
                } else {
                    oTemplate = new Text({
                        text: `{${sModelName ? sModelName + ">" + sKey : sKey}}`,
                        wrapping: false
                    });
                }
                this.addColumn(new Column({
                    label: new Text({ text: sKey }),
                    template: oTemplate,
                    width: "150px"
                }));
            }.bind(this));

            this._columnGenerated = true;
        },

        /**
         * 
         * @param {*} sModelName 
         * @returns 
         */
        _createTechnicalObjectTemplate: function (sModelName) {
            var sCountPath = sModelName ? sModelName + ">Technical Objects" : "Technical Objects";
            var oLink = new sap.m.Link({
                text: {
                    path: sCountPath,
                    /**
                     * 
                     * @param {*} iCount 
                     * @returns 
                     */
                    formatter: function (iCount) {
                        return iCount ? iCount + " Items" : "";
                    }
                },
                visible: {
                    path: sCountPath,
                    /**
                     * 
                     * @param {*} iCount 
                     * @returns 
                     */
                    formatter: function (iCount) {
                        return iCount > 0;
                    }
                }
            });
            oLink.attachPress(function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext(sModelName);
                if (!oContext) {
                    return;
                }
                var aObjects = oContext.getProperty("technicalObjects") || [];
                var oPopover = new sap.m.Popover({
                    title: "Technical Objects",
                    placement: sap.m.PlacementType.Auto,
                    contentWidth: "300px",
                    content: [
                        new sap.m.List({
                            items: {
                                path: "/",
                                template: new sap.m.StandardListItem({
                                    title: "{name}"
                                })
                            }
                        })
                    ]
                });

                oPopover.setModel(new sap.ui.model.json.JSONModel(aObjects));
                oPopover.openBy(oEvent.getSource());
            });
            return oLink;
        },

        /**
         * Fuction to create Assessment/Strategies column
         * 
         * @param {String} sModelName 
         * @returns {Object}
         */
        _createFirstColumnTemplate: function (sModelName) {
            var sDisplayIdPath = sModelName ? sModelName + ">displayId" : "displayId";
            var sLinkPath = sModelName ? sModelName + ">link" : "link";
            var sDescriptionPath = sModelName ? sModelName + ">description" : "description";

            return new VBox({
                items: [
                    new Link({
                        text: {
                            parts: [
                                { path: sDisplayIdPath },
                                { path: sDescriptionPath }
                            ],
                            /**
                             * 
                             * @param {*} sDisplayId 
                             * @param {*} sDescription 
                             * @returns 
                             */
                            formatter: function (sDisplayId, sDescription) {
                                return sDisplayId ? sDisplayId + " - " + sDescription : sDescription;
                            }
                        },
                        href: `{${sLinkPath}}`,
                        target: "_blank",
                        wrapping: false,
                        visible: {
                            path: sLinkPath,
                            /**
                             * 
                             * @param {*} sLink 
                             * @returns 
                             */
                            formatter: function (sLink) {
                                return !!sLink;
                            }
                        }
                    }),
                    new Text({
                        text: {
                            parts: [
                                { path: sDisplayIdPath },
                                { path: sDescriptionPath }
                            ],
                            /**
                             * 
                             * @param {*} sDisplayId 
                             * @param {*} sDescription 
                             * @returns 
                             */
                            formatter: function (sDisplayId, sDescription) {
                                return sDisplayId ? sDisplayId + " - " + sDescription : sDescription;
                            }
                        },
                        visible: {
                            path: sLinkPath,
                            /**
                             * 
                             * @param {*} sLink 
                             * @returns 
                             */
                            formatter: function (sLink) {
                                return !sLink;
                            }
                        },
                        wrapping: false
                    })
                ]
            });
        },

        /**
         * Helper function to extract column names/keys
         * 
         * @param {Array} aNodes 
         * @param {String} sHierarchyProperty 
         * @returns {Array}
         */
        _extractColumnKeys: function (aNodes, sHierarchyProperty) {
            var oKeys = {};
            var aExclude = this.getExcludeColumns();

            if (aExclude.indexOf(sHierarchyProperty) === -1) {
                aExclude.push(sHierarchyProperty);
            }

            /**
             * 
             * @param {*} aItems 
             * @returns 
             */
            var fnExtract = function (aItems) {
                if (!aItems || !Array.isArray(aItems)) {
                    return;
                }

                aItems.forEach(function (oItem) {
                    Object.keys(oItem).forEach(function (sKey) {
                        if (aExclude.indexOf(sKey) === -1 &&
                            typeof oItem[sKey] !== "object" &&
                            oItem[sKey] !== null) {
                            oKeys[sKey] = true;
                        }
                    });

                    if (oItem[sHierarchyProperty] && oItem[sHierarchyProperty].length > 0) {
                        fnExtract(oItem[sHierarchyProperty]);
                    }
                });
            };

            fnExtract(aNodes);
            return Object.keys(oKeys).sort();
        },

        /**
         * Function to apply column order
         * 
         * @param {Array} aColumns 
         * @param {Array} aOrder 
         * @returns {Array}
         */
        _applyColumnOrder: function (aColumns, aOrder) {
            var aOrdered = [];
            var oColumnMap = {};

            aColumns.forEach(function (sCol) {
                oColumnMap[sCol] = true;
            });

            aOrder.forEach(function (sCol) {
                if (oColumnMap[sCol]) {
                    aOrdered.push(sCol);
                    delete oColumnMap[sCol];
                }
            });

            Object.keys(oColumnMap).sort().forEach(function (sCol) {
                aOrdered.push(sCol);
            });

            return aOrdered;
        },

        /**
         * Function to bind action property to table selection
         * 
         * @returns 
         */
        _syncSelectionWithAction: function () {
            if (this._bProcessingSelection) {
                return;
            }

            this._bProcessingSelection = true;

            try {
                var oBinding = this.getBinding("rows");
                if (!oBinding) {
                    return;
                }

                var iLength = oBinding.getLength();                
                for (var i = 0; i < iLength; i++) {
                    var oContext = this.getContextByIndex(i);
                    if (oContext) {
                        var oItem = oContext.getObject();
                        if (oItem && oItem.action === true) {
                            this.addSelectionInterval(i, i);
                        }
                    }
                }
            } finally {
                this._bProcessingSelection = false;
            }
        },

        /**
         * Overriding row selection change function
         * 
         * @param {Object} oEvent 
         * @returns 
         */
        _onRowSelectionChange: function (oEvent) {
            if (this._bProcessingSelection) {
                return;
            }
            if (this.data("disableSelection") === true) {
                if (this._bProcessingSelection) {
                    return;
                }
                var iRow = oEvent.getParameter("rowIndex");
                var oTable = this;

                this._bProcessingSelection = true;

                setTimeout(function () {
                    var bSelected = oTable.isIndexSelected(iRow);

                    if (bSelected) {
                        oTable.removeSelectionInterval(iRow, iRow);
                    } else {
                        oTable.addSelectionInterval(iRow, iRow);
                    }
                    oTable._bProcessingSelection = false;
                }, 0);
                return;
            }

            var iRowIndex = oEvent.getParameter("rowIndex");
            var bUserInteraction = oEvent.getParameter("userInteraction");

            if (!bUserInteraction) {
                return;
            }

            this._bProcessingSelection = true;

            try {
                var oContext = this.getContextByIndex(iRowIndex);
                if (!oContext) {
                    return;
                }

                var oItem = oContext.getObject();

                if (oItem.type !== "assessment") {
                    var bCurrentlySelected = this.isIndexSelected(iRowIndex);
                    /* eslint-disable no-redeclare */
                    var oTable = this;

                    this._bProcessingSelection = true;

                    setTimeout(function () {
                        if (bCurrentlySelected) {
                            oTable.removeSelectionInterval(iRowIndex, iRowIndex);
                        } else {
                            oTable.addSelectionInterval(iRowIndex, iRowIndex);
                        }
                        oTable._bProcessingSelection = false;
                    }, 0);

                    return;
                }
                var bIsSelected = this.isIndexSelected(iRowIndex);

                var oModel = oContext.getModel();
                oModel.setProperty(oContext.getPath() + "/action", bIsSelected);

                if (oItem.type === "assessment") {
                    this._handleAssessmentSelection(iRowIndex, bIsSelected, oItem);
                // } else if (oItem.type === "strategy" && bIsSelected) {
                //     this._handleStrategySelection(iRowIndex, oItem);
                }
            } finally {
                this._bProcessingSelection = false;
            }
        },

        /**
         * Function to handle assessment Selection
         * 
         * @param {Number} iParentIndex 
         * @param {Boolean} bIsSelected 
         * @param {Object} oParentItem 
         * @returns 
         */
        _handleAssessmentSelection: function (iParentIndex, bIsSelected, oParentItem) {
            var oRowBindingInfo = this.getBindingInfo("rows");
            var aArrayNames = oRowBindingInfo.parameters && oRowBindingInfo.parameters.arrayNames || ["nodes"];
            var sHierarchyProperty = aArrayNames[0];
            var aChildren = oParentItem[sHierarchyProperty] || [];

            if (aChildren.length === 0) {
                return;
            }

            var oBinding = this.getBinding("rows");
            if (!oBinding) {
                return;
            }
            var iLength = oBinding.getLength();            
            for (var i = iParentIndex + 1; i < iLength; i++) {
                var oContext = this.getContextByIndex(i);
                if (!oContext) {
                    continue;
                }

                var oItem = oContext.getObject();

                if (oItem.type === "assessment") {
                    break;
                }

                var bIsChild = aChildren.some(function (oChild) {
                    return oChild.id === oItem.id;
                });

                if (bIsChild) {
                    if (bIsSelected) {
                        this.addSelectionInterval(i, i);
                    } else {
                        this.removeSelectionInterval(i, i);
                    }

                    var oModel = oContext.getModel();
                    oModel.setProperty(oContext.getPath() + "/action", bIsSelected);
                }
            }
        },

        // /**
        //  * Function to handle strategy Selection
        //  * 
        //  * @param {Number} iChildIndex 
        //  * @param {Object} oChildItem 
        //  * @returns 
        //  */
        // _handleStrategySelection: function (iChildIndex, oChildItem) {
        //     var sAssessmentId = oChildItem.assessmentId;

        //     for (var i = iChildIndex - 1; i >= 0; i--) {
        //         var oContext = this.getContextByIndex(i);
        //         if (!oContext) {
        //             continue;
        //         }

        //         var oItem = oContext.getObject();

        //         if (oItem.type === "assessment" && oItem.id === sAssessmentId) {
        //             this.addSelectionInterval(i, i);

        //             var oModel = oContext.getModel();
        //             oModel.setProperty(oContext.getPath() + "/action", true);
        //             break;
        //         }
        //     }
        // },

        /**
         * Hooking update rows function to rebuild column
         */
        updateRows: function () {
            TreeTable.prototype.updateRows.apply(this, arguments);
            this._columnGenerated = false;
            this._buildDynamicColumns();
            setTimeout(function () {
                this._disableChildCheckboxes();
            }.bind(this), 50);
        },

        /**
         * Hooking bind rows function to rebuild column
         */
        bindRows: function () {
            TreeTable.prototype.bindRows.apply(this, arguments);
            this._columnGenerated = false;
        },

        /**
         * Public method to rebuild columns
         * 
         * @returns {Object}
         */
        rebuildColumns: function () {
            this._columnGenerated = false;
            this._buildDynamicColumns();
            return this;
        },

        renderer: {}
    });
});