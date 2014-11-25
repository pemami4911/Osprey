'use strict'

var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};

function Users(_globals, _api_key, _vaultid) {
	globals = _globals;
	api_key = _api_key;
	vaultid = _vaultid;
	truevault = require('../../truevault/lib/truevault.js')(api_key);
}

Users.prototype.childrenOfParent = function(req, res) {
	var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);
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
}

Users.prototype.childrenOfPhysician = function(req, res) {
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

// might not be needed
Users.prototype.unassignedParents = function(req, res) {
	// 	if (!req.isAuthenticated())
	// 		res.send(false);
		
	// 	UserModel.find({ $and: [{userType : "Parent"}, {physician: null}] }, function(err, data) {
	// 		console.log(data);
	// 		res.send(data);
	// 	});
}

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

module.exports = Users; 