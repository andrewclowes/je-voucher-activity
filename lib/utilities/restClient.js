var request = require('request');
var extend = require('extend');

var RestClient = function(baseUrl, apiName, options) {
  var baseDefaults = {
    baseUrl: baseUrl
  };
  var additionalDefaults = options.defaults || {};
  var defaults = extend(baseDefaults, additionalDefaults);

  this.restClient = request.defaults(defaults);
  this.statsClient = options.statsClient;
  this.apiName = apiName;
};

['get', 'post', 'put', 'patch', 'delete'].forEach(function(method) {
  RestClient.prototype[method] = function (name, options, callback) {
    var self = this;
    
    var start = Date.now();
    this.restClient[method](options, function(err, response, body) {
      var duration = Date.now() - start;
      if (!err && self.statsClient) {
        self.statsClient.timing("dependencies." + this.apiName + "." + name + "." + method.toUpperCase() + "." + response.res.statusCode, duration);
      }
      callback(err, response, body);
    });
  };
});

module.exports = RestClient;
