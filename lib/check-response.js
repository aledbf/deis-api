
function checkForError(err, callback) {
  if (err) {
    return callback(err);
  }
}


/**
 * Check if the http response returns the expected http code
 * and return an error with the detail if the cehck fails
 * @param  {Number}   expected     http
 * @param  {Response} res
 * @param  {Object}   body
 * @param  {Function} callback
 */
function forHttpCode(expected, res, body, callback) {
  if (res.statusCode !== expected) {
    var error = body.hasOwnProperty('detail') ?
        body.detail : 'Unexpected response from deis';

    return callback(new Error(error));
  }
}

module.exports = {
  forError: checkForError,
  forHttpCode: forHttpCode
};
