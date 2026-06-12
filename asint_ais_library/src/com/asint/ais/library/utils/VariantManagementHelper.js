sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/asint/ais/library/datasource/asint/Common",
    "sap/m/MessageToast",
    "sap/ui/model/resource/ResourceModel"
], function (Formatter, PersonalizableInfo, Filter, FilterOperator, Common, MessageToast, ResourceModel) {
    "use strict";

    return Formatter.extend("com.asint.ais.library.utils.VariantManagementHelper", {

        _oConfigTemplate: {
            "ControlId": {
                "SmartVariantManagement": "",
                "Filterbar": "",
                "Table": [],
                "SnappedContent": "",
                "ExpandedContent": ""
            },
            "FilterBarSettings": {
                "EnableBasicSearch": true,
                "BasicSearchKeys": [],
            },
            "Settings": {
                "LoadOnlyVisibleTable": true
            }

        },

        _DefaultFilter : [],

        _bValidationPassed: false,

        _bRunning: false,

        _localControllerRef : null,

        /**
         * Construtor function
         * @param {Object} oController 
         * @param {Object} oConfig 
         */
        constructor: function (oController, oConfig,sBaseURI) {

            this._oConfig = oConfig;
            this._localControllerRef = oController;
            this._baseURI = sBaseURI;

            if (sBaseURI) {
                this.commonDataSource = new Common(sBaseURI);
            }

            var _i18nModel = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });

            this._i18n = _i18nModel.getResourceBundle();

            this._featureFlagConfig = {
                "isLoaded": false,
                "recommendationDateRangeFilter": "0",
            };

            if (this._fnValidateParam(oConfig)) {
                this._aTable = [];
                var aTableId = oConfig.ControlId.Table;
                var bTableExistFlag = true;
                for (var i = 0; i < aTableId.length; i++) {
                    var oTable = sap.ui.core.Fragment.byId(oController._appNamespace,aTableId[i]) || oController.getView().byId(aTableId[i]);
                    if (oTable) {
                        this._aTable.push(oTable);
                    } else {
                        bTableExistFlag = false;
                    }
                }
                this._oFilterBar = sap.ui.core.Fragment.byId(oController._appNamespace,oConfig.ControlId.Filterbar)  || oController.getView().byId(oConfig.ControlId.Filterbar);
                this._oSmartVariantManagement = sap.ui.core.Fragment.byId(oController._appNamespace,oConfig.ControlId.SmartVariantManagement)  || oController.getView().byId(oConfig.ControlId.SmartVariantManagement);
                if (bTableExistFlag && this._oFilterBar && this._oSmartVariantManagement) {
                    this._bValidationPassed = true;
                }
                if (oConfig.ControlId && oConfig.ControlId.ExpandedContent) {
                    this._oExpandedLabel = sap.ui.core.Fragment.byId(oController._appNamespace,oConfig.ControlId.ExpandedContent)  || oController.getView().byId(oConfig.ControlId.ExpandedContent);
                    if (!this._oExpandedLabel && this._bValidationPassed) {
                        this._bValidationPassed = false;
                    }
                }
                if (oConfig.ControlId && oConfig.ControlId.SnappedContent) {
                    this._oSnappedLabel = sap.ui.core.Fragment.byId(oController._appNamespace,oConfig.ControlId.SnappedContent)  || oController.getView().byId(oConfig.ControlId.SnappedContent);
                    if (!this._oSnappedLabel && this._bValidationPassed) {
                        this._bValidationPassed = false;
                    }
                }
            }

        },

        /**
         * Function to initialize the filter bar
         * @returns Boolean
         */
        initialise: function () {
            var that = this;
            if(this._baseURI){
                this.fnLoadFeatureFlagConfig();
            }
            if (this._bValidationPassed) {
                this._oFilterBar.registerFetchData(this._fnVariantHelperFetchData.bind(this));
                this._oFilterBar.registerApplyData(this._fnVariantHelperApplyData.bind(this));
                this._oFilterBar.registerGetFiltersWithValues(this._fnVariantHelperGetFiltersWithValues.bind(this));

                this._oFilterBar.attachFilterChange(this._fnUpdateVariantManagementText.bind(this));
                this._oFilterBar.attachAfterVariantLoad(this._fnUpdateVariantManagementText.bind(this));
                this._oFilterBar.attachSearch(this._fnPerformSearch.bind(this));
                this._oFilterBar.attachReset(function(){
                    setTimeout(function(){
                        that._fnHandleResetFilterBar();
                        that._fnHandleDefaultFiltersOnReset();
                        that._fnUpdateVariantManagementText();
                    },5);
                });

                this._fnAttachChangeEvent();

                var oPersInfo = new PersonalizableInfo({
                    type: "filterBar",
                    keyName: this._oFilterBar.getPersistencyKey(),
                    dataSource: "",
                    control: this._oFilterBar
                });

                this._oSmartVariantManagement.addPersonalizableControl(oPersInfo);
                this._oSmartVariantManagement.initialise(function () { }, this._oFilterBar);

                if (this._oConfig.FilterBarSettings.EnableBasicSearch) {
                    this._fnFilterBarSetBasicSearch("");
                }
                this._fnSetDefaultFilterValues();

                this._bRunning = true;
            }

            return this._bRunning;

        },

        /**
         * Function to refresh binding
         */
        refreshBinding: function () {

            /**
             * refresh function
             * @param {Number} i 
             */
            var fnRefresh = function (i) {
                if (this._aTable[i].getMetadata().getName() === "sap.m.Table") {
                    if(this._aTable[i].getBinding("items")) {
                        this._aTable[i].getBinding("items").refresh();
                    }
                } else if (this._aTable[i].getMetadata().getName() === "sap.ui.table.Table") {
                    if(this._aTable[i].getBinding("rows")) {
                        this._aTable[i].getBinding("rows").refresh();
                    }
                }
            }

            for (var i = 0; i < this._aTable.length; i++) {
                if (this._oConfig.Settings.LoadOnlyVisibleTable) {
                    if (this._aTable[i].getVisible()) {
                        fnRefresh.call(this, i);
                    }
                } else {
                    fnRefresh.call(this, i);
                }
            }

        },

        /**
         * Function to handle reset filter bar
         */
        _fnHandleResetFilterBar : function(){
            var aFilterGroupItem = this._oFilterBar.getFilterGroupItems();

            for (var i = 0; i < aFilterGroupItem.length; i++) {

                var oFilterControl = aFilterGroupItem[i].getControl();
                var sControlType = oFilterControl.getMetadata().getName();

                switch (sControlType) {
                case "sap.m.Input":
                case "sap.m.DatePicker":
                    if (oFilterControl.getValue()) {
                        oFilterControl.setValue("");
                    }
                    break;
                case "sap.m.DateRangeSelection":
                    if (oFilterControl.getValue()) {
                        oFilterControl.setValue("");
                    }
                    break;
                case "sap.m.ComboBox":
                    if (oFilterControl.getSelectedKey()) {
                        oFilterControl.setSelectedKey("");
                    }
                    break;
                case "sap.m.MultiComboBox":
                    if (oFilterControl.getSelectedKeys().length > 0) {
                        oFilterControl.setSelectedKeys([]);
                    }
                    break;
                case "sap.m.MultiInput":
                    if (oFilterControl.getTokens().length > 0) {
                        var aTokens = oFilterControl.getTokens();
                        oFilterControl.removeAllTokens(); 
                        // oFilterControl.getTokens().forEach(function(oToken){
                        //     oFilterControl.removeToken(oToken);
                        // })
                        aTokens.forEach(function(token) {
                            token.destroy();
                        });
                        var oTokenControl = oFilterControl.getAggregation("tokenizer");
                        if(oTokenControl){
                            var oBindingInfo = oTokenControl.getBindingInfo("tokens");
                            if(oBindingInfo){
                                var sModel = oBindingInfo.model;
                                var sPath = oBindingInfo.path;
                                var oModel = this._localControllerRef.getModel(sModel);
                                oModel.setProperty(sPath, []);
                            }
                        }
                    }
                    break;
                case "sap.m.Switch":
                    if (oFilterControl.getState()) {
                        oFilterControl.setState(false);
                    }
                    break;
                case "sap.m.HBox":
                    if (oFilterControl.getItems().length > 0) {
                        oFilterControl.getItems().forEach(function(oItem) {
                            if(oItem.getMetadata().getName() === "sap.m.Input"){
                                oItem.setValue("");
                            }
                        });
                    }
                    break;
                }
            }
        },

        /**
         * Function to set default filter values
         */
        _fnSetDefaultFilterValues : function(){
            var that = this;
            var aFilterItem = this._oFilterBar.getAllFilterItems();
            var oControlValues = [];
            for (var i = 0; i < aFilterItem.length; i++) {

                var oFilterControl = aFilterItem[i].getControl();
                var sControlType = oFilterControl.getMetadata().getName();
                var sName = aFilterItem[i].getProperty("name");
                var oValObj = {};
                oValObj.key = sName;
                var isDefault = "";
                var sText = "";
                
                if(oFilterControl.attachSubmit) {
                    oFilterControl.attachSubmit(function() {
                        that._oFilterBar.fireSearch();
                    });
                }
                if(aFilterItem[i].getCustomData().length > 0){
                    sText = aFilterItem[i].getCustomData()[0].getProperty("key");
                    isDefault = aFilterItem[i].getCustomData()[0].getProperty("value");
                }
                if(sText == "DefaultFilter" && isDefault){
                    switch (sControlType) {
                    case "sap.m.Input":
                    case "sap.m.DatePicker":
                        oValObj.value = oFilterControl.getValue();
                        break;
                    case "sap.m.DateRangeSelection":
                        oValObj.value = oFilterControl.getValue();
                        break;
                    case "sap.m.ComboBox":
                        oValObj.value = oFilterControl.getSelectedKey();
                        break;
                    case "sap.m.MultiComboBox":
                        oValObj.value = oFilterControl.getSelectedKeys();
                        break;
                    case "sap.m.MultiInput":
                        oValObj.value = oFilterControl.getTokens();
                        break;
                    case "sap.m.Switch":
                        oValObj.value = oFilterControl.getState();
                        break;
                    case "sap.m.HBox":
                        var aInputValue = [];
                        oFilterControl.getItems().forEach(function(oItem) {
                            if(oItem.getMetadata().getName() === "sap.m.Input") {
                                aInputValue.push(oItem.getValue());
                            }
                        });
                        oValObj.value = aInputValue;
                        break;
                    }
                    oControlValues.push(oValObj);
                }
            }
            this._DefaultFilter = oControlValues;
        },

        /**
         * Function to handle default filters on reset
         */
        _fnHandleDefaultFiltersOnReset : function(){
            var oControlValues = this._DefaultFilter;
            // this._oFilterBar.reset();

            var aFilterItem = this._oFilterBar.getAllFilterItems();
            if(oControlValues.length > 0){
                oControlValues.forEach(function(valObj){
                    for (var i = 0; i < aFilterItem.length; i++) {
                        var oFilterControl = aFilterItem[i].getControl();
                        var sControlType = oFilterControl.getMetadata().getName();
                        var sName = oFilterControl.getProperty("name") || aFilterItem[i].getProperty("name");
                        if(sName == valObj.key){
                            switch (sControlType) {
                            case "sap.m.Input":
                            case "sap.m.DatePicker":
                                oFilterControl.setValue(valObj.value);
                                break;
                            case "sap.m.DateRangeSelection":
                                oFilterControl.setValue(valObj.value);
                                break;
                            case "sap.m.ComboBox":
                                oFilterControl.setSelectedKey(valObj.value);
                                break;
                            case "sap.m.MultiComboBox":
                                oFilterControl.setSelectedKeys(valObj.value);
                                break;
                            case "sap.m.MultiInput":
                                oFilterControl.setTokens(valObj.value);
                                break;
                            case "sap.m.Switch":
                                oFilterControl.setState(valObj.value);
                                break;
                            case "sap.m.HBox":
                                var aInputValue = valObj.value;
                                oFilterControl.getItems().forEach(function(oItem,iIndex) {
                                    if(oItem.getMetadata().getName() === "sap.m.Input") {
                                        oItem.setValue(aInputValue[iIndex]);
                                    }
                                });
                                break;
                            }
                        }
                    }
                });
            }
            this._oFilterBar.fireSearch();
        },

        /**
         * Function to validate params
         * @param {Object} oConfig 
         * @returns 
         */
        _fnValidateParam: function (oConfig) {

            /**
             * Local call back function
             * @param {Object} oParam1 
             * @param {Object} oParam2 
             * @returns 
             */
            var fnCheck = function (oParam1, oParam2) {
                if (typeof oParam1 === "object" && !Array.isArray(oParam1)) {
                    var aParam1Key = Object.keys(oParam1);
                    var aParam2Key = Object.keys(oParam2);
                    var aDiff = aParam1Key.filter(function (sKey) {
                        return !aParam2Key.includes(sKey);
                    });
                    if (aDiff.length === 0) {
                        var bCheck = true;
                        for (var i = 0; i < aParam1Key.length; i++) {
                            if (!fnCheck(oParam1[aParam1Key[i]], oParam2[aParam1Key[i]])) {
                                bCheck = false;
                                break;
                            }
                        }
                        return bCheck;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            };

            return fnCheck(this._oConfigTemplate, oConfig);

        },

        /**
         * Function to handle search
         * @param {String} sValue 
         */
        _fnFilterBarSetBasicSearch: function (sValue) {

            this._oFilterBar.setBasicSearch(new sap.m.SearchField({
                value: sValue,
                search: function () {
                    this._oFilterBar.fireSearch();
                }.bind(this),
                change: function (oEvent) {
                    this._fnFieldDataChange(oEvent);
                }.bind(this)
            }));

        },

        /**
         * Function to feth varinat data
         * @returns 
         */
        _fnVariantHelperFetchData: function () {

            var aFilterData = [];
            var aFilterItem = this._oFilterBar.getAllFilterItems();

            if (this._oFilterBar.getBasicSearch()) {
                aFilterData.push({
                    groupName: "BASIC_SEARCH",
                    fieldName: "BASIC_SEARCH",
                    fieldData: this._oFilterBar.getBasicSearchValue()
                });
            }

            for (var i = 0; i < aFilterItem.length; i++) {

                var oFilterControl = aFilterItem[i].getControl();
                var sControlType = oFilterControl.getMetadata().getName();
                var oFilterData = {
                    groupName: aFilterItem[i].getGroupName(),
                    fieldName: aFilterItem[i].getName(),
                    fieldData: ""
                };

                switch (sControlType) {
                case "sap.m.Input":
                case "sap.m.DatePicker":
                    oFilterData.fieldData = oFilterControl.getValue();
                    break;
                case "sap.m.DateRangeSelection":
                    oFilterData.fieldData = oFilterControl.getValue();
                    break;
                case "sap.m.ComboBox":
                    oFilterData.fieldData = oFilterControl.getSelectedKey();
                    break;
                case "sap.m.MultiComboBox":
                    oFilterData.fieldData = oFilterControl.getSelectedKeys();
                    break;
                case "sap.m.MultiInput":
                    var aText = [];
                    var aToken = oFilterControl.getTokens();
                    for (var j in aToken) {
                        aText.push(aToken[j].getText());
                    }
                    oFilterData.fieldData = aText;
                    break;
                case "sap.m.Switch":
                    oFilterData.fieldData = oFilterControl.getState();
                    break;
                case "sap.m.HBox": // For Input as children
                    var aValues = [];
                    oFilterControl.getItems().forEach(function (oItem) {
                        if(oItem.getMetadata().getName() === "sap.m.Input"){
                            aValues.push(oItem.getValue());
                        }
                    });
                    oFilterData.fieldData = aValues;
                    break;
                }

                aFilterData.push(oFilterData);
            }

            return aFilterData;

        },

        /**
         * Function to apply filter data
         * @param {Array} aFilterData 
         */
        _fnVariantHelperApplyData: function (aFilterData) {

            for (var i = 0; i < aFilterData.length; i++) {

                if (aFilterData[i].fieldName === "BASIC_SEARCH" && aFilterData[i].groupName === "BASIC_SEARCH") {

                    if (this._oConfig.FilterBarSettings.EnableBasicSearch) {

                        this._fnFilterBarSetBasicSearch(aFilterData[i].fieldData);
                    }
                } else {

                    var oFilterControl = this._oFilterBar.determineControlByName(aFilterData[i].fieldName, aFilterData[i].groupName);

                    if (oFilterControl) {

                        var sControlType = oFilterControl.getMetadata().getName();

                        switch (sControlType) {
                        case "sap.m.Input":
                        case "sap.m.DatePicker":
                            oFilterControl.setValue(aFilterData[i].fieldData);
                            break;
                        case "sap.m.DateRangeSelection":
                            oFilterControl.setValue(aFilterData[i].fieldData);
                            break;
                        case "sap.m.ComboBox":
                            oFilterControl.setSelectedKey(aFilterData[i].fieldData);
                            break;
                        case "sap.m.MultiComboBox":
                            oFilterControl.setSelectedKeys(aFilterData[i].fieldData);
                            break;
                        case "sap.m.MultiInput":
                            var aText = aFilterData[i].fieldData;
                            for (var j in aText) {
                                oFilterControl.addToken(new sap.m.Token({
                                    key: aText[j],
                                    text: aText[j]
                                }));
                            }
                            break;
                        case "sap.m.Switch":
                            oFilterControl.setState(aFilterData[i].fieldData);
                            break;
                        case "sap.m.HBox": // For StepInput as children
                            var aValues = aFilterData[i].fieldData;
                            oFilterControl.getItems().forEach(function (oItem, index) {
                                if(oItem.getMetadata().getName() === "sap.m.Input"){
                                    oItem.setValue(aValues[index]);
                                }
                            });
                            break;
                        }
                    }
                }

            }

            this._oFilterBar.fireSearch();

        },

        /**
         * 
         * @returns Array
         */
        _fnVariantHelperGetFiltersWithValues: function () {

            var aFilterGroupItemWithValues = [];
            var aFilterGroupItem = this._oFilterBar.getFilterGroupItems();

            for (var i = 0; i < aFilterGroupItem.length; i++) {

                var oFilterControl = aFilterGroupItem[i].getControl();
                var sControlType = oFilterControl.getMetadata().getName();

                switch (sControlType) {
                case "sap.m.Input":
                case "sap.m.DatePicker":
                    if (oFilterControl.getValue()) {
                        aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                    }
                    break;
                case "sap.m.DateRangeSelection":
                    if (oFilterControl.getValue()) {
                        aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                    }
                    break;
                case "sap.m.ComboBox":
                    if (oFilterControl.getSelectedKey()) {
                        aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                    }
                    break;
                case "sap.m.MultiComboBox":
                    if (oFilterControl.getSelectedKeys().length > 0) {
                        aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                    }
                    break;
                case "sap.m.MultiInput":
                    if (oFilterControl.getTokens().length > 0) {
                        aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                    }
                    break;
                case "sap.m.Switch":
                    if (oFilterControl.getState()) {
                        aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                    }
                    break;
                case "sap.m.HBox":
                    if (oFilterControl.getItems().length > 0) {
                        var bHasStepInputs = oFilterControl.getItems().some(function (oItem) {
                            return oItem.getValue() && oItem.getMetadata().getName() === "sap.m.Input";
                        });
                        if (bHasStepInputs) {
                            aFilterGroupItemWithValues.push(aFilterGroupItem[i]);
                        }
                    }
                    break;
                }
            }

            return aFilterGroupItemWithValues;

        },

        /**
         * Function to attach change event for controls
         */
        _fnAttachChangeEvent: function () {

            var aFilterItem = this._oFilterBar.getAllFilterItems();

            for (var i = 0; i < aFilterItem.length; i++) {

                var oFilterControl = aFilterItem[i].getControl();
                var sControlType = oFilterControl.getMetadata().getName();

                switch (sControlType) {
                case "sap.m.Input":
                case "sap.m.DatePicker":
                case "sap.m.DateRangeSelection":
                    oFilterControl.attachChange(this._fnFieldDataChange.bind(this));
                    break;
                case "sap.m.ComboBox":
                case "sap.m.MultiComboBox":
                    oFilterControl.attachSelectionChange(this._fnFieldDataChange.bind(this));
                    break;
                case "sap.m.MultiInput":
                    oFilterControl.attachTokenUpdate(this._fnFieldDataChange.bind(this));
                    break;
                case "sap.m.Switch":
                    oFilterControl.attachChange(this._fnFieldDataChange.bind(this));
                    break;
                case "sap.m.HBox":
                    oFilterControl.getItems().forEach(function (oItem) {
                        if (oItem.getMetadata().getName() === "sap.m.Input") {
                            oItem.attachChange(this._fnFieldDataChange.bind(this));
                        }
                    }.bind(this));
                    break;
                }
            }

        },

        /**
         * Function to update variant management text
         */
        _fnUpdateVariantManagementText: function () {

            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");

            var aFiltersWithValues = this._oFilterBar.retrieveFiltersWithValues();
            var aNonVisibleFiltersWithValues = this._oFilterBar.retrieveNonVisibleFiltersWithValues();
            var sSnappedText = oI18n.getText("variantMgmt.noActiveFilters.text"), sExpandedText = oI18n.getText("variantMgmt.noActiveFilters.text");

            if (this._oFilterBar.getBasicSearch() && this._oFilterBar.getBasicSearchValue()) {
                aFiltersWithValues.unshift(oI18n.getText("variantMgmt.basicSearch.text"));
            }

            var aFilterGroupItems = this._oFilterBar.getFilterGroupItems();
            aFilterGroupItems.forEach(function (oFilterItem) {
                var oControl = oFilterItem.getControl();
                var sControlType = oControl.getMetadata().getName();
                var bRemoveFilter = false;

                switch (sControlType) {
                case "sap.m.Input":
                case "sap.m.DatePicker":
                case "sap.m.DateRangeSelection":
                    bRemoveFilter = !oControl.getValue();
                    break;
                case "sap.m.ComboBox":
                    bRemoveFilter = !oControl.getSelectedKey();
                    break;
                case "sap.m.HBox":
                    var iCount = 0;
                    var iTotalInputCount = 0;
                    if (oControl.getItems().length > 0) {
                        oControl.getItems().forEach(function(oItem) {
                            if(oItem.getMetadata().getName() === "sap.m.Input"){
                                iTotalInputCount++;
                                if(oItem.getValue() === "" || oItem.getValue() === null || oItem.getValue() === undefined){
                                    iCount++;
                                }
                            }
                        });
                        bRemoveFilter = iTotalInputCount > 0 && iCount === iTotalInputCount;
                    }

                    break;
                }

                if (bRemoveFilter) {
                    var sFilterKey = oFilterItem.getLabel(); 
                    aFiltersWithValues = aFiltersWithValues.filter(function (filter) {
                        return filter !== sFilterKey;
                    });
                }
            });

            if (aFiltersWithValues.length > 0) {
                sSnappedText = aFiltersWithValues.length + " " + oI18n.getText("variantMgmt.filtersActive.text") + ": " + aFiltersWithValues.join(", ");
                sExpandedText = aFiltersWithValues.length + " " + oI18n.getText("variantMgmt.hidden.text");
            }
            if (this._oSnappedLabel) {
                this._oSnappedLabel.setText(sSnappedText);
            }

            if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
                sExpandedText += " (" + aNonVisibleFiltersWithValues.length + " " + oI18n.getText("variantMgmt.hidden.text") + ")";
            }

            if (this._oExpandedLabel) {
                this._oExpandedLabel.setText(sExpandedText);
            }

        },

        /**
         * Function to perform search
         * @param {Object} oEvent 
         */
        _fnPerformSearch: function (oEvent) {
            var aFilters = [];
            var aFilerGroupItem = oEvent.getSource().getFilterGroupItems();
            var oAdvancedFilter = {
                "advancedFilter": undefined
            };
            var aAllColumns = [];
            var aKeysToSearch = [];
            var aTables = this._aTable;
            aTables.forEach(function(oTable){
                if(oTable.getColumns()){
                    aAllColumns = aAllColumns.concat(oTable.getColumns());
                }
            });
            if(aAllColumns && aAllColumns.length > 0){
                aAllColumns.forEach(function(oCol){
                    if(oCol.getVisible()){
                        var sKey = oCol.getAggregation("customData")[0].getProperty("key");
                        if(sKey == "p13nSettings"){
                            var oMeta = oCol.getAggregation("customData")[0].getProperty("value");
                            if(oMeta && oMeta.metadata){
                                var oMetaObj = oMeta.metadata;
                                if(oMetaObj.value1 && oMetaObj.value2){
                                    aKeysToSearch.push(oMetaObj.value1);
                                    aKeysToSearch.push(oMetaObj.value2);
                                }else{
                                    aKeysToSearch.push(oMetaObj.path);
                                }
                            }
                        }
                    }
                });
            }


            /**
             * Function to apply filter
             * @param {Number} i 
             */
            var fnApplyFilter = function (i) {
                if (this._aTable[i].getMetadata().getName() === "sap.m.Table") {
                    var oBinding = this._aTable[i].getBinding("items");
                    if(oBinding) {
                        if(Object.keys(oAdvancedFilter).length > 0) {
                            var oParam = oBinding.getQueryOptionsFromParameters();
                            if(oAdvancedFilter.advancedFilter === undefined) {
                                oParam.advancedFilter = undefined;
                                oBinding.applyParameters(Object.assign(oAdvancedFilter,oParam));
                            } else {
                                oParam.advancedFilter = oAdvancedFilter.advancedFilter;
                            }
                            oBinding.applyParameters(Object.assign(oAdvancedFilter,oParam));
                        }
                        if(this._aTable[i].sId && this._aTable[i].sId.includes("idRecoListImportMTable")){
                            // aFilters.push(new Filter({
                            //     path: "assessmentType",
                            //     operator: FilterOperator.EQ,
                            //     value1: "Standalone",
                            //     caseSensitive: false
                            // }));
                            aFilters.push(new Filter({
                                path: "status",
                                operator: FilterOperator.EQ,
                                value1: "FOR_REVIEW",
                                caseSensitive: false
                            }));
                            aFilters.push(new Filter({
                                path: "isConvertedToMSP",
                                operator: FilterOperator.EQ,
                                value1: false
                            }));
                        }

                        if (this._aTable[i].sId && this._aTable[i].sId.includes("idMspEventsDetailListPage")) {
                            var globalEventId = window.globalEventId || ""; 
                            if (globalEventId) {
                                aFilters.push(new Filter("eventId", FilterOperator.EQ, globalEventId));
                            }
                            aFilters.push(new Filter("riskType", FilterOperator.EQ, "SHE"));
                        }

                        if (this._aTable[i].sId && this._aTable[i].sId.includes("idMspEventsDetailFinListPage")) {
                            globalEventId = window.globalEventId || ""; 
                            if (globalEventId) {
                                aFilters.push(new Filter("eventId", FilterOperator.EQ, globalEventId));
                            }
                            aFilters.push(new Filter("riskType", FilterOperator.EQ, "FIN"));
                        }

                        if(this._aTable[i].sId && ( this._aTable[i].sId.includes("idAdvEqpuipmentTable") || this._aTable[i].sId.includes("idAdvFlocTable"))) {

                            if(window._technicalObjcectDefaultFilters) {
                                aFilters.push(window._technicalObjcectDefaultFilters);
                            }
                        }

                        oBinding.filter(aFilters);
                    }
                } else if (this._aTable[i].getMetadata().getName() === "sap.ui.table.Table") {
                    var oRowBinding = this._aTable[i].getBinding("rows");
                    if(oRowBinding) {
                        if(Object.keys(oAdvancedFilter).length > 0) {
                            var oQueryParam = oRowBinding.getQueryOptionsFromParameters();
                            if(oAdvancedFilter.advancedFilter === undefined) {
                                oQueryParam.advancedFilter = undefined;
                                oRowBinding.applyParameters(Object.assign(oAdvancedFilter,oQueryParam));
                            } else {
                                oQueryParam.advancedFilter = oAdvancedFilter.advancedFilter;
                            }
                            oRowBinding.applyParameters(Object.assign(oAdvancedFilter,oQueryParam));
                        }
                        oRowBinding.filter(aFilters);
                    }
                }
            }

            if (this._oConfig.FilterBarSettings.EnableBasicSearch) {

                var sBasicSearchValue = oEvent.getSource().getBasicSearchValue().trim();

                if (sBasicSearchValue) {
                    var aBasicScope = this._oConfig.FilterBarSettings.BasicSearchKeys;
                    var aBasicFilter = [];

                    for (var i = 0; i < aBasicScope.length; i++) {
                        if(aKeysToSearch.includes(aBasicScope[i])){
                            if (aBasicScope[i].includes("/0")) {
                                aBasicFilter.push(new Filter({
                                    path: aBasicScope[i].split("/0")[0],
                                    operator: FilterOperator.Any,
                                    variable: "v",
                                    condition: new Filter({
                                        path: "v" + aBasicScope[i].split("/0")[1],
                                        operator: FilterOperator.Contains,
                                        value1: sBasicSearchValue,
                                        caseSensitive: false
                                    })
                                }))
                            } else {
                                aBasicFilter.push(new Filter({
                                    path: aBasicScope[i],
                                    operator: FilterOperator.Contains,
                                    value1: sBasicSearchValue,
                                    caseSensitive: false
                                }))
                            }
                        }

                    }
                    aFilters.push(new Filter({
                        and: false,
                        filters: aBasicFilter
                    }));
                }
            }
            var oSearchKeys = {
                "EQUI":[],
                "FLOC":[],
                "ASDA":[],
                "INSP":[],
                "MNOR":[],
            }
            var aSearchKeys = Object.keys(oSearchKeys);
            for (var j = 0; j < aFilerGroupItem.length; j++) {

                var sPath = aFilerGroupItem[j].getName();
                var oFilterControl = aFilerGroupItem[j].getControl();
                var sControlType = oFilterControl.getMetadata().getName();
                if (sPath.includes("advancedFilter/objectId")) {
                    var aToken = oFilterControl.getTokens();
                    if (aToken.length > 0) {
                        var aMultiFilter = [];
                        for (var k = 0; k < aToken.length; k++) {
                            aMultiFilter.push(new Filter({
                                path: "objectId",
                                operator: FilterOperator.Contains,
                                value1: aToken[k].getKey()
                            }));
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aMultiFilter
                        }));
                    }

                } else if (sPath.includes("advancedFilter/")) {
                    var sSearchKey = sPath.split("/")[1];
                    if (sControlType === "sap.m.MultiInput") {
                        var aFilterToken = oFilterControl.getTokens();
                        if (aFilterToken.length > 0) {
                            for (var l = 0; l < aFilterToken.length; l++) {
                                oSearchKeys[sSearchKey].push(aFilterToken[l].getKey());
                            }
                        }
                    }

                } else if (sPath === "advancedFilter" && oFilterControl.getSelectedKey().length) {
                    oAdvancedFilter = {
                        advancedFilter: oFilterControl.getSelectedKey()
                    };
                } else if (sPath === "RWBRiskFields_riskChar") {
                    var charFilter = [];
                    if (oFilterControl.getValue()) {
                        charFilter.push(new Filter({
                            path: "riskFields",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }));
                        aFilters.push(new Filter({
                            and: false,
                            filters: charFilter
                        }));
                    }
                } else if (sPath === "RWBRiskFields_riskCharValue") {
                    var riskFilter = [];
                    if (oFilterControl.getValue()) {
                        riskFilter.push(new Filter({
                            path: "riskFields",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }));
                        aFilters.push(new Filter({
                            and: false,
                            filters: riskFilter
                        }));
                    }
                } else if (sPath === "RWBRisk_SHERisk" || sPath === "RWBRisk_FINRisk") {
                    var aRiskToken = oFilterControl.getSelectedKeys();
                    if (aRiskToken.length > 0) {
                        var aRiskMultiInputFilter = [];
                        for (var iSheRisk = 0; iSheRisk < aRiskToken.length; iSheRisk++) {
                            var sRiskToSearch = "";
                            if (aRiskToken[iSheRisk]) {
                                if (sPath === "RWBRisk_SHERisk") {
                                    sRiskToSearch = aRiskToken[iSheRisk] + "_SHE";
                                } else if (sPath === "RWBRisk_FINRisk") {
                                    sRiskToSearch = aRiskToken[iSheRisk] + "_FIN";
                                }
                            }
                            if (sRiskToSearch) {
                                aRiskMultiInputFilter.push(new Filter({
                                    path: "riskFields",
                                    operator: FilterOperator.Contains,
                                    value1: sRiskToSearch
                                }))
                            }
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aRiskMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWBRisk_BASE") {
                    var aRiskBase = oFilterControl.getSelectedKeys();
                    if (aRiskBase.length > 0) {
                        var aRiskBaseMultiInputFilter = [];
                        for (var iBaseRisk = 0; iBaseRisk < aRiskBase.length; iBaseRisk++) {
                            var sRiskBaseSearch = "";
                            if (aRiskBase[iBaseRisk]) {
                                sRiskBaseSearch = aRiskBase[iBaseRisk] + "_BASE";
                            }
                            if (sRiskBaseSearch) {
                                aRiskBaseMultiInputFilter.push(new Filter({
                                    path: "riskFields",
                                    operator: FilterOperator.Contains,
                                    value1: sRiskBaseSearch
                                }))
                            }
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aRiskBaseMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWBRisk_BACK") {
                    var backStopFilter = [];
                    if (oFilterControl.getValue()) {
                        backStopFilter.push(new Filter({
                            path: "riskFields",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue() + "_BACK",
                            caseSensitive: false
                        }));
                        aFilters.push(new Filter({
                            and: false,
                            filters: backStopFilter
                        }));
                    }
                } else if (sPath === "charSrcListFilter") {
                    if (oFilterControl.getValue()) {
                        aFilters.push(new Filter({
                            path: "equipmentCharacteristics",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }))
                    }
                } else if (sPath === "charSrcListFilterFLOC") {
                    if (oFilterControl.getValue()) {
                        aFilters.push(new Filter({
                            path: "functionalLocationCharacteristics",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }))
                    }
                } else if (sPath === "MSPHistoricStatus") {
                    var aMSPHistoricStstus = oFilterControl.getSelectedKeys();
                    if (aMSPHistoricStstus.length > 0) {
                        var aMspMultiInputFilter = [];
                        for (var iMspStatus = 0; iMspStatus < aMSPHistoricStstus.length; iMspStatus++) {
                            aMspMultiInputFilter.push(new Filter({
                                path: "status",
                                operator: FilterOperator.Contains,
                                value1: aMSPHistoricStstus[iMspStatus],
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aMspMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWBHistoricStatus") {
                    var aRWBHistoricStstus = oFilterControl.getSelectedKeys();
                    if (aRWBHistoricStstus.length > 0) {
                        var aRWBMultiInputFilter = [];
                        for (var iRWBStatus = 0; iRWBStatus < aRWBHistoricStstus.length; iRWBStatus++) {
                            aRWBMultiInputFilter.push(new Filter({
                                path: "status",
                                operator: FilterOperator.Contains,
                                value1: aRWBHistoricStstus[iRWBStatus],
                                caseSensitive: false
                            }))

                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aRWBMultiInputFilter
                        }));
                    }
                } else if (sPath === "componentName") {
                    var sValue = oFilterControl.getValue();
                    if (sValue) {
                        var equiFilter = new Filter({
                            path: "equipmentComponentDetails",
                            operator: FilterOperator.Contains,
                            value1: sValue,
                            caseSensitive: false
                        });

                        var flocFilter = new Filter({
                            path: "flocComponentDetails",
                            operator: FilterOperator.Contains,
                            value1: sValue,
                            caseSensitive: false
                        });

                        aFilters.push(new Filter({
                            and: false,
                            filters: [equiFilter, flocFilter]
                        }));
                    }
                } else if (sPath === "classDetails") {
                    var aClassDetailsTokens = oFilterControl.getTokens();
                    if (aClassDetailsTokens.length > 0) {
                        var aClassDetailsFilters = [];
                        for (var iClassDetails = 0; iClassDetails < aClassDetailsTokens.length; iClassDetails++) {
                            aClassDetailsFilters.push(new Filter({
                                path: "classDetails",
                                operator: FilterOperator.Contains,
                                value1: aClassDetailsTokens[iClassDetails].getKey(),
                                caseSensitive: false
                            }));
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aClassDetailsFilters
                        }));
                    }
                }else if (sPath === "RWBabcIndicator") {
                    // eslint-disable-next-line no-redeclare
                    var aToken = oFilterControl.getTokens();

                    if (aToken.length > 0) {
                        var aTempFilter = [];
                        for (var RWBabcIndicator = 0; RWBabcIndicator < aToken.length; RWBabcIndicator++) {
                            /* eslint-disable no-redeclare */
                            var sValue = aToken[RWBabcIndicator].getKey();
                            var aSearch = "\\\"abcIndicatorCode\\\" : \\\"" + sValue + "\\\"";

                            var equiFilters = [new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            })];
                            var FlocFilters = [new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            })];
                            var combinedFiltersRwb = equiFilters.concat(FlocFilters);
                            if (combinedFiltersRwb.length > 0) {
                                aTempFilter.push(new Filter({
                                    and: false,
                                    filters: combinedFiltersRwb
                                }));
                            }
                        }
                        if (aTempFilter.length > 0) {
                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempFilter
                            }));
                        }

                    }
                } else if (sPath === "RWB_CATEGORY") {
                    var aEquiCatTokens = oFilterControl.getTokens();
                    if (aEquiCatTokens.length > 0) {
                        var aTempEquiCatFilter = [];
                        for (var iEquiCat = 0; iEquiCat < aEquiCatTokens.length; iEquiCat++) {
                            var sEquiCatValue = aEquiCatTokens[iEquiCat].getText();

                            if (!sEquiCatValue) {
                                continue;
                            }

                            var sCatSearch = "\\\"category\\\" : \\\"" + sEquiCatValue + "\\\"";

                            var oCatEquiFilter = new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: sCatSearch,
                                caseSensitive: true
                            });
                            var oCatFlocFilter = new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: sCatSearch,
                                caseSensitive: true
                            });

                            aTempEquiCatFilter.push(new Filter({
                                and: false,
                                filters: [oCatEquiFilter, oCatFlocFilter]
                            }));
                        }
                        if (aTempEquiCatFilter.length > 0) {
                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempEquiCatFilter
                            }));
                        }
                    }
                }
                else if (sPath === "Notification_recommendation" || sPath === "MO_recommendation") { // Notification & Maintenance Order App's Recommendation filter
                    var aRecommendationMultiInputToken = oFilterControl.getTokens();
                    if (aRecommendationMultiInputToken.length > 0) {
                        var aRecommendationMultiInputFilter = [];
                        if (sPath == "Notification_recommendation") {
                            for (var iReco = 0; iReco < aRecommendationMultiInputToken.length; iReco++) {
                                aRecommendationMultiInputFilter.push(new Filter({
                                    path: "notificationToRecommendationDetails",
                                    operator: FilterOperator.Contains,
                                    value1: aRecommendationMultiInputToken[iReco].getText(),
                                    caseSensitive: false
                                }))
                            }
                        } else {
                            for (var iRecommendation = 0; iRecommendation < aRecommendationMultiInputToken.length; iRecommendation++) {
                                aRecommendationMultiInputFilter.push(new Filter({
                                    path: "recommendations",
                                    operator: FilterOperator.Contains,
                                    value1: aRecommendationMultiInputToken[iRecommendation].getText(),
                                    caseSensitive: false
                                }))

                                // aRecommendationMultiInputFilter.push(new Filter({
                                //     path: "apmrecommendation",
                                //     operator: FilterOperator.Contains,
                                //     value1: aRecommendationMultiInputToken[iRecommendation].getText()
                                // }))
                            }
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aRecommendationMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWBNotification_Notification" || sPath === "RWBNotification_Status") {
                    var aNotificationMultiInputToken = oFilterControl.getTokens();
                    if (aNotificationMultiInputToken.length > 0) {
                        var aNotificationMultiInputFilter = [];
                        for (var iNotification = 0; iNotification < aNotificationMultiInputToken.length; iNotification++) {
                            aNotificationMultiInputFilter.push(new Filter({
                                path: "notification",
                                operator: FilterOperator.Contains,
                                value1: aNotificationMultiInputToken[iNotification].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aNotificationMultiInputFilter
                        }));
                    }
                } else if (sPath === "MSPcomponentName") {
                    /* eslint-disable no-redeclare */
                    var sValue = oFilterControl.getValue();
                    if (sValue) {
                        /* eslint-disable no-redeclare */
                        var equiFilter = new Filter({
                            path: "mspEquipmentComponentDetails",
                            operator: FilterOperator.Contains,
                            value1: sValue,
                            caseSensitive: false
                        });

                        /* eslint-disable no-redeclare */
                        var flocFilter = new Filter({
                            path: "mspFlocComponentDetails",
                            operator: FilterOperator.Contains,
                            value1: sValue,
                            caseSensitive: false
                        });

                        aFilters.push(new Filter({
                            and: false,
                            filters: [equiFilter, flocFilter]
                        }));
                    }
                } else if (sPath === "MSP_EQUI" || sPath === "MSP_FLOC" || sPath === "MSP_PLANNERGRUP" || sPath === "MSP_COST" || sPath === "MSP_MAINPLANT" || sPath === "MSP_LOCATION" || sPath === "MSP_PLANTSECTION" || sPath === "MSP_PLANNINGPLANT" || sPath === "EQUI_MDA_MSP" || sPath === "MSP_WORKCENTER") {
                    var aTechnicalObjMultiInputToken = oFilterControl.getTokens();
                    if (aTechnicalObjMultiInputToken.length > 0) {
                        var aTechnicalObjEQUIMultiInputFilter = [];
                        for (var iTechObj = 0; iTechObj < aTechnicalObjMultiInputToken.length; iTechObj++) {
                            if (sPath === "MSP_EQUI" || sPath === "MSP_FLOC" || sPath === "EQUI_MDA_MSP") {
                                aTechnicalObjEQUIMultiInputFilter.push(new Filter({
                                    path: "technicalObjects",
                                    operator: FilterOperator.Contains,
                                    value1: aTechnicalObjMultiInputToken[iTechObj].getText()
                                }));
                            } else {
                                aTechnicalObjEQUIMultiInputFilter.push(new Filter({
                                    path: "technicalObjects",
                                    operator: FilterOperator.Contains,
                                    value1: aTechnicalObjMultiInputToken[iTechObj].getKey()
                                }));
                            }
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aTechnicalObjEQUIMultiInputFilter
                        }));
                        // aFilters.push(new Filter({
                        //     and: false,
                        //     filters: aTechnicalObjFLOCMultiInputFilter
                        // }));
                    }
                }
                else if (sPath === "SORT_FIELD") {
                    if (oFilterControl.getValue()) {
                        aFilters.push(new Filter({
                            path: "technicalObjects",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }))
                    }
                } else if (sPath === "SORT_FIELD_RWB") {
                    /* eslint-disable no-redeclare */
                    var equiFilter = [new Filter({
                        path: "equipmentDetails",
                        operator: FilterOperator.Contains,
                        value1: oFilterControl.getValue(),
                        caseSensitive: false
                    })]
                    var FlocFilter = [new Filter({
                        path: "functionalLocationDetails",
                        operator: FilterOperator.Contains,
                        value1: oFilterControl.getValue(),
                        caseSensitive: false
                    })]
                    var combinedFiltersMsp = equiFilter.concat(FlocFilter);
                    if (combinedFiltersMsp.length > 0) {
                        aFilters.push(new Filter({
                            and: false,
                            filters: combinedFiltersMsp
                        }));
                    }
                } else if (sPath === "RWB_EQUIP" || sPath === "RWB_CAT") {
                    var aEquipmentMultiInputToken = oFilterControl.getTokens();
                    if (aEquipmentMultiInputToken.length > 0) {
                        var aEquipmentMultiInputFilter = [];
                        for (var iEquipment = 0; iEquipment < aEquipmentMultiInputToken.length; iEquipment++) {
                            aEquipmentMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "EQUINAMEFIL_" + aEquipmentMultiInputToken[iEquipment].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aEquipmentMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWB_FLOC") {
                    var aFLOCMultiInputToken = oFilterControl.getTokens();
                    if (aFLOCMultiInputToken.length > 0) {
                        var aFLOCMultiInputFilter = [];
                        for (var iFloc = 0; iFloc < aFLOCMultiInputToken.length; iFloc++) {
                            aFLOCMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "FLOCNAMEFIL_" + aFLOCMultiInputToken[iFloc].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aFLOCMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWB_PARENT_EQUIP") {
                    var aParentEquipmentMultiInputToken = oFilterControl.getTokens();
                    if (aParentEquipmentMultiInputToken.length > 0) {
                        var aParentEquipmentMultiInputFilter = [];
                        for (var iParentEquipment = 0; iParentEquipment < aParentEquipmentMultiInputToken.length; iParentEquipment++) {
                            aParentEquipmentMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "PEQUIFIL_" + aParentEquipmentMultiInputToken[iParentEquipment].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aParentEquipmentMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWB_PARENT_FLOC") {
                    var aParentFLOCMultiInputToken = oFilterControl.getTokens();
                    if (aParentFLOCMultiInputToken.length > 0) {
                        var aParentFLOCMultiInputFilter = [];
                        for (var iParentFloc = 0; iParentFloc < aParentFLOCMultiInputToken.length; iParentFloc++) {
                            aParentFLOCMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "PFLOCFIL_" + aParentFLOCMultiInputToken[iParentFloc].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aParentFLOCMultiInputFilter
                        }));
                    }
                } else if (sPath === "masterDataAttribution") {
                    var aMDAData = oFilterControl.getTokens();
                    if (aMDAData.length > 0) {
                        var aMDAInputFilter = [];
                        for (var iMDA = 0; iMDA < aMDAData.length; iMDA++) {
                            aMDAInputFilter.push(new Filter({
                                path: "masterDataAttribution",
                                operator: FilterOperator.Contains,
                                value1: aMDAData[iMDA].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aMDAInputFilter
                        }));
                    }
                } else if (sPath === "EQUI_MDA") {
                    var aEquiMDAData = oFilterControl.getTokens();
                    if (aEquiMDAData.length > 0) {
                        var aEquiMDAInputFilter = [];
                        for (var iEquiMDA = 0; iEquiMDA < aEquiMDAData.length; iEquiMDA++) {
                            aEquiMDAInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: aEquiMDAData[iEquiMDA].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aEquiMDAInputFilter
                        }));
                    }
                } else if (sPath === "RWB_LOCATION") {
                    var aLocEquipmentMultiInputToken = oFilterControl.getTokens();
                    var aLocFLOCMultiInputToken = oFilterControl.getTokens();
                    var aLocEquipmentMultiInputFilter = [];
                    var aLocFLOCMultiInputFilter = [];
                    if (aLocEquipmentMultiInputToken.length > 0) {
                        for (var iLocEquipment = 0; iLocEquipment < aLocEquipmentMultiInputToken.length; iLocEquipment++) {
                            aLocEquipmentMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "LOCATION_" + aLocEquipmentMultiInputToken[iLocEquipment].getText()
                            }));
                        }
                    }
                    if (aLocFLOCMultiInputToken.length > 0) {
                        for (var iLocFloc = 0; iLocFloc < aLocFLOCMultiInputToken.length; iLocFloc++) {
                            aLocFLOCMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "LOCATION_" + aLocFLOCMultiInputToken[iLocFloc].getText()
                            }));
                        }
                    }
                    var locCombinedFilters = aLocEquipmentMultiInputFilter.concat(aLocFLOCMultiInputFilter);
                    if (locCombinedFilters.length > 0) {
                        aFilters.push(new Filter({
                            and: false,
                            filters: locCombinedFilters
                        }));
                    }

                } else if (sPath === "RWB_PLANTSECTION") {
                    var aPlaEquipmentMultiInputToken = oFilterControl.getTokens();
                    var aPlaFLOCMultiInputToken = oFilterControl.getTokens();
                    var aPlaEquipmentMultiInputFilter = [];
                    var aPlaFLOCMultiInputFilter = [];
                    if (aPlaEquipmentMultiInputToken.length > 0) {
                        for (var iPlaEquipment = 0; iPlaEquipment < aPlaEquipmentMultiInputToken.length; iPlaEquipment++) {
                            aPlaEquipmentMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "PLANTSECTION_" + aPlaEquipmentMultiInputToken[iPlaEquipment].getText()
                            }));
                        }
                    }
                    if (aPlaFLOCMultiInputToken.length > 0) {
                        for (var iPlaFloc = 0; iPlaFloc < aPlaFLOCMultiInputToken.length; iPlaFloc++) {
                            aPlaFLOCMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "PLANTSECTION_" + aPlaFLOCMultiInputToken[iPlaFloc].getText()
                            }));
                        }
                    }
                    var plaCombinedFilters = aPlaEquipmentMultiInputFilter.concat(aPlaFLOCMultiInputFilter);
                    if (plaCombinedFilters.length > 0) {
                        aFilters.push(new Filter({
                            and: false,
                            filters: plaCombinedFilters
                        }));
                    }

                }else if (sPath === "componentDetails") {
                    var aComponentTokens = oFilterControl.getTokens();
                    if (aComponentTokens.length > 0) {
                        var aComponentFilters = [];
                        /* eslint-disable no-redeclare */
                        for (var i = 0; i < aComponentTokens.length; i++) {
                            aComponentFilters.push(new Filter({
                                path: "componentDetails",
                                operator: FilterOperator.Contains,
                                value1: aComponentTokens[i].getKey()
                            }));
                        }
                        aFilters.push(new Filter({
                            and: false,  
                            filters: aComponentFilters
                        }));
                    }
                }else if (sPath === "notificationDetails") {
                    
                    var aTokens = oFilterControl.getTokens();

                    if (aTokens.length > 0) {
                        var aNotificationFilters = aTokens.map(function (oToken) {
                            return new Filter({
                                path: "notificationDetails",
                                operator: FilterOperator.Contains,
                                value1: oToken.getKey()
                            });
                        });
                        
                        aFilters.push(new Filter({
                            filters: aNotificationFilters,
                            and: false
                        }));
                    }
                } else if (sPath === "RWB_MAINPLANT") {
                    var aFilEquipmentMultiInputToken = oFilterControl.getTokens();
                    var aFilFLOCMultiInputToken = oFilterControl.getTokens();
                    var aFilEquipmentMultiInputFilter = [];
                    var aFilFLOCMultiInputFilter = [];
                    if (aFilEquipmentMultiInputToken.length > 0) {
                        for (var iFilEquipment = 0; iFilEquipment < aFilEquipmentMultiInputToken.length; iFilEquipment++) {
                            aFilEquipmentMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "MAINTPLANT_" + aFilEquipmentMultiInputToken[iFilEquipment].getText()
                            }));
                        }
                    }
                    if (aFilFLOCMultiInputToken.length > 0) {
                        for (var iFilFloc = 0; iFilFloc < aFilFLOCMultiInputToken.length; iFilFloc++) {
                            aFilFLOCMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "MAINTPLANT_" + aFilFLOCMultiInputToken[iFilFloc].getText()
                            }));
                        }
                    }
                    var combinedFilters = aFilEquipmentMultiInputFilter.concat(aFilFLOCMultiInputFilter);
                    if (combinedFilters.length > 0) {
                        aFilters.push(new Filter({
                            and: false,
                            filters: combinedFilters
                        }));
                    }
                } else if (sPath === "RWB_USERSTATUS") {
                    var aUserStatusMultiInputToken = oFilterControl.getTokens();

                    if (aUserStatusMultiInputToken.length > 0) {
                        var aUserStatusMultiInputFilter = [];

                        for (var iUserStatus = 0; iUserStatus < aUserStatusMultiInputToken.length; iUserStatus++) {
                            aUserStatusMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "EQUIUS_" + aUserStatusMultiInputToken[iUserStatus].getText()
                            }));
                            aUserStatusMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "FLOCUS_" + aUserStatusMultiInputToken[iUserStatus].getText()
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aUserStatusMultiInputFilter
                        }));
                    }
                } else if (sPath === "RWB_SYSTEMSTATUS") {
                    var aSystemStatusMultiInputToken = oFilterControl.getTokens();

                    if (aSystemStatusMultiInputToken.length > 0) {
                        var aSystemStatusMultiInputFilter = [];

                        for (var iSystemStatus = 0; iSystemStatus < aSystemStatusMultiInputToken.length; iSystemStatus++) {
                            aSystemStatusMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "EQUISS_" + aSystemStatusMultiInputToken[iSystemStatus].getText()
                            }));
                            aSystemStatusMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "FLOCSS_" + aSystemStatusMultiInputToken[iSystemStatus].getText()
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aSystemStatusMultiInputFilter
                        }));
                    }
                } else if (sPath === "MO_Status") {
                    var aMOStatus = oFilterControl.getTokens();
                    if (aMOStatus.length > 0) {
                        var aMOStatusFilter = [];
                        for (var iMOStatus = 0; iMOStatus < aMOStatus.length; iMOStatus++) {
                            aMOStatusFilter.push(new Filter({
                                path: "status",
                                operator: FilterOperator.Contains,
                                value1: aMOStatus[iMOStatus].getKey(),
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aMOStatusFilter
                        }));
                    }
                } else if (sPath === "FleetOperatingContext") {
                    var aFleetOCFilter = oFilterControl.getTokens();
                    if (aFleetOCFilter.length > 0) {
                        var aTempFleetOCFilter = [];
                        for (var iFleetOC = 0; iFleetOC < aFleetOCFilter.length; iFleetOC++) {
                            aTempFleetOCFilter.push(new Filter({
                                path: "LocalOperatingContexts",
                                operator: FilterOperator.Contains,
                                value1: aFleetOCFilter[iFleetOC].getKey(),
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aTempFleetOCFilter
                        }));
                    }
                } else if (sPath === "FleetGlobalOperatingContext") {
                    var aFleetGlobalOCFilter = oFilterControl.getTokens();

                    if (aFleetGlobalOCFilter.length > 0) {
                        var aTempFleetGlobalOCFilter = [];
                        for (var iFleetGlobalOC = 0; iFleetGlobalOC < aFleetGlobalOCFilter.length; iFleetGlobalOC++) {
                            aTempFleetGlobalOCFilter.push(new Filter({
                                path: "GlobalOperatingContexts",
                                operator: FilterOperator.Contains,
                                value1: aFleetGlobalOCFilter[iFleetGlobalOC].getKey(),
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aTempFleetGlobalOCFilter
                        }));
                    }
                } else if (sPath === "RCM_EQUI" || sPath === "RCM_FLOC" || sPath === "RNC_FLOC") {
                    var aRcmTechObjs = oFilterControl.getTokens();

                    if (aRcmTechObjs.length > 0) {
                        var aTempRcmTechObjsFilter = [];
                        for (var iRcmTechObjs = 0; iRcmTechObjs < aRcmTechObjs.length; iRcmTechObjs++) {
                            aTempRcmTechObjsFilter.push(new Filter({
                                path: "technicalObjects",
                                operator: FilterOperator.Contains,
                                value1: aRcmTechObjs[iRcmTechObjs].getKey(),
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aTempRcmTechObjsFilter
                        }));
                    }
                } else if (["RCM_PLMT","RCM_PLSC","RCM_LOC","RCM_WCTR","RCM_PRGP","RCM_PLPT"].includes(sPath)) {
                    const mMapping = {
                        RCM_PLPT: "planningPlant",
                        RCM_PLMT: "maintenancePlant",
                        RCM_PLSC: "plantSection",
                        RCM_LOC: "location",
                        RCM_WCTR: "maintenanceWorkCenter",
                        RCM_PRGP: "plannerGroup"
                    };

                    var sJsonKey = mMapping[sPath];
                    var aTokens = oFilterControl.getTokens();
                    if (aTokens.length > 0) {
                        var aSubFilters = aTokens.map(function (oToken) {
                            return new Filter("technicalObjects", FilterOperator.Contains,`${sJsonKey}":"${oToken.getKey()}`);
                        });
                        aFilters.push(new Filter({
                            and: false,
                            filters: aSubFilters
                        }));
                    }
                }else if (sPath === "RWB_PLANNERGROUP") {
                    var aPrgpToken = oFilterControl.getTokens();
                    if (aPrgpToken.length > 0) {
                        var aTempPrgpFilter = [];
                        for (var iPrgp = 0; iPrgp < aPrgpToken.length; iPrgp++) {
                            var sPrgpValue = aPrgpToken[iPrgp].getKey();
                            var sPrgpSearch = "\"plannerGroup\" : \"" + sPrgpValue + "\"";
                            var oPrgpEquiFilter = new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: sPrgpSearch,
                                caseSensitive: false
                            });
                            var oPrgpFlocFilter = new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: sPrgpSearch,
                                caseSensitive: false
                            });
                            aTempPrgpFilter.push(new Filter({
                                and: false,
                                filters: [oPrgpEquiFilter, oPrgpFlocFilter]
                            }));
                        }
                        if (aTempPrgpFilter.length > 0) {
                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempPrgpFilter
                            }));
                        }
                    }
                } else if (sPath === "RWB_WORKCENTER") {
                    var aWctrToken = oFilterControl.getTokens();
                    if (aWctrToken.length > 0) {
                        var aTempWctrFilter = [];
                        for (var iWctr = 0; iWctr < aWctrToken.length; iWctr++) {
                            var sWctrValue = aWctrToken[iWctr].getKey();
                            var sWctrSearch = "\"workCenter\" : \"" + sWctrValue + "\"";
                            var oWctrEquiFilter = new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: sWctrSearch,
                                caseSensitive: false
                            });
                            var oWctrFlocFilter = new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: sWctrSearch,
                                caseSensitive: false
                            });
                            aTempWctrFilter.push(new Filter({
                                and: false,
                                filters: [oWctrEquiFilter, oWctrFlocFilter]
                            }));
                        }
                        if (aTempWctrFilter.length > 0) {
                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempWctrFilter
                            }));
                        }
                    }
                }else if (sPath === "RCA_EQUIPMENT_MDA") {
                    var aRcaEquiMdaToken = oFilterControl.getTokens();

                    if (aRcaEquiMdaToken.length > 0) {
                        var aEquiRcaMdaMultiInputFilter = [];

                        for (var iEquiMdaRca = 0; iEquiMdaRca < aRcaEquiMdaToken.length; iEquiMdaRca++) {
                            aEquiRcaMdaMultiInputFilter.push(new Filter({
                                path: "technicalObjects",
                                operator: FilterOperator.Contains,
                                value1: aRcaEquiMdaToken[iEquiMdaRca].getText()
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aEquiRcaMdaMultiInputFilter
                        }));
                    }
                } 
                else if (sPath === "RCA_EQUI" || sPath === "RCA_FLOC") {
                    var aRcaTechObjs  = oFilterControl.getTokens();

                    if (aRcaTechObjs.length > 0) {
                        var aTempRcaTechObjsFilter = [];
                        for (var iRcaTechObjs = 0; iRcaTechObjs < aRcaTechObjs.length; iRcaTechObjs++) {
                            aTempRcaTechObjsFilter.push(new Filter({
                                path: "technicalObjects",
                                operator: FilterOperator.Contains,
                                value1: aRcaTechObjs[iRcaTechObjs].getKey(),
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aTempRcaTechObjsFilter
                        }));
                    }
                }
                else if (["RCA_plantSection", "RCA_location", "RCA_maintenancePlant", "RCA_maintenanceWorkCenter", "RCA_plannerGroup", "RCA_planningPlant"].includes(sPath)) {
                    var mRcaFieldMapping = {
                        // eslint-disable-next-line camelcase
                        RCA_plantSection: "plantSection",
                        // eslint-disable-next-line camelcase
                        RCA_location: "location",
                        // eslint-disable-next-line camelcase
                        RCA_maintenancePlant: "maintenancePlant",
                        // eslint-disable-next-line camelcase
                        RCA_maintenanceWorkCenter: "maintenanceWorkCenter",
                        // eslint-disable-next-line camelcase
                        RCA_plannerGroup: "plannerGroup",
                        // eslint-disable-next-line camelcase
                        RCA_planningPlant: "planningPlant"
                    };
                    var sRcaJsonKey = mRcaFieldMapping[sPath];
                    var aRcaFieldTokens = oFilterControl.getTokens();
                    if (aRcaFieldTokens.length > 0) {
                        var aRcaFieldSubFilters = aRcaFieldTokens.map(function (oToken) {
                            return new Filter({
                                path: "technicalObjects",
                                operator: FilterOperator.Contains,
                                value1: "\"" + sRcaJsonKey + "\" : \"" + oToken.getKey() + "\"",
                                caseSensitive: false
                            });
                        });
                        aFilters.push(new Filter({
                            and: false,
                            filters: aRcaFieldSubFilters
                        }));
                    }
                }
                else if (["CML_maintenancePlant", "CML_planningPlant", "CML_plantSection", "CML_location", "CML_workCenter", "CML_plannerGroup"].includes(sPath)) {
                    var mCmlFieldMapping = {
                        // eslint-disable-next-line camelcase
                        CML_maintenancePlant: "maintenancePlant",
                        // eslint-disable-next-line camelcase
                        CML_planningPlant: "planningPlant",
                        // eslint-disable-next-line camelcase
                        CML_plantSection: "plantSection",
                        // eslint-disable-next-line camelcase
                        CML_location: "location",
                        // eslint-disable-next-line camelcase
                        CML_workCenter: "workCenter",
                        // eslint-disable-next-line camelcase
                        CML_plannerGroup: "plannerGroup"
                    };
                    var sCmlJsonKey = mCmlFieldMapping[sPath];
                    var aCmlFieldTokens = oFilterControl.getTokens();
                    if (aCmlFieldTokens.length > 0) {
                        var aCmlFieldSubFilters = aCmlFieldTokens.map(function (oToken) {
                            return new Filter({
                                path: sCmlJsonKey,
                                operator: FilterOperator.EQ,
                                value1: oToken.getKey()
                            });
                        });
                        aFilters.push(new Filter({
                            and: false,
                            filters: aCmlFieldSubFilters
                        }));
                    }
                }

                else if (sPath === "RCA_SORT_FIELD") {
                    if (oFilterControl.getValue()) {
                        aFilters.push(new Filter({
                            path: "technicalObjects",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }))
                    }
                }
                else if (sPath === "RCA_abcIndicator") {
                    var aTokens = oFilterControl.getTokens();

                    if (aTokens.length > 0) {
                        var aTempFilters = [];
                        //eslint-disable-next-line camelcase
                        for (var RCA_abcIndicator = 0; RCA_abcIndicator < aTokens.length; RCA_abcIndicator++) {
                            //eslint-disable-next-line camelcase
                            var sVal = aTokens[RCA_abcIndicator].getKey();

                            // EXACT MATCH STRING FROM BACKEND INCLUDING SPACES
                            var sSearch = "\\\"abcIndicator\\\" : \\\"" + sVal + "\\\"";

                            aTempFilters.push(
                                new Filter({
                                    path: "technicalObjects",
                                    operator: FilterOperator.Contains,
                                    value1: sSearch,
                                    caseSensitive: false,
                                })
                            );
                        }

                        aFilters.push(
                            new Filter({
                                and: false,
                                filters: aTempFilters,
                            })
                        );
                    }
                } else if (sPath === "RCA_ClassName") {
                    var aRcaclassTechObjs = oFilterControl.getTokens();

                    if (aRcaclassTechObjs.length > 0) {
                        var aTempRcaTechObjsClassFilter = [];
                        for (
                            var iRcaTechObjClass = 0;
                            iRcaTechObjClass < aRcaclassTechObjs.length;
                            iRcaTechObjClass++
                        ) {
                            aTempRcaTechObjsClassFilter.push(
                                new Filter({
                                    path: "technicalObjects",
                                    operator: FilterOperator.Contains,
                                    value1: aRcaclassTechObjs[iRcaTechObjClass].getKey(),
                                    caseSensitive: false,
                                })
                            );
                        }
                        aFilters.push(
                            new Filter({
                                and: false,
                                filters: aTempRcaTechObjsClassFilter,
                            })
                        );
                    }
                } 

                else if (sPath === "RCA_technicalObjectSortCode") {
                    if (oFilterControl.getValue()) {
                        aFilters.push(new Filter({
                            path: "technicalObjects",
                            operator: FilterOperator.Contains,
                            value1: oFilterControl.getValue(),
                            caseSensitive: false
                        }))
                    }
                }
                else if (sPath === "RCA_objectType") {
                    var aRcaobjToken = oFilterControl.getTokens();

                    if (aRcaobjToken.length > 0) {
                        var aEquiMdaobjMultiInputFilter = [];

                        for (var iEquiMda = 0; iEquiMda < aRcaobjToken.length; iEquiMda++) {
                            aEquiMdaobjMultiInputFilter.push(new Filter({
                                path: "technicalObjects",
                                operator: FilterOperator.Contains,
                                value1: aRcaobjToken[iEquiMda].getText(),
                                caseSensitive: false,
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aEquiMdaobjMultiInputFilter
                        }));
                    }
                }
                else if (sPath === "ADVEQUI_CLASSES" || sPath === "ADVFLOC_CLASSES") {
                    
                    var aTechObjsClass = oFilterControl.getTokens();

                    if (aTechObjsClass.length > 0) {
                        var aTempRcmTechObjsClassFilter = [];
                        for (var iRcmTechObjsClass = 0; iRcmTechObjsClass < aTechObjsClass.length; iRcmTechObjsClass++) {
                            var sVal = aTechObjsClass[iRcmTechObjsClass].getKey();
                            var sSearch = "\"className\":\"" + sVal + "\"";
                            aTempRcmTechObjsClassFilter.push(new Filter({
                                path: "classDetails",
                                operator: FilterOperator.Contains,
                                value1: sSearch,
                                caseSensitive: false
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aTempRcmTechObjsClassFilter
                        }));
                    }
                } else if (sPath === "ADVEQUI_CHAR_CLASS" || sPath === "ADVFLOC_CHAR_CLASS") {
                    var aCharClass = oFilterControl.getTokens();

                    /**
                     * Function to extract values
                     * @param {String} str 
                     * @returns {Array}
                     */
                    var fnExtractCharValues = function(str) {
                        var match = str.match(/\(([^)]+)\)/);
                        if (!match) return [];

                        return match[1].split("-").map(function(v) {
                            return v.trim();
                        });
                    };

                    if (aCharClass.length > 0) {
                        var aTempCharClassFilter = [];
                        for (var iCharClass = 0; iCharClass < aCharClass.length; iCharClass++) {

                            if(window._currentTOApp === "fleet") {
                                var aCombinedCharFilters = [
                                    new Filter({
                                        path: "characteristicValues",
                                        operator: FilterOperator.Contains,
                                        value1: aCharClass[iCharClass].getKey(),
                                        caseSensitive: false
                                    })
                                ];

                                var aValueFilters = [];
                                var aCharValues = fnExtractCharValues(aCharClass[iCharClass].getText());

                                if(Array.isArray(aCharValues)) {
                                    aCharValues.forEach(function(iValue) {
                                        aValueFilters.push(new Filter({
                                            path: "characteristicValues",
                                            operator: FilterOperator.Contains,
                                            value1: iValue,
                                            caseSensitive: false
                                        }));
                                    })

                                    if(aValueFilters.length > 0) {
                                        aCombinedCharFilters.push(new Filter({
                                            filters: aValueFilters,
                                            and: false
                                        }));
                                    }
                                }

                                aTempCharClassFilter.push(new Filter({
                                    filters: aCombinedCharFilters,
                                    and: true
                                }));
                                

                            } else {
                                aTempCharClassFilter.push(new Filter({
                                    path: "characteristicValues",
                                    operator: FilterOperator.Contains,
                                    value1: aCharClass[iCharClass].getKey(),
                                    caseSensitive: false
                                }))
                            }
                        }

                        if(window._currentTOApp === "fleet") {
                            aFilters.push(new Filter({
                                and: true,
                                filters: aTempCharClassFilter
                            }));

                        } else {

                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempCharClassFilter
                            }));
                        }
                    }

                } else if (sPath === "EQUIPMENT_MDA") {
                    var aFindingsEquiMdaToken = oFilterControl.getTokens();

                    if (aFindingsEquiMdaToken.length > 0) {
                        var aEquiMdaMultiInputFilter = [];

                        for (var iEquiMdaFindings = 0; iEquiMdaFindings < aFindingsEquiMdaToken.length; iEquiMdaFindings++) {
                            aEquiMdaMultiInputFilter.push(new Filter({
                                path: "equipmentMDA",
                                operator: FilterOperator.Contains,
                                value1: aFindingsEquiMdaToken[iEquiMdaFindings].getText()
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aEquiMdaMultiInputFilter
                        }));
                    }
                } else if (sPath === "FLEET_equipment") {
                    var aEquipTokens = oFilterControl.getTokens();
                    if (aEquipTokens.length > 0) {
                        var aEquipFilters = [];
                        for (var iEq = 0; iEq < aEquipTokens.length; iEq++) {
                            aEquipFilters.push(new Filter({
                                and: true,
                                filters: [
                                    new Filter({
                                        path: "technicalObjects",
                                        operator: FilterOperator.Contains,
                                        value1: "\"equipmentId\""
                                    }),
                                    new Filter({
                                        path: "technicalObjects",
                                        operator: FilterOperator.Contains,
                                        value1: "\"" + aEquipTokens[iEq].getText() + "\""
                                    })
                                ]
                            }));
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aEquipFilters
                        }));
                    }
                } else if (sPath === "FLEET_functionalLocation") {
                    var aFlocTokens = oFilterControl.getTokens();
                    if (aFlocTokens.length > 0) {
                        var aFlocFilters = [];
                        for (var iFloc2 = 0; iFloc2 < aFlocTokens.length; iFloc2++) {
                            aFlocFilters.push(new Filter({
                                and: true,
                                filters: [
                                    new Filter({
                                        path: "technicalObjects",
                                        operator: FilterOperator.Contains,
                                        value1: "\"functionalLocationtId\""
                                    }),
                                    new Filter({
                                        path: "technicalObjects",
                                        operator: FilterOperator.Contains,
                                        value1: "\"" + aFlocTokens[iFloc2].getText() + "\""
                                    })
                                ]
                            }));
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aFlocFilters
                        }));
                    }
                } else if (sPath === "FINDING_RECOMDA") {
                    var aFindingsERecoMdaToken = oFilterControl.getTokens();

                    if (aFindingsERecoMdaToken.length > 0) {
                        var aRecoMdaMultiInputFilter = [];

                        for (var iMda = 0; iMda < aFindingsERecoMdaToken.length; iMda++) {
                            aRecoMdaMultiInputFilter.push(new Filter({
                                path: "recommendationDetails",
                                operator: FilterOperator.Contains,
                                value1: aFindingsERecoMdaToken[iMda].getText()
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aRecoMdaMultiInputFilter
                        }));
                    }
                } else if (sPath === "RECOMMENDATION_MDA") {
                    var aRecoMdaToken = oFilterControl.getTokens();

                    if (aRecoMdaToken.length > 0) {
                        var aGenericRecoMdaMultiInputFilter = [];

                        for (var iRecoMda = 0; iRecoMda < aRecoMdaToken.length; iRecoMda++) {
                            aGenericRecoMdaMultiInputFilter.push(new Filter({
                                path: "recommendations",
                                operator: FilterOperator.Contains,
                                value1: aRecoMdaToken[iRecoMda].getText()
                            }));
                        }

                        aFilters.push(new Filter({
                            and: false,
                            filters: aGenericRecoMdaMultiInputFilter
                        }));
                    }
                } else if (sPath === "equipmentSortField") {
                    // eslint-disable-next-line no-redeclare
                    var sVal = oFilterControl.getValue();
                    if (sVal) {
                        var aSortFieldFilters = [
                            new Filter({
                                path: "equipmentSortField",
                                operator: FilterOperator.Contains,
                                value1: sVal,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "functionalLocationSortField",
                                operator: FilterOperator.Contains,
                                value1: sVal,
                                caseSensitive: false
                            })
                        ];

                        aFilters.push(new Filter({
                            and: false,
                            filters: aSortFieldFilters
                        }));
                    } 
                } else if (sPath === "SORT_FIELD_OPTA") {
                    sVal = oFilterControl.getValue();
                    if (sVal) {
                        var aSortFilters = [
                            new Filter({
                                path: "sortField",
                                operator: FilterOperator.Contains,
                                value1: sVal,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "equipmentSortField",
                                operator: FilterOperator.Contains,
                                value1: sVal,
                                caseSensitive: false
                            })
                        ];

                        aFilters.push(new Filter({
                            and: false,
                            filters: aSortFilters
                        }));
                    } 
                } else if (sPath === "FLOCMainPlant") {
                    // eslint-disable-next-line no-redeclare
                    var aToken = oFilterControl.getTokens();

                    if (aToken.length > 0) {
                        /* eslint-disable no-redeclare */
                        var aTempFilter = [];
                        for (var FLOCMainPlant = 0; FLOCMainPlant < aToken.length; FLOCMainPlant++) {
                            /* eslint-disable no-redeclare */
                            var sValue = aToken[FLOCMainPlant].getKey();
                            /* eslint-disable no-redeclare */
                            var aSearch = "\\\"maintenancePlant\\\" : \\\"MAINTPLANT_" + sValue + "\\\"";
                            /* eslint-disable no-redeclare */
                            var equiFilters = [new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            })];
                            /* eslint-disable no-redeclare */
                            var FlocFilters = [new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            })];
                            var combinedFiltersMaintPlant = equiFilters.concat(FlocFilters);
                            if (combinedFiltersMaintPlant.length > 0) {
                                aTempFilter.push(new Filter({
                                    and: false,
                                    filters: combinedFiltersMaintPlant
                                }));
                            }
                        }
                        if (aTempFilter.length > 0) {
                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempFilter
                            }));
                        }

                    }
                } else if (sPath === "FLOCPlanPlant") {
                    // eslint-disable-next-line no-redeclare
                    var aToken = oFilterControl.getTokens();

                    if (aToken.length > 0) {
                        /* eslint-disable no-redeclare */
                        var aTempFilter = [];
                        for (var FLOCPlanPlant = 0; FLOCPlanPlant < aToken.length; FLOCPlanPlant++) {
                            /* eslint-disable no-redeclare */
                            var sValue = aToken[FLOCPlanPlant].getKey();
                            /* eslint-disable no-redeclare */
                            var aSearch = "\\\"planningPlant\\\" : \\\"" + sValue + "\\\"";
                            /* eslint-disable no-redeclare */
                            var equiFilters = [new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            })];
                            /* eslint-disable no-redeclare */
                            var FlocFilters = [new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            })];
                            /* eslint-disable no-redeclare */
                            var combinedFiltersMaintPlant = equiFilters.concat(FlocFilters);
                            if (combinedFiltersMaintPlant.length > 0) {
                                aTempFilter.push(new Filter({
                                    and: false,
                                    filters: combinedFiltersMaintPlant
                                }));
                            }
                        }
                        if (aTempFilter.length > 0) {
                            aFilters.push(new Filter({
                                and: false,
                                filters: aTempFilter
                            }));
                        }

                    }
                } else if (sPath === "FLOCsortField") {
                    /* eslint-disable no-redeclare */
                    var sValue = oFilterControl.getValue();

                    if (sValue) {
                        /* eslint-disable no-redeclare */
                        var aSearch = "\\\"sortField\\\" : \\\"" + sValue + "\\\"";
                        /* eslint-disable no-redeclare */
                        var equiFilters = [new Filter({
                            path: "equipmentDetails",
                            operator: FilterOperator.Contains,
                            value1: aSearch,
                            caseSensitive: false
                        })];
                        /* eslint-disable no-redeclare */
                        var FlocFilters = [new Filter({
                            path: "functionalLocationDetails",
                            operator: FilterOperator.Contains,
                            value1: aSearch,
                            caseSensitive: false
                        })];

                        aFilters.push(new Filter({
                            and: false,
                            filters: equiFilters.concat(FlocFilters)
                        }));
                    }
                } else if (sPath === "FLOCtechId") {
                    /* eslint-disable no-redeclare */
                    var sValue = oFilterControl.getValue();
                    if (sValue) {
                        /* eslint-disable no-redeclare */
                        var aSearch = "\\\"techId\\\" : \\\"" + sValue + "\\\"";
                        if (oFilterControl.getValue()) {
                            aFilters.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: aSearch,
                                caseSensitive: false
                            }))
                        }
                    }
                } else if (sPath === "EQUI_EQUI") {
                    var aStreamEQUIMultiInputToken = oFilterControl.getTokens();
                    if (aStreamEQUIMultiInputToken.length > 0) {
                        var aStreamEQUIMultiInputFilter = [];
                        for (var iStreamEqui = 0; iStreamEqui < aStreamEQUIMultiInputToken.length; iStreamEqui++) {
                            aStreamEQUIMultiInputFilter.push(new Filter({
                                path: "equipmentDetails",
                                operator: FilterOperator.Contains,
                                value1: "EQUINAMEFIL_" + aStreamEQUIMultiInputToken[iStreamEqui].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aStreamEQUIMultiInputFilter
                        }));
                    }
                } else if (sPath === "FLOC_FLOC") {
                    var aStreamFLOCMultiInputToken = oFilterControl.getTokens();
                    if (aStreamFLOCMultiInputToken.length > 0) {
                        var aStreamFLOCMultiInputFilter = [];
                        for (var iStreamFloc = 0; iStreamFloc < aStreamFLOCMultiInputToken.length; iStreamFloc++) {
                            aStreamFLOCMultiInputFilter.push(new Filter({
                                path: "functionalLocationDetails",
                                operator: FilterOperator.Contains,
                                value1: "FLOCNAMEFIL_" + aStreamFLOCMultiInputToken[iStreamFloc].getText()
                            }))
                        }
                        aFilters.push(new Filter({
                            and: false,
                            filters: aStreamFLOCMultiInputFilter
                        }));
                    }
                } else if ((sPath === "RWB_DUE_DATE_RANGE" || sPath === "RWB_START_DATE_RANGE" || sPath === "RWB_PLND_INSP_DATE_RANGE" || sPath === "RWB_SCHEDULE_DATE_RANGE" || sPath === "RWB_DEFERRED_DUE_DATE_RANGE") && this._featureFlagConfig.recommendationDateRangeFilter === "1") {

                    var oDateRangeMappings = {
                        "RWB_DUE_DATE_RANGE" : "dueDate",
                        "RWB_START_DATE_RANGE" : "startDate",
                        "RWB_PLND_INSP_DATE_RANGE" : "plannedInspectionDate",
                        "RWB_SCHEDULE_DATE_RANGE" : "scheduleDate",
                        "RWB_DEFERRED_DUE_DATE_RANGE" : "deferredDueDate"
                    }

                    var oInput1 = oFilterControl.getItems()[0];
                    var oInput2 = oFilterControl.getItems()[1];

                    if (oInput1 && oInput2) {
                        
                        var sInput1Value = oInput1.getValue();
                        var sInput2Value = oInput2.getValue();
                        var iInput1Value = (sInput1Value !== "" && sInput1Value !== null && sInput1Value !== undefined) ? parseInt(oInput1.getValue()) : null;
                        var iInput2Value = (sInput2Value !== "" && sInput2Value !== null && sInput2Value !== undefined) ? parseInt(oInput2.getValue()) : null;

                        if(!(iInput1Value === null && iInput2Value === null)) {

                            
                            if(iInput1Value > iInput2Value) {
                                var sTemp = iInput2Value;
                                iInput2Value = iInput1Value;
                                iInput1Value = sTemp;
                            }

                            var oFromDate = new Date();
                            var oToDate = new Date();

                            // Add or subtract date
                            oFromDate.setDate(oFromDate.getDate() + iInput1Value);
                            oToDate.setDate(oToDate.getDate() + iInput2Value);
                            oToDate.setHours(23, 59, 59, 999);
                            aFilters.push(new Filter({
                                path: oDateRangeMappings[sPath],
                                operator: FilterOperator.BT,
                                value1: oFromDate.toJSON(),
                                value2: oToDate.toJSON()
                            }));
                        }
                    }
                } else {
                    if (sControlType === "sap.m.Input") {
                        var sType = oFilterControl.getType();
                        if (oFilterControl.getValue()) {
                            if (sPath.includes("/0")) {
                                aFilters.push(new Filter({
                                    path: sPath.split("/0")[0],
                                    operator: FilterOperator.Any,
                                    variable: "v",
                                    condition: new Filter({
                                        path: "v" + sPath.split("/0")[1],
                                        operator: sType === "Number" ? FilterOperator.EQ : FilterOperator.Contains,
                                        value1: oFilterControl.getValue(),
                                        caseSensitive: false
                                    })
                                }))
                            } else {
                                aFilters.push(new Filter({
                                    path: sPath,
                                    operator: sType === "Number" ? FilterOperator.EQ : FilterOperator.Contains,
                                    value1: oFilterControl.getValue(),
                                    caseSensitive: false
                                }))
                            }
                        }
                    } else if (sControlType === "sap.m.DatePicker") {
                        if (oFilterControl.getDateValue()) {
                            if (oFilterControl.data("dataType").toLowerCase() === "datetime") {
                                aFilters.push(new Filter({
                                    path: sPath,
                                    operator: FilterOperator.EQ,
                                    value1: oFilterControl.getDateValue().toJSON()
                                }))
                            } else {
                                aFilters.push(new Filter({
                                    path: sPath,
                                    operator: FilterOperator.EQ,
                                    value1: this.formatDate(oFilterControl.getDateValue(), "yyyy-MM-dd")
                                }))
                            }
                        }
                    } else if (sControlType === "sap.m.DateRangeSelection") {
                        if (oFilterControl.getDateValue()) {
                            if (oFilterControl.data("dataType") && oFilterControl.data("dataType").toLowerCase() === "datetime") {
                                /**
                                 * Added by vignesh.ks@asint.net for defect 3-7557 - EndDate is incorrect so manually added upto 24hrs (23:59:59).
                                 * Initially it take (00:00:00) hrs for endDate
                                 */
                                oFilterControl.getSecondDateValue().setHours(23, 59, 59, 999);
                                aFilters.push(new Filter({
                                    path: sPath,
                                    operator: FilterOperator.BT,
                                    value1: oFilterControl.getDateValue().toJSON(),
                                    value2: oFilterControl.getSecondDateValue().toJSON()
                                }))
                            } else {
                                aFilters.push(new Filter({
                                    path: sPath,
                                    operator: FilterOperator.BT,
                                    value1: this.formatDate(oFilterControl.getDateValue(), "yyyy-MM-dd"),
                                    value2: this.formatDate(oFilterControl.getSecondDateValue(), "yyyy-MM-dd")
                                }))
                            }
                        }
                    } else if (sControlType === "sap.m.ComboBox") {
                        var bBoolean = oFilterControl.data("dataType") === "boolean";
                        if (oFilterControl.getSelectedKey().toString().length > 0) {
                            if (sPath === "$booleanBasedOnKey$") {
                                aFilters.push(new Filter({
                                    path: oFilterControl.getSelectedKey(),
                                    operator: FilterOperator.EQ,
                                    value1: true
                                }))
                            } else {
                                aFilters.push(new Filter({
                                    path: sPath,
                                    operator: FilterOperator.EQ,
                                    value1: bBoolean ? (oFilterControl.getSelectedKey().toLowerCase() === "true") : oFilterControl.getSelectedKey()
                                }))
                            }
                        }
                    } else if (sControlType === "sap.m.MultiComboBox") {
                        var sMultiComboId = oFilterControl.getId();
                        var bDataTypeBoolean = oFilterControl.data("dataType") === "boolean";
                        var aValue = oFilterControl.getSelectedKeys();
                        if (aValue.length > 0) {
                            var aMultiComboBoxFilter = [];
                            for (var m = 0; m < aValue.length; m++) {
                                if (sMultiComboId && sMultiComboId.includes("idMaintenanceOrderListPageMultiInput")) {
                                    aMultiComboBoxFilter.push(new Filter({
                                        path: sPath,
                                        operator: FilterOperator.Contains,
                                        value1: bDataTypeBoolean ? (aValue[m].toLowerCase() === "true") : aValue[m]
                                    }));
                                } else {
                                    aMultiComboBoxFilter.push(new Filter({
                                        path: sPath,
                                        operator: FilterOperator.EQ,
                                        value1: bDataTypeBoolean ? (aValue[m].toLowerCase() === "true") : aValue[m]
                                    }));
                                }
                            }
                            aFilters.push(new Filter({
                                and: false,
                                filters: aMultiComboBoxFilter
                            }));
                        }
                    } else if (sControlType === "sap.m.MultiInput") {
                        var aMultiInputToken = oFilterControl.getTokens();
                        var isShowValueHelp = oFilterControl.getShowValueHelp();
                        var isValueHelpOnly = oFilterControl.getValueHelpOnly();
                        var sOperator = "";
                        if (isShowValueHelp && isValueHelpOnly) {
                            sOperator = FilterOperator.EQ;
                        } else {
                            sOperator = FilterOperator.Contains;
                        }
                        if (aMultiInputToken.length > 0) {
                            var aMultiInputFilter = [];
                            for (var n = 0; n < aMultiInputToken.length; n++) {
                                aMultiInputFilter.push(new Filter({
                                    path: sPath,
                                    operator: sOperator,
                                    value1: aMultiInputToken[n].getText()
                                }))
                            }
                            aFilters.push(new Filter({
                                and: false,
                                filters: aMultiInputFilter
                            }));
                        }
                    } else if (sControlType === "sap.m.Switch") {
                        if (oFilterControl.getState()) {
                            aFilters.push(new Filter({
                                path: sPath,
                                operator: FilterOperator.EQ,
                                value1: oFilterControl.getState()
                            }))
                        }
                    }
                }
            }

            if(aSearchKeys.length){
                var aSemiAdvancedFilters = [];
                aSearchKeys.forEach(function(key){
                    var aSearchKeyData = oSearchKeys[key];
                    if(aSearchKeyData.length > 0){
                        var sSearchKey = `${key}:[${aSearchKeyData}]`;
                        aSemiAdvancedFilters.push(sSearchKey);
                    }
                });
                if(aSemiAdvancedFilters.length){
                    oAdvancedFilter = {
                        advancedFilter: aSemiAdvancedFilters.join("&")
                    };
                }
                
            }

            for (var o = 0; o < this._aTable.length; o++) {
                if (this._oConfig.Settings.LoadOnlyVisibleTable) {
                    if (this._aTable[o].getVisible()) {
                        fnApplyFilter.call(this, o);
                    }
                } else {
                    fnApplyFilter.call(this, o);
                }
            }

            this.refreshBinding();

        },

        /**
         * Function to handle filed data change
         * @param {Object} oEvent 
         */
        _fnFieldDataChange: function () {

            this._oSmartVariantManagement.currentVariantSetModified(true);
            this._fnUpdateVariantManagementText();

        },

        /**
         * Function to load feature flag config
         */
        fnLoadFeatureFlagConfig: function () {

            var that = this;

            if(!this._featureFlagConfig.isLoaded) {
                this.commonDataSource.fetchFeatureFlag(function(oConfig) {
                    Object.keys(that._featureFlagConfig).forEach(function(sKey) {
                        if(Object.prototype.hasOwnProperty.call(oConfig, sKey)) {
                            that._featureFlagConfig[sKey] = oConfig[sKey].objectValue;
                        }
                    });
                    that._featureFlagConfig.isLoaded = true;
                }, function () {
                    MessageToast.show(that._i18n.getText("TableConstructor.featureFlag.failed.message.text"));
                });
            }
        }

    });

});

