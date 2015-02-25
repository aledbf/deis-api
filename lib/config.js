var util = require('util'),
    isObject = require('is-object'),
    format = util.format;

module.exports = function config(deis) {

  var commons = require('./commons')(deis);

  /**
   * List environment variables for an app
   */
  function list(appName, callback) {
    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    commons.get(uri, function(err, result) {
      callback(err, result ? result.values : null);
    });
  }

  /**
   * Set environment variables for an application
   */
  function set(appName, keyValues, callback) {
    if (!isObject(keyValues)) {
      return callback(new Error('To set a variable pass an object'));
    }

    commons.post(format('/%s/apps/%s/config/', deis.version, appName), {
      values: keyValues
    },function(err, result) {
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
