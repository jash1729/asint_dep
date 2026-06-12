sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.PicklistNew", {
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
		 * Retrieves all the picklist.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getPicklist: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklist");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the publish picklist.
         * @param {string} sId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        publishPicklist : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["publishPicklist"];
            var oParam = {
                "picklistId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist ui params.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistUiParams: function (sPicklistId, sObjectTemplateId, sGenericId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiParamByPickListIdObjectTemplateId");
            var oParam = {
                "picklistId" : sPicklistId,
                "objectTemplateId" : sObjectTemplateId,
                "genericId": sGenericId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create picklist ui params.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistUiMapping: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiMapping");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update picklist ui params.
		 * @param {string} sPicklistUiMappingId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistUiMapping: function (sPicklistUiMappingId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiMappingDetail");
            var oParam = {
                "picklistUiMappingId" : sPicklistUiMappingId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the ui mapping picklist by template id.
         * @param {string} sObjectTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getUiMappingPicklistByTemplateId: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiMappingByTemplateId");
            var oParam = {
                "templateId" : sObjectTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the picklist columns.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistColumns: function(sPicklistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistColumnsByPicklistId");
            var oParam = {
                "picklistId" : sPicklistId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create picklist ui param.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistUiParam: function(oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiParam");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update picklist ui param.
		 * @param {string} sPicklistUiParamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistUiParam: function(sPicklistUiParamId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiParamDetail");
            var oParam = {
                "picklistUiParamId" : sPicklistUiParamId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the picklist detail.
         * @param {string} picklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPickListDetail: function (picklistId, fnSuccess, fnError) {

            var that = this;
            var sUrl = this._baseURI + this.URL["picklistDetial"];
            var oParam = {
                "picklistId": picklistId
            };
            that.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create picklist.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPickList: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["createPickList"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update picklist.
		 * @param {string} picklistId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistDetail: function (picklistId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["picklistDetial"];
            var oParam = {
                "picklistId": picklistId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Create picklist column detail.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPickListColumnDetail: function (oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["createPickListColumn"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update picklist column detail.
		 * @param {string} columnId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistColumnDetail:function(columnId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updatePickListColumn"];
            var oParam = {
                "columnId": columnId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError,true, eTag);
        },

        /**
		 * Retrieves the downloaded data.
         * @param {string} picklistId 
		 * @param {string} version
		 * @param {function} fnError 
		 */ 
        getDownloadData: function (picklistId, version, fnSuccess) {
            var sUrl = this._baseURI + this.URL["downPicklistColumnsExcel"];
            var oParam = {
                "picklistId" : picklistId,
                "version": version
            };
            var sNewUrl = this.fnAddParamToURL(sUrl, oParam);
            return fnSuccess(sNewUrl);

        },

        /**
		 * Retrieves the code list data.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCodeListData: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this._baseURI + this.URL["codeListPick"];
            that.getData(sUrl, null, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist revision.
         * @param {string} picklistId 
		 * @param {string} version
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        picklistRevision:function(picklistId,version,fnSuccess,fnError)
        {
            var sUrl=this._baseURI+this.URL["picklistRevision"];
            var param={
                "picklistId":picklistId,
                "version":version
            }
            this.getData(sUrl,param,fnSuccess,fnError);
        },

        /**
		 * Retrieves the matrix revision.
         * @param {string} matrixId 
		 * @param {string} version
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        matrixRevision:function(matrixId,version,fnSuccess,fnError)
        {
            var sUrl=this._baseURI+this.URL["matrixRevision"];
            var param={
                "matrixId":matrixId,
                "version":version
            }
            this.getData(sUrl,param,fnSuccess,fnError);
        },

        /**
		 * Retrieves the picklist list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistList");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the ui picklist.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        fnGetUIPickList: function (sPicklistId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getPicklistDetail");
            var oParam = {
                "picklistId": sPicklistId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the picklist ui params.
         * @param {string} sObjectTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistAllUiParams: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistUiParamByObjectTemplateId");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

		
    });

});