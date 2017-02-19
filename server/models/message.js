'use strict';

module.exports = (Message) => {
	Message.observe('before save', (ctx, next) => {
		var app = Message.app;
		if (ctx.isNewInstance) {
			Message.count((err, count) => {
				if (err) throw err;
				ctx.instance.id = count;
				next();
			})
		}
	});

	Message.observe('after save', (ctx, next) => {
		var app = Message.app;
		var PushModel = app.models.push;
		var Installation = app.models.installation;
		var Notification = app.models.Notification;
		var badge = 0;

		var notification = new Notification({
			expirationInterval: 3600, // Expires 1 hour from now.
			badge: badge++,
			sound: 'ping.aiff',
			alert: 'new Message recieved',
			messageFrom: 'ASV'
		});

		PushModel.notifyByQuery('', notification, (err) => {
			if (err) {
				console.error('Cannot notify %j: %s', err.stack);
				next(err);
				return;
			}
			console.log('pushing notification to All installations');
		});

		PushModel.on('error', (err) => {
			console.error('Push Notification error: ', err.stack);
		});

		next();
	});
};