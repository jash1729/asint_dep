sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.TimelineAPI", {

        _baseURI: "",

        /**
         * Constructor function
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
        },

        /**
         * Function to fetch timeline header details
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTimelineHeader: function (sTimelineId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "timelineHeader");
            var oParam = {
                "timelineId":sTimelineId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to fetch timeline header details
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFavoriteObjects: function (sEmail, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "timelineObjectFavorites");
            var oParam = {
                "sEmail":sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to add object to favorites
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnAddToFavorites: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["addFavroite"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
         * 
         * @param {String} sId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnRemoveFavorite: function (sId, oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["removeFavorite"];
            var oParam = {
                "sFavId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the event subscription.
         * @param {string} sObjectId 
         * @param {string} sEmail
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        fnGetEventSubscription:function(sObjectId, sEmail, fnSuccess, fnError){

            var sUrl = this._baseURI + this.URL["getEventSubscription"];
            var oParam = {
                "objectId": sObjectId,
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
            
        },

        /**
		 * Retrieves all the event.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        fnGetEvent:function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getEvent"];
            this.getData(sUrl,"", fnSuccess, fnError);
        },

        /**
		 * update event sub post.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        updateEventSubsPost:function(oPayload,oSuccess,oError){
            var sUrl = this._baseURI + this.URL["updateEventSubs"];
            this.postData(sUrl, {}, oPayload, oSuccess, oError);
        },

        /**
		 * Update event sub put.
		 * @param {string} objectId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateEventSubsPut:function(oPayload,objectId,eTag,fnSuccess,fnError){
            var sUrl = this._baseURI + this.URL["updateEventSubsPut"];
            var oParam = {
                "objectId": objectId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        }

    });

});