import React from "react";

export default function AdminLanding({ ctx }) {
  const {
    card,
    col,
    f,
    SectionIcon,
    pendingMembers,
    setAdminSection,
    isSteward,
    isSuper,
    bannedUsers,
    tileStyle,
    tileIconStyle,
  } = ctx;

  const needsAttention = [];
  if (pendingMembers.length > 0) needsAttention.push({ icon: "users", title: `${pendingMembers.length} member request${pendingMembers.length > 1 ? "s" : ""} waiting`, sub: "Tap to approve or deny", action: () => setAdminSection("useradmin"), color: "#c0392b", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.2)" });

  // ── STEWARD LIMITED VIEW ──
  if (isSteward) {
    return (
      <div className="rise" style={{ padding: "16px", ...col(14) }}>
        <div style={{ ...card({ padding: "16px 18px" }) }}>
          <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Steward Panel</div>
          <div style={{ ...f(16, 600), color: "var(--cream)" }}>Hey — here's what needs you</div>
          <div style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.15)", padding: "3px 8px", borderRadius: 6, letterSpacing: ".1em", display: "inline-block", marginTop: 8 }}>STEWARD</div>
        </div>

        {needsAttention.length > 0 && (
          <div style={col(6)}>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Needs Attention</div>
            {needsAttention.map((item, i) => (
              <div key={i} onClick={item.action} className="tile" style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: item.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>
                  <SectionIcon icon={item.icon} size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...f(14, 600), color: item.color }}>{item.title}</div>
                  <div style={{ ...f(11, 400, "serif"), color: item.color, opacity: 0.8, fontStyle: "italic", marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ ...f(14, 700), color: item.color }}>→</div>
              </div>
            ))}
          </div>
        )}

        {needsAttention.length === 0 && (
          <div style={{ background: "rgba(45,122,79,0.08)", border: "1.5px solid rgba(45,122,79,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(45,122,79,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
              <SectionIcon icon="check" size={16} />
            </div>
            <div style={{ ...f(13, 400, "serif"), color: "var(--green)", fontStyle: "italic" }}>All clear — nothing needs your attention right now.</div>
          </div>
        )}

        <div style={col(8)}>
          <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Steward Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "shield", label: "User Admin", action: () => setAdminSection("useradmin") },
              { icon: "shield", label: "Update Seniority", action: () => setAdminSection("seniority") },
              ...(bannedUsers.length > 0 ? [{ icon: "x", label: `Banned (${bannedUsers.length})`, action: () => setAdminSection("banned") }] : []),
            ].map(qa => (
              <div key={qa.label} onClick={qa.action} className="tile" style={{ ...tileStyle(), borderRadius: 10, padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                  <SectionIcon icon={qa.icon} size={18} />
                </div>
                <div style={{ ...f(12, 600, "bebas"), color: "var(--cream)", letterSpacing: ".05em" }}>{qa.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card({ padding: "14px 16px" }), display: "flex", alignItems: "center", gap: 10 }}>
          <SectionIcon icon="info" size={16} />
          <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", lineHeight: 1.5 }}>
            As a steward, you can approve new members, update the seniority list, and moderate The Floor (ban/delete posts). Contact an officer for other admin tasks.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rise" style={{ padding: "16px", ...col(14) }}>
      {/* Header */}
      <div style={{ ...card({ padding: "16px 18px" }) }}>
        <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Officers Panel</div>
        <div style={{ ...f(16, 600), color: "var(--cream)" }}>Hey — here's what needs you</div>
        {isSuper && <div style={{ ...f(9, 700), color: "#1a0f00", background: "linear-gradient(135deg,#a06b18,#c9922a)", padding: "3px 8px", borderRadius: 6, letterSpacing: ".1em", display: "inline-block", marginTop: 8 }}>SUPER ADMIN</div>}
      </div>

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <div style={col(6)}>
          <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Needs Attention</div>
          {needsAttention.map((item, i) => (
            <div key={i} onClick={item.action} className="tile" style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: item.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>
                <SectionIcon icon={item.icon} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(14, 600), color: item.color }}>{item.title}</div>
                <div style={{ ...f(11, 400, "serif"), color: item.color, opacity: 0.8, fontStyle: "italic", marginTop: 2 }}>{item.sub}</div>
              </div>
              <div style={{ ...f(14, 700), color: item.color }}>→</div>
            </div>
          ))}
        </div>
      )}

      {needsAttention.length === 0 && (
        <div style={{ background: "rgba(45,122,79,0.08)", border: "1.5px solid rgba(45,122,79,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(45,122,79,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
            <SectionIcon icon="check" size={16} />
          </div>
          <div style={{ ...f(13, 400, "serif"), color: "var(--green)", fontStyle: "italic" }}>All clear — nothing needs your attention right now.</div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={col(8)}>
        <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "bell", label: "Post Announcement", action: () => setAdminSection("announcements") },
            { icon: "notes", label: "Post Minutes", action: () => setAdminSection("minutes") },
            { icon: "file", label: "Upload Document", action: () => setAdminSection("documents") },
            { icon: "shield", label: "Update Seniority", action: () => setAdminSection("seniority") },
          ].map(qa => (
            <div key={qa.label} onClick={qa.action} className="tile" style={{
              ...tileStyle(),

              borderRadius: 10, padding: "14px",

              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                <SectionIcon icon={qa.icon} size={18} />
              </div>
              <div style={{ ...f(12, 600, "bebas"), color: "var(--cream)", letterSpacing: ".05em" }}>{qa.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* More */}
      <div style={col(8)}>
        <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>More</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "calendar", label: "Union Meeting", action: () => setAdminSection("meeting") },
            { icon: "video", label: "Zoom Room", action: () => setAdminSection("zoom") },
            { icon: "phone", label: "DWA Contacts", action: () => setAdminSection("contacts") },
            { icon: "users", label: pendingMembers.length > 0 ? `User Admin (${pendingMembers.length})` : "User Admin", action: () => setAdminSection("useradmin") },
            { icon: "bell", label: "Send Notification", action: () => setAdminSection("broadcast") },
            ...(bannedUsers.length > 0 ? [{ icon: "x", label: `Banned (${bannedUsers.length})`, action: () => setAdminSection("banned") }] : []),
          ].map(qa => (
            <div key={qa.label} onClick={qa.action} className="tile" style={{
              ...tileStyle(),

              borderRadius: 10, padding: "14px",

              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                <SectionIcon icon={qa.icon} size={18} />
              </div>
              <div style={{ ...f(12, 600, "bebas"), color: "var(--cream)", letterSpacing: ".05em" }}>{qa.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
