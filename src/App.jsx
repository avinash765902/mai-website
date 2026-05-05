import { useState, useEffect, useRef } from "react";

// ─── Data helpers ────────────────────────────────────────────────────────────
const KEY = "mai_leads_v2";
const getLeads = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const setLeads = (d) => localStorage.setItem(KEY, JSON.stringify(d));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const ADMIN = { user: "admin", pass: "mai@2024" };

// ─── Global CSS ──────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --gold: #C9A96E;
  --gold-l: #E8D5B0;
  --gold-d: #A07840;
  --navy: #0f2040;
  --navy-d: #06101f;
  --navy-m: #142a4e;
  --dark: #0C0C0C;
  --mid: #1a1a1a;
  --light: #F5F3EF;
  --cream: #FAF8F4;
  --white: #ffffff;
  --grey: #888888;
  --border: #e8e4dc;
}

html { scroll-behavior: smooth; font-size: 16px; }
body { font-family: 'Outfit', sans-serif; background: var(--light); color: var(--dark); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

/* ── Keyframes ── */
@keyframes fadeIn    { from { opacity: 0; }                        to { opacity: 1; } }
@keyframes fadeOut   { from { opacity: 1; }                        to { opacity: 0; } }
@keyframes scaleIn   { from { transform: scale(0.82); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes slideUp   { from { transform: translateY(48px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideDown { from { transform: translateY(-60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideL    { from { transform: translateX(-70px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideR    { from { transform: translateX(70px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes pulse     { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
@keyframes float     { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes shimmer   { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes logoGlow  { 0%,100% { text-shadow: 0 0 30px rgba(201,169,110,0.4); } 50% { text-shadow: 0 0 60px rgba(201,169,110,0.8), 0 0 100px rgba(201,169,110,0.3); } }
@keyframes lineGrow  { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); } }
@keyframes gridMove  { 0% { transform: translate(0,0); } 100% { transform: translate(-30px,-30px); } }
@keyframes counterUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes barFill   { from { width: 0; } to { width: var(--w); } }
@keyframes spinDot   { to { transform: rotate(360deg); } }
@keyframes popIn     { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }

/* ── Building part entry ── */
.bA { animation: slideDown 0.65s cubic-bezier(0.16,1,0.3,1) both; }
.bB { animation: slideR    0.65s cubic-bezier(0.16,1,0.3,1) 0.07s both; }
.bC { animation: slideL    0.65s cubic-bezier(0.16,1,0.3,1) 0.14s both; }
.bD { animation: slideR    0.65s cubic-bezier(0.16,1,0.3,1) 0.21s both; }
.bE { animation: slideL    0.65s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
.bF { animation: slideUp   0.70s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
.bG { animation: slideR    0.55s cubic-bezier(0.16,1,0.3,1) 0.42s both; }
.bH { animation: scaleIn   0.45s ease                       0.50s both; }
.bI { animation: fadeIn    0.60s ease                       0.60s both; }

/* ── Nav ── */
.n-link { position: relative; transition: color 0.3s; font-family:'Outfit',sans-serif; }
.n-link::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:var(--gold); transition:width 0.3s ease; }
.n-link:hover::after { width:100%; }
.n-link:hover { color:var(--gold) !important; }

/* ── Gold shimmer text ── */
.gold-t {
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-l) 50%, var(--gold) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

/* ── Scroll reveal ── */
.rev { opacity:0; transform:translateY(28px); transition:opacity 0.75s ease, transform 0.75s ease; }
.rev.vis { opacity:1; transform:translateY(0); }
.rev.vis:nth-child(2) { transition-delay: 0.1s; }
.rev.vis:nth-child(3) { transition-delay: 0.2s; }

/* ── Service cards ── */
.s-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s; cursor:default; }
.s-card:hover { transform: translateY(-10px); }

/* ── Floating buttons ── */
.fab {
  position:fixed; right:20px; z-index:1000; border-radius:50%;
  width:52px; height:52px; display:flex; align-items:center; justify-content:center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.22); text-decoration:none;
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
  animation: float 3.5s ease-in-out infinite;
}
.fab:hover { transform:scale(1.12) translateY(-2px) !important; box-shadow:0 10px 30px rgba(0,0,0,0.3) !important; animation:none; }

/* ── Form ── */
.f-inp {
  width:100%; padding:13px 16px; border:1px solid var(--border); border-radius:8px;
  font-family:'Outfit',sans-serif; font-size:15px; outline:none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.f-inp:focus { border-color:var(--gold); box-shadow: 0 0 0 3px rgba(201,169,110,0.15); }

/* ── Admin ── */
.a-item {
  padding:12px 22px; cursor:pointer; transition:all 0.2s;
  display:flex; align-items:center; gap:11px; color:#777; font-size:14px; font-weight:500;
  border-left: 3px solid transparent;
}
.a-item:hover, .a-item.on { color:var(--gold); border-left-color:var(--gold); background:rgba(201,169,110,0.07); }

table { width:100%; border-collapse:collapse; }
th { text-align:left; padding:11px 16px; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:var(--grey); border-bottom:1px solid #eee; background:#fafaf8; }
td { padding:13px 16px; font-size:14px; border-bottom:1px solid #f4f4f2; vertical-align:middle; }
tr:hover td { background:#fafaf8; }

::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-thumb { background:#ddd; border-radius:3px; }
::-webkit-scrollbar-track { background:transparent; }

/* ── Responsive ── */
.d-flex { display:flex; }
.m-hide { display:flex; }
.hamburger { display:none; }

@media (max-width: 768px) {
  .m-hide { display:none !important; }
  .hamburger { display:flex !important; }
  .two-col { grid-template-columns: 1fr !important; gap:48px !important; }
  .three-col { grid-template-columns: 1fr !important; }
  .four-grid { grid-template-columns: 1fr 1fr !important; }
  .adm-wrap { flex-direction: column !important; }
  .adm-side { width:100% !important; min-height:auto !important; }
  .adm-nav-row { flex-direction:row; overflow-x:auto; gap:0; padding:4px 0; }
  .a-item { border-left:none !important; border-bottom:3px solid transparent; flex-direction:column; font-size:11px; padding:8px 14px; gap:4px; }
  .a-item.on { border-bottom-color:var(--gold); border-left:none !important; }
  .fab { width:46px; height:46px; right:14px; }
  .hero-h1 { font-size: clamp(2.4rem,8vw,3.5rem) !important; }
  .stat-row { gap:24px !important; }
  .about-stat-grid { grid-template-columns: 1fr 1fr !important; }
  .contact-info { display:none; }
}
`;

function injectCSS() {
  if (document.getElementById("mai-css")) return;
  const s = document.createElement("style");
  s.id = "mai-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ─── Preloader ───────────────────────────────────────────────────────────────
function Preloader({ onDone }) {
  const [phase, setPhase] = useState(0);
  // 0=logo glow, 1=dissolve, 2=building assembles, 3=zoom+tagline, 4=exit

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 1100),
      setTimeout(() => setPhase(2), 1700),
      setTimeout(() => setPhase(3), 3100),
      setTimeout(() => setPhase(4), 3700),
      setTimeout(() => onDone(), 4200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(135deg,#06101f 0%,#0f2040 60%,#06101f 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: phase === 4 ? "opacity 0.5s ease, transform 0.5s ease" : "none",
      opacity: phase === 4 ? 0 : 1,
      transform: phase === 4 ? "scale(1.04)" : "scale(1)",
      pointerEvents: phase === 4 ? "none" : "all",
      overflow: "hidden",
    }}>
      {/* Animated grid background */}
      <div style={{
        position: "absolute", inset: -60,
        backgroundImage: `linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)`,
        backgroundSize: "55px 55px",
        animation: "gridMove 12s linear infinite",
      }} />

      {/* Phase 0–1: Logo */}
      {phase < 2 && (
        <div style={{
          textAlign: "center",
          opacity: phase >= 1 ? 0 : 1,
          transform: phase >= 1 ? "scale(1.15)" : "scale(1)",
          transition: "opacity 0.55s ease, transform 0.55s ease",
          animation: phase === 0 ? "scaleIn 0.9s cubic-bezier(0.16,1,0.3,1) both" : "none",
        }}>
          <div style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 84, fontWeight: 600, color: "#C9A96E",
            letterSpacing: "0.12em", lineHeight: 1,
            animation: phase === 0 ? "logoGlow 2s ease-in-out infinite" : "none",
          }}>MAI</div>
          <div style={{ width: 120, height: 1, background: "linear-gradient(90deg,transparent,#C9A96E,transparent)", margin: "14px auto 18px" }} />
          <div style={{ fontSize: 11, letterSpacing: "0.42em", color: "rgba(201,169,110,0.7)", textTransform: "uppercase", fontWeight: 400 }}>
            INFRA CONSULTANTS LLP
          </div>
        </div>
      )}

      {/* Phase 2–3: Building */}
      {phase >= 2 && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          transform: phase >= 3 ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <BuildingIllustration />
          <div style={{
            marginTop: 28, textAlign: "center",
            animation: "fadeIn 0.7s ease 1.1s both",
          }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "#C9A96E", letterSpacing: "0.35em", fontWeight: 400 }}>
              BUILDING YOUR FUTURE
            </div>
            <div style={{ width: 60, height: 1, background: "linear-gradient(90deg,transparent,#C9A96E,transparent)", margin: "10px auto 0", animation: "lineGrow 0.6s ease 1.6s both" }} />
          </div>
        </div>
      )}

      {/* Loading dots */}
      {phase < 2 && (
        <div style={{ position: "absolute", bottom: 56, display: "flex", gap: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%", background: "#C9A96E",
              animation: `pulse 1.3s ease ${i * 0.22}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Corner accents */}
      {["top:0,left:0,borderTop,borderLeft", "top:0,right:0,borderTop,borderRight", "bottom:0,left:0,borderBottom,borderLeft", "bottom:0,right:0,borderBottom,borderRight"].map((cfg, i) => {
        const [v, h, bv, bh] = cfg.split(",");
        const pos = {};
        v.split(":").forEach(([k, ...vs]) => { if (k) pos[k] = vs.join(":") || 0; });
        h.split(":").forEach(([k, ...vs]) => { if (k) pos[k] = vs.join(":") || 0; });
        return (
          <div key={i} style={{
            position: "absolute", ...{ top: v === "top:0" ? 20 : "auto", bottom: v === "bottom:0" ? 20 : "auto", left: h === "left:0" ? 20 : "auto", right: h === "right:0" ? 20 : "auto" },
            width: 40, height: 40,
            [bv]: "1px solid rgba(201,169,110,0.3)",
            [bh]: "1px solid rgba(201,169,110,0.3)",
            opacity: 0.6,
          }} />
        );
      })}
    </div>
  );
}

function BuildingIllustration() {
  const win = (count, h, hi = false) => (
    <div style={{ display: "flex", gap: 3, padding: "0 8px", alignItems: "center", height: "100%", justifyContent: "center" }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: h,
          background: hi && i % 3 === 0
            ? "rgba(201,169,110,0.55)"
            : i % 2 === 0 ? "rgba(100,150,220,0.35)" : "rgba(201,169,110,0.25)",
          borderRadius: 1,
        }} />
      ))}
    </div>
  );

  const floors = [
    { cls: "bA", w: 4, h: 48, el: <div style={{ width: 4, height: 48, background: "linear-gradient(to bottom,#C9A96E,rgba(201,169,110,0.2))", borderRadius: 2 }} />, noWin: true },
    { cls: "bB", w: 70, h: 28, bg: "linear-gradient(135deg,#1B3A6B,#2a5298)", r: "4px 4px 0 0", el: win(4, 16) },
    { cls: "bC", w: 110, h: 38, bg: "linear-gradient(135deg,#142a4e,#1B3A6B)", el: win(6, 22, true) },
    { cls: "bD", w: 138, h: 44, bg: "linear-gradient(135deg,#0f2040,#142a4e)", el: win(7, 28, true) },
    { cls: "bE", w: 160, h: 50, bg: "linear-gradient(135deg,#0a1a30,#0f2040)", el: win(8, 32, true) },
    { cls: "bF", w: 178, h: 44, bg: "linear-gradient(135deg,#06101f,#0a1a30)", bt: "2px solid #C9A96E", el: win(9, 28) },
    { cls: "bG", w: 196, h: 14, bg: "#C9A96E", r: "0 0 3px 3px", noWin: true },
    { cls: "bH", w: 220, h: 2, bg: "linear-gradient(90deg,transparent,#C9A96E 30%,#C9A96E 70%,transparent)", noWin: true },
    { cls: "bI", w: 260, h: 1, bg: "linear-gradient(90deg,transparent,rgba(201,169,110,0.3),transparent)", noWin: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {floors.map(({ cls, w, h, bg, r, bt, el, noWin }) => (
        <div key={cls} className={cls} style={{
          width: w, height: h,
          background: bg,
          borderRadius: r,
          borderTop: bt,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {!noWin && el}
          {noWin && el}
        </div>
      ))}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ onAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const navBg = scrolled ? "rgba(255,255,255,0.96)" : "transparent";
  const shadow = scrolled ? "0 1px 24px rgba(0,0,0,0.08)" : "none";
  const txtC = scrolled ? "#333" : "rgba(255,255,255,0.88)";
  const logoC = scrolled ? "#0C0C0C" : "#fff";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      background: navBg, backdropFilter: scrolled ? "blur(20px)" : "none",
      boxShadow: shadow,
      transition: "background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 21, fontWeight: 600, color: logoC, letterSpacing: "0.04em", cursor: "pointer", transition: "color 0.4s" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span style={{ color: "#C9A96E" }}>MAI</span> INFRA
        </div>

        {/* Desktop nav */}
        <div className="m-hide" style={{ alignItems: "center", gap: 36 }}>
          {["about", "services", "contact"].map(id => (
            <button key={id} onClick={() => go(id)} className="n-link" style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              color: txtC, transition: "color 0.4s", padding: 0,
            }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
          ))}
          <Btn onClick={onAdmin} small outline>Admin ↗</Btn>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setOpen(!open)} style={{
          background: "none", border: "none", cursor: "pointer",
          flexDirection: "column", gap: 5, padding: 6,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 22, height: 2, background: scrolled ? "#333" : "#fff", borderRadius: 2,
              transition: "all 0.3s",
              transform: open && i === 0 ? "rotate(45deg) translate(5px,5px)" : open && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
              opacity: open && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{
        overflow: "hidden", maxHeight: open ? 220 : 0,
        transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
        background: "#fff", borderTop: open ? "1px solid #eee" : "none",
      }}>
        {["about", "services", "contact"].map(id => (
          <button key={id} onClick={() => go(id)} style={{
            display: "block", width: "100%", padding: "15px 24px",
            background: "none", border: "none", textAlign: "left", cursor: "pointer",
            fontSize: 13, fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "#333", fontFamily: "Outfit,sans-serif",
          }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
        ))}
        <div style={{ padding: "12px 24px 16px" }}>
          <Btn onClick={onAdmin} small>Admin Portal</Btn>
        </div>
      </div>
    </nav>
  );
}

// ─── Reusable Button ─────────────────────────────────────────────────────────
function Btn({ children, onClick, small, outline, full, disabled, loading, dark }) {
  const [hov, setHov] = useState(false);
  const base = {
    padding: small ? "9px 22px" : "15px 40px",
    border: outline ? "1px solid #C9A96E" : "none",
    borderRadius: 5, cursor: disabled ? "not-allowed" : "pointer",
    fontSize: small ? 12 : 13, fontWeight: 600,
    letterSpacing: "0.14em", textTransform: "uppercase",
    fontFamily: "Outfit,sans-serif",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.65 : 1,
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
  };
  const style = outline
    ? { ...base, background: hov ? "#C9A96E" : "transparent", color: hov ? "#fff" : "#C9A96E" }
    : dark
    ? { ...base, background: hov ? "#0a1a30" : "#fff", color: hov ? "#C9A96E" : "#333" }
    : { ...base, background: hov ? "#A07840" : "#C9A96E", color: "#fff", boxShadow: hov ? "0 14px 36px rgba(201,169,110,0.45)" : "0 6px 24px rgba(201,169,110,0.3)", transform: hov ? "translateY(-2px)" : "translateY(0)" };

  return (
    <button onClick={onClick} disabled={disabled} style={style}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {loading ? <><Spinner />Submitting…</> : children}
    </button>
  );
}

function Spinner() {
  return <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spinDot 0.7s linear infinite" }} />;
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(145deg,#06101f 0%,#0f2040 45%,#142a4e 80%,#0a1a30 100%)",
    }}>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: -80,
        backgroundImage: "linear-gradient(rgba(201,169,110,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.045) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        animation: "gridMove 15s linear infinite",
      }} />

      {/* Diagonal glow */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "55%", height: "120%", background: "radial-gradient(ellipse at center,rgba(201,169,110,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "40%", height: "80%", background: "radial-gradient(ellipse at center,rgba(27,58,107,0.3) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "110px 24px 70px", maxWidth: 860 }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 22px", border: "1px solid rgba(201,169,110,0.35)", borderRadius: 100, marginBottom: 36, animation: "fadeIn 1s ease 0.2s both" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A96E", animation: "pulse 2s ease infinite" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(201,169,110,0.85)", textTransform: "uppercase", fontWeight: 500 }}>Est. 2018 · Mumbai, India</span>
        </div>

        <h1 className="hero-h1" style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(3rem,6.5vw,5.8rem)",
          fontWeight: 600, lineHeight: 1.08, color: "#fff",
          marginBottom: 28, letterSpacing: "-0.01em",
          animation: "slideUp 1s cubic-bezier(0.16,1,0.3,1) 0.35s both",
        }}>
          Building Trust.<br />
          <span className="gold-t">Creating Landmarks.</span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem,2vw,1.18rem)", color: "rgba(255,255,255,0.58)",
          marginBottom: 52, lineHeight: 1.75, fontWeight: 300, maxWidth: 580, margin: "0 auto 52px",
          animation: "slideUp 1s cubic-bezier(0.16,1,0.3,1) 0.55s both",
        }}>
          Premium Real Estate & Infrastructure Solutions across Mumbai —<br />
          Residential, Commercial, and Investment Advisory.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "slideUp 1s cubic-bezier(0.16,1,0.3,1) 0.75s both" }}>
          <Btn onClick={() => go("contact")}>Get Free Consultation</Btn>
          <Btn onClick={() => go("services")} outline>Explore Services</Btn>
        </div>

        {/* Stats row */}
        <div className="stat-row" style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 88, flexWrap: "wrap", animation: "fadeIn 1s ease 1.1s both" }}>
          {[["50+", "Projects Delivered"], ["₹500Cr+", "Worth Managed"], ["500+", "Happy Clients"], ["98%", "Satisfaction Rate"]].map(([n, l], i) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 600, color: "#C9A96E", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", marginTop: 6, textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "fadeIn 1s ease 1.6s both" }}>
        <span style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom,rgba(201,169,110,0.5),transparent)", animation: "float 2.2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add("vis"); io.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return ref;
}

function About() {
  const ref = useReveal();
  return (
    <section id="about" style={{ padding: "110px 5%", background: "#FAF8F4" }}>
      <div ref={ref} className="rev" style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 90, alignItems: "center" }}>
          {/* Text */}
          <div>
            <Tag>Who We Are</Tag>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(2.1rem,4vw,3.2rem)", fontWeight: 600, lineHeight: 1.18, color: "#0C0C0C", margin: "20px 0 24px" }}>
              A Legacy of Trust in<br />Mumbai Real Estate
            </h2>
            <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.9, marginBottom: 18, fontWeight: 300 }}>
              MAI Infra Consultants LLP is Mumbai's trusted partner for premium real estate. Founded on pillars of transparency, integrity, and excellence — we have helped over 500 families and businesses find their perfect space.
            </p>
            <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.9, fontWeight: 300, marginBottom: 36 }}>
              From residences in Thane and Navi Mumbai to commercial spaces in BKC and Lower Parel — our results stand the test of time.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {[["MahaRERA Certified", "✓"], ["CREDAI Member", "✓"], ["ISO 9001:2015", "✓"]].map(([l, ic]) => (
                <div key={l} style={{ fontSize: 12, color: "#C9A96E", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 10, background: "#C9A96E", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{ic}</span>
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div className="four-grid about-stat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              { icon: "🏗️", n: "50+", t: "Trusted Projects", d: "Delivered on time & budget" },
              { icon: "📍", n: "12", t: "Prime Locations", d: "Across key Mumbai zones" },
              { icon: "🤝", n: "0", t: "Hidden Charges", d: "Full transparency, always" },
              { icon: "⭐", n: "500+", t: "Happy Clients", d: "Long-term relationships" },
            ].map(({ icon, n, t, d }) => (
              <StatCard key={t} icon={icon} n={n} t={t} d={d} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, n, t, d }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "#fff", borderRadius: 14, padding: 24,
      boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.1)" : "0 3px 16px rgba(0,0,0,0.05)",
      transform: hov ? "translateY(-5px)" : "translateY(0)",
      transition: "all 0.38s cubic-bezier(0.16,1,0.3,1)",
      border: hov ? "1px solid rgba(201,169,110,0.2)" : "1px solid transparent",
    }}>
      <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 32, fontWeight: 700, color: "#C9A96E", lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0C0C0C", margin: "5px 0 3px" }}>{t}</div>
      <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>{d}</div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 1, background: "#C9A96E" }} />
      <span style={{ fontSize: 10, letterSpacing: "0.36em", color: "#C9A96E", textTransform: "uppercase", fontWeight: 700 }}>{children}</span>
    </div>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
function Services() {
  const ref = useReveal();
  const go = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  const cards = [
    { icon: "🏠", title: "Residential Projects", desc: "From compact 1BHKs to luxury penthouses — find the home that perfectly fits your lifestyle and aspirations.", features: ["Ready Possession Flats", "Under Construction", "Villas & Row Houses", "RERA Verified Only"] },
    { icon: "🏢", title: "Commercial Projects", desc: "Office spaces, retail shops, and business centres in Mumbai's most sought-after commercial corridors.", features: ["IT Parks & Offices", "Retail & Showrooms", "Co-working Spaces", "Industrial & Warehouse"] },
    { icon: "📈", title: "Investment Advisory", desc: "Make your capital work smarter with data-driven real estate investment strategies and portfolio guidance.", features: ["ROI Projections", "Portfolio Analysis", "Risk Assessment", "Pre-launch Access"] },
  ];

  return (
    <section id="services" style={{ padding: "110px 5%", background: "#fff" }}>
      <div ref={ref} className="rev" style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 68 }}>
          <Tag>What We Do</Tag>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(2.1rem,4vw,3rem)", fontWeight: 600, color: "#0C0C0C", margin: "18px 0 14px" }}>Our Services</h2>
          <p style={{ fontSize: 15, color: "#999", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Comprehensive real estate solutions crafted for your unique needs and aspirations.</p>
        </div>

        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
          {cards.map((c, i) => <ServiceCard key={c.title} {...c} i={i} onEnquire={go} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, desc, features, i, onEnquire }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="s-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? "#fff" : "#F5F3EF",
      border: `1px solid ${hov ? "rgba(201,169,110,0.3)" : "rgba(0,0,0,0.05)"}`,
      borderRadius: 18, padding: 36,
      boxShadow: hov ? "0 24px 56px rgba(0,0,0,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ fontSize: 44, marginBottom: 22 }}>{icon}</div>
      <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 600, color: "#0C0C0C", marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75, marginBottom: 26 }}>{desc}</p>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, marginBottom: 30 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#555" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A96E", flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
      <button onClick={onEnquire} style={{
        padding: "10px 22px", background: hov ? "#C9A96E" : "transparent",
        border: "1px solid #C9A96E", borderRadius: 5, color: hov ? "#fff" : "#C9A96E",
        fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
        cursor: "pointer", fontFamily: "Outfit,sans-serif", transition: "all 0.3s",
      }}>Enquire Now →</button>
    </div>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function Contact({ onLead }) {
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", phone: "", requirement: "" });
  const [st, setSt] = useState("idle"); // idle | loading | ok | err

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.requirement) { setSt("err"); return; }
    setSt("loading");
    setTimeout(() => {
      const leads = getLeads();
      leads.unshift({ id: uid(), ...form, createdAt: new Date().toISOString() });
      setLeads(leads);
      setSt("ok");
      setForm({ name: "", phone: "", requirement: "" });
      onLead?.();
    }, 1100);
  };

  return (
    <section id="contact" style={{ padding: "110px 5%", background: "linear-gradient(145deg,#06101f 0%,#0f2040 60%,#06101f 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -80, backgroundImage: "linear-gradient(rgba(201,169,110,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.03) 1px,transparent 1px)", backgroundSize: "55px 55px", animation: "gridMove 20s linear infinite" }} />

      <div ref={ref} className="rev" style={{ maxWidth: 1020, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Info */}
          <div className="contact-info">
            <Tag>Get In Touch</Tag>
            <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: "#fff", margin: "20px 0 20px", lineHeight: 1.18 }}>
              Start Your Property<br />Journey Today
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, marginBottom: 44, fontWeight: 300 }}>
              Our experts guide you through every step — from property search to final documentation. One call is all it takes.
            </p>
            {[
              { ic: "📞", l: "Call Us", v: "+91 98765 43210" },
              { ic: "📧", l: "Email", v: "hello@maiinfra.in" },
              { ic: "📍", l: "Office", v: "BKC, Bandra East, Mumbai – 400051" },
              { ic: "⏰", l: "Hours", v: "Mon–Sat, 9 AM – 7 PM" },
            ].map(({ ic, l, v }) => (
              <div key={l} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 22 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{ic}</div>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: 44 }}>
            {st === "ok" ? (
              <div style={{ textAlign: "center", padding: "44px 0", animation: "popIn 0.5s ease both" }}>
                <div style={{ fontSize: 60, marginBottom: 18 }}>✅</div>
                <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, color: "#fff", marginBottom: 10 }}>Thank You!</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>Our team will reach out within 24 hours to discuss your requirements.</p>
                <button onClick={() => setSt("idle")} style={{ marginTop: 28, background: "none", border: "1px solid rgba(201,169,110,0.5)", borderRadius: 5, color: "#C9A96E", padding: "10px 24px", cursor: "pointer", fontSize: 12, fontFamily: "Outfit,sans-serif", letterSpacing: "0.1em" }}>Submit Another →</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <h3 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, color: "#fff", marginBottom: 28 }}>Request Free Consultation</h3>

                {[
                  { k: "name", ph: "Your Full Name", label: "Full Name", type: "text" },
                  { k: "phone", ph: "+91 XXXXX XXXXX", label: "Phone Number", type: "tel" },
                ].map(({ k, ph, label, type }) => (
                  <div key={k} style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{label} *</label>
                    <input className="f-inp" type={type} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)}
                      style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 26 }}>
                  <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Requirement *</label>
                  <select className="f-inp" value={form.requirement} onChange={e => set("requirement", e.target.value)}
                    style={{ background: "#0f2040", borderColor: "rgba(255,255,255,0.12)", color: form.requirement ? "#fff" : "rgba(255,255,255,0.4)" }}>
                    <option value="" style={{ background: "#0f2040" }}>Select your requirement</option>
                    {["Buy Residential Property", "Buy Commercial Property", "Rent a Property", "Investment Advisory", "Plot / Land", "New Launch Info", "Other"].map(o => (
                      <option key={o} value={o} style={{ background: "#0f2040" }}>{o}</option>
                    ))}
                  </select>
                </div>

                {st === "err" && <p style={{ fontSize: 13, color: "#ff7b7b", marginBottom: 14 }}>⚠ Please fill in all fields.</p>}

                <Btn onClick={submit} full loading={st === "loading"} disabled={st === "loading"}>
                  Submit Enquiry →
                </Btn>

                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>Your data is secure and will never be shared with third parties.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials strip ───────────────────────────────────────────────────────
function Testimonials() {
  const ref = useReveal();
  const items = [
    { q: "MAI made buying our first home in Thane completely stress-free. Full transparency, no surprises.", n: "Rajesh & Priya Sharma", r: "Homebuyers, Thane" },
    { q: "Best investment advisory I've experienced. Their pre-launch access to projects delivered 28% returns.", n: "Sandeep Mehta", r: "Investor, BKC Office" },
    { q: "Professional team, RERA-compliant listings, and they genuinely care about finding the right fit.", n: "Anita Desai", r: "Commercial Tenant, Lower Parel" },
  ];
  return (
    <section style={{ padding: "90px 5%", background: "#F5F3EF" }}>
      <div ref={ref} className="rev" style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Tag>Client Stories</Tag>
          <h2 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 600, color: "#0C0C0C", marginTop: 18 }}>What Our Clients Say</h2>
        </div>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {items.map(({ q, n, r }) => (
            <div key={n} style={{ background: "#fff", borderRadius: 16, padding: 30, boxShadow: "0 3px 16px rgba(0,0,0,0.05)", borderTop: "3px solid #C9A96E" }}>
              <div style={{ fontSize: 32, color: "#C9A96E", lineHeight: 1, marginBottom: 16, fontFamily: "Cormorant Garamond,serif" }}>"</div>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 22, fontStyle: "italic" }}>{q}</p>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#0C0C0C" }}>{n}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ onAdmin }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer style={{ background: "#06101f", padding: "56px 5% 28px", borderTop: "1px solid rgba(201,169,110,0.18)" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 10 }}>
              <span style={{ color: "#C9A96E" }}>MAI</span> Infra Consultants LLP
            </div>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>Building Trust. Creating Landmarks. Your trusted partner for premium real estate in Mumbai.</p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C9A96E", textTransform: "uppercase", marginBottom: 18, fontWeight: 700 }}>Navigate</div>
            {["about", "services", "contact"].map(id => (
              <button key={id} onClick={() => go(id)} style={{ display: "block", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, marginBottom: 12, fontFamily: "Outfit,sans-serif", textTransform: "capitalize", padding: 0, transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = "#C9A96E"} onMouseLeave={e => e.target.style.color = "#555"}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C9A96E", textTransform: "uppercase", marginBottom: 18, fontWeight: 700 }}>Contact</div>
            {["+91 98765 43210", "hello@maiinfra.in", "BKC, Mumbai – 400051"].map(t => (
              <div key={t} style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>{t}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#C9A96E", textTransform: "uppercase", marginBottom: 18, fontWeight: 700 }}>Certifications</div>
            {["MahaRERA Certified", "CREDAI Member", "ISO 9001:2015", "NAR India Member"].map(b => (
              <div key={b} style={{ fontSize: 12, color: "#555", marginBottom: 9, display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9A96E" }} />{b}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#444" }}>© 2024 MAI Infra Consultants LLP. All rights reserved.</div>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ fontSize: 12, color: "#444" }}>MahaRERA No: P51900038291</span>
            <button onClick={onAdmin} style={{ fontSize: 12, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit,sans-serif" }}
              onMouseEnter={e => e.target.style.color = "#C9A96E"} onMouseLeave={e => e.target.style.color = "#555"}>
              Admin →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Buttons ────────────────────────────────────────────────────────
function FloatingBtns() {
  return (
    <>
      <a href="https://wa.me/919876543210?text=Hi%20MAI%20Infra!%20I%27d%20like%20to%20know%20more%20about%20your%20properties."
        target="_blank" rel="noopener noreferrer" className="fab"
        style={{ bottom: 88, background: "#25D366", animationDelay: "0s" }}
        title="Chat on WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
      <a href="tel:+919876543210" className="fab"
        style={{ bottom: 28, background: "linear-gradient(135deg,#1B3A6B,#2a5298)", animationDelay: "0.5s" }}
        title="Call Us">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>
    </>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin, onBack }) {
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (!creds.user || !creds.pass) { setErr("Please enter credentials."); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      if (creds.user === ADMIN.user && creds.pass === ADMIN.pass) { onLogin(); }
      else { setErr("Invalid username or password."); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg,#06101f 0%,#0f2040 100%)", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)", backgroundSize: "55px 55px" }} />
      <div style={{ width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: 52, position: "relative", animation: "scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 42, color: "#C9A96E", fontWeight: 600, animation: "logoGlow 3s ease-in-out infinite" }}>MAI</div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.35em", textTransform: "uppercase", marginTop: 4 }}>Admin Portal</div>
          <div style={{ width: 50, height: 1, background: "linear-gradient(90deg,transparent,#C9A96E,transparent)", margin: "14px auto 0" }} />
        </div>

        {[["user", "Username", "text", "admin"], ["pass", "Password", "password", "••••••••"]].map(([k, l, t, ph]) => (
          <div key={k} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>{l}</label>
            <input className="f-inp" type={t} placeholder={ph} value={creds[k]} onChange={e => setCreds(c => ({ ...c, [k]: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && login()}
              style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }} />
          </div>
        ))}

        {err && <p style={{ fontSize: 13, color: "#ff7b7b", marginBottom: 16 }}>⚠ {err}</p>}
        <Btn onClick={login} full loading={loading} disabled={loading}>Sign In</Btn>

        <p style={{ fontSize: 11, color: "#444", textAlign: "center", marginTop: 20 }}>Hint: admin / mai@2024</p>

        <button onClick={onBack} style={{ display: "block", margin: "18px auto 0", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13, fontFamily: "Outfit,sans-serif" }}
          onMouseEnter={e => e.target.style.color = "#C9A96E"} onMouseLeave={e => e.target.style.color = "#555"}>
          ← Back to Website
        </button>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDash({ onLogout }) {
  const [leads, setLeadsState] = useState(getLeads());
  const [tab, setTab] = useState("leads");
  const [q, setQ] = useState("");
  const [delId, setDelId] = useState(null);

  const refresh = () => setLeadsState(getLeads());

  const del = (id) => {
    const u = leads.filter(l => l.id !== id);
    setLeads(u); setLeadsState(u); setDelId(null);
  };

  const exportCSV = () => {
    const hdr = "Name,Phone,Requirement,Date\n";
    const rows = leads.map(l => `"${l.name}","${l.phone}","${l.requirement}","${new Date(l.createdAt).toLocaleDateString("en-IN")}"`).join("\n");
    const blob = new Blob([hdr + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `MAI_Leads_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const filtered = leads.filter(l =>
    [l.name, l.phone, l.requirement].some(v => v.toLowerCase().includes(q.toLowerCase()))
  );

  const now = new Date();
  const thisMonth = leads.filter(l => {
    const d = new Date(l.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const reqCounts = {};
  leads.forEach(l => { reqCounts[l.requirement] = (reqCounts[l.requirement] || 0) + 1; });

  return (
    <div className="adm-wrap" style={{ display: "flex", minHeight: "100vh", fontFamily: "Outfit,sans-serif", background: "#F5F3EF" }}>

      {/* Sidebar */}
      <div className="adm-side" style={{ width: 240, background: "#0C0C0C", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 22px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, color: "#C9A96E", fontWeight: 600 }}>MAI</div>
          <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.25em", marginTop: 2 }}>ADMIN PORTAL</div>
        </div>
        <div className="adm-nav-row" style={{ display: "flex", flexDirection: "column", padding: "12px 0", flex: 1 }}>
          {[{ id: "leads", ic: "👤", l: "Leads" }, { id: "analytics", ic: "📊", l: "Analytics" }].map(({ id, ic, l }) => (
            <div key={id} className={`a-item ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>
              <span style={{ fontSize: 16 }}>{ic}</span> {l}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="a-item" onClick={onLogout}>
            <span style={{ fontSize: 16 }}>🚪</span> Logout
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "32px 32px", overflow: "auto", minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0C0C0C", marginBottom: 4 }}>
              {tab === "leads" ? "Lead Management" : "Analytics Dashboard"}
            </h1>
            <p style={{ fontSize: 13, color: "#999" }}>MAI Infra Consultants LLP</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={refresh} style={{ padding: "9px 16px", background: "#fff", border: "1px solid #e8e4dc", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#666", fontFamily: "Outfit,sans-serif", transition: "all 0.2s" }}>🔄 Refresh</button>
            <button onClick={exportCSV} style={{ padding: "9px 18px", background: "#C9A96E", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "Outfit,sans-serif" }}>⬇ Export CSV</button>
          </div>
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { l: "Total Leads", v: leads.length, c: "#C9A96E", ic: "👤" },
            { l: "This Month", v: thisMonth.length, c: "#3B82F6", ic: "📅" },
            { l: "Residential", v: leads.filter(l => l.requirement?.includes("Residential")).length, c: "#10B981", ic: "🏠" },
            { l: "Commercial", v: leads.filter(l => l.requirement?.includes("Commercial")).length, c: "#8B5CF6", ic: "🏢" },
          ].map(({ l, v, c, ic }) => (
            <div key={l} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderTop: `3px solid ${c}` }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{ic}</div>
              <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 36, fontWeight: 700, color: c, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Leads Tab */}
        {tab === "leads" && (
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0ede8", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0C0C0C" }}>All Leads ({filtered.length})</h2>
              <input className="f-inp" placeholder="🔍 Search leads..." value={q} onChange={e => setQ(e.target.value)} style={{ width: 220, padding: "8px 14px", fontSize: 13 }} />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Phone</th><th>Requirement</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={6} style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>No leads found{q && ` matching "${q}"`}</td></tr>
                    : filtered.map((l, i) => (
                      <tr key={l.id}>
                        <td style={{ color: "#ccc", fontSize: 12, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</td>
                        <td style={{ fontWeight: 600, color: "#0C0C0C" }}>{l.name}</td>
                        <td><a href={`tel:${l.phone}`} style={{ color: "#1B3A6B", textDecoration: "none", fontWeight: 500 }}>{l.phone}</a></td>
                        <td>
                          <span style={{ background: "#F5F3EF", color: "#555", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{l.requirement}</span>
                        </td>
                        <td style={{ color: "#aaa", fontSize: 13 }}>{new Date(l.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td>
                          {delId === l.id ? (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => del(l.id)} style={{ padding: "5px 12px", background: "#dc2626", border: "none", borderRadius: 5, color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "Outfit,sans-serif" }}>Confirm</button>
                              <button onClick={() => setDelId(null)} style={{ padding: "5px 12px", background: "#f4f4f2", border: "none", borderRadius: 5, color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "Outfit,sans-serif" }}>Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDelId(l.id)} style={{ padding: "5px 12px", background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 5, color: "#dc2626", fontSize: 11, cursor: "pointer", fontFamily: "Outfit,sans-serif", transition: "all 0.2s" }}>Delete</button>
                          )}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24, color: "#0C0C0C" }}>Leads by Requirement</h3>
              {leads.length === 0 ? <p style={{ color: "#bbb", fontSize: 14 }}>No data yet.</p> :
                Object.entries(reqCounts).sort((a, b) => b[1] - a[1]).map(([req, cnt]) => {
                  const pct = Math.round((cnt / leads.length) * 100);
                  return (
                    <div key={req} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: "#555" }}>{req}</span>
                        <span style={{ fontWeight: 700, color: "#0C0C0C" }}>{cnt} <span style={{ color: "#aaa", fontWeight: 400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height: 7, background: "#F5F3EF", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#C9A96E,#E8D5B0)", borderRadius: 4, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
                      </div>
                    </div>
                  );
                })
              }
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24, color: "#0C0C0C" }}>Summary Stats</h3>
              {[
                { l: "First Lead Received", v: leads.length ? new Date([...leads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0].createdAt).toLocaleDateString("en-IN") : "—" },
                { l: "Most Recent Lead", v: leads[0] ? new Date(leads[0].createdAt).toLocaleDateString("en-IN") : "—" },
                { l: "Total This Month", v: thisMonth.length },
                { l: "Conversion Pipeline", v: `${leads.length} enquiries` },
                { l: "Top Requirement", v: leads.length ? (Object.entries(reqCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—") : "—" },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #f5f3ef" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0C0C0C" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Recent leads mini */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24, color: "#0C0C0C" }}>5 Most Recent Leads</h3>
              {leads.slice(0, 5).map(l => (
                <div key={l.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F3EF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#C9A96E", flexShrink: 0 }}>
                    {l.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0C0C0C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{l.requirement}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#ccc", flexShrink: 0 }}>{new Date(l.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                </div>
              ))}
              {leads.length === 0 && <p style={{ color: "#bbb", fontSize: 14 }}>No leads yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────────────────
function Landing({ onAdmin }) {
  return (
    <>
      <Navbar onAdmin={onAdmin} />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer onAdmin={onAdmin} />
      <FloatingBtns />
    </>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("preloader"); // preloader | main | adminLogin | admin
  const [authed, setAuthed] = useState(false);

  useEffect(() => { injectCSS(); }, []);

  if (screen === "preloader") return <Preloader onDone={() => setScreen("main")} />;
  if (screen === "adminLogin") return (
    <AdminLogin
      onLogin={() => { setAuthed(true); setScreen("admin"); }}
      onBack={() => setScreen("main")}
    />
  );
  if (screen === "admin" && authed) return <AdminDash onLogout={() => { setAuthed(false); setScreen("main"); }} />;
  return <Landing onAdmin={() => setScreen("adminLogin")} />;
}