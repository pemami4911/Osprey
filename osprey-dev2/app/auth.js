var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};

function Auth(_globals, _api_key, _vaultid) {
	globals = _globals;
	api_key = _api_key;
	vaultid = _vaultid;
	truevault = require('../truevault/lib/truevault.js')(api_key);
}

	// takes email and password in request body
	// returns true or false, sets session variable to access token
Auth.prototype.login = function(req, res) {
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
}

	// takes username, password, user attributes in request body
	// returns true or false, sets session variable to access token
Auth.prototype.register = function(req, res){
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
		    } else {

		    }
		    console.log(options2);
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
}

	// takes email in request body
	// returns 1 if that user is found in list of all users, 0 otherwise
Auth.prototype.checkReg = function(req, res){
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
}

	// checks access token stored in session
	// attempts to logout, sends appropriate message 
Auth.prototype.logout = function(req, res){
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
}

	// checks access token stored in session 
	// returns false if verification fails, the user object if successful
Auth.prototype.isLogged = function(req, res) {
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
							console.log("User found:");
							document.email = value.user.username;
							res.send(document);


						});
					}
				}
			});
		}
	});
}


module.exports = Auth;