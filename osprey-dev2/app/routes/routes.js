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
 
'use strict';

module.exports = function(app, vault) {
	var path = require('path');
	var fs = require('fs');
	var css = require('css');
	var api_key = '24099371-9eb8-4c1d-8a39-5f64b6a52c1b';
	var vaultid = vault;

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
	var host = '104.236.30.199:8080'; 

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

	// used to test new functionality
	app.post('/debug/test', function(req, res, next) {
		Debug.generateFitbit(req, res);
	});

	app.post('/debug/deleteTestUser', function(req, res, next) {
		Debug.deleteTestUser(req, res);
	});

	app.post('/debug/clearVault', function(req, res, next) {
		Debug.clearVault(req, res);
	});
	app.post('/debug/clearUser', function( req, res ) {
		Debug.clearUser( req, res ); 
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
	app.post('/auth/forgotPassword', function(req, res) {
		Auth.forgotPassword(req, res); 
	});
	app.post('/settings/deleteAccount', function(req, res) {
		Settings.deleteAccount(req, res); 
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

	app.post('/users/childrenOfParent', function(req, res) {
		Users.childrenOfParent(req, res);
	});

	app.post('/users/childrenOfPhysician', function(req, res) {
		Users.childrenOfPhysician(req, res);
	});

	app.post('/users/addChild', function(req, res) {
		Users.addChild(req, res);
	});

	app.post('/test/test', function(req, res) {
		res.status(200).json({"hi":"hi"});
	});

	app.get('/nvd3css', function(req, res){
		fs.readFile(path.resolve('./public/lib/d3/nv.d3.css'), 'utf8', function(err, data){
			var obj = css.parse(data);
			res.send(obj.stylesheet.rules);
		});
	});
};

