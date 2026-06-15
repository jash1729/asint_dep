sap.ui.define([
    "com/asint/ais/mi/equipment/controller/detail/EquipmentDetail.controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.asint.ais.mi.equipment.controller.detail.MaintenanceAndService", {
         
        /**
         * This function will be called once the view got initialized for the first time
         */
        onInit: function () { },
         
        /**
         * This function will be called before rendering the view
         */
        onBeforeRendering: function () { },
        
        /**
         * This function will be called after rendering the view
         */
        onAfterRendering: function () { },
         
        /**
         * this function will be called once the view got changed from view port
         */
        onExit: function () { },

        /**
         * Function that navigate to maintenace order detail page
         */
        onMaintenanceOrderTitlePress: function(oEvent) {
            var that = this;
            var maintenanceObj = oEvent.getSource().getBindingContext("mEquipmentDetail").getObject();
            var sId = maintenanceObj.maintenanceOrderMaster_ID;
            var sHashWithKeyword = this.NAVIGATION.MAINTENANCE_ORDER_DETAIL;
            sHashWithKeyword = sHashWithKeyword.replace("{maintenanceId}", sId);
            var newUrl = that.setNavUrl(window, sHashWithKeyword);
            window.open(newUrl, "_blank");
        }

    });
});