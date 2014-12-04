'use strict'

var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};
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
var InviteCodeSchema = require('../schemas/inviteCode.js'); 
var InviteCode = new InviteCodeSchema(); 
var regex = new RegExp("[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$", "i");	// document id validation

// set this to our domain for security 
var host = 'localhost:8080'; 

var nodemailer = require('nodemailer');
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
		var user, doc_id; 

		// validate the email and password 
		var userDetails = Builder.vendLogin( req, globals.accountId ); 
		// grab the user with the current email
		var filterAttributes = Builder.vendFilterAttributes( "eq", req.body.email ); 
		var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"username":filterAttributes}, true );

		var validateUser = function( err, value ) {
			if( err ) {
				console.log( err ); 
				res.status( 401 ).send({"message":"The email/password combination you entered is incorrect"}); 
			}
		}

		var onSuccess = function( ex, buf ) {
			// User attributes object creation
	    	var token = buf.toString("hex");
	    	user.confirmationToken = token; 

	   		var link, mailOptions; 
			link = "http://"+req.get("host")+"/verify?id="+token; 
			mailOptions={
				to : req.body.newEmail,
				subject : "Email confirmation", 
				html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click Here to Verify</a><br><br><p>Regards,<p><p>The Osprey Team<p>"
			}

			sendEmail( mailOptions.to, mailOptions.subject, mailOptions.html ); 

			console.log( user ); 
			// update the user document in the database
			var updateDetails = Builder.updateDocument( globals.userSchemaId, vaultid, doc_id, user ); 
			truevault.documents.update( updateDetails, ifError); 
		}

		var ifError = function( err, value ) {
			if ( err ) {
				console.log( err ); 
				res.status(500).send({"message": err} ); 
			}
			else
				console.log( value ); 
		}

		var createCallback = function( err, value ) {
			if ( err ) {
				console.log( err ); 
				res.status(500).send({"message": err } ); 
			}
			user.user_id = value.user.user_id; 
			console.log("New user_id " + user.user_id); 
		}

		var foundUser = function( err, value ) {
			if( err ) {
				console.log( err ); 
				res.status(401).send({"message":err}); 
			}	
			else {

				// used to ensure that the doc id is correct
				doc_id = value.data.documents[0].document_id;
				if ( !regex.test( doc_id) )
					doc_id = value.data.documents[0]; 

				var b64string = value.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				user = JSON.parse(buf.toString('ascii'));

				console.log( user.user_id ); 
				// delete the old User and create a new User
				truevault.users.delete( user, ifError); 
				truevault.users.create( {"username":req.body.newEmail, "password":req.body.password}, createCallback);

				// change the email in the user document
				user.username = req.body.newEmail; 
				
				user.isConfirmed = false; 
				// set the new token and send an email
				require("crypto").randomBytes(32, onSuccess); 
				
				res.status(200).end(); 
			}
		}

		truevault.auth.login( userDetails, validateUser);
		truevault.documents.search( filter, foundUser); 
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
	// check if password is legit
	// generate invite code - contains random string and physician id
	// send email containing the invite code 

	// password verification
	var loginDetails = Builder.vendLogin( req, globals.accountId ); 

	truevault.auth.login( loginDetails, function(err, value) {
		if ( err )
			res.status(401).send( "Incorrect password" );
		else {
			// console.log( "Password verified for generating invite code");
	 
			// create an invite code
			require("crypto").randomBytes(12, function (ex, buf) {
		    	// User attributes object creation
		    	var inviteCode = buf.toString("hex");
		    	// create invite code document and store it
		    	var icAttributes = InviteCode.createInviteCode( req.body.physicianID, req.body.patientEmail, inviteCode );
		    	var icDoc = Builder.vendDocument( globals.inviteCodeSchemaId, vaultid, icAttributes ); 
		    	truevault.documents.create( icDoc, function ( err, value ) {
		    		if( err )
		    			res.status(500).send( err ); 
		  			else {
				    	// send email to patient containing the token 
				    	var link = "http://"+host+"/#/";
						var mailOptions = {
							to : req.body.patientEmail,
							subject : "Welcome to Osprey", 
							html : "Hello,<br> Please use this Invite Code to register for Osprey.<br><br>"+inviteCode+"<br><a href="+link+">Osprey</a>"
						}
						sendEmail( mailOptions.to, mailOptions.subject, mailOptions.html ); 
						res.status(200).end();
					}
					
				});

		    }); 
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

module.exports = Settings; 