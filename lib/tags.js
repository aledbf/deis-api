module.exports = function tags(deis) {

  /**
   * list tags for an app
   */
  function list() {
    var uri = format('/%s/apps/', deis.version);
    require('./commons')(deis).list(uri, callback);
  }

  /**
   * set tags for an app
   */
  function set() {

  }

  /**
   * unset tags for an app
   */
  function unset() {

  }

  return {
    list: list,
    set: set,
    unset: unset
  };
};
