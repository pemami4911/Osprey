'use strict';

var Resource = require('../resource');
var util = require('util');

function Auth() {
  Auth.super_.apply(this, arguments);
}

util.inherits(Auth, Resource);


Auth.prototype.login = function(options, callback) {
  var path = util.format("/%s/auth/login",
    this.truevault.getOption('api_version')
  );

  var data = {
    username : options.username,
    password: options.password,
    account_id: options.account_id
  };

  return this.httpsRequest({
    path : path,
    method : 'POST',
    data : data,
    callback : callback
  });

};

Auth.prototype.logout = function(callback) {
  var path = util.format("/%s/auth/logout",
    this.truevault.getOption('api_version')
  );

  return this.httpsRequest({
    path : path,
    method : 'POST',
    callback : callback
  });

};

Auth.prototype.verify = function(callback) {

  var path = util.format("/%s/auth/me",
    this.truevault.getOption('api_version')
  );

  return this.httpsRequest({
    path : path,
    method : 'GET',
    callback : callback
  });

};

module.exports = Auth;