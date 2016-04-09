var request = require('request-json-light');
var format = require('util').format;

module.exports = function Deis(configuration) {
  var deis = this;

  deis._authenticated = false;

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

  deis.protocol = configuration.secure ? 'https' : 'http';

  deis.controller = configuration.controller;

  deis.version = configuration.version ? 'v' + configuration.version : 'v1';

  deis.client = request.newClient(format('%s://%s', deis.protocol, deis.controller));

  Object.defineProperty(deis, 'username', {
    get: function() { return configuration.username; },
    configurable: false
  });

  Object.defineProperty(deis, 'password', {
    get: function() { return configuration.password; },
    configurable: false
  });

  // public interface
  deis.api = {
    apps: require('./lib/apps')(deis),
    auth: require('./lib/auth')(deis),
    builds: require('./lib/builds')(deis),
    config: require('./lib/config')(deis),
    domains: require('./lib/domains')(deis),
    keys: require('./lib/keys')(deis),
    limits: require('./lib/limits')(deis),
    perms: require('./lib/perms')(deis),
    ps: require('./lib/ps')(deis),
    releases: require('./lib/releases')(deis),
    tags: require('./lib/tags')(deis)
  };

  // mimic the deis cli shortcuts.
  deis.api.create = deis.api.apps.create;
  deis.api.destroy = deis.api.apps.destroy;
  deis.api.info = deis.api.apps.info;
  deis.api.login = deis.api.auth.login;
  deis.api.logout = deis.api.auth.logout;
  deis.api.logs = deis.api.apps.logs;
  deis.api.open = deis.api.apps.open;
  deis.api.passwd = deis.api.auth.passwd;
  deis.api.pull = deis.api.builds.create;
  deis.api.register = deis.api.auth.register;
  deis.api.rollback = deis.api.releases.rollback;
  deis.api.run = deis.api.apps.run;
  deis.api.scale = deis.api.ps.scale;
  deis.api.sharing = deis.api.perms.list;
  deis.api.whoami = deis.api.auth.whoami;

  deis.api.username = deis.username;
  deis.api.password = deis.password;
  deis.api.authenticated = deis.authenticated;

  return this.api;
};
