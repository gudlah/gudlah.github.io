var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BE2bo9Qpk3J3ALsPMnftXLjva7_gJS_MktQDXDgANAC3ule-e-Z5rPMmKL2bkZLOikYlXpQDsIiipl6176UMZJ0",
   "privateKey": "crablVTz1uS1QPl7sBdOrnO-3IhahwPR0yzVcF2RYLg"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dg1W5XGERdc:APA91bFH3kape66-WXhqSG9wY6-hwsCIB-JJ3hqoZkOI9B7Cz93eeIrjJggfxFLCqg9aGaPKyG3JGYI1xJlh0kyecVlJZxB5adWhZyd6zDOFeu9KlL3UG2qgnZXwsXM53uLlaEao6I2X",
   "keys": {
       "p256dh": "BDA8H5X7KUoaalG4vvbNlpig67EhpPHlkLXK9ZXyleb2SVb1EgpvJSnPzBR4CQ9a/ikbfJ6TvbbhM6HtdH6HaQ0=",
       "auth": "Xz5a+5aff4ZLYYUFAr9EGg=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '749277667446',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options,
).catch(function(err){
  console.log(err);
});