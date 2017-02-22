'use strict';

module.exports = function(Devicemessage) {
	Devicemessage.deleteAllDeviceMessages = (deviceToken,cb) => {
		let filter = {
			deviceTokenId: deviceToken
		};

		let action = {
			deleted: true
		};

		Devicemessage.updateAll(filter,action,cb);
	};
};
