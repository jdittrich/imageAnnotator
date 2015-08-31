var _ = require("underscore");
var $ = require("jquery");
var Backbone = require("backbone");
var BackboneRelational = require("backbone-relational");

var Image = require("./relationalModel-Image");

var Project = Backbone.RelationalModel.extend({
	relations: [{
		type: Backbone.HasMany,
		key: 'images',
		relatedModel: Image, //was app.Mockup
		reverseRelation: {
			key: 'project'
		}
	}],
});

module.exports = Project;
