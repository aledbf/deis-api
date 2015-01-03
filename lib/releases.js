var request = require('request-json'),
    format = require('util').format,
    isObject = require('is-object'),
    util = require('util'),
    debug = require('debug')('deis:config');

module.exports = function(deis) {

  function releases(appName, callback) {
    var uri = format('/%s/apps/%s/releases/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  function detail(appName, release, callback) {
    var uri = format('/%s/apps/%s/releases/v%s/', deis.version, appName, release);
    deis.client.get(uri, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  function rollback(appName, version, callback) {
    deis.client.post(format('/%s/apps/%s/releases/rollback/', deis.version, appName), {
      version: version
    },function(err, res, body) {
      if (err) {
        return callback(err);
      }

      if (res.statusCode !== 201) {
        return callback(new Error(JSON.stringify(body)));
      }

      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  return{
    releases: releases,
    detail: detail,
    rollback: rollback
  };
};
