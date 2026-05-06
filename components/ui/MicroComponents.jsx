import React from "react";

// Micro UI Components - Tog (toggle), BackBar, StatusBadge, GoldDivider
// These are small reusable components used throughout the app
  // ── MICRO COMPONENTS ──
  const Tog = ({ on, flip }) => (
    <div onClick={flip} style={{ width: 44, height: 26, borderRadius: 13, background: on ? "linear-gradient(135deg,#a06b18,#c9922a)" : "var(--leather3)", border: `1px solid ${on ? "var(--gold)" : "var(--seam)"}`, position: "relative", cursor: "pointer", flexShrink: 0, transition: "all .2s" }}>
      <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: on ? "#1a0f00" : "var(--text3)", transition: "left .2s" }} />
    </div>
  );

  const BackBar = ({ title }) => (
    <div style={{ background: "var(--leather)", padding: "12px 16px", ...row("center", 0), justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
      <button onClick={() => setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>
        ← BACK
      </button>
      <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>{title}</span>
      <button onClick={() => { setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
        <SectionIcon icon="home" size={16} />
      </button>
    </div>
  );

  const StatusBadge = ({ s }) => {
    const map = { open: ["var(--gold)", "rgba(201,146,42,0.1)", "SUBMITTED"], review: ["var(--blue)", "rgba(37,99,168,0.15)", "IN REVIEW"], resolved: ["var(--green)", "rgba(45,122,79,0.15)", "RESOLVED"] };
    const [color, bg, txt] = map[s] || map.open;
    return <span style={{ ...f(10, 700), color, background: bg, padding: "3px 9px", borderRadius: 20, border: `1px solid ${color}44` }}>{txt}</span>;
  };


export { Tog, BackBar, StatusBadge, GoldDivider };
