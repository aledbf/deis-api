
function checkForError(err, callback) {
  if (err) {
    return callback(err);
  }
}

function forHttpCode(expectedCode, res, body, callback) {
  if (res.statusCode !== expectedCode) {
    var error = expectedCode === 204 ?
        'Unexpected response from deis' : JSON.stringify(body);
    if (error !== '') {
      return callback(new Error(error));
    }
  }
}

module.exports = {
  forError: checkForError,
  forHttpCode: forHttpCode
};
