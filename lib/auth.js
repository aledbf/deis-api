var request = require('request-json'),
    format = require('util').format,
    check = require('./check-response'),
    once = require('once'),
    debug = require('debug')('deis:auth');

module.exports = function(deis) {

  /**
   * remove the account currently logged
   */
  function cancel(callback) {
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

  function login(callback) {
    if (deis.token) {
      return callback(new Error('Already logged in'));
    }

    deis.client.post(format('/%s/auth/login/', deis.version), {
      username: deis.username,
      password: deis.password
    }, function(err, res, body) {
      check.forError(err, callback);
      debug('%s', JSON.stringify(body));
      if (!body.token) {
        deis._authenticated = false;
        return callback(Error('Incorrect Deis login details'));
      }

      deis.client = request.newClient(format('%s://%s', deis.protocol, deis.controller), {
        rejectUnauthorized: false,
        headers: {
          Authorization: format('token %s', body.token)
        }
      });

      deis.token = body.token;

      callback(null);
    });
  };

  function logout(callback) {
    callback = callback || noop;

    deis.client = request.newClient(format('%s://%s', deis.protocol, deis.controller), {
      rejectUnauthorized: false
    });

    deis.token = null;

    callback(null);
  };

  /**
   * change password
   * @param  {String}   oldPassword current password
   * @param  {String}   newPassword new password
   */
  function passwd(oldPassword, newPassword, callback) {
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

  function register(email, callback) {
    deis.client.post(format('%s://%s/%s/auth/register', deis.protocol, deis.controller, deis.version), {
      username: deis.username,
      email: email,
      password: deis.password
    }, function(err, res, body) {
      check.forError(err, callback);
      debug('%s', JSON.stringify(body, null, 2));
      check.forHttpCode(201, res, body, callback);
      callback(null, body);
    });
  };

  return {
    cancel: cancel,
    login: login,
    logout: logout,
    register: register,
    passwd: passwd
  };
};
