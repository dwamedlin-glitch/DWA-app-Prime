// pages/admin.js
// Admin dashboard for DWA union officers to manage site content

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const SECTIONS = ['announcements', 'stewards', 'documents'];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('announcements');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef(null);
  const [newGrievanceEmail, setNewGrievanceEmail] = useState('');

  // Check if already logged in (token in sessionStorage)
  useEffect(() => {
    const saved = sessionStorage.getItem('dwa_admin_token');
    if (saved) {
      setToken(saved);
      setLoggedIn(true);
    }
  }, []);

  // Load data when logged in
  useEffect(() => {
    if (loggedIn) {
      fetch('/api/data')
        .then(r => r.json())
        .then(d => setData(d))
        .catch(() => {});
    }
  }, [loggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (result.success) {
        setToken(result.token);
        setLoggedIn(true);
        sessionStorage.setItem('dwa_admin_token', result.token);
      } else {
        setLoginError('Wrong password. Try again.');
      }
    } catch {
      setLoginError('Connection error.');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setToken('');
    setData(null);
    sessionStorage.removeItem('dwa_admin_token');
  };

  const saveSection = async (section) => {
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ section, items: data[section] }),
      });
      const result = await res.json();
      if (result.success) {
        setSaveMsg('Saved!');
        setTimeout(() => setSaveMsg(''), 2000);
      } else {
        setSaveMsg('Error saving: ' + (result.error || 'unknown'));
      }
    } catch {
      setSaveMsg('Connection error.');
    }
    setSaving(false);
  };

  const handleUpload = async (desiredFilename) => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', desiredFilename || file.name);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setUploadMsg(`Uploaded: ${result.url}`);
        fileRef.current.value = '';
      } else {
        setUploadMsg('Upload failed: ' + (result.error || 'unknown'));
      }
    } catch {
      setUploadMsg('Connection error.');
    }
    setUploading(false);
  };

  // --- Announcement editing ---
  const updateAnnouncement = (id, field, value) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.map(a =>
        a.id === id ? { ...a, [field]: field === 'urgent' ? value === 'true' : value } : a
      ),
    }));
  };

  const addAnnouncement = () => {
    const maxId = Math.max(0, ...data.announcements.map(a => a.id));
    setData(prev => ({
      ...prev,
      announcements: [...prev.announcements, {
        id: maxId + 1,
        title: 'New Announcement',
        body: '',
        titleEs: '',
        bodyEs: '',
        urgent: false,
      }],
    }));
  };

  const removeAnnouncement = (id) => {
    if (!confirm('Delete this announcement?')) return;
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id),
    }));
  };

  // --- Steward editing ---
  const updateSteward = (id, field, value) => {
    setData(prev => ({
      ...prev,
      stewards: prev.stewards.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addSteward = () => {
    const maxId = Math.max(0, ...data.stewards.map(s => s.id));
    setData(prev => ({
      ...prev,
      stewards: [...prev.stewards, {
        id: maxId + 1,
        name: '',
        title: 'Shop Steward',
        dept: '',
        shifts: '',
        phone: '',
      }],
    }));
  };

  const removeSteward = (id) => {
    if (!confirm('Remove this steward?')) return;
    setData(prev => ({
      ...prev,
      stewards: prev.stewards.filter(s => s.id !== id),
    }));
  };

  // --- Grievance email editing ---
  const addGrievanceEmail = () => {
    const email = newGrievanceEmail.trim().toLowerCase();
    if (!email || !email.includes('@') || !email.includes('.')) return;
    if (data.grievanceEmails && data.grievanceEmails.includes(email)) return;
    setData(prev => ({
      ...prev,
      grievanceEmails: [...(prev.grievanceEmails || []), email],
    }));
    setNewGrievanceEmail('');
  };

  const removeGrievanceEmail = (emailToRemove) => {
    if (!confirm(`Remove ${emailToRemove}?`)) return;
    setData(prev => ({
      ...prev,
      grievanceEmails: (prev.grievanceEmails || []).filter(e => e !== emailToRemove),
    }));
  };

  // --- Document editing ---
  const updateDocument = (id, field, value) => {
    setData(prev => ({
      ...prev,
      documents: prev.documents.map(d =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    }));
  };

  const addDocument = () => {
    const maxId = Math.max(0, ...data.documents.map(d => d.id));
    setData(prev => ({
      ...prev,
      documents: [...prev.documents, {
        id: maxId + 1,
        name: 'New Document',
        category: 'Contract & Bylaws',
        size: '—',
        updated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        desc: '',
      }],
    }));
  };

  const removeDocument = (id) => {
    if (!confirm('Delete this document?')) return;
    setData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id),
    }));
  };

  // --- CBA Article editing ---
  const updateCbaArticle = (id, field, value) => {
    setData(prev => ({
      ...prev,
      cbaArticles: (prev.cbaArticles || []).map(a =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    }));
  };

  const addCbaArticle = () => {
    const articles = data.cbaArticles || [];
    const maxId = articles.length > 0 ? Math.max(0, ...articles.map(a => a.id)) : 0;
    setData(prev => ({
      ...prev,
      cbaArticles: [...(prev.cbaArticles || []), {
        id: maxId + 1,
        title: 'New Article',
        body: '',
      }],
    }));
  };

  const removeCbaArticle = (id) => {
    if (!confirm('Delete this contract article?')) return;
    setData(prev => ({
      ...prev,
      cbaArticles: (prev.cbaArticles || []).filter(a => a.id !== id),
    }));
  };

  // ============ RENDER ============

  const styles = {
    page: { fontFamily: "'Segoe UI', Tahoma, sans-serif", background: '#111', color: '#eee', minHeight: '100vh', padding: 0, margin: 0 },
    header: { background: '#1a1208', borderBottom: '3px solid #c9922a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 'bold', color: '#c9922a', letterSpacing: '2px' },
    logoutBtn: { background: 'none', border: '1px solid #c9922a', color: '#c9922a', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px' },
    loginBox: { maxWidth: '360px', margin: '80px auto', background: '#1a1208', border: '1px solid #333', borderRadius: '8px', padding: '32px' },
    loginTitle: { fontSize: '20px', fontWeight: 'bold', color: '#c9922a', marginBottom: '20px', textAlign: 'center' },
    input: { width: '100%', padding: '10px 12px', background: '#222', border: '1px solid #444', borderRadius: '4px', color: '#eee', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px 12px', background: '#222', border: '1px solid #444', borderRadius: '4px', color: '#eee', fontSize: '14px', marginBottom: '12px', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' },
    btn: { background: 'linear-gradient(135deg, #a06b18, #c9922a)', color: '#1a0f00', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
    btnDanger: { background: '#8b0000', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    btnSecondary: { background: '#333', color: '#ccc', border: '1px solid #555', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    tabs: { display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '8px' },
    tab: (active) => ({ padding: '8px 18px', background: active ? '#c9922a' : '#222', color: active ? '#111' : '#aaa', border: 'none', borderRadius: '4px 4px 0 0', cursor: 'pointer', fontWeight: active ? 'bold' : 'normal', fontSize: '14px' }),
    card: { background: '#1a1208', border: '1px solid #333', borderRadius: '8px', padding: '20px', marginBottom: '16px' },
    label: { display: 'block', fontSize: '12px', color: '#c9922a', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' },
    row: { display: 'flex', gap: '12px', marginBottom: '12px' },
    saveBar: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', marginBottom: '24px' },
    msg: { color: '#4CAF50', fontSize: '14px' },
    uploadSection: { background: '#1a1208', border: '1px solid #333', borderRadius: '8px', padding: '20px', marginBottom: '24px' },
  };

  // --- LOGIN SCREEN ---
  if (!loggedIn) {
    return (
      <>
        <Head><title>DWA Admin</title></Head>
        <div style={styles.page}>
          <div style={styles.loginBox}>
            <div style={styles.loginTitle}>DWA ADMIN LOGIN</div>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                autoFocus
              />
              <button type="submit" style={{ ...styles.btn, width: '100%' }}>Log In</button>
              {loginError && <div style={{ color: '#ff4444', marginTop: '12px', textAlign: 'center' }}>{loginError}</div>}
            </form>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <>
      <Head><title>DWA Admin Dashboard</title></Head>
      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logo}>DWA ADMIN</div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log Out</button>
        </div>

        <div style={styles.container}>
          {/* TABS */}
          <div style={styles.tabs}>
            <button style={styles.tab(activeTab === 'announcements')} onClick={() => setActiveTab('announcements')}>Announcements</button>
            <button style={styles.tab(activeTab === 'stewards')} onClick={() => setActiveTab('stewards')}>Stewards</button>
            <button style={styles.tab(activeTab === 'documents')} onClick={() => setActiveTab('documents')}>Documents</button>
            <button style={styles.tab(activeTab === 'cbaArticles')} onClick={() => setActiveTab('cbaArticles')}>Contract</button>
            <button style={styles.tab(activeTab === 'grievanceEmails')} onClick={() => setActiveTab('grievanceEmails')}>Grievance Emails</button>
            <button style={styles.tab(activeTab === 'uploads')} onClick={() => setActiveTab('uploads')}>Upload Files</button>
          </div>

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
            <>
              <div style={styles.saveBar}>
                <button style={styles.btn} onClick={() => saveSection('announcements')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Announcements'}
                </button>
                <button style={styles.btnSecondary} onClick={addAnnouncement}>+ Add New</button>
                {saveMsg && <span style={styles.msg}>{saveMsg}</span>}
              </div>

              {data.announcements.map(a => (
                <div key={a.id} style={styles.card}>
                  <div style={styles.row}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Title</label>
                      <input style={styles.input} value={a.title} onChange={e => updateAnnouncement(a.id, 'title', e.target.value)} />
                    </div>
                    <div style={{ width: '100px' }}>
                      <label style={styles.label}>Urgent</label>
                      <select style={{ ...styles.input, padding: '10px 8px' }} value={String(a.urgent)} onChange={e => updateAnnouncement(a.id, 'urgent', e.target.value)}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>
                  <label style={styles.label}>Body</label>
                  <textarea style={styles.textarea} value={a.body} onChange={e => updateAnnouncement(a.id, 'body', e.target.value)} />
                  <label style={styles.label}>Title (Spanish)</label>
                  <input style={styles.input} value={a.titleEs || ''} onChange={e => updateAnnouncement(a.id, 'titleEs', e.target.value)} />
                  <label style={styles.label}>Body (Spanish)</label>
                  <textarea style={styles.textarea} value={a.bodyEs || ''} onChange={e => updateAnnouncement(a.id, 'bodyEs', e.target.value)} />
                  <button style={styles.btnDanger} onClick={() => removeAnnouncement(a.id)}>Delete</button>
                </div>
              ))}
            </>
          )}

          {/* STEWARDS TAB */}
          {activeTab === 'stewards' && (
            <>
              <div style={styles.saveBar}>
                <button style={styles.btn} onClick={() => saveSection('stewards')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Stewards'}
                </button>
                <button style={styles.btnSecondary} onClick={addSteward}>+ Add New</button>
                {saveMsg && <span style={styles.msg}>{saveMsg}</span>}
              </div>

              {data.stewards.map(s => (
                <div key={s.id} style={styles.card}>
                  <div style={styles.row}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Name</label>
                      <input style={styles.input} value={s.name} onChange={e => updateSteward(s.id, 'name', e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Phone</label>
                      <input style={styles.input} value={s.phone} onChange={e => updateSteward(s.id, 'phone', e.target.value)} />
                    </div>
                  </div>
                  <div style={styles.row}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Title</label>
                      <input style={styles.input} value={s.title} onChange={e => updateSteward(s.id, 'title', e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Department</label>
                      <input style={styles.input} value={s.dept} onChange={e => updateSteward(s.id, 'dept', e.target.value)} />
                    </div>
                  </div>
                  <button style={styles.btnDanger} onClick={() => removeSteward(s.id)}>Remove</button>
                </div>
              ))}
            </>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <>
              <div style={styles.saveBar}>
                <button style={styles.btn} onClick={() => saveSection('documents')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Documents'}
                </button>
                <button style={styles.btnSecondary} onClick={addDocument}>+ Add New</button>
                {saveMsg && <span style={styles.msg}>{saveMsg}</span>}
              </div>

              {data.documents.map(d => (
                <div key={d.id} style={styles.card}>
                  <div style={styles.row}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Document Name</label>
                      <input style={styles.input} value={d.name} onChange={e => updateDocument(d.id, 'name', e.target.value)} />
                    </div>
                    <div style={{ width: '160px' }}>
                      <label style={styles.label}>Category</label>
                      <select style={{ ...styles.input, padding: '10px 8px' }} value={d.category} onChange={e => updateDocument(d.id, 'category', e.target.value)}>
                        <option value="Contract & Bylaws">Contract & Bylaws</option>
                        <option value="Forms">Forms</option>
                      </select>
                    </div>
                  </div>
                  <div style={styles.row}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Description</label>
                      <input style={styles.input} value={d.desc || ''} onChange={e => updateDocument(d.id, 'desc', e.target.value)} placeholder="Optional description" />
                    </div>
                    <div style={{ width: '120px' }}>
                      <label style={styles.label}>Updated</label>
                      <input style={styles.input} value={d.updated || ''} onChange={e => updateDocument(d.id, 'updated', e.target.value)} placeholder="e.g. Jan 2025" />
                    </div>
                  </div>
                  <button style={styles.btnDanger} onClick={() => removeDocument(d.id)}>Delete</button>
                </div>
              ))}
            </>
          )}

          {/* CONTRACT ARTICLES TAB */}
          {activeTab === 'cbaArticles' && (
            <>
              <div style={styles.saveBar}>
                <button style={styles.btn} onClick={() => saveSection('cbaArticles')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Contract Articles'}
                </button>
                <button style={styles.btnSecondary} onClick={addCbaArticle}>+ Add Article</button>
                {saveMsg && <span style={styles.msg}>{saveMsg}</span>}
              </div>

              <div style={{ ...styles.card, padding: '13px 16px', marginBottom: '16px', borderLeft: '3px solid #c9922a' }}>
                <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  Edit your Collective Bargaining Agreement articles below. Each article has a title and body text. 
                  Changes will appear on the member-facing site after saving.
                </p>
              </div>

              {(data.cbaArticles || []).map((a, idx) => (
                <div key={a.id} style={{ ...styles.card, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '12px', right: '16px', ...styles.label, color: '#555' }}>
                    Article {idx + 1}
                  </div>
                  <label style={styles.label}>Title</label>
                  <input style={styles.input} value={a.title} onChange={e => updateCbaArticle(a.id, 'title', e.target.value)} />
                  <label style={styles.label}>Body</label>
                  <textarea style={{ ...styles.textarea, minHeight: '200px' }} value={a.body} onChange={e => updateCbaArticle(a.id, 'body', e.target.value)} />
                  <button style={styles.btnDanger} onClick={() => removeCbaArticle(a.id)}>Delete Article</button>
                </div>
              ))}
            </>
          )}

          {/* GRIEVANCE EMAILS TAB */}
          {activeTab === 'grievanceEmails' && (
            <>
              <div style={styles.saveBar}>
                <button style={styles.btn} onClick={() => saveSection('grievanceEmails')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Emails'}
                </button>
                {saveMsg && <span style={styles.msg}>{saveMsg}</span>}
              </div>

              <div style={styles.card}>
                <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                  When a member submits a grievance, it will be sent to all email addresses listed below. 
                  You can add up to 10 recipients.
                </p>

                {(data.grievanceEmails || []).map((email, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', padding: '12px 16px', background: '#222', borderRadius: '6px', border: '1px solid #444' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', color: '#eee' }}>{email}</div>
                    </div>
                    <button style={styles.btnDanger} onClick={() => removeGrievanceEmail(email)}>Remove</button>
                  </div>
                ))}

                {(data.grievanceEmails || []).length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '14px', fontStyle: 'italic' }}>
                    No email addresses configured. Grievances will be logged but not emailed.
                  </div>
                )}

                <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '16px' }}>
                  <label style={styles.label}>Add Email Address</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      style={{ ...styles.input, flex: 1, marginBottom: 0 }} 
                      placeholder="e.g. president@dwaunion.org" 
                      value={newGrievanceEmail} 
                      onChange={e => setNewGrievanceEmail(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addGrievanceEmail(); }}
                    />
                    <button style={styles.btn} onClick={addGrievanceEmail}>Add</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* UPLOADS TAB */}
          {activeTab === 'uploads' && (
            <div style={styles.uploadSection}>
              <h3 style={{ color: '#c9922a', marginBottom: '16px' }}>Upload Images</h3>
              <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '14px' }}>
                Upload flyer images, QR codes, or other files. They go to the <code>/public/images/</code> folder and are available at <code>/images/filename.png</code>.
              </p>

              <label style={styles.label}>Choose File</label>
              <input type="file" ref={fileRef} accept="image/*,.pdf" style={{ ...styles.input, padding: '8px' }} />

              <label style={styles.label}>Save As (filename)</label>
              <input id="uploadFilename" style={styles.input} placeholder="e.g. flyer.png or qr-code.png" />

              <button
                style={styles.btn}
                onClick={() => handleUpload(document.getElementById('uploadFilename')?.value)}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

              {uploadMsg && <div style={{ ...styles.msg, marginTop: '12px' }}>{uploadMsg}</div>}

              <div style={{ marginTop: '24px', borderTop: '1px solid #333', paddingTop: '16px' }}>
                <h4 style={{ color: '#c9922a', marginBottom: '8px' }}>Quick Upload Shortcuts</h4>
                <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '12px' }}>
                  To update the Union Meeting Flyer or QR code, upload a file with one of these exact names:
                </p>
                <ul style={{ color: '#ccc', fontSize: '13px', paddingLeft: '20px' }}>
                  <li><code>flyer.png</code> — replaces the Union Meeting Flyer image</li>
                  <li><code>qr-code.png</code> — replaces the QR code on the flyer</li>
                  <li><code>dwa-logo.png</code> — replaces the DWA logo</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
