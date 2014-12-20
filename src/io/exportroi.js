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

    var dataWidth = app.GetDataWidth();
    var dataHeight = app.GetDataHeight();

    var tempStage = new Kinetic.Stage({
            container: 'hiddencanvas',
            width: dataWidth,
            height: dataHeight,
            listening: false
    });
    var tempLayer = new Kinetic.Layer({
        listening: false,
        hitGraphEnabled: false,
        visible: true
    });
    tempStage.add(tempLayer);


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

            var cloneShape = currentShape.clone();
            cloneShape.stroke('white');
            cloneShape.fill('white');
            cloneShape.strokeWidth(0);
            //tempLayer.getCanvas().getContext().clearRect(0, 0, dataWidth, dataHeight);
            tempLayer.add(cloneShape);
            tempLayer.draw();
            cloneShape.remove();

            // Get parametric map layer
            var paraMapData = medianViewer.getParametricMapData();
            var paraValue = '';
            if (typeof paraMapData != 'undefined') {
                paraMapData.SetColumns(dataWidth);
                paraMapData.SetRows(dataHeight);

                // Iterate over temp canvas
                var context = tempLayer.getCanvas().getContext();
                var imgData = context.getImageData(0, 0, dataWidth, dataHeight);
                var index = 0, weight = 0, sum = 0;
                for (var r = 0; r < dataHeight; ++r) {
                    for (var c = 0; c < dataWidth; ++c) {
                        // Red channel

                        if (imgData.data[index * 4] > 0) {
                            // Find parametric map value
                            sum += paraMapData.GetInterpolatedScaledImageData(c,r);
                            ++weight;
                        }
                        /*
                        imgData.data[index * 4] = paraMapData.GetInterpolatedScaledImageData(c,r) *10;
                        imgData.data[index * 4 + 1] = paraMapData.GetInterpolatedScaledImageData(c,r) *10;
                        imgData.data[index * 4 + 2] = paraMapData.GetInterpolatedScaledImageData(c,r) *10;
                        imgData.data[index * 4 + 3] = 255;
                        */
                        ++index;
                    }
                }
                //tempLayer.getCanvas().getContext().putImageData(imgData, 0, 0);
                console.log('Shape ' + s);
                console.log('Weight:' + weight);
                console.log('Mean: ' + sum/weight);
                if (sum > 0)
                    paraValue = sum/weight;

            }
            tempLayer.draw();

            if (currentShape.points().length > 4){
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
        }
    }


    // Now create csv file
    var output = 'Timepoint,Type,Colour,Length/Area(mm),Mean Parametric Map Value,Points\n';
    for (var i = 0; i < allLayers.length; ++i) {

            for (var r = 0; r < allLayers[i].Lines.length; ++r) {
                output += i + ',Line,' + allLayers[i].Lines[r].colour + ',' + allLayers[i].Lines[r].length.match(/[0-9\.e\+]+/) + ',' + allLayers[i].Lines[r].paraValue;
                for (var p = 0; p < allLayers[i].Lines[r].points.length; ++p) {
                    for (var x = 0; x < allLayers[i].Lines[r].points[p].length; ++x) {
                        output += ',' + allLayers[i].Lines[r].points[p][x];
                    }
                }
                output += '\n';
            }

            for (var r = 0; r < allLayers[i].ROIs.length; ++r) {
                output += i + ',ROI,' + allLayers[i].ROIs[r].colour + ',' + parseFloat(allLayers[i].ROIs[r].area.match(/[0-9\.e\+]+/)).toFixed(1)  + ',' + allLayers[i].ROIs[r].paraValue;
                for (var p = 0; p < allLayers[i].ROIs[r].points.length; ++p) {
                    for (var x = 0; x < allLayers[i].ROIs[r].points[p].length; ++x) {
                        output += ',' + allLayers[i].ROIs[r].points[p][x];
                    }
                }
                output += '\n';
            }
    }

    var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "ROIs.csv");

};
