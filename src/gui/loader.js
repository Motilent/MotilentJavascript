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
dwv.gui.base = dwv.gui.base || {};





/**
 * Append the loadbox HTML to the page.
 * @method appendLoadboxHtml
 * @static
 */
dwv.gui.base.appendLoadboxHtml = function()
{
    // loader select
    var loaderSelector = dwv.html.createHtmlSelect("loaderSelect",dwv.io.loaders);
    loaderSelector.onchange = dwv.gui.onChangeLoader;
    
    // node
    var node = document.getElementById("loaderlist");
    // clear it
    while(node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
    // append
    node.appendChild(loaderSelector);
    // trigger create event (mobile)
    $("#loaderlist").trigger("create");
};

/**
 * Append the file load HTML to the page.
 * @method appendFileLoadHtml
 * @static
 */
dwv.gui.base.appendFileLoadHtml = function()
{
    // input
    var fileLoadInput = document.createElement("input");
    fileLoadInput.onchange = dwv.gui.onChangeFiles;
    fileLoadInput.type = "file";
    fileLoadInput.multiple = true;
    fileLoadInput.id = "imagefiles";
    fileLoadInput.setAttribute("data-clear-btn","true");
    fileLoadInput.setAttribute("data-mini","true");

    // associated div
    var fileLoadDiv = document.createElement("div");
    fileLoadDiv.id = "imagefilesdiv";
    fileLoadDiv.style.display = "none";
    fileLoadDiv.appendChild(fileLoadInput);
    
    // node
    var node = document.getElementById("loaderlist");
    // append
    node.appendChild(fileLoadDiv);
    // trigger create event (mobile)
    $("#loaderlist").trigger("create");
};

/**
 * Display the file load HTML.
 * @method displayFileLoadHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayFileLoadHtml = function(bool)
{
    // file div element
    var filediv = document.getElementById("imagefilesdiv");
    filediv.style.display = bool ? "" : "none";
};

/**
 * Append the zip file load HTML to the page.
 * @method appendZipFileLoadHtml
 * @static
 */
dwv.gui.base.appendZipFileLoadHtml = function()
{
    // input
    var fileLoadInput = document.createElement("input");
    fileLoadInput.onchange = dwv.gui.onChangeZipFile;
    fileLoadInput.type = "file";
    fileLoadInput.multiple = false;
    fileLoadInput.id = "zipfile";
    fileLoadInput.setAttribute("data-clear-btn","true");
    fileLoadInput.setAttribute("data-mini","true");

    // associated div
    var fileLoadDiv = document.createElement("div");
    fileLoadDiv.id = "zipfilesdiv";
    fileLoadDiv.style.display = "none";
    fileLoadDiv.appendChild(fileLoadInput);

    // node
    var node = document.getElementById("loaderlist");
    // append
    node.appendChild(fileLoadDiv);
    // trigger create event (mobile)
    $("#loaderlist").trigger("create");
};

/**
 * Display the zip file load HTML.
 * @method displayFileLoadHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayZipFileLoadHtml = function(bool)
{
    // file div element
    var filediv = document.getElementById("zipfilesdiv");
    filediv.style.display = bool ? "" : "none";
};



/**
 * Append the file deformation HTML to the page.
 * @method appendDeformationLoadHtml
 * @static
 */
dwv.gui.base.appendDeformationLoadHtml = function()
{
    // input
    var fileLoadInput = document.createElement("input");
    fileLoadInput.onchange = dwv.gui.onChangeDeformationFile;
    fileLoadInput.type = "file";
    fileLoadInput.multiple = false;
    fileLoadInput.id = "deformationfiles";
    fileLoadInput.setAttribute("data-clear-btn","true");
    fileLoadInput.setAttribute("data-mini","true");

    // associated div
    var fileLoadDiv = document.createElement("div");
    fileLoadDiv.id = "deformationfilesdiv";
    fileLoadDiv.style.display = "none";
    fileLoadDiv.appendChild(fileLoadInput);

    // node
    var node = document.getElementById("loaderlist");
    // append
    node.appendChild(fileLoadDiv);
    // trigger create event (mobile)
    $("#loaderlist").trigger("create");
};

/**
 * Display the deformation load HTML.
 * @method displayDeformationLoadHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayDeformationLoadHtml = function(bool)
{
    // file div element
    var filediv = document.getElementById("deformationfilesdiv");
    filediv.style.display = bool ? "" : "none";
};


/**
 * Append the file parametric map HTML to the page.
 * @method appendParametricMapLoadHtml
 * @static
 */
dwv.gui.base.appendParametricMapLoadHtml = function()
{
    // input
    var fileLoadInput = document.createElement("input");
    fileLoadInput.onchange = dwv.gui.onChangeParametricMapFile;
    fileLoadInput.type = "file";
    fileLoadInput.multiple = false;
    fileLoadInput.id = "paremetricmapfiles";
    fileLoadInput.setAttribute("data-clear-btn","true");
    fileLoadInput.setAttribute("data-mini","true");

    // associated div
    var fileLoadDiv = document.createElement("div");
    fileLoadDiv.id = "parametricmapfilesdiv";
    fileLoadDiv.style.display = "none";
    fileLoadDiv.appendChild(fileLoadInput);

    // node
    var node = document.getElementById("loaderlist");
    // append
    node.appendChild(fileLoadDiv);
    // trigger create event (mobile)
    $("#loaderlist").trigger("create");
};

/**
 * Display the parametric map load HTML.
 * @method displayParametricMapLoadHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayParametricMapLoadHtml = function(bool)
{
    // file div element
    var filediv = document.getElementById("parametricmapfilesdiv");
    filediv.style.display = bool ? "" : "none";
};

/**
 * Append the exportbox HTML to the page.
 * @method appendExportboxHtml
 * @static
 */
dwv.gui.base.appendExportboxHtml = function(){
    // exporter select
    var exporterSelector = dwv.html.createHtmlSelect("exporterSelect",dwv.io.exporters);
    exporterSelector.onchange = dwv.gui.onChangeExporter;

    // node
    var node = document.getElementById("exporterlist");
    // clear it
    while(node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
    // append
    node.appendChild(exporterSelector);
    // trigger create event (mobile)
    $("#exporterlist").trigger("create");
};

/**
 * Append the export HTML to the page.
 * @method appendExportHtml
 * @static
 */
dwv.gui.base.appendExportHtml = function(){
    // input
    var exportOutput = document.createElement("input");
    exportOutput.onclick = dwv.gui.onExportRois;
    exportOutput.type = "button";
    exportOutput.multiple = true;
    exportOutput.id = "exportrois";
    exportOutput.value = "Export File";
    exportOutput.setAttribute("data-clear-btn","true");
    exportOutput.setAttribute("data-mini","true");

    // associated div
    var fileLoadDiv = document.createElement("div");
    fileLoadDiv.id = "roifilesdiv";
    fileLoadDiv.style.display = "none";
    fileLoadDiv.appendChild(exportOutput);

    // node
    var node = document.getElementById("exporterlist");
    // append
    node.appendChild(fileLoadDiv);
    // trigger create event (mobile)
    $("#exporterlist").trigger("create");
};

/**
 * Display the export HTML.
 * @method displayExportHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayExportHtml = function(bool){
    // file div element
    var filediv = document.getElementById("roifilesdiv");
    filediv.style.display = bool ? "" : "none";
};

/**
 * Append the url load HTML to the page.
 * @method appendUrlLoadHtml
 * @static
 */
dwv.gui.base.appendUrlLoadHtml = function()
{
    // input
    var urlLoadInput = document.createElement("input");
    urlLoadInput.onchange = dwv.gui.onChangeURL;
    urlLoadInput.type = "url";
    urlLoadInput.id = "imageurl";
    urlLoadInput.setAttribute("data-clear-btn","true");
    urlLoadInput.setAttribute("data-mini","true");

    // associated div
    var urlLoadDiv = document.createElement("div");
    urlLoadDiv.id = "imageurldiv";
    urlLoadDiv.style.display = "none";
    urlLoadDiv.appendChild(urlLoadInput);

    // node
    var node = document.getElementById("loaderlist");
    // append
    node.appendChild(urlLoadDiv);
    // trigger create event (mobile)
    $("#loaderlist").trigger("create");
};

/**
 * Display the url load HTML.
 * @method clearUrlLoadHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayUrlLoadHtml = function(bool)
{
    // url div element
    var urldiv = document.getElementById("imageurldiv");
    urldiv.style.display = bool ? "" : "none";
};
