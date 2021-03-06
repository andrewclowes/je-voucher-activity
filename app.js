'use strict';
// Module Dependencies
// -------------------
var config              = require('config');
var express             = require('express');
var http                = require('http');
var JWT                 = require('./lib/jwtDecoder');
var path                = require('path');
var request             = require('request');
var activity            = require('./routes/activity');
var helper              = require('./routes/helper');
var pkgjson             = require('./package.json');
var createStatsClient   = require('./lib/statsd/statsdClient');
var createMonitor       = require('./lib/utilities/responseMonitor');
var createErrorHandler  = require('./lib/utilities/errorHandler');
var logger              = require('./lib/utilities/logger');

var app = express();
var act = activity();
var hel = helper();
var statsClient = createStatsClient(config);
var resMonitor = createMonitor(statsClient);
var errorHandler = createErrorHandler(statsClient);

var APIKeys = {
    appId           : config.appId,
    clientId        : config.auth.clientId,
    clientSecret    : config.auth.clientSecret,
    appSignature    : config.appSignature,
    authUrl         : config.auth.authUrl
};

// Simple custom middleware
function tokenFromJWT( req, res, next ) {
    // Setup the signature for decoding the JWT
    var jwt = new JWT({appSignature: APIKeys.appSignature});

    // Object representing the data in the JWT
    var jwtData = jwt.decode( req );

    // Bolt the data we need to make this call onto the session.
    // Since the UI for this app is only used as a management console,
    // we can get away with this. Otherwise, you should use a
    // persistent storage system and manage tokens properly with
    // node-fuel
    req.session.token = jwtData.token;
    next();
}

// Use the cookie-based session middleware
app.use(express.cookieParser());

// TODO: MaxAge for cookie based on token exp?
app.use(express.cookieSession({secret: "JeVoucherActivity-CookieSecret"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

// Custom Create Voucher Activity Routes
app.post('/ixn/activities/create-voucher/save', resMonitor.monitor("activity.save"), act.save);
app.post('/ixn/activities/create-voucher/validate', resMonitor.monitor("activity.validate"), act.validate);
app.post('/ixn/activities/create-voucher/publish', resMonitor.monitor("activity.publish"), act.publish);
app.post('/ixn/activities/create-voucher/execute', resMonitor.monitor("activity.execute"), act.execute);

// Custom helper routes for Custom Activity front-end
app.get('/ixn/helpers/folder/:id/folders', resMonitor.monitor("helpers.folders"), hel.folder);
app.get('/ixn/helpers/folder/:id/dataextensions', resMonitor.monitor("helpers.dataextensions"), hel.dataExtension);
app.get('/ixn/helpers/dataextension/:key/columns', resMonitor.monitor("helpers.columns"), hel.dataExtensionColumn);

app.get( '/version', function( req, res ) {
	res.setHeader( 'content-type', 'application/json' );
	res.send(200, JSON.stringify( {
		version: pkgjson.version
	}));
});

app.get('/health/check', function(req, res) {
   res.render('check', {});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
