/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/Groups.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel, sinon) {
    "use strict";

    QUnit.module("Groups", {
        /**
         * beforeEach function
        */
        beforeEach: function () {
            this.oController = new Controller();

            this.oView = {
                getModel: sinon.stub(),
                setModel: sinon.spy(),
                addDependent: sinon.spy(),
                byId: sinon.spy()
            };
            this.oController.getView = sinon.stub().returns(this.oView);

            var oBundle = {
                getText: sinon.stub().returns("dummy")
            };
            var oI18nModel = {
                getResourceBundle: sinon.stub().returns(oBundle)
            };

            this.mEquipmentDetail = new JSONModel({
                router: {
                    arguments: {
                        equipmentId: "EQUIP12345"
                    }
                },
                data: {
                    tabs: {
                        components: {
                            groups : {
                                groupsLength : 0,
                                groupsList : []
                            },
                        }
                    }
                }
            });

            this.oView.getModel.withArgs("i18n").returns(oI18nModel);
            this.oView.getModel.withArgs("mEquipmentDetail").returns(this.mEquipmentDetail);
        },

        /**
         * afterEach Function
         */
        afterEach: function () {
          sinon.restore(); 
        }

    });

    QUnit.test("fnInitialize", function (assert) {

        this.oController.fnFetchGroups = sinon.spy();
        this.oController.fnInitialize();

        assert.ok(this.oController.fnFetchGroups.calledOnce, "fnFetchGroups should be called once");
    });

    QUnit.test("fnFetchGroups - Success callback with mock data", function (assert) {

        this.oController.commonDataSource = {
            "getGroupsByTechnicalObjectId" : sinon.stub()
        }

        var aMockResponse = [
            { streamId: "1234", templateId: "123456" },
            { streamId: "4567", templateId: "7891011" }
        ];

        this.oController.commonDataSource.getGroupsByTechnicalObjectId.callsArgWith(2,aMockResponse);
        this.oController.fnFetchGroups();

        var aGroupsList = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsList");
        var iGroupsLength = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsLength");

        assert.deepEqual(aGroupsList, aMockResponse, "Groups list should be set correctly");
        assert.equal(iGroupsLength, 2, "Groups length should be set correctly");

    });

    QUnit.test("fnFetchGroups - Success callback with empty mock data", function (assert) {

        this.oController.commonDataSource = {
            "getGroupsByTechnicalObjectId" : sinon.stub()
        }

        var aMockResponse = [];
        this.oController.commonDataSource.getGroupsByTechnicalObjectId.callsArgWith(2,aMockResponse);
        this.oController.fnFetchGroups();

        var aGroupsList = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsList");
        var iGroupsLength = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsLength");

        assert.deepEqual(aGroupsList, aMockResponse, "Groups list should be set correctly");
        assert.equal(iGroupsLength, 0, "Groups length should be set correctly");

    });

    QUnit.test("fnFetchGroups - Error callback with empty mock data", function (assert) {

        this.oController.commonDataSource = {
            "getGroupsByTechnicalObjectId" : sinon.stub()
        }

        this.oController.fnMessageShow = sinon.spy();

        var aMockResponse = [];
        this.oController.commonDataSource.getGroupsByTechnicalObjectId.callsArgWith(3,aMockResponse);
        this.oController.fnFetchGroups();

        var aGroupsList = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsList");
        var iGroupsLength = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsLength");

        assert.deepEqual(aGroupsList, aMockResponse, "Groups list should be set correctly");
        assert.equal(iGroupsLength, 0, "Groups length should be set correctly");
        assert.ok(this.oController.fnMessageShow.calledOnce, "fnMessageShow should be called once");

    });

    QUnit.test("onSearchGroupsTable - with Squery", function (assert) {

        var oEvent = {
            getSource : function () {
                return {
                    getValue : function () {
                        return "1234"
                    }
                }
            }
        }

        var oTable = {
                getBinding: sinon.stub().withArgs("items").returns({
                    refresh: sinon.spy(),
                    getLength : sinon.stub().returns(1),
                    filter : sinon.spy()
                }),
            };

        this.oController.getView().byId = sinon
                .stub()
                .withArgs("idTableGroups")
                .returns(oTable);

        this.oController.onSearchGroupsTable(oEvent);

        var aGroupsList = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsList");
        var iGroupsLength = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsLength");

        assert.deepEqual(aGroupsList, [], "Groups list should be set correctly");
        assert.equal(iGroupsLength, 1, "Groups length should be set correctly");

    });

    QUnit.test("onSearchGroupsTable - with empty Squery", function (assert) {

        var oEvent = {
            getSource : function () {
                return {
                    getValue : function () {
                        return "1234"
                    }
                }
            }
        }

        var oTable = {
                getBinding: sinon.stub().withArgs("items").returns({
                    refresh: sinon.spy(),
                    getLength : sinon.stub().returns(5),
                    filter : sinon.spy()
                }),
            };

        this.oController.getView().byId = sinon
                .stub()
                .withArgs("idTableGroups")
                .returns(oTable);

        this.oController.onSearchGroupsTable(oEvent);

        var iGroupsLength = this.oController.getView().getModel("mEquipmentDetail").getProperty("/data/tabs/components/groups/groupsLength");
        
        assert.equal(iGroupsLength, 5, "Groups length should be set correctly");

    });

    QUnit.test("onPressLink - GROUPS", function (assert) {

        var oEvent = {
            getSource : function () {
                return {
                    getBindingContext : function () {
                        return {
                            getObject : function(){
                                return {"streamId" : "1234"}
                            }
                        }
                    }
                }
            }
        }

        this.oController.NAVIGATION = {
            "PROCESS_GROUPS_DETAIL" : "functionallocation-manage&/stream/{streamId}/detail",
            "ASSESSMENT_TEMPLATE_DETAIL" : "assessmenttemp-manage&/detail/{assessmentTemplateId}"
        };

        this.oController.setNavUrl = sinon.spy();

        this.oController.onPressLink(oEvent,"GROUPS");        
        assert.ok(this.oController.setNavUrl.calledOnce, "setNavUrl should be called once");

    });

    QUnit.test("onPressLink - ASSESSMENT_TEMPLATE", function (assert) {

        var oEvent = {
            getSource : function () {
                return {
                    getBindingContext : function () {
                       return {
                            getObject : function(){
                                return {"templateId" : "1234"}
                            }
                        }
                    }
                }
            }
        }

        this.oController.NAVIGATION = {
            "PROCESS_GROUPS_DETAIL" : "functionallocation-manage&/stream/{streamId}/detail",
            "ASSESSMENT_TEMPLATE_DETAIL" : "assessmenttemp-manage&/detail/{assessmentTemplateId}"
        };

        this.oController.setNavUrl = sinon.spy();

        this.oController.onPressLink(oEvent,"GROUPS");        
        assert.ok(this.oController.setNavUrl.calledOnce, "setNavUrl should be called once");

    });
});