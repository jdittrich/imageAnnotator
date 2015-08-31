'use strict'

var _ = require("underscore");
var $  = require("jquery");
var Backbone = require("backbone");

var Layoutmanager = require("backboneLayoutmanager");

var ImageListView = require("./ImageListView");
var ImageMainView = require("./ImageMainView");
var fileButtonToolbar = require("../forElectron/electron_appIntegration");

var url = document.URL;

var AppView = Backbone.View.extend({
//dunno exactly the difference here between Backbone.Layout.extend and Backbone.Layout. The latter needs a direct "new" and can’t be initialized several times (probably). UPDATE: see: https://github.com/tbranyen/backbone.layoutmanager/wiki/Configuration –"Useful for when you want options to exist for all instances created on a specific View. Backbone.Layout.extend({ // Put options here..."
	el:"#app",
	model:null,
	template:_.template('<div id="appToolbar"></div><div id="imageList"></div><div id="MainView"></div>'),
	initialize:function(){
		this.listenTo(app.eventBus, "imageListSelection", this.displayMockupView); //so the app’s main view can change if another image is selected to be displayed
	},
	beforeRender:function(view){
		//app.viewportView = this.insertView("",new app.ViewportView());
		this.setView("#imageList",new ImageListView({model:this.model}));//List displays all Mockups

		var toolbarview = fileButtonToolbar(this.model);
		this.setView("#appToolbar", toolbarview);


	},
	displayMockupView:function(model){
		this.setView("#MainView", new ImageMainView({model:model})).render() //TODO: called by whom?
	}
});

module.exports = AppView;
