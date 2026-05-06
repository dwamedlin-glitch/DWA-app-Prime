import React from "react";

// Content Screens - Announcements, Documents, Zoom, Minutes, Seniority, Admin
const ContentScreens = (props) => {
    // returns color + label based on doc type hint
    if (d.fileType === "pdf" || d.name.toLowerCase().includes("form") || d.name.toLowerCase().includes("flyer")) return { color: "#e05c3a", bg: "rgba(224,92,58,0.12)", border: "rgba(224,92,58,0.25)", label: "PDF" };
    if (d.id === 1 || d.name.toLowerCase().includes("contract")) return { color: "var(--gold)", bg: "rgba(201,146,42,0.12)", border: "rgba(201,146,42,0.25)", label: "CBA" };
    if (d.id === 2 || d.name.toLowerCase().includes("bylaw")) return { color: "var(--gold2)", bg: "rgba(232,184,75,0.1)", border: "rgba(232,184,75,0.22)", label: "DOC" };
    if (d.fileType === "docx") return { color: "#4a9eff", bg: "rgba(74,158,255,0.1)", border: "rgba(74,158,255,0.22)", label: "DOC" };
    return { color: "var(--text3)", bg: "var(--leather3)", border: "var(--seam)", label: "FILE" };
  };

  const allDocCategories = ["All", ...Array.from(new Set(documents.map(d => d.category)))];

  const Documents = () => (
    <div className="rise">
      {/* Header bar */}
      <div style={{ padding: "16px 14px 0", background: "linear-gradient(180deg, rgba(201,146,42,0.05) 0%, transparent 100%)" }}>
        <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ ...f(22, 400, "bebas"), color: "var(--cream)", letterSpacing: ".06em" }}>DOCUMENTS</div>
          <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{filteredDocs.length} file{filteredDocs.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }}>
            <SectionIcon icon="search" size={15} />
          </div>
          <input
            style={{ ...inp(), paddingLeft: 40, paddingRight: docSearch ? 36 : 14, fontSize: 13 }}
            placeholder="Search by name or category…"
            value={docSearch}
            onChange={e => setDocSearch(e.target.value)}
          />
          {docSearch && (
            <button onClick={() => setDocSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
          )}
        </div>

        {/* Category pills */}
        <div className="hscroll" style={{ display: "flex", gap: 6, paddingBottom: 12, overflowX: "auto" }}>
          {allDocCategories.map(cat => {
            const active = docCat === cat;
            const count = cat === "All" ? documents.length : documents.filter(d => d.category === cat).length;
            return (
              <div key={cat} onClick={() => setDocCat(cat)} style={{
                padding: "6px 13px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer",
                background: active ? "linear-gradient(135deg,#a06b18,#c9922a,#e8b84b)" : "var(--leather2)",
                border: `1px solid ${active ? "var(--gold)" : "var(--seam)"}`,
                color: active ? "#1a0f00" : "var(--text2)",
                ...f(11, 600), letterSpacing: ".06em",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {cat}
                <span style={{ background: active ? "rgba(0,0,0,0.18)" : "var(--leather3)", borderRadius: 10, padding: "1px 6px", ...f(10, 700), color: active ? "#1a0f00" : "var(--text3)" }}>{count}</span>
              </div>
            );
          })}
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,var(--seam),transparent)", marginBottom: 12 }} />
      </div>

      {/* Document list */}
      <div style={{ padding: "0 14px 24px", ...col(8) }}>
        {filteredDocs.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", ...col(10), alignItems: "center" }}>
            <div style={{ color: "var(--text3)", marginBottom: 8 }}><SectionIcon icon="folder" size={32} /></div>
            <div style={{ ...f(14, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>No documents found.</div>
          </div>
        )}
        {filteredDocs.map(d => {
          const fi = docFileIcon(d);
          const isReadable = d.id === 1 || d.id === 2;
          const hasFile = !!d.fileUrl;
          const hasForm = !!d.formHtml;
          return (
            <div key={d.id} style={{ ...card({ padding: "0", overflow: "hidden" }) }}>
              {/* Top row */}
              <div
                className={(isReadable || hasForm || hasFile) ? "tile" : ""}
                onClick={() => {
                  if (d.id === 1) setSub({ type: "cba" });
                  else if (d.id === 2) setSub({ type: "bylaws" });
                  else if (hasForm) setSub({ type: "form-preview", data: d });
                  else if (hasFile) setSub({ type: "doc-preview", data: d });
                }}
                style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 13, cursor: (isReadable || hasForm || hasFile) ? "pointer" : "default" }}
              >
                {/* File type badge */}
                <div style={{
                  width: 48, height: 52, borderRadius: 8, flexShrink: 0,
                  background: fi.bg, border: `1px solid ${fi.border}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                }}>
                  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1H3C1.9 1 1 1.9 1 3V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V7L11 1Z" stroke={fi.color} strokeWidth="1.5" fill="none"/>
                    <path d="M11 1V7H17" stroke={fi.color} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="13" y2="12" stroke={fi.color} strokeWidth="1.2" strokeLinecap="round"/>
                    <line x1="5" y1="15" x2="10" y2="15" stroke={fi.color} strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ ...f(9, 800), color: fi.color, letterSpacing: ".06em" }}>{fi.label}</span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...f(14, 600), color: (isReadable || hasForm) ? "var(--cream)" : "var(--text)", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                  {d.desc && <div style={{ ...f(11, 400, "serif"), color: "var(--gold2)", marginTop: 2, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.desc}</div>}
                  <div style={{ ...row("center", 6), marginTop: 5, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ ...f(10, 500), color: "var(--text3)", background: "var(--leather3)", border: "1px solid var(--seam)", borderRadius: 4, padding: "1px 7px", letterSpacing: ".06em" }}>{d.category}</span>
                    {d.size && d.size !== "—" && <span style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{d.size}</span>}
                    <span style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Updated {d.updated}</span>
                  </div>
                </div>
              </div>

              {/* Action strip */}
              <div style={{ borderTop: "1px solid var(--seam)", display: "flex" }}>
                {(isReadable || hasForm) && (
                  <button
                    onClick={() => {
                      if (d.id === 1) setSub({ type: "cba" });
                      else if (d.id === 2) setSub({ type: "bylaws" });
                      else if (hasForm) setSub({ type: "form-preview", data: d });
                    }}
                    style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", borderRight: "1px solid var(--seam)", cursor: "pointer", ...row("center", 6), justifyContent: "center", color: "var(--gold)", ...f(11, 700), letterSpacing: ".1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {hasForm ? "VIEW FORM" : "READ"}
                  </button>
                )}
                {hasFile ? (
                  <a
                    href={d.fileUrl} download={d.name}
                    style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", textDecoration: "none", cursor: "pointer", ...row("center", 6), justifyContent: "center", color: "var(--text2)", ...f(11, 700), letterSpacing: ".1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    DOWNLOAD
                  </a>
                ) : d.formHtml ? (
                  <button
                    onClick={() => {
                      const blob = new Blob([d.formHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = `${d.name.replace(/[^a-z0-9]/gi,'_')}.html`; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", cursor: "pointer", ...row("center", 6), justifyContent: "center", color: "var(--gold)", ...f(11, 700), letterSpacing: ".1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    DOWNLOAD & PRINT
                  </button>
                ) : (
                  <div style={{ flex: 1, padding: "10px 8px", ...row("center", 6), justifyContent: "center", color: "var(--text3)", ...f(11, 500), letterSpacing: ".08em", fontStyle: "italic", fontFamily: "'Source Serif 4', serif" }}>
                    {isReadable ? "In-app only" : "No file attached"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Announcements = () => (
    <div className="rise" style={{ padding: "14px", ...col(10) }}>
      {/* Language toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)" }}>
          {["en", "es"].map(l => (
            <div key={l} onClick={() => setAnnLang(l)} style={{ padding: "5px 14px", borderRadius: 6, background: annLang === l ? "var(--gold)" : "transparent", color: annLang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase", letterSpacing: ".1em" }}>{l === "en" ? "English" : "Español"}</div>
          ))}
        </div>
      </div>
      {announcements.map(a => {
        const displayTitle = annLang === "es" && a.titleEs ? a.titleEs : a.title;
        const displayBody = annLang === "es" && a.bodyEs ? a.bodyEs : a.body;
        return (
          <div key={a.id} onClick={() => setSub({ type: "ann", data: a })} className="tile" style={{ ...card({ padding: "16px" }) }}>
            {a.urgent && <div className="urgent-pulse" style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 8, letterSpacing: ".15em" }}>⚡ URGENT</div>}
            <div style={{ ...f(16, 600), color: "var(--text)", lineHeight: 1.25 }}>{displayTitle}</div>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>{displayBody.slice(0, 120)}…</div>
            <div style={{ ...f(11, 700), color: "var(--gold)", marginTop: 12, letterSpacing: ".1em" }}>READ MORE →</div>
          </div>
        );
      })}
    </div>
  );

  const Minutes = () => (
    <div className="rise" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...card({ padding: "13px 16px", borderLeft: "3px solid var(--gold)" }), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ ...f(13, 400, "serif"), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic", flex: 1 }}>
          Official meeting minutes and summaries posted by union leadership.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)", flexShrink: 0, marginLeft: 10 }}>
          {["en", "es"].map(l => (
            <div key={l} onClick={() => setMinLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: minLang === l ? "var(--gold)" : "transparent", color: minLang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
          ))}
        </div>
      </div>
      {minutes.length === 0 && <div style={{ padding: "40px 0", textAlign: "center", ...f(13, 400, "serif"), color: "var(--text3)" }}>No meeting minutes posted yet.</div>}
      {minutes.map(m => {
        const displayTitle = minLang === "es" && m.titleEs ? m.titleEs : m.title;
        const displaySummary = minLang === "es" && m.summaryEs ? m.summaryEs : m.summary;
        return (
          <div key={m.id} style={card({ padding: "16px" })}>
            <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ ...f(15, 600), color: "var(--cream)", lineHeight: 1.25, flex: 1, paddingRight: 8 }}>{displayTitle}</div>
            </div>
            <div style={{ ...f(11, 400, "serif"), color: "var(--gold)", fontStyle: "italic", marginBottom: 8 }}>{m.date}</div>
            <div className="gold-rule" style={{ margin: "0 0 10px" }} />
            <div style={{ ...f(13, 400, "serif"), color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{displaySummary}</div>
            {minLang === "es" && !m.summaryEs && (
              <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 8 }}>Translation not available for this entry.</div>
            )}
          </div>
        );
      })}
    </div>
  );

  const Seniority = () => {
    const filtered = seniority
      .filter(s => seniorityFilter === "All" || s.location === seniorityFilter)
      .sort((a, b) => a.hireDate.localeCompare(b.hireDate));
    const fmtDate = d => {
      const [y, m, day] = d.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(m, 10) - 1]} ${parseInt(day, 10)}, ${y}`;
    };
    return (
      <div className="rise" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...card({ padding: "13px 16px", borderLeft: "3px solid var(--gold)" }) }}>
          <div style={{ ...f(13, 400, "serif"), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>
            Union seniority list, ranked by date of hire. Maintained by union officials.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {["All", "Jersey City", "Florence"].map(loc => {
            const active = seniorityFilter === loc;
            const count = loc === "All" ? seniority.length : seniority.filter(s => s.location === loc).length;
            return (
              <button key={loc} onClick={() => setSeniorityFilter(loc)} style={{ padding: "8px 14px", borderRadius: 20, whiteSpace: "nowrap", background: active ? "linear-gradient(135deg,#a06b18,#c9922a,#e8b84b)" : "var(--leather2)", border: active ? "1px solid var(--gold)" : "1px solid var(--seam)", color: active ? "#1a0f00" : "var(--text2)", ...f(12, 600), letterSpacing: ".06em", cursor: "pointer" }}>{loc} ({count})</button>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", ...f(13, 400, "serif"), color: "var(--text3)" }}>No members on the list for this location.</div>
        ) : (
          <div style={{ ...card({ padding: "4px 0" }) }}>
            {filtered.map((s, idx) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: idx < filtered.length - 1 ? "1px solid var(--seam)" : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--gold-dim)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", ...f(12, 700, 'bebas'), color: "var(--gold)", flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...f(14, 600), color: "var(--cream)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{s.location} · Hired {fmtDate(s.hireDate)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Zoom = () => (
    <div className="rise" style={{ padding: "20px 14px", ...col(0) }}>
      <div style={{ ...card({ padding: "20px", marginBottom: 16, borderLeft: "3px solid #2D8CFF" }) }}>
        <div style={{ ...row("center", 12), marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#1a3a6a", border: "1px solid #2D8CFF44", display: "flex", alignItems: "center", justifyContent: "center", color: "#2D8CFF" }}>
            <SectionIcon icon="video" size={22} />
          </div>
          <div>
            <div style={{ ...f(20, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>ZOOM MEETING ROOM</div>
            <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>DWA Union Meetings</div>
          </div>
        </div>
        <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.65, fontStyle: "italic" }}>
          Join the official DWA Zoom meeting room for union meetings, steward sessions, and member calls.
        </div>
      </div>
      <a href={zoomInfo.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 14 }}>
        <div style={{ background: "#2563a8", borderRadius: 10, padding: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff" }}>
          <SectionIcon icon="video" size={20} />
          <span style={{ ...f(20, 400, 'bebas'), color: "#fff", letterSpacing: ".1em" }}>CLICK TO JOIN ZOOM</span>
        </div>
      </a>
      <div style={{ ...card({ padding: "20px" }), ...col(0) }}>
        <div style={{ ...f(10, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 14 }}>Meeting Details</div>
        {[
          { label: "Meeting ID", value: zoomInfo.meetingId },
          { label: "Passcode", value: zoomInfo.passcode },
          { label: "Platform", value: "Zoom", color: "#2D8CFF" },
        ].map(item => (
          <div key={item.label} style={{ ...row("center", 0), justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{item.label}</div>
            <div style={{ ...row("center", 8) }}>
              <div style={{ ...f(15, 700), color: item.color || "var(--text)", letterSpacing: ".06em" }}>{item.value}</div>
              {item.label === "Meeting ID" && (
                <button onClick={() => { navigator.clipboard.writeText(zoomInfo.meetingId.replace(/ /g, "")); alert("Meeting ID copied!"); }} style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.2)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", letterSpacing: ".08em" }}>COPY</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card({ padding: "14px 16px", marginTop: 12, borderLeft: "3px solid var(--seam)" }), display: "flex", gap: 10 }}>
        <div style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}><SectionIcon icon="info" size={16} /></div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", lineHeight: 1.6, fontStyle: "italic" }}>
          If the link doesn't open Zoom automatically, open the Zoom app and enter the Meeting ID and Passcode manually.
        </div>
      </div>
    </div>
  );

  const Admin = () => {
    const needsAttention = [];
    if (pendingMembers.length > 0) needsAttention.push({ icon: "users", title: `${pendingMembers.length} member request${pendingMembers.length > 1 ? "s" : ""} waiting`, sub: "Tap to approve or deny", action: () => setAdminSection("members"), color: "#c0392b", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.2)" });
};

export default ContentScreens;
