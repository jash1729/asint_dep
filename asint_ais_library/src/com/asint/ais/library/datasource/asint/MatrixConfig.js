sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.MatrixConfig", {
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
		 * Create a new matrix.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createMatrix: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["matrix"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the publish risk matrix.
		 * @param {string} sId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        publishRiskMatrix : function(sId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["riskMatrixPublish"];
            var oParam = {
                "riskmatrixId": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the matrix details.
		 * @param {string} sMatrixId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getMatrixDetail :function(sMatrixId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixDetailExpanded"];
            var oParam = {
                "matrixId": sMatrixId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves all the matrices.
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAllMatrices : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matriDropDown"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Update template detail.
		 * @param {string} sMatrixId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateMatrixDetail : function (sMatrixId, oPayload, fnSuccess, fnError, etag){
            var sUrl = this._baseURI + this.URL["matrixDetail"];
            var oParam = {
                "matrixId": sMatrixId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
		 * Create a new color.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createColor : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixColor"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update color.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateColor:function(sId, oPayload, fnSuccess, fnError, etag){
            var sUrl = this._baseURI + this.URL["matrixColorDetail"];
            var oParam = {
                "id": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
		 * Create a new grid color.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createGridColor : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixGridColor"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Create a new axis.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAxis : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixAxis"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update axis.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateAxis : function(sId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["matrixAxisDetail"];
            var oParam = {
                "id": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Create a new axis line.
		 * @param {Object} sId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAxisLine : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["matrixAxisLines"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update axis line.
		 * @param {string} sId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateAxisLines : function(sId, oPayload, fnSuccess, fnError, etag){
            var sUrl = this._baseURI + this.URL["matrixAxisLinesDetail"];
            var oParam = {
                "id": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, etag);
        },

        /**
		 * Retrieves all the matrix revision.
		 * @param {string} matrixId 
         * @param {string} version
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        matrixRevision:function(matrixId,version,fnSuccess,fnError)
        {  
            var sUrl=this._baseURI+this.URL["matrixRevision"];
            var oParam={
                "riskMatrixId":matrixId,
                "version":version
            };
            this.getData(sUrl,oParam,fnSuccess,fnError);
        }


    });

});