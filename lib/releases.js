var format = require('util').format;

module.exports = function releases(deis) {

  var commons = require('./commons')(deis);

  function _releases(appName, callback) {
    commons.get(format('/%s/apps/%s/releases/', deis.version, appName), callback);
  }

  function detail(appName, release, callback) {
    commons.get(format('/%s/apps/%s/releases/v%s/', deis.version, appName, release), callback);
  }

  function rollback(appName, version, callback) {
    commons.post(format('/%s/apps/%s/releases/rollback/', deis.version, appName), {
      version: version
    },callback);
  }

  return {
    releases: _releases,
    detail: detail,
    rollback: rollback
  };
};
