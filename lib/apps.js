var format = require('util').format,
    isFunction = require('./utils').isFunction;

module.exports = function apps(deis) {

  var commons = require('./commons')(deis);

  /**
   * Create a new application
   */
  function create(appName, callback) {
    commons.post(format('/%s/apps/', deis.version), {
      id: appName
    }, callback);
  }

  /**
   * List accessible applications
   */
  function list(pageSize, callback) {
    var limit = 100;
    if (!isFunction(pageSize)) {
      limit = pageSize;
    }else {
      callback = pageSize;
    }
    commons.get(format('/%s/apps?limit=%s', deis.version, limit), callback);
  }

  /**
   * View info about an application
   */
  function info(appName, callback) {
    commons.get(format('/%s/apps/%s/', deis.version, appName), callback);
  }

  /**
   * View aggregated application logs
   */
  function logs(appName, callback) {
    commons.get(format('/%s/apps/%s/logs/', deis.version, appName), callback);
  }

  /**
   * Run a command in an ephemeral app container
   */
  function run(appName, command, callback) {
    commons.get(format('/%s/apps/%s/run/', deis.version, appName), callback);
  }

  /**
   * Destroy an application
   */
  function destroy(appName, callback) {
    commons.del(format('/%s/apps/%s/', deis.version, appName), callback);
  }

  function open(appName, callback) {
    return callback(new Error('deis open is useless in an API context.'));
  }

  return {
    create: create,
    list: list,
    info: info,
    logs: logs,
    open: open,
    run: run,
    destroy: destroy
  };
};
