var truevault = require('../../truevault/lib/truevault.js')('6e27a879-fc15-4c80-8165-c84b5579abb9');
var vaultid = '7444ece4-5266-49ad-a8c8-453af7ebf2e2'; //osprey_dev vault

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
			var foundEmailLog = false;
			var foundEmailConfirmation = false;

			// define utility functions here
			var lookForMySchema = function( mySchema ) {
				for (var i = 0; i < value.schemas.length; i++)
					if (value.schemas[i].name === mySchema )
						return value.schemas[i].id;				
			}

			var createNewSchema = function( newOptions ) {
				truevault.schemas.create (newOptions, function (err, value){
					if (err)
						console.log(err);
					else {
						console.log( newOptions.schema.name + " schema created");
						return value.schema.id;
					}
				});
			}

			// extend for additional schemas here
			globals.userSchemaId = lookForMySchema("user"); 
			globals.emailLogSchemaId = lookForMySchema("emailLog"); 
			globals.emailConfirmationId = lookForMySchema("emailConfirmation"); 

			// set booleans
			foundUser = !!globals.userSchemaId; 
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
				globals.userSchemaId = createNewSchema({
						"vault_id" : vaultid,
						"schema" : schema
					}
				);

			} else {
				console.log("User schema loaded");
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
				
				globals.emailLogSchemaId = createNewSchema(
					{
						"vault_id" : vaultid,
						"schema" : schema
					}
				);

			} else {
				console.log("Email Log schema loaded");
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
				globals.emailConfirmationId = createNewSchema(
				 	{
						"vault_id" : vaultid,
						"schema" : schema
					}
				); 
			}
			else {
				console.log("Email Confirmation Schema loaded"); 
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



