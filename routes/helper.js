var config            = require('config');
var SfmcClient        = require('../lib/sfmc/sfmcClient');
var createStatsClient = require('../lib/statsd/statsdClientFactory');

var Helper = function () {
  var helper = {};

  var statsdClient = createStatsClient(config);
  var sfmcClient = new SfmcClient(config, statsdClient);

  helper.folder = function(req, res) {
    if (!req.params.id) {
      res.send(500, {error: "The id parameter of the folder is undefined"});
    }

    var options = {
      props: ['ID', 'Name'],
      filter: {
        leftOperand: {
          leftOperand: 'ParentFolder.ID',
          operator: 'equals',
          rightOperand: req.params.id
        },
        operator: 'AND',
        rightOperand: {
          leftOperand: 'ContentType',
          operator: 'equals',
          rightOperand: 'DataExtension'
        }
      }
    };

    var folder = sfmcClient.folder(options);
    folder.get(function (error, result) {
      if (error) {
        res.send(500, error);
      } else {
        res.send(200, result.body.Results);
      }
    });
  };

  helper.dataExtension = function(req, res) {
    if (!req.params.id) {
      res.send(500, {error: "The id parameter of the folder is undefined"});
    }

    var options = {
      props: ['ObjectID', 'Name', 'CustomerKey'],
      filter: {
        leftOperand:{
          leftOperand: 'CategoryID',
          operator: 'equals',
          rightOperand: req.params.id
        },
        operator: 'AND',
        rightOperand: {
          leftOperand: 'IsSendable',
          operator: 'equals',
          rightOperand: 'true'
        }
      }
    };

    var dataExtension = sfmcClient.dataExtension(options);
    dataExtension.get(function (error, result) {
      if (error) {
        res.send(500, error);
      } else {
        res.send(200, result.body.Results);
      }
    });
  };

  helper.dataExtensionColumn = function(req, res) {
    if (!req.params.key) {
      res.send(500, {error: "The key parameter of the data extension is undefined"});
    }

    var options = {
      props: ['ObjectID', 'Name', 'IsPrimaryKey'],
      filter: {
        leftOperand: 'CustomerKey',
        operator: 'like',
        rightOperand: '[[]' + decodeURIComponent(req.params.key) + '].[[]%]'
      }
    };

    var column = sfmcClient.dataExtensionColumn(options);
    column.get(function (error, result) {
      if (error) {
        res.send(500, error);
      } else {
        res.send(200, result.body.Results);
      }
    });
  };

  return helper;
};

module.exports = Helper;
