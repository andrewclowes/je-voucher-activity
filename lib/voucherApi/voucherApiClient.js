var RestClient = require('../utilities/restClient');

// Resources
var Vouchers = require('./resources/vouchers');

var VoucherApiClient = function (config, statsClient) {
  this.apiName = "voucherapi";
  this.restClient = this.initRest(config, statsClient);  
};

VoucherApiClient.prototype.initRest = function(config, statsClient) {
  var options = {
    defaults: {
      headers: {
        'Content-type': 'application/json'
      }
    },
    statsClient: statsClient
  };
  return new RestClient(config.voucherApiBaseUrl, this.apiName, options);
};

VoucherApiClient.prototype.vouchers = function() {
	return new Vouchers(this);
};

module.exports = VoucherApiClient;
