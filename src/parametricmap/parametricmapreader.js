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
    var floatByteLength = dView.getUint8(11, true);
    var offsetToData = dView.getUint32(16, true);
    var dataLength = dView.getUint32(20, true);
    var nameCharArray = new Uint8Array(buffer,24, 64);
    var noCols = dView.getUint16(88, true);
    var noRows = dView.getUint16(90, true);
    var noSlices = dView.getUint16(92, true);
    var noTimePoints = dView.getUint16(94, true);
    var dataChecksum = dView.getUint8(buffer.bytelength-1, true);

    var nameStr = '';

    for (var i = 0; i < nameCharArray.length; ++i){
        if (nameCharArray[i] == 0)
            break;
        else
            nameStr += String.fromCharCode(nameCharArray[i]);
    }

    console.log('Reading parametric map file: ' + nameStr);
    console.log('File version ' + majorVersion + '.' + minorVersion);
    console.log('Number of columns ' + noCols);
    console.log('Number of rows ' + noRows);

    var floatArray = null;
    if (floatByteLength == 4)
        floatArray = new Float32Array(buffer, offsetToData, dataLength);
    else if (floatByteLength == 8)
        floatArray = new Float64Array(buffer, offsetToData, dataLength);
    else
        throw "Float byte length of unknown size";

    if (floatArray.length != noCols*noRows){
        throw "File dimensions mismatch";
    }

    var newPara = new dwv.parametricmap.ParametricMapData(noCols, noRows, floatArray, nameStr);

    return newPara;

};
