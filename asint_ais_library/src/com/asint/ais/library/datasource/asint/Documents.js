sap.ui.define([
    "com/asint/ais/library/datasource/asint/Common"
], function (Common) {
    "use strict";

    return Common.extend("com.asint.ais.library.datasource.asint.Documents", {

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
         * Get Document Details - Detail Desc
         * 
         * @param {String} sDocId    - ID of the document
         * @param {Function} fnSuccess  - Success Callback function
         * @param {Function} fnError    - Error Callback function
         */
        fnFetchDocumentDetailDesc: function (sDocId, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["documentDetailDesc"];
            var oParam = {
                "sDocId": sDocId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * update Document Details
         * 
         * @param {String} sDocId    - ID of the document
         * @param {Function} fnSuccess  - Success Callback function
         * @param {Function} fnError    - Error Callback function
         * @param {String} eTag - eTag of the document
         */
        updateDocumentDetailDesc: function (sDocId, oPayload, fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["documentDetailDesc"];
            var oParam = {
                "sDocId": sDocId,
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Function that fetch equipment data
         * @param {String} documentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquiData: function (documentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getAttachedEquiAssessment"];
            var oParam = {
                "docId": documentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function that fetch functional location data
         * @param {String} documentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFlocData: function (documentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getAttachedFlocAssessment"];
            var oParam = {
                "docId": documentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function that fetch inspection data
         * @param {String} documentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getInspData: function (documentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getAttachedIdmsAssessment"];
            var oParam = {
                "docId": documentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function that fetch stratergy data
         * @param {String} documentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAsdData: function (documentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getAttachedAsdAssessment"];
            var oParam = {
                "docId": documentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function that fetch maintenance order data
         * @param {String} documentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getMOData: function (documentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getAttachedMoAssessment"];
            var oParam = {
                "docId": documentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function that fetch  preview data
         * @param {String} documentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fetchPreview: function (documentId, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getPreviewDetail"];
            var oParam = {
                "docId": documentId,
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Update general tab.
         * @param {string} sDocId 
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {string} eTag 
         */
        UpdateGeneralTab: function (sDocId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this._baseURI + this.URL["updateGeneralTabDetail"];
            var oParam = {
                "docId": sDocId,
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Creates new.
         * @param {Object} oPayload  
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnCreateNew: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createNewDocument");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to handle document upload
         * 
         * @params {Object} oPayload
         * @params {Function} fnSuccess
         * @params {Function} fnError
         * @params {Boolean} isOpenTextEnabled
         */
        createNew: function (oPayload, fnSuccess, fnError, isOpenTextEnabled, oObjectInfo) {

            var that = this;
            var aChunkedFile = [];
            
            if(oPayload && oPayload.to_file) {
                aChunkedFile = this.fnChunkFile(oPayload.to_file.file, 1);
            }

            var oProgressIndicator = new sap.m.ProgressIndicator({
                displayValue: "",
                state: "None",
                percentValue: 0
            });
            var oVBox = new sap.m.VBox({
                renderType: "Bare",
                items: [
                    new sap.m.BusyIndicator(),
                    oProgressIndicator
                ]
            });
            var oProgressDialog = new sap.m.Dialog({
                title: "Uploading",
                content: oVBox,
                // endButton: new sap.m.Button({
                //     text: "Cancel",
                //     /**
                //      * Function to handle dialog close
                //      */
                //     press: function () {
                //         oProgressDialog.close();
                //     }
                // }),
                /**
                 * Callback after close
                 */
                afterClose: function () {
                    oProgressDialog.destroy();
                }
            });

            oVBox.addStyleClass("sapUiSmallMarginTopBottom");
            oProgressDialog.addStyleClass("sapUiResponsivePadding--content sapUiResponsivePadding--header sapUiResponsivePadding--footer sapUiResponsivePadding--subHeader");
            oProgressDialog.open();

            /**
             * Function to update progress indicator
             */
            var fnUpdateProgress = function (oProgress) {
                // oProgressIndicator.setDisplayValue(oProgress.processed + " MB / " + oProgress.total + " MB");
                oProgressIndicator.setPercentValue(oProgress.percent);
                oProgressIndicator.setState(oProgress.percent ? (oProgress.percent >= 100 ? "Success" : "Warning") : "None");
            };

            that.fnCreateNewInitiate(function (sSessionId) {
                that.fnCreateNewUploadChunk(sSessionId, aChunkedFile, fnUpdateProgress, function () {
                    oProgressDialog.close();
                    if(isOpenTextEnabled) {
                        var oOpenTextPayload = {
                            documentInfo: oPayload,
                            "objectInfo": oObjectInfo || {}
                        };

                        that.fnCreateNewCompleteOpenText(sSessionId, oOpenTextPayload, fnSuccess, fnError);
                    } else {
                        that.fnCreateNewComplete(sSessionId, oPayload, fnSuccess, fnError);
                    }
                }, function() {
                    oProgressDialog.close();
                    fnError();
                });
            },  function() {
                oProgressDialog.close();
                fnError();
            });

        },

        /**
         * Function to handle document upload
         * 
         * @params {Object} oPayload
         * @params {Function} fnSuccess
         * @params {Function} fnError
         * @params {Boolean} isOpenTextEnabled
         */
        updateDocData: function (oPayload, fnSuccess, fnError, isOpenTextEnabled, oObjectInfo) {

            var that = this;
            var aChunkedFile = [];
            
            if(oPayload && oPayload.to_file) {
                aChunkedFile = this.fnChunkFile(oPayload.to_file.file, 1);
            }

            var oProgressIndicator = new sap.m.ProgressIndicator({
                displayValue: "",
                state: "None",
                percentValue: 0
            });
            var oVBox = new sap.m.VBox({
                renderType: "Bare",
                items: [
                    new sap.m.BusyIndicator(),
                    oProgressIndicator
                ]
            });
            var oProgressDialog = new sap.m.Dialog({
                title: "Uploading",
                content: oVBox,
                /**
                 * Callback after close
                 */
                afterClose: function () {
                    oProgressDialog.destroy();
                }
            });

            oVBox.addStyleClass("sapUiSmallMarginTopBottom");
            oProgressDialog.addStyleClass("sapUiResponsivePadding--content sapUiResponsivePadding--header sapUiResponsivePadding--footer sapUiResponsivePadding--subHeader");
            oProgressDialog.open();

            /**
             * Function to update progress indicator
             */
            var fnUpdateProgress = function (oProgress) {
                // oProgressIndicator.setDisplayValue(oProgress.processed + " MB / " + oProgress.total + " MB");
                oProgressIndicator.setPercentValue(oProgress.percent);
                oProgressIndicator.setState(oProgress.percent ? (oProgress.percent >= 100 ? "Success" : "Warning") : "None");
            };

            that.fnCreateNewInitiate(function (sSessionId) {
                that.fnCreateNewUploadChunk(sSessionId, aChunkedFile, fnUpdateProgress, function () {
                    oProgressDialog.close();
                    if(isOpenTextEnabled){
                        var oOpenTextPayload = {
                            documentInfo: oPayload,
                            "objectInfo": oObjectInfo || {}
                        }
                        that.fnUpdateDocCompleteOpenText(sSessionId, oOpenTextPayload, fnSuccess, fnError);
                    } else{
                        that.fnDocumentEdited(sSessionId, oPayload, fnSuccess, fnError);
                    }
                }, function() {
                    oProgressDialog.close();
                    fnError();
                });
            },  function() {
                oProgressDialog.close();
                fnError();
            });
        },

        /**
         * Function to chunk file
         * 
         * @params {String} sFileContent
         * @params {Number} iChunkSizeInMB
         */
        fnChunkFile: function (sFileContent, iChunkSizeInMB) {

            var aChunk = [];
            var iOneMB = 1024 * 1024;
            var iChunkSize = iChunkSizeInMB ? (iChunkSizeInMB * iOneMB) : iOneMB;
            var iTotalSize = sFileContent.size || sFileContent.length;

            for (var i = 0; i < iTotalSize; i += iChunkSize) {
                // aChunk.push(sFileContent.slice(i, i + iChunkSize));
                aChunk.push(new Blob([sFileContent.slice(i, i + iChunkSize)], { type: sFileContent.type }));
            }

            return aChunk;

        },

        /**
         * Function to initiate and get sessionId
         * 
         * @params {Function} fnSuccess
         * @params {Function} fnError
         */
        fnCreateNewInitiate: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createNewDocumentInitiate");
            this.postData(sUrl, {}, null, fnSuccess, fnError, false);

        },

        /**
         * Function to upload file in chunk
         * 
         * @params {String} sSessionId
         * @params {Array} aChunkedFile
         * @params {Function} fnUpdateProgress
         * @params {Function} fnSuccess
         * @params {Function} fnError
         */
        fnCreateNewUploadChunk: function (sSessionId, aChunkedFile, fnUpdateProgress, fnSuccess, fnError) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "createNewDocumentUploadChunk");
            var iProcessed = 0;
            var iTotal = aChunkedFile.length;

            /**
             * Function to upload file
             */
            var fnUploadChunk = function () {
                var oPayload = new FormData();

                oPayload.append("file", aChunkedFile[iProcessed]);
                oPayload.append("chunkNumber", (iProcessed + 1));
                oPayload.append("totalChunks", iTotal);
                oPayload.append("sessionId", sSessionId);

                that.postData(sUrl, {}, oPayload, function () {
                    iProcessed++;
                    if (fnUpdateProgress) {
                        fnUpdateProgress({
                            total: iTotal,
                            processed: iProcessed,
                            percent: iTotal ? Math.round((iProcessed / iTotal) * 100) : 100
                        });
                    }
                    if (iProcessed < iTotal) {
                        fnUploadChunk();
                    } else {
                        fnSuccess();
                    }
                }, fnError, false);
            };

            fnUploadChunk();

        },

        /**
         * Function to complete the session
         * 
         * @params {String} sSessionId
         * @params {Object} oPayload
         * @params {Function} fnSuccess
         * @params {Function} fnError
         */
        fnCreateNewComplete: function (sSessionId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createNewDocumentComplete");
            var oParam =  {
                sessionId: sSessionId
            };

            if(oPayload && oPayload.to_file) {
                delete oPayload.to_file.content;
                delete oPayload.to_file.file;
            }
            
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to complete the session
         * 
         * @params {String} sSessionId
         * @params {Object} oPayload
         * @params {Function} fnSuccess
         * @params {Function} fnError
         */
        fnDocumentEdited: function (sSessionId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "documentCompleteEdited");
            var oParam =  {
                originalDocId: oPayload.originalDocId,
                sessionId: sSessionId
            };

            if(oPayload && oPayload.to_file) {
                delete oPayload.to_file.content;
                delete oPayload.to_file.file;
            }
            delete oPayload.originalDocId;
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to complete the session for Open Text
         * 
         * @params {String} sSessionId
         * @params {Object} oPayload
         * @params {Function} fnSuccess
         * @params {Function} fnError
         */
        fnCreateNewCompleteOpenText: function (sSessionId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createNewDocumentCompleteOpenTextV2");
            // if(oPayload && oPayload.objectInfo && oPayload.objectInfo.objectType && (oPayload.objectInfo.objectType === "INSP" ||  oPayload.objectInfo.objectType === "EQUI") ){
            //     sUrl = this.getUrl(this._baseURI, "createNewDocumentCompleteOpenTextV2");
            // }
            var oParam =  {
                sessionId: sSessionId
            };

            if(oPayload && oPayload.documentInfo && oPayload.documentInfo.to_file) {
                delete oPayload.documentInfo.to_file.content;
                delete oPayload.documentInfo.to_file.file;
            }
            
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to complete the session for Open Text
         * 
         * @params {String} sSessionId
         * @params {Object} oPayload
         * @params {Function} fnSuccess
         * @params {Function} fnError
         */
        fnUpdateDocCompleteOpenText: function (sSessionId, oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateDocumentCompleteOpenText");
            // if(oPayload && oPayload.objectInfo && oPayload.objectInfo.objectType && oPayload.objectInfo.objectType === "INSP"){
            //     sUrl = this.getUrl(this._baseURI, "updateDocumentCompleteOpenText");
            // }
            var oParam =  {
                sessionId: sSessionId
            };

            if(oPayload && oPayload.documentInfo && oPayload.documentInfo.to_file) {
                delete oPayload.documentInfo.to_file.content;
                delete oPayload.documentInfo.to_file.file;
            }
            
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
		 * Get document from the open text
         * @param {string} sFileId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getDocumentFromOpenText : function(sFileId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getDocumentFromOpenText");
            var oParam = {
                sFileId: sFileId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Download document from the open text
         * @param {string} sFileId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        downloadDocumentFromOpenText : function(sFileId) {
            var sUrl = this.getUrl(this._baseURI, "getDocumentFromOpenText");
            var oParam = {
                sFileId: sFileId
            };
            var sNewUrl = window.location.origin + this.fnAddParamToURL(sUrl, oParam);

            window.open(sNewUrl, "_blank");
        },

        // /**
        //  * Download document from the open text
        //  * @param {string} fileInfoId 
        //  * @param {function} fnSuccess
        //  * @param {function} fnError 
        //  */
        // getOpenTextFileUrl : function(fileInfoId) {
        //     var sUrl = this.getUrl(this._baseURI, "getDocumentFromOpenTextv2");
        //     var oParam = {
        //         fileInfoId: fileInfoId
        //     };
        //     return window.location.origin + this.fnAddParamToURL(sUrl, oParam);
        // },
        
        /**
		 * Download document from the open text
         * @param {string} sFileId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getOpenTextFileUrl : function(sFileId) {
            var sUrl = this.getUrl(this._baseURI, "getDocumentFromOpenText");
            var oParam = {
                sFileId: sFileId
            };
            return window.location.origin + this.fnAddParamToURL(sUrl, oParam);
        },

        /**s
        * Function to get ComponenetType
        * @param {String} sEquipmentId 
        */
        getPicklistID: function (picklistName, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getPicklistID"].replace("({picklistName})", picklistName);
            this.getData(sUrl, "", fnSuccess, fnError, true);
        },

        /**
         * Function to get picklist info
         * @param {String} pickListId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getPicklistInfo:function(pickListId,fnSuccess, fnError){

            var sUrl = this._baseURI + this.URL["getPicklistInfo"];
            var oParam={
                "pickListId":pickListId
            }
            this.getData(sUrl,oParam, fnSuccess, fnError, true);
        },

        /**
         * 
         */
        deleteDocumentOpenText: function(oPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "deleteDocumentOpenText");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError)
        }

    });

});