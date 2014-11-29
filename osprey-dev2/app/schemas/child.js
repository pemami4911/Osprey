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

childSchema.prototype.createChild = function( id, name, birthday, gender) {
	return child = {
		"parentId":id,
		"name":name,
		"birthday":birthday,
		"gender":gender
	}
}

module.exports = childSchema; 