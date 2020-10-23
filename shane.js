// const { Controller } = require('ethernet-ip');
 
// const PLC = new Controller();
 
// // Controller.connect(IP_ADDR[, SLOT])
// // NOTE: SLOT = 0 (default) - 0 if CompactLogix
// PLC.connect('192.168.0.83', 0).then(() => {
//     console.log(PLC.properties);
// });



const { Controller, Tag, TagGroup, EthernetIP } = require('ethernet-ip');
const { DINT, BOOL } = EthernetIP.CIP.DataTypes.Types;

const PLC = new Controller();

const group = new TagGroup();
 
// Create Tag Instances
const tag1 = new Tag('Rx[0]'); // Controller Scope Tag
const contTag = new Tag('Tx[0]', null, DINT);
group.add(contTag); // Controller Scope Tag


PLC.connect('192.168.0.83', 0).then(async () => {
    setInterval(async () => {
        try{
            await PLC.readTag(tag1);
            contTag.value = 255
            await PLC.writeTagGroup(group);
            
            console.log(tag1.value);
            // console.log(tag3.value);
            // console.log(barTag.value);
        
            group.forEach(tag => {
                console.log(tag.value);
            });
        
        }catch(e){
            console.log(e)
        }
    }, 500);
});