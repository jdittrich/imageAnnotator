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
	},
	initialize: function () {
		this.listenTo(this.model, 'destroy', this.remove);
		this.listenTo(this.model, 'add:linkSources', this.displayNewLinkArea); //new link areas will be added via the addLinkArea function
	},
	afterRender: function () {
		//ELEMENT SHORTCUTS


		//UI SETUP
		this.$el.find(".tools").buttonset();

		// BEHAVIOUR SETUP
		this.$el.find(".currentImageView").drawrects({
			removeElement: true,
			distance: 5,
			allowSelector: "." + this.$el.attr("class")
		});
		// wired bug: image zooming after "hard reset reload (shift+strg+R) works only if
		// 1) rendering is triggered the 2nd time
		// 2) the browser is reloaded normally again
		// so probably: a. The HTML is rendered. b. This code executes and caches the dimensions of the dom elements c. the image is loaded and changes the dimensions of the dom elements to zoom - the caches cordinates are useless now and produce the "wrong" behaviour.
		//possible fix: set one dimension (h or w) of the image in css.


		var $panzoom = this.$panzoom = this.$el.find(".currentImageView").panzoom(); //for testing purposes: can be deactivated via: $(".currentImageView").panzoom("disable");

		$panzoom.on('mousewheel.focal', function (e) { //sets up zoom-to-coursor
			e.preventDefault();
			var delta = e.delta || e.originalEvent.wheelDelta;
			var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
			console.log(e.clientX, e)
			$panzoom.panzoom('zoom', zoomOut, {
				increment: 0.1,
				animate: false,
				focal: e
			});
		});
	},
	beforeRender: function () {
		var that = this;
		that.model.get("linkSources").each(function (element, index, list) {
			that.insertView("", new app.LinkAreaView({
				model: element
			}));
		}, that);
	},
	addLinkArea: function (event, model) {
		this.model.get("linkSources").add(model);
	},
	displayNewLinkArea: function (newModel) {
		this.insertView("", new app.LinkAreaView({
			model: newModel
		})).render();
	},
	states: { //in this case: states could be named "tools", but I thought I give it a generic name, so I know I can changes the store the states in the stage prperty.
		hand:{
			enter:function(){

			},
			exit:function(){}
		},//the pan/zoom state
		addAnnotations:{
			enter:function(){},
			exit:function(){}
		}
	},
	changeState:function(state){}
});
