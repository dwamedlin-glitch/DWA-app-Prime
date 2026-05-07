import React from "react";
import { useDWA } from "../DWAContext";
import { f, row, col } from "../styles/styleHelpers";

const PrivacyPage = () => {
  const { setSub } = useDWA();
  return (
    <div style={{ ...col(0), height: "100%", overflow: "hidden" }}>
      <div style={{ ...row("center", 10), padding: "16px 14px 10px", borderBottom: "1px solid var(--seam)" }}>
        <button onClick={() => setSub(null)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", ...f(22, 400, 'bebas'), letterSpacing: ".06em" }}>â BACK</button>
        <div style={{ ...f(20, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>PRIVACY POLICY</div>
      </div>
      <div className="scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.8, fontStyle: "italic" }}>
          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Effective Date:</strong> January 1, 2026</p>
          <p style={{ marginBottom: 16 }}>The Dairy Workers Association ("DWA", "we", "us") is committed to protecting the privacy of our members. This policy explains how we collect, use, and safeguard your information.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>1. Information We Collect</strong></p>
          <p style={{ marginBottom: 16 }}>We collect your name, email address, facility location, and shift information for the purpose of union communication and representation. Posts made on The Floor are visible to other members.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>2. How We Use Your Information</strong></p>
          <p style={{ marginBottom: 16 }}>Your information is used exclusively for union business: meeting notifications, grievance processing, seniority tracking, and member communication. We do not sell or share your personal data with third parties.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>3. Data Security</strong></p>
          <p style={{ marginBottom: 16 }}>We implement reasonable security measures to protect your personal information. However, no electronic transmission or storage method is 100% secure.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>4. Your Rights</strong></p>
          <p style={{ marginBottom: 16 }}>You have the right to access, correct, or request deletion of your personal data. Contact your steward or email privacy@dwa1953.org to exercise these rights.</p>
          <p style={{ marginBottom: 8 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>5. Grievance Records</strong></p>
          <p style={{ marginBottom: 16 }}>Grievance submissions are confidential and shared only with authorized union representatives and, when necessary, management representatives involved in the grievance process.</p>
          <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Contact:</strong> For privacy concerns, contact privacy@dwa1953.org.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
