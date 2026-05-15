import React from "react";

export default function Documents({ ctx }) {
  const {
    card,
    col,
    row,
    f,
    inp,
    SectionIcon,
    documents,
    filteredDocs,
    docSearch,
    setDocSearch,
    docCat,
    setDocCat,
    allDocCategories,
    docFileIcon,
    setSub,
  } = ctx;

  return (
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
}
