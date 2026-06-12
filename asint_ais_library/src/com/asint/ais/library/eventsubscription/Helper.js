sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat",
    "com/asint/ais/library/datasource/asint/EventSubscription",
    "sap/m/Popover",
    "sap/m/Text",
    "sap/m/BadgeCustomData"
], function (Formater, ResourceModel, JSONModel, Fragment, MessageToast, Filter, FilterOperator, MessageBox, DateFormat, EventSubscriptionDatasource, Popover, Text, BadgeCustomData) {

    var oEventSubscriptionHelper = Formater.extend("com.asint.ais.library.eventsubscription.Helper", {

        _fnEvent: null,
        _controller: null,
        _triggerButton: {},

        _objectId: "",
        _objectType: "",

        _metadata: {},

        _baseURI: "",

        datasource: {},

        eventListFetched: false,
        eventList: [],

        /**
         * Constructor function
         * 
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {

            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
            this.datasource = new EventSubscriptionDatasource(this._baseURI);
            this.fnLoadEvents();

        },

        /**
         * Clears the current workflow state by resetting key properties to their initial values.
         */
        clear: function () {

            this._fnEvent = null;
            this._controller = null;
            // this._triggerButton = null;
            this._objectId = "";
            this._objectType = "";
            this._metadata = {};

        },

        /**
         * Initialization function
         * 
         * @param {Object} oTriggerButton
         * @param {String} sObjectId
         * @param {String} sObjectType
         * @param {Object} oMetadata
         * @param {Function} fnEvent
         * @param {Object} oController
         */
        init: function (oTriggerButton, sObjectId, sObjectType, oMetadata, fnEvent, oController) {

            if(oTriggerButton) {
                this._triggerButton = oTriggerButton;
            }
            this._fnEvent = fnEvent;
            this._objectId = sObjectId;
            this._objectType = sObjectType;
            this._metadata = oMetadata;
            this._controller = oController;

            var oI18nModel = this.fnGetResourceBundleModel();
            var oData = {
                "objectId": sObjectId,
                "objectType": sObjectType,
                "metadata": oMetadata,
                "button": {
                    "count": 0
                },
                "dialog": {
                    "isBusy": false,
                    "list": [],
                    "subscribeLeadTime": {
                        "title": "",
                        "path": "",
                        "leadTime": null
                    },
                    "detail": {
                        "notificationComplete": {
                            "fetched": false,
                            "title": "",
                            "isBusy": false,
                            "eventPath": "",
                            "list": [],
                            "map": {},
                            "strip": {
                                "visible": false,
                                "message": ""
                            }
                        }
                    }
                },
                "event": {
                    "map": {},
                    "list": []
                },
                "subscription": {
                    "fetched": false,
                    "map": {},
                    "mapByEventId": {},
                    "iSubscribedCount": 0,
                    "list": []
                }
            };

            if (!this._oEventSubscriptionDialog) {
                this._oEventSubscriptionFragmentId = "idEventSubscription" + Number(new Date()).toString();
                Fragment.load({
                    id: this._oEventSubscriptionFragmentId,
                    name: "com.asint.ais.library.eventsubscription.fragment.EventSubscriptionDialog",
                    controller: this
                }).then(function (oDialog) {
                    var oModel = new JSONModel(oData);

                    this._oEventSubscriptionDialog = oDialog;
                    this._oEventSubscriptionDialog.setModel(oModel, "mEventSubscription");
                    this._oEventSubscriptionDialog.setModel(oI18nModel, "i18n");
                    this.fnRefreshSubscription();
                    this.fnConfigureButton();
                }.bind(this));
            } else {
                var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");

                mEventSubscription.setProperty("/", oData);
                this.fnRefreshSubscription();
                this.fnConfigureButton();
            }

        },

        /**
         * Returns library i18n model
         * 
         * @return {object} oResourceModel
         */
        fnGetResourceBundleModel: function () {

            return new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

        },

        /**
         * Handle process that has to be performed on after init
         * 
         */
        fnRefreshSubscription: function () {

            var that = this;
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");

            mEventSubscription.setProperty("/dialog/isBusy", true);
            mEventSubscription.setProperty("/subscription/fetched", false);
            this.fnLoadEvents(function (aEventList) {
                var oEventMap = {};
                var aRelevantEventList = [];
                var sObjectType = mEventSubscription.getProperty("/objectType");
                var bEnableNotification = false;

                aEventList = JSON.parse(JSON.stringify(aEventList));

                for (var i in aEventList) {
                    aEventList[i].allowMultiSubscription = false;

                    if (aEventList[i].relevantFor && aEventList[i].relevantFor.split(",").includes(sObjectType)) {
                        // Notification Completion Specific Changes
                        if (sObjectType === "IDMS" && aEventList[i].eventName === "Notification Completed") {
                            aEventList[i].allowMultiSubscription = true;
                            bEnableNotification = true;
                            that.fnNotificationCompletePreloadNotification();
                        }
                        aEventList[i].subscription = {
                            status: false,
                            leadTime: null,
                            message: "",
                            list: []
                        };
                        aRelevantEventList.push(aEventList[i]);
                    }
                    oEventMap[aEventList[i].ID] = aEventList[i];
                }
                mEventSubscription.setProperty("/event/map", oEventMap);
                mEventSubscription.setProperty("/event/list", aEventList);

                that.fnFetchSubscriptions(bEnableNotification ? "PMNO" : "", function (oSubscription, oSubscriptionByEventId) {
                    for (var j in aRelevantEventList) {
                        var oEvent = aRelevantEventList[j];
                        var aSubscription = oSubscriptionByEventId[oEvent.ID];

                        if (aSubscription) {
                            for (var k in aSubscription) {
                                if (aSubscription[k].deleted === false) {
                                    oEvent.subscription.status = true;
                                    if (!oEvent.allowMultiSubscription) {
                                        oEvent.subscription.leadTime = aSubscription[k].leadTime;
                                    }
                                }
                                oEvent.subscription.list.push(aSubscription[k]);
                            }
                        }
                    }
                    mEventSubscription.setProperty("/dialog/list", aRelevantEventList);
                    mEventSubscription.setProperty("/dialog/isBusy", false);
                    that.fnUpdateSubscribeBadge();

                }, function () {
                    mEventSubscription.setProperty("/dialog/list", aRelevantEventList);
                    mEventSubscription.setProperty("/dialog/isBusy", false);
                    that.fnUpdateSubscribeBadge();
                });
            });

        },

        /**
         * Function to configure trigger button
         * 
         */
        fnConfigureButton: function () {

            var oTriggerButton = this._triggerButton;

            if (oTriggerButton) {
                oTriggerButton.mEventRegistry.press = [];
                oTriggerButton.attachPress(this.open.bind(this));

                if (!oTriggerButton.getBadgeCustomData()) {
                    oTriggerButton.addCustomData(new BadgeCustomData());
                } else {
                    oTriggerButton.getBadgeCustomData().setValue();
                }
            }

        },

        /**
         * Opens the event subscription dialog
         * 
         */
        open: function () {

            if (this._oEventSubscriptionDialog) {
                this._oEventSubscriptionDialog.open();
                this.fnRefreshSubscription();
                this.onNavToInitialPage();
            }

        },

        /**
         * Function to load events
         * 
         * @returns {Object} oEventMap
         */
        fnLoadEvents: function (fnCallback) {

            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            if (this.eventListFetched) {
                if (fnCallback) {
                    fnCallback(this.eventList);
                }
            } else {
                this.datasource.getEvents(function (oResponse) {
                    if (oResponse && oResponse.value) {
                        that.eventListFetched = true;
                        that.eventList = oResponse.value;
                    } else {
                        that.eventListFetched = false;
                        that.eventList = [];
                    }
                    if (fnCallback) {
                        fnCallback(that.eventList);
                    }
                }, function () {
                    that.eventListFetched = false;
                    MessageToast.show(oI18n.getText("asint.eventSubscription.message001"));

                    if (fnCallback) {
                        fnCallback([]);
                    }
                });
            }

        },

        /**
         * Function to fetch subscriptions
         * 
         * @returns {Object} oEventMap
         */
        fnFetchSubscriptions: function (sObjectType, fnSuccess, fnError) {

            var that = this;
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var sEmail = this.getLoggedInUserMail();
            var sObjectId = mEventSubscription.getProperty("/objectId");

            mEventSubscription.setProperty("/subscription/fetched", false);
            this.datasource.getSubscriptions(sObjectId, sEmail, sObjectType, function (oResponse) {
                var oSubscription = {};
                var oSubscriptionByEventId = {};
                // var iSubscribedCount = 0;

                for (var i in oResponse.value) {
                    oSubscription[oResponse.value[i].ID] = oResponse.value[i];

                    if (!oSubscriptionByEventId[oResponse.value[i].attachedEvent_ID]) {
                        oSubscriptionByEventId[oResponse.value[i].attachedEvent_ID] = [];
                    }
                    oSubscriptionByEventId[oResponse.value[i].attachedEvent_ID].push(oResponse.value[i]);
                    if (!oResponse.value[i].deleted) {
                        // iSubscribedCount++;
                    }
                }

                mEventSubscription.setProperty("/subscription/map", JSON.parse(JSON.stringify(oSubscription)));
                mEventSubscription.setProperty("/subscription/mapByEventId", JSON.parse(JSON.stringify(oSubscriptionByEventId)));
                // mEventSubscription.setProperty("/subscription/subscribedCount", iSubscribedCount);
                mEventSubscription.setProperty("/subscription/list", Object.values(oSubscription));
                mEventSubscription.setProperty("/subscription/fetched", true);
                that.fnNotificationCompleteLinkSubscriptions();
                if (fnSuccess) {
                    fnSuccess(oSubscription, oSubscriptionByEventId);
                }
            }, function () {
                mEventSubscription.setProperty("/subscription", {
                    "fetched": false,
                    "map": {},
                    "mapByEventId": {},
                    "list": [],
                    "subscribedCount": 0
                });
                MessageToast.show(oI18n.getText("asint.eventSubscription.message002"));

                if (fnError) {
                    fnError();
                }
            });

        },

        /**
         * Function to perform search
         * 
         * @param {Object} oEvent 
         */
        onSearchLiveChange: function (oEvent) {

            var sQuery = oEvent.getParameter("newValue").toLowerCase();
            var oSubscriptionTable = oEvent.getSource().getParent().getParent();
            var oBinding = oSubscriptionTable.getBinding("items");

            if (sQuery && sQuery.length > 0) {
                var oFilter = new Filter("eventName", FilterOperator.Contains, sQuery);
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }

        },

        /**
         * Function to open lead time popover depends on event type
         * 
         * @param {Object} oEvent 
         */
        onStatusChange: function (oEvent) {

            var oSwitch = oEvent.getSource();
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var oSelectedEventContext = oEvent.getSource().getBinding("state").getContext("mEventSubscription");
            var oEventData = oSelectedEventContext.getObject();
            var sEventPath = oSelectedEventContext.getPath();
            var bState = oEvent.getParameter("state");

            var sObjectId = mEventSubscription.getProperty("/objectId");
            var sObjectType = mEventSubscription.getProperty("/objectType");
            var sEmail = this.getLoggedInUserMail();

            /**
             * Function to update subscription
             * 
             * @param {Boolean} bDeleted 
             * @param {Number} iLeadTime 
             */
            var fnUpdateSubscription = function (bDeleted, iLeadTime) {
                var aSubscription = oEventData.subscription.list;
                var oSubscription = aSubscription.find(function (oItem) {
                    return oItem.objectId === sObjectId && oItem.objectType === sObjectType && oItem.email === sEmail;
                });

                if (oSubscription) {
                    oSubscription.deleted = bDeleted;
                    oSubscription.leadTime = iLeadTime;
                } else {
                    aSubscription.push({
                        "attachedEvent_ID": oEventData.ID,
                        "objectType": sObjectType,
                        "objectId": sObjectId,
                        "email": sEmail,
                        "deleted": bDeleted,
                        "leadTime": iLeadTime
                    });
                    mEventSubscription.setProperty(sEventPath + "/subscription/list", aSubscription);
                }

                console.log(aSubscription);
                // that.fnUpdateSubscribeBadge();
            }

            if (oEventData.allowMultiSubscription) {
                if(oEventData.eventName === "Notification Completed") {
                    this.onNavToDetailPage(oEvent);
                }
            } else {
                if (oEventData.eventType === "DUE_DATE_REMINDER") {
                    if (bState === true) {
                        oSwitch.setState(false);

                        if (!this._oDialogEventSubscriptionLeadTime) {
                            Fragment.load({
                                name: "com.asint.ais.library.eventsubscription.fragment.LeadTimePopover",
                                controller: this
                            }).then(function (oDialog) {
                                this._oEventSubscriptionDialog.addDependent(oDialog);
                                this._oDialogEventSubscriptionLeadTime = oDialog;
                                this._oDialogEventSubscriptionLeadTime.openBy(oSwitch);

                                mEventSubscription.setProperty("/dialog/subscribeLeadTime", {
                                    "title": oEventData.eventName || "",
                                    "path": sEventPath,
                                    "leadTime": 0
                                });
                                mEventSubscription.setProperty(sEventPath + "/subscription/leadTime", 0);
                                fnUpdateSubscription(true, 0);
                            }.bind(this));
                        } else {
                            this._oDialogEventSubscriptionLeadTime.openBy(oSwitch);

                            mEventSubscription.setProperty("/dialog/subscribeLeadTime", {
                                "title": oEventData.eventName || "",
                                "path": sEventPath,
                                "leadTime": 0
                            });
                            mEventSubscription.setProperty(sEventPath + "/subscription/leadTime", 0);
                            fnUpdateSubscription(true, 0);
                        }
                    } else {
                        mEventSubscription.setProperty("/dialog/subscribeLeadTime", {
                            "title": "",
                            "path": "",
                            "leadTime": null
                        });
                        mEventSubscription.setProperty(sEventPath + "/subscription/leadTime", null);
                        fnUpdateSubscription(!bState, null);
                    }
                } else {
                    fnUpdateSubscription(!bState, null);
                }
            }

        },

        /**
         * Function to handle lead time dialog close
         * 
         */
        onLeadTimeDialogOk: function () {

            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var oLeadTimeData = mEventSubscription.getProperty("/dialog/subscribeLeadTime");

            var sObjectId = mEventSubscription.getProperty("/objectId");
            var sObjectType = mEventSubscription.getProperty("/objectType");
            var sEmail = this.getLoggedInUserMail();

            /**
             * Function to update subscription
             * 
             * @param {Boolean} bDeleted 
             * @param {Number} iLeadTime 
             */
            var fnUpdateSubscription = function (bDeleted, iLeadTime) {
                var aSubscription = mEventSubscription.getProperty(oLeadTimeData.path + "/subscription/list");
                var oSubscription = aSubscription.find(function (oItem) {
                    return oItem.objectId === sObjectId && oItem.objectType === sObjectType && oItem.email === sEmail;
                });

                if (oSubscription) {
                    oSubscription.deleted = bDeleted;
                    oSubscription.leadTime = iLeadTime;
                } else {
                    aSubscription.push({
                        "attachedEvent_ID": oEventData.ID,
                        "objectType": sObjectType,
                        "objectId": sObjectId,
                        "email": sEmail,
                        "deleted": bDeleted,
                        "leadTime": iLeadTime
                    });
                    mEventSubscription.setProperty(oLeadTimeData.path + "/subscription/list", aSubscription);
                }

                console.log(aSubscription);
            }

            if (oLeadTimeData.leadTime >= 0) {
                mEventSubscription.setProperty(oLeadTimeData.path + "/subscription/status", true);
                mEventSubscription.setProperty(oLeadTimeData.path + "/subscription/leadTime", oLeadTimeData.leadTime);
                fnUpdateSubscription(false, oLeadTimeData.leadTime);
            }

            if (this._oDialogEventSubscriptionLeadTime) {
                this._oDialogEventSubscriptionLeadTime.close();
            }

        },

        /**
         * Function to handle lead time info press
         * 
         */
        onLeadTimeInfoPress: function (oEvent) {

            var oBadgeCounter = oEvent.getSource().getBadgeCustomData();
            var oSelectedData = oBadgeCounter.getBindingContext("mEventSubscription").getObject();

            if (oSelectedData.subscription.leadTime !== null) {
                var sInfoText = this.fnFormatLeadTimeInfo(oSelectedData.subscription.leadTime);

                if (!this._oPopoverInfo) {
                    this._oPopoverInfo = new Popover({
                        showHeader: false,
                        content: new Text()
                    });
                    this._oPopoverInfo.addStyleClass("sapUiContentPadding");
                }

                var aContent = this._oPopoverInfo.getContent();

                if (aContent.length > 0) {
                    aContent[0].setText(sInfoText);
                } else {
                    this._oPopoverInfo.addContent(new Text({
                        text: sInfoText
                    }));
                }

                this._oPopoverInfo.openBy(oEvent.getSource());
            }

        },

        /**
         * Function to format lead time info
         * @param {Number} iLeadTime 
         * @returns 
         */
        fnFormatLeadTimeInfo: function (iLeadTime) {

            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var sLeadTimeInfo = oI18n.getText("asint.eventSubscription.subscribeDialog.leadTime.info.sameDay.text");

            if (iLeadTime && iLeadTime > 0) {
                sLeadTimeInfo = oI18n.getText("asint.eventSubscription.subscribeDialog.leadTime.info.nDays.text", [iLeadTime]);
            }

            return sLeadTimeInfo;

        },

        /**
         * Function to save subscriptions
         * 
         */
        onSavePress: function () {

            var that = this;
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var aEventSubscription = mEventSubscription.getProperty("/dialog/list");
            var oSavedSubscription = mEventSubscription.getProperty("/subscription/mapByEventId");
            // var sObjectId = mEventSubscription.getProperty("/objectId");
            // var sObjectType = mEventSubscription.getProperty("/objectType");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            // var sEmail = this.getLoggedInUserMail();
            var aSubscriptionToCreate = [], aSubscriptionToUpdate = [];
            var iTotal = 0, iProcessed = 0, iError = 0;

            /**
             * Function to classify payload for create/update
             * 
             * @param {Object} oPayload
             * @return oPayload
             */
            var fnClassifyPayload = function (oPayload) {
                var aSubscription = oSavedSubscription[oPayload.attachedEvent_ID];
                var bCreateNew = true;

                for (var k in aSubscription) {
                    if (oPayload.objectType === aSubscription[k].objectType && oPayload.objectId === aSubscription[k].objectId && oPayload.email === aSubscription[k].email) {
                        bCreateNew = false;
                        if (aSubscription[k].deleted !== oPayload.deleted || aSubscription[k].leadTime !== oPayload.leadTime) {
                            aSubscriptionToUpdate.push((Object.assign(oPayload, {
                                "ID": aSubscription[k].ID,
                                "@etag": aSubscription[k]["@etag"]
                            })));
                        }
                    }
                }

                if (bCreateNew) {
                    aSubscriptionToCreate.push(oPayload);
                }
            }

            /**
             * Function to check async completion of save/update
             */
            var fnComplete = function () {
                iProcessed++;
                if (iTotal === iProcessed) {
                    mEventSubscription.setProperty("/dialog/isBusy", false);

                    if (iError > 0) {
                        that.fnMessageShow("E", oI18n.getText("asint.eventSubscription.message004"), "", function () {
                            that.fnRefreshSubscription();
                            if (that.fnEvent) {
                                that.fnEvent("Failed");
                            }
                        });
                    } else {
                        that.onCancelPress();
                        that.fnRefreshSubscription();
                        MessageToast.show(oI18n.getText("asint.eventSubscription.message003"));
                        if (that.fnEvent) {
                            that.fnEvent("Success");
                        }
                    }
                }
            }

            for (var i in aEventSubscription) {
                var oEvent = aEventSubscription[i];

                for (var l in oEvent.subscription.list) {
                    fnClassifyPayload(oEvent.subscription.list[l]);
                }
            }

            iTotal += aSubscriptionToCreate.length + aSubscriptionToUpdate.length;

            if (iTotal === 0) {
                that.onCancelPress();
                if (that.fnEvent) {
                    that.fnEvent("Success");
                }
            } else {
                mEventSubscription.setProperty("/dialog/isBusy", true);

                for (var j in aSubscriptionToCreate) {
                    var oCreatePayload = aSubscriptionToCreate[j];

                    this.datasource.createSubscription(oCreatePayload, function () {
                        fnComplete();
                    }, function () {
                        iError++;
                        fnComplete()
                    }, false);
                }

                for (var k in aSubscriptionToUpdate) {
                    var oUpdatePayload = aSubscriptionToUpdate[k];

                    this.datasource.updateSubscription(oUpdatePayload.ID, oUpdatePayload, function () {
                        fnComplete();
                    }, function () {
                        iError++;
                        fnComplete()
                    }, false, oUpdatePayload["@etag"]);
                }
            }

        },

        /**
         * Function to close event subscription dialog
         * 
         */
        onCancelPress: function () {

            if (this._oEventSubscriptionDialog) {
                this._oEventSubscriptionDialog.close();
            }

        },

        /**
         * Function to nav to detail page
         * 
         * @param {Object} oEvent 
         */
        onNavToDetailPage: function (oEvent) {

            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var oEventData = oEvent.getSource().getBindingContext("mEventSubscription").getObject();
            var sEventPath = oEvent.getSource().getBindingContext("mEventSubscription").getPath();

            if (oEventData.allowMultiSubscription && oEventData.eventName === "Notification Completed") {
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/title", oEventData.eventName);
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/eventPath", sEventPath);
                this.fnEventSubscriptionDialogPageNav("idEventSubscriptionNotificationComplete");
            }

        },

        /**
         * Function to perform search
         * 
         * @param {Object} oEvent 
         */
        onSearchNotificationComplete: function (oEvent) {

            var sQuery = oEvent.getParameter("newValue").toLowerCase();
            var oTable = oEvent.getSource().getParent().getParent();
            var oBinding = oTable.getBinding("items");

            if (sQuery && sQuery.length > 0) {
                oBinding.filter(new Filter({
                    filters: [
                        new Filter("shortDescription", FilterOperator.Contains, sQuery),
                        new Filter("displayId", FilterOperator.Contains, sQuery),
                        new Filter("priority", FilterOperator.Contains, sQuery),
                        new Filter("status", FilterOperator.Contains, sQuery),
                        new Filter("type", FilterOperator.Contains, sQuery)
                    ],
                    and: false
                }));
            } else {
                oBinding.filter([]);
            }

        },

        /**
         * Function to load assessment notification
         * 
         * @param {Function} fnCallback 
         */
        fnNotificationCompletePreloadNotification: function (fnCallback) {

            var that = this;
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var sObjectId = mEventSubscription.getProperty("/objectId");
            var sObjectType = mEventSubscription.getProperty("/objectType");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            mEventSubscription.setProperty("/dialog/detail/notificationComplete/fetched", false);

            if (sObjectType === "IDMS") {
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/isBusy", true);
                this.datasource.getAssessmentNotificationsWithRecoOrFind(sObjectId, function (oResponse) {
                    var oNotificationMap = {};

                    oResponse.to_notification.forEach(function (oItem) {
                        var oAssessementRecommendation = oItem && oItem.notification ? oItem.notification.to_assessment_recommendation : null;
                        var aFindings = oItem && oItem.notification ? oItem.notification.findings : [];

                        if(oItem.notification && (oItem.notification.to_assessment_recommendation_ID || (aFindings && aFindings.length > 0))) {
                            var oDescription = that.fnGetDescriptionFromResponse(oItem.notification.to_description);
                            var oNotification = Object.assign({
                                ID: oItem.notification.ID,
                                displayId: oItem.notification.displayId,
                                priority: oItem.notification.priority,
                                status: oItem.notification.status,
                                type: oItem.notification.type,
                                subscriptionStatus: false,
                                generatedFrom: "",
                                generatedFromTitle: "",
                                generatedFromDesc: ""
                            }, oDescription);

                            
                            if(oItem.notification.findings) {                                
                                if(aFindings.length > 0) {
                                    oNotification.generatedFrom = "FIND";
                                    
                                    for(var i = 0 ; i < aFindings.length; i++) {
                                        if(oNotification.generatedFromTitle) {
                                            oNotification.generatedFromTitle += ", " + aFindings[i].findingDetails.displayId;
                                        } else {
                                            oNotification.generatedFromTitle += aFindings[i].findingDetails.displayId;
                                        }
                                        // oNotification.generatedFromDesc += oNotification.generatedFromDesc ? (", " + aFindings[i].findingDetails.number) : "";
                                    }
                                }
                            } else if(oAssessementRecommendation && oAssessementRecommendation.recommendation) {
                                var oRecommendation = oAssessementRecommendation.recommendation;
                                oNotification.generatedFrom = "RECO";
                                oNotification.generatedFromTitle = oRecommendation.displayId;
                                oNotification.generatedFromDesc = oRecommendation.to_description && oRecommendation.to_description.shortDescription || "";
                            }
                            oNotificationMap[oItem.notification.ID] = oNotification;
                        }
                    });
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/list", Object.values(oNotificationMap));
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/map", oNotificationMap);
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/isBusy", false);
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/fetched", true);
                    that.fnNotificationCompleteLinkSubscriptions();
                }, function () {
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/list", []);
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/map", {});
                    mEventSubscription.setProperty("/dialog/detail/notificationComplete/isBusy", false);
                    MessageToast.show(oI18n.getText("asint.eventSubscription.message005"));
                    if (fnCallback) {
                        fnCallback();
                    }
                });
            } else {
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/list", []);
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/map", {});
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/isBusy", false);
                if (fnCallback) {
                    fnCallback();
                }
            }

        },

        /**
         * Function to set subscrition status for notification
         * 
         * @param {Function} fnCallback 
         */
        fnNotificationCompleteLinkSubscriptions: function (fnCallback) {

            var that = this;
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var bSubscriptionFetched = mEventSubscription.getProperty("/subscription/fetched");
            var bNotificationCompleteFetched = mEventSubscription.getProperty("/dialog/detail/notificationComplete/fetched");

            if (bSubscriptionFetched && bNotificationCompleteFetched) {
                var aSubscription = mEventSubscription.getProperty("/subscription/list");
                var oNotificatonMap = mEventSubscription.getProperty("/dialog/detail/notificationComplete/map");

                for (var j in aSubscription) {
                    if (oNotificatonMap[aSubscription[j].objectId]) {
                        oNotificatonMap[aSubscription[j].objectId].subscriptionStatus = !aSubscription[j].deleted;
                    }
                }

                mEventSubscription.setProperty("/dialog/detail/notificationComplete/map", oNotificatonMap);
                mEventSubscription.setProperty("/dialog/detail/notificationComplete/list", Object.values(oNotificatonMap));
                that.fnUpdateNotificationCompleteEventInList(function () {
                    that.fnUpdateSubscribeBadge();
                });
                if (fnCallback) {
                    fnCallback();
                }
            }

        },

        /**
         * Function to update status for events ( notification )
         * 
         * @param {Function} fnCallback 
         */
        fnUpdateNotificationCompleteEventInList: function (fnCallback) {

            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var aEventSubscription = mEventSubscription.getProperty("/dialog/list");
            var bSubscriptionFetched = mEventSubscription.getProperty("/subscription/fetched");
            var bNotificationCompleteFetched = mEventSubscription.getProperty("/dialog/detail/notificationComplete/fetched");
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            if (bSubscriptionFetched && bNotificationCompleteFetched) {
                var oNotificationMap = mEventSubscription.getProperty("/dialog/detail/notificationComplete/map");
                var aNotificationList = mEventSubscription.getProperty("/dialog/detail/notificationComplete/list");
                var oNotificationStrip = mEventSubscription.getProperty("/dialog/detail/notificationComplete/strip");
                var iSubscribedNotification = 0;

                for (var i in aEventSubscription) {
                    if (aEventSubscription[i].eventName === "Notification Completed") {
                        var bStatus = false;
                        var aSubscription = aEventSubscription[i].subscription.list;
                        var iSubscriptionCount = 0;

                        for (var j in aSubscription) {
                            if (aSubscription[j].ID) {
                                if (oNotificationMap[aSubscription[j].objectId] && !aSubscription[j].deleted) {
                                    bStatus = true;
                                }
                            } else {
                                if (!aSubscription[j].deleted) {
                                    bStatus = true;
                                }
                            }
                            if(!aSubscription[j].deleted && oNotificationMap[aSubscription[j].objectId]) {
                                iSubscriptionCount++;
                            }
                        }
                        aEventSubscription[i].subscription.status = bStatus;
                        aEventSubscription[i].subscription.message = iSubscriptionCount || "";
                    }
                }

                for(var k in aNotificationList) {
                    if(aNotificationList[k].subscriptionStatus) {
                        iSubscribedNotification++;
                    }
                }

                oNotificationStrip.visible = iSubscribedNotification > 0;
                oNotificationStrip.message = oI18n.getText("asint.eventSubscription.message006", [iSubscribedNotification, aNotificationList.length]);

                mEventSubscription.setProperty("/dialog/detail/notificationComplete/strip", oNotificationStrip);
            }

            mEventSubscription.setProperty("/dialog/list", aEventSubscription);
            if (fnCallback) {
                fnCallback();
            }

        },

        /**
         * Function to handle event button badge counter
         */
        fnUpdateSubscribeBadge: function () {

            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var aEventSubscription = mEventSubscription.getProperty("/dialog/list");
            var oNotificationMap = mEventSubscription.getProperty("/dialog/detail/notificationComplete/map");
            var bSubscriptionFetched = mEventSubscription.getProperty("/subscription/fetched");
            // var bNotificationCompleteFetched = mEventSubscription.getProperty("/dialog/detail/notificationComplete/fetched");
            var sObjectId = mEventSubscription.getProperty("/objectId");
            var iSubscribedCount = 0;

            if (bSubscriptionFetched) {
                for (var i in aEventSubscription) {
                    for (var j in aEventSubscription[i].subscription.list) {
                        var oSubscription = aEventSubscription[i].subscription.list[j];

                        if (oSubscription.objectType === "PMNO") {
                            if(sObjectId === oSubscription.objectId && !oSubscription.deleted) {
                                iSubscribedCount++;
                            } else if (oNotificationMap[oSubscription.objectId] && !oSubscription.deleted) {
                                iSubscribedCount++;
                            }
                        } else {
                            if (!oSubscription.deleted) {
                                iSubscribedCount++;
                            }
                        }
                    }
                }
            }

            if (this._triggerButton) {
                if (this._oEventSubscriptionDialog) {
                    if (this._triggerButton.getBadgeCustomData()) {
                        this._triggerButton.getBadgeCustomData().setValue(iSubscribedCount);
                    }
                }
            }

        },

        /**
         * Function to nav to initial page
         */
        onNavToInitialPage: function () {

            this.fnEventSubscriptionDialogPageNav("idEventSubscriptionList");

        },

        /**
         * Handles event subscription dialog page navigation
         * @param {String} sPageId 
         */
        fnEventSubscriptionDialogPageNav: function (sPageId) {

            var oNavContainer = sap.ui.getCore().byId(sap.ui.core.Fragment.createId(this._oEventSubscriptionFragmentId, "idEventSubscriptionNavContainer"));
            var oPage = sap.ui.getCore().byId(sap.ui.core.Fragment.createId(this._oEventSubscriptionFragmentId, sPageId));

            if (oNavContainer && oPage) {
                oNavContainer.to(oPage);
            }

        },

        /**
         * Function to handle notification subscription event
         * 
         * @param {Object} oEvent 
         */
        onNotificationSubscriptionChange: function (oEvent) {

            var that = this;
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var oSelectedContext = oEvent.getSource().getBinding("state").getContext("mEventSubscription");
            var oNotificationData = oSelectedContext.getObject();
            var sEventPath = mEventSubscription.getProperty("/dialog/detail/notificationComplete/eventPath");
            var oEventData = mEventSubscription.getProperty(sEventPath);
            var bState = oEvent.getParameter("state");
            var sEmail = this.getLoggedInUserMail();

            /**
             * Function to update subscription
             * 
             * @param {String} sObjectId
             * @param {String} sObjectType
             * @param {Boolean} bDeleted
             * @param {Number} iLeadTime 
             */
            var fnUpdateSubscription = function (sObjectId, sObjectType, bDeleted, iLeadTime) {
                var aSubscription = mEventSubscription.getProperty(sEventPath + "/subscription/list");
                var oSubscription = aSubscription.find(function (oItem) {
                    return oItem.objectId === sObjectId && oItem.objectType === sObjectType && oItem.email === sEmail;
                });

                if (oSubscription) {
                    oSubscription.deleted = bDeleted;
                    oSubscription.leadTime = iLeadTime;
                } else {
                    aSubscription.push({
                        "attachedEvent_ID": oEventData.ID,
                        "objectType": sObjectType,
                        "objectId": sObjectId,
                        "email": sEmail,
                        "deleted": bDeleted,
                        "leadTime": iLeadTime
                    });
                    mEventSubscription.setProperty(sEventPath + "/subscription/list", aSubscription);
                }
                console.log(aSubscription);
                that.fnUpdateNotificationCompleteEventInList();
            }

            fnUpdateSubscription(oNotificationData.ID, "PMNO", !bState, null);

        },

        /**
         * Function to handle select/deselect all on notification table selection
         * 
         * @param {String} sAction 
         */
        onNotificationCompleteSelection: function(sAction) {

            var that = this;
            var bState = sAction === "select";
            var mEventSubscription = this._oEventSubscriptionDialog.getModel("mEventSubscription");
            var aNotificationList = mEventSubscription.getProperty("/dialog/detail/notificationComplete/list");
            var sEventPath = mEventSubscription.getProperty("/dialog/detail/notificationComplete/eventPath");
            var oEventData = mEventSubscription.getProperty(sEventPath);
            var aSubscription = mEventSubscription.getProperty(sEventPath + "/subscription/list");
            var sEmail = this.getLoggedInUserMail();

            /**
             * Function to update subscription
             * 
             * @param {String} sObjectId
             * @param {String} sObjectType
             * @param {Boolean} bDeleted
             * @param {Number} iLeadTime 
             */
            var fnUpdateSubscription = function (sObjectId, sObjectType, bDeleted, iLeadTime) {
                var oSubscription = aSubscription.find(function (oItem) {
                    return oItem.objectId === sObjectId && oItem.objectType === sObjectType && oItem.email === sEmail;
                });

                if (oSubscription) {
                    oSubscription.deleted = bDeleted;
                    oSubscription.leadTime = iLeadTime;
                } else {
                    aSubscription.push({
                        "attachedEvent_ID": oEventData.ID,
                        "objectType": sObjectType,
                        "objectId": sObjectId,
                        "email": sEmail,
                        "deleted": bDeleted,
                        "leadTime": iLeadTime
                    });
                }
                
            }

            for(var i in aNotificationList) {
                aNotificationList[i].subscriptionStatus = bState;
                fnUpdateSubscription(aNotificationList[i].ID, "PMNO", !bState, null);
            }

            mEventSubscription.setProperty("/dialog/detail/notificationComplete/list", aNotificationList);
            mEventSubscription.setProperty(sEventPath + "/subscription/list", aSubscription);

            console.log(aSubscription);
            that.fnUpdateNotificationCompleteEventInList();

        },

        /**
         * Function to get subscribed notification count for selected event
         *  
         * @param {Array} aSubscriptionList
         */
        fnGetSubscribedNotificationCount: function(aSubscriptionList) {
            
            var iCount = 0;

            if(aSubscriptionList) {
                for(var i in aSubscriptionList) {
                    if(!aSubscriptionList[i].deleted) {
                        iCount++;
                    }
                }
            }

            return iCount;

        }

    });

    return oEventSubscriptionHelper;

});
