var request = require('request-json'),
    format = require('util').format,
    debug = require('debug')('deis:user');

module.exports = function(deis) {

  /**
   * change password
   * @param  {String}   oldPassword current password
   * @param  {String}   newPassword new password
   */
  function changePassword(oldPassword, newPassword, callback) {
    if (!deis.authenticated) {
      return callback(new Error('You need to login first'));
    }

    deis.client.post(format('/%s/auth/passwd', deis.version), {
      password: oldPassword,
      new_password: newPassword
    }, function(err, res, body) {
      debug('changePassword: %s', JSON.stringify(body, null, 2));

      if (err) {
        return callback(err);
      }

      callback(null);
    });
  }

  /**
   * remove the account currently logged
   */
  function cancelAccount(callback) {
    if (!deis.authenticated) {
      return callback(new Error('You need to login first'));
    }

    deis.client.del(format('/%s/auth/cancel/', deis.version), function(err, res, body) {
      debug('cancelAccount: statusCode -> %s', res.statusCode);
      if (err || res.statusCode !== 204) {
        return callback(new Error('Unexpected response from deis.'));
      }

      deis.api.logout(callback);
    });
  }

  return {
    changePassword: changePassword,
    cancelAccount: cancelAccount
  };
};
