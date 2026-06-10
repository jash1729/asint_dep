jQuery.sap.declare("com.asint.ais.mi.cml.utility.Formatter");

var Formatter = {

    onInit: function (oResourceBundle) {
		this._oResourceBundle = oResourceBundle;
	},

    DateFormatter: function (sDate) {

		var sLDate = sDate.split("-"),
			sRDate = sLDate[0] + sLDate[1] + sLDate[2].split().splice(0, 2);

		return sRDate;
	},

    fnGetUIDate: function (sDateInput) {
		if (!sDateInput) {
			return null;
		}

		if (sap.ushell && sap.ushell.Container) {
			if (!this._sDatePattern) {
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				var oLocale = new sap.ui.core.Locale(sLanguage);
				this._sDatePattern = sap.ui.core.LocaleData.getInstance(oLocale).getDatePattern("medium");
			}
		} else {
			this._sDatePattern = "MMMM dd, YYYY";
		}

		var oDate = null;

		if (sDateInput instanceof Date) {
			// Is date object?
			oDate = sDateInput;
		} else if (/^\d+$/.test(sDateInput)) {
			// Is Number?
			oDate = new Date(Number(sDateInput));
		} else if (sDateInput.includes("/Date")) {
			// Is backend date string?
			oDate = new Date(Number(sDateInput.substring(6, sDateInput.length - 2)));
		} else {
			// Is date string?
			oDate = new Date(sDateInput);
		}
		oDate = isNaN(oDate) ? null : oDate;
		var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: this._sDatePattern
		});
		return oFormat.format(oDate, true /*UTC*/ );
	},

	fnSortArrayOfObject: function (aList, sColumnName) {
		function fnCompare(a, b) {
			if (a[sColumnName] < b[sColumnName]) {
				return -1;
			}
			if (a[sColumnName] > b[sColumnName]) {
				return 1;
			}
			return 0;
		}
		var aRetList = aList.sort(fnCompare);
		return aRetList;
	},

	fnPicklistDataPrepare: function (aArguments, sSelectedPersonaID) {
		var aDataPicklist = [];
		var oDataPicklistSourceField = {};

		$.each(aArguments, function (i, oPicklist) {
			if(oPicklist.equipmentTemplateId === sSelectedPersonaID){
				//Picklist Mapping
				if (oPicklist.typeId && oPicklist.typeId.toUpperCase() === "SOURCE") {
					oDataPicklistSourceField[oPicklist.attributeId] = oPicklist.pickListId;
				}

				//Temp Code----------------------------
				if (oPicklist.sequence === undefined) {
					oPicklist.sequence = (i + 1);
				}
				//Temp Code----------------------------

				oPicklist.sequence = (!isNaN(oPicklist.sequence)) ? parseInt(oPicklist.sequence) : null;
				aDataPicklist.push(oPicklist);
			}
		});
		aDataPicklist = this.fnSortArrayOfObject(aDataPicklist, "sequence");
		
		var oData = {
			"DataPicklist": aDataPicklist,
			"DataPicklistSourceField":oDataPicklistSourceField
		};
		return oData;
	},

	fnSortArrayOfObject: function (aList, sColumnName) {
		function fnCompare(a, b) {
			if (a[sColumnName] < b[sColumnName]) {
				return -1;
			}
			if (a[sColumnName] > b[sColumnName]) {
				return 1;
			}
			return 0;
		}
		var aRetList = aList.sort(fnCompare);
		return aRetList;
	},

	fnSuccessFailure:function(sStatus){
		this.removeStyleClass("statusSucess");
		this.removeStyleClass("statusFailure");
		this.removeStyleClass("statusWarn");
		if(sStatus == "Success"){
			this.addStyleClass("statusSuccess");
		}else if(sStatus == "Warning"){
			this.addStyleClass("statusWarn");
		}else{
			this.addStyleClass("statusFailure");
		}
		return sStatus;
	},

	fnFormatCmlReading:function(sCmlReading,unitOfMeasure){
		var sUom = unitOfMeasure == "Inch" ? "IN" :"MM"
		var sEnhancedCmlReading = sCmlReading + "(" + sUom + ")";
		return sEnhancedCmlReading;
	},

	fnGrowthDetection(sCurrentReading,sPreviousReading){
		this.removeStyleClass("statusWarn");
		if(sPreviousReading != "" && sCurrentReading > sPreviousReading){
			this.addStyleClass("statusWarn");
		}
		return sCurrentReading;
	}

}

com.asint.ais.mi.cml.utility.Formatter = Formatter;

sap.ui.define([], function () {
	"use strict";
	return Formatter;
});