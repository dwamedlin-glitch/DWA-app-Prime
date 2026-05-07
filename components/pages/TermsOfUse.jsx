import React from "react";
import { useDWA } from "../DWAContext";
import { f, row, col } from "../styles/styleHelpers";

const TermsPage = () => {
  const { setSub } = useDWA();
  return (
    <div style={{ ...col(0), height: "100%", overflow: "hidden" }}>
      <div style={{ ...row("center", 10), padding: "16px 14px 10px", borderBottom: "1px solid var(--seam)" }}>
        <button onClick={() => setSub(null)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", ...f(22, 400, 'bebas'), letterSpacing: ".06em" }}>â BACK</button>
        <div style={{ ...f(20, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>TERMS OF USE</div>
      </div>
      <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.8, fontStyle: "italic" }}>
          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Effective Date:</strong> January 1, 2026</p>
          <p style={{ marginBottom: 16 }}>Welcome to the Dairy Workers Association (DWA) mobile application. By accessing or using this app, you agree to the following terms and conditions.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>1. Use of the App</strong></p>
          <p style={{ marginBottom: 16 }}>This app is provided exclusively for DWA members, stewards, and authorized officers. Unauthorized access is prohibited. You agree to use this app only for lawful purposes related to union activities.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>2. Account Responsibility</strong></p>
          <p style={{ marginBottom: 16 }}>You are responsible for maintaining the confidentiality of your login credentials. Notify your steward immediately if you suspect unauthorized use of your account.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>3. Content & Conduct</strong></p>
          <p style={{ marginBottom: 16 }}>All posts, messages, and content shared through The Floor and other features must comply with DWA's code of conduct. Harassment, discrimination, or threats will result in suspension or ban.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>4. Intellectual Property</strong></p>
          <p style={{ marginBottom: 16 }}>All materials in this app, including contract documents, bylaws, and educational content, are the property of the Dairy Workers Association and may not be reproduced without authorization.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>5. Modifications</strong></p>
          <p style={{ marginBottom: 16 }}>DWA reserves the right to modify these terms at any time. Continued use of the app constitutes acceptance of any changes.</p>
          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Contact:</strong> For questions about these terms, contact your shop steward or email info@dwa1953.org.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
