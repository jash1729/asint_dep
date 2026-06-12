sap.ui.define([
    "sap/m/MultiInput",
    "sap/m/Token",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/ValueState"
], function (MultiInput, Token, ODataModel, Column, Text, ColumnListItem, Filter, FilterOperator, ValueState) {
    "use strict";

    return MultiInput.extend("com.asint.ais.library.control.CustomControl.EmailInput", {

        metadata: {
            properties: {
                serviceUrl: { type: "string", defaultValue: "/asint/odata/v4/UserAccessService/" },
                multiValue: { type: "boolean", defaultValue: true },
                email: { type: "string", defaultValue: "" },
                emails: { type: "string[]", defaultValue: [] },
                selectedUserIds: { type: "string[]", defaultValue: [] }
            },
            events: {
                selectionChange: {
                    parameters: {
                        email: { type: "string" },
                        emails: { type: "string[]" },
                        selectedUserIds: { type: "string[]" }
                    }
                }
            }
        },

        /**
         * Initializes the control, sets up suggestion bindings and event handlers
         */
        init: function () {
            MultiInput.prototype.init.apply(this, arguments);

            this.setShowSuggestion(true);
            this.setFilterSuggests(false);
            this.setStartSuggestion(1);
            this.setShowValueHelp(false);

            this._iSuggestTimer = null;
            this._iTokenUpdateTimer = null;
            this._oModel = null;
            this._bUpdatingBindings = false;
            this._bAddingToken = false;
            this._oSelectedKeys = {};

            this.attachSuggest(this._onSuggest.bind(this));
            this.attachSuggestionItemSelected(this._onSuggestionSelected.bind(this));
            this.attachTokenUpdate(this._onTokenUpdate.bind(this));
            this.attachChange(this._onManualEntry.bind(this));
        },

        /**
         * Seeds tokens from property values before the control is rendered
         */
        onBeforeRendering: function () {
            if (MultiInput.prototype.onBeforeRendering) {
                MultiInput.prototype.onBeforeRendering.apply(this, arguments);
            }

            if (this.getTokens().length > 0) {
                return;
            }

            if (!this.getMultiValue() && this.getEmail()) {
                this._seedTokens([this.getEmail()]);
            } else if (this.getMultiValue() && this.getEmails().length > 0) {
                this._seedTokens(this.getEmails());
            }
        },

        /**
         * Sets the single email property and refreshes the token display
         * @param {string} sEmail
         * @returns {this}
         */
        setEmail: function (sEmail) {
            this.setProperty("email", sEmail, true);
            if (this._bUpdatingBindings) { return this; }

            this.removeAllTokens();
            this._oSelectedKeys = {};

            if (sEmail) {
                this._seedTokens([sEmail]);
            }

            return this;
        },

        /**
         * Sets the emails array property and refreshes all tokens
         * @param {string[]} aEmails
         * @returns {this}
         */
        setEmails: function (aEmails) {
            this.setProperty("emails", aEmails || [], true);
            if (this._bUpdatingBindings) {
                return this;
            }

            this.removeAllTokens();
            this._oSelectedKeys = {};

            if (aEmails && aEmails.length > 0) {
                this._seedTokens(aEmails);
            }

            return this;
        },

        /**
         * Lazily initializes the OData model and suggestion column bindings
         */
        _ensureModel: function () {
            if (this._oModel) {
                return;
            }

            this._oModel = new ODataModel({
                serviceUrl: this.getServiceUrl(),
                synchronizationMode: "None",
                operationMode: "Server",
                autoExpandSelect: true
            });

            this.setModel(this._oModel);
            this.addSuggestionColumn(new Column({ header: new Text({ text: "Email" }) }));
            this.addSuggestionColumn(new Column({ header: new Text({ text: "Name" }) }));

            this.bindAggregation("suggestionRows", {
                path: "/UserList",
                parameters: { $select: "ID,userName,name" },
                template: new ColumnListItem({
                    cells: [
                        new Text({ text: "{userName}" }),
                        new Text({ text: "{name}" })
                    ]
                })
            });
        },

        /**
         * Filters suggestion rows based on the typed value with a debounce delay
         * @param {sap.ui.base.Event} oEvent
         */
        _onSuggest: function (oEvent) {
            var sValue = oEvent.getParameter("suggestValue");
            var that = this;

            this._ensureModel();

            var oBinding = this.getBinding("suggestionRows");
            if (!oBinding) {
                return;
            }

            clearTimeout(this._iSuggestTimer);

            this._iSuggestTimer = setTimeout(function () {
                oBinding.filter(sValue
                    ? new Filter({
                        filters: [
                            new Filter("userName", FilterOperator.Contains, sValue),
                            new Filter("name", FilterOperator.Contains, sValue)
                        ], and: false
                    })
                    : []
                );
            }, 300);
        },

        /**
         * Adds a token for the selected suggestion row item
         * @param {sap.ui.base.Event} oEvent
         */
        _onSuggestionSelected: function (oEvent) {
            var oRow = oEvent.getParameter("selectedRow");
            if (!oRow) {
                return;
            }

            var oObject = oRow.getBindingContext().getObject();

            if (this.getMultiValue() && this._oSelectedKeys[oObject.ID]) {
                this.setValue("");
                return;
            }

            this._addToken(oObject.ID, oObject.userName);
        },

        /**
         * Validates a manually typed email format and triggers backend lookup
         */
        _onManualEntry: function () {
            var sValue = this.getValue();
            if (!sValue) {
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sValue)) {
                var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
                this.setValueState(ValueState.Error);
                this.setValueStateText(oI18n.getText("emailInput.valueState.message001"));
                return;
            }

            this._validateAgainstBackend(sValue);
        },

        /**
         * Checks the typed email against the backend and adds a token if found
         * @param {string} sEmail
         */
        _validateAgainstBackend: function (sEmail) {
            var that = this;
            var oBinding = this._oModel.bindList("/UserList", null, null,
                [new Filter("userName", FilterOperator.EQ, sEmail)],
                { $select: "ID,userName,name", $$groupId: "$auto" }
            );

            this._ensureModel();
            this.setBusy(true);

            oBinding.requestContexts(0, 1).then(function (aContexts) {
                var oObject = aContexts && aContexts.length > 0 ? aContexts[0].getObject() : null;
                oBinding.destroy();
                that.setBusy(false);

                if (!oObject) {
                    that.setValueState(ValueState.Error);
                    var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
                    that.setValueStateText(oI18n.getText("emailInput.valueState.message002"));
                    return;
                }

                if (that.getMultiValue() && that._oSelectedKeys[oObject.ID]) {
                    that.setValue("");
                    return;
                }

                that._addToken(oObject.ID, oObject.userName);
            }).catch(function () {
                try {
                    oBinding.destroy();
                } catch (e) {
                    /* ignore */
                }

                that.setBusy(false);
                that.setValueState(ValueState.Error);

                var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
                that.setValueStateText(oI18n.getText("emailInput.valueState.message003"));
            });
        },

        /**
         * Creates and adds a new token, then updates bound properties
         * @param {string} sKey
         * @param {string} sText
         */
        _addToken: function (sKey, sText) {
            this._bAddingToken = true;

            if (!this.getMultiValue()) {
                this.removeAllTokens();
                this._oSelectedKeys = {};
            }

            this.addToken(new Token({ key: sKey, text: sText }));
            this.setValue("");
            this.setValueState(ValueState.None);

            this._oSelectedKeys[sKey] = true;
            this._bAddingToken = false;

            this._updateBindings();
        },

        /**
         * Creates initial tokens from a list of email strings without backend validation
         * @param {string[]} aEmails
         */
        _seedTokens: function (aEmails) {
            var that = this;

            aEmails.forEach(function (sEmail) {
                if (!sEmail || that._oSelectedKeys[sEmail]) {
                    return;
                }
                that.addToken(new Token({ key: sEmail, text: sEmail }));
                that._oSelectedKeys[sEmail] = true;
            });
        },

        /**
         * Syncs internal key map and updates bindings after a token is removed
         * @param {sap.ui.base.Event} oEvent
         */
        _onTokenUpdate: function (oEvent) {
            if (this._bAddingToken || oEvent.getParameter("type") !== "removed") {
                return;
            }

            var that = this;

            clearTimeout(this._iTokenUpdateTimer);

            this._iTokenUpdateTimer = setTimeout(function () {
                var oKeys = {};
                that.getTokens().forEach(function (oToken) { oKeys[oToken.getKey()] = true; });
                that._oSelectedKeys = oKeys;
                that._updateBindings();
            }, 0);
        },

        /**
         * Syncs token state back to bound properties and fires the selectionChange event.
         */
        _updateBindings: function () {
            var aTokens = this.getTokens();
            var bMultiValue = this.getMultiValue();
            var aIds = aTokens.map(function (oItem) {
                return oItem.getKey();
            });
            var aEmails = aTokens.map(function (oItem) {
                return oItem.getText();
            });

            this._bUpdatingBindings = true;
            this.setProperty("selectedUserIds", aIds, true);
            this.setProperty(bMultiValue ? "emails" : "email", bMultiValue ? aEmails : (aEmails[0] || ""), true);
            this._bUpdatingBindings = false;

            this.fireSelectionChange({
                email: bMultiValue ? "" : (aEmails[0] || ""),
                emails: bMultiValue ? aEmails : [],
                selectedUserIds: aIds
            });
        },

        /**
         * Cleans up timers and destroys the OData model on control destruction.
         */
        exit: function () {
            clearTimeout(this._iSuggestTimer);
            clearTimeout(this._iTokenUpdateTimer);

            if (this._oModel) {
                this._oModel.destroy();
                this._oModel = null;
            }

            this._oSelectedKeys = null;
        },

        renderer: {}
    });
});