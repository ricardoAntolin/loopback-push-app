module.exports = (Installation) => {
	Installation.enrollDevice = (deviceTokenId, deviceType, cb) => {
		let app = Installation.app;
		let DeviceMessage = app.models.DeviceMessage;
		let Message = app.models.Message;
		let installation = new Installation({
			appId: 'web.loopback-push-server-app',
			appVersion: "1.0",
			badge: 0,
			created: new Date(),
			deviceToken: deviceTokenId,
			deviceType: deviceType,
			modified: new Date(),
		});
		let filter = {
			where: {
				deviceToken: deviceTokenId
			}
		}
		Installation.find(filter, (err, list) => {
			if (err) cb(err);
			if (list.length) {
				list[0].badge = 0;
				Installation.updateOrCreate(list[0], (err, obj) => {
					if (err) cb(err);
					cb(null,obj);
				});
			} else {
				Installation.create(installation, (err, obj) => {
					if (err) cb(err);
					Message.find('', (err, messageList) => {
						if (err) cb(err);
						messageList.map(message => {
							var deviceMessage = new DeviceMessage({
								deviceTokenId: obj.deviceToken,
								messageId: message.id,
								read: false,
								sent: false,
								deleted: false
							});
							DeviceMessage.create(deviceMessage, (err, response) => {
								if (err) cb(err);
							})
						});
					});
					cb(null,obj);
				});
			}
		});
	};
}