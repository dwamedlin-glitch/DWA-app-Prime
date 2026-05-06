import React from "react";
import { LOGO_B64 } from "../constants/assets";
import { css } from "../styles/globalStyles";

// Login screen component - rendered when user is not logged in
// All state and handlers are passed via props from DWAApp
const LoginScreen = (props) => {
  // ── LOGIN SCREEN ──
  if (!loggedIn) return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 24px 40px", position: "relative", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% -10%, rgba(201,146,42,0.12) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />

        <div className="rise" style={{ width: "100%", ...col(0), alignItems: "center" }}>
          <img src={LOGO_B64} alt="DWA" style={{ width: "min(200px, 52vw)", objectFit: "contain", marginBottom: 8 }} />
          <div style={{ ...f(11, 600), color: "var(--text3)", letterSpacing: ".25em", textTransform: "uppercase", marginBottom: 28 }}>Dairy Workers Association</div>
          <div className="gold-rule" style={{ width: "100%", marginBottom: 28 }} />

          {authView === "login" && (
            <>
              <div style={{ width: "100%", ...col(14) }}>
                <div style={col(6)}>
                  <label style={lbl}>Email Address</label>
                  <input style={inp(loginError && !email)} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                <div style={col(6)}>
                  <label style={lbl}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input style={{ ...inp(loginError && !password), paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                    <span onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", ...f(10, 600, 'bebas'), color: "var(--gold)", letterSpacing: ".06em", userSelect: "none" }}>{showPassword ? "HIDE" : "SHOW"}</span>
                  </div>
                </div>
                {loginError && <div style={{ ...f(12, 400, 'serif'), color: "var(--red)", fontStyle: "italic" }}>Please enter your email and password.</div>}
                <div style={{ ...row("center", 10), justifyContent: "space-between" }}>
                  <div style={{ ...row("center", 10), cursor: "pointer" }} onClick={() => setRememberMe(v => !v)}>
                    <div className={`checkbox-custom${rememberMe ? " checked" : ""}`}>
                      {rememberMe && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><polyline points="1,5 4,8 11,1" stroke="#1a0f00" strokeWidth="2" strokeLinecap="round" /></svg>}
                    </div>
                    <span style={{ ...f(13, 400), color: "var(--text2)" }}>Remember me</span>
                  </div>
                  <span onClick={() => alert("Contact your steward to reset your password.")} style={{ ...f(12, 400, 'serif'), color: "var(--gold)", cursor: "pointer", fontStyle: "italic" }}>Forgot password?</span>
                </div>
                <button style={btnGold(authLoading)} disabled={authLoading} onClick={handleLogin}>{authLoading ? "SIGNING IN…" : "SIGN IN"}</button>
              </div>
              <div className="gold-rule" style={{ width: "100%", margin: "28px 0 16px" }} />
              <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", textAlign: "center" }}>
                New to DWA?{" "}
                <span onClick={() => { setAuthView("register"); setLoginError(false); setRegError(""); }} style={{ color: "var(--gold)", cursor: "pointer" }}>Request access →</span>
              </div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
                Access restricted to DWA members only.
              </div>
            </>
          )}

          {authView === "register" && (
            <>
              <div style={{ width: "100%", ...col(14) }}>
                <div style={col(6)}>
                  <label style={lbl}>Full Name</label>
                  <input style={inp(!!regError && !regName.trim())} value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your full name" />
                </div>
                <div style={col(6)}>
                  <label style={lbl}>Email Address</label>
                  <input style={inp(!!regError && !regEmail.trim())} value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="your@email.com" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(6)}>
                    <label style={lbl}>Location</label>
                    <select style={dropStyle()} value={regLocation} onChange={e => setRegLocation(e.target.value)}>
                      <option>Jersey City</option>
                      <option>Florence</option>
                    </select>
                  </div>
                  <div style={col(6)}>
                    <label style={lbl}>Phone <span style={{ color: "var(--text3)", fontWeight: 400 }}>(optional)</span></label>
                    <input style={inp()} type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="Phone number" />
                  </div>
                </div>
                <div style={col(6)}>
                  <label style={lbl}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input style={{ ...inp(!!regError && !regPassword), paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    <span onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", ...f(10, 600, 'bebas'), color: "var(--gold)", letterSpacing: ".06em", userSelect: "none" }}>{showPassword ? "HIDE" : "SHOW"}</span>
                  </div>
                </div>
                <div style={col(6)}>
                  <label style={lbl}>Confirm Password</label>
                  <input style={inp(!!regError && regConfirm !== regPassword)} type={showPassword ? "text" : "password"} placeholder="Repeat password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
                </div>
                {regError && <div style={{ ...f(12, 400, 'serif'), color: "var(--red)", fontStyle: "italic" }}>{regError}</div>}
                <button style={btnGold(authLoading)} disabled={authLoading} onClick={handleRegister}>{authLoading ? "CREATING ACCOUNT…" : "SUBMIT REQUEST"}</button>
              </div>
              <div className="gold-rule" style={{ width: "100%", margin: "24px 0 12px" }} />
              <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", textAlign: "center", fontStyle: "italic" }}>
                A union official will review your request. You'll be able to sign in once approved.
              </div>
              <div onClick={() => { setAuthView("login"); setRegError(""); }} style={{ ...f(13, 500), color: "var(--gold)", cursor: "pointer", marginTop: 16 }}>← Back to sign in</div>
            </>
          )}

          {authView === "pending" && (
            <>
              <div style={{ width: "100%", ...col(14), alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)" }}>
                  <SectionIcon icon="check" size={28} />
                </div>
                <div style={{ ...f(18, 600), color: "var(--text)" }}>Request Submitted</div>
                <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>
                  Thanks for registering. A union official will review your request shortly. You'll be notified when your account is approved.
                </div>
              </div>
              <div className="gold-rule" style={{ width: "100%", margin: "28px 0 16px" }} />
              <button style={btnGold()} onClick={() => setAuthView("login")}>RETURN TO SIGN IN</button>
            </>
          )}

          {/* How to Install the DWA App — toggle */}
          <div style={{ width: "100%", marginTop: 28 }}>
            <div className="gold-rule" style={{ width: "100%", marginBottom: 16 }} />
            <div onClick={() => setShowInstallGuide(v => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", padding: "10px 0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              <span style={{ ...f(12, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".12em" }}>How to Install the DWA App</span>
              <span style={{ ...f(14, 400), color: "var(--gold)", transition: "transform .2s", transform: showInstallGuide ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
            </div>
            {showInstallGuide && (
              <div style={{ marginTop: 12, animation: "fadeUp .25s ease" }}>
                <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.7, marginBottom: 16, textAlign: "center", fontStyle: "italic" }}>
                  Get instant access on your home screen — no app store needed.
                </div>

                <div style={{ marginBottom: 18 }}>
                  <div style={{ ...f(12, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>On Android (Chrome):</div>
                  <div style={{ ...col(6) }}>
                    {[
                      "Open Chrome and go to dwaunion.com",
                      "Tap the menu icon (⋮) in the top-right corner",
                      'Tap "Add to Home Screen"',
                      "Name the shortcut and tap Add",
                      "Open the DWA app from your home screen"
                    ].map((step, i) => (
                      <div key={i} style={{ ...row("flex-start", 8) }}>
                        <span style={{ ...f(12, 700), color: "var(--gold)", minWidth: 18 }}>{i + 1}.</span>
                        <span style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.5 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ ...f(12, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>On iPhone / iPad (Safari):</div>
                  <div style={{ ...col(6) }}>
                    {[
                      "Open Safari and go to dwaunion.com",
                      <>Tap the Share button{" "}<span style={{ display: "inline-flex", verticalAlign: "middle", padding: "1px 4px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></span>{" "}in the toolbar</>,
                      <>Scroll down and tap{" "}<span style={{ display: "inline-flex", alignItems: "center", gap: 3, verticalAlign: "middle", padding: "1px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span style={{ ...f(10, 600), color: "var(--cream)" }}>Add to Home Screen</span></span></>,
                      "Name the shortcut and tap Add",
                      "Open the DWA app from your home screen"
                    ].map((step, i) => (
                      <div key={i} style={{ ...row("flex-start", 8) }}>
                        <span style={{ ...f(12, 700), color: "var(--gold)", minWidth: 18 }}>{i + 1}.</span>
                        <span style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.5 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>
                    *On iOS, use Safari for the best experience. Other browsers may not support "Add to Home Screen."
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
