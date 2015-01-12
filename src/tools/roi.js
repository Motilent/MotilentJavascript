/** 
 * Tool module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/**
 * Create a roi shape to be displayed.
 * @method RoiCreator
 * @static
 * @param {Array} points The points from which to extract the line.
 * @param {Style} style The drawing style.
 * @param Boolean finished
 */ 
dwv.tool.RoiCreator = function (points, style, image, finished)
{
    if (finished == undefined)
        finished = false;
    // physical shape
    var roi = new dwv.math.ROI();
    // add input points to the ROI
    roi.addPoints(points);

    var shape = dwv.roi.GetShapeFromRoi(roi, style.getLineColor(), interactionApp);
    if (finished){
        app.GetRoiRecord().AddRoiEntry('roi', style.getLineColor(), roi, shape);
    }

    // return shape
    return shape;
}; 

/**
 * Update a roi shape.
 * @method UpdateRoi
 * @static
 * @param {Object} kroi The roi shape to update.
 * @param {Object} anchor The active anchor.
 * @param Boolean finished
 */ 
dwv.tool.UpdateRoi = function (kroi, anchor, image, finished)
{
    if (finished == undefined)
        finished = false;

    // parent group
    var group = anchor.getParent();
    // update self
    var point = group.getChildren(function(node){
        return node.id() === anchor.id();
    })[0];
    point.x( anchor.x() );
    point.y( anchor.y() );
    // update the roi point and compensate for possible drag
    // (the anchor id is the index of the point in the list)
    var points = kroi.points();
    points[anchor.id()] = anchor.x() - kroi.x();
    points[anchor.id()+1] = anchor.y() - kroi.y();
    kroi.points( points );

    if (interactionApp.getType() == 'median'){
        // Update all other rois based on new points
        kroi.roiEntry.SetNewMedianROIPoints(points, finished);
    }
    else{
        kroi.roiEntry.SetNewMotilityROIPoints(points, finished);
    }
};

/**
 * Get the text for a line
 * @method GetROIText
 * @static
 * @param {Object} roi The ROI object
 * @param {Object} image The image object
 * @return String The text description string
 */
dwv.tool.GetROIText = function (roi, image){
    var quant = image.quantifyROI(roi.getPoints());
    return str = quant.area.toFixed(1) + "mm" + String.fromCharCode(0x00B2);
};

