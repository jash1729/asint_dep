sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.MobileAdmin", {

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
		 * Retrieves all the data.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAllData: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getAllData"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves Country code data.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getCountryInfo: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getCountryInfo"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the role data.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRoleData: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["userRole"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the users list.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getUsersList: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getUsersList"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the role collection.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getRoleCollection: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getRoleCollection"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Create a new user with phone no.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        mapUserWithPhoneNumber: function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["createUser"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Deactivate user.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        deactivateUser: function (oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["deactivateUser"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Delete user.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        deleteUser: function (oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["deleteUser"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Function to fetch mobile users count
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getMobileUsersCount : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getUsersList"];
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Function to fetch mobile users count
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getUsersLocationAccess : function(sEmail, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getUserLocationAccess"];
            sUrl = sUrl + "&$filter=deleted eq false and email eq '" + sEmail + "'";
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Function to fetch mobile users count
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getUsersLocationAccessUpdatedUsingRest : function(sEmail, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getUserLocationAccessUsingRest"];
            var oParam = {
                "sMail": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Get functional location access
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getFLocationAccess: function(fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getFunctionalLocation"];
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
    
        /**
           * GetFunctionalLocation
           * @param {*} fnSuccess 
           * @param {*} fnError 
           */
        getFunctionalLocationSkip: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getFunctionalLocationSkip"];
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * 
		 * @param {Object} oPayload 
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        assignAccesstoUser: function (oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getUserLocationAccess"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * 
		 * @param {String} sId 
		 * @param {Object} oPayload 
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 * @param {String} eTag 
		 */
        updateUserLocationAccess: function (sId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["updateUserLocationAccess"];
            var oParam = {
                "sId": sId
            };

            //this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
            this.deleteData(sUrl, oParam, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Function to fetch s4 configuration object detail based on ID
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        fetchS4ConigObjectDetail : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getS4ConigObjectDetail"];
            var oParam = {
                "sObjectId":sId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        // /**
        //  * Function to assign user access
        //  * @param {Object} oPayload 
        //  * @param {Function} fnSuccess 
        //  * @param {Function} fnError 
        //  */
        // assignAccesstoUser: function (oPayload, fnSuccess, fnError){
        //     var sUrl = this._baseURI + this.URL["assignLoationAccess"];
        //     this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        // },

        // /**
        //  * Function to unassign user access
        //  * @param {Object} oPayload 
        //  * @param {Function} fnSuccess 
        //  * @param {Function} fnError 
        //  */
        // unassignAccesstoUser: function (oPayload, fnSuccess, fnError){
        //     var sUrl = this._baseURI + this.URL["unassignLocation"];
        //     this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        // },
    })
})