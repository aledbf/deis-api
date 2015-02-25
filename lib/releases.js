var request = require('request-json'),
    format = require('util').format,
    util = require('util'),
    once = require('once'),
    check = require('./check-response'),
    debug = require('debug')('deis:config');

module.exports = function releases(deis) {

  function _releases(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/releases/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  function detail(appName, release, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/releases/v%s/', deis.version, appName, release);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  function rollback(appName, version, callback) {
    callback = once(callback);
    deis.client.post(format('/%s/apps/%s/releases/rollback/', deis.version, appName), {
      version: version
    },function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(201, res, body, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  return {
    releases: _releases,
    detail: detail,
    rollback: rollback
  };
};
