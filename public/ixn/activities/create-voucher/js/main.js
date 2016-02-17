requirejs.config({
    paths: {
        vendor: '../vendor',
		postmonger: 'vendor/postmonger'
    },
    shim: {
        'vendor/jquery.min': {
            exports: '$'
        },
		'CreateVoucher': {
			deps: ['vendor/jquery.min', 'vendor/postmonger']
		}
    }
});

requirejs( ['vendor/jquery.min', 'CreateVoucher'], function( $, CreateVoucher ) {
    $('#btn').on('click', function() {
        alert('Button I Am');
    });  
});

requirejs.onError = function( err ) {
	//console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};