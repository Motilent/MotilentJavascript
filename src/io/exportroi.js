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
    this.onload = null;
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
    this.id = null;
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
        str += this.id + ',';
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

    this.GenerateEntryFromTextLine = function(line) {
        var c = 0;
        var lineArr = line.split(',');
        this.id = parseInt(lineArr[c++], 10);
        this.timepoint = parseInt(lineArr[c++], 10);
        this.type = lineArr[c++];
        this.colour = lineArr[c++];
        this.length = parseFloat(lineArr[c++]);
        this.area = parseFloat(lineArr[c++]);
        this.numberofpoints = parseInt(lineArr[c++], 10);
        for (var i = 0; i < dwv.io.ExportROI.MAXMAPS; ++i)
            this.parametricmapvalues[i] = parseFloat(lineArr[c++]);
        for (var i = 0; i < dwv.io.ExportROI.MAXMAPS; ++i)
            this.parametricmapnames[i] = parseFloat(lineArr[c++]);

        for (var p = 0; p < this.numberofpoints; ++p) {
            var slicePoint = [];
            slicePoint.push(parseFloat(lineArr[c++]));
            slicePoint.push(parseFloat(lineArr[c++]));
            this.slicepoints.push(slicePoint);
        }

        for (var p = 0; p < this.numberofpoints; ++p) {
            var realPoint = [];
            realPoint.push(parseFloat(lineArr[c++]));
            realPoint.push(parseFloat(lineArr[c++]));
            realPoint.push(parseFloat(lineArr[c++]));
            this.realpoints.push(realPoint);
        }
    }
};


/**
 * Load ROIs from file
 * @method load
 * @param Blob file The file to load.
 */

dwv.io.ExportROI.prototype.load = function(file){
    var onload = this.onload;
    var onerror = this.onerror;

    // Request error
    var onErrorReader = function(event)
    {
        onerror( {'name': "RequestError",
            'message': "An error occurred while reading the ROI file: "+event.getMessage() } );
    };

    // CSV reader loader
    var onLoadReader = function(event)
    {
        // parse DICOM file
        try {
            var tmpdata = event.target.result;

            // Load from text file
            var lineArray = tmpdata.match(/[^\r\n]+/g);

            // Process csv file
            var csvEntries = [];
            for (var i = 1; i < lineArray.length; ++i){
                var csvE = new dwv.io.ExportROI.RoiCSVEntry();
                csvE.GenerateEntryFromTextLine(lineArray[i]);
                csvEntries.push(csvE);
            }

            // call listener
            onload(csvEntries);
        } catch(error) {
            onerror(error);
        }

        var endEvent = {lengthComputable: true, loaded: 1, total: 1};
        dwv.gui.updateProgress(endEvent);

    };

    var fr = new FileReader();
    fr.onload = onLoadReader;
    fr.onprogress = dwv.gui.updateProgress;
    fr.onerror = onErrorReader;
    fr.readAsText(file);

};


/**
 * Save ROIs to file
 * @method save
 */

dwv.io.ExportROI.prototype.save = function()
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
            entry.id = roiEntries[r].id;
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
