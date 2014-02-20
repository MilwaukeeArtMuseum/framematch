(function() {
 
	var ArtObject = function(objectDefinition) {
	  this.initialize(objectDefinition);
	}

	var p = ArtObject.prototype = new createjs.Container();
	 
	p.Container_initialize = p.initialize;

	p.initialize = function(objectDefinition) {
	    this.Container_initialize();
	    var t = this;
	    var o = objectDefinition;

	    t.id = o.id;
	    t.def = o;

	    t.artistName = o.artistName;
	    t.artistOrigin = o.artistOrigin;
	    t.artistLifespan = o.artistLifespan;
	    t.artTitle = o.artTitle;
	    t.artDate = o.artDate;
	    t.artMedium = o.artMedium;
	    t.artDimensions = o.artDimensions;
	    t.acquisitionDetails = o.aquisitionDetails;
	    t.artId = o.artId;
	    t.photoCredit = o.photoCredit;
	    t.artImageURL = o.artImage;

	    t.audio = [];
	    t.audio[ArtFrame.FRAME_TYPES.KING_LOUIS] = o.audio.frame_kinglouis;
	    t.audio[ArtFrame.FRAME_TYPES.FRAME_REVERSE] = o.audio.frame_reverse;
	    t.audio[ArtFrame.FRAME_TYPES.FRAME_NARROW] = o.audio.frame_narrow;
	    t.audio[ArtFrame.FRAME_TYPES.CASSETTA] = o.audio.frame_cassetta;


	    // add custom setup logic here.
	}
	 
	window.ArtObject = ArtObject;

}());