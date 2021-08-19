var Q = require('q')
const ModbusDeviceController = require('./modbusDeviceController')


class ModbusMainController{

    constructor(options){

        this.arrDeviceControllers = []
        this.arrSourceRegisters = []
        this.sourceRegister = {
            deviceId: 1,
            register: 69,
            value: 255
        }
        if(options.unitTest == true){
            this.unitTestInit()
        }
        this.init()
    }

    init(){
        let self = this

        try{
            __settings.modbusDevices.map((device)=>{
                let modbusDeviceController = new ModbusDeviceController(
                    {
                        name: device.name,
                        ip: device.ip,
                        port: device.port || 502,
                        pollInterval: device.pollInterval || 1000
                    }
                )
                self.arrDeviceControllers.push(modbusDeviceController)
            })
        }catch(e){
            console.error('modbusMainController error', e)
        }
    }

    async updateSource(sourceRegister){
        let self = this
        let bFound = false
        let item
        // console.log('updating source>>>>>>>>>>>>>>>>>>>>>>>', sourceRegister)
        for(let i=0;i<self.arrSourceRegisters.length;i++){
            item = self.arrSourceRegisters[i]
            if(item.deviceId == sourceRegister.deviceId && item.register == sourceRegister.register){
                item.value = sourceRegister.value
                bFound = true
            }
            break
        }
        if(bFound == false){
            self.arrSourceRegisters.push(sourceRegister)
        }
        await this.doModbusMappingControl()
    }

    doModbusMappingControl(){
        var deffered = Q.defer()
        let self = this
        let bFoundMapping = false
        let bFoundDevice = false
        let mapMapping
        let mapSource
        let mapDevice
        try{
            __settings.sourceToDestinationModbusMapping.map((mapping)=>{
                mapMapping = mapping
                self.arrSourceRegisters.map((source)=>{
                    mapSource = source
                    if(mapping.source.deviceId == source.deviceId && mapping.source.register == source.register){
                        bFoundMapping = true
                        self.arrDeviceControllers.map(async (device)=>{
                            mapDevice = device
                            if(mapping.destination.name == device.name){
                                bFoundDevice = true
                                let maskSourceValue
                                let maskDestinationValue
                                if(mapping.source.bitMask != -1){
                                    //TODO
                                    maskSourceValue = source.value & mapping.source.bitMask
                                }else{
                                    maskSourceValue = source.value
                                }
    
                                if(mapping.destination.bitMask != -1){
                                    //TODO
                                    let dontTouchVal = 0
                                    let deviceCurrentState = await device.getOutputStatus(mapping.destination.register)
                                    maskDestinationValue = maskSourceValue & mapping.destination.bitMask
                                    if((deviceCurrentState & mapping.destination.bitMask > 0) && deviceCurrentState != -1){
                                        dontTouchVal = deviceCurrentState - (deviceCurrentState & mapping.destination.bitMask)
                                    }
                                    maskDestinationValue = dontTouchVal + maskDestinationValue
                                }else{
                                    maskDestinationValue = source.value
                                }
    
                                device.writeOutput({
                                    register: mapping.destination.register,
                                    value: maskDestinationValue
                                })
                            }
                        })
                    }
                })
            })
            if(bFoundDevice == false){
                console.error(`deivce not found for device.source.deviceId: ${mapMapping.source.deviceId} register: ${mapMapping.source.register}`)
            }
            if(bFoundMapping == false){
                console.error(`Mapping not found for source.deviceId: ${mapMapping.source.deviceId}`)
            }
            deffered.resolve()
        }catch(e){
            console.error('doModbusMappingControl error', e)
            deffered.reject(e)
        }

        return deffered.promise

    }

    unitTestInit(){
        var deffered = Q.defer()
        try{

            this.arrDeviceControllers = []
            this.arrSourceRegisters = []
    
            global.__settings = {
                "modbusDevices":[
                    {
                        "name": "DigitalOutputFromPlcCard1",
                        "ip": "192.168.0.24",
                        "port": 502,
                        "pollInterval": 1000
                    },
                    {
                        "name": "AnalogOutputFromPlcCard2",
                        "ip": "192.168.0.25",
                        "port": 502,
                        "pollInterval": 1000
                    }
                ],
                "sourceToDestinationModbusMapping": [
                    {
                        "source": {
                            "deviceId": 1,
                            "register": 69,
                            "bitMask": -1
                        },
                        "destination": {
                            "name": "AnalogOutputFromPlcCard2",
                            "register": "hr2",
                            "bitMask": -1
                        }
                    },
                    {
                        "source": {
                            "deviceId": 1,
                            "register": 79,
                            "bitMask": 3
                        },
                        "destination": {
                            "name": "DigitalOutputFromPlcCard1",
                            "register": "hr2",
                            "bitMask": 3
                        }
                    }
            
                ]                
            }

            deffered.resolve()
        }catch(e){
            deffered.reject(e)
        }

        return deffered.promise
    }

    unitTestGetoutputStatuses(){
        var deffered = Q.defer()
        let self = this
        try{

            let result = {
                analogValue: -1,
                digitalValue: -1
            }
            self.arrDeviceControllers.map(async (device)=>{
                if(device.name == 'DigitalOutputFromPlcCard1'){
                    result.digitalValue = await device.getOutputStatus('hr2')
                }else if(device.name == 'AnalogOutputFromPlcCard2'){
                    result.analogValue = await device.getOutputStatus('hr2')
                }
            })            

            deffered.resolve(result)


            deffered.resolve()
        }catch(e){
            deffered.reject(e)
        }

        return deffered.promise
    }    



}
module.exports = ModbusMainController


/**
 * 
 *         let modbusOutputDO1 = new ModbusController({
            ip: '192.168.0.24',
            port: '502',
            pollInterval: 1000,
            id: 1
        })
        modbusOutputDO1.connect();
        modbusOutputDO1.writeOutput({
            "register": "hr2",
            "value": 255
        })


        let modbusOutputAO1 = new ModbusController({
            ip: '192.168.0.25',
            port: '502',
            pollInterval: 1000,
            id: 1
        })
        modbusOutputAO1.connect();
        modbusOutputAO1.writeOutput({
            "register": "hr2",
            "value": 32767
        })

 */
