"use client";
import { useState, useEffect } from "react";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { onAuthChange, getUserProfile } from "../lib/firebase";

// — NOTIFICATION TOAST (foreground messages) —
function NotificationToast() {
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setToast(e.detail);
      setVisible(true);
      const t = setTimeout(() => { setVisible(false); setTimeout(() => setToast(null), 300); }, 6000);
      return () => clearTimeout(t);
    };
    window.addEventListener("dwa-push-notification", handler);
    return () => window.removeEventListener("dwa-push-notification", handler);
  }, []);

  if (!toast) return null;
  const icons = { announcement: "📢", meeting: "📅", vote: "🗳️", grievance: "📋", general: "🔔" };
  return (
    <div onClick={() => { setVisible(false); setTimeout(() => setToast(null), 300); }} style={{
      position: "fixed", top: 16, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? "0" : "-120%"})`,
      zIndex: 9999, width: "min(92vw, 420px)",
      background: "#1a1a2e", border: "1px solid #c9a227", borderRadius: 12,
      padding: "14px 18px", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      transition: "transform 0.3s ease", display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 24 }}>{icons[toast.type] || "🔔"}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#c9a227", marginBottom: 2 }}>{toast.title}</div>
        <div style={{ fontSize: 13, color: "#b0b0b0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{toast.body}</div>
      </div>
    </div>
  );
}

// — PERMISSION PROMPT (only shown once after admin approves a new member) —
function NotificationPrompt({ onDone }) {
  const { isSupported, isLoading, error, requestPermission } = usePushNotifications();
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000, background: "#0d0d1a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, textAlign: "center",
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: "50%",
        background: "linear-gradient(135deg, #c9a227, #b8860b)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 28, boxShadow: "0 0 40px rgba(201,162,39,0.3)",
      }}><span style={{ fontSize: 42 }}>🔔</span></div>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 12px" }}>Stay in the Loop</h2>
      <p style={{ color: "#b0b0b0", fontSize: 15, lineHeight: 1.6, maxWidth: 320, margin: "0 0 32px" }}>
        Get notified about union announcements, meeting reminders, and important votes.
      </p>
      {error && <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 16 }}>{error}</p>}
      <button onClick={async () => { await requestPermission(); onDone(); }}
        disabled={!isSupported || isLoading}
        style={{
          width: "100%", maxWidth: 300, padding: "16px 24px", borderRadius: 12, border: "none",
          background: isSupported ? "linear-gradient(135deg, #c9a227, #b8860b)" : "#555",
          color: "#000", fontSize: 16, fontWeight: 800, cursor: isSupported ? "pointer" : "not-allowed",
          opacity: isLoading ? 0.7 : 1,
        }}>
        {isLoading ? "Enabling..." : "Enable Notifications"}
      </button>
      <button onClick={onDone} style={{
        marginTop: 16, background: "none", border: "none", color: "#888",
        fontSize: 14, cursor: "pointer", textDecoration: "underline",
      }}>Not now</button>
    </div>
  );
}

// — WRAPPER —
// Only shows the notification prompt ONCE when a new member is first approved by admin.
// Uses localStorage so it never shows again after they dismiss or enable.
export default function NotificationWrapper({ children }) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem("dwa-notif-prompted")) return;

    // Only prompt approved members
    const unsub = onAuthChange(async (user) => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        if (profile && profile.status === "approved" && !localStorage.getItem("dwa-notif-prompted")) {
          setTimeout(() => setShowPrompt(true), 2000);
        }
      } catch (e) {
        // silently skip
      }
    });
    return () => unsub();
  }, []);

  const handleDone = () => {
    setShowPrompt(false);
    localStorage.setItem("dwa-notif-prompted", "1");
  };

  return (
    <>
      {children}
      <NotificationToast />
      {showPrompt && <NotificationPrompt onDone={handleDone} />}
    </>
  );
}
