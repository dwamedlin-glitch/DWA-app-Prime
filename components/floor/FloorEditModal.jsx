import React from "react";

// Floor Edit Modal - edit floor posts in-place
// Props: floorEditingPost, floorEditText, setFloorEditText, floorEditRef, editFloorPost, setFloorEditingPost
const FloorEditModal = (props) => {
  // ── FLOOR EDIT MODAL (outside post list to prevent re-render flicker) ──
  const FloorEditModal = () => {
    if (!floorEditingPost) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={cancelFloorEdit}>
        <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, #1c1410, #2a1a12)", border: "1px solid rgba(201,146,42,0.25)", borderRadius: 16, padding: "24px 20px", maxWidth: 400, width: "100%" }}>
          <div style={{ ...f(20, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 12 }}>EDIT POST</div>
          <textarea
            ref={floorEditRef}
            defaultValue={floorEditText}
            key={floorEditingPost}
            style={{ ...inp(), minHeight: 80, resize: "vertical", lineHeight: 1.5, fontSize: 13, width: "100%", boxSizing: "border-box" }}
            autoFocus
          />
          <div style={{ ...row("center", 10), justifyContent: "flex-end", marginTop: 12 }}>
            <span onClick={cancelFloorEdit} style={{ ...f(13, 400, 'bebas'), color: "var(--text3)", cursor: "pointer", letterSpacing: ".08em" }}>CANCEL</span>
            <button onClick={() => handleFloorEditSave(floorEditingPost)} style={{ ...btnGold(), width: "auto", padding: "9px 24px", ...f(13, 400, 'bebas'), letterSpacing: ".1em" }}>SAVE</button>
          </div>
        </div>
      </div>
    );
  };
};

export default FloorEditModal;
