import React from "react";

export default function Announcements({ ctx }) {
  const {
    col,
    f,
    card,
    annLang,
    setAnnLang,
    announcements,
    setSub,
  } = ctx;

  return (
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
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>{displayBody.length > 120 ? `${displayBody.slice(0, 120)}…` : displayBody}</div>
            <div style={{ ...f(11, 700), color: "var(--gold)", marginTop: 12, letterSpacing: ".1em" }}>READ MORE →</div>
          </div>
        );
      })}
    </div>
  );
}
