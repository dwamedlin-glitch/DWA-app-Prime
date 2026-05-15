import React from "react";

export default function Minutes({ ctx }) {
  const {
    card,
    f,
    row,
    minLang,
    setMinLang,
    minutes,
  } = ctx;

  return (
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
}
