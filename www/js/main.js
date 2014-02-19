var canvas, stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

var artBox;
var frameBox;

var objects = [];
var frames = [];
var p = this;


var loadManifest = [];


(function() {
 
	var ArtObject = function(objectDefinition) {
	  this.initialize(objectDefinition);
	}

	var p = ArtObject.prototype = new createjs.Container();
	 
	p.Container_initialize = p.initialize;

	p.initialize = function(objectDefinition) {
	    this.Container_initialize();
	    // add custom setup logic here.
	}
	 
	window.ArtObject = ArtObject;

}());


(function() {

	var ArtFrame = function(bmp) {
		
		var t = this;

		t.bmp = bmp;
		
		t.frameContainer = new createjs.Container();
		t.frameContainer.addChild(t.bmp);
		
		t.frameTop = new createjs.Container();
		
		t.frameContainer.addChild(t.frameTop);
		t.frameBot = new createjs.Container();
		
		t.frameContainer.addChild(t.frameBot);
		t.artContainer = new createjs.Container();
		
		t.frameContainer.addChild(t.artContainer);

		t.originalX = 0;
		t.originalY = 0;
		t.artScale = 1;

	}

	ArtFrame.prototype.setPoint = function(pt) {
		this.artPoint = pt;
		this.artContainer.x = this.artPoint.x;
		this.artContainer.y = this.artPoint.y;
	};
	ArtFrame.prototype.setScale = function(scale) {
		this.artScale = scale;
	}
	ArtFrame.prototype.setXY = function(pt) {
		
		this.frameContainer.setTransform(pt.x,pt.y);
		this.originalX = pt.x;
		this.originalY = pt.y;
	};
	ArtFrame.prototype.setFrameHeight = function(height) {
		this.frameContainer.scaleY = height;
	}

	ArtFrame.FRAME_TYPES = {KING_LOUIS:"frame_kinglouis",
							FRAME_NARROW:"frame_narrow",
							FRAME_REVERSE:"frame_reverse",
							CASSETTA:"frame_cassetta",
						   }

	window.ArtFrame = ArtFrame;
	
}());

function init() {

	if (window.top != window) {
		document.getElementById("header").style.display = "none";
	}
	document.getElementById("loader").className = "loader";
	// create stage and point it to the canvas:
	canvas = document.getElementById("testCanvas");

	//check to see if we are running in a browser with touch support
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);
	
	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

	// enabled mouse over / out events
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	// load the source image:
	//var image = new Image();
	//image.src = "img/image.png";
	//image.onload = handleImageLoad;


	var bg = new createjs.Shape();
	bg.graphics.beginFill("#ddd");
	bg.graphics.drawRect(0,0,1024,768);
	bg.graphics.endFill();

	artBox = new createjs.Container();
	artBox.x = 20;
	artBox.y = 20;

	frameBox = new createjs.Container();
	frameBox.x = 190;
	frameBox.y = 100;

	stage.addChild(bg, frameBox, artBox);

	var artBoxShape = new createjs.Shape();
	artBoxShape.graphics.beginFill("#eee");
	artBoxShape.graphics.drawRect(0,0,100,100);
	artBoxShape.graphics.endFill();
	
	artBox.addChild(artBoxShape);

	// on preloading: http://stackoverflow.com/questions/17268466/how-to-reference-image-preloaded-in-preloadjs
	var queue = new createjs.LoadQueue(true);

	queue.on("fileload", handleArtLoad, this);
	queue.on("complete", handleArtComplete, this);

	$.getJSON("js/artobjects.json", function(data) {
		$.each(data, function() {
			
			var img = this.artImage;
			objects.push(new ArtObject(this));
			queue.loadFile("img/art/" + img, false);
		});

		queue.load();

	});

	// graphics.f().dr().ef();

	var frameLoader = new createjs.LoadQueue(true);

	frameLoader.on("fileload", handleFrameLoad, this);
	frameLoader.on("complete", handleFrameComplete, this);

	var frameManifest = [
        {src:"img/frames/frame_kinglouis.png", id:"frame_kinglouis"},
        {src:"img/frames/frame_narrow.png", id:"frame_narrow"},
        {src:"img/frames/frame_reverse.png", id:"frame_reverse"},
        {src:"img/frames/frame_cassetta.png", id:"frame_cassetta"}
    ];

    frameLoader.loadManifest(frameManifest);

	stage.update();
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.setFPS(30);

}

function handleFrameLoad(event){
	console.log("Completed Frame Load");

	var item = event.item; // A reference to the item that was passed in to the LoadQueue
    var type = item.type;
    var image = event.result;
    var w = image.width;
    var h = image.height;
 	
	var bmp = new createjs.Bitmap(image);
	
	//bmp.regX = w/2;
	//bmp.regY = w/2;

	var ap, xy, scale;

	switch(item.id) {
		case "frame_reverse":
			xy = new createjs.Point(0,310)
			scale = 1.208;
			ap = new createjs.Point(16,16);
		break;
		case "frame_narrow":
			xy = new createjs.Point(400,20);
			scale = 1.249;
			ap = new createjs.Point(4,4);
		break;
		case "frame_cassetta":
			xy = new createjs.Point(390, 310);
			scale = 1.096;
			ap = new createjs.Point(22,19);
		break;
		case "frame_kinglouis":
			xy = new createjs.Point(0,0);
			scale = 1.09;
			ap = new createjs.Point(22,18);
		break;
	}
	
	var af = new ArtFrame(bmp);
	var fc = af.frameContainer;

	af.setScale(scale);
	af.setXY(xy);
	af.setPoint(ap);

	frames.push(af);
	
	frameBox.addChild(fc);

}

function handleFrameComplete(event){
	console.log("Completed Frame Loads");
}

function handleArtLoad(event) {
 
	var item = event.item; // A reference to the item that was passed in to the LoadQueue
	var type = item.type;
	var image = event.result;
	var w = image.width;
	var h = image.height;
 	
	var bmp = new createjs.Bitmap(image);
	
	bmp.scaleX = 0.35;
	bmp.scaleY = 0.35;

	bmp.regX = w/2;
	bmp.regY = w/2;
	
	var b = artBox.getBounds();

	if(b !== null) {
		bmp.y = b.height + 10;	
		console.log(w);
	}
	
	bmp.x += 50;
	bmp.y += 100;
	bmp.origX = bmp.x;
	bmp.origY = bmp.y;

	bmp.on("mousedown", function(evt) {
		//this.parent.addChild(this);
		this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
		this.rotation = -5;
		$.each(frames, function() {
			console.log("frameit" + this.originalX);
			createjs.Tween.get(this.frameContainer).to({x: this.originalX, y: this.originalY, scaleX:1, scaleY:1}, 300);
			this.artContainer.removeAllChildren();
		});
		console.log("MouseDown");
		createjs.Tween.get(this).to({scaleX:0.5, scaleY:0.5}, 500, createjs.Ease.elasticOut); //circOut is really nice
	});
	
	// the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
	bmp.on("pressmove", function(evt) {
		this.x = evt.stageX+ this.offset.x;
		this.y = evt.stageY+ this.offset.y;
		
		// indicate that the stage should be updated on the next tick:
		update = true;
	});
	
	bmp.on("rollover", function(evt) {
		this.scaleX = this.scaleY = 0.4;
		artBox.addChild(this);
		update = true;
	});

	bmp.on("rollout", function(evt) {
		this.scaleX = this.scaleY = 0.35;
		update = true;
	});
	
	bmp.on("pressup", function(evt) {
		
		this.scaleX = this.scaleY = 0.35;
		createjs.Tween.removeTweens(this);
		var didPlace = false;
		
		var placedFrameIndex;
		var placedFrame;

		for(var i = 0; i < frames.length; i ++) {
			var f = frames[i];
			var p = f.bmp.globalToLocal(stage.mouseX, stage.mouseY);//f.globalToLocal(stage.mouseX, stage.mouseY);

			console.log(p);


			if(f.bmp.hitTest(p.x, p.y)) {
				didPlace = true;
				placedFrameIndex = i;
				placedFrame = f;
			}

		}

		// setArtInFrame(this, placedFrame);

		if(didPlace) {
			console.log("Dear "+ this.id + ",\n\nYou intersect with me!\n\nBest,\n" + placedFrame.bmp.id);
			var bmpc = new createjs.Bitmap(this.image);
			bmpc.x = placedFrame.artPoint.x;
			bmpc.y = placedFrame.artPoint.y;
			placedFrame.artContainer.removeAllChildren();
			bmpc.alpha = 0;
			createjs.Tween.get(bmpc).to({alpha:1}, 1000, createjs.Ease.quadOut);
			placedFrame.artContainer.addChild(bmpc);
			didPlace = true;
			bmpc.scaleX = bmpc.scaleY = placedFrame.artScale;
			console.log("Wizard!");
			createjs.Tween.get(placedFrame.bmp).to({scaleY: h * 0.00553}, 100);
			for(var i = 0; i < frames.length; i++) {
				if(i != placedFrameIndex) {
					console.log("Animated The Dead");
					createjs.Tween.get(frames[i].frameContainer).to({x:300, y:900, scaleX:0.25, scaleY:0.25}, 600, createjs.Ease.quadOut);
				} else {
					createjs.Tween.get(frames[i].frameContainer).to({x:0, y:0}, 800, createjs.Ease.quadOut);
				}
			}

		}


		//if(!didPlace) {
			this.rotation = 0;
			createjs.Tween.get(this).to({x:this.origX, y:this.origY, rotation:0, override:true}, 300, createjs.Ease.quadOut);
		//}

		update = true;


	});

	artBox.addChild(bmp);

}

function handleArtComplete(event) {
	stage.update();
	//objects[0].artistName;
}