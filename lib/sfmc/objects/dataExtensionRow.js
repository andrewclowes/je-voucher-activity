var util = require('util');

var DataExtensionRow = function(parent, options) {
  this.parent = parent;
  this.objName = 'DataExtensionRow';

  this.options = options || {};
};

DataExtensionRow.prototype.post = function(cb) {
  var dataExtensionUrl = this.parent.restBaseUrl + '/hub/v1/dataevents/key:' + this.options.dataExtensionKey + '/rowset/';
  var requestBody = [{
    keys: this.options.keys,
    values: this.options.values
  }];

  this.parent.restClient({
      url: dataExtensionUrl,
      body: requestBody,
      method: 'POST'
    }, cb);
};

module.exports = DataExtensionRow;
