var request = require('request-json'),
    format = require('util').format,
    isObject = require('is-object'),
    util = require('util'),
    debug = require('debug')('deis:config');

module.exports = function(deis) {
  /**
   * List environment variables for an app
   */
  function list(appName, callback) {
    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('list %s', JSON.stringify(body.values));
      callback(null, body.values || {});
    });
  }

  /**
   * Set environment variables for an application
   */
  function set(appName, keyValues, callback) {
    if (!isObject(keyValues)) {
      return callback(new Error('To set a variable pass an object'));
    }

    deis.client.post(format('/%s/apps/%s/config/', deis.version, appName), {
      values: keyValues
    },function(err, res, body) {
      if (err) {
        return callback(err);
      }

      if (res.statusCode !== 201) {
        return callback(new Error(JSON.stringify(body)));
      }

      debug('list %s', JSON.stringify(body.values));
      callback(null, body.values);
    });
  }

  /**
   * Unset environment variables for an app
   */
  function unset(appName, variableNames, callback) {
    if (!util.isArray(variableNames)) {
      return callback(new Error('To unset a variable pass an array of names'));
    }

    var keyValues = {};
    variableNames.forEach(function(variableName) {
      keyValues[variableName] = null;
    });

    set(appName, keyValues, callback);
  }

  /**
   * scale an application
   */
  function scale(appName, configuration, callback) {
    if (!isObject(keyValues)) {
      return callback(new Error('To scale pass an object with the type as key'));
    }

    var uri = format('/%s/apps/%s/scale/', deis.version, appName);
    deis.client.post(uri, configuration, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      if (res.statusCode !== 204) {
        return callback(new Error(JSON.stringify(body)));
      }

      callback(null);
    });
  }

  return{
    scale: scale,
    list: list,
    set: set,
    unset: unset
  };
};
