sap.ui.define(["sap/ui/core/library", "sap/uxap/BlockBase"], function (coreLibrary, BlockBase) {
    "use strict";

    var ViewType = coreLibrary.mvc.ViewType;

    var oBlock = BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.Documents", {
        metadata: {
            views: {
                Collapsed: {
                    viewName: "com.asint.ais.mi.equipment.view.detail.Documents",
                    type: ViewType.XML
                },
                Expanded: {
                    viewName: "com.asint.ais.mi.equipment.view.detail.Documents",
                    type: ViewType.XML
                }
            }
        }
    });
    return oBlock;
});
