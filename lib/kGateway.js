const Q = require('q')
const Mqtt = require('./mqtt')

//{"msg":"advData","gmac":"68B9D3DFE78C","obj":[{"type":2,"dmac":"DD3304130897","refPwr":-14,"nid":"6B6B6D636E2E636F6D01","sid":"000000000001","rssi":-60,"time":"2021-05-20 18:12:48"},{"type":16,"dmac":"DD3304130897","refPwr":-14,"url":"00696F742D6770732E636F2E7A61","rssi":-64,"time":"2021-05-20 18:12:49"}]}
//{"msg":"advData","gmac":"68B9D3DFE78C","obj":[{"type":2,"dmac":"DD3304130897","refPwr":-14,"nid":"6B6B6D636E2E636F6D01","sid":"000000000001","rssi":-67,"time":"2021-05-20 18:12:38"},{"type":16,"dmac":"DD3304130897","refPwr":-14,"url":"00696F742D6770732E636F2E7A61","rssi":-61,"time":"2021-05-20 18:12:39"}]}
//topic: kbeacon/publish/68B9D3DFE78C

class kGateway{
    constructor(options){
        this.mqtt_biTidServer = new Mqtt()
        this.mqtt_Routers = new Mqtt()
        this.tagFixedTxTime = 3
        this.arrTags = []

        if(options?.tagFixedTxTime){
            this.tagFixedTxTime = options.tagFixedTxTime
        }

        this.init()
    }

    init(){
        let self = this
        self.mqtt_biTidServer.connect(__settings.mqttServerBitid)
        self.mqtt_Routers.connect(__settings.mqttRouters)


        self.mqtt_biTidServer.on('data', (topic, message)=>{
            console.log(`mqtt_biTidServer in kGateway. topic: ${topic} message:${message}`)
        })
        self.mqtt_Routers.on('data', (payload)=>{
            console.log(`mqtt from router in kGateway. topic: ${payload.topic} message:${payload.message}`)
            try{
                let message = JSON.parse(payload.message)
                switch(message.msg){
                    case('advData'):
                    case('alive'):
                        self.processData(payload)
                        break
                    default:
                        console.log('kGateway unhanled message switch',message)    
                }
            }catch(e){
                console.error('kGateway error in mqtt_Routers',e)
            }
        })

    }

    clearTags(args){
        /**
         * Used for unit test
        */
        let deferred = Q.defer()

        this.arrTags = []
        args.arrTags = this.arrTags
        deferred.resolve(args)

        return deferred.promise
    }


    listTags(args){
        let deferred = Q.defer()
        let self = this

        args.arrTags = self.arrTags
        deferred.resolve(args)

        return deferred.promise
    }

    processData(args) {
        let deferred = Q.defer()
        let self = this

        try {
            let topic = args.topic
            let message = JSON.parse(args.message)
            console.log('message', message)

            args.bitidDeviceId = topic.split('/')[2]
            args.bitidDeviceId = args.bitidDeviceId.padStart(24,'0')
            if(message.msg == 'alive'){
                args.tagId = args.bitidDeviceId
            }else{
                args.tagId = message.obj[0].dmac
            }
            args.status = 0 //Need to figure out if tag has status

            let lastTag
            for (let i = 0; i < self.arrTags.length; i++) {
                if (self.arrTags[i].tagId == args.tagId) {
                    lastTag = self.arrTags[i]
                    break
                }
            }

            if (typeof (lastTag) == 'undefined') {
                self.arrTags.push({
                    tagId: args.tagId,
                    time: new Date().getTime(),
                    status: args.status,
                    topic: args.topic,
                    message: args.message,
                    txCount: 1
                })
                console.log('First Read Update to Server', args.tagId)
                self.mqtt_biTidServer.send('/kGateway/edge/data', {"marker":"shane",topic,message})
            } else {
                let time = new Date().getTime()

                /**
                 * We use this time check to get rid of noisy tags. They typically tx every couple of seconds and do not want to hit server so hard.
                 * If status changes we send regardless
                 */
                if (time - lastTag.time > (self.tagFixedTxTime * 1000 * 60)) {
                    if (time - lastTag.time > (self.tagFixedTxTime * 1000 * 60)) {
                        console.log('Time Based Update to Server', args.tagId)
                    }
                    if (lastTag.status != args.status) {
                        console.log('Status Changed Update to Server', args.tagId)
                    }
                    lastTag.time = time
                    lastTag.status = args.status
                    lastTag.topic = args.topic
                    lastTag.message = args.message
                    lastTag.txCount++
                    self.mqtt_biTidServer.send('/kGateway/edge/data', {"marker":"shane",topic,message})
                } else {
                    console.log('Skipped send to server')
                }
            }

            // console.log(JSON.stringify(self.arrTags))

            deferred.resolve(args)
        } catch (e) {
            console.log('Error', e)
            deferred.reject(args)
        }

        return deferred.promise

    }    

}
module.exports = kGateway