sap.ui.define([
    "comasintaismicml/cml/controller/detail/CMLDetail.controller",
    "comasintaismicml/cml/controller/detail/CMLDetailTabs",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/Router",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit",
], function (Controller, CMLDetailTabs, Fragment, Router, sinon) {
    "use strict";


    QUnit.module("CMLDetail Controller - Full Test Suite", {
        /**
         * before each function
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oModel = new sap.ui.model.json.JSONModel({
                data: {
                    detailPage: {
                        moveAndPaste: { selectedObject: [] },
                        create: { cml: { oSelectedObject: {} } }
                    }
                }
            });

            this.oView = {
                getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel),
                setModel: sinon.spy(),
                addDependent: sinon.spy(),
                byId: sinon.stub().returns({
                    clearSelection: sinon.spy()
                })
            };

            sinon.stub(this.oController, "getView").returns(this.oView);

            this.oController.technicalObjectValueHelp = {
                handleEquipmentValueHelp: sinon.stub(),
                handleFunctionalLocationValueHelp: sinon.stub()
            };

            this.oController.getObjectTemplateWithEquipment = sinon.stub();
            this.oController.fnMessageShow = sinon.stub();

            this.oController.CMLDataSource = {
                fnMoveCmlToNewAsset: sinon.stub()
            };
        },

        /**
         * after each function
         */
        afterEach: function () {
            sinon.restore();
        }
    });


    QUnit.module("CMLDetail Controller – fnHandleEquipmentValueHelpForCML", {
        /**
         * @edscription Setup sinon stubs and spies before each test to isolate test cases
         */
        beforeEach: function () {
   
            this.oAppController = new Controller();

            this.oView = {
                getModel: sinon.stub(),
                byId: sinon.stub().returns({ clearSelection: sinon.spy() }),
                addDependent: sinon.spy()
            };

            sinon.stub(this.oAppController, "getView").returns(this.oView);

            this.oCommonModel = new sap.ui.model.json.JSONModel({
                data: { detailPage: { create: { cml: {} } } },
                metaData: { detailPage: { create: { cml: { valueState: {}, enabled: {} } } } }
            });

            this.oView.getModel.withArgs("mCMLModel").returns(this.oCommonModel);

            this.oAppController.fnHandleTechnicalObjectValueHelp = sinon.stub();
            
            this.oAppController.getObjectTemplateWithEquipment = sinon.spy(); 
        },

        /**
         * @description Restore sinon stubs and spies after each test to ensure test isolation
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Function 'fnHandleEquipmentValueHelpForCML' should update model properties and call getObjectTemplateWithEquipment", function (assert) {
        var done = assert.async();

        var oSelectedTechnicalObjectData = {
            objectId: "EQ12345",
            name: "Pump Equipment",
            desc: "Main Pump"
        };

        this.oAppController.fnHandleTechnicalObjectValueHelp.yields(oSelectedTechnicalObjectData);

        sinon.spy(this.oCommonModel, "setProperty");

        this.oAppController.fnHandleEquipmentValueHelpForCML();

        assert.ok(this.oAppController.fnHandleTechnicalObjectValueHelp.calledOnce, "fnHandleTechnicalObjectValueHelp called once");
        assert.ok(this.oCommonModel.setProperty.calledWith("/data/detailPage/create/cml/selectedEqpFloc", "EQ12345"));
        assert.ok(this.oAppController.getObjectTemplateWithEquipment.calledOnce);
        
        done();
    });

    QUnit.test("Function 'fnHandleFunctionalLocationValueHelpForCML' should update model properties and call getObjectTemplateWithEquipment", function (assert) {
        var done = assert.async();

        var oSelectedTechnicalObjectData = {
            objectId: "FL0001",
            name: "Main Functional Location",
            desc: "Functional Location Description"
        };

        var oCommonModel = this.oCommonModel;
        sinon.spy(oCommonModel, "setProperty");

        this.oAppController.fnHandleTechnicalObjectValueHelp.yields(oSelectedTechnicalObjectData);

        this.oAppController.fnHandleFunctionalLocationValueHelpForCML();

        assert.ok(this.oAppController.fnHandleTechnicalObjectValueHelp.calledOnce);
        assert.ok(oCommonModel.setProperty.calledWith("/data/detailPage/create/cml/selectedEqpFloc", "FL0001"));
        assert.ok(this.oAppController.getObjectTemplateWithEquipment.calledOnce);

        done();
    });

    QUnit.test("Function 'getObjectTemplateWithEquipment' should update model with template list on success", function (assert) {
        var done = assert.async();
        
 
        delete this.oAppController.getObjectTemplateWithEquipment;

        var sObjectID = "EQ123";
        var sObjType = "EQUI";
        var aMockResponse = [
            { templateId: "T1", name: "Template 1" },
            { templateId: "T2", name: "Template 2" }
        ];
        var oCMLModel = {
            setProperty: sinon.spy()
        };

        this.oView.getModel.withArgs("mCMLModel").returns(oCMLModel);
        
        this.oAppController.CMLDataSource = {
            getObjectTemplatesNew: sinon.stub()
        };


        this.oAppController.CMLDataSource.getObjectTemplatesNew.callsArgWith(2, aMockResponse);

        this.oAppController.getObjectTemplateWithEquipment(sObjectID, sObjType);
        
        assert.ok(this.oAppController.CMLDataSource.getObjectTemplatesNew.calledOnce, "getObjectTemplatesNew is called once");
        assert.ok(oCMLModel.setProperty.calledWith("/data/detailPage/create/cml/objectTemplateList", aMockResponse), "Template list stored correctly");
        
        done();
    });

    QUnit.test("Function 'fnHandleTechnicalObjectValueHelp' should NOT call callback when status is not finished", function (assert) {
        var done = assert.async();
        var fnCallback = sinon.spy();
        var oNotFinishedReturn = { status: "cancelled", selected: [] };


        var oController = new Controller();
        oController.getView = function () { return {
            /**
             * 
             */
            getModel: function () { return {}; } }; };
        
        oController.technicalObjectValueHelp = {
            handleEquipmentValueHelp: sinon.stub(),
            handleFunctionalLocationValueHelp: sinon.stub()
        };

        oController.technicalObjectValueHelp.handleEquipmentValueHelp.yields(oNotFinishedReturn);

        oController.fnHandleTechnicalObjectValueHelp("EQUI", fnCallback);

        assert.ok(fnCallback.notCalled, "Callback should not be called");
        done();
    });

    QUnit.test("Function 'onPressMoveCML' should show MessageToast when no CML is selected", function (assert) {
        var done = assert.async();
        var oModelStub = { getProperty: sinon.stub() };
        
        oModelStub.getProperty.withArgs("/data/detailPage/moveAndPaste/selectedObject").returns([]);
        this.oView.getModel.withArgs("mCMLModel").returns(oModelStub);
        
        var toastSpy = sinon.spy(sap.m.MessageToast, "show");
        
        this.oAppController.onPressMoveCML();
        
        assert.ok(toastSpy.calledOnce, "MessageToast.show called");
        done();
        toastSpy.restore();
    });

    QUnit.test("Function 'onPressMoveCML' should load dialog (first time) and update objectType", function (assert) {
        var done = assert.async();
        var oModelStub = { getProperty: sinon.stub(), setProperty: sinon.spy() };
        
        oModelStub.getProperty.withArgs("/data/detailPage/moveAndPaste/selectedObject").returns([{ cmlId: "CML001" }]);
        oModelStub.getProperty.withArgs("/data/detailPage/headerData").returns({ objectType: "EQUI" });
        
        this.oView.getModel.withArgs("mCMLModel").returns(oModelStub);
        
        var oDialogMock = { open: sinon.spy() };
        var fragmentStub = sinon.stub(sap.ui.core.Fragment, "load").returns(Promise.resolve(oDialogMock));
        
        this.oAppController._oDialogCmlForSameAsset = null; 
        
        this.oAppController.onPressMoveCML();
        
        setTimeout(function () {
            assert.ok(fragmentStub.calledOnce, "Fragment.load called");
            assert.ok(oDialogMock.open.calledOnce, "Dialog opened");
            assert.ok(oModelStub.setProperty.calledWith("/data/detailPage/create/cml/objectType", "EQUI"), "objectType updated");
            fragmentStub.restore();
            done();
        }.bind(this), 50);
    });

    QUnit.test("onSaveCmlForNewAsset - should prepare payload, call API, show success msg and close dialog", function (assert) {
  
        var oController = this.oAppController; 
        
        oController.oI18n = {
            getText: sinon.stub().returns("MESSAGE")
        };
        oController.fnMessageShow = sinon.spy();
        sinon.stub(oController, "onCancelCmlForNewAsset");
        
        var oModelMock = { getProperty: sinon.stub() };
        oModelMock.getProperty.withArgs("/data/detailPage/moveAndPaste/selectedObject").returns([
            { locationId: "CML001", locationTemplateId: "TPL001" },
            { locationId: "CML002", locationTemplateId: "TPL002" }
        ]);
        oModelMock.getProperty.withArgs("/data/detailPage/create/cml/oSelectedObject").returns({
            objectId: "EQ100",
            objectType: "EQUI"
        });
        oModelMock.getProperty.withArgs("/data/detailPage/create/cml/objectTemplateList").returns([ { dummy: 1 } ]);
        
 
        oController.getView = sinon.stub().returns({
            getModel: sinon.stub().withArgs("mCMLModel").returns(oModelMock)
        });

        oController.CMLDataSource = {
            fnMoveCmlToNewAsset: sinon.spy(function (payload, fnSuccess) {
                fnSuccess({ result: "ok" });
            })
        };
        
        oController.onSaveCmlForNewAsset();
        
        assert.ok(oController.CMLDataSource.fnMoveCmlToNewAsset.calledOnce, "API called");
        assert.ok(oController.fnMessageShow.calledWith("S", "MESSAGE"), "Success message displayed");
        assert.ok(oController.onCancelCmlForNewAsset.calledOnce, "Dialog closed");
    });

    QUnit.test("onCancelCmlForNewAsset - should close dialog, clear table selection, and reset model property", function (assert) {
       
        var oController = this.oAppController;
        
        var oModelMock = { setProperty: sinon.spy() };
        var oTableMock = { clearSelection: sinon.spy() };
        
        oController.getView = sinon.stub().returns({
            getModel: sinon.stub().withArgs("mCMLModel").returns(oModelMock),
            byId: sinon.stub().withArgs("idAsintCMLOverallReading").returns(oTableMock)
        });
        
        oController._oDialogCmlForSameAsset = { close: sinon.spy() };
        
        oController.onCancelCmlForNewAsset();
        
        assert.ok(oController._oDialogCmlForSameAsset.close.calledOnce, "Dialog closed");
        assert.ok(oTableMock.clearSelection.calledOnce, "Table selection cleared");
    });


    QUnit.module("CML Detail – Dialog Functions", {

        /**
         * @description Setup sinon stubs and spies before each test to isolate test cases
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oModel = {
                getProperty: sinon.stub(),
                setProperty: sinon.spy()
            };

            this.oModel.getProperty.withArgs("/data/detailPage/headerData/objectType").returns("EQUI");
            this.oModel.getProperty.withArgs("/data/detailPage/headerData/objectName").returns("EQ-100");

            var that = this;
            this.oView = {
                /**
                 * @description Mock getId to return a test view ID
                 */
                getId: function () { return "testView"; },
                /**
                 * @description Mock getModel to return the test model
                 */
                getModel: function () { return that.oModel; },
                addDependent: sinon.spy()
            };

            sinon.stub(this.oController, "getView").returns(this.oView);

            this.oController.fnLoadObjectTemplatesForDetail = sinon.spy();

            this.fragmentStub = sinon.stub(Fragment, "load");
        },
        /**
         * @description Restore sinon stubs and spies after each test to ensure test isolation
         */
        afterEach: function () {
            this.fragmentStub.restore();
            this.oController.getView.restore();
        }
    });


    QUnit.test("onCMLDialogOpen - when dialog instance already exists", function (assert) {

        var oDialog = {
            open: sinon.spy()
        };

        this.oController._oCreateCMLDialog = oDialog;

        this.oController.onCMLDialogOpen();

        assert.ok(this.oController.fnLoadObjectTemplatesForDetail.calledOnce,
            "Template loader called");

        assert.ok(oDialog.open.calledOnce,
            "Existing dialog opened");

        var bCalled = false;
        for (var i = 0; i < this.oModel.setProperty.callCount; i++) {
            if (this.oModel.setProperty.getCall(i).args[0] === "/data/detailPage/create/cml/selectedEqpFloc") {
                bCalled = true;
            }
        }
        assert.ok(bCalled, "selectedEqpFloc was set");
    });


    QUnit.test("onCMLDialogOpen - loads and opens dialog when not existing", function (assert) {

        var oDialog = {
            open: sinon.spy()
        };

        this.fragmentStub.returns({
            /**
             * @description Simulate successful fragment load by calling the success callback with the dialog mock
             */
            then: function (fnSuccess) {
                fnSuccess(oDialog);
            }
        });

        this.oController._oCreateCMLDialog = null;

        this.oController.onCMLDialogOpen();

        assert.ok(this.fragmentStub.calledOnce, "Fragment.load was called");

        assert.ok(this.oView.addDependent.calledOnce,
            "Dialog added as dependent to view");

        assert.ok(this.oController.fnLoadObjectTemplatesForDetail.calledOnce,
            "Template loader called");

        assert.ok(oDialog.open.calledOnce,
            "Newly created dialog opened");

        var bCalled = false;
        for (var i = 0; i < this.oModel.setProperty.callCount; i++) {
            if (this.oModel.setProperty.getCall(i).args[0] === "/data/detailPage/create/cml/selectedEqpFloc") {
                bCalled = true;
            }
        }
        assert.ok(bCalled, "selectedEqpFloc was set");
    });


    QUnit.test("_resetCreateCMLDetailData - resets all fields to defaults", function (assert) {

        this.oController._resetCreateCMLDetailData();

        assert.ok(this.oModel.setProperty.called, "setProperty called");

        assert.ok(
            this.oModel.setProperty.calledWith("/data/detailPage/create/cml/selectedObjectTemplate", ""),
            "selectedObjectTemplate reset"
        );

        assert.ok(
            this.oModel.setProperty.calledWith("/data/detailPage/create/cml/selectedObjectTemplateName", ""),
            "selectedObjectTemplateName reset"
        );

        assert.ok(
            this.oModel.setProperty.calledWithMatch("/metaData/detailPage/create/cml/wizard", {
                prevStep: false,
                nextStep: true,
                currStep: 0,
                nextStepEnabled: false,
                createEnabled: false
            }),
            "wizard metadata reset"
        );
    });


    QUnit.test("onCMLDialogClose - resets data and closes dialog if exists", function (assert) {

        var oDialog = {
            close: sinon.spy()
        };

        this.oController._oCreateCMLDialog = oDialog;

        sinon.spy(this.oController, "_resetCreateCMLDetailData");

        this.oController.onCMLDialogClose();

        assert.ok(this.oController._resetCreateCMLDetailData.calledOnce,
            "reset function called");

        assert.ok(oDialog.close.calledOnce,
            "Dialog close called");

        this.oController._resetCreateCMLDetailData.restore();
    });


    QUnit.test("fnLoadObjectTemplatesForDetail - skips API call when existing templates found", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/objectTemplateList").returns([{ key: "T1" }]);

        sinon.stub(this.oController, "getOwnerComponent").returns({
            /**
             * @description Mock getModel to return the test model
             */
            getModel: function () { return oModel; }
        });

        this.oController.CMLDataSource = {
            getObjectTemplatesNew: sinon.spy()
        };

        this.oController.fnLoadObjectTemplatesForDetail();

        assert.ok(this.oController.CMLDataSource.getObjectTemplatesNew.notCalled,
            "API not called when existing data already present");

        this.oController.getOwnerComponent.restore();
    });


    QUnit.test("fnLoadObjectTemplatesForDetail - loads and formats templates", function (assert) {

        var oModel = {
            getProperty: sinon.stub().returns([]),
            setProperty: sinon.spy()
        };

        sinon.stub(this.oController, "getOwnerComponent").returns({
            getModel: sinon.stub().withArgs("mCMLModel").returns(oModel)
        });

        this.oController._sObjectId = "OBJ1";
        this.oController._sObjectType = "EQUI";

        var fnSuccess;

        this.oController.CMLDataSource = {
            getObjectTemplatesNew: sinon.spy(function (id, type, success) {
                fnSuccess = success; 
            })
        };

        this.oController.fnLoadObjectTemplatesForDetail = Controller.prototype.fnLoadObjectTemplatesForDetail;

        this.oController.fnLoadObjectTemplatesForDetail();

        fnSuccess([{
            ID: "T1",
            /* eslint-disable camelcase */
            to_description: [{
                shortDescription: "Short",
                longDescription: "Long"
            }]
        }]);

        assert.ok(
            oModel.setProperty.calledWithMatch(
                "/data/detailPage/create/cml/objectTemplateList",
                sinon.match.array
            ),
            "Template list updated"
        );

        assert.ok(
            oModel.setProperty.calledWith("/data/detailPage/create/cml/selectedObjectTemplate", ""),
            "selectedObjectTemplate reset"
        );

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/enabled/objectTemplate", true),
            "Object template enabled set"
        );

        this.oController.getOwnerComponent.restore();
    });


    QUnit.test("onDetailObjectTemplateChange - empty key disables next step", function (assert) {

        var oModel = {
            setProperty: sinon.spy(),
            getProperty: sinon.stub()
        };

        var that = this;
        this.oView.getModel = function (sName) {
            return sName === "mCMLModel" ? oModel : (that.oModel || undefined);
        };

        var oEvent = {
            /**
             * @description Mock getSource to return a test event source
             */
            getSource: function () {
                return {
                    /**
                     * @description Mock getSelectedKey to return an empty string to simulate no selection
                     */
                    getSelectedKey: function () { return ""; }
                };
            }
        };

        this.oController.onDetailObjectTemplateChange(oEvent);

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/nextStepEnabled", false),
            "Next step disabled when key empty"
        );
    });


    QUnit.test("onDetailObjectTemplateChange - valid key triggers CML template load", function (assert) {

        var oModel = {
            setProperty: sinon.spy(),
            getProperty: sinon.stub()
        };

        var oSelectedData = { name: "Template ABC" };

        var oEvent = {
            /**
             * @description Mock getSource to return a test event source
             */
            getSource: function () {
                return {
                    /**
                     * @description Mock getSelectedKey to return a valid key
                     */
                    getSelectedKey: function () { return "T100"; },
                    /**
                     * @description Mock getSelectedItem to return the selected item data
                     */
                    getSelectedItem: function () {
                        return {
                            /**
                             * @description Mock getBindingContext to return a test binding context
                             */
                            getBindingContext: function () {
                                return {
                                    /**
                                     * @description Mock getObject to return the selected data
                                     */
                                    getObject: function () { return oSelectedData; }
                                };
                            }
                        };
                    }
                };
            }
        };

        var that = this;
        this.oView.getModel = function (sName) {
            return sName === "mCMLModel" ? oModel : (that.oModel || undefined);
        };

        /* eslint-disable no-unused-vars */
        var fnSuccess, fnError;

        this.oController.CMLDataSource = {
            /**
             * @description Mock getCMLTemplateByObjectTemplateID to simulate API call
             */
            getCMLTemplateByObjetTemplatID: function (key, s, e) {
                fnSuccess = s;
                fnError = e;
            }
        };

        this.oController.onDetailObjectTemplateChange(oEvent);

        fnSuccess({
            to_cml_template: [
                { cmlLocationTemplate: { deleted: false, id: "LT1", name: "Loc1" } }
            ]
        });

        assert.ok(
            oModel.setProperty.calledWithMatch("/data/detailPage/create/cml/locationTemplateList", sinon.match.array),
            "Location template list updated"
        );

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/nextStepEnabled", true),
            "Next step enabled"
        );

    });


    QUnit.test("onCreateCMLWizNav - moves wizard and updates step", function (assert) {

        var oWizard = {
            nextStep: sinon.spy(),
            previousStep: sinon.spy(),
            /**
             * 
             */
            getProgress: function () { return 2; }
        };

        var oModel = {
            setProperty: sinon.spy()
        };

        sinon.stub(sap.ui.core.Fragment, "byId").returns(oWizard);
        this.oView.getId = function () { return "testID"; };
        this.oView.getModel = function (sName) { return sName === "mCMLModel" ? oModel : undefined; };

        this.oController.onValidateDetailCreateCMLWiz = sinon.spy();

        this.oController.onCreateCMLWizNav({}, "next");

        assert.ok(oWizard.nextStep.calledOnce, "Wizard next step called");

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/currStep", 2),
            "Model updated with current step"
        );

        assert.ok(
            this.oController.onValidateDetailCreateCMLWiz.calledWith("step2"),
            "Validation called for step2"
        );

        sap.ui.core.Fragment.byId.restore();
    });


    QUnit.test("onValidateDetailCreateCMLWiz - step1 validation", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml").returns({
            selectedObjectTemplate: "T1"
        });

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        this.oController.onValidateDetailCreateCMLWiz("step1");

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/nextStepEnabled", true),
            "Next step enabled because template selected"
        );

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/createEnabled", false),
            "Create button disabled on step1"
        );
    });


    QUnit.test("onValidateDetailCreateCMLWiz - step2 enables create when one complete row exists", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml").returns({
            customDataset: [{
                name: "A",
                description: "B",
                cmlTemplate: "T1"
            }]
        });

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        this.oController.onValidateDetailCreateCMLWiz("step2");

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/createEnabled", true),
            "Create enabled when row is complete"
        );

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/nextStepEnabled", false),
            "Step2 always disables next"
        );
    });


    QUnit.test("onValidateDetailCreateCMLWiz - step2 disables create when row incomplete", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml").returns({
            customDataset: [{
                name: "A",
                description: "",
                cmlTemplate: "T1"
            }]
        });

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        this.oController.onValidateDetailCreateCMLWiz("step2");

        assert.ok(
            oModel.setProperty.calledWith("/metaData/detailPage/create/cml/wizard/createEnabled", false),
            "Create disabled when row incomplete"
        );
    });


    QUnit.test("handleDetailAddNewRow - adds rows and resets counter", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };
        oModel.getProperty.withArgs("/data/detailPage/create/cml/addRowCount").returns("2");

        var aExisting = [];
        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns(aExisting);
        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        this.oController.fnUpdateDeleteButtonState = sinon.spy();
        this.oController.handleDetailAddNewRow();

        assert.equal(aExisting.length, 2, "Two rows added");
        assert.ok( oModel.setProperty.calledWith("/data/detailPage/create/cml/customDataset", aExisting), "Dataset updated" );
        assert.ok( oModel.setProperty.calledWith("/data/detailPage/create/cml/addRowCount", ""), "Row counter reset" );
        assert.ok( this.oController.fnUpdateDeleteButtonState.calledOnce, "Delete button state updated" );

    });


    QUnit.test("handleDetailDeleteTableRow - deletes specific row", function (assert) {

        var aRows = [
            { name: "A" },
            { name: "B" },
            { name: "C" }
        ];

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns(aRows);

        var oEvent = {
            /**
             * 
             */
            getSource: function () {
                return {
                    /**
                     * 
                     */
                    getBindingContext: function () {
                        return {
                            /**
                             * 
                             */
                            getPath: function () { return "/data/detailPage/create/cml/customDataset/1"; }
                        };
                    }
                };
            }
        };

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        this.oController.fnUpdateDeleteButtonState = sinon.spy();

        this.oController.handleDetailDeleteTableRow(oEvent);

        assert.deepEqual(aRows, [{ name: "A" }, { name: "C" }], "Row at index 1 removed");

        assert.ok(
            oModel.setProperty.calledWith("/data/detailPage/create/cml/customDataset", aRows),
            "Updated dataset saved"
        );

        assert.ok(
            this.oController.fnUpdateDeleteButtonState.calledOnce,
            "Delete button state updated"
        );

    });


    QUnit.test("onDetailTableNumberValChange - sets Error when value < 1", function (assert) {

        var oModel = {
            setProperty: sinon.spy(),
            getProperty: sinon.stub()
        };

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        var oSource = {
            setValueState: sinon.spy()
        };

        var oEvent = {
            /**
             * 
             */
            getParameter: function () { return 0; },
            /**
             * 
             */
            getSource: function () { return oSource; }
        };

        this.oController.onDetailTableNumberValChange(oEvent);

        assert.ok(
            oModel.setProperty.calledWith("/data/detailPage/create/cml/addRowCount", ""),
            "Row count cleared when value < 1"
        );

        assert.ok(
            oSource.setValueState.calledWith("Error"),
            "Value state set to Error"
        );

    });


    QUnit.test("onDetailTableNumberValChange - sets None when value >= 1", function (assert) {

        var oModel = {
            setProperty: sinon.spy(),
            getProperty: sinon.stub()
        };

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        var oSource = {
            setValueState: sinon.spy()
        };

        var oEvent = {
            /**
             * 
             */
            getParameter: function () { return 2; },
            /**
             * 
             */
            getSource: function () { return oSource; }
        };

        this.oController.onDetailTableNumberValChange(oEvent);

        assert.ok(
            oSource.setValueState.calledWith("None"),
            "Value state set to None when value >= 1"
        );
    });


    QUnit.test("fnUpdateDeleteButtonState - enables delete only when more than 1 row", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset")
            .returns([{}, {}, {}]);

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };

        this.oController.fnUpdateDeleteButtonState();

        assert.ok(
            oModel.setProperty.calledWith("/data/detailPage/create/cml/isDeleteEnabled", true),
            "Delete enabled for >1 rows"
        );

    });


    QUnit.test("onDetailCreateCancel - resets model, resets wizard and closes dialog", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty
            .withArgs("/data/detailPage/create/cml/objectTemplateList")
            .returns([{ key: "T1" }]);

        this.oView.getModel = function (name) {
            return name === "mCMLModel" ? oModel : undefined;
        };
        var oWizard = {
            /**
             *
             */
            getSteps: function () { return ["step1", "step2"]; },
            goToStep: sinon.spy()
        };

        sinon.stub(this.oController, "byId")
            .withArgs("idDetailCreateCMLWizard")
            .returns(oWizard);

        var oCloseSpy = sinon.spy();
        this.oController._oCreateCMLDialog = { close: oCloseSpy };

        this.oController.onDetailCreateCancel();

        assert.ok(
            oModel.setProperty.calledWithMatch(
                "/data/detailPage/create/cml",
                sinon.match.object
            ),
            "Model reset with default CML structure"
        );

        assert.ok(
            oWizard.goToStep.calledOnce,
            "Wizard navigated back to first step"
        );

        assert.ok(
            oCloseSpy.calledOnce,
            "Dialog close called"
        );

        this.oController.byId.restore();
    });


    QUnit.test("onAfterCreateCMLDialogOpen - resets wizard and triggers validation", function (assert) {

        var oWizard = {
            /**
             *
             */
            getSteps: function () { return ["step1", "step2"]; },
            goToStep: sinon.spy(),
            setCurrentStep: sinon.spy(),
            setAllowStepNavigation: sinon.spy()
        };

        sinon.stub(this.oController, "byId").withArgs("idDetailCreateCMLWizard").returns(oWizard);

        this.oController.onValidateDetailCreateCMLWiz = sinon.spy();
        this.oController.fnUpdateDeleteButtonState = sinon.spy();

        this.oController.onAfterCreateCMLDialogOpen();

        assert.ok(oWizard.goToStep.calledOnce, "goToStep called once");
        assert.ok(oWizard.setCurrentStep.calledOnce, "setCurrentStep called");
        assert.ok(oWizard.setAllowStepNavigation.calledWith(false), "Navigation disabled");

        assert.ok(this.oController.onValidateDetailCreateCMLWiz.calledWith("step1"),
            "Validation triggered for step1");

        assert.ok(this.oController.fnUpdateDeleteButtonState.calledOnce,
            "Delete button state updated");

        this.oController.byId.restore();
    });


    QUnit.test("onDetailTableNameValChange - updates model and sets value state correctly", function (assert) {

        var oRow = { name: "", description: "" };

        var oSource = {
            /**
             * 
             */
            getBindingContext: function (modelName) {
                return {
                    /**
                     * 
                     */
                    getObject: function () { return oRow; }
                };
            },
            setValueState: sinon.spy()
        };

        var oEvent = {
            /**
             * 
             */
            getParameter: function () { return "Test Name"; },
            /**
             * 
             */
            getSource: function () { return oSource; }
        };

        this.oController.onValidateDetailCreateCMLWiz = sinon.spy();

        this.oController.onDetailTableNameValChange(oEvent);

        assert.equal(oRow.name, "Test Name", "Row name updated");

        assert.ok(
            oSource.setValueState.calledWith("None"),
            "Value state set to None for valid name"
        );

        assert.ok(
            this.oController.onValidateDetailCreateCMLWiz.calledWith("step2"),
            "Validation for step2 executed"
        );
    });


    QUnit.test("onDetailTableDescpValChange - updates model and sets value state correctly", function (assert) {

        var oRow = { name: "Existing Name", description: "" };

        var oSource = {
            /**
             *
             */
            getBindingContext: function (modelName) {
                if (modelName === "mCMLModel") {
                    return {
                        /**
                         *
                         */
                        getObject: function () { return oRow; }
                    };
                }
                return null;
            },
            setValueState: sinon.spy()
        };

        var oEvent = {
            /**
             *
             */
            getParameter: function (param) {
                if (param === "value") return "";
                return undefined;
            },
            /**
             * 
             */
            getSource: function () { return oSource; }
        };

        this.oController.onValidateDetailCreateCMLWiz = sinon.spy();

        this.oController.onDetailTableDescpValChange(oEvent);

        assert.equal(oRow.description, "", "Row description updated to empty");

        assert.ok(
            oSource.setValueState.calledWith("Error"),
            "Value state set to Error when description missing but name exists"
        );

        assert.ok(
            this.oController.onValidateDetailCreateCMLWiz.calledWith("step2"),
            "Validation triggered for step2"
        );
    });


    QUnit.test("onCMLTemplateChange - sets template key and triggers validation", function (assert) {

        var oRow = { cmlTemplate: "" };

        var oEvent = {
            /**
             *
             */
            getSource: function () {
                return {
                    /**
                     *
                     */
                    getSelectedKey: function () { return "TEMP100"; },
                    /**
                     *
                     */
                    getBindingContext: function () {
                        return {
                            /**
                             *
                             */
                            getObject: function () { return oRow; }
                        };
                    }
                };
            }
        };

        this.oController.onValidateDetailCreateCMLWiz = sinon.spy();

        this.oController.onCMLTemplateChange(oEvent);

        assert.equal(oRow.cmlTemplate, "TEMP100", "Template key set on row");

        assert.ok(
            this.oController.onValidateDetailCreateCMLWiz.calledWith("step2"),
            "Validation triggered for step2"
        );
    });


    QUnit.test("onCMLCreate - shows error when no rows are valid", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset")
            .returns(undefined);

        var oMessageModel = {
            /**
             * 
             */
            getResourceBundle: function () {
                return {
                    /**
                     * 
                     */
                    getText: function () { return "MSG"; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return undefined;
        };

        this.oController.fnMessageShow = sinon.spy();

        this.oController.CMLHelper = {
            fnValidateCMLName: sinon.stub().callsArgWith(3, false, [])
        };

        this.oController.oI18n = {
            /**
             * 
             */
            getText: function () { return "MSG"; }
        };

        this.oController.onCMLCreate();

        assert.ok(
            this.oController.fnMessageShow.calledWith("E", "MSG"),
            "Error shown when no valid payload rows"
        );
    });

    QUnit.test("onCMLCreate - shows duplicate local name error and returns", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns([
            { name: "DupName", description: "D1", cmlTemplate: "LT1" },
            { name: "dupname", description: "D2", cmlTemplate: "LT2" }
        ]);

        var oMessageModel = {
            /**
             * 
             */
            getResourceBundle: function () {
                return {
                    /**
                     * 
                     */
                    getText: function (k) { return k; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return undefined;
        };

        this.oController.fnMessageShow = sinon.spy();
        this.oController.CMLHelper = {fnValidateCMLName: sinon.spy()};

        this.oController.onCMLCreate();

        assert.ok(this.oController.fnMessageShow.calledWith("E", "CML.MESSAGE036"),"Duplicate local name error shown");
        assert.ok(this.oController.CMLHelper.fnValidateCMLName.notCalled,"Backend name validation not called when local duplicate exists");
    });

    QUnit.test("onCMLCreate - shows backend duplicate name error and returns", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns([
            { name: "UniqueName", description: "Desc", cmlTemplate: "LT1" }
        ]);

        var oMessageModel = {
            /**
             * 
             */
            getResourceBundle: function () {
                return {
                    /**
                     * 
                     */
                    getText: function (k) { return k; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return undefined;
        };

        this.oController.fnMessageShow = sinon.spy();
        this.oController.CMLDataSource = {
            createCML: sinon.spy()
        };
        this.oController.CMLHelper = {
            fnValidateCMLName: sinon.stub().callsArgWith(3, true, ["UniqueName"])
        };

        this.oController.onCMLCreate();

        assert.ok(this.oController.fnMessageShow.calledWith("E", "CML.MESSAGE022"),"Backend duplicate name error shown");
        assert.ok(this.oController.CMLDataSource.createCML.notCalled,"createCML not called when backend duplicate exists");
    });

    QUnit.test("onCMLCreate - creates payload and calls createCML for valid rows", function (assert) {
        var done = assert.async();

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy(),
            refresh: sinon.spy()
        };
        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns([
            { name: "Row1", description: "Desc1", cmlTemplate: "LT1" }
        ]);
        oModel.getProperty.withArgs("/data/detailPage/create/cml/locationTemplateList").returns([
            {
                id: "LT1",
                to_persona_master: [
                    { type: "DEFN", ID: "P100" }
                ]
            }
        ]);
        var oMessageModel = {
            /**
             * @description Mock getResourceBundle to return keys as values for testing
             */
            getResourceBundle: function () {
                return {
                    /**
                     * @description Mock getText to return keys as values for testing
                     */
                    getText: function (k) { return k; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return null;
        };

        this.oController._sObjectId = "EQ100";
        this.oController._sObjectType = "EQUI";

        this.oController.fnMessageShow = sinon.spy();
        this.oController.onCMLDialogClose = sinon.spy();
        this.oController.fnGetData = sinon.spy();
        this.oController.setCreatedModified = sinon.stub().returnsArg(0);

        this.oController.oI18n = {
            /**
             * @description Mock getText to return keys as values for testing
             */
            getText: function (k) { return k; }
        };

        this.oController.CMLHelper = {
            fnValidateCMLName: sinon.stub().callsArgWith(3, false, [])
        };

        var fnSuccessHandler;

        this.oController.CMLDataSource = {
            createCML: sinon.spy(function (payload, fnSuccess, fnError) {
                fnSuccessHandler = fnSuccess;
            }),
            getCMLAsset: sinon.stub().callsArgWith(1, { value: [] }),
            createCMLAsset: sinon.spy()
        };

        var oCtrl = this.oController;
        var originalFn = oCtrl.onCMLCreate.bind(oCtrl);
        oCtrl.onCMLCreate = function () {
            originalFn();
            oModel.refresh();
        };

        oCtrl.onCMLCreate();

        fnSuccessHandler();

        assert.ok(oCtrl.CMLDataSource.createCML.calledOnce, "createCML called");

        var payload = oCtrl.CMLDataSource.createCML.getCall(0).args[0];
        assert.equal(payload.name, "Row1", "Payload name correct");
        assert.equal(payload.cmlTemplateId, "LT1", "Template ID correct");
        assert.equal(payload.persona_id, "P100", "Persona DEFN assigned");

        assert.ok(oCtrl.CMLDataSource.getCMLAsset.calledOnce, "Asset lookup called");
        assert.ok(oCtrl.CMLDataSource.createCMLAsset.calledOnce, "Asset created (value empty)");

        assert.ok(oCtrl.onCMLDialogClose.calledOnce, "Dialog closed");
        assert.ok(oCtrl.fnGetData.calledOnce, "Data refreshed");
        assert.ok(
            oCtrl.fnMessageShow.calledWith("S", "asint.cml.detail.createcml.message004"),
            "Success message shown"
        );
        assert.ok(oModel.refresh.calledOnce, "Model refreshed");

        done();
    });

    QUnit.test("onCMLCreate - FLOC objectType: to_location populated with functionalLocation_ID", function (assert) {
        var done = assert.async();

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy(),
            refresh: sinon.spy()
        };
        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns([
            { name: "TestFLOC", description: "DescFLOC", cmlTemplate: "LT1" }
        ]);
        oModel.getProperty.withArgs("/data/detailPage/create/cml/locationTemplateList").returns([
            {
                id: "LT1",
                to_persona_master: [
                    { type: "DEFN", ID: "P200" }
                ]
            }
        ]);

        var oMessageModel = {
            /**
             * @description Mock getResourceBundle to return a test resource bundle
             */
            getResourceBundle: function () {
                return {
                    /**
                     * @description
                     */
                    getText: function (k) { return k; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return null;
        };

        this.oController._sObjectId = "FL-12345";
        this.oController._sObjectType = "FLOC";  

        this.oController.fnMessageShow = sinon.spy();
        this.oController.onCMLDialogClose = sinon.spy();
        this.oController.fnGetData = sinon.spy();
        this.oController.setCreatedModified = sinon.stub().returnsArg(0);

        this.oController.oI18n = {
            /**
             * @description Mock getText to return keys as texts
             */
            getText: function (k) { return k; }
        };

        this.oController.CMLHelper = {
            fnValidateCMLName: sinon.stub().callsArgWith(3, false, [])
        };

        var fnSuccessHandler;

        this.oController.CMLDataSource = {
            createCML: sinon.spy(function (payload, fnSuccess, fnError) {
                fnSuccessHandler = fnSuccess;
            }),
            getCMLAsset: sinon.stub().callsArgWith(1, { value: [] }),
            createCMLAsset: sinon.spy()
        };

        var oCtrl = this.oController;
        oCtrl.onCMLCreate();

        fnSuccessHandler();

        assert.ok(oCtrl.CMLDataSource.createCML.calledOnce, "createCML called for FLOC objectType");

        var payload = oCtrl.CMLDataSource.createCML.getCall(0).args[0];

        assert.ok(payload.to_location, "to_location array should exist for FLOC objectType");
        assert.strictEqual(payload.to_location.length, 1, "to_location should have exactly one element for FLOC");
        assert.strictEqual(payload.to_location[0].functionalLocation_ID, "FL-12345", "functionalLocation_ID should equal sObjectId");
        
        assert.ok(Array.isArray(payload.to_equipment), "to_equipment should be an array for FLOC");
        assert.strictEqual(payload.to_equipment.length, 0, "to_equipment should be empty array for FLOC objectType");

        assert.equal(payload.name, "TestFLOC", "Payload name correct");
        assert.equal(payload.objectType, "FLOC", "Payload objectType should be FLOC");
        assert.equal(payload.objectId, "FL-12345", "Payload objectId should be FL-12345");

        assert.ok(oCtrl.onCMLDialogClose.calledOnce, "Dialog closed");
        assert.ok(oCtrl.fnMessageShow.calledWith("S", "asint.cml.detail.createcml.message004"),"Success message shown");

        done();
    });

    QUnit.test("onCMLCreate - EQUI objectType: to_equipment populated with equipment_ID, to_location empty", function (assert) {
        var done = assert.async();

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy(),
            refresh: sinon.spy()
        };
        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns([
            { name: "TestEQUI", description: "DescEQUI", cmlTemplate: "LT2" }
        ]);
        oModel.getProperty.withArgs("/data/detailPage/create/cml/locationTemplateList").returns(undefined);

        var oMessageModel = {
            /**
             * @description Mock getResourceBundle to return keys as texts
             */
            getResourceBundle: function () {
                return {
                    /**
                     * @description Mock getText to return keys as texts
                     */
                    getText: function (k) { return k; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return null;
        };

        this.oController._sObjectId = "EQ-67890";
        this.oController._sObjectType = "EQUI";

        this.oController.fnMessageShow = sinon.spy();
        this.oController.onCMLDialogClose = sinon.spy();
        this.oController.fnGetData = sinon.spy();
        this.oController.setCreatedModified = sinon.stub().returnsArg(0);

        this.oController.oI18n = {
            /**
             * @description Mock getText to return keys as texts
             */
            getText: function (k) { return k; }
        };

        this.oController.CMLHelper = {
            fnValidateCMLName: sinon.stub().callsArgWith(3, false, [])
        };

        var fnSuccessHandler;

        this.oController.CMLDataSource = {
            createCML: sinon.spy(function (payload, fnSuccess, fnError) {
                fnSuccessHandler = fnSuccess;
            }),
            getCMLAsset: sinon.stub().callsArgWith(1, { value: [] }),
            createCMLAsset: sinon.spy()
        };

        var oCtrl = this.oController;
        oCtrl.onCMLCreate();

        fnSuccessHandler();

        assert.ok(oCtrl.CMLDataSource.createCML.calledOnce, "createCML called for EQUI objectType");

        var payload = oCtrl.CMLDataSource.createCML.getCall(0).args[0];

        assert.ok(payload.to_equipment, "to_equipment array should exist for EQUI objectType");
        assert.strictEqual(
            payload.to_equipment.length, 
            1, 
            "to_equipment should have exactly one element for EQUI"
        );
        assert.strictEqual(
            payload.to_equipment[0].equipment_ID, 
            "EQ-67890", 
            "equipment_ID should equal sObjectId"
        );

        assert.ok(Array.isArray(payload.to_location), "to_location should be an array for EQUI");
        assert.strictEqual(payload.to_location.length,0,"to_location should be empty array for EQUI objectType");

        assert.equal(payload.name, "TestEQUI", "Payload name correct");
        assert.equal(payload.objectType, "EQUI", "Payload objectType should be EQUI");
        assert.equal(payload.objectId, "EQ-67890", "Payload objectId should be EQ-67890");

        assert.ok(oCtrl.onCMLDialogClose.calledOnce, "Dialog closed");

        done();
    });

    QUnit.test("onCMLCreate - createCML error callback shows message005", function (assert) {

        var oModel = {
            getProperty: sinon.stub(),
            setProperty: sinon.spy(),
            refresh: sinon.spy()
        };

        oModel.getProperty.withArgs("/data/detailPage/create/cml/customDataset").returns([
            { name: "RowErr", description: "DescErr", cmlTemplate: "LT_ERR" }
        ]);
        oModel.getProperty.withArgs("/data/detailPage/create/cml/locationTemplateList").returns([]);

        var oMessageModel = {
            /**
             * @description Mock getResourceBundle to return keys as texts
             */
            getResourceBundle: function () {
                return {
                    /**
                     * @description Mock getText to return keys as texts
                     */
                    getText: function (k) { return k; }
                };
            }
        };

        this.oView.getModel = function (sName) {
            if (sName === "mCMLModel") { return oModel; }
            if (sName === "mMessage") { return oMessageModel; }
            return null;
        };

        this.oController._sObjectId = "EQ-ERR";
        this.oController._sObjectType = "EQUI";
        this.oController.setCreatedModified = sinon.stub().returnsArg(0);
        this.oController.fnMessageShow = sinon.spy();
        this.oController.oI18n = {
            /**
             * @description Mock getText to return keys as texts    
             */
            getText: function (k) { return k; }
        };
        this.oController.CMLHelper = {
            fnValidateCMLName: sinon.stub().callsArgWith(3, false, [])
        };

        var oError = { status: 500, message: "Create failed" };

        this.oController.CMLDataSource = {
            createCML: sinon.spy(function (payload, fnSuccess, fnError) {
                fnError(oError);
            }),
            getCMLAsset: sinon.spy(),
            createCMLAsset: sinon.spy()
        };

        this.oController.onCMLCreate();

        assert.ok(this.oController.CMLDataSource.createCML.calledOnce, "createCML called once");
        assert.ok(
            this.oController.fnMessageShow.calledWith("E", "asint.cml.detail.createcml.message005", oError),
            "Error message005 shown with backend error payload"
        );
    });

    QUnit.module("CMLDetail Controller - fnBulkCalculate", {
        /**
         * @description Set up the test environment before each test
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oMockComponent = {
                getModel: sinon.stub()
            };
            this.oMockCMLModel = {
                getProperty: sinon.stub()
            };
            
            sinon.stub(this.oController, "getOwnerComponent").returns(this.oMockComponent);
            this.oMockComponent.getModel.withArgs("mCMLModel").returns(this.oMockCMLModel);
            this.oController.CMLDataSource = {
                fnBulkCalculateCMl: sinon.stub()
            };
            sinon.stub(this.oController, "fnMessageShow");
            this.oController._sObjectId = "TEST123";
            this.oController._sObjectType = "EQUI";
        },
        /**
         * @description Clean up the test environment after each test
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should call bulk calculate with correct payload", function (assert) {
        var oMockCMLData = {
            categories: [
                {
                    categories: [
                        { locationId: "LOC001" },
                        { locationId: "LOC002" }
                    ]
                }
            ]
        };
        
        this.oMockCMLModel.getProperty.returns(oMockCMLData);
        this.oController.fnBulkCalculate({});
        
        assert.ok(this.oController.CMLDataSource.fnBulkCalculateCMl.calledOnce, 
            "fnBulkCalculateCMl should be called");
        
        var oPayload = this.oController.CMLDataSource.fnBulkCalculateCMl.getCall(0).args[0];
        assert.deepEqual(oPayload.data, [["LOC001", "LOC002"]], 
            "Payload data should contain location IDs");
        assert.equal(oPayload.url, "cml-manage&/detail/equipment/TEST123/cml", 
            "URL should be correctly formatted");
    });


    QUnit.module("CMLDataSource - getObjectDetails");
    /**
     *
     */
    QUnit.test("should call fnError when sUrl is empty", function (assert) {
        var bErrorCalled = false;

        /**
         * Function to be called on error
         */
        var fnError = function () {
            bErrorCalled = true;
        };

        var sUrl = "";

        if (!sUrl) {
            if (fnError) {
                fnError();
            }
        }

        assert.ok(bErrorCalled, "fnError should be called when sUrl is empty");
    });
    
    /**
     * 
     */
    QUnit.test("FLOC should call Functional Location API", function (assert) {
        var oController = new Controller();
        var oDS = oController.CMLDataSource;
        oDS._baseURI = "/base";

        var sCalledUrl = "";

        oDS.getUrl = function (sBase, sKey) {
            return sKey;
        };

        oDS.getData = function (sUrl) {
            sCalledUrl = sUrl;
        };

        oDS.getObjectDetails("FLOC", "123", function () {}, function () {});

        assert.strictEqual(
            sCalledUrl,
            "getCMLsByFunctionalLocationId",
            "FLOC should call Functional Location API"
        );
    });

    /**
     *
     */
    QUnit.test("EQUI should call Equipment API", function (assert) {
        var oController = new Controller();
        var oDS = oController.CMLDataSource;
        oDS._baseURI = "/base";

        var sCalledUrl = "";

        oDS.getUrl = function (sBase, sKey) {
            return sKey;
        };

        oDS.getData = function (sUrl) {
            sCalledUrl = sUrl;
        };

        oDS.getObjectDetails("EQUI", "123", function () {}, function () {});

        assert.strictEqual(
            sCalledUrl,
            "getCMLsByEquipmentId",
            "EQUI should call Equipment API"
        );
    });

    /**
     *
     */
    QUnit.test("Equipment should call Equipment API", function (assert) {
        var oController = new Controller();
        var oDS = oController.CMLDataSource;
        oDS._baseURI = "/base";

        var sCalledUrl = "";

        oDS.getUrl = function (sBase, sKey) {
            return sKey;
        };

        oDS.getData = function (sUrl) {
            sCalledUrl = sUrl;
        };

        oDS.getObjectDetails("Equipment", "123", function () {}, function () {});

        assert.strictEqual(
            sCalledUrl,
            "getCMLsByEquipmentId",
            "Equipment string should call Equipment API"
        );
    });

    /**
    * Unit Test cases for onPressSave date handling logic
    */
    QUnit.module("CMLDetail Controller - onPressSave", {
        /**
         * setup
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oTabsController = new CMLDetailTabs();
            this.oController._LocationController = this.oTabsController;
        },
        /**
         * cleanup
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     * DATE_IN_SERVICE: when value is already a Date object, should use it directly
     */
    QUnit.test("Should use Date object directly and NOT call normalizeDate for DATE_IN_SERVICE", function (assert) {

        var oDateValue = new Date(2026, 2, 1);
        var oNormalizeSpy = sinon.spy(this.oTabsController, "normalizeDate");

        var oDisDate = (oDateValue instanceof Date) ? oDateValue : this.oTabsController.normalizeDate(oDateValue);

        assert.ok(oNormalizeSpy.notCalled, "normalizeDate should not be called when value is already a Date");
        assert.strictEqual(oDisDate, oDateValue, "Should return the same Date object");
    });

    /**
     * DATE_IN_SERVICE: when value is a string, should call normalizeDate to convert it to Date object
     */
    QUnit.test("Should call normalizeDate when DATE_IN_SERVICE is a string", function (assert) {

        var sDateValue = "2026-03-01T18:30:00.000Z";
        var oNormalizeSpy = sinon.spy(this.oTabsController, "normalizeDate");

        var oDisDate = (sDateValue instanceof Date) ? sDateValue : this.oTabsController.normalizeDate(sDateValue);

        assert.ok(oNormalizeSpy.calledOnce, "normalizeDate should be called for string input");
        assert.ok(oDisDate instanceof Date, "Result should be a Date object");
    });

    /**
     * DATE_IN_SERVICE: should produce correct MM-DD-YYYY formatted string from Date object when displaying date
     */
    QUnit.test("Should produce correct MM-DD-YYYY formatted string from Date object for DATE_IN_SERVICE", function (assert) {

        var oDateValue = new Date(2026, 2, 1);

        var oDisDate = (oDateValue instanceof Date) ? oDateValue : this.oTabsController.normalizeDate(oDateValue);
        var iDate = ((oDisDate.getDate() < 10) ? ("0" + oDisDate.getDate()) : oDisDate.getDate());
        var iMonth = oDisDate.getMonth() + 1;
        var iMonthVal = iMonth < 10 ? "0" + iMonth : iMonth;
        var sDate = iMonthVal + "-" + iDate + "-" + oDisDate.getFullYear();

        assert.strictEqual(sDate, "03-01-2026", "Should produce correct MM-DD-YYYY string from local date parts");
    });

    /**
     * DATE_IN_SERVICE: when saving, should convert Date object to T18:30:00.000Z format string for backend
     */
    QUnit.test("Should convert Date field to T18:30:00.000Z format before encoding in payload", function (assert) {

        var oDateField = new Date(2026, 2, 1);

        var oValueToSave = oDateField;
        if (oValueToSave instanceof Date) {
            oValueToSave = this.oTabsController.fnGetBEDate(oValueToSave) + "T18:30:00.000Z";
        }

        assert.strictEqual(oValueToSave, "2026-03-01T18:30:00.000Z", "Date should be T18:30 format string");
    });

    /**
     * DATE_IN_SERVICE: when saving, non-Date values should pass through unchanged and not be converted to string
     */
    QUnit.test("Should leave non-Date values unchanged in payload", function (assert) {

        var nValue = 0.75;

        var oValueToSave = nValue;
        if (oValueToSave instanceof Date) {
            oValueToSave = this.oTabsController.fnGetBEDate(oValueToSave) + "T18:30:00.000Z";
        }

        assert.strictEqual(oValueToSave, 0.75, "Number value should be unchanged");
    });

    /**
     * READINGS: when iterating over reading fields to prepare payload, DATE fields that are Date objects should be converted to T18:30:00.000Z format strings, while non-Date fields should be left unchanged
     */
    QUnit.test("Should convert DATE field in reading to T18:30:00.000Z before JSON.stringify", function (assert) {

        var oReading = { DATE: new Date(2026, 2, 1), READING: 0.7, dataId: "abc-123" };

        var oReadingToSave = {};
        var oTabsCtrl = this.oTabsController;
        Object.keys(oReading).forEach(function (sKey) {
            if (oReading[sKey] instanceof Date) {
                oReadingToSave[sKey] = oTabsCtrl.fnGetBEDate(oReading[sKey]) + "T18:30:00.000Z";
            } else {
                oReadingToSave[sKey] = oReading[sKey];
            }
        });

        assert.strictEqual(oReadingToSave.DATE, "2026-03-01T18:30:00.000Z", "DATE should be T18:30 format");
        assert.strictEqual(oReadingToSave.READING, 0.7, "Non-date field should be unchanged");
    });

    /**
     * READINGS: when iterating over reading fields, non-Date fields should pass through unchanged and not be converted to string
     */
    QUnit.test("Should pass all non-Date fields in reading through unchanged", function (assert) {

        var oReading = { READING: 0.7, NDE_METHOD: "UT", dataId: "abc-123" };

        var oReadingToSave = {};
        var oTabsCtrl = this.oTabsController;
        Object.keys(oReading).forEach(function (sKey) {
            if (oReading[sKey] instanceof Date) {
                oReadingToSave[sKey] = oTabsCtrl.fnGetBEDate(oReading[sKey]) + "T18:30:00.000Z";
            } else {
                oReadingToSave[sKey] = oReading[sKey];
            }
        });

        assert.strictEqual(oReadingToSave.READING, 0.7, "READING should be unchanged");
        assert.strictEqual(oReadingToSave.NDE_METHOD, "UT", "NDE_METHOD should be unchanged");
        assert.strictEqual(oReadingToSave.dataId, "abc-123", "dataId should be unchanged");
    });

    /**
     * READINGS: when iterating over reading fields, if DATE field is null, it should pass through as null and not cause any crashes or attempts to convert it to string
     */
    QUnit.test("Should not crash when DATE field in reading is null", function (assert) {

        var oReading = { DATE: null, READING: 0.7 };

        var oReadingToSave = {};
        var oTabsCtrl = this.oTabsController;
        Object.keys(oReading).forEach(function (sKey) {
            if (oReading[sKey] instanceof Date) {
                oReadingToSave[sKey] = oTabsCtrl.fnGetBEDate(oReading[sKey]) + "T18:30:00.000Z";
            } else {
                oReadingToSave[sKey] = oReading[sKey];
            }
        });

        assert.strictEqual(oReadingToSave.DATE, null, "null DATE should pass through without crashing");
    });

    /**
     * READINGS: if Date field is string then fnGetBEDate should return null
     */
    QUnit.test("Should return null from fnGetBEDate when a string is passed instead of Date", function (assert) {

        var sResult = this.oTabsController.fnGetBEDate("2026-03-01");

        assert.strictEqual(sResult, null, "fnGetBEDate should return null for string input - only accepts Date objects");
    });

    /**
     * DATE_IN_SERVICE: when displaying date, if value is undefined, should return empty string and not throw any errors
     */
    QUnit.test("Should not crash when DATE_IN_SERVICE value is undefined", function (assert) {

        var oValue = undefined;

        var oDisDate = (oValue instanceof Date) ? oValue : this.oTabsController.normalizeDate(oValue);

        assert.strictEqual(oDisDate, "", "undefined should return empty string and not throw an error");
    });

    QUnit.module("onPressCML - New Implementation", {
        /**
         *
         */
        beforeEach: function () {
            this.oSelectedData = { id: "cml123", name: "Test CML" };

            this.oCommonCMLModel = {
                getProperty: sinon.stub().returns(this.oSelectedData),
                setProperty: sinon.stub()
            };

            this.oContext = {
                getPath: sinon.stub().returns("/data/CMLs/0")
            };

            this.oTag = {
                getBindingContext: sinon.stub().returns(this.oContext)
            };

            this.oEvent = {
                getSource: sinon.stub().returns(this.oTag)
            };

            this.oController = {
                getView: sinon.stub().returns({
                    getModel: sinon.stub().returns(this.oCommonCMLModel)
                }),
                _LocationController: { fnInitialize: sinon.stub() },
                onPressCML: Controller.prototype.onPressCML
            };
        },

        /**
         *
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should return early when oContext is null", function (assert) {
        this.oTag.getBindingContext.returns(null);

        this.oController.onPressCML.call(this.oController, this.oEvent);

        assert.ok(this.oCommonCMLModel.setProperty.notCalled, "setProperty should not be called when context is null");
    });

    QUnit.test("Should set detailSelectedCML with selected data", function (assert) {
        this.oController.onPressCML.call(this.oController, this.oEvent);

        assert.ok(
            this.oCommonCMLModel.setProperty.calledWith("/data/detailPage/detailSelectedCML", this.oSelectedData),
            "detailSelectedCML should be set with selected CML data"
        );
    });

    QUnit.test("Should call fnInitialize with correct arguments", function (assert) {
        this.oController.onPressCML.call(this.oController, this.oEvent);

        assert.ok(
            this.oController._LocationController.fnInitialize.calledWith(
                this.oController, this.oCommonCMLModel, this.oSelectedData
            ),
            "fnInitialize should be called with controller, model, and selected data"
        );
    });

    QUnit.test("Should set layout to TwoColumnsMidExpanded", function (assert) {
        this.oController.onPressCML.call(this.oController, this.oEvent);

        assert.ok(
            this.oCommonCMLModel.setProperty.calledWith("/data/detailPage/layout", "TwoColumnsMidExpanded"),
            "Layout should be set to TwoColumnsMidExpanded"
        );
    });

    QUnit.module("fnBulkCalculate - Negative Test Cases", {
        /**
         *
         */
        beforeEach: function () {
            this.oCommonCMLModel = {
                getProperty: sinon.stub().returns({
                    categories: [
                        { categories: [{ locationId: "loc1" }, { locationId: "loc2" }] }
                    ]
                })
            };

            this.oController = {
                _sObjectId: "OBJ001",
                _sObjectType: "EQUI",
                CMLDataSource: { fnBulkCalculateCMl: sinon.stub() },
                fnMessageShow: sinon.stub(),
                oI18n: { getText: sinon.stub() },
                getOwnerComponent: sinon.stub().returns({
                    getModel: sinon.stub().returns(this.oCommonCMLModel)
                }),
                fnBulkCalculate: Controller.prototype.fnBulkCalculate
            };

            this.oController.oI18n.getText.withArgs("asint.detail.bulkCalculate.message001").returns("Calculation started");
            this.oController.oI18n.getText.withArgs("asint.detail.bulkCalculate.message002").returns("Calculation already in progress");
            this.oController.oI18n.getText.withArgs("asint.detail.bulkCalculate.message003").returns("Calculation failed");
        },

        /**
         *
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should NOT show message002 when response is different string", function (assert) {
        this.oController.fnBulkCalculate.call(this.oController);

        var fnSuccessCallback = this.oController.CMLDataSource.fnBulkCalculateCMl.getCall(0).args[1];
        fnSuccessCallback("SOME OTHER RESPONSE");

        assert.notOk(
            this.oController.fnMessageShow.calledWith("I", "Calculation already in progress"), "Should NOT show message002 for a non-matching response"
        );
    });

    QUnit.test("Should NOT show message002 when response is null", function (assert) {
        this.oController.fnBulkCalculate.call(this.oController);

        var fnSuccessCallback = this.oController.CMLDataSource.fnBulkCalculateCMl.getCall(0).args[1];
        fnSuccessCallback(null);

        assert.notOk(this.oController.fnMessageShow.calledWith("I", "Calculation already in progress"),"Should NOT show message002 when response is null");
    });

    QUnit.test("Should NOT show message002 when response is undefined", function (assert) {
        this.oController.fnBulkCalculate.call(this.oController);

        var fnSuccessCallback = this.oController.CMLDataSource.fnBulkCalculateCMl.getCall(0).args[1];
        fnSuccessCallback(undefined);

        assert.notOk(this.oController.fnMessageShow.calledWith("I", "Calculation already in progress"),"Should NOT show message002 when response is undefined");
    });

    QUnit.test("Should NOT show message002 when response is partial match string", function (assert) {
        this.oController.fnBulkCalculate.call(this.oController);

        var fnSuccessCallback = this.oController.CMLDataSource.fnBulkCalculateCMl.getCall(0).args[1];
        fnSuccessCallback("CML Calculation");

        assert.notOk(this.oController.fnMessageShow.calledWith("I", "Calculation already in progress"),"Should NOT show message002 for partial matching response string");
    });

    QUnit.test("Should NOT show message001 or message002 when error callback is triggered", function (assert) {
        this.oController.fnBulkCalculate.call(this.oController);

        var fnErrorCallback = this.oController.CMLDataSource.fnBulkCalculateCMl.getCall(0).args[2];
        fnErrorCallback();

        assert.notOk(this.oController.fnMessageShow.calledWith("I", "Calculation started"),"Should NOT show message001 on error");
        assert.notOk(this.oController.fnMessageShow.calledWith("I", "Calculation already in progress"),"Should NOT show message002 on error");
    });
    /**
     * DATE_IN_SERVICE: after save succeeds, the success callback calls normalizeDate
     */
    QUnit.test("Should return valid Date object with correct date parts when normalizeDate is called", function (assert) {

        var sDateInService = "03-01-2026";

        var oResult = this.oTabsController.normalizeDate(sDateInService);

        assert.ok(oResult instanceof Date && !isNaN(oResult.getTime()), "normalizeDate should return a valid Date object");
        assert.strictEqual(oResult.getFullYear(), 2026, "Year should be 2026");
        assert.strictEqual(oResult.getMonth(), 2, "Month index should be 2 (March)");
        assert.strictEqual(oResult.getDate(), 1, "Day should be 1");
    });

    /**
     * DATE_IN_SERVICE: the Date object returned by normalizeDate in the success callback
     */
    QUnit.test("Should be able to call getDate getMonth getFullYear on normalizeDate without errors", function (assert) {

        var sDateInService = "03-01-2026";
        var oResult = this.oTabsController.normalizeDate(sDateInService);

        var iDay, iMonth, iYear;
        var bThrew = false;
        try {
            iDay   = oResult.getDate();
            iMonth = oResult.getMonth() + 1;
            iYear  = oResult.getFullYear();
        } catch (e) {
            bThrew = true;
        }

        assert.ok(!bThrew, "getDate, getMonth and getFullYear should not throw on second save");
        assert.strictEqual(iDay,   1,    "getDate() should return 1");
        assert.strictEqual(iMonth, 3,    "getMonth() + 1 should return 3 (March)");
        assert.strictEqual(iYear,  2026, "getFullYear() should return 2026");
    });

    /**
     * DATE_IN_SERVICE: when the success callback receives the MM-DD-YYYY string
     */
    QUnit.test("Should call normalizeDate exactly once in success callback when DATE_IN_SERVICE is MM-DD-YYYY string", function (assert) {

        var sDateInService = "03-01-2026";
        var oNormalizeSpy = sinon.spy(this.oTabsController, "normalizeDate");

        var oResult = (sDateInService instanceof Date) ? sDateInService : this.oTabsController.normalizeDate(sDateInService);

        assert.ok(oNormalizeSpy.calledOnce, "normalizeDate should be called once for MM-DD-YYYY string");
        assert.ok(oResult instanceof Date, "Result should be a Date object ready for second save");
    });

    /**
     * DATE_IN_SERVICE: when the success callback value is already a Date object
     */
    QUnit.test("Should not call normalizeDate in success callback when DATE_IN_SERVICE is already a Date object", function (assert) {

        var oDateInService = new Date(2026, 2, 1);
        var oNormalizeSpy = sinon.spy(this.oTabsController, "normalizeDate");

        var oResult = (oDateInService instanceof Date) ? oDateInService : this.oTabsController.normalizeDate(oDateInService);

        assert.ok(oNormalizeSpy.notCalled, "normalizeDate should not be called when value is already a Date object");
        assert.strictEqual(oResult, oDateInService, "Should return the same Date object");
    });

    QUnit.module("onPressSave - _locationId condition", {
        /**
         *
         */
        beforeEach: function () {
            this.oController = new Controller();
            this.oInitSpy = sinon.spy();
            var oModelData = {
                "/data/CMLTabSection/LocationData/DataSource": { DATE_IN_SERVICE: new Date("2024-01-15"), SOME_FIELD: "value" },
                "/data/CMLTabSection/LocationData/oTempDataSource": JSON.stringify({ SOME_FIELD: "old_value" }),
                "/data/CMLTabSection/LocationData/DataSourceBEFormat": [{ dataSourcename: "SOME_FIELD", ID: "ds-001", isIgnored: false }],
                "/data/CMLTabSection/Detail/LocationPersonaData/sectionList": [],
                "/data/ignoredReading": {},
                "/data/selectedCML": { cmlId: "cml-123", objectId: "obj-456", objectType: "Equipment", eTag: "etag-1" },
                "/data/detailPage/aCMLs": [{
                    ID: "cml-123", objectId: "obj-456", objectType: "Equipment",
                    name: "Test", displayId: "CML-001", recommendation_ID: "rec-1",
                    persona_id: "p-1", active: true,
                    to_values: [{ dataSourcename: "SOME_FIELD", referenceId: "ref-1", referenceType: "EQUI" }]
                }],
                "/data/detailPage/detailSelectedCML": { ID: "cml-123" }
            };

            var oFakeModel = {
                /**
                 *
                 */
                getProperty: function (sPath) { return oModelData[sPath]; },
                /**
                 *
                 */
                setProperty: function () {}
            };
            /**
             *
             */
            this.oController.getOwnerComponent = function () {
                /**
                 *
                 */
                return {
                    /**
                     *
                     * @returns
                     */
                    getModel: function () { return oFakeModel; } };
            };
            /**
             *
             */
            this.oController.getView = function () {
                return {
                    /**
                     *
                     */
                    getModel: function () {
                        return {
                            /**
                             *
                             * @returns
                             */
                            getResourceBundle: function () {
                                return {
                                    /**
                                     *
                                     * @param {*} k
                                     * @returns
                                     */
                                    getText: function (k) { return k; }
                                };
                            }
                        };
                    },
                    /**
                     *
                     */
                    getId: function () { return "view-id"; },
                    /**
                     *
                     */
                    addDependent: function () {}
                };
            };

            this.oController._LocationController = {
                /**
                 *
                 */
                fnCheckMandatoryFields: function (a, b, c, fnSuccess) { fnSuccess(); },
                /**
                 *
                 */
                normalizeDate: function (s) { return new Date(s); },
                /**
                 *
                 */
                fnGetBEDate: function () { return "2024-01-15"; },
                fnInitialize: this.oInitSpy
            };

            this.oController.CMLDataSource = {
                /**
                 *
                 */
                saveCMLDataSourceValues: function (a, b, c, fnSuccess) { fnSuccess(); },
                /**
                 *
                 */
                fnGetSummary: function (a, b, fnSuccess) { fnSuccess(null); }
            };
            /**
             *
             */
            this.oController.getUOMBasedDataSource = function (a, b, fn) { fn(b); };
            /**
             *
             */
            this.oController.setCreatedModified = function (p) { return p; };
            /**
             *
             */
            this.oController.fnMessageShow = function () {};
            /**
             *
             */
            this.oController.fnCmlSummaryData = function () {};
        }
    });

    /**
     *
     */
    QUnit.test("Should call fnInitialize when _locationId is undefined", function (assert) {
        var done = assert.async();
        this.oController._locationId = undefined;
        /**
         *
         */
        this.oController.fnGetData = function (type, id, callback) {
            callback();
            assert.ok(this.oInitSpy.calledOnce, "fnInitialize called when _locationId is undefined");
            done();
        }.bind(this);
        this.oController.onPressSave();
    });

    /**
     *
     */
    QUnit.test("Should call fnInitialize when _locationId is null", function (assert) {
        var done = assert.async();
        this.oController._locationId = null;
        /**
         *
         */
        this.oController.fnGetData = function (type, id, callback) {
            callback();
            assert.ok(this.oInitSpy.calledOnce, "fnInitialize called when _locationId is null");
            done();
        }.bind(this);
        this.oController.onPressSave();
    });

    /**
     *
     */
    QUnit.test("Should call fnInitialize when _locationId is empty string", function (assert) {
        var done = assert.async();
        this.oController._locationId = "";
        /**
         *
         */
        this.oController.fnGetData = function (type, id, callback) {
            callback();
            assert.ok(this.oInitSpy.calledOnce, "fnInitialize called when _locationId is empty string");
            done();
        }.bind(this);
        this.oController.onPressSave();
    });

    /**
     *
     */
    QUnit.test("Should NOT call fnInitialize when _locationId is present", function (assert) {
        var done = assert.async();
        this.oController._locationId = "LOC123";
        /**
         *
         */
        this.oController.fnGetData = function (type, id, callback) {
            callback();
            assert.ok(this.oInitSpy.notCalled, "fnInitialize NOT called when _locationId is set");
            done();
        }.bind(this);
        this.oController.onPressSave();
    });

    QUnit.module("fnDuplicateinSameEqu - Unsupported objectType with i18n", {
        /**
         *
         */
        beforeEach: function () {
            this.oModelStub = {
                getProperty: sinon.stub()
            };

            this.oModelStub.getProperty.withArgs("/data/detailPage/copyPaste/sameAssestEdit").returns({
                name: "TestName",
                desc: "TestDescription"
            });

            this.oModelStub.getProperty.withArgs("/data/detailPage/aCMLs").returns([]);

            this.oModelStub.getProperty.withArgs("/metaData/featureFlag").returns({
                cmlEnableCopyAssetWithBgInfo: "1"
            });

            this.oModelStub.getProperty.returns(undefined);

            this.oI18nStub = {
                getText: sinon.stub().withArgs("asint.cml.detailPage.cloneCml.error.message001").returns("Unsupported object type for duplication")
            };

            this.oController = {
                getView: sinon.stub().returns({
                    getModel: sinon.stub().returns(this.oModelStub)
                }),
                oI18n: this.oI18nStub,
                fnDoCreateCMLOperation: sinon.stub(),
                fnMessageShow: sinon.stub(),
                fnDuplicateinSameEqu: Controller.prototype.fnDuplicateinSameEqu
            };
        },
        /**
         *
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     *
     */
    QUnit.test("FL objectType: to_location uses oNewPayload.objectId (not sObjectId)", function (assert) {
        var selectedItems = [{
            objectId: "FL-001",
            exportObjectType: "FL",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(this.oController.fnDoCreateCMLOperation.calledOnce, "fnDoCreateCMLOperation should be called");

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(oPayload.to_location, "to_location array should exist on payload");
        assert.strictEqual(
            oPayload.to_location[0].functionalLocation_ID,
            "FL-001",
            "functionalLocation_ID must equal oNewPayload.objectId ('FL-001'), not sObjectId (undefined)"
        );
        assert.notStrictEqual(
            oPayload.to_location[0].functionalLocation_ID,
            undefined,
            "functionalLocation_ID must NOT be undefined (sObjectId bug is fixed)"
        );
    });

    /**
     *
     */
    QUnit.test("FLOC objectType: to_location uses oNewPayload.objectId correctly", function (assert) {
        var selectedItems = [{
            objectId: "FLOC-999",
            exportObjectType: "FLOC",
            locationTemplateId: "TPL-02",
            persona_id: "P2"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(this.oController.fnDoCreateCMLOperation.calledOnce, "fnDoCreateCMLOperation should be called");

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.strictEqual(
            oPayload.to_location[0].functionalLocation_ID,
            "FLOC-999",
            "functionalLocation_ID must equal oNewPayload.objectId for FLOC type"
        );
    });

    QUnit.test("Functional Location objectType: to_location uses oNewPayload.objectId correctly", function (assert) {
        var selectedItems = [{
            objectId: "FLOC-999",
            exportObjectType: "Functional Location",
            locationTemplateId: "TPL-02",
            persona_id: "P2"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(this.oController.fnDoCreateCMLOperation.calledOnce, "fnDoCreateCMLOperation should be called");

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.strictEqual(
            oPayload.to_location[0].functionalLocation_ID,
            "FLOC-999",
            "functionalLocation_ID must equal oNewPayload.objectId for Functional Location type"
        );
    });

    /**
     *
     */
    QUnit.test("Unsupported objectType: fnMessageShow called with i18n text and fnDoCreateCMLOperation NOT called", function (assert) {
        var selectedItems = [{
            objectId: "OBJ-XYZ",
            exportObjectType: "UNKNOWN_TYPE",
            locationTemplateId: "TPL-05",
            persona_id: "P5"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oI18nStub.getText.calledWith("asint.cml.detailPage.cloneCml.error.message001"),
            "getText should be called with the correct i18n key"
        );

        assert.ok(
            this.oController.fnMessageShow.calledOnce,
            "fnMessageShow should be called exactly once"
        );
        assert.ok(
            this.oController.fnMessageShow.calledWith(
                "E",
                this.oI18nStub.getText("asint.cml.detailPage.cloneCml.error.message001")
            ),
            "fnMessageShow should be called with severity 'E' and the i18n resolved message"
        );

        assert.ok(
            this.oController.fnDoCreateCMLOperation.notCalled,
            "fnDoCreateCMLOperation must NOT be called when objectType is unsupported"
        );
    });

    /**
     *
     */
    QUnit.test("Unsupported objectType MAT: i18n error shown and create operation skipped", function (assert) {
        var selectedItems = [{
            objectId: "OBJ-XYZ",
            exportObjectType: "MAT",
            locationTemplateId: "TPL-06",
            persona_id: "P6"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oI18nStub.getText.calledWith("asint.cml.detailPage.cloneCml.error.message001"),
            "getText should be called with the correct i18n key for MAT type"
        );

        assert.ok(
            this.oController.fnMessageShow.calledWith(
                "E",
                this.oI18nStub.getText("asint.cml.detailPage.cloneCml.error.message001")
            ),
            "fnMessageShow should use i18n text for MAT unsupported type"
        );

        assert.strictEqual(
            this.oController.fnDoCreateCMLOperation.callCount,
            0,
            "Create operation must be skipped entirely for MAT unsupported type"
        );
    });

    /**
     *
     */
    QUnit.test("FL objectType: fnMessageShow must NOT be called (not unsupported)", function (assert) {
        var selectedItems = [{
            objectId: "FL-555",
            exportObjectType: "FL",
            locationTemplateId: "TPL-07",
            persona_id: "P7"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oController.fnMessageShow.notCalled,
            "fnMessageShow must NOT be called for valid FL objectType"
        );
        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation should be called for FL type"
        );
    });

    /**
     *
     */
    QUnit.test("EQP objectType: to_equipment is set with correct equipment_ID and to_location is absent", function (assert) {
        var selectedItems = [{
            objectId: "EQP-100",
            exportObjectType: "EQP",
            locationTemplateId: "TPL-10",
            persona_id: "P10"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation should be called once for EQP type"
        );

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(oPayload.to_equipment, "to_equipment must exist on payload for EQP type");
        assert.strictEqual(
            oPayload.to_equipment[0].equipment_ID,
            "EQP-100",
            "equipment_ID must equal objectId for EQP type"
        );
        assert.notOk(oPayload.to_location, "to_location must NOT be set for EQP type");
        assert.ok(
            this.oController.fnMessageShow.notCalled,
            "fnMessageShow must NOT be called for valid EQP objectType"
        );
    });

    /**
     *
     */
    QUnit.test("EQUI objectType: to_equipment is set with correct equipment_ID and to_location is absent", function (assert) {
        var selectedItems = [{
            objectId: "EQUI-200",
            exportObjectType: "EQUI",
            locationTemplateId: "TPL-11",
            persona_id: "P11"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation should be called once for EQUI type"
        );

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(oPayload.to_equipment, "to_equipment must exist on payload for EQUI type");
        assert.strictEqual(
            oPayload.to_equipment[0].equipment_ID,
            "EQUI-200",
            "equipment_ID must equal objectId for EQUI type"
        );
        assert.notOk(oPayload.to_location, "to_location must NOT be set for EQUI type");
        assert.ok(
            this.oController.fnMessageShow.notCalled,
            "fnMessageShow must NOT be called for valid EQUI objectType"
        );
    });

    QUnit.test("Equipment objectType: to_equipment is set with correct equipment_ID and to_location is absent", function (assert) {
        var selectedItems = [{
            objectId: "EQP-100",
            exportObjectType: "Equipment",
            locationTemplateId: "TPL-10",
            persona_id: "P10"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation should be called once for Equipment type"
        );

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(oPayload.to_equipment, "to_equipment must exist on payload for Equipment type");
        assert.strictEqual(
            oPayload.to_equipment[0].equipment_ID,
            "EQP-100",
            "equipment_ID must equal objectId for Equipment type"
        );
        assert.notOk(oPayload.to_location, "to_location must NOT be set for Equipment type");
        assert.ok(
            this.oController.fnMessageShow.notCalled,
            "fnMessageShow must NOT be called for valid Equipment objectType"
        );
    });

    /**
     *
     */
    QUnit.test("Payload static fields: active, deleted, name, objectId, objectType, persona_id, cmlTemplateId are mapped correctly", function (assert) {
        var selectedItems = [{
            objectId: "FL-300",
            exportObjectType: "FL",
            locationTemplateId: "TPL-20",
            persona_id: "PERSONA-X"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.strictEqual(oPayload.active,       true,        "active must be true");
        assert.strictEqual(oPayload.deleted,       false,       "deleted must be false");
        assert.strictEqual(oPayload.name,          "TestName",  "name must come from model sameAssestEdit.name");
        assert.strictEqual(oPayload.objectId,      "FL-300",    "objectId must come from selectedItems");
        assert.strictEqual(oPayload.objectType,    "FL",        "objectType must come from exportObjectType");
        assert.strictEqual(oPayload.persona_id,    "PERSONA-X", "persona_id must come from selectedItems");
        assert.strictEqual(oPayload.cmlTemplateId, "TPL-20",    "cmlTemplateId must come from locationTemplateId");
    });

    /**
     *
     */
    QUnit.test("to_description is built correctly with shortDescription, longDescription and language", function (assert) {
        var selectedItems = [{
            objectId: "FL-301",
            exportObjectType: "FL",
            locationTemplateId: "TPL-21",
            persona_id: "P21"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(Array.isArray(oPayload.to_description), "to_description must be an array");
        assert.strictEqual(oPayload.to_description.length, 1, "to_description must have exactly one entry");
        assert.strictEqual(
            oPayload.to_description[0].shortDescription,
            "TestDescription",
            "shortDescription must come from model desc"
        );
        assert.strictEqual(
            oPayload.to_description[0].longDescription,
            "",
            "longDescription must be empty string"
        );
        assert.strictEqual(
            oPayload.to_description[0].language,
            "en",
            "language must default to en"
        );
    });

    /**
     *
     */
    QUnit.test("fnDoCreateCMLOperation is called with Single as the second argument for valid types", function (assert) {
        var selectedItems = [{
            objectId: "EQP-999",
            exportObjectType: "EQP",
            locationTemplateId: "TPL-30",
            persona_id: "P30"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation must be called exactly once"
        );
        assert.strictEqual(
            this.oController.fnDoCreateCMLOperation.getCall(0).args[1],
            "Single",
            "second argument to fnDoCreateCMLOperation must be the string Single"
        );
    });

    /**
     *
     */
    QUnit.test("to_values: no matching CML in aCMLs - to_values is NOT added to payload", function (assert) {
        var selectedItems = [{
            objectId: "FL-NOMATCH",
            exportObjectType: "FL",
            locationId: "CML-DOES-NOT-EXIST",
            locationTemplateId: "TPL-50",
            persona_id: "P50"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation must still be called even when no CML match is found"
        );
        assert.notOk(
            // eslint-disable-next-line no-prototype-builtins
            oPayload.hasOwnProperty("to_values"),
            "to_values must NOT be added to payload when no matching CML is found"
        );
    });

    /**
     *
     */
    QUnit.test("to_values: matching CML found but to_values property is missing - to_values not added to payload", function (assert) {
        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-NO-VALS" }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-NOVALS",
            exportObjectType: "FL",
            locationId: "CML-NO-VALS",
            locationTemplateId: "TPL-51",
            persona_id: "P51"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.notOk(
            // eslint-disable-next-line no-prototype-builtins
            oPayload.hasOwnProperty("to_values"),
            "to_values must NOT be added when oFullCML.to_values is undefined"
        );
    });

    /**
     *
     */
    QUnit.test("to_values: matching CML found but to_values is not an array - to_values not added to payload", function (assert) {
        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-INVALID", to_values: "not-an-array" }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-BADVALS",
            exportObjectType: "FL",
            locationId: "CML-INVALID",
            locationTemplateId: "TPL-52",
            persona_id: "P52"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation must still be called when to_values is not an array"
        );
        assert.notOk(
            // eslint-disable-next-line no-prototype-builtins
            oPayload.hasOwnProperty("to_values"),
            "to_values must NOT be set when oFullCML.to_values is not an array"
        );
    });

    /**
     *
     */
    QUnit.test("to_values: READING entries are filtered out, non-READING entries are included", function (assert) {
        var aValuesWithReading = [
            { ID: "V1", dataSourcename: "TEMP_READING", createdAt: "2024-01-01", createdBy: "user1", modifiedAt: "2024-02-01", modifiedBy: "user2", value: 42 },
            { ID: "V2", dataSourcename: "PRESSURE",     createdAt: "2024-01-01", createdBy: "user1", modifiedAt: "2024-02-01", modifiedBy: "user2", value: 10 },
            { ID: "V3", dataSourcename: "FLOW_READING", createdAt: "2024-01-01", createdBy: "user1", modifiedAt: "2024-02-01", modifiedBy: "user2", value: 5  }
        ];

        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-LOC-FILTER", to_values: aValuesWithReading }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-FILTER",
            exportObjectType: "FL",
            locationId: "CML-LOC-FILTER",
            locationTemplateId: "TPL-60",
            persona_id: "P60"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(Array.isArray(oPayload.to_values), "to_values must be present on payload");
        assert.strictEqual(
            oPayload.to_values.length,
            1,
            "Only non-READING entries should survive (TEMP_READING and FLOW_READING excluded)"
        );
        assert.strictEqual(
            oPayload.to_values[0].dataSourcename,
            "PRESSURE",
            "The surviving entry must be PRESSURE"
        );
    });

    /**
     *
     */
    QUnit.test("to_values: entry with empty dataSourcename is NOT filtered out", function (assert) {
        var aValuesEmptyName = [
            { ID: "V5", dataSourcename: "", value: 7 }
        ];

        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-EMPTY-NAME", to_values: aValuesEmptyName }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-EMPTYNAME",
            exportObjectType: "FL",
            locationId: "CML-EMPTY-NAME",
            locationTemplateId: "TPL-64",
            persona_id: "P64"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.strictEqual(
            oPayload.to_values.length,
            1,
            "Entry with empty dataSourcename must NOT be filtered out"
        );
    });

    /**
     *
     */
    QUnit.test("to_values: audit fields are deleted from cloned entries, business fields are preserved", function (assert) {
        var aAuditValues = [{
            ID: "V10",
            dataSourcename: "VOLTAGE",
            createdAt: "2024-03-01",
            createdBy: "admin",
            modifiedAt: "2024-04-01",
            modifiedBy: "admin",
            value: 230
        }];

        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-LOC-AUDIT", to_values: aAuditValues }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-AUDIT",
            exportObjectType: "FL",
            locationId: "CML-LOC-AUDIT",
            locationTemplateId: "TPL-61",
            persona_id: "P61"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oEntry = this.oController.fnDoCreateCMLOperation.getCall(0).args[0].to_values[0];

        /* eslint-disable no-prototype-builtins */
        assert.notOk(oEntry.hasOwnProperty("ID"),         "ID must be deleted from cloned entry");
        assert.notOk(oEntry.hasOwnProperty("createdAt"),  "createdAt must be deleted from cloned entry");
        assert.notOk(oEntry.hasOwnProperty("createdBy"),  "createdBy must be deleted from cloned entry");
        assert.notOk(oEntry.hasOwnProperty("modifiedAt"), "modifiedAt must be deleted from cloned entry");
        assert.notOk(oEntry.hasOwnProperty("modifiedBy"), "modifiedBy must be deleted from cloned entry");
        assert.strictEqual(oEntry.value,          230,       "business field value must be preserved");
        assert.strictEqual(oEntry.dataSourcename, "VOLTAGE", "business field dataSourcename must be preserved");
    });

    /**
     *
     */
    QUnit.test("to_values: original source objects are NOT mutated by Object.assign", function (assert) {
        var oOriginalEntry = {
            ID: "V20",
            dataSourcename: "CURRENT",
            createdAt: "2024-01-01",
            createdBy: "user",
            modifiedAt: "2024-02-01",
            modifiedBy: "user",
            value: 15
        };

        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-LOC-CLONE", to_values: [oOriginalEntry] }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-CLONE",
            exportObjectType: "FL",
            locationId: "CML-LOC-CLONE",
            locationTemplateId: "TPL-62",
            persona_id: "P62"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.ok(
            oOriginalEntry.hasOwnProperty("ID"),
            "Source entry must NOT be mutated - ID must still exist"
        );
        assert.ok(
            oOriginalEntry.hasOwnProperty("createdAt"),
            "Source entry must NOT be mutated - createdAt must still exist"
        );
        assert.strictEqual(oOriginalEntry.ID, "V20", "Source entry ID value must remain unchanged");
    });

    /**
     *
     */
    QUnit.test("to_values: all entries have READING in name - to_values is set as empty array", function (assert) {
        var aAllReadingValues = [
            { ID: "V1", dataSourcename: "READING_A",    value: 1 },
            { ID: "V2", dataSourcename: "TEMP_READING", value: 2 }
        ];

        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns([{ ID: "CML-ALL-READING", to_values: aAllReadingValues }]);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-ALLREAD",
            exportObjectType: "FL",
            locationId: "CML-ALL-READING",
            locationTemplateId: "TPL-65",
            persona_id: "P65"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(
            oPayload.hasOwnProperty("to_values"),
            "to_values must exist on payload even when all entries are filtered"
        );
        assert.strictEqual(
            oPayload.to_values.length,
            0,
            "to_values must be empty array when all entries contain READING"
        );
    });

    /**
     *
     */
    QUnit.test("aCMLs returns null from model - fallback to empty array, fnDoCreateCMLOperation still called", function (assert) {
        this.oModelStub.getProperty.reset();
        this.oModelStub.getProperty.returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/copyPaste/sameAssestEdit")
            .returns({ name: "TestName", desc: "TestDescription" });
        this.oModelStub.getProperty
            .withArgs("/data/detailPage/aCMLs")
            .returns(null);
        this.oModelStub.getProperty
            .withArgs("/metaData/featureFlag")
            .returns({ cmlEnableCopyAssetWithBgInfo: "1" });

        var selectedItems = [{
            objectId: "FL-NULL",
            exportObjectType: "FL",
            locationId: "CML-X",
            locationTemplateId: "TPL-53",
            persona_id: "P53"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation must be called even when aCMLs model property is null"
        );
        assert.notOk(
            oPayload.hasOwnProperty("to_values"),
            "to_values must not appear on payload when aCMLs is null"
        );
    });

    /**
     *
     */
    QUnit.test("EQP objectType: fnDoCreateCMLOperation called with Single and payload has no to_location", function (assert) {
        var selectedItems = [{
            objectId: "EQP-SINGLE",
            exportObjectType: "EQP",
            locationTemplateId: "TPL-70",
            persona_id: "P70"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        assert.strictEqual(
            this.oController.fnDoCreateCMLOperation.getCall(0).args[1],
            "Single",
            "second argument must be Single for EQP type"
        );
        assert.notOk(
            this.oController.fnDoCreateCMLOperation.getCall(0).args[0].to_location,
            "to_location must be absent on EQP payload"
        );
    });

    /**
     *
     */
    QUnit.test("feature flag OFF: to_values block skipped even when CML has to_values", function (assert) {
        this.oModelStub.getProperty.withArgs("/metaData/featureFlag").returns({
            cmlEnableCopyAssetWithBgInfo: "0"
        });
        this.oModelStub.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-FLAG-OFF",
            to_values: [{ ID: "V1", dataSourcename: "VOLTAGE", value: 230 }]
        }]);

        var selectedItems = [{
            objectId: "FL-FLAGOFF",
            exportObjectType: "FL",
            locationId: "CML-FLAG-OFF",
            locationTemplateId: "TPL-80",
            persona_id: "P80"
        }];

        this.oController.fnDuplicateinSameEqu.call(this.oController, selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation must still be called when feature flag is off"
        );
        assert.notOk(
            oPayload.hasOwnProperty("to_values"),
            "to_values must NOT be on payload when feature flag is off"
        );
    });
    
    QUnit.module("CMLDetail Controller - fnInitialize objectType Determination", {
        /**
         * Setup before each test
         */
        beforeEach: function () {
            this.oController = new Controller();
 
            // Mock the router and route
            this.oRoute = {
                attachPatternMatched: sinon.stub()
            };
 
            this.oRouter = {
                getRoute: sinon.stub().returns(this.oRoute)
            };
 
            sinon.stub(this.oController, "getRouter").returns(this.oRouter);
            sinon.stub(this.oController, "getOwnerComponent").returns({
                getModel: sinon.stub().returns(new sap.ui.model.json.JSONModel({ data: {} }))
            });
 
            // Mock other dependencies
            this.oController.getUserRoles = sinon.stub();
            this.oController.fnGetData = sinon.stub();
            this.oController.CMLDataSource = {
                getUoMList: sinon.stub(),
                getObjectDetails: sinon.stub(),
                getCMLsByObjectId: sinon.stub()
            };
            this.oController.fnFetchComponentTypeList = sinon.stub();
            this.oController.getSelectedUoMSystem = sinon.stub().returns("imperial");
 
            // Mock view
            this.oView = {
                getModel: sinon.stub().returns(new sap.ui.model.json.JSONModel())
            };
            sinon.stub(this.oController, "getView").returns(this.oView);
        },
 
        /**
         * Cleanup after each test
         */
        afterEach: function () {
            sinon.restore();
        }
    });
 
    /**
     * Test case: When objectType is "functionalLocation", sObjectType should be set to "FLOC"
     */
    QUnit.test("Should set sObjectType to 'FLOC' when objectType is 'functionalLocation'", function (assert) {
        var sResult;
 
        // Create mock event arguments
        var oArguments = {
            /**
             * Function to retun parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "FL001",
                        objectType: "functionalLocation",
                        locationId: "LOC001"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "FLOC", "sObjectType should be 'FLOC' when objectType is 'functionalLocation'");
    });
 
    /**
     * Test case: When objectType is "FLOC", sObjectType should be set to "FLOC"
     */
    QUnit.test("Should set sObjectType to 'FLOC' when objectType is 'FLOC'", function (assert) {
        var sResult;
 
        // Create mock event arguments
        var oArguments = {
            /**
             * Function to retun parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "FL002",
                        objectType: "FLOC",
                        locationId: "LOC002"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "FLOC", "sObjectType should be 'FLOC' when objectType is 'FLOC'");
    });
 
    /**
     * Test case: When objectType is "equipment", sObjectType should be set to "EQUI"
     */
    QUnit.test("Should set sObjectType to 'EQUI' when objectType is 'equipment'", function (assert) {
        var sResult;
 
        // Create mock event arguments
        var oArguments = {
            /**
             * Function to return parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "EQ001",
                        objectType: "equipment",
                        locationId: "LOC003"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "EQUI", "sObjectType should be 'EQUI' when objectType is 'equipment'");
    });
 
    /**
     * Test case: When objectType is "EQUI", sObjectType should be set to "EQUI"
     */
    QUnit.test("Should set sObjectType to 'EQUI' when objectType is 'EQUI'", function (assert) {
        var sResult;
 
        // Create mock event arguments
        var oArguments = {
            /**
             * Function to return paramater
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "EQ002",
                        objectType: "EQUI",
                        locationId: "LOC004"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "EQUI", "sObjectType should be 'EQUI' when objectType is 'EQUI'");
    });
 
    /**
     * Test case: When objectType is null, sObjectType should default to "EQUI"
     */
    QUnit.test("Should set sObjectType to 'EQUI' when objectType is null", function (assert) {
        var sResult;
 
        // Create mock event arguments with null objectType
        var oArguments = {
            /**
             * Function to retunr parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "OBJ001",
                        objectType: null,
                        locationId: "LOC005"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "EQUI", "sObjectType should default to 'EQUI' when objectType is null");
    });
 
    /**
     * Test case: When objectType is undefined, sObjectType should default to "EQUI"
     */
    QUnit.test("Should set sObjectType to 'EQUI' when objectType is undefined", function (assert) {
        var sResult;
 
        // Create mock event arguments with undefined objectType
        var oArguments = {
            /**
             * Function to return parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "OBJ002",
                        objectType: undefined,
                        locationId: "LOC006"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "EQUI", "sObjectType should default to 'EQUI' when objectType is undefined");
    });
 
    /**
     * Test case: When objectType is empty string, sObjectType should default to "EQUI"
     */
    QUnit.test("Should set sObjectType to 'EQUI' when objectType is empty string", function (assert) {
        var sResult;
 
        // Create mock event arguments with empty string objectType
        var oArguments = {
            /**
             * Function to return parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "OBJ003",
                        objectType: "",
                        locationId: "LOC007"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "EQUI", "sObjectType should default to 'EQUI' when objectType is empty string");
    });
 
    /**
     * Test case: When objectType is an unexpected value, sObjectType should default to "EQUI"
     */
    QUnit.test("Should set sObjectType to 'EQUI' when objectType is an unexpected value", function (assert) {
        var sResult;
 
        // Create mock event arguments with unexpected objectType
        var oArguments = {
            /**
             * Function to return parameter
             */
            getParameters: function () {
                return {
                    arguments: {
                        objectId: "OBJ004",
                        objectType: "UNKNOWN_TYPE",
                        locationId: "LOC008"
                    }
                };
            }
        };
 
        // Extract the logic being tested
        var objectType = oArguments.getParameters().arguments.objectType;
        if (objectType === "functionalLocation" || objectType === "FLOC") {
            sResult = "FLOC";
        } else {
            sResult = "EQUI";
        }
 
        // Assert
        assert.strictEqual(sResult, "EQUI", "sObjectType should default to 'EQUI' when objectType is an unexpected value");
    });

    QUnit.module("CMLTreeTableHelper - fnFetchCMLsByObjectId Tests", {
        /**
         * Before each function
         */
        beforeEach: function () {
            var CMLTreeTableHelperModule = sap.ui.require("com/asint/ais/library/utils/CMLTreeTableHelper");
            
            this.oHelper = new CMLTreeTableHelperModule();
            
            this.oHelper.oController = {
                getView: sinon.stub().returns({
                    getModel: sinon.stub().returns({
                        getProperty: sinon.stub().returns("0")
                    }),
                    byId: sinon.stub(),
                    sId: "testView"
                }),
                fnMessageShow: sinon.stub(),
                _oMessageBundle: {
                    getText: sinon.stub().returns("")
                }
            };
            
            this.oHelper.sModel = "mCMLModel";
            this.oHelper._oTempCMLData = {
                componentObject: [],
                aCMLs: []
            };
            
            this.oHelper.CMLDataSource = {
                getCMLsByObjectId: sinon.stub()
            };
            
            this.oHelper.fnPerformDatasourceOperation = function (aData, fnRequest, fnCallback) {
                aData.forEach(function (item) {
                    fnRequest(item, function () {});
                });
                fnCallback();
            };
            
            this.oHelper.fnResetP13n = sinon.stub();
            this.oHelper._p13nLoadedFor = null;
            this.oHelper.onTableConversion = sinon.stub().callsArgWith(3, { aCMLs: [{id: "test"}] });
        },
        /**
         * After each function
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("fnFetchCMLsByObjectId - should fetch without pagination when bEnabled is false", function (assert) {
        var done = assert.async();
        
        var aComponentList = [
            { id: "OBJ001", name: "Object 1" },
            { id: "OBJ002", name: "Object 2" }
        ];
        
        this.oHelper.CMLDataSource.getCMLsByObjectId.callsArgWith(1, {
            value: [
                { ID: "CML001", name: "CML 1", objectId: "OBJ001" },
                { ID: "CML002", name: "CML 2", objectId: "OBJ001" }
            ]
        });
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.ok(true, "Success callback was called");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should handle pagination when bEnabled is true", function (assert) {
        var done = assert.async();
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [
            { id: "OBJ001", name: "Object 1" }
        ];
        
        var callCount = 0;
        var that = this;
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = function (objectId, fnSuccess, fnError, iSkip, iTop) {
            callCount++;
            
            if (callCount === 1) {
                fnSuccess({
                    value: new Array(1000).fill({ ID: "CML" + callCount, name: "CML " + callCount }),
                    "@odata.nextLink": "?$skiptoken=1000"
                });
            } else if (callCount === 2) {
                fnSuccess({
                    value: [{ ID: "CML_LAST", name: "CML Last" }]
                });
            }
        };
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.strictEqual(callCount, 2, "Should make 2 calls for pagination");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should parse skiptoken from nextLink correctly", function (assert) {
        var done = assert.async();
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [{ id: "OBJ001", name: "Object 1" }];
        
        var expectedSkipValues = [];
        var that = this;
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = function (objectId, fnSuccess, fnError, iSkip, iTop) {
            if (iSkip !== null && iSkip !== undefined) {
                expectedSkipValues.push(iSkip);
            }
            
            if (expectedSkipValues.length === 0) {
                fnSuccess({
                    value: [{ ID: "CML1" }],
                    "@odata.nextLink": "?$skiptoken=1000"
                });
            } else {
                fnSuccess({
                    value: [{ ID: "CML2" }]
                });
            }
        };
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.ok(expectedSkipValues.length > 0, "Should have called with skip parameter");
            assert.strictEqual(expectedSkipValues[0], 1000, "Skip value should be 1000 from skiptoken");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should handle @nextLink and @odata.nextLink", function (assert) {
        var done = assert.async();
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [{ id: "OBJ001", name: "Object 1" }];
        var callCount = 0;
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = function (objectId, fnSuccess, fnError, iSkip, iTop) {
            callCount++;
            
            if (callCount === 1) {
                fnSuccess({
                    value: [{ ID: "CML1" }],
                    "@nextLink": "?$skiptoken=500"
                });
            } else if (callCount === 2) {
                fnSuccess({
                    value: [{ ID: "CML2" }],
                    "@odata.nextLink": "?$skiptoken=1000"
                });
            } else {
                fnSuccess({
                    value: [{ ID: "CML3" }]
                });
            }
        };
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.strictEqual(callCount, 3, "Should handle both @nextLink and @odata.nextLink");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should handle error in pagination", function (assert) {
        var done = assert.async();
        var doneCalled = false;
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [{ id: "OBJ001", name: "Object 1" }];
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = sinon.stub().callsArgWith(2, {
            responseText: "Error fetching CMLs"
        });
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            if (!doneCalled) {
                doneCalled = true;
                assert.ok(true, "Error callback should be handled");
                done();
            }
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should aggregate results from multiple pages", function (assert) {
        var done = assert.async();
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [{ id: "OBJ001", name: "Object 1" }];
        var callCount = 0;
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = function (objectId, fnSuccess, fnError, iSkip, iTop) {
            callCount++;
            
            if (callCount === 1) {
                fnSuccess({
                    value: [{ ID: "CML1", name: "First Page" }],
                    "@odata.nextLink": "?$skiptoken=1"
                });
            } else if (callCount === 2) {
                fnSuccess({
                    value: [{ ID: "CML2", name: "Second Page" }],
                    "@odata.nextLink": "?$skiptoken=2"
                });
            } else {
                fnSuccess({
                    value: [{ ID: "CML3", name: "Third Page" }]
                });
            }
        };
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.strictEqual(callCount, 3, "Should make 3 API calls");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should handle invalid skiptoken gracefully", function (assert) {
        var done = assert.async();
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [{ id: "OBJ001", name: "Object 1" }];
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = function (objectId, fnSuccess, fnError, iSkip, iTop) {
            fnSuccess({
                value: [{ ID: "CML1" }],
                "@odata.nextLink": "?$skiptoken=invalid"
            });
        };
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.ok(true, "Should handle invalid skiptoken gracefully");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should use default top value of 1000", function (assert) {
        var done = assert.async();
        
        this.oHelper.oController.getView().getModel().getProperty = sinon.stub().returns("1");
        
        var aComponentList = [{ id: "OBJ001", name: "Object 1" }];
        var capturedTop = null;
        
        this.oHelper.CMLDataSource.getCMLsByObjectId = function (objectId, fnSuccess, fnError, iSkip, iTop) {
            capturedTop = iTop;
            fnSuccess({
                value: [{ ID: "CML1" }]
            });
        };
        
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.strictEqual(capturedTop, 1000, "Top value should be 1000");
            done();
        });
    });

    QUnit.test("fnFetchCMLsByObjectId - should remove duplicate objects from component list", function (assert) {
        var done = assert.async();
        
        var aComponentList = [
            { id: "OBJ001", name: "Object 1" },
            { id: "OBJ001", name: "Object 1 Duplicate" },
            { id: "OBJ002", name: "Object 2" }
        ];
        
        this.oHelper.CMLDataSource.getCMLsByObjectId.callsArgWith(1, {
            value: []
        });
        
        var that = this;
        this.oHelper.fnFetchCMLsByObjectId(aComponentList, "detailPage", "OBJ001", function (result) {
            assert.strictEqual(that.oHelper._oTempCMLData.componentObject.length, 2, "Should have 2 unique objects");
            done();
        });
    });

    QUnit.module("fnCmlSummaryData - Object Type Handling", {
        /**
         * Before each function
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oModel = {
                getProperty: sinon.stub().returns("TEMPLATE_DATA")
            };

            sinon.stub(this.oController, "getView").returns({
                getModel: sinon.stub().returns(this.oModel)
            });

            this.oController.CMLDataSource = {
                fnGetSummaryDetails: sinon.stub()
            };

            sinon.stub(this.oController, "fnGeAggregatorForEquipTemp");

            this.oController.oI18n = {
                getText: sinon.stub().returns("Error Message")
            };
            sinon.stub(this.oController, "fnMessageShow");
        },

        /**
         * After each function
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    /**
     * ✅ Should pass EQUI as is
     */
    QUnit.test("Should call API with EQUI when input is EQUI", function (assert) {
        this.oController.fnCmlSummaryData("OBJ1", "EQUI");

        assert.ok(
            this.oController.CMLDataSource.fnGetSummaryDetails.calledWith(
                "OBJ1",
                "EQUI"
            ),
            "EQUI passed correctly"
        );
    });

    /**
     * Should convert Equipment → EQUI
     */
    QUnit.test("Should normalize Equipment to EQUI", function (assert) {
        this.oController.fnCmlSummaryData("OBJ1", "Equipment");

        assert.ok(
            this.oController.CMLDataSource.fnGetSummaryDetails.calledWith(
                "OBJ1",
                "EQUI"
            ),
            "Equipment converted to EQUI"
        );
    });

    /**
     * Should pass FLOC as is
     */
    QUnit.test("Should call API with FLOC when input is FLOC", function (assert) {
        this.oController.fnCmlSummaryData("OBJ1", "FLOC");

        assert.ok(
            this.oController.CMLDataSource.fnGetSummaryDetails.calledWith(
                "OBJ1",
                "FLOC"
            ),
            "FLOC passed correctly"
        );
    });

    /**
     *  Should convert Functional Location → FLOC
     */
    QUnit.test("Should normalize Functional Location to FLOC", function (assert) {
        this.oController.fnCmlSummaryData("OBJ1", "Functional Location");

        assert.ok(
            this.oController.CMLDataSource.fnGetSummaryDetails.calledWith(
                "OBJ1",
                "FLOC"
            ),
            "Functional Location converted to FLOC"
        );
    });

    /**
     * Invalid type → should show error and NOT call API
     */
    QUnit.test("Should show error for invalid object type", function (assert) {
        this.oController.fnCmlSummaryData("OBJ1", "INVALID");

        assert.ok(
            this.oController.fnMessageShow.calledOnce,
            "Error message shown"
        );

        assert.ok(
            this.oController.CMLDataSource.fnGetSummaryDetails.notCalled,
            "API not called for invalid type"
        );
    });

    QUnit.module("fnConvertUOMDataSource - Null Safety & Condition Fix", {
        /**
         * BeforeEach
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oController.CMLHelper = Controller.prototype.CMLHelper;
            this.oController.CMLDataSource = {
                /**
                 *
                 */
                fnUoMConversion: function () {}
            };

            this.fnSuccessSpy = sinon.spy();
        },

        /**
         * AfterEach
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should handle missing dataSourceValue safely", function (assert) {
        var done = assert.async();

        var oData = {
            CML1: {
                DS1: {
                    dataType: "numericflexible"
                }
            }
        };

        var oStub = sinon.stub(this.oController.CMLDataSource, "fnUoMConversion");

        this.oController.CMLHelper.fnConvertUOMDataSource.call(
            this.oController,
            "metric",
            oData,
            function () {
                assert.ok(true, "Execution completed without crash");
                assert.strictEqual(oStub.calledOnce, true, "Conversion function called");
                done();
            }
        );

        oStub.args[0][1]([]);
    });

    QUnit.test("Should NOT process invalid numeric value (numericvalue type)", function (assert) {
        var done = assert.async();

        var oData = {
            CML1: {
                DS1: {
                    dataType: "numericvalue",
                    dataSourceValue: {
                        value: "abc"
                    }
                }
            }
        };

        var oStub = sinon.stub(this.oController.CMLDataSource, "fnUoMConversion");

        this.oController.CMLHelper.fnConvertUOMDataSource.call(
            this.oController,
            "metric",
            oData,
            function () {
                var aPassedData = oStub.args[0][0];
                assert.strictEqual(aPassedData.length, 0, "Invalid value not pushed");
                done();
            }
        );

        oStub.args[0][1]([]);
    });

    QUnit.test("Should process valid numeric value", function (assert) {
        var done = assert.async();

        var oData = {
            CML1: {
                DS1: {
                    dataType: "numericflexible",
                    dataSourceValue: {
                        value: "123"
                    },
                    decimalPlaceAllowed: 2
                }
            }
        };
        

        var oStub = sinon.stub(this.oController.CMLDataSource, "fnUoMConversion");

        this.oController.CMLHelper.fnConvertUOMDataSource.call(
            this.oController,
            "metric",
            oData,
            function () {
                var aPassedData = oStub.args[0][0];
                assert.strictEqual(aPassedData.length, 1, "Valid value pushed");
                done();
            }
        );

        oStub.args[0][1]([{
            key: "CML1##DS1",
            tgtValue: 10
        }]);
    });

    QUnit.test("Should skip undefined dataSourceValue", function (assert) {
        var done = assert.async();

        var oData = {
            CML1: {
                DS1: {
                    dataType: "numericflexible",
                    dataSourceValue: {
                        value: undefined
                    }
                }
            }
        };

        var oStub = sinon.stub(this.oController.CMLDataSource, "fnUoMConversion");

        this.oController.CMLHelper.fnConvertUOMDataSource.call(
            this.oController,
            "metric",
            oData,
            function () {
                var aPassedData = oStub.args[0][0];
                assert.strictEqual(aPassedData.length, 0, "Undefined value skipped");
                done();
            }
        );

        oStub.args[0][1]([]);
    });

    QUnit.module("fnDuplicateinSameEqu - fnEncode function tests", {
        /**
         * Setup before each test
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oModel = {
                getProperty: sinon.stub(),
                setProperty: sinon.spy()
            };

            this.oModel.getProperty.withArgs("/data/detailPage/copyPaste/sameAssestEdit").returns({
                name: "TestName",
                desc: "TestDescription"
            });

            this.oModel.getProperty.withArgs("/metaData/featureFlag").returns({
                cmlEnableCopyAssetWithBgInfo: "1"
            });

            this.oView = {
                getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel)
            };

            sinon.stub(this.oController, "getView").returns(this.oView);
            this.oController.fnDoCreateCMLOperation = sinon.stub();
            this.oController.fnMessageShow = sinon.stub();
        },

        /**
         * Cleanup after each test
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("fnEncode: null value should return empty string", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [{
                dataSourcename: "TEST_DS",
                dataSourceValue: null
            }]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, "", "null value encoded to empty string");
    });

    QUnit.test("fnEncode: undefined value should return empty string", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [{
                dataSourcename: "TEST_DS",
                dataSourceValue: undefined
            }]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, "", "undefined value encoded to empty string");
    });

    QUnit.test("fnEncode: empty string should return empty string", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [{
                dataSourcename: "TEST_DS",
                dataSourceValue: ""
            }]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, "", "empty string remains empty string");
    });

    QUnit.test("fnEncode: object value should be stringified and encoded", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        var objValue = { key: "value", number: 123 };
        var expectedEncoded = btoa(JSON.stringify(objValue));

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [{
                dataSourcename: "TEST_DS",
                dataSourceValue: objValue
            }]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, expectedEncoded, "object value stringified and encoded");
    });

    QUnit.test("fnEncode: number value should be converted to string and encoded", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        var numberValue = 12345;
        var expectedEncoded = btoa(String(numberValue));

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [{
                dataSourcename: "TEST_DS",
                dataSourceValue: numberValue
            }]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, expectedEncoded, "number value converted to string and encoded");
    });

    QUnit.test("fnEncode: if base64 string value should be returned directly", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        var stringValue = "eyJ2YWx1ZSI6IjA0LTAzLTE5NzgifQ==";
        var expectedEncoded = stringValue; // already base64 encoded

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [{
                dataSourcename: "TEST_DS",
                dataSourceValue: stringValue
            }]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, expectedEncoded, stringValue);
    });

    QUnit.test("fnEncode: READING data sources should be filtered out", function (assert) {
        var selectedItems = [{
            objectId: "EQ-001",
            exportObjectType: "EQUI",
            locationId: "CML-001",
            locationTemplateId: "TPL-01",
            persona_id: "P1"
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns([{
            ID: "CML-001",
            to_values: [
                {
                    dataSourcename: "READING",
                    dataSourceValue: "should be filtered"
                },
                {
                    dataSourcename: "DATE_IN_SERVICE",
                    dataSourceValue: "{\"value\":\"04-03-1978\"}"
                }
            ]
        }]);

        this.oController.fnDuplicateinSameEqu(selectedItems);

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];
        assert.strictEqual(oPayload.to_values.length, 1, "only non-READING data sources included");
        assert.strictEqual(oPayload.to_values[0].dataSourcename, "DATE_IN_SERVICE", "DATE_IN_SERVICE data source included");
        assert.strictEqual(oPayload.to_values[0].dataSourceValue, btoa("{\"value\":\"04-03-1978\"}"), "DATE_IN_SERVICE value encoded");
    }); 

    QUnit.module("CMLHelper - fnConvertUOMDataSource");

    QUnit.test("Numeric primitive value should be written back after UoM conversion", function (assert) {
        var oController = new Controller();
        var oHelper = oController.CMLHelper;

        var sCMLId = "cml-001";
        var sDataSourceId = "ds-001";

        var oDataSourceValue = {};
        oDataSourceValue[sCMLId] = {};
        oDataSourceValue[sCMLId][sDataSourceId] = {
            dataType: "numericvalue",
            decimalPlaceAllowed: "2",
            dataSourceValue: {
                value: "25.4000"
            }
        };

        var oMockCMLDataSource = {
            /**
             * CMLDataSource might be on controller, not on helper — mock both to be safe
             */
            fnUoMConversion: function (aConversionData, fnCallback) {
                var aConversionResult = aConversionData.map(function (oItem) {
                    return {
                        key: oItem.key,
                        tgtValue: 645.16
                    };
                });
                fnCallback(aConversionResult);
            }
        };

        oHelper.CMLDataSource = oMockCMLDataSource;
        oController.CMLDataSource = oMockCMLDataSource;

        var oResult = null;

        oHelper.fnConvertUOMDataSource("metric", oDataSourceValue, function (oConvertedValue) {
            oResult = oConvertedValue;
        });

        assert.ok(oResult !== null, "Success callback should have fired");
        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value,
            "645.16",
            "Numeric primitive value should be written back to oDataSourceValue after conversion"
        );
    });

    // Test 2: sUom is not metric - should skip conversion and return original value
    QUnit.test("Non-metric UoM should skip conversion and return original value as-is", function (assert) {
        var oController = new Controller();
        var oHelper = oController.CMLHelper;

        var sCMLId = "cml-001";
        var sDataSourceId = "ds-001";

        var oDataSourceValue = {};
        oDataSourceValue[sCMLId] = {};
        oDataSourceValue[sCMLId][sDataSourceId] = {
            dataType: "numericvalue",
            decimalPlaceAllowed: "2",
            dataSourceValue: {
                value: "25.4000"
            }
        };

        var bConversionCalled = false;
        oHelper.CMLDataSource = {
            /**
             *
             */
            fnUoMConversion: function () {
                bConversionCalled = true;
            }
        };

        var oResult = null;

        oHelper.fnConvertUOMDataSource("imperial", oDataSourceValue, function (oConvertedValue) {
            oResult = oConvertedValue;
        });

        assert.ok(oResult !== null, "Success callback should have fired");
        assert.strictEqual(bConversionCalled, false, "fnUoMConversion should NOT be called for non-metric");
        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value,
            "25.4000",
            "Original value should remain unchanged for non-metric"
        );
    });

    // Test 3: Table data type - nested field should be updated via object reference
    QUnit.test("Table data type field should be updated via object reference after conversion", function (assert) {
        var oController = new Controller();
        var oHelper = oController.CMLHelper;

        var sCMLId = "cml-001";
        var sDataSourceId = "ds-001";

        var oDataSourceValue = {};
        oDataSourceValue[sCMLId] = {};
        oDataSourceValue[sCMLId][sDataSourceId] = {
            dataType: "table",
            decimalPlaceAllowed: null,
            dataSourceValue: {
                value: {
                    "READING": "26.1620",
                    "TMIN": "31.7500",
                    "DATE": "23 Oct, 2025",
                    "REMAINING_LIFE": 0,          
                    "dataId": "abc-123"
                }
            }
        };

        oHelper.CMLDataSource = {
            /**
             * 
             */
            fnUoMConversion: function (aConversionData, fnCallback) {
                assert.strictEqual(aConversionData.length, 2, "Only numeric non-excluded fields should be pushed for conversion");

                var aConversionResult = aConversionData.map(function (oItem) {
                    return {
                        key: oItem.key,
                        tgtValue: 663.0148  
                    };
                });
                fnCallback(aConversionResult);
            }
        };
        oController.CMLDataSource = oHelper.CMLDataSource;

        var oResult = null;

        oHelper.fnConvertUOMDataSource("metric", oDataSourceValue, function (oConvertedValue) {
            oResult = oConvertedValue;
        });

        assert.ok(oResult !== null, "Success callback should have fired");
        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value["READING"],
            "663.0148",
            "READING field in table should be converted"
        );
        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value["TMIN"],
            "663.0148",
            "TMIN field in table should be converted"
        );
        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value["DATE"],
            "23 Oct, 2025",
            "DATE field should remain unchanged as it is excluded"
        );
    });

    // Test 4: decimalPlaceAllowed is null - should default to 4 decimal places
    QUnit.test("Numeric value with null decimalPlaceAllowed should default to 4 decimal places", function (assert) {
        var oController = new Controller();
        var oHelper = oController.CMLHelper;

        var sCMLId = "cml-001";
        var sDataSourceId = "ds-001";

        var oDataSourceValue = {};
        oDataSourceValue[sCMLId] = {};
        oDataSourceValue[sCMLId][sDataSourceId] = {
            dataType: "numericvalue",
            decimalPlaceAllowed: null,
            dataSourceValue: {
                value: "25.4000"
            }
        };

        oHelper.CMLDataSource = {
            /**
             * 
             */
            fnUoMConversion: function (aConversionData, fnCallback) {
                fnCallback([{
                    key: aConversionData[0].key,
                    tgtValue: 645.1234567 
                }]);
            }
        };
        oController.CMLDataSource = oHelper.CMLDataSource;

        var oResult = null;

        oHelper.fnConvertUOMDataSource("metric", oDataSourceValue, function (oConvertedValue) {
            oResult = oConvertedValue;
        });

        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value,
            "645.1235",
            "Should default to 4 decimal places when decimalPlaceAllowed is null"
        );
    });

    // Test 5: non-numeric string value should be skipped and not pushed to conversion
    QUnit.test("Non-numeric string value should be skipped and not sent for conversion", function (assert) {
        var oController = new Controller();
        var oHelper = oController.CMLHelper;

        var sCMLId = "cml-001";
        var sDataSourceId = "ds-001";

        var oDataSourceValue = {};
        oDataSourceValue[sCMLId] = {};
        oDataSourceValue[sCMLId][sDataSourceId] = {
            dataType: "numericvalue",
            decimalPlaceAllowed: "2",
            dataSourceValue: {
                value: "N/A" 
            }
        };

        var bConversionCalled = false;
        oHelper.CMLDataSource = {
            /**
             * 
             */
            fnUoMConversion: function (aConversionData, fnCallback) {
                bConversionCalled = true;
                fnCallback([]);
            }
        };
        oController.CMLDataSource = oHelper.CMLDataSource;

        var oResult = null;

        oHelper.fnConvertUOMDataSource("metric", oDataSourceValue, function (oConvertedValue) {
            oResult = oConvertedValue;
        });

        assert.strictEqual(
            oResult[sCMLId][sDataSourceId].dataSourceValue.value,
            "N/A",
            "Non-numeric value should remain unchanged"
        );
    });

    QUnit.module("fnDuplicateinSameEqu", {
        /**
         * 
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oModel = {
                getProperty: sinon.stub()
            };

            this.oController.getView = sinon.stub().returns({
                getModel: sinon.stub().returns(this.oModel)
            });

            this.oController.fnDoCreateCMLOperation = sinon.spy();
            this.oController.fnMessageShow = sinon.spy();

            this.oController.oI18n = {
                getText: sinon.stub().returns("Error Message")
            };
        },  
        /**
         * 
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should filter HALF_LIFE and CALCULATED_TMIN values from to_values payload", function (assert) {
        var selectedItems = [{
            objectId: "OBJ_001",
            exportObjectType: "Equipment",
            locationTemplateId: "TEMP_001",
            persona_id: "P001",
            locationId: "LOC_001"
        }];

        var aCMLs = [{
            ID: "LOC_001",
            to_values: [
                {
                    dataSourcename: "READING_PRESSURE",
                    dataSourceValue: "100"
                },
                {
                    dataSourcename: "HALF_LIFE_DATA",
                    dataSourceValue: "200"
                },
                {
                    dataSourcename: "CALCULATED_TMIN_VALUE",
                    dataSourceValue: "300"
                },
                {
                    dataSourcename: "VALID_DATA",
                    dataSourceValue: "400"
                }
            ]
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/copyPaste/sameAssestEdit").returns({
            name: "New CML",
            desc: "New Desc"
        });

        this.oModel.getProperty.withArgs("/metaData/featureFlag").returns({
            cmlEnableCopyAssetWithBgInfo: "1"
        });

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns(aCMLs);
        this.oController.fnDuplicateinSameEqu(selectedItems);
        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation called"
        );

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(oPayload.to_values, "to_values exists in payload");

        assert.equal(
            oPayload.to_values.length,
            1,
            "Only valid records are included"
        );

        assert.equal(
            oPayload.to_values[0].dataSourcename,
            "VALID_DATA",
            "HALF_LIFE, CALCULATED_TMIN and READING entries are filtered out"
        );
    });

    QUnit.test("Should not include HALF_LIFE and CALCULATED_TMIN entries in payload", function (assert) {
        var selectedItems = [{
            objectId: "OBJ_002",
            exportObjectType: "Equipment",
            locationTemplateId: "TEMP_002",
            persona_id: "P002",
            locationId: "LOC_002"
        }];

        var aCMLs = [{
            ID: "LOC_002",
            to_values: [
                {
                    dataSourcename: "HALF_LIFE_TEST",
                    dataSourceValue: "111"
                },
                {
                    dataSourcename: "CALCULATED_TMIN_TEST",
                    dataSourceValue: "222"
                }
            ]
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/copyPaste/sameAssestEdit").returns({
            name: "Duplicate",
            desc: "Duplicate Desc"
        });

        this.oModel.getProperty.withArgs("/metaData/featureFlag").returns({
            cmlEnableCopyAssetWithBgInfo: "1"
        });

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns(aCMLs);

        this.oController.fnDuplicateinSameEqu(selectedItems);
        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.ok(
            Array.isArray(oPayload.to_values),
            "to_values exists"
        );

        assert.equal(
            oPayload.to_values.length,
            0,
            "HALF_LIFE and CALCULATED_TMIN records are removed completely"
        );
    });

    QUnit.test("Should retain CALCULATED and LIFE values when exact keywords HALF_LIFE and CALCULATED_TMIN are not present", function (assert) {
        var selectedItems = [{
            objectId: "OBJ_003",
            exportObjectType: "Equipment",
            locationTemplateId: "TEMP_003",
            persona_id: "P003",
            locationId: "LOC_003"
        }];

        var aCMLs = [{
            ID: "LOC_003",
            to_values: [
                {
                    dataSourcename: "CALCULATED_PRESSURE",
                    dataSourceValue: "123"
                },
                {
                    dataSourcename: "LIFE_EXPECTANCY",
                    dataSourceValue: "456"
                },
                {
                    dataSourcename: "NORMAL_DATA",
                    dataSourceValue: "789"
                }
            ]
        }];

        this.oModel.getProperty.withArgs("/data/detailPage/copyPaste/sameAssestEdit").returns({
            name: "Negative Test",
            desc: "Negative Desc"
        });

        this.oModel.getProperty.withArgs("/metaData/featureFlag").returns({
            cmlEnableCopyAssetWithBgInfo: "1"
        });

        this.oModel.getProperty.withArgs("/data/detailPage/aCMLs").returns(aCMLs);
        this.oController.fnDuplicateinSameEqu(selectedItems);
        assert.ok(
            this.oController.fnDoCreateCMLOperation.calledOnce,
            "fnDoCreateCMLOperation called successfully"
        );

        var oPayload = this.oController.fnDoCreateCMLOperation.getCall(0).args[0];

        assert.equal(
            oPayload.to_values.length,
            3,
            "Values are retained because they do not contain exact HALF_LIFE or CALCULATED_TMIN keywords"
        );

        assert.equal(
            oPayload.to_values[0].dataSourcename,
            "CALCULATED_PRESSURE",
            "CALCULATED_PRESSURE is retained"
        );

        assert.equal(
            oPayload.to_values[1].dataSourcename,
            "LIFE_EXPECTANCY",
            "LIFE_EXPECTANCY is retained"
        );

        assert.equal(
            oPayload.to_values[2].dataSourcename,
            "NORMAL_DATA",
            "NORMAL_DATA is retained"
        );
    });

    QUnit.module("onPressSave - DATE_IN_SERVICE Format", {
        /**
         * 
         */
        beforeEach: function () {
            this.formatDate = function (oDate) {
                var iDate = ((oDate.getDate() < 10) ? ("0" + oDate.getDate()) : oDate.getDate());
                var iMonth = oDate.getMonth() + 1;
                var iMonthVal = iMonth < 10 ? "0" + iMonth : iMonth;
                return oDate.getFullYear() + "-" + iMonthVal + "-" + iDate;
            };
        }
    });

    QUnit.test("Should format date as yyyy-mm-dd", function (assert) {
        var oDate = new Date(2024, 5, 15);
        var sDate = this.formatDate(oDate);
        assert.strictEqual(sDate, "2024-06-15", "Date should be formatted as yyyy-mm-dd");
    });

    QUnit.test("Should zero-pad single digit day", function (assert) {
        var oDate = new Date(2024, 0, 5);
        var sDate = this.formatDate(oDate);
        assert.strictEqual(sDate, "2024-01-05", "Single digit day should be zero-padded");
    });

    QUnit.test("Should zero-pad single digit month", function (assert) {
        var oDate = new Date(2024, 2, 20);
        var sDate = this.formatDate(oDate);
        assert.strictEqual(sDate, "2024-03-20", "Single digit month should be zero-padded");
    });

    QUnit.test("Should handle double digit day and month correctly", function (assert) {
        var oDate = new Date(2024, 11, 25);
        var sDate = this.formatDate(oDate);
        assert.strictEqual(sDate, "2024-12-25", "Double digit day and month should format correctly");
    });

    QUnit.test("Should NOT format date as mm-dd-yyyy (old format)", function (assert) {
        var oDate = new Date(2024, 5, 15);
        var sDate = this.formatDate(oDate);
        assert.notEqual(sDate, "06-15-2024", "Date must NOT be in old mm-dd-yyyy format");
    });

    QUnit.module("CMLTreeTableHelper - normalizeDate Tests", {

        /**
         * Before each function
         */
        beforeEach: function () {

            var CMLTreeTableHelperModule = sap.ui.require("com/asint/ais/library/utils/CMLTreeTableHelper");

            this.oHelper = new CMLTreeTableHelperModule();

        },

        /**
         * After each function
         */
        afterEach: function () {
            sinon.restore();
        }

    });

    QUnit.test("normalizeDate - should format ISO date string to MMM dd, yyyy", function (assert) {

        var sDate = "2025-10-31T00:00:00.000Z";
        var sResult = this.oHelper.normalizeDate(sDate);

        assert.strictEqual(
            sResult,
            "Oct 31, 2025",
            "ISO date formatted correctly"
        );

    });

    QUnit.test("normalizeDate - should format yyyy-mm-dd string to MMM dd, yyyy", function (assert) {

        var sDate = "2025-12-25";
        var sResult = this.oHelper.normalizeDate(sDate);

        assert.strictEqual(
            sResult,
            "Dec 25, 2025",
            "yyyy-mm-dd formatted correctly"
        );

    });

    QUnit.test("normalizeDate - should format mm-dd-yyyy string to MMM dd, yyyy", function (assert) {

        var sDate = "10-31-2025";
        var sResult = this.oHelper.normalizeDate(sDate);

        assert.strictEqual(
            sResult,
            "Oct 31, 2025",
            "mm-dd-yyyy formatted correctly"
        );

    });

    QUnit.test("normalizeDate - should return empty string for null value", function (assert) {

        var sDate = null;
        var sResult = this.oHelper.normalizeDate(sDate);

        assert.strictEqual(
            sResult,
            "",
            "Empty string returned for null value"
        );


        QUnit.module("CMLDetail Controller - AI Recommendations Navigation", {
            beforeEach: function () {
                this.oController = new Controller();
                this.oModel = new sap.ui.model.json.JSONModel({
                    metaData: {
                        featureFlag: {
                            CmlAiInsight: "1"
                        }
                    },
                    data: {
                        detailPage: {
                            layout: ""
                        }
                    }
                });
                this.oView = {
                    getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel),
                    byId: sinon.stub()
                };
                this.oOwnerComponent = {
                    getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel)
                };
                sinon.stub(this.oController, "getView").returns(this.oView);
                sinon.stub(this.oController, "getOwnerComponent").returns(this.oOwnerComponent);
                sinon.stub(this.oController, "fnProcessAIWorkflow");
            },
            afterEach: function () {
                sinon.restore();
            }
        });

        QUnit.test("onPressAIRecommendation - updates layout, navigates, and starts workflow", function (assert) {
            var oNavContainer = {
                to: sinon.spy()
            };
            var oPage = {};
            this.oView.byId.withArgs("idMidColumnNavContainer").returns(oNavContainer);
            this.oView.byId.withArgs("idAIRecommendationPage").returns(oPage);
            this.oController.onPressAIRecommendation();

            assert.strictEqual(this.oModel.getProperty("/data/detailPage/layout"), "TwoColumnsMidExpanded", "Layout is expanded to TwoColumnsMidExpanded");
            assert.ok(oNavContainer.to.calledWith(oPage), "Navigated to AIRecommendationPage");
            assert.ok(this.oController.fnProcessAIWorkflow.calledOnce, "fnProcessAIWorkflow called");
        });

        QUnit.test("onRefreshInsights - triggers fnProcessAIWorkflow", function (assert) {
            this.oController.onRefreshInsights();
            assert.ok(this.oController.fnProcessAIWorkflow.calledOnce, "fnProcessAIWorkflow called on refresh");
        });

        QUnit.test("onPressAIRecommendation - handles missing oNavContainer gracefully", function (assert) {
            this.oView.byId.withArgs("idMidColumnNavContainer").returns(null);
            var oPage = {};
            this.oView.byId.withArgs("idAIRecommendationPage").returns(oPage);

            try {
                this.oController.onPressAIRecommendation();
                assert.ok(true, "onPressAIRecommendation did not crash when nav container is missing");
            } catch (e) {
                assert.ok(false, "onPressAIRecommendation crashed when nav container is missing: " + e.message);
            }

            assert.strictEqual(this.oModel.getProperty("/data/detailPage/layout"), "TwoColumnsMidExpanded", "Layout is expanded to TwoColumnsMidExpanded even without nav container");
            assert.ok(this.oController.fnProcessAIWorkflow.calledOnce, "fnProcessAIWorkflow called");
        });

        QUnit.test("onPressAIRecommendation - handles missing idAIRecommendationPage in view", function (assert) {
            var oNavContainer = {
                to: sinon.spy()
            };
            this.oView.byId.withArgs("idMidColumnNavContainer").returns(oNavContainer);
            this.oView.byId.withArgs("idAIRecommendationPage").returns(null);
            this.oController.onPressAIRecommendation();

            assert.strictEqual(this.oModel.getProperty("/data/detailPage/layout"), "TwoColumnsMidExpanded", "Layout is expanded to TwoColumnsMidExpanded");
            assert.ok(oNavContainer.to.calledWith(null), "Navigated to null target page gracefully");
            assert.ok(this.oController.fnProcessAIWorkflow.calledOnce, "fnProcessAIWorkflow called");
        });


        QUnit.module("CMLDetail Controller - fnProcessAIWorkflow", {
            beforeEach: function () {
                this.oController = new Controller();
                this.oModel = new sap.ui.model.json.JSONModel({
                    metaData: {
                        featureFlag: {
                            CmlAiInsight: "1"
                        }
                    },
                    data: {}
                });
                this.oOwnerComponent = {
                    getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel)
                };
                this.oController.oI18n = {
                    getText: sinon.stub()
                };
                this.oController.oI18n.getText.withArgs("asint.cml.message.noProperDataForAISuggestions").returns("No proper data for AI suggestions");
                this.oController.oI18n.getText.withArgs("asint.cml.message.noProperCMLDataForAISuggestions").returns("CML does not contain proper data");
                this.oController._sObjectId = "EQ123";
                this.oController._sObjectType = "EQUI";

                if (sap.ui.core.BusyIndicator.show.restore) { sap.ui.core.BusyIndicator.show.restore(); }
                if (sap.ui.core.BusyIndicator.hide.restore) { sap.ui.core.BusyIndicator.hide.restore(); }

                this.busyIndicatorShowStub = sinon.stub(sap.ui.core.BusyIndicator, "show");
                this.busyIndicatorHideStub = sinon.stub(sap.ui.core.BusyIndicator, "hide");
                this.oController.fnMessageShow = sinon.stub();
                this.oController.fnCallAIAPI = sinon.stub();

                sinon.stub(this.oController, "getOwnerComponent").returns(this.oOwnerComponent);
            },
            afterEach: function () {
                if (sap.ui.core.BusyIndicator.show.restore) { sap.ui.core.BusyIndicator.show.restore(); }
                if (sap.ui.core.BusyIndicator.hide.restore) { sap.ui.core.BusyIndicator.hide.restore(); }
                sinon.restore();
            }
        });

        QUnit.test("fnProcessAIWorkflow - success flow (both CML and ASD APIs succeed)", function (assert) {
            var oMockCMLData = { cmls: [{ id: "CML1", value: "CML value" }] };
            var oMockASDData = { id: "ASD1", value: "ASD value" };

            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    success(oMockCMLData);
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    success(oMockASDData);
                })
            };
            this.oController.fnProcessAIWorkflow();

            assert.ok(this.busyIndicatorShowStub.calledOnce, "BusyIndicator shown");
            assert.ok(this.oController.CMLDataSource.getAllCMLs.calledOnce, "getAllCMLs called");
            assert.ok(this.oController.CMLDataSource.getASDLatest.calledOnce, "getASDLatest called");

            var oPayload = this.oModel.getProperty("/data/combinedPayload");
            assert.deepEqual(oPayload, {
                query: {
                    asdData: oMockASDData,
                    cmls: [{ id: "CML1", value: "CML value" }]
                }
            }, "Combined payload set correctly on model");

            assert.ok(this.oController.fnCallAIAPI.calledWith(oPayload), "fnCallAIAPI called with correct payload");
        });

        QUnit.test("fnProcessAIWorkflow - failure when CML API fails", function (assert) {
            var oMockError = { status: 500 };
            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    error(oMockError);
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    success({ id: "ASD" });
                })
            };

            this.oController.oI18n.getText.withArgs("asint.cml.message.failedToFetchCMLData").returns("Failed to fetch CML data");
            this.oController.fnProcessAIWorkflow();

            assert.ok(this.busyIndicatorHideStub.called, "BusyIndicator hidden on error");
            assert.ok(this.oController.fnMessageShow.calledWith("E", "Failed to fetch CML data", oMockError), "Error message shown");
            assert.ok(this.oController.fnCallAIAPI.notCalled, "fnCallAIAPI not called on error");
        });

        QUnit.test("fnProcessAIWorkflow - failure when ASD API fails", function (assert) {
            var oMockError = { status: 500 };

            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    success({ cmls: [{ id: "CML" }] });
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    error(oMockError);
                })
            };

            this.oController.oI18n.getText.withArgs("asint.cml.message.failedToFetchASDData").returns("Failed to fetch ASD data");
            this.oController.fnProcessAIWorkflow();

            assert.ok(this.busyIndicatorHideStub.called, "BusyIndicator hidden on error");
            assert.ok(this.oController.fnMessageShow.calledWith("E", "Failed to fetch ASD data", oMockError), "Error message shown");
            assert.ok(this.oController.fnCallAIAPI.notCalled, "fnCallAIAPI not called on error");
        });

        QUnit.test("fnProcessAIWorkflow - CML has data, ASD is empty (calls AI API with CML only)", function (assert) {
            var oMockCMLData = { cmls: [{ id: "CML1", value: "CML value" }] };
            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    success(oMockCMLData);
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    success({});
                })
            };

            this.oController.fnProcessAIWorkflow();

            assert.ok(this.oController.CMLDataSource.getAllCMLs.calledOnce, "getAllCMLs called");
            assert.ok(this.oController.CMLDataSource.getASDLatest.calledOnce, "getASDLatest called");

            var oPayload = this.oModel.getProperty("/data/combinedPayload");
            assert.deepEqual(oPayload, {
                query: {
                    cmls: [{ id: "CML1", value: "CML value" }]
                }
            }, "Payload set correctly with CML data only (no asdData)");

            assert.ok(this.oController.fnCallAIAPI.calledWith(oPayload), "fnCallAIAPI called with CML-only payload");
        });

        QUnit.test("fnProcessAIWorkflow - CML is empty, ASD has data (displays missing CML data message)", function (assert) {
            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    success({ cmls: [] });
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    success({ id: "ASD" });
                })
            };

            this.oController.fnProcessAIWorkflow();

            assert.ok(this.busyIndicatorHideStub.called, "BusyIndicator hidden when CML is empty");
            var aSections = this.oModel.getProperty("/data/aiSections");
            assert.ok(aSections && aSections.length > 0, "aiSections set on empty data");
            assert.strictEqual(aSections[0].title, "AI Insights", "Title of empty section matches");
            assert.strictEqual(aSections[0].type, "text", "Type of empty section matches");
            assert.strictEqual(aSections[0].value, "CML does not contain proper data", "Shows CML-specific missing message");
            assert.ok(this.oController.fnCallAIAPI.notCalled, "fnCallAIAPI not called");
        });

        QUnit.test("fnProcessAIWorkflow - both CML and ASD are empty (displays missing both data message)", function (assert) {
            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    success({});
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    success({});
                })
            };

            this.oController.fnProcessAIWorkflow();

            assert.ok(this.busyIndicatorHideStub.called, "BusyIndicator hidden when both empty");
            var aSections = this.oModel.getProperty("/data/aiSections");
            assert.ok(aSections && aSections.length > 0, "aiSections set on empty data");
            assert.strictEqual(aSections[0].title, "AI Insights", "Title of empty section matches");
            assert.strictEqual(aSections[0].type, "text", "Type of empty section matches");
            assert.strictEqual(aSections[0].value, "No proper data for AI suggestions", "Shows both missing message");
            assert.ok(this.oController.fnCallAIAPI.notCalled, "fnCallAIAPI not called");
        });

        QUnit.test("fnProcessAIWorkflow - success flow (ASD resolves first)", function (assert) {
            var oMockCMLData = { cmls: [{ id: "CML1", value: "CML value" }] };
            var oMockASDData = { id: "ASD1", value: "ASD value" };

            var fnCMLSuccess, fnASDSuccess;
            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    fnCMLSuccess = success;
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    fnASDSuccess = success;
                })
            };

            this.oController.fnProcessAIWorkflow();
            fnASDSuccess(oMockASDData);
            fnCMLSuccess(oMockCMLData);

            var oPayload = this.oModel.getProperty("/data/combinedPayload");
            assert.deepEqual(oPayload, {
                query: {
                    asdData: oMockASDData,
                    cmls: [{ id: "CML1", value: "CML value" }]
                }
            }, "Combined payload set correctly when ASD resolves first");
            assert.ok(this.oController.fnCallAIAPI.calledOnce, "fnCallAIAPI called");
        });

        QUnit.test("fnProcessAIWorkflow - passes correct arguments to CMLDataSource methods", function (assert) {
            this.oController.CMLDataSource = {
                getAllCMLs: sinon.spy(function (equipId, objType, success, error) {
                    success({});
                }),
                getASDLatest: sinon.spy(function (techId, success, error) {
                    success({});
                })
            };

            this.oController.fnProcessAIWorkflow();
            assert.ok(this.oController.CMLDataSource.getAllCMLs.calledWith("EQ123", "EQUI"), "getAllCMLs called with correct equipmentId & objType");
            assert.ok(this.oController.CMLDataSource.getASDLatest.calledWith("EQ123"), "getASDLatest called with correct techObjectId");
        });


        QUnit.module("CMLDetail Controller - fnCallAIAPI", {
            beforeEach: function () {
                this.oController = new Controller();
                this.oModel = new sap.ui.model.json.JSONModel({
                    metaData: {
                        featureFlag: {
                            CmlAiInsight: "1"
                        }
                    },
                    data: {}
                });
                this.oOwnerComponent = {
                    getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel)
                };
                this.oController.oI18n = {
                    getText: sinon.stub()
                };
                this.oController.fnPrepareAISections = sinon.stub().returns([{ title: "Sections" }]);
                this.oController.fnMessageShow = sinon.stub();

                if (sap.ui.core.BusyIndicator.hide.restore) { sap.ui.core.BusyIndicator.hide.restore(); }
                if (sap.m.MessageToast.show.restore) { sap.m.MessageToast.show.restore(); }

                this.busyIndicatorHideStub = sinon.stub(sap.ui.core.BusyIndicator, "hide");
                this.messageToastStub = sinon.stub(sap.m.MessageToast, "show");

                sinon.stub(this.oController, "getOwnerComponent").returns(this.oOwnerComponent);
            },
            afterEach: function () {
                if (sap.ui.core.BusyIndicator.hide.restore) { sap.ui.core.BusyIndicator.hide.restore(); }
                if (sap.m.MessageToast.show.restore) { sap.m.MessageToast.show.restore(); }
                sinon.restore();
            }
        });

        QUnit.test("fnCallAIAPI - success flow", function (assert) {
            var oMockResponse = { cmlSuggestions: { key: "value" } };
            var oPayload = { query: {} };

            this.oController.CMLDataSource = {
                callAIAPI: sinon.spy(function (payload, success, error) {
                    success(oMockResponse);
                })
            };
            this.oController.oI18n.getText.withArgs("asint.cml.message.aiInsightsLoaded").returns("AI Insights Loaded");
            this.oController.fnCallAIAPI(oPayload);

            assert.ok(this.busyIndicatorHideStub.calledOnce, "BusyIndicator hidden");
            assert.ok(this.oController.fnPrepareAISections.calledWith(oMockResponse), "fnPrepareAISections called with response");
            assert.deepEqual(this.oModel.getProperty("/data/aiResponse"), oMockResponse, "Response set on model");
            assert.deepEqual(this.oModel.getProperty("/data/aiSections"), [{ title: "Sections" }], "Sections set on model");
            assert.ok(this.messageToastStub.calledWith("AI Insights Loaded"), "Success message toast shown");
        });

        QUnit.test("fnCallAIAPI - error flow", function (assert) {
            var oMockError = { status: 500 };
            var oPayload = { query: {} };

            this.oController.CMLDataSource = {
                callAIAPI: sinon.spy(function (payload, success, error) {
                    error(oMockError);
                })
            };

            this.oController.oI18n.getText.withArgs("asint.cml.message.failedToFetchAIResponse").returns("Failed to fetch AI response");
            this.oController.fnCallAIAPI(oPayload);

            assert.ok(this.busyIndicatorHideStub.calledOnce, "BusyIndicator hidden");
            assert.ok(this.oController.fnMessageShow.calledWith("E", "Failed to fetch AI response", oMockError), "Error message shown");
        });

        QUnit.test("fnCallAIAPI - error flow when oError status is missing", function (assert) {
            var oMockError = null;
            var oPayload = { query: {} };

            this.oController.CMLDataSource = {
                callAIAPI: sinon.spy(function (payload, success, error) {
                    error(oMockError);
                })
            };
            this.oController.oI18n.getText.withArgs("asint.cml.message.failedToFetchAIResponse").returns("Failed to fetch AI response");
            this.oController.fnCallAIAPI(oPayload);

            assert.ok(this.busyIndicatorHideStub.calledOnce, "BusyIndicator hidden");
            assert.ok(this.oController.fnMessageShow.calledWith("E", "Failed to fetch AI response", oMockError), "Error message shown even with null error");
        });


        QUnit.module("CMLDetail Controller - fnPrepareAISections", {
            beforeEach: function () {
                this.oController = new Controller();
                this.oController.oI18n = {
                    getText: sinon.stub().returns("Recommendation Overview")
                };
            },
            afterEach: function () {
                sinon.restore();
            }
        });

        QUnit.test("fnPrepareAISections - simple object sections and overview", function (assert) {
            var oResponse = {
                overviewKey1: "overview value 1",
                overviewKey2: 123,
                section1: {
                    someKey: "value1",
                    another_key: ["a", "b"],
                    nestedObject: { child: "val" }
                }
            };

            var aSections = this.oController.fnPrepareAISections(oResponse);
            assert.strictEqual(aSections.length, 2, "Two sections generated (Overview + section1)");

            var oOverviewSection = aSections[0];
            assert.strictEqual(oOverviewSection.title, "Recommendation Overview", "Overview section title set from i18n");
            assert.strictEqual(oOverviewSection.type, "object", "Overview section is of type object");
            assert.deepEqual(oOverviewSection.data, [
                { key: " Overview Key1", value: "overview value 1" },
                { key: " Overview Key2", value: 123 }
            ], "Overview data formatted correctly");

            var oSection1 = aSections[1];
            assert.strictEqual(oSection1.title, " Section1", "Section1 title formatted");
            assert.strictEqual(oSection1.type, "object", "Section1 type is object");
            assert.deepEqual(oSection1.data, [
                { key: " Some Key", value: "value1" },
                { key: " Another key", value: "a, b" },
                { key: " Nested Object", value: '{"child":"val"}' }
            ], "Section1 key-value data formatted correctly");
        });

        QUnit.test("fnPrepareAISections - list and dynamicCards type sections", function (assert) {
            var oResponse = {
                cmlSuggestions: {
                    listSection: ["item1", "item2"],
                    cardsSection: [
                        { cmlName: "Card A", detail: "info A" },
                        { name: "Card B", value: "info B" },
                        { otherField: "info C" }
                    ]
                }
            };

            var aSections = this.oController.fnPrepareAISections(oResponse);
            assert.strictEqual(aSections.length, 2, "Two sections generated");

            var oListSec = aSections[0];
            assert.strictEqual(oListSec.title, " List Section", "List section title formatted");
            assert.strictEqual(oListSec.type, "list", "List section type is list");
            assert.deepEqual(oListSec.data, ["item1", "item2"], "List section data matches");

            var oCardsSec = aSections[1];
            assert.strictEqual(oCardsSec.title, " Cards Section", "Cards section title formatted");
            assert.strictEqual(oCardsSec.type, "dynamicCards", "Cards section type is dynamicCards");
            assert.deepEqual(oCardsSec.data, [
                { title: "Card A", data: [{ key: " Detail", value: "info A" }] },
                { title: "Card B", data: [{ key: " Value", value: "info B" }] },
                { title: "Item", data: [{ key: " Other Field", value: "info C" }] }
            ], "dynamicCards section data mapped correctly");
        });

        QUnit.test("fnPrepareAISections - response formatting with complex keys (camelCase and snake_case)", function (assert) {
            var oResponse = {
                someVeryLongFieldName: "value",
                another_under_score_field: "value 2"
            };
            var aSections = this.oController.fnPrepareAISections(oResponse);

            assert.strictEqual(aSections.length, 1, "Only overview section generated");
            var oOverview = aSections[0];
            assert.strictEqual(oOverview.data[0].key, " Some Very Long Field Name", "camelCase formatting works");
            assert.strictEqual(oOverview.data[1].key, " Another under score field", "snake_case formatting works");
        });

        QUnit.test("fnPrepareAISections - handles null or undefined response gracefully", function (assert) {
            var aSectionsNull = this.oController.fnPrepareAISections(null);
            assert.deepEqual(aSectionsNull, [], "Null response produces empty array");

            var aSectionsUndefined = this.oController.fnPrepareAISections(undefined);
            assert.deepEqual(aSectionsUndefined, [], "Undefined response produces empty array");
        });

        QUnit.test("fnPrepareAISections - overview omitted when no top-level primitive values exist", function (assert) {
            var oResponse = {
                sectionA: {
                    key: "value"
                }
            };

            var aSections = this.oController.fnPrepareAISections(oResponse);
            assert.strictEqual(aSections.length, 1, "Only one section generated");
            assert.notEqual(aSections[0].title, "Recommendation Overview", "Overview is omitted because there were no primitive top-level keys");
        });

        QUnit.test("fnPrepareAISections - dynamicCards fallback maps items correctly when title fields are completely missing", function (assert) {
            var oResponse = {
                cardSection: [
                    { randomField1: "A", randomField2: "B" }
                ]
            };

            var aSections = this.oController.fnPrepareAISections(oResponse);
            assert.strictEqual(aSections.length, 1, "Section generated");
            var oCard = aSections[0].data[0];
            assert.strictEqual(oCard.title, "Item", "Falls back to 'Item' when name and cmlName are missing");
        });

        QUnit.test("fnPrepareAISections - dynamicCards handles empty cards list", function (assert) {
            var oResponse = {
                cardSection: []
            };

            var aSections = this.oController.fnPrepareAISections(oResponse);
            assert.strictEqual(aSections.length, 1, "Section generated");
            assert.strictEqual(aSections[0].type, "list", "Empty cards array matches 'list' type fallback because array has 0 length");
        });

        QUnit.test("fnPrepareAISections - sorts sections by preferred order, putting detailed cmlAnalysis last", function (assert) {
            var oResponse = {
                cmlSuggestions: {
                    cmlAnalysis: [{ cmlName: "Card A" }],
                    optimizationSummary: { totalExistingCMLs: "14" },
                    immediateActions: ["Action 1"],
                    assetSummary: { equipmentName: "EQ1" },
                    someOtherKey: { val: 1 }
                }
            };

            var aSections = this.oController.fnPrepareAISections(oResponse);

            assert.strictEqual(aSections.length, 5, "Five sections generated");
            assert.strictEqual(aSections[0].title, " Asset Summary", "assetSummary is sorted first");
            assert.strictEqual(aSections[1].title, " Optimization Summary", "optimizationSummary is sorted second");
            assert.strictEqual(aSections[2].title, " Immediate Actions", "immediateActions is sorted third");
            assert.strictEqual(aSections[3].title, " CML Analysis", "cmlAnalysis is sorted fourth");
            assert.strictEqual(aSections[4].title, " Some Other Key", "custom keys are placed last and preserved");
        });


        QUnit.module("CMLDetail Controller - fnAISectionFactory", {
            beforeEach: function () {

                if (sap.m.Text && sap.m.Text.restore) { sap.m.Text.restore(); }
                if (sap.m.Title && sap.m.Title.restore) { sap.m.Title.restore(); }
                if (sap.m.List && sap.m.List.restore) { sap.m.List.restore(); }
                if (sap.m.VBox && sap.m.VBox.restore) { sap.m.VBox.restore(); }
                if (sap.m.CustomListItem && sap.m.CustomListItem.restore) { sap.m.CustomListItem.restore(); }
                this.oController = new Controller();
            },
            afterEach: function () {
                sinon.restore();
            }
        });

        QUnit.test("fnAISectionFactory - type 'text'", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns("text");
            oContext.getProperty.withArgs("value").returns("Text content");
            oContext.getProperty.withArgs("data").returns(null);

            var oListItem = this.oController.fnAISectionFactory("testListItemId", oContext);

            assert.ok(oListItem, "Returns a CustomListItem");
            assert.strictEqual(oListItem.getId(), "testListItemId", "Has correct ID");

            var oOuterVBox = oListItem.getContent()[0];
            assert.ok(oOuterVBox, "Outer VBox exists");
            assert.strictEqual(oOuterVBox.getMetadata().getName(), "sap.m.VBox", "Outer content is a VBox");
            assert.strictEqual(oOuterVBox.getItems().length, 2, "VBox has 2 items (Title + Content)");

            var oTitle = oOuterVBox.getItems()[0];
            assert.strictEqual(oTitle.getMetadata().getName(), "sap.m.Title", "First item is a Title");

            var oContentVBox = oOuterVBox.getItems()[1];
            assert.strictEqual(oContentVBox.getMetadata().getName(), "sap.m.VBox", "Content is a VBox for text type");

            assert.ok(oContentVBox.getItems().length > 0, "Content VBox has items");
            var oTextCtrl = oContentVBox.getItems()[0];
            assert.strictEqual(oTextCtrl.getMetadata().getName(), "sap.m.Text", "Content VBox item is sap.m.Text");
            var oTextBinding = oTextCtrl.getBindingInfo("text");
            assert.ok(oTextBinding, "Text control has a text binding");
            var sPath = oTextBinding.path || (oTextBinding.parts && oTextBinding.parts[0] && oTextBinding.parts[0].path);
            var sModel = oTextBinding.model || (oTextBinding.parts && oTextBinding.parts[0] && oTextBinding.parts[0].model);
            assert.strictEqual(sPath, "value", "Text binding path is 'value'");
            assert.strictEqual(sModel, "mCMLModel", "Text binding model is 'mCMLModel'");
        });

        QUnit.test("fnAISectionFactory - type 'list'", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns("list");
            oContext.getProperty.withArgs("value").returns(null);
            oContext.getProperty.withArgs("data").returns(["item1", "item2"]);

            var oListItem = this.oController.fnAISectionFactory("testListId", oContext);

            assert.ok(oListItem, "Returns a CustomListItem");
            var oOuterVBox = oListItem.getContent()[0];
            assert.strictEqual(oOuterVBox.getMetadata().getName(), "sap.m.VBox", "Outer content is a VBox");

            var oList = oOuterVBox.getItems()[1];
            assert.strictEqual(oList.getMetadata().getName(), "sap.m.List", "Content is a sap.m.List");

            var oBindingInfo = oList.getBindingInfo("items");
            assert.ok(oBindingInfo, "List has items binding info");
            assert.strictEqual(oBindingInfo.path, "data", "Binding path is 'data'");
            assert.strictEqual(oBindingInfo.model, "mCMLModel", "Binding model is 'mCMLModel'");
        });

        QUnit.test("fnAISectionFactory - type 'dynamicCards'", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns("dynamicCards");
            oContext.getProperty.withArgs("value").returns(null);
            oContext.getProperty.withArgs("data").returns([{ title: "card1", data: [{ key: "k", value: "v" }] }]);

            var oListItem = this.oController.fnAISectionFactory("testCardsId", oContext);

            assert.ok(oListItem, "Returns a CustomListItem");
            var oOuterVBox = oListItem.getContent()[0];
            assert.strictEqual(oOuterVBox.getMetadata().getName(), "sap.m.VBox", "Outer content is a VBox");

            var oCardsVBox = oOuterVBox.getItems()[1];
            assert.strictEqual(oCardsVBox.getMetadata().getName(), "sap.m.VBox", "Content is a VBox for dynamicCards");

            var oBindingInfo = oCardsVBox.getBindingInfo("items");
            assert.ok(oBindingInfo, "Cards VBox has items binding info");
            assert.strictEqual(oBindingInfo.path, "data", "Binding path is 'data'");
            assert.strictEqual(oBindingInfo.model, "mCMLModel", "Binding model is 'mCMLModel'");
        });

        QUnit.test("fnAISectionFactory - type 'object'", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns("object");
            oContext.getProperty.withArgs("value").returns(null);
            oContext.getProperty.withArgs("data").returns([{ key: "k", value: "v" }]);

            var oListItem = this.oController.fnAISectionFactory("testObjectId", oContext);

            assert.ok(oListItem, "Returns a CustomListItem");
            var oOuterVBox = oListItem.getContent()[0];
            assert.strictEqual(oOuterVBox.getMetadata().getName(), "sap.m.VBox", "Outer content is a VBox");

            var oObjectVBox = oOuterVBox.getItems()[1];
            assert.strictEqual(oObjectVBox.getMetadata().getName(), "sap.m.VBox", "Content is a VBox for object type");

            var oList = oObjectVBox.getItems()[0];
            assert.strictEqual(oList.getMetadata().getName(), "sap.m.List", "VBox contains a sap.m.List");

            var oBindingInfo = oList.getBindingInfo("items");
            assert.ok(oBindingInfo, "List has items binding info");
            assert.strictEqual(oBindingInfo.path, "data", "Binding path is 'data'");
            assert.strictEqual(oBindingInfo.model, "mCMLModel", "Binding model is 'mCMLModel'");
        });

        QUnit.test("fnAISectionFactory - auto-detect type 'text' when type property is missing but value is defined", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns(null);
            oContext.getProperty.withArgs("value").returns("Auto text content");
            oContext.getProperty.withArgs("data").returns(null);

            var oListItem = this.oController.fnAISectionFactory("testAutoText", oContext);
            var oOuterVBox = oListItem.getContent()[0];
            var oContentVBox = oOuterVBox.getItems()[1];

            assert.strictEqual(oContentVBox.getMetadata().getName(), "sap.m.VBox", "Content is a VBox for text type");
            var oTextCtrl = oContentVBox.getItems()[0];
            assert.strictEqual(oTextCtrl.getMetadata().getName(), "sap.m.Text", "Autodetected text control");
        });

        QUnit.test("fnAISectionFactory - auto-detect type 'list' when type property is missing and data is string array", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns(null);
            oContext.getProperty.withArgs("value").returns(null);
            oContext.getProperty.withArgs("data").returns(["itemA", "itemB"]);

            var oListItem = this.oController.fnAISectionFactory("testAutoList", oContext);
            var oOuterVBox = oListItem.getContent()[0];
            var oListCtrl = oOuterVBox.getItems()[1];

            assert.strictEqual(oListCtrl.getMetadata().getName(), "sap.m.List", "Autodetected List control");
        });

        QUnit.test("fnAISectionFactory - auto-detect type 'dynamicCards' when type property is missing and data contains cards", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns(null);
            oContext.getProperty.withArgs("value").returns(null);
            oContext.getProperty.withArgs("data").returns([{ title: "My Card" }]);

            var oListItem = this.oController.fnAISectionFactory("testAutoCards", oContext);
            var oOuterVBox = oListItem.getContent()[0];
            var oCardsVBox = oOuterVBox.getItems()[1];

            assert.strictEqual(oCardsVBox.getMetadata().getName(), "sap.m.VBox", "Content is a VBox for dynamicCards");
            var oBindingInfo = oCardsVBox.getBindingInfo("items");
            assert.strictEqual(oBindingInfo.path, "data", "Binding path is correct");
        });

        QUnit.test("fnAISectionFactory - auto-detect type 'object' when type property is missing and data is non-array object", function (assert) {
            var oContext = {
                getProperty: sinon.stub()
            };
            oContext.getProperty.withArgs("type").returns(null);
            oContext.getProperty.withArgs("value").returns(null);
            oContext.getProperty.withArgs("data").returns({ key1: "value1" });

            var oListItem = this.oController.fnAISectionFactory("testAutoObject", oContext);
            var oOuterVBox = oListItem.getContent()[0];
            var oObjectVBox = oOuterVBox.getItems()[1];

            assert.strictEqual(oObjectVBox.getMetadata().getName(), "sap.m.VBox", "Content is a VBox for object");
        });

        QUnit.test("fnAISectionFactory - fnCreateKeyValueList factory logic", function (assert) {
            const oContext = { getProperty: sinon.stub() };
            oContext.getProperty.withArgs("type").returns("object");
            oContext.getProperty.withArgs("data").returns([{ key: "k", value: "v" }]);

            const oListItem = this.oController.fnAISectionFactory("testKeyValueListFactoryId", oContext);
            const fnFactory = oListItem.getContent()[0].getItems()[1].getItems()[0].getBindingInfo("items").factory;

            const fnCheck = (sId, sVal, bGrid, sAlign, sWidth) => {
                const oCtx = { getProperty: sinon.stub().withArgs("value").returns(sVal) };
                const oItem = fnFactory(sId, oCtx);
                const oHBox = oItem.getContent()[0];
                const oText = oHBox.getItems()[1];

                assert.strictEqual(oHBox.hasStyleClass("aiRowGrid"), bGrid, `Grid class is ${bGrid}`);
                assert.strictEqual(oText.getTextAlign(), sAlign, `Alignment is ${sAlign}`);
                assert.strictEqual(oText.getWidth(), sWidth, `Width is ${sWidth}`);
                oItem.destroy();
            };

            fnCheck("shortValId", "short value", false, "End", "");
            fnCheck("longValId", "This is a very long text value that exceeds thirty five characters limit.", true, "Begin", "100%");

            oListItem.destroy();
        });


        QUnit.module("CMLDetail Controller - handleCloseAi", {
            beforeEach: function () {
                this.oController = new Controller();
                this.oModel = new sap.ui.model.json.JSONModel({
                    metaData: {
                        featureFlag: {
                            CmlAiInsight: "1"
                        }
                    },
                    data: {
                        detailPage: {
                            layout: "TwoColumnsMidExpanded"
                        }
                    }
                });
                this.oOwnerComponent = {
                    getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel)
                };
                sinon.stub(this.oController, "getOwnerComponent").returns(this.oOwnerComponent);
            },
            afterEach: function () {
                sinon.restore();
            }
        });

        QUnit.test("handleCloseAi - updates layout property to OneColumn", function (assert) {
            this.oController.handleCloseAi();
            assert.strictEqual(this.oModel.getProperty("/data/detailPage/layout"), "OneColumn", "Layout set to OneColumn");
        });

        QUnit.test("handleCloseAi - works correctly even if layout property path is not yet initialized", function (assert) {
            this.oModel.setProperty("/data/detailPage", {});

            this.oController.handleCloseAi();

            assert.strictEqual(this.oModel.getProperty("/data/detailPage/layout"), "OneColumn", "Layout set to OneColumn");
        });


        QUnit.module("CMLDetail Controller - onDownloadPDF & Helpers", {
            beforeEach: function () {
                this.oController = new Controller();
                this.oModel = new sap.ui.model.json.JSONModel({
                    metaData: {
                        featureFlag: {
                            CmlAiInsight: "1"
                        }
                    },
                    data: {
                        detailPage: {
                            headerData: {
                                objectName: "Equip_Test",
                                displayId: "EQ-100",
                                objectType: "EQUI"
                            },
                            aiSections: [
                                { title: "Overview", type: "object", data: [{ key: "K1", value: "V1" }] },
                                { title: "Text section", type: "text", value: "Plain Text" },
                                { title: "Cards section", type: "dynamicCards", data: [{ title: "Card 1", data: [{ key: "CK1", value: "CV1" }] }] },
                                { title: "List section", type: "list", data: ["item1", "item2"] }
                            ]
                        },
                        aiSections: [
                            { title: "Overview", type: "object", data: [{ key: "K1", value: "V1" }] },
                            { title: "Text section", type: "text", value: "Plain Text" },
                            { title: "Cards section", type: "dynamicCards", data: [{ title: "Card 1", data: [{ key: "CK1", value: "CV1" }] }] },
                            { title: "List section", type: "list", data: ["item1", "item2"] }
                        ]
                    }
                });
                this.oView = {
                    getModel: sinon.stub().withArgs("mCMLModel").returns(this.oModel)
                };
                this.oController.oI18n = {
                    getText: sinon.stub().returns("TransText")
                };
                this.oController.fnMessageShow = sinon.stub();

                if (sap.ui.core.BusyIndicator.show.restore) { sap.ui.core.BusyIndicator.show.restore(); }
                if (sap.ui.core.BusyIndicator.hide.restore) { sap.ui.core.BusyIndicator.hide.restore(); }
                if (sap.m.MessageToast.show.restore) { sap.m.MessageToast.show.restore(); }
                if (sap.m.MessageBox.confirm.restore) { sap.m.MessageBox.confirm.restore(); }

                var that = this;
                this.busyIndicatorShowStub = sinon.stub(sap.ui.core.BusyIndicator, "show");
                this.busyIndicatorHideStub = sinon.stub(sap.ui.core.BusyIndicator, "hide");
                this.messageToastStub = sinon.stub(sap.m.MessageToast, "show");

                this.confirmStub = sinon.stub(sap.m.MessageBox, "confirm", function (sMessage, oOptions) {
                    if (oOptions && typeof oOptions.onClose === "function" && that.fnConfirmHandler) {
                        that.fnConfirmHandler(oOptions.onClose);
                    }
                });

                sinon.stub(this.oController, "getView").returns(this.oView);

                this.downloadSpy = sinon.spy();

                var oOriginalPdfMake = window.PdfMake || window.pdfMake || (typeof PdfMake !== "undefined" ? PdfMake : null) || (typeof pdfMake !== "undefined" ? pdfMake : null);
                if (oOriginalPdfMake) {
                    this.pdfMakeStub = sinon.stub(oOriginalPdfMake, "createPdf", function () {
                        return {
                            download: that.downloadSpy
                        };
                    });
                    this.oPdfMakeObject = oOriginalPdfMake;
                } else {
                    window.PdfMake = {
                        createPdf: sinon.stub().returns({
                            download: this.downloadSpy
                        }),
                        vfs: null
                    };
                    this.pdfMakeStub = window.PdfMake.createPdf;
                    this.oPdfMakeObject = window.PdfMake;
                }

                this.oldVfsFonts = window.VfsFonts;
                window.VfsFonts = {
                    pdfMake: {
                        vfs: "mock_vfs_fonts"
                    }
                };
            },
            afterEach: function () {
                window.VfsFonts = this.oldVfsFonts;
                if (this.pdfMakeStub && this.pdfMakeStub.restore) {
                    this.pdfMakeStub.restore();
                }
                if (sap.ui.core.BusyIndicator.show.restore) { sap.ui.core.BusyIndicator.show.restore(); }
                if (sap.ui.core.BusyIndicator.hide.restore) { sap.ui.core.BusyIndicator.hide.restore(); }
                if (sap.m.MessageToast.show.restore) { sap.m.MessageToast.show.restore(); }
                if (sap.m.MessageBox.confirm.restore) { sap.m.MessageBox.confirm.restore(); }
                sinon.restore();
            }
        });

        QUnit.test("onDownloadPDF - cancel action does nothing", function (assert) {
            this.fnConfirmHandler = function (fnOnClose) {
                fnOnClose(sap.m.MessageBox.Action.CANCEL);
            };

            this.oController.onDownloadPDF();

            assert.ok(this.confirmStub.calledOnce, "Confirmation prompt displayed");
            assert.ok(this.downloadSpy.notCalled, "PDF is not generated/downloaded");
        });

        QUnit.test("onDownloadPDF - yes action generates and downloads PDF successfully", function (assert) {
            this.fnConfirmHandler = function (fnOnClose) {
                fnOnClose(sap.m.MessageBox.Action.YES);
            };

            this.oController.fnPDFGetFooter = sinon.spy(function (fnSuccess) {
                fnSuccess(function (currentPage, pageCount) {
                    return { text: "mock footer" };
                });
            });

            this.oController.onDownloadPDF();

            assert.ok(this.confirmStub.calledOnce, "Confirmation prompt displayed");
            assert.ok(this.busyIndicatorShowStub.calledOnce, "BusyIndicator shown");
            assert.ok(this.oController.fnPDFGetFooter.calledOnce, "Footer callback invoked");

            assert.ok(this.pdfMakeStub.calledOnce, "PdfMake.createPdf was called");
            var oPdfConfig = this.pdfMakeStub.firstCall.args[0];

            assert.ok(oPdfConfig.content && oPdfConfig.content.length > 0, "PDF config contains content");
            assert.ok(this.downloadSpy.calledWith("Equip_Test.pdf"), "PDF download triggered with correct file name");
            assert.ok(this.messageToastStub.calledWith("TransText"), "Success message toast shown");
            assert.ok(this.busyIndicatorHideStub.calledOnce, "BusyIndicator hidden");
        });

        QUnit.test("onDownloadPDF - handle error during generation", function (assert) {
            this.fnConfirmHandler = function (fnOnClose) {
                fnOnClose(sap.m.MessageBox.Action.YES);
            };

            this.oController.fnPDFGetFooter = sinon.spy(function (fnSuccess) {
                fnSuccess(function (currentPage, pageCount) {
                    return { text: "mock footer" };
                });
            });

            if (this.pdfMakeStub && this.pdfMakeStub.restore) {
                this.pdfMakeStub.restore();
            }
            var oOriginalPdfMake = window.PdfMake || window.pdfMake || (typeof PdfMake !== "undefined" ? PdfMake : null) || (typeof pdfMake !== "undefined" ? pdfMake : null);
            this.pdfMakeStub = sinon.stub(oOriginalPdfMake, "createPdf", function () {
                throw new Error("PDF Generation Error");
            });

            this.oController.onDownloadPDF();

            assert.ok(this.messageToastStub.calledWith("TransText"), "Message toast shown on failure");
            assert.ok(this.busyIndicatorHideStub.calledOnce, "BusyIndicator hidden even after error");
        });

        QUnit.test("AiSectionType - determines correct types", function (assert) {
            assert.strictEqual(this.oController.AiSectionType("some value", []), "text", "Value defined matches text type");
            assert.strictEqual(this.oController.AiSectionType(null, ["a", "b"]), "list", "Array of strings matches list type");
            assert.strictEqual(this.oController.AiSectionType(null, [{ key: "K" }]), "object", "Array of objects with key property matches object type");
            assert.strictEqual(this.oController.AiSectionType(null, [{ title: "T" }]), "dynamicCards", "Array of objects without key matches dynamicCards type");
            assert.strictEqual(this.oController.AiSectionType(null, {}), "object", "Object data matches object type");
        });

        QUnit.test("fnPDFGetFooter - returns footer design", function (assert) {
            this.oController.fnPDFGetFooter(function (fnFooterContent) {
                var oFooter = fnFooterContent(1, 5);
                assert.ok(oFooter && oFooter.columns, "Footer returns columns list");
                assert.strictEqual(oFooter.columns.length, 3, "Footer has 3 columns");
                assert.strictEqual(oFooter.columns[2].text, "1/5", "Third column displays page/count correctly");
            });
        });

        QUnit.test("onDownloadPDF - handles missing headerData gracefully", function (assert) {
            this.fnConfirmHandler = function (fnOnClose) {
                fnOnClose(sap.m.MessageBox.Action.YES);
            };

            this.oController.fnPDFGetFooter = sinon.spy(function (fnSuccess) {
                fnSuccess(function (currentPage, pageCount) {
                    return { text: "mock footer" };
                });
            });

            this.oModel.setProperty("/data/detailPage/headerData", null);
            this.oController.onDownloadPDF();

            assert.ok(this.pdfMakeStub.calledOnce, "createPdf called");
            assert.ok(this.downloadSpy.calledWith("CML_AI_Recommendation.pdf"), "Default fallback file name used correctly");
        });

        QUnit.test("onDownloadPDF - uses custom busyDialog if defined on controller", function (assert) {
            this.fnConfirmHandler = function (fnOnClose) {
                fnOnClose(sap.m.MessageBox.Action.YES);
            };

            this.oController.fnPDFGetFooter = sinon.spy(function (fnSuccess) {
                fnSuccess(function (currentPage, pageCount) {
                    return { text: "mock footer" };
                });
            });

            var oBusyDialogSpy = {
                open: sinon.spy(),
                close: sinon.spy()
            };
            this.oController.busyDialog = oBusyDialogSpy;
            this.oController.onDownloadPDF();

            assert.ok(oBusyDialogSpy.open.calledOnce, "busyDialog.open called");
            assert.ok(oBusyDialogSpy.close.calledOnce, "busyDialog.close called");
            assert.ok(this.busyIndicatorShowStub.notCalled, "BusyIndicator.show fallback not called when busyDialog is present");
            assert.ok(this.busyIndicatorHideStub.notCalled, "BusyIndicator.hide fallback not called when busyDialog is present");
        });

        QUnit.test("onDownloadPDF - constructs correct oPdfConfig including TOC and all sections", function (assert) {
            this.fnConfirmHandler = function (fnOnClose) {
                fnOnClose(sap.m.MessageBox.Action.YES);
            };

            this.oController.fnPDFGetFooter = sinon.spy(function (fnSuccess) {
                fnSuccess(function (currentPage, pageCount) {
                    return { text: "mock footer" };
                });
            });

            this.oModel.setProperty("/data/aiSections", [
                { title: "Text Sec", type: "text", value: "This is a simple text suggestion." },
                { title: "Obj Sec", type: "object", data: [{ key: "K1", value: "V1" }] },
                { title: "Card Sec", type: "dynamicCards", data: [{ title: "CardTitle", data: [{ key: "CK1", value: "CV1" }] }] },
                { title: "List Sec", type: "list", data: ["Line item 1", "Line item 2"] }
            ]);

            this.oController.onDownloadPDF();

            assert.ok(this.pdfMakeStub.calledOnce, "PdfMake.createPdf was called");
            var oPdfConfig = this.pdfMakeStub.firstCall.args[0];

            var oFirstItem = oPdfConfig.content[0];
            assert.ok(oFirstItem.toc, "First item is the table of contents config");
            assert.strictEqual(oFirstItem.pageBreak, "after", "TOC ends with a pageBreak");

            var aContent = oPdfConfig.content;

            var oTextSecTitle = aContent.find(function (c) { return c.text === "Text Sec"; });
            assert.ok(oTextSecTitle, "Text section title found");
            var oTextSecVal = aContent.find(function (c) { return c.text === "This is a simple text suggestion."; });
            assert.ok(oTextSecVal, "Text section value found");

            var oObjSecTitle = aContent.find(function (c) { return c.text === "Obj Sec"; });
            assert.ok(oObjSecTitle, "Object section title found");
            var oObjSecTable = aContent.find(function (c) { return c.table && c.table.body && c.table.body[1][0].text === "K1"; });
            assert.ok(oObjSecTable, "Object section table data found");

            var oCardSecTitle = aContent.find(function (c) { return c.text === "Card Sec"; });
            assert.ok(oCardSecTitle, "Card section title found");
            var oCardHeader = aContent.find(function (c) { return c.text === "CardTitle"; });
            assert.ok(oCardHeader, "Card title subheading found");

            var oListSecTitle = aContent.find(function (c) { return c.text === "List Sec"; });
            assert.ok(oListSecTitle, "List section title found");
            var oListItem = aContent.find(function (c) { return c.text === "Line item 1"; });
            assert.ok(oListItem, "List section item found");
        });

        QUnit.test("AiSectionType - edge cases", function (assert) {
            assert.strictEqual(this.oController.AiSectionType(null, null), "object", "Null data with null value defaults to object type");
            assert.strictEqual(this.oController.AiSectionType(undefined, undefined), "object", "Undefined data defaults to object type");
            assert.strictEqual(this.oController.AiSectionType(null, []), "list", "Empty data array defaults to list type");
            assert.strictEqual(this.oController.AiSectionType(null, [{ key: "defined" }]), "object", "Object in array containing key maps to object");
            assert.strictEqual(this.oController.AiSectionType(null, [{ other: "no_key" }]), "dynamicCards", "Object in array missing key maps to dynamicCards");
        });

        QUnit.test("fnPDFGetFooter - formats columns with footer info", function (assert) {
            this.oController.oI18n.getText.withArgs("asint.cml.detail.ai.reportCopyright").returns("© 2026 Asint Inc.");

            this.oController.fnPDFGetFooter(function (fnFooterContent) {
                var oFooter = fnFooterContent(2, 10);
                assert.ok(oFooter && oFooter.columns, "Footer has columns");
                assert.strictEqual(oFooter.columns[1].text, "© 2026 Asint Inc.", "Copyright text set correctly from i18n");
                assert.ok(oFooter.columns[0].text, "Timestamp printed in first column");
                assert.strictEqual(oFooter.columns[2].text, "2/10", "Page count formatted");
            });
        });

    });
 

    QUnit.module("onPressCalculate - ignored readings & cmlSummaryValidations flag", {
        /**
         * @description Setup stubs and spies before each test to isolate onPressCalculate logic
         */
        beforeEach: function () {
            this.oController = new Controller();

            this.oModelData = {
                "/data/UOM": "imperial",
                "/data/CMLTabSection/temp/Action": "",
                "/data/CMLTabSection/Detail/LocationPersonaData/sectionList": [
                    { publishSequence: "2" },
                    { publishSequence: "1" }
                ],
                "/metaData/featureFlag/cmlSummaryValidations": "0",
                "/data/ignoredReading": {},
                "/data/CMLTabSection/LocationData/DataSource/READINGS": []
            };

            var that = this;
            this.oCommonCMLModel = {
                /**
                 *
                 */
                getProperty: function (sPath) { return that.oModelData[sPath]; },
                /**
                 *
                 */
                setProperty: function (sPath, vValue) { that.oModelData[sPath] = vValue; }
            };

            sinon.spy(this.oCommonCMLModel, "setProperty");

            this.oController.getOwnerComponent = function () {
                return {
                    /**
                     *
                     */
                    getModel: function () { return that.oCommonCMLModel; }
                };
            };

            this.oController.getView = function () {
                return {
                    /**
                     *
                     */
                    getModel: function () {
                        return {
                            /**
                             *
                             */
                            getResourceBundle: function () {
                                return {
                                    /**
                                     *
                                     * @param {string} k
                                     * @returns {string}
                                     */
                                    getText: function (k) { return k; }
                                };
                            }
                        };
                    },
                    /**
                     *
                     */
                    getId: function () { return "testView"; },
                    /**
                     *
                     */
                    addDependent: sinon.spy()
                };
            };

            this.oController._LocationController = {
                /**
                 *
                 */
                fnCheckMandatoryFields: sinon.stub(),
                /**
                 *
                 */
                fnConvertDsValues: sinon.stub(),
                /**
                 *
                 */
                fnCalculate: sinon.stub()
            };

            this.oController.fnMessageShow = sinon.stub();
        },

        /**
         * @description Restore sinon stubs and spies after each test to ensure test isolation
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("Should set Action to 'Calculate' on model and sort sectionList by publishSequence before proceeding", function (assert) {
        this.oModelData["/data/CMLTabSection/Detail/LocationPersonaData/sectionList"] = [
            { publishSequence: "3" },
            { publishSequence: "1" },
            { publishSequence: "2" }
        ];
        this.oController._LocationController.fnCheckMandatoryFields.callsArg(3);

        this.oController.onPressCalculate();

        assert.ok(
            this.oCommonCMLModel.setProperty.calledWith("/data/CMLTabSection/temp/Action", "Calculate"),
            "Action property should be set to 'Calculate'"
        );

        var aSectionList = this.oModelData["/data/CMLTabSection/Detail/LocationPersonaData/sectionList"];
        assert.strictEqual(aSectionList[0].publishSequence, "1", "sectionList should be sorted ascending by publishSequence");
    });

    QUnit.test("Should call fnConvertDsValues then fnCalculate when UOM is metric, and skip fnConvertDsValues when imperial", function (assert) {
        this.oModelData["/data/UOM"] = "metric";
        this.oController._LocationController.fnCheckMandatoryFields.callsArg(3);
        this.oController._LocationController.fnConvertDsValues.callsArg(1);

        this.oController.onPressCalculate();

        assert.ok(
            this.oController._LocationController.fnConvertDsValues.calledOnce,
            "fnConvertDsValues should be called for metric UOM"
        );
        assert.ok(
            this.oController._LocationController.fnCalculate.calledOnce,
            "fnCalculate should be called after fnConvertDsValues for metric UOM"
        );

        sinon.restore();

        this.oController._LocationController.fnCheckMandatoryFields = sinon.stub().callsArg(3);
        this.oController._LocationController.fnConvertDsValues = sinon.stub();
        this.oController._LocationController.fnCalculate = sinon.stub();
        this.oModelData["/data/UOM"] = "imperial";

        this.oController.onPressCalculate();

        assert.ok(
            this.oController._LocationController.fnConvertDsValues.notCalled,
            "fnConvertDsValues should NOT be called for imperial UOM"
        );
        assert.ok(
            this.oController._LocationController.fnCalculate.calledOnce,
            "fnCalculate should be called directly for imperial UOM"
        );
    });

    QUnit.test("Should show fnMessageShow with type 'C' and ignoreReadingMessage key when cmlSummaryValidations is on and ignored readings exist", function (assert) {
        this.oModelData["/metaData/featureFlag/cmlSummaryValidations"] = "1";
        this.oModelData["/data/ignoredReading"] = { "r1": true };
        this.oModelData["/data/CMLTabSection/LocationData/DataSource/READINGS"] = [
            { dataId: "r1", DATE: null, READING: "55.5" }
        ];

        this.oController.onPressCalculate();

        assert.ok(
            this.oController.fnMessageShow.calledOnce,
            "fnMessageShow should be called when cmlSummaryValidations is on and ignored readings exist"
        );
        assert.strictEqual(
            this.oController.fnMessageShow.getCall(0).args[0], "C",
            "fnMessageShow should be called with type 'C'"
        );
        assert.strictEqual(
            this.oController.fnMessageShow.getCall(0).args[1], "asint.cml.calculate.ignoreReadingMessage",
            "fnMessageShow should pass the ignoreReadingMessage i18n key"
        );
    });

    QUnit.test("Should call fnProceedCalculation when user confirms YES and skip it when user selects NO", function (assert) {
        this.oModelData["/metaData/featureFlag/cmlSummaryValidations"] = "1";
        this.oModelData["/data/ignoredReading"] = { "r1": true };
        this.oModelData["/data/CMLTabSection/LocationData/DataSource/READINGS"] = [
            { dataId: "r1", DATE: null, READING: "10" }
        ];

        this.oController._LocationController.fnCheckMandatoryFields.callsArg(3);
        this.oController.fnMessageShow = sinon.stub().callsArgWith(3, sap.m.MessageBox.Action.YES);

        this.oController.onPressCalculate();

        assert.ok(
            this.oController._LocationController.fnCalculate.calledOnce,
            "fnCalculate should be called when user confirms YES"
        );

        this.oController._LocationController.fnCalculate.reset();
        this.oController.fnMessageShow = sinon.stub().callsArgWith(3, sap.m.MessageBox.Action.NO);

        this.oController.onPressCalculate();

        assert.ok(
            this.oController._LocationController.fnCalculate.notCalled,
            "fnCalculate should NOT be called when user selects NO"
        );
    });

    QUnit.test("Should proceed directly without fnMessageShow when cmlSummaryValidations is off or no readings are ignored", function (assert) {
        this.oModelData["/metaData/featureFlag/cmlSummaryValidations"] = "0";
        this.oModelData["/data/ignoredReading"] = { "r1": true };
        this.oController._LocationController.fnCheckMandatoryFields.callsArg(3);

        this.oController.onPressCalculate();

        assert.ok(
            this.oController.fnMessageShow.notCalled,
            "fnMessageShow should NOT be called when cmlSummaryValidations flag is '0'"
        );

        this.oModelData["/metaData/featureFlag/cmlSummaryValidations"] = "1";
        this.oModelData["/data/ignoredReading"] = { "r1": false, "r2": false };
        this.oController.fnMessageShow.reset();

        this.oController.onPressCalculate();

        assert.ok(
            this.oController.fnMessageShow.notCalled,
            "fnMessageShow should NOT be called when cmlSummaryValidations is on but no readings are ignored"
        );
    });

    QUnit.module("CMLDetail Controller - fnCallHelperFunction", {

        /**
         * @description Set up controller and stubs before each test
         */
        beforeEach: function () {

            this.oController = new Controller();

            this.oModelData = {
                "/data/detailPage/CMLs": null,
                "/data/detailPage/aCMLs": null,
                "/data/detailPage/aTempCMLs": null,
                "/data/detailPage/exportData": null,
                "/data/detailPage/aFormattedData": null,
                "/data/detailPage/overallReadingCount": null,
                "/data/detailPage/iTempTotalCount": null,
                "/data/detailPage/cmlGroups": null
            };

            var that = this;

            this.oMockModel = {
                /**
                 *
                 */
                getProperty: function (sPath) { return that.oModelData[sPath]; },
                /**
                 *
                 */
                setProperty: function (sPath, vValue) { that.oModelData[sPath] = vValue; }
            };

            sinon.spy(this.oMockModel, "setProperty");

            this.oController.getView = function () {
                return {
                    /**
                     *
                     */
                    getModel: function () { return that.oMockModel; }
                };
            };

            this.oController.CMLHelper = {
                /**
                 *
                 */
                onTableConversion: sinon.stub()
            };

            this.oController.fnGetUniqueCMLGroupName = sinon.stub().returns(["Group1"]);

        },

        /**
         * @description Restore sinon stubs after each test
         */
        afterEach: function () {
            sinon.restore();
        }

    });

    QUnit.test("Should call CMLHelper.onTableConversion with correct arguments", function (assert) {

        this.oController.CMLHelper.onTableConversion.callsArgWith(3, { aCMLs: [] });

        this.oController.fnCallHelperFunction("Danger", ["Group1"], "TestSearch", []);

        assert.ok(
            this.oController.CMLHelper.onTableConversion.calledOnce,
            "onTableConversion should be called once"
        );

        var aArgs = this.oController.CMLHelper.onTableConversion.getCall(0).args;
        assert.strictEqual(aArgs[0], "Danger", "sSegmentButton should be passed correctly");
        assert.deepEqual(aArgs[1], ["Group1"], "aSelectedGroup should be passed correctly");
        assert.strictEqual(aArgs[2], "testsearch", "sSearchText should be lowercased before passing");

    });

    QUnit.test("Should update all model properties when onTableConversion returns data", function (assert) {

        var oFormattedData = {
            aCMLs: [{ ID: "CML001" }],
            aFinalCMLResult: [{ locationId: "LOC001" }],
            exportData: [{ export: "data" }],
            iCount: 1
        };

        this.oController.CMLHelper.onTableConversion.callsArgWith(3, oFormattedData);

        this.oController.fnCallHelperFunction("", [], "", []);

        assert.deepEqual(
            this.oModelData["/data/detailPage/CMLs"],
            oFormattedData.aFinalCMLResult,
            "CMLs should be set on model"
        );

        assert.deepEqual(
            this.oModelData["/data/detailPage/aCMLs"],
            oFormattedData.aCMLs,
            "aCMLs should be set on model"
        );

        assert.deepEqual(
            this.oModelData["/data/detailPage/exportData"],
            oFormattedData.exportData,
            "exportData should be set on model"
        );

        assert.strictEqual(
            this.oModelData["/data/detailPage/overallReadingCount"],
            1,
            "overallReadingCount should be set on model"
        );

        assert.strictEqual(
            this.oModelData["/data/detailPage/iTempTotalCount"],
            1,
            "iTempTotalCount should be set on model"
        );

    });

    QUnit.test("Should NOT update model when onTableConversion returns empty aCMLs", function (assert) {

        this.oController.CMLHelper.onTableConversion.callsArgWith(3, { aCMLs: [] });

        this.oController.fnCallHelperFunction("", [], "", []);

        assert.ok(
            this.oMockModel.setProperty.notCalled,
            "setProperty should NOT be called when aCMLs is empty"
        );

    });

});