var util = require('util');

var DataExtensionColumn = function(parent, options) {
  this.parent = parent;
  this.objName = 'DataExtensionField';

  this.options = options || {};
  this.props = this.options.props || [];
};

DataExtensionColumn.prototype.get = function(cb) {
  var filter = {filter: this.options.filter} || null;
  if (this.props.length < 1) {
		cb({error: 'A property list is required for Data Extension Column retrieval.'});
	} else {
    this.parent.soapClient.retrieve(this.objName, this.props, filter, cb);
  }
};

module.exports = DataExtensionColumn;
