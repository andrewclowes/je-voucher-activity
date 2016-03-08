var FuelRest = require('fuel-rest');
var FuelSoap = require('fuel-soap');

// Objects
var DataExtension = require('./objects/dataExtension');
var DataExtensionRow = require('./objects/dataExtensionRow');
var DataExtensionColumn = require('./objects/dataExtensionColumn');
var Folder = require('./objects/folder');

var FuelClient = function (config, statsClient) {
  this.restClient = this.initRest(config.auth, statsClient);
  this.soapClient = this.initSoap(config.auth, config.sfmcSoapEndpoint, statsClient);
};

FuelClient.prototype.initRest = function(auth, statsClient) {
  return new RestClient({auth: auth}, statsClient);
};

FuelClient.prototype.initSoap = function(auth, endpoint, statsClient) {
  return new SoapClient({auth: auth, soapEndpoint: endpoint}, statsClient);
};

FuelClient.prototype.dataExtension = function(options) {
	return new DataExtension(this, options);
};

FuelClient.prototype.dataExtensionColumn = function(options) {
	return new DataExtensionColumn(this, options);
};

FuelClient.prototype.dataExtensionRow = function(options) {
	return new DataExtensionRow(this, options);
};

FuelClient.prototype.folder = function(options) {
	return new Folder(this, options);
};

function SoapClient(options, statsClient) {
  this.fuel = new FuelSoap(options);
  this.statsClient = statsClient;
}

['create', 'retrieve', 'update', 'delete'].forEach(function(method) {
  SoapClient.prototype[method] = function(name, props, filter, callback) {
    var soapClient = this.fuel;
    var request = function(callback) {
      return soapClient[method](name, props, filter, callback);
    };
    var optional = {
      statsClient: this.statsClient,
      callback: callback
    };
    monitorRequest(name, method, request, optional);
  };
});

function RestClient(options, statsClient) {
  this.fuel = new FuelRest(options);
  this.statsClient = statsClient;
}

['get', 'post', 'put', 'patch', 'delete'].forEach(function(method) {
  RestClient.prototype[method] = function (name, options, callback) {
    var restClient = this.fuel;
    var request = function(callback) {
      return restClient[method](options, callback);
    };
    var optional = {
      statsClient: this.statsClient,
      callback: callback
    };
    monitorRequest(name, method, request, optional);
  };
});

function monitorRequest(name, method, func, options) {
  var client = options.statsClient;
  var callback = options.callback;
  var start = Date.now();
  func(function(err, response) {
    var duration = Date.now() - start;
    if (client) {
      client.timing("dependencies.marketingcloud." + name + "." + method.toUpperCase() + "." + response.res.statusCode, duration);
    }
    callback(err, response);
  });
}

module.exports = FuelClient;
