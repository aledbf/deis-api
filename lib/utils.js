module.exports.isObject = function isObject(x) {
  return typeof x === 'object' && x !== null;
};

module.exports.isFunction = function isFunction(x) {
  return typeof x === 'function' && x !== null;
};
