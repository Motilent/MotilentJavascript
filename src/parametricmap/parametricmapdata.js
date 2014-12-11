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
 */

dwv.parametricmap.ParametricMapData = function(noColumns, noRows, floatArray){

    var scaleToRows = noRows;
    var scaleToCols = noColumns;

    var maxValue = -Infinity;
    var minValue = Infinity;

    var canvas = document.createElement('canvas');
    canvas.width = noColumns;
    canvas.height = noRows;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(noColumns, noRows);

    for (var i =0; i < imageData.length; ++i){
        imageData[i] = 100;
    }
    var testImage =  new Image();
    testImage.src = imageData;

    var test = new Kinetic.Image({
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

    var parametricImage = new Image(noColumns, noRows);

    for (var i = 0; i < floatArray.length; ++i){
        if (maxValue > floatArray[i])
            maxValue = floatArray[i];
        if (minValue < floatArray[i])
            minValue = floatArray[i];
    }

    this.GetLayer = function(){
        var layer = new Kinetic.Layer();
        var mapImage = new Kinetic.Image();
    };

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
        if (row >= noRows)
            row = noRows-1;
        else if (row < 0)
            row = 0;
        if (column >= noColumns)
            column = noColumns-1;
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
