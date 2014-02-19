
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