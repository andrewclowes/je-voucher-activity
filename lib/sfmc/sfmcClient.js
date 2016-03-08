var FuelRest = require('fuel-rest');
var FuelSoap = require('fuel-soap');
var statsdClientFactory = require('../../lib/statsd/statsdClientFactory');

// Objects
var DataExtension = require('./objects/dataExtension');
var DataExtensionRow = require('./objects/dataExtensionRow');
var DataExtensionColumn = require('./objects/dataExtensionColumn');
var Folder = require('./objects/folder');

var FuelClient = function (config) {
  var statsClient = statsdClientFactory.create(config);
  this.restClient = new RestClient({auth: config.auth});
  this.soapClient = new SoapClient({auth: config.auth, soapEndpoint: config.sfmcSoapEndpoint});

  function SoapClient(options) {
    this.fuel = new FuelSoap(options);
  }

  ['create', 'retrieve', 'update', 'delete'].forEach(function(method) {
    SoapClient.prototype[method] = function(name, props, filter, callback) {
      var soapClient = this.fuel;
      var request = function(callback) {
        return soapClient[method](name, props, filter, callback);
      };
      invokeRequest(name, method, request, callback);
    };
  });

  function RestClient(options) {
    this.fuel = new FuelRest(options);
  }

  ['get', 'post', 'put', 'patch', 'delete'].forEach(function(method) {
    RestClient.prototype[method] = function (name, options, callback) {
      var restClient = this.fuel;
      var request = function(callback) {
        return restClient[method](options, callback);
      };
      invokeRequest(name, method, request, callback);
    };
  });

  function invokeRequest(name, method, func, callback) {
    var start = Date.now();
    func(function(err, response) {
      var duration = Date.now() - start;
      console.log("Method: dependencies.marketingcloud." + name + "." + method.toUpperCase() + " Duration: " + duration);
      console.log(statsClient.toString());
      statsClient.timing("dependencies.marketingcloud." + name + "." + method.toUpperCase(), duration);
      callback(err, response);
    });
  }
};

// FuelClient.prototype.initRest = function(auth, statsClient) {
//   return new RestClient({auth: auth}, statsClient);
// };
//
// FuelClient.prototype.initSoap = function(auth, endpoint, statsClient) {
//   return new SoapClient({auth: auth, soapEndpoint: endpoint}, statsClient);
// };

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

// function SoapClient(options, statsClient) {
//   this.fuel = new FuelSoap(options);
//   this.timer = new Timer(statsClient);
// }
//
// ['create', 'retrieve', 'update', 'delete'].forEach(function(method) {
//   SoapClient.prototype[method] = function(name, props, filter, callback) {
//     var soapClient = this.fuel;
//     var request = function(callback) {
//       return soapClient[method](name, props, filter, callback);
//     };
//     this.timer.invokeRequest(name, method, request, callback);
//   };
// });
//
// function RestClient(options, statsClient) {
//   this.fuel = new FuelRest(options);
//   this.timer = new Timer(statsClient);
// }
//
// ['get', 'post', 'put', 'patch', 'delete'].forEach(function(method) {
//   RestClient.prototype[method] = function (name, options, callback) {
//     var restClient = this.fuel;
//     var request = function(callback) {
//       return restClient[method](options, callback);
//     };
//     this.timer.invokeRequest(name, method, request, callback);
//   };
// });
//
// function Timer(statsClient) {
//   console.log(statsClient.toString());
//   this.statsClient = statsClient;
// }
//
// Timer.prototype.invokeRequest = function(name, method, func, callback) {
//   var start = Date.now();
//   func(function(err, response) {
//     var duration = Date.now() - start;
//     console.log("Method: dependencies.marketingcloud." + name + "." + method.toUpperCase() + " Duration: " + duration);
//     console.log(this.statsClient.toString());
//     this.statsClient.timing("dependencies.marketingcloud." + name + "." + method.toUpperCase());
//     callback(err, response);
//   });
// };

module.exports = FuelClient;
