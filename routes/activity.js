'use strict';
var async         = require('async');
var activityUtils = require('./activityUtils');
var config        = require('config');
var moment        = require('moment');
var SfmcClient    = require('../lib/sfmc/sfmcClient');
var VoucherClient = require('../lib/voucherApi/voucherApiClient');
var statsdClientFactory = require('../lib/statsd/statsdClientFactory');

var Activity = function () {
  var activity = {};

  var statsdClient = new statsdClientFactory.create(config);
  var sfmcClient = new SfmcClient(config, statsdClient);
  var voucherClient = new VoucherClient(config);

  var voucherTypes = {
    1: 'Absolute',
    2: 'Percentage'
  };

  activity.execute = function(req, res) {
    activityUtils.logData(req);

    var args = req.body.inArguments;
    var options = {};
    for (var i = 0; i < args.length; i++) {
      for (var key in args[i]) {
        options[key] = args[i][key];
      }
    }

    if (options.voucher == null) {
      res.send(500, {Message: 'Voucher options are not present in the request'});
    }

    async.waterfall([function(callback) { callback(null, options); }, requestVoucher, postVoucherToSfmc],
      function (error, result) {
        if (error) {
          res.send(500, error);
        } else {
          res.send(200, result);
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
        callback(error);
      } else if (response.statusCode != 200) {
        callback(body);
      } else {
        var bodyObj = JSON.parse(body);
        if (bodyObj == null || bodyObj.Code == null) {
          callback({ Message: 'There was no code returned from the Voucher Api' });
        }
        options.voucher.voucherCode = bodyObj.Code;
        callback(null, options);
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
        callback(error);
      } else if (response.res != null && response.res.statusCode != 200) {
        callback(response);
      } else {
        callback(null, { voucherCode: options.voucher.voucherCode });
      }
    });
  }

  return activity;
};

module.exports = Activity;
