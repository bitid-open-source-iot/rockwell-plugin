const modbus = require('./modbus')
var Q = require('q')



        /**
         * Example output format {"register": "hr2","value": 255}
        */

class ModbusDeviceController{
    constructor(options){
        this.name = options.name
        this.ip = options.ip
        this.port = options.port
        this.pollInterval = options.pollInterval || 1000

        this.device
        this.arrOutputs = []
        this.tmrPoll

        this.init()
    }

    destroy(){
        clearInterval(this.tmrPoll)
        this.tmrPoll = null
    }

    async init(){
        let self = this
        let response = {}

        response = await self.connect(response)
        self.tmrPoll = setInterval(() => {
            self.arrOutputs.map(async item => {
                try{
                    response = await self.device.write(item.register, item.value)
                    await self.waitTime(1000)
                    // console.log('myResponse', response)
                }catch(e){
                    console.error(`error writing to ${self.ip} register: ${item.register}`)
                }
            })
        }, self.pollInterval + 60000);
    }

    async waitTime (args) {
        var deferred = Q.defer();

        setTimeout(() => {
            deferred.resolve();
        }, args);

        return deferred.promise;
    }

    connect(args){
        var deferred = Q.defer()
        let self = this
        console.log(`connecting to modbus ${self.ip} port: ${self.port}`)
        self.device = modbus(self.ip, self.port, 0)
        // this.checkConnected = setInterval(() => {
        //     console.log(`reconnecting to Modbus device ip: ${self.ip} port ${self.port}`)
        // }, 60000);

        deferred.resolve(args)

        return deferred.promise
    }

    getOutputStatus(register){
        var deffered = Q.defer()
        let self = this
        let item
        for(let i=0;i<self.arrOutputs.length;i++){
            item = self.arrOutputs[i]
            if(item.register == register){
                break
            }
        }
        
        if(item?.value){
            deffered.resolve(item.value)
        }else{
            deffered.resolve(-1)
        }
        return deffered.promise
    }

    writeOutput(output){
        let self = this
        let bFound = false
        let item
        // console.error('device output being written', output)
        for(let i=0;i<self.arrOutputs.length;i++){
            item = self.arrOutputs[i]
            if(item.register == output.register){
                item.value = output.value
                bFound = true
                break
            }
        }
        if(bFound == false){
            self.arrOutputs.push(output)
        }
    }
}
module.exports = ModbusDeviceController