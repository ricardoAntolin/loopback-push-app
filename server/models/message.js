'use strict';
var assert = require('assert');
var async = require('async');

module.exports = (Message) => {

	Message.observe('before save', (ctx, next) => {
		var app = Message.app;
		if (ctx.isNewInstance) {
			Message.count((err, count) => {
				if (err) throw err;
				ctx.instance.id = count + 1;
				next();
			})
		}
	});

	Message.observe('after save', (ctx, next) => {
		var app = Message.app;
		var Push = app.models.push;
		var Installation = app.models.installation;
		var Notification = app.models.notification;
		var DeviceMessage = app.models.device_message;
		var notification = new Notification({
			expirationInterval: 3600, // Expires 1 hour from now.
			badge: 0,
			sound: 'default',
			alert: 'new Message recieved',
			messageFrom: 'ASV'
		});

		_customNotifyByQuery((err) => {
			if (err) {
				console.error('Cannot notify %j: %s', err.stack);
				next(err);
				return;
			}
			console.log('pushing notification to All installations');
		});

		Push.on('error', (err) => {
			console.error('Push Notification error: ', err.stack);
		});

		next();

		function _customNotifyByQuery(cb) {
			assert.ok(cb, 'callback should be defined');
			Installation.find('', (err, installationList) => {
				if (err) return cb(err);
				installationList.map((installation) => {
					var deviceMessage = new DeviceMessage({
						deviceTokenId: installation.deviceToken,
						messageId: ctx.instance.id,
						sent: false,
						read: false,
						deleted: false
					});

					DeviceMessage.create(deviceMessage, (err, res) => {
						if (err) cb(err);
						installation.badge++;
						notification.badge = installation.badge;
						Push.notify(installation, notification, (err) => {
							if (err) cb(err);
							res.sent = true;
							Installation.updateOrCreate(installation, '',(err,obj) => {
								if(err) cb(err);
								cb();
							});
						});
					});
				});
			});
		};
	});

	Message.getDeviceMessages = (deviceToken, cb) => {

		let filter = {
			include: {
				relation: 'deviceMessages',
				scope: {
					where: {
						deviceTokenId: deviceToken
					}
				}
			}
		};

		Message.find(filter, cb);
	};
};