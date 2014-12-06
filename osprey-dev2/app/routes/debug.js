'use strict'
// All functions used for debugging purposes should be included here


var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};

var truevaultBuilder = require('../schemas/truevaultBuilder'); 
var Builder = new truevaultBuilder();
var FitbitSchema = require('../schemas/fitbit'); 
var Fitbit = new FitbitSchema(); 

// set this to our domain for security 
var host = 'localhost:8080'; 

function Debug(_globals, _api_key, _vaultid) {
	globals = _globals;
	api_key = _api_key;
	vaultid = _vaultid;
	truevault = require('../../truevault/lib/truevault.js')(api_key);
}

// creates 31 fitbit documents for each child found in the database
Debug.prototype.generateFitbit = function(req, res) {
	var allChildrenFilterAttributes = Builder.vendFilterAttributes("wildcard", "*");
	var allChildrenFilter = Builder.vendFilter 	(globals.childSchemaId, vaultid, 
												{"parentId":allChildrenFilterAttributes}, true);

	truevault.documents.search(allChildrenFilter, function(err, value) {
		var docsAdded = 0;
		for (var i = 0; i < value.data.documents.length; i++) {
			// convert b64string into JSON string, then parse into JSON object
			var b64string = value.data.documents[i].document;
			var buf = new Buffer(b64string, 'base64');
			var childObject = JSON.parse(buf.toString('ascii'));

			console.log(childObject);
			console.log(value.data.documents[i].document_id)
			var endVal = 31 * value.data.documents.length;

			for (var j = 1; j < 32; j++) {
				var time1 = Math.random() * 24;
				var time2 = (24 - time1) * Math.random();
				var time3 = 24 - time1 - time2;
				var timestamp = "2014-01-";
				if (j < 10)
					timestamp += "0";
				timestamp += j;
				var calories = 500 * Math.random();

				var newFitbit = Fitbit.createFitbit(	value.data.documents[i].document_id,
														time1, time2, time3, timestamp, calories	);
				var fitbitDoc = Builder.vendDocument( globals.fitbitSchemaId, vaultid, newFitbit );
				truevault.documents.create(fitbitDoc, function (err, value) {
					if (err) {
						console.log("Error creating fitbit doc");
						console.log(err);
					}
					else {
						docsAdded++;
						console.log("Fitbit Doc " + value.document_id + " created " + docsAdded);
						
						if(docsAdded == endVal) {
							console.log("Ending");
							res.status.send(200);
						}
					}
				});
			}
		}
	});
}

// Deletes all fitbit documents from the vault
Debug.prototype.clearFitbit = function(req, res) {
	var allFitbitFilterAttributes = Builder.vendFilterAttributes("wildcard", "*");
	var allFitbitFilter = Builder.vendFilter 	(globals.fitbitSchemaId, vaultid, 
												{"childID":allFitbitFilterAttributes}, true);

	truevault.documents.search(allFitbitFilter, function(err, value) {
		for (var i = 0; i < value.data.documents.length; i++) {
			console.log("Deleting document: " + value.data.documents[i].document_id)
			truevault.documents.del({
			   'vault_id' : vaultid,
			   'id' : value.data.documents[i].document_id
			}, function (err, document){
				if (err)
					console.log("Error deleting document");
				else
					console.log("Document deleted");
			});
		}
	});
}

// Deletes ALL documents and schema from the vault - users, fitbit, children, invite codes
Debug.prototype.clearVault = function(req, res) {
	truevault.documents.list({
	 	'vault_id':vaultid,
	  	'per_page':50, 
	  	'page':1, 
	  	'full_document': false //true to return full documents vs uuids
	}, function (err, document){
		if (err)
			console.log(err);

		var docTracker = {"docsDeleted":0, "totalDocs": document.data.items.length};
		if (docTracker.docsDeleted == docTracker.totalDocs) {
			clearSchemas(req, res);
		} 

		for (var i = 0; i < document.data.items.length; i++) {
			// console.log("Deleting document: " + document.data.items[i].id)
			truevault.documents.del({
			   'vault_id' : vaultid,
			   'id' : document.data.items[i].id
			}, function (err, document){
				if (err) {
					console.log(err);
					console.log("Error deleting document");
				}
				else {
					// console.log("Document deleted");
					docTracker.docsDeleted++;
					if (docTracker.docsDeleted == docTracker.totalDocs) {
						clearSchemas(req, res);
					}
				}
			});
		}
	});	
}

var clearSchemas = function(req, res) {
	truevault.schemas.list({ "vault_id":vaultid }, function (err, document){
		var schemaTracker = {"schDeleted":0, "totalSch": document.schemas.length};
		if (schemaTracker.schDeleted == schemaTracker.totalSch) {
			res.status(200).end();
		}
		for (var i = 0; i < document.schemas.length; i++) {
			// console.log("Deleting schema: " + document.schemas[i].id)
			truevault.schemas.del({
			   'vault_id' : vaultid,
			   'id' : document.schemas[i].id
			}, function (err, document){
				if (err) {
					console.log(err);
				}
				else {
					schemaTracker.schDeleted++;
					if (schemaTracker.schDeleted == schemaTracker.totalSch) {
						res.status(200).end();
					}
					// console.log("Schema deleted");
				}
			});
		}
	})
}


Debug.prototype.deleteTestUser = function(req, res) {
	truevault.users.list(function (err, value) {
		if (err) {
			console.log("Error retrieving users");
			res.status(500).end();
			return;
		}
		var usersDeleted = 0;
		for (var i = 0; i < value.users.length; i++) {
			if (value.users[i].username == 'ospreytestphysician@gmail.com' || 
				value.users[i].username == 'ospreytestparent@gmail.com' ||
				value.users[i].username == 'ospreytestparent2@gmail.com') {
				truevault.users.delete({user_id: value.users[i].user_id}, function(err, value) {
					if (err) {
						console.log("Error deleting user");
						res.status(500).end();
						return;
					}

					usersDeleted++;
					if (usersDeleted == 3)
						res.status(200).end();
				});
			}
		}
	});
}

Debug.prototype.clearUser = function( req, res ) {
	var filterAttributes = Builder.vendFilterAttributes( "eq", req.body.email ); 
	var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"username":filterAttributes}, true );

	var deleteCallback = function( err, value ) {
		if ( err ) {
			console.log( err ); 
			res.status(500).send({"message":err}); 
		}
		else {
			console.log( value ); 
			res.status(200).send({"message":"successfully deleted account"});
		}

	}

	var searchCallback = function( err, value ) {
		if( err ) {
			console.log( err ); 
			res.status(500).send({"message":err})
		}
		else {
			if( value.data.info.total_result_count === 0 )
				res.status(401).send({"message":"No account with this email"}); 

			var b64string = value.data.documents[0].document;
			var buf = new Buffer(b64string, 'base64');
			var user = JSON.parse(buf.toString('ascii'));
			var options = {"user_id":user.user_id}; 

			for (var i = 0; i < value.data.documents.length; ++i) {
				console.log("Deleting document "+i+" : " + value.data.documents[i].document_id)
				truevault.documents.del({
				   'vault_id' : vaultid,
				   'id' : value.data.documents[i].document_id
				}, function (err, document){
					if (err) {
						console.log("Error deleting document " + i);
						console.log( err ); 
						res.status(500).send({"message":"An error occurred while deleting the account."});
					}
					else
						console.log("Document deleted");
				});
			}

			truevault.users.delete( options, deleteCallback );
		}
	}

	truevault.documents.search( filter, searchCallback); 
}

module.exports = Debug; 