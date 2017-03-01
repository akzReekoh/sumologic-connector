'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isPlainObject = require('lodash.isplainobject')
let request = require('request')

let sendData = (data, callback) => {
  request.post({
    url: _plugin.config.httpSource,
    body: JSON.stringify(data)
  }, (error) => {
    if (error) {
      _plugin.log(JSON.stringify({
        title: 'Data saved to Sumologic.',
        data: data
      }))
    }

    callback(error)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data: ' + data))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  _plugin.log('Sumologic Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
