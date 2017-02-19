'use strict';

module.exports = function(Devicemessage) {
	Devicemessage.deleteAllDeviceMessages = (deviceToken,cb) => {
		let filter = {
			deviceTokenId: deviceToken
		}
		let action = {
			deleted: true
		}

		Devicemessage.updateAll(filter,action,cb);
	};

	Devicemessage.remoteMethod('deleteAllDeviceMessages', {
		accepts: {args: 'deviceToken', type: 'string'},
		returns: {arg: 'count', type: 'number', root: true},
    	http: {verb: 'get', path: '/deleteAllDeviceMessages'}
	})
};
