sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/Assignments.controller",
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/json/JSONModel"
], function (
    AssignmentsController,
    sinon,
    JSONModel
) {
    "use strict";

    QUnit.module("Assignments Controller", {
        /**
         * 
         */
        beforeEach: function () {

            this.oController = new AssignmentsController();

        },

        /**
         * 
         */
        afterEach: function () {

            sinon.restore();

        }

    });

    QUnit.test("onAssignFailureDataProfile should open fragment", function (assert) {

        sinon.stub(this.oController, "onOpenAnyFragment");

        this.oController.onAssignFailureDataProfile();

        assert.ok(
            this.oController.onOpenAnyFragment.calledOnce,
            "Fragment opened successfully"
        );

    });

    QUnit.test("onCloseFailureDataProfileDialog should close dialog", function (assert) {

        this.oController.assignFailureDataProfile = {
            close: sinon.spy()
        };

        this.oController.onCloseFailureDataProfileDialog();

        assert.ok(
            this.oController.assignFailureDataProfile.close.calledOnce,
            "Dialog closed successfully"
        );

    });

    QUnit.test("fnGetEquipmentFailurDataProfile should set profile data", function (assert) {

        var oModel = new JSONModel({
            router: {
                arguments: {
                    equipmentId: "EQ1"
                }
            },
            data: {
                assignments: {
                    failureDataProfile: {
                        profileList: []
                    }
                }
            }
        });

        this.oController.getView = function () {

            return {
                /**
                 * 
                 * @returns
                 */
                getModel: function () {
                    return oModel;
                }
            };

        };

        this.oController._oi18n = {
            /**
             * 
             * @returns 
             */
            getText: function () {
                return "Header";
            }
        };

        this.oController.dataSource = {

            /**
             * 
             * @param {String} sEquipmentId 
             * @param {Function} fnSuccess 
             */
            getEquipmentFailurDataLibrary: function (
                sEquipmentId,
                fnSuccess
            ) {

                fnSuccess({
                    "to_failure_data_profiles": [
                        {
                            failureDataProfile: {
                                ID: "FDP1"
                            }
                        }
                    ]
                });

            }

        };

        this.oController.fnGetEquipmentFailurDataProfile();

        var aProfiles = oModel.getProperty(
            "/data/assignments/failureDataProfile/profileList"
        );

        assert.strictEqual(
            aProfiles.length,
            1,
            "Profile list updated"
        );

    });

    QUnit.test("onAssignFailureDataProfileOkPress should show message when all profiles already assigned", function (assert) {

        var oModel = new JSONModel({
            data: {
                detail: {
                    ID: "EQ1"
                },
                etag: "ETAG1",
                assignments: {
                    failureDataProfile: {
                        profileList: [
                            {
                                ID: "FDP1"
                            }
                        ]
                    }
                }
            }
        });

        this.oController.getView = function () {

            return {
                /**
                 * 
                 * @returns
                 */
                getModel: function () {
                    return oModel;
                }
            };

        };

        sinon.stub(sap.ui.core.Fragment, "byId").returns({
            
            /**
             * 
             * @returns 
             */
            getSelectedItems: function () {

                return [
                    {
                        /**
                         * 
                         * @returns 
                         */
                        getBindingContext: function () {

                            return {
                                /**
                                 * 
                                 * @returns 
                                 */
                                getObject: function () {

                                    return {
                                        ID: "FDP1"
                                    };

                                }
                            };

                        }
                    }
                ];

            }

        });

        this.oController._oi18n = {
            /**
             * 
             * @returns 
             */
            getText: function () {
                return "Already Assigned";
            }
        };

        this.oController.fnMessageShow = sinon.spy();

        this.oController.dataSource = {
            updateEquipmentDetail: sinon.spy()
        };

        this.oController.onAssignFailureDataProfileOkPress();

        assert.ok(
            this.oController.fnMessageShow.calledOnce,
            "Information message shown"
        );

        assert.ok(
            this.oController.dataSource.updateEquipmentDetail.notCalled,
            "API not called for duplicate profiles"
        );

    });

    QUnit.test("onFailureDataProfileSelect should enable unassign button", function (assert) {

        var oModel = new JSONModel({
            metadata: {
                enabled: {
                    unassign: false
                }
            }
        });

        this.oController.getView = function () {

            return {
                /**
                 * 
                 * @returns 
                 */
                getModel: function () {
                    return oModel;
                }
            };

        };

        var oEvent = {

            /**
             * 
             * @returns 
             */
            getSource: function () {

                return {
                    /**
                     * 
                     * @returns 
                     */
                    getSelectedItems: function () {
                        return [{}];
                    }

                };

            }

        };

        this.oController.onFailureDataProfileSelect(oEvent);

        assert.strictEqual(
            oModel.getProperty("/metadata/enabled/unassign"),
            true,
            "Unassign button enabled"
        );

    });

    QUnit.test("onUnassignFailureDataProfile should unassign selected profiles", function (assert) {

        var oModel = new JSONModel({
            data: {

                detail: {
                    ID: "EQ1"
                },

                etag: "ETAG1",

                assignments: {

                    failureDataProfile: {

                        profileList: [
                            {
                                ID: "FDP1"
                            },
                            {
                                ID: "FDP2"
                            }
                        ]

                    }

                }

            }
        });

        this.oController.getView = function () {

            return {
                /**
                 * 
                 * @returns 
                 */
                getModel: function () {
                    return oModel;
                }
            };

        };

        this.oController.byId = function () {

            return {
                /**
                 * 
                 * @returns
                 */
                getSelectedItems: function () {

                    return [
                        {
                            /**
                             * 
                             * @returns
                             */
                            getBindingContext: function () {

                                return {

                                    /**
                                     * 
                                     * @returns
                                     */
                                    getObject: function () {

                                        return {
                                            ID: "FDP1"
                                        };

                                    }

                                };

                            }
                        }
                    ];

                }

            };

        };

        this.oController.fnGetEquipmentFailurDataProfile =
            sinon.spy();

        this.oController.fnMessageShow =
            sinon.spy();

        this.oController._oi18n = {
            /**
             * 
             * @returns 
             */
            getText: function () {
                return "Success Message";
            }
        };

        this.oController.dataSource = {

            /**
             * 
             * @param {String} sEquipmentId 
             * @param {object} oPayload 
             * @param {Function} fnSuccess 
             */
            updateEquipmentDetail: function (
                sEquipmentId,
                oPayload,
                fnSuccess
            ) {

                fnSuccess({
                    "@etag": "NEW_ETAG"
                });

            }

        };

        this.oController.onUnassignFailureDataProfile();

        assert.strictEqual(
            oModel.getProperty("/data/etag"),
            "NEW_ETAG",
            "ETag updated"
        );

        assert.ok(
            this.oController
                .fnGetEquipmentFailurDataProfile
                .calledOnce,
            "Profile list refreshed"
        );

        assert.ok(
            this.oController
                .fnMessageShow
                .calledOnce,
            "Success message shown"
        );

    });

    QUnit.test("onSortFailureDataProfile should sort table items", function (assert) {

        var oSortSpy = sinon.spy();

        var oBinding = {
            sort: oSortSpy
        };

        var oTable = {
            /**
             * 
             * @returns 
             */
            getBinding: function () {
                return oBinding;
            }
        };

        this.oController.getView = function () {

            return {
                /**
                 * 
                 * @returns 
                 */
                byId: function () {
                    return oTable;
                }
            };

        };

        this.oController.isFailureDataProfileDescending = false;

        this.oController.onSortFailureDataProfile();

        assert.ok(
            oSortSpy.calledOnce,
            "Sort called successfully"
        );

        assert.strictEqual(
            this.oController.isFailureDataProfileDescending,
            true,
            "Descending flag updated"
        );

    });

    QUnit.test("onSearchFailureDataProfile should filter table and update header", function (assert) {

        var oModel = new JSONModel({
            data: {
                assignments: {
                    failureDataProfile: {
                        profileTableHeader: ""
                    }
                }
            }
        });

        var oFilterSpy = sinon.spy();

        var oBinding = {
            filter: oFilterSpy,
            /**
             * 
             * @returns 
             */
            getLength: function () {
                return 2;
            }
        };

        var oTable = {
            /**
             * 
             * @returns 
             */
            getBinding: function () {
                return oBinding;
            }
        };

        this.oController.getView = function () {

            return {

                /**
                 * 
                 * @returns 
                 */
                getModel: function () {
                    return oModel;
                },

                /**
                 * 
                 * @returns 
                 */
                byId: function () {
                    return oTable;
                }

            };

        };

        this.oController._oi18n = {
            /**
             * 
             * @param {String} sKey
             * @param {*} aArgs
             * @returns 
             */
            getText: function (sKey, aArgs) {
                return "Header " + aArgs[0];
            }
        };

        var oEvent = {

            /**
             * 
             * @returns 
             */
            getSource: function () {

                return {

                    /**
                     * 
                     * @returns 
                     */
                    getValue: function () {
                        return "FDP";
                    }

                };

            }

        };

        this.oController.onSearchFailureDataProfile(oEvent);

        assert.ok(
            oFilterSpy.calledOnce,
            "Filter applied"
        );

        assert.strictEqual(
            oModel.getProperty("/data/assignments/failureDataProfile/profileTableHeader"),
            "Header 2",
            "Header updated correctly"
        );

    });

});