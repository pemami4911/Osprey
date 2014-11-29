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

var truevaultBuilder = require('../schemas/truevaultBuilder'); 
var Builder = new truevaultBuilder(); 
var UserSchema = require('../schemas/user');
var User = new UserSchema(); 
var ChildSchema = require('../schemas/child');
var Child = new ChildSchema(); 

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
	var checkConfirmed = Builder.vendFilter( globals.userSchemaId, vaultid, {"user_id":filterAttributes} ); 

	// if the user is confirmed, userType will contain the necessary info
	isConfirmed( checkConfirmed, function ( data, userType ) {
		if( data === undefined )
			res.status(500).send({"message":"Invalid email or password"}); 
		if(  data != "OK" )
			res.status(401).send({"message":"Please confirm your email first"} );  
		else {
			// var options = {
			// 	"username": req.body.email,
			// 	"password": req.body.password, 
			// 	"account_id": globals.accountId
			// };
			var loginDetails = Builder.vendLogin( req, globals.accountId ); 
			console.log( loginDetails );
			truevault.auth.login( loginDetails, function(err, value) {
				if ( err ) {
					console.log(err);
					console.log("login failed");
					//return res.send( handler.errorHandler( 401, "Login Failed" ) );
					res.status(401).send({"message":"Login Failed"}); 
				} else {
					console.log("login successful");
					req.session.access_token = value.user.access_token;
					if ( userType === "Physician")
						res.redirect("http://"+host+"/#/dashboard");
					else if ( userType === "Parent" )
						res.redirect("http://"+host+"/#/dashParent") 
				}
			});	
		}
	}); 
}

// takes username, password, user attributes in request body
// returns true or false, sets session variable to access token
Auth.prototype.register = function(req, res) {
	// schema for a new user
	var user = {
		"username": req.body.email,
		"password": req.body.password,
	};
	truevault.users.create( user, function(err, value){
	    if ( err ) {
	    	console.log(err);
	    	res.status(500).send({"message":"E-mail already exists"});
		}
	    else {
	    	require("crypto").randomBytes(32, function (ex, buf) {
		    	// User attributes object creation
		    	var token = buf.toString("hex");
		   		var newUser = User.createUser( value.user.user_id, req, token );
		   		var doc = Builder.vendDocument( globals.userSchemaId, vaultid, newUser );

		    	if (req.body.userType != "Physician") {
			    	for (var i = 0; i < req.body.numChildren; i++) {
			    		console.log(i);
			    		console.log(req.body.children[i]);
			      		
			    		var newChild = Child.createChild( value.user.user_id, req, i );
			    		var childDoc = Builder.vendDocument( globals.childSchemaId, vaultid, newChild ); 

			    		truevault.documents.create( childDoc, function(err, value) {
			    			if (err) {
			    				console.log( err ); 
			    				res.status(500).send({"message":"error at child doc creation"});
			    			}
			    			console.log(value);
			    		});
			    	}
			    }

	    		truevault.documents.create( doc, function(err2, value2) {
		    		if (err2) {
		    			console.log("registration error at user doc creation");
		    			console.log(err2);
		    			res.status(500).send( {"message":"An internal server error occurred. Sad tiger!"});
		    		}
		    		console.log( value2 ); 
		    		req.session.access_token = value.user.access_token;
		    
	    			var link, mailOptions; 
	    			link = "http://"+req.get("host")+"/verify?id="+token; 
	    			mailOptions={
	    				to : req.body.email,
	    				subject : "Email confirmation", 
	    				html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click Here to Verify</a>"
	    			}
	    			sendEmail( mailOptions.to, mailOptions.subject, mailOptions.html ); 
	    			res.status(200).end(); 
			    	
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

		// var options = {
		// 	"vault_id" : vaultid,
		// 	"schema_id" : globals.accountConfirmationSchemaId,
		//   	"filter" : { 
		//   		"token": {
		// 	    	"type": "eq",
		// 	    	"value": req.query.id
		// 	    }
		// 	},
		// 	"full_document" : true
		// };
		var filterAttributes = Builder.vendFilterAttributes( "eq", req.query.id ); 
		var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"confirmationToken":filterAttributes}, true );

		isConfirmed( filter, function ( data, id ) {
			 if( data === undefined ) 
				res.status(500).send("<h1> An error occurred while verifying your email. Please contact the Osprey Team</h1>"); 
			else {
				if( data === "Unauthorized" ) {
					// update the document
					// var options = {
					// 	"vault_id" : vaultid,
					// 	"id" : id,
					// 	"document" : {
			  //   			"user_id": email, 
			  //   			"isConfirmed": true
				 //    	},
					// 	"schema_id" : globals.userSchemaId		
					// };

					// isConfirmed is set to true, confirmationToken 
					var updateUser = Builder.updateDocument( globals.userSchemaId, vaultid, id, {"isConfirmed":true, "confirmationToken":null});
					truevault.documents.update( updateUser, function ( err, data ) {
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
			// var options = {
			// 	"vault_id" : vaultid,
			// 	"schema_id" : globals.userSchemaId,
			//   	"filter" : { 
			//   		"user_id": {
			// 	    	"type": "eq",
			// 	    	"value": value.user.user_id
			// 	    }
			// 	},
			// 	"full_document" : true
			// };

			var filterAttributes = Builder.vendFilterAttributes( "eq", value.user.user_id ); 
			var filter = Builder.vendFilter( vaultid, globals.userSchemaId, {"user_id":filterAttributes}, true );
			
			truevault.documents.search( filter, function (err2, value2) {
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

						// var options = {
						// 	"vault_id" : vaultid,
						// 	"schema_id" : globals.accountConfirmationSchemaId,
						//   	"filter" : { 
						//   		"email": {
						// 	    	"type": "eq",
						// 	    	"value": value.user.username
						// 	    }					
						// 	},
						// 	"full_document" : true
						// }

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
		res.status(401).send({"message" : "No one is currently logged in"});
}

// Works on the principle that each username (email) and random token is unique
function isConfirmed( user, callback) {
	truevault.documents.search( user, function (err, value) {	// find a user in the database
		if ( err ) {
			console.log( err ); 
			callback( undefined ); 	// err occurred while searching for user
		}	
		else {
			console.log( value ); 
			if( value.data.info.total_result_count != 0) {	// if it is found, continue
				var doc_id = value.data.documents[0]; 		
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
							callback( "Unauthorized", doc_id);  // send back an error message
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
	console.log("Send Email"); 
	transporter.sendMail({
	    from: "ospreytester@gmail.com",
	    to: recipient,
	    subject: subject,
	    html: message
	});
}

module.exports = Auth;