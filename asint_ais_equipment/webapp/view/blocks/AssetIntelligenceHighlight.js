sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
    "use strict";

    var ViewType = coreLibrary.mvc.ViewType;

    var GoalsBlock = BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.AssetIntelligenceHighlight", {
        metadata: {
            views: {
                Collapsed: {
                    viewName: "com.asint.ais.mi.equipment.view.detail.AssetIntelligenceHighlight",
                    type: ViewType.XML
                },
                Expanded: {
                    viewName: "com.asint.ais.mi.equipment.view.detail.AssetIntelligenceHighlight",
                    type: ViewType.XML
                }
            }
        }
    });
    return GoalsBlock;
});
