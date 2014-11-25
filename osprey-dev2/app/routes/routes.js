'use strict';

//var passport = require('passport');
var UserModel = require('../models/user');
var EmailLogModel = require('../models/emaillog');

var path = require('path');
var fs = require('fs');
var css = require('css');

var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
var vaultid = 'b51db608-3321-41dd-9531-bfc40c1f5c27'; //nick-dev

var config = require('../config/init'); 
var truevault = require('../../truevault/lib/truevault.js')(api_key);

// set this to our domain for security 
var host = 'localhost:8080'; 

// global variables used to store uuids of schemas
// default value of 0
var globals = {
	userSchemaId: 0,
	childSchemaId: 0,
	settingsSchemaId: 0,
	emailLogSchemaId: 0,
	emailConfirmationId: 0,
	inviteCodeId: 0,
	accountId: 0			// stores account id
};

var AuthModule = require('./auth');
var Auth = new AuthModule(globals, api_key, vaultid);
var SettingsModule = require('./settings'); 
var Settings = new SettingsModule(globals, api_key, vaultid); 

// -----------------------------------------------------------------------------

config.initialize(globals, api_key, vaultid);

// -----------------------------------------------------------------------------

module.exports = function(app) {

	// used to test new functionality
	app.post('/debug/test', function(req, res, next) {
		// console.log(globals);
		clearVault();
	});
	app.post('/auth/login', function(req, res, next) {
		Auth.login(req, res);						
	});
	app.post('/auth/register', function(req, res, next) {
		Auth.register(req, res);
	});
	app.get('/verify',function(req,res){
		Auth.verify(req, res);
	});
	app.post('/auth/checkReg', function(req, res) {
		Auth.checkReg(req, res);
	});
	app.get('/auth/logout', function(req, res) {
		Auth.logout(req, res);
	});
	app.post('/auth/isLogged', function(req, res) {	
		Auth.isLogged(req, res);
	});

	app.post('/settings/changeTableSettings', function( req, res) {
		Settings.changeTableSettings( req, res ); 
	}); 

	app.post('/settings/generateInvite', function( req, res) {
		Settings.generateInvite( req, res ); 
	}); 

	app.post('/settings/changeEmail', function( req, res ) {
		Settings.changeEmail( req, res ); 
	});

	app.post('/settings/changePassword', function( req, res) {
		Settings.changePassword( req, res ); 
	});

	app.get('/users/unassignedParents', function(req, res) {
	// 	if (!req.isAuthenticated())
	// 		res.send(false);
		
	// 	UserModel.find({ $and: [{userType : "Parent"}, {physician: null}] }, function(err, data) {
	// 		console.log(data);
	// 		res.send(data);
	// 	});
	 });

	app.post('/users/childrenOfParent', function(req, res) {
		var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);
		temp.auth.verify(function(err, value){
			console.log("verified");
			if (err) {
				console.log("verification error");
				res.send(false);
			} else {
				// find user attributes
				var options = {
					'vault_id' : vaultid,
					'schema_id' : globals.childSchemaId,
				  	'filter' : { 
				  		'parentId': {
					    	"type": "eq",
					    	"value": req.body.parentId
					    }
					},
					'full_document' : true
				};
				truevault.documents.search(options, function (err2, value2) {
					if (err) {
						console.log('search error');
						res.send(err2);
					}
					else {
						if (value2.data.documents.length == 0)
							console.log("no matching child documents found");
						else {
							var retObject = {"content":[]};
							for (var i = 0; i < value2.data.documents.length; i++) {
								addChild(res, retObject, value2.data.documents.length, value2.data.documents[i].document_id);
							}
						}
					}
				});
			}
		});
	});

	// helper function for /users/childrenOfParent
	// adds children to an array, sends if all children have been found and added to array
	var addChild = function(res, retObject, numChildren, childId) {
		truevault.documents.retrieve({
		   'vault_id' : vaultid,
		   'id' : childId
		}, function (err, document){
			retObject.content.push(document);
			if (retObject.content.length == numChildren) {
				console.log(retObject);
				res.json(retObject);
			}
		});
	}

	app.post('/users/childrenOfPhysician', function(req, res) {
		var temp = require('../truevault/lib/truevault.js')(req.session.access_token);
		temp.auth.verify(function(err, value){
			console.log("verified");
			if (err) {
				console.log("verification error");
				res.send(false);
			} else {
				// find user attributes
				var options = {
					'vault_id' : vaultid,
					'schema_id' : globals.childSchemaId,
				  	'filter' : { 
				  		'parentId': {
					    	"type": "eq",
					    	"value": req.body.parentId
					    }
					},
					'full_document' : true
				};
			}
		});
	});

	app.get('/nvd3css', function(req, res){
		// if (!req.isAuthenticated())
		// 	res.send(false);
		fs.readFile(path.resolve('./public/lib/d3/nv.d3.css'), 'utf8', function(err, data){
			var obj = css.parse(data);
			res.send(obj.stylesheet.rules);
		});
	});
	
	
};

function clearVault() {
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
