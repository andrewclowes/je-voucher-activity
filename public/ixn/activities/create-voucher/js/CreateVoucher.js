define( function( require ) {
	var Postmonger = require( 'postmonger' );
	var $ = require('vendor/jquery.min');

    var connection = new Postmonger.Session();
	var tokens;
	var endpoints;
    var toJbPayload = {};

    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var amount;
        
        if(payload) {
            toJbPayload = payload;
            
            console.log('payload', toJbPayload);
            
            var inArgs = toJbPayload['arguments'].execute.inArguments;
            var loadedArgs = {};
            
            for(var i = 0; i < inArgs.length; i++) {
                for(var key in inArgs[i]) {
                    loadedArgs[key] = inArgs[i][key];
                }
            }
            
            amount = loadedArgs.amount || toJbPayload['configurationArguments'].defaults.amount;
            
            $('#voucher_amount').val(amount);
        }
    });

	// This listens for Journey Builder to send tokens
	// Parameter is either the tokens data or an object with an
	// "error" property containing the error message
	connection.on('getTokens', function( data ) {
		if( data.error ) {
			console.error( data.error );
		} else {
			tokens = data;
		}
	});
    
	// This listens for Journey Builder to send endpoints
	// Parameter is either the endpoints data or an object with an
	// "error" property containing the error message
	connection.on('getEndpoints', function( data ) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
		}
	});

    connection.on('requestPayload', function() {
        console.log('[JB] requestPayload event fired');
        
        var payload = { 'options': {} };
        
        //TODO: Shouldn't this come from the data? Maybe
        payload.flowDisplayName = 'Create Voucher';

        connection.trigger('getPayload', payload);
    });

	// Journey Builder broadcasts this event to us after this module
	// sends the "ready" method. JB parses the serialized object which
	// consists of the Event Data and passes it to the
	// "config.js.save.uri" as a POST
    connection.on('populateFields', function(payload) {
        console.log('[JB] populateFields event fired');
    });
    
    // Fires when document has loaded
    function onRender() {
        alert('Loaded!');
        
        console.log('onRender event fired');
        
        connection.trigger('ready');
		connection.trigger('requestTokens');
		connection.trigger('requestEndpoints');
        
        $('#voucher_amount').on('change', function() {
            $('p.amount').text($('#voucher_amount').val());
        });
        
        connection.trigger('updateButton', { button: 'save', text: 'chickens', visible: true });
    }
    
    function save() {
        console.log('save event fired');
        
        var amount = 0.99;// $('#voucher_amount').val();
        
        toJbPayload['arguments'].execute.inArguments.push({'amount': amount});
        toJbPayload.metaData.isConfigured = true;
        
        connection.trigger('updateActivity', toJbPayload);
    }
});