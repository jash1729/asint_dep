sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/suite/ui/commons/networkgraph/Graph",
    "sap/suite/ui/commons/networkgraph/Status",
    "sap/suite/ui/commons/networkgraph/ElementAttribute",
    "sap/suite/ui/commons/networkgraph/ActionButton",
    "sap/suite/ui/commons/networkgraph/Line",
    "sap/suite/ui/commons/networkgraph/Node",
    "sap/suite/ui/commons/networkgraph/layout/LayeredLayout",
    "com/asint/ais/library/datasource/asint/ObjectHierarchy"
], function (Formater, JSONModel, Button, Graph, Status, ElementAttribute, ActionButton, Line, Node, LayeredLayout, ObjectHierarchy) {

    return Formater.extend("com.asint.asint_lib.utils.ObjectHierarchy", {

        _baseURI: "",
        _oNetworkGraph: null,
        _config: {},
        _mNetworkGraphModel: null,
        _oController: null,

        dataSource: {},

        NAVIGATION: {
            "EQUI_DETAIL": "equipment-manage&/equipment/{sId}/detail",
            "FLOC_DETAIL": "functionallocation-manage&/location/{sId}/detail"
        },

        /**
         * Constructor
         * 
         * @param {String} sBaseURI
         * @param {Object} oConfig
         * @return {Object} NetworkGraph
         */
        constructor: function (sBaseURI, oConfig, oController) {

            // oConfig = {
            // 	"type": "", // LIST or DETAIL
            // 	"nodePress": function () {},
            //  "declinePress": function () {},
            //  "flexColumnLayoutId": ""
            // };

            if (oConfig) {
                this._config = oConfig;
            }
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
            if (oController) {
                this._oController = oController;
            }
            this.dataSource = new ObjectHierarchy(this._baseURI);

            this.init(oConfig);

        },

        /**
         * Function to define model
         * 
         */
        _fnInitModel: function () {

            var oModel = new JSONModel({
                data: {
                    nodes: [],
                    lines: [],
                    master: {}
                },
                metadata: {
                    response: [],
                    fetched: false,
                    isBusy: true
                }
            });
            oModel.setSizeLimit(99999);

            return oModel;

        },

        /**
         * Function to create and initiate control
         * 
         * @param {Object} oConfig
         */
        init: function (oConfig) {

            var that = this;
            var oModel = this._fnInitModel();
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var oController = this._oController;
            var oLayout = new LayeredLayout({
                nodeSpacing: 60
            });

            var oGraph = new Graph({
                enableWheelZoom: false,
                orientation: "TopBottom",
                // noData: "{= ${mObjectHierarchy>/data/nodes/length} > 0 ? true : false}",
                noDataText: oI18n.getText("library.objectHierarchy.noDataFound.text"),
                beforeLayouting: this.onBeforeLayouting.bind(this),
                busy: "{mObjectHierarchy>/metadata/isBusy}"
            });
            var oLineTemplate = new Line({
                from: "{mObjectHierarchy>from}",
                to: "{mObjectHierarchy>to}",
                press: this.onLinePress.bind(this)
            });
            var oNodeTemplate = new Node({
                key: "{mObjectHierarchy>id}",
                selected: "{mObjectHierarchy>isSelected}",
                title: "{mObjectHierarchy>name}",
                shape: "{mObjectHierarchy>shape}",
                icon: "{mObjectHierarchy>icon}",
                showDetailButton: "{mObjectHierarchy>detailbutton}",
                showExpandButton: "{mObjectHierarchy>expandbutton}",
                status: "{mObjectHierarchy>status}"
            });

            if (oConfig.type === "LIST" && oConfig.declinePress) {
                oGraph.getToolbar().addContent(new Button({
                    icon: "sap-icon://decline",
                    /**
                     * Function to close the Hierarchy FullScreen view
                     */
                    press: function () {
                        if (that._oNetworkGraph.isFullScreen()) {
                            that._oNetworkGraph.toggleFullScreen(false);
                        }
                        oConfig.declinePress();
                    }
                }));
                if (oController) {
                    var oFlexiColLayout = oController.getView().byId(oConfig.flexColumnLayoutId);
                    oFlexiColLayout.attachStateChange(function (oEvent) {
                        if (oEvent.getParameter("isResize")) {
                            that.fnRefreshLayout();
                        }
                    });
                }
            }
            // else if (oConfig.type === "DETAIL") {

            // }
            if (oConfig.nodePress) {
                oNodeTemplate.attachPress(function (oEvent) {
                    oConfig.nodePress(oEvent.getSource().getBindingContext("mObjectHierarchy").getObject());
                });
            }

            oGraph.addStatus(new Status({
                key: "Information",
                title: oI18n.getText("library.objectHierarchy.btpAsset.text")
            }));
            oGraph.addStatus(new Status({
                key: "Success",
                title: oI18n.getText("library.objectHierarchy.s4Asset.text")
            }));
            oGraph.addStatus(new Status({
                key: "Warning",
                title: oI18n.getText("library.objectHierarchy.selectedAsset.text")
            }));
            oNodeTemplate.bindAggregation("attributes", {
                path: "mObjectHierarchy>attributes",
                template: new ElementAttribute({
                    label: "{mObjectHierarchy>label}",
                    value: "{mObjectHierarchy>value}",
                    valueStatus: "{mObjectHierarchy>valueStatus}"
                }),
                templateShareable: true
            });
            oNodeTemplate.addActionButton(new ActionButton({
                icon: "sap-icon://show",
                title: "Navigate to detail",
                press: this.onNodeNavigate.bind(this)
            }));
            oNodeTemplate.addActionButton(new ActionButton({
                icon: "sap-icon://collapse-group",
                title: "Expand Parents",
                position: "Left",
                enabled: "{mObjectHierarchy>expandParent}",
                press: function (oEvent) {
                    this.onExpandNode(oEvent, "ANCESTORS");
                }.bind(this)
            }));
            oNodeTemplate.addActionButton(new ActionButton({
                icon: "sap-icon://expand-group",
                title: "Expand Children",
                position: "Left",
                enabled: "{mObjectHierarchy>expandChildren}",
                press: function (oEvent) {
                    this.onExpandNode(oEvent, "CHILDREN");
                }.bind(this)
            }));
            oGraph.bindAggregation("nodes", {
                path: "mObjectHierarchy>/data/nodes",
                template: oNodeTemplate,
                templateShareable: true
            });
            oGraph.bindAggregation("lines", {
                path: "mObjectHierarchy>/data/lines",
                template: oLineTemplate,
                templateShareable: true
            });
            oGraph.setModel(oModel, "mObjectHierarchy");
            oGraph.setBusyIndicatorDelay(0);
            oGraph.setLayoutAlgorithm(oLayout);

            if (this._oController && this._oController.getView() && this._config.busyControlId && this._oController.getView().byId(this._config.busyControlId)) {
                this._oController.getView().byId(this._config.busyControlId).setBusyIndicatorDelay(0);
            }

            this._oNetworkGraph = oGraph;
            this._mNetworkGraphModel = oGraph.getModel("mObjectHierarchy");
            return oGraph;

        },

        /**
         * Function to return network graph
         * 
         */
        getNetworkGraph: function () {

            if (this._oNetworkGraph) {
                return this._oNetworkGraph;
            }

        },

        /**
         * Function to handle before layouting
         * 
         * @param {Object} oEvent
         */
        onBeforeLayouting: function (oEvent) {

            var oNetworkGraph = oEvent.getSource();

            if (oNetworkGraph && this._config) {
                // if (this._config.type === "LIST") {

                // } 
                if (this._config === "DETAIL") {
                    oNetworkGraph.setCurrentZoomLevel(1);
                    oNetworkGraph.getToolbar().getContent().forEach(function (oControl) {
                        if (oControl.isA("sap.m.SearchField")) {
                            oControl.setValue("");
                            oControl.fireSearch({ query: "" });
                        }
                    });
                }
            }

        },

        /**
         * Function to handle node navigation
         * 
         * @param {Object} oEvent
         */
        onNodeNavigate: function (oEvent) {

            var oNode = oEvent.getSource().getParent();
            var oSelectedNode = oNode.getBindingContext("mObjectHierarchy").getObject();
            var sNavToUrl = "", sHash = "";

            if (oSelectedNode) {
                if (oSelectedNode.type === "EQUI") {
                    sHash = this.NAVIGATION.EQUI_DETAIL;
                } else if (oSelectedNode.type === "FLOC") {
                    sHash = this.NAVIGATION.FLOC_DETAIL;
                }

                sHash = sHash.replace("{sId}", oSelectedNode.id);
                sNavToUrl = this.getNavUrl(sHash);
                window.open(sNavToUrl, "_blank");
            }

        },

        /**
         * Function to handle line press
         * 
         */
        onLinePress: function () {

        },

        /**
         * Function to maintain response trace
         * @param {Array} aResponse 
         */
        fnMaintainResponseTrace: function (aResponse) {

            var mObjectHierarchy = this._mNetworkGraphModel;
            var aMasterResponse = mObjectHierarchy.getProperty("/metadata/response");
            var aFetchedObjects = [];

            for (var i = 0; i < aMasterResponse.length; i++) {
                aFetchedObjects.push(aMasterResponse[i].id);
            }

            for (var j = 0; j < aResponse.length; j++) {
                if (!aFetchedObjects.includes(aResponse[j].id)) {
                    aMasterResponse.push(aResponse[j]);
                }
            }

            return aMasterResponse;

        },

        /**
         * Function to expand children
         * @param {Object} oEvent 
         * @param {String} sType
         */
        onExpandNode: function (oEvent, sType) {

            var that = this;
            var oNode = oEvent.getSource().getParent();
            var oSelectedNode = oNode.getBindingContext("mObjectHierarchy").getObject();
            var sNodePath = oNode.getBindingContext("mObjectHierarchy").getPath();
            var mObjectHierarchy = this._mNetworkGraphModel;
            var sTechnicalObjectId = oSelectedNode.id;

            /**
             * Function to set data
             * @param {Array} aResponse 
             */
            var fnSetData = function (aResponse) {
                var oHierarchyData = mObjectHierarchy.getProperty("/data");
                var oMaster = oHierarchyData.master || {};
                var aLines = [];
                var aNodes = [];

                for (var k = 0; k < aResponse.length; k++) {
                    var oItem1 = oMaster[aResponse[k].id];
                    
                    if(oItem1) {
                        oMaster[aResponse[k].id] = Object.assign(oItem1, aResponse[k]);
                    } else {
                        oMaster[aResponse[k].id] = aResponse[k];
                    }
                }

                for (var j in oMaster) {
                    var oItem = oMaster[j];

                    if(Object.prototype.hasOwnProperty.call(oItem, "expandChildren") && oItem.expandChildren === false) {
                        oItem.expandChildren = false;
                    } else {
                        oItem.expandChildren = true;
                    }

                    oItem.expandParent = oItem.parentId && oMaster[oItem.parentId] ? false : true;
                    
                    aNodes.push({
                        "id": oItem.id,
                        "name": oItem.name || oItem.shortDesc,
                        "type": oItem.objectType,
                        "desc": oItem.shortDesc,
                        "status": (sTechnicalObjectId && sTechnicalObjectId === oItem.id) ? "Warning" : (!oItem.srcId || oItem.srcId === "BTP" ? "Information" : "Success"),
                        "icon": oItem.objectType === "EQUI" ? "sap-icon://machine" : "sap-icon://functional-location",
                        "shape": "Box",
                        "attributes": [
                            {
                                "label": "Description",
                                "value": oItem.shortDesc
                            }
                        ],
                        "isSelected": false,
                        "collapse": true,
                        "expandChildren": oItem.expandChildren,
                        "expandParent": oItem.expandParent
                    });

                    if (oMaster[oItem.id] && oMaster[oItem.parentId]) {
                        aLines.push({
                            "from": oItem.parentId,
                            "to": oItem.id,
                        });
                    }
                }

                mObjectHierarchy.setProperty("/data", {
                    nodes: aNodes,
                    lines: aLines,
                    master: oMaster
                });
                mObjectHierarchy.setProperty(sNodePath + (sType === "CHILDREN" ? "/expandChildren" : "/expandParent"), false);

                that.fnSetBusy(true);
                mObjectHierarchy.setProperty("/metadata/isBusy", true);

                setTimeout(function () {
                    that._oNetworkGraph.scrollToElement(that._oNetworkGraph.getNodeByKey(sTechnicalObjectId));
                    that.fnSetBusy(false);
                    mObjectHierarchy.setProperty("/metadata/isBusy", false);
                }, 2000);
            };

            this.fnSetBusy(true);
            mObjectHierarchy.setProperty("/metadata/isBusy", true);

            this.dataSource[sType === "CHILDREN" ? "getChildren" : "getAncestors"](sTechnicalObjectId, function (aResponse) {
                fnSetData(aResponse);
                mObjectHierarchy.setProperty("/metadata/response", that.fnMaintainResponseTrace(aResponse));
            }, function () {
                that.fnSetBusy(false);
                mObjectHierarchy.setProperty("/metadata/isBusy", false);
            });

        },

        /**
         * Function to fetch hierarchy
         * 
         * @param {String} sType - List / Detail
         * @param {String} sTechnicalObjectId - Technical Object Id
         */
        fetchHierarchy: function (sType, sTechnicalObjectId, bForceFetch, fnCallBack) {

            var that = this;
            var sEmail = this.getLoggedInUserMail();
            var mObjectHierarchy = this._mNetworkGraphModel;
            var bFetched = mObjectHierarchy.getProperty("/metadata/fetched");

            /**
             * Function to set data
             * @param {Array} aResponse 
             */
            var fnSetData = function (aResponse) {
                var oHierarchyData = mObjectHierarchy.getProperty("/data");
                var oMaster = oHierarchyData.master || {};
                var aLines = [];
                var aNodes = [];

                for (var k = 0; k < aResponse.length; k++) {
                    var oItem1 = oMaster[aResponse[k].id];
                    
                    if(oItem1) {
                        oMaster[aResponse[k].id] = Object.assign(oItem1, aResponse[k]);
                    } else {
                        oMaster[aResponse[k].id] = aResponse[k];
                    }
                }

                for (var j in oMaster) {
                    var oItem = oMaster[j];

                    oItem.expandChildren = true;
                    oItem.expandParent = oItem.parentId ? oMaster[oItem.parentId] ? false : true : false;

                    aNodes.push({
                        "id": oItem.id,
                        "name": oItem.name || oItem.shortDesc,
                        "type": oItem.objectType,
                        "desc": oItem.shortDesc,
                        "status": (sTechnicalObjectId && sTechnicalObjectId === oItem.id) ? "Warning" : (!oItem.srcId || oItem.srcId === "BTP" ? "Information" : "Success"),
                        "icon": oItem.objectType === "EQUI" ? "sap-icon://machine" : "sap-icon://functional-location",
                        "shape": "Box",
                        "attributes": [
                            {
                                "label": "Description",
                                "value": oItem.shortDesc
                            }
                        ],
                        "isSelected": false,
                        "collapse": true,
                        "expandChildren": oItem.expandChildren,
                        "expandParent": oItem.expandParent
                    });

                    if (oMaster[oItem.id] && oMaster[oItem.parentId]) {
                        aLines.push({
                            "from": oItem.parentId,
                            "to": oItem.id,
                        });
                    }
                }

                mObjectHierarchy.setProperty("/data", {
                    nodes: aNodes,
                    lines: aLines,
                    master: oMaster
                });
            };

            if (sType === "LIST") {
                if(!bFetched) {
                    this.fnSetBusy(true);
                    mObjectHierarchy.setProperty("/metadata/isBusy", true);

                    this.dataSource.getAssignments(sEmail, function (aResponse) {
                        fnSetData(aResponse);
                        var aMasterResp = mObjectHierarchy.getProperty("/metadata/response");

                        mObjectHierarchy.setProperty("/metadata", {
                            response: aMasterResp.concat(aMasterResp, aResponse),
                            fetched: true,
                            isBusy: false
                        });
                        that.fnSetBusy(false);
                        if (fnCallBack) {
                            fnCallBack(aResponse)
                        }
                    }, function () {
                        that.fnSetBusy(false);
                        mObjectHierarchy.setProperty("/metadata/fetched", false);
                        mObjectHierarchy.setProperty("/metadata/isBusy", false);
                        if (fnCallBack) {
                            fnCallBack([]);
                        }
                    });
                }
            } else if (sType === "DETAIL" && sTechnicalObjectId) {
                this.fnSetBusy(true);
                mObjectHierarchy.setProperty("/metadata/isBusy", true);
                mObjectHierarchy.setProperty("/data", {
                    nodes: [],
                    lines: [],
                    master: {}
                });

                this.dataSource.getAncestors(sTechnicalObjectId, function (aResponse) {
                    fnSetData(aResponse);
                    mObjectHierarchy.setProperty("/metadata", {
                        response: aResponse,
                        fetched: true,
                        isBusy: false
                    });
                    that.fnSetBusy(false);
                    if (fnCallBack) {
                        fnCallBack(aResponse)
                    }
                }, function () {
                    mObjectHierarchy.setProperty("/data", {
                        nodes: [],
                        lines: [],
                        master: {}
                    });
                    mObjectHierarchy.setProperty("/metadata", {
                        response: [],
                        fetched: false,
                        isBusy: false
                    });
                    that.fnSetBusy(false);
                    mObjectHierarchy.setProperty("/metadata/isBusy", false);
                    if (fnCallBack) {
                        fnCallBack([]);
                    }
                });
            }

        },

        /**
         * Function to set busy indicator for parent control
         * 
         * @param {Boolean} bBusy
         * @param {Boolean} bRefreshLayout
         */
        fnSetBusy: function (bBusy, bRefreshLayout) {

            if (this._config.busyControlId && this._oController.getView()) {
                this._oController.getView().byId(this._config.busyControlId).setBusy(bBusy);
                if (bRefreshLayout !== false) {
                    this.fnRefreshLayout();
                }
            }

        },

        /**
         * Function to refresh the layout
         */
        fnRefreshLayout: function () {

            var that = this;

            this._oNetworkGraph.setVisible(false);
            if (this._oNetworkGraph && this._oNetworkGraph.getLayoutAlgorithm()) {
                setTimeout(function () {
                    if (that._oNetworkGraph.getLayoutAlgorithm().getNodeSpacing() === 60) {
                        that._oNetworkGraph.getLayoutAlgorithm().setNodeSpacing(61);
                    } else {
                        that._oNetworkGraph.getLayoutAlgorithm().setNodeSpacing(60);
                    }
                    that._oNetworkGraph.setVisible(true);
                }, 50);
                // // this._oNetworkGraph.setOrientation("BottomTop");
                // // this._oNetworkGraph.setOrientation("TopBottom");
                // that._oNetworkGraph.setVisible(false);
                // setTimeout(function () {
                //     that._oNetworkGraph.setVisible(true);
                // }, 50);
                // if (this._oNetworkGraph._searchField) {
                //     this._oNetworkGraph._searchField.setValue("");
                // }
            }

        },

        /**
         * Function to get hierarchy response
         * 
         */
        getHierarchyResponseAsync: function (fnCallBack, iMaxTry) {

            var mObjectHierarchy = this._mNetworkGraphModel;
            iMaxTry = iMaxTry || 3;

            /**
             * Function to wait for 10 sec and check 
             */
            var fnWaitAndCheck = function () {
                var isFetched = mObjectHierarchy.getProperty("/metadata/fetched");
                var oResponse = mObjectHierarchy.getProperty("/metadata/response");

                if (isFetched || iMaxTry <= 0) {
                    fnCallBack(oResponse);
                } else {
                    iMaxTry--;
                    setTimeout(fnWaitAndCheck, 10000);
                }
            };

            fnWaitAndCheck();

        },

        /**
         * Function to get hierarchy response
         * 
         * @returns {Object} oResponse
         */
        getHierarchyResponse: function () {

            var mObjectHierarchy = this._mNetworkGraphModel;
            var oResponse = mObjectHierarchy.getProperty("/metadata/response");

            return oResponse;

        }

    });

});
