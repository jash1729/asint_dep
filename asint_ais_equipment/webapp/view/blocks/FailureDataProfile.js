sap.ui.define([
    "sap/ui/core/library",
    "sap/uxap/BlockBase"
], function (coreLibrary, BlockBase) {
    "use strict";

    var ViewType = coreLibrary.mvc.ViewType;

    var FailureDataProfile = BlockBase.extend(
        "com.asint.ais.mi.equipment.view.blocks.FailureDataProfile",
        {
            metadata: {
                views: {
                    Collapsed: {
                        viewName: "com.asint.ais.mi.equipment.view.detail.FailureDataProfile",
                        type: ViewType.XML
                    },
                    Expanded: {
                        viewName: "com.asint.ais.mi.equipment.view.detail.FailureDataProfile",
                        type: ViewType.XML
                    }
                }
            }
        }
    );

    return FailureDataProfile;
});