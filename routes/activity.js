'use strict';
var https         = require('https');
var activityUtils = require('./activityUtils');
var config        = require('config');
var SfmcClient    = require('../lib/sfmc/sfmcClient');

var Activity = function () {
var sfmcClient = new SfmcClient(config);

  return {
    execute: function( req, res ) {
        console.log("================");
        console.log('ROUTE = EXECUTE');
        console.log("================");
        //activityUtils.logData( req );

        var aArgs = req.body.inArguments;
        var oArgs = {};

        for (var i=0; i<aArgs.length; i++) {
        for (var key in aArgs[i]) {
            oArgs[key] = aArgs[i][key];
          }
        }

        // TODO: Implement request to Voucher API
        var voucherCode = "TEST_CODE_" + oArgs.voucher.amount;

        var primaryKeyValue = oArgs.emailAddress;
        var dataExtensionKey = oArgs.dataExtensionKey;
        var primaryKeyField = oArgs.dataExtensionPrimaryKey;
        var voucherCodeField = oArgs.dataExtensionVoucherField;

        var keys = {}, values = {};
        keys[primaryKeyField] = primaryKeyValue;
        values[voucherCodeField] = voucherCode;

        var options = {
          dataExtensionKey: dataExtensionKey,
          keys: keys,
          values: values
        };

        console.log('Auth URL: ' + config.auth.authUrl);
        console.log('ClientID: ' + config.auth.clientId);
        console.log('Secret: ' + config.auth.clientSecret);

        var row = sfmcClient.dataExtensionRow(options);
        row.post(function (error, request, body) {
           if (error) {
               console.log("ERROR...");
               console.log(error);
               
             res.send( 500, error );
           } else if (body.errorcode) {
               console.log("ERROR CODE...");
               console.log(body);
                res.send( 500, body );
           } else {
             res.send( 200, body );
           }
        });
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
        //activityUtils.logData( req );
        
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
