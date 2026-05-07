import React, { useEffect } from "react";
import { useDWA } from "../DWAContext";
import { f, col, btnGold } from "../styles/styleHelpers";

// ââ CONFIRM MODAL ââ
const ConfirmModal2 = () => {
  const { confirmModal, setConfirmModal, card, btnOutline } = useDWA();
  if (!confirmModal) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} className="fade">
      <div style={{ ...card({ padding: "24px 20px" }), maxWidth: 320, width: "85%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ ...f(17, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".06em", marginBottom: 6 }}>{confirmModal.title}</div>
        <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic", marginBottom: 20 }}>{confirmModal.message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setConfirmModal(null)} style={{ ...btnOutline, flex: 1, padding: "12px 16px" }}>Cancel</button>
          <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }} style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "none", background: confirmModal.danger ? "var(--red)" : "linear-gradient(135deg,#a06b18,#c9922a)", color: confirmModal.danger ? "#fff" : "#1a0f00", ...f(14, 400, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>{confirmModal.danger ? "YES, DELETE" : "CONFIRM"}</button>
        </div>
      </div>
    </div>
  );
};

// ââ TOAST / UNDO ââ
const Toast2 = () => {
  const { toastMsg, setToastMsg } = useDWA();

  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  if (!toastMsg) return null;
  return (
    <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: "var(--leather2)", border: "1px solid var(--gold)", borderRadius: 10, padding: "10px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      <span style={{ ...f(13, 500), color: "var(--cream)" }}>{toastMsg.message}</span>
      {toastMsg.onUndo && (
        <button onClick={() => { toastMsg.onUndo(); setToastMsg(null); }} style={{ ...f(11, 700, 'bebas'), color: "var(--gold)", background: "rgba(201,146,42,0.15)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "4px 12px", cursor: "pointer", letterSpacing: ".08em" }}>UNDO</button>
      )}
    </div>
  );
};

// ââ WHAT'S NEW POPUP ââ
const WhatsNewPopup = () => {
  const { showWhatsNew, setShowWhatsNew, card } = useDWA();
  if (!showWhatsNew) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} className="fade">
      <div style={{ ...card({ padding: "28px 24px" }), maxWidth: 340, width: "88%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", textAlign: "center" }}>
        <div style={{ ...f(36, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".08em", marginBottom: 4 }}>WHAT'S NEW</div>
        <div className="gold-rule" style={{ marginBottom: 16 }} />
        <div style={{ ...col(10), textAlign: "left", marginBottom: 20 }}>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6 }}>
            <span style={{ color: "var(--gold)", fontWeight: 600, fontStyle: "normal" }}>Action Dashboard</span> â <span style={{ fontStyle: "italic" }}>officers see what needs attention in one place.</span>
          </div>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6 }}>
            <span style={{ color: "var(--gold)", fontWeight: 600, fontStyle: "normal" }}>Undo Support</span> â <span style={{ fontStyle: "italic" }}>deleted something by accident? Hit undo within 5 seconds.</span>
          </div>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6 }}>
            <span style={{ color: "var(--gold)", fontWeight: 600, fontStyle: "normal" }}>Settings</span> â <span style={{ fontStyle: "italic" }}>dark/light mode, EN/ES language, and notification controls.</span>
          </div>
        </div>
        <button onClick={() => setShowWhatsNew(false)} style={btnGold()}>GOT IT!</button>
      </div>
    </div>
  );
};

export { ConfirmModal2, Toast2, WhatsNewPopup };
