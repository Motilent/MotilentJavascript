/**
 * ROI record module.
 * @module roi
 */
var dwv = dwv || {};
dwv.roi = dwv.roi || {};

dwv.roi.strokeWidth = 3;
dwv.roi.fontSize = 20;
dwv.roi.textOffset = 10;
/**
 * Create a roi shape to be displayed.
 * @method GetShapeFromRoi
 * @static
 * @param Object roi The roi object (from dwv.math.ROI)
 * @param String colour The roi colour
 * @param Object displayApp The app window on which to display
 */
dwv.roi.GetShapeFromRoi = function(roi, colour, displayApp){

    var image = displayApp.getImage();

    var points = roi.getPoints();
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
        stroke: colour,
        fill: tinycolor(colour).setAlpha(0.2).toString(),
        strokeWidth: dwv.roi.strokeWidth / displayApp.getDrawStage().scale().x,
        name: "shape",
        closed: true,
        tension: 0.3
    });

    // quantification
    var str = dwv.tool.GetROIText(roi, image);
    // Find highest y position
    var topPoint = points[0];
    for (var i = 1; i < points.length; ++i){
        if (points[i].getY() > topPoint.getY())
            topPoint = points[i];
    }
    var ktext = new Kinetic.Text({
        x: topPoint.getX(),
        y: topPoint.getY() + dwv.roi.textOffset / displayApp.getDrawStage().scale().x,
        text: str,
        fontSize: dwv.roi.fontSize / displayApp.getDrawStage().scale().x,
        fontFamily: "Verdana",
        fill: colour,
        name: "text"
    });
    // return shape
    return {"shape": kline, "text": ktext};
};


/**
 * Create a line shape to be displayed.
 * @method GetShapeFromLine
 * @static
 * @param Object roi The line object (from dwv.math.Line)
 * @param String colour The line colour
 * @param Object displayApp The app window on which to display
 */
dwv.roi.GetShapeFromLine = function(line, colour, displayApp){

    var image = displayApp.getImage();

    // shape
    var kline = new Kinetic.Line({
        points: [line.getBegin().getX(), line.getBegin().getY(),
            line.getEnd().getX(), line.getEnd().getY() ],
        stroke: colour,
        strokeWidth: dwv.roi.strokeWidth / displayApp.getDrawStage().scale().x,
        name: "shape"
    });

    var pointArr = line.getPoints();
    var topPoint = pointArr[0];
    for (var i = 1; i < pointArr.length; ++i){
        if (pointArr[i].getY() > topPoint.getY())
            topPoint = pointArr[i];
    }

    // quantification
    var str = dwv.tool.GetLineText( line, image );
    var ktext = new Kinetic.Text({
        x: topPoint.getX(),
        y: topPoint.getY() + dwv.roi.textOffset / displayApp.getDrawStage().scale().x,
        text: str,
        fontSize: dwv.roi.fontSize / displayApp.getDrawStage().scale().x,
        fontFamily: "Verdana",
        fill: colour,
        name: "text"
    });
    // return shape
    return {"shape": kline, "text": ktext};
};

/**
 * Create a roi shape to be displayed.
 * @method UpdateShapeFromLine
 * @static
 * @param Object roi The roi object (from dwv.math.ROI)
 * @param Object shape The shape object to update
 * @param Object displayApp The app window on which to display
 */
dwv.roi.UpdateShapeFromLine = function(line, shape, displayApp) {

    var pointArr = line.getPoints();
    var points = [];

    for (var i = 0; i < pointArr.length; ++i){
        points.push(pointArr[i].getX());
        points.push(pointArr[i].getY());
    }
    shape.shape.points( points );
    // Find highest y position
    var topPoint = pointArr[0];
    for (var i = 1; i < pointArr.length; ++i){
        if (pointArr[i].getY() > topPoint.getY())
            topPoint = pointArr[i];
    }
    // update text
    var ktext = shape.text;
    if ( ktext ) {
        ktext.x(topPoint.getX());
        ktext.y(topPoint.getY() + dwv.roi.textOffset / displayApp.getDrawStage().scale().x );
        var str = dwv.tool.GetLineText(line, displayApp.getImage());
        var textPos = { 'x': topPoint.getX(), 'y': topPoint.getY() + 10 };
        ktext.position( textPos );
        ktext.text(str);
    }
    ktext.getLayer().draw();
};

/**
 * Create a roi shape to be displayed.
 * @method UpdateShapeFromRoi
 * @static
 * @param Object line The line object (from dwv.math.Line)
 * @param Object shape The shape object to update
 * @param Object displayApp The app window on which to display
 */
dwv.roi.UpdateShapeFromRoi = function(roi, shape, displayApp) {

    var pointArr = roi.getPoints();
    var points = [];

    for (var i = 0; i < pointArr.length; ++i){
        points.push(pointArr[i].getX());
        points.push(pointArr[i].getY());
    }
    shape.shape.points( points );
    // Find highest y position
    var topPoint = pointArr[0];
    for (var i = 1; i < pointArr.length; ++i){
        if (pointArr[i].getY() > topPoint.getY())
            topPoint = pointArr[i];
    }
    // update text
    var ktext = shape.text;
    if ( ktext ) {
        ktext.x(topPoint.getX());
        ktext.y(topPoint.getY() + dwv.roi.textOffset / displayApp.getDrawStage().scale().x);
        var str = dwv.tool.GetROIText(roi, displayApp.getImage());
        ktext.text(str);
    }
    ktext.getLayer().draw();
};

dwv.roi.RoiEntry = function(id, type, colour, medianRoi, motilityRoiList, medianShape, motilityShapes, roiRecord){
    this.id = id;
    this.GetType = function(){
        return type;
    };

    this.GetColour = function(){
        return colour;
    };

    this.GetNumberOfTimepoints = function(){
        return motilityShapes.length;
    } ;

    this.GetMedianShape = function() {
        return medianShape;
    };

    this.GetMotilityShapes = function() {
      return motilityShapes;
    };

    this.GetMotilityRoiList = function(){
        return motilityRoiList;
    };

    this.RemoveEntry = function(){
        var layer = medianShape.shape.getLayer();
        medianShape.shape.getParent().remove();
        if (layer)
            layer.draw();
        for (var t = 0; t < roiRecord.GetDeformationData().GetNoTimePoints(); ++t) {
            layer = motilityShapes[t].shape.getLayer();
            motilityShapes[t].shape.getParent().remove();
            layer.draw();
        }
        roiRecord.RemoveEntry(id);
    };

    this.SetSelected = function(){
        roiRecord.SelectRow(id);
    };

    this.SetNewMedianROIPoints = function(newPoints, finished){
        var pointArr = [];
        for (var i =0; i < newPoints.length; i+=2)
            pointArr.push(new dwv.math.Point2D(newPoints[i],newPoints[i+1]));

        var transformedPoints = [];

        if (finished) {
            for (var t = 0; t < roiRecord.GetDeformationData().GetNoTimePoints(); ++t) {
                var newPoints = dwv.roi.TransformPoints(pointArr, roiRecord.GetDeformationData(), t);
                transformedPoints.push(newPoints);
            }
        }

        if (type == 'poly') {
            medianRoi = new dwv.math.ROI();
            medianRoi.addPoints(pointArr);
            dwv.roi.UpdateShapeFromRoi(medianRoi, medianShape, medianViewer);

            if (finished) {
                for (var t = 0; t < roiRecord.GetDeformationData().GetNoTimePoints(); ++t) {
                    motilityRoiList[t] = new dwv.math.ROI();
                    motilityRoiList[t].addPoints(transformedPoints[t]);
                    dwv.roi.UpdateShapeFromRoi(motilityRoiList[t], motilityShapes[t], app);
                }

                medianShape.shape.parametricMapValues = [];
                var paraDataArray = medianViewer.getParametricMapData();
                for (var i = 0; i < paraDataArray.length; ++i){
                    medianShape.shape.parametricMapValues.push(paraDataArray[i].GetParametricMapValue(medianShape.shape));
                }
                roiRecord.AmendTableRow(id, type, medianShape.text.text(), medianShape.shape.parametricMapValues);
            }

        }
        else if (type == 'line'){
            medianRoi = new dwv.math.Line(pointArr[0], pointArr[pointArr.length-1]);
            dwv.roi.UpdateShapeFromLine(medianRoi, medianShape, medianViewer);

            if (finished) {
                for (var t = 0; t < roiRecord.GetDeformationData().GetNoTimePoints(); ++t) {
                    motilityRoiList[t] = new dwv.math.Line(transformedPoints[t][0], transformedPoints[t][pointArr.length-1]);
                    dwv.roi.UpdateShapeFromLine(motilityRoiList[t], motilityShapes[t], app);
                }

                medianShape.shape.parametricMapValues = [];
                var paraDataArray = medianViewer.getParametricMapData();
                for (var i = 0; i < paraDataArray.length; ++i){
                    medianShape.shape.parametricMapValues.push(paraDataArray[i].GetParametricMapValue(medianShape.shape));
                }
                roiRecord.AmendTableRow(id, type, medianShape.text.text(), medianShape.shape.parametricMapValues);
            }

        }
        roiRecord.GetMotilityDrawTool().ResetAnchors();
    };

    this.SetNewMotilityROIPoints = function(newPoints, finished) {
        var pointArr = [];
        for (var i =0; i < newPoints.length; i+=2)
            pointArr.push(new dwv.math.Point2D(newPoints[i],newPoints[i+1]));

        if (type == 'poly') {
            var currentSlice = app.GetCurrentSlice();
            motilityRoiList[currentSlice] = new dwv.math.ROI();
            motilityRoiList[currentSlice].addPoints(pointArr);
            dwv.roi.UpdateShapeFromRoi(motilityRoiList[currentSlice], motilityShapes[currentSlice], app);
        }
        if (type == 'line'){
            var currentSlice = app.GetCurrentSlice();
            motilityRoiList[currentSlice] = new dwv.math.Line(pointArr[0], pointArr[pointArr.length-1]);
            dwv.roi.UpdateShapeFromLine(motilityRoiList[currentSlice], motilityShapes[currentSlice], app);
        }
        roiRecord.GetMedianDrawTool().ResetAnchors();
    }
};

dwv.roi.TransformPoints = function(points, deformationData, timePoint){
    var newPoints = [];

    for (var p = 0; p < points.length; ++p) {
        var column = points[p].getX() + deformationData.GetInterpolatedScaledImageData(points[p].getX(), points[p].getY(), timePoint, 0);
        var row = points[p].getY() + deformationData.GetInterpolatedScaledImageData(points[p].getX(), points[p].getY(), timePoint, 1);
        var point = new dwv.math.Point2D(column, row);
        newPoints.push(point);
    }
    return newPoints;
};

dwv.roi.RoiRecord = function(motilityDrawTool, medianDrawTool, deformationData){
    var ROIid = 0;
    var ROIEntryList = [];
    var self = this;


    this.RemoveAllEntries = function(){
        for (var i = 0; i < ROIEntryList.length; ++i){
            this.RemoveTableRow(ROIEntryList[i].id);
        }
        ROIid = 0;
        ROIEntryList = [];
    };

    this.GetROIEntryList = function(){
        return ROIEntryList;
    };

    this.RemoveEntry = function(id){
        for (var i = 0; i < ROIEntryList.length; ++i){
            if (ROIEntryList[i].id == id){
                ROIEntryList.splice(i,1);
                if ( ROIid == id+1)
                    --ROIid;

                this.RemoveTableRow(id);
                break;
            }
        }
    };
    var GenerateTableHeader = function(){
        $('#roitable').empty();
        var $row = ($('<tr>')).appendTo($('#roitable'));
        $('<td>').appendTo($row).text('ID');
        $('<td>').appendTo($row).text('Type');
        $('<td>').appendTo($row).text('Length/Area');
        $('<td>').appendTo($row).text('Para Values');
        var paraDataArray = medianViewer.getParametricMapData();
        for (var i = 0; i < paraDataArray.length; ++i){
            $('<td>').appendTo($row);
        }

    };

    GenerateTableHeader();

    this.RemoveTableRow = function(id){
        $('#roitable tr').each(function(index, element){
            if (index == 0)
                return;
            if (parseInt($(element).children()[0].innerHTML) == id ){
                $(element).remove();
            }
        });
    };

    this.AmendTableRow  = function(id, type, lengtharea, paravalues){
        $('#roitable tr').each(function(index, element){
            if (index == 0)
                return;
            if (parseInt($(element).children()[0].innerHTML) == id ){
                $(element).children()[1].innerHTML = type;
                $(element).children()[2].innerHTML = lengtharea;

                for (var i = 0; i < paravalues.length; ++i)
                    $(element).children()[3+i].innerHTML = paravalues[i].toPrecision(3);

            }
        });
    };

    this.SelectRow = function(id){
        $('#roitable tr').each(function(index, element){
            if (index == 0)
                return;
            if (parseInt($(element).children()[0].innerHTML) == id ){
                $('#roitable tr').css('background', 'none');
                $(element).css('background', 'red');
            }
        });
        for (var i = 0; i < self.GetROIEntryList().length; ++i){
            if (self.GetROIEntryList()[i].id == id) {
                motilityDrawTool.ResetAnchors();
                medianDrawTool.ResetAnchors();
                var shapeEditor = medianDrawTool.GetShapeEditor();
                shapeEditor.disable();
                shapeEditor.setShape(self.GetROIEntryList()[i].GetMedianShape().shape);
                shapeEditor.setImage(medianViewer.getImage());
                shapeEditor.enable();

                shapeEditor = motilityDrawTool.GetShapeEditor();
                shapeEditor.disable();
                shapeEditor.setShape(self.GetROIEntryList()[i].GetMotilityShapes()[app.GetCurrentSlice()].shape);
                shapeEditor.setImage(app.getImage());
                shapeEditor.enable();
            }
        }
    };

    this.AddTableRow = function(id, type, lengtharea, paravalues){
        var $row = ($('<tr>')).appendTo($('#roitable'));
        $('<td>').appendTo($row).text(id);
        $('<td>').appendTo($row).text(type);
        $('<td>').appendTo($row).text(lengtharea);

        for (var i = 0; i < paravalues.length; ++i)
        $('<td>').appendTo($row).text(paravalues[i].toPrecision(3));

        $row.click('on', function(event){
            //$('#roitable tr').css('background', 'none');
            //$(event.target).parent().css('background', 'red');
            self.SelectRow(id);
        });
    };

    this.GenerateTable = function(){
        this.GenerateTableHeader();
    };


    this.GetDeformationData = function(){
        return deformationData;
    };

    this.GetMedianDrawTool = function(){
        return medianDrawTool;
    };

    this.GetMotilityDrawTool = function(){
        return motilityDrawTool;
    };

    this.AddRoiEntry = function(type, colour, roiObject, roiShape, roiId){

        if (roiId === undefined)
            roiId = ROIid;

        var motilityRois = [];
        var motilityShapes = [];
        for (var i = 0; i < deformationData.GetNoTimePoints(); ++i){
            var points = dwv.roi.TransformPoints(roiObject.getPoints(), deformationData, i);

            var roi = null;
            if (type == 'line')
                roi = new dwv.math.Line(points[0], points[points.length-1]);
            else {
                roi = new dwv.math.ROI();
                roi.addPoints(points);
            }

            var shape = null;
            if (type == 'line')
                shape = dwv.roi.GetShapeFromLine(roi, colour, app);
            else
                shape = dwv.roi.GetShapeFromRoi(roi, colour, app);

            motilityShapes.push(shape);

            var shapeGroup = new Kinetic.Group();
            shapeGroup.add(shape.shape);
            shapeGroup.add(shape.text);

            var destinationLayer = app.getDrawLayers()[i];
            destinationLayer.add(shapeGroup);
            destinationLayer.draw();

            motilityDrawTool.addToCreatedShapes(shape);

            motilityRois.push(roi);
        }

        var roiEntry = new dwv.roi.RoiEntry(roiId, type, colour, roiObject, motilityRois, roiShape, motilityShapes, this);
        roiShape.shape.roiEntry = roiEntry;
        roiShape.shape.parametricMapValues = [];
        var paraDataArray = medianViewer.getParametricMapData();
        for (var i = 0; i < paraDataArray.length; ++i){
            roiShape.shape.parametricMapValues.push(paraDataArray[i].GetParametricMapValue(roiShape.shape));
        }

        for (var i = 0; i < deformationData.GetNoTimePoints(); ++i){
            motilityShapes[i].shape.roiEntry = roiEntry;
        }
        ROIEntryList.push(roiEntry);

        this.AddTableRow(roiId, type, roiShape.text.text(), roiShape.shape.parametricMapValues);

        ROIid = roiId + 1;

        return roiEntry;
    }
};

