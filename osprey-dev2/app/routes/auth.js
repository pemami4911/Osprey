var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};
var host = 'localhost:8080'; 
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospreytester@gmail.com',
        pass: 'mypasstest1'
    }
});

// set this to our domain for security 
var host = 'localhost:8080'; 

var truevaultBuilder = require('../schemas/truevaultBuilder'); 
var Builder = new truevaultBuilder(); 
var UserSchema = require('../schemas/user');
var User = new UserSchema(); 
var ChildSchema = require('../schemas/child');
var Child = new ChildSchema(); 
var regex = new RegExp("[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$", "i");	// document id validation

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

	// check if the user is confirmed 
	var filterAttributes = Builder.vendFilterAttributes( "eq", req.body.email ); 
	var checkConfirmed = Builder.vendFilter( globals.userSchemaId, vaultid, {"username":filterAttributes}, true ); 

	// if the user is confirmed, userType will contain the necessary info
	isConfirmed( checkConfirmed, function ( data, userType ) {
		if( data === undefined )
			res.status(500).send({"message":"Invalid email or password"}); 
		if(  data != "OK" ) {
			res.status(401).send({"message":"Please confirm your email first"});  
		}
		else {
			
			var loginDetails = Builder.vendLogin( req, globals.accountId ); 
			truevault.auth.login( loginDetails, function(err, value) {
				if ( err ) {
					console.log(err);
					//return res.send( handler.errorHandler( 401, "Login Failed" ) );
					res.status(401).send({"message":"Login Failed"}); 
				} else {
					// console.log("login successful");
					req.session.access_token = value.user.access_token;
					res.status(200).end();; 
				}
			});	
		}
	}); 
}

// takes username, password, user attributes in request body
// returns true or false, sets session variable to access token
Auth.prototype.register = function(req, res) {
	var uuid, token; 
	// schema for a new user
	var user = {
		"username": req.body.email,
		"password": req.body.password,
	};

	var onCreation = function( err2, value2 ) {
		console.log( "on creation"); 
		if ( err2 ) {
			console.log(err2);
			res.status(500).send( {"message":"An internal server error occurred. Sad tiger!"});
		}

		var link, mailOptions; 
		link = "http://"+req.get("host")+"/verify?id="+token; 
		mailOptions={
			to : req.body.email,
			subject : "Email confirmation", 
			html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click Here to Verify</a><br><br><p>Regards,<p><p>The Osprey Team<p>"
		}

		sendEmail( mailOptions.to, mailOptions.subject, mailOptions.html ); 
		res.status(200).end(); 
	}

	// callback function executed after random token is generated
	var onSuccess = function( ex, buf ) {
		console.log( "On SUccess"); 
		// User attributes object creation
    	token = buf.toString("hex");
   		var newUser = User.createUser( uuid, req, token );
   		var doc = Builder.vendDocument( globals.userSchemaId, vaultid, newUser );

   		console.log( doc ); 
   		truevault.documents.create( doc, onCreation); 
	}

	var createUser = function( err, value ) {
		if ( err ) {
	    	res.status(500).send({"message":"E-mail already exists"});
		}
	    else {

	    	uuid = value.user.user_id; 

			if (req.body.userType != "Physician") {
		    	for (var i = 0; i < req.body.numChildren; i++) {
		    		console.log(req.body.children[i]);
		      		
		    		var newChild = Child.createChild( uuid, req.body.children[i].childName, req.body.children[i].childBirthday, req.body.children[i].childGender );
		    		var childDoc = Builder.vendDocument( globals.childSchemaId, vaultid, newChild ); 	

		    		var callback = function( err, value ) {
		    			if (err) {
		    				console.log( err ); 
		    				res.status(500).send({"message":"error at child doc creation"});
		    			}
		    			console.log(value);	

		    		}

		    		truevault.documents.create( childDoc, callback); 
		    	}
			}
			req.session.access_token = value.user.access_token;
			require("crypto").randomBytes(32, onSuccess); 
	    }
	}

	truevault.users.create( user, createUser); 
}

Auth.prototype.verify = function(req, res) {

	if((req.protocol+"://"+req.get("host"))==("http://"+host))
	{
		// console.log("Domain is matched. Information is from Authentic email");

		var filterAttributes = Builder.vendFilterAttributes( "eq", req.query.id ); 
		var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"confirmationToken":filterAttributes}, true );

		isConfirmed( filter, function ( resp, user, id ) {
			if( resp === undefined ) 
				res.status(500).send("<h1> An error occurred while verifying your email. Please contact the Osprey Team</h1>"); 
			else {
				if( resp === "Unauthorized" ) {
					// isConfirmed is set to true, confirmationToken set to null

					user.isConfirmed = true; 
					user.confirmationToken = null; 
					// not usable with IE9 and earlier
					//var enc = window.btoa( user ); 
					var updateUser = Builder.updateDocument( globals.userSchemaId, vaultid, id, user);
					truevault.documents.update( updateUser, function ( err, data ) {
						if( err ) {
							console.log( err ); 
							res.status(500).send("<h1> An error occurred while confirming your email. Please contact the Osprey Team</h1>"); 
						}
						else {

							res.redirect("http://"+host+"/#/"); 
						}				
					});
				}
				else 
					res.status(400).send("<h1>User has already been updated</h1>"); 
			}
		});
	}
	else 
		res.status(500).send("<h1>Request is from unknown source");
}

// takes email in request body
// returns 1 if that user is found in list of all users, 0 otherwise
Auth.prototype.checkReg = function (req, res) {

	//if parent, check to see if the invite code is matched to a physician 
	if( req.body.userType === "Parent" ) {

		var ic = req.body.inviteCode; 
		var filterAttributes = Builder.vendFilterAttributes( "eq", ic ); 
		var filter = Builder.vendFilter( globals.inviteCodeSchemaId, vaultid, {"token":filterAttributes}, true )

		truevault.documents.search( filter, function( err, value ) {
			if( err )
				console.log( err ); 
			else {
				if( value.data.documents.length === 0 ) {
					res.status(401).send({"message":"The invite code was not recognized"}); 
				}
				else if( value.data.documents.length > 1 ) {
					res.status(500).send({"message":"An internal error occurred"}); 
				}
				else {
					// used to ensure that the doc id is correct
					var doc_id = value.data.documents[0].document_id;
					if ( !regex.test( doc_id) )
						doc_id = value2.data.documents[0]; 

					truevault.documents.retrieve({	// retrieve the user document
						   "vault_id" : vaultid,
						   "id" : doc_id
					}, function ( err, data ) {
						var physID = data.physicianID;  
						if( err ) {
							console.log( err ); 
							res.status(500).send(); 
						}
						else {
							if( data.parentEmail != req.body.email ) {
								res.status(401).send({"message":"The invite code is not registered to this email"}); 
							}
							else {
								// grab the physicians First and last name 
								var filterAttributes = Builder.vendFilterAttributes( "eq", data.physicianID ); 
								var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"user_id":filterAttributes}, true );

								truevault.documents.search( filter, function( err, value ) {
									if ( err ) {
										console.log( err ); 
										res.status(500).send(); 
									}
									else {
										if( value.data.documents.length === 0) 
											res.status(401).send({"message":"There are no physicians associated with the invite code"}); 
										else {
											var doc_id = value.data.documents[0].document_id;
											if ( !regex.test( doc_id) )
												doc_id = value2.data.documents[0]; 

											truevault.documents.retrieve({	// retrieve the document
												   "vault_id" : vaultid,
												   "id" : doc_id
											}, function ( err, data ) {
												if( err )
													console.log( err );
												else {
													var physData = {	// construct an object with the physician name and id
														"name":"Dr. "+data.firstName+" "+data.lastName,
														"id":physID
													}
													truevault.users.list(function(err, value) {
													    if (err)
													    	res.status(500).send({"message":"An internal server error occurred. Sad tiger!"});
													    else {
													    	for (var i = 0; i < value.users.length; i++) {
													    		if (req.body.email == value.users[i].username)
													    			res.status(401).send({"message":"A user is already registered with this email"}); 
													    	}
													    	res.status(200).send( physData ); // send the physician id and name to the reg data
													    }
													});     
												}
											}); 
										}
									}
								});  
							}
						}
					}); 
				}
			}
		});
	}
	else {
		truevault.users.list(function(err, value) {
		    if (err) {
		    	console.log( err ); 
		    	res.status(500).send({"message":"Internal Server Error occurred"});
		    }
		    else {
		    	for (var i = 0; i < value.users.length; i++) {
		    		if (req.body.email == value.users[i].username)
		    			res.status(500).send({"message":"A user is already registered with this email"}); 
		    	}
		    	res.status(200).end();
		    }
		});
	}
	
}

// checks access token stored in session 
Auth.prototype.isLogged = function(req, res) {
	var temp = require("../../truevault/lib/truevault.js")(req.session.access_token);
	temp.auth.verify(function(err, value){
		if ( err ) 
			res.status(500).send({"message":"Verification Error"});
		else {

			var filterAttributes = Builder.vendFilterAttributes( "eq", value.user.user_id ); 
			var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"user_id":filterAttributes}, true );
			truevault.documents.search( filter, function (err2, value2) {
				if (err) 
					res.status(500).send({"message":"TrueVault API failure"});
				else {

					if (value2.data.documents.length === 0)
						console.log("no matching user document found");

					// used to ensure that the doc id is correct
					var doc_id = value2.data.documents[0].document_id;
					if ( !regex.test( doc_id) )
						doc_id = value2.data.documents[0]; 

					truevault.documents.retrieve({
					   "vault_id" : vaultid,
					   "id" : doc_id
					}, function ( err, document ) {
						if( err )
							res.status(500).send({"message":"TrueVault API failure"});

						// check if the email has been confirmed
						isConfirmed( filter, function ( data ) {

							if ( data === undefined )
								res.status(500).send({ "message" : "An internal server error occurred. Sad tiger!" });
							else if ( data === "Unauthorized" )
								res.status(401).send({ "message" : "The user has accessed the database with an unconfirmed email! ANGRY TIGER!" }); 
							else {
								document.username = value.user.username;
								res.send( document ); 
							}
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
		res.status(401).send({"message" : "No one is currently logged in"});
}

// Works on the principle that each username (email) and random token is unique
function isConfirmed( user, callback ) {
	truevault.documents.search( user, function (err, value) {	// find a user in the database
		if ( err ) {
			console.log( err ); 
			callback( undefined ); 	// err occurred while searching for user
		}	
		else {
			if( value.data.info.total_result_count != 0) {	// if it is found, continue

				// used to ensure that the doc id is correct
				var doc_id = value.data.documents[0].document_id;
				if ( !regex.test( doc_id ) )
					doc_id = value.data.documents[0]; 

				truevault.documents.retrieve({	// retrieve the user document
					   "vault_id" : vaultid,
					   "id" : doc_id
				}, function ( err, data ) {
					if( err ) {
						console.log( err );
						callback( undefined ); 
					} 
					else {
						console.log( data ); 
						if( data.isConfirmed === false )	// if the user has not been confirmed yet
							callback( "Unauthorized", data, doc_id);  // send back an error message
						else 
							callback( "OK", data.userType ); 		
					} 
				});		 
			}
			else {
				console.log( value.data ); 	// the user is not found
				callback( undefined );
			}
		}
	}); 
}


function sendEmail(recipient, subject, message) {
	// console.log("Send Email"); 
	transporter.sendMail({
	    from: "ospreytester@gmail.com",
	    to: recipient,
	    subject: subject,
	    html: message
	});
}

module.exports = Auth;