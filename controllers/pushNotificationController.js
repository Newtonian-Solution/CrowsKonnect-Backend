const Pushy = require('pushy');
exports.pushNotification = async (id, title, message) => {
 
// Plug in your Secret API Key 
// Get it here: https://dashboard.pushy.me/ 
var pushyAPI = new Pushy('8c4663c61f2030b772e2ef8985d29e4ba340ad480bb154eb3fefa1a672bc86a5');
 
// Set push payload data to deliver to device(s) 
var data = {
    message: message,
    title: title
};
// Insert target device token(s) here 
var to = [id];

// Optionally, send to a publish/subscribe topic instead
// to = '/topics/news';
 
// Set optional push notification options (such as iOS notification fields)
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        title: 'Order',
        body: 'Hello t Here \u270c',
    },
};
 
// Send push notification via the Send Notifications API 
// https://pushy.me/docs/api/send-notifications 
pushyAPI.sendPushNotification(data, to, options, function (err, id) {
    // Log errors to console 
    if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success 
    //console.log('Push sent successfully! (ID: ' + id + ')');
});
}