/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
'use strict';
var UserSchema = require('../schemas/user'); 
var User = new UserSchema(); 
var ChildSchema = require('../schemas/child'); 
var Child = new ChildSchema(); 
var InviteCodeSchema = require('../schemas/inviteCode'); 
var InviteCode = new InviteCodeSchema(); 
var FitbitSchema = require('../schemas/fitbit'); 
var Fitbit = new FitbitSchema(); 

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
			var foundInviteCode = false; 
			var foundFitbit = false;

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
				else if ( name === "inviteCode" ) {
					globals.inviteCodeSchemaId = id; 
				}
				else if ( name === "fitbit" ) {
					globals.fitbitSchemaId = id; 
				}
				else {
					console.log ("Unrecognized schema type!");
					console.log( id ); 
				}
			}

			// extend for additional schemas here
			globals.userSchemaId = lookForMySchema("user"); 
			globals.childSchemaId = lookForMySchema("child");
			globals.inviteCodeSchemaId = lookForMySchema("inviteCode");
			globals.fitbitSchemaId = lookForMySchema("fitbit");
			
			// set booleans
			foundUser = !!globals.userSchemaId; 
			foundChild = !!globals.childSchemaId;
			foundInviteCode = !!globals.inviteCodeSchemaId; 
			foundFitbit = !!globals.fitbitSchemaId;
		
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

			if ( !foundInviteCode ) {
				createNewSchema({
					"vault_id":vaultid,
					"schema":InviteCode.createSchema() 
					}, function (schemaID) {
						setSchemaId( "inviteCode", schemaID ); 
				});
			}
			else
				console.log("Invite Code Schema loaded: " + globals.inviteCodeSchemaId);

			if ( !foundFitbit ) {
				createNewSchema({
					"vault_id":vaultid,
					"schema":Fitbit.createSchema() 
					}, function (schemaID) {
						setSchemaId( "fitbit", schemaID ); 
				});
			}
			else
				console.log("Fitbit Schema loaded: " + globals.fitbitSchemaId); 	
								  
		}
	});

	truevault.users.list(function(err, value) {
		if (err)
			console.log(err);
		else {
			globals.accountId = value.users[0].account_id;
			console.log("AccountID: " + globals.accountId);
			console.log("Vault ID: " + vaultid)
		}
	})
}



