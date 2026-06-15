/*global QUnit*/

sap.ui.define([
    "com/asint/ais/library/utils/Tableconstructor",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (Tableconstructor, JSONModel, sinon) {
    "use strict";

    /**
     *  sets user input data 
     */
    function setUserInput(oTest, oData) {
        oTest.oModel.setProperty("/data/documents/userInput", oData);
        oTest.oModelD.setProperty("/documents/userInput", oData);
    }

    /**
     * 
     */
    function defaultUserInput() {
        return {
            shortDescription: "",
            linkName: "",
            linkValue: "",
            fileObj: null,
            linkVisible: false,
            language: "en",
            category: "OP",
            confidentiality: false,
            phase: "Operation"
        };
    }

    /**
     * module for document and link attachment
     */
    QUnit.module("Tableconstructor - Document Attachment Tests", {
        /**
         * initializes the Tableconstructor instance and stubs external dependencies before each test
         */
        beforeEach: function () {
            this.oModel = new JSONModel({
                data: {
                    documents: {
                        userInput: defaultUserInput(),
                        list: [],
                        attachDocumentsList: [],
                        assessmentInfo: {
                            ID: "test123",
                            "@etag": "etag123"
                        }
                    }
                }
            });

            this.oModelD = new JSONModel({
                documents: {
                    userInput: defaultUserInput()
                },
                metadata: {
                    featureFlag: {
                        genEnableShortDescFieldForAddDoc: "1"
                    }
                }
            });

            

            this.oTableConstructor = new Tableconstructor("https://test.asintais.com/");

            // table-stub
            this.oTableConstructor.oTable = {
                getModel: sinon.stub().returns(this.oModel),
                setModel: sinon.spy()
            };
            this.oTableConstructor.model       = this.oModel;
            this.oTableConstructor.oModelD     = this.oModelD;
            this.oTableConstructor.propPath    = "/data/documents/";
            this.oTableConstructor._inspID     = "test123";
            this.oTableConstructor._app        = "INSP";

            this.oTableConstructor._featureFlagConfig = { openTextEnabled: "0" };

            // stub all external dependencies 
            this.oTableConstructor.formatter = {
                fnPhaseToString: sinon.stub().returns("Operation"),
                fnFormatAttachmentIconBasedOnFileTypeGroup: sinon.stub().returns("sap-icon://document"),
                fnFormatAttachmentIconBasedOnFileType: sinon.stub().returns("sap-icon://document"),
                fnConverbytestoSize: sinon.stub().returns("1 MB")
            };

            this.oTableConstructor.datasource = {
                attachDocument: sinon.stub(),
                attachTempToDocument: sinon.stub(),
                createNew: sinon.stub()
            };

            this.oTableConstructor.getLoggedInUserMail = sinon.stub().returns("test@asint.net");
            this.oTableConstructor.keyToName= sinon.stub().returns("English");
            this.oTableConstructor.keyToCategory = sinon.stub().returns("Operation");
            this.oTableConstructor.getKeysFromPhaseString= sinon.stub().returns("OP");
            this.oTableConstructor.isSupportedFileExtension = sinon.stub().returns(true);
            this.oTableConstructor.validateFields = sinon.stub().returns(true);
            this.oTableConstructor.fnMessageShow = sinon.stub();
            this.oTableConstructor.showSuccessDialog = sinon.stub();
            this.oTableConstructor.attachDocumentToTable= sinon.stub();
            this.oTableConstructor.fnFileUploadCancel = sinon.stub();
            this.oTableConstructor.isValidUrl = sinon.stub().returns(true);

            this.oTableConstructor.fileId = 1;

            if (sap.ui.getCore().getLibraryResourceBundle.restore) {
                sap.ui.getCore().getLibraryResourceBundle.restore();
            }
            
            var oFakeBundle = {
                /**
                 * 
                 */
                getText: function (sKey) { return sKey; }
            };
            sinon.stub(sap.ui.getCore(), "getLibraryResourceBundle").returns(oFakeBundle);
        },


        /**
         * restores all stubs after each test 
         */
        afterEach: function () {
            sinon.restore();
        }

    });

    // fnFileUploadConfrim - length validation here
    QUnit.test("fnFileUploadConfrim - blocks upload when short description exceeds 500 chars", function (assert) {
        setUserInput(this, Object.assign(defaultUserInput(), {
            fileObj: {
                fileName: "test.pdf",
                fileSize: 1024,
                fileType: "application/pdf",
                fileBlob: new Blob(["test"], { type: "application/pdf" })
            },
            linkVisible: false,
            shortDescription: "A".repeat(501)
        }));

        this.oTableConstructor.fnFileUploadConfrim();

        assert.ok(this.oTableConstructor.fnMessageShow.called, "fnMessageShow should be called");
        assert.ok(this.oTableConstructor.fnMessageShow.calledWith("E"), "Error message should be shown");
        assert.ok(!this.oTableConstructor.datasource.createNew.called, "createNew not called — upload blocked");
    });
    
    QUnit.test("fnFileUploadConfrim - calls createNew for file upload", function (assert) {
        setUserInput(this, Object.assign(defaultUserInput(), {
            fileObj: {
                fileName: "test.pdf",
                fileSize: 1024,
                fileType: "application/pdf",
                fileBlob: new Blob(["test"], { type: "application/pdf" })
            },
            linkVisible: false,
            shortDescription: "Custom description",
            
        }));

        this.oTableConstructor.datasource.createNew.callsArgWith(1, { ID: "newDoc123" });
        this.oTableConstructor.datasource.attachTempToDocument.callsArgWith(4, { "@etag": "newEtag" });
        this.oTableConstructor.fnFileUploadConfrim();

        assert.ok(this.oTableConstructor.datasource.createNew.calledOnce, "createNew called");
        assert.strictEqual(this.oTableConstructor.datasource.createNew.getCall(0).args[0].to_description[0].shortDescription,"Custom description","Custom short description passed");

        var metadataFlag = this.oModelD.getProperty("/metadata/featureFlag/genEnableShortDescFieldForAddDoc");
        assert.strictEqual(metadataFlag, "1", "Feature flag genEnableShortDescFieldForAddDoc is enabled");
    });

    // file name when desc is empty
    QUnit.test("fnFileUploadConfrim - uses fileObj.fileName as description when shortDescription is empty", function (assert) {
        setUserInput(this, Object.assign(defaultUserInput(), {
            fileObj: {
                fileName: "test.pdf",
                fileSize: 1024,
                fileType: "application/pdf",
                fileBlob: new Blob(["test"], { type: "application/pdf" })
            },
            linkVisible: false,
            shortDescription: ""
        }));

        this.oTableConstructor.datasource.createNew.callsArgWith(1, { ID: "newDoc123" });
        this.oTableConstructor.datasource.attachTempToDocument.callsArgWith(4, { "@etag": "newEtag" });

        this.oTableConstructor.fnFileUploadConfrim();

        assert.strictEqual(
            this.oTableConstructor.oModelD.getProperty("/documents/userInput/description"),
            "test.pdf",
            "fileObj.fileName used as description when shortDescription is empty"
        );
    });
    
    // link upload success
    QUnit.test("fnFileUploadConfrim - calls attachDocument with linkName as short description", function (assert) {
        setUserInput(this, Object.assign(defaultUserInput(), {
            linkVisible: true,
            linkName: "Test Link",
            linkValue: "https://example.com",
            shortDescription: "Link description", 
        }));

        
        this.oTableConstructor.datasource.attachDocument.callsArgWith(1, { ID: "newDoc123" });
        this.oTableConstructor.datasource.attachTempToDocument.callsArgWith(4, { "@etag": "newEtag" });

        this.oTableConstructor.fnFileUploadConfrim();

        assert.ok(this.oTableConstructor.datasource.attachDocument.calledOnce, "attachDocument called once");
        assert.strictEqual(this.oTableConstructor.datasource.attachDocument.getCall(0).args[0].to_description[0].shortDescription,"Test Link","linkName used as shortDescription in link attachment");
    });

    //link upload bloack - char validation
    QUnit.test("fnFileUploadConfrim - blocks link upload when linkName exceeds 500 characters", function (assert) {
        setUserInput(this, Object.assign(defaultUserInput(), {
            linkVisible: true,
            linkName: "A".repeat(501),
            linkValue: "https://example.com"
        }));

        this.oTableConstructor.fnFileUploadConfrim();

        assert.ok(this.oTableConstructor.fnMessageShow.calledOnce, "fnMessageShow should be called once");
        assert.ok(this.oTableConstructor.fnMessageShow.calledWith("E"), "Error message should be shown");
        assert.ok(!this.oTableConstructor.datasource.attachDocument.called, "attachDocument not called — upload blocked");
    });
});