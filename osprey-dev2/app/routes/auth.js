var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};
var host = 'localhost:8080'; 

var nodemailer = require('nodemailer');
var EmailLogModel = require('../models/emaillog');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospreytester@gmail.com',
        pass: 'mypasstest1'
    }
});

function Auth(_globals, _api_key, _vaultid) {
	globals = _globals;
	api_key = _api_key;
	vaultid = _vaultid;
	truevault = require('../../truevault/lib/truevault.js')(api_key);
}

// RESPONSES and ERROR CODES
////////////////////////////////
// 500 is Internal Server Error
// 401 is Unauthorized
// 200 is OK
/////////////////////////////////

// takes email and password in request body
// returns true or false, sets session variable to access token
Auth.prototype.login = function(req, res) {
	var options = {
		"vault_id" : vaultid,
		"schema_id" : globals.emailConfirmationId,
	  	"filter" : { 
	  		"email": {
		    	"type": "eq",
		    	"value": req.body.email
		    }
		},
		"full_document" : true
	}
	// check if the email has been confirmed
	isConfirmed( options, function ( data ) {
		if( data === undefined )
			res.status(500).send({"message":"Invalid email or password"}); 
		if(  data != "OK" )
			res.status(401).send({"message":"Please confirm your email first"} );  
		else {
			var options = {
				"username": req.body.email,
				"password": req.body.password, 
				"account_id": globals.accountId
			};
			truevault.auth.login(options, function(err, value) {
				if ( err ) {
					console.log("login failed");
					//return res.send( handler.errorHandler( 401, "Login Failed" ) );
					res.status(401).send({"message":"Login Failed"}); 
				} else {
					console.log("login successful");
					req.session.access_token = value.user.access_token;
					res.status(200).send( value.user ); 
				}
			});	
		}
	}); 
}

// takes username, password, user attributes in request body
// returns true or false, sets session variable to access token
Auth.prototype.register = function(req, res) {
	var options = {
		"username": req.body.email,
		"password": req.body.password,
	};
	truevault.users.create(options, function(err, value){
	    if ( err ) {
	    	console.log("registration error at user creation");
	    	res.status(500).send({"message":"E-mail already exists"});
		}
	    else {
	    	// User attributes object creation
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
	    	if (req.body.userType == "Physician") {
		    	options2.document.phyShowEmail = true;
				options2.document.phyShowAge = true;
				options2.document.phyShowWeight = true;
		    } 
		    console.log(options2);

	    	truevault.documents.create( options2, function (err2, value2) {
	    		if (err2) {
	    			console.log(err2);
	    			res.status(500).send( {"message":"An internal server error occurred. Sad tiger!"});
	    		}
	    		req.session.access_token = value.user.access_token;
	    	});

			// generate new token
			require("crypto").randomBytes(32, function(ex, buf) {
		  		var token = buf.toString("hex");
				// confirmation email stuff
		    	var options = {
		    		"schema_id": globals.emailConfirmationId,
		    		"vault_id": vaultid,
		    		"document": {
		    			"email": req.body.email, 
		    			"token": token,
		    			"isConfirmed": false
		    		}
		    	};
		    	truevault.documents.create(options, function(err, data) {
		    		if( err ) {
		    			console.log(err); 
		    			res.status(500).send({"message":"An internal server error occurred. Sad tiger!"});  
		    		}
		    		else {
		    			var link, mailOptions; 
		    			link = "http://"+req.get("host")+"/verify?id="+token; 
		    			mailOptions={
		    				to : req.body.email,
		    				subject : "Email confirmation", 
		    				html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click Here to Verify</a>"
		    			}
		    			console.log( mailOptions); 

		    			sendEmail( mailOptions.to, mailOptions.subject, mailOptions.html ); 
		    			res.status(200).end(); 
		    		}
		    	});
			});		
	    }
	});
}

Auth.prototype.verify = function(req, res){
	console.log(req.protocol+"://"+req.get("host"));
	console.log("http://"+host); 

	if((req.protocol+"://"+req.get("host"))==("http://"+host))
	{
		console.log("Domain is matched. Information is from Authentic email");

		var options = {
			"vault_id" : vaultid,
			"schema_id" : globals.emailConfirmationId,
		  	"filter" : { 
		  		"token": {
			    	"type": "eq",
			    	"value": req.query.id
			    }
			},
			"full_document" : true
		};
		
		isConfirmed( options, function ( data, email, id ) {
			 if( data === undefined ) 
				res.status(500).send("<h1> An error occurred while verifying your email. Please contact the Osprey Team</h1>"); 
			else {
				if( data === "Unauthorized" ) {

					var options = {
						"vault_id" : vaultid,
						"id" : id,
						"document" : {
			    			"email": email, 
			    			"token": null,
			    			"isConfirmed": true
				    	},
						"schema_id" : globals.emailConfirmationId,		
					};

					truevault.documents.update( options, function ( err, data ) {
						if( err ) {
							console.log( err ); 
							res.status(500).send("<h1> An error occurred while confirming your email. Please contact the Osprey Team</h1>"); 
						}
						else {
							console.log("Successfully updated email confirmation in database");
							res.redirect("http://"+host+"/#/"); 
						}				
					});
				}	 
				else 
					res.status(500).send("<h1>User has already been updated</h1>"); 
			}
		});
	}
	else 
		res.status(500).send("<h1>Request is from unknown source");
}

// takes email in request body
// returns 1 if that user is found in list of all users, 0 otherwise
Auth.prototype.checkReg = function (req, res) {
	truevault.users.list(function(err, value){
	    if (err)
	    	res.status(500).send({"message":"An internal server error occurred. Sad tiger!"});
	    else {
	    	for (var i = 0; i < value.users.length; i++) {
	    		if (req.body.email == value.users[i].username)
	    			res.status(401).send({"message":"A user is already registered with this email"}); 
	    	}
	    	res.status(200).end();
	    }
	});
}

// checks access token stored in session 
Auth.prototype.isLogged = function(req, res) {
	var temp = require("../../truevault/lib/truevault.js")(req.session.access_token);

	temp.auth.verify(function(err, value){
		if ( err ) 
			res.status(500).send({"message":"Verification Error"});
		else {
			// find user attributes
			var options = {
				"vault_id" : vaultid,
				"schema_id" : globals.userSchemaId,
			  	"filter" : { 
			  		"user_id": {
				    	"type": "eq",
				    	"value": value.user.user_id
				    }
				},
				"full_document" : true
			};
			truevault.documents.search(options, function (err2, value2) {
				if (err) 
					res.status(500).send({"message":"TrueVault API failure"});
				else {
					if (value2.data.documents.length === 0)
						console.log("no matching user document found");

					truevault.documents.retrieve({
					   "vault_id" : vaultid,
					   "id" : value2.data.documents[0].document_id
					}, function ( err, document ) {
						if( err )
							res.status(500).send({"message":"TrueVault API failure"});

						var options = {
							"vault_id" : vaultid,
							"schema_id" : globals.emailConfirmationId,
						  	"filter" : { 
						  		"email": {
							    	"type": "eq",
							    	"value": value.user.username
							    }					
							},
							"full_document" : true
						}
						// check if the email has been confirmed
						isConfirmed( options, function ( data ) {

							if ( data === undefined )
								res.status(500).send({ "message" : "An internal server error occurred. Sad tiger!" });
							else if ( data === "Unauthorized" )
								res.status(401).send({ "message" : "The user has accessed the database with an unconfirmed email! ANGRY TIGER!" }); 
							else
								res.send( value.user ); 
						});
					}); 
				}
			});
		}
	}); 
}
// checks access token stored in session
// attempts to logout, sends appropriate message 
Auth.prototype.logout = function (req, res) {
	console.log(req.session.access_token);

	if (req.session.access_token != null) {
		var temp = require("../../truevault/lib/truevault.js")(req.session.access_token);

		temp.auth.logout(function(err, value){
			if (err)
				res.status(500).send({"message":"TrueVault API failure"});
			else {
				req.session.access_token = null;	
				res.status(200).end();
			}
		});
	}
	else 
		return res.status(401).send({"message" : "No one is currently logged in"});
}


function isConfirmed( options, callback) {
	truevault.documents.search( options, function (err, value) {
		if ( err ) {
			console.log( err ); 
			callback( undefined ); 
		}	
		else {
			if( value.data.info.total_result_count != 0) {	// if it is found		
				var doc_id = value.data.documents[0].document_id; 		
				truevault.documents.retrieve({	// retrieve the document
					   "vault_id" : vaultid,
					   "id" : doc_id
				}, function ( err, data ) {
					if( err ) {
						console.log( err );
						callback( undefined ); 
					} 
					else {
						if( data.isConfirmed === false ) {	// if the email has not been confirmed yet
							callback( "Unauthorized", data.email, doc_id);  // send back an error message
						}
						else 
							callback( "OK" );  
					}
				}); 
			}
			else
				callback( undefined ); 
		}
	}); 
}



function sendEmail(recipient, subject, message) {
	console.log("Send Email"); 
	transporter.sendMail({
	    from: "ospreytester@gmail.com",
	    to: recipient,
	    subject: subject,
	    html: message
	});
}

module.exports = Auth;