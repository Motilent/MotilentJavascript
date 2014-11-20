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
 */ 
dwv.tool.RoiCreator = function (points, style, image)
{
    // physical shape
    var roi = new dwv.math.ROI();
    // add input points to the ROI
    roi.addPoints(points);
    // points stored the kineticjs way
    var arr = [];
    for( var i = 1; i < roi.getLength(); ++i )
    {
        arr = arr.concat( roi.getPoint(i).getX() );
        arr = arr.concat( roi.getPoint(i).getY() );
    }
    // shape
    var kline = new Kinetic.Line({
        points: arr,
        stroke: style.getLineColor(),
        fill: tinycolor(style.getLineColor()).setAlpha(0.2).toString(),
        strokeWidth: 3 / interactionApp.getDrawStage().scale().x,
        name: "shape",
        closed: true,
        tension: 0.3
    });
    // quantification
    var quant = image.quantifyROI(points);
    var str = quant.area.toPrecision(4) + "mm" +String.fromCharCode(0x00B2);
    var ktext = new Kinetic.Text({
        x: points[0].getX(),
        y: points[0].getY(),
        text: str,
        fontSize: 20 / interactionApp.getDrawStage().scale().x,
        fontFamily: "Verdana",
        fill: style.getLineColor(),
        name: "text"
    });
    // return shape
    return {"shape": kline, "text": ktext};
}; 

/**
 * Update a roi shape.
 * @method UpdateRoi
 * @static
 * @param {Object} kroi The line shape to update.
 * @param {Object} anchor The active anchor.
 */ 
dwv.tool.UpdateRoi = function (kroi, anchor, image)
{
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


    var pointArr = [];
    for (var i =0; i < points.length; i+=2)
        pointArr.push(new dwv.math.Point2D(points[i],points[i+1]));
    // update text
    var ktext = group.getChildren(function(node){
        return node.name() === 'text';
    })[0];
    if ( ktext ) {
        var quant = image.quantifyROI( pointArr );
        var str = quant.area.toPrecision(4) + "mm" +String.fromCharCode(0x00B2);
        ktext.text(str);
    }
};
