import React from "react";

// Sub Screens - rendered when sub state is set
// Includes terms, privacy, form preview, doc preview, bylaws, CBA, contact, grievance, admin sub-screens
const SubScreens = (props) => {
  // ── SUB SCREENS ──
  if (sub) {
    if (sub.type === "terms") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <TermsPage />
          </div>
        </>
      );
    }
    if (sub.type === "privacy") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <PrivacyPage />
          </div>
        </>
      );
    }
    if (sub.type === "form-preview") {
      const d = sub.data;
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>← BACK</button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>{d.name}</span>
              <button onClick={() => { setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {/* iframe preview */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#e5e5e5" }}>
              <iframe
                srcDoc={d.formHtml}
                style={{ width: "680px", height: "900px", border: "none", background: "#fff", transform: "scale(var(--form-scale, 0.55))", transformOrigin: "top center", position: "absolute", left: "50%", top: 0, marginLeft: "-340px" }}
                title={d.name}
                ref={el => {
                  if (el && el.parentElement) {
                    const scale = el.parentElement.clientWidth / 680;
                    el.style.transform = `scale(${scale})`;
                    el.style.height = (el.parentElement.clientHeight / scale) + "px";
                  }
                }}
              />
            </div>
            {/* Download bar */}
            <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(13, 600), color: "var(--text)" }}>{d.name}</div>
                <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>Download to print or fill out</div>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([d.formHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `${d.name.replace(/[^a-z0-9]/gi,'_')}.html`; a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{ padding: "10px 18px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                DOWNLOAD & PRINT
              </button>
            </div>
          </div>
        </>
      );
    }

    if (sub.type === "doc-preview") {
      const d = sub.data;
      const isPdf = (d.fileType || "").toLowerCase() === "pdf";
      const isImage = ["png","jpg","jpeg","gif","webp"].includes((d.fileType || "").toLowerCase());
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>← BACK</button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
              <button onClick={() => { setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {/* Preview area */}
            <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: darkMode ? "#1a1610" : "#e8e4dc", padding: 16 }}>
              {isImage ? (
                <img src={d.fileUrl} alt={d.name} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }} />
              ) : isPdf ? (
                <iframe src={d.fileUrl} style={{ width: "100%", height: "100%", border: "none", borderRadius: 8, background: "#fff" }} title={d.name} />
              ) : (
                <div style={{ textAlign: "center", ...col(12), alignItems: "center", padding: "40px 20px" }}>
                  <div style={{ width: 80, height: 90, borderRadius: 12, background: "var(--leather2)", border: "1px solid var(--seam)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16 }}>
                    <SectionIcon icon="file" size={28} />
                    <span style={{ ...f(11, 800), color: "var(--text3)", letterSpacing: ".06em" }}>{(d.fileType || "FILE").toUpperCase()}</span>
                  </div>
                  <div style={{ ...f(16, 600), color: "var(--cream)", marginBottom: 4 }}>{d.name}</div>
                  <div style={{ ...f(12, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>{d.category} · {d.size}</div>
                  <div style={{ ...f(12, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Preview not available for this file type.</div>
                  <div style={{ ...f(12, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Download to view.</div>
                </div>
              )}
            </div>
            {/* Download bar */}
            <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(13, 600), color: "var(--text)" }}>{d.name}</div>
                <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{d.category} · {d.size} · Updated {d.updated}</div>
              </div>
              <a
                href={d.fileUrl} download={d.name}
                style={{ padding: "10px 18px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, textDecoration: "none" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                DOWNLOAD
              </a>
            </div>
          </div>
        </>
      );
    }

    if (sub.type === "bylaws") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => activeBylawArticle ? setActiveBylawArticle(null) : setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>
                {activeBylawArticle ? "← ARTICLES" : "← BACK"}
              </button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>
                {activeBylawArticle ? `Article ${activeBylawArticle.id}` : "Union Bylaws"}
              </span>
              <button onClick={() => { setActiveBylawArticle(null); setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {!activeBylawArticle ? (
              <div className="scroll rise" style={{ flex: 1 }}>
                <div style={{ padding: "20px 16px 8px", background: "linear-gradient(180deg, rgba(201,146,42,0.06) 0%, transparent 100%)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(28, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".06em" }}>UNION BYLAWS</div>
                      <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>Dairy Workers Association Constitution & By-Laws</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>11 Articles</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)" }}>
                      {["en", "es"].map(l => (
                        <div key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: lang === l ? "var(--gold)" : "transparent", color: lang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginBottom: 12 }} />
                  {/* Full document download card */}
                  <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 48, borderRadius: 8, background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, flexShrink: 0 }}>
                      <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M11 1H3C1.9 1 1 1.9 1 3V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V7L11 1Z" stroke="var(--gold)" strokeWidth="1.5" fill="none"/><path d="M11 1V7H17" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="13" y2="12" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/><line x1="5" y1="15" x2="10" y2="15" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span style={{ ...f(8, 800), color: "var(--gold)", letterSpacing: ".06em" }}>DOC</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(14, 600), color: "var(--cream)" }}>{lang === "es" ? "Documento Completo de Estatutos" : "Full Bylaws Document"}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{lang === "es" ? "11 artículos · Descargar como HTML" : "All 11 articles · Download as HTML file"}</div>
                    </div>
                    <button
                      onClick={() => downloadDoc("DWA Union Bylaws", "Dairy Workers Association Constitution & By-Laws", lang === "en" ? BYLAWS_ARTICLES : BYLAWS_ARTICLES_ES)}
                      style={{ flexShrink: 0, padding: "9px 14px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(11, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      DOWNLOAD
                    </button>
                  </div>
                </div>
                <div style={{ padding: "0 14px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {(lang === "en" ? BYLAWS_ARTICLES : BYLAWS_ARTICLES_ES).map((art) => (
                    <div key={art.id} onClick={() => setActiveBylawArticle(art)} className="tile"
                      style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", ...f(14, 700, 'bebas'), color: "var(--gold)", flexShrink: 0 }}>{art.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...f(14, 600), color: "var(--text)" }}>{art.title}</div>
                        <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>Article {art.id}</div>
                      </div>
                      <div style={{ ...f(12, 700), color: "var(--gold)" }}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (() => {
              const articles = lang === "en" ? BYLAWS_ARTICLES : BYLAWS_ARTICLES_ES;
              const idx = articles.findIndex(a => a.id === activeBylawArticle.id);
              const prev = idx > 0 ? articles[idx - 1] : null;
              const next = idx < articles.length - 1 ? articles[idx + 1] : null;
              return (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid var(--seam)", flexShrink: 0 }}>
                    <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase" }}>Article {activeBylawArticle.id} of {articles.length}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{idx + 1} / {articles.length}</div>
                    </div>
                    <div style={{ ...f(26, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".04em" }}>{activeBylawArticle.title}</div>
                    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginTop: 12 }} />
                  </div>
                  <div className="scroll" style={{ flex: 1, padding: "14px 16px 24px" }}>
                    <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "18px" }}>
                      {activeBylawArticle.body.split('\n').filter(Boolean).map((line, i) => (
                        <p key={i} style={{ ...f(14, 400, 'serif'), color: "var(--text2)", lineHeight: 1.75, marginBottom: line.trim() === "" ? 0 : 10 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", display: "flex" }}>
                    <button onClick={() => { if (prev) setActiveBylawArticle(prev); }} disabled={!prev}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", borderRight: "1px solid var(--seam)", cursor: prev ? "pointer" : "default", opacity: prev ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--gold)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Previous</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prev?.title || ""}</div>
                      </div>
                    </button>
                    <button onClick={() => { if (next) setActiveBylawArticle(next); }} disabled={!next}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", cursor: next ? "pointer" : "default", opacity: next ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, color: "var(--gold)" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Next</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next?.title || ""}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      );
    }

    if (sub.type === "cba") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => activeArticle ? setActiveArticle(null) : setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>
                {activeArticle ? "← ARTICLES" : "← BACK"}
              </button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>
                {activeArticle ? `Article ${activeArticle.id}` : "Union Contract"}
              </span>
              <button onClick={() => { setActiveArticle(null); setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {!activeArticle ? (
              <div className="scroll rise" style={{ flex: 1 }}>
                <div style={{ padding: "20px 16px 8px", background: "linear-gradient(180deg, rgba(201,146,42,0.06) 0%, transparent 100%)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(28, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".06em" }}>UNION CONTRACT</div>
                      <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>Collective Bargaining Agreement 2025–2028</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>17 Articles</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)" }}>
                      {["en", "es"].map(l => (
                        <div key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: lang === l ? "var(--gold)" : "transparent", color: lang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginBottom: 12 }} />
                  {/* Full document download card */}
                  <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 48, borderRadius: 8, background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, flexShrink: 0 }}>
                      <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M11 1H3C1.9 1 1 1.9 1 3V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V7L11 1Z" stroke="var(--gold)" strokeWidth="1.5" fill="none"/><path d="M11 1V7H17" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="13" y2="12" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/><line x1="5" y1="15" x2="10" y2="15" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span style={{ ...f(8, 800), color: "var(--gold)", letterSpacing: ".06em" }}>CBA</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(14, 600), color: "var(--cream)" }}>{lang === "es" ? "Documento Completo del Contrato" : "Full Contract Document"}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{lang === "es" ? "17 artículos · Descargar como HTML" : "All 17 articles · Download as HTML file"}</div>
                    </div>
                    <button
                      onClick={() => downloadDoc("DWA Union Contract 2025-2028", "Collective Bargaining Agreement — Cream-O-Land Dairy & Dairy Workers Association", lang === "en" ? cbaArticlesData : cbaArticlesData_ES)}
                      style={{ flexShrink: 0, padding: "9px 14px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(11, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      DOWNLOAD
                    </button>
                  </div>
                </div>
                <div style={{ padding: "0 14px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {cbaArticlesData.map((art) => (
                    <div key={art.id} onClick={() => setActiveArticle(art)} className="tile"
                      style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", ...f(14, 700, 'bebas'), color: "var(--gold)", flexShrink: 0 }}>{art.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...f(14, 600), color: "var(--text)" }}>{art.title}</div>
                        <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>Article {art.id}</div>
                      </div>
                      <div style={{ ...f(12, 700), color: "var(--gold)" }}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (() => {
              const idx = cbaArticlesData.findIndex(a => a.id === activeArticle.id);
              const prev = idx > 0 ? cbaArticlesData[idx - 1] : null;
              const next = idx < cbaArticlesData.length - 1 ? cbaArticlesData[idx + 1] : null;
              return (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid var(--seam)", flexShrink: 0 }}>
                    <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase" }}>Article {activeArticle.id} of {cbaArticlesData.length}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{idx + 1} / {cbaArticlesData.length}</div>
                    </div>
                    <div style={{ ...f(26, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".04em" }}>{activeArticle.title}</div>
                    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginTop: 12 }} />
                  </div>
                  <div className="scroll" style={{ flex: 1, padding: "14px 16px 24px" }}>
                    <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "18px" }}>
                      {activeArticle.body.split('\n').filter(l => l.trim()).map((line, i) => (
                        <p key={i} style={{ ...f(14, 400, 'serif'), color: "var(--text2)", lineHeight: 1.75, marginBottom: 10 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", display: "flex" }}>
                    <button onClick={() => { if (prev) setActiveArticle(prev); }} disabled={!prev}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", borderRight: "1px solid var(--seam)", cursor: prev ? "pointer" : "default", opacity: prev ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--gold)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Previous</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prev?.title || ""}</div>
                      </div>
                    </button>
                    <button onClick={() => { if (next) setActiveArticle(next); }} disabled={!next}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", cursor: next ? "pointer" : "default", opacity: next ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, color: "var(--gold)" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Next</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next?.title || ""}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      );
    }

    if (sub.type === "contact") return (
      <><style>{css}</style>
        <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
          <BackBar title="DWA Contacts" />
          <div className="scroll rise" style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ ...card({ padding: "13px 16px", borderLeft: "3px solid var(--gold)" }) }}>
              <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>
                Tap <strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Call</strong> or <strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Text</strong> to reach your steward directly.
              </div>
            </div>
            {stewardsData.map((s, idx) => (
              <div key={s.id || idx} style={card({ padding: "16px" })}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: s.phone ? 14 : 0 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#a06b18,#c9922a)", display: "flex", alignItems: "center", justifyContent: "center", ...f(16, 700, 'bebas'), color: "#1a0f00", flexShrink: 0 }}>
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...f(15, 600), color: "var(--text)" }}>{s.name}</div>
                    <div style={{ ...f(11, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 2 }}>{s.title}{s.dept ? ` · ${s.dept}` : ""}</div>
                  </div>
                </div>
                {s.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <a href={`tel:${s.phone}`} style={{ flex: 1, padding: "11px", borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", color: "var(--text2)", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...f(12, 700), letterSpacing: ".08em" }}>
                      <SectionIcon icon="phone" size={14} /> CALL
                    </a>
                    <a href={`sms:${s.phone}`} style={{ flex: 1, padding: "11px", borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", color: "var(--text2)", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...f(12, 700), letterSpacing: ".08em" }}>
                      <SectionIcon icon="message" size={14} /> TEXT
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );

    if (sub.type === "ann") {
      const a = sub.data;
      const displayTitle = annLang === "es" && a.titleEs ? a.titleEs : a.title;
      const displayBody = annLang === "es" && a.bodyEs ? a.bodyEs : a.body;
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
            <BackBar title="Announcement" />
            <div className="scroll rise" style={{ padding: "24px 16px" }}>
              {a.urgent && <div className="urgent-pulse" style={{ ...f(10, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.3)", padding: "4px 10px", borderRadius: 6, display: "inline-block", marginBottom: 12, letterSpacing: ".15em" }}>⚡ URGENT</div>}
              <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ ...f(24, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".05em", lineHeight: 1.2 }}>{displayTitle}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)", flexShrink: 0 }}>
                  {["en", "es"].map(l => (
                    <div key={l} onClick={() => setAnnLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: annLang === l ? "var(--gold)" : "transparent", color: annLang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                  ))}
                </div>
              </div>
              <div className="gold-rule" />
              <div style={{ ...f(15, 400, 'serif'), color: "var(--text2)", lineHeight: 1.75, marginTop: 20, whiteSpace: "pre-wrap" }}>{displayBody}</div>
              {annLang === "es" && !a.bodyEs && (
                <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 12 }}>Translation not available for this announcement.</div>
              )}
            </div>
          </div>
        </>
      );
    }

    if (sub.type === "my-grievances") return (
      <><style>{css}</style>
        <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
          <BackBar title="My Grievances" />
          <div className="scroll rise" style={{ padding: "16px", ...col(10) }}>
            {myGrievances.map(g => (
              <div key={g.id} style={{ ...card({ padding: "16px" }) }}>
                <div style={{ ...row("flex-start", 0), justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ ...f(14, 600), color: "var(--text)", flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{g.type}</div>
                  <StatusBadge s={g.status} />
                </div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Filed {g.date}</div>
              </div>
            ))}
            {myGrievances.length === 0 && <div style={{ padding: "40px 0", textAlign: "center", ...f(13, 400, 'serif'), color: "var(--text3)" }}>No grievances filed yet.</div>}
          </div>
        </div>
      </>
    );

    if (sub.type === "settings") return (
      <><style>{css}</style>
        <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
          <BackBar title="Notifications" />
          <div className="scroll rise" style={{ padding: "16px", ...col(12) }}>
            <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Notification Preferences</div>
            {[
              { key: "meetings", label: "Meeting Reminders", desc: "Upcoming union meetings and events" },
              { key: "announcements", label: "Announcements", desc: "News and important updates from leadership" },
              { key: "grievances", label: "Grievance Updates", desc: "Status changes on your grievances" },
            ].map(item => (
              <div key={item.key} style={{ ...card({ padding: "16px" }), ...row("center", 0), justifyContent: "space-between" }}>
                <div>
                  <div style={{ ...f(14, 600), color: "var(--text)" }}>{item.label}</div>
                  <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", marginTop: 3, fontStyle: "italic" }}>{item.desc}</div>
                </div>
                <Tog on={notifs[item.key]} flip={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default SubScreens;
