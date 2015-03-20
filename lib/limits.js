var format = require('util').format,
    errors = require('common-errors'),
    debug = require('debug')('deis:limits'),
    isObject = require('is-object');

module.exports = function limits(deis) {

  var commons = require('./commons')(deis);

  function extractLimits(data) {
    debug(data);
    var result = {};
    if (data.memory && Object.keys(data.memory).length > 0) {
      result.memory = data.memory;
    }

    if (data.cpu && Object.keys(data.cpu).length > 0) {
      result.cpu = data.cpu;
    }

    return result;
  }

  /**
   * list resource limits for an app
   */
  function list(appName, callback) {
    if (!appName) {
      return callback(errors.ArgumentError('appName'));
    }

    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    commons.get(uri, function onListResponse(err, result) {
      console.log(result);
      callback(err, result ? extractLimits(result) : null);
    });
  }

  /**
   * set resource limits for an app
   */
  function set(appName, limits, callback) {
    if (!isObject(limits)) {
      return callback(new errors.Error('To set a variable pass an object'));
    }

    var keyValues = {};

    if (limits.hasOwnProperty('memory')) {
      keyValues.memory = limits.memory;
    }

    if (limits.hasOwnProperty('cpu')) {
      keyValues.cpu = limits.cpu;
    }

    if (Object.keys(keyValues).length === 0) {
      return callback(errors.Error('Only cpu and memory limits are valid'));
    }

    commons.post(format('/%s/apps/%s/config/', deis.version, appName), keyValues,
        function onSetResponse(err, result) {
          callback(err, result ? extractLimits(result) : null);
        });
  }

  /**
   * unset resource limits for an app
   */
  function unset(appName, limitType, procType, callback) {
    if (!appName) {
      return callback(errors.ArgumentError('appName'));
    }

    if (!limitType) {
      return callback(errors.ArgumentError('limitType'));
    }

    if (!procType) {
      return callback(errors.ArgumentError('procType'));
    }

    var keyValues = {};

    if (limitType === 'memory') {
      keyValues.memory = {};
      keyValues.memory[procType] = null;
    }

    if (limitType === 'cpu') {
      keyValues.cpu = {};
      keyValues.cpu[procType] = null;
    }

    commons.post(format('/%s/apps/%s/config/', deis.version, appName), keyValues,
        function onUnsetResponse(err, result) {
          console.log(result);
          callback(err, result ? extractLimits(result) : null);
        });
  }

  return {
    list: list,
    set: set,
    unset: unset
  };
};
