var format = require('util').format,
    sshKeyparser = require('ssh2-streams/lib/keyParser');

module.exports = function keys(deis) {

  var commons = require('./commons')(deis);

  /**
   * list SSH keys for the logged in user
   */
  function list(callback) {
    commons.get(format('/%s/keys/', deis.version), callback);
  }

  /**
   * add an SSH key
   */
  function add(keyId, sshKey, callback) {
    try {
      sshKeyparser(sshKey);
    }catch (e) {
      return callback(e);
    }

    commons.post(format('/%s/keys/', deis.version), {
      id: keyId || deis.username,
      'public': sshKey
    },callback);
  }

  /**
   * remove an SSH key
   */
  function remove(keyId, callback) {
    commons.del(format('/%s/keys/%s', deis.version, keyId), callback);
  }

  return {
    list: list,
    add: add,
    remove: remove
  };
};
