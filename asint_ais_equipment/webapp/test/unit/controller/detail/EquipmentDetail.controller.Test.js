/*global QUnit*/

sap.ui.define([
    "comasintaismiequipment/equipment/controller/detail/EquipmentDetail.controller",
    "sap/ui/core/routing/Router",
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/json/JSONModel",
    "sap/m/ScrollContainer",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Label",
    "sap/m/Panel",
    "sap/m/Toolbar",
    "sap/ui/core/Icon"
], function (Controller, Router, sinon, JSONModel) {
    "use strict";

    QUnit.module("EquipmentDetail Controller", {
        /**
         * beforeEach function
        */
        beforeEach: function () {
            this.oAppController = new Controller();

            this.oView = {
                getModel: sinon.stub(),
                setModel: sinon.spy(),
                addDependent: sinon.spy(),
                byId: sinon.stub()
            };
            this.oAppController.getView = sinon.stub().returns(this.oView);

            this.oCommonModel = new sap.ui.model.json.JSONModel({
                metadata: {
                    ValueHelps: {
                        isEnumsLoaded: false
                    },
                    featureFlag: {
                        legacyEquiTag: "0"
                    } 
                }
            });

            this.oView.getModel.withArgs("mEquipment").returns(this.oCommonModel);

            /**
             * @description Stub for i18n model returning dummy text for all getText calls.
             */
            var oI18n = {
                getResourceBundle: sinon.stub().returns({
                    getText: sinon.stub().returns("dummy text")
                })
            };
            this.oView.getModel.withArgs("i18n").returns(oI18n);

            /**
             * @description Stubs for all controller methods called inside fnInitialize
             */
            this.oAppController.fnLoadValueHelp           = sinon.stub();
            this.oAppController.fnInitObjectHierarchy     = sinon.stub();
            this.oAppController.fnFetchComponentTypeList  = sinon.stub();
            this.oAppController.fnFetchEquipmentDetail    = sinon.stub();
            this.oAppController._fnLoadUoM                = sinon.stub();
            this.oAppController.getUserRoles              = sinon.stub();
            this.oAppController.fnGetNotiifcationPriority = sinon.stub();
            this.oAppController.fnGetNotiifcationType     = sinon.stub();
            this.oAppController.fnSetObjectPageSelectedTab= sinon.stub();
            this.oAppController.fnLoadObjectHierarchy     = sinon.stub();
            this.oAppController.fnFetchEquipmentEnums     = sinon.stub();
            this.oAppController.fnGetUnitLocation         = sinon.stub();
            this.oAppController.fnLoadFeatureFlagConfig   = sinon.stub();

            /**
             * @description Stub for busyDialog to prevent real dialog rendering.
             */
            this.oAppController.busyDialog= { open: sinon.stub(), close: sinon.stub() };

            /**
             * @description Stub for router to prevent real navigation.
             */
            this.oAppController.getRouter = sinon.stub().returns({
                getRoute: sinon.stub().returns({ attachPatternMatched: sinon.stub() }),
                navTo: sinon.stub()
            });

            /**
             * @description Stub for owner component returning a fake mEquipment model.
             */
            this.oAppController.getOwnerComponent = sinon.stub().returns({
                getModel: sinon.stub().returns({
                    getProperty: sinon.stub().returns(false),
                    setProperty: sinon.spy()
                })
            });

            /**
             * @description Fake ObjectPageLayout with one section to satisfy fnInitialize's byId call.
             */
            var oFakeSection = { getId: sinon.stub().returns("section1"), data: sinon.stub().returns("generalData") };
            var oFakeObjectPageLayout = {
                getSections: sinon.stub().returns([oFakeSection]),
                setSelectedSection: sinon.stub()
            };
            this.oView.byId.withArgs("_ID_ObjectPageLayout").returns(oFakeObjectPageLayout);

        },

        /**
         * afterEach Function
         */
        afterEach: function () {
            sinon.restore();
        }

    });

    QUnit.test("Should be able to set data for criticality", function (assert) {
        // oData object to set in model
        var oData = {
            "data":{
                "detail":{
                    "ID":"123",
                    "name":"Equipment 123",
                    // eslint-disable-next-line camelcase
                    "to_description":[{"shortDescription":"Test Equipment"}]
                },
                "assetIntelligence":{
                    "highlights":{}
                }
            }
        };
        var aResponse = [
            {
                "modifiedat": "2025-11-20T07:38:55.959+00:00",
                "criticalitytext": "Less Critical",
                "rcatemplateid": "57f83a9d-a3ac-4df7-9e59-244e63814eb2",
                "rcaassesmentstatus": "PBD",
                "rcatemplatename": "RNCT.13",
                "criticalitycode": "C",
                "rcatemplateshortdesc": "Asset Criticality Template-Alphanumeric",
                "rcaassesmentid": "aeed31a0-770a-4b44-b702-e274f51539b9",
                "rcaassesmentshortdesc": "demo 1",
                "createdby": "ayush.sharma@asint.net",
                "rcaassesmentname": "RNC.72",
                "riskscore": "SHE IV/ FIN IV",
                "rcaassesmentcreatedat": "2025-11-07T11:37:25.115+00:00",
                "modifiedby": "mohd.dabeer@asint.net"
            }
        ];
        var oModel = new sap.ui.model.json.JSONModel(oData);

        this.oView.getModel = sinon.stub();
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        var oI18n = {
            getResourceBundle: sinon.stub().returns({
                getText: sinon.stub().returns("dummy text")
            })
        };
        this.oView.getModel.withArgs("i18n").returns(oI18n);
        this.oAppController._oi18n = { 
            /**
             * @description Stub for i18n getText 
             */
            getText: function () { return "Created successfully"; }
        };
        
        this.oAppController.dataSource = {
            "fnGetRnCAssessment": sinon.stub()
        }
        this.oAppController.dataSource.fnGetRnCAssessment.callsArgWith(1, aResponse);
        // this.oAppController.setStrategyTable = sinon.stub();
        this.oAppController.fnGetRiskSummary();

        assert.strictEqual(oModel.getProperty("/data/assetIntelligence/highlights/criticalityCode"), "C", "Criticality value set");
    });

    /**
     * @description Comprehensive test for fnGetRiskSummary with sorting, filtering, and state mapping
     */
    QUnit.test("fnGetRiskSummary - should process multiple assessments with correct sorting, filtering and state mapping", function (assert) {
        var oData = {
            "data": {
                "detail": {
                    "ID": "EQ-001",
                    "name": "Test Equipment",
                    "to_description": [{"shortDescription": "Test Equipment Description"}]
                },
                "assetIntelligence": {
                    "highlights": {},
                    "RiskCriticality": {}
                }
            }
        };
        
        var aResponse = [
            {
                "modifiedat": "2025-10-15T10:30:00.000+00:00",
                "criticalitytext": "Most Critical",
                "rcatemplateid": "template-1",
                "rcaassesmentstatus": "PBD",
                "rcatemplatename": "RNCT.01",
                "criticalitycode": "A",
                "rcatemplateshortdesc": "Template Alpha",
                "rcaassesmentid": "assess-1",
                "rcaassesmentshortdesc": "Assessment Alpha",
                "createdby": "user1@test.com",
                "rcaassesmentname": "RNC.01",
                "riskscore": "SHE V/ FIN V",
                "rcaassesmentcreatedat": "2025-10-01T08:00:00.000+00:00",
                "modifiedby": "user1@test.com"
            },
            {
                "modifiedat": "2025-11-20T14:45:00.000+00:00",
                "criticalitytext": "Critical",
                "rcatemplateid": "template-2",
                "rcaassesmentstatus": "PBD",
                "rcatemplatename": "RNCT.02",
                "criticalitycode": "B",
                "rcatemplateshortdesc": "Template Beta",
                "rcaassesmentid": "assess-2",
                "rcaassesmentshortdesc": "Assessment Beta",
                "createdby": "user2@test.com",
                "rcaassesmentname": "RNC.02",
                "riskscore": "SHE IV/ FIN IV",
                "rcaassesmentcreatedat": "2025-11-01T09:00:00.000+00:00",
                "modifiedby": "user2@test.com"
            },
            {
                "modifiedat": "2025-09-05T08:15:00.000+00:00",
                "criticalitytext": "Low Critical",
                "rcatemplateid": "template-3",
                "rcaassesmentstatus": "DRAFT",
                "rcatemplatename": "RNCT.03",
                "criticalitycode": "D",
                "rcatemplateshortdesc": "Template Gamma",
                "rcaassesmentid": "assess-3",
                "rcaassesmentshortdesc": "Assessment Gamma",
                "createdby": "user3@test.com",
                "rcaassesmentname": "RNC.03",
                "riskscore": "SHE II/ FIN II",
                "rcaassesmentcreatedat": "2025-09-01T07:00:00.000+00:00",
                "modifiedby": "user3@test.com"
            }
        ];
        
        var oModel = new sap.ui.model.json.JSONModel(oData);
        
        this.oView.getModel = sinon.stub();
        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        
        var oI18n = {
            getResourceBundle: sinon.stub().returns({
                getText: sinon.stub().returns("Risk & Criticality (3)")
            })
        };
        this.oView.getModel.withArgs("i18n").returns(oI18n);
        
        this.oAppController._oi18n = { 
            getText: sinon.stub().returns("Risk & Criticality (3)")
        };
        
        this.oAppController.formatter = {
            formatDate: sinon.stub().returns("11/20/2025")
        };
        
        this.oAppController.dataSource = {
            "fnGetRnCAssessment": sinon.stub()
        };
        this.oAppController.dataSource.fnGetRnCAssessment.callsArgWith(1, aResponse);
        
        this.oAppController.fnGetRiskSummary();
        
        var oHighlights = oModel.getProperty("/data/assetIntelligence/highlights");
        var aAssessmentData = oModel.getProperty("/data/assetIntelligence/RiskCriticality/assessmentFinalData");
        
        assert.strictEqual(aAssessmentData[0].rcaassesmentid, "assess-2", "Most recent assessment should be first after sorting");
        assert.strictEqual(aAssessmentData[aAssessmentData.length - 1].rcaassesmentid, "assess-3", "Oldest assessment should be last");
        
        assert.strictEqual(oHighlights.criticalityCode, "B", "Criticality code should be 'B' from most recent released assessment");
        assert.strictEqual(oHighlights.criticalityText, "Critical", "Criticality text should match");
        assert.strictEqual(oHighlights.state, "Warning", "State should be 'Warning' for criticality code B");
        
        assert.ok(oHighlights.highestRiskScore.indexOf("SHE IV/ FIN IV") > -1, "Risk score should be set correctly");
        
        assert.strictEqual(aAssessmentData.length, 3, "All assessments should be in final data array");
        
        assert.ok(this.oAppController.formatter.formatDate.called, "Date formatter should be called");
    });

    /**
     * @description Tests fnGetUnitLocation is called directly when feature flag is loaded.
     */
    QUnit.test(
        "fnInitialize should call fnGetUnitLocation directly when feature flag is already loaded",
        function (assert) {
            this.oCommonModel.setProperty("/metadata/featureFlag/isLoaded", true);
            this.oCommonModel.setProperty("/metadata/ValueHelps/isEnumsLoaded", true);

            this.oView.getModel.withArgs("mEquipment").returns(this.oCommonModel);
            var oI18n = {
                getResourceBundle: sinon.stub().returns({
                    getText: sinon.stub().returns("dummy text")
                })
            };
            this.oView.getModel.withArgs("i18n").returns(oI18n);

            var oFakeDetailModel = new sap.ui.model.json.JSONModel({});
            this.oView.getModel.withArgs("mEquipmentDetail").returns(oFakeDetailModel);

            var oFakeEvent = {
                getParameter: sinon.stub().withArgs("arguments").returns({ equipmentId: "EQ-001" })
            };

            this.oAppController.fnInitialize(oFakeEvent);

            assert.ok(this.oAppController.fnGetUnitLocation.calledOnce,"fnGetUnitLocation should be called directly when feature flag is loaded");
            assert.ok(this.oAppController.fnLoadFeatureFlagConfig.notCalled,"fnLoadFeatureFlagConfig should NOT be called when feature flag is already loaded");
        }
    );

    /**
     * @description Tests fnLoadFeatureFlagConfig is called first and fnGetUnitLocation
     *is invoked in its callback when feature flag is not loaded.
     */
    QUnit.test(
        "fnInitialize should call fnLoadFeatureFlagConfig and then fnGetUnitLocation when feature flag is NOT loaded",
        function (assert) {
            this.oCommonModel.setProperty("/metadata/featureFlag/isLoaded", false);
            this.oCommonModel.setProperty("/metadata/ValueHelps/isEnumsLoaded", true);
            this.oView.getModel.withArgs("mEquipment").returns(this.oCommonModel);
            var oI18n = {
                getResourceBundle: sinon.stub().returns({
                    getText: sinon.stub().returns("dummy text")
                })
            };
            this.oView.getModel.withArgs("i18n").returns(oI18n);
            this.oAppController.fnLoadFeatureFlagConfig = sinon.stub().callsArg(0);

            var oFakeDetailModel = new sap.ui.model.json.JSONModel({});
            this.oView.getModel.withArgs("mEquipmentDetail").returns(oFakeDetailModel);

            var oFakeEvent = {getParameter: sinon.stub().withArgs("arguments").returns({ equipmentId: "EQ-002" })};

            this.oAppController.fnInitialize(oFakeEvent);

            assert.ok(this.oAppController.fnLoadFeatureFlagConfig.calledOnce,"fnLoadFeatureFlagConfig should be called when feature flag is NOT loaded");
            assert.ok(this.oAppController.fnGetUnitLocation.calledOnce,"fnGetUnitLocation should be called inside the fnLoadFeatureFlagConfig callback");
        }
    );

    // Notification fetching tests
    QUnit.test("fnGetNotiifcation - should set notification list and apply mapping + fallback logic", function (assert) {
        var done = assert.async();
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    ID: "EQ001",
                    // eslint-disable-next-line camelcase
                    parent_functional_location: {
                        name: "FLOC1",
                        // eslint-disable-next-line camelcase
                        to_description: [{ shortDescription: "FLOC DESC" }]
                    }
                },
                tabs: {
                    maintenanceservice: {
                        priorityList: [
                            { name: "1", description: "High" }
                        ],
                        notificationTypeList: [
                            { name: "M1", description: "Maintenance" }
                        ]
                    }
                }
            }
        });

        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oAppController.dataSource = {getAssignedNotifications: sinon.stub()};

        var oResponse = {
            notifications: [
                // normal mapping
                {
                    notification: {
                        priority: "1",
                        type: "M1",
                        breakdown: true,
                        functionalLocationName: null,
                        functionalLocationDesc: null,
                        // eslint-disable-next-line camelcase
                        to_component: {
                            name: "Motor",
                            ID: "CMP001"
                        }
                    }
                },

                {
                    notification: {
                        priority: "UNKNOWN",
                        type: "UNKNOWN"
                    }
                },

                // to_floc_component branch with empty name/id to cover || ""
                {
                    notification: {
                        priority: "1",
                        type: "M1",
                        // eslint-disable-next-line camelcase
                        to_floc_component: {
                            name: "",
                            ID: ""
                        }
                    }
                },

                // functional location already present (truthy branch )
                {
                    notification: {
                        priority: "1",
                        type: "M1",
                        functionalLocationName: "LOCAL-FLOC",
                        functionalLocationDesc: "LOCAL-FLOC-DESC"
                    }
                }
            ]
        };

        this.oAppController.dataSource.getAssignedNotifications.callsArgWith(1, oResponse);
        this.oAppController.fnGetNotiifcation();
        var result = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");

        // Normal mapping assertions
        assert.strictEqual(result[0].description, "High", "Priority mapped");
        assert.strictEqual(result[0].notificationType, "Maintenance", "Type mapped");
        assert.strictEqual(result[0].componentType, "EQUI", "Component mapped");

        // Fallback assertions
        assert.strictEqual(result[1].componentName, "", "Component name fallback");
        assert.strictEqual(result[1].componentID, "", "Component ID fallback");
        assert.strictEqual(result[1].componentType, "", "Component type fallback");
        assert.strictEqual(result[1].functionalLocationName,"FLOC1","Functional location fallback applied");
        assert.strictEqual(result[1].functionalLocationDesc,"FLOC DESC","Functional location description fallback applied");
        assert.strictEqual(result[1].breakdown, false, "Breakdown fallback applied");
        assert.strictEqual(result[2].componentName, "", "to_floc_component empty name falls back to empty string");
        assert.strictEqual(result[2].componentID, "", "to_floc_component empty ID falls back to empty string");
        assert.strictEqual(result[2].componentType, "FLOC", "to_floc_component branch sets component type to FLOC");
        assert.strictEqual(result[3].functionalLocationName, "LOCAL-FLOC", "Truthy functional location name is preserved");
        assert.strictEqual(result[3].functionalLocationDesc, "LOCAL-FLOC-DESC", "Truthy functional location description is preserved");

        done();
    });
    
    QUnit.test("fnGetNotiifcation - should set empty list when no notifications", function (assert) {
        var done = assert.async();
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    ID: "EQ001"
                },
                tabs: {
                    maintenanceservice: {}
                }
            }
        });

        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oAppController.dataSource = {getAssignedNotifications: sinon.stub()};
        this.oAppController.dataSource.getAssignedNotifications.callsArgWith(1, { notifications: [] });

        var oI18nBundle = { getText: sinon.stub().returns("Notifications (0)") };
        this.oView.getModel.withArgs("i18n").returns({
            getResourceBundle: sinon.stub().returns(oI18nBundle)
        });

        this.oAppController.fnGetNotiifcation();
        var result = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");
        var sTableHeader = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList/tableHeader");

        assert.deepEqual(result, [], "Empty notification list set");
        assert.strictEqual(sTableHeader, "Notifications (0)", "0-count notifications header set");
        assert.ok(oI18nBundle.getText.calledWith("asint.equipment.detail.tab.notification.header.text", [0]), "Header text requested with 0 count");
        done();
    });

    QUnit.test("fnGetNotiifcation - should map floc component and handle empty component fields", function (assert) {
        var done = assert.async();
        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: {
                    ID: "EQ001",
                    // eslint-disable-next-line camelcase
                    parent_functional_location: {
                        name: "FLOC1",
                        // eslint-disable-next-line camelcase
                        to_description: [{ shortDescription: "DESC" }]
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
        this.oAppController.dataSource = {getAssignedNotifications: sinon.stub()};
        this.oAppController.dataSource.getAssignedNotifications.callsArgWith(1, {
            notifications: [
                // FLOC mapping case
                {
                    notification: {
                        // eslint-disable-next-line camelcase
                        to_floc_component: {
                            name: "Pump",
                            ID: "FLOC001"
                        }
                    }
                },

                // empty component object fallback
                {
                    notification: {
                        // eslint-disable-next-line camelcase
                        to_component: {}
                    }
                }

            ]
        });

        this.oAppController.fnGetNotiifcation();
        var result = oModel.getProperty("/data/tabs/maintenanceservice/notiificationList");

        assert.strictEqual(result[0].componentType, "FLOC", "FLOC component mapped");
        assert.strictEqual(result[1].componentName, "", "Empty component name fallback");
        assert.strictEqual(result[1].componentID, "", "Empty component ID fallback");
        assert.strictEqual(result[1].componentType, "EQUI", "Component type still EQUI");
        done();
    });

    QUnit.test("fnGetNotiifcation - should handle error response", function (assert) {
        var done = assert.async();
        this.oAppController.fnMessageShow = sinon.stub();
        this.oAppController._oLogger = {error: sinon.stub()};

        var oModel = new sap.ui.model.json.JSONModel({
            data: {
                detail: { ID: "EQ001" },
                tabs: { maintenanceservice: {} }
            }
        });

        this.oView.getModel.withArgs("mEquipmentDetail").returns(oModel);
        this.oAppController.dataSource = {getAssignedNotifications: sinon.stub()};
        var errorResponse = {
            responseText: JSON.stringify({
                error: {
                    message: "Backend error"
                }
            })
        };

        this.oAppController.dataSource.getAssignedNotifications.callsArgWith(2, errorResponse);
        this.oAppController.fnGetNotiifcation();

        assert.ok( this.oAppController.fnMessageShow.calledOnce,"Error message shown");
        assert.ok(this.oAppController._oLogger.error.calledOnce,"Logger called");
        done();
    });
    QUnit.module("onPressAIRecommendation & fnGetDataForAIRecommendationQuery", {
        /**
         *
         */
        beforeEach: function () {

            this.oModel = new JSONModel({
                router: {
                    arguments: {
                        equipmentId: "EQ-001"
                    }
                },
                data: { detail: {} }
            });

            this.oController = new Controller();

            var oFlexiColLayout = {
                setLayout: sinon.spy()
            };
            var oAiSuggestions = {
                removeAllItems: sinon.spy(),
                addItem: sinon.spy()
            };
            this.oView = {
                getModel: sinon.stub().returns(this.oModel),
                addDependent: sinon.spy(),
                byId: sinon.stub()
            };
            this.oView.byId.withArgs("idFlexiColLayoutDetail").returns(oFlexiColLayout);
            this.oView.byId.withArgs("idAiSuggestions").returns(oAiSuggestions);
            this.oController.getView = sinon.stub().returns(this.oView);

            this.oController.fnMessageShow = sinon.spy();

            this.oController.dataSource = {
                getAIAsdDataForEquipment:        sinon.stub(),
                getAICmlDataForEquipment:         sinon.stub(),
                getAIInspectionDataForEquipment:  sinon.stub(),
                getAISumaryDetails:               sinon.stub()
            };
        },
        /**
         *
         */
        afterEach: function () {
            this.oController.fnMessageShow.reset();
            this.oController = null;
            this.oModel = null;
        }
    });


    QUnit.test("[+] onPressAIRecommendation calls fnGetDataForAIRecommendationQuery", function (assert) {
        sinon.spy(this.oController, "fnGetDataForAIRecommendationQuery");

        this.oController.onPressAIRecommendation();

        assert.ok(
            this.oController.fnGetDataForAIRecommendationQuery.calledOnce,
            "fnGetDataForAIRecommendationQuery should be called exactly once"
        );

        this.oController.fnGetDataForAIRecommendationQuery.restore();
    });

    QUnit.test("[+] All 3 fetch APIs are called with correct equipmentId", function (assert) {
        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAIAsdDataForEquipment.calledOnce,       "getAIAsdDataForEquipment called once");
        assert.ok(this.oController.dataSource.getAICmlDataForEquipment.calledOnce,        "getAICmlDataForEquipment called once");
        assert.ok(this.oController.dataSource.getAIInspectionDataForEquipment.calledOnce, "getAIInspectionDataForEquipment called once");

        assert.equal(this.oController.dataSource.getAIAsdDataForEquipment.getCall(0).args[0],       "EQ-001", "ASD called with EQ-001");
        assert.equal(this.oController.dataSource.getAICmlDataForEquipment.getCall(0).args[0],        "EQ-001", "CML called with EQ-001");
        assert.equal(this.oController.dataSource.getAIInspectionDataForEquipment.getCall(0).args[0], "EQ-001", "Inspection called with EQ-001");
    });

    QUnit.test("[+] getAISumaryDetails called once when all 3 APIs succeed", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess) { fnSuccess({ asd: "d" }); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess) { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess) { fnSuccess({ insp: "d" }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAISumaryDetails.calledOnce, "getAISumaryDetails called once");
    });

    QUnit.test("[+] Payload contains correct keys and values from all 3 APIs", function (assert) {
        var oAsdData  = { strategy: "asd-data" };
        var oCmlData  = { cml: "cml-data" };
        var oInspData = { inspection: "insp-data" };

        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess) { fnSuccess(oAsdData); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess) { fnSuccess(oCmlData); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess) { fnSuccess(oInspData); };

        this.oController.fnGetDataForAIRecommendationQuery();

        var oPayload = this.oController.dataSource.getAISumaryDetails.getCall(0).args[0];

        assert.deepEqual(oPayload.query.asset_strategy_development, oAsdData,  "Payload has correct ASD data");
        assert.deepEqual(oPayload.query.cmls,                        oCmlData,  "Payload has correct CML data");
        assert.deepEqual(oPayload.query.inspection_history,          oInspData, "Payload has correct Inspection data");
    });

    QUnit.test("[+] Payload query has exactly 4 keys", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess) { fnSuccess({ a: 1 }); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess) { fnSuccess({ b: 2 }); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess) { fnSuccess({ c: 3 }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        var aKeys = Object.keys(this.oController.dataSource.getAISumaryDetails.getCall(0).args[0].query);

        assert.equal(aKeys.length, 4, "Exactly 4 keys in payload query");
        assert.ok(aKeys.indexOf("equipment_data")             !== -1, "Has equipment_data");
        assert.ok(aKeys.indexOf("asset_strategy_development") !== -1, "Has asset_strategy_development");
        assert.ok(aKeys.indexOf("inspection_history")         !== -1, "Has inspection_history");
        assert.ok(aKeys.indexOf("cmls")                       !== -1, "Has cmls");
    });


    QUnit.test("[+] fnMessageShow NOT called when all APIs succeed and capitalizes requested words using capitalizeAcronyms (ASD, RBI, CML, PM, SAP, MSP, FFS, SME, AI, BTP)", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess) { fnSuccess({ a: 1 }); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess) { fnSuccess({ b: 2 }); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess) { fnSuccess({ c: 3 }); };
        this.oController.dataSource.getAISumaryDetails               = function (oPayload, sObjectType, fnSuccess) {
            fnSuccess({
                "rbi_analysis_asd": "this is cml and pm and sap and msp and ffs and sme and ai and btp and painting.",
                "sap_btp": "SAP and BTP",
                "mixed_case_asd_rbi": "testing AsD, rBi, cMl, Pm, Sap, Msp, Ffs, Sme, aI, Btp in text"
            }); 
        };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.fnMessageShow.notCalled, "fnMessageShow should NOT be called on full success");

        var oContainer = this.oView.byId("idAiSuggestions");
        assert.ok(oContainer.addItem.calledOnce, "addItem should be called");
        var oScrollContainer = oContainer.addItem.getCall(0).args[0];
        var vbox = oScrollContainer.getContent()[0];
        var aItems = vbox.getItems();

        var oPanel1 = aItems[0];
        var sTitle1 = oPanel1.getHeaderToolbar().getContent()[0].getItems()[0].getText();
        assert.strictEqual(sTitle1, "RBI Analysis ASD", "Key words capitalized and title formatted");

        var oPanel2 = aItems[1];
        var sTitle2 = oPanel2.getHeaderToolbar().getContent()[0].getItems()[0].getText();
        assert.strictEqual(sTitle2, "SAP BTP", "Key words capitalized and title formatted");

        var oPanel3 = aItems[2];
        var sTitle3 = oPanel3.getHeaderToolbar().getContent()[0].getItems()[0].getText();
        assert.strictEqual(sTitle3, "Mixed Case ASD RBI", "Mixed case acronyms in key capitalized and title formatted");

        var oContentVbox1 = oPanel1.getContent()[0];
        var oText1 = oContentVbox1.getItems()[0];
        assert.strictEqual(oText1.getText(), "this is CML and PM and SAP and MSP and FFS and SME and AI and BTP and painting.", "String values capitalized correctly without affecting other parts of words (painting)");

        var oContentVbox3 = oPanel3.getContent()[0];
        var oText3 = oContentVbox3.getItems()[0];
        assert.strictEqual(oText3.getText(), "testing ASD, RBI, CML, PM, SAP, MSP, FFS, SME, AI, BTP in text", "Mixed case acronyms in string values capitalized correctly");
    });


    QUnit.test("[-] getAISumaryDetails NOT called when only ASD fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment= function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAICmlDataForEquipment = function (id, fnSuccess)          { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment= function (id, fnSuccess)          { fnSuccess({ insp: "d" }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAISumaryDetails.notCalled, "getAISumaryDetails must NOT be called when ASD fails");
    });

    QUnit.test("[-] getAISumaryDetails NOT called when only CML fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment = function (id, fnSuccess)           { fnSuccess({ asd: "d" }); };
        this.oController.dataSource.getAICmlDataForEquipment  = function (id, fnSuccess, fnError)  { fnError(); };
        this.oController.dataSource.getAIInspectionDataForEquipment = function (id, fnSuccess)           { fnSuccess({ insp: "d" }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAISumaryDetails.notCalled, "getAISumaryDetails must NOT be called when CML fails");
    });

    QUnit.test("[-] getAISumaryDetails NOT called when only Inspection fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment = function (id, fnSuccess)           { fnSuccess({ asd: "d" }); };
        this.oController.dataSource.getAICmlDataForEquipment = function (id, fnSuccess)           { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment = function (id, fnSuccess, fnError)  { fnError(); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAISumaryDetails.notCalled, "getAISumaryDetails must NOT be called when Inspection fails");
    });

    QUnit.test("[-] getAISumaryDetails NOT called when ALL 3 APIs fail", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAICmlDataForEquipment  = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess, fnError) { fnError(); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAISumaryDetails.notCalled, "getAISumaryDetails must NOT be called when all 3 fail");
    });

    QUnit.test("[-] fnMessageShow called with type 'E' when ASD fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAICmlDataForEquipment = function (id, fnSuccess)          { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment = function (id, fnSuccess)          { fnSuccess({ insp: "d" }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.fnMessageShow.calledOnce,"fnMessageShow called once");
        assert.equal(this.oController.fnMessageShow.getCall(0).args[0], "E", "Error type should be 'E'");
    });

    QUnit.test("[-] Error message contains 'asd' when ASD fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAICmlDataForEquipment = function (id, fnSuccess)          { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment = function (id, fnSuccess)          { fnSuccess({ insp: "d" }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        var sMsg = this.oController.fnMessageShow.getCall(0).args[1];
        assert.ok(sMsg.toLowerCase().indexOf("asd") !== -1, "Message should mention 'asd'");
    });

    QUnit.test("[-] Error message contains 'cml' when CML fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess)           { fnSuccess({ asd: "d" }); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess, fnError)  { fnError(); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess)           { fnSuccess({ insp: "d" }); };

        this.oController.fnGetDataForAIRecommendationQuery();

        var sMsg = this.oController.fnMessageShow.getCall(0).args[1];
        assert.ok(sMsg.toLowerCase().indexOf("cml") !== -1, "Message should mention 'cml'");
    });

    QUnit.test("[-] Error message contains 'inspection' when Inspection fails", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess)           { fnSuccess({ asd: "d" }); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess)           { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess, fnError)  { fnError(); };

        this.oController.fnGetDataForAIRecommendationQuery();

        var sMsg = this.oController.fnMessageShow.getCall(0).args[1];
        assert.ok(sMsg.toLowerCase().indexOf("inspection") !== -1, "Message should mention 'inspection'");
    });

    QUnit.test("[-] Error message contains all 3 names when all fail", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess, fnError) { fnError(); };

        this.oController.fnGetDataForAIRecommendationQuery();

        var sMsg = this.oController.fnMessageShow.getCall(0).args[1].toLowerCase();
        assert.ok(sMsg.indexOf("asd")        !== -1, "Message mentions 'asd'");
        assert.ok(sMsg.indexOf("cml")        !== -1, "Message mentions 'cml'");
        assert.ok(sMsg.indexOf("inspection") !== -1, "Message mentions 'inspection'");
    });

    QUnit.test("[-] fnMessageShow called exactly once when all 3 fail", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess, fnError) { fnError(); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function (id, fnSuccess, fnError) { fnError(); };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.equal(this.oController.fnMessageShow.callCount, 1, "fnMessageShow must be called exactly once");
    });


    QUnit.test("[-] getAISumaryDetails NOT called when only 2 of 3 APIs respond", function (assert) {
        this.oController.dataSource.getAIAsdDataForEquipment        = function (id, fnSuccess) { fnSuccess({ asd: "d" }); };
        this.oController.dataSource.getAICmlDataForEquipment         = function (id, fnSuccess) { fnSuccess({ cml: "d" }); };
        this.oController.dataSource.getAIInspectionDataForEquipment  = function () { /* never fires */ };

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAISumaryDetails.notCalled, "getAISumaryDetails must NOT be called when only 2 of 3 APIs complete");
    });

    QUnit.test("[-] Missing equipmentId does not throw — all 3 fetch APIs still invoked", function (assert) {
        this.oModel.setProperty("/router/arguments/equipmentId", undefined);

        this.oController.fnGetDataForAIRecommendationQuery();

        assert.ok(this.oController.dataSource.getAIAsdDataForEquipment.calledOnce,       "getAIAsdDataForEquipment still called");
        assert.ok(this.oController.dataSource.getAICmlDataForEquipment.calledOnce,        "getAICmlDataForEquipment still called");
        assert.ok(this.oController.dataSource.getAIInspectionDataForEquipment.calledOnce, "getAIInspectionDataForEquipment still called");
    });


    QUnit.module("AI Recommendation Layout Handlers", {
        /**
         * 
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oModel = new JSONModel({
                metadata: { aiRecommendation: { isFullScreenActive: false } }
            });
            this.oFlexiColLayout = {
                setLayout: sinon.spy()
            };
            this.oContainer = {
                removeAllItems: sinon.spy()
            };
            this.oView = {
                byId: sinon.stub(),
                getModel: sinon.stub().withArgs("mEquipmentDetail").returns(this.oModel)
            };
            this.oView.byId.withArgs("idFlexiColLayoutDetail").returns(this.oFlexiColLayout);
            this.oView.byId.withArgs("idAiSuggestions").returns(this.oContainer);
            this.oController.getView = sinon.stub().returns(this.oView);
        },
        /**
         * 
         */
        afterEach: function () {
            this.oController = null;
            this.oModel = null;
            sinon.restore();
        }
    });

    QUnit.test("handleCloseAi sets layout to OneColumn and removes items from container", function (assert) {
        this.oController.handleCloseAi();
        assert.ok(this.oFlexiColLayout.setLayout.calledWith("OneColumn"), "Layout should be set to OneColumn");
        assert.ok(this.oContainer.removeAllItems.calledOnce, "removeAllItems should be called on the container");
    });

    QUnit.test("handleFullScreenDetail sets layout to MidColumnFullScreen and updates model property", function (assert) {
        this.oController.handleFullScreenDetail();
        assert.ok(this.oFlexiColLayout.setLayout.calledWith("MidColumnFullScreen"), "Layout should be set to MidColumnFullScreen");
        assert.strictEqual(this.oModel.getProperty("/metadata/aiRecommendation/isFullScreenActive"), true, "Model property isFullScreenActive should be true");
    });

    QUnit.test("handleExitFullScreenDetail sets layout to TwoColumnsBeginExpanded and updates model property", function (assert) {
        this.oModel.setProperty("/metadata/aiRecommendation/isFullScreenActive", true);
        this.oController.handleExitFullScreenDetail();
        assert.ok(this.oFlexiColLayout.setLayout.calledWith("TwoColumnsBeginExpanded"), "Layout should be set to TwoColumnsBeginExpanded");
        assert.strictEqual(this.oModel.getProperty("/metadata/aiRecommendation/isFullScreenActive"), false, "Model property isFullScreenActive should be false");
    });

    /**
     * fnPDFGetAssetIntelligenceHighlight TC's
     */
    QUnit.module("fnPDFGetAssetIntelligenceHighlight", {
        /*
        * Setup for each test
        */
        beforeEach: function () {
            /*
            * Stub for fnSuccess
            */
            this.fnSuccess = sinon.stub();

            /*
            * Stub for i18n model
            */
            this.oI18n = {
                getText: sinon.stub().returns("mock_text")
            };

            this.oEquipmentDetail = {
                assetIntelligence: {
                    highlights: {
                        riskAndCriticality: {
                            highestRiskScore: "",
                            criticality: "",
                            name: "",
                            modifiedAt: "",
                            modifiedBy: ""
                        },
                        assetStrategy: {
                            name: "",
                            sheMitigated: "",
                            sheUnmitigated: "",
                            ecomMitigated: "",
                            ecomUnmitigated: "",
                            modifiedAt: "",
                            modifiedBy: ""
                        }
                    }
                },
                error: []
            };

            var that = this;

            this.oFakeView = {
                /*
                * Get model
                */
                getModel: function (sName) {
                    if (sName === "i18n") {
                        /*
                        * Return i18n model
                        */
                        return { getResourceBundle: function () { return that.oI18n; } };
                    }
                    if (sName === "mEquipmentDetail") {
                        /*
                        * Return equipment detail model
                        */
                        return {
                            getProperty: function () {
                                return {
                                    ID: "EQ001",
                                    name: "TestEquipment",
                                    srcId: "SAP",
                                    // eslint-disable-next-line camelcase
                                    child_equipments: []
                                };
                            }
                        };
                    }
                    if (sName === "mEquipment") {
                        return {
                            /**
                             * 
                             * @param {*} sPath 
                             * @returns 
                             */
                            getProperty: function (sPath) {
                                if (sPath === "/metadata/featureFlag/downloadReportEqui") {
                                    return that._sFeatureFlag !== undefined ? that._sFeatureFlag : "1";
                                }
                                return null;
                            }
                        };
                    }
                },
                byId: sinon.stub().returns({
                    getSections: sinon.stub().returns([]),
                    setSelectedSection: sinon.stub()
                }),
                setModel: sinon.stub(),
                addDependent: sinon.stub()
            };
            /*
            * Stub for getView
            */
            sinon.stub(Controller.prototype, "getView", function () {
                return that.oFakeView;
            });
            
            /*
            * Stub for getRouter
            */
            sinon.stub(Controller.prototype, "getRouter", function () {
                return {
                    getRoute: sinon.stub().returns({ attachPatternMatched: sinon.stub() }),
                    navTo: sinon.stub()
                };
            });
            /*
            * Stub for getOwnerComponent
            */
            sinon.stub(Controller.prototype, "getOwnerComponent", function () {
                return {
                    getModel: sinon.stub().returns({
                        getProperty: sinon.stub().returns(false),
                        setProperty: sinon.stub()
                    })
                };
            });

            this.oController = new Controller();

            this.oController.fnLoadValueHelp = sinon.stub();
            this.oController.fnInitObjectHierarchy = sinon.stub();
            this.oController.fnFetchComponentTypeList = sinon.stub();
            this.oController.fnFetchEquipmentDetail = sinon.stub();
            this.oController._fnLoadUoM = sinon.stub();
            this.oController.getUserRoles = sinon.stub();
            this.oController.fnLoadFeatureFlagConfig = sinon.stub();
            this.oController.busyDialog               = { open: sinon.stub(), close: sinon.stub() };

            this.oController.formatter = {
                formatDate: sinon.stub().returns("01.01.2024")
            };
        },

        /*
        * After each test
        */
        afterEach: function () {
            if (Controller.prototype.getView.restore) {
                Controller.prototype.getView.restore();
            }
            if (Controller.prototype.getRouter.restore) {
                Controller.prototype.getRouter.restore();
            }
            if (Controller.prototype.getOwnerComponent.restore) {
                Controller.prototype.getOwnerComponent.restore();
            }
            this._sFeatureFlag = undefined;
            sinon.restore();
        }
    });

    /*
    * TC1.1: Empty response
    */
    QUnit.test("should call fnSuccess with [] when response is empty array", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC1.1: Empty response
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.ok(fnSuccess.calledWith([]), "fnSuccess called with empty array");
    });

    /*
    * TC2: No PBD records - only header row in table
    */
    QUnit.test("should not push data row when no PBD+riskscore record found", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC2.1: No PBD records - only header row in table
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([{ rcaassesmentstatus: "DRF", riskscore: 10, modifiedat: "2024-01-01" }]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        var aBody = fnSuccess.args[0][0][0][3].table.body;
        assert.equal(aBody.length, 1, "Only header row, no data row");
    });

    /*
    * TC3: Picks latest modifiedat among PBD+riskscore records
    */
    QUnit.test("should pick latest modifiedat record from filtered PBD list", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC3.1: Multiple PBD records with different riskscores
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([
                    { rcaassesmentstatus: "PBD", riskscore: 5, modifiedat: "2024-01-01", rcaassesmentname: "Old Assessment", criticalitycode: "B", criticalitytext: "Medium", modifiedby: "user1" },
                    { rcaassesmentstatus: "PBD", riskscore: 8, modifiedat: "2024-06-01", rcaassesmentname: "Latest Assessment", criticalitycode: "A", criticalitytext: "High", modifiedby: "user2" }
                ]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        var aBody = fnSuccess.args[0][0][0][3].table.body;
        assert.equal(aBody[1][0], "Latest Assessment", "Latest record by modifiedat is picked");
    });

    /*
    * TC4: Exactly 1 data row in table
    */
    QUnit.test("should push exactly 1 data row regardless of multiple PBD records", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC4.1: Multiple PBD records with different riskscores
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([
                    { rcaassesmentstatus: "PBD", riskscore: 5, modifiedat: "2024-01-01", rcaassesmentname: "A1", criticalitycode: "C", criticalitytext: "Low", modifiedby: "user1" },
                    { rcaassesmentstatus: "PBD", riskscore: 8, modifiedat: "2024-06-01", rcaassesmentname: "A2", criticalitycode: "A", criticalitytext: "High", modifiedby: "user2" }
                ]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        var aBody = fnSuccess.args[0][0][0][3].table.body;
        assert.equal(aBody.length, 2, "1 header + 1 data row only");
    });

    /*
    * TC5: Criticality code and text joined correctly
    */
    QUnit.test("should join criticalitycode and criticalitytext with ' - '", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC5.1: Criticality code and text joined correctly
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([{ rcaassesmentstatus: "PBD", riskscore: 5, modifiedat: "2024-01-01", criticalitycode: "A", criticalitytext: "High", modifiedby: "user1" }]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        var aBody = fnSuccess.args[0][0][0][3].table.body;
        assert.equal(aBody[1][2], "A - High", "Criticality shows code - text");
    });

    /*
    * TC6: Only criticalitycode, no text
    */
    QUnit.test("should show only criticalitycode when criticalitytext is missing", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC6.1: Only criticalitycode, no text
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([{ rcaassesmentstatus: "PBD", riskscore: 5, modifiedat: "2024-01-01", criticalitycode: "A", criticalitytext: "", modifiedby: "user1" }]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        var aBody = fnSuccess.args[0][0][0][3].table.body;
        assert.equal(aBody[1][2], "A", "Only criticalitycode shown");
    });

    /*
    * TC7: highestRiskScore set correctly on oEquipmentDetail
    */
    QUnit.test("should set highestRiskScore on oEquipmentDetail highlights", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            /*
            * TC7.1: highestRiskScore set correctly on oEquipmentDetail
            */
            fnGetRnCAssessment: function (id, fnOk) {
                fnOk([{ rcaassesmentstatus: "PBD", riskscore: 42, modifiedat: "2024-01-01", criticalitycode: "A", criticalitytext: "High", modifiedby: "user1" }]);
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.equal(this.oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.highestRiskScore, "42", "highestRiskScore set correctly");
    });

    /*
    * TC8: API error - fnSuccess called with []
    */
    QUnit.test("should call fnSuccess with [] on API failure", function (assert) {
        var fnSuccess = this.fnSuccess;
        this.oController.dataSource = {
            fnGetRnCAssessment: function (id, fnOk, fnErr) { fnErr(); }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.ok(fnSuccess.calledWith([]), "fnSuccess called with [] on error");
    });

    /*
    * TC9: else-branch - valid response calls fnSuccess with content
    */
    QUnit.test("[else] should call fnSuccess with content when fnGetRiskSummary returns valid response", function (assert) {
        var fnSuccess = this.fnSuccess;
        this._sFeatureFlag = "0";
        this.oController.dataSource = {
            /**
             * 
             * @param {*} aList 
             * @param {*} fnOk 
             */
            fnGetRiskSummary: function (aList, fnOk) {
                fnOk({
                    response: {
                        riskScore: "HIGH",
                        alphaNumericRiskScore: "SHE IV",
                        criticalityCode: "A",
                        criticalityText: "Critical",
                        sheMr: "10",
                        sheUmr: "20",
                        ecomMr: "30",
                        ecomUmr: "40",
                        rncAssessmentId: "rca-001",
                        rcaAssessmentName: "RCA Name",
                        rcaAssessmentModifiedAt: "2024-01-01",
                        rcaAssessmentModifiedBy: "user1",
                        asdAssessmentId: "asd-001",
                        asdAssessmentName: "ASD Name",
                        asdAssessmentModifiedAt: "2024-01-01",
                        asdAssessmentModifiedBy: "user2"
                    }
                });
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.ok(fnSuccess.calledOnce, "fnSuccess called once");
        var aContent = fnSuccess.args[0][0];
        assert.ok(aContent.length > 0, "fnSuccess called with non-empty content");
    });

    /*
    * TC10: else-branch - highestRiskScore joined correctly from riskScore + alphaNumericRiskScore
    */
    QUnit.test("[else] should join riskScore and alphaNumericRiskScore with ' - '", function (assert) {
        var fnSuccess = this.fnSuccess;
        this._sFeatureFlag = "0";
        this.oController.dataSource = {
            fnGetRiskSummary: function (aList, fnOk) {
                fnOk({ response: { riskScore: "HIGH", alphaNumericRiskScore: "SHE IV", criticalityCode: "", criticalityText: "" } });
            }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.equal(
            this.oEquipmentDetail.assetIntelligence.highlights.riskAndCriticality.highestRiskScore,
            "HIGH - SHE IV",
            "highestRiskScore joined with ' - '"
        );
    });

    /*
    * TC11: else-branch - empty/null response calls fnSuccess with []
    */
    QUnit.test("[else] should call fnSuccess with [] when fnGetRiskSummary returns empty response", function (assert) {
        var fnSuccess = this.fnSuccess;
        this._sFeatureFlag = "0";
        this.oController.dataSource = {
            /**
             * 
             * @param {*} aList 
             * @param {*} fnOk 
             */
            fnGetRiskSummary: function (aList, fnOk) { fnOk({}); }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.ok(fnSuccess.calledWith([]), "fnSuccess called with [] on empty response");
    });

    /*
    * TC12: else-branch - API error calls fnSuccess with []
    */
    QUnit.test("[else] should call fnSuccess with [] on fnGetRiskSummary API failure", function (assert) {
        var fnSuccess = this.fnSuccess;
        this._sFeatureFlag = "0";
        this.oController.dataSource = {
            /**
             * 
             * @param {*} aList 
             * @param {*} fnOk 
             * @param {*} fnErr 
             */
            fnGetRiskSummary: function (aList, fnOk, fnErr) { fnErr(); }
        };
        this.oController.fnPDFGetAssetIntelligenceHighlight(this.oEquipmentDetail, fnSuccess);
        assert.ok(fnSuccess.calledWith([]), "fnSuccess called with [] on error");
    });

});
    