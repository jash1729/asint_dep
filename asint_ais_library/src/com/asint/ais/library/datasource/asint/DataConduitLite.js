sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL",
    "com/asint/ais/library/datasource/asint/Common"
], function (Utility, URL, CommonDataSource) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.DataConduitLite", {

        URL: URL,

        _baseURI: "",

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {

            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }
            this.commonDataSource = new CommonDataSource(sBaseURI);

        },

        /**
		 * Retrieves the UOM list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getUoMList: function (fnSuccess, fnError) {

            this.commonDataSource.getUoMList(fnSuccess, fnError);

        },

        /**
		 * Creates Characteristics.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCharacteristic: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "characteristic");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },

        /**
		 * Creates Classification.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createClassification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "classification");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },   

        /**
		 * Retrieves the Classification with filter.
         * @param {string} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getClassificationsExpandedWithFilter: function (aDisplayId, fnSuccess, fnError) {

            var that = this;
            var batchSize = 50;
            var allResults = [];
            var totalBatches = Math.ceil(aDisplayId.length / batchSize);
            var completed = 0;
            var currentIndex = 0;
            var maxParallel = 3;
            var hasErrorOccurred = false;

            function processNext() {

                if (hasErrorOccurred || currentIndex >= totalBatches) {
                    return;
                }

                var i = currentIndex++;
                var batch = aDisplayId.slice(i * batchSize, (i + 1) * batchSize);

                var sUrl = that.getUrl(that._baseURI, "classificationExpandedWithFilter");
                var aFilter = [];

                for (var j = 0; j < batch.length; j++) {
                    aFilter.push("displayId eq '" + batch[j] + "'");
                }

                var oParam = {
                    filter: aFilter.join(" or ")
                };

                that.getData(sUrl, oParam, function (oResponse) {

                    if (hasErrorOccurred) {
                        return;
                    }

                    if (oResponse && oResponse.value) {
                        allResults = allResults.concat(oResponse.value);
                    }

                    completed++;

                    if (completed === totalBatches) {
                        fnSuccess.call(that, { value: allResults });
                    } else {
                        processNext();
                    }

                }, function (oError) {

                    if (!hasErrorOccurred) {
                        hasErrorOccurred = true;
                        fnError(oError);
                    }
                }, false);
            }

            for (var k = 0; k < Math.min(maxParallel, totalBatches); k++) {
                processNext();
            }
        },

        /**
		 * Retrieves the object with filter.
         * @param {string} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getObjectsExpandedWithFilter: function (aDisplayId, fnSuccess, fnError) {

            var that = this;
            var batchSize = 50;
            var allResults = [];
            var totalBatches = Math.ceil(aDisplayId.length / batchSize);
            var completed = 0;
            var currentIndex = 0;
            var maxParallel = 3;
            var hasErrorOccurred = false;

            function processNext() {

                if (hasErrorOccurred || currentIndex >= totalBatches) {
                    return;
                }

                var i = currentIndex++;
                var batch = aDisplayId.slice(i * batchSize, (i + 1) * batchSize);

                var sUrl = that.getUrl(that._baseURI, "objectExpandedWithFilter");
                var aFilter = [];

                for (var j = 0; j < batch.length; j++) {
                    aFilter.push("displayId eq '" + batch[j] + "'");
                }

                var oParam = {
                    filter: aFilter.join(" or ")
                };

                that.getData(sUrl, oParam, function (oResponse) {
                    if (hasErrorOccurred) {
                        return;
                    }
                    if (oResponse && oResponse.value) {
                        allResults = allResults.concat(oResponse.value);
                    }

                    completed++;

                    if (completed === totalBatches) {
                        fnSuccess.call(that, { value: allResults });
                    } else {
                        processNext();
                    }

                }, function (oError) {

                    if (!hasErrorOccurred) {
                        hasErrorOccurred = true;
                        fnError(oError);
                    }
                }, false);
            }

            for (var k = 0; k < Math.min(maxParallel, totalBatches); k++) {
                processNext();
            }
        },
		
        /**
		 * Retrieves the Classification assign unassign characteristics.
         * @param {string} sClassificationId
		 * @param {object} oPayload 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        classificationAssignUnassignCharacteristics: function (sClassificationId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "classificationById");
            var oParam = {
                "classificationId": sClassificationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, "*");
			

        },
        /**
		 * Retrieves the template assign unassign Classification .
         * @param {string} templateID 
		 * @param {object} oPayload
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        templateAssignUnassignClassifications: function (templateID, oPayload,eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "ClassById");
			
            var oParam = {  
                "templateID": templateID
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },

        /**
		 * Retrieves the Characteristics with filter.
         * @param {string} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacteristicsWithFilter: function (aDisplayId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "characteristicsWithFilter");
            var aFilter = [];

            for (var i = 0; i < aDisplayId.length; i++) {
                aFilter.push("displayId eq '" + aDisplayId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" or ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false); 

        },

        /**
		 * Update Characteristics.
		 * @param {string} characteristicId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCharacteristic: function (oPayload, eTag, characteristicId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "characteristicById");
            var oParam = {
                "characteristicId": characteristicId
            };
			
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },

        /**
		 * Retrieves the Characteristics by displayid.
         * @param {array} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacteristicByDisplayId: function (aDisplayId, fnSuccess, fnError) {

            var that = this;
            var batchSize = 50;
            var allResults = [];
            var totalBatches = Math.ceil(aDisplayId.length / batchSize);
            var completed = 0;
            var currentIndex = 0;
            var maxParallel = 3;
            var hasErrorOccurred = false;

            function processNext() {

                if (hasErrorOccurred || currentIndex >= totalBatches) {
                    return;
                }

                var i = currentIndex++;
                var batch = aDisplayId.slice(i * batchSize, (i + 1) * batchSize);

                var sUrl = that.getUrl(that._baseURI, "characteristicByFilter");
                var aFilter = [];

                for (var j = 0; j < batch.length; j++) {
                    aFilter.push("displayId eq '" + batch[j] + "'");
                }

                var oParam = {
                    filter: aFilter.join(" or ")
                };

                that.getData(sUrl, oParam, function (oResponse) {

                    if (hasErrorOccurred) {
                        return;
                    }
                    if (oResponse && oResponse.value) {
                        allResults = allResults.concat(oResponse.value);
                    }

                    completed++;

                    if (completed === totalBatches) {
                        fnSuccess.call(that, { value: allResults });
                    } else {
                        processNext();
                    }

                }, function (oError) {

                    if (!hasErrorOccurred) {
                        hasErrorOccurred = true;
                        fnError(oError);
                    }

                }, true);
            }

            for (var k = 0; k < Math.min(maxParallel, totalBatches); k++) {
                processNext();
            }
        },

        /**
		 * Attaches a code list to a specific characteristic based on the provided parameters.
		 * @param {Object} oPayload 
		 * @param {string} eTag 
		 * @param {string} characteristicId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        attachCodeListforCharacteristics: function (oPayload, eTag, characteristicId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "attachCodeListforCharacteristics");
            var oParam = {
                "characteristicId": characteristicId
            };
			
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },

        /**
		 * Retrieves the code list by display id.
         * @param {Array} aCodeListDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCodeListByDisplayId: function (aCodeListDisplayId, fnSuccess, fnError) {

            var that = this;
            var batchSize = 50;
            var allResults = [];
            var totalBatches = Math.ceil(aCodeListDisplayId.length / batchSize);
            var completed = 0;
            var currentIndex = 0;
            var maxParallel = 3;
            var hasErrorOccurred = false;

            function processNext() {

                if (hasErrorOccurred || currentIndex >= totalBatches) {
                    return;
                }

                var i = currentIndex++;
                var batch = aCodeListDisplayId.slice(i * batchSize, (i + 1) * batchSize);

                var sUrl = that.getUrl(that._baseURI, "codeListByFilter");
                var aFilter = [];

                for (var j = 0; j < batch.length; j++) {
                    aFilter.push("displayId eq '" + batch[j] + "'");
                }

                var oParam = {
                    filter: aFilter.join(" or ")
                };

                that.getData(sUrl, oParam, function (oResponse) {
                    if (hasErrorOccurred) {
                        return;
                    }
                    if (oResponse && oResponse.value) {
                        allResults = allResults.concat(oResponse.value);
                    }

                    completed++;

                    if (completed === totalBatches) {
                        fnSuccess.call(that, { value: allResults });
                    } else {
                        processNext();
                    }

                }, function (oError) {

                    if (!hasErrorOccurred) {
                        hasErrorOccurred = true;
                        fnError(oError);
                    }

                }, true);
            }

            for (var k = 0; k < Math.min(maxParallel, totalBatches); k++) {
                processNext();
            }
        },

        /**
		 * Retrieves the codeList by id.
         * @param {string} codeListId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCodeListById: function (codeListId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "codeListById");
            var oParam = {
                "codeListId": codeListId
            };
			
            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Creates codeList.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCodeList: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "codeList");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

        },

        /**
		 * Update codeList.
		 * @param {string} codeListId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCodeList: function (oPayload, eTag, codeListId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "codeListById");
            var oParam = {
                "codeListId": codeListId
            };
			
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },

        /**
		 * Update classification.
		 * @param {string} sClassificationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateClassification: function (sClassificationId, oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "classificationById");
            var oParam = {
                "classificationId": sClassificationId
            };
			
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, "*");

        },

        /**
		 * Retrieves the Characteristic lists.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getAllCharacteristicList: function(fnSuccess, fnError) {

            var sCountUrl = this.getUrl(this._baseURI, "characteristicListCount");

            this.getData(sCountUrl, {}, fnSuccess, fnError, false);

        },

        /**
         * Function to get Characteristics by Chunk
         * 
         * @param {Integer} iSkip - Skip count
         * @param {Integer} iTop  - Top count
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getCharacteristicsByChunk: function (iSkip, iTop, fnSuccess, fnError) {
            
            var that = this;
            var sUrl = that.getUrl(that._baseURI, "characteristicListDisplayId");
            sUrl += "&$skip="+iSkip+"&$top=" + iTop;
            
            that.getData(sUrl, {}, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the Classification lists.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getAllClassificationList: function(fnSuccess, fnError) {

            var sCountUrl = this.getUrl(this._baseURI, "classificationListCount");

            this.getData(sCountUrl, {}, fnSuccess, fnError, false);

        },

        /**
         * Function to get Classifications by Chunk
         * 
         * @param {Integer} iSkip - Skip count
         * @param {Integer} iTop  - Top count
         * @param {Function} fnSuccess - Success callback function
         * @param {Function} fnError - Error callback function
         */
        getClassificationsByChunk: function (iSkip, iTop, fnSuccess, fnError) {
            
            var that = this;
            var sUrl = that.getUrl(that._baseURI, "classificationListDisplayId");
            sUrl += "&$skip="+iSkip+"&$top=" + iTop;
            
            that.getData(sUrl, {}, fnSuccess, fnError, false);
            
        },

        /**
		 * Retrieves the Classifications with filter.
         * @param {array} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getClassificationsWithFilter: function (aDisplayId, fnSuccess, fnError,length) {

            var sUrl = this.getUrl(this._baseURI, "classificationsWithFilter");
            var aFilter = [];

            for (var i = 0; i < aDisplayId.length; i++) {
                aFilter.push("displayId eq '" + aDisplayId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" or ")
            };
            
            if(length!=undefined){
                sUrl = sUrl.replace("{lengthOfClasses}", length);
            }
            else
            {
                sUrl = sUrl.replace("{lengthOfClasses}", "20");
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Retrieves the code lists.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAllCodeList: function(fnSuccess, fnError) {

            var that = this;
            var sCountUrl = this.getUrl(this._baseURI, "codeListCount");

            this.getData(sCountUrl, {}, function(oResponse) {
                var sUrl = that.getUrl(that._baseURI, "codeListDisplayId");
				
                sUrl += "&$skip=0&$top=" + oResponse;
                that.getData(sUrl, {}, fnSuccess, fnError, false);
            }, fnError, false);

        },
		

        /**
		 * Retrieves Characteristics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAllTemplateList: function(fnSuccess, fnError) {

            var that = this;
            var batchSize = 10000;
            var allResults = [];
            var sCountUrl = this.getUrl(this._baseURI, "objectCount");

            this.getData(sCountUrl, {}, function (oResponse) {

                var totalCount = parseInt(oResponse, 10);
                var totalBatches = Math.ceil(totalCount / batchSize);
                var completed = 0;

                for (var i = 0; i < totalBatches; i++) {

                    var skip = i * batchSize;

                    var sUrl = that.getUrl(that._baseURI, "objectDisplayId");
                    sUrl += "&$skip=" + skip + "&$top=" + batchSize;
                    
                    that.getData(sUrl, {}, function (data) {

                        if (data && data.value) {
                            allResults = allResults.concat(data.value);
                        }
                        completed++;
                        if (completed === totalBatches) {
                            fnSuccess(allResults);
                        }

                    }, fnError, false);

                }
            }, fnError, false);

        },

        /**
		 * Creates template.
         * @param {string} sCMLId
		 *  @param {string} sVersion   
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createTemplate: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "objectTemplate");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);
        },
 
        /**
		 * Update template.
		 * @param {string} templateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateTemplate:function (oPayload, eTag, templateId, fnSuccess, fnError)
        {  
            var sUrl = this.getUrl(this._baseURI, "objectById");
            var oParam = {
                "templateId": templateId
            };    
			
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },
        /**
		 * Retrieves the object by displayid.
         * @param {string} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectByDisplayId: function (aDisplayId, fnSuccess, fnError) {

            var that = this;
            var batchSize = 50;
            var allResults = [];
            var totalBatches = Math.ceil(aDisplayId.length / batchSize);
            var completed = 0;
            var currentIndex = 0;
            var maxParallel = 3;
            var hasErrorOccurred = false;

            function processNext() {

                if (hasErrorOccurred || currentIndex >= totalBatches) {
                    return;
                }

                var i = currentIndex++;
                var batch = aDisplayId.slice(i * batchSize, (i + 1) * batchSize);

                var sUrl = that.getUrl(that._baseURI, "objectByFilter");
                var aFilter = [];

                for (var j = 0; j < batch.length; j++) {
                    aFilter.push("displayId eq '" + batch[j] + "'");
                }

                var oParam = {
                    filter: aFilter.join(" or ")
                };

                that.getData(sUrl, oParam, function (oResponse) {

                    if (hasErrorOccurred) {
                        return;
                    }

                    if (oResponse && oResponse.value) {
                        allResults = allResults.concat(oResponse.value);
                    }

                    completed++;

                    if (completed === totalBatches) {
                        fnSuccess(allResults);
                    } else {
                        processNext();
                    }

                }, function (oError) {
                    if (!hasErrorOccurred) {
                        hasErrorOccurred = true;
                        fnError(oError);
                    }
                }, true);
            }

            for (var k = 0; k < Math.min(maxParallel, totalBatches); k++) {
                processNext();
            }
        },

        /**
		 * Update template assign unassign classes.
		 * @param {string} sClassificationId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        templateAssignUnassignClasses: function (sClassificationId, oPayload,eTag ,fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "classificationById");
            var oParam = {
                "classificationId": sClassificationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },


        /**
		 * Retrieves the Classification with filters.
         * @param {string} aDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        getClassificationWithFilter: function (aDisplayId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "characteristicsWithFilter");
            var aFilter = [];

            for (var i = 0; i < aDisplayId.length; i++) {
                aFilter.push("displayId eq '" + aDisplayId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" or ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

    });

});