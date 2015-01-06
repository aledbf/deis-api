var request = require('request-json'),
    format = require('util').format,
    check = require('./check-response'),
    debug = require('debug')('deis:auth');

module.exports = function(deis) {

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
    login: login,
    logout: logout
  };
};
