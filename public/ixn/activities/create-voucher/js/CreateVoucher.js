define( function( require ) {
	var Postmonger = require( 'postmonger' );
	var $ = require('vendor/jquery.min');

    var connection = new Postmonger.Session();
	var tokens;
	var endpoints;
    var toJbPayload = {};
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', onInitActivity);
    connection.on('clickedNext', onClickedSave);

    // connection.on('initActivity', function(payload) {
    //     var amount;
    //     
    //     if(payload) {
    //         toJbPayload = payload;
    //         
    //         console.log('payload', toJbPayload);
    //         
    //         var inArgs = toJbPayload['arguments'].execute.inArguments;
    //         var loadedArgs = {};
    //         
    //         for(var i = 0; i < inArgs.length; i++) {
    //             for(var key in inArgs[i]) {
    //                 loadedArgs[key] = inArgs[i][key];
    //             }
    //         }
    //         
    //         amount = loadedArgs.amount || toJbPayload['configurationArguments'].defaults.amount;
    //         
    //         $('#voucher_amount').val(amount);
    //     }
    // });
    
    function onInitActivity(data) {
        if(data) {
            payload = data;
        }
        
        var passedInArgs = payload['arguments'].execute.inArguments;
        var defaultArgs = payload['configurationArguments'].defaults;
        
        var amount = passedInArgs['amount'] || defaultArgs['amount'];
        
        $('#voucher_amount').val(amount);
        $('#payload').val(JSON.stringify(payload, null, 4));
    }
    
    function onClickedSave() {
        save();
    }
    
    // Fires when document has loaded
    function onRender() {
        console.log('onRender event fired');
        
        connection.trigger('ready');
		connection.trigger('requestTokens');
		connection.trigger('requestEndpoints');
        
        $('#voucher_amount').on('change', function() {
            $('p.amount').text($('#voucher_amount').val());
        });
    }
    
    function save() {
        alert('Saving...');
        var amount = $('#voucher_amount').val();
        
        payload.name = "Moo";
        payload['arguments'].execute.inArguments = [{ "amount": amount }];
        payload['metaData'].isConfigured = true;
        
        connection.trigger('updateActivity', payload);
        
        alert('Saved.');
    }
});