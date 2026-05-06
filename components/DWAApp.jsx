/* DWA v1.5.0 */
import { useState, useEffect, useRef } from "react";
import { subscribeToFloorPosts, createFloorPost, deleteFloorPost, addFloorReply, deleteFloorReply, banUser, unbanUser, subscribeToBannedUsers, saveUploadedDocuments, loadUploadedDocuments, uploadDocumentFile, uploadFloorPhoto, saveAnnouncements as fbSaveAnnouncements, loadAnnouncements as fbLoadAnnouncements, saveStewards as fbSaveStewards, loadStewards as fbLoadStewards, saveMeetingInfo as fbSaveMeetingInfo, loadMeetingInfo as fbLoadMeetingInfo, saveZoomInfo as fbSaveZoomInfo, loadZoomInfo as fbLoadZoomInfo, saveMinutes as fbSaveMinutes, loadMinutes as fbLoadMinutes, saveSeniority as fbSaveSeniority, loadSeniority as fbLoadSeniority, registerUser, loginUser, logoutUser, onAuthChange, saveUserProfile, getUserProfile, subscribeToPendingMembers, approveMember, denyMember, subscribeToApprovedMembers, updateUserRole, deleteUserProfile, sendPasswordResetToUser } from "../lib/firebase";
import { getApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import ProfilePage from "./ProfilePage";

// Extracted Constants
import { TEXTURE_B64, LOGO_B64, DWA_HANDS_LOGO, DWA_QR_CODE, DWA_FLYER_IMG, GRIEVANCE_FORM_HTML } from "./constants/assets";
import { ANNOUNCEMENTS, DOCUMENTS_DATA, DOC_CATEGORIES, CBA_ARTICLES, BYLAWS_ARTICLES, CBA_ARTICLES_ES, BYLAWS_ARTICLES_ES, STEWARDS, ISSUE_TYPES } from "./constants/data";

// Extracted Styles
import { css } from "./styles/globalStyles";

// Edit a floor post in-place (text + edited flag)
async function editFloorPost(postId, updates) {
  const db = getFirestore(getApp());
  const postRef = doc(db, "floor_posts", postId);
  await updateDoc(postRef, updates);
}

export default function DWAApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [role, setRole] = useState("member");
  const isAdmin = role === "super" || role === "admin";
  const isSteward = role === "steward";
  const isSuper = role === "super";
  const hasOfficialAccess = isAdmin || isSteward;
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const SUPER_ADMIN_EMAIL = "dwamedlin@gmail.com";
  const [adminEmails, setAdminEmails] = useState(["admin@dwa.org"]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminMgmtError, setAdminMgmtError] = useState("");

  const [authView, setAuthView] = useState("login");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regLocation, setRegLocation] = useState("Jersey City");
  const [regPhone, setRegPhone] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUid, setCurrentUid] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [memberEmails, setMemberEmails] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);

  const [seniority, setSeniority] = useState([
    { id: 1, name: "Robert Martinez", hireDate: "1998-03-14", location: "Jersey City" },
    { id: 2, name: "James O'Brien", hireDate: "2001-06-02", location: "Florence" },
    { id: 3, name: "Michael Thompson", hireDate: "2003-11-21", location: "Jersey City" },
    { id: 4, name: "David Chen", hireDate: "2008-04-17", location: "Florence" },
    { id: 5, name: "Anthony Russo", hireDate: "2012-09-05", location: "Jersey City" },
  ]);
  const [seniorityFilter, setSeniorityFilter] = useState("All");
  const [newSenName, setNewSenName] = useState("");
  const [newSenDate, setNewSenDate] = useState("");
  const [newSenLocation, setNewSenLocation] = useState("Jersey City");
  const [senError, setSenError] = useState("");
  const [editSenId, setEditSenId] = useState(null);

  const [rememberMe, setRememberMe] = useState(false);
  const [tab, setTab] = useState("home");
  const [sub, setSub] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(true);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm, danger }
  const [toastMsg, setToastMsg] = useState(null); // { message, onUndo }
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeBylawArticle, setActiveBylawArticle] = useState(null);
  const [lang, setLang] = useState("en");
  const [issueType, setIssueType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [witnesses, setWitnesses] = useState("");
  const [description, setDescription] = useState("");
  const [remedy, setRemedy] = useState("");
  const [contractArticle, setContractArticle] = useState("");
  const [priorGrievance, setPriorGrievance] = useState(false);
  const [grievanceError, setGrievanceError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [tabDataLoading, setTabDataLoading] = useState(false);
  const sessionTimerRef = useRef(null);
  const sessionWarningTimerRef = useRef(null);
  const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 min idle → logout
  const SESSION_WARNING_MS = 13 * 60 * 1000; // warn at 13 min
  const APP_VERSION = "1.3.0";
  const [myGrievances] = useState([
    { id: 1, type: "Scheduling or overtime issue", date: "Apr 3, 2026", status: "review" },
    { id: 2, type: "Wage or pay dispute", date: "Feb 18, 2026", status: "resolved" },
  ]);
  const [docSearch, setDocSearch] = useState("");
  const [docCat, setDocCat] = useState("All");
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annUrgent, setAnnUrgent] = useState(false);
  const [annPosted, setAnnPosted] = useState(false);
  const [editAnnId, setEditAnnId] = useState(null); // null = new post, id = editing existing
  const [annLang, setAnnLang] = useState("en"); // language toggle for announcements tab
  const [translating, setTranslating] = useState(false); // translation loading state
  const [minutes, setMinutes] = useState([
    { id: 1, title: "General Meeting – April 2026", date: "Apr 5, 2026", summary: "Members voted on contract language proposals. Steward election results announced. Next meeting May 15." },
    { id: 2, title: "Special Meeting – March 2026", date: "Mar 12, 2026", summary: "Management presented proposed changes to overtime policy. Union leadership taking comments through March 20." },
  ]);
  const [notifs, setNotifs] = useState({ meetings: true, announcements: true, grievances: false });
  const [documents, setDocuments] = useState(DOCUMENTS_DATA);
  const [nextMeeting, setNextMeeting] = useState({ title: "Contract Ratification Vote", date: "May 15, 2026", location: "Union Hall", time: "6:00 PM" });
  const [zoomInfo, setZoomInfo] = useState({ meetingId: "783 115 6878", passcode: "9cDtkC", link: "https://zoom.us/j/7831156878" });
  const [adminSection, setAdminSection] = useState(null);
  const [newDocName, setNewDocName] = useState("");
  const [newDocCat, setNewDocCat] = useState("Contract & Bylaws");
  const [newDocDesc, setNewDocDesc] = useState("");
  const [newDocFile, setNewDocFile] = useState(null); // { name, size, url, type, rawFile }
  const [newDocUploading, setNewDocUploading] = useState(false);
  const [docUploadDrag, setDocUploadDrag] = useState(false);
  const [editMeeting, setEditMeeting] = useState({ ...nextMeeting });
  const [editZoom, setEditZoom] = useState({ ...zoomInfo });
  const [adminSaved, setAdminSaved] = useState(false);
  const [newMinTitle, setNewMinTitle] = useState("");
  const [newMinDate, setNewMinDate] = useState("");
  const [newMinSummary, setNewMinSummary] = useState("");
  const [editMinId, setEditMinId] = useState(null);
  const [minLang, setMinLang] = useState("en");
  const [newStewardName, setNewStewardName] = useState("");
  const [newStewardPhone, setNewStewardPhone] = useState("");
  const [newStewardDept, setNewStewardDept] = useState("Jersey City");
  const [newContactName, setNewContactName] = useState("");
  const [newContactTitle, setNewContactTitle] = useState("Shop Steward");
  const [newContactDept, setNewContactDept] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [editContactId, setEditContactId] = useState(null);
  const [allApprovedUsers, setAllApprovedUsers] = useState([]);
  const [userAdminSearch, setUserAdminSearch] = useState("");
  const [newStewardTitle, setNewStewardTitle] = useState("Shop Steward");

  // ── THE FLOOR (Discussion Forum) ──
  const [floorPosts, setFloorPosts] = useState([]);
  const [floorLoading, setFloorLoading] = useState(true);
  const [floorReplyTo, setFloorReplyTo] = useState(null);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [floorPhoto, setFloorPhoto] = useState(null);
  const [floorPhotoPreview, setFloorPhotoPreview] = useState(null);
  const [floorPosting, setFloorPosting] = useState(false);
  const floorPostRef = useRef(null);
  const floorReplyRef = useRef(null);
  const floorPhotoRef = useRef(null);
  const [floorEditingPost, setFloorEditingPost] = useState(null); // post id being edited
  const [floorEditText, setFloorEditText] = useState("");
  const floorEditRef = useRef(null);
  const currentUserName = userProfile?.name || regName || email.split("@")[0] || "Member";
  const currentUserLocation = userProfile?.location || "Jersey City";
  const currentUserRole = isAdmin ? "officer" : (userProfile?.role === "steward" ? "steward" : "member");
  const isCurrentUserBanned = bannedUsers.some(b => b.name === currentUserName);

  // Subscribe to Firestore floor posts
  // Apply light/dark theme class to html element
  // PWA Install Prompt
  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    if (isStandalone) { setShowInstallBanner(false); setShowIOSInstallGuide(false); return; }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent);
    if (isIOS && isSafari && !isStandalone) {
      const dismissed = localStorage.getItem("dwa_ios_install_dismissed");
      if (!dismissed) setShowIOSInstallGuide(true);
    }
    const handler = (e) => { e.preventDefault(); setDeferredInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    if (result.outcome === "accepted") { setShowInstallBanner(false); }
    setDeferredInstallPrompt(null);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("light-theme");
      document.body.style.background = "";
      document.body.style.backgroundImage = "";
    } else {
      html.classList.add("light-theme");
      document.body.style.background = "#f5f0e8";
      document.body.style.backgroundImage = "none";
    }
  }, [darkMode]);

  useEffect(() => {
    let debounceTimer = null;
    const unsubscribe = subscribeToFloorPosts((posts) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setFloorPosts(posts);
        setFloorLoading(false);
      }, 150);
    });
    return () => { unsubscribe(); if (debounceTimer) clearTimeout(debounceTimer); };
  }, []);

  // Subscribe to banned users
  useEffect(() => {
    const unsubscribe = subscribeToBannedUsers((banned) => {
      setBannedUsers(banned);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to pending members from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPendingMembers((pending) => {
      setPendingMembers(pending.map(p => ({
        id: p.uid,
        uid: p.uid,
        name: p.name,
        email: p.email,
        location: p.location || "",
        phone: p.phone || "",
        submittedAt: p.memberSince || p.createdAt || "",
      })));
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to approved members for User Admin
  useEffect(() => {
    const unsub = subscribeToApprovedMembers((members) => setAllApprovedUsers(members));
    return () => unsub();
  }, []);

  // ── LOAD ALL APP DATA FROM FIRESTORE ──
  useEffect(() => {
    // Announcements
    fbLoadAnnouncements().then((anns) => {
      if (anns && anns.length > 0) setAnnouncements(anns);
    }).catch(() => {});

    // Stewards
    fbLoadStewards().then((list) => {
      if (list && list.length > 0) setStewardsData(list);
    }).catch(() => {});

    // Meeting info
    fbLoadMeetingInfo().then((info) => {
      if (info) { setNextMeeting(info); setEditMeeting(info); }
    }).catch(() => {});

    // Zoom info
    fbLoadZoomInfo().then((info) => {
      if (info) { setZoomInfo(info); setEditZoom(info); }
    }).catch(() => {});

    // Minutes
    fbLoadMinutes().then((list) => {
      if (list && list.length > 0) setMinutes(list);
    }).catch(() => {});

    // Seniority
    fbLoadSeniority().then((list) => {
      if (list && list.length > 0) setSeniority(list);
    }).catch(() => {});

    // Documents — load from Firestore
    loadUploadedDocuments().then((saved) => {
      if (saved && saved.length > 0) {
        setDocuments(saved);
      }
    }).catch(() => {});

    // Also fetch from /api/data for grievanceEmails and cbaArticles (not yet in Firestore)
    fetch("/api/data")
      .then((r) => r.json())
      .then((data) => {
        if (data.grievanceEmails) setGrievanceEmails(data.grievanceEmails);
        if (data.cbaArticles) setCbaArticlesData(data.cbaArticles);
      })
      .catch(() => {
        console.log("API not available, using hardcoded defaults");
      });
  }, []);

  // Stewards state (falls back to hardcoded STEWARDS)
  const [stewardsData, setStewardsData] = useState(STEWARDS);
  // Grievance recipient emails from API (admin-configurable)
  const [grievanceEmails, setGrievanceEmails] = useState([]);
  // CBA Articles from API (falls back to hardcoded CBA_ARTICLES)
  const [cbaArticlesData, setCbaArticlesData] = useState(CBA_ARTICLES);

  // ── OFFLINE DETECTION ──
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => { setIsOffline(false); setShowOfflineMessage(false); };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // ── SESSION TIMEOUT (idle auto-logout) ──
  useEffect(() => {
    if (!loggedIn) return;
    const resetTimers = () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      if (sessionWarningTimerRef.current) clearTimeout(sessionWarningTimerRef.current);
      setShowSessionWarning(false);
      sessionWarningTimerRef.current = setTimeout(() => {
        setShowSessionWarning(true);
      }, SESSION_WARNING_MS);
      sessionTimerRef.current = setTimeout(() => {
        setShowSessionWarning(false);
        logoutUser().then(() => {
          setLoggedIn(false);
          setTab("home");
          setSub(null);
          showToast("Session expired — you've been logged out for security.");
        }).catch(() => {
          setLoggedIn(false);
          setTab("home");
          setSub(null);
        });
      }, SESSION_TIMEOUT_MS);
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll", "mousemove"];
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));
    resetTimers();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimers));
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
      if (sessionWarningTimerRef.current) clearTimeout(sessionWarningTimerRef.current);
    };
  }, [loggedIn]);

  // ── TAB LOADING SKELETON SIMULATION ──
  useEffect(() => {
    if (!loggedIn) return;
    setTabDataLoading(true);
    const t = setTimeout(() => setTabDataLoading(false), 600);
    return () => clearTimeout(t);
  }, [tab, sub]);

  // helper: show offline message if offline
  const checkOfflineAction = (actionName) => {
    if (isOffline) {
      setShowOfflineMessage(true);
      return true; // blocked
    }
    return false;
  };

  const showToast = (msg) => {
    setToastMsg({ message: msg });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // ── UPDATE BANNER (show once per new version) ──
  useEffect(() => {
    try {
      const seen = localStorage.getItem("dwa_last_version");
      if (seen !== APP_VERSION) {
        setShowUpdateBanner(true);
      }
    } catch (e) { /* ignore */ }
  }, []);
  const dismissUpdateBanner = () => {
    setShowUpdateBanner(false);
    try { localStorage.setItem("dwa_last_version", APP_VERSION); } catch (e) { /* ignore */ }
  };

  // ── STYLE HELPERS ──
  const f = (size, weight = 400, font = 'oswald') => ({
    fontFamily: font === 'bebas' ? "'Bebas Neue', sans-serif" : font === 'serif' ? "'Source Serif 4', serif" : "'Oswald', sans-serif",
    fontSize: size, fontWeight: weight, lineHeight: 1,
  });
  const row = (align = "center", gap = 0) => ({ display: "flex", alignItems: align, gap });
  const col = (gap = 0) => ({ display: "flex", flexDirection: "column", gap });
  const card = (extra = {}) => ({
    background: "var(--leather2)", borderRadius: 10,
    border: "1px solid var(--seam)",
    boxShadow: darkMode ? "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)" : "0 2px 8px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.6)",
    ...extra,
  });
  const tileStyle = () => darkMode ? {
    background: "linear-gradient(160deg, #1c1208 0%, #110d05 100%)",
    border: "1.5px solid rgba(61,46,18,0.9)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
  } : {
    background: "linear-gradient(160deg, #fff 0%, #f8f4ed 100%)",
    border: "1.5px solid #d4c9a8",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
  };
  const tileIconStyle = () => darkMode ? {
    background: "rgba(201,146,42,0.08)", border: "1px solid rgba(201,146,42,0.15)",
  } : {
    background: "rgba(139,94,16,0.08)", border: "1px solid rgba(139,94,16,0.18)",
  };
  const inp = (err = false) => ({
    width: "100%", padding: "12px 14px",
    background: "var(--leather3)",
    border: `1.5px solid ${err ? "var(--red)" : "var(--seam)"}`,
    borderRadius: 8, color: "var(--text)", fontSize: 14,
    fontFamily: "'Oswald', sans-serif", fontWeight: 400, outline: "none",
  });
  const lbl = { ...f(10, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".12em" };
  const btnGold = (dis = false) => ({
    width: "100%", padding: "15px",
    background: dis ? "var(--leather3)" : "linear-gradient(135deg, #a06b18 0%, #c9922a 35%, #e8b84b 65%, #c9922a 100%)",
    border: dis ? "1px solid var(--seam)" : "1px solid var(--gold)",
    borderRadius: 8, color: dis ? "var(--text3)" : "#1a0f00",
    fontSize: 15, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".1em",
    cursor: dis ? "default" : "pointer",
    boxShadow: dis ? "none" : "0 2px 12px rgba(201,146,42,0.3)",
  });
  const btnOutline = {
    padding: "13px 24px", background: "transparent",
    border: "1.5px solid var(--seam)", borderRadius: 8,
    color: "var(--text2)", fontSize: 13, fontFamily: "'Oswald', sans-serif",
    fontWeight: 500, letterSpacing: ".08em", cursor: "pointer",
  };
  const dropStyle = (err = false) => ({
    ...inp(err), appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a7355' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36,
  });

  const handleLogin = async () => {
    if (!email || !password) { setLoginError(true); return; }
    const e = email.toLowerCase().trim();
    setAuthLoading(true);
    setLoginError(false);
    try {
      const cred = await loginUser(e, password);
      let profile = await getUserProfile(cred.user.uid);
      // Auto-create profile for super admin on first login
      if (!profile && e === SUPER_ADMIN_EMAIL) {
        await saveUserProfile(cred.user.uid, {
          name: "Admin",
          email: e,
          location: "",
          phone: "",
          role: "admin",
          status: "approved",
          memberSince: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          createdAt: new Date().toISOString(),
        });
        profile = { name: "Admin", email: e, role: "admin", status: "approved" };
      }
      if (profile && profile.status === "pending") {
        setAuthLoading(false);
        setAuthView("pending");
        return;
      }
      if (!profile && e !== SUPER_ADMIN_EMAIL) {
        setAuthLoading(false);
        setLoginError(true);
        return;
      }
      setCurrentUid(cred.user.uid);
      setUserProfile(profile);
      setCurrentUserEmail(e);
      if (e === SUPER_ADMIN_EMAIL) setRole("super");
      else if (adminEmails.map(a => a.toLowerCase()).includes(e)) setRole("admin");
      else if (profile?.role === "steward") setRole("steward");
      else setRole("member");
      setLoggedIn(true);
      setAuthLoading(false);
    } catch (err) {
      setAuthLoading(false);
      setLoginError(true);
    }
  };

  const handleRegister = async () => {
    const name = regName.trim();
    const e = regEmail.toLowerCase().trim();
    if (!name) { setRegError("Please enter your full name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setRegError("Please enter a valid email address."); return; }
    if (regPassword.length < 8) { setRegError("Password must be at least 8 characters."); return; }
    if (regPassword !== regConfirm) { setRegError("Passwords don't match."); return; }
    setAuthLoading(true);
    setRegError("");
    try {
      const cred = await registerUser(e, regPassword);
      // Create profile in Firestore with "pending" status
      await saveUserProfile(cred.user.uid, {
        name,
        email: e,
        location: regLocation,
        phone: regPhone.replace(/\D/g, "") || "",
        role: "member",
        status: "pending",
        memberSince: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        createdAt: new Date().toISOString(),
      });
      setAuthLoading(false);
      setRegName(""); setRegEmail(""); setRegPassword(""); setRegConfirm(""); setRegPhone(""); setRegLocation("Jersey City"); setRegError("");
      setAuthView("pending");
    } catch (err) {
      setAuthLoading(false);
      if (err.code === "auth/email-already-in-use") {
        setRegError("An account with that email already exists.");
      } else {
        setRegError(err.message || "Registration failed. Please try again.");
      }
    }
  };

  const handleGrievance = async () => {
    if (!incidentDate || !supervisorName.trim() || !incidentTime || !description.trim()) {
      setGrievanceError(true); setShakeKey(k => k + 1); return;
    }
    // Send grievance to API for email delivery
    try {
      await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType,
          incidentDate,
          incidentTime,
          incidentLocation,
          supervisorName,
          witnesses,
          description,
          remedy,
          contractArticle,
          priorGrievance,
        }),
      });
    } catch (e) {
      // Still mark as submitted even if email fails
    }
    setGrievanceSubmitted(true);
  };

  const resetGrievance = () => {
    setGrievanceSubmitted(false); setIssueType(""); setDescription(""); setIncidentDate("");
    setIncidentTime(""); setIncidentLocation(""); setSupervisorName(""); setWitnesses("");
    setRemedy(""); setContractArticle(""); setPriorGrievance(false); setGrievanceError(false);
  };

  // ── Save documents to Firestore ──
  const saveDocuments = async (docs) => {
    try {
      // Strip undefined values — Firestore rejects them
      const cleanDocs = docs.map(d => {
        const clean = {};
        Object.keys(d).forEach(k => { if (d[k] !== undefined) clean[k] = d[k]; });
        return clean;
      });
      await saveUploadedDocuments(cleanDocs);
    } catch (e) { console.error("Failed to save documents:", e); }
  };
  // ── Save announcements to Firestore ──
  const saveAnnouncements = async (anns) => {
    try { await fbSaveAnnouncements(anns); } catch (e) { console.log("Failed to save announcements:", e); }
  };
  // ── Save stewards to Firestore ──
  const saveStewards = async (list) => {
    try { await fbSaveStewards(list); } catch (e) { console.log("Failed to save stewards:", e); }
  };
  // ── Save meeting info to Firestore ──
  const saveMeetingInfo = async (info) => {
    try { await fbSaveMeetingInfo(info); } catch (e) { console.log("Failed to save meeting info:", e); }
  };
  // ── Save zoom info to Firestore ──
  const saveZoomInfoFn = async (info) => {
    try { await fbSaveZoomInfo(info); } catch (e) { console.log("Failed to save zoom info:", e); }
  };
  // ── Save minutes to Firestore ──
  const saveMinutesFn = async (list) => {
    try { await fbSaveMinutes(list); } catch (e) { console.log("Failed to save minutes:", e); }
  };
  // ── Save seniority to Firestore ──
  const saveSeniorityFn = async (list) => {
    try { await fbSaveSeniority(list); } catch (e) { console.log("Failed to save seniority:", e); }
  };

  const filteredDocs = documents.filter(d =>
    (docCat === "All" || d.category === docCat) &&
    d.name.toLowerCase().includes(docSearch.toLowerCase())
  );

  const postAnn = async () => {
    if (!annTitle.trim() || !annBody.trim()) return;
    let titleEs = annTitle;
    let bodyEs = annBody;
    // When editing, check if actual text content changed (ignoring whitespace changes)
    const existingAnn = editAnnId ? announcements.find(a => a.id === editAnnId) : null;
    const textChanged = !existingAnn || existingAnn.title.replace(/\s+/g,' ') !== annTitle.replace(/\s+/g,' ') || existingAnn.body.replace(/\s+/g,' ') !== annBody.replace(/\s+/g,' ');
    const needsTranslation = textChanged || !existingAnn?.bodyEs || existingAnn.bodyEs === existingAnn.body;
    if (needsTranslation) {
      setTranslating(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: annTitle, body: annBody }),
        });
        const data = await response.json();
        if (data.titleEs) titleEs = data.titleEs;
        if (data.bodyEs) bodyEs = data.bodyEs;
      } catch (e) {
        // If translation fails, fall back to English for both
      }
      setTranslating(false);
    } else if (existingAnn) {
      // Keep existing translations, just update formatting
      titleEs = existingAnn.titleEs || annTitle;
      bodyEs = existingAnn.bodyEs || annBody;
    }
    if (editAnnId) {
      setAnnouncements(prev => {
        const updated = prev.map(a => a.id === editAnnId ? { ...a, title: annTitle, body: annBody, titleEs, bodyEs, urgent: annUrgent } : a);
        saveAnnouncements(updated);
        return updated;
      });
      setEditAnnId(null);
    } else {
      const newAnn = { id: Date.now(), title: annTitle, body: annBody, titleEs, bodyEs, urgent: annUrgent };
      setAnnouncements(prev => { const updated = [newAnn, ...prev]; saveAnnouncements(updated); return updated; });
    }
    setAnnPosted(true);
    setTimeout(() => { setAnnPosted(false); setAnnTitle(""); setAnnBody(""); setAnnUrgent(false); }, 2500);
  };

  const saveFlash = (fn) => { fn(); setAdminSaved(true); setTimeout(() => setAdminSaved(false), 2000); };

  const downloadDoc = (title, subtitle, articles) => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; font-size: 12pt; line-height: 1.8; color: #111; background: #fff; padding: 60px 80px; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 8px; letter-spacing: .02em; }
    h2 { font-size: 12pt; font-weight: normal; text-align: center; color: #555; margin-bottom: 10px; letter-spacing: .06em; }
    .meta { text-align: center; color: #888; font-size: 10pt; margin-bottom: 40px; }
    hr { border: none; border-top: 2px solid #111; margin: 0 0 40px; }
    .article { margin-bottom: 36px; page-break-inside: avoid; }
    .art-label { font-size: 9pt; font-family: Arial, sans-serif; color: #999; text-transform: uppercase; letter-spacing: .15em; margin-bottom: 4px; }
    h3 { font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-bottom: 14px; }
    p { margin-bottom: 8px; }
    .print-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #1a1208; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .print-bar span { color: #c4b08a; font-family: Arial, sans-serif; font-size: 13px; }
    .print-btn { padding: 10px 28px; background: linear-gradient(135deg, #a06b18, #c9922a); color: #1a0f00; border: none; border-radius: 6px; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; letter-spacing: .08em; cursor: pointer; }
    .print-btn:hover { background: #a06b18; color: #fff; }
    @media print { .print-bar { display: none; } body { padding: 0; } @page { margin: 0.9in; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <h2>${subtitle}</h2>
  <p class="meta">${articles.length} Articles</p>
  <hr/>
  ${articles.map(a => `
    <div class="article">
      <p class="art-label">Article ${a.id}</p>
      <h3>${a.title}</h3>
      ${a.body.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('')}
    </div>
  `).join('')}
  <div class="print-bar">
    <span>${title}</span>
    <button class="print-btn" onclick="window.print()">🖨 PRINT / SAVE AS PDF</button>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── MICRO COMPONENTS ──
  const Tog = ({ on, flip }) => (
    <div onClick={flip} style={{ width: 44, height: 26, borderRadius: 13, background: on ? "linear-gradient(135deg,#a06b18,#c9922a)" : "var(--leather3)", border: `1px solid ${on ? "var(--gold)" : "var(--seam)"}`, position: "relative", cursor: "pointer", flexShrink: 0, transition: "all .2s" }}>
      <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: on ? "#1a0f00" : "var(--text3)", transition: "left .2s" }} />
    </div>
  );

  const BackBar = ({ title }) => (
    <div style={{ background: "var(--leather)", padding: "12px 16px", ...row("center", 0), justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
      <button onClick={() => setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>
        ← BACK
      </button>
      <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>{title}</span>
      <button onClick={() => { setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
        <SectionIcon icon="home" size={16} />
      </button>
    </div>
  );

  const StatusBadge = ({ s }) => {
    const map = { open: ["var(--gold)", "rgba(201,146,42,0.1)", "SUBMITTED"], review: ["var(--blue)", "rgba(37,99,168,0.15)", "IN REVIEW"], resolved: ["var(--green)", "rgba(45,122,79,0.15)", "RESOLVED"] };
    const [color, bg, txt] = map[s] || map.open;
    return <span style={{ ...f(10, 700), color, background: bg, padding: "3px 9px", borderRadius: 20, border: `1px solid ${color}44` }}>{txt}</span>;
  };

  const GoldDivider = () => <div className="gold-rule" style={{ margin: "16px 0" }} />;

  // ── CONFIRM MODAL ──
  const ConfirmModal2 = () => {
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

  // ── TOAST / UNDO ──
  const Toast2 = () => {
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

  // Auto-dismiss toast
  useEffect(() => { if (toastMsg) { const t = setTimeout(() => setToastMsg(null), 5000); return () => clearTimeout(t); } }, [toastMsg]);

  // ── WHAT'S NEW POPUP ──
  const WhatsNewPopup = () => {
    if (!showWhatsNew) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} className="fade">
        <div style={{ ...card({ padding: "28px 24px" }), maxWidth: 340, width: "88%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", textAlign: "center" }}>
          <div style={{ ...f(36, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".08em", marginBottom: 4 }}>WHAT'S NEW</div>
          <div className="gold-rule" style={{ marginBottom: 16 }} />
          <div style={{ ...col(10), textAlign: "left", marginBottom: 20 }}>
            <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--gold)", fontWeight: 600, fontStyle: "normal" }}>Action Dashboard</span> — <span style={{ fontStyle: "italic" }}>officers see what needs attention in one place.</span>
            </div>
            <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--gold)", fontWeight: 600, fontStyle: "normal" }}>Undo Support</span> — <span style={{ fontStyle: "italic" }}>deleted something by accident? Hit undo within 5 seconds.</span>
            </div>
            <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--gold)", fontWeight: 600, fontStyle: "normal" }}>Settings</span> — <span style={{ fontStyle: "italic" }}>dark/light mode, EN/ES language, and notification controls.</span>
            </div>
          </div>
          <button onClick={() => setShowWhatsNew(false)} style={btnGold()}>GOT IT!</button>
        </div>
      </div>
    );
  };

  // ── LOADING SKELETON COMPONENTS ──
  const SkeletonCard = ({ lines = 3, avatar = false }) => (
    <div style={{ ...card({ padding: "16px 14px", marginBottom: 12 }), display: "flex", gap: 12, alignItems: "flex-start" }}>
      {avatar && <div className="skeleton-circle" style={{ width: 38, height: 38, flexShrink: 0 }} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="skeleton-line" style={{ width: "60%", height: 16 }} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div key={i} className="skeleton-line" style={{ width: i === lines - 2 ? "40%" : "90%", height: 12 }} />
        ))}
      </div>
    </div>
  );

  const SkeletonList = ({ count = 4, avatar = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={i % 2 === 0 ? 3 : 2} avatar={avatar} />
      ))}
    </div>
  );

  const SkeletonGrid = ({ count = 6 }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-rect" style={{ height: 90 }} />
      ))}
    </div>
  );

  // ── OFFLINE BANNER ──
  const OfflineBanner = () => {
    if (!isOffline) return null;
    return (
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000, background: "linear-gradient(135deg, #8b2500, #a03000)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, animation: "offline-pulse 2s ease-in-out infinite" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
        <span style={{ ...f(11, 600), color: "#fff", letterSpacing: ".06em", textTransform: "uppercase" }}>You're offline — some features may be unavailable</span>
      </div>
    );
  };

  // ── OFFLINE ACTION MESSAGE OVERLAY ──
  const OfflineMessageOverlay = () => {
    if (!showOfflineMessage) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10001, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowOfflineMessage(false)}>
        <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(135deg, #1c1410, #2a1a12)", border: "1px solid rgba(201,146,42,0.25)", borderRadius: 16, padding: "32px 24px", maxWidth: 340, width: "100%", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(139,37,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          </div>
          <div style={{ ...f(20, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>NO CONNECTION</div>
          <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>
            You're currently offline. This action requires an internet connection. Please check your connection and try again.
          </div>
          <button onClick={() => setShowOfflineMessage(false)} style={{ ...f(14, 400, 'bebas'), background: "linear-gradient(135deg, var(--gold), #b8860b)", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 32px", cursor: "pointer", letterSpacing: ".1em" }}>GOT IT</button>
        </div>
      </div>
    );
  };

  // ── SESSION TIMEOUT WARNING MODAL ──
  const SessionWarningModal = () => {
    if (!showSessionWarning || !loggedIn) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10002, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "linear-gradient(135deg, #1c1410, #2a1a12)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 16, padding: "32px 24px", maxWidth: 360, width: "100%", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(201,146,42,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div style={{ ...f(20, 400, 'bebas'), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>SESSION EXPIRING</div>
          <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>
            You've been inactive for a while. Your session will expire shortly for security. Move your mouse, tap the screen, or press any key to stay logged in.
          </div>
          <button onClick={() => setShowSessionWarning(false)} style={{ ...f(14, 400, 'bebas'), background: "linear-gradient(135deg, var(--gold), #b8860b)", color: "#1a0e08", border: "none", borderRadius: 8, padding: "10px 32px", cursor: "pointer", letterSpacing: ".1em" }}>I'M STILL HERE</button>
        </div>
      </div>
    );
  };

  // ── UPDATE BANNER ──
  const UpdateBanner = () => {
    if (!showUpdateBanner || !loggedIn) return null;
    return (
      <div style={{ position: "fixed", top: isOffline ? 36 : 0, left: 0, right: 0, zIndex: 9997, background: "linear-gradient(135deg, #1a3a1a, #2d5a2d)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderBottom: "1px solid rgba(100,200,100,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🎉</span>
          <span style={{ ...f(11, 600), color: "#a8e6a8", letterSpacing: ".06em", textTransform: "uppercase" }}>App updated to v{APP_VERSION}</span>
        </div>
        <button onClick={dismissUpdateBanner} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 10px", ...f(10, 600, 'bebas'), color: "#a8e6a8", cursor: "pointer", letterSpacing: ".08em" }}>DISMISS</button>
      </div>
    );
  };

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

  // ── TERMS OF USE PAGE ──
  const TermsPage = () => (
    <div style={{ ...col(0), height: "100%", overflow: "hidden" }}>
      <div style={{ ...row("center", 10), padding: "16px 14px 10px", borderBottom: "1px solid var(--seam)" }}>
        <button onClick={() => setSub(null)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", ...f(22, 400, 'bebas'), letterSpacing: ".06em" }}>← BACK</button>
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

  // ── PRIVACY POLICY PAGE ──
  const PrivacyPage = () => (
    <div style={{ ...col(0), height: "100%", overflow: "hidden" }}>
      <div style={{ ...row("center", 10), padding: "16px 14px 10px", borderBottom: "1px solid var(--seam)" }}>
        <button onClick={() => setSub(null)} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", ...f(22, 400, 'bebas'), letterSpacing: ".06em" }}>← BACK</button>
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

  // ── SETTINGS PANEL (slide-out) ──
  const SettingsPanel2 = () => {
    if (!showSettingsPanel) return null;
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9990, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={() => setShowSettingsPanel(false)}>
        <div style={{ width: 300, maxWidth: "82%", background: "var(--leather)", height: "100%", padding: "24px 18px", overflowY: "auto", boxShadow: "-4px 0 30px rgba(0,0,0,0.4)", borderLeft: "1px solid var(--seam)" }} onClick={e => e.stopPropagation()}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ ...f(24, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>SETTINGS</div>
            <button onClick={() => setShowSettingsPanel(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", ...f(20, 400) }}>×</button>
          </div>
          <div style={{ ...col(0) }}>
            {[
              { label: "Dark Mode", desc: "Switch between dark and light themes", value: darkMode, onChange: () => setDarkMode(!darkMode) },
              { label: "Notifications", desc: "Meeting reminders & announcements", value: notifs.announcements, onChange: () => setNotifs(n => ({ ...n, announcements: !n.announcements, meetings: !n.meetings })) },
            ].map((item, i) => (
              <div key={i} style={{ ...row("center", 0), justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--seam)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ ...f(14, 600), color: "var(--text)" }}>{item.label}</div>
                  <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{item.desc}</div>
                </div>
                <Tog on={item.value} flip={item.onChange} />
              </div>
            ))}
            <div style={{ ...row("center", 0), justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--seam)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(14, 600), color: "var(--text)" }}>Language</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>Switch between English and Spanish</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid var(--seam)" }}>
                {["en", "es"].map(l => (
                  <div key={l} onClick={() => setLang(l)} style={{ padding: "6px 14px", background: lang === l ? "var(--gold)" : "var(--leather2)", color: lang === l ? "#1a0f00" : "var(--text3)", ...f(12, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button onClick={() => { logoutUser(); setLoggedIn(false); setRole("member"); setCurrentUserEmail(""); setEmail(""); setPassword(""); setShowSettingsPanel(false); setCurrentUid(null); setUserProfile(null); }} style={{ ...btnOutline, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%" }}>
              <SectionIcon icon="logout" size={15} /> SIGN OUT
            </button>
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 16, justifyContent: "center" }}>
            <span onClick={() => { setShowSettingsPanel(false); setSub({ type: "terms" }); }} style={{ ...f(11, 400, 'serif'), color: "var(--text3)", cursor: "pointer", textDecoration: "underline", fontStyle: "italic" }}>Terms of Use</span>
            <span onClick={() => { setShowSettingsPanel(false); setSub({ type: "privacy" }); }} style={{ ...f(11, 400, 'serif'), color: "var(--text3)", cursor: "pointer", textDecoration: "underline", fontStyle: "italic" }}>Privacy Policy</span>
          </div>
          <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", textAlign: "center", marginTop: 12, fontStyle: "italic", opacity: 0.6 }}>DWA App v{APP_VERSION}</div>
        </div>
      </div>
    );
  };

  const SectionIcon = ({ icon, size = 22 }) => {
    const icons = {
      home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
      alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L12.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
      file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
      phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.07-1.07a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
      message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
      calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
      check: <polyline points="20,6 9,17 4,12" strokeWidth="2.5" />,
      bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
      logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
      search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
      shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
      user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
      info: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
      folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
      video: <><polygon points="23,7 16,12 23,17 23,7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
      clip: <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
      notes: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
      gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    };
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
        {icons[icon]}
      </svg>
    );
  };

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

  // ── SUB SCREENS ──
  if (sub) {
    if (sub.type === "terms") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <TermsPage />
          </div>
        </>
      );
    }
    if (sub.type === "privacy") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <PrivacyPage />
          </div>
        </>
      );
    }
    if (sub.type === "form-preview") {
      const d = sub.data;
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>← BACK</button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>{d.name}</span>
              <button onClick={() => { setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {/* iframe preview */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#e5e5e5" }}>
              <iframe
                srcDoc={d.formHtml}
                style={{ width: "680px", height: "900px", border: "none", background: "#fff", transform: "scale(var(--form-scale, 0.55))", transformOrigin: "top center", position: "absolute", left: "50%", top: 0, marginLeft: "-340px" }}
                title={d.name}
                ref={el => {
                  if (el && el.parentElement) {
                    const scale = el.parentElement.clientWidth / 680;
                    el.style.transform = `scale(${scale})`;
                    el.style.height = (el.parentElement.clientHeight / scale) + "px";
                  }
                }}
              />
            </div>
            {/* Download bar */}
            <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(13, 600), color: "var(--text)" }}>{d.name}</div>
                <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>Download to print or fill out</div>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([d.formHtml], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `${d.name.replace(/[^a-z0-9]/gi,'_')}.html`; a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{ padding: "10px 18px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                DOWNLOAD & PRINT
              </button>
            </div>
          </div>
        </>
      );
    }

    if (sub.type === "doc-preview") {
      const d = sub.data;
      const isPdf = (d.fileType || "").toLowerCase() === "pdf";
      const isImage = ["png","jpg","jpeg","gif","webp"].includes((d.fileType || "").toLowerCase());
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>← BACK</button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
              <button onClick={() => { setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {/* Preview area */}
            <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: darkMode ? "#1a1610" : "#e8e4dc", padding: 16 }}>
              {isImage ? (
                <img src={d.fileUrl} alt={d.name} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }} />
              ) : isPdf ? (
                <iframe src={d.fileUrl} style={{ width: "100%", height: "100%", border: "none", borderRadius: 8, background: "#fff" }} title={d.name} />
              ) : (
                <div style={{ textAlign: "center", ...col(12), alignItems: "center", padding: "40px 20px" }}>
                  <div style={{ width: 80, height: 90, borderRadius: 12, background: "var(--leather2)", border: "1px solid var(--seam)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16 }}>
                    <SectionIcon icon="file" size={28} />
                    <span style={{ ...f(11, 800), color: "var(--text3)", letterSpacing: ".06em" }}>{(d.fileType || "FILE").toUpperCase()}</span>
                  </div>
                  <div style={{ ...f(16, 600), color: "var(--cream)", marginBottom: 4 }}>{d.name}</div>
                  <div style={{ ...f(12, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>{d.category} · {d.size}</div>
                  <div style={{ ...f(12, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Preview not available for this file type.</div>
                  <div style={{ ...f(12, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Download to view.</div>
                </div>
              )}
            </div>
            {/* Download bar */}
            <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(13, 600), color: "var(--text)" }}>{d.name}</div>
                <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{d.category} · {d.size} · Updated {d.updated}</div>
              </div>
              <a
                href={d.fileUrl} download={d.name}
                style={{ padding: "10px 18px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, textDecoration: "none" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                DOWNLOAD
              </a>
            </div>
          </div>
        </>
      );
    }

    if (sub.type === "bylaws") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => activeBylawArticle ? setActiveBylawArticle(null) : setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>
                {activeBylawArticle ? "← ARTICLES" : "← BACK"}
              </button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>
                {activeBylawArticle ? `Article ${activeBylawArticle.id}` : "Union Bylaws"}
              </span>
              <button onClick={() => { setActiveBylawArticle(null); setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {!activeBylawArticle ? (
              <div className="scroll rise" style={{ flex: 1 }}>
                <div style={{ padding: "20px 16px 8px", background: "linear-gradient(180deg, rgba(201,146,42,0.06) 0%, transparent 100%)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(28, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".06em" }}>UNION BYLAWS</div>
                      <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>Dairy Workers Association Constitution & By-Laws</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>11 Articles</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)" }}>
                      {["en", "es"].map(l => (
                        <div key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: lang === l ? "var(--gold)" : "transparent", color: lang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginBottom: 12 }} />
                  {/* Full document download card */}
                  <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 48, borderRadius: 8, background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, flexShrink: 0 }}>
                      <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M11 1H3C1.9 1 1 1.9 1 3V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V7L11 1Z" stroke="var(--gold)" strokeWidth="1.5" fill="none"/><path d="M11 1V7H17" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="13" y2="12" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/><line x1="5" y1="15" x2="10" y2="15" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span style={{ ...f(8, 800), color: "var(--gold)", letterSpacing: ".06em" }}>DOC</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(14, 600), color: "var(--cream)" }}>{lang === "es" ? "Documento Completo de Estatutos" : "Full Bylaws Document"}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{lang === "es" ? "11 artículos · Descargar como HTML" : "All 11 articles · Download as HTML file"}</div>
                    </div>
                    <button
                      onClick={() => downloadDoc("DWA Union Bylaws", "Dairy Workers Association Constitution & By-Laws", lang === "en" ? BYLAWS_ARTICLES : BYLAWS_ARTICLES_ES)}
                      style={{ flexShrink: 0, padding: "9px 14px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(11, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      DOWNLOAD
                    </button>
                  </div>
                </div>
                <div style={{ padding: "0 14px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {(lang === "en" ? BYLAWS_ARTICLES : BYLAWS_ARTICLES_ES).map((art) => (
                    <div key={art.id} onClick={() => setActiveBylawArticle(art)} className="tile"
                      style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", ...f(14, 700, 'bebas'), color: "var(--gold)", flexShrink: 0 }}>{art.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...f(14, 600), color: "var(--text)" }}>{art.title}</div>
                        <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>Article {art.id}</div>
                      </div>
                      <div style={{ ...f(12, 700), color: "var(--gold)" }}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (() => {
              const articles = lang === "en" ? BYLAWS_ARTICLES : BYLAWS_ARTICLES_ES;
              const idx = articles.findIndex(a => a.id === activeBylawArticle.id);
              const prev = idx > 0 ? articles[idx - 1] : null;
              const next = idx < articles.length - 1 ? articles[idx + 1] : null;
              return (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid var(--seam)", flexShrink: 0 }}>
                    <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase" }}>Article {activeBylawArticle.id} of {articles.length}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{idx + 1} / {articles.length}</div>
                    </div>
                    <div style={{ ...f(26, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".04em" }}>{activeBylawArticle.title}</div>
                    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginTop: 12 }} />
                  </div>
                  <div className="scroll" style={{ flex: 1, padding: "14px 16px 24px" }}>
                    <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "18px" }}>
                      {activeBylawArticle.body.split('\n').filter(Boolean).map((line, i) => (
                        <p key={i} style={{ ...f(14, 400, 'serif'), color: "var(--text2)", lineHeight: 1.75, marginBottom: line.trim() === "" ? 0 : 10 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", display: "flex" }}>
                    <button onClick={() => { if (prev) setActiveBylawArticle(prev); }} disabled={!prev}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", borderRight: "1px solid var(--seam)", cursor: prev ? "pointer" : "default", opacity: prev ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--gold)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Previous</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prev?.title || ""}</div>
                      </div>
                    </button>
                    <button onClick={() => { if (next) setActiveBylawArticle(next); }} disabled={!next}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", cursor: next ? "pointer" : "default", opacity: next ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, color: "var(--gold)" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Next</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next?.title || ""}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      );
    }

    if (sub.type === "cba") {
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)", position: "relative", overflow: "hidden" }}>
            <div style={{ background: "var(--leather)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
              <button onClick={() => activeArticle ? setActiveArticle(null) : setSub(null)} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>
                {activeArticle ? "← ARTICLES" : "← BACK"}
              </button>
              <span style={{ ...f(11, 600), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>
                {activeArticle ? `Article ${activeArticle.id}` : "Union Contract"}
              </span>
              <button onClick={() => { setActiveArticle(null); setSub(null); setTab("home"); }} style={{ width: 30, height: 30, background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}>
                <SectionIcon icon="home" size={16} />
              </button>
            </div>
            {!activeArticle ? (
              <div className="scroll rise" style={{ flex: 1 }}>
                <div style={{ padding: "20px 16px 8px", background: "linear-gradient(180deg, rgba(201,146,42,0.06) 0%, transparent 100%)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(28, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".06em" }}>UNION CONTRACT</div>
                      <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>Collective Bargaining Agreement 2025–2028</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>17 Articles</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)" }}>
                      {["en", "es"].map(l => (
                        <div key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: lang === l ? "var(--gold)" : "transparent", color: lang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginBottom: 12 }} />
                  {/* Full document download card */}
                  <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 48, borderRadius: 8, background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, flexShrink: 0 }}>
                      <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M11 1H3C1.9 1 1 1.9 1 3V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V7L11 1Z" stroke="var(--gold)" strokeWidth="1.5" fill="none"/><path d="M11 1V7H17" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="13" y2="12" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/><line x1="5" y1="15" x2="10" y2="15" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span style={{ ...f(8, 800), color: "var(--gold)", letterSpacing: ".06em" }}>CBA</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(14, 600), color: "var(--cream)" }}>{lang === "es" ? "Documento Completo del Contrato" : "Full Contract Document"}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>{lang === "es" ? "17 artículos · Descargar como HTML" : "All 17 articles · Download as HTML file"}</div>
                    </div>
                    <button
                      onClick={() => downloadDoc("DWA Union Contract 2025-2028", "Collective Bargaining Agreement — Cream-O-Land Dairy & Dairy Workers Association", lang === "en" ? cbaArticlesData : cbaArticlesData_ES)}
                      style={{ flexShrink: 0, padding: "9px 14px", background: "linear-gradient(135deg,#a06b18,#c9922a)", border: "1px solid var(--gold)", borderRadius: 8, color: "#1a0f00", ...f(11, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      DOWNLOAD
                    </button>
                  </div>
                </div>
                <div style={{ padding: "0 14px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {cbaArticlesData.map((art) => (
                    <div key={art.id} onClick={() => setActiveArticle(art)} className="tile"
                      style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", ...f(14, 700, 'bebas'), color: "var(--gold)", flexShrink: 0 }}>{art.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...f(14, 600), color: "var(--text)" }}>{art.title}</div>
                        <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>Article {art.id}</div>
                      </div>
                      <div style={{ ...f(12, 700), color: "var(--gold)" }}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (() => {
              const idx = cbaArticlesData.findIndex(a => a.id === activeArticle.id);
              const prev = idx > 0 ? cbaArticlesData[idx - 1] : null;
              const next = idx < cbaArticlesData.length - 1 ? cbaArticlesData[idx + 1] : null;
              return (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid var(--seam)", flexShrink: 0 }}>
                    <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".15em", textTransform: "uppercase" }}>Article {activeArticle.id} of {cbaArticlesData.length}</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{idx + 1} / {cbaArticlesData.length}</div>
                    </div>
                    <div style={{ ...f(26, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".04em" }}>{activeArticle.title}</div>
                    <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--seam), transparent)", marginTop: 12 }} />
                  </div>
                  <div className="scroll" style={{ flex: 1, padding: "14px 16px 24px" }}>
                    <div style={{ background: "var(--leather2)", border: "1px solid var(--seam)", borderRadius: 10, padding: "18px" }}>
                      {activeArticle.body.split('\n').filter(l => l.trim()).map((line, i) => (
                        <p key={i} style={{ ...f(14, 400, 'serif'), color: "var(--text2)", lineHeight: 1.75, marginBottom: 10 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, borderTop: "1px solid var(--seam)", background: "var(--leather)", display: "flex" }}>
                    <button onClick={() => { if (prev) setActiveArticle(prev); }} disabled={!prev}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", borderRight: "1px solid var(--seam)", cursor: prev ? "pointer" : "default", opacity: prev ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--gold)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Previous</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prev?.title || ""}</div>
                      </div>
                    </button>
                    <button onClick={() => { if (next) setActiveArticle(next); }} disabled={!next}
                      style={{ flex: 1, padding: "14px 10px", background: "none", border: "none", cursor: next ? "pointer" : "default", opacity: next ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, color: "var(--gold)" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ ...f(9, 700), color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase" }}>Next</div>
                        <div style={{ ...f(12, 600), color: "var(--text)", lineHeight: 1.2, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next?.title || ""}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      );
    }

    if (sub.type === "contact") return (
      <><style>{css}</style>
        <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
          <BackBar title="DWA Contacts" />
          <div className="scroll rise" style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ ...card({ padding: "13px 16px", borderLeft: "3px solid var(--gold)" }) }}>
              <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>
                Tap <strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Call</strong> or <strong style={{ color: "var(--gold)", fontStyle: "normal" }}>Text</strong> to reach your steward directly.
              </div>
            </div>
            {stewardsData.map((s, idx) => (
              <div key={s.id || idx} style={card({ padding: "16px" })}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: s.phone ? 14 : 0 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#a06b18,#c9922a)", display: "flex", alignItems: "center", justifyContent: "center", ...f(16, 700, 'bebas'), color: "#1a0f00", flexShrink: 0 }}>
                    {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...f(15, 600), color: "var(--text)" }}>{s.name}</div>
                    <div style={{ ...f(11, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 2 }}>{s.title}{s.dept ? ` · ${s.dept}` : ""}</div>
                  </div>
                </div>
                {s.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <a href={`tel:${s.phone}`} style={{ flex: 1, padding: "11px", borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", color: "var(--text2)", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...f(12, 700), letterSpacing: ".08em" }}>
                      <SectionIcon icon="phone" size={14} /> CALL
                    </a>
                    <a href={`sms:${s.phone}`} style={{ flex: 1, padding: "11px", borderRadius: 8, background: "var(--leather3)", border: "1px solid var(--seam)", color: "var(--text2)", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, ...f(12, 700), letterSpacing: ".08em" }}>
                      <SectionIcon icon="message" size={14} /> TEXT
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );

    if (sub.type === "ann") {
      const a = sub.data;
      const displayTitle = annLang === "es" && a.titleEs ? a.titleEs : a.title;
      const displayBody = annLang === "es" && a.bodyEs ? a.bodyEs : a.body;
      return (
        <><style>{css}</style>
          <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
            <BackBar title="Announcement" />
            <div className="scroll rise" style={{ padding: "24px 16px" }}>
              {a.urgent && <div className="urgent-pulse" style={{ ...f(10, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.3)", padding: "4px 10px", borderRadius: 6, display: "inline-block", marginBottom: 12, letterSpacing: ".15em" }}>⚡ URGENT</div>}
              <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ ...f(24, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".05em", lineHeight: 1.2 }}>{displayTitle}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)", flexShrink: 0 }}>
                  {["en", "es"].map(l => (
                    <div key={l} onClick={() => setAnnLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: annLang === l ? "var(--gold)" : "transparent", color: annLang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
                  ))}
                </div>
              </div>
              <div className="gold-rule" />
              <div style={{ ...f(15, 400, 'serif'), color: "var(--text2)", lineHeight: 1.75, marginTop: 20, whiteSpace: "pre-wrap" }}>{displayBody}</div>
              {annLang === "es" && !a.bodyEs && (
                <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 12 }}>Translation not available for this announcement.</div>
              )}
            </div>
          </div>
        </>
      );
    }

    if (sub.type === "my-grievances") return (
      <><style>{css}</style>
        <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
          <BackBar title="My Grievances" />
          <div className="scroll rise" style={{ padding: "16px", ...col(10) }}>
            {myGrievances.map(g => (
              <div key={g.id} style={{ ...card({ padding: "16px" }) }}>
                <div style={{ ...row("flex-start", 0), justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ ...f(14, 600), color: "var(--text)", flex: 1, paddingRight: 8, lineHeight: 1.3 }}>{g.type}</div>
                  <StatusBadge s={g.status} />
                </div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Filed {g.date}</div>
              </div>
            ))}
            {myGrievances.length === 0 && <div style={{ padding: "40px 0", textAlign: "center", ...f(13, 400, 'serif'), color: "var(--text3)" }}>No grievances filed yet.</div>}
          </div>
        </div>
      </>
    );

    if (sub.type === "settings") return (
      <><style>{css}</style>
        <div style={{ maxWidth: 430, margin: "0 auto", height: "100vh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "var(--ink)" }}>
          <BackBar title="Notifications" />
          <div className="scroll rise" style={{ padding: "16px", ...col(12) }}>
            <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Notification Preferences</div>
            {[
              { key: "meetings", label: "Meeting Reminders", desc: "Upcoming union meetings and events" },
              { key: "announcements", label: "Announcements", desc: "News and important updates from leadership" },
              { key: "grievances", label: "Grievance Updates", desc: "Status changes on your grievances" },
            ].map(item => (
              <div key={item.key} style={{ ...card({ padding: "16px" }), ...row("center", 0), justifyContent: "space-between" }}>
                <div>
                  <div style={{ ...f(14, 600), color: "var(--text)" }}>{item.label}</div>
                  <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", marginTop: 3, fontStyle: "italic" }}>{item.desc}</div>
                </div>
                <Tog on={notifs[item.key]} flip={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── MAIN SCREENS ──
  const Home = () => (
    <div className="rise">
      <div style={{ padding: "32px 20px 24px", ...col(0), alignItems: "center", borderBottom: "1px solid var(--seam)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(201,146,42,0.1) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
        <img src={LOGO_B64} alt="DWA" style={{ width: "min(150px, 36vw)", objectFit: "contain", position: "relative" }} />
      </div>
      {/* Install App Banner — Android / Chrome (auto-install) */}
      {showInstallBanner && (
        <div style={{ margin: "12px 14px 0" }}>
          <div style={{ ...card({ padding: "18px 16px" }), background: "linear-gradient(135deg, rgba(201,146,42,0.12), rgba(201,146,42,0.04))", border: "1.5px solid var(--gold)", position: "relative" }}>
            <div onClick={() => setShowInstallBanner(false)} style={{ position: "absolute", top: 10, right: 12, cursor: "pointer", color: "var(--text3)", ...f(18, 400), lineHeight: 1 }}>&times;</div>
            <div style={{ ...f(16, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em", marginBottom: 14, textAlign: "center" }}>Install the App</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid var(--seam)" }}>
                <img src="/images/dwa-pwa-192.png" alt="DWA" style={{ width: "100%", height: "100%" }} />
              </div>
              <div>
                <div style={{ ...f(14, 700), color: "var(--cream)", letterSpacing: ".02em" }}>DWA Union</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>dwaunion.com</div>
              </div>
            </div>
            <button onClick={handleInstallClick} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#a06b18,#c9922a,#e8b84b)", border: "none", borderRadius: 10, color: "#1a0f00", ...f(14, 700, 'bebas'), letterSpacing: ".12em", cursor: "pointer" }}>INSTALL APP</button>
          </div>
        </div>
      )}
      {/* iOS Safari Install Guide (step-by-step) */}
      {showIOSInstallGuide && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "var(--leather)", borderTop: "1px solid var(--seam)", borderRadius: "16px 16px 0 0", padding: "20px 20px 28px", boxShadow: "0 -4px 24px rgba(0,0,0,0.5)", maxWidth: 430, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ ...f(16, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>Install the App</div>
            <div onClick={() => { setShowIOSInstallGuide(false); try { localStorage.setItem("dwa_ios_install_dismissed", "1"); } catch(e){} }} style={{ cursor: "pointer", color: "var(--text3)", ...f(20, 400), lineHeight: 1 }}>&times;</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0, border: "1px solid var(--seam)" }}>
              <img src="/images/dwa-pwa-192.png" alt="DWA" style={{ width: "100%", height: "100%" }} />
            </div>
            <div>
              <div style={{ ...f(14, 700), color: "var(--cream)", letterSpacing: ".02em" }}>DWA Union</div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 2 }}>dwaunion.com</div>
            </div>
          </div>
          <div style={{ ...col(16) }}>
            <div style={{ ...row("center", 10) }}>
              <span style={{ ...f(15, 700), color: "var(--gold)", width: 24 }}>1.</span>
              <span style={{ ...f(13, 400, 'serif'), color: "var(--text)" }}>Press </span>
              <span style={{ display: "inline-flex", padding: "3px 6px", background: "rgba(255,255,255,0.1)", borderRadius: 6, verticalAlign: "middle" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </span>
              <span style={{ ...f(13, 400, 'serif'), color: "var(--text)" }}> in the browser toolbar</span>
            </div>
            <div style={{ ...row("center", 10), marginTop: 14 }}>
              <span style={{ ...f(15, 700), color: "var(--gold)", width: 24 }}>2.</span>
              <span style={{ ...f(13, 400, 'serif'), color: "var(--text)" }}>Scroll down and tap </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                <span style={{ ...f(12, 600), color: "var(--cream)" }}>Add to Home Screen</span>
              </span>
            </div>
          </div>
        </div>
      )}
      <div style={{ margin: "12px 14px 0" }}>
        <div style={{ ...card({ padding: "14px 16px", borderLeft: "3px solid var(--gold)" }), display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--gold-dim)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
            <SectionIcon icon="calendar" size={20} />
          </div>
          <div>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Next Meeting</div>
            <div style={{ ...f(15, 600), color: "var(--text)", marginTop: 2 }}>{nextMeeting.title}</div>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--gold)", marginTop: 2, fontStyle: "italic" }}>{nextMeeting.date} · {nextMeeting.time} · {nextMeeting.location}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Announcements", sub: "News & updates", icon: "bell", action: () => setTab("announcements") },
          { label: "Documents", sub: "Contracts & files", icon: "folder", action: () => setTab("documents") },
          { label: "DWA Contacts", sub: "Officers & stewards", icon: "phone", action: () => setSub({ type: "contact" }) },
          { label: "Join Zoom Meeting", sub: "Union meeting room", icon: "video", action: () => setTab("zoom") },
          { label: "Meeting Minutes", sub: "Summaries & notes", icon: "notes", action: () => setTab("minutes") },
          { label: "Seniority", sub: "Members by hire date", icon: "shield", action: () => setTab("seniority") },
          { label: "Submit Grievance", sub: "Report a workplace issue", icon: "alert", action: () => setTab("grievance") },
          { label: "The Floor", sub: "Talk with your union", icon: "message", action: () => setTab("theFloor") },
        ].map(q => (
          <div key={q.label} className="tile" onClick={q.action} style={{
            ...tileStyle(),
            borderRadius: 10, padding: "16px 14px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
              <SectionIcon icon={q.icon} size={22} />
            </div>
            <div>
              <div style={{ ...f(14, 700, 'bebas'), color: "var(--cream)", letterSpacing: ".04em" }}>{q.label}</div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 3, fontStyle: "italic" }}>{q.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── THE FLOOR (Discussion Forum) ──
  const formatFloorTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const RoleBadge = ({ role: r }) => {
    if (r === "officer") return <span style={{ ...f(9, 700), color: "#c4a44e", background: "#3d2a08", padding: "1px 7px", borderRadius: 10, letterSpacing: ".05em" }}>OFFICER</span>;
    if (r === "steward") return <span style={{ ...f(9, 700), color: "#e8b84b", background: "#2a1f0a", padding: "1px 7px", borderRadius: 10, letterSpacing: ".05em" }}>STEWARD</span>;
    return null;
  };

  const LocationTag = ({ loc }) => {
    const isFlorence = loc === "Florence";
    return <span style={{ ...f(9, 600), color: isFlorence ? "#7ab87a" : "#9b8ec4", background: isFlorence ? "#1a2a1a" : "#1f1a2a", padding: "1px 7px", borderRadius: 10, letterSpacing: ".03em" }}>{isFlorence ? "FLR" : "JC"}</span>;
  };

  const handleFloorPost = async () => {
    if (isCurrentUserBanned) {
      setToastMsg({ message: "You've been suspended from The Floor." });
      return;
    }
    const text = floorPostRef.current?.value?.trim();
    if (!text && !floorPhoto) return;
    if (floorPostRef.current) floorPostRef.current.value = "";
    setFloorPosting(true);
    try {
      let photoURL = null;
      if (floorPhoto) {
        photoURL = await uploadFloorPhoto(floorPhoto);
      }
      await createFloorPost({
        author: currentUserName,
        uid: currentUid,
        location: currentUserLocation,
        role: currentUserRole,
        text: text || "",
        photoURL,
      });
      setFloorPhoto(null);
      setFloorPhotoPreview(null);
    } catch (e) {
      console.error("Failed to post:", e);
      setToastMsg({ message: "Failed to post. Try again." });
    } finally {
      setFloorPosting(false);
    }
  };

  const handleFloorPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToastMsg({ message: "Photo must be under 5MB." });
      return;
    }
    setFloorPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFloorPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleBanUser = (authorName, postId) => {
    setConfirmModal({
      title: `Ban ${authorName}?`,
      message: `${authorName} will no longer be able to post on The Floor. They can still use the app. An officer can unban them later.`,
      danger: true,
      onConfirm: async () => {
        try {
          await banUser({ name: authorName, bannedBy: currentUserName });
          if (postId) await deleteFloorPost(postId);
          setToastMsg({ message: `${authorName} banned from The Floor` });
        } catch (e) {
          console.error("Failed to ban:", e);
          setToastMsg({ message: "Failed to ban. Try again." });
        }
      }
    });
  };

  const handleUnbanUser = (userName) => {
    setConfirmModal({
      title: `Unban ${userName}?`,
      message: `${userName} will be able to post on The Floor again.`,
      onConfirm: async () => {
        try {
          await unbanUser(userName);
          setToastMsg({ message: `${userName} unbanned` });
        } catch (e) {
          console.error("Failed to unban:", e);
          setToastMsg({ message: "Failed to unban. Try again." });
        }
      }
    });
  };

  const handleFloorReply = async (postId) => {
    const text = floorReplyRef.current?.value?.trim();
    if (!text) return;
    if (floorReplyRef.current) floorReplyRef.current.value = "";
    setFloorReplyTo(null);
    try {
      await addFloorReply(postId, {
        author: currentUserName,
        location: currentUserLocation,
        role: currentUserRole,
        text,
      });
    } catch (e) {
      console.error("Failed to reply:", e);
      setToastMsg({ message: "Failed to reply. Try again." });
    }
  };

  const handleFloorDelete = (postId, replyId) => {
    setConfirmModal({
      title: "Delete this post?",
      message: "This will remove the post from The Floor.",
      danger: true,
      onConfirm: async () => {
        try {
          if (replyId) {
            const post = floorPosts.find(p => p.id === postId);
            const replyToDelete = post?.replies?.find(r => r.id === replyId);
            if (replyToDelete) await deleteFloorReply(postId, replyToDelete);
            setToastMsg({ message: "Reply deleted" });
          } else {
            await deleteFloorPost(postId);
            setToastMsg({ message: "Post deleted" });
          }
        } catch (e) {
          console.error("Failed to delete:", e);
          setToastMsg({ message: "Failed to delete. Try again." });
        }
      }
    });
  };

  const startFloorEdit = (post) => {
    setFloorEditingPost(post.id);
    setFloorEditText(post.text || "");
    setTimeout(() => floorEditRef.current?.focus(), 100);
  };

  const cancelFloorEdit = () => {
    setFloorEditingPost(null);
    setFloorEditText("");
  };

  const handleFloorEditSave = async (postId) => {
    const newText = (floorEditRef.current?.value || "").trim();
    if (!newText) {
      setToastMsg({ message: "Post can't be empty." });
      return;
    }
    try {
      await editFloorPost(postId, { text: newText, edited: true, editedAt: Date.now() });
      setFloorEditingPost(null);
      setFloorEditText("");
      setToastMsg({ message: "Post updated" });
    } catch (e) {
      console.error("Failed to edit:", e);
      setToastMsg({ message: "Failed to edit. Try again." });
    }
  };

  const TheFloor = () => (
    <div className="rise" style={{ padding: "16px 14px 30px", ...col(0) }}>
      <div style={{ ...card({ padding: "18px", marginBottom: 16 }), textAlign: "center" }}>
        <div style={{ ...f(22, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>THE FLOOR</div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>Talk with your union</div>
        <div className="gold-rule" style={{ marginTop: 12, marginBottom: 0 }} />
      </div>

      {/* Section 7 Welcome */}
      <div style={{ ...card({ padding: "16px 14px", marginBottom: 16, borderLeft: "3px solid var(--gold)" }) }}>
        <div style={{ ...row("center", 8), marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #a06b18, #c9922a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <SectionIcon icon="shield" size={16} />
          </div>
          <div style={{ ...f(13, 700), color: "var(--gold)", letterSpacing: ".06em" }}>YOUR RIGHTS UNDER THE LAW</div>
        </div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.7, fontStyle: "italic" }}>
          <strong style={{ color: "var(--cream)", fontStyle: "normal" }}>Section 7 of the National Labor Relations Act</strong> guarantees that
          "Employees shall have the right to self-organization, to form, join, or assist labor organizations,
          to bargain collectively through representatives of their own choosing, and to engage in other concerted
          activities for the purpose of collective bargaining or other mutual aid or protection."
        </div>
        <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", marginTop: 8 }}>This is your space. Speak freely. We stand together.</div>
      </div>

      {/* New post */}
      {isCurrentUserBanned ? (
        <div style={{ ...card({ padding: "16px", marginBottom: 20, borderLeft: "3px solid var(--red)" }) }}>
          <div style={{ ...f(13, 400, 'serif'), color: "var(--red)", fontStyle: "italic", lineHeight: 1.6 }}>
            You've been suspended from posting on The Floor. You can still read posts. Contact an officer if you believe this was a mistake.
          </div>
        </div>
      ) : (
      <div style={{ ...card({ padding: "14px", marginBottom: 20 }), ...col(10) }}>
        <div style={{ ...row("center", 8) }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ ...f(12, 600), color: "#c4a44e" }}>{getInitials(currentUserName)}</span>
          </div>
          <textarea
            ref={floorPostRef}
            style={{ ...inp(), minHeight: 48, resize: "vertical", lineHeight: 1.5, flex: 1 }}
            placeholder="What's on your mind?"
          />
        </div>
        <div style={{ ...row("center", 0), justifyContent: "flex-end", gap: 8 }}>
          <input ref={floorPhotoRef} type="file" accept="image/*" onChange={handleFloorPhotoSelect} style={{ display: "none" }} />
          <button onClick={() => floorPhotoRef.current?.click()} style={{ background: "none", border: "1px solid var(--seam)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "var(--text3)" }} title="Add photo">
            <SectionIcon icon="doc" size={14} />
            <span style={{ ...f(11, 400, 'bebas'), letterSpacing: ".06em" }}>PHOTO</span>
          </button>
          <button onClick={handleFloorPost} disabled={floorPosting} style={{ ...btnGold(), width: "auto", padding: "10px 24px", ...f(12, 400, 'bebas'), letterSpacing: ".1em", opacity: floorPosting ? 0.5 : 1 }}>{floorPosting ? "POSTING…" : "POST"}</button>
        </div>
        {floorPhotoPreview && (
          <div style={{ position: "relative", marginTop: 10 }}>
            <img src={floorPhotoPreview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, border: "1px solid var(--seam)" }} />
            <button onClick={() => { setFloorPhoto(null); setFloorPhotoPreview(null); if (floorPhotoRef.current) floorPhotoRef.current.value = ""; }} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", ...f(14, 700) }}>&times;</button>
          </div>
        )}
      </div>
      )}

      {/* Posts feed */}
      {floorLoading ? (
        <SkeletonList count={3} avatar={true} />
      ) : floorPosts.length === 0 ? (
        <div style={{ ...card({ padding: "24px", textAlign: "center" }) }}>
          <div style={{ ...f(14, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", lineHeight: 1.6 }}>No posts yet. Be the first to start a conversation.</div>
        </div>
      ) : (
      floorPosts.map(post => (
        <div key={post.id} style={{ ...card({ padding: "14px", marginBottom: 12 }) }}>
          {/* Post header */}
          <div style={{ ...row("center", 8), marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...f(12, 600), color: "#c4a44e" }}>{getInitials(post.author)}</span>
            </div>
            <div style={{ flex: 1, ...col(2) }}>
              <div style={{ ...row("center", 6) }}>
                <span style={{ ...f(13, 600), color: "var(--cream)" }}>{post.author}</span>
                <RoleBadge role={post.role} />
                <LocationTag loc={post.location} />
              </div>
              <span style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{formatFloorTime(post.time)}</span>
              <span style={{ ...f(9, 600), color: "var(--text3)", background: "var(--leather3)", padding: "1px 7px", borderRadius: 10, letterSpacing: ".03em" }}>Member since 2019</span>
            </div>
          </div>
          {/* Post body */}
          {post.text && <div style={{ ...f(13, 400, 'serif'), color: "var(--text)", lineHeight: 1.65, marginBottom: 4 }}>{post.text}</div>}
          {post.edited && (
            <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 8, opacity: 0.7 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 3, marginTop: -1 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              edited
            </div>
          )}
          {post.photoURL && (
            <div style={{ marginBottom: 10 }}>
              <img src={post.photoURL} alt="Post photo" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8, border: "1px solid var(--seam)", cursor: "pointer" }} onClick={() => window.open(post.photoURL, "_blank")} />
            </div>
          )}
          {/* Post actions */}
          <div style={{ ...row("center", 0), justifyContent: "space-between", borderTop: "1px solid var(--seam)", paddingTop: 8 }}>
            <div style={{ ...row("center", 12) }}>
              <span
                onClick={() => { setFloorReplyTo(floorReplyTo === post.id ? null : post.id); setFloorReplyText(""); }}
                style={{ ...f(12, 500), color: "var(--gold)", cursor: "pointer" }}
              >
                Reply{post.replies.length > 0 ? ` (${post.replies.length})` : ""}
              </span>
              {(post.author === currentUserName || post.uid === currentUid) && (
                <span
                  onClick={() => startFloorEdit(post)}
                  style={{ ...f(12, 500), color: "var(--text3)", cursor: "pointer" }}
                >
                  Edit
                </span>
              )}
            </div>
            {(isAdmin || isSteward) && (
              <div style={{ ...row("center", 6) }}>
                {post.author !== currentUserName && post.uid !== currentUid && !bannedUsers.some(b => b.name === post.author) && (
                  <span onClick={() => handleBanUser(post.author, post.id)} style={{ ...f(11, 600), color: "#e87a7a", cursor: "pointer", background: "#2a1010", padding: "3px 10px", borderRadius: 8 }}>Ban</span>
                )}
                <span onClick={() => handleFloorDelete(post.id)} style={{ ...f(11, 600), color: "#a04040", cursor: "pointer", background: "#2a1010", padding: "3px 10px", borderRadius: 8 }}>Delete</span>
              </div>
            )}
          </div>

          {/* Replies */}
          {post.replies.length > 0 && (
            <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: "2px solid rgba(201,146,42,0.15)" }}>
              {post.replies.map(reply => (
                <div key={reply.id} style={{ marginBottom: 10, paddingTop: 6 }}>
                  <div style={{ ...row("center", 6), marginBottom: 4 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: darkMode ? "#1c1208" : "#f0ebe0", border: darkMode ? "1px solid #3d3218" : "1px solid #d0c5a8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(9, 600), color: "#c4a44e" }}>{getInitials(reply.author)}</span>
                    </div>
                    <span style={{ ...f(12, 600), color: "var(--cream)" }}>{reply.author}</span>
                    <RoleBadge role={reply.role} />
                    <LocationTag loc={reply.location} />
                    <span style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginLeft: "auto" }}>{formatFloorTime(reply.time)}</span>
                  </div>
                  <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.6, paddingLeft: 32 }}>{reply.text}</div>
                  {(isAdmin || isSteward) && (
                    <div style={{ paddingLeft: 32, marginTop: 4 }}>
                      <span onClick={() => handleFloorDelete(post.id, reply.id)} style={{ ...f(10, 600), color: "#a04040", cursor: "pointer" }}>Delete</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          {floorReplyTo === post.id && (
            <div style={{ marginTop: 10, paddingLeft: 16, borderLeft: "2px solid rgba(201,146,42,0.3)", ...col(8) }}>
              <textarea
                ref={floorReplyRef}
                style={{ ...inp(), minHeight: 40, resize: "vertical", lineHeight: 1.5, fontSize: 12 }}
                placeholder="Write a reply..."
                autoFocus
              />
              <div style={{ ...row("center", 8), justifyContent: "flex-end" }}>
                <span onClick={() => setFloorReplyTo(null)} style={{ ...f(11, 500), color: "var(--text3)", cursor: "pointer" }}>Cancel</span>
                <button onClick={() => handleFloorReply(post.id)} style={{ ...btnGold(), width: "auto", padding: "7px 18px", ...f(11, 400, 'bebas'), letterSpacing: ".1em" }}>REPLY</button>
              </div>
            </div>
          )}
        </div>
      )))}

      {!floorLoading && floorPosts.length === 0 && null}
    </div>
  );

  const Grievance = () => {
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
  };

  const docFileIcon = (d) => {
    // returns color + label based on doc type hint
    if (d.fileType === "pdf" || d.name.toLowerCase().includes("form") || d.name.toLowerCase().includes("flyer")) return { color: "#e05c3a", bg: "rgba(224,92,58,0.12)", border: "rgba(224,92,58,0.25)", label: "PDF" };
    if (d.id === 1 || d.name.toLowerCase().includes("contract")) return { color: "var(--gold)", bg: "rgba(201,146,42,0.12)", border: "rgba(201,146,42,0.25)", label: "CBA" };
    if (d.id === 2 || d.name.toLowerCase().includes("bylaw")) return { color: "var(--gold2)", bg: "rgba(232,184,75,0.1)", border: "rgba(232,184,75,0.22)", label: "DOC" };
    if (d.fileType === "docx") return { color: "#4a9eff", bg: "rgba(74,158,255,0.1)", border: "rgba(74,158,255,0.22)", label: "DOC" };
    return { color: "var(--text3)", bg: "var(--leather3)", border: "var(--seam)", label: "FILE" };
  };

  const allDocCategories = ["All", ...Array.from(new Set(documents.map(d => d.category)))];

  const Documents = () => (
    <div className="rise">
      {/* Header bar */}
      <div style={{ padding: "16px 14px 0", background: "linear-gradient(180deg, rgba(201,146,42,0.05) 0%, transparent 100%)" }}>
        <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ ...f(22, 400, "bebas"), color: "var(--cream)", letterSpacing: ".06em" }}>DOCUMENTS</div>
          <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{filteredDocs.length} file{filteredDocs.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 10 }}>
          <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", pointerEvents: "none" }}>
            <SectionIcon icon="search" size={15} />
          </div>
          <input
            style={{ ...inp(), paddingLeft: 40, paddingRight: docSearch ? 36 : 14, fontSize: 13 }}
            placeholder="Search by name or category…"
            value={docSearch}
            onChange={e => setDocSearch(e.target.value)}
          />
          {docSearch && (
            <button onClick={() => setDocSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
          )}
        </div>

        {/* Category pills */}
        <div className="hscroll" style={{ display: "flex", gap: 6, paddingBottom: 12, overflowX: "auto" }}>
          {allDocCategories.map(cat => {
            const active = docCat === cat;
            const count = cat === "All" ? documents.length : documents.filter(d => d.category === cat).length;
            return (
              <div key={cat} onClick={() => setDocCat(cat)} style={{
                padding: "6px 13px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer",
                background: active ? "linear-gradient(135deg,#a06b18,#c9922a,#e8b84b)" : "var(--leather2)",
                border: `1px solid ${active ? "var(--gold)" : "var(--seam)"}`,
                color: active ? "#1a0f00" : "var(--text2)",
                ...f(11, 600), letterSpacing: ".06em",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                {cat}
                <span style={{ background: active ? "rgba(0,0,0,0.18)" : "var(--leather3)", borderRadius: 10, padding: "1px 6px", ...f(10, 700), color: active ? "#1a0f00" : "var(--text3)" }}>{count}</span>
              </div>
            );
          })}
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,var(--seam),transparent)", marginBottom: 12 }} />
      </div>

      {/* Document list */}
      <div style={{ padding: "0 14px 24px", ...col(8) }}>
        {filteredDocs.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", ...col(10), alignItems: "center" }}>
            <div style={{ color: "var(--text3)", marginBottom: 8 }}><SectionIcon icon="folder" size={32} /></div>
            <div style={{ ...f(14, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>No documents found.</div>
          </div>
        )}
        {filteredDocs.map(d => {
          const fi = docFileIcon(d);
          const isReadable = d.id === 1 || d.id === 2;
          const hasFile = !!d.fileUrl;
          const hasForm = !!d.formHtml;
          return (
            <div key={d.id} style={{ ...card({ padding: "0", overflow: "hidden" }) }}>
              {/* Top row */}
              <div
                className={(isReadable || hasForm || hasFile) ? "tile" : ""}
                onClick={() => {
                  if (d.id === 1) setSub({ type: "cba" });
                  else if (d.id === 2) setSub({ type: "bylaws" });
                  else if (hasForm) setSub({ type: "form-preview", data: d });
                  else if (hasFile) setSub({ type: "doc-preview", data: d });
                }}
                style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 13, cursor: (isReadable || hasForm || hasFile) ? "pointer" : "default" }}
              >
                {/* File type badge */}
                <div style={{
                  width: 48, height: 52, borderRadius: 8, flexShrink: 0,
                  background: fi.bg, border: `1px solid ${fi.border}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                }}>
                  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1H3C1.9 1 1 1.9 1 3V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V7L11 1Z" stroke={fi.color} strokeWidth="1.5" fill="none"/>
                    <path d="M11 1V7H17" stroke={fi.color} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="13" y2="12" stroke={fi.color} strokeWidth="1.2" strokeLinecap="round"/>
                    <line x1="5" y1="15" x2="10" y2="15" stroke={fi.color} strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ ...f(9, 800), color: fi.color, letterSpacing: ".06em" }}>{fi.label}</span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...f(14, 600), color: (isReadable || hasForm) ? "var(--cream)" : "var(--text)", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                  {d.desc && <div style={{ ...f(11, 400, "serif"), color: "var(--gold2)", marginTop: 2, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.desc}</div>}
                  <div style={{ ...row("center", 6), marginTop: 5, flexWrap: "wrap", gap: 4 }}>
                    <span style={{ ...f(10, 500), color: "var(--text3)", background: "var(--leather3)", border: "1px solid var(--seam)", borderRadius: 4, padding: "1px 7px", letterSpacing: ".06em" }}>{d.category}</span>
                    {d.size && d.size !== "—" && <span style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{d.size}</span>}
                    <span style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Updated {d.updated}</span>
                  </div>
                </div>
              </div>

              {/* Action strip */}
              <div style={{ borderTop: "1px solid var(--seam)", display: "flex" }}>
                {(isReadable || hasForm) && (
                  <button
                    onClick={() => {
                      if (d.id === 1) setSub({ type: "cba" });
                      else if (d.id === 2) setSub({ type: "bylaws" });
                      else if (hasForm) setSub({ type: "form-preview", data: d });
                    }}
                    style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", borderRight: "1px solid var(--seam)", cursor: "pointer", ...row("center", 6), justifyContent: "center", color: "var(--gold)", ...f(11, 700), letterSpacing: ".1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {hasForm ? "VIEW FORM" : "READ"}
                  </button>
                )}
                {hasFile ? (
                  <a
                    href={d.fileUrl} download={d.name}
                    style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", textDecoration: "none", cursor: "pointer", ...row("center", 6), justifyContent: "center", color: "var(--text2)", ...f(11, 700), letterSpacing: ".1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    DOWNLOAD
                  </a>
                ) : d.formHtml ? (
                  <button
                    onClick={() => {
                      const blob = new Blob([d.formHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = `${d.name.replace(/[^a-z0-9]/gi,'_')}.html`; a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", cursor: "pointer", ...row("center", 6), justifyContent: "center", color: "var(--gold)", ...f(11, 700), letterSpacing: ".1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    DOWNLOAD & PRINT
                  </button>
                ) : (
                  <div style={{ flex: 1, padding: "10px 8px", ...row("center", 6), justifyContent: "center", color: "var(--text3)", ...f(11, 500), letterSpacing: ".08em", fontStyle: "italic", fontFamily: "'Source Serif 4', serif" }}>
                    {isReadable ? "In-app only" : "No file attached"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Announcements = () => (
    <div className="rise" style={{ padding: "14px", ...col(10) }}>
      {/* Language toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)" }}>
          {["en", "es"].map(l => (
            <div key={l} onClick={() => setAnnLang(l)} style={{ padding: "5px 14px", borderRadius: 6, background: annLang === l ? "var(--gold)" : "transparent", color: annLang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase", letterSpacing: ".1em" }}>{l === "en" ? "English" : "Español"}</div>
          ))}
        </div>
      </div>
      {announcements.map(a => {
        const displayTitle = annLang === "es" && a.titleEs ? a.titleEs : a.title;
        const displayBody = annLang === "es" && a.bodyEs ? a.bodyEs : a.body;
        return (
          <div key={a.id} onClick={() => setSub({ type: "ann", data: a })} className="tile" style={{ ...card({ padding: "16px" }) }}>
            {a.urgent && <div className="urgent-pulse" style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", padding: "2px 8px", borderRadius: 4, display: "inline-block", marginBottom: 8, letterSpacing: ".15em" }}>⚡ URGENT</div>}
            <div style={{ ...f(16, 600), color: "var(--text)", lineHeight: 1.25 }}>{displayTitle}</div>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>{displayBody.slice(0, 120)}…</div>
            <div style={{ ...f(11, 700), color: "var(--gold)", marginTop: 12, letterSpacing: ".1em" }}>READ MORE →</div>
          </div>
        );
      })}
    </div>
  );

  const Minutes = () => (
    <div className="rise" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ ...card({ padding: "13px 16px", borderLeft: "3px solid var(--gold)" }), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ ...f(13, 400, "serif"), color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic", flex: 1 }}>
          Official meeting minutes and summaries posted by union leadership.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--leather3)", borderRadius: 8, padding: 4, border: "1px solid var(--seam)", flexShrink: 0, marginLeft: 10 }}>
          {["en", "es"].map(l => (
            <div key={l} onClick={() => setMinLang(l)} style={{ padding: "4px 10px", borderRadius: 6, background: minLang === l ? "var(--gold)" : "transparent", color: minLang === l ? "#1a0f00" : "var(--text3)", ...f(11, 700), cursor: "pointer", textTransform: "uppercase" }}>{l}</div>
          ))}
        </div>
      </div>
      {minutes.length === 0 && <div style={{ padding: "40px 0", textAlign: "center", ...f(13, 400, "serif"), color: "var(--text3)" }}>No meeting minutes posted yet.</div>}
      {minutes.map(m => {
        const displayTitle = minLang === "es" && m.titleEs ? m.titleEs : m.title;
        const displaySummary = minLang === "es" && m.summaryEs ? m.summaryEs : m.summary;
        return (
          <div key={m.id} style={card({ padding: "16px" })}>
            <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ ...f(15, 600), color: "var(--cream)", lineHeight: 1.25, flex: 1, paddingRight: 8 }}>{displayTitle}</div>
            </div>
            <div style={{ ...f(11, 400, "serif"), color: "var(--gold)", fontStyle: "italic", marginBottom: 8 }}>{m.date}</div>
            <div className="gold-rule" style={{ margin: "0 0 10px" }} />
            <div style={{ ...f(13, 400, "serif"), color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{displaySummary}</div>
            {minLang === "es" && !m.summaryEs && (
              <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 8 }}>Translation not available for this entry.</div>
            )}
          </div>
        );
      })}
    </div>
  );

  const Seniority = () => {
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
  };

  const Zoom = () => (
    <div className="rise" style={{ padding: "20px 14px", ...col(0) }}>
      <div style={{ ...card({ padding: "20px", marginBottom: 16, borderLeft: "3px solid #2D8CFF" }) }}>
        <div style={{ ...row("center", 12), marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#1a3a6a", border: "1px solid #2D8CFF44", display: "flex", alignItems: "center", justifyContent: "center", color: "#2D8CFF" }}>
            <SectionIcon icon="video" size={22} />
          </div>
          <div>
            <div style={{ ...f(20, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>ZOOM MEETING ROOM</div>
            <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>DWA Union Meetings</div>
          </div>
        </div>
        <div style={{ ...f(13, 400, 'serif'), color: "var(--text2)", lineHeight: 1.65, fontStyle: "italic" }}>
          Join the official DWA Zoom meeting room for union meetings, steward sessions, and member calls.
        </div>
      </div>
      <a href={zoomInfo.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 14 }}>
        <div style={{ background: "#2563a8", borderRadius: 10, padding: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff" }}>
          <SectionIcon icon="video" size={20} />
          <span style={{ ...f(20, 400, 'bebas'), color: "#fff", letterSpacing: ".1em" }}>CLICK TO JOIN ZOOM</span>
        </div>
      </a>
      <div style={{ ...card({ padding: "20px" }), ...col(0) }}>
        <div style={{ ...f(10, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 14 }}>Meeting Details</div>
        {[
          { label: "Meeting ID", value: zoomInfo.meetingId },
          { label: "Passcode", value: zoomInfo.passcode },
          { label: "Platform", value: "Zoom", color: "#2D8CFF" },
        ].map(item => (
          <div key={item.label} style={{ ...row("center", 0), justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
            <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{item.label}</div>
            <div style={{ ...row("center", 8) }}>
              <div style={{ ...f(15, 700), color: item.color || "var(--text)", letterSpacing: ".06em" }}>{item.value}</div>
              {item.label === "Meeting ID" && (
                <button onClick={() => { navigator.clipboard.writeText(zoomInfo.meetingId.replace(/ /g, "")); alert("Meeting ID copied!"); }} style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", border: "1px solid rgba(201,146,42,0.2)", borderRadius: 6, padding: "3px 8px", cursor: "pointer", letterSpacing: ".08em" }}>COPY</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card({ padding: "14px 16px", marginTop: 12, borderLeft: "3px solid var(--seam)" }), display: "flex", gap: 10 }}>
        <div style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}><SectionIcon icon="info" size={16} /></div>
        <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", lineHeight: 1.6, fontStyle: "italic" }}>
          If the link doesn't open Zoom automatically, open the Zoom app and enter the Meeting ID and Passcode manually.
        </div>
      </div>
    </div>
  );

  const Admin = () => {
    const needsAttention = [];
    if (pendingMembers.length > 0) needsAttention.push({ icon: "users", title: `${pendingMembers.length} member request${pendingMembers.length > 1 ? "s" : ""} waiting`, sub: "Tap to approve or deny", action: () => setAdminSection("members"), color: "#c0392b", bg: "rgba(192,57,43,0.08)", border: "rgba(192,57,43,0.2)" });

    // ── STEWARD LIMITED VIEW ──
    if (isSteward) {
      return (
        <div className="rise" style={{ padding: "16px", ...col(14) }}>
          <div style={{ ...card({ padding: "16px 18px" }) }}>
            <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Steward Panel</div>
            <div style={{ ...f(16, 600), color: "var(--cream)" }}>Hey — here's what needs you</div>
            <div style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.15)", padding: "3px 8px", borderRadius: 6, letterSpacing: ".1em", display: "inline-block", marginTop: 8 }}>STEWARD</div>
          </div>

          {needsAttention.length > 0 && (
            <div style={col(6)}>
              <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Needs Attention</div>
              {needsAttention.map((item, i) => (
                <div key={i} onClick={item.action} className="tile" style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: item.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>
                    <SectionIcon icon={item.icon} size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...f(14, 600), color: item.color }}>{item.title}</div>
                    <div style={{ ...f(11, 400, "serif"), color: item.color, opacity: 0.8, fontStyle: "italic", marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <div style={{ ...f(14, 700), color: item.color }}>→</div>
                </div>
              ))}
            </div>
          )}

          {needsAttention.length === 0 && (
            <div style={{ background: "rgba(45,122,79,0.08)", border: "1.5px solid rgba(45,122,79,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(45,122,79,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
                <SectionIcon icon="check" size={16} />
              </div>
              <div style={{ ...f(13, 400, "serif"), color: "var(--green)", fontStyle: "italic" }}>All clear — nothing needs your attention right now.</div>
            </div>
          )}

          <div style={col(8)}>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Steward Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "users", label: "Member Requests", action: () => setAdminSection("members") },
                { icon: "shield", label: "Update Seniority", action: () => setAdminSection("seniority") },
                ...(bannedUsers.length > 0 ? [{ icon: "x", label: `Banned (${bannedUsers.length})`, action: () => setAdminSection("banned") }] : []),
              ].map(qa => (
                <div key={qa.label} onClick={qa.action} className="tile" style={{ ...tileStyle(), borderRadius: 10, padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                    <SectionIcon icon={qa.icon} size={18} />
                  </div>
                  <div style={{ ...f(12, 600, "bebas"), color: "var(--cream)", letterSpacing: ".05em" }}>{qa.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card({ padding: "14px 16px" }), display: "flex", alignItems: "center", gap: 10 }}>
            <SectionIcon icon="info" size={16} />
            <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", lineHeight: 1.5 }}>
              As a steward, you can approve new members, update the seniority list, and moderate The Floor (ban/delete posts). Contact an officer for other admin tasks.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rise" style={{ padding: "16px", ...col(14) }}>
        {/* Header */}
        <div style={{ ...card({ padding: "16px 18px" }) }}>
          <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 4 }}>Officers Panel</div>
          <div style={{ ...f(16, 600), color: "var(--cream)" }}>Hey — here's what needs you</div>
          {isSuper && <div style={{ ...f(9, 700), color: "#1a0f00", background: "linear-gradient(135deg,#a06b18,#c9922a)", padding: "3px 8px", borderRadius: 6, letterSpacing: ".1em", display: "inline-block", marginTop: 8 }}>SUPER ADMIN</div>}
        </div>

        {/* Needs Attention */}
        {needsAttention.length > 0 && (
          <div style={col(6)}>
            <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Needs Attention</div>
            {needsAttention.map((item, i) => (
              <div key={i} onClick={item.action} className="tile" style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: item.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: item.color }}>
                  <SectionIcon icon={item.icon} size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...f(14, 600), color: item.color }}>{item.title}</div>
                  <div style={{ ...f(11, 400, "serif"), color: item.color, opacity: 0.8, fontStyle: "italic", marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ ...f(14, 700), color: item.color }}>→</div>
              </div>
            ))}
          </div>
        )}

        {needsAttention.length === 0 && (
          <div style={{ background: "rgba(45,122,79,0.08)", border: "1.5px solid rgba(45,122,79,0.2)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(45,122,79,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
              <SectionIcon icon="check" size={16} />
            </div>
            <div style={{ ...f(13, 400, "serif"), color: "var(--green)", fontStyle: "italic" }}>All clear — nothing needs your attention right now.</div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={col(8)}>
          <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "bell", label: "Post Announcement", action: () => setAdminSection("announcements") },
              { icon: "notes", label: "Post Minutes", action: () => setAdminSection("minutes") },
              { icon: "file", label: "Upload Document", action: () => setAdminSection("documents") },
              { icon: "shield", label: "Update Seniority", action: () => setAdminSection("seniority") },
            ].map(qa => (
              <div key={qa.label} onClick={qa.action} className="tile" style={{
                ...tileStyle(),
                
                borderRadius: 10, padding: "14px",
                
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                  <SectionIcon icon={qa.icon} size={18} />
                </div>
                <div style={{ ...f(12, 600, "bebas"), color: "var(--cream)", letterSpacing: ".05em" }}>{qa.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* More */}
        <div style={col(8)}>
          <div style={{ ...f(9, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>More</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "calendar", label: "Union Meeting", action: () => setAdminSection("meeting") },
              { icon: "video", label: "Zoom Room", action: () => setAdminSection("zoom") },
              { icon: "phone", label: "DWA Contacts", action: () => setAdminSection("contacts") },
              { icon: "users", label: "Member Requests", action: () => setAdminSection("members") },
              { icon: "shield", label: "User Admin", action: () => setAdminSection("useradmin") },
              ...(bannedUsers.length > 0 ? [{ icon: "x", label: `Banned (${bannedUsers.length})`, action: () => setAdminSection("banned") }] : []),
              ...(isSuper ? [{ icon: "shield", label: "Manage Officials", action: () => setAdminSection("accounts") }] : []),
            ].map(qa => (
              <div key={qa.label} onClick={qa.action} className="tile" style={{
                ...tileStyle(),
                
                borderRadius: 10, padding: "14px",
                
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, ...tileIconStyle(), display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                  <SectionIcon icon={qa.icon} size={18} />
                </div>
                <div style={{ ...f(12, 600, "bebas"), color: "var(--cream)", letterSpacing: ".05em" }}>{qa.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  const TABS = [
    { id: "home", label: "Home", icon: "home" },
    { id: "documents", label: "Docs", icon: "file" },
    { id: "zoom", label: "Zoom", icon: "video" },
    { id: "minutes", label: "Minutes", icon: "notes" },
    ...(hasOfficialAccess ? [{ id: "admin", label: "Officials", icon: "shield" }] : []),
  ];

  const AdminFormHeader = ({ title }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ ...f(10, 700), color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".15em" }}>{title}</div>
      <button onClick={() => setAdminSection(null)} style={{ ...f(12, 700), color: "var(--text3)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".1em" }}>← BACK</button>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div id="dwa-app-root" style={{ maxWidth: 430, margin: "0 auto", height: "100dvh", minHeight: "-webkit-fill-available", display: "flex", flexDirection: "column", background: "transparent", position: "relative", overflow: "hidden" }}>

        {/* Top nav */}
        <div style={{ background: "var(--leather)", padding: "12px 16px", ...row("center", 0), justifyContent: "space-between", position: "relative", flexShrink: 0, zIndex: 1 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={row("center", 10)}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--gold-dim)", border: "1px solid var(--seam)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
              <SectionIcon icon={TABS.find(t => t.id === tab)?.icon || "home"} size={16} />
            </div>
            {tab !== "home" && (
              <button onClick={() => { setTab("home"); setAdminSection(null); }} style={{ ...row("center", 6), color: "var(--gold)", background: "none", border: "none", cursor: "pointer", ...f(12, 700), letterSpacing: ".1em" }}>← HOME</button>
            )}
          </div>
          <div style={row("center", 8)}>
            <button onClick={() => { setProfileUserId(null); setShowProfile(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", position: "relative" }} title="My Profile">
              <SectionIcon icon="user" size={20} />
            </button>
            <button onClick={() => setShowSettingsPanel(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", position: "relative" }}>
              <SectionIcon icon="gear" size={20} />
            </button>
          </div>
        </div>

        <div className="scroll" style={{ flex: 1, position: "relative", zIndex: 1 }}>
          {tabDataLoading && tab === "home" && <div className="rise" style={{ padding: 16 }}><SkeletonGrid count={6} /></div>}
          {tabDataLoading && tab === "theFloor" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={3} avatar /></div>}
          {tabDataLoading && tab === "announcements" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={3} /></div>}
          {tabDataLoading && tab === "documents" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={4} /></div>}
          {tabDataLoading && tab === "seniority" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={5} /></div>}
          {tabDataLoading && tab === "grievance" && <div className="rise" style={{ padding: 16 }}><SkeletonCard lines={4} /><SkeletonCard lines={3} /></div>}
          {tabDataLoading && tab === "minutes" && <div className="rise" style={{ padding: 16 }}><SkeletonList count={3} /></div>}
          {tabDataLoading && tab === "zoom" && <div className="rise" style={{ padding: 16 }}><SkeletonCard lines={4} /></div>}
          {tabDataLoading && tab === "admin" && <div className="rise" style={{ padding: 16 }}><SkeletonGrid count={8} /></div>}
          {!tabDataLoading && tab === "home" && <Home />}
          {!tabDataLoading && tab === "theFloor" && <TheFloor />}
          {!tabDataLoading && tab === "grievance" && <Grievance />}
          {!tabDataLoading && tab === "documents" && <Documents />}
          {!tabDataLoading && tab === "announcements" && <Announcements />}
          {!tabDataLoading && tab === "zoom" && <Zoom />}
          {!tabDataLoading && tab === "minutes" && <Minutes />}
          {!tabDataLoading && tab === "seniority" && <Seniority />}
          {!tabDataLoading && tab === "admin" && !adminSection && <Admin />}

          {/* Admin Sections */}
          {tab === "admin" && adminSection === "announcements" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title={editAnnId ? "Edit Announcement" : "Post Announcement"} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={col(5)}>
                  <label style={lbl}>Title</label>
                  <input style={inp()} value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title" />
                </div>
                <div style={col(5)}>
                  <label style={lbl}>Message</label>
                  <textarea style={{ ...inp(), minHeight: 100, resize: "vertical", lineHeight: 1.5 }} value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder="Announcement body…" />
                </div>
                <div style={{ ...row("center", 0), justifyContent: "space-between" }}>
                  <div style={{ ...f(13, 500), color: "var(--text)" }}>Mark as Urgent</div>
                  <Tog on={annUrgent} flip={() => setAnnUrgent(v => !v)} />
                </div>
                {annPosted && <div style={{ ...f(13, 600), color: "var(--green)" }}>{editAnnId ? "✓ Updated in EN & ES!" : "✓ Posted in EN & ES!"}</div>}
                {translating && <div style={{ ...f(12, 400, 'serif'), color: "var(--gold)", fontStyle: "italic" }}>Translating to Spanish…</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnGold(!annTitle.trim() || !annBody.trim() || translating), flex: 1 }} onClick={postAnn} disabled={!annTitle.trim() || !annBody.trim() || translating}>{translating ? "TRANSLATING…" : editAnnId ? "UPDATE ANNOUNCEMENT" : "POST ANNOUNCEMENT"}</button>
                  {editAnnId && <button onClick={() => { setEditAnnId(null); setAnnTitle(""); setAnnBody(""); setAnnUrgent(false); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>Active Announcements</div>
              {announcements.map(a => (
                <div key={a.id} style={{ ...card({ padding: "14px" }) }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      {a.urgent && <span style={{ ...f(9, 700), color: "var(--gold)", marginBottom: 4, display: "block" }}>⚡ URGENT</span>}
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{a.title}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 4, fontStyle: "italic" }}>{a.body.slice(0, 80)}…</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => { setEditAnnId(a.id); setAnnTitle(a.title); setAnnBody(a.body); setAnnUrgent(!!a.urgent); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => setConfirmModal({ title: "Delete Announcement", message: `Delete "${a.title}"?`, danger: true, onConfirm: () => { const removed = a; setAnnouncements(prev => { const updated = prev.filter(x => x.id !== a.id); saveAnnouncements(updated); return updated; }); setToastMsg({ message: `"${a.title}" deleted`, onUndo: () => setAnnouncements(prev => { const restored = [removed, ...prev]; saveAnnouncements(restored); return restored; }) }); } })} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>DEL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "admin" && adminSection === "seniority" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Seniority List" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>{editSenId ? "Edit Member" : "Add Member"}</div>
                <div style={col(5)}><label style={lbl}>Full Name</label><input style={inp()} value={newSenName} onChange={e => setNewSenName(e.target.value)} placeholder="Employee full name" /></div>
                <div style={col(5)}><label style={lbl}>Hire Date</label><input type="date" style={inp()} value={newSenDate} onChange={e => setNewSenDate(e.target.value)} /></div>
                <div style={col(5)}><label style={lbl}>Location</label>
                  <select style={dropStyle()} value={newSenLocation} onChange={e => setNewSenLocation(e.target.value)}>
                    <option>Jersey City</option><option>Florence</option>
                  </select>
                </div>
                {senError && <div style={{ ...f(12, 400, 'serif'), color: "var(--red)", fontStyle: "italic" }}>{senError}</div>}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>{editSenId ? "✓ Updated!" : "✓ Saved!"}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                <button style={btnGold(!newSenName.trim() || !newSenDate)} disabled={!newSenName.trim() || !newSenDate} onClick={() => {
                  if (!newSenName.trim()) { setSenError("Please enter a name."); return; }
                  if (!newSenDate) { setSenError("Please select a hire date."); return; }
                  if (editSenId) {
                    setSeniority(prev => { const updated = prev.map(x => x.id === editSenId ? { ...x, name: newSenName.trim(), hireDate: newSenDate, location: newSenLocation } : x); saveSeniorityFn(updated); return updated; });
                  } else {
                    setSeniority(prev => { const updated = [...prev, { id: Date.now(), name: newSenName.trim(), hireDate: newSenDate, location: newSenLocation }]; saveSeniorityFn(updated); return updated; });
                  }
                  setEditSenId(null); setNewSenName(""); setNewSenDate(""); setNewSenLocation("Jersey City"); setSenError("");
                  saveFlash(() => { });
                }}>{editSenId ? "UPDATE MEMBER" : "ADD TO SENIORITY LIST"}</button>
                {editSenId && <button onClick={() => { setEditSenId(null); setNewSenName(""); setNewSenDate(""); setNewSenLocation("Jersey City"); setSenError(""); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>Current Members ({seniority.length})</div>
                {[...seniority].sort((a, b) => a.hireDate.localeCompare(b.hireDate)).map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{s.name}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{s.location} · {s.hireDate}</div>
                    </div>
                    <button onClick={() => { setEditSenId(s.id); setNewSenName(s.name); setNewSenDate(s.hireDate); setNewSenLocation(s.location || "Jersey City"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(191,155,48,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>EDIT</button>
                    <button onClick={() => { setConfirmModal({ title: `Remove ${s.name}?`, message: `${s.name} will be removed from the seniority list.`, danger: true, onConfirm: () => { const removed = s; setSeniority(prev => { const updated = prev.filter(x => x.id !== s.id); saveSeniorityFn(updated); return updated; }); setToastMsg({ message: `${s.name} removed`, onUndo: () => { setSeniority(prev => { const restored = [...prev, removed]; saveSeniorityFn(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEL</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "members" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Member Requests" />
              <div style={{ ...card({ padding: "16px" }) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 10 }}>Pending ({pendingMembers.length})</div>
                {pendingMembers.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No pending requests.</div>}
                {pendingMembers.map(m => (
                  <div key={m.uid || m.email} style={{ ...col(6), padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ ...f(14, 600), color: "var(--text)" }}>{m.name}</div>
                    <div style={{ ...f(12, 400), color: "var(--text3)" }}>{m.email}{m.location ? ` · ${m.location}` : ""}</div>
                    <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Submitted {m.submittedAt}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <button onClick={() => { setConfirmModal({ title: `Approve ${m.name}?`, message: `${m.name} will become a union member.`, onConfirm: async () => { if (m.uid) await approveMember(m.uid); setMemberEmails(prev => [...prev, m.email]); setToastMsg({ message: `${m.name} approved!` }); } }); }} style={{ flex: 1, padding: "8px", background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", borderRadius: 6, color: "var(--green)", ...f(11, 700), cursor: "pointer" }}>APPROVE</button>
                      <button onClick={() => { setConfirmModal({ title: `Deny ${m.name}?`, message: "This will reject their membership request.", danger: true, onConfirm: async () => { if (m.uid) await denyMember(m.uid); setToastMsg({ message: `${m.name} denied` }); } }); }} style={{ flex: 1, padding: "8px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, color: "var(--red)", ...f(11, 700), cursor: "pointer" }}>DENY</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...card({ padding: "16px" }) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 10 }}>Approved Members ({memberEmails.length})</div>
                {memberEmails.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No approved members yet.</div>}
                {memberEmails.map(em => (
                  <div key={em} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ flex: 1, ...f(13, 400), color: "var(--text)" }}>{em}</div>
                    <button onClick={() => { setConfirmModal({ title: `Remove ${em}?`, message: "This member will lose access to the app.", danger: true, onConfirm: () => { const removed = em; setMemberEmails(prev => prev.filter(e => e !== em)); setToastMsg({ message: `${em} removed`, onUndo: () => { setMemberEmails(prev => [...prev, removed]); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEL</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "meeting" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Union Meeting" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                {[["Meeting Title", "title", "e.g. Contract Ratification Vote"], ["Date", "date", "e.g. May 15, 2026"], ["Time", "time", "e.g. 6:00 PM"], ["Location", "location", "e.g. Union Hall"]].map(([label, key, ph]) => (
                  <div key={key} style={col(5)}>
                    <label style={lbl}>{label}</label>
                    <input style={inp()} value={editMeeting[key] || ""} placeholder={ph} onChange={e => setEditMeeting(prev => ({ ...prev, [key]: e.target.value }))} />
                  </div>
                ))}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
                <button style={btnGold()} onClick={() => { const info = { ...editMeeting }; setNextMeeting(info); saveMeetingInfo(info); saveFlash(() => {}); try { fetch('/api/notifications/meeting-updated', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: info.title || 'Union Meeting', date: info.date, time: info.time, location: info.location || '', zoomId: zoomInfo?.id || '', zoomPasscode: zoomInfo?.passcode || '', zoomLink: zoomInfo?.link || '' }) }); } catch(e) { console.log('Meeting notification failed:', e); } }}>SAVE MEETING INFO</button>
              </div>
              <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>Preview: {editMeeting.title} · {editMeeting.date} · {editMeeting.location}</div>
            </div>
          )}

          {tab === "admin" && adminSection === "zoom" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Zoom Meeting Room" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                {[["Meeting ID", "meetingId", "e.g. 783 115 6878"], ["Passcode", "passcode", "e.g. 9cDtkC"], ["Join Link", "link", "https://zoom.us/j/..."]].map(([label, key, ph]) => (
                  <div key={key} style={col(5)}>
                    <label style={lbl}>{label}</label>
                    <input style={inp()} value={editZoom[key] || ""} placeholder={ph} onChange={e => setEditZoom(prev => ({ ...prev, [key]: e.target.value }))} />
                  </div>
                ))}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
                <button style={btnGold()} onClick={() => { const info = { ...editZoom }; setZoomInfo(info); saveZoomInfoFn(info); saveFlash(() => {}); }}>SAVE ZOOM INFO</button>
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "minutes" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title={editMinId ? "Edit Minutes" : "Meeting Minutes"} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={col(5)}><label style={lbl}>Title</label><input style={inp()} value={newMinTitle} onChange={e => setNewMinTitle(e.target.value)} placeholder="Meeting title" /></div>
                <div style={col(5)}><label style={lbl}>Date</label><input style={inp()} value={newMinDate} onChange={e => setNewMinDate(e.target.value)} placeholder="e.g. Apr 5, 2026" /></div>
                <div style={col(5)}><label style={lbl}>Summary</label><textarea style={{ ...inp(), minHeight: 80, resize: "vertical", lineHeight: 1.5 }} value={newMinSummary} onChange={e => setNewMinSummary(e.target.value)} placeholder="Brief summary of meeting…" /></div>
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>{editMinId ? "✓ Updated in EN & ES!" : "✓ Posted in EN & ES!"}</div>}
                {translating && <div style={{ ...f(12, 400, 'serif'), color: "var(--gold)", fontStyle: "italic" }}>Translating to Spanish…</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnGold(!newMinTitle.trim() || !newMinDate || translating), flex: 1 }} disabled={!newMinTitle.trim() || !newMinDate || translating} onClick={async () => {
                    setTranslating(true);
                    let titleEs = newMinTitle;
                    let summaryEs = newMinSummary;
                    try {
                      const response = await fetch("/api/translate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: newMinTitle, body: newMinSummary }),
                      });
                      const data = await response.json();
                      if (data.titleEs) titleEs = data.titleEs;
                      if (data.bodyEs) summaryEs = data.bodyEs;
                    } catch (e) {}
                    setTranslating(false);
                    if (editMinId) {
                      setMinutes(prev => {
                        const updated = prev.map(m => m.id === editMinId ? { ...m, title: newMinTitle, date: newMinDate, summary: newMinSummary, titleEs, summaryEs } : m);
                        saveMinutesFn(updated);
                        return updated;
                      });
                      setEditMinId(null);
                    } else {
                      setMinutes(prev => { const updated = [{ id: Date.now(), title: newMinTitle, date: newMinDate, summary: newMinSummary, titleEs, summaryEs }, ...prev]; saveMinutesFn(updated); return updated; });
                    }
                    setNewMinTitle(""); setNewMinDate(""); setNewMinSummary("");
                    saveFlash(() => { });
                  }}>{translating ? "TRANSLATING…" : editMinId ? "UPDATE MINUTES" : "POST MINUTES"}</button>
                  {editMinId && <button onClick={() => { setEditMinId(null); setNewMinTitle(""); setNewMinDate(""); setNewMinSummary(""); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              {minutes.map(m => (
                <div key={m.id} style={{ ...card({ padding: "14px" }) }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{m.title}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--gold)", fontStyle: "italic", marginTop: 2 }}>{m.date}</div>
                      <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", marginTop: 4 }}>{m.summary.slice(0, 80)}…</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => { setEditMinId(m.id); setNewMinTitle(m.title); setNewMinDate(m.date); setNewMinSummary(m.summary); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => setConfirmModal({ title: "Delete Minutes", message: `Delete "${m.title}"?`, danger: true, onConfirm: () => { const removed = m; setMinutes(prev => { const updated = prev.filter(x => x.id !== m.id); saveMinutesFn(updated); return updated; }); setToastMsg({ message: `"${m.title}" deleted`, onUndo: () => setMinutes(prev => { const restored = [removed, ...prev]; saveMinutesFn(restored); return restored; }) }); } })} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer" }}>DEL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "admin" && adminSection === "documents" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Documents" />

              {/* Upload form */}
              <div style={{ ...card({ padding: "16px" }), ...col(14) }}>
                <div style={{ ...f(11, 700), color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>Add Document</div>

                {/* File drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDocUploadDrag(true); }}
                  onDragLeave={() => setDocUploadDrag(false)}
                  onDrop={e => {
                    e.preventDefault(); setDocUploadDrag(false);
                    const file = e.dataTransfer.files[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    const sizeKb = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
                    const ext = file.name.split(".").pop()?.toLowerCase() || "file";
                    setNewDocFile({ name: file.name, size: sizeKb, url, type: ext, rawFile: file });
                    if (!newDocName.trim()) setNewDocName(file.name.replace(/\.[^.]+$/, ""));
                  }}
                  style={{
                    border: `2px dashed ${docUploadDrag ? "var(--gold)" : "var(--seam)"}`,
                    borderRadius: 10, padding: "20px 16px", textAlign: "center",
                    background: docUploadDrag ? "rgba(201,146,42,0.06)" : "var(--leather3)",
                    transition: "all .2s", cursor: "pointer", position: "relative",
                  }}
                  onClick={() => document.getElementById("doc-file-input").click()}
                >
                  <input
                    id="doc-file-input" type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    style={{ display: "none" }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      const sizeKb = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
                      const ext = file.name.split(".").pop()?.toLowerCase() || "file";
                      setNewDocFile({ name: file.name, size: sizeKb, url, type: ext, rawFile: file });
                      if (!newDocName.trim()) setNewDocName(file.name.replace(/\.[^.]+$/, ""));
                    }}
                  />
                  {newDocFile ? (
                    <div style={{ ...row("center", 10), justifyContent: "center" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 7, background: "rgba(45,122,79,0.15)", border: "1px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0 }}>
                        <SectionIcon icon="check" size={18} />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{newDocFile.name}</div>
                        <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{newDocFile.size} · {newDocFile.type.toUpperCase()}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setNewDocFile(null); }} style={{ marginLeft: 4, background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ color: "var(--text3)", marginBottom: 6, display: "flex", justifyContent: "center" }}><SectionIcon icon="clip" size={22} /></div>
                      <div style={{ ...f(13, 600), color: "var(--text2)" }}>Tap to upload or drag & drop</div>
                      <div style={{ ...f(11, 400, "serif"), color: "var(--text3)", fontStyle: "italic", marginTop: 4 }}>PDF, DOC, DOCX, XLS, JPG, PNG</div>
                    </>
                  )}
                </div>

                <div style={col(5)}>
                  <label style={lbl}>Display Name</label>
                  <input style={inp()} value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="Document name shown to members" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(5)}>
                    <label style={lbl}>Category</label>
                    <select style={dropStyle()} value={newDocCat} onChange={e => setNewDocCat(e.target.value)}>
                      <option>Contract & Bylaws</option>
                      <option>Forms</option>
                      <option>Flyers</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={col(5)}>
                    <label style={lbl}>Description</label>
                    <input style={inp()} value={newDocDesc} onChange={e => setNewDocDesc(e.target.value)} placeholder="Optional note" />
                  </div>
                </div>

                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Document added!</div>}
                {newDocUploading && <div style={{ ...f(12, 600), color: "var(--gold)" }}>⏳ Uploading file...</div>}
                <button
                  style={btnGold(!newDocName.trim() || newDocUploading)}
                  disabled={!newDocName.trim() || newDocUploading}
                  onClick={async () => {
                    const now = new Date();
                    const updatedStr = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
                    let fileUrl = undefined;
                    let fileType = newDocFile?.type || undefined;
                    if (newDocFile?.rawFile) {
                      try {
                        setNewDocUploading(true);
                        fileUrl = await uploadDocumentFile(newDocFile.rawFile);
                      } catch (err) {
                        console.error("Upload failed:", err);
                        alert("File upload failed. Please try again.");
                        setNewDocUploading(false);
                        return;
                      }
                      setNewDocUploading(false);
                    }
                    const newDoc = {
                      id: Date.now(), name: newDocName, category: newDocCat,
                      size: newDocFile?.size || "—", updated: updatedStr,
                      desc: newDocDesc || undefined,
                      fileUrl,
                      fileType,
                    };
                    setDocuments(prev => {
                      const updated = [...prev, newDoc];
                      saveDocuments(updated);
                      return updated;
                    });
                    setNewDocName(""); setNewDocDesc(""); setNewDocFile(null);
                    saveFlash(() => {});
                  }}
                >{newDocUploading ? "UPLOADING..." : "ADD DOCUMENT"}</button>
              </div>

              {/* Existing docs list */}
              <div style={{ ...f(10, 700), color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".15em" }}>
                All Documents ({documents.length})
              </div>
              {documents.map(d => (
                <div key={d.id} style={{ ...card({ padding: "0", overflow: "hidden" }) }}>
                  <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 38, borderRadius: 6, background: "var(--leather3)", border: "1px solid var(--seam)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, gap: 2 }}>
                      <SectionIcon icon="file" size={14} />
                      <span style={{ ...f(8, 700), color: "var(--text3)", letterSpacing: ".04em" }}>{(d.fileType || "DOC").toUpperCase().slice(0,4)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{d.category} · {d.size} · {d.updated}</div>
                    </div>
                    {d.id > 2 && (
                      <button onClick={() => setConfirmModal({ title: "Delete Document", message: `Delete "${d.name}"? This cannot be undone.`, danger: true, onConfirm: () => { const removed = d; setDocuments(prev => { const updated = prev.filter(x => x.id !== d.id); saveDocuments(updated); return updated; }); setToastMsg({ message: `"${d.name}" deleted`, onUndo: () => setDocuments(prev => { const restored = [...prev, removed]; saveDocuments(restored); return restored; }) }); } })}
                        style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", flexShrink: 0 }}>
                        DEL
                      </button>
                    )}
                  </div>
                  {d.fileUrl && (
                    <div style={{ borderTop: "1px solid var(--seam)", padding: "8px 14px" }}>
                      <a href={d.fileUrl} download={d.name} style={{ ...f(11, 700), color: "var(--gold)", textDecoration: "none", ...row("center", 5) }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        DOWNLOAD ATTACHED FILE
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "admin" && adminSection === "contacts" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title={editContactId ? "Edit Contact" : "DWA Contacts"} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>{editContactId ? "Edit Contact" : "Add Contact"}</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>Contacts appear on the DWA Contacts page visible to all members.</div>
                <div style={col(5)}>
                  <label style={lbl}>Full Name</label>
                  <input style={inp()} value={newContactName} onChange={e => setNewContactName(e.target.value)} placeholder="Full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(5)}>
                    <label style={lbl}>Title</label>
                    <select style={dropStyle()} value={newContactTitle} onChange={e => setNewContactTitle(e.target.value)}>
                      <option>President</option>
                      <option>Vice President</option>
                      <option>Treasurer</option>
                      <option>Recording Secretary</option>
                      <option>Secretary</option>
                      <option>Trustee</option>
                      <option>Sergeant at Arms</option>
                      <option>Shop Steward</option>
                    </select>
                  </div>
                  <div style={col(5)}>
                    <label style={lbl}>Location</label>
                    <input style={inp()} value={newContactDept} onChange={e => setNewContactDept(e.target.value)} placeholder="e.g. Jersey City" />
                  </div>
                </div>
                <div style={col(5)}>
                  <label style={lbl}>Phone</label>
                  <input style={inp()} type="tel" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} placeholder="Phone number" />
                </div>
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>{editContactId ? "✓ Contact updated!" : "✓ Saved!"}</div>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...btnGold(!newContactName.trim()), flex: 1 }} disabled={!newContactName.trim()} onClick={() => {
                    if (editContactId) {
                      setStewardsData(prev => {
                        const updated = prev.map(s => s.id === editContactId ? { ...s, name: newContactName.trim(), title: newContactTitle, dept: newContactDept.trim(), phone: newContactPhone.replace(/\D/g, "") } : s);
                        saveStewards(updated);
                        return updated;
                      });
                      setEditContactId(null);
                    } else {
                      setStewardsData(prev => { const updated = [...prev, { id: Date.now(), name: newContactName.trim(), title: newContactTitle, dept: newContactDept.trim(), phone: newContactPhone.replace(/\D/g, "") }]; saveStewards(updated); return updated; });
                    }
                    setNewContactName(""); setNewContactPhone(""); setNewContactDept(""); setNewContactTitle("Shop Steward");
                    saveFlash(() => {});
                  }}>{editContactId ? "UPDATE CONTACT" : "ADD CONTACT"}</button>
                  {editContactId && <button onClick={() => { setEditContactId(null); setNewContactName(""); setNewContactPhone(""); setNewContactDept(""); setNewContactTitle("Shop Steward"); }} style={{ padding: "10px 14px", background: "none", border: "1px solid var(--seam)", borderRadius: 8, color: "var(--text3)", ...f(12, 700, 'bebas'), letterSpacing: ".1em", cursor: "pointer" }}>CANCEL</button>}
                </div>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Current Contacts ({stewardsData.length})</div>
                {stewardsData.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No contacts added yet.</div>}
                {stewardsData.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(10, 600), color: "#c4a44e" }}>{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{s.title}{s.dept ? ` · ${s.dept}` : ""}{s.phone ? ` · ${s.phone}` : ""}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                      <button onClick={() => { setEditContactId(s.id); setNewContactName(s.name); setNewContactTitle(s.title || "Shop Steward"); setNewContactDept(s.dept || ""); setNewContactPhone(s.phone || ""); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ ...f(11, 700), color: "var(--gold)", background: "none", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>EDIT</button>
                      <button onClick={() => { setConfirmModal({ title: `Remove ${s.name}?`, message: `${s.name} will be removed from DWA Contacts.`, danger: true, onConfirm: () => { const removed = s; setStewardsData(prev => { const updated = prev.filter(x => x.id !== s.id); saveStewards(updated); return updated; }); setToastMsg({ message: `${s.name} removed`, onUndo: () => { setStewardsData(prev => { const restored = [...prev, removed]; saveStewards(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "useradmin" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="User Admin" />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 8 }}>All Members ({allApprovedUsers.length})</div>
                <input style={inp()} value={userAdminSearch} onChange={e => setUserAdminSearch(e.target.value)} placeholder="Search by name or email..." />
              </div>
              {allApprovedUsers.filter(u => { const q = userAdminSearch.toLowerCase(); return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q); }).map(u => (
                <div key={u.uid} style={{ ...card({ padding: "14px" }), ...col(12) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(12, 600), color: "#c4a44e" }}>{(u.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(14, 600), color: "var(--text)" }}>{u.name || "Unknown"}</div>
                      <div style={{ ...f(11, 400), color: "var(--text3)" }}>{u.email || "No email"}{u.phone ? ` · ${u.phone}` : ""}{u.location ? ` · ${u.location}` : ""}</div>
                    </div>
                    <div style={{ ...f(9, 700), color: u.role === "officer" || u.role === "super" ? "#1a0f00" : u.role === "steward" ? "var(--gold)" : "var(--text3)", background: u.role === "officer" || u.role === "super" ? "linear-gradient(135deg,#a06b18,#c9922a)" : u.role === "steward" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>{u.role || "member"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => { setProfileUserId(u.uid); setShowProfile(true); }} style={{ padding: "7px 10px", background: "rgba(201,146,42,0.15)", border: "1px solid rgba(201,146,42,0.3)", borderRadius: 6, color: "var(--gold)", ...f(10, 700), cursor: "pointer" }}>VIEW PROFILE</button>
                    <button onClick={() => { setConfirmModal({ title: `Demote ${u.name} to Member?`, message: "They will lose steward/officer privileges.", danger: true, onConfirm: async () => { await updateUserRole(u.uid, "member"); setAdminEmails(prev => prev.filter(e => e !== u.email)); setToastMsg({ message: `${u.name} demoted to Member` }); } }); }} style={{ padding: "7px 10px", background: u.role === "member" || !u.role ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: u.role === "member" || !u.role ? "1px solid rgba(201,146,42,0.3)" : "1px solid var(--seam)", borderRadius: 6, color: u.role === "member" || !u.role ? "var(--gold)" : "var(--text3)", ...f(10, 700), cursor: "pointer" }}>MEMBER</button>
                    <button onClick={() => { setConfirmModal({ title: `Promote ${u.name} to Steward?`, message: "They will be able to approve members, update seniority, and moderate The Floor.", onConfirm: async () => { await updateUserRole(u.uid, "steward"); setToastMsg({ message: `${u.name} is now a Steward` }); } }); }} style={{ padding: "7px 10px", background: u.role === "steward" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: u.role === "steward" ? "1px solid rgba(201,146,42,0.3)" : "1px solid var(--seam)", borderRadius: 6, color: u.role === "steward" ? "var(--gold)" : "var(--text3)", ...f(10, 700), cursor: "pointer" }}>STEWARD</button>
                    <button onClick={() => { setConfirmModal({ title: `Promote ${u.name} to Officer?`, message: "They will have full admin access.", onConfirm: async () => { await updateUserRole(u.uid, "officer"); setAdminEmails(prev => prev.includes(u.email) ? prev : [...prev, u.email]); setToastMsg({ message: `${u.name} is now an Officer` }); } }); }} style={{ padding: "7px 10px", background: u.role === "officer" || u.role === "super" ? "rgba(201,146,42,0.15)" : "rgba(255,255,255,0.03)", border: u.role === "officer" || u.role === "super" ? "1px solid rgba(201,146,42,0.3)" : "1px solid var(--seam)", borderRadius: 6, color: u.role === "officer" || u.role === "super" ? "var(--gold)" : "var(--text3)", ...f(10, 700), cursor: "pointer" }}>OFFICER</button>
                    <button onClick={() => { setConfirmModal({ title: `Reset password for ${u.name}?`, message: `A reset link will be sent to ${u.email}.`, onConfirm: async () => { try { await sendPasswordResetToUser(u.email); setToastMsg({ message: `Reset email sent to ${u.email}` }); } catch(e) { setToastMsg({ message: "Error: " + e.message }); } } }); }} style={{ padding: "7px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--seam)", borderRadius: 6, color: "var(--text2)", ...f(10, 700), cursor: "pointer" }}>RESET PW</button>
                    <button onClick={() => { setConfirmModal({ title: `Delete ${u.name}'s account?`, message: "This will remove their profile from the app. This cannot be undone.", danger: true, onConfirm: async () => { try { await deleteUserProfile(u.uid); setToastMsg({ message: `${u.name}'s profile deleted` }); } catch(e) { setToastMsg({ message: "Error: " + e.message }); } } }); }} style={{ padding: "7px 10px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, color: "var(--red)", ...f(10, 700), cursor: "pointer" }}>DELETE</button>
                  </div>
                </div>
              ))}
              {allApprovedUsers.length === 0 && <div style={{ ...card({ padding: "16px" }), ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No approved members yet.</div>}
            </div>
          )}

          {tab === "admin" && adminSection === "banned" && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Banned Users" />
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 8 }}>These members are suspended from posting on The Floor. They can still use the app.</div>
                {bannedUsers.length === 0 && <div style={{ ...f(13, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>No banned users.</div>}
                {bannedUsers.map(b => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a1010", border: "1px solid #6b3a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(10, 600), color: "#e87a7a" }}>{b.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)" }}>{b.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>Banned by {b.bannedBy || "—"} · {formatFloorTime(b.bannedAt)}</div>
                    </div>
                    <button onClick={() => handleUnbanUser(b.name)} style={{ ...f(11, 700, 'bebas'), color: "var(--green)", background: "rgba(45,122,79,0.1)", border: "1px solid var(--green)", borderRadius: 6, padding: "5px 10px", cursor: "pointer", letterSpacing: ".08em" }}>UNBAN</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "admin" && adminSection === "accounts" && isSuper && (
            <div className="rise" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <AdminFormHeader title="Manage Officials" />

              {/* Officers */}
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>Add Officer by Email</div>
                <div style={col(5)}><input style={inp()} value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} placeholder="official@dwa.org" /></div>
                {adminMgmtError && <div style={{ ...f(12, 400, 'serif'), color: "var(--red)", fontStyle: "italic" }}>{adminMgmtError}</div>}
                {adminSaved && <div style={{ ...f(12, 600), color: "var(--green)" }}>✓ Saved!</div>}
                <button style={btnGold(!newAdminEmail.trim())} disabled={!newAdminEmail.trim()} onClick={() => {
                  const e = newAdminEmail.toLowerCase().trim();
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setAdminMgmtError("Invalid email."); return; }
                  if (e === SUPER_ADMIN_EMAIL) { setAdminMgmtError("That's the super admin."); return; }
                  if (adminEmails.map(a => a.toLowerCase()).includes(e)) { setAdminMgmtError("Already an official."); return; }
                  setAdminEmails(prev => [...prev, e]); setNewAdminEmail(""); setAdminMgmtError(""); saveFlash(() => { });
                }}>PROMOTE TO OFFICER</button>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Current Officers</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                  <div style={{ flex: 1, ...f(13, 400), color: "var(--text)" }}>{SUPER_ADMIN_EMAIL}</div>
                  <div style={{ ...f(9, 700), color: "#1a0f00", background: "linear-gradient(135deg,#a06b18,#c9922a)", padding: "3px 8px", borderRadius: 6 }}>SUPER</div>
                </div>
                {adminEmails.map(em => (
                  <div key={em} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ flex: 1, ...f(13, 400), color: "var(--text)" }}>{em}</div>
                    <div style={{ ...f(9, 700), color: "var(--gold)", background: "rgba(201,146,42,0.1)", padding: "3px 8px", borderRadius: 6 }}>OFFICER</div>
                    <button onClick={() => { setConfirmModal({ title: `Demote ${em}?`, message: "They will no longer have officer privileges.", danger: true, onConfirm: () => { setAdminEmails(prev => prev.filter(a => a !== em)); setToastMsg({ message: `${em} demoted from officer` }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}>DEMOTE</button>
                  </div>
                ))}
              </div>

              {/* Stewards */}
              <div className="gold-rule" style={{ margin: "4px 0" }} />
              <div style={{ ...card({ padding: "16px" }), ...col(12) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", letterSpacing: ".1em", marginBottom: 4 }}>Promote to Steward</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginBottom: 4 }}>Stewards can approve new members and moderate The Floor.</div>
                <div style={col(5)}>
                  <label style={lbl}>Full Name</label>
                  <input style={inp()} value={newStewardName} onChange={e => setNewStewardName(e.target.value)} placeholder="Member's full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={col(5)}>
                    <label style={lbl}>Location</label>
                    <select style={dropStyle()} value={newStewardDept} onChange={e => setNewStewardDept(e.target.value)}>
                      <option>Jersey City</option>
                      <option>Florence</option>
                    </select>
                  </div>
                  <div style={col(5)}>
                    <label style={lbl}>Phone (optional)</label>
                    <input style={inp()} type="tel" value={newStewardPhone} onChange={e => setNewStewardPhone(e.target.value)} placeholder="Phone number" />
                  </div>
                </div>
                <button style={btnGold(!newStewardName.trim())} disabled={!newStewardName.trim()} onClick={() => {
                  setStewardsData(prev => { const updated = [...prev, { id: Date.now(), name: newStewardName.trim(), title: "Shop Steward", dept: newStewardDept, phone: newStewardPhone.replace(/\D/g, "") }]; saveStewards(updated); return updated; });
                  setNewStewardName(""); setNewStewardPhone(""); setNewStewardDept("Jersey City");
                  saveFlash(() => {});
                }}>PROMOTE TO STEWARD</button>
              </div>
              <div style={{ ...card({ padding: "16px" }), ...col(8) }}>
                <div style={{ ...f(12, 700), color: "var(--gold)", marginBottom: 8 }}>Current Stewards ({stewardsData.length})</div>
                {stewardsData.length === 0 && <div style={{ ...f(12, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>No stewards assigned.</div>}
                {stewardsData.map(s => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--seam)" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2a1f0a", border: "1px solid #6b5a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...f(10, 600), color: "#c4a44e" }}>{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 600), color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                      <div style={{ ...f(10, 400, "serif"), color: "var(--text3)", fontStyle: "italic" }}>{s.dept || "—"}{s.phone ? ` · ${s.phone}` : ""}</div>
                    </div>
                    <div style={{ ...f(9, 700), color: "#e8b84b", background: "#2a1f0a", padding: "3px 8px", borderRadius: 6 }}>STEWARD</div>
                    <button onClick={() => { setConfirmModal({ title: `Demote ${s.name}?`, message: `${s.name} will lose steward privileges. They'll become a regular member.`, danger: true, onConfirm: () => { const removed = s; setStewardsData(prev => { const updated = prev.filter(x => x.id !== s.id); saveStewards(updated); return updated; }); setToastMsg({ message: `${s.name} demoted to member`, onUndo: () => { setStewardsData(prev => { const restored = [...prev, removed]; saveStewards(restored); return restored; }); } }); } }); }} style={{ ...f(11, 700), color: "var(--red)", background: "none", border: "1px solid rgba(192,57,43,0.3)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", flexShrink: 0 }}>DEMOTE</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="nav-glow" style={{ background: "var(--leather)", flexShrink: 0, position: "relative", zIndex: 1, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={{ display: "flex", padding: "6px 4px 10px" }}>
            {TABS.map(t => {
              const active = tab === t.id;
              const hasBadge = t.id === "admin" && pendingMembers.length > 0;
              return (
                <button key={t.id} className="tab-btn" onClick={() => { setTab(t.id); setAdminSection(null); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "6px 4px", color: active ? "var(--gold)" : "var(--text3)", position: "relative" }}>
                  <div style={{ background: active ? "linear-gradient(135deg, rgba(201,146,42,0.2), rgba(201,146,42,0.05))" : "transparent", border: active ? "1px solid rgba(201,146,42,0.2)" : "1px solid transparent", borderRadius: 8, padding: 6, display: "flex", position: "relative" }}>
                    <SectionIcon icon={t.icon} size={20} />
                    {hasBadge && (
                      <div className="urgent-pulse" style={{ position: "absolute", top: -2, right: -4, width: 16, height: 16, borderRadius: "50%", background: "var(--red)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", ...f(9, 800), border: "2px solid var(--leather)" }}>{pendingMembers.length}</div>
                    )}
                  </div>
                  <span style={{ fontFamily: "'Oswald',sans-serif", fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: ".06em", textTransform: "uppercase" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <WhatsNewPopup />
      <SettingsPanel2 />
      <ConfirmModal2 />
      <Toast2 />
      <OfflineBanner />
      <UpdateBanner />
      <OfflineMessageOverlay />
      <SessionWarningModal />
      <FloorEditModal />
      {showProfile && <ProfilePage onBack={() => { setShowProfile(false); setProfileUserId(null); }} userId={profileUserId} />}
    </>
  );
}
