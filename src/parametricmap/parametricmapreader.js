/**
 * Parametric map module.
 * @module parametricmap
 */
var dwv = dwv || {};
/**
 * Namespace for parametric map related functions.
 * @class parametricmap
 * @namespace dwv
 * @static
 */
dwv.parametricmap = dwv.parametricmap || {};

/**
 * Get data from a buffer.
 * @method getDataFromBuffer
 * @static
 * @param {Array} buffer The input data buffer.
 * @param number noCols The number of columns
 * @param number noRows The number of rows
 * @return Object The corresponding deformation fields
 */

dwv.parametricmap.getDataFromBuffer = function(buffer, noCols, noRows)
{
    var floatArray = new Float32Array(buffer);
    if (floatArray.length != noCols*noRows*noTimePoints*noDimensions){
        alert("File dimensions mismatch");
        return null;
    }

    var newDef = new dwv.parametricmap.DeformationData(noCols, noRows, floatArray);

    return newDef;

};
