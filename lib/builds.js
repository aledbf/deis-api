var format = require('util').format;

module.exports = function(deis) {

  var commons = require('./commons')(deis);

  function builds(appName, callback) {
    commons.get(format('/%s/apps/%s/builds/', deis.version, appName), callback);
  }

  function create(appName, image, callback) {
    commons.post(format('/%s/apps/%s/builds/', deis.version, appName), image, callback);
  }

  return {
    builds: builds,
    create: create
  };
};
