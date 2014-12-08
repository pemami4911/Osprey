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
		if (err) {
			res.status(401).send({"message":"Verification error"}); 
			return;
		}

		var filterAttributes = Builder.vendFilterAttributes( "eq", value.user.user_id  ); 
		var filter = Builder.vendFilter( globals.childSchemaId, vaultid, {"parentId":filterAttributes}, true );

		truevault.documents.search(filter, function (err2, value2) {
			if (err) {
				console.log('search error');
				res.status(500).send({"message":"Search error"});
				return;
			}

			var retObject = {"content":[]};
			if (value2.data.documents.length == 0) {
				res.status(200).json(retObject);
			}
			for (var i = 0; i < value2.data.documents.length; i++) {
				addChild(res, retObject, value2.data.documents.length, value2.data.documents[i]);
			}
		});
	});
}


Users.prototype.childrenOfPhysician = function(req, res) {
	var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);
	temp.auth.verify(function(err, value){
		if (err) {
			res.status(401).send({"message":"Verification error"}); 
			return;
		}

		var filterParentAttributes = Builder.vendFilterAttributes( "eq", value.user.user_id ); 
		var filterParent = Builder.vendFilter( globals.userSchemaId, vaultid, {"parPhysicianId":filterParentAttributes}, true );
		truevault.documents.search(filterParent, function (err, value) {
			if (err) {
				console.log('search error');
				res.status(500).send({"message":"Search error"});
				return;
			}
			var retObject = {"content":[]};

			if (value.data.documents.length === 0) {
				res.status(200).json(retObject);
				return;
			}

			var numOfParents = value.data.documents.length;
			

			// keeps track of how many children and parents have been added to return object
			// ensures that object is only returned when all parents and children have been added
			var returnTracker = {
				"totalChildren": 0,
				"childrenProcessed": 0,
				"totalParents": numOfParents,
				"parentsProcessed": 0
			};

			// for each parent
			for (var i = 0; i < numOfParents; i++) {
				var buf = new Buffer(value.data.documents[i].document, 'base64');
				var parentObject = JSON.parse(buf.toString('ascii'));

				var filterChildAttributes = Builder.vendFilterAttributes( "eq", parentObject.user_id ); 
				var filterChild = Builder.vendFilter( globals.childSchemaId, vaultid, {"parentId":filterChildAttributes}, true );
				
				truevault.documents.search(filterChild, function (err, value) {
					if (err) {
						console.log('child search error');
						res.status(500).send({"message":"Child search error"});
						return;
					}

					returnTracker.totalChildren += value.data.documents.length;
					returnTracker.parentsProcessed++;
					for (var j = 0; j < value.data.documents.length; j++) {
						addChildPhysician(res, retObject, returnTracker, value.data.documents[j], parentObject);
					}
				});
			}
		});
	});
}

Users.prototype.addChild = function(req, res) {
	var temp = require('../../truevault/lib/truevault.js')(req.session.access_token);
	temp.auth.verify(function(err, value){
		if (err) {
			res.status(401).send({"message":"Verification error"}); 
			return;
		}

		var newChild = Child.createChild( value.user.user_id, req.body.childName, req.body.childBirthday, req.body.childGender );
		var childDoc = Builder.vendDocument( globals.childSchemaId, vaultid, newChild );
		truevault.documents.create( childDoc, function( err, value ) {
			if (err) {
				console.log( err ); 
				res.status(500).send({"message":"error at child doc creation"});
			}
			res.status(200).end();
		}); 
	});
}

// helper function for /users/childrenOfPhysician
var addChildPhysician = function(res, retObject, retTracker, childDoc, parentObject) {
	var buf = new Buffer(childDoc.document, 'base64');
	var childObject = JSON.parse(buf.toString('ascii'));
	childObject.fitbit = [];
	childObject.parent = parentObject;

	var allFitbitFilterAttributes = Builder.vendFilterAttributes("eq", childDoc.document_id);
	var allFitbitFilter = Builder.vendFilter 	(globals.fitbitSchemaId, vaultid, 
												{"childID":allFitbitFilterAttributes}, true);
	truevault.documents.search(allFitbitFilter, function(err, value) {
		if (err) {
			console.log("Fitbit search error");
			res.status(500).send({"message":"Fitbit search error"});
			return;
		}

		for (var i = 0; i < value.data.documents.length; i++) {
			var buf2 = new Buffer(value.data.documents[i].document, 'base64');
			var fitbitObj = JSON.parse(buf2.toString('ascii'));
			childObject.fitbit.push(fitbitObj);
		}

		retObject.content.push(childObject);
		retTracker.childrenProcessed++;

		if (retTracker.childrenProcessed == retTracker.totalChildren && retTracker.parentsProcessed == retTracker.totalParents) {
			res.status(200).json(retObject);
		}
	});
}


// helper function for /users/childrenOfParent
// creates child object out of b64 string
// creates array of all fitbit data for that child and appends to child object
// adds child object to return object
// sends if all children have been found and added to array
var addChild = function(res, retObject, numChildren, childDoc) {
	var buf = new Buffer(childDoc.document, 'base64');
	var childObject = JSON.parse(buf.toString('ascii'));
	childObject.fitbit = [];

	var allFitbitFilterAttributes = Builder.vendFilterAttributes("eq", childDoc.document_id);
	var allFitbitFilter = Builder.vendFilter 	(globals.fitbitSchemaId, vaultid, 
												{"childID":allFitbitFilterAttributes}, true);

	truevault.documents.search(allFitbitFilter, function(err, value) {
		if (err) {
			console.log("Fitbit search error");
			res.status(500).send({"message":"Fitbit search error"});
			return;
		}
			
		for (var i = 0; i < value.data.documents.length; i++) {
			var buf2 = new Buffer(value.data.documents[i].document, 'base64');
			var fitbitObj = JSON.parse(buf2.toString('ascii'));
			childObject.fitbit.push(fitbitObj);
		}

		retObject.content.push(childObject);
		if (retObject.content.length == numChildren) {
			res.status(200).json(retObject);
		}
	});
}




module.exports = Users; 