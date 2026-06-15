/*global QUnit*/

sap.ui.define([
    "com/asint/ais/library/helper/Timeline",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function (TimelineHelper, sinon) {
    "use strict";
    /**
     * 
     */
    QUnit.module("Timeline Helper - fnMessageEquipmentObjectsAssign Tests", {
        /**
         * Setup function for the test module
         */
        beforeEach: function () {
            this.oTimelineHelper = new TimelineHelper("https://test.asintais.com/");

            this.oBundle = {
                /**
                 * 
                 */
                getText: function (sKey, aArgs) {
                    if (aArgs) {
                        return sKey + ":" + aArgs.join(",");
                    }
                    return sKey;
                }
            };
            this.oTimelineHelper._oi18n = this.oBundle;
            this.oTimelineHelper._objectName = "TestEquipment";
        },

        /**
         * 
         */
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("fnMessageEquipmentObjectsAssign - when newData is an Array", function (assert) {
        var oTemplate = {
            changes: [],
            header: "",
            text: "",
            navTo: false
        };
        var oLogDetail = [
            {
                field: "child_equipments",
                oldData: null,
                newData: [
                    { displayId: "EQ-001" },
                    { displayId: "EQ-002" }
                ]
            }
        ];

        this.oTimelineHelper.fnMessageEquipmentObjectsAssign(oTemplate, oLogDetail);

        assert.strictEqual(oTemplate.header, "asint.timeline.equipment.update.header:TestEquipment", "Header text should be set correctly");
        assert.ok(oTemplate.navTo, "navTo should be true");
        assert.strictEqual(oTemplate.changes.length, 1, "One change should be recorded");
        assert.strictEqual(oTemplate.changes[0].Description, "Equipment", "Description should be mapped from _oCompositionMaps");
        
        var expectedText = "asint.timeline.equipment.assignUpdate.text:Component(s),TestEquipment\n\nEQ-001, EQ-002\n";
        assert.strictEqual(oTemplate.text, expectedText, "Text should contain comma-separated display IDs");
    });

    /**
     * 
     */
    QUnit.test("fnMessageEquipmentObjectsAssign - when newData is null (safe check)", function (assert) {
        var oTemplate = {
            changes: [],
            header: "",
            text: "",
            navTo: false
        };
        var oLogDetail = [
            {
                field: "child_equipments",
                oldData: null,
                newData: null
            }
        ];

        try {
            this.oTimelineHelper.fnMessageEquipmentObjectsAssign(oTemplate, oLogDetail);
            assert.ok(true, "Executed safely when newData is null");
        } catch (e) {
            assert.ok(false, "Should not throw error when newData is null: " + e.message);
        }

        assert.strictEqual(oTemplate.changes.length, 0, "No changes recorded when newData is null");
    });

    /**
     * 
     */
    QUnit.test("fnMessageEquipmentObjectsAssign - when newData is a non-array truthy value (e.g. string/object)", function (assert) {
        var oTemplate = {
            changes: [],
            header: "",
            text: "",
            navTo: false
        };
        var oLogDetail = [
            {
                field: "child_equipments",
                oldData: null,
                newData: "non-array-string"
            }
        ];

        try {
            this.oTimelineHelper.fnMessageEquipmentObjectsAssign(oTemplate, oLogDetail);
            assert.ok(true, "Executed safely when newData is a string");
        } catch (e) {
            assert.ok(false, "Should not throw error when newData is a string: " + e.message);
        }

        assert.strictEqual(oTemplate.changes.length, 1, "Change is recorded even if newData is a string");
        assert.strictEqual(oTemplate.changes[0].Description, "Equipment", "Description should be mapped correctly");
    });

    /**
     * 
     */
    QUnit.module("Timeline Helper - fnTimeLineHeaderClick Tests", {
        /**
         * 
         */
        beforeEach: function () {
            this.oTimelineHelper = new TimelineHelper("https://test.asintais.com/");
            this.oTimelineHelper.fnNavigatetoRCAAssessment = sinon.stub();
            this.oTimelineHelper.fnNavigatetoAssessment = sinon.stub();
            this.oTimelineHelper.fnNavigatetoEquipment = sinon.stub();
            this.oTimelineHelper.fnNavigatetoFLOC = sinon.stub();
            this.oTimelineHelper.fnNavigatetoRecoAssessment = sinon.stub();
        },
        afterEach: function () {
            sinon.restore();
        }
    });

    QUnit.test("fnTimeLineHeaderClick - Navigates to RCA Assessment when Equipment MDA change exists", function (assert) {
        // Arrange
        var aMockChanges = [
            { Description: "Other Description" },
            { Description: "RCA Assessment" }
        ];
        var oMockEvent = {
            getSource: sinon.stub().returns({
                getAggregation: sinon.stub().withArgs("customData").returns([
                    {
                        getProperty: sinon.stub().withArgs("value").returns({
                            changes: aMockChanges
                        })
                    }
                ])
            })
        };

        // Act
        this.oTimelineHelper.fnTimeLineHeaderClick(oMockEvent, "EQUI");

        // Assert
        assert.ok(this.oTimelineHelper.fnNavigatetoRCAAssessment.calledOnce, "fnNavigatetoRCAAssessment should be called");
        assert.ok(this.oTimelineHelper.fnNavigatetoRCAAssessment.calledWith(aMockChanges), "fnNavigatetoRCAAssessment should be called with correct changes array");
    });
});
