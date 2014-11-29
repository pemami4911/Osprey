var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
var vaultid = 'fa84a7a5-90da-4919-b52e-67e026d9e91f'; // unit test vault
var truevault = require('../../../truevault/lib/truevault.js')(api_key);
var truevaultBuilder = require('../../schemas/truevaultBuilder'); 
var Builder = new truevaultBuilder(); 
var UserSchema = require('../../schemas/user');
var User = new UserSchema(); 
var should = require('should');

var attributes = {
	"body": {}
} 

describe('TrueVault Unit Tests', function() {

	beforeEach( function(done) {
		// create new user
		attributes.body = {
			"email":"test@test.com",
			"userType":"parent",
			"firstName":"patrick", 
			"middleInitial":"o",
			"lastName":"emami",
			"isConfirmed":false
		}
		done(); 
	});

	describe('Create a user', function() {
		it('should create a user with a confirmation token successfully', function(done) {
			require("crypto").randomBytes(32, function (ex, buf) {
		    	// User attributes object creation
		    	var token = buf.toString("hex");
		   		var newUser = User.createUser( '12345', attributes, token );
		   		var doc = Builder.vendDocument( '2824fe42-e3ba-4d6b-84fc-d2155dde3503', vaultid, newUser );

		   		truevault.documents.create( doc, function(err2, value2) {
		    		should.exist(value2); 
		    		done();  
		    	}); 
		    });
		}); 
	}); 

});