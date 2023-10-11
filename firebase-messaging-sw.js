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
  console.log("onBackgroundMessage", message);
  console.log("title", message.notification.title);
  console.log("body", message.notification.body);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
        reg.showNotification(message.notification.title, {body : message.notification.body,icon : message.notification.image});
    });
  }
});
