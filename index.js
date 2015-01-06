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
    apps: require('./lib/apps')(deis),
    auth: require('./lib/auth')(deis),
    builds: require('./lib/builds')(deis),
    config: require('./lib/config')(deis),
    domains: require('./lib/domains')(deis),
    keys: noop,
    limits: require('./lib/limits')(deis),
    perms: noop,
    ps: require('./lib/ps')(deis),
    releases: require('./lib/releases')(deis),
    tags: noop
  };

  // mimic the deis cli shortcuts.
  this.api.create = this.api.apps.create;
  this.api.destroy = this.api.apps.destroy;
  this.api.info = this.api.apps.info;
  this.api.login = this.api.auth.login;
  this.api.logout = this.api.auth.logout;
  this.api.logs = this.api.apps.logs;
  this.api.open = this.api.apps.open;
  this.api.passwd = this.api.auth.passwd;
  this.api.pull = this.api.builds.create;
  this.api.register = this.api.auth.register;
  this.api.rollback = this.api.releases.rollback;
  this.api.run = this.api.apps.run;
  this.api.scale = this.api.ps.scale;
  //this.api.sharing    =this.api.perms:list
  // this.api.whoami     =this.api.auth.whoami;

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
