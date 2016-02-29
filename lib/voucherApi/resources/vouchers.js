var Vouchers = function(parent) {
  this.parent = parent;
  this.objName = 'VouchersObject';
};

Vouchers.prototype.postVoucher = function(tenant, options, cb) {
  var opt = options || {};

  if (tenant == null) {
    throw "Missing required option 'tenant' when calling postVoucher";
  }

  var path = '/api/' + tenant + '/vouchers';

  this.parent.restClient.post({
      url: path,
      body: JSON.stringify(opt)
    }, cb);
};

module.exports = Vouchers;
