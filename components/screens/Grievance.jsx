import React from "react";

// Per-file caps. Photos are also compressed client-side before upload (1600px max).
const MAX_FILES = 5;
const SIZE_LIMITS = {
  image: 10 * 1024 * 1024,  // 10 MB
  application: 10 * 1024 * 1024, // PDFs
  audio: 25 * 1024 * 1024,  // 25 MB (~25 min m4a @ 128kbps)
  video: 50 * 1024 * 1024,  // 50 MB
};
const ACCEPT = "image/*,application/pdf,audio/*,video/*";

function formatBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + " KB";
  return (n / (1024 * 1024)).toFixed(1) + " MB";
}

function kindOf(file) {
  const t = (file.type || "").toLowerCase();
  if (t.startsWith("image/")) return "image";
  if (t === "application/pdf") return "pdf";
  if (t.startsWith("audio/")) return "audio";
  if (t.startsWith("video/")) return "video";
  return "file";
}

function iconFor(kind) {
  if (kind === "image") return "camera";
  if (kind === "pdf") return "file";
  if (kind === "audio") return "bell"; // closest in the icon set
  if (kind === "video") return "video";
  return "file";
}

export default function Grievance({ ctx }) {
  const {
    card,
    col,
    row,
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
    grievanceFiles,
    setGrievanceFiles,
    grievanceUploading,
    grievanceUploadProgress,
    setToastMsg,
  } = ctx;

  const fileInputRef = React.useRef(null);

  const addFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    const accepted = [];
    for (const f of incoming) {
      const remaining = MAX_FILES - (grievanceFiles.length + accepted.length);
      if (remaining <= 0) {
        setToastMsg && setToastMsg({ message: `Up to ${MAX_FILES} attachments per grievance.` });
        break;
      }
      const kind = kindOf(f);
      const cat = kind === "pdf" ? "application" : kind;
      const limit = SIZE_LIMITS[cat] || SIZE_LIMITS.application;
      if (f.size > limit) {
        setToastMsg && setToastMsg({ message: `"${f.name}" is too large (${formatBytes(f.size)}). Max ${formatBytes(limit)}.` });
        continue;
      }
      const previewUrl = kind === "image" ? URL.createObjectURL(f) : null;
      accepted.push({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 8), file: f, previewUrl, kind, name: f.name, size: f.size });
    }
    if (accepted.length) setGrievanceFiles([...grievanceFiles, ...accepted]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id) => {
    const entry = grievanceFiles.find(e => e.id === id);
    if (entry && entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
    setGrievanceFiles(grievanceFiles.filter(e => e.id !== id));
  };

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

  const uploadBusy = grievanceUploading;

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
          <label style={lbl}>Date of Incident *</label>
          <input type="date" style={{ ...inp(grievanceError && !incidentDate), width: "100%" }} value={incidentDate} onChange={e => setIncidentDate(e.target.value)} />
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
          <label style={lbl}>Witness(es)</label>
          <input style={{ ...inp(), width: "100%" }} placeholder="Name(s) of any witnesses" value={witnesses} onChange={e => setWitnesses(e.target.value)} />
        </div>

        {/* ── ATTACHMENTS ── */}
        <div className="gold-rule" />
        <div style={col(8)}>
          <label style={lbl}>Attachments (optional)</label>
          <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", lineHeight: 1.5 }}>
            Photos, documents (PDF), or audio recordings related to your grievance.
            In New Jersey, you may legally record any conversation you are a party to.
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            multiple
            onChange={e => addFiles(e.target.files)}
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={grievanceFiles.length >= MAX_FILES || uploadBusy}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1.5px dashed rgba(201,146,42,0.4)", background: "rgba(201,146,42,0.04)", color: "var(--gold)", ...f(13, 700), letterSpacing: ".05em", cursor: grievanceFiles.length >= MAX_FILES ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: grievanceFiles.length >= MAX_FILES || uploadBusy ? 0.5 : 1 }}
          >
            <SectionIcon icon="clip" size={18} />
            {grievanceFiles.length >= MAX_FILES ? `Maximum ${MAX_FILES} files reached` : "ADD A FILE"}
          </button>
          {grievanceFiles.length > 0 && (
            <div style={{ ...col(6), marginTop: 4 }}>
              {grievanceFiles.map(entry => (
                <div key={entry.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--seam)", borderRadius: 8, padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
                  {entry.kind === "image" && entry.previewUrl ? (
                    <img src={entry.previewUrl} alt={entry.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0, border: "1px solid var(--seam)" }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 6, background: "rgba(201,146,42,0.08)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                      <SectionIcon icon={iconFor(entry.kind)} size={18} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...f(12, 600), color: "var(--cream)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</div>
                    <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 1 }}>
                      {entry.kind.toUpperCase()} · {formatBytes(entry.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(entry.id)}
                    disabled={uploadBusy}
                    style={{ background: "none", border: "none", color: "var(--red)", cursor: uploadBusy ? "not-allowed" : "pointer", ...f(20, 400), padding: 4, lineHeight: 1 }}
                    aria-label="Remove file"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="gold-rule" />
        <div style={col(6)}>
          <label style={lbl}>Signature *</label>
          <input style={{ ...inp(grievanceError && !contractArticle.trim()), width: "100%" }} placeholder="Type your full name to sign" value={contractArticle} onChange={e => setContractArticle(e.target.value)} />
        </div>
      </div>
      <div key={shakeKey} className={grievanceError ? "shake" : ""}>
        <button
          style={{ ...btnGold(uploadBusy), opacity: uploadBusy ? 0.7 : 1, cursor: uploadBusy ? "not-allowed" : "pointer" }}
          disabled={uploadBusy}
          onClick={handleGrievance}
        >
          {uploadBusy
            ? `UPLOADING (${grievanceUploadProgress.done}/${grievanceUploadProgress.total})…`
            : "SUBMIT GRIEVANCE"}
        </button>
      </div>
    </div>
  );
}
