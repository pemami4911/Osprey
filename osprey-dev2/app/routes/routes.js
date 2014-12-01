'use strict';

var path = require('path');
var fs = require('fs');
var css = require('css');
var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
var vaultid = 'b51db608-3321-41dd-9531-bfc40c1f5c27'; //nick-dev

var config = require('../config/init'); 
var truevault = require('../../truevault/lib/truevault.js')(api_key);

// global variables used to store uuids of schemas
// default value of 0
var globals = {
	userSchemaId: 0,
	childSchemaId: 0,
	fitbitSchemaId: 0,
	inviteCodeSchemaId: 0,
	accountId: 0			// stores account id
};

// set this to our domain for security 
var host = 'localhost:8080'; 

var AuthModule = require('./auth');
var Auth = new AuthModule(globals, api_key, vaultid);
var SettingsModule = require('./settings'); 
var Settings = new SettingsModule(globals, api_key, vaultid); 
var UsersModule = require('./users'); 
var Users = new UsersModule(globals, api_key, vaultid); 
var DebugModule = require('./debug'); 
var Debug = new DebugModule(globals, api_key, vaultid); 

// -----------------------------------------------------------------------------

config.initialize(globals, api_key, vaultid);

// -----------------------------------------------------------------------------

module.exports = function(app) {

	// used to test new functionality
	app.post('/debug/test', function(req, res, next) {
		Users.childrenOfPhysician(req, res);
	});
	app.post('/auth/login', function(req, res, next) {
		Auth.login(req, res);						
	});
	app.post('/auth/register', function(req, res, next) {
		Auth.register(req, res);
	});
	app.get('/verify',function(req,res){
		Auth.verify(req, res);
	});
	app.post('/auth/checkReg', function(req, res) {
		Auth.checkReg(req, res);
	});
	app.get('/auth/logout', function(req, res) {
		Auth.logout(req, res);
	});
	app.post('/auth/isLogged', function(req, res) {	
		Auth.isLogged(req, res);
	});

	app.post('/settings/changeTableSettings', function( req, res) {
		Settings.changeTableSettings( req, res ); 
	}); 

	app.post('/settings/generateInvite', function( req, res) {
		Settings.generateInvite( req, res ); 
	}); 

	app.post('/settings/changeEmail', function( req, res ) {
		Settings.changeEmail( req, res ); 
	});

	app.post('/settings/changePassword', function( req, res) {
		Settings.changePassword( req, res ); 
	});

	app.get('/users/unassignedParents', function(req, res) {
		Users.unassignedParents(req, res);
	 });

	app.post('/users/childrenOfParent', function(req, res) {
		Users.childrenOfParent(req, res);
	});

	app.post('/users/childrenOfPhysician', function(req, res) {
		Users.childrenOfPhysician(req, res);
	});

	app.get('/nvd3css', function(req, res){
		fs.readFile(path.resolve('./public/lib/d3/nv.d3.css'), 'utf8', function(err, data){
			var obj = css.parse(data);
			res.send(obj.stylesheet.rules);
		});
	});
};

