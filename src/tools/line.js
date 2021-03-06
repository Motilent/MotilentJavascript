/** 
 * Tool module.
 * @module tool
 */
var dwv = dwv || {};
dwv.tool = dwv.tool || {};
var Kinetic = Kinetic || {};

/**
 * Create a line shape to be displayed.
 * @method LineCreator
 * @static
 * @param {Array} points The points from which to extract the line.
 * @param {Style} style The drawing style.
 * @param {Object} image The image object
 * @param Boolean finished
 */ 
dwv.tool.LineCreator = function (points, style, image, finished)
{
    // physical object
    var line = new dwv.math.Line(points[0], points[points.length-1]);
    if (!line)
    return;

    var shape = dwv.roi.GetShapeFromLine(line, style.getLineColor(), interactionApp);

    if (finished){
        app.GetRoiRecord().AddRoiEntry('line', style.getLineColor(), line, shape);
    }

    // return shape
    return shape;

};

/**
 * Update a line shape.
 * @method UpdateLine
 * @static
 * @param {Object} kline The line shape to update.
 * @param {Object} anchor The active anchor.
 * @param {Object} image The image object
 */ 
dwv.tool.UpdateLine = function (kline, anchor, image, finished)
{
    if (finished == undefined)
        finished = false;

    // parent group
    var group = anchor.getParent();
    // find special points
    var begin = group.getChildren(function(node){
        return node.id() === 'begin';
    })[0];
    var end = group.getChildren(function(node){
        return node.id() === 'end';
    })[0];
    // update special points
    switch ( anchor.id() ) {
    case 'begin':
        begin.x( anchor.x() );
        begin.y( anchor.y() );
        break;
    case 'end':
        end.x( anchor.x() );
        end.y( anchor.y() );
        break;
    }
    // update shape and compensate for possible drag
    // note: shape.position() and shape.size() won't work...
    var bx = begin.x() - kline.x();
    var by = begin.y() - kline.y();
    var ex = end.x() - kline.x();
    var ey = end.y() - kline.y();
    var points = [bx,by,ex,ey];
    kline.points( points );


    if (interactionApp.getType() == 'median'){
        // Update all other rois based on new points
        kline.roiEntry.SetNewMedianROIPoints(points, finished);
    }
    else{
        kline.roiEntry.SetNewMotilityROIPoints(points, finished);
    }

return;
    // update text
    var ktext = group.getChildren(function(node){
        return node.name() === 'text';
    })[0];
    if ( ktext ) {
        // update quantification
        var p2d0 = new dwv.math.Point2D(begin.x(), begin.y());
        var p2d1 = new dwv.math.Point2D(end.x(), end.y());
        var line = new dwv.math.Line(p2d0, p2d1);
        var str = dwv.tool.GetLineText( line, image );
        var textPos = { 'x': line.getEnd().getX(), 'y': line.getEnd().getY() - 15 };
        ktext.position( textPos );
        ktext.text(str);
    }
};


/**
 * Get the text for a line
 * @static
 * @param {Object} line The line object
 * @param {Object} image The image object
 * @return String The text description string
 */
dwv.tool.GetLineText = function (line, image){
    var quant = image.quantifyLine( line );
    return quant.length.toPrecision(4) + " mm";
};
