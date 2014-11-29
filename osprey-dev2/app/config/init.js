var UserSchema = require('../schemas/user.js'); 
var User = new UserSchema(); 
var ChildSchema = require('../schemas/child.js'); 
var Child = new ChildSchema(); 

// set this to the number of schemas listed above ^
var numSchemas = 2; 
// checks for user schemas and email schemas to be present in the vault upon initialization
exports.initialize = function(globals, apikey, vaultid) {

	var truevault = require('../../truevault/lib/truevault.js')(apikey);

	truevault.schemas.list({"vault_id":vaultid}, function(err, value) {
		if (err)
			console.log("initialize error:");
		else {
			var newOptions, schema; 
			var foundUser = false;
			var foundChild = false;

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

			// edit this method when schemas are added/removed
			var setSchemaId = function( name, id ) {
				if ( name === "user" ) {
					globals.userSchemaId = id;  
				}
				else if ( name === "child" ) {
					globals.childSchemaId = id; 
				}					
				else {
					console.log ("Unrecognized schema type!");
					console.log( id ); 
				}
			}

			// extend for additional schemas here
			globals.userSchemaId = lookForMySchema("user"); 
			globals.childSchemaId = lookForMySchema("child");
			
			// set booleans
			foundUser = !!globals.userSchemaId; 
			foundChild = !!globals.childSchemaId;
		
			
			if ( !foundUser ) {
				createNewSchema({
					"vault_id":vaultid,
					"schema":User.createSchema()
					}, function (schemaID) {
						setSchemaId( "user", schemaID ); 
				});
			}
			else
				console.log("User schema loaded: " + globals.userSchemaId);	
					
				
			if ( !foundChild ) {
				createNewSchema({
					"vault_id":vaultid,
					"schema":Child.createSchema()
					}, function (schemaID) {
						setSchemaId( "child", schemaID ); 
				});
			}
			else
				console.log("Child Schema loaded: " + globals.childSchemaId); 	
								  
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



