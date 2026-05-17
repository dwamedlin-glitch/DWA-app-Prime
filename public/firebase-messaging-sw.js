// Firebase Messaging Service Worker for DWA App
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCxB-cPHT6t81DK2uVKe4z6gOEtNaW1Bqg",
  authDomain: "dwa-union-app-8d691.firebaseapp.com",
  projectId: "dwa-union-app-8d691",
  storageBucket: "dwa-union-app-8d691.firebasestorage.app",
  messagingSenderId: "457127100918",
  appId: "1:457127100918:web:04f142b6ca7b83d91507d7",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const notification = payload.notification || {};
  const title = notification.title || data.title || "DWA Update";
  const options = {
    body: notification.body || data.body || "",
          icon: "/images/dwa-pwa-192.png",
          badge: "/images/dwa-pwa-192.png",
    tag: data.tag || "dwa-general",
    data: { url: data.url || "/", type: data.type || "general", id: data.id || null },
    renotify: true,
    vibrate: [200, 100, 200],
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Pass notification context as URL params so the app can route + show a banner
  // even before the user is signed in.
  const data = event.notification.data || {};
  const title = event.notification.title || data.title || "";
  const params = new URLSearchParams();
  params.set("notif", "1");
  if (data.type) params.set("type", data.type);
  if (title) params.set("t", title);
  const targetPath = data.url && data.url !== "/" ? data.url : "/";
  const url = targetPath + (targetPath.includes("?") ? "&" : "?") + params.toString();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
