define( function( require ) {
	var Postmonger = require( 'postmonger' );
	var $ = require('jquery');

    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [
        { "label": "Choose Data Extension", "key": "step1" },
        { "label": "Configure Voucher", "key": "step2" },
        { "label": "Confirm", "key": "step3", "active": false }    
    ];
    var currentStep = steps[0].key;

    $(window).ready(onDocumentReady);

    connection.on('initActivity', onInitActivity);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onDocumentReady() {
        setupUI();
        
        connection.trigger('ready');
    }
    
    function setupUI() {
        $('#voucher_type').on('change', function() {
            voucherTypeChanged();
        });
        
        $('#voucher_type').trigger('change');
    }
    
    function voucherTypeChanged(voucherType) {
        var voucherType = $('#voucher_type').val();
        
        $('div.voucher-type').hide();
        
        if(voucherType == 1) {
            $('#voucher_type_fixed').show();
        } else {
            $('#voucher_type_percent').show();
        }
    }
    
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
            
            var dataExtensionName = existingArgs.dataExtensionName;
            var dataExtensionColumn = existingArgs.dataExtensionColumn;
            var amount = existingArgs.amount || defaultArgs['amount'];
            
            $('#de_name').val(dataExtensionName);
            $('#de_column').val(dataExtensionColumn);
            $('#voucher_amount').val(amount);
        }
    }
    
    function onClickedNext() {
        if(currentStep.key === 'step3') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }
    
    function onClickedBack() {
        connection.trigger('prevStep');
    }
    
    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
    }
    
    function showStep(step, stepIndex) {
        if(stepIndex && !step) {
            step = steps[stepIndex-1];
        }
        
        currentStep = step;
        
        $('.step').hide();
        $('#' + currentStep.key).show();
    }
    
    function save() {
        var dataExtensionName = $('#de_name').val();
        var dataExtensionColumn = $('#de_column').val();
        var amount = $('#voucher_amount').val();
        
        payload.name = '£' + amount + ' voucher';
        payload['arguments'].execute.inArguments = [{ "dataExtensionName": dataExtensionName, "dataExtensionColumn": dataExtensionColumn, "amount": amount }];
        payload['metaData'].isConfigured = true;
        
        connection.trigger('updateActivity', payload);
    }
});