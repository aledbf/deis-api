var format = require('util').format,
    isObject = require('is-object');

module.exports = function ps(deis) {

  var commons = require('./commons')(deis);

  /**
   * scale an application
   */
  function scale(appName, configuration, callback) {
    if (!isObject(configuration)) {
      return callback(new Error('To scale pass an object with the type as key'));
    }

    var url = format('/%s/apps/%s/scale/', deis.version, appName);
    commons.post(url, configuration, 204, callback);
  }

  /**
   * list application containers and their status
   */
  function list(appName, callback) {
    commons.get(format('/%s/apps/%s/containers/', deis.version, appName), callback);
  }

  /**
   * list application containers and their status
   */
  function byType(appName, type, callback) {
    var url = format('/%s/apps/%s/containers/%s/', deis.version, appName, type);
    commons.get(url, callback);
  }

  return {
    list: list,
    byType: byType,
    scale: scale
  };
};
