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
		for (var i = 0; i < value.data.documents.length; i++) {
			// convert b64string into JSON string, then parse into JSON object
			var b64string = value.data.documents[i].document;
			var buf = new Buffer(b64string, 'base64');
			var childObject = JSON.parse(buf.toString('ascii'));

			console.log(childObject);
			console.log(value.data.documents[i].document_id)


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
														time1, time2, time3, timestamp	);
				var fitbitDoc = Builder.vendDocument( globals.fitbitSchemaId, vaultid, newFitbit );
				truevault.documents.create(fitbitDoc, function (err, value) {
					if (err) {
						console.log("Error creating fitbit doc");
						console.log(err);
					}
					else
						console.log("Fitbit Doc " + value.document_id + " created");
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
		console.log(value.data.documents);
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

		for (var i = 0; i < document.data.items.length; i++) {
			console.log("Deleting document: " + document.data.items[i].id)
			truevault.documents.del({
			   'vault_id' : vaultid,
			   'id' : document.data.items[i].id
			}, function (err, document){
				if (err)
					console.log("Error deleting document");
				else
					console.log("Document deleted");
			});
		}
	});

	truevault.schemas.list({ "vault_id":vaultid }, function (err, document){
		for (var i = 0; i < document.schemas.length; i++) {
			console.log("Deleting schema: " + document.schemas[i].id)
			truevault.schemas.del({
			   'vault_id' : vaultid,
			   'id' : document.schemas[i].id
			}, function (err, document){
				if (err)
					console.log("Error deleting schema");
				else
					console.log("Schema deleted");
			});
		}
	})
}


module.exports = Debug; 