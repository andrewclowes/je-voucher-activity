define( function( require ) {
	var Postmonger = require( 'postmonger' );
	var $ = require('vendor/jquery.min');

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onDocumentReady);

    connection.on('initActivity', onInitActivity);
    connection.on('clickedNext', onClickedSave);

    function onInitActivity(data) {
        if(data) {
            payload = data;
        
            var defaultArgs = payload['configurationArguments'].defaults;
            
            var passedInArgs = payload['arguments'].execute.inArguments;
            var existingArgs = {};
            
            for(var i = 0; i < passedInArgs.length; i++) {
                for(var key in passedInArgs[i]) {
                    existingArgs[key] = passedInArgs[i][key];
                }
            }
            
            var amount = existingArgs.amount || defaultArgs['amount'];
            
            $('#voucher_amount').val(amount);
            $('pre').text(JSON.stringify(existingArgs, null, 4));
        }
    }
    
    function onClickedSave() {
        var amount = $('#voucher_amount').val();
        
        payload['arguments'].execute.inArguments = [{ "amount": amount }];
        payload['metaData'].isConfigured = true;
        
        connection.trigger('updateActivity', payload);
    }
    
    function onDocumentReady() {
        connection.trigger('ready');
		//connection.trigger('requestTokens');
		//connection.trigger('requestEndpoints');
        
        $('#voucher_amount').on('change', function() {
            $('p.amount').text($('#voucher_amount').val());
        });
    }
});