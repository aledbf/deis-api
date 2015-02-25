var request = require('request-json'),
    format = require('util').format,
    isObject = require('is-object'),
    util = require('util'),
    once = require('once'),
    check = require('./check-response'),
    debug = require('debug')('deis:ps');

module.exports = function ps(deis) {
  /**
   * scale an application
   */
  function scale(appName, configuration, callback) {
    callback = once(callback);
    if (!isObject(configuration)) {
      return callback(new Error('To scale pass an object with the type as key'));
    }

    var uri = format('/%s/apps/%s/scale/', deis.version, appName);
    deis.client.post(uri, configuration, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(204, res, body, callback);
      callback(null);
    });
  }

  /**
   * list application containers and their status
   */
  function list(appName, callback) {
    var uri = format('/%s/apps/%s/containers/', deis.version, appName);
    require('./commons')(deis).list(uri, callback);
  }

  /**
   * list application containers and their status
   */
  function byType(appName, type, callback) {
    var uri = format('/%s/apps/%s/containers/%s/', deis.version, appName, type);
    require('./commons')(deis).list(uri, callback);
  }

  return {
    list: list,
    byType: byType,
    scale: scale
  };
};
