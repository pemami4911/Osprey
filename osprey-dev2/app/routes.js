'use strict';

var passport = require('passport');
var UserModel = require('./models/user');
var EmailLogModel = require('./models/emaillog');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var css = require('css');

var truevault = require('../truevault/lib/truevault.js')('9fea34bb-e1e6-4e26-a061-3ed2aac0000e');
var vaultid = '2d56e58f-65f7-4302-a9aa-0afb162de187'; //osprey-dev
var userSchemaId;
var emailLogSchemaId;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospreytester@gmail.com',
        pass: 'mypasstest1'
    }
});


// checks for user schemas and email schemas to be present in the vault upon initialization
var checkSchemas = function() {
	var options = {
		"vault_id" : vaultid
	};
	truevault.schemas.list(options, function(err, value) {
		if (err)
			console.log(err);
		else {
			console.log(value);
			var foundUser = false;
			var foundEmailLog = false;
			for (var i = 0; i < value.schemas.length; i++){
				if (value.schemas[i].name == "user") {
					userSchemaId = value.schemas[i].id;
					foundUser = true;
				}
				if (value.schemas[i].name = "emailLog") {
					emailLogSchemaId = value.schemas[i].id;
					foundEmailLog = true;
				}
			}
			if (!foundUser) {
				var schema = {
				   "name": "user",
				   "fields": [
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
				var newOptions = {
					"vault_id" : vaultid,
					"schema" : schema
				};
				truevault.schemas.create (newOptions, function (err, value){
					if (err)
						console.log(err);
					else {
						console.log(value);
					}
				});
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
				var newOptions = {
					"vault_id" : vaultid,
					"schema" : schema
				};
				truevault.schemas.create (newOptions, function (err, value){
					if (err)
						console.log(err);
					else {
						console.log(value);
					}
				});
			}
			
		}
	})
}

checkSchemas();

module.exports = function(app) {
	// api ---------------------------------------------------------------------

	// temporarily using this to test out new api calls
	app.post('/auth/login', function(req, res, next) {
		var options = {
			"vault_id": vaultid,
			'per_page':50, 
			'page':1, 
			'full_document': true
		};

		truevault.documents.list(options, function(err, value) {
			console.log(err);
			console.log(value.data.items);
		});
	});

	app.get('/auth/logout', function(req, res) {
		if (req.isAuthenticated()) {
  				req.logout();	
   				return res.send("Logged out successfully");
  		}
  		else {
  			return res.send("Failed to log out successfully");
  		}
	});

	app.post('/auth/register', function(req, res, next) {
		var options = {
			"username": req.body.email,
			"password": req.body.password,
			"schema_id": userSchemaId,
			"attributes": {
				"userType": req.body.userType,
				"firstName": req.body.firstName,
				"midInit": req.body.mI,
				"lastName": req.body.lastName
			}
		};
		truevault.users.create(options, function(err, value){
		    if (err) {
		    	console.log(err);
		    	res.send(err);
			}
		    else {
		    	console.log(value);
		    	res.send(value);
		    }
		});
	});
	
	app.post('/auth/checkReg', function(req, res) {
		truevault.users.list(function(err, value){
		    if (err)
		    	res.send(err);
		    else {
		    	console.log(value);
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

	app.post('/auth/isLogged', function(req, res) {
		if (req.isAuthenticated()) {
			res.send(req.user);
		} else {
			res.send(false);
		}
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
}
