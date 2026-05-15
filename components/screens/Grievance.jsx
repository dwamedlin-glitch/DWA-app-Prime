import React from "react";

export default function Grievance({ ctx }) {
  const {
    card,
    col,
    f,
    inp,
    btnGold,
    btnOutline,
    lbl,
    SectionIcon,
    grievanceSubmitted,
    grievanceError,
    incidentDate,
    setIncidentDate,
    supervisorName,
    setSupervisorName,
    incidentTime,
    setIncidentTime,
    description,
    setDescription,
    remedy,
    setRemedy,
    witnesses,
    setWitnesses,
    contractArticle,
    setContractArticle,
    shakeKey,
    handleGrievance,
    resetGrievance,
  } = ctx;

  if (grievanceSubmitted) return (
    <div className="rise" style={{ flex: 1, ...col(0), alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", marginBottom: 20 }}>
        <SectionIcon icon="check" size={32} />
      </div>
      <div style={{ ...f(32, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em", marginBottom: 12 }}>Submitted!</div>
      <div style={{ ...f(14, 400, 'serif'), color: "var(--text2)", lineHeight: 1.7, fontStyle: "italic", textAlign: "center", marginBottom: 24 }}>
        Your grievance has been recorded and forwarded to the Union. A steward will be in touch within 5 business days.
      </div>
      <div className="gold-rule" style={{ width: "100%", marginBottom: 16 }} />
      <button style={{ ...btnOutline }} onClick={resetGrievance}>Submit Another</button>
    </div>
  );

  return (
    <div className="rise" style={{ padding: "16px 14px 30px", ...col(0) }}>
      <div style={{ ...card({ padding: "18px", marginBottom: 20 }), textAlign: "center" }}>
        <div style={{ ...f(22, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>GRIEVANCE FORM</div>
        <div style={{ ...f(14, 600), color: "var(--gold)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 4 }}>Dairy Workers Association</div>
        <div className="gold-rule" style={{ marginTop: 12, marginBottom: 0 }} />
      </div>
      {grievanceError && <div style={{ background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 8, padding: "12px 16px", ...f(12, 400, 'serif'), color: "var(--red)", marginBottom: 16, fontStyle: "italic" }}>Please fill in all required fields marked with *</div>}
      <div style={{ ...card({ padding: "18px" }), ...col(18), marginBottom: 20 }}>
        <div style={col(6)}>
          <label style={lbl}>Today's Date *</label>
          <input type="date" style={{ ...inp(grievanceError && !incidentDate), width: "100%" }} value={incidentDate} onChange={e => setIncidentDate(e.target.value)} />
        </div>
        <div style={col(6)}>
          <label style={lbl}>Name of Union Employee *</label>
          <input style={{ ...inp(grievanceError && !supervisorName), width: "100%" }} placeholder="Employee's full name" value={supervisorName} onChange={e => setSupervisorName(e.target.value)} />
        </div>
        <div style={col(6)}>
          <label style={lbl}>Date of Grievance *</label>
          <input type="date" style={{ ...inp(grievanceError && !incidentTime), width: "100%" }} value={incidentTime} onChange={e => setIncidentTime(e.target.value)} />
        </div>
        <div className="gold-rule" />
        <div style={col(6)}>
          <label style={lbl}>Explanation of Grievance *</label>
          <textarea style={{ ...inp(grievanceError && !description.trim()), width: "100%", minHeight: 120, resize: "vertical", lineHeight: 1.6 }} placeholder="Describe the issue in detail…" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="gold-rule" />
        <div style={col(6)}>
          <label style={lbl}>Proposed Solution</label>
          <textarea style={{ ...inp(), width: "100%", minHeight: 100, resize: "vertical", lineHeight: 1.6 }} placeholder="What remedy are you seeking?" value={remedy} onChange={e => setRemedy(e.target.value)} />
        </div>
        <div className="gold-rule" />
        <div style={col(6)}>
          <label style={lbl}>Witness</label>
          <input style={{ ...inp(), width: "100%" }} placeholder="Name(s) of any witnesses" value={witnesses} onChange={e => setWitnesses(e.target.value)} />
        </div>
        <div style={col(6)}>
          <label style={lbl}>Signature</label>
          <input style={{ ...inp(), width: "100%" }} placeholder="Type your full name to sign" value={contractArticle} onChange={e => setContractArticle(e.target.value)} />
        </div>
      </div>
      <div key={shakeKey} className={grievanceError ? "shake" : ""}>
        <button style={btnGold()} onClick={handleGrievance}>SUBMIT GRIEVANCE</button>
      </div>
    </div>
  );
}
