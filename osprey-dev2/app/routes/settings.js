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
				if (err2) {
					res.status(500).send({"message":"TrueVault API"}); 
					return;
				}

				if (value2.data.documents.length == 0) {
					res.status(401).send( {"message":"no matching user document found"} );
					return;
				}

				var buf = new Buffer(value2.data.documents[0].document, 'base64');
				var physObject = JSON.parse(buf.toString('ascii'));

				physObject.phyShowEmail = req.body.newSettings.email;
				physObject.phyShowAge = req.body.newSettings.age;
				physObject.phyShowWeight = req.body.newSettings.weight;

				truevault.documents.update({
					'vault_id' : vaultid,
			  		'id' : value2.data.documents[0].document_id,
			  		'document' : physObject
				}, function ( err, value ) {
					if( err )
						res.status(500).send({"message":"An internal server error occurred. Sad tiger!"}); 
					res.status(200).end(); 
				});
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
		// update the user document in the database
		var updateDetails = Builder.updateDocument( globals.userSchemaId, vaultid, doc_id, user ); 
		truevault.documents.update( updateDetails, ifError); 
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
			truevault.users.updateUsername({'user_id': user.user_id, 'username': req.body.newEmail}, ifError); 
			
			// change the email in the user document
			user.username = req.body.newEmail; 
			user.isConfirmed = false; 
			// set the new token and send an email
			require("crypto").randomBytes(32, onSuccess); 
			
			res.status(200).end(); 
		}
	}

	var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);

	temp.auth.verify(function(err, value){
		if (err) {
			res.status(500).send({"message": "User verification error"});
			return;
		}
		truevault.auth.login( userDetails, function( err, value ) {
			if( err ) {
				console.log( err ); 
				res.status( 401 ).send({"message":"The email/password combination you entered is incorrect"}); 
				return;
			}

			truevault.documents.search( filter, foundUser); 
		});
	});
}

Settings.prototype.changePassword = function(req, res) {
	var user; 

	var userDetails = Builder.vendLogin( req, globals.accountId ); 

	var foundUser = function( err, value ) {
		if( err ) {
			res.status( 500 ).send({"message":"An error occurred while changing your password"}); 
		}
		else {
			var b64string = value.data.documents[0].document;
			var buf = new Buffer(b64string, 'base64');
			user = JSON.parse(buf.toString('ascii'));
			truevault.users.updatePassword({'user_id': user.user_id, 'password': req.body.newPassword}, function(err, value) {
				if (err)
					res.status(500).send({"message": err} ); 
				res.status(200).end(); 
			}); 
		}
	}

	var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);
	temp.auth.verify(function(err, value){
		if (err) {
			res.status(500).send({"message": "User verification error"});
			return;
		}
		truevault.auth.login( userDetails, function( err, value ) {
			if( err ) {
				console.log( err ); 
				res.status( 401 ).send({"message":"The email/password combination you entered is incorrect"}); 
				return;
			}

			// grab the user with the current email
			var filterAttributes = Builder.vendFilterAttributes( "eq", req.body.email ); 
			var filter = Builder.vendFilter( globals.userSchemaId, vaultid, {"username":filterAttributes}, true );

			truevault.documents.search( filter, foundUser); 
		});
	});
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

Settings.prototype.deleteAccount = function( req, res ) {
	// for physicians, all parents still need to be updated so that they know their physician's account has been removed
	var loginDetails = Builder.vendLogin( req, globals.accountId ); 
	
	var searchCallback = function( err, value ) {
		for (var i = 0; i < value.data.documents.length; ++i) {
			console.log("Deleting document "+i+" : " + value.data.documents[i].document_id)
			truevault.documents.del({
			   'vault_id' : vaultid,
			   'id' : value.data.documents[i].document_id
			}, function (err, document){
				if (err) {
					console.log("Error deleting document " + i);
					console.log( err ); 
					res.status(500).send({"message":"An error occurred while deleting the account."});
				}
				else
					console.log("Document deleted");
			});
		}

		res.status(200).send({"message":"The account was deleted successfully."}); 
	}

	var deleteCallback = function( err, value ) {
		if( err ) {
			console.log( err ); 
			res.status(500).send({"message":err});
		}
		else {
			console.log( value ); 
			// delete all documents containing this email
			var filterAttributes = Builder.vendFilterAttributes("eq", req.body.email);
			var filter = Builder.vendFilter(globals.userSchemaId, vaultid, {"username":filterAttributes}, true);

			truevault.documents.search(filter, searchCallback);
		}
	}

	var loginCallback = function( err, value ) {
		if( err ) {
			console.log( err ); 
			res.status(401).send({"message":"Invalid user credentials"}); 
		}
	}

	var options = {"user_id":req.body.user_id}; 
	truevault.auth.login( loginDetails, loginCallback); 
	truevault.users.delete( options, deleteCallback); 
}

function validateUser( err, value ) {
	if( err ) {
		console.log( err ); 
		res.status( 401 ).send({"message":"The email/password combination you entered is incorrect"}); 
	}
}


function ifError( err, value ) {
	if ( err ) {
		console.log( err ); 
		res.status(500).send({"message": err} ); 
	}
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