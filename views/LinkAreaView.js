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
		'click button.removeLinkArea': 'destroyModel'
	},
	initialize:function(){
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'change',this.render); //try something like app.project.get("mockups").at(0).get("linkSources").at(0).set("comment","bla") to test
	},
	beforeRender:function(){},
	afterRender:function(){
		var that = this;

		//setup shortcut properties
		that.$editbutton = that.$el.find('button.makeEditable');

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
			containment: "parent",
			resize: function( event, ui ) {
				event.stopImmediatePropagation()//otherwise the background image will move along
			}
		});


		//Init draggable
		var pointerY;
		var pointerX;
		that.$el.draggable({
			start:function(event,ui){
				var zoomScale = that.el.getBoundingClientRect().width / that.el.offsetWidth;

				pointerY = (event.pageY - $('body').offset().top) / zoomScale - parseInt($(event.target).css('top'));
				pointerX = (event.pageX - $('body').offset().left) / zoomScale - parseInt($(event.target).css('left'));

/*				ui.originalPosition.left = ui.offset.left / 10
				ui.originalPosition.top =  ui.offset.left / 10*/

				console.log("START:",ui.offset.left, " zoom:",zoomScale);

			},
			drag: function(event, ui) {
				//http://stackoverflow.com/questions/26180910/jquery-ui-drag-operation-on-zoomed-container-jumps-on-first-mouse-move
				var zoomScale = that.el.getBoundingClientRect().width / that.el.offsetWidth; //scaling fix: http://stackoverflow.com/questions/10212683/jquery-drag-resize-with-css-transform-scale

				var canvasTop = $('body').offset().top;
				var canvasLeft = $('body').offset().left;
				var canvasHeight = $('body').height();
				var canvasWidth = $('body').width();


				ui.position.top = Math.round(((event.pageY - canvasTop) / zoomScale) - pointerY);
				ui.position.left = Math.round(((event.pageX - canvasLeft) / zoomScale) - pointerX);

				event.stopImmediatePropagation(); //to prevent moving the background when dragging the element
			}
		});

		that.$el.draggable("disable"); //newly drawn elements are not draggable, only resizable preventing hassle when drawing (accidently) on top of each other

		//Init edit comment function
		that.$el.find(".areaComment").editable({trigger:that.$editbutton}, function(e){
				that.changeComment(e.value);
		});

		// USER ERROR PREVENTION
		//----------------------

		//deletes if the area is very small and probably was only created by accident
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

