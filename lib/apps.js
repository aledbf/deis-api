var request = require('request-json'),
    format = require('util').format,
    util = require('util'),
    once = require('once'),
    check = require('./check-response'),
    debug = require('debug')('deis:apps');

module.exports = function apps(deis) {

  /**
   * Create a new application
   */
  function create(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/', deis.version);
    deis.client.post(uri, {
      id: appName
    },function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(201, res, body, callback);
      debug('create [%s] %s', appName, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * List accessible applications
   */
  function list(callback) {
    callback = once(callback);
    var uri = format('/%s/apps/', deis.version);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * View info about an application
   */
  function info(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('info [%s] %s', appName, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * View aggregated application logs
   */
  function logs(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/logs/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('logs [%s]\n%s', appName, body);
      callback(null, body);
    });
  }

  /**
   * Run a command in an ephemeral app container
   */
  function run(appName, command, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/run/', deis.version, appName);
    deis.client.post(uri, {
      command: command
    }, function(err, res, body) {
      check.forError(err, callback);
      debug('run [%s "%s"] %s', appName, command, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * Destroy an application
   */
  function destroy(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/', deis.version, appName);
    deis.client.del(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(204, res, body, callback);
      debug('destroy [%s] %s', appName, res.statusCode);
      callback(null, body);
    });
  }

  function open(appName, callback) {
    return callback(new Error('deis open is useless in an API context.'));
  }

  return {
    create: create,
    list: list,
    info: info,
    logs: logs,
    open: open,
    run: run,
    destroy: destroy
  };
};
