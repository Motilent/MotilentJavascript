/**
 * Parametric map module.
 * @module deformationfield
 */
var dwv = dwv || {};
dwv.parametricmap = dwv.parametricmap || {};

/**
 * Parametric map data class.
 * @class ParametricMapData
 * @namespace dwv.parametricmap
 * @constructor
 * @param number noColumns The number of deformation map columns.
 * @param number noRows The number of deformation map rows.
 * @param Float32Array floatArray The data array.
 * @param String mapName The name of the parametric map
 */

dwv.parametricmap.ParametricMapData = function(noColumns, noRows, floatArray, mapName){

    var scaleToRows = noRows;
    var scaleToCols = noColumns;

    var maxValue = -Infinity;
    var minValue = Infinity;

    for (var i = 0; i < noColumns*noRows; ++i){
        if (floatArray[i] < minValue)
            minValue = floatArray[i];
        if (floatArray[i] > maxValue)
            maxValue = floatArray[i];
    }

    var jet = [
        {pct: 0, colour: {r: 0, g: 0, b: 131}},
        {pct: 0.125, colour: {r: 0, g: 60, b: 170}},
        {pct: 0.375, colour: {r: 5, g: 255, b: 255}},
        {pct: 0.625, colour: {r: 255, g: 255, b: 0}},
        {pct: 0.875, colour: {r: 250, g: 0, b: 0}},
        {pct: 1, colour: {r: 128, g: 0, b: 0}}];

    var percentColours = jet;

    var GetColourForPercentage = function(pct) {
        for (var i = 0; i < percentColours.length; i++) {
            if (pct <= percentColours[i].pct) {
                var lower = percentColours[i - 1] || { pct: 0.1, colour: { r: 0x0, g: 0x00, b: 0 } };
                var upper = percentColours[i];
                var range = upper.pct - lower.pct;
                var rangePct = (pct - lower.pct) / range;
                var pctLower = 1 - rangePct;
                var pctUpper = rangePct;
                var colour = {
                    r: Math.floor(lower.colour.r * pctLower + upper.colour.r * pctUpper),
                    g: Math.floor(lower.colour.g * pctLower + upper.colour.g * pctUpper),
                    b: Math.floor(lower.colour.b * pctLower + upper.colour.b * pctUpper)
                };
                return colour;
            }
        }
    };

    this.GetName = function(){
        return mapName;
    };

    var canvas = document.createElement('canvas');
    canvas.width = noColumns;
    canvas.height = noRows;

    var context = canvas.getContext('2d');
    var imgData = context.getImageData(0,0,noColumns, noRows);
    var i = 0;
    for (var r = 0; r < noRows; ++r){
        for (var c = 0; c < noColumns; ++c) {
            var ind = r + c*noRows;
            var colour = GetColourForPercentage((floatArray[ind] - minValue) / (maxValue - minValue));
            imgData.data[i * 4] = colour.r;
            imgData.data[i * 4 + 1] = colour.g;
            imgData.data[i * 4 + 2] = colour.b;
            imgData.data[i * 4 + 3] = 50;
            ++i;
        }
    }


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


    this.GetParametricMapValue = function(shape){
        var cloneShape = shape.clone();
        cloneShape.stroke('white');
        cloneShape.fill('white');
        cloneShape.strokeWidth(0);
        tempLayer.add(cloneShape);
        tempLayer.draw();
        cloneShape.remove();

        // Get parametric map layer
        var paraMapData = this;
        var paraValue = 0;
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

                    ++index;
                }
            }
            console.log('Weight:' + weight);
            console.log('Mean: ' + sum/weight);
            if (sum > 0)
                paraValue = sum/weight;

        }
        tempLayer.draw();
        return paraValue;
    };


    this.GetNumberOfRows = function(){
        return noRows;
    };

    this.GetNumberOfColumns = function(){
        return noColumns;
    };

    this.GetImageData = function(){
        return imgData;
    };
    /*
    var imageDataURL = canvas.toDataURL();
    var testImage =  new Image();
    testImage.onload = function(){
        var test = new Kinetic.Image({
            image: this,
            width: noColumns,
            height: noRows
        });

        var stage = new Kinetic.Stage({
            container: 'drawDiv',
            width: noColumns,
            height: noRows
        });

        var layer = new Kinetic.Layer({
            listening: false,
            hitGraphEnabled: false,
            visible: true
        });

        layer.add(test);
        stage.add(layer);
        layer.draw();
    };


    this.onload = null;
    this.loadData = function(){
        testImage.src = imageDataURL;
        if (this.onload)
            this.onload();
    };
*/

    /**
     * Set the number of columns in the upsampled DICOM images
     * @param cols The number of column in the DICOM images
     * @method SetColumns
     */
    this.SetColumns = function(cols){
        scaleToCols = cols;
    };

    /**
     * Set the number of rows in the upsampled DICOM images
     * @param rows The number of rows in the DICOM images
     * @method SetRows
     */
    this.SetRows = function(rows){
        scaleToRows = rows;
    };


    /**
     * Get deformation field data for a discrete coordinate in the deformation field space
     * Assumes column order
     * @param row Row in deformation field space
     * @param column Column in deformation field space
     * @return number The deformation value at the given discrete location
     */
    function GetDiscretePixelData( column, row){
        var index =
            column * noRows +
            row;

        return floatArray[index];
    }

    /**
     * Get deformation field data for a coordinate in the deformation field space
     * Assumes column order
     * @param row Row in deformation field space
     * @param column Column in deformation field space
     * @return number The interpolated deformation value
     */

    function GetInterpolatedPixelData(column, row){
        if (row >= scaleToRows)
            row = scaleToRows-1;
        else if (row < 0)
            row = 0;
        if (column >= scaleToCols)
            column = scaleToCols-1;
        else if (column < 0)
            column = 0;

        // Perform bilinear interpolation
        var y1 = Math.floor(row),
            y2 = Math.ceil(row),
            x1 = Math.floor(column),
            x2 = Math.ceil(column);

        // {column, row} index
        var Q11 = GetDiscretePixelData(x1, y1);
        var Q12 = GetDiscretePixelData(x1, y2);
        var Q21 = GetDiscretePixelData(x2, y1);
        var Q22 = GetDiscretePixelData(x2, y2);

        if (y1==y2)
            ++y2;
        if (x1==x2)
            ++x2;

        var value =
            (
            Q11 * (x2 - column) * (y2 - row) +
            Q21 * (column - x1) * (y2 - row) +
            Q12 * (x2 - column) * (row - y1) +
            Q22 * (column - x1) * (row - y1)
            );
        return value;

    }

    /**
     * Get deformation field data for a coordinate in the true scale image space
     * Must set SetColumns and SetRows before use
     * Assumes column order
     * Assumes use of MatLab imresize function for scaling
     * @param row Row in image space
     * @param column Column in image space
     * @return number The interpolated deformation value
     */
    this.GetInterpolatedScaledImageData = function (column, row){
        var origin = -0.5;
        var originalDataRow = (row - origin) * (noRows/scaleToRows) + origin;
        var originalDataColumn = (column - origin) * (noColumns/scaleToCols) + origin;
        return GetInterpolatedPixelData(originalDataColumn, originalDataRow)
    }

};
