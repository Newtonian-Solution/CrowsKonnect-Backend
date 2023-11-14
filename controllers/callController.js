const RtcTokenBuilder = require('../node_modules/agora-token/src/RtcTokenBuilder').RtcTokenBuilder;
const RtcRole = require('../node_modules/agora-token/src/RtcTokenBuilder').Role;

exports.createToken = async (req, res, next) => {
    const appID = 'f82a7ae7112942b6be1d8d94fb7f0e93';
    const appCertificate = '33720c87d32e4ec8a0114a0eeda1ff35';
    const channelName = 'CrowsKonnec';
    const uid = Math.floor(Date.now() / 1000);
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600

    const currentTimestamp = Math.floor(Date.now() / 1000)

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    // Build token with uid
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
    res.status(200).json({
        status: "success",
        data: {
          token: tokenA,
          uid: uid,
          channelName: channelName
        },
      });
}