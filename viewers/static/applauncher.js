/** 
 * Application launcher.
 */

// check browser support
dwv.browser.check();
// main application
var app = new dwv.App('motility');
var medianViewer = new dwv.App('median');

// launch when page is loaded
$(document).ready( function()
{
    // Setup zip library
    zip.workerScriptsPath = '../../ext/zipjs/';
    $("#progressbar").hide();

    $("#toggleInfoLayer").button({ icons: 
        { primary: "ui-icon-comment" }, text: false });
    // create dialogs
    $("#openData").dialog({ position: 
        {my: "left top", at: "left top", of: "#pageMain"} });
    $("#toolbox").dialog({ position: 
        {my: "left top+160", at: "left top", of: "#pageMain"}, height:225});
    //$("#history").dialog({ position:
     //   {my: "left top+350", at: "left top", of: "#pageMain"} });
    //$('#exportData').dialog({ position:
    //    {my: "left top+395", at: "left top", of: "#pageMain"} });

    $('#roirecords').dialog({ position:
    {my: "left top+395", at: "left top", of: "#pageMain"},
        height: 200});

    $("#tags").dialog({ position: 
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590 });
    $("#help").dialog({ position: 
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590 });


    // image dialog
    $("#layerDialog").dialog({ position: 
        {my: "left+320 top", at: "left top", of: "#pageMain"}});
    // default size
    $("#layerDialog").dialog({ width: "auto", resizable: false });
    // Resizable but keep aspect ratio
    // TODO it seems to add a border that bothers getting the cursor position...
    $("#layerContainer").resizable({ aspectRatio: true });


    // image dialog
    $("#layerDialog_med").dialog({ position:
    {my: "left+600 top", at: "left top", of: "#pageMain"}});
    // default size
    $("#layerDialog_med").dialog({ width: "auto", resizable: false });
    // Resizable but keep aspect ratio
    // TODO it seems to add a border that bothers getting the cursor position...
    $("#layerContainer_med").resizable({ aspectRatio: true });


    // Add required loaders to the loader list
    dwv.io.loaders = {};
    dwv.io.loaders["Data"] = dwv.io.ZipFile;
    dwv.io.loaders["ROI File"] = dwv.io.ExportROI;
    //dwv.io.loaders.file = dwv.io.File;
    //dwv.io.loaders.url = dwv.io.Url;
    //dwv.io.loaders["Deformation File"] = dwv.io.DeformationFile;
    //dwv.io.loaders["Parametric Map"] = dwv.io.ParametricMap;

    // Add exporters to exporter list
    dwv.io.exporters = {};
    dwv.io.exporters.ROIs = dwv.io.ExportROI;


    // append load container HTML
    dwv.gui.appendLoadboxHtml();
    // append loaders HTML
    dwv.gui.appendZipFileLoadHtml();
    dwv.gui.appendRoiFileLoadHtml();
    //dwv.gui.appendFileLoadHtml();

    //dwv.gui.appendUrlLoadHtml();
    //dwv.gui.appendDeformationLoadHtml();
    //dwv.gui.appendParametricMapLoadHtml();
    //dwv.gui.appendZipFileLoadHtml();
    dwv.gui.displayRoiFileLoadHtml(false);
    dwv.gui.displayZipFileLoadHtml(true);



    // append exporters HTML
    dwv.gui.appendExportboxHtml();
    dwv.gui.appendExportHtml();
    dwv.gui.displayExportHtml(true);


    // Add tools to the tool list
    dwv.tool.tools = {};
    dwv.tool.tools["Window/Level"] = new dwv.tool.WindowLevel(app);
    dwv.tool.tools["Zoom/Pan"] = new dwv.tool.ZoomAndPan(app);
    dwv.tool.tools["Zoom/Pan_med"] = new dwv.tool.ZoomAndPan(medianViewer);
    dwv.tool.tools.scroll = new dwv.tool.Scroll(app);
    dwv.tool.tools.draw = new dwv.tool.Draw(app);
    dwv.tool.tools.draw_med = new dwv.tool.Draw(medianViewer);
    dwv.tool.tools.draw.setSiblingTool(dwv.tool.tools.draw_med);
    dwv.tool.tools.draw_med.setSiblingTool(dwv.tool.tools.draw);
    //dwv.tool.tools.propagate = new dwv.tool.Propagate(app, medianViewer, dwv.tool.tools.draw, dwv.tool.tools.draw_med, dwv.tool.tools["Zoom/Pan"]);
    dwv.tool.tools.cineloop = new dwv.tool.Cineloop(app);
    medianViewer.setToolBox(app.getToolBox());

    dwv.io.exporters.ROIs.staticSetDrawTools(dwv.tool.tools.draw, dwv.tool.tools.draw_med);


    //dwv.tool.tools.livewire = new dwv.tool.Livewire(app);
    //dwv.tool.tools.filter = new dwv.tool.Filter(app);

    // Add filters to the filter list for the filter tool
    //dwv.tool.filters = {};
    //dwv.tool.filters.threshold = new dwv.tool.filter.Threshold(app);
    //dwv.tool.filters.sharpen = new dwv.tool.filter.Sharpen(app);
    //dwv.tool.filters.sobel = new dwv.tool.filter.Sobel(app);

    // Add shapes to the shape list for the draw tool
    dwv.tool.shapes = {};
    dwv.tool.shapes.line = dwv.tool.LineCreator;
    //dwv.tool.shapes.rectangle = dwv.tool.RectangleCreator;
    dwv.tool.shapes.poly = dwv.tool.RoiCreator;
    //dwv.tool.shapes.ellipse = dwv.tool.EllipseCreator;

    // append tool container HTML
    dwv.gui.appendToolboxHtml();
    // append tools HTML
    dwv.gui.appendWindowLevelHtml();
    dwv.gui.appendZoomAndPanHtml();
    dwv.gui.appendScrollHtml();
    dwv.gui.appendDrawHtml();
    dwv.gui.appendPropagateHtml();
    dwv.gui.appendCineloopHtml();

    dwv.gui.appendParametricMapSelector();
    //dwv.gui.appendLivewireHtml();
    
    // append filter container HTML
    //dwv.gui.appendFilterHtml();
    // append filters HTML
    //dwv.gui.filter.appendThresholdHtml();
    //dwv.gui.filter.appendSharpenHtml();
    //dwv.gui.filter.appendSobelHtml();
    
    // append help HTML
    dwv.gui.appendHelpHtml(false);
    dwv.gui.appendVersionHtml();
    //dwv.gui.appendUndoHtml();

    // initialise the application
    app.init();
    medianViewer.init();

    // help
    // TODO Seems accordion only works when at end...
    $("#accordion").accordion({ collapsible: "true", active: "false", heightStyle: "content" });
});
