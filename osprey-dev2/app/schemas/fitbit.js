function fitbitSchema() {}

fitbitSchema.prototype.createSchema = function() {
	return fitbit = {
		"name" : "fitbit",
		"fields" : [
			{
		   	  	"name": "childID", // id of child
		   	  	"index": true,
		   	  	"type": "string"
		   	},
		   	{	
		   		"name": "timeActiveStrenuous",
		   	  	"index": false,
		   	  	"type": "float"
		   	},
			{
				"name": "timeActiveNotStrenuous", 
				"index": false,
				"type": "float"
			},
			{
				"name": "timeSedentary", 
				"index": false,
				"type": "float"
			},
			{
				"name": "timestamp", 
				"index": true,
				"type": "date"
			},
			{
				"name": "caloriesBurned",
				"index": false,
				"type": "integer"
			}
		]
	}
}

fitbitSchema.prototype.createFitbit = function( id, timeStren, timeNotStren, timeSedentary, timestamp, calories) {
	return fitbit = {
		"childID":id,
		"timeActiveStrenuous":timeStren,
		"timeActiveNotStrenuous":timeNotStren,
		"timeSedentary":timeSedentary,
		"timestamp":timestamp,
		"calories":calories
	}
}

module.exports = fitbitSchema; 