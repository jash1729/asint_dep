sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.ObjectHierarchy", {

        /**
         * Ui5 lifecycle method triggered on first load of the view.
         */
        onInit: function () {

            var oData = {
                "data": {
                    "assetHierarchy": {
                        "nodes": [
                            {
                                "id": "ASINT",
                                "name": "BT01-ACDU-8IPC",
                                "type": "FL",
                                "desc": "8\" Piping Circuit",
                                "status": "Information",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "8\" Piping Circuit"
                                    }
                                ]
                            },
                            {
                                "id": "HOU",
                                "name": "BT01-ACDU-COL1",
                                "type": "FL",
                                "desc": "Corrosion Loop 1",
                                "status": "Information",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Corrosion Loop 1"
                                    }
                                ]
                            },
                            {
                                "id": "ARP-PTA",
                                "name": "BT01-ACDU-VES1",
                                "type": "FL",
                                "desc": "Vessel-1",
                                "status": "Information",
                                "icon": "sap-icon://functional-location",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Vessel-1"
                                    }
                                ]
                            },
                            {
                                "id": "10000342",
                                "name": "10000342",
                                "type": "EQU",
                                "desc": "8\" Piping Circuit",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "8\" Piping Circuit"
                                    }
                                ]
                            },
                            {
                                "id": "10000343",
                                "name": "10000343",
                                "type": "EQU",
                                "desc": "3/4\"Piping Circuit",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "3/4\"Piping Circuit"
                                    }
                                ]
                            },
                            {
                                "id": "10000344",
                                "name": "10000344",
                                "type": "EQU",
                                "desc": "2\"Piping Circuit",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "2\"Piping Circuit"
                                    }
                                ]
                            },
                            {
                                "id": "10000345",
                                "name": "10000345",
                                "type": "EQU",
                                "desc": "8\" Piping Circuit Mix Point",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "8\" Piping Circuit Mix Point"
                                    }
                                ]
                            },
                            {
                                "id": "10000346",
                                "name": "10000346",
                                "type": "EQU",
                                "desc": "2\" Piping Circuit Mix Point",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "2\" Piping Circuit Mix Point"
                                    }
                                ]
                            },
                            {
                                "id": "10000347",
                                "name": "10000347",
                                "type": "EQU",
                                "desc": "Deadleg-1",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Deadleg-1"
                                    }
                                ]
                            },
                            {
                                "id": "10000348",
                                "name": "10000348",
                                "type": "EQU",
                                "desc": "Deadleg-2",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Deadleg-2"
                                    }
                                ]
                            },
                            {
                                "id": "10000349",
                                "name": "10000349",
                                "type": "EQU",
                                "desc": "Deadleg-3",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Deadleg-3"
                                    }
                                ]
                            },
                            {
                                "id": "10000350",
                                "name": "10000350",
                                "type": "EQU",
                                "desc": "8\"Piping Circuit Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "8\"Piping Circuit Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000351",
                                "name": "10000351",
                                "type": "EQU",
                                "desc": "3/4\"Piping Circuit Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "3/4\"Piping Circuit Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000352",
                                "name": "10000352",
                                "type": "EQU",
                                "desc": "2\"Piping Circuit Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "2\"Piping Circuit Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000353",
                                "name": "10000353",
                                "type": "EQU",
                                "desc": "8\" Piping Circuit Mix Point Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "8\" Piping Circuit Mix Point Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000354",
                                "name": "10000354",
                                "type": "EQU",
                                "desc": "2\" Piping Circuit Mix Point Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "2\" Piping Circuit Mix Point Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000355",
                                "name": "10000355",
                                "type": "EQU",
                                "desc": "Deadleg-1 Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Deadleg-1 Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000356",
                                "name": "10000356",
                                "type": "EQU",
                                "desc": "Deadleg-2 Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Deadleg-2 Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000357",
                                "name": "10000357",
                                "type": "EQU",
                                "desc": "Deadleg-3 Insulated",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Deadleg-3 Insulated"
                                    }
                                ]
                            },
                            {
                                "id": "10000358",
                                "name": "10000358",
                                "type": "EQU",
                                "desc": "Circuit-1",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Circuit-1"
                                    }
                                ]
                            },
                            {
                                "id": "10000359",
                                "name": "10000359",
                                "type": "EQU",
                                "desc": "Circuit-2",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Circuit-2"
                                    }
                                ]
                            },
                            {
                                "id": "10000360",
                                "name": "10000360",
                                "type": "EQU",
                                "desc": "Circuit-3",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Circuit-3"
                                    }
                                ]
                            },
                            {
                                "id": "10000361",
                                "name": "10000361",
                                "type": "EQU",
                                "desc": "Circuit-4",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Circuit-4"
                                    }
                                ]
                            },
                            {
                                "id": "10000362",
                                "name": "10000362",
                                "type": "EQU",
                                "desc": "Circuit-5",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Circuit-5"
                                    }
                                ]
                            },
                            {
                                "id": "10000363",
                                "name": "10000363",
                                "type": "EQU",
                                "desc": "Circuit-6",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Circuit-6"
                                    }
                                ]
                            },
                            {
                                "id": "10000364",
                                "name": "10000364",
                                "type": "EQU",
                                "desc": "Corrosion Zone 1 TOP",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Corrosion Zone 1 TOP"
                                    }
                                ]
                            },
                            {
                                "id": "10000365",
                                "name": "10000365",
                                "type": "EQU",
                                "desc": "Corrosion Zone 2 BOTTOM",
                                "status": "Information",
                                "icon": "sap-icon://machine",
                                "shape": "Box",
                                "attributes": [
                                    {
                                        "label": "Description",
                                        "value": "Corrosion Zone 2 BOTTOM"
                                    }
                                ]
                            }
                        ],
                        "lines": [
                            {
                                "from": "ASINT",
                                "to": "HOU"
                            }, {
                                "from": "HOU",
                                "to": "ARP-PTA"
                            }, {
                                "from": "ASINT",
                                "to": "10000342"
                            },{
                                "from": "ASINT",
                                "to": "10000343"
                            },{
                                "from": "ASINT",
                                "to": "10000344"
                            },{
                                "from": "ASINT",
                                "to": "10000345"
                            },{
                                "from": "ASINT",
                                "to": "10000346"
                            },{
                                "from": "ASINT",
                                "to": "10000347"
                            },{
                                "from": "ASINT",
                                "to": "10000348"
                            },{
                                "from": "ASINT",
                                "to": "10000349"
                            }, {
                                "from": "ASINT",
                                "to": "10000350"
                            }, {
                                "from": "ASINT",
                                "to": "10000351"
                            }, {
                                "from": "ASINT",
                                "to": "10000352"
                            }, {
                                "from": "ASINT",
                                "to": "10000353"
                            }, {
                                "from": "ASINT",
                                "to": "10000354"
                            }, {
                                "from": "ASINT",
                                "to": "10000355"
                            }, {
                                "from": "ASINT",
                                "to": "10000356"
                            }, {
                                "from": "ASINT",
                                "to": "10000357"
                            }, {
                                "from": "HOU",
                                "to": "10000358"
                            }, {
                                "from": "HOU",
                                "to": "10000359"
                            }, {
                                "from": "HOU",
                                "to": "10000360"
                            }, {
                                "from": "HOU",
                                "to": "10000361"
                            }, {
                                "from": "HOU",
                                "to": "10000362"
                            }, {
                                "from": "HOU",
                                "to": "10000363"
                            }, {
                                "from": "ARP-PTA",
                                "to": "10000364"
                            }, {
                                "from": "ARP-PTA",
                                "to": "10000365"
                            }
                        ]
                    }
                }
            };

            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "mObjectHierarchy");
        },

        /**
         * Ui5 lifecycle method triggered before this view is rendered.
         */
        onBeforeRendering: function () { },

        /**
         * Ui5 lifecycle method triggered after this view is rendered.
         */
        onAfterRendering: function () { },

        /**
         * Ui5 lifecycle method triggered on exiting of this view.
         */
        onExit: function () { },

        /**
         * Scroll to the current Asset
         */
        onAfterGraphLoad: function () {
            
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var sEquipmentId = mEquipmentDetail.getProperty("/router/arguments/equipmentId");
            var oNetworkGraph = this.getView().byId("idNetworkGraph");

            if(oNetworkGraph.getNodeByKey(sEquipmentId)){
                oNetworkGraph.scrollToElement(oNetworkGraph.getNodeByKey(sEquipmentId));
            }

        },

        /**
         * Function to reset graph zoom and search
         */
        fnResetGraphZoomandSearch : function(){
            var mEquipmentDetail = this.getView().getModel("mEquipmentDetail");
            var isLoaded = mEquipmentDetail.getProperty("/data/tabs/hierarchy/isLoadedOnce");
            var oNetworkGraph = this.getView().byId("idNetworkGraph");
            if(!isLoaded){
                oNetworkGraph.setCurrentZoomLevel(1);
                oNetworkGraph.getToolbar().getContent().forEach(function(oControl) {
                    if (oControl.isA("sap.m.SearchField")) {
                        oControl.setValue("");
                        oControl.fireSearch({query: ""});
                    }
                });
                mEquipmentDetail.setProperty("/data/tabs/hierarchy/isLoadedOnce", true);
            }
        },

        /**
         * Function to navigate to object detail page
         * @param {Object} oEvent 
         */
        onNodeNavigate : function(oEvent){
            
            var sId = oEvent.getSource().getParent().getProperty("key");
            var sIcon = oEvent.getSource().getParent().getProperty("icon");
            var currentUrl = window.location.href;
            if (currentUrl.includes("equipment") && sIcon.includes("machine")) {
                // var modifiedUrl = "";

                // if(window.location.host.includes("localhost")){
                //     modifiedUrl = currentUrl.replace(/\/location\/[^\/]+\/detail/, `/location/${sId}/detail`);
                // } else {
                //     var sOrigin = window.location.origin;
                //     var sSubaccount = window.location.search.split("&subaccountId")[0];
                //     var sFlocId = window.location.hash.split("&/")[0]+"&/location/"+sId+"/detail";
                    
                //     modifiedUrl = sOrigin+sSubaccount+sFlocId;
                // }
                // window.open(modifiedUrl, '_blank');

                var sHashWithKeyword = this.NAVIGATION.EQUIPMENT_DETAILS;
                for (var sKey in sId) {
                    if (sId.hasOwnProperty(sKey)) {
                        var sValue = sId[sKey];
                        sHashWithKeyword = sHashWithKeyword.replace("{" + sKey + "}", sValue);
                    }
                }
                sHashWithKeyword = sHashWithKeyword.replace("{equipmentId}", sId);
                var newUrl = window.location.origin + "/#" + sHashWithKeyword
                window.open(newUrl, '_blank');
            } else {
                var sHashWithFLOCKeyword = this.NAVIGATION.LOCATION_DETAIL;
                
                for (var sFLOCKey in sId) {
                    if (sId.hasOwnProperty(sKey)) {
                        var sFLOCValue = sId[sKey];
                        sHashWithFLOCKeyword = sHashWithFLOCKeyword.replace("{" + sFLOCKey + "}", sFLOCValue);
                    }
                }
                sHashWithFLOCKeyword = sHashWithFLOCKeyword.replace("{functionallocationId}", sId);
                var newFLOCUrl = window.location.origin + "/#" + sHashWithFLOCKeyword
                window.open(newFLOCUrl, '_blank');
            }
        }
    });
});