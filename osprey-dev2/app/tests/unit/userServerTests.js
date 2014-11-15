'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = require('../../models/user');

/**
 * Globals
 */
var user, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		User.remove().exec(function(err) {
			done();
		});
	});

	beforeEach(function(done) {
		user = new User({
			email: 'test@test.com',
			password: 'password',
			userType: 'Parent'
		});

		user2 = new User({
			email: 'test@test.com',
			password: 'password',
			userType: 'Parent'
		});

		user3 = new User({
			email: 'abc@testtest.com',
			password: '12345', 
			userType: 'Parent'
		}); 

		done();
	})

	describe('Method Save', function() {

		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		// saves user
		it('should be able to save without problems', function(done) {
			user.save(function(err) {
				if (err)
					throw err; 

				User.findOne({ email : user.email }, function(err, user1) {
					should.exist(user1);  
					done(); 
				});
			});
			
		});

		// fails to save user2
		it('should fail to save an existing user again', function(done) {
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		// saves user with a blank email
		it('should be able to throw an error when trying to save a user with an empty email', function(done) {
			user.email = ' ';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		// saves user with weird email and no password
		it('should be able to throw an error when trying to save a user with an empty password', function(done) {
			user.email = 'alskdfals@asdf.com';
			user.password = ' '; 

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		}); 

		// saves user with undefined values
		it('should fail to save a user with undefined values', function(done) {
			user.email = undefined; 
			user.password = undefined; 

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should not save a users unhashed password in the database', function(done) {
			var oldPassword = user3.password; 

			// generate hashed password 
			user3.password = user3.generateHash(user3.password); 

			user3.save(function(err) {
				User.findOne({ email : user3.email }, function(err, user) {
					user.password.should.not.equal(oldPassword); 
					done(); 
				});
			}); 
		});


		it('should correctly save the user type of a Parent in the database', function(done) {
			var newUser = new User();
			newUser.email = 'abc@123.com';
			newUser.password = 'p12345'; 
			newUser.userType = 'Parent';

			newUser.save(function(err) {
				User.findOne({ email : newUser.email }, function(err, savedUser) {
					savedUser.userType.should.equal('Parent'); 
					done(); 
				}); 
			}); 
		});

		it('should correctly save the user type of a Physician in the database', function(done) {
			var newUser = new User();
			newUser.email = 'abc@1234.com';
			newUser.password = '12345'; 
			newUser.userType = 'Physician';
			newUser.save(function(err) {
				User.findOne({ email : newUser.email }, function(err, savedUser) {
					savedUser.userType.should.equal('Physician'); 
					done(); 
				}); 
			}); 
		});

		it('should fail to save a user with a user type of neither Parent nor Physician', function(done) {
			var newUser = new User();
			newUser.email = 'abcd@123.com';
			newUser.password = '12345'; 
			newUser.userType = 'Person';
			newUser.save(function(err) {
				should.exist(err);
				done();
			}); 
		});

		it('should fail to save a user with no @ in their e-mail adddress', function(done) {
			var newUser = new User();
			newUser.email = 'abcd123.com';
			newUser.password = '12345'; 
			newUser.userType = 'Physician';
			newUser.save(function(err) {
				should.exist(err);
				done();
			}); 
		});

		it('should fail to save a user with no . in their e-mail adddress', function(done) {
			var newUser = new User();
			newUser.email = 'abcd123com';
			newUser.password = '12345'; 
			newUser.userType = 'Physician';
			newUser.save(function(err) {
				should.exist(err);
				done();
			}); 
		});

		it('should fail to save a user with more than 4 characters after the . in their email address', function(done) {
			var newUser = new User();
			newUser.email = 'abcd1@asd.23com';
			newUser.password = '12345'; 
			newUser.userType = 'Physician';
			newUser.save(function(err) {
				should.exist(err);
				done();
			}); 
		});

		it('should fail to save a user with no characters between the @ and the . in their email address', function(done) {
			var newUser = new User();
			newUser.email = 'abcd1@asd.23com';
			newUser.password = '12345'; 
			newUser.userType = 'Physician';
			newUser.save(function(err) {
				should.exist(err);
				done();
			}); 
		});

	});
	//this deletes all users !!! so comment out if you dont want this 2 happen
	// after(function(done) {
	// 	User.remove().exec();
	// 	done();
	// });
});