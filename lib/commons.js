var request = require('request-json'),
    once = require('once'),
    check = require('./check-response'),
    debug = require('debug')('deis');

module.exports = function commons(deis) {

  function list(url, callback){
    callback = once(callback);
    deis.client.get(url, function(err, res, body) {
      check.forError(err, callback);
      check.forHttpCode(200, res, body, callback);
      debug('list %s', JSON.stringify(body));
      callback(null, body);
    });
  }

  return {
    list: list
  }
}