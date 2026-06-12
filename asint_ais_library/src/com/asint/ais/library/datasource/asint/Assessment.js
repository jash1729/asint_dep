sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
    "com/asint/ais/library/datasource/asint/Notification"
], function (Utility, URL, Equipment, FunctionalLocation, Notification) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.Assessment", {

        URL: URL,

        _baseURI: "",

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;
            this.equipmentDataSource = new Equipment(sBaseURI);
            this.functionLocationDataSource = new FunctionalLocation(sBaseURI);
            this.notificationDataSource = new Notification(sBaseURI);

        },

        /**
		 * Retrieves assessment details.
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentDetail: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentDetailExpanded");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
      
        },

        /**
		 * Retrieves assessment notifications.
		 * @param {string} sAssessmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentNotifications: function (sAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assessmentDetailExpandNotification");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves equipment notifications.
		 * @param {string} sEquipmentId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getEquipmentNotifications: function (sEquipmentId, fnSuccess, fnError) {

            this.equipmentDataSource.getAssignedNotifications(sEquipmentId, fnSuccess, fnError);

        },

        /**
		 * Retrieves functional location notifications.
		 * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getFunctionalLocationNotifications: function (sFunctionalLocationId, fnSuccess, fnError) {

            this.functionLocationDataSource.getAssignedNotifications(sFunctionalLocationId, fnSuccess, fnError);

        },

        /**
		 * Creates and assigns a notification to an assessment.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
 		 */
        createAndAssignNotification: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "assessmentDetail");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Updates a notification assignment.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError
		 * @param {string} eTag 
		 */
        updateNotificationAssignment: function (sAssessmentId, oPayload, fnSuccess, fnError, eTag) {

            this.notificationDataSource.updateNotification(sAssessmentId, oPayload, fnSuccess, fnError, eTag);

        },

    });

});