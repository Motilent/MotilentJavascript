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
dwv.io.ExportROI.staticSetDrawTools = function(motDraw,medDraw){
    motilityDrawTool = motDraw;
    medianDrawTool = medDraw;
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
    var motilityLayers = app.getDrawLayers();
    var allLayers = [];

    // motilityLayers is array of Kinetic.Layer
    // Each layer has a children object, which is a Kinetic.Collection (Array)
    // Each Kinetic collection can be indexed to give a Kinetic.Group with two children
    // child [0] is a Kinetic.Line, child [1] is a Kinetic.Text

    for (var i = 0; i < motilityLayers.length; ++i){
        allLayers.push({
            Lines: [],
            ROIs: []
        });

        for (var s = 0; s < motilityLayers[i].children.length; ++s){
            var currentShape = motilityLayers[i].children[s].children[0];
            var currentText = motilityLayers[i].children[s].children[1];

            if (typeof currentShape === 'undefined' ||
                typeof currentText === 'undefined')
                continue;
            if (currentShape.points().length > 4){
                var newROI = {
                    points: [],
                    colour: currentShape.stroke(),
                    area: currentText.text()
                };
                for (var p = 0; p < currentShape.points().length; p+=2){
                    var newPoint = app.imageToLPHCoords(currentShape.points()[p],currentShape.points()[p+1]);
                    newROI.points.push(newPoint);
                }
                allLayers[i].ROIs.push(newROI);
            }
            else{
                var newLine = {
                    points: [],
                    colour: currentShape.stroke(),
                    length: currentText.text()
                };
                for (var p = 0; p < currentShape.points().length; p+=2){
                    var newPoint = app.imageToLPHCoords(currentShape.points()[p],currentShape.points()[p+1]);
                    newLine.points.push(newPoint);
                }
                allLayers[i].Lines.push(newLine);
            }
        }
    }
};
