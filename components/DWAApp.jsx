/* DWA v1.5.0 */
import { useState, useEffect, useRef } from "react";
import { subscribeToFloorPosts, createFloorPost, deleteFloorPost, addFloorReply, deleteFloorReply, banUser, unbanUser, subscribeToBannedUsers, saveUploadedDocuments, loadUploadedDocuments, uploadDocumentFile, uploadFloorPhoto, saveAnnouncements as fbSaveAnnouncements, loadAnnouncements as fbLoadAnnouncements, saveStewards as fbSaveStewards, loadStewards as fbLoadStewards, saveMeetingInfo as fbSaveMeetingInfo, loadMeetingInfo as fbLoadMeetingInfo, saveZoomInfo as fbSaveZoomInfo, loadZoomInfo as fbLoadZoomInfo, saveMinutes as fbSaveMinutes, loadMinutes as fbLoadMinutes, saveSeniority as fbSaveSeniority, loadSeniority as fbLoadSeniority, registerUser, loginUser, logoutUser, onAuthChange, saveUserProfile, getUserProfile, subscribeToPendingMembers, approveMember, denyMember, subscribeToApprovedMembers, updateUserRole, deleteUserProfile, sendPasswordResetToUser } from "../lib/firebase";
import { getApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import ProfilePage from "./ProfilePage";
import { usePushNotifications } from "../hooks/usePushNotifications";
import HomeScreenExt from "./screens/HomeScreen";
import TheFloorExt from "./floor/TheFloor";
import GrievanceExt from "./screens/Grievance";
import DocumentsExt from "./screens/Documents";
import AdminLandingExt from "./screens/AdminLanding";
import AdminSectionsExt from "./screens/AdminSections";
import AnnouncementsExt from "./screens/Announcements";
import MinutesExt from "./screens/Minutes";
import SeniorityExt from "./screens/Seniority";
import ZoomExt from "./screens/Zoom";

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
  const push = usePushNotifications();
  // Notification inbox: persisted history of recent push notifications.
  const [notifInbox, setNotifInbox] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("dwa-notif-inbox") || "[]"); } catch { return []; }
  });
  const [notifInboxOpen, setNotifInboxOpen] = useState(false);
  const [notifLastRead, setNotifLastRead] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("dwa-notif-last-read") || 0);
  });
  const notifUnreadCount = notifInbox.filter(n => n.time > notifLastRead).length;
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

  // Capture incoming push notifications into the inbox + persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => {
      const detail = e.detail || {};
      const entry = {
        id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
        time: Date.now(),
        title: detail.title || "DWA Update",
        body: detail.body || "",
        type: detail.type || "general",
        url: detail.url || "/",
      };
      setNotifInbox(prev => {
        const next = [entry, ...prev].slice(0, 50);
        try { localStorage.setItem("dwa-notif-inbox", JSON.stringify(next)); } catch {}
        return next;
      });
    };
    window.addEventListener("dwa-push-notification", handler);
    return () => window.removeEventListener("dwa-push-notification", handler);
  }, []);

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
            <div style={{ ...row("center", 0), justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--seam)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...f(14, 600), color: "var(--text)" }}>Dark Mode</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>Switch between dark and light themes</div>
              </div>
              <Tog on={darkMode} flip={() => setDarkMode(!darkMode)} />
            </div>
            <div style={{ ...row("center", 0), justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--seam)", alignItems: "flex-start" }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{ ...f(14, 600), color: "var(--text)" }}>Push Notifications</div>
                <div style={{ ...f(11, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", marginTop: 2 }}>
                  {!push.isSupported ? "Not supported on this device" :
                   push.permission === "denied" ? "Blocked — enable in browser settings" :
                   push.permission === "granted" && push.token ? "On — meeting reminders & announcements" :
                   push.isLoading ? "Working…" :
                   "Get meeting reminders & announcements"}
                </div>
                {push.error && push.permission !== "denied" && (
                  <div style={{ ...f(10, 400, 'serif'), color: "#e87a7a", marginTop: 4 }}>{push.error}</div>
                )}
              </div>
              <Tog
                on={push.permission === "granted" && !!push.token}
                flip={async () => {
                  if (!push.isSupported || push.isLoading || push.permission === "denied") return;
                  if (push.permission === "granted" && push.token) {
                    await push.disableNotifications();
                  } else {
                    await push.requestPermission();
                  }
                }}
              />
            </div>
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

  // ── NOTIFICATION INBOX (slide-out) ──
  const NotifInbox2 = () => {
    if (!notifInboxOpen) return null;
    const typeIcons = { announcement: "📢", meeting: "📅", vote: "🗳️", grievance: "📋", general: "🔔" };
    const fmtTime = (ts) => {
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
    const clearAll = () => {
      setNotifInbox([]);
      try { localStorage.removeItem("dwa-notif-inbox"); } catch {}
    };
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9990, display: "flex", justifyContent: "flex-end", background: "rgba(0,0,0,0.4)" }} onClick={() => setNotifInboxOpen(false)}>
        <div style={{ width: 340, maxWidth: "92%", background: "var(--leather)", height: "100%", padding: "24px 18px", overflowY: "auto", boxShadow: "-4px 0 30px rgba(0,0,0,0.4)", borderLeft: "1px solid var(--seam)" }} onClick={e => e.stopPropagation()}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold),transparent)" }} />
          <div style={{ ...row("center", 0), justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ ...f(24, 400, 'bebas'), color: "var(--cream)", letterSpacing: ".08em" }}>NOTIFICATIONS</div>
            <button onClick={() => setNotifInboxOpen(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", ...f(20, 400) }}>×</button>
          </div>
          {notifInbox.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 12px" }}>
              <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.5 }}>🔔</div>
              <div style={{ ...f(13, 400, 'serif'), color: "var(--text3)", fontStyle: "italic", lineHeight: 1.6 }}>No notifications yet. We'll show updates here as they come in.</div>
            </div>
          ) : (
            <>
              <div style={{ ...col(8), marginBottom: 14 }}>
                {notifInbox.map(n => (
                  <div key={n.id} style={{ ...card({ padding: "12px 14px", borderLeft: `3px solid ${n.time > notifLastRead ? "var(--gold)" : "var(--seam)"}` }), display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 20, lineHeight: 1, marginTop: 2 }}>{typeIcons[n.type] || typeIcons.general}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...f(13, 700), color: "var(--cream)", marginBottom: 2 }}>{n.title}</div>
                      {n.body && <div style={{ ...f(12, 400, 'serif'), color: "var(--text2)", lineHeight: 1.45, marginBottom: 4 }}>{n.body}</div>}
                      <div style={{ ...f(10, 400, 'serif'), color: "var(--text3)", fontStyle: "italic" }}>{fmtTime(n.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={clearAll} style={{ ...btnOutline, width: "100%", padding: "10px", ...f(11, 700), letterSpacing: ".1em" }}>CLEAR ALL</button>
            </>
          )}
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
    // Snap UI clear immediately for optimistic feel
    if (floorPostRef.current) floorPostRef.current.value = "";
    const photoToUpload = floorPhoto;
    setFloorPhoto(null);
    setFloorPhotoPreview(null);
    if (floorPhotoRef.current) floorPhotoRef.current.value = "";
    setFloorPosting(true);
    try {
      let photoURL = null;
      if (photoToUpload) {
        photoURL = await uploadFloorPhoto(photoToUpload);
      }
      await createFloorPost({
        author: currentUserName,
        uid: currentUid,
        location: currentUserLocation,
        role: currentUserRole,
        text: text || "",
        photoURL,
      });
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


  const docFileIcon = (d) => {
    // returns color + label based on doc type hint
    if (d.fileType === "pdf" || d.name.toLowerCase().includes("form") || d.name.toLowerCase().includes("flyer")) return { color: "#e05c3a", bg: "rgba(224,92,58,0.12)", border: "rgba(224,92,58,0.25)", label: "PDF" };
    if (d.id === 1 || d.name.toLowerCase().includes("contract")) return { color: "var(--gold)", bg: "rgba(201,146,42,0.12)", border: "rgba(201,146,42,0.25)", label: "CBA" };
    if (d.id === 2 || d.name.toLowerCase().includes("bylaw")) return { color: "var(--gold2)", bg: "rgba(232,184,75,0.1)", border: "rgba(232,184,75,0.22)", label: "DOC" };
    if (d.fileType === "docx") return { color: "#4a9eff", bg: "rgba(74,158,255,0.1)", border: "rgba(74,158,255,0.22)", label: "DOC" };
    return { color: "var(--text3)", bg: "var(--leather3)", border: "var(--seam)", label: "FILE" };
  };

  const allDocCategories = ["All", ...Array.from(new Set(documents.map(d => d.category)))];



  const TABS = [
    { id: "home", label: "Home", icon: "home" },
    { id: "documents", label: "Docs", icon: "file" },
    { id: "zoom", label: "Zoom", icon: "video" },
    { id: "minutes", label: "Minutes", icon: "notes" },
    ...(hasOfficialAccess ? [{ id: "admin", label: "Officials", icon: "shield" }] : []),
  ];

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
            <button
              onClick={() => {
                setNotifInboxOpen(true);
                const now = Date.now();
                setNotifLastRead(now);
                try { localStorage.setItem("dwa-notif-last-read", String(now)); } catch {}
              }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex", position: "relative" }}
              title="Notifications"
            >
              <SectionIcon icon="bell" size={20} />
              {notifUnreadCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#e74c3c", color: "#fff", borderRadius: 9, minWidth: 16, height: 16, padding: "0 4px", display: "flex", alignItems: "center", justifyContent: "center", ...f(9, 700), border: "1px solid var(--leather)" }}>
                  {notifUnreadCount > 9 ? "9+" : notifUnreadCount}
                </span>
              )}
            </button>
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
          {!tabDataLoading && tab === "home" && <HomeScreenExt ctx={{ card, col, row, f, SectionIcon, LOGO_B64, showInstallBanner, setShowInstallBanner, showIOSInstallGuide, setShowIOSInstallGuide, handleInstallClick, nextMeeting, setTab, setSub, tileStyle, tileIconStyle }} />}
          {!tabDataLoading && tab === "theFloor" && <TheFloorExt ctx={{ card, col, row, f, inp, btnGold, SectionIcon, darkMode, floorPosts, floorLoading, floorReplyTo, setFloorReplyTo, bannedUsers, floorPhoto, setFloorPhoto, floorPhotoPreview, setFloorPhotoPreview, floorPosting, floorPostRef, floorReplyRef, floorPhotoRef, isCurrentUserBanned, currentUserName, currentUid, isAdmin, isSteward, handleFloorPost, handleFloorPhotoSelect, handleFloorReply, handleBanUser, handleFloorDelete, getInitials, formatFloorTime, RoleBadge, LocationTag, startFloorEdit, SkeletonList }} />}
          {!tabDataLoading && tab === "grievance" && <GrievanceExt ctx={{ card, col, f, inp, btnGold, btnOutline, lbl, SectionIcon, grievanceSubmitted, grievanceError, incidentDate, setIncidentDate, supervisorName, setSupervisorName, incidentTime, setIncidentTime, description, setDescription, remedy, setRemedy, witnesses, setWitnesses, contractArticle, setContractArticle, shakeKey, handleGrievance, resetGrievance }} />}
          {!tabDataLoading && tab === "documents" && <DocumentsExt ctx={{ card, col, row, f, inp, SectionIcon, documents, filteredDocs, docSearch, setDocSearch, docCat, setDocCat, allDocCategories, docFileIcon, setSub }} />}
          {!tabDataLoading && tab === "announcements" && <AnnouncementsExt ctx={{ col, f, card, annLang, setAnnLang, announcements, setSub }} />}
          {!tabDataLoading && tab === "zoom" && <ZoomExt ctx={{ col, card, row, f, SectionIcon, zoomInfo }} />}
          {!tabDataLoading && tab === "minutes" && <MinutesExt ctx={{ card, f, row, minLang, setMinLang, minutes }} />}
          {!tabDataLoading && tab === "seniority" && <SeniorityExt ctx={{ seniority, seniorityFilter, setSeniorityFilter, card, f }} />}
          {!tabDataLoading && tab === "admin" && !adminSection && <AdminLandingExt ctx={{ card, col, f, SectionIcon, pendingMembers, setAdminSection, isSteward, isSuper, bannedUsers, tileStyle, tileIconStyle }} />}

          {tab === "admin" && adminSection && <AdminSectionsExt section={adminSection} ctx={{ card, col, row, f, inp, btnGold, lbl, dropStyle, SectionIcon, Tog, isSuper, announcements, setAnnouncements, annTitle, setAnnTitle, annBody, setAnnBody, annUrgent, setAnnUrgent, annPosted, translating, setTranslating, editAnnId, setEditAnnId, postAnn, saveAnnouncements, seniority, setSeniority, editSenId, setEditSenId, newSenName, setNewSenName, newSenDate, setNewSenDate, newSenLocation, setNewSenLocation, senError, setSenError, saveSeniorityFn, pendingMembers, memberEmails, setMemberEmails, approveMember, denyMember, editMeeting, setEditMeeting, setNextMeeting, saveMeetingInfo, zoomInfo, editZoom, setEditZoom, setZoomInfo, saveZoomInfoFn, minutes, setMinutes, newMinTitle, setNewMinTitle, newMinDate, setNewMinDate, newMinSummary, setNewMinSummary, editMinId, setEditMinId, saveMinutesFn, documents, setDocuments, newDocFile, setNewDocFile, newDocName, setNewDocName, newDocCat, setNewDocCat, newDocDesc, setNewDocDesc, docUploadDrag, setDocUploadDrag, newDocUploading, setNewDocUploading, saveDocuments, uploadDocumentFile, stewardsData, setStewardsData, newContactName, setNewContactName, newContactPhone, setNewContactPhone, newContactDept, setNewContactDept, newContactTitle, setNewContactTitle, editContactId, setEditContactId, saveStewards, allApprovedUsers, userAdminSearch, setUserAdminSearch, setProfileUserId, setShowProfile, adminEmails, setAdminEmails, updateUserRole, deleteUserProfile, sendPasswordResetToUser, bannedUsers, handleUnbanUser, formatFloorTime, SUPER_ADMIN_EMAIL, newAdminEmail, setNewAdminEmail, adminMgmtError, setAdminMgmtError, newStewardName, setNewStewardName, newStewardDept, setNewStewardDept, newStewardPhone, setNewStewardPhone, adminSaved, saveFlash, setAdminSection, setConfirmModal, setToastMsg, pushToken: push.token }} />}
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
      <NotifInbox2 />
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
