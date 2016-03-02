var util = require('util');

var Folder = function(parent, options) {
  this.parent = parent;
  this.objName = 'DataFolder';

  this.options = options || {};
  this.props = this.options.props || [];
};

Folder.prototype.get = function(cb) {
	var filter = {filter: this.options.filter} || null;
	if (this.props.length < 1) {
		cb({error: 'A property list is required for Folder retrieval.'});
	} else {
		this.parent.soapClient.retrieve(this.objName, this.props, filter, cb);
	}
};

module.exports = Folder;
