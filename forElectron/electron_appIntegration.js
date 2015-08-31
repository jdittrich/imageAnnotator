var _ = require("underscore");
var $ = jQuery = require("jquery");
var Backbone = require("backbone");
var Layoutmanager = require("backboneLayoutmanager");

var FileOperationToolbar = null,
		mainModel = null, //the model to be saved to a file
		setupFileoperations = require('./electron_fileOperations'), //1st init it, then use
		fileoperations = null;

var setupFileIconsToolbar_Electron = function(model){
	if(!(model instanceof Backbone.Model)){
		throw new Error("passed model object to electron app integration is not a backbone model")
	}

	mainModel = model;

	fileoperations = setupFileoperations.init(
		function(contentToSet){ //set content
			mainModel.set(JSON.parse(contentToSet));
		},
		function(){
			return JSON.stringify(mainModel.toJSON());
		},
		document.URL
	)

	var fileOperationToolbar = new FileOperationToolbar()
	return fileOperationToolbar;
};


FileOperationToolbar = Backbone.View.extend({
	el:false, //makes the outer element of your template the el
	template:_.template('<div class="iconToolbar"><button class="file-newbutton">new</button> <button class="file-openbutton">Open</button><button class="file-savebutton">Save</button><button class="file-saveAsButton">Save As</button></div>'),
	events: {
		'click .file-newbutton': 'newbutton',
		'click .file-openbutton': 'openbutton',
		'click .file-savebutton': 'savebutton',
		'click .file-savebutton': 'saveAsButton'
	},
	initialize:function(){},
	serialize:function(){},
	beforeRender:function(){},
	afterRender:function(){},
	newbutton:function(){
		fileoperations.new()
	},
	openbutton:function(){
		fileoperations.open();
	},
	savebutton:function(){
		fileoperations.save();
	},
	saveAsButton:function(){
		fileoperations.saveAs();
	}
});



//set get
/*
generate string from relational model:
JSON.stringify(model.toJSON());

generate relational model from string:
model.set(JSON.parse(abovegenereatedstring));

*/
module.exports = setupFileIconsToolbar_Electron;
