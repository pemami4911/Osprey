'use strict';

var passport = require('passport');
var UserModel = require('./models/user');
var EmailLogModel = require('./models/emaillog');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var css = require('css');

var api_key = '6e27a879-fc15-4c80-8165-c84b5579abb9';
var vaultid = '8631f1d8-70bb-47dd-95c8-f4926772a00d'; //osprey_dev vault

var config = require('./config/init'); 
var truevault = require('../truevault/lib/truevault.js')(api_key);


// global variables used to store uuids of schemas
// default value of 0
var globals = {
	userSchemaId: 0,
	emailLogSchemaId: 0,
	emailConfirmationId: 0,
	accountId: 0			// stores account id
}


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospreytester@gmail.com',
        pass: 'mypasstest1'
    }
});

// -----------------------------------------------------------------------------

config.initialize(globals);

// -----------------------------------------------------------------------------

module.exports = function(app) {

	// used to test new functionality
	app.post('/debug/test', function(req, res, next) {
		console.log(globals.userSchemaId);
		console.log(globals.accountId);
	});

	// takes email and password in request body
	// returns true or false, sets session variable to access token
	app.post('/auth/login', function(req, res, next) {
		var options = {
			"username": req.body.email,
			'password': req.body.password, 
			'account_id': globals.accountId
		};
		truevault.auth.login(options, function(err, value) {
			if (err) {
				console.log("login failed");
				res.send(false);
			} else {
				console.log("login successful");
				req.session.access_token = value.user.access_token;
				res.send(true);
			}
		});
	});

	// takes username, password, user attributes in request body
	// returns true or false, sets session variable to access token
	app.post('/auth/register', function(req, res, next) {
		var options = {
			"username": req.body.email,
			"password": req.body.password,
		};

		truevault.users.create(options, function(err, value){
		    if (err) {
		    	console.log("registration error at user creation");
		    	res.send(false);
			}
		    else {
		    	var options2 = {
				    "schema_id": globals.userSchemaId,
				    "vault_id": vaultid,
					"document": {
						"user_id" : value.user.id,
						"userType": req.body.userType,
						"firstName": req.body.firstName,
						"midInit": req.body.mI,
						"lastName": req.body.lastName
					}
		    	};
		    	truevault.documents.create(options2, function(err2, value2) {
		    		if (err2) {
		    			console.log("registration error at document creation");
		    			res.send(false);
		    		}
		    		req.session.access_token = value.user.access_token;
		    		res.send(true);
		    	});
		    }
		});
	});

	// takes email in request body
	// returns 1 if that user is found in list of all users, 0 otherwise
	app.post('/auth/checkReg', function(req, res) {
		truevault.users.list(function(err, value){
		    if (err)
		    	res.send(err);
		    else {
		    	for (var i = 0; i < value.users.length; i++) {
		    		if (req.body.email == value.users[i].username) {
		    			res.json(1);
		    			console.log("sending 1");
		    		}
		    	}
		    	res.json(0);
		    	console.log("sending 0");
		    }
		});
	});

	// checks access token stored in session
	// attempts to logout, sends appropriate message 
	app.get('/auth/logout', function(req, res) {
		console.log(req.session.access_token);

		if (req.session.access_token != null) {
			var temp = require('../truevault/lib/truevault.js')(req.session.access_token);
			temp.auth.logout(function(err, value){
				if (err) {
					console.log("Logout failure: API");
					return res.send(500);
				} else {
					console.log("Logout success");
					req.session.access_token = null;	
					return res.send(200);
				}
			});
  		}
  		else {
  			console.log("Logout failure: token")
  			return res.send(500);
  		}
	});

	// checks access token stored in session 
	// returns false if verification fails, the user object if successful
	app.post('/auth/isLogged', function(req, res) {
		var temp = require('../truevault/lib/truevault.js')(req.session.access_token);

		temp.auth.verify(function(err, value){
			if (err) {
				console.log("verification error");
				res.send(false);
			} else {
				var options = {
					'vault_id' : vaultid,
					'schema_id' : globals.userSchemaId,
				  	'filter' : { 
				  		'user_id': {
					    	"type": "eq",
					    	"value": value.user.user_id
					    }
					}
				};
				console.log("===OPTIONS===");
				console.log(options);

				truevault.documents.search(options, function (err2, value2) {
					if (err) {
						console.log(err2);
						res.send(err2);
					}
					else {
						console.log("===VALUE===");
						console.log(value2);
						res.send(value2);
					}
				});

				// truevault.documents.list({
				//  	'vault_id':vaultid,
				//   	'per_page':50, 
				//   	'page':1, 
				//   	'full_document': false //true to return full documents vs uuids
				// }, function (err, document){
				// 	if (err)
				// 		console.log(err);

				// 	for (var i = 0; i < document.data.items.length; i++) {
				// 		truevault.documents.retrieve({
				// 		   'vault_id' : vaultid,
				// 		   'id' : document.data.items[i].id
				// 		}, function (err, document){
				// 			if (document.user_id == value.user.user_id) {
				// 				console.log("User found:");
				// 				document.email = value.user.username;
				// 				res.send(document);
				// 			}
				// 		});
				// 	}
				// });
			}
		});
	});

	app.post('/auth/changeEmail', function(req, res) {
		UserModel.findOne({ email : req.body.currentEmail }, function(err, user) {
			if(err) res.send(err); 
			else { 
				if( !user )	// if the email was not found, return null
					res.send("err1"); 
				else {
					if ( !user.validPassword(req.body.password) ) // if the email is correct but the password is not, return false
						res.send("err2"); 
					else {
						// use mongoose to get all todos in the database
						UserModel.update({email: req.body.currentEmail}, {email: req.body.newEmail}, {}, function(err, result) {
							if (err) {
								console.log("error" + err);
								res.send(err);
							}
							sendEmail(req.body.newEmail, "E-mail changed!", "You have changed your e-mail address!");
							sendEmail(req.body.currentEmail, "E-mail changed!", "This is no longer the e-mail address registered with your Osprey account!"); 
							res.json(result);
						});
					}
				}
			}
		}); 	
	});
	app.post('/users/unassignedParents', function(req, res) {
		if (!req.isAuthenticated())
			res.send(false);
		
		UserModel.find({ $and: [{userType : "Parent"}, {physician: null}] }, function(err, data) {
			console.log(data);
			res.send(data);
		});
	});

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
		if (!req.isAuthenticated())
			res.send(false);
		UserModel.update({email: req.body.user.email}, {
			$set: {'tableSettings.showEmail':req.body.newSettings.email, 
			'tableSettings.showAge':req.body.newSettings.age, 
			'tableSettings.showWeight':req.body.newSettings.weight}

			}, {}, function(err, result) {
				if (err) {
					console.log("error" + err);
					res.send(err);
				}

				res.json(result);
		});
	});

	app.get('/nvd3css', function(req, res){
		if (!req.isAuthenticated())
			res.send(false);
		fs.readFile(path.resolve('./public/lib/d3/nv.d3.css'), 'utf8', function(err, data){
			var obj = css.parse(data);
			res.send(obj.stylesheet.rules);
		});
	});
	
	
};

function sendEmail(recipient, subject, message) {
	transporter.sendMail({
	    from: 'ospreytester@gmail.com',
	    to: recipient,
	    subject: subject,
	    text: message
	}, function(err, info){
		var newLog = new EmailLogModel();
		newLog.timestamp = Date();
		if (err)
			newLog.data = err;
		else
			newLog.data = info;
		newLog.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
	});

	// require('crypto').randomBytes(48, function(ex, buf) {
 //  		var token = buf.toString('hex');
	// });

}



// Code for searching: not working

// Searching API not working
// var options = {
// 	'vault_id' : vaultid,
// 	'schema_id' : userSchemaId,
//   	'filter' : { 
//   		'user_id': {
// 	    	"type": "eq",
// 	    	"value": value.user.user_id
// 	    }
// 	}
// };
// console.log("===OPTIONS===");
// console.log(options);

// truevault.documents.search(options, function (err2, value2) {
// 	if (err) {
// 		console.log(err2);
// 		res.send(err2);
// 	}
// 	else {
// 		console.log("===VALUE===");
// 		console.log(value2);
// 		res.send(value2);
// 	}
// });
