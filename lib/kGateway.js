const Q = require('q')
const Mqtt = require('./mqtt')
const MqttSocket = require('./mqtt');


//{"msg":"advData","gmac":"68B9D3DFE78C","obj":[{"type":2,"dmac":"DD3304130897","refPwr":-14,"nid":"6B6B6D636E2E636F6D01","sid":"000000000001","rssi":-60,"time":"2021-05-20 18:12:48"},{"type":16,"dmac":"DD3304130897","refPwr":-14,"url":"00696F742D6770732E636F2E7A61","rssi":-64,"time":"2021-05-20 18:12:49"}]}
//{"msg":"advData","gmac":"68B9D3DFE78C","obj":[{"type":2,"dmac":"DD3304130897","refPwr":-14,"nid":"6B6B6D636E2E636F6D01","sid":"000000000001","rssi":-67,"time":"2021-05-20 18:12:38"},{"type":16,"dmac":"DD3304130897","refPwr":-14,"url":"00696F742D6770732E636F2E7A61","rssi":-61,"time":"2021-05-20 18:12:39"}]}
//{"msg":"advData","gmac":"68B9D3DFC5CC","obj":[{"type":8,"dmac":"DD330413336C","vbatt":3006,"temp":24.0,"advCnt":20102840,"secCnt":202007900,"rssi":-68,"time":"2021-11-20 06:52:16"},{"type":8,"dmac":"DD3304133309","vbatt":3034,"temp":19.0,"advCnt":20102910,"secCnt":202008290,"rssi":-82,"time":"2021-11-20 06:52:17"}]}
//topic: kbeacon/publish/68B9D3DFE78C

class kGateway {
    constructor(options) {
        // this.mqtt_biTidServer = new Mqtt()
        this.mqtt_biTidServer = new MqttSocket();
        this.mqtt_Routers = new Mqtt()
        this.tagFixedTxTime = parseFloat(__settings.txtime)
        this.arrTags = []

        if (options) {
            if (options?.tagFixedTxTime) {
                this.tagFixedTxTime = options.tagFixedTxTime
            }
        }

        this.mqtt_biTidServer.connect(__settings.mqttServerBitid);

        this.init()
    }

    init() {
        let self = this

        self.mqtt_Routers.connect(__settings.mqttRouters)


        self.mqtt_biTidServer.on('data', (topic, message) => {
            if (__settings.debug == true) {
                console.log(`mqtt_biTidServer in kGateway. topic: ${topic} message:${message}`)
            }
        })

        self.mqtt_Routers.on('data', (payload) => {
            if (__settings.debug == true) {
                console.log(`mqtt from router in kGateway. topic: ${payload.topic} message:${payload.message}`)
            }
            try {
                let message = JSON.parse(payload.message)
                switch (message.msg) {
                    case ('advData'):
                    case ('alive'):
                        self.processData(payload)
                        break
                    default:
                        console.log('kGateway unhanled message switch', message)
                }
            } catch (e) {
                console.error('kGateway error in mqtt_Routers', e)
            }
        })

    }

    clearTags(args) {
        /**
         * Used for unit test
        */
        let deferred = Q.defer()

        this.arrTags = []
        args.arrTags = this.arrTags
        deferred.resolve(args)

        return deferred.promise
    }


    listTags(args) {
        let deferred = Q.defer()
        let self = this

        args.arrTags = self.arrTags
        deferred.resolve(args)

        return deferred.promise
    }

    processTagsFromRouter(args) {
        let deferred = Q.defer()
        let self = this

        args.tagObj.map((item) => {

            let lastTag
            if (item.type == 8) {
            // if (item.type > 0) {

                for (let i = 0; i < self.arrTags.length; i++) {
                    if (self.arrTags[i].tagId == item.dmac) {
                        lastTag = self.arrTags[i]
                        break
                    }
                }

                if (typeof (lastTag) == 'undefined') {
                    // if(item.type == 8){
                    self.arrTags.push({
                        tagId: item.dmac,
                        type: item.type,
                        temp: item.temp || 0,
                        vBatt: item.vbatt || 0,
                        advCnt: item.advCnt || 0,
                        secCnt: item.secCnt || 0,
                        rssi: item.rssi || 0,
                        time: new Date().getTime(),
                        status: 0,
                        topic: args.topic,
                        msg: args.message.msg,
                        bitidDeviceId: args.bitidDeviceId,
                        forceTxToServer: true
                    })
                    // }else{
                    //     console.log('Ignored - Tag type not 8')
                    // }

                    self.arrTags.map((item) => {
                        console.log('Tags', item.tagId)
                    })
                }
            }
        })

        deferred.resolve(args)

        return deferred.promise
    }

    async processTagsToSendToServer(args) {
        let deferred = Q.defer()
        let self = this

        let time = new Date().getTime()
        await self.arrTags.reduce(async (promise, item) => promise.then(async () => {
            return new Promise((resolve, reject) => {
                if ((time - item.time > (self.tagFixedTxTime * 1000 * 60)) || item.bitidDeviceId != args.bitidDeviceId || item.forceTxToServer == true) {
                    item.forceTxToServer = false
                    if (time - item.time > (self.tagFixedTxTime * 1000 * 60)) {
                        if (__settings.debug == true) {
                            console.log('Time Based Update to Server', args.tagId)
                        }
                    }
                    if (item.status != args.status) {
                        if (__settings.debug == true) {
                            console.log('Status Changed Update to Server', args.tagId)
                        }
                    }
                    item.time = time
                    item.status = 0
                    item.txCount++
                    if (__settings.debug == true) {
                        console.log('sending tag to server', item)
                    }
                    self.mqtt_biTidServer.send('/kGateway/edge/data', { "marker": "shane", topic: args.topic, deviceStatus: item })
                } else {
                    if (__settings.debug == true) {
                        console.log('Skipped send to server')
                    }
                }
                resolve({})
            });
        }), Promise.resolve())


        deferred.resolve(args)

        return deferred.promise
    }

    async processData(args) {
        let deferred = Q.defer()
        let self = this

        try {
            let topic = args.topic
            let message = JSON.parse(args.message)
            args.message = message

            if (__settings.debug == true) {
                console.log('message', message)
            }

            args.bitidDeviceId = topic.split('/')[2]
            args.bitidDeviceId = args.bitidDeviceId.padStart(24, '0')
            if (message.msg == 'alive') {
                let item = {}
                item.routerId = args.bitidDeviceId
                item.msg = message.msg
                item.gmac = message.gmac
                item.ver = message.ver
                item.subaction = message.subaction
                item.pubaction = message.pubaction
                item.downDevices = message.downDevices
                item.blever = message.blever
                item.hver = message.hver
                item.temp = message.temp
                item.advDevices = message.advDevices
            } else if (message.msg == 'advData') {
                args.tagObj = message.obj
                args = await self.processTagsFromRouter(args)
                args = await self.processTagsToSendToServer(args)
            } else {
                console.error('Unhandled KGateway message type')
            }
            deferred.resolve(args)
        } catch (e) {
            console.log('Error', e)
            deferred.reject(args)
        }

        return deferred.promise

    }

}
module.exports = kGateway