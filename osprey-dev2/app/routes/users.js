'use strict'

var globals = {};
var api_key = '';
var vaultid = '';
var truevault = {};

var truevaultBuilder = require('../schemas/truevaultBuilder'); 
var Builder = new truevaultBuilder(); 
var UserSchema = require('../schemas/user');
var User = new UserSchema(); 
var ChildSchema = require('../schemas/child');
var Child = new ChildSchema(); 
var regex = new RegExp("[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$", "i");	// document id validation

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
			res.status(500).send({"message":"Verification error"}); 
		} else {
			// find user attributes
			// var options = {
			// 	'vault_id' : vaultid,
			// 	'schema_id' : globals.childSchemaId,
			//   	'filter' : { 
			//   		'parentId': {
			// 	    	"type": "eq",
			// 	    	"value": req.body.parentId
			// 	    }
			// 	},
			// 	'full_document' : true
			// };
			var filterAttributes = Builder.vendFilterAttributes( "eq", req.body.parentId ); 
			var filter = Builder.vendFilter( globals.childSchemaId, vaultid, {"parentId":filterAttributes}, true );

			truevault.documents.search(filter, function (err2, value2) {
				if (err) {
					console.log('search error');
					res.status(500).send({"message":"Search error"}); 
				}
				else {
					console.log( value2 ); 
					if (value2.data.documents.length === 0)
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
			res.status(200).json(retObject);
		}
	});
}

module.exports = Users; 