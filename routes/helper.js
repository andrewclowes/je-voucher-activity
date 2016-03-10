var config            = require('config');
var SfmcClient        = require('../lib/sfmc/sfmcClient');
var createStatsClient = require('../lib/statsd/statsdClient');
var Errors            = require('../lib/utilities/errors');

var Helper = function () {
  var helper = {};

  var statsdClient = createStatsClient(config);
  var sfmcClient = new SfmcClient(config, statsdClient);

  helper.folder = function(req, res, next) {
    if (!req.params.id) {
      next(new Errors.ActivityError('The id parameter of the folder is undefined', req.params));
      return;
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
        next(new Errors.ApiError('There was an error when requesting folders from marketing cloud', 'marketingcloud', error));
      } else {
        res.send(200, result.body.Results);
      }
    });
  };

  helper.dataExtension = function(req, res, next) {
    if (!req.params.id) {
      next(new Errors.ActivityError('The id parameter of the folder is undefined', req.params));
      return;
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
        next(new Errors.ApiError('There was an error when requesting data extensions from marketing cloud', 'marketingcloud', error));
      } else {
        res.send(200, result.body.Results);
      }
    });
  };

  helper.dataExtensionColumn = function(req, res, next) {
    if (!req.params.key) {
      next(new Errors.ActivityError('The key parameter of the data extension is undefined', req.params));
      return;
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
        next(new Errors.ApiError('There was an error when requesting columns from marketing cloud', 'marketingcloud', error));
      } else {
        res.send(200, result.body.Results);
      }
    });
  };

  return helper;
};

module.exports = Helper;
