var request = require('request-json'),
    format = require('util').format,
    debug = require('debug')('deis:register');

module.exports = function(deis) {
  return function(email, callback) {
    deis.client.post(format('%s://%s/%s/auth/register', deis.protocol, deis.controller, deis.version), {
      username: deis.username,
      email: email,
      password: deis.password
    }, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      debug('%s', JSON.stringify(body, null, 2));
      if (res.statusCode !== 201) {
        return callback(new Error(JSON.stringify(body)));
      }

      callback(null, body);
    });
  };
};
