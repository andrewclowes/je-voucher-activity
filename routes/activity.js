'use strict';

var https         = require('https');
var activityUtils = require('./activityUtils');
var config        = require('config');
var fuel          = require('fuel');

var Activity = function () {
  var fuelClient = fuel.configure({
      authUrl: config.authUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret
    });

  return {
    execute: function( req, res ) {
        console.log("================");
        console.log('ROUTE = EXECUTE');
        console.log("================");
        activityUtils.logData( req );

        var aArgs = req.body.inArguments;
        var oArgs = {};

        for (var i=0; i<aArgs.length; i++) {
        for (var key in aArgs[i]) {
            oArgs[key] = aArgs[i][key];
          }
        }

        // TODO: Implment request to Voucher API
        var voucherCode = "TEST_CODE_" + oArgs.amount;

        var primaryKey = "1";

        var dataExtensionKey = "voucher_codes_test";
        var primaryKeyField = "customer_key";
        var voucherCodeField = "voucher_code";

        var keys = {};
        keys[primaryKeyField] = primaryKey;

        var values = {};
        values[voucherCodeField] = voucherCode;

        var requestBody = [
          {
            "keys": keys,
            "values": values
          }
        ];

        var dataExtensionUrl = config.sfmcBaseUrl + '/hub/v1/dataevents/key:' + dataExtensionKey + '/rowset/';
        console.log(dataExtensionUrl);
        console.log(requestBody);

        fuelClient({
          url: dataExtensionUrl,
          body: requestBody,
          method: 'POST'
        }, function (error, request, body) {
          console.log(body);
        });

        res.send( 200 );
    },
    save: function( req, res ) {
        console.log("================");
        console.log('ROUTE = SAVE');
        console.log("================");
        activityUtils.logData( req );
        res.send( 200, 'Save' );
    },
    publish: function( req, res ) {
        console.log("================");
        console.log('ROUTE = PUBLISH');
        console.log("================");
        activityUtils.logData( req );
        res.send( 200 );
    },
    validate: function( req, res ) {
        console.log("================");
        console.log('ROUTE = VALIDATE');
        console.log("================");
        activityUtils.logData( req );
        res.send( 200 );
    }
  };
};

module.exports = Activity;
