sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/URL"
], function (Common, URL) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.SIL", {

        _baseURI: "",

        _cacheConfig: {
            enable: true,
            type: "local",
            ttl: 1440,
            key: ""
        },

        _cacheAssessmentTemplateKey: "",
        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
        },

        URL: URL,

        /**
         * Function to create SIL Assessment
         * @param {Object} aPayload 
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        createSilAssessment: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createSilAssessment");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * Function to get SIL Assessment
         * @param {function} fnSuccess
         * @param {function} fnError
         */
        getSilAssessmentTemplate: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getSilAssessmentTemplate");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
         * Get SIL Assessment Details
         *
         * @param {String} silAssessmentId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getSilAssessmentDetails: function (silAssessmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentDetails");

            var oParam = {
                "sSilAssessmentId": silAssessmentId
            };

       
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getMappingData : function(fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getMappingData");
       
            this.getData(sUrl,"", fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {*} aPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        createGeneralSectionSelection: function (aPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generalSectionSelection");
            this.postData(sUrl, {}, aPayload, fnSuccess, fnError, true);
        },

        /**
         * 
         * @param {*} sAssessmentId 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        getGeneralSectionSelection: function (sAssessmentId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "generalSectionSelection");
            var sFilter = "?$filter=assessmentId eq '" + sAssessmentId + "'";
            this.getData(sUrl + sFilter, {}, fnSuccess, fnError, true);
        },
    
        /**
         * Retrieves the object template with classes.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getObjectTemplates: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "silTemplateObjectTemplates");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "silTemplateObjectTemplates"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the object template with classes.
         * @param {string} sObjectTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getObjectTemplateExpanded: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplateExpanded");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: sObjectTemplateId
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the section data.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentTemplateSectionsExpand");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "silAssessmentTemplateSectionsExpand"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the subsection data.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getSubSections: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentTemplateSubSections");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "silAssessmentTemplateSubSections"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the template algorithm.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getTemplateAlgorithmV2: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getAssessmentAlgorithmV2");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getAssessmentAlgorithmV2"
            });

            this.getData(sUrl, oParam, function(oResponse) {
                fnSuccess([oResponse]);
            }, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the picklist mapping.
         * @param {string} sTemplateId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getPicklistMapping: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentPicklistMapping");
            var oParam = {
                "templateId": sTemplateId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "silAssessmentPicklistMapping"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Retrieves the picklist.
         * @param {string} sPicklistId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getPicklist: function (sPicklistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentPicklistExpand");
            var oParam = {
                "picklistId": sPicklistId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: sPicklistId
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, false, oCacheConfig);

        },

        /**
		 * Retrieves the characteristics by class id.
         * @param {string} sClassId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */        
        getArithmeticExpLookup : function(sTempId, fnSuccess, fnError){
			
            var sUrl = this.getUrl(this._baseURI, "getArithmeticExpLookup");
            var oParam = {
                "sTemplateId": sTempId
            };
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: this._cacheAssessmentTemplateKey ? true : false,
                key: this._cacheAssessmentTemplateKey + "_" + "getArithmeticExpLookup"
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {boolean} isShowBusy 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getAssessmentValues: function (sAssessmentId, fnSuccess, fnError, isShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentValues");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true)

        },

        /**
         * Retrieves the assessment values.
         * @param {string} sAssessmentId
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        addAssessmentValues: function (sAssessmentId, oPayload,fnSuccess,fnError) {

            var sUrl = this.getUrl(this._baseURI, "silAssessmentValues");
            var oParam = {
                "assessmentId": sAssessmentId
            };

            this.postData(sUrl,oParam,oPayload,fnSuccess, fnError, true);
        },
         /**
         * 
         * @param {*} aPayload 
         * @param {*} fnSuccess 
         * @param {*} fnError 
         */
        updateGeneralSectionSelection: function (oPayload, sId, fnSuccess, fnError,etag) {

            var sUrl = this.getUrl(this._baseURI, "updateGeneralSectionSelection");

            var oParam = {
                ID: sId  
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true,etag);
        },
        
        /**
         * Function to fetch equipment names in batch
         * @param {Array} aIds
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getEquipmentNames: function (aIds, fnSuccess, fnError) {
            var sFilter = "ID in (" + aIds.join(",") + ")";

            var sUrl = this.getUrl(this._baseURI, "equipmentNames") + sFilter;

            this.getData(sUrl,{},fnSuccess,fnError);
        },

    });
});