define([], function(){
    return {
        "icon": "images/jb-icon.jpg",
        "iconSmall": "images/jb-icon.jpg",
        "key": "je-voucher-create-activity",
        "partnerApiObjectTypeId": "IXN.CustomActivity.REST",
        "lang": {
            "en-US": {
                "name": "Create Voucher",
                "description": "Activity that requests vouchers from within a journey"
            }
        },
        "category": "messaging",
        "version": "1.0",
        "apiVersion": "1.0",
       "execute": {
            "uri": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/execute/",
			"inArguments": [],
			"outArguments": [],
            "verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
		},
        "save": {
            "uri": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/save/",
			"verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "publish": {
            "uri": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/publish/",
            "verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },
        "validate": {
            "uri": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/validate/",
            "verb": "POST",
			"body": "",
            "format": "json",
            "useJwt": false,
            "timeout": 3000
        },

        "edit": {
            "uri": "https://je-voucher-activity.herokuapp.com/ixn/activities/create-voucher/",
            "height": 400,
            "width": 500
        }
};
});
