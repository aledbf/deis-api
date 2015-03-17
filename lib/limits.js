var format = require('util').format,
    errors = require('./erros'),
    isObject = require('is-object');

module.exports = function limits(deis) {

  var commons = require('./commons')(deis);

  /**
   * list resource limits for an app
   */
  function list(callback) {
    var uri = format('/%s/apps/', deis.version);
    require('./commons')(deis).list(uri, callback);
  }

  /**
   * set resource limits for an app
   */
  function set(appName, limits, callback) {
    if (!isObject(limits)) {
      return callback(errors.RequiredError('To set a variable pass an object'));
    }

    var keyValues = {};

    if (limits.hasOwnProperty('memory')) {
      keyValues.memory = limit.memory;
    }

    if (limits.hasOwnProperty('cpu')) {
      keyValues.cpu = limit.cpu;
    }

    if (keyValues.keys.length === 0) {
      return callback(errors.TypedError('Only cpu and memory limits are valid'));
    }

    commons.post(format('/%s/apps/%s/config/', deis.version, appName), {
      values: keyValues
    },function(err, result) {
      callback(err, result ? result.values : null);
    });

    var uri = format('/%s/apps/', deis.version);
    require('./commons')(deis).list(uri, callback);
  }

  /**
   * unset resource limits for an app
   */
  function unset(appName, limitType, procType, callback) {
    if (!appName) {
      return callback(errors.RequiredError({ field: 'appName'}));
    }

    if (!limitType) {
      return callback(errors.RequiredError({ field: 'limitType'}));
    }

    if (!procType) {
      return callback(errors.RequiredError({ field: 'procType'}));
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

    commons.post(format('/%s/apps/%s/config/', deis.version, appName), {
      values: keyValues
    },function(err, result) {
      callback(err, result ? result.values : null);
    });

    var uri = format('/%s/apps/', deis.version);
    require('./commons')(deis).list(uri, callback);
  }

  return {
    list: list,
    set: set,
    unset: unset
  };
};
