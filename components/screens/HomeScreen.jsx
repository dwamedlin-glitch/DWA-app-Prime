import React from "react";

export default function HomeScreen({ ctx }) {
  const {
    card,
    col,
    row,
    f,
    SectionIcon,
    LOGO_B64,
    showInstallBanner,
    setShowInstallBanner,
    showIOSInstallGuide,
    setShowIOSInstallGuide,
    handleInstallClick,
    nextMeeting,
    setTab,
    setSub,
    tileStyle,
    tileIconStyle,
  } = ctx;

  return (
    <div className="rise">
      <div style={{ padding: "32px 20px 24px", ...col(0), alignItems: "center", borderBottom: "1px solid var(--seam)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(201,146,42,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
        <img src={LOGO_B64} alt="DWA" style={{ width: "min(150px, 36vw)", objectFit: "contain", position: "relative" }} />
      </div>
      {/* Install App Banner — Android / Chrome (auto-install) */}
      {showInstallBanner && (
        <div style={{ margin: "12px 14px 0" }}>
          <div style={{ ...card({ padding: "18px 16px" }), background: "linear-gradient(135deg, rgba(201,146,42,0.12), rgba(201,146,42,0.04))", border: "1.5px solid var(--gold)", position: "relative" }}>
            <div onClick={() => setShowInstallBanner(false)} style={{ position: "absolute", top: 10, right: 12, cursor: "pointer", color: "var(--text3)", ...f(18, 400), lineHeight: 1 }}>&times;</div>
            <div style={{ ...f(16, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em", marginBottom: 14, textAlign: "center" }}>Install the App</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid var(--seam)" }}>
                <img src="/images/dwa-pwa-192.png" alt="DWA" style={{ width: "100%", height: "100%" }} />
              </div>
              <div>
                <div style={{ ...f(14, 700), color: "var(--cream)", letterSpacing: ".02em" }}>DWA Union</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>dwaunion.com</div>
              </div>
            </div>
            <button onClick={handleInstallClick} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#a06b18,#c9922a,#e8b84b)", border: "none", borderRadius: 10, color: "#1a0f00", ...f(14, 700, 'bebas'), letterSpacing: ".12em", cursor: "pointer" }}>INSTALL APP</button>
          </div>
        </div>
      )}
      {/* iOS Safari Install Guide (step-by-step) */}
      {showIOSInstallGuide && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "var(--leather)", borderTop: "1px solid var(--seam)", borderRadius: "16px 16px 0 0", padding: "20px 20px 28px", boxShadow: "0 -4px 24px rgba(0,0,0,0.5)", maxWidth: 430, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ ...f(16, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>Install the App</div>
            <div onClick={() => { setShowIOSInstallGuide(false); try { localStorage.setItem("dwa_ios_install_dismissed", "1"); } catch(e){} }} style={{ cursor: "pointer", color: "var(--text3)", ...f(20, 400), lineHeight: 1 }}>&times;</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid var(--seam)" }}>
              <img src="/images/dwa-pwa-192.png" alt="DWA" style={{ width: "100%", height: "100%" }} />
            </div>
            <div>
              <div style={{ ...f(14, 700), color: "var(--cream)", letterSpacing: ".02em" }}>DWA Union</div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>dwaunion.com</div>
            </div>
          </div>
          <div style={{ ...col(16) }}>
            <div style={{ ...row("center", 10) }}>
              <span style={{ ...f(15, 700), color: "var(--gold)", width: 24 }}>1.</span>
              <span style={{ ...f(13, 400, 'serif'), color: "var(--text)" }}>Press </span>
              <span style={{ display: "inline-flex", padding: "3px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 6, verticalAlign: "middle" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </span>
              <span style={{ ...f(13, 400, 'serif'), color: "var(--text)" }}> in the browser toolbar</span>
            </div>
            <div style={{ ...row("center", 10), marginTop: 14 }}>
              <span style={{ ...f(15, 700), color: "var(--gold)", width: 24 }}>2.</span>
              <span style={{ ...f(13, 400, 'serif'), color: "var(--text)" }}>Scroll down and tap </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span style={{ ...f(12, 600), color: "var(--cream)" }}>Add to Home Screen</span>
              </span>
            </div>
          </div>
        </div>
      )}
      <div style={{ margin: "12px 14px 0" }}>
        <div style={{ ...card({ padding: "14px 16px", borderLeft: "3px solid var(--gold)" }), display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--gold-dim)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
            <SectionIcon icon="calendar" size={20} />
          </div>
          <div>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Next Meeting</div>
            <div style={{ ...f(15, 600), color: "var(--text)", marginTop: 2 }}>{nextMeeting.title}</div>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--gold)", marginTop: 2, fontStyle: "italic" }}>{nextMeeting.date} · {nextMeeting.time} · {nextMeeting.location}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Announcements", sub: "News & updates", icon: "bell", action: () => setTab("announcements") },
          { label: "Documents", sub: "Contracts & files", icon: "folder", action: () => setTab("documents") },
          { label: "DWA Contacts", sub: "Officers & stewards", icon: "phone", action: () => setSub({ type: "contact" }) },
          { label: "Join Zoom Meeting", sub: "Union meeting room", icon: "video", action: () => setTab("zoom") },
          { label: "Meeting Minutes", sub: "Summaries & notes", icon: "notes", action: () => setTab("minutes") },
          { label: "Seniority", sub: "Members by hire date", icon: "shield", action: () => setTab("seniority") },
          { label: "Submit Grievance", sub: "Report a workplace issue", icon: "alert", action: () => setTab("grievance") },
          { label: "The Floor", sub: "Talk with your union", icon: "message", action: () => setTab("theFloor") },
        ].map(q => (
          <div key={q.label} className="tile" onClick={q.action} style={{
            ...tileStyle(),
            borderRadius: 10, padding: "16px 14px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
              <SectionIcon icon={q.icon} size={22} />
            </div>
            <div>
              <div style={{ ...f(14, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".04em" }}>{q.label}</div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 3, fontStyle: "italic" }}>{q.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
