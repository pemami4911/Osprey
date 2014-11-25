'use strict';

var passport = require('passport');
var UserModel = require('./models/user');
var EmailLogModel = require('./models/emaillog');

var path = require('path');
var fs = require('fs');
var css = require('css');

var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
var vaultid = 'b51db608-3321-41dd-9531-bfc40c1f5c27'; //osprey_dev vault

var config = require('./config/init');
var truevault = require('../truevault/lib/truevault.js')(api_key);

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
	accountId: 0			// stores account id
};

var AuthModule = require('./auth');
var Auth = new AuthModule(globals, api_key, vaultid);

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
	app.post('/auth/changeEmail', function(req, res) {
		

		// UserModel.findOne({ email : req.body.currentEmail }, function(err, user) {
		// 	if(err) res.send(err); 
		// 	else { 
		// 		if( !user )	// if the email was not found, return null
		// 			res.send("err1"); 
		// 		else {
		// 			if ( !user.validPassword(req.body.password) ) // if the email is correct but the password is not, return false
		// 				res.send("err2"); 
		// 			else {
		// 				// use mongoose to get all todos in the database
		// 				UserModel.update({email: req.body.currentEmail}, {email: req.body.newEmail}, {}, function(err, result) {
		// 					if (err) {
		// 						console.log("error" + err);
		// 						res.send(err);
		// 					}
		// 					sendEmail(req.body.newEmail, "E-mail changed!", "You have changed your e-mail address!");
		// 					sendEmail(req.body.currentEmail, "E-mail changed!", "This is no longer the e-mail address registered with your Osprey account!"); 
		// 					res.json(result);
		// 				});
		// 			}
		// 		}
		// 	}
		// }); 	
	});

	app.post('/users/unassignedParents', function(req, res) {
		if (!req.isAuthenticated())
			res.send(false);
		
		UserModel.find({ $and: [{userType : "Parent"}, {physician: null}] }, function(err, data) {
			console.log(data);
			res.send(data);
		});
	});

	app.post('/users/childrenOfParent', function(req, res) {
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
	}

	

	app.post('/auth/changePassword', function(req, res) {
		UserModel.findOne({ email : req.body.user.email }, function(err, user) {
			if(err) res.send(err); 
			else { 
				if( !user )	res.send("err1"); // should never get thrown - if loggedUser was not found in database
				else {
					if ( !user.validPassword(req.body.currentPassword) ) res.send("err2"); // validate passed password
					else {
							// use mongoose to get all todos in the database
						UserModel.update({email: req.body.user.email}, {password: UserModel.generateHash(req.body.newPassword)}, {}, function(err, result) {
							if (err) {
								console.log("error" + err);
								res.send(err);
							}
							sendEmail(req.body.user.email, "Password changed!", "You have changed your password!");
							res.json(result);
						});
					}
				}
			}
		}); 
	});

	app.post('/settings/changeTableSettings', function(req, res) {
		var temp = require('../truevault/lib/truevault.js')(req.session.access_token);
		temp.auth.verify(function(err, value){
			if (err) {
				console.log("verification error");
				res.send(false);
			} else {
				// find user attributes
				var options = {
					'vault_id' : vaultid,
					'schema_id' : globals.userSchemaId,
				  	'filter' : { 
				  		'user_id': {
					    	"type": "eq",
					    	"value": value.user.user_id
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
							console.log("no matching user document found");
						else {
							truevault.documents.retrieve({
							   'vault_id' : vaultid,
							   'id' : value2.data.documents[0].document_id
							}, function (err, document){

								document.phyShowEmail = req.body.newSettings.email;
								document.phyShowAge = req.body.newSettings.age;
								document.phyShowWeight = req.body.newSettings.weight;
								truevault.documents.update({
									'vault_id' : vaultid,
							  		'id' : value2.data.documents[0].document_id,
							  		'document' : document
								}, function (err, value) {
									console.log("User updated");
									
									res.json(1);

								});
							});
						}
					}
				});
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

	var options = {
		"vault_id" : vaultid
	};

	truevault.schemas.list(options, function (err, document){
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
