var format = require('util').format;

module.exports = function(deis) {
  /**
   * Add a domain to an app registered with the Deis controller.
   */
  function add(appName, domain, callback) {
    deis.client.post(format('/%s/apps/%s/domains/', deis.version, appName), {
      domain: domain.toString()
    }, function(err, res, body) {
      return callback(err);
    };
  }

  /**
   * Remove a domain registered on an application.
   */
  remove: function remove(appName, domain, callback) {
    var endpoint = format('/%s/apps/%s/domains/%s', deis.version, appName, domain);

    deis.client.del(endpoint, function(err, res, body) {
      callback(err);
    });
  };

  /**
   * Get all the domains for an application.
   */
  function getAll(appName, callback) {
    var endpoint = format('/%s/apps/%s/domains/', deis.version, appName);

    deis.client.get(endpoint, function(err, res, body) {
      callback(err, body);
    });
  };

  /**
   * Get a domain by it's name.
   */
  function getDomain(domain, callback) {
    getAllDomains(function(err, domains) {
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
