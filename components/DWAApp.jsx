/* DWA v1.5.0 */
import { useState, useEffect, useRef } from "react";
import { subscribeToFloorPosts, createFloorPost, deleteFloorPost, addFloorReply, deleteFloorReply, banUser, unbanUser, subscribeToBannedUsers, saveUploadedDocuments, loadUploadedDocuments, uploadDocumentFile, uploadFloorPhoto, saveAnnouncements as fbSaveAnnouncements, loadAnnouncements as fbLoadAnnouncements, saveStewards as fbSaveStewards, loadStewards as fbLoadStewards, saveMeetingInfo as fbSaveMeetingInfo, loadMeetingInfo as fbLoadMeetingInfo, saveZoomInfo as fbSaveZoomInfo, loadZoomInfo as fbLoadZoomInfo, saveMinutes as fbSaveMinutes, loadMinutes as fbLoadMinutes, saveSeniority as fbSaveSeniority, loadSeniority as fbLoadSeniority, registerUser, loginUser, logoutUser, onAuthChange, saveUserProfile, getUserProfile, subscribeToPendingMembers, approveMember, denyMember, subscribeToApprovedMembers, updateUserRole, deleteUserProfile, sendPasswordResetToUser } from "../lib/firebase";
import { getApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import ProfilePage from "./ProfilePage";


// Extracted Constants
import { TEXTURE_B64, LOGO_B64, DWA_HANDS_LOGO, DWA_QR_CODE, DWA_FLYER_IMG, GRIEVANCE_FORM_HTML } from "./constants/assets";
import { ANNOUNCEMENTS, DOCUMENTS_DATA, DOC_CATEGORIES, CBA_ARTICLES, BYLAWS_ARTICLES, CBA_ARTICLES_ES, BYLAWS_ARTICLES_ES, STEWARDS, ISSUE_TYPES } from "./constants/data";
import { css } from "./styles/globalStyles";

// Extracted Components
import SectionIcon from "./ui/SectionIcon";
import { Tog, BackBar, StatusBadge, GoldDivider } from "./ui/MicroComponents";
import { ConfirmModal2, Toast2, WhatsNewPopup } from "./ui/Modals";
import { SkeletonCard, SkeletonList, SkeletonGrid } from "./ui/LoadingSkeletons";
import { OfflineBanner, OfflineActionOverlay, SessionTimeoutModal, UpdateBanner } from "./ui/SystemOverlays";
import FloorEditModal from "./floor/FloorEditModal";
import TheFloor from "./floor/TheFloor";
import TermsPage from "./pages/TermsOfUse";
import PrivacyPage from "./pages/PrivacyPolicy";
import LoginScreen from "./screens/LoginScreen";
import SettingsPanel from "./screens/SettingsPanel";
import HomeScreen from "./screens/HomeScreen";
import SubScreens from "./screens/SubScreens";
import ContentScreens from "./screens/ContentScreens";
import StewardView from "./screens/StewardView";

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
