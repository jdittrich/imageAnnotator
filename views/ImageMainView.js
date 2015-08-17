//renders
//the current main image
//sorta the viewport of the app


"use strict";


var app = app || {};

app.ImageMainView = Backbone.View.extend({
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
		this.listenTo(this.model, 'add:linkSources', this.displayNewLinkArea); //new link areas will be added via the addLinkArea function
	},
	afterRender: function () {
		var that = this;
		//ELEMENT SHORTCUTS
		this.$tools= this.$el.find(".tools");
		this.$imageView = this.$el.find(".currentImageView");

		//UI SETUP
		this.$tools.buttonset();

		// BEHAVIOUR SETUP
		this.$imageView.panzoom();

		this.$imageView.drawrects({
			removeElement: true,
			distance: 5
		});

		// wired bug: image zooming after "hard reset reload (shift+strg+R) works only if
		// 1) rendering is triggered the 2nd time
		// 2) the browser is reloaded normally again
		// so probably: a. The HTML is rendered. b. This code executes and caches the dimensions of the dom elements c. the image is loaded and changes the dimensions of the dom elements to zoom - the caches cordinates are useless now and produce the "wrong" behaviour.
		//possible fix: set one dimension (h or w) of the image in css.
	},
	beforeRender: function () {
		var that = this;
		that.model.get("linkSources").each(function (element, index, list) {
			that.insertView(".currentImageView", new app.LinkAreaView({
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
		this.model.get("linkSources").add(model);
	},
	displayNewLinkArea: function (newModel) {
		this.insertView(".currentImageView", new app.LinkAreaView({
			model: newModel
		})).render();
	},
	setStateHand:function(){
		this.$imageView.drawrects("disable");
		this.$imageView.panzoom("enable");
	},
	setStateAddAnnotation:function(){
		this.$imageView.panzoom("disable");
		this.$imageView.drawrects("enable");
	},
	/*currentState:null,
	states: { //in this case: states could be named "tools", but I thought I give it a generic name, so I know I can changes the store the states in the stage prperty.
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
