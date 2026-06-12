sap.ui.define([
    "com/asint/ais/library/controller/Utility",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "com/asint/ais/library/datasource/URL"
], function (Utility, JSONModel, BusyIndicator, URL) {
    "use strict";

    return Utility.extend("com.asint.ais.library.datasource.Utility", {

        _oModel: new JSONModel({ "count": 0 }),
        _sPropertyPath: "/count",
        _reqWaitDelaySec: 3 * 1000,
        _headers: {},

        URL: URL,
        
        _cacheConfig: {
            enable: true,
            type: "local",
            ttl: 1440,
            key: ""
        },

        /**
		 * set the header
		 * @param {object} oHeaders 
		 */
        setHeaders: function (oHeaders) {

            if (oHeaders && Object.keys(oHeaders).length > 0) {
                this._headers = oHeaders;
            }

        },

        /**
		 * Get the URL
		 * @param {string} sBaseURI 
		 * @param {string} sUrlKey 
		 * @returns 
		 */
        getUrl: function (sBaseURI, sUrlKey) {

            return (sBaseURI || "") + this.URL[sUrlKey];

        },

        /**
		 * 
		 * @returns void
		 */
        getProperty: function () {

            return this._oModel.getProperty(this._sPropertyPath);

        },

        /**
		 * set property
		 * @param {integer} iCounter 
		 */
        setProperty: function (iCounter) {

            this._oModel.setProperty(this._sPropertyPath, iCounter);

        },

        /**
		 * Show busy indicator
		 */
        showBusyIndicator: function () {

            BusyIndicator.show(0);
            this.setProperty(this.getProperty() + 1);

        },

        /**
		 * Hide busy indicator
		 */
        hideBusyIndicator: function () {

            var iCounter = this.getProperty();
            iCounter = iCounter - 1;

            this.setProperty(iCounter);

            if (iCounter === 0) {
                setTimeout(function () {
                    if (this.getProperty() === 0) {
                        BusyIndicator.hide();
                    }
                }.bind(this), this._reqWaitDelaySec);
            }

            this.setProperty(iCounter);

        },

        /**
		 * Attach busy indicator
		 * @param {object} oProperties 
		 */
        attachBusyIndicator: function (oProperties) {

            this.showBusyIndicator();

            oProperties.showBusyIndicator = false;
            var fnPSuccess = oProperties.success;
            var fnPError = oProperties.error;

            /**
			 * Success function
			 */
            var fnSuccess = function () {
                var args = Array.prototype.slice.call(arguments);
                this.hideBusyIndicator();
                if (fnPSuccess) {
                    fnPSuccess.apply(this, args);
                }
            };

            oProperties.success = fnSuccess.bind(this);

            /**
			 * Error function
			 * @param {object} oDataError 
			 */
            var fnError = function (oDataError) {
                this.hideBusyIndicator();
                if (fnPError) {
                    fnPError(oDataError);
                }
            };

            oProperties.error = fnError.bind(this);

        },

        /**
		 * Ajax call
		 * @param {object} oProperties 
		 * @param {boolean} bShowBusy 
		 */
        ajax: function (oProperties, bShowBusy) {

            var bRequired = bShowBusy === undefined ? true : bShowBusy;

            if (bRequired) {
                this.attachBusyIndicator(oProperties);
            }

            $.ajax(oProperties);

        },

        /**
		 * Function to add parameter to URL
		 * @param {string} sUrl 
		 * @param {object} oParam 
		 */
        fnAddParamToURL: function (sUrl, oParam) {

            var aParam = sUrl.match(/{[^{}]*}/g);

            if (Array.isArray(aParam)) {
                for (var i = 0; i < aParam.length; i++) {
                    var sParam = aParam[i].substring(1, aParam[i].length - 1);
                    if (oParam[sParam] !== null && oParam[sParam] !== undefined ) {
                        sUrl = sUrl.replace(new RegExp(aParam[i], "gi"), oParam[sParam]);
                    }
                }
            }

            return sUrl;

        },

        /**
		 * Get loggedin user email
		 */
        getLoggedInUserMail: function () {

            var sEmail = "";

            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
                sEmail = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
            }

            return sEmail;

        },

        /**
		 * Retrieves the logged-in user's full name.
		 * 
		 * @returns {string} The full name of the logged-in user.
		 */
        getLoggedInUserFullname: function () {
            var sName = "";
            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("UserInfo")) {
                sName = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
            }
            return sName;
        },

        /**
         * Function to make request
         * @param {string} sUrl 
         * @param {string} sMethod 
         * @param {object} oPayload 
         * @param {function} fnSuccess 
         * @param {function} fnError 
         * @param {boolean} bShowBusy 
         * @param {string} eTag 
         * @param {object} oCacheConfig
         */
        fnMakeRequest: function (sUrl, sMethod, oPayload, fnSuccess, fnError, bShowBusy, eTag, oCacheConfig) {

            oCacheConfig = oCacheConfig || null;

            var bUseCache = oCacheConfig && oCacheConfig.enable && sMethod === "GET";

            if (bUseCache && !oCacheConfig.key) {
                oCacheConfig.key = sUrl;
            }

            oCacheConfig = oCacheConfig ? JSON.parse(JSON.stringify(oCacheConfig)) : null;
            var oCacheOptions = null;

            if (bUseCache) {
                var sStorageType = (oCacheConfig.type === "session") ? this.Cache.StorageType.SESSION : this.Cache.StorageType.LOCAL;

                oCacheOptions = {
                    storageType: sStorageType
                };
                if (oCacheConfig.ttl) {
                    oCacheOptions.ttl = oCacheConfig.ttl;
                }
            }

            var that = this;

            /**
             * Function to make ajax request
             */
            var fnMakeAjaxRequest = function () {
                var sEmail = that.getLoggedInUserMail();

                var oProperties = {
                    url: sUrl,
                    method: sMethod,
                    headers: {
                        "Content-Type": "application/json",
                        "Email": sEmail
                    },
                    /**
                     * Success function
                     * @param {object} oResponse 
                     */
                    success: function (oResponse) {
                        if (bUseCache && oResponse !== undefined) {
                            var oSetOptions = {
                                storageType: oCacheOptions.storageType
                            };

                            if (oCacheConfig.ttl) {
                                oSetOptions.ttl = oCacheConfig.ttl;
                            }

                            that.Cache.set(oCacheConfig.key, JSON.parse(JSON.stringify(oResponse)), oSetOptions).catch(function (oError) {
                                console.error("Failed to cache response:", oError);
                            });
                        }
                        if (fnSuccess) {
                            fnSuccess(oResponse);
                        }
                    },
                    /**
                     * Error function
                     * @param {object} oError 
                     */
                    error: function (oError) {
                        if (fnError) {
                            fnError(oError);
                        }
                    }
                };

                if (eTag) {
                    oProperties.headers["If-Match"] = eTag;
                }

                if (Object.keys(that._headers).length > 0) {
                    Object.assign(oProperties.headers, that._headers);
                }

                if ((sMethod === "PUT" || sMethod === "POST" || sMethod === "PATCH" || sMethod === "DELETE") && oPayload) {
                    if (oPayload instanceof FormData) {
                        delete oProperties.headers["Content-Type"];

                        oProperties.data = oPayload;
                        oProperties.mimeType = "multipart/form-data";
                        oProperties.contentType = false;
                        oProperties.processData = false;
                    } else {
                        oProperties.data = JSON.stringify(oPayload);
                    }
                }

                that.ajax(oProperties, bShowBusy === false ? false : true);
            };

            if (bUseCache) {
                this.Cache.get(oCacheConfig.key, oCacheOptions).then(function (oCachedResponse) {
                    if (oCachedResponse !== null) {
                        if (fnSuccess) {
                            fnSuccess(oCachedResponse);
                        }
                    } else {
                        fnMakeAjaxRequest();
                    }
                }).catch(function (oError) {
                    console.error("Cache get error:", oError);
                    fnMakeAjaxRequest();
                });
            } else {
                fnMakeAjaxRequest();
            }
        },

        /**
		 * Get request
		 * @param {string} sUrl 
		 * @param {object} oParam 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {boolean} bShowBusy 
		 * @param {object} oCacheConfig 
		 */
        getData: function (sUrl, oParam, fnSuccess, fnError, bShowBusy, oCacheConfig) {

            sUrl = this.fnAddParamToURL(sUrl, oParam);

            this.fnMakeRequest(sUrl, "GET", {}, fnSuccess, fnError, bShowBusy, null, oCacheConfig)

        },

        /**
		 * put request
		 * @param {string} sUrl 
		 * @param {object} oParam 
		 * @param {object} oPayoad
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {boolean} bShowBusy
		 * @param {string} eTag  
		 */
        putData: function (sUrl, oParam, oPayoad, fnSuccess, fnError, bShowBusy, eTag) {

            sUrl = this.fnAddParamToURL(sUrl, oParam);

            this.fnMakeRequest(sUrl, "PUT", oPayoad, fnSuccess, fnError, bShowBusy, eTag)

        },

        /**
		 * post request
		 * @param {string} sUrl 
		 * @param {object} oParam 
		 * @param {object} oPayoad
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {boolean} bShowBusy
		 */
        postData: function (sUrl, oParam, oPayoad, fnSuccess, fnError, bShowBusy) {

            sUrl = this.fnAddParamToURL(sUrl, oParam);

            this.fnMakeRequest(sUrl, "POST", oPayoad, fnSuccess, fnError, bShowBusy)

        },

        /**
		 * patch request
		 * @param {string} sUrl 
		 * @param {object} oParam 
		 * @param {object} oPayoad
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {boolean} bShowBusy
		 * @param {string} eTag  
		 */
        patchData: function (sUrl, oParam, oPayoad, fnSuccess, fnError, bShowBusy, eTag) {

            sUrl = this.fnAddParamToURL(sUrl, oParam);

            this.fnMakeRequest(sUrl, "PATCH", oPayoad, fnSuccess, fnError, bShowBusy, eTag)

        },

        /**
		 * Delete request
		 * @param {string} sUrl 
		 * @param {object} oParam 
		 * @param {function} fnSuccess 
		 * @param {function} fnError 
		 * @param {boolean} bShowBusy
		 */
        deleteData: function (sUrl, oParam, fnSuccess, fnError, bShowBusy, eTag, oPayoad) {

            sUrl = this.fnAddParamToURL(sUrl, oParam);
            oPayoad = oPayoad ? oPayoad : {}

            this.fnMakeRequest(sUrl, "DELETE", oPayoad, fnSuccess, fnError, bShowBusy, eTag)

        },

        /**
         * Open URL in new tab 
         *
         * @param {string} sHashWithKeyword 
         */
        openUrlInNewTab: function (sHashWithKeyword) {
            var siteIdIndex = window.location.search.indexOf("siteId");
            var sSite = "";
            var url = "";
            if (siteIdIndex > -1) {
                var oParams = new URLSearchParams(window.location.search);
                sSite = oParams.get("siteId");
                url = window.location.origin + "/site?siteId=" + sSite + "#" + sHashWithKeyword;
            } else {
                url = window.location.origin + "/#" + sHashWithKeyword;
            }

            window.open(url, "_blank");
        },

    });

});