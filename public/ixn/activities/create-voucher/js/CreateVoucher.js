define( function( require ) {
	var Postmonger = require( 'postmonger' );
	var $ = require('jquery');

    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [
        { "label": "Choose Data Extension", "key": "step1" },
        { "label": "Configure Voucher", "key": "step2", "active": false },
        { "label": "Confirm", "key": "step3", "active": false }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onDocumentReady);

    // Postmonger events from SFMC
    connection.on('initActivity', onInitActivity);
    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onDocumentReady() {
        setupUI();

        connection.trigger('ready');
        //connection.trigger('updateButton', { button: 'next', enabled: false });
    }

    function setupUI() {
        // Voucher type
        $('input[name=voucher_type]').on('change', function() {
            voucherTypeChanged();
        });

        $('input[name=voucher_type]').trigger('change');
    }

    function voucherTypeChanged() {
        var voucherType = getVoucherType();

        $('div.voucher-type').hide();

        if(voucherType == 1) {
            $('#voucher_type_fixed').show();
        } else {
            $('#voucher_type_percent').show();
        }
    }

    function getVoucherType() {
        return $('input[name=voucher_type]:checked').val();
    }
    function getVoucherAmount() {
        if(getVoucherType() == 1) {
            return $('#voucher_fixed_amount').val();
        }

        return $('#voucher_percent_amount').val();
    }
    function getVoucherValidForDays() {
        return $('#voucher_valid_days').val();
    }
    function getVoucherMinimumSpend() {
        return $('#voucher_minimum_spend').val();
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

            var dataExtensionKey = existingArgs.dataExtensionKey;
            var dataExtensionPrimaryKey = existingArgs.dataExtensionPrimaryKey;
            var dataExtensionVoucherField = existingArgs.dataExtensionVoucherField;
            var amount = existingArgs.amount || defaultArgs['amount'];

            $('#de_key').val(dataExtensionKey);
            $('#de_pkfield').val(dataExtensionPrimaryKey);
            $('#de_voucherfield').val(dataExtensionVoucherField);
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
        // Data Extension
        var dataExtensionKey = $('#de_key').val();
        var dataExtensionPrimaryKeyField = $('#de_pkfield').val();
        var dataExtensionVoucherField = $('#de_voucherfield').val();

        // Voucher attributes
        var voucherType = getVoucherType();
        var voucherAmount = getVoucherAmount();
        var voucherValidForDays = getVoucherValidForDays();
        var voucherMinimumSpend = getVoucherMinimumSpend();

        var voucherPayload = {
            'type': voucherType,
            'amount': voucherAmount,
            'platforms': 'mobile|web',
            'validForDays': voucherValidForDays,
            'minimumSpend': voucherMinimumSpend
        }

        payload['arguments'].execute.inArguments.push({'dataExtensionKey': dataExtensionKey}, {'dataExtensionPrimaryKey': dataExtensionPrimaryKeyField}, {'dataExtensionVoucherField': dataExtensionVoucherField });
        payload['arguments'].execute.inArguments.push({'voucher': voucherPayload});

        payload.name = (voucherType == 1 ? '£' + voucherAmount : voucherAmount + '%') + ' voucher';

        payload['metaData'].isConfigured = true;

        connection.trigger('updateActivity', payload);
    }
});
