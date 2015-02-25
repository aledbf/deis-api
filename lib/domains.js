var format = require('util').format;

module.exports = function domains(deis) {

  var commons = require('./commons')(deis);

  /**
   * Add a domain to an app registered with the Deis controller.
   */
  function add(appName, domain, callback) {
    commons.post(format('/%s/apps/%s/domains/', deis.version, appName), {
      domain: domain.toString()
    }, callback);
  }

  /**
   * Remove a domain registered on an application.
   */
  function remove(appName, domain, callback) {
    var url = format('/%s/apps/%s/domains/%s', deis.version, appName, domain);
    commons.del(url, callback);
  }

  /**
   * Get all the domains for an application.
   */
  function getAll(appName, callback) {
    var url = format('/%s/apps/%s/domains/', deis.version, appName);
    commons.get(endpoint, callback);
  }

  /**
   * Get a domain by it's name.
   */
  function getDomain(domain, callback) {
    getAll(function(err, domains) {
      if (err) {
        return callback(err);
      }

      callback(null, domains.results.filter(function(domain_obj) {
        return domain_obj.domain == domain;
      })[0]);
    });
  }

  return {
    add: add,
    get: getDomain,
    getAll: getAll,
    remove: remove
  };
};
