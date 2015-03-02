var request = require('request-json'),
    format = require('util').format,
    debug = require('debug')('deis:request');


/**
 * Check if the http response returns the expected http code
 * and return an error with the detail if the check fails
 * @param  {Number}   expected     http
 * @param  {Response} res
 * @param  {Object}   body
 * @param  {Function} callback
 */
function checkHttpCode(expected, res, body, callback) {
  if (res.statusCode !== expected) {
    if(!body){
      return callback(new Error(format('Unexpected deis response (expected %s but %s was returned)', expected, res.statusCode)));
    }

    var error = body.hasOwnProperty('detail') ?
        body.detail : JSON.stringify(body);

    return callback(new Error(error));
  }

  return callback(null, body);
}

module.exports = function commons(deis) {

  function get(url, callback) {
    debug('get url: %s', url);
    deis.client.get(url, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      checkHttpCode(200, res, body, callback);
    });
  }

  function post(url, body, callback) {
    debug('post url: %s, body: %s', url, body);
    deis.client.post(url, body, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      checkHttpCode(201, res, body, callback);
    });
  }

  function del(url, callback) {
    debug('del url: %s', url);
    deis.client.del(url, function(err, res, body) {
      if (err) {
        return callback(err);
      }

      checkHttpCode(204, res, body, callback);
    });
  }

  return {
    get: get,
    post: post,
    del: del
  };
};
