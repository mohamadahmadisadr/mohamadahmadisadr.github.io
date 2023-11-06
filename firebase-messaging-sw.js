importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6dz46y3hvIdUm8cjmAJSR088sNB1rxU8",
  authDomain: "kanooniha-android.firebaseapp.com",
  projectId: "kanooniha-android",
  storageBucket: "kanooniha-android.appspot.com",
  messagingSenderId: "495671824064",
  appId: "1:495671824064:web:b4fade677302788cc56725",
  measurementId: "G-DHD483FTQ5"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
//messaging.usePublicVapidKey('BNkCLYgkZRUGROlTcfsvsMt07WXZ24HVhobmv3ia9ZuauC56QOT5oHRvbvniSuD5pKoTYOSmVv0Ov5h2IGSan9k');

messaging.onBackgroundMessage((message) => {
  var payload = message.notification;
  console.log('[firebase-messaging-sw.js] Received background message ', message);

  var notificationTitle = payload.title;
  var notificationOptions = {
    body: payload.body,
    icon: payload.icon,
    image: payload.image,
    data: message.data.link,
  };

  
  console.log("strated sending msg" + notificationOptions);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});


var onClick = function (event) {
  console.log('received click func');
  console.log(event);
  // بستن اعلان
  event.notification.close();
  // دریافت دادههای مربوط به اعلان پوش
  const data = event.notification.data;
  // چک کردن اینکه000000000 آیا دادهها شامل یک لینک هستند یا خیر
  if (data) {
    // باز کردن لینک در یک تب جدید
    event.waitUntil(clients.openWindow(data));
  }
}

self.addEventListener('notificationclick', onClick);
