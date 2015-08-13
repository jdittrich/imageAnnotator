var app = app || {};
//requires: backbone, underscore, jquery



app.LinkAreaView = Backbone.View.extend({
	model:null,//not a native property, but makes sense here. Will be set.
	el:false, //makes the outer element of your template the el
	template:_.template('<div class="linkArea"><%=width%><button class="removeLinkArea">x</button></div>'),
	serialize:function(){
		  return this.model.attributes;
	},
	events: {
		'click button.removeLinkArea': 'destroyModel',
		//'click button.setTarget':'setupSetTarget' //this was meant for linking, now we may want 
    //several links and/or just some text
	},
	initialize:function(){
		this.listenTo(this.model, 'destroy', this.remove);
	},
	beforeRender:function(){},
	afterRender:function(){
		var that = this;
		that.$el.css({
			left: that.model.get("left") + "px",
			top: that.model.get("top") + "px",
			width: that.model.get("width") + "px",
			height: that.model.get("height") + "px"
		});
		that.$el.resizable({
				containment: "parent"
			});
		
		if(that.model.get("width")<10||that.model.get("height")<10){
			that.destroyModel();
		}
	},
	destroyModel:function(event){
		if(event){event.stopPropagation();}
		
		this.model.trigger("destroy",this.model, this.model.collection,{});
	},
	/*setupSetTarget:function(event){
		this.insertView("",new app.TargetListView({model:app.project, sourceModel:this.model})).render();
	},
	setTarget:function(targetModel){	}*/
});

