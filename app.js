'use strict';
// Module Dependencies
// -------------------
var konfig        = require('konfig')();
var express       = require('express');
var http          = require('http');
var JWT           = require('./lib/jwtDecoder');
var path          = require('path');
var request       = require('request');
var routes        = require('./routes');
var activity      = require('./routes/activity');
var pkgjson       = require('./package.json');

var app = express();
var config = konfig.app;

// Register configs for the environments where the app functions
// , these can be stored in a separate file using a module like config
var APIKeys = {
    appId           : config.appId,
    clientId        : config.clientId,
    clientSecret    : config.clientSecret,
    appSignature    : config.appSignature,
    authUrl         : config.authUrl
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

// Use the cookie-based session  middleware
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

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// HubExchange Routes
app.get('/', routes.index );
app.post('/login', tokenFromJWT, routes.login );
app.post('/logout', routes.logout );

// Custom Create Voucher Activity Routes
//app.post('/ixn/activities/create-voucher/save', activity.save );
app.post('/ixn/activities/create-voucher/validate', activity.validate );
app.post('/ixn/activities/create-voucher/publish', activity.publish );
app.post('/ixn/activities/create-voucher/execute', activity.execute );

app.get( '/version', function( req, res ) {
	res.setHeader( 'content-type', 'application/json' );
	res.send(200, JSON.stringify( {
		version: pkgjson.version
	} ) );
} );

app.get('/health/check', function(req, res) {
   res.render('check', {});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});