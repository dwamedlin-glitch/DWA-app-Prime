// ââ DWA App Global Styles ââ
// Injected CSS for the app shell

import { TEXTURE_B64 } from "../constants/assets";

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  :root {
    --ink: #0d0b08;
    --leather: #1a1208;
    --leather2: #221a0a;
    --leather3: #2c2210;
    --leather4: #332814;
    --seam: #3d2e12;
    --gold: #c9922a;
    --gold2: #e8b84b;
    --gold3: #f5d070;
    --gold-glow: rgba(201,146,42,0.18);
    --gold-dim: rgba(201,146,42,0.08);
    --cream: #f0e6cc;
    --cream2: #d4c49a;
    --cream3: #a89060;
    --text: #ede0c4;
    --text2: #c4b08a;
    --text3: #8a7355;
    --red: #c0392b;
    --green: #2d7a4f;
    --blue: #2563a8;
  }
  html, body { height: 100%; height: 100dvh; width: 100%; overflow: hidden; }
  body { font-family: 'Oswald', sans-serif; background: var(--ink) url('/images/dark-bg.jpg') center center / cover no-repeat fixed; margin: 0; padding: 0; }
  #root { height: 100%; height: 100dvh; width: 100%; }
  #dwa-app-root { height: 100vh; height: 100dvh; }
  @media (max-width: 380px) { :root { font-size: 13px; } }
  @media (min-width: 430px) { :root { font-size: 16px; } }
  .scroll { flex:1; overflow-y:auto; overflow-x:hidden; padding-bottom:20px; -webkit-overflow-scrolling: touch; }
  .scroll::-webkit-scrollbar { width: 3px; }
  .scroll::-webkit-scrollbar-track { background: var(--leather); }
  .scroll::-webkit-scrollbar-thumb { background: var(--seam); border-radius: 2px; }
  .hscroll::-webkit-scrollbar { display:none; }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
  .shake { animation: shake .32s ease; }
  @keyframes rise { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .rise { animation: rise .28s ease forwards; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .fade { animation: fadeIn .2s ease forwards; }
  input::placeholder, textarea::placeholder { color: var(--text3); font-family: 'Oswald', sans-serif; }
  input, textarea, select { color-scheme: dark; max-width: 100%; box-sizing: border-box; }
  select option { background: var(--leather2); color: var(--text); }
  .tile { transition: transform .1s ease, filter .1s; cursor: pointer; }
  .tile:active { transform: scale(0.96); filter: brightness(0.9); }
  .tab-btn { transition: all .15s ease; }
  .gold-rule { height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .emboss { text-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 -1px 0 rgba(0,0,0,0.5); }
  .nav-glow { box-shadow: 0 -2px 20px rgba(201,146,42,0.12), 0 -1px 0 var(--seam); }
  .urgent-pulse { animation: urgentPulse 2s ease-in-out infinite; }
  @keyframes urgentPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
  .checkbox-custom { width: 20px; height: 20px; border-radius: 4px; border: 1.5px solid var(--seam); background: var(--leather3); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .checkbox-custom.checked { background: var(--gold); border-color: var(--gold2); }

  /* ââ LIGHT MODE ââ */
  .light-theme {
    --ink: #f5f0e8;
    --leather: #ffffff;
    --leather2: #f7f3ec;
    --leather3: #ede8dc;
    --leather4: #e4ddd0;
    --seam: #d0c5a8;
    --gold: #8b5e10;
    --gold2: #b07a1c;
    --gold3: #9a6a16;
    --gold-glow: rgba(139,94,16,0.10);
    --gold-dim: rgba(139,94,16,0.04);
    --cream: #2c1e0a;
    --cream2: #4a3a22;
    --cream3: #7a6a4e;
    --text: #1e140a;
    --text2: #4a3a22;
    --text3: #8a7a5e;
    --red: #b03020;
    --green: #1e6a3f;
    --blue: #1a5090;
  }
  .light-theme body {
    background: #f5f0e8 !important;
    background-image: none !important;
  }
  .light-theme #root { background: transparent; }
  .light-theme input,
  .light-theme textarea,
  .light-theme select { color-scheme: light; }
  .light-theme select option { background: #fff; color: var(--text); }
  .light-theme .nav-glow {
    background: #fff !important;
    box-shadow: 0 -1px 8px rgba(0,0,0,0.08), 0 -1px 0 var(--seam) !important;
  }
  .light-theme .tab-btn {
    color: var(--text3) !important;
  }
  .light-theme .tile {
    border: 1px solid var(--seam) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
  }
  .light-theme .scroll::-webkit-scrollbar-track { background: var(--leather); }
  .light-theme .scroll::-webkit-scrollbar-thumb { background: var(--seam); }
  .light-theme .emboss { text-shadow: none; }
  .light-theme .gold-rule { background: linear-gradient(90deg, transparent, var(--seam), transparent); }
  .light-theme .checkbox-custom { border-color: var(--seam); background: #fff; }
  .light-theme .checkbox-custom.checked { background: var(--gold); border-color: var(--gold2); }

  /* ââ SKELETON SHIMMER ââ */
  @keyframes skeleton-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .skeleton-line {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--leather2) 25%, var(--leather3) 50%, var(--leather2) 75%);
    background-size: 800px 100%;
    animation: skeleton-shimmer 1.6s ease-in-out infinite;
  }
  .skeleton-circle {
    border-radius: 50%;
    background: linear-gradient(90deg, var(--leather2) 25%, var(--leather3) 50%, var(--leather2) 75%);
    background-size: 800px 100%;
    animation: skeleton-shimmer 1.6s ease-in-out infinite;
  }
  .skeleton-rect {
    border-radius: 10px;
    background: linear-gradient(90deg, var(--leather2) 25%, var(--leather3) 50%, var(--leather2) 75%);
    background-size: 800px 100%;
    animation: skeleton-shimmer 1.6s ease-in-out infinite;
  }

  /* ââ OFFLINE BANNER ââ */
  @keyframes offline-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;
