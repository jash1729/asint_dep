sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.EndUserNotification", {
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
		 * Update assessment.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateAssesment: function (oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["updatenotification"];
            var oParam = {
                "notificationID": oPayload.ID
            }
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Creates assessment.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        assignAssesment: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["createNotification"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the assessment .
         * @param {string} ID 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssessment: function(ID, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["updatenotification"] + "?$expand=to_assessment($filter=deleted eq false;$expand=assessment($expand=to_description,to_assessmentTemplate($expand=to_description),to_maintenanceOrderAssessment($expand=maintenanceOrderMaster),to_maintenanceOrderInspection($expand=maintenanceOrderMaster),to_notification($expand=notification)))";
            var oParam = {
                "notificationID": ID
            }
            this.getData(sUrl, oParam, fnSuccess, fnError); 
        },

        /**
        * Retrieves the linked recommendations
        * 
        * @param {string} sNotificationId 
        * @param {function} fnSuccess
        * @param {function} fnError 
        */
        getNotificationRecommendation: function (sNotificationId, fnSuccess, fnError) {
            var that = this;
            var sGetNotiRecoUrl = this.getUrl(this._baseURI, "getNotificationRecommendation");
            var oNotiRecoParam = {
                "notificationId": sNotificationId
            }

            this.getData(sGetNotiRecoUrl, oNotiRecoParam, function(oNotificationResponse) {
                var sAssessmentId = "";
                var oRecommendationData = oNotificationResponse.apmRecommendation || oNotificationResponse.recommendation;

                if(oRecommendationData) {
                    var oEquiFlocMap = {};

                    if(Array.isArray(oRecommendationData.equipment_map)) {
                        if(oRecommendationData.equipment_map.length > 0) {
                            oEquiFlocMap = oRecommendationData.equipment_map[0];
                        }
                    } else if(oRecommendationData.equipment_map) {
                        oEquiFlocMap = oRecommendationData.equipment_map;
                    }

                    if(Array.isArray(oRecommendationData.location_map)) {
                        if(oRecommendationData.location_map.length > 0) {
                            oEquiFlocMap = oRecommendationData.location_map[0];
                        }
                    } else if(oRecommendationData.location_map) {
                        oEquiFlocMap = oRecommendationData.location_map;
                    }

                    if(oEquiFlocMap.assessment) {
                        sAssessmentId = oEquiFlocMap.assessment.ID;

                        var sGetAssessmentDetailUrl = that.getUrl(that._baseURI, "assessmentDetailForNotification");
                        var oAssessmentParam = {
                            "assessmentId": sAssessmentId
                        };

                        that.getData(sGetAssessmentDetailUrl, oAssessmentParam, function (oAssessmentResponse) {
                            oEquiFlocMap.assessment = oAssessmentResponse;
                            fnSuccess(oNotificationResponse);
                        }, fnError);
                    }
                }

                if(!sAssessmentId) {
                    fnSuccess(oNotificationResponse);
                }
            }, fnError);
        },

        /**
        * Retrieves the linked recommendations
        * 
        * @param {string} sNotificationId 
        * @param {function} fnSuccess
        * @param {function} fnError 
        */
        getLinkedRecommendations: function (sNotificationId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getNotificationRecommendation");
            var oParam = {
                "notificationId": sNotificationId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Fetch Notification Types (NTTP) from S4Master
         * @param {function} fnSuccess - Callback for success
         * @param {function} fnError - Callback for error
         */
        getNotificationTypes: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getNotificationTypes");
            
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

    });

});