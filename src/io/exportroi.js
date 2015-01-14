/**
 * I/O module
 * @module io
 */

var dwv = dwv || {};
dwv.io = dwv.io || {};

var motilityDrawTool = null;
var medianDrawTool = null;


/**
 * ROI exporter
 * @class ExportROI
 * @namespace dwv.io
 * @constructor
 */

dwv.io.ExportROI = function()
{
    this.onsave = null;
    this.onerror = null;
    this.motilityDrawTool = null;
    this.medianDrawTool = null;
};

/**
 * Set the motility and median draw tool from which to extract ROIs (do in applauncher.js)
 * @static
 * @param motDraw
 * @param medDraw
 */
dwv.io.ExportROI.staticSetDrawTools = function(motDraw,medDraw) {
    motilityDrawTool = motDraw;
    medianDrawTool = medDraw;
};

dwv.io.ExportROI.MAXMAPS = 10;

/**
 * Create an empty RoiCSVEntry
 */
dwv.io.ExportROI.RoiCSVEntry = function(){
    this.timepoint = null;
    this.type = null;
    this.colour = null;
    this.length = null;
    this.area = null;
    this.numberofpoints = null;
    this.parametricmapvalues = [];
    this.parametricmapnames = [];
    this.realpoints = [];
    this.slicepoints = [];

    for (var i = 0; i < dwv.io.ExportROI.MAXMAPS; ++i){
        this.parametricmapnames.push(null);
        this.parametricmapvalues.push(null);
    }

    this.GenerateText = function (){
        var str = '';
        str += this.timepoint + ',';
        str += this.type + ',';
        str += this.colour + ',';

        if (this.type == 'roi') {
            str += ',';
            str += this.area + ',';
        }
        else {
            str += this.length+ ',';
            str += ',';
        }
        str += this.numberofpoints + ',';
        for (var i = 0; i < dwv.io.ExportROI.MAXMAPS; ++i) {
            if (this.parametricmapvalues[i] == null)
                str += ',';
            else
                str += this.parametricmapvalues[i]+ ',';
        }
        for (var i = 0; i < dwv.io.ExportROI.MAXMAPS; ++i) {
            if (this.parametricmapnames[i] == null)
                str += ',';
            else
                str += this.parametricmapnames[i]+ ',';
        }
        for (var p = 0; p < this.slicepoints.length; ++p)
            str += this.slicepoints[p][0] + ',' + this.slicepoints[p][1] + ',';

        for (var p = 0; p < this.realpoints.length; ++p)
            str += this.realpoints[p][0] + ',' + this.realpoints[p][1] + ',' + this.realpoints[p][2] + ',';
        str += '\n';
        return str;

    };
};


/**
 * Save ROIs to file
 * @method save
 * @param string filename The filename to save to.
 */

dwv.io.ExportROI.prototype.save = function(filename)
{
    // create closure to the onload method
    var onsave = this.onsave;
    var onerror = this.onerror;

    // Extract shapes from medianImage
    var roiEntries = app.GetRoiRecord().GetROIEntryList();
    var parametricMapNames = medianViewer.GetParametricMapNames();

    if (parametricMapNames.length > 10)
        throw "Too many parametric maps. 10 maps are supported";

    var allLayers = [];

    var dataWidth = app.GetDataWidth();
    var dataHeight = app.GetDataHeight();

    var RoiCSVEntryList = [];

    for (var r = 0; r < roiEntries.length; ++r){

        var noTimePoints = roiEntries[r].GetNumberOfTimepoints();

        for (var t = 0; t < noTimePoints; ++t){

            var entry = new dwv.io.ExportROI.RoiCSVEntry();
            entry.timepoint = t;
            entry.type = roiEntries[r].GetType();
            entry.colour = roiEntries[r].GetColour();
            if (entry.type == 'line'){
                entry.length = roiEntries[r].GetMotilityShapes()[t].text.text();
                entry.length = parseFloat(entry.length.match(/[0-9\.e\+]+/)).toFixed(2);
                entry.numberofpoints = 2;
            }
            else{
                entry.area = roiEntries[r].GetMotilityShapes()[t].text.text();
                entry.area = parseFloat(entry.area.match(/[0-9\.e\+]+/)).toFixed(2);
                entry.numberofpoints = roiEntries[r].GetMotilityRoiList()[t].getPoints().length;
            }

            for (var p = 0; p < entry.numberofpoints; ++p){
                var point = roiEntries[r].GetMotilityRoiList()[t].getPoints()[p];
                entry.slicepoints.push([point.getX(), point.getY()]);
                entry.realpoints.push(app.imageToLPHCoords(point.getX()-0.5, point.getY()-0.5));
            }

            for (var n = 0; n < parametricMapNames.length; ++n) {
                entry.parametricmapnames[n] = parametricMapNames[n];
                entry.parametricmapvalues[n] = roiEntries[r].GetMedianShape().shape.parametricMapValues[n];
            }



            RoiCSVEntryList.push(entry);
            /*
            if (roiEntries[r].GetType() == 'roi'){
                var newROI = {
                    points: [],
                    colour: currentShape.stroke(),
                    area: currentText.text(),
                    paraValue: paraValue
                };
                for (var p = 0; p < currentShape.points().length; p+=2){
                    var newPoint = app.imageToLPHCoords(currentShape.points()[p]-0.5,currentShape.points()[p+1]-0.5);
                    newROI.points.push(newPoint);
                }
                allLayers[i].ROIs.push(newROI);
            }
            else{
                var newLine = {
                    points: [],
                    colour: currentShape.stroke(),
                    length: currentText.text(),
                    paraValue: paraValue
                };
                for (var p = 0; p < currentShape.points().length; p+=2){
                    var newPoint = app.imageToLPHCoords(currentShape.points()[p]-0.5,currentShape.points()[p+1]-0.5);
                    newLine.points.push(newPoint);
                }
                allLayers[i].Lines.push(newLine);
            }
            */
        }
    }


    // Now create csv file
    var output = 'Timepoint,Type,Colour,Length,Area,Number of Points,Mean Parametric Map Values,,,,,,,,,,Parametric Map Names,,,,,,,,,,Points\n';
    for (var i = 0; i < RoiCSVEntryList.length; ++i) {
        output += RoiCSVEntryList[i].GenerateText();
    }

    var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "ROIs.csv");

};
