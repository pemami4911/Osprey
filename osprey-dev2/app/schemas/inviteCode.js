function inviteCodeSchema() {}

inviteCodeSchema.prototype.createSchema = function() {
	return inviteCode = {
		"name" : "inviteCode",
		"fields" : [
			{
		   	  	"name": "physicianID", //user id of physician
		   	  	"index": true,
		   	  	"type": "string"
		   	},
		   	{	
		   		"name": "parentEmail",
		   	  	"index": true,
		   	  	"type": "string"
		   	},
			{
				"name": "token", 
				"index": true,
				"type": "string"
			}
		]
	}
}

inviteCodeSchema.prototype.createInviteCode = function( id, email, inviteCode) {
	return inviteCode = {
		"physicianID":id,
		"parentEmail":email,
		"token":inviteCode
	}
}

module.exports = inviteCodeSchema; 