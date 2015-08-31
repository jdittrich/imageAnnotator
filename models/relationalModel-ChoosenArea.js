var _ = require("underscore");
var $ = require("jquery");
var Backbone = require("backbone");
var BackboneRelational = require("backbone-relational");


var ChoosenArea = Backbone.RelationalModel.extend({
//TODO: in is enough if this is simply hierarchial for now. We could have many Link Sources to many other Link Sources too though
	defaults:function() {
		return{
		left:0,
		top:0,
		comment:"comment",
		width:100,
		height:100,
		id:'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			})
		}
	}
});

module.exports = ChoosenArea;
