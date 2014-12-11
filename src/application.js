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
    if (! (appType == 'motility' || appType == 'median'))
        throw "Unknown appType " + appType;
    var appExt = "";
    if (appType == 'median')
        appExt = '_med';

    // Image
    var image = null;
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

    // display window scale
    var windowScale = 1;
     
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
    this.getVersion = function() { return "v0.1"; };


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
        window.onresize = this.resize;
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
        fileIO.save("ROIs.csv");
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
        fileIO.onload = function (data) {



            var isFirst = true;

            if( image ) {
                image.appendSlice( data.view.getImage() );
                isFirst = false;
                if (deffField) {
                    deffField.SetColumns(image.getNumberOfColumns());
                    deffField.SetRows(image.getNumberOfRows());
                }
            }
            if (image  && image.getSize().getNumberOfSlices() == 15){
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
     * Load a deformation file.
     * @method loadDeformationFile
     * @param string file The file to load.
     */
    this.loadDeformationFile = function(file){
        var defIO = new dwv.io.DeformationFile();
        defIO.onload = function(data){
            deffField = data;
            if (image) {
                deffField.SetColumns(image.getSize().getNumberOfColumns());
                deffField.SetRows(image.getSize().getNumberOfRows());
            }
        };
        defIO.onerror= function(error){
            handleError(error);
        };

        defIO.load(file);

    };

    /**
     * Load a parametric map file.
     * @method loadParametricMapFile
     * @param string file The file to load.
     */
    this.loadParametricMapFile = function(file){
        var paraIO = new dwv.io.ParametricMapFile();
        paraIO.onload = function(data){

        };
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
