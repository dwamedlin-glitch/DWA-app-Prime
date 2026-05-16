import React from "react";

export default function Zoom({ ctx }) {
  const {
    col,
    card,
    row,
    f,
    SectionIcon,
    zoomInfo,
    setToastMsg,
  } = ctx;

  return (
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
              {(item.label === "Meeting ID" || item.label === "Passcode") && (
                <button onClick={() => { navigator.clipboard.writeText(String(item.value).replace(/ /g, "")); setToastMsg && setToastMsg({ message: `${item.label} copied` }); }} style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.2)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", letterSpacing: ".08em" }}>COPY</button>
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
}
