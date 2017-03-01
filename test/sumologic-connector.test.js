'use strict'

const amqp = require('amqplib')

const HTTP_SOURCE = 'https://endpoint1.collection.us2.sumologic.com/receiver/v1/http/ZaVnC4dhaV2Go4vCe8vI_ksTgTInUF3ya_0v7vQ7RrTo3qbbA08VxSaJAM1XQe_lnTSbvB460lfPKJPOgD-xQo14-uLkRg9C6V4rwdkNKbMWOMxUzfmsoQ=='

let _channel = null
let _conn = null
let app = null

describe('SumoLogic Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      httpSource: HTTP_SOURCE
    })
    process.env.INPUT_PIPE = 'ip.sumologic'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        title:'Test message',
        message:'This is a test JSON message from Sumologic Connector.'
      }

      _channel.sendToQueue('ip.sumologic', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
