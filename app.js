var app = app || {};

Backbone.Layout.configure({
	// Put options here.
	manage:true
});

$(function() {
	_.extend(app, Backbone.Events);
	
	app.project= new app.Project(); //outsource this to a "populate" or "setup Data" function
	
	
	app.appView = new app.AppView().render();
	
	_.extend(app, Backbone.Events);
	
	app.config={
		
	}
});

