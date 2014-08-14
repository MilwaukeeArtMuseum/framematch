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
var headerBox;
var logoBox;

var soundEnabled = true;
var artistInfo;

var bgColor = "#984daf";
var frameBg = "#a48ca4";
var artBoxDark = "#794b93";
var artBoxDark = "#794b93";
var artBoxDark = "#784a93";
var logoBoxDark = "110b15"; //"#0f0a13";
var buttonColor = artBoxDark;
var splashBox;

var isOverlay = true;

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
	canvas = document.getElementById("stageCanvas");
	
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
	

	createSplash();
	createFrameBox();
	createArtBox();
	setupSingleView();
	createLogoBox();
	

	stage.addChild(bg, singleView, frameBox, artBox, splashBox, headerBox);
	
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
	frameBox.y = 120;//90;
}

function createLogoBox() {

	headerBox = new createjs.Container();
	headerBox.x = 0;
	headerBox.y = 0;//90;

	var headerBoxShape = new createjs.Shape();
	headerBoxShape.graphics.beginFill(logoBoxDark);
	headerBoxShape.graphics.drawRect(0,0,1024,60);
	headerBoxShape.graphics.endFill();
	headerBox.headerBoxShape = headerBoxShape;
	headerBox.addChild(headerBoxShape);

	var headerText = new createjs.Text("KOHL'S ART GENERATION LAB: MUSEUM INSIDE OUT", "26px PT Sans", "#eee");
	headerText.x = 20;
	headerText.y = 16;
	headerText.shadow = new createjs.Shadow("#888888", 0,0,5);
	headerBox.shadow = new createjs.Shadow("#000000", 0,0,60);
	headerBox.addChild(headerText);


}

function createArtBox() {
	artBox = new createjs.Container();
	artBox.x = 20;
	artBox.y = 30;

	var artBoxShape = new createjs.Shape();
	artBoxShape.graphics.beginFill(artBoxDark);
	artBoxShape.graphics.drawRect(-20,20,145,800);
	artBoxShape.graphics.endFill();
	artBox.artBoxShape = artBoxShape;
	artBox.addChild(artBoxShape);
}

function createSplash() {
	
	splashBox = new createjs.Container();
	splashBox.x = 0;
	splashBox.y = 0;


	/*
	var splashBoxShape = new createjs.Shape();
	splashBoxShape.graphics.beginFill(bgColor);
	splashBoxShape.graphics.drawRect(0,0,1024,768);
	splashBoxShape.graphics.endFill();
	splashBox.splashBoxShape = splashBoxShape;
	splashBox.addChild(splashBoxShape);

	
	var logoBox = new createjs.Bitmap("img/logos.png");
	var example = new createjs.Bitmap("img/example.png");

	example.x = 70;
	example.y = 180;

	logoBox.x = 670;
	logoBox.y = 120;

	splashBox.logoBox = logoBox;
	splashBox.addChild(logoBox, example);

	var para1 = "Which artwork looks best in which frame? Click and drag the artwork into the frames to see how each one looks with a different frame style. Collaborate with friends and family—see if you agree or disagree with each other’s choices!";
	var para2 = "\n\n\nFramers and curators usually choose certain types of frames for artworks from a particular time period or that have a specific style. For example, prints usually go into the cassetta frame; photographs usually use a narrow profile frame; modern or newer art often goes into a reverse profile frame; and older art often is placed in King Louis XV-style frames. That said, Museum staff always consider carefully what frames make an artwork look their best—so don’t be afraid to experiment, too!";
	
	var logoText = new createjs.Text(para1, "16px PT Sans", "#000");
	var logoTextB = new createjs.Text(para2, "16px PT Sans", "#000");
	
	var boldText = new createjs.Text("Is there a right answer?", "bold 16px PT Sans", "#000");
	
	boldText.alpha = 0.7;
	boldText.y = 440;
	boldText.x = 40;
	
	logoText.alpha = 0.6;
	logoText.x = 40;
	logoText.y = 120;
	logoText.lineWidth = 550;
	logoText.textBaseline = "alphabetic";
	logoText.textAlign = "left";

	logoTextB.alpha = 0.6;
	logoTextB.x = 40;
	logoTextB.y = 440;
	logoTextB.lineWidth = 550;
	logoTextB.textBaseline = "alphabetic";
	logoTextB.textAlign = "left";

	//logoText.shadow = new createjs.Shadow("#888888", 0,0,5);



	var btn = createButton(60, 650, 190, "CONTINUE", removeSplash);
	
	splashBox.addChild(logoText, logoTextB, boldText, btn);
	*/

	var example = new createjs.Bitmap("img/splash.png");

	example.x = 115;
	example.y = 97;

	splashBox.addChild(example);
	
}

function removeSplash() {

	splashBox.parent.removeChild(splashBox);

}

function createButton(x, y, w, labelText, clickFunction) {
		
		var btn = new createjs.Container();
		
		btn.cursor = "pointer";

		var btnBG = new createjs.Shape();
		btnBG.shadow = new createjs.Shadow("#222222", 0,3,20);
		btnBG.graphics.beginFill(buttonColor).drawRoundRect(-20, -20, w, 75, 15).endFill();

		var btnTXT = new createjs.Text(labelText, "26px PT Sans", "#eee");
		btnTXT.x = 12;
		btnTXT.y = 3;
		btn.bg = btnBG;
		btn.txt = btnTXT;

		btn.addChild(btnBG, btnTXT);
		btn.y = y;
		btn.x =x;
		
		
		btn.on("mousedown", function(evt) {
			clickFunction();
		});

		return btn;

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

	var text = new createjs.Text("hello", "20px PT Sans", "#000000");
	text.alpha = 0.5; 
	
	text.x = 200; 
	text.y = 490;


	text.lineWidth = 750;
	text.textBaseline = "alphabetic";
	text.textAlign = "left";
	//text.s
	singleView.commentText = text;
	
	var commentBack = new createjs.Shape();
	var padding = 20;
	/*
	commentBack.graphics.beginFill("#ccc").drawRect(text.x - padding,
													text.y-text.getMeasuredLineHeight()-padding, 
													text.lineWidth+padding, 
													200+padding).endFill();
	*/
	commentBack.graphics.beginFill("#ccc").drawRect(artBox.artBoxShape.x,
													text.y-text.getMeasuredLineHeight()-padding, 
													1024,
													600).endFill();
	

	//commentBack.shadow = new createjs.Shadow("#ccc",0,0,20);
	commentBack.alpha = 0.1;
 	//commentBack.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
 	

	singleView.commentBox.addChild(/*commentBack,*/ singleView.commentText);
	
	singleView.artCredit = new createjs.Container();

	var creditBG = new createjs.Shape();
	creditBG.graphics.beginFill('#eeeeee').drawRect(0,0,350,250).endFill();
	creditBG.shadow = new createjs.Shadow("#222222", 0,5,20);

	/*

	var backButton = new createjs.Container();
	backButton.cursor = "pointer";
	var backButtonBG = new createjs.Shape();
	backButtonBG.graphics.beginFill("#aaa").drawRoundRect(-20, -20, 125, 75, 15).endFill();

	var backButtonTXT = new createjs.Text('BACK', "30px PT Sans", "#333");

	backButton.bg = backButtonBG;
	backButton.txt = backButtonTXT;


	backButton.addChild(backButtonBG, backButtonTXT);
	backButton.y = 590;
	backButton.x = 250;
	singleView.backButton = backButton;	
	backButton.on("mousedown", function(evt) {
		exitSingleView();
	});

	*/

	var backButton = createButton(890, 690, 125, "BACK", exitSingleView);
	
	var artistInfo = new createjs.Text('',"14px PT Sans", "#333");
	var objectTitle = new createjs.Text('',"14px PT Sans", "#333");
	var objectDetails = new createjs.Text('', "14px PT Sans", "#333");


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

	singleView.artCredit.addChild(creditBG, artistInfo, objectTitle, objectDetails);
	

	singleView.artCredit.x = 600;
	singleView.artCredit.y = 100;
	
	singleView.addChild(singleView.artCredit, backButton);
	
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
	//alert(frame.artScale);
	//singleView.commentText.y = frame.frameContainer.scaleY * 480.0;

	singleView.artCredit.artistInfo.text = art.artistName + ' (' + 
		                                   art.artistOrigin + ', ' + 
										   art.artistLifeSpan + ')';

	singleView.artCredit.objectTitle.text = art.artTitle + ', ' + art.artDate;
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


	var po = new createjs.Point(0,0);

	switch(item.id) {
		case "frame_reverse":
			scale = 1.13;
			ap = new createjs.Point(18,18.5);
			xy = new createjs.Point(0,310)
			po = new createjs.Point(0,0);
			frameType = ArtFrame.FRAME_TYPES.FRAME_REVERSE;
		break;
		case "frame_narrow":
			xy = new createjs.Point(390,0);
			scale = 1.34;
			ap = new createjs.Point(5,4);
			po = new createjs.Point(-15,-15);
			frameType = ArtFrame.FRAME_TYPES.FRAME_NARROW;

		break;
		case "frame_cassetta":
			xy = new createjs.Point(390, 310);
			scale = 1.15;
			ap = new createjs.Point(17,16.5);
			po = new createjs.Point(-3, -3);
			frameType = ArtFrame.FRAME_TYPES.CASSETTA;
		break;
		case "frame_kinglouis":
			xy = new createjs.Point(0,0);
			scale = 1.025;
			ap = new createjs.Point(25,26);
			po = new createjs.Point(8,7);
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
	af.setPoint(ap, po);

	frames.push(af);
	
	frameBox.addChild(fc);

	bmp.shadow = new createjs.Shadow("#222", 0, 10, 30);

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


	bmp.shadow = new createjs.Shadow("#222", 0, 5, 15);

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
	
	bmp.on("mousedown", function(evt) {
		if(isOverlay) {
				isOverlay = false;
				createjs.Tween.get(splashBox).to({alpha:0}, 500).call(function() {splashBox.parent.removeChild(splashBox);}); //circOut is really nice
				//overlay.parent.removeChild(overlay);
		}
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
			var hdiv = null;;

			switch(placedFrame.frameType) {
				case ArtFrame.FRAME_TYPES.FRAME_NARROW:
					hscale = 0.00541;
					hdiv = 60;
				break;
				case ArtFrame.FRAME_TYPES.FRAME_REVERSE:
					hscale = 0.0059;
					hdiv = 80;
				break;

				case ArtFrame.FRAME_TYPES.KING_LOUIS:
					hscale = 0.0060;
					hdiv = 70;
				break;

				case ArtFrame.FRAME_TYPES.CASSETTA:
					hscale = 0.00577;
					hdiv = 60;
				break;
			}

			createjs.Tween.get(placedFrame.bmp).to({scaleY: h * hscale}, 100);
			singleView.commentText.y = 210 + (h) + hdiv; 
			for(var i = 0; i < frames.length; i++) {

				var sf = frames[i];

				if(i != placedFrameIndex) {
					createjs.Tween.get(sf.frameContainer).to({x:300, y:900, scaleX:0.25, scaleY:0.25}, 600, createjs.Ease.quadOut);
				} else {
					createjs.Tween.get(sf.frameContainer).to({x:sf.offset.x, y:sf.offset.y}, 800, createjs.Ease.quadOut);
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