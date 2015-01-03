var request = require('request-json'),
    format = require('util').format,
    debug = require('debug')('deis:apps');

module.exports = function(deis) {

  /**
   * Create a new application
   */
  function create(appName, callback) {
    deis.client.post(format('/%s/apps/', deis.version), {
      id: appName
    },function(err, res, body) {
      if (err) {
        return callback(err);
      }

      if (res.statusCode !== 201) {
        return callback(new Error(JSON.stringify(body)));
      }

      debug('create [%s] %s', appName, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * List accessible applications
   */
  function list(callback) {
    deis.client.get(format('/%s/apps/', deis.version), function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * View info about an application
   */
  function info(appName, callback) {
    deis.client.get(format('/%s/apps/%s/', deis.version, appName), function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('info [%s] %s', appName, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * View aggregated application logs
   */
  function logs(appName, callback) {
    deis.client.get(format('/%s/apps/logs/', deis.version), function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('logs [%s]\n%s', appName, body);
      callback(null, body);
    });
  }

  /**
   * Run a command in an ephemeral app container
   */
  function run(appName, command, callback) {
    deis.client.post(format('/%s/apps/%s/run/', deis.version, appName), {
      command: command
    }, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('run [%s "%s"] %s', appName, command, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * Destroy an application
   */
  function destroy(appName, callback) {
    deis.client.del(format('/%s/apps/%s/', deis.version, appName), function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('destroy [%s] %s', appName, res.statusCode);
      callback(null, body);
    });
  }

  return {
    create: create,
    list: list,
    info: info,
    logs: logs,
    run: run,
    destroy: destroy
  };
};
