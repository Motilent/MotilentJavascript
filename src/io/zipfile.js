/**
 * I/O module.
 * @module io
 */
var dwv = dwv || {};
dwv.io = dwv.io || {};

/**
 * Zip file loader.
 * @class ZipFile
 * @namespace dwv.io
 * @constructor
 */
dwv.io.ZipFile = function()
{
    this.onerror = null;
    this.onloadDICOM = null;
    this.onloadParametric = null;
    this.onloadDeformation = null;
};

/**
 * Load a file.
 * @method load
 * @param Blob file The file to load.
 */
dwv.io.ZipFile.prototype.load = function(file)
{
    // create closure to the onload method
    var onloadDICOM = this.onloadDICOM;
    var onloadParametric = this.onloadParametric;
    var onloadDeformation = this.onloadDeformation;
    var onerror = this.onerror;

    // Request error
    var onErrorDicomReader = function(event)
    {
        onerror( {'name': "RequestError",
            'message': "An error occurred while reading the DICOM file: "+event.getMessage() } );
    };

    // DICOM reader loader
    var onLoadDicomReader = function(event)
    {
        // parse DICOM file
        try {
            var tmpdata = dwv.image.getDataFromDicomBuffer(event.target.result);
            tmpdata.file = event.target.file;
            // call listener
            onloadDICOM(tmpdata);
        } catch(error) {
            onerror(error);
        }
        // force 100% progress (sometimes with firefox)
        var endEvent = {lengthComputable: true, loaded: 1, total: 1};
        dwv.gui.updateProgress(endEvent);

        if (++dicomLoadCount == dicomEntries.length){
            self.loadParametricMapEntries();
        }

    };

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
            onloadParametric(tmpdata);
        } catch(error) {
            onerror(error);
        }
        // force 100% progress (sometimes with firefox)
        var endEvent = {lengthComputable: true, loaded: 1, total: 1};
        dwv.gui.updateProgress(endEvent);
        if (++parametricLoadCount == parametricMapEntries.length){
            self.loadDeformationFieldEntries();
        }
    };

    // Request error
    var onErrorDeformationReader = function(event)
    {
        onerror( {'name': "RequestError",
            'message': "An error occurred while reading the DICOM file: "+event.getMessage() } );
    };

    // deformation reader loader
    var onLoadDeformationReader = function(event)
    {
        // parse file
        try {
            var tmpdata = dwv.deformationfield.getDataFromBuffer(event.target.result);
            // call listener
            onloadDeformation(tmpdata);
        } catch(error) {
            onerror(error);
        }
        // force 100% progress (sometimes with firefox)
        var endEvent = {lengthComputable: true, loaded: 1, total: 1};
        dwv.gui.updateProgress(endEvent);
    };

    // Create file bins for DICOM files, deformation field, and parametric maps
    var dicomEntries = [];
    var parametricMapEntries = [];
    var deformationFieldEntries = [];

    var dicomLoadCount = 0;
    var parametricLoadCount = 0;

    var self = this;

    this.loadDicomEntries = function(){
        for (var i = 0; i < dicomEntries.length; ++i) {
            dicomEntries[i].getData(new zip.BlobWriter(), function(file){
                var fr = new FileReader();
                fr.onload = onLoadDicomReader;
                fr.onprogress = dwv.gui.updateProgress;
                fr.onerror = onErrorDicomReader;
                fr.fileio = this;
                fr.file = file;
                fr.readAsArrayBuffer(file);
            }, function(current, total) {

            });
        }
    };
    this.loadParametricMapEntries = function(){
        for (var i = 0; i < parametricMapEntries.length; ++i) {
            parametricMapEntries[i].getData(new zip.BlobWriter(), function(file){
                var fr = new FileReader();
                fr.onload = onLoadParametricReader;
                fr.onprogress = dwv.gui.updateProgress;
                fr.onerror = onErrorParametricReader;
                fr.readAsArrayBuffer(file);
            }, function(current, total) {

            });
        }
    };
    this.loadDeformationFieldEntries = function(){
        for (var i = 0; i < deformationFieldEntries.length; ++i) {
            deformationFieldEntries[i].getData(new zip.BlobWriter(), function(file){
                var fr = new FileReader();
                fr.onload = onLoadDeformationReader;
                fr.onprogress = dwv.gui.updateProgress;
                fr.onerror = onErrorDeformationReader;
                fr.readAsArrayBuffer(file);
            }, function(current, total) {
                //dwv.gui.updateProgress();
            });
        }
    };

    zip.loadDicomEntries = this.loadDicomEntries;
    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.BlobReader(file), function(reader) {

        // get all entries from the zip
        reader.getEntries(function(entries) {
            if (entries.length) {

                var i = 0;
                for (i = 0; i < entries.length; ++i){
                    if (entries[i].filename.match(/^dicom/i)){
                        dicomEntries.push(entries[i]);
                    }
                    else if (entries[i].filename.match(/^para/i)){
                        parametricMapEntries.push(entries[i]);
                    }
                    else if (entries[i].filename.match(/^defor/i)){
                        deformationFieldEntries.push(entries[i]);
                    }
                }

                // First process dicom files
                zip.loadDicomEntries();

                // Now process parametric map files


                // Now process deformation map files

            }
        });
    }, function(error) {
        // onerror callback
    });
};
