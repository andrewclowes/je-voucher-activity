var util = require('util');

var DataExtensionRow = function(parent, options) {
  this.parent = parent;
  this.objName = 'DataExtensionRowObject';

  this.options = options || {};
};

DataExtensionRow.prototype.post = function(cb) {
  var dataExtensionUrl = this.parent.baseUrl + '/hub/v1/dataevents/key:' + this.options.dataExtensionKey + '/rowset/';

  console.log('DE Extension URL: ' + dataExtensionUrl);

  var requestBody = [{
    keys: this.options.keys,
    values: this.options.values
  }];
  
  console.log('RequestBody: ' + JSON.stringify(requestBody));

  this.parent.restClient({
      url: dataExtensionUrl,
      body: requestBody,
      method: 'POST'
    }, cb);
};

module.exports = DataExtensionRow;
