'use strict'

var _ = require("underscore");
var $ = require("jquery");
var Backbone = require("backbone");
var Layoutmanager = require("backboneLayoutmanager");

var AppView = require("./views/AppView");
var ProjectModel = require("./models/relationalModel-Project");

Layoutmanager.configure({
	// Put options here.
	manage:true
});

window.app = {}
window.app.eventBus = _.extend({}, Backbone.Events);

$(function() {
  //so we broker events on the app object
	//_.extend(app, Backbone.Events);
	
	var appView = new AppView({
		model:new ProjectModel()
	})
	
	appView.render();

	/*if(typeof process  !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined'){
		require("forElectron/electron_appIntegration")();
	}*/
	app.config={
		
	}
});


