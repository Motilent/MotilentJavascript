/**
 * Deformation field module.
 * @module deformationfield
 */
var dwv = dwv || {};
/**
 * Namespace for deformation field related functions.
 * @class deformationfield
 * @namespace dwv
 * @static
 */
dwv.deformationfield = dwv.deformationfield || {};

/**
 * Get data from a buffer.
 * @method getDataFromBuffer
 * @static
 * @param {Array} buffer The input data buffer.
 * @param number noCols The number of columns
 * @param number noRows The number of rows
 * @return Object The corresponding deformation fields
 */

dwv.deformationfield.getDataFromBuffer = function(buffer, noCols, noRows, noTimePoints, noDimensions)
{
    var floatArray = new Float32Array(buffer);
    if (floatArray.length != noCols*noRows*noTimePoints*noDimensions){
        alert("File dimensions mismatch");
        return null;
    }

    var newDef = new dwv.deformationfield.DeformationData(noCols, noRows, noTimePoints, noDimensions, floatArray);

    return newDef;

};
