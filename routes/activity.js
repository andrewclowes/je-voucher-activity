'use strict';

var config        = require('konfig')();
var https         = require('https');
var activityUtils = require('./activityUtils');

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
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

    var voucherCode = "TEST_CODE_" + oArgs.amount;

    res.send( 200, {"voucherCode": voucherCode} );
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log("================");
    console.log('ROUTE = PUBLISH');
    console.log("================");
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log("================");
    console.log('ROUTE = VALIDATE');
    console.log("================");
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};
