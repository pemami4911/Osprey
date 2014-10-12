'use strict';

var passport = require('passport');
var UserModel = require('./models/user');

module.exports = function(app) {
	// api ---------------------------------------------------------------------
	app.post('/auth/login', function(req, res, next) {
	  	passport.authenticate('local-login', function(err, user, info) {

		  	console.log(user);
		    if (err) { return next(err); }
		    if (!user) { 
		    	return res.send("null"); 
		    }

		    req.logIn(user, function(err) {

			    if (err) { 
			    	return next(err); 
			    }
		    	return res.send(user);
		    });
	  })(req, res, next);
	});
	// // create todo and send back all todos after creation

	app.post('/auth/register', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
			console.log(user);
		    if (err) { return next(err); }
		    if (!user) { 
		    	return res.send("null"); 
		    }

		    req.logIn(user, function(err) {

			    if (err) { 
			    	return next(err); 
			    }
		    	return res.send(user);
		    });
		})(req, res, next);
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

	app.get('/profile', isLoggedIn, function(req, res) {
		res.send("hi");
	});

};

function isLoggedIn(req, res, next) {
	console.log(req.isAuthenticated());
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
