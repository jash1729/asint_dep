sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.ObjectHierarchy", {

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
         * Function fetch the hierarchy
         * @param {String} sEmail  contains email of user 
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError     return error callback
         */
        getHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function fetch the ancestors
         * @param {String} sObjectId 
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError     return error callback
         */
        getAncestors: function (sObjectId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "hierarchyGetAncestors");
            var oParam = {
                "objectId": sObjectId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function fetch the children
         * @param {String} sObjectId 
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError     return error callback
         */
        getChildren: function (sObjectId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "hierarchyGetChildren");
            var oParam = {
                "objectId": sObjectId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function fetch the assignments
         * @param {String} sEmail 
         * @param {Function} fnSuccess  returns success callback
         * @param {Function} fnError     return error callback
         */
        getAssignments: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "hierarchyGetAssignments");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        }

    });

});