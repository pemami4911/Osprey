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
	});

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


		it('should correctly save the user type of a user type in the database', function(done) {

			user.email = 'abc@123.com';
			user.email = '12345'; 

			user.save(function(err) {
				User.findOne({ email : user.email }, function(err, user) {
					user.userType.should.equal('Parent'); 
					done(); 
				}); 
			}); 
		});

	});


	//this deletes all users !!! so comment out if you dont want this 2 happen
	after(function(done) {
		User.remove().exec();
		done();
	});
});