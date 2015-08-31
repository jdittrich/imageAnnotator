var _ = require("underscore");
var $ = require("jquery");
var Backbone = require("backbone");
var BackboneRelational = require("backbone-relational");

var ChoosenArea = require("./relationalModel-ChoosenArea");


var Image = Backbone.RelationalModel.extend({
		relations: [{
		type: Backbone.HasMany,
		key: 'choosenAreas',
		relatedModel: ChoosenArea,
		reverseRelation: {
			key: 'myImage'
		}
	}],
	defaults:function(){
		return{
			filename: '',
			fullpath:'',
			comment:'No Comment',
			title: 'No title',
			id:('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			})),
		};
	}
});

module.exports = Image;
