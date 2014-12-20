/**
 * Deformation field module.
 * @module deformationfield
 */
var dwv = dwv || {};
dwv.deformationfield = dwv.deformationfield || {};

/**
 * Deformation data class.
 * @class DeformationData
 * @namespace dwv.deformationfield
 * @constructor
 * @param number noColumns The number of deformation map columns.
 * @param number noRows The number of deformation map rows.
 * @param number noTimePoints The number of time points.
 * @param number noDimensions The number of dimensions of deformation.
 * @param Float32Array floatArray The data array.
 */

dwv.deformationfield.DeformationData = function(noColumns, noRows, noTimePoints, noDimensions, floatArray){

    var scaleToRows = noRows;
    var scaleToCols = noColumns;
    var timePointIndex = noRows*noColumns;
    var dimensionIndex = noRows*noColumns*noTimePoints;

    /**
     * Set the number of columns in the upsampled DICOM images
     * @param cols The number of column in the DICOM images
     * @method SetColumns
     */
    this.SetColumns = function(cols){
        scaleToCols = cols;
    };

    /**
     * Set the number of rows in the upsamples DICOM images
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
     * @param timePoint Time point in deformation field space
     * @param dimension The dimension of the deformation
     * @return number The deformation value at the given discrete location
     */
    function GetDiscretePixelData( column, row, timePoint, dimension){
        var index = dimension * dimensionIndex +
            timePoint * timePointIndex +
                column * noRows +
                    row;

        return floatArray[index];
    }

    /**
     * Get deformation field data for a coordinate in the deformation field space
     * Assumes column order
     * @param row Row in deformation field space
     * @param column Column in deformation field space
     * @param timePoint Time point in deformation field space
     * @param dimension The dimension of the deformation
     * @return number The interpolated deformation value
     */

    function GetInterpolatedPixelData(column, row, timePoint, dimension){
        if (row >= scaleToRows)
            row = scaleToRows-1;
        else if (row < 0)
            row = 0;
        if (column >= scaleToCols)
            column = scaleToCols-1;
        else if (column < 0)
            column = 0;

        if (timePoint >= noTimePoints || timePoint < 0 || timePoint != Math.floor(timePoint)){
            throw "Time point does not exist";
        }
        if (dimension >= noDimensions || dimension < 0 || dimension != Math.floor(dimension)){
            throw "Deformation dimension does not exist";
        }

        // Perform bilinear interpolation
        var y1 = Math.floor(row),
            y2 = Math.ceil(row),
            x1 = Math.floor(column),
            x2 = Math.ceil(column);

        // {column, row} index
        var Q11 = GetDiscretePixelData(x1, y1, timePoint, dimension);
        var Q12 = GetDiscretePixelData(x1, y2, timePoint, dimension);
        var Q21 = GetDiscretePixelData(x2, y1, timePoint, dimension);
        var Q22 = GetDiscretePixelData(x2, y2, timePoint, dimension);

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

    };

    /**
     * Get deformation field data for a coordinate in the true scale image space
     * Must set SetColumns and SetRows before use
     * Assumes column order
     * Assumes use of MatLab imresize function for scaling
     * @param row Row in image space
     * @param column Column in image space
     * @param timePoint Time point in image space
     * @param dimension The dimension of the deformation
     * @return number The interpolated deformation value
     */
    this.GetInterpolatedScaledImageData = function (column, row, timePoint, dimension){
        var origin = -0.5;
        var originalDataRow = (row - origin) * (noRows/scaleToRows) + origin;
        var originalDataColumn = (column - origin) * (noColumns/scaleToCols) + origin;
        // column
        if (dimension == 0)
            return GetInterpolatedPixelData(originalDataColumn, originalDataRow, timePoint, dimension)* scaleToCols/ noColumns;
        else if (dimension == 1)
            return GetInterpolatedPixelData(originalDataColumn, originalDataRow, timePoint, dimension)* scaleToRows/ noRows;
    }

};
