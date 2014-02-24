(function() {

	var ArtFrame = function(bmp, frameType) {
		
		var t = this;
		t.artPoint = null;
		t.bmp = bmp;

		t.frameType = frameType;
		
		t.frameContainer = new createjs.Container();
		t.frameContainer.addChild(t.bmp);
		
		t.frameTop = new createjs.Container();
		
		t.frameContainer.addChild(t.frameTop);
		t.frameBot = new createjs.Container();
		
		t.frameContainer.addChild(t.frameBot);
		t.artContainer = new createjs.Container();
		
		t.frameContainer.addChild(t.artContainer);
		//t.artContainer.x = -t.bmp.regX;
		//t.artContainer.y = -t.bmp.regY;

		t.originalX = 0;
		t.originalY = 0;
		t.artScale = 1;

		ArtFrame.artframes.push(this);
		ArtFrame.numFrames++;

	}

	ArtFrame.prototype.setPoint = function(pt) {
		this.artPoint = pt;
		this.artContainer.x = this.artPoint.x;
		this.artContainer.y = this.artPoint.y;
	}
	
	ArtFrame.prototype.setScale = function(scale) {
		this.artScale = scale;
	}
	
	ArtFrame.prototype.setXY = function(pt) {
		
		this.frameContainer.setTransform(pt.x,pt.y);
		this.originalX = pt.x;
		this.originalY = pt.y;
	}
	
	ArtFrame.prototype.setFrameHeight = function(height) {
		this.frameContainer.scaleY = height;
	}

	ArtFrame.FRAME_TYPES = {KING_LOUIS:"frame_kinglouis",
							FRAME_NARROW:"frame_narrow",
							FRAME_REVERSE:"frame_reverse",
							CASSETTA:"frame_cassetta",
						   }

	ArtFrame.artframes = [];
	ArtFrame.numFrames = 0;

	ArtFrame.scaleSetup = function() {
		var f = ArtFrame.artframes;

		for(i = 0; i < this.numFrames; i++) {
			var fe = f[i];

			createjs.Tween.get(fe.bmp).to({scaleY:1}, 80);

		}

	}

	window.ArtFrame = ArtFrame;

}());