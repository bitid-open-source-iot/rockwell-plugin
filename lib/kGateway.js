const Q = require('q')
const Mqtt = require('./mqtt')

class kGateway{
    constructor(){
        this.mqtt_biTidServer = new Mqtt()
        this.mqtt_Routers = new Mqtt()
        this.tagFixedTxTime = 5
        this.arrTags = []

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


    processData(args) {
        let deferred = Q.defer()
        let self = this

        try {
            let topic = args.topic
            let message = JSON.parse(args.message)
            console.log('message', message)

            args.bitidDeviceId = topic.split('/')[2]
            args.bitidDeviceId = args.bitidDeviceId.padStart(24,'0')
            args.tagId = message.obj[0].dmac
            args.status = 0

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
                    message: args.message
                })
                console.log('First Read Update to Server', args.tagId)
                // self.server.sendData({ "deviceId": bitidDeviceId, "data": args.data[1] })
                self.mqtt_biTidServer.send('kGateway/data', {"marker":"shane",topic,message})
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
                    // self.server.sendData({ "deviceId": bitidDeviceId, "data": args.data[1] })
                    self.mqtt_biTidServer.send('kGateway/data', {"marker":"shane",topic,message})
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