
//render part for image subviews
//controls for loading images
"use strict";


var app = app || {};


app.ImageMainView = Backbone.View.extend({
	model:null,//not a native property, but makes sense here. Will be set.
	el:false, //makes the outer element of your template the el
	template:_.template('<div class="currentImageView">hey! <%= id %></div>'),
	serialize:function(){
		  return this.model.attributes;
	},
	events: {
		//listeTo JqueryPlugin Events
	},
	initialize:function(){
		//TODO: liste to remove
	},
	afterRender:function(){
		//TODO: initialize jQuery Plugin
	},
	addLinkArea:function(){},//TODO
	displayLinkArea:function(){}//TODO
});
