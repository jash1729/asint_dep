/*global QUnit*/

sap.ui.define(
    [
        "comasintaismiequipment/equipment/model/formatter",
        "sap/ui/thirdparty/sinon",
        "sap/ui/thirdparty/sinon-qunit"
    ],
    function (Formatter, sinon) {
        "use strict";

        QUnit.module("formatter", {

            /**
             * before each
             */
            beforeEach: function () {
                this.oFormatter = new Formatter();
            },

            /**
             * after each
             */
            afterEach: function () {
                sinon.restore();
            }
        });

        /**
         * Test formatting of multiple, single, and empty equipment classes.
         */
        QUnit.test("fnFormatEquipmentClass - returns formatted equipment class comma separated", function (assert) {
            assert.expect(3);

            var sClassDetails = JSON.stringify([
                { classDescription: "Class A" },
                { classDescription: "Class B" }
            ]);

            var sResult = this.oFormatter.fnFormatEquipmentClass(sClassDetails);
            assert.strictEqual(sResult, "Class A, Class B", "Multiple classes formatted correctly");

            var sSingleClass = JSON.stringify([
                { classDescription: "Class A" }
            ]);
            var sSingleResult = this.oFormatter.fnFormatEquipmentClass(sSingleClass);
            assert.strictEqual(sSingleResult, "Class A", "Single class formatted correctly");

            var sEmptyResult = this.oFormatter.fnFormatEquipmentClass("");
            assert.strictEqual(sEmptyResult, "", "Empty input returns empty string");
        });

        /**
         * Test formatting of ISO date string fields inside an object.
         */
        QUnit.test("formatDates - formats ISO string date properties of an object", function (assert) {
            assert.expect(2);

            var oTestObject = {
                createdAt: "2026-06-11T12:00:00Z",
                createdBy: "Name",
                someOtherField: "NonDateValue"
            };

            this.oFormatter.formatDates(oTestObject);

            assert.ok(typeof oTestObject.createdAt === "string", "createdAt is formatted to a string");
            assert.ok(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(oTestObject.createdAt), "createdAt matches dd-MM-yyyy HH:mm:ss pattern");
        });

    }
);
