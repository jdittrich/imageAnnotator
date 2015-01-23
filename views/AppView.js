//must initialize:
//basic dom structure
//thatsit.

var app = app || {};

app.AppView = Backbone.View.extend({
//dunno exactly the difference here between Backbone.Layout.extend and Backbone.Layout. The latter needs a direct "new" and can’t be initialized several times (probably). UPDATE: see: https://github.com/tbranyen/backbone.layoutmanager/wiki/Configuration
	el:"#app",
	template:_.template('<div id="imageList"></div><div id="imageMainView"></div>'), //a function returning a string should do it.
	initialize:function(){
		this.listenTo(app, "imageListSelection", this.displayMockupView);
	},
	beforeRender:function(view){
		//app.viewportView = this.insertView("",new app.ViewportView());
		app.imageListView = this.setView("#imageList",new app.ImageListView({model:app.project}));//List displays all Mockups
	},
	displayMockupView:function(model){
		tst = this.setView("#imageMainView", new app.ImageMainView({model:model})).render()
	}
	
})
