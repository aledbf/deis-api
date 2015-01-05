var request = require('request-json'),
    format = require('util').format,
    check = require('./check-response'),
    once = require('once'),
    debug = require('debug')('deis:user');

module.exports = function(deis) {

  /**
   * change password
   * @param  {String}   oldPassword current password
   * @param  {String}   newPassword new password
   */
  function changePassword(oldPassword, newPassword, callback) {
    callback = once(callback);
    if (!deis.authenticated) {
      return callback(new Error('You need to login first'));
    }

    deis.client.post(format('/%s/auth/passwd', deis.version), {
      password: oldPassword,
      new_password: newPassword
    }, function(err, res, body) {
      debug('changePassword: %s', JSON.stringify(body, null, 2));
      check.forError(err, callback);
      callback(null);
    });
  }

  /**
   * remove the account currently logged
   */
  function cancelAccount(callback) {
    callback = once(callback);
    if (!deis.authenticated) {
      return callback(new Error('You need to login first'));
    }

    deis.client.del(format('/%s/auth/cancel/', deis.version), function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(204, res, body, callback);
      debug('cancelAccount: statusCode -> %s', res.statusCode);
      deis.api.logout(callback);
    });
  }

  return {
    changePassword: changePassword,
    cancelAccount: cancelAccount
  };
};
