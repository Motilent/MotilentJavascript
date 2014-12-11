/**
 * Created by Tom on 05/12/2014.
 */
/**
 * I/O module.
 * @module io
 */
var dwv = dwv || {};
dwv.io = dwv.io || {};

/**
 * Parametric map loader.
 * @class ParametricMapFile
 * @namespace dwv.io
 * @constructor
 */
dwv.io.ParametricMapFile = function()
{
    this.onload = null;
    this.onerror = null;
};

/**
 * Load a parametric map.
 * @method load
 * @param String filename The file to load.
 */
dwv.io.ParametricMapFile.prototype.load = function(file)
{
    // create closure to the onload method
    var onload = this.onload;
    var onerror = this.onerror;

    // Request error
    var onErrorParametricReader = function(event)
    {
        onerror( {'name': "RequestError",
            'message': "An error occurred while reading the parametric map file: "+event.getMessage() } );
    };

    // Parametric map loader
    var onLoadParametricReader = function(event)
    {
        // parse file
        try {
            var tmpdata = dwv.parametricmap.getDataFromBuffer(event.target.result);
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
    reader.onload = onLoadParametricReader;
    reader.onprogress = dwv.gui.updateProgress;
    reader.onerror = onErrorParametricReader;
    reader.readAsArrayBuffer(file);
};
