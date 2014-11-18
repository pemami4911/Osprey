'use strict';

var Resource = require('../resource');
var util = require('util');

function Users() {
  Users.super_.apply(this, arguments);
}

util.inherits(Users, Resource);


// Retrieves all users
//
// callback is optional, this method returns a q promise
Users.prototype.list = function(callback) {

  var path = util.format("/%s/users",
    this.truevault.getOption('api_version')
  );

  return this.httpsRequest({
    path : path,
    method : 'GET',
    callback : callback
  });

};

// Creates a user
//
// options.vault_id - vault uuid
// options.schema - a javascript object
// callback is optional, this method returns a q promise
Users.prototype.create = function(options, callback) {
  var path = util.format("/%s/users",
    this.truevault.getOption('api_version')
  );

  var data = {
    username : options.username,
    password: options.password,
  };

  return this.httpsRequest({
    path : path,
    method : 'POST',
    data : data,
    callback : callback
  });

};


// Retrieves a schema from the specified vault
//
// options.vault_id - vault uuid
// options.id - schema uuid
// callback is optional, this method returns a q promise
Users.prototype.retrieve = function(options, callback) {

  var path = util.format("/%s/users/%s",
    this.truevault.getOption('api_version'),
    options.user_id
  );

  return this.httpsRequest({
    path : path,
    method : 'GET',
    callback : callback
  });

};



module.exports = Users;