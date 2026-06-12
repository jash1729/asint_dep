sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL",
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.Common", {

        URL: URL,

        _baseURI: "",
        
        _cacheConfig: {
            enable: true,
            type: "local",
            ttl: 1440,
            key: ""
        },

        /**
         * Constructor
         * 
         * @param {String} sBaseURI
         */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;
			
        },

        /**
         * Function to make request
         * 
         * @param {String} sUrl
         * @param {Object} oParam
         * @param {Function} fnSuccess
         * @param {Function} fnError
         * @param {Boolean} bShowBusy
         */
        fnMakeGetRequest: function(sUrl, oParam, fnSuccess, fnError, bShowBusy) {

            this.getData(sUrl, oParam, fnSuccess, fnError, bShowBusy);
			
        },


        /**
         * Function to get UoM List
         * 
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getUoMList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "uomList");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "uomList"
            });

            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);

        },

        /**
         * Function to convert UoM
         * 
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fnUoMConvert: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "uomConversion");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to get all classes
         * 
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAllClasses: function (fnSuccess, fnError) {

            var that = this;
            var sUrl = this.getUrl(this._baseURI, "classesExpandDesc");
            this.getData(sUrl, {}, function (oResponse) {
                oResponse.value.forEach(function (oClasses) {
                    // eslint-disable-next-line camelcase
                    oClasses.to_description = that.fnSortDescByPrefAndPriority(oClasses.to_description);
                });
                fnSuccess(oResponse);
            }, fnError);
        },

        /**
         * Function to get asset hierarchy
         * 
         * @param {String} sEmail
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getAssetHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "assetHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
         * Function to fetch timeline data based on Id and type
         * @param {String} sApp 
         * @param {String} sId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTimeLineChanges : function (sApp, sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getTimeline");
            sUrl = sUrl + "&$filter=objectId eq '"+ sId +"' and searchKey eq '"+ sApp +"'";
            this.getData(sUrl, {}, fnSuccess, fnError);
        },
        
        /**
         * Function get time line comments
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTimeLineComments : function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI,"getTimelineComments");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },
        
        /**
         * Function post time line comments
         * @param {Object} oPayload
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        postTimelineComment: function (oPayload, fnSuccess, fnError) {
            var sUrl=this.getUrl(this._baseURI, "postTimelineComment");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },
    
        /**
         * Function to attach document
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        attachDocument:function(oPayLoad,fnSuccess,fnError) {    
            var sUrl=this.getUrl(this._baseURI, "toDocument");
            this.postData(sUrl,{},oPayLoad,fnSuccess,fnError)
        },

        /**
         * Function to get document
         *
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        retrieveDocument:function(fnSuccess,fnError) {
            var sUrl=this.getUrl(this._baseURI, "toDocument");
            this.getData(sUrl,{},fnSuccess,fnError)
        },

        /**
         * Function to get template information
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getTemplateInfo:function(inspID,app,fnSuccess,fnError) {
            var sUrl = "";  
            if(app === "INSP" || app === "ASD") {
                sUrl = this.getUrl(this._baseURI, "attachTempDocument");
            }else if(app === "MO") {
                sUrl = this.getUrl(this._baseURI, "attachMOTempDocument");
            } else if(app === "FLOC") {
                sUrl = this.getUrl(this._baseURI, "attachFLOCTempDocument");
            } else if (app === "EQUI") {
                sUrl = this.getUrl(this._baseURI, "attachEQUITempDocument");
            } else if (app === "AIS_RECO") {
                sUrl = this.getUrl(this._baseURI, "attachAISRecommendationDocument");
            } else if (app === "APM_RECO") {
                sUrl = this.getUrl(this._baseURI, "attachAPMRecommendationDocument");
            } else if (app === "TASK_MANAGEMENT") {
                sUrl = this.getUrl(this._baseURI, "attachDocToTaskManagement");
            } else if (app === "MSP") {
                sUrl = this.getUrl(this._baseURI, "attachDocToMSP");
            } else if (app==="FINDINGS"){
                sUrl = this.getUrl(this._baseURI, "attachDocToFindings");
            } else if (app==="RCA"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRCAssessments");
            }
            else if (app==="MPOT"){
                sUrl = this.getUrl(this._baseURI, "attachDocToOptimisation");
            }
            else if (app==="RCM"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRiskClassStrategy");
            }
            else if (app==="FLEET"){
                sUrl = this.getUrl(this._baseURI, "attachDocToFleet");
            }
            else if(app==="RCaA"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRootCauseAnalysis");
            }
            else if (app === "HAZOP") {
                sUrl = this.getUrl(this._baseURI,"attachDocToHazop")
            }
            else if (app === "SIL") {
                sUrl = this.getUrl(this._baseURI,"attachDocToSil")
            }
            var oParam = {
                "ID": inspID
            }
            this.getData(sUrl, oParam , fnSuccess, fnError);

        },

        /**
         * Function to attach document
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        attachTempToDocument: function(payload, inspID, etag, app, fnSuccess, fnError) {
            var sUrl = "";
            if(app === "INSP" || app === "ASD") {
                sUrl = this.getUrl(this._baseURI, "attachTempDocument");
            }else if(app === "MO") {
                sUrl = this.getUrl(this._baseURI, "attachMOTempDocument");
            } else if(app === "FLOC") {
                sUrl = this.getUrl(this._baseURI, "attachFLOCTempDocument");
            } else if (app === "EQUI") {
                sUrl = this.getUrl(this._baseURI, "attachEQUITempDocument");
            } else if (app === "AIS_RECO") {
                sUrl = this.getUrl(this._baseURI, "attachAISRecommendationDocument");
            } else if (app === "APM_RECO") {
                sUrl = this.getUrl(this._baseURI, "attachAPMRecommendationDocument");
            } else if (app === "TASK_MANAGEMENT") {
                sUrl = this.getUrl(this._baseURI, "attachDocToTaskManagement");
            } else if (app === "MSP") {
                sUrl = this.getUrl(this._baseURI, "attachDocToMSP");
            } else if (app==="FINDINGS"){
                sUrl = this.getUrl(this._baseURI, "attachDocToFindings");
            }  else if (app==="RCA"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRCAssessments");
            }
            else if (app==="MPOT"){
                sUrl = this.getUrl(this._baseURI, "attachDocToOptimisation");
            }
            else if (app==="RCM"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRiskClassStrategy");
            }
            else if (app==="FLEET"){
                sUrl = this.getUrl(this._baseURI, "attachDocToFleet");
            }else if(app==="RCaA"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRootCauseAnalysis");
            }
            else if (app === "HAZOP") {
                sUrl = this.getUrl(this._baseURI,"attachDocToHazop")
            }
            else if (app === "SIL") {
                sUrl = this.getUrl(this._baseURI,"attachDocToSil")
            }
            var oParam = {
                "ID": inspID
            }

            if(["AIS_RECO", "APM_RECO"].includes(app)) {
                this.patchData(sUrl, oParam , payload, fnSuccess, fnError, false, etag);
            } else  {
                this.patchData(sUrl, oParam , payload, fnSuccess, fnError, false, etag);
            }

        },


        /**
         * Function to get document by ID
         *
         * @param {String} inspID
         * @param {String} app
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getDocumentsId:function(inspID,app,fnSuccess,fnError) {
            var sUrl = "";  
            if(app === "INSP" || app === "ASD") {
                sUrl = this.getUrl(this._baseURI, "attachDocToAssesment");
            }else if(app === "MO") {
                sUrl = this.getUrl(this._baseURI, "attachDocToMOAssesment");
            }else if(app === "FLOC") {
                sUrl = this.getUrl(this._baseURI, "attachDocToFLOC");
            }else if(app === "EQUI") {
                sUrl = this.getUrl(this._baseURI, "attachDocToEQUI");
            } else if (app === "AIS_RECO") {
                sUrl = this.getUrl(this._baseURI, "attachDocToAISRecommendation");
            } else if (app === "APM_RECO") {
                sUrl = this.getUrl(this._baseURI, "attachDocToAPMRecommendation");
            } else if (app === "TASK_MANAGEMENT") {
                sUrl = this.getUrl(this._baseURI, "attachDocToTaskManagement");
            } else if (app === "MSP") {
                sUrl = this.getUrl(this._baseURI, "attachDocToMSP");
            } else if (app==="FINDINGS"){
                sUrl = this.getUrl(this._baseURI, "attachDocToFindings");
            } else if (app==="RCA"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRCAssessments");
            }
            else if (app==="MPOT"){
                sUrl = this.getUrl(this._baseURI, "attachDocToOptimisation");
            }
            else if (app==="RCM"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRiskClassStrategy");
            }
            else if (app==="FLEET"){
                sUrl = this.getUrl(this._baseURI, "attachDocToFleet");
            }else if(app==="RCaA"){
                sUrl = this.getUrl(this._baseURI, "attachDocToRootCauseAnalysis");
            }
            else if (app === "HAZOP") {
                sUrl = this.getUrl(this._baseURI,"attachDocToHazop")
            }
            else if (app === "SIL") {
                sUrl = this.getUrl(this._baseURI,"attachDocToSil")
            }
            var oParam = {
                "ID": inspID
            }
            this.getData(sUrl,oParam,fnSuccess,fnError)
        },

        /**
         * Function to get list of document by IDs
         *
         * @param {string} doc_Ids
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getDocumentsByIds:function(docIds,fnSuccess,fnError) {     
            var sUrl=this.getUrl(this._baseURI, "attachDocumentById");
            sUrl = sUrl.replace("{doc_Ids}",docIds);
            this.getData(sUrl,{},fnSuccess,fnError)
        },

        /**
         * Function to create and assign notification
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        createAndAssignNotification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createNotification");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Function to create and assign notification
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        createAndAssignAPMNotification: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "createApmNotification");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Function to fetch notification
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fetchNotification: function (fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "fetchNotification");
            this.getData(sUrl, {}, fnSuccess, fnError);

        },


        /**
         * Function to get equipment list
         *
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        equipmentList:function(fnSuccess,fnError) {
            var sUrl=this.getUrl(this._baseURI,"equipmentList");
            this.getData(sUrl,{},fnSuccess,fnError)
        },

        /**
         * Function to update notification
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        updateNotification: function (sNotificationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateNotification");
            var oParam = {
                "notificationId": sNotificationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Function to update notification
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        updateNotifications: function (sNotificationId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updatenotification");
            var oParam = {
                "notificationID": sNotificationId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Function to fetch notification detail
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fetchNotificationDetail:function(sNotificationId,fnSuccess,fnError) {

            var sUrl = this.getUrl(this._baseURI, "fetchNotificationDetail");
            sUrl = sUrl.replace("{sNotificationId}",sNotificationId);

            this.getData(sUrl,{},fnSuccess,fnError)

        },

        /**
         * Function to create findings
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        postFindings:function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "findingsApi");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },
         /**
         * Function to create findings
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        postFindingsV2:function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "findingsApiV2");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to delete findings
         *
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        bulkDeleteFindings:function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkDeleteFindings");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to read findings by id
         *
         * @param {String} sFindingId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getFindingInfoById:function(sFindingId,fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getFindingInfo");
            sUrl = sUrl.replace("{sFindingId}",sFindingId);

            this.getData(sUrl, {},  fnSuccess, fnError);
        },

        /**
         * Function to get users
         *
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getUserList: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "userList");
            var oParam = {};
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "userList",
                ttl: 30
            });

            this.getData(sUrl, oParam, function (oResponse) {
                var aEmail = [], aValue = [];
                
                if (Array.isArray(oResponse.value)) {
                    oResponse.value.forEach(function (oValue) {
                        if (!aEmail.includes(oValue.userName)) {
                            aEmail.push(oValue.userName);
                            aValue.push(oValue);
                        }
                    });
                    oResponse.value = aValue;
                }
                fnSuccess(oResponse);
            }, fnError, true, oCacheConfig);
        },

        /**
         * Function to update findings by id
         *
         * @param {String} sFindingId
         * @param {Object} oPayload
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        updateFinding:function(sFindingId, oPayload, fnSuccess, fnError, eTag) { 

            var sUrl = this.getUrl(this._baseURI, "updateFinding");
            var oParam = {
                "sFindingId": sFindingId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
         * Function to get heatmap
         *
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getHeatMap:function(fnSuccess,fnError) {
            var sUrl=this.getUrl(this._baseURI,"heatMapInfo");
            var oParam = {};
            this.getData(sUrl,oParam,fnSuccess,fnError);
        },


        /**
         * Function to fetch analytics data
         *
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fnFetchAnalyticsData:function(fnSuccess,fnError) {
            var sUrl=this.getUrl(this._baseURI,"FetchAnalyticsData");
            var oParam = {};
            this.getData(sUrl,oParam,fnSuccess,fnError);
        },

        /**
         * Function to get parent id
         *
         * @param {String} DisplayId
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getParentId:function(DisplayId,fnSuccess,fnError) { 

            var sUrl = this.getUrl(this._baseURI, "getParentId");
            sUrl = sUrl.replace("DisplayId",DisplayId);

            this.getData(sUrl, {},  fnSuccess, fnError);

        },

        /**
         * Function to get user roles
         *
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        getUserRoles: function (fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "userRole");
            var oParam = {};
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "userRole",
                ttl: 30
            });

            this.getData(sUrl, oParam, fnSuccess, fnError, bShowBusy, oCacheConfig);

        },

        /**
		 * Function to fetch object template expanded to class
		 * @param {String} sId 
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getObjectTemplatesExpandToClass : function(sId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "objectTemplateExpandToClass");
            var oParam = {
                "objTempId": sId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
         * Function to fetch any class to retrieve metadata
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFirstClassForMetadata : function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getClassForMetadata"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to fetch any characetristic to retrieve metadata
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFirstCharacteristicForMetadata:function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getCharacteristicForMetadata"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },
        
        /**
         * To fetch assigned s4 destination
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getOrgSettings: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getOrgSettings");
            var oParam = {};
            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createAdvancedFilter : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["advancedFilter"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch advanced filters list based on user 
         * @param {String} sUser 
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAdvancedFilters : function(sUser, sType, fnSuccess, fnError, sObjectId){
            var sUrl = this.getUrl(this._baseURI, "getAdvancedFiltersForUser");
            var sFilter = "?$filter=deleted eq false and createdBy eq '" + sUser + "' and objectType eq '" + sType + "'";
            if(sObjectId) {
                sFilter = sFilter + " and objectId eq '" + sObjectId + "'";
            }
            sUrl = sUrl + sFilter;
            this.getData(sUrl, {},  fnSuccess, fnError);
        },

        /**
         * 
         * @param {String} sId 
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {String} eTag 
         */
        updateAdvancedFilter : function(sId, oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["updateAdvancedFilter"];
            var oParam = {
                "filterId": sId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true);
        },

        /**
		 * Function to fetch document info along with file
		 * @param {String} sId 
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getDocumentFileInfo : function(sId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "documentFileInfo");
            var oParam = {
                "docId": sId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },
        
        /**
         * Function to fetch notification priority list
         * @param {*String} sEquipmentId 
         * @param {*Function} fnSuccess 
         * @param {*Function} fnError 
         */
        getNotificationsPriority: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["equipmentDetailExpandNotificationPriority"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to fetch notification type list
         * @param {*String} sEquipmentId 
         * @param {*Function} fnSuccess 
         * @param {*Function} fnError 
         */
        getNotificationsType: function (fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["equipmentDetailExpandNotificationType"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Function to get the logged in user's roles.
         */
        getRoles: function (keyApp, fnCallback) {
            var that = this;
            var filteredObject = {
                "tile": false,
                "read": false,
                "edit": false,
                "delete": false,
                "publish": false,
                "upload":false
            };     
            this.getUserRoles(function (oRolesRec) {
                var actions = {
                    "t": "tile",
                    "r": "read",
                    "e": "edit",
                    "d": "delete",
                    "p": "publish",
                    "u":"upload"
                }; 

                if (keyApp === "DCL") { // We have to check both EQUI and FLOC keys for DCL
                    Object.keys(actions).forEach(function (sSuffix) {
                        var sAction = actions[sSuffix];

                        var sEquiKey = "EQUI_" + sSuffix.toUpperCase();
                        var sFlocKey = "FLOC_" + sSuffix.toUpperCase();

                        filteredObject[sAction] = Boolean(oRolesRec[sEquiKey] || oRolesRec[sFlocKey]);
                    });
                } else {
                    var filteredKeys = Object.keys(oRolesRec).filter(function (key) {
                        return key.startsWith(keyApp);
                    });

                    filteredKeys.forEach(function (key) {
                        var lastCharacter = key.slice(-1).toLowerCase();
                        var action = actions[lastCharacter];
                        if (action) {
                            filteredObject[action] = oRolesRec[key];
                        }
                    });
                }
                if(fnCallback) {
                    fnCallback(filteredObject)
                }
            }, function () {
                that.fnMessageShow("E", "Failed to fetch user roles");
            });
        },

        /**
         * Function to get the risk and criticality assessment data.
         */
        getRiskData: function (appName, fnCallBack) {
            var that = this;
            var assessmentData = [];
            that.getAssessmentData(function (oDataRec) {
                oDataRec.response.forEach(function (item) {
                    if(item.objectType === appName){
                        assessmentData.push(item);
                    }
                });
                if(fnCallBack){
                    fnCallBack(assessmentData);
                }
            }, function () {
                that.fnMessageShow("E", "Failed to fetch risk summary data");
            });
        },

        /**
         * 
         */
        getCriticalityData: function (appName, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "criticalityData");
            sUrl = sUrl.replace("{appName}", appName);
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * 
         */
        getRiskScoreData: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "riskScoreData");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },
 
        /**
         * Function to get the risk and criticality assessment data counnt.
         */
        getRiskDataCount:function(appName, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "risk&criticalityCount");
            var oParam = {
                "filter": appName
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to get the risk and criticality assessment data counnt.
         */
        getAssessmentData:function(fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "risk&cricAssessmentData");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Function to fetch equipment name
		 * @param {String} sId  
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getEquipmentName : function(sId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "equipmentName");
            var oParam = {
                "equipmentId": sId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
		 * Function to fetch functional location name
		 * @param {String} sId 
		 * @param {Function} fnSuccess 
		 * @param {Function} fnError 
		 */
        getFunctionalLocationName : function(sId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "functionalLocationName");
            var oParam = {
                "functionalLocationId": sId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },
    
        /**
         * Function to filter data based on type for value helps or formatters
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getEquipmentFLOCConfigurationValueHelpBasedOnType : function(sType, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getEquiFLocValueHelpDataBasedonType");
            var oParam = {
                "objectType": sType
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
         * Function to get feature flag configs
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getFeatureFlagConfigs: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getAllFeatureFlag");
            this.getData(sUrl, {}, fnSuccess, fnError, false);

        },

        /**
         * Function to filter data based on apm recommendation id
         * @param {String} sType 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRecoIdFromAIS : function(sRecommendationId, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "getRecoIdFromAIS");
            var oParam = {
                "apmRecoId": sRecommendationId
            };
	
            this.getData(sUrl, oParam,  fnSuccess, fnError);
        },

        /**
		 * function to fetch assessment types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getNotificationStatusEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "notificationStatus");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch assessment types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getMaintenanceOrderStatusEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "maintenanceOrderStatus");
            this.getData(sUrl, {}, fnSuccess, fnError, true);
        },

        /**
		 * function to fetch Notification and maintenance plan details
         * @param {String} sId  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getSectionDetailsById: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getSectionById");
            var oParam = {
                "sectionID": sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
        * Fetches  plant list
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getplantList: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["equiPlantlist"];
            this.getData(sUrl, "", fnSuccess, fnError);
        },

        /**
		 * Updates inspection details.
		 * @param {string} sAssessmentId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateNewRecoTable: function (sId, oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateNewRecoTable");
            var oParam = {
                "recommendationId": sId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
        * Function that fetches the recommendation data
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getRecomendationOnEqui: function (oPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getRecommendationData"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Function to fetch s4Asset
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getNearestS4Asset: function (sId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "nearests4Details");
            var oParam = {
                "id":sId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },
		
        /**
        * Function that export the Notification data
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        bulkConvertMSP: function (sName, aPayload, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["createMSPEvent"];
            var oParam = {
                "type": sName
            }
            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, false);
        },

        /**
		 * Function to fetch progressData
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getProgressData: function (appName, sMail, fnSuccess, fnError, isBusyShow) {
            var sUrl="", oParam = {};
            if(appName === "MSP") {
                sUrl = this.getUrl(this._baseURI, "importProgressData");
                oParam = {
                    "createdFrom": sMail
                };
            }else {
                sUrl = this.getUrl(this._baseURI, "exportProgressData");
                oParam = {
                    "type":appName,
                    "createdFrom": sMail
                };
            }
            var bBusy = isBusyShow ? isBusyShow : false
            this.getData(sUrl, oParam, fnSuccess, fnError, bBusy);
        },

        /**
        * Function to send email
        * 
        * @param {Object} oPayload 
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        sendMail: function (oPayload, fnSuccess, fnError, bShowBusy) {
            var sUrl = this.getUrl(this._baseURI, "sendMail");
            var bBusy = bShowBusy ? bShowBusy : false
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bBusy);
        },


        /**
        * Function to get ComponenetType
        * @param {String} sEquipmentId 
        */
        getComponentTypePicklist: function (fnSuccess, fnError) {

            var sUrl = this._baseURI + this.URL["getComponentTypePicklist"];

            this.getData(sUrl,"", fnSuccess, fnError, true);

        },

        /**
        * Function to get TaskType
        * @param {String} sEquipmentId 
        */
        getTaskTypePicklist: function (fnSuccess, fnError, isBusyShow) {

            var sUrl = this._baseURI + this.URL["getTaskTypePicklist"];

            var bBusy = isBusyShow ? isBusyShow : false
            this.getData(sUrl,"", fnSuccess, fnError, bBusy);

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
         * Function to get priority
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getWorOrderPriorityByOrderType: function (fnSuccess, fnError) {
            
            var sUrl = this.getUrl(this._baseURI, "getMSPPriorityByOrderType");
            
            this.getData(sUrl, {}, fnSuccess, fnError, true);

        },

        /**
		 * Retrieves all the alerts.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getTemplateAlerts: function (sTemplateId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "templateAlerts");
            var oParam = {
                "sTemplateId": sTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function to filter data based on type for value helps or formatters
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getMaintenanceEventData : function(fnSuccess, fnError,isBusyShow){
            var sUrl = this.getUrl(this._baseURI, "recoMaintenanceEvent");

            var bBusy = isBusyShow ? isBusyShow : false
            this.getData(sUrl, {},  fnSuccess, fnError, bBusy);
        },

        /**
		 * Retrieves the user status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getUserStatusEnum : function(fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentUserStatusEnum");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the system status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getSystemStatusEnum : function(fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getEquipmentSystemStatusEnum");
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
         * Fetch feature flag configs
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        // fetchFeatureFlag: function (fnSuccess, fnError) {

        //         // if(window._isFeatureFlagLoading) {
        //         //     return;
        //         // }

        //     window._isFeatureFlagLoading = true;
            
        //     var sUrl = this.getUrl(this._baseURI, "featureFlag");

        //     this.getData(sUrl, {}, function(oResponse) {
        //         var oFeatureFlag = {};

        //         for(var i = 0; i < oResponse.value.length; i++) {
        //             oFeatureFlag[oResponse.value[i].objectKey] = oResponse.value[i];
        //         }
        //         fnSuccess(oFeatureFlag);

        //         window._isFeatureFlagLoading = false;

        //     }, fnError);
        // },
        /**
         * Fetch feature flag configs
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        fetchFeatureFlag: function (fnSuccess, fnError) {
            if (!window.com.asint.ais.requestQueue) {
                window.com.asint.ais.requestQueue = [];
            }
            if (window.com.asint.ais.featureFlag && window.com.asint.ais.featureFlag.isFeatureFlagLoaded) {
                fnSuccess(window.com.asint.ais.featureFlag);
                return;
            }
            if (window.com.asint.ais.featureFlag && window.com.asint.ais.featureFlag.isFeatureFlagLoading) {
                window.com.asint.ais.requestQueue.push({ 
                    onSuccess: fnSuccess, 
                    onError: fnError 
                });
                return;
            }
            if (!window.com.asint.ais.featureFlag) { window.com.asint.ais.featureFlag = {}; }
            window.com.asint.ais.featureFlag.isFeatureFlagLoading = true;
            window.com.asint.ais.featureFlag.isFeatureFlagLoaded = false;
            window.com.asint.ais.requestQueue.push({ 
                onSuccess: fnSuccess, 
                onError: fnError 
            });
            var sUrl = this.getUrl(this._baseURI, "featureFlag");
            this.getData(sUrl, {}, function(oResponse) {
                var oFeatureFlag = {};
                var aValues = (oResponse && oResponse.value) ? oResponse.value : [];
                for (var i = 0; i < aValues.length; i++) {
                    oFeatureFlag[aValues[i].objectKey] = aValues[i];
                }
                oFeatureFlag.isFeatureFlagLoaded = true;
                oFeatureFlag.isFeatureFlagLoading = false;
                window.com.asint.ais.featureFlag = oFeatureFlag;

                var queue = window.com.asint.ais.requestQueue;
                for (var j = 0; j < queue.length; j++) {
                    if (typeof queue[j].onSuccess === "function") {
                        queue[j].onSuccess(oFeatureFlag);
                    }
                }
                window.com.asint.ais.requestQueue = []; 

            }, fnError);
        },

        /**
         * Funcition that get the recommendation data
         * @param {String} sId 
         * @param {Function} fuSuccess 
         * @param {Function} fnError 
         */
        getRecommendation:function(type,oPayload,fuSuccess,fnError){
            var sUrl = this.getUrl(this._baseURI, "getrcmReco");
            var oParam = {
                type: type
            }
            this.postData(sUrl, oParam, oPayload,fuSuccess, fnError);
        },

        /**
		 * Retrieves the system status enum
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getStrategiesData : function(sId, type, fnSuccess,fnError) {
            var sUrl = this.getUrl(this._baseURI, "getStrategiesData");
            var oParam = {
                type: type,
                sId: sId
            }
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Function that creates the payload
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createStratergy: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "createAssessmentStrategry");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        
        /**
         * Function that creates the payload
         * @param {Object} oPayload 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateStrategyTable: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "updateStrategyLinkTable");
            this.patchData(sUrl, {}, oPayload, fnSuccess, fnError, true);
        },

        /**
         * Retrieves the assigned notifications.
         * @param {string} sEquipmentId          
         * @param {string} sFunctionType        
         * @param {function} fnSuccess          
         * @param {function} fnError            
         */
        fetchAssignedNotifications: function (sEquipmentId, sObjectType, fnSuccess, fnError) {
            var sUrl = "";
            var oParam = {};
 
            if (sObjectType === "EQUI") {
                sUrl = this._baseURI + this.URL["equipmentDetailExpandNotification"];
                oParam = { "equipmentId": sEquipmentId };
 
            } else if (sObjectType === "FLOC") {
                sUrl = this._baseURI + this.URL["functionalLocationDetailExpandNotification"];
                oParam = { "functionalLocationId": sEquipmentId };
 
            } 
 
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },


        /**
		 * function to fetch assessment sub types
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getAssessmentSubTypesEnum: function (fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "assessmentSubTypes");
            var oCacheConfig = Object.assign(this._cacheConfig, {
                enable: true,
                key: "assessmentSubTypes"
            });

            this.getData(sUrl, {}, fnSuccess, fnError, true, oCacheConfig);
        },

        /**
         * Function to sync user list manually
         * @param {Object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        syncUserList: function(oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "userSync");
            this.postData(sUrl, oPayload, {}, fnSuccess, fnError, true);
        },

        /**
        * Function to get picklist id based on short description
        * @param {String} picklistName 
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getPicklistID: function (picklistName, fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getPicklistID"].replace("({picklistName})", picklistName);
            this.getData(sUrl, "", fnSuccess, fnError, true);
        },

        /**
        * Function to get group details of a technical object
        * @param {String} sTechnicalObjectId 
        * @param {String} sTechnicalObjectType
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        */
        getGroupsByTechnicalObjectId: function (sTechnicalObjectId, sTechnicalObjectType,fnSuccess, fnError) {
            var sUrl = this._baseURI + this.URL["getGroupsByTechnicalObjectId"];
            var oParam = {
                "technicalObjectId": sTechnicalObjectId,
                "technicalObjectType": sTechnicalObjectType
            };
            this.getData(sUrl, oParam, fnSuccess, fnError, true);
        },

        /**
		 * Retrieves the maintenance plan for technical object
         * 
         * @param {Object} oParam 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMaintenancePlanDetailsV2: function (oParam, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getMaintenancePlanV2");
            
            if(oParam.searchQuery) {
                sUrl += "&searchData=" + oParam.searchQuery; 
            }

            this.getData(sUrl, oParam, fnSuccess, fnError, false);
        },

        /**
		 * Retrieves the maintenance plan for technical objects
         * 
         * @param {Object} oParam 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getMaintenancePlanDetailsByToV2: function (aPayload, oParam, fnSuccess, fnError) {
            if(aPayload.length === 1) {
                oParam.objectName = aPayload[0].objectName;
                oParam.type = aPayload[0].type;

                this.getMaintenancePlanDetailsV2(oParam, fnSuccess, fnError);
            } else {
                var sUrl = this.getUrl(this._baseURI, "getMaintenancePlanByTechnicalObjectsV2");

                if(oParam.searchQuery) {
                    sUrl += "&searchData=" + oParam.searchQuery; 
                }

                this.postData(sUrl, oParam, aPayload, fnSuccess, fnError, false);
            }
        },

        /**
		 * Retrieves a list of risk transitions.
         * @param {String} sTemplateId
		 * @param {function} fnSuccess - A callback function to be called on successful retrieval.
		 * @param {function} fnError - A callback function to be called on retrieval failure.
		 */
        fnGetRiskTransistionData : function(sTemplateId,fnSuccess, fnError){
            var that = this;
            var sUrl = this._baseURI + this.URL["fnGetRiskTransistionData"];
            var oParam = {
                "templateId": sTemplateId
            };
            that.getData(sUrl, oParam, fnSuccess, fnError,true); 
        },

    });

});