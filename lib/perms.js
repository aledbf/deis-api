var format = require('util').format;

module.exports = function perms(deis) {

  var commons = require('./commons')(deis);

  /**
   * list permissions granted on an app
   */
  function list(appName, callback) {
    commons.get(format('/%s/apps/%s/perms/', deis.version, appName), callback);
  }

  /**
   * create a new permission for a user
   */
  function create(username, appName, callback) {
    commons.post(format('/%s/apps/%s/perms/', deis.version, appName), {
      username: username
    }, callback);
  }

  /**
   * delete a permission for a user
   */
  function deletef() {

  }

  return {
    list: list,
    create: create,
    'delete': deletef
  };
};
