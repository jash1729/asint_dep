sap.ui.define([
    "com/asint/ais/mi/equipment/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.asint.ais.mi.equipment.controller.detail.Documents", {

        /**
         * Ui5 lifecycle method triggered on first load of the view.
         */
        onInit: function () {
            this.getRouter().getRoute("nEquipmentDetail").attachPatternMatched(this.fnInitialize, this);
        },

        /**
         * Ui5 lifecycle method triggered on every rendering of the view.
         */
        onBeforeRendering: function () { },

        /**
         * Ui5 lifecycle method triggered on every rendering of the view.
         */
        onAfterRendering: function () {

            this.fnInitialize();

        },

        /**
         * Ui5 lifecycle method triggered on every exiting of the view.
         */
        onExit: function () { },

        /**
         * Method to initialize the content of the view.
         */
        fnInitialize: function () {
            var oContainer = this.getView().byId("tableContainer");
            var model = this.getView().getModel("mEquipmentDetail");
            var editFlag = model.getProperty("/data/userRoles/edit");
            var isUnpublished = model.getProperty("/metadata/status/isUnpublished");
            var mEquipment = this.getView().getModel("mEquipment");
            var genEnableMultiDocumentUpload = mEquipment.getProperty("/metadata/featureFlag/genEnableMultiDocumentUpload") === "1";
            // var userRoles = model.getProperty("/data/userRoles/edit") || false;
            if(isUnpublished) {
                editFlag = model.getProperty("/data/userRoles/edit");
            } else {
                editFlag = false
            }

            var _baseURI = this.baseURI;
            var path = "/data/documents/list";
            var propPath = "/data/documents/";
            var oTable = this.tableHelper.createTable(model,path,propPath, _baseURI, editFlag,null,genEnableMultiDocumentUpload);

            this.busyDialog = new sap.m.BusyDialog();
            model.setProperty("/metadata/tabs/attachments/isBusy", false);
            
            oContainer.removeAllItems();
            oContainer.addItem(oTable);
        }
    });

})
