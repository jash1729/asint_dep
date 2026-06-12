sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL",
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.Notification", {

        URL: URL,

        _baseURI: "",

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;

        },

        /**
		 * Retrieves the notification.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        fetchNotification: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "flpUnreadNotificationRead");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Update event notification.
		 * @param {string} sNotificationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateEventNotification: function (sNotificationId, oPayload, fnSuccess, fnError, sEtag) {

            var sUrl = this.getUrl(this._baseURI, "flpEventNotificationUpdate");
            var oParam = {
                "notificationId": sNotificationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, sEtag);

        },

        /**
		 * Retrieves the event notification.
         * @param {string} sNotificationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        fetchEventNotification: function (sNotificationId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "flpEventNotificationUpdate");
            var oParam = {
                "notificationId": sNotificationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
        * Get Document Details - Detail
        * 
        * @param {String} sDocumentId    - ID of the document
        * @param {Function} fnSuccess  - Success Callback function
        * @param {Function} fnError    - Error Callback function
        */
        fnGetDocumentDetail: function (sDocumentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "documentDetailDesc");
            var oParam = {
                "sDocId": sDocumentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

    });

});