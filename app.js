var app = app || {};

Backbone.Layout.configure({
	// Put options here.
	manage:true
});

$(function() {
  //so we broker events on the app object
	_.extend(app, Backbone.Events);

	app.project= new app.Project(); //outsource this to a "populate" or "setup Data" function
	
	app.appView = new app.AppView().render();
	
	if(typeof process  !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined'){
		require("forElectron/electron_appIntegration")();
	}
	app.config={
		
	}
});


