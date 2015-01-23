
//render part for image subviews
//controls for loading images
"use strict";


var app = app || {};


app.ImageListView = Backbone.View.extend({
	model:null,//not a native property, but makes sense here. Will be set.
	el:false, //makes the outer element of your template the el
	template:_.template('<div><button class="newMockup">NewStuff!</button><ul id="mockupList"></ul></div>'),
	events: {
		'click button.newMockup': 'newMockupModel',

	},
	initialize:function(){
		this.listenTo(this.model.get("mockups"),"add",this.displayNewListItem)
	},
	beforeRender:function(view){
		//alle Bilder Rendern als Liste
		var that = this;
		_.each(that.model.get("mockups"),function(element,index,list) {
			that.insertView("",new app.ImageListItemView({model:element}));//adapt this!
		}, that);
	},
	afterRender:function(){
		//this.$el.draggable({revert:true});
	},
	displayNewListItem:function(mockupModel){
		var newView = this.insertView("#mockupList",new app.ImageListItemView({model:mockupModel}));
		// this.renderViews();
		newView.render(); //try this
	},
	newMockupModel:function(){
		this.model.get("mockups").add({title:"someTitel"});
	}
});
	