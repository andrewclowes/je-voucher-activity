var fuelRest = require('fuel');
var FuelSoap = require('fuel-soap');

// Objects
var DataExtension = require('./objects/dataExtension');
var DataExtensionRow = require('./objects/dataExtensionRow');
var Folder = require('./objects/folder');

var FuelClient = function (config) {
  this.restClient = this.initRest(config.auth);
  this.soapClient = this.initSoap(config.auth, config.sfmcSoapEndpoint);
  this.restBaseUrl = config.sfmcRestBaseUrl;
};

FuelClient.prototype.initRest = function(auth) {
  return fuelRest.configure(auth);
};

FuelClient.prototype.initSoap = function(auth, endpoint) {
  return new FuelSoap({auth: auth, soapEndpoint: endpoint});
};

FuelClient.prototype.dataExtension = function(options) {
	return new DataExtension(this, options);
};

FuelClient.prototype.dataExtensionRow = function(options) {
	return new DataExtensionRow(this, options);
};

FuelClient.prototype.folder = function(options) {
	return new Folder(this, options);
};

module.exports = FuelClient;
