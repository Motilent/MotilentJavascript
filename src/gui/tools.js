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
 * Append the toolbox HTML to the page.
 * @method appendToolboxHtml
 * @static
 */
dwv.gui.base.appendToolboxHtml = function()
{
    // tool select
    var toolSelector = dwv.html.createHtmlSelect("toolSelect",dwv.tool.tools);
    toolSelector.onchange = dwv.gui.onChangeTool;
    
    // tool list element
    var toolLi = document.createElement("li");
    toolLi.id = "toolLi";
    toolLi.style.display = "none";
    toolLi.appendChild(toolSelector);
    toolLi.setAttribute("class","ui-block-a");

    // node
    var node = document.getElementById("toolList");
    // clear it
    while(node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
    // append
    node.appendChild(toolLi);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the toolbox HTML.
 * @method displayToolboxHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayToolboxHtml = function(bool)
{
    // tool list element
    dwv.html.displayElement("toolLi", bool);
};

/**
 * Initialise the toolbox HTML.
 * @method initToolboxHtml
 * @static
 */
dwv.gui.base.initToolboxHtml = function()
{
    // tool select: reset selected option
    var toolSelector = document.getElementById("toolSelect");
    toolSelector.selectedIndex = 0;
    dwv.gui.refreshSelect("#toolSelect");
};

/**
 * Append the window/level HTML to the page.
 * @method appendWindowLevelHtml
 * @static
 */
dwv.gui.base.appendWindowLevelHtml = function()
{
    // preset select
    var wlSelector = dwv.html.createHtmlSelect("presetSelect",dwv.tool.presets);
    wlSelector.onchange = dwv.gui.onChangeWindowLevelPreset;
    // colour map select
    var cmSelector = dwv.html.createHtmlSelect("colourMapSelect",dwv.tool.colourMaps);
    cmSelector.onchange = dwv.gui.onChangeColourMap;

    // preset list element
    var wlLi = document.createElement("li");
    wlLi.id = "wlLi";
    wlLi.style.display = "none";
    wlLi.appendChild(wlSelector);
    wlLi.setAttribute("class","ui-block-b");
    // color map list element
    var cmLi = document.createElement("li");
    cmLi.id = "cmLi";
    cmLi.style.display = "none";
    cmLi.appendChild(cmSelector);
    cmLi.setAttribute("class","ui-block-c");

    // node
    var node = document.getElementById("toolList");
    // append preset
    node.appendChild(wlLi);
    // append color map
    node.appendChild(cmLi);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the window/level HTML.
 * @method displayWindowLevelHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayWindowLevelHtml = function(bool)
{
    // presets list element
    dwv.html.displayElement("wlLi", bool);
    // color map list element
    dwv.html.displayElement("cmLi", bool);
};

/**
 * Initialise the window/level HTML.
 * @method initWindowLevelHtml
 * @static
 */
dwv.gui.base.initWindowLevelHtml = function()
{
    // create new preset select
    var wlSelector = dwv.html.createHtmlSelect("presetSelect",dwv.tool.presets);
    wlSelector.onchange = dwv.gui.onChangeWindowLevelPreset;
    wlSelector.title = "Select w/l preset.";
    
    // copy html list
    var wlLi = document.getElementById("wlLi");
    // clear node
    dwv.html.cleanNode(wlLi);
    // add children
    wlLi.appendChild(wlSelector);
    $("#toolList").trigger("create");
    
    // colour map select
    var cmSelector = document.getElementById("colourMapSelect");
    cmSelector.selectedIndex = 0;
    // special monochrome1 case
    if( app.getImage().getPhotometricInterpretation() === "MONOCHROME1" )
    {
        cmSelector.selectedIndex = 1;
    }
    dwv.gui.refreshSelect("#colourMapSelect");
};

/**
 * Append the draw HTML to the page.
 * @method appendDrawHtml
 * @static
 */
dwv.gui.base.appendDrawHtml = function()
{
    // shape select
    var shapeSelector = dwv.html.createHtmlSelect("shapeSelect",dwv.tool.shapes);
    shapeSelector.onchange = dwv.gui.onChangeShape;
    // colour select
    var colourSelector = dwv.html.createHtmlSelect("colourSelect",dwv.tool.colors);
    colourSelector.onchange = dwv.gui.onChangeLineColour;

    // shape list element
    var shapeLi = document.createElement("li");
    shapeLi.id = "shapeLi";
    shapeLi.style.display = "none";
    shapeLi.appendChild(shapeSelector);
    shapeLi.setAttribute("class","ui-block-c");
    // colour list element
    var colourLi = document.createElement("li");
    colourLi.id = "colourLi";
    colourLi.style.display = "none";
    colourLi.appendChild(colourSelector);
    colourLi.setAttribute("class","ui-block-b");
    
    // node
    var node = document.getElementById("toolList");
    // append shape
    node.appendChild(shapeLi);
    // append color
    node.appendChild(colourLi);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the draw HTML.
 * @method displayDrawHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayDrawHtml = function(bool)
{
    // color list element
    dwv.html.displayElement("colourLi", bool);
    // shape list element
    dwv.html.displayElement("shapeLi", bool);
};

/**
 * Initialise the draw HTML.
 * @method displayDrawHtml
 * @static
 * */
dwv.gui.base.initDrawHtml = function()
{
    // shape select: reset selected option
    var shapeSelector = document.getElementById("shapeSelect");
    shapeSelector.selectedIndex = 0;
    dwv.gui.refreshSelect("#shapeSelect");
    // color select: reset selected option
    var colourSelector = document.getElementById("colourSelect");
    colourSelector.selectedIndex = 0;
    dwv.gui.refreshSelect("#colourSelect");
};



/**
 * Append the propagate HTML to the page.
 * @method appendPropagateHtml
 * @static
 */
dwv.gui.base.appendPropagateHtml = function()
{
    // propagate median to all motility
    var allButton = document.createElement("button");
    allButton.id = "propagateAllButton";
    allButton.name = "propagateAllButton";
    allButton.onclick = dwv.gui.copyToAllLayers;
    allButton.setAttribute("style","width:100%; margin-top:0.5em;");
    allButton.setAttribute("class","ui-btn ui-btn-b");
    var text = document.createTextNode("Propagate All");
    allButton.appendChild(text);

    // propagate median to one motility
    var oneButton = document.createElement("button");
    oneButton.id = "propagateOneButton";
    oneButton.name = "propagateOneButton";
    oneButton.onclick = dwv.gui.copyOneLayer;
    oneButton.setAttribute("style","width:100%; margin-top:0.5em;");
    oneButton.setAttribute("class","ui-btn ui-btn-b");
    text = document.createTextNode("Propagate One");
    oneButton.appendChild(text);

    // propagate current motility to median
    /*
    var backButton = document.createElement("button");
    backButton.id = "propagateBackButton";
    backButton.name = "propagateBackButton";
    //backButton.onclick = dwv.gui.onZoomReset;
    backButton.setAttribute("style","width:100%; margin-top:0.5em;");
    backButton.setAttribute("class","ui-btn ui-btn-b");
    text = document.createTextNode("Back Propagate");
    backButton.appendChild(text);
*/
    // list element
    var liAllElement = document.createElement("li");
    liAllElement.id = "propagateAllLi";
    liAllElement.style.display = "none";
    liAllElement.setAttribute("class","ui-block-c");
    liAllElement.appendChild(allButton);

    // list element
    var liOneElement = document.createElement("li");
    liOneElement.id = "propagateOneLi";
    liOneElement.style.display = "none";
    liOneElement.setAttribute("class","ui-block-c");
    liOneElement.appendChild(oneButton);
/*
    // list element
    var liBackElement = document.createElement("li");
    liBackElement.id = "propagateBackLi";
    liBackElement.style.display = "none";
    liBackElement.setAttribute("class","ui-block-c");
    liBackElement.appendChild(backButton);
*/
    // node
    var node = document.getElementById("toolList");
    // append element
    node.appendChild(liAllElement);
    node.appendChild(liOneElement);
    //node.appendChild(liBackElement);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the propagate HTML.
 * @method displayPropagateHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayPropagateHtml = function(bool)
{
    // propagate buttons
    dwv.html.displayElement("propagateAllLi", bool);
    dwv.html.displayElement("propagateOneLi", bool);
    dwv.html.displayElement("propagateBackLi", bool);

};

/**
 * Initialise the propagate HTML.
 * @method displayPropagateHtml
 * @static
 * */
dwv.gui.base.initPropagateHtml = function()
{
    // Nothing to do here
};

/**
 * Append the color chooser HTML to the page.
 * @method appendLivewireHtml
 * @static
 */
dwv.gui.base.appendLivewireHtml = function()
{
    // colour select
    var colourSelector = dwv.html.createHtmlSelect("lwColourSelect",dwv.tool.colors);
    colourSelector.onchange = dwv.gui.onChangeLineColour;
    
    // colour list element
    var colourLi = document.createElement("li");
    colourLi.id = "lwColourLi";
    colourLi.style.display = "none";
    colourLi.setAttribute("class","ui-block-b");
    colourLi.appendChild(colourSelector);
    
    // node
    var node = document.getElementById("toolList");
    // apend colour
    node.appendChild(colourLi);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the livewire HTML.
 * @method displayLivewireHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayLivewireHtml = function(bool)
{
    // colour list
    dwv.html.displayElement("lwColourLi", bool);
};

/**
 * Initialise the livewire HTML.
 * @method initLivewireHtml
 * @static
 */
dwv.gui.base.initLivewireHtml = function()
{
    var colourSelector = document.getElementById("lwColourSelect");
    colourSelector.selectedIndex = 0;
    dwv.gui.refreshSelect("#lwColourSelect");
};

/**
 * Append the Cineloop HTML to the page.
 * @method appendCineloopHtml
 * @static
 */
dwv.gui.base.appendCineloopHtml = function()
{
    // play button
    var playbutton = document.createElement("button");
    playbutton.id = "cineloopPlayButton";
    playbutton.name = "cineloopPlayButton";
    playbutton.onclick = dwv.gui.onCineloopPlay;
    playbutton.setAttribute("style","width:100%; margin-top:0.5em;");
    playbutton.setAttribute("class","ui-btn ui-btn-b");

    // pause button
    var pauseButton = document.createElement("button");
    pauseButton.id = "cineloopPauseButton";
    pauseButton.name = "cineloopPauseButton";
    pauseButton.onclick = dwv.gui.onCineloopPause;
    pauseButton.setAttribute("style","width:100%; margin-top:0.5em;");
    pauseButton.setAttribute("class","ui-btn ui-btn-b");

    // speed slider
    var slider = document.createElement("input");
    slider.type="range";
    slider.id = "cineloopSlider";
    slider.name = "cineloopSlider";
    slider.id = "cineloopSlider";
    slider.onchange = dwv.gui.onCineloopSlider;
    slider.setAttribute("style","width:100px; margin-top:0.5em;");
    slider.setAttribute("min", "1");
    slider.setAttribute("max", "100");
    slider.setAttribute("value", "50");

    var text = document.createTextNode("Play");
    playbutton.appendChild(text);
    text = document.createTextNode("Pause");
    pauseButton.appendChild(text);

    // list element
    var liElement = document.createElement("li");
    liElement.id = "cineloopLi";
    liElement.style.display = "none";
    liElement.setAttribute("class","ui-block-c");
    liElement.appendChild(playbutton);
    liElement.appendChild(pauseButton);
    liElement.appendChild(slider);

    // node
    var node = document.getElementById("toolList");
    // append element
    node.appendChild(liElement);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the Cineloop HTML.
 * @method displayCineloopHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayCineloopHtml = function(bool)
{
    // display list element
    dwv.html.displayElement("cineloopLi", bool);
};

/**
 * Initialise the Cineloop HTML.
 * @method displayCineloopHtml
 * @static
 * */
dwv.gui.base.initCineloopHtml = function()
{
    // Nothing to do here
};

/**
 * Append the ZoomAndPan HTML to the page.
 * @method appendZoomAndPanHtml
 * @static
 */
dwv.gui.base.appendZoomAndPanHtml = function()
{
    // reset button
    var button = document.createElement("button");
    button.id = "zoomResetButton";
    button.name = "zoomResetButton";
    button.onclick = dwv.gui.onZoomReset;
    button.setAttribute("style","width:100%; margin-top:0.5em;");
    button.setAttribute("class","ui-btn ui-btn-b");
    var text = document.createTextNode("Reset");
    button.appendChild(text);
    
    // list element
    var liElement = document.createElement("li");
    liElement.id = "zoomLi";
    liElement.style.display = "none";
    liElement.setAttribute("class","ui-block-c");
    liElement.appendChild(button);
    
    // node
    var node = document.getElementById("toolList");
    // append element
    node.appendChild(liElement);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the ZoomAndPan HTML.
 * @method displayZoomAndPanHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayZoomAndPanHtml = function(bool)
{
    // display list element
    dwv.html.displayElement("zoomLi", bool);
};

/**
 * Append the Scroll HTML to the page.
 * @method appendScrollHtml
 * @static
 */
dwv.gui.base.appendScrollHtml = function()
{
    // list element
    var liElement = document.createElement("li");
    liElement.id = "scrollLi";
    liElement.style.display = "none";
    liElement.setAttribute("class","ui-block-c");
    
    // node
    var node = document.getElementById("toolList");
    // append element
    node.appendChild(liElement);
    // trigger create event (mobile)
    $("#toolList").trigger("create");
};

/**
 * Display the Scroll HTML.
 * @method displayScrollHtml
 * @static
 * @param {Boolean} bool True to display, false to hide.
 */
dwv.gui.base.displayScrollHtml = function(bool)
{
    // display list element
    dwv.html.displayElement("scrollLi", bool);
};
