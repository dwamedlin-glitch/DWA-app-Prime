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
    // Officer dashboard (only used when hasOfficialAccess is true)
    hasOfficialAccess,
    isSuper,
    role,
    currentUserName,
    setAdminSection,
    pendingMembers,
    grievances,
    floorPosts,
    allApprovedUsers,
    adminEmails,
    documents,
    bannedUsers,
  } = ctx;

  // Derived dashboard data (only meaningful when hasOfficialAccess)
  const newGrievances = (grievances || []).filter(g => g.status === "new");
  const todayPosts = (floorPosts || []).filter(p => {
    const t = p.time || 0;
    return t > Date.now() - 24 * 60 * 60 * 1000;
  });
  const memberCount = (allApprovedUsers || []).length;
  const officialCount = 1 + ((adminEmails || []).length) + ((allApprovedUsers || []).filter(u => u.role === "steward").length);
  const docCount = (documents || []).length;
  const daysToMeeting = (() => {
    if (!nextMeeting || !nextMeeting.date) return null;
    const parsed = Date.parse(nextMeeting.date);
    if (isNaN(parsed)) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((parsed - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  })();

  const firstName = (currentUserName || "").split(" ")[0] || "Officer";
  const roleBadge = isSuper ? "SUPER ADMIN" : role === "steward" ? "STEWARD" : "OFFICER";

  const attentionCards = [];
  if (newGrievances.length > 0) attentionCards.push({
    icon: "alert", color: "var(--red)", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.25)",
    title: `${newGrievances.length} new grievance${newGrievances.length === 1 ? "" : "s"}`,
    sub: "Tap to review and respond",
    action: () => { setTab("admin"); setAdminSection && setAdminSection("grievances"); },
  });
  if ((pendingMembers || []).length > 0) attentionCards.push({
    icon: "users", color: "var(--red)", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.25)",
    title: `${pendingMembers.length} member request${pendingMembers.length === 1 ? "" : "s"} waiting`,
    sub: "Approve or deny new signups",
    action: () => { setTab("admin"); setAdminSection && setAdminSection("useradmin"); },
  });
  if ((bannedUsers || []).length > 0) attentionCards.push({
    icon: "x", color: "var(--red)", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.25)",
    title: `${bannedUsers.length} banned user${bannedUsers.length === 1 ? "" : "s"}`,
    sub: "Review or restore access",
    action: () => { setTab("admin"); setAdminSection && setAdminSection("banned"); },
  });
  if (todayPosts.length > 0) attentionCards.push({
    icon: "message", color: "var(--gold)", bg: "rgba(201,146,42,0.06)", border: "rgba(201,146,42,0.2)",
    title: `${todayPosts.length} post${todayPosts.length === 1 ? "" : "s"} on The Floor today`,
    sub: "See what members are saying",
    action: () => setTab("theFloor"),
  });

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
      {/* ── OFFICER DASHBOARD (only shown to officers/stewards/admins) ── */}
      {hasOfficialAccess && (
        <div style={{ margin: "12px 14px 0", ...col(10) }}>
          {/* Greeting */}
          <div style={{ ...card({ padding: "14px 16px" }) }}>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Officers Panel</div>
            <div style={{ ...f(17, 600), color: "var(--cream)", lineHeight: 1.2 }}>Hey {firstName} — here's what needs you</div>
            <div style={{ display: "inline-block", marginTop: 8, ...f(9, 700), color: "#1a0f00", background: "linear-gradient(135deg,#a06b18,#c9922a)", padding: "3px 10px", borderRadius: 6, letterSpacing: ".08em" }}>{roleBadge}</div>
          </div>

          {/* Attention cards */}
          {attentionCards.length === 0 ? (
            <div style={{ background: "rgba(45,122,79,0.08)", border: "1.5px solid rgba(45,122,79,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(45,122,79,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
                <SectionIcon icon="check" size={16} />
              </div>
              <div style={{ ...f(13, 500), color: "var(--cream)" }}>All clear — nothing needs your attention right now.</div>
            </div>
          ) : (
            <div style={{ ...col(8) }}>
              {attentionCards.map((c, i) => (
                <div key={i} onClick={c.action} className="tile" style={{ background: c.bg, border: `1px solid ${c.border}`, borderLeft: `3px solid ${c.color}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, flexShrink: 0 }}>
                    <SectionIcon icon={c.icon} size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...f(14, 600), color: "var(--cream)" }}>{c.title}</div>
                    <div style={{ ...f(11, 400, 'serif'), color: "var(--text2)", fontStyle: "italic", marginTop: 1 }}>{c.sub}</div>
                  </div>
                  <SectionIcon icon="alert" size={0} />
                </div>
              ))}
            </div>
          )}

          {/* At-a-glance stats */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid var(--seam)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 10 }}>At a glance</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...f(22, 600), color: "var(--cream)", lineHeight: 1 }}>{memberCount}</div>
                <div style={{ ...f(9, 500), color: "var(--text2)", letterSpacing: ".05em", marginTop: 4, textTransform: "uppercase" }}>Members</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...f(22, 600), color: "var(--cream)", lineHeight: 1 }}>{officialCount}</div>
                <div style={{ ...f(9, 500), color: "var(--text2)", letterSpacing: ".05em", marginTop: 4, textTransform: "uppercase" }}>Officials</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...f(22, 600), color: "var(--cream)", lineHeight: 1 }}>{docCount}</div>
                <div style={{ ...f(9, 500), color: "var(--text2)", letterSpacing: ".05em", marginTop: 4, textTransform: "uppercase" }}>Docs</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ ...f(22, 600), color: daysToMeeting !== null && daysToMeeting <= 7 ? "var(--gold)" : "var(--cream)", lineHeight: 1 }}>{daysToMeeting === null ? "—" : daysToMeeting < 0 ? "—" : daysToMeeting === 0 ? "Today" : `${daysToMeeting}d`}</div>
                <div style={{ ...f(9, 500), color: "var(--text2)", letterSpacing: ".05em", marginTop: 4, textTransform: "uppercase" }}>To meeting</div>
              </div>
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
