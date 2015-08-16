var app = app || {};
//requires: backbone, underscore, jquery



app.LinkAreaView = Backbone.View.extend({
	model:null,//not a native property, but makes sense here. Will be set.
	el:false, //makes the outer element of your template the el
	template:_.template('<div class="linkArea"><%=width%><button class="removeLinkArea">x</button><section class="areaComment"> <%= comment %></section><button class="makeEditable">edit</button></div>'),
	serialize:function(){ //makes model attributes availiable in template
		  return this.model.attributes;
	},
	events: {
		'click button.removeLinkArea': 'destroyModel',
		//'click button.setTarget':'setupSetTarget' //this was meant for linking, now we may want
	//several links and/or just some text
	},
	initialize:function(){
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'change',this.render); //try something like app.project.get("mockups").at(0).get("linkSources").at(0).set("comment","bla") to test
	},
	beforeRender:function(){},
	afterRender:function(){
		var that = this;

		//set the position and dimensions using the model data
		//---------------------------------------------------
		//TODO Future: use % data in models
		that.$el.css({
			left: that.model.get("left") + "px",
			top: that.model.get("top") + "px",
			width: that.model.get("width") + "px",
			height: that.model.get("height") + "px"
		});

		// INTERACTIONS
		// ------------

		//Init reziable

		that.$el.resizable({
			containment: "parent"
		});


		//Init draggable

		that.$el.draggable({
			start:function(event,ui){
				ui.position.left = 0;
				ui.position.top = 0;
				console.log("dragstart")
			},
			drag: function(event, ui) {//scaling fix: http://stackoverflow.com/questions/10212683/jquery-drag-resize-with-css-transform-scale
				var zoomScale = that.el.getBoundingClientRect().width / that.el.offsetWidth; // http://stackoverflow.com/questions/5603615/get-the-scale-value-of-an-element
				var changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
				var newLeft = ui.originalPosition.left + (changeLeft / zoomScale); // adjust new left by our zoomScale

				var changeTop = ui.position.top - ui.originalPosition.top; // find change in top
				var newTop = ui.originalPosition.top + (changeTop / zoomScale); // adjust new top by our zoomScale

				ui.position.left = newLeft;
				ui.position.top = newTop;
			}
		});

		//Init edit comment function
		that.$el.find(".areaComment").editable("dblclick", function(e){
				that.changeComment(e.value);
		});

		// USER ERROR PREVENTION
		//----------------------

		////deletes if the area is very small and probably was only created by accident
		if(that.model.get("width")<10||that.model.get("height")<10){ //deletes if the area is very small and probably was only created by accident
			that.destroyModel();
			return; //TODO programming debt: multiple exits: bad
		}
	},
	changeComment:function(newValue){
		this.model.set({comment:newValue});
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

