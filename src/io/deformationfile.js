/**
 * I/O module.
 * @module io
 */

var dwv = dwv || {};
dwv.io = dwv.io || {};

/**
 * Deformation file loader.
 * @class DeformationFile
 * @namespace dwv.io
 * @constructor
 */
dwv.io.DeformationFile = function()
{
    this.onload = null;
    this.onerror = null;
};

/**
 * Load a deformation file.
 * @method load
 * @param String filename The file to load.
 */
dwv.io.DeformationFile.prototype.load = function(file)
{
    // create closure to the onload method
    var onload = this.onload;
    var onerror = this.onerror;

    // Request error
    var onErrorDeformationReader = function(event)
    {
        onerror( {'name': "RequestError",
            'message': "An error occurred while reading the DICOM file: "+event.getMessage() } );
    };

    // DICOM reader loader
    var onLoadDeformationReader = function(event)
    {
        // parse file
        try {
            var tmpdata = dwv.deformationfield.getDataFromBuffer(event.target.result, 256, 256, 20, 2);
            // call listener
            onload(tmpdata);
        } catch(error) {
            onerror(error);
        }
        // force 100% progress (sometimes with firefox)
        var endEvent = {lengthComputable: true, loaded: 1, total: 1};
        dwv.gui.updateProgress(endEvent);
    };

    var reader = new FileReader();
    // storing values to pass them on
    reader.onload = onLoadDeformationReader;
    reader.onprogress = dwv.gui.updateProgress;
    reader.onerror = onErrorDeformationReader;
    reader.readAsArrayBuffer(file);
};
