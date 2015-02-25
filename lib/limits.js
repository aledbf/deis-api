module.exports = function limits(deis) {

  /**
   * list resource limits for an app
   */
  function list() {
    var uri = format('/%s/apps/', deis.version);
    require('./commons')(deis).list(uri, callback);
  }

  /**
   * set resource limits for an app
   */
  function set() {

  }

  /**
   * unset resource limits for an app
   */
  function unset() {

  }

  return {
    list: list,
    set: set,
    unset: unset
  };
};
