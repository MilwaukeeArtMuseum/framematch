(function() {
 
var ArtObject = function(objectDefinition) {
  this.initialize(objectDefinition);
}
ArtObject.prototype = new createjs.Container();
 
ArtObject.prototype.Container_initialize = p.initialize;
ArtObject.prototype.initialize = function(objectDe) {
    this.Container_initialize();
    this.id = objectDefinition.id;
	this.artistName = objectDefinition.artistName;
}
 
window.ArtObject = ArtObject;

}());