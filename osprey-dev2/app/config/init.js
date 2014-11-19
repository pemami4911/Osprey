var truevault = require('../../truevault/lib/truevault.js')('6e27a879-fc15-4c80-8165-c84b5579abb9');
var vaultid = '7b55edbd-a907-4569-947c-726c215c0eee'; //osprey_dev vault

// checks for user schemas and email schemas to be present in the vault upon initialization
exports.initialize = function(globals) {

	var options = {
		"vault_id" : vaultid
	};

	truevault.schemas.list(options, function(err, value) {
		if (err){
			console.log("initialize error:");
		} else {

			var newOptions, schema; 
			var foundUser = false;
			var foundChild = false;
			var foundEmailLog = false;
			var foundEmailConfirmation = false;

			// define utility functions here
			var lookForMySchema = function( mySchema ) {
				for (var i = 0; i < value.schemas.length; i++)
					if (value.schemas[i].name === mySchema )
						return value.schemas[i].id;				
			}

			var createNewSchema = function( newOptions, callback ) {
				truevault.schemas.create (newOptions, function (err, value){
					if (err)
						console.log(err);
					else {
						console.log( newOptions.schema.name + " schema created: " + value.schema.id);
						callback(value.schema.id);
					}
				});
			}

			// extend for additional schemas here
			globals.userSchemaId = lookForMySchema("user"); 
			globals.childSchemaId = lookForMySchema("child");
			globals.emailLogSchemaId = lookForMySchema("emailLog"); 
			globals.emailConfirmationId = lookForMySchema("emailConfirmation"); 

			// set booleans
			foundUser = !!globals.userSchemaId; 
			foundChild = !!globals.childSchemaId;
			foundEmailLog = !!globals.emailLogSchemaId; 
			foundEmailConfirmation = !!globals.emailConfirmationId; 

			if (!foundUser) {
				var schema = {
				   "name": "user",
				   "fields": [
				   	  {
				   	  	 "name": "user_id",
				   	  	 "index": true,
				   	  	 "type": "string"
				   	  },
				      {
				         "name": "firstName",
				         "index": true,
				         "type": "string"
				      },
				      {
				         "name": "lastName",
				         "index": true,
				         "type": "string"

				      },
				      {
				         "name": "midInit",
				         "index": false,
				         "type": "string"
				      },
				      {
				         "name": "userType",
				         "index": true,
				         "type": "string"
				      }
				   ]
				};
				createNewSchema({
						"vault_id" : vaultid,
						"schema" : schema
					}, function(value) {
						globals.userSchemaId = value
					}
				);

			} else {
				console.log("User schema loaded: " + globals.userSchemaId);
			}

			if (!foundEmailLog) {
				var schema = {
				   "name": "emailLog",
				   "fields": [
				      {
				         "name": "timestamp",
				         "index": false,
				         "type": "date"
				      },
				      {
				         "name": "data",
				         "index": true,
				         "type": "string"

				      }
				   ]
				};
				
				createNewSchema(
					{
						"vault_id" : vaultid,
						"schema" : schema
					}, function(value) {
						globals.emailLogSchemaId = value
					}
				);

			} else {
				console.log("Email Log schema loaded: "+ globals.emailLogSchemaId);
			}
			
			if( !foundEmailConfirmation ) {	

				var schema = {
					"name" : "emailConfirmation",
					"fields" : [
						{
							"name": "email", 
							"index": true,
							"type": "string"
						},
						{
							"name": "token",
							"index": true,
							"type": "string"
						},
						{
							"name": "isConfirmed",
							"index": false,
							"type": "boolean"
						}

					]
				};
				createNewSchema(
				 	{
						"vault_id" : vaultid,
						"schema" : schema
					}, function(value) {
						globals.emailConfirmationId = value
					}
				); 
			}
			else {
				console.log("Email Confirmation Schema loaded: " + globals.emailConfirmationId); 
			}

			if( !foundChild ) {	

				var schema = {
					"name" : "child",
					"fields" : [
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
				};
				createNewSchema(
				 	{
						"vault_id" : vaultid,
						"schema" : schema
					}, function(value) {
						globals.childSchemaId = value
					}
				); 
			}
			else {
				console.log("Child Schema loaded: " + globals.childSchemaId); 
			}
		}
	});

	truevault.users.list(function(err, value) {
		if (err)
			console.log(err);
		else {
			globals.accountId = value.users[0].account_id;
			console.log("AccountID: " + globals.accountId);
		}
	})
}



