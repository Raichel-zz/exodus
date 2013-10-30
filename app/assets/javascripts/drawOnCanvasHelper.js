/*******************************************************************************
 * Drug drop and resize support **
 ******************************************************************************/
function update(activeAnchor) {
	var group = activeAnchor.getParent();

	var topLeft = group.get('.topLeft')[0];
	var topRight = group.get('.topRight')[0];
	var bottomRight = group.get('.bottomRight')[0];
	var bottomLeft = group.get('.bottomLeft')[0];
	var image = group.get('.image')[0];

	var anchorX = activeAnchor.getX();
	var anchorY = activeAnchor.getY();

	// update anchor positions
	switch (activeAnchor.getName()) {
	case 'topLeft':
		topRight.setY(anchorY);
		bottomLeft.setX(anchorX);
		break;
	case 'topRight':
		topLeft.setY(anchorY);
		bottomRight.setX(anchorX);
		break;
	case 'bottomRight':
		bottomLeft.setY(anchorY);
		topRight.setX(anchorX);
		break;
	case 'bottomLeft':
		bottomRight.setY(anchorY);
		topLeft.setX(anchorX);
		break;
	}

	image.setPosition(topLeft.getPosition());

	var width = topRight.getX() - topLeft.getX();
	var height = bottomLeft.getY() - topLeft.getY();
	if (width && height) {
		image.setSize(width, height);
	}
}

// Save references to all anchors so we can remove them before saving the image
var anchors = new Array();

function addAnchor(group, x, y, name) {

	var anchor = new Kinetic.Circle({
		x : x,
		y : y,
		stroke : '#666',
		fill : '#ddd',
		strokeWidth : 2,
		radius : 4,
		name : name,
		draggable : true,
		dragOnTop : false
	});

	anchors.push(anchor);

	anchor.on('dragmove', function() {
		update(this);
		layer.draw();
	});
	anchor.on('mousedown touchstart', function() {
		group.setDraggable(false);
		this.moveToTop();
	});
	anchor.on('dragend', function() {
		group.setDraggable(true);
		layer.draw();
	});
	// add hover styling
	anchor.on('mouseover', function() {
		var layer = this.getLayer();
		document.body.style.cursor = 'pointer';
		this.setStrokeWidth(4);
		layer.draw();
	});
	anchor.on('mouseout', function() {
		var layer = this.getLayer();
		document.body.style.cursor = 'default';
		this.setStrokeWidth(2);
		layer.draw();
	});

	group.add(anchor);
}

function removeAllAnchors() {
	while (anchors.length > 0) {
		anchors.pop().remove();
	}
	stage.draw();
}

var stage;

function initStage() {
	stage = new Kinetic.Stage({
		container : 'decalCanvasContainer',
		width : $('#decalCanvasContainer').outerWidth(),
		height : $('#decalCanvasContainer').outerHeight()
	});
	layer = new Kinetic.Layer();
	stage.add(layer);
}

var groupsByZIndex = {};
var layer;

function addImageToCanvas(image, imageWidth, imageHeight, imageX, imageY,
		resizable, draggable, zIndex) {
	var imgGroup = new Kinetic.Group({
		x : imageX,
		y : imageY,
		draggable : draggable
	});

	// If there is a layer with the same zIndex, remove it
	if (groupsByZIndex[zIndex]) {
		groupsByZIndex[zIndex].destroy();
	}
	// Add the new layer to the zIndex hash
	groupsByZIndex[zIndex] = imgGroup;

	/*
	 * go ahead and add the groups to the layer and the layer to the stage so
	 * that the groups have knowledge of its layer and stage
	 */
	layer.add(imgGroup);
	imgGroup.setZIndex(zIndex);

	var img = new Kinetic.Image({
		x : 0,
		y : 0,
		image : image,
		width : imageWidth,
		height : imageHeight,
		name : 'image'
	});

	imgGroup.add(img);
	if (resizable) {
		addAnchor(imgGroup, 0, 0, 'topLeft');
		addAnchor(imgGroup, imageWidth, 0, 'topRight');
		addAnchor(imgGroup, imageWidth, imageHeight, 'bottomRight');
		addAnchor(imgGroup, 0, imageHeight, 'bottomLeft');
	}

	if (draggable) {
		imgGroup.on('dragstart', function() {
			this.moveToTop();
		});
		img.on('mouseover', function() {
			document.body.style.cursor = 'pointer';
		});
		img.on('mouseout', function() {
			document.body.style.cursor = 'default';
		});
	}

	stage.draw();
}

var textpathGroup;
var textYearsGroup;

function addCurvedTextToCanvas(textToDraw, color, font) {
	var canvas = $("canvas", $("#decalCanvasContainer"));
	if (textpathGroup) {
		textpathGroup.remove();
	}
	textpathGroup = new Kinetic.Group({
		draggable : false
	});
	var textpath = new Kinetic.TextPath({
      	x: canvas.width() / 2,
      	y: 270,
      	rotation: -1 * (Math.PI/20) * (textToDraw.length /2), //(Math.PI/19) is the number of degrees each letter takes
      															// we duplicate this number of degrees by the half length
      															// of the text to draw and rotate counter clock wise
      															// this rotation will center the text at the top of the decal.
      	fill: '#' + color,
        fontSize: '80',
        fontFamily: font,
        text: textToDraw.split("").reverse().join(""),
        data: 'M0,-220 A220,220 0 1,1 -1,-220'
      });
	textpathGroup.add(textpath);
	layer.add(textpathGroup);
	stage.draw();
}

function addYearsTextToCanvas(textToDraw, color, font) {

	var tCtx = document.createElement('canvas').getContext('2d'); //Hidden canvas
    var imageElem = new Image(); //Hidden image
	tCtx.canvas.width = 200;
	tCtx.canvas.height = 200;
	tCtx.font="150px " + font;
	tCtx.fillStyle = '#' + color;
	tCtx.fillText(textToDraw, 20, 150);
	imageElem.onload = function() { 
		addImageToCanvas(imageElem, 250, 250, 200, 200, true, true, 5);
	};
	imageElem.src = tCtx.canvas.toDataURL();
}
