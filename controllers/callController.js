const RtcTokenBuilder = require('../node_modules/agora-token/src/RtcTokenBuilder').RtcTokenBuilder;
const RtcRole = require('../node_modules/agora-token/src/RtcTokenBuilder').Role;

exports.createToken = async (req, res, next) => {
    const appID = '970CA35de60c44645bbae8a215061b33';
    const appCertificate = '5CFd2fd1755d40ecb72977518be15d3b';
    const channelName = '7d72365eb983485397e3e3f9d460bdda';
    const uid = 2882341273;
    const account = "2882341273";
    const role = RtcRole.PUBLISHER;
}