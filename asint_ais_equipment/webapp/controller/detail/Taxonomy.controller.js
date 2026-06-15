sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Taxonomy", {
        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () {
            this.busyDialog = new sap.m.BusyDialog(); 
            this.fnFetchEquipments();
        },

        /**
		 * @description Function to fetch locations list
		 * @author      sarath.merangi@asint.net
         *  @param      {equData} Fetched Equipments List
		 */
        fnFetchLocations:function(equData){
            var that = this;
            var oModel = this.getView().getModel("mEquipmentDetail");
            this.doAjax("/asint/odata/v4/MasterDataService/FunctionalLocations?$expand=to_description,to_component_equipment,to_component_location","GET",null,function(oData){
                oModel.setProperty("/data/hierarchyData/locationResponse",oData.value);
                that.fnFormatDataForNetworkGraph(equData, oData.value);
            }.bind(this),function(){
                MessageToast.show("Failed to fetch Equipment and Locations");
            }.bind(this));
        },

        /**
		 * @description Function to fetch the Equipments
		 * @author      sarath.merangi@asint.net
         *  @param      
		 */
        fnFetchEquipments:function(){
            var that = this;
            this.busyDialog.open();
            var oModel = this.getView().getModel("mEquipmentDetail");
            this.doAjax("/asint/odata/v4/MasterDataService/Equipments?$expand=to_description,to_component_equipment","GET",null,function(oData){
                var equData = oData.value;
                oModel.setProperty("/data/hierarchyData/equipmentResponse",equData);
                that.fnFetchLocations(equData);
            }.bind(this),function(){
                that.busyDialog.close();
                MessageToast.show("Failed to fetch Equipment and Locations");
            }.bind(this));
        },

        /**
		 * @description Function to format the data for network graph
		 * @author      sarath.merangi@asint.net
         *  @param      {aEquipments,aLocations} Fetched Equipments, Locations
		 */
        fnFormatDataForNetworkGraph:function(aEquipments, aLocations){
            var oModel = this.getView().getModel("mEquipmentDetail");
            var that = this;
            var aNetworkGraphNodes = [];
            var aNetworkGraphLines = [];
            if(aLocations.length > 0){
                for(var i = 0; i < aLocations.length; i++){
                    var oNodeObj = {
                        "id": aLocations[i].id,
                        "name": aLocations[i].name,
                        "type": "FL",
                        "desc": "",
                        "status": "Standard",
                        "icon": "sap-icon://functional-location",
                        "shape": "Box",
                        "attributes": [
                            {
                                "label": "Description",
                                "value": aLocations[i].name
                            }
                        ]
                    };
                    aNetworkGraphNodes.push(oNodeObj);
                    if(aLocations[i].to_component_equipment.length > 0){
                        aLocations[i].to_component_equipment.forEach(function(equChild){
                            if(equChild.deleted != true){
                                var oLineObj = {
                                    "from":equChild.functionalLocation_id,
                                    "to":equChild.equipment_id
                                };
                                aNetworkGraphLines.push(oLineObj);
                            }
                        });
                    }
                    if(aLocations[i].to_component_location.length > 0){
                        aLocations[i].to_component_location.forEach(function(locChild){
                            if(locChild.deleted != true){
                                var oLineObj = {
                                    "from":locChild.functionalLocation_id,
                                    "to":locChild.childLocation_id
                                };
                                aNetworkGraphLines.push(oLineObj);
                            }
                        });
                    }
                }
            }
            if(aEquipments.length > 0){
                aEquipments.forEach(function(equObj){
                    var oNodeObj = {
                        "id": equObj.id,
                        "name": equObj.name,
                        "type": "EQU",
                        "desc": "",
                        "status": "Standard",
                        "icon": "sap-icon://BusinessSuiteInAppSymbols/icon-equipment",
                        "shape": "Box",
                        "attributes": [
                            {
                                "label": "Description",
                                "value": equObj.name
                            }
                        ]
                    };
                    aNetworkGraphNodes.push(oNodeObj);
                    if(equObj.to_component_equipment.length > 0){
                        equObj.to_component_equipment.forEach(function(equChild){
                            if(equChild.deleted != true){
                                var oLineObj = {
                                    "from":equChild.equipment_id,
                                    "to":equChild.childEquipment_id
                                };
                                aNetworkGraphLines.push(oLineObj);
                            }
                        });
                    }
                });
            }
            oModel.setProperty("/data/hierarchyData/nodes",aNetworkGraphNodes);
            oModel.setProperty("/data/hierarchyData/lines",aNetworkGraphLines);
            oModel.refresh();
            that.busyDialog.close();
        },

        /**
		 * @description Function to change node mappings and to open the dialog
		 * @author      sarath.merangi@asint.net
         *  @param      {sap.ui.base.Event} oEvent SAP UI5 Event Object
		 */
        fnNetworkGraphMapper : function(oEvent, sMode) {
            var oModel = this.getView().getModel("mEquipmentDetail");
            var that = this;
            /**
             * function for  callbacks
             */
            var fnApply = function() {
                that.busyDialog.open();
                var aNodes = oModel.getProperty("/data/hierarchyData/lines");
                var allNodes = oModel.getProperty("/data/hierarchyData/nodes");
                var locationRes = oModel.getProperty("/data/hierarchyData/locationResponse");
                var equipmentRes = oModel.getProperty("/data/hierarchyData/equipmentResponse");
                var childEqu = [];
                var childLoc = [];
                var rejectCount = 0;
                var sUrl;
                var oNode = Object.assign({}, oModel.getProperty("/data/settings/map"));
                if (oNode.from) {
                    var curParentItem;
                    allNodes.forEach(function(node){
                        if(oNode.from === node.id){
                            curParentItem = node;
                        }
                    });
                    aNodes = aNodes.filter(function(oItem) {
                        return oItem.from !== oNode.from;
                    });
                    oNode.to.forEach(function(sTo) {
                        aNodes.push({
                            from: oNode.from,
                            to: sTo
                        });
                        var curChildItem;
                        allNodes.forEach(function(node){
                            if(sTo === node.id){
                                curChildItem = node;
                            }
                        });
                        if(curParentItem.type === "FL"){
                            if(curChildItem.type === "FL"){
                                childLoc.push({
                                    "functionalLocation_id": oNode.from,
                                    "childLocation_id": sTo,
                                    "deleted":false
                                });
                            }else{
                                childEqu.push({
                                    "functionalLocation_id": oNode.from,
                                    "equipment_id": sTo,
                                    "deleted":false
                                });
                            }
                        }else{
                            if(curChildItem.type === "FL"){
                                rejectCount++;
                            }else{
                                childEqu.push({
                                    "equipment_id": oNode.from,
                                    "childEquipment_id": sTo,
                                    "deleted":false
                                });
                            }
                        }
                    });
                    /*eslint-disable*/

                    if(curParentItem.type === "FL"){
                        sUrl = "/asint/odata/v4/MasterDataService/FunctionalLocations(" + oNode.from + ")";
                        var oPayload = {};
                        locationRes.forEach(function(locItem){
                            if(locItem.id === oNode.from){
                                oPayload = locItem
                            }
                        });
                        var deletedEquNodes = [];
                        oPayload.to_component_equipment.forEach(function(equNode){
                            var matchedItems = childEqu.filter(function(newNode){
                                return newNode.childEquipment_id === equNode.childEquipment_id;
                            });
                            if(matchedItems.length < 1){
                                deletedEquNodes.push(equNode);
                            }
                        });
                        var a=0;
                        for( a = 0; a < deletedEquNodes.length; a++){
                            deletedEquNodes[a].deleted = true;
                            childEqu.push(deletedEquNodes[a]);
                        }

                        var deletedLocationNodes = [];
                        oPayload.to_component_location.forEach(function(locNode){
                            var matchedItems = childLoc.filter(function(newNode){
                                return newNode.childLocation_id === locNode.childLocation_id;
                            });
                            if(matchedItems.length < 1){
                                deletedLocationNodes.push(locNode);
                            }
                        });
                        for( a = 0; a < deletedLocationNodes.length; a++){
                            deletedLocationNodes[a].deleted = true;
                            childLoc.push(deletedLocationNodes[a]);
                        }
                        oPayload.to_component_equipment = childEqu;
                        oPayload.to_component_location = childLoc;
                    }else{
                        sUrl = "/asint/odata/v4/MasterDataService/Equipments(" + oNode.from + ")";
                        var oPayload = {};
                        equipmentRes.forEach(function(equItem){
                            if(equItem.id === oNode.from){
                                oPayload = equItem
                            }
                        })

                        var deletedEquNodes = [];
                        oPayload.to_component_equipment.forEach(function(equNode){
                            var matchedItems = childEqu.filter(function(newNode){
                                return newNode.childEquipment_id === equNode.childEquipment_id;
                            });
                            if(matchedItems.length < 1){
                                deletedEquNodes.push(equNode);
                            }
                        });
                        for( a = 0; a < deletedEquNodes.length; a++){
                            deletedEquNodes[a].deleted = true;
                            childEqu.push(deletedEquNodes[a]);
                        }

                        oPayload.to_component_equipment = childEqu;
                    }
                    if(rejectCount > 0){
                        MessageBox.information(rejectCount + " Objects will be skipped as Locations cannot be assigned as child to Equipments");
                    }
                    that.doAjax(sUrl,"PUT",oPayload,function(oData){
                        that.busyDialog.close();
                        that.fnFetchEquipments();
                        MessageToast.show("Selcted objects assigned successfully");
                    }.bind(that),function(oError){
                        that.busyDialog.close();
                        var err = oError.getParameter("responseText");
                        err = JSON.parse(err);
                        var errorDetail = "";
                        if(err.error.message){
                            errorDetail = err.error.message;
                        }
                        that.fnMessageShow("E","Something went wrong",errorDetail);
                        // MessageToast.show("Something went wrong");
                    }.bind(that));
                    // oModel.setProperty("/data/hierarchyData/lines", aNodes);
                }
            };
            var fnSetTo = function(sFrom) {
                var sParentId;
                if(sFrom){
                    sParentId = sFrom;
                }else{
                    sParentId = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject().id;
                }
                var aNodes = oModel.getProperty("/data/hierarchyData/lines");
                var aTo = [];
                aNodes.forEach(function(oNode) {
                    if (oNode.from === sParentId) {
                        aTo.push(oNode.to);
                    }
                });
                oModel.setProperty("/data/settings/map", {
                    from: sParentId,
                    to: aTo
                });
            };
            if (!this._networkGraphMapper) {
                this._networkGraphMapper = new sap.m.Dialog({
                    title: "Assign/Unassign Equipment",
                    draggable: true,
                    contentWidth:"30%",
                    buttons: [new sap.m.Button({
                        type: "Emphasized",
                        text: "Apply",
                        press: function() {
                            fnApply();
                        }
                    }), new sap.m.Button({
                        text: "Apply & Close",
                        press: function() {
                            fnApply();
                            oModel.setProperty("/data/settings/map", {
                                "from": "",
                                "to": ""
                            });
                            that._networkGraphMapper.close();
                        }
                    }), new sap.m.Button({
                        text: "Cancel",
                        press: function() {
                            that._networkGraphMapper.close();
                        }
                    })],
                    content: [new sap.ui.layout.form.SimpleForm({
                        content: [new sap.m.Label({
                            text: "Parent"
                        }), new sap.m.ComboBox({
                            selectedKey: "{mEquipmentDetail>/data/settings/map/from}",
                            items: {
                                path: "mEquipmentDetail>/data/hierarchyData/nodes",
                                template: new sap.ui.core.Item({
                                    key: "{mEquipmentDetail>id}",
                                    text: "{mEquipmentDetail>name}"
                                })
                            },
                            change: function(oEvent) {
                                fnSetTo(oEvent.getSource().getSelectedKey());
                            }
                        }), new sap.m.Label({
                            text: "Child"
                        }), new sap.m.MultiComboBox({
                            selectedKeys: "{mEquipmentDetail>/data/settings/map/to}",
                            items: {
                                path: "mEquipmentDetail>/data/hierarchyData/nodes",
                                template: new sap.ui.core.Item({
                                    key: "{mEquipmentDetail>id}",
                                    text: "{mEquipmentDetail>name}"
                                })
                            }
                        }), ]
                    })]
                });
            }
            this.getView().addDependent(this._networkGraphMapper); 
            if (sMode === "Update") {
                fnSetTo();
            }
            this._networkGraphMapper.open();
        },

    });
});