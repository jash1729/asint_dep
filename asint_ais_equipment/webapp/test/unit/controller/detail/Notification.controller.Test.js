/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/Notification.controller",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Controller, sinon) {

    "use strict";

    QUnit.module("Notification Controller - fnInitialize", {
        /**
         * beforeEach function
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oView = { getModel: sinon.stub() };
            this.oController.getView = sinon.stub().returns(this.oView);
            this.oController._oi18n = { getText: sinon.stub().returns("Notifications (0)") };
            this.oController.fnMessageShow = sinon.stub();
            this.oController.commonDataSource = {
                getNearestS4Asset: sinon.stub(),
                fetchAssignedNotifications: sinon.stub()
            };
        },
        /**
         * afterEach function
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("srcId != BTP -calls fnGetNotiifcation, skips getNearestS4Asset", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: { 
                detail: { 
                    srcId: "S4",
                    ID: "EQ1"
                },
                tabs: {
                    maintenanceservice: {} 
                }}
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.fnGetNotiifcation = sinon.stub();
        this.oController.fnInitialize();

        assert.ok(this.oController.fnGetNotiifcation.calledOnce,"fnGetNotiifcation must be called once when srcId is not BTP");
        assert.ok(this.oController.commonDataSource.getNearestS4Asset.notCalled,"getNearestS4Asset must NOT be called when srcId is not BTP");
    });

    QUnit.test("BTP + matching component ID-notification in list with resolved priority, type, componentType", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    srcId: "BTP",
                    ID: "EQ1",
                    // eslint-disable-next-line camelcase
                    parent_functional_location: {
                        name: "FLOC1",
                        // eslint-disable-next-line camelcase
                        to_description: [{ shortDescription: "FL Desc" }]
                    }
                },
                tabs: {
                    maintenanceservice: {
                        priorityList: [{ name: "1", description: "High" }],
                        notificationTypeList: [{ name: "M1", description: "Maintenance" }]
                    }
                }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "EQUI" } });
        // eslint-disable-next-line camelcase
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, {notifications: [{ notification: { priority: "1", type: "M1", breakdown: true, to_component: { name: "Motor", ID: "EQ1" } } }]});
        this.oController.fnInitialize();

        var aList = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");

        assert.strictEqual(aList.length, 1,"Exactly 1 notification should be in the list when component ID matches equipment ID");
        assert.strictEqual(aList[0].description, "High","description must be resolved from priorityList using the notification's priority name");
        assert.strictEqual(aList[0].notificationType, "Maintenance","notificationType must be resolved from notificationTypeList using the notification's type name");
        assert.strictEqual(aList[0].componentType, "EQUI","componentType must be set to 'EQUI' for notifications that have a to_component");
        assert.strictEqual(aList[0].breakdown, true,"breakdown must be coerced to boolean true");
    });

    QUnit.test("BTP + mismatched component ID- notification excluded from list", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    srcId: "BTP",
                    ID: "EQ1",
                    // eslint-disable-next-line camelcase
                    parent_functional_location: {
                        name: "", 
                        // eslint-disable-next-line camelcase
                        to_description: [{ shortDescription: "" }] 
                    } 
                },
                tabs: {
                    maintenanceservice: {
                        priorityList: [],
                        notificationTypeList: []
                    }
                }
            }
        });

        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "EQUI" } });
        // eslint-disable-next-line camelcase
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, {notifications: [{ notification: { to_component: { name: "Other", ID: "DIFFERENT" } } }]});
        this.oController.fnInitialize();

        var aList = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");
        assert.strictEqual(aList.length, 0,"Notification must be excluded when to_component.ID does not match the equipment ID");
    });

    QUnit.test("BTP + empty notifications response-model list set to empty array", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    srcId: "BTP",
                    ID: "EQ1"
                },
                tabs: { 
                    maintenanceservice: {}
                }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "EQUI" } });
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, { notifications: [] });
        this.oController.fnInitialize();

        var aList = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");
        var sTableHeader = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList/tableHeader");
        assert.deepEqual(aList, [],"Model notification list must be set to an empty array when API returns no notifications");
        assert.strictEqual(sTableHeader, "Notifications (0)","Model table header must be updated to 'Notifications (0)' when API returns no notifications");
    });

    QUnit.test("BTP + fetchAssignedNotifications error-fnMessageShow called with severity 'E'", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    srcId: "BTP",
                    ID: "EQ1"
                },
                tabs: {
                    maintenanceservice: {}
                }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "EQUI" } });
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(3, { message: "Server error" });
        this.oController.fnInitialize();

        assert.ok(this.oController.fnMessageShow.calledOnce,"fnMessageShow must be called exactly once when fetchAssignedNotifications triggers an error");
        assert.strictEqual(this.oController.fnMessageShow.firstCall.args[0], "E","First argument to fnMessageShow must be 'E' (error severity)");
    });

    QUnit.test("BTP + lowercase OBJECTTYPE in asset -uppercased before passed to fetchAssignedNotifications", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: { srcId: "BTP", ID: "EQ1" },
                tabs: { maintenanceservice: { priorityList: [], notificationTypeList: [] } }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "equi" } });
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, { notifications: [] });

        this.oController.fnInitialize();

        var sPassedObjType = this.oController.commonDataSource.fetchAssignedNotifications.firstCall.args[1];
        assert.strictEqual(sPassedObjType, "EQUI","OBJECTTYPE must be uppercased via toUpperCase() before being passed to fetchAssignedNotifications");
    });

    QUnit.test("BTP + missing OBJECTTYPE in asset -empty string passed to fetchAssignedNotifications", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: { srcId: "BTP", ID: "EQ1" },
                tabs: { maintenanceservice: { priorityList: [], notificationTypeList: [] } }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1" } });
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, { notifications: [] });
        this.oController.fnInitialize();

        var sPassedObjType = this.oController.commonDataSource.fetchAssignedNotifications.firstCall.args[1];
        assert.strictEqual(sPassedObjType, "","When OBJECTTYPE is missing, (oDataRecObjType || \"\") should pass empty string");
    });

    QUnit.test("BTP + null mapped descriptions and empty component name - fallback empty strings are applied", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    srcId: "BTP",
                    ID: "EQ1",
                    // eslint-disable-next-line camelcase
                    parent_functional_location: { 
                        name: "FLOC1", 
                        // eslint-disable-next-line camelcase
                        to_description: [{ shortDescription: "FL Desc" }] }
                },
                tabs: {
                    maintenanceservice: {
                        priorityList: [{ name: "1", description: null }],
                        notificationTypeList: [{ name: "M1", description: null }]
                    }
                }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "EQUI" } });
        // eslint-disable-next-line camelcase
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, {notifications: [{ notification: { priority: "1", type: "M1", to_component: { name: "", ID: "EQ1" } } }]
        });

        this.oController.fnInitialize();

        var aList = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");
        assert.strictEqual(aList[0].description, "","priorityMatch.description || \"\" should resolve to empty string when description is null");
        assert.strictEqual(aList[0].notificationType, "","typeMatch.description || \"\" should resolve to empty string when description is null");
        assert.strictEqual(aList[0].componentName, "","to_component.name || \"\" should resolve to empty string when name is empty");
    });

    QUnit.test("BTP + notification without to_component - else block sets empty component fields", function (assert) {
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    srcId: "BTP",
                    ID: "EQ1",
                    // eslint-disable-next-line camelcase
                    parent_functional_location: {
                        name: "FLOC1",
                        // eslint-disable-next-line camelcase
                        to_description: [{ shortDescription: "FL Desc" }] }
                },
                tabs: {
                    maintenanceservice: {
                        priorityList: [],
                        notificationTypeList: []
                    }
                }
            }
        });
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        var oNotifRec = {
            notifications: [{ notification: { priority: "X", type: "Y" } }]
        };
        this.oController.commonDataSource.getNearestS4Asset.callsArgWith(1, { data: { ID: "EQ1", OBJECTTYPE: "EQUI" } });
        this.oController.commonDataSource.fetchAssignedNotifications.callsArgWith(2, oNotifRec);
        this.oController.fnInitialize();

        assert.strictEqual(oNotifRec.notifications[0].notification.componentName, "","Else block should set componentName to empty string when to_component is missing");
        assert.strictEqual(oNotifRec.notifications[0].notification.componentID, "","Else block should set componentID to empty string when to_component is missing");
        assert.strictEqual(oNotifRec.notifications[0].notification.componentType, "","Else block should set componentType to empty string when to_component is missing");
    });
});