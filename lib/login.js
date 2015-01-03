var request = require('request-json'),
    format = require('util').format,
    debug = require('debug')('deis:login');

module.exports = function(deis) {
  return function login(callback) {
    if (deis.token) {
      return callback(new Error('Already logged in'));
    }

    deis.client.post(format('/%s/auth/login/', deis.version), {
      username: deis.username,
      password: deis.password
    }, function(err, res, body) {
      if (err) {
        return callback(err);
      }

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
  }
};
