'use strict';

var https         = require('https');
var activityUtils = require('./activityUtils');
var fuel          = require('fuel');

var Activity = function (config) {
  var fuelClient = fuel.configure({
    authUrl: config.authUrl,
    clientId: config.clientId,
    clientSecret: config.clientSecret
  });

  return {
    execute: function( req, res ) {
        console.log("============================");
        console.log('ROUTE = EXECUTE');
        console.log("============================");
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

        // fuelClient({
        //   ""
        // }, function (error, request, body) {
        //   console.log(error);
        //   console.log(request);
        //   console.log(body);
        // });

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
