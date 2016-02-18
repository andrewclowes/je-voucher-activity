define([], function() {
    return {
        "workflowApiVersion": "1.0",
        //"partnerApiObjectTypeId": "IXN.CustomActivity.REST",
        "metaData": {
            "version": "2.0",
            "icon": "images/wallet-doodle.jpg",
            "iconSmall": "images/wallet-doodle.jpg"
        },
        "type": "REST",
        "lang": {
            "en-US": {
                "name": "Create Voucher",
                "description": "Activity that requests vouchers from within a journey"
            }
        },
        "arguments": {
            "execute": {
                "inArguments":[],
                "outArguments": [
                    { "voucherCode":"text" }
                ],
                "url": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/execute/",
                "verb": "POST",
                "body": "",
                "header": "",
                "format": "json",
                "useJwt": false,
                "timeout": 10000
            }
        },
        "configurationArguments": {
            "applicationExtensionKey": "je-voucher-create-activity",
            "defaults": { "amount": "10"},
            "save": {
                "url": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/save/",
                "body": "",
                "verb": "POST",
                "useJwt": false
            },
            "publish": {
                "url": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/publish/",
                "verb": "POST",
                "body": "",
                "useJwt": false
            },
            "validate": {
                "url": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/validate/",
                "verb": "POST",
                "body": "",
                "useJwt": false
            }
        },
        "edit": {
            "url": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/",
            "height": 400,
            "width": 500
        }
    }
})