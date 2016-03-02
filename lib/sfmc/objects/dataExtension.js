var util = require('util');

var DataExtension = function(parent, options) {
  this.parent = parent;
  this.objName = 'DataExtension';

  this.options = options || {};
  this.props = this.options.props || [];
};

DataExtension.prototype.get = function(cb) {
  var filter = {filter: this.options.filter} || null;
  if (this.props.length < 1) {
		cb({error: 'A property list is required for DataExtension retrieval.'});
	} else {
    this.parent.soapClient.retrieve(this.objName, this.props, filter, cb);
  }
};

module.exports = DataExtension;
