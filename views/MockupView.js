"use strict";

var app = app || {};

app.MockupView = Backbone.Layout.extend({
	tagName: 'div',
	className: 'mockup',
	model:null,//not a native property, but makes sense here. Will be initialized.
	template:_.template('<div>drag me here</div>'),
	events: {
		'click button.removeMockup':'destroyModel',
		'dragstop': 'updateModel',
		'drawrectsdrawn':'addLinkArea',
	},
	beforeRender:function(view){},
	afterRender: function(view){
		//add the linkareas-rawing function
		view.$el.drawrects({
			removeElement:true,
		});
	},
	initialize:function(){
		//listenTo Events: Model changes (not necesarryily submodels)
		this.listenTo(this.model, 'destroy', this.remove);//if model is removed, view is removed too
		this.listenTo(this.model, 'add:linkSources', this.displayNewLinkArea);
	},
	serialize:function(){
		  return this.model.attributes;
	},
	
	destroyModel:function(){
		//Delete view
		//this.model.trigger("destroy",this.model, this.model.collection,{});
		//was this.model.destroy();
	},
	addLinkArea:function(event, model){ //adds Link area Model to collecttion
		//passed "model" data should be a JSON-object
		this.model.get("linkSources").add(model);
	},
	displayNewLinkArea:function(linkAreaModel){
		that = this; 
		var linkAreaView = this.insertView("",new app.LinkAreaView({model:linkAreaModel}));
		
		linkAreaView.render().then(function(){
			linkAreaView.$el.trigger("addedToDom");
		})
		
	}

});
