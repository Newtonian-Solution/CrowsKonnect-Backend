var admin = require("firebase-admin");

var serviceAccount = require("../keys/crowskonnec-firebase-adminsdk-itnac-65de1ba249.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendMessage = async (to, title, message, type = null, data = null) => {
    const tokens = [to];
    if(type != 1){
        await admin.messaging().sendMulticast({
            tokens,
            data: {
              notifee: JSON.stringify({
                title: title,
                body: message,
                android: {
                  channelId: 'default',
                  smallIcon: 'push_icon',
                  color: '#6EE7B7',
                },
              }),
            },
        });
    }else {
        await admin.messaging().sendMulticast({
        tokens,
        data: {
          notifee: JSON.stringify({
            title: title,
            body: message,
            data: data,
            android: {
              channelId: 'default',
              smallIcon: 'push_icon',
              color: '#6EE7B7',
              lightUpScreen: true,
              pressAction: {
                id: 'default',
              },
            //   actions: [
            //     {
            //       title: 'Pick Up',
            //       pressAction: {
            //         id: 'read',
            //       },
            //     },
            //   ],
            },
          }),
        },
      });
    }
  }