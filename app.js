'use strict';

var platform = require('./platform'),
    request = require('request'),
    isJSON = require('is-json'),
	httpSource;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
    if(isJSON(data, true))
        data = JSON.stringify(data);

    request.post({
        url: httpSource,
        body:data
    }, function(error, response, body){
        if(error) platform.handleException(error);
        else{
            platform.log(JSON.stringify({
                title: 'Data saved to Sumologic.',
                data: data
            }));
        }
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