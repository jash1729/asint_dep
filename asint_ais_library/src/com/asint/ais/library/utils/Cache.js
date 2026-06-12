sap.ui.define([], function () {
    "use strict";

    var oIndexedDBHelper = {
        sDbName: "AIS_CACHE_DB",
        iVersion: 1,
        oDb: null,
        oPendingInit: null,

        /**
         * Initialize IndexedDB
         * 
         * @returns {Promise}
         */
        init: function () {
            var that = this;

            if (this.oDb) {
                return Promise.resolve(this.oDb);
            }

            if (this.oPendingInit) {
                return this.oPendingInit;
            }

            this.oPendingInit = new Promise(function (resolve, reject) {
                var oRequest = indexedDB.open(that.sDbName, that.iVersion);

                oRequest.onerror = function () {
                    that.oPendingInit = null;
                    reject(new Error("Failed to open IndexedDB"));
                };

                oRequest.onsuccess = function (oEvent) {
                    that.oDb = oEvent.target.result;
                    that.oPendingInit = null;
                    resolve(that.oDb);
                };

                oRequest.onupgradeneeded = function (oEvent) {
                    var oDb = oEvent.target.result;

                    if (!oDb.objectStoreNames.contains("LOCAL")) {
                        oDb.createObjectStore("LOCAL");
                    }
                    if (!oDb.objectStoreNames.contains("SESSION")) {
                        oDb.createObjectStore("SESSION");
                    }
                };
            });

            return this.oPendingInit;
        },

        /**
         * Get value from IndexedDB
         * 
         * @param {String} sStoreName
         * @param {String} sKey
         * @returns {Promise}
         */
        get: function (sStoreName, sKey) {
            return this.init().then(function (oDb) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oTransaction = oDb.transaction([sStoreName], "readonly");
                        var oStore = oTransaction.objectStore(sStoreName);
                        var oRequest = oStore.get(sKey);

                        oRequest.onsuccess = function () {
                            resolve(oRequest.result);
                        };

                        oRequest.onerror = function () {
                            reject(new Error("Failed to get value from IndexedDB"));
                        };
                    } catch (oError) {
                        reject(oError);
                    }
                });
            });
        },

        /**
         * Set value in IndexedDB
         * 
         * @param {String} sStoreName
         * @param {String} sKey
         * @param {any} vValue
         * @returns {Promise}
         */
        set: function (sStoreName, sKey, vValue) {
            return this.init().then(function (oDb) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oTransaction = oDb.transaction([sStoreName], "readwrite");
                        var oStore = oTransaction.objectStore(sStoreName);
                        var oRequest = oStore.put(vValue, sKey);

                        oRequest.onsuccess = function () {
                            resolve();
                        };

                        oRequest.onerror = function () {
                            reject(new Error("Failed to set value in IndexedDB"));
                        };
                    } catch (oError) {
                        reject(oError);
                    }
                });
            });
        },

        /**
         * Remove value from IndexedDB
         * 
         * @param {String} sStoreName
         * @param {String} sKey
         * @returns {Promise}
         */
        remove: function (sStoreName, sKey) {
            return this.init().then(function (oDb) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oTransaction = oDb.transaction([sStoreName], "readwrite");
                        var oStore = oTransaction.objectStore(sStoreName);
                        var oRequest = oStore.delete(sKey);

                        oRequest.onsuccess = function () {
                            resolve();
                        };

                        oRequest.onerror = function () {
                            reject(new Error("Failed to remove value from IndexedDB"));
                        };
                    } catch (oError) {
                        reject(oError);
                    }
                });
            });
        },

        /**
         * Get all keys from a store
         * 
         * @param {String} sStoreName
         * @returns {Promise}
         */
        getAllKeys: function (sStoreName) {
            return this.init().then(function (oDb) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oTransaction = oDb.transaction([sStoreName], "readonly");
                        var oStore = oTransaction.objectStore(sStoreName);
                        var oRequest = oStore.getAllKeys();

                        oRequest.onsuccess = function () {
                            resolve(oRequest.result || []);
                        };

                        oRequest.onerror = function () {
                            reject(new Error("Failed to get all keys from IndexedDB"));
                        };
                    } catch (oError) {
                        reject(oError);
                    }
                });
            });
        },

        /**
         * Batch remove multiple keys
         * 
         * @param {String} sStoreName
         * @param {Array} aKeys
         * @returns {Promise}
         */
        batchRemove: function (sStoreName, aKeys) {
            if (!aKeys || aKeys.length === 0) {
                return Promise.resolve();
            }

            return this.init().then(function (oDb) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oTransaction = oDb.transaction([sStoreName], "readwrite");
                        var oStore = oTransaction.objectStore(sStoreName);
                        var iCompleted = 0;
                        var iTotal = aKeys.length;
                        var bHasError = false;

                        aKeys.forEach(function (sKey) {
                            var oRequest = oStore.delete(sKey);
                            
                            oRequest.onsuccess = function () {
                                iCompleted++;
                                if (iCompleted === iTotal && !bHasError) {
                                    resolve();
                                }
                            };

                            oRequest.onerror = function () {
                                if (!bHasError) {
                                    bHasError = true;
                                    reject(new Error("Failed to remove key: " + sKey));
                                }
                            };
                        });

                        if (iTotal === 0) {
                            resolve();
                        }
                    } catch (oError) {
                        reject(oError);
                    }
                });
            });
        },

        /**
         * Clear all entries in a store
         * 
         * @param {String} sStoreName
         * @returns {Promise}
         */
        clearStore: function (sStoreName) {
            return this.init().then(function (oDb) {
                return new Promise(function (resolve, reject) {
                    try {
                        var oTransaction = oDb.transaction([sStoreName], "readwrite");
                        var oStore = oTransaction.objectStore(sStoreName);
                        var oRequest = oStore.clear();

                        oRequest.onsuccess = function () {
                            resolve();
                        };

                        oRequest.onerror = function () {
                            reject(new Error("Failed to clear IndexedDB store"));
                        };
                    } catch (oError) {
                        reject(oError);
                    }
                });
            });
        }
    };

    var oCacheHelper = {
        StorageType: {
            LOCAL: "LOCAL",
            SESSION: "SESSION" // Will implement cleanup activity later
        },
        iCleanupIntervalId: null,
        bCacheClearInitiated: false,
        oCleanupQueue: {},
        iCleanupDebounceTimer: null,

        /**
         * Cache clear initializer
         * 
         * @returns
         */
        _initCacheClear: function () {
            if (this.bCacheClearInitiated) {
                return;
            }

            var that = this;
            var iCleanupInterval = 5 * 60 * 1000;

            this._debouncedCleanup();

            this.iCleanupIntervalId = setInterval(function () {
                that._debouncedCleanup();
            }, iCleanupInterval);

            window.addEventListener("beforeunload", function () {
                that._immediateCleanup();
            }, { passive: true });

            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "hidden") {
                    that._debouncedCleanup();
                }
            }, { passive: true });

            this.bCacheClearInitiated = true;
        },

        /**
         * Debounced cleanup to avoid excessive operations
         * 
         * @returns
         */
        _debouncedCleanup: function () {
            var that = this;
            
            clearTimeout(this.iCleanupDebounceTimer);
            
            this.iCleanupDebounceTimer = setTimeout(function () {
                that._performCleanup();
            }, 1000);
        },

        /**
         * Immediate cleanup without debouncing
         * 
         * @returns
         */
        _immediateCleanup: function () {
            clearTimeout(this.iCleanupDebounceTimer);
            this._performCleanup();
        },

        /**
         * Perform actual cleanup operation
         * 
         * @returns
         */
        _performCleanup: function () {
            var that = this;
            
            var fnCleanup = function () {
                Promise.all([
                    that.cleanExpired({ storageType: that.StorageType.LOCAL }),
                    that.cleanExpired({ storageType: that.StorageType.SESSION })
                ]).catch(function (oError) {
                    console.error("Cleanup failed:", oError);
                });
            };

            if (window.requestIdleCallback) {
                window.requestIdleCallback(fnCleanup, { timeout: 5000 });
            } else {
                fnCleanup();
            }
        },

        /**
         * Get store name based on storage type
         * 
         * @param {String} sStorageType
         * @returns {String}
         */
        _getStoreName: function (sStorageType) {
            return sStorageType || this.StorageType.LOCAL;
        },

        /**
         * Build prefixed key (only if prefix provided)
         * 
         * @param {String} sKey
         * @param {String} sPrefix
         * @returns {String}
         */
        _getPrefixedKey: function (sKey, sPrefix) {
            return sPrefix ? (sPrefix + sKey) : sKey;
        },

        /**
         * Get all keys with a specific prefix from IndexedDB
         * 
         * @param {String} sStoreName
         * @param {String} sPrefix
         * @returns {Promise}
         */
        _getKeysWithPrefix: function (sStoreName, sPrefix) {
            return oIndexedDBHelper.getAllKeys(sStoreName).then(function (aAllKeys) {
                if (!sPrefix) {
                    return aAllKeys;
                }

                return aAllKeys.filter(function (sKey) {
                    return sKey.startsWith(sPrefix);
                });
            });
        },

        /**
         * Set cache entry
         * 
         * @param {String} sKey
         * @param {any} vValue
         * @param {Object} oOptions
         * @returns {Promise}
         */
        set: function (sKey, vValue, oOptions) {
            oOptions = oOptions || {};

            this._initCacheClear();

            try {
                var sStoreName = this._getStoreName(oOptions.storageType);
                var sPrefix = oOptions.prefix || "";
                var sPrefixedKey = this._getPrefixedKey(sKey, sPrefix);

                var oCacheData = {
                    value: vValue,
                    timestamp: Date.now()
                };
                
                if (oOptions.ttl && typeof oOptions.ttl === "number") {
                    oCacheData.expiresAt = Date.now() + (oOptions.ttl * 60 * 1000);
                }

                return oIndexedDBHelper.set(sStoreName, sPrefixedKey, oCacheData).then(function () {
                    return true;
                }).catch(function (oError) {
                    console.error("Cache set error:", oError);
                    return false;
                });
            } catch (oError) {
                console.error("Cache set error:", oError);
                return Promise.resolve(false);
            }
        },

        /**
         * Get cache entry
         * 
         * @param {String} sKey
         * @param {Object} oOptions
         * @returns {Promise}
         */
        get: function (sKey, oOptions) {
            oOptions = oOptions || {};
            var that = this;

            this._initCacheClear();

            try {
                var sStoreName = this._getStoreName(oOptions.storageType);
                var sPrefix = oOptions.prefix || "";
                var sPrefixedKey = this._getPrefixedKey(sKey, sPrefix);

                return oIndexedDBHelper.get(sStoreName, sPrefixedKey).then(function (oCacheData) {
                    if (!oCacheData) {
                        return null;
                    }

                    if (oCacheData.expiresAt && Date.now() > oCacheData.expiresAt) {
                        that._queueRemoval(sKey, oOptions);
                        return null;
                    }

                    return oCacheData.value;
                }).catch(function (oError) {
                    console.error("Cache get error:", oError);
                    return null;
                });
            } catch (oError) {
                console.error("Cache get error:", oError);
                return Promise.resolve(null);
            }
        },

        /**
         * Queue item for removal
         * 
         * @param {String} sKey
         * @param {Object} oOptions
         * @returns
         */
        _queueRemoval: function (sKey, oOptions) {
            var that = this;
            var sStoreName = this._getStoreName(oOptions.storageType);
            
            if (!this.oCleanupQueue[sStoreName]) {
                this.oCleanupQueue[sStoreName] = [];
            }
            
            this.oCleanupQueue[sStoreName].push(sKey);
            
            setTimeout(function () {
                that._processRemovalQueue(sStoreName);
            }, 100);
        },

        /**
         * Process queued removals in batch
         * 
         * @param {String} sStoreName
         * @returns
         */
        _processRemovalQueue: function (sStoreName) {
            var aKeys = this.oCleanupQueue[sStoreName];
            if (!aKeys || aKeys.length === 0) {
                return;
            }

            this.oCleanupQueue[sStoreName] = [];

            oIndexedDBHelper.batchRemove(sStoreName, aKeys).catch(function (oError) {
                console.error("Batch removal failed:", oError);
            });
        },

        /**
         * Remove cache entry
         * 
         * @param {String} sKey
         * @param {Object} oOptions
         * @returns {Promise}
         */
        remove: function (sKey, oOptions) {
            oOptions = oOptions || {};

            try {
                var sStoreName = this._getStoreName(oOptions.storageType);
                var sPrefix = oOptions.prefix || "";
                var sPrefixedKey = this._getPrefixedKey(sKey, sPrefix);

                return oIndexedDBHelper.remove(sStoreName, sPrefixedKey).then(function () {
                    return true;
                }).catch(function (oError) {
                    console.error("Cache remove error:", oError);
                    return false;
                });
            } catch (oError) {
                console.error("Cache remove error:", oError);
                return Promise.resolve(false);
            }
        },

        /**
         * Clear all cache entries under a prefix
         * 
         * @param {Object} oOptions
         * @returns {Promise}
         */
        clear: function (oOptions) {
            oOptions = oOptions || {};

            try {
                var sStoreName = this._getStoreName(oOptions.storageType);
                var sPrefix = oOptions.prefix || "";

                return this._getKeysWithPrefix(sStoreName, sPrefix).then(function (aKeys) {
                    if (aKeys.length === 0) {
                        return Promise.resolve(true);
                    }

                    return oIndexedDBHelper.batchRemove(sStoreName, aKeys).then(function () {
                        return true;
                    }).catch(function (oError) {
                        console.error("Cache clear error:", oError);
                        return false;
                    });
                });
            } catch (oError) {
                console.error("Cache clear error:", oError);
                return Promise.resolve(false);
            }
        },

        /**
         * Check if key exists and is not expired
         * 
         * @param {String} sKey
         * @param {Object} oOptions
         * @returns {Promise}
         */
        has: function (sKey, oOptions) {
            return this.get(sKey, oOptions).then(function (vValue) {
                return vValue !== null;
            });
        },

        /**
         * Set session cache (cleared on browser close)
         * 
         * @param {String} sKey
         * @param {any} vValue
         * @param {String} sPrefix
         * @returns {Promise}
         */
        setSessionCache: function (sKey, vValue, sPrefix) {
            return this.set(sKey, vValue, {
                storageType: this.StorageType.SESSION,
                prefix: sPrefix
            });
        },

        /**
         * Set timed cache (expires after specified minutes)
         * 
         * @param {String} sKey
         * @param {any} vValue
         * @param {number} iMinutes - TTL in minutes
         * @param {String} sPrefix
         * @returns {Promise}
         */
        setTimedCache: function (sKey, vValue, iMinutes, sPrefix) {
            return this.set(sKey, vValue, {
                storageType: this.StorageType.LOCAL,
                ttl: iMinutes,
                prefix: sPrefix
            });
        },

        /**
         * Set permanent cache (no expiration)
         * 
         * @param {String} sKey
         * @param {any} vValue
         * @param {String} sPrefix
         * @returns {Promise}
         */
        setPermanentCache: function (sKey, vValue, sPrefix) {
            return this.set(sKey, vValue, {
                storageType: this.StorageType.LOCAL,
                prefix: sPrefix
            });
        },

        /**
         * Clean expired entries
         * 
         * @param {Object} oOptions
         * @returns {Promise}
         */
        cleanExpired: function (oOptions) {
            oOptions = oOptions || {};

            var sStoreName = this._getStoreName(oOptions.storageType);
            var sPrefix = oOptions.prefix || "";

            return this._getKeysWithPrefix(sStoreName, sPrefix).then(function (aKeys) {
                if (aKeys.length === 0) {
                    return Promise.resolve();
                }

                var iNow = Date.now();
                var aExpiredKeys = [];
                var aCheckPromises = [];

                aKeys.forEach(function (sKey) {
                    var oPromise = oIndexedDBHelper.get(sStoreName, sKey).then(function (oData) {
                        if (oData && oData.expiresAt && iNow > oData.expiresAt) {
                            aExpiredKeys.push(sKey);
                        }
                    }).catch(function () {});

                    aCheckPromises.push(oPromise);
                });

                return Promise.all(aCheckPromises).then(function () {
                    if (aExpiredKeys.length > 0) {
                        return oIndexedDBHelper.batchRemove(sStoreName, aExpiredKeys);
                    }
                });
            }).catch(function (oError) {
                console.error("Clean expired error:", oError);
            });
        },

        /**
         * Get metadata for a cache entry
         * 
         * @param {String} sKey
         * @param {Object} oOptions
         * @returns {Promise}
         */
        getMetadata: function (sKey, oOptions) {
            oOptions = oOptions || {};

            try {
                var sStoreName = this._getStoreName(oOptions.storageType);
                var sPrefix = oOptions.prefix || "";
                var sPrefixedKey = this._getPrefixedKey(sKey, sPrefix);

                return oIndexedDBHelper.get(sStoreName, sPrefixedKey).then(function (oData) {
                    if (!oData) {
                        return null;
                    }

                    return {
                        timestamp: oData.timestamp,
                        expiresAt: oData.expiresAt || null,
                        isExpired: oData.expiresAt ? Date.now() > oData.expiresAt : false,
                        age: Date.now() - oData.timestamp
                    };
                }).catch(function (oError) {
                    console.error("Cache metadata error:", oError);
                    return null;
                });
            } catch (oError) {
                console.error("Cache metadata error:", oError);
                return Promise.resolve(null);
            }
        },

        /**
         * Get all keys with a specific prefix
         * 
         * @param {Object} oOptions
         * @returns {Promise}
         */
        getKeys: function (oOptions) {
            oOptions = oOptions || {};
            var sStoreName = this._getStoreName(oOptions.storageType);
            var sPrefix = oOptions.prefix || "";

            return this._getKeysWithPrefix(sStoreName, sPrefix);
        }
    };

    return oCacheHelper;

});