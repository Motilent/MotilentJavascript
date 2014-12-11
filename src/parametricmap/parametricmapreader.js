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
 * @return Object The corresponding deformation fields
 */

dwv.parametricmap.getDataFromBuffer = function(buffer)
{

    var dView = new DataView(buffer);
    var fieldSignature = new Uint8Array(buffer, 0 ,8);
    var headerChecksum = dView.getUint8(8, true);
    var majorVersion = dView.getUint8(9, true);
    var minorVersion = dView.getUint8(10, true);
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

    var floatArray = new Float32Array(buffer, offsetToData, dataLength);
    if (floatArray.length != noCols*noRows){
        alert("File dimensions mismatch");
        return null;
    }

    var newPara = new dwv.parametricmap.ParametricMapData(noCols, noRows, floatArray);

    return newPara;

};
