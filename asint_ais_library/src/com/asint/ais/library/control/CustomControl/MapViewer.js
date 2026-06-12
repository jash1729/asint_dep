sap.ui.define([
    "sap/ui/core/Control",
    "sap/base/Log"
], function (Control, Log) {
    "use strict";

    /** @type {Promise<void>|null} Resolves once the Google Maps SDK is ready */
    var _oMapsReadyPromise = null;

    /**
     * Loads the Google Maps API once per page
     */
    function _loadGoogleMapsApi(sApiKey) {
        if (_oMapsReadyPromise) {
            return _oMapsReadyPromise;
        }

        if (window.google && window.google.maps) {
            _oMapsReadyPromise = Promise.resolve();
            return _oMapsReadyPromise;
        }

        /**
         * 
         */
        _oMapsReadyPromise = new Promise(function (resolve, reject) {
            var sCallbackName = "__sapMapViewerReady__";

            /**
             * 
             */
            window[sCallbackName] = function () {
                delete window[sCallbackName];
                resolve();
            };

            var oScript = document.createElement("script");
            oScript.id    = "sap-map-viewer-api-script";
            oScript.async = true;
            oScript.src =
                "https://maps.googleapis.com/maps/api/js" +
                "?key="+ encodeURIComponent(sApiKey) +
                "&libraries=geometry" +
                "&callback=" + sCallbackName;

            /**
             * 
             */
            oScript.onerror = function () {
                _oMapsReadyPromise = null;
                reject(new Error("MapViewer: Failed to load Google Maps API. Check the apiKey property."));
            };

            document.head.appendChild(oScript);
        });

        return _oMapsReadyPromise;
    }

    return Control.extend("com.asint.ais.library.control.CustomControl.MapViewer", {

        metadata: {
            library: "com.asint.ais.library",
            properties: {
                apiKey: { type: "string"},
                latitude: { type: "float"},
                longitude: { type: "float"},
                zoom: { type: "int", defaultValue: 20 },
                editable: { type: "boolean", defaultValue: true },
                width: { type: "sap.ui.core.CSSSize" },
                height: { type: "sap.ui.core.CSSSize" }
            },
            events: {
                /**
                 * Fired when the marker position changes
                 * @param {float} latitude
                 * @param {float} longitude
                 */
                coordinateChange: {
                    parameters: {
                        latitude: { type: "float" },
                        longitude: { type: "float" }
                    }
                }
            }
        },

        renderer: {
            apiVersion: 2,

            /**
             * Renders the outer container, loading spinner, and map canvas div
             */
            render: function (oRm, oControl) {
                oRm.openStart("div", oControl);
                oRm.class("mapViewerContainer");
                oRm.class("sapMapViewerContainer");

                if (!oControl.getEditable()) {
                    oRm.class("sapMapViewerReadOnly");
                }

                oRm.style("width",oControl.getWidth());
                oRm.style("height",oControl.getHeight());
                oRm.attr("role","application");
                oRm.attr("aria-label","Map Viewer");
                oRm.openEnd();

                oRm.openStart("div");
                oRm.class("sapMapViewerLoader");
                oRm.attr("id", oControl.getId() + "-loader");
                oRm.openEnd();
                oRm.text("Loading map\u2026");
                oRm.close("div");
                oRm.openStart("div");
                oRm.attr("id", oControl.getId() + "-map");
                oRm.style("width","100%");
                oRm.style("height","100%");

                oRm.openEnd();
                oRm.close("div");

                oRm.close("div");
            }
        },

        /**
         *  Initialises private state variables 
         */
        init: function () {
            Control.prototype.init.apply(this, arguments);

            this._oMap = null;
            this._oMarker = null;
            this._oDragEndListener = null;
            this._oMapClickListener = null;
            this._bListenersAttached = false;
            this._bUpdatingBindings = false;
            this._bInternalClickSuppressed = false;
        },

        /** 
         * Detaches map listeners before each re-render
         */
        onBeforeRendering: function () {
            if (Control.prototype.onBeforeRendering) {
                Control.prototype.onBeforeRendering.apply(this, arguments);
            }
            this.detachMapListeners();
        },

        /** 
         * Loads the Maps API then initialises or syncs the map after each render 
         */
        onAfterRendering: function () {
            if (Control.prototype.onAfterRendering) {
                Control.prototype.onAfterRendering.apply(this, arguments);
            }

            var sKey = this.getApiKey();
            if (!sKey) {
                Log.error("MapViewer: the apiKey property is required.", this.getId());
                return;
            }

            var that = this;
            /**
             * 
             */
            _loadGoogleMapsApi(sKey)
                .then(function () {
                    if (that._oMap) {
                        that.syncMapState();
                    } else {
                        that._initMap();
                    }
                })
                .catch(function (oErr) {
                    Log.error("MapViewer: " + oErr.message, that.getId());
                });
        },

        /** 
         * Cleans up listeners and map references on control destruction
         */
        exit: function () {
            this.detachMapListeners();

            if (this._oMarker) {
                this._oMarker.setMap(null);
                this._oMarker = null;
            }
            this._oMap = null;
        },

        /**
         * Sets latitude and pans the map without a full re-render
         * @param {float} fValue
         * @returns {this}
         */
        setLatitude: function (fValue) {
            this.setProperty("latitude", fValue, true);

            if (!this._bUpdatingBindings) {
                this.syncMarkerAndCenter();
            }
            return this;
        },

        /**
         * Sets longitude and pans the map without a full re-render
         * @param {float} fValue
         * @returns {this}
         */
        setLongitude: function (fValue) {
            this.setProperty("longitude", fValue, true);

            if (!this._bUpdatingBindings) {
                this.syncMarkerAndCenter();
            }
            return this;
        },

        /**
         * Sets the zoom level on the live map instance
         * @param {int} iValue
         * @returns {this}
         */
        setZoom: function (iValue) {
            this.setProperty("zoom", iValue, true);

            if (this._oMap) {
                this._oMap.setZoom(iValue);
            }
            return this;
        },

        /**
         * Toggles marker drag and map-click interactivity
         * @param {boolean} bValue
         * @returns {this}
         */
        setEditable: function (bValue) {
            this.setProperty("editable", bValue, true);
            this.applyEditable();
            return this;
        },

        /**
         * Updates the container width without a full re-render
         * @param {string} sValue - CSS size, e.g. "100%" or "600px"
         * @returns {this}
         */
        setWidth: function (sValue) {
            this.setProperty("width", sValue, true);

            var oDom = this.getDomRef();
            if (oDom) {
                oDom.style.width = sValue;
            }
            return this;
        },

        /**
         * Updates the container height without a full re-render
         * @param {string} sValue - CSS size, e.g. "400px" or "50vh"
         * @returns {this}
         */
        setHeight: function (sValue) {
            this.setProperty("height", sValue, true);

            var oDom = this.getDomRef();
            if (oDom) {
                oDom.style.height = sValue;
            }
            return this;
        },


        /**
         * Suppresses the internal click listener so a controller can take over
         * @public
         */
        disableInternalClick: function () {
            this._bInternalClickSuppressed = true;
        },

        /**
         * Restores the internal click listener after disableInternalClick()
         * @public
         */
        enableInternalClick: function () {
            this._bInternalClickSuppressed = false;
        },

        /**
         * Creates the Map and Marker on first render
         * @private
         */
        _initMap: function () {
            var oMapDiv = document.getElementById(this.getId() + "-map");
            if (!oMapDiv || !window.google || !window.google.maps) {
                return;
            }
            var oLoader = document.getElementById(this.getId() + "-loader");
            if (oLoader) {
                oLoader.style.display = "none";
            }
            var oCenter = { lat: this.getLatitude(), lng: this.getLongitude() };
            this._oMap = new google.maps.Map(oMapDiv, {
                center: oCenter,
                zoom: this.getZoom(),
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                gestureHandling: "cooperative",
                streetViewControl: false,
                fullscreenControl: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                },
                keyboardShortcuts: false
            });

            this._oMarker = new google.maps.Marker({
                position: oCenter,
                map: this._oMap,
                draggable: this.getEditable(),
                title: "Selected Location",
                animation: google.maps.Animation.DROP
            });

            this.attachMapListeners();
        },

        /**
         * Re-attaches the existing map canvas after a SAPUI5 re-render
         * @private
         */
        syncMapState: function () {
            if (!this._oMap) {
                return;
            }

            var oMapDiv = document.getElementById(this.getId() + "-map");
            if (oMapDiv) {
                var oCanvas = this._oMap.getDiv();
                if (oCanvas && oCanvas.parentNode !== oMapDiv) {
                    oMapDiv.appendChild(oCanvas);
                }
                var oLoader = document.getElementById(this.getId() + "-loader");
                if (oLoader) { oLoader.style.display = "none"; }
            }

            google.maps.event.trigger(this._oMap, "resize");
            this.syncMarkerAndCenter();
            this.applyEditable();
            this.attachMapListeners();
        },

        /**
         * Moves the marker and pans the map to the current lat/lng
         * @private
         */
        syncMarkerAndCenter: function () {
            if (!this._oMap || !this._oMarker) {
                return;
            }
            var lat = this.getLatitude();
            var lng = this.getLongitude();
            if (!isFinite(lat) || !isFinite(lng) || lat === null || lng === null) {
                return;
            }
            var oPos = { lat: lat, lng: lng };
            this._oMarker.setPosition(oPos);
            this._oMap.panTo(oPos);
        },

        /**
         * Applies the current editable state to marker draggability and cursor
         * @private
         */
        applyEditable: function () {
            if (!this._oMarker) {
                return;
            }
            var bEditable = this.getEditable();
            this._oMarker.setDraggable(bEditable);
            this._oMarker.setCursor(bEditable ? "pointer" : "default");
        },

        /**
         * Registers dragend and click listeners. Guard prevents duplicate registration
         * @private
         */
        attachMapListeners: function () {
            var that = this;
            if (!this._oMap || !this._oMarker || this._bListenersAttached) {
                return;
            }
            this._oDragEndListener = this._oMarker.addListener("dragend", function (oEvent) {
                if (!that.getEditable()) {
                    return;
                }
                that.updateCoordinates(oEvent.latLng.lat(), oEvent.latLng.lng(), true);
            });

            this._oMapClickListener = this._oMap.addListener("click", function (oEvent) {
                if (!that.getEditable() || that._bInternalClickSuppressed) {
                    return;
                }

                that.updateCoordinates(oEvent.latLng.lat(), oEvent.latLng.lng(), true);

                that._oMarker.setAnimation(google.maps.Animation.BOUNCE);
                /**
                 * 
                 */
                setTimeout(function () {
                    if (that._oMarker) {
                        that._oMarker.setAnimation(null);
                    }
                }, 750);
            });
            this._bListenersAttached = true;
        },

        /**
         * Removes all map event listeners to prevent memory leaks
         * @private
         */
        detachMapListeners: function () {
            if (!window.google || !window.google.maps) {
                this._bListenersAttached = false;
                return;
            }
            if (this._oDragEndListener) {
                google.maps.event.removeListener(this._oDragEndListener);
                this._oDragEndListener = null;
            }
            if (this._oMapClickListener) {
                google.maps.event.removeListener(this._oMapClickListener);
                this._oMapClickListener = null;
            }
            this._bListenersAttached = false;
        },

        /**
         * Updates lat/lng properties, pushes values to bound model, and fires the event
         * @param {float} fLat
         * @param {float} fLng
         * @param {boolean} bFireEvent
         * @private
         */
        updateCoordinates: function (fLat, fLng, bFireEvent) {
            this._bUpdatingBindings = true;
            this.setProperty("latitude",  fLat, true);
            this.setProperty("longitude", fLng, true);

            var oLatBinding = this.getBinding("latitude");
            if (oLatBinding) {
                oLatBinding.setValue(fLat);
            }

            var oLngBinding = this.getBinding("longitude");
            if (oLngBinding) {
                oLngBinding.setValue(fLng);
            }

            this._bUpdatingBindings = false;
            if (this._oMarker) {
                this._oMarker.setPosition({ lat: fLat, lng: fLng });
            }
            if (bFireEvent) {
                this.fireCoordinateChange({
                    latitude:  fLat,
                    longitude: fLng
                });
            }
        }
    });
});