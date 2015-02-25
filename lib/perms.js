module.exports = function perms(deis) {

  /**
   * list permissions granted on an app
   */
  function list() {
    var uri = format('/%s/apps/', deis.version);
    require('./commons')(deis).list(uri, callback);
  }

  /**
   * create a new permission for a user
   */
  function create() {

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
