jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "sap/ui/util/Storage",
    "com/asint/ais/library/datasource/asint/Common",
    "sap/suite/ui/commons/TimelineItem",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Utility, Storage, CommonDatasource, TimelineItem, Item, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Utility.extend("com.asint.ais.library.helper.TechnicalObject", {
        datasource: {},
        controllerRef : null,
        timeLineRef : null,
        VboxRef : null,
        timeLineMeta : [],
        commentsMeta : [],
        parsedTimelineData : [],
        _oi18n : null,
        _baseURI: "",
        _objectName : "",
        _sAppName : "",
        _createdByObj : {},

        _icons: {
            "sys": "sap-icon://excel-attachment",
            "user": "sap-icon://employee",
            "att": "sap-icon://attachment",
            "atobj": "sap-icon://attachment"
        },

        _customActionKey: {
            "detail": "detail",
            "download": "download",
            "downloadAttach":"downloadAttach"
        },

        _oCompositionMaps : {
            "to_class":{
                "desc":"Class",
                "field":"Class / Classes"
            },
            "child_equipments":{
                "desc":"Equipment",
                "field":"Component(s)"
            },
            "child_equipment":{
                "desc":"Equipment",
                "field":"Component(s)"
            },
            "to_object_template":{
                "desc":"Object Template",
                "field":"Object Template(s)"
            },
            "to_attached_assessment":{
                "desc":"Assessment",
                "field":"Assessment(s)"
            },
            "to_cmls":{
                "desc":"CML",
                "field":"CML(s)"
            },
            "to_cml_template_collection":{
                "desc":"CML Template",
                "field":"CML Template(s)"
            },
            "to_maintenanceOrder":{
                "desc":"Maintenance Order",
                "field":"Maintenance Order(s)"
            },
            "to_maintenanceOrderAssessment":{
                "desc":"Maintenance Order",
                "field":"Maintenance Order(s)"
            },
            "to_maintenanceOrderInspection":{
                "desc":"Maintenance Order",
                "field":"Maintenance Order(s)"
            },
            "to_operation":{
                "desc":"Operation",
                "field":"Operation(s)"
            },
            "notifications":{
                "desc":"Notification",
                "field":"Notification(s)"
            },
            "to_notification":{
                "desc":"Notification",
                "field":"Notification(s)"
            },
            "child_locations":{
                "desc":"Functional Location",
                "field":"Component(s)"
            },
            "to_generalTask":{
                "desc":"General Task",
                "field":"General Task(s)"
            },
            "to_assessment":{
                "desc":"Assessment",
                "field":"Assessment(s)"
            },
            "to_equipment":{
                "desc":"Equipment",
                "field":"Equipment(s)"
            },
            "to_functionalLocation":{
                "desc":"Functional Location",
                "field":"Functional Location(s)"
            },
            "to_assessmentTemplate":{
                "desc":"Assessment Template",
                "field":"Assessment Template(s)"
            },
            "to_genAssessmentValues":{
                "desc":"Assessment Value",
                "field":"Assessment Value(s)"
            },
            "to_genAssessmentUserRoles":{
                "desc":"User Role",
                "field":"User Role(s)"
            },
            "to_documents":{
                "desc":"Attachment",
                "field":"Attachment(s)"
            },
            "to_component":{
                "desc":"Components",
                "field":"Component(s)"
            },
            "to_risk_fields":{
                "desc":"Risk Data",
                "field":"Risk Data"
            }
        }, 

        NAVIGATION: {
            "EQUIPMENT_DETAIL": "equipment-manage&/equipment/{equipmentId}/detail",
            "LOCATION_DETAIL": "functionallocation-manage&/location/{functionallocationId}/detail",
            "INSPECTION_DETAIL": "idms-manage&/detail/{inspectionId}",
            "ASSET_STRATEGY_DETAIL": "assetstrategydevelopment-manage&/detail/{assetStrategyId}",
            "INSPECTION_TEMPLATE_DETAIL": "idmstemp-manage&/detail/{inspectionTemplateId}",
            "RISK_AND_CRITICALITY_DETAIL": "rcassessment-display&/{assessmentId}",
            "RCA_DETAIL": "rca-manage&/detail/{assessmentId}"
        },

        /**
         * constructor
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {
            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }

            this.datasource = new CommonDatasource(this._baseURI);
        },
        
        /**
         * Function to get timeline data
         * @param {String} appName 
         * @param {String} sObjectId 
         * @param {String} fnSuccess 
         */
        fnGetTimeLineData : function(appName, sObjectId, fnSuccess){
            var that = this;

            that.datasource.getTimeLineChanges(appName, sObjectId, function(oData){
                var aResults = oData.value;
                if(aResults && aResults.length > 0){
                    that.timeLineMeta = aResults;
                    that.fnFormatTimelineData(aResults, fnSuccess);
                }else{
                    fnSuccess([]);
                }
            },function(oError) {
                var err = JSON.parse(oError.responseText);
                var errorDetail = "";
                if(err.error.message){
                    errorDetail = err.error.message;
                }
                that.fnMessageShow("E", that._oi18n.getText("timeline.message02"), errorDetail);        
            });
        },

        /**
         * Function to format timeline data
         * @param {Array} aResults 
         * @param {Function} fnSuccess 
         */
        fnFormatTimelineData : function(aResults, fnSuccess){
            var that = this;
            var oDetail = {};
            var oTemplateData = [];
            for (var iCounter = 0; iCounter < aResults.length; iCounter++) {
                var oLogDetail;
                var oReference;
                oDetail = aResults[iCounter];
                var oTemplate = {
                    "header": "",
                    "subheader": "",
                    "Icon": "",
                    "text": "",
                    "dateTime": "",
                    "replyCount": "",
                    "commentsList":[],
                    "detailKey": this._customActionKey.detail,
                    "detailText": "", //i18n+ Back end data
                    "objectType": "",
                    "objectId" : "",
                    "value": "", //id [depends on the timelne, it will be(turnaround,acticty,equip,WorlItem,user,shiftlog) id]
                    "equipmentId": "",
                    "action": "",
                    "navTo": false,
                    "changes": [],
                    "timeLineId": "",
                    "commentTextArea": "",
                    "all_ids": [],
                    "bIsInspPresent": false
                };

                if (oDetail.changes !== null){
                    oLogDetail = JSON.parse(atob(oDetail.changes));
                }
                else{
                    oLogDetail = [];
                }
                if (oDetail.references){
                    oReference = JSON.parse(atob(oDetail.references));
                }else{
                    oReference = "";
                }

                if (Array.isArray(oLogDetail)) {
                    oLogDetail.forEach(function(logEntry) {
                        if (logEntry.newData === "INSP") {
                            oDetail.bIsInspPresent = true;
                        }
                    });
                }
                oTemplate.bIsInspPresent = oDetail.bIsInspPresent
                oTemplate.Icon = this._icons[oDetail.entryType] ? this._icons[oDetail.entryType] : "sap-icon://employee";
                oTemplate.dateTime = new Date(oDetail.createdAt);
                var aComments = oDetail.to_comments;
                var timeLineComments = [];
                if(aComments && aComments.length > 0){
                    aComments.forEach(function(oComment){
                        if(oComment.timelineId_ID == oDetail.ID){
                            var tempObj = {
                                "sender": oComment.createdBy,
                                "text": oComment.text,
                                "timestamp": that.fnParseDate(oComment.createdAt),
                                "createdAt":oComment.createdAt,
                                "timelineId":oComment.timelineId_ID,
                                "initials":that.fnReturnUserInitials(oComment.createdBy)
                            };
                            timeLineComments.push(tempObj);
                        }
                    })
                }
                timeLineComments.sort(function(a,b){
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                });
                oTemplate.replyCount = timeLineComments.length;
                oTemplate.commentsList = timeLineComments;
                oTemplate.subheader = oDetail.createdBy;
                oTemplate.objectType = oDetail.objectType;
                oTemplate.objectId = oDetail.objectId;
                oTemplate.value = oDetail.objectId;
                oTemplate.timeLineId = oDetail.ID;
                switch(oDetail.searchKey){
                case "EQUI":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageEquipmentCreate(oTemplate, oLogDetail, oReference);
                    }else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageEquipmentUpdate(oTemplate, oLogDetail,oReference);
                    }else if(oDetail.action == "a"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentAttach(oTemplate, oLogDetail);
                    }else if(oDetail.action == "ar"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentAttachmentRemove(oTemplate, oLogDetail);
                    }else if(oDetail.action == "as"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentObjectsAssign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "uas"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentObjectsUnassign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "d"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentRemove(oTemplate, oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "FLOC":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageFunctionalLocationCreate(oTemplate, oLogDetail, oReference);
                    }else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageFunctionalLocationUpdate(oTemplate, oLogDetail,oReference);
                    }else if(oDetail.action == "a"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentAttach(oTemplate, oLogDetail);
                    }else if(oDetail.action == "ar"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentAttachmentRemove(oTemplate, oLogDetail);
                    }else if(oDetail.action == "as"){
                        oTemplate.navTo = false;
                        this.fnMessageFunctionalLocationObjectsAssign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "uas"){
                        oTemplate.navTo = false;
                        this.fnMessageFunctionalLocationObjectsUnassign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "d"){
                        oTemplate.navTo = false;
                        this.fnMessageEquipmentRemove(oTemplate, oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "DOCU":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageAttachmentCreate(oTemplate, oLogDetail, oReference);
                    }else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageAttachmentUpdate(oTemplate, oLogDetail,oReference);
                    }else if(oDetail.action == "as"){
                        oTemplate.navTo = true;
                        this.fnMessageAttchmentObjectsAssign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "uas"){
                        oTemplate.navTo = false;
                        this.fnMessageAttachmentObjectsUnassign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "d"){
                        oTemplate.navTo = false;
                        this.fnMessageAttachmentRemove(oTemplate, oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "RECO":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageRecommendationCreate(oTemplate, oLogDetail, oReference);
                    } else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageRecommendationUpdate(oTemplate, oLogDetail,oReference);
                    } else if(oDetail.action == "a"){
                        oTemplate.navTo = false;
                        this.fnMessageRecommendationAttach(oTemplate, oLogDetail);
                    }else if(oDetail.action == "ar"){
                        oTemplate.navTo = false;
                        this.fnMessageRecommendationAttachmentRemove(oTemplate, oLogDetail);
                    }else if(oDetail.action == "as"){
                        oTemplate.navTo = false;
                        this.fnMessageRecommendationObjectsAssign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "uas"){
                        oTemplate.navTo = false;
                        this.fnMessageRecommendationObjectsUnassign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "d"){
                        oTemplate.navTo = false;
                        this.fnMessageRecommendationRemove(oTemplate, oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "MSP":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageMSPCreate(oTemplate, oLogDetail, oReference);
                    } else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageMSPUpdate(oTemplate, oLogDetail,oReference);
                    } else if(oDetail.action == "a"){
                        oTemplate.navTo = false;
                        this.fnMessageMSPAttach(oTemplate, oLogDetail);
                    }else if(oDetail.action == "ar"){
                        oTemplate.navTo = false;
                        this.fnMessageMSPAttachmentRemove(oTemplate, oLogDetail);
                    }else if(oDetail.action == "as"){
                        oTemplate.navTo = false;
                        this.fnMessageMSPObjectsAssign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "uas"){
                        oTemplate.navTo = false;
                        this.fnMessageMSPObjectsUnassign(oTemplate, oLogDetail);
                    }else if(oDetail.action == "d"){
                        oTemplate.navTo = false;
                        this.fnMessageMSPRemove(oTemplate, oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "PMFI":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageFindingsCreate(oTemplate, oLogDetail, oReference);
                    }else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageFindingsUpdate(oTemplate, oLogDetail,oReference);
                    }else if (oDetail.action == "as") {
                        oTemplate.navTo = false;
                        if (oTemplate.bIsInspPresent) {
                            this.fnMessageFindingsObjectsAssign(oTemplate, oLogDetail);
                        } else {
                            this.fnMessageFindingsAssign(oTemplate, oLogDetail);
                        }
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "OPTA":
                    if(oDetail.action == "c"){
                        oTemplate.navTo = false;
                        that.fnMessageCreateOptimization(oTemplate, oLogDetail, oReference);
                    }else if(oDetail.action == "u"){
                        oTemplate.navTo = false;
                        oTemplate.detailText =  that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessagesOptimizationUpdate(oTemplate, oLogDetail,oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;
                case "testObject":
                    oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                    oTemplate.text = "Template details updated";
                    oTemplateData.push(oTemplate);
                    break;
                case "RCA":
                    if (oDetail.action === "c") {
                        oTemplate.navTo = false;
                        that.fnMessageRCACreate(oTemplate, oLogDetail, oReference);
                    } else if (oDetail.action === "u") {
                        oTemplate.navTo = false;
                        oTemplate.detailText = that._oi18n.getText("asint.timeline.customAction.btn.details.text");
                        that.fnMessageRCAUpdate(oTemplate, oLogDetail, oReference);
                    }
                    oTemplateData.push(oTemplate);
                    break;

                }
                
            }
            that.parsedTimelineData = oTemplateData;
            if(fnSuccess){
                fnSuccess(oTemplateData);
            }
        },

        /**
         * Function to format date
         * @param {Object} oDate 
         * @returns 
         */
        fnParseDate: function (oDate) {
            if (oDate) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "MMM dd, yyyy, HH:mm:ss aa"
                });

                var curDate = new Date(oDate);
                var dateVal = oDateFormat.format(curDate);
                return dateVal;
            }
            return oDate;
        },

        /**
         * Function to generate timeline view
         * @param {Object} controllerRef 
         * @param {String} sContId 
         * @param {String} appName 
         * @param {String} sObjectId 
         */
        fnGenerateTimelineView : function(controllerRef, sContId, appName, sObjectId, sName, sFrom, creatededByObj){
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            this._oi18n = oI18n;
            this.controllerRef = controllerRef;
            this._createdByObj = creatededByObj;
            if(sName){
                this._objectName = sName;
            }
            this._sAppName = appName;
            this._sFrom = sFrom;
            var that = this;
            var oVbox = controllerRef.getView().byId(sContId);
            oVbox.removeAllItems();
            this.VboxRef = oVbox;

            that.fnGetTimeLineData(appName, sObjectId, function(aTimelineData){
                that.fnRenderTimeLineItems(aTimelineData, oVbox);
            });

        },

        /**
         * Function to render timeline items
         * @param {Array} aTimelineData 
         * @param {Object} oVbox 
         */
        fnRenderTimeLineItems : function(aTimelineData, oVbox){
            var that = this;
            oVbox.removeAllItems();
            var oTimeLine = new sap.suite.ui.commons.Timeline({
                enableDoubleSided:true,
                growingThreshold : 10,
                textHeight:"10",
                filterTitle : "User",
                sortOldestFirst : false,
                enableSocial : true,
                lazyLoading : true,
                enableScroll : false,
                groupBy : "dateTime",
                width : "100%"
            }).addStyleClass("timeLineMaxWidthCls");

            var oSelect = new sap.m.Select({
                selectedKey: "None",
                /**
                 * Function to handle group type change
                 * @param {Object} oEvent 
                 */
                change: function (oEvent) {
                    that.fnChangeGroupType(oEvent);
                }
            });

            var aGroupDropDown = [
                {"key":"None", "text":"None"},
                {"key":"Year", "text":"Year"},
                {"key":"Month", "text":"Month"},
                {"key":"Week", "text":"Week"},
                {"key":"Day", "text":"Day"}
            ];
            aGroupDropDown.forEach(function(oGroup){
                var oDDItem = new Item({
                    key : oGroup.key,
                    text : oGroup.text
                });
                oSelect.addItem(oDDItem);
            });
            var oLabel = new sap.m.Label({
                "text": that._oi18n.getText("asint.timeline.groupBy.text") + ":"
            }).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginTop");
            var oHbox = new sap.m.HBox({
                renderType : "Bare"
            });
            oHbox.addItem(oLabel);
            oHbox.addItem(oSelect);
            var oToolbar = oTimeLine.getHeaderBar();
            oToolbar.addContent(oHbox);
            var oTestData = {
                "Data":{
                    "UserComment":"",
                    "SelectedTimeLine":"",
                    "TimeLineId":"",
                    "TimelineData":"",
                    "CommentsList":[{
                        "sender": "Sarath Kumar",
                        "text": "test comment",
                        "timestamp": "Sep 08, 2023, 09:10:20 AM"
                    },{
                        "sender": "Jarret",
                        "text": "test comment 2",
                        "timestamp": "Sep 18, 2023, 09:10:20 AM"
                    }]
                }
            };
            var oModel = new JSONModel(oTestData);
            oTimeLine.setModel(oModel, "oTimeModel");
            if(aTimelineData.length > 0){
                aTimelineData.forEach(function(oTime){
                    var oCustomReply = new sap.m.Popover({
                        showHeader : false,
                        contentHeight : "35%",
                        contentWidth : "30%",
                        content : [],
                        footer : new sap.m.Toolbar({
                            content: [
                                new sap.m.TextArea({
                                    width : "85%",
                                    value : "{oTimeModel>/Data/UserComment}"
                                }),
                                new sap.m.ToolbarSpacer(),
                                new sap.m.Button({
                                    icon : "sap-icon://feeder-arrow",
                                    tooltip : that._oi18n.getText("asint.timeline.comment.send.tooltip"),
                                    /**
                                     * Function to send reply of a post
                                     * @param {Object} oEvent 
                                     */
                                    press : function(oEvent){
                                        that.onClickReplyPost(oEvent);
                                    }
                                })  
                            ]
                        })
                    });

                    // var oCommentsList = new sap.m.List();
                    var oCommentVbox =  new sap.m.VBox();
                    oTime.commentsList.forEach(function(oComment){
                        var oHbox = new sap.m.HBox().addStyleClass("sapUiTinyMarginBottom");
                        var oAvatar = new sap.m.Avatar({
                            initials : oComment.initials,
                            displaySize : "XS"
                        }).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop");
                        oHbox.addItem(oAvatar);

                        var oFeed = new sap.m.FeedListItem({
                            sender : oComment.sender,
                            text : oComment.text,
                            showIcon : false,
                            timestamp : oComment.timestamp,
                            convertLinksToAnchorTags : "All",
                            maxCharacters : 250,
                            /**
                             * Function to handle sender press
                             * @param {Object} oEvent 
                             */
                            senderPress:function(oEvent){
                                var sEmail = oEvent.getSource().getProperty("sender");
                                that.fnHandleReplySenderPress(sEmail);
                            }
                        }).addStyleClass("asintFeedListItemPaddingCls sapUiTinyMarginTop");
                        oHbox.addItem(oFeed);
                        // oCommentsList.addItem(oFeed);
                        oCommentVbox.addItem(oHbox);
                    });
                    oCustomReply.addContent(oCommentVbox);
                    oCustomReply.setModel(oModel, "oTimeModel");

                    var oCustomAction = new sap.ui.core.CustomData({
                        key: oTime.detailKey,
                        value: oTime.detailText
                    });

                    var oItem = new TimelineItem({
                        dateTime: oTime.dateTime,
                        title: oTime.subheader,
                        userNameClickable : oTime.navTo,
                        text : oTime.text,
                        userName : oTime.header,
                        filterValue : oTime.subheader,
                        replyCount : oTime.replyCount,
                        icon : oTime.Icon,
                        userPicture : that.fnGetSvgForUserInitials(oTime.subheader),
                        customReply: oCustomReply,
                        customAction : oCustomAction,
                        /**
                         * Function to handle user name click
                         * @param {Object} oEvent 
                         */
                        userNameClicked : function(oEvent){
                            that.fnTimeLineHeaderClick(oEvent, that._sAppName);
                        },
                        /**
                         * Function to handle user replies
                         * @param {Object} oEvent 
                         */
                        replyListOpen : function(oEvent){
                            that.fnTimeLineReplyClick(oEvent);
                        },
                        /**
                         * Function to handle custom action click
                         * @param {Object} oEvent 
                         */
                        customActionClicked : function(oEvent){
                            that.fnTimeLineDetailClick(oEvent);
                        }
                    }).addStyleClass("asintTimelineAvatarFontSize");

                    var oCustomData = new sap.ui.core.CustomData({
                        key: "rowData",
                        value: oTime
                    });
                
                    oItem.addCustomData(oCustomData);
                    oTimeLine.addContent(oItem);
                });
            }
            that.timeLineRef = oTimeLine;
            oVbox.addItem(oTimeLine);
        },

        /**
         * Fucntion to format camel cased string and retrun normal string
         * @param {String} sText 
         * @returns 
         */
        fnReturnFormattedFieldAfterCamelCase : function(sText){
            if(sText){
                var words = sText.split(/(?=[A-Z])/);
                words = words.map(function(word){
                    return word.charAt(0).toUpperCase() + word.slice(1);
                });
                return words.join(" ");
            }
            return "";
        },
        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageEquipmentUpdate : function(oTemplate, oLogDetail, oReference){
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","child_equipments", "to_object_template", "to_cml_template_collection","to_generalTask","to_operation","to_maintenanceOrder","to_cmls","to_documents","to_attached_assessment","to_value","to_class","parent_equipment_ID","parent_functional_location_ID","RISK_SCORE","rcaAssessmentModifiedAt","RNC_ASSESSMENT_ID","ECOM_MR","rcaAssessmentCreatedBy","SHE_MR","rcaAssessmentCreatedAt","alphaNumericRiskScore",
                "rcaAssessmentName","CRITICALITY_TEXT","rcaAssessmentShortDescp","SHE_UMR","rcaAssessmentModifiedBy","ECOM_UMR","rcaAssessmentName"
            ];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){
                    var oChanges = {};
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    if(oLogDetail[logCounter].field == "CRITICALITY_CODE"){
                        fieldName = "Criticality"
                    }
                    if(oLogDetail[logCounter].field == "masterDataAttribution"){
                        fieldName = "Equipment MDA"
                    }
                    //For detail popup
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    if(typeof(oLogDetail[logCounter].oldData) === "object"){
                        oChanges.OldValue = "";
                    }
                    if(oLogDetail[logCounter].field == "functionalLocationName"){
                        fieldName = "Functional Location Description";
                    }
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field === "parent_equipment" || oLogDetail[logCounter].field === "parent_functional_location"){
                        fieldName = "Parent Equipment";
                        if(oLogDetail[logCounter].field === "parent_functional_location"){
                            fieldName = "Parent Functional Location";
                        }
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData.name){
                            oChanges.OldValue = oLogDetail[logCounter].oldData.name;
                        }
                        oChanges.NewValue = oLogDetail[logCounter].newData.name;
                    }
                    if(oLogDetail[logCounter].field === "to_description"){
                        fieldName = "Short Description";
                        var oChangesLong = {};
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].longDescription){
                            oChangesLong.Description = "Long Description";
                            oChangesLong.NewValue = oLogDetail[logCounter].newData[0].longDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].longDescription){
                                oChangesLong.OldValue = oLogDetail[logCounter].oldData[0].longDescription;
                            }
                            oTemplate.changes.push(oChangesLong);
                            aLogs.push(oChangesLong);
                        }
                        var oChangesShort = {};
                        oChangesShort.OldValue = "";
                        oChangesShort.NewValue = "";
                        oChangesShort.Description = fieldName;
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].shortDescription){
                            oChangesShort.NewValue = oLogDetail[logCounter].newData[0].shortDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].shortDescription){
                                oChangesShort.OldValue = oLogDetail[logCounter].oldData[0].shortDescription;
                            }
                            oTemplate.changes.push(oChangesShort);
                            aLogs.push(oChangesShort);
                        }
                    }
                    if(fieldName && fieldName != "Short Description" && fieldName != "Long Description"){
                        oChanges.Description = fieldName;
                        oTemplate.changes.push(oChanges);
                        aLogs.push(oChanges);
                    }
                }
                if(oLogDetail[logCounter].rcaAssessmentDetails){
                    var oChangesRCA = {};
                    var oRcaDetails = oLogDetail[logCounter].rcaAssessmentDetails;
                    fieldName = "RCA Assessment";
                    oChangesRCA.oldValue = "";
                    oChangesRCA.NewValue = oRcaDetails.rcaAssessmentDesc;
                    oChangesRCA.Description = fieldName;
                    oChangesRCA.RCAId = oRcaDetails.rncAssessmentId;
                    oTemplate.changes.push(oChangesRCA);
                    oTemplate.navTo = true
                    // aLogs.push(oChangesRCA);
                }
            }
            if(oReference){
                var referenceValues = this.equipemntReferenceValues(oReference);
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.equipment.update.header", [referenceValues.Name]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.equipment.update.text", [referenceValues.Name, referenceValues.desc]) + "\n"; //Text as per the actin
            }else{
                if(oTemplate.detailKey != "download"){
                    oTemplate.header = this._oi18n.getText("asint.timeline.equipment.update.header", [that._objectName]); // Header as per the action
                    oTemplate.text = this._oi18n.getText("asint.timeline.equipment.update.text", [that._objectName]) + "\n"; //Text as per the actin
                    aLogs.sort(function (a, b) {
                        var title1 = "";
                        var title2 = "";
                        if(a.Description){
                            title1 = a.Description.toUpperCase();
                        } 
                        if(b.Description){
                            title2 = b.Description.toUpperCase();
                        } 
                        if (title1 < title2) {
                            return -1; 
                        } else if (title1 > title2) {
                            return 1; 
                        } else {
                            return 0; 
                        }
                    });
                    if(aLogs.length > 0){
                        aLogs.forEach(function(oLog){
                            oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                            oTemplate.text = oTemplate.text + "\n";
                        })
                    }
                }
            }
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageEquipmentCreate : function(oTemplate, oLogDetail){
            var sName = oLogDetail.name;
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.equipment.add.header", [sName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.equipment.add.text", [sName, sDisplayId]) + "\n"; //Text as per the actin
        },

        /**
         * Function to format message for equipment attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageEquipmentObjectsAssign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.equipment.update.header", [that._objectName]); // Header as per the action
            oTemplate.navTo = true;
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_cml_template_collection"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;

                    if (Array.isArray(oLogDetail[logCounter].newData)) {
                        oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                            aDisplayIds.push(oAssignObj.displayId);
                            if(sDisplayIds){
                                sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                            }else{
                                sDisplayIds = oAssignObj.displayId;
                            }
                        });
                    }
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.equipment.assignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for equipment attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageEquipmentObjectsUnassign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.equipment.update.header", [that._objectName]); // Header as per the action
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_cml_template_collection"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.equipment.unAssignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for equipment attachments assign
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageEquipmentAttach: function (oTemplate, oLogDetail) {
            var that = this;
            oTemplate.detailKey = this._customActionKey.download;
            oTemplate.detailText = this._oi18n.getText("asint.timeline.customAction.download.text");
            oTemplate.header = this._oi18n.getText("asint.timeline.equipment.attach.header");
            oTemplate.Icon = that._icons["att"];
            var sDisplayIds = "";
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field === "to_documents" && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    oChanges.Description = "";
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oDoc){
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oDoc.displayId;
                        }else{
                            sDisplayIds = oDoc.displayId;
                        }
                    });
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.equipment.attach.text",[sDisplayIds]) + "\n";
        },

        /**
         * Function to format message for equipment attachments unassign
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageEquipmentAttachmentRemove : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.equipment.unAssignAttach.header");
            oTemplate.Icon = that._icons["att"];
            var sDisplayIds = "";
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field === "to_documents" && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    oChanges.Description = "";
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oDoc){
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oDoc.displayId;
                        }else{
                            sDisplayIds = oDoc.displayId;
                        }
                    });
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.equipment.unAssignAttach.text",[sDisplayIds]) + "\n";
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageEquipmentRemove : function(oTemplate){
            oTemplate.header = this._oi18n.getText("asint.timeline.equipment.remove.header", [that._objectName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.equipment.remove.text", [that._objectName]) + "\n"; //Text as per the actin
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageFunctionalLocationUpdate : function(oTemplate, oLogDetail, oReference){
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","child_equipments","child_locations", "to_object_template","to_cml_template_collection","to_generalTask","to_operation","to_maintenanceOrder","to_cmls","to_documents","to_attached_assessment","to_value","to_class","parent_location_ID","RISK_SCORE"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){
                    var oChanges = {};
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    if(oLogDetail[logCounter].field == "CRITICALITY_CODE"){
                        fieldName = "Criticality"
                    }
                    //For detail popup
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    if(typeof(oLogDetail[logCounter].oldData) === "object"){
                        oChanges.OldValue = "";
                    }
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field === "parent_location"){
                        fieldName = "Parent Location";
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData.name){
                            oChanges.OldValue = oLogDetail[logCounter].oldData.name;
                        }
                        oChanges.NewValue = oLogDetail[logCounter].newData.name;
                    }
                    if(oLogDetail[logCounter].field === "to_description"){
                        fieldName = "Short Description";
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].longDescription){
                            var oChangesLong = {};
                            oChangesLong.Description = "Long Description";
                            oChangesLong.NewValue = oLogDetail[logCounter].newData[0].longDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].longDescription){
                                oChangesLong.OldValue = oLogDetail[logCounter].oldData[0].longDescription;
                            }
                            oTemplate.changes.push(oChangesLong);
                            aLogs.push(oChangesLong);
                        }
                        var oChangesShort = {};
                        oChangesShort.OldValue = "";
                        oChangesShort.NewValue = "";
                        oChangesShort.Description = fieldName;
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].shortDescription){
                            oChangesShort.NewValue = oLogDetail[logCounter].newData[0].shortDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].shortDescription){
                                oChangesShort.OldValue = oLogDetail[logCounter].oldData[0].shortDescription;
                            }
                            oTemplate.changes.push(oChangesShort);
                            aLogs.push(oChangesShort);
                        }
                    }
                    if(fieldName && fieldName != "Short Description" && fieldName != "Long Description"){
                        oChanges.Description = fieldName;
                        oTemplate.changes.push(oChanges);
                        aLogs.push(oChanges);
                    }
                }
                if(oLogDetail[logCounter].rcaAssessmentDetails){
                    var oChangesRCA = {};
                    var oRcaDetails = oLogDetail[logCounter].rcaAssessmentDetails;
                    fieldName = "RCA Assessment";
                    oChangesRCA.oldValue = "";
                    oChangesRCA.NewValue = oRcaDetails.rcaAssessmentDesc;
                    oChangesRCA.Description = fieldName;
                    oChangesRCA.RCAId = oRcaDetails.rncAssessmentId;
                    oTemplate.changes.push(oChangesRCA);
                    oTemplate.navTo = true
                    aLogs.push(oChangesRCA);
                }
            }
            if(oReference){
                var referenceValues = this.equipemntReferenceValues(oReference);
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.functionallocation.update.header", [referenceValues.Name]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.functionallocation.update.text", [referenceValues.Name, referenceValues.desc]) + "\n"; //Text as per the actin
            }else{
                if(oTemplate.detailKey != "download"){
                    oTemplate.header = this._oi18n.getText("asint.timeline.functionallocation.update.header", [that._objectName]); // Header as per the action
                    oTemplate.text = this._oi18n.getText("asint.timeline.functionallocation.update.text", [that._objectName]) + "\n"; //Text as per the actin
                    aLogs.sort(function (a, b) {
                        var title1 = "";
                        var title2 = "";
                        if(a.Description){
                            title1 = a.Description.toUpperCase();
                        } 
                        if(b.Description){
                            title2 = b.Description.toUpperCase();
                        } 
                        if (title1 < title2) {
                            return -1; 
                        } else if (title1 > title2) {
                            return 1; 
                        } else {
                            return 0; 
                        }
                    });
                    if(aLogs.length > 0){
                        aLogs.forEach(function(oLog){
                            oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                            oTemplate.text = oTemplate.text + "\n";
                        })
                    }
                }
            }
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageFunctionalLocationCreate : function(oTemplate, oLogDetail){
            var sName = oLogDetail.name;
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.functionallocation.add.header", [sName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.functionallocation.add.text", [sName, sDisplayId]) + "\n"; //Text as per the actin
        },

        /**
         * Function to format message for functional location assignments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageFunctionalLocationObjectsAssign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.functionallocation.update.header", [that._objectName]); // Header as per the action
            oTemplate.navTo = true;
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_cml_template_collection"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.functionallocation.assignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for functional location unassignments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageFunctionalLocationObjectsUnassign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.functionallocation.update.header", [that._objectName]); // Header as per the action
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_cml_template_collection"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.functionallocation.unAssignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageFunctionalLocationRemove : function(oTemplate){
            oTemplate.header = this._oi18n.getText("asint.timeline.functionallocation.remove.header", [that._objectName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.functionallocation.remove.text", [that._objectName]) + "\n"; //Text as per the actin
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         */
        fnMessageAttachmentCreate : function(oTemplate, oLogDetail){
            var sDisplayId = oLogDetail.displayId;
            var sFileName = "";
            if(oLogDetail.to_file){
                sFileName = oLogDetail.to_file.name;
            }
            var oChanges = {};
            oChanges.Description = "";
            oChanges.OldValue = [];
            oChanges.NewValue = [{"document_ID":oLogDetail.ID}];
            oTemplate.changes.push(oChanges);
            oTemplate.detailKey = this._customActionKey.download;
            oTemplate.detailText = this._oi18n.getText("asint.timeline.customAction.download.text");
            oTemplate.header = this._oi18n.getText("asint.timeline.attachment.create.header"); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.attachment.create.text", [sFileName, sDisplayId]) + "\n"; //Text as per the actin
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageAttachmentUpdate : function(oTemplate, oLogDetail, oReference){
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_assessment","to_equipment","to_functionalLocation","to_maintenanceOrder"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    //For detail popup
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    if(typeof(oLogDetail[logCounter].oldData) === "object"){
                        oChanges.OldValue = "";
                    }
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field === "to_description"){
                        fieldName = "Short Description";
                        var oChangesLong = {};
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].longDescription){
                            oChangesLong.Description = "Long Description";
                            oChangesLong.NewValue = oLogDetail[logCounter].newData[0].longDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].longDescription){
                                oChangesLong.OldValue = oLogDetail[logCounter].oldData[0].longDescription;
                            }
                            oTemplate.changes.push(oChangesLong);
                            aLogs.push(oChangesLong);
                        }
                        var oChangesShort = {};
                        oChangesShort.OldValue = "";
                        oChangesShort.NewValue = "";
                        oChangesShort.Description = fieldName;
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].shortDescription){
                            oChangesShort.NewValue = oLogDetail[logCounter].newData[0].shortDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].shortDescription){
                                oChangesShort.OldValue = oLogDetail[logCounter].oldData[0].shortDescription;
                            }
                            oTemplate.changes.push(oChangesShort);
                            aLogs.push(oChangesShort);
                        }
                    }
                    if(fieldName != "Short Description" && fieldName != "Long Description"){
                        oChanges.Description = fieldName;
                        oTemplate.changes.push(oChanges);
                        aLogs.push(oChanges);
                    }
                }
            }
            if(oReference){
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.attachment.update.header",[that._objectName]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.attachment.update.text", [that._objectName]) + "\n"; //Text as per the actin
            }else{
                oTemplate.header = this._oi18n.getText("asint.timeline.attachment.update.header",[that._objectName]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.attachment.update.text", [that._objectName]) + "\n"; //Text as per the actin
                aLogs.sort(function (a, b) {
                    var title1 = "";
                    var title2 = "";
                    if(a.Description){
                        title1 = a.Description.toUpperCase();
                    } 
                    if(b.Description){
                        title2 = b.Description.toUpperCase();
                    } 
                    if (title1 < title2) {
                        return -1; 
                    } else if (title1 > title2) {
                        return 1; 
                    } else {
                        return 0; 
                    }
                });
                if(aLogs.length > 0){
                    aLogs.forEach(function(oLog){
                        oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                        oTemplate.text = oTemplate.text + "\n";
                    })
                }
            }
        },

        /**
         * Function to format message for equipment attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageAttchmentObjectsAssign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.attachment.update.header", [that._objectName]); // Header as per the action
            oTemplate.navTo = true;
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.attachment.assignUpdate.text", [that._objectName, sField, sDisplayIds]) + "\n"; //Text as per the action
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for equipment attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageAttachmentObjectsUnassign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.attachment.update.header", [that._objectName]); // Header as per the action
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.attachment.unAssignUpdate.text", [that._objectName, sField, sDisplayIds]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageAttachmentRemove : function(oTemplate){
            oTemplate.header = this._oi18n.getText("asint.timeline.attachment.remove.header", [that._objectName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.attachment.remove.text", [that._objectName]) + "\n"; //Text as per the actin
        },

        /**
         * Functio to format reference object
         * @param {Object} reference 
         * @returns Object
         */
        equipemntReferenceValues: function (reference) {
            var equipRef = {
                "Name": reference.name,
                "desc": reference.displayId
            };
            return equipRef;
        },

        /**
         * Function to get svg for user initials
         * @param {String} sUserName 
         * @returns 
         */
        fnGetSvgForUserInitials : function(sUserName){
            var sInitials = "";
            if(sUserName){
                var aSplit1 = sUserName.split("@");
                if(aSplit1.length > 0){
                    var aSplit2 = aSplit1[0].split(".");
                    if(aSplit2.length > 0){
                        sInitials = aSplit2[0][0].toUpperCase();
                    }
                    if(aSplit2.length > 1){
                        sInitials = sInitials + aSplit2[1][0].toUpperCase();
                    }
                }
            }
            if(!sInitials){
                sInitials = "DU";
            }
            var svgString = "<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='40' fill='#d1efff'/><text x='50' y='65' font-size='40' text-anchor='middle' fill='#0057d2' font-family='Arial,Helvetica,sans-serif'>"+ sInitials +"</text></svg>";
            
            const blob = new Blob([svgString], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            
            return img.src;
        },

        /**
         * Function to return user initials based on user email
         * @param {String} sUserName 
         */
        fnReturnUserInitials : function(sUserName){
            var sInitials = "";
            if(sUserName){
                var aSplit1 = sUserName.split("@");
                if(aSplit1.length > 0){
                    var aSplit2 = aSplit1[0].split(".");
                    if(aSplit2.length > 0){
                        sInitials = aSplit2[0][0].toUpperCase();
                    }
                    if(aSplit2.length > 1){
                        sInitials = sInitials + aSplit2[1][0].toUpperCase();
                    }
                }
            }
            if(!sInitials){
                sInitials = "DU";
            }
            return sInitials;
        },

        /**
         * Function on click of timeline header
         */
        fnTimeLineHeaderClick : function(oEvent, sApp){
            var that = this;
            var selectedRowData = oEvent.getSource().getAggregation("customData")[0].getProperty("value");
            var aChanges = selectedRowData.changes;
            // if(this._sFrom != "TimelineDetail" && (sApp == "EQUI" || sApp === "FLOC")){
            //     if(aChanges && aChanges.length > 0){
            //         var sField = aChanges[0].Description;
            //         if(sField === "Object Template" || sField === "Class"){
            //             var oObjectLayout = that.controllerRef.getView().getParent().getParent().getParent().getParent().getParent();
            //             var oReqSection = oObjectLayout.getSections()[3];
            //             oObjectLayout.setSelectedSection(oReqSection);
            //         }
            //     }
            // }
            if(aChanges && aChanges.length > 0){
                var sNavField = aChanges[0].Description;
                aChanges.forEach(function(oLog){
                    if(oLog.Description === "RCA Assessment"){
                        sNavField = "RCA Assessment"
                    }
                });
                if(sApp === "RECO"){
                    sNavField = "Reco_Assessment";
                }
                if(sApp === "MSP"){
                    sNavField = "MSP_Assessment";
                }
                switch(sNavField){
                case "Assessment":
                    that.fnNavigatetoAssessment(aChanges);
                    break;
                case "Equipment":
                    that.fnNavigatetoEquipment(aChanges);
                    break;
                case "Functional Location":
                    that.fnNavigatetoFLOC(aChanges);
                    break;
                case "Criticality":
                    that.fnNavigatetoRCAAssessment(aChanges);
                    break;
                case "RCA Assessment":
                    that.fnNavigatetoRCAAssessment(aChanges);
                    break;
                case "Note":
                    that.fnNavigatetoRCAAssessment(aChanges);
                    break;
                case "Reco_Assessment":
                    that.fnNavigatetoRecoAssessment(aChanges);
                    break;
                case "MSP_Assessment":
                    that.fnNavigatetoRecoAssessment(aChanges);
                    break;
                case "Object Template":
                    if(this._sFrom != "TimelineDetail" && (sApp == "EQUI" || sApp === "FLOC")){
                        var oObjectLayout = that.controllerRef.getView().getParent().getParent().getParent().getParent().getParent();
                        var oReqSection = oObjectLayout.getSections()[3];
                        oObjectLayout.setSelectedSection(oReqSection);
                    }else{
                        that.fnNavigateToTemplateEQUIorFLOC(aChanges);
                    }
                    break;
                case "Class":
                    if(this._sFrom != "TimelineDetail" && (sApp == "EQUI" || sApp === "FLOC")){
                        var oObjectLayout1 = that.controllerRef.getView().getParent().getParent().getParent().getParent().getParent();
                        var oReqSection1 = oObjectLayout1.getSections()[3];
                        oObjectLayout1.setSelectedSection(oReqSection1);
                    }else{
                        that.fnNavigateToTemplateEQUIorFLOC(aChanges);
                    }
                    break;
                }
            }
        },

        /**
         * Function to navigate to equipmnet detail
         * @param {Array} aChanges 
         */
        fnNavigatetoEquipment : function(aChanges){
            var aNewValue = aChanges[0].NewValue;
            var sEquId = aNewValue[0].equipment_ID;
            var sUrl = this.NAVIGATION.EQUIPMENT_DETAIL;
            if(aNewValue.length > 1){
                this.fnOpenNavigationDialogMultipleItems(aNewValue, "equipment_ID", "equipmentId", sUrl);
            }else{
                this.fnPerformCrossNavigation(this.NAVIGATION.EQUIPMENT_DETAIL, {
                    "equipmentId":sEquId
                });
            }
        },

        /**
         * Function to navigate to functional location detail
         * @param {Array} aChanges 
         */
        fnNavigatetoFLOC : function(aChanges){
            var aNewValue = aChanges[0].NewValue;
            var sFLOCId = aNewValue[0].functionalLocation_ID;
            var sUrl = this.NAVIGATION.LOCATION_DETAIL;
            if(aNewValue.length > 1){
                this.fnOpenNavigationDialogMultipleItems(aNewValue, "functionalLocation_ID", "functionallocationId", sUrl);
            }else{
                var sHashWithKeyword = this.NAVIGATION.LOCATION_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{functionallocationId}", sFLOCId);
                var newUrl = that.setNavUrl(window, sHashWithKeyword);
                window.open(newUrl, "_blank");
                // this.fnPerformCrossNavigation(this.NAVIGATION.LOCATION_DETAIL, {
                //     "functionallocationId":sFLOCId
                // });
            }
        },

        /**
         * Function to navigate to assessment detail
         * @param {Array} aChanges 
         */
        fnNavigatetoAssessment : function(aChanges){
            var aNewValue = aChanges[0].NewValue;
            var sAssessmentId = aNewValue[0].assessment_ID;
            var sUrl = this.NAVIGATION.ASSET_STRATEGY_DETAIL;
            if(aNewValue.length > 1){
                this.fnOpenNavigationDialogMultipleItems(aNewValue, "assessment_ID", "assetStrategyId", sUrl);
            }else{
                var sHashWithKeyword = this.NAVIGATION.ASSET_STRATEGY_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{assetStrategyId}", sAssessmentId);
                var newUrl = that.setNavUrl(window, sHashWithKeyword);
                window.open(newUrl, "_blank");
                // this.fnPerformCrossNavigation(this.NAVIGATION.ASSET_STRATEGY_DETAIL, {
                //     "assetStrategyId":sAssessmentId
                // });
            }
        },

        /**
         * Function to navigate to assessment detail
         * @param {Array} aChanges 
         */
        fnNavigatetoRecoAssessment : function(aChanges){
            var that = this;
            var sAssessmentId; 
            if(aChanges && aChanges.length > 0){
                aChanges.forEach(function(oChange){
                    if(oChange.Description == "New Assessment"){
                        sAssessmentId = oChange.assessmentId;
                    }
                })
            }
            if(sAssessmentId){
                var sHashWithKeyword = this.NAVIGATION.ASSET_STRATEGY_DETAIL;
                sHashWithKeyword = sHashWithKeyword.replace("{assetStrategyId}", sAssessmentId);
                var newUrl = that.setNavUrl(window, sHashWithKeyword);
                window.open(newUrl, "_blank");
            }else{
                that.fnMessageShow("E", that._oi18n.getText("timeline.message05"));
            }
        },

        /**
         * Function to navigate to assessment detail
         * @param {Array} aChanges 
         */
        fnNavigatetoRCAAssessment : function(aChanges){
            var that = this;
            var sAssessmentId; 
            if(aChanges && aChanges.length > 0){
                aChanges.forEach(function(oChange){
                    if(oChange.Description == "RCA Assessment"){
                        sAssessmentId = oChange.RCAId;
                    }
                })
            }
            // var sHashWithKeyword = this.NAVIGATION.RISK_AND_CRITICALITY_DETAIL;
            var sHashWithKeyword = this.NAVIGATION.RCA_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{assessmentId}", sAssessmentId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            if(sAssessmentId){
                window.open(newUrl, "_blank");
            }else{
                that.fnMessageShow("E", that._oi18n.getText("timeline.message05"));
            }
        },

        /**
         * Function to navigate to specific equipment or floc for which the user has assigned
         * object template or class
         * @param {Array} aChanges 
         */
        fnNavigateToTemplateEQUIorFLOC : function(aChanges){
            var aNewValue = aChanges[0].NewValue;
            var sHashWithKeyword="";
            var newUrl="";
            if(aNewValue && aNewValue.length > 0){
                var sType = aNewValue[0].objectType;
                if(sType === "EQUI"){
                    sHashWithKeyword = this.NAVIGATION.EQUIPMENT_DETAIL;
                    sHashWithKeyword = sHashWithKeyword.replace("{equipmentId}", aNewValue[0].objectId);
                    newUrl = that.setNavUrl(window, sHashWithKeyword);
                    window.open(newUrl, "_blank");
                    // this.fnPerformCrossNavigation(this.NAVIGATION.EQUIPMENT_DETAIL, {
                    //     "equipmentId":aNewValue[0].objectId
                    // });
                }else{
                    sHashWithKeyword = this.NAVIGATION.LOCATION_DETAIL;
                    sHashWithKeyword = sHashWithKeyword.replace("{functionallocationId}", aNewValue[0].objectId);
                    newUrl = that.setNavUrl(window, sHashWithKeyword);
                    window.open(newUrl, "_blank");
                    // this.fnPerformCrossNavigation(this.NAVIGATION.LOCATION_DETAIL, {
                    //     "functionallocationId":aNewValue[0].objectId
                    // });
                }
            }
        },

        /**
         * Function to open dialog for navigation selection incase of multiple items
         * @param {Array} aNavIds 
         * @param {String} sType 
         */
        fnOpenNavigationDialogMultipleItems : function(aNavIds, sKey, sParam, sUrl){
            var that = this;
            var aIds = [];
            aNavIds.forEach(function(oNav){
                var oTemp = {
                    "ID":oNav[sKey],
                    "displayId":oNav.displayId
                }
                aIds.push(oTemp);
            })
            var oDataModel = new JSONModel({
                "list":aIds,
                "param":sParam,
                "url":sUrl,
                "column1":that._oi18n.getText("asint.timeline.navDialog.table.column.displayId.text"),
                "title":that._oi18n.getText("asint.timeline.navDialog.table.header.text"),
                "close":that._oi18n.getText("asint.timeline.navDialog.close.text"),
                "noDataText" : that._oi18n.getText("asint.timeline.changesDialog.table.noData.text"),
            });
            if (!this._oNavDialog) {
                this._oNavDialog = sap.ui.xmlfragment("com.asint.ais.library.fragment.selectNavItemDialog", this);
            }
            this.controllerRef.getView().addDependent(this._oNavDialog);
            this._oNavDialog.setModel(oDataModel,"oNavModel");
            this._oNavDialog.open();
        },

        /**
         * Function to perform navigation
         * @param {Object} oEvent 
         */
        onSelectOneItemForNavigation : function(oEvent){
            var oSelObj = oEvent.getSource().getBindingContext("oNavModel").getObject();
            var sId = oSelObj.ID;
            var oProps = oEvent.getSource().getModel("oNavModel").getData();
            var sParam = oProps.param;
            var oNavObj = {};
            oNavObj[sParam] = sId;
            this.onCloseNavSelectDialog();
            this.fnPerformCrossNavigation(oProps.url, oNavObj);
        },

        /**
         * Function to close navigation select dialog
         */
        onCloseNavSelectDialog : function(){
            if(this._oNavDialog){
                this._oNavDialog.close();
            }
        },

        /**
         * Function to search navigation display id list
         * @param {Object} oEvent 
         */
        fnSearchDialogNavList : function(oEvent){
            var sValue = oEvent.getParameter("value");
            if(sValue){
                var oFilter = new Filter([
                    new Filter("displayId", FilterOperator.Contains, sValue),
                ]);
                oEvent.getSource().getParent().getParent().getBinding("items").filter([oFilter]);
            }else{
                oEvent.getSource().getParent().getParent().getBinding("items").filter([]);
            }
        },

        /**
         * Function on click of timeline reply
         * @param {Object} oEvent 
         */
        fnTimeLineReplyClick : function(oEvent){
            var oModel = this.timeLineRef.getModel("oTimeModel");
            var selectedRowData = oEvent.getSource().getAggregation("customData")[0].getProperty("value");
            oModel.setProperty("/Data/SelectedTimeLine", selectedRowData);
            oModel.setProperty("/Data/TimeLineId", selectedRowData.timeLineId);
        },

        /**
         * Function to handle timeline detail
         * @param {Object} oEvent 
         */
        fnTimeLineDetailClick : function(oEvent){
            var that = this;
            var detailKey = oEvent.getSource().getAggregation("customAction")[0].getProperty("key");
            var selectedRowData = oEvent.getSource().getAggregation("customData")[0].getProperty("value");
            if (detailKey === this._customActionKey.detail) {
                this.fnOpenChangesDialog(selectedRowData);
            } else if (detailKey === this._customActionKey.download) {
                that.fnDownloadAttachments(selectedRowData.changes);
            } else if (detailKey === this._customActionKey.downloadAttach){
                var sUri = "/asint/tae/v1/file/" + data.fileId;
                var oNewWindow = window.open(sUri, "_blank", "noopener,noreferrer");

                if (oNewWindow && oNewWindow.opener) {
                    oNewWindow.opener = null;
                }
            }
        },

        /**
         * Function to open changes dialog
         * @param {Object} oSelectedData 
         */
        fnOpenChangesDialog : function(oSelectedData){
            var that = this;
            var aRowData = oSelectedData.changes;
            var changes = [];
            if(aRowData && aRowData.length > 0){
                aRowData.forEach(function(oRow){
                    if(oRow.Description != "RCA Assessment"){
                        changes.push(oRow);
                    }
                })
            }
            var oDataModel = new JSONModel({
                "Changes":changes,
                "Labels":{
                    "noDataText" : that._oi18n.getText("asint.timeline.changesDialog.table.noData.text"),
                    "dialogHeader":that._oi18n.getText("asint.timeline.changesDialog.header.text"),
                    "description":that._oi18n.getText("asint.timeline.changesDialog.table.column.description.text"),
                    "oldValue":that._oi18n.getText("asint.timeline.changesDialog.table.column.oldValue.text"),
                    "newValue":that._oi18n.getText("asint.timeline.changesDialog.table.column.newValue.text")
                }
            });
            if (!this._oChangesDialog) {
                this._oChangesDialog = sap.ui.xmlfragment("idChangesDialog","com.asint.ais.library.fragment.timeLineChangesDialog", this);
            }
            this.controllerRef.getView().addDependent(this._oChangesDialog);
            this._oChangesDialog.setModel(oDataModel,"oChangesModel");
            this._oChangesDialog.open();
        },

        /**
         * Function to download attachments
         * @param {Array} aDocs 
         */
        fnDownloadAttachments : function(aDocs){
            var that = this;
            if(aDocs.length > 0 && aDocs[0].NewValue.length > 0){
                var iError = 0;
                var iProgress = 0;
                /**
                 * Local call back function
                 */
                var fnLocalCallBack = function(){
                    if(iError > 0){
                        that.fnMessageShow("E", that._oi18n.getText("timeline.message04"));
                    }
                };
                aDocs[0].NewValue.forEach(function(oDoc){
                    var sDocId = oDoc.document_ID;
                    that.datasource.getDocumentFileInfo(sDocId, function(oFileDetail){
                        var fileContent = oFileDetail.to_file.content;
                        var sType = oFileDetail.to_file.type;
                        iProgress = iProgress + 1;
                        if(sType == "LINK"){
                            var linkContent = atob(fileContent);
                            if(!linkContent){
                                linkContent = oFileDetail.to_file.name;
                            }
                            window.open(linkContent, "_blank");
                        }else{
                            var dataUrl = "data:" + sType +";base64,"+ fileContent;
                            var a = document.createElement("a"); //Create <a>
                            a.href = dataUrl;
                            a.target = "_blank";
                            a.download = oFileDetail.displayId + "_" + oFileDetail.to_file.name; //File name Here
                            a.click();
                        }
                        if(iProgress == aDocs.length){
                            fnLocalCallBack();
                        }
                    }, function(){
                        iError = iError + 1;
                        iProgress = iProgress + 1;
                        if(iProgress == aDocs.length){
                            fnLocalCallBack();
                        }
                    });
                });
            }
        },

        /**
         * Function to handle group type change
         * @param {Object} oEvent 
         */
        fnChangeGroupType : function(oEvent){
            var sKey = oEvent.getParameter("selectedItem").getProperty("key");
            this.timeLineRef.setGroupByType(sKey);
            if(sKey == "None"){
                this.fnRenderTimeLineItems(this.parsedTimelineData, this.VboxRef, this.timeLineRef);
            }
        },

        /**
         * Function to save comment
         */
        onClickReplyPost : function(){
            var that = this;
            var oModel = this.timeLineRef.getModel("oTimeModel");
            var oUserData = oModel.getProperty("/Data");
            if(oUserData.UserComment){
                var oPayload = {
                    "text":oUserData.UserComment,
                    "timelineId_ID":oUserData.TimeLineId,
                    "deleted":false
                };
                oPayload.createdBy = this.getLoggedInUserMail();
                oPayload.modifiedBy = this.getLoggedInUserMail();
                that.datasource.postTimelineComment(oPayload, function(oData){
                    var aCurTimeLines = that.timeLineMeta;
                    for(var i = 0; i < aCurTimeLines.length; i++){
                        if(aCurTimeLines[i].ID === oUserData.TimeLineId){
                            aCurTimeLines[i].to_comments.push(oData);
                        }
                    }
                    that.timeLineMeta = aCurTimeLines;
                    that.fnMessageShow("S", that._oi18n.getText("timeline.message01"), "", function(){
                        that.fnFormatTimelineData(that.timeLineMeta, function(aTimelineData){
                            that.fnRenderTimeLineItems(aTimelineData, that.VboxRef);
                        });
                    });
                },function(oError){
                    var err = JSON.parse(oError.responseText);
                    var errorDetail = "";
                    if(err.error.message){
                        errorDetail = err.error.message;
                    }
                    that.fnMessageShow("E", that._oi18n.getText("timeline.message02"), errorDetail);  
                });
            }else{
                that.fnMessageShow("E", that._oi18n.getText("timeline.message03"));  
            }
            
        },

        /**
         * Function to search in changes table
         * @param {Object} oEvent 
         */
        handleSearch : function(oEvent){
            var sValue = oEvent.getParameter("value");
            if(sValue){
                var oFilter = new Filter([
                    new Filter("Description", FilterOperator.Contains, sValue),
                    new Filter("OldValue", FilterOperator.Contains, sValue),
                    new Filter("NewValue", FilterOperator.Contains, sValue),
                ], false);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            }else{
                oEvent.getSource().getBinding("items").filter([]);
            }
        },

        /**
         * Function to open mail
         * @param {String} sEmail 
         */
        fnHandleReplySenderPress : function(sEmail){
            var recipient = sEmail;
            // var subject = 'Subject';
            // var body = 'Body of the email';
            var encodedRecipient = encodeURIComponent(recipient);
            // var encodedSubject = encodeURIComponent(subject);
            // var encodedBody = encodeURIComponent(body);
        
            var mailtoLink = `mailto:${encodedRecipient}`;
            window.location.href = mailtoLink;
        },

        /**
         * Function to perform cross app navigation
         * @param {String} sHashWithKeyword 
         * @param {Object} oParam 
         */
        fnPerformCrossNavigation: function (sHashWithKeyword, oParam) {
            var sHash = sHashWithKeyword;
            $.each(oParam, function (sKey, sValue) {
                sHash = sHash.replace("{" + sKey + "}", sValue);
            });
            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: sHash
                }
            });
        },

        /**
         * Function to form message for recommendation create
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageRecommendationCreate : function(oTemplate, oLogDetail){
            var sName = oLogDetail.to_description ? oLogDetail.to_description.shortDescription : "";
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.add.header", [sName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.add.text", [sName, sDisplayId]) + "\n"; //Text as per the actin
        },

        /**
        * Function to form message for recommendation
        * @param {Object} oTemplate 
        * @param {Object} oLogDetail 
        * @param {Object} oReference 
        */
        fnMessageRecommendationUpdate : function(oTemplate, oLogDetail, oReference){
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_assessment_ID","previousAssessment_ID","oldAssessment","oldAssessmentDescription"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field == "to_assessment_ID"){
                    oTemplate.navTo = true;
                }
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    //For detail popup
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    if(typeof(oLogDetail[logCounter].oldData) === "object"){
                        oChanges.OldValue = "";
                    }
                    if(oLogDetail[logCounter].field == "rejectionComment"){
                        fieldName = "Comment";
                    }
                    if(oLogDetail[logCounter].field == "newAssessment"){
                        oLogDetail.forEach(function(sLog){
                            if(sLog.field == "to_assessment_ID"){
                                oChanges.assessmentId = sLog.newData;
                            }
                            if(sLog.field == "oldAssessment"){
                                oChanges.OldValue = sLog.newData;
                            }
                        })
                    }
                    if(oLogDetail[logCounter].field == "newAssessmentDescription"){
                        oLogDetail.forEach(function(sLog){
                            if(sLog.field == "oldAssessmentDescription"){
                                oChanges.OldValue = sLog.newData;
                            }
                        })
                    }
                    if(oLogDetail[logCounter].field === "SHE at Target Date"){
                        fieldName = "SHE at Target Date";
                    }
                    if(oLogDetail[logCounter].field === "FIN at Target Date"){
                        fieldName = "FIN at Target Date";
                    }
                    
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field === "status"){
                        fieldName = "Status";
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            var sFormattedOldStatus = this.controllerRef.formatter.fnStatusFormatter(oLogDetail[logCounter].oldData);
                            oChanges.OldValue = sFormattedOldStatus;
                        }
                        var sFormattedNewStatus = this.controllerRef.formatter.fnStatusFormatter(oLogDetail[logCounter].newData);
                        oChanges.NewValue = sFormattedNewStatus;
                    }
                    var aDateFields = [
                        "validfrom", "targetdate", "startdate", "changedon", "duedate", 
                    ];

                    if (aDateFields.includes(oLogDetail[logCounter].field.toLowerCase())) {
                        oChanges.OldValue = "";
                        oChanges.NewValue = "";

                        if (oLogDetail[logCounter].oldData) {
                            oChanges.OldValue = this.controllerRef.formatter.formatDate(
                                oLogDetail[logCounter].oldData,
                                "MMM dd, yyyy, HH:mm:ss aa"
                            );
                        }

                        if (oLogDetail[logCounter].newData) {
                            oChanges.NewValue = this.controllerRef.formatter.formatDate(
                                oLogDetail[logCounter].newData,
                                "MMM dd, yyyy, HH:mm:ss aa"
                            );
                        }
                    }

                    if(oLogDetail[logCounter].field === "closedDate"){
                        fieldName = "Recommendation Closed Date";
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            oChanges.OldValue = this.controllerRef.formatter.formatDate(oLogDetail[logCounter].oldData, "MMM dd, yyyy, HH:mm:ss aa");
                        }
                        if(oLogDetail[logCounter].newData){
                            oChanges.NewValue = this.controllerRef.formatter.formatDate(oLogDetail[logCounter].newData, "MMM dd, yyyy, HH:mm:ss aa");
                        }
                    }

                    if(oLogDetail[logCounter].field === "recommendationState"){
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            oChanges.OldValue = this.controllerRef.formatter.fnFormatRecommendationState(oLogDetail[logCounter].oldData);
                        }
                        if(oLogDetail[logCounter].newData){
                            oChanges.NewValue = this.controllerRef.formatter.fnFormatRecommendationState(oLogDetail[logCounter].newData);
                        }
                    }
                    if(oLogDetail[logCounter].field === "evergreening"){
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            oChanges.OldValue = this.controllerRef.formatter.fnFormatEvergreeningText(oLogDetail[logCounter].oldData);
                        }
                        if(oLogDetail[logCounter].newData){
                            oChanges.NewValue = this.controllerRef.formatter.fnFormatEvergreeningText(oLogDetail[logCounter].newData);
                        }
                        var oEverGreenTimeStamp = {
                            "Description":"Evergreening Changed Date",
                            "OldValue":null,
                            "NewValue":this.controllerRef.formatter.formatDate(oTemplate.dateTime, "MMM dd, yyyy, HH:mm:ss aa")
                        };
                        oTemplate.changes.push(oEverGreenTimeStamp);
                        aLogs.push(oEverGreenTimeStamp);
                    }
                    if(oLogDetail[logCounter].field === "to_description"){
                        fieldName = "Short Description";
                        var oChangesLong = {};
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].longDescription){
                            oChangesLong.Description = "Long Description";
                            oChangesLong.NewValue = oLogDetail[logCounter].newData[0].longDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].longDescription){
                                oChangesLong.OldValue = oLogDetail[logCounter].oldData[0].longDescription;
                            }
                            oTemplate.changes.push(oChangesLong);
                            aLogs.push(oChangesLong);
                        }
                        var oChangesShort = {};
                        oChangesShort.OldValue = "";
                        oChangesShort.NewValue = "";
                        oChangesShort.Description = fieldName;
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].shortDescription){
                            oChangesShort.NewValue = oLogDetail[logCounter].newData[0].shortDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].shortDescription){
                                oChangesShort.OldValue = oLogDetail[logCounter].oldData[0].shortDescription;
                            }
                            oTemplate.changes.push(oChangesShort);
                            aLogs.push(oChangesShort);
                        }
                    }
                    if(fieldName != "Short Description" && fieldName != "Long Description"){
                        oChanges.Description = fieldName;
                        oTemplate.changes.push(oChanges);
                        aLogs.push(oChanges);
                    }
                }
            }
            if(oReference){
                var referenceValues = this.equipemntReferenceValues(oReference);
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.update.header", [referenceValues.Name]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.update.header", [referenceValues.Name, referenceValues.desc]) + "\n"; //Text as per the actin
            }else{
                if(oTemplate.detailKey != "download"){
                    oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.update.header", [that._objectName]); // Header as per the action
                    oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.update.text", [that._objectName]) + "\n"; //Text as per the actin
                    aLogs.sort(function (a, b) {
                        var title1 = "";
                        var title2 = "";
                        if(a.Description){
                            title1 = a.Description.toUpperCase();
                        } 
                        if(b.Description){
                            title2 = b.Description.toUpperCase();
                        } 
                        if (title1 < title2) {
                            return -1; 
                        } else if (title1 > title2) {
                            return 1; 
                        } else {
                            return 0; 
                        }
                    });
                    if(aLogs.length > 0){
                        aLogs.forEach(function(oLog){
                            oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                            oTemplate.text = oTemplate.text + "\n";
                        })
                    }
                }
            }
        },

        /**
         * Function to format message for recommendation attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageRecommendationObjectsAssign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.update.header", [that._objectName]); // Header as per the action
            oTemplate.navTo = true;
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    if(sField == "to_risk_fields"){
                        oTemplate.header = this._oi18n.getText("asint.timeline.recommendationRiskField.update.text", [that._objectName]);
                    }
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.assignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for recommendation attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageRecommendationObjectsUnassign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.update.header", [that._objectName]); // Header as per the action
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.unAssignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for recommendation attachments assign
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageRecommendationAttach: function (oTemplate, oLogDetail) {
            var that = this;
            oTemplate.detailKey = this._customActionKey.download;
            oTemplate.detailText = this._oi18n.getText("asint.timeline.customAction.download.text");
            oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.attach.header");
            oTemplate.Icon = that._icons["att"];
            var sDisplayIds = "";
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field === "to_documents" && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    oChanges.Description = "";
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oDoc){
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oDoc.displayId;
                        }else{
                            sDisplayIds = oDoc.displayId;
                        }
                    });
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.attach.text",[sDisplayIds]) + "\n";
        },

        /**
         * Function to format message for equipment attachments unassign
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageRecommendationAttachmentRemove : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.unAssignAttach.header");
            oTemplate.Icon = that._icons["att"];
            var sDisplayIds = "";
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field === "to_documents" && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    oChanges.Description = "";
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oDoc){
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oDoc.displayId;
                        }else{
                            sDisplayIds = oDoc.displayId;
                        }
                    });
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.unAssignAttach.text",[sDisplayIds]) + "\n";
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageRecommendationRemove : function(oTemplate){
            oTemplate.header = this._oi18n.getText("asint.timeline.recommendation.remove.header", [that._objectName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.recommendation.remove.text", [that._objectName]) + "\n"; //Text as per the actin
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageMSPCreate : function(oTemplate, oLogDetail){
            var sName = oLogDetail.to_description && oLogDetail.to_description.length > 0 ? oLogDetail.to_description[0].shortDescription : "";
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.msp.add.header", [sName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.msp.add.text", [sName, sDisplayId]) + "\n"; //Text as per the actin
        },

        /**
        * Function to form message for recommendation
        * @param {Object} oTemplate 
        * @param {Object} oLogDetail 
        * @param {Object} oReference 
        */
        fnMessageMSPUpdate : function(oTemplate, oLogDetail, oReference){
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","assessment_ID"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field == "assessment_ID"){
                    oTemplate.navTo = true;
                }
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    //For detail popup
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    if(typeof(oLogDetail[logCounter].oldData) === "object"){
                        oChanges.OldValue = "";
                    }
                    if(oLogDetail[logCounter].field == "newAssessment"){
                        oLogDetail.forEach(function(sLog){
                            if(sLog.field == "assessment_ID"){
                                oChanges.assessmentId = sLog.newData;
                            }
                        })
                    }
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field === "fundingStatus"){
                        fieldName = "Funding Status";
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            var sFormattedOldStatus = this.controllerRef.formatter.fnStatusFormatterForChangeFunding(oLogDetail[logCounter].oldData);
                            oChanges.OldValue = sFormattedOldStatus;
                        }
                        var sFormattedNewStatus = this.controllerRef.formatter.fnStatusFormatterForChangeFunding(oLogDetail[logCounter].newData);
                        oChanges.NewValue = sFormattedNewStatus;
                    }
                    if(oLogDetail[logCounter].field === "recommendationStatus"){
                        fieldName = "Recommendation Status";
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            var sFormattedOldRecoStatus = this.controllerRef.formatter.fnRecoStatusFormatter(oLogDetail[logCounter].oldData);
                            oChanges.OldValue = sFormattedOldRecoStatus;
                        }
                        var sFormattedNewRecoStatus = this.controllerRef.formatter.fnRecoStatusFormatter(oLogDetail[logCounter].newData);
                        oChanges.NewValue = sFormattedNewRecoStatus;
                    }
                    if(oLogDetail[logCounter].field === "SHE at Target Date"){
                        fieldName = "SHE at Target Date";
                    }
                    if(oLogDetail[logCounter].field === "FIN at Target Date"){
                        fieldName = "FIN at Target Date";
                    }
                    var aDateFields = [
                        "startdate",
                        "enddate",
                        "duedate",
                        "deferredduedate"
                    ];

                    if (aDateFields.includes(oLogDetail[logCounter].field.toLowerCase())) {
                        oChanges.OldValue = "";
                        oChanges.NewValue = "";

                        if (oLogDetail[logCounter].oldData) {
                            oChanges.OldValue = this.controllerRef.formatter.formatDate(
                                oLogDetail[logCounter].oldData,
                                "MMM dd, yyyy, HH:mm:ss aa"
                            );
                        }

                        if (oLogDetail[logCounter].newData) {
                            oChanges.NewValue = this.controllerRef.formatter.formatDate(
                                oLogDetail[logCounter].newData,
                                "MMM dd, yyyy, HH:mm:ss aa"
                            );
                        }
                    }

                    if(oLogDetail[logCounter].field === "to_description"){
                        fieldName = "Short Description";
                        var oChangesLong = {};
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].longDescription){
                            oChangesLong.Description = "Long Description";
                            oChangesLong.NewValue = oLogDetail[logCounter].newData[0].longDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].longDescription){
                                oChangesLong.OldValue = oLogDetail[logCounter].oldData[0].longDescription;
                            }
                            oTemplate.changes.push(oChangesLong);
                            aLogs.push(oChangesLong);
                        }
                        var oChangesShort = {};
                        oChangesShort.OldValue = "";
                        oChangesShort.NewValue = "";
                        oChangesShort.Description = fieldName;
                        if(oLogDetail[logCounter].newData.length > 0 && oLogDetail[logCounter].newData[0].shortDescription){
                            oChangesShort.NewValue = oLogDetail[logCounter].newData[0].shortDescription;
                            if(oLogDetail[logCounter].oldData.length > 0 && oLogDetail[logCounter].oldData[0].shortDescription){
                                oChangesShort.OldValue = oLogDetail[logCounter].oldData[0].shortDescription;
                            }
                            oTemplate.changes.push(oChangesShort);
                            aLogs.push(oChangesShort);
                        }
                    }
                    if(fieldName != "Short Description" && fieldName != "Long Description"){
                        oChanges.Description = fieldName;
                        oTemplate.changes.push(oChanges);
                        aLogs.push(oChanges);
                    }
                }
            }
            if(oReference){
                var referenceValues = this.equipemntReferenceValues(oReference);
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.msp.update.header", [referenceValues.Name]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.msp.update.header", [referenceValues.Name, referenceValues.desc]) + "\n"; //Text as per the actin
            }else{
                if(oTemplate.detailKey != "download"){
                    oTemplate.header = this._oi18n.getText("asint.timeline.msp.update.header", [that._objectName]); // Header as per the action
                    oTemplate.text = this._oi18n.getText("asint.timeline.msp.update.text", [that._objectName]) + "\n"; //Text as per the actin
                    aLogs.sort(function (a, b) {
                        var title1 = "";
                        var title2 = "";
                        if(a.Description){
                            title1 = a.Description.toUpperCase();
                        } 
                        if(b.Description){
                            title2 = b.Description.toUpperCase();
                        } 
                        if (title1 < title2) {
                            return -1; 
                        } else if (title1 > title2) {
                            return 1; 
                        } else {
                            return 0; 
                        }
                    });
                    if(aLogs.length > 0){
                        aLogs.forEach(function(oLog){
                            oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                            oTemplate.text = oTemplate.text + "\n";
                        })
                    }
                }
            }
        },

        /**
         * Function to format message for recommendation attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageMSPObjectsAssign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.msp.update.header", [that._objectName]); // Header as per the action
            oTemplate.navTo = true;
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    if(sField == "to_risk_fields"){
                        oTemplate.header = this._oi18n.getText("asint.timeline.mspRiskField.update.text", [that._objectName]);
                    }
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.msp.assignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for recommendation attachments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageMSPObjectsUnassign : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.msp.update.header", [that._objectName]); // Header as per the action
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                if(!aKeysExclude.includes(oLogDetail[logCounter].field) && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    var oChanges = {};
                    var sField = oLogDetail[logCounter].field;
                    oChanges.Description = oLogDetail[logCounter].field;
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oAssignObj){
                        aDisplayIds.push(oAssignObj.displayId);
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oAssignObj.displayId;
                        }else{
                            sDisplayIds = oAssignObj.displayId;
                        }
                    });
                    var oMapObj = that._oCompositionMaps[oLogDetail[logCounter].field];
                    if(oMapObj){
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.msp.unAssignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },

        /**
         * Function to format message for recommendation attachments assign
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageMSPAttach: function (oTemplate, oLogDetail) {
            var that = this;
            oTemplate.detailKey = this._customActionKey.download;
            oTemplate.detailText = this._oi18n.getText("asint.timeline.customAction.download.text");
            oTemplate.header = this._oi18n.getText("asint.timeline.msp.attach.header");
            oTemplate.Icon = that._icons["att"];
            var sDisplayIds = "";
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field === "to_documents" && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    oChanges.Description = "";
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oDoc){
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oDoc.displayId;
                        }else{
                            sDisplayIds = oDoc.displayId;
                        }
                    });
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.msp.attach.text",[sDisplayIds]) + "\n";
        },

        /**
         * Function to format message for equipment attachments unassign
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageMSPAttachmentRemove : function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.msp.unAssignAttach.header");
            oTemplate.Icon = that._icons["att"];
            var sDisplayIds = "";
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(oLogDetail[logCounter].field === "to_documents" && oLogDetail[logCounter].newData && oLogDetail[logCounter].newData.length > 0){
                    oChanges.Description = "";
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    oLogDetail[logCounter].newData.forEach(function(oDoc){
                        if(sDisplayIds){
                            sDisplayIds = sDisplayIds + ", " + oDoc.displayId;
                        }else{
                            sDisplayIds = oDoc.displayId;
                        }
                    });
                    oTemplate.changes.push(oChanges);
                }
            }
            oTemplate.text = this._oi18n.getText("asint.timeline.msp.unAssignAttach.text",[sDisplayIds]) + "\n";
        },

        /**
         * Function to form message for equipment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageMSPRemove : function(oTemplate){
            oTemplate.header = this._oi18n.getText("asint.timeline.msp.remove.header", [that._objectName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.msp.remove.text", [that._objectName]) + "\n"; //Text as per the actin
        },

        
        /**
         * Function to add message for opti create
         * @param {Object} oTemplate 
         * @param {Array} oLogDetail 
         */
        fnMessageCreateOptimization:function(oTemplate, oLogDetail){
            var sName = oLogDetail.name;
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.optimization.add.header", [sName]); 
            oTemplate.text = this._oi18n.getText("asint.timeline.optimization.add.text", [sName, sDisplayId]) + "\n";

        },
        
        /**
         * Function to add message for opti update
         * @param {Object} oTemplate 
         * @param {Array} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessagesOptimizationUpdate:function(oTemplate, oLogDetail, oReference){

            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy","to_description"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){

                    //For detail popup
                    // oChanges.OldValue = oLogDetail[logCounter].oldData;
                    // if(typeof(oLogDetail[logCounter].oldData) === "object"){
                    //     oChanges.OldValue = "";
                    // }
                    // oChanges.NewValue = oLogDetail[logCounter].newData;
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    oChanges.OldValue =  oLogDetail[logCounter].oldData;
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field==="dueDate"){
                        fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                        var obj= oLogDetail[logCounter]
                        oChanges.OldValue =  that.formatter.formatDate(obj.oldData);
                        oChanges.NewValue = that.formatter.formatDate(obj.newData);
                    }

                    if(oLogDetail[logCounter].field==="to_genAssessmentValues"){
                        fieldName="Assessment Values";
                        oChanges.OldValue = "";
                        oChanges.NewValue = "Assessment values saved successfully.";
                    }

                    if(oLogDetail[logCounter].field==="status"){
                        oChanges.OldValue = "";
                        fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                        var oResp= oLogDetail[logCounter]
                        if(oResp.newData==="PBD"){
                            oChanges.NewValue=this._oi18n.getText("asint.timeline.optimization.status.published.text");
                        }else if(oResp.newData==="UPBD"){
                            oChanges.NewValue=this._oi18n.getText("asint.timeline.optimization.status.unpublished.text");
                        }
                    }
                    
                    oChanges.Description = fieldName;
                    oTemplate.changes.push(oChanges);
                    aLogs.push(oChanges);
                }
            }
            if(oReference){
                var referenceValues = this.equipemntReferenceValues(oReference);
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.optimization.update.header", [referenceValues.Name]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.optimization.update.text", [referenceValues.Name, referenceValues.desc]) + "\n"; //Text as per the actin
            }else{
                if(oTemplate.detailKey != "download"){
                    oTemplate.header = this._oi18n.getText("asint.timeline.optimization.update.header", [that._objectName]); // Header as per the action
                    oTemplate.text = this._oi18n.getText("asint.timeline.optimization.update.text", [that._objectName]) + "\n"; //Text as per the actin
                    aLogs.sort(function (a, b) {
                        var title1 = "";
                        var title2 = "";
                        if(a.Description){
                            title1 = a.Description.toUpperCase();
                        } 
                        if(b.Description){
                            title2 = b.Description.toUpperCase();
                        } 
                        if (title1 < title2) {
                            return -1; 
                        } else if (title1 > title2) {
                            return 1; 
                        } else {
                            return 0; 
                        }
                    });
                    if(aLogs.length > 0){
                        aLogs.forEach(function(oLog){
                            oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                            oTemplate.text = oTemplate.text + "\n";
                        })
                    }
                }
            }

        },

        /**
         * Function to form message for findings
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageFindingsCreate : function(oTemplate, oLogDetail){
            var sName = oLogDetail.name;
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.findings.add.header", [sName]); // Header as per the action
            oTemplate.text = this._oi18n.getText("asint.timeline.findings.add.text", [sName, sDisplayId]) + "\n"; //Text as per the actin
        },

        /**
        * Function to form message for findings
        * @param {Object} oTemplate 
        * @param {Object} oLogDetail 
        * @param {Object} oReference 
        */
        fnMessageFindingsUpdate : function(oTemplate, oLogDetail, oReference){
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID","eTag","createdAt","createdBy","modifiedAt","modifiedBy"];
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var oChanges = {};
                if(!aKeysExclude.includes(oLogDetail[logCounter].field)){
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[logCounter].field);
                    //For detail popup
                    oChanges.OldValue = oLogDetail[logCounter].oldData;
                    if(typeof(oLogDetail[logCounter].oldData) === "object"){
                        oChanges.OldValue = "";
                    }
                    oChanges.NewValue = oLogDetail[logCounter].newData;
                    if(oLogDetail[logCounter].field === "status"){
                        fieldName = "Status";
                        oChanges.OldValue = "";
                        if(oLogDetail[logCounter].oldData){
                            var sFormattedOldStatus = this.controllerRef.formatter.fnStatusFormatter(oLogDetail[logCounter].oldData);
                            oChanges.OldValue = sFormattedOldStatus;
                        }
                        var sFormattedNewStatus = this.controllerRef.formatter.fnStatusFormatter(oLogDetail[logCounter].newData);
                        oChanges.NewValue = sFormattedNewStatus;
                    }
                    if(fieldName != "Short Description" && fieldName != "Long Description"){
                        oChanges.Description = fieldName;
                        oTemplate.changes.push(oChanges);
                        aLogs.push(oChanges);
                    }
                }
            }
            if(oReference){
                var referenceValues = this.equipemntReferenceValues(oReference);
                oTemplate.detailText = "";
                oTemplate.header = this._oi18n.getText("asint.timeline.findings.update.header", [referenceValues.Name]); // Header as per the action
                oTemplate.text = this._oi18n.getText("asint.timeline.findings.update.text", [referenceValues.Name, referenceValues.desc]) + "\n"; //Text as per the actin
            }else{
                if(oTemplate.detailKey != "download"){
                    oTemplate.header = this._oi18n.getText("asint.timeline.findings.update.header", [that._objectName]); // Header as per the action
                    oTemplate.text = this._oi18n.getText("asint.timeline.findings.update.text", [that._objectName]) + "\n"; //Text as per the actin
                    aLogs.sort(function (a, b) {
                        var title1 = "";
                        var title2 = "";
                        if(a.Description){
                            title1 = a.Description.toUpperCase();
                        } 
                        if(b.Description){
                            title2 = b.Description.toUpperCase();
                        } 
                        if (title1 < title2) {
                            return -1; 
                        } else if (title1 > title2) {
                            return 1; 
                        } else {
                            return 0; 
                        }
                    });
                    if(aLogs.length > 0){
                        aLogs.forEach(function(oLog){
                            oTemplate.text = oTemplate.text.concat("\n" + oLog.Description + " : " + oLog.NewValue);
                            oTemplate.text = oTemplate.text + "\n";
                        })
                    }
                }
            }
        },

        /**
         * Function to format message for findings assignment
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageFindingsAssign: function (oTemplate, oLogDetail) {
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.findings.assignUpdate.header", [that._objectName]); // Header as per the action
            oTemplate.navTo = true;
            
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID", "eTag", "createdAt", "createdBy", "modifiedAt", "modifiedBy"];
            
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var logEntry = oLogDetail[logCounter];
                
                // Handle recommendationDetails_ID objects
                if (logEntry.recommendationDetails_ID && logEntry.displayId || logEntry.notificationDetails_ID && logEntry.displayId) {
                    // var firstRecoDisplayId = logEntry.displayId 
                    sDisplayIds += sDisplayIds ? ", " + logEntry.displayId : logEntry.displayId;
                }
                
                if (!aKeysExclude.includes(logEntry.field) && logEntry.newData && logEntry.newData.length > 0) {
                    var oChanges = {};
                    var sField = logEntry.field;
                    oChanges.Description = logEntry.field;
                    oChanges.OldValue = logEntry.oldData;
                    oChanges.NewValue = logEntry.newData;
        
                    if (logEntry.displayId) {
                        aDisplayIds.push(logEntry.displayId);
                        if (sDisplayIds) {
                            sDisplayIds = sDisplayIds + ", " + logEntry.displayId;
                        } else {
                            sDisplayIds = logEntry.displayId;
                        }
                    }
                    
                    var oMapObj = that._oCompositionMaps[logEntry.field];
                    if (oMapObj) {
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    oTemplate.changes.push(oChanges);
                }
            }
            if(sField === undefined){
                var displayId = sDisplayIds.split(",");
                sField = displayId[0]
            }
        
            if (sField === "genRecommendation") {
                sField = "Recommendation";
            } else if (sField === "Notification(s)") {
                sField = "Notification";
            }
            
            oTemplate.text = this._oi18n.getText("asint.timeline.findings.assignUpdate.text", [sField, that._objectName]) + "\n"; //Text as per the actin
            // oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },
               

        /**
         * Function to format message for findings assignments
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail
         */
        fnMessageFindingsObjectsAssign: function(oTemplate, oLogDetail){
            var that = this;
            oTemplate.header = this._oi18n.getText("asint.timeline.findings.assignUpdate.header", [that._objectName]); // Header as per the action
            var sDisplayIds = "";
            var aDisplayIds = [];
            var aKeysExclude = ["@etag", "ID", "eTag", "createdAt", "createdBy", "modifiedAt", "modifiedBy"];
            var sField = "";
            var recommendationDisplayId = "";
            
            for (var logCounter = 0; logCounter < oLogDetail.length; logCounter++) {
                var logEntry = oLogDetail[logCounter];
                
                // Capture recommendation displayId
                if (logEntry.recommendationDetails_ID && logEntry.displayId || logEntry.notificationDetails_ID && logEntry.displayId) {
                    recommendationDisplayId = logEntry.displayId;
                }
                
                if (!aKeysExclude.includes(logEntry.field) && logEntry.newData && logEntry.newData.length > 0) {
                    var oChanges = {};
                    oChanges.Description = logEntry.field;
                    oChanges.OldValue = logEntry.oldData;
                    oChanges.NewValue = logEntry.newData;
                    
                    if (logEntry.displayId) {
                        aDisplayIds.push(logEntry.displayId);
                        if (sDisplayIds) {
                            sDisplayIds = sDisplayIds + ", " + logEntry.displayId;
                        } else {
                            sDisplayIds = logEntry.displayId;
                        }
                    }
                    
                    var oMapObj = that._oCompositionMaps[logEntry.field];
                    if (oMapObj) {
                        oChanges.Description = oMapObj.desc;
                        sField = oMapObj.field;
                    }
                    
                    oTemplate.changes.push(oChanges);
                }
            }
            
            if (recommendationDisplayId) {
                sField = recommendationDisplayId;
            }
            
            oTemplate.text = this._oi18n.getText("asint.timeline.findings.assignUpdate.text", [sField, that._objectName]) + "\n";
            oTemplate.text = oTemplate.text.concat("\n" + sDisplayIds);
            oTemplate.text = oTemplate.text + "\n";
        },
        /**
         * Function to form message for RCA Create
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageRCACreate: function (oTemplate, oLogDetail) {
            var sName = oLogDetail.name;
            var sDisplayId = oLogDetail.displayId;
            oTemplate.header = this._oi18n.getText("asint.timeline.rca.add.header", [sName]);
            oTemplate.text = this._oi18n.getText("asint.timeline.rca.add.text", [sName, sDisplayId]) + "\n";
        },

        /**
         * Function to form message for RCA Update
         * @param {Object} oTemplate 
         * @param {Object} oLogDetail 
         * @param {Object} oReference 
         */
        fnMessageRCAUpdate: function (oTemplate, oLogDetail, oReference) {
            var that = this;
            var fieldName = "";
            var aLogs = [];
            var aKeysExclude = ["@etag", "ID", "eTag", "createdAt", "createdBy", "modifiedAt", "modifiedBy"];

            for (var i = 0; i < oLogDetail.length; i++) {
                var oChanges = {};
                if (!aKeysExclude.includes(oLogDetail[i].field)) {
                    fieldName = that.fnReturnFormattedFieldAfterCamelCase(oLogDetail[i].field);

                    oChanges.Description = fieldName;
                    oChanges.OldValue = (typeof oLogDetail[i].oldData === "object") ? "" : oLogDetail[i].oldData;
                    oChanges.NewValue = (typeof oLogDetail[i].newData === "object") ? "" : oLogDetail[i].newData;

                    oTemplate.changes.push(oChanges);
                    aLogs.push(oChanges);
                }
            }

            if (oReference) {
                var referenceValues = this.equipemntReferenceValues(oReference);
                var sName = referenceValues.Name || referenceValues.displayId || that._objectName || "Root Cause Analysis";
                var sDesc = referenceValues.displayId || referenceValues.desc || "";
                oTemplate.header = this._oi18n.getText("asint.timeline.rca.update.header", [sName]);
                oTemplate.text = this._oi18n.getText("asint.timeline.rca.update.text", [sName, sDesc]) + "\n";
            } else {
                var sObjectName = that._objectName || "Root Cause Analysis";
                oTemplate.header = this._oi18n.getText("asint.timeline.rca.update.header", [sObjectName]);
                oTemplate.text = this._oi18n.getText("asint.timeline.rca.update.text", [sObjectName]) + "\n";

                if (aLogs.length > 0) {
                    aLogs.forEach(function (oLog) {
                        oTemplate.text += "\n" + oLog.Description + " : " + oLog.NewValue + "\n";
                    });
                }
            }
        },


        
        


    });

});