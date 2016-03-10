'use strict';
var async             = require('async');
var activityUtils     = require('./activityUtils');
var config            = require('config');
var moment            = require('moment');
var SfmcClient        = require('../lib/sfmc/sfmcClient');
var VoucherClient     = require('../lib/voucherApi/voucherApiClient');
var createStatsClient = require('../lib/statsd/statsdClient');
var Errors            = require('../lib/utilities/errors');

var Activity = function () {
  var activity = {};

  var statsdClient = createStatsClient(config);
  var sfmcClient = new SfmcClient(config, statsdClient);
  var voucherClient = new VoucherClient(config, statsdClient);

  var voucherTypes = {
    1: 'Absolute',
    2: 'Percentage'
  };

  activity.execute = function(req, res, next) {
    activityUtils.logData(req);

    var args = req.body.inArguments;
    var options = {};
    for (var i = 0; i < args.length; i++) {
      for (var key in args[i]) {
        options[key] = args[i][key];
      }
    }

    var err = options.voucher == null
      ? new Errors.ActivityError('Voucher options are not present in the request', req.body)
      : null;

    async.waterfall([function(callback) { callback(err, options); }, requestVoucher, postVoucherToSfmc],
      function (error, result) {
        if (!error) {
          res.send(200, result);
        } else {
          next(error);
        }
      });
  };

  activity.save = function(req, res) {
    activityUtils.logData(req);
    res.send(200, 'Save');
  };

  activity.publish = function(req, res) {
    activityUtils.logData(req);
    res.send(200, 'Publish');
  };

  activity.validate = function(req, res) {
    activityUtils.logData(req);
    res.send(200, 'Validate');
  };

  function requestVoucher(options, callback) {
    var startDate = moment.utc();
    var endDate = moment(startDate).add(options.voucher.validForDays, "days");

    var voucherOptions = {
      Name: "Implicit Voucher Group",
      Discount: {
        VoucherType: voucherTypes[options.voucher.type],
        Amount: options.voucher.amount
      },
      Validity: {
        StartDate: startDate.toISOString(),
        EndDate: endDate.toISOString(),
        Platform: options.voucher.platforms.join('|'),
        MinimumSpend: options.voucher.minimumSpend
      }
    };

    var vouchers = voucherClient.vouchers();
    vouchers.postVoucher(config.tenant, voucherOptions, function(error, response, body) {
      if (error) {
        callback(new Errors.ApiError('There was an error when trying to communicate with Voucher Api', 'voucherapi', error));
      } else if (response.statusCode != 200) {
        callback(new Error.ApiError('There was an issue requesting vouchers from the Voucher Api', 'voucherapi', body));
      } else {
        var bodyObj = JSON.parse(body);
        if (bodyObj == null || bodyObj.Code == null) {
          callback(new Errors.ApiError('There was no code returned from the Voucher Api', 'voucherapi', bodyObj));
        } else {
          options.voucher.voucherCode = bodyObj.Code;
          callback(null, options);
        }
      }
    });
  }

  function postVoucherToSfmc(options, callback) {
    var primaryKeyValue = options.emailAddress;
    var dataExtensionKey = options.dataExtensionKey;
    var primaryKeyField = options.dataExtensionPrimaryKey;
    var voucherCodeField = options.dataExtensionVoucherField;

    var keys = {}, values = {};
    keys[primaryKeyField] = primaryKeyValue;
    values[voucherCodeField] = options.voucher.voucherCode;

    var sfmcOptions = {
      dataExtensionKey: dataExtensionKey,
      keys: keys,
      values: values
    };

    var row = sfmcClient.dataExtensionRow(sfmcOptions);
    row.post(function (error, response) {
      if (error) {
        callback(new Errors.ApiError('There was an error when trying to communicate with marketing cloud', 'marketingcloud', error));
      } else if (response.res != null && response.res.statusCode != 200) {
        callback(new Errors.ApiError('There was an issue push data to marketing cloud', 'marketingcloud', response.body));
      } else {
        callback(null, { voucherCode: options.voucher.voucherCode });
      }
    });
  }

  return activity;
};

module.exports = Activity;
