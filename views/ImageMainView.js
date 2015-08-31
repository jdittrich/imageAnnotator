var _ = require("underscore");
$ = jQuery = require("jquery");
var Backbone = require("backbone");
require("../libs/jqueryUI")

var Panzoom = require("../libs/jquerypanzoom")
var DrawRects = require("../libs/drawRects-JqueryUi");

var LinkAreaView = require("./ChoosenAreaView");



//uses app.eventBus (Global)

var ImageMainView = Backbone.View.extend({
	model: null, //not a native property, but makes sense here. Will be set.
	el: false, //makes the outer element of your template the el
	//template:_.template('<div id="mainViewport"><div class="currentImageView"><img draggable="false" src="<%= filename %>" /></div></div>'),
	template: _.template('<div class="mainViewImage"><div class="tools"><input type="radio" id="toolbar-hand" name="radio"><label for="toolbar-hand">Hand</label><input type="radio" id="toolbar-addAnnotation" name="radio"><label for="toolbar-addAnnotation">Add Annotation</label></div><div class="imageViewport"><div class="currentImageView"><img draggable="false" src="<%= filename %>" /></div></div></div>'),
	serialize: function () {
		return this.model.attributes;
	},
	events: {
		'click button.removeMockup': 'destroyModel',
		'drawrectsdrawn': 'addLinkArea',
		'click input#toolbar-hand':'setStateHand',
		'click input#toolbar-addAnnotation':'setStateAddAnnotation',
		'mousewheel.focal .currentImageView':'zoom'

	},
	initialize: function () {
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'add:choosenAreas', this.displayNewLinkArea); //new link areas will be added via the addLinkArea function
	},
	afterRender: function () {
		var that = this;
		//ELEMENT SHORTCUTS
		this.$tools= this.$el.find(".tools");
		this.$imageView = this.$el.find(".currentImageView");
		this.$image = this.$el.find(".currentImageView > img");

		//UI SETUP
		this.$tools.buttonset();

		// BEHAVIOUR SETUP
		//should be a function, since we want to call it in an event (or not)
		var setupPanzoom = function(){
			that.$imageView.panzoom({
				onStart:function(e,panzoom,event){ //event is the actual starting event argument (not sure about other differences to e here)
					if(event.target !== panzoom.elem){
						return false;
					}
				}
			});
		}

		//setup directly or wait until loaded. In particular this is needed because in choromium, the zoom-to-focalpoint will fail if panzoom is initialized when the image has not been loaded
		if(this.$image.prop('complete')){
			setupPanzoom();
		} else {
			this.$image.load(function(){
				setupPanzoom();
			});
		}
		//MINOR BUG: All is pixely when scaling up http://stackoverflow.com/questions/25590315/why-is-transition-on-transform-scale-makes-an-element-become-pixelated-in-w


		//enable the choose areas function
		this.$imageView.drawrects({
			removeElement: true,
			distance: 5
		});
	},
	beforeRender: function () {
		var that = this;
		that.model.get("choosenAreas").each(function (element, index, list) {
			that.insertView(".currentImageView", new LinkAreaView({
				model: element
			}));
		}, that);
	},
	zoom:function (e) { //sets up zoom-to-coursor
		e.preventDefault();
		var delta = e.delta || e.originalEvent.wheelDelta;
		var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
		this.$imageView.panzoom('zoom', zoomOut, {
			increment: 0.1,
			animate: false,
			focal: e
		});
	},
	addLinkArea: function (event, model) {
		this.model.get("choosenAreas").add(model);
	},
	displayNewLinkArea: function (newModel) {
		this.insertView(".currentImageView", new LinkAreaView({
			model: newModel
		})).render();
	},
	setStateHand:function(){
		this.$imageView.removeClass("state-addAnnotation");
		this.$imageView.addClass("state-hand");
		this.$imageView.drawrects("disable");
		this.$imageView.panzoom("enable");
		this.$imageView.find(".ui-draggable").draggable("enable").resizable("enable");
	},
	setStateAddAnnotation:function(){
		this.$imageView.removeClass("state-hand");
		this.$imageView.addClass("state-addAnnotation");
		this.$imageView.panzoom("disable");
		this.$imageView.drawrects("enable");
		this.$imageView.find(".ui-draggable").draggable("disable").resizable("disable");
	},
	/*currentState:null,
	states: { //in this case: states could be named "tools", but I thought I give it a generic name, so I know I can changes the store the states in the stage property.
		hand:{
			enter:function(){
				this.$imageView.panzoom("enable");
			},
			exit:function(){
				this.$imageView.panzoom("disable")
			}
		},//the pan/zoom state
		addAnnotations:{
			enter:function(){
				this.$imageView.drawrects("enable")
			},
			exit:function(){
				this.$imageView.drawrects("disable")
			}
		}
	},
	changeState:function(newState){
		this.states[this.currentState].exit();
		this.states[newState].enter();
		this.currentState=newState;
	}*/
});


module.exports = ImageMainView;
