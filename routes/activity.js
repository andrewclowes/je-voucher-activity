'use strict';
var https         = require('https');
var activityUtils = require('./activityUtils');
var config        = require('config');
var moment        = require('moment');
var SfmcClient    = require('../lib/sfmc/sfmcClient');
var VoucherClient = require('../lib/voucherApi/voucherApiClient');

var Activity = function () {
  var activity = {};

  var sfmcClient = new SfmcClient(config);
  var voucherClient = new VoucherClient(config);

  var voucherTypeEnum = {
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

    requestVoucher(options, res, postVoucherToSfmc);
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

  function requestVoucher(options, res, next) {
    if (options.voucher == null) {
      res.send(500, {Message: 'Voucher options are not present in the request'});
    }

    var startDate = moment.utc();
    var endDate = moment(startDate).add(options.voucher.validForDays, "days");

    var voucherOptions = {
      Name: "Implicit Voucher Group",
      Discount: {
        VoucherType: voucherTypeEnum[options.voucher.type],
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
        res.send(500, error);
      } else if (response.statusCode != 200) {
        res.send(500, body);
      } else {
        var bodyObj = JSON.parse(body);
        if (bodyObj == null || bodyObj.Code == null) {
          res.send(500, {Message: 'There was no code returned from the Voucher Api'});
        }
        options.voucher.voucherCode = bodyObj.Code;
        next(options, res);
      }
    });
  }

  function postVoucherToSfmc(options, res) {
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
    row.post(function (error, request, body) {
       if (error) {
         res.send(500, error);
       } else if (body.errorcode) {
         res.send(500, body);
       } else {
         res.send(200, { voucherCode: options.voucher.voucherCode });
       }
    });
  }

  return activity;
};

module.exports = Activity;
