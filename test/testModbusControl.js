const { expect } = require('chai');
const chai = require('chai');
const subset = require('chai-subset');

chai.use(subset);



let ModbusMainController = require('../lib/modbusMainController')
let modbusMainController = new ModbusMainController({unitTest: true})

describe('modbus control', ()=>{
    it('digial with bitmask source 255 and desination bitmask 3', async ()=>{
        await modbusMainController.updateSource({
            deviceId: 1,
            register: 79,
            value: 7
        })

        let response = await modbusMainController.unitTestGetoutputStatuses()
        expect(response.digitalValue).to.equal(3)
    })

    it('analog with no bitmask ie -1', async ()=>{
        await modbusMainController.updateSource({
            deviceId: 1,
            register: 69,
            value: 100
        })

        let response = await modbusMainController.unitTestGetoutputStatuses()
        expect(response.analogValue).to.equal(100)
    })

})