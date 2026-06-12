sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.FailureDataLibrary", {
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
         * Retrieves all failure data profiles list.
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getFailureDataProfileList: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "failureDataProfileList");
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Create failure data profile.
         * @param {Object} oPayload  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        createFailureDataProfile: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createFailureDataProfile");
            var oParam = {};
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Update failure data profile.
         * @param {string} failureDataProfileId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        updateFailureDataProfile: function (failureDataProfileId, oPayload, fnSuccess, fnError, eTag) {
            
            var sUrl = this._baseURI + this.URL["failureDataProfileDetail"];
            var oParam = {
                "failureDataProfileId": failureDataProfileId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
            
        },
        
        /**
         * Function to bulk delete
         * @param {Array} aPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        bulkDeleteFailureDataProfile: function(aPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["failureDataProfileDetailDelete"];

            this.patchData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves failure data profile detail by ID.
         * @param {string} profileId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getFailureDataProfileDetail: function (profileId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["failureDataProfileDetail"];
            var oParam = {
                "failureDataProfileId": profileId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Retrieves the Failure Data template download URL.
         * @param {string} sCategory
         * @param {function} fnSuccess
         */
        getDownloadTemplate: function (sCategory, fnSuccess) {
            var sUrl = this._baseURI + this.URL["downFailureDataExcel"];
            var oParam = {
                "category": sCategory,
                "format": "excel"
            };
            var sNewUrl = this.fnAddParamToURL(sUrl, oParam);
            return fnSuccess(sNewUrl);
        },

        /**
         * Upload Failure Data Excel
         * @param {string} sCategory
         * @param {FileUploader} oFileUploader
         */
        uploadFailureDataExcel: function (sCategory, oFileUploader) {
            var sUrl = this._baseURI + this.URL["uploadFailureDataExcel"];
            sUrl = sUrl.replace("{category}", sCategory);
            oFileUploader.setSendXHR(true);
            oFileUploader.setUseMultipart(true);
            oFileUploader.setUploadUrl(sUrl);
            oFileUploader.upload();
        },
        /**
         * Retrieves code groups by category.
         * @param {string} categoryKey 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        getCodeGroupsByCategory: function (sCategory, oParam, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getCodeGroupsByCategory"];
            var oUrlParam = {
                "category": sCategory,
                "page": oParam.page,
                "size": oParam.size
            };
            var sNewUrl = this.fnAddParamToURL(sUrl, oUrlParam);
            this.getData(sNewUrl, {}, fnSuccess, fnError);
        },
        /**
         * Assign code group to category (PATCH MasterCode)
         * @param {string} masterCodeId
         * @param {Object} oPayload
         * @param {function} fnSuccess
         * @param {function} fnError
         * @param {string} eTag
         */
        assignCodeGroupToCategory: function (masterCodeId, oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this._baseURI + this.URL["assignCodeGroupToCategory"];
            var oParam = {
                ID: masterCodeId
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function to publish Failure Data Profile
         * @param {String} sProfileId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        publishFailureDataProfile: function(sProfileId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["publishFDP"];

            var oParam = {
                profileId: sProfileId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError)
        },

        /**
         * Function to perform a new revision
         * @param {String} sProfileId 
         * @param {Number} iVersion 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        failureDataProfileRevision: function(sProfileId, iVersion, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["fdpNewRevision"];

            var oParam = {
                profileId: sProfileId,
                version: iVersion,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError)
        },

    });

});