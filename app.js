'use strict';

var request       = require('request'),
	platform = require('./platform'),
	isPlainObject = require('lodash.isplainobject'),
	isArray = require('lodash.isarray'),
	async = require('async'),
	httpSource;

let sendData = (data) => {
	request.post({
		url: httpSource,
		body: JSON.stringify(data)
	}, function (error) {
		if (error)
			platform.handleException(error);
		else {
			platform.log(JSON.stringify({
				title: 'Data saved to Sumologic.',
				data: data
			}));
		}
	});
};

platform.on('data', function (data) {
	if (isPlainObject(data)) {
		sendData(data);
	}
	else if(isArray(data)){
		async.each(data, (datum) => {
			sendData(datum);
		});
	}
	else
		platform.handleException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data: ' + data));
});

platform.on('close', function () {
	platform.notifyClose();
});

platform.once('ready', function (options) {
	httpSource = options.http_source;

	platform.log('Sumologic Connector initialized.');
	platform.notifyReady();
});