(function() {
	
	var ArtFrame = function(bmp, frameType) {
		
		var t = this;
		t.artPoint = null;
		t.bmp = bmp;
	
		t.isGlowing = false;
			
		t.frameType = frameType;
		
		t.frameContainer = new createjs.Container();

		//t.frameContainer.on("rollover", function(evt) {console.log("MOUSEY MOUSEY");})
		
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
	ArtFrame.prototype.glow = function() {
		if(!this.isGlowing) {
			this.isGlowing = true;
			createjs.Tween.get(this.frameContainer).to({scaleX: 1.05, scaleY: 1.05, x:this.originalX-8, y:this.originalY-8, override:true}, 200);
		}
	}
	ArtFrame.prototype.endGlow = function() {
		if(this.isGlowing) {
			this.isGlowing = false;
			createjs.Tween.get(this.frameContainer).to({scaleX: 1, scaleY: 1, x: this.originalX, y: this.originalY, override:true}, 100);
		}
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
