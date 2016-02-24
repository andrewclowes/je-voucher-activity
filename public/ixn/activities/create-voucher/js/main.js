require.config({
    paths: {
        'vendor': '../vendor',
        'postmonger': 'vendor/postmonger',
        'bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min',
        'fuelux': '//www.fuelcdn.com/fuelux/3.13.0/js/fuelux.min',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
		'CreateVoucher': {
			deps: ['jquery', 'vendor/postmonger']
		}
    }
});

// requirejs( ['vendor/jquery.min', 'CreateVoucher'], function( $, CreateVoucher ) {
//     // Do something with jQuery.... 
// });

require.onError = function( err ) {
	//console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};

require(['jquery', 'bootstrap', 'fuelux', 'CreateVoucher'], function($){});