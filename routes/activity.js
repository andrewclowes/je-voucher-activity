'use strict';

var config        = require('konfig')();
var https         = require('https');
var activityUtils = require('./activityUtils');

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log('ROUTE = EDIT');
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log('ROUTE = SAVE');
    activityUtils.logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log('ROUTE = EXECUTE');
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
    console.log('ROUTE = PUBLISH');
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log('ROUTE = VALIDATE');
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};
