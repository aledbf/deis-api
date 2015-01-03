var request = require('request-json');
var format = require('util').format;

global.noop = function noop() {};

module.exports = function Deis(configuration) {
  this._token = null;
  this._authenticated = false;

  // Check for configuration.
  if (!configuration) {
    throw new ReferenceError('Deis API require a configuration');
  }

  // Check we got required config properties.
  if (!configuration.hasOwnProperty('controller')) {
    throw ReferenceError('Deis API configuration requires controller property.');
  }

  if (!configuration.hasOwnProperty('username')) {
    throw ReferenceError('Deis API configuration requires username property');
  }

  if (!configuration.hasOwnProperty('password')) {
    throw ReferenceError('Deis API configuration requires password property');
  }

  this.protocol = configuration.secure ? 'https' : 'http';

  this.controller = configuration.controller;

  this.version = configuration.version ? 'v' + configuration.version : 'v1';

  this.client = request.newClient(format('%s://%s', this.protocol, this.controller));

  this.__defineGetter__('username', function() {
    return configuration.username;
  });

  this.__defineGetter__('password', function() {
    return configuration.password;
  });

  var deis = this;

  this.__defineGetter__('authenticated', function() {
    return deis._authenticated;
  });

  this.__defineSetter__('token', function(new_value) {
    if (new_value) {
      deis._token = new_value;
      deis._authenticated = true;
    } else {
      deis._token = null;
      deis._authenticated = false;
    }
  });

  // public interface
  this.api = {
    register: require('./lib/register')(deis),
    login: require('./lib/login')(deis),
    logout: require('./lib/logout')(deis),
    user: require('./lib/user')(deis),
    apps: require('./lib/apps')(deis),
    ps: noop,
    config: require('./lib/config')(deis),
    domains: noop,
    builds: noop,
    limits: noop,
    tags: noop,
    releases: require('./lib/releases')(deis),
    keys: noop,
    perms: noop
  };

  this.api.__defineGetter__('username', function() {
    return configuration.username;
  });

  this.api.__defineGetter__('password', function() {
    return configuration.password;
  });

  this.api.__defineGetter__('token', function() {
    if (deis._token) {
      return deis._token;
    } else {
      return null;
    }
  });

  this.api.__defineGetter__('authenticated', function() {
    return deis._authenticated;
  });

  return this.api;
};
