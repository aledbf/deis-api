var request = require('request-json'),
    format = require('util').format,
    isObject = require('is-object'),
    util = require('util'),
    check = require('./check-response'),
    once = require('once'),
    debug = require('debug')('deis:config');

module.exports = function(deis) {
  /**
   * List environment variables for an app
   */
  function list(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('list %s', JSON.stringify(body.values));
      callback(null, body.values || {});
    });
  }

  /**
   * Set environment variables for an application
   */
  function set(appName, keyValues, callback) {
    callback = once(callback);
    if (!isObject(keyValues)) {
      return callback(new Error('To set a variable pass an object'));
    }

    deis.client.post(format('/%s/apps/%s/config/', deis.version, appName), {
      values: keyValues
    },function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(201, res, body, callback);
      debug('list %s', JSON.stringify(body.values));
      callback(null, body.values);
    });
  }

  /**
   * Unset environment variables for an app
   */
  function unset(appName, variableNames, callback) {
    callback = once(callback);
    if (!util.isArray(variableNames)) {
      return callback(new Error('To unset a variable pass an array of names'));
    }

    var keyValues = {};
    variableNames.forEach(function(variableName) {
      keyValues[variableName] = null;
    });

    set(appName, keyValues, callback);
  }

  return{
    list: list,
    set: set,
    unset: unset
  };
};
