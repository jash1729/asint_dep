sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.EventSubscription", {

        _baseURI: "",

        /**
         * Creates a new instance of the object.
         * @param {string} sBaseURI 
         */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
        },

        /**
         * Function fetch all events
         * 
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError    return error callback
         */
        getEvents: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getEvent");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function fetch subscriptions
         * 
         * @param {String} sObjectId
         * @param {String} sEmail
         * @param {String} sObjectType
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError    return error callback
         */
        getSubscriptions: function (sObjectId, sEmail, sObjectType, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getEventSubscriptionWithObjectType");
            var oParam = {
                "objectId": sObjectId,
                "email": sEmail,
                "objectType": sObjectType || ""
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function to create subscription
         * 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError          
         * @param {boolean} isShowBusy 
         */
        createSubscription: function (oPayload, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "createEventSubscription");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, isShowBusy);

        },

        /**
         * Function to update subscription
         * 
         * @param {String} sSubscriptionID 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError          
         * @param {boolean} isShowBusy
         * @param {String} sETag
         */
        updateSubscription: function (sSubscriptionID, oPayload, fnSuccess, fnError, isShowBusy, sETag) {

            var sUrl = this.getUrl(this._baseURI, "updateEventSubscription");
            var oParam = {
                "subscriptionID": sSubscriptionID
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, isShowBusy, sETag);

        },

        /**
         * Retrieves the assessment notifications that has recommendation / findings attached
         * @param {Object} sAssessmentId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getAssessmentNotificationsWithRecoOrFind: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "eventSubscriptionAssessmentNotificationRecoFind");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

    });

});