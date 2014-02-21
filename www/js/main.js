var canvas, stage;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation

var dragging = false;

var offset;
var update = true;

var artBox;
var frameBox;

var objects = [];
var frames = [];
var p = this;


var loadManifest = [];
var audioLoader;

var singleView;


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

	// setup background
	var bg = new createjs.Shape();
	bg.graphics.beginFill("#ddd");
	bg.graphics.drawRect(0,0,1024,768);
	bg.graphics.endFill();
	
	createFrameBox();
	createArtBox();
	
	stage.addChild(bg, frameBox, artBox);
	
	loadArt();
	loadFrames();

	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.setFPS(30);

	setupSingleView();
	
	stage.update();
	

}

function createFrameBox() {
	frameBox = new createjs.Container();
	frameBox.x = 190;
	frameBox.y = 100;
}

function createArtBox() {
	artBox = new createjs.Container();
	artBox.x = 20;
	artBox.y = 20;

	var artBoxShape = new createjs.Shape();
	artBoxShape.graphics.beginFill("#eee");
	artBoxShape.graphics.drawRect(0,0,100,100);
	artBoxShape.graphics.endFill();
	
	artBox.addChild(artBoxShape);	

}

function loadFrames() {

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
}

function loadArt() {

	// on preloading: http://stackoverflow.com/questions/17268466/how-to-reference-image-preloaded-in-preloadjs

	var queue = new createjs.LoadQueue(true);

	queue.on("fileload", handleArtLoad, this);
	queue.on("complete", handleArtComplete, this);

	var artManifest = [];


	$.getJSON("js/artobjects.json", function(data) {
		$.each(data, function() {
			
			var img = this.artImage;
			var id = this.id;
			var a = new ArtObject(this);
			objects.push(a);
			artManifest.push({src:"img/art/"+img, id:id, data:{artObject:a}});
			//objects.push();
			//queue.loadFile("img/art/" + img, false);
		});

		queue.loadManifest(artManifest, true);

	});

}

function setupSingleView() {
	singleView = new createjs.Container();
	
	singleView.commentBox = new createjs.Container();
	singleView.addChild(singleView.commentBox);
	stage.addChild(singleView);

}

function handleAudioLoad(event) {
	console.log("Audio Loaded");
	var instance = createjs.Sound.play("mySound");
}

function handleAudioComplete(event) {
	console.log("Audio Load Complete");
}

function selectFrame(art, frame) {
	
	var audioPath = art.audio[frame.frameType];
	var comment = art.comment[frame.frameType];

	console.log("You put the " + art.artistName + " inside of the " + frame.frameType);
	console.log("Playing... " + audioPath);
	console.log("Commentary: " + comment);
 	createjs.Sound.alternateExtensions = ["mp3"];
	audioLoader = new createjs.LoadQueue(true);
	audioLoader.installPlugin(createjs.Sound);
	audioLoader.on("fileload", handleAudioLoad, this);
	audioLoader.on("complete", handleAudioComplete, this);
	audioLoader.loadFile({id:"mySound", src:"audio/"+audioPath});

	var text = new createjs.Text(comment, "20px Arial", "#ff7700"); 
	text.x = 100; 
	text.y = 200;
	text.textBaseline = "alphabetic";
	
	singleView.commentBox.addChild(text);

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

	var ap, xy, scale, frameType;

	switch(item.id) {
		case "frame_reverse":
			xy = new createjs.Point(0,310)
			scale = 1.208;
			ap = new createjs.Point(16,16);
			frameType = ArtFrame.FRAME_TYPES.FRAME_REVERSE;
		break;
		case "frame_narrow":
			xy = new createjs.Point(400,20);
			scale = 1.249;
			ap = new createjs.Point(4,4);
			frameType = ArtFrame.FRAME_TYPES.FRAME_NARROW;
		break;
		case "frame_cassetta":
			xy = new createjs.Point(390, 310);
			scale = 1.096;
			ap = new createjs.Point(22,19);
			frameType = ArtFrame.FRAME_TYPES.CASSETTA;
		break;
		case "frame_kinglouis":
			xy = new createjs.Point(0,0);
			scale = 1.09;
			ap = new createjs.Point(22,18);
			frameType = ArtFrame.FRAME_TYPES.KING_LOUIS;
		break;
	}
	
	var af = new ArtFrame(bmp, frameType);
	var fc = af.frameContainer;

	af.setScale(scale);
	af.setXY(xy);
	af.setPoint(ap);
	
	/*
	af.frameContainer.on("rollover", function(evt) {
		if(dragging) {
			createjs.Tween.get(this).to({scaleX:1.25, scaleY:1.25}, 300, createjs.Ease.quadOut);
		}
	});
	*/

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
 	var ao = item.data.artObject;

 	console.log(ao);

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
		createjs.Sound.stop("mySound");
		this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
		this.rotation = -5;
		$.each(frames, function() {
			console.log("frameit" + this.originalX);
			createjs.Tween.get(this.frameContainer).to({x: this.originalX, y: this.originalY, scaleX:1, scaleY:1}, 300);
			this.artContainer.removeAllChildren();
		});
		console.log("MouseDown");
		createjs.Tween.get(this).to({scaleX:0.5, scaleY:0.5}, 500, createjs.Ease.elasticOut); //circOut is really nice

		dragging = true;

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
		
		dragging = false;

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
			createjs.Tween.get(placedFrame.bmp).to({scaleY: h * 0.00553}, 100);
			
			for(var i = 0; i < frames.length; i++) {
				if(i != placedFrameIndex) {
					createjs.Tween.get(frames[i].frameContainer).to({x:300, y:900, scaleX:0.25, scaleY:0.25}, 600, createjs.Ease.quadOut);
				} else {
					createjs.Tween.get(frames[i].frameContainer).to({x:0, y:0}, 800, createjs.Ease.quadOut);
				}
			}

			
			selectFrame(ao, placedFrame);

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
	
}