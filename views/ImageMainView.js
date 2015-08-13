//renders 
//the current main image
//sorta the viewport of the app


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
		'click button.removeMockup':'destroyModel',
		'drawrectsdrawn':'addLinkArea',
	},
	initialize:function(){
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'add:linkSources', this.displayNewLinkArea);//new link areas will be added via the addLinkArea function
	},
	afterRender:function(){
		console.log("jq drawrects initialized?",this.$el.drawrects)
		this.$el.drawrects({
			removeElement:true,
			distance:5,
			allowSelector:"."+this.$el.attr("class")
		});
	},
	beforeRender:function(){
		var that = this;
		that.model.get("linkSources").each(function(element,index,list) {
			that.insertView("",new app.LinkAreaView({model:element}));
		}, that);
	},
	addLinkArea:function(event, model){
		this.model.get("linkSources").add(model);
	},
	displayNewLinkArea:function(newModel){
		this.insertView("",new app.LinkAreaView({model:newModel})).render();
	}
});
