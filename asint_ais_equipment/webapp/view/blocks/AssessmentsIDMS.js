sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var GoalsBlock = BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.AssessmentsIDMS", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "com.asint.ais.mi.equipment.view.detail.AssessmentsIDMS",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "com.asint.ais.mi.equipment.view.detail.AssessmentsIDMS",
					type: ViewType.XML
				}
			}
		}
	});
	return GoalsBlock;
});
