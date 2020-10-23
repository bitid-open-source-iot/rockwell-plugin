const os = require('os');
const localIp = require('ip');
const publicIp = require('public-ip');
const macaddress = require('macaddress');

exports.ip = async () => {
    return {
        'local': localIp.address(),
        'public': await publicIp.v4()
    };
};

exports.os = async () => {
    return os.platform();
};

exports.id = async () => {
    const address = await macaddress.one();
    return address.split(':').join('');
};