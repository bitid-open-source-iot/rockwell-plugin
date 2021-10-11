const Q = require('q')
const chai = require('chai');
const subset = require('chai-subset');

chai.use(subset);


describe.only('kGateway', function () {
    global.__settings = require('../config.json');
    let KGATEWAY = require('../lib/kGateway')
    let kGateway
    it('Run kGateway', function (done) {
        kGateway = new KGATEWAY({ "tagFixedTxTime": 1 })
        kGateway.clearTags({})
        done()
    })

    it('process first tag', async function () {
        let topic = "kbeacon/publish/68B9D3DFE78C"
        // let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
        let message = JSON.stringify({
        msg: 'advData',
        gmac: '68B9D3DFE78C',
        obj: [
          {
            type: 4,
            dmac: 'DD3304130897',
            uuid: '7777772E6B6B6D636E2E636F6D000001',
            majorID: 2,
            minorID: 30025,
            refpower: -59,
            rssi: -65,
            time: '2021-10-08 13:42:48'
          }]})
        let response = { topic, message }
        response = await kGateway.processData(response)
        response = await kGateway.listTags(response)

        response.arrTags[0].txCount.should.equal(1)
        response.arrTags.length.should.equal(1)
    })


    it('process first tag again', async function () {
        let topic = "kbeacon/publish/68B9D3DFE78C"
        // let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "AAAAAAAAAAAA", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
        let message = JSON.stringify({
            msg: 'advData',
            gmac: '68B9D3DFE78C',
            obj: [
              {
                type: 4,
                dmac: 'DD3304130897',
                uuid: '7777772E6B6B6D636E2E636F6D000001',
                majorID: 2,
                minorID: 30025,
                refpower: -59,
                rssi: -65,
                time: '2021-10-08 13:42:48'
              }]})        
        let response = { topic, message }
        response = await kGateway.processData(response)
        response = await kGateway.listTags(response)

        // response.arrTags[0].txCount.should.equal(1)
        // response.arrTags.length.should.equal(1)
    })

    it('process second tag', async function () {
        let topic = "kbeacon/publish/68B9D3DFE78C"
        let message = JSON.stringify({
            "msg":"advData",
            "gmac":"68B9D3DFE78C",
            "obj":[
               {
                  "type":4,
                  "dmac":"DD3304130897",
                  "refPwr":-14,
                  "nid":"6B6B6D636E2E636F6D01",
                  "sid":"000000000001",
                  "rssi":-60,
                  "time":"2021-05-20 18:12:48"
               }
            ]
         })
        let response = { topic, message }
        response = await kGateway.processData(response)
        response = await kGateway.listTags(response)

        // response.arrTags[1].txCount.should.equal(1)
        // response.arrTags.length.should.equal(2)
    })


    it('process router alive message', async function () {
        let topic = "kbeacon/publish/68B9D3DFE78C"
        let message = JSON.stringify({
            "msg":"alive",
            "gmac":"68B9D3DFE78C",
            "ver":"KBGW_V3.5.3",
            "subaction":"kbeacon/subaction/68B9D3DFE78C",
            "pubaction":"kbeacon/pubaction/68B9D3DFE78C",
            "downDevices":0,
            "blever":"v24.3",
            "hver":"514",
            "temp":22,
            "advDevices":1
         })
        let response = { topic, message }
        response = await kGateway.processData(response)
        response = await kGateway.listTags(response)

        // response.arrTags[1].txCount.should.equal(1)
        // response.arrTags.length.should.equal(3)
    })

    //message:

    it('wait just over 1 minute and check fixed Tx been done for second tags', async function () {
        this.timeout(70000)
        function wait() {
            let deferred = Q.defer()
            setTimeout(async () => {
                let topic = "kbeacon/publish/68B9D3DFE78C"
                // let message = JSON.stringify({ "msg": "advData", "gmac": "68B9D3DFE78C", "obj": [{ "type": 2, "dmac": "FFFFFFFFFFFF", "refPwr": -14, "nid": "6B6B6D636E2E636F6D01", "sid": "000000000001", "rssi": -60, "time": "2021-05-20 18:12:48" }, { "type": 16, "dmac": "FFFFFFFFFFFF", "refPwr": -14, "url": "00696F742D6770732E636F2E7A61", "rssi": -64, "time": "2021-05-20 18:12:49" }] })
                let message = JSON.stringify({
                    msg: 'advData',
                    gmac: '68B9D3DFE78C',
                    obj: [
                      {
                        type: 4,
                        dmac: 'AAAAAAAAAAAA',
                        uuid: '7777772E6B6B6D636E2E636F6D000001',
                        majorID: 2,
                        minorID: 30025,
                        refpower: -59,
                        rssi: -65,
                        time: '2021-10-08 13:42:48'
                      },
                      {
                        type: 4,
                        dmac: 'DD33041332FE',
                        uuid: '7777772E6B6B6D636E2E636F6D000001',
                        majorID: 2,
                        minorID: 29988,
                        refpower: -59,
                        rssi: -59,
                        time: '2021-10-08 13:42:48'
                      },
                      {
                        type: 4,
                        dmac: 'DD33041332F8',
                        uuid: '7777772E6B6B6D636E2E636F6D000001',
                        majorID: 2,
                        minorID: 29982,
                        refpower: -59,
                        rssi: -78,
                        time: '2021-10-08 13:42:48'
                      }]})                   
                let response = { topic, message }
                response = await kGateway.processData(response)
                deferred.resolve()
            }, 65000);
            return deferred.promise
        }

        console.log('wait just over 1 minute and check fixed Tx been done for both tags')
        await wait()

        let response = { topic, message }
        response = await kGateway.processData(response)

        // let response = {}
        // response = await kGateway.listTags(response)
        // response.arrTags[0].txCount.should.equal(1)
        // response.arrTags[1].txCount.should.equal(2)
        // response.arrTags.length.should.equal(3)

    })

    // describe('Connect', function () {

    //     it('MQTT Socket', function (done) {
    //         this.timeout(5000);

    //         mqtt = MQTT.connect([config.mqttKGateway.socket, ':', config.mqttKGateway.port].join(''), {
    //             'host': config.mqttKGateway.socket,
    //             'port': config.mqttKGateway.port,
    //             'username': config.mqttKGateway.username,
    //             'password': config.mqttKGateway.password
    //         });

    //         mqtt.on('connect', () => {
    //             let message = JSON.stringify({"msg":"advData","gmac":"68B9D3DFE78C","obj":[{"type":2,"dmac":"DD3304130897","refPwr":-14,"nid":"6B6B6D636E2E636F6D01","sid":"000000000001","rssi":-60,"time":"2021-05-20 18:12:48"},{"type":16,"dmac":"DD3304130897","refPwr":-14,"url":"00696F742D6770732E636F2E7A61","rssi":-64,"time":"2021-05-20 18:12:49"}]})
    //             mqtt.publish('kbeacon/publish/68B9D3DFE78C', message)
    //             done();
    //         });
    //     });

    // })

    // describe('Check', function () {

    // })




})