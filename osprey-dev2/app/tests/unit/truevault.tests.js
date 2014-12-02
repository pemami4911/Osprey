var app  = require('../../../server.js');
var http = require('http');

var request = require('supertest');
var should = require('should'); 
var assert = require('assert');


var sessionCookie = null;


describe('mocha unit tests', function () {
	var url = 'localhost:8080'; 

	// 10 second wait to load all schemas
	before( function(done) {
		this.timeout(3000);
		setTimeout(function(){
			console.log("Starting tests");
            done();
        }, 2500);
	})

	describe('/auth/register', function() {
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
		          	// console.log(res);
		          	res.status.should.equal(200);
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
		          	// console.log(res);
		          	res.status.should.equal(500);
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

