const admin = require('firebase-admin');

function initFarebase() {
    const servicesAccount = require('./key/cosmic-bonfire-344821-firebase-adminsdk-hi06x-21bd620071.json');
    admin.initializeApp({
        credential: admin.credential.cert(servicesAccount)
    });
}

initFarebase();

function sendPushToOneUser(notification) {
    const message = {
        token: notification.tokenId,
        data: notification.data
    }
    admin.messaging().send(message).then((response) => {
        console.log("Envio de notificatión exitosa");
    }).catch((error) => {
        console.error(error.errorInfo.message)
    });
}

function sendPushToTopic(notification) {
    const message = {
        topic: notification.topic,
        data: {
            title: notification.title,
            message: notification.message
        }
    }
    console.log('send topic')
    admin.messaging().send(message).then((response) => {
        console.log("result", response);
    }).catch((error) => {
        console.log("error", error.message)
    });
}

module.exports = { sendPushToOneUser, sendPushToTopic };