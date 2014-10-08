'use strict';

var passport = require('passport');
var UserModel = require('./models/user');

module.exports = function(app) {
	// api ---------------------------------------------------------------------
	app.post('/auth/login', passport.authenticate('local'), function(req, res) {
	    res.send("");
	});

	// // create todo and send back all todos after creation

	app.get('/', function (req, res) {
	    res.send(req);
	});

	app.post('/auth/register', function(req, res) {
    	UserModel.register(new UserModel({ 
    		email : req.body.email, 
    		userType: req.body.userType 
    	}), req.body.password, function(err, account) {
    		console.log(account);
	        if (err) {
	            return res.send(err);
	        }
	        console.log("reg");
        	passport.authenticate('local', function (req, res) {
        		console.log("auth");
        		UserModel.find(function(err, user) {
        			console.log(err, user);
					if (err)
						res.send(err);
					res.send(user);
				});
          		res.redirect('/');
        	});
    	});
  	});
	
	app.post('/auth/checkReg', function(req, res) {
		// use mongoose to get all todos in the database
		UserModel.count({email : req.body.email}, function(err, count) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(count); // return all todos in JSON format
		});
	});

};