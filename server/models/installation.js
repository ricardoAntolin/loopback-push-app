module.exports = (Installation) => {
	Installation.enrollDevice = (deviceTokenId, deviceType, cb) => {
		let installation = new Installation({
			appId: 'web.loopback-push-server-app',
			appVersion: "1.0",
			badge: 0,
			created: new Date(),
			deviceToken: deviceTokenId,
			deviceType: deviceType,
			modified: new Date(),
		});
		Installation.create(installation,cb);
	};
}