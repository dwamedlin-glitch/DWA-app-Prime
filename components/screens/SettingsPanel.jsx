import React from "react";

// Settings Panel - slide-out settings drawer
// Props from DWAApp: showSettingsPanel, setShowSettingsPanel, darkMode, setDarkMode,
// lang, setLang, notifs, setNotifs, APP_VERSION, logoutUser, etc.
const SettingsPanel = (props) => {
  // ── SETTINGS PANEL (slide-out) ──
  const SettingsPanel2 = () => {
    if (!showSettingsPanel) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9990, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={() => setShowSettingsPanel(false)}>
        <div style={{ width: 300, maxWidth: "82%", background: "var(--leather)", height: "100%", padding: "24px 18px", overflowY: "auto", boxShadow: "-4px 0 30px rgba(0,0,0,0.4)", borderLeft: "1px solid var(--seam)" }} onClick={e => e.stopPropagation()}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ ...f(24, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>SETTINGS</div>
            <button onClick={() => setShowSettingsPanel(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", ...f(20, 400) }}>×</button>
          </div>
          <div style={{ ...col(0) }}>
            {[
              { label: "Dark Mode", desc: "Switch between dark and light themes", value: darkMode, onChange: () => setDarkMode(!darkMode) },
              { label: "Notifications", desc: "Meeting reminders & announcements", value: notifs.announcements, onChange: () => setNotifs(n => ({ ...n, announcements: !n.announcements, meetings: !n.meetings })) },
            ].map((item, i) => (
              <div key={i} style={{ ...row("center", 0), justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--seam)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...f(14, 600), color: "var(--text)" }}>{item.label}</div>
                  <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{item.desc}</div>
                </div>
                <Tog on={item.value} flip={item.onChange} />
              </div>
            ))}
            <div style={{ ...row("center", 0), justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--seam)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(14, 600), color: "var(--text)" }}>Language</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>Switch between English and Spanish</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid var(--seam)" }}>
                {["en", "es"].map(l => (
                  <div key={l} onClick={() => setLang(l)} style={{ padding: "6px 14px", background: lang === l ? "var(--gold)" : "var(--leather2)", color: lang === l ? "#1a0f00" : "var(--text3)", ...f(12, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => { logoutUser(); setLoggedIn(false); setRole("member"); setCurrentUserEmail(""); setEmail(""); setPassword(""); setShowSettingsPanel(false); setCurrentUid(null); setUserProfile(null); }} style={{ ...btnOutline, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%" }}>
              <SectionIcon icon="logout" size={15} /> SIGN OUT
            </button>
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 16, justifyContent: "center" }}>
            <span onClick={() => { setShowSettingsPanel(false); setSub({ type: "terms" }); }} style={{ ...f(11, 400, 'serif'), color: "var(--text3)", cursor: "pointer", textDecoration: "underline", fontStyle: "italic" }}>Terms of Use</span>
            <span onClick={() => { setShowSettingsPanel(false); setSub({ type: "privacy" }); }} style={{ ...f(11, 400, 'serif'), color: "var(--text3)", cursor: "pointer", textDecoration: "underline", fontStyle: "italic" }}>Privacy Policy</span>
          </div>
          <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", textAlign: "center", marginTop: 12, fontStyle: "italic", opacity: 0.6 }}>DWA App v{APP_VERSION}</div>
        </div>
      </div>
    );
  };
};

export default SettingsPanel;
