
var ValidationError = require('error/validation'),
    TypedError = require('error/typed');

var RequiredError = ValidationError({
  type: 'parameter.validation',
  message: 'The field "{field}" is required',
  field: null
});

module.exports = {
  RequiredError: RequiredError,
  TypedError: TypedError
};
