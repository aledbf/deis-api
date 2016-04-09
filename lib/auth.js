var request = require('request-json-light'),
    format = require('util').format;

module.exports = function auth(deis) {

  var commons = require('./commons')(deis);

  /**
   * remove the account currently logged
   */
  function cancel(callback) {
    if (!deis._authenticated) {
      return callback(new Error('You need to login first'));
    }

    commons.del(format('/%s/auth/cancel/', deis.version), function() {
      deis.api.logout(callback);
    });
  }

  function login(callback) {
    if (deis._authenticated) {
      return callback(new Error('Already logged in'));
    }

    deis.client.post(format('/%s/auth/login/', deis.version), {
      username: deis.username,
      password: deis.password
    }, function(err, response, body) {
      if (err) {
        deis._authenticated = false;
        return callback(err);
      }

      if (!body.token) {
        deis._authenticated = false;
        return callback(Error('Incorrect Deis login details'));
      }

      deis.client = request.newClient(format('%s://%s', deis.protocol, deis.controller), {
        headers: {
          Authorization: format('token %s', body.token)
        }
      });

      deis._authenticated = true;

      callback(null);
    });
  }

  function logout(callback) {
    deis.client = request.newClient(format('%s://%s', deis.protocol, deis.controller), {
    });

    deis._authenticated = false;
    callback(null);
  }

  /**
   * change password
   * @param  {String}   oldPassword current password
   * @param  {String}   newPassword new password
   */
  function passwd(oldPassword, newPassword, callback) {
    if (!deis._authenticated) {
      return callback(new Error('You need to login first'));
    }

    deis.client.post(format('/%s/auth/passwd', deis.version), {
      password: oldPassword,
      new_password: newPassword
    }, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      if (res.statusCode === 200) {
        return callback(null);
      }

      return callback(new Error('Password change failed: ' + body.detail));
    });
  }

  function register(email, callback) {
    if (deis._authenticated) {
      return callback(new Error('Already logged in. You do not to register'));
    }

    commons.post(format('%s://%s/%s/auth/register', deis.protocol, deis.controller, deis.version), {
      username: deis.username,
      email: email,
      password: deis.password
    }, callback);
  }

  function whoami() {
    return { message: format('You are %s at %s', deis.username, deis.controller) };
  }

  return {
    cancel: cancel,
    login: login,
    logout: logout,
    register: register,
    passwd: passwd,
    whoami: whoami
  };
};
