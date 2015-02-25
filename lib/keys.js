var request = require('request-json'),
    format = require('util').format,
    util = require('util'),
    once = require('once'),
    check = require('./check-response'),
    sshKeyparser = require('ssh2-streams/lib/keyParser'),
    debug = require('debug')('deis:keys');

module.exports = function keys(deis) {

  /**
   * list SSH keys for the logged in user
   */
  function list(callback) {
    callback = once(callback);
    var uri = format('/%s/keys/', deis.version);
    deis.client.get(uri, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('key list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * add an SSH key
   */
  function add(keyId, sshKey, callback) {
    callback = once(callback);
    try {
      sshKeyparser(sshKey);
    }catch (e) {
      return callback(e);
    }

    var uri = format('/%s/keys/', deis.version);
    deis.client.post(uri, {
      id: keyId || deis.username,
      'public': sshKey
    },function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(201, res, body, callback);
      debug('ssh add key for username %s', deis.username, JSON.stringify(body));
      callback(null, body);
    });
  }

  /**
   * remove an SSH key
   */
  function remove(keyId, callback) {
    deis.client.del(format('/%s/keys/%s', deis.version, keyId), function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(204, res, body, callback);
      debug('remove ssh key: statusCode -> %s', res.statusCode);
      callback(null);
    });
  }

  return {
    list: list,
    add: add,
    remove: remove
  };
};
