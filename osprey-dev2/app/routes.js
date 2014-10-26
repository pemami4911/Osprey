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

	// adding log-out functionality 
	app.get('/auth/logout', function(req, res) {
		if (req.isAuthenticated()) {
  				req.logout();	
   				return res.send("Logged out successfully");
  		}
  		else {
  			return res.send("Failed to log out successfully");
  		}
	});

	app.post('/auth/register', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
		    if (err) { 
		    	console.log("sending error");
		    	console.log(err);
		    	return next(err); 
		    }
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

	app.post('/auth/isLogged', function(req, res) {
		// use mongoose to get all todos in the database
		if (req.isAuthenticated()) {
			res.send(req.user);
		} else {
			res.send(false);
		}
	});

	app.post('/auth/changeEmail', function(req, res) {
		// use mongoose to get all todos in the database
		UserModel.update({email: req.body.user.email}, {email: req.body.newEmail}, {}, function(err, result) {
			if (err) {
				console.log("error" + err);
				res.send(err);
			}
			res.json(result);
		});
	});

	app.post('/auth/changePassword', function(req, res) {
		// use mongoose to get all todos in the database
		console.log(req.password);
		console.log(req.body);
		UserModel.update({email: req.body.user.email}, {password: UserModel.generateHash(req.body.newPassword)}, {}, function(err, result) {
			if (err) {
				console.log("error" + err);
				res.send(err);
			}

			res.json(result);
		});
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
