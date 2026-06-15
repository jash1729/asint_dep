sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
    "use strict";

    var ViewType = coreLibrary.mvc.ViewType;

    return BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.MaintenancePlan", {
        metadata: {
            views: {
                Collapsed: {
                    viewName: "com.asint.ais.mi.equipment.view.detail.MaintenancePlan",
                    type: ViewType.XML
                },
                Expanded: {
                    viewName: "com.asint.ais.mi.equipment.view.detail.MaintenancePlan",
                    type: ViewType.XML
                }
            }
        }
    });
});