var util = require('util'),
    isObject = require('is-object');
format = util.format;

module.exports = function tags(deis) {

  var commons = require('./commons')(deis);

  /**
   * list tags for an app
   */
  function list(appName, callback) {
    var uri = format('/%s/apps/%s/config/', deis.version, appName);
    commons.get(uri, function(err, result) {
      callback(err, result ? result.tags : null);
    });
  }

  /**
   * set tags for an app
   */
  function set(appName, tagValues, callback) {
    if (!isObject(tagValues)) {
      return callback(new Error('To set a variable pass an object'));
    }

    commons.post(format('/%s/apps/%s/config/', deis.version, appName), {
      tags: tagValues
    },function(err, result) {
      callback(err, result ? result.tags : null);
    });
  }

  /**
   * unset tags for an app
   */
  function unset(appName, tagNames, callback) {
    if (!util.isArray(tagNames)) {
      return callback(new Error('To unset a tag pass an array of names'));
    }

    var keyValues = {};
    tagNames.forEach(function(tagName) {
      keyValues[tagName] = null;
    });

    set(appName, keyValues, callback);
  }

  return {
    list: list,
    set: set,
    unset: unset
  };
};
