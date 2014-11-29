function childSchema() {}

childSchema.prototype.createSchema = function() {
	return child = {
		"name" : "child",
		"fields" : [
			{
		   	  	"name": "parentId", //user id of parent
		   	  	"index": true,
		   	  	"type": "string"
		   	},
			{
				"name": "name", 
				"index": true,
				"type": "string"
			},
			{
				"name": "birthday",
				"index": true,
				"type": "date"
			},
			{
				"name": "gender",
				"index": false,
				"type": "string"
			}
		]
	}
}

childSchema.prototype.createChild = function( id, attributes, i ) {
	return child = {
		"parentId":id,
		"name":attributes.body.children[i].childName,
		"birthday":attributes.body.children[i].childBirthday,
		"gender":attributes.body.children[i].childGender
	}
}

module.exports = childSchema; 