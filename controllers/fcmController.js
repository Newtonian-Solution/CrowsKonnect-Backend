var admin = require("firebase-admin");

var serviceAccount = require("../keys/crowskonnec-firebase-adminsdk-itnac-65de1ba249.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendMessage = async () => {
    // Fetch the tokens from an external datastore (e.g. database)
    const tokens = await getTokensFromDatastore();
  
    // Send a message to devices with the registered tokens
    await admin.messaging().sendMulticast({
      tokens, // ['token_1', 'token_2', ...]
      data: { hello: 'world!' },
    });
  }