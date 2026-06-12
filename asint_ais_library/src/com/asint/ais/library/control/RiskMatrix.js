sap.ui.define([
    "sap/ui/core/Control",
    "com/asint/ais/library/control/RiskMatrixCell"
], function (Control) {

    return Control.extend("com.asint.ais.library.control.RiskMatrix", {
        metadata: {
            properties: {
                rows: {
                    type: "int",
                    defaultalue: 0
                },
                cols: {
                    type: "int",
                    defaultalue: 0
                },
                index: {
                    type: "int",
                    defaultValue: 0
                }
            },

            aggregations: {
                cells: {
                    type: "com.asint.ais.library.control.RiskMatrixCell",
                    multiple: true,
                    singularName: "cell"
                },
                xAxisData: {
                    type: "com.asint.ais.library.control.RiskXAxis",
                    multiple: true
                },
                yAxisData: {
                    type: "com.asint.ais.library.control.RiskYAxis",
                    multiple: true
                },
                riskLines: {
                    type: "com.asint.ais.library.control.RiskLine",
                    multiple: true,
                    singularName: "riskLine"
                },
                plotPoints: {
                    type: "com.asint.ais.library.control.PlotPoint",
                    multiple: true,
                    singularName: "plotPoint"
                },
                pointLabels: {
                    type: "com.asint.ais.library.control.RiskMatrixLabel",
                    multiple: true,
                    singularName: "pointLabel"
                }
            },
            defaultAggregation: "cells",

            events: {}
        },

        /**
		 * @description The Custom Control's init method, 
		 *				called first before the control 
		 *				is rendered onto the DOM
		 * 
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 */
        init: function () {
			
            // Tracks vertical spacing offset for our text elements
            this._xPointsMaxVertOffset = 0;
			
            // Tracks vertical spacing offset for the Y-Axis texts
            this._yPointsMaxVertOffset = 0;
        },

        /**
		 * @description Function to build the SVG matrix grid using the configured
		 *              matrix size
		 * 
		 * @author      M0477
		 * @version     1.0
		 * @since       1.0
		 * 
		 * @return      {string} Prepared HTML of the SVG Grid
		 */
        fnBuildMatrixGrid: function () {

            var sHtml = "",
                i,
                j,
                jXOF = 0.2,
                jXLim = 0.2;

            if (this.getAggregation("yAxisData") !== null &&
				typeof this.getAggregation("yAxisData")[1] !== "undefined") {
                jXOF = 2.71;
                jXLim = 7.71;
            }

            for (i = 0.3; i < this.getRows() + 1.3; i += 1.0) {
                for (j = jXOF; j <= this.getCols() * 3 + jXLim; j += 3.50) {
                    if(i === 1.3){
                        sHtml += "<rect x=\"" + (j * 100) + "\" y=\"" + (i * 100) + "\" height=\"200\" width=\"350\" stroke=\"black\" stroke-width=\"2\" stroke-opacity=\"1\" />";
                        // sHtml += '<text x="' + ((j * 100) + 60) + '" y="' + ((i * 100) + 30) + '" font-family="Arial, sans-serif" class="asintTextBreakCls" font-size="28px" fill="black" text-anchor="middle" dominant-baseline="central"></text>';
                        if(j === 0.2){
                            sHtml += "<foreignObject height=\"200\" width=\"350\" x=\"" + ((j * 100) + 0) +"\" y=\"" + ((i * 100) + 0) + "\"><div class=\"rmTextDivPaddingCls\" xmlns=\"http://www.w3.org/1999/xhtml\"><text font-family=\"Arial, sans-serif\" class=\"asintRMTextBreakClsBlack\" font-size=\"38px\" fill=\"black\" text-anchor=\"middle\" dominant-baseline=\"central\"></text></div></foreignObject>"
                        }else{
                            sHtml += "<foreignObject height=\"200\" width=\"350\" x=\"" + ((j * 100) + 0) +"\" y=\"" + ((i * 100) + 0) + "\"><div class=\"rmTextDivPaddingCls\" xmlns=\"http://www.w3.org/1999/xhtml\"><text font-family=\"Arial, sans-serif\" class=\"asintRMTextBreakClsWhite\" font-size=\"38px\" fill=\"white\" text-anchor=\"middle\" dominant-baseline=\"central\"></text></div></foreignObject>"
                        }
                    }else{
                        sHtml += "<rect x=\"" + (j * 100) + "\" y=\"" + (i * 100) + "\" height=\"100\" width=\"350\" stroke=\"black\" stroke-width=\"2\" stroke-opacity=\"1\" />";
                        sHtml += "<text x=\"" + ((j * 100) + 150) + "\" y=\"" + ((i * 100) + 50) + "\" font-family=\"Arial, sans-serif\" font-size=\"30px\" fill=\"black\" text-anchor=\"middle\" dominant-baseline=\"central\"></text>";
                    }
                }
                if(i === 1.3){
                    i = i + 1.0;
                }
            }

            return sHtml;
        },

        /**
		 * @description Function to build the SVG matrix grid's X-Axis labels
		 *
		 * @author      MM0477
		 * @version     1.1
		 * @since       1.0
		 * 
		 * @param       {number} iAxis Indicator as we can have upto two separate x-axis
		 * 
		 * @returns     {string} String of the SVG HTML that will render the x-axis	
		 */
        fnBuildXAxisPoints: function (iAxis) {
			
            var oPointData,
                aPoints = [],
                aMidPoints = [],
                sHtml = "",
                iPointYVal,
                iMidPointYVal;

            var bRange = false,
                bText = false,
                i = 0,
                j = 0;

            // Decide if we're configuring the first or second axis
            if (iAxis === 1) {
                oPointData = this.getAggregation("xAxisData")[0].getAggregation("axisValues");

                bRange = this.getAggregation("xAxisData")[0].getShowRange();
                bText = this.getAggregation("xAxisData")[0].getShowTextOnly();

                iPointYVal = ((this.getRows() + 0.8) * 100);
                iMidPointYVal = ((this.getRows() + 0.6) * 100);
            } else {
                oPointData = this.getAggregation("xAxisData")[1].getAggregation("axisValues");

                bRange = this.getAggregation("xAxisData")[1].getShowRange();
                bText = this.getAggregation("xAxisData")[1].getShowTextOnly();

                iPointYVal = ((this.getRows() + 1.7) * 100);
                iMidPointYVal = ((this.getRows() + 1.5) * 100);
            }

            // Prepare an array of all required points
            if (bRange) {

                for (i = 0; i < oPointData.length; ++i) {
                    var sLow = oPointData[i].getLow(),
                        sHigh = oPointData[i].getLow();

                    aPoints.push(sLow + "to" + sHigh);

                    aMidPoints.push(oPointData[i].getText1());
                }
            } else {

                for (i = 0; i <= oPointData.length; ++i) {
                    if (i === oPointData.length - 1) {
                        aPoints.push(oPointData[i].getLow());
                        aPoints.push(oPointData[i].getHigh());

                        aMidPoints.push(oPointData[i].getText1());

                        break;
                    }

                    if (oPointData[i].getHigh() === oPointData[i + 1].getLow()) {
                        aPoints.push(oPointData[i].getLow());

                        aMidPoints.push(oPointData[i].getText1());
                    } else {
                        break;
                    }
                }
            }

            var iXMOF = 2.2,
                iXOF = 1.7;
            if (this.getAggregation("yAxisData") !== null && typeof this.getAggregation("yAxisData")[1] !== "undefined") {
                iXMOF = 3.2;
                iXOF = 2.7;
            }

            if (bRange) {
                iXOF = iXMOF;
            }

            for (i = 0; i < aPoints.length; ++i) {

                if (i < aMidPoints.length && (!bRange || (bRange && bText))) {
					
                    var aWords = aMidPoints[i].split(" ");
					
                    var iVertOffset = 0;
                    for (j = 0; j < aWords.length; ++j) {
                        sHtml += "<text text-anchor=\"middle\" x=\"" + ((i + iXMOF) * 100) + "\"" +
						"y=\"" + (iMidPointYVal + iVertOffset) + "\" >" + aWords[j] + "</text>";
						
                        iVertOffset += 13;
                    }
					
                    if (this._xPointsMaxVertOffset < iVertOffset) {
                        this._xPointsMaxVertOffset = iVertOffset;
                    }
                }

                if (!bText || (bRange && bText)) {
                    sHtml += "<text text-anchor=\"middle\" class=\"asIntRbiRMXLabelPoint\" x=\"" + ((i + iXOF) * 100) + "\" y=\"" + (iPointYVal + this._xPointsMaxVertOffset) +
						"\">" + aPoints[i] + "</text>";
                }
            }

            return sHtml;
        },

        /**
		 * @description Function to build the SVG matrix grid's X-Axis labels
		 *
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 * 
		 * @param       {number} iAxis Indicator as we can have upto two separate x-axis
		 * 
		 * @returns     {string} String of the SVG HTML that will render the x-axis	
		 */
        fnBuildXLabels: function (iAxis) {

            var sHtml = "",
                sLabelText = "";

            // X-Points Over Flow Value
            var iXOF = 2;
            if (this.getAggregation("yAxisData") !== null && typeof this.getAggregation("yAxisData")[1] !== "undefined") {
                iXOF = 4;
            }

            if (iAxis === 1) {
                sLabelText = this.getAggregation("xAxisData")[0].getAxisDesc();

                sHtml += "<text text-anchor= \"middle\" class=\"asintRbiLabelText\" font-size=\"21px\"" +
					"x=\"" + ((((this.getCols() + iXOF) / 2) + 0.7) * 100) + "\"" +
					"y=\"" + (((this.getRows() + 1.1) * 100) + this._xPointsMaxVertOffset) + "\">" +
					sLabelText +
					"</text>";
            } else {
                sLabelText = this.getAggregation("xAxisData")[1].getAxisDesc();

                sHtml += "<text text-anchor=\"middle\" class=\"asintRbiLabelText\" font-size=\"21px\"" +
					"x=\"" + ((((this.getCols() + iXOF) / 2) + 0.7) * 100) + "\"" +
					"y=\"" + (((this.getRows() + 2) * 100) + this._xPointsMaxVertOffset) + "\">" +
					sLabelText +
					"</text>";
            }

            return sHtml;
        },

        /**
		 * @description Function to abbreviate the number
		 * 
		 * @param {number} num 
		 * @param {number} fixed 
		 * 
		 * @returns {number} 
		 */
        fnAbbreviateNumber: function (num, fixed) {
            if (num === null) {
                return null;
            } // terminate early

            if (num === 0) {
                return "0";
            } // terminate early

            var sTempFixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show

            var b = (num).toPrecision(2).split("e"), // get power
                k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
                c = k < 1 ? num.toFixed(0 + sTempFixed) : (num / Math.pow(10, k * 3)).toFixed(1 + sTempFixed), // divide by power
                d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
                e = d + ["", "K", "M", "B", "T"][k]; // append power

            return e;
        },

        /**
		 * @description Function to build the SVG matrix grid's Y-Axis labels
		 *
		 * @author      MM0477
		 * @version     1.0.2
		 * @since       1.0
		 * 
		 * @param       {number} iAxis Indicator as we can have upto two separate x-axis
		 * 
		 * @returns     {string} String of the SVG HTML that will render the x-axis	
		 */
        fnBuildYAxisPoints: function (iAxis) {

            var oPointData,
                aPoints = [],
                aMidPoints = [],
                sHtml = "",
                iPointXVal,
                iMidPointXVal;

            var bRange = false,
                bText = false,
                i = 0,
                j = 0;

            var iXOF = 1.8;
            if (this.getAggregation("yAxisData") !== null && typeof this.getAggregation("yAxisData")[1] !== "undefined") {
                iXOF = 2.8;
            }

            // Decide if we're configuring the first or second axis
            if (iAxis === 1) {
                oPointData = this.getAggregation("yAxisData")[0].getAggregation("axisValues");

                bRange = this.getAggregation("yAxisData")[0].getShowRange();
                bText = this.getAggregation("yAxisData")[0].getShowTextOnly();

                iPointXVal = ((iXOF - 0.8) * 100);
                iMidPointXVal = ((iXOF - 0.15) * 100);
            } else {
                oPointData = this.getAggregation("yAxisData")[1].getAggregation("axisValues");

                bRange = this.getAggregation("yAxisData")[1].getShowRange();
                bText = this.getAggregation("yAxisData")[1].getShowTextOnly();

                iPointXVal = ((iXOF - 2.2) * 100);
                iMidPointXVal = ((iXOF - 1.7) * 100);
            }

            if (bRange) {
                for (i = oPointData.length - 1; i >= 0; i--) {
                    var sLow = oPointData[i].getLow(),
                        sHigh = oPointData[i].getHigh();

                    aPoints.push(sLow + "-" + sHigh);

                    aMidPoints.push(oPointData[i].getText1());
                }
            } else {
                // Prepare an array of all required points
                for (i = oPointData.length - 1; i >= 0; i--) {
                    if (i === 0) {
                        aPoints.push(oPointData[i].getHigh());
                        aPoints.push(oPointData[i].getLow());

                        aMidPoints.push(oPointData[i].getText1());

                        break;
                    }

                    if (oPointData[i].getLow() === oPointData[i - 1].getHigh()) {
                        aPoints.push(oPointData[i].getHigh());

                        aMidPoints.push(oPointData[i].getText1());
                    } else {
                        break;
                    }
                }
            }

            for (i = 0; i < aPoints.length; ++i) {

                if (i < aMidPoints.length && (!bRange || (bRange && bText))) {
					
                    var iYOffset = 0.9; 
                    if (bRange && bText) {
                        iYOffset = 0.8;
                    }
					
                    var aWords = aMidPoints[i].split(" "),
                        iVertOffset = 0;
					
                    for (j = 0; j < aWords.length; ++j) {
                        sHtml += "<text text-anchor=\"end\" x=\"" + iMidPointXVal + "\"" +
						"y=\"" + (((i + iYOffset) * 100) + iVertOffset) + "\" >" + aWords[j] + "</text>";
						
                        iVertOffset += 13;
                    }
					
                    if (this._yPointsMaxVertOffset < iVertOffset) {
                        this._yPointsMaxVertOffset = iVertOffset;
                    }
					
                    // sHtml += "<text text-anchor=\"end\" x=\"" + iMidPointXVal + "\"" +
                    // 	"y=\"" + ((i + iYOffset) * 100) + "\" >" + aMidPoints[i] + "</text>";
                }

                if (!bText) {
                    sHtml += "<text text-anchor=\"middle\" class=\"asIntRbiRMYLabelPoint\" x=\"" + iPointXVal + "\" y=\"" + (((i + (bRange ? 0.9 :
                        0.35)) * 100) + iVertOffset) + "\">" + aPoints[i] + "</text>";
                } else if (bRange && bText) {
                    iPointXVal = iMidPointXVal;
					
                    sHtml += "<text text-anchor=\"end\" class=\"asIntRbiRMYLabelPoint\" x=\"" + iPointXVal + "\" y=\"" + (((i + (bRange ? 1 :
                        0.35)) * 100) + iVertOffset) + "\">" + aPoints[i] + "</text>";
                }
            }

            return sHtml;
        },

        /**
		 * @description Function to build the SVG matrix grid's X-Axis labels
		 *
		 * @author      MM0477
		 * @veriosn     1.0.2
		 * @since       1.0
		 * 
		 * @param       {number} iAxis Indicator as we can have upto two separate x-axis
		 * 
		 * @returns     {string} String of the SVG HTML that will render the x-axis
		 */
        fnBuildYLabels: function (iAxis) {

            var sHtml = "",
                sLabelText;

            var iXOF = 1.8;
            if (this.getAggregation("yAxisData") !== null && typeof this.getAggregation("yAxisData")[1] !== "undefined") {
                iXOF = 2.8;
            }

            if (iAxis === 1) {
                sLabelText = this.getAggregation("yAxisData")[0].getAxisDesc();

                sHtml += "<text text-anchor= \"middle\" transform=\"rotate(270, " + ((iXOF - 1.3) * 100) + ", " + (((this.getRows() / 2) + 0.3) *
						100) + ")\"" +
					"class=\"asintRbiLabelText\"" +
					"font-size=\"21px\"" +
					"x=\"" + ((iXOF - 1.3) * 100) + "\"" +
					"y=\"" + ((((this.getRows() / 2) + 0.3) * 100) + this._yPointsMaxVertOffset) + "\">" +
					sLabelText +
					"</text>";
            } else {
                sLabelText = this.getAggregation("yAxisData")[1].getAxisDesc();

                sHtml += "<text text-anchor=\"middle\" transform=\"rotate(270, " + ((iXOF - 2.8) * 100) + ", " + (((this.getRows() / 2) + 0.3) *
						100) + ")\"" +
					"class=\"asintRbiLabelText\"" +
					"font-size=\"21px\"" +
					"x=\"" + ((iXOF - 2.8) * 100) + "\"" +
					"y=\"" + ((((this.getRows() / 2) + 0.5) * 100) + this._yPointsMaxVertOffset) + "\">" +
					sLabelText +
					"</text>";
            }

            return sHtml;
        },

        /**
		 * @description Defines the plotting algorithm, a simple step based
		 *               division is used to plot the points bounded in the SVG grid
		 * 
		 * @param       {number}  iScrX         X Coordinate of the point to be plotted
		 * @param       {number}  iScrY         Y Coordinate of the point to be plotted
		 * @param       {number}  iXAxis        Identifies the number of X-Axis ie, x1 or x2
		 * @param       {number}  iYAxis        Identifies the number of Y-Axis ie, y1 or y2
		 * @param       {number}  iStepSize     The number of divisions for a singel cell
		 * @param       {boolean} bUseAxisLabel To use axis labels instead of values or not
		 * 
		 * @returns     {object} Code points that can be used to plot on the Grid 
		 */
        fnPlotPoints: function (iScrX, iScrY, iXAxis, iYAxis, iStepSize, bUseAxisLabel) {

            var aBox = [], // The box in which our point resides
                oXAxisData,
                oYAxisData;

            // if (iXAxis !== "0" && iXAxis !== "1") {
            oXAxisData = this.getAggregation("xAxisData").filter(function (oElem) {
                return oElem.getAxisKey() === iXAxis;
            })[0];
            // }

            // if (iYAxis !== "0" && iYAxis !== "1") {
            oYAxisData = this.getAggregation("yAxisData").filter(function (oElem) {
                return oElem.getAxisKey() === iYAxis;
            })[0];
            // }
			
            if(oXAxisData && oYAxisData) {
			
                var oXPoints = oXAxisData.getAggregation("axisValues"),
                    sTempScrX = iScrX;
	
                if (iScrX === "undefined" || isNaN(iScrX)) {
                    sTempScrX = oXPoints[0].getLow();
                }
	
                if (iScrX > oXPoints[oXPoints.length - 1].getHigh()) {
                    sTempScrX = oXPoints[oXPoints.length - 1].getHigh();
                } else if (iScrX < oXPoints[0].getLow()) {
                    sTempScrX = oXPoints[0].getLow();
                }
	
                $.each(oXAxisData.getAggregation("axisValues"), function (iDx, oValue) {
                    if (sTempScrX >= oValue.getLow()) {
                        aBox[0] = iDx;
                    }
                });
	
                var oYPoints = oYAxisData.getAggregation("axisValues").reverse(),
                    sTempScrY = iScrY;
	
                if (iScrY === "undefined" || isNaN(iScrY)) {
                    sTempScrY = oYPoints[oYPoints.length - 1].getLow();
                }
	
                if (iScrY > oYPoints[0].getHigh()) {
                    sTempScrY = oYPoints[0].getHigh();
                } else if (iScrY < oYPoints[oYPoints.length - 1].getLow()) {
                    sTempScrY = oYPoints[oYPoints.length - 1].getLow();
                }
	
                $.each(oYPoints, function (iDx, oValue) {
                    if (oValue && sTempScrY <= oValue.getHigh()) {
                        aBox[1] = iDx;
                    }
                });
	
                // We calculate screen step size now
                var iXRange = oXPoints[aBox[0]].getHigh() - oXPoints[aBox[0]].getLow(),
                    iYRange = oYPoints[aBox[1]].getHigh() - oYPoints[aBox[1]].getLow();
	
                var iScrStepX = iXRange / iStepSize,
                    iScrStepY = iYRange / iStepSize;
	
                // Heavy lifting time, calculating code step
                var i = 0,
                    iTemp = oXPoints[aBox[0]].getLow();
	
                while (iTemp < sTempScrX) {
                    iTemp += iScrStepX;
	
                    i += 1;
                }
	
                var iXOf = 1.7;
                if (this.getAggregation("yAxisData") !== null && typeof this.getAggregation("yAxisData")[1] !== "undefined") {
                    iXOf = 2.7;
                }
	
                var codeStepX = ((parseFloat(aBox[0], 10) + iXOf) * 100) + i;
	
                i = 0;
                iTemp = oYPoints[aBox[1]].getHigh();
	
                while (iTemp > sTempScrY) {
                    iTemp -= iScrStepY;
	
                    i += 1;
                }
	
                var codeStepY = ((parseFloat(aBox[1], 10) + 0.3) * 100) + i;
				
                if (bUseAxisLabel) {
                    return [codeStepX, codeStepY, oXPoints[aBox[0]].getText1(), oYPoints[aBox[1]].getText1(), oXAxisData.getAxisDesc(), oYAxisData.getAxisDesc()];
                } else {
                    return [codeStepX, codeStepY, "", "", "", ""];
                }
			
            } else {
                return [0, 0, "", "", "", ""];
            }
			
        },

        /**
		 * @description To build the configured risk lines on the SVG Grid
		 * 
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 * 
		 * @return      {string} Prepared HTML of the risk lines
		 */
        fnBuildRiskLines: function () {

            var codeCoordsStart = [],
                codeCoordsEnd = [],
                sHtml = "";

            $.each(this.getAggregation("riskLines"), function (iDx) {
                var $riskLine = $(this)[0].getAggregation("riskLines")[iDx];

                codeCoordsStart = this.fnPlotPoints($riskLine.getStartX(), $riskLine.getStartY(),
                    $riskLine.getXAxisName(), $riskLine.getYAxisName(), 100);
                codeCoordsEnd = this.fnPlotPoints($riskLine.getEndX(), $riskLine.getEndY(),
                    $riskLine.getXAxisName(), $riskLine.getYAxisName(), 100);

                sHtml += "<line x1=\"" + codeCoordsStart[0] + "\" y1=\"" + codeCoordsStart[1] + "\"" +
					"x2=\"" + codeCoordsEnd[0] + "\" y2=\"" + codeCoordsEnd[1] + "\" stroke=\"" + $riskLine.getColor() + "\" stroke-width=\"3\" />";
            }.bind(this));

            return sHtml;
        },
		
        /**
		 * @description To render plot points on the SVG grid
		 * 
		 * @return      {string} SVG Markup for plot points 
		 * 
		 * @since       1.0
		 * @version     1.0
		 * @author      MM0477
		 */
        fnBuildPlotValues: function () {

            var aCodeCoords = [],
                sPointHtml  = "",
                sLabelHtml  = "";
			
            $.each(this.getAggregation("plotPoints"), function (iDx) {
                var $plotPoint = $(this)[0].getAggregation("plotPoints")[iDx];

                var xTooltipVal = "",
                    yTooltipVal = "";
					
                var xTooltipLabel = "",
                    yTooltipLabel = "";
					
                if (typeof $plotPoint.getPointX() !== "undefined" && !isNaN($plotPoint.getPointX()) &&
					typeof $plotPoint.getPointY() !== "undefined" && !isNaN($plotPoint.getPointY())) {
                    aCodeCoords = this.fnPlotPoints($plotPoint.getPointX(), $plotPoint.getPointY(),
                        $plotPoint.getAxisX(), $plotPoint.getAxisY(), 100, $plotPoint.getUseAxisLabels());

                    if ($plotPoint.getUseAxisLabels()) {
                        // xTooltipLabel = aCodeCoords[4];
                        // yTooltipLabel = aCodeCoords[5];
						
                        // xTooltipVal = aCodeCoords[2];
                        // yTooltipVal = aCodeCoords[3];
						
                        if($plotPoint.getXAxisPointText()){
                            xTooltipLabel = $plotPoint.getXAxisPointText();
                            xTooltipVal = aCodeCoords[2];
                        }else{
                            xTooltipLabel = $plotPoint.getXTooltip();
                            xTooltipVal = $plotPoint.getPointX();
                        }
						
                        if($plotPoint.getYAxisPointText()){
                            yTooltipLabel = $plotPoint.getYAxisPointText();
                            yTooltipVal = aCodeCoords[3];
                        }else{
                            yTooltipLabel = $plotPoint.getYTooltip();
                            yTooltipVal = $plotPoint.getPointY();
                        }
						
                    } else {
                        xTooltipVal = $plotPoint.getPointX();
                        yTooltipVal = $plotPoint.getPointY();
						
                        xTooltipLabel = $plotPoint.getXTooltip();
                        yTooltipLabel = $plotPoint.getYTooltip();
                    }

                    sPointHtml += "<circle cx=\"" + aCodeCoords[0] + "\" cy=\"" + aCodeCoords[1] + "\" r=\"6\" fill=\"" + $plotPoint.getColor() +
						"\" class=\"idAsIntRbiRiskPoint\" stroke-width=\"1\" stroke=\"#000000\" id = \"asIntRbiRMatPlotIdentifier-"  + this.fnStringToCharCode($plotPoint.getColor()) + "-plot\">" +
						"<title>" + xTooltipLabel + ": " + xTooltipVal + "\n" + yTooltipLabel + ": " + yTooltipVal + "</title>" +
						"</circle>";
					
                    sLabelHtml += this.fnBuildPointLabels($plotPoint, [xTooltipLabel, xTooltipVal, yTooltipLabel, yTooltipVal]);
                }
            }.bind(this));

            return [sPointHtml, sLabelHtml];
        },

        /**
		 * @description Function to build point labels for Risk Matrix
		 *              for the user's reference
		 * 
		 * @param       {object} oPlotPoint Point Data from Aggregation
		 * @param       {array}  aLabelData Value Data from Aggregation
		 * 
		 * @return      {string} Markup for the label information
		 * 
		 * @since       1.0
		 * @version     1.0
		 * @author      MM0477
		 */
        fnBuildPointLabels: function (oPlotPoint, aLabelData) {

            var sHtml = "",
                sBlckColor = "#000000";

            if (oPlotPoint.getPointDesc() !== "") {				
                sHtml += "<div class = \"PlotIdentifier\" id = \"asIntRbiRMatPlotIdentifier-" + this.fnStringToCharCode(oPlotPoint.getColor()) + "\">" +
					"<div class = \"plotLableCircle\" style=\"background-color:" + oPlotPoint.getColor() + "\"></div>" +
					"<span style=\"color:" + oPlotPoint.getColor() + "\">" + oPlotPoint.getPointDesc() + "</span>" +
					"<div style=\"color: " + oPlotPoint.getColor() + ";margin-left:2rem;font-size:0.9rem;\">" + aLabelData[0] + " = <b style=\"color:" + sBlckColor + ";\">" 
					+ aLabelData[1] + "</b></div>" +
					"<div style=\"color: " + oPlotPoint.getColor() + ";margin-left:2rem;font-size:0.9rem;\">" + aLabelData[2] + " = <b style=\"color:" + sBlckColor + ";\">" 
					+ aLabelData[3] + "</b></div>" +
					"</div>";
            }

            return sHtml;
        },

        /**
		 * @description Called after the Custom Control has been rendered onto the 
		 *              DOM, allows us to use jQuery on the control easily
		 * 
		 * @author      MM0477
		 * @version     1.0
		 * @since       1.0
		 */
        onAfterRendering: function () {
            var that = this;
            var sClass = ".__asintRbiRiskMatrix_" + this.getIndex(),
                sRegExp = /[^0-9A-Za-z- _.]/;
            if (!sRegExp.test(sClass)) {
                $(sClass).find("rect").each(function (idx) {
                    $(sClass).find("rect")[idx].setAttribute("fill", this.fnHtmlEscape("#FFFFFF"));
                    var oCells = this.getAggregation("cells");

                    if (oCells) {
                        oCells.sort(function (oElem1, oElem2) {
                            return oElem1.getIndex() - oElem2.getIndex();
                        });

                        for (var i in oCells) {
                            if (oCells[i].getIndex() === idx) {
                                var $rect = $(sClass).find("rect")[idx];
                                var $text = $(sClass).find("text")[idx];
                                $rect.setAttribute("fill", this.fnHtmlEscape(oCells[i].getColor()));
                                if($rect && oCells[i].getHighlight() === true){
                                    $($rect).css("stroke-width",6);
                                }
                                if($text && oCells[i].getText()) {
                                    $text.textContent = oCells[i].getText();
                                }

                            }
                        }
                    }
                }.bind(this));
            }
			
            $(".asintRbiCustomRiskMatrixLabel div.PlotIdentifier,.idAsIntRbiRiskPoint").on("mouseenter", function () {
                var plotIdentifierLabelId, plotIdentifierMatrixClass, $targetMatrixPlotPointLabel, $targetMatrixPlotPoint, transformOrigin, oPlotStyles, startEle, endEle, plotColorCode;
                var oLabelStyles = {
                    "transform": "scale(1.5)",
                    "transition": "transform .2s"
                };
                if($(this).hasClass("PlotIdentifier")){
                    plotIdentifierLabelId = this.id;
                    plotIdentifierMatrixClass = plotIdentifierLabelId + "-plot";
                    $targetMatrixPlotPoint = $("circle[id=\"" + plotIdentifierMatrixClass + "\"]");
                    transformOrigin = $targetMatrixPlotPoint.attr("cx") + "px" + " " + $targetMatrixPlotPoint.attr("cy") + "px";
                    oPlotStyles = {
                        "z-index": "999999",
                        "transform": "scale(2)",
                        "transition": "transform .2s",
                        "transform-origin":transformOrigin
                    };
                    $("#" + plotIdentifierLabelId + " div.plotLableCircle").css(oLabelStyles);
                    $targetMatrixPlotPoint.css(oPlotStyles);
                    startEle = document.querySelector("#" + plotIdentifierLabelId + " div.plotLableCircle");
                    endEle = document.querySelector("#" + plotIdentifierMatrixClass);
                    plotColorCode = $("#" + plotIdentifierLabelId + " div.plotLableCircle").css("background-color");
                }else if($(this).hasClass("idAsIntRbiRiskPoint")){
                    plotIdentifierLabelId = this.id;
                    plotIdentifierMatrixClass = plotIdentifierLabelId.replace("-plot","");
                    $targetMatrixPlotPointLabel = $("#"+plotIdentifierMatrixClass + " .plotLableCircle")[0];
                    $targetMatrixPlotPoint = $("circle[id=\"" + plotIdentifierLabelId + "\"]");
                    transformOrigin = $targetMatrixPlotPoint.attr("cx") + "px" + " " + $targetMatrixPlotPoint.attr("cy") + "px";
                    oPlotStyles = {
                        "z-index": "999999",
                        "transform": "scale(1.5)",
                        "transition": "transform .2s"
                    };
                    oLabelStyles = {
                        "transform": "scale(2)",
                        "transition": "transform .2s",
                        "z-index": "999999",
                        "transform-origin": transformOrigin
                    };
                    $("#" + plotIdentifierLabelId).css(oLabelStyles);
                    $($targetMatrixPlotPointLabel).css(oPlotStyles);
                    startEle = document.querySelector("#" + plotIdentifierLabelId);
                    endEle = $targetMatrixPlotPointLabel;
                    plotColorCode = $("#" + plotIdentifierLabelId).css("fill");
                }	
                var oCoordinate = that.fnGetCoordinates(startEle, endEle);
                var lineStyle = that.fnPlotPointsConnect(oCoordinate.x1, oCoordinate.y1, oCoordinate.x2, oCoordinate.y2, plotColorCode);
                $("#line").remove();
                $("body").append(lineStyle);
                var style = $("#line")[0].style;
                style.setProperty("color",plotColorCode);
            });
			
            $(".asintRbiCustomRiskMatrixLabel div.PlotIdentifier,.idAsIntRbiRiskPoint").on("mouseleave", function () {
                var plotIdentifierLabelId, plotIdentifierMatrixClass, $targetMatrixPlotPointLabel, $targetMatrixPlotPoint, transformOrigin, oPlotStyles;
                var oLabelStyles = {
                    "transform": "unset",
                    "transition": "transform .2s"
                };
                if($(this).hasClass("PlotIdentifier")){
                    plotIdentifierLabelId = this.id;
                    plotIdentifierMatrixClass = plotIdentifierLabelId + "-plot";
                    $targetMatrixPlotPoint = $("circle[id=\"" + plotIdentifierMatrixClass + "\"]");
                    transformOrigin = $targetMatrixPlotPoint.attr("cx") + "px" + " " + $targetMatrixPlotPoint.attr("cy") + "px";
                    oPlotStyles = {
                        "z-index": "999999",
                        "transform": "unset",
                        "transition": "transform .2s",
                        "transform-origin":transformOrigin
                    };
                    $("#" + plotIdentifierLabelId + " div.plotLableCircle").css(oLabelStyles);
                    $targetMatrixPlotPoint.css(oPlotStyles);
                }else if($(this).hasClass("idAsIntRbiRiskPoint")){
                    plotIdentifierLabelId = this.id;
                    plotIdentifierMatrixClass = plotIdentifierLabelId.replace("-plot","");
                    $targetMatrixPlotPointLabel = $("#"+plotIdentifierMatrixClass + " .plotLableCircle")[0];
                    $targetMatrixPlotPoint = $("circle[id=\"" + plotIdentifierLabelId + "\"]");
                    transformOrigin = $targetMatrixPlotPoint.attr("cx") + "px" + " " + $targetMatrixPlotPoint.attr("cy") + "px";
                    oPlotStyles = {
                        "z-index": "999999",
                        "transform": "unset",
                        "transition": "transform .2s"
                    };
                    oLabelStyles = {
                        "transform": "unset",
                        "transition": "transform .2s",
                        "transform-origin": transformOrigin
                    };
                    $("#" + plotIdentifierLabelId).css(oLabelStyles);
                    $($targetMatrixPlotPointLabel).css(oPlotStyles);
                }
                $("#line").remove();
            });
			
            that.fnHandleScrollDelegate($(".asintRbiCustomRiskMatrix")[0]);
        },
		
        /**
		 * @description Function to escape HTML Chartacters
		 * @param {String} sInput Input String 
		 * @returns {String} Output String 
		 */
        fnHtmlEscape: function (sInput) {
            return String(sInput)
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        },

        /**
		 * @description Renders the Custom Control's HTML onto the DOM, we define the
		 *              structure of the Control here along with the SVG code
		 *
		 * @author      M0477
		 * @version     1.0
		 * @since       1.0
		 * 
		 * @param       {sap.ui.core.RenderManager} oRm      Renders data onto the DOM
		 * @param       {sap.ui.core.Control}       oControl Object referring to the custom control's data
		 */
        renderer: function (oRm, oControl) {

            var iSvgHeight = (oControl.getRows() + 2.3) * 100,
                iSvgWidth = 0;

            if (oControl.getAggregation("yAxisData") !== null && typeof oControl.getAggregation("yAxisData")[1] !== "undefined") {
                iSvgWidth = (oControl.getCols() + 3.3) * 100;
            } else {
                iSvgWidth = (oControl.getCols() * 4.2) * 100;
            }

            var sGridHtml = oControl.fnBuildMatrixGrid();

            var sXLabelHtml = "";
            if (oControl.getAggregation("xAxisData") && oControl.getAggregation("xAxisData").length > 0) {
                sXLabelHtml += oControl.fnBuildXAxisPoints(1);
                sXLabelHtml += oControl.fnBuildXLabels(1);

                if (oControl.getAggregation("xAxisData")[1]) {
                    sXLabelHtml += oControl.fnBuildXAxisPoints(2);
                    sXLabelHtml += oControl.fnBuildXLabels(2);
                }
            }

            var sYLabelHtml = "";
            if (oControl.getAggregation("yAxisData") && oControl.getAggregation("yAxisData").length > 0) {
                sYLabelHtml += oControl.fnBuildYAxisPoints(1);
                sYLabelHtml += oControl.fnBuildYLabels(1);

                if (oControl.getAggregation("yAxisData")[1]) {
                    sYLabelHtml += oControl.fnBuildYAxisPoints(2);
                    sYLabelHtml += oControl.fnBuildYLabels(2);
                }
            }

            if (oControl.getAggregation("riskLines") &&
				oControl.getAggregation("riskLines").length > 0 &&
				oControl.getAggregation("xAxisData") &&
				oControl.getAggregation("xAxisData").length > 0 &&
				oControl.getAggregation("yAxisData") &&
				oControl.getAggregation("yAxisData").length > 0) {
                var sRiskLineHtml = oControl.fnBuildRiskLines();
            }

            if (oControl.getAggregation("plotPoints")) {
                var allPointHtml = oControl.fnBuildPlotValues();
				
                var sPointHtml = allPointHtml[0],
                    sLabelHtml = allPointHtml[1];
            }

            if (typeof oControl.getCols() === "undefined" || typeof oControl.getRows() === "undefined") {
                iSvgHeight = 0;
                iSvgWidth = 0;
            }

            var sMatrixHtml = "<div class=\"asintRbiRMatWrap\">" +
				"<svg version=\"1.2\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"" +
				" viewbox=\"0 0 " + iSvgWidth + " " + iSvgHeight + "\" role=\"img\">" +
				"<g class=\"asIntRbiRMatGrid\">" +
				sGridHtml +
				"</g>" +
				"<g>" +
				sXLabelHtml +
				"</g>" +
				"<g>" +
				sYLabelHtml +
				"</g>" +
				"<g>" +
				sRiskLineHtml +
				"</g>" +
				"<g id=\"plotCircles\">" +
				sPointHtml +
				"</g>" +
				"</svg>" +
				"</div>";

            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("asintRbiCustomRiskMatrix");
            oRm.addClass("__asintRbiRiskMatrix_");
            oRm.addClass("__asintRbiRiskMatrix_" + oControl.getProperty("index"));
            oRm.writeClasses();
            oRm.write(">");
            oRm.write(sMatrixHtml);
            oRm.write("<div");
            oRm.addClass("asintRbiCustomRiskMatrixLabel");
            oRm.writeClasses();
            oRm.write(">");

            if (typeof sLabelHtml !== "undefined") {
                oRm.write(sLabelHtml);
            }

            oRm.write("</div>");
            oRm.write("</div>");
        },
		
        /**
		 * @description It returns the Start and End points based on Window
		 *
		 * @author      vignesh.ks@asint.net
		 *
		 * @param       startPt            {Integer} Input Integer
		 * @param       endPt              {Integer} Input Integer
		 *
		 * @returns     oPlotPoints        {Object} Output Object
		 */
        fnGetCoordinates : function (startEle, endEle) {
            var startPt = startEle.getBoundingClientRect();
            var endPt = endEle.getBoundingClientRect();
			
            // Center of the Circle / Plot Points
            var startWidth = startPt.width / 2; 
            var startHeight = startPt.height / 2;
            var endWidth = endPt.width / 2;
            var endHeight = endPt.height / 2;
			
            var oPlotPoints = {x1: startPt.left + startWidth, y1: startPt.top + startHeight, x2:endPt.left + endWidth, y2:endPt.top + endHeight};
            return oPlotPoints;
        },
		
        /**
		 * @description It Draw the line between two selected points in matrix from Legent text to plot points
		 *
		 * @author      vignesh.ks@asint.net
		 *
		 * @param       x1             {Integer} Input - Start Point Left
		 * @param       y1             {Integer} Input - Start Point Top
		 * @param       x2             {Integer} Input - End Point Left
		 * @param       y2             {Integer} Input - End Point Top
		 * @param    	plotColorCode  {String} Input String - Color of selected element
		 *
		 * @returns		Create a DIV element and draw the line with CSS.
		 */
        fnPlotPointsConnect : function(x1, y1, x2, y2, plotColorCode){
            var distance = Math.sqrt( ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)) );
            var xmid = (x1 + x2) / 2;
            var ymid = (y1 + y2) / 2;
            var Rad = Math.atan2((y1 - y2), (x1 - x2));
            var deg = (Rad * 180) / Math.PI; 
            return "<div class=\"plotLine\" id=\"line\" style=\"width:"+(distance-8)+"px;top:"+ymid+"px;left:"+((xmid - (distance / 2))+3)+"px;background:"+plotColorCode+";transform:"+"rotate("+deg+"deg);\"></div>";
        },
		
        /**
		 * @description It returns the char code of the given string
		 *              Color code of the Matrix Label text circle and Plot point circle.
		 *
		 * @author      vignesh.ks@asint.net
		 *
		 * @param       sValue    {String} Input String - Color code
		 *
		 * @returns     CharCode  {Integer} Output Interger
		 */
        fnStringToCharCode: function (sValue) {
            var CharCode = "";
            for(var i = 0; i <= sValue.length - 1; i++)
            {
                CharCode = CharCode + sValue.charCodeAt(i);
            }
            return CharCode;
        },
		
        /**
		 * @description It removes the line and circle / plot point scaling bigger on hover scroll
		 *
		 * @author      vignesh.ks@asint.net
		 *
		 * @param       currentElement    {Object} Input Object - Current Element Parent
		 *
		 */
        fnHandleScrollDelegate : function (currentElement) {
            if(currentElement){
                var scrollDelegate = false;
                /**
				 * To check the controll has scroll event or not
				 * @param {Object} oControl 
				 * @returns {Object} 
				 */
                var fnFindUI5ScrollDelegate = function (oControl){
                    if(oControl.getScrollDelegate && oControl.getScrollDelegate()){
                        return oControl.getScrollDelegate();
                    }else{
                        return oControl.getParent() ? fnFindUI5ScrollDelegate(oControl.getParent()) : false;
                    }
                };
                /**
				 * To find the nearest UI5 controls 
				 * @param {Object} oElement 
				 * @returns {Object} nearest control
				 */
                var fnFindUI5Control =  function (oElement){
                    if(oElement.hasAttribute("data-sap-ui")){
                        return sap.ui.getCore().byId(oElement.id);
                    }else{
                        return fnFindUI5Control(oElement.parentElement);
                    }
                };
                var oNearestUI5Control = fnFindUI5Control(currentElement);
                if(oNearestUI5Control){
                    scrollDelegate = fnFindUI5ScrollDelegate(oNearestUI5Control);
                    if(scrollDelegate && scrollDelegate.getContainerDomRef()){
                        scrollDelegate.getContainerDomRef().addEventListener("scroll", function() {
                            if($("#line")){
                                $("#line").remove();
                                var oLabelStyles = {
                                    "transform": "unset",
                                    "transition": "transform .2s"
                                };
                                $("circle").css(oLabelStyles);
                                $(".plotLableCircle").css(oLabelStyles);
                            }
                        });
                    }
                }
            }
        },
    });
});