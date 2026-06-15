sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var oBlock = BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.ComponentInformation", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "com.asint.ais.mi.equipment.view.detail.ComponentInformation",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "com.asint.ais.mi.equipment.view.detail.ComponentInformation",
					type: ViewType.XML
				}
			}
		}
	});
	return oBlock;
});
