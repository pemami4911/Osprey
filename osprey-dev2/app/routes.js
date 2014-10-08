'use strict';

var UserModel = require('./models/user');

module.exports = function(app) {
	// api ---------------------------------------------------------------------

	app.post('/auth/login', function(req, res) {
		// use mongoose to get all todos in the database
		UserModel.findOne({email : req.body.email, password : req.body.password}, function(err, users) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(users); // return all todos in JSON format
		});
	});

	// // create todo and send back all todos after creation
	app.post('/auth/register', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		UserModel.create({
			email : req.body.email, 
			password : req.body.password,
			userType : req.body.userType, 
			done : false
		}, function(err, user) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			UserModel.find(function(err, user) {
				if (err)
					res.send(err);
				res.send(user);
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