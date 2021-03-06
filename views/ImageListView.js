var _ = require("underscore");
$ = jQuery = require("jquery");
var Backbone = require("backbone");

var ImageListItemView = require("./ImageListItemView")

var ImageListView = Backbone.View.extend({
	model:null,//not a native property, but makes sense here. Will be set.
	el:false, //makes the outer element of your template the el
	template:_.template('<div><input class="newMockup" type="file"\>NewStuff!</input><ul id="mockupList"></ul></div>'),
	events: {
		// 'click button.newMockup': 'newMockupModel',
		'change input.newMockup':'newMockupModel'
	},
	initialize:function(){
		//this needs to be adjusted according to the environment: Browser or nw.js/electron. Both use the input type=file element; The access to the image content is different though.
		//for now we use just the name of the file and assume/demand that it is located aside (or, with some adjustments in the model, below) the index.html!
		this.listenTo(this.model.get("images"),"add",this.displayNewListItem)
	},
	beforeRender:function(view){
		//alle Bilder Rendern als Liste
		var that = this;
		_.each(that.model.get("images"),function(element,index,list) {
			that.insertView("",new ImageListItemView({model:element}));//adapt this!
		}, that);
	},
	afterRender:function(){
		//this.$el.draggable({revert:true});
	},
	displayNewListItem:function(mockupModel){
		var newView = this.insertView("#mockupList",new ImageListItemView({model:mockupModel}));
		// this.renderViews();
		newView.render(); //try this
	},
	newMockupModel:function(event){
		var filename = $(event.target).val().replace(/.*(\/|\\)/, '');
		if(filename.length>0){ //prevent against empty values
			this.model.get("images").add({filename:filename});
		}
	}
});

module.exports = ImageListView;
