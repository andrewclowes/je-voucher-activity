var request = require('request');

// Resources
var Vouchers = require('./resources/vouchers');

var VoucherApiClient = function (config) {
  this.restClient = this.initRest(config);
};

VoucherApiClient.prototype.initRest = function(config) {
  return request.defaults({
    baseUrl: config.voucherApiBaseUrl,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

VoucherApiClient.prototype.vouchers = function() {
	return new Vouchers(this);
};

module.exports = VoucherApiClient;
