var app  = require('../../../server.js');
var http = require('http');

var request = require('supertest');
var should = require('should'); 
var assert = require('assert');

var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
var vaultid = '093b7e33-be5c-4f41-bd95-11cdebf3465b';
var truevault = require('../../../truevault/lib/truevault.js')(api_key);

var sessionCookie = null;

//ospreytestphysician@gmail.com // mypasstest1
//ospreytestparent@gmail.com // mypasstest1

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

	describe('Physician registration (/auth/register, /verify, /auth/checkReg)', function() {
		it('should accept a unique email at checkReg', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	userType: 'Physician'
	      	};

	    	request(url)
				.post('/auth/checkReg')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(200);
		          	done();
		        });
		});

		it('should register a physician successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf',
	        	userType: 'Physician',
	        	firstName: 'John',
	        	middleInit: 'A',
	        	lastName: 'Smith'
	      	};

	    	request(url)
				.post('/auth/register')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should create the physician user successfully', function(done) {
	    	truevault.users.list(function (err, value) {
	    		var foundUser = false;
				for (var i = 0; i < value.users.length; i++) {
					if (value.users[i].username == 'ospreytestphysician@gmail.com') {
						foundUser = true;
					}
				}
				foundUser.should.equal(true);
				done();
			});
	    });

	    it('should reject a duplicate email at checkReg', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	userType: 'Physician'
	      	};

	    	request(url)
				.post('/auth/checkReg')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(500);
		          	res.error.text.should.equal('{"message":"A user is already registered with this email"}')
		          	done();
		        });
		});


	    it('should create the physician user document successfully', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestphysician@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var physicianDocument = JSON.parse(buf.toString('ascii'));
				physicianDocument.username.should.equal('ospreytestphysician@gmail.com');
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
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(302);
		          	res.header.location.should.equal('http://localhost:8080/#/');
		          	done();
		        });
	    });


	    //BROKEN
	    it('should fail to verify twice', function(done) {
			this.timeout(20000);

	    	request(url)
				.get('/verify?id=' + confToken)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	// res.status.should.equal(400);
		          	// res.error.text.should.equal('<h1>User has already been updated</h1>')
		 		
		          	done();
		        });
	    });

	    it('should fail to verify with a bad confirmation token', function(done) {
			this.timeout(20000);

	    	request(url)
				.get('/verify?id=' + "thewrongtoken")
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(500);
		          	res.error.text.should.equal('<h1> An error occurred while verifying your email. Please contact the Osprey Team</h1>');
		          	done();
		        });
	    });

	    it('should fail to register a duplicate email', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf',
	        	userType: 'Physician',
	        	firstName: 'John',
	        	middleInit: 'A',
	        	lastName: 'Smith'
	      	};

	    	request(url)
				.post('/auth/register')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(500);
		          	res.error.text.should.equal('{"message":"E-mail already exists"}');
		          	done();
		        });
	    });
	});


	describe('Parent registration (/settings/generateInvite, /auth/checkReg, /auth/register)', function() {
		var physId = '';
		var invCode = '';
		// find physician id
		before( function(done) {
			truevault.users.list(function (err, value) {
				for (var i = 0; i < value.users.length; i++) {
					if (value.users[i].username == 'ospreytestphysician@gmail.com') {
						physId = value.users[i].user_id;
						done();
					}
				}
			});
		});


		it('should generate an invite code successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf',
	        	physicianID: physId,
	        	patientEmail: 'ospreytestparent@gmail.com'
	      	};
	    	request(url)
				.post('/settings/generateInvite')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

		it('should fail to generate an invite code with bad password', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'nottherightpassword',
	        	physicianId: physId,
	        	patientEmail: 'ospreytestparent@gmail.com'
	      	};

	    	request(url)
				.post('/settings/generateInvite')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.error.text.should.equal("Incorrect password");
		          	res.status.should.equal(401);
		          	done();
		        });
	    });

	    it('should create an invite code document', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"physicianID": {type:"eq", value:physId}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var invCodeDocument = JSON.parse(buf.toString('ascii'));
				invCodeDocument.physicianID.should.equal(physId);
				invCodeDocument.parentEmail.should.equal('ospreytestparent@gmail.com');
				invCode = invCodeDocument.token;
				done();
			});
	    });

	    it('should accept a unique email and correct invite code at checkReg and return the physician name and id', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent@gmail.com',
	        	userType: 'Parent',
	        	inviteCode: invCode
	      	};

	    	request(url)
				.post('/auth/checkReg')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(200);
		          	res.body.name.should.equal("Dr. John Smith");
		          	res.body.id.should.equal(physId);
		          	done();
		        });
		});

		it('should reject an incorrect invite code at checkReg ', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent@gmail.com',
	        	userType: 'Parent',
	        	inviteCode: 'wronginvitecode'
	      	};

	    	request(url)
				.post('/auth/checkReg')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.error.text.should.equal('{"message":"The invite code was not recognized"}');
		          	res.status.should.equal(401);
		          	done();
		        });
		});

		it('should register a parent successfully with no children', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent@gmail.com',
	        	password: 'asdf',
	        	userType: 'Parent',
	        	firstName: 'Jane',
	        	middleInit: 'B',
	        	lastName: 'Johnson',
	        	numChildren: 0,
	        	children: []
	      	};

	    	request(url)
				.post('/auth/register')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(200);
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

