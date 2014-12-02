var app  = require('../../../server.js');
var http = require('http');

var request = require('supertest');
var should = require('should'); 
var assert = require('assert');

var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
var vaultid = '093b7e33-be5c-4f41-bd95-11cdebf3465b';
var truevault = require('../../../truevault/lib/truevault.js')(api_key);

var sessionCookie = null;


describe('mocha unit tests', function () {
	var url = 'localhost:8080'; 
	var confToken = ''; 

	// 10 second wait to load all schemas
	before( function(done) {
		this.timeout(5000);
		setTimeout(function(){
			console.log("Starting tests");
            done();
        }, 4500);
	})

	describe('User registration (/auth/register, /verify)', function() {
		it('should register a physician successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'nickoftime555@gmail.com',
	        	password: 'asdf',
	        	userType: 'Physician',
	        	firstName: 'John',
	        	middleInit: 'A',
	        	lastName: 'Smith'
	      	};

	    	request(url)
				.post('/auth/register')
				.send(postBody)
		    	// end handles the response
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	// this is should.js syntax, very clear
		          	should.exist(res);
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should create the physician user successfully', function(done) {
	    	truevault.users.list(function (err, value) {
	    		var foundUser = false;
				for (var i = 0; i < value.users.length; i++) {
					if (value.users[i].username == 'nickoftime555@gmail.com') {
						foundUser = true;
					}
				}
				foundUser.should.equal(true);
				done();
			});
	    });

	    it('should create the physician user document successfully', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"nickoftime555@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var physicianDocument = JSON.parse(buf.toString('ascii'));
				// console.log(physicianDocument);
				physicianDocument.username.should.equal('nickoftime555@gmail.com');
				physicianDocument.userType.should.equal('Physician');
				physicianDocument.firstName.should.equal('John');
				confToken = physicianDocument.confirmationToken;
				done();
			});
	    });

	    it('should verify successfully', function(done) {
			this.timeout(20000);

	    	request(url)
				.get('/verify?id=' + confToken)
		    	// end handles the response
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	// this is should.js syntax, very clear
		          	should.exist(res);
		          	// console.log(res);
		          	res.header.location.should.equal('http://localhost:8080/#/');
		          	done();
		        });
	    });

	    it('should fail to register a duplicate email', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'nickoftime555@gmail.com',
	        	password: 'asdf',
	        	userType: 'Physician',
	        	firstName: 'John',
	        	middleInit: 'A',
	        	lastName: 'Smith'
	      	};

	    	request(url)
				.post('/auth/register')
				.send(postBody)
		    	// end handles the response
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	// this is should.js syntax, very clear
		          	should.exist(res);
		          	res.status.should.equal(500);
		          	done();
		        });
	    });
	});


	describe('/settings/generateInvite', function() {
		var physId = '';
		// find physician id
		before( function(done) {
			truevault.users.list(function (err, value) {
				for (var i = 0; i < value.users.length; i++) {
					if (value.users[i].username == 'nickoftime555@gmail.com') {
						physId = value.users[i].user_id;
						done();
					}
				}
			});
		});


		it('should generate an invite code successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'nickoftime555@gmail.com',
	        	password: 'asdf',
	        	physicianId: physId,
	        	patientEmail: 'njiang1209@ufl.edu'
	      	};

	    	request(url)
				.post('/settings/generateInvite')
				.send(postBody)
		    	// end handles the response
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	// this is should.js syntax, very clear
		          	should.exist(res);
		          	// console.log(res);
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

		it('should fail to generate an invite code with bad password', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'nickoftime555@gmail.com',
	        	password: 'nottherightpassword',
	        	physicianId: physId,
	        	patientEmail: 'njiang1209@ufl.edu'
	      	};

	    	request(url)
				.post('/settings/generateInvite')
				.send(postBody)
		    	// end handles the response
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	// this is should.js syntax, very clear
		          	should.exist(res);
		          	// console.log(res);
		          	res.status.should.equal(401);
		          	done();
		        });
	    });
	});
	

    after( function(done) {
		this.timeout(20000);
		var vaultCleared = false;
		var userDeleted = false;

		request(url)
			.post('/debug/clearVault')
	    	// end handles the response
			.end(function(err, res) {
	        	if (err) {
	            	throw err;
	          	}
	          	should.exist(res);
	          	res.status.should.equal(200);
	          	vaultCleared = true;
	   			if (userDeleted)
	   				done();
	        });

	    request(url)
			.post('/debug/deleteTestUser')
	    	// end handles the response
			.end(function(err, res) {
	        	if (err) {
	            	throw err;
	          	}
	          	should.exist(res);
	          	res.status.should.equal(200);
	          	userDeleted = true;
	          	if (vaultCleared)
	          		done();
	        });
	});
});

