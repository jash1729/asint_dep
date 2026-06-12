sap.ui.define([
    "com/asint/ais/library/datasource/Utility",
    "com/asint/ais/library/datasource/URL",
    "com/asint/ais/library/datasource/asint/Common",
    "com/asint/ais/library/datasource/asint/PicklistNew",
    "com/asint/ais/library/datasource/asint/Equipment",
    "com/asint/ais/library/datasource/asint/FunctionalLocation",
    "com/asint/ais/library/datasource/asint/InspectionTemplate"
], function (Utility, URL, CommonDataSource, PicklistDataSource, EquipmentDataSource, FunctionalLocationDataSource, InspectionTemplate) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.asint.CML", {

        URL: URL,

        _baseURI: "",

        /**
		 * Creates a new instance of the object.
		 * @param {string} sBaseURI 
		 */
        constructor: function (sBaseURI) {

            this._baseURI = sBaseURI;
            this.commonDataSource = new CommonDataSource(sBaseURI);
            this.picklistDataSource = new PicklistDataSource(sBaseURI);
            this.equipmentDataSource = new EquipmentDataSource(sBaseURI);
            this.functionalLocationDataSource = new FunctionalLocationDataSource(sBaseURI);
            this.inspectionTemplateDataSource = new InspectionTemplate(sBaseURI);

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
		 * Retrieves the UOM convert list.
		 * @param {object} oPayload
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        fnUoMConvert: function (oPayload, fnSuccess, fnError) {

            this.commonDataSource.fnUoMConvert(oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the equipment list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getEquipmentList: function (fnSuccess, fnError) {

            this.equipmentDataSource.getEquipmentList(fnSuccess, fnError);

        },

        /**
		 * Retrieves the FLOC list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getFunctionalLocationList: function (fnSuccess, fnError) {

            this.functionalLocationDataSource.getFunctionalLocationList(fnSuccess, fnError);

        },

        // getUoMList: function (fnSuccess, fnError) {

        //     var sUrl = this.getUrl(this._baseURI, "uomList");
        //     var oParam = {};

        //     this.getData(sUrl, oParam, fnSuccess, fnError);

        // },

        /**
		 * Create a new object template.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createObjectTemplate: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplate");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves all the object template.
		 * @param {string} sObjectTemplateId 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        getObjectTemplate: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplateDetailExpanded");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update object template.
		 * @param {string} sObjectTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateObjectTemplate: function (sObjectTemplateId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplateDetail");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the data souce config.
         * @param {string} sCMLTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        getTemplateExpandDataSourceConfig: function (sCMLTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlTemplateExpandDataSourceConfig");
            var oParam = {
                "CMLTemplateId": sCMLTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
		 * Creates template.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createTemplate: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlTemplate");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update template.
		 * @param {string} sCMLTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateTemplate: function (sCMLTemplateId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlTemplateDetail");
            var oParam = {
                "CMLTemplateId": sCMLTemplateId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the CML templates.
         * @param {string} sCMLId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        publishCMLTemplate: function (sCMLId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "publishCMLCollection");
            var oParam = {
                "cmlTemplateCollectionId": sCMLId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates and assign notification v2.
         * @param {string} sCMLId
		 *  @param {string} sVersion   
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createNewRevisionForTemplate: function (sCMLId, sVersion, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "newRevisionCMLCollection");
            var oParam = {
                "cmlTemplateCollectionId": sCMLId,
                "cmlTemplateCollectionVersion": sVersion
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the CML algorithm.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCMLAlgorithmExpandParameter: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAlgorithmExpandParameter");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the algorithm parameter lists.
         * @param {string} sAlgorithmId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */  
        getAlgorithmParameterList: function (sAlgorithmId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAlgorithmExpandParameterList");
            var oParam = {
                "algorithmId": sAlgorithmId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves Characteristics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCharacteristics: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "characteristics");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves reference config.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getReferenceConfig: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlReferenceConfig");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Creates reference config.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createReferenceConfig: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlReferenceConfig");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update reference config.
		 * @param {string} sReferenceConfigId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateReferenceConfig: function (sReferenceConfigId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlReferenceConfigDetail");
            var oParam = {
                "referenceConfigId": sReferenceConfigId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the person.
         * @param {string} sPersonaId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPersona: function (sPersonaId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlPersonaConfigDetail");
            var oParam = {
                "personaId": sPersonaId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Createa new person.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPersona: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlPersonaMaster");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update person.
		 * @param {string} sPersonaId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePersona: function (sPersonaId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlPersonaMasterDetail");
            var oParam = {
                "personaId": sPersonaId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Create person config.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPersonaConfig: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlPersonaConfig");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update person config.
		 * @param {string} sPersonaId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePersonaConfig: function (sPersonaId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlPersonaConfigDetail");
            var oParam = {
                "personaId": sPersonaId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Create data source config.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createDataSourceConfig: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlDataSourceConfig");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update data source config.
		 * @param {string} sDataSourceId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateDataSourceConfig: function (sDataSourceId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlDataSourceConfigDetail");
            var oParam = {
                "dataSourceId": sDataSourceId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the picklist.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklist: function (fnSuccess, fnError) {

            this.picklistDataSource.getPicklist(fnSuccess, fnError);

        },

        /**
		 * Retrieves the picklist UI params.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistUiParams: function (sPicklistId, sObjectTemplateId, sGenericId, fnSuccess, fnError) {

            this.picklistDataSource.getPicklistUiParams(sPicklistId, sObjectTemplateId, sGenericId, fnSuccess, fnError);
        },

        /**
		 * Create picklist UI mapping.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistUiMapping: function (oPayload, fnSuccess, fnError) {

            this.picklistDataSource.createPicklistUiMapping(oPayload, fnSuccess, fnError);

        },

        /**
		 * Update picklist UI mapping.
		 * @param {string} sPicklistUiMappingId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistUiMapping: function (sPicklistUiMappingId, oPayload, eTag, fnSuccess, fnError) {

            this.picklistDataSource.updatePicklistUiMapping(sPicklistUiMappingId, oPayload, eTag, fnSuccess, fnError);

        },

        /**
		 * Retrieves the mapped picklist.
         * @param {string} sObjectTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getMappedPicklist: function (sObjectTemplateId, fnSuccess, fnError) {

            this.picklistDataSource.getUiMappingPicklistByTemplateId(sObjectTemplateId, fnSuccess, fnError);

        },

        /**
		 * Retrieves the picklist params.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistColumns: function (sPicklistId, fnSuccess, fnError) {

            this.picklistDataSource.getPicklistColumns(sPicklistId, fnSuccess, fnError);

        },

        /**
		 * Create picklist UI params.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistUiParam: function (oPayload, fnSuccess, fnError) {

            this.picklistDataSource.createPicklistUiParam(oPayload, fnSuccess, fnError);

        },

        /**
		 * Update picklist UI params.
		 * @param {string} sPicklistUiParamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistUiParam: function (sPicklistUiParamId, oPayload, eTag, fnSuccess, fnError) {

            this.picklistDataSource.updatePicklistUiParam(sPicklistUiParamId, oPayload, eTag, fnSuccess, fnError);

        },

        /**
		 * Create data source config.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createAggregator: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAggregator");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the aggregator details.
         * @param {string} cmlCollectionTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getAggregatorDetails: function (cmlCollectionTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAggregatorByCMLTemplateId");
            var oParam = {
                "cmlCollectionTemplateId": cmlCollectionTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update aggregator.
		 * @param {string} sAggregatorId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateAggregator: function (oPayload, sAggregatorId, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAggregatorById");
            var oParam = {
                "sAggregatorId": sAggregatorId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, false, eTag);

        },

        /**
		 * Retrieves the object template list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectTemplateList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlGetObjectTemplate");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the classes list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getClassesList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlGetClasses");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves a list of classes based on the provided Object template ID
		 * 
		 * @param {string} sObjectTemplateId - The ID of the object template
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The error callback function
		 */
        fnGetClassesList: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getClassListbyObjectTemaplate");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves a list of Characteristic based on the provided Class ID
		 * 
		 * @param {string} sClassId - The ID of the Class
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The error callback function
		 */
        fnGetCharacteristics: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCharacteristicsListbyclass");
            var oParam = {
                "classId": sClassId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves a list of Object template
		 * 
		 * @param {string} sObjectTemplateId - The ID of the object template
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The error callback function
		 */
        fnFetchObjectTemplateList: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getObjectTemplate");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves a list of Classes
		 * 
		 * @param {string} sClassId - The ID of the Class
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The error callback function
		 */
        fnFetchClassesList: function (sClassId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getClassesforCML");
            var oParam = {
                "classId": sClassId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves a list of Characteristic
		 * 
		 * @param {string} sCharacteristic - The ID of the Characteristic
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The error callback function
		 */
        fnFetchCharacteristics: function (sCharacteristic, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCharacteristicsforCML");
            var oParam = {
                "characteristicId": sCharacteristic
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Save the CML Summary Data Source mapping
		 * 
		 * @param {Object} oPayload - DataSource Mapping
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The Error callback function
		 */
        saveCMLDataSourceMapping: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAggregatorDSMapping");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update the Data Source map using Aggregator Id
		 * 
		 * @param {Object} oPayload - DataSource Mapping
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The Error callback function
		 */
        updateCMLDataSourceMapping: function (oPayload, sMappedAggregatorId, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "deleteCMLMappedAggregator");
            var oParam = {
                "sMappedAggregatorId": sMappedAggregatorId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Get Mapped Aggregator List
		 * 
		 * @param {String} sAggregatorName - Aggregator Name
		 * @param {String} sCmlCollectionTemplateId - Collection Template Id
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The Error callback function
		 */
        getMappedAggregatorList: function (sAggregatorName, sCmlCollectionTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlMappedAggregatorList");
            var oParam = {
                "sAggregatorName": sAggregatorName,
                "sCmlCollectionTemplateId": sCmlCollectionTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Delete Data Source based in Aggregator Id
		 * 
		 * @param {String} sAggregatorId - Aggregator map Id
		 * @param {Function} fnSuccess - The success callback function
		 * @param {Function} fnError - The Error callback function
		 */
        fnDeleteAggegatorDataSource: function (oPayload, sMappedAggregatorId, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "deleteCMLMappedAggregator");
            var oParam = {
                "sMappedAggregatorId": sMappedAggregatorId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },



        // For CML Application

        /**
		 * Retrieves the object template with equipment.
         * @param {string} sObjectId 
         * @param {string} sObjectType 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectTemplateWithEquipment: function (sObjectId, sObjectType, fnSuccess, fnError) {
            var sUrl;
            var oParam;
            if (sObjectType == "EQUI") {
                sUrl = this.getUrl(this._baseURI, "getObjectTemplateWithEquipment");
                oParam = {
                    "equipmentId": sObjectId
                };
            } else {
                sUrl = this.getUrl(this._baseURI, "getObjectTemplateWithLocation");
                oParam = {
                    "flocId": sObjectId
                };
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CML template by object template.
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLTemplateByObjetTemplatID: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLTemplate");
            var oParam = {
                "cmlTempId": sTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection template by equipment.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getInspectionTemplatesByEquipment: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByEquipment");
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection template by FLOC.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getInspectionTemplatesByFunctionalLocation: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsInspectionTemplateByFunctionalLocation");
            var oParam = {
                "functionalLocationId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CMLs.
      	 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLs: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLs");
            var oParam = {};

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create CML.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCML: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLs");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
		 * Update CML reading.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCMLReading: function (oPayload, fnSuccess, fnError, eTag) {
            var sUrl = this.getUrl(this._baseURI, "updateCMLs");
            var oParam = {
                "cmlId": oPayload.ID
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Create CML reading.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCMLReading: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlDataSourceValue");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves half life data for analytics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getHalfLifeDataforAnalytics: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getHalfLifeDataAnalytics");
            that.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the asset hierarchy.
         * @param {string} sEmail 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getAssetHierarchy: function (sEmail, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAssetHierarchy");
            var oParam = {
                "email": sEmail
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, false);

        },

        /**
		 * Create CML template collection.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCMLTemplateCollection: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLTemplateCollection");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the CML template collection.
         * @param {string} sCMLTemplateCollectionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLTemplateCollection: function (sCMLTemplateCollectionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLTemplateCollectionDetailExpanded");
            var oParam = {
                "cmlTemplateCollectionId": sCMLTemplateCollectionId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create CML location template.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCMLLocationTemplate: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlLocationTemplate");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError, true);

        },

        /**
		 * Update CML location template.
		 * @param {string} sCMLTemplateId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCMLLocationTemplate: function (sCMLTemplateId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateCmlLocationTemplate");
            var oParam = {
                "cmlTemplateId": sCMLTemplateId
            }

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);

        },

        /**
		 * Retrieves the object template detail.
         * @param {string} sObjectTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectTemplatewithDetail: function (sObjectTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "objectTemplatewithDetail");
            var oParam = {
                "objectTemplateId": sObjectTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the picklist.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistList: function (fnSuccess, fnError) {

            this.picklistDataSource.getPicklistList(fnSuccess, fnError);

        },

        /**
		 * Create inspection.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createInspection: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsCreateInspection");
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Update CML template collection.
		 * @param {string} sCMLTemplateCollectionId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCMLTemplateCollection: function (sCMLTemplateCollectionId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateCMLTemplateCollection");
            var oParam = {
                "cmlTemplateCollectionId": sCMLTemplateCollectionId
            };
            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },


        // CML Detail page

        /**
		 * Retrieves the CML asset overview list.
         * @param {string} sCMLTemplateCollectionId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLAssetOverviewListById: function (sCMLTemplateCollectionId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLAssetOverviewListById");
            var oParam = {
                "cmlAssetOverviewListId": sCMLTemplateCollectionId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the object details.
         * @param {string} sObjectType 
         * @param {string} sObjectId
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectDetails: function (sObjectType, sObjectId, fnSuccess, fnError) {

            var sUrl = "";

            if (sObjectType === "FLOC" || sObjectType === "Functional Location") {
                sUrl = this.getUrl(this._baseURI, "getCMLsByFunctionalLocationId");
            } else if(sObjectType === "EQUI" || sObjectType === "Equipment") {
                sUrl = this.getUrl(this._baseURI, "getCMLsByEquipmentId");
            }

           if (!sUrl) {
                if (fnError) {
                    fnError({
                        error: {
                            code: "500",
                            message: "Invalid object type: " + sObjectType
                        }
                    });
                }
                return;
            }
            var oParam = {
                "sObjectId": sObjectId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * @param {Function} fnSuccess 
         * @param {Function} fnError 
         */
        getCMLHeaderList: function (fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLHeaders");
            var oParam = {}

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CMLs by object id.
         * @param {string} sObjectId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLsByObjectId: function (sObjectId, fnSuccess, fnError, iSkip, iTop) {

            var sUrl = this.getUrl(this._baseURI, "getCMLsByObjectId");
            if(iSkip){
                sUrl += "&$skip=" + iSkip;
            }
            if(iTop && iTop != 1000){
                sUrl += "&$top=" + iTop;
            }
            var oParam = {
                "sObjectId": sObjectId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the inspection header mapping.
         * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getInspectionHeaderMapping: function (sTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "idmsTemplateHeaderMappingRolesConfig");
            var oParam = {
                "templateId": sTemplateId
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the selected CMLs details id.
         * @param {string} sCMLId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getSelectedCMLDetailById: function (sCMLId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getSelectedCMLDetailById");
            var oParam = {
                "sCMLId": sCMLId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CML template detail by id.
         * @param {string} sCMLTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLTemplateDetailById: function (sCMLTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getCMLTemplateDetailById");
            var oParam = {
                "sCMLTemplateId": sCMLTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update CML data source values.
		 * @param {string} sCMLId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        saveCMLDataSourceValues: function (sCMLId, oPayload, eTag, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "updateCMLs");
            var oParam = {
                "cmlId": sCMLId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the CML collection expand templates by equipment.
         * @param {string} sEquipmentId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCMLCollectionExpandTemplatesByEquipment: function (sEquipmentId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getEquCMLCollectionExpandCMLTemplates");
            var oParam = {
                "equipmentId": sEquipmentId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CML collection expand templates by floc.
         * @param {string} sFunctionalLocationId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getCMLCollectionExpandTemplatesByFunctionalLocation: function (sFunctionalLocationId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getFLOCCMLCollectionExpandCMLTemplates");
            var oParam = {
                "flocId": sFunctionalLocationId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Update CML details.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updateCMLDetail: function (oPayload, fnSuccess, fnError, eTag) {

            var sUrl = this.getUrl(this._baseURI, "updateCMLs");
            var oParam = {
                "cmlId": oPayload.ID
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the template mapped picklist.
         * @param {string} sCMLTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        fnGetTemplateMappedPicklist: function (sCMLTemplateId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "picklistByCMLTemplateId");
            var oParam = {
                "sCMLTemplateId": sCMLTemplateId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the UI picklist.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        fnGetUIPickList: function (sPicklistId, fnSuccess, fnError) {

            this.picklistDataSource.fnGetUIPickList(sPicklistId, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist UI params.
         * @param {string} sObjectTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getPicklistAllUiParams: function (sObjectTemplateId, fnSuccess, fnError) {

            this.picklistDataSource.getPicklistAllUiParams(sObjectTemplateId, fnSuccess, fnError);

        },

        /**
		 * Create sequence of API.
         * @param {Object} oPayload 
         * @param {Object} sUrl 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        fnCallSequenceOfAPI: function (sUrl, oPayload, fnSuccess, fnError) {

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Create UOM conversion.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        fnUoMConversion: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "uomConversion");

            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the CML asset.
         * @param {string} sAssetId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCMLAsset: function (sAssetId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAssetOverviewById");
            var oParam = {
                "sAssetId": sAssetId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Create CML asset.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createCMLAsset: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAssetOverview");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the object by CML name.
         * @param {string} sFilterData 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectByCMLName: function (sFilterData, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getObjectByCMLName");
            var oParam = {
                "sFilterData": encodeURIComponent(sFilterData)
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Function to assign CMLs for Recommendation
         * 
         * @param {String} sRecommendatioId - Recommendation ID
         * @param {Object} oPayload - Payload of CMLs
         * @param {String} eTag - ETag
         * @param {Function} fnSuccess - Success Callback
         * @param {Function} fnError - Error callback
         */
        assignCMLtoRecommendations: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlAssignToRecommendation");
            // var oParam = {
            //     "sRecommendatioId": sRecommendatioId
            // };

            // Dont change this to patch - API is mapped with PUT in the backend but works like patch
            this.putData(sUrl, {}, oPayload, fnSuccess, fnError, true);

        },

        /**
         * Function to get CMLs for Recommendation
         * 
         * @param {String} sRecommendatioId - Recommendation ID
         * @param {Function} fnSuccess - Success Callback
         * @param {Function} fnError - Error callback
         */
        getCMLstoRecommendation: function (sRecommendatioId, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "cmlToRecommendation");
            var oParam = {
                "sRecommendatioId": sRecommendatioId
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Retrieves the code list by display id.
         * @param {Array} aCodeListDisplayId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getCodeListByDisplayId: function (aCodeListDisplayId, fnSuccess, fnError) {
			
            var sUrl = this.getUrl(this._baseURI, "codeListByFilter");
            var aFilter = [];

            for (var i = 0; i < aCodeListDisplayId.length; i++) {
                aFilter.push("displayId eq '" + aCodeListDisplayId[i] + "'");
            }

            var oParam = {
                filter: aFilter.join(" or ")
            };

            this.getData(sUrl, oParam, fnSuccess, fnError, true);

        },

        /**
         * Function to update alert
         * @param {String} sMspId 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {String} sEtag
         */
        updateAlerts : function(sTemplateId,oPayload,fnSuccess,fnError,sEtag){
            var sUrl = this.getUrl(this._baseURI, "updateCmlLocationTemplate");
            var oParam = {
                "cmlTemplateId":sTemplateId
            };
            this.patchData(sUrl,oParam,oPayload,fnSuccess, fnError, true,sEtag); 
        },

        /**
         * Function to get cml summary
         * @param {String} sObjectId 
         * @param {String} sObjectType 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnGetSummaryDetails: function (sObjectId, sObjectType, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getSummaryDetails");
            var oParam = {
                "sObjectId": sObjectId,
                "sObjectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
         * Function to update cml summary
         * @param {String} sObjectId 
         * @param {String} sObjectType 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnGetSummary: function (sObjectId, sObjectType, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "getSummary");
            var oParam = {
                "sObjectId": sObjectId,
                "sObjectType": sObjectType
            };

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Function to bulk fetch object parent
         * @param {Array} aPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        bulkFetchObjectParent: function (aPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "bulkFetchObjectParent");
            var oParam = {};

            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError);

        },

        /**
		 * Retrieves the object template with equipment/floc from a rest api
         * @param {string} sObjectId 
         * @param {string} sObjectType 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getObjectTemplatesNew: function (sObjectId, sObjectType, fnSuccess, fnError) {
            var sUrl;
            var oParam;
            if (sObjectType == "EQUI") {
                sUrl = this.getUrl(this._baseURI, "getObjectTemplateWithEquipmentNew");
                oParam = {
                    "equipmentId": sObjectId
                };
            } else {
                sUrl = this.getUrl(this._baseURI, "getObjectTemplateWithFlocNew");
                oParam = {
                    "flocId": sObjectId
                };
            }

            this.getData(sUrl, oParam, fnSuccess, fnError);

        },

        /**
		 * Renew CML.
         * @param {Object} oPayload  
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        renewCML: function (oPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "renewCML");
            var oParam = {};

            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },

        /**
         * Retrieves Remaining life count data for analytics.
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */ 
        getRemainingLifeTechCountforAnalytics: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getRemainingLifeTechCountforAnalytics");
            that.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves Stcr vs Technical object count data for analytics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getStcrTechCountforAnalytics: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getStcrTechCountforAnalytics");
            that.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves Ltcr vs Technical Object data for analytics.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */ 
        getLtcrTechCountforAnalytics: function (fnSuccess, fnError) {
            var that = this;
            var sUrl = this.getUrl(this._baseURI, "getLtcrTechCountforAnalytics");
            that.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the backend picklist .
		 * @param {string} sAlgId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getBackendPicklist : function(sAlgId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getBackendPicklist"];
            var oParam = {
                "algorithmId": sAlgId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist BE mapping.
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistBEMapping : function(fnSuccess, fnError, sTemplateId){
            var sUrl = this._baseURI + this.URL["picklistBEMapping"];
            sUrl = sUrl + "?$filter=templateId eq '" + sTemplateId + "'";
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist BE parameter details .
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistBEParameters : function(fnSuccess, fnError, sTemplateId, sSkipVal){
            var sUrl = this._baseURI + this.URL["creatBEPicklistParam"];
            sUrl = sUrl + "?$filter=templateId eq '" + sTemplateId + "'";
            if(sSkipVal){
                sUrl = sUrl + "&$skip=" + sSkipVal;
            }
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Retrieves the picklist detail.
         * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getPicklistDetail : function(sPicklistId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getPicklistDetail"];
            var oParam = {
                "picklistId": sPicklistId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new picklist BE mapping.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistBEMapping : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["picklistBEMapping"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Retrieves the static backend picklist parameter .
		 * @param {string} sPicklistId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getStaticBackendPicklistParam : function(sPicklistId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["staticBackendParamsList"];
            var oParam = {
                "picklistid": sPicklistId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Creates a new picklist BE parameter.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        createPicklistBEParam : function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["creatBEPicklistParam"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * Updates picklist BE mapping details.
		 * @param {string} sMapId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistBEMapping : function(sMapId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updatePicklistBEMapping"];
            var oParam = {
                "sMapId": sMapId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Updates picklist BE parameter details.
		 * @param {string} sParamId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        updatePicklistBEParam : function(sParamId, oPayload, fnSuccess, fnError, eTag){
            var sUrl = this._baseURI + this.URL["updateBEPicklistParam"];
            var oParam = {
                "sParamId": sParamId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
		 * Retrieves the picklist BE parameter details .
		 * @param {string} sTemplateId 
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAssignedAlgorithm : function(sTemplateId, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getAssignedAlgorithm"];
            var oParam = {
                "templateId": sTemplateId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
		 * Retrieves the algorithm list.
		 * @param {function} fnSuccess
		 * @param {function} fnError 
		 */
        getAlgorithmList:function(fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["getAlgorithmList"];
            this.getData(sUrl, {}, fnSuccess, fnError);
        },

        /**
		 * Creates a new assigned algorithm.
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 */
        postAssignedAlgorithm:function(oPayload, fnSuccess, fnError){
            var sUrl = this._baseURI + this.URL["postAssignedAlgorithm"];
            this.postData(sUrl, {}, oPayload, fnSuccess, fnError);
        },

        /**
		 * delete assigned Alg.
		 * @param {string} sAlgId 
		 * @param {Object} oPayload 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {string} eTag 
		 */
        deleteAssignedAlg : function(sAlgId, oPayload, fnSuccess, fnError,eTag){
            var sUrl = this._baseURI + this.URL["deleteAssignedAlgorithm"];
            var oParam = {
                "sAlgId": sAlgId
            };

            this.patchData(sUrl, oParam, oPayload, fnSuccess, fnError, true, eTag);
        },

        /**
         * Function for move CML
         * @param {Array} aPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnMoveCmlToNewAsset: function (aPayload, fnSuccess, fnError) {

            var sUrl = this.getUrl(this._baseURI, "moveCML");
            var oParam = {};
            this.postData(sUrl, oParam, aPayload, fnSuccess, fnError);
        },
        
        /**
         * Function for move CML
         * @param {Array} aPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         */
        fnBulkCalculateCMl: function (oPaylaod, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "bulkCalculateForCml");
            var oParam = {};
            this.postData(sUrl, oParam, oPaylaod , fnSuccess, fnError);
        },

        /**
         * Retrieves the ASD by object id.
         * @param {Array} aObjectId 
         * @param {function} fnSuccess
         * @param {function} fnError 
         */
        getASDLatest: function (techObjectId, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getASDLatest");
            var oParam = {
                "techObjectId": techObjectId
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },
        
        /**
         * Retrieves all CMLs.
         * @param {string} objectId - The object ID.
         * @param {string} objectType - The object Type.
         * @param {function} fnSuccess - The success callback function.
         * @param {function} fnError - The error callback function.
         */
        getAllCMLs: function (objectId, objectType, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "getallCMLs");
            var oParam = {
                "objectId": objectId,
                "objectType": objectType
            };
            this.getData(sUrl, oParam, fnSuccess, fnError);
        },

        /**
         * Call AI API for insights generation
         * @param {Object} oPayload - AI request payload
         * @param {function} fnSuccess - Success callback
         * @param {function} fnError - Error callback
         */
        callAIAPI: function (oPayload, fnSuccess, fnError) {
            var sUrl = this.getUrl(this._baseURI, "AISummaryDetails");
            var oParam = {
                "type": "CML"
            };
            this.postData(sUrl, oParam, oPayload, fnSuccess, fnError);
        },
    });

  

});