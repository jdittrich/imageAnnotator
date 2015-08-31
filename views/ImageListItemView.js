//render container for image subviews
//controls for loading images

//uses these via require
var _ = require("underscore");
$ = jQuery = require("jquery");
var Backbone = require("backbone");

//...as well as app.eventBus (Global)


var ImageListItemView = Backbone.View.extend({
	model:null,//not a native property, but makes sense here. Will be set.
	el:false, //makes the outer element of your template the el
	template:_.template('<li> <%= id %> <button class="removeMockup">remove</button></li>'),
	events: {
		'click button.removeMockup': 'destroyModel',
		'click':'selectMockup' 
	},
	initialize:function(){
		this.listenTo(this.model, 'destroy', this.remove);
		
	},
	serialize:function(){
		  return this.model.attributes;
	},
	beforeRender:function(){
		console.log("before render list item")
	},
	afterRender:function(){
		//this.$el.draggable({revert:true});
		console.log("after render list item")
	},
	selectMockup:function(event){
		app.eventBus.trigger("imageListSelection", this.model); //app wide event: image selected
	},
	destroyModel:function(event){
		event.stopPropagation();
		this.model.trigger("destroy",this.model, this.model.collection,{});
	}
});


module.exports = ImageListItemView;
