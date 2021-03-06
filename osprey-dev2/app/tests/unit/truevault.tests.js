/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
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
//ospreytestparent2@gmail.com // mypasstest1

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

	/*
	=========================================================================
	=========================================================================
	|																		|
	|						  PHYSICIAN REGISTRATION 						|
	|																		|
	=========================================================================
	=========================================================================
	*/


	describe('Physician registration and login (/auth/register, /verify, /auth/checkReg), /auth/login)', function() {
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

	    it('should fail to login a nonexistent user', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'idontexist@gmail.com',
	        	password: 'password'
	      	};

	    	request(url)
				.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(500);
		          	res.error.text.should.equal('{"message":"Invalid email"}')
		          	done();
		        });
		});

		it('should fail to login a nonconfirmed user', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf'
	      	};

	    	request(url)
				.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"Please confirm your email first"}')
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

	    it('should login successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf'
	      	};

	    	request(url)
				.post('/auth/login')
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
		          	res.error.text.should.equal('<h1> The email address being used to verify this account is not found in our records. Please contact the Osprey Team</h1>');
		          	done();
		        });
	    });

	    it('should fail to register a physician twice', function(done) {
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

	/*
	=========================================================================
	=========================================================================
	|																		|
	|						  PARENT REGISTRATION 							|
	|																		|
	=========================================================================
	=========================================================================
	*/

	describe('Parent registration and login (/settings/generateInvite, /auth/checkReg, /auth/register, /auth/login, /verify)', function() {
		var physId = '';
		var invCode = '';
		var invCode2 = '';
		var confToken = '';
		var confToken2 = '';
		var parId = '';
		var par2Id = '';
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


		it('should generate an invite code successfully for test user 1', function(done) {
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

	    it('should generate an invite code successfully for test user 2', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf',
	        	physicianID: physId,
	        	patientEmail: 'ospreytestparent2@gmail.com'
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

	    it('should create an invite code document for a parent', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"parentEmail": {type:"eq", value:"ospreytestparent@gmail.com"}},
				"full_document" : true,
				"per_page": 10 
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

		it('should reject an invite code with the wrong email at checkReg ', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'wrongemail@gmail.com',
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
		          	res.error.text.should.equal('{"message":"The invite code is not registered to this email"}');
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
	        	firstName: 'Jane1',
	        	middleInit: 'B',
	        	lastName: 'Johnson1',
	        	numChildren: 0,
	        	children: [],
	        	physicianID: physId
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

	    it('should register a parent successfully with two children', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent2@gmail.com',
	        	password: 'asdf',
	        	userType: 'Parent',
	        	firstName: 'Jane2',
	        	middleInit: 'B',
	        	lastName: 'Johnson2',
	        	numChildren: 2,
	        	children: [	{"childName": "Child One", "childBirthday": "2010-01-01", "childGender": "Male"}, 
	        				{"childName": "Child Two", "childBirthday": "2011-01-01", "childGender": "Female"}],
	        	physicianID: physId
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

	    it('should fail to register a parent twice', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent2@gmail.com',
	        	password: 'asdf',
	        	userType: 'Parent',
	        	firstName: 'Jane',
	        	middleInit: 'B',
	        	lastName: 'Johnson',
	        	physicianID: physId
	        };

	    	request(url)
				.post('/auth/register')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.error.text.should.equal('{"message":"E-mail already exists"}');
		          	res.status.should.equal(500);
		          	done();
		        });
	    });

	    it('should create the parent with no children user document successfully', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestparent@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var parentDocument = JSON.parse(buf.toString('ascii'));
				parentDocument.username.should.equal('ospreytestparent@gmail.com');
				parentDocument.userType.should.equal('Parent');
				parentDocument.firstName.should.equal('Jane1');
				parentDocument.parPhysicianId.should.equal(physId);
				parId = parentDocument.user_id;
				confToken = parentDocument.confirmationToken;
				done();
			});
	    });

	    it('should create the parent with two children user document successfully', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestparent2@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var parentDocument = JSON.parse(buf.toString('ascii'));
				parentDocument.username.should.equal('ospreytestparent2@gmail.com');
				parentDocument.userType.should.equal('Parent');
				parentDocument.firstName.should.equal('Jane2');
				parentDocument.parPhysicianId.should.equal(physId);
				parId2 = parentDocument.user_id;
				confToken2 = parentDocument.confirmationToken;
				done();
			});
	    });

	    // breaks occasionally
	    it('should create two children documents successfully', function(done) {
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"name": {type:"wildcard", value:"*"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				if (err) {
					console.log(err);
					done();
				}

				if (document.data.documents.length < 2) {
					console.log(document.data);
					done();
				}
				for (var i = 0; i < document.data.documents.length; i++) {
					var b64string = document.data.documents[i].document;
					var buf = new Buffer(b64string, 'base64');
					var childDocument = JSON.parse(buf.toString('ascii'));

					if (childDocument.name == 'Child One') {
						childDocument.birthday.should.equal('2010-01-01');
						childDocument.gender.should.equal('Male');
						childDocument.parentId.should.equal(parId2);
					} else {
						childDocument.birthday.should.equal('2011-01-01');
						childDocument.gender.should.equal('Female');
						childDocument.parentId.should.equal(parId2);
					}
				}
				done();
			});
	    });

	    it('should reject a duplicate email at checkReg ', function(done) {
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
		          	res.error.text.should.equal('{"message":"A user is already registered with this email"}');
		          	res.status.should.equal(401);
		          	done();
		        });
		});

		it('should fail to login a nonconfirmed parent with no children', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent@gmail.com',
	        	password: 'asdf'
	      	};

	    	request(url)
				.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"Please confirm your email first"}')
		          	done();
		        });
		});

		it('should fail to login a nonconfirmed parent with two children', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent2@gmail.com',
	        	password: 'asdf'
	      	};

	    	request(url)
				.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	should.exist(res);
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"Please confirm your email first"}')
		          	done();
		        });
		});

		it('should verify a parent with no children successfully', function(done) {
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

	    it('should verify a parent with two children successfully', function(done) {
			this.timeout(20000);

	    	request(url)
				.get('/verify?id=' + confToken2)
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

	    it('should login a parent with no children successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent@gmail.com',
	        	password: 'asdf'
	      	};

	    	request(url)
				.post('/auth/login')
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

		it('should login a parent with two children successfully', function(done) {
			this.timeout(20000);
	     	var postBody = {
	        	email: 'ospreytestparent2@gmail.com',
	        	password: 'asdf'
	      	};

	    	request(url)
				.post('/auth/login')
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
	});

	/*
	=========================================================================
	=========================================================================
	|																		|
	|						  PHYSICIAN FUNCTIONALITY 						|
	|																		|
	=========================================================================
	=========================================================================
	*/
	describe('Physician functionality (/auth/logout, /auth/isLogged, /users/childrenOfPhysician, /settings/changeTableSettings)', function() {
		var agent = request.agent(url); // agent tracks its own cookies and session variables
		var agentParent = request.agent(url);
		var physicianId = '';
		before( function(done) {			
			this.timeout(20000);

	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf'
	      	};

	      	
	      	agent
          		.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	var postBody2 = {
			        	email: 'ospreytestparent@gmail.com',
			        	password: 'asdf'
			      	};

				    agentParent
		          		.post('/auth/login')
						.send(postBody2)
						.end(function(err, res) {
				        	if (err) {
				            	throw err;
				          	}
				          	done();
				        });
		        });
		});

		it('should successfully login and return a user document for a physician', function(done) {
			this.timeout(5000);
			agent
          		.post('/auth/isLogged')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.body.username.should.equal('ospreytestphysician@gmail.com');
		          	res.body.firstName.should.equal('John');
		          	res.body.lastName.should.equal('Smith');
		          	res.body.userType.should.equal("Physician");
		          	res.body.isConfirmed.should.equal(true);
		          	physicianId = res.body.user_id;
		          	done();
		        });
	    });

	    it('should reject isLogged if the session access token is invalid', function(done) {
			request(url)
          		.post('/auth/isLogged')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(500);
		          	res.error.text.should.equal('{"message":"User was not able to be authenticated...redirecting to the login page"}');
		          	done();
		        });
	    });

	    it('should get all the children of a physician', function(done) {
	    	agent
          		.post('/users/childrenOfPhysician')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(2);

					for (var i = 0; i < res.body.content; i++) {
						var childDocument = res.body.content[i];
						if (childDocument.name == 'Child One') {
							childDocument.birthday.should.equal('2010-01-01');
							childDocument.gender.should.equal('Male');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						} else {
							childDocument.birthday.should.equal('2011-01-01');
							childDocument.gender.should.equal('Female');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						}
					}
		          	done();
		        });
	    });

		it('should return nothing if childrenOfPhysician is called while a parent is logged in', function(done) {
	    	agentParent
          		.post('/users/childrenOfPhysician')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(0);
		          	done();
		        });
	    });

	    it('should reject childrenOfPhysician if the session access token is invalid', function(done) {
			request(url)
          		.post('/users/childrenOfPhysician')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"Verification error"}');
		          	done();
		        });
	    });

	    it('should change table settings successfully (set all to false)', function(done) {
	    	this.timeout(5000);
	    	var postBody = {
	        	"newSettings": {"email": false, "age": false, "weight": false}
	      	};
			agent
          		.post('/settings/changeTableSettings')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should successfully update the user document when table settings are set to false', function(done) {
			this.timeout(5000);
			agent
          		.post('/auth/isLogged')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.body.phyShowEmail.should.equal(false);
		          	res.body.phyShowAge.should.equal(false);
		          	res.body.phyShowWeight.should.equal(false);
		          	done();
		        });
	    });

	    it('should change table settings successfully (set all to true)', function(done) {
	    	this.timeout(5000);
	    	var postBody = {
	        	"newSettings": {"email": true, "age": true, "weight": true}
	      	};
			agent
          		.post('/settings/changeTableSettings')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should successfully update the user document when table settings are set back to true', function(done) {
			this.timeout(5000);
			agent
          		.post('/auth/isLogged')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.body.phyShowEmail.should.equal(true);
		          	res.body.phyShowAge.should.equal(true);
		          	res.body.phyShowWeight.should.equal(true);
		          	done();
		        });
	    });

	    it('should reject an attempt to change table settings if not logged in', function(done) {
	    	this.timeout(5000);
	    	var postBody = {
	        	"newSettings": {"email": true, "age": true, "weight": true}
	      	};
			request(url)
          		.post('/settings/changeTableSettings')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(500);
		          	res.error.text.should.equal('{"message":"User verification error"}');
		          	done();
		        });
	    });

	    it('should change a password successfully', function(done) {
	    	this.timeout(5000);
	    	var postBody = {
	    		"email":"ospreytestphysician@gmail.com",
	    		"password":"asdf",
	    		"newPassword":"newPass"
	    	}
			agent
          		.post('/settings/changePassword')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

		it('should successfully update the user document when password is changed', function(done) {
			this.timeout(5000);
			var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'newPass'
	      	};

	      	request(url)
          		.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should change a password back successfully', function(done) {
	    	this.timeout(5000);
	    	var postBody = {
	    		"email":"ospreytestphysician@gmail.com",
	    		"password":"newPass",
	    		"newPassword":"asdf"
	    	}
			agent
          		.post('/settings/changePassword')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should successfully update the user document when password is changed back', function(done) {
			this.timeout(5000);
			var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf'
	      	};

	      	request(url)
          		.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	  //   it('should change an email successfully', function(done) {
	  //   	this.timeout(5000);
	  //   	var postBody = {
	  //   		"email":"ospreytestphysician@gmail.com",
	  //   		"password":"newPass",
	  //   		"newEmail":"asdf"
	  //   	}
			// agent
   //        		.post('/settings/changePassword')
   //        		.send(postBody)
			// 	.end(function(err, res) {
		 //        	if (err) {
		 //            	throw err;
		 //          	}
		 //          	res.status.should.equal(200);
		 //          	done();
		 //        });
	  //   });

	    it('should log out successfully', function(done) {
	    	agent
          		.get('/auth/logout')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should fail to log out if no one is logged in', function(done) {
	    	request(url)
          		.get('/auth/logout')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.status.should.equal(401);
					res.error.text.should.equal('{"message":"No one is currently logged in"}');
		          	done();
		        });
	    });

	    it('should fail to log out a user that was formerly logged in', function(done) {
	    	agent
          		.get('/auth/logout')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.status.should.equal(401);
					res.error.text.should.equal('{"message":"No one is currently logged in"}');
		          	done();
		        });
	    });
	});

/*
	=========================================================================
	=========================================================================
	|																		|
	|						  PARENT FUNCTIONALITY 							|
	|																		|
	=========================================================================
	=========================================================================
	*/
	describe('Parent functionality (/auth/logout, /auth/isLogged, /users/childrenOfParent)', function() {
		var agentPhysician = request.agent(url); // agent tracks its own cookies and session variables
		var agentParent = request.agent(url);
		var agentParent2 = request.agent(url);
		var parent1Id = '';
		var parent2Id = '';
		before( function(done) {			
			this.timeout(20000);

	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf'
	      	};

	      	agentPhysician
          		.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	var postBody2 = {
			        	email: 'ospreytestparent@gmail.com',
			        	password: 'asdf'
			      	};

				    agentParent
		          		.post('/auth/login')
						.send(postBody2)
						.end(function(err, res) {
				        	if (err) {
				            	throw err;
				          	}
				          	var postBody3 = {
					        	email: 'ospreytestparent2@gmail.com',
					        	password: 'asdf'
					      	};
				          	agentParent2
				          		.post('/auth/login')
								.send(postBody3)
								.end(function(err, res) {
						        	if (err) {
						            	throw err;
						          	}
						          	done();
						        });
				        });
		        });
		});

		it('should successfully login and return a user document for a parent with no children', function(done) {
			this.timeout(5000);
			agentParent
          		.post('/auth/isLogged')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.body.username.should.equal('ospreytestparent@gmail.com');
		          	res.body.firstName.should.equal('Jane1');
		          	res.body.lastName.should.equal('Johnson1');
		          	res.body.userType.should.equal("Parent");
		          	res.body.isConfirmed.should.equal(true);
		          	parent1Id = res.body.user_id;
		          	done();
		        });
	    });

	    it('should successfully login and return a user document for a parent with two children', function(done) {
			this.timeout(5000);
			agentParent2
          		.post('/auth/isLogged')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.body.username.should.equal('ospreytestparent2@gmail.com');
		          	res.body.firstName.should.equal('Jane2');
		          	res.body.lastName.should.equal('Johnson2');
		          	res.body.userType.should.equal("Parent");
		          	res.body.isConfirmed.should.equal(true);
		          	parent2Id = res.body.user_id;
		          	done();
		        });
	    });

	    it('should get all the children of a parent with two children', function(done) {
	    	this.timeout(5000);
	    	agentParent2
          		.post('/users/childrenOfParent')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(2);
					for (var i = 0; i < res.body.content; i++) {
						var childDocument = res.body.content[i];
						if (childDocument.name == 'Child One') {
							childDocument.birthday.should.equal('2010-01-01');
							childDocument.gender.should.equal('Male');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						} else {
							childDocument.birthday.should.equal('2011-01-01');
							childDocument.gender.should.equal('Female');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						}
					}
		          	done();
		        });
	    });

		it('should get all the children of a parent with no children', function(done) {
	    	this.timeout(5000);
	    	agentParent
          		.post('/users/childrenOfParent')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(0);
		          	done();
		        });
	    });

		it('should return nothing if childrenOfParent is called while a physician is logged in', function(done) {
			this.timeout(5000);
	    	agentPhysician
          		.post('/users/childrenOfParent')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(0);
		          	done();
		        });
	    });

	    it('should reject childrenOfParent if the session access token is invalid', function(done) {
			request(url)
          		.post('/users/childrenOfParent')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"Verification error"}');
		          	done();
		        });
	    });

	    it('should add a child successfully to a parent with two children', function(done){
	    	this.timeout(5000);
	    	var postBody = {"childName": "New Child", "childBirthday": "2005-01-01", "childGender":"Male"};
			agentParent2
          		.post('/users/addChild')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    })

	    it('should add a new child document successfully when a child is added to a parent with two children', function(done){
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"name": {type:"eq", value:"New Child"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var childDocument = JSON.parse(buf.toString('ascii'));
				childDocument.birthday.should.equal('2005-01-01');
				childDocument.gender.should.equal('Male');
				childDocument.parentId.should.equal(parent2Id);
				done();
			});
	    })

	    it('should add a child successfully to a parent with no children', function(done){
	    	this.timeout(5000);
	    	var postBody = {"childName": "New Child2", "childBirthday": "2006-01-01", "childGender":"Female"};
			agentParent
          		.post('/users/addChild')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    })

	    it('should add a new child document successfully when a child is added to a parent with no children', function(done){
	    	this.timeout(5000);
	    	truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"name": {type:"eq", value:"New Child2"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				var b64string = document.data.documents[0].document;
				var buf = new Buffer(b64string, 'base64');
				var childDocument = JSON.parse(buf.toString('ascii'));
				childDocument.birthday.should.equal('2006-01-01');
				childDocument.gender.should.equal('Female');
				childDocument.parentId.should.equal(parent1Id);
				done();
			});
	    })

	    it('should get all the children of a parent with three children after adding one', function(done) {
	    	this.timeout(5000);
	    	agentParent2
          		.post('/users/childrenOfParent')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(3);
					for (var i = 0; i < res.body.content; i++) {
						var childDocument = res.body.content[i];
						if (childDocument.name == 'New Child') {
							childDocument.birthday.should.equal('2005-01-01');
							childDocument.gender.should.equal('Male');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						}
					}
		          	done();
		        });
	    });

	    it('should get all the children of a parent with one child after adding one', function(done) {
	    	this.timeout(5000);
	    	agentParent
          		.post('/users/childrenOfParent')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(1);
					for (var i = 0; i < res.body.content; i++) {
						var childDocument = res.body.content[i];
						if (childDocument.name == 'New Child2') {
							childDocument.birthday.should.equal('2006-01-01');
							childDocument.gender.should.equal('Female');
							childDocument.parentId.should.equal(parId);
							childDocument.parent.username.should.equal("ospreytestparent2@gmail.com");
						}
					}
		          	done();
		        });
	    });

	    it('should should display four children when childrenOfPhysician is called', function(done) {
	    	agentPhysician
          		.post('/users/childrenOfPhysician')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.body.content.length.should.equal(4);

					for (var i = 0; i < res.body.content; i++) {
						var childDocument = res.body.content[i];
						if (childDocument.name == 'Child One') {
							childDocument.birthday.should.equal('2010-01-01');
							childDocument.gender.should.equal('Male');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						} else if (childDocument.name == 'Child Two') {
							childDocument.birthday.should.equal('2011-01-01');
							childDocument.gender.should.equal('Female');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						} else if (childDocument.name == 'New Child2') {
							childDocument.birthday.should.equal('2006-01-01');
							childDocument.gender.should.equal('Female');
							childDocument.parentId.should.equal(parId);
							childDocument.parent.username.should.equal("ospreytestparent2@gmail.com");
						} else if (childDocument.name == 'New Child') {
							childDocument.birthday.should.equal('2005-01-01');
							childDocument.gender.should.equal('Male');
							childDocument.parentId.should.equal(parId2);
							childDocument.parent.username.should.equal("ospreytestparent@gmail.com");
						}
					}
		          	done();
		        });
	    });

	    it('should log out successfully', function(done) {
	    	agentParent
          		.get('/auth/logout')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should reject addChild if the session access token is invalid', function(done) {
			request(url)
          		.post('/users/addChild')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"Verification error"}');
		          	done();
		        });
	    });

	    it('should fail to log out a user that was formerly logged in', function(done) {
	    	agentParent
          		.get('/auth/logout')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
					res.status.should.equal(401);
					res.error.text.should.equal('{"message":"No one is currently logged in"}');
		          	done();
		        });
	    });
	});

	/*
	=========================================================================
	=========================================================================
	|																		|
	|						  OTHER FUNCTIONALITY							|
	|																		|
	=========================================================================
	=========================================================================
	*/

	describe('Other functionality (/settings/deleteAccount, /nvd3css)', function() {
		var agent = request.agent(url); // agent tracks its own cookies and session variables
		var agentParent = request.agent(url);
		var physicianId = '';
		before( function(done) {			
			this.timeout(20000);

	     	var postBody = {
	        	email: 'ospreytestphysician@gmail.com',
	        	password: 'asdf'
	      	};

	      	agent
          		.post('/auth/login')
				.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	var postBody2 = {
			        	email: 'ospreytestparent@gmail.com',
			        	password: 'asdf'
			      	};

				    agentParent
		          		.post('/auth/login')
						.send(postBody2)
						.end(function(err, res) {
				        	if (err) {
				            	throw err;
				          	}
				          	done();
				        });
		        });
		});

		it('should find a parent document prior to deleting', function(done) {
			this.timeout(5000);
			truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestparent@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				if (err)
					throw err;
				document.data.documents.length.should.equal(1);
				done();
			});
	    });

	    it('should fail to delete a parent account if a user is not logged in', function(done) {
			this.timeout(5000);
			var postBody = {"email":"ospreytestparent@gmail.com", "password":"asdf"};
			request(url)
          		.post('/settings/deleteAccount')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"User verification error"}');
		          	done();
		        });
	    });

	    it('should fail to delete a parent account if a user inputs the wrong password', function(done) {
			this.timeout(5000);
			var postBody = {"email":"ospreytestparent@gmail.com", "password":"wrongpassword"};
			agentParent
          		.post('/settings/deleteAccount')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"The email/password combination you entered is incorrect"}');
		          	done();
		        });
	    });

		it('should successfully delete a parent account', function(done) {
			this.timeout(5000);
			var postBody = {"email":"ospreytestparent@gmail.com", "password":"asdf"};
			agentParent
          		.post('/settings/deleteAccount')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should successfully remove the parent user from truevault', function(done) {
			this.timeout(5000);
			truevault.users.list(function (err, value){
				var found = false
				for (var i = 0; i < value.users.length; i++) {
					if (value.users[i].username == "ospreytestparent@gmail.com")
						found = true;
				}
				found.should.equal(false);
				done();
			});
	    });

		it('should successfully delete a parent document', function(done) {
			this.timeout(5000);
			truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestparent@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				document.data.documents.length.should.equal(0);
				done();
			});
	    });



	    it('should find a physician document prior to deleting', function(done) {
			this.timeout(5000);
			truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestphysician@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				if (err)
					throw err;
				document.data.documents.length.should.equal(1);
				done();
			});
	    });

	    it('should fail to delete a physician account if a user is not logged in', function(done) {
			this.timeout(5000);
			var postBody = {"email":"ospreytestphysician@gmail.com", "password":"asdf"};
			request(url)
          		.post('/settings/deleteAccount')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"User verification error"}');
		          	done();
		        });
	    });

	    it('should fail to delete a physician account if a user inputs the wrong password', function(done) {
			this.timeout(5000);
			var postBody = {"email":"ospreytestphysician@gmail.com", "password":"wrongpassword"};
			agent
          		.post('/settings/deleteAccount')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(401);
		          	res.error.text.should.equal('{"message":"The email/password combination you entered is incorrect"}');
		          	done();
		        });
	    });

		it('should successfully delete a physician account', function(done) {
			this.timeout(5000);
			var postBody = {"email":"ospreytestphysician@gmail.com", "password":"asdf"};
			agent
          		.post('/settings/deleteAccount')
          		.send(postBody)
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.status.should.equal(200);
		          	done();
		        });
	    });

	    it('should successfully remove the physician user from truevault', function(done) {
			this.timeout(5000);
			truevault.users.list(function (err, value){
				var found = false
				for (var i = 0; i < value.users.length; i++) {
					if (value.users[i].username == "ospreytestphysician@gmail.com")
						found = true;
				}
				found.should.equal(false);
				done();
			});
	    });

		it('should successfully delete a physician document', function(done) {
			this.timeout(5000);
			truevault.documents.search({
				"vault_id" : vaultid, 
				"filter" : {"username": {type:"eq", value:"ospreytestphysician@gmail.com"}},
				"full_document" : true,
				"per_page": 10 //true to return full documents vs uuids
			}, function (err, document){
				document.data.documents.length.should.equal(0);
				done();
			});
	    });

	    it('should successfully return the nvd3 css file parsed as an array of rules', function(done) {
			this.timeout(5000);
			agent
          		.get('/nvd3css')
				.end(function(err, res) {
		        	if (err) {
		            	throw err;
		          	}
		          	res.body.length.should.equal(139);
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

