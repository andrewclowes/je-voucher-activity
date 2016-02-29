var fuel = require('fuel');

// Objects
var DataExtensionRow = require('./objects/dataExtensionRow');

var FuelClient = function (config) {
  this.restClient = this.initRest(config.auth);
  this.baseUrl = config.sfmcBaseUrl;
};

FuelClient.prototype.initRest = function(auth) {
  return fuel.configure(auth);
};

FuelClient.prototype.dataExtensionRow = function(options) {
	return new DataExtensionRow(this, options);
};

module.exports = FuelClient;
