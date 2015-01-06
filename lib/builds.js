var request = require('request-json'),
    format = require('util').format,
    isObject = require('is-object'),
    util = require('util'),
    once = require('once'),
    check = require('./check-response'),
    debug = require('debug')('deis:config');

module.exports = function(deis) {

  function builds(appName, callback) {
    callback = once(callback);
    var uri = format('/%s/apps/%s/builds/', deis.version, appName);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  function create(appName, image, callback) {
    callback = once(callback);
    deis.client.post(format('/%s/apps/%s/builds/', deis.version, appName), {
      image: image
    },function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(201, res, body, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  return {
    builds: builds,
    create: create
  };
};
