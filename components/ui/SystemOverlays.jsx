import React from "react";
import { useDWA } from "../DWAContext";
import { f } from "../styles/styleHelpers";

// ââ OFFLINE BANNER ââ
const OfflineBanner = () => {
  const { isOffline } = useDWA();
  if (!isOffline) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000, background: "linear-gradient(135deg, #8b2500, #a03000)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, animation: "offline-pulse 2s ease-in-out infinite" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
      <span style={{ ...f(11, 600), color: "#fff", letterSpacing: ".06em", textTransform: "uppercase" }}>You're offline â some features may be unavailable</span>
    </div>
  );
};

// ââ OFFLINE ACTION MESSAGE OVERLAY ââ
const OfflineMessageOverlay = () => {
  const { showOfflineMessage, setShowOfflineMessage } = useDWA();
  if (!showOfflineMessage) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowOfflineMessage(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, #1c1410, #2a1a12)", border: "1px solid rgba(201,146,42,0.25)", borderRadius: 16, padding: "32px 24px", maxWidth: 340, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(139,37,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
        </div>
        <div style={{ ...f(20, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>NO CONNECTION</div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>
          You're currently offline. This action requires an internet connection. Please check your connection and try again.
        </div>
        <button onClick={() => setShowOfflineMessage(false)} style={{ ...f(14, 400, 'bebas'), background: "linear-gradient(135deg, var(--gold), #b8860b)", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 32px", cursor: "pointer", letterSpacing: ".1em" }}>GOT IT</button>
      </div>
    </div>
  );
};

// ââ SESSION TIMEOUT WARNING MODAL ââ
const SessionWarningModal = () => {
  const { showSessionWarning, setShowSessionWarning, loggedIn } = useDWA();
  if (!showSessionWarning || !loggedIn) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10002, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "linear-gradient(135deg, #1c1410, #2a1a12)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 16, padding: "32px 24px", maxWidth: 360, width: "100%", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(201,146,42,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div style={{ ...f(20, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>SESSION EXPIRING</div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>
          You've been inactive for a while. Your session will expire shortly for security. Move your mouse, tap the screen, or press any key to stay logged in.
        </div>
        <button onClick={() => setShowSessionWarning(false)} style={{ ...f(14, 400, 'bebas'), background: "linear-gradient(135deg, var(--gold), #b8860b)", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 32px", cursor: "pointer", letterSpacing: ".1em" }}>I'M STILL HERE</button>
      </div>
    </div>
  );
};

// ââ UPDATE BANNER ââ
const UpdateBanner = () => {
  const { showUpdateBanner, loggedIn, isOffline, dismissUpdateBanner, APP_VERSION } = useDWA();
  if (!showUpdateBanner || !loggedIn) return null;
  return (
    <div style={{ position: "fixed", top: isOffline ? 36 : 0, left: 0, right: 0, zIndex: 9997, background: "linear-gradient(135deg, #1a3a1a, #2d5a2d)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderBottom: "1px solid rgba(100,200,100,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>ð</span>
        <span style={{ ...f(11, 600), color: "#a8e6a8", letterSpacing: ".06em", textTransform: "uppercase" }}>App updated to v{APP_VERSION}</span>
      </div>
      <button onClick={dismissUpdateBanner} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 10px", ...f(10, 600, 'bebas'), color: "#a8e6a8", cursor: "pointer", letterSpacing: ".08em" }}>DISMISS</button>
    </div>
  );
};

export { OfflineBanner, OfflineMessageOverlay, SessionWarningModal, UpdateBanner };
