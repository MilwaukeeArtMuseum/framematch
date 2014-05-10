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

var soundEnabled = true;
var artistInfo;

var bgColor = "#734d73";
var frameBg = "#a48ca4";

State = {
			INIT:"state_init",
			SELECTION:"state_art_select",
			SINGLE_VIEW:"state_single_view"
		};

var currentState = State.INIT;

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
	bg.graphics.beginFill(bgColor);
	bg.graphics.drawRect(0,0,1024,768);
	bg.graphics.endFill();
	
	createFrameBox();
	createArtBox();
	setupSingleView();

	stage.addChild(bg, singleView, frameBox, artBox);
	
	loadArt();
	loadFrames();

	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", tickFunc);
	createjs.Ticker.setFPS(30);

	stage.update();
	
}

function tickFunc() {
	

	if(dragging) {
		for(var i = 0; i < frames.length; i ++) {
			var f = frames[i];
			
			var p = f.bmp.globalToLocal(stage.mouseX, stage.mouseY);
			
			if(f.bmp.hitTest(p.x, p.y)) {
				//if(!f.isGlowing) {
					f.glow();
				//}
			} else {
				//if(f.isGlowing) {
					f.endGlow();
				//}
			}
			
		}
	}

	

}

function createFrameBox() {
	frameBox = new createjs.Container();
	frameBox.x = 220;
	frameBox.y = 90;
}

function createArtBox() {
	artBox = new createjs.Container();
	artBox.x = 20;
	artBox.y = 20;

	var artBoxShape = new createjs.Shape();
	artBoxShape.graphics.beginFill("#eee");
	artBoxShape.graphics.drawRect(0,0,100,100);
	artBoxShape.graphics.endFill();
	
	//artBox.addChild(artBoxShape);	
}

function loadFrames() {

	var frameLoader = new createjs.LoadQueue(true);

	frameLoader.on("fileload", handleFrameLoad, this);
	frameLoader.on("complete", handleFrameComplete, this);

	var frameManifest = [
        {src:"img/frames/kinglouis.png", id:"frame_kinglouis"},
        {src:"img/frames/narrow.png", id:"frame_narrow"},
        {src:"img/frames/reverse.png", id:"frame_reverse"},
        {src:"img/frames/cassetta.png", id:"frame_cassetta"}
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

	var text = new createjs.Text("hello", "20px Arial", "#333"); 
	
	text.x = 200; 
	text.y = 470;
	text.lineWidth = 750;
	text.textBaseline = "alphabetic";
	text.textAlign = "left";
	//text.s
	singleView.commentText = text;
	
	var commentBack = new createjs.Shape();
	var padding = 20;
	
	commentBack.graphics.beginFill("#ccc").drawRect(text.x - padding,
													text.y-text.getMeasuredLineHeight()-padding, 
													text.lineWidth+padding, 
													200+padding).endFill();

	singleView.commentBox.addChild(commentBack, singleView.commentText);
	
	singleView.artCredit = new createjs.Container();

	var creditBG = new createjs.Shape();
	creditBG.graphics.beginFill('#fff').drawRect(0,0,350,250).endFill();

	var backButton = new createjs.Container();
	backButton.cursor = "pointer";
	var backButtonBG = new createjs.Shape();
	backButtonBG.graphics.beginFill("#aaa").drawRoundRect(-20, -20, 125, 75, 15).endFill();

	var backButtonTXT = new createjs.Text('BACK', "30px Arial", "#333");

	backButton.bg = backButtonBG;
	backButton.txt = backButtonTXT;


	backButton.addChild(backButtonBG, backButtonTXT);
	backButton.y = 590;
	backButton.x = 250;
	singleView.backButton = backButton;	
	backButton.on("mousedown", function(evt) {
		exitSingleView();
	});

	
	var artistInfo = new createjs.Text('',"14px Arial bold", "#333");
	var objectTitle = new createjs.Text('',"14px Arial bold", "#333");
	var objectDetails = new createjs.Text('', "14px Arial", "#333");


	var cardPadding = 20;
	artistInfo.x = cardPadding;
	artistInfo.y = cardPadding;
	artistInfo.lineWidth = 350;

	objectTitle.x = cardPadding;
	objectTitle.y = 16 + cardPadding;
	objectTitle.lineWidth = 320;

	objectDetails.x = cardPadding;
	objectDetails.y = 60 + cardPadding;
	objectDetails.lineHeight = 20;
	objectDetails.lineWidth = 350;
	
	
	singleView.artCredit.artistInfo = artistInfo;
	singleView.artCredit.objectTitle = objectTitle;
	singleView.artCredit.objectDetails = objectDetails;

	singleView.artCredit.addChild(creditBG, artistInfo, objectTitle, objectDetails, backButton);
	

	singleView.artCredit.x = 600;
	singleView.artCredit.y = 100;
	
	singleView.addChild(singleView.artCredit);
	
	singleView.visible = false;
}

function handleAudioLoad(event) {
	console.log("Audio Loaded");
	
	if(soundEnabled) {
		var instance = createjs.Sound.play("mySound");
	}
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

	singleView.commentText.text = comment;

	singleView.artCredit.artistInfo.text = art.artistName + ' (' + 
		                                   art.artistOrigin + ', ' + 
										   art.artistLifeSpan + ')';

	singleView.artCredit.objectTitle.text = art.artTitle;
	singleView.artCredit.objectDetails.text = art.artMedium + "\n" +
											  art.artDimensions + "\n" +
											  art.acquisitionDetails + "\n" +
											  art.artId + "\n" +
											  "PHOTO CREDIT: " + art.photoCredit;

	singleView.alpha = 0;
	singleView.visible = true;
	createjs.Tween.get(singleView).to({alpha:1}, 400);

}

function exitSingleView() {
	singleView.visible = false;
	currenState = State.SELECTION;
	
	createjs.Sound.stop("mySound");

	/* was in mousedown */
	$.each(frames, function() {
		createjs.Tween.get(this.frameContainer).to({x: this.originalX, y: this.originalY, scaleX:1, scaleY:1}, 300);
		this.artContainer.removeAllChildren();
	});
	ArtFrame.scaleSetup();
	/* / was in mousedown */
}

function handleFrameLoad(event){
	console.log("Completed Frame Load");

	var item = event.item; // A reference to the item that was passed in to the LoadQueue
    var type = item.type;
    var image = event.result;
    var w = image.width;
    var h = image.height;
 	
	var bmp = new createjs.Bitmap(image);
	
	var ap, xy, scale, frameType;
	
	ap = new createjs.Point(0,0);

	switch(item.id) {
		case "frame_reverse":
			scale = 1.13;
			ap = new createjs.Point(18,18.5);
			xy = new createjs.Point(0,310)
			frameType = ArtFrame.FRAME_TYPES.FRAME_REVERSE;
		break;
		case "frame_narrow":
			xy = new createjs.Point(400,20);
			scale = 1.34;
			ap = new createjs.Point(5,4);
			frameType = ArtFrame.FRAME_TYPES.FRAME_NARROW;
		break;
		case "frame_cassetta":
			xy = new createjs.Point(390, 310);
			scale = 1.15;
			ap = new createjs.Point(17,16.5);
			frameType = ArtFrame.FRAME_TYPES.CASSETTA;
		break;
		case "frame_kinglouis":
			xy = new createjs.Point(0,0);
			scale = 1.025;
			ap = new createjs.Point(25,26);
			frameType = ArtFrame.FRAME_TYPES.KING_LOUIS;
		break;
	}

	// so art is placed at "frame origin"
	bmp.regX = ap.x;
	bmp.regY = ap.y;

	// account for registration / art point
	xy.x += ap.x;
	xy.y += ap.y; 

	var af = new ArtFrame(bmp, frameType);
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
 	var ao = item.data.artObject;
 	var smallScale = 0.35;
 	console.log(ao);

	var bmp = new createjs.Bitmap(image);
	bmp.cursor = "pointer";
	bmp.scaleX = smallScale;
	bmp.scaleY = smallScale;

	bmp.regX = w/2;
	bmp.regY = h/2;
	
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
		
		if(currentState == State.SINGLE_VIEW) {
			exitSingleView();
		}

		createjs.Sound.stop("mySound");
		this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
		this.rotation = -5;
		/*
		$.each(frames, function() {
			createjs.Tween.get(this.frameContainer).to({x: this.originalX, y: this.originalY, scaleX:1, scaleY:1}, 300);
			this.artContainer.removeAllChildren();
		});
		*/
		console.log("MouseDown");
		createjs.Tween.get(this).to({scaleX:1, scaleY:1}, 500, createjs.Ease.elasticOut); //circOut is really nice

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
		this.scaleX = this.scaleY = smallScale;
		update = true;
	});
	
	bmp.on("pressup", function(evt) {
		
		dragging = false;

		this.scaleX = this.scaleY = smallScale;
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
				// f.endGlow();
			}

		}

		// setArtInFrame(this, placedFrame);

		if(didPlace) {
			
			console.log("Dear "+ this.id + ",\n\nYou intersect with me!\n\nBest,\n" + placedFrame.bmp.id);
			
			var bmpc = new createjs.Bitmap(this.image);
			
			placedFrame.artContainer.removeAllChildren();
			bmpc.alpha = 0;
			createjs.Tween.get(bmpc).to({alpha:1}, 1000, createjs.Ease.quadOut);
			placedFrame.artContainer.addChild(bmpc);
			didPlace = true;
			bmpc.scaleX = bmpc.scaleY = placedFrame.artScale;

			// might have to calculate per frame type --------VVV
			var hscale = 0.00568;

			switch(placedFrame.frameType) {
				case ArtFrame.FRAME_TYPES.FRAME_NARROW:
					hscale = 0.00541;
				break;
				case ArtFrame.FRAME_TYPES.FRAME_REVERSE:
					hscale = 0.0059;
				break;

				case ArtFrame.FRAME_TYPES.KING_LOUIS:
					hscale = 0.0060;
				break;

				case ArtFrame.FRAME_TYPES.CASSETTA:
					hscale = 0.00577;
				break;
			}

			createjs.Tween.get(placedFrame.bmp).to({scaleY: h * hscale}, 100);
			
			for(var i = 0; i < frames.length; i++) {
				if(i != placedFrameIndex) {
					createjs.Tween.get(frames[i].frameContainer).to({x:300, y:900, scaleX:0.25, scaleY:0.25}, 600, createjs.Ease.quadOut);
				} else {
					createjs.Tween.get(frames[i].frameContainer).to({x:0, y:0}, 800, createjs.Ease.quadOut);
				}
			}

			currentState = State.SINGLE_VIEW;
			selectFrame(ao, placedFrame);

		}

		this.rotation = 0;
		createjs.Tween.get(this).to({x:this.origX, y:this.origY, rotation:0, override:true}, 300, createjs.Ease.quadOut);

		update = true;


	});

	artBox.addChild(bmp);

}

function handleArtComplete(event) {
	stage.update();
	
}