/** 
 * GUI module.
 * @module gui
 */
var dwv = dwv || {};
/**
 * Namespace for GUI functions.
 * @class gui
 * @namespace dwv
 * @static
 */
dwv.gui = dwv.gui || {};

/**
 * Handle window/level change.
 * @method onChangeWindowLevelPreset
 * @namespace dwv.gui
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeWindowLevelPreset = function(/*event*/)
{
    dwv.tool.updateWindowingDataFromName(this.value);
};

/**
 * Handle colour map change.
 * @method onChangeColourMap
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeColourMap = function(/*event*/)
{
    dwv.tool.updateColourMapFromName(this.value);
};

/**
 * Handle loader change.
 * @method onChangeLoader
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeLoader = function(/*event*/)
{
    if( this.value === "file") {
        dwv.gui.displayUrlLoadHtml(false);
        dwv.gui.displayDeformationLoadHtml(false);
        dwv.gui.displayParametricMapLoadHtml(false);
        dwv.gui.displayZipFileLoadHtml(false);
        dwv.gui.displayFileLoadHtml(true);
    }
    if( this.value === "Zip File") {
        dwv.gui.displayUrlLoadHtml(false);
        dwv.gui.displayDeformationLoadHtml(false);
        dwv.gui.displayParametricMapLoadHtml(false);
        dwv.gui.displayFileLoadHtml(false);
        dwv.gui.displayZipFileLoadHtml(true);
    }
    else if( this.value === "url") {
        dwv.gui.displayFileLoadHtml(false);
        dwv.gui.displayDeformationLoadHtml(false);
        dwv.gui.displayParametricMapLoadHtml(false);
        dwv.gui.displayZipFileLoadHtml(false);
        dwv.gui.displayUrlLoadHtml(true);
    }
    else if( this.value === "Deformation File") {
        dwv.gui.displayUrlLoadHtml(false);
        dwv.gui.displayFileLoadHtml(false);
        dwv.gui.displayParametricMapLoadHtml(false);
        dwv.gui.displayZipFileLoadHtml(false);
        dwv.gui.displayDeformationLoadHtml(true);
    }
    else if (this.value === "Parametric Map"){
        dwv.gui.displayUrlLoadHtml(false);
        dwv.gui.displayFileLoadHtml(false);
        dwv.gui.displayDeformationLoadHtml(false);
        dwv.gui.displayZipFileLoadHtml(false);
        dwv.gui.displayParametricMapLoadHtml(true);
    }
};

/**
 * Handle exporter change.
 * @method onChangeExporter
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeExporter = function(/*event*/)
{
    if( this.value === "rois") {
        dwv.gui.displayExportHtml(true)
    }
};

/**
 * Handle save rois press.
 * @method onSaveRois
 * @static
 */
dwv.gui.onExportRois = function()
{
    app.onExportRois();
};


/**
 * Handle files change.
 * @method onChangeFiles
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeFiles = function(event)
{
    app.onChangeFiles(event);
};

/**
 * Handle zip file change.
 * @method onChangeZipFile
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeZipFile = function(event)
{
    app.onChangeZipFile(event);
};

/**
 * Handle deformation file change.
 * @method onChangeDeformationFile
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeDeformationFile = function(event)
{
    app.onChangeDeformationFile(event);
};

/**
 * Handle parametric map file change.
 * @method onChangeParametricMapFile
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeParametricMapFile = function(event)
{
    medianViewer.onChangeParametricMapFile(event);
};


/**
 * Handle URL change.
 * @method onChangeURL
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeURL = function(event)
{
    app.onChangeURL(event);
};

/**
 * Handle tool change.
 * @method onChangeTool
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeTool = function(/*event*/)
{
    app.getToolBox().setSelectedTool(this.value);
};

/**
 * Handle filter change.
 * @method onChangeFilter
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeFilter = function(/*event*/)
{
    app.getToolBox().getSelectedTool().setSelectedFilter(this.value);
};

/**
 * Handle filter run.
 * @method onRunFilter
 * @static
 * @param {Object} event The run event.
 */
dwv.gui.onRunFilter = function(/*event*/)
{
    app.getToolBox().getSelectedTool().getSelectedFilter().run();
};

/**
 * Handle min/max slider change.
 * @method onChangeMinMax
 * @static
 * @param {Object} range The new range of the data.
 */
dwv.gui.onChangeMinMax = function(range)
{
    // seems like jquery is checking if the method exists before it 
    // is used...
    if( app.getToolBox().getSelectedTool().getSelectedFilter ) {
        app.getToolBox().getSelectedTool().getSelectedFilter().run(range);
    }
};

/**
 * Handle shape change.
 * @method onChangeShape
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeShape = function(/*event*/)
{
    app.getToolBox().getSelectedTool().setShapeName(this.value);
    app.getToolBox().getSelectedTool().getSiblingTool().setShapeName(this.value);
};

/**
 * Handle line color change.
 * @method onChangeLineColour
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onChangeLineColour = function(/*event*/)
{
    app.getToolBox().getSelectedTool().setLineColour(this.value);
    app.getToolBox().getSelectedTool().getSiblingTool().setLineColour(this.value);
};

/**
 * Handle zoom reset.
 * @method onZoomReset
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onZoomReset = function(/*event*/)
{
    app.resetLayout();
    medianViewer.resetLayout();
};

/**
 * Handle cineloop play.
 * @method onCineloopPlay
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onCineloopPlay = function(/*event*/)
{
    app.cineloopPlay();
};

/**
 * Handle cineloop pause.
 * @method onCineloopPause
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onCineloopPause = function(/*event*/)
{
    app.cineloopPause();
};

/**
 * Handle cineloop speed change.
 * @method onCineloopSlider
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onCineloopSlider = function(event)
{
    var speed = parseInt(event.currentTarget.value,10);
    app.setCineloopSpeed(speed);
};


/**
 * Handle propagation of one layer of shapes
 * @static
 */

dwv.gui.copyOneLayer = function(){
    // Search for propagate tool
    for (var i in dwv.tool.tools){
        if (/propagate/i.test(i)){
            dwv.tool.tools[i].copyMedianLayer();
        }
    }
};

/**
 * Handle propagation of all layers of shapes
 * @static
 */
dwv.gui.copyToAllLayers = function(){
    // Search for propagate tool
    for (var i in dwv.tool.tools){
        if (/propagate/i.test(i)){
            dwv.tool.tools[i].copyMedianLayerToAll();
        }
    }
};

/**
 * Handle display reset.
 * @method onDisplayReset
 * @static
 * @param {Object} event The change event.
 */
dwv.gui.onDisplayReset = function(event)
{
    dwv.gui.onZoomReset(event);
    app.initWLDisplay();
    // update preset select
    var select = document.getElementById("presetSelect");
    select.selectedIndex = 0;
    dwv.gui.refreshSelect("#presetSelect");
};

/**
 * Handle undo.
 * @method onUndo
 * @static
 * @param {Object} event The associated event.
 */
dwv.gui.onUndo = function(/*event*/)
{
    app.getUndoStack().undo();
};

/**
 * Handle redo.
 * @method onRedo
 * @static
 * @param {Object} event The associated event.
 */
dwv.gui.onRedo = function(/*event*/)
{
    app.getUndoStack().redo();
};

/**
 * Handle toggle of info layer.
 * @method onToggleInfoLayer
 * @static
 * @param {Object} event The associated event.
 */
dwv.gui.onToggleInfoLayer = function(/*event*/)
{
    app.toggleInfoLayerDisplay();
    medianViewer.toggleInfoLayerDisplay();
};
