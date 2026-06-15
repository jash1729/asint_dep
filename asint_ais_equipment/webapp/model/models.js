sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
/**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
function (JSONModel, Device) {
    "use strict";

    return {
        /**
            * This function creates a JSON model based on the device information retrieved from the Device API.
            * 
            * @returns {sap.ui.model.json.JSONModel} The JSON model containing device information.
            */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        }
    };
});