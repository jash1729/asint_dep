sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var GoalsBlock = BlockBase.extend("com.asint.ais.mi.equipment.view.blocks.AssessmentsRBI", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "com.asint.ais.mi.equipment.view.detail.AssessmentsRBI",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "com.asint.ais.mi.equipment.view.detail.AssessmentsRBI",
					type: ViewType.XML
				}
			}
		}
	});
	return GoalsBlock;
});
