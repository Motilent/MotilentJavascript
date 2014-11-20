/**
 * Propagate module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/**
 * Shape propagation tool.
 * @class Propagate
 * @namespace dwv.tool
 * @constructor
 * @param {Object} motilityApp The associated motility application.
 * @param {Object} medianApp The associated median application.
 * @oaram {Object} motilityDrawTool The motility draw tool
 * @param {Object} medianDrawTool The median draw tool
 */
dwv.tool.Propagate = function (motilityApp, medianApp, motilityDrawTool, medianDrawTool) {

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
        dwv.gui.displayPropagateHtml(flag);
    };

    /**
     * Copy all shape groups from the current median layer to the current layer of the motility viewer
     * @method copyMedianLayer
     */
    this.copyMedianLayer = function () {
        var sourceLayer = medianApp.getDrawLayer();
        for (var i = 0; i < sourceLayer.children.length; ++i) {
            var shapeGroup = sourceLayer.children[i].clone();

            // Transform all shapes in shapeGroup

            // Copy to other viewer
            shapeGroup.moveTo(motilityApp.getDrawLayer());
            motilityApp.getDrawLayer().draw();


            if (shapeGroup.children.length == 2) {
                motilityDrawTool.addToCreatedShapes({
                    "shape": shapeGroup.children[0],
                    "text": shapeGroup.children[1]
                });
            }
        }
    };

    /**
     * Copy all shape groups from the current median layer to all layers of the motility viewer
     * @method copyMedianLayer
     */
    this.copyMedianLayerToAll = function () {
        var sourceLayer = medianApp.getDrawLayer();
        var allDestinationLayers = app.getDrawLayers();

        for (var layer = 0; layer < allDestinationLayers.length; ++layer) {
        var destinationLayer = allDestinationLayers[layer];

            for (var i = 0; i < sourceLayer.children.length; ++i) {
                var shapeGroup = sourceLayer.children[i].clone();

                // Transform all shapes in shapeGroup

                // Copy to other viewer
                shapeGroup.moveTo(destinationLayer);
                destinationLayer.draw();


                if (shapeGroup.children.length == 2) {
                    motilityDrawTool.addToCreatedShapes({
                        "shape": shapeGroup.children[0],
                        "text": shapeGroup.children[1]
                    });
                }
            }
        }
    };

};


/**
 * Help for this tool.
 * @method getHelp
 * @returns {Object} The help content.
 */
dwv.tool.Propagate.prototype.getHelp = function()
{
    return {
        'title': "Propagate",
        'brief': "Propagate ROIs and lines from median image to motility image and vice-versa. " +
        "Selecting propagate all will propagate median ROIs to ALL motility images. "+
            "Selecting propagate one will propagate median ROIs to the CURRENT motility image. "
            //"Selecting back propagate will propagate ROIs from CURRENT motility image to the median image."
    };
};


/**
 * Initialise the tool.
 * @method init
 */
dwv.tool.Propagate.prototype.init = function() {
    dwv.gui.initPropagateHtml();
};
