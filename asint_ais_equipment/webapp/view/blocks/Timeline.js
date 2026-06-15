sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var RMBlock = BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.Timeline", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "com.asint.ais.mi.equipment.view.detail.Timeline",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "com.asint.ais.mi.equipment.view.detail.Timeline",
					type: ViewType.XML
				}
			}
		}
	});
	return RMBlock;
});
