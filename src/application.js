// Main DWV namespace.
var dwv = dwv || {};

var Kinetic = Kinetic || {};

var interactionApp = 'motility';

/**
 * Main application class.
 * @class App
 * @namespace dwv
 * @constructor
 * @param {string} type The type of application ( 'motility'/'median' )
 */
dwv.App = function(type)
{
    // Local object
    var self = this;


    var appType = type;

    /**
     * Get the type of app
     * @method GetType
     * @return String The app type ('motility'/'median')
     */
    this.GetType = function(){
        return appType;
    };

    if (! (appType == 'motility' || appType == 'median'))
        throw "Unknown appType " + appType;
    var appExt = "";
    if (appType == 'median')
        appExt = '_med';

    // Image
    var image = null;

    /**
     * Get the image for this window
     * @method GetImage
     * @return The image
     */

    this.GetImage = function(){
        return image;
    };
    // View
    var view = null;

    // Deformation field
    var deffField = null;

    // DICOM info
    var info = null;

    // Original image
    var originalImage = null;
    // Image data array
    var imageData = null;
    // Image data width
    var dataWidth = 0;
    // Image data height
    var dataHeight = 0;

    this.GetDataWidth = function(){
        return dataWidth;
    };
    this.GetDataHeight = function(){
        return dataHeight;
    };

    var patientID = null;
    var studyID = null;

    this.GetPatientID = function(){
        return patientID;
    };
    this.GetStudyID = function() {
        return studyID;
    };


    var paraWidth = 0;
    var paraHeight = 0;
    var paraMul = 0;


    this.GetParametricMapScaleMultiplier = function(){
        return paraMul;
    };

    var drawTool = null;
    /**
     * Set the draw tool for this window
     * @param dt The draw tool
     */

    this.SetDrawTool = function(dt){
        drawTool = dt;
    };

    /**
     * Get the draw tool for this window
     * @return The draw tool
     */

    this.GetDrawTool = function(){
        return drawTool;
    };
    // display window scale
    var windowScale = 1;

    var currentParametricMap = null;

    this.GetCurrentParametricMap = function(){
        return currentParametricMap;
    };


    var currentZipFileName = null;

    this.GetCurrentZipFileName = function(){
        return currentZipFileName;
    };

    // Parametric map layer
    var parametricMapLayers = [];

    // Parametric map data
    var parametricMapData = [];

    // Parametric map names
    var parametricMapNames = [];

    // Median image defined by Temporal Position Identifier (0020,0100)
    var medianImageTemporalPosition = null;

    /**
     * Set the median image defined by Temporal Position Identifier (0020,0100)
     * @method SetMedianImageTemporalPosition
     * @param number val The temporal position of the median image.
     */
    this.SetMedianImageTemporalPosition = function(val) {
        this.medianImageTemporalPosition = val;
    };

    var medianImageFileId = null;

    this.SetMedianImageFileId = function(val) {
        this.medianImageTemporalPosition = val;
    };

    this.GetMedianImageFileId = function(val) {
        return this.medianImageTemporalPosition;
    };

    var fileIdOrder = [];
    this.SetFileIdOrder = function(arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] == "") {
                arr.splice(i, 1);
                i--;
            }
        }
        fileIdOrder = arr;
    };
    this.GetFileIdOrder = function() {
        return fileIdOrder
    };

    /**
     * Get the median image defined by Temporal Position Identifier (0020,0100)
     * @method GetMedianImageTemporalPosition
     * @return number The temporal position of the median image.
     */
    this.GetMedianImageTemporalPosition = function() {
        return this.medianImageTemporalPosition;
    };

    // Image layer
    var imageLayer = null;
    // Draw layers
    var drawLayers = [];
    // Draw stage
    var drawStage = null;
    
    // flag to know if the info layer is listening on the image.
    var isInfoLayerListening = false;
    
    // Tool box
    var toolBox = new dwv.tool.ToolBox(this);
    // UndoStack
    var undoStack = new dwv.tool.UndoStack();
    
    /** 
     * Get the version of the application.
     * @method getVersion
     * @return {String} The version of the application.
     */
    this.getVersion = function() { return "v1.15"; };


    /**
     * Get the type of the application.
     * @method getVersion
     * @return {String} The type of the application (motility / median)
     */
    this.getType = function() { return appType; };
    
    /** 
     * Get the image.
     * @method getImage
     * @return {Image} The associated image.
     */
    this.getImage = function() { return image; };
    /** 
     * Get the view.
     * @method getView
     * @return {Image} The associated view.
     */
    this.getView = function() { return view; };



    /**
     * Get the current time series slice number.
     * @method GetCurrentSlice
     * @return number The current time series slice number.
     */
    this.GetCurrentSlice = function(){
        return view.getCurrentPosition().k;
    };

    /**
     * Get the deformation field
     * @method getDeformationField
     * @returns {Object} The deformation field object
     */
    this.getDeformationField = function() {return deffField;};

    /** 
     * Set the view.
     * @method setImage
     * @param {Image} img The associated image.
     */
    this.setImage = function(img)
    { 
        image = img; 
        view.setImage(img);
    };

    var roiRecord = null;
    /**
     * Create an ROI record - called when deformation fields are loaded
     * @method CreateRoiRecord
     */
    this.CreateRoiRecord = function(){
        if (appType == 'median')
            return;
        roiRecord = new dwv.roi.RoiRecord(this.GetDrawTool(), medianViewer.GetDrawTool(), deffField);
    };
    /**
     * Get the ROI record
     * @method GetRoiRecord
     */
    this.GetRoiRecord = function(){
        return roiRecord;
    };

    /** 
     * Restore the original image.
     * @method restoreOriginalImage
     */
    this.restoreOriginalImage = function() 
    { 
        image = originalImage; 
        view.setImage(originalImage); 
    }; 
    
    /** 
     * Get the image data array.
     * @method getImageData
     * @return {Array} The image data array.
     */
    this.getImageData = function() { return imageData; };

    /** 
     * Get the tool box.
     * @method getToolBox
     * @return {Object} The associated toolbox.
     */
    this.getToolBox = function() { return toolBox; };


    /**
     * Set the tool box.
     * @method getToolBox
     * @param {Object} The associated toolbox.
     */
    this.setToolBox = function(tb) { toolBox = tb; };
    /** 
     * Get the image layer.
     * @method getImageLayer
     * @return {Object} The image layer.
     */
    this.getImageLayer = function() { return imageLayer; };

    /**
     * Get the parametric map.
     * @method getParametricMapLayers
     * @return {Object} The parametric map layers.
     */
    this.getParametricMapLayers = function() { return parametricMapLayers; };

    /**
     * Get the parametric map data
     * @method getParametricMapData
     * @return {Object} The parametric map data.
     */
    this.getParametricMapData = function() { return parametricMapData; };



    /** 
     * Get the draw layer.
     * @method getDrawLayer
     * @return {Object} The draw layer.
     */
    this.getDrawLayer = function() {
        if (appType == 'motility')
            return drawLayers[view.getCurrentPosition().k];
        else
            return drawLayers[0];
    };

    /**
     * Get the draw layer array
     * @method getDrawLayers
     * @return {Array} The draw layer array.
     */
    this.getDrawLayers = function(){
        return drawLayers;
    };
    /** 
     * Get the draw stage.
     * @method getDrawStage
     * @return {Object} The draw layer.
     */
    this.getDrawStage = function() { return drawStage; };

    /** 
     * Get the undo stack.
     * @method getUndoStack
     * @return {Object} The undo stack.
     */
    this.getUndoStack = function() { return undoStack; };

    /**
     * Initialise the HTML for the application.
     * @method init
     */
    this.init = function(){
        // align layers when the window is resized
        window.onresize = function(){
            app.resize();
            medianViewer.resize();
        };
        // listen to drag&drop
        var box = document.getElementById("dropBox"+appExt);
        if ( box ) {
            box.addEventListener("dragover", onDragOver);
            box.addEventListener("dragleave", onDragLeave);
            box.addEventListener("drop", onDrop);
            // initial size
            var size = dwv.gui.getWindowSize();
            var dropBoxSize = 2 * size.height / 3;
            $("#dropBox"+appExt).height( dropBoxSize );
            $("#dropBox"+appExt).width( dropBoxSize );
        }
        // possible load from URL
        if( typeof skipLoadUrl === "undefined" ) {
            var inputUrls = dwv.html.getUriParam(); 
            if( inputUrls && inputUrls.length > 0 ) {
                this.loadURL(inputUrls);
            }
        }
        else{
            console.log("Not loading url from adress since skipLoadUrl is defined.");
        }
    };
    
    /**
     * Reset the application.
     * @method reset
     */
    this.reset = function()
    {
        if (appType=='motility') {
            // clear tools
            toolBox.reset();
            // clear undo/redo
            undoStack = new dwv.tool.UndoStack();
            dwv.gui.cleanUndoHtml();
        }

        // clear draw
        if ( drawStage ) {
            drawLayers = [];
        }
        // clear objects
        image = null;
        view = null;
        info = null;
        deffField = null;
        patientID = null;
        studyID = null;
        parametricMapLayers = [];
        parametricMapData = [];
        parametricMapNames = [];
        currentParametricMap = null;
        medianImageTemporalPosition = null;
        currentZipFileName = null;
        dwv.gui.appendParametricMapSelector();
        if (appType == 'median'){
            dwv.gui.appendParametricMap('Off');
        }
    };
    
    /**
     * Reset the layout of the application.
     * @method resetLayout
     */
    this.resetLayout = function () {
        if ( imageLayer ) {
            imageLayer.resetLayout(windowScale);
            imageLayer.draw();
        }

        for (var i = 0; i < parametricMapLayers.length; ++i){
            parametricMapLayers[i].resetLayout(windowScale);
            parametricMapLayers[i].draw();
        }
        if ( drawStage ) {
            drawStage.offset( {'x': 0, 'y': 0} );
            drawStage.scale( {'x': windowScale, 'y': windowScale} );
            drawStage.draw();
        }
    };
    
    /**
     * Handle key down event.
     * - CRTL-Z: undo
     * - CRTL-Y: redo
     * Default behavior. Usually used in tools. 
     * @method onKeydown
     * @param {Object} event The key down event.
     */
    this.onKeydown = function(event)
    {
        if( event.keyCode === 90 && event.ctrlKey ) // ctrl-z
        {
            undoStack.undo();
        }
        else if( event.keyCode === 89 && event.ctrlKey ) // ctrl-y
        {
            undoStack.redo();
        }
    };


    /* Cineloop events */
    var cineloopInterval = null;
    var cineloopSpeed = 50;
    /**
     * Play cineloop
     * @method cineloopPlay
     */
    this.cineloopPlay = function(){
        if (cineloopInterval)
            clearInterval(cineloopInterval);
        if (!view)
            return;
        cineloopInterval = setInterval( function() {
            // Do cineloop
            if (!view)
                return;
            var currentPosition = view.getCurrentPosition();
            var nextPosition = jQuery.extend({}, currentPosition);
            ++nextPosition.k;
            view.setCurrentPosition(nextPosition);
            nextPosition = view.getCurrentPosition();
            if (currentPosition.k == nextPosition.k){
                nextPosition.k = 0;
                view.setCurrentPosition(nextPosition);
            }
            app.onSliceChange();


        }, 10000 / cineloopSpeed);
    };

    /**
     * Pause cineloop
     * @method cineloopPause
     */
    this.cineloopPause = function(){
        if (cineloopInterval)
            clearInterval(cineloopInterval);
    };

    /**
     * Change cineloop speed
     * @method setCineloopSpeed
     * @param speed number The speed to set the cineloop (arbitrary scale)
     */
    this.setCineloopSpeed = function(speed){
        cineloopSpeed = speed;
        this.cineloopPlay();
    };
    
    /**
     * Handle change files event.
     * @method onChangeFiles
     * @param {Object} event The event fired when changing the file field.
     */
    this.onChangeFiles = function(event)
    {
        this.loadFiles(event.target.files);
    };

    /**
     * Handle change zip file event.
     * @method onChangeZipFile
     * @param {Object} event The event fired when changing the file field.
     */
    this.onChangeZipFile = function(event)
    {
        this.loadZipFile(event.target.files[0]);
    };

    /**
     * Handle change roi file event.
     * @method onChangeRoiFile
     * @param {Object} event The event fired when changing the file field.
     */
    this.onChangeRoiFile = function(event)
    {
        this.loadRoiFile(event.target.files[0]);
    };


    /**
     * Handle deformation files change.
     * @method onChangeDeformationFiles
     * @static
     * @param {Object} event The change event.
     */
    this.onChangeDeformationFile = function(event)
    {
        this.loadDeformationFile(event.target.files[0]);
    };

    /**
     * Handle parametric map files change.
     * @method onChangeParametricMapFile
     * @static
     * @param {Object} event The change event.
     */
    this.onChangeParametricMapFile = function(event)
    {
        this.loadParametricMapFile(event.target.files[0]);
    };

    /**
     * Handle export rois files event.
     * @method onExportRois
     */
    this.onExportRois = function(){
        var fileIO = new dwv.io.ExportROI();

        // Save roi file using filename prefix from zip file
        var pre = currentZipFileName.substr(0,currentZipFileName.lastIndexOf('.')) + '_ROI_Data';
        fileIO.save(pre);
        // Save roi file using patientID and studyID from DICOM field
        //fileIO.save(self.GetPatientID().value[0].replace(/\W/g, '') + '_' + self.GetStudyID().value[0].replace(/\W/g, ''));
    };

    /**
     * Handle processing of data from DICOM reader
     * @method processImageData
     * @param data Object DICOM reader data object
     */
    this.processImageData = function(data){
        var isFirst = true;
        var isMedianImage = data.view.getImage().getTemporalPositions()[0] == app.GetMedianImageTemporalPosition();
        patientID = data.info.PatientID;
        studyID = data.info.StudyID;

        if( image ) {
            image.appendSlice( data.view.getImage() );
            isFirst = false;
            if (deffField) {
                deffField.SetColumns(image.getNumberOfColumns());
                deffField.SetRows(image.getNumberOfRows());
            }
        }
        if (image && isMedianImage){
            medianViewer.postLoadInit(data);
            if( medianViewer.getDrawStage() ) {
                // create slice draw layer
                var drawLayer = new Kinetic.Layer({
                    listening: false,
                    hitGraphEnabled: false,
                    visible: true
                });
                // add to layers array
                medianViewer.getDrawLayers().push(drawLayer);
                // add the layer to the stage
                medianViewer.getDrawStage().add(drawLayer);
            }
        }
        self.postLoadInit(data);
        if( drawStage ) {
            // create slice draw layer
            var drawLayer = new Kinetic.Layer({
                listening: false,
                hitGraphEnabled: false,
                visible: isFirst,
                fromfile: data.file.name
            });
            // add to layers array
            drawLayers.push(drawLayer);
            // add the layer to the stage
            drawStage.add(drawLayer);
        }
    };

    /**
     * Load a list of files.
     * @method loadFiles
     * @param {Array} files The list of files to load.
     */
    this.loadFiles = function(files) 
    {
        // clear variables
        this.reset();
        medianViewer.reset();
        // create IO
        var fileIO = new dwv.io.File();
        fileIO.onload = this.processImageData;
        fileIO.onerror = function(error){ handleError(error); };
        fileIO.noFiles = files.length;
        fileIO.filesLoaded = 0;
        fileIO.onloadend = function(event){
            console.log(++this.fileio.filesLoaded);
        };
        // main load (asynchronous)
        fileIO.load(files);
    };


    /**
     * Load a zip file.
     * @method loadZipFile
     * @param Blob file The file to load.
     */
    this.loadZipFile = function(file){
        // Reset everything there
        parametricMapData = [];
        parametricMapLayers = [];
        currentParametricMap = null;
        this.reset();
        medianViewer.reset();

        currentZipFileName = file.name;

        var dialog1 = $('#loadingdialog').dialog({
            autoOpen: true,
            modal:true,
            height: 200,
            width: 200,
            dialogClass: "no-close"
        });
        dialog1.empty();
        var text = $('<h1>').text('Loading').css('margin-left', 'auto').css('margin-right', 'auto').css('width', '70%');
        text.appendTo(dialog1);

        var zipIO = new dwv.io.ZipFile();
        zipIO.onloadConfigfile = this.processConfigFile;
        zipIO.onloadMedianIdFile = this.processMedianIdFile;
        zipIO.onloadFileIdsFile = this.processFileIdsFile;

        zipIO.onloadDICOM = this.processImageData;
        zipIO.onerror = function(error){
            handleError(error);
        };
        zipIO.onloadDeformation = this.processDeformationData;
        zipIO.onloadParametric = medianViewer.processParametricData;

        zipIO.load(file);
    };
    /**
     * Load a roi file.
     * @method loadRoiFile
     * @param Blob file The file to load.
     */
    this.loadRoiFile = function(file){
        if (roiRecord)
            roiRecord.RemoveAllEntries();
        else
            return;

        this.CreateRoiRecord();

        var roiIO = new dwv.io.ExportROI();
        roiIO.onerror = function(error){
            handleError(error);
        };
        roiIO.onload = function(roiEs){
            console.log(roiEs);
            if (self.GetImage()) {

                var temporalPositions = self.GetImage().getTemporalPositions();
                var medianIndex = null;
                for (var t = 0; t < temporalPositions.length; ++t) {
                    if (temporalPositions[t] == self.GetMedianImageTemporalPosition())
                        medianIndex = t;
                }
                if (medianIndex == null)
                    return;

                // Iterate through entries and find only those that correspond to the median image
                for (var r = 0; r < roiEs.length; ++r) {
                    if (roiEs[r].timepoint == medianIndex) {
                        var roi = null;
                        var shape = null;


                        if (roiEs[r].type == 'poly') {
                            roi = new dwv.math.ROI();
                            var points = [];
                            for (var p = 0; p < roiEs[r].slicepoints.length; ++p) {
                                points.push(new dwv.math.Point2D(roiEs[r].slicepoints[p][0],
                                    roiEs[r].slicepoints[p][1]));
                            }
                            roi.addPoints(points);
                            shape = dwv.roi.GetShapeFromRoi(roi, roiEs[r].colour, medianViewer);
                        }
                        else {
                            var pointA = new dwv.math.Point2D(roiEs[r].slicepoints[0][0],
                                roiEs[r].slicepoints[0][1]);
                            var pointB = new dwv.math.Point2D(roiEs[r].slicepoints[1][0],
                                roiEs[r].slicepoints[1][1]);
                            roi = new dwv.math.Line(pointA, pointB);
                            shape = dwv.roi.GetShapeFromLine(roi, roiEs[r].colour, medianViewer);
                        }

                        var shapeGroup = new Kinetic.Group();
                        shapeGroup.add(shape.shape);
                        shapeGroup.add(shape.text);

                        var destinationLayer = medianViewer.getDrawLayers()[0];
                        destinationLayer.add(shapeGroup);
                        destinationLayer.draw();

                        medianViewer.GetDrawTool().addToCreatedShapes(shape);


                        app.GetRoiRecord().AddRoiEntry(roiEs[r].type, roiEs[r].colour, roi, shape, roiEs[r].id);

                    }
                }
            }
        };
        roiIO.load(file);

    };

    /**
     * Handle processing of text from config file
     * @method processConfigFile
     * @param data String config file
     */
    this.processConfigFile = function(text){
        app.SetMedianImageTemporalPosition(parseInt(text,10));
        medianViewer.SetMedianImageTemporalPosition(parseInt(text,10));
    };


    /**
     * Handle processing of text from median ID
     * @method processMedianIdFile
     * @param data String  median ID file
     */
    this.processMedianIdFile = function(text){
        app.SetMedianImageFileId(text.trim());
        medianViewer.SetMedianImageFileId(text.trim());
    };

    /**
     * Handle processing of text from File Ids
     * @method processFileIdsFile
     * @param data String  file IDs file
     */
    this.processFileIdsFile = function(text){
        var res = text.replace( /\n/g, " " ).split( " " );
        app.SetFileIdOrder(res);
        medianViewer.SetFileIdOrder(res);
    };



    /**
     * Handle processing of data from deformation field reader
     * @method processDeformationData
     * @param data Object Parametric map reader data object
     */
    this.processDeformationData = function(data){
        deffField = data;
        if (image) {
            deffField.SetColumns(image.getSize().getNumberOfColumns());
            deffField.SetRows(image.getSize().getNumberOfRows());
        }
        if (appType == 'motility'){
            // Setup the ROI records
            self.CreateRoiRecord();
        }
    };

    /**
     * Load a deformation file.
     * @method loadDeformationFile
     * @param string file The file to load.
     */
    this.loadDeformationFile = function(file){
        var defIO = new dwv.io.DeformationFile();
        defIO.onload = this.processDeformationData;
        defIO.onerror= function(error){
            handleError(error);
        };

        defIO.load(file);

    };


    /**
     * Handle processing of data from parametric map reader
     * @method processParametricData
     * @param data Object Parametric map reader data object
     */
    this.processParametricData = function(data){
        parametricMapData.push(data);
        if (currentParametricMap==null)
            currentParametricMap = 0;
        else
            ++currentParametricMap;


        var newLayer = new dwv.html.Layer("parametricMapLayer_med");
        parametricMapLayers.push(newLayer);

        newLayer.initialise(image.getSize().getNumberOfColumns(), image.getSize().getNumberOfRows());
        newLayer.fillContext();
        newLayer.setImageData(data.GetImageData());

        for (var i = 0; i < parametricMapLayers.length; ++i){
            parametricMapLayers[i].setStyleDisplay(true);
        }
        parametricMapLayers[currentParametricMap].setStyleDisplay(true);
        parametricMapLayers[currentParametricMap].draw();

       // Add to layers array

        paraWidth = data.GetNumberOfColumns();
        paraHeight = data.GetNumberOfRows();

        // resize app
        self.resetLayout();
        self.resize();

        dwv.gui.appendParametricMap(data.GetName());
        parametricMapNames.push(data.GetName());
        //$('#imageLayer_med').hide();
    };

    /**
     * Get the parametric map names
     * @returns {Array} Array of strings
     */
    this.GetParametricMapNames = function(){
        return parametricMapNames;
    };
    /**
     * Change the currently displayed parametric map
     * @method ChangeParametricMap
     * @param Number mapNumber The number of the parametric map (set to -1 for off)
     */
    this.ChangeParametricMap = function(mapNumber){
        if (mapNumber < parametricMapLayers.length){
            currentParametricMap = mapNumber;
            for (var i = 0; i < parametricMapLayers.length; ++i){
                parametricMapLayers[i].setStyleDisplay(false);
            }

            if (mapNumber >= 0) {
                parametricMapLayers[mapNumber].setStyleDisplay(true);
                parametricMapLayers[mapNumber].draw();
            }
        }
    };

    /**
     * Load a parametric map file.
     * @method loadParametricMapFile
     * @param string file The file to load.
     */
    this.loadParametricMapFile = function(file){

        if (!imageLayer || !image)
            return;
        var paraIO = new dwv.io.ParametricMapFile();
        paraIO.onload = medianViewer.processParametricData;
        paraIO.onerror= function(error){
            handleError(error);
        };

        paraIO.load(file);

    };



    /**
     * Handle change url event.
     * @method onChangeURL
     * @param {Object} event The event fired when changing the url field.
     */
    this.onChangeURL = function(event)
    {
        this.loadURL([event.target.value]);
    };

    /**
     * Load a list of URLs.
     * @method loadURL
     * @param {Array} urls The list of urls to load.
     */
    this.loadURL = function(urls) 
    {
        // clear variables
        this.reset();
        // create IO
        var urlIO = new dwv.io.Url();
        urlIO.onload = function (data) {
            var isFirst = true;
            if( image ) {
                image.appendSlice( data.view.getImage() );
                isFirst = false;
            }
            postLoadInit(data);
            if( drawStage ) {
                // create slice draw layer
                var drawLayer = new Kinetic.Layer({
                    listening: false,
                    hitGraphEnabled: false,
                    visible: isFirst
                });
                // add to layers array
                drawLayers.push(drawLayer);
                // add the layer to the stage
                drawStage.add(drawLayer);
            }
        };
        urlIO.onerror = function(error){ handleError(error); };
        // main load (asynchronous)
        urlIO.load(urls);
    };
    
    /**
     * Handle window/level change.
     * @method onWLChange
     * @param {Object} event The event fired when changing the window/level.
     */
    this.onWLChange = function (/*event*/)
    {         
        generateAndDrawImage();
    };

    /**
     * Handle color map change.
     * @method onColorChange
     * @param {Object} event The event fired when changing the color map.
     */
    this.onColorChange = function (/*event*/)
    {  
        generateAndDrawImage();
    };

    /**
     * Handle slice change.
     * @method onSliceChange
     * @param {Object} event The event fired when changing the slice.
     */
    this.onSliceChange = function (/*event*/)
    {   
        generateAndDrawImage();
        if ( drawStage ) {
            // hide all draw layers
            for ( var i = 0; i < drawLayers.length; ++i ) {
                drawLayers[i].visible( false );
            }
            // show current draw layer
            var currentLayer = drawLayers[view.getCurrentPosition().k];
            currentLayer.visible( true );
            currentLayer.draw();
        }
    };

    /**
     * Resize the display window. To be called once the image is loaded.
     * @method resize
     */
    this.resize = function()
    {
        // previous width
        var oldWidth = parseInt(windowScale*dataWidth, 10);
        // find new best fit
        var size = dwv.gui.getWindowSize();
        windowScale = Math.min( (size.width / dataWidth), (size.height / dataHeight) );
        // new sizes
        var newWidth = parseInt(windowScale*dataWidth, 10);
        var newHeight = parseInt(windowScale*dataHeight, 10);
        // ratio previous/new to add to zoom
        var mul = newWidth / oldWidth;

        // resize container
        $("#layerContainer"+appExt).width(newWidth);
        $("#layerContainer"+appExt).height(newHeight + 1); // +1 to be sure...
        // resize image layer
        if( imageLayer ) {
            var iZoomX = imageLayer.getZoom().x * mul;
            var iZoomY = imageLayer.getZoom().y * mul;
            imageLayer.setWidth(newWidth);
            imageLayer.setHeight(newHeight);
            imageLayer.zoom(iZoomX, iZoomY, 0, 0);
            imageLayer.draw();
        }
        for (var i = 0; i < parametricMapLayers.length; ++i){
            var newPWidth = parseInt(windowScale*paraWidth, 10);
            var newPHeight = parseInt(windowScale*paraHeight, 10);
            paraMul = newHeight/newPHeight;
            var iZoomX = imageLayer.getZoom().x * paraMul;
            var iZoomY = imageLayer.getZoom().y * paraMul;
            parametricMapLayers[i].setWidth(newWidth);
            parametricMapLayers[i].setHeight(newHeight);
            parametricMapLayers[i].zoom(iZoomX, iZoomY, 0, 0);
        }
        if (parametricMapLayers.length > 0){
            parametricMapLayers[self.GetCurrentParametricMap()].draw();
        }
        // resize draw stage
        if( drawStage ) {
            // resize div
            $("#drawDiv"+appExt).width(newWidth);
            $("#drawDiv"+appExt).height(newHeight);
            // resize stage
            var stageZomX = drawStage.scale().x * mul;
            var stageZoomY = drawStage.scale().y * mul;
            drawStage.setWidth(newWidth);
            drawStage.setHeight(newHeight);
            drawStage.scale( {x: stageZomX, y: stageZoomY} );
            drawStage.draw();
        }

    };
    
    /**
     * Toggle the display of the info layer.
     * @method toggleInfoLayerDisplay
     */
    this.toggleInfoLayerDisplay = function()
    {
        // toggle html
        dwv.html.toggleDisplay('infoLayer'+appExt);
        // toggle listeners
        if( isInfoLayerListening ) {
            removeImageInfoListeners();
        }
        else {
            addImageInfoListeners();
        }
    };
    
    /**
     * Init the Window/Level display
     */
    this.initWLDisplay = function()
    {
        // set window/level
        var keys = Object.keys(dwv.tool.presets);
        dwv.tool.updateWindowingData(
            dwv.tool.presets[keys[0]].center, 
            dwv.tool.presets[keys[0]].width );
        // default position
        dwv.tool.updatePostionValue(0,0);
    };

    /**
     * Add layer mouse and touch listeners.
     * @method addLayerListeners
     */
    this.addLayerListeners = function(layer)
    {
        // allow pointer events
        layer.setAttribute("style", "pointer-events: auto;");
        // mouse listeners
        layer.addEventListener("mousedown", eventHandler);
        layer.addEventListener("mousemove", eventHandler);
        layer.addEventListener("mouseup", eventHandler);
        layer.addEventListener("mouseout", eventHandler);
        layer.addEventListener("mousewheel", eventHandler);
        layer.addEventListener("DOMMouseScroll", eventHandler);
        layer.addEventListener("dblclick", eventHandler);
        // touch listeners
        layer.addEventListener("touchstart", eventHandler);
        layer.addEventListener("touchmove", eventHandler);
        layer.addEventListener("touchend", eventHandler);
    };
    
    /**
     * Remove layer mouse and touch listeners.
     * @method removeLayerListeners
     */
    this.removeLayerListeners = function(layer)
    {
        // disable pointer events
        layer.setAttribute("style", "pointer-events: none;");
        // mouse listeners
        layer.removeEventListener("mousedown", eventHandler);
        layer.removeEventListener("mousemove", eventHandler);
        layer.removeEventListener("mouseup", eventHandler);
        layer.removeEventListener("mouseout", eventHandler);
        layer.removeEventListener("mousewheel", eventHandler);
        layer.removeEventListener("DOMMouseScroll", eventHandler);
        layer.removeEventListener("dblclick", eventHandler);
        // touch listeners
        layer.removeEventListener("touchstart", eventHandler);
        layer.removeEventListener("touchmove", eventHandler);
        layer.removeEventListener("touchend", eventHandler);
    };
    
    /**
     * Render the current image.
     * @method render
     */
    this.render = function ()
    {
        generateAndDrawImage();
    };

    // Private Methods -------------------------------------------

    /**
     * Generate the image data and draw it.
     * @method generateAndDrawImage
     */
    function generateAndDrawImage()
    {         
        // generate image data from DICOM
        view.generateImageData(imageData);         
        // set the image data of the layer
        imageLayer.setImageData(imageData);
        // draw the image
        imageLayer.draw();
    }
    
    /**
     * Add image listeners.
     * @method addImageInfoListeners
     * @private
     */
    function addImageInfoListeners()
    {
        if (!view)
            return;
        view.appExt = appExt;
        view.appType = appType;
        view.addEventListener("wlchange", dwv.info.updateWindowingDiv);
        view.addEventListener("wlchange", dwv.info.updateMiniColorMap);
        view.addEventListener("wlchange", dwv.info.updatePlotMarkings);
        view.addEventListener("colorchange", dwv.info.updateMiniColorMap);
        view.addEventListener("positionchange", dwv.info.updatePositionDiv);
        isInfoLayerListening = true;
    }
    
    /**
     * Remove image listeners.
     * @method removeImageInfoListeners
     * @private
     */
    function removeImageInfoListeners()
    {
        if (!view)
            return;
        view.appExt= appExt;
        view.removeEventListener("wlchange", dwv.info.updateWindowingDiv);
        view.removeEventListener("wlchange", dwv.info.updateMiniColorMap);
        view.removeEventListener("wlchange", dwv.info.updatePlotMarkings);
        view.removeEventListener("colorchange", dwv.info.updateMiniColorMap);
        view.removeEventListener("positionchange", dwv.info.updatePositionDiv);
        isInfoLayerListening = false;
    }
    
    /**
     * General-purpose event handler. This function just determines the mouse 
     * position relative to the canvas element. It then passes it to the current tool.
     * @method eventHandler
     * @private
     * @param {Object} event The event to handle.
     */
    function eventHandler(event)
    {
        // flag not to get confused between touch and mouse
        var handled = false;
        // Store the event position relative to the image canvas
        // in an extra member of the event:
        // event._x and event._y.
        var offsets = null;
        var position = null;
        if( event.type === "touchstart" ||
            event.type === "touchmove")
        {
            event.preventDefault();
            // event offset(s)
            offsets = dwv.html.getEventOffset(event);
            // should have at least one offset
            event._xs = offsets[0].x;
            event._ys = offsets[0].y;
            position = self.getImageLayer().displayToIndex( offsets[0] );
            event._x = position.x;
            event._y = position.y;
            //event._x = parseInt( position.x, 10 );
            //event._y = parseInt( position.y, 10 );
            // possible second
            if ( offsets.length === 2 ) {
                event._x1s = offsets[1].x;
                event._y1s = offsets[1].y;
                position = self.getImageLayer().displayToIndex( offsets[1] );
                event._x1 = position.x;
                event._y1 = position.y;
                //event._x1 = parseInt( position.x, 10 );
                //event._y1 = parseInt( position.y, 10 );
            }
            // set handle event flag
            handled = true;
        }
        else if( event.type === "mousemove" ||
            event.type === "mousedown" ||
            event.type === "mouseup" ||
            event.type === "mouseout" ||
            event.type === "mousewheel" ||
            event.type === "dblclick" ||
            event.type === "DOMMouseScroll" )
        {
            offsets = dwv.html.getEventOffset(event);
            event._xs = offsets[0].x;
            event._ys = offsets[0].y;
            position = self.getImageLayer().displayToIndex( offsets[0] );
            event._x = position.x;
            event._y = position.y;
            //event._x = parseInt( position.x, 10 );
            //event._y = parseInt( position.y, 10 );
            // set handle event flag
            handled = true;
        }
        else if( event.type === "keydown" || 
                event.type === "touchend")
        {
            handled = true;
        }
            
        // Call the event handler of the tool.
        if( handled )
        {
            interactionApp = self;
            if (appType == 'motility')
                var func = self.getToolBox().getSelectedTool()[event.type];
            else
                var func = self.getToolBox().getSelectedMedianTool()[event.type];
            if( func )
            {
                func(event);
            }
        }
    }
    
    /**
     * Handle a drag over.
     * @method onDragOver
     * @private
     * @param {Object} event The event to handle.
     */
    function onDragOver(event)
    {
        // prevent default handling
        event.stopPropagation();
        event.preventDefault();
        // update box 
        var box = document.getElementById("dropBox"+appExt);
        if ( box ) {
            box.className = 'hover';
        }
    }
    
    /**
     * Handle a drag leave.
     * @method onDragLeave
     * @private
     * @param {Object} event The event to handle.
     */
    function onDragLeave(event)
    {
        // prevent default handling
        event.stopPropagation();
        event.preventDefault();
        // update box 
        var box = document.getElementById("dropBox"+appExt);
        if ( box ) {
            box.className = '';
        }
    }

    /**
     * Handle a drop event.
     * @method onDrop
     * @private
     * @param {Object} event The event to handle.
     */
    function onDrop(event)
    {
        // prevent default handling
        event.stopPropagation();
        event.preventDefault();
        // load files
        self.loadFiles(event.dataTransfer.files);
    }

    /**
     * Handle an error: display it to the user.
     * @method handleError
     * @private
     * @param {Object} error The error to handle.
     */
    function handleError(error)
    {
        // alert window
        if( error.name && error.message) {
            alert(error.name+": "+error.message+".");
        }
        else {
            alert("Error: "+error+".");
        }
        // log
        if( error.stack ) {
            console.error(error.stack);
        }
    }
    
    /**
     * Create the application layers.
     * @method createLayers
     * @private
     * @param {Number} dataWidth The width of the input data.
     * @param {Number} dataHeight The height of the input data.
     */
    function createLayers(dataWidth, dataHeight)
    {
        // image layer
        imageLayer = new dwv.html.Layer("imageLayer"+appExt);
        imageLayer.initialise(dataWidth, dataHeight);
        imageLayer.fillContext();
        imageLayer.setStyleDisplay(true);
        // draw layer
        if( document.getElementById("drawDiv"+appExt) !== null) {
            // create stage
            drawStage = new Kinetic.Stage({
                container: 'drawDiv'+appExt,
                width: dataWidth,
                height: dataHeight,
                listening: false
            });
        }
        // resize app
        self.resetLayout();
        self.resize();
    }

    /**
     * Converts pixels coordinates to right-handed LPH (from right towards left,
     * anterior towards posterior, from inferior towards superior) coordinates
     * see: http://cmic.cs.ucl.ac.uk/fileadmin/cmic/Documents/DavidAtkinson/KCLDICOM_2011.pdf
     * @method imageToLPHCoords
     * @param number xCoord The x coordinate of the data point in image space
     * @param number yCoord The y coordinate of the data point in image space
     * @return {Array} A 3 point array containing the right-handed LPH coordinates
     */
    this.imageToLPHCoords = function(xCoord, yCoord){
        var pos = Array(3);

        for (var i = 0; i < 3; ++i)
            pos[i] = Number(info.ImagePositionPatient.value[i]) +
            xCoord * Number(info.ImageOrientationPatient.value[i]) * Number(info.PixelSpacing.value[1]) +
            yCoord * Number(info.ImageOrientationPatient.value[i+3]) * Number(info.PixelSpacing.value[0]);

        return pos;
    };
    
    /**
     * Post load application initialisation. To be called once the DICOM has been parsed.
     * @method postLoadInit
     * @param {Object} data The data to display.
     */
    this.postLoadInit = function (data)
    {
        // only initialise the first time
        if( view ) {
            return;
        }
        
        // get the view from the loaded data
        view = data.view;
        info = data.info;
        // append the DICOM tags table
        dwv.gui.appendTagsTable(data.info);
        // store image
        originalImage = view.getImage();
        image = originalImage;
        
        // layout
        dataWidth = image.getSize().getNumberOfColumns();
        dataHeight = image.getSize().getNumberOfRows();
        createLayers(dataWidth, dataHeight);
        
        // get the image data from the image layer
        imageData = imageLayer.getContext().createImageData( 
                dataWidth, dataHeight);

        // mouse and touch listeners
        self.addLayerListeners( imageLayer.getCanvas() );
        // keydown listener
        window.addEventListener("keydown", eventHandler, true);
        // image listeners
        view.addEventListener("wlchange", self.onWLChange);
        view.addEventListener("colorchange", self.onColorChange);

        if (appType == 'motility')
            view.addEventListener("slicechange", self.onSliceChange);
        
        // stop box listening to drag (after first drag)
        var box = document.getElementById("dropBox"+appExt);
        if ( box ) {
            box.removeEventListener("dragover", onDragOver);
            box.removeEventListener("dragleave", onDragLeave);
            box.removeEventListener("drop", onDrop);
            dwv.html.removeNode("dropBox"+appExt);
            // switch listening to layerContainer
            var div = document.getElementById("layerContainer"+appExt);
            div.addEventListener("dragover", onDragOver);
            div.addEventListener("dragleave", onDragLeave);
            div.addEventListener("drop", onDrop);
        }

        // info layer
        if(document.getElementById("infoLayer"+appExt)){
            dwv.info.createWindowingDiv(appExt);
            dwv.info.createPositionDiv(appExt);
            dwv.info.createMiniColorMap(appExt);
            dwv.info.createPlot(appType);
            addImageInfoListeners();
        }
        
        // initialise the toolbox
        if (appType == 'motility') {
            toolBox.init();
            toolBox.display(true);

        }
        else
        // init W/L display
        self.initWLDisplay();

    }
    
};
