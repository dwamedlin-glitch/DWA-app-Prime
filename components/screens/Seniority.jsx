import React from "react";

export default function Seniority({ ctx }) {
  const {
    seniority,
    seniorityFilter,
    setSeniorityFilter,
    card,
    f,
  } = ctx;

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
}
