var util = require('util');

function ActivityError(message, data) {
  Error.call(this);
  this.message = message;
  this.data = data;
}
util.inherits(ActivityError, Error);

function ApiError(message, name, data) {
  Error.call(this);
  this.message = message;
  this.data = data;
  this.apiName = name;
}
util.inherits(ApiError, Error);

module.exports = {
  ActivityError: ActivityError,
  ApiError: ApiError
};
