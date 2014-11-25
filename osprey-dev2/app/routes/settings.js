'use strict'

var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};

var nodemailer = require('nodemailer');
var EmailLogModel = require('../models/emaillog');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospreytester@gmail.com',
        pass: 'mypasstest1'
    }
});

function Settings(_globals, _api_key, _vaultid) {
	globals = _globals;
	api_key = _api_key;
	vaultid = _vaultid;
	truevault = require('../../truevault/lib/truevault.js')(api_key);
}

Settings.prototype.changeTableSettings = function(req, res) {
	var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);

	temp.auth.verify(function(err, value){
		if (err) 
			res.status(500).send({"message": "User verification error"});
		else {
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
				if (err2)
					res.status(500).send({"message":"TrueVault API"}); 
				else {
					if (value2.data.documents.length == 0)
						res.status(401).send( {"message":"no matching user document found"} );
					else {
						truevault.documents.retrieve({
						   'vault_id' : vaultid,
						   'id' : value2.data.documents[0].document_id
						}, function (err, document) {

							document.phyShowEmail = req.body.newSettings.email;
							document.phyShowAge = req.body.newSettings.age;
							document.phyShowWeight = req.body.newSettings.weight;

							truevault.documents.update({
								'vault_id' : vaultid,
						  		'id' : value2.data.documents[0].document_id,
						  		'document' : document
							}, function ( err, value ) {
								if( err )
									res.status(500).send({"message":"An internal server error occurred. Sad tiger!"}); 
								res.status(200).end(); 
							});
						});
					}
				}
			});
		}
	});
}

Settings.prototype.changeEmail = function(req, res) {
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
}

Settings.prototype.changePassword = function(req, res) {
	
	// 	UserModel.findOne({ email : req.body.user.email }, function(err, user) {
	// 		if(err) res.send(err); 
	// 		else { 
	// 			if( !user )	res.send("err1"); // should never get thrown - if loggedUser was not found in database
	// 			else {
	// 				if ( !user.validPassword(req.body.currentPassword) ) res.send("err2"); // validate passed password
	// 				else {
	// 						// use mongoose to get all todos in the database
	// 					UserModel.update({email: req.body.user.email}, {password: UserModel.generateHash(req.body.newPassword)}, {}, function(err, result) {
	// 						if (err) {
	// 							console.log("error" + err);
	// 							res.send(err);
	// 						}
	// 						sendEmail(req.body.user.email, "Password changed!", "You have changed your password!");
	// 						res.json(result);
	// 					});
	// 				}
	// 			}
	// 		}
	// 	}); 
}

Settings.prototype.generateInvite = function( req, res ) {
	// create an invite code 
	
}

module.exports = Settings; 