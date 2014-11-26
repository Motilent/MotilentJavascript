/**
 * I/O module
 * @module io
 */

var dwv = dwv || {};
dwv.io = dwv.io || {};


/**
 * ROI exporter
 * @class ExportROI
 * @namespace dwv.io
 * @constructor
 */

dwv.io.ExportROI = function()
{
    this.onsave = null;
    this.onerror = null;
    this.motilityDrawTool = null;
    this.medianDrawTool = null;
};

/**
 * Save ROIs to file
 * @method save
 * @param string filename The filename to save to.
 */

dwv.io.ExportROI.prototype.save = function(filename)
{
    // create closure to the onload method
    var onsave = this.onload;
    var onerror = this.onerror;
    var motilityDrawTool = this.motilityDrawTool;
    var medianDrawTool = this.medianDrawTool;


    // Extract

};
