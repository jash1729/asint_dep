sap.ui.define([
    "sap/ui/core/Control",
    "sap/suite/ui/commons/networkgraph/Graph"
], function (Control, Graph) {
    "use strict";

    return Control.extend("com.asint.ais.library.control.CustomControl.CustomClickGroup", {

        metadata: {
            aggregations: {
                /**
                 * Internal NetworkGraph instance
                 */
                graph: {
                    type: "sap.suite.ui.commons.networkgraph.Graph",
                    multiple: false
                }
            },

            events: {
                /**
                 * Fired when a group header is clicked
                 */
                groupClick: {
                    parameters: {
                        group: { type: "object" },
                        key:   { type: "string" }
                    }
                },

                /**
                 * Fired when + button in group header is clicked
                 */
                groupPlusClick: {
                    parameters: {
                        group:  { type: "object" },
                        key:    { type: "string" },
                        domRef: { type: "object" }
                    }
                },

                /**
                 * Fired when delete button in group header is clicked
                 */
                groupDeleteClick: {
                    parameters: {
                        group:  { type: "object" },
                        key:    { type: "string" },
                        domRef: { type: "object" }
                    }
                }
            }
        },

        /**
         * Init Function
         */
        init: function () {
            var oGraph = new Graph({
                height: "auto",
                width: "100%"
            });

            this.setAggregation("graph", oGraph);

            oGraph.addEventDelegate({
                onAfterRendering: function () {
                    setTimeout(this._attachGroupClick.bind(this), 50); 
                }.bind(this)
            });

            oGraph.attachEvent("graphReady", function () {
                this._attachGroupClick();
            }.bind(this));
        },

        /**
         * Public method to access Graph
         */
        getGraph: function () {
            return this.getAggregation("graph");
        },

        /**
         * Attach click handlers to group headers
         */
        _attachGroupClick: function () {

            var oGraph = this.getGraph();

            var aGroups = oGraph.getGroups() || [];

            aGroups.forEach(function (oGroup) {

                var oDomRef = oGroup.getDomRef();
                if (!oDomRef) return;

                var oHeader = oDomRef.querySelector("[class*='GroupHeader']");
                if (!oHeader) return;

                if (!oHeader.dataset.clickAttached) {

                    oHeader.dataset.clickAttached = "true";

                    oHeader.style.cursor = "pointer";

                    oHeader.onclick = function () {
                        this.fireGroupClick({
                            group: oGroup,
                            key: oGroup.getKey()
                        });
                    }.bind(this);
                }
                
                var sKey = oGroup.getKey();
                var sLast = sKey.split("_").pop();

                var bShowDelete = sLast !== "1";

                var bShowPlus = sLast !== "3";


                var oActions = oDomRef.querySelector(".sapSuiteUiCommonsNetworkGraphGroupHeaderActions") || oDomRef.querySelector("[class*='Header']");


                if (oActions && bShowDelete && !oActions.querySelector(".customDeleteBtn")) {

                    var oDeleteBtn = document.createElement("span");

                    oDeleteBtn.className = "sapUiIcon sapSuiteUiCommonsNetworkGraphGroupHeaderAction customDeleteBtn";
                    oDeleteBtn.innerHTML = "&#xe03d;";
                    oDeleteBtn.style.fontFamily = "SAP-icons";
                    oDeleteBtn.style.cursor = "pointer";
                    oDeleteBtn.style.marginRight = "6px";

                    oDeleteBtn.onclick = function (e) {
                        e.stopPropagation();

                        this.fireEvent("groupDeleteClick", {
                            group: oGroup,
                            key: oGroup.getKey(),
                            domRef: oDeleteBtn
                        });

                    }.bind(this);

                    var oPlus = oActions.querySelector(".customPlusBtn");
                    if (oPlus) {
                        oActions.insertBefore(oDeleteBtn, oPlus);
                    } else {
                        oActions.appendChild(oDeleteBtn);
                    }
                }

                if (oActions && bShowPlus && !oActions.querySelector(".customPlusBtn")) {

                    var oBtn = document.createElement("span");

                    oBtn.className = "sapUiIcon sapSuiteUiCommonsNetworkGraphGroupHeaderAction customPlusBtn";
                    oBtn.innerHTML = "&#xe058;";
                    oBtn.style.fontFamily = "SAP-icons";
                    oBtn.style.cursor = "pointer";
                    oBtn.style.marginRight = "6px";

                    oBtn.onclick = function (e) {
                        e.stopPropagation();

                        this.fireGroupPlusClick({
                            group: oGroup,
                            key: oGroup.getKey(),
                            domRef: oBtn
                        });

                    }.bind(this);

                    oActions.appendChild(oBtn);
                }

            }.bind(this));
        },
        
        /**
         * Renderer
         */
        renderer: function (oRM, oControl) {
            oRM.openStart("div", oControl);
            oRM.style("width", "100%");
            oRM.style("height", "100%");
            oRM.openEnd();

            oRM.renderControl(oControl.getGraph());

            oRM.close("div");
        }

    });
});