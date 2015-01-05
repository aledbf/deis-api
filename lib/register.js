var request = require('request-json'),
    format = require('util').format,
    check = require('./check-response'),
    once = require('once'),
    debug = require('debug')('deis:register');

module.exports = function(deis) {
  return function(email, callback) {
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
};
