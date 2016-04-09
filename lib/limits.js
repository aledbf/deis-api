var format = require('util').format,
    debug = require('debug')('deis:limits'),
    isObject = require('./utils').isObject;

function ArgumentError(arg) {
  return new Error(format('Invalid or missing argument supplied: %s', arg));
}

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
      return callback(ArgumentError('appName'));
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
      return callback(new Error('To set a variable pass an object'));
    }

    var keyValues = {};

    if (limits.hasOwnProperty('memory')) {
      keyValues.memory = limits.memory;
    }

    if (limits.hasOwnProperty('cpu')) {
      keyValues.cpu = limits.cpu;
    }

    if (Object.keys(keyValues).length === 0) {
      return callback(new Error('Only cpu and memory limits are valid'));
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
      return callback(ArgumentError('appName'));
    }

    if (!limitType) {
      return callback(ArgumentError('limitType'));
    }

    if (!procType) {
      return callback(ArgumentError('procType'));
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
