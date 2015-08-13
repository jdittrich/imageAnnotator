var app = app || {};

//todo: custom ID function to central place (repeats itself)
//todo: make model definitions accessible via app.attibute

app.Project = Backbone.RelationalModel.extend({
	relations: [{
		type: Backbone.HasMany,
		key: 'mockups',
		relatedModel: 'app.Mockup',
		reverseRelation: {
			key: 'project'
		}
	}],
});

app.Mockup = Backbone.RelationalModel.extend({
	relations: [{
		type: Backbone.HasMany,
		key: 'linkSources',
		relatedModel: 'app.LinkSource',
		reverseRelation: {
			key: 'myMockup'
		}
	}],
	defaults:function(){
		return{
			image: '',
			title: 'No title',
			id:('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			})),
		};
	}
});

app.LinkSource = Backbone.RelationalModel.extend({
//TODO: in is enough if this is simply hierarchial for now. We could have many Link Sources to many other Link Sources too though
	/*relations: [{
		type: Backbone.HasOne,
		key: 'annotation',
		relatedModel: 'app.Mockup',
		reverseRelation: {
			key: 'incoming',
			type: Backbone.HasMany
		}
	}],*/
	defaults:function() {
		return{
		left:0,
		top:0,
		width:100,
		height:100,
		id:'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			})
		}
	}
});


/*app.LinkSource = Backbone.RelationalModel.extend({
	relations: [{
		type: Backbone.HasOne,
		key: 'target',
		relatedModel: 'app.Mockup',
		reverseRelation: {
			key: 'incoming',
			type: Backbone.HasMany
		}
	}],
	defaults:function() {
		return{
		left:0,
		top:0,
		width:100,
		height:100,
		id:'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
			})
		}
	}
});*/
