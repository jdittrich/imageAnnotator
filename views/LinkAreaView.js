var app = app || {};
//requires: backbone, underscore, jquery, jsplumb

/*
TODO: After dragging do a repaint
app.jsPlumbInstance.repaint("linkArea-8f81bed0-22e4-4de3-96fe-20aa6c2513dd")


*/

app.LinkAreaView = Backbone.Layout.extend({
	tagName: 'div',
	className: 'linkArea',
	model: null, //not a native property, but makes sense here. Will be initialized.
	events: {
		//will they be propagated?! -> yes
		'mousedown': 'preventPropagation',
		'click button.removeLinkArea': 'destroyModel',
		'dragstop': 'modelDomUpdate',
		'dragstop': 'repaint',
		'resizestop': 'repaint',
		'isConnectionSource': 'userModelConnectionCreate',
		'wasConnectionSource': 'userModelConnectionDelete'
	},
	template:_.template('<div class="handle">---</div><button class="removeLinkArea"> x </button'),
	initialize: function () {
		var that = this;
		//listenTo Events: Model changes (not necesarryily submodels)
		that.listenTo(that.model, 'destroy', that.removeView); //if model is removed, view is removed too
		that.listenTo(that.model, 'change:target', that.modelConnectionCreate);
		that.listenTo(that.model, 'change:target', that.modelConnectionRemove); //TODO: unset will only fire change, not remove
		

		//that.$el.resizable({containment:"parent"});

		//app.jsPlumbInstance.draggable(this.$el, {containment: "parent"});//was in initialize before…

		//set position

		
	},
	
	beforeRender:function(view){},
	afterRender:function(view){
		var that = this;
		
		view.$el.css({
			left: that.model.get("left") + "px",
			top: that.model.get("top") + "px",
			width: that.model.get("width") + "px",
			height: that.model.get("height") + "px"
		});
		
		view.$el.attr("id", app.config.linkArea.idPrefix + that.model.get("id"));
		
		view.$el.on("addedToDom", function () {
			that.endpoint = app.jsPlumbInstance.addEndpoint(view.el, {
				isSource: true,
				deleteEndpointsOnDetach: true,
				uniqueEndpoint: true
			}); //this here is the element itself… scoping and this-stuff

			app.jsPlumbInstance.draggable(view.$el, {
				containment: "parent",
				handle: ".handle"
			}); //was in initialize before… worked there too
			view.$el.resizable({
				containment: "parent"
			});
		});
		
	},
	modelDomUpdate: function (event) {
		event.stopPropagation(); //TODO: can this be deleted?

		this.model.set({
			'left': parseFloat(this.$el.css('left')),
			'top': parseFloat(this.$el.css('top')),
			'width': parseFloat(this.$el.css('width')),
			'height': parseFloat(this.$el.css('height'))
		});

		//this.model.save(); //does this make sense? Alternative:  pass data directly to save or call save another time.
	},
	preventPropagation: function (e) { //prevent event bubbeling to avoid side effects
		e.stopPropagation();
	},
	repaint: function (event) {
		var that = this;
		window.setTimeout(function () {
			app.jsPlumbInstance.repaint(that.$el);
		}, 1); //TODO try again: dies it work without the timeout?
	},
	destroyModel: function () {
		//Delete view
		this.model.trigger("destroy",this.model, this.model.collection,{});
		//was: this.model.destroy();
	},
	removeView: function () {
		app.jsPlumbInstance.detachAllConnections(this.el);
		app.jsPlumbInstance.deleteEndpoint(this.endpoint);
		this.remove();
	},
	userModelConnectionCreate: function (jqEvent, info, originalEvent) { //when the user makes a connection
		//creates a connection on the model, thus mirroning the changes in the DOM
		var domId = $(info.target).attr("id");

		var targetMockup = this.getModelFromIdString(domId, app.config.mockup.idPrefix);

		this.model.set("target", targetMockup, {
			silent: true
		}); //when models are changed we wnat to do changes in the dom accordingly. But sice they have been done already we silence the event
	},
	userModelConnectionDelete: function (jqEvent, info, originalEvent) { //when the users makes a connection
		//deletes a connection from the model thus mirroning the changes in the DOM
		this.model.unset("target", {
			silent: true
		}); //when models are changed we wnat to do changes in the dom accordingly. But sice they have been done already we silence the event
	},
	modelConnectionCreate: function (event, model) { //if a connection is create programatically. Should only happen on start
		var sourceDomElement = this.$el;
		var targetDomElement = $("#" + app.config.mockup.idPrefix + model.get("id"))

		//just get rid of the current connection
		app.jsPlumbInstance.detachAllConnections(this.$el); //dont fire since the event is used to reflect changes on the model if the user does the interaction

		//create a new connection
		app.jsPlumbInstance.connect({
			source: sourceDomElement,
			target: targetDomElement
		})
	},
	modelConnectionDelete: function (event, model) { //if a connection is create programatically. Should only happen if done for testing purposes by manual calls.

		//get rid of the current connection (there should only be one connection, but if not – why not catch them all?)
		jsPlumb.detachAllConnections(this.$el)
	},


	getModelFromIdString: function (id, prefix) {
		//basically an abstraction for acessing the collection.
		//a possibly passed prefix will be removed from the begin of the string, otherwise the string is used directly for getting the model.
		//Gets id, cid (anything that goes into collection.get)
		var idString = "";

		if (prefix) {
			idString = id.slice(prefix.length);
		} else {
			idString = id;
		}

		var requestedModel = app.viewportView.model.get("mockups").findWhere({
			"id": idString
		});
		return requestedModel;
	},
	destroyModel: function () {
		this.model.destroy();
	}
});
