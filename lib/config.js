var util = require('util'),
    isObject = require('./utils').isObject,
    format = util.format;

module.exports = function config(deis) {

  var commons = require('./commons')(deis);

  /**
   * List environment variables for an app
   */
  function list(appName, callback) {
    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    commons.get(uri, function onListResponse(err, result) {
      callback(err, result ? result.values : null);
    });
  }

  /**
   * Set environment variables for an application
   */
  function set(appName, keyValues, keyLimits, callback) {
    var config = {};

    if (!isObject(keyValues)) {
      return callback(new Error('To set a variable pass an object'));
    }

    config.values = keyValues;

    if (isObject(keyLimits)) {
      if (keyLimits.hasOwnProperty('memory')) {
        config.memory = keyLimits.memory;
      }
      if (keyLimits.hasOwnProperty('cpu')) {
        config.cpu = keyLimits.cpu;
      }
    } else {
      callback = keyLimits;
    }

    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    commons.post(uri, config, function onSetResponse(err, result) {
      callback(err, result ? result.values : null);
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
    variableNames.forEach(function onUnsetResponse(variableName) {
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
