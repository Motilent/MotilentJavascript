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
 * @return Object The corresponding deformation fields
 */

dwv.deformationfield.getDataFromBuffer = function(buffer)
{
    var dView = new DataView(buffer);
    var noDimensions = 2;
    var fieldSignature = new Uint8Array(buffer, 0 ,8);
    var headerChecksum = dView.getUint8(8, true);
    var majorVersion = dView.getUint8(9, true);
    var minorVersion = dView.getUint8(10, true);
    var floatByteLength = dView.getUint8(11, true);
    var offsetToData = dView.getUint32(16, true);
    var dataLength = dView.getUint32(20, true);
    var noCols = dView.getUint16(24, true);
    var noRows = dView.getUint16(26, true);
    var noSlices = dView.getUint16(28, true);
    var noTimePoints = dView.getUint16(30, true);
    var dataChecksum = dView.getUint8(buffer.bytelength-1, true);

    console.log('File version ' + majorVersion + '.' + minorVersion);
    console.log('Number of columns ' + noCols);
    console.log('Number of rows ' + noRows);
    console.log('Number of time points ' + noTimePoints);

    var floatArray = null;
    if (floatByteLength == 4)
        floatArray = new Float32Array(buffer, offsetToData, dataLength);
    else if (floatByteLength == 8)
        floatArray = new Float64Array(buffer, offsetToData, dataLength);
    else
        throw "Float byte length of unknown size";

    if (floatArray.length != noCols*noRows*noTimePoints*noDimensions){
        throw "File dimensions mismatch";
    }

    var newDef = new dwv.deformationfield.DeformationData(noCols, noRows, noTimePoints, noDimensions, floatArray);

    return newDef;

};
