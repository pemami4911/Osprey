'use strict';

var passport = require('passport');
var UserModel = require('./models/user');
var EmailLogModel = require('./models/emaillog');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var css = require('css');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ospreytester@gmail.com',
        pass: 'mypasstest1'
    }
});

module.exports = function(app) {
	// api ---------------------------------------------------------------------
	app.post('/auth/login', function(req, res, next) {
	  	passport.authenticate('local-login', function(err, user, info) {

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
		UserModel.count({email : req.body.email}, function(err, count) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(count);
		});
	});

	app.post('/auth/isLogged', function(req, res) {
		if (req.isAuthenticated()) {
			res.send(req.user);
		} else {
			res.send(false);
		}
	});

	app.post('/users/unassignedParents', function(req, res) {
		if (!req.isAuthenticated())
			res.send(false);
		
		UserModel.find({ $and: [{userType : "Parent"}, {physician: null}] }, function(err, data) {
			console.log(data);
			res.send(data);
		});
	});

	app.post('/settings/changeEmail', function(req, res) {
		if (!req.isAuthenticated())
			res.send(false);
		UserModel.update({email: req.body.user.email}, {email: req.body.newEmail}, {}, function(err, result) {
			if (err) {
				console.log("error" + err);
				res.send(err);
			}
			sendEmail(req.body.newEmail, "E-mail changed!", "You have changed your e-mail address!");
			res.json(result);
		});
	});

	app.post('/settings/changePassword', function(req, res) {
		if (!req.isAuthenticated())
			res.send(false);
		UserModel.update({email: req.body.user.email}, {password: UserModel.generateHash(req.body.newPassword)}, {}, function(err, result) {
			if (err) {
				console.log("error" + err);
				res.send(err);
			}
			sendEmail(req.body.user.email, "Password changed!", "You have changed your password!");
			res.json(result);
		});
	});

	app.post('/settings/changeTableSettings', function(req, res) {
		if (!req.isAuthenticated())
			res.send(false);
		UserModel.update({email: req.body.user.email}, {
			$set: {'tableSettings.showEmail':req.body.newSettings.email, 
			'tableSettings.showAge':req.body.newSettings.age, 
			'tableSettings.showWeight':req.body.newSettings.weight}

			}, {}, function(err, result) {
				if (err) {
					console.log("error" + err);
					res.send(err);
				}

				res.json(result);
		});
	});

	app.get('/nvd3css', function(req, res){
		if (!req.isAuthenticated())
			res.send(false);
		fs.readFile(path.resolve('./public/lib/d3/nv.d3.css'), 'utf8', function(err, data){
			var obj = css.parse(data);
			res.send(obj.stylesheet.rules);
		});
	});
	
	
};

function sendEmail(recipient, subject, message) {
	transporter.sendMail({
	    from: 'ospreytester@gmail.com',
	    to: recipient,
	    subject: subject,
	    text: message
	}, function(err, info){
		var newLog = new EmailLogModel();
		newLog.timestamp = Date();
		if (err)
			newLog.data = err;
		else
			newLog.data = info;
		newLog.save(function(err) {
            if (err) {
                console.log(err);
            }
        });
	});
}
