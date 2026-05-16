import React from "react";

export default function AdminSections({ section, ctx }) {
  const {
    // style helpers
    card, col, row, f, inp, btnGold, lbl, dropStyle,
    SectionIcon, Tog,
    // role / super
    isSuper,
    // announcements
    announcements, setAnnouncements,
    annTitle, setAnnTitle,
    annBody, setAnnBody,
    annUrgent, setAnnUrgent,
    annPosted,
    translating, setTranslating,
    editAnnId, setEditAnnId,
    postAnn,
    saveAnnouncements,
    // seniority
    seniority, setSeniority,
    editSenId, setEditSenId,
    newSenName, setNewSenName,
    newSenDate, setNewSenDate,
    newSenLocation, setNewSenLocation,
    senError, setSenError,
    saveSeniorityFn,
    // members
    pendingMembers,
    memberEmails, setMemberEmails,
    approveMember, denyMember,
    // meeting
    editMeeting, setEditMeeting,
    setNextMeeting,
    saveMeetingInfo,
    zoomInfo,
    // zoom
    editZoom, setEditZoom,
    setZoomInfo,
    saveZoomInfoFn,
    // minutes
    minutes, setMinutes,
    newMinTitle, setNewMinTitle,
    newMinDate, setNewMinDate,
    newMinSummary, setNewMinSummary,
    editMinId, setEditMinId,
    saveMinutesFn,
    // documents
    documents, setDocuments,
    newDocFile, setNewDocFile,
    newDocName, setNewDocName,
    newDocCat, setNewDocCat,
    newDocDesc, setNewDocDesc,
    docUploadDrag, setDocUploadDrag,
    newDocUploading, setNewDocUploading,
    saveDocuments,
    uploadDocumentFile,
    // contacts / stewards
    stewardsData, setStewardsData,
    newContactName, setNewContactName,
    newContactPhone, setNewContactPhone,
    newContactDept, setNewContactDept,
    newContactTitle, setNewContactTitle,
    editContactId, setEditContactId,
    saveStewards,
    // user admin
    allApprovedUsers,
    userAdminSearch, setUserAdminSearch,
    setProfileUserId, setShowProfile,
    adminEmails, setAdminEmails,
    updateUserRole,
    deleteUserProfile,
    sendPasswordResetToUser,
    // banned
    bannedUsers,
    handleUnbanUser,
    formatFloorTime,
    // accounts (super-only)
    SUPER_ADMIN_EMAIL,
    newAdminEmail, setNewAdminEmail,
    adminMgmtError, setAdminMgmtError,
    newStewardName, setNewStewardName,
    newStewardDept, setNewStewardDept,
    newStewardPhone, setNewStewardPhone,
    // shared admin UI
    adminSaved,
    saveFlash,
    setAdminSection,
    setConfirmModal,
    setToastMsg,
  } = ctx;

  const AdminFormHeader = ({ title }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ ...f(10, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em" }}>{title}</div>
      <button onClick={() => setAdminSection(null)} style={{ ...f(12, 700), color: "var(--text3)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← BACK</button>
    </div>
  );

  if (section === "announcements") {
    return (
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
    );
  }

  if (section === "seniority") {
    return (
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
    );
  }

  if (section === "meeting") {
    return (
      <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <AdminFormHeader title="Union Meeting" />
        <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
          {[["Meeting Title", "title", "e.g. Contract Ratification Vote", "text"], ["Date", "date", "", "date"], ["Time", "time", "", "time"], ["Location", "location", "e.g. Union Hall", "text"]].map(([label, key, ph, type]) => (
            <div key={key} style={col(5)}>
              <label style={lbl}>{label}</label>
              <input type={type} style={inp()} value={editMeeting[key] || ""} placeholder={ph} onChange={e => setEditMeeting(prev => ({ ...prev, [key]: e.target.value }))} />
            </div>
          ))}
          {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
          <button style={btnGold()} onClick={async () => { const info = { ...editMeeting }; setNextMeeting(info); saveMeetingInfo(info); saveFlash(() => {}); try { await fetch('/api/notifications/meeting-updated', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: info.title || 'Union Meeting', date: info.date, time: info.time, location: info.location || '', zoomId: zoomInfo?.id || '', zoomPasscode: zoomInfo?.passcode || '', zoomLink: zoomInfo?.link || '' }) }); setToastMsg({ message: "Meeting saved · members notified" }); } catch(e) { console.log('Meeting notification failed:', e); setToastMsg({ message: "Meeting saved (notification failed)" }); } }}>SAVE MEETING INFO</button>
        </div>
        <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Preview: {editMeeting.title} · {editMeeting.date} · {editMeeting.location}</div>
      </div>
    );
  }

  if (section === "zoom") {
    return (
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
    );
  }

  if (section === "minutes") {
    return (
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
    );
  }

  if (section === "documents") {
    return (
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
    );
  }

  if (section === "contacts") {
    return (
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
    );
  }

  if (section === "useradmin") {
    return <UserAdminPanel ctx={ctx} />;
  }

  if (section === "banned") {
    return (
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
    );
  }

  if (section === "broadcast") {
    return <BroadcastPanel ctx={ctx} />;
  }

  if (section === "grievances") {
    return <GrievancesPanel ctx={ctx} />;
  }

  return null;
}

function BroadcastPanel({ ctx }) {
  const {
    card, col, row, f, inp, btnGold, lbl,
    SectionIcon,
    setToastMsg,
    setAdminSection,
  } = ctx;
  const pushToken = ctx.pushToken || null;

  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [type, setType] = React.useState("announcement");
  const [url, setUrl] = React.useState("/");
  const [sending, setSending] = React.useState(false);
  const [lastResult, setLastResult] = React.useState(null);

  const types = [
    { v: "announcement", label: "Announcement", icon: "📢" },
    { v: "meeting", label: "Meeting", icon: "📅" },
    { v: "vote", label: "Vote", icon: "🗳️" },
    { v: "grievance", label: "Grievance", icon: "📋" },
    { v: "general", label: "General", icon: "🔔" },
  ];

  const send = async (testOnly) => {
    if (!title.trim() || !body.trim()) {
      setToastMsg({ message: "Title and body required." });
      return;
    }
    if (testOnly && !pushToken) {
      setToastMsg({ message: "Enable notifications in Settings first to test." });
      return;
    }
    setSending(true);
    setLastResult(null);
    try {
      const payload = { title: title.trim(), body: body.trim(), type, url: url.trim() || "/" };
      if (testOnly) payload.tokens = [pushToken];
      const res = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLastResult(data);
      if (data.success) {
        setToastMsg({ message: testOnly ? "Test sent to your device" : `Sent to ${data.sent} device${data.sent === 1 ? "" : "s"}` });
        if (!testOnly) { setTitle(""); setBody(""); }
      } else {
        setToastMsg({ message: data.message || data.error || "Failed to send" });
      }
    } catch (e) {
      console.error("Broadcast failed:", e);
      setToastMsg({ message: "Failed to send. Try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...row("center", 0), justifyContent: "space-between" }}>
        <div style={{ ...f(11, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Send Notification</div>
        <button onClick={() => setAdminSection(null)} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← BACK</button>
      </div>

      <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
        <div style={col(5)}>
          <div style={lbl}>TITLE</div>
          <input style={inp()} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Meeting tonight at 7pm" maxLength={60} />
          <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", textAlign: "right", fontStyle: "italic" }}>{title.length}/60</div>
        </div>
        <div style={col(5)}>
          <div style={lbl}>MESSAGE</div>
          <textarea style={{ ...inp(), minHeight: 70, resize: "vertical", lineHeight: 1.5 }} value={body} onChange={e => setBody(e.target.value)} placeholder="What do you want to tell members?" maxLength={200} />
          <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", textAlign: "right", fontStyle: "italic" }}>{body.length}/200</div>
        </div>
        <div style={col(5)}>
          <div style={lbl}>TYPE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {types.map(t => (
              <div key={t.v} onClick={() => setType(t.v)} style={{ padding: "10px 4px", textAlign: "center", borderRadius: 8, border: type === t.v ? "1.5px solid var(--gold)" : "1px solid var(--seam)", background: type === t.v ? "rgba(201,146,42,0.12)" : "transparent", cursor: "pointer" }}>
                <div style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</div>
                <div style={{ ...f(9, 600), color: type === t.v ? "var(--gold)" : "var(--text3)", marginTop: 4 }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={col(5)}>
          <div style={lbl}>OPEN URL (optional)</div>
          <input style={inp()} value={url} onChange={e => setUrl(e.target.value)} placeholder="/ (homepage)" />
          <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Where to send users when they tap the notification.</div>
        </div>
      </div>

      <div style={{ ...card({ padding: "14px 16px", borderLeft: "3px solid var(--gold)" }) }}>
        <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".08em", marginBottom: 8 }}>PREVIEW</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>{types.find(t => t.v === type)?.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...f(13, 700), color: "var(--cream)", marginBottom: 2 }}>{title || "(title)"}</div>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.45 }}>{body || "(message)"}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button
          onClick={() => send(true)}
          disabled={sending}
          style={{ padding: "12px", border: "1px solid var(--seam)", borderRadius: 8, background: "transparent", color: "var(--cream)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.5 : 1 }}
        >
          {sending ? "…" : "SEND TEST TO ME"}
        </button>
        <button
          onClick={() => send(false)}
          disabled={sending}
          style={{ ...btnGold(), padding: "12px", ...f(12, 700, 'bebas'), letterSpacing: ".1em", opacity: sending ? 0.5 : 1, cursor: sending ? "not-allowed" : "pointer" }}
        >
          {sending ? "SENDING…" : "SEND TO EVERYONE"}
        </button>
      </div>

      {lastResult && lastResult.success && (
        <div style={{ ...card({ padding: "12px 14px", borderLeft: "3px solid var(--green)" }) }}>
          <div style={{ ...f(11, 700), color: "var(--green)", letterSpacing: ".08em", marginBottom: 4 }}>LAST SEND</div>
          <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)" }}>
            Delivered to {lastResult.sent} of {lastResult.totalDevices} device{lastResult.totalDevices === 1 ? "" : "s"}
            {lastResult.failed > 0 && ` · ${lastResult.failed} failed`}
            {lastResult.staleRemoved > 0 && ` · ${lastResult.staleRemoved} stale token${lastResult.staleRemoved === 1 ? "" : "s"} cleaned up`}
          </div>
        </div>
      )}
    </div>
  );
}

function UserAdminPanel({ ctx }) {
  const {
    card, col, row, f, inp, btnGold, lbl, dropStyle,
    isSuper, SUPER_ADMIN_EMAIL,
    // members tab
    allApprovedUsers, userAdminSearch, setUserAdminSearch,
    setProfileUserId, setShowProfile,
    updateUserRole, deleteUserProfile, sendPasswordResetToUser,
    adminEmails, setAdminEmails,
    // requests tab
    pendingMembers, memberEmails, setMemberEmails,
    approveMember, denyMember,
    // officials tab
    newAdminEmail, setNewAdminEmail, adminMgmtError, setAdminMgmtError,
    newStewardName, setNewStewardName,
    newStewardDept, setNewStewardDept,
    newStewardPhone, setNewStewardPhone,
    stewardsData, setStewardsData, saveStewards,
    adminSaved, saveFlash,
    // shared
    setConfirmModal, setToastMsg, setAdminSection,
  } = ctx;

  const [tab, setTab] = React.useState(pendingMembers && pendingMembers.length > 0 ? "requests" : "members");

  const tabs = [
    { id: "members", label: "MEMBERS", count: allApprovedUsers.length },
    { id: "requests", label: "REQUESTS", count: pendingMembers.length, alert: pendingMembers.length > 0 },
    ...(isSuper ? [{ id: "officials", label: "OFFICIALS", count: adminEmails.length + stewardsData.length }] : []),
  ];

  return (
    <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ ...f(10, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em" }}>User Admin</div>
        <button onClick={() => setAdminSection(null)} style={{ ...f(12, 700), color: "var(--text3)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← BACK</button>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--seam)" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "12px 8px", background: "none",
              border: "none", borderBottom: tab === t.id ? "2px solid var(--gold)" : "2px solid transparent",
              color: tab === t.id ? "var(--gold)" : "var(--text3)",
              ...f(11, 700), letterSpacing: ".08em", cursor: "pointer", position: "relative",
            }}
          >
            {t.label} <span style={{ opacity: 0.6 }}>({t.count})</span>
            {t.alert && (
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#e74c3c" }} />
            )}
          </button>
        ))}
      </div>

      {/* MEMBERS TAB */}
      {tab === "members" && (
        <>
          <div style={{ ...card({ padding: "14px" }) }}>
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
        </>
      )}

      {/* REQUESTS TAB */}
      {tab === "requests" && (
        <>
          <div style={{ ...card({ padding: "16px" }) }}>
            <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 10 }}>Pending ({pendingMembers.length})</div>
            {pendingMembers.length === 0 && <div style={{ ...f(13, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>No pending requests. New signups will appear here.</div>}
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
        </>
      )}

      {/* OFFICIALS TAB (super admin only) */}
      {tab === "officials" && isSuper && (
        <>
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
            {(() => {
              // Build unified officers list from BOTH sources:
              //   1. Users with role === "officer" or "super" in their profile
              //   2. Emails in adminEmails (legacy whitelist) not already covered
              const rows = [];
              const seen = new Set();
              // Super admin first
              rows.push({ key: "super", email: SUPER_ADMIN_EMAIL, name: "Super Admin", role: "super", uid: null });
              seen.add(SUPER_ADMIN_EMAIL.toLowerCase());
              // Profile-based officers (registered users)
              (allApprovedUsers || []).forEach(u => {
                const em = (u.email || "").toLowerCase();
                if (!em || seen.has(em)) return;
                if (u.role === "officer" || u.role === "super") {
                  rows.push({ key: u.uid, email: u.email, name: u.name || u.email, role: u.role, uid: u.uid });
                  seen.add(em);
                }
              });
              // Whitelist emails (no profile yet, but pre-authorized)
              (adminEmails || []).forEach(em => {
                const lower = em.toLowerCase();
                if (seen.has(lower)) return;
                rows.push({ key: em, email: em, name: em, role: "officer", uid: null, whitelistOnly: true });
                seen.add(lower);
              });
              return rows.map(r => (
                <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                    {r.name !== r.email && <div style={{ ...f(11, 400), color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.email}</div>}
                    {r.whitelistOnly && <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Pending first login</div>}
                  </div>
                  {r.role === "super"
                    ? <div style={{ ...f(9, 700), color: "#1a0f00", background: "linear-gradient(135deg,#a06b18,#c9922a)", padding: "3px 8px", borderRadius: 6 }}>SUPER</div>
                    : <div style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", padding: "3px 8px", borderRadius: 6 }}>OFFICER</div>}
                  {r.role !== "super" && (
                    <button onClick={() => { setConfirmModal({ title: `Demote ${r.name}?`, message: "They will no longer have officer privileges.", danger: true, onConfirm: async () => {
                      if (r.uid) {
                        try { await updateUserRole(r.uid, "member"); } catch (e) { console.error("Demote role failed:", e); }
                      }
                      setAdminEmails(prev => prev.filter(a => a.toLowerCase() !== r.email.toLowerCase()));
                      setToastMsg({ message: `${r.name} demoted from officer` });
                    } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", flexShrink: 0 }}>DEMOTE</button>
                  )}
                </div>
              ));
            })()}
          </div>

          {/* Stewards roster */}
          <div className="gold-rule" style={{ margin: "4px 0" }} />
          <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
            <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>Add Steward to Roster</div>
            <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>Adds the steward to the public contact roster. To grant app permissions, use the MEMBERS tab.</div>
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
            }}>ADD TO ROSTER</button>
          </div>
          <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
            <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Stewards Roster ({stewardsData.length})</div>
            {stewardsData.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No stewards on the roster.</div>}
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
                <button onClick={() => { setConfirmModal({ title: `Remove ${s.name} from roster?`, message: `${s.name} will be removed from the public stewards roster.`, danger: true, onConfirm: () => { const removed = s; setStewardsData(prev => { const updated = prev.filter(x => x.id !== s.id); saveStewards(updated); return updated; }); setToastMsg({ message: `${s.name} removed from roster`, onUndo: () => { setStewardsData(prev => { const restored = [...prev, removed]; saveStewards(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", flexShrink: 0 }}>REMOVE</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GrievancesPanel({ ctx }) {
  const {
    card, col, row, f, btnGold, btnOutline,
    grievances, updateGrievanceStatus, deleteGrievance,
    setAdminSection, setConfirmModal, setToastMsg,
  } = ctx;

  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = React.useState("active"); // active | new | reviewing | resolved | archived

  const list = (grievances || []).filter(g => {
    if (filter === "active") return g.status !== "archived";
    return g.status === filter;
  });
  const counts = {
    active: (grievances || []).filter(g => g.status !== "archived").length,
    new: (grievances || []).filter(g => g.status === "new").length,
    reviewing: (grievances || []).filter(g => g.status === "reviewing").length,
    resolved: (grievances || []).filter(g => g.status === "resolved").length,
    archived: (grievances || []).filter(g => g.status === "archived").length,
  };

  const fmtDate = (ms) => {
    if (!ms) return "—";
    const d = new Date(ms);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };
  const statusColor = (s) => s === "new" ? "var(--red)" : s === "reviewing" ? "var(--gold)" : s === "archived" ? "var(--text3)" : "var(--green)";
  const statusBg = (s) => s === "new" ? "rgba(192,57,43,0.1)" : s === "reviewing" ? "rgba(201,146,42,0.1)" : s === "archived" ? "rgba(255,255,255,0.04)" : "rgba(45,122,79,0.1)";

  if (selected) {
    return <GrievanceDetail ctx={ctx} grievance={selected} onBack={() => setSelected(null)} fmtDate={fmtDate} statusColor={statusColor} statusBg={statusBg} />;
  }

  return (
    <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ ...f(11, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em" }}>Grievances</div>
        <button onClick={() => setAdminSection(null)} style={{ ...f(12, 700), color: "var(--text3)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← BACK</button>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[["active", "Active"], ["new", "New"], ["reviewing", "Reviewing"], ["resolved", "Resolved"], ["archived", "Archived"]].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding: "6px 12px", borderRadius: 20, cursor: "pointer",
            background: filter === id ? "var(--gold)" : "rgba(255,255,255,0.04)",
            color: filter === id ? "#1a0f00" : "var(--text2)",
            border: filter === id ? "none" : "1px solid var(--seam)",
            ...f(11, 700), letterSpacing: ".05em",
          }}>
            {label} <span style={{ opacity: 0.7 }}>({counts[id]})</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div style={{ ...card({ padding: "24px" }), textAlign: "center" }}>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>
            {filter === "active" ? "No active grievances. Nothing needs attention." : `No ${filter} grievances.`}
          </div>
        </div>
      ) : (
        list.map(g => (
          <div key={g.id} onClick={() => setSelected(g)} style={{ ...card({ padding: "14px", borderLeft: `3px solid ${statusColor(g.status)}` }), cursor: "pointer", ...col(6) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...f(14, 600), color: "var(--cream)" }}>{g.submitterName || "Member"}</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{fmtDate(g.submittedAtMs)}</div>
              </div>
              <div style={{ ...f(9, 700), color: statusColor(g.status), background: statusBg(g.status), padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>{g.status || "new"}</div>
            </div>
            {g.issueType && <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".05em" }}>{g.issueType}</div>}
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{g.description}</div>
          </div>
        ))
      )}
    </div>
  );
}

function GrievanceDetail({ ctx, grievance, onBack, fmtDate, statusColor, statusBg }) {
  const { card, col, f, btnGold, btnOutline, updateGrievanceStatus, setConfirmModal, setToastMsg } = ctx;
  const g = grievance;
  // Backward-compat: older docs stored signature under contractArticle
  const signature = g.signature || g.contractArticle || "";

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=850,height=1100");
    if (!printWindow) {
      setToastMsg && setToastMsg({ message: "Please allow pop-ups to print." });
      return;
    }
    const row = (label, value) => `<tr><td style="padding:8px 12px;border:1px solid #333;font-weight:600;width:35%;background:#f7f2e9;">${label}</td><td style="padding:8px 12px;border:1px solid #333;">${value || "—"}</td></tr>`;
    const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Grievance — ${esc(g.submitterName)}</title>
      <style>
        body{font-family:'Helvetica',sans-serif;color:#000;background:#fff;padding:40px;max-width:800px;margin:0 auto;line-height:1.5;}
        h1{font-size:22px;border-bottom:2px solid #c9922a;padding-bottom:8px;margin-bottom:6px;}
        h2{font-size:14px;color:#c9922a;text-transform:uppercase;letter-spacing:.1em;margin-top:24px;margin-bottom:8px;}
        table{width:100%;border-collapse:collapse;margin-bottom:16px;}
        td{vertical-align:top;font-size:13px;}
        .desc{padding:14px;background:#f7f2e9;border:1px solid #333;border-radius:4px;font-size:13px;white-space:pre-wrap;}
        .sig{padding:14px;border:1px solid #333;border-radius:4px;font-family:'Brush Script MT',cursive;font-size:24px;color:#111;}
        .footer{margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-size:11px;color:#666;}
        @media print {body{padding:20px;}}
      </style></head><body>
      <h1>DAIRY WORKERS ASSOCIATION — GRIEVANCE</h1>
      <div style="font-size:12px;color:#666;margin-bottom:24px;">Submitted ${esc(fmtDate(g.submittedAtMs))} · Status: <strong>${esc((g.status||"new").toUpperCase())}</strong></div>

      <h2>Submitter</h2>
      <table>${row("Name", esc(g.submitterName))}${row("Email", esc(g.submitterEmail))}${row("Location", esc(g.submitterLocation))}${row("Date of Incident", esc(g.incidentDate))}</table>

      <h2>Explanation of Grievance</h2>
      <div class="desc">${esc(g.description)}</div>

      <h2>Proposed Solution</h2>
      <div class="desc">${esc(g.remedy) || "<em>(none specified)</em>"}</div>

      <h2>Witness(es)</h2>
      <div class="desc">${esc(g.witnesses) || "<em>(none listed)</em>"}</div>

      <h2>Signature</h2>
      <div class="sig">${esc(signature) || "—"}</div>

      <div class="footer">DWA Union · dwaunion.com · Reference ID: ${esc(g.id)}</div>
      <script>window.onload=()=>{window.print();};</script>
      </body></html>`);
    printWindow.document.close();
  };

  const setStatus = async (newStatus) => {
    try {
      await updateGrievanceStatus(g.id, newStatus);
      setToastMsg && setToastMsg({ message: `Status: ${newStatus}` });
    } catch (e) {
      console.error(e);
      setToastMsg && setToastMsg({ message: "Failed to update status." });
    }
  };

  const handleArchive = () => {
    setConfirmModal({
      title: "Archive this grievance?",
      message: "It will be hidden from the default lists but kept on record. You can find it later under the Archived filter.",
      danger: false,
      onConfirm: async () => {
        try { await updateGrievanceStatus(g.id, "archived"); setToastMsg && setToastMsg({ message: "Grievance archived" }); onBack(); }
        catch (e) { setToastMsg && setToastMsg({ message: "Failed to archive." }); }
      }
    });
  };

  const field = (label, value) => (
    <div style={col(2)}>
      <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</div>
      <div style={{ ...f(13, 400), color: "var(--text)" }}>{value || "—"}</div>
    </div>
  );

  return (
    <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ ...f(12, 700), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← ALL GRIEVANCES</button>
        <div style={{ ...f(9, 700), color: statusColor(g.status), background: statusBg(g.status), padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>{g.status || "new"}</div>
      </div>

      <div style={{ ...card({ padding: "16px" }), ...col(10) }}>
        <div>
          <div style={{ ...f(18, 600), color: "var(--cream)" }}>{g.submitterName || "Member"}</div>
          <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Submitted {fmtDate(g.submittedAtMs)}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {field("Email", g.submitterEmail)}
          {field("Location", g.submitterLocation)}
          {field("Date of Incident", g.incidentDate)}
          {field("Witness(es)", g.witnesses)}
        </div>
        <div style={col(2)}>
          <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Explanation of Grievance</div>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{g.description || "—"}</div>
        </div>
        <div style={col(2)}>
          <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Proposed Solution</div>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{g.remedy || "—"}</div>
        </div>
        <div style={col(2)}>
          <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".1em" }}>Signature</div>
          <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: 22, color: "var(--cream)", paddingTop: 2 }}>{signature || "—"}</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ ...card({ padding: "14px" }), ...col(10) }}>
        <div style={{ ...f(11, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em" }}>Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button onClick={handlePrint} style={{ ...btnGold(), padding: "12px", ...f(12, 700), letterSpacing: ".08em" }}>PRINT</button>
          <button onClick={() => { const subject = `Grievance from ${g.submitterName}`; const body = `Submitted ${fmtDate(g.submittedAtMs)}\n\nDate of Incident: ${g.incidentDate||"-"}\n\nExplanation:\n${g.description||""}\n\nProposed Solution:\n${g.remedy||"-"}\n\nWitness(es): ${g.witnesses||"-"}\n\nSignature: ${signature||"-"}`; window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; }} style={{ padding: "12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid var(--seam)", color: "var(--cream)", ...f(12, 700), letterSpacing: ".08em", cursor: "pointer" }}>EMAIL</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <button onClick={() => setStatus("new")} disabled={g.status === "new"} style={{ padding: "10px", borderRadius: 8, background: g.status === "new" ? "rgba(192,57,43,0.15)" : "rgba(255,255,255,0.03)", border: g.status === "new" ? "1px solid var(--red)" : "1px solid var(--seam)", color: g.status === "new" ? "var(--red)" : "var(--text2)", ...f(11, 700), letterSpacing: ".05em", cursor: g.status === "new" ? "default" : "pointer" }}>NEW</button>
          <button onClick={() => setStatus("reviewing")} disabled={g.status === "reviewing"} style={{ padding: "10px", borderRadius: 8, background: g.status === "reviewing" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: g.status === "reviewing" ? "1px solid var(--gold)" : "1px solid var(--seam)", color: g.status === "reviewing" ? "var(--gold)" : "var(--text2)", ...f(11, 700), letterSpacing: ".05em", cursor: g.status === "reviewing" ? "default" : "pointer" }}>REVIEWING</button>
          <button onClick={() => setStatus("resolved")} disabled={g.status === "resolved"} style={{ padding: "10px", borderRadius: 8, background: g.status === "resolved" ? "rgba(45,122,79,0.15)" : "rgba(255,255,255,0.03)", border: g.status === "resolved" ? "1px solid var(--green)" : "1px solid var(--seam)", color: g.status === "resolved" ? "var(--green)" : "var(--text2)", ...f(11, 700), letterSpacing: ".05em", cursor: g.status === "resolved" ? "default" : "pointer" }}>RESOLVED</button>
        </div>
        <button onClick={handleArchive} style={{ padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid var(--seam)", color: "var(--text2)", ...f(11, 700), letterSpacing: ".05em", cursor: "pointer" }}>ARCHIVE</button>
      </div>
    </div>
  );
}
