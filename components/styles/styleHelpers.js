// DWA App Style Helpers
// Reusable inline style generator functions

export const f = (size, weight = 400, font = 'oswald') => ({
  fontFamily: font === 'bebas' ? "'Bebas Neue', sans-serif" : font === 'serif' ? "'Source Serif 4', serif" : "'Oswald', sans-serif",
  fontSize: size, fontWeight: weight, lineHeight: 1,
});

export const row = (align = "center", gap = 0) => ({ display: "flex", alignItems: align, gap });

export const col = (gap = 0) => ({ display: "flex", flexDirection: "column", gap });

export const card = (darkMode, extra = {}) => ({
  background: "var(--leather2)", borderRadius: 10,
  border: "1px solid var(--seam)",
  boxShadow: darkMode ? "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)" : "0 2px 8px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.6)",
  ...extra,
});

export const tileStyle = (darkMode) => darkMode ? {
  background: "linear-gradient(160deg, #1c1208 0%, #110d05 100%)",
  border: "1.5px solid rgba(61,46,18,0.9)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
} : {
  background: "linear-gradient(160deg, #fff 0%, #f8f4ed 100%)",
  border: "1.5px solid #d4c9a8",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
};

export const tileIconStyle = (darkMode) => darkMode ? {
  background: "rgba(201,146,42,0.08)", border: "1px solid rgba(201,146,42,0.15)",
} : {
  background: "rgba(139,94,16,0.08)", border: "1px solid rgba(139,94,16,0.18)",
};

export const inp = (err = false) => ({
  width: "100%", padding: "12px 14px",
  background: "var(--leather3)",
  border: `1.5px solid ${err ? "var(--red)" : "var(--seam)"}`,
  borderRadius: 8, color: "var(--text)", fontSize: 14,
  fontFamily: "'Oswald', sans-serif", fontWeight: 400, outline: "none",
});

export const lbl = { ...f(10, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".12em" };

export const btnGold = (dis = false) => ({
  width: "100%", padding: "15px",
  background: dis ? "var(--leather3)" : "linear-gradient(135deg, #a06b18 0%, #c9922a 35%, #e8b84b 65%, #c9922a 100%)",
  border: dis ? "1px solid var(--seam)" : "1px solid var(--gold)",
  borderRadius: 8, color: dis ? "var(--text3)" : "#1a0f00",
  fontSize: 15, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".1em",
  cursor: dis ? "default" : "pointer",
  boxShadow: dis ? "none" : "0 2px 12px rgba(201,146,42,0.3)",
});

export const btnOutline = {
  padding: "13px 24px", background: "transparent",
  border: "1.5px solid var(--seam)", borderRadius: 8,
  color: "var(--text2)", fontSize: 13, fontFamily: "'Oswald', sans-serif",
  fontWeight: 500, letterSpacing: ".08em", cursor: "pointer",
};

export const dropStyle = (err = false) => ({
  ...inp(err), appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a7355' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
});
