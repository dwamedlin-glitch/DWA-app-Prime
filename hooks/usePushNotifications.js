// hooks/usePushNotifications.js
import { useState, useEffect, useCallback, useRef } from "react";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCxB-cPHT6t81DK2uVKe4z6gOEtNaW1Bqg",
  authDomain: "dwa-union-app-8d691.firebaseapp.com",
  projectId: "dwa-union-app-8d691",
  storageBucket: "dwa-union-app-8d691.firebasestorage.app",
  messagingSenderId: "457127100918",
  appId: "1:457127100918:web:04f142b6ca7b83d91507d7",
};

let messaging = null;
if (typeof window !== "undefined" && "Notification" in window) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (e) { console.warn("FCM not supported:", e); }
}

export function usePushNotifications() {
  const [permission, setPermission] = useState("default");
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);
  const isSupported = typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator && messaging !== null;

  useEffect(() => {
    if (isSupported) setPermission(Notification.permission);
    if (isSupported && Notification.permission === "granted") fetchToken();
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, []);

  const fetchToken = useCallback(async () => {
    if (!messaging) return null;
    setIsLoading(true); setError(null);
    try {
      let reg = await navigator.serviceWorker.getRegistration("/");
      if (!reg) reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const t = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: reg,
      });
      if (t) {
        await fetch("/api/notifications/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: t }) });
        if (unsubRef.current) unsubRef.current();
        unsubRef.current = onMessage(messaging, (payload) => {
          const d = payload.data || {}; const n = payload.notification || {};
          window.dispatchEvent(new CustomEvent("dwa-push-notification", { detail: { title: n.title || d.title || "DWA Update", body: n.body || d.body || "", type: d.type || "general", url: d.url || "/" } }));
        });
        setToken(t); setPermission("granted"); setIsLoading(false);
        return t;
      }
      setError("No token available"); setIsLoading(false); return null;
    } catch (err) { setError(err.message); setIsLoading(false); return null; }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) { setError("Push not supported"); return false; }
    setIsLoading(true); setError(null);
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") { await fetchToken(); return true; }
      setPermission(result); setIsLoading(false);
      setError(result === "denied" ? "Notifications blocked. Enable in browser settings." : "Permission dismissed.");
      return false;
    } catch (err) { setError(err.message); setIsLoading(false); return false; }
  }, [isSupported, fetchToken]);

  // Disable notifications: delete the FCM token both client-side and server-side.
  // Note: this does NOT revoke browser permission — only the user can do that in browser settings.
  // We just stop receiving pushes by removing the token registration.
  const disableNotifications = useCallback(async () => {
    if (!messaging) return false;
    setIsLoading(true); setError(null);
    try {
      const currentToken = token;
      // Tear down foreground listener
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
      // Delete the token at the client (revokes for this device)
      try { await deleteToken(messaging); } catch (e) { /* token may already be gone */ }
      // Remove from server so future sends skip this device
      if (currentToken) {
        try {
          await fetch("/api/notifications/unregister", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: currentToken }),
          });
        } catch (e) { /* offline is OK — token still gone client-side */ }
      }
      setToken(null);
      setIsLoading(false);
      return true;
    } catch (err) { setError(err.message); setIsLoading(false); return false; }
  }, [token]);

  return { isSupported, permission, token, isLoading, error, requestPermission, fetchToken, disableNotifications };
}
