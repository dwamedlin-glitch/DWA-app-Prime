import React from "react";

// Steward Limited View - restricted interface for steward-role users
const StewardView = (props) => {
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
                { icon: "users", label: "Member Requests", action: () => setAdminSection("members") },
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
              { icon: "users", label: "Member Requests", action: () => setAdminSection("members") },
              { icon: "shield", label: "User Admin", action: () => setAdminSection("useradmin") },
              ...(bannedUsers.length > 0 ? [{ icon: "x", label: `Banned (${bannedUsers.length})`, action: () => setAdminSection("banned") }] : []),
              ...(isSuper ? [{ icon: "shield", label: "Manage Officials", action: () => setAdminSection("accounts") }] : []),
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
  };

  const TABS = [
    { id: "home", label: "Home", icon: "home" },
    { id: "documents", label: "Docs", icon: "file" },
    { id: "zoom", label: "Zoom", icon: "video" },
    { id: "minutes", label: "Minutes", icon: "notes" },
    ...(hasOfficialAccess ? [{ id: "admin", label: "Officials", icon: "shield" }] : []),
  ];

  const AdminFormHeader = ({ title }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ ...f(10, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em" }}>{title}</div>
      <button onClick={() => setAdminSection(null)} style={{ ...f(12, 700), color: "var(--text3)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← BACK</button>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div id="dwa-app-root" style={{ maxWidth: 430, margin: "0 auto", height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "transparent", position: "relative", overflow: "hidden" }}>

        {/* Top nav */}
        <div style={{ background: "var(--leather)", padding: "12px 16px", ...row("center", 0), justifyContent: "space-between", position: "relative", flexShrink: 0, zIndex: 1 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={row("center", 10)}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--gold-dim)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
              <SectionIcon icon={TABS.find(t => t.id === tab)?.icon || "home"} size={16} />
            </div>
            {tab !== "home" && (
              <button onClick={() => { setTab("home"); setAdminSection(null); }} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>← HOME</button>
            )}
          </div>
          <div style={row("center", 8)}>
            <button onClick={() => { setProfileUserId(null); setShowProfile(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", position: "relative" }} title="My Profile">
              <SectionIcon icon="user" size={20} />
            </button>
            <button onClick={() => setShowSettingsPanel(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", position: "relative" }}>
              <SectionIcon icon="gear" size={20} />
            </button>
          </div>
        </div>

        <div className="scroll" style={{ flex: 1, position: "relative", zIndex: 1 }}>
          {tabDataLoading && tab === "home" && <div className="rise" style={{ padding: 16 }}><SkeletonGrid count={6} /></div>}
          {tabDataLoading && tab === "theFloor" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={3} avatar /></div>}
          {tabDataLoading && tab === "announcements" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={3} /></div>}
          {tabDataLoading && tab === "documents" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={4} /></div>}
          {tabDataLoading && tab === "seniority" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={5} /></div>}
          {tabDataLoading && tab === "grievance" && <div className="rise" style={{ padding: 16 }}><SkeletonCard lines={4} /><SkeletonCard lines={3} /></div>}
          {tabDataLoading && tab === "minutes" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={3} /></div>}
          {tabDataLoading && tab === "zoom" && <div className="rise" style={{ padding: 16 }}><SkeletonCard lines={4} /></div>}
          {tabDataLoading && tab === "admin" && <div className="rise" style={{ padding: 16 }}><SkeletonGrid count={8} /></div>}
          {!tabDataLoading && tab === "home" && <Home />}
          {!tabDataLoading && tab === "theFloor" && <TheFloor />}
          {!tabDataLoading && tab === "grievance" && <Grievance />}
          {!tabDataLoading && tab === "documents" && <Documents />}
          {!tabDataLoading && tab === "announcements" && <Announcements />}
          {!tabDataLoading && tab === "zoom" && <Zoom />}
          {!tabDataLoading && tab === "minutes" && <Minutes />}
          {!tabDataLoading && tab === "seniority" && <Seniority />}
          {!tabDataLoading && tab === "admin" && !adminSection && <Admin />}

          {/* Admin Sections */}
          {tab === "admin" && adminSection === "announcements" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title={editAnnId ? "Edit Announcement" : "Post Announcement"} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={col(5)}>
                  <label style={lbl}>Title</label>
                  <input style={inp()} value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title" />
                </div>
                <div style={col(5)}>
                  <label style={lbl}>Message</label>
                  <textarea style={{ ...inp(), minHeight: 100, resize: "vertical", lineHeight: 1.5 }} value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder="Announcement body…" />
                </div>
                <div style={{ ...row("center", 0), justifyContent: "space-between" }}>
                  <div style={{ ...f(13, 500), color: "var(--text)" }}>Mark as Urgent</div>
                  <Tog on={annUrgent} flip={() => setAnnUrgent(v => !v)} />
                </div>
                {annPosted && <div style={{ ...f(13, 600), color: "var(--green)" }}>{editAnnId ? "✓ Updated in EN & ES!" : "✓ Posted in EN & ES!"}</div>}
                {translating && <div style={{ ...f(12, 400, 'serif'), color: "var(--gold)", fontStyle: "italic" }}>Translating to Spanish…</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnGold(!annTitle.trim() || !annBody.trim() || translating), flex: 1 }} onClick={postAnn} disabled={!annTitle.trim() || !annBody.trim() || translating}>{translating ? "TRANSLATING…" : editAnnId ? "UPDATE ANNOUNCEMENT" : "POST ANNOUNCEMENT"}</button>
                  {editAnnId && <button onClick={() => { setEditAnnId(null); setAnnTitle(""); setAnnBody(""); setAnnUrgent(false); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Active Announcements</div>
              {announcements.map(a => (
                <div key={a.id} style={{ ...card({ padding: "14px" }) }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      {a.urgent && <span style={{ ...f(9, 700), color: "var(--gold)", marginBottom: 4, display: "block" }}>⚡ URGENT</span>}
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{a.title}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 4, fontStyle: "italic" }}>{a.body.slice(0, 80)}…</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => { setEditAnnId(a.id); setAnnTitle(a.title); setAnnBody(a.body); setAnnUrgent(!!a.urgent); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => setConfirmModal({ title: "Delete Announcement", message: `Delete "${a.title}"?`, danger: true, onConfirm: () => { const removed = a; setAnnouncements(prev => { const updated = prev.filter(x => x.id !== a.id); saveAnnouncements(updated); return updated; }); setToastMsg({ message: `"${a.title}" deleted`, onUndo: () => setAnnouncements(prev => { const restored = [removed, ...prev]; saveAnnouncements(restored); return restored; }) }); } })} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>DEL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "admin" && adminSection === "seniority" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Seniority List" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>{editSenId ? "Edit Member" : "Add Member"}</div>
                <div style={col(5)}><label style={lbl}>Full Name</label><input style={inp()} value={newSenName} onChange={e => setNewSenName(e.target.value)} placeholder="Employee full name" /></div>
                <div style={col(5)}><label style={lbl}>Hire Date</label><input type="date" style={inp()} value={newSenDate} onChange={e => setNewSenDate(e.target.value)} /></div>
                <div style={col(5)}><label style={lbl}>Location</label>
                  <select style={dropStyle()} value={newSenLocation} onChange={e => setNewSenLocation(e.target.value)}>
                    <option>Jersey City</option><option>Florence</option>
                  </select>
                </div>
                {senError && <div style={{ ...f(12, 400, 'serif'), color: "var(--red)", fontStyle: "italic" }}>{senError}</div>}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>{editSenId ? "✓ Updated!" : "✓ Saved!"}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                <button style={btnGold(!newSenName.trim() || !newSenDate)} disabled={!newSenName.trim() || !newSenDate} onClick={() => {
                  if (!newSenName.trim()) { setSenError("Please enter a name."); return; }
                  if (!newSenDate) { setSenError("Please select a hire date."); return; }
                  if (editSenId) {
                    setSeniority(prev => { const updated = prev.map(x => x.id === editSenId ? { ...x, name: newSenName.trim(), hireDate: newSenDate, location: newSenLocation } : x); saveSeniorityFn(updated); return updated; });
                  } else {
                    setSeniority(prev => { const updated = [...prev, { id: Date.now(), name: newSenName.trim(), hireDate: newSenDate, location: newSenLocation }]; saveSeniorityFn(updated); return updated; });
                  }
                  setEditSenId(null); setNewSenName(""); setNewSenDate(""); setNewSenLocation("Jersey City"); setSenError("");
                  saveFlash(() => { });
                }}>{editSenId ? "UPDATE MEMBER" : "ADD TO SENIORITY LIST"}</button>
                {editSenId && <button onClick={() => { setEditSenId(null); setNewSenName(""); setNewSenDate(""); setNewSenLocation("Jersey City"); setSenError(""); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>Current Members ({seniority.length})</div>
                {[...seniority].sort((a, b) => a.hireDate.localeCompare(b.hireDate)).map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{s.name}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{s.location} · {s.hireDate}</div>
                    </div>
                    <button onClick={() => { setEditSenId(s.id); setNewSenName(s.name); setNewSenDate(s.hireDate); setNewSenLocation(s.location || "Jersey City"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(191,155,48,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>EDIT</button>
                    <button onClick={() => { setConfirmModal({ title: `Remove ${s.name}?`, message: `${s.name} will be removed from the seniority list.`, danger: true, onConfirm: () => { const removed = s; setSeniority(prev => { const updated = prev.filter(x => x.id !== s.id); saveSeniorityFn(updated); return updated; }); setToastMsg({ message: `${s.name} removed`, onUndo: () => { setSeniority(prev => { const restored = [...prev, removed]; saveSeniorityFn(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEL</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "members" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Member Requests" />
              <div style={{ ...card({ padding: "16px" }) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 10 }}>Pending ({pendingMembers.length})</div>
                {pendingMembers.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No pending requests.</div>}
                {pendingMembers.map(m => (
                  <div key={m.uid || m.email} style={{ ...col(6), padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ ...f(14, 600), color: "var(--text)" }}>{m.name}</div>
                    <div style={{ ...f(12, 400), color: "var(--text3)" }}>{m.email}{m.location ? ` · ${m.location}` : ""}</div>
                    <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Submitted {m.submittedAt}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <button onClick={() => { setConfirmModal({ title: `Approve ${m.name}?`, message: `${m.name} will become a union member.`, onConfirm: async () => { if (m.uid) await approveMember(m.uid); setMemberEmails(prev => [...prev, m.email]); setToastMsg({ message: `${m.name} approved!` }); } }); }} style={{ flex: 1, padding: "8px", background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", borderRadius: 6, color: "var(--green)", ...f(11, 700), cursor: "pointer" }}>APPROVE</button>
                      <button onClick={() => { setConfirmModal({ title: `Deny ${m.name}?`, message: "This will reject their membership request.", danger: true, onConfirm: async () => { if (m.uid) await denyMember(m.uid); setToastMsg({ message: `${m.name} denied` }); } }); }} style={{ flex: 1, padding: "8px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, color: "var(--red)", ...f(11, 700), cursor: "pointer" }}>DENY</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...card({ padding: "16px" }) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 10 }}>Approved Members ({memberEmails.length})</div>
                {memberEmails.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No approved members yet.</div>}
                {memberEmails.map(em => (
                  <div key={em} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ flex: 1, ...f(13, 400), color: "var(--text)" }}>{em}</div>
                    <button onClick={() => { setConfirmModal({ title: `Remove ${em}?`, message: "This member will lose access to the app.", danger: true, onConfirm: () => { const removed = em; setMemberEmails(prev => prev.filter(e => e !== em)); setToastMsg({ message: `${em} removed`, onUndo: () => { setMemberEmails(prev => [...prev, removed]); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEL</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "meeting" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Union Meeting" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                {[["Meeting Title", "title", "e.g. Contract Ratification Vote"], ["Date", "date", "e.g. May 15, 2026"], ["Time", "time", "e.g. 6:00 PM"], ["Location", "location", "e.g. Union Hall"]].map(([label, key, ph]) => (
                  <div key={key} style={col(5)}>
                    <label style={lbl}>{label}</label>
                    <input style={inp()} value={editMeeting[key] || ""} placeholder={ph} onChange={e => setEditMeeting(prev => ({ ...prev, [key]: e.target.value }))} />
                  </div>
                ))}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
                <button style={btnGold()} onClick={() => { const info = { ...editMeeting }; setNextMeeting(info); saveMeetingInfo(info); saveFlash(() => {}); try { fetch('/api/notifications/meeting-updated', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: info.title || 'Union Meeting', date: info.date, time: info.time, location: info.location || '', zoomId: zoomInfo?.id || '', zoomPasscode: zoomInfo?.passcode || '', zoomLink: zoomInfo?.link || '' }) }); } catch(e) { console.log('Meeting notification failed:', e); } }}>SAVE MEETING INFO</button>
              </div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Preview: {editMeeting.title} · {editMeeting.date} · {editMeeting.location}</div>
            </div>
          )}

          {tab === "admin" && adminSection === "zoom" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Zoom Meeting Room" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                {[["Meeting ID", "meetingId", "e.g. 783 115 6878"], ["Passcode", "passcode", "e.g. 9cDtkC"], ["Join Link", "link", "https://zoom.us/j/..."]].map(([label, key, ph]) => (
                  <div key={key} style={col(5)}>
                    <label style={lbl}>{label}</label>
                    <input style={inp()} value={editZoom[key] || ""} placeholder={ph} onChange={e => setEditZoom(prev => ({ ...prev, [key]: e.target.value }))} />
                  </div>
                ))}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
                <button style={btnGold()} onClick={() => { const info = { ...editZoom }; setZoomInfo(info); saveZoomInfoFn(info); saveFlash(() => {}); }}>SAVE ZOOM INFO</button>
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "minutes" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title={editMinId ? "Edit Minutes" : "Meeting Minutes"} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={col(5)}><label style={lbl}>Title</label><input style={inp()} value={newMinTitle} onChange={e => setNewMinTitle(e.target.value)} placeholder="Meeting title" /></div>
                <div style={col(5)}><label style={lbl}>Date</label><input style={inp()} value={newMinDate} onChange={e => setNewMinDate(e.target.value)} placeholder="e.g. Apr 5, 2026" /></div>
                <div style={col(5)}><label style={lbl}>Summary</label><textarea style={{ ...inp(), minHeight: 80, resize: "vertical", lineHeight: 1.5 }} value={newMinSummary} onChange={e => setNewMinSummary(e.target.value)} placeholder="Brief summary of meeting…" /></div>
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>{editMinId ? "✓ Updated in EN & ES!" : "✓ Posted in EN & ES!"}</div>}
                {translating && <div style={{ ...f(12, 400, 'serif'), color: "var(--gold)", fontStyle: "italic" }}>Translating to Spanish…</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnGold(!newMinTitle.trim() || !newMinDate || translating), flex: 1 }} disabled={!newMinTitle.trim() || !newMinDate || translating} onClick={async () => {
                    setTranslating(true);
                    let titleEs = newMinTitle;
                    let summaryEs = newMinSummary;
                    try {
                      const response = await fetch("/api/translate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: newMinTitle, body: newMinSummary }),
                      });
                      const data = await response.json();
                      if (data.titleEs) titleEs = data.titleEs;
                      if (data.bodyEs) summaryEs = data.bodyEs;
                    } catch (e) {}
                    setTranslating(false);
                    if (editMinId) {
                      setMinutes(prev => {
                        const updated = prev.map(m => m.id === editMinId ? { ...m, title: newMinTitle, date: newMinDate, summary: newMinSummary, titleEs, summaryEs } : m);
                        saveMinutesFn(updated);
                        return updated;
                      });
                      setEditMinId(null);
                    } else {
                      setMinutes(prev => { const updated = [{ id: Date.now(), title: newMinTitle, date: newMinDate, summary: newMinSummary, titleEs, summaryEs }, ...prev]; saveMinutesFn(updated); return updated; });
                    }
                    setNewMinTitle(""); setNewMinDate(""); setNewMinSummary("");
                    saveFlash(() => { });
                  }}>{translating ? "TRANSLATING…" : editMinId ? "UPDATE MINUTES" : "POST MINUTES"}</button>
                  {editMinId && <button onClick={() => { setEditMinId(null); setNewMinTitle(""); setNewMinDate(""); setNewMinSummary(""); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              {minutes.map(m => (
                <div key={m.id} style={{ ...card({ padding: "14px" }) }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{m.title}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--gold)", fontStyle: "italic", marginTop: 2 }}>{m.date}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 4 }}>{m.summary.slice(0, 80)}…</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => { setEditMinId(m.id); setNewMinTitle(m.title); setNewMinDate(m.date); setNewMinSummary(m.summary); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => setConfirmModal({ title: "Delete Minutes", message: `Delete "${m.title}"?`, danger: true, onConfirm: () => { const removed = m; setMinutes(prev => { const updated = prev.filter(x => x.id !== m.id); saveMinutesFn(updated); return updated; }); setToastMsg({ message: `"${m.title}" deleted`, onUndo: () => setMinutes(prev => { const restored = [removed, ...prev]; saveMinutesFn(restored); return restored; }) }); } })} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>DEL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "admin" && adminSection === "documents" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Documents" />

              {/* Upload form */}
              <div style={{ ...card({ padding: "16px" }), ...col(14) }}>
                <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>Add Document</div>

                {/* File drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDocUploadDrag(true); }}
                  onDragLeave={() => setDocUploadDrag(false)}
                  onDrop={e => {
                    e.preventDefault(); setDocUploadDrag(false);
                    const file = e.dataTransfer.files[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    const sizeKb = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
                    const ext = file.name.split(".").pop()?.toLowerCase() || "file";
                    setNewDocFile({ name: file.name, size: sizeKb, url, type: ext, rawFile: file });
                    if (!newDocName.trim()) setNewDocName(file.name.replace(/\.[^.]+$/, ""));
                  }}
                  style={{
                    border: `2px dashed ${docUploadDrag ? "var(--gold)" : "var(--seam)"}`,
                    borderRadius: 10, padding: "20px 16px", textAlign: "center",
                    background: docUploadDrag ? "rgba(201,146,42,0.06)" : "var(--leather3)",
                    transition: "all .2s", cursor: "pointer", position: "relative",
                  }}
                  onClick={() => document.getElementById("doc-file-input").click()}
                >
                  <input
                    id="doc-file-input" type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    style={{ display: "none" }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      const sizeKb = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
                      const ext = file.name.split(".").pop()?.toLowerCase() || "file";
                      setNewDocFile({ name: file.name, size: sizeKb, url, type: ext, rawFile: file });
                      if (!newDocName.trim()) setNewDocName(file.name.replace(/\.[^.]+$/, ""));
                    }}
                  />
                  {newDocFile ? (
                    <div style={{ ...row("center", 10), justifyContent: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 7, background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
                        <SectionIcon icon="check" size={18} />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{newDocFile.name}</div>
                        <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{newDocFile.size} · {newDocFile.type.toUpperCase()}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setNewDocFile(null); }} style={{ marginLeft: 4, background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ color: "var(--text3)", marginBottom: 6, display: "flex", justifyContent: "center" }}><SectionIcon icon="clip" size={22} /></div>
                      <div style={{ ...f(13, 600), color: "var(--text2)" }}>Tap to upload or drag & drop</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>PDF, DOC, DOCX, XLS, JPG, PNG</div>
                    </>
                  )}
                </div>

                <div style={col(5)}>
                  <label style={lbl}>Display Name</label>
                  <input style={inp()} value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="Document name shown to members" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(5)}>
                    <label style={lbl}>Category</label>
                    <select style={dropStyle()} value={newDocCat} onChange={e => setNewDocCat(e.target.value)}>
                      <option>Contract & Bylaws</option>
                      <option>Forms</option>
                      <option>Flyers</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={col(5)}>
                    <label style={lbl}>Description</label>
                    <input style={inp()} value={newDocDesc} onChange={e => setNewDocDesc(e.target.value)} placeholder="Optional note" />
                  </div>
                </div>

                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Document added!</div>}
                {newDocUploading && <div style={{ ...f(12, 600), color: "var(--gold)" }}>⏳ Uploading file...</div>}
                <button
                  style={btnGold(!newDocName.trim() || newDocUploading)}
                  disabled={!newDocName.trim() || newDocUploading}
                  onClick={async () => {
                    const now = new Date();
                    const updatedStr = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
                    let fileUrl = undefined;
                    let fileType = newDocFile?.type || undefined;
                    if (newDocFile?.rawFile) {
                      try {
                        setNewDocUploading(true);
                        fileUrl = await uploadDocumentFile(newDocFile.rawFile);
                      } catch (err) {
                        console.error("Upload failed:", err);
                        alert("File upload failed. Please try again.");
                        setNewDocUploading(false);
                        return;
                      }
                      setNewDocUploading(false);
                    }
                    const newDoc = {
                      id: Date.now(), name: newDocName, category: newDocCat,
                      size: newDocFile?.size || "—", updated: updatedStr,
                      desc: newDocDesc || undefined,
                      fileUrl,
                      fileType,
                    };
                    setDocuments(prev => {
                      const updated = [...prev, newDoc];
                      saveDocuments(updated);
                      return updated;
                    });
                    setNewDocName(""); setNewDocDesc(""); setNewDocFile(null);
                    saveFlash(() => {});
                  }}
                >{newDocUploading ? "UPLOADING..." : "ADD DOCUMENT"}</button>
              </div>

              {/* Existing docs list */}
              <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>
                All Documents ({documents.length})
              </div>
              {documents.map(d => (
                <div key={d.id} style={{ ...card({ padding: "0", overflow: "hidden" }) }}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 38, borderRadius: 6, background: "var(--leather3)", border: "1px solid var(--seam)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, gap: 2 }}>
                      <SectionIcon icon="file" size={14} />
                      <span style={{ ...f(8, 700), color: "var(--text3)", letterSpacing: ".04em" }}>{(d.fileType || "DOC").toUpperCase().slice(0,4)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{d.category} · {d.size} · {d.updated}</div>
                    </div>
                    {d.id > 2 && (
                      <button onClick={() => setConfirmModal({ title: "Delete Document", message: `Delete "${d.name}"? This cannot be undone.`, danger: true, onConfirm: () => { const removed = d; setDocuments(prev => { const updated = prev.filter(x => x.id !== d.id); saveDocuments(updated); return updated; }); setToastMsg({ message: `"${d.name}" deleted`, onUndo: () => setDocuments(prev => { const restored = [...prev, removed]; saveDocuments(restored); return restored; }) }); } })}
                        style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", flexShrink: 0 }}>
                        DEL
                      </button>
                    )}
                  </div>
                  {d.fileUrl && (
                    <div style={{ borderTop: "1px solid var(--seam)", padding: "8px 14px" }}>
                      <a href={d.fileUrl} download={d.name} style={{ ...f(11, 700), color: "var(--gold)", textDecoration: "none", ...row("center", 5) }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        DOWNLOAD ATTACHED FILE
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "admin" && adminSection === "contacts" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title={editContactId ? "Edit Contact" : "DWA Contacts"} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>{editContactId ? "Edit Contact" : "Add Contact"}</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>Contacts appear on the DWA Contacts page visible to all members.</div>
                <div style={col(5)}>
                  <label style={lbl}>Full Name</label>
                  <input style={inp()} value={newContactName} onChange={e => setNewContactName(e.target.value)} placeholder="Full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(5)}>
                    <label style={lbl}>Title</label>
                    <select style={dropStyle()} value={newContactTitle} onChange={e => setNewContactTitle(e.target.value)}>
                      <option>President</option>
                      <option>Vice President</option>
                      <option>Treasurer</option>
                      <option>Recording Secretary</option>
                      <option>Secretary</option>
                      <option>Trustee</option>
                      <option>Sergeant at Arms</option>
                      <option>Shop Steward</option>
                    </select>
                  </div>
                  <div style={col(5)}>
                    <label style={lbl}>Location</label>
                    <input style={inp()} value={newContactDept} onChange={e => setNewContactDept(e.target.value)} placeholder="e.g. Jersey City" />
                  </div>
                </div>
                <div style={col(5)}>
                  <label style={lbl}>Phone</label>
                  <input style={inp()} type="tel" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} placeholder="Phone number" />
                </div>
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>{editContactId ? "✓ Contact updated!" : "✓ Saved!"}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnGold(!newContactName.trim()), flex: 1 }} disabled={!newContactName.trim()} onClick={() => {
                    if (editContactId) {
                      setStewardsData(prev => {
                        const updated = prev.map(s => s.id === editContactId ? { ...s, name: newContactName.trim(), title: newContactTitle, dept: newContactDept.trim(), phone: newContactPhone.replace(/\D/g, "") } : s);
                        saveStewards(updated);
                        return updated;
                      });
                      setEditContactId(null);
                    } else {
                      setStewardsData(prev => { const updated = [...prev, { id: Date.now(), name: newContactName.trim(), title: newContactTitle, dept: newContactDept.trim(), phone: newContactPhone.replace(/\D/g, "") }]; saveStewards(updated); return updated; });
                    }
                    setNewContactName(""); setNewContactPhone(""); setNewContactDept(""); setNewContactTitle("Shop Steward");
                    saveFlash(() => {});
                  }}>{editContactId ? "UPDATE CONTACT" : "ADD CONTACT"}</button>
                  {editContactId && <button onClick={() => { setEditContactId(null); setNewContactName(""); setNewContactPhone(""); setNewContactDept(""); setNewContactTitle("Shop Steward"); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Current Contacts ({stewardsData.length})</div>
                {stewardsData.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No contacts added yet.</div>}
                {stewardsData.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(10, 600), color: "#c4a44e" }}>{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{s.title}{s.dept ? ` · ${s.dept}` : ""}{s.phone ? ` · ${s.phone}` : ""}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => { setEditContactId(s.id); setNewContactName(s.name); setNewContactTitle(s.title || "Shop Steward"); setNewContactDept(s.dept || ""); setNewContactPhone(s.phone || ""); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => { setConfirmModal({ title: `Remove ${s.name}?`, message: `${s.name} will be removed from DWA Contacts.`, danger: true, onConfirm: () => { const removed = s; setStewardsData(prev => { const updated = prev.filter(x => x.id !== s.id); saveStewards(updated); return updated; }); setToastMsg({ message: `${s.name} removed`, onUndo: () => { setStewardsData(prev => { const restored = [...prev, removed]; saveStewards(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "useradmin" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="User Admin" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>All Members ({allApprovedUsers.length})</div>
                <input style={inp()} value={userAdminSearch} onChange={e => setUserAdminSearch(e.target.value)} placeholder="Search by name or email..." />
              </div>
              {allApprovedUsers.filter(u => { const q = userAdminSearch.toLowerCase(); return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q); }).map(u => (
                <div key={u.uid} style={{ ...card({ padding: "14px" }), ...col(12) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(12, 600), color: "#c4a44e" }}>{(u.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(14, 600), color: "var(--text)" }}>{u.name || "Unknown"}</div>
                      <div style={{ ...f(11, 400), color: "var(--text3)" }}>{u.email || "No email"}{u.phone ? ` · ${u.phone}` : ""}{u.location ? ` · ${u.location}` : ""}</div>
                    </div>
                    <div style={{ ...f(9, 700), color: u.role === "officer" || u.role === "super" ? "#1a0f00" : u.role === "steward" ? "var(--gold)" : "var(--text3)", background: u.role === "officer" || u.role === "super" ? "linear-gradient(135deg,#a06b18,#c9922a)" : u.role === "steward" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>{u.role || "member"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => { setProfileUserId(u.uid); setShowProfile(true); }} style={{ padding: "7px 10px", background: "rgba(201,146,42,0.15)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, color: "var(--gold)", ...f(10, 700), cursor: "pointer" }}>VIEW PROFILE</button>
                    <button onClick={() => { setConfirmModal({ title: `Demote ${u.name} to Member?`, message: "They will lose steward/officer privileges.", danger: true, onConfirm: async () => { await updateUserRole(u.uid, "member"); setAdminEmails(prev => prev.filter(e => e !== u.email)); setToastMsg({ message: `${u.name} demoted to Member` }); } }); }} style={{ padding: "7px 10px", background: u.role === "member" || !u.role ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: u.role === "member" || !u.role ? "1px solid rgba(201,146,42,0.3)" : "1px solid var(--seam)", borderRadius: 6, color: u.role === "member" || !u.role ? "var(--gold)" : "var(--text3)", ...f(10, 700), cursor: "pointer" }}>MEMBER</button>
                    <button onClick={() => { setConfirmModal({ title: `Promote ${u.name} to Steward?`, message: "They will be able to approve members, update seniority, and moderate The Floor.", onConfirm: async () => { await updateUserRole(u.uid, "steward"); setToastMsg({ message: `${u.name} is now a Steward` }); } }); }} style={{ padding: "7px 10px", background: u.role === "steward" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: u.role === "steward" ? "1px solid rgba(201,146,42,0.3)" : "1px solid var(--seam)", borderRadius: 6, color: u.role === "steward" ? "var(--gold)" : "var(--text3)", ...f(10, 700), cursor: "pointer" }}>STEWARD</button>
                    <button onClick={() => { setConfirmModal({ title: `Promote ${u.name} to Officer?`, message: "They will have full admin access.", onConfirm: async () => { await updateUserRole(u.uid, "officer"); setAdminEmails(prev => prev.includes(u.email) ? prev : [...prev, u.email]); setToastMsg({ message: `${u.name} is now an Officer` }); } }); }} style={{ padding: "7px 10px", background: u.role === "officer" || u.role === "super" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: u.role === "officer" || u.role === "super" ? "1px solid rgba(201,146,42,0.3)" : "1px solid var(--seam)", borderRadius: 6, color: u.role === "officer" || u.role === "super" ? "var(--gold)" : "var(--text3)", ...f(10, 700), cursor: "pointer" }}>OFFICER</button>
                    <button onClick={() => { setConfirmModal({ title: `Reset password for ${u.name}?`, message: `A reset link will be sent to ${u.email}.`, onConfirm: async () => { try { await sendPasswordResetToUser(u.email); setToastMsg({ message: `Reset email sent to ${u.email}` }); } catch(e) { setToastMsg({ message: "Error: " + e.message }); } } }); }} style={{ padding: "7px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--seam)", borderRadius: 6, color: "var(--text2)", ...f(10, 700), cursor: "pointer" }}>RESET PW</button>
                    <button onClick={() => { setConfirmModal({ title: `Delete ${u.name}'s account?`, message: "This will remove their profile from the app. This cannot be undone.", danger: true, onConfirm: async () => { try { await deleteUserProfile(u.uid); setToastMsg({ message: `${u.name}'s profile deleted` }); } catch(e) { setToastMsg({ message: "Error: " + e.message }); } } }); }} style={{ padding: "7px 10px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, color: "var(--red)", ...f(10, 700), cursor: "pointer" }}>DELETE</button>
                  </div>
                </div>
              ))}
              {allApprovedUsers.length === 0 && <div style={{ ...card({ padding: "16px" }), ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No approved members yet.</div>}
            </div>
          )}

          {tab === "admin" && adminSection === "banned" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Banned Users" />
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 8 }}>These members are suspended from posting on The Floor. They can still use the app.</div>
                {bannedUsers.length === 0 && <div style={{ ...f(13, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>No banned users.</div>}
                {bannedUsers.map(b => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a1010", border: "1px solid #6b3a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(10, 600), color: "#e87a7a" }}>{b.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{b.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Banned by {b.bannedBy || "—"} · {formatFloorTime(b.bannedAt)}</div>
                    </div>
                    <button onClick={() => handleUnbanUser(b.name)} style={{ ...f(11, 700, 'bebas'), color: "var(--green)", background: "rgba(45,122,79,0.1)", border: "1px solid var(--green)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", letterSpacing: ".08em" }}>UNBAN</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "accounts" && isSuper && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Manage Officials" />

              {/* Officers */}
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>Add Officer by Email</div>
                <div style={col(5)}><input style={inp()} value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="official@dwa.org" /></div>
                {adminMgmtError && <div style={{ ...f(12, 400, 'serif'), color: "var(--red)", fontStyle: "italic" }}>{adminMgmtError}</div>}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
                <button style={btnGold(!newAdminEmail.trim())} disabled={!newAdminEmail.trim()} onClick={() => {
                  const e = newAdminEmail.toLowerCase().trim();
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setAdminMgmtError("Invalid email."); return; }
                  if (e === SUPER_ADMIN_EMAIL) { setAdminMgmtError("That's the super admin."); return; }
                  if (adminEmails.map(a => a.toLowerCase()).includes(e)) { setAdminMgmtError("Already an official."); return; }
                  setAdminEmails(prev => [...prev, e]); setNewAdminEmail(""); setAdminMgmtError(""); saveFlash(() => { });
                }}>PROMOTE TO OFFICER</button>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Current Officers</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                  <div style={{ flex: 1, ...f(13, 400), color: "var(--text)" }}>{SUPER_ADMIN_EMAIL}</div>
                  <div style={{ ...f(9, 700), color: "#1a0f00", background: "linear-gradient(135deg,#a06b18,#c9922a)", padding: "3px 8px", borderRadius: 6 }}>SUPER</div>
                </div>
                {adminEmails.map(em => (
                  <div key={em} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ flex: 1, ...f(13, 400), color: "var(--text)" }}>{em}</div>
                    <div style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", padding: "3px 8px", borderRadius: 6 }}>OFFICER</div>
                    <button onClick={() => { setConfirmModal({ title: `Demote ${em}?`, message: "They will no longer have officer privileges.", danger: true, onConfirm: () => { setAdminEmails(prev => prev.filter(a => a !== em)); setToastMsg({ message: `${em} demoted from officer` }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEMOTE</button>
                  </div>
                ))}
              </div>

              {/* Stewards */}
              <div className="gold-rule" style={{ margin: "4px 0" }} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>Promote to Steward</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>Stewards can approve new members and moderate The Floor.</div>
                <div style={col(5)}>
                  <label style={lbl}>Full Name</label>
                  <input style={inp()} value={newStewardName} onChange={e => setNewStewardName(e.target.value)} placeholder="Member's full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(5)}>
                    <label style={lbl}>Location</label>
                    <select style={dropStyle()} value={newStewardDept} onChange={e => setNewStewardDept(e.target.value)}>
                      <option>Jersey City</option>
                      <option>Florence</option>
                    </select>
                  </div>
                  <div style={col(5)}>
                    <label style={lbl}>Phone (optional)</label>
                    <input style={inp()} type="tel" value={newStewardPhone} onChange={e => setNewStewardPhone(e.target.value)} placeholder="Phone number" />
                  </div>
                </div>
                <button style={btnGold(!newStewardName.trim())} disabled={!newStewardName.trim()} onClick={() => {
                  setStewardsData(prev => { const updated = [...prev, { id: Date.now(), name: newStewardName.trim(), title: "Shop Steward", dept: newStewardDept, phone: newStewardPhone.replace(/\D/g, "") }]; saveStewards(updated); return updated; });
                  setNewStewardName(""); setNewStewardPhone(""); setNewStewardDept("Jersey City");
                  saveFlash(() => {});
                }}>PROMOTE TO STEWARD</button>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Current Stewards ({stewardsData.length})</div>
                {stewardsData.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No stewards assigned.</div>}
                {stewardsData.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(10, 600), color: "#c4a44e" }}>{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{s.dept || "—"}{s.phone ? ` · ${s.phone}` : ""}</div>
                    </div>
                    <div style={{ ...f(9, 700), color: "#e8b84b", background: "#2a1f0a", padding: "3px 8px", borderRadius: 6 }}>STEWARD</div>
                    <button onClick={() => { setConfirmModal({ title: `Demote ${s.name}?`, message: `${s.name} will lose steward privileges. They'll become a regular member.`, danger: true, onConfirm: () => { const removed = s; setStewardsData(prev => { const updated = prev.filter(x => x.id !== s.id); saveStewards(updated); return updated; }); setToastMsg({ message: `${s.name} demoted to member`, onUndo: () => { setStewardsData(prev => { const restored = [...prev, removed]; saveStewards(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", flexShrink: 0 }}>DEMOTE</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="nav-glow" style={{ background: "var(--leather)", flexShrink: 0, position: "relative", zIndex: 1, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={{ display: "flex", padding: "6px 4px 10px" }}>
};

export default StewardView;
