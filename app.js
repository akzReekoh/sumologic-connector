'use strict';

var domain   = require('domain'),
	request  = require('request'),
	platform = require('./platform'),
	httpSource;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	var d = domain.create();

	d.once('error', function (error) {
		platform.handleException(error);
	});

	d.run(function () {
		request.post({
			url: httpSource,
			body: data
		}, function (error, response, body) {
			if (error)
				platform.handleException(error);
			else {
				platform.log(JSON.stringify({
					title: 'Data saved to Sumologic.',
					data: data
				}));
			}

			d.exit();
		});
	});
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	httpSource = options.http_source;

	platform.log('Sumologic Connector initialized.');
	platform.notifyReady();
});