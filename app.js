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

$(function() {
  //so we broker events on the app object
	//_.extend(app, Backbone.Events);
	
	var appView = new AppView({
		model:new ProjectModel()
	})
	
	/*if(typeof process  !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined'){
		require("forElectron/electron_appIntegration")();
	}*/

	app.config={
		
	}
});


