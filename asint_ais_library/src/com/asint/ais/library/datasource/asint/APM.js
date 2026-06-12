sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL"
], function (Utility, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.APM", {

        URL: URL,

        _baseURI: "",

        /**
         * Set Base URL and API Key
         * 
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {

            if (sBaseURI) {
                this._baseURI = sBaseURI;
            }

            this.setHeaders({
                "x-api-key": "LVUj3hCim573kK01tqBGPEHFtCseUnyz"
            });

        },

        /**
         * Function to Update counter to track APM API usage
         * 
         * @param {String} sServiceName 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        logApmApiUsage: function (sServiceName, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "apmApiUsageRecorder");
            var oPayload = {
                "serviceName": sServiceName
            };

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to Create a Recommendation
         * 
         * @param {Object} oVariables 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        createRecommendation: function (oVariables, fnSuccess, fnError,bSsid) {
            var sUrl = this.getUrl(this._baseURI, "apmRecommendationGraphQl");
            if(!bSsid){
                var ssId = "";
                if(oVariables.recommendation.technicalObjects){
                    oVariables.recommendation.technicalObjects.forEach(function (oTechnicalObject) {
                        if(oTechnicalObject.ssid){
                            ssId = oTechnicalObject.ssid;
                        }
                    });
                }
                oVariables.recommendation["ssid"] = ssId;
            }
            // if (oVariables.hasOwnProperty("recommendation")) {
            //     oVariables.recommendation["ssid"] = "my401925";
            // }

            // if (oVariables.recommendation.hasOwnProperty("technicalObjects")) {
            //     oVariables.recommendation.technicalObjects.forEach(function (oTechnicalObject) {
            //         oTechnicalObject["ssid"] = "my401925";
            //     });
            // }

            var oPayload = {
                query: "mutation createRecommendation($recommendation: RecommendationCreateInput){createRecommendation(recommendation: $recommendation){id}}",
                variables: oVariables
            };

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
            this.logApmApiUsage("recommendation-service");
            // this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);

        },

        /**
         * Function to fetch the Recommendation
         * @param {Integer} iFirst 
         * @param {Integer} iOffset 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRecommendation: function (iFirst, iOffset, fnSuccess, fnError) {

            var sUrl = "recommendation";

            var oPayload = {
                "query": "query recommendations($first: Int,$offset: Int,$filter: RecommendationFilterInput,$search: String,$orderBy: RecommendationSortInput){recommendations(first: $first,offset: $offset,filter: $filter,search: $search,orderBy: $orderBy) {   totalCount,   pageInfo{   hasNextPage   hasPreviousPage   },   edges {   node {   id,   displayId,   type,   subType,   status,   cycle,   cycleUnit{       code,       description,   },   priority{       code,       description,       type       },   impactOnBusiness,   requiredDiscipline,   maintenanceActivityType{       code,       description   },   currentRisk{       amount,       currency   },   remainingRisk{       amount,       currency   },   estimatedCost{       amount,       currency   },   estimatedMaintenanceSavings{       amount,       currency   },   maintenancePlant {       code       description   },   planningPlant {       code       name1       name2   },   validFrom,   validTo,   sourceID,   sourceType,   sourceName,   updatedOn,   createdBy,   createdOn,   updatedBy,   description {       long,       short,       language   },   descriptions {       long,       short,       language   },   financialRiskNotes,   technicalObjects {       number       type       ssid       technicalObject   }   }   }   }}",
                "variables": {
                    "first": iFirst,
                    "offset": iOffset,
                    "filter": {},
                    "search": "",
                    "orderBy": {
                        "updatedOn": "DESC"
                    }
                },
                "operationName": "recommendations"
            };

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch the Recommendation
         * @param {String} sRecommendationId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRecommendationById: function (sRecommendationId, fnSuccess, fnError) {

            var sUrl = "recommendation";
            var oPayload =
            {
                "query":"query recommendation($id: String) {recommendation(id: $id) {id, SSID, displayId, type, subType, status, cycle, cycleUnit { code description type }, priority { code description type },impactOnBusiness,requiredDiscipline,maintenanceActivityType { code description }, currentRisk { amount currency },remainingRisk { amount currency },estimatedCost { amount currency },estimatedMaintenanceSavings { amount currency },validFrom ,validTo,updatedOn,createdBy,createdOn,updatedBy,description {long,short,language},descriptions {long,short,language},financialRiskNotes,maintenanceSavingsNotes,sourceID,sourceType,sourceName,sourceRecommendation {description {long short language} displayId id } , classDetails {id name description type },maintenancePlant { code description },planningPlant { code name1 name2 },failureDataProfile { name description },technicalObjects { number type ssid  }failureData { operatingContext { id } hierarchyData { failureCode { id code group type } parentFailureCode { id code group type } rootFailureCode { id code group type} } },allowedStatuses { key text } commentsList{id   comment createdBy createdOn  language sourceStatus targetStatus }}}",
                "variables": { "id": sRecommendationId },
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to update the Recommendation
         * 
         * @param {Array} aVarilable 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        updateRecommendation: function (aVarilable, fnSuccess, fnError,bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "apmRecommendationGraphQl");

            var oPayload = {
                "query": "mutation updateRecommendation ($recommendation: RecommendationUpdateInput) {\n                    updateRecommendation(recommendation: $recommendation) {\n            id\n            SSID\n            displayId\n            type\n            subType\n            status\n            cycle\n            cycleUnit{\n                code\n                description\n            }\n            priority{\n              code\n              description\n            }\n            impactOnBusiness\n            requiredDiscipline\n            maintenanceActivityType{\n                code\n                description\n            }\n            currentRisk{\n                amount\n                currency\n            }\n            remainingRisk{\n                amount\n                currency\n            }\n            estimatedCost{\n                amount\n                currency\n            }\n            estimatedMaintenanceSavings{\n                amount\n                currency\n            }\n            validFrom\n            validTo\n            updatedOn\n            createdBy\n            createdOn\n            updatedBy\n            description {\n                long\n                short\n                language\n            }\n            descriptions {\n                long\n                short\n                language\n            }\n            financialRiskNotes\n            maintenanceSavingsNotes\n            maintenancePlant {\n                code\n            },\n            planningPlant {\n                code\n            }\n        }\n                }",
                "variables": aVarilable
            }

            if(bShowBusy != false){
                bShowBusy = true;
            }
            
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);
            this.logApmApiUsage("recommendation-service");

        },

        /**
         * Get Assessment List using GraphQL
         * 
         * @param {Array} aEquiList 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssessmentList: function (aEquiList, fnSuccess, fnError) {

            var sUrl = "riskCriticalityAssessment"
            var aVarilable = {
                "filter": {
                    "technicalObjectNumber": {
                        "in": aEquiList
                    }
                },
                "search": "",
                "offset": 0,
                "orderBy": {
                    "updatedOn": "DESC"
                },
                "first": 100
            }
            var oPayload = {
                "query": "query Assessments($filter: AssessmentFilterInput, $search: String, $offset: Int, $orderBy: AssessmentSortInput, $first: Int) { assessments(filter: $filter, search: $search, offset: $offset, orderBy: $orderBy, first: $first) { edges { node { assignedObjectCount createdBy { email userName } createdOn description { language short long } displayValue id riskType status updatedBy { email userName } updatedOn } } } }",
                "variables": aVarilable
            };

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Get RCA data using GraphQL
         * 
         * @param {sAssessmentId} assessmentId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getAssessmentDetail: function (assessmentId, fnSuccess, fnError) {

            var sUrl = "riskCriticalityAssessment";
            var aVarilable = {
                "id": assessmentId
            };
            var oPayload = {
                "query": "query Assessment($id: String) { assessment(id: $id) { assignedObject { action alphanumericRiskScore assessmentTemplateDescriptions { language long short } assessmentTemplateDisplayValue assessmentTemplateId assessmentTemplateVersion color completedImpacts criticality { code language shortText ssid text } riskScore technicalObjectCategory technicalObjectCategoryCode technicalObjectCategoryDescription technicalObjectClass technicalObjectClassDescription technicalObjectDescription technicalObjectLabelName technicalObjectManufacturer technicalObjectNumber technicalObjectSsid technicalObjectStatus technicalObjectType technicalObjectTypeCode technicalObjectTypeDescription updatedOn } createdBy { application email familyName givenName id userName } createdOn description { language long short } descriptions { language long short } displayValue id referenceLanguage riskType scopeDescriptions { language long short } status updatedBy { application email familyName givenName id userName } updatedOn } }",
                "variables": aVarilable
            };

            // this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch Risk and criticality assessments
         * 
         * @param {Number} iOffset 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRCAAssessments: function (iFirst, iOffset, fnSuccess, fnError) {

            var sUrl = "riskCriticalityAssessment";
            var oPayload = {
                "query": "query assessments($first: Int, $offset: Int, $filter: AssessmentFilterInput, $orderBy: AssessmentSortInput) { assessments(first: $first, offset: $offset, filter: $filter, orderBy: $orderBy) { edges { node { id, displayValue, status description { long, short, language } currency { ssid, code, text, shortText } createdOn, updatedOn, createdBy { email, givenName, familyName } updatedBy { email, givenName, familyName } riskType, assignedObjectCount, validTo, validFrom } } pageInfo { hasNextPage } totalCount } }",
                "variables": {
                    "first": iFirst,
                    "offset": iOffset,
                    "filter": {
                        "allOf": [
                            {
                                "anyOf": [
                                    {
                                        "status": {
                                            "in": ["CREATED", "RELEASED", "IN_PROCESS"]
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    "orderBy": {}
                },
                "operationName": "assessments"
            }

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch Strategy Assessment
         * 
         * @param {oVariable} oVariable
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        getStrategyAssessment: function (oVariable, fnSuccess, fnError, bShowBusy) {

            var sUrl = "strategyAssessment";
            var oPayload = {
                "query": "query classStrategyAssessments($offset: Int,$first: Int,$filter: AssessmentFilterInput){classStrategyAssessments(offset: $offset,first: $first,filter: $filter){ edges { node { id, name, status, sourceSystemId, contextEnabled, createdOn, updatedOn classDetails { id, name, description } contexts { id, name } description { short } catalogProfile { name, description } } cursor } totalCount pageInfo { hasNextPage hasPreviousPage } }}",
                "variables": oVariable,
                "operationName": "classStrategyAssessments"
            };

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to Get the Data based on the GraphQL Query from Backend
         * 
         * @param {String} sUrlKey 
         * @param {Object} oGraphQL 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        fnPassResquestToBE: function (sUrlKey, oGraphQL, fnSuccess, fnError, bShowBusy) {
            var sUrl = this.getUrl(this._baseURI, "sapAPMDestination");

            var oAPIEndPoints = {
                "classification": "classification-service",
                "failureData": "failure-data-service",
                "indicators": "indicators",
                "iotBoarding": "iotonboarding-service",
                "notification": "notification-service",
                "recommendation": "recommendation-service",
                "riskCriticalityAssessment": "risk-criticality-assessment-service",
                "strategyAssessment": "strategy-assessments-service",
                "technicalobject": "technicalobject-service",
                "timeseries": "timeseries-service"
            };

            var oPayload = {
                "requestType": "post",
                "urlKey": oAPIEndPoints[sUrlKey],
                "apiEndPoint": "/graphql",
                "requestBody": oGraphQL
            }

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, typeof bShowBusy === "boolean" ? bShowBusy : true);
            this.logApmApiUsage(oAPIEndPoints[sUrlKey]);

        },

        /**
         * Function to fetch Strategy Assessment detail
         * 
         * @param {String} sAssessmentId
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        getStrategyAssessmentDetail: function (sAssessmentId, fnSuccess, fnError, bShowBusy) {

            var sUrl = "strategyAssessment";
            var oPayload = {
                "query": "query classStrategyAssessment($id: String!) { classStrategyAssessment(id: $id) { id, name, status, sourceSystemId, contextEnabled, createdOn, updatedOn classDetails { id, name, description, classType } catalogProfile { name, description } description { short } descriptions { short, long, language } planningPlant {code, name1, name2} maintenancePlants {code, name} contextEnabled contexts { id, name, characteristics { key, name, description, values { value, description } } failureNodes { order maintainableItems { id, code, group, groupText, type, text failureModes { id, code, group, groupText, type, text failureMechanisms { id, code, group, groupText, type, text } causes { id, code, group, groupText, type, text } failureEffects { id, code, group, groupText, type, text } detectionMethods { id, code, group, groupText, type, text } } } failureModes { id, code, group, groupText, type, text failureMechanisms { id, code, group, groupText, type, text } causes { id, code, group, groupText, type, text } failureEffects { id, code, group, groupText, type, text } detectionMethods { id, code, group, groupText, type, text } } } } } }",
                "variables": {
                    "id": sAssessmentId
                }
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to create Strategy Assessment
         * 
         * @param {Object} oVariables
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        createStrategyAssessment: function (oVariables, fnSuccess, fnError, bShowBusy) {

            var sUrl = "strategyAssessment";
            var oPayload = {
                "query": "mutation createAssessment($assessment: AssessmentCreateInput){ createClassStrategyAssessment(assessment: $assessment) { contexts { id name } id } }",
                "variables": oVariables
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to create operating context for Strategy Assessment
         * 
         * @param {Object} oVariables
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        createOperatingContextForStrategyAssessment: function (oVariables, fnSuccess, fnError, bShowBusy) {

            var sUrl = "strategyAssessment";
            var oPayload = {
                "query": "mutation CreateClassStrategyAssessmentOperatingContext($operatingContext: OperatingContextCreateInput) { createClassStrategyAssessmentOperatingContext(operatingContext: $operatingContext) { contexts { id name } updatedOn } }",
                "variables": oVariables
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to create failure data for Strategy Assessment
         * 
         * @param {Object} oVariables
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        createFailureDataForStrategyAssessment: function (oVariables, fnSuccess, fnError, bShowBusy) {

            var sUrl = "strategyAssessment";
            var oPayload = {
                "query": "mutation AssignClassStrategyAssessmentFailureData($failureData: FailureDataInput) { assignClassStrategyAssessmentFailureData(failureData: $failureData) { updatedOn } }",
                "variables": oVariables
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to get recommendations for Strategy Assessment
         * 
         * @param {String} sStrategyAssessmentId
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        getReommendationForStrategyAssessment: function (sStrategyAssessmentId, fnSuccess, fnError, bShowBusy) {

            var sUrl = "recommendation";
            var oPayload = {
                "query": "query recommendations($offset: Int!, $first: Int!, $filter: RecommendationFilterInput, $search: String) { recommendations(offset: $offset, first: $first, filter: $filter, search: $search) { edges { node { id, SSID, displayId, type, subType, cycle, description { short, long, language }, descriptions { short, long, language }, cycleUnit { code, description }, maintenanceActivityType { code, description }, sourceType sourceID failureData { hierarchyId hierarchyData { failureCode { id, code, group, groupText, type, text } parentFailureCode { id, code, group, type, text } rootFailureCode { id, code, group, type, text } } operatingContext { id, name } }, technicalObjects { number, ssid, technicalObject, type } } cursor } totalCount pageInfo { hasNextPage hasPreviousPage } } }",
                "variables": {
                    "offset": 0,
                    "first": 9999,
                    "filter": {
                        "sourceId": {
                            "eq": sStrategyAssessmentId
                        }
                    }
                }
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Function to create recommendations for Strategy Assessment
         * 
         * @param {Object} oVariables
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         * @param {Boolean} bShowBusy 
         */
        createReommendationForStrategyAssessment: function (oVariables, fnSuccess, fnError, bShowBusy) {

            var sUrl = "recommendation";
            var oPayload = {
                "query": "mutation createRecommendation($recommendation: RecommendationCreateInput) { createRecommendation(recommendation: $recommendation) { id, SSID, type, subType, description { short, long, language }, descriptions { short, long, language } } }",
                "variables": oVariables
            };

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError, bShowBusy);

        },

        /**
         * Retrieves the class count.
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getClassCount: function (fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "sapAPMDestination");

            var oPayload = {
                "requestType": "get",
                "urlKey": "classification-service",
                "apiEndPoint": "/v1/Class/$count"
            }

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, typeof bShowBusy === "boolean" ? bShowBusy : true);
            this.logApmApiUsage("classification-service");

        },
        /**
         * Retrieves a class based on the given count and skip count.
         * @param {number} iCount 
         * @param {number} iSkipCount 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getClass: function (iCount,iSkipCount, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "sapAPMDestination");

            var oPayload = {
                "requestType": "get",
                "urlKey": "classification-service",
                "apiEndPoint": `/v1/Class?$skip=${iSkipCount}&$top=${iCount}`
            }

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, typeof bShowBusy === "boolean" ? bShowBusy : true);
            this.logApmApiUsage("classification-service");

        },

        /**
         * Retrieves the catalog profile count.
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getCatalogProfileCount: function (fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "sapAPMDestination");

            var oPayload = {
                "requestType": "get",
                "urlKey": "failure-data-service",
                "apiEndPoint": "/v1/CatalogProfiles/$count"
            }

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, typeof bShowBusy === "boolean" ? bShowBusy : true);
            this.logApmApiUsage("failure-data-service");

        },

        /**
         * Retrieves catalog profiles based on the given count and skip count.
         * @param {number} iCount 
         * @param {number} iSkipCount 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         */
        getCatalogProfile: function (iCount,iSkipCount, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "sapAPMDestination");

            var oPayload = {
                "requestType": "get",
                "urlKey": "failure-data-service",
                "apiEndPoint": `/v1/CatalogProfiles?$skip=${iSkipCount}&$top=${iCount}`
            }

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, typeof bShowBusy === "boolean" ? bShowBusy : true);
            this.logApmApiUsage("failure-data-service");

        },

        /**
         * Function to fetch the Recommendation
         * @param {Integer} iFirst 
         * @param {Integer} iOffset 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getRecommendationsForListPage: function (oVariable, fnSuccess, fnError) {

            var sUrl = "recommendation";

            var oPayload = {
                "query": "query recommendations($offset: Int,$first: Int,$filter: RecommendationFilterInput,$orderBy: RecommendationSortInput){recommendations(offset: $offset,first: $first,filter: $filter,orderBy: $orderBy) {   totalCount,   pageInfo{   hasNextPage   hasPreviousPage   },   edges {   node {   id,   displayId,   type,   subType,   status,   cycle,   cycleUnit{       code,       description,   },   priority{       code,       description,       type       },   impactOnBusiness,   requiredDiscipline,   maintenanceActivityType{       code,       description   },   currentRisk{       amount,       currency   },   remainingRisk{       amount,       currency   },   estimatedCost{       amount,       currency   },   estimatedMaintenanceSavings{       amount,       currency   },   maintenancePlant {       code       description   },   planningPlant {       code       name1       name2   },   validFrom,   validTo,   sourceID,   sourceType,   sourceName,   updatedOn,   createdBy,   createdOn,   updatedBy,   description {       long,       short,       language   },   descriptions {       long,       short,       language   },   financialRiskNotes,   technicalObjects {       number       type       ssid       technicalObject   }   }   }   }}",
                "variables": oVariable,
                "operationName": "recommendations"
            };

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch the technicalObjectDetails
         * @param {Integer} iFirst 
         * @param {Integer} iOffset 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getTechnicalObjectDetails: function (oVariable, fnSuccess, fnError) {

            var sUrl = "recommendation";

            var oPayload = {
                "query":"query getAssignedTechnicalObjectDetails($recommendationId: String!,$first: Int,$offset: Int, $search: String) {\n                    getAssignedTechnicalObjectDetails(recommendationId: $recommendationId,first: $first,offset: $offset, search: $search)\n                             {\n            totalCount,\n            pageInfo{\n            hasNextPage\n            hasPreviousPage\n            }\n            edges {\n            node {\n            number\n            type\n            ssid\n            description\n            categoryCode\n            categoryDesc\n            objectTypeDesc\n            objectType\n            abcIndicator\n            abcIndicatorDesc\n            riskScore\n            color\n            manufacturer\n            manufacturerModelNumber\n            superiorFunctionalLocationID\n            superiorFunctionalLocationDesc\n            technicalObject\n            maintenancePlantCode\n            maintenancePlantName\n            planningPlant\n            planningPlantName1\n            catalogProfile\n            catalogProfileText\n            costCenterID\n            costCenterDescription\n            plannerGroupCode\n            plannerGroupName\n            mainWorkCenter\n            mainWorkCenterText\n            superordinateEquipmentDesc\n            superordinateEquipmentID\n            className\n            classDescription\n            sortField\n            status\n            statusShortForm\n            technicalObjectStatus {\n                statusText,\n                shortForm\n            }\n            toClass {\n                classReference {\n                 className,\n                 description\n                }\n            }\n            }\n            }\n        }\n                }","variables":oVariable
            };

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to delete recommendation
         * @param {Integer} iFirst 
         * @param {Integer} iOffset 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        deleteRecommendation: function (oVariable, fnSuccess, fnError) {

            var sUrl = "recommendation";

            var oPayload = {
                "query":"mutation deleteRecommendation($recommendationIds: [String]!) {deleteRecommendation(recommendationIds: $recommendationIds)}","variables":oVariable
            };

            //this.postData(sUrl, {}, oPayload, fnSuccess, fnError, false);

            this.fnPassResquestToBE(sUrl, oPayload, fnSuccess, fnError);
        },

        /**
         * Function to fetch recommendation notes and save recommendation notes
         * @param {String} sRecoId 
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        fnGetPostRecommendationNotes : function(sRecoId, sType, oNotesPayload, fnSuccess, fnError){
            var sUrl = this.getUrl(this._baseURI, "sapAPMDestination");
            var oPayload = {
                "requestType": sType,
                "urlKey": "recommendation-service",
                "apiEndPoint": "/v1/recommendations/" + sRecoId + "/note",
                "requestBody": oNotesPayload
            };

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, typeof bShowBusy === "boolean" ? bShowBusy : true);
            this.logApmApiUsage("recommendation-service");

        },

        /**
        * Function to fetch recommendation task list
        * 
        * @param {oVariable} oVariable
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        * @param {Boolean} bShowBusy 
        */
        getRecommendationTaskLists: function (oVariable, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "apmRecommendationGraphQl");
            var oPayload = {
                "query": "query getAssignedTasLists($recommendationId: String!,$first: Int,$offset: Int){ getAssignedTaskLists(recommendationId: $recommendationId,first: $first,offset: $offset){ totalCount, pageInfo{ hasNextPage hasPreviousPage } edges{ node{ taskListType taskListGroup taskListGroupCounter taskListVersionCounter taskListDescription planningPlant{ code name1 } taskListStatus taskListStatusDescription } } } }",
                "variables": oVariable
            };
            
            if(bShowBusy != false){
                bShowBusy = true;
            }
            
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);
            this.logApmApiUsage("recommendation-service");

        },

        /**
        * Function to fetch recommendation maintenance plan
        * 
        * @param {oVariable} oVariable
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        * @param {Boolean} bShowBusy 
        */
        getRecommendationMaintenancePlans: function (oVariable, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "apmRecommendationGraphQl");
            var oPayload = {
                "query": "query getAssignedMaintenancePlans($recommendationId: String!,$first: Int,$offset: Int){ getAssignedMaintenancePlans(recommendationId: $recommendationId,first: $first,offset: $offset){ totalCount pageInfo{ hasNextPage hasPreviousPage } edges{ node{ maintenancePlan{ cycle{ cycleRecurrenceIntervalQuantity cycleRecurrenceIntervalUnit } description id planCategory planCategoryDescription maintenanceItem{ id desc taskList{ taskListDescription taskListGroup taskListGroupCounter taskListType } } status statusDesc } technicalObject{ description number ssid technicalObject type } } } } }",
                "variables": oVariable
            };
            
            if(bShowBusy != false){
                bShowBusy = true;
            }
            
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);
            this.logApmApiUsage("recommendation-service");

        },

        /**
        * Function to fetch recommendation maintenance plan unassigned
        * 
        * @param {oVariable} oVariable
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        * @param {Boolean} bShowBusy 
        */
        getRecommendationMaintenancePlansUnAssignedTO: function (oVariable, fnSuccess, fnError, bShowBusy) {

            var sUrl = this.getUrl(this._baseURI, "apmRecommendationGraphQl");
            var oPayload = {
                "query": "query getAssignedTechnicalObjectDetails($recommendationId: String!,$first: Int,$offset: Int){ getAssignedTechnicalObjectDetails( recommendationId: $recommendationId, filter: { hasMaintenancePlan:{ eq: true } }, first: $first,offset: $offset){ totalCount, pageInfo{ hasNextPage hasPreviousPage } edges { node { number type ssid description technicalObject isMPlanCreationInProcess } } } }",
                "variables": oVariable
            };
            
            if(bShowBusy != false){
                bShowBusy = true;
            }
            
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, bShowBusy);
            this.logApmApiUsage("recommendation-service");

        },

        /**
        * Function to update stauts recommendation
        * 
        * @param {oVariable} oVariable
        * @param {Function} fnSuccess 
        * @param {Function} fnError 
        * @param {Boolean} bShowBusy 
        */
        updateAPMStatus: function (sQuery, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "apmRecommendationGraphQl");
            var oPayload = {
                "query": sQuery,
                "variables": {}
            };
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError, true);
            this.logApmApiUsage("recommendation-service");
        },

    });

});