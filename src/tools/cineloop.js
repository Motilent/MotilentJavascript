/**
 * Cineloop module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/**
 * Cineloop propagation tool.
 * @class Cineloop
 * @namespace dwv.tool
 * @constructor
 * @param {Object} motilityApp The associated motility application.
 */
dwv.tool.Cineloop = function (motilityApp) {

    /**
     * Closure to self: to be used by event handlers.
     * @property self
     * @private
     * @type WindowLevel
     */
    var self = this;


    /**
     * Enable the tool.
     * @method enable
     * @param {Boolean} flag The flag to enable or not.
     */
    this.display = function (flag) {
        dwv.gui.displayCineloopHtml(flag);
    };
};

/**
 * Help for this tool.
 * @method getHelp
 * @returns {Object} The help content.
 */
dwv.tool.Cineloop.prototype.getHelp = function()
{
    return {
        'title': "Cineloop",
        'brief': "Perform a constant loop through the motility images. " +
        "Changing the slider will adjust the rate at which the images are changed. "+
        "'Play' and 'Pause' will resume and pause looping."
    };
};


/**
 * Initialise the tool.
 * @method init
 */
dwv.tool.Cineloop.prototype.init = function() {
    dwv.gui.initCineloopHtml();
};
