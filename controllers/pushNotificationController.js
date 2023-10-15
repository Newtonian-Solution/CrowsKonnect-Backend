const Pushy = require('pushy');
exports.pushNotification = async (id, title, message) => {
 

var pushyAPI = new Pushy('8c4663c61f2030b772e2ef8985d29e4ba340ad480bb154eb3fefa1a672bc86a5');
 

var data = {
    message: message,
    title: title
};

var to = [id];

var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        title: 'Order',
        body: 'Hello t Here \u270c',
    },
};
pushyAPI.sendPushNotification(data, to, options, function (err, id) {
    // Log errors to console 
    if (err) {
        return console.log('Fatal Error', err);
    }
});
}